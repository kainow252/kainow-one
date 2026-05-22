'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { products as realProducts, categories as realCategories, type Product } from '@/lib/data'
import {
  mockEntregadores, mockCorridas, configPlataforma,
  type Entregador, type Corrida, type StatusEntregador,
  fmtBRL as fmtEco, fmtDist, labelStatusEntregador,
  mockPedidosEco,
} from '@/lib/ecosystem'
import {
  LayoutDashboard, Store, Package, Users, ShoppingBag,
  LogOut, Menu, X, TrendingUp, AlertCircle, CheckCircle,
  XCircle, Eye, Edit, Trash2, Plus, Search,
  ArrowUpRight, ArrowDownRight, Shield,
  Bell, Settings, Star, DollarSign, BarChart2, Gift,
  Ban, RefreshCw, Download, Lock, Unlock,
  ChevronRight, Save, Home, TrendingDown,
  Truck, RotateCcw, CreditCard, Activity,
  MapPin, Phone, Mail, Calendar, Filter,
  ChevronUp, ChevronDown, Package2, AlertTriangle,
  CheckCircle2, Clock, Zap, BarChart, PieChart,
  FileText, Tag, Percent, Globe, Wallet,
  Layers, ListTree, FolderOpen, FolderPlus, Pencil,
  Palette, Type, Layout, Wand2, Image, Code2,
  MonitorSmartphone, ExternalLink, Copy, ToggleLeft,
  ToggleRight, BookOpen, PenLine, EyeOff,
  Smartphone, Monitor, Tablet,
} from 'lucide-react'
// Recharts removido — usando SVG/CSS nativo para reduzir bundle e evitar crash mobile

// ══════════════════════════════════════════════════════════
// TIPOS — CMS / EDITOR DO SITE
// ══════════════════════════════════════════════════════════

type SiteTheme = {
  corPrimaria: string
  corSecundaria: string
  corFundo: string
  corTexto: string
  corDestaque: string
  corSucesso: string
  corAviso: string
  fonteTitulo: string
  fonteTexto: string
  logoUrl: string
  faviconUrl: string
  nomeSite: string
  tagline: string
  borderRadius: 'none'|'sm'|'md'|'lg'|'xl'|'2xl'
}

type CmsPage = {
  id: string
  slug: string
  title: string
  content: string
  ambiente: 'home'|'lojista'|'entregador'
  status: 'rascunho'|'publicado'
  updatedAt: string
  author: string
  views: number
}

type ModuloBloco = {
  id: string
  tipo: 'banner'|'cards'|'texto'|'faq'|'cta'|'depoimentos'|'galeria'|'stats'
  titulo: string
  subtitulo: string
  conteudo: string
  imagem: string
  ativo: boolean
  ordem: number
  ambiente: 'home'|'lojista'|'entregador'
}

// ══════════════════════════════════════════════════════════
// TIPOS
// ══════════════════════════════════════════════════════════

type Lojista = {
  id: string; nome: string; email: string; cnpj: string; telefone: string
  status: string; reputacao: string; totalVendas: number; totalPedidos: number
  dataCadastro: string; categoria: string; cidade: string; estado: string
  plano: string; avaliacaoMedia: number; comissao: number; saldoPendente: number
}

type Usuario = {
  id: string; nome: string; email: string; cpf: string; telefone: string
  status: string; role: string; dataCadastro: string; totalCompras: number
  totalGasto: number; cidade: string; estado: string; ultimoAcesso: string
}

type Pedido = {
  id: string; cliente: string; lojista: string; produto: string; valor: number
  status: string; data: string; pagamento: string; rastreio: string | null
  frete: number; desconto: number; itens: number
}

type ProdutoAdmin = {
  id: string; nome: string; lojista: string; categoria: string; preco: number
  estoque: number; status: string; vendidos: number; avaliacao: number
  badge: string; discount: number; image: string
}

// ══════════════════════════════════════════════════════════
// DADOS MOCK
// ══════════════════════════════════════════════════════════

const ADMIN_CREDENTIALS = { email: 'admin@kainow.com', password: 'Admin@2026' }

// ══════════════════════════════════════════════════════════
// DADOS MOCK — CMS
// ══════════════════════════════════════════════════════════

const defaultTheme: SiteTheme = {
  corPrimaria:    '#f97316',
  corSecundaria:  '#ef4444',
  corFundo:       '#f9fafb',
  corTexto:       '#111827',
  corDestaque:    '#3b82f6',
  corSucesso:     '#10b981',
  corAviso:       '#f59e0b',
  fonteTitulo:    'Inter',
  fonteTexto:     'Inter',
  logoUrl:        '',
  faviconUrl:     '',
  nomeSite:       'Kainow One',
  tagline:        'O marketplace de todos',
  borderRadius:   '2xl',
}

const mockCmsPages: CmsPage[] = [
  { id:'p1', slug:'sobre-nos',          title:'Sobre Nós',                ambiente:'home',       status:'publicado', content:'<h1>Sobre o Kainow One</h1><p>Somos um marketplace...</p>', updatedAt:'2026-05-20', author:'Admin', views:1243 },
  { id:'p2', slug:'termos-de-uso',      title:'Termos de Uso',            ambiente:'home',       status:'publicado', content:'<h1>Termos de Uso</h1><p>Ao usar nossa plataforma...</p>', updatedAt:'2026-05-18', author:'Admin', views:872 },
  { id:'p3', slug:'politica-privacidade',title:'Política de Privacidade', ambiente:'home',       status:'publicado', content:'<h1>Política de Privacidade</h1><p>Seus dados são...</p>', updatedAt:'2026-05-15', author:'Admin', views:654 },
  { id:'p4', slug:'como-vender',        title:'Como Vender',              ambiente:'lojista',    status:'publicado', content:'<h1>Como Vender no Kainow</h1><p>É fácil começar...</p>', updatedAt:'2026-05-19', author:'Admin', views:3421 },
  { id:'p5', slug:'taxas-lojista',      title:'Taxas e Comissões',        ambiente:'lojista',    status:'publicado', content:'<h1>Taxas</h1><p>Nossa comissão é a menor...</p>', updatedAt:'2026-05-17', author:'Admin', views:2198 },
  { id:'p6', slug:'suporte-lojista',    title:'Central de Suporte',       ambiente:'lojista',    status:'rascunho',  content:'<h1>Suporte</h1><p>Estamos aqui para ajudar...</p>', updatedAt:'2026-05-21', author:'Admin', views:0 },
  { id:'p7', slug:'seja-entregador',    title:'Seja Parceiro Entregador', ambiente:'entregador', status:'publicado', content:'<h1>Seja Entregador</h1><p>Ganhe mais entregando...</p>', updatedAt:'2026-05-20', author:'Admin', views:5643 },
  { id:'p8', slug:'termos-entregador',  title:'Termos do Entregador',     ambiente:'entregador', status:'publicado', content:'<h1>Termos</h1><p>Ao se cadastrar como entregador...</p>', updatedAt:'2026-05-16', author:'Admin', views:1876 },
  { id:'p9', slug:'faq-entregador',     title:'FAQ Entregadores',         ambiente:'entregador', status:'rascunho',  content:'<h1>FAQ</h1><p>Perguntas frequentes...</p>', updatedAt:'2026-05-21', author:'Admin', views:0 },
]

const mockBlocos: ModuloBloco[] = [
  { id:'b1', tipo:'banner',      titulo:'Banner Principal',    subtitulo:'Hero da homepage',    conteudo:'Compre com segurança em todo o Brasil',   imagem:'', ativo:true,  ordem:1, ambiente:'home' },
  { id:'b2', tipo:'stats',       titulo:'Números da Plataforma',subtitulo:'KPIs visíveis',      conteudo:'28k usuários · 156 lojistas · 99% satisfação', imagem:'', ativo:true,  ordem:2, ambiente:'home' },
  { id:'b3', tipo:'cards',       titulo:'Categorias em Destaque',subtitulo:'Grid de categorias',conteudo:'Eletrônicos, Moda, Casa, Esportes',        imagem:'', ativo:true,  ordem:3, ambiente:'home' },
  { id:'b4', tipo:'depoimentos', titulo:'Depoimentos',         subtitulo:'Social proof',        conteudo:'O que nossos clientes dizem',              imagem:'', ativo:false, ordem:4, ambiente:'home' },
  { id:'b5', tipo:'cta',         titulo:'CTA Newsletter',      subtitulo:'Captação de leads',   conteudo:'Receba ofertas exclusivas no seu email',   imagem:'', ativo:true,  ordem:5, ambiente:'home' },
  { id:'b6', tipo:'banner',      titulo:'Hero Lojista',        subtitulo:'Página inicial lojista',conteudo:'Venda para todo o Brasil com zero burocracia', imagem:'', ativo:true, ordem:1, ambiente:'lojista' },
  { id:'b7', tipo:'cards',       titulo:'Benefícios Lojista',  subtitulo:'Cards de vantagens',  conteudo:'Zero taxa inicial · Painel completo · Suporte 24h', imagem:'', ativo:true, ordem:2, ambiente:'lojista' },
  { id:'b8', tipo:'faq',         titulo:'FAQ Lojistas',        subtitulo:'Dúvidas frequentes',  conteudo:'Como cadastrar produtos? Como recebo?',    imagem:'', ativo:true,  ordem:3, ambiente:'lojista' },
  { id:'b9', tipo:'banner',      titulo:'Hero Entregador',     subtitulo:'Página entregador',   conteudo:'Seja seu próprio chefe. Entregue quando quiser.', imagem:'', ativo:true, ordem:1, ambiente:'entregador' },
  { id:'b10',tipo:'stats',       titulo:'Ganhos Entregador',   subtitulo:'Números atrativos',   conteudo:'Até R$5.000/mês · Pagamento semanal',     imagem:'', ativo:true,  ordem:2, ambiente:'entregador' },
  { id:'b11',tipo:'cta',         titulo:'CTA Cadastro',        subtitulo:'Botão de conversão',  conteudo:'Comece hoje — cadastre-se grátis',         imagem:'', ativo:true,  ordem:3, ambiente:'entregador' },
]

const GOOGLE_FONTS = [
  'Inter','Roboto','Open Sans','Lato','Montserrat','Poppins','Raleway',
  'Nunito','Source Sans Pro','Ubuntu','Playfair Display','Merriweather',
  'DM Sans','Outfit','Plus Jakarta Sans','Figtree',
]

const mockStats = {
  totalVendas: 847320.50, totalVendasOntem: 28430.00,
  totalPedidos: 3842, totalPedidosHoje: 47,
  totalLojistas: 156, lojistasAtivos: 148,
  totalUsuarios: 28940, usuariosNovosHoje: 234,
  crescimentoVendas: 12.4, crescimentoPedidos: 8.7,
  crescimentoLojistas: 3.2, crescimentoUsuarios: 15.9,
  pedidosPendentes: 47, pedidosEmAndamento: 183,
  pedidosConcluidos: 3587, pedidosCancelados: 25,
  taxaConversao: 3.8, ticketMedio: 220.50,
  reclamacoes: 12, devolucoes: 8,
  receitaHoje: 34280.90, receitaSemana: 198430.00,
  receitaMes: 847320.50,
  vendasPorCategoria: [
    { nome: 'Eletrônicos', valor: 289430, pct: 34 },
    { nome: 'Informática', valor: 176540, pct: 21 },
    { nome: 'Moda', valor: 118230, pct: 14 },
    { nome: 'Esportes', valor: 84730, pct: 10 },
    { nome: 'Casa & Jardim', valor: 67890, pct: 8 },
    { nome: 'Outros', valor: 110500, pct: 13 },
  ],
  vendasUltimos7Dias: [
    { dia: 'Seg', valor: 23400 }, { dia: 'Ter', valor: 31200 },
    { dia: 'Qua', valor: 28900 }, { dia: 'Qui', valor: 35600 },
    { dia: 'Sex', valor: 42100 }, { dia: 'Sáb', valor: 38700 },
    { dia: 'Dom', valor: 34280 },
  ],
}

const mockLojistas: Lojista[] = [
  { id: 'L001', nome: 'TechStore Brasil', email: 'contato@techstore.com.br', cnpj: '12.345.678/0001-90', telefone: '(11) 98765-4321', status: 'ativo', reputacao: 'Platinum', totalVendas: 125430.00, totalPedidos: 543, dataCadastro: '2024-03-15', categoria: 'Eletrônicos', cidade: 'São Paulo', estado: 'SP', plano: 'Premium', avaliacaoMedia: 4.9, comissao: 8, saldoPendente: 12430.00 },
  { id: 'L002', nome: 'Moda Feminina da Lú', email: 'lu@modafeminina.com', cnpj: '98.765.432/0001-10', telefone: '(21) 99123-4567', status: 'ativo', reputacao: 'Gold', totalVendas: 67890.00, totalPedidos: 312, dataCadastro: '2024-05-20', categoria: 'Moda', cidade: 'Rio de Janeiro', estado: 'RJ', plano: 'Básico', avaliacaoMedia: 4.7, comissao: 10, saldoPendente: 3890.00 },
  { id: 'L003', nome: 'Casa & Conforto', email: 'vendas@casaconforto.com', cnpj: '45.678.901/0001-23', telefone: '(31) 97654-3210', status: 'pendente', reputacao: 'Silver', totalVendas: 23400.00, totalPedidos: 98, dataCadastro: '2025-01-10', categoria: 'Casa & Jardim', cidade: 'Belo Horizonte', estado: 'MG', plano: 'Básico', avaliacaoMedia: 4.3, comissao: 10, saldoPendente: 1240.00 },
  { id: 'L004', nome: 'SportMax', email: 'sport@sportmax.com.br', cnpj: '56.789.012/0001-34', telefone: '(41) 96543-2109', status: 'ativo', reputacao: 'Platinum', totalVendas: 198750.00, totalPedidos: 876, dataCadastro: '2023-11-08', categoria: 'Esportes', cidade: 'Curitiba', estado: 'PR', plano: 'Premium', avaliacaoMedia: 4.8, comissao: 8, saldoPendente: 18930.00 },
  { id: 'L005', nome: 'Gamer Zone', email: 'gamer@gamerzone.com', cnpj: '67.890.123/0001-45', telefone: '(51) 95432-1098', status: 'suspenso', reputacao: 'Bronze', totalVendas: 12300.00, totalPedidos: 67, dataCadastro: '2025-02-14', categoria: 'Eletrônicos', cidade: 'Porto Alegre', estado: 'RS', plano: 'Básico', avaliacaoMedia: 3.8, comissao: 12, saldoPendente: 0 },
  { id: 'L006', nome: 'Beleza Total Shop', email: 'beleza@belezatotal.com', cnpj: '78.901.234/0001-56', telefone: '(85) 94321-0987', status: 'ativo', reputacao: 'Gold', totalVendas: 89230.00, totalPedidos: 421, dataCadastro: '2024-07-22', categoria: 'Beleza & Saúde', cidade: 'Fortaleza', estado: 'CE', plano: 'Premium', avaliacaoMedia: 4.6, comissao: 8, saldoPendente: 7320.00 },
  { id: 'L007', nome: 'InfoTech Computadores', email: 'info@infotech.com.br', cnpj: '89.012.345/0001-67', telefone: '(47) 93210-9876', status: 'ativo', reputacao: 'Gold', totalVendas: 143200.00, totalPedidos: 534, dataCadastro: '2024-02-01', categoria: 'Informática', cidade: 'Joinville', estado: 'SC', plano: 'Premium', avaliacaoMedia: 4.7, comissao: 8, saldoPendente: 9870.00 },
  { id: 'L008', nome: 'Sabor & Saúde', email: 'contato@saborsaude.com', cnpj: '90.123.456/0001-78', telefone: '(19) 92109-8765', status: 'pendente', reputacao: 'Bronze', totalVendas: 0, totalPedidos: 0, dataCadastro: '2026-05-18', categoria: 'Alimentos', cidade: 'Campinas', estado: 'SP', plano: 'Básico', avaliacaoMedia: 0, comissao: 12, saldoPendente: 0 },
]

