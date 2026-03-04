"use client"

import { Eye, EyeOff, Plus, MessageSquareMore, Target, Settings, TrendingUp, TrendingDown } from "lucide-react"
import { formatLocal, formatUSD } from "@/lib/utils"

interface MobileWalletHeaderProps {
  data?: {
    local: { balance: number; ingresos: number; egresos: number; ahorros: number }
    usd: { balance: number; ingresos: number; egresos: number; ahorros: number }
  }
  loading?: boolean
  hidden?: boolean
  onToggleHidden?: () => void
  onAddClick?: () => void
  onAIClick?: () => void
  onMetasClick?: () => void
  onCuentaClick?: () => void
}

export function MobileWalletHeader({
  data,
  loading,
  hidden = false,
  onToggleHidden,
  onAddClick,
  onAIClick,
  onMetasClick,
  onCuentaClick,
}: MobileWalletHeaderProps) {

  const balance = data?.local?.balance ?? 0
  const balanceUSD = data?.usd?.balance ?? 0

  const quickActions = [
    { icon: Plus, label: "Agregar", onClick: onAddClick },
    { icon: MessageSquareMore, label: "IA Finy", onClick: onAIClick },
    { icon: Target, label: "Metas", onClick: onMetasClick },
    { icon: Settings, label: "Cuenta", onClick: onCuentaClick },
  ]

  return (
    <div className="md:hidden w-full space-y-3 mb-2">

      {/* Balance Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl px-5 pt-5 pb-4 shadow-sm">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Balance total
          </span>
          <button
            onClick={onToggleHidden}
            aria-label={hidden ? "Mostrar balance" : "Ocultar balance"}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 active:scale-95 transition-transform"
          >
            {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Balance amount */}
        {loading ? (
          <div className="h-10 w-44 rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse mb-2" />
        ) : (
          <div>
            <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              {hidden ? "$ ••••••" : formatLocal(balance)}
            </span>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1 font-medium">
              {hidden ? "USD ••••••" : formatUSD(balanceUSD)}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl px-2 py-3 shadow-sm">
        <div className="grid grid-cols-4 gap-1">
          {quickActions.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex flex-col items-center gap-2 py-2 px-1 rounded-2xl active:scale-95 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all duration-100 cursor-pointer"
            >
              <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <Icon className="h-5 w-5 text-gray-700 dark:text-zinc-300" strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 text-center leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
