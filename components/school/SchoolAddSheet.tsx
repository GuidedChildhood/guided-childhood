'use client'

import { useEffect, useRef, useState } from 'react'

// ADDING A REMINDER, ON THE DAY YOU TAPPED.
//
// Justin, 7 August 2026: "calendar looks great but when you click add it goes
// nowhere really, it should step you through adding a reminder. So the actual
// reminder you will add on that day, and ask if reoccuring [or] one off ...
// then needs to, when click add, show plus send to child's phone reminder."
//
// It did technically go somewhere. Tapping "+ Add" on Thursday opened the form
// underneath the week and set the day on it. On a phone that form is entirely
// below the fold, so the tap looked like it had done nothing at all, and the
// day it had quietly set was invisible. A control whose effect is off screen has
// not worked, whatever the state says.
//
// So it is a sheet over the week instead, and it asks the three questions in
// the order a parent actually thinks about them:
//
//   1. WHAT is it            the only thing they have in their head
//   2. JUST THIS DAY or EVERY WEEK   the fork, asked plainly, with the real day
//                                    named rather than a "repeats" checkbox
//   3. WHAT TIME             optional, because most of these are all day
//
// And then the fourth thing, which is the point of the product rather than the
// form: does their child get told as well. It is on the Add button itself, not
// buried in a list afterwards, because sending it to the child is the reason
// the reminder exists and it was previously a separate trip through a drawer.

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// The classics parents forget, so the common case is two taps rather than
// typing. Same list the old form carried; it earns its place more here, where
// it is the first thing under the name field.
const QUICK: { label: string; kind: string }[] = [
  { label: 'PE kit', kind: 'bring' },
  { label: 'Swimming kit', kind: 'bring' },
  { label: 'Reading book', kind: 'bring' },
  { label: 'Spelling test', kind: 'notice' },
  { label: 'Show and tell', kind: 'bring' },
  { label: 'Forest school', kind: 'bring' },
]

export type NewReminder = {
  title: string
  kind: string
  /** Set for a one off. Null when it repeats every week. */
  due_date: string | null
  due_time: string | null
  /** 0 to 6, Sunday first. Null when it is a one off. */
  recurs_weekday: number | null
  /** Their phone gets it too. */
  auto_send_to_child: boolean
  /** A weekly routine that keeps going in the school holidays (migration
   *  182). School time only is the default, which is what stops PE kit
   *  firing in the middle of August. */
  runs_in_holidays: boolean
}

export default function SchoolAddSheet({
  dateIso, dow, dayLabel, childName, onCancel, onAdd, initial = null,
}: {
  /** The day that was tapped, as YYYY-MM-DD. */
  dateIso: string
  /** 0 to 6, Sunday first, matching recurs_weekday. */
  dow: number
  /** "Thursday 6 August", for the heading. */
  dayLabel: string
  childName?: string | null
  onCancel: () => void
  onAdd: (r: NewReminder) => Promise<void> | void
  /** Editing an existing reminder: the sheet opens filled in and the button
   *  says Save. Justin, 10 August 2026: "a way for them to click in and
   *  simply stop it edit it if wrong." Null is a fresh add, as before. */
  initial?: { title: string; kind: string; repeats: boolean; time: string | null; toChild: boolean; runsInHolidays: boolean } | null
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [kind, setKind] = useState(initial?.kind ?? 'notice')
  const [repeats, setRepeats] = useState(initial?.repeats ?? false)
  const [time, setTime] = useState(initial?.time ?? '')
  // Defaults ON. The whole point of a school reminder in this product is that
  // the child is told as well, and a parent who does not want that can turn it
  // off in one tap. Defaulting it off meant the useful half was opt in and
  // almost nobody found it.
  const [toChild, setToChild] = useState(initial?.toChild ?? true)
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
    if (!title.trim() || saving) return
    setSaving(true)
    try {
      await onAdd({
        title: title.trim(),
        kind,
        due_date: repeats ? null : dateIso,
        due_time: time || null,
        recurs_weekday: repeats ? dow : null,
        auto_send_to_child: toChild,
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
      aria-label={`Add a reminder for ${dayLabel}`}
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
              {editing ? 'Edit reminder' : 'New reminder'}
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
        <label style={LABEL} htmlFor="gc-add-name">What is it</label>
        <input
          id="gc-add-name"
          ref={nameRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
          placeholder="PE kit, swimming, spelling test"
          style={{
            width: '100%', padding: '13px 14px', borderRadius: 13,
            border: '1.5px solid var(--border)', fontSize: 'var(--text-md)',
            fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--ink)',
            background: 'var(--cream)', marginBottom: 10,
          }}
        />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {QUICK.map(q => (
            <button
              key={q.label}
              onClick={() => { setTitle(q.label); setKind(q.kind); setRepeats(true) }}
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

        {/* 2. THE FORK. Named days rather than a repeats checkbox, because
            "every Thursday" is what a parent means and "repeats: true" with a
            separate day picker is what a form means. */}
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

        {/* SCHOOL TIME OR HOME LIFE, only for a weekly routine. Justin, 10
            August 2026, on Show and tell firing mid summer holidays: "we need
            to know if it's school time reminders or home life reminders."
            School time is the default and those routines rest through the
            school holidays; a club that runs all year opts in to holidays
            too. A dated one off never asks, it was typed on purpose. */}
        {repeats && (
          <>
            <span style={LABEL}>In the school holidays</span>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { on: false, top: 'School time only', sub: 'Pauses in the holidays' },
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

        {/* 3. TIME, optional. Most of these are all day, which is exactly why
            the week is day rows and not an hour grid. */}
        <span style={LABEL}>Time, if it has one</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
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

        {/* 4. THE POINT. On the way out, not in a drawer afterwards. */}
        <button
          onClick={() => setToChild(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer',
            background: toChild ? 'var(--tint-sage, #EAF3EE)' : '#fff',
            border: `2px solid ${toChild ? 'var(--retro-green, #2F8F6B)' : 'var(--border)'}`,
            borderRadius: 14, padding: '12px 13px', marginBottom: 16, textAlign: 'left',
          }}
        >
          <span aria-hidden style={{
            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
            border: `2px solid ${toChild ? 'var(--retro-green, #2F8F6B)' : 'var(--border)'}`,
            background: toChild ? 'var(--retro-green, #2F8F6B)' : '#fff',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-base)', fontWeight: 900,
          }}>
            {toChild ? '✓' : ''}
          </span>
          <span>
            <span style={{
              display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'var(--text-base)', color: 'var(--ink)',
            }}>
              📲 Send it to {childName ? `${childName}'s` : 'their'} phone too
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.4 }}>
              They get the reminder on the day, so it is not only you remembering it.
            </span>
          </span>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: '14px 18px', borderRadius: 15, border: '1.5px solid var(--border)',
              background: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink-soft)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!title.trim() || saving}
            style={{
              flex: 1, padding: '14px', borderRadius: 15, border: 'none',
              background: title.trim() ? 'var(--terracotta)' : 'var(--border)',
              color: 'var(--ink)', cursor: title.trim() && !saving ? 'pointer' : 'default',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              boxShadow: title.trim() ? '0 5px 0 var(--terracotta-dark)' : 'none',
            }}
          >
            {saving ? 'Saving...' : editing ? 'Save changes' : repeats ? `Add every ${DAY_NAMES[dow]}` : 'Add it'}
          </button>
        </div>
      </div>
    </div>
  )
}
