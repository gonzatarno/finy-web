import { formatLocal, formatUSD } from "@/lib/utils"

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload
  const displayLabel = label || data.name || data.label || (data.day ? `Día ${data.day}` : '')

  // Determine which amount fields to show
  let hasLocal = false
  let hasUsd = false
  let localAmount = 0
  let usdAmount = 0

  if (data.local !== undefined && data.local > 0) {
    hasLocal = true
    localAmount = data.local
  } else if (data.ars !== undefined && data.ars > 0) {
    hasLocal = true
    localAmount = data.ars
  }

  if (data.usd !== undefined && data.usd > 0) {
    hasUsd = true
    usdAmount = data.usd
  }

  // Fallback for simple value field
  if (!hasLocal && !hasUsd && data.value !== undefined && data.value > 0) {
    hasLocal = true
    localAmount = data.value
  }

  if (!hasLocal && !hasUsd && data.amount !== undefined && data.amount > 0) {
    hasLocal = true
    localAmount = data.amount
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      {displayLabel && (
        <p className="mb-2 text-sm font-semibold text-gray-900">
          {displayLabel}
        </p>
      )}
      <div className="space-y-1.5">
        {hasLocal && (
          <p className="text-sm text-gray-700">
            {formatLocal(localAmount)}
          </p>
        )}
        {hasUsd && (
          <p className="text-sm text-gray-700">
            + u$s{" "}
            {usdAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  )
}
