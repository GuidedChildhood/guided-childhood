'use client'

import { useEffect, useState } from 'react'

// THE CHILD'S OWN WEEK.
//
// Justin, 8 August 2026, having just watched the parent's week calendar come
// together: "we could build same viewer on child's phone so they can see their
// week."
//
// Same data, deliberately not the same screen. The grown up's version is seven
// rows at once with a tick, a cross and an add on every item, because a parent
// is planning. A child is not planning, they are answering one question, which
// is "what do I need tomorrow", and seven cramped rows of small text is the
// worst possible shape for that question.
//
// MOBBIN, 8 August 2026. Searched weekly schedules on iOS. Outlook, Amie and
// Evernote all give the hour grid, which is wrong here for the same reason it
// was wrong on the parent's version: school reminders are all day things, so
// an hour grid is empty columns with a few chips floating in them.
//
// Saturn Calendar is the one that fits, and it is doing our exact job for our
// exact audience, a school timetable built for teenagers:
// https://mobbin.com/screens/ab52f517-d159-4cc6-a9a2-4bc947f62fbb
// A strip of the seven days across the top with the date and a dot on the days
// that have something, the chosen day lit up, and then that day alone as a big
// readable list underneath. The week shape is in the dots; the reading is one
// day at a time and in a size a child can actually read.
// Notion's weekly plan is the other half of the reference, day headings with
// their items under them: https://mobbin.com/screens/3cb253aa-3a56-462b-9cee-76decd1366a6
//
// READ ONLY, ON PURPOSE. No tick, no delete, no add. Clearing a school reminder
// is the grown up saying the thing is handled, and a child ticking "paid for
// the trip" from their bedroom would put a wrong fact on their parent's list.
// This screen answers a question. It does not take instructions.
//
// The clock is the child's own. Nothing that needs it renders until the
// component has mounted, so the server and the first client render agree and
// there is no hydration mismatch and no flash of the wrong day.

export type KidWeekItem = {
  id: string
  title: string
  kind: string
  /** A one off, dated. Null for a weekly routine. */
  dueDate: string | null
  /** 0 Sunday to 6 Saturday for a weekly routine. Null for a one off. */
  weekday: number | null
  /** HH:MM, when there is one. Most school things have no time. */
  time: string | null
  /** The day this was ticked off by the grown up, if it has been. */
  clearedOn: string | null
}

const KIND_EMOJI: Record<string, string> = {
  kit: '🎒', homework: '📕', event: '🎉', deadline: '⏰', payment: '💷', notice: '📌',
}

// A COLOUR PER KIND, THE WAY A CALENDAR DOES IT.
//
// Justin: "the colours of this page need to match Google Calendar colours mixed
// with touches of our brand."
//
// Google Calendar's own named palette is the source, because it is the thing he
// is comparing this to and because those eleven colours are genuinely well made:
// they hold their meaning at chip size, they sit apart from each other for the
// most common kinds of colour blindness, and every one of them takes dark text.
// Peacock, Basil, Banana, Tangerine, Grape and Flamingo, in their real values.
//
// The tint is ours. Each chip is a wash of its colour with a solid rail down
// the left edge, which is the shape Toggl and Outlook use and which survives
// being small far better than a filled block. Ink stays our ink, the type stays
// Nunito, and the radius stays chunky, so it reads as a calendar without
// stopping being ours.
//
// Read only: a rail is not a control, and nothing here can be ticked. See the
// note at the top of the file about why that matters.
const KIND_COLOUR: Record<string, { rail: string; wash: string }> = {
  // Peacock, for the thing you carry.
  kit:      { rail: '#039BE5', wash: '#E6F4FD' },
  // Basil, for work.
  homework: { rail: '#0B8043', wash: '#E6F3EC' },
  // Grape, for the fun one.
  event:    { rail: '#8E24AA', wash: '#F4E9F7' },
  // Tangerine, for the one with a clock on it.
  deadline: { rail: '#F4511E', wash: '#FDEDE7' },
  // Banana, for money. Deliberately the mildest: a payment is a grown up's job
  // and a child should never read one as something they have to solve.
  payment:  { rail: '#F6BF26', wash: '#FEF7E4' },
  // Flamingo, for everything else.
  notice:   { rail: '#E67C73', wash: '#FCEDEC' },
}
const KIND_FALLBACK = { rail: '#616161', wash: '#F1F1F1' }   // Graphite

