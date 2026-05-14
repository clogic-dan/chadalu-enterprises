import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin, successResponse, serverError } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  const authCheck = await requireAdmin(req)
  if (authCheck instanceof NextResponse) return authCheck

  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') || 'month'
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')

  let dateFilter = ''
  const now = new Date()
  
  if (period === 'day') {
    dateFilter = now.toISOString().split('T')[0]
  } else if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    dateFilter = weekAgo.toISOString().split('T')[0]
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    dateFilter = monthAgo.toISOString().split('T')[0]
  }

  const revenueQuery = supabase
    .from('payments')
    .select('amount_kes, created_at')
    .eq('status', 'completed')
    .gte('paid_at', dateFilter)

  const { data: payments } = await revenueQuery

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount_kes || 0), 0) || 0

  const bookingsQuery = supabase
    .from('bookings')
    .select('id, status, created_at, final_amount')
    .gte('created_at', dateFilter)

  const { data: bookings } = await bookingsQuery

  const stats = {
    totalRevenue,
    totalBookings: bookings?.length || 0,
    completedBookings: bookings?.filter(b => b.status === 'completed').length || 0,
    pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
    activeBookings: bookings?.filter(b => b.status === 'active').length || 0,
    cancelledBookings: bookings?.filter(b => b.status === 'cancelled').length || 0
  }

  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount, date')
    .gte('date', dateFilter)

  const totalExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

  const { data: topEquipment } = await supabase
    .from('booking_items')
    .select('equipment_id, equipment:equipment (id, name), count')
    .gte('created_at', dateFilter)
    .order('count', { ascending: false })
    .limit(5)

  const equipmentMap = new Map()
  topEquipment?.forEach(item => {
    const name = item.equipment?.name || 'Unknown'
    equipmentMap.set(name, (equipmentMap.get(name) || 0) + item.count)
  })

  const { data: topClients } = await supabase
    .from('bookings')
    .select('user:users (id, name, email), count')
    .gte('created_at', dateFilter)
    .order('count', { ascending: false })
    .limit(5)

  return successResponse({
    period,
    dateRange: { start: dateFilter, end: new Date().toISOString().split('T')[0] },
    revenue: {
      total: totalRevenue,
      profit: totalRevenue - totalExpenses
    },
    bookings: stats,
    expenses: totalExpenses,
    topEquipment: Array.from(equipmentMap.entries()).map(([name, count]) => ({ name, count })),
    topClients: topClients?.map(c => c.user).filter(Boolean) || []
  })
}