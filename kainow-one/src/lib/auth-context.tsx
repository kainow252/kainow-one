'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'seller' | 'admin'
  avatar?: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, cpf: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Usuários mockados (em produção, viria do banco)
const MOCK_USERS: (AuthUser & { password: string; cpf: string })[] = [
  { id: '1', name: 'João Silva', email: 'joao@kainow.com', password: 'Senha@123', role: 'user', cpf: '123.456.789-09' },
  { id: '2', name: 'Maria Santos', email: 'maria@kainow.com', password: 'Senha@123', role: 'seller', cpf: '987.654.321-00' },
  { id: '3', name: 'Admin Kainow', email: 'admin@kainow.com', password: 'Admin@2026', role: 'admin', cpf: '111.222.333-96' },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Restaurar sessão do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kainow_user')
      if (saved) {
        const user: AuthUser = JSON.parse(saved)
        setState({ user, isLoading: false, isAuthenticated: true })
      } else {
        setState(s => ({ ...s, isLoading: false }))
      }
    } catch {
      setState(s => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600)) // simular latência de API

    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!found) {
      return { success: false, error: 'E-mail ou senha incorretos.' }
    }

    const { password: _, cpf: __, ...user } = found
    localStorage.setItem('kainow_user', JSON.stringify(user))
    setState({ user, isLoading: false, isAuthenticated: true })
    return { success: true }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, cpf: string) => {
    await new Promise(r => setTimeout(r, 800))

    if (MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'E-mail já cadastrado.' }
    }

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: 'user',
    }

    MOCK_USERS.push({ ...newUser, password, cpf })
    localStorage.setItem('kainow_user', JSON.stringify(newUser))
    setState({ user: newUser, isLoading: false, isAuthenticated: true })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('kainow_user')
    setState({ user: null, isLoading: false, isAuthenticated: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
