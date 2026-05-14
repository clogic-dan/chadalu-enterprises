import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin, serverError, successResponse, errorResponse, validationError } from '@/lib/api-utils'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(50).optional(),
  description: z.string().max(500).optional()
})

export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('equipment_categories')
    .select('*')
    .order('name')

  if (error) return serverError(error.message)
  return successResponse(data)
}

export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck

  const body = await req.json()
  const parsed = categorySchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { data, error } = await supabase
    .from('equipment_categories')
    .insert([parsed.data])
    .select()
    .single()

  if (error) return serverError(error.message)
  return successResponse(data, 201)
}