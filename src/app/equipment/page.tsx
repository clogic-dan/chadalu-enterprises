'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EquipmentCard from '@/components/EquipmentCard'
import { equipmentList, categories } from '@/lib/equipment-data'

export default function EquipmentPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEquipment = equipmentList.filter(equipment => {
    const matchesCategory = selectedCategory === 'All' || equipment.category === selectedCategory
    const matchesSearch = equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#F2EBD9] mb-4">
              Our Equipment Fleet
            </h1>
            <p className="text-[#F2EBD9]/60 font-body max-w-2xl mx-auto">
              Professional construction equipment available for hire 24/7. 
              No minimum booking duration.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded font-condensed font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#C8922A] text-[#080808]'
                      : 'bg-[#121212] text-[#F2EBD9] hover:bg-[#C8922A]/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map(equipment => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#F2EBD9]/60 font-body">
                No equipment found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}