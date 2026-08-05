'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ParentToDo } from '@/lib/pathway/passport-todo'
import type { ChildToDo } from '@/lib/pathway/passport-todo'

// The TO DO above the passport.
//
// Justin: "maybe a button over passport a TO DO but not time critical".
//
// WHY IT SITS ABOVE THE BOOK RATHER THAN IN IT. The five rows already exist,
// one page deep, on the child's own stage. To read them a parent opens the
// cover, taps through to their page and reads a checklist. That is right for
// the book, which is a keepsake you look through, and it means the one question
// a parent actually arrives with, is there anything I should be doing, takes
// three taps to answer. So the same reading is lifted to a line they cannot
// miss, and the book underneath is left alone.
//
// NOT TIME CRITICAL, AND IT HAS TO LOOK IT. Everything urgent in this product
// is red: the approve card, the alert on a device set up ahead of age. This is
// deliberately the opposite. Sage, no dot, no count badge on the nav, and the
// words say no rush out loud. A passport that started nagging would become the
// sixth thing shouting on a parent's morning, and it is the one thing here
// designed to be measured in months.
//
// Closed by default. Open, it is a list of rows a parent can act on; closed, it
// is one honest line about whether there is anything to act on at all, which is
// most of what it is for.

export default function PassportToDo({
  childId,
  childName,
  items,
  childItems,
  onApp,
}: {
  childId: string | null
  childName: string | null
  /** The open rows of the child's own stage. Everything at 100 is already out. */
  items: ParentToDo[]
  /** The part of it the child can do themself. */
  childItems: ChildToDo[]
  /** Does this child have the app? Without it there is nowhere to send. */
  onApp: boolean
}) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sentAt, setSentAt] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  const theirs = childName ? `${childName}'s` : 'their'
  const them = childName ?? 'them'
  const count = items.length

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

  return (
    <div style={{
      background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF',
      borderRadius: '18px', padding: '13px 15px', marginBottom: '14px',
    }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)',
          background: '#fff', border: '1.5px solid #D6E5DF', borderRadius: '9px', padding: '4px 9px',
        }}>
          To do
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>
          {count === 0
            ? `Nothing open on ${theirs} page`
            : `${count} thing${count === 1 ? '' : 's'} open on ${theirs} page`}
          {' '}
          <span style={{ fontWeight: 400, color: 'var(--ink-soft)' }}>
            {count === 0 ? 'right now' : 'and no rush'}
          </span>
        </span>
        {count > 0 && (
          <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink-muted)', fontSize: 'var(--text-md)' }}>
            {open ? '⌃' : '⌄'}
          </span>
        )}
      </button>

      {open && count > 0 && (
        <div style={{ marginTop: '11px' }}>
          {items.map(it => (
            <Link
              key={it.key}
              href={it.href}
              style={{
                display: 'block', textDecoration: 'none',
                background: '#fff', border: '1px solid #D6E5DF', borderRadius: '12px',
                padding: '10px 12px', marginBottom: '7px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)' }}>{it.emoji}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35 }}>
                  {it.label}
                </span>
                <span style={{
                  flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: 'var(--terracotta-dark)', whiteSpace: 'nowrap',
                }}>
                  {it.detail} ›
                </span>
              </span>
              {/* An ongoing row never ticks off, so saying which way it is
                  running is the difference between a to do and a thing that
                  looks permanently broken. Its own line, full width: squeezed
                  into the label column beside the detail it wrapped to two
                  cramped lines on a 390 phone. */}
              {it.ongoing && (
                <span style={{
                  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: 'var(--ink-muted)', letterSpacing: '0.04em', marginTop: 4,
                }}>
                  Kept up, not ticked off
                </span>
              )}
            </Link>
          ))}

          {/* THE CHILD'S HALF.
              Three of the five rows are a grown up's work, so the child is only
              ever offered the ones they can actually move. See
              lib/pathway/passport-todo.ts for what is filtered out and why. */}
          {childItems.length > 0 && onApp && (
            <div style={{ marginTop: '11px', paddingTop: '11px', borderTop: '1px solid #D6E5DF' }}>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 9px' }}>
                <strong style={{ fontWeight: 800 }}>{childName ? `${childName} can do` : 'They can do'} {childItems.length === 1 ? 'one of these' : `${childItems.length} of these`}.</strong>{' '}
                We put it on {theirs} app on the first of every month. Send it now if you would rather not wait.
              </p>
              <ul style={{ margin: '0 0 11px', padding: '0 0 0 2px', listStyle: 'none' }}>
                {childItems.map(c => (
                  <li key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 3 }}>
                    <span aria-hidden style={{ flexShrink: 0 }}>{c.emoji}</span>
                    <span>{c.line.charAt(0).toUpperCase()}{c.line.slice(1)}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={send}
                disabled={sending || !!sentAt}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: sentAt ? '#fff' : 'var(--terracotta)', color: 'var(--ink)',
                  border: sentAt ? '1.5px solid var(--terracotta)' : 'none',
                  borderRadius: 14, padding: '10px 15px',
                  boxShadow: sentAt ? 'none' : '0 4px 0 var(--terracotta-dark)',
                  cursor: sending || sentAt ? 'default' : 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                }}
              >
                {sentAt ? `Sent at ${sentAt} ✓` : sending ? 'Sending' : `Send it to ${theirs} app`}
              </button>
              {failed && (
                <p style={{ fontSize: 'var(--text-sm)', color: '#B93B3F', margin: '7px 0 0', lineHeight: 1.45 }}>
                  That did not send. Have another go in a moment.
                </p>
              )}
            </div>
          )}

          {childItems.length > 0 && !onApp && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '9px 0 0' }}>
              {childItems.length === 1 ? 'One of these is theirs to do' : `${childItems.length} of these are theirs to do`}. Set {them} up with the app and we put their part on it, on the first of every month.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
