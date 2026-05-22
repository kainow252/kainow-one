'use client'

import { useState, useRef } from 'react'
import { Package, Star, Plus, Bell, DollarSign, Eye, Edit, Trash2, BarChart2, X, CheckCircle } from 'lucide-react'
import { products, categories, formatPrice } from '@/lib/data'

// ── tipos ──────────────────────────────────────────────────
type Anuncio = {
  id: string
  nome: string
  categoria: string
  preco: number
  precoOriginal?: number
  estoque: number
  descricao: string
  badge?: string
  imagem: string
  status: 'ativo' | 'pausado'
}

const EMPTY_FORM: Omit<Anuncio, 'id' | 'status'> = {
  nome: '', categoria: 'Eletrônicos', preco: 0, precoOriginal: undefined,
  estoque: 0, descricao: '', badge: '', imagem: '📦',
}

// Seed inicial de anúncios a partir dos produtos reais
function buildAnuncios(): Anuncio[] {
  return products.slice(0, 5).map(p => ({
    id: p.id,
    nome: p.title,
    categoria: p.category,
    preco: p.price,
    precoOriginal: p.originalPrice,
    estoque: p.stock,
    descricao: p.description,
    badge: p.badge,
    imagem: p.image || '📦',
    status: p.stock === 0 ? 'pausado' : 'ativo',
  }))
}

