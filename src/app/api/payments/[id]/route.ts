import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      booking:bookings (id, status, user:users (id, name, phone, email))
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from('payments')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (body.status === 'completed') {
    await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', data.booking_id)
  }

  return NextResponse.json(data)
}