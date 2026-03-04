"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { HelpFeedbackDialog } from "@/components/help-feedback-dialog"
import { HelpCircle, RefreshCw } from "lucide-react"
import { useState } from "react"

interface MobileHeaderProps {
  userName?: string
  userInitials?: string
  userImage?: string | null
  onProfileClick?: () => void
}

export function MobileHeader({ 
  userName = "Usuario", 
  userInitials = "US", 
  userImage,
  onProfileClick 
}: MobileHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    // Prevent multiple refresh attempts
    if (isRefreshing) return
    
    setIsRefreshing(true)
    
    // Haptic feedback if available on device
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    // Show animation spin for 300ms then force hard reload
    setTimeout(() => {
      // Force complete page reload, ignoring all caches (browser cache + service worker cache)
      window.location.reload()
    }, 300)
  }

  return (
    <header className="md:hidden sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-40 px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <Image
          src="/images/fini-negro-logo.png"
          alt="Finy Logo"
          width={80}
          height={24}
          className="h-6 w-auto dark:invert"
        />
      </div>

      <div className="flex items-center gap-1">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-11 w-11 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="Actualizar"
        >
          <RefreshCw className={`h-6 w-6 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        {/* Help & Feedback Button */}
        <HelpFeedbackDialog>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Ayuda y Feedback"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </HelpFeedbackDialog>

        {/* Profile Avatar */}
        <button
          onClick={onProfileClick}
          className="focus:outline-none focus:ring-2 focus:ring-[#CEFD55] rounded-full ml-1"
          aria-label="Ver perfil"
        >
          <Avatar className="h-10 w-10 border-2 border-gray-100 dark:border-zinc-700">
            <AvatarImage src={userImage || undefined} alt={userName} />
            <AvatarFallback className="bg-[#CEFD55] text-black font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
