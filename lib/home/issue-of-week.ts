import type { createClient } from '@/lib/supabase/server'
import type { AgeBand } from '@/lib/content/stages'
import { issuesForBand, type DeviceIssue } from '@/lib/content/device-issues'
import { countsTowardPathway } from '@/lib/pathway/script-status'

// The fix of the week: the one device problem a family should solve next,
// for their child's age, with the exact script that solves it.
//
// Justin, 13 September 2026: the daily loop must "really provide success help
// for parents", the top issues by age "all solved in our service and
// prevented". The bank (lib/content/device-issues.ts) ranks them per band;
// this picks the first the family has not yet acted on, and hands Home its
// script. Acted on means the script was read to the end or marked used
// (lib/pathway/script-status.ts), the same reading the passport uses, so a
// fix is never re offered to a family who already did it.
//
// When every issue in the band has been acted on, the week's fix rotates
// through them as a reminder, marked as kept up rather than to do.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type IssueOfWeek = {
  issue: DeviceIssue
  band: AgeBand
  /** The script to open. Null only when none of the issue's scripts are in the table yet. */
  script: { sort_order: number; title: string; is_free: boolean } | null
  /** Every script for this issue already read or used. */
  kept: boolean
  href: string
}

/** Pure: which issue and which script, from the rows. */
export function pickIssue(
  band: AgeBand,
  scripts: { sort_order: number; title: string; is_free: boolean }[],
  acted: Set<number>,
  weekIndex: number,
): Omit<IssueOfWeek, 'href'> | null {
  const issues = issuesForBand(band)
  if (issues.length === 0) return null
  const byTitle = new Map(scripts.map(s => [s.title, s]))
  for (const issue of issues) {
    const rows = issue.proof.scripts.map(t => byTitle.get(t)).filter((r): r is NonNullable<typeof r> => !!r)
    const open = rows.find(r => !acted.has(r.sort_order))
    if (open) return { issue, band, script: open, kept: false }
  }
  const issue = issues[Math.abs(weekIndex) % issues.length]
  const first = issue.proof.scripts.map(t => byTitle.get(t)).find(Boolean) ?? null
  return { issue, band, script: first ?? null, kept: true }
}

export async function pickIssueOfWeek(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  band: AgeBand,
  isPaid: boolean,
): Promise<IssueOfWeek | null> {
  const titles = [...new Set(issuesForBand(band).flatMap(i => i.proof.scripts))]
  if (titles.length === 0) return null
  // Both reads leave together. The completions read used to wait for the
  // scripts read so it could filter to those sort orders in the query; it now
  // reads the family's completions (a few dozen rows at most) and the filter
  // happens here, which is the same set and one round trip fewer on Home.
  let q = supabase.from('script_completions').select('script_sort_order, status').eq('user_id', userId)
  if (childId) q = q.or(`child_id.eq.${childId},child_id.is.null`)
  const [{ data: scripts }, { data: done }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title, is_free').in('title', titles),
    q,
  ])
  const rows = (scripts ?? []) as { sort_order: number; title: string; is_free: boolean }[]
  if (rows.length === 0) return null
  const wanted = new Set(rows.map(r => r.sort_order))
  const acted = new Set<number>()
  for (const d of (done ?? []) as { script_sort_order: number; status: string | null }[]) {
    if (wanted.has(d.script_sort_order) && countsTowardPathway(d.status)) acted.add(d.script_sort_order)
  }
  const weekIndex = Math.floor(Date.now() / (7 * 86400000))
  const pick = pickIssue(band, rows, acted, weekIndex)
  if (!pick) return null
  const href = pick.script && (isPaid || pick.script.is_free)
    ? `/dashboard/scripts/${pick.script.sort_order}?from=home`
    : pick.issue.proof.href
  return { ...pick, href }
}
