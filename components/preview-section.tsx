"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"

const filters = ["NEW IN", "Casais", "Vestido", "Tudo"]

const products = [
  {
    name: "BLUSA MANGA LONGA TULE SOFT STRETCH ONÇA",
    colors: [
      { name: "Onça", color: "#8B7355" },
    ],
    tag: "ONÇA",
    demand: "hot" as const,
  },
  {
    name: "CALÇA PALA FRANZIDO TULE SOFT STRETCH ONÇA",
    colors: [
      { name: "Onça", color: "#8B7355" },
    ],
    tag: "ONÇA",
  },
  {
    name: "BLAZER ALFAIATARIA KOBE",
    colors: [
      { name: "Terracota", color: "#C75B39" },
      { name: "Preto", color: "#000000" },
    ],
    demand: "rising" as const,
  },
  {
    name: "JAQUETA DE TRICOT",
    colors: [
      { name: "Laranja", color: "#E07B3C" },
      { name: "Bege", color: "#D4C4B0" },
      { name: "Preto", color: "#000000" },
    ],
  },
]

export function PreviewSection() {
  const [activeFilter, setActiveFilter] = useState("NEW IN")

  return (
    <section className="bg-white py-10">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-1">Preview de Inverno</h2>
          <p className="text-sm text-gray-500 mb-4">
            Descubra as novidades que antecipam o mix da estação
          </p>

          {/* Filter tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-xs rounded-full border transition-all ${
                    activeFilter === filter
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Ver todos
            </a>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              colors={product.colors}
              tag={product.tag}
              demand={product.demand}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
