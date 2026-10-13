'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// THE PARENT'S ACTIONS ON ONE LESSON ROW (12 October 2026).
//
// Justin, on the lessons page: "should there be an action to nudge child's
// app or click co watch or save for later?" One main action per row, so the
// page stays calm:
//   - this week's lesson: Send it to the child's app, or once it is there,
//     Nudge them (one per lesson, counted only when it reached their phone),
//     with Do it together beside it (the lesson on the parent's phone, with
//     the child, which still ticks off)
//   - any other lesson not passed: Do this one instead, which makes it this
//     week's and parks the current one on the list rather than losing it
//
// The routes behind these were built on 9 October: the send route
// (app/api/quests/lessons, POST) and the do together route. This is the
// button, the words for each answer, and a refresh so the row shows the new
// state.

type Mode = 'send' | 'nudge' | 'nudged' | 'instead'

const button: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '10px 16px', borderRadius: 'var(--radius-btn)', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
  color: 'var(--ink)', textDecoration: 'none',
}
const primary: React.CSSProperties = { ...button, background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: '0 5px 0 var(--terracotta-dark)' }
const quiet: React.CSSProperties = { ...button, background: '#fff', border: 'var(--edge)', boxShadow: '0 4px 0 var(--border)' }
// The other rows' action is a quiet link, not a button: eight equal buttons
// down the page would shout over the one lesson that is this week's.
const textLink: React.CSSProperties = {
  background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)',
  color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3,
}

export default function LessonRowActions({
  childId, childName, lessonId, mode, togetherHref,
}: {
  childId: string
  childName: string
  lessonId: string
  mode: Mode
  togetherHref?: string | null
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  const say = (state: string | undefined, push?: string) => {
    switch (state) {
      case 'sent':
        return push === 'sent' ? `Sent. It is on ${childName}'s app now.`
          : `It is on ${childName}'s list. ${pushLine(push)}`
      case 'nudged': return `Nudged. ${childName} will see it came from you.`
      case 'already_nudged': return 'Already nudged. One nudge per lesson keeps it kind.'
      case 'already_passed': return `${childName} has passed this one.`
      default: return pushLine(state)
    }
  }
  const pushLine = (reason?: string) =>
    reason === 'quiet_hours' ? `${childName}'s phone is in quiet hours until 7am, so nothing was sent. Try again in the morning.`
    : reason === 'no_device' ? `${childName}'s app is not set up for reminders yet, so it will be there next time they open it.`
    : `Could not reach ${childName}'s phone just now. It is still on their list.`

  async function act() {
    if (busy) return
    setBusy(true)
    setNote(null)
    try {
      const res = await fetch('/api/quests/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, lesson_id: lessonId, instead: mode === 'instead' }),
      })
      const data = await res.json().catch(() => ({})) as { state?: string; push?: string; error?: string }
      if (!res.ok) {
        setNote(data.error === 'locked' ? 'This one opens with membership.'
          : data.error === 'waits' ? `This one waits for ${childName}'s school year.`
          : 'That did not go through. Try again in a moment.')
        return
      }
      setNote(say(data.state, data.push))
      router.refresh()
    } catch {
      setNote('That did not go through. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  const label = mode === 'send' ? `Send to ${childName}'s app`
    : mode === 'nudge' ? `Nudge ${childName}`
    : mode === 'instead' ? 'Do this one instead'
    : 'Nudged ✓'

  return (
    <div data-row-actions={mode} style={{ marginTop: mode === 'instead' ? 6 : 10 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {mode === 'nudged' ? (
          <span style={{ ...quiet, cursor: 'default', boxShadow: 'none', color: 'var(--ink-soft)' }}>{label}</span>
        ) : (
          <button type="button" onClick={act} disabled={busy} style={{ ...(mode === 'instead' ? textLink : primary), opacity: busy ? 0.6 : 1 }}>
            {busy ? 'One moment' : label}
          </button>
        )}
        {togetherHref && (
          <a href={togetherHref} data-do-together style={quiet}>Do it together</a>
        )}
      </div>
      {note && (
        <p role="status" style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{note}</p>
      )}
    </div>
  )
}
