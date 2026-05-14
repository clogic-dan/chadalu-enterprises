import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      client_locations (*),
      bookings (id, status, created_at),
      payments (id, amount_kes, status)
    `)
    .eq('id', userId)
    .single()

  if (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const bookingsCount = data.bookings?.length || 0
  const totalSpent = data.payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount_kes, 0) || 0

  return NextResponse.json({
    ...data,
    stats: {
      bookingsCount,
      totalSpent
    }
  })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { user_id, name, phone, avatar_url } = body

  if (!user_id) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      name,
      phone,
      avatar_url,
      updated_at: new Date().toISOString()
    })
    .eq('id', user_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}