import { createServerSupabaseClient } from '@/lib/supabase-server'
import IdeaForm from '@/components/IdeaForm'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewIdeaPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6">
        ← Zurück
      </Link>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Neue Idee einreichen</h1>
        <p className="text-gray-500 text-sm">Teile deine Idee mit dem Team und lass abstimmen.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <IdeaForm userId={user.id} />
      </div>
    </div>
  )
}
