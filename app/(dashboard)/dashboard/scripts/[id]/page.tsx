import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import RecordScriptOpen from '@/components/scripts/RecordScriptOpen'
import { hasFullAccess } from '@/lib/access'
import { redirect, notFound } from 'next/navigation'
import { SOCIAL_MEDIA_LAW } from '@gc/shared/social-media-law'
import ScriptDetailView from '@/components/scripts/ScriptDetailView'
import { scriptVoiceUrl } from '@/lib/content/script-voice'
import { isScriptLocked } from '@/lib/content/free-script-limit'

type ScriptRow = {
  id: string
  stage_id: string
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  law_flag: string
  is_free: boolean
  sort_order: number
  if_they_push_back: string | null
  check_back: string | null
  for_your_child: string | null
}

export default async function ScriptDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string; stage?: string; child?: string }>
}) {
  const { id } = await params
  // Arrived from the road or the passport, so the way back is the road and not
  // the library. Read off the link rather than the referrer, matching the
  // devices page and the scripts index.
  const { from, stage, child: childParam } = await searchParams
  const cameFromPathway = from === 'pathway' || from === 'passport'
  const sortOrder = parseInt(id, 10)
  if (isNaN(sortOrder) || sortOrder < 1) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at')
    .eq('id', user.id)
    .single()

  const isPaid = hasFullAccess(profile, user.email)

  const { data: script } = await supabase
    .from('scripts')
    .select('*')
    .eq('sort_order', sortOrder)
    .single() as { data: ScriptRow | null }

  if (!script) notFound()

  if (await isScriptLocked(supabase, user.id, isPaid, script)) {
    redirect('/dashboard/upgrade')
  }

  // OPENING IS NOT USING, and this used to say the opposite.
  //
  // The old comment here argued that finding the script the moment you need it
  // IS the completion, so the page marked it done on load. True when a parent
  // comes looking for words to say tonight. False when they open one from the
  // pathway to see whether it applies and decide it does not, which is most of
  // what browsing a library of 236 looks like.
  //
  // And scriptsPct counts these rows at thirty per cent of the stage blend, so
  // that reading moved a child's passport for conversations that never
  // happened, and permanently: a script marked done is never offered again.
  //
  // The row is still written on open, because the daily path needs to know a
  // script was opened today and because the parent needs somewhere to record a
  // decision. What changed is that it lands as 'opened', which counts for
  // nothing until they say otherwise. See migration 157.
  //
  // onConflict ignoreDuplicates is wrong here and worth saying so: the daily
  // path reads completed_at to tick today, so a re-read on a later day has to
  // refresh it. What must NOT be touched is status, which is why the upsert
  // below never sends one. Postgres leaves an unlisted column alone on
  // conflict, so a script already marked used or not needed keeps that.
  // The read tick belongs to the OPEN child (migration 213, key 219): reading
  // the bedtime script with Jody marks Jody's day and leaves Tray's alone.
  //
  // And so does EVERYTHING ELSE ON THE PAGE. This used to resolve the open
  // child for the tick and then fetch the PRIMARY child for the name, the
  // phone and the kid link, so with Olga's tab selected the page still said "A
  // note for Teo" and sent it to Teo's app. One child, picked once, the same
  // way every page picks one (lib/children/server.ts).
  const { child } = await getChildren<{ id: string; name: string | null; phone: string | null; is_primary: boolean | null }>(
    supabase, user.id, childParam, 'name, phone')
  const readChild = child?.id ?? null
  // The opened row and its learning stream event are NOT written here any
  // more. A server render is not a read: the child switcher pills fully
  // prefetched this page for the other child and wrote their row (Justin,
  // 5 September 2026, Todd's road ticked a script only Jonny had read).
  // RecordScriptOpen below posts to /api/completions from the browser once the
  // page is really open, with the child the address names, and that route
  // writes the row and the event. See components/scripts/RecordScriptOpen.tsx.

  const showBanNote = script.law_flag !== 'none' && SOCIAL_MEDIA_LAW !== 'none'

  const [{ data: prevScript }, { data: nextScript }, { data: completionRows }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title').eq('stage_id', script.stage_id).lt('sort_order', sortOrder).order('sort_order', { ascending: false }).limit(1).maybeSingle(),
    // "See the next one for this age", Justin's words. sort_order + 1 walks out
    // of the stage the moment you reach its last script, which on a library
    // grouped by stage means the next tap lands a parent of a six year old on a
    // script about sextortion. Same stage, next number up.
    supabase.from('scripts').select('sort_order, title').eq('stage_id', script.stage_id).gt('sort_order', sortOrder).order('sort_order', { ascending: true }).limit(1).maybeSingle(),
    // Not maybeSingle: the key is per child (219), so a script both children
    // have rows for came back as a PostgREST error, the data read as null, and
    // a script marked used showed its buttons unpressed. This child's row
    // decides, and a legacy row with no child speaks for everybody, exactly as
    // the status route treats it on write.
    supabase.from('script_completions').select('worked, status, child_id').eq('user_id', user.id).eq('script_sort_order', sortOrder),
  ])
  const compRows = (completionRows ?? []) as { worked?: 'yes' | 'somewhat' | 'no' | null; status?: string | null; child_id?: string | null }[]
  const myCompletion = compRows.find(r => r.child_id === readChild) ?? compRows.find(r => r.child_id == null) ?? null
  const workedRating = myCompletion?.worked ?? null
  const scriptStatus = (myCompletion?.status ?? 'opened') as 'opened' | 'read' | 'used' | 'not_needed'

  // Does this child have their own app (a kid link)? If so the note goes
  // straight to their phone and their app, not out over SMS.
  const { data: kidLink } = child?.id
    ? await supabase.from('kid_links').select('token').eq('child_id', child.id).maybeSingle()
    : { data: null }
  const childHasApp = Boolean((kidLink as { token?: string } | null)?.token)

  return (<>
    <RecordScriptOpen sortOrder={sortOrder} />
    <ScriptDetailView
      script={script}
      sortOrder={sortOrder}
      backToPathway={cameFromPathway}
      stageSlug={stage ?? null}
      showBanNote={showBanNote}
      voiceUrl={scriptVoiceUrl(sortOrder)}
      isPaid={isPaid}
      childName={child?.name ?? null}
      childPhone={child?.phone ?? null}
      childId={child?.id ?? null}
      childHasApp={childHasApp}
      // The URL's child, so the view's own links keep carrying it. The
      // primary child keeps the clean URL, same as the switcher.
      childIdParam={childParam && child && !child.is_primary ? child.id : null}
      workedRating={workedRating}
      scriptStatus={scriptStatus}
      prevScript={prevScript ?? null}
      nextScript={nextScript ?? null}
      depthInitial={{
        ifTheyPushBack: script.if_they_push_back ?? undefined,
        checkBack: script.check_back ?? undefined,
        forYourChild: script.for_your_child ?? undefined,
      }}
    />
  </>)
}
