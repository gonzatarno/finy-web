"use client"

import React from "react"
import Image from "next/image"
import { LogOut, ChevronUp, CreditCard, HelpCircle, Target, FileText } from "lucide-react"
import {
  LayoutDashboard,
  ArrowUpDown,
  Wallet,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { HelpFeedbackDialog } from "@/components/help-feedback-dialog"

const navigation = [
  { name: "Inicio", icon: LayoutDashboard },
  { name: "Movimientos", icon: ArrowUpDown },
  { name: "Cuentas", icon: Wallet },
  { name: "Mis configuraciones", icon: Settings },
]

interface MobileSidebarProps {
  currentPage: string
  setSidebarOpen: (open: boolean) => void
  handleLogout: () => void
  userName: string
  userEmail: string
  userInitials: string
  userImage?: string | null
  onSettingsClick: () => void
  onPageChange: (page: string) => void
}

export function MobileSidebar({
  currentPage,
  setSidebarOpen,
  handleLogout,
  userName,
  userEmail,
  userInitials,
  userImage,
  onSettingsClick,
  onPageChange,
}: MobileSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 dark:border-zinc-800 px-6">
        <Image
          src="/images/fini-negro-logo.png"
          alt="Finy"
          width={80}
          height={32}
          className="h-8 w-auto dark:invert"
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => onPageChange(item.name)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              currentPage === item.name
                ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.name}
          </button>
        ))}

        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 dark:text-zinc-500 cursor-not-allowed">
          <Target className="h-5 w-5" />
          Metas
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-full font-normal"
          >
            Próximamente
          </Badge>
        </div>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 dark:text-zinc-500 cursor-not-allowed">
          <FileText className="h-5 w-5" />
          Reportes
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-full font-normal"
          >
            Próximamente
          </Badge>
        </div>
      </nav>

      <div className="border-t border-gray-100 dark:border-zinc-800 p-3">
        <a
          href="https://www.finyapp.io/#precios"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white mb-1 cursor-pointer"
        >
          <CreditCard className="h-5 w-5" />
          Ver Planes
        </a>

        <HelpFeedbackDialog>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 mb-1 cursor-pointer">
            <HelpCircle className="h-5 w-5" />
            Ayuda y Feedback
          </button>
        </HelpFeedbackDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userImage || "/placeholder.svg?height=36&width=36"} />
                <AvatarFallback className="bg-[#CEFD55] text-black text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0 max-w-[180px]">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{userEmail}</p>
              </div>
              <ChevronUp className="h-4 w-4 text-gray-400 dark:text-zinc-500 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Configuraciones
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
