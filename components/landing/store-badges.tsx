"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useT } from "@/hooks/use-t"
import { trackPixelEvent } from "@/components/meta-pixel"

const APP_STORE_URL = "https://apps.apple.com/us/app/finy-control-de-gastos-con-ia/id6760370721"
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.finy.app"

const COPY = {
  es: { iosTop: "Descargar en",  iosBot: "App Store", andTop: "Disponible en", andBot: "Google Play" },
  en: { iosTop: "Download on",   iosBot: "App Store", andTop: "Get it on",     andBot: "Google Play" },
}

interface StoreBadgesProps {
  variant?: "default" | "compact"
  className?: string
}

export function StoreBadges({ variant = "default", className }: StoreBadgesProps) {
  const t = useT(COPY)
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {/* Android first — 90% of traffic is Android */}
      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener"
        onClick={() => trackPixelEvent("Lead", { content_name: "Play Store" })}
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl bg-black text-white transition-transform active:scale-[0.98] hover:scale-[1.01]",
          variant === "default" ? "px-5 py-3.5" : "px-4 py-2.5",
        )}
      >
        <PlayStoreIcon className={variant === "default" ? "h-7 w-7" : "h-5 w-5"} />
        <div className="flex flex-col leading-tight text-left">
          <span className={cn("font-medium text-white/70", variant === "default" ? "text-[11px]" : "text-[10px]")}>
            {t.andTop}
          </span>
          <span className={cn("font-semibold tracking-tight", variant === "default" ? "text-lg" : "text-sm")}>
            {t.andBot}
          </span>
        </div>
      </Link>

      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        onClick={() => trackPixelEvent("Lead", { content_name: "App Store" })}
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl bg-black text-white transition-transform active:scale-[0.98] hover:scale-[1.01]",
          variant === "default" ? "px-5 py-3.5" : "px-4 py-2.5",
        )}
      >
        <AppleLogo className={variant === "default" ? "h-7 w-7" : "h-5 w-5"} />
        <div className="flex flex-col leading-tight text-left">
          <span className={cn("font-medium text-white/70", variant === "default" ? "text-[11px]" : "text-[10px]")}>
            {t.iosTop}
          </span>
          <span className={cn("font-semibold tracking-tight", variant === "default" ? "text-lg" : "text-sm")}>
            {t.iosBot}
          </span>
        </div>
      </Link>
    </div>
  )
}

function AppleLogo({ className }: { className?: string }) {
  // Logo oficial de Apple (la mordida) — para badges de App Store.
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className} aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
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
