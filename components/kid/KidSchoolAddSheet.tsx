'use client'

import { useEffect, useRef, useState } from 'react'

// THE CHILD'S ADD SHEET, COPIED FROM THE PARENT'S.
//
// Justin, 9 August 2026: "can we copy the parent calendar entry system we
// built as that worked well."
//
// So this is components/school/SchoolAddSheet with the child link's trust
// model and the child's voice, not a new invention: the same sheet over the
// week, the same three questions in the same order (what is it, just this day
// or every week, what time), the same quick chips for the classics. What
// changes is exactly what has to:
//
//   The kinds are only the child kinds (kit, homework, event), the things
//   that are a child's own business and already reach their screen by
//   default. No payments, no notices.
//
//   There is no "send it to their phone" toggle, because the fourth thing on
//   the parent's sheet answers a question that does not exist here: it is
//   already their phone. Its slot instead says plainly that the grown up
//   will see it too, which is the promise that makes a shared diary safe.

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// The classics a child remembers before a grown up does. Two taps, no typing.
const QUICK: { label: string; kind: string }[] = [
  { label: 'PE kit', kind: 'kit' },
  { label: 'Swimming kit', kind: 'kit' },
  { label: 'Reading book', kind: 'kit' },
  { label: 'Homework due', kind: 'homework' },
  { label: 'Club after school', kind: 'event' },
  { label: 'Show and tell', kind: 'kit' },
]

const KINDS = [
  { kind: 'kit', emoji: '🎒', label: 'Kit' },
  { kind: 'homework', emoji: '📕', label: 'Homework' },
  { kind: 'event', emoji: '🎉', label: 'Club or event' },
] as const

export type KidNewDiaryItem = {
  title: string
  kind: string
  /** Set for a one off. Null when it repeats every week. */
  due_date: string | null
  due_time: string | null
  /** 0 to 6, Sunday first. Null when it is a one off. */
  recurs_weekday: number | null
  /** A weekly routine that keeps going in the school holidays. School time
   *  only is the default, which is what stops PE kit firing in August. */
  runs_in_holidays: boolean
}

