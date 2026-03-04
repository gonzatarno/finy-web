"use client"

import { useCallback } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-mobile"
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  HelpCircle,
  Settings,
  Menu,
  LogOut,
  ChevronUp,
  CreditCard,
  Target,
  FileText,
  Plus,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { KpiCards } from "@/components/kpi-cards"
import { SpendingChart } from "@/components/spending-chart"
import { CategoryChart } from "@/components/category-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { TransactionsManagement } from "@/components/transactions-management"
import { AnalyticsPage } from "@/components/analytics-page"
import { SettingsPageComponent } from "@/components/settings-page"
import { AccountSettingsComponent } from "@/components/account-settings"
import { OnboardingRequired } from "@/components/onboarding-required"
import { EmptyStateNoExpenses } from "@/components/empty-state-no-expenses"
import { PlanBadge } from "@/components/plan-badge"
import { GoogleAdBanner } from "@/components/google-ad-banner"
import { MobileHeader } from "@/components/mobile-header"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ComingSoonSection } from "@/components/coming-soon-section"
import { DesktopAddActionModal } from "@/components/desktop-add-action-modal"
import { AddActionDrawer } from "@/components/add-action-drawer"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { AddTransactionDrawer } from "@/components/add-transaction-drawer"
import { DynamicAnnouncementModal } from "@/components/dynamic-announcement-modal"
import { AIChatView } from "@/components/ai-chat-view"
import { FloatingChatButton } from "@/components/floating-chat-button"
import { useUser } from "@/contexts/user-context"
import { cn } from "@/lib/utils"
import type { DashboardData } from "@/lib/types"
import { HelpFeedbackDialog } from "@/components/help-feedback-dialog"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { SavingsGoalsDashboard } from "@/components/savings-goals-dashboard"
import { MobileMorePage } from "@/components/mobile-more-page"
import { MobileWalletHeader } from "@/components/mobile-wallet-header"

const navigation = [
  { name: "Inicio", icon: LayoutDashboard, href: "#", current: true },
  { name: "Estadísticas", icon: BarChart3, href: "#", current: false },
  { name: "Movimientos", icon: Receipt, href: "#", current: false },
  { name: "Metas", icon: Target, href: "#", current: false },
  { name: "Categorías y Tarjetas", icon: Settings, href: "#", current: false },
]

