import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { ROUTINE_PACKS } from '@/lib/quests/routines'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { getStarBanks } from '@/lib/quests/bank'
import { getFamilyRegion } from '@/lib/learning/region'
import { STICKERS } from '@/lib/stickers/catalog'
import Anthropic from '@anthropic-ai/sdk'

// The Sunday DiGi weekly review. Reads one family's own week off the tables the
// star economy already writes, then hands the parent a short warm note, one
// gentle watch-for, and one concrete thing to set up for next week. The stats
// are the family's own; nothing is shared or compared. The tone stands beside
// the parent and never shames a quiet week.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 60_000,
  maxRetries: 1,
})

export type WeekStats = {
  children: string[]
  ageBands: (string | null)[]
  questsApproved: number
  starsEarned: number
  /**
   * What those stars were worth in minutes, priced per child at each child's
   * own star rate (migration 225). starsEarned times the deployment default
   * went wrong the day two children could hold two different rates.
   */
  earnedMinutes: number
  /** Minutes earned and still unspent tonight, per child rates applied. On a
   *  Sunday evening this is exactly what Monday's rollover will turn into
   *  sticker book credits, so the email can say so before it happens. */
  savedMinutes?: number
  /** Minutes banked for the school holidays this week (rollover surplus and
   *  daily grants together). */
  holidayMinutes?: number
  /** Names of stickers earned this week, from the book the child sees. */
  newStickers?: string[]
  starsSpent: number
  deviceMinutes: number
  activeDays: number
  topQuest: string | null
  schoolOpen: number
  momentsDone: number
  momentsList: string[]
  lessonsDone: string[]
  scriptsTried: string[]
  // What the family's own weekly check in rating did, and what they did that
  // week, from checkin_shifts (migration 190). The review's job is to hand
  // this back to the parent in plain words, which is the "summarise this to
  // the user" half of the learning loop.
  ratingShift: { direction: 'up' | 'down' | 'flat'; summary: string } | null
}

export type WeeklyReview = {
  week_start: string
  stats: WeekStats
  summary: string
  watch_for: string | null
  suggestion: string | null
  suggestion_routine: string | null
}

// The Monday that starts the week containing `d` (UK weeks start Monday).
function mondayOf(d: Date): string {
  const day = d.getUTCDay() // 0 Sun .. 6 Sat
  const back = (day + 6) % 7 // days since Monday
  const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back))
  return mon.toISOString().slice(0, 10)
}

