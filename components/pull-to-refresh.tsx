"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useEffect, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh?: () => Promise<void> | void
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const router = useRouter()
  
  // Estado visual (solo para renderizar UI)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullPixels, setPullPixels] = useState(0)
  
  // --- LÓGICA INTERNA (Referencias mudas para velocidad) ---
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  
  // FLAGS DE CONTROL (El semáforo)
  const isDragging = useRef(false)       // ¿Está el usuario arrastrando activamente?
  const ignoreGesture = useRef(false)    // ¿Debemos ignorar este toque por completo?
  const isRefreshingRef = useRef(false)  // Espejo del state para acceso inmediato

  // Constantes de configuración
  const THRESHOLD = 80      // Cuánto hay que bajar para activar (px)
  const MAX_PULL = 140      // Límite visual de estiramiento
  const RESISTANCE = 0.4    // Resistencia elástica (0.5 = la mitad de lo que mueves el dedo)

  // Sincronizar ref con state para el useEffect
  useEffect(() => {
    isRefreshingRef.current = isRefreshing
  }, [isRefreshing])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- 1. AL TOCAR LA PANTALLA ---
    const handleTouchStart = (e: TouchEvent) => {
      // Leemos la posición REAL del scroll en este exacto momento
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      // REGLA DE ORO: Si no estamos en el pixel 0, este gesto NO ES un refresh.
      // Es un scroll normal para leer. Lo marcamos para IGNORAR hasta que levante el dedo.
      if (scrollTop > 0) {
        ignoreGesture.current = true
        isDragging.current = false
        return
      }

      // Si estamos en 0, iniciamos la lógica de refresh
      ignoreGesture.current = false
      isDragging.current = true
      startY.current = e.touches[0].clientY
      setPullPixels(0)
    }

    // --- 2. AL MOVER EL DEDO ---
    const handleTouchMove = (e: TouchEvent) => {
      // Si el semáforo dice ignorar (porque empezamos abajo), adiós.
      if (ignoreGesture.current) return
      
      // Si ya se está refrescando, no hacemos nada
      if (isRefreshingRef.current) return

      const currentY = e.touches[0].clientY
      const delta = currentY - startY.current

      // Si estamos subiendo el dedo (delta negativo), es scroll hacia abajo. Ignorar.
      if (delta <= 0) return

      // --- AQUÍ LA MAGIA ---
      // Si llegamos aquí, es porque:
      // 1. Empezamos en el tope (0px).
      // 2. Estamos tirando hacia abajo.
      // -> ACTIVAMOS EL REFRESH Y BLOQUEAMOS EL SCROLL NATIVO
      
      if (e.cancelable) e.preventDefault() // Bloquea el rebote nativo del navegador
      
      // Aplicamos resistencia logarítmica
      const dampening = delta * RESISTANCE
      setPullPixels(Math.min(dampening, MAX_PULL))
    }

    // --- 3. AL SOLTAR ---
    const handleTouchEnd = async () => {
      // Si estábamos ignorando, reseteamos el flag y salimos
      if (ignoreGesture.current) {
        ignoreGesture.current = false
        return
      }

      if (!isDragging.current || isRefreshingRef.current) return

      // ¿Estiró lo suficiente?
      if (pullPixels >= THRESHOLD) {
        // SI -> Disparar Refresh
        setIsRefreshing(true)
        setPullPixels(THRESHOLD) // Mantener el spinner visible

        try {
          if (onRefresh) {
            await onRefresh()
          } else {
            router.refresh()
            // Pequeño delay cosmético
            await new Promise(resolve => setTimeout(resolve, 800))
          }
        } catch (error) {
          console.error(error)
        } finally {
          setIsRefreshing(false)
          setPullPixels(0)
        }
      } else {
        // NO -> Volver a 0 suavemente
        setPullPixels(0)
      }

      // Reset total
      isDragging.current = false
    }

    // passive: false es OBLIGATORIO para poder usar e.preventDefault() y bloquear el scroll
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [router, onRefresh, pullPixels]) 

  return (
    <div ref={containerRef} className="min-h-screen relative">
      
      {/* Indicador de carga (Spinner) */}
      <div 
        className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{
          top: 0,
          // Si refresca se queda en 80px, si no sigue al dedo, si está en 0 se esconde arriba (-50px)
          transform: `translateY(${pullPixels > 0 ? pullPixels : -50}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="bg-white dark:bg-zinc-800 rounded-full p-2 shadow-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
          <Loader2 
            className={`w-6 h-6 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ 
              transform: !isRefreshing ? `rotate(${pullPixels * 2}deg)` : undefined 
            }}
          />
        </div>
      </div>

      {/* Contenido de la página */}
      <div 
        style={{
          // Opcional: Empujar el contenido hacia abajo (estilo iOS)
          // Si prefieres estilo Android (contenido fijo, spinner flotante), borra este transform.
          transform: `translateY(${pullPixels / 2}px)`, 
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {children}
      </div>
    </div>
  )
}
