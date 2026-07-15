"use client"

import { ProductCard } from "./product-card"

interface ComfyLooksSectionProps {
  title?: string
}

const products = [
  {
    name: "CASACO BICOLOR NEOTECH LIGHT",
    colors: [
      { name: "Branco", color: "#FFFFFF" },
      { name: "Vermelho", color: "#C41E3A" },
      { name: "Laranja", color: "#E07B3C" },
    ],
  },
  {
    name: "REGATA BICOLOR NEOTECH LIGHT",
    colors: [
      { name: "Azul", color: "#1E40AF" },
      { name: "Branco", color: "#FFFFFF" },
      { name: "Amarelo", color: "#EAB308" },
    ],
  },
  {
    name: "BERMUDA BICOLOR COM RECORTES NEOTECH L...",
    colors: [
      { name: "Verde", color: "#4B5320" },
      { name: "Vermelho", color: "#C41E3A" },
      { name: "Laranja", color: "#E07B3C" },
      { name: "Branco", color: "#FFFFFF" },
    ],
  },
  {
    name: "CALÇA CÓS COM ELÁSTICO ICONIC",
    colors: [
      { name: "Bege", color: "#D4C4B0" },
      { name: "Preto", color: "#000000" },
      { name: "Azul", color: "#1E40AF" },
    ],
  },
]

export function ComfyLooksSection({ title = "Comfy Looks" }: ComfyLooksSectionProps) {
  return (
    <section className="bg-white py-10">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
            Ver todos
          </a>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              colors={product.colors}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
