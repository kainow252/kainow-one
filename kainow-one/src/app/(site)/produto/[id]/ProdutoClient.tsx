'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Star, ShoppingCart, Heart, Truck, Shield, RotateCcw,
  ChevronRight, Minus, Plus, Share2, MessageCircle,
  Package, ThumbsUp, Camera, ChevronDown, ChevronUp,
  MapPin, Clock, Zap, Check, AlertCircle
} from 'lucide-react'
import { getProductById, products, formatPrice } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import ProductCard from '@/components/produto/ProductCard'
import { lookupCep, calcularFrete, formatCep, FreteOption } from '@/lib/frete'

export default function ProdutoClient() {
  const params = useParams()
  const product = getProductById(params.id as string)
  const { dispatch } = useCart()

  // Imagens
  const [selectedImg, setSelectedImg]   = useState(0)
  const [liked, setLiked]               = useState(false)
  const [qty, setQty]                   = useState(1)
  const [addedCart, setAddedCart]       = useState(false)

  // Variações
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({})

  // Frete
  const [cepInput, setCepInput]         = useState('')
  const [freteOpcoes, setFreteOpcoes]   = useState<FreteOption[] | null>(null)
  const [freteLoading, setFreteLoading] = useState(false)
  const [freteErro, setFreteErro]       = useState('')
  const [cepInfo, setCepInfo]           = useState('')

  // Reviews
  const [reviewTab, setReviewTab]       = useState<'reviews' | 'qna'>('reviews')
  const [reviewFilter, setReviewFilter] = useState(0)   // 0 = todos
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [newQuestion, setNewQuestion]   = useState('')
  const [questionSent, setQuestionSent] = useState(false)
  const [helpfulMap, setHelpfulMap]     = useState<Record<string, boolean>>({})
  const [shareCopied, setShareCopied]   = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Produto não encontrado</h2>
        <Link href="/" className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition">
          Voltar ao início
        </Link>
      </div>
    )
  }

  // Preço com modificadores de variação
  const priceModifier = useMemo(() => {
    if (!product.variations) return 0
    return Object.entries(selectedVariations).reduce((acc, [label, value]) => {
      const variation = product.variations!.find(v => v.label === label)
      const option = variation?.options.find(o => o.value === value)
      return acc + (option?.priceModifier || 0)
    }, 0)
  }, [selectedVariations, product.variations])

  const finalPrice = product.price + priceModifier
  const allImgs = product.images.length > 0 ? product.images : [product.image]
  const related  = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  // Imagem da variação de cor selecionada
  const colorImage = useMemo(() => {
    if (!product.variations) return null
    const colorVar = product.variations.find(v => v.label === 'Cor')
    if (!colorVar) return null
    const sel = selectedVariations['Cor']
    if (!sel) return null
    return colorVar.options.find(o => o.value === sel)?.image || null
  }, [selectedVariations, product.variations])

  const displayImg = colorImage || allImgs[selectedImg]

  function addToCart() {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: 'ADD_ITEM', product: { ...product, price: finalPrice } })
    }
    setAddedCart(true)
    setTimeout(() => setAddedCart(false), 2000)
  }

  function selectVariation(label: string, value: string) {
    setSelectedVariations(prev => ({ ...prev, [label]: value }))
  }

  async function calcFrete() {
    const cleaned = cepInput.replace(/\D/g, '')
    if (cleaned.length !== 8) {
      setFreteErro('Digite um CEP válido com 8 dígitos')
      return
    }
    setFreteLoading(true)
    setFreteErro('')
    setFreteOpcoes(null)
    const info = await lookupCep(cleaned)
    if (!info.valid) {
      setFreteErro(info.errorMsg || 'CEP não encontrado')
      setFreteLoading(false)
      return
    }
    setCepInfo(`${info.localidade}, ${info.uf}`)
    const opcoes = calcularFrete(info.uf, finalPrice, product.category, product.freeShipping)
    setFreteOpcoes(opcoes)
    setFreteLoading(false)
  }

  // Distribuição de estrelas
  const reviews = product.reviewsList || []
  const starDist = useMemo(() => {
    const dist = [0,0,0,0,0]
    reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++ })
    return dist.reverse() // 5,4,3,2,1
  }, [reviews])

  const filteredReviews = reviewFilter === 0 ? reviews : reviews.filter(r => r.rating === reviewFilter)
  const qna = product.qna || []

  function toggleHelpful(id: string) {
    setHelpfulMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-orange-600">Início</Link>
        <ChevronRight size={14} />
        <Link href={`/busca?categoria=${product.category}`} className="hover:text-orange-600 capitalize">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 line-clamp-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {/* ── IMAGENS ── */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 aspect-square relative group">
            <img
              src={displayImg}
              alt={product.title}
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition"
            >
              <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          </div>
          {allImgs.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {allImgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === selectedImg ? 'border-orange-500' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Compartilhar */}
          <button
            onClick={async () => {
              const url = typeof window !== 'undefined' ? window.location.href : ''
              const text = `${product.title} — R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Kainow One`
              if (typeof navigator !== 'undefined' && navigator.share) {
                try {
                  await navigator.share({ title: product.title, text, url })
                } catch {/* cancelado pelo usuário */}
              } else {
                // Fallback: copia link para área de transferência
                try {
                  await navigator.clipboard.writeText(url)
                  setShareCopied(true)
                  setTimeout(() => setShareCopied(false), 2500)
                } catch {
                  // fallback manual para navegadores sem Clipboard API
                  const el = document.createElement('textarea')
                  el.value = url
                  document.body.appendChild(el)
                  el.select()
                  document.execCommand('copy')
                  document.body.removeChild(el)
                  setShareCopied(true)
                  setTimeout(() => setShareCopied(false), 2500)
                }
              }
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 text-sm border rounded-xl transition ${
              shareCopied
                ? 'text-green-600 border-green-400 bg-green-50'
                : 'text-gray-500 hover:text-orange-600 border-gray-200 hover:border-orange-300'
            }`}
          >
            {shareCopied ? <><Check size={15} /> Link copiado!</> : <><Share2 size={15} /> Compartilhar produto</>}
          </button>
        </div>

        {/* ── INFO + VARIAÇÕES ── */}
        <div className="space-y-4">
          {product.freeShipping && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
              <Truck size={12} /> Frete grátis neste produto
            </span>
          )}

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>

          {/* Rating resumo */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="font-bold text-gray-800">{product.rating}</span>
            <button
              onClick={() => { setReviewTab('reviews'); document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-orange-600 text-sm hover:underline"
            >
              {product.reviews.toLocaleString('pt-BR')} avaliações
            </button>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">{product.sold.toLocaleString('pt-BR')} vendidos</span>
          </div>

          {/* Preço */}
          <div className="bg-gray-50 rounded-xl p-4">
            {product.originalPrice && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice + priceModifier)}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}% OFF</span>
              </div>
            )}
            <p className="text-3xl font-black text-gray-900">{formatPrice(finalPrice)}</p>
            {product.installments && (
              <p className="text-green-600 font-medium mt-1">
                em <strong>{product.installments}x</strong> de {formatPrice(finalPrice / product.installments)} <span className="font-normal text-sm">sem juros</span>
              </p>
            )}
            {priceModifier !== 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {priceModifier > 0 ? `+${formatPrice(priceModifier)}` : formatPrice(priceModifier)} pela variação selecionada
              </p>
            )}
          </div>

          {/* ── VARIAÇÕES ── */}
          {product.variations && product.variations.map(variation => (
            <div key={variation.label}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {variation.label}:
                {selectedVariations[variation.label] && (
                  <span className="font-normal text-orange-600 ml-1">{selectedVariations[variation.label]}</span>
                )}
              </p>

              {variation.label === 'Cor' ? (
                // Selector de cores com círculo colorido
                <div className="flex flex-wrap gap-2">
                  {variation.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => selectVariation(variation.label, opt.value)}
                      title={opt.value}
                      disabled={opt.unavailable}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedVariations[variation.label] === opt.value
                          ? 'border-orange-500 ring-2 ring-orange-300'
                          : 'border-gray-200'
                      } ${opt.unavailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: opt.colorHex || '#ccc' }}
                    >
                      {selectedVariations[variation.label] === opt.value && (
                        <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                // Selector de texto (tamanho, memória)
                <div className="flex flex-wrap gap-2">
                  {variation.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => !opt.unavailable && selectVariation(variation.label, opt.value)}
                      disabled={opt.unavailable}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedVariations[variation.label] === opt.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300 hover:text-orange-600 text-gray-700'
                      } ${opt.unavailable ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                    >
                      {opt.value}
                      {opt.priceModifier && opt.priceModifier > 0 && (
                        <span className="text-xs text-gray-400 ml-1">+{formatPrice(opt.priceModifier)}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quantidade + CTA */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quantidade ({product.stock} disponíveis)</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Total: <strong>{formatPrice(finalPrice * qty)}</strong></span>
              </div>
            </div>

            <button
              onClick={addToCart}
              className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${addedCart ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              <ShoppingCart size={20} />
              {addedCart ? '✓ Adicionado ao carrinho!' : 'Adicionar ao carrinho'}
            </button>

            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition"
              onClick={() => dispatch({ type: 'ADD_ITEM', product: { ...product, price: finalPrice } })}
            >
              Comprar agora
            </Link>
          </div>

          {/* Specs resumo */}
          {Object.keys(product.specs).length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Especificações principais</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">{key}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR: FRETE + VENDEDOR + GARANTIAS ── */}
        <div className="space-y-4">

          {/* Calculadora de Frete */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Truck size={18} className="text-green-600" /> Calcular frete
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="00000-000"
                value={cepInput}
                onChange={e => setCepInput(formatCep(e.target.value))}
                onKeyDown={e => e.key === 'Enter' && calcFrete()}
                maxLength={9}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
              />
              <button
                onClick={calcFrete}
                disabled={freteLoading}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                {freteLoading ? '...' : 'OK'}
              </button>
            </div>
            <a href="https://buscacepinter.correios.com.br" target="_blank" rel="noopener noreferrer"
              className="text-xs text-orange-600 hover:underline">
              Não sei meu CEP
            </a>

            {freteErro && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle size={13} /> {freteErro}
              </div>
            )}

            {freteOpcoes && (
              <div className="mt-3 space-y-2">
                {cepInfo && <p className="text-xs text-gray-500 mb-2"><MapPin size={11} className="inline mr-1" />{cepInfo}</p>}
                {freteOpcoes.map(op => (
                  <div key={op.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{op.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{op.nome}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {op.prazoExato}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {op.gratis ? (
                        <p className="text-sm font-bold text-green-600">Grátis</p>
                      ) : (
                        <p className="text-sm font-bold text-gray-800">{formatPrice(op.preco)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {product.freeShipping && !freteOpcoes && (
              <div className="mt-2 flex items-center gap-2 text-green-600 text-xs font-medium">
                <Check size={13} /> Este produto tem frete grátis!
              </div>
            )}
          </div>

          {/* Vendedor */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="font-bold text-gray-800 mb-3">Vendedor</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-black text-lg">{product.seller[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{product.seller}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.sellerReputation === 'Platinum' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {product.sellerReputation === 'Platinum' ? '💜 Platinum' : '🥇 Gold'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 mb-1">
              {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-yellow-400 text-yellow-400" />)}
              <span className="text-xs text-gray-500 ml-1">Vendedor verificado</span>
            </div>
            <p className="text-xs text-gray-500">📍 {product.location}</p>
            <button className="mt-3 w-full border border-orange-200 text-orange-600 py-2 rounded-xl text-sm font-medium hover:bg-orange-50 transition flex items-center justify-center gap-2">
              <MessageCircle size={15} /> Fazer pergunta
            </button>
          </div>

          {/* Garantias */}
          <div className="bg-orange-50 rounded-2xl p-4 space-y-3">
            {[
              { icon: <Shield size={16} className="text-orange-600" />, text: "Compra garantida: seu dinheiro de volta" },
              { icon: <RotateCcw size={16} className="text-orange-600" />, text: "Devolução grátis em 30 dias" },
              { icon: <Package size={16} className="text-orange-600" />, text: "Produto 100% original verificado" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-orange-900">
                {item.icon} {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESCRIÇÃO + SPECS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Descrição</h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Especificações técnicas</h2>
          <dl className="space-y-2">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                <dt className="text-sm text-gray-500">{key}</dt>
                <dd className="text-sm font-semibold text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ══ AVALIAÇÕES + Q&A ══ */}
      <div id="reviews-section" className="bg-white rounded-2xl border border-gray-100 p-6 mb-10">

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-100">
          <button
            onClick={() => setReviewTab('reviews')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${reviewTab === 'reviews' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            ⭐ Avaliações ({reviews.length})
          </button>
          <button
            onClick={() => setReviewTab('qna')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${reviewTab === 'qna' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            ❓ Perguntas & Respostas ({qna.length})
          </button>
        </div>

        {/* ── REVIEWS ── */}
        {reviewTab === 'reviews' && (
          <>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Star size={40} className="mx-auto mb-3 opacity-30" />
                <p>Seja o primeiro a avaliar este produto!</p>
              </div>
            ) : (
              <>
                {/* Resumo geral */}
                <div className="flex flex-col md:flex-row gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">{product.rating}</p>
                    <div className="flex justify-center gap-0.5 my-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={18} className={s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{reviews.length} avaliações</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {starDist.map((count, i) => {
                      const star = 5 - i
                      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
                      return (
                        <button
                          key={star}
                          onClick={() => setReviewFilter(reviewFilter === star ? 0 : star)}
                          className={`w-full flex items-center gap-2 text-xs hover:opacity-80 transition ${reviewFilter === star ? 'opacity-100' : 'opacity-70'}`}
                        >
                          <span className="w-4 text-right font-medium text-gray-700">{star}</span>
                          <Star size={11} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-yellow-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-gray-500">{pct}%</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Filtro ativo */}
                {reviewFilter > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Filtrando: {reviewFilter} estrelas</span>
                    <button onClick={() => setReviewFilter(0)} className="text-xs text-orange-600 hover:underline">Limpar filtro</button>
                  </div>
                )}

                {/* Lista de reviews */}
                <div className="space-y-4">
                  {filteredReviews.map(review => (
                    <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-orange-600">
                          {review.userAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-800 text-sm">{review.userName}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={10} /> Compra verificada
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={13} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                          {review.variantPurchased && (
                            <p className="text-xs text-gray-400 mt-0.5">Variação: {review.variantPurchased}</p>
                          )}
                          <p className="font-semibold text-gray-800 mt-2 text-sm">{review.title}</p>
                          <p className={`text-sm text-gray-600 mt-1 leading-relaxed ${expandedReview !== review.id && review.comment.length > 150 ? 'line-clamp-3' : ''}`}>
                            {review.comment}
                          </p>
                          {review.comment.length > 150 && (
                            <button
                              onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                              className="text-xs text-orange-600 mt-1 hover:underline flex items-center gap-1"
                            >
                              {expandedReview === review.id ? <><ChevronUp size={12} /> Mostrar menos</> : <><ChevronDown size={12} /> Ler mais</>}
                            </button>
                          )}

                          {/* Fotos da review */}
                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.photos.map((photo, pi) => (
                                <div key={pi} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                                  <img src={photo} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              <div className="w-16 h-16 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center">
                                <Camera size={20} className="text-gray-300" />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-gray-400">Útil?</span>
                            <button
                              onClick={() => toggleHelpful(review.id)}
                              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition ${helpfulMap[review.id] ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500 hover:border-orange-300'}`}
                            >
                              <ThumbsUp size={11} />
                              {review.helpfulCount + (helpfulMap[review.id] ? 1 : 0)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── Q&A ── */}
        {reviewTab === 'qna' && (
          <>
            {/* Fazer pergunta */}
            {!questionSent ? (
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Faça uma pergunta sobre este produto</p>
                <textarea
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  rows={3}
                  placeholder="Ex: Qual é a garantia deste produto?"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"
                />
                <button
                  onClick={() => { if (newQuestion.trim()) { setQuestionSent(true) } }}
                  disabled={!newQuestion.trim()}
                  className="mt-2 bg-orange-500 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Enviar pergunta
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-3">
                <Check size={20} className="text-green-600" />
                <p className="text-sm text-green-700 font-medium">Pergunta enviada! O vendedor responderá em breve.</p>
              </div>
            )}

            {/* Lista de Q&A */}
            <div className="space-y-4">
              {qna.map(q => (
                <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-lg flex-shrink-0">❓</span>
                    <div>
                      <p className="text-sm text-gray-800">{q.question}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{q.questionUserName} · {q.questionDate}</p>
                    </div>
                  </div>
                  {q.answer && (
                    <div className="flex items-start gap-2 ml-6 bg-orange-50 rounded-lg p-3">
                      <span className="text-lg flex-shrink-0">💬</span>
                      <div>
                        <p className="text-sm text-gray-800">{q.answer}</p>
                        <p className="text-xs text-orange-600 font-semibold mt-0.5">{q.sellerName} · {q.answerDate}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 ml-6">
                    <span className="text-xs text-gray-400">Útil?</span>
                    <button
                      onClick={() => toggleHelpful(`qna-${q.id}`)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition ${helpfulMap[`qna-${q.id}`] ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500 hover:border-orange-300'}`}
                    >
                      <ThumbsUp size={11} />
                      {q.helpful + (helpfulMap[`qna-${q.id}`] ? 1 : 0)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Produtos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
