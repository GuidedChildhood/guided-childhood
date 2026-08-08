'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Review } from '@/components/digi/WeeklyRoundup'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'

// The Today card: volume two of the "this needs you" pattern from phase 3 of
// the type plan. Chunky rows that tick and fold, the Finch pattern the daily
// check in already proved. Everything that used to be its own banner, toast
// or nudge card on Home becomes a row in here instead: one place to look,
// one motion to learn.
//
// WHAT EARNS A ROW. A job that matters today but that nobody is stood
// waiting for: the weekly round up, the child app handover, the deal
// review, the stage's device settings, unread ideas. A person waiting right
// now is a Now (see HomeLive); a bare number is a count chip on the tab bar.
//
// THE TWO TAPS, and why they are different. The row body navigates to the
// job, because these are jobs done elsewhere and a row that pretends
// otherwise is a lying control. The circle puts the row away: each row
// declares what putting away honestly means for it (the round up dismisses
// on the server, the deal review snoozes a fortnight, the device check
// confirms for the stage), and rows with no honest away state simply have
// no live circle. The fold takes the half second beat the mock showed, so
// the answer is seen to land, unless the parent asked for reduced motion.
//
// WHAT THIS REPLACED, so nobody re adds them: WeeklyReviewCard, the big
// DealReviewNudge card, DeviceSetupBanner and the ChildAppNudge card on
// Home. Their decisions all survive: the round up dismissal still writes to
// the server, the deal snooze and device confirm still use the same
// localStorage keys, and the child app row keeps the fold never gone rule
// by being permanent until the child opens their app or the family chooses
// paper. The QR code and the paper chart choice live one tap away on the
// Quests share tab, where that card already sent people.
//
// When nothing qualifies, the card renders nothing at all. The calm
// sentence belongs to the Now slot above; two calm lines is noise.

const DEAL_SNOOZE_KEY = 'gc_deal_review_snoozed'
const DEAL_SNOOZE_DAYS = 14

type Row = {
  key: string
  emoji: string
  title: string
  line: string
  href: string
  // What the circle honestly does, or undefined for rows with no away state.
  putAway?: () => void
  putAwayLabel?: string
}

