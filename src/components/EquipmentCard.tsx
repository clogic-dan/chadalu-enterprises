import Link from 'next/link'
import { Equipment } from '@/types'

interface EquipmentCardProps {
  equipment: Equipment
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
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
    maintenance: 'Maintenance',
  }

  return (
    <div className="bg-[#121212] rounded-lg overflow-hidden border border-[#C8922A]/10 hover:border-[#C8922A]/30 transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-condensed font-semibold text-white ${statusColors[equipment.status]}`}>
            {statusLabels[equipment.status]}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-condensed font-semibold bg-[#080808]/70 text-[#F2EBD9]">
            {equipment.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-display font-semibold text-[#F2EBD9] mb-2 group-hover:text-[#C8922A] transition-colors">
          {equipment.name}
        </h3>
        <p className="text-sm text-[#F2EBD9]/60 font-body mb-4 line-clamp-2">
          {equipment.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {equipment.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-[#C8922A]/10 text-[#C8922A] rounded font-condensed">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-2xl font-display font-bold text-[#C8922A]">
              KES {equipment.pricePerDay.toLocaleString()}
            </span>
            <span className="text-sm text-[#F2EBD9]/60 font-body"> /day</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-[#F2EBD9]/60 font-body">
              {equipment.unitsAvailable} of {equipment.unitsTotal} available
            </span>
          </div>
        </div>

        <Link
          href={`/equipment/${equipment.slug}`}
          className="block w-full text-center bg-[#C8922A] text-[#080808] py-3 rounded font-condensed font-bold hover:bg-[#C8922A]/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}