import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { getHolidayBanks } from '@/lib/quests/holiday-bank'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { getFamilyRegion } from '@/lib/learning/region'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { questDueToday } from '@/lib/quests/due'
import { STAR_MINUTES } from '@/lib/quests/templates'
import MarkStepOnArrival from '@/components/kid/MarkStepOnArrival'

// Check my balance, as a page that exists.
//
// The five a day has carried a "Check my balance" row pointing at
// /k/{token}/balance since it was built, and this route was never made. So the
// one step of the five that is a mirror rather than a task sent a child to a
// 404, and step four of five could be completed only by leaving the app.
// Justin: "the check my balance is brief link but should go to the balance page
// where it indicates jobs against screen time."
//
// Which is also the design brief. This is not a stats page. Step four completes
// by being READ, so it has one job: show a child what their jobs have bought
// them and how much of it they have used today, in that order, and never score
// them on it. A child cannot control the number and grading them on one would
// make the balance a test they can fail rather than the mirror it is meant to
// be.
//
// Same trust model as the rest of the child app: no account, no login, the link
// token scopes everything to one child.

export const dynamic = 'force-dynamic'

export default async function KidBalancePage({ params }: { params: Promise<{ token: string }> }) {
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
    .select('name, age_band')
    .eq('id', link.child_id)
    .maybeSingle()

  const today = new Date().toISOString().slice(0, 10)
  const [banks, usedMap, region, questsRes, ticksRes] = await Promise.all([
    getStarBanks(supabase, link.user_id, [link.child_id]),
    getMinutesUsedToday(supabase, link.user_id, [link.child_id]),
    getFamilyRegion(supabase, link.user_id),
    supabase.from('family_quests')
      .select('id, title, emoji, stars, schedule, schedule_days, child_id')
      .eq('user_id', link.user_id).eq('active', true),
    supabase.from('quest_ticks')
      .select('quest_id, child_id, status, tick_date')
      .eq('user_id', link.user_id).eq('tick_date', today),
  ])

  const holiday = (await getHolidayBanks(
    supabase, link.user_id, [link.child_id], new Date(), region,
  ).catch(() => []))[0]

  const balance = Math.max(0, banks[0]?.balance ?? 0)
  const minutesReady = balance * STAR_MINUTES
  const usedToday = usedMap.get(link.child_id) ?? 0
  const guide = recommendedDailyMinutes(child?.age_band ?? null, { region })

  type Q = { id: string; title: string; emoji: string; stars: number; schedule: string; schedule_days: number[] | null; child_id: string | null }
  const mine = ((questsRes.data ?? []) as Q[])
    .filter(q => q.child_id === null || q.child_id === link.child_id)
    .filter(q => questDueToday(q.schedule, q.schedule_days))
  const doneIds = new Set(
    ((ticksRes.data ?? []) as { quest_id: string; child_id: string | null; status: string }[])
      .filter(t => t.status !== 'rejected' && (t.child_id === null || t.child_id === link.child_id))
      .map(t => t.quest_id)
  )
  const todo = mine.filter(q => !doneIds.has(q.id))
  const earnedToday = mine.filter(q => doneIds.has(q.id)).reduce((s, q) => s + (Number(q.stars) || 1), 0)
  const stillToEarn = todo.reduce((s, q) => s + (Number(q.stars) || 1), 0)

  const name = child?.name && child.name !== 'Your child' ? child.name : ''
  // Inside the guide or past it. Both are fine and neither is a mark: the
  // healthy amount is a ceiling to know about, never a target to hit.
  const pct = guide > 0 ? Math.min(100, Math.round((usedToday / guide) * 100)) : 0

  const CARD: React.CSSProperties = {
    background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 22,
    padding: '16px 18px', marginBottom: 14, boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      {/* Reading it IS the step. See the note in MarkStepOnArrival. */}
      <MarkStepOnArrival token={token} step="balance" />
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link href={`/k/${token}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 16 }}>
          ← Back
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 6px', color: 'var(--ink)' }}>
          {name ? `${name}'s balance` : 'Your balance'}
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          Your jobs on one side, your screen time on the other. Nothing here is a score.
        </p>

        {/* What the jobs have bought. The headline, because it is the half a
            child owns: they did the work and this is what it turned into. */}
        <section style={CARD}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 6 }}>
            Your jobs earned
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1 }}>
              ⭐ {balance}
            </span>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
              = {minutesReady} minutes ready to use
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
            One star is {STAR_MINUTES} minutes. These are yours, they do not disappear at the end of the day.
          </p>
        </section>

        {/* And what has been used. Second, deliberately: a child should meet
            what they earned before what they spent. */}
        <section style={CARD}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
            Screens today
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 9 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1 }}>
              {usedToday} min
            </span>
            {guide > 0 && (
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
                out of about {guide} for your age
              </span>
            )}
          </div>
          {guide > 0 && (
            <div style={{ height: 10, borderRadius: 100, background: 'var(--cream)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 100, background: 'var(--terracotta)' }} />
            </div>
          )}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '9px 0 0' }}>
            {usedToday === 0
              ? 'None yet today.'
              : guide > 0 && usedToday > guide
                ? 'A bit more than the usual amount for your age today. That happens, and it is not a telling off.'
                : 'That is a comfortable amount for your age.'}
          </p>
        </section>

        {/* The two sides held against each other, which is the whole point of
            the page and the thing the row promised. */}
        <section style={CARD}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
            Today, job by job
          </div>
          {mine.length === 0 ? (
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              No jobs set for today.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 10px' }}>
                <strong>{earnedToday} star{earnedToday === 1 ? '' : 's'}</strong> earned so far today
                {stillToEarn > 0 && <>, and <strong>{stillToEarn} more</strong> still there to be had, worth {stillToEarn * STAR_MINUTES} minutes.</>}
                {stillToEarn === 0 && <>. Everything for today is done.</>}
              </p>
              {/* An outstanding job is a link to the job, not a line about it.
                  Justin: it "lets them know what jobs are outstanding but can
                  they actually click to go to those jobs". A child reading a
                  list of what they still owe, with no way through to it, has to
                  remember the list and go and find it, which is the moment the
                  page stops being useful. A done one is just a record and has
                  nowhere to go. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {mine.map(q => {
                  const done = doneIds.has(q.id)
                  const row = (
                    <>
                      <span aria-hidden style={{ fontSize: 'var(--text-md)', flexShrink: 0, opacity: done ? 0.55 : 1 }}>{done ? '✓' : q.emoji}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.35, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.55 : 1 }}>
                        {q.title}
                      </span>
                      <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: done ? 'var(--ink-muted)' : 'var(--terracotta-dark)' }}>
                        {q.stars * STAR_MINUTES} min
                      </span>
                      {!done && (
                        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink-muted)' }}>›</span>
                      )}
                    </>
                  )
                  const base: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9 }
                  if (done) return <div key={q.id} style={base}>{row}</div>
                  return (
                    <Link
                      key={q.id}
                      href={`/k/${token}#kid-today`}
                      style={{ ...base, textDecoration: 'none', color: 'inherit', borderRadius: 10, margin: '0 -6px', padding: '4px 6px' }}
                    >
                      {row}
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </section>

        {/* Banked for the holidays, when there is any. Silent at zero, because
            a bank nobody has paid into is not news to a child either. */}
        {holiday && holiday.remaining > 0 && (
          <section style={{ ...CARD, background: 'var(--tint-sage)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
              Saved for the holidays
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.1 }}>
              {holiday.remaining} minutes
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
              {holiday.spendableNow
                ? 'School is out, so these are yours to use now. You earned them by doing more than a normal week had room for.'
                : 'Extra jobs you did that the week had no room for. They are waiting for the school holidays, and they never run out.'}
            </p>
          </section>
        )}

        <Link href={`/k/${token}`} className="btn" style={{ display: 'flex', justifyContent: 'center', padding: '15px 20px', fontSize: 'var(--text-md)', textDecoration: 'none', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 16, fontFamily: 'var(--font-display)', fontWeight: 800, boxShadow: '0 5px 0 var(--terracotta-dark)', marginTop: 4 }}>
          Back to today
        </Link>
      </div>
    </div>
  )
}
