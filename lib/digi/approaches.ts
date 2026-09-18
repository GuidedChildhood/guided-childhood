import { readScores } from '@/lib/concerns/scores'
import { SILVER_RUN, TOP_BAND } from '@/lib/concerns/resting'
import { inferSituation } from '@/lib/digi/situation'
import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// THE STRAND: one worry, worked over days, until it rests.
//
// Justin, 18 September 2026: every moment a parent adds is caught and chased
// "until they get 5 stars and marked as done", and DiGi "knows it's a goal
// over days to try every possible scientific expert way" to get there.
//
// ── WHAT THIS IS NOT ────────────────────────────────────────────────────────
//
// It is not a second learning loop. lib/digi/outcomes.ts already holds the
// counted one: what this family tried and what they said happened, plus what
// families in the same situation rated. That loop answers "what do we suggest
// next time". This one answers a narrower and harder question: for THIS worry,
// which is still not at five stars, what have we already spent, and what is
// the next thing worth spending.
//
// Three parts, and each one was missing something before today.
//
// 1. THE RECORD. digi_outcomes.concern_id existed and was never written, so
//    the per worry thread was a column of nulls. Migration 307 adds the two
//    bands beside it, because the parent's verdict and the rating are
//    different facts and a worry can carry "it worked" while still sitting at
//    two stars.
//
// 2. THE BANK. The research is already in expert_knowledge, tagged by topic
//    and age band by the situations briefing. What it had no notion of was
//    ORDER: nothing recorded which findings this family had already been
//    offered for this worry, so the sixth conversation could reach for the
//    first idea again. approach is the finding's own key, so the bank is
//    walked rather than re-shuffled.
//
// 3. THE RESTRAINT. Working a goal over days is one step from nagging, and
//    the difference is entirely in who starts the conversation. Nothing here
//    starts one. This file writes no prompt card and no follow up; it reads,
//    and hands DiGi a better answer when the parent is already talking. The
//    twice a week step in cap in lib/config/digi.ts is untouched and stays
//    the only door DiGi can knock on.

/** Band 1 to 5 from a 0 to 10 score. The arithmetic review.md section 4a fixes. */
export function bandOf(score: number): number {
  return Math.ceil(Math.min(10, Math.max(1, score)) / 2)
}

/** What a band sounds like out loud, the same five words the check in uses. */
export function bandWord(band: number): string {
  return ['really tough', 'hard going', 'up and down', 'getting there', 'going great'][Math.min(4, Math.max(0, band - 1))]
}

/** An approach is a research finding, keyed by the row it came from. */
export const APPROACH_PREFIX = 'ek:'

export function approachKey(knowledgeId: string): string {
  return `${APPROACH_PREFIX}${knowledgeId}`
}

// ── WHERE THE TWO VOCABULARIES DISAGREE ─────────────────────────────────────
//
// inferSituation writes the topic of a MESSAGE. expert_knowledge is tagged
// with the topic of a FINDING. They were written months apart and they are
// mostly the same words, which is exactly what makes the five places they are
// not so dangerous: a worry whose topic has no rows gets a bank of nothing,
// DiGi has no next approach, and nothing anywhere says so.
//
// Measured against the live bank on 18 September 2026 rather than guessed,
// and two of the five were not spelling at all:
//
//   devices  0 rows. The bank files the same research under 'phone'. This is
//            the one that mattered: 'phones-and-messaging' is the second most
//            common worry on the product, 22 rows, and every one of them
//            would have found nothing.
//   content  0 rows. What a child comes across is filed under 'safety'.
//   ai            spelt 'ai_use'
//   friendship    spelt 'friendships'
//   siblings      spelt 'sibling'
const TOPIC_ALIASES: Record<string, string> = {
  devices: 'phone',
  content: 'safety',
  ai: 'ai_use',
  friendship: 'friendships',
  siblings: 'sibling',
}

/**
 * The topics the research bank actually carries, as counted on the live bank.
 *
 * Here so the join can be checked without a database. A topic inferSituation
 * can produce that is missing from this list is a worry that will never find
 * any research, and scripts/check-worry-strand.mjs fails on it rather than
 * letting it be discovered by a parent getting the same idea twice.
 */
export const BANK_TOPICS = [
  'adhd', 'ai_readiness', 'ai_use', 'after_school', 'anger', 'anxiety', 'autism',
  'balanced_use', 'bedtime', 'body_image', 'boundaries', 'crisis', 'device_as_helper',
  'disclosure', 'forecast', 'friendships', 'gaming', 'handover', 'history',
  'misinformation', 'mood', 'morning', 'new_game', 'new_phone', 'normal_moments',
  'online_safety', 'parent_stress', 'parent_wellbeing', 'phone', 'pull_and_design',
  'relationships', 'routines', 'safety', 'school', 'screen_time', 'sibling', 'sleep',
  'social_media', 'stage_arrival', 'tantrum', 'temperament', 'trauma',
]

