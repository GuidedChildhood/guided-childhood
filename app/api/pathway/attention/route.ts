import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { pickChild } from '@/lib/children/select'
import { STAGES } from '@/lib/content/stages'
import { passportAttention } from '@/lib/pathway/passport-attention'

// The one reason the passport wants a look today, for the peek on Today.
//
// Fetched by the client AFTER Today has painted, so the home page's own time to
// first byte pays nothing for it: the peek flips in a moment later, which is
// what a thing that flips in should do anyway. Null means stay out.
//
// Reads the same two halves the stamp reads (lib/pathway/stamped.ts): the
// stage's content and this child's own check passes. Never a new rule.

export const dynamic = 'force-dynamic'

const SLUGS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
const STAGE_NUM: Record<string, number> = { foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5 }

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const childParam = req.nextUrl.searchParams.get('child')
  const [profileRes, childrenRes] = await Promise.all([
    supabase.from('profiles').select('first_checkin_at').eq('id', user.id).maybeSingle(),
    supabase.from('children').select('id, name, stage_id, is_primary, streak_weeks').eq('parent_id', user.id).order('is_primary', { ascending: false }),
  ])
  const child = pickChild((childrenRes.data ?? []) as { id: string; name: string; stage_id: string | null; is_primary: boolean; streak_weeks: number | null }[], childParam)
  const currentStage = child?.stage_id ? STAGE_NUM[child.stage_id] ?? null : null
  if (!child || !currentStage) return NextResponse.json({ attention: null })

  try {
    const [progress, passed] = await Promise.all([
      getAllStagesProgress(supabase, user.id, child.streak_weeks ?? 0, child.id),
      getPassedStageQuizzes(supabase, user.id, child.id),
    ])
    const attention = passportAttention({
      hasCheckedIn: !!profileRes.data?.first_checkin_at,
      currentStage,
      childName: child.name ?? null,
      stages: SLUGS.map((slug, i) => {
        const p = progress[slug]
        return {
          id: i + 1, name: STAGES[i].name,
          lessonsDone: p.lessonsDone, lessonsTotal: p.lessonsTotal,
          scriptsDone: p.scriptsDone, scriptsTotal: p.scriptsTotal,
          contentComplete: p.contentComplete, checkPassed: passed.has(i + 1),
        }
      }),
    })
    return NextResponse.json({ attention, childId: child.id })
  } catch {
    // Decoration on Today. A failed read is a quiet day, never an error card.
    return NextResponse.json({ attention: null })
  }
}
