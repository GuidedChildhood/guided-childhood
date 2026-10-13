'use client'

import { useState } from 'react'
import { deviceLabel } from '@/lib/quests/device-time'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'
import { Sticker } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/HappyPaper'

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

// A job title sits mid sentence here ("Do make your bed first"), so its
// capital comes down. A name the parent typed in capitals stays as typed.
const lowerFirst = (t: string) => (/^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t)

// The happy news finish (design-refs/happy-newspaper-notes.md): ink edge,
// hard ledge, a drawn icon in a crayon well instead of a phone emoji.
const cardBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 13,
  border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '13px 15px', marginBottom: '12px',
  boxShadow: 'var(--lift)', textAlign: 'left',
}
const okBtn: React.CSSProperties = {
  flexShrink: 0, border: 'var(--edge)', background: '#fff', borderRadius: 'var(--radius-tile)', padding: '8px 12px', cursor: 'pointer',
  boxShadow: 'var(--lift)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)',
}
function Well({ icon, tint }: { icon: HappyIconName; tint: string }) {
  return (
    <span aria-hidden style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box', background: tint, border: 'var(--edge)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <HappyIcon name={icon} size={34} />
    </span>
  )
}

// A note from the grown up. A long one shows its first few lines and a Read
// it all tap, so a paragraph never pushes the child's day off the screen
// (Teo's home, 13 October 2026, was one note tall). Line breaks are kept.
const NOTE_PREVIEW = 140
function NudgeCard({ nudge, onDismiss }: { nudge: KidNudge; onDismiss: () => void }) {
  const [open, setOpen] = useState(false)
  const long = nudge.message.length > NOTE_PREVIEW
  return (
    <div style={{ ...cardBase, background: '#fff', alignItems: 'flex-start' }}>
      <Well icon="heart" tint={CRAYON.paper} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: long && !open ? '-webkit-box' : 'block', WebkitLineClamp: long && !open ? 3 : undefined,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line', overflowWrap: 'anywhere',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4,
        }}>
          {nudge.message}
        </span>
        {long && (
          <button
            onClick={() => setOpen(o => !o)}
            style={{ marginTop: 6, padding: 0, border: 0, background: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)', textDecoration: 'underline' }}
          >
            {open ? 'Show less' : 'Read it all'}
          </button>
        )}
      </span>
      <button onClick={onDismiss} aria-label="Got it" style={okBtn}>OK</button>
    </div>
  )
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
      {nudges.map(n => <NudgeCard key={n.id} nudge={n} onDismiss={() => onDismissNudge(n.id)} />)}

      {showAsk && ask.status === 'pending' && (
        <div style={{ ...cardBase, background: '#fff' }}>
          <Well icon="hand" tint={CRAYON.butter} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
              Asked your grown up for {ask.minutes} min on the {deviceLabel(ask.device)}
            </span>
            <span style={{ display: 'inline-block', marginTop: 6 }}><Sticker accent="white" rotate={-3} size="sm">Waiting for their yes ⏳</Sticker></span>
          </span>
        </div>
      )}

      {showAsk && ask.status === 'approved' && (
        <div style={{ ...cardBase, flexDirection: 'column', alignItems: 'stretch', gap: 10, background: 'var(--terracotta)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Well icon="cheer" tint="#fff" />
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.3 }}>
              They said yes! Tap to start your timer
            </span>
          </div>
          {/* Jobs still to do today: a soft steer to finish those first, the
              same one their grown up saw. Never a block, the Start still works. */}
          {outstandingJobs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '8px 12px' }}>
              <HappyIcon name="sprout" size={26} />
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.35 }}>
                Finish {outstandingJobs[0]}{outstandingJobs.length > 1 ? ` and ${outstandingJobs.length - 1} more` : ''} first
              </span>
            </div>
          )}
          <button
            onClick={onStart}
            disabled={startBusy}
            style={{
              width: '100%', padding: '15px', borderRadius: 'var(--radius-btn)', border: 'none',
              background: 'var(--ink)', color: '#fff', cursor: startBusy ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
              boxShadow: '0 4px 0 rgba(0,0,0,0.45)', opacity: startBusy ? 0.7 : 1,
            }}
          >
            {startBusy ? 'Starting...' : `▶ Start my ${ask.minutes} minutes`}
          </button>
        </div>
      )}

      {showAsk && ask.status === 'declined' && (
        <div style={{ ...cardBase, background: '#fff' }}>
          <Well icon="heart" tint={CRAYON.paper} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
              Not right now
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
              Your stars are safe.
            </span>
          </span>
          <button
            onClick={onDismissDeclined}
            aria-label="OK"
            style={okBtn}
          >
            OK
          </button>
        </div>
      )}

      {/* Chores first: only when no ask is mid flight, so the banner tells
          one story at a time. */}
      {/* Only once the child has actually asked. "Then ask again" to a child
          who asked for nothing read as a telling off, one card above Use my
          time saying "40 min ready" (13 October 2026 walkthrough). The jobs
          step in the five a day already names what is still to do. */}
      {blocked && showAsk && ask.status === 'declined' && (
        <div style={{ ...cardBase, background: '#fff' }}>
          <Well icon="sprout" tint={CRAYON.paper} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
              Do {lowerFirst(blockingJobs[0])}{blockingJobs.length > 1 ? ` and ${blockingJobs.length - 1} more` : ''} first, then ask again
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
              Your grown up gets a ping when it is done.
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
