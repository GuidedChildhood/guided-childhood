import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import DigiCharacter from '@/components/digi/DigiCharacter'
import KidAskForJob, { type KidAsk } from '@/components/kid/KidAskForJob'

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
    .select('name')
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

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '18px' }}>
          <Link href={`/k/${token}`} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
          }}>
            ← My quests
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <DigiCharacter mood="wave" size={56} once />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 6vw, 1.9rem)', color: '#F7F7F5', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              Ask for a job
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.66)', margin: '5px 0 0' }}>
              Your idea, their yes
            </p>
          </div>
        </div>
        <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: '10px 0 20px' }}>
          Think of something you could do to help{childName ? `, ${childName}` : ''}. Your grown up gets it on their phone and can turn it into a real job with stars.
        </p>

        <KidAskForJob token={token} initialAsks={asks} childName={childName || undefined} />
      </div>
    </div>
  )
}
