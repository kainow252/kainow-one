// ═══════════════════════════════════════════════════════════════════
// KAINOW ONE — ECOSSISTEMA COMPARTILHADO
// Dados e tipos usados pelos 3 portais: Admin / Lojista / Entregador
// ═══════════════════════════════════════════════════════════════════

// ── TIPOS ──────────────────────────────────────────────────────────

export type StatusPedido =
  | 'aguardando_pagamento'
  | 'pago'
  | 'preparando'
  | 'pronto_coleta'
  | 'coletado'
  | 'em_rota'
  | 'entregue'
  | 'cancelado'
  | 'devolvido'

export type StatusEntregador = 'disponivel' | 'em_corrida' | 'offline' | 'suspenso'
export type TipoVeiculo = 'moto' | 'carro' | 'bicicleta' | 'a_pe'
export type StatusLojista = 'ativo' | 'pendente' | 'suspenso'
export type ReputacaoLojista = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'

export interface Entregador {
  id: string
  nome: string
  email: string
  senha?: string          // mock — em prod seria hash
  telefone: string
  cpf: string
  veiculo: TipoVeiculo
  placa?: string
  foto: string
  status: StatusEntregador
  cidade: string
  estado: string
  lat: number
  lng: number
  totalEntregas: number
  totalGanhos: number
  avaliacaoMedia: number
  taxaAceitacao: number   // %
  tempoCadastro: string
  documentosOk: boolean
  corridas: Corrida[]
}

export interface Corrida {
  id: string
  pedidoId: string
  entregadorId: string | null | undefined
  status: 'disponivel' | 'aceita' | 'coletada' | 'entregue' | 'cancelada'
  lojistaId: string
  lojistaNome: string
  lojistaEndereco: string
  lojistaLat: number
  lojistaLng: number
  clienteNome: string
  clienteEndereco: string
  clienteLat: number
  clienteLng: number
  distanciaKm: number
  taxaEntrega: number
  ganhoEntregador: number   // taxaEntrega * (100 - comissaoPlataforma%) / 100
  produto: string
  peso: string
  criadoEm: string
  aceitoEm?: string
  coletadoEm?: string
  entregueEm?: string
  avaliacao?: number
}

export interface PedidoEcossistema {
  id: string
  lojistaId: string
  lojistaNome: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone: string
  clienteEndereco: string
  clienteComplemento: string
  clienteCidade: string
  clienteEstado: string
  clienteCep: string
  clienteLat: number
  clienteLng: number
  itens: ItemPedido[]
  subtotal: number
  taxaEntrega: number
  desconto: number
  total: number
  pagamento: string
  status: StatusPedido
  criadoEm: string
  atualizadoEm: string
  corridaId?: string
  entregadorId?: string
  entregadorNome?: string
  notaFiscal?: string
  observacao?: string
}

export interface ItemPedido {
  produtoId: string
  nome: string
  quantidade: number
  preco: number
  imagem: string
}

export interface LojistaEcossistema {
  id: string
  nome: string
  email: string
  senha: string   // mock — em prod seria hash
  cnpj: string
  telefone: string
  whatsapp: string
  descricao: string
  logo: string
  banner: string
  categoria: string
  plano: 'Básico' | 'Pro' | 'Premium'
  status: StatusLojista
  reputacao: ReputacaoLojista
  cidade: string
  estado: string
  cep: string
  endereco: string
  lat: number
  lng: number
  comissao: number    // % que a plataforma fica
  totalVendas: number
  totalPedidos: number
  saldoPendente: number
  saldoDisponivel: number
  avaliacaoMedia: number
  horarioAbertura: string
  horarioFechamento: string
  diasFuncionamento: string[]
  tempoPreparacao: number   // minutos
  raioEntrega: number       // km
  dataCadastro: string
}

export interface ConfiguracaoPlataforma {
  comissaoLojista: number       // % padrão
  taxaEntregaBase: number       // R$ base
  taxaEntregaPorKm: number      // R$ por km
  percentualEntregador: number  // % da taxa de entrega que vai pro entregador
  tempoMaxAceiteCorrida: number // segundos para aceitar antes de redistribuir
  raioMaxBuscaEntregador: number // km
}

// ── CONFIGURAÇÃO DA PLATAFORMA ──────────────────────────────────────

export const configPlataforma: ConfiguracaoPlataforma = {
  comissaoLojista: 10,
  taxaEntregaBase: 5.00,
  taxaEntregaPorKm: 1.50,
  percentualEntregador: 80,    // entregador fica com 80% da taxa
  tempoMaxAceiteCorrida: 120,
  raioMaxBuscaEntregador: 15,
}

