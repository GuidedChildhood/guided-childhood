'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export type CheckinLesson = {
  id: string
  audience: string
  category: string
  title: string
  key_message: string
}

const QUESTIONS = [
  {
    key: 'ai_usage',
    text: 'How often does your child use AI tools?',
    hint: 'Things like ChatGPT, voice assistants, or AI features in school apps.',
    options: [
      { value: 'never', label: 'Not that I know of' },
      { value: 'sometimes', label: 'Occasionally' },
      { value: 'often', label: 'A few times a week' },
      { value: 'daily', label: 'Every day' },
    ],
  },
  {
    key: 'confidence',
    text: 'How confident are you talking about AI with your child?',
    hint: 'No wrong answer here.',
    options: [
      { value: 'low', label: 'Not confident at all' },
      { value: 'medium', label: 'Fairly unsure' },
      { value: 'high', label: 'Pretty confident' },
    ],
  },
  {
    key: 'conversations',
    text: 'Have you talked with your child about how AI works?',
    hint: '',
    options: [
      { value: 'never', label: 'Not yet' },
      { value: 'once', label: 'Once or twice' },
      { value: 'regularly', label: 'Yes, we talk about it' },
    ],
  },
]

type RecResult = { audience: string; category: string; headline: string; forChild: boolean }

function getRec(answers: Record<string, string>, ageBand: string): RecResult {
  const heavy = answers.ai_usage === 'often' || answers.ai_usage === 'daily'
  const low = answers.confidence === 'low' || answers.confidence === 'medium'

  if (low) {
    return {
      audience: 'parent',
      category: 'llms_chatbots',
      headline: 'Most parents feel the same way. This lesson gives you the plain language to talk about AI with your child.',
      forChild: false,
    }
  }
  if (heavy) {
    const aud = ageBand === '11-13' ? 'age_11' : ageBand === '13-15' ? 'age_13' : 'age_16'
    return {
      audience: aud,
      category: 'ai_at_school',
      headline: 'Your child is already using AI. This lesson helps them use it well and honestly.',
      forChild: true,
    }
  }
  return {
    audience: 'parent',
    category: 'what_is_ai',
    headline: 'A good place to start. This lesson sets the frame for every AI conversation that follows.',
    forChild: false,
  }
}

export default function AiCheckinCard({ ageBand, lessons, savedAnswers }: {
  ageBand: string
  lessons: CheckinLesson[]
  savedAnswers: Record<string, string> | null
}) {
  const alreadyDone = !!savedAnswers && Object.keys(savedAnswers).length >= 3
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers ?? {})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(alreadyDone)

  const allAnswered = QUESTIONS.every(q => answers[q.key])

  async function handleSubmit() {
    if (!allAnswered) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    await supabase
      .from('ai_literacy_checkins')
      .upsert({ user_id: user.id, answers }, { onConflict: 'user_id' })
    setSaving(false)
    setDone(true)
  }

  // Teaser state
  if (!open && !done) {
    return (
      <div style={{
        background: 'var(--stage-2)',
        border: '1.5px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--terracotta)', marginBottom: '6px',
          }}>
            AI Readiness Check
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '4px' }}>
            Where does your family stand with AI?
          </p>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>
            Three questions. We will point you to the right lesson.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-gold"
          style={{ flexShrink: 0, padding: '11px 20px', fontSize: '12px' }}
        >
          Start
        </button>
      </div>
    )
  }

  // Done — show recommendation
  if (done) {
    const rec = getRec(answers, ageBand)
    const lesson = lessons.find(l => l.audience === rec.audience && l.category === rec.category)
    return (
      <div style={{
        background: 'var(--cream)',
        border: '1.5px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--terracotta)', marginBottom: '8px',
        }}>
          Your recommendation
        </p>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px', lineHeight: 1.55 }}>
          {rec.headline}
        </p>
        {lesson && (
          <Link
            href={`/dashboard/ai-module/${lesson.id}`}
            style={{
              display: 'block',
              background: '#fff',
              border: '1.5px solid var(--terracotta)',
              borderRadius: '14px',
              padding: '16px',
              textDecoration: 'none',
              marginBottom: '12px',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--terracotta)', marginBottom: '6px',
            }}>
              {rec.forChild ? 'For your child' : 'For you'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '4px' }}>
              {lesson.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              {lesson.key_message}
            </div>
          </Link>
        )}
        <button
          onClick={() => { setDone(false); setOpen(true); setAnswers({}) }}
          style={{
            background: 'none', border: 'none', color: '#9ca3af',
            fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer',
            padding: '8px 0', letterSpacing: '0.06em', display: 'block',
          }}
        >
          Redo the check
        </button>
      </div>
    )
  }

  // Question form
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '28px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--terracotta)', marginBottom: '4px',
      }}>
        AI Readiness Check
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '20px' }}>
        Three quick questions.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
        {QUESTIONS.map(q => (
          <div key={q.key}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: q.hint ? '4px' : '10px', lineHeight: 1.3 }}>
              {q.text}
            </p>
            {q.hint && (
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px', marginTop: 0 }}>{q.hint}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {q.options.map(opt => {
                const selected = answers[q.key] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers(a => ({ ...a, [q.key]: opt.value }))}
                    style={{
                      textAlign: 'left',
                      background: selected ? 'var(--terracotta-lt)' : '#f9fafb',
                      border: `1.5px solid ${selected ? 'var(--terracotta)' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: selected ? 600 : 400,
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || saving}
        className="btn btn-gold"
        style={{ width: '100%', opacity: allAnswered ? 1 : 0.5 }}
      >
        {saving ? 'Saving...' : 'See your recommendation'}
      </button>
    </div>
  )
}
