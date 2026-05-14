import { NextResponse } from 'next/server'
import { z } from 'zod'

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function notFoundError(resource = 'Resource') {
  return errorResponse(`${resource} not found`, 404)
}

export function unauthorizedError(message = 'Unauthorized') {
  return errorResponse(message, 401)
}

export function forbiddenError(message = 'Forbidden') {
  return errorResponse(message, 403)
}

export function validationError(errors: z.ZodError) {
  return NextResponse.json(
    { success: false, error: 'Validation failed', details: errors.flatten().fieldErrors },
    { status: 422 }
  )
}

export function serverError(message = 'Internal server error') {
  return errorResponse(message, 500)
}

export async function getJsonBody<T extends z.ZodType>(schema: T, request: Request): Promise<z.infer<T>> {
  const body = await request.json()
  return schema.parse(body)
}

export function parseSearchParams(request: Request) {
  const { searchParams } = new URL(request.url)
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
  }
}