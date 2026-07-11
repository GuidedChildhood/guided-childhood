import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runEvals } from '@/lib/digi/evals'
import { highestSeverity } from '@/lib/digi/safety'
import { NextResponse } from 'next/server'

// Founder facing, on demand: run the DiGi eval suite and return the scored
// results. Any case that breached a hard rule is also logged to
// digi_safety_flags (source eval) so the safety board shows evals and live
// traffic in one place.

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  let run
  try {
    run = await runEvals()
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Eval run failed' }, { status: 502 })
  }

  // Log the breaches so they land on the same safety board as live traffic.
  const breaches = run.results.filter(r => !r.safetyPass)
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

  return NextResponse.json(run)
}
