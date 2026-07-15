"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Grid3X3, LayoutGrid } from "lucide-react"
import { CatalogProductCard } from "./catalog-product-card"

const filters = [
  { label: "COR", options: ["Preto", "Marrom", "Bege", "Verde", "Vermelho"] },
  { label: "TAMANHO", options: ["PP", "P", "M", "G", "GG"] },
  { label: "COLEÇÃO", options: ["Inverno 2024", "Verão 2024", "Outono 2024"] },
  { label: "TIPO", options: ["Blusa", "Calça", "Vestido", "Saia", "Blazer"] },
  { label: "TECIDO", options: ["Crepe", "Algodão", "Seda", "Linho", "Viscose"] },
]

const sortOptions = [
  "Menor relevância",
  "Maior relevância",
  "Menor preço",
  "Maior preço",
  "Mais recentes",
]

const products = [
  {
    id: "1",
    name: "BLUSA MANGA LONGA TULE SOFT STRETCH ONÇA",
    colors: [{ name: "Onça", color: "#8B7355" }],
    tag: "NEW IN",
    colorLabel: "ONÇA",
    demand: "hot" as const,
  },
  {
    id: "2",
    name: "CALÇA PALA FRANZIDO TULE SOFT STRETCH ONÇA",
    colors: [
      { name: "Marrom", color: "#5D4037" },
      { name: "Preto", color: "#1a1a1a" },
      { name: "Onça", color: "#8B7355" },
    ],
    tag: "NEW IN",
    colorLabel: "ONÇA",
    demand: "rising" as const,
  },
  {
    id: "3",
    name: "COLETE UTILITY TWILL",
    colors: [
      { name: "Verde", color: "#4a7c59" },
      { name: "Laranja", color: "#e67e22" },
      { name: "Bege", color: "#d4c4b0" },
    ],
    tag: "NEW IN",
  },
  {
    id: "4",
    name: "MACACAO COM TOP COTTON VERSATILE",
    colors: [
      { name: "Marrom", color: "#5D4037" },
      { name: "Vinho", color: "#722f37" },
      { name: "Bege", color: "#d4c4b0" },
      { name: "Nude", color: "#e8d4c4" },
      { name: "Caramelo", color: "#c68642" },
    ],
    tag: "NEW IN",
    demand: "hot" as const,
  },
  {
    id: "5",
    name: "BLUSA COM LENÇO PATU TAILORING",
    colors: [
      { name: "Off White", color: "#f5f5f0" },
      { name: "Marrom", color: "#5D4037" },
    ],
    tag: "NEW IN",
  },
  {
    id: "6",
    name: "VESTIDO MIDI CREPE ACETINADO",
    colors: [
      { name: "Vermelho", color: "#b22234" },
      { name: "Preto", color: "#1a1a1a" },
    ],
    tag: "NEW IN",
    demand: "rising" as const,
  },
  {
    id: "7",
    name: "BLAZER ALFAIATARIA KOBE",
    colors: [
      { name: "Laranja", color: "#e67e22" },
      { name: "Bege", color: "#d4c4b0" },
    ],
    tag: "NEW IN",
  },
  {
    id: "8",
    name: "JAQUETA DE TRICOT",
    colors: [
      { name: "Off White", color: "#f5f5f0" },
      { name: "Preto", color: "#1a1a1a" },
    ],
    tag: "NEW IN",
  },
]

export function CatalogContent() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [sortOpen, setSortOpen] = useState(false)
  const [gridCols, setGridCols] = useState<4 | 3>(4)

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      {/* Title */}
      <h1 className="text-2xl font-serif text-center tracking-[0.2em] text-gray-900 mb-6">
        CATÁLOGO COMPLETO
      </h1>

      {/* Breadcrumb */}
      <div className="flex items-center text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900 underline">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">CATÁLOGO COMPLETO</span>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-4 mb-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {filters.map((filter) => (
            <div key={filter.label} className="relative">
              <button
                onClick={() => setActiveFilter(activeFilter === filter.label ? null : filter.label)}
                className="flex items-center text-xs tracking-wide text-gray-700 hover:text-gray-900 transition-colors"
              >
                {filter.label}
                <ChevronDown size={12} className="ml-1" />
              </button>

              {activeFilter === filter.label && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-100 py-2 min-w-[120px] z-40">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setActiveFilter(null)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sort and Grid options */}
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span className="text-xs text-gray-500 hidden md:block">
            Classificar 115 produtos por
          </span>
          
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center text-xs text-gray-700 hover:text-gray-900"
            >
              {selectedSort}
              <ChevronDown size={12} className="ml-1" />
            </button>

            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg border border-gray-100 py-2 min-w-[150px] z-40">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setSelectedSort(option)
                      setSortOpen(false)
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid toggle */}
          <div className="flex items-center border-l border-gray-300 pl-4">
            <button
              onClick={() => setGridCols(4)}
              className={`p-1 ${gridCols === 4 ? "text-gray-900" : "text-gray-400"}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-1 ${gridCols === 3 ? "text-gray-900" : "text-gray-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`grid gap-6 ${
        gridCols === 4 
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}>
        {products.map((product) => (
          <CatalogProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            colors={product.colors}
            tag={product.tag}
            colorLabel={product.colorLabel}
            demand={product.demand}
          />
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center mt-12">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 text-sm ${
                page === 1
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <span className="text-gray-500">...</span>
          <button className="w-8 h-8 text-sm text-gray-700 hover:bg-gray-100">
            12
          </button>
        </div>
      </div>
    </div>
  )
}
