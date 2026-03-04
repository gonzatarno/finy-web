"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import useSWR from "swr"
import {
  Search,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  Filter,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wallet,
  Smartphone,
  Bitcoin,
  Loader2,
  CalendarIcon,
  Settings2,
  Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PaymentIcon } from "@/components/PaymentIcon"
import { useSession } from "next-auth/react"

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
  installment_number?: number
  installments_total?: number
  parent_id?: string
}

interface TransactionsManagementProps {
  data?: Transaction[]
  loading?: boolean
  onRefresh?: () => void
  onSettingsClick?: () => void
  externalModalOpen?: boolean
  onExternalModalClose?: () => void
}

// Generate time options in 30-minute intervals
const TIME_OPTIONS = []
for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, "0")
  TIME_OPTIONS.push(`${hour}:00`)
  TIME_OPTIONS.push(`${hour}:30`)
}

export function TransactionsManagement({ 
  data = [], 
  loading = false, 
  onRefresh, 
  onSettingsClick,
  externalModalOpen = false,
  onExternalModalClose
}: TransactionsManagementProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sync external modal control with internal state
  useEffect(() => {
    if (externalModalOpen) {
      setIsModalOpen(true)
    }
  }, [externalModalOpen])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "INGRESOS" | "EGRESOS" | "AHORRO">("all")
  const [filterCurrency, setFilterCurrency] = useState<"all" | "PESOS" | "USD">("all")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    tipo: "EGRESOS" as const,
    moneda: "PESOS" as const,
    monto: "",
    descripcion: "",
    fecha: new Date(),
    hora: format(new Date(), "HH:mm"),
    metodo: "", // Will be set dynamically
    categoria: "", // Will be set dynamically
    cuotas: 1,
  })
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

  // Fetch categories and payment methods dynamically
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  
  const { data: categoriesData = {} } = useSWR(
    session?.user?.email 
      ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=categories`
      : null,
    fetcher
  )
  
  const { data: methodsData = {} } = useSWR(
    session?.user?.email
      ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=methods`
      : null,
    fetcher
  )

  const dynamicCategories = Array.isArray(categoriesData.data)
    ? categoriesData.data.sort((a, b) => a.name.localeCompare(b.name))
    : []
  
  const dynamicMethods = Array.isArray(methodsData.data)
    ? methodsData.data.sort((a, b) => a.name.localeCompare(b.name))
    : []

  // Convert dynamic categories to string array for form select
  const finalCategories = Array.isArray(dynamicCategories) 
    ? dynamicCategories.map(c => c?.name).filter(Boolean)
    : []

  // Convert dynamic methods to select format with icons and colors
  const finalMethods = Array.isArray(dynamicMethods)
    ? dynamicMethods.map(m => ({ 
        value: m?.name || "OTRO", 
        label: m?.name || "OTRO",
        icon: m?.icon || 'wallet',
        color: m?.color || m?.icon_color || '#6B7280'
      })).filter(m => m.value)
    : []

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((tx) => tx.categoria || "Sin categoría").filter(Boolean))
    ).sort()
    return ["all", ...uniqueCategories]
  }, [data])

  const normalizedTransactions = useMemo(() => {
    // Agregar hora actual si no está presente
    return Array.isArray(data) ? data.map((tx) => {
      if (!tx.fecha) return tx
      
      const fecStr = tx.fecha.toString().trim()
      
      // Verificar si ya tiene hora
      if (fecStr.includes('T') || fecStr.includes(':')) {
        return tx
      }
      
      // Si no tiene hora, agregar la hora actual
      const now = new Date()
      const hora = now.toTimeString().slice(0, 5)
      const fechaConHora = fecStr.includes(' ') ? fecStr : `${fecStr} ${hora}`
      
      return {
        ...tx,
        fecha: fechaConHora
      }
    }) : []
  }, [data])

  const filteredTransactions = useMemo(() => {
    // Ensure data is always an array
    const safeData = Array.isArray(normalizedTransactions) ? normalizedTransactions : []
    
    return safeData.filter((transaction) => {
      if (!transaction) return false
      
      const searchLower = (searchQuery || "").toLowerCase()
      const desc = (transaction.descripcion || transaction.titulo || "").toString().toLowerCase()
      const cat = (transaction.categoria || "").toString().toLowerCase()
      const method = (transaction.metodo || "").toString().toLowerCase()
      
      const matchesSearch = desc.includes(searchLower) || cat.includes(searchLower) || method.includes(searchLower)
      const matchesCategory = categoryFilter === "all" || (transaction.categoria || "Sin categoría") === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [data, searchQuery, categoryFilter])

  const formatCurrency = (amount: number, currency: "PESOS" | "USD") => {
    if (currency === "USD") {
      const formatted = amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return `u$s ${formatted}`
    } else {
      const formatted = amount.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      return `$ ${formatted}`
    }
  }

  const getMethodData = (methodName: string) => {
    return dynamicMethods.find(m => m.name?.toUpperCase() === methodName?.toUpperCase())
  }

  const handleOpenAddModal = () => {
    setEditingTransaction(null)
    const now = new Date()
    
    // Use first available method and category, or fallback to empty string
    const defaultMethod = finalMethods.length > 0 ? finalMethods[0].value : ""
    const defaultCategory = finalCategories.length > 0 ? finalCategories[0] : ""
    
    setFormData({
      tipo: "EGRESOS",
      moneda: "PESOS",
      monto: "",
      descripcion: "",
      fecha: now,
      hora: now.toTimeString().slice(0, 5),
      metodo: defaultMethod,
      categoria: defaultCategory,
      cuotas: 1,
    })
    setError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    
    // Parse date and time - handle both ISO format and DD/MM/YYYY HH:MM format
    let dateString = "2026-01-22" // fallback
    let hora = "12:00"
    
    if (transaction.fecha) {
      const fecStr = transaction.fecha.trim()
      
      // Check if it's ISO format (YYYY-MM-DD...)
      if (fecStr.match(/^\d{4}-\d{2}-\d{2}/)) {
        // ISO format: "2026-01-31T23:15:00Z" or "2026-01-31T23:15:00"
        const [dateISO, timeISO] = fecStr.split('T')
        dateString = dateISO // "2026-01-31"
        if (timeISO) {
          hora = timeISO.substring(0, 5) // "23:15"
        }
      } else if (fecStr.match(/^\d{2}\/\d{2}\/\d{4}/)) {
        // DD/MM/YYYY format: "31/01/2026 23:15"
        const parts = fecStr.split(' ')
        const datePart = parts[0] // "31/01/2026"
        const timePart = parts[1] // "23:15" or undefined
        
        const [day, month, year] = datePart.split('/')
        dateString = `${year}-${month}-${day}` // "2026-01-31"
        if (timePart && timePart.match(/^\d{2}:\d{2}/)) {
          hora = timePart // "23:15"
        }
      }
    }
    
    // Parse YYYY-MM-DD format
    const [year, month, day] = dateString.split("-").map(Number)
    // Create a local date - NOT using UTC to avoid timezone shifts
    const parsedDate = new Date(year, month - 1, day)
    
    setFormData({
      tipo: transaction.tipo === "INGRESOS" ? "INGRESOS" : (transaction.tipo === "AHORRO" || transaction.tipo === "AHORROS") ? "AHORRO" : "EGRESOS",
      moneda: (transaction.moneda || "PESOS").toUpperCase() as "PESOS" | "USD",
      monto: transaction.monto.toString(),
      descripcion: transaction.descripcion || transaction.titulo || "",
      fecha: parsedDate,
      hora: hora,
      metodo: (transaction.metodo || "EFECTIVO").toUpperCase(),
      categoria: (transaction.categoria || "OTROS").toUpperCase(),
      cuotas: transaction.installments_total || 1,
    })
    setError(null)
    setIsModalOpen(true)
  }

  // useEffect to populate formData when editing transaction or opening modal
  useEffect(() => {
    if (isModalOpen && editingTransaction) {
      // The form has already been populated in handleOpenEditModal
      // This effect just ensures consistency if the modal reopens
    } else if (!isModalOpen) {
      // Optional: Reset error when modal closes
      setError(null)
    }
  }, [isModalOpen, editingTransaction])

  const handleOpenDeleteModal = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setIsDeleteModalOpen(true)
  }

  const handleSaveTransaction = async () => {
    if (!session?.user?.email) {
      setError("No hay sesión activa")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Wall Clock Time: Build ISO string manually WITHOUT timezone conversion
      const [hours, minutes] = formData.hora.split(":")
      const year = formData.fecha.getFullYear()
      const month = String(formData.fecha.getMonth() + 1).padStart(2, "0")
      const day = String(formData.fecha.getDate()).padStart(2, "0")
      
      // Construct ISO string manually: "YYYY-MM-DDTHH:MM:00.000Z"
      // This preserves the exact time the user selected without timezone offset
      const isoDate = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
      
      const payload = {
        user_email: session.user.email,
        amount: parseFloat(formData.monto),
        currency: formData.moneda,
        date: isoDate,
        description: formData.descripcion,
        category: formData.categoria,
        method: formData.metodo,
        // Convert AHORRO to AHORROS for backend consistency
        type: formData.tipo === "AHORRO" ? "AHORROS" : formData.tipo,
        installments: formData.cuotas,
        ...(editingTransaction && { id: editingTransaction.id }),
      }

      const response = await fetch("/api/transactions", {
        method: editingTransaction ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar el movimiento")
      }

      // Auto-refresh data after successful save
      // Hard reload to bypass all caches (critical for PWA/mobile)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50)
      }
      setTimeout(() => {
        window.location.reload()
      }, 300)
      
      setIsModalOpen(false)
      onExternalModalClose?.()
      onRefresh?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete?.id) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/transactions?id=${transactionToDelete.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el movimiento")
      }

      // Auto-refresh data after successful delete
      // Hard reload to bypass all caches (critical for PWA/mobile)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50)
      }
      setTimeout(() => {
        window.location.reload()
      }, 300)
      
      setIsDeleteModalOpen(false)
      setTransactionToDelete(null)
      onRefresh?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsDeleting(false)
    }
  }

  // Initialize formData with first available category and method
  useEffect(() => {
    const newFormData = { ...formData }
    
    if (finalMethods.length > 0 && !formData.metodo) {
      newFormData.metodo = finalMethods[0].value
    }
    
    if (finalCategories.length > 0 && !formData.categoria) {
      newFormData.categoria = finalCategories[0]
    }
    
    if (newFormData.metodo !== formData.metodo || newFormData.categoria !== formData.categoria) {
      setFormData(newFormData)
    }
  }, [finalMethods, finalCategories])

  // Función para exportar movimientos a CSV
  const handleExportCSV = () => {
    try {
      // Usar filteredTransactions en lugar de data para exportar con filtros aplicados
      const dataToExport = filteredTransactions && filteredTransactions.length > 0 
        ? filteredTransactions 
        : data

      if (!dataToExport || dataToExport.length === 0) {
        alert("No hay movimientos para descargar")
        return
      }

      // Encabezados del CSV
      const headers = ["Fecha", "Descripción", "Categoría", "Método", "Tipo", "Moneda", "Monto"]

      // Convertir datos a filas CSV
      const rows = dataToExport.map(tx => {
        try {
          // Parsear fecha de forma segura
          let fechaFormato = ""
          if (tx.fecha) {
            try {
              const fecha = new Date(tx.fecha)
              if (!isNaN(fecha.getTime())) {
                fechaFormato = format(fecha, "dd/MM/yyyy HH:mm", { locale: es })
              } else {
                fechaFormato = tx.fecha.toString()
              }
            } catch {
              fechaFormato = tx.fecha.toString()
            }
          }

          // Monto seguro
          let montoFormato = ""
          if (tx.monto) {
            montoFormato = tx.monto.toString().replace(".", ",")
          }

          return [
            fechaFormato,
            `"${(tx.descripcion || tx.titulo || "").replace(/"/g, '""')}"`,
            tx.categoria || "",
            tx.metodo || "",
            tx.tipo || "",
            tx.moneda || "",
            montoFormato
          ]
        } catch (error) {
          console.error("Error procesando transacción:", error)
          return ["", "", "", "", "", "", ""]
        }
      })

      // Construir contenido CSV con punto y coma como separador
      const csvContent = [
        headers.join(";"),
        ...rows.map(row => row.join(";"))
      ].join("\n")

      // Agregar BOM UTF-8 para que Excel reconozca tildes correctamente
      const BOM = "\uFEFF"
      const csvWithBOM = BOM + csvContent

      // Crear Blob y descargar
      const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" })
      
      // Usar una URL válida
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `finy_movimientos_${format(new Date(), "dd-MM-yyyy")}.csv`
      
      // Asegurar que el elemento sea visible en el DOM
      document.body.appendChild(link)
      
      // Trigger download
      setTimeout(() => {
        link.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }, 100)
    } catch (error) {
      console.error("Error exporting CSV:", error)
      alert("Error al descargar el archivo. Por favor intenta de nuevo.")
    }
  }

  return (
    <>
      <Card className="rounded-lg border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-shadow w-full">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Mis Movimientos</CardTitle>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Gestiona todos tus movimientos financieros</p>
            </div>
            <div className="flex gap-2 flex-col sm:flex-row sm:items-center">
              {/* Desktop: Botones individuales */}
              <div className="hidden sm:flex gap-2">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                  title="Descargar CSV"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar CSV
                </Button>
                <Button
                  onClick={onSettingsClick}
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Personalizar Tablas
                </Button>
              </div>

              {/* Mobile: actions hidden (CSV only available on desktop) */}
            </div>
          </div>

          {/* Mobile: search + filter button in one row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl"
                disabled={loading}
              />
            </div>
            {/* Filter: native select on mobile, styled select on desktop */}
            <div className="sm:hidden relative">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-xl h-10 w-10 shrink-0",
                  categoryFilter !== "all" && "bg-[#CEFD55] border-[#CEFD55] text-black hover:bg-[#b8e84c] hover:text-black"
                )}
                disabled={loading}
                onClick={() => {
                  const sel = document.getElementById("mobile-category-select") as HTMLSelectElement
                  if (sel) sel.focus()
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <select
                id="mobile-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                disabled={loading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                <option value="all">Todas las categorías</option>
                {finalCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Desktop filter select */}
            <div className="hidden sm:block">
              <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={loading}>
                <SelectTrigger className="w-[200px] rounded-xl cursor-pointer dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Categoría" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-white border dark:border-zinc-800 rounded-lg card-shadow">
                  <SelectItem value="all" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                    Todas las categorías
                  </SelectItem>
                  {finalCategories.map((category) => (
                    <SelectItem key={category} value={category} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active category filter pill on mobile */}
          {categoryFilter !== "all" && (
            <div className="flex sm:hidden">
              <button
                onClick={() => setCategoryFilter("all")}
                className="flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-zinc-300"
              >
                {categoryFilter}
                <span className="text-gray-400 text-sm leading-none">×</span>
              </button>
            </div>
          )}

          {loading ? (
            <Skeleton className="h-5 w-24 bg-gray-200" />
          ) : (
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {filteredTransactions.length} {filteredTransactions.length === 1 ? "movimiento" : "movimientos"}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-900">Fecha</TableHead>
                  <TableHead className="font-semibold text-gray-900">Descripción</TableHead>
                  <TableHead className="font-semibold text-gray-900">Categoría</TableHead>
                  <TableHead className="font-semibold text-gray-900">Método</TableHead>
                  <TableHead className="font-semibold text-gray-900">Moneda</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Monto</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24 bg-gray-200" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40 bg-gray-200" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24 bg-gray-200" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 bg-gray-200" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 bg-gray-200" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-24 bg-gray-200" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 bg-gray-200" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
            No se encontraron movimientos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <TableCell className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {transaction.fecha || "-"}
                      </TableCell>

                      <TableCell className="font-medium text-gray-900 dark:text-white max-w-[250px]">
                        <div className="flex items-center gap-2">
                          <span className="truncate">
                            {transaction.descripcion || transaction.titulo || "-"}
                          </span>
                          {transaction.installments_total && transaction.installments_total > 1 && (
                            <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200 text-xs whitespace-nowrap flex-shrink-0">
                              Cuota {transaction.installment_number}/{transaction.installments_total}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="rounded-full bg-gray-50 text-gray-700 border-gray-200">
                          {transaction.categoria || "Sin categoría"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const methodData = getMethodData(transaction.metodo)
                            return methodData ? (
                              <PaymentIcon 
                                iconName={methodData.icon}
                                color={methodData.color || methodData.icon_color}
                                size="sm"
                                showBackground={true}
                              />
                            ) : (
                              <CreditCard className="h-4 w-4 text-gray-600" />
                            )
                          })()}
                          <span className="text-sm text-gray-900 dark:text-white font-medium">
                            {transaction.metodo || "-"}
                          </span>
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
                            style={{ backgroundColor: "#EEEEEE", color: "#000000" }}
                          >
                            PESOS
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                  <span
                    className={`text-base font-semibold ${
                      transaction.tipo === "INGRESOS" 
                        ? "text-emerald-600" 
                        : transaction.tipo === "AHORRO"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.tipo === "INGRESOS" ? "+" : transaction.tipo === "AHORRO" ? "" : "-"}
                    {formatCurrency(transaction.monto, transaction.moneda as "PESOS" | "USD")}
                  </span>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg card-shadow">
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(transaction)}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 text-gray-900 dark:text-white"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteModal(transaction)}
                              className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
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
                No se encontraron movimientos
              </div>
            ) : (
              filteredTransactions.map((transaction) => {
                const methodData = getMethodData(transaction.metodo)
                const hasInstallments = transaction.installments_total && transaction.installments_total > 1
                
                return (
                  <div
                    key={transaction.id}
                    className="flex gap-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {/* Left: Circular icon with colored background */}
                    <div className="flex-shrink-0">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: methodData?.color || methodData?.icon_color ? `${methodData?.color || methodData?.icon_color}25` : '#f3f4f6',
                        }}
                      >
                        {methodData ? (
                          <PaymentIcon 
                            iconName={methodData.icon}
                            color={methodData.color || methodData.icon_color}
                            size="md"
                            showBackground={false}
                          />
                        ) : (
                          <CreditCard className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    </div>

                    {/* Right section: Title, Date, Amount, Currency */}
                    <div className="flex-1 min-w-0">
                      {/* Top: Title, Badge, Menu */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm truncate flex-1">
                          {transaction.descripcion || transaction.categoria || "Sin categoría"}
                        </p>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {hasInstallments && (
                            <Badge className="rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-semibold whitespace-nowrap">
                              {transaction.installment_number}/{transaction.installments_total}
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
                            <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg card-shadow">
                              <DropdownMenuItem
                                onClick={() => handleOpenEditModal(transaction)}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 text-gray-900 dark:text-white"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenDeleteModal(transaction)}
                                className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Date + Category */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.fecha}</p>
                        {transaction.categoria && (
                          <span className="rounded-full bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-zinc-300 uppercase tracking-wide">
                            {transaction.categoria}
                          </span>
                        )}
                      </div>

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

      {/* Add/Edit Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-lg dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingTransaction ? "Editar Movimiento" : "Agregar Movimiento"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-zinc-400">
              {editingTransaction
                ? "Modifica los detalles de tu movimiento"
                : "Completa los detalles de tu nuevo movimiento"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Tipo Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">Tipo</Label>
              <div className="flex gap-2">
                {(["INGRESOS", "EGRESOS", "AHORRO"] as const).map((tipo) => (
                  <Button
                    key={tipo}
                    type="button"
                    variant={formData.tipo === tipo ? "default" : "outline"}
                    className={cn(
                      "flex-1 cursor-pointer",
                      formData.tipo === tipo
                        ? tipo === "INGRESOS"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : tipo === "AHORRO"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-transparent"
                    )}
                    onClick={() => setFormData({ ...formData, tipo })}
                  >
                    {tipo === "INGRESOS" ? "Ingreso" : tipo === "AHORRO" ? "Ahorro" : "Gasto"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Moneda Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">Moneda</Label>
              <div className="flex gap-2">
                {(["PESOS", "USD"] as const).map((moneda) => (
                  <Button
                    key={moneda}
                    type="button"
                    variant={formData.moneda === moneda ? "default" : "outline"}
                    className={cn(
                      "flex-1 cursor-pointer font-semibold",
                      formData.moneda === moneda
                        ? "text-black"
                        : "bg-transparent text-gray-700"
                    )}
                    style={
                      formData.moneda === moneda
                        ? { backgroundColor: "#CEFD55" }
                        : {}
                    }
                    onClick={() => setFormData({ ...formData, moneda })}
                  >
                    {moneda === "USD" ? "USD (u$s)" : "Pesos ($)"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="monto" className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                Monto
              </Label>
              <Input
                id="monto"
                type="number"
                placeholder="0.00"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                Descripción
              </Label>
              <Input
                id="descripcion"
                placeholder="Ej: Compra en supermercado"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-lg cursor-pointer bg-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white",
                        !formData.fecha && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha ? format(formData.fecha, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg card-shadow" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fecha}
                      onSelect={(date) => date && setFormData({ ...formData, fecha: date })}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                  Hora
                </Label>
                <Select
                  value={formData.hora}
                  onValueChange={(value) => setFormData({ ...formData, hora: value })}
                >
                  <SelectTrigger className="rounded-lg cursor-pointer bg-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                    <SelectValue placeholder="Selecciona la hora" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-white dark:bg-zinc-900 dark:border-zinc-800">
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time} className="cursor-pointer dark:hover:bg-zinc-800">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Método de Pago y Cuotas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">Método de Pago</Label>
                <Select value={formData.metodo} onValueChange={(value) => setFormData({ ...formData, metodo: value })}>
                  <SelectTrigger className="rounded-lg cursor-pointer bg-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg card-shadow">
                    {finalMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                        <div className="flex items-center gap-2">
                          <PaymentIcon iconName={method.icon} color={method.color} size="sm" showBackground={true} />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">Cuotas</Label>
                <Select
                  value={formData.cuotas.toString()}
                  onValueChange={(value) => setFormData({ ...formData, cuotas: parseInt(value) })}
                >
                  <SelectTrigger className="rounded-lg cursor-pointer bg-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                    <SelectValue placeholder="Selecciona las cuotas" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg card-shadow">
                    <SelectItem value="1" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      1 pago
                    </SelectItem>
                    <SelectItem value="3" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      3 cuotas
                    </SelectItem>
                    <SelectItem value="6" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      6 cuotas
                    </SelectItem>
                    <SelectItem value="9" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      9 cuotas
                    </SelectItem>
                    <SelectItem value="12" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      12 cuotas
                    </SelectItem>
                    <SelectItem value="18" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      18 cuotas
                    </SelectItem>
                    <SelectItem value="24" className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      24 cuotas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200">Categoría</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger className="rounded-lg cursor-pointer dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg card-shadow">
                  {finalCategories.map((category) => (
                    <SelectItem key={category} value={category} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                      {category.charAt(0) + category.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                onExternalModalClose?.()
              }}
              disabled={isSaving}
              className="cursor-pointer bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveTransaction}
              disabled={isSaving || !formData.monto || !formData.descripcion}
              className="cursor-pointer"
              style={{ backgroundColor: "#CEFD55", color: "#000000" }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : editingTransaction ? (
                "Guardar Cambios"
              ) : (
                "Agregar Movimiento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Eliminar movimiento</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {transactionToDelete && (
            <div className="py-4">
              <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  {transactionToDelete.descripcion || transactionToDelete.titulo}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {transactionToDelete.fecha} - {transactionToDelete.categoria}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-2",
                    transactionToDelete.tipo === "INGRESOS" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {transactionToDelete.tipo === "INGRESOS" ? "+" : "-"}
                  {formatCurrency(Math.abs(transactionToDelete.monto), transactionToDelete.moneda)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer bg-transparent dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTransaction}
              disabled={isDeleting}
              className="cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
