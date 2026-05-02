"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Apple } from "lucide-react"

const APP_STORE_URL = "https://apps.apple.com/us/app/finy-control-de-gastos-con-ia/id6760370721"
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.finy.app"

interface StoreBadgesProps {
  variant?: "default" | "compact"
  className?: string
}

export function StoreBadges({ variant = "default", className }: StoreBadgesProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl bg-black text-white transition-transform active:scale-[0.98] hover:scale-[1.01]",
          variant === "default" ? "px-5 py-3.5" : "px-4 py-2.5",
        )}
      >
        <Apple className={variant === "default" ? "h-7 w-7 fill-white" : "h-5 w-5 fill-white"} strokeWidth={1.5} />
        <div className="flex flex-col leading-tight text-left">
          <span className={cn("font-medium text-white/70", variant === "default" ? "text-[11px]" : "text-[10px]")}>
            Descargar en
          </span>
          <span className={cn("font-semibold tracking-tight", variant === "default" ? "text-lg" : "text-sm")}>
            App Store
          </span>
        </div>
      </Link>

      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener"
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl bg-black text-white transition-transform active:scale-[0.98] hover:scale-[1.01]",
          variant === "default" ? "px-5 py-3.5" : "px-4 py-2.5",
        )}
      >
        <PlayStoreIcon className={variant === "default" ? "h-7 w-7" : "h-5 w-5"} />
        <div className="flex flex-col leading-tight text-left">
          <span className={cn("font-medium text-white/70", variant === "default" ? "text-[11px]" : "text-[10px]")}>
            Disponible en
          </span>
          <span className={cn("font-semibold tracking-tight", variant === "default" ? "text-lg" : "text-sm")}>
            Google Play
          </span>
        </div>
      </Link>
    </div>
  )
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92Z" fill="#00D8FF" />
      <path d="M16.81 8.99 6.05 2.785l9.795 9.794-1.034-1.033 1.999-2.557Z" fill="#00F076" />
      <path d="m20.16 10.873-3.35-1.884-2.001 2.001L16.81 13l3.35-1.884a1.241 1.241 0 0 0 0-2.243Z" fill="#FFC400" />
      <path d="m6.05 21.215 10.76-6.205-1.999-2.557-9.795 9.795 1.034-1.033Z" fill="#FF3A44" />
    </svg>
  )
}
