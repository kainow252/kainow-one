'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product } from './data'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  count: number
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id)
      const items = existing
        ? state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.product, quantity: 1 }]
      const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return { items, total, count }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.product.id !== action.productId)
      const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return { items, total, count }
    }
    case 'UPDATE_QTY': {
      const items = action.quantity === 0
        ? state.items.filter(i => i.product.id !== action.productId)
        : state.items.map(i =>
            i.product.id === action.productId
              ? { ...i, quantity: action.quantity }
              : i
          )
      const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return { items, total, count }
    }
    case 'CLEAR_CART':
      return { items: [], total: 0, count: 0 }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, count: 0 })

  useEffect(() => {
    const saved = localStorage.getItem('kainow-cart')
    if (saved) {
      const parsed = JSON.parse(saved)
      parsed.items.forEach((item: CartItem) => {
        for (let i = 0; i < item.quantity; i++) {
          dispatch({ type: 'ADD_ITEM', product: item.product })
        }
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('kainow-cart', JSON.stringify(state))
  }, [state])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
