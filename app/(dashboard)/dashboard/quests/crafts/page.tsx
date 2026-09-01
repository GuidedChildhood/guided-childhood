import { createClient } from '@/lib/supabase/server'
import CraftPack from './CraftPack'
import { getChildren } from '@/lib/children/server'

// The Game Pack: big quality, screen free, star earning printables.
// Every craft doubles as a quest and maps to a literacy idea, so the
// curriculum, the chores and the fun are one system (plan section 10).

export const metadata = { title: 'The Game Pack · Guided Childhood' }

export default async function CraftsPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let childName: string | null = null
  if (user) {
    // The name follows ?child= like everywhere else.
    const { child } = await getChildren<{ id: string; name: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'id, name')
    childName = child?.name && child.name !== 'Your child' ? child.name : null
  }
  return <CraftPack childName={childName} />
}