// ── DADOS MOCK — LOJISTAS ──────────────────────────────────────────

export const mockLojistasEco: LojistaEcossistema[] = [
  {
    id: 'L001', nome: 'Tech Store SP', email: 'lojista@techstore.com', senha: 'Loja@2026',
    cnpj: '12.345.678/0001-90', telefone: '(11) 3456-7890', whatsapp: '(11) 91234-5678',
    descricao: 'Sua loja de eletrônicos com os melhores preços de SP. Garantia em todos os produtos.',
    logo: '📱', banner: '', categoria: 'Eletrônicos', plano: 'Premium',
    status: 'ativo', reputacao: 'Gold', cidade: 'São Paulo', estado: 'SP',
    cep: '01310-100', endereco: 'Av. Paulista, 1000, Loja 5',
    lat: -23.5613, lng: -46.6563,
    comissao: 8, totalVendas: 187450.00, totalPedidos: 543,
    saldoPendente: 12340.00, saldoDisponivel: 8920.00,
    avaliacaoMedia: 4.8, horarioAbertura: '09:00', horarioFechamento: '18:00',
    diasFuncionamento: ['Seg','Ter','Qua','Qui','Sex'],
    tempoPreparacao: 30, raioEntrega: 20, dataCadastro: '2024-03-15',
  },
  {
    id: 'L002', nome: 'Moda Fashion RJ', email: 'moda@fashionrj.com', senha: 'Loja@2026',
    cnpj: '98.765.432/0001-10', telefone: '(21) 2567-8901', whatsapp: '(21) 99876-5432',
    descricao: 'Moda feminina e masculina com as últimas tendências do mercado.',
    logo: '👗', banner: '', categoria: 'Moda', plano: 'Pro',
    status: 'ativo', reputacao: 'Silver', cidade: 'Rio de Janeiro', estado: 'RJ',
    cep: '22070-010', endereco: 'Av. Atlântica, 500, Loja 12',
    lat: -22.9707, lng: -43.1826,
    comissao: 10, totalVendas: 67890.00, totalPedidos: 312,
    saldoPendente: 4560.00, saldoDisponivel: 2310.00,
    avaliacaoMedia: 4.3, horarioAbertura: '10:00', horarioFechamento: '20:00',
    diasFuncionamento: ['Seg','Ter','Qua','Qui','Sex','Sab'],
    tempoPreparacao: 20, raioEntrega: 15, dataCadastro: '2024-06-20',
  },
  {
    id: 'L003', nome: 'Casa & Cia BH', email: 'casa@ciabh.com', senha: 'Loja@2026',
    cnpj: '11.222.333/0001-44', telefone: '(31) 3333-4444', whatsapp: '(31) 98888-7777',
    descricao: 'Tudo para sua casa e jardim. Móveis, decoração e utilidades domésticas.',
    logo: '🏠', banner: '', categoria: 'Casa & Jardim', plano: 'Básico',
    status: 'ativo', reputacao: 'Bronze', cidade: 'Belo Horizonte', estado: 'MG',
    cep: '30130-110', endereco: 'Rua da Bahia, 200',
    lat: -19.9208, lng: -43.9378,
    comissao: 12, totalVendas: 34200.00, totalPedidos: 189,
    saldoPendente: 2100.00, saldoDisponivel: 890.00,
    avaliacaoMedia: 4.1, horarioAbertura: '08:00', horarioFechamento: '17:00',
    diasFuncionamento: ['Seg','Ter','Qua','Qui','Sex'],
    tempoPreparacao: 45, raioEntrega: 10, dataCadastro: '2024-09-01',
  },
]

// ── DADOS MOCK — ENTREGADORES ──────────────────────────────────────

