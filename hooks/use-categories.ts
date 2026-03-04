import useSWR from 'swr'
import { useSession } from 'next-auth/react'

export interface Category {
  id: string
  name: string
  user_id: string
  icon?: string
  created_at?: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useCategories() {
  const { data: session } = useSession()

  const { data, error, isLoading, mutate } = useSWR(
    session?.user?.email
      ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=categories`
      : null,
    fetcher
  )

  const categories = (data?.data || []) as Category[]

  return {
    categories,
    isLoading,
    error,
    mutate,
    getCategoryByName: (name: string) => {
      return categories.find(c => c.name.toUpperCase() === name.toUpperCase())
    },
  }
}
