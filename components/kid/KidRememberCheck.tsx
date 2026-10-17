'use client'

import { useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { resolveTheme, type KidTheme } from '@/lib/kid/theme'

// The Remember check on the child's side: up to three questions from lessons
// passed weeks ago, one at a time, the why after each. No stars, no stamp, no
// score to fail: it says what they kept, and a miss simply comes round again.
// The server marks it (app/api/kid/remember); this screen shows its answer.

type Q = { q: string; options: string[]; answer: number; why: string; lessonTitle: string; flagged: boolean }

export default function KidRememberCheck({
  token, childName, questions, lessonsHref, tellHref, theme,
}: {
  token: string
  childName: string
  questions: Q[]
  lessonsHref: string
  tellHref: string
  theme?: KidTheme
}) {
  const t = theme ?? resolveTheme(null)
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ question: string; chosen: string; correct: boolean }[]>([])
  const [done, setDone] = useState<{ right: number; total: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const q = questions[step]

  const shell: React.CSSProperties = { minHeight: '100dvh', background: t.bg, padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }
  const card: React.CSSProperties = { background: t.panel, border: `1.5px solid ${t.panelBorder}`, borderRadius: 'var(--radius-card)', padding: '20px 18px 22px', marginTop: 18 }
  const display: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, color: t.ink }
  const button = (bg: string): React.CSSProperties => ({
    display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', background: bg, color: 'var(--ink)',
    border: 'none', borderRadius: 'var(--radius-btn)', padding: '14px 16px', marginBottom: 10, minHeight: 44,
    fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, boxShadow: `0 5px 0 ${t.shadow}`,
  })
  const head = (mood: 'wave' | 'happy' | 'thinking') => (
    <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <DigiCharacter size={30} mood={mood} />
    </span>
  )
  const back = <Link href={lessonsHref} style={{ ...display, fontSize: 'var(--text-base)', color: t.inkSoft, textDecoration: 'none' }}>← My lessons</Link>

  async function finish(all: { question: string; chosen: string; correct: boolean }[]) {
    setSaving(true)
    let right = all.filter(a => a.correct).length
    let total = questions.length
    try {
      const res = await fetch('/api/kid/remember', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, answers: all }) })
      const j = await res.json().catch(() => null) as { right?: number; total?: number } | null
      if (res.ok && j && typeof j.right === 'number') { right = j.right; total = j.total ?? total }
    } catch { /* the result still shows */ }
    setSaving(false)
    setDone({ right, total })
  }

  if (!questions.length) {
    return (
      <div style={shell}><div style={{ maxWidth: 560, margin: '0 auto' }}>{back}
        <div style={{ ...card, display: 'flex', gap: 14 }}>{head('happy')}
          <p style={{ color: t.inkSoft, margin: 0, fontSize: 'var(--text-base)' }}>Nothing to remember today, {childName}. Your next Remember check comes round after your next lesson.</p>
        </div>
      </div></div>
    )
  }

  if (done) {
    return (
      <div style={shell}><div style={{ maxWidth: 560, margin: '0 auto' }}>{back}
        <div style={{ ...card, display: 'flex', gap: 14 }}>{head('happy')}
          <div>
            <h1 style={{ ...display, fontSize: 'var(--text-xl)', margin: '0 0 8px' }}>{done.right === done.total ? 'You kept every one' : `You kept ${done.right} of ${done.total}`}</h1>
            <p style={{ color: t.inkSoft, margin: '0 0 14px', fontSize: 'var(--text-base)' }}>
              {done.right === done.total ? 'Weeks after the lessons, and still there. That is what remembering looks like.' : 'The one that slipped comes round again in a later check. Nothing is lost.'}
            </p>
            <Link href={lessonsHref} style={{ ...button('var(--butter)'), textAlign: 'center', textDecoration: 'none' }}>Back to my lessons</Link>
          </div>
        </div>
      </div></div>
    )
  }

  if (!started) {
    return (
      <div style={shell}><div style={{ maxWidth: 560, margin: '0 auto' }}>{back}
        <div style={{ ...card, display: 'flex', gap: 14 }}>{head('wave')}
          <div>
            <h1 style={{ ...display, fontSize: 'var(--text-xl)', margin: '0 0 8px' }}>Your Remember check</h1>
            <p style={{ color: t.inkSoft, margin: '0 0 16px', fontSize: 'var(--text-base)' }}>
              {questions.length === 1 ? 'One question' : `${questions.length} questions`} from lessons you passed a while ago, about a minute. No stars, no stamp. Just what you kept.
            </p>
            <button onClick={() => setStarted(true)} style={{ ...button('var(--butter)'), textAlign: 'center' }}>I am ready</button>
          </div>
        </div>
      </div></div>
    )
  }

  return (
    <div style={shell}><div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {back}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: 'var(--radius-pill)', padding: '5px 12px' }}>
          {step + 1} of {questions.length}
        </span>
      </div>
      <div style={card}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.inkMuted, margin: '0 0 6px' }}>From {q.lessonTitle}</p>
        <h2 style={{ ...display, fontSize: 'var(--text-lg)', margin: '0 0 16px', lineHeight: 1.35 }}>{q.q}</h2>
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer
          const bg = picked === null ? 'var(--warm)' : isAnswer ? 'var(--sage)' : i === picked ? (t.dark ? 'rgba(255,255,255,0.28)' : 'rgba(26,26,46,0.16)') : (t.dark ? 'rgba(255,255,255,0.14)' : 'rgba(26,26,46,0.07)')
          return (
            <button key={i} disabled={picked !== null} style={{ ...button(bg), cursor: picked === null ? 'pointer' : 'default' }} onClick={() => {
              if (picked !== null) return
              setPicked(i)
              setAnswers(a => [...a, { question: q.q, chosen: opt, correct: isAnswer }])
            }}>{opt}</button>
          )
        })}
        {picked !== null && (
          <div style={{ marginTop: 6 }}>
            <p style={{ color: t.ink, fontSize: 'var(--text-base)', margin: '0 0 14px' }}>
              <strong>{picked === q.answer ? 'Yes. ' : 'Not this time. '}</strong>{q.why}
            </p>
            {q.flagged && (
              <p style={{ color: t.inkSoft, fontSize: 'var(--text-sm)', margin: '0 0 14px', lineHeight: 1.5 }}>
                If this was about you, or worried you, tell your grown up, a teacher you trust, or Childline on 0800 1111. <Link href={tellHref} style={{ color: t.ink, fontWeight: 800 }}>Need to talk to someone?</Link>
              </p>
            )}
            <button disabled={saving} style={{ ...button('var(--butter)'), textAlign: 'center', marginBottom: 0 }} onClick={() => {
              if (step + 1 >= questions.length) finish(answers)
              else { setStep(s => s + 1); setPicked(null) }
            }}>{saving ? 'Saving…' : step + 1 >= questions.length ? 'See what I kept' : 'Next one'}</button>
          </div>
        )}
      </div>
    </div></div>
  )
}
