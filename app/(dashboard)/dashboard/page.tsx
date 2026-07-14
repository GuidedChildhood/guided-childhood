import { createClient } from '@/lib/supabase/server'
import { hasFullAccess, inTrial, trialDaysLeft } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, type AgeBand, type ChallengeId, STAGES } from '@/lib/content/stages'
import type { Moment } from '@/components/cards/MomentCard'
import MomentCard from '@/components/cards/MomentCard'
import PushPrompt from '@/components/push/PushPrompt'
import DeviceSetupBanner from '@/components/device/DeviceSetupBanner'
import SmartAlerts from '@/components/alerts/SmartAlerts'
import DigiPrompts from '@/components/digi/DigiPrompts'
import { getSuggestions, type Suggestion } from '@/lib/alerts/suggestions'
import StreakFlame from '@/components/daily/StreakFlame'
import DigiStreakWidget from '@/components/digi/DigiStreakWidget'
import AddChildName from '@/components/dashboard/AddChildName'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'
import SchoolPromoCard from '@/components/school/SchoolPromoCard'
import QuestBoard from '@/components/quests/QuestBoard'
import WaitingOnYou from '@/components/quests/WaitingOnYou'
import SetupPath, { visibleSteps as visibleSetupSteps } from '@/components/setup/SetupPath'
import SocialMediaReadiness from '@/components/pathway/SocialMediaReadiness'
import SetupUnlockToast from '@/components/setup/SetupUnlockToast'
import TodayPathStrip from '@/components/daily/TodayPathStrip'
import { getDailyStreak } from '@/lib/pathway/streak'
import { getTodayLoop } from '@/lib/pathway/daily-tasks'
import type { StageId as PathwayStageId } from '@/lib/pathway/progress'

const STAGE_COLORS = {
  1: { bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)', border: 'var(--stage-1)' },
  2: { bg: 'var(--stage-2)', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)', border: 'var(--stage-2)' },
  3: { bg: 'var(--stage-3)', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)', border: 'var(--stage-3)' },
  4: { bg: 'var(--stage-4)', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)', border: 'var(--stage-4)' },
  5: { bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)', border: 'var(--stage-5)' },
} as const

