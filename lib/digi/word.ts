import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { digiModelsFor } from '@/lib/config/digi'
import { firstText, stripDashes } from '@/lib/digi/text'
import { getProvenSolutions } from '@/lib/digi/wisdom'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { sendPush } from '@/lib/push/send'
import { renderHorizons, horizonsFor } from '@/lib/digi/horizons'

// DiGi's word: the proactive insight, twice a week.
//
// Justin, 6 September 2026: "DiGi reviews what is happening on the platform
// and has a little alert that says DiGi wants to tell you something, an
// insight that really hooks and tells them what to do next for the child at
// that particular age, taking into account the information they have received,
// DiGi chats across parents, and what is actually best right now."
//
// One family, one child, one thing said. The child is the one with the most
// signal this fortnight. The brief carries the family's own last two weeks,
// the freshest research for the child's age, what has worked for other
// families at that age, and the last three insights with how the parent
// reacted, so DiGi never repeats itself and leans toward what helped. The
// answer is JSON with a hook, the insight, the one thing to do next, the
// named source, and a real link into the product checked against a
// whitelist, because a button that goes nowhere is worse than no button.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 90_000,
  maxRetries: 1,
})

export type DigiWord = {
  id: string
  child_id: string | null
  title: string
  body: string
  href: string | null
  cta: string | null
  source: string | null
  status: string
  reaction: string | null
  created_at: string
}

type Child = { id: string; name: string | null; age_band: string | null; stage_id: string | null; is_primary: boolean | null }

const FIXED_LINKS: { href: string; label: string }[] = [
  { href: '/dashboard/checkin', label: 'the check in, where the parent rates how the worry went' },
  { href: '/dashboard/tonight', label: 'tonight, the one live mechanism for the top worry' },
  { href: '/dashboard/quests/timer', label: 'the timer, where screen time is set and wound up' },
  { href: '/dashboard/quests', label: 'quests, the jobs that earn stars and the balance' },
  { href: '/dashboard/printables', label: 'printables, the paper charts and sheets' },
  { href: '/dashboard/lessons', label: 'lessons, the library by stage' },
  { href: '/dashboard/scripts', label: 'scripts, the words for hard moments' },
  { href: '/dashboard/digi', label: 'a chat with DiGi' },
]

