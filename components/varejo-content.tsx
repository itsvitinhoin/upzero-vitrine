"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Store, Globe, Phone, Loader2, Navigation, Package, ShoppingBag } from "lucide-react"

interface Reseller {
  id: string
  name: string
  city: string
  state: string
  neighborhood: string
  lat: number
  lng: number
  phone: string
  whatsapp: string
  online: boolean
  onlineUrl?: string
  specialties: string[]
}

// Base de revendedores (dados simulados)
const resellers: Reseller[] = [
  {
    id: "r1",
    name: "Boutique Elegance",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Jardins",
    lat: -23.561,
    lng: -46.656,
    phone: "(11) 3456-7890",
    whatsapp: "5511987654321",
    online: true,
    onlineUrl: "https://instagram.com/boutiqueelegance",
    specialties: ["Vestidos", "Festa"],
  },
  {
    id: "r2",
    name: "Moda & Estilo Store",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Moema",
    lat: -23.6,
    lng: -46.665,
    phone: "(11) 2345-6789",
    whatsapp: "5511976543210",
    online: false,
    specialties: ["Casual", "Work"],
  },
  {
    id: "r3",
    name: "Ateliê da Moda",
    city: "Guarulhos",
    state: "SP",
    neighborhood: "Centro",
    lat: -23.454,
    lng: -46.533,
    phone: "(11) 4567-8901",
    whatsapp: "5511965432109",
    online: true,
    onlineUrl: "https://instagram.com/ateliedamoda",
    specialties: ["Blusas", "Calças"],
  },
  {
    id: "r4",
    name: "Fashion Point",
    city: "Osasco",
    state: "SP",
    neighborhood: "Centro",
    lat: -23.532,
    lng: -46.792,
    phone: "(11) 5678-9012",
    whatsapp: "5511954321098",
    online: false,
    specialties: ["Vestidos", "Peças Únicas"],
  },
  {
    id: "r5",
    name: "Loja Charme",
    city: "Campinas",
    state: "SP",
    neighborhood: "Cambuí",
    lat: -22.905,
    lng: -47.06,
    phone: "(19) 3234-5678",
    whatsapp: "5519943210987",
    online: true,
    onlineUrl: "https://instagram.com/lojacharme",
    specialties: ["Casual", "New In"],
  },
  {
    id: "r6",
    name: "Rio Fashion",
    city: "Rio de Janeiro",
    state: "RJ",
    neighborhood: "Ipanema",
    lat: -22.984,
    lng: -43.198,
    phone: "(21) 3123-4567",
    whatsapp: "5521932109876",
    online: true,
    onlineUrl: "https://instagram.com/riofashion",
    specialties: ["Festa", "Vestidos"],
  },
  {
    id: "r7",
    name: "BH Moda Feminina",
    city: "Belo Horizonte",
    state: "MG",
    neighborhood: "Savassi",
    lat: -19.938,
    lng: -43.937,
    phone: "(31) 3012-3456",
    whatsapp: "5531921098765",
    online: false,
    specialties: ["Work", "Blusas"],
  },
  {
    id: "r8",
    name: "Sul Estilo",
    city: "Curitiba",
    state: "PR",
    neighborhood: "Batel",
    lat: -25.442,
    lng: -49.281,
    phone: "(41) 3098-7654",
    whatsapp: "5541910987654",
    online: true,
    onlineUrl: "https://instagram.com/sulestilo",
    specialties: ["Casual", "Calças"],
  },
  {
    id: "r9",
    name: "Nordeste Chic",
    city: "Recife",
    state: "PE",
    neighborhood: "Boa Viagem",
    lat: -8.119,
    lng: -34.905,
    phone: "(81) 3087-6543",
    whatsapp: "5581909876543",
    online: true,
    onlineUrl: "https://instagram.com/nordestechic",
    specialties: ["Vestidos", "Festa"],
  },
  {
    id: "r10",
    name: "Brasília Fashion",
    city: "Brasília",
    state: "DF",
    neighborhood: "Asa Sul",
    lat: -15.826,
    lng: -47.921,
    phone: "(61) 3076-5432",
    whatsapp: "5561908765432",
    online: false,
    specialties: ["Work", "Peças Únicas"],
  },
]

