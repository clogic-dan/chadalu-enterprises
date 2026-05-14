import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin, serverError, unauthorizedError, forbiddenError, successResponse, errorResponse, notFoundError, validationError } from '@/lib/api-utils'
import { z } from 'zod'

const banUserSchema = z.object({
  is_active: z.boolean(),
  ban_reason: z.string().max(500).optional()
})

const updateRoleSchema = z.object({
  role: z.enum(['client', 'admin', 'super_admin'])
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck
  
  const { id } = await params
  const body = await req.json()

  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !user) {
    return notFoundError('User')
  }

  if (body.is_active !== undefined) {
    const parsed = banUserSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        is_active: body.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return serverError(error.message)
    
    await supabase.from('notifications').insert([{
      user_id: id,
      type: body.is_active ? 'account_unbanned' : 'account_banned',
      title: body.is_active ? 'Account Unbanned' : 'Account Banned',
      message: body.ban_reason || (body.is_active ? 'Your account has been restored.' : 'Your account has been suspended.'),
      read: false
    }])
    
    return successResponse(data)
  }

  if (body.role) {
    const parsed = updateRoleSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    if (authCheck.role !== 'super_admin' && body.role === 'super_admin') {
      return forbiddenError('Only super_admin can assign super_admin role')
    }

    const { data, error } = await supabase
      .from('users')
      .update({ 
        role: body.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return serverError(error.message)
    return successResponse(data)
  }

  const allowedFields = ['name', 'phone', 'avatar_url']
  const updateData: Record<string, any> = {}
  
  for (const field of allowedFields) {
    if (body[field] !== undefined) updateData[field] = body[field]
  }
  
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) return serverError(error.message)
  return successResponse(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck
  
  const { id } = await params

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) return serverError(error.message)
  
  return successResponse({ message: 'User deleted successfully' })
}