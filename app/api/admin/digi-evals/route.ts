import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runEvals, type EvalRun } from '@/lib/digi/evals'
import { highestSeverity } from '@/lib/digi/safety'
import { DIGI_RESEARCH_BASE, parseResearchBase } from '@/lib/config/digi'
import { NextResponse } from 'next/server'

// Founder facing, on demand: run the DiGi eval suite and return the scored
// results. Any case that breached a hard rule is also logged to
// digi_safety_flags (source eval) so the safety board shows evals and live
// traffic in one place.
//
// ?research=file|retrieval scores the suite against that research base
// instead of the configured one (lib/config/digi.ts). ?research=both runs
// the two side by side on the same cases and returns the configured run with
// the other under `compare`, so the switch can be judged before it flips.

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const research = new URL(request.url).searchParams.get('research')
  const other = DIGI_RESEARCH_BASE === 'file' ? 'retrieval' : 'file'

  let run: EvalRun
  let compare: EvalRun | null = null
  try {
    if (research === 'both') {
      ;[run, compare] = await Promise.all([runEvals(DIGI_RESEARCH_BASE), runEvals(other)])
    } else {
      run = await runEvals(research ? parseResearchBase(research) : DIGI_RESEARCH_BASE)
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Eval run failed' }, { status: 502 })
  }

  // Log the breaches so they land on the same safety board as live traffic.
  // Only the configured base's: a breach on the base that is not live is a
  // reason not to flip, not a live incident.
  const breaches = run.researchBase === DIGI_RESEARCH_BASE ? run.results.filter(r => !r.safetyPass) : []
  if (breaches.length > 0) {
    try {
      const admin = createAdminClient()
      await admin.from('digi_safety_flags').insert(
        breaches.map(r => ({
          user_id: null,
          stage_id: null,
          question: r.prompt.slice(0, 1000),
          reply: r.reply.slice(0, 2000),
          violations: r.violations,
          severity: highestSeverity(r.violations),
          source: 'eval',
        })),
      )
    } catch { /* best effort */ }
  }

  return NextResponse.json(compare ? { ...run, compare } : run)
}
