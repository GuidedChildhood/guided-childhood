import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { hasCrisisLanguage, lexicalFlags, highestSeverity } from '@/lib/digi/safety'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// The Right Now rescue for the moment that is not on the tiles. The parent
// types one line about what is happening and DiGi writes the calm words on the
// spot: say this, not this, in the house register, for this child's stage.
// Mid meltdown "something else" used to dump the parent into the script library
// to browse; now it answers.
//
// Safety runs both sides. Crisis language in the parent's line never reaches
// the model: the response routes straight to humans (Samaritans, 999, GP). And
// the generated words get the same lexical check every DiGi reply gets, logged
// to digi_safety_flags, never blocking.

export const maxDuration = 30
export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 25_000,
  maxRetries: 1,
})

const CRISIS_RESPONSE = {
  crisis: true as const,
  title: 'This needs a human, right now',
  say_this: 'You matter to me more than anything on that screen. I am here, I am not angry, and we are going to get through this together, tonight.',
  not_this: 'Do not handle this alone. If there is immediate danger call 999. Otherwise Samaritans are on 116 123 any hour, and your GP or CAMHS is the next step tomorrow.',
}

async function generate(prompt: string): Promise<string> {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 350, messages: [{ role: 'user', content: prompt }] })
      return firstText(msg)
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json().catch(() => ({} as { detail?: string }))
  const detail = typeof body.detail === 'string' ? body.detail.replace(/\s+/g, ' ').trim().slice(0, 280) : ''
  if (!detail) return NextResponse.json({ error: 'Tell us in one line what is happening' }, { status: 400 })

  // Crisis language routes to humans before any model is called.
  if (hasCrisisLanguage(detail)) {
    return NextResponse.json(CRISIS_RESPONSE)
  }

  const { data: child } = await supabase
    .from('children')
    .select('id, name, age_band')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const stage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : STAGES[2]
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'their child'

  const prompt = `A UK parent is in a hard moment RIGHT NOW and needs calm words this second. You are DiGi, the Guided Childhood advisor.

The child: ${childName}, stage ${stage.id} (${stage.name}, ages ${stage.ages}).
The parent says is happening: ${detail}

Write the rescue card. Rules, all hard:
- say_this: two to four short sentences the parent says OUT LOUD to the child. Warm, calm, connection before compliance: name the feeling first, then hold one clear boundary. Age appropriate for ${stage.ages}. Never allow or deny as a flat rule, never shame, never sarcasm.
- not_this: one sentence of what NOT to say in this moment and why in a few words.
- title: a plain four to eight word name for this moment.
- British English. No dashes anywhere in any field. No emoji.

Reply with ONLY valid JSON: {"title":"...","say_this":"...","not_this":"..."}`

  let title = 'The words for this moment'
  let sayThis = ''
  let notThis = ''
  try {
    const text = await generate(prompt)
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no json')
    const parsed = JSON.parse(match[0]) as { title?: string; say_this?: string; not_this?: string }
    title = (parsed.title ?? title).slice(0, 90)
    sayThis = (parsed.say_this ?? '').slice(0, 600)
    notThis = (parsed.not_this ?? '').slice(0, 300)
    if (!sayThis) throw new Error('empty')
  } catch {
    return NextResponse.json({ error: 'DiGi could not write the words just then. Try once more, or talk it through with DiGi.' }, { status: 502 })
  }

  // Post hoc safety on the generated words, logged, never blocking.
  try {
    const flags = lexicalFlags(detail, `${sayThis} ${notThis}`)
    if (flags.length > 0) {
      await createAdminClient().from('digi_safety_flags').insert({
        user_id: user.id,
        stage_id: stage.id ? String(stage.id) : null,
        question: `Right now custom: ${detail}`,
        reply: `${sayThis} || ${notThis}`,
        violations: flags,
        severity: highestSeverity(flags),
        source: 'live',
      })
    }
  } catch { /* best effort */ }

  // The moment feeds the same loops as everything else: the insight agent
  // (what parents actually face) and the concerns ledger (so tomorrow asks
  // how it went). Best effort, never blocks the rescue.
  try {
    await supabase.from('digi_questions').insert({
      user_id: user.id,
      child_id: child?.id ?? null,
      stage_id: stage.id,
      question: `Right now: ${detail}`,
      response: sayThis,
    })
  } catch { /* best effort */ }

  try {
    const now = new Date().toISOString()
    const { data: prior } = await supabase
      .from('concerns')
      .select('status, times_flagged')
      .eq('user_id', user.id)
      .eq('slug', 'rightnow-custom')
      .maybeSingle()
    await supabase.from('concerns').upsert({
      user_id: user.id,
      child_id: child?.id ?? null,
      source: 'rightnow',
      slug: 'rightnow-custom',
      label: detail.slice(0, 200),
      status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
      times_flagged: prior ? prior.times_flagged + 1 : 1,
      last_flagged_at: now,
    }, { onConflict: 'user_id,slug' })
  } catch { /* best effort */ }

  return NextResponse.json({ title, say_this: sayThis, not_this: notThis, custom: true })
}
