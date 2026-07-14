'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import Celebration from '@/components/ui/Celebration'
import {
  FIRST_COMPLETION_STARS,
  REDO_STARS,
  type ParentLesson,
  type ParentLessonCard,
  type ParentLessonSegment,
} from '@/lib/lessons/parent-lessons'

// The watch together player: segment A, pause and ask, segment B, pause
// and say, segment C, then the What would DiGi do quiz, then the
// completion write. Same skin as LessonPlayer (segmented progress, DiGi
// reacting, inline tokens), but the beats are video segments with the
// grown up conversation slotted between them, which is the whole point
// of the format. Used by the parent dashboard and the kid link alike;
// the token or child id decides which door the completion goes through.

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

type Step =
  | { kind: 'video'; segment: ParentLessonSegment; label: string }
  | { kind: 'card'; card: ParentLessonCard }

type CompleteResult = {
  ok: boolean
  first_completion: boolean
  times_completed: number
  stars: number
  passport_awarded: boolean
  stage_id: number
}

// Pause and ask: the grown up asks, the video waits. The older child
// variant sits behind a gentle toggle so a four year old's screen never
// reads like homework.
function AskCard({ card }: { card: ParentLessonCard }) {
  const [showOlder, setShowOlder] = useState(false)
  return (
    <div style={{ background: 'var(--stage-1)', borderRadius: '20px', padding: 'clamp(22px, 4vw, 30px)', border: '1.5px solid var(--stage-1-bold)' }}>
      <div style={{ ...eyebrowStyle, color: 'var(--stage-1-text)', marginBottom: '12px' }}>
        Pause and ask · Grown up, this one is yours
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.45, letterSpacing: '-0.02em', margin: 0 }}>
        &ldquo;{card.prompt}&rdquo;
      </p>
      {card.older_variant && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setShowOlder(o => !o)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--stage-1-text)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            {showOlder ? '▾ For ages 6 to 7' : '▸ For ages 6 to 7, ask this too'}
          </button>
          {showOlder && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6, margin: '10px 0 0' }}>
              &ldquo;{card.older_variant}&rdquo;
            </p>
          )}
        </div>
      )}
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '16px 0 0' }}>
        Let the answer land, there is no wrong one. Continue when you are both ready.
      </p>
    </div>
  )
}

// Pause and say: the exact words, said like you mean it.
function SayCard({ card }: { card: ParentLessonCard }) {
  const [showOlder, setShowOlder] = useState(false)
  return (
    <div style={{ background: 'var(--stage-2)', borderRadius: '20px', padding: 'clamp(22px, 4vw, 30px)', borderLeft: '3px solid var(--terracotta)' }}>
      <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
        Pause and say · Say it like you mean it
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.6vw, 1.35rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, fontStyle: 'italic', margin: 0 }}>
        &ldquo;{card.prompt}&rdquo;
      </p>
      {card.older_variant && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setShowOlder(o => !o)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            {showOlder ? '▾ For ages 6 to 7' : '▸ For ages 6 to 7, add this'}
          </button>
          {showOlder && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6, margin: '10px 0 0' }}>
              &ldquo;{card.older_variant}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// What would DiGi do: pick together, the reaction teaches either way.
