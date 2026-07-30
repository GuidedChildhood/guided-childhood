'use client'

import { useState } from 'react'

// Write your own job, in one place.
//
// This existed twice in QuestManager with identical behaviour: once in the add
// panel (QuestManager.tsx:1252) and once under the ideas grid (1697). Same
// addQuest call, same daily one star default, same 120 character cap, two
// slightly different looks and two placeholders. Any change to what a written
// job lands as had to be made in both, and the second one was already drifting:
// different padding, different background, a mono label on one and a display
// label on the other.
//
// Worse, both read and wrote the SAME customTitle state on the parent. Wherever
// both were on screen at once, typing into one silently filled the other, and
// adding from one cleared the box under the other. Giving the composer its own
// state per instance ends that: two composers are now genuinely two boxes.
//
// What a written job lands as lives here now, in one place: a daily job worth
// one star, which the parent can change on the job itself once it is in.

// The four the API already accepts. Nothing new is invented here: schedule has
// always been on family_quests and the composer simply never asked.
export type Schedule = 'daily' | 'weekdays' | 'weekend' | 'once'

const WHEN: { key: Schedule; label: string }[] = [
  { key: 'daily',    label: 'Every day' },
  { key: 'weekdays', label: 'School days' },
  { key: 'weekend',  label: 'Weekends' },
  { key: 'once',     label: 'Just once' },
]

// When a job repeats, chosen as it is written.
//
// Justin: "when we add a job from list it should give us a date or needs to be
// done by, so easy to say today your room each morning this week, so repeats
// each morning."
//
// The behaviour he wanted already existed: every job landed as daily, which IS
// each morning. What was missing was any way to SEE or CHOOSE it, so a parent
// adding a one off tidy up had no idea it had just been set to repeat for ever,
// and only found out when it came back the next day. A default nobody can see
// is a default nobody agreed to.
//
// Every day stays the default, so nothing a parent does today changes.
export default function JobComposer({
  onAdd,
  placeholder = 'Make your bed, feed the cat...',
  tone = 'white',
  autoFocus = false,
  help,
  countToday,
}: {
  /**
   * Given the trimmed title and how often it should repeat. The caller still
   * owns everything else a job becomes, the stars and the emoji.
   */
  onAdd: (title: string, schedule: Schedule) => void
  placeholder?: string
  /** The input sits on white cards in the add panel and on cream further down. */
  tone?: 'white' | 'cream'
  autoFocus?: boolean
  help?: string
  /**
   * How many jobs this child already has today, so the composer can say when
   * the list has got long.
   *
   * A guide, never a cap. A parent who wants eight jobs can have eight jobs;
   * they know their family and we do not. But a child who opens the app to a
   * wall of them does fewer, not more, and the moment to mention that is while
   * the ninth is being typed rather than in a help page nobody opens.
   */
  countToday?: number
}) {
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState<Schedule>('daily')
  const ready = title.trim().length > 0

  // Five is where a child's list stops reading as a plan and starts reading
  // as a chore chart. Said once, gently, and never enforced.
  const COMFORTABLE = 5
  const many = typeof countToday === 'number' && countToday >= COMFORTABLE

  const submit = () => {
    if (!ready) return
    onAdd(title.trim(), when)
    setTitle('')
    // The schedule is NOT reset. A parent adding three school day jobs picks
    // school days once, not three times.
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          autoFocus={autoFocus}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
          placeholder={placeholder}
          // minWidth 0 so a long placeholder cannot push the Add button off a
          // phone screen. The second copy of this was missing it.
          style={{
            flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
            border: '1.5px solid var(--border)',
            background: tone === 'cream' ? 'var(--cream)' : '#fff',
            fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--ink)', outline: 'none',
          }}
          maxLength={120}
        />
        <button
          onClick={submit}
          disabled={!ready}
          style={{
            flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
            borderRadius: '12px', padding: '12px 20px',
            cursor: ready ? 'pointer' : 'default',
            fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
            boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: ready ? 1 : 0.5,
          }}
        >
          Add
        </button>
      </div>
      {/* Wraps, because four labels do not fit one phone row. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
        {WHEN.map(w => {
          const on = w.key === when
          return (
            <button
              key={w.key}
              type="button"
              onClick={() => setWhen(w.key)}
              aria-pressed={on}
              style={{
                cursor: 'pointer', borderRadius: 100, padding: '7px 13px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14.5,
                background: on ? 'var(--terracotta)' : '#fff',
                color: 'var(--ink)',
                border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
              }}
            >
              {w.label}
            </button>
          )
        })}
      </div>
      {many && (
        <p style={{ fontSize: '14px', color: 'var(--terracotta-dark)', lineHeight: 1.45, margin: '9px 0 0', fontWeight: 600 }}>
          That is {countToday} jobs today. Plenty of families run three or four and
          find they get done. Add more if it suits you, this is only a nudge.
        </p>
      )}
      {help && (
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '9px 0 0' }}>
          {help}
        </p>
      )}
    </>
  )
}
