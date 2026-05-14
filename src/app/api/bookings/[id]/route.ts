import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      user:users (id, name, phone, email),
      booking_items (
        *,
        equipment:equipment (id, name, slug, image_urls, price_daily)
      ),
      payments (id, amount_kes, status, mpesa_receipt_code, paid_at)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const allowedFields = ['status', 'location_address', 'location_lat', 'location_lng', 'notes', 'discount_id', 'discount_amount', 'final_amount']
  const updateData: Record<string, any> = {}

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  }

  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const reason = body.cancel_reason || 'No reason provided'

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancel_reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}