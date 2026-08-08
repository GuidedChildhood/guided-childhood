'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { kidLessonForQuestTitle } from '@/lib/quests/kid-lessons'
import { craftForQuestTitle, craftHref } from '@/lib/quests/craft-links'
import LessonCheck from './LessonCheck'

// Where every job actually is.
//
// The lifecycle has been correct in the data for a long time: a child's tap
// writes a pending tick, only an approved tick becomes minutes, a rejected one
// becomes nothing. What was missing was any single place a parent could look
// and see it. The states were spread across three separate cards further down
// the page, so the honest summary of the situation was Justin's: "I believe the
// logic is right but I cannot see it working."
//
// Checked against the references first, per the Mobbin first rule. monday.com
// puts a row of count tiles at the top of My work that double as the filter,
// which is the clearest at a glance answer to "where is everything" on a phone.
// Jobber pairs a selected filter chip with a heading that names the filter, so
// the list below is never ambiguous about what it is showing. Tiimo groups by
// state with a count per group. All three agree the count and the filter should
// be the same control, so that is what this is.
//
// Four buckets, and they are the real lifecycle rather than four nice words:
//
//   Waiting on you    a pending tick. The child says it is done and the stars
//                     are NOT theirs yet. This is the only bucket that costs
//                     somebody something if it is ignored.
//   On their app      sent, on the child's list, not ticked yet. Path A.
//   To do with you    no child app, so nobody can tick it but the parent. This
//                     is the printed sheet and fridge flow. Path B.
//   Done              approved. The stars are real minutes.
//
// Rejected has no tile on purpose. A parent who said no does not need it
// counted back at them, and a child does not need a running total of refusals.

type Child = { id: string; name: string; use_mode?: string | null }
type Quest = {
  id: string; child_id: string | null; title: string; emoji: string | null
  stars: number | null; schedule: string | null; schedule_days: number[] | null
}
type Tick = { id: string; quest_id: string; child_id: string | null; status: string; tick_date: string }
type Link = { child_id: string; token: string }

type BucketKey = 'waiting' | 'sent' | 'withyou' | 'done'

const TILE_LABEL: Record<BucketKey, string> = {
  waiting: 'Waiting on you',
  sent: 'On their app',
  withyou: 'To do with you',
  done: 'Done',
}

// What the list under the tiles is showing, said in a sentence, the way Jobber
// names the filter above the results.
const BUCKET_BLURB: Record<BucketKey, string> = {
  waiting: 'They say these are done. The stars are not theirs until you agree.',
  sent: 'On their list right now. Nothing for you to do until they tick it.',
  withyou: 'No app on their side, so these are yours to mark when they are done.',
  done: 'Agreed by you, and already counted as minutes.',
}

const EMPTY: Record<BucketKey, string> = {
  waiting: 'Nothing waiting on you. All caught up.',
  sent: 'Nothing sitting on their app right now.',
  withyou: 'Nothing to mark off yourself today.',
  done: 'Nothing agreed yet this week.',
}

/** Does this quest fall on today? Mirrors the board's own schedule rules. */
function dueToday(q: Quest, dow: number): boolean {
  if (Array.isArray(q.schedule_days) && q.schedule_days.length > 0) return q.schedule_days.includes(dow)
  switch (q.schedule) {
    case 'weekdays': return dow >= 1 && dow <= 5
    case 'weekend': return dow === 0 || dow === 6
    case 'once': return true
    default: return true
  }
}