export default function KidSchoolAddSheet({
  dateIso, dow, dayLabel, onCancel, onAdd, initial = null,
}: {
  /** The day that was tapped, as YYYY-MM-DD. */
  dateIso: string
  /** 0 to 6, Sunday first, matching recurs_weekday. */
  dow: number
  /** "Thursday 6 August", for the heading. */
  dayLabel: string
  onCancel: () => void
  onAdd: (r: KidNewDiaryItem) => Promise<void> | void
  /** Editing one of the child's own items: the sheet opens filled in and the
   *  button says Save. Null is a fresh add, exactly as before. */
  initial?: { title: string; kind: string; repeats: boolean; time: string | null; runsInHolidays: boolean } | null
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [kind, setKind] = useState(initial?.kind ?? 'kit')
  const [repeats, setRepeats] = useState(initial?.repeats ?? false)
  const [time, setTime] = useState(initial?.time ?? '')
  const [inHolidays, setInHolidays] = useState(initial?.runsInHolidays ?? false)
  const [saving, setSaving] = useState(false)
  const editing = initial !== null

  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])

  // Escape closes, the same as every other sheet in the app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const submit = async () => {
    if (title.trim().length < 2 || saving) return
    setSaving(true)
    try {
      await onAdd({
        title: title.trim(),
        kind,
        due_date: repeats ? null : dateIso,
        due_time: time || null,
        recurs_weekday: repeats ? dow : null,
        runs_in_holidays: repeats ? inHolidays : false,
      })
    } finally { setSaving(false) }
  }

  const LABEL: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)',
    display: 'block', marginBottom: '7px',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Add to your diary for ${dayLabel}`}
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(26,26,46,0.45)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460, background: '#fff',
          borderRadius: '22px 22px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom))',
          maxHeight: '88vh', overflowY: 'auto',
          boxShadow: '0 -14px 44px -12px rgba(26,26,46,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
            }}>
              {editing ? 'Fix your diary' : 'Add to your diary'}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
              color: 'var(--ink)', margin: '3px 0 0', letterSpacing: '-0.01em',
            }}>
              {dayLabel}
            </h2>
          </div>
          <button onClick={onCancel} aria-label="Cancel" style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--cream)',
            cursor: 'pointer', fontSize: 'var(--text-md)', color: 'var(--ink-muted)', flexShrink: 0,
          }}>✕</button>
        </div>

        {/* 1. WHAT */}
        <label style={LABEL} htmlFor="gc-kid-add-name">What do you need to remember</label>
        <input
          id="gc-kid-add-name"
          ref={nameRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
          maxLength={140}
          placeholder="PE kit, spelling test, football"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 13,
            border: '1.5px solid var(--border)', fontSize: 'var(--text-md)',
            fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--ink)',
            background: 'var(--cream)', marginBottom: 10,
          }}
        />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {QUICK.map(q => (
            <button
              key={q.label}
              onClick={() => { setTitle(q.label); setKind(q.kind) }}
              style={{
                background: title === q.label ? 'var(--terracotta)' : '#fff',
                border: '1.5px solid var(--border)', borderRadius: 999,
                padding: '7px 12px', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)',
                color: 'var(--ink)',
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Which kind, so the diary can colour it the way the calendar does.
            The parent sheet hides this behind its quick chips; a child gets
            three big honest choices instead. */}
        <span style={LABEL}>What kind of thing</span>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
          {KINDS.map(k => (
            <button
              key={k.kind}
              onClick={() => setKind(k.kind)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                color: 'var(--ink)',
                background: kind === k.kind ? 'var(--terracotta-lt)' : '#fff',
                border: `2px solid ${kind === k.kind ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: 100, padding: '9px 14px',
              }}
            >
              <span aria-hidden>{k.emoji}</span> {k.label}
            </button>
          ))}
        </div>

        {/* 2. THE FORK, exactly as the parent's sheet asks it: named days,
            not a repeats checkbox. */}
        <span style={LABEL}>When</span>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { on: false, top: 'Just this day', sub: dayLabel },
            { on: true, top: 'Every week', sub: `Every ${DAY_NAMES[dow]}` },
          ].map(o => (
            <button
              key={String(o.on)}
              onClick={() => setRepeats(o.on)}
              style={{
                flex: 1, textAlign: 'left', cursor: 'pointer',
                background: repeats === o.on ? 'var(--tint-butter, #FFF6DE)' : '#fff',
                border: `2px solid ${repeats === o.on ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: 14, padding: '11px 12px',
              }}
            >
              <span style={{
                display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'var(--text-base)', color: 'var(--ink)',
              }}>
                {o.on ? '↻ ' : ''}{o.top}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 2 }}>
                {o.sub}
              </span>
            </button>
          ))}
        </div>

        {/* THE HOLIDAYS QUESTION, only for an every week routine, because a
            dated one off in the holidays was typed on purpose. This is what
            stops PE kit firing in August: school time is the default and the
            diary holds those routines back through the school holidays. */}
        {repeats && (
          <>
            <span style={LABEL}>In the school holidays</span>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { on: false, top: 'School time only', sub: 'Has a rest in the holidays' },
                { on: true, top: 'Holidays too', sub: 'Keeps going all year' },
              ].map(o => (
                <button
                  key={String(o.on)}
                  onClick={() => setInHolidays(o.on)}
                  style={{
                    flex: 1, textAlign: 'left', cursor: 'pointer',
                    background: inHolidays === o.on ? 'var(--tint-butter, #FFF6DE)' : '#fff',
                    border: `2px solid ${inHolidays === o.on ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: 14, padding: '11px 12px',
                  }}
                >
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'var(--text-base)', color: 'var(--ink)',
                  }}>
                    {o.on ? '🏖️ ' : '🏫 '}{o.top}
                  </span>
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 2 }}>
                    {o.sub}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 3. TIME, optional, because most school things are all day. */}
        <span style={LABEL}>Time, if it has one</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              padding: '11px 12px', borderRadius: 13, border: '1.5px solid var(--border)',
              fontSize: 'var(--text-md)', fontFamily: 'var(--font-body)', fontWeight: 600,
              color: 'var(--ink)', background: 'var(--cream)',
            }}
          />
          {time && (
            <button onClick={() => setTime('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 'var(--text-base)', color: 'var(--ink-muted)', fontWeight: 700,
              textDecoration: 'underline',
            }}>
              All day
            </button>
          )}
        </div>

        {/* Where the parent's sheet asks about the child's phone, the child's
            says what happens next: the grown up sees it. A promise, not a
            choice, because a shared diary with secret entries is not shared. */}
        <p style={{
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'var(--tint-sage, #EAF3EE)', border: '1.5px solid var(--border)',
          borderRadius: 14, padding: '11px 13px', margin: '0 0 16px',
          fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4,
        }}>
          <span aria-hidden style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>📲</span>
          <span>Your grown up sees everything you add, and it wears a ⭐ you added this badge.</span>
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: '14px 18px', borderRadius: 15, border: '1.5px solid var(--border)',
              background: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink-soft)',
            }}
          >
            Not now
          </button>
          <button
            onClick={submit}
            disabled={title.trim().length < 2 || saving}
            style={{
              flex: 1, padding: '14px', borderRadius: 15, border: 'none',
              background: title.trim().length >= 2 ? 'var(--terracotta)' : 'var(--border)',
              color: 'var(--ink)', cursor: title.trim().length >= 2 && !saving ? 'pointer' : 'default',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              boxShadow: title.trim().length >= 2 ? '0 5px 0 var(--terracotta-dark)' : 'none',
            }}
          >
            {saving ? 'Saving…' : editing ? 'Save it' : repeats ? `Add every ${DAY_NAMES[dow]}` : 'Add it'}
          </button>
        </div>
      </div>
    </div>
  )
}
