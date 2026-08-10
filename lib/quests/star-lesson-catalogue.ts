import type { SupabaseClient } from '@supabase/supabase-js'

// The parent app's one door to the schools curriculum content (split step 6,
// plans/split-plan.md). The school_lessons table is moving from the public
// schema into the schools schema (migration 177), and deploys and SQL runs
// never land in the same instant, so every read here asks the schools schema
// first and falls back to public when the schema does not exist yet or is
// not exposed yet. Once 177 has run and the schema is exposed, the first
// call succeeds and the fallback never fires again. The fallback comes out
// in the post cutover cleanup.
//
// This is deliberately the ONLY file in the parent app that names
// school_lessons, so when the fallback is removed there is one place to
// touch, and the split audit's "four read sites" become one.

// PostgREST failure codes for "that schema is not there": PGRST106 is
// schema not in the exposed list; 42P01 is relation does not exist.
const SCHEMA_MISSING = new Set(['PGRST106', '42P01'])

async function firstHit<T>(
  supabase: SupabaseClient,
  run: (from: (table: 'school_lessons') => ReturnType<ReturnType<SupabaseClient['schema']>['from']>) => PromiseLike<{ data: T | null; error: { code?: string } | null }>,
): Promise<T | null> {
  const inSchools = await run(t => supabase.schema('schools').from(t))
  if (!inSchools.error) return inSchools.data
  if (!SCHEMA_MISSING.has(inSchools.error.code ?? '')) return null
  const inPublic = await run(t => supabase.from(t))
  return inPublic.error ? null : inPublic.data
}

export type StarLessonRow = {
  id: string
  module_id?: string
  title: string
  key_stage?: string
  year_band?: string
  single_action_outcome?: string
  character_cast?: string | null
  slides?: unknown
}

// The sendable catalogue, ordered the way the curriculum orders itself.
export function listStarLessons(supabase: SupabaseClient) {
  return firstHit<StarLessonRow[]>(supabase, from =>
    from('school_lessons')
      .select('id, module_id, title, key_stage, year_band, single_action_outcome')
      .order('sort_order'),
  )
}

// One lesson with its deck, for the preview and for the child playing it.
export function getStarLesson(supabase: SupabaseClient, id: string, columns: string) {
  return firstHit<StarLessonRow>(supabase, from =>
    from('school_lessons').select(columns).eq('id', id).maybeSingle() as never,
  )
}

// Titles for a set of lesson ids: the replacement for the old
// school_lessons(title) join on the kid page, which cannot survive the FK
// drop (PostgREST embeds ride foreign keys). One extra query, cached by
// the page's own revalidation.
export async function starLessonTitles(supabase: SupabaseClient, ids: string[]) {
  if (ids.length === 0) return new Map<string, string>()
  const rows = await firstHit<{ id: string; title: string }[]>(supabase, from =>
    from('school_lessons').select('id, title').in('id', ids),
  )
  return new Map((rows ?? []).map(r => [r.id, r.title]))
}
