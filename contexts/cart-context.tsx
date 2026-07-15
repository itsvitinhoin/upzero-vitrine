"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItemSize {
  size: string
  quantity: number
  available: boolean
}

export interface CartItemColor {
  name: string
  hex: string
  sizes: CartItemSize[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  colors: CartItemColor[]
}

export interface Coupon {
  code: string
  type: "percent" | "fixed"
  value: number
  description: string
}

// Cupons disponíveis para validação
const AVAILABLE_COUPONS: Coupon[] = [
  { code: "BEMVINDO10", type: "percent", value: 10, description: "10% de desconto" },
  { code: "ATACADO15", type: "percent", value: 15, description: "15% de desconto no atacado" },
  { code: "FRETE50", type: "fixed", value: 50, description: "R$ 50,00 de desconto" },
]

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: CartItem) => void
  updateItemQuantity: (productId: string, colorName: string, size: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemsByProduct: (productId: string) => CartItem | undefined
  appliedCoupon: Coupon | null
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
  getCouponDiscount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  useEffect(() => {
    setMounted(true)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error loading cart:", e)
      }
    }
    const savedCoupon = localStorage.getItem("coupon")
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon))
      } catch (e) {
        console.error("Error loading coupon:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  useEffect(() => {
    if (mounted) {
      if (appliedCoupon) {
        localStorage.setItem("coupon", JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem("coupon")
      }
    }
  }, [appliedCoupon, mounted])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(!isOpen)

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id)
      
      if (existingIndex >= 0) {
        const updated = [...prev]
        const existing = updated[existingIndex]
        
        newItem.colors.forEach(newColor => {
          const existingColorIndex = existing.colors.findIndex(c => c.name === newColor.name)
          
          if (existingColorIndex >= 0) {
            newColor.sizes.forEach(newSize => {
              const existingSizeIndex = existing.colors[existingColorIndex].sizes.findIndex(
                s => s.size === newSize.size
              )
              
              if (existingSizeIndex >= 0) {
                existing.colors[existingColorIndex].sizes[existingSizeIndex].quantity += newSize.quantity
              } else {
                existing.colors[existingColorIndex].sizes.push(newSize)
              }
            })
          } else {
            existing.colors.push(newColor)
          }
        })
        
        return updated
      }
      
      return [...prev, newItem]
    })
    openCart()
  }

  const updateItemQuantity = (productId: string, colorName: string, size: string, quantity: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id !== productId) return item
        
        return {
          ...item,
          colors: item.colors.map(color => {
            if (color.name !== colorName) return color
            
            return {
              ...color,
              sizes: color.sizes.map(s => {
                if (s.size !== size) return s
                return { ...s, quantity: Math.max(0, quantity) }
              }).filter(s => s.quantity > 0)
            }
          }).filter(color => color.sizes.length > 0)
        }
      }).filter(item => item.colors.length > 0)
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
  }

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const normalizedCode = code.trim().toUpperCase()
    if (!normalizedCode) {
      return { success: false, message: "Digite um código de cupom" }
    }
    const found = AVAILABLE_COUPONS.find(c => c.code === normalizedCode)
    if (!found) {
      return { success: false, message: "Cupom inválido ou expirado" }
    }
    setAppliedCoupon(found)
    return { success: true, message: `Cupom ${found.code} aplicado!` }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0
    const subtotal = getTotalPrice()
    if (appliedCoupon.type === "percent") {
      return subtotal * (appliedCoupon.value / 100)
    }
    return Math.min(appliedCoupon.value, subtotal)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => {
      return total + item.colors.reduce((colorTotal, color) => {
        return colorTotal + color.sizes.reduce((sizeTotal, size) => {
          return sizeTotal + size.quantity
        }, 0)
      }, 0)
    }, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemQuantity = item.colors.reduce((colorTotal, color) => {
        return colorTotal + color.sizes.reduce((sizeTotal, size) => {
          return sizeTotal + size.quantity
        }, 0)
      }, 0)
      return total + (item.price * itemQuantity)
    }, 0)
  }

  const getItemsByProduct = (productId: string) => {
    return items.find(item => item.id === productId)
  }

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getItemsByProduct,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      getCouponDiscount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
