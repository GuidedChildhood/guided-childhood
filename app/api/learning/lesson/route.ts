import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { yearGroupFromDob } from '@/lib/learning/calendar'
import { validateDeck, scrub, DECK_FAILURE_MESSAGE } from '@/lib/learning/tutor-deck'
import Anthropic from '@anthropic-ai/sdk'

// The private tutor: turn the homework a parent has just decoded into a real
// lesson the child can play.
//
// Justin, 11 August 2026: "if a parent is concerned about their kid learning at
// school we can provide a private tutor linked to DiGi and run through the best
// typical lessons."
//
// The decoder tells a parent what the homework is. That helps them and does
// nothing for the child, who still has to learn the thing. This is the other
// half: the same statutory objectives, taught.
//
// ── THE LESSON IS GENERATED HERE AND NOWHERE ELSE ───────────────────────────
//
// This route runs on the parent's session. The deck it produces is stored, the
// parent reads it and decides, and only then does a child ever see it. That is
// deliberate and it is the reason the slides live in a table rather than being
// assembled on demand: there is no model call on the child's device, and there
// is not going to be one by accident. scripts/check-child-has-no-model.mjs is
// the mechanical version of that sentence.
//
// ── WHAT IS CARRIED OVER FROM THE DECODER, UNCHANGED ────────────────────────
//
// One year group of objectives, never all 448. Every id revalidated against the
// set we sent, because a model is no more an authority than a client is. Refuse
// rather than guess when we do not know the year. An invented statutory line is
// the one thing this whole surface must never produce.
//
// ── WHAT IS NEW, AND WHY IT IS NARROW ───────────────────────────────────────
//
// The deck is limited to six slide types. The contract has fifteen, and several
// of them are traps for a model: `stat` demands a real figure with a real
// source, `video` demands a URL that exists, `scenario` is a fabricated social
// post. A tutor lesson for a nine year old needs none of those and every one of
// them would be invented. So the allowlist is the plain teaching shapes, and
// anything else the model reaches for is dropped rather than shown.

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

