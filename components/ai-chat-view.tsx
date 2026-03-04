"use client"

// Chat component for AI assistant interaction with localStorage persistence
import React from "react"
import { Plus, ImageIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { X, Send, Camera, Mic, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { TransactionReviewCard } from "@/components/transaction-review-card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { createClient } from "@/lib/supabase/client"
import { useMediaQuery } from "@/hooks/use-mobile"
import { usePaymentMethods } from "@/hooks/use-payment-methods" // Declare usePaymentMethods import

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  isLoading?: boolean
  buttons?: Array<{ label: string; value?: string; url?: string }>
  imagePreview?: string
  audioPreview?: string
  type?: string
  data?: Record<string, unknown>
}

interface AIChatViewProps {
  isOpen: boolean
  onClose: () => void
}

const API_URL = "https://n8n.finyapp.io/webhook/chat-gasto"

export function AIChatView({ isOpen, onClose }: AIChatViewProps) {
  const { toast } = useToast()
  const { data: session } = useSession()
  const { methods } = usePaymentMethods()
  const [userId, setUserId] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hola! Soy el Asistente Finy. Puedes enviarme texto, una foto de tu ticket o grabar un mensaje de voz y te ayudaré a registrar tu gasto.",
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false) // Declare setIsReviewOpen variable

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user UUID from Supabase using email (same pattern as rest of app)
  useEffect(() => {
    const fetchUserId = async () => {
      if (!session?.user?.email || !isOpen) return

      try {
        const supabase = createClient()
        const { data: user, error } = await supabase
          .from("users")
          .select("id")
          .eq("email", session.user.email)
          .single()

        if (error || !user) {
          console.error("[v0] Error fetching user ID:", error)
          toast({
            title: "Error",
            description: "No se pudo obtener tu información de usuario.",
            variant: "destructive",
          })
          return
        }

        setUserId(user.id)
      } catch (error) {
        console.error("[v0] Error in fetchUserId:", error)
      }
    }

    fetchUserId()
  }, [isOpen, session?.user?.email, toast])

  // Load chat history from localStorage when opening
  useEffect(() => {
    if (!isOpen) return

    try {
      const saved = localStorage.getItem("ui_chat_history")
      if (saved) {
        const parsedMessages = JSON.parse(saved)
        setMessages(parsedMessages)
      } else {
        // First time: show welcome message
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hola! Soy el Asistente Finy. Puedes enviarme texto, una foto de tu ticket o grabar un mensaje de voz y te ayudaré a registrar tu gasto.",
          },
        ])
      }
    } catch (error) {
      console.error("[v0] Error loading chat history:", error)
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hola! Soy el Asistente Finy. Puedes enviarme texto, una foto de tu ticket o grabar un mensaje de voz y te ayudaré a registrar tu gasto.",
        },
      ])
    }
  }, [isOpen])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("ui_chat_history", JSON.stringify(messages))
      } catch (error) {
        console.error("[v0] Error saving chat history:", error)
      }
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-scroll textarea into view when focused (mobile keyboard support)
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleFocus = () => {
      // Small delay to wait for keyboard to appear
      setTimeout(() => {
        textarea.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 300)
    }

    textarea.addEventListener('focus', handleFocus)
    return () => textarea.removeEventListener('focus', handleFocus)
  }, [])

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to recalculate
    textarea.style.height = 'auto'
    // Set to scrollHeight (content height)
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [inputText])

  const handleSendMessage = async (content?: string, imageFile?: File, audioFile?: Blob) => {
    const messageContent = content || inputText.trim()
    if (!messageContent && !imageFile && !audioFile) return

    // 1. Agregar el mensaje del usuario a la UI inmediatamente
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent || (imageFile ? "📷 Imagen enviada" : "🎤 Audio enviado"),
      imagePreview: imageFile ? imagePreview || undefined : undefined,
      audioPreview: audioFile ? audioPreviewUrl || undefined : undefined,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setImagePreview(null)
    setSelectedFile(null)
    setAudioBlob(null)
    setAudioPreviewUrl(null)
    setIsSending(true)

    try {
      // Preparar FormData para enviar al webhook
      const formData = new FormData()
      formData.append("userId", userId || "")
      formData.append("type", imageFile ? "image" : audioFile ? "audio" : "text")
      if (messageContent) formData.append("text", messageContent)
      if (imageFile) formData.append("file", imageFile)
      if (audioFile) formData.append("file", audioFile, "recording.webm")

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rawText = await response.text()

      let data
      try {
        data = JSON.parse(rawText)
      } catch (parseError) {
        data = { text: rawText }
      }

      // Extraer datos de transacción de cualquier estructura que devuelva n8n
      // Estructura esperada: [{ type: "transaction_review", data: { amount, category, ... }, text: "..." }]
      const extractTransactionData = (d: any): any => {
        if (!d || typeof d !== "object") return null

        // Si es un array (estructura de n8n), extraer el primer elemento
        if (Array.isArray(d)) {
          const item = d[0]
          // Si tiene type: "transaction_review" y data con amount/category
          if (item?.type === "transaction_review" && item?.data?.amount && item?.data?.category) {
            return item.data
          }
          // O si el primer elemento es directamente una transacción
          if (item?.amount && item?.category) {
            return item
          }
        }

        // Si es un objeto con type: "transaction_review"
        if (d.type === "transaction_review" && d.data?.amount && d.data?.category) {
          return d.data
        }

        // Directo en la raíz
        if (d.amount && d.category) return d
        
        // Anidado en payload
        if (d.payload?.amount && d.payload?.category) return d.payload
        
        // Anidado en output
        if (d.output?.amount && d.output?.category) return d.output
        
        // Anidado en data
        if (d.data?.amount && d.data?.category) return d.data

        return null
      }

      const transactionData = extractTransactionData(data)

      // PRIMERO: Verificar si es una transacción para confirmar
      if (transactionData) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            role: "assistant",
            content: transactionData.description || "Confirma este movimiento",
            type: "transaction_review",
            data: transactionData,
          },
        ])
      } else {
        // SEGUNDO: Si NO es transacción, extraer el mensaje de texto
        let botMessage = "No pude entender la respuesta."

        // Si data es un array, buscar el texto en el primer elemento
        if (Array.isArray(data) && data[0]) {
          botMessage = data[0].text || data[0].message || data[0].respuesta || data[0].content || botMessage
        } else if (typeof data === "string") {
          botMessage = data
        } else if (typeof data === "object" && data !== null) {
          botMessage =
            data.text ||
            data.message ||
            data.respuesta ||
            data.output ||
            data.response ||
            data.content

          if (!botMessage) {
            botMessage = JSON.stringify(data, null, 2)
          }
        }

        // Verificar si el mensaje contiene una plantilla n8n sin procesar
        if (botMessage && typeof botMessage === 'string' && botMessage.includes('{{') && botMessage.includes('}}')) {
          botMessage = "Parece que n8n no procesó correctamente la respuesta. Por favor, verifica la configuración del flujo de n8n."
        }

        setMessages((prev) => [
          ...prev,
          { id: String(Date.now()), role: "assistant", content: String(botMessage) },
        ])
      }
    } catch (error) {
      console.error("❌ Error en la comunicación:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error de conexión." },
      ])
    } finally {
      setIsSending(false)
    }
  }

  // Store the actual File object for sending
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file for later sending
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageSend = () => {
    // Use stored file, not fileInputRef (which might be cleared)
    if (selectedFile) {
      // PRIORITY: Send image with text as caption
      handleSendMessage(inputText, selectedFile)
      setSelectedFile(null) // Clear after sending
    }
  }

  const startRecording = async () => {
    try {
      // Reset previous recording data
      audioChunksRef.current = []
      setAudioBlob(null)
      setAudioPreviewUrl(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        try {
          if (audioChunksRef.current.length === 0) {
            console.error("[v0] No audio chunks captured")
            toast({
              title: "Error",
              description: "No se grabó audio, intenta de nuevo",
              variant: "destructive",
            })
            return
          }
          
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          setAudioBlob(audioBlob)
          const audioUrl = URL.createObjectURL(audioBlob)
          setAudioPreviewUrl(audioUrl)
        } catch (error) {
          console.error("[v0] Error creating audio blob:", error)
          toast({
            title: "Error",
            description: "Error al procesar el audio",
            variant: "destructive",
          })
        } finally {
          // Always stop tracks
          stream.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error("[v0] MediaRecorder error:", event.error)
        toast({
          title: "Error",
          description: "Error al grabar audio: " + event.error,
          variant: "destructive",
        })
        setIsRecording(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      toast({
        title: "Error",
        description: "No se pudo acceder al micrófono",
        variant: "destructive",
      })
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioBlob(null)
      setAudioPreviewUrl(null)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
      audioChunksRef.current = []
    }
  }

  const handleAudioSend = () => {
    if (audioBlob) {
      handleSendMessage(inputText, undefined, audioBlob)
      // Reset audio state after sending
      setAudioBlob(null)
      setAudioPreviewUrl(null)
      audioChunksRef.current = []
    }
  }

  const handleButtonClick = (button: { label: string; value?: string; url?: string }) => {
    if (button.url) {
      window.open(button.url, "_blank")
    } else if (button.value) {
      handleSendMessage(button.value)
    }
  }

  const handleClearChat = () => {
    // Clear messages from state
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hola! Soy el Asistente Finy. Puedes enviarme texto, una foto de tu ticket o grabar un mensaje de voz y te ayudaré a registrar tu gasto.",
      },
    ])
    // Clear from localStorage
    try {
      localStorage.removeItem("ui_chat_history")
    } catch (error) {
      console.error("[v0] Error clearing chat history:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Desktop: Enter sends, Shift+Enter adds new line
    // Mobile: Enter adds new line (send via button only)
    if (e.key === "Enter") {
      if (isMobile) {
        // On mobile, Enter always adds new line (send only via button)
        return
      } else if (!e.shiftKey) {
        // On desktop, Enter without Shift sends the message
        e.preventDefault()
        handleSendMessage()
      }
      // Shift+Enter on desktop adds new line (default behavior)
    }
  }

  // Don't render anything when closed
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-[49999] animate-in fade-in duration-200" 
          onClick={onClose} 
        />
      )}
      
      {/* Chat Container - App Shell with 100dvh */}
      <div
        className={cn(
          "fixed z-[50000] flex flex-col bg-white dark:bg-zinc-950 animate-in slide-in-from-bottom-4 fade-in duration-300 overflow-hidden",
          isMobile
            ? "inset-0 h-[100dvh]"
            : "bottom-6 right-6 w-[420px] h-[700px] rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800"
        )}
        style={isMobile ? { paddingTop: "env(safe-area-inset-top)" } : undefined}
      >
        {/* Header - Never shrinks */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CEFD55] rounded-full flex items-center justify-center p-1 shadow-sm">
              <Image
                src="/images/512.png"
                alt="Finy AI"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Asistente Finy</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Con IA</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area - Grows to fill space, scrolls internally */}
        <div className="flex-grow overflow-y-auto overscroll-contain px-4 py-4 space-y-4 pb-32 md:pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.type === "transaction_review" && message.data ? (
                <TransactionReviewCard 
                  initialData={message.data} 
                  onClose={() => setIsReviewOpen(false)}
                  onAddMessage={(newMessage) => setMessages(prev => [...prev, newMessage])}
                  chatEndRef={messagesEndRef}
                />
              ) : (
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-[#CEFD55] text-black"
                      : message.type === "system_alert"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 text-gray-900 dark:text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white"
                  )}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Escribiendo...</span>
                    </div>
                  ) : (
                    <>
                      {message.imagePreview && (
                        <div className="mb-2">
                          <Image
                            src={message.imagePreview || "/placeholder.svg"}
                            alt="Imagen enviada"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      {message.audioPreview && (
                        <audio controls src={message.audioPreview} className="mb-2 max-w-full" />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{typeof message.content === 'object' ? JSON.stringify(message.content) : message.content}</p>
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.buttons.map((button, idx) => (
                            <Button
                              key={idx}
                              onClick={() => handleButtonClick(button)}
                              variant="outline"
                              size="sm"
                              className="text-xs border-gray-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700"
                            >
                              {button.label}
                              {button.url && <ExternalLink className="ml-1 h-3 w-3" />}
                            </Button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator - Show when waiting for response */}
          {isSending && (
            <div className="flex justify-start">
              <div className="flex gap-2 items-end">
                {/* Avatar */}
                <div className="w-8 h-8 bg-[#CEFD55] rounded-full flex items-center justify-center p-0.5 flex-shrink-0 shadow-sm">
                  <Image
                    src="/images/512.png"
                    alt="Finy typing"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                
                {/* Message bubble with typing dots */}
                <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  <div 
                    className="w-2.5 h-2.5 bg-gray-400 dark:bg-zinc-500 rounded-full" 
                    style={{ 
                      animation: 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: '0s'
                    }} 
                  />
                  <div 
                    className="w-2.5 h-2.5 bg-gray-400 dark:bg-zinc-500 rounded-full" 
                    style={{ 
                      animation: 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: '0.2s'
                    }} 
                  />
                  <div 
                    className="w-2.5 h-2.5 bg-gray-400 dark:bg-zinc-500 rounded-full" 
                    style={{ 
                      animation: 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: '0.4s'
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Never shrinks, stays at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          {/* Preview Area */}
          {(imagePreview || audioPreviewUrl) && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              {imagePreview && (
                <div className="relative inline-block">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" width={100} height={100} className="rounded-lg" />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {audioPreviewUrl && (
                <div className="flex items-center gap-2">
                  <audio controls src={audioPreviewUrl} className="flex-1" />
                  <button
                    onClick={() => {
                      setAudioBlob(null)
                      setAudioPreviewUrl(null)
                    }}
                    className="bg-red-500 text-white rounded-full p-1"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Controls */}
          {isRecording ? (
            // WhatsApp-style Recording Interface
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelRecording}
                className="flex-shrink-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 flex items-center gap-3">
                {/* Recording Animation */}
                <div className="flex gap-1 items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-red-600 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Timer */}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
                </span>
              </div>

              <Button
                onClick={stopRecording}
                size="icon"
                className="flex-shrink-0 bg-[#CEFD55] hover:bg-[#B8E64A] text-black"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            // Normal Input Interface
            <div className="flex items-end gap-1 sm:gap-2 relative">
              {/* Mobile: Plus Menu with Photo/Gallery Options */}
              {isMobile && (
                <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                  disabled={isSending}
                  className="flex-shrink-0 h-11 w-11"
                >
                  <Plus className="h-7 w-7" />
                </Button>

                  {/* Attachment Menu Dropdown */}
                  {isAttachmentMenuOpen && (
                    <div className="absolute bottom-12 left-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg p-2 z-50">
                      {/* Take Photo */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          fileInputRef.current?.click()
                          setIsAttachmentMenuOpen(false)
                        }}
                        className="w-full justify-start text-sm gap-2 dark:hover:bg-zinc-800"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Sacar foto</span>
                      </Button>

                      {/* Choose from Library */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setSelectedFile(file)
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string)
                              }
                              reader.readAsDataURL(file)
                            }
                          }
                          input.click()
                          setIsAttachmentMenuOpen(false)
                        }}
                        className="w-full justify-start text-sm gap-2 dark:hover:bg-zinc-800"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>Galería</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Desktop: Gallery Button Only */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = (e: any) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setSelectedFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }
                    input.click()
                  }}
                  disabled={isSending}
                  className="flex-shrink-0 h-9 w-9"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Mic Button */}
              <Button
                variant="ghost"
                size="icon"
                onMouseDown={startRecording}
                onTouchStart={startRecording}
                disabled={isSending}
                className="flex-shrink-0 h-11 w-11 sm:h-9 sm:w-9"
              >
                <Mic className="h-7 w-7 sm:h-5 sm:w-5" />
              </Button>

              {/* Text Input */}
              <Textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                disabled={isSending}
                className="flex-1 min-h-[44px] max-h-[120px] resize-none text-base sm:text-sm"
                rows={1}
              />

              {/* Send Button */}
              <Button
                onClick={() => {
                  if (imagePreview) {
                    handleImageSend()
                  } else if (audioBlob) {
                    handleAudioSend()
                  } else {
                    handleSendMessage()
                  }
                }}
                disabled={isSending || (!inputText.trim() && !imagePreview && !audioBlob)}
                size="icon"
                className="flex-shrink-0 h-11 w-11 sm:h-9 sm:w-9 bg-[#CEFD55] hover:bg-[#B8E64A] text-black"
              >
                {isSending ? <Loader2 className="h-7 w-7 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-7 w-7 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
