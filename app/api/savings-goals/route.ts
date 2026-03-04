import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to verify authorization
function checkAuthorization(userEmail: string | null | undefined): boolean {
  // Allow all authenticated users
  return !!userEmail
}

// GET - Fetch all savings goals for the user
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!checkAuthorization(session.user.email)) {
    return NextResponse.json({ error: "Savings goals feature not available for your account" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  // Get user id from email
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - Create a new savings goal
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!checkAuthorization(session.user.email)) {
    return NextResponse.json({ error: "Savings goals feature not available for your account" }, { status: 403 })
  }

  const body = await req.json()
  const { email, name, target_amount, currency, deadline, icon } = body

  if (!email || !name || !target_amount || !currency) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (userError || !userData) {
    console.error("[v0] User not found error:", userError)
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      user_id: userData.id,
      name,
      target_amount: Number(target_amount),
      current_amount: 0,
      currency,
      deadline: deadline || null,
      icon: icon || "target",
      status: "active",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

// PATCH - Update current_amount (contribute to goal)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!checkAuthorization(session.user.email)) {
    return NextResponse.json({ error: "Savings goals feature not available for your account" }, { status: 403 })
  }

  const body = await req.json()
  const { id, amount_to_add } = body

  if (!id || amount_to_add === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Get current goal
  const { data: goal, error: goalError } = await supabase
    .from("savings_goals")
    .select("current_amount, target_amount")
    .eq("id", id)
    .single()

  if (goalError || !goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 })
  }

  const newAmount = Number(goal.current_amount) + Number(amount_to_add)
  const isCompleted = newAmount >= Number(goal.target_amount)

  const { data, error } = await supabase
    .from("savings_goals")
    .update({
      current_amount: newAmount,
      status: isCompleted ? "completed" : "active",
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE - Delete a savings goal
export async function DELETE(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!checkAuthorization(session.user.email)) {
    return NextResponse.json({ error: "Savings goals feature not available for your account" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("savings_goals")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
