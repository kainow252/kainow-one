'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Package, Heart, MapPin, Star, Settings, LogOut,
  ChevronRight, ShoppingBag, Bell, Plus, Edit3, Trash2,
  Check, X, CreditCard, Shield, TrendingUp, Gift,
  CheckCircle, Clock, Truck, AlertCircle, ChevronDown, ChevronUp,
  ThumbsUp, Camera, Home, Building, Phone
} from 'lucide-react'
import { products, formatPrice } from '@/lib/data'
import { useNotifications } from '@/lib/notifications-context'
import { mockPedidosRastreio, statusLabel, statusColor, EtapaRastreio } from '@/lib/rastreio'

// ── Endereços mockados ──────────────────────────────────────────────
interface Endereco {
  id: string
  apelido: string
  nome: string
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  telefone: string
  padrao: boolean
  tipo: 'casa' | 'trabalho' | 'outro'
}

const enderecosMock: Endereco[] = [
  {
    id: 'e1', apelido: 'Casa', nome: 'Usuário Kainow', cep: '01310-100',
    rua: 'Av. Paulista', numero: '1000', complemento: 'Apto 42',
    bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP',
    telefone: '(11) 99999-0000', padrao: true, tipo: 'casa'
  },
  {
    id: 'e2', apelido: 'Trabalho', nome: 'Usuário Kainow', cep: '01310-200',
    rua: 'Rua Augusta', numero: '200', bairro: 'Consolação',
    cidade: 'São Paulo', uf: 'SP', telefone: '(11) 88888-0000',
    padrao: false, tipo: 'trabalho'
  }
]

// ── Favoritos mockados ──────────────────────────────────────────────
const favoritosMock = products.filter(p => p.featured).slice(0, 4)

