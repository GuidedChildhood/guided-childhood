import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PublicScriptView from '@/components/scripts/PublicScriptView'

// ── THE PUBLIC FACE OF ONE SCRIPT ───────────────────────────────────────────
//
// Justin, 12 October 2026: "usable and sharable on social media to other
// parents... an agent goal to solve every parents problem we are trying to
// solve."
//
// There was no way to share a script with another parent. Not a broken way, no
// way: the only share in the whole scripts stack is the note for the child in
// ScriptDepth, which shares text with no link. Every other share in the app
// (moments, the deck, quests) carries a URL. Scripts carried nothing, so the
// one artifact a parent actually wants to pass on, the exact sentence that
// stopped the fight, had to be retyped or screenshotted.
//
// This is what a shared link opens. It is the /m/<id> pattern that already
// works for moments: no login, the words in full, one taste, the stage check
// as the next step. The layout lives in PublicScriptView so the dev fixture
// can render it without a database.
//
// ── WHY THE UUID AND NOT THE NUMBER ─────────────────────────────────────────
//
// A script's public identity inside the app is its sort_order, and /say/142
// would have been the prettier link. It would also have been a ladder:
// /say/1 to /say/342 walks the entire paid library, and `say_this` IS the
// product. The uuid is not guessable, is stable for ever (so a link in a
// WhatsApp group from last March still works, and the unfurl stays cached),
// and needs no new secret and no migration. Same reasoning as /m/<id>.
//
// ── WHY THE SERVICE ROLE, AND WHY THAT IS STILL A NARROW DOOR ───────────────
//
// `public.scripts` is behind RLS that is stricter than the code: a live trial
// sees only the starter set. A public page cannot authenticate as anybody, so
// it reads with the service role, exactly as /m/<id> does.
//
// The door stays narrow by the shape of the query, not by the key: the id has
// to have been given to the visitor, it is matched against a uuid shape before
// any request is made, it is pinned to one row, and six named columns come
// back. The four deeper fields (why it works, before the moment, the push back
// reply, the follow up) and the child note are NOT in the select list, so they
// cannot reach this page even by accident.
//
// ── WHAT IS GIVEN AWAY, ON PURPOSE ──────────────────────────────────────────
//
// The title, the situation, the line to say and the line not to say. That is
// one script out of 342, and it is the piece a parent wants to pass on. The
// held back half is named rather than hidden, because "there is more" only
// works as an invitation if a stranger can see what more is.

type ScriptRow = {
  id: string
  sort_order: number
  stage_id: string
  title: string
  situation: string
  say_this: string
  not_this: string
}

async function getScript(id: string): Promise<ScriptRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('scripts')
    .select('id, sort_order, stage_id, title, situation, say_this, not_this')
    .eq('id', id)
    .maybeSingle()
  return (data as ScriptRow | null) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const script = await getScript(id).catch(() => null)
  if (!script) return { title: 'Guided Childhood' }
  // The description IS the line to say. A parent scrolling a group chat sees
  // the words, not a pitch for the words.
  const description = `"${script.say_this}"`.slice(0, 200)
  return {
    title: `${script.title} · Guided Childhood`,
    description,
    openGraph: { title: script.title, description },
  }
}

// Is the person reading this already one of ours? Same rule as the shared
// moment page: never sell something to someone who has bought it, and an
// error reads as signed out, which is the safe way round.
async function isMember(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return Boolean(user)
  } catch { return false }
}

export default async function PublicScriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [script, member] = await Promise.all([getScript(id), isMember()])
  if (!script) notFound()

  return (
    <PublicScriptView
      title={script.title}
      situation={script.situation}
      sayThis={script.say_this}
      notThis={script.not_this}
      stageId={script.stage_id}
      sortOrder={script.sort_order}
      member={member}
    />
  )
}
