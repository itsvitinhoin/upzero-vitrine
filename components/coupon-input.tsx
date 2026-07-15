"use client"

import { useState } from "react"
import { Tag, X, Check, ChevronDown } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function CouponInput() {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)

  const handleApply = () => {
    const result = applyCoupon(code)
    setFeedback(result)
    if (result.success) {
      setCode("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleApply()
    }
  }

  // Se já tem cupom aplicado, mostra o estado aplicado
  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
            <p className="text-xs text-green-600">{appliedCoupon.description}</p>
          </div>
        </div>
        <button
          onClick={() => {
            removeCoupon()
            setFeedback(null)
          }}
          className="p-1 text-green-600 hover:text-red-500 transition-colors"
          aria-label="Remover cupom"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Inserir cupom de desconto</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setFeedback(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Digite o código"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase outline-none focus:border-gray-900 transition-colors"
            />
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-[#2C2420] text-white text-sm font-medium rounded-lg hover:bg-[#3D322C] transition-colors"
            >
              Aplicar
            </button>
          </div>
          {feedback && (
            <p className={`text-xs mt-2 ${feedback.success ? "text-green-600" : "text-red-500"}`}>
              {feedback.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