async function gatherWeek(userId: string, weekStart: string): Promise<WeekStats> {
  const admin = createAdminClient()
  const start = new Date(`${weekStart}T00:00:00.000Z`)
  const startIso = start.toISOString()
  const endIso = new Date(start.getTime() + 7 * 86_400_000).toISOString()

  const [childRes, ticksRes, questsRes, spendsRes, schoolRes, momentsRes, shiftRes] = await Promise.all([
    admin.from('children').select('id, name, age_band').eq('parent_id', userId),
    admin.from('quest_ticks').select('quest_id, tick_date, status')
      .eq('user_id', userId).eq('status', 'approved')
      .gte('tick_date', weekStart).lt('tick_date', endIso.slice(0, 10)),
    admin.from('family_quests').select('id, title, stars').eq('user_id', userId),
    admin.from('star_spends').select('minutes, stars, created_at')
      .eq('user_id', userId).gte('created_at', startIso).lt('created_at', endIso),
    admin.from('school_actions').select('id').eq('user_id', userId).eq('status', 'open'),
    admin.from('moment_completions').select('completed_on, daily_moments(title)')
      .eq('user_id', userId).gte('completed_on', weekStart).lt('completed_on', endIso.slice(0, 10)),
    // The freshest rating shift, only if it is recent enough to still be
    // about this family's current fortnight rather than ancient history.
    admin.from('checkin_shifts').select('week_start, direction, summary')
      .eq('user_id', userId)
      .gte('week_start', new Date(start.getTime() - 14 * 86_400_000).toISOString().slice(0, 10))
      .order('week_start', { ascending: false })
      .limit(1).maybeSingle(),
  ])

  // The learning and the words tried this week: lessons completed (the literacy
  // path moving) and scripts used with whether they worked, so Sunday can plan
  // next week from what actually happened, not just count activity.
  const [lessonCompRes, scriptCompRes] = await Promise.all([
    admin.from('lesson_completions').select('lesson_id, lesson_source, completed_at, passed')
      .eq('user_id', userId).gte('completed_at', startIso).lt('completed_at', endIso),
    admin.from('script_completions').select('script_sort_order, worked, completed_at')
      .eq('user_id', userId).gte('completed_at', startIso).lt('completed_at', endIso),
  ])
  const lessonIds = (lessonCompRes.data ?? []).map(l => l.lesson_id)
  const scriptOrders = (scriptCompRes.data ?? []).map(s => s.script_sort_order)
  const [lessonTitlesRes, scriptTitlesRes] = await Promise.all([
    lessonIds.length ? admin.from('lessons').select('id, title').in('id', lessonIds) : Promise.resolve({ data: [] }),
    scriptOrders.length ? admin.from('scripts').select('sort_order, title').in('sort_order', scriptOrders) : Promise.resolve({ data: [] }),
  ])
  const lessonTitle = new Map((lessonTitlesRes.data ?? []).map(l => [l.id, l.title as string]))
  const scriptTitle = new Map((scriptTitlesRes.data ?? []).map(s => [s.sort_order, s.title as string]))
  // Each lesson carries whether its end of lesson check was passed, so the
  // Sunday round up can say the learning stuck, not just that time was spent.
  const passedById = new Map((lessonCompRes.data ?? []).map(l => [l.lesson_id, l.passed !== false]))
  const lessonsDone = [...new Set(lessonIds.map(id => {
    const t = lessonTitle.get(id)
    return t ? `${t} (${passedById.get(id) ? 'passed the check' : 'retake waiting'})` : null
  }).filter((t): t is string => Boolean(t)))].slice(0, 6)
  const scriptsTried = [...new Set((scriptCompRes.data ?? []).map(s => {
    const t = scriptTitle.get(s.script_sort_order)
    if (!t) return null
    const w = s.worked === 'yes' ? 'worked' : s.worked === 'somewhat' ? 'partly worked' : s.worked === 'no' ? 'did not work' : 'tried'
    return `${t} (${w})`
  }).filter((t): t is string => Boolean(t)))].slice(0, 6)

  const questById = new Map((questsRes.data ?? []).map(q => [q.id, q]))
  const ticks = ticksRes.data ?? []
  // The bank is the one true reading of the star economy: it excludes family
  // jobs, counts missions and bonuses, and knows each child's own star rate.
  // The tick arithmetic below is only the fallback for when it cannot answer.
  let starsEarned = ticks.reduce((s, t) => s + (questById.get(t.quest_id)?.stars ?? 1), 0)
  let earnedMinutes = starsEarned * STAR_MINUTES
  let savedMinutes = 0
  try {
    const kidRows = (childRes.data ?? []) as { id?: string; name: string; age_band?: string | null }[]
    const kidIds = kidRows.map(k => String(k.id)).filter(Boolean)
    if (kidIds.length > 0) {
      const region = await getFamilyRegion(admin, userId)
      const banks = await getStarBanks(
        admin, userId, kidIds,
        Object.fromEntries(kidRows.map(k => [String(k.id), k.age_band ?? null])),
        weekStart, region,
      )
      // weekEarned is capped for spending; the review talks about what was
      // WORKED FOR, so the surplus the cap turned away still counts here.
      starsEarned = banks.reduce((s, b) => s + b.weekEarned + b.weekSurplus, 0)
      earnedMinutes = banks.reduce((s, b) => s + (b.weekEarned + b.weekSurplus) * b.starMinutes, 0)
      // What is still unspent tonight, which is exactly what tomorrow
      // morning's rollover converts into sticker book credits.
      savedMinutes = banks.reduce((s, b) => s + b.balance * b.starMinutes, 0)
    }
  } catch { /* the tick arithmetic above stands */ }

  // The saving story, best effort like everything after the core stats: the
  // holiday minutes banked this week and the stickers that landed in the
  // book, so the Sunday email carries the reward loop and not just the work.
  let holidayMinutes = 0
  let newStickers: string[] = []
  try {
    const { data: hol } = await admin.from('holiday_allowance')
      .select('minutes, created_at').eq('user_id', userId)
      .gte('created_at', startIso).lt('created_at', endIso)
    holidayMinutes = (hol ?? []).reduce((s, r) => s + (Number(r.minutes) || 0), 0)
  } catch { /* pre 127, no holiday pot */ }
  try {
    const { data: st } = await admin.from('earned_stickers')
      .select('sticker_key, earned_at').eq('user_id', userId)
      .gte('earned_at', startIso).lt('earned_at', endIso)
    const nameByKey = new Map(STICKERS.map(s => [s.key, s.name]))
    newStickers = [...new Set((st ?? [])
      .map(r => nameByKey.get(String(r.sticker_key)) ?? null)
      .filter((n): n is string => Boolean(n)))]
  } catch { /* pre 101, no book yet */ }
  const activeDays = new Set(ticks.map(t => String(t.tick_date))).size

  // The quest they leaned on most this week.
  const counts = new Map<string, number>()
  for (const t of ticks) {
    const title = questById.get(t.quest_id)?.title
    if (title) counts.set(title, (counts.get(title) ?? 0) + 1)
  }
  let topQuest: string | null = null
  let topN = 0
  for (const [title, n] of counts) if (n > topN) { topN = n; topQuest = title }

  const spends = spendsRes.data ?? []
  const kids = childRes.data ?? []
  return {
    children: kids.map(c => c.name),
    ageBands: kids.map(c => (c.age_band as string | null) ?? null),
    questsApproved: ticks.length,
    starsEarned,
    earnedMinutes,
    savedMinutes,
    holidayMinutes,
    newStickers,
    starsSpent: spends.reduce((s, x) => s + (Number(x.stars) || 0), 0),
    deviceMinutes: spends.reduce((s, x) => s + (Number(x.minutes) || 0), 0),
    activeDays,
    topQuest,
    schoolOpen: (schoolRes.data ?? []).length,
    momentsDone: (momentsRes.data ?? []).length,
    // The actual moments they read this week, newest first and deduped, so the
    // Sunday catch up can ask how a specific one went, not just count them.
    momentsList: [...new Set(
      (momentsRes.data ?? [])
        .map(r => {
          const dm = (r as { daily_moments?: { title?: string } | { title?: string }[] }).daily_moments
          const rel = Array.isArray(dm) ? dm[0] : dm
          return rel?.title ?? null
        })
        .filter((t): t is string => Boolean(t))
    )].slice(0, 6),
    lessonsDone,
    scriptsTried,
    ratingShift: shiftRes.data?.summary
      ? { direction: shiftRes.data.direction as 'up' | 'down' | 'flat', summary: String(shiftRes.data.summary) }
      : null,
  }
}

