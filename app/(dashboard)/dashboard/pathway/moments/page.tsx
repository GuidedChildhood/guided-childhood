import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import BackTo from '@/components/nav/BackTo'
import WorkingOn from '@/components/tracker/WorkingOn'
import { pickChild } from '@/lib/children/select'
import { readScores, type ScoredEvent } from '@/lib/concerns/scores'
import { TOP_BAND, SILVER_RUN } from '@/lib/concerns/resting'
import { withChild } from '@/components/passport/Application'

// Moments to resolve: the passport's first step, as its own page.
//
// Justin, 28 September 2026, tapping "Start here" on Moments to resolve: "it
// should take me to these moments so they can try with our tools, either ask
// DiGi to help or go straight to the scripts, but note they are always on the
// check in each day so stars may increase in rating and resolve over time, we
// will track."
//
// WHY A PAGE AND NOT AN ANCHOR. This row has been fixed three times as a link
// to #working-on on the pathway page (8 August, 17 September), and it broke a
// fourth way: that list now sits inside the folded "The record" section, a
// closed <details>. iPhone Safari does not open a closed <details> for a
// fragment, so "Start here" moved the page nowhere. An anchor into a fold is
// a link that depends on the fold, and the fold is right for the record. A
// page depends on nothing. check-moments-anchor now holds the row to it.
//
// Same reads as the list in IsItWorkingReport, scoped to the chosen child plus
// the household's unassigned rows, so the count on the passport and the list
// here are the same rows.

export const metadata = { title: 'Moments to resolve · Guided Childhood' }

export default async function MomentsToResolvePage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; from?: string }>
}) {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  const { child: childParam, from } = await searchParams

  const [childrenRes, concernsRes, resolvedCountRes, recentSolvedRes] = await Promise.all([
    supabase.from('children').select('id, name, age_band, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('concerns').select('id, slug, label, status, times_flagged, child_id').eq('user_id', user.id).in('status', ['open', 'improving']).order('times_flagged', { ascending: false }).limit(30),
    supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'resolved'),
    supabase.from('concerns').select('slug, label, times_flagged, child_id').eq('user_id', user.id).eq('status', 'resolved').order('last_checked_at', { ascending: false }).limit(18),
  ])

  const child = pickChild(childrenRes.data ?? [], childParam)
  const mine = <T extends { child_id?: string | null }>(rows: T[]): T[] =>
    rows.filter(r => (r.child_id ?? null) === null || r.child_id === (child?.id ?? null))
  const concerns = mine(concernsRes.data ?? [])
  const recentSolved = mine(recentSolvedRes.data ?? []).slice(0, 6)

  const ids = concerns.map(c => String(c.id))
  const { data: scoreRows } = ids.length
    ? await supabase
        .from('concern_events')
        .select('concern_id, score, created_at')
        .in('concern_id', ids)
        .not('score', 'is', null)
        .order('created_at', { ascending: false })
    : { data: [] }
  const scores = readScores((scoreRows ?? []) as ScoredEvent[], TOP_BAND)

  const kidName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
  const backHref = withChild('/dashboard/pathway#passport', childParam)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
      <BackTo from={from ?? 'passport'} fallback={{ href: backHref, label: 'Passport' }} />
      <p className="eyebrow" style={{ marginBottom: 4 }}>Moments to resolve</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2 }}>
        {concerns.length === 0
          ? 'Nothing to resolve right now'
          : `${concerns.length} ${concerns.length === 1 ? 'moment' : 'moments'} to work through with ${kidName}`}
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        Pick one. Ask DiGi for a plan, or go straight to the words that fit it.
      </p>
      {/* The tracking line Justin asked for: these are not a one off to do
          list, they ride the daily check in, and the rating is what moves. */}
      <div data-moments-tracking style={{ background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '12px 14px', margin: '0 0 18px' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
          We track these for you
        </span>
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }}>
          Each one stays on your daily check in, where you give it a quick rating. As the ratings climb we show it here, and when it is settled you mark it sorted.
        </span>
      </div>
      <WorkingOn
        concerns={concerns.map(c => ({
          slug: c.slug, label: c.label, status: c.status, times_flagged: c.times_flagged,
          from: scores.first.get(String(c.id)) ?? null,
          now: scores.last.get(String(c.id)) ?? null,
          silver: (scores.topRun.get(String(c.id)) ?? 0) >= SILVER_RUN,
        }))}
        solvedAlready={resolvedCountRes.count ?? 0}
        recentSolved={recentSolved.map(c => ({ slug: c.slug, label: c.label, times_flagged: c.times_flagged }))}
        childName={kidName}
        parentEmail={user.email ?? ''}
      />
    </div>
  )
}
