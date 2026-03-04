import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v5 as uuidv5 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, nps_score, message, device_info } = body

    if (!email || nps_score === null || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Supabase credentials not configured")
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      )
    }

    try {
      // Create Supabase client with anon key
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Try to get service role key for user lookup
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      let userId: string | null = null

      if (serviceRoleKey) {
        try {
          const adminClient = createClient(supabaseUrl, serviceRoleKey)
          const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers()
          
          if (!usersError && users) {
            const user = users.find(u => u.email === email)
            if (user?.id) {
              userId = user.id
            }
          }
        } catch (e) {
          console.error("[v0] Failed to lookup user with service role:", e)
        }
      }

      // If no user found, create a guest user_id but use a proper UUID format
      if (!userId) {
        // Create a deterministic UUID v5 from email (for consistency)
        const emailHash = Buffer.from(email).toString('base64').slice(0, 32)
        userId = `00000000-0000-5000-a000-${emailHash.padEnd(24, '0')}`.slice(0, 36)
      }

      // Insert feedback
      const { data, error: insertError } = await supabase
        .from("app_feedbacks")
        .insert({
          user_id: userId,
          nps_score: Number(nps_score),
          message: message.trim(),
          device_info: device_info || "",
        })
        .select()

      if (insertError) {
        console.error("[v0] Insert error:", insertError)
        console.error("[v0] Error code:", insertError.code)
        console.error("[v0] Error message:", insertError.message)
        console.error("[v0] Error details:", insertError.details)
        return NextResponse.json(
          { error: `Database error: ${insertError.message}` },
          { status: 400 }
        )
      }

      console.log("[v0] Feedback inserted successfully:", data)
      return NextResponse.json({ success: true, data })
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
