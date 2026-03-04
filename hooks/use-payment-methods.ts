import useSWR from 'swr'
import { useSession } from 'next-auth/react'

export interface PaymentMethod {
  id: string
  name: string
  user_id: string
  icon?: string
  color?: string  // Cambiar de icon_color a color
  icon_color?: string  // Mantener para compatibilidad
  created_at?: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function usePaymentMethods() {
  const { data: session } = useSession()

  const { data, error, isLoading, mutate } = useSWR(
    session?.user?.email
      ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=methods`
      : null,
    fetcher
  )

  const methods = (data?.data || []) as PaymentMethod[]

  return {
    methods,
    isLoading,
    error,
    mutate,
    getMethodByName: (name: string) => {
      return methods.find(m => m.name.toUpperCase() === name.toUpperCase())
    },
  }
}
