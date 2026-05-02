"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Copy } from "lucide-react"

export default function PagoPendientePage() {
  const { toast } = useToast()

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
    toast({
      title: "Email copied!",
      description: "The email address has been copied to your clipboard.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-[500px] mx-auto">
        <CardHeader>
          <CardTitle>Pago Pendiente</CardTitle>
          <CardDescription>Realiza el pago a través de los siguientes métodos:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Transferencia Bancaria</Label>
              <p>
                Banco: [Nombre del Banco]
                <br />
                Número de Cuenta: [Número de Cuenta]
                <br />
                Titular: [Nombre del Titular]
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">PayPal</Label>
              <div className="flex items-center justify-between">
                <p>Email: contacto@ejemplo.com</p>
                <Button variant="outline" size="sm" onClick={() => copyEmailToClipboard("contacto@ejemplo.com")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Mercado Pago</Label>
              <div className="flex items-center justify-between">
                <p>Email: pagos@ejemplo.com</p>
                <Button variant="outline" size="sm" onClick={() => copyEmailToClipboard("pagos@ejemplo.com")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p>
            Una vez realizado el pago, por favor envía el comprobante a{" "}
            <Button variant="link" onClick={() => copyEmailToClipboard("comprobantes@ejemplo.com")}>
              comprobantes@ejemplo.com
            </Button>
          </p>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
