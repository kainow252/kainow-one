'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Store, Package, ShoppingBag, TrendingUp, Star, DollarSign,
  LogOut, Menu, X, Plus, Search, Edit, Trash2, Eye,
  CheckCircle, Clock, Truck, AlertCircle, Bell, Settings,
  ChevronRight, ArrowUpRight, BarChart2, Box, Tag,
  Phone, Mail, MapPin, Camera, Save, RefreshCw,
  ChevronDown, Filter, Download, Zap, Award, Gift,
  XCircle, Package2, Image as ImageIcon, ToggleLeft, ToggleRight,
  Wallet, ArrowDownRight, CreditCard, FileText, Users,
} from 'lucide-react'
import {
  mockLojistasEco, mockPedidosEco, type PedidoEcossistema,
  type LojistaEcossistema, labelStatus, corStatus, fmtBRL,
  type StatusPedido,
} from '@/lib/ecosystem'
import { products as realProducts, categories as realCategories } from '@/lib/data'

// ══════════════════════════════════════════════════════════
// TIPOS LOCAIS
// ══════════════════════════════════════════════════════════

type ProdutoLoja = {
  id: string; nome: string; categoria: string; preco: number
  precoOriginal?: number; estoque: number; vendidos: number
  avaliacao: number; status: 'ativo' | 'pausado' | 'esgotado'
  imagem: string; descricao: string; badge?: string; discount?: number
}

// ══════════════════════════════════════════════════════════
// DADOS MOCK DO LOJISTA LOGADO (L001)
// ══════════════════════════════════════════════════════════

const LOJISTA_ID = 'L001'

function buildProdutosLoja(): ProdutoLoja[] {
  return realProducts.filter(p => p.seller === 'Tech Store SP').map(p => ({
    id: p.id, nome: p.title, categoria: p.category, preco: p.price,
    precoOriginal: p.originalPrice, estoque: p.stock, vendidos: p.sold,
    avaliacao: p.rating, status: p.stock === 0 ? 'esgotado' : 'ativo',
    imagem: p.image || '📦', descricao: p.description,
    badge: p.badge, discount: p.discount,
  }))
}

// ══════════════════════════════════════════════════════════
// COMPONENTES UTILITÁRIOS
// ══════════════════════════════════════════════════════════

