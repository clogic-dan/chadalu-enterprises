'use client'

import { useState } from 'react'
import EquipmentCard from './EquipmentCard'
import { equipmentList, categories } from '@/lib/equipment-data'

export default function EquipmentGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredEquipment = selectedCategory === 'All'
    ? equipmentList
    : equipmentList.filter(e => e.category === selectedCategory)

  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#F2EBD9] mb-4">
            Our Equipment Fleet
          </h2>
          <p className="text-[#F2EBD9]/60 font-body max-w-2xl mx-auto">
            Professional construction equipment available for hire. 
            Book online 24/7 - no minimum duration.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#F2EBD9]/60 font-body">
              No equipment found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}