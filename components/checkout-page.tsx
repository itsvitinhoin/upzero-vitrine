"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, ChevronDown, ChevronUp, MapPin, CreditCard, Truck, ShoppingBag, Edit2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { CouponInput } from "@/components/coupon-input"

type Section = "entrega" | "pagamento" | "revisao"

interface Address {
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalItems, getTotalPrice, clearCart, appliedCoupon, getCouponDiscount } = useCart()
  const { isAuthenticated, user } = useAuth()

  // Which section is currently open
  const [openSection, setOpenSection] = useState<Section>("entrega")
  // Which sections are completed
  const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [address, setAddress] = useState<Address>({
    cep: "", street: "", number: "", complement: "",
    neighborhood: "", city: "", state: ""
  })
  const [selectedShipping, setSelectedShipping] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [observations, setObservations] = useState("")

  const shippingOptions = [
    { id: "pac", name: "PAC", price: 29.90, days: "8 a 12 dias úteis" },
    { id: "sedex", name: "SEDEX", price: 49.90, days: "3 a 5 dias úteis" },
    { id: "transportadora", name: "Transportadora", price: 0, days: "A combinar" }
  ]

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const couponDiscount = getCouponDiscount()
  const priceAfterCoupon = totalPrice - couponDiscount
  const shippingPrice = shippingOptions.find(s => s.id === selectedShipping)?.price ?? 0
  const pixDiscount = priceAfterCoupon * 0.1
  const finalPrice = paymentMethod === "pix"
    ? priceAfterCoupon - pixDiscount + shippingPrice
    : priceAfterCoupon + shippingPrice

  const isAddressValid = () =>
    !!(address.cep && address.street && address.number && address.neighborhood && address.city && address.state)

  const handleCepBlur = async () => {
    const clean = address.cep.replace(/\D/g, "")
    if (clean.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || ""
          }))
        }
      } catch {}
    }
  }

  const completeEntrega = () => {
    if (!isAddressValid() || !selectedShipping) return
    setCompletedSections(prev => new Set([...prev, "entrega"]))
    setOpenSection("pagamento")
  }

  const completePagamento = () => {
    if (!paymentMethod) return
    setCompletedSections(prev => new Set([...prev, "pagamento"]))
    setOpenSection("revisao")
  }

  const handleFinishOrder = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const orderData = {
      items, address,
      shipping: shippingOptions.find(s => s.id === selectedShipping),
      paymentMethod, totalItems,
      totalPrice: finalPrice, observations,
      orderNumber: `PED${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem("lastOrder", JSON.stringify(orderData))
    clearCart()
    router.push("/obrigado")
  }

  const openCompleted = (section: Section) => {
    if (completedSections.has(section)) {
      setOpenSection(section)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-light text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-6">Faça login para finalizar sua compra</p>
        <Link href="/login" className="bg-[#2C2420] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors">
          Fazer Login
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-light text-gray-900 mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-6">Adicione produtos para finalizar a compra</p>
        <Link href="/catalogo" className="bg-[#2C2420] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors">
          Ver Catálogo
        </Link>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-colors bg-white"
  const labelClass = "block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide"

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8 bg-[#FAFAF8] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs text-gray-400 mb-8 gap-2">
        <Link href="/" className="hover:text-gray-700 transition-colors">Início</Link>
        <span>/</span>
        <Link href="/carrinho" className="hover:text-gray-700 transition-colors">Carrinho</Link>
        <span>/</span>
        <span className="text-gray-700">Checkout</span>
      </div>

      <h1 className="text-2xl font-light tracking-wide text-[#2C2420] mb-8">Finalizar Pedido</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Accordion Sections */}
        <div className="flex-1 space-y-4">

          {/* ─── SECTION 1: ENTREGA ─── */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <button
              onClick={() => openSection === "entrega" ? undefined : openCompleted("entrega")}
              className="w-full flex items-center justify-between px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  completedSections.has("entrega")
                    ? "bg-green-500 text-white"
                    : openSection === "entrega"
                    ? "bg-[#2C2420] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {completedSections.has("entrega") ? <Check size={14} /> : "1"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#2C2420]">Entrega</p>
                  {completedSections.has("entrega") && openSection !== "entrega" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {address.street}, {address.number} · {shippingOptions.find(s => s.id === selectedShipping)?.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {completedSections.has("entrega") && openSection !== "entrega" && (
                  <span className="text-xs text-[#8B7355] underline">Editar</span>
                )}
                {openSection === "entrega"
                  ? <ChevronUp size={18} className="text-gray-400" />
                  : <ChevronDown size={18} className="text-gray-400" />
                }
              </div>
            </button>

            {/* Body */}
            {openSection === "entrega" && (
              <div className="px-6 pb-6 border-t border-gray-100">
                {/* Address */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-5 mb-4 flex items-center gap-2">
                  <MapPin size={13} /> Endereço de Entrega
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>CEP</label>
                    <input type="text" value={address.cep}
                      onChange={e => setAddress(p => ({ ...p, cep: e.target.value }))}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Rua / Logradouro</label>
                    <input type="text" value={address.street}
                      onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Número</label>
                    <input type="text" value={address.number}
                      onChange={e => setAddress(p => ({ ...p, number: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Complemento</label>
                    <input type="text" value={address.complement}
                      onChange={e => setAddress(p => ({ ...p, complement: e.target.value }))}
                      placeholder="Opcional"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bairro</label>
                    <input type="text" value={address.neighborhood}
                      onChange={e => setAddress(p => ({ ...p, neighborhood: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Cidade</label>
                    <input type="text" value={address.city}
                      onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Estado</label>
                    <input type="text" value={address.state}
                      onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                      maxLength={2}
                      placeholder="UF"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Shipping */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
                  <Truck size={13} /> Método de Entrega
                </p>
                <div className="space-y-2">
                  {shippingOptions.map(option => (
                    <label key={option.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedShipping === option.id
                        ? "border-[#8B7355] bg-[#F5F3F0]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={e => setSelectedShipping(e.target.value)}
                          className="w-4 h-4 accent-[#8B7355]"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{option.name}</p>
                          <p className="text-xs text-gray-400">{option.days}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {option.price === 0 ? "A combinar" : formatPrice(option.price)}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={completeEntrega}
                  disabled={!isAddressValid() || !selectedShipping}
                  className="mt-6 w-full py-3.5 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[#2C2420] text-white hover:bg-[#3D322C]"
                >
                  Continuar para Pagamento
                </button>
              </div>
            )}
          </div>

          {/* ─── SECTION 2: PAGAMENTO ─── */}
          <div className={`bg-white border rounded-xl overflow-hidden transition-colors ${
            completedSections.has("entrega") || openSection === "pagamento"
              ? "border-gray-200"
              : "border-gray-100 opacity-60"
          }`}>
            <button
              onClick={() => {
                if (openSection === "pagamento") return
                if (completedSections.has("pagamento") || completedSections.has("entrega")) {
                  setOpenSection("pagamento")
                }
              }}
              className="w-full flex items-center justify-between px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  completedSections.has("pagamento")
                    ? "bg-green-500 text-white"
                    : openSection === "pagamento"
                    ? "bg-[#2C2420] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {completedSections.has("pagamento") ? <Check size={14} /> : "2"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#2C2420]">Pagamento</p>
                  {completedSections.has("pagamento") && openSection !== "pagamento" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {paymentMethod === "pix" ? "PIX — 10% desconto" : paymentMethod === "boleto" ? "Boleto Bancário" : "Cartão de Crédito"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {completedSections.has("pagamento") && openSection !== "pagamento" && (
                  <span className="text-xs text-[#8B7355] underline">Editar</span>
                )}
                {openSection === "pagamento"
                  ? <ChevronUp size={18} className="text-gray-400" />
                  : <ChevronDown size={18} className="text-gray-400" />
                }
              </div>
            </button>

            {openSection === "pagamento" && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-2 mt-5">
                  {/* PIX */}
                  <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "pix" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="pix"
                        checked={paymentMethod === "pix"}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 accent-green-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">PIX</p>
                        <p className="text-xs text-green-600 font-medium">10% de desconto</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{formatPrice(totalPrice * 0.9 + shippingPrice)}</p>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(totalPrice + shippingPrice)}</p>
                    </div>
                  </label>

                  {/* Boleto */}
                  <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "boleto" ? "border-[#8B7355] bg-[#F5F3F0]" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="boleto"
                        checked={paymentMethod === "boleto"}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 accent-[#8B7355]"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Boleto Bancário</p>
                        <p className="text-xs text-gray-400">Vencimento em 3 dias úteis</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{formatPrice(totalPrice + shippingPrice)}</p>
                  </label>

                  {/* Cartão */}
                  <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card" ? "border-[#8B7355] bg-[#F5F3F0]" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="card"
                        checked={paymentMethod === "card"}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 accent-[#8B7355]"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Cartão de Crédito</p>
                        <p className="text-xs text-gray-400">Em até 5x sem juros</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">5x de {formatPrice((totalPrice + shippingPrice) / 5)}</p>
                  </label>
                </div>

                {/* Observações */}
                <div className="mt-5">
                  <label className={labelClass}>Observações (opcional)</label>
                  <textarea
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    rows={3}
                    placeholder="Alguma observação sobre o pedido?"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  onClick={completePagamento}
                  disabled={!paymentMethod}
                  className="mt-6 w-full py-3.5 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[#2C2420] text-white hover:bg-[#3D322C]"
                >
                  Revisar Pedido
                </button>
              </div>
            )}
          </div>

          {/* ─── SECTION 3: REVISÃO ─── */}
          <div className={`bg-white border rounded-xl overflow-hidden transition-colors ${
            completedSections.has("pagamento")
              ? "border-gray-200"
              : "border-gray-100 opacity-50"
          }`}>
            <button
              onClick={() => completedSections.has("pagamento") && setOpenSection("revisao")}
              className="w-full flex items-center justify-between px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  openSection === "revisao" && completedSections.has("pagamento")
                    ? "bg-[#2C2420] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  3
                </div>
                <p className="text-sm font-medium text-[#2C2420]">Revisão do Pedido</p>
              </div>
              {openSection === "revisao"
                ? <ChevronUp size={18} className="text-gray-400" />
                : <ChevronDown size={18} className="text-gray-400" />
              }
            </button>

            {openSection === "revisao" && completedSections.has("pagamento") && (
              <div className="px-6 pb-6 border-t border-gray-100">

                {/* Address + Shipping summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="bg-[#FAFAF8] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <MapPin size={11} /> Entrega
                      </p>
                      <button onClick={() => setOpenSection("entrega")} className="text-xs text-[#8B7355] underline">Editar</button>
                    </div>
                    <p className="text-sm text-gray-700">{address.street}, {address.number}{address.complement ? `, ${address.complement}` : ""}</p>
                    <p className="text-sm text-gray-700">{address.neighborhood} — {address.city}/{address.state}</p>
                    <p className="text-sm text-gray-700">CEP {address.cep}</p>
                    <p className="text-xs text-gray-400 mt-1">{shippingOptions.find(s => s.id === selectedShipping)?.name} · {shippingOptions.find(s => s.id === selectedShipping)?.days}</p>
                  </div>

                  <div className="bg-[#FAFAF8] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <CreditCard size={11} /> Pagamento
                      </p>
                      <button onClick={() => setOpenSection("pagamento")} className="text-xs text-[#8B7355] underline">Editar</button>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {paymentMethod === "pix" ? "PIX — 10% de desconto" : paymentMethod === "boleto" ? "Boleto Bancário" : "Cartão de Crédito (5x sem juros)"}
                    </p>
                    {observations && (
                      <p className="text-xs text-gray-400 mt-2 italic">&quot;{observations}&quot;</p>
                    )}
                  </div>
                </div>

                {/* Products in grade format */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
                  <ShoppingBag size={13} /> Produtos do Pedido
                </p>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 bg-[#FAFAF8] border-b border-gray-100">
                        <p className="text-sm font-medium text-[#2C2420]">{item.name}</p>
                        <p className="text-xs text-gray-400">{formatPrice(item.price)} / peça</p>
                      </div>
                      {/* Grade table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left px-4 py-2.5 font-semibold text-gray-500 w-40">COR</th>
                              {["P 38", "M 40", "G 42", "GG 44"].map(sz => (
                                <th key={sz} className="text-center px-4 py-2.5 font-semibold text-gray-500">{sz}</th>
                              ))}
                              <th className="text-center px-4 py-2.5 font-semibold text-gray-500">TOTAL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.colors.map((color, ci) => {
                              const sizeMap: Record<string, number> = {}
                              color.sizes.forEach(s => { sizeMap[s.size] = s.quantity })
                              const rowTotal = color.sizes.reduce((acc, s) => acc + s.quantity, 0)
                              return (
                                <tr key={ci} className="border-t border-gray-100">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-200"
                                        style={{ backgroundColor: color.hex }} />
                                      <span className="text-gray-700 truncate max-w-[90px]">{color.name}</span>
                                    </div>
                                  </td>
                                  {["P 38", "M 40", "G 42", "GG 44"].map(sz => (
                                    <td key={sz} className="px-4 py-3 text-center">
                                      <span className={`inline-block w-7 h-7 rounded-md text-center leading-7 ${
                                        sizeMap[sz] > 0 ? "bg-[#2C2420] text-white font-medium" : "text-gray-300"
                                      }`}>
                                        {sizeMap[sz] > 0 ? sizeMap[sz] : "—"}
                                      </span>
                                    </td>
                                  ))}
                                  <td className="px-4 py-3 text-center font-semibold text-[#2C2420]">{rowTotal}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                {/* Coupon */}
                <div className="mt-6">
                  <CouponInput />
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({totalItems} peças)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Cupom ({appliedCoupon.code})</span>
                      <span>- {formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  {selectedShipping && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Frete ({shippingOptions.find(s => s.id === selectedShipping)?.name})</span>
                      <span>{shippingPrice === 0 ? "A combinar" : formatPrice(shippingPrice)}</span>
                    </div>
                  )}
                  {paymentMethod === "pix" && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Desconto PIX (10%)</span>
                      <span>- {formatPrice(pixDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold text-[#2C2420] pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(finalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinishOrder}
                  disabled={isSubmitting}
                  className="mt-6 w-full py-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? "Processando..." : "Confirmar Pedido"}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right: Order Summary Sticky */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h2 className="text-sm font-semibold text-[#2C2420] mb-4 uppercase tracking-wide">Resumo do Pedido</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => {
                const itemTotal = item.colors.reduce((acc, c) => acc + c.sizes.reduce((a, s) => a + s.quantity, 0), 0)
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-12 h-14 bg-gradient-to-br from-[#E8E4DF] to-[#D8D3CC] rounded-md flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#2C2420] truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{itemTotal} peças</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.colors.map((c, i) => (
                          <span key={i} className="w-3 h-3 rounded-full border border-gray-200 inline-block"
                            style={{ backgroundColor: c.hex }} title={c.name} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-[#2C2420] flex-shrink-0">
                      {formatPrice(item.price * itemTotal)}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>{totalItems} peças</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Cupom ({appliedCoupon.code})</span>
                  <span>- {formatPrice(couponDiscount)}</span>
                </div>
              )}
              {selectedShipping && (
                <div className="flex justify-between text-gray-500">
                  <span>Frete</span>
                  <span>{shippingPrice === 0 ? "A combinar" : formatPrice(shippingPrice)}</span>
                </div>
              )}
              {paymentMethod === "pix" && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Desconto PIX</span>
                  <span>- {formatPrice(pixDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-[#2C2420] text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
