'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// The three things a parent can do with a row: say it is theirs (or that it is
// sorted for now), send the plan to the other parent, and go to the tool that
// puts it into practice.
//
// The share goes through the phone's own share sheet, because there is no
// second parent account: a plan both parents have read is the one that holds
// on a Monday morning when only one of them is up. Where the browser has no
// share sheet it copies the words instead.

export default function FlashpointActions({ flashKey, childId, claimed, headsUpWhen, share, toolHref }: {
  flashKey: string
  childId: string | null
  claimed: boolean
  headsUpWhen: string
  share: string
  toolHref: string | null
}) {
  const router = useRouter()
  const [ours, setOurs] = useState(claimed)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  async function toggle() {
    setBusy(true)
    setNote(null)
    try {
      const res = await fetch('/api/flashpoints/claim', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: flashKey, childId, claimed: !ours }),
      })
      if (!res.ok) throw new Error()
      const next = !ours
      setOurs(next)
      setNote(next ? `Done. A heads up comes ${headsUpWhen}, and the check in will ask how it is going.` : 'Rested. No more heads ups for this one.')
      router.refresh()
    } catch {
      setNote('That did not save. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  async function send() {
    setNote(null)
    try {
      if (navigator.share) {
        await navigator.share({ text: share })
        return
      }
      await navigator.clipboard.writeText(share)
      setNote('Copied. Paste it into a message to the other parent.')
    } catch {
      // A cancelled share sheet is not an error worth showing.
    }
  }

  const fill = { width: '100%', minHeight: 48, padding: '12px 16px', whiteSpace: 'normal' as const, textAlign: 'center' as const }

  return (
    <div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <button type="button" onClick={toggle} disabled={busy} aria-pressed={ours}
          className={ours ? 'btn-outline' : 'btn'} style={{ ...fill, justifyContent: 'center', opacity: busy ? 0.6 : 1 }}>
          {ours ? 'Sorted for now' : 'This happens in our house'}
        </button>
        <button type="button" onClick={send} className="btn-outline" style={{ ...fill, justifyContent: 'center' }}>
          Send to the other parent
        </button>
        {toolHref && (
          <Link href={toolHref} className="btn-outline" style={{ ...fill, justifyContent: 'center' }}>
            Put it into practice →
          </Link>
        )}
      </div>
      {note && <p role="status" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 0' }}>{note}</p>}
    </div>
  )
}
