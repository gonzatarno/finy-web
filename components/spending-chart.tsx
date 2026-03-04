"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { CustomTooltip } from "./chart-tooltip"

interface SpendingChartProps {
  data?: { day: number; amount: number; ars?: number; usd?: number }[]
  loading?: boolean
}

export function SpendingChart({ data = [], loading = false }: SpendingChartProps) {
  if (loading) {
    return (
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Actividad de Gastos</CardTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gastos diarios del mes actual</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full bg-gray-200 dark:bg-zinc-700" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalMonth = data.reduce((acc, item) => acc + (item.amount || 0), 0)
  const hasData = data && data.length > 0 && totalMonth > 0

  if (!hasData) {
    return (
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Actividad de Gastos</CardTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gastos diarios del mes actual</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
              <BarChart2 className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Aún no hay datos suficientes este mes</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Tus gastos de este mes aparecerán aquí cuando los registres</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Actividad de Gastos</CardTitle>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Gastos diarios del mes actual</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cefd55" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#cefd55" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#cefd55"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSpending)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
