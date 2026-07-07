import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DeckViewer from './DeckViewer'
import { isScriptLocked } from '@/lib/content/free-script-limit'

type ScriptRow = {
  sort_order: number
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  category: string | null
  stage_id: string
  is_free: boolean
}

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sortOrder = parseInt(id, 10)
  if (isNaN(sortOrder) || sortOrder < 1) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPaid = profile?.subscription_status === 'active'

  const { data: script } = await supabase
    .from('scripts')
    .select('sort_order, title, situation, say_this, not_this, why_it_works, tonight, category, stage_id, is_free')
    .eq('sort_order', sortOrder)
    .single() as { data: ScriptRow | null }

  if (!script) notFound()

  if (await isScriptLocked(supabase, user.id, isPaid, script)) {
    redirect('/dashboard/upgrade')
  }

  const { data: completion } = await supabase
    .from('script_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('script_sort_order', sortOrder)
    .single()

  return (
    <DeckViewer
      script={script}
      initialCompleted={!!completion}
      categorySlug={script.category}
    />
  )
}
