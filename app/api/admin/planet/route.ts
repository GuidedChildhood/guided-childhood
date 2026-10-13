import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { storiesHash } from '@/publishing/engine/hash'
import { SupabaseStore } from '@/publishing/engine/store-supabase'
import { authorise, current, decideStory, GateError, transition, type Actor } from '@/publishing/engine/workflow'

// Founder only. The Guided Planet's newspaper desk: every decision Justin
// makes on an edition goes through here, into the workflow in
// publishing/engine/workflow.ts, which holds every guard. This route only
// checks who is asking and passes the decision on; it cannot open a gate the
// workflow would refuse.
//
// Actions: decide-story, approve-stories, request-changes, approve-final,
// authorise, budget, art-decision. Each is recorded in planet_events.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
const CHANNELS = new Set(['website', 'mailchimp', 'drive', 'linkedin', 'instagram', 'facebook', 'schools'])

async function requireFounder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) return null
  return user
}

export async function POST(req: NextRequest) {
  const user = await requireFounder()
  if (!user) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const body = await req.json().catch(() => ({})) as Record<string, unknown>
  const issue = Number(body.issue)
  const action = String(body.action ?? '')
  if (!Number.isInteger(issue) || issue < 1) return NextResponse.json({ error: 'Which issue?' }, { status: 400 })

  const db = createAdminClient()
  const { data: row, error: rowErr } = await db.from('planet_issues').select('slug, edition, month').eq('number', issue).maybeSingle()
  if (rowErr) return NextResponse.json({ error: 'The newspaper tables are not there yet. They arrive with migration 377.' }, { status: 503 })
  if (!row) return NextResponse.json({ error: `Issue ${issue} has not been synced yet` }, { status: 404 })
  const store = new SupabaseStore(db, () => row as { slug: string; edition: string; month: string })
  const actor: Actor = { kind: 'founder', id: user.email ?? user.id }
  const note = typeof body.note === 'string' ? body.note.slice(0, 2000) : undefined

  try {
    switch (action) {
      case 'decide-story': {
        const d = String(body.decision)
        if (d !== 'approved' && d !== 'rejected' && d !== 'revise') return NextResponse.json({ error: 'Bad decision' }, { status: 400 })
        await decideStory(store, issue, String(body.storyId), d, actor, note)
        break
      }
      case 'approve-stories': {
        // The selection is whatever Justin marked approved, read back from the
        // database rather than trusted from the browser.
        const { data: stories } = await db.from('planet_stories').select('id, record, decision').eq('issue', issue)
        const chosen = (stories ?? []).filter(s => s.decision === 'approved')
        if (chosen.length < 3) return NextResponse.json({ error: 'Approve at least three stories first' }, { status: 400 })
        const hash = storiesHash(chosen.map(s => ({ id: s.id as string, headline: (s.record as { headline: string }).headline, sourceUrl: (s.record as { source: { url: string } }).source.url })))
        await transition(store, issue, 'APPROVED', actor, { storiesHash: hash, reviewedHash: String(body.reviewedHash ?? ''), stories: chosen.map(s => s.id), note })
        break
      }
      case 'request-changes': {
        const s = await current(store, issue)
        const to = s.state === 'EDITORIAL_REVIEW' ? 'RESEARCHED' : 'DESIGNING'
        await transition(store, issue, to, actor, { note: note ?? 'Changes requested' })
        break
      }
      case 'approve-final':
        await transition(store, issue, 'FINAL_APPROVED', actor, { contentHash: String(body.contentHash ?? ''), pdfHash: String(body.pdfHash ?? ''), note })
        break
      case 'authorise': {
        const channels = Array.isArray(body.channels) ? (body.channels as unknown[]).map(String).filter(c => CHANNELS.has(c)) : []
        if (!channels.length) return NextResponse.json({ error: 'Choose at least one channel' }, { status: 400 })
        await authorise(store, issue, channels, actor)
        break
      }
      case 'budget': {
        const credits = Number(body.credits)
        if (!Number.isFinite(credits) || credits < 0 || credits > 5000) return NextResponse.json({ error: 'A budget between 0 and 5000 credits' }, { status: 400 })
        await store.setBudget(issue, credits, actor.id)
        await store.addEvent({ issue, at: new Date().toISOString(), actor, action: 'budget', detail: { credits } })
        break
      }
      case 'art-decision': {
        const d = String(body.decision)
        if (d !== 'approved' && d !== 'rejected') return NextResponse.json({ error: 'Bad decision' }, { status: 400 })
        const { error } = await db.from('planet_generations').update({ status: d, reason: note ?? null }).eq('id', String(body.generationId)).eq('issue', issue)
        if (error) return NextResponse.json({ error: error.message }, { status: 502 })
        await store.addEvent({ issue, at: new Date().toISOString(), actor, action: 'art-decision', detail: { generationId: body.generationId, decision: d, note } })
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: e instanceof GateError ? 409 : 502 })
  }
  return NextResponse.json({ ok: true, state: (await current(store, issue)).state })
}
