"use client"

import { useContext } from "react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PenLine, Sparkles } from "lucide-react"
import { UserContext } from "@/contexts/user-context"
import { ProUpgradePromoBanner } from "@/components/pro-upgrade-promo-banner"

interface DesktopAddActionModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenManualLoad: () => void
  onOpenAIChat?: () => void
}

export function DesktopAddActionModal({ isOpen, onClose, onOpenManualLoad, onOpenAIChat }: DesktopAddActionModalProps) {
  const userContext = useContext(UserContext)
  const isFreeUser = !userContext?.userPlan || userContext.userPlan === "gratis"

  const handleManualEntry = () => {
    onClose()
    setTimeout(() => {
      onOpenManualLoad()
    }, 200)
  }

  const handleAIEntry = () => {
    onClose()
    setTimeout(() => {
      onOpenAIChat?.()
    }, 200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center mb-2 text-black dark:text-white">
            ¿Cómo quieres agregar el movimiento?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Ad Banner for Free Users */}
          {isFreeUser && <ProUpgradePromoBanner />}
          
          {/* Option 1: Manual Load */}
          <button
            onClick={handleManualEntry}
            className="w-full flex items-start gap-4 p-4 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-[#CEFD55]/50 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-[#CEFD55] rounded-2xl flex items-center justify-center">
              <PenLine className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-1">Carga manual</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Escribe el gasto manualmente.</p>
            </div>
          </button>

          {/* Option 2: AI Entry */}
          <button
            onClick={handleAIEntry}
            className="w-full flex items-start gap-4 p-4 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-[#CEFD55]/50 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all cursor-pointer group"
          >
            <div className="flex-shrink-0 w-14 h-14 ai-icon-glow rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-1">Agregar con IA</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Audio, imagen o texto y la IA entiende.</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
