// ═══════════════════════════════════════════════════════════════════
// KAINOW ONE — Simulador de Frete por CEP
// Usa ViaCEP API real + fallback por prefixo completo (todos os estados BR)
// ═══════════════════════════════════════════════════════════════════

export interface FreteOption {
  id: string
  nome: string
  prazo: string        // "2 dias úteis"
  prazoExato: string   // "Seg, 26 Mai"
  preco: number
  gratis: boolean
  icon: string
  descricao?: string
}

export interface CepInfo {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  valid: boolean
  errorMsg?: string
}

// Mapa completo de prefixos de CEP → Estado/Cidade (cobertura total do Brasil)
const CEP_PREFIX_MAP: Record<string, { localidade: string; uf: string }> = {
  // ── São Paulo (01–19) ──────────────────────────────────────────
  '01': { localidade: 'São Paulo',            uf: 'SP' },
  '02': { localidade: 'São Paulo',            uf: 'SP' },
  '03': { localidade: 'São Paulo',            uf: 'SP' },
  '04': { localidade: 'São Paulo',            uf: 'SP' },
  '05': { localidade: 'São Paulo',            uf: 'SP' },
  '06': { localidade: 'Osasco',               uf: 'SP' },
  '07': { localidade: 'Guarulhos',            uf: 'SP' },
  '08': { localidade: 'Mauá',                 uf: 'SP' },
  '09': { localidade: 'Santo André',          uf: 'SP' },
  '10': { localidade: 'Santos',               uf: 'SP' },
  '11': { localidade: 'Santos',               uf: 'SP' },
  '12': { localidade: 'São José dos Campos',  uf: 'SP' },
  '13': { localidade: 'Campinas',             uf: 'SP' },
  '14': { localidade: 'Ribeirão Preto',       uf: 'SP' },
  '15': { localidade: 'São José do Rio Preto',uf: 'SP' },
  '16': { localidade: 'Araçatuba',            uf: 'SP' },
  '17': { localidade: 'Bauru',                uf: 'SP' },
  '18': { localidade: 'Sorocaba',             uf: 'SP' },
  '19': { localidade: 'Presidente Prudente',  uf: 'SP' },
  // ── Rio de Janeiro (20–28) ─────────────────────────────────────
  '20': { localidade: 'Rio de Janeiro',       uf: 'RJ' },
  '21': { localidade: 'Rio de Janeiro',       uf: 'RJ' },
  '22': { localidade: 'Rio de Janeiro',       uf: 'RJ' },
  '23': { localidade: 'Rio de Janeiro',       uf: 'RJ' },
  '24': { localidade: 'Niterói',              uf: 'RJ' },
  '25': { localidade: 'Duque de Caxias',      uf: 'RJ' },
  '26': { localidade: 'Nova Iguaçu',          uf: 'RJ' },
  '27': { localidade: 'Volta Redonda',        uf: 'RJ' },
  '28': { localidade: 'Campos dos Goytacazes',uf: 'RJ' },
  // ── Espírito Santo (29) ────────────────────────────────────────
  '29': { localidade: 'Vitória',              uf: 'ES' },
  // ── Minas Gerais (30–39) ──────────────────────────────────────
  '30': { localidade: 'Belo Horizonte',       uf: 'MG' },
  '31': { localidade: 'Belo Horizonte',       uf: 'MG' },
  '32': { localidade: 'Contagem',             uf: 'MG' },
  '33': { localidade: 'Belo Horizonte',       uf: 'MG' },
  '34': { localidade: 'Nova Lima',            uf: 'MG' },
  '35': { localidade: 'Ipatinga',             uf: 'MG' },
  '36': { localidade: 'Juiz de Fora',         uf: 'MG' },
  '37': { localidade: 'Varginha',             uf: 'MG' },
  '38': { localidade: 'Uberlândia',           uf: 'MG' },
  '39': { localidade: 'Montes Claros',        uf: 'MG' },
  // ── Bahia (40–48) ─────────────────────────────────────────────
  '40': { localidade: 'Salvador',             uf: 'BA' },
  '41': { localidade: 'Salvador',             uf: 'BA' },
  '42': { localidade: 'Feira de Santana',     uf: 'BA' },
  '43': { localidade: 'Vitória da Conquista', uf: 'BA' },
  '44': { localidade: 'Feira de Santana',     uf: 'BA' },
  '45': { localidade: 'Ilhéus',               uf: 'BA' },
  '46': { localidade: 'Jequié',               uf: 'BA' },
  '47': { localidade: 'Barreiras',            uf: 'BA' },
  '48': { localidade: 'Paulo Afonso',         uf: 'BA' },
  // ── Sergipe (49) ──────────────────────────────────────────────
  '49': { localidade: 'Aracaju',              uf: 'SE' },
  // ── Pernambuco (50–56) ────────────────────────────────────────
  '50': { localidade: 'Recife',               uf: 'PE' },
  '51': { localidade: 'Recife',               uf: 'PE' },
  '52': { localidade: 'Recife',               uf: 'PE' },
  '53': { localidade: 'Olinda',               uf: 'PE' },
  '54': { localidade: 'Caruaru',              uf: 'PE' },
  '55': { localidade: 'Caruaru',              uf: 'PE' },
  '56': { localidade: 'Petrolina',            uf: 'PE' },
  // ── Alagoas (57) ──────────────────────────────────────────────
  '57': { localidade: 'Maceió',               uf: 'AL' },
  // ── Paraíba (58) ──────────────────────────────────────────────
  '58': { localidade: 'João Pessoa',          uf: 'PB' },
  // ── Rio Grande do Norte (59) ──────────────────────────────────
  '59': { localidade: 'Natal',                uf: 'RN' },
  // ── Ceará (60–63) ─────────────────────────────────────────────
  '60': { localidade: 'Fortaleza',            uf: 'CE' },
  '61': { localidade: 'Fortaleza',            uf: 'CE' },
  '62': { localidade: 'Sobral',               uf: 'CE' },
  '63': { localidade: 'Juazeiro do Norte',    uf: 'CE' },
  // ── Piauí (64) ────────────────────────────────────────────────
  '64': { localidade: 'Teresina',             uf: 'PI' },
  // ── Maranhão (65) ─────────────────────────────────────────────
  '65': { localidade: 'São Luís',             uf: 'MA' },
  // ── Pará (66–68) ──────────────────────────────────────────────
  '66': { localidade: 'Belém',                uf: 'PA' },
  '67': { localidade: 'Belém',                uf: 'PA' },
  '68': { localidade: 'Santarém',             uf: 'PA' },
  // ── Amazonas / RR / RO / AC / AP / TO (69) ───────────────────
  '69': { localidade: 'Manaus',               uf: 'AM' },
  // ── Distrito Federal (70–73) ──────────────────────────────────
  '70': { localidade: 'Brasília',             uf: 'DF' },
  '71': { localidade: 'Brasília',             uf: 'DF' },
  '72': { localidade: 'Brasília',             uf: 'DF' },
  '73': { localidade: 'Brasília',             uf: 'DF' },
  // ── Goiás (74–76) ─────────────────────────────────────────────
  '74': { localidade: 'Goiânia',              uf: 'GO' },
  '75': { localidade: 'Anápolis',             uf: 'GO' },
  '76': { localidade: 'Rio Verde',            uf: 'GO' },
  // ── Tocantins (77) ────────────────────────────────────────────
  '77': { localidade: 'Palmas',               uf: 'TO' },
  // ── Mato Grosso (78) ──────────────────────────────────────────
  '78': { localidade: 'Cuiabá',               uf: 'MT' },
  // ── Mato Grosso do Sul (79) ───────────────────────────────────
  '79': { localidade: 'Campo Grande',         uf: 'MS' },
  // ── Paraná (80–87) ────────────────────────────────────────────
  '80': { localidade: 'Curitiba',             uf: 'PR' },
  '81': { localidade: 'Curitiba',             uf: 'PR' },
  '82': { localidade: 'Curitiba',             uf: 'PR' },
  '83': { localidade: 'São José dos Pinhais', uf: 'PR' },
  '84': { localidade: 'Ponta Grossa',         uf: 'PR' },
  '85': { localidade: 'Cascavel',             uf: 'PR' },
  '86': { localidade: 'Londrina',             uf: 'PR' },
  '87': { localidade: 'Maringá',              uf: 'PR' },
  // ── Santa Catarina (88–89) ────────────────────────────────────
  '88': { localidade: 'Florianópolis',        uf: 'SC' },
  '89': { localidade: 'Joinville',            uf: 'SC' },
  // ── Rio Grande do Sul (90–99) ─────────────────────────────────
  '90': { localidade: 'Porto Alegre',         uf: 'RS' },
  '91': { localidade: 'Porto Alegre',         uf: 'RS' },
  '92': { localidade: 'Canoas',               uf: 'RS' },
  '93': { localidade: 'São Leopoldo',         uf: 'RS' },
  '94': { localidade: 'Gravataí',             uf: 'RS' },
  '95': { localidade: 'Caxias do Sul',        uf: 'RS' },
  '96': { localidade: 'Pelotas',              uf: 'RS' },
  '97': { localidade: 'Santa Maria',          uf: 'RS' },
  '98': { localidade: 'Passo Fundo',          uf: 'RS' },
  '99': { localidade: 'Passo Fundo',          uf: 'RS' },
}

