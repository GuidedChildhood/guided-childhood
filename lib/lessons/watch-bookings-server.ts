// Watch together booking: the database part (migration 400). Service role
// only, like the table itself. Every caller has already decided whose child
// this is (a parent session checked against children.parent_id, or the kid
// link's token), so these helpers take ids they can trust.
//
// TOLERANT ON PURPOSE. If this code reaches production before migration 400 is
// applied, the table does not exist yet. Every read here answers "no booking"
// on any error, logged by name, so the lesson pages, the child's page and Home
// carry on exactly as they did. A missing booking is never a broken page.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isLiveForChild, isMissed, isSoonForParent, whenLabel, type WatchBooking } from '@/lib/lessons/watch-bookings'

const COLS = 'id, parent_id, child_id, lesson_code, starts_at, status, buzz_child, reminded_at, child_pinged_at, watched_at'

type Admin = Pick<SupabaseClient, 'from'>

/** The live booking for one child and one film, if there is one. */
export async function bookingFor(admin: Admin, childId: string, lessonCode: string): Promise<WatchBooking | null> {
  const { data, error } = await admin.from('watch_bookings').select(COLS)
    .eq('child_id', childId).eq('lesson_code', lessonCode).eq('status', 'booked').maybeSingle()
  if (error) { console.error('watch_bookings read failed:', error.message); return null }
  return (data as WatchBooking | null) ?? null
}

/** The booking leading this child's page now, the earliest if two overlap. */
export async function liveBookingForChild(admin: Admin, childId: string, now: Date = new Date()): Promise<WatchBooking | null> {
  const { data, error } = await admin.from('watch_bookings').select(COLS)
    .eq('child_id', childId).eq('status', 'booked').lte('starts_at', now.toISOString())
    .order('starts_at', { ascending: true }).limit(5)
  if (error) { console.error('watch_bookings read failed:', error.message); return null }
  return ((data ?? []) as WatchBooking[]).find(b => isLiveForChild(b, now)) ?? null
}

/**
 * What Home shows the parent: a booking in the next hour (or happening now),
 * else one whose day ended unwatched, so they can pick a new time.
 */
export async function homeBookingForParent(admin: Admin, parentId: string, now: Date = new Date()): Promise<{ booking: WatchBooking; state: 'soon' | 'missed' } | null> {
  const since = new Date(now.getTime() - 3 * 86400000).toISOString()
  const until = new Date(now.getTime() + 2 * 3600000).toISOString()
  const { data, error } = await admin.from('watch_bookings').select(COLS)
    .eq('parent_id', parentId).in('status', ['booked', 'missed'])
    .gte('starts_at', since).lte('starts_at', until)
    .order('starts_at', { ascending: true })
  if (error) { console.error('watch_bookings read failed:', error.message); return null }
  const rows = (data ?? []) as WatchBooking[]
  const soon = rows.find(b => isSoonForParent(b, now))
  if (soon) return { booking: soon, state: 'soon' }
  // Missed: the cron marks the row missed after its day; until the cron has
  // run, a booked row from an earlier day reads the same. Only yesterday's,
  // so the line is there the next day and then goes, never a pile of guilt.
  const yesterday = rows.filter(b => b.status === 'missed' || isMissed(b, now))
    .filter(b => now.getTime() - new Date(b.starts_at).getTime() < 2 * 86400000)
    .pop()
  return yesterday ? { booking: yesterday, state: 'missed' } : null
}

/** Marks today's booking for this child and film as watched, if there is one. */
export async function markWatched(admin: Admin, childId: string, lessonCode: string, now: Date = new Date()): Promise<void> {
  const { error } = await admin.from('watch_bookings')
    .update({ status: 'watched', watched_at: now.toISOString(), updated_at: now.toISOString() })
    .eq('child_id', childId).eq('lesson_code', lessonCode).eq('status', 'booked')
    .lte('starts_at', new Date(now.getTime() + 2 * 3600000).toISOString())
  if (error) console.error('watch_bookings watched update failed:', error.message)
}

/** The film's short after prompt (migration 400), or null. Tolerant like the rest. */
export async function afterPromptFor(admin: Admin, lessonCode: string): Promise<string | null> {
  const { data, error } = await admin.from('parent_lessons').select('after_prompt').eq('lesson_code', lessonCode).maybeSingle()
  if (error) return null
  return ((data as { after_prompt?: string | null } | null)?.after_prompt ?? null) || null
}

/** Everything Home's Watch together card needs, in words, or null. */
export async function homeCardFor(admin: Admin, parentId: string, now: Date = new Date()): Promise<{
  state: 'soon' | 'missed'; title: string; childName: string | null; when: string; href: string
} | null> {
  const found = await homeBookingForParent(admin, parentId, now)
  if (!found) return null
  const { booking, state } = found
  const [lessonRes, childRes] = await Promise.all([
    admin.from('parent_lessons').select('title').eq('lesson_code', booking.lesson_code).maybeSingle(),
    admin.from('children').select('name').eq('id', booking.child_id).maybeSingle(),
  ])
  const title = (lessonRes.data as { title?: string } | null)?.title
  if (!title) return null
  return {
    state,
    title,
    childName: (childRes.data as { name?: string | null } | null)?.name ?? null,
    when: whenLabel(booking.starts_at, now),
    href: `/dashboard/lessons/together/${booking.lesson_code}?child=${booking.child_id}`,
  }
}
