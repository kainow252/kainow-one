'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Truck, MapPin, Package, DollarSign, Star, LogOut,
  CheckCircle, XCircle, Clock, Bell, Navigation, Phone,
  TrendingUp, BarChart2, Wallet, User, Settings, Menu, X,
  AlertCircle, ChevronRight, RefreshCw, Shield, FileText,
  Zap, Award, Coffee, Battery, Radio, ArrowUpRight,
  Camera, Mail, Car, Bike,
} from 'lucide-react'
import {
  mockEntregadores, mockCorridas, type Entregador,
  type Corrida, fmtBRL, fmtDist, labelStatusEntregador,
  type StatusEntregador, configPlataforma, calcGanhoEntregador,
} from '@/lib/ecosystem'

// ══════════════════════════════════════════════════════════
// ÍCONE DE VEÍCULO
// ══════════════════════════════════════════════════════════

function VeiculoIcon({ tipo }: { tipo: string }) {
  const map: Record<string, string> = {
    moto: '🏍️', carro: '🚗', bicicleta: '🚲', a_pe: '🚶'
  }
  return <span>{map[tipo] ?? '🏍️'}</span>
}

// ══════════════════════════════════════════════════════════
// MINI MAPA SIMULADO
// ══════════════════════════════════════════════════════════

