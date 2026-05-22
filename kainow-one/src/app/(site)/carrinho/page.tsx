'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Shield } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/data'

export default function CarrinhoPage() {
  const { state, dispatch } = useCart()

  const shipping = state.total > 299 ? 0 : 29.90
  const finalTotal = state.total + shipping

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Adicione produtos ao carrinho para continuar comprando</p>
          <Link href="/" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full transition inline-block">
            Continuar comprando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-blue-700 hover:underline flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Continuar comprando
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Carrinho <span className="text-gray-400 text-lg font-normal">({state.count} {state.count === 1 ? 'item' : 'itens'})</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
              <Link href={`/produto/${item.product.id}`} className="flex-shrink-0">
                <img src={item.product.image} alt={item.product.title} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link href={`/produto/${item.product.id}`} className="font-medium text-gray-800 line-clamp-2 hover:text-blue-700 text-sm flex-1">
                    {item.product.title}
                  </Link>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: item.product.id })}
                    className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.product.seller}</p>
                {item.product.freeShipping && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                    <Truck size={11} /> Frete grátis
                  </span>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.product.id, quantity: item.quantity - 1 })}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.product.id, quantity: item.quantity + 1 })}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    {item.product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(item.product.originalPrice * item.quantity)}</p>
                    )}
                    <p className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Tag size={16} /> Cupom de desconto</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Digite seu cupom" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" />
              <button className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
                Aplicar
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Resumo do pedido</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({state.count} itens)</span>
                <span>{formatPrice(state.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frete</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-blue-600">
                  Falta {formatPrice(299 - state.total)} para frete grátis!
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
              {state.items[0]?.product.installments && (
                <p className="text-sm text-green-600 mt-1">
                  em até {state.items[0].product.installments}x sem juros
                </p>
              )}
            </div>

            <Link
              href="/checkout"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition text-base"
            >
              Finalizar compra →
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield size={12} />
              <span>Compra 100% segura e protegida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
