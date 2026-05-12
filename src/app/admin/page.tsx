'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    todayBookings: 5,
    weekBookings: 28,
    monthBookings: 112,
    todayRevenue: 42500,
    weekRevenue: 245000,
    monthRevenue: 890000,
    totalRevenue: 2450000,
    activeSessions: 3,
    machinesInUse: 4,
    machinesAvailable: 3,
    machinesMaintenance: 1,
  }

  const mockBookings = [
    { id: '1', client: 'John Doe', equipment: 'Road Roller', start: '2026-05-12 08:00', status: 'active', amount: 8500 },
    { id: '2', client: 'Jane Smith', equipment: 'Concrete Mixer', start: '2026-05-12 10:00', status: 'confirmed', amount: 4500 },
    { id: '3', client: 'Bob Wilson', equipment: 'Water Pump', start: '2026-05-13 09:00', status: 'pending', amount: 2200 },
    { id: '4', client: 'Alice Brown', equipment: 'Skip Hoist', start: '2026-05-11 14:00', status: 'completed', amount: 12000 },
  ]

  const mockEquipment = [
    { id: '1', name: 'Road Roller (2-Ton)', status: 'in_use', units: '1/1' },
    { id: '2', name: 'Concrete Vibrator', status: 'available', units: '1/1' },
    { id: '3', name: 'Concrete Mixer (350L)', status: 'in_use', units: '1/2' },
    { id: '4', name: 'Skip Hoist', status: 'available', units: '1/1' },
    { id: '5', name: 'Water Pump (3")', status: 'maintenance', units: '0/1' },
    { id: '6', name: 'Shovel', status: 'available', units: '10/10' },
    { id: '7', name: 'Bucket', status: 'available', units: '10/10' },
  ]

  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C8922A] flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-display font-bold text-[#080808]">A</span>
                  </div>
                  <h3 className="font-display font-semibold text-[#F2EBD9]">Admin</h3>
                  <p className="text-xs text-[#F2EBD9]/60 font-body">CHADALU Enterprises</p>
                </div>
              </div>

              <nav className="bg-[#121212] rounded-lg border border-[#C8922A]/10">
                {[
                  { id: 'overview', label: '📊 Overview' },
                  { id: 'bookings', label: '📅 Bookings' },
                  { id: 'equipment', label: '🚜 Equipment' },
                  { id: 'payments', label: '💳 Payments' },
                  { id: 'users', label: '👥 Users' },
                  { id: 'reviews', label: '⭐ Reviews' },
                  { id: 'analytics', label: '📈 Analytics' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 font-condensed font-medium transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-[#C8922A]/10 text-[#C8922A] border-l-2 border-[#C8922A]' 
                        : 'text-[#F2EBD9]/60 hover:text-[#F2EBD9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <hr className="border-[#C8922A]/10" />
                <Link href="/login" className="block w-full text-left px-4 py-3 text-[#B83030] font-condensed font-medium">
                  Log Out
                </Link>
              </nav>
            </div>

            <div className="flex-1">
              {activeTab === 'overview' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Admin Dashboard</h1>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Today's Bookings</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">{stats.todayBookings}</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Active Sessions</span>
                      <p className="text-2xl font-display font-bold text-[#2E9E6B]">{stats.activeSessions}</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Today's Revenue</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">KES {stats.todayRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                      <span className="text-[#F2EBD9]/60 text-sm font-body">Total Revenue</span>
                      <p className="text-2xl font-display font-bold text-[#C8922A]">KES {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10 text-center">
                      <span className="text-[#2E9E6B] text-3xl font-display font-bold">{stats.machinesAvailable}</span>
                      <p className="text-[#F2EBD9]/60 text-sm font-body">Available</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10 text-center">
                      <span className="text-[#D45F12] text-3xl font-display font-bold">{stats.machinesInUse}</span>
                      <p className="text-[#F2EBD9]/60 text-sm font-body">In Use</p>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10 text-center">
                      <span className="text-[#9CA3AF] text-3xl font-display font-bold">{stats.machinesMaintenance}</span>
                      <p className="text-[#F2EBD9]/60 text-sm font-body">Maintenance</p>
                    </div>
                  </div>

                  <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10">
                    <div className="p-4 border-b border-[#C8922A]/10">
                      <h3 className="font-display font-semibold text-[#F2EBD9]">Recent Bookings</h3>
                    </div>
                    {mockBookings.slice(0, 5).map(booking => (
                      <div key={booking.id} className="p-4 border-b border-[#C8922A]/10 last:border-b-0 flex justify-between items-center">
                        <div>
                          <p className="font-body text-[#F2EBD9]">{booking.client} - {booking.equipment}</p>
                          <p className="text-sm text-[#F2EBD9]/60 font-body">{booking.start}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-condensed font-semibold ${
                            booking.status === 'active' ? 'bg-[#2E9E6B]/20 text-[#2E9E6B]' :
                            booking.status === 'confirmed' ? 'bg-[#C8922A]/20 text-[#C8922A]' :
                            booking.status === 'completed' ? 'bg-[#9CA3AF]/20 text-[#9CA3AF]' :
                            'bg-[#D45F12]/20 text-[#D45F12]'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'bookings' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Booking Manager</h1>
                  <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#0a0a0a]">
                        <tr>
                          <th className="px-4 py-3 text-left text-[#F2EBD9]/60 font-condensed font-medium">Client</th>
                          <th className="px-4 py-3 text-left text-[#F2EBD9]/60 font-condensed font-medium">Equipment</th>
                          <th className="px-4 py-3 text-left text-[#F2EBD9]/60 font-condensed font-medium">Start</th>
                          <th className="px-4 py-3 text-left text-[#F2EBD9]/60 font-condensed font-medium">Status</th>
                          <th className="px-4 py-3 text-left text-[#F2EBD9]/60 font-condensed font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookings.map(booking => (
                          <tr key={booking.id} className="border-t border-[#C8922A]/10">
                            <td className="px-4 py-3 text-[#F2EBD9] font-body">{booking.client}</td>
                            <td className="px-4 py-3 text-[#F2EBD9] font-body">{booking.equipment}</td>
                            <td className="px-4 py-3 text-[#F2EBD9] font-body">{booking.start}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-condensed font-semibold ${
                                booking.status === 'active' ? 'bg-[#2E9E6B]/20 text-[#2E9E6B]' :
                                booking.status === 'confirmed' ? 'bg-[#C8922A]/20 text-[#C8922A]' :
                                'bg-[#9CA3AF]/20 text-[#9CA3AF]'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-[#C8922A] hover:underline text-sm font-condensed">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'equipment' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Equipment Manager</h1>
                  <div className="grid gap-4">
                    {mockEquipment.map(item => (
                      <div key={item.id} className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10 flex justify-between items-center">
                        <div>
                          <h3 className="font-body text-[#F2EBD9]">{item.name}</h3>
                          <p className="text-sm text-[#F2EBD9]/60 font-body">{item.units} units</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-condensed font-semibold ${
                            item.status === 'available' ? 'bg-[#2E9E6B]/20 text-[#2E9E6B]' :
                            item.status === 'in_use' ? 'bg-[#D45F12]/20 text-[#D45F12]' :
                            'bg-[#9CA3AF]/20 text-[#9CA3AF]'
                          }`}>
                            {item.status === 'in_use' ? 'In Use' : item.status === 'maintenance' ? 'Maintenance' : 'Available'}
                          </span>
                          <button className="text-[#C8922A] hover:underline text-sm font-condensed">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'payments' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Payment Manager</h1>
                  <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10 p-6 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-display font-bold text-[#2E9E6B]">KES 125,000</p>
                        <p className="text-sm text-[#F2EBD9]/60 font-body">Paid</p>
                      </div>
                      <div>
                        <p className="text-2xl font-display font-bold text-[#D45F12]">KES 45,000</p>
                        <p className="text-sm text-[#F2EBD9]/60 font-body">Pending</p>
                      </div>
                      <div>
                        <p className="text-2xl font-display font-bold text-[#B83030]">KES 12,000</p>
                        <p className="text-sm text-[#F2EBD9]/60 font-body">Failed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10">
                    {mockBookings.filter(b => b.status === 'completed').map(booking => (
                      <div key={booking.id} className="p-4 border-b border-[#C8922A]/10 last:border-b-0 flex justify-between items-center">
                        <div>
                          <p className="font-body text-[#F2EBD9]">{booking.client}</p>
                          <p className="text-sm text-[#F2EBD9]/60 font-body">{booking.equipment}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-[#2E9E6B]">KES {booking.amount.toLocaleString()}</p>
                          <p className="text-xs text-[#2E9E6B]">Paid via M-Pesa</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'users' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">User Manager</h1>
                  <div className="space-y-4">
                    {['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'].map((user, i) => (
                      <div key={i} className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10 flex justify-between items-center">
                        <div>
                          <p className="font-body text-[#F2EBD9]">{user}</p>
                          <p className="text-sm text-[#F2EBD9]/60 font-body">+254 722 123 45{i + 1}</p>
                        </div>
                        <span className="px-3 py-1 bg-[#C8922A]/20 text-[#C8922A] rounded-full text-xs font-condensed font-semibold">
                          {['Rookie', 'Labourer', 'Builder', 'Foreman', 'Contracter'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'reviews' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Review Manager</h1>
                  <p className="text-[#F2EBD9]/60 font-body">No reviews pending approval.</p>
                </>
              )}

              {activeTab === 'analytics' && (
                <>
                  <h1 className="text-2xl font-display font-bold text-[#F2EBD9] mb-6">Analytics</h1>
                  <div className="bg-[#121212] rounded-lg border border-[#C8922A]/10 p-8 text-center">
                    <p className="text-[#F2EBD9]/40 font-body">Charts will be integrated here (Chart.js)</p>
                    <p className="text-[#F2EBD9]/40 font-body text-sm mt-2">Revenue trends, booking stats, machine utilization</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}