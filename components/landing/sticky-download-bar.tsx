"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { trackPixelEvent } from "@/components/meta-pixel"

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.finy.app"
const APP_STORE_URL  = "https://apps.apple.com/us/app/finy-control-de-gastos-con-ia/id6760370721"

// Aparece en mobile después de scrollear 300px, se oculta si el hero CTA está visible
export function StickyDownloadBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`
        fixed bottom-0 inset-x-0 z-50 md:hidden
        transition-transform duration-300 ease-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      {/* Safe area + backdrop */}
      <div className="bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">

        {/* Social proof line */}
        <p className="text-center text-[11px] text-zinc-500 mb-2.5 font-medium">
          220+ personas ya controlan sus finanzas con Finy · 14 días PRO gratis
        </p>

        <div className="flex gap-2.5">
          {/* Android — primary (90% of traffic) */}
          <Link
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener"
            onClick={() => trackPixelEvent("Lead", { content_name: "Sticky Play Store" })}
            className="flex-1 flex items-center justify-center gap-2 bg-[#CEFD55] text-zinc-950 rounded-xl py-3 font-bold text-[14px] active:scale-[0.97] transition-transform"
          >
            <PlayIcon className="h-5 w-5 shrink-0" />
            Google Play
          </Link>

          {/* iOS — secondary */}
          <Link
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener"
            onClick={() => trackPixelEvent("Lead", { content_name: "Sticky App Store" })}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 text-white rounded-xl py-3 font-semibold text-[14px] active:scale-[0.97] transition-transform"
          >
            <AppleIcon className="h-5 w-5 shrink-0" />
            App Store
          </Link>
        </div>
      </div>
    </div>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92Z" fill="#000" />
      <path d="M16.81 8.99 6.05 2.785l9.795 9.794-1.034-1.033 1.999-2.557Z" fill="#000" opacity=".6" />
      <path d="m20.16 10.873-3.35-1.884-2.001 2.001L16.81 13l3.35-1.884a1.241 1.241 0 0 0 0-2.243Z" fill="#000" opacity=".4" />
      <path d="m6.05 21.215 10.76-6.205-1.999-2.557-9.795 9.795 1.034-1.033Z" fill="#000" opacity=".5" />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className} aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}
