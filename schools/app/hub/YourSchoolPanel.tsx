'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  readYourSchool, writeYourSchool, clearYourSchool, schoolRows,
  YOUR_SCHOOL_EVENT, YOUR_SCHOOL_LABEL, YOUR_SCHOOL_MAX, type YourSchool,
} from '@gc/shared/schools-your-school'

// YOUR SCHOOL: the one thing only the school can tell the scheme.
//
// Every lesson can teach that there is a grown up in this building whose
// actual job is safeguarding. None of them can say who, and a class that
// leaves knowing the name is the whole difference between a policy and a
// child who tells somebody (migration 316's script for the KS2 slide). So
// the name is typed here once, and the slide, the prep pages and the
// printed teacher sheet carry it from then on.
//
// It is stored in this browser and nowhere else, like the tracker. The
// panel says so in words next to the fields, because the app's promise to a
// DPO is that nothing about a school's people reaches us, and a box that
// asks for a name had better say where the name goes.
//
// TWO PLACES, ONE STORE (23 September 2026). The Hub carries it for a school
// that has the scheme. The safeguarding crosswalk, which is open, carries it
// for the DSL deciding whether to recommend it: a DSL's review asked for
// material she could adapt, and typing her own lead and policy into the page
// she would file is the most direct answer there is (Justin chose to put it
// on the open page). `variant` changes only the words around the form. The
// fields, the store and the promise are the same in both places.

type Variant = 'hub' | 'crosswalk'

const COPY: Record<Variant, { heading: string; intro: React.ReactNode; note: string }> = {
  hub: {
    heading: 'Who children should tell',
    intro: (
      <>
        Every lesson teaches that there is a grown up in this building whose actual job is this.
        Only you can say who. Type your designated safeguarding lead&rsquo;s name once and it
        appears on the slide that asks the class to write it down, on every flagged lesson&rsquo;s
        prep page and on the printed teacher sheet. The deputy, how a concern is recorded and your
        policy&rsquo;s title go on the staff briefings and the safeguarding crosswalk, so the
        copies you file name your school.
      </>
    ),
    note: 'Stored in this browser only, like the tracker. Nothing is sent to us, no account is made, and clearing the browser clears it. A second classroom screen types it again.',
  },
  crosswalk: {
    heading: 'Make this page your school’s',
    intro: (
      <>
        Type your safeguarding lead, their deputy, how a concern is recorded here and the title of
        your policy. They print at the top of this page and of every staff briefing, so the copy
        you file is your school&rsquo;s own. Print it without them and the top of the page has
        lines to write them in.
      </>
    ),
    note: 'Stored in this browser only. Nothing is sent to us, no account is made, and clearing the browser clears it.',
  },
}

// Grouped by who reads them, so each group can say where its fields appear.
// The staff group runs two across and gives the policy title a whole row,
// because at three across on a 740px page the longer fields were cut off
// mid word before anyone had typed in them.
const GROUPS: { legend: string; hint: string; min: number; fields: { key: keyof YourSchool; id: string; placeholder: string; wide?: boolean }[] }[] = [
  {
    legend: 'What the class hears',
    hint: 'On the slide that asks who to tell, and on the prep pages.',
    min: 220,
    fields: [
      { key: 'leadName', id: 'your-school-lead', placeholder: 'Ms Okafor' },
      { key: 'leadWhere', id: 'your-school-where', placeholder: 'the office by the hall' },
    ],
  },
  {
    legend: 'What staff need',
    hint: 'On the staff briefings, the teacher sheet and the top of the safeguarding crosswalk.',
    min: 260,
    fields: [
      { key: 'deputyName', id: 'your-school-deputy', placeholder: 'Mr Shah' },
      { key: 'reportRoute', id: 'your-school-route', placeholder: 'on the concern log, the same day' },
      { key: 'policyTitle', id: 'your-school-policy', placeholder: 'Child Protection Policy', wide: true },
    ],
  },
]