export function DashboardLayout() {
  const { data: session } = useSession()
  const { userName: contextUserName, userPlan } = useUser()
  const router = useRouter() // Declare router variable
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("Inicio")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showDesktopActionModal, setShowDesktopActionModal] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [hideAmounts, setHideAmounts] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const isMobile = useMediaQuery("(max-width: 768px)") // Declare isMobile variable

  const userEmail = session?.user?.email
  const isMetasEnabled = true
  
  // Use context name if available, otherwise fall back to email parsing
  const userName = contextUserName || (userEmail
      ?.split("@")[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Usuario")
  const userInitials = userName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const fetchData = async () => {
    if (!userEmail) return

    try {
      setLoading(true)
      const apiUrl = `/api/data?email=${encodeURIComponent(userEmail)}`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        // Only trigger onboarding if we get a 404 or explicit error, not just empty data
        console.log('[v0] API response not OK:', response.status)
        // Check if user exists in database first
        setNeedsOnboarding(false) // Let the empty state handle no data
        setLoading(false)
        return
      }

      const result: DashboardData = await response.json()
      
      // Just set the data, don't trigger onboarding based on empty data
      // The empty state component will handle showing the message
      setData(result)
      setNeedsOnboarding(false)
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching dashboard data:", err)
      // Only show onboarding if there's a network error or user truly doesn't exist
      setNeedsOnboarding(false)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userEmail])

  // Load chat state from localStorage on mount
  useEffect(() => {
    const savedChatState = localStorage.getItem("ai_chat_open")
    if (savedChatState === "true") {
      setShowAIChat(true)
    }
  }, [])

  // Save chat state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("ai_chat_open", String(showAIChat))
  }, [showAIChat])

  // Handle page changes and browser history
  const handlePageChange = useCallback((page: string) => {
    console.log("[v0] Changing page to:", page)
    setCurrentPage(page)
    // Update browser history when navigating between pages
    window.history.pushState({ page }, "", `?page=${encodeURIComponent(page)}`)
  }, [])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || "Inicio"
      setCurrentPage(page)
    }
    
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Initialize from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageFromUrl = params.get("page")
    if (pageFromUrl) {
      setCurrentPage(decodeURIComponent(pageFromUrl))
    } else {
      // Set initial history state
      window.history.replaceState({ page: "Inicio" }, "", "?page=Inicio")
    }
  }, [])

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction)
    if (isMobile) {
      // En mobile, abre el drawer de transacciones con los datos para editar
      setShowAddTransaction(true)
    } else {
      // En desktop, abre el modal de edición
      setShowDesktopActionModal(true)
    }
  }

  const handleDeleteTransaction = (transaction: any) => {
    setTransactionToDelete(transaction)
    setShowDeleteModal(true)
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (needsOnboarding) {
    return <OnboardingRequired />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#cefd55] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 w-full overflow-x-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800">
          <MobileSidebar
            currentPage={currentPage}
            setSidebarOpen={setSidebarOpen}
            handleLogout={handleLogout}
            userName={userName}
            userEmail={userEmail}
            userInitials={userInitials}
            userImage={session?.user?.image}
            onSettingsClick={() => {
              handlePageChange("Mis configuraciones")
              setSidebarOpen(false)
            }}
            onPageChange={(page) => {
              handlePageChange(page)
              setSidebarOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800">
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 dark:border-zinc-800 px-6">
          <Image src="/images/fini-negro-logo.png" alt="Finy" width={80} height={32} className="h-8 w-auto dark:invert" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.filter(item => item.name !== "Metas" || isMetasEnabled).map((item) => (
            <button
              key={item.name}
              onClick={() => handlePageChange(item.name)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                currentPage === item.name
                  ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </button>
          ))}

          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 dark:text-zinc-500 cursor-not-allowed">
            <FileText className="h-5 w-5" />
            Reportes
            <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-full font-normal">
              Próximamente
            </Badge>
          </div>
        </nav>

        <div className="border-t border-gray-100 dark:border-zinc-800 p-3">
          <a
            href="https://www.finyapp.io/#precios"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 mb-1 cursor-pointer"
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
                  <AvatarImage src={session?.user?.image || "/placeholder.svg?height=36&width=36"} />
                  <AvatarFallback className="bg-[#CEFD55] text-black text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0 max-w-[180px]">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{contextUserName || userName}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{userEmail}</p>
                </div>
                <ChevronUp className="h-4 w-4 text-gray-400 dark:text-zinc-500 flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg card-shadow">
            <DropdownMenuItem 
              onClick={() => handlePageChange("Account Settings")}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-900 dark:text-white"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:pl-64 w-full max-w-full overflow-x-hidden">
        {/* Mobile Header */}
        <MobileHeader
          userName={userName}
          userInitials={userInitials}
          userImage={session?.user?.image}
          onProfileClick={() => handlePageChange("Account Settings")}
        />

        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize truncate">Buenos días, {userName}</h1>
              <PlanBadge plan={userPlan} size="sm" />
            </div>
          </div>
          <Button
            onClick={() => setShowDesktopActionModal(true)}
            className="cursor-pointer font-semibold hidden md:flex text-black"
            style={{ backgroundColor: "#CEFD55" }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Movimiento
          </Button>
        </header>

        <main className="flex-1 w-full max-w-full px-4 py-6 md:p-8 pb-20 md:pb-8 overflow-y-auto">
          {error && (
            <div className="mx-auto mb-6 max-w-7xl rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-300 card-shadow">
              <p className="font-medium">Error al cargar los datos</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {currentPage === "Inicio" && (
            <div className="mx-auto max-w-7xl w-full max-w-full">
              {/* Mobile wallet header - only on mobile */}
              <MobileWalletHeader
                data={data?.kpi}
                loading={loading}
                hidden={hideAmounts}
                onToggleHidden={() => setHideAmounts((h) => !h)}
                onAddClick={() => setShowDesktopActionModal(true)}
                onAIClick={() => setShowAIChat(true)}
                onMetasClick={() => handlePageChange("Metas")}
                onCuentaClick={() => handlePageChange("Account Settings")}
              />
              
              {/* Rest of content with increased spacing */}
              <div className="space-y-8 md:space-y-6 pt-6 md:pt-0">
                {/* Show empty state if no expenses and not loading */}
                {!loading && (!data?.recentTransactions || data.recentTransactions.length === 0) ? (
                  <EmptyStateNoExpenses />
                ) : (
                  <>
                    <KpiCards data={data?.kpi} loading={loading} hideAmounts={hideAmounts} />
                    <div className="pt-4 md:pt-0">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <SpendingChart data={data?.dailySpending} loading={loading} hideAmounts={hideAmounts} />
                        <CategoryChart data={data?.chartData} loading={loading} />
                      </div>
                    </div>
                    <ComingSoonSection />
                    {/* AdSense banner only for free plan users */}
                    {(userPlan === "free" || userPlan === "gratis" || !userPlan) && (
                      <GoogleAdBanner />
                    )}
                    <RecentTransactions
                      data={data?.recentTransactions}
                      loading={loading}
                      onViewAll={() => handlePageChange("Movimientos")}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                      hideAmounts={hideAmounts}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {currentPage === "Movimientos" && (
            <TransactionsManagement 
              data={data?.allTransactions} 
              loading={loading}
              externalModalOpen={showAddTransaction}
              onExternalModalClose={() => setShowAddTransaction(false)}
            />
          )}

          {currentPage === "Estadísticas" && (
            <div className="mx-auto max-w-7xl w-full max-w-full">
              <AnalyticsPage
                dailySpending={data?.dailySpending}
                chartData={data?.chartData}
                analytics={data?.analytics}
                topExpenses={data?.topExpenses}
                loading={loading}
              />
            </div>
          )}

          {currentPage === "Metas" && (
            <SavingsGoalsDashboard />
          )}

          {currentPage === "Más" && (
            <div className="md:hidden">
              <MobileMorePage
                currentPage={currentPage}
                onNavigate={handlePageChange}
                onAddClick={() => setShowDesktopActionModal(true)}
                onOpenAIChat={() => setShowAIChat(true)}
                onLogout={handleLogout}
                isMetasEnabled={isMetasEnabled}
              />
            </div>
          )}

          {currentPage === "Categorías y Tarjetas" && (
            <SettingsPageComponent />
          )}

          {currentPage === "Account Settings" && (
            <AccountSettingsComponent />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {/* Desktop Action Modal - Only render on desktop */}
      {!isMobile && (
        <DesktopAddActionModal
          isOpen={showDesktopActionModal}
          onClose={() => setShowDesktopActionModal(false)}
          onOpenManualLoad={() => {
            setShowDesktopActionModal(false)
            setShowAddTransaction(true)
          }}
          onOpenAIChat={() => {
            setShowDesktopActionModal(false)
            setShowAIChat(true)
          }}
        />
      )}

      {/* Mobile Action Drawer - Only render on mobile */}
      {isMobile && (
        <AddActionDrawer
          isOpen={showDesktopActionModal}
          onClose={() => setShowDesktopActionModal(false)}
          onOpenManualLoad={() => {
            setShowDesktopActionModal(false)
            setShowAddTransaction(true)
          }}
          onOpenAIChat={() => {
            setShowDesktopActionModal(false)
            setShowAIChat(true)
          }}
        />
      )}

      {/* Desktop Modal - Only render on desktop */}
      {!isMobile && (
        <AddTransactionModal
          isOpen={showAddTransaction}
          onClose={() => setShowAddTransaction(false)}
          onSuccess={() => {
            setShowAddTransaction(false)
            fetchData() // Refresh data after successful transaction
          }}
        />
      )}

      {/* Mobile Drawer - Only render on mobile */}
      {isMobile && (
        <AddTransactionDrawer
          isOpen={showAddTransaction}
          onClose={() => {
            setShowAddTransaction(false)
            setEditingTransaction(null)
          }}
          onSuccess={() => {
            setShowAddTransaction(false)
            setEditingTransaction(null)
            fetchData() // Refresh data after successful transaction
          }}
          editingTransaction={editingTransaction}
        />
      )}

      {/* Dynamic Announcement Modal */}
      <DynamicAnnouncementModal />

      {/* AI Chat View */}
      <AIChatView isOpen={showAIChat} onClose={() => setShowAIChat(false)} />

      {/* Floating Chat Button */}
      <FloatingChatButton onClick={() => setShowAIChat(true)} isOpen={showAIChat} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        currentPage={currentPage}
        onNavigate={handlePageChange}
        onOpenAIChat={() => setShowAIChat(true)}
      />
    </div>
  )
}
