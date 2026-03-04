"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Target, Trash2, CalendarDays, Trophy, Grid2x2, Home, Plane, Car, Gem, Book, Gamepad2, Sun, GraduationCap, Zap, Mountain, Palette, Music, Play, Theater } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SavingGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  currency: "ARS" | "USD"
  deadline: string | null
  icon: string
  status: "active" | "completed"
  created_at: string
}

const GOAL_ICONS = [
  { id: "target", name: "Meta", icon: Target },
  { id: "home", name: "Casa", icon: Home },
  { id: "plane", name: "Viaje", icon: Plane },
  { id: "car", name: "Auto", icon: Car },
  { id: "gem", name: "Joya", icon: Gem },
  { id: "book", name: "Educación", icon: Book },
  { id: "gamepad", name: "Entretenimiento", icon: Gamepad2 },
  { id: "sun", name: "Vacaciones", icon: Sun },
  { id: "graduation", name: "Estudio", icon: GraduationCap },
  { id: "zap", name: "Electrónica", icon: Zap },
  { id: "mountain", name: "Aventura", icon: Mountain },
  { id: "palette", name: "Arte", icon: Palette },
  { id: "music", name: "Música", icon: Music },
  { id: "play", name: "Deporte", icon: Play },
  { id: "theater", name: "Entretenimiento", icon: Theater },
]

