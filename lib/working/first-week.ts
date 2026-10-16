import type { SupabaseClient } from '@supabase/supabase-js'
import type { Movement } from '@/lib/working/movement'

// THE FIRST WEEK HAS TO PROVE IT.
//
// Review board, 13 October 2026 (first-week-proves-value, lenses value above
// AI and keeps coming back). Movement needs two check ins before it can show
// anything, so for most of a new family's first week What is working said
// "this is where your answer will be" and nothing else. A parent deciding in
// week one whether this is better than asking a chatbot was being asked to
// take the answer on trust.
//
// So inside the first fortnight the product says four true things, each built
// from rows that already exist, nothing invented:
//
//   1. The second look is prompted. The road's check in rung is renamed
//      "Your second look" on a day when one of this child's worries has
//      exactly one number from an earlier day (lib/pathway/daily-tasks.ts).
//   2. What is working says what is waiting, as a feature: each worry with one
//      look, the word it was given, and that the second look is what turns a
//      day into a direction.
//   3. One line compares now with day one, in the five face words, the moment
//      any worry has two looks.
//   4. The child's first visible win, from their own side of the app: a job
//      that earned stars, a finished five a day or a passed lesson. Before
//      there is one, the line says the quickest way to the first.
//
// Never a composite, never a cause. Same rules as movement.ts.

/** How long a family counts as new: a week to land it, a week to see it. */
export const NEW_FAMILY_DAYS = 14

const DAY = 86_400_000

/** True while the account is inside its first fortnight. */
export function isNewFamily(createdAt: string | null | undefined, now: Date = new Date()): boolean {
  if (!createdAt) return false
  const t = new Date(createdAt).getTime()
  if (!Number.isFinite(t)) return false
  return now.getTime() - t < NEW_FAMILY_DAYS * DAY
}

// The five face words, lower case for the middle of a sentence. The same bands
// as scoreWord in components/daily/ConcernCheckIn.tsx (a client file, so not
// importable here); scripts/check-concern-loop.mjs fails if they drift.
export function lookWord(n: number): string {
  if (n <= 2) return 'really tough'
  if (n <= 4) return 'hard going'
  if (n <= 6) return 'up and down'
  if (n <= 8) return 'getting there'
  return 'going great'
}

/** The worries with exactly one look: the ones the second look is waiting on. */
export function waitingForSecondLook(movements: Movement[]): Movement[] {
  return movements.filter(m => m.points.length === 1 && m.status !== 'resolved')
}

/**
 * Day one against now, for one worry, in the parent's own words.
 *
 * Day one is the first number ever given for that worry, not a look back
 * answer, because the line is about the first week and nothing was resolved
 * in it. The worry that climbed most leads; with no climb, the first one with
 * two looks, said as it is ("still hard going"), never dressed up.
 */
export function dayOneLine(movements: Movement[]): string | null {
  const two = movements.filter(m => m.points.length >= 2)
  if (two.length === 0) return null
  const delta = (m: Movement) => m.points[m.points.length - 1].score - m.points[0].score
  const lead = [...two].sort((a, b) => delta(b) - delta(a))[0]
  const first = lookWord(lead.points[0].score)
  const now = lookWord(lead.points[lead.points.length - 1].score)
  const who = lead.childName ? ` for ${lead.childName}` : ''
  if (first === now) return `On day one, ${lead.label}${who} was ${first}. It is still ${now}, and now you can see it.`
  return `On day one, ${lead.label}${who} was ${first}. Now it is ${now}.`
}

/**
 * Is a second look due today for this child: a live worry with exactly one
 * number, and that number from an earlier day. Pure, so the road and the
 * guard read the same rule.
 */
export function secondLookDue(
  rows: { concern_id: string; created_at: string; child_id: string | null }[],
  childId: string | null,
  todayStart: string,
): boolean {
  // Compared as instants, not strings: Postgres writes +00:00, JS writes Z.
  const start = new Date(todayStart).getTime()
  const looks = new Map<string, { n: number; first: number }>()
  for (const r of rows) {
    if ((r.child_id ?? null) !== (childId ?? null)) continue
    const at = new Date(r.created_at).getTime()
    const seen = looks.get(r.concern_id)
    if (seen) { seen.n += 1; seen.first = Math.min(seen.first, at) }
    else looks.set(r.concern_id, { n: 1, first: at })
  }
  return [...looks.values()].some(l => l.n === 1 && l.first < start)
}

export type FirstWin = {
  childName: string
  /** One plain sentence, past tense, said as it happened. */
  line: string
  at: string
}

type WinRow = { child_id: string | null; at: string; what: string }

/** The earliest win across the family's children, or null before the first. */
export function firstWin(rows: WinRow[], names: Map<string, string>): FirstWin | null {
  const real = rows.filter(r => r.child_id && r.at).sort((a, b) => a.at.localeCompare(b.at))
  const w = real[0]
  if (!w) return null
  const name = names.get(w.child_id as string) || 'Your child'
  const day = new Date(w.at).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' })
  return { childName: name, line: `${name} ${w.what} on ${day}.`, at: w.at }
}

type Client = Pick<SupabaseClient, 'from'>

/**
 * The child's side, read for the first win: an approved job, a finished five
 * a day, a lesson passed in their own app. Every read fails soft to nothing,
 * because a missing table must never take What is working down with it.
 */
export async function readFirstWin(supabase: Client, userId: string): Promise<{ win: FirstWin | null; childName: string | null; childId: string | null }> {
  const [kidsRes, ticksRes, daysRes, lessonsRes] = await Promise.all([
    supabase.from('children').select('id, name').eq('parent_id', userId),
    supabase.from('quest_ticks').select('child_id, approved_at, created_at, family_quests(title)')
      .eq('user_id', userId).eq('status', 'approved').order('created_at', { ascending: true }).limit(5),
    supabase.from('kid_days').select('child_id, completed_at')
      .eq('user_id', userId).not('completed_at', 'is', null).order('completed_at', { ascending: true }).limit(5),
    supabase.from('lesson_completions').select('child_id, completed_at')
      .eq('user_id', userId).eq('passed', true).not('child_id', 'is', null).order('completed_at', { ascending: true }).limit(5),
  ])
  const kids = ((kidsRes.data ?? []) as { id: string; name: string | null }[])
  const names = new Map(kids.filter(k => k.name && k.name !== 'Your child').map(k => [k.id, k.name as string]))
  const rows: WinRow[] = []
  for (const t of (ticksRes.data ?? []) as { child_id: string | null; approved_at: string | null; created_at: string; family_quests?: { title?: string | null } | { title?: string | null }[] | null }[]) {
    const q = Array.isArray(t.family_quests) ? t.family_quests[0] : t.family_quests
    const title = q?.title?.trim()
    rows.push({ child_id: t.child_id, at: t.approved_at ?? t.created_at, what: title ? `earned stars for ${title}` : 'earned their first stars' })
  }
  for (const d of (daysRes.data ?? []) as { child_id: string | null; completed_at: string }[]) {
    rows.push({ child_id: d.child_id, at: d.completed_at, what: 'finished the five a day' })
  }
  for (const l of (lessonsRes.data ?? []) as { child_id: string | null; completed_at: string }[]) {
    rows.push({ child_id: l.child_id, at: l.completed_at, what: 'passed a lesson in their own app' })
  }
  const first = kids[0] ?? null
  return {
    win: firstWin(rows, names),
    childName: first ? (names.get(first.id) ?? null) : null,
    childId: first?.id ?? null,
  }
}
