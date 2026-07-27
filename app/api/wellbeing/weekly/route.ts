import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CHALLENGE_OPTIONS } from '@/lib/content/stages'
import { generateWeeklyPlan, type PlanStep } from '@/lib/digi/weekly-plan'

// The Sunday wellbeing check in. GET tells Home whether a check in is due (it is
// Sunday and none done this week) and hands back this week's agreed plan so it
// can sit on Home all week. POST mode suggest turns the parent's answers into
// DiGi's proposed plan. POST mode save stores the check in and the agreed plan,
// and folds anything hard into the concern ledger, exactly like the monthly one.

export const dynamic = 'force-dynamic'

const CHALLENGE_LABEL = new Map(CHALLENGE_OPTIONS.map(o => [o.value, o.label]))

function mondayOf(d: Date): string {
  const day = d.getUTCDay() // 0 Sun .. 6 Sat
  const back = (day + 6) % 7
  const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back))
  return mon.toISOString().slice(0, 10)
}

async function firstChildName(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string> {
  const { data } = await supabase.from('children').select('name').eq('parent_id', userId).eq('is_primary', true).maybeSingle()
  const name = (data as { name?: string } | null)?.name
  return name && name !== 'Your child' ? name : 'your child'
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ done: false, due: false, plan: [] })

  const weekStart = mondayOf(new Date())
  const { data } = await supabase
    .from('wellbeing_checkins')
    .select('id, week_start, focus, plan, plan_agreed, parent_mood')
    .eq('user_id', user.id).eq('week_start', weekStart).maybeSingle()

  const isSunday = new Date().getUTCDay() === 0
  const done = !!data?.plan_agreed
  return NextResponse.json({
    done,
    // Due on a Sunday when it has not been done yet. A parent can still open it
    // any day from the teaser, this only drives the proactive nudge.
    due: isSunday && !done,
    weekStart,
    focus: data?.focus ?? null,
    plan: (data?.plan as PlanStep[] | null) ?? [],
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: {
    mode?: 'suggest' | 'save'
    parentMood?: number | null
    wentWell?: string[]
    hardest?: string[]
    focus?: string | null
    plan?: PlanStep[]
  }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const mood = typeof body.parentMood === 'number' && body.parentMood >= 1 && body.parentMood <= 5 ? Math.round(body.parentMood) : null
  const wentWell = Array.isArray(body.wentWell) ? body.wentWell.slice(0, 12).map(String) : []
  const hardest = Array.isArray(body.hardest) ? body.hardest.slice(0, 12).map(String) : []
  const focus = typeof body.focus === 'string' ? body.focus.trim().slice(0, 120) || null : null
  const hardestLabels = hardest.map(s => (CHALLENGE_LABEL.get(s as never) as string) ?? s)

  if (body.mode === 'suggest') {
    const childName = await firstChildName(supabase, user.id)
    const plan = await generateWeeklyPlan({ parentMood: mood, wentWell, hardest: hardestLabels, focus, childName })
    return NextResponse.json({ plan })
  }

  // save
  const plan = Array.isArray(body.plan)
    ? body.plan.slice(0, 3).map(p => ({ title: String(p.title ?? '').slice(0, 120), why: String(p.why ?? '').slice(0, 400), expert: String(p.expert ?? '').slice(0, 60) })).filter(p => p.title)
    : []
  const weekStart = mondayOf(new Date())

  const { error } = await supabase.from('wellbeing_checkins').upsert({
    user_id: user.id,
    week_start: weekStart,
    parent_mood: mood,
    went_well: wentWell,
    new_concerns: hardest,
    fixed: [],
    focus,
    plan,
    plan_agreed: true,
  }, { onConflict: 'user_id,week_start' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fold anything hard into the concern ledger, best effort, never blocks save.
  try {
    const now = new Date().toISOString()
    const knownSlugs = hardest.filter(s => CHALLENGE_LABEL.has(s as never))
    if (knownSlugs.length > 0) {
      const { data: child } = await supabase.from('children').select('id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle()
      const { data: existing } = await supabase.from('concerns').select('slug, status, times_flagged').eq('user_id', user.id).in('slug', knownSlugs)
      const priorBySlug = new Map((existing ?? []).map(c => [c.slug, c]))
      const childId = (child as { id?: string } | null)?.id ?? null
      const rows = knownSlugs.map(slug => {
        const prior = priorBySlug.get(slug)
        return {
          user_id: user.id, child_id: childId, source: 'checkin', slug,
          label: CHALLENGE_LABEL.get(slug as never) as string,
          status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
          times_flagged: prior ? prior.times_flagged + 1 : 1,
          last_flagged_at: now,
        }
      })
      await supabase.from('concerns').upsert(rows, { onConflict: 'user_id,slug' })
    }
  } catch { /* the ledger never blocks the check in */ }

  return NextResponse.json({ ok: true })
}
