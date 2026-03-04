"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { PieChartIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { CustomTooltip } from "./chart-tooltip"

interface CategoryChartProps {
  data?: {
    name: string
    value: number
  }[]
  loading?: boolean
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"]

export function CategoryChart({ data, loading }: CategoryChartProps) {
  if (loading) {
    return (
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Gastos por Categoría</CardTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Distribución mensual</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full bg-gray-200 dark:bg-zinc-700" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasData = data && data.length > 0 && data.some((d) => d.value > 0)

  if (!hasData) {
    return (
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Gastos por Categoría</CardTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Distribución mensual</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
              <PieChartIcon className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Aún no hay datos suficientes este mes</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Tus gastos por categoría aparecerán aquí cuando los registres
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Gastos por Categoría</CardTitle>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Distribución mensual</p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] md:h-[300px] flex flex-col md:block">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                }}
                formatter={(value) => <span className="text-sm text-gray-900 dark:text-white">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
