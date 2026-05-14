import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all')

  let query = supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (all !== 'true') {
    const today = new Date().toISOString().split('T')[0]
    query = query
      .lte('start_date', today)
      .gte('end_date', today)
      .eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code, discount_type, discount_value, min_booking_amount, start_date, end_date, usage_limit, is_active } = body

  const { data, error } = await supabase
    .from('discounts')
    .insert([{
      code: code.toUpperCase(),
      discount_type,
      discount_value,
      min_booking_amount,
      start_date,
      end_date,
      usage_limit,
      is_active: is_active ?? true
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}