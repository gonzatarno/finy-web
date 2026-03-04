'use client'

import { cn } from '@/lib/utils'

interface PlanBadgeProps {
  plan: 'pro' | 'plus' | 'gratis' | null | undefined
  size?: 'sm' | 'md'
}

export function PlanBadge({ plan, size = 'sm' }: PlanBadgeProps) {
  const normalizedPlan = plan || 'gratis'

  const baseStyles = 'inline-block font-semibold rounded-full whitespace-nowrap'
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  const planStyles = {
    pro: 'bg-yellow-100 text-yellow-800',
    plus: 'bg-purple-100 text-purple-800',
    gratis: 'bg-gray-100 text-gray-600',
  }

  const planText = {
    pro: 'PRO 👑',
    plus: 'PLUS ✨',
    gratis: 'GRATIS',
  }

  return (
    <span className={cn(baseStyles, sizeStyles[size], planStyles[normalizedPlan])}>
      {planText[normalizedPlan]}
    </span>
  )
}
