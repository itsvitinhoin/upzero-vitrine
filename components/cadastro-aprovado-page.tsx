"use client"

import Link from "next/link"
import { CheckCircle, LogIn, ShoppingBag, Phone, Gift } from "lucide-react"

export function CadastroAprovadoPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F4] flex flex-col">
      {/* Header simples */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <Link href="/" className="text-2xl font-light tracking-[0.35em] text-[#2C2420]">
            LA CHOCOLÉ
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
            {/* Ícone de sucesso */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-light text-[#2C2420] mb-3">
              Cadastro Aprovado!
            </h1>

            {/* Subtítulo */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Parabéns! Seu cadastro foi analisado e aprovado pela nossa equipe.
              Agora você tem acesso completo à nossa plataforma B2B.
            </p>

            {/* Benefícios */}
            <div className="bg-[#F8F6F4] rounded-xl p-6 mb-8 text-left">
              <h3 className="font-medium text-[#2C2420] mb-4 text-center">
                O que você pode fazer agora:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2C2420] text-sm">Acessar preços exclusivos</p>
                    <p className="text-xs text-gray-500">Veja os valores especiais para revendedores</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2C2420] text-sm">Comprar em grade ampliada</p>
                    <p className="text-xs text-gray-500">Selecione múltiplas cores e tamanhos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2C2420] text-sm">Atendimento dedicado</p>
                    <p className="text-xs text-gray-500">Uma vendedora exclusiva para você</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-[#2C2420] text-white py-4 rounded-lg font-medium hover:bg-[#3D322C] transition-colors"
              >
                <LogIn size={20} />
                Fazer Login
              </Link>

              <Link
                href="/"
                className="block w-full border border-gray-300 text-gray-700 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Voltar para a Loja
              </Link>
            </div>

            {/* Informação adicional */}
            <p className="text-xs text-gray-500 mt-6">
              Utilize o mesmo e-mail ou CNPJ do cadastro para fazer login.
            </p>
          </div>

          {/* Card de suporte */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Precisa de ajuda para começar?
            </p>
            <a
              href="https://wa.me/5511999999999?text=Olá! Meu cadastro foi aprovado e gostaria de ajuda para começar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366] font-medium text-sm hover:underline"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com atendimento
            </a>
          </div>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="w-full px-4 md:px-8 lg:px-12 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LA CHOCOLÉ. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
