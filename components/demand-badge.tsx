import { Flame, TrendingUp } from "lucide-react"

export type DemandLevel = "hot" | "rising"

interface DemandConfig {
  label: string
  badgeClass: string
  borderClass: string
  Icon: typeof Flame
}

export const DEMAND_CONFIG: Record<DemandLevel, DemandConfig> = {
  hot: {
    label: "MAIS PROCURADO",
    badgeClass: "bg-[#C75B39] text-white",
    borderClass: "ring-2 ring-[#C75B39]",
    Icon: Flame,
  },
  rising: {
    label: "EM ALTA",
    badgeClass: "bg-[#8B7355] text-white",
    borderClass: "ring-1 ring-[#8B7355]",
    Icon: TrendingUp,
  },
}

export function DemandBadge({
  level,
  className = "",
}: {
  level: DemandLevel
  className?: string
}) {
  const config = DEMAND_CONFIG[level]
  const { Icon } = config

  return (
    <div
      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 tracking-wide rounded-sm ${config.badgeClass} ${className}`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {config.label}
    </div>
  )
}
