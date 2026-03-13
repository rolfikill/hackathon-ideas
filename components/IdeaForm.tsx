'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Feature', 'Tool', 'Process', 'Design', 'Sonstiges']

export default function IdeaForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('ideas')
      .insert({ title: title.trim(), description: description.trim(), category: category || null, user_id: userId })
      .select()
      .single()

    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push(`/ideas/${data.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
          Titel *
        </label>
        <input
          id="title"
          type="text"
          required
          maxLength={150}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Kurzer, prägnanter Titel"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
          Beschreibung *
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Was ist die Idee? Welches Problem löst sie?"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
          Kategorie
        </label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="">— Keine Kategorie —</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !title.trim() || !description.trim()}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Wird eingereicht…' : 'Idee einreichen'}
      </button>
    </form>
  )
}