export default function TodayCard({
  childApp = null,
  dealReview = null,
  deviceSetup = null,
}: {
  // The child has never opened their app and the family has not chosen the
  // paper chart. Server decided, same reading ChildAppNudge used.
  childApp?: { childName: string | null } | null
  // Days since anything in the family deal moved, when a review is due.
  dealReview?: { daysSinceChange: number } | null
  // The stage whose device settings have not been confirmed on this device.
  deviceSetup?: { stageId: number; stageName: string } | null
}) {
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [ideas, setIdeas] = useState(0)
  const [dealSnoozed, setDealSnoozed] = useState(true)
  const [deviceConfirmed, setDeviceConfirmed] = useState(true)
  // Rows put away this visit, so the fold is seen rather than instant.
  const [folding, setFolding] = useState<Set<string>>(new Set())
  const [gone, setGone] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/digi/weekly-review')
      .then(r => r.json())
      .then(d => setReview(d.review ?? null))
      .catch(() => {})
    const refresh = () => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => {
          const items = (d.items ?? []) as { kind?: string; urgent?: boolean }[]
          // Only what is NOT already the Now row upstairs: the non urgent
          // items, so the same thing is never said at two volumes at once.
          setIdeas(items.filter(i => !i.urgent).length)
        })
        .catch(() => {})
    }
    refresh()
    window.addEventListener(NOTIFS_CHANGED_EVENT, refresh)
    // The snoozes live on this device, read once the client is up.
    try {
      const raw = localStorage.getItem(DEAL_SNOOZE_KEY)
      setDealSnoozed(!!raw && (Date.now() - Number(raw)) / 86400000 < DEAL_SNOOZE_DAYS)
    } catch { setDealSnoozed(false) }
    if (deviceSetup) {
      try { setDeviceConfirmed(localStorage.getItem(`gc_device_setup_confirmed_${deviceSetup.stageId}`) === '1') } catch { setDeviceConfirmed(false) }
    }
    return () => window.removeEventListener(NOTIFS_CHANGED_EVENT, refresh)
  }, [deviceSetup])

  // The put away motion: tick fills, the half second beat, then the fold.
  function putAway(key: string, commit: () => void) {
    commit()
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced) { setGone(g => new Set(g).add(key)); return }
    setFolding(f => new Set(f).add(key))
    setTimeout(() => setGone(g => new Set(g).add(key)), 500)
  }

  const rows: Row[] = []

  if (review && review.status !== 'read' && review.status !== 'dismissed') {
    rows.push({
      key: 'roundup', emoji: '📖',
      title: 'Your weekly round up is ready',
      line: 'The balance, the wins, one thing to try',
      href: '/dashboard/week',
      putAwayLabel: 'Put the round up away',
      putAway: () => {
        fetch('/api/digi/weekly-review', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: review.id, status: 'dismissed' }),
        }).catch(() => { /* it returns next load, the safe way to fail */ })
      },
    })
  }

  if (ideas > 0) {
    rows.push({
      key: 'ideas', emoji: '💡',
      title: `${ideas} ${ideas === 1 ? 'new idea' : 'new ideas'} waiting`,
      line: 'From your child and DiGi, nothing urgent',
      href: '/dashboard/notifications',
    })
  }

  if (childApp) {
    const name = childApp.childName && childApp.childName !== 'Your child' ? childApp.childName : null
    rows.push({
      key: 'childapp', emoji: '📲',
      title: name ? `${name} has a side of this too` : 'Your child has a side of this too',
      line: 'Share the code, or choose the paper chart',
      href: '/dashboard/quests?tab=share',
      // No away state on purpose: the fold never gone rule. What retires it
      // is the child opening their app, or the paper choice on the far side.
    })
  }

  if (dealReview && !dealSnoozed) {
    const weeks = Math.floor(dealReview.daysSinceChange / 7)
    rows.push({
      key: 'deal', emoji: '🤝',
      title: 'Does the deal still fit?',
      line: `Nothing has changed for ${weeks === 1 ? 'a week' : `${weeks} weeks`}`,
      href: '/dashboard/quests#quest-manager',
      putAwayLabel: 'Ask again in a fortnight',
      putAway: () => {
        try { localStorage.setItem(DEAL_SNOOZE_KEY, String(Date.now())) } catch { /* private mode */ }
      },
    })
  }

  if (deviceSetup && !deviceConfirmed) {
    rows.push({
      key: 'device', emoji: '🛡️',
      title: `Check the ${deviceSetup.stageName} device settings`,
      line: 'Three settings, about two minutes',
      href: '/dashboard/devices',
      putAwayLabel: 'Done, all set',
      putAway: () => {
        try { localStorage.setItem(`gc_device_setup_confirmed_${deviceSetup.stageId}`, '1') } catch { /* private mode */ }
      },
    })
  }

  const live = rows.filter(r => !gone.has(r.key))
  if (live.length === 0) return null

  return (
    <div style={{
      background: 'var(--cream)', border: '1.5px solid var(--border)',
      borderRadius: 20, padding: 16, marginBottom: 20,
    }}>
      <h3 style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        margin: '0 0 10px',
      }}>
        Today
      </h3>
      {live.map(row => {
        const isFolding = folding.has(row.key)
        return (
          <div
            key={row.key}
            style={{
              display: 'grid', gridTemplateRows: isFolding ? '0fr' : '1fr',
              opacity: isFolding ? 0 : 1,
              transition: 'grid-template-rows 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              {/* The emoji tile sits left, the tick sits on the RIGHT edge:
                  the thumb side, the way every Finch row ticks one handed
                  (Mobbin capture, 8 Aug). Rows with no away state carry the
                  quiet chevron there instead. */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14,
                padding: '12px 13px', marginBottom: 8,
              }}>
                <span aria-hidden style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-base)' }}>
                  {row.emoji}
                </span>
                <button
                  onClick={() => router.push(row.href)}
                  style={{
                    flex: 1, minWidth: 0, textAlign: 'left', background: 'none',
                    border: 'none', padding: 0, cursor: 'pointer', font: 'inherit',
                    color: 'var(--ink)',
                  }}
                >
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
                    {row.title}
                  </span>
                  <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: 1 }}>
                    {row.line}
                  </span>
                </button>
                {row.putAway ? (
                  <button
                    onClick={() => putAway(row.key, row.putAway!)}
                    aria-label={row.putAwayLabel}
                    title={row.putAwayLabel}
                    style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                      background: isFolding ? 'var(--terracotta)' : '#fff',
                      border: '2.5px solid var(--terracotta-dark)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: 'var(--text-sm)',
                      color: isFolding ? 'var(--ink)' : 'transparent',
                      transition: 'background 0.25s, color 0.25s', padding: 0,
                    }}
                  >
                    ✓
                  </button>
                ) : (
                  <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>
                    ›
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
