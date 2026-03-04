"use client"

import React from "react"

import { useState, useEffect, useContext } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, CreditCard, Banknote, Smartphone, Wallet, ArrowLeftRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { UserContext } from "@/contexts/user-context"
import { ProUpgradePromoBanner } from "@/components/pro-upgrade-promo-banner"

interface PaymentMethod {
  id: string
  name: string
  icon?: string
  color?: string
}

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const userContext = useContext(UserContext)
  const isFreeUser = !userContext?.userPlan || userContext.userPlan === "gratis"
  
  // Form state
  const [type, setType] = useState("GASTOS")
  const [currency, setCurrency] = useState("PESOS")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState("00:00")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [category, setCategory] = useState("")
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [methodsLoading, setMethodsLoading] = useState(true)
  
  // Data
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [error, setError] = useState<string | null>(null)

  // Generate time options (30-minute intervals)
  const generateTimeOptions = () => {
    const times = []
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        times.push(timeStr)
      }
    }
    return times
  }

  // Format number with thousand separators
  const formatNumber = (value: string) => {
    // Remove all non-digit and non-decimal characters
    const cleanValue = value.replace(/[^\d.]/g, '')
    
    // Split by decimal point
    const parts = cleanValue.split('.')
    
    // Format integer part with thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
    // Join back with decimal point, limit to 2 decimal places
    return parts.length > 1 ? `${parts[0]},${parts[1].slice(0, 2)}` : parts[0]
  }

  // Handle amount change with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Remove formatting for storage
    const numericValue = value.replace(/\./g, '').replace(',', '.')
    setAmount(numericValue)
  }

  // Get icon component for payment method
  const getPaymentIcon = (iconName?: string) => {
    const iconProps = { className: "h-4 w-4" }
    switch (iconName?.toLowerCase()) {
      case 'banknote':
        return <Banknote {...iconProps} />
      case 'credit-card':
      case 'creditcard':
        return <CreditCard {...iconProps} />
      case 'smartphone':
        return <Smartphone {...iconProps} />
      case 'arrow-right-left':
      case 'arrowleftright':
        return <ArrowLeftRight {...iconProps} />
      case 'wallet':
      default:
        return <Wallet {...iconProps} />
    }
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
        console.error("[v0] Error fetching categories:", error)
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
        console.error("[v0] Error fetching payment methods:", error)
        setPaymentMethods([])
      } finally {
        setMethodsLoading(false)
      }
    }

    fetchMethods()
  }, [isOpen, session?.user?.email])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType("GASTOS")
      setCurrency("PESOS")
      setAmount("")
      setDescription("")
      setDate(new Date())
      setTime("00:00")
      setPaymentMethod("")
      setCategory("")
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

      // Construct ISO datetime string with wall clock time (no timezone conversion)
      const dateStr = format(date, "yyyy-MM-dd")
      const datetimeISO = `${dateStr}T${time}:00.000Z`

      const transactionData = {
        email: session.user.email,
        tipo: type,
        moneda: currency,
        monto: numericAmount,
        descripcion: description.trim(),
        fecha: datetimeISO,
        metodo: paymentMethod,
        categoria: category,
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar la transacción")
      }

      // Success
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
      console.error("[v0] Error saving transaction:", error)
      setError(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setIsSaving(false)
    }
  }

  const timeOptions = generateTimeOptions()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black dark:text-white">Agregar Movimiento</DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completa los detalles de tu nueva transacción</p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="type" className="text-gray-900 dark:text-white font-medium">Tipo</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setType("INGRESOS")}
                disabled={isSaving}
                className={cn(
                  "flex-1 cursor-pointer transition-all",
                  type === "INGRESOS"
                    ? "bg-green-500 text-white border-green-500 hover:bg-green-600 dark:bg-green-500 dark:text-white dark:border-green-500"
                    : "bg-white text-gray-900 dark:bg-zinc-950 dark:text-white border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                )}
              >
                Ingreso
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setType("GASTOS")}
                disabled={isSaving}
                className={cn(
                  "flex-1 cursor-pointer transition-all",
                  type === "GASTOS"
                    ? "bg-red-600 text-white border-red-600 hover:bg-red-700 dark:bg-red-600 dark:text-white dark:border-red-600"
                    : "bg-white text-gray-900 dark:bg-zinc-950 dark:text-white border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                )}
              >
                Gasto
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setType("AHORRO")}
                disabled={isSaving}
                className={cn(
                  "flex-1 cursor-pointer transition-all",
                  type === "AHORRO"
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:text-white dark:border-blue-500"
                    : "bg-white text-gray-900 dark:bg-zinc-950 dark:text-white border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                )}
              >
                Ahorro
              </Button>
            </div>
          </div>

          {/* Currency */}
          <div className="grid gap-2">
            <Label htmlFor="currency" className="text-gray-900 dark:text-white font-medium">Moneda</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrency("PESOS")}
                disabled={isSaving}
                className={cn(
                  "flex-1 cursor-pointer transition-all font-semibold",
                  currency === "PESOS"
                    ? "bg-lime-400 text-black border-lime-400 hover:bg-lime-500 dark:bg-lime-400 dark:text-black dark:border-lime-400"
                    : "bg-white text-gray-900 dark:bg-zinc-950 dark:text-white border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                )}
              >
                Pesos ($)
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrency("USD")}
                disabled={isSaving}
                className={cn(
                  "flex-1 cursor-pointer transition-all font-semibold",
                  currency === "USD"
                    ? "bg-lime-400 text-black border-lime-400 hover:bg-lime-500 dark:bg-lime-400 dark:text-black dark:border-lime-400"
                    : "bg-white text-gray-900 dark:bg-zinc-950 dark:text-white border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                )}
              >
                USD (u$s)
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-gray-900 dark:text-white font-medium">Monto</Label>
            <Input
              id="amount"
              type="text"
              value={formatNumber(amount)}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={isSaving}
              className="bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-white font-medium">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Compra en supermercado"
              disabled={isSaving}
              className="bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="grid gap-2">
              <Label className="text-gray-900 dark:text-white font-medium">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isSaving}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMM", { locale: es }) : <span>Fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="grid gap-2">
              <Label htmlFor="time" className="text-gray-900 dark:text-white font-medium">Hora</Label>
              <Select value={time} onValueChange={setTime} disabled={isSaving}>
                <SelectTrigger className="bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 max-h-[200px]">
                  {timeOptions.map((timeOption) => (
                    <SelectItem
                      key={timeOption}
                      value={timeOption}
                      className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-zinc-800"
                    >
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="grid gap-2">
            <Label htmlFor="method" className="text-gray-900 dark:text-white font-medium">Método de Pago</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isSaving || methodsLoading}>
              <SelectTrigger className="bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white">
                <SelectValue placeholder={methodsLoading ? "Cargando..." : "Selecciona un método"}>
                  {paymentMethod && (() => {
                    const selectedMethod = paymentMethods.find(m => m.name === paymentMethod)
                    return selectedMethod ? (
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: selectedMethod.color || '#6B7280' }}
                        >
                          <div className="text-white text-lg">
                            {getPaymentIcon(selectedMethod.icon)}
                          </div>
                        </div>
                        <span className="font-semibold text-white">{selectedMethod.name}</span>
                      </div>
                    ) : paymentMethod
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                {paymentMethods.map((method) => (
                  <SelectItem
                    key={method.id}
                    value={method.name}
                    className="text-white focus:bg-zinc-800 cursor-pointer py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: method.color || '#6B7280' }}
                      >
                        <div className="text-white text-lg">
                          {getPaymentIcon(method.icon)}
                        </div>
                      </div>
                      <span className="font-semibold text-white">{method.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-gray-900 dark:text-white font-medium">Categoría</Label>
            <Select value={category} onValueChange={setCategory} disabled={isSaving || categoriesLoading}>
              <SelectTrigger className="bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white">
                <SelectValue placeholder={categoriesLoading ? "Cargando..." : "Selecciona una categoría"} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.name}
                    className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-zinc-800"
                  >
                    <span>{cat.icon || '📁'} {cat.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ad Banner for Free Users - Before Footer */}
        {isFreeUser && <ProUpgradePromoBanner />}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer bg-transparent text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer text-black font-semibold"
            style={{ backgroundColor: "#CEFD55" }}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Movimiento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