const mockUsuarios: Usuario[] = [
  { id: 'U001', nome: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00', telefone: '(11) 98765-4321', status: 'ativo', role: 'user', dataCadastro: '2024-01-15', totalCompras: 12, totalGasto: 15430.00, cidade: 'São Paulo', estado: 'SP', ultimoAcesso: '2026-05-20' },
  { id: 'U002', nome: 'Maria Santos', email: 'maria@email.com', cpf: '987.654.321-00', telefone: '(21) 99876-5432', status: 'ativo', role: 'user', dataCadastro: '2024-03-22', totalCompras: 8, totalGasto: 3280.50, cidade: 'Rio de Janeiro', estado: 'RJ', ultimoAcesso: '2026-05-19' },
  { id: 'U003', nome: 'Carlos Oliveira', email: 'carlos@gmail.com', cpf: '456.789.123-00', telefone: '(31) 97654-3210', status: 'bloqueado', role: 'user', dataCadastro: '2024-06-10', totalCompras: 2, totalGasto: 459.00, cidade: 'Belo Horizonte', estado: 'MG', ultimoAcesso: '2025-12-01' },
  { id: 'U004', nome: 'Ana Costa', email: 'ana@email.com', cpf: '654.321.987-00', telefone: '(41) 96543-2109', status: 'ativo', role: 'user', dataCadastro: '2024-08-30', totalCompras: 24, totalGasto: 28900.00, cidade: 'Curitiba', estado: 'PR', ultimoAcesso: '2026-05-20' },
  { id: 'U005', nome: 'Pedro Ferreira', email: 'pedro@email.com', cpf: '321.654.987-00', telefone: '(51) 95432-1098', status: 'ativo', role: 'user', dataCadastro: '2025-01-05', totalCompras: 5, totalGasto: 1890.00, cidade: 'Porto Alegre', estado: 'RS', ultimoAcesso: '2026-05-18' },
  { id: 'U006', nome: 'Lucia Mendes', email: 'lucia@email.com', cpf: '789.123.456-00', telefone: '(85) 94321-0987', status: 'ativo', role: 'user', dataCadastro: '2025-03-14', totalCompras: 3, totalGasto: 670.80, cidade: 'Fortaleza', estado: 'CE', ultimoAcesso: '2026-05-17' },
  { id: 'U007', nome: 'Roberto Lima', email: 'roberto@email.com', cpf: '159.753.486-00', telefone: '(62) 93210-9876', status: 'ativo', role: 'user', dataCadastro: '2025-04-20', totalCompras: 1, totalGasto: 349.90, cidade: 'Goiânia', estado: 'GO', ultimoAcesso: '2026-05-15' },
  { id: 'U008', nome: 'Admin Kainow', email: 'admin@kainow.com', cpf: '000.000.000-00', telefone: '(11) 90000-0000', status: 'ativo', role: 'admin', dataCadastro: '2023-01-01', totalCompras: 0, totalGasto: 0, cidade: 'São Paulo', estado: 'SP', ultimoAcesso: '2026-05-20' },
]

const mockPedidos: Pedido[] = [
  { id: '#KNW-10042', cliente: 'João Silva',     lojista: 'TechStore Brasil',     produto: 'iPhone 15 Pro Max 256GB Titânio',     valor: 7999.99, status: 'concluido',    data: '2026-05-19', pagamento: 'Cartão 12x',   rastreio: 'BR123456789', frete: 0,     desconto: 0,    itens: 1 },
  { id: '#KNW-10041', cliente: 'Maria Santos',   lojista: 'Moda Feminina da Lú', produto: 'Vestido Midi Floral Verão 2025',       valor: 189.90,  status: 'em_andamento', data: '2026-05-19', pagamento: 'Pix',          rastreio: 'BR987654321', frete: 0,     desconto: 0,    itens: 1 },
  { id: '#KNW-10040', cliente: 'Carlos Oliveira',lojista: 'SportMax',             produto: 'Tênis Asics Gel-Nimbus 26',            valor: 899.90,  status: 'pendente',     data: '2026-05-18', pagamento: 'Boleto',       rastreio: null,          frete: 29.90, desconto: 0,    itens: 1 },
  { id: '#KNW-10039', cliente: 'Ana Costa',      lojista: 'Casa & Conforto',      produto: 'Jogo de Panelas 5 peças Tramontina',   valor: 399.00,  status: 'cancelado',    data: '2026-05-18', pagamento: 'Cartão Déb.', rastreio: null,          frete: 0,     desconto: 50,   itens: 1 },
  { id: '#KNW-10038', cliente: 'Pedro Ferreira', lojista: 'TechStore Brasil',     produto: 'Samsung Galaxy S24 Ultra 512GB',       valor: 6299.00, status: 'concluido',    data: '2026-05-17', pagamento: 'Cartão 12x',   rastreio: 'BR456789123', frete: 0,     desconto: 0,    itens: 1 },
  { id: '#KNW-10037', cliente: 'Lucia Mendes',   lojista: 'Beleza Total Shop',    produto: 'Kit Skincare Vitamina C La Roche',     valor: 299.90,  status: 'em_andamento', data: '2026-05-17', pagamento: 'Pix',          rastreio: 'BR789123456', frete: 0,     desconto: 30,   itens: 2 },
  { id: '#KNW-10036', cliente: 'Roberto Lima',   lojista: 'InfoTech Computadores',produto: 'Notebook Dell XPS 15 i9 32GB',         valor: 12499.00,status: 'concluido',    data: '2026-05-16', pagamento: 'Cartão 18x',   rastreio: 'BR321654987', frete: 0,     desconto: 0,    itens: 1 },
  { id: '#KNW-10035', cliente: 'João Silva',     lojista: 'SportMax',             produto: 'Bicicleta Elétrica Trek FX+ 2024',     valor: 8999.00, status: 'em_andamento', data: '2026-05-16', pagamento: 'Cartão 18x',   rastreio: 'BR654987321', frete: 0,     desconto: 0,    itens: 1 },
  { id: '#KNW-10034', cliente: 'Maria Santos',   lojista: 'Beleza Total Shop',    produto: 'Perfume Chanel N5 100ml',              valor: 1299.00, status: 'concluido',    data: '2026-05-15', pagamento: 'Pix',          rastreio: 'BR987321654', frete: 0,     desconto: 200,  itens: 1 },
  { id: '#KNW-10033', cliente: 'Ana Costa',      lojista: 'TechStore Brasil',     produto: 'Apple Watch Series 9 GPS 45mm',        valor: 3199.00, status: 'pendente',     data: '2026-05-15', pagamento: 'Cartão 12x',   rastreio: null,          frete: 0,     desconto: 0,    itens: 1 },
]

const mockReclamacoes = [
  { id: 'R001', cliente: 'João Silva',   pedido: '#KNW-10020', lojista: 'Gamer Zone',       motivo: 'Produto não chegou',        status: 'aberta',   data: '2026-05-18', prioridade: 'alta' },
  { id: 'R002', cliente: 'Ana Costa',    pedido: '#KNW-10025', lojista: 'Casa & Conforto',  motivo: 'Produto diferente da foto', status: 'em_analise', data: '2026-05-17', prioridade: 'media' },
  { id: 'R003', cliente: 'Pedro Lima',   pedido: '#KNW-10019', lojista: 'Gamer Zone',       motivo: 'Produto com defeito',       status: 'resolvida', data: '2026-05-15', prioridade: 'alta' },
  { id: 'R004', cliente: 'Maria Santos', pedido: '#KNW-10030', lojista: 'Moda Feminina da Lú', motivo: 'Tamanho errado',         status: 'aberta',   data: '2026-05-20', prioridade: 'baixa' },
]

const mockGiftCards = [
  { codigo: 'KNWG-A3B2-X9Y1-4Z5W', valor: 100, saldo: 100, status: 'disponivel', criado: '2026-05-01', expira: '2027-05-01', usadoPor: null },
  { codigo: 'KNWG-Q7R5-M2N8-9PL3', valor: 50,  saldo: 0,   status: 'usado',      criado: '2026-04-10', expira: '2027-04-10', usadoPor: 'Maria Santos' },
  { codigo: 'KNWG-B5C3-D8E1-7FG2', valor: 200, saldo: 200, status: 'disponivel', criado: '2026-05-15', expira: '2027-05-15', usadoPor: null },
  { codigo: 'KNWG-X2Y4-Z6W8-3VU9', valor: 500, saldo: 320, status: 'parcial',    criado: '2026-03-20', expira: '2027-03-20', usadoPor: 'João Silva' },
]

// ══════════════════════════════════════════════════════════
// DADOS ANALÍTICOS — 30 DIAS
// ══════════════════════════════════════════════════════════

const mock30DaysRevenue = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-04-21')
  date.setDate(date.getDate() + i)
  const dia = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const base = 25000
  const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1
  const trend = 1 + i * 0.008
  const noise = 0.8 + Math.random() * 0.4
  const valor = Math.round(base * weekend * trend * noise)
  const pedidos = Math.round(valor / 220)
  return { dia, valor, pedidos }
})

const mockPieData = [
  { name: 'Eletrônicos', value: 289430, fill: '#f97316' },
  { name: 'Informática', value: 176540, fill: '#3b82f6' },
  { name: 'Moda',        value: 118230, fill: '#a855f7' },
  { name: 'Esportes',    value: 84730,  fill: '#10b981' },
  { name: 'Casa',        value: 67890,  fill: '#f59e0b' },
  { name: 'Outros',      value: 110500, fill: '#6b7280' },
]

const mockTopLojistasBar = [
  { nome: 'SportMax',     vendas: 198750 },
  { nome: 'InfoTech',     vendas: 143200 },
  { nome: 'TechStore',    vendas: 125430 },
  { nome: 'Beleza Total', vendas: 89230  },
  { nome: 'Moda da Lú',   vendas: 67890  },
]

// ══════════════════════════════════════════════════════════
// CSV EXPORT
// ══════════════════════════════════════════════════════════

function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const bom = '\uFEFF'
  const csvContent = bom + [headers.join(';'), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';'))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportPedidosCSV(pedidos: Pedido[]) {
  exportCSV(
    `kainow-pedidos-${new Date().toISOString().slice(0,10)}.csv`,
    ['ID Pedido', 'Cliente', 'Lojista', 'Produto', 'Valor (R$)', 'Frete (R$)', 'Desconto (R$)', 'Status', 'Pagamento', 'Data', 'Rastreio'],
    pedidos.map(p => [p.id, p.cliente, p.lojista, p.produto, p.valor, p.frete, p.desconto, p.status, p.pagamento, p.data, p.rastreio ?? ''])
  )
}

function exportLojistasCSV(lojistas: Lojista[]) {
  exportCSV(
    `kainow-lojistas-${new Date().toISOString().slice(0,10)}.csv`,
    ['ID', 'Nome', 'Email', 'CNPJ', 'Telefone', 'Status', 'Reputação', 'Plano', 'Total Vendas (R$)', 'Total Pedidos', 'Avaliação', 'Comissão (%)', 'Saldo Pendente (R$)', 'Categoria', 'Cidade', 'Estado', 'Data Cadastro'],
    lojistas.map(l => [l.id, l.nome, l.email, l.cnpj, l.telefone, l.status, l.reputacao, l.plano, l.totalVendas, l.totalPedidos, l.avaliacaoMedia, l.comissao, l.saldoPendente, l.categoria, l.cidade, l.estado, l.dataCadastro])
  )
}

function exportUsuariosCSV(usuarios: Usuario[]) {
  exportCSV(
    `kainow-usuarios-${new Date().toISOString().slice(0,10)}.csv`,
    ['ID', 'Nome', 'Email', 'CPF', 'Telefone', 'Status', 'Role', 'Total Compras', 'Total Gasto (R$)', 'Cidade', 'Estado', 'Último Acesso', 'Data Cadastro'],
    usuarios.map(u => [u.id, u.nome, u.email, u.cpf, u.telefone, u.status, u.role, u.totalCompras, u.totalGasto, u.cidade, u.estado, u.ultimoAcesso, u.dataCadastro])
  )
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function fmtNum(v: number) {
  return v.toLocaleString('pt-BR')
}

function buildAdminProdutos(src: Product[]): ProdutoAdmin[] {
  return src.map(p => ({
    id: p.id, nome: p.title, lojista: p.seller,
    categoria: realCategories.find(c => c.id === p.category)?.name ?? p.category,
    preco: p.price, estoque: p.stock,
    status: p.stock === 0 ? 'esgotado' : 'ativo',
    vendidos: p.sold, avaliacao: p.rating,
    badge: p.badge ?? '', discount: p.discount ?? 0, image: p.image,
  }))
}

function Badge({ status }: { status: string }) {
  const m: Record<string, string> = {
    ativo:        'bg-green-100 text-green-700',
    pendente:     'bg-yellow-100 text-yellow-700',
    suspenso:     'bg-red-100 text-red-700',
    bloqueado:    'bg-red-100 text-red-700',
    em_andamento: 'bg-blue-100 text-blue-700',
    concluido:    'bg-green-100 text-green-700',
    cancelado:    'bg-gray-100 text-gray-500',
    esgotado:     'bg-red-50 text-red-500',
    disponivel:   'bg-green-100 text-green-700',
    usado:        'bg-gray-100 text-gray-500',
    parcial:      'bg-orange-100 text-orange-700',
    aberta:       'bg-red-100 text-red-700',
    em_analise:   'bg-yellow-100 text-yellow-700',
    resolvida:    'bg-green-100 text-green-700',
    admin:        'bg-purple-100 text-purple-700',
    user:         'bg-blue-100 text-blue-700',
    Platinum:     'bg-gradient-to-r from-violet-500 to-indigo-500 text-white',
    Gold:         'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
    Silver:       'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
    Bronze:       'bg-gradient-to-r from-orange-700 to-amber-600 text-white',
  }
  const labels: Record<string, string> = {
    ativo:'Ativo', pendente:'Pendente', suspenso:'Suspenso', bloqueado:'Bloqueado',
    em_andamento:'Em andamento', concluido:'Concluído', cancelado:'Cancelado',
    esgotado:'Esgotado', disponivel:'Disponível', usado:'Usado', parcial:'Parcial',
    aberta:'Aberta', em_analise:'Em análise', resolvida:'Resolvida',
    admin:'Admin', user:'Usuário',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[status] ?? status}
    </span>
  )
}

