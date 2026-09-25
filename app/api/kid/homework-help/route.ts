import { NextResponse, type NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { yearGroupFromDob } from '@/lib/learning/calendar'
import { isAcceptedImageType, type AcceptedImageType } from '@/lib/school/extract'
import { ukToday } from '@/lib/kid/five-a-day'
import { sendPush } from '@/lib/push/send'
import {
  ageOn, mayHaveHints, minutesGuide, parseHintCard,
  HINTS_PER_DAY, MAX_HINT_LEVEL,
} from '@/lib/homework/help'

// Homework help, from the child's app (25 September 2026). See
// plans/2026-09-25-homework-help-plan.md.
//
// Two modes, and the split is Justin's rule, "as long as the child does not
// access the LLM version":
//
//   hint     aged 10 and over, checked HERE and not only on the screen. The
//            homework goes in (typed, or a photo read once and never kept) and
//            one fixed card comes back: what it is about, what the teacher is
//            looking for, one hint, one thing to try. There is no chat and no
//            follow up box, so there is nothing to talk to.
//   grownup  any age. No model at all: the parent's phone gets "Teo would
//            like a hand with homework", opening the parent's decoder.
//
// THE HINT NEVER CONTAINS THE ANSWER. Level three is a worked step on a
// different example, never this one. Same trust model as the rest of the
// child app: the link token is the auth and scopes everything to one child.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_TEXT = 1500
const MAX_BASE64 = 5_000_000

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

/** Count one use for today and say whether it fits under the cap. Fails open
 *  until migration 354 has run, like the rest of the kid routes do. */
async function takeUse(admin: ReturnType<typeof createAdminClient>, childId: string): Promise<boolean> {
  const day = ukToday()
  try {
    const { data, error } = await admin.from('kid_homework_help_uses')
      .select('uses').eq('child_id', childId).eq('day', day).maybeSingle()
    if (error) return true
    const uses = (data as { uses?: number } | null)?.uses ?? 0
    if (uses >= HINTS_PER_DAY) return false
    await admin.from('kid_homework_help_uses')
      .upsert({ child_id: childId, day, uses: uses + 1 }, { onConflict: 'child_id,day' })
    return true
  } catch {
    return true
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {
    token?: unknown; mode?: unknown; text?: unknown; image?: { media_type?: unknown; base64?: unknown }
    level?: unknown; previous?: unknown
  } | null
  const token = typeof body?.token === 'string' ? body.token : ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const admin = createAdminClient()
  const { data: link } = await admin.from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  const { data: child } = await admin.from('children')
    .select('name, date_of_birth, age_band').eq('id', link.child_id).maybeSingle()
  const dob = (child as { date_of_birth?: string | null } | null)?.date_of_birth ?? null
  const band = (child as { age_band?: string | null } | null)?.age_band ?? null
  const name = child?.name && child.name !== 'Your child' ? String(child.name) : 'Your child'

  // ── ASK THE GROWN UP ────────────────────────────────────────────────────
  if (body?.mode === 'grownup') {
    if (!(await takeUse(admin, link.child_id))) {
      return NextResponse.json({ ok: false, message: 'Your grown up already knows. Go and find them.' })
    }
    try {
      await sendPush({
        userId: link.user_id,
        title: `${name} would like a hand with homework`,
        body: 'Five minutes together is plenty. Homework help can tell you what it is about.',
        url: `/dashboard/homework?child=${link.child_id}`,
      })
    } catch { /* the screen still tells them to go and ask */ }
    return NextResponse.json({ ok: true, sent: true })
  }

  // ── HINTS, 10 AND OVER ONLY ─────────────────────────────────────────────
  if (!mayHaveHints(dob, band)) {
    return NextResponse.json({ ok: false, reason: 'ask_grownup' }, { status: 403 })
  }

  const text = typeof body?.text === 'string' ? body.text.trim().slice(0, MAX_TEXT) : ''
  let image: { mediaType: AcceptedImageType; base64: string } | null = null
  if (body?.image && typeof body.image.base64 === 'string') {
    if (!isAcceptedImageType(body.image.media_type)) {
      return NextResponse.json({ ok: false, message: 'That photo did not work. Try taking it again.' }, { status: 400 })
    }
    if (body.image.base64.length > MAX_BASE64) {
      return NextResponse.json({ ok: false, message: 'That photo is too big. Try again.' }, { status: 413 })
    }
    image = { mediaType: body.image.media_type, base64: body.image.base64 }
  }
  if (text.length < 3 && !image) {
    return NextResponse.json({ ok: false, message: 'Type the question, or take a photo of it.' }, { status: 400 })
  }
  const level = Math.min(MAX_HINT_LEVEL, Math.max(1, Number(body?.level) || 1))
  const previous = Array.isArray(body?.previous)
    ? (body!.previous as unknown[]).filter((p): p is string => typeof p === 'string').map(p => p.slice(0, 400)).slice(0, 3)
    : []

  if (!(await takeUse(admin, link.child_id))) {
    return NextResponse.json({ ok: false, message: 'That is enough hints for today. Have a go on your own, or ask your grown up.' })
  }

  // The curriculum only where we hold it: England, Year 1 to 6. Older years
  // still get a hint, with no statutory line claimed.
  const age = ageOn(dob)
  const yearGroup = yearGroupFromDob(dob)
  let objectives: { id: string; subject: string; strand: string; objective: string }[] = []
  if (yearGroup !== null && yearGroup >= 1 && yearGroup <= 6) {
    const { data: rows } = await admin.from('curriculum_objectives')
      .select('id, subject, strand, objective')
      .eq('curriculum', 'england').eq('year_group', yearGroup)
      .order('subject', { ascending: true }).order('sort_order', { ascending: true })
    objectives = (rows ?? []) as typeof objectives
  }
  const allowed = new Map(objectives.map(o => [o.id, o]))

  const levelRule = level === 1
    ? 'This is the FIRST hint: a small nudge. Point at where to start, not how to finish.'
    : level === 2
      ? 'This is the SECOND hint: a bigger nudge. Name the method or the next step, still without doing it.'
      : 'This is the THIRD and last hint: show the method worked through on a DIFFERENT, simpler example of your own, never on their question.'

  const system = `You are DiGi, the friendly guide in Guided Childhood's app for children. A child${age !== null ? ` aged ${age}` : ''}${yearGroup ? ` in Year ${yearGroup} in England` : ''} is stuck on their homework and has shared it with you.

You give HINTS, never answers. You are a coach at their shoulder, not someone who does it for them.

${objectives.length > 0 ? `The statutory national curriculum objectives for their year, with ids. If the homework comes from one, give its id.\n${objectives.map(o => `[${o.id}] (${o.subject}, ${o.strand}) ${o.objective}`).join('\n')}\n` : ''}
Rules. The first four matter more than being helpful:
1. NEVER give the answer, the final number, the finished sentence, or a completed piece of their work. Not in the hint, not in the question, not anywhere.
2. ${levelRule}
3. If the message shows the child is upset, unsafe, being hurt, or talks about harming themselves, set "safe": false and leave every other field empty. A grown up takes it from there.
4. If it is not homework, set "on_topic": false and say kindly in "about" that you only help with homework here.
5. Speak to the child, warmly and simply, for their age. Short sentences. UK spelling. No dashes anywhere.
6. Never say or hint that they are behind, ahead or struggling.
${previous.length > 0 ? `7. They have already had these hints, so do not repeat them:\n${previous.map(p => `- ${p}`).join('\n')}` : ''}

Reply with ONLY this JSON:
{
  "safe": true,
  "on_topic": true,
  "subject": "one or two words, like Maths or Spelling",
  "ids": ["matching curriculum ids from the list, at most one, empty if none or no list"],
  "about": "one sentence: what this homework is practising, in their words",
  "teacher_wants": "one sentence: what their teacher is looking for in a good answer",
  "hint": "the hint, two sentences at most",
  "try_this": "one short question for them to answer that moves them forward"
}`

  const content: Anthropic.ContentBlockParam[] = []
  if (image) content.push({ type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } })
  content.push({ type: 'text', text: text ? `My homework:\n\n${text}` : 'My homework is in the photo.' })

  let card
  let ids: string[] = []
  try {
    const res = await callDigi({ model: DIGI_MODEL, max_tokens: 600, system, messages: [{ role: 'user', content }] })
    const raw = firstText(res)
    card = parseHintCard(raw)
    try {
      const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '{}') as { ids?: unknown }
      // Revalidated: an id we did not offer is an invention, dropped.
      ids = Array.isArray(parsed.ids) ? parsed.ids.filter((i): i is string => typeof i === 'string' && allowed.has(i)).slice(0, 1) : []
    } catch { /* no link, the card still stands */ }
  } catch {
    return NextResponse.json({ ok: false, message: 'DiGi could not look just then. Have another go in a moment.' }, { status: 502 })
  }
  if (!card) return NextResponse.json({ ok: false, message: 'DiGi could not read that. Try typing the question.' }, { status: 502 })

  if (!card.safe) {
    return NextResponse.json({ ok: true, safe: false })
  }

  const match = ids[0] ? allowed.get(ids[0]) : null
  return NextResponse.json({
    ok: true,
    safe: true,
    onTopic: card.onTopic,
    level,
    maxLevel: MAX_HINT_LEVEL,
    subject: card.subject,
    about: card.about,
    teacherWants: card.teacherWants,
    hint: card.hint,
    tryThis: card.tryThis,
    curriculum: match ? { yearGroup, strand: match.strand, objective: match.objective } : null,
    minutes: minutesGuide(age),
  })
}
