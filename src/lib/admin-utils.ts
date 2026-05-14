import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { serverError, unauthorizedError, forbiddenError, successResponse, errorResponse } from './api-utils'

export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) return null
  
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return userData
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) return unauthorizedError('Authentication required')
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) return unauthorizedError('Authentication required')
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return forbiddenError('Admin access required')
  }
  return user
}

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getUserFromRequest(request)
  return user?.role === 'admin' || user?.role === 'super_admin'
}