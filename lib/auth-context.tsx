"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  userEmail: string | null
  login: (email: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "finy_user_email"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEY)
    if (savedEmail) {
      setUserEmail(savedEmail)
    }
    setIsLoading(false)
  }, [])

  const login = (email: string) => {
    setUserEmail(email)
    localStorage.setItem(STORAGE_KEY, email)
  }

  const logout = () => {
    setUserEmail(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return <AuthContext.Provider value={{ userEmail, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
