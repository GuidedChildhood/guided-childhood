'use client'

import { useEffect, useState } from 'react'

// The community bite: one question a month, asked on Home, answered in one tap,
// and the moment it is answered it turns into the thing it is really for, the
// crowd. A parent who finds out that most of the other families are fighting
// the same handover has learned something no advice line can tell them.
//
// The shape follows the deck cards: a coloured band with a curved bottom, big
// type, one clear thing to do. Gold, because this is the warm one.
//
// Quiet by default. No poll, no card. Answered and read, no card until next
// month. It never nags and it never blocks the day.

type Poll = { id: string; question: string; options: string[]; month: string }
type Feed = { poll: Poll | null; myChoice: number | null; counts: number[]; total: number }

const SEEN_PREFIX = 'gc_community_bite_'

// Asked at the start of the month and only then. A question that sits on Home
// all month stops being a moment and becomes furniture, so the bite has a short
// window: the first seven days, then it waits for next month whether it was
// answered or not.
const ASK_WINDOW_DAYS = 7

// How long the thank you stays up before the card takes itself away. Long
// enough to read what happens to the answer, short enough that Home is theirs
// again without a tap.
const CLOSE_AFTER_MS = 7000

export default function CommunityBite() {
  const [feed, setFeed] = useState<Feed | null>(null)
  const [busy, setBusy] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  // Just answered in this session: the results are the reward, so they stay up
  // until the parent closes them rather than vanishing on the next load.
  const [justVoted, setJustVoted] = useState(false)

  useEffect(() => {
    let live = true
    fetch('/api/community/poll')
      .then(r => r.json())
      .then((d: Feed) => {
        if (!live) return
        setFeed(d)
        // Already answered a previous month's bite and read the result: stay out
        // of the way until a new question lands.
        if (d.poll && d.myChoice !== null) {
          try {
            if (localStorage.getItem(SEEN_PREFIX + d.poll.id) === '1') setDismissed(true)
          } catch { /* private mode, they see it once more */ }
        }
      })
      .catch(() => {})
    return () => { live = false }
  }, [])

  async function vote(choice: number) {
    if (!feed?.poll || busy) return
    setBusy(true)
    try {
      const r = await fetch('/api/community/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: feed.poll.id, choice }),
      })
      const d = await r.json()
      if (r.ok) {
        setFeed(f => f ? { ...f, myChoice: d.myChoice, counts: d.counts, total: d.total } : f)
        setJustVoted(true)
        // Answered: show them where it goes, then get out of the way on its own.
        // The answer is already saved, so closing loses nothing and DiGi still
        // has it to bring up next month.
        setTimeout(close, CLOSE_AFTER_MS)
      }
    } catch { /* leave it up so they can try again */ }
    finally { setBusy(false) }
  }

  function close() {
    if (feed?.poll) {
      try { localStorage.setItem(SEEN_PREFIX + feed.poll.id, '1') } catch { /* private mode */ }
    }
    setDismissed(true)
  }

  // Outside the asking window, or already answered on a previous visit, the
  // card is simply not there. Only a fresh answer keeps it up long enough to
  // read the thank you.
  const inAskWindow = new Date().getDate() <= ASK_WINDOW_DAYS
  if (!feed?.poll || dismissed) return null
  if (!inAskWindow && !justVoted) return null
  if (feed.myChoice !== null && !justVoted) return null
  const { poll, myChoice, counts, total } = feed
  const answered = myChoice !== null
  const top = answered && counts.length ? Math.max(...counts) : 0

  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)',
        borderRadius: '22px', overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(26,26,46,0.03), 0 14px 34px -12px rgba(26,26,46,0.12)',
      }}>
        {/* The band, curved through the bottom like the deck cards */}
        <div style={{
          background: 'var(--gold)', padding: '16px 20px 20px',
          borderRadius: '0 0 50% 50% / 0 0 26px 26px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span aria-hidden style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>📣</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>
              This month
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--ink)', lineHeight: 1.15 }}>
              Community bite
            </span>
          </span>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              border: 'none', background: 'rgba(255,255,255,0.55)', cursor: 'pointer',
              fontSize: 16, color: 'var(--ink)', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '18px 20px 20px' }}>
          {total > 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 8 }}>
              {total} {total === 1 ? 'family has' : 'families have'} answered
            </div>
          )}
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(20px, 5.4vw, 24px)', lineHeight: 1.2, letterSpacing: '-0.01em',
            color: 'var(--ink)', margin: '0 0 16px',
          }}>
            {poll.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {poll.options.map((opt, i) => {
              const n = counts[i] ?? 0
              const pct = total > 0 ? Math.round((n / total) * 100) : 0
              const mine = myChoice === i
              const isTop = answered && n === top && n > 0
              return (
                <button
                  key={i}
                  onClick={() => vote(i)}
                  disabled={busy}
                  style={{
                    position: 'relative', overflow: 'hidden', textAlign: 'left',
                    background: mine ? 'var(--gold-lt)' : '#fff',
                    border: `1.5px solid ${mine ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 14, padding: '13px 15px', cursor: busy ? 'default' : 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--ink)',
                    lineHeight: 1.4,
                  }}
                >
                  {/* Once answered the row fills to its share, so the shape of
                      the crowd reads at a glance without a chart. */}
                  {answered && (
                    <span aria-hidden style={{
                      position: 'absolute', inset: 0, width: `${pct}%`,
                      background: isTop ? 'rgba(233,185,73,0.30)' : 'rgba(26,26,46,0.06)',
                      transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    }} />
                  )}
                  <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flex: 1, minWidth: 0 }}>{opt}</span>
                    {answered && (
                      <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: mine ? 'var(--gold-dark)' : 'var(--ink-muted)' }}>
                        {pct}%{mine ? ' ✓' : ''}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          {answered && (
            <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '14px 0 0' }}>
              {justVoted ? 'Thanks. ' : ''}
              That is the honest shape of it across every family here, and whatever you picked, you are in good company. DiGi keeps hold of your answer so it can pick the thread back up, and the full read lands in your Sunday email once a month. Closing this now.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
