"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Loader2, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { PaymentIcon } from "@/components/payment-icon"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  name: string
  icon?: string
  color?: string
}

interface Category {
  id: string
  name: string
  icon?: string
}

interface AddTransactionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  editingTransaction?: any
}

export function AddTransactionDrawer({ isOpen, onClose, onSuccess, editingTransaction }: AddTransactionDrawerProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  // Form state
  const [type, setType] = useState("GASTOS")
  const [currency, setCurrency] = useState("PESOS")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState(format(new Date(), "HH:mm"))
  const [paymentMethod, setPaymentMethod] = useState("")
  const [category, setCategory] = useState("")
  const [installments, setInstallments] = useState("1")
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [methodsLoading, setMethodsLoading] = useState(true)
  
  // Data
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [error, setError] = useState<string | null>(null)

  // Pre-fill form when editing a transaction
  useEffect(() => {
    if (editingTransaction && isOpen) {
      setType(editingTransaction.tipo || "GASTOS")
      setCurrency(editingTransaction.moneda || "PESOS")
      setAmount(editingTransaction.monto?.toString() || "")
      setDescription(editingTransaction.descripcion || editingTransaction.titulo || "")
      setCategory(editingTransaction.categoria || "")
      setPaymentMethod(editingTransaction.metodo || "")
      if (editingTransaction.fecha) {
        const [datePart, timePart] = editingTransaction.fecha.split(" ")
        setDate(new Date(datePart))
        setTime(timePart || "00:00")
      }
      setInstallments(editingTransaction.installments_total?.toString() || "1")
    } else if (isOpen && !editingTransaction) {
      // Reset form when opening new transaction drawer
      setType("GASTOS")
      setCurrency("PESOS")
      setAmount("")
      setDescription("")
      setDate(new Date())
      setTime(format(new Date(), "HH:mm"))
      setPaymentMethod("")
      setCategory("")
      setInstallments("1")
    }
  }, [isOpen, editingTransaction])
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  // Generate time options (every hour)
  const generateTimeOptions = () => {
    const times = []
    for (let hours = 0; hours < 24; hours++) {
      const timeStr = `${String(hours).padStart(2, "0")}:00`
      times.push(timeStr)
    }
    return times
  }

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '')
    const parts = cleanValue.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return parts.length > 1 ? `${parts[0]},${parts[1].slice(0, 2)}` : parts[0]
  }

  // Handle amount change with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = value.replace(/\./g, '').replace(',', '.')
    setAmount(numericValue)
  }

  // Fetch categories
  useEffect(() => {
    if (!isOpen || !session?.user?.email) return

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch(`/api/settings?email=${encodeURIComponent(session.user.email)}&type=categories`)
        const result = await response.json()
        setCategories(Array.isArray(result.data) ? result.data : [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [isOpen, session?.user?.email])

  // Fetch payment methods
  useEffect(() => {
    if (!isOpen || !session?.user?.email) return

    const fetchMethods = async () => {
      try {
        setMethodsLoading(true)
        const response = await fetch(`/api/settings?email=${encodeURIComponent(session.user.email)}&type=methods`)
        const result = await response.json()
        setPaymentMethods(Array.isArray(result.data) ? result.data : [])
      } catch (error) {
        console.error("Error fetching payment methods:", error)
        setPaymentMethods([])
      } finally {
        setMethodsLoading(false)
      }
    }

    fetchMethods()
  }, [isOpen, session?.user?.email])

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setType("GASTOS")
      setCurrency("PESOS")
      setAmount("")
      setDescription("")
      setDate(new Date())
      setTime(format(new Date(), "HH:mm"))
      setPaymentMethod("")
      setCategory("")
      setInstallments("1")
      setError(null)
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!session?.user?.email) {
      setError("No hay sesión activa")
      return
    }

    if (!description.trim() || !category || !paymentMethod || !amount) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("El monto debe ser un número válido mayor a 0")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const dateStr = format(date, "yyyy-MM-dd")
      const datetimeISO = `${dateStr}T${time}:00.000Z`

      const transactionData = {
        user_email: session.user.email,
        type: type,
        currency: currency,
        amount: numericAmount,
        description: description.trim(),
        date: datetimeISO,
        method: paymentMethod,
        category: category,
        installments: parseInt(installments),
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar el movimiento")
      }
      
      // Show success toast
      toast({
        title: "Movimiento agregado",
        description: `${type === "GASTOS" ? "Gasto" : type === "INGRESOS" ? "Ingreso" : "Ahorro"} de $${formatNumber(amount)} guardado correctamente.`,
        duration: 3000,
      })

      // Close drawer and refresh
      onClose()
      onSuccess?.()
      
      // Hard reload to bypass all caches (critical for PWA/mobile)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50)
      }
      setTimeout(() => {
        window.location.reload()
      }, 300)
    } catch (error) {
      console.error("Error saving transaction:", error)
      setError(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setIsSaving(false)
    }
  }

  const dateOptions = generateDateOptions()
  const timeOptions = generateTimeOptions()
  const selectedMethod = paymentMethods.find(m => m.name === paymentMethod)

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-white dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-800 z-[50001] animate-in slide-in-from-bottom duration-300 flex flex-col">
        {/* Header */}
        <DrawerHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <DrawerTitle className="text-xl font-semibold text-zinc-900 dark:text-white">
            Agregar movimiento
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Content - scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-5 pb-6">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Type Selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("GASTOS")}
                disabled={isSaving}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
                  type === "GASTOS"
                    ? "bg-red-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setType("INGRESOS")}
                disabled={isSaving}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
                  type === "INGRESOS"
                    ? "bg-green-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setType("AHORRO")}
                disabled={isSaving}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
                  type === "AHORRO"
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}
              >
                Ahorro
              </button>
            </div>

            {/* Amount with Currency */}
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
              <Select value={currency} onValueChange={setCurrency} disabled={isSaving}>
                <SelectTrigger className="w-24 bg-zinc-200 dark:bg-zinc-800 border-0 rounded-lg font-semibold text-zinc-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 z-[50010]">
                  <SelectItem value="PESOS" className="dark:text-white dark:hover:bg-zinc-800">ARS</SelectItem>
                  <SelectItem value="USD" className="dark:text-white dark:hover:bg-zinc-800">USD</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-2xl font-semibold text-zinc-900 dark:text-white">$</span>
                <Input
                  type="text"
                  value={formatNumber(amount)}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  disabled={isSaving}
                  className="text-2xl font-semibold border-0 bg-transparent p-0 h-auto text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm text-zinc-500 dark:text-zinc-400">Categoría</Label>
              <Select value={category} onValueChange={setCategory} disabled={isSaving || categoriesLoading}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-14 text-zinc-900 dark:text-white">
                  <SelectValue placeholder={categoriesLoading ? "Cargando..." : "Compra en supermercado"}>
                    {category && (() => {
                      const selectedCat = categories.find(c => c.name === category)
                      return selectedCat ? `${selectedCat.icon || '📁'} ${selectedCat.name}` : category
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 z-[50010]">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.name}
                      className="text-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <span>{cat.icon || '📁'} {cat.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="text-sm text-zinc-500 dark:text-zinc-400">Método de pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isSaving || methodsLoading}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-14 text-zinc-900 dark:text-white">
                  <SelectValue placeholder={methodsLoading ? "Cargando..." : "Selecciona un método"}>
                    {selectedMethod && (
                      <div className="flex items-center gap-3">
                        <PaymentIcon
                          iconName={selectedMethod.icon}
                          color={selectedMethod.color}
                          size="sm"
                          showBackground={true}
                        />
                        <span className="font-medium text-zinc-900 dark:text-white">{selectedMethod.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 z-[50010]">
                  {paymentMethods.map((method) => (
                    <SelectItem
                      key={method.id}
                      value={method.name}
                      className="text-zinc-900 dark:text-white dark:hover:bg-zinc-800 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <PaymentIcon
                          iconName={method.icon}
                          color={method.color}
                          size="sm"
                          showBackground={true}
                        />
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Installments */}
            <div className="space-y-2">
              <Label className="text-sm text-zinc-500 dark:text-zinc-400">Cantidad de cuotas</Label>
              <Select value={installments} onValueChange={setInstallments} disabled={isSaving}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-14 text-zinc-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 z-[50010]">
                  <SelectItem value="1" className="dark:text-white dark:hover:bg-zinc-800">1 pago</SelectItem>
                  <SelectItem value="3" className="dark:text-white dark:hover:bg-zinc-800">3 cuotas</SelectItem>
                  <SelectItem value="6" className="dark:text-white dark:hover:bg-zinc-800">6 cuotas</SelectItem>
                  <SelectItem value="9" className="dark:text-white dark:hover:bg-zinc-800">9 cuotas</SelectItem>
                  <SelectItem value="12" className="dark:text-white dark:hover:bg-zinc-800">12 cuotas</SelectItem>
                  <SelectItem value="18" className="dark:text-white dark:hover:bg-zinc-800">18 cuotas</SelectItem>
                  <SelectItem value="24" className="dark:text-white dark:hover:bg-zinc-800">24 cuotas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm text-zinc-500 dark:text-zinc-400">Descripción</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Compra en supermercado"
                disabled={isSaving}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-14 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm text-zinc-500 dark:text-zinc-400">Fecha</Label>
                <Select
                  value={format(date, "yyyy-MM-dd")}
                  onValueChange={(value) => setDate(new Date(value))}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-14 text-zinc-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    {dateOptions.map((dateOption) => (
                      <SelectItem
                        key={format(dateOption, "yyyy-MM-dd")}
                        value={format(dateOption, "yyyy-MM-dd")}
                        className="dark:text-white dark:hover:bg-zinc-800"
                      >
                        {format(dateOption, "dd MMM", { locale: es })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-zinc-500 dark:text-zinc-400">Hora</Label>
                <Select value={time} onValueChange={setTime} disabled={isSaving}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-14 text-zinc-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 max-h-[200px]">
                    {timeOptions.map((timeOption) => (
                      <SelectItem
                        key={timeOption}
                        value={timeOption}
                        className="dark:text-white dark:hover:bg-zinc-800"
                      >
                        {timeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-zinc-950">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-14 rounded-xl text-black font-semibold text-lg hover:opacity-90 active:scale-95 transition-all duration-200"
            style={{ backgroundColor: "#CEFD55" }}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Guardando...
              </>
            ) : (
              "Agregar movimiento"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