export default function ContaPage() {
  const [activeSection, setActiveSection] = useState<string>('pedidos')
  const { state: notifState, dispatch: notifDispatch } = useNotifications()

  // Endereços
  const [enderecos, setEnderecos]       = useState<Endereco[]>(enderecosMock)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [addingEndereco, setAddingEndereco]   = useState(false)
  const [novoEndereco, setNovoEndereco]       = useState<Partial<Endereco>>({tipo: 'casa'})

  // Rastreio
  const [pedidoAberto, setPedidoAberto] = useState<string | null>(null)

  // Avaliação
  const [avaliacaoModal, setAvaliacaoModal] = useState<{pedidoId: string; titulo: string; img: string} | null>(null)
  const [avalRating, setAvalRating]     = useState(0)
  const [avalHover, setAvalHover]       = useState(0)
  const [avalTitulo, setAvalTitulo]     = useState('')
  const [avalComentario, setAvalComentario] = useState('')
  const [avalEnviada, setAvalEnviada]   = useState<string[]>([])

  // Cartões mockados
  const cartoesMock = [
    { id: 'c1', bandeira: 'Visa', ultimos4: '4532', validade: '12/27', padrao: true },
    { id: 'c2', bandeira: 'Mastercard', ultimos4: '8913', validade: '08/26', padrao: false },
  ]

  function definirPadrao(id: string) {
    setEnderecos(prev => prev.map(e => ({ ...e, padrao: e.id === id })))
  }

  function removerEndereco(id: string) {
    setEnderecos(prev => prev.filter(e => e.id !== id))
  }

  function salvarEndereco() {
    if (!novoEndereco.rua || !novoEndereco.numero || !novoEndereco.cidade) return
    const new_e: Endereco = {
      id: `e${Date.now()}`,
      apelido: novoEndereco.apelido || 'Novo Endereço',
      nome: 'Usuário Kainow',
      cep: novoEndereco.cep || '',
      rua: novoEndereco.rua || '',
      numero: novoEndereco.numero || '',
      complemento: novoEndereco.complemento,
      bairro: novoEndereco.bairro || '',
      cidade: novoEndereco.cidade || '',
      uf: novoEndereco.uf || '',
      telefone: novoEndereco.telefone || '',
      padrao: enderecos.length === 0,
      tipo: (novoEndereco.tipo as Endereco['tipo']) || 'casa',
    }
    setEnderecos(prev => [...prev, new_e])
    setAddingEndereco(false)
    setNovoEndereco({ tipo: 'casa' })
  }

  function enviarAvaliacao() {
    if (!avaliacaoModal || avalRating === 0) return
    setAvalEnviada(prev => [...prev, avaliacaoModal.pedidoId])
    setAvaliacaoModal(null)
    setAvalRating(0)
    setAvalTitulo('')
    setAvalComentario('')
  }

  const menuItems = [
    { id: 'pedidos', label: 'Meus pedidos', icon: <ShoppingBag size={18} />, badge: null },
    { id: 'favoritos', label: 'Favoritos', icon: <Heart size={18} />, badge: favoritosMock.length },
    { id: 'enderecos', label: 'Endereços', icon: <MapPin size={18} />, badge: enderecos.length },
    { id: 'cartoes', label: 'Cartões', icon: <CreditCard size={18} />, badge: null },
    { id: 'notificacoes', label: 'Notificações', icon: <Bell size={18} />, badge: notifState.unread || null },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings size={18} />, badge: null },
    { id: 'sair', label: 'Sair', icon: <LogOut size={18} />, badge: null },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* Header perfil */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-6 text-white mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-white/30">
          <span className="text-white font-black text-2xl">U</span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-black">Usuário Kainow</h1>
          <p className="text-orange-100 text-sm">usuario@kainow.com.br</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-orange-100">
              <Shield size={12} /> Conta verificada
            </div>
            <div className="flex items-center gap-1.5 text-xs text-orange-100">
              <Star size={12} className="fill-yellow-300 text-yellow-300" /> Cliente Premium
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-2xl font-black">340</p>
            <p className="text-xs text-orange-100">Kainow Points</p>
          </div>
          <Link href="/vendedor" className="bg-white text-orange-600 font-bold px-4 py-1.5 rounded-xl text-sm hover:bg-orange-50 transition">
            Ser vendedor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Sidebar nav */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 h-fit">
          {menuItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => item.id === 'sair' ? window.location.href = '/login' : setActiveSection(item.id)}
              className={`w-full flex items-center justify-between py-3 px-3 rounded-xl transition ${
                activeSection === item.id
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } ${i < menuItems.length - 1 ? 'mb-0.5' : ''} ${item.id === 'sair' ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : ''}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeSection === item.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-2 space-y-4">

          {/* ══ PEDIDOS ══ */}
          {activeSection === 'pedidos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <ShoppingBag size={20} /> Meus pedidos
                </h2>
                <span className="text-sm text-gray-400">{mockPedidosRastreio.length} pedidos</span>
              </div>

              {mockPedidosRastreio.map(pedido => {
                const isOpen = pedidoAberto === pedido.numero
                const statusCls = statusColor[pedido.status] || 'bg-gray-100 text-gray-700'
                const jaAvaliado = avalEnviada.includes(pedido.numero)

                return (
                  <div key={pedido.numero} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Cabeçalho do pedido */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={pedido.produto.imagem}
                          alt={pedido.produto.titulo}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                              <p className="text-xs text-gray-400">{pedido.numero} · {pedido.dataPedido}</p>
                              <p className="text-sm font-medium text-gray-800 line-clamp-1 mt-0.5">{pedido.produto.titulo}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusCls}`}>
                              {statusLabel[pedido.status]}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-bold text-gray-900">{formatPrice(pedido.produto.preco)}</p>
                            <div className="flex items-center gap-2">
                              {/* Avaliar pedido entregue */}
                              {pedido.status === 'entregue' && (
                                jaAvaliado ? (
                                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                    <Check size={12} /> Avaliado
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setAvaliacaoModal({ pedidoId: pedido.numero, titulo: pedido.produto.titulo, img: pedido.produto.imagem })}
                                    className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-3 py-1.5 rounded-xl transition"
                                  >
                                    <Star size={12} /> Avaliar
                                  </button>
                                )
                              )}
                              <button
                                onClick={() => setPedidoAberto(isOpen ? null : pedido.numero)}
                                className="flex items-center gap-1 text-xs text-orange-600 font-medium hover:underline"
                              >
                                {isOpen ? <><ChevronUp size={13} /> Fechar</> : <><ChevronDown size={13} /> Rastrear</>}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline de Rastreio */}
                    {isOpen && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold text-gray-800">Código: <span className="text-orange-600 font-mono">{pedido.codigoRastreio}</span></p>
                            <p className="text-xs text-gray-500">Transportadora: {pedido.transportadora}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Previsão</p>
                            <p className="text-sm font-bold text-gray-800">{pedido.previsaoEntrega}</p>
                          </div>
                        </div>

                        {/* Timeline visual */}
                        <div className="relative">
                          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                          <div className="space-y-4">
                            {pedido.etapas.map((etapa, ei) => (
                              <div key={etapa.status} className={`relative flex items-start gap-4 ${!etapa.concluida && !etapa.ativa ? 'opacity-40' : ''}`}>
                                {/* Ícone */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                                  etapa.concluida ? 'bg-green-500 text-white' :
                                  etapa.ativa ? 'bg-orange-500 text-white ring-4 ring-orange-100' :
                                  'bg-gray-200 text-gray-400'
                                }`}>
                                  {etapa.concluida ? <Check size={16} /> : etapa.icon}
                                </div>
                                {/* Info */}
                                <div className="flex-1 pt-1 pb-2">
                                  <p className={`text-sm font-semibold ${etapa.ativa ? 'text-orange-600' : etapa.concluida ? 'text-green-700' : 'text-gray-500'}`}>
                                    {etapa.label}
                                  </p>
                                  <p className="text-xs text-gray-500">{etapa.descricao}</p>
                                  {etapa.local && <p className="text-xs text-gray-400 mt-0.5">📍 {etapa.local}</p>}
                                  {etapa.data && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {etapa.data} · {etapa.hora}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Endereço de entrega */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Entregar em:</p>
                          <p className="text-sm text-gray-800">
                            {pedido.endereco.rua} — {pedido.endereco.cidade}, {pedido.endereco.uf}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ══ FAVORITOS ══ */}
          {activeSection === 'favoritos' && (
            <div>
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4">
                <Heart size={20} /> Favoritos ({favoritosMock.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoritosMock.map(p => (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3 hover:shadow-md transition">
                    <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{p.title}</p>
                      <p className="text-base font-bold text-gray-900 mt-1">{formatPrice(p.price)}</p>
                      <Link href={`/produto/${p.id}`}
                        className="text-xs text-orange-600 hover:underline mt-1 inline-block">
                        Ver produto
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ ENDEREÇOS ══ */}
          {activeSection === 'enderecos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <MapPin size={20} /> Meus endereços
                </h2>
                <button
                  onClick={() => setAddingEndereco(true)}
                  className="flex items-center gap-1.5 bg-orange-500 text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-orange-600 transition"
                >
                  <Plus size={15} /> Adicionar
                </button>
              </div>

              {/* Formulário novo endereço */}
              {addingEndereco && (
                <div className="bg-white rounded-2xl border border-orange-200 p-4 mb-4">
                  <p className="font-semibold text-gray-800 mb-3">Novo endereço</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Apelido (ex: Casa)" value={novoEndereco.apelido || ''} onChange={e => setNovoEndereco(p => ({...p, apelido: e.target.value}))}
                      className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <input placeholder="CEP" value={novoEndereco.cep || ''} onChange={e => setNovoEndereco(p => ({...p, cep: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <input placeholder="Rua" value={novoEndereco.rua || ''} onChange={e => setNovoEndereco(p => ({...p, rua: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <input placeholder="Número" value={novoEndereco.numero || ''} onChange={e => setNovoEndereco(p => ({...p, numero: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <input placeholder="Complemento (opcional)" value={novoEndereco.complemento || ''} onChange={e => setNovoEndereco(p => ({...p, complemento: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <input placeholder="Bairro" value={novoEndereco.bairro || ''} onChange={e => setNovoEndereco(p => ({...p, bairro: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <input placeholder="Cidade" value={novoEndereco.cidade || ''} onChange={e => setNovoEndereco(p => ({...p, cidade: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                    <select value={novoEndereco.uf || ''} onChange={e => setNovoEndereco(p => ({...p, uf: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
                      <option value="">UF</option>
                      {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                    <input placeholder="Telefone" value={novoEndereco.telefone || ''} onChange={e => setNovoEndereco(p => ({...p, telefone: e.target.value}))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={salvarEndereco}
                      className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition">
                      Salvar endereço
                    </button>
                    <button onClick={() => setAddingEndereco(false)}
                      className="text-sm text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {enderecos.map(e => (
                <div key={e.id} className={`bg-white rounded-2xl border p-4 mb-3 ${e.padrao ? 'border-orange-300' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{e.tipo === 'casa' ? '🏠' : e.tipo === 'trabalho' ? '🏢' : '📍'}</span>
                      <span className="font-bold text-gray-800">{e.apelido}</span>
                      {e.padrao && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Padrão</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!e.padrao && (
                        <button onClick={() => definirPadrao(e.id)}
                          className="text-xs text-gray-500 hover:text-orange-600 border border-gray-200 px-2 py-1 rounded-lg hover:border-orange-300 transition">
                          Tornar padrão
                        </button>
                      )}
                      <button onClick={() => removerEndereco(e.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{e.nome}</p>
                  <p className="text-sm text-gray-600">{e.rua}, {e.numero}{e.complemento ? `, ${e.complemento}` : ''}</p>
                  <p className="text-sm text-gray-600">{e.bairro} · {e.cidade}, {e.uf} · {e.cep}</p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Phone size={12} /> {e.telefone}</p>
                </div>
              ))}
            </div>
          )}

          {/* ══ CARTÕES ══ */}
          {activeSection === 'cartoes' && (
            <div>
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4">
                <CreditCard size={20} /> Meus cartões
              </h2>
              {cartoesMock.map(c => (
                <div key={c.id} className={`bg-white rounded-2xl border p-4 mb-3 flex items-center justify-between ${c.padrao ? 'border-orange-300' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{c.bandeira[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{c.bandeira} •••• {c.ultimos4}</p>
                      <p className="text-xs text-gray-500">Validade: {c.validade}</p>
                    </div>
                    {c.padrao && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Padrão</span>}
                  </div>
                  <button className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-orange-300 hover:text-orange-600 transition">
                <Plus size={16} /> Adicionar novo cartão
              </button>
            </div>
          )}

          {/* ══ NOTIFICAÇÕES ══ */}
          {activeSection === 'notificacoes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Bell size={20} /> Notificações
                  {notifState.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{notifState.unread}</span>
                  )}
                </h2>
                {notifState.unread > 0 && (
                  <button onClick={() => notifDispatch({ type: 'MARK_ALL_READ' })}
                    className="text-sm text-orange-600 hover:underline">
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {notifState.notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex gap-3 p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition ${!n.read ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}
                    onClick={() => notifDispatch({ type: 'MARK_READ', id: n.id })}
                  >
                    <span className="text-2xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{n.date}</p>
                        {n.actionLabel && n.link && (
                          <Link href={n.link}
                            onClick={() => notifDispatch({ type: 'MARK_READ', id: n.id })}
                            className="text-xs text-orange-600 font-semibold hover:underline">
                            {n.actionLabel} →
                          </Link>
                        )}
                      </div>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ CONFIGURAÇÕES ══ */}
          {activeSection === 'configuracoes' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5">Configurações da conta</h2>
              <div className="space-y-4">
                {[
                  { label: 'Nome completo', value: 'Usuário Kainow', type: 'text' },
                  { label: 'E-mail', value: 'usuario@kainow.com.br', type: 'email' },
                  { label: 'CPF', value: '•••.•••.•••-12', type: 'text' },
                  { label: 'Telefone', value: '(11) 99999-0000', type: 'tel' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <input type={field.type} defaultValue={field.value}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                      <button className="p-2 text-gray-400 hover:text-orange-600 border border-gray-200 rounded-xl hover:border-orange-300 transition">
                        <Edit3 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100">
                  <button className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition">
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══ MODAL AVALIAÇÃO ══ */}
      {avaliacaoModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Avaliar produto</h3>
              <button onClick={() => setAvaliacaoModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img src={avaliacaoModal.img} alt="" className="w-14 h-14 object-cover rounded-xl" />
                <p className="text-sm text-gray-800 font-medium line-clamp-2">{avaliacaoModal.titulo}</p>
              </div>

              {/* Estrelas */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Sua nota:</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s}
                      onMouseEnter={() => setAvalHover(s)}
                      onMouseLeave={() => setAvalHover(0)}
                      onClick={() => setAvalRating(s)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star size={32} className={s <= (avalHover || avalRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    </button>
                  ))}
                </div>
                {avalRating > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente!'][avalRating]}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Título</label>
                <input type="text" value={avalTitulo} onChange={e => setAvalTitulo(e.target.value)}
                  placeholder="Resumo da sua experiência"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Comentário</label>
                <textarea value={avalComentario} onChange={e => setAvalComentario(e.target.value)}
                  rows={3} placeholder="Conte como foi sua experiência com o produto..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none" />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Camera size={14} />
                <span>Adicionar fotos (em breve)</span>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={enviarAvaliacao}
                disabled={avalRating === 0}
                className="flex-1 bg-orange-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
                Enviar avaliação
              </button>
              <button onClick={() => setAvaliacaoModal(null)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
