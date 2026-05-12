'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { equipmentList } from '@/lib/equipment-data'
import { Equipment } from '@/types'

export default function EquipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = params.slug as string
    const found = equipmentList.find(e => e.slug === slug)
    setEquipment(found || null)
    setLoading(false)
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808]">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-[#F2EBD9]">Loading...</p>
        </div>
      </main>
    )
  }

  if (!equipment) {
    return (
      <main className="min-h-screen bg-[#080808]">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-display text-[#F2EBD9] mb-4">Equipment Not Found</h1>
          <Link href="/equipment" className="text-[#C8922A] hover:underline">
            Back to Equipment
          </Link>
        </div>
      </main>
    )
  }

  const statusColors = {
    available: 'bg-[#2E9E6B]',
    in_use: 'bg-[#D45F12]',
    booked: 'bg-[#B83030]',
    maintenance: 'bg-[#9CA3AF]',
  }

  const statusLabels = {
    available: 'Available',
    in_use: 'In Use',
    booked: 'Booked',
    maintenance: 'Under Maintenance',
  }

  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/equipment" className="text-[#F2EBD9]/60 hover:text-[#C8922A] font-body">
              ← Back to Equipment
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden">
              <img
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-96 object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-condensed font-semibold text-white ${statusColors[equipment.status]}`}>
                  {statusLabels[equipment.status]}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-condensed font-semibold bg-[#121212] text-[#F2EBD9]">
                  {equipment.category}
                </span>
              </div>

              <h1 className="text-3xl font-display font-bold text-[#F2EBD9] mb-4">
                {equipment.name}
              </h1>

              <p className="text-[#F2EBD9]/70 font-body mb-6">
                {equipment.description}
              </p>

              <div className="bg-[#121212] rounded-lg p-6 mb-6 border border-[#C8922A]/10">
                <h3 className="text-lg font-display font-semibold text-[#F2EBD9] mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(equipment.specs).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[#F2EBD9]/40 text-sm font-body capitalize">{key}:</span>
                      <p className="text-[#F2EBD9] font-body">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {equipment.features.map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-[#C8922A]/10 text-[#C8922A] rounded text-sm font-condensed">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                  <span className="text-[#F2EBD9]/60 text-sm font-body">Per Hour</span>
                  <p className="text-2xl font-display font-bold text-[#C8922A]">
                    KES {equipment.pricePerHour.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#121212] rounded-lg p-4 border border-[#C8922A]/10">
                  <span className="text-[#F2EBD9]/60 text-sm font-body">Per Day</span>
                  <p className="text-2xl font-display font-bold text-[#C8922A]">
                    KES {equipment.pricePerDay.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-[#F2EBD9]/60 text-sm font-body mb-6">
                <span className="font-semibold">{equipment.unitsAvailable}</span> of{' '}
                <span className="font-semibold">{equipment.unitsTotal}</span> units available
              </div>

              {equipment.status === 'available' ? (
                <button
                  onClick={() => router.push(`/booking?equipment=${equipment.slug}`)}
                  className="w-full bg-[#C8922A] text-[#080808] py-4 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-colors"
                >
                  Book Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-[#9CA3AF] text-[#080808] py-4 rounded font-condensed font-bold text-lg cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}

              <p className="text-center text-[#F2EBD9]/40 text-sm mt-4 font-body">
                24/7 booking • No minimum duration • 1-hour buffer after booking
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}