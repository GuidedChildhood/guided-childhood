import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { museAuthorised, cleanQuestion, stageForAge, scriptUrl, PRESENTATION_NOTE, STAGE_CHECK_URL, STAGE_CHECK_LINE } from '@/lib/muse/connector'
import { findFreeScripts } from '@/lib/muse/scripts'

// GET /api/muse/scripts?q=<topic>&child_age=<years>: up to three free scripts
// from the library that fit, for Muse. No model call, so it costs nothing and
// is never capped. Free scripts only; the reason is in lib/muse/scripts.ts.

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!museAuthorised(request)) return NextResponse.json({ error: 'Missing or wrong API key' }, { status: 401 })

  const url = new URL(request.url)
  const query = cleanQuestion(url.searchParams.get('q'))
  if (!query) return NextResponse.json({ error: 'Send the topic in "q", for example q=bedtime phone.' }, { status: 400 })
  const staged = stageForAge(url.searchParams.get('child_age'))

  let scripts: Awaited<ReturnType<typeof findFreeScripts>> = []
  try {
    const admin = createAdminClient()
    scripts = await findFreeScripts(admin, query, staged?.scriptStage ?? null, 3)
    await admin.from('muse_calls').insert({ kind: 'scripts' })
  } catch { /* no database is an empty list, never a 500 */ }

  return NextResponse.json({
    scripts: scripts.map(s => ({
      title: s.title,
      situation: s.situation,
      say_this: s.say_this,
      not_this: s.not_this,
      url: scriptUrl(s.id),
    })),
    stage: staged ? { number: staged.stage.id, name: staged.stage.name, ages: staged.stage.ages } : null,
    stage_check: { url: STAGE_CHECK_URL, line: STAGE_CHECK_LINE },
    presentation_note: PRESENTATION_NOTE,
  })
}
