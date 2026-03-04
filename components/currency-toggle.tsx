"use client"

import { useCurrency } from "@/lib/currency-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("ARS")}
        className={cn(
          "h-8 rounded-full px-4 text-xs font-medium transition-all duration-200",
          currency === "ARS" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900",
        )}
      >
        $ ARS
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("USD")}
        className={cn(
          "h-8 rounded-full px-4 text-xs font-medium transition-all duration-200",
          currency === "USD" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900",
        )}
      >
        u$s USD
      </Button>
    </div>
  )
}
