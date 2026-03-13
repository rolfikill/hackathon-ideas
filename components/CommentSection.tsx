'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Comment } from '@/types'
import Link from 'next/link'

interface CommentSectionProps {
  ideaId: string
  initialComments: Comment[]
  userId?: string
}

export default function CommentSection({ ideaId, initialComments, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !userId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({ idea_id: ideaId, user_id: userId, content: content.trim() })
      .select()
      .single()

    setLoading(false)
    if (!error && data) {
      setComments(prev => [...prev, data])
      setContent('')
    }
  }

  async function handleDelete(commentId: string) {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Kommentare ({comments.length})
      </h2>

      <div className="space-y-3 mb-6">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">Noch keine Kommentare. Sei der Erste!</p>
        )}
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-gray-800 flex-1">{comment.content}</p>
              {userId === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Kommentar löschen"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              <span suppressHydrationWarning>{new Date(comment.created_at).toLocaleString('de-DE')}</span>
            </p>
          </div>
        ))}
      </div>

      {userId ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Kommentar schreiben…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            Senden
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          <Link href="/auth/login" className="text-indigo-600 hover:underline">Einloggen</Link>
          {' '}um zu kommentieren.
        </p>
      )}
    </div>
  )
}
