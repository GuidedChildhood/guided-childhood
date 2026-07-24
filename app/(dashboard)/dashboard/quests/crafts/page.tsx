import { createClient } from '@/lib/supabase/server'
import CraftPack from './CraftPack'

// The Game Pack: big quality, screen free, star earning printables.
// Every craft doubles as a quest and maps to a literacy idea, so the
// curriculum, the chores and the fun are one system (plan section 10).

export const metadata = { title: 'The Game Pack — Guided Childhood' }

export default async function CraftsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let childName: string | null = null
  if (user) {
    const { data: child } = await supabase
      .from('children').select('name').eq('parent_id', user.id).eq('is_primary', true).maybeSingle()
    childName = child?.name && child.name !== 'Your child' ? child.name : null
  }
  return <CraftPack childName={childName} />
}
