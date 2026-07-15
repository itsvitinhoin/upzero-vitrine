"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Step = "identify" | "login" | "register" | "pending"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<Step>("identify")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    password: "",
    confirmPassword: "",
  })

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!identifier.trim()) {
      setError("Por favor, insira seu e-mail, CPF ou CNPJ")
      return
    }

    // Limpar formatacao para comparacao
    const cleanIdentifier = identifier.replace(/\D/g, "")
    
    // Lista de usuarios existentes
    const existingUsers = [
      "38221897000156",
      "12345678900",
    ]
    const existingEmails = ["cliente@teste.com", "loja@teste.com"]

    const isExistingUser = 
      existingUsers.includes(cleanIdentifier) ||
      existingEmails.includes(identifier.toLowerCase())
    
    if (isExistingUser) {
      setStep("login")
    } else {
      if (identifier.includes("@")) {
        setRegisterData(prev => ({ ...prev, email: identifier }))
      } else {
        setRegisterData(prev => ({ ...prev, document: formatDocument(identifier.replace(/\D/g, "")) }))
      }
      setStep("register")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password) {
      setError("Por favor, insira sua senha")
      return
    }

    setIsLoading(true)
    const success = await login(identifier, password)
    setIsLoading(false)

    if (success) {
      router.push("/")
    } else {
      setError("Senha incorreta. Tente novamente.")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!registerData.name || !registerData.email || !registerData.phone || !registerData.document || !registerData.password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (registerData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setStep("pending")
  }

  const handleBack = () => {
    if (step === "login" || step === "register") {
      setStep("identify")
      setPassword("")
      setError("")
    }
  }

  const renderBackButton = () => {
    if (step === "pending") {
      return <div className="h-6" />
    }
    
    if (step === "login" || step === "register") {
      return (
        <button 
          onClick={handleBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </button>
      )
    }
    
    return (
      <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Voltar para a loja
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#F5F3F0] items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8E4DF] to-[#D8D3CC]" />
        <div className="relative z-10 text-center p-12">
          <h1 className="text-4xl font-light tracking-[0.4em] text-[#5C4A3D] mb-4">
            LA CHOCOLE
          </h1>
          <p className="text-[#8B7355] text-lg tracking-wide">
            Moda Feminina Premium
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="p-4 md:p-8">
          {renderBackButton()}
        </div>

        <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-16">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-2xl font-light tracking-[0.3em] text-gray-900">
                LA CHOCOLE
              </h1>
            </div>

            {step === "identify" && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Bem-vindo(a)
                </h2>
                <p className="text-gray-500 mb-8">
                  Insira seu e-mail, CPF ou CNPJ para continuar
                </p>

                <form onSubmit={handleIdentify} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail, CPF ou CNPJ
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Digite seu e-mail, CPF ou CNPJ"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#2C2420] text-white py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors"
                  >
                    Continuar
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>
                    Ao continuar, voce concorda com nossos{" "}
                    <a href="#" className="text-[#8B7355] underline">Termos de Uso</a>
                    {" "}e{" "}
                    <a href="#" className="text-[#8B7355] underline">Politica de Privacidade</a>
                  </p>
                </div>
              </div>
            )}

            {step === "login" && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Digite sua senha
                </h2>
                <p className="text-gray-500 mb-8">
                  Ola! Identificamos seu cadastro. Insira sua senha para continuar.
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identificacao
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2C2420] text-white py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>

                  <div className="text-center">
                    <a href="#" className="text-sm text-[#8B7355] hover:underline">
                      Esqueci minha senha
                    </a>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    <strong>Credenciais de teste:</strong><br />
                    CNPJ: 38221897000156<br />
                    Senha: 123456
                  </p>
                </div>
              </div>
            )}

            {step === "pending" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg 
                    className="w-10 h-10 text-[#8B7355]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-light text-gray-900 mb-3">
                  Cadastro em analise
                </h2>
                
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Seu cadastro foi enviado com sucesso e esta sendo analisado pela nossa equipe.
                </p>
                
                <div className="bg-[#F5F3F0] rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-medium text-gray-900 mb-3">Proximos passos:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="w-5 h-5 bg-[#8B7355] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                      Nossa equipe ira analisar suas informacoes
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 bg-[#8B7355] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                      Voce recebera um e-mail com a confirmacao
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 bg-[#8B7355] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                      Apos aprovacao, tera acesso aos precos e condicoes B2B
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  Prazo medio de analise: <strong>ate 24 horas uteis</strong>
                </p>
                
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block w-full bg-[#2C2420] text-white py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors text-center"
                  >
                    Voltar para a loja
                  </Link>
                  
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-[#25D366] text-[#25D366] py-3 rounded-lg font-medium hover:bg-[#25D366] hover:text-white transition-colors text-center"
                  >
                    Falar com atendimento
                  </a>
                </div>
              </div>
            )}

            {step === "register" && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Complete seu cadastro
                </h2>
                <p className="text-gray-500 mb-8">
                  Nao encontramos seu cadastro. Preencha os dados abaixo para criar sua conta.
                </p>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite seu nome completo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Digite seu e-mail"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Celular
                    </label>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF ou CNPJ
                    </label>
                    <input
                      type="text"
                      value={registerData.document}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, document: formatDocument(e.target.value) }))}
                      placeholder="000.000.000-00"
                      maxLength={18}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Crie uma senha (min. 6 caracteres)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar senha
                    </label>
                    <input
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme sua senha"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#2C2420] text-white py-3 rounded-lg font-medium hover:bg-[#3D322C] transition-colors"
                  >
                    Criar conta
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    Ao criar sua conta, voce concorda com nossos{" "}
                    <a href="#" className="text-[#8B7355] underline">Termos de Uso</a>
                    {" "}e{" "}
                    <a href="#" className="text-[#8B7355] underline">Politica de Privacidade</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
