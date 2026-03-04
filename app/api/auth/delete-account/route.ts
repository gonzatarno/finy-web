import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return Response.json({ error: 'Email requerido' }, { status: 400 })
    }

    // Use service role key for secure deletion on server side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Delete user data from users table
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', email)

    if (deleteError) {
      console.error('[v0] Error deleting user from users table:', deleteError)
      throw deleteError
    }

    return Response.json({
      success: true,
      message: 'Cuenta eliminada exitosamente',
    })
  } catch (error) {
    console.error('[v0] Error in DELETE /api/auth/delete-account:', error)
    return Response.json(
      { error: 'No se pudo eliminar la cuenta' },
      { status: 500 }
    )
  }
}
