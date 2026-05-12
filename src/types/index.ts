export interface Equipment {
  id: string
  name: string
  slug: string
  category: string
  description: string
  specs: Record<string, string>
  unitsTotal: number
  unitsAvailable: number
  pricePerHour: number
  pricePerDay: number
  image: string
  status: 'available' | 'in_use' | 'booked' | 'maintenance'
  features: string[]
}

export interface User {
  id: string
  name: string
  phone: string
  email: string
  role: 'client' | 'admin'
  avatarUrl?: string
  rank?: string
  totalBookings?: number
  totalSpent?: number
  createdAt: string
}

export interface Booking {
  id: string
  userId: string
  equipmentId: string
  equipmentName: string
  startAt: string
  expectedDurationMins: number
  expectedEndAt: string
  bufferedEndAt: string
  locationAddress: string
  lat: number
  lng: number
  notes?: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'interrupted'
  cancelReason?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amountKes: number
  mpesaPhone: string
  mpesaReceiptCode?: string
  status: 'pending' | 'paid' | 'failed'
  triggeredAt?: string
  paidAt?: string
}

export interface Review {
  id: string
  bookingId: string
  userId: string
  userName: string
  equipmentId: string
  equipmentName: string
  stars: number
  comment?: string
  rank?: string
  createdAt: string
}

export interface Rank {
  name: string
  color: string
  minBookings: number
}

export const RANKS: Rank[] = [
  { name: 'Rookie', color: '#9CA3AF', minBookings: 0 },
  { name: 'Labourer', color: '#CD7F32', minBookings: 2 },
  { name: 'Builder', color: '#C0C0C0', minBookings: 6 },
  { name: 'Foreman', color: '#FFD700', minBookings: 15 },
  { name: 'Contractor', color: '#E5E4E2', minBookings: 30 },
  { name: 'Site Boss', color: '#E0115F', minBookings: 60 },
]