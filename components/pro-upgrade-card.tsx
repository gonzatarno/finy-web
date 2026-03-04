'use client'

import { useRouter } from 'next/navigation'
import { Crown } from 'lucide-react'

export function ProUpgradeCard() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/settings?tab=plans')}
      className="bg-gradient-to-br from-[#CEFD55]/30 to-[#CEFD55]/10 border-2 border-[#CEFD55]/40 rounded-xl p-4 cursor-pointer hover:border-[#CEFD55]/60 transition-colors my-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Crown size={18} className="text-[#CEFD55]" />
        <h3 className="font-bold text-sm text-foreground">Acceso Pro</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Elimina publicidades, agrega gastos ilimitados y desbloquea todas las funciones premium.
      </p>
      <div className="flex items-center gap-1 text-[#CEFD55] text-xs font-semibold hover:gap-2 transition-all">
        Ver planes <span>→</span>
      </div>
    </div>
  )
}
