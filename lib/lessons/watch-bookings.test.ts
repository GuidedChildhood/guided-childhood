// Watch together booking (migration 400): the rules that must stay true, run
// against the real code. `npm run watch-bookings-test`, in CI.
//
// Two kinds of check. The clock rules run the real functions at fixed instants
// in winter (GMT) and summer (BST). The promises to families are read from the
// source, because they are about what the code never does: buzz a child at
// night, show a child a booking early, put a child's name in a calendar, or
// count a reminder as a nudge.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  londonToUtc, suggestedSlots, checkStartsAt, isLiveForChild, reminderDue, isMissed,
  isSoonForParent, calendarFile, whenLabel,
} from './watch-bookings'
import { londonNow } from '@/lib/time/london'

const strip = (f: string) => readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')

test('London wall clock to UTC is right in winter and in summer', () => {
  assert.equal(londonToUtc('2026-12-03', 17, 0).toISOString(), '2026-12-03T17:00:00.000Z')
  assert.equal(londonToUtc('2027-07-03', 17, 0).toISOString(), '2027-07-03T16:00:00.000Z')
  // The Sunday the clocks go back, at tea time.
  assert.equal(londonToUtc('2026-10-25', 17, 0).toISOString(), '2026-10-25T17:00:00.000Z')
})

test('three suggestions, each at least half an hour away, on the right days', () => {
  const now = new Date('2026-11-18T15:45:00Z') // Wednesday 15:45 London
  const slots = suggestedSlots(now)
  assert.equal(slots.length, 3)
  for (const s of slots) assert.ok(new Date(s.startsAt).getTime() >= now.getTime() + 30 * 60000, s.label)
  const [school, tea, weekend] = slots.map(s => londonNow(new Date(s.startsAt)))
  assert.equal(school.hour, 16); assert.equal(school.dateStr, '2026-11-19') // 16:00 today is too soon
  assert.equal(tea.hour, 17); assert.equal(tea.dateStr, '2026-11-18')
  assert.equal(weekend.weekday, 6); assert.equal(weekend.hour, 10)
})

test('a booking is accepted only on the quarter hour, not in the past, within two weeks', () => {
  const now = new Date('2026-11-18T12:00:00Z')
  assert.equal(checkStartsAt('2026-11-18T17:00:00.000Z', now).ok, true)
  assert.equal(checkStartsAt('2026-11-18T17:07:00.000Z', now).ok, false)
  assert.equal(checkStartsAt('2026-11-18T10:00:00.000Z', now).ok, false)
  assert.equal(checkStartsAt('2026-12-10T17:00:00.000Z', now).ok, false)
  assert.equal(checkStartsAt(42, now).ok, false)
})

test('the child never sees a booking before its time, and not after its day', () => {
  const b = { status: 'booked' as const, starts_at: '2026-11-18T17:00:00.000Z' }
  assert.equal(isLiveForChild(b, new Date('2026-11-18T16:59:00Z')), false)
  assert.equal(isLiveForChild(b, new Date('2026-11-18T17:00:00Z')), true)
  assert.equal(isLiveForChild(b, new Date('2026-11-18T23:30:00Z')), true)
  assert.equal(isLiveForChild(b, new Date('2026-11-19T00:01:00Z')), false)
  assert.equal(isLiveForChild({ ...b, status: 'watched' }, new Date('2026-11-18T17:30:00Z')), false)
  assert.equal(isLiveForChild({ ...b, status: 'cancelled' }, new Date('2026-11-18T17:30:00Z')), false)
})

test('the reminder is due once, from fifteen minutes before', () => {
  const b = { status: 'booked' as const, starts_at: '2026-11-18T17:00:00.000Z', reminded_at: null }
  assert.equal(reminderDue(b, new Date('2026-11-18T16:44:00Z')), false)
  assert.equal(reminderDue(b, new Date('2026-11-18T16:45:00Z')), true)
  assert.equal(reminderDue({ ...b, reminded_at: '2026-11-18T16:45:00Z' }, new Date('2026-11-18T16:50:00Z')), false)
})

