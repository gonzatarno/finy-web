import { NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = 'https://n8n.finyapp.io/webhook/chat-gasto'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    // Reenviar a n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('[v0] n8n webhook error:', n8nResponse.status, errorText)
      return NextResponse.json(
        { error: 'n8n processing failed' },
        { status: n8nResponse.status }
      )
    }

    // Devolver directamente la respuesta cruda de n8n sin envolverla
    const n8nData = await n8nResponse.json()
    return NextResponse.json(n8nData, { status: 200 })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    )
  }
}
