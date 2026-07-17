import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import Anthropic from '@anthropic-ai/sdk'

// DiGi's agreed weekly plan. After the Sunday check in (how the parent is, what
// went well, what was hardest, what they want next week to feel like) DiGi hands
// back one to three small, concrete, evidence based steps for the week. Grounded
// in the experts the platform stands on (Dr Becky Kennedy, Sue Atkins, emotion
// coaching), calibrated to this family's own answers, never a lecture, never a
// hard rule. A deterministic fallback means the plan is never empty.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 45_000,
  maxRetries: 1,
})

export type PlanAnswers = {
  parentMood: number | null
  wentWell: string[]
  hardest: string[] // concern labels, human readable
  focus: string | null // what they want next week to feel like
  childName: string
}

export type PlanStep = { title: string; why: string; expert: string }

function noDashes(s: string): string {
  return s.replace(/\s*[—–]\s*/g, ', ').replace(/\s+-\s+/g, ', ').trim()
}

// A solid, attributable plan built straight from the answers, so there is always
// a real plan even with no model key.
export function fallbackPlan(a: PlanAnswers): PlanStep[] {
  const kid = a.childName || 'your child'
  const steps: PlanStep[] = []
  const focus = (a.focus ?? '').toLowerCase()

  if (focus.includes('morning')) {
    steps.push({ title: `Set one calm morning anchor with ${kid}`, why: `Pick the single point that goes wrong most and handle just that one, calmly, the same way each day. A predictable routine lowers the morning battle more than any new rule.`, expert: 'Sue Atkins' })
  } else if (focus.includes('screen')) {
    steps.push({ title: `Agree the screen off point together before it happens`, why: `Name the stopping point with ${kid} when everyone is calm, not mid game. A limit set with warmth ahead of time lands far better than one enforced in the heat of it.`, expert: 'Sue Atkins' })
  } else if (focus.includes('connect')) {
    steps.push({ title: `Ten unhurried minutes with ${kid}, their choice`, why: `Let ${kid} lead what you do together, no phones, no agenda. Connection before correction is the thing that makes everything else easier all week.`, expert: 'Dr Becky Kennedy' })
  } else if (focus.includes('sleep')) {
    steps.push({ title: `Screens down an hour before ${kid}'s bed`, why: `Bank the last of the day's minutes for tomorrow and keep the hour before bed calm. It is one of the clearest levers in the evidence for better sleep.`, expert: 'The evidence' })
  } else {
    steps.push({ title: `One small warm win with ${kid} each day`, why: `Start next week with connection, not a longer list. A child who feels seen meets you halfway on everything else.`, expert: 'Dr Becky Kennedy' })
  }

  if (a.hardest.length > 0) {
    const h = a.hardest[0]
    steps.push({ title: `Name the feeling first when ${h.toLowerCase()} comes up`, why: `Before any limit, say what you see: you really wanted that, this feels unfair. A child who feels felt calms faster and hears you sooner.`, expert: 'Emotion coaching' })
  }

  if ((a.parentMood ?? 3) <= 2) {
    steps.push({ title: `One thing this week that is just for you`, why: `You cannot pour from an empty cup, and a steadier you is the biggest thing ${kid} feels. Ten minutes counts.`, expert: 'Dr Becky Kennedy' })
  }

  return steps.slice(0, 3).map(s => ({ ...s, title: noDashes(s.title), why: noDashes(s.why) }))
}

export async function generateWeeklyPlan(a: PlanAnswers): Promise<PlanStep[]> {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackPlan(a)

  const prompt = `You are DiGi, a warm, evidence led parenting guide. A parent has just done their Sunday check in. From their answers, hand back a short agreed plan for the week ahead: one to three small, concrete, doable steps. Ground every step in what the leading child and parent wellbeing experts teach: Dr Becky Kennedy (connection before correction, two things are true), Sue Atkins (the calm confident boundary), emotion coaching (name the feeling first). Warm, plain, British, direct. Never a lecture, never shame, never a rigid rule. Never use a dash of any kind.

Their answers this week:
- How the parent is feeling (1 low to 5 good): ${a.parentMood ?? 'not said'}
- What went well: ${a.wentWell.join(', ') || 'not said'}
- What felt hardest: ${a.hardest.join(', ') || 'not said'}
- What they want next week to feel like: ${a.focus ?? 'not said'}
- Child: ${a.childName}

Return ONLY compact JSON, no prose around it:
{"steps":[{"title":"a short doable step, a few words","why":"one warm sentence on why it helps, tied to their answer","expert":"the expert or idea it draws on, eg Dr Becky Kennedy, Sue Atkins, Emotion coaching"}]}
One to three steps. Keep each title short enough to read at a glance.`

  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 600, messages: [{ role: 'user', content: prompt }] })
      const raw = firstText(msg)
      const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)
      const parsed = JSON.parse(json) as { steps?: { title?: string; why?: string; expert?: string }[] }
      const steps = (parsed.steps ?? [])
        .filter(s => s && typeof s.title === 'string' && s.title.trim())
        .slice(0, 3)
        .map(s => ({
          title: noDashes(String(s.title).trim()),
          why: noDashes(String(s.why ?? '').trim()),
          expert: noDashes(String(s.expert ?? 'The evidence').trim()) || 'The evidence',
        }))
      if (steps.length > 0) return steps
    } catch (err) {
      const modelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!modelError) break
    }
  }
  return fallbackPlan(a)
}
