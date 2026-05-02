import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Accessible loading indicator */}
      <span className="sr-only">Loading…</span>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
