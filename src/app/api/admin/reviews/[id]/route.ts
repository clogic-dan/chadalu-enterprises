import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin, serverError, successResponse, errorResponse, notFoundError } from '@/lib/api-utils'
import { z } from 'zod'

const reviewActionSchema = z.object({
  action: z.enum(['approve', 'flag', 'hide', 'delete']),
  reason: z.string().max(500).optional()
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck

  const { id } = await params
  const body = await req.json()
  const parsed = reviewActionSchema.safeParse(body)
  if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 422)

  const { action, reason } = parsed.data

  const { data: review, error: fetchError } = await supabase
    .from('reviews')
    .select('*, user:users (id, name), equipment:equipment (id, name)')
    .eq('id', id)
    .single()

  if (fetchError || !review) return notFoundError('Review')

  if (action === 'delete') {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return serverError(error.message)
    return successResponse({ message: 'Review deleted' })
  }

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }

  if (action === 'approve') {
    updates.approved = true
    updates.flagged = false
  } else if (action === 'flag') {
    updates.flagged = true
  } else if (action === 'hide') {
    updates.approved = false
  }

  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return serverError(error.message)

  await supabase.from('notifications').insert([{
    user_id: review.user_id,
    type: action === 'approve' ? 'review_approved' : 'review_flagged',
    title: action === 'approve' ? 'Review Approved' : 'Review Flagged',
    message: action === 'approve' 
      ? 'Your review has been approved and is now visible.'
      : reason || 'Your review has been flagged for review.',
    read: false
  }])

  return successResponse(data)
}