/**
 * Which research topic a worry belongs to.
 *
 * The label and the slug together, because a parent's own words carry the
 * signal ("wont get off the switch") and the slug carries it when the label is
 * a tile name ("controller-fights"). inferSituation does the matching, so the
 * worry and a typed message land on the same topic and there is one keyword
 * table in the product rather than two that drift.
 */
export function knowledgeTopicFor(label: string | null, slug: string | null): string | null {
  const text = `${label ?? ''} ${(slug ?? '').replace(/[-_]/g, ' ')}`.trim()
  if (!text) return null
  const topic = inferSituation(text).topic
  if (!topic) return null
  return bankTopicFor(topic)
}

/**
 * A situation topic, in the words the research bank files it under.
 *
 * Split out from the inference above so the two halves can be checked
 * separately. Inference is keyword matching and will always be approximate;
 * THIS half is a join, it is either right or it is silently empty, and it is
 * the one a guard can hold exactly.
 */
export function bankTopicFor(situationTopic: string): string {
  return TOPIC_ALIASES[situationTopic] ?? situationTopic
}

export type Approach = {
  key: string
  finding: string
  source: string
}

type KnowledgeRow = {
  id: string
  finding: string
  source_name: string | null
  topics: string[] | null
  age_bands: string[] | null
}

/**
 * The bank for one topic, in order, with what has been tried taken out.
 *
 * Ordered by created_at ascending and NOT by similarity, on purpose. A bank
 * walked over days has to give the same answer tomorrow as today: a vector
 * ranking would re-shuffle on a re-embed or a bank refresh, and a family would
 * be offered idea three, then idea one, then idea three again, which reads as
 * a guide that has forgotten the conversation. Age band matches lead, because
 * a finding about eight year olds is not a finding about fourteen year olds.
 */
export function orderBank(rows: KnowledgeRow[], topic: string, ageBand: string | null, tried: Set<string>): Approach[] {
  return rows
    .filter(r => (r.topics ?? []).includes(topic))
    .filter(r => !tried.has(approachKey(r.id)))
    .sort((a, b) => {
      const fit = (r: KnowledgeRow) => (ageBand && (r.age_bands ?? []).includes(ageBand) ? 0 : 1)
      return fit(a) - fit(b)
    })
    .map(r => ({
      key: approachKey(r.id),
      finding: r.finding,
      source: r.source_name ?? 'the research bank',
    }))
}

export type WorryConcern = { id: string; label: string; slug?: string | null }

export type StrandNext = { approach: string | null; band: number | null }

export type WorryStrand = {
  /** The context block DiGi reads. Empty when there is nothing worth saying. */
  block: string
  /** Per concern id: the next untried approach, and the band it stands at now. */
  next: Map<string, StrandNext>
}

const EMPTY_STRAND: WorryStrand = { block: '', next: new Map() }

/** How many worries the block covers. Three, because the prompt is not a report. */
const STRAND_WORRIES = 3

/** How many past attempts are quoted per worry. */
const STRAND_ATTEMPTS = 3

/**
 * What has been tried for each live worry, and what the rating did after.
 *
 * Best effort everywhere: a failed read returns the empty strand rather than
 * taking the reply down, exactly as every other context block on this route.
 */
