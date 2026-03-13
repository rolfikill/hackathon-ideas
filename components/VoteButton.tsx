'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface VoteButtonProps {
  ideaId: string
  initialCount: number
  initialVoted: boolean
  userId?: string
}

export default function VoteButton({ ideaId, initialCount, initialVoted, userId }: VoteButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(initialVoted)
  const [loading, setLoading] = useState(false)
  const [pop, setPop] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleVote() {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    setPop(true)
    setTimeout(() => setPop(false), 220)

    try {
      if (voted) {
        await supabase.from('votes').delete().match({ idea_id: ideaId, user_id: userId })
        setCount(c => c - 1)
        setVoted(false)
      } else {
        await supabase.from('votes').insert({ idea_id: ideaId, user_id: userId })
        setCount(c => c + 1)
        setVoted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex flex-col items-center justify-center gap-0.5 w-12 h-14 rounded-xl border-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
        voted
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
          : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50'
      } ${pop ? 'animate-pop' : ''}`}
      aria-label={voted ? 'Vote entfernen' : 'Upvote'}
    >
      <span className="text-base leading-none">{voted ? '▲' : '△'}</span>
      <span className="text-sm font-bold tabular-nums">{count}</span>
    </button>
  )
}
