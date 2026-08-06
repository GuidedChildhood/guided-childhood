'use client'

import type { SchoolAction } from './SchoolActionsCard'

// The week, as a week.
//
// Justin: "we need to make sure this has a schedule that shows full week like
// a calendar making clear where alerts are, and how to add, delete or mark as
// done as well as recurring, all clearly displayed."
//
// The list above this could tell you what was coming but never WHEN, as a
// shape. A parent reads "Friday: Cubs" and still has to hold the rest of the
// week in their head to know that Thursday is empty and Monday has two things.
// That is the job a calendar does and a list cannot.
//
// WHY DAY ROWS AND NOT AN HOUR GRID.
//
// Mobbin sweep, 6 August 2026: the hour grid is what every calendar app
// reaches for (Outlook, Amie, Evernote, ClickUp, Todoist all in the first six
// results). It is wrong here. School reminders are all day things: bring the
// PE kit, reading record due, pay for the trip. Almost none has a start time,
// so an hour grid would be seven empty columns with four chips floating in
// them, and the one thing a parent wants to see (which days are busy) would be
// the hardest thing on the screen to read.
//
// Runna's training calendar is the pattern that fits, and it is doing exactly
// our job with exactly our data shape: the week as seven day ROWS, each day
// naming itself, items as chips on their day, and a quiet "+ Add" sitting on
// every empty day so the gap is an invitation rather than a blank.
// https://mobbin.com/screens/78f33f57-7f21-402b-8051-9bce15e29d07
//
// Everything a parent can do to an item is on the item: tick to clear, cross
// to delete, and the ↻ says out loud that this one comes back next week. No
// menus, because a fortnightly used feature that hides its verbs behind a tap
// is a feature nobody learns.
//
// SERVER AND CLIENT AGREE ON THE FIRST RENDER. nowMs is null until the card
// mounts, exactly as it is for the list. While it is null the seven rows still
// render with their day names and their weekly routines, because a routine is
// pinned to a weekday and needs no clock. Only the date numbers, the today
// highlight and the dated one offs wait for the client, which is why there is
// no hydration mismatch and no empty flash.

const DAYS = [
  { dow: 1, short: 'Mon' }, { dow: 2, short: 'Tue' }, { dow: 3, short: 'Wed' },
  { dow: 4, short: 'Thu' }, { dow: 5, short: 'Fri' }, { dow: 6, short: 'Sat' },
  { dow: 0, short: 'Sun' },
]

const KIND_DOT: Record<string, string> = {
  kit: 'var(--stage-1-bold)',
  payment: 'var(--stage-3-bold)',
  homework: 'var(--stage-2-bold)',
  event: 'var(--stage-5-bold)',
  deadline: 'var(--danger)',
  notice: 'var(--border)',
}

