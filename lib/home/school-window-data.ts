import type { createClient } from '@/lib/supabase/server'
import { isSchoolDay } from '@/lib/quests/job-time'
import { getFamilyRegion } from '@/lib/learning/region'
import { familyTargets, openWindow, windowCopy, bandGroup, type SchoolWindow, type WindowCopy } from '@/lib/home/school-window'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// What Home needs to draw the school day card, or null for a quiet Home.
//
// Null most of the day on purpose. The card is open for ninety minutes from
// the family's morning target and ninety from the afternoon one, on school
// days in their own calendar, and at no other time. A card that is always
// there is furniture; one that appears at the moment it is about is the pre
// empt Justin asked for.

export type SchoolWindowData = {
  window: SchoolWindow
  copy: WindowCopy
  childId: string | null
  childName: string | null
  /** The script's live number, for /dashboard/scripts/NUMBER, or null. */
  scriptSortOrder: number | null
  /** The daily_moments row "I tried it" schedules the week later question on. */
  momentId: string | null
  /** London date, so the card's dismiss is per day. */
  dateKey: string
}

// The deck card each window hands "I tried it" to, by live title. The follow
// up a week later then counts against the same card every other family uses
// for this moment, which is how getProvenSolutions learns what works.
const MOMENT_TITLE: Record<SchoolWindow, Record<'primary' | 'secondary', string>> = {
  morning: { primary: 'Morning TV battle', secondary: 'Phone before school' },
  home: { primary: 'The after school meltdown', secondary: 'Homework becomes a standoff' },
}

export async function getSchoolWindow(
  supabase: SupabaseClient,
  userId: string,
  child: { id: string; name: string | null; age_band: string | null } | null,
  nowMinutes: number,
  dateKey: string,
): Promise<SchoolWindowData | null> {
  try {
    const region = await getFamilyRegion(supabase, userId)
    if (!isSchoolDay(new Date(), region)) return null

    // The times, failing soft to the defaults until migration 362 has run.
    let kids: { school_start_minutes?: number | null; home_minutes?: number | null }[] = []
    const { data, error } = await supabase.from('children').select('school_start_minutes, home_minutes').eq('parent_id', userId)
    if (!error && data) kids = data as typeof kids
    const window = openWindow(nowMinutes, familyTargets(kids))
    if (!window) return null

    const group = bandGroup(child?.age_band)
    const copy = windowCopy(window, group, child?.name ?? null)
    const [scriptRes, momentRes] = await Promise.all([
      supabase.from('scripts').select('sort_order').eq('title', copy.scriptTitle).limit(1).maybeSingle(),
      supabase.from('daily_moments').select('id').eq('title', MOMENT_TITLE[window][group]).eq('active', true).limit(1).maybeSingle(),
    ])
    return {
      window,
      copy,
      childId: child?.id ?? null,
      childName: child?.name && child.name !== 'Your child' ? child.name : null,
      scriptSortOrder: typeof scriptRes.data?.sort_order === 'number' ? scriptRes.data.sort_order : null,
      momentId: (momentRes.data?.id as string | undefined) ?? null,
      dateKey,
    }
  } catch {
    return null
  }
}
