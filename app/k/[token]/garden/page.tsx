import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { resolveTheme } from '@/lib/kid/theme'
import { buddyFor } from '@/lib/kid/buddy'
import { tierFor } from '@/lib/planter/logic'
import { loadGardenView } from '@/lib/planter/server'
import PlanterGarden from '@/components/planter/PlanterGarden'
import KidBackLink from '@/components/kid/KidBackLink'

// My garden: Planter Friends on the child link. Same trust model as every
// child screen: no account, no login, the token scopes everything to one
// child, and no model runs anywhere near it. The garden is read and brought
// up to now on the server, so the screen opens on what the plants actually
// did while the child was away.
//
// Slice 1 is Tier 1 and Tier 2 (ages 3 to 9). A Tier 3 child who reaches
// this page by link gets a plain note and the way back, never a broken toy.

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My garden 🌱',
  appleWebApp: { capable: true, title: 'My garden', statusBarStyle: 'black-translucent' as const },
}

export default async function KidGardenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name, age_band, accent, buddy, date_of_birth').eq('id', link.child_id).maybeSingle()

  const theme = resolveTheme((child?.accent as string | null) ?? null)
  const tier = tierFor((child as { date_of_birth?: string | null } | null)?.date_of_birth ?? null, (child?.age_band as string | null) ?? null)

  if (tier === 3) {
    return (
      <div style={{ minHeight: '100dvh', background: theme.bg, color: theme.ink, padding: '20px 16px', fontFamily: 'var(--font-body)' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <KidBackLink href={`/k/${token}`} color={theme.ink} />
          <div style={{ marginTop: 24, background: '#fff', color: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: 20, boxShadow: '0 5px 0 var(--ink)', padding: '20px 18px' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.2 }}>Your garden is still being planted.</p>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              The version for your age lets you plan your plant&apos;s day yourself. It is on its way.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const view = await loadGardenView(supabase, link.user_id as string, link.child_id as string, child ?? {})

  return (
    <PlanterGarden
      token={token}
      initial={view}
      theme={theme}
      childName={(child?.name as string | null) ?? 'Superstar'}
      gardener={buddyFor((child?.buddy as string | null) ?? null)}
    />
  )
}