function QuizCard({ card, onAnswered }: { card: ParentLessonCard; onAnswered: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const options = card.options ?? []

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    onAnswered(options[i].correct)
  }

  return (
    <div>
      <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
        What would DiGi do?
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.8vw, 1.4rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: '20px' }}>
        {card.prompt}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => {
          const isPicked = picked === i
          const revealed = picked !== null
          const border = isPicked
            ? opt.correct ? '2px solid var(--terracotta)' : '2px solid var(--stage-3-bold)'
            : revealed && opt.correct ? '2px solid var(--terracotta)' : '1.5px solid var(--border)'
          const bg = isPicked
            ? opt.correct ? 'var(--terracotta-lt)' : 'var(--stage-3)'
            : '#fff'
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                textAlign: 'left', background: bg, border, borderRadius: '16px',
                padding: '14px 16px', cursor: revealed ? 'default' : 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '14.5px', fontWeight: 600,
                color: 'var(--ink)', lineHeight: 1.5, transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {opt.text}
              {isPicked && (
                <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  {opt.correct ? '✓ ' : ''}{opt.reaction}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// PASSPORT VISUAL: design session. The data layer is complete; this
// celebration is deliberately the simplest honest version (DiGi, the
// stars burst, the stage name). A design session restyles it into the
// animal guide stamp and the passport wall moment.
function PassportCelebration({
  stageName,
  childName,
  backHref,
  kidMode,
}: {
  stageName: string
  childName: string | null
  backHref: string
  kidMode: boolean
}) {
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!badgeRef.current) return
    const tl = gsap.timeline()
    tl.fromTo(badgeRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' })
    return () => { tl.kill() }
  }, [])

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '32px 0' }}>
      <Celebration />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <DigiCharacter mood="happy" size={120} />
      </div>
      <div ref={badgeRef} style={{
        display: 'inline-block', background: 'var(--terracotta-lt)', border: '2px solid var(--terracotta)',
        borderRadius: '100px', padding: '10px 24px', marginBottom: '14px',
        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
      }}>
        ⭐ Stage passport earned
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
        {stageName} stage complete!
      </h2>
      <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 24px' }}>
        {kidMode
          ? 'Every single lesson, done. That is a whole stage of the journey in your pocket. DiGi is SO proud of you!'
          : `Every lesson in the ${stageName} stage is complete${childName ? ` for ${childName}` : ''}. The passport is theirs for keeps, and the next stage will be ready when they are.`}
      </p>
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
        <Link href={backHref} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '14px', width: '100%' }}>
          {kidMode ? 'Back to my quests' : 'Back to lessons'}
        </Link>
      </div>
    </div>
  )
}

