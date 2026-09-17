'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// DAY ONE CONFIRMS. IT DOES NOT RATE, AND IT DOES NOT ASK THEM TO CURATE.
//
// Justin, 17 September 2026, on the first version of this screen: "the check in
// still does not make sense as we are proposing to only change the first check
// in as they have only just raised the concerns on the set up? So surely the
// very first check in just confirms they are here on the check in tracker and
// we will track each day and provide solutions?"
//
// He is right, and it is the second thing this screen got wrong.
//
// THE FIRST WAS RATING. Measured on his own account: seven concerns written
// fifteen seconds after it existed, then all seven rated between 20:59:29 and
// 21:00:04. Seven ratings in thirty five seconds, every one the same score,
// from a parent who had not watched one day with any of those worries in mind.
// That number is what the weekly email, the passport stamp and every "is it
// getting better" sentence are measured against.
//
// THE SECOND WAS ASKING THEM TO EDIT THE LIST. The replacement screen showed
// the same worries with a chip on each row to mark it already fine, and a box
// to add more. But a parent reaches this screen roughly forty seconds after
// typing those worries into the sign up question. Nobody marks as "already
// fine" a thing they named as hard less than a minute ago, and being asked to
// is the app admitting it was not really listening. The one legitimate case,
// the two starters topped up for a family who named nothing we could map, is
// answered by the ordinary rule anyway: say it is going great and it rests.
//
// So this screen has ONE job now. Show a parent their own words back, say the
// worries are on the tracker, say what happens next in both halves that matter
// (we ask how each one is going, and we give you something to try), and get out
// of the way. One button.

export type AckChild = { id: string; name: string | null; concerns: { id: string; label: string }[] }

// `groups` rather than `children`, which in a React component means something
// else entirely and would read as the contents of the card rather than the
// families in it.
export default function ConcernAcknowledge({ groups }: { groups: AckChild[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)

  const total = groups.reduce((n, g) => n + g.concerns.length, 0)

  async function confirm() {
    if (busy) return
    setBusy(true); setFailed(null)
    const res = await fetch('/api/checkin/confirm', { method: 'POST' }).catch(() => null)
    if (!res?.ok) { setBusy(false); setFailed('That did not save. Try again in a moment.'); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div>
      <div style={{
        background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--lift)', padding: '20px 18px 18px', marginBottom: 14,
      }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          {total === 1
            ? 'This is on your tracker now.'
            : `These ${total} are on your tracker now.`}
        </p>

        {groups.map(g => (
          <div key={g.id} style={{ marginBottom: 14 }}>
            {groups.length > 1 && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px',
              }}>
                {g.name ?? 'Your child'}
              </p>
            )}

            {/* Read only, on purpose. See the note at the top: these words are
                under a minute old and they are the parent's own. */}
            {g.concerns.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0', borderTop: '2px dotted rgba(26,26,46,0.15)',
              }}>
                <span aria-hidden style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--retro-green-dark)',
                }} />
                <span style={{
                  flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3,
                }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        ))}

        {failed && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', margin: '10px 0 0', lineHeight: 1.5 }}>
            {failed}
          </p>
        )}
      </div>

      {/* BOTH HALVES OF THE PROMISE. Tracking on its own is a spreadsheet. The
          reason a parent is here is the second sentence, and the old version of
          this line only said the first. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        From tomorrow we check in on {total === 1 ? 'it' : 'them'} each day, a few at a time, and give you something to
        try. You will see whether each one is moving.
      </p>

      <button
        type="button" onClick={confirm} disabled={busy}
        style={{
          width: '100%', padding: '15px 20px', border: 'var(--edge)',
          borderRadius: 'var(--radius-tile)', background: 'var(--terracotta)', color: 'var(--ink)',
          cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)',
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? 'Saving' : 'Start tracking'}
      </button>
    </div>
  )
}