export const mockEntregadores: Entregador[] = [
  {
    id: 'E001', nome: 'Lucas Motoboy', email: 'entregador@lucas.com', senha: 'Moto@2026',
    telefone: '(11) 99001-1234', cpf: '123.456.789-00',
    veiculo: 'moto', placa: 'ABC-1D23', foto: '🏍️',
    status: 'disponivel', cidade: 'São Paulo', estado: 'SP',
    lat: -23.5580, lng: -46.6600,
    totalEntregas: 847, totalGanhos: 12430.00,
    avaliacaoMedia: 4.9, taxaAceitacao: 94,
    tempoCadastro: '2024-01-10', documentosOk: true, corridas: [],
  },
  {
    id: 'E002', nome: 'Pedro Carro', email: 'pedro@entregas.com', senha: 'Moto@2026',
    telefone: '(11) 98765-4321', cpf: '987.654.321-00',
    veiculo: 'carro', placa: 'XYZ-5E67', foto: '🚗',
    status: 'em_corrida', cidade: 'São Paulo', estado: 'SP',
    lat: -23.5490, lng: -46.6380,
    totalEntregas: 412, totalGanhos: 7820.00,
    avaliacaoMedia: 4.6, taxaAceitacao: 87,
    tempoCadastro: '2024-03-22', documentosOk: true, corridas: [],
  },
  {
    id: 'E003', nome: 'Ana Bicicleta', email: 'ana@bike.com', senha: 'Moto@2026',
    telefone: '(21) 97654-3210', cpf: '456.789.123-00',
    veiculo: 'bicicleta', foto: '🚲',
    status: 'disponivel', cidade: 'Rio de Janeiro', estado: 'RJ',
    lat: -22.9650, lng: -43.1780,
    totalEntregas: 234, totalGanhos: 3450.00,
    avaliacaoMedia: 4.7, taxaAceitacao: 91,
    tempoCadastro: '2024-05-14', documentosOk: true, corridas: [],
  },
  {
    id: 'E004', nome: 'Carlos Moto', email: 'carlos@rapido.com', senha: 'Moto@2026',
    telefone: '(31) 96543-2109', cpf: '321.654.987-00',
    veiculo: 'moto', placa: 'MNO-9P01', foto: '🏍️',
    status: 'offline', cidade: 'Belo Horizonte', estado: 'MG',
    lat: -19.9180, lng: -43.9340,
    totalEntregas: 156, totalGanhos: 2340.00,
    avaliacaoMedia: 4.4, taxaAceitacao: 79,
    tempoCadastro: '2024-08-30', documentosOk: false, corridas: [],
  },
  {
    id: 'E005', nome: 'Marcos Freelancer', email: 'marcos@free.com', senha: 'Moto@2026',
    telefone: '(11) 95432-1098', cpf: '654.321.098-00',
    veiculo: 'moto', placa: 'DEF-3G45', foto: '🏍️',
    status: 'disponivel', cidade: 'São Paulo', estado: 'SP',
    lat: -23.5700, lng: -46.6450,
    totalEntregas: 1203, totalGanhos: 19870.00,
    avaliacaoMedia: 4.95, taxaAceitacao: 97,
    tempoCadastro: '2023-11-05', documentosOk: true, corridas: [],
  },
]

// ── DADOS MOCK — PEDIDOS DO ECOSSISTEMA ────────────────────────────

