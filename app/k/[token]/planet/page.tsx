import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { resolveTheme } from '@/lib/kid/theme'
import { loadHomeView } from '@/lib/planet/server'
import PlanetFriends from '@/components/planet/PlanetFriends'

// My planet: Planet Friends on the child link. Same trust model as every
// child screen: no account, no login, the token scopes everything to one
// child, and no model runs anywhere near it. The planet is read and brought
// up to now on the server, so the screen opens on what the Friends actually
// did while the child was away.
//
// Every tier opens the planet. A Tier 3 child (10 plus) looks after three
// Friends on the Tier 2 rules until slice 4 brings their own schedule and the
// study timer. Justin, 2 September 2026: "can't see the new game?"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My planet 🪐',
  appleWebApp: { capable: true, title: 'My planet', statusBarStyle: 'black-translucent' as const },
}

export default async function KidPlanetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name, age_band, accent, date_of_birth').eq('id', link.child_id).maybeSingle()

  const theme = resolveTheme((child?.accent as string | null) ?? null)
  const view = await loadHomeView(supabase, link.user_id as string, link.child_id as string, child ?? {})

  return (
    <PlanetFriends
      token={token}
      initial={view}
      theme={theme}
      childName={(child?.name as string | null) ?? 'Superstar'}
    />
  )
}