// Lookup de CEP — tenta ViaCEP real, fallback para mapa de prefixos
export async function lookupCep(cep: string): Promise<CepInfo> {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) {
    return { cep, logradouro: '', bairro: '', localidade: '', uf: '', valid: false, errorMsg: 'CEP deve ter 8 dígitos' }
  }

  // 1️⃣ Tenta ViaCEP real (funciona em qualquer ambiente com fetch)
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`, { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const data = await res.json()
      if (!data.erro) {
        return {
          cep: data.cep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || '',
          valid: true,
        }
      }
    }
  } catch {
    // ViaCEP indisponível — cai no fallback abaixo
  }

  // 2️⃣ Fallback: mapa completo de prefixos (cobre todos os estados BR)
  const prefix = cleaned.substring(0, 2)
  const stateInfo = CEP_PREFIX_MAP[prefix]
  if (stateInfo) {
    return {
      cep: `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`,
      logradouro: '',
      bairro: '',
      ...stateInfo,
      valid: true,
    }
  }

  return { cep, logradouro: '', bairro: '', localidade: '', uf: '', valid: false, errorMsg: 'CEP não encontrado' }
}

// Calcula opções de frete baseado no UF destino + valor total
export function calcularFrete(
  uf: string,
  totalCompra: number,
  categoria?: string,
  freeShipping?: boolean
): FreteOption[] {
  const hoje = new Date()
  const diasUteis = (dias: number) => {
    const result = new Date(hoje)
    let added = 0
    while (added < dias) {
      result.setDate(result.getDate() + 1)
      const dow = result.getDay()
      if (dow !== 0 && dow !== 6) added++
    }
    return result.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  }

  // Frete grátis se produto tem freeShipping OU compra > R$299
  const isFreteGratis = freeShipping || totalCompra >= 299

  // Tabela de preços por região
  const regiaoSudeste     = ['SP', 'RJ', 'MG', 'ES']
  const regiaoCentroOeste = ['GO', 'MT', 'MS', 'DF', 'TO']
  const regiaoSul         = ['PR', 'SC', 'RS']
  const regiaoNordeste    = ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA']
  const regiaoNorte       = ['AM', 'PA', 'RR', 'RO', 'AC', 'AP']

  let pacPrice = 0, sedexPrice = 0, expressPrice = 0
  let pacDias = 0, sedexDias = 0

  if (regiaoSudeste.includes(uf)) {
    pacPrice = 12.90; sedexPrice = 28.90; expressPrice = 49.90
    pacDias = 4; sedexDias = 1
  } else if (regiaoSul.includes(uf)) {
    pacPrice = 15.90; sedexPrice = 34.90; expressPrice = 59.90
    pacDias = 5; sedexDias = 2
  } else if (regiaoCentroOeste.includes(uf)) {
    pacPrice = 18.90; sedexPrice = 38.90; expressPrice = 68.90
    pacDias = 6; sedexDias = 2
  } else if (regiaoNordeste.includes(uf)) {
    pacPrice = 22.90; sedexPrice = 44.90; expressPrice = 79.90
    pacDias = 8; sedexDias = 3
  } else if (regiaoNorte.includes(uf)) {
    pacPrice = 28.90; sedexPrice = 54.90; expressPrice = 98.90
    pacDias = 12; sedexDias = 5
  } else {
    pacPrice = 19.90; sedexPrice = 39.90; expressPrice = 69.90
    pacDias = 7; sedexDias = 3
  }

  const options: FreteOption[] = [
    {
      id: 'pac',
      nome: 'PAC',
      prazo: `${pacDias} dias úteis`,
      prazoExato: diasUteis(pacDias),
      preco: isFreteGratis ? 0 : pacPrice,
      gratis: isFreteGratis,
      icon: '📦',
      descricao: 'Correios PAC — Econômico',
    },
    {
      id: 'sedex',
      nome: 'SEDEX',
      prazo: sedexDias === 1 ? '1 dia útil' : `${sedexDias} dias úteis`,
      prazoExato: diasUteis(sedexDias),
      preco: isFreteGratis && sedexDias <= 1 ? 0 : sedexPrice,
      gratis: isFreteGratis && sedexDias <= 1,
      icon: '⚡',
      descricao: 'Correios SEDEX — Expresso',
    },
    {
      id: 'express',
      nome: 'Kainow Express',
      prazo: 'Entrega no mesmo dia',
      prazoExato: `Hoje, até ${new Date().getHours() < 14 ? '22:00' : '23:59'}`,
      preco: expressPrice,
      gratis: false,
      icon: '🚀',
      descricao: 'Disponível para sua região — Motoboy',
    },
  ]

  // Remove express para categorias pesadas
  const categoriasGrandes = ['casa', 'veiculos', 'esportes']
  if (categoria && categoriasGrandes.includes(categoria)) {
    return options.filter(o => o.id !== 'express')
  }

  return options
}

export function formatCep(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 8)
  if (cleaned.length > 5) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  return cleaned
}
