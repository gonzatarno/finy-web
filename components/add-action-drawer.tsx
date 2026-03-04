"use client"

import { Badge } from "@/components/ui/badge"

import { X, PenLine, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddActionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenManualLoad: () => void
  onOpenAIChat?: () => void
}

export function AddActionDrawer({ isOpen, onClose, onOpenManualLoad, onOpenAIChat }: AddActionDrawerProps) {
  const handleManualEntry = () => {
    onClose()
    // Small delay to allow drawer close animation to complete
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
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300 z-[49998] md:hidden backdrop-blur-sm",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl transition-all duration-300 ease-out z-[49999] md:hidden",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-black dark:text-white">Agregar movimiento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 active:scale-95"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors" />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 py-6 space-y-3 pb-8">
          {/* Option 1: Manual Entry */}
          <button
            onClick={handleManualEntry}
            className="w-full flex items-start gap-4 p-4 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-[#CEFD55]/50 hover:bg-gray-50 dark:hover:bg-zinc-900 active:scale-95 transition-all duration-200 group"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-[#CEFD55] rounded-2xl flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
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
            className="w-full flex items-start gap-4 p-4 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-[#CEFD55]/50 hover:bg-gray-50 dark:hover:bg-zinc-900 active:scale-95 transition-all duration-200 group"
          >
            <div className="flex-shrink-0 w-14 h-14 ai-icon-glow rounded-2xl flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
              <Sparkles className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-1">Agregar con IA</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Audio, imagen o texto y la IA entiende.</p>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
