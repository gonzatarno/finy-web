"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

interface OrderDetails {
  orderId: string
  email: string
  amount: number
  currency: string
}

export default function Page() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    const email = searchParams.get("email")
    const amount = searchParams.get("amount")
    const currency = searchParams.get("currency")

    if (orderId && email && amount && currency) {
      setOrderDetails({
        orderId,
        email,
        amount: Number.parseFloat(amount),
        currency,
      })
    }
  }, [searchParams])

  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      toast({
        description: t("emailCopied"),
        duration: 3000,
      })
    } catch (err) {
      console.error("Failed to copy email")
    }
  }

  return (
    <div className="container relative h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <CheckCircle2 className="h-9 w-9 text-green-500" />
          <h1 className="text-2xl font-semibold">{t("paymentSuccessTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("paymentSuccessSubtitle")}</p>
        </div>
        <Separator />
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{t("orderDetails")}</h2>
          {orderDetails ? (
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium">{t("orderId")}:</p>
                <p className="text-sm text-muted-foreground">{orderDetails.orderId}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium">{t("email")}:</p>
                <Button variant="link" onClick={() => copyEmailToClipboard(orderDetails.email)}>
                  {orderDetails.email}
                  <Mail className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium">{t("amount")}:</p>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.amount} {orderDetails.currency}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("noOrderDetails")}</p>
          )}
        </div>
        <Separator />
        <Badge variant="outline">{t("thankYou")}</Badge>
      </div>
      <Toaster />
    </div>
  )
}
