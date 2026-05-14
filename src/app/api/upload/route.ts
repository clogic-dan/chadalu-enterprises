import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin, successResponse, serverError, errorResponse } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck

  const formData = await req.formData()
  const file = formData.get('file') as File
  const folder = formData.get('folder') as string || 'equipment'

  if (!file) {
    return errorResponse('No file provided', 400)
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return errorResponse('Invalid file type. Only images allowed.', 400)
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return errorResponse('File too large. Max 5MB allowed.', 400)
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from('chadalu')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    })

  if (error) {
    return serverError(error.message)
  }

  const { data: urlData } = supabase.storage
    .from('chadalu')
    .getPublicUrl(filePath)

  return successResponse({
    path: urlData.publicUrl,
    name: fileName
  })
}