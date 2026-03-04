'use client'

import React from "react"

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { X, Pencil, Lock, LogOut, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentIcon } from '@/components/PaymentIcon'
import { usePaymentMethods } from '@/hooks/use-payment-methods'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

interface Item {
  id: string
  name: string
  icon?: string
  color?: string
  icon_color?: string
}

const AVAILABLE_ICONS = ['wallet', 'credit-card', 'banknote', 'landmark', 'smartphone', 'bitcoin', 'dollar-sign', 'circle']

const COLORS = [
  { name: 'Gris', value: '#6B7280' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Amarillo', value: '#F59E0B' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Naranja', value: '#F97316' }
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const { methods, loading } = usePaymentMethods()

  const [methodName, setMethodName] = useState('')
  const [methodIcon, setMethodIcon] = useState('wallet')
  const [methodColor, setMethodColor] = useState('#6B7280')
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null)

  // Security tab states
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isSigningOutGlobal, setIsSigningOutGlobal] = useState(false)

  const startEditingMethod = (method: Item) => {
    setMethodName(method.name)
    setMethodIcon(method.icon || 'wallet')
    setMethodColor(method.color || method.icon_color || '#6B7280')
    setEditingMethodId(method.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEditing = () => {
    setMethodName('')
    setMethodIcon('wallet')
    setMethodColor('#6B7280')
    setEditingMethodId(null)
  }

  const handleSaveMethod = async () => {
    if (!methodName.trim() || !session?.user?.email) return

    try {
      const isEditing = !!editingMethodId

      await fetch('/api/settings', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          type: 'methods',
          name: methodName,
          icon: methodIcon,
          color: methodColor,
          icon_color: methodColor,
          id: editingMethodId
        })
      })

      toast({ title: isEditing ? 'Actualizado' : 'Creado' })
      cancelEditing()

    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleDeleteMethod = async (id: string) => {
    await fetch('/api/settings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session?.user?.email, type: 'methods', id })
    })
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    // Validations
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError('Por favor completa ambos campos')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    setIsUpdatingPassword(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        if (error.message.includes('password')) {
          setPasswordError('La contraseña debe tener al menos 6 caracteres')
        } else {
          setPasswordError(error.message)
        }
        setIsUpdatingPassword(false)
        return
      }

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente.',
        duration: 3000
      })

      setNewPassword('')
      setConfirmPassword('')
      setIsUpdatingPassword(false)
    } catch (err) {
      console.error('[v0] Password update error:', err)
      setPasswordError('Error al actualizar la contraseña')
      setIsUpdatingPassword(false)
    }
  }

  const handleGlobalSignOut = async () => {
    setIsSigningOutGlobal(true)

    try {
      const supabase = createClient()

      // Try to use global scope for sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' })

      if (error) {
        console.error('[v0] Global sign out error:', error)
        // Fallback to regular sign out
        await signOut({ redirect: true, callbackUrl: '/' })
        return
      }

      // Redirect to login after global sign out
      await signOut({ redirect: true, callbackUrl: '/' })
    } catch (err) {
      console.error('[v0] Sign out error:', err)
      await signOut({ redirect: true, callbackUrl: '/' })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        <h1 className="text-3xl font-semibold">Configuración</h1>

        <Tabs defaultValue="payment-methods" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="payment-methods">Métodos de pago</TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de pago</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                {/* FORMULARIO */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border rounded-lg bg-muted/30">

                  <div className="md:col-span-5 space-y-1">
                    <label className="text-xs font-medium">Nombre</label>
                    <Input value={methodName} onChange={e => setMethodName(e.target.value)} />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-medium">Icono</label>
                    <Select value={methodIcon} onValueChange={setMethodIcon}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ICONS.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              <PaymentIcon iconName={icon} color={methodColor} size="sm" showBackground={false} />
                              <span>{icon}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-medium">Color</label>
                    <Select value={methodColor} onValueChange={setMethodColor}>
                      <SelectTrigger>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: methodColor }} />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map(c => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: c.value }} />
                              {c.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Button onClick={handleSaveMethod} className="w-full bg-[#adfa1d] text-black hover:bg-[#9de418]">
                      {editingMethodId ? 'Guardar' : 'Agregar'}
                    </Button>
                  </div>
                </div>

                {/* LISTA */}
                <div className="space-y-2">
                  {loading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : methods.map((method: Item) => {
                    const finalColor = method.color || method.icon_color || '#6B7280'

                    return (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">

                        <div className="flex items-center gap-3">
                          <PaymentIcon
                            iconName={method.icon}
                            color={finalColor}
                            size="md"
                            showBackground={true}
                          />

                          <span className="font-medium">{method.name}</span>
                        </div>

                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => startEditingMethod(method)}>
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteMethod(method.id)}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>

                      </div>
                    )
                  })}
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Change Password Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Cambiar Contraseña
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    {passwordError && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        Nueva Contraseña
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirmar Contraseña
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        'Actualizar'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Global Sign Out Card */}
              <Card className="border-red-200 dark:border-red-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión Global
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Cierra tu sesión en todos los dispositivos donde hayas iniciado sesión. Tendrás que iniciar sesión nuevamente.
                  </p>

                  <Button
                    onClick={handleGlobalSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={isSigningOutGlobal}
                  >
                    {isSigningOutGlobal ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cerrando sesión...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión Global
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
