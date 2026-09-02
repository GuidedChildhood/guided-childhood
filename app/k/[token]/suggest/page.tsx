import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import KidAskForJob, { type KidAsk } from '@/components/kid/KidAskForJob'
import { resolveTheme } from '@/lib/kid/theme'
import KidBackLink from '@/components/kid/KidBackLink'

// Ask for a job: the child's own page for pitching a quest to their grown up.
//
// Justin: "here on child's app you should be able to suggest quest to parent,
// there is a page that should open."
//
// It is its own page for the same reason Manage jobs became one earlier today.
// A child tapping New job is doing one thing, and burying it two thirds of the
// way down a very long scroll meant the tile either did something else entirely
// or, once asked, nothing at all.
//
// Same trust model as the rest of the child app: no account and no login, the
// link token scopes everything to one child.

export const dynamic = 'force-dynamic'

export default async function KidSuggestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children')
    .select('name, accent, age_band')
    .eq('id', link.child_id)
    .maybeSingle()

  // A fortnight rather than the week the Quests screen shows. This is the page
  // a child comes to precisely to find out what happened to an idea, so an ask
  // from ten days ago that a parent has not answered still needs to be here.
  const since = new Date(Date.now() - 14 * 86400000).toISOString()
  const { data: rows } = await supabase
    .from('quest_requests')
    .select('id, title, emoji, status, created_at')
    .eq('child_id', link.child_id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(12)

  const asks = ((rows ?? []) as { id: string; title: string; emoji: string; status: string }[])
    .map(r => ({ id: r.id, title: r.title, emoji: r.emoji, status: r.status })) as KidAsk[]
  const childName = child?.name && child.name !== 'Your child' ? child.name : ''
  // The colour the child chose in Make it mine, rather than the anthracite
  // default this page was pinned to.
  const theme = resolveTheme(child?.accent as string | null)

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '18px' }}>
          <KidBackLink href={`/k/${token}`} color={theme.inkSoft} fontSize="var(--text-base)" />
        </div>

        {/* DiGi waves the child in; the card below carries the headline as
            its happy news masthead, so the page does not say it twice. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <DigiCharacter mood="wave" size={52} once />
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: theme.inkSoft, lineHeight: 1.45, margin: 0 }}>
            Think of something you could do to help{childName ? `, ${childName}` : ''}. Your grown up gets it on their phone and can turn it into a real job with stars.
          </p>
        </div>

        <KidAskForJob token={token} initialAsks={asks} childName={childName || undefined} theme={theme} ageBand={(child?.age_band as string | null) ?? null} />
      </div>
    </div>
  )
}
