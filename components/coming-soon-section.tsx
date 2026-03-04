"use client"

import React from "react"

import { Users, PieChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface ComingSoonCardProps {
  icon: React.ElementType
  title: string
  description: string
  badge?: string
}

function ComingSoonCard({ icon: Icon, title, description, badge = "Próximamente" }: ComingSoonCardProps) {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "¡Muy pronto! 🚀",
      description: `${title} estará disponible próximamente.`,
    })
  }

  return (
    <Card 
      className="relative overflow-hidden border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#CEFD55]/10 dark:bg-[#CEFD55]/20 group-hover:bg-[#CEFD55]/20 dark:group-hover:bg-[#CEFD55]/30 transition-colors">
            <Icon className="w-6 h-6 text-black dark:text-[#CEFD55]" strokeWidth={2} />
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-medium px-2 py-1 rounded-full"
          >
            {badge}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export function ComingSoonSection() {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Próximas Funciones</h2>
        <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Nuevas herramientas que llegarán pronto a Finy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComingSoonCard
          icon={PieChart}
          title="Presupuestos"
          description="Establece límites de gastos por categoría y monitorea tu presupuesto."
        />
        <ComingSoonCard
          icon={Users}
          title="Finy Duo"
          description="Comparte gastos y finanzas con tu pareja o amigos."
        />
      </div>
    </div>
  )
}
