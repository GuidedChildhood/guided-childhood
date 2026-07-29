import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ManageJobs from './ManageJobs'

// Manage jobs, as a page.
//
// It was a panel inside the Quests page, so the tile called Manage jobs
// scrolled you down a long page to a card with a Close button on it. A thing
// you navigate TO should be somewhere you have gone, not somewhere you have
// scrolled.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Manage jobs — Guided Childhood' }

export default async function ManageJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <ManageJobs />
}