// Centróides aproximados por prefixo de CEP (primeiro dígito)
const cepRegions: Record<string, { lat: number; lng: number; label: string }> = {
  "0": { lat: -23.55, lng: -46.63, label: "São Paulo - SP" },
  "1": { lat: -22.9, lng: -47.06, label: "Interior de SP" },
  "2": { lat: -22.9, lng: -43.2, label: "Rio de Janeiro - RJ" },
  "3": { lat: -19.92, lng: -43.94, label: "Minas Gerais" },
  "4": { lat: -12.97, lng: -38.5, label: "Bahia" },
  "5": { lat: -8.05, lng: -34.88, label: "Pernambuco" },
  "6": { lat: -3.73, lng: -38.52, label: "Ceará" },
  "7": { lat: -15.79, lng: -47.88, label: "Centro-Oeste" },
  "8": { lat: -25.43, lng: -49.27, label: "Paraná / SC" },
  "9": { lat: -30.03, lng: -51.23, label: "Rio Grande do Sul" },
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const radiusOptions = [10, 25, 50, 100, 200]

// Revendedores que fizeram pedido de cada peça (dados simulados).
// Mapeia o id do produto -> ids dos revendedores que compraram a peça no atacado.
const productOrders: Record<string, string[]> = {
  "1": ["r1", "r3", "r6", "r8"],
  "6": ["r2", "r5", "r9"],
  "7": ["r1", "r4", "r10"],
}

// Fallback: caso a peça não esteja mapeada, mostramos alguns revendedores parceiros.
const defaultOrderResellers = ["r1", "r3", "r5"]

function getResellersForProduct(productId: string | null): string[] {
  if (!productId) return []
  return productOrders[productId] ?? defaultOrderResellers
}

interface ResellerWithDistance extends Reseller {
  distance: number
}

export function VarejoContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("produto")
  const productName = searchParams.get("nome")

  const [cep, setCep] = useState("")
  const [radius, setRadius] = useState(50)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")
  const [origin, setOrigin] = useState<{ lat: number; lng: number; label: string } | null>(null)
  const [nearby, setNearby] = useState<ResellerWithDistance[]>([])
  const [online, setOnline] = useState<ResellerWithDistance[]>([])

  // Revendedores que compraram esta peça no atacado, com distância se o CEP já foi buscado
  const orderedResellerIds = getResellersForProduct(productId)
  const orderedResellers: ResellerWithDistance[] = orderedResellerIds
    .map((id) => resellers.find((r) => r.id === id))
    .filter((r): r is Reseller => Boolean(r))
    .map((r) => ({
      ...r,
      distance: origin ? haversine(origin.lat, origin.lng, r.lat, r.lng) : 0,
    }))
    .sort((a, b) => a.distance - b.distance)

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8)
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`
    }
    return digits
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const digits = cep.replace(/\D/g, "")

    if (digits.length !== 8) {
      setError("Digite um CEP válido com 8 dígitos")
      return
    }

    setLoading(true)
    setSearched(false)

    // Simula geolocalização do CEP
    setTimeout(() => {
      const region = cepRegions[digits[0]] || cepRegions["0"]
      setOrigin(region)

      const withDistance: ResellerWithDistance[] = resellers.map((r) => ({
        ...r,
        distance: haversine(region.lat, region.lng, r.lat, r.lng),
      }))

      const nearbyList = withDistance
        .filter((r) => r.distance <= radius)
        .sort((a, b) => a.distance - b.distance)

      const onlineList = withDistance
        .filter((r) => r.online)
        .sort((a, b) => a.distance - b.distance)

      setNearby(nearbyList)
      setOnline(onlineList)
      setSearched(true)
      setLoading(false)
    }, 900)
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-[#F5F1EC] py-12 md:py-16">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            <span className="inline-block text-xs tracking-[0.2em] text-[#8B7355] font-semibold mb-3">
              PARA O VAREJO
            </span>
            {productName ? (
              <>
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 text-balance">
                  Onde comprar esta peça no varejo
                </h1>
                <p className="text-gray-600 leading-relaxed text-pretty">
                  Você está procurando por{" "}
                  <strong className="text-gray-900 uppercase">{productName}</strong>. Abaixo
                  mostramos os revendedores que já compraram essa peça no atacado. Informe seu
                  CEP para ver as lojas mais próximas ou que vendem online.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 text-balance">
                  Encontre um revendedor perto de você
                </h1>
                <p className="text-gray-600 leading-relaxed text-pretty">
                  Somos uma marca de <strong>atacado (B2B)</strong> e não realizamos vendas diretas
                  ao consumidor final. Mas você pode adquirir nossas peças através dos nossos
                  revendedores parceiros. Informe seu CEP para descobrir as lojas mais próximas ou
                  que vendem online.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="w-full px-4 md:px-8 lg:px-12 -mt-8">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-end"
        >
          <div className="flex-1">
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1.5">
              Seu CEP
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="cep"
                type="text"
                inputMode="numeric"
                value={cep}
                onChange={(e) => setCep(formatCep(e.target.value))}
                placeholder="00000-000"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#8B7355] transition-colors"
              />
            </div>
          </div>

          <div className="md:w-56">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1.5">
              Raio de busca
            </label>
            <div className="relative">
              <Navigation
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#8B7355] transition-colors appearance-none bg-white"
              >
                {radiusOptions.map((r) => (
                  <option key={r} value={r}>
                    Até {r} km
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2420] text-white font-medium rounded-lg hover:bg-[#3D322C] transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search size={18} />
                Buscar
              </>
            )}
          </button>
        </form>
        {error && <p className="text-sm text-red-600 mt-2 px-1">{error}</p>}
      </section>

      {/* Revendedores que compraram esta peça */}
      {productName && orderedResellers.length > 0 && (
        <section className="w-full px-4 md:px-8 lg:px-12 pt-10">
          <div className="rounded-xl border border-[#8B7355]/30 bg-[#F5F1EC] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag size={20} className="text-[#8B7355]" />
              <h2 className="text-xl font-serif text-gray-900">
                Revendedores que compraram esta peça
              </h2>
              <span className="text-sm text-gray-400">({orderedResellers.length})</span>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Estas lojas adquiriram{" "}
              <strong className="uppercase">{productName}</strong> no atacado e podem ter a peça
              disponível para você.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orderedResellers.map((r) => (
                <ResellerCard
                  key={r.id}
                  reseller={r}
                  showDistance={Boolean(origin)}
                  online={r.online}
                  highlightProduct={productName}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-10">
        {!searched && !loading && (
          <div className="text-center py-16 text-gray-400">
            <Store size={48} className="mx-auto mb-4 opacity-40" />
            <p>Digite seu CEP acima para encontrar revendedores.</p>
          </div>
        )}

        {searched && origin && (
          <>
            <p className="text-sm text-gray-500 mb-8">
              Mostrando resultados para{" "}
              <strong className="text-gray-900">{origin.label}</strong> · raio de{" "}
              <strong className="text-gray-900">{radius} km</strong>
            </p>

            {/* Nearby resellers */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <Store size={20} className="text-[#8B7355]" />
                <h2 className="text-xl font-serif text-gray-900">
                  Revendedores próximos
                </h2>
                <span className="text-sm text-gray-400">({nearby.length})</span>
              </div>

              {nearby.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  Nenhum revendedor físico encontrado nesse raio. Tente aumentar a distância
                  ou confira os revendedores online abaixo.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearby.map((r) => (
                    <ResellerCard key={r.id} reseller={r} showDistance />
                  ))}
                </div>
              )}
            </div>

            {/* Online resellers */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Globe size={20} className="text-[#8B7355]" />
                <h2 className="text-xl font-serif text-gray-900">
                  Revendedores que vendem online
                </h2>
                <span className="text-sm text-gray-400">({online.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {online.map((r) => (
                  <ResellerCard key={r.id} reseller={r} online />
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function ResellerCard({
  reseller,
  showDistance,
  online,
  highlightProduct,
}: {
  reseller: ResellerWithDistance
  showDistance?: boolean
  online?: boolean
  highlightProduct?: string | null
}) {
  const whatsappMsg = encodeURIComponent(
    highlightProduct
      ? `Olá! Encontrei a ${reseller.name} pela La Chocolé e gostaria de comprar a peça "${highlightProduct}" no varejo.`
      : `Olá! Encontrei a ${reseller.name} pela La Chocolé e gostaria de comprar peças no varejo.`,
  )

  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#F5F1EC] flex items-center justify-center flex-shrink-0">
            {online ? (
              <Globe size={20} className="text-[#8B7355]" />
            ) : (
              <Store size={20} className="text-[#8B7355]" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 leading-tight">{reseller.name}</h3>
            <p className="text-xs text-gray-500">
              {reseller.neighborhood}, {reseller.city} - {reseller.state}
            </p>
          </div>
        </div>
        {showDistance && (
          <span className="text-xs font-semibold text-[#8B7355] whitespace-nowrap bg-[#F5F1EC] px-2 py-1 rounded-full">
            {reseller.distance < 1
              ? "< 1 km"
              : `${Math.round(reseller.distance)} km`}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {reseller.specialties.map((s) => (
          <span
            key={s}
            className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
          >
            {s}
          </span>
        ))}
        {reseller.online && (
          <span className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Package size={11} /> Vende online
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <a
          href={`https://wa.me/${reseller.whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#1fb855] transition-colors"
        >
          <Phone size={16} />
          Falar no WhatsApp
        </a>
        {online && reseller.onlineUrl && (
          <a
            href={reseller.onlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe size={16} />
            Ver loja online
          </a>
        )}
      </div>
    </div>
  )
}
