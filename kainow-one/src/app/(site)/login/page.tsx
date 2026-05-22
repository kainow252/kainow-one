'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, UserPlus, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { validateEmail, validateCPF, formatCPF, checkPasswordStrength } from '@/lib/auth'

export default function LoginPage() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'cadastro'>('login')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regCpf, setRegCpf] = useState('')

  const pwStrength = checkPasswordStrength(regPassword)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validateEmail(loginEmail)) { setError('E-mail inválido.'); return }
    if (!loginPassword) { setError('Informe a senha.'); return }
    setLoading(true)
    const result = await login(loginEmail, loginPassword)
    setLoading(false)
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Erro ao entrar.')
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (regName.trim().split(' ').length < 2) { setError('Informe nome e sobrenome.'); return }
    if (!validateEmail(regEmail)) { setError('E-mail inválido.'); return }
    if (!validateCPF(regCpf.replace(/\D/g, ''))) { setError('CPF inválido.'); return }
    if (pwStrength.score < 2) { setError('Senha muito fraca. ' + pwStrength.suggestions[0]); return }

    setLoading(true)
    const result = await register(regName, regEmail, regPassword, regCpf)
    setLoading(false)
    if (result.success) {
      setSuccess('Conta criada com sucesso! Redirecionando...')
      setTimeout(() => router.push('/'), 1500)
    } else {
      setError(result.error || 'Erro ao criar conta.')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-yellow-400 font-black text-3xl">K</span>
            </div>
            <span className="font-black text-blue-800 text-xl">Kainow One</span>
            <span className="text-gray-400 text-xs">O marketplace de todos</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {([['login', 'Entrar', <LogIn size={15} />], ['cadastro', 'Criar conta', <UserPlus size={15} />]] as const).map(([id, label, icon]) => (
              <button key={id} onClick={() => { setTab(id); setError(''); setSuccess('') }}
                className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold text-sm transition border-b-2 ${tab === id ? 'text-blue-700 border-blue-700 bg-blue-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                {icon}{label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Alerts */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
                <ShieldCheck size={16} className="flex-shrink-0" /> {success}
              </div>
            )}

            {/* LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-11" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <a href="#" className="text-xs text-blue-700 hover:underline">Esqueci minha senha</a>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 text-center">
                  <strong>Demo:</strong> joao@kainow.com · Senha@123
                </div>
              </form>
            )}

            {/* CADASTRO */}
            {tab === 'cadastro' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Nome completo</label>
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                    placeholder="João da Silva"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 transition ${regEmail && !validateEmail(regEmail) ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                  {regEmail && !validateEmail(regEmail) && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">CPF</label>
                  <input type="text" value={regCpf}
                    onChange={e => setRegCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00" maxLength={14}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 transition ${regCpf.length === 14 && !validateCPF(regCpf.replace(/\D/g, '')) ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                  {regCpf.length === 14 && !validateCPF(regCpf.replace(/\D/g, '')) && <p className="text-red-500 text-xs mt-1">CPF inválido</p>}
                  {regCpf.length === 14 && validateCPF(regCpf.replace(/\D/g, '')) && <p className="text-green-600 text-xs mt-1">✓ CPF válido</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-11" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {regPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0,1,2,3,4].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwStrength.score ? pwStrength.color : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{pwStrength.label}
                        {pwStrength.suggestions[0] && <span className="text-gray-400"> · {pwStrength.suggestions[0]}</span>}
                      </p>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-blue-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  {loading ? 'Criando conta...' : 'Criar minha conta'}
                </button>
              </form>
            )}

            {/* OAuth */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">ou continue com</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Google', 'https://www.google.com/favicon.ico'], ['Facebook', 'https://www.facebook.com/favicon.ico']].map(([name, ico]) => (
                <button key={name} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  <img src={ico} alt={name} className="w-4 h-4" />{name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-400">
          <ShieldCheck size={13} className="text-green-500" />
          Conexão segura · SSL · Seus dados são protegidos
        </div>
      </div>
    </div>
  )
}
