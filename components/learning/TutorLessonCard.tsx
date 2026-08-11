'use client'

import { useState } from 'react'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides, type LessonSlide } from '@gc/shared/lesson-slides'

// The private tutor, on the parent's side.
//
// The decoder ends by telling a parent what the homework is. This is the button
// underneath it: teach it to them.
//
// ── THREE STATES AND THE MIDDLE ONE IS THE POINT ────────────────────────────
//
// Offer, preview, sent. The preview is not a nicety, it is the consent step: a
// parent plays the whole lesson their child would play, in the same player,
// with the completion write switched off, and then decides. Nothing reaches a
// child that a grown up has not read.
//
// So the two buttons at the bottom are deliberately equal in weight. Bin it is
// not a quiet grey link off to the side, because a parent who feels awkward
// rejecting it will send one they did not like, and then the tutor is something
// that happens to their child rather than something they chose.

type Lesson = {
  id: string
  title: string
  emoji: string | null
  stars: number
  slides: unknown
  year_group: number
  subject: string | null
}

export default function TutorLessonCard({
  childId, childName, objectiveIds, homework, origin = 'homework',
}: {
  childId: string
  childName: string
  // The objectives the decoder matched. Revalidated server side; sent here so
  // the lesson teaches the thing the parent just read about rather than a
  // second guess at the same homework.
  objectiveIds?: string[]
  homework?: string
  origin?: 'homework' | 'checkpoint'
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [slides, setSlides] = useState<LessonSlide[] | null>(null)
  const [sent, setSent] = useState(false)

  const name = childName && childName !== 'Your child' ? childName : 'them'

  async function make() {
    if (busy) return
    setBusy(true); setError(''); setLesson(null); setSlides(null); setSent(false)
    try {
      const r = await fetch('/api/learning/lesson', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, objectiveIds, text: homework, origin }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.ok && d.lesson) {
        const parsed = parseSlides(d.lesson.slides)
        if (!parsed) setError('That deck came back empty. Have another go.')
        else { setLesson(d.lesson as Lesson); setSlides(parsed) }
      } else {
        setError(d.error ?? 'That did not go through. Have another go in a moment.')
      }
    } catch {
      setError('That did not go through. Have another go in a moment.')
    }
    setBusy(false)
  }

  async function decide(action: 'send' | 'bin') {
    if (!lesson || busy) return
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/learning/lesson/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, action }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) setError(d.error ?? 'That did not go through.')
      else if (action === 'bin') { setLesson(null); setSlides(null) }
      else setSent(true)
    } catch {
      setError('That did not go through.')
    }
    setBusy(false)
  }

  const label: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
  }

  if (sent && lesson) {
    return (
      <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green)', borderRadius: 20, padding: '18px 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>
          Sent to {name} {lesson.emoji ?? '📘'}
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          It is sitting at the top of their app now, worth {lesson.stars} star{lesson.stars === 1 ? '' : 's'} when they finish it. You will see it tick off on your side.
        </p>
      </div>
    )
  }

  if (lesson && slides) {
    return (
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '16px 18px' }}>
        <div style={{ ...label, marginBottom: 6 }}>Read it before they do</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 12 }}>
          {lesson.emoji ?? '📘'} {lesson.title}
        </div>

        {/* completeEndpoint null: this is the same player the child gets, with
            nothing written at the end of it. A parent tapping through a preview
            must not mint stars or mark anything done. */}
        <div style={{ background: 'var(--cream)', borderRadius: 18, padding: '14px 12px' }}>
          <LessonPlayer
            lessonId={lesson.id}
            lessonSource="lesson"
            slides={slides}
            backHref="#"
            completeEndpoint={null}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <button
            onClick={() => decide('bin')}
            disabled={busy}
            style={{
              padding: '13px', cursor: busy ? 'default' : 'pointer', background: '#fff',
              color: 'var(--ink)', borderRadius: 16, border: '1.5px solid var(--border)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            }}
          >
            Not this one
          </button>
          <button
            onClick={() => decide('send')}
            disabled={busy}
            style={{
              padding: '13px', cursor: busy ? 'default' : 'pointer', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: 16, border: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              boxShadow: '0 4px 0 var(--terracotta-dark)', opacity: busy ? 0.6 : 1,
            }}
          >
            Send it to {name}
          </button>
        </div>

        <button
          onClick={make}
          disabled={busy}
          style={{
            width: '100%', marginTop: 10, padding: '11px', cursor: busy ? 'default' : 'pointer',
            background: 'transparent', color: 'var(--ink-soft)', border: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
            textDecoration: 'underline',
          }}
        >
          Write me a different one
        </button>

        {error && <p style={{ fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>{error}</p>}
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--tint-blue)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
      <div style={{ ...label, marginBottom: 6 }}>The private tutor</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>
        Want {name} taught this properly?
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        DiGi will write a short lesson on exactly this, in words their year uses. You read the whole thing first, then send it to their phone if you like it. Finishing it earns stars, the same as any job.
      </p>
      <button
        onClick={make}
        disabled={busy}
        style={{
          width: '100%', padding: '14px', cursor: busy ? 'default' : 'pointer',
          background: 'var(--deep-teal)', color: '#fff', border: 'none', borderRadius: 16,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
          boxShadow: '0 4px 0 rgba(0,0,0,0.28)', opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? 'Writing the lesson' : 'Make a lesson from this'}
      </button>
      {busy && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '10px 0 0' }}>
          A whole lesson takes a few seconds longer than an answer. Worth the wait.
        </p>
      )}
      {error && <p style={{ fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>{error}</p>}
    </div>
  )
}
