import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect, notFound } from 'next/navigation'
import { SOCIAL_MEDIA_LAW } from '@/lib/config/social-media-law'
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
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
  await supabase
    .from('script_completions')
    .upsert({ user_id: user.id, script_sort_order: sortOrder, completed_at: new Date().toISOString() }, { onConflict: 'user_id,script_sort_order' })

  const showBanNote = script.law_flag !== 'none' && SOCIAL_MEDIA_LAW !== 'none'

  const [{ data: prevScript }, { data: nextScript }, { data: primaryChild }, { data: myCompletion }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title').eq('stage_id', script.stage_id).lt('sort_order', sortOrder).order('sort_order', { ascending: false }).limit(1).maybeSingle(),
    // "See the next one for this age", Justin's words. sort_order + 1 walks out
    // of the stage the moment you reach its last script, which on a library
    // grouped by stage means the next tap lands a parent of a six year old on a
    // script about sextortion. Same stage, next number up.
    supabase.from('scripts').select('sort_order, title').eq('stage_id', script.stage_id).gt('sort_order', sortOrder).order('sort_order', { ascending: true }).limit(1).maybeSingle(),
    supabase.from('children').select('id, name, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('script_completions').select('worked, status').eq('user_id', user.id).eq('script_sort_order', sortOrder).maybeSingle(),
  ])
  const workedRating = (myCompletion as { worked?: 'yes' | 'somewhat' | 'no' | null } | null)?.worked ?? null
  const scriptStatus = ((myCompletion as { status?: string } | null)?.status ?? 'opened') as 'opened' | 'used' | 'not_needed'

  // Does this child have their own app (a kid link)? If so the note goes
  // straight to their phone and their app, not out over SMS.
  const { data: kidLink } = primaryChild?.id
    ? await supabase.from('kid_links').select('token').eq('child_id', primaryChild.id).maybeSingle()
    : { data: null }
  const childHasApp = Boolean((kidLink as { token?: string } | null)?.token)

  return (
    <ScriptDetailView
      script={script}
      sortOrder={sortOrder}
      showBanNote={showBanNote}
      voiceUrl={scriptVoiceUrl(sortOrder)}
      isPaid={isPaid}
      childName={primaryChild?.name ?? null}
      childPhone={primaryChild?.phone ?? null}
      childId={primaryChild?.id ?? null}
      childHasApp={childHasApp}
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
  )
}
