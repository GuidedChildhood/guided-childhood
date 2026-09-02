import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HowItWorksClient from './HowItWorksClient'

// The first welcome, again, for a parent who wants it back.
//
// The walkthrough runs once at the end of setup. A parent who skipped it, or
// wants to show a co parent what the app does, reaches the same seven cards
// from Settings. No celebration and no reminder ask here: nothing new has
// happened, and the nudge lives under Settings already.

export const dynamic = 'force-dynamic'

export const metadata = { title: 'How it works' }

export default async function HowItWorksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('name')
    .eq('parent_id', user.id)
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle()

  return <HowItWorksClient childName={(child?.name as string | undefined) ?? 'Your child'} />
}
