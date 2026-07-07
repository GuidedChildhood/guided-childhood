// AI updates refresh route (the living layer of the AI module).
//
// What it does: takes a small batch of trusted source items (a new model
// release, a safety guidance, a scam pattern), asks Claude to write calm,
// age-appropriate summaries, and saves them as DRAFTS. It never publishes.
// A human approves drafts before families see them. This is deliberate: a
// children's product must not surface unreviewed, machine-generated claims.
//
// Why a source feed at all: Claude cannot reliably know what is new after its
// training cutoff, so we feed it trusted sources and let it do what it is good
// at, which is summarising and tuning the language per age.
//
// How it is triggered: a scheduled job (or an editor tool) POSTs here with the
// x-cron-secret header. Without CRON_SECRET configured, the route is disabled.

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AI_UPDATE_MODEL, AI_UPDATE_MODEL_FALLBACKS, AI_UPDATE_AUDIENCES } from '@/lib/config/ai-module'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

type SourceItem = { title: string; text: string; url?: string; source_name?: string }
type Draft = { audience: string; headline: string; summary: string; category: string }

async function callModel(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> {
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

export async function POST(request: Request) {
  // Guard 1: the route is off unless a secret is configured and matches.
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Refresh disabled: CRON_SECRET not configured' }, { status: 503 })
  }
  if (request.headers.get('x-cron-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Guard 2: we need the service role to write drafts past row level security.
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!serviceKey || !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Refresh not ready: missing service key or model key' }, { status: 503 })
  }

  const body = await request.json().catch(() => null) as { sources?: SourceItem[] } | null
  const sources = (body?.sources ?? []).slice(0, 10).filter(s => s?.title && s?.text)
  if (sources.length === 0) {
    return NextResponse.json({ error: 'Provide a non-empty sources array of {title, text, url, source_name}' }, { status: 400 })
  }

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)

  const drafts: Draft[] = []
  for (const source of sources) {
    const prompt = buildPrompt(source)
    let response: Anthropic.Message
    try {
      response = await callModel({ model: AI_UPDATE_MODEL, max_tokens: 1200, messages: [{ role: 'user', content: prompt }] })
    } catch {
      continue // skip a source that fails, keep going
    }
    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const parsed = safeParseDrafts(text)
    for (const d of parsed) {
      if (!AI_UPDATE_AUDIENCES.includes(d.audience as typeof AI_UPDATE_AUDIENCES[number])) continue
      drafts.push({
        audience: String(d.audience),
        headline: String(d.headline ?? source.title).slice(0, 200),
        summary: String(d.summary ?? '').slice(0, 1500),
        category: String(d.category ?? 'ai_news').slice(0, 60),
      })
    }
  }

  if (drafts.length === 0) {
    return NextResponse.json({ drafted: 0, note: 'No drafts produced. Nothing was published.' })
  }

  // Everything is saved as a DRAFT. Never published automatically.
  const rows = drafts.map((d, i) => ({
    headline: d.headline,
    summary: d.summary,
    audience: d.audience,
    category: d.category,
    source_name: sources[0]?.source_name ?? null,
    source_url: sources[0]?.url ?? null,
    origin: 'claude' as const,
    status: 'draft' as const,
    sort_order: i,
  }))

  const { error } = await supabaseAdmin.from('ai_updates').insert(rows)
  if (error) {
    return NextResponse.json({ error: 'Failed to save drafts', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ drafted: rows.length, status: 'draft', note: 'Drafts saved for human review. Nothing is live until an editor publishes it.' })
}

function buildPrompt(source: SourceItem): string {
  return `You are helping a UK digital parenting platform keep its AI literacy content current.

Below is a single trusted source item about AI (a release, a safety update, or a risk pattern). Write calm, accurate, age-appropriate summaries of it for these audiences: age_13, age_16, parent, teacher.

Rules:
- British English. No dashes used as punctuation. Warm, plain, never alarmist.
- Only use facts present in the source. Do not add claims or invent details. If the source is thin, keep the summary short.
- Each summary is 2 to 4 sentences. For age_13 and age_16, pitch the language to that age.
- Choose a category tag from: ai_news, ai_safety, deepfakes, scams, model_release, privacy.

Return ONLY a JSON array, no prose, in this exact shape:
[{"audience":"parent","headline":"...","summary":"...","category":"..."}, ...]

SOURCE TITLE: ${source.title}
SOURCE TEXT: ${source.text}
${source.source_name ? `SOURCE NAME: ${source.source_name}` : ''}`
}

function safeParseDrafts(text: string): Array<Record<string, unknown>> {
  // The model is asked for a bare JSON array. Be defensive: pull the first
  // bracketed block and parse it, returning [] on any problem.
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
