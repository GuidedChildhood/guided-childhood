'use client'

import { useEffect, useState } from 'react'
import { SCHOOL_EMAIL_FORWARDING_LIVE } from '@/lib/config/school'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'
import SchoolWeek from './SchoolWeek'
import FoldSection from '@/components/dashboard/FoldSection'
import SchoolAddSheet, { type NewReminder } from './SchoolAddSheet'
import { isHeldForHolidays } from '@/lib/school/child-items'
import type { Region } from '@/lib/learning/holidays'

// Sunday first, matching recurs_weekday and JS getDay, so an index is never
// shifted by one on the way between them.
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Today as YYYY-MM-DD in LOCAL time. Deliberately not toISOString, which is UTC
// and rolls a British summer evening back to yesterday, the same trap the week
// grid already avoids.
function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Tell the bell to recount the moment a school item is cleared, settled or
// added right here, so the number on the bell never lags behind the card.
function notifsChanged() {
  try { window.dispatchEvent(new Event(NOTIFS_CHANGED_EVENT)) } catch { /* SSR safety */ }
}

// Things you need to know: the open school_actions DiGi extracted from
// forwarded school emails, plus anything the parent typed in by hand
// for the school that never emails. Done and dismiss post to
// /api/school/actions, adding posts there too, and Send sends the item
// straight to the child's own quest page so packing the kit becomes
// their job, not just something the parent remembers alone.
//
// Weekly routines (PE every Thursday, library books every Friday) are
// a separate, permanent list: they never get done or dismissed the
// way a one off does, they just come round again, and can be set to
// remind the child automatically every single week with no parent tap
// required.

export type SchoolAction = {
  id: string
  kind: string
  title: string
  detail: string | null
  due_date: string | null
  due_time?: string | null
  sent_to_child?: boolean
  recurs_weekday?: number | null
  auto_send_to_child?: boolean
  cleared_on?: string | null
  /** Who put it on the diary (migration 179). Missing reads as parent. */
  added_by?: string | null
  /** The adding child's name, resolved server side. Null when unknown. */
  added_by_child_name?: string | null
  /**
   * WHOSE item this is, resolved server side, migration 215. Distinct from
   * added_by_child_name, which says who typed it in. Null is the household's:
   * a row from before the column, or genuinely everyone's.
   */
  child_name?: string | null
  /** A routine that keeps going in the school holidays (migration 182).
   *  Missing reads as school time, which rests through the holidays. */
  runs_in_holidays?: boolean | null
}

// The child put this on the diary themselves, said plainly, because a parent
// reading the family list needs to know which entries they did not write.
function AddedByChild({ name }: { name?: string | null }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      background: 'var(--terracotta-lt)', color: 'var(--terracotta-dark)',
      border: '1px solid var(--terracotta)', borderRadius: '100px', padding: '2px 8px', flexShrink: 0,
    }}>
      ⭐ {name ? `${name} added this` : 'added by your child'}
    </span>
  )
}

const KIND_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  kit: { label: 'Kit', bg: 'var(--stage-1-bold)', color: 'var(--stage-1-text)' },
  payment: { label: 'Payment', bg: 'var(--stage-3-bold)', color: 'var(--stage-3-text)' },
  homework: { label: 'Homework', bg: 'var(--stage-2-bold)', color: 'var(--stage-2-text)' },
  event: { label: 'Event', bg: 'var(--stage-5-bold)', color: 'var(--stage-5-text)' },
  deadline: { label: 'Deadline', bg: 'var(--danger-bg)', color: 'var(--danger)' },
  notice: { label: 'Notice', bg: 'var(--border)', color: 'var(--ink-soft)' },
}

const WEEKDAY_NAME: Record<number, string> = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' }


type DueTone = 'overdue' | 'urgent' | 'today' | 'soon' | 'calm'

