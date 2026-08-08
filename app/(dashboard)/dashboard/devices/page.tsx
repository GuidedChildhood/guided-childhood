import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BackTo from '@/components/nav/BackTo'
import { redirect } from 'next/navigation'
import type { AgeBand } from '@/lib/content/stages'
import DeviceHub from './DeviceHub'
import DeviceSweepCard from '@/components/devices/DeviceSweepCard'
import type { DeviceGuide } from './DeviceList'

type ProgressRow = { device_key: string; status?: string; family_device_id?: string | null }

const STAGE_MAP: Record<string, { id: string; label: string }> = {
  '4-7':   { id: 'foundation',  label: 'Foundation · Ages 4 to 7' },
  '8-10':  { id: 'builder',     label: 'Builder · Ages 8 to 10' },
  '11-13': { id: 'explorer',    label: 'Explorer · Ages 11 to 13' },
  '13-15': { id: 'shaper',      label: 'Shaper · Ages 13 to 15' },
  '16+':   { id: 'independent', label: 'Independent · Ages 16 and above' },
}

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  // Where the parent came from, so the way out goes back there.
  //
  // This page is reached from Home, the passport and DiGi, and the exit always
  // said Home whichever door was used. A parent working through the passport
  // tapped "Set up the devices", did it, pressed the only way back and landed
  // somewhere they had not been, with their place in the passport lost.
  //
  // Read from the link rather than the referrer: a referrer is stripped by
  // enough browsers and privacy settings that the back button would silently
  // change meaning depending on the reader's setup.
  const { from } = await searchParams
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

  // Progress comes back in two scopes now: rows about a GUIDE, which is what
  // the coverage board and the catalogue read, and rows about a SCREEN, added
  // by migration 169 because one guide covers more than one screen and ticking
  // the iPhone was ticking the iPad with it.
  //
  // Read in its own guarded pair rather than folded into the query below,
  // because naming a column that does not exist yet fails the WHOLE query it
  // is part of, and migrations here are run by hand. perDevice false means 169
  // has not landed, and the page then behaves exactly as it did before.
  async function readProgress(): Promise<{ rows: ProgressRow[]; perDevice: boolean }> {
    const withDevice = await supabase
      .from('device_setup_progress')
      .select('device_key, status, family_device_id')
      .eq('user_id', user!.id)
    if (!withDevice.error) return { rows: (withDevice.data ?? []) as ProgressRow[], perDevice: true }

    const legacy = await supabase
      .from('device_setup_progress')
      .select('device_key, status')
      .eq('user_id', user!.id)
    return { rows: (legacy.data ?? []) as ProgressRow[], perDevice: false }
  }

  const [{ data: devicesData }, { data: stageNote }, progress] = await Promise.all([
    supabase
      .from('device_guides')
      .select('device_key, name, category, emoji, min_age, subtitle, why, steps, note, sort_order')
      .order('sort_order', { ascending: true }),
    supabase
      .from('device_stage_notes')
      .select('desc_text, science')
      .eq('stage_id', stage.id)
      .maybeSingle(),
    readProgress(),
  ])

  const devices = (devicesData ?? []) as DeviceGuide[]
  // status is done (settings in place) or not_owned (we do not have this yet).
  // Before migration 090 there is no status column, so a missing value reads
  // as done, exactly as it did before.
  const guideRows = progress.rows.filter(p => !p.family_device_id)
  const completedKeys = guideRows.filter(p => (p.status ?? 'done') === 'done').map(p => p.device_key)
  const notOwnedKeys = guideRows.filter(p => p.status === 'not_owned').map(p => p.device_key)
  // null, not an empty list, when 169 is not there. The two mean different
  // things downstream: no screens ticked, versus we cannot tell yet.
  const doneDeviceIds = progress.perDevice
    ? progress.rows.filter(p => p.family_device_id && (p.status ?? 'done') === 'done').map(p => p.family_device_id as string)
    : null

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 48px' }}>
      {/* A way back. This page is reached from Home, the passport and DiGi, so
          the exit has to match where the parent actually came from. Shared with
          the other four passport destinations rather than written out five
          times, which is how four of them ended up without one. */}
      <BackTo from={from} />

      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Device Safety Hub</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
          Set up every device the right way
        </h1>
        <p style={{ color: 'var(--ink)', fontSize: 'var(--text-md)' }}>
          Step by step guides for every device{child?.name && child.name !== 'Your child' ? ` ${child.name} uses` : ' your family uses'}, matched to age.
        </p>
      </div>

      {stageNote && (
        <div style={{ background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
            {stage.label}
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px' }}>
            {stageNote.desc_text}
          </p>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', borderLeft: '3px solid var(--terracotta)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              What the research says at this age
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6 }}>
              {stageNote.science}
            </p>
          </div>
        </div>
      )}

      <DeviceSweepCard />

      {/* One list of screens, each carrying its own guide and its own status,
          then the layers the list cannot show, then the catalogue folded away.
          The old shape put the family's own devices and our whole catalogue
          side by side as two lists, which is the confusion Justin reported. */}
      <DeviceHub
        devices={devices}
        childAge={childAge}
        childName={child?.name ?? null}
        initialCompleted={completedKeys}
        initialNotOwned={notOwnedKeys}
        initialDoneDevices={doneDeviceIds}
      />
    </div>
  )
}
