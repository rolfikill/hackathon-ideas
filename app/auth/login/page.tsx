'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Bestätigungs-E-Mail gesendet! Bitte prüfe deinen Posteingang.' })
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === 'login' ? 'Einloggen um Ideen einzureichen und zu voten.' : 'Erstelle ein Konto um mitzumachen.'}
        </p>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${
            message.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Bitte warten…' : mode === 'login' ? 'Einloggen' : 'Registrieren'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          {mode === 'login' ? 'Noch kein Konto? ' : 'Bereits registriert? '}
          <button
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setMessage(null) }}
            className="text-indigo-600 hover:underline font-medium"
          >
            {mode === 'login' ? 'Registrieren' : 'Einloggen'}
          </button>
        </p>
      </div>
    </div>
  )
}
