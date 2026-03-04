"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-mobile"

interface FloatingChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function FloatingChatButton({ onClick, isOpen }: FloatingChatButtonProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Hide button when chat is open or on mobile devices
  if (isOpen || isMobile) return null

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-[#CEFD55] hover:bg-[#B8E64A] shadow-2xl hover:shadow-[#CEFD55]/50 transition-all duration-300 hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-300 group p-0 overflow-hidden"
      aria-label="Abrir chat de IA"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Finy Logo */}
        <Image
          src="/images/512.png"
          alt="Finy AI"
          width={48}
          height={48}
          className="rounded-full group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Pulse Animation Ring */}
        <div className="absolute inset-0 rounded-full bg-[#CEFD55] animate-ping opacity-20" />
      </div>
    </Button>
  )
}
