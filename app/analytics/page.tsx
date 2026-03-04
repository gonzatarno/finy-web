'use client'

import { useEffect, useState } from 'react'
import { AnalyticsPage } from '@/components/analytics-page'
import { useSession } from 'next-auth/react'

export default function AnalyticsView() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return

      try {
        const response = await fetch(`/api/data?email=${session.user.email}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  if (!session) {
    return <div>Por favor inicia sesión</div>
  }

  return (
    <AnalyticsPage
      dailySpending={data?.dailySpending}
      chartData={data?.chartData}
      analytics={data?.analytics}
      topExpenses={data?.topExpenses}
      loading={loading}
    />
  )
}
