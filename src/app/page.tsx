import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import EquipmentGrid from '@/components/EquipmentGrid'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808]">
      <Navbar />
      <Hero />
      <Features />
      <EquipmentGrid />
      <Footer />
    </main>
  )
}