'use client'

import { SelectValue } from "@/components/ui/select"
import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import React from "react"
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { X, CreditCard, Banknote, Landmark, Smartphone, Wallet, Bitcoin, DollarSign } from 'lucide-react'
import { PaymentIcon } from '@/components/PaymentIcon'

const PAYMENT_METHOD_ICONS = [
  { name: 'credit-card', icon: <CreditCard className="w-6 h-6" />, label: 'Tarjeta' },
  { name: 'banknote', icon: <Banknote className="w-6 h-6" />, label: 'Efectivo' },
  { name: 'landmark', icon: <Landmark className="w-6 h-6" />, label: 'Transferencia' },
  { name: 'smartphone', icon: <Smartphone className="w-6 h-6" />, label: 'Billetera Digital' },
  { name: 'wallet', icon: <Wallet className="w-6 h-6" />, label: 'Billetera' },
  { name: 'bitcoin', icon: <Bitcoin className="w-6 h-6" />, label: 'Bitcoin' },
  { name: 'dollar-sign', icon: <DollarSign className="w-6 h-6" />, label: 'Dólar' },
]

const CATEGORY_EMOJIS = [
  '🍔', '🛒', '🚗', '🏠', '💊', '✈️', '🎮', '🎓', 
  '🎁', '🔧', '🧾', '💹', '🍜', '🎬', '🏋️', '💼',
  '📱', '⚡', '🌍', '🎸', '📚', '🏥', '👕', '🎨'
]

const ICON_COLORS = [
  { name: 'blue', label: 'Azul', hex: '#3B82F6' },
  { name: 'red', label: 'Rojo', hex: '#EF4444' },
  { name: 'green', label: 'Verde', hex: '#10B981' },
  { name: 'purple', label: 'Púrpura', hex: '#8B5CF6' },
  { name: 'orange', label: 'Naranja', hex: '#F97316' },
  { name: 'gray', label: 'Gris', hex: '#6B7280' },
]

