'use client'

import { deviceLabel } from '@/lib/quests/device-time'

// The fate of the child's screen time ask, right at the top of their screen
// so it is never hunted for. One banner, four states: asked and waiting,
// the yes with one big Start button, a warm not right now, and the chores
// that must come first. Nudges a grown up sent from their Remind button
// land here too. Driven by the same poll the tick watch already runs.

export type KidAskState = {
  id?: string
  device: string
  minutes: number
  status: 'pending' | 'approved' | 'declined'
}

export type KidNudge = { id: string; message: string }

const cardBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 13,
  borderRadius: '20px', padding: '14px 17px', marginBottom: '12px',
  boxShadow: '0 5px 0 rgba(0,0,0,0.18)', textAlign: 'left',
}

export default function KidAskBanner({
  ask, blockingJobs, outstandingJobs = [], nudges, hasSession, startBusy,
  onStart, onDismissDeclined, onDismissNudge,
}: {
  ask: KidAskState | null
  // Titles of the before screens jobs still to do today, already deduped.
  blockingJobs: string[]
  // Titles of the day's jobs not yet done, a soft nudge on the yes, never a
  // block. Already deduped.
  outstandingJobs?: string[]
  nudges: KidNudge[]
  // A live timer outranks every ask state: the countdown card tells it.
  hasSession: boolean
  startBusy: boolean
  onStart: () => void
  onDismissDeclined: () => void
  onDismissNudge: (id: string) => void
}) {
  const showAsk = ask && !hasSession
  const blocked = blockingJobs.length > 0 && !hasSession

  return (
    <div>
      {/* Nudges from the grown up: always show, they carry the way forward. */}
      {nudges.map(n => (
        <div key={n.id} style={{ ...cardBase, background: '#fff' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>💛</span>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', lineHeight: 1.4 }}>
            {n.message}
          </span>
          <button
            onClick={() => onDismissNudge(n.id)}
            aria-label="Got it"
            style={{ flexShrink: 0, border: 'none', background: 'var(--cream)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink-soft)' }}
          >
            OK
          </button>
        </div>
      ))}

      {showAsk && ask.status === 'pending' && (
        <div style={{ ...cardBase, background: '#fff' }}>
          <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🙋</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.3 }}>
              Asked your grown up for {ask.minutes} min on the {deviceLabel(ask.device)}
            </span>
            <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
              Waiting for their yes ⏳
            </span>
          </span>
        </div>
      )}

      {showAsk && ask.status === 'approved' && (
        <div style={{ ...cardBase, flexDirection: 'column', alignItems: 'stretch', gap: 10, background: 'var(--terracotta)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>🎉</span>
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.08rem', color: 'var(--ink)', lineHeight: 1.3 }}>
              They said yes! Tap to start your timer
            </span>
          </div>
          {/* Jobs still to do today: a soft steer to finish those first, the
              same one their grown up saw. Never a block, the Start still works. */}
          {outstandingJobs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(26,26,46,0.10)', borderRadius: '13px', padding: '10px 13px' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🌱</span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.35 }}>
                Finish {outstandingJobs[0]}{outstandingJobs.length > 1 ? ` and ${outstandingJobs.length - 1} more` : ''} first
              </span>
            </div>
          )}
          <button
            onClick={onStart}
            disabled={startBusy}
            style={{
              width: '100%', padding: '15px', borderRadius: '16px', border: 'none',
              background: 'var(--ink)', color: '#fff', cursor: startBusy ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px',
              boxShadow: '0 5px 0 rgba(0,0,0,0.35)', opacity: startBusy ? 0.7 : 1,
            }}
          >
            {startBusy ? 'Starting...' : `▶ Start my ${ask.minutes} minutes`}
          </button>
        </div>
      )}

      {showAsk && ask.status === 'declined' && (
        <div style={{ ...cardBase, background: '#fff' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>💛</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.3 }}>
              Not right now
            </span>
            <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
              Your stars are safe.
            </span>
          </span>
          <button
            onClick={onDismissDeclined}
            aria-label="OK"
            style={{ flexShrink: 0, border: 'none', background: 'var(--cream)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink-soft)' }}
          >
            OK
          </button>
        </div>
      )}

      {/* Chores first: only when no ask is mid flight, so the banner tells
          one story at a time. */}
      {blocked && !(showAsk && (ask.status === 'pending' || ask.status === 'approved')) && (
        <div style={{ ...cardBase, background: '#fff' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🌱</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.3 }}>
              Do {blockingJobs[0]}{blockingJobs.length > 1 ? ` and ${blockingJobs.length - 1} more` : ''} first, then ask again
            </span>
            <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
              Your grown up gets a ping when it is done.
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