function MapaSimulado({ corrida, fase }: { corrida: Corrida; fase: 'coleta' | 'entrega' }) {
  const destino = fase === 'coleta' ? corrida.lojistaEndereco : corrida.clienteEndereco
  const destLabel = fase === 'coleta' ? '🏪 Lojista' : '🏠 Cliente'
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 text-center">
      <div className="text-4xl mb-2">🗺️</div>
      <p className="font-bold text-emerald-800 text-sm">Navegar para {destLabel}</p>
      <p className="text-xs text-emerald-600 mt-1 leading-relaxed">{destino}</p>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs font-semibold text-emerald-700">
        <span>📍 {fmtDist(corrida.distanciaKm)}</span>
        <span>⏱️ ~{Math.round(corrida.distanciaKm * 3 + 5)} min</span>
      </div>
      <button className="mt-3 w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2">
        <Navigation size={15}/> Abrir GPS
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════

export default function EntregadorPage() {
  // ── Auth ──
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [entregador, setEntregador] = useState<Entregador | null>(null)

  // ── Navegação ──
  const [activeTab, setActiveTab] = useState<string>('corridas')
  const [sidebarOpen, setSidebarOpen] = useState(false)  // mobile: fechado por padrão

  // ── Estado da corrida ──
  const [corridas, setCorridas] = useState<Corrida[]>(mockCorridas)
  const [corridaAtiva, setCorridaAtiva] = useState<Corrida | null>(null)
  const [faseEntrega, setFaseEntrega] = useState<'coleta' | 'entrega'>('coleta')
  const [online, setOnline] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  // ── Ganhos do dia (mock) ──
  const [ganhosHoje, setGanhosHoje] = useState(87.50)
  const [entregasHoje, setEntregasHoje] = useState(6)

  useEffect(() => {
    const saved = sessionStorage.getItem('kainow_entregador')
    if (saved) {
      const e = mockEntregadores.find(x => x.id === saved)
      if (e) { setEntregador(e); setLoggedIn(true) }
    }
  }, [])

  function toast_(msg: string) {
    setToast(msg); setTimeout(() => setToast(null), 3500)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const found = mockEntregadores.find(
      x => x.email === loginEmail && (x as any).senha === loginPass
    )
    // demo: aceita qualquer entregador com senha Moto@2026
    const found2 = loginPass === 'Moto@2026'
      ? mockEntregadores.find(x => x.email === loginEmail)
      : null
    const ent = found || found2
    if (ent) {
      setEntregador(ent); setLoggedIn(true)
      sessionStorage.setItem('kainow_entregador', ent.id)
    } else {
      setLoginError('Email ou senha incorretos.')
    }
  }

  // ── Corridas disponíveis (não aceitas, no estado do entregador) ──
  const corridasDisponiveis = useMemo(() =>
    corridas.filter(c => c.status === 'disponivel'),
    [corridas]
  )

  const corridasHistorico = useMemo(() =>
    corridas.filter(c => c.status === 'entregue' || c.status === 'cancelada'),
    [corridas]
  )

  // ── Aceitar corrida ──
  function aceitarCorrida(c: Corrida) {
    if (!online) { toast_('⚠️ Você está offline! Fique online para aceitar corridas.'); return }
    if (corridaAtiva) { toast_('⚠️ Você já tem uma corrida em andamento!'); return }
    setCorridas(prev => prev.map(x => x.id === c.id
      ? { ...x, status: 'aceita', entregadorId: entregador!.id, aceitoEm: '2026-05-20 agora' } : x
    ))
    setCorridaAtiva({ ...c, status: 'aceita', entregadorId: entregador!.id })
    setFaseEntrega('coleta')
    setActiveTab('corrida_ativa')
    toast_('✅ Corrida aceita! Vá até o lojista buscar o pedido.')
  }

  // ── Confirmar coleta ──
  function confirmarColeta() {
    if (!corridaAtiva) return
    const updated = { ...corridaAtiva, status: 'coletada' as const, coletadoEm: '2026-05-20 agora' }
    setCorridas(prev => prev.map(x => x.id === corridaAtiva.id ? updated : x))
    setCorridaAtiva(updated)
    setFaseEntrega('entrega')
    toast_('📦 Coleta confirmada! Agora vá entregar ao cliente.')
  }

  // ── Confirmar entrega ──
  function confirmarEntrega() {
    if (!corridaAtiva) return
    const ganho = corridaAtiva.ganhoEntregador
    setCorridas(prev => prev.map(x => x.id === corridaAtiva.id
      ? { ...x, status: 'entregue', entregueEm: '2026-05-20 agora' } : x
    ))
    setCorridaAtiva(null)
    setGanhosHoje(v => v + ganho)
    setEntregasHoje(v => v + 1)
    setActiveTab('corridas')
    toast_(`🎉 Entrega finalizada! +${fmtBRL(ganho)} adicionado ao seu saldo.`)
  }

  // ── Cancelar corrida ──
  function cancelarCorrida() {
    if (!corridaAtiva) return
    setCorridas(prev => prev.map(x => x.id === corridaAtiva.id
      ? { ...x, status: 'disponivel', entregadorId: null, aceitoEm: undefined } : x
    ))
    setCorridaAtiva(null)
    setActiveTab('corridas')
    toast_('❌ Corrida cancelada. Isso afeta sua taxa de aceitação.')
  }

  // ══════════════════════════════════════════════════════════
  // TELA DE LOGIN
  // ══════════════════════════════════════════════════════════

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
              <Truck size={28} className="text-white"/>
            </div>
            <h1 className="text-2xl font-black text-gray-900">App do Entregador</h1>
            <p className="text-gray-500 text-sm mt-1">Kainow One — Seja seu próprio chefe</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Credenciais demo */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-6 text-xs text-indigo-800">
              <p className="font-bold mb-1">🔑 Credenciais de demonstração:</p>
              <p>Email: <code className="bg-indigo-100 px-1 rounded">entregador@lucas.com</code></p>
              <p>Senha: <code className="bg-indigo-100 px-1 rounded">Moto@2026</code></p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Senha</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/>
                </div>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle size={15}/> {loginError}
                </div>
              )}
              <button type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-indigo-200">
                Entrar como Entregador
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-indigo-600">80%</p>
                  <p>você fica com</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-indigo-600">Free</p>
                  <p>seja freelancer</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-indigo-600">24h</p>
                  <p>pague quando quiser</p>
                </div>
              </div>
              <Link href="/" className="block text-center text-xs text-gray-400 hover:text-indigo-500 transition">
                ← Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // APP PRINCIPAL
  // ══════════════════════════════════════════════════════════

  const tabs = [
    { id: 'corridas',       label: 'Corridas',   icon: <Truck size={20}/>,       badge: corridasDisponiveis.length },
    { id: 'corrida_ativa',  label: 'Em Rota',    icon: <Navigation size={20}/>,   badge: corridaAtiva ? 1 : 0 },
    { id: 'ganhos',         label: 'Ganhos',     icon: <Wallet size={20}/> },
    { id: 'historico',      label: 'Histórico',  icon: <Clock size={20}/> },
    { id: 'perfil',         label: 'Perfil',     icon: <User size={20}/> },
  ]

  // ─────────────────────────────────────────────────────────
  // RENDER — CORRIDAS DISPONÍVEIS
  // ─────────────────────────────────────────────────────────

  function renderCorridas() {
    return (
      <div className="space-y-4">
        {/* Status online/offline */}
        <div className={`rounded-2xl p-4 flex items-center justify-between ${
          online ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-100 border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}/>
            <div>
              <p className={`font-bold text-sm ${online ? 'text-emerald-800' : 'text-gray-600'}`}>
                {online ? 'Você está Online' : 'Você está Offline'}
              </p>
              <p className={`text-xs ${online ? 'text-emerald-600' : 'text-gray-500'}`}>
                {online ? 'Recebendo corridas disponíveis' : 'Ative para receber corridas'}
              </p>
            </div>
          </div>
          <button onClick={() => { setOnline(v => !v); toast_(online ? '⭕ Você ficou offline' : '✅ Você está online!') }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
              online ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}>
            {online ? 'Ficar Offline' : 'Ficar Online'}
          </button>
        </div>

        {/* Resumo do dia */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-black text-emerald-600">{fmtBRL(ganhosHoje)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Ganhos hoje</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-black text-indigo-600">{entregasHoje}</p>
            <p className="text-xs text-gray-500 mt-0.5">Entregas hoje</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-black text-orange-500">{entregador!.avaliacaoMedia}</p>
            <p className="text-xs text-gray-500 mt-0.5">Avaliação ⭐</p>
          </div>
        </div>

        {/* Corridas disponíveis */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">
              Corridas Disponíveis
              {corridasDisponiveis.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {corridasDisponiveis.length}
                </span>
              )}
            </h2>
            <button onClick={() => toast_('🔄 Atualizando corridas...')}
              className="p-2 bg-gray-100 hover:bg-orange-100 rounded-xl transition">
              <RefreshCw size={14} className="text-gray-500"/>
            </button>
          </div>

          {!online && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <Radio size={32} className="mx-auto mb-3 opacity-40"/>
              <p className="font-semibold">Você está offline</p>
              <p className="text-sm mt-1">Fique online para ver as corridas</p>
            </div>
          )}

          {online && corridasDisponiveis.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <Coffee size={32} className="mx-auto mb-3 opacity-40"/>
              <p className="font-semibold">Nenhuma corrida no momento</p>
              <p className="text-sm mt-1">Aguarde, novas corridas chegam em breve!</p>
            </div>
          )}

          {online && corridasDisponiveis.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden mb-3">
              {/* Banner de valor */}
              <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-black text-xl">{fmtBRL(c.ganhoEntregador)}</p>
                  <p className="text-orange-100 text-xs">seu ganho nesta corrida</p>
                </div>
                <div className="text-right text-white">
                  <p className="font-bold text-lg">{fmtDist(c.distanciaKm)}</p>
                  <p className="text-xs text-orange-100">~{Math.round(c.distanciaKm * 3 + 5)} min</p>
                </div>
              </div>

              {/* Detalhes */}
              <div className="p-5 space-y-3">
                {/* Rota */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">🏪</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-blue-700">BUSCAR EM</p>
                      <p className="text-sm text-gray-900 font-semibold">{c.lojistaNome}</p>
                      <p className="text-xs text-gray-500 leading-snug">{c.lojistaEndereco}</p>
                    </div>
                  </div>
                  <div className="ml-3 border-l-2 border-dashed border-gray-200 pl-4 py-1">
                    <p className="text-xs text-gray-400">📦 {c.produto} · {c.peso}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">🏠</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-green-700">ENTREGAR PARA</p>
                      <p className="text-sm text-gray-900 font-semibold">{c.clienteNome}</p>
                      <p className="text-xs text-gray-500 leading-snug">{c.clienteEndereco}</p>
                    </div>
                  </div>
                </div>

                {/* Info extra */}
                <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                  <span>💰 Taxa total: {fmtBRL(c.taxaEntrega)}</span>
                  <span>·</span>
                  <span>🕐 {c.criadoEm.split(' ')[1]}</span>
                </div>

                {/* Botões */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button onClick={() => setCorridas(p => p.filter(x => x.id !== c.id))}
                    className="py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition">
                    Recusar
                  </button>
                  <button onClick={() => aceitarCorrida(c)}
                    className="py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-orange-200">
                    ✅ Aceitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // RENDER — CORRIDA ATIVA
  // ─────────────────────────────────────────────────────────

  function renderCorridaAtiva() {
    if (!corridaAtiva) {
      return (
        <div className="py-16 text-center text-gray-400">
          <Truck size={48} className="mx-auto mb-4 opacity-30"/>
          <p className="font-bold text-lg">Nenhuma corrida ativa</p>
          <p className="text-sm mt-1">Aceite uma corrida para começar</p>
          <button onClick={() => setActiveTab('corridas')}
            className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition">
            Ver Corridas
          </button>
        </div>
      )
    }

    const steps = [
      { label: 'Aceita',   done: true },
      { label: 'Coletada', done: faseEntrega === 'entrega' || corridaAtiva.status === 'entregue' },
      { label: 'Entregue', done: corridaAtiva.status === 'entregue' },
    ]

    return (
      <div className="space-y-4">
        {/* Header da corrida */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-indigo-200">CORRIDA EM ANDAMENTO</p>
            <p className="font-mono text-xs text-indigo-200">{corridaAtiva.id}</p>
          </div>
          <p className="text-3xl font-black">{fmtBRL(corridaAtiva.ganhoEntregador)}</p>
          <p className="text-indigo-200 text-sm">seu ganho nesta entrega</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span>📍 {fmtDist(corridaAtiva.distanciaKm)}</span>
            <span>📦 {corridaAtiva.produto}</span>
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  s.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {s.done ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-semibold ${s.done ? 'text-green-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${s.done ? 'bg-green-300' : 'bg-gray-100'}`}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mapa / navegação */}
        <MapaSimulado corrida={corridaAtiva} fase={faseEntrega}/>

        {/* Detalhes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Detalhes da Entrega</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <span className="text-lg flex-shrink-0">🏪</span>
              <div>
                <p className="font-bold text-blue-900">{corridaAtiva.lojistaNome}</p>
                <p className="text-xs text-blue-700">{corridaAtiva.lojistaEndereco}</p>
                <p className="text-xs text-blue-600 mt-0.5">📦 {corridaAtiva.produto} · {corridaAtiva.peso}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-lg flex-shrink-0">🏠</span>
              <div>
                <p className="font-bold text-green-900">{corridaAtiva.clienteNome}</p>
                <p className="text-xs text-green-700">{corridaAtiva.clienteEndereco}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          {faseEntrega === 'coleta' && (
            <button onClick={confirmarColeta}
              className="w-full py-4 bg-blue-600 text-white font-black text-base rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
              <CheckCircle size={20}/> Confirmei a Coleta no Lojista
            </button>
          )}
          {faseEntrega === 'entrega' && (
            <button onClick={confirmarEntrega}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-2xl hover:opacity-90 transition shadow-xl shadow-emerald-200 flex items-center justify-center gap-2">
              <CheckCircle size={20}/> Entreguei ao Cliente!
            </button>
          )}
          <button onClick={cancelarCorrida}
            className="w-full py-3 border border-red-200 text-red-500 font-semibold text-sm rounded-2xl hover:bg-red-50 transition">
            Cancelar Corrida
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // RENDER — GANHOS
  // ─────────────────────────────────────────────────────────

  function renderGanhos() {
    const totalGanhos = entregador!.totalGanhos
    const semana = 312.50
    const mes = 1870.00
    const comissaoPlat = (100 - configPlataforma.percentualEntregador) / 100

    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-800">Meus Ganhos</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Hoje', value: fmtBRL(ganhosHoje), icon: '⚡', cls: 'from-orange-500 to-rose-500', sub: `${entregasHoje} entregas` },
            { label: 'Esta Semana', value: fmtBRL(semana), icon: '📅', cls: 'from-blue-500 to-indigo-600', sub: '22 entregas' },
            { label: 'Este Mês', value: fmtBRL(mes), icon: '🗓️', cls: 'from-emerald-500 to-teal-600', sub: '89 entregas' },
          ].map((c, i) => (
            <div key={i} className={`bg-gradient-to-br ${c.cls} rounded-2xl p-5 text-white`}>
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="text-2xl font-black">{c.value}</p>
              <p className="text-white/80 text-xs mt-0.5">{c.label} · {c.sub}</p>
            </div>
          ))}
        </div>

        {/* Total geral */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total acumulado</p>
            <p className="text-3xl font-black text-gray-900">{fmtBRL(totalGanhos + ganhosHoje)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{entregador!.totalEntregas + entregasHoje} entregas no total</p>
          </div>
          <Award size={40} className="text-yellow-400"/>
        </div>

        {/* Como funciona */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
          <p className="font-bold text-indigo-900 text-sm">💡 Como funciona seu pagamento?</p>
          <div className="text-xs text-indigo-700 space-y-1">
            <p>• Você fica com <strong>{configPlataforma.percentualEntregador}%</strong> da taxa de entrega de cada pedido</p>
            <p>• A plataforma retém <strong>{100 - configPlataforma.percentualEntregador}%</strong> como comissão de serviço</p>
            <p>• Taxa base: <strong>{fmtBRL(configPlataforma.taxaEntregaBase)}</strong> + <strong>{fmtBRL(configPlataforma.taxaEntregaPorKm)}/km</strong></p>
            <p>• Pagamento semanal — toda segunda-feira na sua conta</p>
          </div>
        </div>

        {/* Corridas recentes com ganho */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Histórico de Ganhos</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { id: 'COR-003', produto: 'Notebook Dell', ganho: 12.00, dist: 4.5, data: '2026-05-19' },
              { id: 'COR-X01', produto: 'Tênis Nike', ganho: 8.00, dist: 2.8, data: '2026-05-19' },
              { id: 'COR-X02', produto: 'Maquiagem Kit', ganho: 6.40, dist: 1.9, data: '2026-05-18' },
              { id: 'COR-X03', produto: 'Livros (3x)', ganho: 9.20, dist: 3.1, data: '2026-05-18' },
            ].map((c, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight size={14} className="text-emerald-600"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.produto}</p>
                    <p className="text-xs text-gray-400">{c.id} · {fmtDist(c.dist)} · {c.data}</p>
                  </div>
                </div>
                <p className="font-bold text-emerald-600 flex-shrink-0">+{fmtBRL(c.ganho)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botão saque */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-gray-900">Solicitar Adiantamento</p>
            <p className="text-sm text-gray-500">Disponível: <strong className="text-emerald-600">{fmtBRL(ganhosHoje + semana * 0.5)}</strong></p>
          </div>
          <button onClick={() => toast_('💸 Adiantamento solicitado! Prazo: 1 dia útil.')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">
            💸 Sacar
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // RENDER — HISTÓRICO
  // ─────────────────────────────────────────────────────────

  function renderHistorico() {
    const hist = [
      { id: 'COR-003', lojista: 'Tech Store SP', cliente: 'Carlos Pereira', produto: 'Notebook Dell', dist: 4.5, ganho: 12.00, avaliacao: 5, data: '2026-05-19 16:30', status: 'entregue' },
      { id: 'COR-X01', lojista: 'Moda Fashion RJ', cliente: 'Ana Lima', produto: 'Tênis Nike', dist: 2.8, ganho: 8.00, avaliacao: 4, data: '2026-05-19 14:10', status: 'entregue' },
      { id: 'COR-X02', lojista: 'Beleza Store', cliente: 'Maria Costa', produto: 'Kit Maquiagem', dist: 1.9, ganho: 6.40, avaliacao: 5, data: '2026-05-18 11:30', status: 'entregue' },
      { id: 'COR-X03', lojista: 'Livros & Cia', cliente: 'João Paulo', produto: 'Livros (3x)', dist: 3.1, ganho: 9.20, avaliacao: 4, data: '2026-05-18 09:45', status: 'entregue' },
      { id: 'COR-X04', lojista: 'Casa & Cia BH', cliente: 'Pedro Alves', produto: 'Cadeira Gamer', dist: 6.2, ganho: 14.30, avaliacao: 5, data: '2026-05-17 15:00', status: 'entregue' },
    ]
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Histórico de Corridas</h2>
          <span className="text-xs text-gray-400">{hist.length + corridasHistorico.length} corridas</span>
        </div>
        <div className="space-y-3">
          {hist.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-400">{c.id}</span>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✓ Entregue</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{c.produto}</p>
                  <p className="text-xs text-gray-500">{c.lojista} → {c.cliente}</p>
                  <p className="text-xs text-gray-400">{c.data} · {fmtDist(c.dist)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-emerald-600 text-lg">{fmtBRL(c.ganho)}</p>
                  <div className="flex justify-end gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={10} className={n <= c.avaliacao ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // RENDER — PERFIL
  // ─────────────────────────────────────────────────────────

  function renderPerfil() {
    if (!entregador) return null
    const docStatus = entregador.documentosOk
    return (
      <div className="space-y-5 max-w-lg">
        <h2 className="text-xl font-bold text-gray-800">Meu Perfil</h2>

        {/* Avatar + Info */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-4xl">
            {entregador.foto}
          </div>
          <p className="font-black text-xl">{entregador.nome}</p>
          <p className="text-indigo-200 text-sm">{entregador.email}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm">
            <div className="text-center">
              <p className="font-black text-xl">{entregador.avaliacaoMedia}</p>
              <p className="text-indigo-200 text-xs">Avaliação</p>
            </div>
            <div className="w-px h-8 bg-white/20"/>
            <div className="text-center">
              <p className="font-black text-xl">{entregador.totalEntregas}</p>
              <p className="text-indigo-200 text-xs">Entregas</p>
            </div>
            <div className="w-px h-8 bg-white/20"/>
            <div className="text-center">
              <p className="font-black text-xl">{entregador.taxaAceitacao}%</p>
              <p className="text-indigo-200 text-xs">Aceitação</p>
            </div>
          </div>
        </div>

        {/* Status dos documentos */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${
          docStatus ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {docStatus
            ? <CheckCircle size={20} className="text-green-600 flex-shrink-0"/>
            : <AlertCircle size={20} className="text-red-500 flex-shrink-0"/>}
          <div>
            <p className={`font-bold text-sm ${docStatus ? 'text-green-800' : 'text-red-700'}`}>
              {docStatus ? 'Documentos aprovados ✅' : 'Documentos pendentes ⚠️'}
            </p>
            <p className={`text-xs ${docStatus ? 'text-green-600' : 'text-red-600'}`}>
              {docStatus ? 'Você está apto para fazer entregas' : 'Envie seus documentos para ativar sua conta'}
            </p>
          </div>
        </div>

        {/* Dados */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Dados Pessoais</h3>
          {[
            { label: 'Nome completo', val: entregador.nome },
            { label: 'Email', val: entregador.email },
            { label: 'Telefone', val: entregador.telefone },
            { label: 'CPF', val: entregador.cpf },
            { label: 'Cidade/Estado', val: `${entregador.cidade}/${entregador.estado}` },
          ].map((f, i) => (
            <div key={i}>
              <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
              <input defaultValue={f.val}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"/>
            </div>
          ))}
        </div>

        {/* Veículo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <VeiculoIcon tipo={entregador.veiculo}/> Veículo
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tipo</label>
              <select defaultValue={entregador.veiculo}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white">
                <option value="moto">🏍️ Moto</option>
                <option value="carro">🚗 Carro</option>
                <option value="bicicleta">🚲 Bicicleta</option>
                <option value="a_pe">🚶 A pé</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Placa</label>
              <input defaultValue={entregador.placa ?? ''}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"/>
            </div>
          </div>
        </div>

        <button onClick={() => toast_('✅ Perfil atualizado com sucesso!')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition">
          Salvar Alterações
        </button>

        <button onClick={() => { setLoggedIn(false); sessionStorage.removeItem('kainow_entregador') }}
          className="w-full py-3 border border-red-200 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-50 transition flex items-center justify-center gap-2">
          <LogOut size={15}/> Sair da Conta
        </button>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // LAYOUT MOBILE-FIRST
  // ══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold w-max max-w-[90vw] text-center">
          {toast}
        </div>
      )}

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Truck size={15} className="text-white"/>
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm leading-none">
              {entregador?.nome.split(' ')[0]}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-400'}`}/>
              <span className={`text-[10px] font-semibold ${online ? 'text-emerald-600' : 'text-gray-400'}`}>
                {online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {corridaAtiva && (
            <div className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
              🏍️ Em corrida
            </div>
          )}
          <div className="text-right">
            <p className="text-xs font-black text-emerald-600">{fmtBRL(ganhosHoje)}</p>
            <p className="text-[10px] text-gray-400">hoje</p>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {activeTab === 'corridas'      && renderCorridas()}
        {activeTab === 'corrida_ativa' && renderCorridaAtiva()}
        {activeTab === 'ganhos'        && renderGanhos()}
        {activeTab === 'historico'     && renderHistorico()}
        {activeTab === 'perfil'        && renderPerfil()}
      </main>

      {/* Bottom navigation — app móvel */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-100 shadow-2xl z-30">
        <div className="flex items-center">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 relative transition ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {tab.icon}
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute top-1.5 right-1/4 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"/>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
