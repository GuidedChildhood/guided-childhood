import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { AgeBand } from '@/lib/content/stages'
import DeviceHub from './DeviceHub'
import type { DeviceGuide } from './DeviceList'

const STAGE_MAP: Record<string, { id: string; label: string }> = {
  '4-7':   { id: 'foundation',  label: 'Foundation · Ages 4 to 7' },
  '8-10':  { id: 'builder',     label: 'Builder · Ages 8 to 10' },
  '11-13': { id: 'explorer',    label: 'Explorer · Ages 11 to 13' },
  '13-15': { id: 'shaper',      label: 'Shaper · Ages 13 to 15' },
  '16+':   { id: 'independent', label: 'Independent · Ages 16 and above' },
}

export default async function DevicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  const ageBand = (child?.age_band as AgeBand) ?? '11-13'
  const stage = STAGE_MAP[ageBand] ?? STAGE_MAP['11-13']
  const childAge = { '4-7': 6, '8-10': 9, '11-13': 12, '13-15': 14, '16+': 16 }[ageBand] ?? 12

  const [{ data: devicesData }, { data: stageNote }, { data: progressData }] = await Promise.all([
    supabase
      .from('device_guides')
      .select('device_key, name, category, emoji, min_age, subtitle, why, steps, note, sort_order')
      .order('sort_order', { ascending: true }),
    supabase
      .from('device_stage_notes')
      .select('desc_text, science')
      .eq('stage_id', stage.id)
      .maybeSingle(),
    supabase
      .from('device_setup_progress')
      .select('device_key')
      .eq('user_id', user.id),
  ])

  const devices = (devicesData ?? []) as DeviceGuide[]
  const completedKeys = (progressData ?? []).map(p => p.device_key as string)

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Device Safety Hub</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>
          Set up every device the right way
        </h1>
        <p style={{ color: 'var(--ink)', fontSize: '15px' }}>
          Step by step guides for every device{child?.name && child.name !== 'Your child' ? ` ${child.name} uses` : ' your family uses'}, matched to age.
        </p>
      </div>

      {stageNote && (
        <div style={{ background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
            {stage.label}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px' }}>
            {stageNote.desc_text}
          </p>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', borderLeft: '3px solid var(--terracotta)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              What the research says at this age
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>
              {stageNote.science}
            </p>
          </div>
        </div>
      )}

      <DeviceHub devices={devices} childAge={childAge} initialCompleted={completedKeys} />
    </div>
  )
}
