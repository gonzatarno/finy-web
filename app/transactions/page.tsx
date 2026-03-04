'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { TransactionsManagement } from '@/components/transactions-management'

interface Transaction {
  id: string
  fecha: string
  descripcion: string
  categoria: string
  metodo: string
  tipo: string
  moneda: string
  monto: number
  cuotas?: number
  installment_number?: number
}

interface Category {
  id: string
  name: string
}

interface PaymentMethod {
  id: string
  name: string
}

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('[v0] Fetch error:', error)
    throw error
  }
}

export default function TransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shouldOpenModal, setShouldOpenModal] = useState(false)

  // Fetch all transactions
  const { data: transactionsData, isLoading: isLoadingTransactions, mutate: mutateTransactions } = useSWR(
    session?.user?.email ? `/api/data?email=${encodeURIComponent(session.user.email)}` : null,
    fetcher,
    { 
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
      focusThrottleInterval: 0
    }
  )

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useSWR(
    session?.user?.email ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=categories` : null,
    fetcher,
    { 
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
      focusThrottleInterval: 0
    }
  )

  // Fetch payment methods
  const { data: methodsData, isLoading: isLoadingMethods } = useSWR(
    session?.user?.email ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=methods` : null,
    fetcher,
    { 
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
      focusThrottleInterval: 0
    }
  )

  // Safe update transactions
  useEffect(() => {
    try {
      if (Array.isArray(transactionsData?.allTransactions)) {
        setTransactions(transactionsData.allTransactions)
        setError(null)
      } else {
        console.warn('[v0] Invalid transactions data format')
        setTransactions([])
      }
    } catch (err) {
      console.error('[v0] Error processing transactions:', err)
      setTransactions([])
      setError('Error al procesar las transacciones')
    }
  }, [transactionsData])

  // Safe update categories
  useEffect(() => {
    try {
      if (Array.isArray(categoriesData?.data)) {
        setCategories(categoriesData.data)
      } else {
        console.warn('[v0] Invalid categories data format')
        setCategories([])
      }
    } catch (err) {
      console.error('[v0] Error processing categories:', err)
      setCategories([])
    }
  }, [categoriesData])

  // Safe update payment methods
  useEffect(() => {
    try {
      if (Array.isArray(methodsData?.data)) {
        setPaymentMethods(methodsData.data)
      } else {
        console.warn('[v0] Invalid payment methods data format')
        setPaymentMethods([])
      }
    } catch (err) {
      console.error('[v0] Error processing payment methods:', err)
      setPaymentMethods([])
    }
  }, [methodsData])

  // Update loading state
  useEffect(() => {
    setLoading(isLoadingTransactions || isLoadingCategories || isLoadingMethods)
  }, [isLoadingTransactions, isLoadingCategories, isLoadingMethods])

  // Check for action=new parameter and open modal automatically
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'new') {
      console.log('[v0] Detected action=new, triggering modal open')
      setShouldOpenModal(true)
      // Clean the URL parameter
      router.replace('/transactions', { scroll: false })
    }
  }, [searchParams, router])

  // Handle auth check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Debes iniciar sesión para ver tus transacciones.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                Error al cargar las transacciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    )
  }

  // Main render - safe with all protections
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TransactionsManagement 
          data={Array.isArray(transactions) ? transactions : []}
          loading={loading}
          externalModalOpen={shouldOpenModal}
          onExternalModalClose={() => setShouldOpenModal(false)}
          onRefresh={() => {
            router.refresh()
          }}
          onSettingsClick={() => {
            // Navigate to settings - handled by parent dashboard
          }}
        />
      </div>
    </div>
  )
}
