// ═══════════════════════════════════════════════════════════════════
// KAINOW ONE — Sistema de Rastreamento de Pedidos
// Timeline visual + Status de cada etapa do pedido
// ═══════════════════════════════════════════════════════════════════

export type StatusPedidoRastreio =
  | 'aguardando_pagamento'
  | 'pago'
  | 'preparando'
  | 'enviado'
  | 'em_transito'
  | 'saiu_entrega'
  | 'entregue'
  | 'cancelado'
  | 'devolvido'

export interface EtapaRastreio {
  status: StatusPedidoRastreio
  label: string
  descricao: string
  icon: string
  data?: string
  hora?: string
  local?: string
  concluida: boolean
  ativa: boolean
}

export interface PedidoRastreio {
  numero: string
  codigoRastreio: string
  transportadora: string
  status: StatusPedidoRastreio
  previsaoEntrega: string
  dataPedido: string
  etapas: EtapaRastreio[]
  produto: {
    titulo: string
    imagem: string
    preco: number
    qtd: number
  }
  endereco: {
    nome: string
    rua: string
    cidade: string
    uf: string
    cep: string
  }
}

// Gera timeline de rastreio baseado no status atual
export function gerarEtapas(status: StatusPedidoRastreio): EtapaRastreio[] {
  const todasEtapas: Omit<EtapaRastreio, 'concluida' | 'ativa'>[] = [
    {
      status: 'aguardando_pagamento',
      label: 'Pedido realizado',
      descricao: 'Aguardando confirmação do pagamento',
      icon: '📋',
    },
    {
      status: 'pago',
      label: 'Pagamento confirmado',
      descricao: 'Seu pagamento foi aprovado com sucesso',
      icon: '✅',
    },
    {
      status: 'preparando',
      label: 'Preparando pedido',
      descricao: 'O lojista está separando e embalando seu produto',
      icon: '📦',
    },
    {
      status: 'enviado',
      label: 'Pedido enviado',
      descricao: 'Seu pedido foi coletado pela transportadora',
      icon: '🚚',
    },
    {
      status: 'em_transito',
      label: 'Em trânsito',
      descricao: 'Seu pedido está a caminho da sua cidade',
      icon: '🛣️',
    },
    {
      status: 'saiu_entrega',
      label: 'Saiu para entrega',
      descricao: 'O entregador está a caminho do seu endereço',
      icon: '🏃',
    },
    {
      status: 'entregue',
      label: 'Entregue!',
      descricao: 'Pedido entregue com sucesso. Aproveite!',
      icon: '🎉',
    },
  ]

  const ordem: StatusPedidoRastreio[] = [
    'aguardando_pagamento', 'pago', 'preparando',
    'enviado', 'em_transito', 'saiu_entrega', 'entregue'
  ]

  const statusIndex = ordem.indexOf(status)

  return todasEtapas.map((etapa, i) => ({
    ...etapa,
    concluida: i < statusIndex,
    ativa: i === statusIndex,
    data: i <= statusIndex ? gerarDataMock(statusIndex - i) : undefined,
    hora: i <= statusIndex ? gerarHoraMock(i) : undefined,
    local: i >= 3 && i <= statusIndex ? gerarLocalMock(i) : undefined,
  }))
}

function gerarDataMock(diasAtras: number): string {
  const d = new Date()
  d.setDate(d.getDate() - diasAtras)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function gerarHoraMock(etapa: number): string {
  const horas = ['09:14', '09:47', '13:22', '14:08', '08:55', '07:30', '15:43']
  return horas[etapa] || '10:00'
}

function gerarLocalMock(etapa: number): string {
  const locais = [
    '',
    '',
    'Galpão Kainow — São Paulo, SP',
    'Correios — Agência São Paulo Centro',
    'Centro de Triagem SEDEX — Guarulhos, SP',
    'Unidade de Entrega — Seu bairro',
    'Entregue no endereço',
  ]
  return locais[etapa] || ''
}

// Mock de pedidos reais para a página de conta
export const mockPedidosRastreio: PedidoRastreio[] = [
  {
    numero: '#KNW-8841',
    codigoRastreio: 'BR123456789BR',
    transportadora: 'SEDEX',
    status: 'saiu_entrega',
    previsaoEntrega: 'Hoje até 22:00',
    dataPedido: '18 Mai 2025',
    etapas: gerarEtapas('saiu_entrega'),
    produto: {
      titulo: 'iPhone 15 Pro Max 256GB Titânio Natural',
      imagem: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
      preco: 7999.99,
      qtd: 1,
    },
    endereco: {
      nome: 'Usuário Kainow',
      rua: 'Av. Paulista, 1000 — Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
    }
  },
  {
    numero: '#KNW-7752',
    codigoRastreio: 'BR987654321BR',
    transportadora: 'PAC',
    status: 'entregue',
    previsaoEntrega: 'Entregue em 15 Mai 2025',
    dataPedido: '10 Mai 2025',
    etapas: gerarEtapas('entregue'),
    produto: {
      titulo: 'Fone Sony WH-1000XM5 Noise Cancelling',
      imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      preco: 1899.00,
      qtd: 1,
    },
    endereco: {
      nome: 'Usuário Kainow',
      rua: 'Av. Paulista, 1000 — Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
    }
  },
  {
    numero: '#KNW-7103',
    codigoRastreio: 'BR555666777BR',
    transportadora: 'SEDEX',
    status: 'em_transito',
    previsaoEntrega: 'Amanhã, até 20:00',
    dataPedido: '5 Mai 2025',
    etapas: gerarEtapas('em_transito'),
    produto: {
      titulo: 'Tênis Nike Air Max 270 Masculino Preto',
      imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      preco: 649.90,
      qtd: 1,
    },
    endereco: {
      nome: 'Usuário Kainow',
      rua: 'Av. Paulista, 1000 — Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
    }
  },
]

export const statusLabel: Record<StatusPedidoRastreio, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pagamento confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  em_transito: 'Em trânsito',
  saiu_entrega: 'Saiu para entrega',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
  devolvido: 'Devolvido',
}

export const statusColor: Record<StatusPedidoRastreio, string> = {
  aguardando_pagamento: 'bg-yellow-100 text-yellow-700',
  pago: 'bg-blue-100 text-blue-700',
  preparando: 'bg-purple-100 text-purple-700',
  enviado: 'bg-indigo-100 text-indigo-700',
  em_transito: 'bg-orange-100 text-orange-700',
  saiu_entrega: 'bg-green-100 text-green-700',
  entregue: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-700',
  devolvido: 'bg-gray-100 text-gray-700',
}
