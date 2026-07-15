import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// A calendar file for one school action, so a parent or child can add it to
// their own phone calendar in one tap. Keyed by the action's unguessable id so
// the child's link works with no login, the same trust model as their quest
// page. A one off lands on its due date, a weekly routine repeats every week,
// and either way it is a timed event at 7:45 in the morning so the phone's own
// reminder does the nudge too.

export const dynamic = 'force-dynamic'

const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

function pad(n: number): string { return String(n).padStart(2, '0') }
function ymd(d: Date): string { return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` }

// The next date (today included) whose weekday matches.
function nextWeekday(weekday: number): Date {
  const d = new Date()
  const diff = (weekday - d.getDay() + 7) % 7
  d.setDate(d.getDate() + diff)
  return d
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ error: 'bad id' }, { status: 400 })

  const admin = createAdminClient()
  const { data: a } = await admin
    .from('school_actions')
    .select('id, title, detail, due_date, due_time, recurs_weekday')
    .eq('id', id)
    .maybeSingle()
  if (!a) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // A written time (dentist at 09:00) becomes the event's real start; the
  // default 7:45 covers the seen by today reminders that carry no time.
  const tm = typeof a.due_time === 'string' && /^\d{2}:\d{2}/.test(a.due_time) ? a.due_time.slice(0, 5) : null
  const startClock = tm ? `${tm.replace(':', '')}00` : '074500'
  const endClock = tm
    ? `${pad((Number(tm.slice(0, 2)) * 60 + Number(tm.slice(3, 5)) + 15) / 60 | 0)}${pad((Number(tm.slice(0, 2)) * 60 + Number(tm.slice(3, 5)) + 15) % 60)}00`
    : '080000'

  let startDate: string
  let rrule = ''
  if (a.recurs_weekday !== null && a.recurs_weekday !== undefined) {
    startDate = ymd(nextWeekday(a.recurs_weekday as number))
    rrule = `\nRRULE:FREQ=WEEKLY;BYDAY=${BYDAY[a.recurs_weekday as number]}`
  } else if (a.due_date) {
    startDate = String(a.due_date).replace(/-/g, '')
  } else {
    startDate = ymd(new Date())
  }

  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  const now = new Date()
  const stamp = `${ymd(now)}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`

  // Floating local time (no Z, no TZID) so 7:45 means 7:45 on the holder's own
  // phone, wherever they are.
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Guided Childhood//School//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:school-${a.id}@guidedchildhood.com`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${esc(String(a.title))}`,
    a.detail ? `DESCRIPTION:${esc(String(a.detail))}` : 'DESCRIPTION:From school, via Guided Childhood',
    `DTSTART:${startDate}T${startClock}`,
    `DTEND:${startDate}T${endClock}${rrule}`,
    'BEGIN:VALARM',
    'TRIGGER:PT0M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(String(a.title))}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${String(a.title).replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40)}.ics"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}
