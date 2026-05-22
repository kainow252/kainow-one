import Link from 'next/link'
import { categories } from '@/lib/data'
import { Shield, CreditCard, Truck, Phone, Share2, MessageCircle, ThumbsUp, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12 w-full overflow-x-hidden">
      {/* Benefits bar */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Shield size={22} className="text-white" />, title: "Compra Garantida", desc: "Seu dinheiro de volta se não receber" },
            { icon: <Truck size={22} className="text-white" />, title: "Frete Grátis", desc: "Em produtos selecionados" },
            { icon: <CreditCard size={22} className="text-white" />, title: "Parcele em até 18x", desc: "Sem juros no cartão" },
            { icon: <Phone size={22} className="text-white" />, title: "Suporte 24h", desc: "Atendimento todos os dias" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.icon}
              <div>
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-orange-100 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow">
                <span className="text-white font-black text-xl">K</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight">Kainow One</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">O marketplace para todos. Compre, venda e conecte-se com o Brasil.</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                <ThumbsUp size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-pink-500 rounded-full flex items-center justify-center transition">
                <Share2 size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition">
                <Play size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Categorias</h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link href={`/busca?categoria=${cat.id}`} className="hover:text-orange-400 transition">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Comprar</h4>
            <ul className="space-y-2 text-sm">
              {['Como comprar', 'Meios de pagamento', 'Frete e entrega', 'Devoluções', 'Proteção ao comprador', 'Rastrear pedido'].map(item => (
                <li key={item}><a href="#" className="hover:text-orange-400 transition">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Vender</h4>
            <ul className="space-y-2 text-sm">
              {['Criar anúncio', 'Taxas e comissões', 'Reputação do vendedor', 'Central do vendedor', 'Loja oficial', 'Meus pedidos'].map(item => (
                <li key={item}><a href="#" className="hover:text-orange-400 transition">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Kainow</h4>
            <ul className="space-y-2 text-sm">
              {['Sobre nós', 'Trabalhe conosco', 'Investidores', 'Imprensa', 'Blog', 'Programa de afiliados'].map(item => (
                <li key={item}><a href="#" className="hover:text-orange-400 transition">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2025 Kainow One. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">Termos de uso</a>
            <a href="#" className="hover:text-gray-300">Privacidade</a>
            <a href="#" className="hover:text-gray-300">Cookies</a>
          </div>
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-5 opacity-50" />
            <span className="text-xs">Pagamentos seguros</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
