'use client'

import { useState } from 'react'
import Link from 'next/link'
import { actionFor, spokenFor, catchUpLine, type ParentToDo, type ChildToDo } from '@/lib/pathway/passport-todo'

// The steps to stamp this passport page, broken down, every visit.
//
// Justin, 10 September 2026: "can we make this steps and easy to run through
// really intuitive, easy for parent to drive it, and send reminder if needed to
// Alma or verbally if no app, and let them know each day or when visited what to
// do to catch up on progress, and while moments is greyed it needs to have each
// step needed to complete passport stage broken down each time they visit."
//
// ── WHAT THIS USED TO BE ────────────────────────────────────────────────────
//
// A sage bar, closed, saying "4 things open on Alma's page and no rush", which
// opened into four link rows. Three problems with that, and Justin named all
// three:
//
//   1. CLOSED BY DEFAULT. The one question a parent arrives with is what should
//      I do, and the answer was behind a tap. It was closed because the passport
//      is deliberately not urgent, and that was the right instinct applied to
//      the wrong control: not urgent means do not nag, it does not mean hide.
//
//   2. IT SAID WHAT, NEVER WHAT TO DO. "Moments to resolve, 2 to resolve" is a
//      reading. A parent with four minutes in a kitchen wants an instruction,
//      and now every step carries one, in the same words every visit.
//
//   3. THE GREYED ONES WERE BLANK. A row that is not next was a dimmed line with
//      nothing behind it, so the parent could see there were four steps and read
//      only one. Every step is broken down now, whether it is the next one or
//      not, because a plan you can only see one move of is not a plan.
//
// ── AND THE PART WITH NO APP ────────────────────────────────────────────────
//
// Every prompt in this product assumed a child with a phone. A family without
// one got a Send button they could not use, so the child's half of the passport
// simply did not happen for the families keeping their child off a device the
// longest, who are the families most aligned with what we believe.
//
// They get a sentence to say out loud instead. It does the same job and costs
// nothing. See spokenFor in lib/pathway/passport-todo.

