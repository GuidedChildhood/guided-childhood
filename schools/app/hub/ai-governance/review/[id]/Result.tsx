'use client'

// THE RESULT, AND THE JOIN THAT MAKES THIS MORE THAN A CHECKLIST.
//
// Eight ratings, worst first. Then the five readiness questions. Then the part
// that matters most: every finding that is genuinely a child's to learn becomes
// a competency and a lesson that already exists and can be taught next week.
//
// Two things this page will not do.
//
//   It will not call a product unsafe. It reports what the school answered and
//   what follows from it, and the school makes the decision. "Do not deploy yet"
//   is a suggestion with its reasons attached, and the school can record a
//   different decision with its conditions written down.
//
//   It will not turn procurement into a lesson. Processor agreements and
//   retention schedules have no child facing competency and do not appear in
//   the teaching list, exactly as the brief asked.

import { useMemo } from 'react'
import Link from 'next/link'
import { QUESTIONS } from '@gc/shared/ai-governance/questions'
import { assess, priorityOrder, isPupilFacing, CATEGORIES, STATUS_LABEL, RATING_LABEL, classify } from '@gc/shared/ai-governance/rating'
import { raisedLinks } from '@gc/shared/ai-governance/passport-links'
import { policyClauses, parentLetter } from '@gc/shared/ai-governance/policy'
import { defaultNextReview } from '@gc/shared/ai-governance/storage'
import type { Review as ReviewRecord, OverallStatus } from '@gc/shared/ai-governance/types'
import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { panel, eyebrow, btnGold, btnQuiet, input, label as labelStyle } from '@/components/ui'
import { chip, STATUS_RATING } from '../../ratings'

const STATUSES: OverallStatus[] = ['approve', 'approve-with-conditions', 'review-required', 'do-not-deploy-yet']
const moduleTitle = (id: string) => CURRICULUM.find(m => m.moduleId === id)?.title ?? id

