import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import BackTo from '@/components/nav/BackTo'
import MovementLine from '@/components/working/MovementLine'
import { getMovements, movementSentence, spanWords, usedWords } from '@/lib/working/movement'
import { isNewFamily, dayOneLine, waitingForSecondLook, lookWord, readFirstWin } from '@/lib/working/first-week'

// WHAT IS WORKING.
//
// Justin, 13 August 2026: its own page, not part of the passport scroll.
// Movement over time from concern_events. A sentence a parent can say out
// loud, "bedtime went from 5 to 8 over six weeks". No composite score, ever.
//
// WHY IT LEFT THE PASSPORT. This material was living as one card most of the
// way down /dashboard/pathway, under the journeys and the stamps. Two
// different jobs were sharing a scroll: the passport is the RECORD, what has
// been done and earned, and this is the ANSWER, whether any of it moved. A
// parent who wants to know if this is working should not have to scroll past
// their own achievements to find out, and the answer deserves to be somewhere
// they can be sent to, from an email or from the daily loop, rather than to a
// point halfway down another page.
//
// WHAT IT REFUSES TO DO. It never adds the concerns together. The reasoning is
// in lib/working/movement.ts and it is worth reading before anyone is tempted:
// an average falls when a parent raises a new worry, which punishes the exact
// behaviour the product depends on, and it hides the only signal that matters
// by cancelling a climb against a slide.
//
// It also never claims cause. "You had been using the scripts" is a sequence,
// and the page says sequence, because two things happening in order is not one
// causing the other and a parent deserves to be told which one they are
// looking at.

export const dynamic = 'force-dynamic'