function ReputBadge({ rep }: { rep: string }) {
  const m: Record<string, string> = {
    Platinum: 'bg-violet-100 text-violet-700 border border-violet-200',
    Gold:     'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Silver:   'bg-gray-100 text-gray-600 border border-gray-200',
    Bronze:   'bg-orange-100 text-orange-700 border border-orange-200',
  }
  const icons: Record<string, string> = { Platinum:'💎', Gold:'🥇', Silver:'🥈', Bronze:'🥉' }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${m[rep] ?? 'bg-gray-100 text-gray-600'}`}>
      {icons[rep]} {rep}
    </span>
  )
}

// ══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════
// MODAIS — componentes fora do AdminPanel (Rules of Hooks)
// ══════════════════════════════════════════════════════════

type ModalProdutoProps = { editTarget: any; setShowModal: (v:string|null)=>void; setEditTarget: (v:any)=>void; setProdutos: (fn:any)=>void; toast_: (msg:string)=>void }
function ModalProduto({ editTarget, setShowModal, setEditTarget, setProdutos, toast_ }: ModalProdutoProps) {
  const isEdit = !!editTarget
  const [form, setForm] = useState<any>(editTarget || { nome:'', lojista:'', categoria:'Eletrônicos', preco:'', estoque:'', badge:'', discount:'', image:'', avaliacao:'4.5' })
  function save() {
    const preco    = parseFloat(String(form.preco).replace(',','.')) || 0
    const estoque  = parseInt(String(form.estoque)) || 0
    const discount = parseInt(String(form.discount)) || 0
    const avaliacao = parseFloat(String(form.avaliacao)) || 4.5
    if (isEdit) {
      setProdutos((p:any[])=>p.map(x=>x.id===editTarget.id ? {...x,nome:form.nome,lojista:form.lojista,categoria:form.categoria,preco,estoque,discount,badge:form.badge,image:form.image,avaliacao,status:estoque===0?'esgotado':'ativo'} : x))
      toast_(`✅ "${form.nome.slice(0,25)}" atualizado!`)
    } else {
      setProdutos((p:any[])=>[...p, {id:`P-${Date.now()}`,nome:form.nome,lojista:form.lojista,categoria:form.categoria,preco,estoque,discount,badge:form.badge,image:form.image,avaliacao,vendidos:0,status:estoque===0?'esgotado':'ativo'}])
      toast_(`✅ Produto criado!`)
    }
    setShowModal(null); setEditTarget(null)
  }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>{setShowModal(null);setEditTarget(null)}}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{isEdit?'✏️ Editar Produto':'➕ Novo Produto'}</h3>
          <button onClick={()=>{setShowModal(null);setEditTarget(null)}} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        {form.image && <div className="mx-6 mt-4"><img src={form.image} alt="" className="w-full h-36 object-cover rounded-xl border"/></div>}
        <div className="p-6 space-y-4">
          <div><label className="text-xs font-semibold text-gray-700 block mb-1">Nome do Produto *</label>
            <input type="text" value={form.nome} onChange={e=>setForm((p:any)=>({...p,nome:e.target.value}))} placeholder="Ex: Smartphone Pro X"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          <div><label className="text-xs font-semibold text-gray-700 block mb-1">Lojista *</label>
            <select value={form.lojista} onChange={e=>setForm((p:any)=>({...p,lojista:e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
              <option value="">— Selecionar —</option>
              {mockLojistas.map(l=><option key={l.id}>{l.nome}</option>)}
            </select></div>
          <div><label className="text-xs font-semibold text-gray-700 block mb-1">Categoria</label>
            <select value={form.categoria} onChange={e=>setForm((p:any)=>({...p,categoria:e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
              {realCategories.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Preço (R$) *</label>
              <input type="number" step="0.01" min="0" value={form.preco} onChange={e=>setForm((p:any)=>({...p,preco:e.target.value}))} placeholder="0,00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Desconto (%)</label>
              <input type="number" min="0" max="99" value={form.discount} onChange={e=>setForm((p:any)=>({...p,discount:e.target.value}))} placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Estoque *</label>
              <input type="number" min="0" value={form.estoque} onChange={e=>setForm((p:any)=>({...p,estoque:e.target.value}))} placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Avaliação (0–5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.avaliacao} onChange={e=>setForm((p:any)=>({...p,avaliacao:e.target.value}))} placeholder="4.5"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          </div>
          <div><label className="text-xs font-semibold text-gray-700 block mb-1">Badge</label>
            <select value={form.badge} onChange={e=>setForm((p:any)=>({...p,badge:e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
              {['','MAIS VENDIDO','OFERTA','LANÇAMENTO','PROMOÇÃO','HOT','SUPER OFERTA','LIQUIDAÇÃO','EXCLUSIVO','PREMIUM','DESTAQUE'].map(b=>(
                <option key={b} value={b}>{b||'— Nenhuma —'}</option>
              ))}
            </select></div>
          <div><label className="text-xs font-semibold text-gray-700 block mb-1">URL da Imagem</label>
            <input type="url" value={form.image} onChange={e=>setForm((p:any)=>({...p,image:e.target.value}))} placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
            <span className="text-gray-500 text-xs">Status automático:</span>
            <Badge status={parseInt(String(form.estoque))===0?'esgotado':'ativo'}/>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={()=>{setShowModal(null);setEditTarget(null)}} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Cancelar</button>
          <button onClick={save} disabled={!form.nome||!form.preco}
            className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-40">
            <Save size={15}/> {isEdit?'Salvar':'Criar produto'}
          </button>
        </div>
      </div>
    </div>
  )
}

type ModalLojistaProps = { editTarget: any; setShowModal: (v:string|null)=>void; setLojistas: (fn:any)=>void; toast_: (msg:string)=>void }
function ModalLojista({ editTarget, setShowModal, setLojistas, toast_ }: ModalLojistaProps) {
  const isEdit = !!editTarget
  const [form, setForm] = useState<any>(editTarget || { nome:'', email:'', cnpj:'', telefone:'', categoria:'Eletrônicos', cidade:'', estado:'SP', plano:'Básico', status:'pendente', comissao:'10' })
  function save() {
    if (isEdit) {
      setLojistas((p:any[])=>p.map(x=>x.id===editTarget.id?{...x,...form,comissao:parseInt(form.comissao)||10}:x))
      toast_(`✅ ${form.nome} atualizado!`)
    } else {
      setLojistas((p:any[])=>[...p,{...form,id:`L${Date.now()}`,totalVendas:0,totalPedidos:0,dataCadastro:new Date().toISOString().split('T')[0],reputacao:'Bronze',avaliacaoMedia:0,saldoPendente:0,comissao:parseInt(form.comissao)||10}])
      toast_(`✅ ${form.nome} cadastrado!`)
    }
    setShowModal(null)
  }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowModal(null)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{isEdit?'✏️ Editar Lojista':'➕ Novo Lojista'}</h3>
          <button onClick={()=>setShowModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          {[{k:'nome',l:'Nome da Loja *',t:'text',ph:'TechStore Brasil'},{k:'email',l:'Email *',t:'email',ph:'contato@loja.com'},{k:'cnpj',l:'CNPJ',t:'text',ph:'00.000.000/0001-00'},{k:'telefone',l:'Telefone',t:'text',ph:'(11) 99999-9999'},{k:'cidade',l:'Cidade',t:'text',ph:'São Paulo'}].map(f=>(
            <div key={f.k}><label className="text-xs font-semibold text-gray-700 block mb-1">{f.l}</label>
              <input type={f.t} value={form[f.k]||''} placeholder={f.ph} onChange={e=>setForm((p:any)=>({...p,[f.k]:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Estado</label>
              <select value={form.estado||'SP'} onChange={e=>setForm((p:any)=>({...p,estado:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                {['SP','RJ','MG','RS','PR','SC','BA','CE','PE','GO','DF','ES'].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Plano</label>
              <select value={form.plano||'Básico'} onChange={e=>setForm((p:any)=>({...p,plano:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                {['Básico','Premium','Enterprise'].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Comissão %</label>
              <input type="number" min="1" max="30" value={form.comissao||'10'} onChange={e=>setForm((p:any)=>({...p,comissao:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Categoria</label>
              <select value={form.categoria||'Eletrônicos'} onChange={e=>setForm((p:any)=>({...p,categoria:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                {realCategories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Status</label>
              <select value={form.status||'pendente'} onChange={e=>setForm((p:any)=>({...p,status:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                {['ativo','pendente','suspenso'].map(s=><option key={s}>{s}</option>)}
              </select></div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={()=>setShowModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Cancelar</button>
          <button onClick={save} disabled={!form.nome||!form.email}
            className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-40">
            <Save size={15}/> {isEdit?'Salvar alterações':'Cadastrar lojista'}
          </button>
        </div>
      </div>
    </div>
  )
}

type ModalUsuarioProps = { editTarget: any; setShowModal: (v:string|null)=>void; setUsuarios: (fn:any)=>void; toast_: (msg:string)=>void }
function ModalUsuario({ editTarget, setShowModal, setUsuarios, toast_ }: ModalUsuarioProps) {
  const [form, setForm] = useState<any>(editTarget || { nome:'', email:'', telefone:'', status:'ativo', role:'user' })
  function save() {
    setUsuarios((p:any[])=>p.map(x=>x.id===editTarget?.id?{...x,...form}:x))
    toast_('✅ Usuário atualizado!')
    setShowModal(null)
  }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowModal(null)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">✏️ Editar Usuário</h3>
          <button onClick={()=>setShowModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          {[{k:'nome',l:'Nome completo',t:'text'},{k:'email',l:'Email',t:'email'},{k:'telefone',l:'Telefone',t:'text'}].map(f=>(
            <div key={f.k}><label className="text-xs font-semibold text-gray-700 block mb-1">{f.l}</label>
              <input type={f.t} value={form[f.k]||''} onChange={e=>setForm((p:any)=>({...p,[f.k]:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/></div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Status</label>
              <select value={form.status} onChange={e=>setForm((p:any)=>({...p,status:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                {['ativo','bloqueado'].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold text-gray-700 block mb-1">Função</label>
              <select value={form.role} onChange={e=>setForm((p:any)=>({...p,role:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                {['user','admin'].map(s=><option key={s}>{s}</option>)}
              </select></div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={()=>setShowModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Cancelar</button>
          <button onClick={save} className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90">Salvar</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [loggedIn,      setLoggedIn]      = useState(false)
  const [loginEmail,    setLoginEmail]    = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError,    setLoginError]    = useState('')
  const [activeTab,     setActiveTab]     = useState('dashboard')
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [lojistas,      setLojistas]      = useState<Lojista[]>(mockLojistas)
  const [usuarios,      setUsuarios]      = useState<Usuario[]>(mockUsuarios)
  const [produtos,      setProdutos]      = useState<ProdutoAdmin[]>(buildAdminProdutos(realProducts))
  const [pedidos,       setPedidos]       = useState<Pedido[]>(mockPedidos)
  const [showModal,     setShowModal]     = useState<string | null>(null)
  const [editTarget,    setEditTarget]    = useState<any>(null)
  const [toast,         setToast]         = useState<string | null>(null)

  // Buscas independentes por aba
  const [searchLojistas, setSearchLojistas] = useState('')
  const [searchUsuarios, setSearchUsuarios] = useState('')
  const [searchProdutos, setSearchProdutos] = useState('')
  const [searchPedidos,  setSearchPedidos]  = useState('')

  // Filtros
  const [filtroLojistaStatus,  setFiltroLojistaStatus]  = useState('todos')
  const [filtroUsuarioStatus,  setFiltroUsuarioStatus]  = useState('todos')
  const [filtroPedidoStatus,   setFiltroPedidoStatus]   = useState('todos')
  const [filtroProdutoCateg,   setFiltroProdutoCateg]   = useState('todos')

  // Reclamações state (movido do renderReclamacoes — hooks só no topo)
  const [reclamacoes,  setReclamacoes]  = useState(mockReclamacoes)

  // Gift Cards state (movido do renderGiftCards — hooks só no topo)
  const [giftCards,      setGiftCards]      = useState(mockGiftCards)
  const [gcShowCreate,   setGcShowCreate]   = useState(false)
  const [gcNovoValor,    setGcNovoValor]    = useState(100)
  const [gcNovoMeses,    setGcNovoMeses]    = useState(12)
  const [gcFiltro,       setGcFiltro]       = useState<'todos'|'disponivel'|'usado'|'expirado'>('todos')

  // Entregadores state (todos no topo — Rules of Hooks)
  const [entregadores, setEntregadores] = useState<Entregador[]>(mockEntregadores)
  const [corridas,     setCorridas]     = useState<Corrida[]>(mockCorridas)
  const [searchEntregadores, setSearchEntregadores] = useState('')
  const [filtroEntregadorStatus, setFiltroEntregadorStatus] = useState('todos')

  // Config plataforma state
  const [taxaEntregaBase,      setTaxaEntregaBase]      = useState(configPlataforma.taxaEntregaBase)
  const [taxaEntregaPorKm,     setTaxaEntregaPorKm]     = useState(configPlataforma.taxaEntregaPorKm)
  const [percentualEntregador, setPercentualEntregador] = useState(configPlataforma.percentualEntregador)
  const [comissaoLojista,      setComissaoLojista]      = useState(configPlataforma.comissaoLojista)

  // Categorias states (movidos do renderCategorias — Rules of Hooks)
  const [cats,           setCats]           = useState(() => realCategories.map(c => ({ ...c, subcategories: [...c.subcategories] })))

  // ── EDITOR DO SITE — CMS states ──
  const [siteTheme,      setSiteTheme]      = useState<SiteTheme>(defaultTheme)
  const [cmsPages,       setCmsPages]       = useState<CmsPage[]>(mockCmsPages)
  const [blocos,         setBlocos]         = useState<ModuloBloco[]>(mockBlocos)
  const [editorTab,      setEditorTab]      = useState<'identidade'|'paginas'|'modulos'>('identidade')
  const [editorAmbiente, setEditorAmbiente] = useState<'home'|'lojista'|'entregador'>('home')
  const [editingPage,    setEditingPage]    = useState<CmsPage|null>(null)
  const [newPageModal,   setNewPageModal]   = useState(false)
  const [previewMode,    setPreviewMode]    = useState<'desktop'|'tablet'|'mobile'>('desktop')
  const [themePreview,   setThemePreview]   = useState(false)
  const [expandedCat,    setExpandedCat]    = useState<string | null>(null)
  const [editingCat,     setEditingCat]     = useState<string | null>(null)
  const [editingSubIdx,  setEditingSubIdx]  = useState<number | null>(null)
  const [newCatName,     setNewCatName]     = useState('')
  const [newCatIcon,     setNewCatIcon]     = useState('🛍️')
  const [newSubName,     setNewSubName]     = useState('')
  const [editVal,        setEditVal]        = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('kainow_admin') === 'true') setLoggedIn(true)
  }, [])

  function toast_(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loginEmail === ADMIN_CREDENTIALS.email && loginPassword === ADMIN_CREDENTIALS.password) {
      setLoggedIn(true)
      sessionStorage.setItem('kainow_admin', 'true')
    } else {
      setLoginError('Email ou senha incorretos. Tente novamente.')
    }
  }

  // ── filtros computados ──
  const lojistasFiltrados = useMemo(() => {
    return lojistas.filter(l => {
      const q = searchLojistas.toLowerCase()
      const match = !q || [l.nome,l.email,l.cidade,l.categoria,l.id].some(v=>v.toLowerCase().includes(q))
      const statusOk = filtroLojistaStatus === 'todos' || l.status === filtroLojistaStatus
      return match && statusOk
    })
  }, [lojistas, searchLojistas, filtroLojistaStatus])

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const q = searchUsuarios.toLowerCase()
      const match = !q || [u.nome,u.email,u.cidade,u.id].some(v=>v.toLowerCase().includes(q))
      const statusOk = filtroUsuarioStatus === 'todos' || u.status === filtroUsuarioStatus || u.role === filtroUsuarioStatus
      return match && statusOk
    })
  }, [usuarios, searchUsuarios, filtroUsuarioStatus])

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const q = searchProdutos.toLowerCase()
      const match = !q || [p.nome,p.lojista,p.categoria].some(v=>v.toLowerCase().includes(q))
      const categOk = filtroProdutoCateg === 'todos' || p.categoria === filtroProdutoCateg
      return match && categOk
    })
  }, [produtos, searchProdutos, filtroProdutoCateg])

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(p => {
      const q = searchPedidos.toLowerCase()
      const match = !q || [p.id,p.cliente,p.lojista,p.produto].some(v=>v.toLowerCase().includes(q))
      const statusOk = filtroPedidoStatus === 'todos' || p.status === filtroPedidoStatus
      return match && statusOk
    })
  }, [pedidos, searchPedidos, filtroPedidoStatus])

  // ── ENTREGADORES — filtro (deve ficar ANTES do early return — Rules of Hooks) ──
  const entregFiltrados = useMemo(() => {
    let list = entregadores
    if (filtroEntregadorStatus !== 'todos') list = list.filter(e => e.status === filtroEntregadorStatus)
    if (searchEntregadores.trim()) {
      const q = searchEntregadores.toLowerCase()
      list = list.filter(e => e.nome.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.cidade.toLowerCase().includes(q))
    }
    return list
  }, [entregadores, filtroEntregadorStatus, searchEntregadores])

  // ── LOGIN ──
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">K</span>
              </div>
              <div className="text-left">
                <p className="text-white font-black text-2xl leading-none">Kainow One</p>
                <p className="text-orange-400 text-sm font-semibold">Painel Administrativo</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={22} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">Acesso Restrito</h2>
            </div>
            {loginError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}
                  placeholder="admin@kainow.com" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Senha</label>
                <input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2">
                <Lock size={16} /> Entrar no Painel
              </button>
            </form>
            <div className="mt-6 p-4 bg-orange-50 rounded-xl text-xs text-gray-600">
              <p className="font-semibold mb-1 text-orange-700">Credenciais de acesso:</p>
              <p>📧 admin@kainow.com</p>
              <p>🔑 Admin@2026</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-1 transition">
              <Home size={14} /> Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── SIDEBAR ──
  const menuItems = [
    { id: 'dashboard',    label: 'Dashboard',      icon: <LayoutDashboard size={18} /> },
    { id: 'lojistas',     label: 'Lojistas',        icon: <Store size={18} />,        badge: lojistas.filter(l=>l.status==='pendente').length },
    { id: 'produtos',     label: 'Produtos',        icon: <Package size={18} />,      badge: produtos.filter(p=>p.estoque===0).length },
    { id: 'pedidos',      label: 'Pedidos',         icon: <ShoppingBag size={18} />,  badge: pedidos.filter(p=>p.status==='pendente').length },
    { id: 'usuarios',     label: 'Usuários',        icon: <Users size={18} />,        badge: usuarios.filter(u=>u.status==='bloqueado').length },
    { id: 'entregadores', label: 'Entregadores',    icon: <Truck size={18} />,        badge: entregadores.filter(e=>!e.documentosOk).length },
    { id: 'reclamacoes',  label: 'Reclamações',     icon: <AlertTriangle size={18} />,badge: mockReclamacoes.filter(r=>r.status==='aberta').length },
    { id: 'financeiro',   label: 'Financeiro',      icon: <DollarSign size={18} /> },
    { id: 'gift-cards',   label: 'Gift Cards',      icon: <Gift size={18} /> },
    { id: 'config',       label: 'Configurações',   icon: <Settings size={18} /> },
  { id: 'editor-site',  label: 'Editor do Site',  icon: <Palette size={18} /> },
  ]

  // ══════════════════════════════════════════════════════════
  // TABS
  // ══════════════════════════════════════════════════════════

  // ── DASHBOARD ──
  function renderDashboard() {
    const maxBar = Math.max(...mockStats.vendasUltimos7Dias.map(d=>d.valor))
    return (
      <div className="space-y-6">
        {/* Alerta urgente */}
        {mockReclamacoes.filter(r=>r.status==='aberta').length > 0 && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle size={16} />
              <strong>{mockReclamacoes.filter(r=>r.status==='aberta').length} reclamações abertas</strong> precisam de atenção imediata
            </div>
            <button onClick={()=>setActiveTab('reclamacoes')} className="text-xs font-bold underline">Ver agora</button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label:'Receita Total',   value: fmt(mockStats.receitaMes),     sub:`Hoje: ${fmt(mockStats.receitaHoje)}`,      icon:<DollarSign size={22}/>, color:'from-orange-500 to-rose-500',     trend:+mockStats.crescimentoVendas },
            { label:'Total Pedidos',   value: fmtNum(mockStats.totalPedidos),sub:`Hoje: ${mockStats.totalPedidosHoje} novos`,icon:<ShoppingBag size={22}/>,color:'from-blue-500 to-indigo-600',     trend:+mockStats.crescimentoPedidos },
            { label:'Lojistas Ativos', value: mockStats.lojistasAtivos.toString(), sub:`${lojistas.filter(l=>l.status==='pendente').length} aguardando aprovação`, icon:<Store size={22}/>, color:'from-emerald-500 to-teal-500', trend:+mockStats.crescimentoLojistas },
            { label:'Usuários',        value: fmtNum(mockStats.totalUsuarios),sub:`+${mockStats.usuariosNovosHoje} hoje`,    icon:<Users size={22}/>,      color:'from-purple-500 to-violet-600',   trend:+mockStats.crescimentoUsuarios },
          ].map((s,i)=>(
            <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/20 rounded-xl p-2">{s.icon}</div>
                <span className="flex items-center gap-0.5 text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                  <ArrowUpRight size={11}/> +{s.trend}%
                </span>
              </div>
              <p className="text-2xl font-black mb-0.5 leading-tight">{s.value}</p>
              <p className="text-xs text-white/80">{s.label}</p>
              <p className="text-xs text-white/60 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Status pedidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'Pendentes',     v: mockStats.pedidosPendentes,   cls:'bg-yellow-50 border-yellow-200 text-yellow-700', icon:<Clock size={16} className="text-yellow-500"/> },
            { label:'Em andamento',  v: mockStats.pedidosEmAndamento,  cls:'bg-blue-50 border-blue-200 text-blue-700',       icon:<Truck size={16} className="text-blue-500"/> },
            { label:'Concluídos',    v: mockStats.pedidosConcluidos,   cls:'bg-green-50 border-green-200 text-green-700',    icon:<CheckCircle2 size={16} className="text-green-500"/> },
            { label:'Cancelados',    v: mockStats.pedidosCancelados,   cls:'bg-gray-50 border-gray-200 text-gray-600',       icon:<XCircle size={16} className="text-gray-400"/> },
          ].map((s,i)=>(
            <div key={i} className={`border rounded-xl p-4 flex items-center gap-3 ${s.cls}`}>
              {s.icon}
              <div>
                <p className="text-xl font-black">{fmtNum(s.v)}</p>
                <p className="text-xs font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* SVG LineChart — Faturamento 30 dias */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Faturamento — Últimos 30 dias</h3>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Mês: {fmt(mockStats.receitaMes)}</span>
            </div>
            {(() => {
              const data = mock30DaysRevenue
              const maxV = Math.max(...data.map(d=>d.valor))
              const minV = Math.min(...data.map(d=>d.valor))
              const w = 520, h = 160, pad = { t:8, r:8, b:24, l:40 }
              const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b
              const px = (i:number) => pad.l + (i/(data.length-1))*gw
              const py = (v:number) => pad.t + gh - ((v-minV)/(maxV-minV||1))*gh
              const pts = data.map((d,i)=>`${px(i)},${py(d.valor)}`).join(' ')
              return (
                <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{height:160}}>
                  {[0,0.25,0.5,0.75,1].map((t,i)=>(
                    <g key={i}>
                      <line x1={pad.l} x2={w-pad.r} y1={pad.t+gh*t} y2={pad.t+gh*t} stroke="#f0f0f0" strokeWidth="1"/>
                      <text x={pad.l-4} y={pad.t+gh*t+4} textAnchor="end" fontSize="9" fill="#9ca3af">{((maxV-(maxV-minV)*t)/1000).toFixed(0)}k</text>
                    </g>
                  ))}
                  {data.filter((_,i)=>i%5===0).map((d,i,arr)=>(
                    <text key={i} x={px(data.indexOf(d))} y={h-4} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.dia}</text>
                  ))}
                  <polyline points={pts} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.15"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polygon points={`${pad.l},${pad.t+gh} ${pts} ${w-pad.r},${pad.t+gh}`} fill="url(#lg1)"/>
                </svg>
              )
            })()}
          </div>

          {/* CSS Donut — Receita por categoria */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3">Receita por Categoria</h3>
            <div className="space-y-2">
              {mockPieData.map((d,i)=>(
                <div key={i}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                      <span className="text-xs text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{fmt(d.value)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{width:`${Math.round(d.value/mockStats.receitaMes*100)}%`,background:d.fill}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSS BarChart — Top Lojistas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">Top 5 Lojistas por Faturamento</h3>
          <div className="flex items-end gap-3 h-40">
            {mockTopLojistasBar.map((d,i)=>{
              const maxV = Math.max(...mockTopLojistasBar.map(x=>x.vendas))
              const pct = d.vendas/maxV*100
              const colors = ['#f97316','#3b82f6','#a855f7','#10b981','#f59e0b']
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-500">{(d.vendas/1000).toFixed(0)}k</span>
                  <div className="w-full rounded-t-lg transition-all" style={{height:`${pct}%`,background:colors[i],minHeight:8}}/>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{d.nome}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Últimos pedidos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Últimos Pedidos</h3>
              <button onClick={()=>setActiveTab('pedidos')} className="text-orange-500 text-xs font-semibold hover:underline">Ver todos →</button>
            </div>
            <div className="divide-y divide-gray-50">
              {mockPedidos.slice(0,5).map(p=>(
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{p.id}</p>
                    <p className="text-xs text-gray-500 truncate">{p.cliente} · {p.produto.slice(0,28)}…</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-sm font-bold">{fmt(p.valor)}</span>
                    <Badge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top lojistas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Top Lojistas</h3>
              <button onClick={()=>setActiveTab('lojistas')} className="text-orange-500 text-xs font-semibold hover:underline">Ver todos →</button>
            </div>
            <div className="divide-y divide-gray-50">
              {[...lojistas].sort((a,b)=>b.totalVendas-a.totalVendas).slice(0,5).map((l,i)=>(
                <div key={l.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-lg font-black text-gray-300 w-5">{i+1}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {l.nome[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{l.nome}</p>
                    <p className="text-xs text-gray-500">{fmtNum(l.totalPedidos)} pedidos</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800 flex-shrink-0">{fmt(l.totalVendas)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métricas extras */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'Taxa de Conversão', value:`${mockStats.taxaConversao}%`,  icon:'📊', bg:'bg-blue-50 text-blue-700' },
            { label:'Ticket Médio',      value: fmt(mockStats.ticketMedio),    icon:'🎫', bg:'bg-green-50 text-green-700' },
            { label:'Reclamações',       value: mockStats.reclamacoes.toString(),icon:'⚠️', bg:'bg-red-50 text-red-700' },
            { label:'Devoluções',        value: mockStats.devolucoes.toString(),icon:'↩️', bg:'bg-orange-50 text-orange-700' },
          ].map((m,i)=>(
            <div key={i} className={`${m.bg} rounded-2xl p-4 border border-transparent`}>
              <p className="text-2xl mb-1">{m.icon}</p>
              <p className="text-xl font-black">{m.value}</p>
              <p className="text-xs font-medium opacity-80">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── LOJISTAS ──
  function renderLojistas() {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gerenciar Lojistas</h2>
            <p className="text-sm text-gray-500">
              {lojistas.length} cadastrados ·
              <span className="text-green-600 font-semibold"> {lojistas.filter(l=>l.status==='ativo').length} ativos</span> ·
              <span className="text-yellow-600 font-semibold"> {lojistas.filter(l=>l.status==='pendente').length} pendentes</span> ·
              <span className="text-red-500 font-semibold"> {lojistas.filter(l=>l.status==='suspenso').length} suspensos</span>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={()=>{exportLojistasCSV(lojistasFiltrados);toast_('📥 CSV de lojistas exportado!')}}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition">
              <Download size={15}/> CSV
            </button>
            <button onClick={()=>{setEditTarget(null);setShowModal('lojista')}}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition">
              <Plus size={16}/> Novo Lojista
            </button>
          </div>
        </div>

        {/* Pendentes em destaque */}
        {lojistas.filter(l=>l.status==='pendente').length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <Clock size={15}/> Aprovações pendentes
            </p>
            <div className="flex flex-wrap gap-2">
              {lojistas.filter(l=>l.status==='pendente').map(l=>(
                <div key={l.id} className="flex items-center gap-2 bg-white border border-yellow-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-semibold text-gray-800">{l.nome}</span>
                  <span className="text-xs text-gray-500">{l.cidade}/{l.estado}</span>
                  <button onClick={()=>{setLojistas(p=>p.map(x=>x.id===l.id?{...x,status:'ativo'}:x));toast_(`✅ ${l.nome} aprovado!`)}}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold hover:bg-green-600 transition">Aprovar</button>
                  <button onClick={()=>{setLojistas(p=>p.map(x=>x.id===l.id?{...x,status:'suspenso'}:x));toast_(`🚫 ${l.nome} rejeitado`)}}
                    className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg font-semibold hover:bg-red-200 transition">Rejeitar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchLojistas} onChange={e=>setSearchLojistas(e.target.value)}
              placeholder="Buscar por nome, email, cidade..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
          </div>
          {['todos','ativo','pendente','suspenso'].map(s=>(
            <button key={s} onClick={()=>setFiltroLojistaStatus(s)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition capitalize ${filtroLojistaStatus===s?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {s === 'todos' ? `Todos (${lojistas.length})` : `${s.charAt(0).toUpperCase()+s.slice(1)} (${lojistas.filter(l=>l.status===s).length})`}
            </button>
          ))}
        </div>

        {/* Tabela lista */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {lojistasFiltrados.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Store size={40} className="mx-auto mb-3 opacity-30"/>
              <p className="font-semibold">Nenhum lojista encontrado</p>
              <p className="text-sm mt-1">Tente ajustar o filtro ou a busca</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[320px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-3 py-3 font-semibold text-gray-600 min-w-[160px]">Lojista</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 hidden md:table-cell">Contato</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 hidden xl:table-cell">Local.</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-right hidden lg:table-cell">Vendas</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center hidden lg:table-cell">Ped.</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center hidden xl:table-cell">Aval.</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-right hidden lg:table-cell">Saldo</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center">Status</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center w-[90px]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lojistasFiltrados.map(l=>(
                    <tr key={l.id} className={`hover:bg-orange-50/30 transition ${l.status==='suspenso'?'bg-red-50/30':l.status==='pendente'?'bg-yellow-50/30':''}`}>

                      {/* Lojista — sempre visível */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {l.nome[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-xs leading-tight truncate max-w-[130px]">{l.nome}</p>
                            <ReputBadge rep={l.reputacao}/>
                            {/* Mobile-only: inline info */}
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 md:hidden">
                              <span className="text-[10px] text-gray-400">{l.email}</span>
                              <span className="text-[10px] text-gray-400">{l.cidade}/{l.estado}</span>
                              <span className="text-[10px] font-bold text-gray-700">{fmt(l.totalVendas)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contato — md+ */}
                      <td className="px-3 py-3 hidden md:table-cell">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1 text-gray-500 max-w-[160px] truncate"><Mail size={10} className="flex-shrink-0"/>{l.email}</div>
                          <div className="flex items-center gap-1 text-gray-500"><Phone size={10}/>{l.telefone}</div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400"><Calendar size={10}/>Desde {l.dataCadastro}</div>
                        </div>
                      </td>

                      {/* Localização — xl+ */}
                      <td className="px-3 py-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap"><MapPin size={10}/>{l.cidade}/{l.estado}</div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{l.comissao}% comissão</p>
                      </td>

                      {/* Vendas — lg+ */}
                      <td className="px-3 py-3 text-right hidden lg:table-cell">
                        <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{fmt(l.totalVendas)}</p>
                      </td>

                      {/* Pedidos — lg+ */}
                      <td className="px-3 py-3 text-center hidden lg:table-cell">
                        <span className="font-semibold text-gray-700 text-sm">{fmtNum(l.totalPedidos)}</span>
                      </td>

                      {/* Avaliação — xl+ */}
                      <td className="px-3 py-3 text-center hidden xl:table-cell">
                        {l.avaliacaoMedia > 0
                          ? <div className="flex items-center justify-center gap-0.5"><Star size={11} className="text-yellow-400 fill-yellow-400"/><span className="text-sm font-semibold">{l.avaliacaoMedia}</span></div>
                          : <span className="text-gray-300 text-xs">—</span>}
                      </td>

                      {/* Saldo — lg+ */}
                      <td className="px-3 py-3 text-right hidden lg:table-cell">
                        <span className={`text-sm font-bold whitespace-nowrap ${l.saldoPendente>0?'text-orange-600':'text-gray-400'}`}>{fmt(l.saldoPendente)}</span>
                      </td>

                      {/* Status — sempre visível */}
                      <td className="px-3 py-3 text-center">
                        <Badge status={l.status}/>
                      </td>

                      {/* Ações — sempre visível, ícones compactos */}
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {l.status === 'pendente' && (
                            <button onClick={()=>{setLojistas(p=>p.map(x=>x.id===l.id?{...x,status:'ativo'}:x));toast_(`✅ ${l.nome} aprovado!`)}}
                              title="Aprovar" className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition flex-shrink-0">
                              <CheckCircle size={14}/>
                            </button>
                          )}
                          {l.status === 'ativo' && (
                            <button onClick={()=>{setLojistas(p=>p.map(x=>x.id===l.id?{...x,status:'suspenso'}:x));toast_(`⚠️ ${l.nome} suspenso`)}}
                              title="Suspender" className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition flex-shrink-0">
                              <Ban size={14}/>
                            </button>
                          )}
                          {l.status === 'suspenso' && (
                            <button onClick={()=>{setLojistas(p=>p.map(x=>x.id===l.id?{...x,status:'ativo'}:x));toast_(`✅ ${l.nome} reativado!`)}}
                              title="Reativar" className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition flex-shrink-0">
                              <RefreshCw size={14}/>
                            </button>
                          )}
                          <button onClick={()=>{setEditTarget(l);setShowModal('lojista')}}
                            title="Editar" className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg transition flex-shrink-0">
                            <Edit size={14}/>
                          </button>
                          <button onClick={()=>{setLojistas(p=>p.filter(x=>x.id!==l.id));toast_(`🗑️ ${l.nome} removido`)}}
                            title="Excluir" className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition flex-shrink-0">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Mostrando {lojistasFiltrados.length} de {lojistas.length} lojistas
          </div>
        </div>
      </div>
    )
  }

  // ── PRODUTOS ──
  function renderProdutos() {
    const esgotados = produtos.filter(p=>p.estoque===0).length
    const baixo     = produtos.filter(p=>p.estoque>0&&p.estoque<10).length
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gerenciar Produtos</h2>
            <p className="text-sm text-gray-500">
              {produtos.length} produtos ·
              <span className="text-red-500 font-semibold"> {esgotados} esgotados</span> ·
              <span className="text-orange-500 font-semibold"> {baixo} estoque baixo</span>
            </p>
          </div>
          <button onClick={()=>{setEditTarget(null);setShowModal('produto')}}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition">
            <Plus size={16}/> Novo Produto
          </button>
        </div>

        {esgotados>0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={15}/> <strong>{esgotados} produto(s) esgotado(s)</strong> — atualize o estoque para manter as vendas ativas.
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchProdutos} onChange={e=>setSearchProdutos(e.target.value)}
              placeholder="Buscar produto, lojista..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
          </div>
          <select value={filtroProdutoCateg} onChange={e=>setFiltroProdutoCateg(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white">
            <option value="todos">Todas categorias</option>
            {realCategories.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Produto</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Lojista</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Categoria</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Preço</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Estoque</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center hidden xl:table-cell">Vendidos</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {produtosFiltrados.map(p=>(
                  <tr key={p.id} className={`hover:bg-gray-50 transition ${p.estoque===0?'bg-red-50/20':''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.image && <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0"/>}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 max-w-[160px] truncate">{p.nome}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={9} className="text-yellow-400 fill-yellow-400"/>
                            <span className="text-[10px] text-gray-500">{p.avaliacao}</span>
                            {p.badge && <span className="text-[9px] bg-orange-100 text-orange-600 px-1 rounded-full font-bold">{p.badge}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{p.lojista}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{p.categoria}</td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-bold text-gray-800">{fmt(p.preco)}</p>
                      {p.discount>0 && <p className="text-[10px] text-green-600 font-semibold">-{p.discount}% OFF</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${p.estoque===0?'text-red-500':p.estoque<10?'text-orange-500':'text-green-600'}`}>{p.estoque}</span>
                      {p.estoque===0 && <p className="text-[9px] text-red-400 font-semibold">ESGOTADO</p>}
                    </td>
                    <td className="px-4 py-3 text-center"><Badge status={p.status}/></td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-gray-600 hidden xl:table-cell">{fmtNum(p.vendidos)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={()=>{setEditTarget(p);setShowModal('produto')}}
                          className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition" title="Editar">
                          <Edit size={13}/>
                        </button>
                        <button onClick={()=>{setProdutos(v=>v.filter(x=>x.id!==p.id));toast_(`🗑️ Produto removido`)}}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition" title="Excluir">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Mostrando {produtosFiltrados.length} de {produtos.length} produtos
          </div>
        </div>
      </div>
    )
  }

  // ── PEDIDOS ──
  function renderPedidos() {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gerenciar Pedidos</h2>
            <p className="text-sm text-gray-500">
              {pedidos.length} pedidos ·
              <span className="text-yellow-600 font-semibold"> {pedidos.filter(p=>p.status==='pendente').length} pendentes</span>
            </p>
          </div>
          <button onClick={()=>{exportPedidosCSV(pedidosFiltrados);toast_('📥 CSV de pedidos exportado!')}}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition">
            <Download size={15}/> Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchPedidos} onChange={e=>setSearchPedidos(e.target.value)}
              placeholder="ID do pedido, cliente, produto..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
          </div>
          {['todos','pendente','em_andamento','concluido','cancelado'].map(s=>(
            <button key={s} onClick={()=>setFiltroPedidoStatus(s)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition ${filtroPedidoStatus===s?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {s==='todos'?'Todos':s==='em_andamento'?'Em andamento':s.charAt(0).toUpperCase()+s.slice(1)}
              {' '}({s==='todos'?pedidos.length:pedidos.filter(p=>p.status===s).length})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Pedido</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Cliente</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Lojista</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Produto</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Valor</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Pagamento</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pedidosFiltrados.map(p=>(
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-gray-800 text-xs">{p.id}</p>
                      <p className="text-[10px] text-gray-400">{p.data}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">{p.cliente}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{p.lojista}</td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <p className="text-xs text-gray-700 max-w-[160px] truncate">{p.produto}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-gray-900">{fmt(p.valor)}</p>
                      {p.desconto>0 && <p className="text-[10px] text-green-600">-{fmt(p.desconto)}</p>}
                    </td>
                    <td className="px-4 py-3 text-center"><Badge status={p.status}/></td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{p.pagamento}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={()=>{
                          const next: Record<string,string> = { pendente:'em_andamento', em_andamento:'concluido', concluido:'concluido', cancelado:'cancelado' }
                          setPedidos(v=>v.map(x=>x.id===p.id?{...x,status:next[x.status]??x.status}:x))
                          toast_(`📦 Pedido ${p.id} atualizado`)
                        }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition" title="Avançar status">
                          <ChevronRight size={14}/>
                        </button>
                        {p.rastreio && (
                          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-mono">{p.rastreio}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        </div>
      </div>
    )
  }

  // ── USUÁRIOS ──
  function renderUsuarios() {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gerenciar Usuários</h2>
            <p className="text-sm text-gray-500">
              {usuarios.length} cadastrados ·
              <span className="text-green-600 font-semibold"> {usuarios.filter(u=>u.status==='ativo').length} ativos</span> ·
              <span className="text-red-500 font-semibold"> {usuarios.filter(u=>u.status==='bloqueado').length} bloqueados</span>
            </p>
          </div>
          <button onClick={()=>{exportUsuariosCSV(usuariosFiltrados);toast_('📥 CSV de usuários exportado!')}}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition flex-shrink-0">
            <Download size={15}/> Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchUsuarios} onChange={e=>setSearchUsuarios(e.target.value)}
              placeholder="Buscar por nome, email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
          </div>
          {[
            {v:'todos',label:'Todos'},
            {v:'ativo',label:'Ativos'},
            {v:'bloqueado',label:'Bloqueados'},
            {v:'admin',label:'Admins'},
          ].map(f=>(
            <button key={f.v} onClick={()=>setFiltroUsuarioStatus(f.v)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition ${filtroUsuarioStatus===f.v?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {f.label} ({f.v==='todos'?usuarios.length:usuarios.filter(u=>u.status===f.v||u.role===f.v).length})
            </button>
          ))}
        </div>

        {/* Tabela lista */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {usuariosFiltrados.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Users size={40} className="mx-auto mb-3 opacity-30"/>
              <p className="font-semibold">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[320px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-3 py-3 font-semibold text-gray-600 min-w-[150px]">Usuário</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 hidden md:table-cell">Contato</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 hidden xl:table-cell">Local.</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center hidden lg:table-cell">Compras</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-right hidden lg:table-cell">Total gasto</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 hidden xl:table-cell">Últ. acesso</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center">Status</th>
                    <th className="px-3 py-3 font-semibold text-gray-600 text-center w-[80px]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usuariosFiltrados.map(u=>(
                    <tr key={u.id} className={`hover:bg-orange-50/30 transition ${u.status==='bloqueado'?'bg-red-50/30':''}`}>

                      {/* Usuário — sempre visível */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${u.role==='admin'?'bg-gradient-to-br from-purple-500 to-violet-600':'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
                            {u.nome[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-xs leading-tight truncate max-w-[120px]">{u.nome}</p>
                            <Badge status={u.role}/>
                            {/* Mobile-only: inline info */}
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 md:hidden">
                              <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{u.email}</span>
                              <span className="text-[10px] font-bold text-gray-700">{fmt(u.totalGasto)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contato — md+ */}
                      <td className="px-3 py-3 hidden md:table-cell">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1 text-gray-600 max-w-[160px] truncate"><Mail size={10} className="flex-shrink-0"/>{u.email}</div>
                          <div className="flex items-center gap-1 text-gray-500"><Phone size={10}/>{u.telefone}</div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">CPF: {u.cpf}</div>
                        </div>
                      </td>

                      {/* Localização — xl+ */}
                      <td className="px-3 py-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap"><MapPin size={10}/>{u.cidade}/{u.estado}</div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Desde {u.dataCadastro}</p>
                      </td>

                      {/* Compras — lg+ */}
                      <td className="px-3 py-3 text-center hidden lg:table-cell">
                        <span className="font-semibold text-gray-800 text-sm">{u.totalCompras}</span>
                      </td>

                      {/* Total gasto — lg+ */}
                      <td className="px-3 py-3 text-right hidden lg:table-cell">
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{fmt(u.totalGasto)}</span>
                      </td>

                      {/* Último acesso — xl+ */}
                      <td className="px-3 py-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap"><Activity size={10}/>{u.ultimoAcesso}</div>
                      </td>

                      {/* Status — sempre visível */}
                      <td className="px-3 py-3 text-center">
                        <Badge status={u.status}/>
                      </td>

                      {/* Ações — sempre visível */}
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {u.status === 'ativo' ? (
                            <button
                              onClick={()=>{setUsuarios(p=>p.map(x=>x.id===u.id?{...x,status:'bloqueado'}:x));toast_(`🔒 ${u.nome} bloqueado`)}}
                              disabled={u.role==='admin'}
                              title="Bloquear"
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0">
                              <Ban size={14}/>
                            </button>
                          ) : (
                            <button
                              onClick={()=>{setUsuarios(p=>p.map(x=>x.id===u.id?{...x,status:'ativo'}:x));toast_(`🔓 ${u.nome} desbloqueado`)}}
                              title="Desbloquear"
                              className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition flex-shrink-0">
                              <Unlock size={14}/>
                            </button>
                          )}
                          <button
                            onClick={()=>{setEditTarget(u);setShowModal('usuario')}}
                            title="Editar"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg transition flex-shrink-0">
                            <Edit size={14}/>
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              onClick={()=>{setUsuarios(p=>p.filter(x=>x.id!==u.id));toast_(`🗑️ ${u.nome} removido`)}}
                              title="Excluir"
                              className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition flex-shrink-0">
                              <Trash2 size={14}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuários
          </div>
        </div>
      </div>
    )
  }

  // ── RECLAMAÇÕES ──
  function renderReclamacoes() {
    const recl    = reclamacoes
    const setRecl = setReclamacoes
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Reclamações e Disputas</h2>
          <p className="text-sm text-gray-500">
            {recl.length} reclamações ·
            <span className="text-red-500 font-semibold"> {recl.filter(r=>r.status==='aberta').length} abertas</span> ·
            <span className="text-yellow-600 font-semibold"> {recl.filter(r=>r.status==='em_analise').length} em análise</span>
          </p>
        </div>
        <div className="space-y-3">
          {recl.map(r=>(
            <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${r.status==='aberta'?'border-red-200':r.status==='em_analise'?'border-yellow-200':'border-green-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-gray-500">{r.id}</span>
                    <Badge status={r.status}/>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.prioridade==='alta'?'bg-red-100 text-red-700':r.prioridade==='media'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-600'}`}>
                      {r.prioridade === 'alta' ? '🔴 Alta' : r.prioridade === 'media' ? '🟡 Média' : '🟢 Baixa'}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900">{r.motivo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Cliente: <strong>{r.cliente}</strong> · Pedido: <strong>{r.pedido}</strong> · Lojista: <strong>{r.lojista}</strong></p>
                  <p className="text-xs text-gray-400 mt-0.5">Aberta em {r.data}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {r.status === 'aberta' && (
                  <button onClick={()=>setRecl(p=>p.map(x=>x.id===r.id?{...x,status:'em_analise'}:x))}
                    className="text-xs bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg font-semibold hover:bg-yellow-100 transition">
                    Iniciar análise
                  </button>
                )}
                {r.status === 'em_analise' && (
                  <button onClick={()=>setRecl(p=>p.map(x=>x.id===r.id?{...x,status:'resolvida'}:x))}
                    className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold hover:bg-green-100 transition">
                    Marcar como resolvida
                  </button>
                )}
                <button className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-blue-100 transition">
                  Contatar cliente
                </button>
                <button className="text-xs bg-orange-50 text-orange-700 px-3 py-2 rounded-lg font-semibold hover:bg-orange-100 transition">
                  Contatar lojista
                </button>
                {r.status === 'resolvida' && (
                  <button onClick={()=>setRecl(p=>p.filter(x=>x.id!==r.id))}
                    className="text-xs bg-gray-50 text-gray-500 px-3 py-2 rounded-lg font-semibold hover:bg-red-50 hover:text-red-500 transition">
                    Arquivar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderEntregadores() {

    const disponiveis = entregadores.filter(e => e.status === 'disponivel').length
    const emCorrida   = entregadores.filter(e => e.status === 'em_corrida').length

    const veiculoLabel: Record<string, string> = { moto:'🏍️ Moto', carro:'🚗 Carro', bicicleta:'🚲 Bike', a_pe:'🚶 A pé' }
    const statusColor: Record<string, string> = {
      disponivel: 'bg-green-100 text-green-700',
      em_corrida: 'bg-blue-100 text-blue-700',
      offline:    'bg-gray-100 text-gray-500',
      suspenso:   'bg-red-100 text-red-600',
    }

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gerenciar Entregadores</h2>
            <p className="text-sm text-gray-500">
              {entregadores.length} cadastrados ·{' '}
              <span className="text-green-600 font-semibold">{disponiveis} disponíveis</span> ·{' '}
              <span className="text-blue-600 font-semibold">{emCorrida} em corrida</span> ·{' '}
              <span className="text-red-500 font-semibold">{entregadores.filter(e=>!e.documentosOk).length} sem documentos</span>
            </p>
          </div>
        </div>

        {/* Pendentes de documentos */}
        {entregadores.filter(e=>!e.documentosOk).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={15}/> Documentos pendentes de aprovação
            </p>
            <div className="flex flex-wrap gap-2">
              {entregadores.filter(e=>!e.documentosOk).map(e=>(
                <div key={e.id} className="flex items-center gap-2 bg-white border border-yellow-200 rounded-xl px-3 py-2">
                  <span>{e.foto}</span>
                  <span className="text-sm font-semibold">{e.nome}</span>
                  <button onClick={()=>{setEntregadores(p=>p.map(x=>x.id===e.id?{...x,documentosOk:true}:x));toast_(`✅ Documentos de ${e.nome} aprovados!`)}}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-bold hover:bg-green-600 transition">Aprovar</button>
                  <button onClick={()=>{setEntregadores(p=>p.map(x=>x.id===e.id?{...x,status:'suspenso'}:x));toast_(`⛔ ${e.nome} suspenso`)}}
                    className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg font-bold hover:bg-red-200 transition">Recusar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Corridas em andamento */}
        {corridas.filter(c=>c.status==='aceita'||c.status==='coletada').length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Truck size={15}/> Corridas em andamento agora
            </p>
            <div className="space-y-2">
              {corridas.filter(c=>c.status==='aceita'||c.status==='coletada').map(c=>(
                <div key={c.id} className="bg-white border border-blue-100 rounded-xl px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-500">{c.id}</span>
                    <p className="text-sm font-semibold text-gray-900">{c.produto}</p>
                    <p className="text-xs text-gray-500">{c.lojistaNome} → {c.clienteNome}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.status==='aceita'?'bg-yellow-100 text-yellow-700':'bg-indigo-100 text-indigo-700'}`}>
                      {c.status==='aceita'?'Indo buscar':'Entregando'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{fmtDist(c.distanciaKm)} · {fmtEco(c.ganhoEntregador)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchEntregadores} onChange={e=>setSearchEntregadores(e.target.value)}
              placeholder="Buscar por nome, email, cidade..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 bg-white"/>
          </div>
          {['todos','disponivel','em_corrida','offline','suspenso'].map(s=>(
            <button key={s} onClick={()=>setFiltroEntregadorStatus(s)}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition capitalize ${
                filtroEntregadorStatus===s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
              }`}>
              {s==='todos'?`Todos (${entregadores.length})`:
               s==='disponivel'?`Disponíveis (${disponiveis})`:
               s==='em_corrida'?`Em corrida (${emCorrida})`:
               s==='offline'?`Offline (${entregadores.filter(e=>e.status==='offline').length})`:
               `Suspensos (${entregadores.filter(e=>e.status==='suspenso').length})`}
            </button>
          ))}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600 min-w-[160px]">Entregador</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Veículo</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Cidade</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center hidden md:table-cell">Entregas</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center hidden lg:table-cell">Aval.</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right hidden lg:table-cell">Ganhos</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Docs</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-center w-[80px]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entregFiltrados.map(e=>(
                  <tr key={e.id} className={`hover:bg-orange-50/20 transition ${e.status==='suspenso'?'bg-red-50/20':''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                          {e.nome[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-xs truncate max-w-[130px]">{e.nome}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[130px]">{e.email}</p>
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 md:hidden">
                            <span className="text-[10px] text-gray-500">{veiculoLabel[e.veiculo]}</span>
                            <span className="text-[10px] text-gray-500">{e.cidade}/{e.estado}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm">{veiculoLabel[e.veiculo]}</p>
                      {e.placa && <p className="text-[10px] text-gray-400 font-mono">{e.placa}</p>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-gray-600">{e.cidade}/{e.estado}</p>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <p className="font-semibold text-gray-700">{e.totalEntregas}</p>
                      <p className="text-[10px] text-gray-400">{e.taxaAceitacao}% aceit.</p>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-0.5">
                        <Star size={11} className="text-yellow-400 fill-yellow-400"/>
                        <span className="text-sm font-semibold">{e.avaliacaoMedia}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <p className="font-bold text-emerald-600 text-sm whitespace-nowrap">{fmtEco(e.totalGanhos)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {e.documentosOk
                        ? <CheckCircle size={16} className="text-green-500 mx-auto"/>
                        : <AlertTriangle size={16} className="text-yellow-500 mx-auto"/>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${statusColor[e.status]??'bg-gray-100 text-gray-500'}`}>
                        {labelStatusEntregador(e.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {e.status === 'suspenso' ? (
                          <button onClick={()=>{setEntregadores(p=>p.map(x=>x.id===e.id?{...x,status:'offline'}:x));toast_(`✅ ${e.nome} reativado`)}}
                            title="Reativar" className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition flex-shrink-0">
                            <RefreshCw size={13}/>
                          </button>
                        ) : (
                          <button onClick={()=>{setEntregadores(p=>p.map(x=>x.id===e.id?{...x,status:'suspenso'}:x));toast_(`⛔ ${e.nome} suspenso`)}}
                            title="Suspender" className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition flex-shrink-0">
                            <Ban size={13}/>
                          </button>
                        )}
                        <button onClick={()=>{setEntregadores(p=>p.filter(x=>x.id!==e.id));toast_(`🗑️ ${e.nome} removido`)}}
                          title="Excluir" className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition flex-shrink-0">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Mostrando {entregFiltrados.length} de {entregadores.length} entregadores
          </div>
        </div>

        {/* Config de taxas — acesso rápido */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <DollarSign size={16} className="text-orange-500"/> Configuração de Taxas de Entrega
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Taxa base (R$)</label>
              <input type="number" step="0.50" value={taxaEntregaBase}
                onChange={e=>setTaxaEntregaBase(parseFloat(e.target.value)||0)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500"/>
              <p className="text-[10px] text-gray-400 mt-1">Cobrado em toda entrega</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Taxa por km (R$)</label>
              <input type="number" step="0.10" value={taxaEntregaPorKm}
                onChange={e=>setTaxaEntregaPorKm(parseFloat(e.target.value)||0)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500"/>
              <p className="text-[10px] text-gray-400 mt-1">Por km percorrido</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">% do entregador</label>
              <input type="number" step="1" min="0" max="100" value={percentualEntregador}
                onChange={e=>setPercentualEntregador(parseFloat(e.target.value)||0)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500"/>
              <p className="text-[10px] text-gray-400 mt-1">Plataforma fica com {100-percentualEntregador}%</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl px-4 py-3 text-xs text-orange-800">
            <strong>Exemplo:</strong> Entrega de 5km → Taxa = R$ {(taxaEntregaBase + 5*taxaEntregaPorKm).toFixed(2)} → Entregador recebe R$ {((taxaEntregaBase + 5*taxaEntregaPorKm)*percentualEntregador/100).toFixed(2)} · Plataforma R$ {((taxaEntregaBase + 5*taxaEntregaPorKm)*(100-percentualEntregador)/100).toFixed(2)}
          </div>
          <button onClick={()=>toast_('✅ Taxas de entrega atualizadas!')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition">
            <Save size={14}/> Salvar Configurações de Entrega
          </button>
        </div>
      </div>
    )
  }

  // ── FINANCEIRO ──
  function renderFinanceiro() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Painel Financeiro</h2>

        {/* Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:'Receita Hoje',    value: fmt(mockStats.receitaHoje),   icon:<Zap size={20}/>,        cls:'from-orange-500 to-rose-500' },
            { label:'Receita Semana',  value: fmt(mockStats.receitaSemana),  icon:<TrendingUp size={20}/>, cls:'from-blue-500 to-indigo-600' },
            { label:'Receita Mensal',  value: fmt(mockStats.receitaMes),     icon:<BarChart size={20}/>,   cls:'from-emerald-500 to-teal-600' },
          ].map((c,i)=>(
            <div key={i} className={`bg-gradient-to-br ${c.cls} rounded-2xl p-5 text-white`}>
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">{c.icon}</div>
              <p className="text-2xl font-black">{c.value}</p>
              <p className="text-white/80 text-sm">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Saldos pendentes por lojista */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Saldos a Pagar para Lojistas</h3>
            <span className="text-sm text-orange-600 font-bold">{fmt(lojistas.reduce((s,l)=>s+l.saldoPendente,0))} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {lojistas.filter(l=>l.saldoPendente>0).sort((a,b)=>b.saldoPendente-a.saldoPendente).map(l=>(
              <div key={l.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm">
                    {l.nome[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{l.nome}</p>
                    <p className="text-xs text-gray-500">{l.plano} · {l.comissao}% comissão</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{fmt(l.saldoPendente)}</span>
                  <button onClick={()=>{setLojistas(p=>p.map(x=>x.id===l.id?{...x,saldoPendente:0}:x));toast_(`💸 Pagamento de ${fmt(l.saldoPendente)} realizado para ${l.nome}`)}}
                    className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-green-100 transition">
                    Pagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SVG LineChart — Faturamento 30 dias */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Faturamento Diário — Últimos 30 dias</h3>
            <button onClick={()=>{
              exportCSV(`kainow-faturamento-30d-${new Date().toISOString().slice(0,10)}.csv`,
                ['Data','Receita (R$)','Pedidos'],
                mock30DaysRevenue.map(d=>[d.dia, d.valor, d.pedidos])
              ); toast_('📥 Relatório de faturamento exportado!')
            }} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
              <Download size={14}/> Exportar
            </button>
          </div>
          {(() => {
            const data = mock30DaysRevenue
            const maxV = Math.max(...data.map(d=>d.valor))
            const minV = Math.min(...data.map(d=>d.valor))
            const w = 560, h = 180, pad = { t:8, r:8, b:26, l:42 }
            const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b
            const px = (i:number) => pad.l + (i/(data.length-1))*gw
            const py = (v:number) => pad.t + gh - ((v-minV)/(maxV-minV||1))*gh
            const pts = data.map((d,i)=>`${px(i)},${py(d.valor)}`).join(' ')
            return (
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{height:180}}>
                {[0,0.25,0.5,0.75,1].map((t,i)=>(
                  <g key={i}>
                    <line x1={pad.l} x2={w-pad.r} y1={pad.t+gh*t} y2={pad.t+gh*t} stroke="#f0f0f0" strokeWidth="1"/>
                    <text x={pad.l-4} y={pad.t+gh*t+4} textAnchor="end" fontSize="9" fill="#9ca3af">{((maxV-(maxV-minV)*t)/1000).toFixed(0)}k</text>
                  </g>
                ))}
                {data.filter((_,i)=>i%5===0).map((d)=>(
                  <text key={d.dia} x={px(data.indexOf(d))} y={h-4} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.dia}</text>
                ))}
                <defs>
                  <linearGradient id="lgf1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polygon points={`${pad.l},${pad.t+gh} ${pts} ${w-pad.r},${pad.t+gh}`} fill="url(#lgf1)"/>
                <polyline points={pts} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                <rect x={w-80} y={pad.t} width={12} height={3} rx="1.5" fill="#f97316"/>
                <text x={w-64} y={pad.t+4} fontSize="9" fill="#6b7280">Receita (R$)</text>
              </svg>
            )
          })()}
        </div>

        {/* CSS BarChart — Top Lojistas por Faturamento */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Top Lojistas — Faturamento Acumulado</h3>
            <button onClick={()=>{exportLojistasCSV(lojistas);toast_('📥 CSV de lojistas exportado!')}}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
              <Download size={14}/> Exportar Lojistas
            </button>
          </div>
          <div className="flex items-end gap-2 h-40 mt-2">
            {mockTopLojistasBar.map((d,i)=>{
              const maxV = Math.max(...mockTopLojistasBar.map(x=>x.vendas))
              const pct = d.vendas/maxV*100
              const colors = ['#f97316','#3b82f6','#a855f7','#10b981','#f59e0b']
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold" style={{color:colors[i]}}>{(d.vendas/1000).toFixed(0)}k</span>
                  <div className="w-full rounded-t-xl transition-all" style={{height:`${pct}%`,background:colors[i],minHeight:6}}/>
                  <span className="text-[9px] text-gray-500 text-center leading-tight truncate w-full text-center">{d.nome.split(' ')[0]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Receita por categoria */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">Receita por Categoria</h3>
          <div className="space-y-3">
            {mockStats.vendasPorCategoria.map((c,i)=>(
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-32 font-medium">{c.nome}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all" style={{width:`${c.pct}%`}}/>
                </div>
                <span className="text-sm font-bold text-gray-800 w-24 text-right">{fmt(c.valor)}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── CATEGORIAS ──
  function renderCategorias() {
    const totalProducts = (catId: string) =>
      realProducts.filter(p => p.category === catId).length

    function addSubcategory(catId: string) {
      if (!newSubName.trim()) return
      setCats(p => p.map(c => c.id === catId ? { ...c, subcategories: [...c.subcategories, newSubName.trim()] } : c))
      setNewSubName('')
      toast_('✅ Subcategoria adicionada!')
    }
    function removeSubcategory(catId: string, idx: number) {
      setCats(p => p.map(c => c.id === catId ? { ...c, subcategories: c.subcategories.filter((_,i) => i !== idx) } : c))
      toast_('🗑️ Subcategoria removida!')
    }
    function saveSubEdit(catId: string, idx: number) {
      if (!editVal.trim()) return
      setCats(p => p.map(c => c.id === catId ? { ...c, subcategories: c.subcategories.map((s,i) => i === idx ? editVal.trim() : s) } : c))
      setEditingCat(null); setEditingSubIdx(null); setEditVal('')
      toast_('✅ Subcategoria editada!')
    }
    function addCategory() {
      if (!newCatName.trim()) return
      const id = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      if (cats.find(c => c.id === id)) { toast_('⚠️ Categoria já existe!'); return }
      setCats(p => [...p, { id, name: newCatName.trim(), icon: newCatIcon, color: 'bg-gray-100 text-gray-700', subcategories: [] }])
      setNewCatName(''); setNewCatIcon('🛍️')
      toast_('✅ Categoria criada!')
    }

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-800">Gerenciar Categorias</h2>
            <p className="text-sm text-gray-500 mt-0.5">{cats.length} categorias · {cats.reduce((a,c) => a + c.subcategories.length, 0)} subcategorias</p>
          </div>
        </div>

        {/* Stats mini */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cats.slice(0,4).map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">{cat.name}</p>
                <p className="text-xs text-gray-400">{totalProducts(cat.id)} produtos · {cat.subcategories.length} subs</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nova categoria */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FolderPlus size={17} className="text-orange-500"/> Nova Categoria</h3>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ícone (emoji)</label>
              <input value={newCatIcon} onChange={e=>setNewCatIcon(e.target.value)} maxLength={4}
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-lg text-center outline-none focus:border-orange-500"/>
            </div>
            <div className="flex-[3] min-w-[200px]">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Nome da categoria</label>
              <input value={newCatName} onChange={e=>setNewCatName(e.target.value)}
                placeholder="Ex: Automóveis"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
            </div>
            <button onClick={addCategory}
              className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 flex items-center gap-2 whitespace-nowrap">
              <FolderPlus size={15}/> Criar Categoria
            </button>
          </div>
        </div>

        {/* Lista de categorias com subcategorias */}
        <div className="space-y-3">
          {cats.map(cat => {
            const isExpanded = expandedCat === cat.id
            const prodCount  = totalProducts(cat.id)
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Category header row */}
                <button
                  onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition text-left"
                >
                  <span className="text-2xl w-8 text-center">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.subcategories.length} subcategorias · {prodCount} produtos</p>
                  </div>
                  {/* Products bar */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
                        style={{ width: `${Math.min(100, (prodCount / realProducts.length) * 100 * 3)}%` }}/>
                    </div>
                    <span className="text-xs text-gray-400 w-12 text-right">{prodCount} prod.</span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}/>
                </button>

                {/* Expanded subcategories */}
                {isExpanded && (
                  <div className="border-t border-gray-50 px-5 py-4 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <ListTree size={15} className="text-orange-500"/>
                      <span className="text-sm font-bold text-gray-700">Subcategorias</span>
                    </div>

                    {/* Subcategory list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.subcategories.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                          {editingCat === cat.id && editingSubIdx === idx ? (
                            <>
                              <input
                                autoFocus
                                value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                onKeyDown={e => { if (e.key==='Enter') saveSubEdit(cat.id, idx); if (e.key==='Escape') { setEditingCat(null); setEditingSubIdx(null) } }}
                                className="flex-1 bg-white border border-orange-300 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                              />
                              <button onClick={() => saveSubEdit(cat.id, idx)}
                                className="text-green-600 hover:text-green-700 p-1"><CheckCircle2 size={15}/></button>
                              <button onClick={() => { setEditingCat(null); setEditingSubIdx(null) }}
                                className="text-gray-400 hover:text-gray-600 p-1"><X size={15}/></button>
                            </>
                          ) : (
                            <>
                              <ChevronRight size={13} className="text-orange-400 flex-shrink-0"/>
                              <span className="flex-1 text-sm text-gray-700">{sub}</span>
                              <button onClick={() => { setEditingCat(cat.id); setEditingSubIdx(idx); setEditVal(sub) }}
                                className="text-gray-300 hover:text-orange-500 p-1 transition"><Pencil size={13}/></button>
                              <button onClick={() => removeSubcategory(cat.id, idx)}
                                className="text-gray-300 hover:text-red-500 p-1 transition"><Trash2 size={13}/></button>
                            </>
                          )}
                        </div>
                      ))}
                      {cat.subcategories.length === 0 && (
                        <p className="col-span-2 text-xs text-gray-400 italic py-1">Nenhuma subcategoria ainda</p>
                      )}
                    </div>

                    {/* Add subcategory */}
                    <div className="flex gap-2 mt-3">
                      <input
                        value={newSubName}
                        onChange={e => setNewSubName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSubcategory(cat.id)}
                        placeholder={`Nova subcategoria em ${cat.name}...`}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => addSubcategory(cat.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition"
                      >
                        <Plus size={14}/> Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── GIFT CARDS ──
  function renderGiftCards() {
    const cards    = giftCards
    const setCards = setGiftCards

    const totalSaldo    = cards.reduce((s,c)=>s+c.saldo, 0)
    const totalEmitido  = cards.reduce((s,c)=>s+c.valor, 0)
    const disponiveis   = cards.filter(c=>c.status==='disponivel').length
    const usados        = cards.filter(c=>c.status==='usado').length
    const expirados     = cards.filter(c=>c.status==='expirado').length

    function gerarCodigo() {
      const seg = () => Math.random().toString(36).slice(2,6).toUpperCase()
      return `KNWG-${seg()}-${seg()}-${seg()}`
    }

    function criarCard(valor: number, mesesValidade: number) {
      const hoje  = new Date()
      const expira = new Date(hoje); expira.setMonth(expira.getMonth() + mesesValidade)
      const fmt2  = (d: Date) => d.toISOString().split('T')[0]
      setCards(p=>[...p, {
        codigo: gerarCodigo(), valor, saldo: valor,
        status: 'disponivel',
        criado: fmt2(hoje), expira: fmt2(expira),
        usadoPor: null,
      }])
      toast_(`🎁 Gift Card de ${fmt(valor)} gerado!`)
    }

    function excluirCard(codigo: string) {
      setCards(p=>p.filter(c=>c.codigo!==codigo))
      toast_('🗑️ Gift Card excluído!')
    }

    function cancelarCard(codigo: string) {
      setCards(p=>p.map(c=>c.codigo===codigo ? {...c, status:'expirado'} : c))
      toast_('⛔ Gift Card cancelado!')
    }

    function copiarCodigo(codigo: string) {
      navigator.clipboard?.writeText(codigo)
      toast_('📋 Código copiado!')
    }

    const statusColor: Record<string,string> = {
      disponivel: 'bg-green-500/20 text-green-300 border border-green-500/30',
      usado:      'bg-gray-500/20 text-gray-400 border border-gray-500/30',
      expirado:   'bg-red-500/20 text-red-400 border border-red-500/30',
    }
    const statusLabel: Record<string,string> = {
      disponivel: '✅ Disponível',
      usado:      '☑️ Usado',
      expirado:   '⛔ Expirado/Cancelado',
    }

    // mini-modal inline de criação
    const showCreate   = gcShowCreate
    const setShowCreate = setGcShowCreate
    const novoValor    = gcNovoValor
    const setNovoValor = setGcNovoValor
    const novoMeses    = gcNovoMeses
    const setNovoMeses = setGcNovoMeses
    const filtroGC     = gcFiltro
    const setFiltroGC  = setGcFiltro

    const cardsFiltrados = filtroGC==='todos' ? cards : cards.filter(c=>c.status===filtroGC)

    return (
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gift Cards</h2>
            <p className="text-sm text-gray-500">
              {cards.length} emitidos · {fmt(totalSaldo)} em saldo ativo · {fmt(totalEmitido)} total emitido
            </p>
          </div>
          <button onClick={()=>setShowCreate(v=>!v)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition">
            <Plus size={16}/> {showCreate ? 'Fechar' : 'Criar Gift Card'}
          </button>
        </div>

        {/* ── Painel de criação ── */}
        {showCreate && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Gift size={18} className="text-orange-400"/> Novo Gift Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Valor (R$)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[25,50,100,200,500].map(v=>(
                    <button key={v} onClick={()=>setNovoValor(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${novoValor===v?'bg-orange-500 text-white':'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                      {fmt(v)}
                    </button>
                  ))}
                </div>
                <input type="number" min="1" max="5000" value={novoValor}
                  onChange={e=>setNovoValor(parseInt(e.target.value)||1)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Validade</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[3,6,12,24].map(m=>(
                    <button key={m} onClick={()=>setNovoMeses(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${novoMeses===m?'bg-orange-500 text-white':'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                      {m}m
                    </button>
                  ))}
                </div>
                <input type="number" min="1" max="60" value={novoMeses}
                  onChange={e=>setNovoMeses(parseInt(e.target.value)||1)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-orange-500"/>
              </div>
              <div className="flex flex-col justify-end">
                <div className="bg-gray-700/50 rounded-xl p-3 mb-3 text-center">
                  <p className="text-orange-300 text-2xl font-black">{fmt(novoValor)}</p>
                  <p className="text-gray-400 text-xs">válido por {novoMeses} {novoMeses===1?'mês':'meses'}</p>
                </div>
                <button onClick={()=>{ criarCard(novoValor, novoMeses); setShowCreate(false) }}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
                  <Gift size={15}/> Gerar Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {label:'Disponíveis',  value:disponiveis,    color:'text-green-600',  bg:'bg-green-50',  border:'border-green-200'},
            {label:'Usados',       value:usados,         color:'text-gray-600',   bg:'bg-gray-50',   border:'border-gray-200'},
            {label:'Expirados',    value:expirados,      color:'text-red-600',    bg:'bg-red-50',    border:'border-red-200'},
            {label:'Saldo Ativo',  value:fmt(totalSaldo),color:'text-orange-600', bg:'bg-orange-50', border:'border-orange-200'},
          ].map((k,i)=>(
            <div key={i} className={`${k.bg} border ${k.border} rounded-2xl px-4 py-3`}>
              <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-500 font-medium">{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-semibold text-gray-400">Filtrar:</span>
          {(['todos','disponivel','usado','expirado'] as const).map(f=>(
            <button key={f} onClick={()=>setFiltroGC(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition capitalize ${
                filtroGC===f
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
              }`}>
              {f === 'todos' ? `Todos (${cards.length})` : `${statusLabel[f]} (${cards.filter(c=>c.status===f).length})`}
            </button>
          ))}
        </div>

        {/* ── Grid de cards ── */}
        {cardsFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
            <Gift size={32} className="text-gray-300 mx-auto mb-2"/>
            <p className="text-gray-400 text-sm">Nenhum Gift Card neste filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardsFiltrados.map((c,i)=>(
              <div key={c.codigo}
                className={`relative rounded-2xl p-5 shadow-lg transition ${
                  c.status==='disponivel'
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-75'
                }`}>

                {/* Ações no canto superior direito */}
                <div className="absolute top-3 right-3 flex gap-1">
                  {/* Copiar código */}
                  <button onClick={()=>copiarCodigo(c.codigo)}
                    title="Copiar código"
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition">
                    <Copy size={13}/>
                  </button>
                  {/* Cancelar (só disponível) */}
                  {c.status==='disponivel' && (
                    <button onClick={()=>cancelarCard(c.codigo)}
                      title="Cancelar Gift Card"
                      className="p-1.5 bg-white/10 hover:bg-yellow-500/40 rounded-lg text-white/70 hover:text-yellow-300 transition">
                      <Ban size={13}/>
                    </button>
                  )}
                  {/* Excluir */}
                  <button onClick={()=>excluirCard(c.codigo)}
                    title="Excluir Gift Card"
                    className="p-1.5 bg-white/10 hover:bg-red-500/40 rounded-lg text-white/70 hover:text-red-300 transition">
                    <Trash2 size={13}/>
                  </button>
                </div>

                {/* Header do card */}
                <div className="flex items-center justify-between mb-3 pr-20">
                  <Gift size={22} className="text-orange-400 flex-shrink-0"/>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>
                </div>

                {/* Valor */}
                <p className="text-3xl font-black text-white mb-0.5">{fmt(c.valor)}</p>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-gray-400 text-xs">Saldo:</p>
                  <p className="text-white font-bold text-sm">{fmt(c.saldo)}</p>
                  {c.valor !== c.saldo && (
                    <div className="flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden ml-1">
                      <div className="h-full bg-orange-400 rounded-full" style={{width:`${(c.saldo/c.valor)*100}%`}}/>
                    </div>
                  )}
                </div>

                {/* Código */}
                <p className="font-mono text-orange-300 text-xs tracking-wider break-all bg-black/20 rounded-lg px-3 py-2">
                  {c.codigo}
                </p>

                {c.usadoPor && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Users size={10}/> Usado por: <span className="text-gray-400">{c.usadoPor}</span>
                  </p>
                )}

                {/* Datas */}
                <div className="mt-3 text-xs text-gray-500 flex justify-between border-t border-gray-700 pt-3">
                  <span>Criado: <span className="text-gray-400">{c.criado}</span></span>
                  <span>Expira: <span className={c.status==='expirado'?'text-red-400':'text-gray-400'}>{c.expira}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // EDITOR DO SITE — CMS GLOBAL
  // ══════════════════════════════════════════════════════════
  function renderEditorSite() {
    const ambienteConfig = {
      home:       { label:'Home (Institucional)',   color:'from-orange-500 to-rose-500',   icon:<Home size={14}/>,    desc:'Página inicial, sobre nós, termos' },
      lojista:    { label:'Área do Lojista',        color:'from-blue-500 to-indigo-600',   icon:<Store size={14}/>,   desc:'Dashboard, cadastro, benefícios' },
      entregador: { label:'Área do Entregador',     color:'from-emerald-500 to-teal-600',  icon:<Truck size={14}/>,   desc:'App entregador, corridas, ganhos' },
    } as const
    const blocoIcons: Record<string,string> = { banner:'🖼️', cards:'🃏', texto:'📝', faq:'❓', cta:'🎯', depoimentos:'💬', galeria:'🖼️', stats:'📊' }

    // ── aba Identidade Visual ──
    function renderIdentidade() {
      const saved = () => { toast_('✅ Tema salvo! Aplicando em toda a plataforma...'); setThemePreview(false) }
      const resetTheme = () => { setSiteTheme(defaultTheme); toast_('🔄 Tema restaurado ao padrão!') }
      return (
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">🎨 Identidade Visual</h3>
              <p className="text-sm text-gray-500">Altere cores, fontes e logo. As mudanças refletem em toda a plataforma via CSS Variables.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setThemePreview(v=>!v)}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                <Eye size={14}/> {themePreview?'Fechar':'Preview'}
              </button>
              <button onClick={resetTheme} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50">
                <RefreshCw size={14}/> Resetar
              </button>
              <button onClick={saved} className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90">
                <Save size={14}/> Salvar Tema
              </button>
            </div>
          </div>

          {/* Preview banner */}
          {themePreview && (
            <div className="rounded-2xl overflow-hidden border-2 border-dashed border-orange-300 shadow-lg">
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-yellow-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
                <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 text-center">kainowone.com.br — Preview ao vivo</div>
                <div className="flex gap-1">
                  {(['desktop','tablet','mobile'] as const).map(d=>(
                    <button key={d} onClick={()=>setPreviewMode(d)} className={`p-1.5 rounded-lg transition ${previewMode===d?'bg-orange-100 text-orange-600':'text-gray-400 hover:bg-gray-200'}`}>
                      {d==='desktop'?<Monitor size={14}/>:d==='tablet'?<Tablet size={14}/>:<Smartphone size={14}/>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white flex justify-center">
                <div className={`transition-all ${previewMode==='desktop'?'w-full':previewMode==='tablet'?'w-[640px]':'w-[375px]'} rounded-xl overflow-hidden shadow border`}
                  style={{background:siteTheme.corFundo}}>
                  {/* Navbar preview */}
                  <div className="flex items-center justify-between px-5 py-3 shadow-sm" style={{background:'white'}}>
                    <div className="flex items-center gap-2">
                      {siteTheme.logoUrl ? <img src={siteTheme.logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-cover"/> :
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
                          style={{background:`linear-gradient(135deg,${siteTheme.corPrimaria},${siteTheme.corSecundaria})`}}>K</div>}
                      <div>
                        <p className="font-black text-sm leading-none" style={{color:siteTheme.corTexto,fontFamily:siteTheme.fonteTitulo}}>{siteTheme.nomeSite}</p>
                        <p className="text-[10px]" style={{color:siteTheme.corPrimaria,fontFamily:siteTheme.fonteTexto}}>{siteTheme.tagline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold text-white rounded-lg"
                        style={{background:`linear-gradient(135deg,${siteTheme.corPrimaria},${siteTheme.corSecundaria})`,borderRadius: siteTheme.borderRadius==='none'?'0':siteTheme.borderRadius==='sm'?'4px':siteTheme.borderRadius==='md'?'6px':siteTheme.borderRadius==='lg'?'8px':siteTheme.borderRadius==='xl'?'12px':'16px'}}>Comprar</button>
                    </div>
                  </div>
                  {/* Hero preview */}
                  <div className="px-5 py-8 text-center" style={{background:`linear-gradient(135deg,${siteTheme.corPrimaria}22,${siteTheme.corSecundaria}11)`}}>
                    <h1 className="text-xl font-black mb-1" style={{color:siteTheme.corTexto,fontFamily:siteTheme.fonteTitulo}}>O marketplace de todos</h1>
                    <p className="text-xs text-gray-500 mb-4" style={{fontFamily:siteTheme.fonteTexto}}>Compre e venda em todo o Brasil</p>
                    <button className="px-5 py-2 text-sm font-bold text-white shadow-lg"
                      style={{background:`linear-gradient(135deg,${siteTheme.corPrimaria},${siteTheme.corSecundaria})`,borderRadius:'12px'}}>Ver Ofertas</button>
                  </div>
                  {/* Cards preview */}
                  <div className="px-5 pb-5 grid grid-cols-3 gap-2 mt-3">
                    {['📱','👗','🏠'].map((e,i)=>(
                      <div key={i} className="rounded-xl p-3 text-center text-xs font-bold shadow-sm bg-white border" style={{borderRadius: siteTheme.borderRadius==='none'?'0':siteTheme.borderRadius==='sm'?'4px':siteTheme.borderRadius==='md'?'6px':siteTheme.borderRadius==='lg'?'8px':siteTheme.borderRadius==='xl'?'12px':'16px'}}>
                        <div className="text-2xl mb-1">{e}</div>
                        <div style={{color:siteTheme.corTexto,fontFamily:siteTheme.fonteTexto}}>{['Eletrônicos','Moda','Casa'][i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cores */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h4 className="font-bold text-gray-800 flex items-center gap-2"><Palette size={16} className="text-orange-500"/> Paleta de Cores</h4>
              {([
                {key:'corPrimaria',   label:'Cor Primária',   desc:'Botões principais, links, destaques'},
                {key:'corSecundaria', label:'Cor Secundária',  desc:'Gradientes, badges, hover states'},
                {key:'corFundo',      label:'Cor de Fundo',    desc:'Background das páginas'},
                {key:'corTexto',      label:'Cor do Texto',    desc:'Corpo do texto principal'},
                {key:'corDestaque',   label:'Cor de Destaque', desc:'Info, links secundários'},
                {key:'corSucesso',    label:'Cor de Sucesso',  desc:'Confirmações, badges ativos'},
                {key:'corAviso',      label:'Cor de Aviso',    desc:'Alertas, pendências'},
              ] as {key:keyof SiteTheme, label:string, desc:string}[]).map(c=>(
                <div key={c.key} className="flex items-center gap-3">
                  <div className="relative">
                    <input type="color" value={siteTheme[c.key] as string}
                      onChange={e=>setSiteTheme(p=>({...p,[c.key]:e.target.value}))}
                      className="w-10 h-10 rounded-xl cursor-pointer border-2 border-gray-200 p-0.5"/>
                    <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-black/10"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">{c.label}</span>
                      <code className="text-xs text-gray-400 font-mono">{siteTheme[c.key] as string}</code>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{c.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-gray-100"
                    style={{background: siteTheme[c.key] as string}}/>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {/* Fontes */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2"><Type size={16} className="text-blue-500"/> Tipografia</h4>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Fonte dos Títulos</label>
                  <select value={siteTheme.fonteTitulo} onChange={e=>setSiteTheme(p=>({...p,fonteTitulo:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                    {GOOGLE_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
                  </select>
                  <p className="mt-1.5 text-sm font-bold" style={{fontFamily:siteTheme.fonteTitulo}}>Preview: Kainow One Marketplace</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Fonte do Texto</label>
                  <select value={siteTheme.fonteTexto} onChange={e=>setSiteTheme(p=>({...p,fonteTexto:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                    {GOOGLE_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
                  </select>
                  <p className="mt-1.5 text-sm text-gray-600" style={{fontFamily:siteTheme.fonteTexto}}>Preview: O melhor marketplace do Brasil.</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Border Radius Global</label>
                  <div className="flex gap-2 flex-wrap">
                    {(['none','sm','md','lg','xl','2xl'] as SiteTheme['borderRadius'][]).map(r=>(
                      <button key={r} onClick={()=>setSiteTheme(p=>({...p,borderRadius:r}))}
                        className={`px-3 py-1.5 text-xs font-bold border transition rounded-xl ${
                          siteTheme.borderRadius===r?'bg-orange-500 text-white border-orange-500':'border-gray-200 text-gray-600 hover:border-orange-300'}`}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo e identidade */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2"><Image size={16} className="text-purple-500"/> Logo & Identidade</h4>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Nome do Site</label>
                  <input type="text" value={siteTheme.nomeSite} onChange={e=>setSiteTheme(p=>({...p,nomeSite:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Tagline / Slogan</label>
                  <input type="text" value={siteTheme.tagline} onChange={e=>setSiteTheme(p=>({...p,tagline:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">URL do Logo</label>
                  <div className="flex gap-2">
                    <input type="url" value={siteTheme.logoUrl} onChange={e=>setSiteTheme(p=>({...p,logoUrl:e.target.value}))}
                      placeholder="https://..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
                    {siteTheme.logoUrl && <img src={siteTheme.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-200"/>}
                  </div>
                </div>

                {/* CSS Variables export */}
                <div className="bg-gray-900 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400">CSS Variables geradas</span>
                    <button onClick={()=>{ navigator.clipboard?.writeText(`:root {\n  --color-primary: ${siteTheme.corPrimaria};\n  --color-secondary: ${siteTheme.corSecundaria};\n  --color-bg: ${siteTheme.corFundo};\n  --color-text: ${siteTheme.corTexto};\n  --color-accent: ${siteTheme.corDestaque};\n  --font-title: '${siteTheme.fonteTitulo}', sans-serif;\n  --font-body: '${siteTheme.fonteTexto}', sans-serif;\n}`); toast_('📋 CSS copiado!')}}
                      className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300">
                      <Copy size={12}/> Copiar
                    </button>
                  </div>
                  <pre className="text-[10px] text-green-400 font-mono leading-relaxed overflow-x-auto">{`:root {
  --color-primary: ${siteTheme.corPrimaria};
  --color-secondary: ${siteTheme.corSecundaria};
  --color-bg: ${siteTheme.corFundo};
  --color-text: ${siteTheme.corTexto};
  --color-accent: ${siteTheme.corDestaque};
  --font-title: '${siteTheme.fonteTitulo}', sans-serif;
  --font-body: '${siteTheme.fonteTexto}', sans-serif;
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // ── aba CMS de Páginas ──
    function renderPaginas() {
      const ambientes = ['home','lojista','entregador'] as const
      const filtradas = cmsPages.filter(p => p.ambiente === editorAmbiente)
      const totalPublicadas = cmsPages.filter(p=>p.status==='publicado').length

      const deletePage = (id: string) => {
        setCmsPages(p=>p.filter(x=>x.id!==id))
        toast_('🗑️ Página excluída!')
        if (editingPage?.id===id) setEditingPage(null)
      }
      const toggleStatus = (id: string) => {
        setCmsPages(p=>p.map(x=>x.id===id?{...x,status:x.status==='publicado'?'rascunho':'publicado',updatedAt:new Date().toISOString().slice(0,10)}:x))
        toast_('✅ Status atualizado!')
      }
      const duplicatePage = (page: CmsPage) => {
        const copy: CmsPage = {...page, id:`p${Date.now()}`, slug:`${page.slug}-copia`, title:`${page.title} (cópia)`, status:'rascunho', views:0, updatedAt:new Date().toISOString().slice(0,10)}
        setCmsPages(p=>[...p, copy])
        toast_('📋 Página duplicada!')
      }

      if (editingPage) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={()=>setEditingPage(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                <ChevronDown size={16} className="rotate-90"/> Voltar
              </button>
              <div className="h-4 w-px bg-gray-300"/>
              <span className="text-sm text-gray-400">Editando:</span>
              <span className="text-sm font-bold text-gray-800">{editingPage.title}</span>
              <span className={`ml-auto text-xs px-2 py-1 rounded-full font-bold ${editingPage.status==='publicado'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                {editingPage.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Título da Página *</label>
                    <input type="text" value={editingPage.title}
                      onChange={e=>setEditingPage(p=>p?{...p,title:e.target.value}:null)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-orange-500"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Slug (URL) *</label>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-500">
                      <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r border-gray-200">/</span>
                      <input type="text" value={editingPage.slug}
                        onChange={e=>setEditingPage(p=>p?{...p,slug:e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}:null)}
                        className="flex-1 px-3 py-2.5 text-sm outline-none"/>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-600">Conteúdo HTML</label>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Code2 size={12}/> Editor HTML
                      </div>
                    </div>
                    <textarea
                      value={editingPage.content}
                      onChange={e=>setEditingPage(p=>p?{...p,content:e.target.value}:null)}
                      rows={14}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-orange-500 resize-none"
                      placeholder="<h1>Título</h1>\n<p>Conteúdo da página...</p>"
                    />
                  </div>
                </div>
                {/* Preview HTML */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Eye size={14}/> Preview</h4>
                  <div className="border border-gray-100 rounded-xl p-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{__html: editingPage.content}}/>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <h4 className="font-bold text-gray-800">Publicação</h4>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Ambiente</label>
                    <select value={editingPage.ambiente} onChange={e=>setEditingPage(p=>p?{...p,ambiente:e.target.value as any}:null)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                      <option value="home">🏠 Home (Institucional)</option>
                      <option value="lojista">🏪 Área do Lojista</option>
                      <option value="entregador">🚴 Área do Entregador</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-2">Status</label>
                    <div className="flex gap-2">
                      {(['rascunho','publicado'] as const).map(s=>(
                        <button key={s} onClick={()=>setEditingPage(p=>p?{...p,status:s}:null)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                            editingPage.status===s?s==='publicado'?'bg-green-500 text-white border-green-500':'bg-yellow-500 text-white border-yellow-500'
                            :'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                          {s==='publicado'?'✅ Publicado':'📝 Rascunho'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Última edição</span><span className="font-medium text-gray-700">{editingPage.updatedAt}</span></div>
                    <div className="flex justify-between"><span>Visualizações</span><span className="font-medium text-gray-700">{editingPage.views.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Autor</span><span className="font-medium text-gray-700">{editingPage.author}</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button onClick={()=>{
                    setCmsPages(p=>p.map(x=>x.id===editingPage.id?{...editingPage,updatedAt:new Date().toISOString().slice(0,10)}:x))
                    toast_(`✅ "${editingPage.title}" salva!`); setEditingPage(null)
                  }} className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90">
                    <Save size={15}/> Salvar Página
                  </button>
                  <button onClick={()=>setEditingPage(null)}
                    className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      return (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">📄 CMS de Páginas</h3>
              <p className="text-sm text-gray-500">{cmsPages.length} páginas · {totalPublicadas} publicadas · {cmsPages.length-totalPublicadas} rascunhos</p>
            </div>
            <button onClick={()=>{
              const nova: CmsPage = {id:`p${Date.now()}`,slug:'nova-pagina',title:'Nova Página',content:'<h1>Nova Página</h1>\n<p>Conteúdo aqui...</p>',ambiente:editorAmbiente,status:'rascunho',updatedAt:new Date().toISOString().slice(0,10),author:'Admin',views:0}
              setEditingPage(nova)
            }} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90">
              <Plus size={16}/> Nova Página
            </button>
          </div>

          {/* Filtro por ambiente */}
          <div className="flex gap-2 flex-wrap">
            {ambientes.map(a=>(
              <button key={a} onClick={()=>setEditorAmbiente(a)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition ${
                  editorAmbiente===a ? `bg-gradient-to-r ${ambienteConfig[a].color} text-white border-transparent` : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}>
                {ambienteConfig[a].icon} {ambienteConfig[a].label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${editorAmbiente===a?'bg-white/20 text-white':'bg-gray-100 text-gray-500'}`}>
                  {cmsPages.filter(p=>p.ambiente===a).length}
                </span>
              </button>
            ))}
          </div>

          {/* Tabela de páginas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-bold text-gray-500 px-5 py-3">TÍTULO / SLUG</th>
                  <th className="text-left text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">AMBIENTE</th>
                  <th className="text-left text-xs font-bold text-gray-500 px-4 py-3 hidden lg:table-cell">ATUALIZADO</th>
                  <th className="text-left text-xs font-bold text-gray-500 px-4 py-3 hidden lg:table-cell">VIEWS</th>
                  <th className="text-left text-xs font-bold text-gray-500 px-4 py-3">STATUS</th>
                  <th className="text-xs font-bold text-gray-500 px-4 py-3">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtradas.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">Nenhuma página neste ambiente. Crie a primeira! ✨</td></tr>
                ) : filtradas.map(page=>(
                  <tr key={page.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-gray-800 leading-tight">{page.title}</p>
                      <p className="text-xs text-gray-400 font-mono">/{page.slug}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold bg-gradient-to-r ${ambienteConfig[page.ambiente].color} text-white`}>
                        {page.ambiente}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 hidden lg:table-cell">{page.updatedAt}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 hidden lg:table-cell">{page.views.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={()=>toggleStatus(page.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold cursor-pointer transition ${
                          page.status==='publicado'?'bg-green-100 text-green-700 hover:bg-green-200':'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                        {page.status==='publicado'?'✅ Publicado':'📝 Rascunho'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-center">
                        <button onClick={()=>setEditingPage({...page})} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Editar">
                          <Edit size={14}/>
                        </button>
                        <button onClick={()=>duplicatePage(page)} className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition" title="Duplicar">
                          <Copy size={14}/>
                        </button>
                        <button onClick={()=>deletePage(page.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Excluir">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // ── aba Módulos por Ambiente ──
    function renderModulos() {
      const ambBlocos = blocos.filter(b=>b.ambiente===editorAmbiente).sort((a,b)=>a.ordem-b.ordem)
      const moveBloco = (id: string, dir: 'up'|'down') => {
        setBlocos(prev => {
          const list = [...prev.filter(b=>b.ambiente===editorAmbiente).sort((a,b)=>a.ordem-b.ordem)]
          const idx = list.findIndex(b=>b.id===id)
          if (dir==='up'&&idx===0) return prev
          if (dir==='down'&&idx===list.length-1) return prev
          const other = dir==='up'?idx-1:idx+1
          const oOrd = list[other].ordem, cOrd = list[idx].ordem
          return prev.map(b=>b.id===list[idx].id?{...b,ordem:oOrd}:b.id===list[other].id?{...b,ordem:cOrd}:b)
        })
      }
      const toggleBloco = (id: string) => {
        setBlocos(p=>p.map(b=>b.id===id?{...b,ativo:!b.ativo}:b))
        const bloco = blocos.find(b=>b.id===id)
        toast_(`${bloco?.ativo?'⏸️ Bloco ocultado':'▶️ Bloco ativado'}: ${bloco?.titulo}`)
      }
      const deleteBloco = (id: string) => { setBlocos(p=>p.filter(b=>b.id!==id)); toast_('🗑️ Bloco removido!') }
      const addBloco = (tipo: ModuloBloco['tipo']) => {
        const newB: ModuloBloco = {
          id:`b${Date.now()}`, tipo, titulo:`Novo ${tipo}`, subtitulo:'Subtítulo aqui',
          conteudo:'Conteúdo do bloco...', imagem:'', ativo:true, ambiente:editorAmbiente,
          ordem: Math.max(0,...blocos.filter(b=>b.ambiente===editorAmbiente).map(b=>b.ordem))+1
        }
        setBlocos(p=>[...p,newB]); toast_(`✅ Bloco "${tipo}" adicionado!`)
      }

      return (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">🧩 Módulos por Ambiente</h3>
              <p className="text-sm text-gray-500">{ambBlocos.length} blocos · {ambBlocos.filter(b=>b.ativo).length} ativos</p>
            </div>
          </div>

          {/* Seletor de ambiente */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['home','lojista','entregador'] as const).map(a=>(
              <button key={a} onClick={()=>setEditorAmbiente(a)}
                className={`rounded-2xl p-4 text-left border-2 transition ${
                  editorAmbiente===a?'border-transparent shadow-lg':'border-gray-100 bg-white hover:border-gray-200'}`}
                style={editorAmbiente===a?{background:`linear-gradient(135deg,${a==='home'?'#f97316,#ef4444':a==='lojista'?'#3b82f6,#4f46e5':'#10b981,#0d9488'})`,color:'white'}:{}}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{a==='home'?'🏠':a==='lojista'?'🏪':'🚴'}</span>
                  <span className="font-bold text-sm">{ambienteConfig[a].label}</span>
                </div>
                <p className={`text-xs ${editorAmbiente===a?'text-white/80':'text-gray-400'}`}>{ambienteConfig[a].desc}</p>
                <p className={`text-xs font-bold mt-1 ${editorAmbiente===a?'text-white/90':'text-gray-500'}`}>
                  {blocos.filter(b=>b.ambiente===a).length} blocos · {blocos.filter(b=>b.ambiente===a&&b.ativo).length} ativos
                </p>
              </button>
            ))}
          </div>

          {/* Adicionar blocos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Plus size={14}/> Adicionar Bloco</h4>
            <div className="flex flex-wrap gap-2">
              {(['banner','cards','texto','faq','cta','depoimentos','galeria','stats'] as ModuloBloco['tipo'][]).map(tipo=>(
                <button key={tipo} onClick={()=>addBloco(tipo)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl text-xs font-semibold text-gray-600 hover:text-orange-600 transition">
                  <span>{blocoIcons[tipo]}</span> {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de blocos */}
          <div className="space-y-3">
            {ambBlocos.length===0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
                <p className="text-gray-400 text-sm">Nenhum bloco neste ambiente. Adicione acima! 👆</p>
              </div>
            ) : ambBlocos.map((bloco,idx)=>(
              <div key={bloco.id} className={`bg-white rounded-2xl border shadow-sm transition ${
                bloco.ativo?'border-gray-100':'border-dashed border-gray-200 opacity-60'}`}>
                <div className="flex items-center gap-3 p-4">
                  {/* Drag handle visual */}
                  <div className="flex flex-col gap-0.5">
                    <button onClick={()=>moveBloco(bloco.id,'up')} disabled={idx===0}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition">
                      <ChevronUp size={14}/>
                    </button>
                    <button onClick={()=>moveBloco(bloco.id,'down')} disabled={idx===ambBlocos.length-1}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition">
                      <ChevronDown size={14}/>
                    </button>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-lg flex-shrink-0">
                    {blocoIcons[bloco.tipo]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-800">{bloco.titulo}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{bloco.tipo}</span>
                      <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">#{bloco.ordem}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{bloco.subtitulo}</p>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    {/* Toggle ativo */}
                    <button onClick={()=>toggleBloco(bloco.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        bloco.ativo?'bg-green-100 text-green-700 hover:bg-green-200':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {bloco.ativo?<><CheckCircle size={12}/>Ativo</>:<><EyeOff size={12}/>Oculto</>}
                    </button>
                    <button onClick={()=>deleteBloco(bloco.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>

                {/* Edição inline do bloco */}
                <div className="border-t border-gray-50 px-4 pb-4 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Título</label>
                    <input type="text" value={bloco.titulo}
                      onChange={e=>setBlocos(p=>p.map(b=>b.id===bloco.id?{...b,titulo:e.target.value}:b))}
                      className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 mt-1"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Subtítulo</label>
                    <input type="text" value={bloco.subtitulo}
                      onChange={e=>setBlocos(p=>p.map(b=>b.id===bloco.id?{...b,subtitulo:e.target.value}:b))}
                      className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 mt-1"/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Conteúdo</label>
                    <textarea value={bloco.conteudo} rows={2}
                      onChange={e=>setBlocos(p=>p.map(b=>b.id===bloco.id?{...b,conteudo:e.target.value}:b))}
                      className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 mt-1 resize-none"/>
                  </div>
                  {['banner','galeria'].includes(bloco.tipo) && (
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">URL da Imagem</label>
                      <input type="url" value={bloco.imagem} placeholder="https://..."
                        onChange={e=>setBlocos(p=>p.map(b=>b.id===bloco.id?{...b,imagem:e.target.value}:b))}
                        className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 mt-1"/>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botão salvar ordem */}
          {ambBlocos.length>0 && (
            <button onClick={()=>toast_('✅ Estrutura de blocos salva! Site atualizado.')} className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
              <Save size={15}/> Salvar Estrutura de Blocos
            </button>
          )}
        </div>
      )
    }

    // ── RENDER PRINCIPAL ──
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Wand2 size={20} className="text-white"/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Editor do Site</h2>
            <p className="text-sm text-gray-500">CMS global da plataforma — controle visual e conteúdo de todos os ambientes</p>
          </div>
        </div>

        {/* Sub-abas */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {([
            {id:'identidade', icon:<Palette size={14}/>, label:'Identidade Visual'},
            {id:'paginas',    icon:<BookOpen size={14}/>, label:'Páginas (CMS)'},
            {id:'modulos',    icon:<Layout size={14}/>,   label:'Módulos'},
          ] as {id: typeof editorTab, icon: React.ReactNode, label: string}[]).map(t=>(
            <button key={t.id} onClick={()=>setEditorTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold transition ${
                editorTab===t.id?'bg-white text-gray-800 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
              {t.icon} <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo da aba */}
        {editorTab === 'identidade' && renderIdentidade()}
        {editorTab === 'paginas'    && renderPaginas()}
        {editorTab === 'modulos'    && renderModulos()}
      </div>
    )
  }

  // ── CONFIGURAÇÕES ──
  function renderConfig() {
    return (
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800">Configurações do Sistema</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Globe size={16}/> Plataforma</h3>
          {[
            {label:'Nome da Plataforma', val:'Kainow One', type:'text'},
            {label:'Email de Suporte',   val:'suporte@kainow.com', type:'email'},
            {label:'URL do Site',        val:'https://kainowone.com.br', type:'url'},
          ].map((f,i)=>(
            <div key={i}>
              <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
              <input type={f.type} defaultValue={f.val} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Percent size={16}/> Comissões e Taxas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Comissão lojistas (%)</label>
              <input type="number" value={comissaoLojista} onChange={e=>setComissaoLojista(parseFloat(e.target.value)||0)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
              <p className="text-[10px] text-gray-400 mt-1">% da plataforma sobre cada venda</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">% Entregador sobre taxa</label>
              <input type="number" value={percentualEntregador} onChange={e=>setPercentualEntregador(parseFloat(e.target.value)||0)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
              <p className="text-[10px] text-gray-400 mt-1">Plataforma fica com {100-percentualEntregador}%</p>
            </div>
            {[
              {label:'Prazo para liberar saldo (dias)', val:'14'},
              {label:'Valor mínimo de saque (R$)', val:'50'},
            ].map((f,i)=>(
              <div key={i}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                <input type="number" defaultValue={f.val} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Truck size={16}/> Logística</h3>
          {[
            {label:'Frete grátis a partir de (R$)', val:'200'},
            {label:'Prazo máx. despacho (dias)',     val:'3'},
          ].map((f,i)=>(
            <div key={i}>
              <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
              <input type="number" defaultValue={f.val} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={()=>toast_('✅ Configurações salvas!')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition">
            <Save size={15}/> Salvar todas as configurações
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Lock size={16}/> Segurança da conta</h3>
          <input type="password" placeholder="Senha atual" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
          <input type="password" placeholder="Nova senha" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
          <input type="password" placeholder="Confirmar nova senha" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500"/>
          <button onClick={()=>toast_('✅ Senha alterada com sucesso!')}
            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-900 transition">
            <Lock size={14}/> Alterar Senha
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════
  // LAYOUT PRINCIPAL
  // ══════════════════════════════════════════════════════════
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen?'w-60':'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="h-16 flex items-center px-4 border-b border-gray-800 gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">K</span>
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">Kainow One</p>
              <p className="text-orange-400 text-[10px]">Admin Panel</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map(item=>(
            <button key={item.id} onClick={()=>setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition relative ${activeTab===item.id?'bg-orange-500/20 text-orange-400 border-r-2 border-orange-500':'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium truncate flex-1 text-left">{item.label}</span>}
              {(item as any).badge > 0 && (
                <span className={`${sidebarOpen?'ml-auto':'absolute top-2 right-1'} bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1`}>
                  {(item as any).badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-3">
          <button onClick={()=>setSidebarOpen(v=>!v)}
            className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-white transition rounded-lg hover:bg-gray-800">
            {sidebarOpen ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
          </button>
          <button onClick={()=>{setLoggedIn(false);sessionStorage.removeItem('kainow_admin')}}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition ${sidebarOpen?'':'justify-center'}`}>
            <LogOut size={16}/>
            {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(v=>!v)} className="text-gray-400 hover:text-gray-700 transition">
              <Menu size={20}/>
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-800 capitalize">
                {menuItems.find(m=>m.id===activeTab)?.label ?? 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-400 hover:text-orange-500 flex items-center gap-1 transition">
              <Home size={14}/> Ver site
            </Link>
            <button className="relative text-gray-400 hover:text-gray-700 transition">
              <Bell size={20}/>
              {mockReclamacoes.filter(r=>r.status==='aberta').length>0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {mockReclamacoes.filter(r=>r.status==='aberta').length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl px-3 py-1.5">
              <span className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-xs font-black">A</span>
              <span className="text-sm font-semibold hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard'    && renderDashboard()}
          {activeTab === 'lojistas'     && renderLojistas()}
          {activeTab === 'produtos'     && renderProdutos()}
          {activeTab === 'pedidos'      && renderPedidos()}
          {activeTab === 'usuarios'     && renderUsuarios()}
          {activeTab === 'entregadores' && renderEntregadores()}
          {activeTab === 'reclamacoes'  && renderReclamacoes()}
          {activeTab === 'financeiro'   && renderFinanceiro()}
          {activeTab === 'gift-cards'   && renderGiftCards()}
          {activeTab === 'config'       && renderConfig()}
          {activeTab === 'editor-site' && renderEditorSite()}
        </main>
      </div>

      {/* MODAIS */}
      {showModal === 'produto'  && <ModalProduto  editTarget={editTarget} setShowModal={setShowModal} setEditTarget={setEditTarget} setProdutos={setProdutos} toast_={toast_}/>}
      {showModal === 'lojista'  && <ModalLojista  editTarget={editTarget} setShowModal={setShowModal} setLojistas={setLojistas} toast_={toast_}/>}
      {showModal === 'usuario'  && <ModalUsuario  editTarget={editTarget} setShowModal={setShowModal} setUsuarios={setUsuarios} toast_={toast_}/>}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-pulse">
          {toast}
        </div>
      )}
    </div>
  )
}
