import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/40 to-[#080808] z-10" />
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920')] bg-cover bg-center" />
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-[#F2EBD9] mb-6">
          Building Equipment
          <span className="block text-[#C8922A]">Hire Made Easy</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-[#F2EBD9]/70 font-body mb-8 max-w-2xl mx-auto">
          Professional construction equipment hire in Ruiru, Kiambu County. 
          Road rollers, concrete mixers, vibrators, and more - available 24/7.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/equipment" 
            className="bg-[#C8922A] text-[#080808] px-8 py-4 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-all transform hover:scale-105"
          >
            Browse Equipment
          </Link>
          <Link 
            href="/contact" 
            className="border-2 border-[#C8922A] text-[#C8922A] px-8 py-4 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-[#C8922A]">7+</div>
            <div className="text-sm text-[#F2EBD9]/60 font-body">Equipment Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-[#C8922A]">24/7</div>
            <div className="text-sm text-[#F2EBD9]/60 font-body">Availability</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-[#C8922A]">0</div>
            <div className="text-sm text-[#F2EBD9]/60 font-body">Min Booking</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-[#C8922A]">KES</div>
            <div className="text-sm text-[#F2EBD9]/60 font-body">No Delivery Fee</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-6 h-6 text-[#C8922A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}