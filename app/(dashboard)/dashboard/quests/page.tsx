import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QuestManager from './QuestManager'
import QuestBoard from '@/components/quests/QuestBoard'
import ParentDeviceTime from '@/components/quests/ParentDeviceTime'
import SpotSomethingGood from '@/components/quests/SpotSomethingGood'
import PrintablesToConfirm from '@/components/quests/PrintablesToConfirm'
import StreakRewards, { type StreakReward } from '@/components/quests/StreakRewards'
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
  // Completed jobs streaks waiting for the parent to send a reward.
  let streakRewards: StreakReward[] = []
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

    // Completed jobs streaks still waiting on a reward. Fails soft before
    // migration 096 (the table simply does not exist yet).
    const { data: streaks } = await supabase
      .from('job_streaks')
      .select('id, child_id, length')
      .eq('user_id', user.id)
      .is('reward_sent_at', null)
      .order('completed_on', { ascending: false })
    const nameById = new Map((kids ?? []).map(k => [k.id, k.name as string]))
    streakRewards = (streaks ?? []).map(s => ({
      id: s.id as string,
      childName: (nameById.get(s.child_id as string) || 'Your child'),
      streakDays: (s.length as number) ?? 5,
    }))

    // Under the guide is a win, never a gap: the healthy amount is a
    // ceiling, not a target, so the only verdicts are inside it (good) or
    // earning past it (worth knowing, the extras bank rather than extend
    // the day).
    tuning = (kids ?? [])
      .filter(k => k.name && k.name !== 'Your child')
      .map(k => {
        const dayStars = (quests ?? [])
          .filter(q => (q.child_id === null || q.child_id === k.id) && (q.schedule === 'daily' || q.schedule === 'weekdays'))
          .reduce((s, q) => s + (Number(q.stars) || 1), 0)
        const earnMins = dayStars * STAR_MINUTES
        const guideMins = recommendedDailyMinutes(k.age_band ?? null)
        return {
          name: k.name as string, earnMins, guideMins,
          tone: (earnMins <= guideMins ? 'tuned' : 'rich') as 'tuned' | 'light' | 'rich',
        }
      })
      .filter(t => t.guideMins > 0)
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      {/* The two things a parent comes here to do, each its own action card:
          an icon, what it is, and a line saying what happens, so the top of the
          page tells you where each tap goes. Manage jobs drops to the manager
          (set, agree and send in one place), Printables opens the library. */}
      <div style={{ display: 'flex', gap: '11px', marginBottom: '18px' }}>
        <a href="#quest-manager" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '11px', background: 'var(--gold)', color: 'var(--ink)', textDecoration: 'none', borderRadius: 18, padding: '14px 15px', boxShadow: '0 5px 0 var(--gold-dark)' }}>
          <span aria-hidden style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px', flexShrink: 0 }}>🧩</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1.15 }}>Manage jobs</span>
            <span style={{ display: 'block', fontSize: 12, color: 'rgba(26,26,46,0.66)', lineHeight: 1.3, marginTop: '2px' }}>Set, agree and send</span>
          </span>
        </a>
        <Link href="/dashboard/printables" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '11px', background: '#fff', color: 'var(--ink)', textDecoration: 'none', border: '1.5px solid var(--border)', borderRadius: 18, padding: '14px 15px', boxShadow: '0 3px 0 var(--border)' }}>
          <span aria-hidden style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gold-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px', flexShrink: 0 }}>🖨️</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1.15 }}>Printables</span>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.3, marginTop: '2px' }}>Charts to print</span>
          </span>
        </Link>
      </div>

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

      {/* A five day jobs streak, done and confirmed on time, waiting on the
          parent to send its reward. Leads the page when there is one. */}
      <StreakRewards streaks={streakRewards} />

      {/* The board leads, moved here from Home when the daily screen
          narrowed. The id is the anchor the approve links land on. */}
      <div id="quest-board" style={{ scrollMarginTop: '80px' }}>
        <QuestBoard />
      </div>

      {/* Printables the child finished at home, waiting on one tap to confirm
          and land the stars. */}
      <PrintablesToConfirm />

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
                a good weekday earns up to <strong style={{ color: 'var(--ink)' }}>{t.earnMins} min</strong> · the healthy ceiling for their age is <strong style={{ color: 'var(--ink)' }}>{t.guideMins} min</strong> ·{' '}
                {t.tone === 'tuned' && <span style={{ color: '#1F7A54', fontWeight: 700 }}>inside the guide, which is exactly right</span>}
                {t.tone === 'rich' && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>earns past the guide, the extras bank rather than stretch the day</span>}
              </span>
            </div>
          ))}
          <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
            1 star is {STAR_MINUTES} minutes. The guide is a ceiling, not a target: a child who earns plenty and watches less is the balance working at its best.
          </p>
        </div>
      )}

      <div id="quest-manager" style={{ scrollMarginTop: '80px' }}>
        <QuestManager />
      </div>

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
