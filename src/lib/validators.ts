import { z } from 'zod'

export const equipmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  category_id: z.string().uuid().optional(),
  description: z.string().optional(),
  specs: z.record(z.any()).optional(),
  units_total: z.number().int().min(1).default(1),
  units_available: z.number().int().min(0).default(1),
  price_daily: z.number().positive('Price must be positive'),
  price_weekly: z.number().positive().optional(),
  price_monthly: z.number().positive().optional(),
  image_urls: z.array(z.string().url()).default([])
})

export const equipmentUpdateSchema = equipmentSchema.partial()

export const bookingItemSchema = z.object({
  equipment_id: z.string().uuid('Invalid equipment ID'),
  units: z.number().int().min(1).default(1),
  start_at: z.string().datetime(),
  expected_end_at: z.string().datetime()
})

export const bookingSchema = z.object({
  user_id: z.string().uuid().optional(),
  items: z.array(bookingItemSchema).min(1, 'At least one equipment required'),
  location_address: z.string().optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  notes: z.string().max(500).optional(),
  referred_by: z.string().optional(),
  discount_id: z.string().uuid().optional()
})

export const bookingUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'interrupted']).optional(),
  location_address: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  notes: z.string().optional(),
  discount_id: z.string().uuid().optional(),
  discount_amount: z.number().min(0).optional(),
  final_amount: z.number().min(0).optional()
})

export const cancelBookingSchema = z.object({
  cancel_reason: z.string().max(500).optional()
})

export const paymentSchema = z.object({
  booking_id: z.string().uuid(),
  amount_kes: z.number().positive(),
  mpesa_phone: z.string().regex(/^254[0-9]{9}$/, 'Invalid phone format')
})

export const expenseSchema = z.object({
  category_id: z.string().uuid().optional(),
  amount: z.number().positive(),
  description: z.string().max(500).optional(),
  equipment_id: z.string().uuid().optional(),
  date: z.string().date().optional(),
  recorded_by: z.string().uuid().optional()
})

export const discountSchema = z.object({
  code: z.string().min(3).max(50).to_uppercase(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive(),
  min_booking_amount: z.number().min(0).default(0),
  start_date: z.string().date(),
  end_date: z.string().date(),
  usage_limit: z.number().int().min(1).optional(),
  is_active: z.boolean().default(true)
})

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().regex(/^254[0-9]{9}$/, 'Invalid phone format'),
  avatar_url: z.string().url().optional()
})

export const userRoleSchema = z.object({
  role: z.enum(['client', 'admin'])
})

export const reviewSchema = z.object({
  booking_id: z.string().uuid(),
  user_id: z.string().uuid(),
  equipment_id: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional()
})

export const messageSchema = z.object({
  booking_id: z.string().uuid().optional(),
  sender_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  content: z.string().min(1).max(2000)
})

export const notificationSchema = z.object({
  user_id: z.string().uuid(),
  type: z.string().max(50),
  title: z.string().max(255),
  message: z.string().max(1000),
  data: z.record(z.any()).optional()
})

export const blockedTimeSchema = z.object({
  equipment_id: z.string().uuid(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  reason: z.string().max(500).optional()
})