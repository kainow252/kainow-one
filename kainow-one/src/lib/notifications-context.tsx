'use client'

// ═══════════════════════════════════════════════════════════════════
// KAINOW ONE — Centro de Notificações
// Context global para notificações em tempo real
// ═══════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export type NotificationType =
  | 'pedido'
  | 'entrega'
  | 'oferta'
  | 'avaliacao'
  | 'sistema'
  | 'promocao'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  icon: string
  read: boolean
  date: string
  link?: string
  actionLabel?: string
}

interface NotifState {
  notifications: Notification[]
  unread: number
}

type NotifAction =
  | { type: 'ADD'; notification: Notification }
  | { type: 'MARK_READ'; id: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'DELETE'; id: string }
  | { type: 'LOAD'; notifications: Notification[] }

function reducer(state: NotifState, action: NotifAction): NotifState {
  switch (action.type) {
    case 'LOAD':
      return {
        notifications: action.notifications,
        unread: action.notifications.filter(n => !n.read).length
      }
    case 'ADD': {
      const notifications = [action.notification, ...state.notifications]
      return { notifications, unread: notifications.filter(n => !n.read).length }
    }
    case 'MARK_READ': {
      const notifications = state.notifications.map(n =>
        n.id === action.id ? { ...n, read: true } : n
      )
      return { notifications, unread: notifications.filter(n => !n.read).length }
    }
    case 'MARK_ALL_READ': {
      const notifications = state.notifications.map(n => ({ ...n, read: true }))
      return { notifications, unread: 0 }
    }
    case 'DELETE': {
      const notifications = state.notifications.filter(n => n.id !== action.id)
      return { notifications, unread: notifications.filter(n => !n.read).length }
    }
    default:
      return state
  }
}

// Notificações iniciais mockadas
const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'entrega',
    title: 'Pedido saiu para entrega! 🚀',
    message: 'Seu pedido #KNW-8841 (iPhone 15 Pro Max) saiu para entrega e chegará ainda hoje.',
    icon: '🚚',
    read: false,
    date: 'Agora',
    link: '/conta',
    actionLabel: 'Rastrear pedido'
  },
  {
    id: 'n2',
    type: 'oferta',
    title: 'Oferta relâmpago para você! ⚡',
    message: 'Samsung Galaxy S24 Ultra com 20% OFF por mais 2 horas. Não perca!',
    icon: '⚡',
    read: false,
    date: '5 min atrás',
    link: '/produto/2',
    actionLabel: 'Ver oferta'
  },
  {
    id: 'n3',
    type: 'pedido',
    title: 'Pagamento confirmado ✅',
    message: 'Seu pagamento do pedido #KNW-8841 foi aprovado. Já estamos preparando!',
    icon: '✅',
    read: false,
    date: '1h atrás',
    link: '/conta'
  },
  {
    id: 'n4',
    type: 'avaliacao',
    title: 'Avalie sua compra',
    message: 'Como foi o Fone Sony WH-1000XM5? Compartilhe sua experiência e ajude outros compradores.',
    icon: '⭐',
    read: true,
    date: '2h atrás',
    link: '/conta',
    actionLabel: 'Avaliar'
  },
  {
    id: 'n5',
    type: 'promocao',
    title: 'Cupom exclusivo para você! 🎁',
    message: 'Use o cupom KAINOW15 e ganhe 15% OFF na sua próxima compra acima de R$200.',
    icon: '🎁',
    read: true,
    date: 'Ontem',
    link: '/busca',
    actionLabel: 'Usar cupom'
  },
  {
    id: 'n6',
    type: 'entrega',
    title: 'Pedido entregue com sucesso! 🎉',
    message: 'Seu pedido #KNW-7752 (Sony WH-1000XM5) foi entregue. Aproveite!',
    icon: '🎉',
    read: true,
    date: '3 dias atrás',
    link: '/conta'
  },
  {
    id: 'n7',
    type: 'sistema',
    title: 'Bem-vindo ao Kainow One!',
    message: 'Sua conta foi criada com sucesso. Explore milhares de produtos com os melhores preços.',
    icon: '👋',
    read: true,
    date: '1 semana atrás',
  },
]

const NotifContext = createContext<{
  state: NotifState
  dispatch: React.Dispatch<NotifAction>
} | null>(null)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { notifications: [], unread: 0 })

  useEffect(() => {
    // Carrega do localStorage ou usa mock
    try {
      const saved = localStorage.getItem('kainow-notifications')
      if (saved) {
        dispatch({ type: 'LOAD', notifications: JSON.parse(saved) })
      } else {
        dispatch({ type: 'LOAD', notifications: initialNotifications })
      }
    } catch {
      dispatch({ type: 'LOAD', notifications: initialNotifications })
    }
  }, [])

  useEffect(() => {
    if (state.notifications.length > 0) {
      localStorage.setItem('kainow-notifications', JSON.stringify(state.notifications))
    }
  }, [state.notifications])

  return <NotifContext.Provider value={{ state, dispatch }}>{children}</NotifContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationsProvider')
  return ctx
}
