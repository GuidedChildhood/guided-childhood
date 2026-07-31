import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ManageJobs from './ManageJobs'

// Add a job, as a page.
//
// It was a panel inside the Quests page, so the tile called Manage jobs
// scrolled you down a long page to a card with a Close button on it. A thing
// you navigate TO should be somewhere you have gone, not somewhere you have
// scrolled.
//
// The child and the tab arrive on the URL rather than being read on the
// client, so a link from the board opens on the right child and the right tab
// with nothing flashing into place after paint. It also keeps useSearchParams
// out of a client tree that would otherwise need a Suspense boundary to build.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Add a job — Guided Childhood' }

export default async function ManageJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; tab?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child, tab } = await searchParams
  return <ManageJobs initialChild={child ?? null} initialTab={tab ?? null} />
}