async function callDigi(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
    try {
      return await anthropic.messages.create({ ...params, model })
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

const MAX_HOMEWORK = 2000

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as {
    childId?: string
    text?: string
    objectiveIds?: unknown
    origin?: string
  }
  const origin = body.origin === 'checkpoint' ? 'checkpoint' : 'homework'
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_HOMEWORK) : ''

  const { data: kids } = await supabase
    .from('children').select('id, name, date_of_birth, age_band')
    .eq('parent_id', user.id).order('is_primary', { ascending: false })
  const child = (kids ?? []).find(k => k.id === body.childId) ?? (kids ?? [])[0] ?? null
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const yearGroup = yearGroupFromDob(child.date_of_birth as string | null)
  if (yearGroup === null || yearGroup < 1 || yearGroup > 6) {
    return NextResponse.json({
      ok: false,
      reason: yearGroup === null ? 'no_birthday' : 'out_of_range',
      childName: child.name ?? null,
    })
  }

  // This child's year, every subject. Same reasoning as the decoder: a Year 6
  // objective taught to a Year 2 child would read as authoritative and be wrong
  // in the most damaging direction.
  const { data: rows } = await supabase
    .from('curriculum_objectives')
    .select('id, subject, strand, objective, checkpoint')
    .eq('curriculum', 'england')
    .eq('year_group', yearGroup)
    .order('subject', { ascending: true })
    .order('sort_order', { ascending: true })

  const all = (rows ?? []) as { id: string; subject: string; strand: string; objective: string; checkpoint: string | null }[]
  if (all.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no_curriculum', childName: child.name ?? null })
  }
  const allowed = new Map(all.map(o => [o.id, o]))

  // Which objectives this lesson teaches.
  //
  // For homework the parent hands us the ids the decoder returned, and they are
  // revalidated here rather than trusted: the client is a form, not an
  // authority, which is the rule the sheet and the quest writer both follow.
  //
  // For a checkpoint they come from the curriculum's own flag, so nothing is
  // passed in at all. The Year 4 tables check and the Year 1 phonics screening
  // are real, dated and national, and practising for a test a child will
  // genuinely sit is not us grading them.
  let teaching: typeof all
  if (origin === 'checkpoint') {
    teaching = all.filter(o => o.checkpoint).slice(0, 4)
    if (teaching.length === 0) {
      return NextResponse.json({ ok: false, reason: 'no_checkpoint', childName: child.name ?? null, yearGroup })
    }
  } else {
    const ids = Array.isArray(body.objectiveIds)
      ? body.objectiveIds.filter((i): i is string => typeof i === 'string' && allowed.has(i)).slice(0, 3)
      : []
    if (ids.length === 0 && text.length < 3) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 })
    }
    teaching = ids.map(id => allowed.get(id)!)
  }

  const childName = child.name && child.name !== 'Your child' ? String(child.name) : 'your child'
  const bandLine = child.age_band ? `They are in the ${child.age_band} band.` : ''
  const subject = teaching[0]?.subject ?? null

  const objectiveLines = teaching.length > 0
    ? teaching.map(o => `- (${o.subject}, ${o.strand}) ${o.objective}`).join('\n')
    : '(none matched, so teach what the homework itself is asking for)'

  const system = `You are DiGi for Guided Childhood, writing a short private tutor lesson for one child. ${childName} is in Year ${yearGroup} in England. ${bandLine}

${origin === 'checkpoint'
  ? `This is practice for a check they will actually sit at school. Teach these statutory objectives:`
  : `A grown up has given you the homework below and these are the statutory national curriculum objectives it comes from. Teach the idea behind them, so the homework makes sense afterwards:`}

${objectiveLines}
${text ? `\nThe homework itself:\n${text}\n` : ''}
Write the lesson as a deck of slides. Aim for 8 to 11 slides in this order:
1. one "title" slide
2. two or three "concept" slides that teach the idea, smallest step first, with a worked example in the body
3. one "tryit" slide: something they do on paper or out loud, right now
4. THREE "choice" slides that check they got it, each harder than the last
5. one "recap" slide with 3 short points
6. one "digi" slide, one or two warm closing lines

Rules. The first three matter more than the lesson being good:
1. Never tell ${childName} they are behind, struggling, weak, bad at this, or catching up. Never use the words tricky, struggling or behind at all. A grown up sent them this because they care, and it has to read like that.
2. Never quote the curriculum wording at them. That is the standard, not a lesson. Say the same thing in words a Year ${yearGroup} child uses.
3. Every "choice" slide must have exactly one correct option and three or four options in total, and every option needs a short feedback line. A wrong answer's feedback points at what to look at again, and never says they got it wrong.
4. Teach, do not test. The concept slides must actually explain the method with a real worked example, numbers and all, not describe it.
5. Warm, plain, direct, and short sentences. This is read on a phone by a child.
6. No dashes anywhere in any text.

Reply with ONLY this JSON, no prose:
{
  "title": "the lesson in the child's own words, max 8 words",
  "emoji": "one single emoji",
  "stars": 3,
  "slides": [
    { "type": "title", "eyebrow": "A lesson just for you", "title": "..." },
    { "type": "concept", "phase": "teach", "heading": "...", "body": "...", "emoji": "..." },
    { "type": "tryit", "phase": "practise", "heading": "...", "body": "..." },
    { "type": "choice", "phase": "prove", "question": "...", "options": [{ "text": "...", "correct": true, "feedback": "..." }, { "text": "...", "correct": false, "feedback": "..." }] },
    { "type": "recap", "phase": "close", "heading": "...", "points": ["...", "...", "..."] },
    { "type": "digi", "phase": "close", "heading": "...", "lines": ["..."] }
  ]
}`

  let raw: unknown
  try {
    const res = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: `Write the lesson for ${childName}.` }],
    })
    const match = firstText(res).match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no json')
    raw = JSON.parse(match[0])
  } catch {
    return NextResponse.json({ error: 'DiGi could not write that just then. Have another go in a moment.' }, { status: 502 })
  }

  const parsedTop = scrub(raw) as { title?: unknown; emoji?: unknown; stars?: unknown; slides?: unknown }

  // The allowlist, the contract's own parse, the two question floor and the
  // deficit sweep, all in lib/learning/tutor-deck so they can be tested without
  // spending a token. See the note at the top of that file.
  const deck = validateDeck(parsedTop.slides)
  if (!deck.ok) {
    return NextResponse.json({ error: DECK_FAILURE_MESSAGE[deck.reason] }, { status: 502 })
  }
  const slides = deck.slides

  const title = (typeof parsedTop.title === 'string' && parsedTop.title.trim() ? parsedTop.title : `A ${subject ?? 'lesson'} for you`).slice(0, 120)
  const emoji = typeof parsedTop.emoji === 'string' ? parsedTop.emoji.slice(0, 8) : '📘'
  const stars = Number.isFinite(Number(parsedTop.stars))
    ? Math.min(5, Math.max(2, Math.round(Number(parsedTop.stars))))
    : 3

  const { data: lesson, error } = await supabase.from('tutor_lessons').insert({
    user_id: user.id,
    child_id: child.id,
    origin,
    year_group: yearGroup,
    subject,
    objective_ids: teaching.map(o => o.id),
    title,
    emoji,
    slides,
    stars,
  }).select('id, title, emoji, stars, slides, year_group, subject').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    lesson,
    childName: child.name ?? null,
    yearGroup,
    objectives: teaching.map(o => ({ id: o.id, subject: o.subject, strand: o.strand, objective: o.objective })),
  })
}
