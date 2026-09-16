import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarLessonByHomeCode } from '@/lib/quests/star-lesson-catalogue'
import { normaliseHomeCode, passportFillFor } from '@/lib/school/home-code'

// Redeem a home code (migration 230): the code printed on the parent note
// sheet a class lesson sends home. Entering it credits the module to this
// child as a school_lesson completion, the slot migration 023 held open, so
// the passport records what the class covered without the schools app
// holding a single pupil record. Home educators enter the same codes from
// the pack, which is why the completion never says which door it came
// through.
//
// Deliberately NOT counted toward stage stamps: a school module is credit,
// not a stage lesson, and lib/pathway/progress.ts counts stamps from stage
// lessons only. This row is the record, surfaced wherever school work shows.

export async function POST(req: NextRequest) {
  const { code, child_id } = await req.json()
  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: 'That code does not look right. It is four letters or numbers, like HOME 7K3F.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const homeCode = normaliseHomeCode(code)
  if (!homeCode) {
    return NextResponse.json({ error: 'That code does not look right. It is four letters or numbers, like HOME 7K3F.' }, { status: 400 })
  }

  // Exact match or silence, like the verify page: a wrong code learns only
  // that it is wrong.
  let admin
  try { admin = createAdminClient() } catch {
    return NextResponse.json({ error: 'Codes are not available right now' }, { status: 503 })
  }
  const lesson = await getStarLessonByHomeCode(admin, homeCode)
  if (!lesson) {
    return NextResponse.json({ error: 'No lesson found for that code. Check it against the sheet and try again.' }, { status: 404 })
  }

  // Whose passport the credit lands on. Checked, never trusted; null stays
  // the household row, same doctrine as the lesson completion route.
  let forChild: string | null = null
  if (typeof child_id === 'string' && child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
    forChild = owned?.id ?? null
  }

  const { data: existing } = await supabase
    .from('lesson_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .eq('lesson_source', 'school_lesson')
    .maybeSingle()

  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, child_id: forChild, lesson_id: lesson.id, lesson_source: 'school_lesson', passed: true },
      { onConflict: 'user_id,child_id,lesson_id,lesson_source' }
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // WHAT THE PASSPORT PAGE LOOKED LIKE BEFORE THIS CODE. The card at home
  // draws the page and plays the same fill the classroom wall plays, which
  // needs the before state as well as the after: a ring that jumps is a
  // number changing, a ring that sweeps is a child's page filling.
  //
  // After the upsert on purpose, and `before` excludes today's module, so a
  // parent entering the same code twice sees the page it already had rather
  // than a second helping of the same animation.
  const moduleId = lesson.module_id ?? null
  const fill = moduleId
    ? await passportFillFor(supabase, admin, user.id, forChild, moduleId)
    : null

  return NextResponse.json({
    ok: true,
    title: lesson.title,
    yearBand: lesson.year_band ?? null,
    alreadyDone: !!existing,
    moduleId,
    placement: fill?.placement ?? null,
    before: fill?.before ?? [],
  })
}
