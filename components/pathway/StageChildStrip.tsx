'use client'

import { useState } from 'react'

// The child's half of a passport page.
//
// Justin, 10 September 2026: the stage pages should add "days done in child's
// app to digi stars done links or ability to send reminders to child's app
// lessons outstanding and balance reminder to use device timer".
//
// Four readings and one button. The four are what the CHILD has done, which
// until now appeared nowhere on an object with the child's name on the cover:
// the page read the parent's five rows and stopped. The button is the one thing
// a parent can do about it from here.
//
// ── WHY IT ONLY EVER RENDERS ON THE CHILD'S OWN PAGE ────────────────────────
//
// Days done, stars and the timer are readings about TODAY. A stage the child
// has not reached yet must never borrow them, for exactly the reason the
// moments, jobs and balance rows already say Later on every other page: a page
// that shows a child's real streak against a stage they will not start for
// three years is claiming progress that has not happened.
//
// ── THE SEND REUSES THE ROUTE THAT ALREADY EXISTS ───────────────────────────
//
// /api/pathway/passport-todo is what the TO DO above the book already posts to,
// and it already filters to the rows a child can actually move. A second send
// route would have been a second definition of what a child is allowed to be
// asked to do, and those two would have disagreed within a month.

export default function StageChildStrip({
  childId,
  childName,
  daysDone,
  stars,
  lessonsLeft,
  timerDays,
  onApp,
  ink,
}: {
  childId: string | null
  childName: string | null
  daysDone: number
  /** Null when there is no bank to read, which is not the same as zero stars. */
  stars: number | null
  lessonsLeft: number
  /** Days this week the device timer was actually run. */
  timerDays: number
  onApp: boolean
  /** The stage's own ink, so this strip belongs to the page it is on. */
  ink: string
}) {
  const [sending, setSending] = useState(false)
  const [sentAt, setSentAt] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  const them = childName ?? 'them'

  const send = async () => {
    if (sending || !childId) return
    setSending(true)
    setFailed(false)
    try {
      const res = await fetch('/api/pathway/passport-todo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId }),
      })
      if (!res.ok) throw new Error('send failed')
      setSentAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  // Four numbers, four words. A reading that needs a sentence belongs in the
  // open row above, not in a strip whose whole job is to be glanceable.
  const cells: { value: string; label: string }[] = [
    { value: String(daysDone), label: daysDone === 1 ? 'Day done' : 'Days done' },
    { value: stars === null ? '·' : String(stars), label: 'Stars' },
    // "Lessons left" is the honest label and it does not fit: at 390 wide each
    // cell is about 69px of text room and LESSONS alone is 66px, so LEFT
    // dropped to a second line and out through the bottom of its box. The
    // heading above already says whose these are, and To watch says the same
    // thing in a word that fits.
    { value: String(lessonsLeft), label: 'To watch' },
    { value: String(timerDays), label: 'Timer days' },
  ]

  return (
    <div style={{ marginTop: 13, paddingTop: 11, borderTop: `1.5px dashed ${ink}` }}>
      <p style={{
        margin: '0 0 8px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: ink, opacity: 0.75,
      }}>
        {childName ? `${childName}'s own` : 'Their own'}
      </p>

      {/* stretch, so one label that does wrap takes its neighbours with it
          rather than growing out through its own border. */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 6 }}>
        {cells.map(c => (
          <span key={c.label} style={{
            flex: '1 1 0', minWidth: 0, textAlign: 'center',
            background: '#fff', border: `1.5px solid ${ink}`, borderRadius: 12, padding: '7px 3px',
          }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.1 }}>
              {c.value}
            </span>
            <span style={{
              display: 'block', marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--ink-soft)', lineHeight: 1.15,
            }}>
              {c.label}
            </span>
          </span>
        ))}
      </div>

      {/* THE BALANCE REMINDER. The only line here that is a nudge rather than a
          score, and it earns its space by being true only when it matters: a
          week with no session at all means the screen balance row above is
          reporting on nothing that was measured. */}
      {timerDays === 0 && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '8px 0 0' }}>
          The device timer has not been used this week, so screen balance has nothing to read.
        </p>
      )}

      {onApp && childId && (
        <button
          type="button"
          onClick={send}
          disabled={sending || !!sentAt}
          style={{
            width: '100%', marginTop: 9, padding: '11px 14px',
            background: sentAt ? 'var(--retro-green)' : '#fff', color: sentAt ? '#fff' : 'var(--ink)',
            border: `2px solid ${sentAt ? 'var(--retro-green)' : 'var(--ink)'}`, borderRadius: 14,
            boxShadow: sentAt ? 'none' : '0 3px 0 var(--ink)',
            cursor: sending || sentAt ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
          }}
        >
          {sentAt ? `Sent at ${sentAt} ✓` : sending ? 'Sending' : `Send ${them} a reminder`}
        </button>
      )}
      {failed && (
        <p style={{ fontSize: 'var(--text-sm)', color: '#B93B3F', margin: '7px 0 0', lineHeight: 1.45 }}>
          That did not send. Have another go in a moment.
        </p>
      )}
    </div>
  )
}