// The reminder escalates as it nears. A dated task is calm days out, turns
// to Today, and if a written time is set it goes red in the last hour and
// overdue once it passes. This drives both the words and the colour so the
// card gets louder exactly when it matters, never before.
// nowMs is passed in, not read from the clock, so the same value is used on
// the server render and the first client render (no hydration mismatch). It
// is null until the component mounts, and while null the minute level urgency
// is held back to a stable Today at HH:MM, then it escalates live once the
// client ticks the clock in.
function dueInfo(dueDate: string | null, dueTime: string | null | undefined, nowMs: number | null): { text: string; tone: DueTone } | null {
  if (!dueDate) return null
  const today = new Date(nowMs ?? Date.parse(`${dueDate}T00:00:00`)); today.setHours(0, 0, 0, 0)
  const dueDay = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(dueDay.getTime())) return null
  const days = Math.round((dueDay.getTime() - today.getTime()) / 86400000)
  const timeStr = dueTime ? dueTime.slice(0, 5) : null

  if (days > 1) return { text: `By ${dueDay.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}${timeStr ? `, ${timeStr}` : ''}`, tone: 'calm' }
  if (days === 1) return { text: `Tomorrow${timeStr ? ` at ${timeStr}` : ''}`, tone: 'soon' }

  // Today or past. Minute level urgency only once mounted (nowMs set).
  if (timeStr && nowMs != null) {
    const dueAt = new Date(`${dueDate}T${dueTime!.length === 5 ? `${dueTime}:00` : dueTime}`)
    if (!Number.isNaN(dueAt.getTime())) {
      const mins = Math.round((dueAt.getTime() - nowMs) / 60000)
      if (mins < 0) return { text: `Overdue · was ${timeStr}`, tone: 'overdue' }
      if (mins <= 60) return { text: mins <= 1 ? `Now · ${timeStr}` : `In ${mins} min · ${timeStr}`, tone: 'urgent' }
      if (days < 0) return { text: `Overdue · was ${timeStr}`, tone: 'overdue' }
      return { text: `Today at ${timeStr}`, tone: 'today' }
    }
  }
  if (timeStr) return { text: `Today at ${timeStr}`, tone: 'today' }
  if (days < 0) return { text: 'Overdue', tone: 'overdue' }
  return { text: 'Today', tone: 'today' }
}

