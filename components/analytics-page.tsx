'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
} from 'recharts'
import { BarChart3, TrendingUp, CreditCard, Zap } from 'lucide-react'
import { formatLocal } from '@/lib/utils'
import { CustomTooltip } from './chart-tooltip'

interface AnalyticsPageProps {
  dailySpending?: { day: number; amount: number; ars?: number; usd?: number }[]
  chartData?: { name: string; value: number; ars?: number; usd?: number }[]
  analytics?: {
    totalCurrent: number
    totalPrevious: number
    methods?: { name: string; value: number; ars?: number; usd?: number }[]
    previous?: { local: number; usd: number }
    current?: { local: number; usd: number }
  }
  futureDebt?: any
  loading?: boolean
  topExpenses?: any
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const getCurrentMonthName = () => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[new Date().getMonth()]
}

const getPreviousMonthName = () => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const currentMonth = new Date().getMonth()
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  return months[previousMonth]
}

const ChartEmptyState = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
  <div className="flex h-[250px] flex-col items-center justify-center p-8 text-center">
    <Icon className="mb-3 h-12 w-12 text-gray-300 dark:text-zinc-600" strokeWidth={1.5} />
    <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="max-w-sm text-xs text-gray-500 dark:text-zinc-400">{subtitle}</p>
  </div>
)

export function AnalyticsPage({ dailySpending = [], chartData = [], analytics, futureDebt, loading = false, topExpenses = [] }: AnalyticsPageProps) {
  const methodsData = analytics?.methods || []

  const totalMonthSpending = dailySpending.reduce((acc, item) => acc + (item.amount || 0), 0)
  const hasSpendingData = dailySpending && dailySpending.length > 0 && totalMonthSpending > 0
  const hasCategoryData = chartData && chartData.length > 0
  const hasMethodsData = methodsData && methodsData.length > 0
  const hasFutureDebt = topExpenses && topExpenses.length > 0

  return (
    <div className="space-y-6 w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-600 dark:text-zinc-400">Gastos de {getPreviousMonthName()}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-48 dark:bg-zinc-700" />
            ) : (
              <div className="space-y-1">
                <p className="text-3xl font-semibold text-gray-500 dark:text-zinc-400">{formatLocal(analytics?.previous?.local || 0)}</p>
                <p className="text-sm text-gray-400 dark:text-zinc-500">
                  u$s{' '}
                  {(analytics?.previous?.usd || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-white dark:bg-zinc-900 border-l-4 border-l-[#CEFD55] border-gray-100 dark:border-zinc-800 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-900 dark:text-white">Gastos de {getCurrentMonthName()}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-48 dark:bg-zinc-700" />
            ) : (
              <div className="space-y-1">
                <p className="text-3xl font-semibold text-gray-900 dark:text-white">{formatLocal(analytics?.current?.local || 0)}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  u$s{' '}
                  {(analytics?.current?.usd || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FILA 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="rounded-lg bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Evolución del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : hasSpendingData ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailySpending}>
                  <defs>
                    <linearGradient id="colorEvolution" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CEFD55" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#CEFD55" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#CEFD55" fill="url(#colorEvolution)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState icon={TrendingUp} title="Sin datos" subtitle="Los gastos diarios aparecerán aquí" />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : hasMethodsData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={methodsData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#CEFD55" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState icon={CreditCard} title="Sin datos" subtitle="Los métodos aparecerán aquí" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* FILA 2 - FIX MOBILE: flex-col en mobile, flex-row en desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Gastos por Categoría */}
        <Card className="rounded-lg bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm h-auto min-h-[420px]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Gastos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : hasCategoryData ? (
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 h-full w-full">
                {/* Gráfico: Ajustado radio para que entre en mobile */}
                <div className="w-full lg:w-1/2 h-[280px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={80} 
                        innerRadius={55}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Leyenda: Scrollable */}
                <ScrollArea className="w-full lg:w-1/2 h-[250px] pr-3">
                  <div className="space-y-3">
                    {chartData.map((cat, index) => (
                      <div key={cat.name} className="flex flex-col gap-1 border-b border-gray-100 dark:border-zinc-800 pb-2 last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-semibold text-gray-800 dark:text-white text-sm capitalize">{cat.name.toLowerCase()}</span>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">
                            {((cat.value / (chartData.reduce((a, b) => a + b.value, 0))) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="ml-5 flex flex-col text-xs">
                          {cat.ars > 0 && <span className="text-gray-700 dark:text-zinc-300 font-medium">{formatLocal(cat.ars)}</span>}
                          {cat.usd > 0 && <span className="text-gray-500 dark:text-zinc-400">u$s {cat.usd.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <ChartEmptyState icon={BarChart3} title="Sin datos" subtitle="Las categorías aparecerán aquí" />
            )}
          </CardContent>
        </Card>

        {/* Top Gastos del Mes */}
        <Card className="rounded-lg bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm h-auto min-h-[300px]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Top Gastos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[250px] w-full dark:bg-zinc-700" />
            ) : hasFutureDebt ? (
              <div className="space-y-0">
                {topExpenses.map((expense, idx) => (
                  <div
                    key={expense.id}
                    className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{expense.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 dark:text-zinc-400">{expense.formatted_date}</span>
                        <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          {expense.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600 dark:text-red-400 whitespace-nowrap text-sm">
                      {expense.currency === 'USD' 
                        ? `u$s ${expense.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : formatLocal(expense.amount)
                      }
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[220px] flex-col items-center justify-center text-center p-6 bg-gray-50/50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700">
                <div className="bg-white dark:bg-zinc-800 p-3 rounded-full shadow-sm mb-3">
                  <Zap className="h-8 w-8 text-gray-400 dark:text-zinc-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Aún no hay gastos significativos</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-[220px]">Registra tus gastos para ver los principales del mes.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
