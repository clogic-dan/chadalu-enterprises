'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Demo: simulate signup
      router.push('/dashboard')
    } catch (err) {
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-[#C8922A]">CHADALU</h1>
          </Link>
          <p className="text-[#F2EBD9]/60 font-body mt-2">Create your account</p>
        </div>

        <div className="bg-[#121212] rounded-lg p-8 border border-[#C8922A]/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#B83030]/10 border border-[#B83030]/30 text-[#B83030] px-4 py-3 rounded font-body text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-[#F2EBD9] font-condensed font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-[#F2EBD9] font-condensed font-medium mb-2">
                Phone Number (for M-Pesa)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none transition-colors"
                placeholder="+254 722 123 456"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#F2EBD9] font-condensed font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#F2EBD9] font-condensed font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none transition-colors"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[#F2EBD9] font-condensed font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 bg-[#080808] border border-[#C8922A]/20 rounded text-[#F2EBD9] font-body focus:border-[#C8922A] focus:outline-none transition-colors"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8922A] text-[#080808] py-3 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#F2EBD9]/60 font-body">
              Already have an account?{' '}
              <Link href="/login" className="text-[#C8922A] hover:underline font-condensed font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[#F2EBD9]/40 font-body text-xs">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#F2EBD9]/60 hover:text-[#C8922A] font-body text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}