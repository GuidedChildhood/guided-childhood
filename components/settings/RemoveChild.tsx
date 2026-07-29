'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Take a child off the account.
//
// Justin, on his own account: "digi says I have 2 children where is it getting
// that from ... this was my daughter Alma but changed to Ada now."
//
// DiGi was not confused and it was not remembering a stale name. It was reading
// the children table and reporting what is there. Three places create a child
// row (onboarding, the starter pack, and the add a child form on Quests) and
// until now NOTHING in the whole product could remove one. So a family that
// added a child twice, or renamed by adding rather than editing, was stuck with
// the extra one for good, and every screen that counts children kept counting
// it. The count was honest. The account was wrong, and there was no way to say so.
//
// The database side of this was already finished and waiting. Migration 120
// moved child_id to ON DELETE CASCADE on the tables that hold something
// personal, so removing the row takes the jobs, ticks, stars, stickers, app
// link and DiGi's memory of that child with it. What was missing was any way to
// ask.
//
// Two steps and the child's own name typed out, because this is permanent and
// because a mis-tap on a phone must not delete a real child's history. Typing
// the name rather than DELETE also means you cannot remove the wrong one by
// working through them quickly.
//
// Nothing shows when there is only one child: an account needs one, and a
// parent who wants rid of everything wants Delete my account instead.

export default function RemoveChild({
  childId,
  name,
  isPrimary,
  siblingCount,
  promoteToId,
  onRemoved,
}: {
  childId: string
  name: string
  isPrimary: boolean
  /** How many children are on the account in total, this one included. */
  siblingCount: number
  /** Who becomes the main child if this one was it. Null when nobody can. */
  promoteToId: string | null
  onRemoved: (childId: string) => void
}) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (siblingCount < 2) return null

  const named = !!name && name !== 'Your child'
  const label = named ? name : 'this child'
  // An unnamed row still has to be removable, and often IS the duplicate, so it
  // falls back to a word rather than asking a parent to type "Your child".
  const confirmWord = named ? name.trim() : 'REMOVE'
  // Case and stray spaces do not matter. Getting the name right does.
  const ready = typed.trim().toLowerCase() === confirmWord.toLowerCase()

  const go = async () => {
    if (!ready || busy) return
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.from('children').delete().eq('id', childId)
    if (err) { setError(err.message); setBusy(false); return }

    // Hand the main child over, so nothing is left pointing at a row that has
    // gone. If this write fails we do not undo the removal: DiGi and the
    // dashboard both read the main child as "the one flagged, or else the first
    // one", so a family with no flag still behaves, and the parent can set it
    // by saving any child's details.
    if (isPrimary && promoteToId) {
      await supabase.from('children').update({ is_primary: true }).eq('id', promoteToId)
    }

    onRemoved(childId)
  }

  return (
    <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1.5px solid var(--border)' }}>
      {!open ? (
        <>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '0 0 10px' }}>
            Added a child twice, or added a new one when you meant to change a name? You can take one off here.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              background: 'none', border: '1.5px solid var(--border)', borderRadius: '12px',
              padding: '9px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: '14.5px', fontWeight: 600, color: 'var(--terracotta-dark)',
            }}
          >
            Remove {label}
          </button>
        </>
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px' }}>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 10px' }}>
            This takes {label} off your account for good, along with their jobs and stars, their stickers, their own app link, and everything DiGi remembers about them. Your other {siblingCount > 2 ? 'children are' : 'child is'} not affected. It cannot be undone.
          </p>
          <label htmlFor={`confirm-remove-${childId}`} style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '10px' }}>
            Type <strong>{confirmWord}</strong> to confirm.
          </label>
          <input
            id={`confirm-remove-${childId}`}
            value={typed}
            onChange={e => setTyped(e.target.value)}
            autoComplete="off"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '12px',
              border: '1.5px solid var(--border)', background: 'var(--cream)',
              fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={go}
              disabled={!ready || busy}
              style={{
                background: ready ? 'var(--terracotta)' : 'var(--border)', border: 'none',
                borderRadius: '12px', padding: '11px 18px', cursor: ready && !busy ? 'pointer' : 'default',
                fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--ink)',
              }}
            >
              {busy ? 'Removing' : `Remove ${label}`}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setTyped(''); setError(null) }}
              style={{
                background: 'none', border: '1.5px solid var(--border)', borderRadius: '12px',
                padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontSize: '15px', fontWeight: 600, color: 'var(--ink-soft)',
              }}
            >
              Keep {label}
            </button>
          </div>
          {error && (
            <p role="status" style={{ fontSize: '14.5px', color: 'var(--terracotta-dark)', fontWeight: 600, margin: '10px 0 0', lineHeight: 1.5 }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
