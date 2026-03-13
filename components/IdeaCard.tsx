import Link from 'next/link'
import VoteButton from './VoteButton'
import { Idea } from '@/types'

interface IdeaCardProps {
  idea: Idea & { vote_count?: number; comment_count?: number; user_has_voted?: boolean }
  userId?: string
  badge?: string | null
  rank?: number
}

const CATEGORY_STYLES: Record<string, string> = {
  Feature: 'bg-blue-50 text-blue-700 border-blue-200',
  Tool: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Process: 'bg-amber-50 text-amber-700 border-amber-200',
  Design: 'bg-pink-50 text-pink-700 border-pink-200',
  Sonstiges: 'bg-gray-100 text-gray-500 border-gray-200',
}

const BADGE_STYLES: Record<string, string> = {
  '🏆': 'bg-amber-50 text-amber-700 border-amber-200',
  '🔥': 'bg-orange-50 text-orange-700 border-orange-200',
  '🚀': 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const BADGE_LABELS: Record<string, string> = {
  '🏆': 'Top Vote',
  '🔥': 'Trending',
  '🚀': 'Neu',
}

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700 font-bold',
  2: 'bg-gray-100 text-gray-600 font-bold',
  3: 'bg-orange-50 text-orange-600 font-bold',
}

export default function IdeaCard({ idea, userId, badge, rank }: IdeaCardProps) {
  const categoryStyle = idea.category
    ? CATEGORY_STYLES[idea.category] ?? 'bg-gray-100 text-gray-500 border-gray-200'
    : null

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex gap-4">
      {/* Rank + Vote column */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        {rank !== undefined && (
          <div
            className={`text-xs w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              RANK_STYLES[rank] ?? 'bg-gray-50 text-gray-400 font-medium'
            }`}
          >
            {rank}
          </div>
        )}
        <VoteButton
          ideaId={idea.id}
          initialCount={idea.vote_count ?? 0}
          initialVoted={idea.user_has_voted ?? false}
          userId={userId}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title + badges */}
        <div className="flex items-start gap-2 flex-wrap mb-1.5">
          <Link
            href={`/ideas/${idea.id}`}
            className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors leading-snug"
          >
            {idea.title}
          </Link>
          {badge && (
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${BADGE_STYLES[badge] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {badge} {BADGE_LABELS[badge]}
            </span>
          )}
          {idea.category && categoryStyle && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${categoryStyle}`}>
              {idea.category}
            </span>
          )}
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{idea.description}</p>

        <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span>{idea.comment_count ?? 0}</span>
          </span>
          <span>·</span>
          <span suppressHydrationWarning>
            {new Date(idea.created_at).toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>
    </div>
  )
}
