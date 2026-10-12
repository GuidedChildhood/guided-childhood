'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { WALL } from '@gc/shared/wall-scale'
import { bare, leadLine } from '@gc/shared/schools-your-school'
import { useYourSchoolState } from '@/components/YourSchoolLead'

// BEFORE THE CLASS SEES SLIDE 1, on the seventeen safeguarding flagged lessons.
//
// The projector is the only screen in most classrooms, and since 13 September
// the teacher script opens with the lesson. On a flagged lesson some of those
// lines are written for the teacher alone: on ks4-17 a Year 10 class could
// read "Watch for bravado from some boys" off the board (the sync plan panel,
// 9 October 2026, F1). So on these lessons the script starts folded, and this
// one screen comes first, while the teacher is setting up and before the
// children are looking: who the safeguarding lead is in this school, the quiet
// exit the class should hear about, and that the script is folded.
//
// Three facts and a button, nothing to read twice. The lead comes off this
// screen's own store (the Hub's typed lead), like the slide that asks who to
// tell, so nothing about the school's staff reaches the server. A clicker's
// Next works here too, because a teacher at the front with a remote should not
// have to walk to the laptop to begin.

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: WALL.aside, fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: WALL.aside, color: 'var(--ink)', lineHeight: 1.5, margin: 0,
}

const START_KEYS = new Set(['ArrowRight', 'PageDown', 'Enter', ' '])

export default function BeforeSlideOne({ young, onStart }: { young: boolean; onStart: () => void }) {
  const { school, ready } = useYourSchoolState()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!START_KEYS.has(e.key)) return
      // A focused link or button handles its own Enter and Space.
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'A' || t.tagName === 'BUTTON') && (e.key === 'Enter' || e.key === ' ')) return
      e.preventDefault()
      onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStart])

  const rows: { label: string; children: React.ReactNode }[] = [
    {
      label: 'Your safeguarding lead',
      children: !ready ? null : school ? (
        <p style={body}>
          <strong>{bare(leadLine(school))}</strong>.
          {school.deputyName ? <> If they are out, <strong>{bare(school.deputyName)}</strong>.</> : null}
          {' '}Let them know this lesson runs today, so a child who comes to them afterwards is expected.
        </p>
      ) : (
        <p style={body}>
          Not on this screen yet. Type their name once on{' '}
          <Link href="/hub/dsl#your-school" style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>the safeguarding page</Link>
          {' '}and it shows here and on the slides that ask who to tell.
        </p>
      ),
    },
    {
      label: 'The quiet exit',
      children: (
        <p style={body}>
          {young
            ? 'Tell the class that anyone who feels wobbly can come and sit by you, or by another grown up in the room, at any time, without saying why.'
            : 'Tell the class that anyone can step out quietly at any time, without saying why. Say where they go, and have an adult check on anyone who does.'}
        </p>
      ),
    },
    {
      label: 'Your script is folded',
      children: (
        <p style={body}>
          On this lesson the script starts closed, because some of its notes are for you and the
          class can read the board. Tap <strong>Teacher script</strong> in the bar at the bottom to open it.
        </p>
      ),
    },
  ]

  return (
    <section
      data-before-slide-one
      aria-labelledby="before-slide-one-heading"
      style={{
        background: '#fff', border: '1.5px solid var(--border)', borderTop: '6px solid var(--coral)',
        borderRadius: 'var(--radius-card)', padding: 'clamp(22px, 3vw, 44px)',
        maxWidth: WALL.column, margin: '8px auto 0', boxShadow: '0 5px 0 var(--border)',
      }}
    >
      <div style={{ ...mono, color: 'var(--coral-dark)', marginBottom: '10px' }}>
        For you, before the class sees slide 1
      </div>
      <h2 id="before-slide-one-heading" style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: WALL.title,
        color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em', margin: '0 0 clamp(14px, 2vh, 26px)',
      }}>
        This lesson is safeguarding flagged
      </h2>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.8vh, 22px)' }}>
        {rows.map((r, i) => (
          <li key={r.label} style={{ display: 'flex', gap: 'clamp(12px, 1.4vw, 22px)', alignItems: 'flex-start' }}>
            <span aria-hidden style={{
              flexShrink: 0, width: 'clamp(30px, 2.4vw, 46px)', height: 'clamp(30px, 2.4vw, 46px)', borderRadius: '50%',
              background: 'var(--terracotta-lt)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: WALL.aside,
            }}>
              {i + 1}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...mono, color: 'var(--ink-muted)', marginBottom: '4px' }}>{r.label}</div>
              {r.children}
            </div>
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3) var(--space-5)', flexWrap: 'wrap', marginTop: 'clamp(20px, 3vh, 36px)' }}>
        <button type="button" onClick={onStart} className="btn btn-gold" style={{ fontSize: WALL.aside, padding: 'clamp(12px, 1.6vh, 20px) clamp(24px, 2.4vw, 40px)' }}>
          Start the lesson
        </button>
        <Link href="/hub/dsl" style={{ ...mono, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
          The safeguarding briefing
        </Link>
      </div>
    </section>
  )
}
