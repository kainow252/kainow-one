// ============================================================
// 🎁 Sistema de Gift Cards — Kainow One
// ============================================================

import { generateGiftCardCode } from './coupons'

export type GiftCardStatus = 'active' | 'redeemed' | 'expired' | 'cancelled'

export interface GiftCard {
  id: string
  code: string              // ex: KNWG-A3B2-X9Y1-4Z5W
  value: number             // valor em R$
  balance: number           // saldo atual
  status: GiftCardStatus
  purchasedBy: string       // userId do comprador
  recipientEmail?: string   // e-mail do presenteado
  recipientName?: string
  message?: string          // mensagem personalizada
  createdAt: string
  expiresAt: string
  redeemedAt?: string
  redeemedBy?: string
  transactions: GiftCardTransaction[]
}

export interface GiftCardTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  orderId?: string
  createdAt: string
}

// Store mockado em memória (em produção: banco de dados)
export const GIFT_CARDS: GiftCard[] = [
  {
    id: 'gc_001',
    code: 'KNWG-A3B2-X9Y1-4Z5W',
    value: 100,
    balance: 100,
    status: 'active',
    purchasedBy: 'user_demo',
    recipientEmail: 'amigo@email.com',
    recipientName: 'Amigo Especial',
    message: 'Feliz aniversário! 🎂',
    createdAt: '2026-01-15T10:00:00Z',
    expiresAt: '2027-01-15T23:59:59Z',
    transactions: [
      { id: 'tx_1', type: 'credit', amount: 100, description: 'Compra de gift card', createdAt: '2026-01-15T10:00:00Z' },
    ],
  },
  {
    id: 'gc_002',
    code: 'KNWG-Q7R5-M2N8-9PL3',
    value: 50,
    balance: 20,
    status: 'active',
    purchasedBy: 'user_demo',
    createdAt: '2026-02-01T08:00:00Z',
    expiresAt: '2027-02-01T23:59:59Z',
    transactions: [
      { id: 'tx_2', type: 'credit', amount: 50, description: 'Compra de gift card', createdAt: '2026-02-01T08:00:00Z' },
      { id: 'tx_3', type: 'debit', amount: 30, description: 'Pedido #KNW-8821', orderId: 'KNW-8821', createdAt: '2026-03-10T14:22:00Z' },
    ],
  },
]

// ── Buscar gift card pelo código ─────────────────────────────
export function findGiftCard(code: string): GiftCard | null {
  return GIFT_CARDS.find(gc => gc.code === code.toUpperCase().trim()) ?? null
}

// ── Validar e consultar saldo ────────────────────────────────
export interface GiftCardCheckResult {
  valid: boolean
  balance: number
  message: string
  giftCard?: GiftCard
}

export function checkGiftCard(code: string): GiftCardCheckResult {
  const gc = findGiftCard(code)

  if (!gc) return { valid: false, balance: 0, message: 'Gift card não encontrado.' }

  if (gc.status === 'redeemed') return { valid: false, balance: 0, message: 'Gift card já foi totalmente utilizado.' }
  if (gc.status === 'cancelled') return { valid: false, balance: 0, message: 'Gift card cancelado.' }
  if (gc.status === 'expired') return { valid: false, balance: 0, message: 'Gift card expirado.' }

  if (new Date() > new Date(gc.expiresAt)) {
    gc.status = 'expired'
    return { valid: false, balance: 0, message: 'Gift card expirado.' }
  }

  if (gc.balance <= 0) return { valid: false, balance: 0, message: 'Saldo zerado neste gift card.' }

  return {
    valid: true,
    balance: gc.balance,
    message: `✅ Saldo disponível: R$ ${gc.balance.toFixed(2)}`,
    giftCard: gc,
  }
}

// ── Aplicar gift card num pedido ─────────────────────────────
export function applyGiftCard(
  code: string,
  orderTotal: number,
  orderId: string
): { success: boolean; applied: number; remaining: number; message: string } {
  const result = checkGiftCard(code)
  if (!result.valid || !result.giftCard) {
    return { success: false, applied: 0, remaining: orderTotal, message: result.message }
  }

  const gc = result.giftCard
  const applied = Math.min(gc.balance, orderTotal)
  gc.balance -= applied

  gc.transactions.push({
    id: `tx_${Date.now()}`,
    type: 'debit',
    amount: applied,
    description: `Pedido #${orderId}`,
    orderId,
    createdAt: new Date().toISOString(),
  })

  if (gc.balance === 0) {
    gc.status = 'redeemed'
    gc.redeemedAt = new Date().toISOString()
  }

  return {
    success: true,
    applied,
    remaining: orderTotal - applied,
    message: `✅ R$ ${applied.toFixed(2)} do gift card aplicado!`,
  }
}

// ── Criar novo gift card ─────────────────────────────────────
export function createGiftCard(params: {
  value: number
  purchasedBy: string
  recipientEmail?: string
  recipientName?: string
  message?: string
}): GiftCard {
  const code = generateGiftCardCode()
  const now = new Date()
  const expires = new Date(now)
  expires.setFullYear(expires.getFullYear() + 1)

  const gc: GiftCard = {
    id: `gc_${Date.now()}`,
    code: `KNWG-${code}`,
    value: params.value,
    balance: params.value,
    status: 'active',
    purchasedBy: params.purchasedBy,
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    message: params.message,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    transactions: [
      {
        id: `tx_${Date.now()}`,
        type: 'credit',
        amount: params.value,
        description: 'Compra de gift card',
        createdAt: now.toISOString(),
      },
    ],
  }

  GIFT_CARDS.push(gc)
  return gc
}

// ── Valores pré-definidos de gift cards ──────────────────────
export const GIFT_CARD_VALUES = [25, 50, 100, 150, 200, 300, 500]
