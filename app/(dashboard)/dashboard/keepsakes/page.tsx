import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Keepsakes from '@/components/rewards/Keepsakes'

// The keepsakes surface: the real world reward at the end of the digital
// journey. A printed passport and the Planet Friend charm set, offered as a
// register your interest for now since print on demand is not wired yet.

export const metadata = { title: 'Keepsakes — Guided Childhood' }

export default async function KeepsakesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('name')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const childName = child?.name && child.name !== 'Your child' ? child.name : null

  return <Keepsakes email={user.email ?? ''} childName={childName} />
}