test('missed only after the London day, and Home shows it soon only within the hour', () => {
  const b = { status: 'booked' as const, starts_at: '2026-11-18T17:00:00.000Z' }
  assert.equal(isMissed(b, new Date('2026-11-18T23:59:00Z')), false)
  assert.equal(isMissed(b, new Date('2026-11-19T00:00:00Z')), true)
  assert.equal(isSoonForParent(b, new Date('2026-11-18T15:59:00Z')), false)
  assert.equal(isSoonForParent(b, new Date('2026-11-18T16:00:00Z')), true)
})

test('the calendar file carries the film and the time, never a child', () => {
  const ics = calendarFile({ title: 'Screens go to bed first', startsAt: '2026-11-18T17:00:00.000Z', uid: 'abc' })
  assert.match(ics, /SUMMARY:Watch together: Screens go to bed first/)
  assert.match(ics, /DTSTART:20261118T170000Z/)
  assert.match(ics, /TRIGGER:-PT15M/)
  const src = strip('lib/lessons/watch-bookings.ts')
  const fn = src.slice(src.indexOf('export function calendarFile'))
  assert.ok(!/child(?!hood)/i.test(fn.slice(0, fn.indexOf('].join'))), 'calendarFile must not take or write a child')
  assert.equal(whenLabel('2026-11-18T17:00:00.000Z', new Date('2026-11-18T09:00:00Z')), 'today at 5pm')
})

test('the cron never buzzes a child in quiet hours, sends no email and counts no nudge', () => {
  const cron = strip('app/api/cron/watch-bookings/route.ts')
  assert.match(cron, /if \(!b\.buzz_child \|\| inChildQuietHours\(now\)\) \{ skipped \+= 1; continue \}/)
  assert.match(cron, /pushToChild\(/, 'the child buzz goes through pushToChild, which holds quiet hours too')
  assert.ok(!/webpush/.test(cron), 'no direct web push to a child from this cron')
  assert.ok(!/sendEmail|lib\/email/.test(cron), 'no email: the one a week floor stays untouched')
  assert.ok(!/nudge:\s*true/.test(cron), 'the reminder is not a nudge')
  // Flag before send, so a slow push cannot fire twice.
  assert.match(cron, /\.is\('reminded_at', null\)\.select\('id'\)/)
  assert.match(cron, /\.is\('child_pinged_at', null\)\.select\('id'\)/)
})

test('the child page shows only a live booking, with fixed words', () => {
  const page = strip('app/k/[token]/page.tsx')
  assert.match(page, /liveBookingForChild\(supabase, link\.child_id\)/)
  assert.match(page, /l\.stage_id <= stageId/)
  const server = strip('lib/lessons/watch-bookings-server.ts')
  assert.match(server, /find\(b => isLiveForChild\(b, now\)\)/)
  const card = strip('components/kid/WatchTimeCard.tsx')
  const props = card.slice(card.indexOf('export type WatchTime'), card.indexOf('}', card.indexOf('export type WatchTime')))
  assert.deepEqual([...props.matchAll(/^\s+(\w+):/gm)].map(m => m[1]), ['code', 'title', 'posterUrl'])
})

test('a booking cannot be made for someone else\'s child or an older stage', () => {
  const api = strip('app/api/watch-bookings/route.ts')
  assert.match(api, /data\.parent_id !== parent/)
  assert.match(api, /Number\(lesson\.stage_id\) > childStage/)
})

test('migration 400 keeps the table to the server and cascades with the child', () => {
  const sql = readFileSync('supabase/migrations/400_watch_bookings.sql', 'utf8')
  assert.match(sql, /alter table public\.watch_bookings enable row level security/)
  assert.match(sql, /revoke all on public\.watch_bookings from anon, authenticated/)
  assert.match(sql, /child_id uuid not null references public\.children\(id\) on delete cascade/)
  assert.match(sql, /parent_id uuid not null references auth\.users\(id\) on delete cascade/)
  const table = sql.replace(/--[^\n]*/g, '').match(/create table if not exists public\.watch_bookings \(([\s\S]*?)\n\);/)?.[1] ?? ''
  assert.ok(table.length > 0, 'the table definition is found')
  assert.ok(!/\bnote\b|\bmessage\b|\blocation\b/i.test(table), 'no free text or location columns')
})
