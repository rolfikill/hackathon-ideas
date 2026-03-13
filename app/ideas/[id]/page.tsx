import { createServerSupabaseClient } from '@/lib/supabase-server'
import VoteButton from '@/components/VoteButton'
import CommentSection from '@/components/CommentSection'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const CATEGORY_STYLES: Record<string, string> = {
  Feature: 'bg-blue-50 text-blue-700 border-blue-200',
  Tool: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Process: 'bg-amber-50 text-amber-700 border-amber-200',
  Design: 'bg-pink-50 text-pink-700 border-pink-200',
  Sonstiges: 'bg-gray-100 text-gray-500 border-gray-200',
}

export const revalidate = 0

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: idea } = await supabase
    .from('ideas')
    .select('*, vote_count:votes(count), comment_count:comments(count)')
    .eq('id', id)
    .single()

  if (!idea) notFound()

  const voteCount = (idea.vote_count as unknown as { count: number }[])?.[0]?.count ?? 0

  const { data: userVote } = user
    ? await supabase.from('votes').select('id').eq('idea_id', id).eq('user_id', user.id).maybeSingle()
    : { data: null }

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('idea_id', id)
    .order('created_at', { ascending: true })

  const categoryStyle = idea.category
    ? CATEGORY_STYLES[idea.category] ?? 'bg-gray-100 text-gray-500 border-gray-200'
    : null

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6">
        ← Zurück zur Übersicht
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex gap-4 mb-5">
          <VoteButton
            ideaId={idea.id}
            initialCount={voteCount}
            initialVoted={!!userVote}
            userId={user?.id}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{idea.title}</h1>
              {idea.category && categoryStyle && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${categoryStyle}`}>
                  {idea.category}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400" suppressHydrationWarning>
              Eingereicht am {new Date(idea.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>

        <div className="pt-5 border-t border-gray-100">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-[15px]">{idea.description}</p>
        </div>

        <CommentSection
          ideaId={idea.id}
          initialComments={comments ?? []}
          userId={user?.id}
        />
      </div>
    </div>
  )
}
