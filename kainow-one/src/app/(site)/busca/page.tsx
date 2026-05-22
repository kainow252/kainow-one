'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SlidersHorizontal, ChevronDown, Star, X, Grid, List, ChevronRight } from 'lucide-react'
import { products, categories, searchProducts, getProductsByCategory, formatPrice } from '@/lib/data'
import ProductCard from '@/components/produto/ProductCard'
import { Suspense } from 'react'

function BuscaContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const cat = searchParams.get('categoria') || ''

  const [sortBy, setSortBy] = useState('relevance')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [freeShipping, setFreeShipping] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [filterOpen, setFilterOpen] = useState(false)

  let results = cat ? getProductsByCategory(cat) : (q ? searchProducts(q) : products)

  if (freeShipping) results = results.filter(p => p.freeShipping)
  if (minRating > 0) results = results.filter(p => p.rating >= minRating)
  if (priceMin) results = results.filter(p => p.price >= Number(priceMin))
  if (priceMax) results = results.filter(p => p.price <= Number(priceMax))

  if (sortBy === 'price_asc') results = [...results].sort((a, b) => a.price - b.price)
  else if (sortBy === 'price_desc') results = [...results].sort((a, b) => b.price - a.price)
  else if (sortBy === 'rating') results = [...results].sort((a, b) => b.rating - a.rating)
  else if (sortBy === 'sold') results = [...results].sort((a, b) => b.sold - a.sold)

  const category = categories.find(c => c.id === cat)
  const title = category ? category.name : (q ? `"${q}"` : 'Todos os produtos')

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-700">Início</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">{title}</span>
      </div>

      <div className="flex gap-6">
        {/* SIDEBAR FILTERS — desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filtros
            </h3>

            {/* Category filter */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categoria</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/busca" className={`text-sm block py-1 px-2 rounded hover:bg-blue-50 hover:text-blue-700 ${!cat ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}>
                    Todos
                  </Link>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <Link href={`/busca?categoria=${c.id}`} className={`text-sm block py-1 px-2 rounded hover:bg-blue-50 hover:text-blue-700 ${cat === c.id ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'}`}>
                      {c.icon} {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preço</p>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-400" />
                <span className="text-gray-400">—</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>

            {/* Free shipping */}
            <div className="mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={freeShipping} onChange={e => setFreeShipping(e.target.checked)}
                  className="w-4 h-4 accent-blue-700" />
                <span className="text-sm text-gray-700">🚚 Frete grátis</span>
              </label>
            </div>

            {/* Rating */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Avaliação mínima</p>
              {[4, 3, 2, 0].map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer mb-1.5">
                  <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-blue-700" />
                  <div className="flex">
                    {r === 0 ? <span className="text-sm text-gray-500">Todos</span> : (
                      [1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={s <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                      ))
                    )}
                  </div>
                  {r > 0 && <span className="text-xs text-gray-500">ou mais</span>}
                </label>
              ))}
            </div>

            <button onClick={() => { setPriceMin(''); setPriceMax(''); setFreeShipping(false); setMinRating(0) }}
              className="w-full text-sm text-blue-700 hover:underline">
              Limpar filtros
            </button>
          </div>
        </aside>

        {/* RESULTS */}
        <div className="flex-1 min-w-0">
          {/* Result header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-500">{results.length} resultados</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-lg bg-white hover:bg-gray-50">
                <SlidersHorizontal size={15} /> Filtros
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 px-3 py-2 rounded-lg bg-white outline-none focus:border-blue-400"
              >
                <option value="relevance">Mais relevantes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="rating">Melhor avaliados</option>
                <option value="sold">Mais vendidos</option>
              </select>
            </div>
          </div>

          {/* Mobile filters */}
          {filterOpen && (
            <div className="md:hidden bg-white border border-gray-100 rounded-xl p-4 mb-4">
              <div className="flex gap-2 mb-3">
                <input type="number" placeholder="Preço min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none" />
                <input type="number" placeholder="Preço max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={freeShipping} onChange={e => setFreeShipping(e.target.checked)} className="accent-blue-700" />
                <span className="text-sm">Frete grátis</span>
              </label>
            </div>
          )}

          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum produto encontrado</h2>
              <p className="text-gray-500 mb-4">Tente outros termos ou categorias</p>
              <Link href="/busca" className="text-blue-700 font-semibold hover:underline">Ver todos os produtos</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaContent />
    </Suspense>
  )
}
