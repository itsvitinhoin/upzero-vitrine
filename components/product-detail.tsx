"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Share2, Heart, Ruler, X, Minus, Plus, Truck, ShoppingBag, Store, TrendingUp, Eye, MousePointerClick, Users, Award } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

interface ProductDetailProps {
  productId: string
}

const productData = {
  name: "BLUSA MANGA LONGA TULE SOFT STRETCH ONÇA",
  tag: "NEW IN",
  price: 89.90,
  pixDiscount: 0.10,
  installments: 5,
  shortDescription: "Blusa manga longa confeccionada em tule soft stretch com estampa onça, trazendo leveza, elasticidade e um visual sofisticado. Possui fechamento posterior em botões e modelagem ajustada que valoriza a silhueta.",
  details: [
    "Blusa manga longa",
    "Confeccionada em tule soft stretch",
    "Modelagem ajustada ao corpo",
    "Estampa onça",
    "Fechamento posterior em botões",
    "Tecido leve, confortável e com elasticidade",
  ],
  fabric: "Tule",
  composition: "96% Poliéster, 4% Elastano",
  description: "Peça ideal para compor looks de trabalho ou eventos especiais. A estampa onça adiciona um toque de sofisticação único, enquanto o caimento ajustado garante elegância durante todo o dia.",
  care: [
    "Lavar à mão ou na máquina em ciclo delicado",
    "Não usar alvejante",
    "Secar à sombra",
    "Passar em temperatura média",
  ],
  images: [1, 2, 3, 4, 5, 6],
  sizes: ["P 38", "M 40", "G 42", "GG 44"],
  colors: [
    { name: "Ameixa Dark", color: "#6B3654", available: { "P 38": false, "M 40": true, "G 42": true, "GG 44": true } },
    { name: "Bronze Almond", color: "#C4A77D", available: { "P 38": false, "M 40": true, "G 42": true, "GG 44": true } },
    { name: "Verde Pradera", color: "#4A7C59", available: { "P 38": true, "M 40": true, "G 42": true, "GG 44": true } },
  ],
  measurements: {
    "P 38": { busto: "86cm", cintura: "68cm", quadril: "94cm", comprimento: "62cm" },
    "M 40": { busto: "90cm", cintura: "72cm", quadril: "98cm", comprimento: "64cm" },
    "G 42": { busto: "94cm", cintura: "76cm", quadril: "102cm", comprimento: "66cm" },
    "GG 44": { busto: "98cm", cintura: "80cm", quadril: "106cm", comprimento: "68cm" },
  },
  demandStats: {
    varejoClicks: 1589,
    productViews: 8432,
    weeklyGrowth: 42,
    resellersOrdered: 37,
    wishlisted: 214,
    rankingPosition: 3,
    rankingCategory: "Blusas",
  },
  relatedProducts: [
    { id: "6", name: "VESTIDO MIDI CREPE ACETINADO", tag: "NEW IN", price: 129.90 },
    { id: "7", name: "BLAZER ALFAIATARIA KOBE", tag: "NEW IN", price: 189.90 },
  ],
  moreProducts: [
    { id: "8", name: "CALÇA PANTALONA CREPE", price: 99.90, colors: ["#2C2420", "#C4A77D", "#F5F3F0"] },
    { id: "9", name: "BLUSA REGATA CANELADA", price: 49.90, colors: ["#6B3654", "#4A7C59", "#C4A77D"] },
    { id: "10", name: "SAIA MIDI PLISSADA", price: 79.90, colors: ["#2C2420", "#8B7355"] },
    { id: "11", name: "VESTIDO LONGO ESTAMPADO", price: 159.90, colors: ["#6B3654", "#4A7C59"] },
    { id: "12", name: "JAQUETA JEANS OVERSIZED", price: 139.90, colors: ["#5C7A99", "#2C2420"] },
    { id: "13", name: "TOP CROPPED TRICOT", price: 59.90, colors: ["#F5F3F0", "#C4A77D", "#6B3654"] },
  ],
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [currentPair, setCurrentPair] = useState(0)
  const [expandedSection, setExpandedSection] = useState<string | null>("details")
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [cep, setCep] = useState("")
  const [shippingResult, setShippingResult] = useState<{ prazo: string; valor: string } | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  
  // Grade de quantidades: { "colorName-size": quantity }
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const totalPairs = Math.ceil(productData.images.length / 2)
  const pixPrice = productData.price * (1 - productData.pixDiscount)
  const installmentValue = productData.price / productData.installments

  const nextPair = () => setCurrentPair((prev) => (prev + 1) % totalPairs)
  const prevPair = () => setCurrentPair((prev) => (prev - 1 + totalPairs) % totalPairs)
  const toggleSection = (section: string) => setExpandedSection(expandedSection === section ? null : section)

  const currentImages = [
    productData.images[currentPair * 2],
    productData.images[currentPair * 2 + 1],
  ].filter(Boolean)

  const updateQuantity = (colorName: string, size: string, delta: number) => {
    const key = `${colorName}-${size}`
    setQuantities(prev => {
      const current = prev[key] || 0
      const newValue = Math.max(0, current + delta)
      return { ...prev, [key]: newValue }
    })
  }

  const getQuantity = (colorName: string, size: string) => {
    return quantities[`${colorName}-${size}`] || 0
  }

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0)
  const subtotal = totalItems * productData.price

  const calculateShipping = () => {
    if (cep.length >= 8) {
      setShippingResult({ prazo: "5 a 8 dias úteis", valor: "R$ 18,90" })
    }
  }

  const handleAddToCart = () => {
    if (totalItems === 0) return

    const colorsWithQuantities = productData.colors
      .map(color => ({
        name: color.name,
        hex: color.color,
        sizes: productData.sizes
          .map(size => ({
            size,
            quantity: getQuantity(color.name, size),
            available: color.available[size as keyof typeof color.available]
          }))
          .filter(s => s.quantity > 0)
      }))
      .filter(c => c.sizes.length > 0)

    if (colorsWithQuantities.length > 0) {
      addItem({
        id: productId,
        name: productData.name,
        price: productData.price,
        colors: colorsWithQuantities
      })
      
      // Reset quantities after adding
      setQuantities({})
    }
  }

  const nextCarousel = () => {
    const maxIndex = Math.max(0, productData.moreProducts.length - 4)
    setCarouselIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevCarousel = () => {
    setCarouselIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row">
        {/* Left - Image Gallery */}
        <div className="relative lg:w-[60%] flex">
          <button
            onClick={prevPair}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/60 rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
          >
            <ChevronLeft size={28} className="text-gray-700" />
          </button>

          <div className="flex w-full">
            {currentImages.map((_, index) => (
              <div key={index} className="w-1/2 aspect-[3/4] bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
              </div>
            ))}
            {currentImages.length === 1 && (
              <div className="w-1/2 aspect-[3/4] bg-gray-50" />
            )}
          </div>

          <button
            onClick={nextPair}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/60 rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
          >
            <ChevronRight size={28} className="text-gray-700" />
          </button>

          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <button className="p-2 hover:opacity-70 text-gray-500">
              <Share2 size={20} />
            </button>
            <button className="p-2 hover:opacity-70 text-gray-500">
              <Heart size={20} />
            </button>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="lg:w-[40%] px-4 md:px-8 lg:px-10 py-6 lg:py-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-xs text-gray-500 mb-4 flex-wrap">
            <Link href="/" className="hover:text-gray-900 underline">Início</Link>
            <span className="mx-2">/</span>
            <Link href="/catalogo" className="hover:text-gray-900 underline">Catálogo Completo</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 uppercase text-[11px]">{productData.name}</span>
          </div>

          {/* Product Name */}
          <h1 className="text-lg font-medium text-gray-900 uppercase tracking-wide mb-3 leading-tight">
            {productData.name}
          </h1>

          {/* Tag */}
          {productData.tag && (
            <span className="inline-block bg-black text-white text-[10px] px-3 py-1.5 tracking-wider mb-4">
              {productData.tag}
            </span>
          )}

          {/* Price Section - Only for logged in users */}
          {isAuthenticated ? (
            <div className="mb-5">
              <p className="text-2xl font-semibold text-gray-900">
                R$ {productData.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="text-green-600 font-medium">
                  10% OFF no PIX: R$ {pixPrice.toFixed(2).replace(".", ",")}
                </span>
                <span className="mx-2">|</span>
                <span>{productData.installments}x de R$ {installmentValue.toFixed(2).replace(".", ",")} sem juros</span>
              </p>
            </div>
          ) : (
            <Link href="/login" className="block text-sm text-gray-900 underline mb-5 cursor-pointer hover:text-gray-600 font-medium">
              Cadastre-se para ver o preço
            </Link>
          )}

          {/* Short Description */}
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {productData.shortDescription}
          </p>

          {/* Measurements Link */}
          <button 
            onClick={() => setShowMeasurements(true)}
            className="flex items-center gap-2 text-sm text-gray-900 underline mb-6 hover:text-gray-600"
          >
            <Ruler size={18} />
            Guia de medidas
          </button>

          {/* Compre no Varejo - apenas para consumidor final (não logado) */}
          {!isAuthenticated && (
            <Link
              href={`/varejo?produto=${productId}&nome=${encodeURIComponent(productData.name)}`}
              className="flex items-center justify-between gap-3 mb-6 p-4 rounded-lg border border-[#8B7355]/30 bg-[#F5F1EC] hover:bg-[#efe8df] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Store size={20} className="text-[#8B7355]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2420]">Compre no varejo</p>
                  <p className="text-xs text-gray-600">Encontre revendedores que vendem esta peça</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#8B7355] group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Demand Insights - Only for logged in resellers */}
          {isAuthenticated && (
            <div className="mb-6 rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[#2C2420]">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">
                    Dados de procura
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  +{productData.demandStats.weeklyGrowth}% na semana
                </span>
              </div>

              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                <div className="p-4 flex items-start gap-3">
                  <MousePointerClick size={18} className="text-[#8B7355] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 leading-none">
                      {productData.demandStats.varejoClicks.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      cliques em Compre no Varejo
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3">
                  <Eye size={18} className="text-[#8B7355] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 leading-none">
                      {productData.demandStats.productViews.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      visualizações do produto
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3">
                  <Users size={18} className="text-[#8B7355] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 leading-none">
                      {productData.demandStats.resellersOrdered}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      revendedores já pediram
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3">
                  <Award size={18} className="text-[#8B7355] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 leading-none">
                      #{productData.demandStats.rankingPosition}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      mais procurado em {productData.demandStats.rankingCategory}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F1EC] border-t border-gray-100">
                <Heart size={13} className="text-[#8B7355]" />
                <p className="text-[11px] text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {productData.demandStats.wishlisted}
                  </span>{" "}
                  revendedores adicionaram à lista de desejos
                </p>
              </div>
            </div>
          )}

          {/* Size Grid - Only for logged in users */}
          {isAuthenticated && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-wide">
                Deslize para ver todos os tamanhos →
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase py-3 px-2 w-32">Cor</th>
                      {productData.sizes.map(size => (
                        <th key={size} className="text-center text-xs font-medium text-gray-500 uppercase py-3 px-2">{size}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {productData.colors.map((color) => (
                      <tr key={color.name} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-4 h-4 rounded-full border border-gray-200" 
                              style={{ backgroundColor: color.color }}
                            />
                            <span className="text-xs text-gray-700 truncate max-w-[80px]">{color.name}</span>
                          </div>
                        </td>
                        {productData.sizes.map(size => {
                          const isAvailable = color.available[size as keyof typeof color.available]
                          const qty = getQuantity(color.name, size)
                          
                          return (
                            <td key={size} className="py-3 px-2 text-center">
                              {isAvailable ? (
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateQuantity(color.name, size, -1)}
                                    className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center text-sm">{qty}</span>
                                  <button
                                    onClick={() => updateQuantity(color.name, size, 1)}
                                    className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="font-medium">Legenda:</span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></span>
                  Disponível
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">-</span>
                  Esgotado
                </span>
              </div>
            </div>
          )}

          {/* Shipping Calculator - Only for logged in users */}
          {isAuthenticated && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Truck size={18} />
                Calcular Frete
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="Digite seu CEP"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  onClick={calculateShipping}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  Calcular
                </button>
              </div>
              {shippingResult && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Prazo:</span> {shippingResult.prazo}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Valor:</span> {shippingResult.valor}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Accordion Sections */}
          <div className="border-t border-gray-200">
            {/* Detalhes */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection("details")} className="w-full flex items-center justify-between py-4">
                <span className="text-sm font-medium text-gray-900">Detalhes</span>
                {expandedSection === "details" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === "details" && (
                <div className="pb-4">
                  <ul className="space-y-1.5 mb-3">
                    {productData.details.map((detail, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>{detail}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Tecido:</span> {productData.fabric}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Composição:</span> {productData.composition}
                  </p>
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection("description")} className="w-full flex items-center justify-between py-4">
                <span className="text-sm font-medium text-gray-900">Descrição</span>
                {expandedSection === "description" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === "description" && (
                <div className="pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{productData.description}</p>
                </div>
              )}
            </div>

            {/* Cuidados */}
            <div className="border-b border-gray-200">
              <button onClick={() => toggleSection("care")} className="w-full flex items-center justify-between py-4">
                <span className="text-sm font-medium text-gray-900">Cuidados</span>
                {expandedSection === "care" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === "care" && (
                <div className="pb-4">
                  <ul className="space-y-1.5">
                    {productData.care.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Compre o Look */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Compre o look</h2>
            <div className="grid grid-cols-2 gap-4">
              {productData.relatedProducts.map((product) => (
                <Link key={product.id} href={`/produto/${product.id}`} className="group">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-2">
                    <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                    {product.tag && (
                      <div className="absolute top-0 left-0 bg-black text-white text-[8px] px-1 py-2">
                        <span className="writing-mode-vertical rotate-180 block">{product.tag}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 uppercase tracking-wide leading-tight">{product.name}</p>
                  {isAuthenticated && (
                    <p className="text-sm font-medium text-gray-900 mt-1">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* More Products Carousel */}
      <div className="px-4 md:px-8 lg:px-12 py-10 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Você também pode gostar</h2>
          <div className="flex gap-2">
            <button 
              onClick={prevCarousel}
              disabled={carouselIndex === 0}
              className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextCarousel}
              disabled={carouselIndex >= productData.moreProducts.length - 4}
              className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-300"
            style={{ transform: `translateX(-${carouselIndex * 25}%)` }}
          >
            {productData.moreProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/produto/${product.id}`} 
                className="group flex-shrink-0 w-[calc(25%-12px)]"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-colors" />
                </div>
                <div className="flex gap-1 mb-2">
                  {product.colors.map((color, i) => (
                    <span key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="text-xs text-gray-700 uppercase tracking-wide leading-tight mb-1">{product.name}</p>
                {isAuthenticated && (
                  <p className="text-sm font-medium text-gray-900">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Cart Bar - Only when items selected */}
      {isAuthenticated && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{totalItems}</span> peças selecionadas
              </p>
              <p className="text-lg font-semibold text-gray-900">
                Subtotal: R$ {subtotal.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingBag size={20} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      )}

      {/* Measurements Modal */}
      {showMeasurements && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Guia de Medidas</h3>
              <button onClick={() => setShowMeasurements(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Tamanho</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase py-2">Busto</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase py-2">Cintura</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase py-2">Quadril</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase py-2">Comp.</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(productData.measurements).map(([size, measures]) => (
                    <tr key={size} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium text-gray-900">{size}</td>
                      <td className="py-3 text-sm text-gray-600 text-center">{measures.busto}</td>
                      <td className="py-3 text-sm text-gray-600 text-center">{measures.cintura}</td>
                      <td className="py-3 text-sm text-gray-600 text-center">{measures.quadril}</td>
                      <td className="py-3 text-sm text-gray-600 text-center">{measures.comprimento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">
                * As medidas podem variar de acordo com o modelo da peça. Em caso de dúvidas, entre em contato conosco.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
