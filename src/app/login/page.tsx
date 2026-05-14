'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/app/auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn(formData.email, formData.password)
    if (result.error) {
      setError(result.error)
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
          <p className="text-[#F2EBD9]/60 font-body mt-2">Sign in to your account</p>
        </div>

        <div className="bg-[#121212] rounded-lg p-8 border border-[#C8922A]/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#B83030]/10 border border-[#B83030]/30 text-[#B83030] px-4 py-3 rounded font-body text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[#F2EBD9] font-condensed font-medium mb-2">
                Email
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
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-[#C8922A]/30 bg-[#080808] text-[#C8922A] focus:ring-[#C8922A]"
                />
                <span className="ml-2 text-[#F2EBD9]/60 font-body text-sm">Remember me</span>
              </label>
              <a href="#" className="text-[#C8922A] font-body text-sm hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8922A] text-[#080808] py-3 rounded font-condensed font-bold text-lg hover:bg-[#C8922A]/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#F2EBD9]/60 font-body">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#C8922A] hover:underline font-condensed font-medium">
                Sign up
              </Link>
            </p>
          </div>
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