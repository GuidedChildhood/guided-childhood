import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

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

// Turn a moment's advice into a real quest the child can do. The moment advice
// is written for the parent (anchor bedtime to a routine, serve dinner
// deconstructed). This translates it into one small, doable, child voice task
// the child ticks for stars on their own app, so the parent's insight becomes
// the child's action. It follows the advice, never invents a new rule, and it
// lands straight on the child's page.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { momentId } = await request.json().catch(() => ({})) as { momentId?: string }
  if (!momentId || !/^[0-9a-f-]{36}$/i.test(momentId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const [{ data: moment }, { data: child }] = await Promise.all([
    supabase.from('daily_moments').select('title, category, science_brief, solutions').eq('id', momentId).single(),
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])
  if (!moment) return NextResponse.json({ error: 'moment not found' }, { status: 404 })

  const childName = (child as { name?: string } | null)?.name ?? 'your child'
  const ageBand = (child as { age_band?: string } | null)?.age_band ?? null

  // The advice we are turning into a task: the moment's own solutions.
  const advice = Array.isArray(moment.solutions) ? (moment.solutions as string[]).join(' ') : ''

  const system = `You are DiGi for Guided Childhood. A parent read a moment card about "${moment.title}" (${moment.category}) and wants to turn its advice into ONE small daily quest their child ${childName}${ageBand ? `, age band ${ageBand}` : ''} can do and tick off for stars on their own app.

Turn the parent facing advice into a single child facing task, in the child's own voice, that they can actually do themselves and follows the advice. Warm, positive, doable, never a punishment and never allow or deny. No dashes anywhere.

The parent advice to follow: ${advice || moment.science_brief}

Reply with ONLY this JSON, no prose:
{
  "title": "the task in the child's voice, a doable action, max 8 words, e.g. Do my bedtime routine: bath, book, lights",
  "emoji": "one single emoji that fits",
  "stars": 2,
  "blocks_screens": false
}
Set blocks_screens true only when the task is clearly a get ready or wind down step that should come before screen time.`

  let title = `My ${moment.category.toLowerCase()} task`
  let emoji = '⭐'
  let stars = 2
  let blocksScreens = false
  try {
    const res = await callDigi({
      model: DIGI_MODEL,
      max_tokens: 200,
      system,
      messages: [{ role: 'user', content: `Make the quest for ${childName} from "${moment.title}".` }],
    })
    const match = firstText(res).match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0]) as { title?: string; emoji?: string; stars?: number; blocks_screens?: boolean }
      if (parsed.title) title = String(parsed.title).replace(/[-–—]/g, ' ').slice(0, 120)
      if (parsed.emoji) emoji = String(parsed.emoji).slice(0, 8)
      if (Number.isFinite(parsed.stars)) stars = Math.min(3, Math.max(1, Math.round(Number(parsed.stars))))
      blocksScreens = Boolean(parsed.blocks_screens)
    }
  } catch { /* fall back to the sensible default title */ }

  const { data: quest, error } = await supabase.from('family_quests').insert({
    user_id: user.id,
    child_id: (child as { id?: string } | null)?.id ?? null,
    title,
    emoji,
    stars,
    schedule: 'daily',
    blocks_screens: blocksScreens,
  }).select('id, title, emoji, stars').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Land it on the child's phone too, so it is genuinely sent, not just saved.
  const childId = (child as { id?: string } | null)?.id
  if (childId) {
    try {
      await pushToChild(createAdminClient(), user.id, childId, 'New quest from home ⭐', `${emoji} ${title}. Do it to earn ${stars} star${stars === 1 ? '' : 's'}.`)
    } catch { /* the quest is saved either way */ }
  }

  return NextResponse.json({ quest, childName })
}
