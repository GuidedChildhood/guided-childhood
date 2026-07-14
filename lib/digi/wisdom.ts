import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import type { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

// Aggregate wisdom: what tends to work across ALL families, de-identified, so
// DiGi can lean on the wider track record and not only this one family's. The
// rebuild reads the real wins across the base (concerns that turned around,
// scripts marked as worked, reflections a parent said helped), distils them
// with the model into short reusable patterns, and replaces the wisdom rows.
// Only paraphrased patterns are stored, never a family's raw content, and no
// user or child id ever reaches the model.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 120_000,
  maxRetries: 1,
})

export interface WisdomRow {
  topic: string
  age_band: string | null
  what_works: string
  evidence_count: number
}

async function callModel(prompt: string): Promise<string> {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
      return firstText(msg)
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

export interface WisdomRebuild {
  ranAt: string
  signals: number
  written: number
  rows: WisdomRow[]
}

export async function rebuildWisdom(): Promise<WisdomRebuild> {
  const admin = createAdminClient()

  // Pull the de-identified wins. child_id and user_id are read only to join an
  // age band, never sent onward. Ages let the wisdom stay stage aware.
  const [concernsRes, scriptWorkedRes, reflectionsRes, childrenRes] = await Promise.all([
    admin.from('concerns').select('label, status, times_flagged, child_id').in('status', ['resolved', 'improving']).limit(600),
    admin.from('script_completions').select('script_sort_order, worked, user_id').eq('worked', 'yes').limit(600),
    admin.from('digi_feedback').select('question, parent_response').not('parent_response', 'is', null).limit(600),
    admin.from('children').select('id, parent_id, age_band'),
  ])

  const children = childrenRes.data ?? []
  const ageByChild = new Map(children.map(c => [c.id as string, c.age_band as string]))
  const ageByParent = new Map<string, string>()
  for (const c of children) if (!ageByParent.has(c.parent_id as string)) ageByParent.set(c.parent_id as string, c.age_band as string)

  const wins = (concernsRes.data ?? []).map(c => ({
    kind: 'turnaround',
    text: `A family ${c.status === 'resolved' ? 'sorted' : 'is turning around'} "${c.label}"${(c.times_flagged as number) > 2 ? ' after it kept coming back' : ''}.`,
    age: c.child_id ? ageByChild.get(c.child_id as string) ?? null : null,
  }))
  const scriptWins = (scriptWorkedRes.data ?? []).map(s => ({
    kind: 'script',
    text: `A script this parent tried worked for them.`,
    age: s.user_id ? ageByParent.get(s.user_id as string) ?? null : null,
  }))
  const reflectionWins = (reflectionsRes.data ?? [])
    .filter(r => (r.parent_response as string | null)?.trim())
    .map(r => ({
      kind: 'reflection',
      text: `Reflection: "${(r.question as string).slice(0, 140)}" the parent said "${(r.parent_response as string).slice(0, 160)}".`,
      age: null as string | null,
    }))

  const signals = [...wins, ...scriptWins, ...reflectionWins]
  if (signals.length === 0) {
    return { ranAt: new Date().toISOString(), signals: 0, written: 0, rows: [] }
  }

  const prompt = `You are distilling aggregate, de-identified evidence of what works for the families using Guided Childhood, a digital parenting platform. Below are anonymised signals of things that went well: concerns that turned around, scripts that worked, and reflections parents shared. None of this is one identifiable family. Turn the recurring patterns into a small set of reusable pieces of wisdom DiGi can lean on when it coaches a new parent.

SIGNALS (${signals.length}, de-identified):
${signals.slice(0, 300).map(s => `- [${s.age ?? 'any'}] ${s.text}`).join('\n')}

Write between 6 and 12 pieces of wisdom. Each is a pattern of what tends to work, phrased so DiGi can lean on it warmly and specifically, never as pressure and never as a rule. Attach an age band only when the pattern is clearly stage specific, otherwise leave it null. Justin's voice: warm, plain, direct, no dashes.

Reply with ONLY valid JSON in this shape:
{"wisdom":[{"topic":"short name","age_band":"4-7|8-10|11-13|13-15|16+|null","what_works":"one or two sentences, the pattern and why it helps","evidence_count":number}]}
evidence_count is roughly how many signals point to this pattern.`

  const text = await callModel(prompt)
  const match = text.match(/\{[\s\S]*\}/)
  const parsed = match ? (JSON.parse(match[0]) as { wisdom?: WisdomRow[] }) : { wisdom: [] }
  const validBands = new Set(['4-7', '8-10', '11-13', '13-15', '16+'])
  const rows: WisdomRow[] = (parsed.wisdom ?? [])
    .filter(w => w && w.topic && w.what_works)
    .map(w => ({
      topic: String(w.topic).slice(0, 120),
      age_band: w.age_band && validBands.has(String(w.age_band)) ? String(w.age_band) : null,
      what_works: String(w.what_works).slice(0, 600),
      evidence_count: Math.max(1, Math.round(Number(w.evidence_count) || 1)),
    }))

  // Replace the set only when there is a fresh set to put in. A bad model run
  // that parses to zero rows must never blank a populated corpus, so the swap
  // (deactivate old, insert new) happens as one step and only with rows in
  // hand. The old wisdom keeps working until real new wisdom replaces it.
  if (rows.length > 0) {
    await admin.from('digi_wisdom').update({ active: false }).eq('active', true)
    await admin.from('digi_wisdom').insert(rows.map(r => ({ ...r, active: true, updated_at: new Date().toISOString() })))
  }

  return { ranAt: new Date().toISOString(), signals: signals.length, written: rows.length, rows }
}

// Retrieval for the DiGi context block. Same shape as getWhatWorked, but this
// is the whole community's track record, not one family's. Age matched first,
// then the message keywords nudge the ordering.
export async function getAggregateWisdom(
  supabase: SupabaseClient,
  ageBand: string | null,
  message = '',
  limit = 4,
): Promise<string> {
  const { data } = await supabase
    .from('digi_wisdom')
    .select('topic, age_band, what_works')
    .eq('active', true)
    .order('evidence_count', { ascending: false })
    .limit(40)

  if (!data || data.length === 0) return ''

  const msg = message.toLowerCase()
  const words = new Set(msg.split(/[^a-z0-9]+/).filter(w => w.length > 3))
  const scored = data.map(w => {
    let score = 0
    if (!w.age_band) score += 1
    else if (w.age_band === ageBand) score += 3
    else score -= 2
    const hay = `${w.topic} ${w.what_works}`.toLowerCase()
    for (const word of words) if (hay.includes(word)) score += 2
    return { w, score }
  })

  const top = scored.sort((a, b) => b.score - a.score).slice(0, limit).filter(s => s.score > -2)
  if (top.length === 0) return ''

  return '\n\nWHAT TENDS TO WORK ACROSS FAMILIES LIKE THIS ONE (aggregate, de-identified patterns from the wider Guided Childhood community, lean on these gently to reassure and suggest, never as a rule or pressure, and never say how many families):\n' +
    top.map(s => `- ${s.w.topic}: ${s.w.what_works}`).join('\n')
}
