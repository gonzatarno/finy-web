"use client"

import { useEffect } from "react"

export function GoogleAdBanner() {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      adsbygoogle.push({})
    } catch (err) {
      console.error("Error al cargar el anuncio de AdSense:", err)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 text-center my-6 p-4 border border-gray-200 dark:border-zinc-700 shadow-sm">
      <p className="text-xs text-gray-500 dark:text-zinc-400 mb-3 uppercase tracking-wide font-semibold">Publicidad</p>
      <div className="bg-white dark:bg-zinc-950 rounded-lg p-2 min-h-[300px] flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ 
            display: "block",
            width: "100%",
            minHeight: "280px"
          }}
          data-ad-client="ca-pub-6158463137990162"
          data-ad-slot="4550297981"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