export default function SchoolActionsCard({ actions: initial, childName, region = 'uk', compact = false }: {
  actions: SchoolAction[]
  childName?: string | null
  region?: Region
  /**
   * Inside something that already names this section, so the card drops its own
   * eyebrow and title rather than saying "From school" twice on one screen.
   * True on Home, where the FoldSection above it is already the heading. False
   * on /dashboard/school, where this card IS the page.
   */
  compact?: boolean
}) {
  const [actions, setActions] = useState(initial)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  // Which week the calendar is showing. 0 is this one, and the arrows walk it.
  // The day whose "+ Add" was tapped, and therefore the sheet that is open.
  // Null is closed.
  const [addDay, setAddDay] = useState<{ dateIso: string; dow: number } | null>(null)

  const [weekOffset, setWeekOffset] = useState(0)

  // The reminder being edited, opening the same sheet the add uses, filled
  // in. Justin, 10 August 2026: "a way for them to click in and simply stop
  // it edit it if wrong."
  const [editItem, setEditItem] = useState<SchoolAction | null>(null)
  // The full list underneath, which repeats every item the week already shows.
  //
  // It is not redundant: it is the only place with Send to Teo, the calendar
  // download, the detail line and Dismiss as distinct from Done. But printed
  // open beneath the calendar it showed the same six things three times over,
  // which is worse than the list alone was. So the week is the answer and the
  // list is the drawer, one tap away and remembered for the session.
  const [showList, setShowList] = useState(false)
  // Held null through the first render so server and client agree, then the
  // clock ticks in and the timed cards escalate on their own.
  const [nowMs, setNowMs] = useState<number | null>(null)
  useEffect(() => {
    setNowMs(Date.now())
    const t = setInterval(() => setNowMs(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  // What the folded week row says, so folding it costs no information. Counted
  // off the same live list the grid draws, never a second source of truth.
  const dueThisWeek = actions.filter(a => {
    if (!a.due_date) return false
    const d = new Date(`${a.due_date}T00:00:00`)
    if (Number.isNaN(d.getTime())) return false
    // nowMs is null until mount, so the week is anchored on the real clock
    // only once there is one. Before that it falls back to today, which is
    // what every other date reader in this file does.
    const now = new Date(nowMs ?? Date.now())
    const start = new Date(now); start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + weekOffset * 7)
    const end = new Date(start); end.setDate(end.getDate() + 7)
    return d >= start && d < end
  }).length


  // Due springs to the top. Weekly routines sort by how soon their day comes
  // round (today first, one cleared for today drops to the back until next
  // week), one offs by due date and time with no date last. Sorted only once
  // the clock has ticked in, so the server and first client render still agree.
  const todayDow = nowMs === null ? null : new Date(nowMs).getDay()
  const daysUntil = (a: { recurs_weekday?: number | null; cleared_on?: string | null }) => {
    if (todayDow === null || a.recurs_weekday == null) return 0
    const d = (a.recurs_weekday - todayDow + 7) % 7
    const clearedToday = String(a.cleared_on ?? '') === new Date(nowMs!).toISOString().slice(0, 10)
    return d === 0 && clearedToday ? 7 : d
  }
  const recurring = actions.filter(a => a.recurs_weekday != null)
    .sort((a, b) => daysUntil(a) - daysUntil(b))
  const oneOff = actions.filter(a => a.recurs_weekday == null)
    .sort((a, b) => {
      if (nowMs === null) return 0
      const ka = a.due_date ? `${a.due_date}T${(a.due_time ?? '23:59').slice(0, 5)}` : '9999'
      const kb = b.due_date ? `${b.due_date}T${(b.due_time ?? '23:59').slice(0, 5)}` : '9999'
      return ka < kb ? -1 : ka > kb ? 1 : 0
    })

  const settle = async (id: string, status: 'done' | 'dismissed') => {
    setActions(a => a.filter(x => x.id !== id))
    notifsChanged()
    try {
      await fetch('/api/school/actions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
    } catch { /* non blocking */ }
  }

  // A weekly routine cleared for today: it stays in the list (it is coming back
  // next week) but steps back from today's reminders, so clearing PE kit does
  // not delete the routine. Delete (Remove) is the way to end it for good.
  const todayStr = nowMs != null ? new Date(nowMs).toISOString().slice(0, 10) : ''
  // Which weekday falls tomorrow, so a routine coming round then gets a quiet
  // day before heads up on screen, matching the push that goes out tonight.
  const tomorrowWeekday = nowMs != null ? (new Date(nowMs).getDay() + 1) % 7 : -1
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set())
  // Seed from the server once the client clock is in: a routine whose cleared_on
  // is today is already cleared for today.
  useEffect(() => {
    if (!todayStr) return
    const seed = initial.filter(a => a.recurs_weekday != null && String(a.cleared_on ?? '') === todayStr).map(a => a.id)
    if (seed.length) setClearedIds(s => { const n = new Set(s); seed.forEach(id => n.add(id)); return n })
  }, [todayStr, initial])
  const clearForToday = async (id: string) => {
    setClearedIds(s => { const n = new Set(s); n.add(id); return n })
    notifsChanged()
    try {
      await fetch('/api/school/actions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, clear_today: true }),
      })
    } catch { /* non blocking, it still holds for this view */ }
  }


  // "Thursday 6 August", for the sheet's heading. Parsed from the ISO parts
  // rather than new Date(iso), which reads a bare YYYY-MM-DD as UTC midnight and
  // shows the day before once the clocks go forward.
  const dayLabel = (dateIso: string, dow: number) => {
    const [y, m, d] = dateIso.split('-').map(Number)
    if (!y || !m || !d) return DAY_FULL[dow] ?? ''
    const local = new Date(y, m - 1, d)
    return `${DAY_FULL[dow]} ${local.getDate()} ${MONTHS[local.getMonth()]}`
  }

  // Adding from the sheet. Same endpoint and the same optimistic insert as the
  // old form, with one difference that matters: a one off keeps its time. The
  // old path dropped due_time unless a date AND a time were both filled in on
  // the form, so a reminder added for a specific day at 3pm lost the 3pm.
  const addFromSheet = async (r: NewReminder) => {
    try {
      const res = await fetch('/api/school/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r),
      })
      const data = await res.json()
      if (data.action) {
        setActions(a => [...a, data.action].sort((x, y) => (x.due_date ?? '9999').localeCompare(y.due_date ?? '9999')))
        notifsChanged()
        setAddDay(null)
        // Send it to their phone now rather than only on the day, when the
        // parent asked for it and is still looking at the screen. The weekly
        // flag on the row is what keeps it going after today.
        if (r.auto_send_to_child && data.action.id) sendToChild(data.action.id)
      }
    } catch { /* non blocking, the week still shows what is there */ }
  }

  // Saving an edit: the same fields the add takes, PATCHed onto the row so
  // it keeps its identity, history and sent to child state.
  const editFromSheet = async (id: string, r: NewReminder) => {
    try {
      const res = await fetch('/api/school/actions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, edit: r }),
      })
      const data = await res.json()
      if (data.ok) {
        // The server row leads, but runs_in_holidays rides on migration 182
        // and is not in the returned select, so the sheet's value fills it.
        setActions(list => list.map(x => x.id === id
          ? { ...x, ...(data.action ?? {}), title: r.title, kind: r.kind, due_date: r.due_date, due_time: r.due_time, recurs_weekday: r.recurs_weekday, auto_send_to_child: r.auto_send_to_child, runs_in_holidays: r.runs_in_holidays, cleared_on: null }
          : x))
        setClearedIds(s => { const n = new Set(s); n.delete(id); return n })
        notifsChanged()
        setEditItem(null)
      }
    } catch { /* non blocking, the sheet stays open to try again */ }
  }

  const sendToChild = async (id: string) => {
    setSendingId(id)
    try {
      const res = await fetch('/api/school/actions/send-to-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.ok) {
        setActions(a => a.map(x => x.id === id ? { ...x, sent_to_child: true } : x))
      }
    } catch { /* non blocking */ } finally { setSendingId(null) }
  }

  const sendTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/school/remind/test', { method: 'POST' })
      const data = await res.json()
      if (data.sent > 0) {
        // Push is per device, so say plainly where it actually landed. If no
        // phone (Apple push) is subscribed, the ping went to another device
        // like the laptop you set it up on, and the phone in your hand needs
        // turning on before it will ever buzz.
        const where = (data.platforms ?? []).join(' and ')
        const landed = where ? `Sent to ${where}.` : 'Sent.'
        // The test used to also buzz the child and say so here. Justin, 6
        // August: "no need for test to go to child." It is the parent asking
        // whether the parent's phone works, so the child is left out of it
        // and there is nothing to report about them.
        const phoneHint = data.hasApple
          ? ''
          : ' If the phone in your hand stayed quiet, that phone is not turned on yet. Open this page on the phone itself, tap Turn on check ins, and on iPhone add it to your home screen first, then test again.'
        setTestResult(landed + phoneHint)
      } else if (data.reason) {
        setTestResult('No device is set up to get these yet. On the phone you want the reminders on, open this page, tap Turn on check ins, then test again. On iPhone, add the app to your home screen first, then turn them on.')
      } else if (data.allFailed) {
        // The case that used to read as "something went wrong". There ARE
        // devices on file, every one of them refused, and that is almost
        // always a setup fact rather than a fault: notifications were turned
        // off again, the browser data was cleared, or an iPhone home screen
        // app was deleted and re added, which quietly replaces the endpoint.
        // A parent can fix all three in about twenty seconds once told.
        const cleaned = data.removed > 0
          ? ` We have cleared ${data.removed === 1 ? 'the one device' : `the ${data.removed} devices`} that had gone for good, so turning them on again on this phone will stick.`
          : ''
        setTestResult(
          `Nothing accepted it. We have ${data.devices === 1 ? 'one device' : `${data.devices} devices`} on file for you and every one refused, which usually means notifications got turned off again, or this app was removed from the home screen and added back.${cleaned} On the phone you want them on, tap Turn on check ins, then test again.`
        )
      } else if (data.errors?.length) {
        // Anything else the push service said. Shown rather than swallowed,
        // because the code is the only thing that tells us which of us has
        // the problem.
        setTestResult(`The push service refused (code ${data.errors[0]})${data.details?.[0] ? `: ${data.details[0]}` : ''}. Tell Claude this whole message.`)
      } else {
        setTestResult(data.error ?? 'Something went wrong, try again.')
      }
    } catch {
      setTestResult('Could not reach the server, try again.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '16px', padding: '20px 22px', marginBottom: '20px',
    }}>
      {/* A calm pulse, only ever on the last hour and overdue cards, so the
          card gets your eye exactly when the time is close. */}
      <style>{`@keyframes gcSchoolPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(229,72,77,0.0) } 50% { box-shadow: 0 0 0 4px rgba(229,72,77,0.12) } }`}</style>
      {/* THE MANUAL IS NOT THE CARD.
          Justin, 11 August 2026, with a screenshot of this filling a phone:
          "on the home page things like this need to be shrunk behind an
          expandable tab, otherwise it makes the home page messy. Use this
          principle for each page, do not have the whole thing all down each
          page, just a one line explaining what it is and the ability to expand
          or reduce."

          Two separate things were on screen every single time a parent opened
          the app: the section's own heading, which the fold above it on Home
          already said, and a four line explanation of what the feature is,
          which is onboarding copy that stops being news after the first read.
          Neither was wrong. Both were permanent.

          So the heading goes when something else is already saying it, and the
          explanation goes behind a line that a parent can open on the day they
          want it and never again. What is left on screen is what is actually
          due, which is the only part that changes. */}
      {!compact && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
            From school
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Things you need to know
          </div>
        </div>
      )}
      {/* FORWARDED EMAILS, PARKED (12 August 2026)
          Justin: "the forward email part is parked for now, this is just the
          alert calendar for school tasks."

          So the explainer and its Send a test button come off the card. The
          whole forwarding pipeline is untouched behind them: the inbound
          address, its signing secret, the parser and /api/school/remind all
          still work, and any action that arrives by email still lands in this
          list exactly as before. What has gone is the card ADVERTISING a way in
          that is not being pushed yet.

          One flag, so unparking is one word rather than an archaeology exercise.
          The test button lives on in git and comes back with it. */}
      {SCHOOL_EMAIL_FORWARDING_LIVE && (
        <FoldSection label="How this works" value="Forwarded emails">
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Kit days, payments and deadlines DiGi pulls from your forwarded school emails, plus anything you add. They show here every time you open the app, and as a reminder on your phone if notifications are on.
          </p>
          <button
            onClick={sendTest}
            disabled={testing}
            style={{
              marginTop: '12px',
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '100px',
              padding: '8px 16px', cursor: testing ? 'wait' : 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink-soft)',
            }}
          >
            {testing ? 'Sending...' : 'Send a test'}
          </button>
          {testResult && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 0' }}>
              {testResult}
            </p>
          )}
        </FoldSection>
      )}
      {/* Actions row: wraps cleanly on a phone and a laptop. */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {/* One way to add a reminder, not two. This used to toggle a separate
            inline form with its own name field, its own weekday picker and its
            own send to child checkbox, sitting below the week that also had an
            Add on every day. Two forms for one job, and the one a parent
            actually reached for was the one that looked like it did nothing.
            Both now open the same sheet; this one starts on today. */}
        <button
          onClick={() => setAddDay({ dateIso: todayIso(), dow: new Date().getDay() })}
          style={{
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '100px', padding: '8px 16px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--terracotta-dark)',
          }}
        >
          + Add reminder
        </button>
      </div>

      {/* THE WEEK, BEHIND A LINE THAT STILL CARRIES ITS ANSWER.
          The grid is genuinely useful, and it is also seven rows of mostly
          empty days that a parent scrolls past to reach the thing that is
          actually due. Folded, the row still says how many are due, so nothing
          is lost but the height. That is the rule FoldSection was built on:
          you lose the detail, never the answer. */}
      {/* THE WEEK, PLAINLY, WITH NO FOLD IN FRONT OF IT.
          Justin, 12 August 2026: "the from school has completely lost the new
          calendar system we built, please get it back."
          It had not been deleted. It was behind a fold that started closed,
          inside Home's own fold that also starts closed, so the grid was two
          taps and a scroll from the screen a parent opens most. The old
          reasoning (seven rows of mostly empty days between a parent and the
          thing actually due) is sound in isolation and wrong in context: that
          is not a quieter calendar, it is a hidden one.
          The wrapper is gone rather than just defaulted open, because SchoolWeek
          already draws its own header with the week range, the count and the
          arrows. Keeping both meant the card said "This week" twice and quoted
          two different numbers, the fold counting what is due today and the grid
          counting the week. If the height becomes a problem again the fix is to
          put the due lists above the grid, not to fold it away. */}
      <SchoolWeek
        actions={actions}
        nowMs={nowMs}
        weekOffset={weekOffset}
        onWeek={setWeekOffset}
        clearedIds={clearedIds}
        onClear={a => { if (a.recurs_weekday != null) clearForToday(a.id); else settle(a.id, 'done') }}
        onDelete={id => settle(id, 'dismissed')}
        // Justin, 7 August 2026: "when you click add it goes nowhere really, it
        // should step you through adding a reminder."
        //
        // It used to open the form below the week and quietly set the day on
        // it. On a phone that form is entirely below the fold, so the tap
        // looked like nothing happened and the day it had set was invisible. A
        // sheet over the week instead, which asks what it is, whether it is one
        // off or every week, and whether the child's phone gets it too.
        onAdd={(dateIso, dow) => setAddDay({ dateIso, dow })}
      />

      {addDay && (
        <SchoolAddSheet
          dateIso={addDay.dateIso}
          dow={addDay.dow}
          dayLabel={dayLabel(addDay.dateIso, addDay.dow)}
          childName={childName}
          onCancel={() => setAddDay(null)}
          onAdd={addFromSheet}
        />
      )}

      {/* The same sheet, editing. The day it opens on is the reminder's own:
          a one off's date, a routine's weekday mapped onto this week. */}
      {editItem && (() => {
        const e = editItem
        const isRoutine = e.recurs_weekday != null
        const dateIso = !isRoutine && e.due_date ? e.due_date : todayIso()
        const dow = isRoutine ? (e.recurs_weekday as number) : new Date(`${dateIso}T00:00:00`).getDay()
        return (
          <SchoolAddSheet
            dateIso={dateIso}
            dow={dow}
            dayLabel={isRoutine ? `Every ${WEEKDAY_NAME[dow]}` : dayLabel(dateIso, dow)}
            childName={childName}
            initial={{
              title: e.title,
              kind: e.kind,
              repeats: isRoutine,
              time: e.due_time ? String(e.due_time).slice(0, 5) : null,
              toChild: isRoutine ? Boolean(e.auto_send_to_child) : Boolean(e.sent_to_child),
              runsInHolidays: e.runs_in_holidays === true,
            }}
            onCancel={() => setEditItem(null)}
            onAdd={r => editFromSheet(e.id, r)}
          />
        )
      })()}


      {/* The drawer. Only offered when there is something in it. */}
      {(recurring.length > 0 || oneOff.length > 0) && (
        <button
          type="button"
          onClick={() => setShowList(v => !v)}
          style={{
            width: '100%', marginBottom: showList ? '14px' : '2px', padding: '11px 14px',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
          }}
        >
          <span>{showList ? 'Hide the full list' : 'Open the full list'}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
            {showList ? '▲' : `▼  ${recurring.length + oneOff.length}`}
          </span>
        </button>
      )}

      {/* Weekly routines: permanent, never done or dismissed the way a one off is */}
      {showList && recurring.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Every week
          </div>
              {/* Wraps, because it could not. Every child here but the title
                  is flexShrink 0 and the row had no wrap, so a routine with a
                  day pill, a send to child note, a cleared mark and a delete
                  ran straight off the right edge of a phone with Delete
                  hanging outside the card. Visible in Justin's screenshot:
                  "Cleared for today ✓  Delete" with the word cut in half.
                  The title takes minWidth 0 so it is the thing that gives
                  first, and the controls drop to a second line rather than
                  off the screen. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recurring.map(a => {
              // On hold through the school holidays: a school time routine
              // rests, says so calmly, and never counts down to tomorrow.
              // This is the parent's view of the exact fault Justin caught on
              // Teo's phone, Show and tell firing red mid August.
              const held = nowMs != null && isHeldForHolidays(
                { recurs_weekday: a.recurs_weekday, runs_in_holidays: a.runs_in_holidays },
                new Date(nowMs), region,
              )
              return (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                flexWrap: 'wrap',
                borderRadius: '12px', background: held ? 'var(--cream)' : 'var(--tint-sage)', border: '1px solid var(--border)',
                opacity: held ? 0.75 : 1,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 9px', flexShrink: 0,
                }}>
                  {WEEKDAY_NAME[a.recurs_weekday ?? 0]}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
                  {a.title}
                  {/* Whose routine. Justin, 19 August 2026: "the parent can see
                      the name of the child in the reminder." */}
                  {a.child_name && (
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}> · {a.child_name}</span>
                  )}
                </span>
                {/* School time or home life, always visible so the two kinds
                    of routine can be told apart at a glance. */}
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: 'var(--ink-soft)', background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '100px', padding: '3px 9px', flexShrink: 0,
                }}>
                  {a.runs_in_holidays ? '🏖️ holidays too' : '🏫 school time'}
                </span>
                {a.added_by === 'child' && <AddedByChild name={a.added_by_child_name} />}
                {held ? (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                    color: 'var(--ink-muted)', background: '#fff', border: '1px solid var(--border)',
                    borderRadius: '100px', padding: '3px 9px', flexShrink: 0,
                  }}>
                    ⛱️ on hold until school is back
                  </span>
                ) : a.recurs_weekday === tomorrowWeekday && !clearedIds.has(a.id) && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'var(--terracotta-lt)', color: 'var(--terracotta-dark)', border: '1px solid var(--terracotta)',
                    borderRadius: '100px', padding: '3px 9px', flexShrink: 0,
                  }}>
                    Tomorrow
                  </span>
                )}
                {a.auto_send_to_child && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', flexShrink: 0 }}>
                    → {childName ?? 'them'} weekly
                  </span>
                )}
                {/* A routine can be cleared just for today: it stays in this
                    list for next week and only steps back from today's
                    reminders (and the notifications bell on its day). Delete
                    ends it for good, Edit fixes it in place. */}
                {!held && (clearedIds.has(a.id) ? (
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>Cleared for today ✓</span>
                ) : (
                  <button
                    onClick={() => clearForToday(a.id)}
                    style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '100px', padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--terracotta-dark)', flexShrink: 0 }}
                  >
                    Clear for today ✓
                  </button>
                ))}
                <button
                  onClick={() => setEditItem(a)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--terracotta-dark)', flexShrink: 0, padding: 0 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => settle(a.id, 'dismissed')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', flexShrink: 0 }}
                >
                  Delete
                </button>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {oneOff.length === 0 ? (
        // The empty state belongs to the whole card, not to the drawer, so it
        // shows whether or not the list is open.
        recurring.length === 0 && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            Nothing open right now. Forward a school email, or add a reminder by hand above.
          </p>
        )
      ) : showList && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {oneOff.map(a => {
            const kindMeta = KIND_STYLE[a.kind] ?? KIND_STYLE.notice
            const due = dueInfo(a.due_date, a.due_time, nowMs)
            const hot = due?.tone === 'urgent' || due?.tone === 'overdue'
            const dueColor = due?.tone === 'overdue' || due?.tone === 'urgent' ? 'var(--danger)'
              : due?.tone === 'today' ? 'var(--terracotta-dark)' : 'var(--ink-muted)'
            return (
              <div key={a.id} style={{
                padding: '12px 14px', borderRadius: '12px',
                background: hot ? 'var(--danger-bg)' : 'var(--cream)',
                border: hot ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                animation: hot ? 'gcSchoolPulse 1.6s ease-in-out infinite' : undefined,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: kindMeta.bg, color: kindMeta.color,
                    padding: '2px 8px', borderRadius: '100px',
                  }}>
                    {kindMeta.label}
                  </span>
                  {a.added_by === 'child' && <AddedByChild name={a.added_by_child_name} />}
                  {due && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: dueColor,
                    }}>
                      {hot && <span style={{ width: 6, height: 6, borderRadius: '100px', background: 'var(--danger)', display: 'inline-block' }} />}
                      {due.text}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: a.detail ? '3px' : '8px' }}>
                  {a.title}
                  {a.child_name && (
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}> · {a.child_name}</span>
                  )}
                </div>
                {a.detail && (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '8px' }}>
                    {a.detail}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => settle(a.id, 'done')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', padding: 0 }}
                  >
                    Got it, clear ✓
                  </button>
                  <button
                    onClick={() => settle(a.id, 'dismissed')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', padding: 0 }}
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => setEditItem(a)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', padding: 0 }}
                  >
                    ✏️ Edit
                  </button>
                  <a
                    href={`/api/school/${a.id}/ics`}
                    title="Add this to your phone calendar"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)', textDecoration: 'none' }}
                  >
                    📅 Calendar
                  </a>
                  {a.sent_to_child ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginLeft: 'auto' }}>
                      Sent to {childName ?? 'them'} ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => sendToChild(a.id)}
                      disabled={sendingId === a.id}
                      style={{
                        marginLeft: 'auto', background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)',
                        borderRadius: '100px', padding: '5px 12px', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)',
                      }}
                    >
                      {sendingId === a.id ? 'Sending...' : `Send to ${childName ?? 'them'} ⭐`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
