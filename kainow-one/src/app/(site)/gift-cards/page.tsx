'use client'

import { useState } from 'react'
import { Gift, CheckCircle, AlertCircle, Loader2, Send, ShoppingCart } from 'lucide-react'
import { GIFT_CARD_VALUES, checkGiftCard, createGiftCard } from '@/lib/gift-cards'
import { formatPrice } from '@/lib/data'
import Link from 'next/link'

export default function GiftCardsPage() {
  const [tab, setTab] = useState<'buy' | 'redeem'>('buy')

  // Buy
  const [selectedValue, setSelectedValue] = useState(100)
  const [customValue, setCustomValue] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [bought, setBought] = useState<ReturnType<typeof createGiftCard> | null>(null)
  const [buying, setBuying] = useState(false)

  // Redeem
  const [checkCode, setCheckCode] = useState('')
  const [checkResult, setCheckResult] = useState<ReturnType<typeof checkGiftCard> | null>(null)
  const [checking, setChecking] = useState(false)

  const finalValue = customValue ? Number(customValue) : selectedValue

  async function handleBuy() {
    if (finalValue < 10 || finalValue > 2000) return
    setBuying(true)
    await new Promise(r => setTimeout(r, 1000))
    const gc = createGiftCard({
      value: finalValue,
      purchasedBy: 'user_demo',
      recipientEmail: recipientEmail || undefined,
      recipientName: recipientName || undefined,
      message: message || undefined,
    })
    setBought(gc)
    setBuying(false)
  }

  async function handleCheck() {
    if (!checkCode.trim()) return
    setChecking(true)
    await new Promise(r => setTimeout(r, 500))
    setCheckResult(checkGiftCard(checkCode))
    setChecking(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-8 text-white mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[15rem] flex items-center justify-center select-none">🎁</div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift size={16} /> Gift Cards Kainow One
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">O presente perfeito para toda ocasião</h1>
          <p className="text-purple-200 text-lg">Válido em milhares de produtos. Sem prazo de preocupação por 1 ano.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit mx-auto">
        <button onClick={() => setTab('buy')} className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${tab === 'buy' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          🛍️ Comprar Gift Card
        </button>
        <button onClick={() => setTab('redeem')} className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${tab === 'redeem' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          🔍 Consultar Saldo
        </button>
      </div>

      {/* BUY */}
      {tab === 'buy' && !bought && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">Escolha o valor</h2>
            <div className="grid grid-cols-4 gap-2">
              {GIFT_CARD_VALUES.map(v => (
                <button key={v} onClick={() => { setSelectedValue(v); setCustomValue('') }}
                  className={`py-2.5 rounded-xl text-sm font-bold transition border-2 ${selectedValue === v && !customValue ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-700 hover:border-purple-200'}`}>
                  {formatPrice(v)}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Valor personalizado</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                <input type="number" min={10} max={2000} placeholder="Outro valor (R$10 – R$2000)"
                  value={customValue} onChange={e => { setCustomValue(e.target.value); setSelectedValue(0) }}
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nome do presenteado</label>
              <input type="text" placeholder="Ex: Maria Silva" value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">E-mail do presenteado</label>
              <input type="email" placeholder="amigo@email.com" value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Mensagem personalizada</label>
              <textarea rows={3} placeholder="Escreva uma mensagem especial..."
                value={message} onChange={e => setMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 resize-none" />
            </div>

            <button onClick={handleBuy} disabled={buying || finalValue < 10}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition">
              {buying ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
              {buying ? 'Processando...' : `Comprar Gift Card de ${formatPrice(finalValue)}`}
            </button>
          </div>

          {/* Preview card */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden aspect-video flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <span className="text-blue-900 font-black text-xl">K</span>
                  </div>
                  <div>
                    <div className="font-black text-white text-lg leading-none">Kainow</div>
                    <div className="text-yellow-400 text-xs font-bold leading-none">ONE · GIFT CARD</div>
                  </div>
                </div>
                <p className="text-purple-200 text-sm mb-1">Valor</p>
                <p className="text-4xl font-black text-white">{formatPrice(finalValue || 0)}</p>
              </div>
              <div className="relative z-10">
                {recipientName && <p className="text-purple-200 text-sm">Para: <strong className="text-white">{recipientName}</strong></p>}
                <p className="text-purple-300 text-xs mt-1 font-mono">KNWG-XXXX-XXXX-XXXX</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 space-y-2">
              {['Válido por 12 meses', 'Sem taxas ou tarifas', 'Uso em qualquer produto', 'Pode combinar com cupons', 'Entrega imediata por e-mail'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle size={14} className="text-purple-500 flex-shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS após compra */}
      {tab === 'buy' && bought && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Gift Card criado! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Guarde o código abaixo e envie ao presenteado.</p>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-4 mb-4">
              <p className="text-purple-200 text-xs mb-1">Código do Gift Card</p>
              <p className="text-white font-black text-2xl tracking-widest font-mono">{bought.code}</p>
              <p className="text-purple-200 text-sm mt-2">Saldo: <strong className="text-white">{formatPrice(bought.value)}</strong></p>
            </div>
            {bought.recipientEmail && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 text-blue-700 text-sm mb-4">
                <Send size={14} /> Enviado para <strong>{bought.recipientEmail}</strong>
              </div>
            )}
            {bought.message && (
              <div className="bg-gray-50 rounded-xl p-3 text-gray-600 text-sm italic mb-4">
                "{bought.message}"
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setBought(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                Comprar outro
              </button>
              <Link href="/checkout" className="flex-1 bg-purple-700 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800 transition text-center">
                Usar no checkout
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* REDEEM / CONSULTAR */}
      {tab === 'redeem' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg mb-1">Consultar saldo do Gift Card</h2>
            <p className="text-gray-500 text-sm">Insira o código do seu gift card para verificar o saldo disponível.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="KNWG-XXXX-XXXX-XXXX"
                value={checkCode} onChange={e => setCheckCode(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 uppercase tracking-widest font-mono" />
              <button onClick={handleCheck} disabled={checking || !checkCode.trim()}
                className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition flex items-center gap-1">
                {checking ? <Loader2 size={16} className="animate-spin" /> : 'Consultar'}
              </button>
            </div>

            {checkResult && (
              <div className={`rounded-xl border p-4 ${checkResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {checkResult.valid && checkResult.giftCard ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-bold text-green-700 text-sm">Gift Card válido!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Saldo disponível</p>
                        <p className="font-black text-green-700 text-lg">{formatPrice(checkResult.balance)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Valor original</p>
                        <p className="font-black text-gray-800 text-lg">{formatPrice(checkResult.giftCard.value)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Status</p>
                        <p className="font-semibold text-gray-800 capitalize">{checkResult.giftCard.status === 'active' ? '✅ Ativo' : checkResult.giftCard.status}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Expira em</p>
                        <p className="font-semibold text-gray-800">{new Date(checkResult.giftCard.expiresAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <Link href="/checkout" className="mt-3 w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-sm text-center block transition">
                      Usar no checkout →
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} /> <span className="text-sm font-medium">{checkResult.message}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">Teste: KNWG-A3B2-X9Y1-4Z5W · KNWG-Q7R5-M2N8-9PL3</p>
          </div>
        </div>
      )}
    </div>
  )
}