const CURRENCY_SYMBOLS: Record<string, string> = {
  ARS: "$",
  USD: "US$",
}

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] || "$"
  return `${symbol} ${amount.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function getGoalIconComponent(iconId: string) {
  const goalIcon = GOAL_ICONS.find((g) => g.id === iconId)
  if (!goalIcon) return null
  return goalIcon.icon
}

function formatNumberInput(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (!numbers) return ""
  return parseInt(numbers).toLocaleString("es-AR")
}

// Empty state
function EmptyGoals({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#CEFD55]/20 flex items-center justify-center mb-6">
        <Target className="w-10 h-10 text-black dark:text-[#CEFD55]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Aun no tenes metas de ahorro
      </h3>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 max-w-sm leading-relaxed">
        Define un objetivo, ponele un nombre y empeza a ahorrar para lo que realmente importa.
      </p>
      <Button
        onClick={onNew}
        variant="outline"
        className="font-semibold dark:border-zinc-700 dark:text-zinc-300"
      >
        <Plus className="mr-2 h-4 w-4" />
        Crear primera meta
      </Button>
    </div>
  )
}

// Goal card
function GoalCard({
  goal,
  onContribute,
  onDelete,
}: {
  goal: SavingGoal
  onContribute: (goal: SavingGoal) => void
  onDelete: (id: string) => void
}) {
  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const isCompleted = goal.status === "completed"

  return (
    <Card className="border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#CEFD55]/10 flex items-center justify-center flex-shrink-0">
              {getGoalIconComponent(goal.icon) && 
                (() => {
                  const IconComponent = getGoalIconComponent(goal.icon)
                  return <IconComponent className="w-5 h-5 text-[#6b8c00]" />
                })()
              }
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{goal.name}</h3>
              {goal.deadline && (
                <div className="flex items-center gap-1 mt-1">
                  <CalendarDays className="w-3 h-3 text-gray-400 dark:text-zinc-500" />
                  <span className="text-xs text-gray-400 dark:text-zinc-500">
                    {format(new Date(goal.deadline), "d MMM yyyy", { locale: es })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isCompleted && (
              <Badge className="bg-[#CEFD55] text-black text-xs font-semibold border-0">
                <Trophy className="w-3 h-3 mr-1" />
                Completada
              </Badge>
            )}
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
              {progress.toFixed(0)}% completado
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {formatAmount(goal.current_amount, goal.currency)} / {formatAmount(goal.target_amount, goal.currency)}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2.5 bg-gray-100 dark:bg-zinc-800"
            style={{
              // Override the indicator color via CSS variable
            }}
          />
          {/* Custom colored indicator overlay */}
          <div className="relative -mt-4">
            <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: isCompleted ? "#22c55e" : "#CEFD55",
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-zinc-400">
          Ahorrado: <span className="font-semibold text-gray-900 dark:text-white">{formatAmount(goal.current_amount, goal.currency)}</span>
          {" "}de{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{formatAmount(goal.target_amount, goal.currency)}</span>
        </p>

        {!isCompleted && (
          <Button
            onClick={() => onContribute(goal)}
            className="w-full font-semibold text-black"
            style={{ backgroundColor: "#CEFD55" }}
          >
            Aportar
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Skeleton card
function GoalCardSkeleton() {
  return (
    <Card className="border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse w-2/3" />
        <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
      </CardContent>
    </Card>
  )
}

export function SavingsGoalsDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [goals, setGoals] = useState<SavingGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // New Goal modal
  const [showNewModal, setShowNewModal] = useState(false)
  const [isSavingNew, setIsSavingNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newIcon, setNewIcon] = useState("target")
  const [newTarget, setNewTarget] = useState("")
  const [newCurrency, setNewCurrency] = useState("ARS")
  const [newDeadline, setNewDeadline] = useState("")

  // Contribute modal
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null)
  const [contributeAmount, setContributeAmount] = useState("")
  const [isSavingContribute, setIsSavingContribute] = useState(false)

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

  const fetchGoals = async () => {
    if (!session?.user?.email) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/savings-goals?email=${encodeURIComponent(session.user.email)}`)
      if (!res.ok) throw new Error("Error al cargar metas")
      const data = await res.json()
      setGoals(data)
    } catch (err) {
      toast({ title: "Error", description: "No se pudieron cargar las metas.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [session?.user?.email])

  const handleCreateGoal = async () => {
    if (!newName || !newTarget || !newCurrency) return
    setIsSavingNew(true)
    try {
      const res = await fetch("/api/savings-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          name: newName,
          icon: newIcon || "target",
          target_amount: Number(newTarget),
          currency: newCurrency,
          deadline: newDeadline || null,
        }),
      })
      const responseData = await res.json()
      if (!res.ok) throw new Error(responseData?.message || "Error al crear meta")
      await fetchGoals()
      setShowNewModal(false)
      setNewName(""); setNewIcon("target"); setNewTarget(""); setNewCurrency("ARS"); setNewDeadline("")
      toast({ title: "Meta creada", description: `"${newName}" fue agregada exitosamente.` })
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo crear la meta.", variant: "destructive" })
    } finally {
      setIsSavingNew(false)
    }
  }

  const handleContribute = async () => {
    if (!selectedGoal || !contributeAmount) return
    setIsSavingContribute(true)
    try {
      const res = await fetch("/api/savings-goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedGoal.id, amount_to_add: Number(contributeAmount) }),
      })
      if (!res.ok) throw new Error("Error al aportar")
      const updated: SavingGoal = await res.json()
      await fetchGoals()
      setShowContributeModal(false)
      setContributeAmount("")
      if (updated.status === "completed") {
        toast({ title: "Meta completada!", description: `Lograste tu objetivo "${selectedGoal.name}".` })
      } else {
        toast({ title: "Aporte registrado", description: `Se sumaron ${formatAmount(Number(contributeAmount), selectedGoal.currency)} a "${selectedGoal.name}".` })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo registrar el aporte.", variant: "destructive" })
    } finally {
      setIsSavingContribute(false)
    }
  }

  const handleDelete = async (id: string) => {
    setGoalToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!goalToDelete) return
    try {
      const res = await fetch(`/api/savings-goals?id=${goalToDelete}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete))
      toast({ title: "Meta eliminada" })
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar la meta.", variant: "destructive" })
    } finally {
      setShowDeleteConfirm(false)
      setGoalToDelete(null)
    }
  }

  const openContribute = (goal: SavingGoal) => {
    setSelectedGoal(goal)
    setContributeAmount("")
    setShowContributeModal(true)
  }

  return (
    <div className="mx-auto max-w-7xl w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Metas</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Ahorra para lo que mas importa
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <GoalCardSkeleton key={i} />)}
        </div>
      ) : goals.length === 0 ? (
        <EmptyGoals onNew={() => setShowNewModal(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add New Goal Card */}
          <Card
            onClick={() => setShowNewModal(true)}
            className="border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-[#CEFD55] dark:hover:border-[#CEFD55] cursor-pointer transition-all bg-white dark:bg-zinc-900 h-full flex items-center justify-center min-h-[250px] hover:bg-gray-50 dark:hover:bg-zinc-800/50"
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-12 h-12 rounded-full bg-[#CEFD55]/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-[#CEFD55]" />
              </div>
              <p className="text-center text-gray-900 dark:text-white font-medium">Agregar Meta</p>
              <p className="text-center text-sm text-gray-500 dark:text-zinc-400">Crea una nueva meta de ahorro</p>
            </CardContent>
          </Card>

          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={openContribute}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Mobile FAB - Removed, using drawer button instead */}

      {/* New Goal Modal/Drawer */}
      {isMobile ? (
        <Drawer open={showNewModal} onOpenChange={setShowNewModal}>
          <DrawerContent className="bg-white dark:bg-zinc-900 max-h-[95vh]">
            <DrawerHeader className="border-b border-gray-200 dark:border-zinc-800 shrink-0">
              <DrawerTitle className="text-gray-900 dark:text-white">Nueva Meta de Ahorro</DrawerTitle>
            </DrawerHeader>

            <div className="overflow-y-auto overflow-x-hidden space-y-4 py-4 px-3 flex-1">
              {/* Icon Selector Grid */}
              <div>
                <Label className="text-gray-700 dark:text-zinc-300 mb-3 block">Selecciona un ícono</Label>
                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                  {GOAL_ICONS.map(({ id, icon: IconComponent }) => (
                    <button
                      key={id}
                      onClick={() => setNewIcon(id)}
                      className={`p-2 sm:p-3 rounded-lg transition-all border-2 flex items-center justify-center ${
                        newIcon === id
                          ? "border-[#CEFD55] bg-[#CEFD55]/10"
                          : "border-gray-200 dark:border-zinc-700 hover:border-[#CEFD55] dark:hover:border-[#CEFD55]"
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${newIcon === id ? "text-[#6b8c00]" : "text-gray-600 dark:text-zinc-400"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Name */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-zinc-300 text-sm">Nombre de la meta</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Viaje a Europa"
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 text-sm h-10"
                />
              </div>

              {/* Amount and Currency */}
              <div className="flex gap-2 sm:gap-3">
                <div className="space-y-1.5 flex-1">
                  <Label className="text-gray-700 dark:text-zinc-300 text-sm">Monto objetivo</Label>
                  <Input
                    type="text"
                    value={formatNumberInput(newTarget)}
                    onChange={(e) => setNewTarget(e.target.value.replace(/\D/g, ""))}
                    placeholder="100000"
                    className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 text-sm h-10"
                  />
                </div>
                <div className="space-y-1.5 w-24 sm:w-32">
                  <Label className="text-gray-700 dark:text-zinc-300 text-sm">Moneda</Label>
                  <Select value={newCurrency} onValueChange={setNewCurrency}>
                    <SelectTrigger className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
                      <SelectItem value="ARS">PESOS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-zinc-300 text-sm">Fecha límite (opcional)</Label>
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm h-10"
                />
                {newDeadline && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    {format(new Date(newDeadline), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                )}
              </div>
            </div>

            <DrawerFooter className="gap-2 border-t border-gray-200 dark:border-zinc-800 shrink-0">
              <Button variant="outline" onClick={() => setShowNewModal(false)} className="dark:border-zinc-700 dark:text-zinc-300 text-sm h-10">
                Cancelar
              </Button>
              <Button
                onClick={handleCreateGoal}
                disabled={isSavingNew || !newName || !newTarget}
                className="font-semibold text-black text-sm h-10"
                style={{ backgroundColor: "#CEFD55" }}
              >
                {isSavingNew ? "Guardando..." : "Crear Meta"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Nueva Meta de Ahorro</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Icon Selector Grid */}
              <div>
                <Label className="text-gray-700 dark:text-zinc-300 mb-3 block">Selecciona un ícono</Label>
                <div className="grid grid-cols-5 gap-2">
                  {GOAL_ICONS.map(({ id, icon: IconComponent }) => (
                    <button
                      key={id}
                      onClick={() => setNewIcon(id)}
                      className={`p-3 rounded-lg transition-all border-2 flex items-center justify-center ${
                        newIcon === id
                          ? "border-[#CEFD55] bg-[#CEFD55]/10"
                          : "border-gray-200 dark:border-zinc-700 hover:border-[#CEFD55] dark:hover:border-[#CEFD55]"
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${newIcon === id ? "text-[#6b8c00]" : "text-gray-600 dark:text-zinc-400"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Name */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-zinc-300">Nombre de la meta</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Viaje a Europa"
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              {/* Amount and Currency */}
              <div className="flex gap-3">
                <div className="space-y-1.5 flex-1">
                  <Label className="text-gray-700 dark:text-zinc-300">Monto objetivo</Label>
                  <Input
                    type="text"
                    value={formatNumberInput(newTarget)}
                    onChange={(e) => setNewTarget(e.target.value.replace(/\D/g, ""))}
                    placeholder="100000"
                    className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>
                <div className="space-y-1.5 w-32">
                  <Label className="text-gray-700 dark:text-zinc-300">Moneda</Label>
                  <Select value={newCurrency} onValueChange={setNewCurrency}>
                    <SelectTrigger className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
                      <SelectItem value="ARS">PESOS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-zinc-300">Fecha límite (opcional)</Label>
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  placeholder="dd/mm/yyyy"
                />
                {newDeadline && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    {format(new Date(newDeadline), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowNewModal(false)} className="dark:border-zinc-700 dark:text-zinc-300">
                Cancelar
              </Button>
              <Button
                onClick={handleCreateGoal}
                disabled={isSavingNew || !newName || !newTarget}
                className="font-semibold text-black"
                style={{ backgroundColor: "#CEFD55" }}
              >
                {isSavingNew ? "Guardando..." : "Crear Meta"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Contribute Modal */}
      <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Aportar a "{selectedGoal?.name}"
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-4">
            {selectedGoal && (
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-800 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Ahorrado</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatAmount(selectedGoal.current_amount, selectedGoal.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Objetivo</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatAmount(selectedGoal.target_amount, selectedGoal.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Restante</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatAmount(Math.max(selectedGoal.target_amount - selectedGoal.current_amount, 0), selectedGoal.currency)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-gray-700 dark:text-zinc-300">
                Cuanto queres sumar? ({selectedGoal?.currency})
              </Label>
              <Input
                type="number"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                placeholder="Ej: 5000"
                min="1"
                autoFocus
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowContributeModal(false)} className="dark:border-zinc-700 dark:text-zinc-300">
              Cancelar
            </Button>
            <Button
              onClick={handleContribute}
              disabled={isSavingContribute || !contributeAmount || Number(contributeAmount) <= 0}
              className="font-semibold text-black"
              style={{ backgroundColor: "#CEFD55" }}
            >
              {isSavingContribute ? "Guardando..." : "Aportar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="dark:bg-zinc-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">¿Eliminar meta?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-zinc-400">
              Esta acción no se puede deshacer. La meta será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-zinc-700 dark:text-zinc-300">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
