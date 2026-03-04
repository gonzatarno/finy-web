import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Categorías y métodos por defecto para usuarios nuevos
const DEFAULT_CATEGORIES = [
  { name: 'SUPERMERCADO', icon: '🛒' },
  { name: 'SALIDAS', icon: '🍔' },
  { name: 'ROPA', icon: '👕' },
  { name: 'OCIO', icon: '🎮' },
  { name: 'GASTOS BANCARIOS', icon: '🏦' },
  { name: 'IMPUESTOS', icon: '💹' },
  { name: 'TRANSPORTE', icon: '🚗' },
  { name: 'SERVICIOS', icon: '🔧' },
  { name: 'COMPRAS', icon: '🛍️' },
  { name: 'SALUD', icon: '💊' },
  { name: 'EDUCACION', icon: '🎓' },
  { name: 'OTROS', icon: '📁' }
]

const DEFAULT_METHODS = [
  'EFECTIVO',
  'TRANSFERENCIA',
  'DEBITO',
  'CREDITO VISA',
  'CREDITO MASTER',
  'MERCADO PAGO',
  'OTROS'
]

// Mapeo de métodos con sus iconos y colores por defecto
const METHOD_ICON_MAP: Record<string, { icon: string; color: string }> = {
  'EFECTIVO': { icon: 'banknote', color: '#10B981' },
  'TRANSFERENCIA': { icon: 'arrow-right-left', color: '#3B82F6' },
  'DEBITO': { icon: 'credit-card', color: '#6366F1' },
  'CREDITO VISA': { icon: 'credit-card', color: '#1E40AF' },
  'CREDITO MASTER': { icon: 'credit-card', color: '#DC2626' },
  'MERCADO PAGO': { icon: 'smartphone', color: '#FBBF24' },
  'OTROS': { icon: 'wallet', color: '#8B5CF6' }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const type = searchParams.get('type') // 'categories' o 'methods'

  if (!email || !type) {
    return NextResponse.json(
      { error: 'Email and type required' },
      { status: 400 }
    )
  }

  try {
    // Obtener User ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (type === 'categories') {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) {
        return NextResponse.json(
          { error: 'Error fetching categories' },
          { status: 500 }
        )
      }

      // Si no hay categorías, crear las por defecto
      if (data.length === 0) {
        const categoriesToInsert = DEFAULT_CATEGORIES.map(cat => ({
          user_id: user.id,
          name: cat.name,
          icon: cat.icon
        }))

        const { data: newCategories, error: insertError } = await supabase
          .from('categories')
          .insert(categoriesToInsert)
          .select()

        if (insertError) {
          console.error('Error inserting default categories:', insertError)
          return NextResponse.json(
            { error: 'Error creating default categories' },
            { status: 500 }
          )
        }

        return NextResponse.json({ data: newCategories })
      }

      return NextResponse.json({ data })
    } else if (type === 'methods') {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) {
        return NextResponse.json(
          { error: 'Error fetching payment methods' },
          { status: 500 }
        )
      }

      // Si no hay métodos, crear los por defecto
      if (data.length === 0) {
        const methodsToInsert = DEFAULT_METHODS.map(name => {
          const iconData = METHOD_ICON_MAP[name] || { icon: 'wallet', color: '#6B7280' }
          return {
            user_id: user.id,
            name,
            icon: iconData.icon,
            color: iconData.color  // Usar 'color' en lugar de 'icon_color'
          }
        })

        const { data: newMethods, error: insertError } = await supabase
          .from('payment_methods')
          .insert(methodsToInsert)
          .select()

        if (insertError) {
          console.error('Error inserting default methods:', insertError)
          return NextResponse.json(
            { error: 'Error creating default methods' },
            { status: 500 }
          )
        }

        return NextResponse.json({ data: newMethods })
      }

      // Enriquecer métodos existentes con iconos si no los tienen
      const enrichedData = data.map((method: any) => {
        const methodColor = method.color || method.icon_color // Soportar ambos nombres
        if (!method.icon || !methodColor) {
          const iconData = METHOD_ICON_MAP[method.name] || { icon: 'wallet', color: '#6B7280' }
          return {
            ...method,
            icon: method.icon || iconData.icon,
            color: methodColor || iconData.color  // Asegurar que se retorna como 'color'
          }
        }
        // Asegurar que siempre retorna 'color' aunque ya exista
        return {
          ...method,
          color: methodColor
        }
      })

      return NextResponse.json({ data: enrichedData })
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { email, type, name, icon, icon_color } = await request.json()

  if (!email || !type || !name) {
    return NextResponse.json(
      { error: 'Email, type, and name required' },
      { status: 400 }
    )
  }

  try {
    // Obtener User ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verificar duplicado - case insensitive
    const nameToCheck = name.toUpperCase()
    const { data: existingData, error: checkError } = await supabase
      .from(type === 'categories' ? 'categories' : 'payment_methods')
      .select('id, name')
      .eq('user_id', user.id)

    if (!checkError && existingData) {
      const isDuplicate = existingData.some((item: any) => 
        item.name && item.name.toUpperCase() === nameToCheck
      )
      if (isDuplicate) {
        return NextResponse.json(
          { error: 'Ya existe un elemento con ese nombre' },
          { status: 409 }
        )
      }
    }

    // Preparar datos a insertar
    const insertData: any = {
      user_id: user.id,
      name: name.toUpperCase()
    }

    // Agregar icon según el tipo
    if (type === 'categories') {
      insertData.icon = icon || '📁'
    } else if (type === 'methods') {
      insertData.icon = icon || 'wallet'
      insertData.color = icon_color || '#666666'
    }

    // Insertar
    const { data: newItem, error: insertError } = await supabase
      .from(type === 'categories' ? 'categories' : 'payment_methods')
      .insert([insertData])
      .select()

    if (insertError) {
      console.error(`Error inserting ${type}:`, insertError.message, insertError.details, insertError.hint)
      return NextResponse.json(
        { error: `Error creating ${type}: ${insertError.message}` },
        { status: 500 }
      )
    }

    if (!newItem || newItem.length === 0) {
      console.error(`No item returned after insert for ${type}`)
      return NextResponse.json(
        { error: `Error: No data returned after insert` },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: newItem[0] })
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const { email, type, id, name, icon, icon_color } = await request.json()

  if (!email || !type || !id || !name) {
    return NextResponse.json(
      { error: 'Email, type, id, and name required' },
      { status: 400 }
    )
  }

  try {
    // Obtener User ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Preparar datos a actualizar
    const updateData: any = {
      name: name.toUpperCase()
    }

    // Agregar icon y color si es un método de pago (sin el prefijo icon_)
    if (type === 'methods') {
      updateData.icon = icon || 'wallet'
      updateData.color = icon_color || '#666666'  // Mapear icon_color a color
    }

    // Actualizar
    const { data: updatedItem, error: updateError } = await supabase
      .from(type === 'categories' ? 'categories' : 'payment_methods')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (updateError) {
      console.error(`Error updating ${type}:`, updateError.message, updateError.details, updateError.hint)
      return NextResponse.json(
        { error: `Error updating ${type}: ${updateError.message}` },
        { status: 500 }
      )
    }

    if (!updatedItem || updatedItem.length === 0) {
      console.error(`No item returned after update for ${type}`)
      return NextResponse.json(
        { error: `Error: No data returned after update` },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: updatedItem[0] })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { email, type, id } = await request.json()

  if (!email || !type || !id) {
    return NextResponse.json(
      { error: 'Email, type, and id required' },
      { status: 400 }
    )
  }

  try {
    // Obtener User ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const tableName = type === 'categories' ? 'categories' : 'payment_methods'

    // Verificar que el elemento pertenece al usuario
    const { data: element } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!element) {
      return NextResponse.json(
        { error: 'Element not found or not authorized' },
        { status: 404 }
      )
    }

    // Eliminar
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Error deleting element' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
