import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import BackTo from '@/components/nav/BackTo'
import QuestBoard from '@/components/quests/QuestBoard'
import NoPhoneButton from '@/components/quests/NoPhoneButton'
import ShareQrButton from '@/components/quests/ShareQrButton'
import SpotSomethingGood from '@/components/quests/SpotSomethingGood'
import PrintablesToConfirm from '@/components/quests/PrintablesToConfirm'
import QuestShortcuts from '@/components/quests/QuestShortcuts'
import StreakRewards, { type StreakReward } from '@/components/quests/StreakRewards'
import DealChangeAsks from '@/components/deal/DealChangeAsks'
import QuestStatusBoard from '@/components/quests/QuestStatusBoard'
import HappyIcon from '@/components/kid/HappyIcon'
import AgreementOffer from '@/components/quests/AgreementOffer'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { getFamilyRegion } from '@/lib/learning/region'
import { getBoardStatus, type BoardStatus } from '@/lib/quests/board-status'

// Family Quests: the day, and nothing else.
//
// Justin, 15 November 2026, with a screenshot of this page: "seems way too
// much, needs to look tidy, easy to use". Measured on a phone with a two child
// family it was 17 screens long with 124 things to tap, and three components
// each fetching the same board. The first screen and a half was the day. The
// other fifteen were the setup manager, most of which already had a page of
// its own (add a job, the timer, the deal, the printables).
//
// So the page keeps one job (THE-STORY, section 11) and runs in the order a
// parent works:
//
//   1. What is waiting on me, answered right there.
//   2. How each child is doing today.
//   3. Two actions: add a job, the screen timer.
//   4. Give a star.
//   5. One quiet list of the other places.
//   6. The guide for their age and the homework notes, folded.
//
// The manager moved whole to /dashboard/quests/setup. Nothing in it changed,
// so every call it makes to the child's app is the call it always made.
//
// What the research said about the shape (15 November, sources in the pull
// request): show first only what needs the parent every visit and put the
// rest one level down (Nielsen on progressive disclosure, guidance rather
// than a trial); keep the one red badge for the thing with a person waiting.
// And what it said to leave OFF this page: no guideline body gives a screen
// to outdoor ratio or a balance score, so the page shows none, and the age
// guide is worded as our steer, never as a limit.

// The two folds at the foot of the page. Reading, not doing, so they stay shut
// until a parent wants them, and they are quieter than the cards above: no
// ledge, because a ledge says press me and these are only there to be read.
const FOLD: React.CSSProperties = {
  background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
  padding: '4px 16px 12px', marginTop: '12px',
}
const FOLD_SUMMARY: React.CSSProperties = {
  cursor: 'pointer', padding: '11px 0',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
}

