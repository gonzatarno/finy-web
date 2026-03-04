import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Mensajes personalizados por país
const MESSAGES = {
  'es-AR': [
    "Che, ¿cargaste los gastos?", 
    "¡No te cuelgues con los gastos del día!", 
    "Buenas, paso a recordarte registrar tus movimientos. 🔔"
  ],
  'es-MX': [
    "¡Qué onda! 🌮 ¿Ya registraste tus gastos?", 
    "No olvides anotar lo que gastaste hoy.", 
    "¡Ey! Acuérdate de registrar tus movimientos."
  ],
  'es-CO': [
    "¡Hola! ☕ Paso a recordarte los gastos, parcero.", 
    "Buenas, ¿ya anotaste tus movimientos de hoy?"
  ],
  'es-CL': [
    "¡Hola! 👋 ¿Cómo estuvo el día? No olvides registrar tus gastos.", 
    "Ya es hora de anotar los gastos del día."
  ],
  'es-ES': [
    "¡Buenas! 🥘 Recuerda apuntar tus gastos de hoy.", 
    "¿Has registrado ya tus movimientos? 📝"
  ],
  'es-LATAM': [
    "¡Hola! 👋 Recordatorio amistoso para registrar tus gastos.", 
    "No olvides mantener tus cuentas al día. 📝", 
    "¿Tuviste gastos hoy? Regístralos ahora. 💸"
  ]
}

// Helper: Detectar país según prefijo del teléfono
function detectCountry(phone: string | null): string {
  if (!phone) return 'es-LATAM'
  
  if (phone.startsWith('+54')) return 'es-AR'
  if (phone.startsWith('+52')) return 'es-MX'
  if (phone.startsWith('+57')) return 'es-CO'
  if (phone.startsWith('+56')) return 'es-CL'
  if (phone.startsWith('+34')) return 'es-ES'
  
  return 'es-LATAM'
}

// Helper: Obtener mensaje aleatorio
function getRandomMessage(country: string): string {
  const messages = MESSAGES[country as keyof typeof MESSAGES] || MESSAGES['es-LATAM']
  const randomIndex = Math.floor(Math.random() * messages.length)
  return messages[randomIndex]
}

// Inicializar Supabase con privilegios de admin
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // 1. SEGURIDAD: Verificar token de autorización
    const authHeader = request.headers.get('Authorization')
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`
    
    if (!authHeader || authHeader !== expectedToken) {
      console.log('[v0] Unauthorized cron attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[v0] Starting daily push notification job...')

    // 2. OBTENER USUARIOS con recordatorio activo (incluir wa_phone)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, wa_phone')
      .eq('daily_reminder_active', true)

    if (usersError) {
      console.error('[v0] Error fetching users:', usersError)
      return NextResponse.json(
        { error: 'Error fetching users from database' },
        { status: 500 }
      )
    }

    if (!users || users.length === 0) {
      console.log('[v0] No users with active reminders found')
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No users with active reminders'
      })
    }

    console.log(`[v0] Found ${users.length} users with active reminders`)

    // 3. AGRUPAR USUARIOS POR PAÍS
    const usersByCountry: Record<string, string[]> = {}
    
    for (const user of users) {
      const country = detectCountry(user.wa_phone)
      if (!usersByCountry[country]) {
        usersByCountry[country] = []
      }
      usersByCountry[country].push(user.id)
    }

    console.log('[v0] Users grouped by country:', Object.keys(usersByCountry).map(c => `${c}: ${usersByCountry[c].length}`))

    // 4. ENVIAR A ONESIGNAL POR PAÍS (Batch)
    const results = []
    
    for (const [country, userIds] of Object.entries(usersByCountry)) {
      if (userIds.length === 0) continue

      const message = getRandomMessage(country)
      console.log(`[v0] Sending to ${country} (${userIds.length} users): "${message}"`)

      const oneSignalPayload = {
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        target_channel: 'push',
        include_aliases: {
          external_id: userIds
        },
        headings: {
          es: '🔔 ¡Momento de registrar!'
        },
        contents: {
          es: message
        },
        url: 'https://dashboard.finyapp.io/transactions?action=new'
      }

      const oneSignalResponse = await fetch('https://api.onesignal.com/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify(oneSignalPayload)
      })

      const oneSignalData = await oneSignalResponse.json()

      if (!oneSignalResponse.ok) {
        console.error(`[v0] OneSignal API error for ${country}:`, oneSignalData)
        results.push({
          country,
          count: userIds.length,
          success: false,
          error: oneSignalData
        })
      } else {
        console.log(`[v0] Notifications sent successfully to ${country}:`, oneSignalData)
        results.push({
          country,
          count: userIds.length,
          success: true,
          response: oneSignalData
        })
      }
    }

    // 5. RESPUESTA EXITOSA
    return NextResponse.json({
      success: true,
      total_users: users.length,
      results
    })

  } catch (error) {
    console.error('[v0] Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
