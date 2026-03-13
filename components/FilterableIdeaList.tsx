'use client'

import { useState, useMemo } from 'react'
import IdeaCard from './IdeaCard'
import { Idea } from '@/types'
import Link from 'next/link'

type Filter = 'all' | 'trending' | 'new'
type Sort = 'votes' | 'recent' | 'comments'

interface EnrichedIdea extends Idea {
  vote_count: number
  comment_count: number
  user_has_voted: boolean
}

interface Props {
  ideas: EnrichedIdea[]
  userId?: string
}

const FILTERS: { id: Filter; label: string; icon: string }[] = [
  { id: 'all', label: 'Alle', icon: '⚡' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'new', label: 'Neu', icon: '🚀' },
]

const SORTS: { id: Sort; label: string }[] = [
  { id: 'votes', label: 'Meiste Votes' },
  { id: 'recent', label: 'Neueste' },
  { id: 'comments', label: 'Meiste Kommentare' },
]

export default function FilterableIdeaList({ ideas, userId }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('votes')
  const [search, setSearch] = useState('')

  const now = Date.now()

  const sortedByVotes = useMemo(
    () => [...ideas].sort((a, b) => b.vote_count - a.vote_count),
    [ideas]
  )

  const topVotedIds = new Set(
    sortedByVotes.filter(i => i.vote_count > 0).slice(0, 3).map(i => i.id)
  )

  function getBadge(idea: EnrichedIdea): string | null {
    const ageHours = (now - new Date(idea.created_at).getTime()) / (1000 * 60 * 60)
    if (topVotedIds.has(idea.id)) return '🏆'
    if (ageHours < 168 && idea.vote_count >= 2) return '🔥'
    if (ageHours < 48) return '🚀'
    return null
  }

  function getRank(idea: EnrichedIdea): number | undefined {
    const rank = sortedByVotes.findIndex(i => i.id === idea.id) + 1
    return rank <= 5 ? rank : undefined
  }

  const filtered = useMemo(() => {
    let result = [...ideas]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      )
    }

    if (filter === 'new') {
      result = result.filter(i => {
        const ageHours = (now - new Date(i.created_at).getTime()) / (1000 * 60 * 60)
        return ageHours < 48
      })
    } else if (filter === 'trending') {
      result = result.filter(i => {
        const ageHours = (now - new Date(i.created_at).getTime()) / (1000 * 60 * 60)
        return ageHours < 168 && i.vote_count >= 2
      })
    }

    if (sort === 'votes') result.sort((a, b) => b.vote_count - a.vote_count)
    else if (sort === 'recent') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sort === 'comments') result.sort((a, b) => b.comment_count - a.comment_count)

    return result
  }, [ideas, search, filter, sort])

  return (
    <div>
      {/* Filter & Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ideen durchsuchen..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm placeholder:text-gray-400"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as Sort)}
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-gray-700 cursor-pointer"
        >
          {SORTS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 mb-4">
        {filtered.length} Idee{filtered.length !== 1 ? 'n' : ''}
        {search.trim() && ` für „${search}"`}
      </p>

      {/* Idea list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">💡</p>
          <p className="font-semibold text-gray-700 mb-1">Keine Ideen gefunden</p>
          {!userId ? (
            <p className="text-sm text-gray-400">
              <Link href="/auth/login" className="text-indigo-600 hover:underline">
                Einloggen
              </Link>{' '}
              um die erste Idee einzureichen!
            </p>
          ) : (
            <Link href="/ideas/new" className="text-sm text-indigo-600 hover:underline">
              Erste Idee einreichen →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              userId={userId}
              badge={getBadge(idea)}
              rank={getRank(idea)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
