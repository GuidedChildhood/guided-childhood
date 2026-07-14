import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type AgeBand } from '@/lib/content/stages'
import MomentsGrid from './MomentsGrid'
import type { Moment } from '@/components/cards/MomentCard'

export default async function MomentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [childResult, momentsResult, focusResult] = await Promise.all([
    supabase
      .from('children')
      .select('name, age_band')
      .eq('parent_id', user.id)
      .eq('is_primary', true)
      .maybeSingle(),
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

  const child = childResult.data
  const allMoments: Moment[] = momentsResult.data ?? []

  // Filter to child's age band if known
  const moments = child?.age_band
    ? allMoments.filter(m => m.age_bands.length === 0 || m.age_bands.includes(child.age_band as AgeBand))
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
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Moment cards</p>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '8px' }}>
          Every moment, handled
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          Flip a card to get the science and the exact words from DiGi.
          {child?.name && child.name !== 'Your child' ? ` Filtered for ${child.name}.` : ''}
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