export default function Result({ review, onUpdate }: {
  review: ReviewRecord
  onUpdate: (patch: Partial<ReviewRecord>) => void
}) {
  const result = useMemo(() => assess(review, QUESTIONS), [review])
  const ordered = useMemo(() => priorityOrder(result.categories), [result])
  const links = useMemo(() => raisedLinks(review.answers), [review.answers])
  const clauses = useMemo(() => policyClauses(review), [review])
  const letter = useMemo(() => parentLetter(review), [review])
  const type = useMemo(() => classify(review), [review])

  const pupilFacing = isPupilFacing(review)
  const teaching = links.filter(l => l.modules.length > 0)
  const gaps = links.filter(l => l.modules.length === 0)

  // The five readiness questions, answered from the record rather than asserted.
  const readiness = [
    {
      q: 'Technology ready?',
      done: result.progress.answered === result.progress.total,
      note: result.progress.answered === result.progress.total
        ? 'Every question in this review has an answer.'
        : `${result.progress.total - result.progress.answered} question${result.progress.total - result.progress.answered === 1 ? '' : 's'} still open.`,
    },
    {
      q: 'Staff ready?',
      done: review.answers['t-staff-told']?.value === 'yes',
      note: review.answers['t-staff-told']?.value === 'yes'
        ? 'Staff know what it can and cannot do.'
        : 'Staff have not yet been told what it can and cannot do.',
    },
    {
      q: 'Pupils ready?',
      done: pupilFacing ? links.length === 0 : true,
      note: !pupilFacing
        ? 'Not a pupil facing tool.'
        : links.length === 0
          ? 'No pupil facing risk was raised by this review.'
          : `${links.length} thing${links.length === 1 ? '' : 's'} to teach before pupils use it. They are listed below.`,
    },
    {
      q: 'Policy ready?',
      done: Boolean(review.decision) && review.answers['t-plain-language']?.value === 'yes',
      note: review.answers['t-plain-language']?.value === 'yes'
        ? 'A plain language explanation exists.'
        : 'There is suggested wording below to put into your policy.',
    },
    {
      q: 'Safeguarding ready?',
      done: !pupilFacing || review.answers['s-escalation']?.value === 'yes',
      note: !pupilFacing
        ? 'Not a pupil facing tool.'
        : review.answers['s-escalation']?.value === 'yes'
          ? 'There is a route from the system to a person.'
          : 'There is no route from the system to a person, so your own escalation route has to cover it and staff need telling.',
    },
  ]

  return (
    <div style={{ display: 'grid', gap: '16px' }}>

      {/* What the answers suggest, and what the school decided. Two different
          things, shown as two different things. */}
      <div style={panel}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)' }}>What the answers suggest</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', margin: '10px 0 4px' }}>
          <span style={chip(STATUS_RATING[result.suggested])}>{STATUS_LABEL[result.suggested]}</span>
          {pupilFacing && (
            <span style={{ ...eyebrow }}>Reads as: {type.suggested}</span>
          )}
        </div>
        {pupilFacing && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '6px 0 0' }}>
            {type.why}
          </p>
        )}
      </div>

      {/* Eight ratings, never one score. */}
      <div style={panel}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>Where it stands, worst first</div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {ordered.map(c => {
            const meta = CATEGORIES.find(x => x.key === c.category)
            return (
              <div key={c.category} style={{
                border: '1px solid var(--border)', borderRadius: '14px', padding: '12px 14px', background: 'var(--warm)',
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong style={{ ...labelStyle, flex: 1, minWidth: '140px' }}>{meta?.title}</strong>
                  <span style={chip(c.rating)}>{RATING_LABEL[c.rating]}</span>
                </div>
                <div style={{ ...eyebrow, marginTop: '6px' }}>{c.answered} of {c.total} answered</div>
                {c.reasons.length > 0 && (
                  <ul style={{ margin: '8px 0 0', paddingLeft: '18px' }}>
                    {c.reasons.slice(0, 4).map((r, i) => (
                      <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                        {r.prompt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* The readiness view. Five questions, and none of them is a score. */}
      <div style={panel}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>Are we ready</div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {readiness.map(r => (
            <div key={r.q} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span aria-hidden style={{ fontSize: '17px', lineHeight: 1.4 }}>{r.done ? '✓' : '·'}</span>
              <div>
                <strong style={labelStyle}>{r.q}</strong>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THE JOIN. */}
      {pupilFacing && (teaching.length > 0 || gaps.length > 0) && (
        <div style={panel}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '6px' }}>Teach this before they use it</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>
            Each of these came out of an answer above. The lessons already exist in your scheme.
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {teaching.map(l => (
              <div key={l.id} style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '13px 15px' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{l.risk}</div>
                <strong style={{ ...labelStyle, fontSize: '16.5px', display: 'block', margin: '6px 0 8px' }}>{l.competency}</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {l.modules.map(m => (
                    <Link key={m} href={`/lesson/${m}`} style={{
                      ...btnQuiet, fontSize: '13.5px', padding: '7px 12px', textDecoration: 'none',
                    }}>{moduleTitle(m)}</Link>
                  ))}
                </div>
              </div>
            ))}

            {gaps.map(l => (
              <div key={l.id} style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '13px 15px', background: 'var(--stage-1)' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{l.risk}</div>
                <strong style={{ ...labelStyle, fontSize: '16.5px', display: 'block', margin: '6px 0 8px' }}>{l.competency}</strong>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--stage-1-text)', lineHeight: 1.55 }}>{l.gap}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policy wording, shown as a suggestion next to what the school has. */}
      <details style={panel}>
        <summary style={{ ...labelStyle, cursor: 'pointer', fontSize: '16.5px' }}>Suggested policy wording</summary>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '10px 0 14px' }}>
          Paste and adapt. This does not replace anything you already have, and nothing here is legal advice.
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          {clauses.map(c => (
            <div key={c.heading} style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '13px 15px' }}>
              <strong style={labelStyle}>{c.heading}</strong>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.65, margin: '6px 0 8px' }}>{c.body}</p>
              <div style={{ ...eyebrow }}>{c.because}</div>
            </div>
          ))}
        </div>
      </details>

      {pupilFacing && (
        <details style={panel}>
          <summary style={{ ...labelStyle, cursor: 'pointer', fontSize: '16.5px' }}>Draft letter to parents</summary>
          <pre style={{
            fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', margin: '12px 0 0',
          }}>{letter}</pre>
        </details>
      )}

      {/* The decision, which belongs to the school. */}
      <div style={panel}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '10px' }}>Your decision</div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {STATUSES.map(s => {
            const on = review.decision === s
            return (
              <button
                key={s}
                onClick={() => onUpdate({
                  decision: on ? null : s,
                  reviewedOn: review.reviewedOn ?? new Date().toISOString().slice(0, 10),
                  nextReviewOn: review.nextReviewOn ?? defaultNextReview(new Date()),
                })}
                style={{
                  ...btnQuiet, fontSize: '14.5px',
                  background: on ? 'var(--ink)' : '#fff', color: on ? '#fff' : 'var(--ink)',
                  borderColor: on ? 'var(--ink)' : 'var(--border)',
                }}
              >{STATUS_LABEL[s]}</button>
            )
          })}
        </div>

        <label style={{ display: 'block', marginBottom: '14px' }}>
          <div style={labelStyle}>Conditions and what has to happen next</div>
          <textarea
            value={review.conditions}
            onChange={e => onUpdate({ conditions: e.target.value })}
            rows={3}
            style={{ ...input, marginTop: '6px', resize: 'vertical', fontFamily: 'var(--font-body)' }}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <label>
            <div style={labelStyle}>Reviewed on</div>
            <input type="date" value={review.reviewedOn ?? ''} onChange={e => onUpdate({ reviewedOn: e.target.value || null })}
              style={{ ...input, marginTop: '6px' }} />
          </label>
          <label>
            <div style={labelStyle}>Review again by</div>
            <input type="date" value={review.nextReviewOn ?? ''} onChange={e => onUpdate({ nextReviewOn: e.target.value || null })}
              style={{ ...input, marginTop: '6px' }} />
          </label>
        </div>

        <div style={{ ...eyebrow, marginBottom: '8px' }}>Seen by</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {([['dpo', 'Data protection lead'], ['dsl', 'Designated safeguarding lead'], ['slt', 'Senior leadership'], ['governors', 'Governors']] as const).map(([k, l]) => (
            <label key={k}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{l}</div>
              <input
                value={review.signOff[k].name ?? ''}
                onChange={e => onUpdate({ signOff: { ...review.signOff, [k]: { ...review.signOff[k], name: e.target.value, date: e.target.value ? (review.signOff[k].date ?? new Date().toISOString().slice(0, 10)) : undefined } } })}
                placeholder="Name"
                style={{ ...input, marginTop: '6px', fontSize: '15px' }}
              />
            </label>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '10px 0 0' }}>
          A typed name and a date, the same as a paper record. This is your school's own note of who saw it,
          not a signature we can verify.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} style={btnGold}>Print this record</button>
      </div>
    </div>
  )
}
