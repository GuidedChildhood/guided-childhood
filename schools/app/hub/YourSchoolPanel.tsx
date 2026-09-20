'use client'

import { useEffect, useState } from 'react'
import { readYourSchool, writeYourSchool, clearYourSchool, leadLine, YOUR_SCHOOL_EVENT, type YourSchool } from '@gc/shared/schools-your-school'

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

export default function YourSchoolPanel() {
  const [saved, setSaved] = useState<YourSchool | null>(null)
  const [editing, setEditing] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadWhere, setLeadWhere] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const read = () => {
      const v = readYourSchool()
      setSaved(v)
      setLeadName(v?.leadName ?? '')
      setLeadWhere(v?.leadWhere ?? '')
      setReady(true)
    }
    read()
    window.addEventListener(YOUR_SCHOOL_EVENT, read)
    return () => window.removeEventListener(YOUR_SCHOOL_EVENT, read)
  }, [])

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const v = writeYourSchool({ leadName, leadWhere })
    setSaved(v)
    setEditing(false)
  }

  function onForget() {
    clearYourSchool()
    setSaved(null)
    setLeadName('')
    setLeadWhere('')
    setEditing(false)
  }

  const showForm = ready && (editing || !saved)

  return (
    <section id="your-school" aria-labelledby="your-school-heading" style={{
      background: '#fff', border: '1px solid var(--border)', borderTop: '4px solid var(--coral-dark)',
      borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)',
      boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
    }}>
      <div style={{ ...eyebrow, color: 'var(--coral-dark)', marginBottom: 'var(--space-2)' }}>
        Your school · stays on this screen
      </div>
      <h2 id="your-school-heading" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, margin: '0 0 var(--space-2)' }}>
        Who children should tell
      </h2>
      <p style={{ ...body, marginBottom: 'var(--space-3)', maxWidth: '620px' }}>
        Every lesson teaches that there is a grown up in this building whose actual job is this.
        Only you can say who. Type your designated safeguarding lead&rsquo;s name once and it
        appears on the slide that asks the class to write it down, on every flagged lesson&rsquo;s
        prep page and on the printed teacher sheet.
      </p>

      {!ready ? null : showForm ? (
        <form onSubmit={onSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)', alignItems: 'end' }}>
          <div>
            <label htmlFor="your-school-lead" style={label}>Safeguarding lead</label>
            <input
              className="input"
              id="your-school-lead"
              name="leadName"
              required
              maxLength={80}
              autoComplete="off"
              placeholder="Ms Okafor"
              value={leadName}
              onChange={e => setLeadName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="your-school-where" style={label}>Where to find them</label>
            <input
              className="input"
              id="your-school-where"
              name="leadWhere"
              maxLength={120}
              autoComplete="off"
              placeholder="the office by the hall"
              value={leadWhere}
              onChange={e => setLeadWhere(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-gold" disabled={!leadName.trim()}>Save on this screen</button>
            {saved && (
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(false); setLeadName(saved.leadName); setLeadWhere(saved.leadWhere) }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : saved ? (
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <p style={{ ...body, color: 'var(--ink)', margin: 0, flex: '1 1 260px' }}>
            On this screen: <strong>{leadLine(saved)}</strong>
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(true)}>Change</button>
            <button type="button" className="btn btn-outline" onClick={onForget}>Forget</button>
          </div>
        </div>
      ) : null}

      <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 'var(--space-3)', marginBottom: 0 }}>
        Stored in this browser only, like the tracker. Nothing is sent to us, no account is made,
        and clearing the browser clears it. A second classroom screen types it again.
      </p>
    </section>
  )
}
