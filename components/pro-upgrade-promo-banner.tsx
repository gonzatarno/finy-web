'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export function ProUpgradePromoBanner() {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-r from-[#CEFD55]/20 to-[#CEFD55]/10 border border-[#CEFD55]/30 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground mb-1">Pasa a Pro</h3>
          <p className="text-xs text-muted-foreground">
            Sin publicidades + agregar gastos ilimitados + más funciones
          </p>
        </div>
        <button
          onClick={() => router.push('/settings?tab=plans')}
          className="flex-shrink-0 px-3 py-1.5 bg-[#CEFD55] text-black rounded-md hover:bg-[#CEFD55]/90 transition-colors text-xs font-medium flex items-center gap-1 whitespace-nowrap"
        >
          Upgrade <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
