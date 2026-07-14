import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import BucketBuilder from './BucketBuilder'

// Build your own bucket list: pick from the idea pool or write your own,
// put the child's name on it, print it, and the finished page pays stars
// through the quest approve loop like every other printable. A member
// feature, so free parents are sent to upgrade rather than the builder.

export const metadata = { title: 'Bucket List Builder — Guided Childhood' }

export default async function BuilderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).maybeSingle()
  if (!hasFullAccess(profile, user.email)) redirect('/dashboard/upgrade')

  return <BucketBuilder />
}