export default function ParentLessonPlayer({
  lesson,
  segments,
  cards,
  stageName,
  backHref,
  childName = null,
  childId,
  token,
  kidMode = false,
  timesCompleted = 0,
}: {
  lesson: Pick<ParentLesson, 'lesson_code' | 'title' | 'catchphrase' | 'keyword'>
  segments: ParentLessonSegment[]
  cards: ParentLessonCard[]
  stageName: string
  backHref: string
  childName?: string | null
  // Exactly one of these: the parent dashboard passes the child id and
  // the session authorises; the kid link passes its token.
  childId?: string
  token?: string
  kidMode?: boolean
  timesCompleted?: number
}) {
  // The beat sheet: A, the ask, B, the say, C, then the quiz cards.
  // Cards slot by position (1 after A, 2 after B, 3 and up after C),
  // and a lesson with no quiz simply ends when segment C does.
  const steps = useMemo<Step[]>(() => {
    const bySegment = new Map(segments.map(s => [s.segment, s]))
    const a = bySegment.get('A')
    const b = bySegment.get('B')
    const c = bySegment.get('C')
    const full = bySegment.get('full')
    const built: Step[] = []
    if (a && b && c) {
      built.push({ kind: 'video', segment: a, label: 'Part one' })
      for (const card of cards.filter(cd => cd.position === 1)) built.push({ kind: 'card', card })
      built.push({ kind: 'video', segment: b, label: 'Part two' })
      for (const card of cards.filter(cd => cd.position === 2)) built.push({ kind: 'card', card })
      built.push({ kind: 'video', segment: c, label: 'Part three' })
    } else if (full) {
      // Segments missing: play the linear video, keep the cards after it.
      built.push({ kind: 'video', segment: full, label: 'The lesson' })
      for (const card of cards.filter(cd => cd.position <= 2)) built.push({ kind: 'card', card })
    }
    for (const card of cards.filter(cd => cd.position >= 3)) built.push({ kind: 'card', card })
    return built
  }, [segments, cards])

  const isRedo = timesCompleted > 0
  const [index, setIndex] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('idle')
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<CompleteResult | null>(null)
  const quizResultsRef = useRef<Record<number, boolean>>({})
  const slideRef = useRef<HTMLDivElement>(null)

  const step = steps[index]
  const isQuiz = step?.kind === 'card' && step.card.card_type === 'quiz'
  const isVideo = step?.kind === 'video'
  const isLast = index === steps.length - 1
  // First watch earns its Continue by reaching the end of the segment;
  // a redo is a rewatch on the family's terms, so it never gates.
  const canContinue = isQuiz ? answered : isVideo ? (videoEnded || isRedo) : true

  useEffect(() => {
    if (!slideRef.current) return
    gsap.fromTo(slideRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
  }, [index, finished])

  useEffect(() => {
    if (isQuiz && !answered) setDigiMood('thinking')
    else if (!finished) setDigiMood('idle')
  }, [index, isQuiz, answered, finished])

  const onAnswered = (correct: boolean) => {
    setAnswered(true)
    quizResultsRef.current[index] = correct
    setDigiMood(correct ? 'happy' : 'speak')
  }

  const advance = async () => {
    if (isLast) {
      setFinished(true)
      setDigiMood('happy')
      const quizResults = Object.values(quizResultsRef.current)
      try {
        const res = await fetch('/api/parent-lessons/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_code: lesson.lesson_code,
            ...(quizResults.length > 0 ? { quiz_right_first_try: quizResults.every(Boolean) } : {}),
            ...(token ? { token } : { child_id: childId }),
          }),
        })
        if (res.ok) setResult(await res.json() as CompleteResult)
      } catch { /* the finish screen still lands; stars catch up next time */ }
      return
    }
    setAnswered(false)
    setVideoEnded(false)
    setIndex(i => i + 1)
  }

  const runAgain = () => {
    quizResultsRef.current = {}
    setAnswered(false)
    setVideoEnded(false)
    setFinished(false)
    setResult(null)
    setIndex(0)
    setDigiMood('idle')
  }

  if (finished && result?.passport_awarded) {
    return (
      <PassportCelebration
        stageName={stageName}
        childName={childName}
        backHref={backHref}
        kidMode={kidMode}
      />
    )
  }

  if (finished) {
    const stars = result?.stars ?? (isRedo ? REDO_STARS : FIRST_COMPLETION_STARS)
    return (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <DigiCharacter mood="happy" size={110} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          {kidMode ? 'You did it! 🎉' : 'Lesson complete'}
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '10px' }}>
          &ldquo;{lesson.catchphrase}&rdquo;
        </p>
        <div style={{
          display: 'inline-block', background: 'var(--terracotta-lt)',
          border: '2px solid var(--terracotta)', borderRadius: '100px',
          padding: '10px 22px', margin: '4px 0 12px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)',
        }}>
          ⭐ {stars} star{stars === 1 ? '' : 's'} {kidMode ? 'in your bank!' : 'earned'}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 20px' }}>
          {kidMode
            ? 'Watching again with your grown up earns more stars any time you like.'
            : 'Complete lessons stay open. Rewatching together is the whole point, and every redo earns a couple more stars.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <button onClick={runAgain} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
            Watch it again ↻
          </button>
          <Link href={backHref} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '14px' }}>
            {kidMode ? 'Back to my quests' : 'Back to lessons'}
          </Link>
        </div>
      </div>
    )
  }

  if (steps.length === 0) {
    return (
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
        This lesson&rsquo;s video is still on its way. Check back soon.
      </div>
    )
  }

  return (
    <div>
      {/* Segmented progress bar, one segment per beat */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '7px', borderRadius: '100px',
            background: i <= index ? 'var(--terracotta)' : 'var(--border)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      {/* DiGi reacting */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', minHeight: '48px' }}>
        <DigiCharacter mood={digiMood} size={44} />
      </div>

      {/* The beat */}
      <div ref={slideRef} style={{ minHeight: '260px', marginBottom: '20px' }}>
        {step.kind === 'video' ? (
          <div key={index}>
            <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
              {step.label} · Watch together
            </div>
            <video
              src={step.segment.video_url}
              controls
              playsInline
              onEnded={() => setVideoEnded(true)}
              style={{ width: '100%', borderRadius: '20px', background: 'var(--ink)', display: 'block' }}
            />
            {!videoEnded && !isRedo && (
              <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '10px', textAlign: 'center' }}>
                The continue button wakes up when this part finishes.
              </p>
            )}
          </div>
        ) : step.card.card_type === 'ask' ? (
          <AskCard key={index} card={step.card} />
        ) : step.card.card_type === 'say' ? (
          <SayCard key={index} card={step.card} />
        ) : (
          <QuizCard key={index} card={step.card} onAnswered={onAnswered} />
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {index > 0 && (
          <button
            onClick={() => { setAnswered(true); setVideoEnded(true); setIndex(i => i - 1) }}
            className="btn btn-outline"
            style={{ fontSize: '13px', padding: '13px 18px', flexShrink: 0 }}
          >
            Back
          </button>
        )}
        <button
          onClick={advance}
          disabled={!canContinue}
          className="btn btn-gold"
          style={{ flex: 1, justifyContent: 'center', fontSize: '14px', padding: '14px 20px', opacity: canContinue ? 1 : 0.45 }}
        >
          {isLast ? 'Finish lesson' : isQuiz && !answered ? 'Pick an answer to continue' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
