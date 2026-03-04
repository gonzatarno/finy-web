"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"

import React, { useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { cn } from "@/lib/utils"
import { usePaymentMethods } from "@/hooks/use-payment-methods"
import { useCategories } from "@/hooks/use-categories"
import { PaymentIcon } from "./PaymentIcon"
import { ProUpgradeCard } from "@/components/pro-upgrade-card"
import { UserContext } from "@/contexts/user-context"
import {
  ShoppingBag,
  Coffee,
  Zap,
  Car,
  MoreHorizontal,
  Home,
  Utensils,
  ShoppingCart,
  ArrowRight,
  CreditCard,
} from "lucide-react"

interface Transaction {
  id: string
  fecha: string
  titulo: string
  descripcion: string
  monto: number
  tipo: "INGRESOS" | "EGRESOS" | "AHORRO"
  categoria: string
  metodo: string
  moneda: "PESOS" | "USD"
  installments_total?: number
  installments_number?: number
}

interface RecentTransactionsProps {
  data?: Transaction[]
  loading?: boolean
  onViewAll?: () => void
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
  hideAmounts?: boolean
}

const categoryIcons: Record<string, React.ReactNode> = {
  DEPORTE: <ShoppingBag className="h-5 w-5" />,
  SALIDAS: <Coffee className="h-5 w-5" />,
  OTROS: <MoreHorizontal className="h-5 w-5" />,
  SERVICIOS: <Zap className="h-5 w-5" />,
  TRANSPORTE: <Car className="h-5 w-5" />,
  HOGAR: <Home className="h-5 w-5" />,
  COMIDA: <Utensils className="h-5 w-5" />,
  COMPRAS: <ShoppingCart className="h-5 w-5" />,
}

export function RecentTransactions({ data, loading, onViewAll, onEdit, onDelete, hideAmounts }: RecentTransactionsProps) {
  const { methods } = usePaymentMethods()
  const { categories } = useCategories()
  const userContext = useContext(UserContext)
  const isFreeUser = !userContext?.userPlan || userContext.userPlan === "gratis"

  const formatCurrency = (amount: number, currency: "PESOS" | "USD") => {
    if (hideAmounts) return currency === "USD" ? "u$s ••••" : "$ ••••"
    if (currency === "USD") {
      const formatted = amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return `u$s ${formatted}`
    } else {
      const formatted = amount.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      return `$ ${formatted}`
    }
  }

  const getMethodData = (methodId: string) => {
    return (
      methods.find((m) => m.id === methodId) ||
      methods.find((m) => m.name?.toUpperCase() === methodId?.toUpperCase())
    )
  }

  const getCategoryData = (categoryName: string) => {
    return categories.find((c) => c.name.toUpperCase() === categoryName?.toUpperCase())
  }

  if (loading) {
    return (
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
        <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Transacciones Recientes</CardTitle>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Últimas 10 transacciones</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2 bg-gray-200 dark:bg-zinc-700" />
                  <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-zinc-700" />
                </div>
                <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-zinc-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
        <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Transacciones Recientes</CardTitle>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Últimas 10 transacciones</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-zinc-400">No hay movimientos disponibles</div>
        </CardContent>
      </Card>
    )
  }

  const transactions = data.slice(0, 10)

  return (
    <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow">
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Movimientos Recientes</CardTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Últimos 10 movimientos</p>
        </div>
      </CardHeader>
      <CardContent>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent dark:border-zinc-800 border-gray-200">
                <TableHead className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800">Fecha</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800">Descripción</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800">Categoría</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800">Método</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800">Moneda</TableHead>
                <TableHead className="text-right font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <React.Fragment key={`desktop-${transaction.id}`}>
                  {isFreeUser && index > 0 && index % 5 === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <ProUpgradeCard />
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-800">
                    <TableCell className="text-sm text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                      {transaction.fecha || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                      {transaction.descripcion || transaction.titulo || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700">
                        {(() => {
                          const catData = getCategoryData(transaction.categoria)
                          return `${catData?.icon || ""} ${transaction.categoria || "Sin categoría"}`
                        })()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const methodData = getMethodData(transaction.metodo)
                          return (
                            <>
                              <PaymentIcon
                                iconName={methodData?.icon}
                                color={methodData?.color || methodData?.icon_color}
                                size="sm"
                                showBackground={true}
                              />
                              <span className="text-sm text-gray-600 dark:text-zinc-400">
                                {methodData?.name || transaction.metodo || "-"}
                              </span>
                            </>
                          )
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.moneda === "USD" ? (
                        <Badge className="rounded-full font-semibold text-xs px-3 py-1" style={{ backgroundColor: "#CEFD55", color: "#000000" }}>
                          USD
                        </Badge>
                      ) : (
                        <Badge className="rounded-full font-semibold text-xs px-3 py-1" style={{ backgroundColor: "#EEEEEE", color: "#000000" }}>
                          PESOS
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "text-base font-semibold tabular-nums whitespace-nowrap",
                          transaction.tipo === "INGRESOS"
                            ? "text-emerald-600"
                            : transaction.tipo === "AHORRO"
                            ? "text-blue-600"
                            : "text-red-600",
                        )}
                      >
                        {transaction.tipo === "INGRESOS" ? "+" : transaction.tipo === "AHORRO" ? "" : "-"}
                        {formatCurrency(Math.abs(transaction.monto), transaction.moneda)}
                      </span>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {transactions.map((transaction, index) => {
            const methodData = getMethodData(transaction.metodo)
            const hasInstallments = transaction.installments_total && transaction.installments_total > 1

            return (
              <React.Fragment key={`mobile-${transaction.id}`}>
                {isFreeUser && index > 0 && index % 5 === 0 && (
                  <ProUpgradeCard />
                )}
                <div className="flex gap-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                  {/* Left: icon */}
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor:
                          methodData?.color || methodData?.icon_color
                            ? `${methodData?.color || methodData?.icon_color}25`
                            : "#f3f4f6",
                      }}
                    >
                      <PaymentIcon
                        iconName={methodData?.icon}
                        color={methodData?.color || methodData?.icon_color}
                        size="md"
                        showBackground={false}
                      />
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate flex-1">
                        {transaction.descripcion || transaction.categoria}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasInstallments && (
                          <Badge className="rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-semibold whitespace-nowrap">
                            {transaction.installments_number || 1}/{transaction.installments_total}
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-transparent text-gray-400 dark:text-gray-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                            <DropdownMenuItem onClick={() => onEdit?.(transaction)} className="text-gray-900 dark:text-white cursor-pointer">
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete?.(transaction)} className="text-red-600 dark:text-red-500 cursor-pointer">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{transaction.fecha}</p>

                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-base font-semibold",
                          transaction.tipo === "INGRESOS"
                            ? "text-emerald-600"
                            : transaction.tipo === "AHORRO" || transaction.tipo === "AHORROS"
                            ? "text-blue-600"
                            : "text-red-600",
                        )}
                      >
                        {transaction.tipo === "INGRESOS" ? "+" : transaction.tipo === "AHORRO" || transaction.tipo === "AHORROS" ? "" : "-"}
                        {formatCurrency(transaction.monto, transaction.moneda)}
                      </p>
                      <Badge
                        className="rounded-full font-semibold text-xs px-2 py-0.5"
                        style={{
                          backgroundColor: transaction.moneda === "USD" ? "#CEFD55" : "#E5E7EB",
                          color: "#000000",
                        }}
                      >
                        {transaction.moneda === "USD" ? "USD" : "PESOS"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>

      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <Button
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
          onClick={onViewAll}
        >
          Ver todos los movimientos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
