// Dados mockados da plataforma Kainow One

export interface ProductVariation {
  label: string        // ex: "Cor", "Tamanho", "Memória"
  options: VariationOption[]
}

export interface VariationOption {
  value: string        // ex: "Preto", "P", "128GB"
  priceModifier?: number   // +/- em relação ao preço base
  stockModifier?: number   // estoque desta variação
  colorHex?: string    // para variações de cor
  image?: string       // imagem específica desta variação
  unavailable?: boolean
}

export interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  helpfulCount: number
  photos?: string[]
  verified: boolean
  variantPurchased?: string
}

export interface QnA {
  id: string
  question: string
  questionDate: string
  questionUserName: string
  answer?: string
  answerDate?: string
  sellerName?: string
  helpful: number
}

export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviews: number
  sold: number
  image: string
  images: string[]
  category: string
  subcategory: string
  seller: string
  sellerReputation: string
  location: string
  freeShipping: boolean
  installments?: number
  badge?: string
  stock: number
  description: string
  specs: Record<string, string>
  featured?: boolean
  variations?: ProductVariation[]
  reviewsList?: Review[]
  qna?: QnA[]
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  subcategories: string[]
}

export interface Seller {
  id: string
  name: string
  reputation: string
  sales: number
  rating: number
  location: string
  since: string
}

export const categories: Category[] = [
  { id: "eletronicos",  name: "Eletrônicos",    icon: "📱", color: "bg-blue-100 text-blue-700",   subcategories: ["Celulares", "Notebooks", "Tablets", "TVs", "Fones de Ouvido"] },
  { id: "moda",         name: "Moda",            icon: "👗", color: "bg-pink-100 text-pink-700",   subcategories: ["Roupas Femininas", "Roupas Masculinas", "Calçados", "Acessórios", "Bolsas"] },
  { id: "casa",         name: "Casa & Jardim",   icon: "🏠", color: "bg-green-100 text-green-700", subcategories: ["Móveis", "Decoração", "Cozinha", "Jardim", "Ferramentas"] },
  { id: "esportes",     name: "Esportes",        icon: "⚽", color: "bg-orange-100 text-orange-700", subcategories: ["Futebol", "Academia", "Ciclismo", "Natação", "Corrida"] },
  { id: "veiculos",     name: "Veículos",        icon: "🚗", color: "bg-gray-100 text-gray-700",   subcategories: ["Carros", "Motos", "Caminhões", "Peças", "Acessórios"] },
  { id: "informatica",  name: "Informática",     icon: "💻", color: "bg-purple-100 text-purple-700", subcategories: ["Computadores", "Impressoras", "Redes", "Armazenamento", "Periféricos"] },
  { id: "brinquedos",   name: "Brinquedos",      icon: "🧸", color: "bg-yellow-100 text-yellow-700", subcategories: ["Bebês", "Jogos", "Bonecas", "Blocos", "Educativos"] },
  { id: "beleza",       name: "Beleza & Saúde",  icon: "💄", color: "bg-rose-100 text-rose-700",   subcategories: ["Perfumes", "Maquiagem", "Cabelo", "Skincare", "Vitaminas"] },
  { id: "livros",       name: "Livros & Mídia",  icon: "📚", color: "bg-indigo-100 text-indigo-700", subcategories: ["Livros", "Games", "Filmes", "Música", "Cursos"] },
  { id: "alimentos",    name: "Alimentos",       icon: "🍎", color: "bg-lime-100 text-lime-700",   subcategories: ["Orgânicos", "Bebidas", "Snacks", "Suplementos", "Gourmet"] },
]

