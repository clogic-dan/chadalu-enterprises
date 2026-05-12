'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { equipmentList } from '@/lib/equipment-data'
import { Equipment } from '@/types'

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    startTime: '',
    durationHours: 1,
    durationMinutes: 0,
    address: '',
    lat: -1.1432,
    lng: 37.0089,
    notes: '',
  })

  useEffect(() => {
    const equipmentSlug = searchParams.get('equipment')
    if (equipmentSlug) {
      const found = equipmentList.find(e => e.slug === equipmentSlug)
      if (found) setSelectedEquipment(found)
    }
  }, [searchParams])

  const handleEquipmentSelect = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setStep(2)
  }

  const calculateEndTime = () => {
    if (!bookingData.startDate || !bookingData.startTime) return ''
    const start = new Date(`${bookingData.startDate}T${bookingData.startTime}`)
    const totalMinutes = (bookingData.durationHours * 60) + bookingData.durationMinutes
    const end = new Date(start.getTime() + totalMinutes * 60000)
    const bufferedEnd = new Date(end.getTime() + 60 * 60000)
    return bufferedEnd.toISOString()
  }

  const handleSubmit = () => {
    // Demo: redirect to dashboard
    router.push('/dashboard?booking=success')
  }

  if (step === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-[#F2EBD9] mb-8 text-center">
          Select Equipment
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.filter(e => e.status === 'available').map(equipment => (
            <div
              key={equipment.id}
              onClick={() => handleEquipmentSelect(equipment)}
              className="bg-[#121212] rounded-lg overflow-hidden border border-[#C8922A]/10 hover:border-[#C8922A]/30 cursor-pointer transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-[#F2EBD9] mb-2">{equipment.name}</h3>
                <p className="text-[#C8922A] font-display font-bold">KES {equipment.pricePerDay}/day</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => setStep(1)} className="text-[#F2EBD9]/60 hover:text-[#C8922A] mb-6 font-body">
          ← Back to Equipment
        </button>

        <h1 className="text-3xl font-display font-bold text-[#F2EBD9] mb-8">
          Book {selectedEquipment?.name}
        </h1>

        <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={bookingData.startDate}
                onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Start Time</label>
              <input
                type="time"
                value={bookingData.startTime}
                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Duration (Hours)</label>
              <input
                type="number"
                min="0"
                value={bookingData.durationHours}
                onChange={(e) => setBookingData({ ...bookingData, durationHours: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Duration (Minutes)</label>
              <input
                type="number"
                min="0"
                max="59"
                value={bookingData.durationMinutes}
                onChange={(e) => setBookingData({ ...bookingData, durationMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!bookingData.startDate || !bookingData.startTime}
          className="w-full bg-[#C8922A] text-[#080808] py-4 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-colors disabled:opacity-50"
        >
          Continue to Location
        </button>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => setStep(2)} className="text-[#F2EBD9]/60 hover:text-[#C8922A] mb-6 font-body">
          ← Back
        </button>

        <h1 className="text-3xl font-display font-bold text-[#F2EBD9] mb-8">
          Set Location
        </h1>

        <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10 mb-8">
          <div className="mb-6">
            <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Delivery Address</label>
            <input
              type="text"
              value={bookingData.address}
              onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
              placeholder="Enter address or drop pin on map"
              className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
            />
          </div>

          <div className="bg-[#080808] rounded-lg h-64 flex items-center justify-center mb-6">
            <p className="text-[#F2EBD9]/40 font-body">Map will be integrated here (Leaflet.js)</p>
          </div>

          <div>
            <label className="block text-[#F2EBD9] font-condensed font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              placeholder="Any special instructions..."
              rows={3}
              className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => setStep(4)}
          disabled={!bookingData.address}
          className="w-full bg-[#C8922A] text-[#080808] py-4 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-colors disabled:opacity-50"
        >
          Review Booking
        </button>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => setStep(3)} className="text-[#F2EBD9]/60 hover:text-[#C8922A] mb-6 font-body">
          ← Back
        </button>

        <h1 className="text-3xl font-display font-bold text-[#F2EBD9] mb-8">
          Review Your Booking
        </h1>

        <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10 mb-8">
          <h3 className="font-display font-semibold text-[#C8922A] mb-4">Equipment</h3>
          <p className="text-[#F2EBD9] font-body text-lg">{selectedEquipment?.name}</p>

          <hr className="border-[#C8922A]/10 my-4" />

          <h3 className="font-display font-semibold text-[#C8922A] mb-4">Schedule</h3>
          <p className="text-[#F2EBD9] font-body">Start: {bookingData.startDate} at {bookingData.startTime}</p>
          <p className="text-[#F2EBD9] font-body">Duration: {bookingData.durationHours}h {bookingData.durationMinutes}m</p>
          <p className="text-[#F2EBD9]/60 font-body text-sm">+ 1-hour buffer after booking</p>

          <hr className="border-[#C8922A]/10 my-4" />

          <h3 className="font-display font-semibold text-[#C8922A] mb-4">Location</h3>
          <p className="text-[#F2EBD9] font-body">{bookingData.address}</p>
          {bookingData.notes && (
            <>
              <hr className="border-[#C8922A]/10 my-4" />
              <p className="text-[#F2EBD9]/60 font-body text-sm">Note: {bookingData.notes}</p>
            </>
          )}
        </div>

        <div className="bg-[#121212] rounded-lg p-6 border border-[#C8922A]/10 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-[#F2EBD9] font-body">Estimated Total</span>
            <span className="text-2xl font-display font-bold text-[#C8922A]">
              KES {((selectedEquipment?.pricePerHour || 0) * (bookingData.durationHours + bookingData.durationMinutes / 60)).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#C8922A] text-[#080808] py-4 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-colors"
        >
          Confirm Booking
        </button>

        <p className="text-center text-[#F2EBD9]/40 text-sm mt-4 font-body">
          Payment via M-Pesa after job completion
        </p>
      </div>
    )
  }

  return null
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-[#F2EBD9]">Loading...</div>}>
        <BookingContent />
      </Suspense>
      <Footer />
    </main>
  )
}