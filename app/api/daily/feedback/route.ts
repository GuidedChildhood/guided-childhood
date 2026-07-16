import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { dailyMomentLabel } from '@/lib/content/daily-moments'

// Store which daily moments happened today so tomorrow's card can be
// personalised, and mirror each flagged moment into the concerns ledger:
// a fresh flag opens a concern, a repeat flag bumps times_flagged, and a
// concern the family had resolved reopens if it comes back.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { moments } = await request.json() as { moments: string[] }

  const today = new Date().toISOString().split('T')[0]

  await supabase
    .from('daily_sessions')
    .upsert(
      { user_id: user.id, session_date: today, moment_feedback: moments },
      { onConflict: 'user_id,session_date' }
    )

  // Concerns ledger: best effort, never blocks the save. The generic Something
  // else tag is a picker, not a real moment, so it is never tracked as a
  // concern; only the specific moments the parent lands on are.
  const GENERIC_CONCERN_SLUGS = new Set(['something-else', 'something_else', 'other'])
  try {
    const slugs = (moments ?? []).filter(m => dailyMomentLabel(m) !== null && !GENERIC_CONCERN_SLUGS.has(m))
    if (slugs.length > 0) {
      const now = new Date().toISOString()

      const [existingResult, childResult] = await Promise.all([
        supabase
          .from('concerns')
          .select('slug, status, times_flagged')
          .eq('user_id', user.id)
          .in('slug', slugs),
        supabase
          .from('children')
          .select('id')
          .eq('parent_id', user.id)
          .eq('is_primary', true)
          .maybeSingle(),
      ])

      const existing = existingResult.data ?? []
      const childId = childResult.data?.id ?? null

      const rows = slugs.map(slug => {
        const prior = existing.find(c => c.slug === slug)
        return {
          user_id: user.id,
          child_id: childId,
          source: 'moment',
          slug,
          label: dailyMomentLabel(slug) as string,
          // A repeat flag bumps the count. A resolved concern that comes
          // back reopens; otherwise the current status is kept.
          status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
          times_flagged: prior ? prior.times_flagged + 1 : 1,
          last_flagged_at: now,
        }
      })

      await supabase.from('concerns').upsert(rows, { onConflict: 'user_id,slug' })
    }
  } catch { /* the ledger never blocks the daily save */ }

  return NextResponse.json({ saved: true })
}