const WEEKLY_ACTIONS = [
  'Have the bedroom rule conversation if it is not yet in place',
  'Ask your child one open question about their online week',
  'Check in on the wellbeing tracker this week',
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, onboarding_complete, subscription_status, trial_ends_at, onboarding_answers')
    .eq('id', user.id)
    .maybeSingle()

  // Only send to onboarding when we POSITIVELY know it is not done. If the
  // profile read comes back empty (a transient session or read hiccup),
  // rendering the dashboard is safe (everything below is null tolerant) and,
  // crucially, never bounces to onboarding, which onboarding then bounces
  // back, the continuous flashing loop. One side must not fight the other.
  if (profile && profile.onboarding_complete === false) redirect('/onboarding')

  const today = new Date().toISOString().split('T')[0]

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [childResult, dailySessionResult, todayMomentsResult, lastFeedbackResult, schoolActionsResult, schoolConnectionResult, agreementResult, questsCountResult, pushSubResult, anySessionResult, anySchoolActionResult, kidLinksResult, focusConcernResult] = await Promise.all([
    supabase.from('children').select('id, name, age_band, stage_id, streak_weeks, actions_this_week').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
    supabase.from('daily_moments').select('id, title, category, age_bands, icon, science_brief, digi_opener').eq('active', true).order('sort_order').limit(20),
    supabase.from('digi_feedback').select('feedback_date, question, parent_response, digi_insight').eq('user_id', user.id).not('parent_response', 'is', null).gte('feedback_date', sevenDaysAgo).order('feedback_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('school_actions').select('id, kind, title, detail, due_date, sent_to_child, recurs_weekday, auto_send_to_child').eq('user_id', user.id).eq('status', 'open').order('due_date', { ascending: true, nullsFirst: false }).limit(20),
    supabase.from('school_connections').select('id').eq('user_id', user.id).eq('active', true).maybeSingle(),
    supabase.from('family_agreements').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('active', true),
    supabase.from('push_subscriptions').select('endpoint').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('daily_sessions').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    // Any school action ever added, connected inbox or typed by hand, done
    // or dismissed or still open: either path is the setup step complete,
    // and once complete it should stay complete, not flip back off the
    // moment the open list empties out.
    supabase.from('school_actions').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    // Whether any child already has their own phone link (the kid companion
    // link). Keyed by user, matched to the primary child below.
    supabase.from('kid_links').select('child_id').eq('user_id', user.id),
    // The problem this family is working on right now: the most recently
    // flagged live concern, for the focus bar above the path.
    supabase.from('concerns').select('label, status').eq('user_id', user.id).in('status', ['open', 'improving']).order('last_flagged_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const child = childResult.data
  const dailyDone = !!dailySessionResult.data?.completed_at
  const lastFeedback = lastFeedbackResult.data
  const schoolActions: SchoolAction[] = schoolActionsResult.data ?? []
  const hasSchoolConnection = !!schoolConnectionResult.data
  // The child phone link step only belongs once a child is old enough to
  // have a phone. We record around 9 as the point that starts, so any band
  // above Foundation (4 to 7) shows it. If the parent set an even younger
  // child, the step simply waits until they move up.
  const phoneAge = !!childResult.data?.age_band && childResult.data.age_band !== '4-7'
  const hasKidLink = (kidLinksResult.data ?? []).some(k => k.child_id === childResult.data?.id)
  const setupFlags = {
    agreement: !!agreementResult.data,
    quests: (questsCountResult.count ?? 0) > 0,
    school: hasSchoolConnection || !!anySchoolActionResult.data,
    push: !!pushSubResult.data,
    daily: !!anySessionResult.data,
    childLink: hasKidLink,
  }

  // One conductor, one ask at a time. SetupPath sequences the setup steps
  // in order, and the standalone prompts below only appear when it is their
  // turn, so a new parent never faces a wall of asks at once. When setup is
  // finished, the supplementary cards return to normal. visibleSetupSteps
  // drops the phone link step for children too young to have a phone, so it
  // never blocks completion for a Foundation age family.
  const setupSteps = visibleSetupSteps(phoneAge)
  const currentSetupStep = setupSteps.find(s => !setupFlags[s.key])?.key ?? null
  const setupComplete = currentSetupStep === null

  // Most applicable first: filter to the child's age, then lead with the
  // categories most likely happening at this hour (UK time), so the grid
  // greets the parent with their probable right now.
  const ukHour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }))
  const slotOrder: string[] =
    ukHour < 12 ? ['Morning', 'Transitions', 'Digital', 'School', 'Food', 'Emotions', 'Evening']
    : ukHour < 15 ? ['School', 'Food', 'Digital', 'Transitions', 'Emotions', 'Morning', 'Evening']
    : ukHour < 18 ? ['Transitions', 'Digital', 'Food', 'School', 'Emotions', 'Evening', 'Morning']
    : ['Evening', 'Digital', 'Emotions', 'Food', 'Transitions', 'School', 'Morning']
  const slotRank = (m: Moment) => {
    const i = slotOrder.indexOf(m.category)
    return i === -1 ? slotOrder.length : i
  }
  const allMoments: Moment[] = todayMomentsResult.data ?? []
  const ageMoments = child?.age_band
    ? allMoments.filter(m => m.age_bands.length === 0 || m.age_bands.includes(child.age_band as AgeBand))
    : allMoments
  const todayMoments = [...ageMoments].sort((a, b) => slotRank(a) - slotRank(b)).slice(0, 5)

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[0]

  const stageColor = STAGE_COLORS[stage.id as keyof typeof STAGE_COLORS]
  const isPaid = hasFullAccess(profile, user.email)
  // The parent's first name, resolved from the best source we have: the
  // profile, then the auth metadata set at signup, then the email local part,
  // so a warm greeting almost never falls back to the bare "there".
  const rawName =
    profile?.full_name
    || (user.user_metadata?.full_name as string | undefined)
    || (user.user_metadata?.name as string | undefined)
    || (user.email ? user.email.split('@')[0].replace(/[._-]+/g, ' ') : '')
  const firstNameRaw = (rawName ?? '').trim().split(' ')[0]
  const firstName = firstNameRaw
    ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)
    : 'there'

  // Today's loop and the daily streak, both resolved server side.
  // stage.name lowercased matches the pathway stage slugs exactly
  // (foundation/builder/explorer/shaper/independent), same rule the
  // daily deck relies on.
  const stageSlug = stage.name.toLowerCase() as PathwayStageId
  const challenge = ((profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null) as ChallengeId | null
  const [streak, todayLoop, suggestions, watchTogetherTotal, watchTogetherDone] = await Promise.all([
    getDailyStreak(supabase, user.id),
    getTodayLoop(supabase, user.id, stageSlug, challenge, isPaid),
    child?.stage_id
      ? getSuggestions(supabase, user.id, { childName: child.name, childId: child.id, stageId: stageSlug, ukHour })
      : Promise.resolve([] as Suggestion[]),
    // Watch together lessons: the co view videos, for the progress count
    // on the lessons card below (completions are the primary child's).
    supabase.from('parent_lessons').select('id', { count: 'exact', head: true }).eq('active', true),
    child
      ? supabase.from('parent_lesson_completions').select('id', { count: 'exact', head: true }).eq('child_id', child.id)
      : Promise.resolve({ count: 0 }),
  ])
  const watchTogether = {
    total: watchTogetherTotal.count ?? 0,
    done: Math.min(watchTogetherDone.count ?? 0, watchTogetherTotal.count ?? 0),
  }

  // Last completed script insight
  const { data: lastCompletion } = await supabase
    .from('script_completions')
    .select('script_sort_order, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  let lastInsight: { title: string; why_it_works: string; sort_order: number; category: string | null } | null = null
  if (lastCompletion) {
    const { data: lastScript } = await supabase
      .from('scripts')
      .select('title, why_it_works, sort_order, category')
      .eq('sort_order', lastCompletion.script_sort_order)
      .single()
    if (lastScript) lastInsight = lastScript
  }

  // Monthly wellbeing check in: due when it has never been done, or the last
  // one was more than 28 days ago. A gentle prompt, not a nag, and only once
  // the core setup is behind them so day one stays calm.
  const { data: lastCheckin } = await supabase
    .from('wellbeing_checkins')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const checkinDue = !lastCheckin
    || (Date.now() - new Date(lastCheckin.created_at).getTime()) > 28 * 24 * 60 * 60 * 1000

  const showTrial = inTrial(profile)
  const trialLeft = trialDaysLeft(profile)
  const trialEnded = !isPaid && Boolean(profile?.trial_ends_at) && !showTrial

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Trial status: warm and forgiving during, a gentle offer after, never
          a lockout. The everyday habit stays free either way. */}
      {showTrial && (
        <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '14px 18px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>
              ✨ Full access, {trialLeft} {trialLeft === 1 ? 'day' : 'days'} left
            </span>
            <Link href="/dashboard/upgrade" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none', letterSpacing: '0.04em' }}>
              See membership →
            </Link>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
            Everything is open while you settle in. Miss a day, no problem, just pick up where you left off. Five to ten minutes is all it takes, and we have got you the whole way to 16.
          </p>
        </div>
      )}
      {trialEnded && (
        <div style={{ background: 'var(--deep-teal)', borderRadius: '16px', padding: '16px 18px', marginBottom: '18px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: '#fff', marginBottom: '4px' }}>
            Your 7 days of full access have finished
          </div>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: '0 0 12px' }}>
            The daily habit, quests and your tracker stay free, always. To open everything again, all the scripts, unlimited DiGi and the full pathway, the founder rate is still open for you at £7.99 a month for life.
          </p>
          <Link href="/dashboard/upgrade" style={{ display: 'inline-flex', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '10px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            Unlock everything again
          </Link>
        </div>
      )}
      {/* Header — child name + stage + streak */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px', gap: '12px' }}>
        <div>
          {/* The tour promises "Step into Teo's pathway"; Home pays it off.
              A bare name read as a label, the possessive reads as a road
              that belongs to them. */}
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '6px' }}>
            {(child?.name && child.name !== 'Your child') ? `${child.name}'s pathway` : `Hello ${firstName}`}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: stageColor.bold, color: stageColor.text,
              padding: '3px 10px', borderRadius: '100px',
            }}>
              Stage {stage.id} · {stage.name}
            </span>
            {stage.isCritical && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'var(--terracotta)', color: 'var(--ink)',
                padding: '3px 8px', borderRadius: '100px',
              }}>
                Critical window
              </span>
            )}
          </div>
        </div>
        <StreakFlame count={streak.count} aliveToday={streak.aliveToday} />
      </div>

      {/* Waiting on you: the one clear next action at the top. A red count of
          the quests to approve and the ideas a child pitched, tapping down to
          the board where a parent acts on them. Silent when nothing waits. */}
      <WaitingOnYou />

      {/* The setup path is the single conductor. It shows one step at a
          time, the rest waiting as quiet chips. The old bottom nudge that
          re-asked the same step on a second surface is gone, one ask only. */}
      <SetupPath flags={setupFlags} phoneAge={phoneAge} />
      <SetupUnlockToast flags={setupFlags} />

      {/* The child's name was skipped at setup: one gentle ask, one tap to make
          the whole app personal. Dismissable, never nags. */}
      {(!child?.name || child.name === 'Your child') && <AddChildName />}

      {/* The problem first: the concern this family keeps flagging, named, with
          its arc and the one tap path to the words that fix it tonight. The
          whole platform framed the way the parent experiences it: my problem,
          the clear route to the solution. Falls back to the challenge they
          told us at signup, and stays silent when there is nothing live. */}
      {(() => {
        const focusConcern = focusConcernResult.data
        const challengeLabels: Record<string, string> = {
          morning_tv: 'Morning TV battles', controller_fights: 'Controller fights',
          wont_put_down: 'Will not put the device down', bedtime_screens: 'Bedtime screens',
          mood_after_screens: 'Mood after screens', something_else: '',
          screens_takeover: 'Screens are taking over', mood_changes: 'Mood changes after phone use',
          gaming: 'Gaming concerns', online_safety: 'Online safety worries',
          start_conversation: 'Starting the conversation', asking_for_phone: 'Asking for a phone',
        }
        const challengeKey = (profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? ''
        const label = focusConcern?.label ?? challengeLabels[challengeKey] ?? ''
        if (!label) return null
        const improving = focusConcern?.status === 'improving'
        const scriptHref = todayLoop.find(t => t.key === 'script')?.href ?? '/dashboard/scripts'
        return (
          <Link href={scriptHref} style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
              borderRadius: '14px', padding: '11px 14px',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', flexShrink: 0 }}>
                Your focus
              </span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label}
                <span style={{ fontWeight: 600, color: improving ? 'var(--stage-1-text)' : 'var(--ink-muted)' }}>
                  {' '}· {focusConcern ? (improving ? 'getting better' : 'working on it') : 'your starting focus'}
                </span>
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
                The words for tonight →
              </span>
            </div>
          </Link>
        )
      })()}

      {/* Today's Path: the hero of Home. The day's routine as one clear strip,
          DiGi sitting on the lit next step, so Home opens with a single thing to
          do rather than a wall of cards. */}
      <TodayPathStrip tasks={todayLoop} />

      {/* The streak card sits under the path: the reason to come back, below the
          thing to do now. */}
      <DigiStreakWidget count={streak.count} aliveToday={streak.aliveToday} firstName={firstName} />

      {/* DiGi jumps in: proactive prompts generated from this family's own
          data (mood and sleep trends, recurring concerns, wins) and the
          expert knowledge base, so DiGi speaks first when it spots something
          worth watching, always with a calm next step and never a diagnosis.
          Renders nothing when there is nothing to say. */}
      <DigiPrompts />

      {/* Smart alerts: the one proactive layer, the ranked things this
          family could do now, two at a time, calm and dismissable. */}
      <SmartAlerts suggestions={suggestions} />

      {/* Social media passport: from Stage 3 the readiness question goes live,
          and from 13 the training turns heavy as the cliff edge at 16 comes
          into view. Renders nothing below Stage 3, so the early years stay
          calm. This is the dashboard alert for the age that needs it. */}
      <SocialMediaReadiness stageId={stage.id} childName={child?.name} />

      {/* Family quests: prominent, every child at a glance, tickable here.
          The id is the anchor the Waiting on you banner scrolls to. */}
      <div id="quest-board" style={{ scrollMarginTop: '80px' }}>
        <QuestBoard />
      </div>

      {/* DiGi check in — surfaces last reflective answer if the parent responded */}
      {lastFeedback && (
        <div style={{
          background: 'var(--stage-5)',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          padding: '20px 22px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '9px',
              background: 'var(--terracotta)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 0 var(--terracotta-dark)',
            }}>
              <span style={{ fontSize: '.9rem', color: '#fff', lineHeight: 1 }}>◎</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>DiGi</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Following up from {lastFeedback.feedback_date === today ? 'earlier today' : 'yesterday'}</div>
            </div>
          </div>

          {lastFeedback.digi_insight ? (
            <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
              {lastFeedback.digi_insight}
            </p>
          ) : (
            <>
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                You answered: &ldquo;{lastFeedback.parent_response!.length > 120 ? lastFeedback.parent_response!.slice(0, 117) + '...' : lastFeedback.parent_response}&rdquo;
              </p>
              <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                {buildDigiFollowup(stage.id, child?.name ?? null)}
              </p>
            </>
          )}

          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', textDecoration: 'none', marginTop: '14px', display: 'inline-block' }}>
            Continue with DiGi →
          </Link>
        </div>
      )}

      {/* Push notification opt-in. Rendered whenever check ins are not yet on
          (so the enable button is always reachable, including when a parent
          taps the Turn on check ins step out of order), and kept once they are
          on so the granted state and Send a test stay available. The id is the
          anchor the step link scrolls to, which is what makes that button
          actually do something instead of a silent reload. */}
      <div id="turn-on-check-ins" style={{ marginBottom: '20px', scrollMarginTop: '80px' }}>
        <PushPrompt userId={user.id} stage={`Stage ${stage.id}`} />
      </div>

      {/* Device setup prompt: a supplementary ask, held back until the core
          setup path is done so it never competes with the current step. */}
      {setupComplete && (
        <DeviceSetupBanner
          stageId={stage.id}
          stageName={stage.name}
          childName={child?.name ?? null}
        />
      )}

      {/* Things you need to know: open school actions from forwarded school
          emails, or added by hand. The id is the anchor the setup path's
          school step points at, so Go lands right here, not on a separate
          page the parent then has to hunt through for the add form. */}
      <div id="school-actions">
        <SchoolActionsCard actions={schoolActions} childName={child?.name} />
      </div>

      {/* School email promo: only when school is the current setup step, or
          once the core setup is complete, so it waits its turn like the rest. */}
      {!hasSchoolConnection && (currentSetupStep === 'school' || setupComplete) && <SchoolPromoCard />}

      {/* Moment cards section */}
      {todayMoments.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Moment cards</p>
            <Link
              href="/dashboard/moments"
              style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--terracotta)', textDecoration: 'none', fontWeight: 500 }}
            >
              Browse all →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px',
          }}>
            {todayMoments.map(moment => (
              <MomentCard
                key={moment.id}
                moment={moment}
                childName={child?.name ?? undefined}
                ageBand={child?.age_band ?? undefined}
              />
            ))}
            {/* The grid always closes with quick help to every moment */}
            <Link href="/dashboard/moments" style={{ textDecoration: 'none' }}>
              <div style={{
                height: '100%', minHeight: '170px',
                background: 'var(--deep-teal)', borderRadius: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '10px', padding: '18px 14px', textAlign: 'center',
              }}>
                <span style={{
                  width: 56, height: 56, borderRadius: '16px', background: 'rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                }}>✨</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', lineHeight: 1.25 }}>
                  All moments
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
                  Quick help for any battle, any time of day
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Last script insight */}
      {lastInsight && (
        <div style={{
          background: 'var(--stage-2)',
          border: '1.5px solid var(--stage-2)',
          borderRadius: '16px',
          padding: '22px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              Last script insight
            </div>
            <Link
              href={`/dashboard/scripts/${lastInsight.sort_order}/deck`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', textDecoration: 'none', letterSpacing: '0.06em' }}
            >
              Read again →
            </Link>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '8px' }}>
            {lastInsight.title}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {lastInsight.why_it_works}
          </p>
        </div>
      )}

      {/* Everything below is the fuller home. It waits until setup is done,
          so a new parent gets a calm first screen, the conductor and today's
          practice, not a wall of explore me cards on day one. */}
      {setupComplete && (<>

      {/* Monthly wellbeing check in prompt: the mission made real, you in view
          not only your child. Shown when a check in is due. */}
      {checkinDue && (
        <Link href="/dashboard/checkin" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
          <div style={{
            background: 'var(--stage-4)', border: '1.5px solid var(--stage-4)',
            borderRadius: '16px', padding: '20px 22px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <span style={{
              width: 48, height: 48, borderRadius: '14px', background: 'var(--deep-teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
            }}>💛</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
                Monthly check in
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '2px' }}>
                A minute for you, {firstName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                How have you been this month? Not your child. You.
              </div>
            </div>
            <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
          </div>
        </Link>
      )}

      {/* This week's actions */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            This week's actions
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)' }}>
            {child?.actions_this_week ?? 0} done from daily practice
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {WEEKLY_ACTIONS.map((action, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--terracotta)',
                flexShrink: 0,
                marginTop: '7px',
              }} />
              <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>{action}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', padding: '14px 16px', background: 'var(--stage-5)', border: '1px solid var(--stage-5)', borderRadius: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi tip
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {stage.id <= 2
              ? 'The bedroom rule is the single most effective structural protection at this stage. If it is not in place, this is the week.'
              : stage.id === 3
              ? 'The algorithm conversation opens more than any rule will close. Curiosity, not alarm.'
              : 'The weekly check in, same day same time, is your relationship maintenance. It does not have to be about screens.'}
          </p>
          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', textDecoration: 'none', marginTop: '8px', display: 'block' }}>
            Ask DiGi →
          </Link>
        </div>
      </div>

      {/* Explore: everything else in the membership, folded into one calm grid
          of equal tiles. One tile a day carries the spotlight with a line of
          why, so a parent learns the whole membership over the weeks without
          ever facing a wall. Deterministic by date, no storage, no nagging. */}
      {(() => {
        const tiles = [
          { href: '/dashboard/pathway', external: false, bg: 'var(--tint-blue)', icon: '🗺️', title: 'Your pathway', sub: 'First device to independence', why: 'See the whole road mapped for your child, and exactly where you are on it.' },
          { href: '/dashboard/lessons', external: false, bg: 'var(--stage-3)', icon: '📚', title: 'Lessons', sub: 'Illustrated five minute lessons to watch together', why: 'Five minutes on the sofa together beats an hour of lecturing. Pick one tonight.' },
          { href: '/dashboard/moments', external: false, bg: 'var(--terracotta-lt)', icon: '⚡', title: 'Moments', sub: 'The words for any battle', why: 'Bedtime, the handover, the meltdown. Tap the moment and the words are there.' },
          { href: '/dashboard/agreement', external: false, bg: 'var(--stage-1)', icon: '🤝', title: 'Family agreement', sub: 'Five talks, one signed sheet', why: 'Rules they helped write are rules they keep. Print it for the fridge.' },
          { href: '/dashboard/printables', external: false, bg: 'var(--tint-sage)', icon: '🖨️', title: 'Printables', sub: 'The offline pathway', why: 'Print a bucket list, put the crayons out, and every finished sheet pays stars.' },
          { href: 'https://www.guidedchildhood.com/digitalwellbeing', external: true, bg: 'var(--stage-2)', icon: '🩺', title: 'Health report', sub: 'One free with membership', why: 'Ten minutes, and you get a clear picture of where things stand.' },
        ]
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
        const spot = dayOfYear % tiles.length
        return (
          <section style={{ marginBottom: '20px' }}>
            <p className="eyebrow" style={{ marginBottom: '12px', fontSize: 10 }}>Explore your membership</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {tiles.map((tile, i) => {
                const isSpot = i === spot
                return (
                  <Link
                    key={tile.href}
                    href={tile.href}
                    {...(tile.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{
                      textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '7px',
                      background: tile.bg,
                      border: isSpot ? '1.5px solid var(--terracotta)' : `1.5px solid ${tile.bg}`,
                      boxShadow: isSpot ? '0 0 0 3px var(--terracotta-lt)' : 'none',
                      borderRadius: '16px', padding: '16px',
                      gridColumn: isSpot ? '1 / -1' : 'auto',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '22px', lineHeight: 1 }}>{tile.icon}</span>
                      {isSpot && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '100px', padding: '3px 9px' }}>
                          Worth a look today
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.2 }}>{tile.title}</span>
                    <span style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{isSpot ? tile.why : tile.sub}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })()}

      </>)}

      {/* DiGi quick access */}
      <div style={{ background: 'var(--stage-5)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              DiGi
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '0' }}>
              Ask me anything about your child&apos;s digital world
            </h3>
          </div>
          {!isPaid && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
              3 / day free
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {getStagePrompts(stage.id).map((prompt, i) => (
            <Link
              key={i}
              href={`/dashboard/digi?q=${encodeURIComponent(prompt)}`}
              style={{
                display: 'block',
                padding: '10px 14px',
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'var(--ink-soft)',
                textDecoration: 'none',
                lineHeight: 1.4,
              }}
            >
              {prompt}
            </Link>
          ))}
        </div>

        <Link href="/dashboard/digi" className="btn btn-gold" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          Open DiGi
        </Link>
      </div>

      {/* Upgrade nudge for free users */}
      {!isPaid && (
        <div style={{ border: '2px solid var(--stage-5)', borderRadius: '16px', padding: '20px 22px', background: 'var(--stage-5)' }}>
          <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate, 50 places</p>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Unlock everything for £7.99 / month</h3>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            All 5 stages, unlimited DiGi, 100 plus scripts, the AI module, wellbeing tracker. First 50 members only.
          </p>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
            Claim founder rate
          </Link>
        </div>
      )}
    </div>
  )
}

function buildDigiFollowup(stageId: number, childName: string | null): string {
  const name = (childName && childName !== 'Your child') ? childName : 'your child'
  const messages: Record<number, string> = {
    1: `The pattern you described is very common at this stage. ${name.charAt(0).toUpperCase() + name.slice(1)} is not being difficult. Structure does the work that willpower cannot. One consistent boundary this week is worth more than five conversations.`,
    2: `What you noticed matters. At this stage the fix is almost always structural, not a new conversation. Think about the environment first: what needs to change before you say anything?`,
    3: `The mood signal you picked up on is real and it matters. Tracking it for one more week will give you a clearer picture before you say anything to ${name}. Curiosity before action.`,
    4: `Trust is the only currency at Stage 4. How you responded to what you noticed will shape whether ${name} comes to you with the next thing. Openness over interrogation.`,
    5: `At this stage you are building the relationship that outlasts the rules. What you noticed is worth holding lightly. One open question today is better than ten closed ones.`,
  }
  return messages[stageId] ?? messages[3]
}

function getStagePrompts(stageId: number): string[] {
  const prompts: Record<number, string[]> = {
    1: [
      'How do I manage screen time without constant battles?',
      'When should my child get their first device?',
      'How do I set up the bedroom rule?',
    ],
    2: [
      'How do I introduce the bedroom rule without a fight?',
      'My child wants to play games online, is that safe?',
      'What does a good screen time routine look like at this age?',
    ],
    3: [
      'Her mood drops after Instagram, what do I say tonight?',
      'My son wants TikTok, how do I handle this?',
      'How do I have the algorithm conversation?',
    ],
    4: [
      'He is secretive about his phone, how do I approach this?',
      'She found something upsetting online, what do I do?',
      'How do I keep the conversation open without being controlling?',
    ],
    5: [
      'How do I talk about deepfakes and AI content?',
      'She defines her worth by her follower count, how do I help?',
      'What does genuine digital independence look like at 16?',
    ],
  }
  return prompts[stageId] ?? prompts[3]
}
