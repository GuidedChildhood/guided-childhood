import type { SupabaseClient } from '@supabase/supabase-js'
import { BAND_WORDS } from '@/lib/concerns/outcome'
import { knowledgeTopicFor } from '@/lib/digi/approaches'
import { APP_ORIGIN } from '@/lib/config/site'

// THE MOMENTUM BLOCK: successes, one nugget, why it works, and a line for the
// parent. Rides inside the emails a family already gets.
//
// Justin, 7 October 2026: "every now and again email the successes to keep
// momentum, motivated, and some info research on helping parents, top experts
// quotes and why our system works, all in digestible clever email form,
// automated, not too often, and how it benefits your child, and support
// parents with some nuggets on parents' time, don't get stressed around
// guilt, shouting, losing it, how to help support it."
//
// ── A BLOCK, NOT A NEW EMAIL ────────────────────────────────────────────────
//
// "Not too often" is already a property of the platform: sendEmail refuses a
// programme email inside six days of the last one (lib/email/floor.ts). A new
// fortnightly email would fight that floor and lose, and a parent who gets a
// second email in a week learns to skip both. So this is one block, added to
// the Sunday review and the monthly review, which already carry the family's
// own successes (the movement block and the what moved block). Those stay
// first, because a parent reads the first line. What this adds underneath:
//
//   1. ONE NUGGET, WITH ITS SOURCE. From expert_knowledge, which DiGi already
//      reads: every row carries a named source (142 of 142 on 7 October).
//      Matched to a worry the family actually has and the age of their
//      children, so it lands on their week rather than beside it. Evidence or
//      silence: a row without a source is never shown, and a week with no fit
//      shows nothing rather than something generic.
//   2. WHY IT WORKS, one sentence, from the five commitments in THE-STORY.md.
//      A registry, rotated by the week, so it is written once and never goes
//      stale. The same line reaches every family in a given week, which is
//      what a newsletter is.
//   3. THE LINE FOR THE PARENT. Guilt, shouting, losing it, their own time.
//      One sentence and one link, to the repair script where one exists in
//      the scripts table, which is where every script lives.
//
// Nothing here sends, logs or writes. It reads, and hands the template a
// block. The floor is untouched because the block cannot add a send, only
// ride one.

export type Nugget = { finding: string; source: string; url: string | null }

export type MomentumBlock = {
  nugget: Nugget | null
  why: { key: string; line: string }
  support: { key: string; line: string; cta: string; href: string }
}

/** A row of expert_knowledge, the four columns the picker needs. */
export type NuggetRow = {
  id: string
  source_name: string | null
  finding: string | null
  url: string | null
  topics: string[] | null
  age_bands: string[] | null
}

/** A finding longer than this is a paragraph, not a nugget. */
export const NUGGET_MAX_CHARS = 320

/** The band words by band number, one based, so a band indexes straight in. */
const WORD_BY_BAND: readonly string[] = ['', ...BAND_WORDS]

/** The band word in lower case, for a sentence: "hard going to going great". */
export function bandWordOf(band: number): string {
  const b = Math.min(BAND_WORDS.length, Math.max(1, Math.round(band)))
  return WORD_BY_BAND[b].toLowerCase()
}

// ── WHY IT WORKS ─────────────────────────────────────────────────────────────
//
// One commitment per line, in the words a parent would repeat at the school
// gate. Every claim here is a stance the product is built on, not a number;
// the numbers live in the nugget, with their source.
export const WHY_IT_WORKS: { key: string; line: string }[] = [
  { key: 'connection', line: 'Connection is the protection. A child who tells you things is safer than a child with every control switched on, and the daily check in is you listening on purpose.' },
  { key: 'movement', line: 'We ask the same question every day on purpose. One rating is a mood. A line of them is a fact, and the line is what tells us whether an approach is working or needs changing.' },
  { key: 'earned', line: 'Earned, not granted. Minutes that come from a job done are minutes nobody argues about. That is why the stars are the child\'s and the faces are yours.' },
  { key: 'repair', line: 'Repair over punishment. The minute after you lose it is the minute that teaches, and it is the one the scripts are written for.' },
  { key: 'plan', line: 'A plan beats a ban. Whatever the law does about phones, a child who reaches sixteen ready is the goal, and ready is built a day at a time.' },
  { key: 'evidence', line: 'Every nugget in these emails comes from a named source. If we cannot say who found it, we do not say it.' },
  { key: 'small', line: 'Ten minutes a day, not a new regime. The families who get there are the ones who do the small thing on the ordinary days.' },
]

