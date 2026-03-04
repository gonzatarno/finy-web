"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, ArrowRightLeft, Plus, BarChart3, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { AddActionDrawer } from "@/components/add-action-drawer"
import { AddTransactionDrawer } from "@/components/add-transaction-drawer"

interface MobileBottomNavProps {
  onAddClick?: () => void
  currentPage?: string
  onNavigate?: (page: string) => void
  onOpenAIChat?: () => void
}

export function MobileBottomNav({ onAddClick, currentPage = "Inicio", onNavigate, onOpenAIChat }: MobileBottomNavProps) {
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState(currentPage)

  // Sincronizar activeNavItem cuando currentPage cambia desde el padre
  useEffect(() => {
    setActiveNavItem(currentPage)
  }, [currentPage])

  // Manejar click en drawer
  const handleAddClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawerOpen(true)
  }, [])

  // Manejar navegación a sección
  const handleNavItemClick = useCallback((pageName: string, navigatePage?: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const page = navigatePage || pageName
    setActiveNavItem(page)
    onNavigate?.(page)
  }, [onNavigate])

  const navItems = [
    {
      name: "Inicio",
      icon: Home,
      page: "Inicio",
    },
    {
      name: "Movimientos",
      icon: ArrowRightLeft,
      page: "Movimientos",
    },
    {
      name: "add",
      icon: Plus,
      isAdd: true,
    },
    {
      name: "Estadísticas",
      icon: BarChart3,
      page: "Estadísticas",
    },
    {
      name: "Más",
      icon: LayoutGrid,
      page: "Más",
    },
  ]

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 pb-[calc(env(safe-area-inset-bottom)+20px)] z-[9999] pointer-events-auto touch-none">
        <div className="flex items-center justify-around px-2 pt-2 pb-4 relative">
          {navItems.map((item) => {
            if (item.isAdd) {
              return (
                <button
                  key="add"
                  onMouseDown={handleAddClick}
                  onTouchStart={handleAddClick}
                  className="flex flex-col items-center justify-center -mt-8 relative z-[10000] active:scale-95 transition-transform duration-200 ease-out focus:outline-none"
                  aria-label="Agregar transacción"
                  type="button"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#CEFD55] shadow-lg hover:shadow-xl hover:bg-[#b8e644] active:scale-90 transition-all duration-200">
                    <Plus className="w-7 h-7 text-black" strokeWidth={2.5} />
                  </div>
                </button>
              )
            }

            const Icon = item.icon
            const isActive = activeNavItem === item.page

            return (
              <button
                key={item.name}
                onMouseDown={handleNavItemClick(item.name, item.page)}
                onTouchStart={handleNavItemClick(item.name, item.page)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all duration-300 ease-out min-w-[60px] relative overflow-hidden focus:outline-none touch-manipulation",
                  isActive 
                    ? "text-black dark:text-white" 
                    : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
                )}
                type="button"
              >
                <Icon className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive ? "stroke-[2.5] scale-110" : "stroke-[2]"
                )} />
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  isActive && "font-semibold"
                )}>{item.name}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Add Action Drawer */}
      <AddActionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onOpenManualLoad={() => setIsTransactionModalOpen(true)}
        onOpenAIChat={onOpenAIChat}
      />

      {/* Add Transaction Drawer */}
      <AddTransactionDrawer
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={() => {
          // Drawer closed, optionally refresh data
          // The router.refresh() in the drawer will handle data refresh
        }}
      />
    </>
  )
}