async function callModel(system: string, user: string): Promise<string> {
  const models = digiModelsFor('chat')
  let lastError: unknown
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({
        model, max_tokens: 900, system,
        messages: [{ role: 'user', content: user }],
      })
      return firstText(msg)
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

const SYSTEM = `You are DiGi, the evidence led guide inside Guided Childhood, a UK platform for parents of 4 to 16 year olds. You are about to say ONE thing to a parent who did not ask, so it has to earn the interruption.

Justin's voice: warm, plain, direct, British. No AI phrases. No dashes of any kind anywhere, not even a hyphen between words. Never allow or deny; always a calibrated pathway. Educate, never ban. Never shame the parent or the child.

THE JOB: from the family's own fortnight, the research for this child's age, and what has worked for other families at this age, find the one insight this parent most needs right now. It must be specific to THIS child and THIS fortnight (name what they did or asked), it must explain why in one or two sentences leaning on a named source from the bank you are given, and it must end in one concrete thing to do next that lives inside the product.

RULES:
- The hook is one sentence, under 90 characters, that makes the parent stop scrolling. Specific, not clever. No question marks in the hook.
- The insight is two short paragraphs, under 110 words in total. Name the source inside a sentence, exactly as given in the bank (the researcher or body). Never invent a study, figure or source. If nothing in the bank fits, lean on the family's own pattern and name no source.
- do_next is one sentence, one action, tonight or this week, and it matches the link you choose.
- href must be one of the links you are given, copied exactly. cta is the button label, three to five words, an action.
- Never repeat a previous insight's angle. If the parent said a previous one did not help, take a different line.
- Never mention other families' numbers, never name anyone, never quote a parent.

Return ONLY a JSON object, no prose before or after:
{"hook":"...","insight":"...","do_next":"...","source":"the source name or empty string","href":"...","cta":"..."}`

/** Everything DiGi knows about this family's fortnight, in plain lines. */
async function gather(admin: SupabaseClient, userId: string) {
  const since14 = new Date(Date.now() - 14 * 86_400_000).toISOString()
  const since7 = new Date(Date.now() - 7 * 86_400_000).toISOString()
  const [kidsRes, concernsRes, shiftsRes, scriptsRes, questionsRes, memoryRes, ticksRes, spendsRes, tonightRes, momentsRes, pastRes] = await Promise.all([
    admin.from('children').select('id, name, age_band, stage_id, is_primary').eq('parent_id', userId).order('is_primary', { ascending: false }),
    admin.from('concerns').select('id, label, status, times_flagged, child_id, last_flagged_at').eq('user_id', userId).in('status', ['open', 'improving']).order('last_flagged_at', { ascending: false }).limit(8),
    admin.from('checkin_shifts').select('week_start, direction, summary').eq('user_id', userId).order('week_start', { ascending: false }).limit(2),
    admin.from('script_completions').select('script_sort_order, worked, child_id, completed_at').eq('user_id', userId).gte('completed_at', since14).order('completed_at', { ascending: false }).limit(12),
    admin.from('digi_questions').select('question, child_id, created_at').eq('user_id', userId).gte('created_at', since14).order('created_at', { ascending: false }).limit(10),
    admin.from('digi_memory').select('kind, content, child_id').eq('user_id', userId).eq('active', true).order('created_at', { ascending: false }).limit(10),
    admin.from('quest_ticks').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'approved').gte('tick_date', since7.slice(0, 10)),
    admin.from('star_spends').select('minutes').eq('user_id', userId).gte('created_at', since7).limit(200),
    admin.from('tonight_confirmations').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', since7),
    admin.from('moment_completions').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('completed_on', since7.slice(0, 10)),
    admin.from('digi_prompts').select('title, reaction, child_id, created_at').eq('user_id', userId).eq('kind', 'insight').order('created_at', { ascending: false }).limit(3),
  ])
  const kids = (kidsRes.data ?? []) as Child[]
  const concerns = (concernsRes.data ?? []) as { id: string; label: string; status: string; times_flagged: number | null; child_id: string | null; last_flagged_at: string | null }[]

  // The latest score each live worry was given, from the append only log.
  const scoreByConcern = new Map<string, number>()
  if (concerns.length) {
    const { data: events } = await admin.from('concern_events').select('concern_id, score, created_at')
      .in('concern_id', concerns.map(c => c.id)).not('score', 'is', null).order('created_at', { ascending: false }).limit(60)
    for (const e of (events ?? []) as { concern_id: string; score: number | null }[]) {
      if (e.score != null && !scoreByConcern.has(e.concern_id)) scoreByConcern.set(e.concern_id, e.score)
    }
  }
  const scripts = (scriptsRes.data ?? []) as { script_sort_order: number; worked: string | null; child_id: string | null }[]
  const titleByOrder = new Map<number, string>()
  if (scripts.length) {
    const { data: rows } = await admin.from('scripts').select('sort_order, title').in('sort_order', [...new Set(scripts.map(s => s.script_sort_order))])
    for (const r of (rows ?? []) as { sort_order: number; title: string }[]) titleByOrder.set(r.sort_order, r.title)
  }
  const minutes = ((spendsRes.data ?? []) as { minutes: number | null }[]).reduce((a, s) => a + (s.minutes ?? 0), 0)

  return {
    kids,
    concerns: concerns.map(c => ({ ...c, score: scoreByConcern.get(c.id) ?? null })),
    shifts: (shiftsRes.data ?? []) as { week_start: string; direction: string | null; summary: string | null }[],
    scripts: scripts.map(s => ({ ...s, title: titleByOrder.get(s.script_sort_order) ?? `script ${s.script_sort_order}` })),
    questions: (questionsRes.data ?? []) as { question: string; child_id: string | null }[],
    memory: (memoryRes.data ?? []) as { kind: string; content: string; child_id: string | null }[],
    jobsApproved: ticksRes.count ?? 0,
    minutesSpent: minutes,
    tonightTaps: tonightRes.count ?? 0,
    moments: momentsRes.count ?? 0,
    past: (pastRes.data ?? []) as { title: string; reaction: string | null; child_id: string | null }[],
  }
}

