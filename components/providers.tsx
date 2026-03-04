"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { CurrencyProvider } from "@/lib/currency-context"
import { UserProvider } from "@/contexts/user-context"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CurrencyProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
