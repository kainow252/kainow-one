'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart, Search, Menu, X, User, Heart,
  ChevronDown, Bell, Package, LogIn,
  Store, Gift, LogOut, ChevronRight, Clock, TrendingUp, Check
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { useNotifications } from '@/lib/notifications-context'
import { categories, products, searchProducts } from '@/lib/data'

// Termos populares para sugestão
const TRENDING = ['iPhone 15', 'Fone Bluetooth', 'Tênis Nike', 'Smart TV', 'Notebook', 'Cafeteira']

export default function Header() {
  const [query, setQuery]               = useState('')
  const [menuOpen, setMenuOpen]         = useState(false)
  const [catOpen, setCatOpen]           = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen]       = useState(false)
  const [hoveredCat, setHoveredCat]     = useState<string | null>(null)
  const [mobileCatOpen, setMobileCatOpen] = useState<string | null>(null)
  // Autocomplete
  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { state: cartState } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const { state: notifState, dispatch: notifDispatch } = useNotifications()

  // Sugestões de autocomplete
  const suggestions = query.trim().length >= 2
    ? searchProducts(query).slice(0, 5).map(p => p.title)
    : []

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Carregar buscas recentes do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kainow-recent-searches')
      if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5))
    } catch {}
  }, [])

  function saveSearch(term: string) {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('kainow-recent-searches', JSON.stringify(updated))
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      saveSearch(query.trim())
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`)
      setSearchFocused(false)
    }
  }

  function handleSuggestionClick(term: string) {
    setQuery(term)
    saveSearch(term)
    router.push(`/busca?q=${encodeURIComponent(term)}`)
    setSearchFocused(false)
  }

  function handleLogout() {
    logout(); setUserMenuOpen(false); setMenuOpen(false); router.push('/')
  }

  function onCatMouseEnter(catId: string) {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setHoveredCat(catId)
  }

  function onCatMouseLeave() {
    hoverTimeout.current = setTimeout(() => setHoveredCat(null), 120)
  }

  const showAutoComplete = searchFocused && (suggestions.length > 0 || recentSearches.length > 0 || query.length === 0)

  return (
    <header className="sticky top-0 z-50 shadow-md w-full">

      {/* ══ TOP BAR ══ */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2">

          {/* Hamburger — mobile */}
          <button
            onClick={() => { setMenuOpen(!menuOpen); setCatOpen(false) }}
            className="md:hidden text-white p-1.5 flex-shrink-0 rounded-lg hover:bg-orange-600 transition"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 mr-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center shadow">
              <span className="text-orange-500 font-black text-base sm:text-lg">K</span>
            </div>
            <span className="hidden sm:inline font-black text-white text-base sm:text-lg tracking-tight whitespace-nowrap">
              Kainow One
            </span>
          </Link>

          {/* Search Bar com autocomplete */}
          <div ref={searchRef} className="flex-1 min-w-0 relative">
            <form onSubmit={handleSearch}>
              <div className="flex rounded-full overflow-hidden shadow-sm border-2 border-transparent focus-within:border-white transition-all">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Buscar produtos..."
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-800 outline-none bg-white text-sm"
                />
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 transition px-3 sm:px-5 flex-shrink-0 flex items-center justify-center"
                >
                  <Search size={17} className="text-white" />
                </button>
              </div>
            </form>

            {/* Dropdown Autocomplete */}
            {showAutoComplete && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
                {/* Sugestões baseadas na digitação */}
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider px-4 pt-3 pb-1">Resultados</p>
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(s)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 text-left transition">
                        <Search size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 line-clamp-1">{s}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Buscas recentes */}
                {query.length === 0 && recentSearches.length > 0 && (
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider px-4 pt-3 pb-1">Buscas recentes</p>
                    {recentSearches.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(s)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition">
                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{s}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending — sem query */}
                {query.length === 0 && (
                  <div className="border-t border-gray-50">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider px-4 pt-3 pb-1">Em alta agora</p>
                    <div className="flex flex-wrap gap-2 px-4 pb-3">
                      {TRENDING.map((t, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(t)}
                          className="flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-orange-100 transition">
                          <TrendingUp size={11} />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
                className="relative flex flex-col items-center text-white hover:text-orange-100 px-1.5 sm:px-2 py-1 rounded hover:bg-orange-600 transition"
              >
                <Bell size={20} />
                {notifState.unread > 0 && (
                  <span className="absolute -top-0.5 right-0 bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-black px-0.5">
                    {notifState.unread > 9 ? '9+' : notifState.unread}
                  </span>
                )}
                <span className="text-[11px] font-medium mt-0.5 hidden md:block">Notif.</span>
              </button>

              {/* Painel de notificações */}
              {notifOpen && (
                <div className="absolute right-0 mt-1 w-80 bg-white shadow-2xl rounded-xl border border-gray-100 z-[80] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-bold text-gray-800">Notificações</span>
                    {notifState.unread > 0 && (
                      <button
                        onClick={() => notifDispatch({ type: 'MARK_ALL_READ' })}
                        className="text-xs text-orange-600 hover:underline flex items-center gap-1"
                      >
                        <Check size={12} /> Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifState.notifications.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">Nenhuma notificação</p>
                    ) : (
                      notifState.notifications.map(n => (
                        <div
                          key={n.id}
                          className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!n.read ? 'bg-orange-50/50' : ''}`}
                          onClick={() => {
                            notifDispatch({ type: 'MARK_READ', id: n.id })
                            if (n.link) { router.push(n.link); setNotifOpen(false) }
                          }}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold leading-tight ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                          </div>
                          {!n.read && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {notifState.notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <Link href="/conta" onClick={() => setNotifOpen(false)} className="text-xs text-orange-600 hover:underline">
                        Ver todas as notificações
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gift Cards — desktop */}
            <Link href="/gift-cards"
              className="hidden md:flex flex-col items-center text-white hover:text-orange-100 px-2 py-1 rounded hover:bg-orange-600 transition">
              <Gift size={18} />
              <span className="text-[11px] font-medium mt-0.5">Gift Cards</span>
            </Link>

            {/* Login / User — desktop */}
            {isAuthenticated && user ? (
              <div className="relative hidden md:block">
                <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
                  className="flex flex-col items-center text-white hover:text-orange-100 px-2 py-1 rounded hover:bg-orange-600 transition">
                  <User size={18} />
                  <span className="text-[11px] font-medium mt-0.5 max-w-[60px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/conta" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={15} /> Meus pedidos
                    </Link>
                    <Link href="/conta" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Heart size={15} /> Favoritos
                    </Link>
                    <Link href="/gift-cards" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Gift size={15} /> Gift Cards
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut size={15} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login"
                className="hidden md:flex flex-col items-center text-white hover:text-orange-100 px-2 py-1 rounded hover:bg-orange-600 transition">
                <LogIn size={18} />
                <span className="text-[11px] font-medium mt-0.5">Entrar</span>
              </Link>
            )}

            {/* Vender — desktop */}
            <Link href="/vendedor"
              className="hidden md:flex flex-col items-center text-white hover:text-orange-100 px-2 py-1 rounded hover:bg-orange-600 transition">
              <Store size={18} />
              <span className="text-[11px] font-medium mt-0.5">Vender</span>
            </Link>

            {/* Carrinho */}
            <Link href="/carrinho"
              className="relative flex flex-col items-center text-white hover:text-orange-100 px-2 py-1 rounded hover:bg-orange-600 transition">
              <ShoppingCart size={20} />
              {cartState.count > 0 && (
                <span className="absolute -top-0.5 right-0 bg-white text-orange-500 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black leading-none">
                  {cartState.count > 9 ? '9+' : cartState.count}
                </span>
              )}
              <span className="text-[11px] font-medium mt-0.5 hidden md:block">Carrinho</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ══ CATEGORY BAR — Desktop ══ */}
      <div className="bg-rose-700 text-white hidden md:block relative w-full">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">

            <button
              onClick={() => { setCatOpen(!catOpen); setHoveredCat(null) }}
              onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); setHoveredCat(null) }}
              className="flex items-center gap-1.5 py-2.5 px-3 hover:bg-rose-600 transition text-sm font-semibold whitespace-nowrap border-r border-rose-600 flex-shrink-0"
            >
              <Menu size={16} />
              Categorias
              <ChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            {categories.slice(0, 8).map(cat => (
              <div key={cat.id} className="relative flex-shrink-0"
                onMouseEnter={() => { setCatOpen(false); onCatMouseEnter(cat.id) }}
                onMouseLeave={onCatMouseLeave}
              >
                <Link href={`/busca?categoria=${cat.id}`}
                  className={`flex items-center gap-1 py-2.5 px-3 hover:bg-rose-600 transition text-sm whitespace-nowrap ${hoveredCat === cat.id ? 'bg-rose-600' : ''}`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.name}
                  <ChevronDown size={12} className={`ml-0.5 opacity-70 transition-transform ${hoveredCat === cat.id ? 'rotate-180' : ''}`} />
                </Link>

                {hoveredCat === cat.id && (
                  <div
                    className="absolute top-full left-0 min-w-[200px] bg-white shadow-2xl rounded-b-xl rounded-tr-xl border border-gray-100 py-2 z-[60]"
                    onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); setHoveredCat(cat.id) }}
                    onMouseLeave={onCatMouseLeave}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <Link href={`/busca?categoria=${cat.id}`}
                        onClick={() => setHoveredCat(null)}
                        className="flex items-center gap-2 font-bold text-gray-800 hover:text-orange-600 transition text-sm"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        Ver todos em {cat.name}
                        <ChevronRight size={14} className="ml-auto" />
                      </Link>
                    </div>
                    {cat.subcategories.map(sub => (
                      <Link key={sub}
                        href={`/busca?q=${encodeURIComponent(sub)}&categoria=${cat.id}`}
                        onClick={() => setHoveredCat(null)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <ChevronRight size={13} className="text-gray-300" />
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link href="/gift-cards"
              className="py-2.5 px-3 hover:bg-rose-600 transition text-sm whitespace-nowrap flex items-center gap-1 text-orange-200 font-semibold flex-shrink-0">
              <Gift size={14} /> Gift Cards
            </Link>

            <Link href="/busca"
              className="py-2.5 px-3 hover:bg-rose-600 transition text-sm whitespace-nowrap ml-auto flex-shrink-0">
              Ver tudo
            </Link>
          </div>
        </div>

        {/* Mega dropdown */}
        {catOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-2xl z-50 border-t">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map(cat => (
                  <div key={cat.id}>
                    <Link href={`/busca?categoria=${cat.id}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 font-semibold text-gray-800 hover:text-orange-600 mb-2"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      {cat.name}
                    </Link>
                    <ul className="space-y-1 ml-8">
                      {cat.subcategories.map(sub => (
                        <li key={sub}>
                          <Link href={`/busca?q=${encodeURIComponent(sub)}&categoria=${cat.id}`}
                            onClick={() => setCatOpen(false)}
                            className="text-sm text-gray-500 hover:text-orange-600 hover:underline"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl p-4 flex flex-col justify-between text-white">
                  <Gift size={28} className="text-white" />
                  <div>
                    <p className="font-bold text-sm mt-2">Gift Cards</p>
                    <p className="text-xs opacity-90 mb-2">O presente perfeito para quem você ama</p>
                    <Link href="/gift-cards"
                      onClick={() => setCatOpen(false)}
                      className="inline-flex items-center gap-1 bg-white text-orange-600 text-xs px-3 py-1.5 rounded-full hover:bg-orange-50 transition font-semibold"
                    >
                      Ver Gift Cards <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ MOBILE MENU ══ */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <div className="px-4 py-3 space-y-0.5">

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 py-2.5 bg-orange-50 rounded-xl px-3 mb-2">
                  <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/conta" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-1 text-gray-700 hover:text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition">
                  <Package size={17} /> Meus pedidos
                </Link>
                <Link href="/conta" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-1 text-gray-700 hover:text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition">
                  <Heart size={17} /> Favoritos
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-1 text-gray-700 hover:text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition">
                <LogIn size={17} /> Entrar / Cadastrar
              </Link>
            )}

            {/* Notificações mobile */}
            <Link href="/conta" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-2.5 px-1 text-gray-700 hover:text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition">
              <Bell size={17} />
              Notificações
              {notifState.unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {notifState.unread}
                </span>
              )}
            </Link>

            <Link href="/gift-cards" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-2.5 px-1 text-yellow-600 font-semibold hover:text-yellow-700 text-sm rounded-lg hover:bg-yellow-50 transition">
              <Gift size={17} /> 🎁 Gift Cards
            </Link>
            <Link href="/vendedor" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-2.5 px-1 text-gray-700 hover:text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition">
              <Store size={17} /> Vender no Kainow
            </Link>

            <div className="h-px bg-gray-100 my-2"/>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 pt-1 pb-0.5">Categorias</p>

            {categories.map(cat => (
              <div key={cat.id} className="overflow-hidden">
                <button
                  onClick={() => setMobileCatOpen(mobileCatOpen === cat.id ? null : cat.id)}
                  className="w-full flex items-center gap-3 py-2.5 px-1 text-gray-700 hover:text-orange-600 text-sm rounded-lg hover:bg-orange-50 transition text-left"
                >
                  <span className="text-lg flex-shrink-0">{cat.icon}</span>
                  <span className="flex-1 font-medium">{cat.name}</span>
                  <ChevronDown size={15}
                    className={`transition-transform text-gray-400 flex-shrink-0 ${mobileCatOpen === cat.id ? 'rotate-180' : ''}`} />
                </button>

                {mobileCatOpen === cat.id && (
                  <div className="ml-10 mb-1 border-l-2 border-orange-100 pl-3 space-y-0.5">
                    <Link href={`/busca?categoria=${cat.id}`}
                      className="flex items-center gap-1.5 py-1.5 text-orange-600 text-xs font-bold hover:underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ChevronRight size={12} /> Ver todos em {cat.name}
                    </Link>
                    {cat.subcategories.map(sub => (
                      <Link key={sub}
                        href={`/busca?q=${encodeURIComponent(sub)}&categoria=${cat.id}`}
                        className="flex items-center gap-1.5 py-1 text-gray-500 text-xs hover:text-orange-600 hover:bg-orange-50 rounded px-1 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ChevronRight size={12} className="text-gray-300 flex-shrink-0" /> {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAuthenticated && (
              <>
                <div className="h-px bg-gray-100 my-2"/>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 py-2.5 px-1 text-red-600 hover:text-red-700 text-sm w-full rounded-lg hover:bg-red-50 transition">
                  <LogOut size={17} /> Sair da conta
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
