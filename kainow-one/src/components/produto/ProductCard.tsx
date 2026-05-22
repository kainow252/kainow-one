'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Zap } from 'lucide-react'
import { Product, formatPrice } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart()
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  function addToCart(e: React.MouseEvent) {
    e.preventDefault()
    dispatch({ type: 'ADD_ITEM', product })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function toggleLike(e: React.MouseEvent) {
    e.preventDefault()
    setLiked(!liked)
  }

  return (
    <Link href={`/produto/${product.id}`} className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
        {product.badge && (
          <span className="absolute top-2 right-10 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition"
        >
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
        {product.freeShipping && (
          <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            🚚 Frete grátis
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{product.subcategory}</p>
        <h3 className="text-sm text-gray-800 font-medium line-clamp-2 mb-2 flex-1">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-2">
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
          {product.installments && (
            <p className="text-xs text-green-600 font-medium">
              em {product.installments}x {formatPrice(product.price / product.installments)} sem juros
            </p>
          )}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11} className={s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews.toLocaleString('pt-BR')})</span>
          <span className="text-xs text-gray-400 ml-auto">{product.sold.toLocaleString('pt-BR')} vendidos</span>
        </div>

        {/* Add to cart */}
        <button
          onClick={addToCart}
          className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          <ShoppingCart size={15} />
          {added ? 'Adicionado! ✓' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </Link>
  )
}