// ── FOR THE PARENT ───────────────────────────────────────────────────────────
//
// Six lines, one a week, each with somewhere to go. `href` is a token the
// caller resolves: 'repair' becomes the repair script's own page when the
// scripts table has one, and the family rules shelf when it does not.
export const FOR_THE_PARENT: { key: string; line: string; cta: string; href: string }[] = [
  { key: 'shout', line: 'If you shouted this week, you are in good company. Children do not remember the shout half as well as they remember what came after it.', cta: 'The words for after', href: 'repair' },
  { key: 'guilt', line: 'Guilt is a sign you care, not a verdict on you. You do not need a perfect evening. You need the next one to be a bit better, and that is a much smaller job.', cta: 'One small thing for tonight', href: `${APP_ORIGIN}/dashboard` },
  { key: 'time', line: 'Your time counts too. A parent who gets ten quiet minutes back is a calmer parent at seven o\'clock, and the child feels that more than any rule.', cta: 'See the words for the evening', href: `${APP_ORIGIN}/dashboard/scripts/category/screen-time` },
  { key: 'losing-it', line: 'Losing it happens in every house. The repair is the lesson, and it takes ten seconds: I got that wrong, I am sorry, let us go again.', cta: 'The repair, word for word', href: 'repair' },
  { key: 'five-oclock', line: 'Five o\'clock is hard because everyone is empty, not because you are doing it wrong. Decide the ending before the screen goes on and the fight mostly does not happen.', cta: 'The ending script', href: `${APP_ORIGIN}/dashboard/scripts/category/screen-time` },
  { key: 'not-alone', line: 'You are not the only parent at the end of the rope tonight. Most families argue about screens. The argument is normal. Having a plan for it is the difference.', cta: 'Your plan for the week', href: `${APP_ORIGIN}/dashboard` },
]

/** Which week this is, as a plain count, so a rotation needs no stored state. */
export function weekOf(now: Date = new Date()): number {
  return Math.floor(now.getTime() / (7 * 86400000))
}

export function pickWhy(week: number): { key: string; line: string } {
  return WHY_IT_WORKS[((week % WHY_IT_WORKS.length) + WHY_IT_WORKS.length) % WHY_IT_WORKS.length]
}

export function pickSupport(week: number, repairHref: string): MomentumBlock['support'] {
  const s = FOR_THE_PARENT[((week % FOR_THE_PARENT.length) + FOR_THE_PARENT.length) % FOR_THE_PARENT.length]
  return { ...s, href: s.href === 'repair' ? repairHref : s.href }
}

/**
 * The nugget for this family this week, or null.
 *
 * On topic first: a finding tagged with a topic one of their live worries maps
 * to, and tagged for the age of a child they have (an untagged age band means
 * every age). When nothing fits the worries, any sourced finding for the age.
 * Sorted by id so the walk through the pool is the same on every machine,
 * and the week moves the pointer, so a family does not meet the same finding
 * twice until the pool is spent.
 */
export function pickNugget(rows: NuggetRow[], ctx: { topics: string[]; ageBands: string[] }, week: number): Nugget | null {
  const usable = rows.filter(r =>
    typeof r.source_name === 'string' && r.source_name.trim().length > 0
    && typeof r.finding === 'string' && r.finding.trim().length > 0
    && r.finding.trim().length <= NUGGET_MAX_CHARS)
  const fitsAge = (r: NuggetRow) =>
    !r.age_bands || r.age_bands.length === 0 || ctx.ageBands.length === 0 || r.age_bands.some(b => ctx.ageBands.includes(b))
  const forAge = usable.filter(fitsAge)
  const onTopic = forAge.filter(r => (r.topics ?? []).some(t => ctx.topics.includes(t)))
  const pool = (onTopic.length > 0 ? onTopic : forAge).slice().sort((a, b) => a.id.localeCompare(b.id))
  if (pool.length === 0) return null
  const r = pool[((week % pool.length) + pool.length) % pool.length]
  return { finding: r.finding!.trim(), source: r.source_name!.trim(), url: r.url && /^https?:\/\//.test(r.url) ? r.url : null }
}

/**
 * The block for one family. Three small reads, each allowed to fail on its
 * own: the live worries for topics, the bank for the nugget, the scripts
 * table for the repair page. The why and the parent line need no read at all.
 */
export async function buildMomentum(
  admin: SupabaseClient,
  params: { userId: string; ageBands: (string | null | undefined)[]; now?: Date },
): Promise<MomentumBlock> {
  const now = params.now ?? new Date()
  const week = weekOf(now)
  const ageBands = params.ageBands.filter((b): b is string => typeof b === 'string' && b.length > 0)

  let topics: string[] = []
  try {
    const { data } = await admin
      .from('concerns').select('label, slug')
      .eq('user_id', params.userId).in('status', ['open', 'improving']).limit(40)
    topics = [...new Set(((data ?? []) as { label: string | null; slug: string | null }[])
      .map(c => knowledgeTopicFor(c.label, c.slug)).filter((t): t is string => !!t))]
  } catch { /* a nugget for the age is still a nugget */ }

  let nugget: Nugget | null = null
  try {
    const { data } = await admin
      .from('expert_knowledge').select('id, source_name, finding, url, topics, age_bands')
      .eq('active', true).limit(400)
    nugget = pickNugget((data ?? []) as NuggetRow[], { topics, ageBands }, week)
  } catch { /* silence rather than a made up finding */ }

  let repairHref = `${APP_ORIGIN}/dashboard/scripts/category/family-rules`
  try {
    const { data } = await admin
      .from('scripts').select('id').ilike('title', '%lost your temper%').limit(1).maybeSingle()
    if (data?.id) repairHref = `${APP_ORIGIN}/dashboard/scripts/${data.id}`
  } catch { /* the shelf is still the right door */ }

  return { nugget, why: pickWhy(week), support: pickSupport(week, repairHref) }
}
