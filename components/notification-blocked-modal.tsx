"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { BellOff } from "lucide-react"

interface NotificationBlockedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationBlockedModal({ isOpen, onClose }: NotificationBlockedModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
              <BellOff className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-gray-900 dark:text-white text-xl">
            Notificaciones bloqueadas
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-600 dark:text-zinc-400 space-y-3">
            <p>
              Las notificaciones están bloqueadas. Para recibirlas, debes activarlas manualmente desde la configuración
              de tu navegador o dispositivo.
            </p>
            <p className="text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <strong className="text-amber-900 dark:text-amber-200">Nota para iOS (PWA):</strong> Si estás en iPhone y
              no encuentras la App en Configuración, elimina este acceso directo de la pantalla de inicio y agrégalo
              nuevamente para resetear los permisos.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center pt-2">
          <Button
            onClick={onClose}
            className="bg-[#CEFD55] hover:bg-[#CEFD55]/90 text-black font-semibold px-8"
          >
            Entendido
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
