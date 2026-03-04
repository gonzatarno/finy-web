'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { User, Bell, BellOff, AlertCircle, Trash2, Zap, ExternalLink, Sun, Moon, Monitor, LogOut, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/contexts/user-context'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import OneSignal from 'react-onesignal'
import { NotificationBlockedModal } from '@/components/notification-blocked-modal'
import { updatePushNotificationState, getOneSignalSubscriptionId } from '@/lib/push-notifications'

export function AccountSettingsComponent() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const { refreshUser, userPlan } = useUser()
  const { theme, setTheme } = useTheme()

  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [marketingEmails, setMarketingEmails] = useState<boolean>(false)
  const [dailyReminderActive, setDailyReminderActive] = useState<boolean>(false)
  const [weeklyReportEmails, setWeeklyReportEmails] = useState<boolean>(false)
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(false)
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false)
  const [showBlockedModal, setShowBlockedModal] = useState<boolean>(false)
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState<boolean>(false)
  const [changingPassword, setChangingPassword] = useState<boolean>(false)
  const [showPasswordSentModal, setShowPasswordSentModal] = useState<boolean>(false)

  const userInitials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  // Load user preferences from Supabase ONLY on mount and when email changes
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        if (!session?.user?.email) {
          setLoadingData(false)
          return
        }

        const supabase = createClient()
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (error) throw error

        if (data) {
          setFullName(data.name || '')
          setEmail(session.user.email || '')
          setMarketingEmails(Boolean(data.marketing_emails))
          setDailyReminderActive(Boolean(data.daily_reminder_active))
          setWeeklyReportEmails(Boolean(data.weekly_report_emails))
        }
      } catch (error) {
        console.error('[v0] Error loading user preferences:', error)
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las preferencias.',
          variant: 'destructive',
        })
      } finally {
        setLoadingData(false)
      }
    }

    loadUserPreferences()
  }, [session?.user?.email])

  // Check OneSignal push notification status on mount and listen for changes
  useEffect(() => {
    const currentDomain = typeof window !== "undefined" ? window.location.hostname : ""
    const isProductionDomain = currentDomain === "dashboard.finyapp.io"
    
    if (!isProductionDomain) {
      console.log('[v0] Push notifications not available - not on production domain')
      return
    }

    const checkPushStatus = async () => {
      try {
        // Wait a bit for OneSignal to be initialized globally
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if OneSignal is initialized and available
        if (typeof window !== 'undefined' && (window as any).OneSignal) {
          const isOptedIn = await (window as any).OneSignal.User.PushSubscription.optedIn
          setPushNotificationsEnabled(isOptedIn)
          console.log('[v0] Push notification status:', isOptedIn)
        } else {
          console.log('[v0] OneSignal not yet initialized')
        }
      } catch (error) {
        console.error('[v0] Error checking push notification status:', error)
      }
    }

    // Listen for permission changes
    const handlePermissionChange = async (isGranted: boolean) => {
      console.log('[v0] Permission changed:', isGranted)
      try {
        if (typeof window !== 'undefined' && (window as any).OneSignal && session?.user?.id) {
          const isOptedIn = await (window as any).OneSignal.User.PushSubscription.optedIn
          setPushNotificationsEnabled(isOptedIn)
          
          // Si el usuario aceptó las notificaciones, guardar en Supabase
          if (isGranted && isOptedIn) {
            const onesignalId = await getOneSignalSubscriptionId()
            await updatePushNotificationState(session.user.id, onesignalId, true)
            
            toast({
              title: 'Notificaciones activadas',
              description: 'Recibirás notificaciones push cuando sea necesario.',
              className: 'bg-green-500 text-white border-none',
            })
          }
        }
      } catch (error) {
        console.error('[v0] Error in permission change handler:', error)
      }
    }

    checkPushStatus()
    
    // Add permission change listener
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      (window as any).OneSignal.Notifications.addEventListener('permissionChange', handlePermissionChange)

      // Cleanup listener on unmount
      return () => {
        (window as any).OneSignal.Notifications.removeEventListener('permissionChange', handlePermissionChange)
      }
    }
  }, [])

  // Load push notification state from Supabase on mount
  useEffect(() => {
    const loadPushState = async () => {
      if (!session?.user?.id) return
      
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('users')
          .select('push_active, onesignal_id')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('[v0] Error loading push state:', error)
          return
        }

        if (data?.push_active) {
          setPushNotificationsEnabled(true)
        }
      } catch (error) {
        console.error('[v0] Error in loadPushState:', error)
      }
    }

    loadPushState()
  }, [session?.user?.id])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      if (!session?.user?.email) throw new Error('Usuario no autenticado')

      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ name: fullName })
        .eq('email', session.user.email)

      if (error) throw error

      await refreshUser()

      toast({
        title: '¡Guardado!',
        description: 'Tu perfil se actualizó correctamente.',
        className: 'bg-[#CEFD55] text-black border-none',
      })
    } catch (error) {
      console.error('[v0] Error saving profile:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchChange = async (
    switchName: 'marketing' | 'daily' | 'weekly',
    newValue: boolean,
  ) => {
    // Optimistic UI: update state immediately
    if (switchName === 'marketing') setMarketingEmails(newValue)
    if (switchName === 'daily') setDailyReminderActive(newValue)
    if (switchName === 'weekly') setWeeklyReportEmails(newValue)

    // Save in background
    try {
      if (!session?.user?.email) throw new Error('Usuario no autenticado')

      const supabase = createClient()
      
      const updateData: Record<string, boolean> = {}
      if (switchName === 'marketing') updateData.marketing_emails = newValue
      if (switchName === 'daily') updateData.daily_reminder_active = newValue
      if (switchName === 'weekly') updateData.weekly_report_emails = newValue

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('email', session.user.email)

      if (error) throw error

      toast({
        title: '¡Guardado!',
        description: 'Tus preferencias se actualizaron correctamente.',
        className: 'bg-[#CEFD55] text-black border-none',
      })
    } catch (error) {
      console.error('[v0] Error saving switch preference:', error)

      // Revert on error
      if (switchName === 'marketing') setMarketingEmails(!newValue)
      if (switchName === 'daily') setDailyReminderActive(!newValue)
      if (switchName === 'weekly') setWeeklyReportEmails(!newValue)

      toast({
        title: 'Error',
        description: 'No se pudo guardar la preferencia. Intenta de nuevo.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)
    try {
      if (!session?.user?.email) throw new Error('Usuario no autenticado')

      console.log('[v0] Starting account deletion for:', session.user.email)

      // Call server-side API to delete account with SERVICE_ROLE_KEY
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar cuenta')
      }

      const data = await response.json()
      console.log('[v0] Account deleted:', data)

      toast({
        title: 'Tu cuenta ha sido eliminada',
        description: 'Gracias por usar Finy.',
        className: 'bg-red-500 text-white border-none',
      })

      // Sign out and redirect
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('[v0] Error deleting account:', error)
      setDeletingAccount(false)
      setShowDeleteDialog(false)

      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'No se pudo eliminar la cuenta. Intenta de nuevo.',
        variant: 'destructive',
      })
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      if (!session?.user?.email) throw new Error('Usuario no autenticado')

      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({
          marketing_emails: marketingEmails,
          daily_reminder_active: dailyReminderActive,
          weekly_report_emails: weeklyReportEmails,
        })
        .eq('email', session.user.email)

      if (error) throw error

      toast({
        title: '¡Guardado!',
        description: 'Tus preferencias se actualizaron correctamente.',
        className: 'bg-[#CEFD55] text-black border-none',
      })
    } catch (error) {
      console.error('[v0] Error saving notifications:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar las preferencias. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setChangingPassword(true)
    try {
      if (!session?.user?.email) throw new Error('Usuario no autenticado')

      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      })

      if (error) throw error

      toast({
        title: 'Email enviado',
        description: 'Revisa tu correo para cambiar tu contraseña.',
        className: 'bg-[#CEFD55] text-black border-none',
      })

      setShowChangePasswordDialog(false)
      setShowPasswordSentModal(true)
    } catch (error) {
      console.error('Error sending password reset email:', error)
      toast({
        title: 'Error',
        description: 'No se pudo enviar el email de recuperación. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const handlePushNotificationToggle = async () => {
    // Only allow on production domain
    const currentDomain = typeof window !== "undefined" ? window.location.hostname : ""
    const isProductionDomain = currentDomain === "dashboard.finyapp.io"
    
    if (!isProductionDomain) {
      toast({
        title: 'No disponible',
        description: 'Las notificaciones push solo están disponibles en la versión de producción.',
        variant: 'destructive',
      })
      return
    }

    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener tu información de usuario.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Siempre usar window.OneSignal (cargado via script, no el paquete npm)
      const OS = (window as any).OneSignal
      if (!OS) {
        toast({ title: 'Error', description: 'OneSignal no está disponible aún.', variant: 'destructive' })
        return
      }

      // 1. Verificar permiso actual del navegador
      const currentPermission = OS.Notifications.permission

      // CASO BLOQUEADO
      if (currentPermission === 'denied') {
        setIsBlockedModalOpen(true)
        return
      }

      // CASO YA ACTIVADO: Desactivar (Opt-out)
      if (currentPermission === 'granted') {
        await OS.User.PushSubscription.optOut()
        setPushNotificationsEnabled(false)
        await updatePushNotificationState(session.user.id, null, false)
        toast({
          title: 'Desactivado',
          description: 'Las notificaciones push han sido desactivadas.',
          className: 'bg-gray-500 text-white border-none',
        })
        return
      }

      // CASO DEFAULT (aún no preguntó): Pedir permiso nativo
      await OS.Notifications.requestPermission()
      
      // Esperar a que el permiso se actualice (puede tomar unos ms)
      await new Promise(r => setTimeout(r, 500))
      
      const updatedPermission = OS.Notifications.permission

      if (updatedPermission === 'granted') {
        // Vincular el usuario con su ID de Supabase
        await OS.login(session.user.id)

        if (session.user.email) {
          OS.User.addEmail(session.user.email)
        }

        // Esperar a que la suscripción se registre y obtener el ID
        const subscriptionId = await getOneSignalSubscriptionId(15, 800)
        
        if (subscriptionId) {
          await updatePushNotificationState(session.user.id, subscriptionId, true)
        }

        setPushNotificationsEnabled(true)
        toast({
          title: 'Activado',
          description: 'Las notificaciones push han sido activadas.',
          className: 'bg-[#CEFD55] text-black border-none',
        })
      } else {
        // El usuario cerró el modal sin aceptar
        setPushNotificationsEnabled(false)
      }
      
    } catch (error) {
      console.error('[OneSignal] Error toggling push notifications:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado de las notificaciones.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Logout Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Configuración de Cuenta</h1>
          <p className="mt-1 text-gray-600 dark:text-zinc-400">Gestiona tu perfil y preferencias de notificaciones</p>
        </div>
        {/* Logout Button - Visible on mobile */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="md:hidden flex items-center gap-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      {/* Profile Section */}
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Tu Perfil</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Actualiza tu información personal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Avatar Display */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="bg-[#CEFD55] text-black text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{session?.user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">{session?.user?.email}</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-gray-900 dark:text-white">Nombre Completo</Label>
              <Input
                id="fullName"
                placeholder="Tu nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 dark:text-white"
                disabled={loadingData}
              />
            </div>

            {/* Email (read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white">Correo Electrónico</Label>
              <Input
                id="email"
                placeholder="tu@email.com"
                value={email}
                disabled
                className="bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400"
              />
              <p className="text-xs text-gray-500 dark:text-zinc-500">El correo electrónico no puede ser modificado</p>
            </div>

            {/* Change Password */}
            <div className="grid gap-2">
              <Label className="text-gray-900 dark:text-white">Contraseña</Label>
              <Button
                onClick={() => setShowChangePasswordDialog(true)}
                variant="outline"
                size="sm"
                className="w-full md:w-auto justify-start gap-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <Lock className="h-4 w-4" />
                Cambiar contraseña
              </Button>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Te enviaremos un email para cambiar tu contraseña</p>
            </div>

            {/* Save Button - Right Aligned */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={loading || loadingData}
                size="sm"
                className="bg-[#CEFD55] hover:bg-[#B8E64A] text-black font-semibold"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Tu Suscripción</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Gestiona tu plan y acceso a funciones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Current Plan Display */}
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'px-6 py-4 rounded-lg text-center',
                  userPlan === 'pro'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : userPlan === 'plus'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-gray-100 dark:bg-zinc-800'
                )}
              >
                <p
                  className={cn(
                    'text-2xl font-semibold',
                    userPlan === 'pro'
                      ? 'text-yellow-800 dark:text-yellow-400'
                      : userPlan === 'plus'
                        ? 'text-purple-800 dark:text-purple-400'
                        : 'text-gray-600 dark:text-zinc-400'
                  )}
                >
                  {userPlan === 'pro' ? 'PRO 👑' : userPlan === 'plus' ? 'PLUS ✨' : 'GRATIS'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">Límite mensual:</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userPlan === 'pro'
                    ? '3,000 créditos'
                    : userPlan === 'plus'
                      ? '1,000 créditos'
                      : '100 créditos'}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {userPlan === 'gratis' ? (
                <Button
                  onClick={() => window.open('https://finyapp.io/#precios', '_blank')}
                  className="bg-[#CEFD55] hover:bg-[#B8E64A] text-black font-semibold gap-2"
                >
                  Mejorar Plan
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => window.open('https://app.gumroad.com/library', '_blank')}
                  variant="outline"
                  className="gap-2"
                >
                  Gestionar Suscripción
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Notificaciones</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Controla cómo quieres recibir notificaciones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label className="font-medium text-gray-900 dark:text-white">Notificaciones Push</Label>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Recibe alertas en tiempo real en tu dispositivo</p>
              </div>
              <Switch
                checked={pushNotificationsEnabled}
                onCheckedChange={handlePushNotificationToggle}
                disabled={loadingData}
                className={cn('data-[state=checked]:bg-black dark:data-[state=checked]:bg-[#CEFD55]')}
              />
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800" />

            {/* Novedades y Tips */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label className="font-medium text-gray-900 dark:text-white">Novedades y Tips</Label>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Recibe actualizaciones y consejos útiles</p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={(value) => handleSwitchChange('marketing', value)}
                disabled={loadingData}
                className={cn('data-[state=checked]:bg-black dark:data-[state=checked]:bg-[#CEFD55]')}
              />
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800" />

            {/* Recordatorios por WhatsApp */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label className="font-medium text-gray-900 dark:text-white">Recordatorios por WhatsApp</Label>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Alertas diarias en WhatsApp</p>
              </div>
              <Switch
                checked={dailyReminderActive}
                onCheckedChange={(value) => handleSwitchChange('daily', value)}
                disabled={loadingData}
                className={cn('data-[state=checked]:bg-black dark:data-[state=checked]:bg-[#CEFD55]')}
              />
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800" />

            {/* Reportes Semanales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label className="font-medium text-gray-900 dark:text-white">Reportes Semanales</Label>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Resumen de gastos y estadísticas</p>
                </div>
                <Switch
                  checked={weeklyReportEmails}
                  onCheckedChange={(value) => handleSwitchChange('weekly', value)}
                  disabled={loadingData}
                  className={cn('data-[state=checked]:bg-black dark:data-[state=checked]:bg-[#CEFD55]')}
                />
              </div>

              {/* Help text */}
              <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Si desactivas esto, dejarás de recibir el resumen de tus gastos y estadísticas por email.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance/Theme Section */}
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Apariencia</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Personaliza cómo se ve Finy</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Light Mode */}
              <button
                onClick={() => setTheme('light')}
                disabled={loadingData}
                className={cn(
                  'flex flex-col items-center gap-3 px-4 py-6 rounded-lg border-2 font-medium transition-all',
                  theme === 'light'
                    ? 'border-[#CEFD55] bg-[#CEFD55]/10 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600'
                )}
              >
                <Sun className="h-8 w-8" />
                <span className="text-sm">Claro</span>
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => setTheme('dark')}
                disabled={loadingData}
                className={cn(
                  'flex flex-col items-center gap-3 px-4 py-6 rounded-lg border-2 font-medium transition-all',
                  theme === 'dark'
                    ? 'border-[#CEFD55] bg-[#CEFD55]/10 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600'
                )}
              >
                <Moon className="h-8 w-8" />
                <span className="text-sm">Oscuro</span>
              </button>

              {/* System Mode */}
              <button
                onClick={() => setTheme('system')}
                disabled={loadingData}
                className={cn(
                  'flex flex-col items-center gap-3 px-4 py-6 rounded-lg border-2 font-medium transition-all',
                  theme === 'system'
                    ? 'border-[#CEFD55] bg-[#CEFD55]/10 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600'
                )}
              >
                <Monitor className="h-8 w-8" />
                <span className="text-sm">Sistema</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-500 text-center">
              El modo Sistema sincroniza con las preferencias de tu dispositivo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
        <CardHeader className="border-b border-red-100 dark:border-red-900">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <CardTitle className="text-red-600 dark:text-red-400">Zona de Peligro</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Acciones irreversibles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-red-600 mb-2">Eliminar Cuenta</h3>
              <p className="text-sm text-red-700 mb-4">
                Esta acción es irreversible. Se borrarán todos tus gastos, configuraciones y el
                historial con el bot de WhatsApp.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setShowDeleteDialog(true)}
                disabled={loadingData}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Eliminar mi cuenta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Blocked Modal */}
      <NotificationBlockedModal isOpen={isBlockedModalOpen} onClose={() => setIsBlockedModalOpen(false)} />

      {/* Change Password Confirmation Dialog */}
      <AlertDialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Cambiar contraseña</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-zinc-400">
              Te enviaremos un email a <span className="font-semibold text-gray-900 dark:text-white">{email}</span> con un enlace para cambiar tu contraseña.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-gray-300 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="bg-[#CEFD55] hover:bg-[#B8E64A] text-black"
            >
              {changingPassword ? 'Enviando...' : 'Enviar email'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              No podrás recuperar tus datos. Tu suscripción se cancelará y el bot dejará de responderte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-gray-300">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingAccount ? 'Eliminando...' : 'Sí, eliminar cuenta'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Email Sent Modal */}
      <AlertDialog open={showPasswordSentModal} onOpenChange={setShowPasswordSentModal}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-green-200 dark:border-green-800 max-w-sm">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl text-gray-900 dark:text-white">Email enviado</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 dark:text-zinc-400 pt-2">
              Revisa tu bandeja de entrada y sigue el enlace para cambiar tu contraseña. El enlace expirará en 24 horas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center pt-4">
            <AlertDialogAction
              onClick={() => setShowPasswordSentModal(false)}
              className="bg-[#CEFD55] hover:bg-[#B8E64A] text-black font-semibold px-8"
            >
              Entendido
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
