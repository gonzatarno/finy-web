"use client"

import { useDeviceDetection } from "@/hooks/use-device-detection"

const APP_STORE_URL = "https://apps.apple.com/ar/app/finy-control-de-gastos-con-ia/id6760370721"
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.finy.app&hl=es_AR"

// Compact button for pricing cards
function CompactStoreButton({ 
  platform, 
  href, 
  label 
}: { 
  platform: "ios" | "android"
  href: string
  label: string 
}) {
  const AppleIcon = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )

  const PlayIcon = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.83-2.84-10.76 9.91zM.5 1.4C.18 1.74 0 2.28 0 2.98v18.04c0 .7.18 1.24.51 1.58l.08.08 10.1-10.1v-.24L.58 1.32.5 1.4zm17.09 11.02l-2.75-2.75-1.45 1.45 2.75 2.75 1.52-.88c.43-.25.43-.66-.07-1.57zM4.17.24L16.77 7.5l-2.83 2.84L3.18.47c.35-.34.8-.4 1-.23z" />
    </svg>
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-full text-sm font-medium"
    >
      {platform === "ios" ? AppleIcon : PlayIcon}
      <span>{label}</span>
    </a>
  )
}

interface DownloadCTAProps {
  iosLabel: string
  androidLabel: string
  iosSubtext: string
  androidSubtext: string
  webMessage: string
}

export function DownloadCTA({
  iosLabel,
  androidLabel,
  webMessage,
}: DownloadCTAProps) {
  const device = useDeviceDetection()

  // iOS users see only App Store button
  if (device === "ios") {
    return (
      <CompactStoreButton
        platform="ios"
        href={APP_STORE_URL}
        label={iosLabel}
      />
    )
  }

  // Android users see only Google Play button
  if (device === "android") {
    return (
      <CompactStoreButton
        platform="android"
        href={GOOGLE_PLAY_URL}
        label={androidLabel}
      />
    )
  }

  // Web/Desktop users see message + both buttons stacked
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-xs text-gray-500 text-center">{webMessage}</p>
      <div className="flex flex-col gap-2 w-full">
        <CompactStoreButton
          platform="ios"
          href={APP_STORE_URL}
          label="App Store"
        />
        <CompactStoreButton
          platform="android"
          href={GOOGLE_PLAY_URL}
          label="Google Play"
        />
      </div>
    </div>
  )
}
