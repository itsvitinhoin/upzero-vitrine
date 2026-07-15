"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { DemandBadge, DEMAND_CONFIG, type DemandLevel } from "./demand-badge"

interface ColorOption {
  name: string
  color: string
}

interface CatalogProductCardProps {
  id: string
  name: string
  colors: ColorOption[]
  tag?: string
  colorLabel?: string
  price?: number
  sizes?: string[]
  demand?: DemandLevel
}

export function CatalogProductCard({
  id,
  name,
  colors,
  tag,
  colorLabel,
  price = 89.90,
  sizes = ["P", "M", "G", "GG"],
  demand,
}: CatalogProductCardProps) {
  const { isAuthenticated } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)

  return (
    <Link href={`/produto/${id}`} className="group cursor-pointer block">
      {/* Image container with hover effect */}
      <div
        className={`relative bg-gray-100 overflow-hidden mb-3 aspect-[3/4] ${
          demand ? DEMAND_CONFIG[demand].borderClass : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Primary image placeholder */}
        <div
          className={`absolute inset-0 bg-gray-200 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        
        {/* Secondary image placeholder (shown on hover) */}
        <div
          className={`absolute inset-0 bg-gray-300 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Tag badge - vertical on left side */}
        {tag && (
          <div className="absolute top-4 left-0 bg-black text-white text-[10px] px-1.5 py-2 tracking-wide writing-mode-vertical">
            <span className="[writing-mode:vertical-rl] rotate-180">{tag}</span>
          </div>
        )}

        {/* Demand badge */}
        {demand && <DemandBadge level={demand} className="absolute top-3 right-3" />}
      </div>

      {/* Color options and label */}
      <div className="flex items-center gap-2 mb-2">
        {colors.slice(0, 4).map((color, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault()
              setSelectedColor(index)
            }}
            className={`w-3 h-3 rounded-full border transition-all ${
              selectedColor === index
                ? "border-gray-900 ring-1 ring-offset-1 ring-gray-900"
                : "border-gray-300 hover:border-gray-500"
            }`}
            style={{ backgroundColor: color.color }}
            title={color.name}
          />
        ))}
        {colors.length > 4 && (
          <span className="text-xs text-gray-500">+</span>
        )}
        {colorLabel && (
          <>
            <span className="text-xs text-gray-400 ml-1">|</span>
            <span className="text-xs text-gray-600 uppercase tracking-wide">{colorLabel}</span>
          </>
        )}
      </div>

      {/* Product info */}
      <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide leading-tight mb-1">
        {name}
      </h3>
      
      {isAuthenticated ? (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            R$ {price.toFixed(2).replace(".", ",")}
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-gray-500">Tam:</span>
            {sizes.map((size) => (
              <span key={size} className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {size}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500 underline">Cadastre-se para ver o preco</p>
      )}

      {/* Demand reinforcement */}
      {demand && (
        <p className="text-[11px] text-[#8B7355] font-medium mt-1.5">
          {demand === "hot" ? "Alta procura de varejo esta semana" : "Procura crescente no varejo"}
        </p>
      )}
    </Link>
  )
}
