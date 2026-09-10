'use client'

// THE ASSESSMENT, SECTION BY SECTION, SAVE AND RETURN.
//
// Nobody finishes a procurement review in one sitting, so every keystroke is
// saved and the rail shows what is left. A section is never blocked on the one
// before it: a DSL and an IT lead often fill different halves of the same
// review, and forcing them through in order would mean one of them waiting.
//
// The questions come from @gc/shared/ai-governance, which is pure and tested.
// This file is the interface to it and holds no judgement of its own.

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { SECTIONS, BY_SECTION, QUESTIONS } from '@gc/shared/ai-governance/questions'
import { assess, isPupilFacing } from '@gc/shared/ai-governance/rating'
import { BrowserReviewStore } from '@gc/shared/ai-governance/storage'
import type { Review as ReviewRecord, AnswerValue, Facing } from '@gc/shared/ai-governance/types'
import { panel, eyebrow, btnGold, btnQuiet, input, label as labelStyle } from '@/components/ui'
import Result from './Result'

const store = new BrowserReviewStore()
const KEY_STAGES = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5']

type Step = 'about' | typeof SECTIONS[number]['key'] | 'result'

const ANSWERS: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Could not find out' },
  { value: 'na', label: 'Not applicable' },
]

export default function Review({ id }: { id: string }) {
  const [review, setReview] = useState<ReviewRecord | null>(null)
  const [missing, setMissing] = useState(false)
  const [step, setStep] = useState<Step>('about')
  // Set once a write is refused and never cleared on its own. A DSL who has
  // lost a save needs to see that until they have done something about it,
  // not until the next keystroke happens to succeed.
  const [saveFailed, setSaveFailed] = useState('')

  useEffect(() => {
    store.get(id).then(r => { if (r) setReview(r); else setMissing(true) })
  }, [id])

  const update = useCallback((patch: Partial<ReviewRecord>) => {
    setReview(prev => {
      if (!prev) return prev
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() }
      store.save(next).catch((e: unknown) => setSaveFailed(e instanceof Error ? e.message : 'That did not save.'))
      return next
    })
  }, [])

  const answer = useCallback((questionId: string, patch: Partial<{ value: AnswerValue; text: string; evidence: string; note: string }>) => {
    setReview(prev => {
      if (!prev) return prev
      const next = {
        ...prev,
        answers: { ...prev.answers, [questionId]: { ...prev.answers[questionId], ...patch } },
        updatedAt: new Date().toISOString(),
      }
      store.save(next).catch((e: unknown) => setSaveFailed(e instanceof Error ? e.message : 'That did not save.'))
      return next
    })
  }, [])

  const result = useMemo(() => review ? assess(review, QUESTIONS) : null, [review])
  const pupilFacing = review ? isPupilFacing(review) : true

  // The steps a school actually has to do. The relationship section disappears
  // entirely for a staff tool rather than sitting there empty.
  const steps: { key: Step; title: string }[] = useMemo(() => [
    { key: 'about' as Step, title: 'About the tool' },
    ...SECTIONS
      .filter(s => BY_SECTION(s.key, pupilFacing).length > 0)
      .map(s => ({ key: s.key as Step, title: s.title })),
    { key: 'result' as Step, title: 'Result' },
  ], [pupilFacing])

  // On a phone the rail is one scrolling row, so moving section can leave the
  // chip you are on off screen with nothing to say so. This nudges it back into
  // view, and does nothing at all on a width where the rail has wrapped and
  // there is no overflow to scroll.
  const rail = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = rail.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const chip = el.querySelector<HTMLElement>('[data-on="true"]')
    if (!chip) return
    el.scrollTo({ left: chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
  }, [step, steps])

  if (missing) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', ...panel, textAlign: 'center' }}>
          <strong style={{ ...labelStyle, fontSize: '17px' }}>That review is not on this device.</strong>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 16px' }}>
            Reviews are kept on the machine they were made on. If a colleague started it, ask them to
            export it and import the file here.
          </p>
          <Link href="/hub/ai-governance" style={{ ...btnQuiet, textDecoration: 'none' }}>Back to AI governance</Link>
        </div>
      </main>
    )
  }

  if (!review || !result) return null

  const pct = Math.round((result.progress.answered / Math.max(1, result.progress.total)) * 100)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '28px 20px 80px' }}>
      <style>{`
        .gc-gov-rail { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        @media (max-width: 760px) {
          .gc-gov-rail {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 10px;
            scrollbar-width: none;
            /* Bleed to the edges so the row reads as continuing past the
               screen rather than stopping at a margin. */
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .gc-gov-rail::-webkit-scrollbar { display: none; }
        }
        @media print { .gc-gov-rail { display: none; } }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <Link href="/hub/ai-governance" style={{ ...eyebrow, textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>
          ← All AI tools
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
          color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 6px',
        }}>
          {review.product || 'New AI tool review'}
        </h1>

        {/* Progress, stated as a fraction rather than a percentage bar alone,
            because "31 of 85" tells a school how much of an afternoon is left. */}
        <div style={{ ...eyebrow, marginBottom: '8px' }}>
          {result.progress.answered} of {result.progress.total} answered
        </div>
        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden', marginBottom: '22px' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold)', borderRadius: '100px', transition: 'width 0.3s' }} />
        </div>

        {saveFailed && (
          <div style={{
            ...panel, background: 'var(--stage-3)', borderColor: 'var(--stage-3-text)',
            marginBottom: '18px', padding: '14px 16px',
          }}>
            <strong style={{ ...labelStyle, color: 'var(--stage-3-text)' }}>{saveFailed}</strong>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '6px 0 0' }}>
              Carry on if you like, but nothing since will be here tomorrow. The usual cause is a device
              that has run out of room for site storage. Print this record from the result page to keep
              what you have.
            </p>
          </div>
        )}

        {/* The rail, in two shapes. On a laptop it wraps, so a school sees the
            whole shape of the job in two rows. On a phone twelve labels wrapped
            would be the entire first screen every time you moved section, so it
            becomes one scrolling row instead and the effect above keeps the chip
            you are on inside it. */}
        <nav ref={rail} className="gc-gov-rail" aria-label="Sections of this review">
          {steps.map(s => {
            const on = s.key === step
            return (
              <button
                key={s.key}
                data-on={on}
                aria-current={on ? 'step' : undefined}
                onClick={() => setStep(s.key)}
                style={{
                  ...btnQuiet, whiteSpace: 'nowrap', fontSize: '14px', padding: '8px 14px',
                  background: on ? 'var(--ink)' : '#fff', color: on ? '#fff' : 'var(--ink)',
                  borderColor: on ? 'var(--ink)' : 'var(--border)',
                }}
              >
                {s.title}
              </button>
            )
          })}
        </nav>

        {step === 'about' && (
          <div style={{ ...panel, display: 'grid', gap: '16px' }}>
            <Field label="Product name" value={review.product} onChange={v => update({ product: v })} />
            <Field label="Provider" value={review.provider} onChange={v => update({ provider: v })} />
            <Field label="Web address" value={review.url} onChange={v => update({ url: v })} />
            <Field label="Who is responsible for it here" value={review.owner} onChange={v => update({ owner: v })} />
            <Field label="What is it for" value={review.purpose} onChange={v => update({ purpose: v })} multiline />

            <div>
              <div style={labelStyle}>Who will use it</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {([['pupil', 'Pupils'], ['teacher', 'Staff'], ['admin', 'Administration']] as [Facing, string][]).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => update({ facing: v })}
                    style={{
                      ...btnQuiet, fontSize: '14.5px',
                      background: review.facing === v ? 'var(--ink)' : '#fff',
                      color: review.facing === v ? '#fff' : 'var(--ink)',
                      borderColor: review.facing === v ? 'var(--ink)' : 'var(--border)',
                    }}
                  >{l}</button>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', margin: '8px 0 0', lineHeight: 1.55 }}>
                A staff tool skips the questions that only make sense for children, so this changes how much
                there is to answer.
              </p>
            </div>

            <div>
              <div style={labelStyle}>Year groups</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {KEY_STAGES.map(ks => {
                  const on = review.yearGroups.includes(ks)
                  return (
                    <button
                      key={ks}
                      onClick={() => update({ yearGroups: on ? review.yearGroups.filter(x => x !== ks) : [...review.yearGroups, ks] })}
                      style={{
                        ...btnQuiet, fontSize: '14px', padding: '8px 14px',
                        background: on ? 'var(--ink)' : '#fff', color: on ? '#fff' : 'var(--ink)',
                        borderColor: on ? 'var(--ink)' : 'var(--border)',
                      }}
                    >{ks}</button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {step !== 'about' && step !== 'result' && (
          <SectionQuestions
            sectionKey={step}
            pupilFacing={pupilFacing}
            review={review}
            onAnswer={answer}
          />
        )}

        {step === 'result' && <Result review={review} onUpdate={update} />}

        {/* Move on, without ever implying the section is finished. */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          {steps.findIndex(s => s.key === step) > 0 && (
            <button
              onClick={() => setStep(steps[steps.findIndex(s => s.key === step) - 1].key)}
              style={btnQuiet}
            >Back</button>
          )}
          {steps.findIndex(s => s.key === step) < steps.length - 1 && (
            <button
              onClick={() => setStep(steps[steps.findIndex(s => s.key === step) + 1].key)}
              style={btnGold}
            >Next</button>
          )}
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, multiline }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean
}) {
  return (
    <label style={{ display: 'block' }}>
      <div style={labelStyle}>{label}</div>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          style={{ ...input, marginTop: '6px', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} style={{ ...input, marginTop: '6px' }} />
      )}
    </label>
  )
}

function SectionQuestions({ sectionKey, pupilFacing, review, onAnswer }: {
  sectionKey: string
  pupilFacing: boolean
  review: ReviewRecord
  onAnswer: (id: string, patch: Partial<{ value: AnswerValue; text: string; evidence: string; note: string }>) => void
}) {
  const section = SECTIONS.find(s => s.key === sectionKey)
  const questions = BY_SECTION(sectionKey as typeof SECTIONS[number]['key'], pupilFacing)
  if (!section) return null

  return (
    <div>
      <div style={{ ...panel, marginBottom: '14px' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)' }}>{section.title}</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '6px 0 0' }}>
          {section.blurb}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {questions.map(q => {
          const a = review.answers[q.id] ?? {}
          return (
            <div key={q.id} style={panel}>
              <div style={{ ...labelStyle, fontSize: '16.5px', lineHeight: 1.45 }}>{q.prompt}</div>

              {q.guidance && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '6px 0 0' }}>
                  {q.guidance}
                </p>
              )}

              {q.kind === 'yesno' ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {ANSWERS.map(opt => {
                    const on = a.value === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onAnswer(q.id, { value: on ? undefined : opt.value })}
                        style={{
                          ...btnQuiet, fontSize: '14.5px',
                          background: on ? 'var(--ink)' : '#fff',
                          color: on ? '#fff' : 'var(--ink)',
                          borderColor: on ? 'var(--ink)' : 'var(--border)',
                        }}
                      >{opt.label}</button>
                    )
                  })}
                </div>
              ) : (
                <textarea
                  value={a.text ?? ''}
                  onChange={e => onAnswer(q.id, { text: e.target.value })}
                  rows={2}
                  style={{ ...input, marginTop: '10px', resize: 'vertical', fontFamily: 'var(--font-body)' }}
                />
              )}

              {q.evidence && (
                <label style={{ display: 'block', marginTop: '10px' }}>
                  <div style={{ ...eyebrow }}>Where you confirmed this</div>
                  <input
                    value={a.evidence ?? ''}
                    onChange={e => onAnswer(q.id, { evidence: e.target.value })}
                    placeholder="A link, a page of the agreement, an email"
                    style={{ ...input, marginTop: '5px', fontSize: '15px' }}
                  />
                </label>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