/** The child with the most going on this fortnight; ties go to the primary. */
function pickChild(g: Awaited<ReturnType<typeof gather>>): Child | null {
  if (g.kids.length === 0) return null
  const score = (id: string) =>
    g.concerns.filter(c => c.child_id === id).length * 3
    + g.questions.filter(q => q.child_id === id).length * 2
    + g.scripts.filter(s => s.child_id === id).length
    + g.memory.filter(m => m.child_id === id).length
  return [...g.kids].sort((a, b) => score(b.id) - score(a.id) || Number(!!b.is_primary) - Number(!!a.is_primary))[0]
}

type Parsed = { hook: string; insight: string; do_next: string; source: string; href: string; cta: string }

function parse(text: string): Parsed | null {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    const j = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>
    const s = (k: string) => (typeof j[k] === 'string' ? (j[k] as string).trim() : '')
    const out = { hook: s('hook'), insight: s('insight'), do_next: s('do_next'), source: s('source'), href: s('href'), cta: s('cta') }
    if (!out.hook || !out.insight || !out.do_next) return null
    return out
  } catch { return null }
}

export type WordResult = { ok: true; word: DigiWord; childName: string } | { ok: false; reason: string }

/**
 * Write one insight for this family and store it. Returns the row, or the
 * reason nothing was written (no child, nothing to say, the model failed).
 */