export const mockPedidosEco: PedidoEcossistema[] = [
  {
    id: 'PED-2026-001', lojistaId: 'L001', lojistaNome: 'Tech Store SP',
    clienteNome: 'Maria Silva', clienteEmail: 'maria@email.com',
    clienteTelefone: '(11) 99999-1111',
    clienteEndereco: 'Rua das Flores, 123', clienteComplemento: 'Apto 45',
    clienteCidade: 'São Paulo', clienteEstado: 'SP', clienteCep: '01234-567',
    clienteLat: -23.5750, clienteLng: -46.6400,
    itens: [{ produtoId: '1', nome: 'Smartphone Galaxy S24', quantidade: 1, preco: 2899.90, imagem: '📱' }],
    subtotal: 2899.90, taxaEntrega: 12.50, desconto: 0, total: 2912.40,
    pagamento: 'Cartão de Crédito 3x', status: 'pronto_coleta',
    criadoEm: '2026-05-20 09:15', atualizadoEm: '2026-05-20 09:45',
    corridaId: 'COR-001', entregadorId: undefined,
    observacao: 'Deixar com porteiro se não tiver em casa',
  },
  {
    id: 'PED-2026-002', lojistaId: 'L001', lojistaNome: 'Tech Store SP',
    clienteNome: 'João Santos', clienteEmail: 'joao@email.com',
    clienteTelefone: '(11) 98888-2222',
    clienteEndereco: 'Av. Brasil, 456', clienteComplemento: '',
    clienteCidade: 'São Paulo', clienteEstado: 'SP', clienteCep: '04567-890',
    clienteLat: -23.5900, clienteLng: -46.6550,
    itens: [
      { produtoId: '5', nome: 'Fone Bluetooth JBL', quantidade: 2, preco: 199.90, imagem: '🎧' },
      { produtoId: '3', nome: 'Cabo USB-C', quantidade: 1, preco: 29.90, imagem: '🔌' },
    ],
    subtotal: 429.70, taxaEntrega: 9.50, desconto: 50.00, total: 389.20,
    pagamento: 'Pix', status: 'preparando',
    criadoEm: '2026-05-20 10:30', atualizadoEm: '2026-05-20 10:31',
    observacao: '',
  },
  {
    id: 'PED-2026-003', lojistaId: 'L002', lojistaNome: 'Moda Fashion RJ',
    clienteNome: 'Ana Oliveira', clienteEmail: 'ana@email.com',
    clienteTelefone: '(21) 97777-3333',
    clienteEndereco: 'Rua Copacabana, 789', clienteComplemento: 'Casa',
    clienteCidade: 'Rio de Janeiro', clienteEstado: 'RJ', clienteCep: '22020-040',
    clienteLat: -22.9680, clienteLng: -43.1800,
    itens: [{ produtoId: '11', nome: 'Vestido Floral Verão', quantidade: 1, preco: 189.90, imagem: '👗' }],
    subtotal: 189.90, taxaEntrega: 8.00, desconto: 0, total: 197.90,
    pagamento: 'Cartão de Débito', status: 'em_rota',
    criadoEm: '2026-05-20 08:00', atualizadoEm: '2026-05-20 08:45',
    corridaId: 'COR-002', entregadorId: 'E003', entregadorNome: 'Ana Bicicleta',
  },
  {
    id: 'PED-2026-004', lojistaId: 'L001', lojistaNome: 'Tech Store SP',
    clienteNome: 'Carlos Pereira', clienteEmail: 'carlos@email.com',
    clienteTelefone: '(11) 96666-4444',
    clienteEndereco: 'Rua Augusta, 321', clienteComplemento: 'Sala 10',
    clienteCidade: 'São Paulo', clienteEstado: 'SP', clienteCep: '01305-000',
    clienteLat: -23.5520, clienteLng: -46.6510,
    itens: [{ produtoId: '2', nome: 'Notebook Dell Inspiron', quantidade: 1, preco: 3299.00, imagem: '💻' }],
    subtotal: 3299.00, taxaEntrega: 15.00, desconto: 0, total: 3314.00,
    pagamento: 'Cartão de Crédito 12x', status: 'entregue',
    criadoEm: '2026-05-19 14:00', atualizadoEm: '2026-05-19 16:30',
    corridaId: 'COR-003', entregadorId: 'E001', entregadorNome: 'Lucas Motoboy',
  },
  {
    id: 'PED-2026-005', lojistaId: 'L003', lojistaNome: 'Casa & Cia BH',
    clienteNome: 'Fernanda Lima', clienteEmail: 'fernanda@email.com',
    clienteTelefone: '(31) 95555-5555',
    clienteEndereco: 'Av. Contorno, 654', clienteComplemento: '',
    clienteCidade: 'Belo Horizonte', clienteEstado: 'MG', clienteCep: '30110-130',
    clienteLat: -19.9250, clienteLng: -43.9420,
    itens: [{ produtoId: '21', nome: 'Sofá 3 Lugares Cinza', quantidade: 1, preco: 1290.00, imagem: '🛋️' }],
    subtotal: 1290.00, taxaEntrega: 25.00, desconto: 0, total: 1315.00,
    pagamento: 'Pix', status: 'pago',
    criadoEm: '2026-05-20 11:00', atualizadoEm: '2026-05-20 11:01',
  },
  {
    id: 'PED-2026-006', lojistaId: 'L002', lojistaNome: 'Moda Fashion RJ',
    clienteNome: 'Roberto Alves', clienteEmail: 'roberto@email.com',
    clienteTelefone: '(21) 94444-6666',
    clienteEndereco: 'Rua Ipanema, 100', clienteComplemento: 'Bloco B, Apto 201',
    clienteCidade: 'Rio de Janeiro', clienteEstado: 'RJ', clienteCep: '22410-000',
    clienteLat: -22.9840, clienteLng: -43.2020,
    itens: [
      { produtoId: '12', nome: 'Calça Jeans Premium', quantidade: 2, preco: 149.90, imagem: '👖' },
      { produtoId: '14', nome: 'Camiseta Polo', quantidade: 3, preco: 89.90, imagem: '👕' },
    ],
    subtotal: 569.50, taxaEntrega: 10.00, desconto: 0, total: 579.50,
    pagamento: 'Cartão de Crédito 2x', status: 'aguardando_pagamento',
    criadoEm: '2026-05-20 12:45', atualizadoEm: '2026-05-20 12:45',
  },
]

