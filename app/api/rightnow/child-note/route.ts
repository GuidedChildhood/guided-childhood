import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { digiModelsFor } from '@/lib/config/digi'
import { pushToChild } from '@/lib/quests/kid-push'
import { gateSend, gateMessage, childNotePrompt } from '@/lib/rightnow/child-note'
import type { StageId } from '@/lib/pathway/progress'

// Share with your child, when the child is actually on the app.
//
// GET  which children can receive this card, and which cannot and why
// POST draft the note the child would read, for the parent to see and edit
// PUT  send it to their screen
//
// The parent always sees the exact words before they land. A note that appears
// on a child's screen without their parent having read it first is not
// something this product should ever do, so the draft step is not skippable.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 30_000,
  maxRetries: 1,
})

type ScriptRow = { id: string; title: string; say_this: string; stage_id: string | null; for_your_child: string | null }

async function loadScript(
  supabase: Awaited<ReturnType<typeof createClient>>,
  scriptId: string | null
): Promise<ScriptRow | null> {
  if (!scriptId) return null
  const { data } = await supabase
    .from('scripts')
    .select('id, title, say_this, stage_id, for_your_child')
    .eq('id', scriptId)
    .maybeSingle()
  return (data as ScriptRow | null) ?? null
}

// The children this parent could send to, each with the reason they cannot if
// they cannot. A child with no kid_links row has no app of their own, so there
// is no screen to send to and the card is read together instead.
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const scriptId = req.nextUrl.searchParams.get('scriptId')
  const crisis = req.nextUrl.searchParams.get('crisis') === '1'

  const [{ data: kids }, script] = await Promise.all([
    supabase.from('children').select('id, name, stage_id').eq('parent_id', user.id).order('is_primary', { ascending: false }),
    loadScript(supabase, scriptId),
  ])
  if (!kids?.length) return NextResponse.json({ children: [] })

  // One query for every link, rather than one per child.
  const { data: links } = await supabase
    .from('kid_links').select('child_id').eq('user_id', user.id)
  const linked = new Set((links ?? []).map(l => (l as { child_id: string }).child_id))

  const children = kids.map(k => {
    const gate = gateSend(script?.stage_id, k.stage_id, crisis)
    const onApp = linked.has(k.id)
    return {
      id: k.id,
      name: k.name,
      onApp,
      canSend: onApp && gate.ok,
      // Not on the app is not a refusal, it is simply nowhere to send to, and
      // it reads better as its own line than as a blocked card.
      reason: gate.ok ? null : gateMessage(gate.reason, k.name),
    }
  })

  return NextResponse.json({ children })
}

// Draft the note. Prefers the hand written child version on the row, and only
// asks the model when there is not one yet.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, scriptId, title, sayThis, crisis } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'childId required' }, { status: 400 })
  }

  const [{ data: child }, script] = await Promise.all([
    supabase.from('children').select('id, name, stage_id').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    loadScript(supabase, typeof scriptId === 'string' ? scriptId : null),
  ])
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  // The card as it really is. A typed Something else card has no row of its
  // own, so its words come up in the body instead.
  const cardTitle: string = script?.title ?? (typeof title === 'string' ? title : '')
  const cardSay: string = script?.say_this ?? (typeof sayThis === 'string' ? sayThis : '')
  if (!cardSay) return NextResponse.json({ error: 'nothing to send' }, { status: 400 })

  const gate = gateSend(script?.stage_id, child.stage_id, crisis === true)
  if (!gate.ok) {
    return NextResponse.json({ blocked: true, message: gateMessage(gate.reason, child.name) })
  }

  // The hand written version wins whenever there is one.
  const written = script?.for_your_child?.trim()
  if (written) return NextResponse.json({ note: written, source: 'written' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ blocked: true, message: gateMessage('no-stage', child.name) })
  }

  // Written on demand. This lands on a child's screen, so it takes the deep
  // model ladder rather than the fast tier: it is child facing words with an
  // age judgement inside them, which is exactly what the router reserves the
  // deep model for.
  const prompt = childNotePrompt({
    childName: child.name,
    childStage: gate.childStage,
    title: cardTitle,
    sayThis: cardSay,
  })

  let note = ''
  let lastError: unknown
  for (const model of digiModelsFor('rescue')) {
    try {
      const msg = await anthropic.messages.create({
        model, max_tokens: 300, messages: [{ role: 'user', content: prompt }],
      })
      note = firstText(msg).trim()
      break
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) { lastError = err; break }
      lastError = err
    }
  }

  if (!note) {
    console.error('[child-note] draft failed', lastError)
    return NextResponse.json({ blocked: true, message: 'Could not write it just now. Read the card through with them instead.' })
  }

  // Cache it back onto the row so this card is only ever written once and the
  // next family gets it with no wait. Best effort: a failed cache costs a
  // little latency next time and nothing else, so it never blocks the send.
  if (script?.id) {
    try {
      await createAdminClient().from('scripts').update({ for_your_child: note }).eq('id', script.id)
    } catch { /* the cache never blocks the send */ }
  }

  return NextResponse.json({ note, source: 'digi' })
}

// Send it. The note is whatever the parent approved, which may be their own
// edit of the draft, so it is re gated on the way in rather than trusted.
export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, scriptId, note, crisis } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string' || typeof note !== 'string' || !note.trim()) {
    return NextResponse.json({ error: 'childId and note required' }, { status: 400 })
  }
  if (note.length > 600) return NextResponse.json({ error: 'note too long' }, { status: 400 })

  const [{ data: child }, script] = await Promise.all([
    supabase.from('children').select('id, name, stage_id').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    loadScript(supabase, typeof scriptId === 'string' ? scriptId : null),
  ])
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const gate = gateSend(script?.stage_id, child.stage_id, crisis === true)
  if (!gate.ok) {
    return NextResponse.json({ blocked: true, message: gateMessage(gate.reason, child.name) }, { status: 403 })
  }

  // The child must have a screen of their own to send to.
  const { data: link } = await supabase
    .from('kid_links').select('child_id').eq('user_id', user.id).eq('child_id', childId).maybeSingle()
  if (!link) {
    return NextResponse.json({ blocked: true, message: `${child.name} is not on the app yet, so read it through together.` }, { status: 409 })
  }

  const message = note.trim()

  const { error: insErr } = await supabase.from('kid_nudges').insert({
    user_id: user.id, child_id: childId, quest_id: null, message,
  })
  if (insErr) {
    console.error('[child-note] nudge insert failed', insErr)
    return NextResponse.json({ error: 'could not send' }, { status: 500 })
  }

  // Their own device too, if reminders are on. Silence is fine: the note is
  // already sitting at the top of their screen for the next open.
  try {
    await pushToChild(createAdminClient(), user.id, childId, 'A note from your grown up', message)
  } catch { /* the push is never the thing that matters */ }

  return NextResponse.json({ sent: true, name: child.name })
}
