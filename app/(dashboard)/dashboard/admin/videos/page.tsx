import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { APP_ORIGIN } from '@/lib/config/site'
import { CHANNELS, CHANNEL_LABEL, isChannel, LINK_CHANNELS, type Channel } from '@/lib/video/link'
import VideoLinks, { type VideoLinkRow, type ChannelRow } from './VideoLinks'

// Where the stage checks come from (migrations 372 and 379).
//
// Began as the film links page: the DiGi shorts panel found a film was judged
// on views because nothing counted the stage check. The review board of 13
// October 2026 found the same gap everywhere else (count-stage-checks-by-
// source): a LinkedIn post, a group seed, a Facebook post and the printed
// Planet Post all sent parents in uncounted, so nobody could say which channel
// deserved the next hour. Now every start is counted, every link has a
// channel, and the top of this page is the Friday number: stage checks begun
// in the last seven days, by channel. Judge a post on starts and signups,
// never views.
//
// PAYING MEANS PAYING, as on the school links page: a Founder card trial
// reads 'active' while its free days run, so those are shown on their own.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

type Counts = { opened: number; started: number; opened_week: number; started_week: number }
const ZERO: Counts = { opened: 0, started: 0, opened_week: 0, started_week: 0 }

export default async function VideoLinksPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()

  // With the channel column (379), or without it on a database that has not
  // had 379 yet, when every link is a film.
  let { data: links, error } = await admin.from('video_links')
    .select('code, title, active, created_at, channel').order('created_at', { ascending: false })
  if (error) {
    const old = await admin.from('video_links').select('code, title, active, created_at').order('created_at', { ascending: false })
    links = (old.data ?? []).map(l => ({ ...l, channel: 'film' }))
    error = old.error
  }
  const { data: families } = await admin.from('profiles')
    .select('video_link, subscription_status, trial_ends_at').not('video_link', 'is', null)

  // One read when the view is there (379); before it, one exact count per link
  // and kind as the film page always did, so it never stops at the row limit.
  const counts = new Map<string, Counts>()
  const { data: viewRows, error: viewError } = await admin.from('video_link_counts')
    .select('code, opened, started, opened_week, started_week')
  if (!viewError) {
    for (const r of viewRows ?? []) {
      counts.set(r.code as string, {
        opened: Number(r.opened) || 0, started: Number(r.started) || 0,
        opened_week: Number(r.opened_week) || 0, started_week: Number(r.started_week) || 0,
      })
    }
  } else {
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString()
    const n = async (code: string, kind: 'opened' | 'started', week: boolean) => {
      let q = admin.from('video_link_events').select('id', { count: 'exact', head: true }).eq('code', code).eq('kind', kind)
      if (week) q = q.gte('created_at', since)
      const { count } = await q
      return count ?? 0
    }
    await Promise.all((links ?? []).map(async l => {
      const code = l.code as string
      const [opened, started, opened_week, started_week] = await Promise.all([
        n(code, 'opened', false), n(code, 'started', false), n(code, 'opened', true), n(code, 'started', true),
      ])
      counts.set(code, { opened, started, opened_week, started_week })
    }))
  }

  const now = Date.now()
  const inTrialWindow = (f: { trial_ends_at: string | null }) =>
    Boolean(f.trial_ends_at) && new Date(f.trial_ends_at as string).getTime() > now
  const onPaidStatus = (f: { subscription_status: string | null }) =>
    f.subscription_status === 'active' || f.subscription_status === 'past_due'

  const all = (links ?? []).map(l => {
    const code = l.code as string
    const channel: Channel = isChannel(l.channel) ? l.channel : 'other'
    const mine = (families ?? []).filter(f => f.video_link === code)
    const c = counts.get(code) ?? ZERO
    return {
      code,
      title: l.title as string,
      active: Boolean(l.active),
      channel,
      url: `${APP_ORIGIN}/v/${code}`,
      opened: c.opened,
      started: c.started,
      startedWeek: c.started_week,
      signedUp: mine.length,
      cardOn: mine.filter(f => onPaidStatus(f) && inTrialWindow(f)).length,
      paying: mine.filter(f => onPaidStatus(f) && !inTrialWindow(f)).length,
    }
  })

  // The links a founder makes; the no link rows only ever appear as a channel.
  const rows: VideoLinkRow[] = all.filter(r => LINK_CHANNELS.includes(r.channel))

  const channels: ChannelRow[] = CHANNELS.map(ch => {
    const of = all.filter(r => r.channel === ch)
    return {
      channel: ch,
      label: CHANNEL_LABEL[ch],
      links: of.filter(r => LINK_CHANNELS.includes(r.channel)).length,
      startedWeek: of.reduce((s, r) => s + r.startedWeek, 0),
      started: of.reduce((s, r) => s + r.started, 0),
      signedUp: of.reduce((s, r) => s + r.signedUp, 0),
    }
  }).filter(c => c.started > 0 || c.links > 0 || c.channel === 'direct')
    .sort((a, b) => b.startedWeek - a.startedWeek || b.started - a.started)

  const fridayNumber = channels.reduce((s, c) => s + c.startedWeek, 0)
  const startedEver = channels.reduce((s, c) => s + c.started, 0)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px' }}>
      <Link href="/dashboard/admin/health" style={{ ...MONO, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Admin
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '10px 0 6px' }}>
        Where the stage checks come from
      </h1>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 22px' }}>
        Every stage check begun, counted by the link that sent the parent. One link per
        film, LinkedIn post, group seed or Facebook post. Each lands on the stage check
        like every other way in. Counts only, never who.
      </p>
      {error ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
          The links table is not there yet. It arrives with migration 372.
        </p>
      ) : (
        <VideoLinks rows={rows} channels={channels} fridayNumber={fridayNumber} startedEver={startedEver} byChannel={!viewError} />
      )}
    </div>
  )
}
