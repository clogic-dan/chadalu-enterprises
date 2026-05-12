'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { RANKS } from '@/types'

interface Booking {
  id: string
  equipmentName: string
  startAt: string
  endAt: string
  status: string
  amount: number
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('booking') === 'success') {
      setBookingSuccess(true)
      setTimeout(() => setBookingSuccess(false), 5000)
    }
  }, [searchParams])

  const userStats = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254 722 123 456',
    rank: RANKS[2],
    totalBookings: 8,
    totalHours: 45,
    totalSpent: 125000,
    memberSince: 'January 2025',
  }

  const mockBookings: Booking[] = [
    { id: '1', equipmentName: 'Concrete Mixer (350L)', startAt: '2026-05-15 08:00', endAt: '2026-05-15 14:00', status: 'completed', amount: 4500 },
    { id: '2', equipmentName: 'Road Roller (2-Ton)', startAt: '2026-05-20 09:00', endAt: '2026-05-21 09:00', status: 'confirmed', amount: 17000 },
  ]

  const activeBookings = mockBookings.filter(b => ['confirmed', 'active'].includes(b.status))
  const pastBookings = mockBookings.filter(b => ['completed', 'cancelled'].includes(b.status))

  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      
      {bookingSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-[#2E9E6B] text-white px-6 py-3 rounded-lg font-body">
          Booking confirmed successfully!
        </div>
      )}

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#C8922A] flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-display font-bold text-[#080808]">
                      {userStats.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-[#F2EBD9]">{userStats.name}</h3>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-condensed font-semibold mt-2"
                    style={{ backgroundColor: userStats.rank.color + '20', color: userStats.rank.color }}
                  >
                    {userStats.rank.name}
                  </span>
                </div>
              </div>

              <nav className="bg-[#121212] rounded-lg border border-[#C8922A]/10">
                {['overview', 'bookings', 'payments', 'profile', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 font-condensed font-medium capitalize transition-colors ${
                      activeTab === tab 
                        ? 'bg-[#C8922A]/10 text-[#C8922A] border-l-2 border-[#C8922A]' 
                        : 'text-[#F2EBD9]/60 hover:text-[#F2EBD9]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <hr className="border-[#C8922A]/10" />
                <Link href="/login" className="block w-full text-left px-4 py-3 text-[#B83030] font-condensed font-medium hover:text-[#B83030]/80">
                  Log Out
                </Link>
              </nav>
            </div>

            <div className="flex-1">
              {activeTab === 'overview' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Dashboard Overview</h1>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Total Bookings</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">{userStats.totalBookings}</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Total Hours</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">{userStats.totalHours}</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Total Spent</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">KES {userStats.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Rank</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">{userStats.rank.name}</p>
                    </div>
                  </div>

                  {activeBookings.length > 0 && (
                    <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10">
                      <div className="p-4 border-b border-[#C8922A]/10">
                        <h3 className="font-display font-semibold text-[#F2EBD9]">Active Bookings</h3>
                      </div>
                      {activeBookings.map(booking => (
                        <div key={booking.id} className="p-4 border-b border-[#C8922A]/10 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-body text-[#F2EBD9]">{booking.equipmentName}</p>
                              <p className="text-sm text-[#F2EBD9]/60 font-body">{booking.startAt}</p>
                            </div>
                            <span className="px-3 py-1 bg-[#D45F12]/20 text-[#D45F12] rounded-full text-xs font-condensed font-semibold capitalize">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8">
                    <Link 
                      href="/equipment" 
                      className="inline-block bg-[#C8922A] text-[#080808] px-6 py-3 rounded font-condensed font-bold hover:bg-[#C8922A]/90 transition-colors"
                    >
                      Book New Equipment
                    </Link>
                  </div>
                </>
              )}

              {activeTab === 'bookings' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">My Bookings</h1>
                  <div className="space-y-4">
                    {mockBookings.map(booking => (
                      <div key={booking.id} className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-body text-[#F2EBD9]">{booking.equipmentName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-condensed font-semibold ${
                            booking.status === 'completed' ? 'bg-[#2E9E6B]/20 text-[#2E9E6B]' :
                            booking.status === 'confirmed' ? 'bg-[#C8922A]/20 text-[#C8922A]' :
                            'bg-[#9CA3AF]/20 text-[#9CA3AF]'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#F2EBD9]/60 font-body">{booking.startAt} - {booking.endAt}</p>
                        <p className="text-[#C8922A] font-display font-semibold mt-2">KES {booking.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'profile' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Edit Profile</h1>
                  <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Full Name</label>
                        <input type="text" defaultValue={userStats.name} className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body" />
                      </div>
                      <div>
                        <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Email</label>
                        <input type="email" defaultValue={userStats.email} className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body" />
                      </div>
                      <div>
                        <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Phone</label>
                        <input type="tel" defaultValue={userStats.phone} className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body" />
                      </div>
                      <button className="bg-[#C8922A] text-[#080808] px-6 py-3 rounded font-condensed font-bold hover:bg-[#C8922A]/90 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'payments' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Payment History</h1>
                  <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10">
                    {mockBookings.filter(b => b.status === 'completed').map(booking => (
                      <div key={booking.id} className="p-4 border-b border-[#C8922A]/10 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-body text-[#F2EBD9]">{booking.equipmentName}</p>
                            <p className="text-sm text-[#F2EBD9]/60 font-body">Completed</p>
                          </div>
                          <p className="font-display font-bold text-[#2E9E6B]">KES {booking.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'reviews' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">My Reviews</h1>
                  <p className="text-[#F2EBD9]/60 font-body">No reviews yet. Complete a booking to leave a review.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] flex items-center justify-center"><p className="text-[#F2EBD9]">Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  )
}