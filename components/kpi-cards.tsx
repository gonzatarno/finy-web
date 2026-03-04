"use client"

import { Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { formatLocal, formatUSD, formatARS } from "@/lib/utils"

interface KpiCardsProps {
  data?: {
    local: {
      balance: number
      ingresos: number
      egresos: number
      ahorros: number
    }
    usd: {
      balance: number
      ingresos: number
      egresos: number
      ahorros: number
    }
  }
  loading?: boolean
  hideAmounts?: boolean
}

export function KpiCards({ data, loading, hideAmounts }: KpiCardsProps) {
  // Remove currency context usage - always show both currencies

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-4 bg-gray-200/50 dark:bg-zinc-700/50" />
              <Skeleton className="h-10 w-32 mb-2 bg-gray-200/50 dark:bg-zinc-700/50" />
              <Skeleton className="h-4 w-20 bg-gray-200/50 dark:bg-zinc-700/50" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  const mask = "$ ••••••"
  const maskUsd = "USD ••••"

  const kpis = [
    {
      title: "Balance Total",
      localValue: hideAmounts ? mask : formatLocal(data.local?.balance ?? 0),
      usdValue: hideAmounts ? maskUsd : formatUSD(data.usd?.balance ?? 0),
      icon: Wallet,
      iconBg: "bg-gray-100 dark:bg-zinc-800",
      iconColor: "text-gray-900 dark:text-white",
      isNegative: !hideAmounts && (data.local?.balance ?? 0) < 0,
    },
    {
      title: "Ingresos",
      localValue: hideAmounts ? mask : formatLocal(data.local?.ingresos ?? 0),
      usdValue: hideAmounts ? maskUsd : formatUSD(data.usd?.ingresos ?? 0),
      icon: TrendingUp,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Gastos",
      localValue: hideAmounts ? mask : formatLocal(data.local?.egresos ?? 0),
      usdValue: hideAmounts ? maskUsd : formatUSD(data.usd?.egresos ?? 0),
      icon: TrendingDown,
      iconBg: "bg-red-50 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Ahorros / Inversiones",
      localValue: hideAmounts ? mask : formatLocal(data.local?.ahorros ?? 0),
      usdValue: hideAmounts ? maskUsd : formatUSD(data.usd?.ahorros ?? 0),
      icon: Landmark,
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-4">
      {kpis.map((kpi, index) => (
        <div key={index} className={index === 0 ? "hidden md:block" : ""}>
          <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{kpi.title}</p>
                  <p className={`text-3xl font-semibold tracking-tight ${kpi.isNegative ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                    {kpi.localValue}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{kpi.usdValue}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.iconBg}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