export default async function WhatIsWorkingPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)

  const [movements, profileRes, firstWinRead] = await Promise.all([
    user ? getMovements(supabase, user.id) : Promise.resolve([]),
    user ? supabase.from('profiles').select('created_at').eq('id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? readFirstWin(supabase, user.id).catch(() => null) : Promise.resolve(null),
  ])
  // The first fortnight (lib/working/first-week.ts): the day one line and the
  // child's first win sit at the top, because that is when a parent decides.
  const newFamily = isNewFamily((profileRes.data as { created_at?: string | null } | null)?.created_at)
  const firstDay = newFamily ? dayOneLine(movements) : null

  // Only journeys with two real numbers can say anything. Everything else is
  // waiting on a second check in, and it is told that plainly further down
  // rather than padded into the list with an empty row.
  const withMovement = movements.filter(m => m.points.length >= 2 && m.startScore != null && m.endScore != null)
  // Waiting is a feature, not an empty row: one look is a day, the second
  // look is what makes it a direction. A sorted worry is not waiting on anything.
  const waiting = waitingForSecondLook(movements.filter(m => !withMovement.includes(m)))

  const climbed = withMovement.filter(m => (m.endScore as number) > (m.startScore as number))
  const slipped = withMovement.filter(m => (m.endScore as number) < (m.startScore as number))
  const cameBack = movements.filter(m => m.recurrences > 0)

  // Whose line is whose. Every child is seeded the same four starting
  // worries, so in a two child family "Bedtime screens" appears twice and
  // the label alone says nothing. Names show only when they distinguish:
  // one child, or none named, and the suffix is noise.
  const namedChildren = new Set(movements.map(m => m.childName).filter(Boolean))
  const showNames = namedChildren.size > 1
  const withChild = (m: { label: string; childName: string | null }) =>
    showNames && m.childName ? `${m.label} · ${m.childName}` : m.label

  // A dip's most useful travel companion is the dip itself: the DiGi button
  // used to open the chat cold, so the parent had to retype what this page
  // was already displaying. The question rides along in ?ask= now.
  const dipAsk = slipped.length > 0
    ? encodeURIComponent(
        slipped.length === 1
          ? `${withChild(slipped[0])} slipped at our check ins. What is our next move?`
          : `A few of our worries slipped at check in: ${slipped.map(withChild).join(', ')}. Where do we start?`
      )
    : null

  // The one line at the top is the best real sentence there is, not a summary
  // of all of them. A summary would be a composite by the back door.
  const lead = climbed[0] ?? withMovement[0] ?? null
  const leadSentence = lead ? movementSentence(lead) : null

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <BackTo from={from} />

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        What is working
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.12, margin: '0 0 10px' }}>
        {leadSentence ? 'Here is what has actually moved' : 'This is where your answer will be'}
      </h1>

      {/* THE SENTENCE. Big, first, and sayable out loud to another person,
          which is the test Justin set and also the test of whether a family
          believes it. A number in a chart is something you look at. A sentence
          is something you tell your partner in the kitchen. */}
      {leadSentence ? (
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.4, margin: '0 0 6px' }}>
          {leadSentence}
        </p>
      ) : (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 6px' }}>
          Every check in you do writes one number against one worry. The second one is where this page starts working, because two numbers are a direction and one is just a day.
        </p>
      )}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 22px' }}>
        Each worry keeps its own line. Nothing here is added together, because a family carrying three things and a family carrying nine do not share a scale, and an average would drop the moment you told us about something new.
      </p>

      {/* SINCE DAY ONE. Only in the first fortnight, and only true lines:
          the day one comparison once a worry has two looks, and the child's
          first win from their own side of the app, or the quickest way to it. */}
      {newFamily && (firstDay || firstWinRead) && (
        <div style={{ background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', padding: '16px 18px', marginBottom: '18px', display: 'grid', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Since day one
          </div>
          {firstDay && (
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>
              {firstDay}
            </p>
          )}
          {firstWinRead?.win ? (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
              <strong>The first win.</strong> {firstWinRead.win.line} It is on their side of the app too, where they can see it.
            </p>
          ) : firstWinRead ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                <strong style={{ color: 'var(--ink)' }}>The first win is one job away.</strong> Put one small job on {firstWinRead.childName ? `${firstWinRead.childName}'s` : 'the'} board tonight. When it is ticked, the stars show on their side and the win shows here.
              </p>
              <Link href={firstWinRead.childId ? `/dashboard/quests?child=${firstWinRead.childId}` : '/dashboard/quests'} style={{
                display: 'inline-flex', alignItems: 'center', justifySelf: 'start', minHeight: 44, background: '#fff', color: 'var(--ink)',
                border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '10px 16px', textDecoration: 'none',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              }}>
                Add one job →
              </Link>
            </div>
          ) : null}
        </div>
      )}

      {withMovement.length > 0 && (
        <div style={{ background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', padding: '6px 18px 14px', marginBottom: '18px' }}>
          {withMovement.map((m, i) => {
            const start = m.startScore as number
            const end = m.endScore as number
            const tone = end > start ? 'up' : end < start ? 'down' : 'flat'
            return (
              <div
                key={m.concernId}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 0',
                  borderTop: i === 0 ? 'none' : '2px dotted rgba(26,26,46,0.18)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
                    {m.label}
                    {showNames && m.childName && (
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--ink-muted)', fontSize: 'var(--text-base)' }}>
                        {' '}· {m.childName}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '3px' }}>
                    {start} to {end}
                    {m.observed && m.weeks >= 1 ? ` ${spanWords(m.weeks)}` : ''}
                    {m.status === 'resolved' ? ' · sorted' : ''}
                    {m.recurrences > 0 ? ` · back ${m.recurrences}x` : ''}
                  </div>
                  {/* The sequence, never the claim. */}
                  {m.used.length > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      alongside {usedWords(m.used[0].type)}
                    </div>
                  )}
                </div>
                <MovementLine points={m.points} tone={tone} />
              </div>
            )
          })}
        </div>
      )}

      {/* THE ONES THAT SLIPPED GET THEIR OWN SENTENCE, and it is not an alarm.
          A parent who tells us a week was harder has just done something
          difficult, and the answer to that is a next move rather than a red
          number. They are already in the list above; this is the offer. */}
      {slipped.length > 0 && (
        <div style={{ background: 'var(--stage-1)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-btn)', padding: '15px 17px', marginBottom: '18px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '4px' }}>
            {slipped.length === 1 ? `${withChild(slipped[0])} has gone the other way` : `${slipped.length} of these have gone the other way`}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            A dip is information, not a verdict. It usually means something changed at home rather than that anything failed, and it is the most useful thing to bring to DiGi.
          </p>
          <Link href={dipAsk ? `/dashboard/digi?ask=${dipAsk}` : '/dashboard/digi'} style={{
            display: 'inline-flex', alignItems: 'center', background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 'var(--radius-tile)', padding: '11px 18px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}>
            Talk it through with DiGi
          </Link>
        </div>
      )}

      {cameBack.length > 0 && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 18px' }}>
          {cameBack.length} of these came back after being sorted. That is normal, and it is worth knowing rather than hiding: the ones that keep returning are the ones to build a proper plan around.
        </p>
      )}

      {waiting.length > 0 && (
        <div style={{ background: 'var(--cream)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-btn)', padding: '15px 17px', marginBottom: '18px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Waiting for your second look
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px', display: 'grid', gap: '4px' }}>
            {waiting.map(m => (
              <li key={m.concernId} style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45 }}>
                <strong>{withChild(m)}</strong>
                <span style={{ color: 'var(--ink-soft)' }}>: {lookWord(m.points[0].score)} at your first look</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            One look is a day. The second is a direction, and that is when {waiting.length === 1 ? 'it gets' : 'they get'} a line above.
          </p>
          <Link href="/dashboard/checkin" style={{
            display: 'inline-flex', alignItems: 'center', minHeight: 44, background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 'var(--radius-tile)', padding: '10px 18px', textDecoration: 'none', border: 'var(--edge)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}>
            Take the second look
          </Link>
        </div>
      )}

      {movements.length === 0 && (
        <div style={{ background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', padding: '18px 20px', marginBottom: '18px' }}>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Nothing to read yet. The check in on Home is where these numbers come from, and the first one is the line everything after it is measured against.
          </p>
        </div>
      )}

      {/* The record lives elsewhere, and saying so is what keeps the two pages
          from growing into each other again. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0 }}>
        The journeys, the stamps and the readiness readings are in{' '}
        <Link href="/dashboard/pathway" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'none' }}>the passport</Link>.
      </p>
    </div>
  )
}
