import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const equipmentId = searchParams.get('equipment_id')

  let query = supabase
    .from('blocked_times')
    .select(`
      *,
      equipment:equipment (id, name, slug)
    `)
    .order('start_at', { ascending: false })

  if (equipmentId) {
    query = query.eq('equipment_id', equipmentId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { equipment_id, start_at, end_at, reason } = body

  const { data, error } = await supabase
    .from('blocked_times')
    .insert([{
      equipment_id,
      start_at,
      end_at,
      reason
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}