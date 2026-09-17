'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// DAY ONE READS THE LIST BACK. IT DOES NOT ASK FOR A SCORE.
//
// Justin, 17 September 2026, having signed up a fresh account and gone through
// his own first check in: "first check in with 5 star rating ... it's just to
// acknowledge first concerns raised so seems overkill to ask them to do a check
// in maybe we should just acknowledge they are added to solve first and are on
// next day".
//
// What the live data said about that account: seven concerns written fifteen
// seconds after it existed, then all seven rated between 20:59:29 and 21:00:04.
// Seven ratings in thirty five seconds, every one the same score, from a parent
// who had not yet watched one day with any of those worries in mind.
//
// The cost is not the thirty five seconds. That reading becomes the baseline
// the weekly email compares against, the one the passport stamp is earned from,
// and the one behind every "is it getting better" sentence in the product. We
// were anchoring the instrument on a number taken before there was anything to
// read. Moving the first rating to day two does not lose the baseline, it gets
// a real one.
//
// SO THIS SCREEN HAS ONE JOB: show a parent that the thing they typed two
// minutes ago was heard, let them fix the list while they are looking at it,
// and say when the asking starts.

export type AckChild = { id: string; name: string | null; concerns: { id: string; label: string }[] }

// `groups` rather than `children`, which in a React component means something
// else entirely and would read as the contents of the card rather than the
// families in it.
export default function ConcernAcknowledge({ groups: initial }: { groups: AckChild[] }) {
  const router = useRouter()
  const [groups, setGroups] = useState(initial)
  const [adding, setAdding] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)

  const total = groups.reduce((n, g) => n + g.concerns.length, 0)

  async function remove(childId: string, id: string) {
    setFailed(null)
    // Off the screen first, back if the write refuses. A worry a parent has
    // just said is not theirs should not sit there arguing while the network
    // decides.
    const before = groups
    setGroups(gs => gs.map(g => g.id === childId ? { ...g, concerns: g.concerns.filter(c => c.id !== id) } : g))
    const res = await fetch('/api/checkin/starters', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', id }),
    }).catch(() => null)
    if (!res?.ok) { setGroups(before); setFailed('That one would not come off. Try again in a moment.') }
  }

  async function add(childId: string) {
    const typed = text.trim()
    if (!typed || busy) return
    setBusy(true); setFailed(null)
    const res = await fetch('/api/checkin/starters', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', text: typed, childId }),
    }).catch(() => null)
    setBusy(false)
    if (!res?.ok) { setFailed('That did not save. Try again in a moment.'); return }
    setText(''); setAdding(null)
    // Refreshed rather than pushed into state, because the server decides what
    // the worry is finally called: "wont get of the swich" comes back as
    // Coming off screens, on the row that already has scripts written for it.
    router.refresh()
  }

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
          {total === 1 ? 'This is the one we start on.' : `These are the ${total} we start on.`} Have a look, take off
          anything that is not you, and add anything missing.
        </p>

        {groups.map(g => (
          <div key={g.id} style={{ marginBottom: 16 }}>
            {groups.length > 1 && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px',
              }}>
                {g.name ?? 'Your child'}
              </p>
            )}

            {g.concerns.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0', borderTop: '2px dotted rgba(26,26,46,0.15)',
              }}>
                <span style={{
                  flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3,
                }}>
                  {c.label}
                </span>
                {/* Plain and quiet. Removing is a rare thing to want and it
                    should never compete with the one button that matters. */}
                <button
                  type="button"
                  onClick={() => remove(g.id, c.id)}
                  aria-label={`Take ${c.label} off the list`}
                  style={{
                    border: 'none', background: 'none', cursor: 'pointer', padding: '6px 8px',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)',
                  }}
                >
                  Not us
                </button>
              </div>
            ))}

            {adding === g.id ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input
                  autoFocus
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') add(g.id) }}
                  placeholder="What else is hard?"
                  style={{
                    flex: 1, minWidth: 0, padding: '11px 12px', border: 'var(--edge)',
                    borderRadius: 'var(--radius-tile)', fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-body)', color: 'var(--ink)', background: 'var(--cream)',
                  }}
                />
                <button
                  type="button" onClick={() => add(g.id)} disabled={busy || !text.trim()}
                  style={{
                    padding: '11px 16px', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
                    background: 'var(--butter)', color: 'var(--ink)', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                    boxShadow: '0 4px 0 var(--butter-dark, rgba(26,26,46,0.35))',
                    opacity: busy || !text.trim() ? 0.5 : 1,
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAdding(g.id); setText('') }}
                style={{
                  marginTop: 10, padding: '10px 14px', border: 'var(--edge)',
                  borderRadius: 'var(--radius-tile)', background: '#fff', color: 'var(--ink)',
                  cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-base)',
                }}
              >
                Add another
              </button>
            )}
          </div>
        ))}

        {failed && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', margin: '10px 0 0', lineHeight: 1.5 }}>
            {failed}
          </p>
        )}
      </div>

      {/* WHAT HAPPENS NEXT, SAID BEFORE THEY TAP. The old first check in asked
          for seven scores and never told a parent what any of it was for. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        From tomorrow we ask how each one went, a few at a time, and show you whether it is moving. Anything new can be
        added any day.
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
        {busy ? 'Saving' : 'Start on these'}
      </button>
    </div>
  )
}
