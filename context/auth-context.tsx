"use client"

import { createContext, useContext } from "react"
import type { User } from "@/lib/types"

type AuthContextType = {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email:string, telephone:string, password: string) => Promise<void>
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

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}