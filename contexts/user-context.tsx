'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@/lib/supabase/client'

interface UserContextType {
  userName: string
  userEmail: string | null
  userPlan: 'pro' | 'plus' | 'gratis' | null
  setUserName: (name: string) => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export { UserContext }

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const supabase = createClient()
  const [userName, setUserName] = useState<string>(session?.user?.name || '')
  const [userEmail, setUserEmail] = useState<string | null>(session?.user?.email || null)
  const [userPlan, setUserPlan] = useState<'pro' | 'plus' | 'gratis' | null>(null)

  // Load user name and plan from Supabase on mount
  useEffect(() => {
    const loadUserName = async () => {
      try {
        if (!session?.user?.email) return

        const { data, error } = await supabase
          .from('users')
          .select('name, plan')
          .eq('email', session.user.email)
          .single()

        if (error) throw error
        if (data?.name) {
          setUserName(data.name)
        }
        setUserPlan((data?.plan || 'gratis') as 'pro' | 'plus' | 'gratis' | null)
      } catch (error) {
        console.error('[v0] Error loading user name:', error)
      }
    }

    loadUserName()
  }, [session?.user?.email, supabase])

  // Refresh user data from database
  const refreshUser = async () => {
    try {
      if (!session?.user?.email) return

      const { data, error } = await supabase
        .from('users')
        .select('name, plan')
        .eq('email', session.user.email)
        .single()

      if (error) throw error
      if (data?.name) {
        setUserName(data.name)
      }
      setUserPlan((data?.plan || 'gratis') as 'pro' | 'plus' | 'gratis' | null)
    } catch (error) {
      console.error('[v0] Error refreshing user data:', error)
    }
  }

  return (
    <UserContext.Provider value={{ userName, userEmail, userPlan, setUserName, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
