'use client'

interface BetaButtonProps {
  platform: 'ios' | 'android'
  href: string
  secondaryText: string
  primaryText: string
}

export function BetaButton({ platform, href, secondaryText, primaryText }: BetaButtonProps) {
  const AppleIcon = (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )

  const PlayIcon = (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
      <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.83-2.84-10.76 9.91zM.5 1.4C.18 1.74 0 2.28 0 2.98v18.04c0 .7.18 1.24.51 1.58l.08.08 10.1-10.1v-.24L.58 1.32.5 1.4zm17.09 11.02l-2.75-2.75-1.45 1.45 2.75 2.75 1.52-.88c.43-.25.43-.66-.07-1.57zM4.17.24L16.77 7.5l-2.83 2.84L3.18.47c.35-.34.8-.4 1-.23z" />
    </svg>
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 bg-black text-white px-4 py-2.5 rounded-full hover:bg-gray-900 hover:scale-105 transition-all duration-200 ease-out w-full sm:w-80 justify-center"
      aria-label={primaryText}
    >
      <div className="text-white flex-shrink-0">
        {platform === 'ios' ? AppleIcon : PlayIcon}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-xs text-gray-300 font-medium">{secondaryText}</span>
        <span className="text-sm font-bold text-white">{primaryText}</span>
      </div>
    </a>
  )
}
