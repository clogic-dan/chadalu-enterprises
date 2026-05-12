export default function Features() {
  const features = [
    {
      icon: '🕐',
      title: '24/7 Availability',
      description: 'Book equipment any time, day or night. No restrictions on booking times.',
    },
    {
      icon: '⏱️',
      title: 'No Minimum Duration',
      description: 'Hire for as little as 10 minutes. Pay only for what you need.',
    },
    {
      icon: '📍',
      title: 'Location Picker',
      description: 'Pin your exact location on the map. We deliver to your site.',
    },
    {
      icon: '💳',
      title: 'M-Pesa Payments',
      description: 'Pay conveniently via M-Pesa after job completion.',
    },
    {
      icon: '📊',
      title: 'Client Dashboard',
      description: 'Track bookings, view history, and monitor your rank progress.',
    },
    {
      icon: '🔒',
      title: 'Real-time Availability',
      description: 'Double-booking prevention ensures you get what you book.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#F2EBD9] mb-4">
            Why Choose CHADALU?
          </h2>
          <p className="text-[#F2EBD9]/60 font-body max-w-2xl mx-auto">
            Modern equipment hire platform designed for Kenya's construction industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#121212] p-6 rounded-lg border border-[#C8922A]/10 hover:border-[#C8922A]/30 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-display font-semibold text-[#F2EBD9] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#F2EBD9]/60 font-body">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}