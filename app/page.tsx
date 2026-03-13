import { createServerSupabaseClient } from '@/lib/supabase-server'
import FilterableIdeaList from '@/components/FilterableIdeaList'
import Link from 'next/link'

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: ideas } = await supabase
    .from('ideas')
    .select('*, vote_count:votes(count), comment_count:comments(count)')
    .order('created_at', { ascending: false })

  const { data: userVotes } = user
    ? await supabase.from('votes').select('idea_id').eq('user_id', user.id)
    : { data: [] }

  const votedIdeaIds = new Set((userVotes ?? []).map(v => v.idea_id))

  const enrichedIdeas = (ideas ?? []).map(idea => ({
    ...idea,
    vote_count: (idea.vote_count as unknown as { count: number }[])?.[0]?.count ?? 0,
    comment_count: (idea.comment_count as unknown as { count: number }[])?.[0]?.count ?? 0,
    user_has_voted: votedIdeaIds.has(idea.id),
  }))

  const totalIdeas = enrichedIdeas.length
  const totalVotes = enrichedIdeas.reduce((acc, i) => acc + (i.vote_count ?? 0), 0)
  const participants = new Set(enrichedIdeas.map(i => i.user_id)).size
  const goalIdeas = 20
  const progress = Math.min((totalIdeas / goalIdeas) * 100, 100)

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='1.5' fill='%23fff'/%3E%3Ccircle cx='24' cy='4' r='1.5' fill='%23fff'/%3E%3Ccircle cx='4' cy='24' r='1.5' fill='%23fff'/%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23fff'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-white/20 tracking-wide uppercase">
                🚀 HERO Software · AI Hackathon 2025
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
                Hackathon Ideas
              </h1>
              <p className="text-indigo-100 text-lg mb-3 max-w-md">
                Share ideas, vote for the best, build the future.
              </p>
              <p className="text-indigo-200/80 text-sm flex items-center gap-1.5">
                <span>🏆</span>
                <span>Top 5 Ideen werden während des Hackathons gebaut</span>
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-5">
              {user ? (
                <Link
                  href="/ideas/new"
                  className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
                >
                  💡 Idee einreichen
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
                >
                  💡 Jetzt mitmachen
                </Link>
              )}

              <div className="flex items-center gap-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white tabular-nums">{totalIdeas}</div>
                  <div className="text-xs text-indigo-200">Ideen</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white tabular-nums">{totalVotes}</div>
                  <div className="text-xs text-indigo-200">Votes</div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white tabular-nums">{participants}</div>
                  <div className="text-xs text-indigo-200">Teilnehmer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-xs text-indigo-200/80 mb-2">
              <span>{totalIdeas} / {goalIdeas} Ideen eingereicht</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <FilterableIdeaList ideas={enrichedIdeas} userId={user?.id} />
      </div>
    </div>
  )
}