export default function QuestStatusBoard() {
  const [data, setData] = useState<{
    children: Child[]; quests: Quest[]; ticks: Tick[]; links: Link[]
  } | null>(null)
  const [active, setActive] = useState<BucketKey>('waiting')
  // Ticks this panel has just approved, so a row leaves the moment it is
  // agreed rather than after a refetch. The stars are already real by then.
  const [agreed, setAgreed] = useState<Set<string>>(new Set())
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [allBusy, setAllBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  // Whether the parent has picked a tile themselves. Until they do, the board
  // picks the one with something in it rather than sitting on an empty pile.
  const [touched, setTouched] = useState(false)
  // The quiet board, opened by hand. Only reachable when nothing needs them.
  const [openAnyway, setOpenAnyway] = useState(false)
  const [reminding, setReminding] = useState<string | null>(null)
  // Per child, not one flag for the row. With two children the single flag
  // swallowed the second button the moment the first was nudged, so a parent
  // could remind Teo or Alma but never both.
  const [reminded, setReminded] = useState<Set<string>>(new Set())
  const [remindFailed, setRemindFailed] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/quests')
      .then(r => r.json())
      .then(d => { if (alive) setData({ children: d.children ?? [], quests: d.quests ?? [], ticks: d.ticks ?? [], links: d.links ?? [] }) })
      .catch(() => { if (alive) setData({ children: [], quests: [], ticks: [], links: [] }) })
    return () => { alive = false }
  }, [])

  // "Ticked 2026-08-03" is a database talking to a parent (Justin's
  // screenshot, 7 August). The mono meta line also wrapped mid date, splitting
  // the year from the day. Say it the way a person would: Today, Yesterday, or
  // Sun 3 Aug. Noon anchors the parse so a timezone cannot shift the day.
  const niceDay = (iso: string, todayStr: string): string => {
    if (iso === todayStr) return 'Today'
    const d = new Date(`${iso}T12:00:00`)
    if (Number.isNaN(d.getTime())) return iso
    const yesterday = new Date(`${todayStr}T12:00:00`)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const buckets = useMemo(() => {
    const out: Record<BucketKey, { key: string; title: string; emoji: string; who: string; note?: string; childId?: string }[]> =
      { waiting: [], sent: [], withyou: [], done: [] }
    if (!data) return out

    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)
    const dow = today.getDay()
    const nameOf = new Map(data.children.map(c => [c.id, c.name]))
    const hasApp = new Set(data.links.map(l => l.child_id))
    const questById = new Map(data.quests.map(q => [q.id, q]))

    // Anything still pending, however old. The API no longer windows these out,
    // so a tick from a fortnight ago shows up here rather than vanishing.
    for (const t of data.ticks.filter(t => t.status === 'pending')) {
      const q = questById.get(t.quest_id)
      if (!q) continue
      const stale = t.tick_date < todayStr
      out.waiting.push({
        key: t.id,
        title: q.title,
        emoji: q.emoji ?? '⭐',
        who: nameOf.get(t.child_id ?? '') ?? 'Your child',
        // Naming the age matters. An old pending tick is the case that used to
        // disappear, and a parent should see that it has been sitting there.
        note: stale ? `Ticked ${niceDay(t.tick_date, todayStr)}` : undefined,
      })
    }

    for (const t of data.ticks.filter(t => t.status === 'approved')) {
      const q = questById.get(t.quest_id)
      if (!q) continue
      out.done.push({
        key: t.id, title: q.title, emoji: q.emoji ?? '⭐',
        who: nameOf.get(t.child_id ?? '') ?? 'Your child',
        note: niceDay(t.tick_date, todayStr),
      })
    }

    // Today's jobs with no tick on them yet. Which bucket depends only on
    // whether that child has an app to receive it, which IS the difference
    // between path A and path B.
    const tickedToday = new Set(
      data.ticks.filter(t => t.tick_date === todayStr && t.status !== 'rejected').map(t => t.quest_id)
    )
    for (const q of data.quests) {
      if (!dueToday(q, dow) || tickedToday.has(q.id)) continue
      const row = {
        key: q.id, title: q.title, emoji: q.emoji ?? '⭐',
        who: nameOf.get(q.child_id ?? '') ?? 'Anyone',
        childId: q.child_id ?? undefined,
      }
      if (q.child_id && hasApp.has(q.child_id)) out.sent.push(row)
      else out.withyou.push(row)
    }

    return out
  }, [data])

  // Saying yes, right here.
  //
  // Justin, on this panel: "these waiting for you I cannot ok them individually
  // or the button for all does not work."
  //
  // He is right on both counts and they were the same decision. Every row here
  // was a plain div, and the only action was a "Go and say yes" link that
  // scrolled to the board further down the page. A parent looking at six jobs
  // their child has done, on a card that names each one, cannot agree to any of
  // them without being sent somewhere else first. Nothing was broken exactly;
  // it just did not do the thing it was showing you.
  //
  // The comment on the old link said a second approve button "could fall out of
  // step with the first". Both call the same endpoint with the same tick id, so
  // there is nothing to fall out of step: the row IS the tick.
  async function approve(tickId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/quests/approve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tick_id: tickId, decision: 'approve' }),
      })
      return res.ok
    } catch { return false }
  }

  async function sayYes(tickId: string) {
    if (busyKey || allBusy) return
    setBusyKey(tickId); setFailed(null)
    const ok = await approve(tickId)
    if (ok) setAgreed(prev => new Set(prev).add(tickId))
    else setFailed('That did not save. Try again.')
    setBusyKey(null)
  }

  async function sayYesToAll(ids: string[]) {
    if (allBusy || ids.length === 0) return
    setAllBusy(true); setFailed(null)
    // One at a time. The approve route settles gift debts, pushes to the child
    // and checks the streak on every call, and firing eight of those at once is
    // how one of them quietly loses a race with another.
    const done: string[] = []
    for (const id of ids) {
      if (await approve(id)) done.push(id)
    }
    if (done.length > 0) setAgreed(prev => new Set([...prev, ...done]))
    // Named, not swallowed. A partial failure used to be indistinguishable from
    // a full success because neither said anything.
    if (done.length < ids.length) {
      setFailed(done.length === 0
        ? 'None of those saved. Try again.'
        : `${ids.length - done.length} of those did not save. Try again.`)
    }
    setAllBusy(false)
  }

  // Nudging the child from the caught up row.
  //
  // One per child rather than one per job: the ask is go and look at your list,
  // not do this specific thing, so it sends a general reminder and the child's
  // screen shows one line instead of ten.
  async function remind(childId: string, name: string) {
    if (reminding) return
    setReminding(childId)
    setRemindFailed(null)
    try {
      const res = await fetch('/api/quests/nudge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId }),
      })
      if (res.ok) setReminded(prev => new Set(prev).add(childId))
      else setRemindFailed(`That did not reach ${name}. Try again.`)
    } catch {
      setRemindFailed(`That did not reach ${name}. Try again.`)
    }
    setReminding(null)
  }

  if (!data) return <div style={{ height: 132, marginBottom: 18, opacity: 0.35 }} aria-hidden />
  const nothingAtAll = (['waiting', 'sent', 'withyou', 'done'] as BucketKey[]).every(k => buckets[k].length === 0)
  if (nothingAtAll) return null

  // Nothing needs the parent when both piles that cost somebody something are
  // empty. Sent and Done are information: a job on a child's app is not a task
  // for the grown up, and a job already agreed is a receipt.
  // Anything agreed in this panel leaves the waiting pile at once, so the tile
  // count, the list and the button all drop together on the same tap.
  const stillWaiting = buckets.waiting.filter(r => !agreed.has(r.key))
  const needsYou = stillWaiting.length + buckets.withyou.length

  // The board defaults to Waiting on you, which is right when there IS one and
  // wrong the rest of the time: with nothing waiting and three jobs sent, a
  // parent met a selected tile reading 0 above a list that was empty by
  // construction, under a heading offering to show them what is in it. The
  // board now opens on a pile that has something in it, and respects the
  // parent's own choice the moment they make one.
  const best: BucketKey =
    stillWaiting.length ? 'waiting'
    : buckets.withyou.length ? 'withyou'
    : buckets.sent.length ? 'sent'
    : 'done'
  const shown = touched ? active : best
  const rows = shown === 'waiting' ? stillWaiting : buckets[shown]

  // Caught up, so say it in a line rather than a card.
  //
  // Justin, on opening Quests: can the top two be "smaller or more user
  // friendly as we can see the tabs below". The screenshot behind that is this
  // board reading 0, 3, 0, 0 and then "Nothing waiting on you. All caught up."
  // Four tiles, a heading, a blurb and an empty list, all to report that
  // nothing needs doing, sitting above the tiles a parent came for.
  //
  // Same lesson as the Rocket Money and Monarch setup lists pulled for the
  // homepage: what is outstanding stays open, what is settled folds away. It
  // is one line here, still tappable for the parent who does want the detail,
  // because the information is real and only its size was wrong.
  if (needsYou === 0 && !openAnyway) {
    const onApp = buckets.sent.length
    // Who still has jobs sitting on their app, once each. These are the only
    // children a reminder would mean anything to.
    const toRemind = Array.from(
      new Map(buckets.sent.filter(r => r.childId).map(r => [r.childId as string, r.who])).entries()
    )
    return (
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
        padding: '13px 16px', marginBottom: 18,
      }}>
        {/* The row is no longer one big button, because it now holds a second
            action and a button inside a button is not a thing. The text is the
            tappable part, exactly as before. */}
        <button
          onClick={() => setOpenAnyway(true)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)' }}>✓</span>
          <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45 }}>
            <strong>Nothing waiting on you.</strong>{' '}
            <span style={{ color: 'var(--ink-soft)' }}>
              {onApp > 0
                ? `${onApp} job${onApp === 1 ? '' : 's'} on their app.`
                : 'Every job is done.'}
            </span>
          </span>
          {/* A chevron, not a word. "Where" alone was shorthand for the heading
              this row replaces and read as a riddle without it, and the chevron
              is what every other tappable row in this product already wears. */}
          <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-light)' }}>
            ›
          </span>
        </button>

        {/* Nothing waiting on YOU is not the same as nothing to do, and this is
            the one thing a parent can actually do about the other half. */}
        {toRemind.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 11, paddingTop: 11, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
              {toRemind.every(([id]) => reminded.has(id)) ? 'Nudged.' : 'Give them a nudge?'}
            </span>
            {toRemind.map(([id, name]) => reminded.has(id) ? (
              <span key={id} style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
                {name} 💛
              </span>
            ) : (
              <button
                key={id}
                onClick={() => remind(id, name)}
                disabled={reminding !== null}
                style={{
                  background: 'var(--cream)', border: '1.5px solid var(--border)',
                  borderRadius: 999, padding: '6px 13px', cursor: reminding ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'var(--text-sm)', color: 'var(--ink)',
                }}
              >
                {reminding === id ? 'Sending' : `Remind ${name}`}
              </button>
            ))}
            {remindFailed && (
              <span style={{ width: '100%', fontSize: 'var(--text-sm)', color: 'var(--danger)' }}>{remindFailed}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
      padding: '18px 18px 20px', marginBottom: 18,
    }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 3px', letterSpacing: '-0.02em' }}>
        Where every job is
      </h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
        Tap a number to see what is in it.
      </p>

      {/* The count tiles, which are also the filter. monday.com's My work
          pattern: one control, so the number you are reading and the list you
          are looking at can never disagree. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 7, marginBottom: 15 }}>
        {(['waiting', 'sent', 'withyou', 'done'] as BucketKey[]).map(k => {
          const n = buckets[k].length
          const on = shown === k
          // Only the waiting pile is ever urgent, because it is the only one
          // where somebody is out of pocket while it sits there.
          const urgent = k === 'waiting' && n > 0
          return (
            <button
              key={k}
              onClick={() => { setTouched(true); setActive(k) }}
              aria-pressed={on}
              style={{
                // TOP ALIGNED, EXPLICITLY. Justin, 8 August 2026: "the numbers
                // on top tabs need to be aligned."
                //
                // They were, in Chrome. WebKit vertically CENTRES the content
                // of a <button> by default, and these four labels wrap to one,
                // three and four lines, so each tile's content block is a
                // different height and each number settled at a different
                // level. Four numbers meant to be read as a row, none of them
                // on the same line, and only on the phone.
                //
                // A flex column pinned to the start overrides that default, so
                // the numbers sit on one line whatever the labels do.
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'flex-start',
                minWidth: 0, textAlign: 'left', cursor: 'pointer',
                border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                background: on ? 'var(--terracotta-lt)' : '#fff',
                borderRadius: 14, padding: '9px 9px 10px',
              }}
            >
              <span style={{
                display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1,
                color: urgent ? 'var(--terracotta-dark)' : n === 0 ? 'var(--ink-light)' : 'var(--ink)',
              }}>
                {n}
              </span>
              <span style={{
                display: 'block', fontSize: 'var(--text-sm)', lineHeight: 1.25, marginTop: 4,
                color: on ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: on ? 700 : 500,
              }}>
                {TILE_LABEL[k]}
              </span>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
        {BUCKET_BLURB[shown]}
      </p>

      {rows.length === 0 ? (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0, padding: '6px 0 2px' }}>
          {EMPTY[shown]}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.slice(0, 8).map(r => {
            // A finished lesson can be checked rather than just believed. Only
            // in the waiting pile: once the parent has said yes it is a
            // receipt, and asking then is asking about something already
            // settled. See LessonCheck for why the answers stay hidden.
            const lesson = shown === 'waiting' ? kidLessonForQuestTitle(r.title) : null
            // Some jobs are a game we made, sitting a tap away on the game pack
            // page. Justin: "Play good night screens should take you there."
            // Naming one at a parent and not opening it is the app knowing
            // something and not saying it. Unrecognised titles stay plain text
            // rather than becoming a link to a guess.
            const craft = craftForQuestTitle(r.title)
            return (
            <div key={r.key} style={{
              border: '1.5px solid var(--border)', borderRadius: 13, padding: '10px 12px',
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1.3, flexShrink: 0 }}>{r.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.25, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {craft ? (
                    <Link href={craftHref(craft)} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                      {r.title}
                      {/* The arrow rather than an underline, because the row
                          already carries an emoji and a Yes button and a rule
                          under the words would read as a fourth thing. */}
                      <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900, marginLeft: 6 }}>›</span>
                    </Link>
                  ) : r.title}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 1 }}>
                  {r.who}{r.note ? ` · ${r.note}` : ''}
                  {craft ? ' · TAP TO OPEN' : ''}
                </span>
              </span>
              {/* One tap, on the row that names the job. Only the waiting pile
                  has anything to agree to: Done is a receipt, and the other two
                  are not the parent's to tick from here. */}
              {shown === 'waiting' && (
                <button
                  onClick={() => sayYes(r.key)}
                  disabled={busyKey === r.key || allBusy}
                  aria-label={`Say yes to ${r.title}`}
                  style={{
                    flexShrink: 0, border: 'none', borderRadius: 11, cursor: (busyKey === r.key || allBusy) ? 'default' : 'pointer',
                    background: 'var(--terracotta)', color: 'var(--ink)', padding: '9px 14px',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                    boxShadow: '0 3px 0 var(--terracotta-dark)',
                    opacity: (busyKey === r.key || allBusy) ? 0.6 : 1,
                  }}
                >
                  {busyKey === r.key ? '...' : 'Yes'}
                </button>
              )}
            </div>
            {/* Under the row, not inside its text column. Beside the emoji and
                the Yes button a three line question had about half the card to
                wrap into and set two words per line. The questions are the
                point of this panel, so they get the whole width. */}
            {lesson && <LessonCheck lesson={lesson} childName={r.who} />}
            </div>
            )
          })}
          {rows.length > 8 && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: '2px 0 0' }}>
              and {rows.length - 8} more
            </p>
          )}
        </div>
      )}

      {/* The waiting pile is the only one with an action, and it already has a
          home further down the page, so this points at it rather than building
          a second approve button that could fall out of step with the first.

          `shown`, NOT `active`. This was the one place in the component still
          reading the raw state, and the raw state defaults to 'waiting' before
          a parent has touched anything. So on a morning with nothing to approve
          the board correctly opened on the "on their app" pile, printed its
          blurb ("nothing for you to do until they tick it"), listed six jobs
          the child has not ticked yet, and then offered Go and say yes
          underneath, pointing at an approve list with nothing in it.

          Justin: "there are no items to say yes to, so it should be clever
          enough not to ask." Every other reader here was already using `shown`,
          which is why the tiles, the blurb and the list were all right and only
          the button was wrong. */}
      {shown === 'waiting' && rows.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 13 }}>
          <button
            onClick={() => sayYesToAll(rows.map(r => r.key))}
            disabled={allBusy || busyKey !== null}
            className="btn btn-gold"
            style={{ display: 'inline-flex', padding: '11px 20px', fontSize: 'var(--text-base)', border: 'none', cursor: (allBusy || busyKey !== null) ? 'default' : 'pointer', opacity: (allBusy || busyKey !== null) ? 0.6 : 1 }}
          >
            {allBusy ? 'Saying yes...' : rows.length === 1 ? 'Say yes' : `Say yes to all ${rows.length}`}
          </button>
          {/* The board further down is still there for the parent who wants to
              turn one of these down, which this panel deliberately cannot do:
              a reject is a conversation and should never be one tap away from
              an approve on a list you are working through quickly. */}
          <a
            href="#quest-board"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none' }}
          >
            One at a time ›
          </a>
        </div>
      )}

      {failed && (
        <p role="status" style={{ fontSize: 'var(--text-base)', color: '#B93B3F', fontWeight: 600, margin: '9px 0 0' }}>
          {failed}
        </p>
      )}
    </div>
  )
}
