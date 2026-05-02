"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PagoFailedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const copyEmailToClipboard = async (email: string) => {
    setIsLoading(true)
    try {
      await navigator.clipboard.writeText(email)
      toast({
        title: "Email copied!",
        description: "The email address has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy email address.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container grid w-full gap-6 p-4 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle>Payment Failed</CardTitle>
          <CardDescription>
            There was an issue processing your payment. Please review the details below and try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Contact Support</Label>
            <p>If you continue to experience issues, please contact our support team at:</p>
            <Button
              variant="secondary"
              onClick={() => copyEmailToClipboard("support@example.com")}
              disabled={isLoading}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              support@example.com
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p>We apologize for any inconvenience.</p>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
