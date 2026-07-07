import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The Right Now rescue: a parent taps the situation mid meltdown and this
// route returns the best matching script for their child's stage in one
// round trip. It also logs the moment to the concerns ledger (source
// 'rightnow') so tomorrow's check in can ask how it went.
//
// Scripts stay in the database (non negotiable 6). RLS already hides paid
// scripts from unpaid accounts, and we additionally prefer free scripts
// for unpaid parents so the row they get is one they can open again later.

type SituationKey =
  | 'wont-get-up'
  | 'morning-tv'
  | 'tv-off'
  | 'phone-handover'
  | 'bedtime'
  | 'sibling-fight'
  | 'homework'
  | 'something-else'

const SITUATIONS: Record<SituationKey, {
  label: string
  category: string | null
  keywords: string[]
}> = {
  'wont-get-up':    { label: 'Will not get up, late night before', category: 'screen-time', keywords: ['get up', 'out of bed', 'wake', 'get out of bed', 'morning', 'late night', 'tired'] },
  'morning-tv':     { label: 'Morning TV, will not get ready', category: 'screen-habits', keywords: ['morning', 'get dressed', 'dressed', 'uniform', 'ready', 'before school', 'tv', 'breakfast'] },
  'tv-off':         { label: 'TV or screen turned off',   category: 'screen-habits', keywords: ['turn off', 'turned off', 'switch off', 'tv', 'screen time', 'time is up', 'ending', 'transition'] },
  'phone-handover': { label: 'Phone handover fight',      category: 'screen-habits', keywords: ['phone', 'hand over', 'handover', 'hand it', 'give', 'put down', 'put it away', 'device away'] },
  'bedtime':        { label: 'Bedtime battle',            category: 'screen-habits', keywords: ['bedtime', 'bed', 'bedroom', 'sleep', 'night', 'evening'] },
  'sibling-fight':  { label: 'Sibling fight over device', category: 'screen-habits', keywords: ['sibling', 'brother', 'sister', 'shar', 'turn', 'fight', 'argu'] },
  'homework':       { label: 'Homework refusal',          category: 'screen-habits', keywords: ['homework', 'school work', 'focus', 'refus', 'distract', 'study'] },
  'something-else': { label: 'Something else',            category: null,            keywords: [] },
}

type ScriptRow = {
  title: string
  situation: string
  say_this: string
  not_this: string
  category: string | null
  is_free: boolean
  sort_order: number
}

function scoreScript(script: ScriptRow, def: (typeof SITUATIONS)[SituationKey], preferFree: boolean): number {
  let score = 0
  if (def.category && script.category === def.category) score += 3
  const haystack = `${script.title} ${script.situation}`.toLowerCase()
  for (const kw of def.keywords) {
    if (haystack.includes(kw)) score += 2
  }
  if (preferFree && script.is_free) score += 1
  return score
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { situation } = await request.json() as { situation: string }
  const def = SITUATIONS[situation as SituationKey]
  if (!def) return NextResponse.json({ error: 'Unknown situation' }, { status: 400 })

  const [{ data: profile }, { data: child }] = await Promise.all([
    supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
    supabase.from('children').select('id, stage_id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  const preferFree = profile?.subscription_status !== 'active'
  const stageId = child?.stage_id ?? null

  // One query for the child's stage; RLS filters to what this account may see.
  let { data: scripts } = stageId
    ? await supabase
        .from('scripts')
        .select('title, situation, say_this, not_this, category, is_free, sort_order')
        .eq('stage_id', stageId)
        .order('sort_order', { ascending: true })
    : { data: null }

  // Fallback: no child row yet, or nothing visible at that stage.
  if (!scripts || scripts.length === 0) {
    const { data: allScripts } = await supabase
      .from('scripts')
      .select('title, situation, say_this, not_this, category, is_free, sort_order')
      .order('sort_order', { ascending: true })
    scripts = allScripts
  }

  if (!scripts || scripts.length === 0) {
    return NextResponse.json({ error: 'No script available' }, { status: 404 })
  }

  const rows = scripts as ScriptRow[]
  let best = rows[0]
  let bestScore = -1
  for (const row of rows) {
    const score = scoreScript(row, def, preferFree)
    if (score > bestScore) {
      best = row
      bestScore = score
    }
  }

  // Concerns ledger: best effort, never blocks the rescue.
  try {
    const slug = `rightnow-${situation}`
    const now = new Date().toISOString()
    const { data: prior } = await supabase
      .from('concerns')
      .select('status, times_flagged')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .maybeSingle()

    await supabase.from('concerns').upsert({
      user_id: user.id,
      child_id: child?.id ?? null,
      source: 'rightnow',
      slug,
      label: def.label,
      status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
      times_flagged: prior ? prior.times_flagged + 1 : 1,
      last_flagged_at: now,
    }, { onConflict: 'user_id,slug' })
  } catch { /* the ledger never blocks the rescue */ }

  return NextResponse.json({
    title: best.title,
    say_this: best.say_this,
    not_this: best.not_this,
    sort_order: best.sort_order,
  })
}