export const products: Product[] = [

  // ══════════════════════════════════════
  // 📱 ELETRÔNICOS (IDs 1–5)
  // ══════════════════════════════════════
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB Titânio Natural",
    price: 7999.99, originalPrice: 9499.99, discount: 15,
    rating: 4.9, reviews: 1842, sold: 3200,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&h=800&fit=crop",
    ],
    category: "eletronicos", subcategory: "Celulares",
    seller: "TechStore Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 12,
    badge: "MAIS VENDIDO", stock: 45,
    description: "O iPhone 15 Pro Max traz o chip A17 Pro mais poderoso, câmera com zoom óptico de 5x, design em titânio ultrarresistente e bateria de longa duração.",
    specs: { "Armazenamento": "256GB", "RAM": "8GB", "Tela": "6.7\"", "Câmera": "48MP", "Bateria": "4422mAh", "5G": "Sim" },
    featured: true,
    variations: [
      {
        label: "Cor",
        options: [
          { value: "Titânio Natural", colorHex: "#C5B49A", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop" },
          { value: "Titânio Preto", colorHex: "#2C2C2E", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop", priceModifier: 0 },
          { value: "Titânio Branco", colorHex: "#F5F5F0", image: "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&h=800&fit=crop", priceModifier: 0 },
          { value: "Titânio Azul", colorHex: "#4A6FA5", priceModifier: 0 },
        ]
      },
      {
        label: "Memória",
        options: [
          { value: "256GB", priceModifier: 0 },
          { value: "512GB", priceModifier: 800 },
          { value: "1TB", priceModifier: 1800, stockModifier: 10 },
        ]
      }
    ],
    reviewsList: [
      { id: "r1", userName: "Carlos Mendes", userAvatar: "C", rating: 5, title: "Melhor celular que já tive!", comment: "A câmera é simplesmente incrível. Zoom de 5x perfeito para fotos à distância. A tela é belíssima e o desempenho é absurdo. Vale cada centavo!", date: "12 Mai 2025", helpfulCount: 47, verified: true, variantPurchased: "Titânio Natural / 256GB", photos: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop"] },
      { id: "r2", userName: "Ana Paula Lima", userAvatar: "A", rating: 5, title: "Superou todas as expectativas", comment: "Migrei do Android e não me arrependo. A integração com o Mac e iPad é perfeita. Bateria dura o dia inteiro com uso pesado.", date: "8 Mai 2025", helpfulCount: 32, verified: true, variantPurchased: "Titânio Preto / 512GB" },
      { id: "r3", userName: "Roberto Silva", userAvatar: "R", rating: 4, title: "Ótimo mas caro", comment: "O produto é excelente em todos os aspectos. Câmera, performance, tela. O único ponto negativo é o preço elevado, mas a qualidade justifica.", date: "3 Mai 2025", helpfulCount: 18, verified: true, variantPurchased: "Titânio Natural / 256GB" },
      { id: "r4", userName: "Fernanda Costa", userAvatar: "F", rating: 5, title: "Titânio faz diferença", comment: "O design em titânio é premium demais. Parece que é muito mais leve que as versões anteriores. A ação de câmera é um diferencial que uso muito.", date: "28 Abr 2025", helpfulCount: 24, verified: true, variantPurchased: "Titânio Azul / 512GB" },
      { id: "r5", userName: "Marcos Oliveira", userAvatar: "M", rating: 3, title: "Bom mas esperava mais", comment: "Para o preço cobrado esperava algo mais revolucionário. É incremental em relação ao 14 Pro Max. Se você tem o 14, pode esperar o 16.", date: "20 Abr 2025", helpfulCount: 31, verified: true, variantPurchased: "Titânio Natural / 256GB" },
    ],
    qna: [
      { id: "q1", question: "Tem versão desbloqueada para qualquer operadora?", questionDate: "5 Mai 2025", questionUserName: "Thiago F.", answer: "Sim! Todos os iPhones vendidos aqui são desbloqueados e funcionam com qualquer chip nacional.", answerDate: "5 Mai 2025", sellerName: "TechStore Brasil", helpful: 23 },
      { id: "q2", question: "Qual a diferença do 256GB para o 512GB?", questionDate: "2 Mai 2025", questionUserName: "Patrícia M.", answer: "Apenas o espaço de armazenamento. Performance, câmera e design são idênticos.", answerDate: "2 Mai 2025", sellerName: "TechStore Brasil", helpful: 15 },
      { id: "q3", question: "Vem com carregador na caixa?", questionDate: "28 Abr 2025", questionUserName: "Lucas R.", answer: "Infelizmente não. A Apple não inclui carregador desde o iPhone 12. Vem apenas o cabo USB-C.", answerDate: "28 Abr 2025", sellerName: "TechStore Brasil", helpful: 42 },
    ],
  },
  {
    id: "2",
    title: "Samsung Galaxy S24 Ultra 512GB Preto",
    price: 6299.00, originalPrice: 7499.00, discount: 16,
    rating: 4.8, reviews: 964, sold: 1800,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop",
    ],
    category: "eletronicos", subcategory: "Celulares",
    seller: "Samsung Oficial", sellerReputation: "Platinum",
    location: "Manaus, AM", freeShipping: true, installments: 12,
    badge: "OFERTA", stock: 30,
    description: "Galaxy S24 Ultra com S Pen integrada, câmera de 200MP, processador Snapdragon 8 Gen 3 e tela Dynamic AMOLED 2X de 6.8\".",
    specs: { "Armazenamento": "512GB", "RAM": "12GB", "Tela": "6.8\"", "Câmera": "200MP", "Bateria": "5000mAh", "5G": "Sim" },
    featured: true,
    variations: [
      {
        label: "Cor",
        options: [
          { value: "Preto Titânio", colorHex: "#1A1A1A" },
          { value: "Cinza Titânio", colorHex: "#808080", priceModifier: 0 },
          { value: "Violeta Titânio", colorHex: "#7B2FBE", priceModifier: 0 },
          { value: "Amarelo Titânio", colorHex: "#F5C518", priceModifier: 0 },
        ]
      },
      {
        label: "Memória",
        options: [
          { value: "256GB", priceModifier: -500 },
          { value: "512GB", priceModifier: 0 },
          { value: "1TB", priceModifier: 700 },
        ]
      }
    ],
    reviewsList: [
      { id: "r1", userName: "Guilherme Santos", userAvatar: "G", rating: 5, title: "A S Pen mudou minha vida", comment: "Sou arquiteto e uso a S Pen para fazer esboços e anotações. A câmera de 200MP é impressionante para projetos. Melhor upgrade que já fiz.", date: "10 Mai 2025", helpfulCount: 38, verified: true, variantPurchased: "Preto Titânio / 512GB" },
      { id: "r2", userName: "Isabela Rocha", userAvatar: "I", rating: 5, title: "Vídeo em 8K perfeito!", comment: "Gravo muito vídeo para meu canal e a qualidade em 8K é absurda. O AI Circle Search também é muito útil.", date: "7 Mai 2025", helpfulCount: 22, verified: true, variantPurchased: "Violeta Titânio / 512GB" },
      { id: "r3", userName: "Paulo Ferreira", userAvatar: "P", rating: 4, title: "Excelente porém pesado", comment: "O aparelho é top em tudo, mas 228g é pesado para uso diário com uma mão. A S Pen justifica o tamanho porém.", date: "1 Mai 2025", helpfulCount: 19, verified: true, variantPurchased: "Cinza Titânio / 1TB" },
    ],
    qna: [
      { id: "q1", question: "A S Pen é inclusa na caixa?", questionDate: "3 Mai 2025", questionUserName: "Renata K.", answer: "Sim! A S Pen vem inclusa e fica guardada dentro do próprio aparelho.", answerDate: "3 Mai 2025", sellerName: "Samsung Oficial", helpful: 34 },
      { id: "q2", question: "É compatível com carregador de 65W?", questionDate: "29 Abr 2025", questionUserName: "Diego M.", answer: "Sim, suporta carregamento rápido de até 45W com fio e 15W sem fio.", answerDate: "29 Abr 2025", sellerName: "Samsung Oficial", helpful: 12 },
    ],
  },
  {
    id: "3",
    title: "Smart TV Samsung 65\" QLED 4K Neo 2024",
    price: 4299.00, originalPrice: 5999.00, discount: 28,
    rating: 4.7, reviews: 1120, sold: 2100,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558089687-db69d0ddc734?w=800&h=800&fit=crop",
    ],
    category: "eletronicos", subcategory: "TVs",
    seller: "Samsung Oficial", sellerReputation: "Platinum",
    location: "Manaus, AM", freeShipping: true, installments: 18,
    badge: "SUPER OFERTA", stock: 25,
    description: "Smart TV QLED Neo com tecnologia Quantum Mini LED, HDR 2000 nits, 120Hz e sistema Tizen com IA integrada.",
    specs: { "Tamanho": "65\"", "Resolução": "4K 3840x2160", "HDR": "HDR 2000", "Taxa": "120Hz", "Smart": "Tizen" },
    featured: true,
  },
  {
    id: "4",
    title: "Fone Sony WH-1000XM5 Noise Cancelling",
    price: 1899.00, originalPrice: 2299.00, discount: 17,
    rating: 4.9, reviews: 4521, sold: 9800,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    ],
    category: "eletronicos", subcategory: "Fones de Ouvido",
    seller: "Sony Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 10,
    badge: "MAIS VENDIDO", stock: 55,
    description: "Fone over-ear com cancelamento de ruído líder do setor, 30h de bateria, qualidade de áudio premium e conforto excepcional.",
    specs: { "Tipo": "Over-ear", "Noise Cancelling": "Sim", "Bateria": "30h", "Driver": "30mm", "Bluetooth": "5.2" },
    featured: true,
    variations: [
      {
        label: "Cor",
        options: [
          { value: "Preto", colorHex: "#1A1A1A" },
          { value: "Prata", colorHex: "#C0C0C0", priceModifier: 0 },
          { value: "Azul Meia-Noite", colorHex: "#191970", priceModifier: 50 },
        ]
      }
    ],
    reviewsList: [
      { id: "r1", userName: "Amanda Torres", userAvatar: "A", rating: 5, title: "O melhor fone do mundo", comment: "Já testei vários e nenhum chega perto do XM5. O cancelamento de ruído é mágico. Uso no escritório aberto e simplesmente não ouço mais nada ao redor.", date: "9 Mai 2025", helpfulCount: 89, verified: true, variantPurchased: "Preto", photos: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"] },
      { id: "r2", userName: "Rafael Nunes", userAvatar: "R", rating: 5, title: "Qualidade de som incrível", comment: "O modo de som ambiente também é excelente. Posso ouvir músicas e ainda estar ciente do ambiente quando preciso. Conforto top para longas sessões.", date: "4 Mai 2025", helpfulCount: 45, verified: true, variantPurchased: "Prata" },
      { id: "r3", userName: "Juliana Martins", userAvatar: "J", rating: 4, title: "Perfeito mas caro", comment: "Qualidade inegável. O único ponto é que para chamadas no vento a qualidade cai um pouco. Para ouvir música e trabalhar, é incomparável.", date: "28 Abr 2025", helpfulCount: 28, verified: true, variantPurchased: "Preto" },
    ],
    qna: [
      { id: "q1", question: "Funciona sem fio com Bluetooth apenas?", questionDate: "6 Mai 2025", questionUserName: "Bruno A.", answer: "Sim! Conecta por Bluetooth 5.2. Também vem cabo P3 para uso com fio.", answerDate: "6 Mai 2025", sellerName: "Sony Brasil", helpful: 19 },
      { id: "q2", question: "Posso usar conectado e com NC ligado ao mesmo tempo?", questionDate: "1 Mai 2025", questionUserName: "Mariana L.", answer: "Com fio o NC funciona normalmente, mas consome a bateria para isso. Com bateria descarregada só funciona sem NC.", answerDate: "1 Mai 2025", sellerName: "Sony Brasil", helpful: 11 },
    ],
  },
  {
    id: "5",
    title: "Apple Watch Series 9 GPS 45mm Meia-Noite",
    price: 3199.00, originalPrice: 3699.00, discount: 14,
    rating: 4.8, reviews: 892, sold: 1540,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    ],
    category: "eletronicos", subcategory: "Wearables",
    seller: "Apple Premium", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 12,
    badge: "LANÇAMENTO", stock: 35,
    description: "Apple Watch Series 9 com chip S9, tela Always-On Retina, detecção de acidente, monitoramento de saúde avançado e Siri no pulso.",
    specs: { "Tela": "45mm LTPO OLED", "Chip": "S9", "GPS": "Sim", "Bateria": "18h", "Resistência": "WR50" },
    featured: true,
  },

  // ══════════════════════════════════════
  // 👗 MODA (IDs 6–10)
  // ══════════════════════════════════════
  {
    id: "6",
    title: "Tênis Nike Air Max 270 Masculino Preto",
    price: 649.90, originalPrice: 899.90, discount: 28,
    rating: 4.6, reviews: 3421, sold: 8900,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
    ],
    category: "moda", subcategory: "Calçados",
    seller: "Nike Store", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 6,
    badge: "MAIS VENDIDO", stock: 120,
    description: "Tênis Nike Air Max 270 com unidade Air de 270° na entressola, cabedal em mesh respirável e design icônico para uso casual.",
    specs: { "Material": "Mesh + Sintético", "Entressola": "Air Max 270°", "Cor": "Preto/Branco", "Gênero": "Masculino" },
    featured: true,
    variations: [
      {
        label: "Cor",
        options: [
          { value: "Preto/Branco", colorHex: "#1A1A1A" },
          { value: "Branco/Azul", colorHex: "#FFFFFF", priceModifier: 0 },
          { value: "Vermelho/Preto", colorHex: "#CC0000", priceModifier: 50 },
          { value: "Cinza/Laranja", colorHex: "#808080", priceModifier: 0 },
        ]
      },
      {
        label: "Tamanho",
        options: [
          { value: "38", priceModifier: 0 },
          { value: "39", priceModifier: 0 },
          { value: "40", priceModifier: 0 },
          { value: "41", priceModifier: 0 },
          { value: "42", priceModifier: 0 },
          { value: "43", priceModifier: 0 },
          { value: "44", priceModifier: 0 },
          { value: "45", priceModifier: 0, stockModifier: 8 },
          { value: "46", priceModifier: 0, stockModifier: 4, unavailable: false },
        ]
      }
    ],
    reviewsList: [
      { id: "r1", userName: "Leonardo Carvalho", userAvatar: "L", rating: 5, title: "Confortíssimo!", comment: "A unidade Air 270° faz toda a diferença. Uso para caminhadas e posso ficar horas sem sentir cansaço nos pés. Recomendo muito!", date: "11 Mai 2025", helpfulCount: 56, verified: true, variantPurchased: "Preto/Branco / 42" },
      { id: "r2", userName: "Camila Pereira", userAvatar: "C", rating: 4, title: "Lindo e confortável", comment: "O design é muito bonito. O conforto é excelente. Só acho que poderia ter mais opções de cores femininas.", date: "6 Mai 2025", helpfulCount: 33, verified: true, variantPurchased: "Branco/Azul / 39" },
    ],
    qna: [
      { id: "q1", question: "Vem com cadarço extra?", questionDate: "4 Mai 2025", questionUserName: "Henrique S.", answer: "Vem apenas o cadarço que está no tênis. Mas temos opções separadas de cadarço na loja!", answerDate: "4 Mai 2025", sellerName: "Nike Store", helpful: 8 },
      { id: "q2", question: "Qual número comprar se meu pé é largo?", questionDate: "30 Abr 2025", questionUserName: "Mônica B.", answer: "Para pés largos recomendamos subir meio número. O Air Max tem um formato um pouco estreito na ponta.", answerDate: "30 Abr 2025", sellerName: "Nike Store", helpful: 27 },
    ],
  },
  {
    id: "7",
    title: "Bolsa Feminina Couro Legítimo Marrom Caramelo",
    price: 389.90, originalPrice: 589.90, discount: 34,
    rating: 4.7, reviews: 2130, sold: 4500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop",
    ],
    category: "moda", subcategory: "Bolsas",
    seller: "Couros & Cia", sellerReputation: "Gold",
    location: "Franca, SP", freeShipping: true, installments: 4,
    badge: "OFERTA", stock: 80,
    description: "Bolsa feminina confeccionada em couro legítimo, forro interno em cetim, alça ajustável e fechamento com zíper dourado.",
    specs: { "Material": "Couro legítimo", "Cor": "Caramelo", "Medidas": "30x22x12cm", "Alça": "Ajustável", "Fecho": "Zíper" },
    featured: false,
  },
  {
    id: "8",
    title: "Vestido Midi Floral Feminino Verão 2025",
    price: 189.90, originalPrice: 279.90, discount: 32,
    rating: 4.5, reviews: 1876, sold: 6200,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop",
    ],
    category: "moda", subcategory: "Roupas Femininas",
    seller: "ModaFem Brasil", sellerReputation: "Gold",
    location: "Fortaleza, CE", freeShipping: true, installments: 3,
    badge: "TENDÊNCIA", stock: 200,
    description: "Vestido midi com estampa floral exclusiva, tecido leve e fresquinho em viscose, perfeito para o verão brasileiro.",
    specs: { "Material": "Viscose", "Comprimento": "Midi", "Estampa": "Floral", "Modelagem": "Soltinha", "Tamanhos": "P ao GG" },
    featured: false,
    variations: [
      {
        label: "Tamanho",
        options: [
          { value: "P", priceModifier: 0 },
          { value: "M", priceModifier: 0 },
          { value: "G", priceModifier: 0 },
          { value: "GG", priceModifier: 0 },
          { value: "XGG", priceModifier: 20 },
        ]
      },
      {
        label: "Estampa",
        options: [
          { value: "Floral Rosa", priceModifier: 0 },
          { value: "Floral Azul", priceModifier: 0 },
          { value: "Floral Vermelho", priceModifier: 0 },
          { value: "Floral Verde", priceModifier: 0 },
        ]
      }
    ],
    reviewsList: [
      { id: "r1", userName: "Bianca Souza", userAvatar: "B", rating: 5, title: "Perfeita para o verão!", comment: "O tecido é levíssimo e fresco. A estampa é linda na vida real. Usei numa festa na praia e recebi vários elogios!", date: "8 Mai 2025", helpfulCount: 41, verified: true, variantPurchased: "M / Floral Rosa", photos: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop"] },
      { id: "r2", userName: "Larissa Lima", userAvatar: "L", rating: 4, title: "Bonita mas transparente", comment: "O vestido é lindo e o caimento é ótimo. Precisa usar um sutiã adequado pois o tecido é um pouco transparente na luz forte.", date: "3 Mai 2025", helpfulCount: 29, verified: true, variantPurchased: "G / Floral Azul" },
    ],
  },
  {
    id: "9",
    title: "Camisa Social Masculina Slim Fit Oxford Branca",
    price: 149.90, originalPrice: 219.90, discount: 32,
    rating: 4.4, reviews: 3210, sold: 7800,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4d11?w=800&h=800&fit=crop",
    ],
    category: "moda", subcategory: "Roupas Masculinas",
    seller: "VesteMen", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 3,
    stock: 300,
    description: "Camisa social slim fit em tecido Oxford de alta qualidade, ideal para o ambiente profissional e eventos formais.",
    specs: { "Material": "Oxford 100% algodão", "Modelagem": "Slim Fit", "Cor": "Branco", "Gola": "Italiana", "Tamanhos": "P ao XXL" },
    featured: false,
    variations: [
      {
        label: "Cor",
        options: [
          { value: "Branca", colorHex: "#FFFFFF" },
          { value: "Azul claro", colorHex: "#AEC6CF", priceModifier: 0 },
          { value: "Rosa", colorHex: "#FFB6C1", priceModifier: 0 },
          { value: "Listrada", colorHex: "#6699CC", priceModifier: 10 },
        ]
      },
      {
        label: "Tamanho",
        options: [
          { value: "P", priceModifier: 0 },
          { value: "M", priceModifier: 0 },
          { value: "G", priceModifier: 0 },
          { value: "GG", priceModifier: 0 },
          { value: "XGG", priceModifier: 15 },
          { value: "XXL", priceModifier: 15, stockModifier: 15 },
        ]
      }
    ],
    reviewsList: [
      { id: "r1", userName: "Thiago Mendes", userAvatar: "T", rating: 5, title: "Qualidade impecável", comment: "Comprei 3 camisas. O tecido Oxford é encorpado, não amassa fácil e o corte slim fica perfeito. Ótimo custo-benefício.", date: "10 Mai 2025", helpfulCount: 34, verified: true, variantPurchased: "M / Branca" },
    ],
  },
  {
    id: "10",
    title: "Óculos de Sol Ray-Ban Aviador Dourado",
    price: 699.00, originalPrice: 899.00, discount: 22,
    rating: 4.8, reviews: 5430, sold: 11200,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop",
    ],
    category: "moda", subcategory: "Acessórios",
    seller: "Ray-Ban Oficial", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 6,
    badge: "CLÁSSICO", stock: 150,
    description: "Óculos de sol Ray-Ban Aviador original com armação dourada e lentes verdes G-15, proteção UV400 certificada.",
    specs: { "Modelo": "Aviador RB3025", "Armação": "Metal dourado", "Lente": "Verde G-15", "Proteção": "UV400", "Garantia": "2 anos" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 🏠 CASA & JARDIM (IDs 11–15)
  // ══════════════════════════════════════
  {
    id: "11",
    title: "Sofá 3 Lugares Retrátil Reclinável Suede Cinza",
    price: 2199.00, originalPrice: 3499.00, discount: 37,
    rating: 4.4, reviews: 876, sold: 1900,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop",
    ],
    category: "casa", subcategory: "Móveis",
    seller: "MoveisTop", sellerReputation: "Gold",
    location: "Belo Horizonte, MG", freeShipping: true, installments: 18,
    badge: "LIQUIDAÇÃO", stock: 18,
    description: "Sofá 3 lugares com sistema retrátil e reclinável, revestimento em suede de alta qualidade, estrutura em madeira maciça.",
    specs: { "Medidas": "220x90x95cm", "Material": "Suede", "Cor": "Cinza", "Lugares": "3", "Sistema": "Retrátil/Reclinável" },
    featured: false,
  },
  {
    id: "12",
    title: "Cafeteira Nespresso Vertuo Pop + 40 Cápsulas",
    price: 489.00, originalPrice: 699.00, discount: 30,
    rating: 4.5, reviews: 2156, sold: 4300,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&h=800&fit=crop",
    ],
    category: "casa", subcategory: "Cozinha",
    seller: "Nespresso Brasil", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 6,
    badge: "PROMOÇÃO", stock: 60,
    description: "Cafeteira Nespresso Vertuo Pop com tecnologia Centrifusion, cápsulas inteligentes e 5 tamanhos de xícara. Inclui 40 cápsulas variadas.",
    specs: { "Capacidade": "1.1L", "Potência": "1260W", "Pressão": "19 bar", "Cápsulas": "Vertuo", "Cores": "5 opções" },
    featured: false,
  },
  {
    id: "13",
    title: "Kit Jardim Ferramentas 12 Peças Tramontina",
    price: 179.90, originalPrice: 249.90, discount: 28,
    rating: 4.3, reviews: 1230, sold: 2800,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&h=800&fit=crop",
    ],
    category: "casa", subcategory: "Jardim",
    seller: "Tramontina Oficial", sellerReputation: "Platinum",
    location: "Carlos Barbosa, RS", freeShipping: true, installments: 3,
    stock: 150,
    description: "Kit completo com 12 ferramentas de jardim em aço inoxidável com cabo de borracha ergonômico. Inclui enxada, pá, ancinho e mais.",
    specs: { "Peças": "12", "Material": "Aço inoxidável", "Cabo": "Borracha ergonômica", "Garantia": "1 ano", "Inclui": "Bolsa organizadora" },
    featured: false,
  },
  {
    id: "14",
    title: "Luminária de Mesa LED Articulável Touch Dimmer",
    price: 249.00, originalPrice: 349.00, discount: 29,
    rating: 4.6, reviews: 980, sold: 3100,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop",
    ],
    category: "casa", subcategory: "Decoração",
    seller: "LuzCasa", sellerReputation: "Gold",
    location: "Curitiba, PR", freeShipping: true, installments: 4,
    badge: "DESTAQUE", stock: 75,
    description: "Luminária de mesa LED articulável com controle touch, 3 temperaturas de cor, dimmer de 5 níveis e porta USB integrada.",
    specs: { "Potência": "12W LED", "Temperatura": "3000K/4500K/6500K", "Dimmer": "5 níveis", "USB": "Sim", "Articulação": "360°" },
    featured: false,
  },
  {
    id: "15",
    title: "Jogo de Panelas Antiaderente 5 Peças Tramontina",
    price: 399.00, originalPrice: 599.00, discount: 33,
    rating: 4.7, reviews: 3450, sold: 7600,
    image: "https://images.unsplash.com/photo-1584990347449-a2d4c2c044a9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584990347449-a2d4c2c044a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop",
    ],
    category: "casa", subcategory: "Cozinha",
    seller: "Tramontina Oficial", sellerReputation: "Platinum",
    location: "Carlos Barbosa, RS", freeShipping: true, installments: 6,
    badge: "MAIS VENDIDO", stock: 200,
    description: "Jogo de panelas com revestimento antiaderente Teflon Platinum, tampa de vidro e cabos ergonômicos. Compatível com fogão a indução.",
    specs: { "Peças": "5 (12, 16, 20, 24cm + frigideira)", "Revestimento": "Teflon Platinum", "Indução": "Sim", "Material": "Alumínio", "Garantia": "5 anos" },
    featured: false,
  },

  // ══════════════════════════════════════
  // ⚽ ESPORTES (IDs 16–20)
  // ══════════════════════════════════════
  {
    id: "16",
    title: "Bicicleta Elétrica Trek FX+ 2 Disc 2024",
    price: 8999.00, originalPrice: 10999.00, discount: 18,
    rating: 4.9, reviews: 234, sold: 412,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=800&fit=crop",
    ],
    category: "esportes", subcategory: "Ciclismo",
    seller: "Trek Brasil", sellerReputation: "Platinum",
    location: "Curitiba, PR", freeShipping: false, installments: 18,
    badge: "PREMIUM", stock: 5,
    description: "Bicicleta elétrica urbana com motor Bosch Performance 400Wh, até 85km de autonomia, display integrado e freios a disco hidráulicos.",
    specs: { "Motor": "Bosch Performance", "Bateria": "400Wh", "Autonomia": "85km", "Velocidade Max": "25km/h", "Marcha": "10v Shimano" },
    featured: false,
  },
  {
    id: "17",
    title: "Bola de Futebol Adidas Al Rihla Oficial Copa",
    price: 499.90, originalPrice: 699.90, discount: 29,
    rating: 4.8, reviews: 1560, sold: 4200,
    image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=800&fit=crop",
    ],
    category: "esportes", subcategory: "Futebol",
    seller: "Adidas Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 6,
    badge: "OFERTA", stock: 80,
    description: "Bola oficial Adidas Al Rihla em couro sintético de alta performance, com câmara de ar butílica para máxima durabilidade.",
    specs: { "Tamanho": "5", "Material": "Couro sintético", "Câmara": "Butílica", "Peso": "420-445g", "Circunferência": "68-70cm" },
    featured: false,
  },
  {
    id: "18",
    title: "Esteira Elétrica Pro 110V 12km/h Inclinação",
    price: 2899.00, originalPrice: 3999.00, discount: 27,
    rating: 4.5, reviews: 567, sold: 920,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=800&h=800&fit=crop",
    ],
    category: "esportes", subcategory: "Academia",
    seller: "FitShop Pro", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 12,
    badge: "PROMOÇÃO", stock: 20,
    description: "Esteira elétrica com motor de 2.5HP, velocidade máxima de 12km/h, 15 programas de treino, inclinação automática e display LCD.",
    specs: { "Motor": "2.5HP", "Velocidade": "0.8 a 12 km/h", "Inclinação": "3 níveis", "Programas": "15", "Peso Max": "120kg" },
    featured: false,
  },
  {
    id: "19",
    title: "Kit Natação Speedo Completo Óculos + Touca",
    price: 159.90, originalPrice: 219.90, discount: 27,
    rating: 4.4, reviews: 890, sold: 2100,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=800&fit=crop",
    ],
    category: "esportes", subcategory: "Natação",
    seller: "Speedo Brasil", sellerReputation: "Gold",
    location: "Rio de Janeiro, RJ", freeShipping: true, installments: 3,
    stock: 120,
    description: "Kit natação Speedo com óculos de competição lentes polarizadas anti-reflexo e touca em silicone anatômico.",
    specs: { "Óculos": "Lente polarizada", "Touca": "Silicone anatômico", "Proteção": "UV100%", "Anti-embaçante": "Sim", "Faixa": "Inclusa" },
    featured: false,
  },
  {
    id: "20",
    title: "Tênis de Corrida Asics Gel-Nimbus 26 Masculino",
    price: 899.90, originalPrice: 1199.90, discount: 25,
    rating: 4.8, reviews: 2340, sold: 5600,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop",
    ],
    category: "esportes", subcategory: "Corrida",
    seller: "Asics Store", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 8,
    badge: "LANÇAMENTO", stock: 60,
    description: "Tênis de corrida Asics Gel-Nimbus 26 com tecnologia GEL avançada, amortecimento FF BLAST+ e palmilha ortopédica removível.",
    specs: { "Tecnologia": "GEL + FF BLAST+", "Cabedal": "Engineered Mesh", "Solado": "AHAR+", "Drop": "13mm", "Peso": "310g" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 🚗 VEÍCULOS (IDs 21–25)
  // ══════════════════════════════════════
  {
    id: "21",
    title: "Capacete Moto Shark Spartan GT Carbono",
    price: 1299.00, originalPrice: 1799.00, discount: 28,
    rating: 4.9, reviews: 432, sold: 870,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=800&fit=crop",
    ],
    category: "veiculos", subcategory: "Motos",
    seller: "MotoSafe Brasil", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 10,
    badge: "PREMIUM", stock: 25,
    description: "Capacete integral em fibra de carbono com sistema de ventilação VentiStream, viseira solar interna retrátil e preparado para Bluetooth.",
    specs: { "Material": "Fibra de carbono", "Norma": "DOT + ECE 22.06", "Viseira": "Anti-risco + Pinlock", "Peso": "1.35kg", "Tamanhos": "55 ao 64" },
    featured: false,
  },
  {
    id: "22",
    title: "Pneu Michelin Pilot Sport 4 225/45 R17",
    price: 689.90, originalPrice: 899.90, discount: 23,
    rating: 4.7, reviews: 310, sold: 640,
    image: "https://images.unsplash.com/photo-1558618047-3eedc0c56f80?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618047-3eedc0c56f80?w=800&h=800&fit=crop",
    ],
    category: "veiculos", subcategory: "Peças",
    seller: "PneuMax", sellerReputation: "Gold",
    location: "Guarulhos, SP", freeShipping: false, installments: 6,
    stock: 40,
    description: "Pneu Michelin Pilot Sport 4 de alto desempenho, com tecnologia Bi-Compound para aderência superior em pista seca e molhada.",
    specs: { "Medida": "225/45 R17 91Y", "Índice velocidade": "Y (300km/h)", "Tipo": "Verão", "Tecnologia": "Bi-Compound", "Garantia": "5 anos" },
    featured: false,
  },
  {
    id: "23",
    title: "GPS Garmin DriveSmart 65 Tela 6.95\"",
    price: 1099.00, originalPrice: 1499.00, discount: 27,
    rating: 4.6, reviews: 520, sold: 1100,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
    ],
    category: "veiculos", subcategory: "Acessórios",
    seller: "Garmin Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 8,
    badge: "LANÇAMENTO", stock: 30,
    description: "GPS Garmin DriveSmart 65 com tela widescreen de 6.95\", alertas de trânsito em tempo real, assistente de voz e mapas do Brasil completos.",
    specs: { "Tela": "6.95\" touch", "Mapas": "Brasil + América do Sul", "Tráfego": "Tempo real", "Memória": "16GB", "Bluetooth": "Sim" },
    featured: false,
  },
  {
    id: "24",
    title: "Câmera de Ré Universal 170° Visão Noturna",
    price: 189.90, originalPrice: 299.90, discount: 37,
    rating: 4.4, reviews: 780, sold: 2300,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=800&fit=crop",
    ],
    category: "veiculos", subcategory: "Acessórios",
    seller: "AutoTech", sellerReputation: "Silver",
    location: "São Paulo, SP", freeShipping: true, installments: 3,
    badge: "PROMOÇÃO", stock: 200,
    description: "Câmera de ré universal HD com ângulo de 170°, visão noturna por LED infrared, resistente à água (IP68) e instalação fácil.",
    specs: { "Resolução": "1080p HD", "Ângulo": "170°", "Visão Noturna": "LED IR", "Proteção": "IP68", "Instalação": "Universal" },
    featured: false,
  },
  {
    id: "25",
    title: "Multímetro Digital Profissional Fluke 117",
    price: 749.00, originalPrice: 999.00, discount: 25,
    rating: 4.9, reviews: 280, sold: 560,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=800&fit=crop",
    ],
    category: "veiculos", subcategory: "Peças",
    seller: "Fluke Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 6,
    stock: 45,
    description: "Multímetro digital Fluke 117 com medição sem contato (VoltAlert), leitura automática de alcance e display retroiluminado.",
    specs: { "Voltagem CA": "600V", "Corrente CC": "10A", "Resistência": "40kΩ", "CAT III": "600V", "Display": "6000 contagens" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 💻 INFORMÁTICA (IDs 26–30)
  // ══════════════════════════════════════
  {
    id: "26",
    title: "Notebook Dell XPS 15 Core i9 32GB 1TB RTX",
    price: 12499.00, originalPrice: 14999.00, discount: 17,
    rating: 4.7, reviews: 523, sold: 890,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
    ],
    category: "informatica", subcategory: "Notebooks",
    seller: "Dell Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 18,
    badge: "LANÇAMENTO", stock: 12,
    description: "Notebook premium com processador Intel Core i9, tela OLED 4K de 15.6\", design ultrafino e performance extrema para criação de conteúdo.",
    specs: { "Processador": "i9-13900H", "RAM": "32GB DDR5", "SSD": "1TB NVMe", "Tela": "15.6\" OLED 4K", "GPU": "RTX 4060" },
    featured: true,
  },
  {
    id: "27",
    title: "Monitor Ultrawide LG 34\" Curvo 144Hz QHD",
    price: 3299.00, originalPrice: 4499.00, discount: 27,
    rating: 4.8, reviews: 890, sold: 1650,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1625225233840-695456021cde?w=800&h=800&fit=crop",
    ],
    category: "informatica", subcategory: "Periféricos",
    seller: "LG Store", sellerReputation: "Platinum",
    location: "Manaus, AM", freeShipping: true, installments: 12,
    badge: "HOT", stock: 22,
    description: "Monitor ultrawide curvo 34\" QHD 3440x1440, painel IPS com 144Hz, 1ms, HDR400, AMD FreeSync Premium e USB-C 96W.",
    specs: { "Tamanho": "34\" Curvo", "Resolução": "3440x1440 QHD", "Taxa": "144Hz", "Painel": "IPS", "Tempo resp.": "1ms" },
    featured: false,
  },
  {
    id: "28",
    title: "SSD Samsung 990 Pro 2TB NVMe PCIe 5.0",
    price: 1199.00, originalPrice: 1599.00, discount: 25,
    rating: 4.9, reviews: 1240, sold: 3400,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop",
    ],
    category: "informatica", subcategory: "Armazenamento",
    seller: "Samsung Oficial", sellerReputation: "Platinum",
    location: "Manaus, AM", freeShipping: true, installments: 8,
    badge: "TOP", stock: 80,
    description: "SSD Samsung 990 Pro 2TB NVMe PCIe 5.0 com velocidade de leitura sequencial de até 14.700 MB/s, ideal para workstations e gaming.",
    specs: { "Capacidade": "2TB", "Interface": "PCIe 5.0 NVMe", "Leitura": "14.700 MB/s", "Escrita": "13.000 MB/s", "Garantia": "5 anos" },
    featured: false,
  },
  {
    id: "29",
    title: "Teclado Mecânico Gamer Razer BlackWidow V4",
    price: 799.00, originalPrice: 1099.00, discount: 27,
    rating: 4.7, reviews: 670, sold: 1800,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=800&fit=crop",
    ],
    category: "informatica", subcategory: "Periféricos",
    seller: "Razer Store", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 6,
    badge: "GAMER", stock: 45,
    description: "Teclado mecânico full-size com switches Razer Green tácteis, RGB Chroma per-key, reposa-pulso magnético e media keys dedicadas.",
    specs: { "Switch": "Razer Green", "RGB": "Chroma per-key", "Layout": "ABNT2", "Anti-ghosting": "100%", "Cabo": "USB-A braided" },
    featured: false,
  },
  {
    id: "30",
    title: "Impressora Multifuncional HP LaserJet Pro Color",
    price: 1899.00, originalPrice: 2499.00, discount: 24,
    rating: 4.5, reviews: 430, sold: 980,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop",
    ],
    category: "informatica", subcategory: "Impressoras",
    seller: "HP Store", sellerReputation: "Platinum",
    location: "Barueri, SP", freeShipping: true, installments: 10,
    stock: 15,
    description: "Impressora laser colorida com impressão, cópia, digitalização e fax. Wi-Fi duplo, Ethernet, USB e impressão mobile via HP Smart.",
    specs: { "Tipo": "Laser colorida", "Velocidade": "22 ppm", "Resolução": "600x600 dpi", "Wi-Fi": "Dual band", "Papel": "A4/A5/Envelope" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 🧸 BRINQUEDOS (IDs 31–35)
  // ══════════════════════════════════════
  {
    id: "31",
    title: "PlayStation 5 Console + 2 Controles DualSense",
    price: 3999.00, originalPrice: 4599.00, discount: 13,
    rating: 4.9, reviews: 2341, sold: 5600,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop",
    ],
    category: "brinquedos", subcategory: "Games",
    seller: "Sony Store", sellerReputation: "Platinum",
    location: "Rio de Janeiro, RJ", freeShipping: true, installments: 12,
    badge: "HOT", stock: 8,
    description: "Console PS5 com leitor de disco, 825GB SSD ultrarrápido, 2 controles DualSense com feedback háptico e gatilhos adaptativos.",
    specs: { "CPU": "AMD Zen 2", "GPU": "10.28 TFLOPS", "SSD": "825GB", "RAM": "16GB GDDR6", "4K": "Sim", "Ray Tracing": "Sim" },
    featured: true,
  },
  {
    id: "32",
    title: "LEGO Technic Bugatti Chiron 3599 Peças",
    price: 2299.00, originalPrice: 2999.00, discount: 23,
    rating: 4.9, reviews: 1240, sold: 2800,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop",
    ],
    category: "brinquedos", subcategory: "Blocos",
    seller: "LEGO Store", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 12,
    badge: "EXCLUSIVO", stock: 20,
    description: "LEGO Technic Bugatti Chiron com 3599 peças, motor W16 funcional, caixa de câmbio de 8 velocidades e aerofólio ajustável.",
    specs: { "Peças": "3599", "Escala": "1:8", "Medidas": "56x25x15cm", "Idade": "18+", "Inclui": "Manual 400 páginas" },
    featured: false,
  },
  {
    id: "33",
    title: "Boneca Baby Alive Chora de Verdade Fala 50+",
    price: 329.90, originalPrice: 449.90, discount: 27,
    rating: 4.5, reviews: 2890, sold: 6700,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop",
    ],
    category: "brinquedos", subcategory: "Bonecas",
    seller: "Hasbro Brasil", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "PROMOÇÃO", stock: 100,
    description: "Boneca Baby Alive interativa que fala mais de 50 frases, chora lágrimas, come, bebe e precisa de cuidados como um bebê real.",
    specs: { "Altura": "30cm", "Frases": "50+", "Idioma": "Português BR", "Pilhas": "4 AA (inclusas)", "Idade": "3+ anos" },
    featured: false,
  },
  {
    id: "34",
    title: "Jogo de Tabuleiro Catan Edição Especial",
    price: 249.90, originalPrice: 329.90, discount: 24,
    rating: 4.8, reviews: 1560, sold: 3900,
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=800&fit=crop",
    ],
    category: "brinquedos", subcategory: "Jogos",
    seller: "Galápagos Jogos", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "CLÁSSICO", stock: 60,
    description: "Catan edição especial com peças tridimensionais em resina colorida, cartas plastificadas e tabuleiro modular de alta qualidade.",
    specs: { "Jogadores": "3 a 4", "Duração": "60-120 min", "Idioma": "Português BR", "Idade": "10+", "Expansões": "Compatível" },
    featured: false,
  },
  {
    id: "35",
    title: "Kit Educativo Robótica Arduino STEM Infantil",
    price: 399.90, originalPrice: 549.90, discount: 27,
    rating: 4.7, reviews: 430, sold: 980,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=800&fit=crop",
    ],
    category: "brinquedos", subcategory: "Educativos",
    seller: "STEM Kids", sellerReputation: "Gold",
    location: "Campinas, SP", freeShipping: true, installments: 6,
    badge: "EDUCATIVO", stock: 40,
    description: "Kit de robótica educacional com placa Arduino, 50+ componentes eletrônicos, sensores, LEDs e guia de 30 projetos passo a passo.",
    specs: { "Placa": "Arduino Uno R3", "Componentes": "50+", "Projetos": "30", "Idioma": "Português BR", "Idade": "9+ anos" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 💄 BELEZA & SAÚDE (IDs 36–40)
  // ══════════════════════════════════════
  {
    id: "36",
    title: "Perfume Chanel N°5 Eau de Parfum 100ml",
    price: 1299.00, originalPrice: 1599.00, discount: 19,
    rating: 4.9, reviews: 5632, sold: 12000,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop",
    ],
    category: "beleza", subcategory: "Perfumes",
    seller: "Chanel Oficial", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 10,
    badge: "CLÁSSICO", stock: 200,
    description: "O icônico Chanel N°5 em Eau de Parfum, uma fragrância floral-aldeídica atemporal criada em 1921. Símbolo máximo de elegância.",
    specs: { "Concentração": "Eau de Parfum", "Volume": "100ml", "Família": "Floral Aldeídica", "Fixação": "Alta", "Projeção": "Média-Alta" },
    featured: false,
  },
  {
    id: "37",
    title: "Paleta de Sombras Urban Decay Naked 3 Original",
    price: 399.00, originalPrice: 549.00, discount: 27,
    rating: 4.8, reviews: 3210, sold: 7800,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    ],
    category: "beleza", subcategory: "Maquiagem",
    seller: "Urban Decay Brasil", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "ORIGINAL", stock: 90,
    description: "Paleta Naked 3 com 12 sombras em tons rosados e neutros, acabamento matte e brilhante. Acompanha pincel duplo profissional.",
    specs: { "Sombras": "12", "Tons": "Rosados neutros", "Acabamento": "Matte e brilhante", "Acompanha": "Pincel duplo", "Validade": "36 meses" },
    featured: false,
  },
  {
    id: "38",
    title: "Secador de Cabelo Taiff Profissional 3200W Íon",
    price: 349.90, originalPrice: 499.90, discount: 30,
    rating: 4.7, reviews: 2120, sold: 5400,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop",
    ],
    category: "beleza", subcategory: "Cabelo",
    seller: "Taiff Brasil", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "PROFISSIONAL", stock: 75,
    description: "Secador profissional 3200W com tecnologia de íons negativos, 2 velocidades, 3 temperaturas e bico concentrador incluso.",
    specs: { "Potência": "3200W", "Tecnologia": "Íon negativo", "Velocidades": "2", "Temperaturas": "3", "Tensão": "Bivolt" },
    featured: false,
  },
  {
    id: "39",
    title: "Kit Skincare Vitamina C La Roche-Posay 4 Itens",
    price: 299.90, originalPrice: 429.90, discount: 30,
    rating: 4.8, reviews: 1890, sold: 4500,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop",
    ],
    category: "beleza", subcategory: "Skincare",
    seller: "La Roche-Posay", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "KIT", stock: 120,
    description: "Kit completo de skincare com sérum vitamina C 10%, protetor solar FPS60, gel de limpeza suave e hidratante facial para pele radiante.",
    specs: { "Sérum": "Vitamina C 10% 30ml", "Protetor": "FPS60 50ml", "Limpeza": "Gel suave 150ml", "Hidratante": "Efaclar 40ml", "Pele": "Todos os tipos" },
    featured: false,
  },
  {
    id: "40",
    title: "Whey Protein Optimum Nutrition Gold 2kg Chocolate",
    price: 449.90, originalPrice: 599.90, discount: 25,
    rating: 4.9, reviews: 8740, sold: 22000,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop",
    ],
    category: "beleza", subcategory: "Vitaminas",
    seller: "Optimum Nutrition BR", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "MAIS VENDIDO", stock: 300,
    description: "Whey Protein concentrado Gold Standard com 24g de proteína por dose, aminoácidos essenciais e sabor chocolate intenso.",
    specs: { "Proteína/dose": "24g", "Doses": "~74", "BCAA": "5.5g", "Glutamina": "4g", "Açúcar": "Menos de 3g/dose" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 📚 LIVROS & MÍDIA (IDs 41–45)
  // ══════════════════════════════════════
  {
    id: "41",
    title: "Box Harry Potter Edição Especial 7 Volumes",
    price: 359.90, originalPrice: 499.90, discount: 28,
    rating: 4.9, reviews: 12450, sold: 32000,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop",
    ],
    category: "livros", subcategory: "Livros",
    seller: "Rocco Editora", sellerReputation: "Platinum",
    location: "Rio de Janeiro, RJ", freeShipping: true, installments: 4,
    badge: "BEST-SELLER", stock: 500,
    description: "Box completo com os 7 volumes de Harry Potter em edição especial capa dura, com ilustrações exclusivas e slipcase colecionável.",
    specs: { "Volumes": "7", "Capa": "Dura com slipcase", "Idioma": "Português BR", "Editora": "Rocco", "Páginas": "4.100 total" },
    featured: false,
  },
  {
    id: "42",
    title: "The Legend of Zelda: Tears of the Kingdom Nintendo",
    price: 349.90, originalPrice: 449.90, discount: 22,
    rating: 4.9, reviews: 3240, sold: 8900,
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=800&fit=crop",
    ],
    category: "livros", subcategory: "Games",
    seller: "Nintendo Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "GOTY", stock: 60,
    description: "Zelda Tears of the Kingdom para Nintendo Switch, vencedor do Game of the Year 2023. Mundo aberto épico com mecânicas únicas de criação.",
    specs: { "Plataforma": "Nintendo Switch", "Gênero": "Action-Adventure", "Jogadores": "1", "Idioma": "Português BR", "Classificação": "10+" },
    featured: false,
  },
  {
    id: "43",
    title: "Curso Online Full Stack React + Node Vitalício",
    price: 399.00, originalPrice: 1999.00, discount: 80,
    rating: 4.8, reviews: 4560, sold: 15000,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop",
    ],
    category: "livros", subcategory: "Cursos",
    seller: "DevCode Academy", sellerReputation: "Gold",
    location: "Online", freeShipping: true, installments: 4,
    badge: "80% OFF", stock: 9999,
    description: "Curso completo de desenvolvimento web Full Stack com React.js, Node.js, MongoDB, TypeScript e deploy na nuvem. 400+ horas de conteúdo.",
    specs: { "Horas": "400+", "Módulos": "52", "Acesso": "Vitalício", "Certificado": "Sim", "Projetos": "20 práticos" },
    featured: false,
  },
  {
    id: "44",
    title: "Vinil LP The Beatles Abbey Road 50th Anniversary",
    price: 289.90, originalPrice: 389.90, discount: 26,
    rating: 4.9, reviews: 1230, sold: 2900,
    image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&h=800&fit=crop",
    ],
    category: "livros", subcategory: "Música",
    seller: "Vinil Record Store", sellerReputation: "Gold",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "COLECIONÁVEL", stock: 30,
    description: "LP Abbey Road dos Beatles na edição comemorativa de 50 anos, remasterizado por Giles Martin em vinilato 180g.",
    specs: { "Formato": "2xLP 33rpm", "Peso": "180g", "Faixa": "17 faixas remasterizadas", "Inclui": "Pôster + encarte", "Edição": "50th Anniversary" },
    featured: false,
  },
  {
    id: "45",
    title: "Blu-ray Box Breaking Bad Série Completa 5 Temp",
    price: 299.90, originalPrice: 399.90, discount: 25,
    rating: 4.9, reviews: 2100, sold: 4800,
    image: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=800&h=800&fit=crop",
    ],
    category: "livros", subcategory: "Filmes",
    seller: "Sony Pictures Store", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "COMPLETO", stock: 45,
    description: "Box Blu-ray com as 5 temporadas completas de Breaking Bad, 62 episódios em fullHD com extras e making-of exclusivos.",
    specs: { "Discos": "16 Blu-rays", "Temporadas": "5 completas", "Episódios": "62", "Áudio": "Português + Inglês", "Extras": "30+ horas" },
    featured: false,
  },

  // ══════════════════════════════════════
  // 🍎 ALIMENTOS (IDs 46–50)
  // ══════════════════════════════════════
  {
    id: "46",
    title: "Café Especial Único Fazenda Serra Negra 500g",
    price: 89.90, originalPrice: 119.90, discount: 25,
    rating: 4.9, reviews: 3210, sold: 8900,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop",
    ],
    category: "alimentos", subcategory: "Gourmet",
    seller: "Café Serra Negra", sellerReputation: "Gold",
    location: "Carmo de Minas, MG",
    freeShipping: true, installments: 2,
    badge: "ESPECIAL 92pts", stock: 400,
    description: "Café de origem única da Fazenda Serra Negra, notas de caramelo, chocolate e castanha. Pontuação 92 pontos SCA. Torrado artesanalmente.",
    specs: { "Pontuação": "92 SCA", "Origem": "Carmo de Minas, MG", "Processo": "Natural", "Torra": "Média", "Peso líq.": "500g" },
    featured: false,
  },
  {
    id: "47",
    title: "Kit Churrasco Premium Picanha + Costela 5kg",
    price: 299.90, originalPrice: 399.90, discount: 25,
    rating: 4.8, reviews: 1890, sold: 4200,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=800&fit=crop",
    ],
    category: "alimentos", subcategory: "Gourmet",
    seller: "Carnes Frias Premium", sellerReputation: "Gold",
    location: "Goiânia, GO", freeShipping: true, installments: 3,
    badge: "CARNE PREMIUM", stock: 60,
    description: "Kit churrasco premium com 2,5kg de picanha maturada e 2,5kg de costela bovina. Carnes selecionadas, embaladas a vácuo e entregues resfriadas.",
    specs: { "Picanha": "2.5kg maturada", "Costela": "2.5kg bovina", "Total": "5kg", "Embalagem": "Vácuo resfriado", "Validade": "7 dias" },
    featured: false,
  },
  {
    id: "48",
    title: "Whey Isolado Bodybuilders 100% Isolate 1,8kg",
    price: 379.90, originalPrice: 499.90, discount: 24,
    rating: 4.7, reviews: 4560, sold: 12000,
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800&h=800&fit=crop",
    ],
    category: "alimentos", subcategory: "Suplementos",
    seller: "Bodybuilders Brasil", sellerReputation: "Platinum",
    location: "São Paulo, SP", freeShipping: true, installments: 4,
    badge: "MAIS VENDIDO", stock: 500,
    description: "Whey Protein Isolado com 96% de proteína por porção, zero lactose, zero gordura, zero açúcar. Ideal para definição muscular.",
    specs: { "Proteína/dose": "26g", "Carboidratos": "0g", "Gorduras": "0g", "Lactose": "Zero", "Doses": "~60" },
    featured: false,
  },
  {
    id: "49",
    title: "Mix Orgânico de Castanhas e Frutas Secas 1kg",
    price: 129.90, originalPrice: 179.90, discount: 28,
    rating: 4.6, reviews: 1200, sold: 3400,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop",
    ],
    category: "alimentos", subcategory: "Orgânicos",
    seller: "NaturaFood", sellerReputation: "Gold",
    location: "Campinas, SP", freeShipping: true, installments: 2,
    badge: "ORGÂNICO", stock: 200,
    description: "Mix premium com castanha de caju, amêndoas, nozes, uva passa e damasco, todos orgânicos certificados. Sem conservantes ou aditivos.",
    specs: { "Peso": "1kg", "Itens": "Castanhas + frutas secas", "Certificação": "Orgânico IBD", "Sem": "Glúten, conservantes", "Validade": "6 meses" },
    featured: false,
  },
  {
    id: "50",
    title: "Cerveja Artesanal Badebec IPA Pack 12 Long Neck",
    price: 149.90, originalPrice: 199.90, discount: 25,
    rating: 4.7, reviews: 2340, sold: 5600,
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=800&fit=crop",
    ],
    category: "alimentos", subcategory: "Bebidas",
    seller: "Badebec Brewery", sellerReputation: "Gold",
    location: "Blumenau, SC", freeShipping: true, installments: 2,
    badge: "ARTESANAL", stock: 300,
    description: "IPA artesanal premiada com lúpulos Cascade e Citra, aroma tropical e final amargo equilibrado. Pack com 12 long necks de 355ml.",
    specs: { "Estilo": "India Pale Ale", "Teor alcoólico": "6.5%", "IBU": "55", "Volume": "12x355ml", "Temperatura": "Servir entre 4-7°C" },
    featured: false,
  },
]

export const banners = [
  {
    id: 1,
    title: "Semana Tech",
    subtitle: "Até 50% OFF em eletrônicos",
    cta: "Ver ofertas",
    gradient: "from-blue-600 to-blue-900",
    image: "📱",
    href: "/busca?categoria=eletronicos",
  },
  {
    id: 2,
    title: "Moda Verão 2025",
    subtitle: "Novidades que chegaram hoje",
    cta: "Conferir coleção",
    gradient: "from-pink-500 to-purple-700",
    image: "👗",
    href: "/busca?categoria=moda",
  },
  {
    id: 3,
    title: "Frete Grátis",
    subtitle: "Em milhares de produtos",
    cta: "Aproveitar",
    gradient: "from-green-500 to-teal-700",
    image: "🚚",
    href: "/busca",
  },
]

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.category === categoryId)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q)
  )
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}
