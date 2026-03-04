import React from 'react'
import { CreditCard, Banknote, ArrowRightLeft, Smartphone, Wallet, Bitcoin, DollarSign, Landmark } from 'lucide-react'

export const ICON_COMPONENT_MAP: Record<string, React.ComponentType<{ className: string; style?: React.CSSProperties }>> = {
  'wallet': Wallet,
  'credit-card': CreditCard,
  'banknote': Banknote,
  'arrow-right-left': ArrowRightLeft,
  'landmark': Landmark,
  'smartphone': Smartphone,
  'bitcoin': Bitcoin,
  'dollar-sign': DollarSign,
  'Wallet': Wallet,
  'CreditCard': CreditCard,
  'Banknote': Banknote,
  'ArrowLeftRight': ArrowRightLeft,
  'ArrowRightLeft': ArrowRightLeft,
  'Landmark': Landmark,
  'Smartphone': Smartphone,
  'Bitcoin': Bitcoin,
  'DollarSign': DollarSign,
}

interface PaymentMethodIconProps {
  iconName: string
  color: string
  size?: 'sm' | 'md' | 'lg'
}

export function PaymentMethodIcon({ iconName, color, size = 'sm' }: PaymentMethodIconProps) {
  const IconComponent = ICON_COMPONENT_MAP[iconName || 'wallet'] || Wallet
  
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size]

  return (
    <IconComponent 
      className={sizeClass} 
      style={{ color: color || '#6B7280' }} 
    />
  )
}

interface PaymentMethodBadgeProps {
  iconName: string
  color: string
  label: string
}

export function PaymentMethodBadge({ iconName, color, label }: PaymentMethodBadgeProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{
        backgroundColor: color ? `${color}15` : '#6B728015',
      }}
    >
      <PaymentMethodIcon iconName={iconName} color={color} size="md" />
      <span className="text-sm font-medium" style={{ color: color || '#6B7280' }}>
        {label}
      </span>
    </div>
  )
}
