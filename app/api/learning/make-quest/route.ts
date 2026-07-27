import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import Anthropic from '@anthropic-ai/sdk'

// A finished learning sheet, turned into one quest for exactly the thing the
// child said they found hard.
//
// This is the loop. On its own a printable is a nice afternoon and then it is
// over: a family works through a sheet, ticks two things as tricky, and nothing
// in the world changes. The flag was collected and then nobody did anything
// with it, which is the fastest way to teach a child that saying "I found this
// hard" leads nowhere. Here the flag comes back the same day as a small job on
// their own phone, worth stars like every other job, and the parent has a
// reason to print the next sheet.
//
// ── What the quest may and may not be ────────────────────────────────────────
//
// It is practice, never a verdict. The child ticked "I found this tricky",
// which is a brave thing to do, and the only acceptable answer to it is help.
// The word tricky, struggling, behind or wrong must not reach their phone. If
// the quest reads as a punishment for being honest, the child stops being
// honest, and the flag is the entire mechanism the sheet exists for.
//
// One quest, not one per flag. Five separate jobs for five flagged objectives
// is a homework pile, and a parent looking at a board of them sees a list of
// everything their child cannot do. Where several were flagged, DiGi picks the
// one small practice that carries the most of them.
//
// The statutory wording goes to DiGi and stops there. "Recognise and use
// thousandths and relate them to tenths, hundredths and decimal equivalents" is
// the standard, not a task, and it is the parent's own sheet that shows the
// words. The child gets the thing they actually do.

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

const SUBJECT_WORD: Record<string, string> = {
  maths: 'maths', english: 'writing and spelling', reading: 'reading',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { resultId } = await request.json().catch(() => ({})) as { resultId?: string }
  if (!resultId || !/^[0-9a-f-]{36}$/i.test(resultId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // The result, and only this family's. The flags are read back from the row
  // rather than taken from the request, so the quest can only ever be about
  // objectives that were genuinely validated when the sheet was finished. The
  // client is a form, not an authority, the same rule the sheet itself follows.
  const { data: result } = await supabase
    .from('learning_sheet_results')
    .select('id, child_id, year_group, subject, tricky')
    .eq('id', resultId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!result) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const flagged: string[] = ((result.tricky as string[] | null) ?? []).slice(0, 12)
  // Nothing flagged is a real and good answer, and there is no quest to offer
  // for it. Inventing practice for a sheet a child found easy would be us
  // deciding they need work when they told us they did not.
  if (flagged.length === 0) {
    return NextResponse.json({ error: 'nothing flagged' }, { status: 400 })
  }

  const [{ data: objectives }, { data: child }] = await Promise.all([
    supabase.from('curriculum_objectives').select('objective, strand').in('id', flagged),
    supabase.from('children').select('id, name, age_band').eq('id', result.child_id).eq('parent_id', user.id).maybeSingle(),
  ])
  const lines = (objectives ?? []).map(o => `- [${o.strand}] ${o.objective}`)
  if (lines.length === 0) return NextResponse.json({ error: 'nothing flagged' }, { status: 400 })

  const childName = child?.name && child.name !== 'Your child' ? String(child.name) : 'your child'
  const subject = SUBJECT_WORD[String(result.subject)] ?? String(result.subject)

  const system = `You are DiGi for Guided Childhood. ${childName} has just worked through a Year ${result.year_group} ${subject} sheet with a grown up and marked these parts of the national curriculum as ones they found hard:

${lines.join('\n')}

Write ONE small practice task ${childName} can do at home and tick off for stars on their own phone.

Rules, and the first two matter more than being useful:
1. Never name it as something they are bad at or behind on. No tricky, no struggling, no hard, no practise your weak spot. They were honest with us and this is what they get for it, so it has to read like a good thing to do.
2. It is a doable action in the child's own voice, something a ${child?.age_band ? `child in the ${child.age_band} band` : 'primary school child'} can actually start without a grown up explaining it first.
3. If several lines are flagged, pick the ONE small practice that helps the most of them rather than trying to cover them all.
4. Never quote the curriculum wording at the child. That is the standard, not a task.
5. No dashes anywhere in the text.

Reply with ONLY this JSON, no prose:
{
  "title": "the task in the child's voice, max 9 words, e.g. Count up in sixes on the stairs",
  "emoji": "one single emoji that fits",
  "stars": 2
}`

  let title = `My ${subject} practice`
  let emoji = '✏️'
  let stars = 2
  try {
    const res = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 200,
      system,
      messages: [{ role: 'user', content: `Write the practice for ${childName}.` }],
    })
    const match = firstText(res).match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0]) as { title?: string; emoji?: string; stars?: number }
      if (parsed.title) title = String(parsed.title).replace(/[-–—]/g, ' ').slice(0, 120)
      if (parsed.emoji) emoji = String(parsed.emoji).slice(0, 8)
      if (Number.isFinite(parsed.stars)) stars = Math.min(3, Math.max(1, Math.round(Number(parsed.stars))))
    }
  } catch { /* the fallback title is dull but honest, and the quest still lands */ }

  // Weekdays rather than daily. Practice wants repeating, and a short one after
  // school five times is worth more than one heroic go, but a job that also
  // lands on a Saturday morning turns the weekend into school and gets switched
  // off within a week. It sits on the Quests board like any other, so a parent
  // who thinks it has done its job can retire it there.
  const { data: quest, error } = await supabase.from('family_quests').insert({
    user_id: user.id,
    child_id: result.child_id,
    title,
    emoji,
    stars,
    schedule: 'weekdays',
  }).select('id, title, emoji, stars').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // On their phone, not just in the parent's list, or the loop stops here.
  try {
    await pushToChild(
      createAdminClient(), user.id, result.child_id as string,
      'A new one from home ⭐',
      `${emoji} ${title}. Do it to earn ${stars} star${stars === 1 ? '' : 's'}.`,
    )
  } catch { /* the quest is saved either way */ }

  return NextResponse.json({ quest, childName })
}
