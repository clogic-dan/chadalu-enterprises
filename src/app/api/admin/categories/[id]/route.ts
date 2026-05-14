import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin, serverError, successResponse, notFoundError } from '@/lib/api-utils'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  description: z.string().max(500).optional()
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck

  const { id } = await params
  const body = await req.json()
  const parsed = categorySchema.safeParse(body)
  if (!parsed.success) return serverError(parsed.error.errors[0].message)

  const { data, error } = await supabase
    .from('equipment_categories')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return serverError(error.message)
  if (!data) return notFoundError('Category')

  return successResponse(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck

  const { id } = await params

  const { data: equipment } = await supabase
    .from('equipment')
    .select('id')
    .eq('category_id', id)
    .limit(1)

  if (equipment?.length > 0) {
    return serverError('Cannot delete category with associated equipment')
  }

  const { error } = await supabase
    .from('equipment_categories')
    .delete()
    .eq('id', id)

  if (error) return serverError(error.message)
  return successResponse({ message: 'Category deleted' })
}