export async function buildWordFor(userId: string, opts?: { admin?: SupabaseClient; force?: boolean }): Promise<WordResult> {
  const admin = opts?.admin ?? createAdminClient()
  const g = await gather(admin, userId)
  const child = pickChild(g)
  if (!child) return { ok: false, reason: 'no child' }

  // One unread insight at a time. Stacking them turns the alert into a pile.
  if (!opts?.force) {
    const { count } = await admin.from('digi_prompts').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('kind', 'insight').eq('status', 'pending')
    if ((count ?? 0) > 0) return { ok: false, reason: 'unread insight waiting' }
  }

  const band = (child.age_band ?? null) as AgeBand | null
  const stage = band ? getStageFromAgeBand(band) : null
  const kidName = child.name && child.name !== 'Your child' ? child.name : 'your child'

  const [researchRes, scriptsRes, lessonsRes, proven] = await Promise.all([
    band
      ? admin.from('expert_knowledge').select('source_name, finding, created_at').eq('active', true).contains('age_bands', [band]).order('created_at', { ascending: false }).limit(14)
      : admin.from('expert_knowledge').select('source_name, finding, created_at').eq('active', true).order('created_at', { ascending: false }).limit(10),
    child.stage_id ? admin.from('scripts').select('sort_order, title, situation').eq('stage_id', child.stage_id).order('sort_order').limit(40) : Promise.resolve({ data: [] }),
    child.stage_id ? admin.from('lessons').select('id, title').eq('stage_id', child.stage_id).eq('audience', 'parent').limit(20) : Promise.resolve({ data: [] }),
    getProvenSolutions(admin, band, '', 3).catch(() => ''),
  ])
  const research = (researchRes.data ?? []) as { source_name: string; finding: string }[]
  const scripts = (scriptsRes.data ?? []) as { sort_order: number; title: string; situation: string | null }[]
  const lessons = (lessonsRes.data ?? []) as { id: string; title: string }[]

  const links = [
    ...scripts.map(s => ({ href: `/dashboard/scripts/${s.sort_order}`, label: `script "${s.title}"${s.situation ? `: ${s.situation.slice(0, 80)}` : ''}` })),
    ...lessons.map(l => ({ href: `/dashboard/lessons/${l.id}`, label: `lesson "${l.title}"` })),
    ...FIXED_LINKS,
  ]
  const allowed = new Set(links.map(l => l.href))
  const sourceNames = new Set(research.map(r => r.source_name))
  // The horizons carry their own named sources, and a forecast that leans on
  // one must be allowed to name it, or the check below would blank it.
  for (const h of horizonsFor(band)) sourceNames.add(h.source)

  const mine = <T extends { child_id: string | null }>(rows: T[]) => rows.filter(r => r.child_id === child.id || r.child_id === null)
  const brief = [
    `THE CHILD: ${kidName}, age band ${band ?? 'unknown'}${stage ? `, Stage ${stage.id} of 5, ${stage.name} (${stage.ages})` : ''}. ${g.kids.length > 1 ? `The family has ${g.kids.length} children; this insight is about ${kidName} only.` : ''}`,
    '',
    'THE LAST FORTNIGHT, THIS FAMILY:',
    mine(g.concerns).length
      ? `Live worries: ${mine(g.concerns).map(c => `${c.label} (${c.status === 'improving' ? 'getting better' : 'open'}, flagged ${c.times_flagged ?? 1}x${c.score != null ? `, last rated ${c.score} of 5` : ''})`).join('; ')}.`
      : 'No live worries named at the check in.',
    g.shifts.length ? `Check in shifts: ${g.shifts.map(s => `${s.week_start}: ${s.direction ?? 'flat'}${s.summary ? `, ${s.summary.slice(0, 120)}` : ''}`).join(' | ')}.` : null,
    mine(g.scripts).length
      ? `Scripts opened: ${mine(g.scripts).map(s => `"${s.title}"${s.worked ? ` (${s.worked === 'yes' ? 'worked' : s.worked === 'somewhat' ? 'sort of worked' : 'did not work'})` : ' (not rated)'}`).join('; ')}.`
      : 'No scripts opened.',
    mine(g.questions).length ? `Asked DiGi: ${mine(g.questions).map(q => `"${q.question.slice(0, 120)}"`).join('; ')}.` : 'Nothing asked of DiGi.',
    mine(g.memory).length ? `What DiGi remembers: ${mine(g.memory).map(m => `${m.kind}: ${m.content.slice(0, 140)}`).join('; ')}.` : null,
    `This week: ${g.jobsApproved} jobs approved, ${g.minutesSpent} minutes of earned screen time spent, ${g.tonightTaps} tonight taps, ${g.moments} moments done.`,
    '',
    g.past.length
      ? `PREVIOUS INSIGHTS (never repeat these angles): ${g.past.map(p => `"${p.title}"${p.reaction === 'helped' ? ' (helped)' : p.reaction === 'not' ? ' (did NOT help, take a different line)' : ''}`).join('; ')}.`
      : 'No previous insights.',
    '',
    `THE RESEARCH BANK FOR THIS AGE (name a source exactly as written, or none):`,
    ...research.map(r => `- ${r.source_name}: ${r.finding.slice(0, 220)}`),
    proven ? `\n${proven.slice(0, 900)}` : '',
    renderHorizons(band, kidName),
    '',
    'LINKS YOU MAY USE (copy one href exactly):',
    ...links.slice(0, 70).map(l => `- ${l.href}  ${l.label}`),
    '',
    'Write the JSON now.',
  ].filter(l => l !== null).join('\n')

  let parsed: Parsed | null = null
  try {
    parsed = parse(await callModel(SYSTEM, brief))
  } catch (err) {
    return { ok: false, reason: `model: ${err instanceof Error ? err.message : String(err)}`.slice(0, 200) }
  }
  if (!parsed) return { ok: false, reason: 'model returned nothing usable' }

  // The guardrails the prompt cannot enforce on its own.
  const href = allowed.has(parsed.href) ? parsed.href : '/dashboard/digi'
  const source = parsed.source && sourceNames.has(parsed.source) ? parsed.source : null
  const clean = (s: string) => stripDashes(s).replace(/\s+/g, ' ').trim()
  const hook = clean(parsed.hook).slice(0, 120)
  const body = `${stripDashes(parsed.insight).trim()}\n\n**Do this next.** ${clean(parsed.do_next)}`
  const cta = clean(parsed.cta || 'Open it').slice(0, 40)

  const { data: row, error } = await admin.from('digi_prompts').insert({
    user_id: userId,
    child_id: child.id,
    kind: 'insight',
    title: hook,
    body,
    href,
    cta,
    source,
    reason: 'DiGi\'s word: the twice weekly insight from the family\'s fortnight and the research for this age.',
  }).select('id, child_id, title, body, href, cta, source, status, reaction, created_at').single()
  if (error || !row) return { ok: false, reason: `insert: ${error?.message ?? 'no row'}` }

  return { ok: true, word: row as DigiWord, childName: kidName }
}

/** The alert on the phone. Best effort, one line, never the whole insight. */
export async function pushWord(userId: string, word: DigiWord): Promise<void> {
  try {
    await sendPush({
      userId,
      title: 'DiGi wants to tell you something',
      body: word.title,
      url: '/dashboard/word',
    })
  } catch { /* the card on Home still carries it */ }
}
