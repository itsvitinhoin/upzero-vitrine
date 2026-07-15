"use client"

import { Package, Truck, CreditCard, Heart } from "lucide-react"

const benefits = [
  {
    icon: Package,
    title: "Pedido Mínimo",
    description: "A partir de 6 unidades",
  },
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Acima de R$ 499,00",
  },
  {
    icon: CreditCard,
    title: "Pagamento",
    description: "Em até 3x sem juros",
  },
  {
    icon: Heart,
    title: "Made in Brazil",
    description: "Produção Nacional",
  },
]

export function BenefitsBar() {
  return (
    <section className="bg-white py-6 border-b border-gray-100">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <benefit.icon size={24} className="text-gray-400 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
                <p className="text-xs text-gray-500">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
