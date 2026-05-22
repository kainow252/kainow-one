'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Star, Shield } from 'lucide-react'
import { banners, categories, products, getFeaturedProducts, formatPrice } from '@/lib/data'
import ProductCard from '@/components/produto/ProductCard'

export default function HomePage() {
  const [bannerIdx, setBannerIdx] = useState(0)
  const featured = getFeaturedProducts()
  const allProducts = products

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setBannerIdx(i => (i - 1 + banners.length) % banners.length)
  const next = () => setBannerIdx(i => (i + 1) % banners.length)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 overflow-x-hidden">

      {/* HERO BANNER CAROUSEL */}
      <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-80 shadow-lg">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-r ${banner.gradient} flex items-center justify-between px-8 md:px-16 ${i === bannerIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="text-white">
              <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-wider">Promoção especial</p>
              <h2 className="text-3xl md:text-5xl font-black mb-2">{banner.title}</h2>
              <p className="text-lg md:text-xl opacity-90 mb-6">{banner.subtitle}</p>
              <Link
                href={banner.href}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition text-sm md:text-base"
              >
                {banner.cta} →
              </Link>
            </div>
            <div className="text-8xl md:text-[10rem] opacity-30 select-none">{banner.image}</div>
          </div>
        ))}

        {/* Controls */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition">
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)} className={`w-2 h-2 rounded-full transition ${i === bannerIdx ? 'bg-white w-6' : 'bg-white/50'}`} />
          ))}
        </div>
      </div>

      {/* FLASH DEALS */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-5 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={22} className="text-yellow-400 fill-yellow-400" />
            <h2 className="text-xl font-black">Ofertas relâmpago</h2>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">AO VIVO</span>
          </div>
          <Link href="/busca" className="text-yellow-400 text-sm font-semibold hover:underline">Ver todas →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.filter(p => p.discount && p.discount >= 15).slice(0, 4).map(product => (
            <Link key={product.id} href={`/produto/${product.id}`} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition group">
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-white/10">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-xs font-medium line-clamp-2 mb-1 opacity-90">{product.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black">{formatPrice(product.price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">-{product.discount}%</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-700" />
            <h2 className="text-xl font-bold text-gray-800">Mais vendidos</h2>
          </div>
          <Link href="/busca" className="text-blue-700 text-sm font-semibold hover:underline">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield size={28} className="text-blue-700" />
            </div>
            <h3 className="font-bold text-gray-800">Compra 100% Segura</h3>
            <p className="text-sm text-gray-500">Seu dinheiro fica protegido até você receber e ficar satisfeito com o produto.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="font-bold text-gray-800">Entrega Rápida</h3>
            <p className="text-sm text-gray-500">Receba em casa em até 2 dias úteis com frete grátis em milhares de produtos.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star size={28} className="text-yellow-500 fill-yellow-500" />
            </div>
            <h3 className="font-bold text-gray-800">Milhões de Produtos</h3>
            <p className="text-sm text-gray-500">Encontre tudo que precisa com os melhores vendedores verificados do Brasil.</p>
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS GRID */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Produtos para você</h2>
          <Link href="/busca" className="text-blue-700 text-sm font-semibold hover:underline">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SELL BANNER */}
      <section className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Venda no Kainow One</h2>
          <p className="text-orange-100">Alcance milhões de compradores. É grátis para começar!</p>
        </div>
        <Link href="/vendedor" className="bg-white hover:bg-orange-50 text-orange-600 font-bold px-8 py-3 rounded-full transition whitespace-nowrap shadow">
          Comece a vender →
        </Link>
      </section>

    </div>
  )
}
