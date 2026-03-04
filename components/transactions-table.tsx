"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { useState, useMemo } from "react"
import { Search, Filter, Banknote, ArrowLeftRight, CreditCard, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { usePaymentMethods } from "@/hooks/use-payment-methods"
import { useCategories } from "@/hooks/use-categories"
import { PaymentIcon } from "./PaymentIcon"
import { PaymentMethodIcon } from "./payment-method-icon" // Import PaymentMethodIcon

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

interface TransactionsTableProps {
  data?: Transaction[]
  loading?: boolean
  onDelete?: (transactionId: string) => void
}

export function TransactionsTable({ data = [], loading = false, onDelete }: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { methods } = usePaymentMethods()
  const { categories: allCategories } = useCategories()

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((tx) => tx.categoria || "Sin categoría").filter(Boolean)),
    ).sort()
    return ["all", ...uniqueCategories]
  }, [data])

  const getCategoryData = (categoryName: string) => {
    return allCategories.find(c => c.name.toUpperCase() === categoryName?.toUpperCase())
  }

  const filteredTransactions = useMemo(() => {
    return data.filter((transaction) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        (transaction.descripcion || transaction.titulo || "").toString().toLowerCase().includes(searchLower) ||
        (transaction.categoria || "").toString().toLowerCase().includes(searchLower) ||
        (transaction.metodo || "").toString().toLowerCase().includes(searchLower) ||
        (transaction.id || "").toString().toLowerCase().includes(searchLower)

      const matchesCategory = categoryFilter === "all" || (transaction.categoria || "Sin categoría") === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [data, searchQuery, categoryFilter])

  const formatCurrency = (amount: number, currency: "PESOS" | "USD") => {
    // Locale-agnostic formatting: dot for thousands, comma for decimals (Latam/EU standard)
    if (currency === "USD") {
      const formatted = amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return `u$s ${formatted}`
    } else {
      const formatted = amount.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      return `$ ${formatted}`
    }
  }

  const getMethodData = (methodId: string) => {
    // Search by ID first (since transaction.metodo is an ID)
    return methods.find(m => m.id === methodId) || 
           // Fallback: search by name (for backward compatibility)
           methods.find(m => m.name?.toUpperCase() === methodId?.toUpperCase())
  }

  return (
    <Card className="rounded-lg border-gray-100 card-shadow w-full">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Todas las Transacciones</CardTitle>
          {loading ? (
            <Skeleton className="h-5 w-24 bg-gray-200" />
          ) : (
            <Badge variant="secondary" className="text-sm rounded-full">
              {filteredTransactions.length} transacciones
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por descripción, categoría, método o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-lg cursor-pointer"
              disabled={loading}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={loading}>
            <SelectTrigger className="w-full sm:w-[200px] rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filtrar por categoría" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white rounded-lg card-shadow">
              <SelectItem value="all" className="cursor-pointer hover:bg-gray-50">
                Todas las categorías
              </SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category} className="cursor-pointer hover:bg-gray-50">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-semibold text-gray-900">ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Fecha</TableHead>
                <TableHead className="font-semibold text-gray-900">Descripción</TableHead>
                <TableHead className="font-semibold text-gray-900">Categoría</TableHead>
                <TableHead className="font-semibold text-gray-900">Método</TableHead>
                <TableHead className="font-semibold text-gray-900">Moneda</TableHead>
                <TableHead className="font-semibold text-gray-900">Tipo</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-20 bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32 bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40 bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 bg-gray-200" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-24 bg-gray-200" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                    No se encontraron transacciones
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {(transaction.id || "").slice(-6)}
                    </TableCell>

                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {transaction.fecha || "-"}
                    </TableCell>

                    <TableCell className="font-medium text-gray-900">
                      {transaction.descripcion || transaction.titulo || "-"}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="rounded-full bg-gray-50 text-gray-700 border-gray-200">
                        {(() => {
                          const catData = getCategoryData(transaction.categoria)
                          return `${catData?.icon || '📁'} ${transaction.categoria || "Sin categoría"}`
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
                              <span className="text-sm text-gray-600">{methodData?.name || transaction.metodo || "-"}</span>
                            </>
                          )
                        })()}
                      </div>
                    </TableCell>

                    <TableCell>
                      {transaction.moneda === "USD" ? (
                        <Badge
                          className="rounded-full font-semibold text-xs px-3 py-1"
                          style={{ backgroundColor: "#CEFD55", color: "#000000" }}
                        >
                          USD
                        </Badge>
                      ) : (
                        <Badge
                          className="rounded-full font-semibold text-xs px-3 py-1"
                          style={{ backgroundColor: "#083C2F", color: "#FFFFFF" }}
                        >
                          PESOS
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full",
                          transaction.tipo === "INGRESOS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : transaction.tipo === "AHORRO"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-red-50 text-red-700 border-red-200",
                        )}
                      >
                        {transaction.tipo === "INGRESOS" ? "Ingreso" : transaction.tipo === "AHORRO" ? "Ahorro" : "Gasto"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span
                          className={cn(
                            "text-base font-semibold tabular-nums",
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="block md:hidden space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-3 w-24 bg-gray-200" />
                </div>
                <Skeleton className="h-5 w-20 bg-gray-200" />
              </div>
            ))
          ) : filteredTransactions.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No se encontraron transacciones
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const methodData = getMethodData(transaction.metodo)
              const hasInstallments = transaction.installments_total && transaction.installments_total > 1
              
              return (
                <div
                  key={transaction.id}
                  className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Left: Circular icon with colored background */}
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: methodData?.color || methodData?.icon_color ? `${methodData?.color || methodData?.icon_color}25` : '#f3f4f6',
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

                  {/* Right section: Title, Date, Amount, Currency */}
                  <div className="flex-1 min-w-0">
                    {/* Top: Title, Badge, Menu */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate flex-1">{transaction.descripcion || transaction.categoria || "Sin categoría"}</p>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasInstallments && (
                          <Badge className="rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-semibold whitespace-nowrap">
                            {transaction.installments_number || 1}/{transaction.installments_total}
                          </Badge>
                        )}
                        
                        {/* Menu dots */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 hover:bg-transparent"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="down" sideOffset={8} className="z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
                            <DropdownMenuItem className="cursor-pointer dark:hover:bg-zinc-800 dark:focus:bg-zinc-800">Editar</DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete?.(transaction.id)}
                              className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 focus:text-red-600 dark:focus:text-red-400"
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-500 mb-3">{transaction.fecha}</p>

                    {/* Amount and Currency Row */}
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
                        {formatCurrency(Math.abs(transaction.monto), transaction.moneda)}
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
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
