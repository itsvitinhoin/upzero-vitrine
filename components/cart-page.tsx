"use client"

import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package, CreditCard, Truck } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { CouponInput } from "@/components/coupon-input"

export function CartPage() {
  const { items, updateItemQuantity, removeItem, getTotalItems, getTotalPrice, clearCart, appliedCoupon, getCouponDiscount } = useCart()
  const { isAuthenticated } = useAuth()

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const couponDiscount = getCouponDiscount()
  const priceAfterCoupon = totalPrice - couponDiscount
  const pixDiscount = priceAfterCoupon * 0.1
  const pixPrice = priceAfterCoupon * 0.9
  const minOrder = 12
  const canCheckout = totalItems >= minOrder

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-light text-gray-900 mb-2">Carrinho de Compras</h1>
        <p className="text-gray-500 mb-6">Faça login para ver seu carrinho</p>
        <Link
          href="/login"
          className="bg-[#2C2420] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors"
        >
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
        <p className="text-gray-500 mb-6">Adicione produtos para continuar</p>
        <Link
          href="/catalogo"
          className="bg-[#2C2420] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors"
        >
          Ver Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900 underline">Início</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Carrinho</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-gray-900">Carrinho de Compras</h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Limpar carrinho
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Products */}
        <div className="flex-1">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                {/* Product Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 rounded flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 uppercase mb-2">{item.name}</h3>
                      <p className="text-lg font-medium text-gray-900">{formatPrice(item.price)}</p>
                      <p className="text-sm text-green-600">
                        {formatPrice(item.price * 0.9)} no PIX
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Grade Table */}
                <div className="overflow-x-auto">
                  <p className="text-xs text-gray-500 text-center mb-2">DESLIZE PARA VER TODOS OS TAMANHOS</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 min-w-[120px]">COR</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-600 min-w-[80px]">P 38</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-600 min-w-[80px]">M 40</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-600 min-w-[80px]">G 42</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-600 min-w-[80px]">GG 44</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.colors.map((color) => (
                        <tr key={color.name} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-gray-700">{color.name}</span>
                            </div>
                          </td>
                          {["P 38", "M 40", "G 42", "GG 44"].map((size) => {
                            const sizeData = color.sizes.find(s => s.size === size)
                            const quantity = sizeData?.quantity || 0

                            if (quantity === 0) {
                              return (
                                <td key={size} className="text-center py-3 px-2">
                                  <span className="text-gray-300">-</span>
                                </td>
                              )
                            }

                            return (
                              <td key={size} className="text-center py-3 px-2">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateItemQuantity(item.id, color.name, size, quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center font-medium">{quantity}</span>
                                  <button
                                    onClick={() => updateItemQuantity(item.id, color.name, size, quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Item Subtotal */}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Subtotal: {item.colors.reduce((t, c) => t + c.sizes.reduce((st, s) => st + s.quantity, 0), 0)} peças
                    </p>
                    <p className="font-medium">
                      {formatPrice(item.price * item.colors.reduce((t, c) => t + c.sizes.reduce((st, s) => st + s.quantity, 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Continuar comprando
          </Link>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:w-96">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Resumo do Pedido</h2>

            {/* Benefits */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 text-sm">
                <Package size={18} className="text-[#8B7355]" />
                <span className="text-gray-600">Pedido mínimo: 12 peças</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CreditCard size={18} className="text-[#8B7355]" />
                <span className="text-gray-600">10% de desconto no PIX</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck size={18} className="text-[#8B7355]" />
                <span className="text-gray-600">Entrega para todo o Brasil</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <CouponInput />
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de peças</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Cupom ({appliedCoupon.code})</span>
                  <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto PIX (10%)</span>
                <span className="font-medium">-{formatPrice(pixDiscount)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200">
                <span>Total no PIX</span>
                <span className="text-green-600">{formatPrice(pixPrice)}</span>
              </div>
              <p className="text-xs text-gray-500">
                ou {formatPrice(priceAfterCoupon)} em até 5x sem juros
              </p>
            </div>

            {/* Min order warning */}
            {!canCheckout && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800">
                  Pedido mínimo de <strong>{minOrder} peças</strong>. Faltam {minOrder - totalItems} peças.
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <Link
              href={canCheckout ? "/checkout" : "#"}
              onClick={(e) => {
                if (!canCheckout) {
                  e.preventDefault()
                }
              }}
              className={`block w-full text-center py-4 rounded-lg font-medium transition-colors ${
                canCheckout
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Finalizar Compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
