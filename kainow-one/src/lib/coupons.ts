// ============================================================
// 🎁 Sistema de Cupons e Vouchers — Kainow One
// ============================================================

export type CouponType = 'percent' | 'fixed' | 'freeShipping' | 'giftcard'

export interface Coupon {
  code: string
  type: CouponType
  value: number          // percentual (0-100) ou valor fixo em R$
  minOrder: number       // pedido mínimo para aplicar
  maxDiscount?: number   // teto de desconto (para % alto)
  description: string
  expiresAt: string      // ISO date
  usageLimit: number     // quantas vezes pode ser usado
  usedCount: number
  active: boolean
  categories?: string[]  // restrito a certas categorias
}

export interface CouponResult {
  valid: boolean
  discount: number
  message: string
  coupon?: Coupon
}

// Base de cupons mockada (em produção viria do banco)
export const COUPONS: Coupon[] = [
  {
    code: 'KAINOW10',
    type: 'percent',
    value: 10,
    minOrder: 100,
    maxDiscount: 200,
    description: '10% de desconto em todo o site',
    expiresAt: '2026-12-31',
    usageLimit: 9999,
    usedCount: 1240,
    active: true,
  },
  {
    code: 'BEMVINDO50',
    type: 'fixed',
    value: 50,
    minOrder: 200,
    description: 'R$ 50 de desconto para novos usuários',
    expiresAt: '2026-12-31',
    usageLimit: 1,
    usedCount: 0,
    active: true,
  },
  {
    code: 'FRETEGRATIS',
    type: 'freeShipping',
    value: 0,
    minOrder: 0,
    description: 'Frete grátis em qualquer pedido',
    expiresAt: '2026-12-31',
    usageLimit: 9999,
    usedCount: 542,
    active: true,
  },
  {
    code: 'TECH20',
    type: 'percent',
    value: 20,
    minOrder: 500,
    maxDiscount: 500,
    description: '20% OFF em Eletrônicos e Informática',
    expiresAt: '2026-06-30',
    usageLimit: 500,
    usedCount: 312,
    active: true,
    categories: ['eletronicos', 'informatica'],
  },
  {
    code: 'BLACKFRIDAY',
    type: 'percent',
    value: 30,
    minOrder: 300,
    maxDiscount: 1000,
    description: 'Black Friday — 30% OFF',
    expiresAt: '2025-11-30',
    usageLimit: 2000,
    usedCount: 1998,
    active: false, // expirado
  },
  {
    code: 'VERAO25',
    type: 'fixed',
    value: 25,
    minOrder: 150,
    description: 'R$ 25 OFF na coleção de verão',
    expiresAt: '2026-03-31',
    usageLimit: 300,
    usedCount: 89,
    active: true,
    categories: ['moda', 'esportes'],
  },
]

// ── Validação principal ──────────────────────────────────────
export function validateCoupon(
  code: string,
  orderTotal: number,
  categoryId?: string
): CouponResult {
  const coupon = COUPONS.find(c => c.code === code.toUpperCase().trim())

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Cupom não encontrado.' }
  }

  if (!coupon.active) {
    return { valid: false, discount: 0, message: 'Este cupom está inativo ou expirado.' }
  }

  const now = new Date()
  const expiry = new Date(coupon.expiresAt)
  if (now > expiry) {
    return { valid: false, discount: 0, message: 'Cupom vencido.' }
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: 'Cupom esgotado.' }
  }

  if (orderTotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Pedido mínimo de R$ ${coupon.minOrder.toFixed(2)} para usar este cupom.`,
    }
  }

  if (coupon.categories && categoryId && !coupon.categories.includes(categoryId)) {
    return {
      valid: false,
      discount: 0,
      message: `Cupom válido apenas para: ${coupon.categories.join(', ')}.`,
    }
  }

  // Calcular desconto
  let discount = 0
  if (coupon.type === 'percent') {
    discount = (orderTotal * coupon.value) / 100
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, orderTotal)
  } else if (coupon.type === 'freeShipping') {
    discount = 0 // aplicado como frete grátis no checkout
  }

  return {
    valid: true,
    discount: parseFloat(discount.toFixed(2)),
    message:
      coupon.type === 'freeShipping'
        ? '✅ Frete grátis aplicado!'
        : `✅ Desconto de R$ ${discount.toFixed(2)} aplicado!`,
    coupon,
  }
}

// ── Gerar código único de gift card ─────────────────────────
export function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segments = 4
  const segLen = 4
  return Array.from({ length: segments }, () =>
    Array.from({ length: segLen }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  ).join('-')
}
