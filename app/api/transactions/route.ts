import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Create Transaction
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_email, installments, ...data } = body

    // 1. Find user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user_email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const installmentsCount = installments && installments > 1 ? installments : 1
    const transactionsToInsert = []

    // 2. Generate transactions (single or multiple installments)
    if (installmentsCount > 1) {
      // Multiple installments: "Explode" the transaction
      const parentId = crypto.randomUUID()
      const totalAmount = parseFloat(data.amount)
      const installmentAmount = totalAmount / installmentsCount

      for (let i = 0; i < installmentsCount; i++) {
        // Create a fresh date object for each installment to avoid mutation issues
        const baseDate = new Date(data.date)
        
        // Add months safely: get year, month, day separately to avoid end-of-month issues
        const targetMonth = baseDate.getMonth() + i
        const targetYear = baseDate.getFullYear() + Math.floor(targetMonth / 12)
        const normalizedMonth = targetMonth % 12
        
        // Create the installment date with proper month/year handling
        const installmentDate = new Date(targetYear, normalizedMonth, baseDate.getDate(), baseDate.getHours(), baseDate.getMinutes(), 0, 0)

        transactionsToInsert.push({
          user_id: user.id,
          amount: installmentAmount,
          currency: data.currency,
          date: installmentDate.toISOString(),
          description: `${data.description} (${i + 1}/${installmentsCount})`,
          category: data.category,
          payment_method: data.method,
          type: data.type,
          month_imputation: installmentDate.toISOString().slice(0, 7),
          installment_number: i + 1,
          installments_total: installmentsCount,
          parent_id: parentId,
        })
      }
    } else {
      // Single transaction
      transactionsToInsert.push({
        user_id: user.id,
        amount: parseFloat(data.amount),
        currency: data.currency,
        date: new Date(data.date).toISOString(),
        description: data.description,
        category: data.category,
        payment_method: data.method,
        type: data.type,
        month_imputation: new Date(data.date).toISOString().slice(0, 7),
        installment_number: 1,
        installments_total: 1,
        parent_id: null,
      })
    }

    // 3. Insert all transactions
    const { error } = await supabase.from("transactions").insert(transactionsToInsert)

    if (error) {
      console.error("[v0] Error creating transaction(s):", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`[v0] Successfully created ${transactionsToInsert.length} transaction(s)`)
    return NextResponse.json({ success: true, count: transactionsToInsert.length })
  } catch (error) {
    console.error("[v0] Error in POST /api/transactions:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT: Update Transaction
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: "ID de transacción requerido" }, { status: 400 })
    }

    const { error } = await supabase
      .from("transactions")
      .update({
        amount: parseFloat(data.amount),
        currency: data.currency,
        date: new Date(data.date).toISOString(),
        description: data.description,
        category: data.category,
        payment_method: data.method,
        type: data.type,
        month_imputation: new Date(data.date).toISOString().slice(0, 7),
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating transaction:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PUT /api/transactions:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE: Delete Transaction
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de transacción requerido" }, { status: 400 })
    }

    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting transaction:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/transactions:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
