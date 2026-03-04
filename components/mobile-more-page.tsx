"use client"

import {
  Home,
  ArrowRightLeft,
  BarChart3,
  CreditCard,
  Plus,
  MessageSquare,
  Target,
  FileText,
  Users,
  PieChart,
  Settings,
  HelpCircle,
  CreditCard as PlansIcon,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HelpFeedbackDialog } from "@/components/help-feedback-dialog"
import { Badge } from "@/components/ui/badge"

interface MobileMorePageProps {
  currentPage?: string
  onNavigate?: (page: string) => void
  onAddClick?: () => void
  onOpenAIChat?: () => void
  onLogout?: () => void
  isMetasEnabled?: boolean
}

interface NavRowProps {
  icon: React.ElementType
  label: string
  onClick?: () => void
  isActive?: boolean
  disabled?: boolean
  badge?: string
  danger?: boolean
}

function NavRow({ icon: Icon, label, onClick, isActive, disabled, badge, danger }: NavRowProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3.5 px-4 py-3.5 text-[15px] font-medium transition-colors text-left",
        isActive && "bg-gray-50 dark:bg-zinc-800/50 text-black dark:text-white",
        danger && "text-red-500 dark:text-red-400",
        !isActive && !danger && !disabled && "text-gray-800 dark:text-zinc-200 active:bg-gray-50 dark:active:bg-zinc-800/50",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      type="button"
    >
      <div className={cn(
        "flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0",
        isActive && "bg-[#CEFD55]/20",
        danger && "bg-red-50 dark:bg-red-950/30",
        !isActive && !danger && "bg-gray-100 dark:bg-zinc-800"
      )}>
        <Icon className={cn(
          "h-[18px] w-[18px]",
          isActive && "text-[#6b8c00]",
          danger && "text-red-500 dark:text-red-400",
          !isActive && !danger && "text-gray-600 dark:text-zinc-400"
        )} />
      </div>
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge
          variant="secondary"
          className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 rounded-full font-normal border-0"
        >
          {badge}
        </Badge>
      )}
    </button>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="px-4 pt-6 pb-2">
      <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
        {title}
      </p>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gray-100 dark:bg-zinc-800 mx-0" />
}

export function MobileMorePage({
  currentPage = "Más",
  onNavigate,
  onAddClick,
  onOpenAIChat,
  onLogout,
  isMetasEnabled = false,
}: MobileMorePageProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 min-h-full pb-24">

      {/* Sección 1: Principal */}
      <SectionTitle title="Principal" />
      <div className="mx-3 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        <NavRow
          icon={Home}
          label="Inicio"
          isActive={currentPage === "Inicio"}
          onClick={() => onNavigate?.("Inicio")}
        />
        <Divider />
        <NavRow
          icon={ArrowRightLeft}
          label="Movimientos"
          isActive={currentPage === "Movimientos"}
          onClick={() => onNavigate?.("Movimientos")}
        />
        <Divider />
        <NavRow
          icon={BarChart3}
          label="Estadísticas"
          isActive={currentPage === "Estadísticas"}
          onClick={() => onNavigate?.("Estadísticas")}
        />
      </div>

      {/* Sección 2: Herramientas */}
      <SectionTitle title="Herramientas" />
      <div className="mx-3 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        <NavRow
          icon={CreditCard}
          label="Categorías y Tarjetas"
          isActive={currentPage === "Categorías y Tarjetas"}
          onClick={() => onNavigate?.("Categorías y Tarjetas")}
        />
        <Divider />
        <NavRow
          icon={Plus}
          label="Agregar Movimiento"
          onClick={onAddClick}
        />
        <Divider />
        <NavRow
          icon={MessageSquare}
          label="Hablar con la IA"
          onClick={onOpenAIChat}
        />
      </div>

      {/* Sección 3: Próximamente */}
      <SectionTitle title="Próximamente" />
      <div className="mx-3 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        {isMetasEnabled && (
          <>
            <NavRow
              icon={Target}
              label="Metas"
              isActive={currentPage === "Metas"}
              onClick={() => onNavigate?.("Metas")}
            />
            <Divider />
          </>
        )}
        {!isMetasEnabled && (
          <>
            <NavRow icon={Target} label="Metas" disabled badge="En prueba" />
            <Divider />
          </>
        )}
        <NavRow icon={FileText} label="Reportes" disabled badge="Próximamente" />
        <Divider />
        <NavRow icon={Users} label="Finy Dúo" disabled badge="Próximamente" />
        <Divider />
        <NavRow icon={PieChart} label="Presupuestos" disabled badge="Próximamente" />
      </div>

      {/* Sección 4: Cuenta */}
      <SectionTitle title="Cuenta" />
      <div className="mx-3 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        <NavRow
          icon={Settings}
          label="Configuración"
          onClick={() => onNavigate?.("Account Settings")}
        />
        <Divider />
        <HelpFeedbackDialog>
          <button
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-[15px] font-medium text-gray-800 dark:text-zinc-200 active:bg-gray-50 dark:active:bg-zinc-800/50 transition-colors text-left"
            type="button"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
              <HelpCircle className="h-[18px] w-[18px] text-gray-600 dark:text-zinc-400" />
            </div>
            <span className="flex-1">Ayuda y Feedback</span>
          </button>
        </HelpFeedbackDialog>
        <Divider />
        <NavRow
          icon={PlansIcon}
          label="Ver Planes"
          onClick={() => window.open("https://www.finyapp.io/#precios", "_blank")}
        />
      </div>

      {/* Sección 5: Peligro */}
      <SectionTitle title="Sesión" />
      <div className="mx-3 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        <NavRow
          icon={LogOut}
          label="Cerrar Sesión"
          onClick={onLogout}
          danger
        />
      </div>

    </div>
  )
}
