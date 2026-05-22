// ============================================================
// 🔐 Autenticação JWT — Kainow One
// ============================================================

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kainow-one-super-secret-2026-change-in-production'
)
const JWT_EXPIRES = '7d'

export interface UserPayload extends JWTPayload {
  id: string
  email: string
  name: string
  role: 'user' | 'seller' | 'admin'
}

// ── Assinar token ────────────────────────────────────────────
export async function signToken(payload: Omit<UserPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES)
    .setIssuer('kainow-one')
    .setAudience('kainow-users')
    .sign(JWT_SECRET)
}

// ── Verificar token ──────────────────────────────────────────
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'kainow-one',
      audience: 'kainow-users',
    })
    return payload as UserPayload
  } catch {
    return null
  }
}

// ── Extrair token do cookie ──────────────────────────────────
export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/kainow_token=([^;]+)/)
  return match ? match[1] : null
}

// ── Regras de senha forte ────────────────────────────────────
export interface PasswordStrength {
  score: number       // 0-4
  label: 'Muito fraca' | 'Fraca' | 'Média' | 'Forte' | 'Muito forte'
  color: string
  suggestions: string[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const suggestions: string[] = []
  let score = 0

  if (password.length >= 8)  score++; else suggestions.push('Use pelo menos 8 caracteres')
  if (password.length >= 12) score++; else suggestions.push('Use 12+ caracteres para maior segurança')
  if (/[A-Z]/.test(password)) score++; else suggestions.push('Adicione letras maiúsculas')
  if (/[0-9]/.test(password)) score++; else suggestions.push('Adicione números')
  if (/[^A-Za-z0-9]/.test(password)) score++; else suggestions.push('Adicione caracteres especiais (!@#$...)')

  const labels: PasswordStrength['label'][] = ['Muito fraca','Fraca','Média','Forte','Muito forte']
  const colors = ['bg-red-500','bg-orange-500','bg-yellow-500','bg-blue-500','bg-green-500']

  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    color: colors[Math.min(score, 4)],
    suggestions: suggestions.slice(0, 2),
  }
}

// ── Validar e-mail ───────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Validar CPF (dígitos verificadores) ──────────────────────
export function validateCPF(cpf: string): boolean {
  const c = cpf.replace(/\D/g, '')
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i)
  let rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(c[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  return rest === parseInt(c[10])
}

// ── Formatar CPF ─────────────────────────────────────────────
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}
