import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const equipmentId = searchParams.get('equipment_id')
  const pending = searchParams.get('pending')

  let query = supabase
    .from('reviews')
    .select(`
      *,
      user:users (id, name, avatar_url),
      equipment:equipment (id, name)
    `)
    .order('created_at', { ascending: false })

  if (equipmentId) {
    query = query.eq('equipment_id', equipmentId)
  }

  if (pending === 'true') {
    query = query.eq('approved', false)
  } else {
    query = query.eq('approved', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { booking_id, user_id, equipment_id, stars, comment } = body

  const { data: review, error } = await supabase
    .from('reviews')
    .insert([{
      booking_id,
      user_id,
      equipment_id,
      stars,
      comment,
      flagged: false,
      approved: false
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(review, { status: 201 })
}