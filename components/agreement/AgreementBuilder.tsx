'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AGREEMENT_PROMPTS, type AgreementSectionDefaults } from '@/lib/content/agreement-defaults'

interface SavedAgreement {
  version: number
  agreed_date: string | null
  review_date: string | null
  family_values: string | null
  bedroom_rule_time: string | null
  bedroom_rule_location: string | null
  social_media_terms: string | null
  when_things_go_wrong: string | null
  extra_agreements: string | null
  signed_by_parent: boolean
  signed_by_child: boolean
}

interface Props {
  childName: string
  stageId: string
  stageLabel: string
  defaults: AgreementSectionDefaults
  saved: SavedAgreement | null
}

function defaultReviewDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 3)
  return d.toISOString().slice(0, 10)
}

const AREA: React.CSSProperties = {
  width: '100%',
  minHeight: '96px',
  padding: '14px 16px',
  background: '#fff',
  border: '1.5px solid var(--border)',
  borderRadius: '14px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  lineHeight: 1.65,
  color: 'var(--ink)',
  resize: 'vertical',
}

function Section({ eyebrow, title, prompt, children }: {
  eyebrow: string
  title: string
  prompt: string
  children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '22px 20px', marginBottom: '16px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{title}</h2>
      <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: '14px' }}>
        {prompt}
      </p>
      {children}
    </div>
  )
}

export default function AgreementBuilder({ childName, stageId, stageLabel, defaults, saved }: Props) {
  const [familyValues, setFamilyValues] = useState(saved?.family_values ?? defaults.familyValues)
  const [bedroomTime, setBedroomTime] = useState(saved?.bedroom_rule_time ?? defaults.bedroomRuleTime)
  const [bedroomLocation, setBedroomLocation] = useState(saved?.bedroom_rule_location ?? defaults.bedroomRuleLocation)
  const [socialMedia, setSocialMedia] = useState(saved?.social_media_terms ?? defaults.socialMediaTerms)
  const [whenWrong, setWhenWrong] = useState(saved?.when_things_go_wrong ?? defaults.whenThingsGoWrong)
  const [extras, setExtras] = useState(saved?.extra_agreements ?? '')
  const [parentSigned, setParentSigned] = useState(saved?.signed_by_parent ?? false)
  const [childSigned, setChildSigned] = useState(saved?.signed_by_child ?? false)
  const [reviewDate, setReviewDate] = useState(saved?.review_date ?? defaultReviewDate())
  const [saving, setSaving] = useState(false)
  const [savedState, setSavedState] = useState<{ version: number; agreedDate: string | null } | null>(
    saved ? { version: saved.version, agreedDate: saved.agreed_date } : null
  )
  const [error, setError] = useState<string | null>(null)

  const bothSigned = parentSigned && childSigned

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage_id: stageId,
          family_values: familyValues,
          bedroom_rule_time: bedroomTime,
          bedroom_rule_location: bedroomLocation,
          social_media_terms: socialMedia,
          when_things_go_wrong: whenWrong,
          extra_agreements: extras,
          signed_by_parent: parentSigned,
          signed_by_child: childSigned,
          review_date: reviewDate,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setSavedState({ version: data.version, agreedDate: data.agreed_date })
    } catch {
      setError('The agreement did not save. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
          <p className="eyebrow" style={{ color: 'var(--terracotta)', margin: 0 }}>Family agreement</p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', background: 'var(--stage-2)', padding: '4px 10px', borderRadius: '100px' }}>
            {stageLabel}
          </span>
          {savedState && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              Version {savedState.version}
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)', marginBottom: '10px' }}>
          Our family agreement
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
          Sit down with {childName}, talk through each section, and change every word until it sounds like your family. An agreement they helped write is an agreement they keep.
        </p>
      </div>

      <Section eyebrow="Section 1" title="What screens are for in our family" prompt={AGREEMENT_PROMPTS.familyValues}>
        <textarea style={AREA} value={familyValues} onChange={e => setFamilyValues(e.target.value)} />
      </Section>

      <Section eyebrow="Section 2" title="The bedroom rule" prompt={AGREEMENT_PROMPTS.bedroomRule}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>When screens stop</div>
            <textarea style={{ ...AREA, minHeight: '64px' }} value={bedroomTime} onChange={e => setBedroomTime(e.target.value)} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Where devices sleep</div>
            <textarea style={{ ...AREA, minHeight: '64px' }} value={bedroomLocation} onChange={e => setBedroomLocation(e.target.value)} />
          </div>
        </div>
      </Section>

      <Section eyebrow="Section 3" title="Social media" prompt={AGREEMENT_PROMPTS.socialMediaTerms}>
        <textarea style={AREA} value={socialMedia} onChange={e => setSocialMedia(e.target.value)} />
      </Section>

      <Section eyebrow="Section 4" title="When things go wrong" prompt={AGREEMENT_PROMPTS.whenThingsGoWrong}>
        <textarea style={AREA} value={whenWrong} onChange={e => setWhenWrong(e.target.value)} />
      </Section>

      <Section eyebrow="Section 5" title="Our extra agreements" prompt={AGREEMENT_PROMPTS.extraAgreements}>
        <textarea style={AREA} value={extras} onChange={e => setExtras(e.target.value)} placeholder="Optional. Write anything else you agreed here." />
      </Section>

      {/* Review date */}
      <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '22px 20px', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
          Review date
        </div>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: '14px' }}>
          An agreement is a living thing. Pick a date about a term from now to sit down and update it together.
        </p>
        <input
          type="date"
          value={reviewDate}
          onChange={e => setReviewDate(e.target.value)}
          style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--ink)', background: '#fff' }}
        />
      </div>

      {/* Signatures */}
      <div style={{ background: 'var(--stage-2)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '22px 20px', marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '14px' }}>
          We agree
        </div>
        {[
          { label: 'Signed by the parent', checked: parentSigned, toggle: () => setParentSigned(v => !v) },
          { label: `Signed by ${childName}`, checked: childSigned, toggle: () => setChildSigned(v => !v) },
        ].map((sig, i) => (
          <button
            key={i}
            type="button"
            onClick={sig.toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              background: '#fff', border: sig.checked ? '2px solid var(--terracotta)' : '1.5px solid var(--border)',
              borderRadius: '14px', padding: '14px 16px', marginBottom: '10px',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{
              width: '22px', height: '22px', borderRadius: '7px', flexShrink: 0,
              background: sig.checked ? 'var(--terracotta)' : '#fff',
              border: sig.checked ? 'none' : '1.5px solid var(--border)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '13px', fontWeight: 700,
            }}>
              {sig.checked ? '✓' : ''}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{sig.label}</span>
          </button>
        ))}
        {bothSigned && (
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '4px 0 0', lineHeight: 1.5 }}>
            Signed by both of you. Save it, print it, and put it where everyone can see it.
          </p>
        )}
      </div>

      {error && (
        <p style={{ fontSize: '13px', color: 'var(--coral-dark, #C0392B)', marginBottom: '14px' }}>{error}</p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="btn btn-gold"
        style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '16px', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Saving...' : 'Save our agreement'}
      </button>

      {savedState && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/dashboard/agreement/print" className="btn btn-ink" style={{ display: 'inline-flex', padding: '12px 24px', fontSize: '13px' }}>
            Print the fridge copy
          </Link>
        </div>
      )}
    </div>
  )
}