// ── DADOS MOCK — CORRIDAS ──────────────────────────────────────────

export const mockCorridas: Corrida[] = [
  {
    id: 'COR-001', pedidoId: 'PED-2026-001', entregadorId: undefined,
    status: 'disponivel',
    lojistaId: 'L001', lojistaNome: 'Tech Store SP',
    lojistaEndereco: 'Av. Paulista, 1000, Loja 5 — SP',
    lojistaLat: -23.5613, lojistaLng: -46.6563,
    clienteNome: 'Maria Silva',
    clienteEndereco: 'Rua das Flores, 123, Apto 45 — SP',
    clienteLat: -23.5750, clienteLng: -46.6400,
    distanciaKm: 3.2, taxaEntrega: 12.50, ganhoEntregador: 10.00,
    produto: 'Smartphone Galaxy S24', peso: '0,5 kg',
    criadoEm: '2026-05-20 09:45',
  },
  {
    id: 'COR-002', pedidoId: 'PED-2026-003', entregadorId: 'E003',
    status: 'coletada',
    lojistaId: 'L002', lojistaNome: 'Moda Fashion RJ',
    lojistaEndereco: 'Av. Atlântica, 500, Loja 12 — RJ',
    lojistaLat: -22.9707, lojistaLng: -43.1826,
    clienteNome: 'Ana Oliveira',
    clienteEndereco: 'Rua Copacabana, 789, Casa — RJ',
    clienteLat: -22.9680, clienteLng: -43.1800,
    distanciaKm: 1.8, taxaEntrega: 8.00, ganhoEntregador: 6.40,
    produto: 'Vestido Floral Verão', peso: '0,3 kg',
    criadoEm: '2026-05-20 08:30', aceitoEm: '2026-05-20 08:35', coletadoEm: '2026-05-20 08:45',
  },
  {
    id: 'COR-003', pedidoId: 'PED-2026-004', entregadorId: 'E001',
    status: 'entregue',
    lojistaId: 'L001', lojistaNome: 'Tech Store SP',
    lojistaEndereco: 'Av. Paulista, 1000, Loja 5 — SP',
    lojistaLat: -23.5613, lojistaLng: -46.6563,
    clienteNome: 'Carlos Pereira',
    clienteEndereco: 'Rua Augusta, 321, Sala 10 — SP',
    clienteLat: -23.5520, clienteLng: -46.6510,
    distanciaKm: 4.5, taxaEntrega: 15.00, ganhoEntregador: 12.00,
    produto: 'Notebook Dell Inspiron', peso: '2,1 kg',
    criadoEm: '2026-05-19 14:30', aceitoEm: '2026-05-19 14:35',
    coletadoEm: '2026-05-19 15:00', entregueEm: '2026-05-19 16:30',
    avaliacao: 5,
  },
]

// ── HELPERS ────────────────────────────────────────────────────────

export function calcTaxaEntrega(distanciaKm: number): number {
  return configPlataforma.taxaEntregaBase + distanciaKm * configPlataforma.taxaEntregaPorKm
}

export function calcGanhoEntregador(taxaEntrega: number): number {
  return taxaEntrega * configPlataforma.percentualEntregador / 100
}

export function labelStatus(status: StatusPedido): string {
  const map: Record<StatusPedido, string> = {
    aguardando_pagamento: 'Aguardando Pagamento',
    pago:               'Pago',
    preparando:         'Preparando',
    pronto_coleta:      'Pronto para Coleta',
    coletado:           'Coletado',
    em_rota:            'Em Rota',
    entregue:           'Entregue',
    cancelado:          'Cancelado',
    devolvido:          'Devolvido',
  }
  return map[status] ?? status
}

export function corStatus(status: StatusPedido): string {
  const map: Record<StatusPedido, string> = {
    aguardando_pagamento: 'bg-gray-100 text-gray-600',
    pago:               'bg-blue-100 text-blue-700',
    preparando:         'bg-yellow-100 text-yellow-700',
    pronto_coleta:      'bg-orange-100 text-orange-700',
    coletado:           'bg-purple-100 text-purple-700',
    em_rota:            'bg-indigo-100 text-indigo-700',
    entregue:           'bg-green-100 text-green-700',
    cancelado:          'bg-red-100 text-red-600',
    devolvido:          'bg-pink-100 text-pink-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function labelStatusEntregador(s: StatusEntregador): string {
  return { disponivel:'Disponível', em_corrida:'Em Corrida', offline:'Offline', suspenso:'Suspenso' }[s]
}

export function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function fmtDist(km: number): string {
  return km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`
}