export default async function QuestsPage({ searchParams }: { searchParams: Promise<{ from?: string; tab?: string; add_child?: string }> }) {
  const { from: from_, tab, add_child } = await searchParams
  // Old doors into the manager, sent on to where it lives now. Emails, pushes
  // and DiGi's add a child offer all hold /dashboard/quests?tab=share or
  // ?add_child= and some of those are already in inboxes, so the address has
  // to keep working rather than every caller being chased. The manager reads
  // both params itself on the far side. A fixed list, never the raw query.
  if (tab === 'share' || tab === 'rewards' || tab === 'games' || tab === 'manage') redirect(`/dashboard/quests/setup?tab=${tab}`)
  if (add_child !== undefined) redirect('/dashboard/quests/setup?add_child=')
  // The handover moment: a child in the 8 to 10 band or older can run their
  // own side of the quests. While no kid link exists for them, one warm
  // prompt at the top points at the QR handover, then it steps back for good.
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  let handoverName: string | null = null
  let handoverId: string | null = null
  let spotKids: { id: string; name: string }[] = []
  // The deal, tuned to their age: what a good weekday on this board can earn
  // each child, held against the healthy daily guide for their age, so the
  // star economy lands the screen time roughly where the evidence points.
  let tuning: { id: string; name: string; earnMins: number; guideMins: number; dayLabel: string; tone: 'tuned' | 'light' | 'rich' | 'none' }[] = []
  // Completed jobs streaks waiting for the parent to send a reward.
  let streakRewards: StreakReward[] = []
  // What is actually waiting, so the tiles at the top can say so rather than
  // being eight labels a parent has to scroll past to find out.
  let boardStatus: BoardStatus | undefined
  let homeworkNotes: { childName: string; day: string; note: string }[] = []
  // The agreement offer, which took over from the setup step it used to be on
  // 18 August. Shown once a family has at least one job and nobody has signed
  // an agreement yet. See components/quests/AgreementOffer.tsx for why here.
  let offerAgreement = false
  let offerChildName: string | null = null
  if (user) {
    boardStatus = await getBoardStatus(supabase, user.id)
    const [{ data: kids }, { data: links }, { data: quests }] = await Promise.all([
      supabase.from('children').select('id, name, age_band, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
      supabase.from('kid_links').select('child_id').eq('user_id', user.id),
      supabase.from('family_quests').select('stars, schedule, schedule_days, child_id').eq('user_id', user.id).eq('active', true),
    ])
    // Both signatures, not the row. A draft agreement is written as clauses
    // are chosen, so a row exists long before anybody has agreed anything, and
    // reading the row as the deed is the same fault that put a green tick on
    // four unsigned agreements when this was a setup step.
    const { data: agreement } = await supabase
      .from('family_agreements').select('signed_by_parent, signed_by_child')
      .eq('user_id', user.id).limit(1).maybeSingle()
    const signed = !!agreement?.signed_by_parent && !!agreement?.signed_by_child
    offerAgreement = !signed && (quests ?? []).length > 0
    offerChildName = ((kids ?? [])[0]?.name as string | null) ?? null

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

    // Homework, in the child's own words.
    //
    // Justin: the note should be "saved somewhere as they wrote it, as we will
    // match it with what is required another time". It is saved either way, but
    // a note only a database can read is not a note a parent has. This is the
    // place it belongs: the page the completion notice already links to.
    //
    // VERBATIM. Never tidied, never summarised. The value is that it can be held
    // against what the school actually set, and the child's own wording is the
    // only record of what they understood the homework to be.
    //
    // Fails soft: before migration 147 the table is simply not there, and a page
    // that already works must not start 500ing over a panel that is a bonus.
    {
      const since = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)
      const { data: notes, error } = await supabase
        .from('kid_homework_notes')
        .select('child_id, day, note')
        .eq('user_id', user.id)
        .gte('day', since)
        .order('day', { ascending: false })
        .limit(20)
      if (!error) {
        const nameOf = new Map((kids ?? []).map(k => [k.id as string, k.name as string]))
        homeworkNotes = (notes ?? [])
          .filter(n => String(n.note ?? '').trim())
          .map(n => ({
            childName: nameOf.get(n.child_id as string) ?? 'Your child',
            day: String(n.day),
            note: String(n.note).trim(),
          }))
      }
    }

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
    // ── "0 MIN, WHICH IS EXACTLY RIGHT" ──────────────────────────────────────
    //
    // Justin, 14 August 2026, with a screenshot: both children reading "a good
    // weekday earns up to 0 min · the healthy ceiling for their age is 95 min ·
    // inside the guide, which is exactly right".
    //
    // TWO SEPARATE FAULTS, and checking the live database rather than reading
    // the code is what told them apart.
    //
    // ONE, the weekend board reads as an empty board. The only ACTIVE quest on
    // that account is "A whole screen free Saturday morning", 5 stars, schedule
    // 'weekend'. The filter counted 'daily' and 'weekdays' only, so a family
    // whose board is a weekend board earned a truthful zero to a question
    // nobody asked. The heading says weekday, so the arithmetic was right and
    // the sentence was still nonsense to the parent reading it. It now reports
    // whichever day the board is actually built around, and says which.
    //
    // TWO, and this is the multi child one. Every quest on that account belongs
    // to Teo. Olga has none at all, because adding a second child does not give
    // them a board, so her row was reporting the truth as well: no jobs. What
    // was wrong was calling it "exactly right". A child with nothing to do has
    // not achieved balance, and telling a parent otherwise hides the one thing
    // they need to act on. Nothing is the third verdict now, and it is the one
    // that leads to a fix rather than to a green tick.
    // A job set to certain days counts as a weekday job when any of those days
    // is one. Asking the schedule word alone read "Monday and Wednesday" as
    // neither daily nor weekdays, so the verdict quietly switched to scoring
    // the family's weekend instead of the week they actually named.
    const anyWeekday = (quests ?? []).some(q =>
      q.schedule === 'daily'
      || q.schedule === 'weekdays'
      || (Array.isArray(q.schedule_days) && q.schedule_days.some(d => d >= 1 && d <= 5)))
    const scope: ('daily' | 'weekdays')[] | ('daily' | 'weekend')[] = anyWeekday
      ? ['daily', 'weekdays']
      : ['daily', 'weekend']
    tuning = (kids ?? [])
      .filter(k => k.name && k.name !== 'Your child')
      .map(k => {
        const mine = (quests ?? []).filter(q => q.child_id === null || q.child_id === k.id)
        const dayStars = mine
          .filter(q => (scope as string[]).includes(q.schedule as string))
          .reduce((s, q) => s + (Number(q.stars) || 1), 0)
        const earnMins = dayStars * STAR_MINUTES
        const guideMins = recommendedDailyMinutes(k.age_band ?? null, { region })
        return {
          id: k.id as string,
          name: k.name as string, earnMins, guideMins,
          dayLabel: anyWeekday ? 'weekday' : 'weekend day',
          // A child with no board of their own at all. Named separately from
          // "light", because the fix is different: light means add a job, none
          // means this child was added and never set up.
          tone: (mine.length === 0 ? 'none' : earnMins <= guideMins ? 'tuned' : 'rich') as 'tuned' | 'light' | 'rich' | 'none',
        }
      })
      .filter(t => t.guideMins > 0)
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <BackTo from={from_} />

      {/* The agreement, offered rather than demanded. It left setup on 18
          August, where it blocked three one minute jobs with the only task in
          the product that needs the child in the room. It asks here instead,
          at the first moment a parent is actually setting a rule. */}
      {/* One ask at a time. While the handover prompt below is up, this waits:
          two cards asking for two different things above the board was half
          of what made the top of this page feel like a queue. */}
      {offerAgreement && !(handoverName && handoverId) && <AgreementOffer childName={offerChildName} />}
      {/* The log a week card that used to sit here moved to the Printables page,
          under the star chart builder that makes the chart, so build, print and
          log the week live together. */}

      {/* THE CARD THAT WENT NOWHERE.

          Justin, 13 August 2026: "the share to phone button not working in any
          place." This card was the reason, and it was not the domain and not
          the code. It was a Link to /dashboard/quests?tab=share, which is the
          page it is already on. QuestManager does read ?tab= but only in a
          mount effect, and Next does not remount a route for a query change,
          so the card navigated to itself and nothing happened. Even when the
          tab did switch, the share tab is roughly two thousand lines down the
          page with no scroll.

          The code opens right here now, through the same button every other
          surface uses. There is no navigation left in this path to fail. */}
      {handoverName && handoverId && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '16px',
          background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)',
          borderRadius: 'var(--radius-btn)', padding: '14px 16px',
        }}>
          <span aria-hidden style={{
            width: 46, height: 46, borderRadius: 'var(--radius-tile)', background: '#fff', border: 'var(--edge)', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><HappyIcon name="phonebed" size={30} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
              {handoverName} can tick their own jobs now
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '2px', lineHeight: 1.45 }}>
              Show them the QR code to hand them their side. Nothing to install.
            </span>
            <ShareQrButton
              childId={handoverId}
              childName={handoverName}
              label="Show the code"
              style={{ marginTop: '9px', fontSize: 'var(--text-base)', padding: '9px 15px', borderRadius: 'var(--radius-tile)', boxShadow: '0 4px 0 var(--terracotta-dark)' }}
            />
          </span>
        </div>
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

      {/* A child asking to change a promise in the deal, with their reason
          (migration 381). Waiting on a yes like everything below it, and silent
          when nothing is waiting. */}
      <DealChangeAsks />

      {/* Then the jobs waiting on a yes. The page runs in the order a parent
          actually works: answer the timer request, agree what is done, then set
          what comes next. The id is the anchor the approve links land on. */}
      <div id="quest-board" style={{ scrollMarginTop: '80px' }}>
        <QuestBoard foldQueue />
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
        <details style={FOLD}>
          <summary style={FOLD_SUMMARY}>Is the deal about right for their age?</summary>
          <div style={{ height: 10 }} />
          {tuning.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{t.name}:</span>
              {/* A child with no board of their own says so, and says what to
                  do about it. The old copy called nothing "exactly right",
                  which is the one reading a parent must not be given: it turns
                  the single thing they need to fix into a green tick. */}
              {t.tone === 'none' ? (
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>no jobs of their own yet</span>, so there is nothing here for them to earn.{' '}
                  <Link href={`/dashboard/quests/manage?child=${t.id}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                    Set up {t.name}&apos;s board
                  </Link>
                </span>
              ) : (
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  a good {t.dayLabel} earns up to <strong style={{ color: 'var(--ink)' }}>{t.earnMins} min</strong> · our guide for their age is about <strong style={{ color: 'var(--ink)' }}>{t.guideMins} min</strong> ·{' '}
                  {t.tone === 'tuned' && <span style={{ color: '#1F7A54', fontWeight: 700 }}>inside the guide, which is exactly right</span>}
                  {t.tone === 'rich' && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>earns past the guide, the extras bank rather than stretch the day</span>}
                </span>
              )}
            </div>
          ))}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
            1 star is {STAR_MINUTES} minutes. The guide is our steer, set under the published guidance, and it is a ceiling, not a target: a child who earns plenty and watches less is the balance working at its best.
          </p>
          {/* Planet Friends missions pay on the planet, never in stars, and
              every one has a printed twin (slice 2b). One line, one door. */}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
            🪐 Their Planet Friends missions pay on the planet, not in stars. Every mission has a sheet to print, and the Comet card hides a code made for your child:{' '}
            <Link href="/dashboard/printables" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>print the missions</Link>
          </p>
        </details>
      )}

      {/* What they wrote in the Homework step, exactly as they wrote it. */}
      {homeworkNotes.length > 0 && (
        <details style={FOLD}>
          <summary style={FOLD_SUMMARY}>Homework, in their words ({homeworkNotes.length})</summary>
          <div style={{ height: 10 }} />
          {homeworkNotes.map(n => (
            <div key={`${n.childName}-${n.day}`} style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', marginBottom: '2px' }}>
                {n.childName}
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-muted)' }}>
                  {' '}· {new Date(`${n.day}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                {n.note}
              </p>
            </div>
          ))}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '2px 0 0' }}>
            Kept word for word, so you can hold it against what school actually set.
          </p>
        </details>
      )}

      {/* The manager is not on this page any more. It is the first row of the
          list above, Stars, rewards and sharing, at /dashboard/quests/setup. */}
    </div>
  )
}
