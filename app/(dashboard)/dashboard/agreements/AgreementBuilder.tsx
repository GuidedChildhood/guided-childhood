'use client'
import { useMemo, useState } from 'react'
import type { AgreementTemplate } from '@/lib/content/agreements'

interface SavedAgreement {
  child_agrees: string[]
  parent_agrees: string[]
  when_it_goes_wrong: string | null
  review_date: string | null
}

interface Props {
  childId: string
  childName: string
  template: AgreementTemplate
  saved: SavedAgreement | null
}

function defaultReviewDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 3)
  return d.toISOString().slice(0, 10)
}

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--terracotta)', marginBottom: '12px',
}

function ClauseSection({
  title,
  hint,
  suggestions,
  selected,
  onToggle,
  onAddCustom,
}: {
  title: string
  hint: string
  suggestions: string[]
  selected: string[]
  onToggle: (clause: string) => void
  onAddCustom: (clause: string) => void
}) {
  const [custom, setCustom] = useState('')
  const customClauses = selected.filter(c => !suggestions.includes(c))

  function addCustom() {
    const clause = custom.trim()
    if (!clause) return
    onAddCustom(clause)
    setCustom('')
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={SECTION_LABEL}>{title}</div>
      <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '14px' }}>{hint}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {[...suggestions, ...customClauses].map(clause => {
          const isOn = selected.includes(clause)
          return (
            <button
              key={clause}
              type="button"
              onClick={() => onToggle(clause)}
              style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '14px 16px', textAlign: 'left', width: '100%',
                border: `2px solid ${isOn ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: 14,
                background: isOn ? 'var(--terracotta-lt)' : '#fff',
                cursor: 'pointer',
                transition: 'border-color 0.12s, background 0.12s',
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: isOn ? 'var(--terracotta)' : 'transparent',
                border: isOn ? 'none' : '2px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 800,
              }}>
                {isOn ? '✓' : ''}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55 }}>{clause}</span>
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          className="input"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          placeholder="Write your own clause"
          style={{ flex: 1, fontSize: '14px' }}
        />
        <button type="button" className="btn btn-ink" onClick={addCustom} style={{ padding: '10px 18px', fontSize: '13px', flexShrink: 0 }}>
          Add
        </button>
      </div>
    </div>
  )
}

export default function AgreementBuilder({ childId, childName, template, saved }: Props) {
  const [childAgrees, setChildAgrees] = useState<string[]>(
    saved?.child_agrees?.length ? saved.child_agrees : template.childClauses.slice(0, 4)
  )
  const [parentAgrees, setParentAgrees] = useState<string[]>(
    saved?.parent_agrees?.length ? saved.parent_agrees : template.parentClauses.slice(0, 4)
  )
  const [whenItGoesWrong, setWhenItGoesWrong] = useState(
    saved?.when_it_goes_wrong ?? template.whenItGoesWrong
  )
  const [reviewDate, setReviewDate] = useState(saved?.review_date ?? defaultReviewDate())
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  const canSave = childAgrees.length > 0 && parentAgrees.length > 0

  const toggle = (list: string[], set: (v: string[]) => void) => (clause: string) => {
    set(list.includes(clause) ? list.filter(c => c !== clause) : [...list, clause])
    setStatus('idle')
  }
  const add = (list: string[], set: (v: string[]) => void) => (clause: string) => {
    if (!list.includes(clause)) set([...list, clause])
    setStatus('idle')
  }

  async function save() {
    if (!canSave || saving) return
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId,
          child_agrees: childAgrees,
          parent_agrees: parentAgrees,
          when_it_goes_wrong: whenItGoesWrong,
          review_date: reviewDate,
        }),
      })
      setStatus(res.ok ? 'saved' : 'error')
    } catch {
      setStatus('error')
    }
    setSaving(false)
  }

  const reviewDateHuman = useMemo(() => {
    try {
      return new Date(`${reviewDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return reviewDate
    }
  }, [reviewDate])

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px 48px' }}>

      {/* Builder chrome, hidden when printing */}
      <div className="agreement-builder">
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Family agreement</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '12px' }}>
          The {childName} family agreement
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '10px' }}>
          {template.intro}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.05em', marginBottom: '32px' }}>
          {template.stageLabel}
        </p>

        <ClauseSection
          title={`${childName} agrees`}
          hint="Pick the clauses together and let them argue. A clause they fought for is a clause they will keep."
          suggestions={template.childClauses}
          selected={childAgrees}
          onToggle={toggle(childAgrees, setChildAgrees)}
          onAddCustom={add(childAgrees, setChildAgrees)}
        />

        <ClauseSection
          title="The grown ups agree"
          hint="Your side of the deal. An agreement with promises on only one side is just a list of rules."
          suggestions={template.parentClauses}
          selected={parentAgrees}
          onToggle={toggle(parentAgrees, setParentAgrees)}
          onAddCustom={add(parentAgrees, setParentAgrees)}
        />

        <div style={{ marginBottom: '32px' }}>
          <div style={SECTION_LABEL}>When it goes wrong</div>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
            The repair plan. Consequences that fix things beat punishments that just hurt.
          </p>
          <textarea
            className="input"
            value={whenItGoesWrong}
            onChange={e => { setWhenItGoesWrong(e.target.value); setStatus('idle') }}
            rows={4}
            style={{ width: '100%', fontSize: '14px', lineHeight: 1.6, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '36px' }}>
          <div style={SECTION_LABEL}>Review date</div>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
            Agreements that never get revisited get quietly abandoned. Put the next conversation in the diary now.
          </p>
          <input
            type="date"
            className="input"
            value={reviewDate}
            onChange={e => { setReviewDate(e.target.value); setStatus('idle') }}
            style={{ fontSize: '14px', maxWidth: '220px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-gold"
            onClick={save}
            disabled={!canSave || saving}
            style={{ padding: '15px 28px', fontSize: '14px', opacity: !canSave || saving ? 0.6 : 1 }}
          >
            {saving ? 'Saving...' : 'Save agreement'}
          </button>
          <button
            type="button"
            className="btn btn-ink"
            onClick={() => window.print()}
            style={{ padding: '15px 28px', fontSize: '14px' }}
          >
            Print for the fridge
          </button>
          {status === 'saved' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--terracotta)', letterSpacing: '0.05em' }}>
              Saved ✓
            </span>
          )}
          {status === 'error' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--danger)', letterSpacing: '0.05em' }}>
              Could not save, try again
            </span>
          )}
        </div>
        {!canSave && (
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '12px' }}>
            An agreement needs at least one promise on each side.
          </p>
        )}
      </div>

      {/* Print sheet: hidden on screen, the only thing visible when printing */}
      <div className="agreement-print-sheet" aria-hidden="true">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Our family agreement
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26pt', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            The {childName} family agreement
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', marginTop: '8px' }}>
            {template.stageLabel}
          </div>
        </div>

        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            {childName} agrees
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {childAgrees.map(clause => (
              <li key={clause} style={{ fontSize: '11.5pt', lineHeight: 1.5 }}>{clause}</li>
            ))}
          </ol>
        </div>

        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            The grown ups agree
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {parentAgrees.map(clause => (
              <li key={clause} style={{ fontSize: '11.5pt', lineHeight: 1.5 }}>{clause}</li>
            ))}
          </ol>
        </div>

        {whenItGoesWrong.trim() && (
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              When it goes wrong
            </div>
            <p style={{ fontSize: '11.5pt', lineHeight: 1.55, margin: 0 }}>{whenItGoesWrong}</p>
          </div>
        )}

        <div style={{ marginBottom: '30px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            We review this together on
          </span>
          <span style={{ fontSize: '11.5pt', marginLeft: '8px' }}>{reviewDateHuman}</span>
        </div>

        <div style={{ display: 'flex', gap: '40px', marginTop: '36px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1.5px solid #1A1A2E', height: '36px' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '6px' }}>
              Signed, {childName}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: '1.5px solid #1A1A2E', height: '36px' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '6px' }}>
              Signed, the grown ups
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Guided Childhood · guidedchildhood.co.uk
        </div>
      </div>

      <style>{`
        .agreement-print-sheet { display: none; }
        @media print {
          body * { visibility: hidden; }
          .agreement-print-sheet, .agreement-print-sheet * { visibility: visible; }
          .agreement-print-sheet {
            display: block;
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            padding: 24px;
            color: #1A1A2E;
            background: #fff;
          }
        }
      `}</style>
    </div>
  )
}