function iso(d: Date): string {
  // Local date, not UTC. toISOString would roll a British evening back to the
  // previous day through most of the summer, which would put Friday's PE kit
  // on Thursday's row for anyone opening the app after 11pm in BST.
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** The Monday of the week containing `d`, offset by whole weeks. */
function mondayOf(d: Date, weekOffset: number): Date {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  // getDay is 0 for Sunday, so Sunday belongs to the week that started six
  // days earlier rather than the one starting tomorrow.
  const back = (out.getDay() + 6) % 7
  out.setDate(out.getDate() - back + weekOffset * 7)
  return out
}

export type WeekItem = {
  action: SchoolAction
  /** A weekly routine landing on this day, rather than a one off dated to it. */
  weekly: boolean
  /** Already ticked off for this particular day. */
  cleared: boolean
  /** Its day has been and gone, and it was never cleared. */
  missed: boolean
  /**
   * Whether the tick does anything on this row.
   *
   * A one off can be marked done whenever you like. A weekly routine is
   * cleared for ONE named day (the API takes clear_today), so ticking Friday's
   * PE kit on a Tuesday would either lie or clear the wrong day. The tick is
   * shown but inert on the other six, so the row still reads the same.
   */
  canClear: boolean
}

export default function SchoolWeek({
  actions, nowMs, weekOffset, onWeek, onClear, onDelete, onAdd, clearedIds,
}: {
  actions: SchoolAction[]
  nowMs: number | null
  weekOffset: number
  onWeek: (offset: number) => void
  onClear: (a: SchoolAction) => void
  onDelete: (id: string) => void
  onAdd: (dateIso: string, dow: number) => void
  clearedIds: Set<string>
}) {
  const mounted = nowMs != null
  const monday = mounted ? mondayOf(new Date(nowMs), weekOffset) : null
  const todayIso = mounted ? iso(new Date(nowMs)) : ''

  // The seven days, each with whatever lands on it.
  const days = DAYS.map((d, i) => {
    const date = monday ? new Date(monday.getTime() + i * 86400000) : null
    const dateIso = date ? iso(date) : ''
    const isToday = dateIso !== '' && dateIso === todayIso
    const isPast = mounted && dateIso !== '' && dateIso < todayIso

    const items: WeekItem[] = []
    for (const a of actions) {
      if (a.recurs_weekday != null) {
        if (a.recurs_weekday !== d.dow) continue
        // A routine is cleared for one specific day, so the tick only shows on
        // the day it was actually cleared on, not on every week's row.
        const cleared = (isToday && clearedIds.has(a.id)) || String(a.cleared_on ?? '') === dateIso
        items.push({ action: a, weekly: true, cleared, missed: isPast && !cleared, canClear: isToday })
      } else if (dateIso && a.due_date === dateIso) {
        items.push({ action: a, weekly: false, cleared: false, missed: isPast, canClear: true })
      }
    }
    // Timed things first, in time order, then the bring it that day ones.
    items.sort((x, y) => (x.action.due_time ?? '99').localeCompare(y.action.due_time ?? '99'))
    return { ...d, date, dateIso, isToday, isPast, items }
  })

  const alerts = days.reduce((n, d) => n + d.items.filter(i => !i.cleared).length, 0)
  const range = monday
    ? `${monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} to ${new Date(monday.getTime() + 6 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : ''

  const label = weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Next week' : weekOffset === -1 ? 'Last week' : range

  return (
    <div style={{ marginBottom: '18px' }}>

      {/* Which week, and the two arrows that move it */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.04em', marginTop: '2px' }}>
            {/* Short on purpose. "6 things due" orphaned the word "due" onto
                its own line at 390 wide, next to two arrow buttons. */}
            {range}{mounted ? ` · ${alerts === 0 ? 'nothing due' : `${alerts} due`}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {[['‹', -1, 'Previous week'], ['›', 1, 'Next week']].map(([glyph, step, aria]) => (
            <button
              key={String(aria)}
              type="button"
              onClick={() => onWeek(weekOffset + (step as number))}
              aria-label={String(aria)}
              style={{
                width: 36, height: 36, borderRadius: '10px', cursor: 'pointer',
                background: '#fff', border: '1.5px solid var(--border)',
                fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1,
              }}
            >
              {glyph}
            </button>
          ))}
          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={() => onWeek(0)}
              style={{
                padding: '0 12px', height: 36, borderRadius: '10px', cursor: 'pointer',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)',
              }}
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* The week */}
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        {days.map((d, i) => (
          <div
            key={d.short}
            style={{
              display: 'flex', gap: '10px', padding: '9px 11px', alignItems: 'flex-start',
              borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              background: d.isToday ? 'var(--terracotta-lt)' : d.isPast ? 'var(--cream)' : '#fff',
            }}
          >
            {/* The day itself. Fixed width so seven rows line up into a column
                a parent can run their eye down. */}
            <div style={{ width: 52, flexShrink: 0, paddingTop: '3px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: d.isToday ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
              }}>
                {d.short}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
                color: d.isPast ? 'var(--ink-muted)' : 'var(--ink)', lineHeight: 1.2, marginTop: '1px',
              }}>
                {d.date ? d.date.getDate() : ''}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {d.items.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onAdd(d.dateIso, d.dow)}
                  style={{
                    alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '5px 0', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
                    fontWeight: 600, color: 'var(--ink-muted)',
                  }}
                >
                  + Add
                </button>
              ) : d.items.map(({ action: a, weekly, cleared, missed, canClear }) => (
                <div
                  key={`${a.id}-${d.dateIso}`}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: '5px',
                    background: cleared ? 'transparent' : missed ? '#FDECEC' : 'var(--cream)',
                    border: `1.5px solid ${cleared ? 'var(--border)' : missed ? '#F3C9C9' : 'var(--border)'}`,
                    borderRadius: '11px', padding: '7px 9px',
                    opacity: cleared ? 0.6 : 1,
                  }}
                >
                  {/* The name gets the line. It shared it with the time, the
                      weekly pill, the phone mark and both buttons, and at 390
                      wide that left "Reading record signed and in the bag"
                      setting one word per line down a column two centimetres
                      across. The chips are worth less than the name of the
                      thing, so they go underneath it. */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span aria-hidden style={{
                      width: 9, height: 9, borderRadius: '50%', flexShrink: 0, marginTop: '6px',
                      background: KIND_DOT[a.kind] ?? 'var(--border)',
                    }} />
                    <span style={{
                      flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)',
                      lineHeight: 1.3, textDecoration: cleared ? 'line-through' : 'none',
                    }}>
                      {a.title}
                    </span>

                  {/* Mark as done, and end it for good. Both on the item, both
                      always visible, because this screen is opened once a week
                      and a hidden verb is a verb nobody finds. */}
                  <button
                    type="button"
                    onClick={() => onClear(a)}
                    disabled={cleared || !canClear}
                    aria-label={cleared ? 'Done' : canClear ? 'Mark as done' : 'Comes round on its own day'}
                    title={cleared ? 'Done' : canClear ? 'Mark as done' : 'You can tick this off on the day itself'}
                    style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '9px',
                      cursor: cleared || !canClear ? 'default' : 'pointer',
                      background: cleared ? 'var(--retro-green)' : '#fff',
                      border: cleared ? 'none' : '1.5px solid var(--border)',
                      color: cleared ? '#fff' : 'var(--ink-soft)', fontSize: 'var(--text-base)', lineHeight: 1,
                      opacity: !cleared && !canClear ? 0.4 : 1,
                    }}
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(a.id)}
                    aria-label={weekly ? `Delete the ${a.title} routine` : `Delete ${a.title}`}
                    title={weekly ? 'Delete this routine for good' : 'Delete'}
                    style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '9px', cursor: 'pointer',
                      background: '#fff', border: '1.5px solid var(--border)',
                      color: 'var(--ink-muted)', fontSize: 'var(--text-base)', lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                  </div>

                  {/* When, whether it comes back, and whether they get it too.
                      Indented to the name above so the two lines read as one
                      item rather than two. */}
                  {(a.due_time || weekly || a.auto_send_to_child) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingLeft: '17px' }}>
                      {a.due_time && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          color: 'var(--ink-soft)', background: '#fff', border: '1px solid var(--border)',
                          borderRadius: '100px', padding: '2px 7px',
                        }}>
                          {a.due_time.slice(0, 5)}
                        </span>
                      )}
                      {/* Says out loud that this one comes back, which is the
                          whole difference between deleting it and clearing it. */}
                      {weekly && (
                        <span
                          title="Every week"
                          style={{
                            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                            color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                            borderRadius: '100px', padding: '2px 7px',
                          }}
                        >
                          ↻ weekly
                        </span>
                      )}
                      {a.auto_send_to_child && (
                        <span
                          title="Also reminds them on their app"
                          style={{
                            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                            color: 'var(--ink-muted)', background: '#fff', border: '1px solid var(--border)',
                            borderRadius: '100px', padding: '2px 7px',
                          }}
                        >
                          📱 they get it too
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* A day that already has something still needs a way to add a
                  second thing, without the row shouting about it. */}
              {d.items.length > 0 && (
                <button
                  type="button"
                  onClick={() => onAdd(d.dateIso, d.dow)}
                  style={{
                    alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '1px 0 2px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                    fontWeight: 600, color: 'var(--ink-muted)',
                  }}
                >
                  + Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 2px 0' }}>
        Tick to clear it, cross to delete it. Anything marked ↻ weekly comes back on the same day next week, so clearing it is not the same as deleting it.
      </p>
    </div>
  )
}
