import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          password_hash: string | null
          role: 'client' | 'admin' | 'super_admin'
          avatar_url: string | null
          rank: number
          total_bookings: number
          total_spent_kes: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      equipment: {
        Row: {
          id: string
          name: string
          slug: string
          category_id: string | null
          description: string | null
          specs: Record<string, any>
          units_total: number
          units_available: number
          price_daily: number
          price_weekly: number | null
          price_monthly: number | null
          status: 'available' | 'in_use' | 'booked' | 'maintenance' | 'inactive'
          maintenance_note: string | null
          estimated_ready_at: string | null
          image_urls: string[]
          created_at: string
          updated_at: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'interrupted'
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          total_amount: number
          discount_id: string | null
          discount_amount: number
          final_amount: number
          cancel_reason: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
        }
      }
      booking_items: {
        Row: {
          id: string
          booking_id: string
          equipment_id: string
          units: number
          start_at: string
          expected_end_at: string
          buffered_end_at: string
          actual_start: string | null
          actual_end: string | null
          price_per_unit: number
          total_price: number
          created_at: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string | null
          amount_kes: number
          mpesa_phone: string | null
          mpesa_receipt_code: string | null
          status: 'pending' | 'initiated' | 'completed' | 'failed' | 'refunded'
          triggered_at: string | null
          paid_at: string | null
          created_at: string
        }
      }
      expenses: {
        Row: {
          id: string
          category_id: string | null
          amount: number
          description: string | null
          equipment_id: string | null
          booking_id: string | null
          date: string
          recorded_by: string | null
          created_at: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string | null
          user_id: string | null
          equipment_id: string | null
          stars: number
          comment: string | null
          flagged: boolean
          approved: boolean
          created_at: string
          updated_at: string
        }
      }
      messages: {
        Row: {
          id: string
          booking_id: string | null
          sender_id: string | null
          receiver_id: string | null
          content: string
          read: boolean
          created_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title: string
          message: string
          data: Record<string, any>
          read: boolean
          created_at: string
        }
      }
    }
  }
}