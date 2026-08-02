import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QuestManager from './QuestManager'
import QuestBoard from '@/components/quests/QuestBoard'
import NoPhoneButton from '@/components/quests/NoPhoneButton'
import SpotSomethingGood from '@/components/quests/SpotSomethingGood'
import PrintablesToConfirm from '@/components/quests/PrintablesToConfirm'
import QuestShortcuts from '@/components/quests/QuestShortcuts'
import StreakRewards, { type StreakReward } from '@/components/quests/StreakRewards'
import QuestStatusBoard from '@/components/quests/QuestStatusBoard'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { getFamilyRegion } from '@/lib/learning/region'
import { getBoardStatus, type BoardStatus } from '@/lib/quests/board-status'

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
  let handoverId: string | null = null
  let spotKids: { id: string; name: string }[] = []
  // The deal, tuned to their age: what a good weekday on this board can earn
  // each child, held against the healthy daily guide for their age, so the
  // star economy lands the screen time roughly where the evidence points.
  let tuning: { name: string; earnMins: number; guideMins: number; tone: 'tuned' | 'light' | 'rich' }[] = []
  // Completed jobs streaks waiting for the parent to send a reward.
  let streakRewards: StreakReward[] = []
  // What is actually waiting, so the tiles at the top can say so rather than
  // being eight labels a parent has to scroll past to find out.
  let boardStatus: BoardStatus | undefined
  if (user) {
    boardStatus = await getBoardStatus(supabase, user.id)
    const [{ data: kids }, { data: links }, { data: quests }] = await Promise.all([
      supabase.from('children').select('id, name, age_band, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
      supabase.from('kid_links').select('child_id').eq('user_id', user.id),
      supabase.from('family_quests').select('stars, schedule, child_id').eq('user_id', user.id).eq('active', true),
    ])
    const linked = new Set((links ?? []).map(l => l.child_id))
    // Children the parent has said have no phone stay parent managed and never
    // see the handover nudge. Read separately and fail soft, so a page load
    // before migration 105 lands never breaks on the missing column.
    const noPhone = new Set<string>()
    {
      const { data: np, error } = await supabase
        .from('children').select('id').eq('parent_id', user.id).eq('no_phone', true)
      if (!error) for (const r of np ?? []) noPhone.add(r.id as string)
    }
    // A child ready to run their own side: old enough, named, not yet linked,
    // and not one the parent has said has no phone.
    const ready = (kids ?? []).find(k =>
      k.age_band && k.age_band !== '4-7' && !linked.has(k.id) && !noPhone.has(k.id) && k.name && k.name !== 'Your child'
    )
    handoverName = ready?.name ?? null
    handoverId = ready?.id ?? null
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
    // The family's own school calendar, so the parent's guide and the child's
    // app cannot disagree about whether it is the holidays.
    const region = await getFamilyRegion(supabase, user.id)
    tuning = (kids ?? [])
      .filter(k => k.name && k.name !== 'Your child')
      .map(k => {
        const dayStars = (quests ?? [])
          .filter(q => (q.child_id === null || q.child_id === k.id) && (q.schedule === 'daily' || q.schedule === 'weekdays'))
          .reduce((s, q) => s + (Number(q.stars) || 1), 0)
        const earnMins = dayStars * STAR_MINUTES
        const guideMins = recommendedDailyMinutes(k.age_band ?? null, { region })
        return {
          name: k.name as string, earnMins, guideMins,
          tone: (earnMins <= guideMins ? 'tuned' : 'rich') as 'tuned' | 'light' | 'rich',
        }
      })
      .filter(t => t.guideMins > 0)
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      {/* The log a week card that used to sit here moved to the Printables page,
          under the star chart builder that makes the chart, so build, print and
          log the week live together. */}

      {handoverName && (
        <Link href="/dashboard/quests?tab=share" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '13px',
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '16px', padding: '14px 16px',
          }}>
            <span aria-hidden style={{
              width: 46, height: 46, borderRadius: '13px', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', flexShrink: 0,
            }}>📲</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
                {handoverName} can tick their own jobs now
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '2px', lineHeight: 1.45 }}>
                Share the QR code to hand them their side. Nothing to install.
              </span>
            </span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '12px', padding: '10px 15px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
              Share
            </span>
          </div>
        </Link>
      )}

      {/* If there will never be a phone, one tap says so and the nudge above is
          gone for good, the app committing to the fridge and parent managed way. */}
      {handoverName && handoverId && (
        <NoPhoneButton childId={handoverId} childName={handoverName} />
      )}

      {/* Where every job is, before anything asks the parent to act. The states
          were already in the data and already correct, they were just spread
          across three cards further down, so a parent could not tell whether a
          job had landed. This is the one picture. */}
      <QuestStatusBoard />

      {/* A five day jobs streak, done and confirmed on time, waiting on the
          parent to send its reward. Leads the page when there is one. */}
      <StreakRewards streaks={streakRewards} />

      {/* Then the jobs waiting on a yes. The page runs in the order a parent
          actually works: answer the timer request, agree what is done, then set
          what comes next. The id is the anchor the approve links land on. */}
      <div id="quest-board" style={{ scrollMarginTop: '80px' }}>
        <QuestBoard />
      </div>

      {/* Screen time is not on this page at all now.

          Making it small and moving it down was not enough. Justin, 31 July:
          the timer "should be one of those tabs, not taking up quest main page
          space". He is right, and the tile grid below is where the page keeps
          the things you go TO. Screen time already had a page of its own at
          /dashboard/quests/timer and no tile pointing at it, which is why a
          card kept having to sit on this page to make it reachable at all.

          It has a tile now, and the tile carries the live state: a child asking
          for time, or a timer running. That is the only part of screen time
          this page ever genuinely needed to say out loud, and a badge says it
          in a line rather than in a screen and a half. */}

      {/* Printables the child finished at home, waiting on one tap to confirm
          and land the stars. */}
      <PrintablesToConfirm />

      {/* The four places a parent goes from here, as flat coloured tiles with
          real drawn icons.

          Below the daily loop, not above it. These are NAVIGATION, and a parent
          opening this page has usually come to answer something: a timer
          request, a job waiting on a yes, a printable to confirm. Putting the
          way out above the work meant the first thing on the page was always a
          set of places to go instead of the thing that was waiting, and a parent
          with something to approve had to scroll past four tiles to find it.

          The order now runs the way a parent actually works: answer what is
          waiting, then choose where to go next. When nothing is waiting the
          cards above collapse to almost nothing and the tiles are the first
          thing on the page anyway, which is the right answer for that day too. */}
      <QuestShortcuts status={boardStatus} />

      {/* The in the moment star: seen kindness or a job done unasked, reward
          it right here and the reason pings the child's own app. */}
      <SpotSomethingGood kids={spotKids} />

      {/* The deal, tuned to their age: a good day's jobs should earn roughly
          the healthy screen amount for the child's age, so the economy lands
          the balance where the evidence points. This names the numbers and
          the one adjustment when the board runs light or rich. */}
      {tuning.length > 0 && (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '15px 17px', marginTop: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px' }}>
            The deal, tuned to their age
          </div>
          {tuning.map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{t.name}:</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                a good weekday earns up to <strong style={{ color: 'var(--ink)' }}>{t.earnMins} min</strong> · the healthy ceiling for their age is <strong style={{ color: 'var(--ink)' }}>{t.guideMins} min</strong> ·{' '}
                {t.tone === 'tuned' && <span style={{ color: '#1F7A54', fontWeight: 700 }}>inside the guide, which is exactly right</span>}
                {t.tone === 'rich' && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>earns past the guide, the extras bank rather than stretch the day</span>}
              </span>
            </div>
          ))}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
            1 star is {STAR_MINUTES} minutes. The guide is a ceiling, not a target: a child who earns plenty and watches less is the balance working at its best.
          </p>
        </div>
      )}

      <div id="quest-manager" style={{ scrollMarginTop: '80px' }}>
        <QuestManager />
      </div>


      {/* The Lessons signpost that used to close this page is gone. It was a
          card explaining that lessons had moved elsewhere, sitting below the
          fold, duplicating the Lessons tile at the very top of this same page
          and a permanent bottom tab. The page both opened and closed on the
          same destination. */}
    </div>
  )
}