// A warm, honest fallback so the review always says something, even with no
// model key. Plain, no dashes, JP's voice.
function templateReview(stats: WeekStats): Omit<WeeklyReview, 'week_start' | 'stats'> {
  const kid = stats.children[0] ?? 'your child'
  if (stats.questsApproved === 0) {
    return {
      summary: `A quiet week on quests, and that is completely fine. Some weeks are just full. When you have a spare minute, one or two quests set for ${kid} is enough to get the stars flowing again.`,
      watch_for: null,
      suggestion: 'Add a small routine to make next week feel automatic.',
      suggestion_routine: 'after-school',
    }
  }
  const mins = stats.earnedMinutes ?? stats.starsEarned * STAR_MINUTES
  const parts: string[] = []
  parts.push(`Good week. ${stats.questsApproved} quest${stats.questsApproved === 1 ? '' : 's'} done across ${stats.activeDays} day${stats.activeDays === 1 ? '' : 's'}, and ${stats.starsEarned} stars earned, that is ${mins} minutes of screen time worked for rather than just given.`)
  if (stats.topQuest) parts.push(`${kid} leaned into "${stats.topQuest}" the most.`)
  if (stats.ratingShift?.direction === 'up') parts.push(`And your own check in says the week felt better too. Whatever you did differently, it is working, keep going with exactly that.`)
  const watch = stats.deviceMinutes > mins + 60
    ? 'A little more screen time went out than was earned this week. No alarm, just worth a glance so the deal stays real.'
    : null
  return {
    summary: parts.join(' '),
    watch_for: watch,
    suggestion: 'Lock in the habit with a ready made routine for next week.',
    suggestion_routine: 'bedtime',
  }
}

