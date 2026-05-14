import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bookingId = searchParams.get('booking_id')
  const userId = searchParams.get('user_id')

  let query = supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id (id, name, avatar_url),
      receiver:users!receiver_id (id, name, avatar_url),
      booking:bookings (id)
    `)
    .order('created_at', { ascending: true })

  if (bookingId) {
    query = query.eq('booking_id', bookingId)
  }

  if (userId) {
    query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { booking_id, sender_id, receiver_id, content } = body

  const { data: message, error } = await supabase
    .from('messages')
    .insert([{
      booking_id,
      sender_id,
      receiver_id,
      content,
      read: false
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(message, { status: 201 })
}