import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  const all = searchParams.get('all')

  let query = supabase
    .from('bookings')
    .select(`
      *,
      user:users (id, name, phone, email),
      booking_items (
        *,
        equipment:equipment (id, name, slug, image_urls)
      ),
      payments (id, amount_kes, status, paid_at)
    `)
    .order('created_at', { ascending: false })

  if (all === 'true') {
    // Admin - return all bookings
  } else if (userId) {
    // Filter by user
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { user_id, items, location_address, location_lat, location_lng, notes, referred_by } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No equipment items selected' }, { status: 400 })
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([{
      user_id,
      status: 'pending',
      location_address,
      location_lat,
      location_lng,
      notes,
      referred_by,
      discount_amount: 0,
      final_amount: 0
    }])
    .select()
    .single()

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  let totalAmount = 0
  const bookingItems = []

  for (const item of items) {
    const { data: equipment } = await supabase
      .from('equipment')
      .select('price_daily')
      .eq('id', item.equipment_id)
      .single()

    const pricePerUnit = equipment?.price_daily || 0
    const totalPrice = pricePerUnit * item.units
    totalAmount += totalPrice

    const startAt = new Date(item.start_at)
    const endAt = new Date(item.expected_end_at)
    const hours = (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60)
    const bufferEnd = new Date(endAt.getTime() + (60 * 60 * 1000))

    bookingItems.push({
      booking_id: booking.id,
      equipment_id: item.equipment_id,
      units: item.units,
      start_at: item.start_at,
      expected_end_at: item.expected_end_at,
      buffered_end_at: bufferEnd.toISOString(),
      price_per_unit: pricePerUnit,
      total_price: totalPrice
    })
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('booking_items')
    .insert(bookingItems)
    .select()

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  await supabase
    .from('bookings')
    .update({ total_amount: totalAmount, final_amount: totalAmount })
    .eq('id', booking.id)

  const { data: finalBooking } = await supabase
    .from('bookings')
    .select(`
      *,
      booking_items (*),
      user:users (id, name, phone, email)
    `)
    .eq('id', booking.id)
    .single()

  return NextResponse.json(finalBooking, { status: 201 })
}