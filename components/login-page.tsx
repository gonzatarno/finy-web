"use client"

import React, { useState } from "react"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Mail, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type AuthMode = "login" | "register" | "verify-email" | "forgot-password" | "reset-email-sent" | "resend-confirmation"

export function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      })

      if (result?.error) {
        setError("Error al iniciar sesión con Google. Verifica tu configuración.")
      }
    } catch (error) {
      console.error("[v0] Google sign in error:", error)
      setError("Error al iniciar sesión con Google")
    }
  }

  const handleResendConfirmationEmail = async () => {
    if (!email.trim()) {
      setError("Por favor ingresa tu email")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`
        }
      })

      if (resendError) {
        console.error("[v0] Resend confirmation error:", resendError)
        setError(resendError.message || "Error al reenviar el email de confirmación")
        setIsLoading(false)
        return
      }

      setResendSuccess(true)
      setIsLoading(false)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false)
      }, 5000)
    } catch (err) {
      console.error("[v0] Resend confirmation error:", err)
      setError("Error al reenviar el email de confirmación")
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (mode === "register") {
        // Validaciones
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError("Por favor completa todos los campos")
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres")
          setIsLoading(false)
          return
        }

        // Registrar usuario en Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        })

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("Este email ya está registrado. Intenta iniciar sesión.")
          } else {
            setError(signUpError.message)
          }
          setIsLoading(false)
          return
        }

        if (authData.user) {
          // Crear entrada en public.users
          const { error: insertError } = await supabase.from("users").insert({
            id: authData.user.id,
            email: authData.user.email,
            full_name: name.trim(),
            phone_number: null,
            created_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("[v0] Error creating user in public.users:", insertError)
          }

          // Mostrar pantalla de verificación de email
          setMode("verify-email")
          setIsLoading(false)
        }
      } else if (mode === "login") {
        // Login
        if (!email.trim() || !password.trim()) {
          setError("Por favor completa todos los campos")
          setIsLoading(false)
          return
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        })

        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("Email o contraseña incorrectos")
          } else if (signInError.message.includes("Email not confirmed")) {
            setMode("resend-confirmation")
            setIsLoading(false)
            return
          } else {
            setError(signInError.message)
          }
          setIsLoading(false)
          return
        }

        // Redirigir al dashboard
        router.push("/")
        router.refresh()
      } else if (mode === "forgot-password") {
        // Recuperación de contraseña
        if (!email.trim()) {
          setError("Por favor ingresa tu email")
          setIsLoading(false)
          return
        }

        const redirectUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: redirectUrl }
        )

        if (resetError) {
          setError(resetError.message)
          setIsLoading(false)
          return
        }

        // Mostrar pantalla de éxito
        setMode("reset-email-sent")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("[v0] Auth error:", err)
      setError("Error inesperado. Intenta nuevamente.")
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError(null)
    setResendSuccess(false)
    setName("")
    setEmail("")
    setPassword("")
  }

  const returnToLogin = () => {
    setMode("login")
    setError(null)
    setResendSuccess(false)
    setName("")
    setEmail("")
    setPassword("")
  }

  const goToForgotPassword = () => {
    setMode("forgot-password")
    setError(null)
    setPassword("")
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* Left side - Professional financial lifestyle image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-950 dark:to-gray-900">
        <Image
          src="/images/publicmodern-financial-workspace-with-laptop-and-coffee.jpeg"
          alt="Finy WhatsApp Integration"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Right side - Auth form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-white dark:bg-black">
        <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-lg card-shadow">
          {mode === "verify-email" ? (
            <>
              <CardHeader className="space-y-6 text-center pt-12">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-xl opacity-50" />
                    <Mail className="relative h-16 w-16 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">¡Casi listo!</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  Te enviamos un enlace de confirmación a{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{email}</span>. Por favor, haz clic en
                  él para activar tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <Button
                  onClick={returnToLogin}
                  variant="ghost"
                  className="w-full rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Volver al inicio de sesión
                </Button>
              </CardContent>
            </>
          ) : mode === "resend-confirmation" ? (
            <>
              <CardHeader className="space-y-6 text-center pt-12">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-50" />
                    <Mail className="relative h-16 w-16 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Confirma tu email</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  Tu cuenta aún no está confirmada. Te enviaremos un nuevo enlace de confirmación a{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                {error && (
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {resendSuccess && (
                  <Alert className="rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      Email de confirmación reenviado. Revisa tu bandeja de entrada.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleResendConfirmationEmail}
                  disabled={isLoading}
                  className="w-full rounded-lg cursor-pointer bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Reenviar email de confirmación"
                  )}
                </Button>

                <Button
                  onClick={returnToLogin}
                  variant="ghost"
                  className="w-full rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Volver al inicio de sesión
                </Button>
              </CardContent>
            </>
          ) : mode === "reset-email-sent" ? (
            <>
              <CardHeader className="space-y-6 text-center pt-12">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-50" />
                    <Mail className="relative h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Revisa tu correo</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  Te enviamos un enlace mágico a <span className="font-semibold text-gray-900 dark:text-white">{email}</span> para que
                  puedas entrar a tu cuenta y cambiar tu contraseña.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <Button
                  onClick={returnToLogin}
                  variant="ghost"
                  className="w-full rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Volver al inicio de sesión
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center">
                  <Image
                    src="/images/fini-negro-logo.png"
                    alt="Finy"
                    width={120}
                    height={48}
                    className="h-12 w-auto dark:invert"
                  />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  {mode === "login" ? "Bienvenido a Finy" : "Crea tu cuenta"}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {mode === "login"
                    ? "Inicia sesión para acceder a tu dashboard financiero"
                    : "Regístrate para comenzar a gestionar tus finanzas"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {mode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-200 dark:border-zinc-700"
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-200 dark:border-zinc-700"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contraseña
                      </Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={goToForgotPassword}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border-gray-200 dark:border-zinc-700 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-lg cursor-pointer bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "login" ? "Ingresando..." : "Registrando..."}
                      </>
                    ) : mode === "login" ? (
                      "Ingresar"
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-zinc-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-zinc-900 px-2 text-gray-500 dark:text-gray-400">
                      O continúa con
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full rounded-lg cursor-pointer text-black"
                  style={{ backgroundColor: "#CEFD55" }}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
                  >
                    {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                  </button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
