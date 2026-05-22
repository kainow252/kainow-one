// ============================================================
// 💳 Validação de Cartão de Crédito — Algoritmo de Luhn
// ============================================================

export type CardBrand =
  | 'Visa'
  | 'Mastercard'
  | 'Amex'
  | 'Elo'
  | 'Hipercard'
  | 'Diners'
  | 'Discover'
  | 'Desconhecido'

export interface CardValidationResult {
  valid: boolean
  brand: CardBrand
  masked: string       // ex: **** **** **** 1234
  errors: string[]
}

// ── Detectar bandeira pelo número ───────────────────────────
export function detectCardBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, '')

  if (/^4/.test(n)) return 'Visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'Amex'
  if (/^6(?:011|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d|9(?:[01]\d|2[0-5]))|5\d{2})\d/.test(n)) return 'Discover'
  if (/^3(?:0[0-5]|[68])/.test(n)) return 'Diners'
  if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(65003[1-3]|6500[3-4]\d|65004[5-8]\d|6500[5-9]\d|6501[0-9]\d|6502[0-9]\d|6504[0-9]\d|6505[0-9]\d|6506[0-9]\d|6507[0-1]\d|65072[0-7]|6509[0-9]\d|6516[5-7]\d|6550[0-9]\d|6551[0-9]\d|65520\d|6553[0-9]\d|6556[0-9]\d|6557[0-9]\d|6558[0-9]\d|6559[0-9]\d|6560[0-9]\d|6561[0-9]\d|6562[0-9]\d|6563[0-9]\d|6564[0-9]\d))/.test(n)) return 'Elo'
  if (/^(606282|3841[046]0)/.test(n)) return 'Hipercard'

  return 'Desconhecido'
}

// ── Algoritmo de Luhn ────────────────────────────────────────
export function luhnCheck(number: string): boolean {
  const digits = number.replace(/\D/g, '').split('').reverse().map(Number)
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i]
    if (i % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

// ── Validar data de validade ─────────────────────────────────
export function validateExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2,4})$/)
  if (!match) return false

  const month = parseInt(match[1], 10)
  const yearRaw = match[2]
  const year = yearRaw.length === 2 ? 2000 + parseInt(yearRaw, 10) : parseInt(yearRaw, 10)

  if (month < 1 || month > 12) return false

  const now = new Date()
  const expDate = new Date(year, month) // primeiro dia do mês seguinte
  return expDate > now
}

// ── Validar CVV ──────────────────────────────────────────────
export function validateCVV(cvv: string, brand: CardBrand): boolean {
  const digits = cvv.replace(/\D/g, '')
  if (brand === 'Amex') return digits.length === 4
  return digits.length === 3
}

// ── Máscara de formatação ────────────────────────────────────
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function maskCardNumber(number: string): string {
  const digits = number.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  return `**** **** **** ${last4}`
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ── Validação completa ───────────────────────────────────────
export function validateCard(
  number: string,
  expiry: string,
  cvv: string,
  holderName: string
): CardValidationResult {
  const errors: string[] = []
  const brand = detectCardBrand(number)

  if (!luhnCheck(number)) {
    errors.push('Número de cartão inválido.')
  }
  if (!validateExpiry(expiry)) {
    errors.push('Data de validade inválida ou cartão vencido.')
  }
  if (!validateCVV(cvv, brand)) {
    errors.push(`CVV inválido para cartão ${brand}.`)
  }
  if (holderName.trim().split(' ').length < 2) {
    errors.push('Informe o nome completo como no cartão.')
  }

  return {
    valid: errors.length === 0,
    brand,
    masked: maskCardNumber(number),
    errors,
  }
}

// ── Ícone/cor por bandeira ───────────────────────────────────
export function getCardBrandInfo(brand: CardBrand): { emoji: string; color: string } {
  const map: Record<CardBrand, { emoji: string; color: string }> = {
    Visa:         { emoji: '💙', color: 'text-blue-700' },
    Mastercard:   { emoji: '🔴', color: 'text-red-600' },
    Amex:         { emoji: '💚', color: 'text-green-700' },
    Elo:          { emoji: '🟡', color: 'text-yellow-600' },
    Hipercard:    { emoji: '❤️', color: 'text-red-500' },
    Diners:       { emoji: '⚫', color: 'text-gray-700' },
    Discover:     { emoji: '🟠', color: 'text-orange-600' },
    Desconhecido: { emoji: '💳', color: 'text-gray-400' },
  }
  return map[brand]
}
