'use client'

import {
  Wallet,
  CreditCard,
  Banknote,
  Landmark,
  Smartphone,
  Bitcoin,
  DollarSign,
  Circle,
  type LucideIcon,
} from 'lucide-react'

// Mapa de iconos disponibles
const ICON_MAP: Record<string, LucideIcon> = {
  wallet: Wallet,
  'credit-card': CreditCard,
  creditcard: CreditCard,
  banknote: Banknote,
  efectivo: Banknote,
  cash: Banknote,
  landmark: Landmark,
  transferencia: Landmark,
  transfer: Landmark,
  smartphone: Smartphone,
  app: Smartphone,
  billetera: Smartphone,
  bitcoin: Bitcoin,
  cripto: Bitcoin,
  crypto: Bitcoin,
  dollar: DollarSign,
  circle: Circle,
}

interface PaymentIconProps {
  iconName?: string
  color?: string          // usado en Settings
  iconColor?: string      // usado en otros lados
  size?: 'sm' | 'md' | 'lg'
  showBackground?: boolean
  className?: string
}

export function PaymentIcon({
  iconName = 'wallet',
  color,
  iconColor,
  size = 'md',
  showBackground = true,
  className = '',
}: PaymentIconProps) {
  const IconComponent =
    ICON_MAP[iconName?.toLowerCase() || 'wallet'] || Wallet

  const sizes = {
    sm: { icon: 'h-4 w-4', container: 'h-8 w-8 p-1.5' },
    md: { icon: 'h-5 w-5', container: 'h-10 w-10 p-2' },
    lg: { icon: 'h-6 w-6', container: 'h-12 w-12 p-2.5' },
  }[size]

  // prioridad: color -> iconColor -> gris
  const finalColor =
    (typeof color === 'string' && color.trim()) ||
    (typeof iconColor === 'string' && iconColor.trim()) ||
    '#6B7280'

  if (showBackground) {
    return (
      <div
        className={`flex items-center justify-center rounded-full flex-shrink-0 ${sizes.container} ${className}`}
        style={{
          backgroundColor: `${finalColor}20`,
        }}
      >
        <IconComponent
          className={sizes.icon}
          stroke={finalColor}
          fill="none"
          strokeWidth={2}
        />
      </div>
    )
  }

  return (
    <IconComponent
      className={`${sizes.icon} ${className}`}
      stroke={finalColor}
      fill="none"
      strokeWidth={2}
    />
  )
}

export { ICON_MAP }
export default PaymentIcon
