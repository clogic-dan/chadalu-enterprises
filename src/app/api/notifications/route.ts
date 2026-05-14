import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  const unread = searchParams.get('unread')

  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (unread === 'true') {
    query = query.eq('read', false)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { user_id, type, title, message, data: notificationData } = body

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert([{
      user_id,
      type,
      title,
      message,
      data: notificationData || {},
      read: false
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(notification, { status: 201 })
}