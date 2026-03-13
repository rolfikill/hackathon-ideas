'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 hover:text-indigo-600 transition-colors">
          <span className="text-lg">💡</span>
          <span>Hackathon Ideas</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full truncate max-w-[160px]">
                {user.email}
              </span>
              <Link
                href="/ideas/new"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                + Idee
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
