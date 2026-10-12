import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { APP_ORIGIN } from '@/lib/config/site'
import VideoLinks, { type VideoLinkRow } from './VideoLinks'

// The film links, and what each one did (migration 372).
//
// The DiGi shorts panel's measurement gap: a film was judged on views because
// nothing counted the stage check. Each film now carries /v/<code>, and this
// page reads the funnel for it: followed, stage check begun, signed up, card
// on, paying. Judge a film on starts and signups, never views.
//
// PAYING MEANS PAYING, as on the school links page: a Founder card trial
// reads 'active' while its free days run, so those are shown on their own.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

export default async function VideoLinksPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()
  const [{ data: links, error }, { data: families }] = await Promise.all([
    admin.from('video_links').select('code, title, active, created_at').order('created_at', { ascending: false }),
    admin.from('profiles').select('video_link, subscription_status, trial_ends_at').not('video_link', 'is', null),
  ])

  // Counted on the server, one exact count per film and kind, so the page
  // never stops at the API's row limit once a film does well.
  const count = async (code: string, kind: 'opened' | 'started') => {
    const { count: n } = await admin.from('video_link_events').select('id', { count: 'exact', head: true }).eq('code', code).eq('kind', kind)
    return n ?? 0
  }

  const now = Date.now()
  const inTrialWindow = (f: { trial_ends_at: string | null }) =>
    Boolean(f.trial_ends_at) && new Date(f.trial_ends_at as string).getTime() > now
  const onPaidStatus = (f: { subscription_status: string | null }) =>
    f.subscription_status === 'active' || f.subscription_status === 'past_due'

  const rows: VideoLinkRow[] = await Promise.all((links ?? []).map(async l => {
    const mine = (families ?? []).filter(f => f.video_link === l.code)
    const [opened, started] = await Promise.all([count(l.code as string, 'opened'), count(l.code as string, 'started')])
    return {
      code: l.code as string,
      title: l.title as string,
      active: Boolean(l.active),
      url: `${APP_ORIGIN}/v/${l.code}`,
      opened,
      started,
      signedUp: mine.length,
      cardOn: mine.filter(f => onPaidStatus(f) && inTrialWindow(f)).length,
      paying: mine.filter(f => onPaidStatus(f) && !inTrialWindow(f)).length,
    }
  }))

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px' }}>
      <Link href="/dashboard/admin/health" style={{ ...MONO, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Admin
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '10px 0 6px' }}>
        Film links
      </h1>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 22px' }}>
        One link per film, for the caption, the bio or the pinned comment. It lands on
        the stage check like every other way in. This page shows what each film did:
        how many followed the link, how many began the stage check, and how many signed
        up and went on to pay. Counts only, never who.
      </p>
      {error ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
          The film links table is not there yet. It arrives with migration 372.
        </p>
      ) : (
        <VideoLinks rows={rows} />
      )}
    </div>
  )
}
