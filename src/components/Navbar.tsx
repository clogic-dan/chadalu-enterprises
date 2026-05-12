'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#080808]/95 backdrop-blur-sm border-b border-[#C8922A]/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-display font-bold text-[#C8922A]">
              CHADALU
            </span>
            <span className="text-sm md:text-base font-body text-[#F2EBD9]/60 ml-1 hidden sm:inline">
              Enterprises
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#F2EBD9] hover:text-[#C8922A] transition-colors font-body">
              Home
            </Link>
            <Link href="/equipment" className="text-[#F2EBD9] hover:text-[#C8922A] transition-colors font-body">
              Equipment
            </Link>
            <Link href="/about" className="text-[#F2EBD9] hover:text-[#C8922A] transition-colors font-body">
              About
            </Link>
            <Link href="/contact" className="text-[#F2EBD9] hover:text-[#C8922A] transition-colors font-body">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-[#F2EBD9] hover:text-[#C8922A] transition-colors font-condensed font-medium">
              Log In
            </Link>
            <Link href="/signup" className="bg-[#C8922A] text-[#080808] px-4 py-2 rounded font-condensed font-semibold hover:bg-[#C8922A]/90 transition-colors">
              Sign Up
            </Link>
          </div>

          <button
            className="md:hidden text-[#F2EBD9] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#C8922A]/20">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-[#F2EBD9] hover:text-[#C8922A] font-body" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/equipment" className="text-[#F2EBD9] hover:text-[#C8922A] font-body" onClick={() => setMenuOpen(false)}>
                Equipment
              </Link>
              <Link href="/about" className="text-[#F2EBD9] hover:text-[#C8922A] font-body" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-[#F2EBD9] hover:text-[#C8922A] font-body" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/login" className="text-[#F2EBD9] hover:text-[#C8922A] font-condensed font-medium">
                  Log In
                </Link>
                <Link href="/signup" className="bg-[#C8922A] text-[#080808] px-4 py-2 rounded text-center font-condensed font-semibold">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}