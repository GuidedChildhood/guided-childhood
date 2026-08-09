'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { sampleFromPool, STAGE_QUIZ_PASS, STAGE_QUIZ_LENGTH, type StageQuizQuestion } from '@/lib/content/stage-quizzes'

// The big check at the end of a stage, on the child's side, on the kid dark
// theme. The questions are the ones their own lessons already asked, gathered
// server side, so nothing here is new to them: it is the whole stage said back.
//
// Never framed as a test they can fail. Falling short says which lessons to go
// back over and lets them come again, because a stage lasts two to three years
// and a child who reads "failed" at the end of it learns the wrong thing about
// the whole pathway.

type Shuffled = { q: string; options: string[]; answer: number; why: string }

function shuffleOptions(item: StageQuizQuestion, seed: number): Shuffled {
  const idx = item.options.map((_, i) => i)
  let s = (seed % 2147483647) || 1
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return {
    q: item.q,
    options: idx.map(i => item.options[i]),
    answer: idx.indexOf(item.answer),
    why: item.why,
  }
}

export default function KidStageQuiz({
  token, stageId, stageName, stampName, childName, pool, alreadyPassed, lessonsHref,
}: {
  token: string
  stageId: number
  stageName: string
  stampName: string
  childName: string
  pool: StageQuizQuestion[]
  alreadyPassed: boolean
  lessonsHref: string
}) {
  // A fresh seed each mount, so coming back gives a fresh five and a fresh
  // answer order. Client only, so Date is fine here.
  const [seed] = useState(() => Math.floor(Date.now() % 2147483647) || 1)
  const questions = useMemo<Shuffled[]>(
    () => sampleFromPool(pool, seed).map((item, i) => shuffleOptions(item, seed + i * 101)),
    [pool, seed],
  )

  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState<{ passed: boolean; score: number } | null>(null)
  const [saving, setSaving] = useState(false)

  const q = questions[step]

  async function finish(finalCorrect: number) {
    setSaving(true)
    const passed = finalCorrect >= STAGE_QUIZ_PASS
    try {
      await fetch('/api/kid/stage-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, stage_id: stageId, correct: finalCorrect }),
      })
    } catch { /* the score still shows even if saving fails */ }
    setSaving(false)
    setFinished({ passed, score: finalCorrect })
  }

  function choose(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setCorrect(c => c + 1)
  }

  function next() {
    if (step + 1 >= questions.length) finish(correct)
    else { setStep(s => s + 1); setPicked(null) }
  }

  const shell: React.CSSProperties = {
    minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px',
    fontFamily: 'var(--font-body)',
  }
  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.14)',
    borderRadius: 20, padding: '20px 18px 22px',
  }
  const display: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff',
  }
  const button = (bg: string): React.CSSProperties => ({
    display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
    background: bg, color: 'var(--ink)', border: 'none', borderRadius: 16,
    padding: '14px 16px', marginBottom: 10, fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-body)', fontWeight: 600, boxShadow: '0 5px 0 rgba(0,0,0,0.22)',
  })

  const head = (mood: 'wave' | 'happy' | 'speak' | 'thinking') => (
    <span style={{
      flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <DigiCharacter size={30} mood={mood} />
    </span>
  )

  const back = (
    <Link href={lessonsHref} style={{
      ...display, fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
    }}>
      ← My lessons
    </Link>
  )

  // ── Already stamped ───────────────────────────────────────────────────────
  if (alreadyPassed && !finished) {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {back}
          <div style={{ ...card, marginTop: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {head('happy')}
            <div>
              <h1 style={{ ...display, fontSize: 'var(--text-xl)', margin: '0 0 8px' }}>
                You already passed this one
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.82)', margin: 0, fontSize: 'var(--text-base)' }}>
                The {stampName} stamp is yours, {childName}. You can have another go any time you
                fancy it, and your stamp stays put either way.
              </p>
              <button onClick={() => setStarted(true)} style={{ ...button('var(--butter)'), marginTop: 16, textAlign: 'center' }}>
                Have another go
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── The result ────────────────────────────────────────────────────────────
  if (finished) {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {back}
          <div style={{ ...card, marginTop: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {head(finished.passed ? 'happy' : 'speak')}
            <div>
              <h1 style={{ ...display, fontSize: 'var(--text-xl)', margin: '0 0 8px' }}>
                {finished.passed ? `That is the ${stampName} stamp earned` : 'Good go, not quite yet'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.82)', margin: '0 0 14px', fontSize: 'var(--text-base)' }}>
                {finished.score} of {questions.length} right.{' '}
                {finished.passed
                  ? `Everything ${stageName} was built to teach you, you have got. Your grown up will see it on the pathway.`
                  : `You need ${STAGE_QUIZ_PASS} to earn the stamp. Nothing is lost, go back over the lessons and come again whenever you want.`}
              </p>
              <Link href={lessonsHref} style={{ ...button(finished.passed ? 'var(--sage)' : 'var(--butter)'), textAlign: 'center', textDecoration: 'none' }}>
                {finished.passed ? 'Back to my lessons' : 'Back over the lessons'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Nothing to ask ────────────────────────────────────────────────────────
  if (!questions.length) {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {back}
          <div style={{ ...card, marginTop: 18 }}>
            <p style={{ color: 'rgba(255,255,255,0.82)', margin: 0, fontSize: 'var(--text-base)' }}>
              The big check is not ready yet. Have a look at your lessons and come back soon.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── The opener ────────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={shell}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {back}
          <div style={{ ...card, marginTop: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {head('wave')}
            <div>
              <h1 style={{ ...display, fontSize: 'var(--text-xl)', margin: '0 0 8px' }}>
                The big {stageName} check
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.82)', margin: '0 0 6px', fontSize: 'var(--text-base)' }}>
                {STAGE_QUIZ_LENGTH} questions, {childName}, and you have met every one of them
                before. They come straight from your own lessons.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.62)', margin: '0 0 16px', fontSize: 'var(--text-base)' }}>
                Get {STAGE_QUIZ_PASS} right and the {stampName} stamp is yours. Get it wrong and
                nothing bad happens, you can come again.
              </p>
              <button onClick={() => setStarted(true)} style={{ ...button('var(--butter)'), textAlign: 'center' }}>
                I am ready
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── A question ────────────────────────────────────────────────────────────
  return (
    <div style={shell}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          {back}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)',
            background: 'var(--terracotta)', borderRadius: 100, padding: '5px 12px',
          }}>
            {step + 1} of {questions.length}
          </span>
        </div>

        <div style={card}>
          <h2 style={{ ...display, fontSize: 'var(--text-lg)', margin: '0 0 16px', lineHeight: 1.35 }}>
            {q.q}
          </h2>

          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer
            const bg = picked === null
              ? 'var(--warm)'
              : isAnswer ? 'var(--sage)'
              : i === picked ? 'rgba(255,255,255,0.28)'
              : 'rgba(255,255,255,0.14)'
            return (
              <button key={i} onClick={() => choose(i)} disabled={picked !== null} style={{
                ...button(bg),
                cursor: picked === null ? 'pointer' : 'default',
                color: picked !== null && !isAnswer && i !== picked ? 'rgba(255,255,255,0.7)' : 'var(--ink)',
              }}>
                {opt}
              </button>
            )
          })}

          {picked !== null && (
            <div style={{ marginTop: 6 }}>
              <p style={{ color: 'rgba(255,255,255,0.86)', fontSize: 'var(--text-base)', margin: '0 0 14px' }}>
                <strong style={{ color: '#fff' }}>{picked === q.answer ? 'Yes. ' : 'Not this time. '}</strong>
                {q.why}
              </p>
              <button onClick={next} disabled={saving} style={{ ...button('var(--butter)'), textAlign: 'center', marginBottom: 0 }}>
                {saving ? 'Saving…' : step + 1 >= questions.length ? 'See how I did' : 'Next one'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
