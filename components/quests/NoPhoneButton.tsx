'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// A quiet line under the handover nudge: if this child has no phone, the parent
// says so once and the app stops asking, committing to the fridge and parent
// managed flow. Sets children.no_phone through the parent scoped route, then
// refreshes so the nudge is gone.

export default function NoPhoneButton({ childId, childName }: { childId: string; childName: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  // ── IT COULD NEVER STOP SAYING SAVING ─────────────────────────────────────
  //
  // Justin, 13 August 2026, with a screenshot of "Saving..." sitting under the
  // handover card.
  //
  // Two faults, and the second is why it looked permanent. busy was only reset
  // inside catch, so the success path left it true for ever and relied on the
  // card disappearing to hide it. And fetch does NOT throw on a 4xx or a 5xx,
  // only on a network failure, so a rejected request skipped the catch
  // entirely: no error, no reset, "Saving..." until the page was reloaded.
  //
  // Now the response is actually checked, the state is cleared either way, and
  // a failure says so rather than pretending to still be working.
  async function set() {
    setBusy(true)
    setFailed(false)
    try {
      const res = await fetch('/api/children/no-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, noPhone: true }),
      })
      if (!res.ok) throw new Error(String(res.status))
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    // ── ROOM BETWEEN THE TWO ANSWERS (18 August 2026) ────────────────────
    //
    // Justin: "where it says Teo has no phone, keep it on the fridge, it is too
    // close to the button, there needs to be space."
    //
    // The margin was NEGATIVE at the top, minus six, which pulled this up until
    // it sat against the underside of the Show the code button. These are the
    // two opposite answers to the same question, app or paper, and jammed
    // together they read as one control with a caption rather than as a choice.
    // A real gap is what makes it a choice.
    <div style={{ textAlign: 'center', margin: '18px 0 2px' }}>
      <button
        onClick={set}
        disabled={busy}
        style={{
          background: 'none', border: 'none', cursor: busy ? 'default' : 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
          color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
          padding: '4px 8px',
        }}
      >
        {busy
          ? 'Saving...'
          : failed
            ? 'That did not save, tap to try again'
            : `${childName} has no phone, keep it on the fridge`}
      </button>
    </div>
  )
}
