"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Copy, Check } from "lucide-react"

interface OrderData {
  orderNumber: string
  totalItems: number
  totalPrice: number
  paymentMethod: string
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    cep: string
  }
  shipping: {
    name: string
    days: string
    price: number
  }
  items: Array<{
    id: string
    name: string
    price: number
    colors: Array<{
      name: string
      hex: string
      sizes: Array<{
        size: string
        quantity: number
      }>
    }>
  }>
  observations: string
  createdAt: string
}

const salesRep = {
  name: "Maria Silva",
  phone: "5511999999999",
  email: "maria.silva@lachocole.com.br",
  photo: null
}

export function ThankYouPage() {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder")
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder))
      } catch (e) {
        console.error("Error loading order:", e)
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const generateWhatsAppMessage = () => {
    if (!order) return ""

    let message = `*NOVO PEDIDO - ${order.orderNumber}*\n\n`
    message += `Data: ${formatDate(order.createdAt)}\n`
    message += `Total de Peças: ${order.totalItems}\n`
    message += `Valor Total: ${formatPrice(order.totalPrice)}\n\n`
    
    message += `*ENDEREÇO DE ENTREGA:*\n`
    message += `${order.address.street}, ${order.address.number}`
    if (order.address.complement) message += ` - ${order.address.complement}`
    message += `\n${order.address.neighborhood} - ${order.address.city}/${order.address.state}\n`
    message += `CEP: ${order.address.cep}\n\n`

    message += `*FORMA DE PAGAMENTO:*\n`
    if (order.paymentMethod === "pix") message += "PIX (10% desconto)\n"
    if (order.paymentMethod === "boleto") message += "Boleto Bancário\n"
    if (order.paymentMethod === "card") message += "Cartão de Crédito (5x sem juros)\n"
    message += `\n`

    message += `*PRODUTOS:*\n`
    order.items.forEach(item => {
      const itemQty = item.colors.reduce((t, c) => t + c.sizes.reduce((st, s) => st + s.quantity, 0), 0)
      message += `\n${item.name} - ${itemQty} peças\n`
      item.colors.forEach(color => {
        const sizesText = color.sizes.map(s => `${s.size.split(" ")[0]}(${s.quantity})`).join(", ")
        message += `  ${color.name}: ${sizesText}\n`
      })
    })

    if (order.observations) {
      message += `\n*OBSERVAÇÕES:*\n${order.observations}\n`
    }

    return encodeURIComponent(message)
  }

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-gray-500">Carregando informações do pedido...</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-light text-gray-900 mb-3">
            Obrigado pelo seu pedido!
          </h1>
          
          <p className="text-gray-600 mb-4">
            Seu pedido foi recebido com sucesso. Nossa equipe de pós-venda entrará em contato
            para finalizar o pagamento e combinar a entrega.
          </p>

          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Número do pedido:</span>
            <span className="font-mono font-medium text-gray-900">{order.orderNumber}</span>
            <button
              onClick={copyOrderNumber}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copiar número do pedido"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Representative */}
          <div className="bg-[#F5F3F0] rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sua Vendedora</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#8B7355] rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-white">
                  {salesRep.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{salesRep.name}</p>
                <p className="text-sm text-gray-600">Consultora de Vendas</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#8B7355]" />
                <span className="text-gray-600">+55 11 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#8B7355]" />
                <span className="text-gray-600">{salesRep.email}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${salesRep.phone}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-lg font-medium hover:bg-[#20BD5C] transition-colors"
            >
              <MessageCircle size={20} />
              Enviar pedido via WhatsApp
            </a>

            <p className="text-xs text-gray-500 text-center mt-3">
              Clique para enviar os detalhes do pedido diretamente para sua vendedora
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Data do pedido</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de peças</span>
                <span>{order.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Forma de pagamento</span>
                <span>
                  {order.paymentMethod === "pix" && "PIX"}
                  {order.paymentMethod === "boleto" && "Boleto"}
                  {order.paymentMethod === "card" && "Cartão"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entrega</span>
                <span>{order.shipping?.name}</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Entregar em:</p>
              <p className="text-sm">
                {order.address.street}, {order.address.number}
                {order.address.complement && ` - ${order.address.complement}`}<br />
                {order.address.neighborhood} - {order.address.city}/{order.address.state}
              </p>
            </div>
          </div>
        </div>

        {/* Products Detail */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Produtos do Pedido</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedProduct(expandedProduct === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 uppercase">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.colors.reduce((t, c) => t + c.sizes.reduce((st, s) => st + s.quantity, 0), 0)} peças x {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.price * item.colors.reduce((t, c) => t + c.sizes.reduce((st, s) => st + s.quantity, 0), 0))}
                    </span>
                    {expandedProduct === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {expandedProduct === item.id && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-gray-500 text-center mb-2">GRADE DO PRODUTO</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-2 px-2 font-medium text-gray-600">COR</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">P 38</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">M 40</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">G 42</th>
                          <th className="text-center py-2 px-1 font-medium text-gray-600">GG 44</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.colors.map((color) => (
                          <tr key={color.name} className="border-b border-gray-100">
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-gray-700">{color.name}</span>
                              </div>
                            </td>
                            {["P 38", "M 40", "G 42", "GG 44"].map((size) => {
                              const sizeData = color.sizes.find(s => s.size === size)
                              return (
                                <td key={size} className="text-center py-2 px-1 font-medium">
                                  {sizeData?.quantity || "-"}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-medium text-amber-900 mb-3">Próximos Passos</h3>
          <ol className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
              Envie os detalhes do pedido para sua vendedora via WhatsApp
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
              Ela irá confirmar a disponibilidade e enviar os dados para pagamento
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
              Após a confirmação do pagamento, seu pedido será enviado
            </li>
          </ol>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/catalogo"
            className="inline-block bg-[#2C2420] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
