import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { yearGroupFromDob } from '@/lib/learning/calendar'
import Anthropic from '@anthropic-ai/sdk'

// The homework decoder.
//
// A parent looks at "complete the bar model for 3/8 of 24" and has no idea what
// it is, why it is being asked, or how to help without teaching it a way the
// school will then have to undo. That is the nightly friction, and it is not a
// knowledge problem we can fix with encouragement.
//
// So: paste the homework, get back the statutory line it comes from, what that
// line is actually for, and one way to help tonight.
//
// ── Why this needs no assessment ─────────────────────────────────────────────
//
// It is a lookup, start to finish. We are not judging the child, we are naming
// the thing in front of the parent. That is the whole reason this can ship
// while "is my child on track" cannot: one needs evidence about a child, and
// this needs only the curriculum and their year group.
//
// ── Two disciplines carried over from the sheet ──────────────────────────────
//
// FIRST, DiGi only ever sees the objectives for this one child's year. Handing
// it all 448 would let it match a Year 6 line to a Year 2 worksheet, which
// would read as authoritative and be wrong in the most damaging direction.
//
// SECOND, the ids it returns are revalidated against the set we sent. A model
// is no more an authority than a client is. If it invents an id, or reaches for
// an objective we did not offer, the match is dropped rather than trusted.
//
// Nothing is stored. Same rule as the sheet: this is assembled on the day and
// improving an objective improves every future answer rather than leaving old
// ones quietly wrong.

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

  const body = await request.json().catch(() => ({})) as { text?: string; childId?: string }
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_HOMEWORK) : ''
  if (text.length < 3) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const { data: kids } = await supabase
    .from('children').select('id, name, date_of_birth')
    .eq('parent_id', user.id).order('is_primary', { ascending: false })
  const child = (kids ?? []).find(k => k.id === body.childId) ?? (kids ?? [])[0] ?? null
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const yearGroup = yearGroupFromDob(child.date_of_birth as string | null)
  // No birthday, or a year we hold no curriculum for. Say so rather than guess:
  // a decode against the wrong year is worse than no decode, because a parent
  // would believe it and teach from it.
  if (yearGroup === null || yearGroup < 1 || yearGroup > 6) {
    return NextResponse.json({
      ok: false,
      reason: yearGroup === null ? 'no_birthday' : 'out_of_range',
      childName: child.name ?? null,
    })
  }

  // Every subject and every term for this year. Homework does not arrive
  // labelled with a term, and our term ordering is ours rather than the
  // school's, so narrowing by term here would drop the right answer whenever a
  // school sequences differently.
  const { data: rows } = await supabase
    .from('curriculum_objectives')
    .select('id, subject, strand, objective')
    .eq('curriculum', 'england')
    .eq('year_group', yearGroup)
    .order('subject', { ascending: true })
    .order('sort_order', { ascending: true })

  const objectives = (rows ?? []) as { id: string; subject: string; strand: string; objective: string }[]
  if (objectives.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no_curriculum', childName: child.name ?? null })
  }

  const allowed = new Map(objectives.map(o => [o.id, o]))
  const childName = child.name && child.name !== 'Your child' ? String(child.name) : 'your child'

  const system = `You are DiGi for Guided Childhood. A parent has pasted their child's homework and wants to know what it is and how to help. The child is in Year ${yearGroup} in England.

Below are the statutory national curriculum objectives for Year ${yearGroup}, with their ids. Match the homework to the ones it comes from.

${objectives.map(o => `[${o.id}] (${o.subject}, ${o.strand}) ${o.objective}`).join('\n')}

Rules, and the first three matter more than being helpful:
1. Only ever return ids from the list above. If nothing in the list matches, return an empty list and say so. A confident wrong match is far worse than an honest miss.
2. Never say or imply the child is behind, ahead, struggling or at any level. You have not seen the child, only a piece of paper.
3. Never say the school is teaching this now, or that it is on a particular term's plan. You know the year, not the school's sequence.
4. Match at most 3 objectives. One is usually right.
5. No dashes anywhere in your text.

Reply with ONLY this JSON, no prose:
{
  "ids": ["the matching objective ids, most relevant first, empty if none"],
  "plain": "what this homework is actually asking for, in one or two sentences a parent can follow, no jargon",
  "help": "one concrete thing the parent can do at the table tonight, specific to this homework",
  "watch": "one sentence on the thing parents most often get wrong helping with this, or an empty string if there is nothing worth saying"
}`

  let ids: string[] = []
  let plain = ''
  let help = ''
  let watch = ''
  try {
    const res = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 700,
      system,
      messages: [{ role: 'user', content: `${childName}'s homework:\n\n${text}` }],
    })
    const match = firstText(res).match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0]) as { ids?: unknown; plain?: unknown; help?: unknown; watch?: unknown }
      // Revalidated against what we actually sent. An id we did not offer is
      // an invention, and an invented statutory line is the one thing this
      // feature must never put in front of a parent.
      ids = Array.isArray(parsed.ids)
        ? parsed.ids.filter((i): i is string => typeof i === 'string' && allowed.has(i)).slice(0, 3)
        : []
      const clean = (v: unknown) => typeof v === 'string' ? v.replace(/[-–—]/g, ' ').trim() : ''
      plain = clean(parsed.plain)
      help = clean(parsed.help)
      watch = clean(parsed.watch)
    }
  } catch {
    return NextResponse.json({ error: 'DiGi could not read that just then. Have another go in a moment.' }, { status: 502 })
  }

  if (!plain && ids.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no_match', childName: child.name ?? null, yearGroup })
  }

  return NextResponse.json({
    ok: true,
    yearGroup,
    childName: child.name ?? null,
    plain,
    help,
    watch,
    matches: ids.map(id => {
      const o = allowed.get(id)!
      return { id, subject: o.subject, strand: o.strand, objective: o.objective }
    }),
  })
}
