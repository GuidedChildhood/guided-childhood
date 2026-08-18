'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { STAGE_QUIZ_LENGTH, STAGE_QUIZ_PASS, type StageQuizQuestion } from '@/lib/content/stage-quizzes'

// ═══ THE CHECK, SAT TOGETHER ON THE PARENT'S SCREEN ═════════════════════════
//
// Justin, 18 August 2026: "should push for app but yes when no app parents can
// do together." So the child's own link stays the front door to the check,
// and THIS is the fallback that ends the dead end: a family with no child app
// used to be told to go and set one up, full stop, and could never finish a
// stage. The recorder for exactly this case, /api/pathway/stage-quiz, had
// been sitting in the codebase with nothing calling it.
//
// Same rules as the child's version, deliberately: five questions sampled
// from the stage's own lessons, answers shuffled so there is no pattern to
// game, four of five passes, every wrong answer teaches with its why line.
// The framing is TOGETHER, sit it with them, because a parent quietly sitting
// the check alone at midnight would make the stamp a certificate of the
// parent's memory, and the passport is the child's application.

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ParentStageCheck({
  childId,
  childName,
  stageId,
  stageName,
  stampName,
  pool,
  backHref,
}: {
  childId: string | null
  childName: string
  stageId: number
  stageName: string
  stampName: string
  pool: StageQuizQuestion[]
  backHref: string
}) {
  // One sampled, shuffled run per mount: a replay differs, same as the child's.
  const run = useMemo(() =>
    shuffle(pool).slice(0, STAGE_QUIZ_LENGTH).map(q => {
      const order = shuffle(q.options.map((_, i) => i))
      return { ...q, order }
    }), [pool])

  const [at, setAt] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState<{ passed: boolean; score: number } | null>(null)
  const [saving, setSaving] = useState(false)

  const q = run[at]
  const total = Math.min(STAGE_QUIZ_LENGTH, run.length)

  async function next(finalCorrect: number) {
    if (at + 1 < total) {
      setAt(at + 1)
      setPicked(null)
      return
    }
    const passed = finalCorrect >= STAGE_QUIZ_PASS
    setSaving(true)
    try {
      await fetch('/api/pathway/stage-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, stageId, correct: finalCorrect }),
      })
    } catch { /* the score still shows even if saving fails */ }
    setSaving(false)
    setFinished({ passed, score: finalCorrect })
  }

  if (finished) {
    return (
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div aria-hidden style={{ fontSize: 44, lineHeight: 1 }}>{finished.passed ? '🏅' : '💪'}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '10px 0 6px' }}>
          {finished.passed ? `The ${stampName} stamp is earned` : `${finished.score} of ${total} this time`}
        </h2>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 420, margin: '0 auto' }}>
          {finished.passed
            ? `${childName}'s ${stageName} page is stamped for good. Open the passport and see it land.`
            : 'No marks lost for a retry. Go back over the wobbly ones together and have another go whenever you like.'}
        </p>
        <Link href={backHref} className="btn btn-gold" style={{ display: 'inline-flex', marginTop: 16 }}>
          {finished.passed ? 'See the stamp' : 'Back to the passport'}
        </Link>
      </div>
    )
  }

  if (!q) {
    return (
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
        This stage&rsquo;s check is not ready yet. Try again after the next lesson.
      </p>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="eyebrow">{stageName} check · {at + 1} of {total}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
          {correct} right
        </span>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 12px', lineHeight: 1.3 }}>
        {q.q}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.order.map(optionIndex => {
          const chosen = picked === optionIndex
          const isRight = optionIndex === q.answer
          const revealed = picked !== null
          return (
            <button
              key={optionIndex}
              type="button"
              disabled={revealed}
              onClick={() => {
                setPicked(optionIndex)
                if (isRight) setCorrect(c => c + 1)
              }}
              style={{
                textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                background: revealed ? (isRight ? 'var(--tint-sage)' : chosen ? 'var(--danger-bg)' : '#fff') : '#fff',
                border: `1.5px solid ${revealed ? (isRight ? 'var(--retro-green)' : chosen ? 'var(--danger-border)' : 'var(--border)') : 'var(--border)'}`,
                borderRadius: 13, padding: '12px 14px',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
                boxShadow: revealed ? 'none' : '0 2px 0 var(--border)',
              }}
            >
              {q.options[optionIndex]}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 13, padding: '11px 13px', marginTop: 11 }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            {q.why}
          </p>
          <button
            type="button"
            onClick={() => next(correct)}
            disabled={saving}
            className="btn btn-gold"
            style={{ display: 'inline-flex', marginTop: 10 }}
          >
            {at + 1 < total ? 'Next question' : saving ? 'Saving' : 'Finish the check'}
          </button>
        </div>
      )}
    </div>
  )
}
