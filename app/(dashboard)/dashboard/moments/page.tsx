import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import BackTo from '@/components/nav/BackTo'
import { redirect } from 'next/navigation'
import { ageBandInList } from '@/lib/content/stages'
import MomentsGrid from './MomentsGrid'
import type { Moment } from '@/components/cards/MomentCard'

export default async function MomentsPage({ searchParams }: { searchParams: Promise<{ from?: string; child?: string }> }) {
  const { from: from_, child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [childResult, momentsResult, focusResult] = await Promise.all([
    // In the same wave as before: getChildren returns a promise like any
    // other read, so honouring ?child= costs no extra round trip.
    getChildren<{ id: string; name: string | null; age_band: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'name, age_band'),
    supabase
      .from('daily_moments')
      .select('id, title, category, age_bands, icon, science_brief, digi_opener')
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('concerns')
      .select('label')
      .eq('user_id', user.id)
      .in('status', ['open', 'improving'])
      .order('last_flagged_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const child = childResult.child
  const allMoments: Moment[] = momentsResult.data ?? []

  // Filter to child's age band if known, matching by range overlap so a
  // moment tagged 8-11 still reaches a child on the app's 8-10 band.
  const moments = child?.age_band
    ? allMoments.filter(m => ageBandInList(child.age_band, m.age_bands))
    : allMoments

  // DiGi's pick: the same intelligence that runs the home path chooses one
  // card here. Time of day sets the category, the family's live focus can
  // override it, and the reason is said out loud so the pick feels known,
  // never random.
  const ukHour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date()))
  const focusLabel = focusResult.data?.label ?? null
  const timeCategory = ukHour < 11 ? 'Morning' : ukHour < 15 ? 'School' : ukHour < 17 ? 'Food' : ukHour < 21 ? 'Evening' : 'Evening'
  const screensFocus = focusLabel ? /screen|phone|tablet|game|gaming|tiktok|youtube|device/i.test(focusLabel) : false
  const pool = moments.length > 0 ? moments : allMoments
  const suggested =
    (screensFocus ? pool.find(m => m.category === 'Digital') : null) ??
    pool.find(m => m.category === timeCategory) ??
    pool[0] ?? null
  const suggestReason = suggested
    ? screensFocus && suggested.category === 'Digital'
      ? `because ${focusLabel} is what you are working on right now`
      : ukHour < 11 ? 'because the morning is where today gets decided'
      : ukHour < 15 ? 'because the school day is in full swing'
      : ukHour < 17 ? 'because the after school window is close'
      : 'because the evening wind down is coming'
    : null

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>
      <BackTo from={from_} />
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Moment cards</p>
        {/* WHOSE MOMENT. Justin, 18 August 2026: "moments needs to show add
            moment for child name, and only when added for each child does it
            say done." The name was a trailing sentence, "Filtered for Olgie",
            which is a footnote about a filter rather than a statement about who
            this is for. On a page a parent visits once per child per day, whose
            it is belongs in the heading. */}
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
          {child?.name && child.name !== 'Your child'
            ? `A moment with ${child.name}`
            : 'Every moment, handled'}
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          Flip a card to get the science and the exact words from DiGi.
          {child?.name && child.name !== 'Your child'
            ? ` Cards for their age, and doing one counts for them alone, so each child gets their own.`
            : ''}
        </p>
      </div>

      <MomentsGrid
        initialMoments={moments}
        allMoments={allMoments}
        childName={child?.name ?? undefined}
        ageBand={child?.age_band ?? undefined}
        suggestedId={suggested?.id}
        suggestReason={suggestReason ?? undefined}
      />
    </div>
  )
}
