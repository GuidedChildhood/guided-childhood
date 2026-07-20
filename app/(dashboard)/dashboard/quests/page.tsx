import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QuestManager from './QuestManager'
import QuestBoard from '@/components/quests/QuestBoard'
import ParentDeviceTime from '@/components/quests/ParentDeviceTime'
import SpotSomethingGood from '@/components/quests/SpotSomethingGood'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'

// Family Quests: the whole deal on one page now. The board leads (it moved
// here from Home when the daily screen narrowed): the approve queue, every
// child's day at a glance, the goal bars and the tick anything list. Then
// the manager: set the quests, the stars, the goal, send the kid their link
// or print the sheet. Sending a lesson to the child moved to the Lessons tab
// (its one home now), so this page points there rather than duplicating it.

export default async function QuestsPage() {
  // The handover moment: a child in the 8 to 10 band or older can run their
  // own side of the quests. While no kid link exists for them, one warm
  // prompt at the top points at the QR handover, then it steps back for good.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let handoverName: string | null = null
  let spotKids: { id: string; name: string }[] = []
  // The deal, tuned to their age: what a good weekday on this board can earn
  // each child, held against the healthy daily guide for their age, so the
  // star economy lands the screen time roughly where the evidence points.
  let tuning: { name: string; earnMins: number; guideMins: number; tone: 'tuned' | 'light' | 'rich' }[] = []
  if (user) {
    const [{ data: kids }, { data: links }, { data: quests }] = await Promise.all([
      supabase.from('children').select('id, name, age_band, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
      supabase.from('kid_links').select('child_id').eq('user_id', user.id),
      supabase.from('family_quests').select('stars, schedule, child_id').eq('user_id', user.id).eq('active', true),
    ])
    const linked = new Set((links ?? []).map(l => l.child_id))
    const ready = (kids ?? []).find(k =>
      k.age_band && k.age_band !== '4-7' && !linked.has(k.id) && k.name && k.name !== 'Your child'
    )
    handoverName = ready?.name ?? null
    spotKids = (kids ?? []).filter(k => k.name && k.name !== 'Your child').map(k => ({ id: k.id, name: k.name }))

    tuning = (kids ?? [])
      .filter(k => k.name && k.name !== 'Your child')
      .map(k => {
        const dayStars = (quests ?? [])
          .filter(q => (q.child_id === null || q.child_id === k.id) && (q.schedule === 'daily' || q.schedule === 'weekdays'))
          .reduce((s, q) => s + (Number(q.stars) || 1), 0)
        const earnMins = dayStars * STAR_MINUTES
        const guideMins = recommendedDailyMinutes(k.age_band ?? null)
        const ratio = guideMins > 0 ? earnMins / guideMins : 1
        return {
          name: k.name as string, earnMins, guideMins,
          tone: (ratio < 0.8 ? 'light' : ratio > 1.4 ? 'rich' : 'tuned') as 'tuned' | 'light' | 'rich',
        }
      })
      .filter(t => t.guideMins > 0)
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

      {/* The board leads, moved here from Home when the daily screen
          narrowed. The id is the anchor the approve links land on. */}
      <div id="quest-board" style={{ scrollMarginTop: '80px' }}>
        <QuestBoard />
      </div>

      {/* The in the moment star: seen kindness or a job done unasked, reward
          it right here and the reason pings the child's own app. */}
      <SpotSomethingGood kids={spotKids} />

      {/* The deal, tuned to their age: a good day's jobs should earn roughly
          the healthy screen amount for the child's age, so the economy lands
          the balance where the evidence points. This names the numbers and
          the one adjustment when the board runs light or rich. */}
      {tuning.length > 0 && (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '15px 17px', marginTop: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px' }}>
            The deal, tuned to their age
          </div>
          {tuning.map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>{t.name}:</span>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                a good weekday earns about <strong style={{ color: 'var(--ink)' }}>{t.earnMins} min</strong> · the healthy guide for their age is <strong style={{ color: 'var(--ink)' }}>{t.guideMins} min</strong> ·{' '}
                {t.tone === 'tuned' && <span style={{ color: '#1F7A54', fontWeight: 700 }}>nicely tuned</span>}
                {t.tone === 'light' && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>runs light, a job or two more lets them earn the full healthy amount</span>}
                {t.tone === 'rich' && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>a rich board, they can bank the extra for weekend treats</span>}
              </span>
            </div>
          ))}
          <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
            1 star is {STAR_MINUTES} minutes. Chest, quiz and bonus stars sit on top, so a brilliant day can always beat the guide a little.
          </p>
        </div>
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