export default function PassportToDo({
  childId,
  childName,
  items,
  childItems,
  onApp,
  stageName,
}: {
  childId: string | null
  childName: string | null
  /** The open rows of the child's own stage. Everything at 100 is already out. */
  items: ParentToDo[]
  /** The part of it the child can do themself. */
  childItems: ChildToDo[]
  /** Does this child have the app? Without it there is nowhere to send. */
  onApp: boolean
  /** "Stage 3, Explorer", for the catch up line. */
  stageName?: string | null
}) {
  const [sending, setSending] = useState(false)
  const [sentAt, setSentAt] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [saying, setSaying] = useState<string | null>(null)

  const them = childName ?? 'them'
  const count = items.length
  const childKeys = new Set(childItems.map(c => c.key as string))

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

  // Nothing open is worth saying once, quietly, rather than rendering nothing
  // and leaving a parent wondering whether the panel failed to load.
  if (count === 0) {
    return (
      <div style={{
        background: 'var(--tint-green)', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
        borderRadius: 18, padding: '13px 15px', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span aria-hidden style={{ fontSize: 'var(--text-lg)' }}>✓</span>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>
          {catchUpLine(items, stageName ?? 'this page')}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--tint-sage)', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
      borderRadius: 18, padding: '14px 15px 15px', marginBottom: 14,
    }}>
      {/* WHAT TO DO, SAID BEFORE ANYTHING ELSE. Justin asked to be told on every
          visit what to catch up on, and the honest version of that is the count
          and the one step to start with, never a nag. */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, flexWrap: 'wrap', marginBottom: 3 }}>
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)',
          background: '#fff', border: '2px solid var(--ink)', borderRadius: 9, padding: '3px 9px',
        }}>
          To stamp this page
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)' }}>
          {count} step{count === 1 ? '' : 's'} · no rush
        </span>
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>
        {catchUpLine(items, stageName ?? 'this page')}
      </p>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => {
          const first = i === 0
          const spoken = childKeys.has(it.key) ? spokenFor(it.key) : null
          return (
            <li key={it.key} style={{
              background: '#fff', border: `2px solid ${first ? 'var(--ink)' : 'var(--border)'}`,
              borderRadius: 14, padding: '11px 12px',
              boxShadow: first ? '0 3px 0 var(--ink)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                {/* The number, so four steps read as a sequence rather than a
                    pile. A parent driving this wants to know where they are. */}
                <span aria-hidden style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: first ? 'var(--terracotta)' : '#fff',
                  border: '2px solid var(--ink)', boxSizing: 'border-box',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink)',
                }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>
                      <span aria-hidden style={{ marginRight: 5 }}>{it.emoji}</span>{it.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
                      {it.detail}
                    </span>
                  </span>

                  {/* ── THE INSTRUCTION, ON EVERY STEP ────────────────────
                      Not only on the next one. A parent who can read all four
                      can plan their week; a parent who can read one is being
                      drip fed. */}
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 4 }}>
                    {actionFor(it.key)}
                  </span>

                  {it.ongoing && (
                    <span style={{
                      display: 'inline-block', marginTop: 6,
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)',
                      background: 'var(--cream)', borderRadius: 100, padding: '2px 8px',
                    }}>
                      Kept up, not ticked off
                    </span>
                  )}

                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 8 }}>
                    <Link
                      href={it.href}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none',
                        background: first ? 'var(--terracotta)' : '#fff', color: 'var(--ink)',
                        border: '2px solid var(--ink)', borderRadius: 12,
                        boxShadow: first ? '0 3px 0 var(--ink)' : 'none',
                        padding: '7px 13px',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                      }}
                    >
                      {first ? 'Start here' : 'Open'} <span aria-hidden>→</span>
                    </Link>

                    {/* ── OR SAY IT OUT LOUD ────────────────────────────────
                        Only on the steps a child can actually move, and only
                        when there is no app to send to. A family with no phone
                        in the house got a Send button that did nothing for
                        them; they get the sentence instead. */}
                    {spoken && !onApp && (
                      <button
                        type="button"
                        onClick={() => setSaying(saying === it.key ? null : it.key)}
                        aria-expanded={saying === it.key}
                        title={`Something to say to ${them}, out loud`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                          background: '#fff', color: 'var(--ink-soft)',
                          border: '1.5px solid var(--border)', borderRadius: 100, padding: '6px 11px',
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        }}
                      >
                        🗣 Say it to {them}
                      </button>
                    )}
                  </span>

                  {spoken && !onApp && saying === it.key && (
                    <span style={{
                      display: 'block', marginTop: 8, background: 'var(--terracotta-lt)',
                      border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '10px 12px',
                    }}>
                      <span style={{
                        display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 4,
                      }}>
                        Say this
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45 }}>
                        &ldquo;{spoken}&rdquo;
                      </span>
                    </span>
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      {/* THE CHILD'S HALF, once, at the foot. Three of the five steps are a
          grown up's work, so the child is only ever offered the ones they can
          move. See lib/pathway/passport-todo.ts for what is filtered out. */}
      {childItems.length > 0 && onApp && childId && (
        <div style={{ marginTop: 12, paddingTop: 11, borderTop: '2px solid var(--ink)' }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 9px' }}>
            <strong style={{ fontWeight: 800 }}>{childName ? `${childName} can do` : 'They can do'} {childItems.length === 1 ? 'one of these' : `${childItems.length} of these`}.</strong>{' '}
            It goes on their app on the first of every month. Send it now if you would rather not wait.
          </p>
          <button
            type="button"
            onClick={send}
            disabled={sending || !!sentAt}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: sentAt ? 'var(--retro-green)' : 'var(--terracotta)', color: sentAt ? '#fff' : 'var(--ink)',
              border: '2px solid var(--ink)', borderRadius: 14, padding: '10px 15px',
              boxShadow: sentAt ? 'none' : '0 4px 0 var(--ink)',
              cursor: sending || sentAt ? 'default' : 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
            }}
          >
            {sentAt ? `Sent at ${sentAt} ✓` : sending ? 'Sending' : `Send it to ${them}'s app`}
          </button>
          {failed && (
            <p style={{ fontSize: 'var(--text-sm)', color: '#B93B3F', margin: '7px 0 0', lineHeight: 1.45 }}>
              That did not send. Have another go in a moment.
            </p>
          )}
        </div>
      )}

      {childItems.length > 0 && !onApp && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '11px 0 0', paddingTop: 10, borderTop: '1.5px dashed var(--ink)' }}>
          No app in the house? The lines above are there to say out loud. Set {them} up with the app and we put their part on it, on the first of every month.
        </p>
      )}
    </div>
  )
}
