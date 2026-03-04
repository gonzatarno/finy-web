"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Check, Pencil, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface TransactionData {
  amount: number
  description: string
  category: string
  date: string
  type?: string
  method?: string
  currency?: string
  installments?: number
}

interface TransactionReviewCardProps {
  initialData: TransactionData
  onSuccess?: () => void
  onClose?: () => void
  onAddMessage?: (message: { id: string | number; role: "user" | "assistant"; content: string }) => void
  chatEndRef?: React.RefObject<HTMLDivElement>
}

// Helper function to format number with thousand separators
const formatAmount = (value: number): string => {
  return new Intl.NumberFormat('es-AR').format(value)
}

// Helper function to parse formatted number
const parseAmount = (value: string): number => {
  return Number(value.replace(/\./g, '').replace(/,/g, '.'))
}

const CATEGORIES = [
  { value: "COMIDA", label: "Comida", icon: "🍔" },
  { value: "TRANSPORTE", label: "Transporte", icon: "🚕" },
  { value: "ENTRETENIMIENTO", label: "Entretenimiento", icon: "🎬" },
  { value: "SERVICIOS", label: "Servicios", icon: "💼" },
  { value: "COMPRAS", label: "Compras", icon: "🛍️" },
  { value: "SALUD", label: "Salud", icon: "🏥" },
  { value: "EDUCACION", label: "Educación", icon: "📚" },
  { value: "OTROS", label: "Otros", icon: "📦" },
]

