'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type UserProfile = {
  id: string
  name: string
  phone: string
  email: string
  role: 'client' | 'admin'
  avatar_url: string | null
  rank: number
  total_bookings: number
  total_spent_kes: number
  is_active: boolean
}

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (data: SignUpData) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>
}

interface SignUpData {
  name: string
  phone: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        fetchUserProfile(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchUserProfile(userId: string) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setUser(data as UserProfile)
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
  }

  async function signUp(data: SignUpData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Signup failed' }

    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: 'client',
    })

    if (profileError) return { error: profileError.message }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function updateProfile(data: Partial<UserProfile>) {
    if (!user) return { error: 'Not logged in' }
    const { error } = await supabase.from('users').update(data).eq('id', user.id)
    if (!error) setUser({ ...user, ...data })
    return { error: error?.message || null }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const RANK_NAMES = ['Rookie', 'Labourer', 'Builder', 'Foreman', 'Contractor', 'Site Boss']
export const RANK_COLORS = ['#9CA3AF', '#CD7F32', '#C0C0C0', '#FFD700', '#E5E4E2', '#FF0000']

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}