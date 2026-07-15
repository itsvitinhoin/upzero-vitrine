"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CouponInput } from "@/components/coupon-input"

export function CartSidebar() {
  const { items, isOpen, closeCart, updateItemQuantity, removeItem, getTotalItems, getTotalPrice, appliedCoupon, getCouponDiscount } = useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const minOrder = 12
  const canCheckout = totalItems >= minOrder

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="text-lg font-medium">Carrinho</h2>
            <span className="text-sm text-gray-500">({totalItems} {totalItems === 1 ? "peça" : "peças"})</span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400">Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 uppercase">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Grade Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 pr-2 font-medium text-gray-600">COR</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">P 38</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">M 40</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">G 42</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">GG 44</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.colors.map((color) => (
                          <tr key={color.name} className="border-b border-gray-100">
                            <td className="py-2 pr-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-gray-700 truncate max-w-[80px]">{color.name}</span>
                              </div>
                            </td>
                            {["P 38", "M 40", "G 42", "GG 44"].map((size) => {
                              const sizeData = color.sizes.find(s => s.size === size)
                              const quantity = sizeData?.quantity || 0

                              if (quantity === 0) {
                                return (
                                  <td key={size} className="text-center py-2 px-1">
                                    <span className="text-gray-300">-</span>
                                  </td>
                                )
                              }

                              return (
                                <td key={size} className="text-center py-2 px-1">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => updateItemQuantity(item.id, color.name, size, quantity - 1)}
                                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="w-5 text-center">{quantity}</span>
                                    <button
                                      onClick={() => updateItemQuantity(item.id, color.name, size, quantity + 1)}
                                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
                                    >
                                      <Plus size={12} />
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Min order warning */}
            {!canCheckout && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  Pedido mínimo de <strong>{minOrder} peças</strong>. Faltam {minOrder - totalItems} peças.
                </p>
              </div>
            )}

            {/* Coupon */}
            <CouponInput />

            {/* Summary */}
            <div className="space-y-2">
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
                  <span className="font-medium">-{formatPrice(getCouponDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-green-600">
                <span>10% OFF no PIX</span>
                <span className="font-medium">{formatPrice((totalPrice - getCouponDiscount()) * 0.9)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/carrinho"
                onClick={closeCart}
                className="block w-full text-center py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Ver carrinho completo
              </Link>
              <Link
                href={canCheckout ? "/checkout" : "#"}
                onClick={(e) => {
                  if (!canCheckout) {
                    e.preventDefault()
                    return
                  }
                  closeCart()
                }}
                className={`block w-full text-center py-3 rounded-lg text-sm font-medium transition-colors ${
                  canCheckout
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Finalizar Compra ({totalItems} peças)
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
