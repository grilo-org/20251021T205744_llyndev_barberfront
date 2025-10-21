"use client"

import type React from "react"
import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import type { User } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useErrorToast } from "@/hooks/use-error-toast"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, telephone: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { pushError } = useErrorToast('auth')

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authApi.getProfile()
          setUser(userData)
        } catch (error) {
          console.error("Erro ao carregar usuário:", error)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authApi.login(email, password)
      localStorage.setItem("token", response.token)

      const userData = await authApi.getProfile()
      setUser(userData)

      router.push("/")
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      })
    } catch (error) {
      pushError(error, { title: "Erro no login", description: "Verifique suas credenciais e tente novamente." })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, telephone: string, password: string, confirmPassword: string) => {
    setLoading(true)
    try {
      await authApi.register(name, email, telephone, password, confirmPassword)
      toast({
        title: "Registro realizado com sucesso!",
        description: "Agora você pode fazer login.",
      })
      router.push("/login")
    } catch (error) {
      pushError(error, { title: "Erro no registro", description: "Não foi possível criar sua conta. Tente novamente." })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  }


  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}