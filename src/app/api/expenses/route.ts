import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const categoryId = searchParams.get('category_id')

  let query = supabase
    .from('expenses')
    .select(`
      *,
      category:expense_categories (id, name),
      equipment:equipment (id, name),
      user:users (id, name)
    `)
    .order('date', { ascending: false })

  if (startDate) {
    query = query.gte('date', startDate)
  }
  if (endDate) {
    query = query.lte('date', endDate)
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { category_id, amount, description, equipment_id, date } = body

  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      category_id,
      amount,
      description,
      equipment_id,
      date: date || new Date().toISOString().split('T')[0],
      recorded_by: body.recorded_by
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}