export async function getWorryStrand(
  supabase: SupabaseClient,
  userId: string,
  concerns: WorryConcern[],
  ageBand: string | null,
): Promise<WorryStrand> {
  const live = concerns
  if (live.length === 0) return EMPTY_STRAND
  const ids = live.map(c => c.id)

  const topicByConcern = new Map<string, string>()
  for (const c of live) {
    const topic = knowledgeTopicFor(c.label, c.slug ?? null)
    if (topic) topicByConcern.set(c.id, topic)
  }
  const topics = [...new Set(topicByConcern.values())]

  const [eventsRes, outcomesRes, knowledgeRes] = await Promise.all([
    supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', ids)
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
      .limit(120),
    supabase
      .from('digi_outcomes')
      .select('concern_id, suggestion, verdict, approach, band_at_suggestion, band_after, created_at')
      .eq('user_id', userId)
      .in('concern_id', ids)
      .order('created_at', { ascending: false })
      .limit(40),
    topics.length > 0
      ? supabase
          .from('expert_knowledge')
          .select('id, finding, source_name, topics, age_bands')
          .eq('active', true)
          .overlaps('topics', topics)
          .order('created_at', { ascending: true })
          .limit(200)
      : Promise.resolve({ data: null }),
  ])

  const scores = readScores(
    ((eventsRes.data ?? []) as { concern_id: string; score: number | null; created_at: string }[]),
    TOP_BAND,
  )

  type OutcomeRow = {
    concern_id: string | null
    suggestion: string
    verdict: string | null
    approach: string | null
    band_at_suggestion: number | null
    band_after: number | null
  }
  const attempts = new Map<string, OutcomeRow[]>()
  const triedByConcern = new Map<string, Set<string>>()
  for (const row of ((outcomesRes.data ?? []) as OutcomeRow[])) {
    const id = row.concern_id
    if (!id) continue
    const list = attempts.get(id) ?? []
    list.push(row)
    attempts.set(id, list)
    if (row.approach) {
      const set = triedByConcern.get(id) ?? new Set<string>()
      set.add(row.approach)
      triedByConcern.set(id, set)
    }
  }

  const knowledge = (knowledgeRes.data ?? []) as KnowledgeRow[]
  const next = new Map<string, StrandNext>()
  const lines: string[] = []
  let shown = 0

  for (const c of live) {
    const band = scores.last.has(c.id) ? bandOf(scores.last.get(c.id)!) : null
    const firstBand = scores.first.has(c.id) ? bandOf(scores.first.get(c.id)!) : null
    const topic = topicByConcern.get(c.id) ?? null
    const bank = topic ? orderBank(knowledge, topic, ageBand, triedByConcern.get(c.id) ?? new Set()) : []
    const head = bank[0] ?? null

    // The approach is recorded only when the strand actually OFFERED it. A
    // key written for research DiGi never saw would mark it tried, and the
    // family would silently lose the one idea we had for that worry.
    const offered = shown < STRAND_WORRIES && (scores.topRun.get(c.id) ?? 0) < SILVER_RUN
    next.set(c.id, { approach: offered ? head?.key ?? null : null, band })

    if (shown >= STRAND_WORRIES) continue

    // ── A WORRY THAT HAS REACHED FIVE STARS IS FINISHED ─────────────────────
    //
    // The same rule the check in and the moments deck already use, imported
    // rather than re-stated: two top band days in a row and the worry rests.
    // Justin's ask is that a moment is chased "until they get 5 stars and
    // marked as done", and the second half of that sentence is the half a
    // system like this gets wrong. Handing DiGi a next thing to try for a
    // worry the family has just sorted is how working a goal turns into
    // nagging, which is the one thing the whole strand has to avoid.
    if ((scores.topRun.get(c.id) ?? 0) >= SILVER_RUN) continue

    // UNANSWERED ATTEMPTS COUNT, and this is where this deliberately differs
    // from getTriedAlready in lib/digi/outcomes.ts, which filters them out.
    //
    // That one is building a cross family evidence base, so a row with no
    // verdict teaches it nothing and is right to drop. This one is answering
    // "what have we already spent on this worry", and a suggestion nobody
    // came back on is spent all the same. Offering it again is the same
    // mistake either way.
    //
    // Not hypothetical: read live on 18 September 2026, all six follow ups
    // ever delivered are still unanswered. Filter those out to match the
    // other function and the strand is empty for every family on the
    // product.
    const tried = (attempts.get(c.id) ?? []).slice(0, STRAND_ATTEMPTS).map(a => {
      const said =
        a.verdict === 'worked' ? 'they said it worked'
        : a.verdict === 'partly' ? 'they said it helped a bit'
        : a.verdict === 'no' ? 'they said it did not work'
        : 'we never heard back'
      // The other half, and the one the parent cannot give us. Bands only, so
      // this says which way the worry moved and never quotes a score.
      const moved =
        a.band_at_suggestion == null || a.band_after == null
          ? ''
          : a.band_after > a.band_at_suggestion
            ? ', and the rating went up after'
            : a.band_after < a.band_at_suggestion
              ? ', and the rating went down after'
              : ', and the rating held'
      return `  - tried "${a.suggestion.slice(0, 140)}": ${said}${moved}`
    })

    // Nothing tried and nothing to try. A line saying only that we have the
    // worry is something DiGi already knows from the concerns block above, so
    // it would be prompt spent to repeat it and it reads as a broken list.
    if (tried.length === 0 && !head) continue

    const where =
      band === null
        ? 'never rated yet'
        : firstBand !== null && firstBand !== band
          ? `started at ${bandWord(firstBand)}, now ${bandWord(band)}`
          : `at ${bandWord(band)}`

    lines.push(`- ${c.label}, ${where}${tried.length === 0 ? ', nothing tried yet' : ''}:`)
    lines.push(...tried)
    if (head) lines.push(`  - NOT TRIED YET, from the research bank: ${head.finding.slice(0, 260)} (${head.source})`)
    shown += 1
  }

  if (lines.length === 0) return EMPTY_STRAND

  return {
    next,
    block:
      '\n\nEACH WORRY IS A GOAL WORKED OVER DAYS, NOT ONE ANSWER. This is what has been tried for each live worry and what the rating did afterwards. A worry is finished when it reaches five stars and rests, so keep going: reach for something we have not tried yet rather than the thing they already told you failed, and when you change tack say plainly that you are changing tack and why. The untried finding below is a place to start in your own words, never a rule and never something to read out, and if it does not fit what they just asked, ignore it and answer the question they asked:\n' +
      lines.join('\n') +
      '\nWhen your reply gives them something concrete to try for one of these, schedule the follow up and name that worry in the worry field, so their answer lands on this record instead of beside it.',
  }
}
