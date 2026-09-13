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
import { draftUpdates, insertDrafts, type SourceItem } from '@/lib/ai-updates/draft'

// The drafting itself lives in lib/ai-updates/draft.ts since 13 September
// 2026, shared with the weekly platform watch cron. This route is the hand fed
// door: a trusted item pasted in, drafted, saved as a draft. Same gate.

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
    return NextResponse.json({ error: 'Refresh disabled: missing SUPABASE_SERVICE_KEY or ANTHROPIC_API_KEY' }, { status: 503 })
  }

  let body: { sources?: SourceItem[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 })
  }
  const sources = (body.sources ?? []).filter(s => s && typeof s.title === 'string' && typeof s.text === 'string')
  if (sources.length === 0) {
    return NextResponse.json({ error: 'Provide a non-empty sources array of {title, text, url, source_name}' }, { status: 400 })
  }

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
  const drafts = await draftUpdates(sources)
  if (drafts.length === 0) {
    return NextResponse.json({ drafted: 0, note: 'No drafts produced. Nothing was published.' })
  }
  try {
    const drafted = await insertDrafts(supabaseAdmin, drafts)
    return NextResponse.json({ drafted, status: 'draft', note: 'Drafts saved for human review. Nothing is live until an editor publishes it.' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save drafts', detail: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
