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

  // The purpose of this tool is to find the script the moment you need
  // it, not to run a separate completion ritual. Opening it here IS
  // using it, so this is the one and only place completion gets marked
  // for the vast majority of visits (the deck flow marks it too, same
  // row, upsert makes either order safe). Never touches the worked
  // rating a parent may have already given.
  await supabase
    .from('script_completions')
    .upsert({ user_id: user.id, script_sort_order: sortOrder }, { onConflict: 'user_id,script_sort_order' })

  const showBanNote = script.law_flag !== 'none' && SOCIAL_MEDIA_LAW !== 'none'

  const [{ data: prevScript }, { data: nextScript }, { data: primaryChild }, { data: myCompletion }] = await Promise.all([
    supabase.from('scripts').select('sort_order, title').eq('sort_order', sortOrder - 1).maybeSingle(),
    supabase.from('scripts').select('sort_order, title').eq('sort_order', sortOrder + 1).maybeSingle(),
    supabase.from('children').select('id, name, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('script_completions').select('worked').eq('user_id', user.id).eq('script_sort_order', sortOrder).maybeSingle(),
  ])
  const workedRating = (myCompletion as { worked?: 'yes' | 'somewhat' | 'no' | null } | null)?.worked ?? null

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
