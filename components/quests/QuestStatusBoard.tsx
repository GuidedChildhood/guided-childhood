'use client'

import { useEffect, useMemo, useState } from 'react'

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
  // Whether the parent has picked a tile themselves. Until they do, the board
  // picks the one with something in it rather than sitting on an empty pile.
  const [touched, setTouched] = useState(false)
  // The quiet board, opened by hand. Only reachable when nothing needs them.
  const [openAnyway, setOpenAnyway] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/quests')
      .then(r => r.json())
      .then(d => { if (alive) setData({ children: d.children ?? [], quests: d.quests ?? [], ticks: d.ticks ?? [], links: d.links ?? [] }) })
      .catch(() => { if (alive) setData({ children: [], quests: [], ticks: [], links: [] }) })
    return () => { alive = false }
  }, [])

  const buckets = useMemo(() => {
    const out: Record<BucketKey, { key: string; title: string; emoji: string; who: string; note?: string }[]> =
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
        note: stale ? `Ticked ${t.tick_date}` : undefined,
      })
    }

    for (const t of data.ticks.filter(t => t.status === 'approved')) {
      const q = questById.get(t.quest_id)
      if (!q) continue
      out.done.push({
        key: t.id, title: q.title, emoji: q.emoji ?? '⭐',
        who: nameOf.get(t.child_id ?? '') ?? 'Your child',
        note: t.tick_date === todayStr ? 'Today' : t.tick_date,
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
      }
      if (q.child_id && hasApp.has(q.child_id)) out.sent.push(row)
      else out.withyou.push(row)
    }

    return out
  }, [data])

  if (!data) return <div style={{ height: 132, marginBottom: 18, opacity: 0.35 }} aria-hidden />
  const nothingAtAll = (['waiting', 'sent', 'withyou', 'done'] as BucketKey[]).every(k => buckets[k].length === 0)
  if (nothingAtAll) return null

  // Nothing needs the parent when both piles that cost somebody something are
  // empty. Sent and Done are information: a job on a child's app is not a task
  // for the grown up, and a job already agreed is a receipt.
  const needsYou = buckets.waiting.length + buckets.withyou.length

  // The board defaults to Waiting on you, which is right when there IS one and
  // wrong the rest of the time: with nothing waiting and three jobs sent, a
  // parent met a selected tile reading 0 above a list that was empty by
  // construction, under a heading offering to show them what is in it. The
  // board now opens on a pile that has something in it, and respects the
  // parent's own choice the moment they make one.
  const best: BucketKey =
    buckets.waiting.length ? 'waiting'
    : buckets.withyou.length ? 'withyou'
    : buckets.sent.length ? 'sent'
    : 'done'
  const shown = touched ? active : best
  const rows = buckets[shown]

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
    return (
      <button
        onClick={() => setOpenAnyway(true)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
          padding: '13px 16px', marginBottom: 18, cursor: 'pointer', textAlign: 'left',
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
          {rows.slice(0, 8).map(r => (
            <div key={r.key} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: '1.5px solid var(--border)', borderRadius: 13, padding: '10px 12px',
            }}>
              <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1, flexShrink: 0 }}>{r.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.title}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 1 }}>
                  {r.who}{r.note ? ` · ${r.note}` : ''}
                </span>
              </span>
            </div>
          ))}
          {rows.length > 8 && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: '2px 0 0' }}>
              and {rows.length - 8} more
            </p>
          )}
        </div>
      )}

      {/* The waiting pile is the only one with an action, and it already has a
          home further down the page, so this points at it rather than building
          a second approve button that could fall out of step with the first. */}
      {active === 'waiting' && rows.length > 0 && (
        <a
          href="#quest-board"
          className="btn btn-gold"
          style={{ display: 'inline-flex', marginTop: 13, padding: '11px 20px', fontSize: 'var(--text-base)', textDecoration: 'none' }}
        >
          Go and say yes
        </a>
      )}
    </div>
  )
}
