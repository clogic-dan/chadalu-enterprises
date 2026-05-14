import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const startAt = searchParams.get('start')
  const endAt = searchParams.get('end')

  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, name, units_total, units_available, status')
    .eq('id', id)
    .single()

  if (!equipment) {
    return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
  }

  if (equipment.status === 'maintenance' || equipment.status === 'inactive') {
    return NextResponse.json({
      available: false,
      reason: `Equipment is currently ${equipment.status}`,
      estimated_ready_at: equipment.status === 'maintenance' ? null : null
    })
  }

  if (startAt && endAt) {
    const { data: conflictingBookings } = await supabase
      .from('booking_items')
      .select(`
        id, units,
        bookings (status)
      `)
      .eq('equipment_id', id)
      .or(`start_at.lt.${endAt},buffered_end_at.gt.${startAt}`)
      .in('bookings.status', ['pending', 'confirmed', 'active'])

    const bookedUnits = conflictingBookings?.reduce((sum, item) => sum + item.units, 0) || 0
    const availableUnits = equipment.units_total - bookedUnits

    if (availableUnits <= 0) {
      const { data: nextAvailable } = await supabase
        .from('booking_items')
        .select('buffered_end_at')
        .eq('equipment_id', id)
        .gte('buffered_end_at', startAt)
        .order('buffered_end_at', { ascending: true })
        .limit(1)

      return NextResponse.json({
        available: false,
        reason: 'No units available for selected time',
        next_available_at: nextAvailable?.[0]?.buffered_end_at || null,
        units_total: equipment.units_total,
        units_available: 0
      })
    }

    const { data: blocked } = await supabase
      .from('blocked_times')
      .select('*')
      .eq('equipment_id', id)
      .or(`start_at.lt.${endAt},end_at.gt.${startAt}`)

    if (blocked && blocked.length > 0) {
      return NextResponse.json({
        available: false,
        reason: `Blocked by admin: ${blocked[0].reason}`,
        blocked_until: blocked[0].end_at
      })
    }

    return NextResponse.json({
      available: true,
      units_total: equipment.units_total,
      units_available: availableUnits
    })
  }

  return NextResponse.json({
    available: equipment.units_available > 0,
    units_total: equipment.units_total,
    units_available: equipment.units_available,
    status: equipment.status
  })
}