export function TransactionReviewCard({ initialData, onSuccess, onClose, onAddMessage, chatEndRef }: TransactionReviewCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<TransactionData>(() => {
    // Normalize currency on initialization
    let normalizedCurrency = initialData.currency || "PESOS"
    if (normalizedCurrency === "ARS") normalizedCurrency = "PESOS"
    if (normalizedCurrency === "USD") normalizedCurrency = "USD"
    if (normalizedCurrency === "DOLARES") normalizedCurrency = "USD"
    
    return {
      ...initialData,
      type: initialData.type || "GASTOS",
      currency: normalizedCurrency,
      method: initialData.method || "EFECTIVO",
      installments: initialData.installments || 1,
    }
  })
  const [displayAmount, setDisplayAmount] = useState(formatAmount(initialData.amount))
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Initialize time with current time, rounded to nearest 30 minutes
  const [displayTime, setDisplayTime] = useState<string>(() => {
    const now = new Date()
    const h = now.getHours()
    const m = now.getMinutes()
    // Round up to next 30-min block: 0-29 -> :30, 30-59 -> next hour :00
    const roundedM = m < 30 ? 30 : 0
    const roundedH = m < 30 ? h : h + 1 > 23 ? 0 : h + 1
    return `${String(roundedH).padStart(2, '0')}:${String(roundedM).padStart(2, '0')}`
  })
  const [isCanceled, setIsCanceled] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; name: string }>>([])
  const [userCategories, setUserCategories] = useState<Array<{ value: string; label: string; icon: string }>>([])
  const [methodsLoading, setMethodsLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)


  // Generate date options (last 7 days + today + next 7 days)
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

  const dateOptions = generateDateOptions()

  // Currency display labels
  const currencyLabel = formData.currency === "USD" ? "USD" : "ARS"

  // Normalize method: if it comes as a name, find its ID
  useEffect(() => {
    if (initialData.method && paymentMethods.length > 0) {
      // Try to find method by name first
      let methodObj = paymentMethods.find(m => m.name === initialData.method)
      
      // If not found and initialData.method looks like it could be "EFECTIVO" or similar, search case-insensitive
      if (!methodObj && typeof initialData.method === 'string') {
        methodObj = paymentMethods.find(m => 
          m.name.toLowerCase() === initialData.method.toLowerCase() ||
          m.name.includes(initialData.method)
        )
      }
      
      if (methodObj && formData.method !== methodObj.id) {
        setFormData({ ...formData, method: methodObj.id })
      }
    }
  }, [paymentMethods, initialData.method, formData.method])

  // Fetch payment methods and user categories
  useEffect(() => {
    if (!session?.user?.email) return

    const fetchData = async () => {
      try {
        setMethodsLoading(true)
        setCategoriesLoading(true)

        // Fetch payment methods
        const methodsResponse = await fetch(`/api/settings?email=${encodeURIComponent(session.user.email)}&type=methods`)
        const methodsResult = await methodsResponse.json()
        setPaymentMethods(Array.isArray(methodsResult.data) ? methodsResult.data : [])

        // Fetch user categories
        const categoriesResponse = await fetch(`/api/settings?email=${encodeURIComponent(session.user.email)}&type=categories`)
        const categoriesResult = await categoriesResponse.json()
        
        if (Array.isArray(categoriesResult.data) && categoriesResult.data.length > 0) {
          // Map API categories to our format
          const mappedCategories = categoriesResult.data.map((cat: any) => ({
            value: cat.name || cat.id,
            label: cat.name || cat.id,
            icon: cat.icon || "📁",
          }))
          setUserCategories(mappedCategories)
        } else {
          // Fallback to default categories
          setUserCategories(CATEGORIES)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setPaymentMethods([])
        setUserCategories(CATEGORIES)
      } finally {
        setMethodsLoading(false)
        setCategoriesLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.email])

  const handleCancel = () => {
    toast({
      title: "Cancelado",
      description: "No se guardó la transacción.",
      className: "bg-gray-100 dark:bg-zinc-800",
    })
    setIsCanceled(true)
  }

  const handleConfirmTransaction = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()

    // Guard: prevent double submission
    if (isLoading) return

    // Use email as fallback if id is not available
    const userId = (session?.user as any)?.id || session?.user?.email
    if (!userId) {
      toast({
        title: "Error",
        description: "No se pudo obtener tu información de usuario.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Safe datetime construction with fallbacks
      const timeParts = (displayTime || "12:00").split(':')
      const hours = timeParts[0]?.padStart(2, '0') || "12"
      const mins = timeParts[1]?.padStart(2, '0') || "00"
      const dateStr = formData.date || format(new Date(), "yyyy-MM-dd")
      const dateValue = `${dateStr} ${hours}:${mins}`

      // Normalize currency: PESOS/ARS -> "ARS", everything else -> "USD"
      const currencyNorm = (formData.currency === "PESOS" || formData.currency === "ARS") ? "ARS" : "USD"

      // Resolve method name from ID (fallback to raw value if not a UUID)
      const resolvedMethodName = paymentMethods.find(m => m.id === formData.method)?.name
        || formData.method
        || "Efectivo"

      const payload = {
        userId,
        type: "action_confirmation",
        payload: {
          amount: Number(formData.amount) || 0,
          category: formData.category || "OTROS",
          description: formData.description || "Sin descripción",
          date: dateValue,
          method: resolvedMethodName, // Send method NAME, not UUID
          currency: currencyNorm,
          installments: formData.installments || 1,
          type: formData.type || "GASTOS",
        },
      }

      const response = await fetch("/api/transactions/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}: Error al confirmar`)
      }

      // Success
      setIsSaved(true)

      if (onAddMessage) {
        const currencySymbol = currencyNorm === "USD" ? "U$S" : "$"
        const typeText = formData.type === "GASTOS" ? "COMPRAS" : formData.type === "INGRESOS" ? "INGRESOS" : "AHORROS"
        onAddMessage({
          id: Date.now(),
          role: "assistant" as const,
          content: `Listo! Registre ${currencySymbol} ${formData.amount} en ${typeText}.\nConcepto: ${formData.description}\nMetodo: ${resolvedMethodName}`,
        })
        setTimeout(() => {
          chatEndRef?.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }

      toast({
        title: "Guardado!",
        description: `${formData.description} por $${formData.amount} confirmado.`,
        className: "bg-[#CEFD55] text-black border-none",
      })

      onSuccess?.()

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50)
      }
      setTimeout(() => {
        window.location.reload()
      }, 500)

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo confirmar el gasto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCanceled) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-400 dark:bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
            <X className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">Cancelado</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">No se guardó la transacción</p>
          </div>
        </div>
      </div>
    )
  }

  if (isSaved) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100">Guardado exitosamente</h3>
            <p className="text-sm text-green-700 dark:text-green-300">{formData.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl p-4 shadow-sm space-y-3 max-w-md relative z-[50001]">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-zinc-700">
        <Pencil className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Revisa los detalles</h3>
      </div>

      {/* Type Selector - Colorful Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "GASTOS" })}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
            formData.type === "GASTOS"
              ? "bg-red-600 text-white"
              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
          )}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "INGRESOS" })}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
            formData.type === "INGRESOS"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
          )}
        >
          Ingreso
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: "AHORRO" })}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm",
            formData.type === "AHORRO"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
          )}
        >
          Ahorro
        </button>
      </div>

      {/* Amount with Currency - Integrated */}
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
        <Select
          value={formData.currency || "PESOS"}
          onValueChange={(value) => setFormData({ ...formData, currency: value })}
        >
          <SelectTrigger className="w-24 bg-gray-200 dark:bg-zinc-700 border-0 rounded-lg font-semibold text-gray-900 dark:text-white">
            <span>{formData.currency === "USD" ? "USD" : "ARS"}</span>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 z-[50010]">
            <SelectItem value="PESOS" className="dark:text-white dark:hover:bg-zinc-800">ARS</SelectItem>
            <SelectItem value="USD" className="dark:text-white dark:hover:bg-zinc-800">USD</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-2xl font-semibold text-gray-900 dark:text-white">$</span>
          <Input
            type="text"
            value={displayAmount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              if (value === '') {
                setDisplayAmount('')
                setFormData({ ...formData, amount: 0 })
              } else {
                const numValue = Number(value)
                setDisplayAmount(formatAmount(numValue))
                setFormData({ ...formData, amount: numValue })
              }
            }}
            placeholder="0"
            className="text-2xl font-semibold border-0 bg-transparent p-0 h-auto text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description" className="text-xs text-gray-700 dark:text-zinc-300">Descripción</Label>
        <Input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
          placeholder="Ej: Almuerzo en restaurante"
        />
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label htmlFor="category" className="text-xs text-gray-700 dark:text-zinc-300">Categoría</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
            {formData.category ? (
              <div className="flex items-center gap-2">
                <span>{userCategories.find(c => c.value === formData.category)?.icon || "📁"}</span>
                <span>{userCategories.find(c => c.value === formData.category)?.label}</span>
              </div>
            ) : (
              <span className="text-gray-500">Selecciona una categoría</span>
            )}
          </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 z-[50010]">
            {userCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="dark:hover:bg-zinc-800">
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-700 dark:text-zinc-300">Método de Pago</Label>
        <Select 
          value={formData.method} 
          onValueChange={(value) => setFormData({ ...formData, method: value })}
          disabled={methodsLoading}
        >
          <SelectTrigger className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
            {formData.method ? (
              <span>{paymentMethods.find(m => m.id === formData.method)?.name || formData.method}</span>
            ) : (
              <span className="text-gray-500">Selecciona método</span>
            )}
          </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 z-[50010]">
            {paymentMethods.map((method) => (
              <SelectItem key={method.id} value={method.id} className="dark:hover:bg-zinc-800">
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-gray-700 dark:text-zinc-300">Fecha</Label>
          <Select
            value={formData.date}
            onValueChange={(value) => setFormData({ ...formData, date: value })}
          >
            <SelectTrigger className="h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
              {format(new Date(formData.date), "dd MMM", { locale: es })}
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 z-[50010] max-h-[200px]">
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
        <div className="space-y-1">
          <Label className="text-xs text-gray-700 dark:text-zinc-300">Hora</Label>
          <Input
            type="time"
            value={displayTime}
            onChange={(e) => setDisplayTime(e.target.value)}
            className="h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Installments Row */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-700 dark:text-zinc-300">Cuotas</Label>
        <Select 
          value={String(formData.installments)} 
          onValueChange={(value) => setFormData({ ...formData, installments: Number(value) })}
        >
          <SelectTrigger className="h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
            {formData.installments} {formData.installments === 1 ? 'cuota' : 'cuotas'}
          </SelectTrigger>
          <SelectContent className="z-[50010]">
            <SelectItem value="1">1 cuota</SelectItem>
            <SelectItem value="3">3 cuotas</SelectItem>
            <SelectItem value="6">6 cuotas</SelectItem>
            <SelectItem value="9">9 cuotas</SelectItem>
            <SelectItem value="12">12 cuotas</SelectItem>
            <SelectItem value="18">18 cuotas</SelectItem>
            <SelectItem value="24">24 cuotas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 relative z-50 w-full">
        <Button
          type="button"
          onClick={(e) => handleConfirmTransaction(e)}
          disabled={isLoading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10 text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Confirmar
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose?.()
          }}
          disabled={isLoading}
          variant="outline"
          className="flex-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent h-10 text-sm font-semibold"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  )
}
