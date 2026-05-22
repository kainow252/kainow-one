// ============================================================
// 🔒 Anti-Fraude — Kainow One
// ============================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface FraudSignal {
  code: string
  description: string
  weight: number   // 1-10 — peso no score total
}

export interface FraudCheckResult {
  riskLevel: RiskLevel
  score: number          // 0-100
  blocked: boolean
  signals: FraudSignal[]
  recommendation: string
  requiresReview: boolean
}

export interface OrderContext {
  userId?: string
  email?: string
  ip?: string
  cardLastFour?: string
  cardBrand?: string
  orderTotal: number
  itemCount: number
  shippingAddress?: {
    city?: string
    state?: string
    country?: string
  }
  userAgent?: string
  sessionId?: string
  isFirstOrder?: boolean
  accountAgeHours?: number
  previousOrders?: number
  failedPaymentAttempts?: number
}

// ── Rate Limiter em memória ──────────────────────────────────
const rateLimitStore: Map<string, { count: number; windowStart: number }> = new Map()

export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  entry.count++
  const resetIn = windowMs - (now - entry.windowStart)

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetIn }
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetIn }
}

// ── Lista negra mock (IPs e e-mails bloqueados) ──────────────
const BLOCKED_IPS = new Set(['1.2.3.4', '5.6.7.8'])
const BLOCKED_EMAILS = new Set(['fraud@spam.com', 'test@test.com'])
const HIGH_RISK_COUNTRIES = new Set(['XX', 'ZZ']) // países de alto risco

// ── Motor de análise de fraude ───────────────────────────────
export function analyzeFraudRisk(ctx: OrderContext): FraudCheckResult {
  const signals: FraudSignal[] = []
  let score = 0

  // 1. IP bloqueado
  if (ctx.ip && BLOCKED_IPS.has(ctx.ip)) {
    signals.push({ code: 'BLOCKED_IP', description: 'IP na lista negra', weight: 10 })
    score += 40
  }

  // 2. E-mail bloqueado
  if (ctx.email && BLOCKED_EMAILS.has(ctx.email.toLowerCase())) {
    signals.push({ code: 'BLOCKED_EMAIL', description: 'E-mail na lista negra', weight: 10 })
    score += 40
  }

  // 3. Conta muito nova
  if (ctx.accountAgeHours !== undefined && ctx.accountAgeHours < 1) {
    signals.push({ code: 'NEW_ACCOUNT', description: 'Conta criada há menos de 1 hora', weight: 7 })
    score += 25
  } else if (ctx.accountAgeHours !== undefined && ctx.accountAgeHours < 24) {
    signals.push({ code: 'YOUNG_ACCOUNT', description: 'Conta criada há menos de 24h', weight: 4 })
    score += 10
  }

  // 4. Primeiro pedido de alto valor
  if (ctx.isFirstOrder && ctx.orderTotal > 2000) {
    signals.push({ code: 'HIGH_VALUE_FIRST_ORDER', description: 'Primeiro pedido de alto valor', weight: 6 })
    score += 20
  }

  // 5. Muitas tentativas de pagamento falhas
  if (ctx.failedPaymentAttempts && ctx.failedPaymentAttempts >= 3) {
    signals.push({ code: 'MULTIPLE_FAILURES', description: `${ctx.failedPaymentAttempts} tentativas falhas de pagamento`, weight: 8 })
    score += 30
  }

  // 6. Pedido muito alto em uma única sessão
  if (ctx.orderTotal > 10000) {
    signals.push({ code: 'VERY_HIGH_VALUE', description: 'Valor de pedido muito alto', weight: 5 })
    score += 15
  } else if (ctx.orderTotal > 5000) {
    signals.push({ code: 'HIGH_VALUE', description: 'Pedido de alto valor', weight: 3 })
    score += 8
  }

  // 7. Muitos itens únicos
  if (ctx.itemCount > 20) {
    signals.push({ code: 'MANY_ITEMS', description: 'Quantidade incomum de itens', weight: 3 })
    score += 8
  }

  // 8. País de alto risco
  if (ctx.shippingAddress?.country && HIGH_RISK_COUNTRIES.has(ctx.shippingAddress.country)) {
    signals.push({ code: 'HIGH_RISK_COUNTRY', description: 'Entrega para país de alto risco', weight: 7 })
    score += 20
  }

  // 9. Sem histórico de pedidos, mas compra cara
  if (ctx.previousOrders === 0 && ctx.orderTotal > 1000) {
    signals.push({ code: 'NO_HISTORY_HIGH_VALUE', description: 'Sem histórico + alto valor', weight: 4 })
    score += 12
  }

  // 10. Rate limit de tentativas de checkout
  if (ctx.sessionId) {
    const rl = checkRateLimit(`checkout_${ctx.sessionId}`, 3, 300_000)
    if (!rl.allowed) {
      signals.push({ code: 'RATE_LIMIT_CHECKOUT', description: 'Muitas tentativas de checkout', weight: 9 })
      score += 35
    }
  }

  // Normalizar score para 0-100
  score = Math.min(score, 100)

  // Determinar nível de risco
  let riskLevel: RiskLevel
  let blocked = false
  let recommendation = ''
  let requiresReview = false

  if (score >= 70) {
    riskLevel = 'critical'
    blocked = true
    recommendation = 'Transação bloqueada automaticamente. Entre em contato com o suporte.'
  } else if (score >= 45) {
    riskLevel = 'high'
    requiresReview = true
    recommendation = 'Pedido retido para revisão manual. Podemos solicitar documentos adicionais.'
  } else if (score >= 25) {
    riskLevel = 'medium'
    requiresReview = false
    recommendation = 'Transação monitorada. Confirme seus dados antes de prosseguir.'
  } else {
    riskLevel = 'low'
    recommendation = 'Transação aprovada. Tudo certo!'
  }

  return { riskLevel, score, blocked, signals, recommendation, requiresReview }
}

// ── Cor por nível de risco ────────────────────────────────────
export function getRiskColor(level: RiskLevel): string {
  return {
    low:      'text-green-600 bg-green-50 border-green-200',
    medium:   'text-yellow-700 bg-yellow-50 border-yellow-200',
    high:     'text-orange-700 bg-orange-50 border-orange-200',
    critical: 'text-red-700 bg-red-50 border-red-200',
  }[level]
}

export function getRiskEmoji(level: RiskLevel): string {
  return { low: '✅', medium: '⚠️', high: '🔶', critical: '🚨' }[level]
}
