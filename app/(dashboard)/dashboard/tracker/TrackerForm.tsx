'use client'
import { useState } from 'react'
import Link from 'next/link'

const QUESTIONS = [
  { id: 'mood', label: 'How has your child\'s mood been this week?', low: 'Really difficult', high: 'Noticeably settled' },
  { id: 'sleep', label: 'How has their sleep been?', low: 'Disrupted', high: 'Good and consistent' },
  { id: 'social', label: 'How are their friendships and social life?', low: 'Withdrawn', high: 'Engaged and connected' },
  { id: 'screen_mood', label: 'How does their mood seem after screen time?', low: 'Worse', high: 'Neutral or better' },
  { id: 'communication', label: 'How open are they being with you?', low: 'Closed off', high: 'Talking freely' },
]

const FIELD_TO_QUESTION: Record<string, string> = {
  mood_score: 'mood',
  sleep_score: 'sleep',
  social_score: 'social',
  screen_mood_score: 'screen_mood',
  open_communication: 'communication',
}

const CONCERN_COLOR: Record<string, string> = {
  none: 'var(--terracotta)',
  low: 'var(--stage-2-bold)',
  medium: 'var(--stage-5-bold)',
  high: 'var(--danger)',
}

export type WellbeingCheck = {
  week_start: string
  mood_score: number | null
  sleep_score: number | null
  social_score: number | null
  screen_mood_score: number | null
  open_communication: number | null
  concern_level: string
  notes: string | null
}

type Scores = Record<string, number>

function checkToScores(check: WellbeingCheck | null): Scores {
  if (!check) return {}
  const scores: Scores = {}
  for (const [field, qid] of Object.entries(FIELD_TO_QUESTION)) {
    const value = check[field as keyof WellbeingCheck]
    if (typeof value === 'number') scores[qid] = value
  }
  return scores
}

export default function TrackerForm({
  history,
  currentWeekCheck,
  streakWeeks,
  actionsThisWeek,
}: {
  history: WellbeingCheck[]
  currentWeekCheck: WellbeingCheck | null
  streakWeeks: number
  actionsThisWeek: number
}) {
  const [scores, setScores] = useState<Scores>(() => checkToScores(currentWeekCheck))
  const [notes, setNotes] = useState(currentWeekCheck?.notes && !currentWeekCheck.notes.startsWith('Quick check-in') ? currentWeekCheck.notes : '')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const allAnswered = QUESTIONS.every(q => scores[q.id] !== undefined)
  const avgScore = allAnswered
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / QUESTIONS.length * 10) / 10
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allAnswered) return
    setLoading(true)
    try {
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores, notes }),
      })
      setSubmitted(true)
    } catch {
      // Graceful failure — tracker data is non-critical
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Check-in saved</h2>
        <p style={{ color: 'var(--ink)', marginBottom: '24px', fontSize: '15px' }}>
          {avgScore && avgScore >= 4
            ? 'Scores are looking solid this week. Keep the rhythm going.'
            : avgScore && avgScore <= 2
            ? 'Some difficult scores this week. Ask DiGi about what you are seeing.'
            : 'A mixed week. The tracker will show patterns over time.'}
        </p>
        {avgScore && avgScore <= 2.5 && (
          <Link href="/dashboard/digi" className="btn btn-gold" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            Ask DiGi about this week
          </Link>
        )}
        <div style={{ display: 'block' }}>
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', textDecoration: 'none' }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Weekly check-in</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>Wellbeing tracker</h1>
        <p style={{ color: 'var(--ink)', fontSize: '15px' }}>
          Five minutes, once a week. Over time this becomes the most useful thing in your dashboard.
        </p>
      </div>

      {/* Daily streak, ties completed cards back to this page */}
      {streakWeeks > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '14px 18px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>🔥</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              {streakWeeks} week streak, {actionsThisWeek} actions done this week
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
              From your daily practice cards. Keep it going and it shows up here.
            </div>
          </div>
        </div>
      )}

      {/* Recent weeks trend */}
      {history.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Your recent weeks
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
            {[...history].reverse().map(check => (
              <div key={check.week_start} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%', height: '28px', borderRadius: '6px',
                  background: CONCERN_COLOR[check.concern_level] ?? 'var(--border)',
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--ink-muted)' }}>
                  {new Date(check.week_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentWeekCheck && (
        <div style={{ background: 'var(--stage-2)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink)' }}>
          You already checked in this week. Answers below are pre filled, update and save to change them.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {QUESTIONS.map(q => (
          <div key={q.id}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: 'var(--ink)', marginBottom: '14px', lineHeight: 1.4 }}>
              {q.label}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScores(s => ({ ...s, [q.id]: n }))}
                  style={{
                    flex: 1,
                    padding: '14px 4px',
                    borderRadius: '12px',
                    border: `2px solid ${scores[q.id] === n ? 'var(--terracotta)' : 'var(--border)'}`,
                    background: scores[q.id] === n ? 'var(--stage-2)' : 'var(--cream)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: scores[q.id] === n ? 'var(--terracotta)' : 'var(--ink-light)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: scores[q.id] === n ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)' }}>{q.low}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)' }}>{q.high}</span>
            </div>
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anything specific that happened this week..."
            rows={3}
            className="input"
            style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '15px' }}
          />
        </div>

        <button
          type="submit"
          disabled={!allAnswered || loading}
          className="btn btn-gold"
          style={{ opacity: allAnswered ? 1 : 0.5 }}
        >
          {loading ? 'Saving...' : currentWeekCheck ? 'Update this week\'s check-in' : 'Save this week\'s check-in'}
        </button>
      </form>
    </div>
  )
}