const EMPTY: YourSchool = { leadName: '', leadWhere: '', deputyName: '', reportRoute: '', policyTitle: '' }
const STAFF_FIELDS: (keyof YourSchool)[] = ['deputyName', 'reportRoute', 'policyTitle']

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: 'var(--space-1)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55,
}
const legend: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', padding: 0,
}

export default function YourSchoolPanel({ variant = 'hub' }: { variant?: Variant }) {
  const copy = COPY[variant]
  const [saved, setSaved] = useState<YourSchool | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<YourSchool>(EMPTY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const read = () => {
      const v = readYourSchool()
      setSaved(v)
      setDraft(v ?? EMPTY)
      setReady(true)
    }
    read()
    window.addEventListener(YOUR_SCHOOL_EVENT, read)
    return () => window.removeEventListener(YOUR_SCHOOL_EVENT, read)
  }, [])

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const v = writeYourSchool(draft)
    setSaved(v)
    setEditing(false)
  }

  function onForget() {
    clearYourSchool()
    setSaved(null)
    setDraft(EMPTY)
    setEditing(false)
  }

  const showForm = ready && (editing || !saved)
  // A record saved before the staff fields existed, or saved without them:
  // say what is missing next to the button that adds it.
  const missing = saved ? STAFF_FIELDS.filter(k => !saved[k]).map(k => YOUR_SCHOOL_LABEL[k].toLowerCase()) : []

  return (
    <section id="your-school" className="no-print" aria-labelledby="your-school-heading" style={{
      background: '#fff', border: '1px solid var(--border)', borderTop: '4px solid var(--coral-dark)',
      borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)',
      boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
    }}>
      <div style={{ ...eyebrow, color: 'var(--coral-dark)', marginBottom: 'var(--space-2)' }}>
        Your school · stays on this screen
      </div>
      <h2 id="your-school-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, margin: '0 0 var(--space-2)' }}>
        {copy.heading}
      </h2>
      <p style={{ ...body, marginBottom: 'var(--space-3)', maxWidth: '620px' }}>
        {copy.intro}
      </p>

      {!ready ? null : showForm ? (
        <form onSubmit={onSave}>
          {GROUPS.map(g => (
            <fieldset key={g.legend} style={{ border: 0, padding: 0, margin: '0 0 var(--space-3)', minWidth: 0 }}>
              <legend style={legend}>{g.legend}</legend>
              <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '2px 0 var(--space-2)' }}>{g.hint}</p>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${g.min}px, 1fr))`, gap: 'var(--space-3)', alignItems: 'end' }}>
                {g.fields.map(f => (
                  <div key={f.key} style={f.wide ? { gridColumn: '1 / -1' } : undefined}>
                    <label htmlFor={f.id} style={label}>{YOUR_SCHOOL_LABEL[f.key]}</label>
                    <input
                      className="input"
                      id={f.id}
                      name={f.key}
                      required={f.key === 'leadName'}
                      maxLength={YOUR_SCHOOL_MAX[f.key]}
                      autoComplete="off"
                      placeholder={f.placeholder}
                      value={draft[f.key]}
                      onChange={e => { const next = e.target.value; setDraft(d => ({ ...d, [f.key]: next })) }}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-gold" disabled={!draft.leadName.trim()}>Save on this screen</button>
            {saved && (
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(false); setDraft(saved) }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : saved ? (
        <div>
          <dl className="gc-facts" style={{ margin: '0 0 var(--space-3)' }}>
            {schoolRows(saved).map(r => (
              <Fragment key={r.label}>
                <dt style={{ ...label, marginBottom: 0, paddingTop: '4px' }}>{r.label}</dt>
                <dd style={{ ...body, color: 'var(--ink)', margin: 0 }}>{r.value}</dd>
              </Fragment>
            ))}
          </dl>
          {missing.length > 0 && (
            <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '0 0 var(--space-3)' }}>
              Not typed yet: {missing.join(', ')}.
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(true)}>Change</button>
            <button type="button" className="btn btn-outline" onClick={onForget}>Forget</button>
          </div>
        </div>
      ) : null}

      <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 'var(--space-3)', marginBottom: 0 }}>
        {copy.note}
      </p>
    </section>
  )
}
