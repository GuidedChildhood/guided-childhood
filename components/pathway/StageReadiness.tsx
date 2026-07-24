'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { sampleStageQuiz, STAGE_QUIZ_PASS, STAGE_QUIZ_LENGTH, type StageQuizQuestion } from '@/lib/content/stage-quizzes'

// The end of stage readiness check, DiGi's voice. As a family nears the end of
// a stage, DiGi does the one thing a good teacher does before a milestone: reads
// where they actually are, names what is left in plain words, and when nothing
// is left, offers the short passport quiz that earns the stamp. Never a test of
// the child, never medical or clinical, just a warm confirmation that the few
// things this stage was built to leave the grown up with have landed.

type AmberItem = { name: string; improve: string; href: string }

// A shuffled copy of one question's options, with the new index of the right
// answer, so there is never a positional pattern to learn across a replay.
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

export default function StageReadiness({
  stageId, stageName, stampName, childId, childName,
  greens, activeAreas, lessonsLeft, ambers, alreadyPassed,
}: {
  stageId: number
  stageName: string
  stampName: string
  childId?: string | null
  childName?: string | null
  greens: number
  activeAreas: number
  lessonsLeft: number
  ambers: AmberItem[]
  alreadyPassed: boolean
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const allGreen = ambers.length === 0 && lessonsLeft === 0

  // A fresh seed each mount, so opening the quiz gives a fresh five and fresh
  // answer order. Client only, so Date is fine here.
  const [seed] = useState(() => Math.floor(Date.now() % 2147483647) || 1)
  const questions = useMemo<Shuffled[]>(
    () => sampleStageQuiz(stageId, seed).map((item, i) => shuffleOptions(item, seed + i * 101)),
    [stageId, seed],
  )

  const [open, setOpen] = useState(false)
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
      await fetch('/api/pathway/stage-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, stageId, correct: finalCorrect }),
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
    const finalCorrect = correct
    if (step + 1 >= questions.length) {
      finish(finalCorrect)
    } else {
      setStep(s => s + 1)
      setPicked(null)
    }
  }

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
    padding: '20px 20px 22px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)',
  }
  const digiHead = (mood: 'wave' | 'happy' | 'speak' | 'thinking') => (
    <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <DigiCharacter size={30} mood={mood} />
    </span>
  )

  // Already stamped: quiet confirmation, no quiz to retake.
  if (alreadyPassed && !finished) {
    return (
      <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 20px' }}>
        <div style={{ ...card, background: 'var(--tint-green)', border: '1.5px solid var(--retro-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            {digiHead('happy')}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--retro-green-dark)', lineHeight: 1.15 }}>
                {stampName} stamped
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
                {kid} passed the {stageName} check. That stage is done and the stamp is theirs.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // The result, pass or another look.
  if (finished) {
    const passed = finished.passed
    return (
      <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 20px' }}>
        <div style={{ ...card, background: passed ? 'var(--tint-green)' : 'var(--terracotta-lt)', border: `1.5px solid ${passed ? 'var(--retro-green)' : 'var(--terracotta)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            {digiHead(passed ? 'happy' : 'thinking')}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: passed ? 'var(--retro-green-dark)' : 'var(--ink)', lineHeight: 1.15 }}>
                {passed ? `${stampName} stamped` : 'Nearly there'}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
                {passed
                  ? `${finished.score} of ${STAGE_QUIZ_LENGTH}. The ${stageName} stage is stamped and ${kid} is ready for what comes next.`
                  : `${finished.score} of ${STAGE_QUIZ_LENGTH}. Have another look at the stage together and try again when you are ready. No rush at all.`}
              </p>
            </div>
          </div>
          {!passed && (
            <button
              onClick={() => { setOpen(true); setStep(0); setPicked(null); setCorrect(0); setFinished(null) }}
              style={{
                marginTop: 15, width: '100%', background: 'var(--terracotta)', color: 'var(--ink)',
                border: 'none', borderRadius: 14, padding: '13px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
                boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}
            >
              Try the check again
            </button>
          )}
        </div>
      </div>
    )
  }

  // The quiz itself, one question at a time.
  if (open && q) {
    return (
      <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 20px' }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {stageName} check
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
              {step + 1} of {questions.length}
            </span>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {questions.map((_, i) => (
              <span key={i} style={{ flex: 1, height: 6, borderRadius: 100, background: i <= step ? 'var(--terracotta)' : 'var(--cream)' }} />
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 16px' }}>
            {q.q}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              const isPicked = picked === i
              const isAnswer = i === q.answer
              const reveal = picked !== null
              const bg = reveal
                ? isAnswer ? 'var(--tint-green)' : isPicked ? 'var(--terracotta-lt)' : '#fff'
                : '#fff'
              const border = reveal
                ? isAnswer ? 'var(--retro-green)' : isPicked ? 'var(--terracotta)' : 'var(--border)'
                : 'var(--border)'
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={picked !== null}
                  style={{
                    textAlign: 'left', background: bg, border: `1.5px solid ${border}`,
                    borderRadius: 14, padding: '14px 16px', cursor: picked === null ? 'pointer' : 'default',
                    fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--ink)',
                    lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  {reveal && isAnswer && <span aria-hidden>✓</span>}
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>

          {picked !== null && (
            <div style={{ marginTop: 15 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, background: 'var(--cream)', borderRadius: 12, padding: '12px 14px' }}>
                {q.why}
              </p>
              <button
                onClick={next}
                disabled={saving}
                style={{
                  marginTop: 14, width: '100%', background: 'var(--deep-teal)', color: '#fff',
                  border: 'none', borderRadius: 14, padding: '14px 18px', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
                  boxShadow: '0 4px 0 rgba(0,0,0,0.18)',
                }}
              >
                {step + 1 >= questions.length ? (saving ? 'Saving…' : 'See the result') : 'Next'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // The readiness read, before the quiz opens.
  return (
    <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 20px' }}>
      <div style={{ ...card, background: allGreen ? 'var(--tint-green)' : '#fff', border: `1.5px solid ${allGreen ? 'var(--retro-green)' : 'var(--border)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          {digiHead(allGreen ? 'happy' : 'speak')}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>
              End of stage check
            </div>
            {/* The important insight, extra large */}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 23, letterSpacing: '-0.01em', color: allGreen ? 'var(--retro-green-dark)' : 'var(--ink)', lineHeight: 1.15 }}>
              {allGreen
                ? `${kid} is ready for the ${stampName} stamp`
                : `Almost at the ${stampName} stamp`}
            </div>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '13px 0 0' }}>
          {allGreen
            ? `Every part of the ${stageName} stage is done, ${greens} of ${activeAreas} strands green. One short check together and the stamp is theirs.`
            : `${greens} of ${activeAreas} strands are green. Here is the little that is left before the ${stageName} stamp lands.`}
        </p>

        {!allGreen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 13 }}>
            {ambers.map(a => (
              <Link key={a.name} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '12px 14px',
              }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)', lineHeight: 1.2 }}>{a.name}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 1 }}>{a.improve}</span>
                </span>
                <span aria-hidden style={{ flexShrink: 0, color: 'var(--terracotta-dark)', fontSize: 20, fontWeight: 800 }}>→</span>
              </Link>
            ))}
            {lessonsLeft > 0 && (
              <Link href="/dashboard/lessons" style={{
                display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '12px 14px',
              }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)', lineHeight: 1.2 }}>
                    {lessonsLeft} stage {lessonsLeft === 1 ? 'lesson' : 'lessons'} to finish
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 1 }}>Ten minutes each, done together.</span>
                </span>
                <span aria-hidden style={{ flexShrink: 0, color: 'var(--terracotta-dark)', fontSize: 20, fontWeight: 800 }}>→</span>
              </Link>
            )}
          </div>
        )}

        {allGreen && (
          <button
            onClick={() => setOpen(true)}
            style={{
              marginTop: 16, width: '100%', background: 'var(--terracotta)', color: 'var(--ink)',
              border: 'none', borderRadius: 14, padding: '14px 18px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Take the {stageName} check
          </button>
        )}
      </div>
    </div>
  )
}
