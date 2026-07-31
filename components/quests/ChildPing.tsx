'use client'

import { useState } from 'react'

// Buzz the child's phone with one line, right now.
//
// This lived at line 2109 of a 2283 line file, inside the Share tab, which is
// the tab a parent opens once to hand the phone link over and then has no
// reason to open again. Read the nine messages and the problem is obvious:
// dinner in ten minutes, time to come off the screen, time for bed. Not one of
// them is a setup task. They are the most ordinary daily thing on the whole
// board, filed behind a one time job.
//
// Its own component now, so it can sit wherever the daily loop is without
// being copied, and so it can be looked at without logging in.

// The nine. Ordered the way a day runs rather than by importance: the reward
// first because that is the nice one to send, then chores, then the ends of
// things. A parent scanning for "time to come off" should not have to read
// past three cheerful ones to find it.
//
// Worth flagging against the house rule that scripts belong in the database:
// these are quick action button labels rather than DiGi pathway scripts, so
// they stay in code for now. If they ever want editing without a deploy, they
// want a table.
export const PING_MESSAGES = [
  'You can watch now, you earned it ⭐',
  'Please finish your chores first',
  'Quest check! A few ticks and the stars are yours ⭐',
  'Time to come off the screen now please',
  'Turn the TV off please',
  'Time to start your homework',
  'Dinner in 10 minutes, start wrapping up',
  'Please come downstairs',
  'Time for bed now please',
]

export default function ChildPing({
  childName,
  onSend,
  result,
}: {
  childName: string
  /** The caller owns the request, because it needs the active child. */
  onSend: (message: string) => void
  /** What the last send did. Null while nothing has been sent. */
  result?: string | null
}) {
  const [draft, setDraft] = useState('')
  const ready = draft.trim().length > 0

  return (
    <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
        Ping {childName}&apos;s phone now
      </div>
      <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 10px' }}>
        One tap and it buzzes on their phone. Works once they have opened their quest link and turned on reminders.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {PING_MESSAGES.map(msg => (
          <button
            key={msg}
            onClick={() => onSend(msg)}
            title={msg}
            style={{
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px',
              padding: '9px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', textAlign: 'left',
              // Wraps to a second line rather than being cut off. Long labels are
              // the minority, so the row stays tidy either way.
              maxWidth: '100%', whiteSpace: 'normal', lineHeight: 1.35,
            }}
          >
            {/* The whole message, never clipped.
                It used to cut at 34 characters, and the two that tripped it are
                exactly the two a parent cannot identify from the opening words:
                "Quest check! A few ticks and..." and "Dinner in 10 minutes,
                start...". The aria-label carried the full text, so a screen
                reader heard the real message while a sighted parent chose from a
                truncated one, which is the accessibility fix applied to the
                wrong half of the problem. This is a button that SENDS a message
                to a child's phone, so the label has to be the message. */}
            {msg}
          </button>
        ))}
      </div>
      <form
        onSubmit={e => { e.preventDefault(); if (!ready) return; onSend(draft.trim()); setDraft('') }}
        style={{ display: 'flex', gap: '8px', marginTop: '10px' }}
      >
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          maxLength={140}
          placeholder="Or type your own quick message"
          style={{
            flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: '12px',
            border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
            fontSize: '15px', color: 'var(--ink)', background: '#fff',
          }}
        />
        <button
          type="submit"
          disabled={!ready}
          style={{
            flexShrink: 0, background: ready ? 'var(--terracotta)' : 'var(--border)',
            color: 'var(--ink)', border: 'none', borderRadius: '12px', padding: '10px 16px',
            cursor: ready ? 'pointer' : 'default',
            fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800,
          }}
        >
          Send
        </button>
      </form>
      {result && (
        <p role="status" style={{ fontSize: '14.5px', color: result.startsWith('Ping sent') ? 'var(--terracotta-dark)' : 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.55, margin: '10px 0 0' }}>
          {result}
        </p>
      )}
    </div>
  )
}
