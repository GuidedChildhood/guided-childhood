import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QuestManager from './QuestManager'
import ParentDeviceTime from '@/components/quests/ParentDeviceTime'

// Family Quests: the parent manager. Set the quests, the stars, the goal,
// send the kid their link or print the sheet. The deal lives here. Sending
// a lesson to the child moved to the Lessons tab (its one home now), so
// this page points there rather than duplicating it.

export default async function QuestsPage() {
  // The handover moment: a child in the 8 to 10 band or older can run their
  // own side of the quests. While no kid link exists for them, one warm
  // prompt at the top points at the QR handover, then it steps back for good.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let handoverName: string | null = null
  if (user) {
    const [{ data: kids }, { data: links }] = await Promise.all([
      supabase.from('children').select('id, name, age_band, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
      supabase.from('kid_links').select('child_id').eq('user_id', user.id),
    ])
    const linked = new Set((links ?? []).map(l => l.child_id))
    const ready = (kids ?? []).find(k =>
      k.age_band && k.age_band !== '4-7' && !linked.has(k.id) && k.name && k.name !== 'Your child'
    )
    handoverName = ready?.name ?? null
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      {handoverName && (
        <Link href="/dashboard/quests?tab=share" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '13px',
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '16px', padding: '14px 16px',
          }}>
            <span aria-hidden style={{
              width: 46, height: 46, borderRadius: '13px', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
            }}>📲</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.3 }}>
                {handoverName} can tick their own jobs now
              </span>
              <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '2px', lineHeight: 1.45 }}>
                Share the QR code to hand them their side. Nothing to install.
              </span>
            </span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '12px', padding: '10px 15px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
              Share
            </span>
          </div>
        </Link>
      )}

      <QuestManager />

      <ParentDeviceTime />

      <Link href="/dashboard/lessons" style={{ textDecoration: 'none', display: 'block', marginTop: '28px' }}>
        <div style={{
          background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)', borderRadius: '16px',
          padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              Looking for star lessons?
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              Send a lesson to their device
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '4px' }}>
              Lessons now live in one place. Open Lessons and tap Send to your child. It still lands as a quest.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>
    </div>
  )
}
