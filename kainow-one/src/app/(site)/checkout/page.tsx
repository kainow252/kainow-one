'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/data'
import { validateCard, formatCardNumber, formatExpiry, detectCardBrand, getCardBrandInfo } from '@/lib/card-validator'
import { validateCoupon } from '@/lib/coupons'
import { checkGiftCard } from '@/lib/gift-cards'
import { analyzeFraudRisk, getRiskColor, getRiskEmoji } from '@/lib/anti-fraud'
import { CreditCard, Barcode, Smartphone, Shield, ChevronRight, CheckCircle, Tag, Gift, AlertCircle, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react'

type Step = 1 | 2 | 3

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const [step, setStep] = useState<Step>(1)
  const [payMethod, setPayMethod] = useState('credit')
  const [completed, setCompleted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [processing, setProcessing] = useState(false)

  // Address
  const [addr, setAddr] = useState({ name:'', surname:'', cep:'', street:'', number:'', comp:'', city:'São Paulo', state:'SP' })

  // Card fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardErrors, setCardErrors] = useState<string[]>([])
  const [installments, setInstallments] = useState(1)

  // Coupon
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  // Gift card
  const [gcCode, setGcCode] = useState('')
  const [gcResult, setGcResult] = useState<{ valid: boolean; balance: number; message: string } | null>(null)
  const [gcLoading, setGcLoading] = useState(false)
  const [gcApplied, setGcApplied] = useState(0)

  // Fraud
  const [fraudResult, setFraudResult] = useState<ReturnType<typeof analyzeFraudRisk> | null>(null)

  const cardBrand = detectCardBrand(cardNumber)
  const brandInfo = getCardBrandInfo(cardBrand)

  const shipping = state.total > 299 ? 0 : 29.90
  const couponDiscount = couponResult?.valid ? couponResult.discount : 0
  const gcDiscount = gcApplied
  const finalTotal = Math.max(0, state.total + shipping - couponDiscount - gcDiscount)

  // ── Aplicar cupom ────────────────────────────────────────
  async function applyCoupon() {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = validateCoupon(couponCode, state.total)
    setCouponResult(result)
    setCouponLoading(false)
  }

  // ── Aplicar gift card ────────────────────────────────────
  async function applyGiftCard() {
    if (!gcCode.trim()) return
    setGcLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = checkGiftCard(gcCode)
    setGcResult(result)
    if (result.valid) setGcApplied(Math.min(result.balance, finalTotal + gcDiscount))
    setGcLoading(false)
  }

  // ── Validar cartão ao digitar ────────────────────────────
  function handleCardNumberChange(v: string) {
    setCardNumber(formatCardNumber(v))
    setCardErrors([])
  }

  // ── Análise de fraude antes de confirmar ─────────────────
  function runFraudCheck(): ReturnType<typeof analyzeFraudRisk> {
    const result = analyzeFraudRisk({
      email: 'user@demo.com',
      orderTotal: finalTotal,
      itemCount: state.count,
      isFirstOrder: false,
      accountAgeHours: 720,
      previousOrders: 3,
      failedPaymentAttempts: 0,
      sessionId: 'sess_demo_001',
    })
    setFraudResult(result)
    return result
  }

  // ── Confirmar pagamento ──────────────────────────────────
  async function handleFinish() {
    // Validar cartão se for crédito/débito
    if (payMethod === 'credit' || payMethod === 'debit') {
      const validation = validateCard(cardNumber, cardExpiry, cardCvv, cardHolder)
      if (!validation.valid) {
        setCardErrors(validation.errors)
        return
      }
    }

    // Análise de fraude
    const fraud = runFraudCheck()
    if (fraud.blocked) return

    setProcessing(true)
    await new Promise(r => setTimeout(r, 2000))

    const num = `KNW-${Math.random().toString(36).slice(2,8).toUpperCase()}`
    setOrderNumber(num)
    setCompleted(true)
    dispatch({ type: 'CLEAR_CART' })
    setProcessing(false)
  }

  if (state.items.length === 0 && !completed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Carrinho vazio</h2>
        <Link href="/" className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800">Ir às compras</Link>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Pedido confirmado! 🎉</h2>
          <p className="text-gray-500 mb-1">Número do pedido:</p>
          <p className="text-2xl font-black text-blue-700 mb-4">#{orderNumber}</p>
          <p className="text-sm text-gray-500 mb-6">Você receberá um e-mail com os detalhes do pedido.</p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-blue-700">
            <ShieldCheck size={16} className="inline mr-1" />
            Seu pagamento foi processado com segurança.
          </div>
          <Link href="/" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-full transition inline-block">
            Continuar comprando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar compra</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 text-sm flex-wrap">
        {(['Endereço', 'Pagamento', 'Revisão'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => step > (i+1) && setStep((i+1) as Step)}
              className={`flex items-center gap-2 font-semibold transition ${step === i+1 ? 'text-blue-700' : step > i+1 ? 'text-green-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === i+1 ? 'bg-blue-700 text-white' : step > i+1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i+1 ? '✓' : i+1}
              </span>
              {s}
            </button>
            {i < 2 && <ChevronRight size={14} className="text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── FORM AREA ─── */}
        <div className="lg:col-span-2 space-y-4">

          {/* STEP 1 — Endereço */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-800 text-lg">Endereço de entrega</h2>

              {/* Endereços salvos */}
              <div className="space-y-2 pb-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-600">Endereços salvos:</p>
                {[
                  { id:'e1', label:'🏠 Casa', desc:'Av. Paulista, 1000 — São Paulo, SP', cep:'01310-100' },
                  { id:'e2', label:'🏢 Trabalho', desc:'Rua Augusta, 200 — São Paulo, SP', cep:'01310-200' },
                ].map(e=>(
                  <button key={e.id}
                    onClick={()=>setAddr({...addr, street:e.desc.split(' — ')[0], cep:e.cep, city:'São Paulo', state:'SP'})}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition">
                    <span className="text-base">{e.label.split(' ')[0]}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.label.split(' ').slice(1).join(' ')}</p>
                      <p className="text-xs text-gray-500">{e.desc} · CEP {e.cep}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold text-gray-600">Ou informe outro endereço:</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Nome</label><input className="input" placeholder="João" value={addr.name} onChange={e=>setAddr({...addr,name:e.target.value})} /></div>
                <div><label className="label">Sobrenome</label><input className="input" placeholder="Silva" value={addr.surname} onChange={e=>setAddr({...addr,surname:e.target.value})} /></div>
              </div>
              <div><label className="label">CEP</label><input className="input" placeholder="00000-000" value={addr.cep} onChange={e=>setAddr({...addr,cep:e.target.value})} /></div>
              <div><label className="label">Endereço</label><input className="input" placeholder="Rua, Avenida..." value={addr.street} onChange={e=>setAddr({...addr,street:e.target.value})} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label">Número</label><input className="input" placeholder="123" value={addr.number} onChange={e=>setAddr({...addr,number:e.target.value})} /></div>
                <div className="col-span-2"><label className="label">Complemento</label><input className="input" placeholder="Apto, Bloco..." value={addr.comp} onChange={e=>setAddr({...addr,comp:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Cidade</label><input className="input" value={addr.city} onChange={e=>setAddr({...addr,city:e.target.value})} /></div>
                <div><label className="label">Estado</label>
                  <select className="input" value={addr.state} onChange={e=>setAddr({...addr,state:e.target.value})}>
                    {['SP','RJ','MG','RS','PR','SC','BA','DF','GO','PE'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={()=>setStep(2)} className="btn-primary w-full">Continuar para pagamento →</button>
            </div>
          )}

          {/* STEP 2 — Pagamento */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-bold text-gray-800 text-lg">Forma de pagamento</h2>
                {[
                  { id:'credit', icon:<CreditCard size={20}/>, label:'Cartão de crédito', desc:`em até 12x sem juros` },
                  { id:'debit',  icon:<CreditCard size={20}/>, label:'Cartão de débito', desc:'À vista' },
                  { id:'pix',    icon:<Smartphone size={20}/>, label:'Pix', desc:'5% de desconto — instantâneo' },
                  { id:'boleto', icon:<Barcode size={20}/>,    label:'Boleto bancário', desc:'Vence em 3 dias úteis' },
                ].map(m=>(
                  <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${payMethod===m.id?'border-blue-600 bg-blue-50':'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="pay" value={m.id} checked={payMethod===m.id} onChange={()=>setPayMethod(m.id)} className="accent-blue-700"/>
                    <span className="text-blue-700">{m.icon}</span>
                    <div><p className="font-semibold text-gray-800">{m.label}</p><p className="text-xs text-gray-500">{m.desc}</p></div>
                  </label>
                ))}

                {/* ── Campos do cartão com validação Luhn ── */}
                {(payMethod==='credit'||payMethod==='debit') && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    {cardErrors.length>0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
                        {cardErrors.map((e,i)=>(
                          <p key={i} className="text-red-600 text-xs flex items-center gap-1"><AlertCircle size={12}/>{e}</p>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <input type="text" placeholder="Número do cartão" value={cardNumber}
                        onChange={e=>handleCardNumberChange(e.target.value)} maxLength={19}
                        className="input pr-16" />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${brandInfo.color}`}>
                        {brandInfo.emoji} {cardBrand !== 'Desconhecido' ? cardBrand : ''}
                      </span>
                    </div>
                    <input type="text" placeholder="Nome no cartão" value={cardHolder}
                      onChange={e=>setCardHolder(e.target.value.toUpperCase())} className="input" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM/AA" value={cardExpiry}
                        onChange={e=>setCardExpiry(formatExpiry(e.target.value))} maxLength={5} className="input" />
                      <input type="text" placeholder={`CVV ${cardBrand==='Amex'?'(4 dígitos)':'(3 dígitos)'}`}
                        value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,'').slice(0, cardBrand==='Amex'?4:3))} className="input" />
                    </div>
                    {payMethod==='credit' && (
                      <select className="input" value={installments} onChange={e=>setInstallments(Number(e.target.value))}>
                        {[1,2,3,4,6,8,10,12].map(p=>(
                          <option key={p} value={p}>
                            {p}x de {formatPrice(finalTotal/p)} {p===1?'(à vista)':'sem juros'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {payMethod==='pix' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-green-700 font-bold text-lg">💚 5% de desconto no Pix!</p>
                      <p className="text-green-600 text-sm">Total: <strong>{formatPrice(finalTotal*0.95)}</strong></p>
                      {/* QR Code visual simulado */}
                      <div className="bg-white rounded-xl p-3 border-2 border-green-300 shadow">
                        <div className="w-40 h-40 grid grid-cols-7 gap-0.5">
                          {Array.from({length:49}).map((_,i)=>{
                            const corners=[0,1,2,7,8,9,14,15,16,32,33,34,39,40,41,46,47,48]
                            const edge=[3,10,17,24,31,38,45,4,11,18,25,32,39]
                            const isc=corners.includes(i)
                            const ise=edge.includes(i)
                            const rand=((i*17+3)%13)<7
                            return <div key={i} className={`rounded-sm ${isc?'bg-green-800':ise?'bg-green-600':rand?'bg-gray-800':'bg-white'}`} style={{aspectRatio:'1'}} />
                          })}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">Escaneie com o app do seu banco<br/>ou copie a chave Pix abaixo</p>
                      <div className="w-full bg-white border border-green-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-600 font-mono truncate">pagamentos@kainow.com.br</span>
                        <button className="text-xs text-green-700 font-bold hover:underline whitespace-nowrap">Copiar</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Cupom ── */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Tag size={16} className="text-blue-700"/> Cupom de desconto</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Ex: KAINOW10" value={couponCode}
                    onChange={e=>setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 uppercase tracking-widest" />
                  <button onClick={applyCoupon} disabled={couponLoading || !couponCode}
                    className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1">
                    {couponLoading ? <Loader2 size={14} className="animate-spin"/> : 'Aplicar'}
                  </button>
                </div>
                {couponResult && (
                  <p className={`text-xs mt-2 font-medium ${couponResult.valid?'text-green-600':'text-red-500'}`}>
                    {couponResult.message}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Experimente: KAINOW10 · BEMVINDO50 · FRETEGRATIS · TECH20</p>
              </div>

              {/* ── Gift Card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Gift size={16} className="text-purple-700"/> Gift Card Kainow</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="KNWG-XXXX-XXXX-XXXX" value={gcCode}
                    onChange={e=>setGcCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-400 uppercase tracking-widest font-mono" />
                  <button onClick={applyGiftCard} disabled={gcLoading || !gcCode}
                    className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1">
                    {gcLoading ? <Loader2 size={14} className="animate-spin"/> : 'Usar'}
                  </button>
                </div>
                {gcResult && (
                  <p className={`text-xs mt-2 font-medium ${gcResult.valid?'text-green-600':'text-red-500'}`}>
                    {gcResult.message}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Teste: KNWG-A3B2-X9Y1-4Z5W · KNWG-Q7R5-M2N8-9PL3</p>
              </div>

              <button onClick={()=>setStep(3)} className="btn-primary w-full">Revisar pedido →</button>
            </div>
          )}

          {/* STEP 3 — Revisão + Fraude */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Revisão do pedido</h2>
                <div className="space-y-3 mb-5">
                  {state.items.map(item=>(
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.title} className="w-14 h-14 object-cover rounded-xl bg-gray-50"/>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.title}</p>
                        <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(item.product.price*item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Resumo de descontos */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(state.total)}</span></div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className={shipping===0?'text-green-600 font-medium':''}>{shipping===0?'Grátis':formatPrice(shipping)}</span>
                  </div>
                  {couponDiscount>0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>🎟 Cupom ({couponCode})</span><span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  {gcDiscount>0 && (
                    <div className="flex justify-between text-purple-600 font-medium">
                      <span>🎁 Gift Card</span><span>-{formatPrice(gcDiscount)}</span>
                    </div>
                  )}
                  {payMethod==='pix' && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>💚 Desconto Pix (5%)</span><span>-{formatPrice(finalTotal*0.05)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-700">{formatPrice(payMethod==='pix'?finalTotal*0.95:finalTotal)}</span>
                  </div>
                </div>

                {/* Anti-fraud result */}
                {fraudResult && (
                  <div className={`rounded-xl p-4 border mb-4 ${getRiskColor(fraudResult.riskLevel)}`}>
                    <p className="font-bold text-sm mb-1">
                      {getRiskEmoji(fraudResult.riskLevel)} Análise de Segurança — {fraudResult.riskLevel.toUpperCase()}
                    </p>
                    <p className="text-sm">{fraudResult.recommendation}</p>
                    {fraudResult.signals.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {fraudResult.signals.map(s => (
                          <li key={s.code} className="text-xs opacity-80">• {s.description}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                  <ShieldCheck size={14} className="text-blue-700 mt-0.5 flex-shrink-0"/>
                  Pagamento 100% seguro. Seus dados são criptografados com SSL.
                </div>

                <button onClick={handleFinish} disabled={processing || (fraudResult?.blocked ?? false)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-blue-900 font-black py-4 rounded-xl transition text-base flex items-center justify-center gap-2">
                  {processing ? (
                    <><Loader2 size={20} className="animate-spin"/> Processando pagamento...</>
                  ) : fraudResult?.blocked ? (
                    <><ShieldAlert size={20}/> Transação bloqueada</>
                  ) : (
                    <>Confirmar e pagar {formatPrice(payMethod==='pix'?finalTotal*0.95:finalTotal)} →</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── ORDER SUMMARY SIDEBAR ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24 space-y-4">
          <h2 className="font-bold text-gray-800">Resumo ({state.count} {state.count===1?'item':'itens'})</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.items.map(item=>(
              <div key={item.product.id} className="flex items-center gap-2">
                <img src={item.product.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-gray-50 flex-shrink-0"/>
                <span className="flex-1 text-gray-700 text-xs line-clamp-1">{item.product.title}</span>
                <span className="font-semibold text-gray-900 text-xs whitespace-nowrap">{formatPrice(item.product.price*item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(state.total)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Frete</span><span>{shipping===0?<span className="text-green-600">Grátis</span>:formatPrice(shipping)}</span></div>
            {couponDiscount>0 && <div className="flex justify-between text-green-600 font-medium"><span>Cupom</span><span>-{formatPrice(couponDiscount)}</span></div>}
            {gcDiscount>0 && <div className="flex justify-between text-purple-600 font-medium"><span>Gift Card</span><span>-{formatPrice(gcDiscount)}</span></div>}
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
              <span>Total</span>
              <span className="text-blue-700">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Shield size={12} className="text-green-500"/> Compra protegida Kainow
          </div>
        </div>
      </div>

      <style jsx>{`
        .input { width:100%; border:1px solid #e5e7eb; border-radius:0.75rem; padding:0.75rem 1rem; font-size:0.875rem; outline:none; transition:all .15s; }
        .input:focus { border-color:#3b82f6; box-shadow:0 0 0 2px rgba(59,130,246,.1); }
        .label { display:block; font-size:0.875rem; font-weight:500; color:#374151; margin-bottom:0.25rem; }
        .btn-primary { background:#1d4ed8; color:#fff; font-weight:700; padding:0.875rem; border-radius:0.75rem; transition:all .15s; }
        .btn-primary:hover { background:#1e40af; }
      `}</style>
    </div>
  )
}
