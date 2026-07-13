'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AGREEMENT_TYPES, CLAUSES_BY_TYPE, recommendedType, type Clause } from '@/lib/content/agreement-clauses'

// The agreement wizard: choose the TYPE for where your child is (their
// age is recommended, never forced), tap the clauses to include, pick
// an option inside each, sign together, done. The saved view shows
// exactly where the agreement lives, and the end of week check asks the
// child by text, takes the parent's verdict, and pays the reward
// through the same stars as everything else.

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
  agreement_type?: string | null
  clauses?: Record<string, string> | null
}

interface Props {
  childName: string
  stageId: string
  stageLabel: string
  saved: SavedAgreement | null
  childPhone: string | null
  isPaid: boolean
}

type Step = 'type' | 'clauses' | 'sign' | 'done'

function defaultReviewDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 3)
  return d.toISOString().slice(0, 10)
}

const CUSTOM = '__custom__'

export default function AgreementBuilder({ childName, stageId, stageLabel, saved, childPhone, isPaid }: Props) {
  const recommended = recommendedType(stageId)
  const [step, setStep] = useState<Step>(saved ? 'done' : 'type')
  const [typeKey, setTypeKey] = useState<string>(saved?.agreement_type ?? recommended)
  const [chosen, setChosen] = useState<Record<string, string>>(saved?.clauses ?? {})
  const [customDrafts, setCustomDrafts] = useState<Record<string, string>>({})
  const [parentSigned, setParentSigned] = useState(saved?.signed_by_parent ?? false)
  const [childSigned, setChildSigned] = useState(saved?.signed_by_child ?? false)
  const [reviewDate, setReviewDate] = useState(saved?.review_date ?? defaultReviewDate())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedState, setSavedState] = useState<{ version: number; agreedDate: string | null } | null>(
    saved ? { version: saved.version, agreedDate: saved.agreed_date } : null
  )
  const [weekResult, setWeekResult] = useState<string | null>(null)

  const type = AGREEMENT_TYPES.find(t => t.key === typeKey) ?? AGREEMENT_TYPES[2]
  const clauses = CLAUSES_BY_TYPE[type.key] ?? []
  const includedCount = clauses.filter(c => chosen[c.key]).length

  function toggleClause(c: Clause) {
    setChosen(prev => {
      const next = { ...prev }
      if (next[c.key]) delete next[c.key]
      else next[c.key] = c.options[0]
      return next
    })
  }

  function pickOption(c: Clause, opt: string) {
    setChosen(prev => ({ ...prev, [c.key]: opt }))
  }

  async function save() {
    setSaving(true)
    setError(null)
    // The legacy text columns stay filled so the printed fridge copy and
    // every older reader keep working untouched.
    const other = clauses
      .filter(c => chosen[c.key] && !['screens-off', 'device-sleep', 'social-apps', 'when-wrong'].includes(c.key))
      .map(c => `${c.title}: ${chosen[c.key]}`)
      .join('\n')
    try {
      const res = await fetch('/api/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage_id: stageId,
          agreement_type: type.key,
          clauses: chosen,
          family_values: `Our ${type.label} agreement. Screens in this family are for fun, learning and staying close, and these are the promises that keep them that way.`,
          bedroom_rule_time: chosen['screens-off'] ?? '',
          bedroom_rule_location: chosen['device-sleep'] ?? '',
          social_media_terms: chosen['social-apps'] ?? (type.key === 'first-screens' || type.key === 'tablet-games' ? 'Not yet at this stage, and that is part of the agreement.' : ''),
          when_things_go_wrong: chosen['when-wrong'] ?? '',
          extra_agreements: other,
          signed_by_parent: parentSigned,
          signed_by_child: childSigned,
          review_date: reviewDate,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setSavedState({ version: data.version, agreedDate: data.agreed_date })
      setStep('done')
    } catch {
      setError('The agreement did not save. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function weekVerdict(verdict: 'kept' | 'mostly' | 'tough') {
    setWeekResult('Saving...')
    try {
      const res = await fetch('/api/agreement/week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verdict }),
      })
      const data = await res.json()
      if (data.already) setWeekResult('This week is already checked. See you next Friday.')
      else if (data.stars > 0) setWeekResult(`${data.stars} stars landed in ${childName}'s bank. The agreement just paid out. ⭐`)
      else setWeekResult('Fresh start Monday. A tough week does not break the agreement, it is why the agreement exists.')
    } catch {
      setWeekResult('Could not save just now, try again in a moment.')
    }
  }

  const ukDay = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })).getDay()
  const isCheckWindow = ukDay === 5 || ukDay === 6 || ukDay === 0

  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
  }

  const bigBtn: React.CSSProperties = {
    width: '100%', padding: '17px', background: 'var(--terracotta)', color: 'var(--ink)',
    border: 'none', borderRadius: '16px', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px',
    boxShadow: '0 5px 0 var(--terracotta-dark)',
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px 60px' }}>

      {/* Header with step dots */}
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Family agreement</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
          {step === 'type' && 'What are we agreeing about?'}
          {step === 'clauses' && 'Tap what goes in'}
          {step === 'sign' && 'Read it out loud, then sign'}
          {step === 'done' && 'Our family agreement'}
        </h1>
        {step !== 'done' && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
            {(['type', 'clauses', 'sign'] as Step[]).map(s => (
              <span key={s} style={{
                flex: 1, height: '6px', borderRadius: '6px',
                background: (['type', 'clauses', 'sign'] as Step[]).indexOf(step) >= (['type', 'clauses', 'sign'] as Step[]).indexOf(s)
                  ? 'var(--terracotta)' : 'var(--border)',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── STEP 1: choose the type ── */}
      {step === 'type' && (
        <>
          <p style={{ fontSize: '16.5px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '20px' }}>
            Pick the agreement that fits where {childName} is right now. The recommended one matches their age, but you know your child.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {AGREEMENT_TYPES.map(t => {
              const active = typeKey === t.key
              const isRec = t.key === recommended
              return (
                <button
                  key={t.key}
                  onClick={() => setTypeKey(t.key)}
                  style={{
                    display: 'flex', gap: '16px', alignItems: 'flex-start', textAlign: 'left',
                    background: active ? 'var(--terracotta-lt)' : '#fff',
                    border: active ? '2.5px solid var(--terracotta)' : '2px solid var(--border)',
                    borderRadius: '18px', padding: '18px 20px', cursor: 'pointer',
                    boxShadow: active ? '0 4px 0 var(--terracotta-dark)' : '0 3px 0 var(--border)',
                  }}
                >
                  <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{t.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)' }}>
                        {t.label}
                      </span>
                      {isRec && (
                        <span style={{ ...mono, fontSize: '9px', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '100px', padding: '4px 10px' }}>
                          Recommended for {childName}
                        </span>
                      )}
                    </span>
                    <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: '5px' }}>
                      {t.ages}
                    </span>
                    <span style={{ display: 'block', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                      {t.blurb}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          <button onClick={() => setStep('clauses')} style={bigBtn}>
            This one, next →
          </button>
        </>
      )}

      {/* ── STEP 2: tap the clauses, pick the options ── */}
      {step === 'clauses' && (
        <>
          <p style={{ fontSize: '16.5px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '20px' }}>
            Sit down with {childName} and tap each promise you want in. Then pick the version that sounds like your family, or write your own. Skip anything that does not fit.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {clauses.map(c => {
              const included = !!chosen[c.key]
              const isCustom = included && !c.options.includes(chosen[c.key])
              return (
                <div key={c.key} style={{
                  background: included ? '#fff' : 'var(--cream)',
                  border: included ? '2.5px solid var(--terracotta)' : '2px solid var(--border)',
                  borderRadius: '18px', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => toggleClause(c)}
                    style={{
                      width: '100%', display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '17px 18px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{
                      width: 30, height: 30, borderRadius: '10px', flexShrink: 0, marginTop: '1px',
                      background: included ? 'var(--terracotta)' : '#fff',
                      border: included ? 'none' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--ink)', fontSize: '16px', fontWeight: 800,
                    }}>
                      {included ? '✓' : ''}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.3 }}>
                        {c.title}
                      </span>
                      <span style={{ display: 'block', fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '3px' }}>
                        {c.why}
                      </span>
                    </span>
                  </button>

                  {included && (
                    <div style={{ padding: '0 18px 16px 62px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {c.options.map(opt => {
                        const picked = chosen[c.key] === opt
                        return (
                          <button
                            key={opt}
                            onClick={() => pickOption(c, opt)}
                            style={{
                              padding: '12px 14px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                              fontSize: '15px', fontWeight: 600, lineHeight: 1.45, color: 'var(--ink)',
                              background: picked ? 'var(--terracotta-lt)' : 'var(--cream)',
                              border: picked ? '2px solid var(--terracotta)' : '1.5px solid var(--border)',
                            }}
                          >
                            {picked ? '● ' : '○ '}{opt}
                          </button>
                        )
                      })}
                      <input
                        value={isCustom ? chosen[c.key] : customDrafts[c.key] ?? ''}
                        onChange={e => {
                          setCustomDrafts(prev => ({ ...prev, [c.key]: e.target.value }))
                          if (e.target.value.trim()) pickOption(c, e.target.value)
                        }}
                        placeholder="Or write it in your own words"
                        style={{
                          padding: '12px 14px', borderRadius: '12px', fontSize: '15px',
                          border: isCustom ? '2px solid var(--terracotta)' : '1.5px dashed var(--border)',
                          background: '#fff', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none',
                        }}
                        maxLength={200}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep('type')} style={{ ...bigBtn, width: 'auto', flexShrink: 0, background: '#fff', color: 'var(--ink-soft)', border: '2px solid var(--border)', boxShadow: '0 3px 0 var(--border)' }}>
              ← Back
            </button>
            <button
              onClick={() => includedCount > 0 && setStep('sign')}
              style={{ ...bigBtn, opacity: includedCount > 0 ? 1 : 0.5, cursor: includedCount > 0 ? 'pointer' : 'default' }}
            >
              {includedCount > 0 ? `Looks right, ${includedCount} promise${includedCount === 1 ? '' : 's'} →` : 'Tap at least one promise'}
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3: review and sign ── */}
      {step === 'sign' && (
        <>
          <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '20px', padding: '24px 22px', marginBottom: '20px' }}>
            <div style={{ ...mono, fontSize: '10px', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
              {type.emoji} {type.label} · with {childName}
            </div>
            {clauses.filter(c => chosen[c.key]).map(c => (
              <div key={c.key} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '3px' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  {chosen[c.key]}
                </div>
              </div>
            ))}
            <div style={{ paddingTop: '14px' }}>
              <div style={{ ...mono, fontSize: '10px', color: 'var(--ink-muted)', marginBottom: '8px' }}>We look at this again on</div>
              <input
                type="date"
                value={reviewDate}
                onChange={e => setReviewDate(e.target.value)}
                style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--ink)', background: 'var(--cream)' }}
              />
            </div>
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
                display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
                background: '#fff', border: sig.checked ? '2.5px solid var(--terracotta)' : '2px solid var(--border)',
                borderRadius: '16px', padding: '17px 18px', marginBottom: '10px',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '9px', flexShrink: 0,
                background: sig.checked ? 'var(--terracotta)' : '#fff',
                border: sig.checked ? 'none' : '2px solid var(--border)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink)', fontSize: '15px', fontWeight: 800,
              }}>
                {sig.checked ? '✓' : ''}
              </span>
              <span style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{sig.label}</span>
            </button>
          ))}

          {error && <p style={{ fontSize: '14px', color: 'var(--danger, #C0533E)', margin: '10px 0' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button onClick={() => setStep('clauses')} style={{ ...bigBtn, width: 'auto', flexShrink: 0, background: '#fff', color: 'var(--ink-soft)', border: '2px solid var(--border)', boxShadow: '0 3px 0 var(--border)' }}>
              ← Back
            </button>
            {isPaid ? (
              <button onClick={save} disabled={saving} style={{ ...bigBtn, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save our agreement'}
              </button>
            ) : (
              <Link href="/dashboard/upgrade" style={{ ...bigBtn, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Save and print with membership →
              </Link>
            )}
          </div>
          {!isPaid && (
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '10px', textAlign: 'center' }}>
              Building it and talking it through is free. Membership saves it, tracks the weekly check, and prints the signed fridge copy.
            </p>
          )}
        </>
      )}

      {/* ── DONE: where the agreement lives ── */}
      {step === 'done' && (
        <>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ ...mono, fontSize: '10px', color: 'var(--ink)', background: 'var(--terracotta)', padding: '5px 12px', borderRadius: '100px' }}>
              {type.emoji} {type.label}
            </span>
            <span style={{ ...mono, fontSize: '10px', color: 'var(--ink-muted)', background: 'var(--stage-2)', padding: '5px 12px', borderRadius: '100px' }}>
              {stageLabel}
            </span>
            {savedState && (
              <span style={{ ...mono, fontSize: '10px', color: 'var(--ink-muted)' }}>
                Version {savedState.version}{savedState.agreedDate ? ` · agreed ${savedState.agreedDate}` : ''}
              </span>
            )}
          </div>

          <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '20px', padding: '24px 22px', marginBottom: '16px' }}>
            {Object.keys(chosen).length > 0 ? (
              clauses.filter(c => chosen[c.key]).map(c => (
                <div key={c.key} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', marginBottom: '3px' }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {chosen[c.key]}
                  </div>
                </div>
              ))
            ) : (
              // An agreement saved before the wizard existed: show the old text sections.
              [saved?.family_values, saved?.bedroom_rule_time, saved?.bedroom_rule_location, saved?.social_media_terms, saved?.when_things_go_wrong, saved?.extra_agreements]
                .filter(Boolean)
                .map((text, i) => (
                  <p key={i} style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.6, padding: '8px 0', margin: 0, borderBottom: '1px solid var(--border)' }}>
                    {text}
                  </p>
                ))
            )}
            <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', margin: '14px 0 0' }}>
              This lives here, always: Home → Family agreement. Review date {reviewDate}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <Link href="/dashboard/agreement/print" style={{ ...bigBtn, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Print the fridge copy
            </Link>
            <button onClick={() => setStep('type')} style={{ ...bigBtn, width: 'auto', flexShrink: 0, background: '#fff', color: 'var(--ink-soft)', border: '2px solid var(--border)', boxShadow: '0 3px 0 var(--border)' }}>
              Change it
            </button>
          </div>

          {/* End of week check: ask the child, give the verdict, pay the stars */}
          <div style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '22px' }}>
            <div style={{ ...mono, fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
              End of week check
            </div>
            {isCheckWindow ? (
              <>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', lineHeight: 1.55, margin: '0 0 14px' }}>
                  How did the agreement go this week? Ask {childName} first, then call it.
                </p>
                {childPhone && (
                  <a
                    href={`sms:${childPhone.replace(/\s/g, '')}?&body=${encodeURIComponent(`End of week check! How did our family agreement go this week, marks out of 10? And one thing we should change?`)}`}
                    style={{
                      display: 'block', textAlign: 'center', marginBottom: '10px',
                      background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.35)',
                      borderRadius: '14px', padding: '14px', textDecoration: 'none',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: '#fff',
                    }}
                  >
                    Text {childName} the check first
                  </a>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {([['kept', 'Kept it ⭐3'], ['mostly', 'Mostly ⭐2'], ['tough', 'Tough week']] as const).map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => weekVerdict(v)}
                      style={{
                        padding: '13px 8px', borderRadius: '14px', cursor: 'pointer',
                        background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                        boxShadow: '0 3px 0 var(--terracotta-dark)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {weekResult && (
                  <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#fff', lineHeight: 1.5, margin: '12px 0 0' }}>
                    {weekResult}
                  </p>
                )}
              </>
            ) : (
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: 0 }}>
                Opens every Friday: ask {childName} how the week went against the agreement, give it your verdict, and a kept week pays 3 stars straight into their bank.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
