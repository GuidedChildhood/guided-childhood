import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  computeChildSignals, chooseCheckin, coveredByConcern,
  SIGNAL_WINDOW_DAYS, SUPPRESS_DAYS, CHECKIN_GAP_DAYS,
  SCRIPTS_FALLBACK_HREF, COME_OFF_SCRIPT_TITLE_PATTERNS,
  type CheckinSession, type CheckinCandidate,
} from '@/lib/digi/device-checkins'

// The device check in surface. GET reads each child's real device_sessions
// from the last fortnight, computes the signals, and returns at most ONE
// check in for the whole family: the strongest signal, for a child who has
// not had one this week, that is not already an open concern and has not
// been waved away in the last three weeks. POST records what happened to
// it: shown, Yes this is us, or Not really (which quiets that prompt for
// three weeks). Everything is scoped to the signed in parent through RLS.
//
// If the digi_device_checkins table is not there yet (migration 082 not
// applied), the GET stays quiet rather than showing a card whose weekly cap
// and suppression could not be honoured.

export const dynamic = 'force-dynamic'

// The order candidates outrank each other across children when more than
// one child has a signal in the same week. Mirrors the per child priority.
const PRIORITY: Record<string, number> = {
  new_device: 0, over_guide: 1, early_stops: 2, console_after_school: 3,
  console_heavy: 4, tv_heavy: 5, phone_heavy: 6, tablet_heavy: 7,
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const now = Date.now()
  const windowStart = new Date(now - SIGNAL_WINDOW_DAYS * 86_400_000).toISOString()
  const sevenDaysAgo = new Date(now - 7 * 86_400_000).toISOString()

  const [childrenRes, sessionsRes, priorRes, historyRes, concernsRes] = await Promise.all([
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id),
    supabase.from('device_sessions')
      .select('child_id, device, minutes, status, started_at, ends_at, ended_at')
      .eq('user_id', user.id)
      .gte('started_at', windowStart)
      .limit(600),
    // Which devices each child had used before this week, so a genuinely
    // new device stands out. Recent history is enough for that read.
    supabase.from('device_sessions')
      .select('child_id, device')
      .eq('user_id', user.id)
      .lt('started_at', sevenDaysAgo)
      .order('started_at', { ascending: false })
      .limit(1000),
    supabase.from('digi_device_checkins')
      .select('child_id, prompt_id, shown_at, response, suppressed_until')
      .eq('user_id', user.id)
      .gte('shown_at', new Date(now - 60 * 86_400_000).toISOString()),
    supabase.from('concerns')
      .select('slug, label')
      .eq('user_id', user.id)
      .eq('status', 'open'),
  ])

  // No table yet means no way to keep the once a week and three week quiet
  // promises, so DiGi says nothing at all.
  if (historyRes.error) return NextResponse.json({ checkin: null })

  const children = childrenRes.data ?? []
  const sessions = (sessionsRes.data ?? []) as CheckinSession[]
  if (children.length === 0 || sessions.length === 0) return NextResponse.json({ checkin: null })

  const history = historyRes.data ?? []
  const concerns = (concernsRes.data ?? []) as { slug: string; label: string }[]

  // The come off the game script lives in the scripts table, never in code.
  // Look it up by title; if RLS or the seed hides it, fall back to the
  // scripts library.
  let scriptHref: string | null = null
  for (const pattern of COME_OFF_SCRIPT_TITLE_PATTERNS) {
    const { data: script } = await supabase
      .from('scripts').select('sort_order').ilike('title', pattern).limit(1).maybeSingle()
    if (script?.sort_order != null) { scriptHref = `/dashboard/scripts/${script.sort_order}`; break }
  }
  if (!scriptHref) scriptHref = SCRIPTS_FALLBACK_HREF

  const priorByChild = new Map<string, Set<string>>()
  for (const row of priorRes.data ?? []) {
    const set = priorByChild.get(row.child_id) ?? new Set<string>()
    set.add(row.device)
    priorByChild.set(row.child_id, set)
  }

  const candidates: { candidate: CheckinCandidate; childName: string; totalMinutes: number }[] = []

  for (const child of children) {
    // At most one device check in per child per week.
    const recentlyShown = history.some(h =>
      h.child_id === child.id && Date.parse(h.shown_at) > now - CHECKIN_GAP_DAYS * 86_400_000)
    if (recentlyShown) continue

    const childSessions = sessions.filter(s => s.child_id === child.id)
    if (childSessions.length === 0) continue

    const signals = computeChildSignals({
      childId: child.id,
      ageBand: child.age_band ?? null,
      sessions: childSessions,
      priorDevices: priorByChild.get(child.id) ?? new Set<string>(),
    })

    const candidate = chooseCheckin({ signals, childName: child.name ?? 'your child', scriptHref })
    if (!candidate) continue

    // Not really means three weeks of quiet for that prompt and child.
    const suppressed = history.some(h =>
      h.child_id === child.id && h.prompt_id === candidate.promptId &&
      h.suppressed_until && Date.parse(h.suppressed_until) > now)
    if (suppressed) continue

    // Never re ask what is already an open concern the family has flagged.
    if (coveredByConcern(candidate, concerns)) continue

    candidates.push({ candidate, childName: child.name ?? 'your child', totalMinutes: signals.totalMinutes })
  }

  if (candidates.length === 0) return NextResponse.json({ checkin: null })

  // One card for the whole family: the strongest signal wins, heavier real
  // use breaking ties between children.
  candidates.sort((a, b) =>
    (PRIORITY[a.candidate.promptId] ?? 9) - (PRIORITY[b.candidate.promptId] ?? 9) ||
    b.totalMinutes - a.totalMinutes)

  const top = candidates[0]
  return NextResponse.json({
    checkin: {
      promptId: top.candidate.promptId,
      childId: top.candidate.childId,
      childName: top.childName,
      device: top.candidate.device,
      question: top.candidate.question,
      chatMessage: top.candidate.chatMessage,
      pathway: top.candidate.pathway,
    },
  })
}

// Records the card's life: shown when it renders (which starts the weekly
// clock), then the parent's answer. Not really sets the three week quiet.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  let body: { event?: string; id?: string; promptId?: string; childId?: string; device?: string | null }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }

  const event = body.event
  if (event === 'seen') {
    if (!body.promptId || !body.childId) return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    const { data, error } = await supabase.from('digi_device_checkins').insert({
      user_id: user.id,
      child_id: body.childId,
      prompt_id: body.promptId,
      device: body.device ?? null,
    }).select('id').single()
    if (error) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true, id: data.id })
  }

  if (event === 'yes' || event === 'not_really') {
    if (!body.id) return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    const patch: { response: string; responded_at: string; suppressed_until?: string } = {
      response: event === 'yes' ? 'yes' : 'not_really',
      responded_at: new Date().toISOString(),
    }
    if (event === 'not_really') {
      patch.suppressed_until = new Date(Date.now() + SUPPRESS_DAYS * 86_400_000).toISOString()
    }
    const { error } = await supabase.from('digi_device_checkins')
      .update(patch).eq('id', body.id).eq('user_id', user.id)
    return NextResponse.json({ ok: !error })
  }

  return NextResponse.json({ error: 'Bad request' }, { status: 400 })
}
