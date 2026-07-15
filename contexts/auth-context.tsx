"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  document: string
  phone: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario padrao para teste
const DEFAULT_USER: User = {
  id: "1",
  name: "Loja Teste",
  email: "loja@teste.com",
  document: "38.221.897/0001-56",
  phone: "(11) 99999-9999",
}

// Credenciais validas
const VALID_CREDENTIALS = [
  { identifier: "38221897000156", password: "123456" },
  { identifier: "38.221.897/0001-56", password: "123456" },
  { identifier: "cliente@teste.com", password: "123456" },
  { identifier: "12345678900", password: "123456" },
  { identifier: "123.456.789-00", password: "123456" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se ha usuario salvo no localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // Limpar formatacao do identificador para comparacao
    const cleanIdentifier = identifier.replace(/\D/g, "")
    
    // Verificar credenciais
    const isValid = VALID_CREDENTIALS.some(cred => {
      const cleanCred = cred.identifier.replace(/\D/g, "")
      return (cleanCred === cleanIdentifier || cred.identifier === identifier) && cred.password === password
    })

    if (isValid) {
      setUser(DEFAULT_USER)
      localStorage.setItem("user", JSON.stringify(DEFAULT_USER))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