// ── componente principal ────────────────────────────────────
export default function VendedorPage() {
  // ── estados — TODOS no topo (Rules of Hooks) ──
  const [activeTab, setActiveTab]       = useState('dashboard')
  const [anuncios, setAnuncios]         = useState<Anuncio[]>(buildAnuncios)
  const [showModal, setShowModal]       = useState(false)
  const [editTarget, setEditTarget]     = useState<Anuncio | null>(null)
  const [form, setForm]                 = useState<Omit<Anuncio, 'id' | 'status'>>({ ...EMPTY_FORM })
  const [toast, setToast]               = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // ── helpers ──
  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function openNovo() {
    setEditTarget(null)
    setForm({ ...EMPTY_FORM })
    setShowModal(true)
  }

  function openEdit(a: Anuncio) {
    setEditTarget(a)
    setForm({
      nome: a.nome, categoria: a.categoria, preco: a.preco,
      precoOriginal: a.precoOriginal, estoque: a.estoque,
      descricao: a.descricao, badge: a.badge ?? '', imagem: a.imagem,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditTarget(null)
  }

  function salvar() {
    if (!form.nome.trim()) { showToast('⚠️ Informe o nome do produto'); return }
    if (!form.preco || form.preco <= 0) { showToast('⚠️ Informe um preço válido'); return }
    if (editTarget) {
      setAnuncios(prev => prev.map(a =>
        a.id === editTarget.id ? { ...a, ...form, status: form.estoque === 0 ? 'pausado' : 'ativo' } : a
      ))
      showToast(`✅ "${form.nome.slice(0, 28)}" atualizado!`)
    } else {
      const novo: Anuncio = {
        id: `V-${Date.now()}`,
        ...form,
        status: form.estoque === 0 ? 'pausado' : 'ativo',
      }
      setAnuncios(prev => [novo, ...prev])
      showToast('✅ Anúncio criado com sucesso!')
    }
    closeModal()
  }

  function excluir(id: string) {
    setAnuncios(prev => prev.filter(a => a.id !== id))
    setDeleteConfirm(null)
    showToast('🗑️ Anúncio removido.')
  }

  function toggleStatus(id: string) {
    setAnuncios(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'ativo' ? 'pausado' : 'ativo' } : a
    ))
  }

  const stats = [
    { label: 'Vendas este mês', value: 'R$ 12.450', sub: '+24% vs mês anterior', icon: <DollarSign size={22} className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Pedidos ativos',  value: '47',         sub: '12 aguardando envio',  icon: <Package size={22} className="text-blue-600" />,   color: 'bg-blue-50' },
    { label: 'Avaliação média', value: '4.9 ★',      sub: '312 avaliações',       icon: <Star size={22} className="text-yellow-500" />,    color: 'bg-yellow-50' },
    { label: 'Visitas hoje',    value: '1.204',       sub: '+8% vs ontem',         icon: <Eye size={22} className="text-purple-600" />,     color: 'bg-purple-50' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 animate-fade-in">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Central do Vendedor</h1>
          <p className="text-gray-500 text-sm">Bem-vindo de volta, <strong>TechStore Brasil</strong></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 bg-white rounded-xl border border-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={openNovo}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
          >
            <Plus size={16} /> Novo anúncio
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
        {[
          { id: 'dashboard',     label: '📊 Dashboard' },
          { id: 'produtos',      label: '📦 Meus anúncios' },
          { id: 'pedidos',       label: '🛍️ Pedidos' },
          { id: 'configuracoes', label: '⚙️ Configurações' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════ DASHBOARD ════════════════════ */}
      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
                <p className="text-2xl font-black text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2"><BarChart2 size={18} /> Vendas dos últimos 30 dias</h2>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
                <option>Últimos 30 dias</option>
                <option>Últimos 7 dias</option>
                <option>Este ano</option>
              </select>
            </div>
            <div className="h-40 flex items-end gap-2 px-4">
              {[30,50,40,70,55,80,65,90,75,85,60,95,70,80,88,72,65,78,85,92,70,66,80,88,75,90,85,95,88,100].map((v, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-sm opacity-80 hover:opacity-100 transition"
                  style={{ height: `${v}%` }} title={`Dia ${i+1}: R$ ${(v * 120).toLocaleString('pt-BR')}`} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Pedidos recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="pb-3 font-semibold">Pedido</th>
                    <th className="pb-3 font-semibold">Produto</th>
                    <th className="pb-3 font-semibold">Cliente</th>
                    <th className="pb-3 font-semibold">Valor</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { id: '#KNW-8821', product: 'iPhone 15 Pro Max',    client: 'João Silva',    value: 7999.99, status: 'Enviado',      color: 'bg-blue-100 text-blue-700' },
                    { id: '#KNW-8820', product: 'Samsung S24 Ultra',    client: 'Maria Santos',  value: 6299.00, status: 'Pago',         color: 'bg-green-100 text-green-700' },
                    { id: '#KNW-8819', product: 'Fone Sony WH-1000XM5', client: 'Pedro Costa',   value: 1899.00, status: 'Entregue',     color: 'bg-purple-100 text-purple-700' },
                    { id: '#KNW-8818', product: 'Apple Watch S9',       client: 'Ana Lima',      value: 3199.00, status: 'Processando', color: 'bg-yellow-100 text-yellow-700' },
                  ].map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 font-medium text-blue-700">{order.id}</td>
                      <td className="py-3 text-gray-700 max-w-[140px] truncate">{order.product}</td>
                      <td className="py-3 text-gray-500">{order.client}</td>
                      <td className="py-3 font-semibold text-gray-800">{formatPrice(order.value)}</td>
                      <td className="py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.color}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════ ANÚNCIOS ════════════════════ */}
      {activeTab === 'produtos' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">Meus anúncios ({anuncios.length})</h2>
            <button
              onClick={openNovo}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              <Plus size={15} /> Novo anúncio
            </button>
          </div>

          {anuncios.length === 0 && (
            <div className="text-center py-14 text-gray-400">
              <Package size={42} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">Nenhum anúncio ainda</p>
              <p className="text-sm mt-1">Clique em "Novo anúncio" para começar a vender</p>
            </div>
          )}

          <div className="space-y-3">
            {anuncios.map(a => (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {a.imagem.startsWith('http') ? (
                    <img src={a.imagem} alt={a.nome} className="w-full h-full object-cover" />
                  ) : a.imagem}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 truncate max-w-[200px]">{a.nome}</p>
                    {a.badge && <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">{a.badge}</span>}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.status === 'ativo' ? '● Ativo' : '○ Pausado'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{a.categoria} · Estoque: <strong>{a.estoque}</strong></p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice(a.preco)}</p>
                  {a.precoOriginal && a.precoOriginal > a.preco && (
                    <p className="text-xs text-gray-400 line-through">{formatPrice(a.precoOriginal)}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleStatus(a.id)}
                    title={a.status === 'ativo' ? 'Pausar' : 'Ativar'}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition text-xs font-semibold">
                    {a.status === 'ativo' ? '⏸' : '▶'}
                  </button>
                  <button onClick={() => openEdit(a)}
                    className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(a.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════ PEDIDOS ════════════════════ */}
      {activeTab === 'pedidos' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Pedidos</h2>
          <p className="text-gray-400 text-sm">Nenhum pedido no momento.</p>
        </div>
      )}

      {/* ════════════════════ CONFIGURAÇÕES ════════════════════ */}
      {activeTab === 'configuracoes' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
          <h2 className="font-bold text-gray-800 mb-6">Configurações da loja</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nome da loja</label>
              <input type="text" defaultValue="TechStore Brasil"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Descrição</label>
              <textarea rows={3} defaultValue="Especialistas em eletrônicos e tecnologia."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">E-mail de contato</label>
              <input type="email" defaultValue="contato@techstore.com.br"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
            </div>
            <button
              onClick={() => showToast('✅ Configurações salvas!')}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════ MODAL NOVO/EDITAR ANÚNCIO ════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h3 className="font-black text-gray-900 text-lg">
                  {editTarget ? '✏️ Editar anúncio' : '🆕 Novo anúncio'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Campos marcados com * são obrigatórios</p>
              </div>
              <button onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">

              {/* Nome */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Nome do produto *</label>
                <input
                  type="text"
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Preço + Preço original */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Preço de venda (R$) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={form.preco || ''}
                    onChange={e => setForm(f => ({ ...f, preco: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Preço original (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Opcional"
                    value={form.precoOriginal || ''}
                    onChange={e => setForm(f => ({ ...f, precoOriginal: parseFloat(e.target.value) || undefined }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Estoque + Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Estoque *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.estoque || ''}
                    onChange={e => setForm(f => ({ ...f, estoque: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Badge (ex: NOVO, HOT)</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={form.badge || ''}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Imagem / Emoji */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">URL da imagem ou emoji</label>
                <input
                  type="text"
                  placeholder="https://... ou 📦"
                  value={form.imagem}
                  onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Descrição do produto</label>
                <textarea
                  rows={3}
                  placeholder="Descreva os principais recursos, especificações e diferenciais..."
                  value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                {editTarget ? 'Salvar alterações' : 'Publicar anúncio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ CONFIRM DELETE ════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 mb-2">Remover anúncio?</h3>
            <p className="text-gray-500 text-sm mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={() => excluir(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition">
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
