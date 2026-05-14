import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bookingId = searchParams.get('booking_id')
  const all = searchParams.get('all')

  let query = supabase
    .from('payments')
    .select(`
      *,
      booking:bookings (id, status, user:users (id, name, phone))
    `)
    .order('created_at', { ascending: false })

  if (bookingId) {
    query = query.eq('booking_id', bookingId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { booking_id, amount_kes, mpesa_phone } = body

  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      booking_id,
      amount_kes,
      mpesa_phone,
      status: 'initiated',
      triggered_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(payment, { status: 201 })
}