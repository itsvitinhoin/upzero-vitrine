"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, User, ShoppingBag, ChevronDown, ChevronLeft, ChevronRight, Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

const announcements = [
  "PARCELAMENTO EM ATÉ 3X SEM JUROS",
  "FRETE GRÁTIS ACIMA DE R$ 499",
  "TROCA GRÁTIS EM TODO BRASIL",
]

interface SubCategory {
  label: string
  href: string
}

interface MenuItem {
  label: string
  href: string
  hasDropdown?: boolean
  subcategories?: SubCategory[]
}

const menuItems: MenuItem[] = [
  { label: "CATÁLOGO COMPLETO", href: "/catalogo" },
  { 
    label: "NEW IN", 
    href: "/catalogo?filter=new", 
    hasDropdown: true,
    subcategories: [
      { label: "Blusas", href: "/catalogo?categoria=blusas" },
      { label: "Vestidos", href: "/catalogo?categoria=vestidos" },
      { label: "Calças", href: "/catalogo?categoria=calcas" },
    ]
  },
  { 
    label: "PARTE DE CIMA", 
    href: "/catalogo?tipo=parte-de-cima", 
    hasDropdown: true,
    subcategories: [
      { label: "Blusas", href: "/catalogo?categoria=blusas" },
      { label: "Camisas", href: "/catalogo?categoria=camisas" },
      { label: "Blazers", href: "/catalogo?categoria=blazers" },
      { label: "Coletes", href: "/catalogo?categoria=coletes" },
    ]
  },
  { 
    label: "PARTE DE BAIXO", 
    href: "/catalogo?tipo=parte-de-baixo", 
    hasDropdown: true,
    subcategories: [
      { label: "Calças", href: "/catalogo?categoria=calcas" },
      { label: "Saias", href: "/catalogo?categoria=saias" },
      { label: "Shorts", href: "/catalogo?categoria=shorts" },
    ]
  },
  { 
    label: "PEÇAS ÚNICAS", 
    href: "/catalogo?tipo=pecas-unicas", 
    hasDropdown: true,
    subcategories: [
      { label: "Vestidos", href: "/catalogo?categoria=vestidos" },
      { label: "Macacões", href: "/catalogo?categoria=macacoes" },
      { label: "Conjuntos", href: "/catalogo?categoria=conjuntos" },
    ]
  },
  { 
    label: "SHOP THE LOOK", 
    href: "/catalogo?tipo=shop-the-look", 
    hasDropdown: true,
    subcategories: [
      { label: "Work", href: "/catalogo?look=work" },
      { label: "Casual", href: "/catalogo?look=casual" },
      { label: "Festa", href: "/catalogo?look=festa" },
    ]
  },
  { label: "VAREJO", href: "/varejo" },
]

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { openCart, getTotalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
  }

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-[#8B7355] text-white text-center py-2 text-xs tracking-wide relative">
        <button 
          onClick={prevAnnouncement}
          className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-70"
        >
          <ChevronLeft size={16} />
        </button>
        <span>{mounted ? announcements[currentAnnouncement] : announcements[0]}</span>
        <button 
          onClick={nextAnnouncement}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-serif tracking-[0.3em] text-gray-900">
                LA CHOCOLÉ
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center text-xs tracking-wide transition-colors py-4 ${
                      item.label === "VAREJO"
                        ? "text-[#8B7355] font-semibold hover:text-[#6d5a42]"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={12} className="ml-1" />}
                  </Link>

                  {/* Dropdown */}
                  {item.hasDropdown && item.subcategories && activeDropdown === item.label && (
                    <div 
                      className="absolute top-full left-0 bg-white shadow-lg border border-gray-100 py-2 min-w-[150px] z-50"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:flex items-center">
                {searchOpen && (
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-32 text-sm border-b border-gray-300 focus:border-gray-900 outline-none pr-2 py-1 transition-all"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                )}
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1 hover:opacity-70 transition-opacity"
                >
                  <Search size={20} className="text-gray-700" />
                </button>
              </div>
              <button className="p-1 hover:opacity-70 transition-opacity">
                <Heart size={20} className="text-gray-700" />
              </button>
              
              {/* User menu */}
              <div className="relative hidden sm:block">
                {mounted && isAuthenticated ? (
                  <div>
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 hover:opacity-70 transition-opacity"
                    >
                      <div className="w-7 h-7 bg-[#8B7355] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    </button>
                    
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white shadow-lg border border-gray-100 rounded-lg py-2 min-w-[200px] z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.document}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="p-1 hover:opacity-70 transition-opacity">
                    <User size={20} className="text-gray-700" />
                  </Link>
                )}
              </div>
              <button 
                onClick={openCart}
                className="p-1 hover:opacity-70 transition-opacity relative"
              >
                <ShoppingBag size={20} className="text-gray-700" />
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {getTotalItems() > 99 ? "99+" : getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            {menuItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown size={14} />}
                </Link>
                {item.subcategories && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Área do perfil (mobile) */}
            <div className="pt-4 mt-2 border-t border-gray-100">
              {mounted && isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.document}</p>
                    </div>
                  </div>
                  <Link
                    href="/carrinho"
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag size={16} />
                    Meu carrinho
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  Entrar / Cadastrar
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
