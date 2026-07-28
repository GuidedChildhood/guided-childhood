'use client'

import { useState } from 'react'

// Write your own job, in one place.
//
// This existed twice in QuestManager with identical behaviour: once in the add
// panel (QuestManager.tsx:1252) and once under the ideas grid (1697). Same
// addQuest call, same daily one star default, same 120 character cap, two
// slightly different looks and two placeholders. Any change to what a written
// job lands as had to be made in both, and the second one was already drifting:
// different padding, different background, a mono label on one and a display
// label on the other.
//
// Worse, both read and wrote the SAME customTitle state on the parent. Wherever
// both were on screen at once, typing into one silently filled the other, and
// adding from one cleared the box under the other. Giving the composer its own
// state per instance ends that: two composers are now genuinely two boxes.
//
// What a written job lands as lives here now, in one place: a daily job worth
// one star, which the parent can change on the job itself once it is in.

export default function JobComposer({
  onAdd,
  placeholder = 'Make your bed, feed the cat...',
  tone = 'white',
  autoFocus = false,
  help,
}: {
  /** Given the trimmed title. The caller owns what a job actually becomes. */
  onAdd: (title: string) => void
  placeholder?: string
  /** The input sits on white cards in the add panel and on cream further down. */
  tone?: 'white' | 'cream'
  autoFocus?: boolean
  help?: string
}) {
  const [title, setTitle] = useState('')
  const ready = title.trim().length > 0

  const submit = () => {
    if (!ready) return
    onAdd(title.trim())
    setTitle('')
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          autoFocus={autoFocus}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
          placeholder={placeholder}
          // minWidth 0 so a long placeholder cannot push the Add button off a
          // phone screen. The second copy of this was missing it.
          style={{
            flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
            border: '1.5px solid var(--border)',
            background: tone === 'cream' ? 'var(--cream)' : '#fff',
            fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--ink)', outline: 'none',
          }}
          maxLength={120}
        />
        <button
          onClick={submit}
          disabled={!ready}
          style={{
            flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
            borderRadius: '12px', padding: '12px 20px',
            cursor: ready ? 'pointer' : 'default',
            fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
            boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: ready ? 1 : 0.5,
          }}
        >
          Add
        </button>
      </div>
      {help && (
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '9px 0 0' }}>
          {help}
        </p>
      )}
    </>
  )
}
