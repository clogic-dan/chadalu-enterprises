import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#C8922A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-display font-bold text-[#C8922A] mb-4">
              CHADALU Enterprises
            </h3>
            <p className="text-[#F2EBD9]/60 font-body mb-4 max-w-md">
              Professional building equipment hire services in Ruiru, Kiambu County, Kenya. 
              Quality machinery for your construction needs.
            </p>
            <div className="flex items-center space-x-4">
              <a href="tel:+254722995675" className="text-[#F2EBD9]/80 hover:text-[#C8922A] transition-colors">
                +254 722 995 675
              </a>
              <a href="https://wa.me/254722995675" className="text-[#F2EBD9]/80 hover:text-[#C8922A] transition-colors">
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#F2EBD9] font-condensed font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  Equipment
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F2EBD9] font-condensed font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/equipment" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  Equipment Hire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#F2EBD9]/60 hover:text-[#C8922A] transition-colors font-body">
                  Maintenance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#C8922A]/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#F2EBD9]/40 text-sm font-body">
            &copy; {new Date().getFullYear()} CHADALU Enterprises. All rights reserved.
          </p>
          <p className="text-[#F2EBD9]/40 text-sm font-body mt-2 md:mt-0">
            Kimbo Shopping Centre, Ruiru, Kiambu County, Kenya
          </p>
        </div>
      </div>
    </footer>
  )
}