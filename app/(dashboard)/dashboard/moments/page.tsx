import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type AgeBand } from '@/lib/content/stages'
import MomentsGrid from './MomentsGrid'
import type { Moment } from '@/components/cards/MomentCard'

export default async function MomentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [childResult, momentsResult] = await Promise.all([
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
  ])

  const child = childResult.data
  const allMoments: Moment[] = momentsResult.data ?? []

  // Filter to child's age band if known
  const moments = child?.age_band
    ? allMoments.filter(m => m.age_bands.length === 0 || m.age_bands.includes(child.age_band as AgeBand))
    : allMoments

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
      />
    </div>
  )
}