function BadgePedido({ status }: { status: StatusPedido }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${corStatus(status)}`}>
      {labelStatus(status)}
    </span>
  )
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string
}) {
  return (
    <div className={`rounded-2xl p-5 ${color} flex items-start gap-4`}>
      <div className="bg-white/25 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-white/80 text-xs font-medium">{label}</p>
        <p className="text-2xl font-black text-white leading-tight">{value}</p>
        {sub && <p className="text-white/70 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════

export default function LojistaPage() {
  // ── Auth ──
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [lojista, setLojista] = useState<LojistaEcossistema | null>(null)

  // ── Navegação ──
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Dados ──
  const [produtos, setProdutos] = useState<ProdutoLoja[]>(buildProdutosLoja())
  const [pedidos, setPedidos] = useState<PedidoEcossistema[]>(
    mockPedidosEco.filter(p => p.lojistaId === LOJISTA_ID)
  )
  const [toast, setToast] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<any>(null)

  // ── Filtros ──
  const [searchProdutos, setSearchProdutos] = useState('')
  const [searchPedidos, setSearchPedidos] = useState('')
  const [filtroPedido, setFiltroPedido] = useState<string>('todos')
  const [filtroProduto, setFiltroProduto] = useState<string>('todos')

  // ── Modal Produto form (deve ficar no topo — Rules of Hooks) ──
  const [modalForm, setModalForm] = useState<any>({
    nome: '', categoria: 'Eletrônicos', preco: '', precoOriginal: '', estoque: '',
    descricao: '', badge: '', discount: '', imagem: '📦',
  })

  // ── Notificações ──
  const pedidosNovos = pedidos.filter(p => p.status === 'pago').length
  const pedidosPreparando = pedidos.filter(p => p.status === 'preparando').length

  useEffect(() => {
    const saved = sessionStorage.getItem('kainow_lojista')
    if (saved) {
      const l = mockLojistasEco.find(x => x.id === saved)
      if (l) { setLojista(l); setLoggedIn(true) }
    }
  }, [])

  function toast_(msg: string) {
    setToast(msg); setTimeout(() => setToast(null), 3500)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const found = mockLojistasEco.find(
      l => l.email === loginEmail && l.senha === loginPass
    )
    if (found) {
      setLojista(found); setLoggedIn(true)
      sessionStorage.setItem('kainow_lojista', found.id)
    } else {
      setLoginError('Email ou senha incorretos.')
    }
  }

  // ── Derivados ──
  const produtosFiltrados = useMemo(() => {
    let list = produtos
    if (filtroProduto !== 'todos') list = list.filter(p => p.status === filtroProduto)
    if (searchProdutos.trim()) {
      const q = searchProdutos.toLowerCase()
      list = list.filter(p => p.nome.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))
    }
    return list
  }, [produtos, searchProdutos, filtroProduto])

  const pedidosFiltrados = useMemo(() => {
    let list = pedidos
    if (filtroPedido !== 'todos') list = list.filter(p => p.status === filtroPedido)
    if (searchPedidos.trim()) {
      const q = searchPedidos.toLowerCase()
      list = list.filter(p =>
        p.clienteNome.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.itens.some(i => i.nome.toLowerCase().includes(q))
      )
    }
    return list
  }, [pedidos, searchPedidos, filtroPedido])

  // ── Stats ──
  const totalVendasHoje = pedidos
    .filter(p => p.status === 'entregue' && p.criadoEm.startsWith('2026-05-20'))
    .reduce((s, p) => s + p.subtotal, 0)
  const totalPedidosHoje = pedidos.filter(p => p.criadoEm.startsWith('2026-05-20')).length

  // ══════════════════════════════════════════════════════════
  // TELA DE LOGIN
  // ══════════════════════════════════════════════════════════

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Store size={20} className="text-white"/>
              </div>
              <span className="text-xl font-black text-gray-900">Kainow<span className="text-orange-500">One</span></span>
            </Link>
            <h1 className="text-2xl font-black text-gray-900">Portal do Lojista</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie sua loja na plataforma</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Demo credentials */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-6 text-xs text-orange-800">
              <p className="font-bold mb-1">🔑 Credenciais de demonstração:</p>
              <p>Email: <code className="bg-orange-100 px-1 rounded">lojista@techstore.com</code></p>
              <p>Senha: <code className="bg-orange-100 px-1 rounded">Loja@2026</code></p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email da loja</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    placeholder="loja@exemplo.com" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Senha</label>
                <div className="relative">
                  <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/>
                </div>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle size={15}/> {loginError}
                </div>
              )}
              <button type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-orange-200">
                Entrar no Painel
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">Ainda não tem conta?{' '}
                <Link href="/" className="text-orange-500 font-semibold hover:underline">Cadastre sua loja</Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition mt-2">
                ← Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // PAINEL PRINCIPAL
  // ══════════════════════════════════════════════════════════

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard',   icon: <BarChart2 size={18}/> },
    { id: 'pedidos',   label: 'Pedidos',     icon: <ShoppingBag size={18}/>, badge: pedidosNovos + pedidosPreparando },
    { id: 'produtos',  label: 'Produtos',    icon: <Package size={18}/> },
    { id: 'financeiro',label: 'Financeiro',  icon: <Wallet size={18}/> },
    { id: 'avaliacoes',label: 'Avaliações',  icon: <Star size={18}/> },
    { id: 'minha_loja',label: 'Minha Loja',  icon: <Store size={18}/> },
  ]

  // ── renders ──────────────────────────────────────────────

  function renderDashboard() {
    const faturamento = lojista!.totalVendas
    const comissao = faturamento * (lojista!.comissao / 100)
    return (
      <div className="space-y-6">
        {/* Boas-vindas */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Olá, {lojista!.nome} 👋</h2>
            <p className="text-gray-500 text-sm">Terça-feira, 20 de Maio de 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              lojista!.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              ● {lojista!.status === 'ativo' ? 'Loja Online' : 'Loja Offline'}
            </span>
          </div>
        </div>

        {/* Alertas */}
        {pedidosNovos > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell size={18} className="text-blue-600"/>
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm">
                  {pedidosNovos} novo{pedidosNovos > 1 ? 's' : ''} pedido{pedidosNovos > 1 ? 's' : ''} pago{pedidosNovos > 1 ? 's' : ''}!
                </p>
                <p className="text-xs text-blue-600">Inicie a preparação para não atrasar</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('pedidos')}
              className="text-xs bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
              Ver pedidos
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<TrendingUp size={20} className="text-white"/>} label="Vendas Hoje"
            value={fmtBRL(totalVendasHoje)} sub={`${totalPedidosHoje} pedidos hoje`}
            color="bg-gradient-to-br from-orange-500 to-rose-500"/>
          <StatCard icon={<DollarSign size={20} className="text-white"/>} label="Saldo Disponível"
            value={fmtBRL(lojista!.saldoDisponivel)} sub="Disponível para saque"
            color="bg-gradient-to-br from-emerald-500 to-teal-600"/>
          <StatCard icon={<ShoppingBag size={20} className="text-white"/>} label="Total Pedidos"
            value={lojista!.totalPedidos.toString()} sub={`${pedidosPreparando} em preparação`}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"/>
          <StatCard icon={<Star size={20} className="text-white"/>} label="Avaliação Média"
            value={lojista!.avaliacaoMedia.toString()} sub="⭐ Baseado em clientes"
            color="bg-gradient-to-br from-yellow-400 to-orange-500"/>
        </div>

        {/* Últimos Pedidos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Últimos Pedidos</h3>
            <button onClick={() => setActiveTab('pedidos')}
              className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={13}/>
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {pedidos.slice(0, 4).map(p => (
              <div key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">{p.id}</span>
                    <BadgePedido status={p.status}/>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate max-w-[220px]">
                    {p.itens[0].nome}{p.itens.length > 1 ? ` +${p.itens.length - 1}` : ''}
                  </p>
                  <p className="text-xs text-gray-500">{p.clienteNome} · {p.criadoEm}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{fmtBRL(p.total)}</p>
                  <p className="text-xs text-gray-400">{p.pagamento}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos com estoque baixo */}
        {produtos.filter(p => p.estoque < 5 && p.estoque > 0).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-500"/>
              <h3 className="font-bold text-gray-900">Produtos com Estoque Baixo</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {produtos.filter(p => p.estoque < 5 && p.estoque > 0).map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.imagem}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 max-w-[180px] truncate">{p.nome}</p>
                      <p className="text-xs text-orange-600 font-bold">Apenas {p.estoque} unidade{p.estoque > 1 ? 's' : ''} restante{p.estoque > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => { setEditTarget(p); setModalForm({...p}); setShowModal('produto') }}
                    className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-100 transition">
                    Atualizar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Financeira Resumida */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Faturamento Total', value: fmtBRL(faturamento), icon: '💰', desc: 'Desde o cadastro' },
            { label: 'Comissão Plataforma', value: fmtBRL(comissao), icon: '📊', desc: `${lojista!.comissao}% do faturamento` },
            { label: 'Saldo Pendente', value: fmtBRL(lojista!.saldoPendente), icon: '⏳', desc: 'Aguardando liberação' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{c.icon}</span>
                <p className="text-xs font-medium text-gray-500">{c.label}</p>
              </div>
              <p className="text-xl font-black text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderPedidos() {
    const statusOpcoes: { key: string; label: string }[] = [
      { key: 'todos', label: 'Todos' },
      { key: 'pago', label: 'Pagos' },
      { key: 'preparando', label: 'Preparando' },
      { key: 'pronto_coleta', label: 'Pronto p/ Coleta' },
      { key: 'em_rota', label: 'Em Rota' },
      { key: 'entregue', label: 'Entregues' },
      { key: 'cancelado', label: 'Cancelados' },
    ]

    function avancarStatus(pedido: PedidoEcossistema) {
      const fluxo: Record<string, StatusPedido> = {
        pago: 'preparando',
        preparando: 'pronto_coleta',
      }
      const prox = fluxo[pedido.status]
      if (!prox) return
      setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, status: prox, atualizadoEm: '2026-05-20 agora' } : p))
      toast_(`✅ Pedido ${pedido.id} → ${labelStatus(prox)}`)
    }

    const btnLabel: Record<string, string> = {
      pago: '▶ Iniciar Preparação',
      preparando: '✅ Marcar Pronto',
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Meus Pedidos</h2>
            <p className="text-sm text-gray-500">{pedidos.length} pedidos · {pedidosNovos} novos</p>
          </div>
        </div>

        {/* Filtro status */}
        <div className="flex flex-wrap gap-2">
          {statusOpcoes.map(s => (
            <button key={s.key} onClick={() => setFiltroPedido(s.key)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition ${
                filtroPedido === s.key ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
              }`}>
              {s.label}
              {s.key !== 'todos' && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                  {s.key === 'todos' ? pedidos.length : pedidos.filter(p => p.status === s.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={searchPedidos} onChange={e => setSearchPedidos(e.target.value)}
            placeholder="Buscar por ID, cliente ou produto..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-3">
          {pedidosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30"/>
              <p className="font-semibold">Nenhum pedido encontrado</p>
            </div>
          ) : pedidosFiltrados.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
              p.status === 'pago' ? 'border-blue-200' :
              p.status === 'preparando' ? 'border-yellow-200' : 'border-gray-100'
            }`}>
              {/* Header do card */}
              <div className="px-5 py-4 flex items-start justify-between gap-3 flex-wrap border-b border-gray-50">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-500">{p.id}</span>
                    <BadgePedido status={p.status}/>
                    {p.entregadorNome && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                        🏍️ {p.entregadorNome}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Phone size={10}/>{p.clienteTelefone}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10}/>{p.clienteCidade}/{p.clienteEstado}</span>
                    <span className="text-xs text-gray-400">{p.criadoEm}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-gray-900 text-lg">{fmtBRL(p.total)}</p>
                  <p className="text-xs text-gray-400">{p.pagamento}</p>
                </div>
              </div>

              {/* Itens */}
              <div className="px-5 py-3 space-y-1.5">
                {p.itens.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{item.imagem}</span>
                      <span className="text-gray-700 truncate max-w-[220px]">{item.nome}</span>
                      <span className="text-gray-400 text-xs">×{item.quantidade}</span>
                    </span>
                    <span className="font-semibold text-gray-900 flex-shrink-0">{fmtBRL(item.preco * item.quantidade)}</span>
                  </div>
                ))}
                {p.taxaEntrega > 0 && (
                  <div className="flex justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
                    <span>Taxa de entrega</span>
                    <span>{fmtBRL(p.taxaEntrega)}</span>
                  </div>
                )}
                {p.desconto > 0 && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Desconto</span>
                    <span>−{fmtBRL(p.desconto)}</span>
                  </div>
                )}
              </div>

              {/* Endereço + Obs */}
              <div className="px-5 pb-3">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={10}/> {p.clienteEndereco}{p.clienteComplemento ? `, ${p.clienteComplemento}` : ''} — {p.clienteCep}
                </p>
                {p.observacao && (
                  <p className="text-xs text-orange-700 bg-orange-50 rounded-lg px-2 py-1 mt-1.5">
                    📝 {p.observacao}
                  </p>
                )}
              </div>

              {/* Ações */}
              {(p.status === 'pago' || p.status === 'preparando') && (
                <div className="px-5 pb-4">
                  <button onClick={() => avancarStatus(p)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${
                      p.status === 'pago'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}>
                    {btnLabel[p.status]}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderProdutos() {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Meus Produtos</h2>
            <p className="text-sm text-gray-500">
              {produtos.length} produtos ·{' '}
              <span className="text-green-600 font-semibold">{produtos.filter(p => p.status === 'ativo').length} ativos</span> ·{' '}
              <span className="text-red-500 font-semibold">{produtos.filter(p => p.status === 'esgotado').length} esgotados</span>
            </p>
          </div>
          <button onClick={() => { setEditTarget(null); setModalForm({ nome: '', categoria: 'Eletrônicos', preco: '', precoOriginal: '', estoque: '', descricao: '', badge: '', discount: '', imagem: '📦' }); setShowModal('produto') }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition flex-shrink-0">
            <Plus size={16}/> Novo Produto
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchProdutos} onChange={e => setSearchProdutos(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
          </div>
          {['todos', 'ativo', 'pausado', 'esgotado'].map(s => (
            <button key={s} onClick={() => setFiltroProduto(s)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition capitalize ${
                filtroProduto === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
              }`}>
              {s === 'todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabela de produtos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Produto</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Categoria</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Preço</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center hidden md:table-cell">Estoque</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center hidden lg:table-cell">Vendidos</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {produtosFiltrados.map(p => (
                  <tr key={p.id} className={`hover:bg-orange-50/20 transition ${
                    p.status === 'esgotado' ? 'bg-red-50/20' : p.status === 'pausado' ? 'bg-gray-50/50' : ''
                  }`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl flex-shrink-0">{p.imagem}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate max-w-[140px]">{p.nome}</p>
                          {p.badge && (
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-bold">{p.badge}</span>
                          )}
                          <p className="text-[10px] text-gray-400 sm:hidden mt-0.5">{p.categoria}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{p.categoria}</td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{fmtBRL(p.preco)}</p>
                      {p.precoOriginal && p.precoOriginal > p.preco && (
                        <p className="text-[10px] text-gray-400 line-through">{fmtBRL(p.precoOriginal)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className={`text-sm font-bold ${
                        p.estoque === 0 ? 'text-red-500' : p.estoque < 5 ? 'text-orange-500' : 'text-gray-700'
                      }`}>{p.estoque}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className="text-sm font-semibold text-gray-600">{p.vendidos}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        p.status === 'ativo' ? 'bg-green-100 text-green-700' :
                        p.status === 'pausado' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => {
                          setProdutos(prev => prev.map(x => x.id === p.id
                            ? { ...x, status: x.status === 'ativo' ? 'pausado' : 'ativo' } : x))
                          toast_(`${p.status === 'ativo' ? '⏸️' : '▶️'} Produto ${p.status === 'ativo' ? 'pausado' : 'ativado'}`)
                        }} title={p.status === 'ativo' ? 'Pausar' : 'Ativar'}
                          className="p-1.5 bg-gray-50 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 rounded-lg transition flex-shrink-0">
                          {p.status === 'ativo' ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>}
                        </button>
                        <button onClick={() => { setEditTarget(p); setModalForm({...p}); setShowModal('produto') }}
                          title="Editar" className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg transition flex-shrink-0">
                          <Edit size={14}/>
                        </button>
                        <button onClick={() => {
                          setProdutos(prev => prev.filter(x => x.id !== p.id))
                          toast_(`🗑️ "${p.nome.slice(0, 20)}" removido`)
                        }} title="Excluir"
                          className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition flex-shrink-0">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Mostrando {produtosFiltrados.length} de {produtos.length} produtos
          </div>
        </div>
      </div>
    )
  }

  function renderFinanceiro() {
    const faturamento = lojista!.totalVendas
    const comissao = faturamento * (lojista!.comissao / 100)
    const liquido = faturamento - comissao
    const transacoes = pedidos.filter(p => p.status === 'entregue').map(p => ({
      id: p.id, desc: p.itens[0].nome, valor: p.subtotal, data: p.criadoEm, tipo: 'entrada'
    }))

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Financeiro</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Faturamento Total', value: fmtBRL(faturamento), icon: '💰', cls: 'bg-gradient-to-br from-orange-500 to-rose-500' },
            { label: 'Líquido (pós comissão)', value: fmtBRL(liquido), icon: '✅', cls: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
            { label: 'Saldo Disponível', value: fmtBRL(lojista!.saldoDisponivel), icon: '🏦', cls: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
            { label: 'Saldo Pendente', value: fmtBRL(lojista!.saldoPendente), icon: '⏳', cls: 'bg-gradient-to-br from-gray-500 to-gray-700' },
          ].map((c, i) => (
            <div key={i} className={`${c.cls} rounded-2xl p-5 text-white`}>
              <p className="text-3xl mb-2">{c.icon}</p>
              <p className="text-2xl font-black">{c.value}</p>
              <p className="text-white/80 text-xs mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Info comissão */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Tag size={18} className="text-orange-600"/>
          </div>
          <div>
            <p className="font-bold text-orange-900 text-sm">Comissão da Plataforma: {lojista!.comissao}%</p>
            <p className="text-xs text-orange-700">
              A plataforma retém {lojista!.comissao}% de cada venda. Plano atual: <strong>{lojista!.plano}</strong>.
              Faça upgrade para reduzir a comissão.
            </p>
          </div>
        </div>

        {/* Botão saque */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-gray-900">Solicitar Saque</p>
            <p className="text-sm text-gray-500">Saldo disponível: <strong className="text-green-600">{fmtBRL(lojista!.saldoDisponivel)}</strong></p>
          </div>
          <button onClick={() => toast_('💸 Solicitação de saque enviada! Processamento em 1-2 dias úteis.')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition">
            💸 Sacar Agora
          </button>
        </div>

        {/* Histórico */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Histórico de Transações</h3>
          </div>
          {transacoes.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhuma transação concluída ainda</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transacoes.map((t, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight size={14} className="text-green-600"/>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{t.desc}</p>
                      <p className="text-xs text-gray-400">{t.data} · {t.id}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-green-600">+{fmtBRL(t.valor)}</p>
                    <p className="text-[10px] text-gray-400">−{fmtBRL(t.valor * lojista!.comissao / 100)} comissão</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderAvaliacoes() {
    const avs = [
      { cliente: 'Maria Silva', nota: 5, comentario: 'Produto chegou perfeito, super rápido! Recomendo muito.', produto: 'Smartphone Galaxy S24', data: '2026-05-18' },
      { cliente: 'João Santos', nota: 4, comentario: 'Boa loja, produto de qualidade. Entrega no prazo.', produto: 'Fone Bluetooth JBL', data: '2026-05-15' },
      { cliente: 'Carlos Pereira', nota: 5, comentario: 'Excelente atendimento! Produto idêntico ao anúncio.', produto: 'Notebook Dell', data: '2026-05-10' },
      { cliente: 'Ana Lima', nota: 3, comentario: 'Produto ok, mas demorou um pouco mais que o esperado.', produto: 'Tablet Samsung', data: '2026-05-05' },
    ]
    const media = avs.reduce((s, a) => s + a.nota, 0) / avs.length
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-800">Avaliações dos Clientes</h2>
        {/* Resumo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-5xl font-black text-gray-900">{media.toFixed(1)}</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={16} className={n <= Math.round(media) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}/>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{avs.length} avaliações</p>
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            {[5,4,3,2,1].map(n => {
              const count = avs.filter(a => a.nota === n).length
              const pct = (count / avs.length) * 100
              return (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-gray-500 text-right">{n}</span>
                  <Star size={10} className="text-yellow-400 fill-yellow-400 flex-shrink-0"/>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }}/>
                  </div>
                  <span className="text-gray-400 w-4">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
        {/* Lista */}
        <div className="space-y-3">
          {avs.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{a.cliente}</p>
                  <p className="text-xs text-gray-400">{a.produto} · {a.data}</p>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={13} className={n <= a.nota ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}/>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700">"{a.comentario}"</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderMinhaLoja() {
    if (!lojista) return null
    return (
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800">Minha Loja</h2>

        {/* Identidade */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Identidade da Loja</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              {lojista.logo}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{lojista.nome}</p>
              <p className="text-sm text-gray-500">{lojista.categoria} · Plano {lojista.plano}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                lojista.reputacao === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                lojista.reputacao === 'Silver' ? 'bg-gray-100 text-gray-600' :
                lojista.reputacao === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                ⭐ {lojista.reputacao}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Email', val: lojista.email, icon: <Mail size={14}/> },
              { label: 'Telefone', val: lojista.telefone, icon: <Phone size={14}/> },
              { label: 'WhatsApp', val: lojista.whatsapp, icon: <Phone size={14}/> },
              { label: 'CNPJ', val: lojista.cnpj, icon: <FileText size={14}/> },
              { label: 'Endereço', val: lojista.endereco, icon: <MapPin size={14}/> },
              { label: 'Cidade/Estado', val: `${lojista.cidade}/${lojista.estado}`, icon: <MapPin size={14}/> },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-xs text-gray-500 flex items-center gap-1 mb-1">{f.icon}{f.label}</label>
                <input defaultValue={f.val}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"/>
              </div>
            ))}
          </div>
        </div>

        {/* Horários */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Horário de Funcionamento</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Abertura</label>
              <input defaultValue={lojista.horarioAbertura} type="time"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"/>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Fechamento</label>
              <input defaultValue={lojista.horarioFechamento} type="time"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"/>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Preparo (min)</label>
              <input defaultValue={lojista.tempoPreparacao} type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"/>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Raio Entrega (km)</label>
              <input defaultValue={lojista.raioEntrega} type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"/>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-2">Dias de Funcionamento</label>
            <div className="flex flex-wrap gap-2">
              {['Seg','Ter','Qua','Qui','Sex','Sab','Dom'].map(d => (
                <button key={d}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                    lojista.diasFuncionamento.includes(d)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-orange-50'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Descrição da Loja</h3>
          <textarea defaultValue={lojista.descricao} rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 resize-none"/>
        </div>

        <button onClick={() => toast_('✅ Dados da loja salvos com sucesso!')}
          className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
          <Save size={16}/> Salvar Alterações
        </button>
      </div>
    )
  }

  // ── Modal Produto ──────────────────────────────────────

  function ModalProduto() {
    const isEdit = !!editTarget
    // form e setForm lêem/escrevem SEMPRE modalForm (Rules of Hooks: sem useState aqui)
    const form = modalForm
    const setForm = (updater: any) => {
      if (typeof updater === 'function') setModalForm((p: any) => updater(p))
      else setModalForm(updater)
    }
    function save() {
      const preco = parseFloat(String(form.preco).replace(',', '.')) || 0
      const estoque = parseInt(String(form.estoque)) || 0
      if (isEdit) {
        setProdutos(p => p.map(x => x.id === editTarget.id ? { ...x, ...form, preco, estoque } : x))
        toast_(`✅ "${form.nome.slice(0, 25)}" atualizado!`)
      } else {
        const novo: ProdutoLoja = {
          id: `P-${Date.now()}`, ...form, preco, estoque,
          vendidos: 0, avaliacao: 5,
          status: estoque === 0 ? 'esgotado' : 'ativo',
        }
        setProdutos(p => [novo, ...p])
        toast_('✅ Produto criado com sucesso!')
      }
      setShowModal(null); setEditTarget(null)
    }
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={() => { setShowModal(null); setEditTarget(null) }}>
        <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h3>
            <button onClick={() => { setShowModal(null); setEditTarget(null) }}
              className="p-2 hover:bg-gray-100 rounded-xl"><X size={18}/></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nome do Produto *', key: 'nome', type: 'text', full: true },
                { label: 'Preço (R$) *', key: 'preco', type: 'number' },
                { label: 'Preço Original', key: 'precoOriginal', type: 'number' },
                { label: 'Estoque *', key: 'estoque', type: 'number' },
                { label: 'Badge (ex: NOVO)', key: 'badge', type: 'text' },
                { label: 'Emoji / Imagem', key: 'imagem', type: 'text' },
              ].map(f => (
                <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key] ?? ''}
                    onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"/>
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">Categoria</label>
                <select value={form.categoria}
                  onChange={e => setForm((p: any) => ({ ...p, categoria: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white">
                  {realCategories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">Descrição</label>
                <textarea value={form.descricao ?? ''}
                  onChange={e => setForm((p: any) => ({ ...p, descricao: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 resize-none"/>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowModal(null); setEditTarget(null) }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={save}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
                {isEdit ? 'Salvar' : 'Criar Produto'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // LAYOUT
  // ══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-pulse">
          {toast}
        </div>
      )}

      {/* Modal */}
      {showModal === 'produto' && <ModalProduto/>}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 bg-gray-900 flex flex-col transition-all duration-300 min-h-screen fixed top-0 left-0 z-30`}>
        {/* Logo */}
        <div className={`flex items-center ${sidebarOpen ? 'gap-3 px-5' : 'justify-center px-0'} py-5 border-b border-gray-700`}>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store size={16} className="text-white"/>
          </div>
          {sidebarOpen && <span className="font-black text-white text-sm whitespace-nowrap">Portal Lojista</span>}
        </div>

        {/* Lojista info */}
        {sidebarOpen && lojista && (
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-xs font-bold text-white truncate">{lojista.nome}</p>
            <p className="text-[10px] text-gray-400 truncate">{lojista.email}</p>
            <span className="text-[10px] text-orange-400 font-bold">{lojista.reputacao} · {lojista.plano}</span>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl transition relative ${
                activeTab === item.id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              {item.icon}
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              {item.badge && item.badge > 0 && (
                <span className={`${sidebarOpen ? 'ml-auto' : 'absolute top-1.5 right-1.5'} bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700 space-y-1">
          <button onClick={() => setSidebarOpen(v => !v)}
            className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition text-xs">
            {sidebarOpen ? <><X size={14}/> Recolher</> : <Menu size={14}/>}
          </button>
          <button onClick={() => { setLoggedIn(false); sessionStorage.removeItem('kainow_lojista') }}
            className="w-full flex items-center justify-center gap-2 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition text-xs">
            <LogOut size={14}/>{sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-56' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-gray-900 capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-orange-500 transition flex items-center gap-1">
              <Store size={13}/> Ver loja
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {activeTab === 'dashboard'  && renderDashboard()}
          {activeTab === 'pedidos'    && renderPedidos()}
          {activeTab === 'produtos'   && renderProdutos()}
          {activeTab === 'financeiro' && renderFinanceiro()}
          {activeTab === 'avaliacoes' && renderAvaliacoes()}
          {activeTab === 'minha_loja' && renderMinhaLoja()}
        </div>
      </main>
    </div>
  )
}
