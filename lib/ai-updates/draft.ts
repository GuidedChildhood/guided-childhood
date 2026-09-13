import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { firstText, stripDashes } from '@/lib/digi/text'
import { AI_UPDATE_MODEL, AI_UPDATE_MODEL_FALLBACKS, AI_UPDATE_AUDIENCES } from '@/lib/config/ai-module'
import { PLATFORM_SOURCES, PLATFORM_WATCH_DAYS } from '@/lib/config/platform-sources'

// The living layer of the AI module: platform and AI changes, drafted by the
// model, published by a human, never the other way round.
//
// Lifted out of app/api/ai-updates/refresh/route.ts on 13 September 2026 so
// the weekly platform watch and the hand fed refresh route share one drafting
// rule, and so the watch can be a cron. The gate is unchanged and it is the
// whole point: everything here lands as status draft. Only the founder's click
// on the insights board (app/api/admin/ai-updates) publishes, and only a
// published update reaches a family.

export type SourceItem = { title: string; text: string; url?: string; source_name?: string; published?: string }
export type Draft = { audience: string; headline: string; summary: string; category: string; source_name: string | null; source_url: string | null }

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

async function callModel(params: Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>): Promise<Anthropic.Message> {
  const models = [AI_UPDATE_MODEL, ...AI_UPDATE_MODEL_FALLBACKS.filter(m => m !== AI_UPDATE_MODEL)]
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

function buildPrompt(source: SourceItem): string {
  return `You are helping a UK digital parenting platform keep its AI and platform literacy content current.

Below is a single trusted source item (a platform change, a regulator's ruling, a safety update, a new AI feature, a risk pattern). Write calm, accurate, age appropriate summaries of it for these audiences: age_13, age_16, parent, teacher.

Rules:
- British English. No dashes used as punctuation. Warm, plain, never alarmist.
- Only use facts present in the source. Do not add claims or invent details. If the source is thin, keep the summary short.
- Each summary is 2 to 4 sentences. For age_13 and age_16, pitch the language to that age.
- For the parent audience, end with the one thing a parent can do about it this week, if there is one.
- Choose a category tag from: ai_news, ai_safety, deepfakes, scams, model_release, privacy, platform_change, age_checks.

Return ONLY a JSON array, no prose, in this exact shape:
[{"audience":"parent","headline":"...","summary":"...","category":"..."}, ...]

SOURCE TITLE: ${source.title}
SOURCE TEXT: ${source.text}
${source.source_name ? `SOURCE NAME: ${source.source_name}` : ''}${source.published ? `\nPUBLISHED: ${source.published}` : ''}`
}

function safeParseArray(text: string): Array<Record<string, unknown>> {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return []
  try {
    const parsed = JSON.parse(text.slice(start, end + 1))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** One draft per audience per source item. A source that fails is skipped, never fatal. */
export async function draftUpdates(sources: SourceItem[]): Promise<Draft[]> {
  const drafts: Draft[] = []
  for (const source of sources) {
    let response: Anthropic.Message
    try {
      response = await callModel({ max_tokens: 1200, messages: [{ role: 'user', content: buildPrompt(source) }] })
    } catch {
      continue
    }
    for (const d of safeParseArray(firstText(response))) {
      if (!AI_UPDATE_AUDIENCES.includes(d.audience as typeof AI_UPDATE_AUDIENCES[number])) continue
      drafts.push({
        audience: String(d.audience),
        headline: stripDashes(String(d.headline ?? source.title)).slice(0, 200),
        summary: stripDashes(String(d.summary ?? '')).slice(0, 1500),
        category: String(d.category ?? 'ai_news').slice(0, 60),
        source_name: source.source_name ?? null,
        source_url: source.url && /^https?:\/\//.test(source.url) ? source.url.slice(0, 400) : null,
      })
    }
  }
  return drafts
}

/** Save drafts. Always status draft; nothing here can publish. */
export async function insertDrafts(admin: SupabaseClient, drafts: Draft[]): Promise<number> {
  if (drafts.length === 0) return 0
  const rows = drafts.map((d, i) => ({
    headline: d.headline, summary: d.summary, audience: d.audience, category: d.category,
    source_name: d.source_name, source_url: d.source_url,
    origin: 'claude' as const, status: 'draft' as const, sort_order: i,
  }))
  const { error, count } = await admin.from('ai_updates').insert(rows, { count: 'exact' })
  if (error) throw new Error(error.message)
  return count ?? rows.length
}

const WATCH_SYSTEM = `You are the platform watch for Guided Childhood, a UK digital parenting platform for families with children aged 4 to 16. Once a week you look at a short list of trusted sources and report what CHANGED for children and teenagers online in the last ${PLATFORM_WATCH_DAYS} days.

Search ONLY these sources, by domain:
${PLATFORM_SOURCES.map(s => `- ${s.name} (${s.domain}), ${s.kind}`).join('\n')}

Report an item only when it is (a) published inside the last ${PLATFORM_WATCH_DAYS} days, (b) from one of those domains, and (c) about children, teenagers, under 18s, age checks, teen accounts, parental controls, online safety duties, or an AI feature aimed at or affecting young people. Ignore corporate, financial and adult only news.

For each item give the facts only, in 2 to 4 plain sentences, British English, no dashes as punctuation, no opinion. Never invent an item, a date or a URL; if you found nothing that qualifies, return an empty array.

Return ONLY a JSON array, no prose:
[{"title":"...","text":"...","url":"https://...","source_name":"the source's name as listed above","published":"YYYY-MM-DD"}]`

/**
 * The weekly look: what the four source families published this week that
 * touches children. Uses the model's web search, the same way the research
 * updater does, because this server has no feed reader and the sources do not
 * all publish one. Best effort: no search, no items, never an error to a cron.
 */
export async function platformWatch(): Promise<SourceItem[]> {
  const allowed = new Set(PLATFORM_SOURCES.map(s => s.name))
  const domains = PLATFORM_SOURCES.map(s => s.domain)
  const userMsg = `Today is ${new Date().toISOString().slice(0, 10)}. Look at the last ${PLATFORM_WATCH_DAYS} days across the listed sources and report what changed for children and teenagers online. Up to 6 items.`
  const tools = [{ type: 'web_search_20250305' as const, name: 'web_search' as const, max_uses: 8 }]
  let text = ''
  try {
    const resp = await callModel({ max_tokens: 2500, system: WATCH_SYSTEM, messages: [{ role: 'user', content: userMsg }], tools })
    text = resp.content.map(b => (b.type === 'text' ? b.text : '')).join('\n')
  } catch {
    return []
  }
  return safeParseArray(text)
    .filter(i => typeof i.title === 'string' && typeof i.text === 'string' && String(i.text).trim().length > 20)
    .map(i => ({
      title: String(i.title).slice(0, 200),
      text: String(i.text).slice(0, 1500),
      url: typeof i.url === 'string' ? i.url : undefined,
      source_name: typeof i.source_name === 'string' && allowed.has(i.source_name) ? i.source_name : undefined,
      published: typeof i.published === 'string' ? i.published.slice(0, 10) : undefined,
    }))
    // A URL that is not on one of the listed domains is a hallucinated one.
    .filter(i => !i.url || domains.some(d => { try { return new URL(i.url!).hostname.endsWith(d) } catch { return false } }))
    .slice(0, 6)
}