const ICON_MAP: { [key: string]: React.FC } = {
  'credit-card': CreditCard,
  'banknote': Banknote,
  'landmark': Landmark,
  'smartphone': Smartphone,
  'wallet': Wallet,
  'bitcoin': Bitcoin,
  'dollar-sign': DollarSign,
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

const getIconComponent = (iconName?: string) => {
  const IconComponent = ICON_MAP[iconName || 'wallet'];
  return <IconComponent className="w-6 h-6" />;
};

export function SettingsPageComponent() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategoryEmoji, setSelectedCategoryEmoji] = useState('📁')
  const [newMethod, setNewMethod] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('wallet')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [loadingCreate, setLoadingCreate] = useState<'categories' | 'methods' | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingMethod, setEditingMethod] = useState<Item | null>(null)
  const [editingIcon, setEditingIcon] = useState('wallet')
  const [editingColor, setEditingColor] = useState('#3B82F6')
  const [showMethodModal, setShowMethodModal] = useState(false)
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null)

  // Fetch data
  const { data: categoriesData, mutate: mutateCategories, isLoading: loadingCategories } = useSWR(
    session?.user?.email
      ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=categories`
      : null,
    fetcher
  )

  const { data: methodsData, mutate: mutateMethods, isLoading: loadingMethods } = useSWR(
    session?.user?.email
      ? `/api/settings?email=${encodeURIComponent(session.user.email)}&type=methods`
      : null,
    fetcher
  )

  const categories = categoriesData?.data || []
  const methods = methodsData?.data || []

  console.log('[v0] Methods data:', methods)

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !session?.user?.email) return

    setLoadingCreate('categories')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          type: 'categories',
          name: newCategory,
          icon: selectedCategoryEmoji || '📁'
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error creating category')
      }

      toast({
        title: 'Categoría creada',
        description: `${selectedCategoryEmoji} "${newCategory}" fue añadida exitosamente.`,
        duration: 3000
      })
      setNewCategory('')
      setSelectedCategoryEmoji('📁')
      mutateCategories()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear la categoría',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setLoadingCreate(null)
    }
  }

  const handleAddMethod = async () => {
    if (!newMethod.trim() || !session?.user?.email) return

    setLoadingCreate('methods')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          type: 'methods',
          name: newMethod,
          icon: selectedIcon,
          icon_color: selectedColor
        })
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Error creating payment method')
      }

      toast({
        title: 'Método de pago creado',
        description: `"${newMethod}" fue añadido con éxito.`,
        duration: 3000
      })
      handleCloseModal()
      await mutateMethods()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear el método de pago',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setLoadingCreate(null)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!session?.user?.email) return

    setDeletingId(id)
    try {
      const res = await fetch('/api/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          type: 'categories',
          id
        })
      })

      if (!res.ok) {
        throw new Error('Error deleting category')
      }

      toast({
        title: 'Categoría eliminada',
        description: 'La categoría fue removida exitosamente.',
        duration: 3000
      })
      mutateCategories()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar la categoría',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteMethod = async (id: string) => {
    if (!session?.user?.email) return

    setDeletingId(id)
    try {
      const res = await fetch('/api/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          type: 'methods',
          id
        })
      })

      if (!res.ok) {
        throw new Error('Error deleting payment method')
      }

      toast({
        title: 'Método de pago eliminado',
        description: 'El método fue removido exitosamente.',
        duration: 3000
      })
      mutateMethods()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar el método de pago',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setDeletingId(null)
      setDeletingMethodId(null)
    }
  }

  const handleEditMethod = (method: Item) => {
    setEditingMethod(method)
    setNewMethod(method.name)
    setEditingIcon(method.icon || 'wallet')
    setEditingColor(method.color || method.icon_color || '#3B82F6')
    setShowMethodModal(true)
  }

  const handleOpenNewMethodModal = () => {
    setEditingMethod(null)
    setNewMethod('')
    setSelectedIcon('wallet')
    setSelectedColor('#3B82F6')
    setShowMethodModal(true)
  }

  const handleCloseModal = () => {
    setShowMethodModal(false)
    setEditingMethod(null)
    setNewMethod('')
    setSelectedIcon('wallet')
    setSelectedColor('#3B82F6')
    setEditingIcon('wallet')
    setEditingColor('#3B82F6')
  }

  const handleSaveEditMethod = async () => {
    if (!editingMethod || !newMethod.trim() || !session?.user?.email) return

    setLoadingCreate('methods')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          type: 'methods',
          id: editingMethod.id,
          name: newMethod,
          icon: editingIcon,
          icon_color: editingColor
        })
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Error updating payment method')
      }

      toast({
        title: 'Método de pago actualizado',
        description: `"${newMethod}" fue actualizado exitosamente.`,
        duration: 3000
      })
      handleCloseModal()
      await mutateMethods()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el método de pago',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setLoadingCreate(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl w-full max-w-full">
      {/* Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-zinc-800">
          <TabsTrigger value="categories" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Categorías</TabsTrigger>
          <TabsTrigger value="methods" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">Métodos de Pago</TabsTrigger>
        </TabsList>

        {/* Tab: Categorías */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Mis Categorías</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Crea y gestiona las categorías de tus transacciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selector de Emoji */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Emoji (opcional)</label>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-4xl">{selectedCategoryEmoji}</div>
                  <span className="text-xs text-muted-foreground">Emoji seleccionado</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {CATEGORY_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedCategoryEmoji(emoji)}
                      className={`text-2xl p-2 rounded-lg transition-all duration-200 ${
                        selectedCategoryEmoji === emoji
                          ? 'bg-[#CEFD55] scale-110 shadow-md'
                          : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'
                      }`}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input para agregar */}
              <div className="flex gap-2 pt-3">
                <Input
                  placeholder="Nueva categoría (ej: Comida, Transporte...)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  disabled={loadingCreate === 'categories'}
                />
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim() || loadingCreate === 'categories'}
                  className="px-6"
                >
                  {loadingCreate === 'categories' ? 'Agregando...' : 'Agregar'}
                </Button>
              </div>

              {/* Lista de categorías */}
              <div className="space-y-2">
                {loadingCategories ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-md" />
                  ))
                ) : categories.length > 0 ? (
                  categories.map((category: Item) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-foreground text-lg">
                        {category.icon || '📁'} {category.name}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deletingId === category.id}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                        aria-label="Delete category"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Aún no tienes categorías personalizadas. Crea una para comenzar.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Métodos de Pago */}
        <TabsContent value="methods" className="space-y-4">
          <Card className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Mis Métodos de Pago</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Crea y gestiona tus métodos de pago personalizados con iconos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Botón para abrir modal */}
              <Button onClick={handleOpenNewMethodModal} className="w-full sm:w-auto">
                + Agregar Método
              </Button>

              {/* Lista de métodos creados */}
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Métodos existentes</h3>
                {loadingMethods ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-md" />
                  ))
                ) : methods.length > 0 ? (
                  <div className="space-y-2">
                    {methods.map((method: Item) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <PaymentIcon
                            iconName={method.icon}
                            color={method.color || method.icon_color || '#6B7280'}
                            size="md"
                            showBackground={true}
                          />
                          <span className="font-medium text-foreground">{method.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditMethod(method)}
                            disabled={loadingCreate === 'methods'}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                            aria-label="Edit payment method"
                            title="Editar"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingMethodId(method.id)}
                            disabled={loadingCreate === 'methods' || deletingId === method.id}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                            aria-label="Delete payment method"
                            title="Eliminar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Aún no tienes métodos de pago personalizados. Crea uno para comenzar.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para crear/editar método */}
      <Dialog open={showMethodModal} onOpenChange={setShowMethodModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}</DialogTitle>
            <DialogDescription>
              {editingMethod 
                ? 'Edita el nombre, icono y color del método' 
                : 'Crea un nuevo método de pago con nombre, icono y color personalizado'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                placeholder="Ej: Mi Tarjeta, Billetera, etc."
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (editingMethod ? handleSaveEditMethod() : handleAddMethod())}
              />
            </div>

            {/* Icono */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Icono</label>
              <Select 
                value={editingMethod ? editingIcon : selectedIcon} 
                onValueChange={editingMethod ? setEditingIcon : setSelectedIcon}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHOD_ICONS.map((icon) => (
                    <SelectItem key={icon.name} value={icon.name}>
                      <div className="flex items-center gap-2">
                        <div style={{ color: editingMethod ? editingColor : selectedColor }}>{icon.icon}</div>
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <Select 
                value={editingMethod ? editingColor : selectedColor} 
                onValueChange={editingMethod ? setEditingColor : setSelectedColor}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_COLORS.map((color) => (
                    <SelectItem key={color.name} value={color.hex}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <PaymentIcon
                iconName={editingMethod ? editingIcon : selectedIcon}
                color={editingMethod ? editingColor : selectedColor}
                size="md"
                showBackground={true}
              />
              <span className="font-medium text-sm">{newMethod || 'Vista previa'}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              onClick={editingMethod ? handleSaveEditMethod : handleAddMethod}
              disabled={!newMethod.trim() || loadingCreate === 'methods'}
            >
              {loadingCreate === 'methods' 
                ? editingMethod ? 'Guardando...' : 'Agregando...' 
                : editingMethod ? 'Guardar Cambios' : 'Crear Método'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert para confirmar eliminación */}
      <AlertDialog open={!!deletingMethodId} onOpenChange={(open) => !open && setDeletingMethodId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Método de Pago</AlertDialogTitle>
            <AlertDialogDescription>
              Este método será eliminado. Nota que esto puede afectar a las transacciones que usan este método en toda la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingMethodId && handleDeleteMethod(deletingMethodId)}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface Item {
  id: string
  name: string
  user_id: string
  icon?: string
  icon_color?: string
  color?: string
  created_at?: string
}

interface IconOption {
  name: string
  icon: React.ReactNode
  label: string
}
