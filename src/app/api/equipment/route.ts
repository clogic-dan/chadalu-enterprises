import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('equipment')
    .select(`
      *,
      equipment_categories (id, name, icon, description)
    `)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('equipment')
    .insert([{
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      category_id: body.category_id,
      description: body.description,
      specs: body.specs || {},
      units_total: body.units_total || 1,
      units_available: body.units_available || 1,
      price_daily: body.price_daily,
      price_weekly: body.price_weekly,
      price_monthly: body.price_monthly,
      status: 'available',
      image_urls: body.image_urls || []
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}