const DAYS = [
  { dow: 1, short: 'Mon', long: 'Monday' },
  { dow: 2, short: 'Tue', long: 'Tuesday' },
  { dow: 3, short: 'Wed', long: 'Wednesday' },
  { dow: 4, short: 'Thu', long: 'Thursday' },
  { dow: 5, short: 'Fri', long: 'Friday' },
  { dow: 6, short: 'Sat', long: 'Saturday' },
  { dow: 0, short: 'Sun', long: 'Sunday' },
]

function iso(d: Date): string {
  // Local date, never toISOString. Through the British summer that would roll
  // an evening back a day and put Friday's PE kit on Thursday.
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** The Monday of the week containing d, moved on by whole weeks. */
function mondayOf(d: Date, weekOffset: number): Date {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  const back = (out.getDay() + 6) % 7
  out.setDate(out.getDate() - back + weekOffset * 7)
  return out
}

export default function KidSchoolWeek({ items, childName }: {
  items: KidWeekItem[]
  childName?: string | null
}) {
  const [nowMs, setNowMs] = useState<number | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  // The day the child tapped. Null means automatic, worked out below once the
  // clock arrives, so they land somewhere useful without having to tap at all.
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => { setNowMs(Date.now()) }, [])

  const mounted = nowMs != null
  const monday = mounted ? mondayOf(new Date(nowMs), weekOffset) : null
  const todayIso = mounted ? iso(new Date(nowMs)) : ''

  const days = DAYS.map((d, i) => {
    const date = monday ? new Date(monday.getTime() + i * 86400000) : null
    const dateIso = date ? iso(date) : ''
    const isToday = dateIso !== '' && dateIso === todayIso
    const isPast = mounted && dateIso !== '' && dateIso < todayIso

    const on = items.filter(it => (
      it.weekday != null ? it.weekday === d.dow : (dateIso !== '' && it.dueDate === dateIso)
    ))
    // A routine is ticked off for one named day, so it only reads as done on
    // the day it was actually cleared on.
    const list = on.map(it => ({ item: it, done: it.clearedOn === dateIso && dateIso !== '' }))
    list.sort((x, y) => (x.item.time ?? '99').localeCompare(y.item.time ?? '99'))
    return { ...d, date, dateIso, isToday, isPast, list }
  })

  // Which day opens when the child has not picked one. Today if today is in
  // this week, otherwise the first day that actually has something, otherwise
  // Monday. Pressing on to next week and landing on an empty Monday, with dots
  // sitting on Tuesday and Thursday, is a screen that makes you do the work
  // twice.
  const auto = days.find(d => d.isToday) ?? days.find(d => d.list.some(x => !x.done)) ?? days[0]
  const open = (picked ? days.find(d => d.dateIso === picked) : null) ?? auto
  const weekCount = days.reduce((n, d) => n + d.list.filter(x => !x.done).length, 0)

  const range = monday
    ? `${monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} to ${new Date(monday.getTime() + 6 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : ''
  const label = weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Next week' : weekOffset === -1 ? 'Last week' : range

  function goWeek(next: number) {
    setWeekOffset(next)
    // Back to automatic, so the new week opens on whatever is worth reading in
    // it rather than on the same weekday the child happened to be looking at.
    setPicked(null)
  }

  return (
    <div>
      {/* Which week */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Ink, because this page is now a light calendar surface rather
              than the anthracite the rest of the child's sub pages use. Every
              colour in this file moved with it; a single leftover white would
              be invisible. */}
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.1 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.04em', marginTop: 3 }}>
            {mounted ? (weekCount === 0 ? 'nothing from school' : `${weekCount} to remember`) : range}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
          {([['‹', -1, 'The week before'], ['›', 1, 'The week after']] as const).map(([glyph, step, aria]) => (
            <button
              key={aria}
              type="button"
              onClick={() => goWeek(weekOffset + step)}
              aria-label={aria}
              style={{
                width: 44, height: 44, borderRadius: 14, cursor: 'pointer',
                background: '#fff', border: '2px solid var(--border)',
                boxShadow: '0 3px 0 var(--border)',
                fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1,
              }}
            >
              {glyph}
            </button>
          ))}
        </div>
      </div>

      {/* The seven days, as a strip. The dot is the whole point: a child can see
          which days have something without reading a word. */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
        {days.map(d => {
          const isOpen = d.dateIso !== '' && d.dateIso === open?.dateIso
          const hasSomething = d.list.some(x => !x.done)
          return (
            <button
              key={d.short}
              type="button"
              onClick={() => setPicked(d.dateIso)}
              aria-label={d.long}
              aria-current={isOpen ? 'date' : undefined}
              style={{
                flex: 1, minWidth: 0, padding: '8px 1px 7px', cursor: 'pointer',
                borderRadius: 14, textAlign: 'center',
                background: isOpen ? 'var(--terracotta)' : '#fff',
                border: `2px solid ${isOpen || d.isToday ? 'var(--terracotta)' : 'var(--border)'}`,
                boxShadow: isOpen ? '0 3px 0 var(--terracotta-dark)' : 'none',
              }}
            >
              {/* Three letters, not one. Two Ts and two Ss in a row of seven is
                  a puzzle, and this strip's whole job is to be read at a
                  glance. */}
              <span style={{
                display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase',
                color: isOpen ? 'var(--ink)' : 'var(--ink-muted)',
              }}>
                {d.short}
              </span>
              {/* A day gone by is dimmed by colour rather than opacity, so it
                  reads as past instead of as unloaded. */}
              <span style={{
                display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'var(--text-md)', lineHeight: 1.15, marginTop: 1,
                color: isOpen ? 'var(--ink)' : d.isPast ? 'var(--ink-light, #A8A5A0)' : 'var(--ink)',
              }}>
                {d.date ? d.date.getDate() : '·'}
              </span>
              <span aria-hidden style={{
                display: 'block', width: 6, height: 6, borderRadius: '50%', margin: '4px auto 0',
                background: hasSomething ? (isOpen ? 'var(--ink)' : 'var(--terracotta)') : 'transparent',
              }} />
            </button>
          )
        })}
      </div>

      {/* The chosen day, big enough to read from across a room */}
      <div style={{
        background: '#fff', border: '2px solid var(--border)', borderRadius: 20,
        boxShadow: '0 5px 0 var(--border)', padding: '16px 16px 18px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: open?.isToday ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginBottom: 10,
        }}>
          {open?.isToday ? 'Today' : open?.long}
          {open?.date ? ` · ${open.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}` : ''}
        </div>

        {(open?.list.length ?? 0) === 0 ? (
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.3 }}>
            Nothing from school. Enjoy it.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {open!.list.map(({ item, done }) => {
              const c = KIND_COLOUR[item.kind] ?? KIND_FALLBACK
              return (
              <div
                key={`${item.id}-${open!.dateIso}`}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 11,
                  // The calendar chip: a wash of the kind's colour with a solid
                  // rail down the left. Done rows drop to plain cream, because a
                  // finished thing should stop competing for the eye with the
                  // things that still need doing.
                  background: done ? 'var(--cream)' : c.wash,
                  borderLeft: `5px solid ${done ? 'var(--border)' : c.rail}`,
                  border: '1.5px solid var(--border)',
                  borderLeftWidth: 5,
                  borderLeftColor: done ? 'var(--border)' : c.rail,
                  borderRadius: 14, padding: '11px 12px',
                  opacity: done ? 0.6 : 1,
                }}
              >
                <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1.1, flexShrink: 0 }}>
                  {KIND_EMOJI[item.kind] ?? '📌'}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3,
                    textDecoration: done ? 'line-through' : 'none',
                  }}>
                    {item.title}
                  </span>
                  {(item.time || item.weekday != null || done) && (
                    <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
                      {item.time && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          color: 'var(--ink-soft)', background: '#fff', border: '1px solid var(--border)',
                          borderRadius: 100, padding: '2px 8px',
                        }}>
                          {item.time}
                        </span>
                      )}
                      {item.weekday != null && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                          borderRadius: 100, padding: '2px 8px',
                        }}>
                          every {DAYS.find(d => d.dow === item.weekday)?.short.toLowerCase()}
                        </span>
                      )}
                      {done && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          color: 'var(--retro-green)', background: '#fff', border: '1px solid var(--border)',
                          borderRadius: 100, padding: '2px 8px',
                        }}>
                          ✓ sorted
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Says out loud whose list this is and who changes it, so a child is not
          left hunting for a tick that is not theirs to make. */}
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 4px 0' }}>
        This comes from the school reminders {childName ? `your grown up set up for you` : 'your grown up set up'}. They tick things off at their end, so all you need to do here is look.
      </p>
    </div>
  )
}