async function generateReview(stats: WeekStats, reflections: string[] = []): Promise<Omit<WeeklyReview, 'week_start' | 'stats'>> {
  if (!process.env.ANTHROPIC_API_KEY) return templateReview(stats)

  const routineList = ROUTINE_PACKS.map(p => `${p.key} (${p.name})`).join(', ')
  const reflectionBlock = reflections.length
    ? `\n\nWhat the parent actually worked through with DiGi this week (their own words, from daily reflections). Gently weave one of these into the summary so the catch up feels like it remembers the conversations, never quote it back mechanically or list them all:\n${reflections.map(r => `- ${r}`).join('\n')}`
    : ''
  const prompt = `You are DiGi, the calm, warm guide inside Guided Childhood, writing a family's private Sunday weekly review for the parent. Voice: warm, plain, direct, British, encouraging, never preachy, no AI-isms. Hard rule: never use a dash of any kind in the text, not even a hyphen between words. Never shame a quiet week. This stands beside the parent, it is not a report card on the child.

This family's week (their own numbers, nothing compared to anyone else):
- Children: ${stats.children.join(', ') || 'one child'}
- Quests approved: ${stats.questsApproved}
- Active days: ${stats.activeDays} of 7
- Stars earned: ${stats.starsEarned} (worth ${stats.earnedMinutes ?? stats.starsEarned * STAR_MINUTES} minutes of screen time earned)
- Screen minutes spent: ${stats.deviceMinutes}
- Most done quest: ${stats.topQuest ?? 'none yet'}
- Calm parenting moments handled: ${stats.momentsDone}${stats.momentsList.length ? ` (the ones they read: ${stats.momentsList.join(', ')})` : ''}
- Open school reminders: ${stats.schoolOpen}
- Lessons completed this week (the digital literacy path moving): ${stats.lessonsDone.length ? stats.lessonsDone.join(', ') : 'none this week'}
- Scripts tried, and whether the words worked: ${stats.scriptsTried.length ? stats.scriptsTried.join(', ') : 'none this week'}${stats.ratingShift ? `
- Their own weekly wellbeing check in: ${stats.ratingShift.summary}` : ''}${reflectionBlock}
${stats.ratingShift ? `
The wellbeing line above is the one to hand back plainly. ${stats.ratingShift.direction === 'up' ? 'The rating rose, so name what they did that week and say it looks like it is working, keep going with exactly that.' : stats.ratingShift.direction === 'down' ? 'The rating dipped. No alarm and no blame, but say it moved and suggest one different angle for the coming week rather than more of the same.' : 'The rating held steady. Say so warmly and pick one small new thing worth trying, since what changed nothing does not need repeating.'}` : ''}

Plan the future from all of this, not just the counts. The suggestion should be the single best next step on the family's road to 16, safe, AI literate and digitally aware: build on a script that worked, revisit one that did not with a different angle, continue a moment they read, or the next lesson on the path. Name the real thing, never a vague keep it up.

${stats.momentsList.length ? `They read the moment card${stats.momentsList.length === 1 ? '' : 's'} above this week. In watch_for or suggestion, gently ask how one of them actually went in real life (name it), and offer one small next step or a scripted line if it is still tricky, so the catch up closes the loop on what they worked on.` : ''}

Available routines to suggest for next week (use the key): ${routineList}

Return ONLY compact JSON, no prose around it:
{"summary":"2 to 3 warm sentences on how the week went, specific to these numbers","watch_for":"one gentle, optional thing worth a glance, or null if nothing","suggestion":"one short concrete thing to set up for next week","suggestion_routine":"one routine key from the list that best fits, or null"}`

  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 700, messages: [{ role: 'user', content: prompt }] })
      const raw = firstText(msg)
      const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
      const parsed = JSON.parse(json) as Partial<Omit<WeeklyReview, 'week_start' | 'stats'>>
      const validRoutine = ROUTINE_PACKS.some(p => p.key === parsed.suggestion_routine)
      return {
        summary: (parsed.summary ?? '').trim() || templateReview(stats).summary,
        watch_for: parsed.watch_for?.trim() || null,
        suggestion: parsed.suggestion?.trim() || null,
        suggestion_routine: validRoutine ? parsed.suggestion_routine! : null,
      }
    } catch (err) {
      const modelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!modelError) break
    }
  }
  return templateReview(stats)
}

// Build (or rebuild) this week's review for one family and store it. Idempotent
// on (user_id, week_start): a re-run refreshes the same row rather than adding.
export async function buildWeeklyReview(userId: string, now = new Date()): Promise<WeeklyReview> {
  const weekStart = mondayOf(now)
  const stats = await gatherWeek(userId, weekStart)

  // What the family actually talked through with DiGi this week, drawn from the
  // daily reflections the parent answered. This is what makes the catch up feel
  // like it remembers the conversations, without any manual save step. Reflection
  // text stays out of the stored stats (and off the client), it only shapes the
  // summary here.
  const admin = createAdminClient()
  const endDay = new Date(new Date(`${weekStart}T00:00:00.000Z`).getTime() + 7 * 86_400_000).toISOString().slice(0, 10)
  const { data: fbRows } = await admin
    .from('digi_feedback')
    .select('question, parent_response')
    .eq('user_id', userId)
    .gte('feedback_date', weekStart)
    .lt('feedback_date', endDay)
    .limit(10)
  const reflections = (fbRows ?? [])
    .filter(r => r.parent_response && String(r.parent_response).trim())
    .map(r => `Asked: ${String(r.question).trim().slice(0, 160)} They answered: ${String(r.parent_response).trim().slice(0, 200)}`)
    .slice(0, 5)

  const body = await generateReview(stats, reflections)
  const review: WeeklyReview = { week_start: weekStart, stats, ...body }

  await admin.from('digi_weekly_reviews').upsert({
    user_id: userId,
    // The whole family's week, so the household's null child row, named so the
    // 219 key has a real target. A per child review can join it later.
    child_id: null,
    week_start: weekStart,
    stats: review.stats,
    summary: review.summary,
    watch_for: review.watch_for,
    suggestion: review.suggestion,
    suggestion_routine: review.suggestion_routine,
    status: 'unread',
  }, { onConflict: 'user_id,child_id,week_start' })

  return review
}
