import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params
  const body = await req.json()
  const { action } = body

  if (action === 'start') {
    const { data, error } = await supabase
      .from('booking_items')
      .update({ actual_start: new Date().toISOString() })
      .eq('id', itemId)
      .eq('booking_id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await supabase
      .from('bookings')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json(data)
  }

  if (action === 'complete') {
    const { data, error } = await supabase
      .from('booking_items')
      .update({ actual_end: new Date().toISOString() })
      .eq('id', itemId)
      .eq('booking_id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: allItems } = await supabase
      .from('booking_items')
      .select('actual_end')
      .eq('booking_id', id)

    const allCompleted = allItems?.every(item => item.actual_end !== null)

    if (allCompleted) {
      await supabase
        .from('bookings')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', id)
    }

    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}