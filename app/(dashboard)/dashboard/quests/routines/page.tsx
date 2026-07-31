import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddRoutine from './AddRoutine'

// Add a whole week routine, as a page rather than a hash on the Quests page.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Add a routine · Guided Childhood' }

export default async function AddRoutinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <AddRoutine />
}
