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
import { getSuggestions, type Suggestion } from '@/lib/alerts/suggestions'
import StreakFlame from '@/components/daily/StreakFlame'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'
import SchoolPromoCard from '@/components/school/SchoolPromoCard'
import QuestBoard from '@/components/quests/QuestBoard'
import SetupPath, { STEPS as SETUP_STEPS } from '@/components/setup/SetupPath'
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

  const [childResult, dailySessionResult, todayMomentsResult, lastFeedbackResult, schoolActionsResult, schoolConnectionResult, agreementResult, questsCountResult, pushSubResult, anySessionResult, anySchoolActionResult] = await Promise.all([
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
  ])

  const child = childResult.data
  const dailyDone = !!dailySessionResult.data?.completed_at
  const lastFeedback = lastFeedbackResult.data
  const schoolActions: SchoolAction[] = schoolActionsResult.data ?? []
  const hasSchoolConnection = !!schoolConnectionResult.data
  const setupFlags = {
    agreement: !!agreementResult.data,
    quests: (questsCountResult.count ?? 0) > 0,
    school: hasSchoolConnection || !!anySchoolActionResult.data,
    push: !!pushSubResult.data,
    daily: !!anySessionResult.data,
  }

  // One conductor, one ask at a time. SetupPath sequences the setup steps
  // in order, and the standalone prompts below only appear when it is their
  // turn, so a new parent never faces a wall of five asks at once. When
  // setup is finished, the supplementary cards return to normal.
  const currentSetupStep = SETUP_STEPS.find(s => !setupFlags[s.key])?.key ?? null
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
  const isPaid = hasFullAccess(profile)
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  // Today's loop and the daily streak, both resolved server side.
  // stage.name lowercased matches the pathway stage slugs exactly
  // (foundation/builder/explorer/shaper/independent), same rule the
  // daily deck relies on.
  const stageSlug = stage.name.toLowerCase() as PathwayStageId
  const challenge = ((profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null) as ChallengeId | null
  const [streak, todayLoop, suggestions] = await Promise.all([
    getDailyStreak(supabase, user.id),
    getTodayLoop(supabase, user.id, stageSlug, challenge),
    child?.stage_id
      ? getSuggestions(supabase, user.id, { childName: child.name, childId: child.id, stageId: stageSlug, ukHour })
      : Promise.resolve([] as Suggestion[]),
  ])

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
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1, marginBottom: '6px' }}>
            {(child?.name && child.name !== 'Your child') ? child.name : firstName}
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

      {/* The setup path is the single conductor. It shows one step at a
          time, the rest waiting as quiet chips. The old bottom nudge that
          re-asked the same step on a second surface is gone, one ask only. */}
      <SetupPath flags={setupFlags} />
      <SetupUnlockToast flags={setupFlags} />

      {/* Smart alerts: the one proactive layer, the ranked things this
          family could do now, two at a time, calm and dismissable. */}
      <SmartAlerts suggestions={suggestions} />

      {/* Today's path: the day's loop as five nodes, DiGi on the next step */}
      <TodayPathStrip tasks={todayLoop} />

      {/* Family quests: prominent, every child at a glance, tickable here */}
      <QuestBoard />

      {/* Continue Your Progress — primary hero card */}
      <Link href="/dashboard/daily" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        <div style={{
          background: stageColor.bg,
          borderRadius: '20px',
          overflow: 'hidden',
          border: `1.5px solid ${stageColor.border}`,
          boxShadow: '0 4px 24px rgba(26,26,46,0.08)',
        }}>
          {/* Stage color bold accent strip */}
          <div style={{ background: stageColor.text, height: '5px' }} />
          <div style={{ padding: '22px 22px 20px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--ink-muted)', marginBottom: '10px',
            }}>
              {dailyDone ? 'Completed today' : 'Continue your progress'}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(1.2rem, 4vw, 1.55rem)', color: 'var(--ink)',
              letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '18px',
            }}>
              {dailyDone
                ? "Today's practice done"
                : `Today's practice${(child?.name && child.name !== 'Your child') ? ` for ${child.name}` : ''}`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                {dailyDone ? 'Come back tomorrow' : '5 cards · 2 minutes'}
              </div>
              <div style={{
                background: dailyDone ? 'var(--border)' : 'var(--terracotta)',
                color: dailyDone ? 'var(--ink-muted)' : '#fff',
                borderRadius: '16px', padding: '10px 20px',
                fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
                boxShadow: dailyDone ? 'none' : '0 3px 0 var(--terracotta-dark)',
              }}>
                {dailyDone ? 'Done ✓' : 'Continue →'}
              </div>
            </div>
          </div>
        </div>
      </Link>

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

      {/* Push notification opt-in: only when it is this step's turn, or once
          it is on (so the granted state and Send a test stay available). */}
      {(setupFlags.push || currentSetupStep === 'push') && (
        <div style={{ marginBottom: '20px' }}>
          <PushPrompt userId={user.id} stage={`Stage ${stage.id}`} />
        </div>
      )}

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

      {/* Pathway discovery: Pathway left the mobile tab bar for the Right Now button, this card is its home on mobile */}
      <Link href="/dashboard/pathway" style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
        <div style={{
          background: 'var(--tint-blue)', border: '1.5px solid var(--tint-blue)',
          borderRadius: '16px', padding: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              Your journey
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', marginBottom: '3px' }}>
              See your pathway
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              Every step from first device to independence, mapped to your child&apos;s stage.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

      {/* Lessons discovery: the one place every lesson lives, screen
          habits, safety, wellbeing and AI literacy together */}
      <Link href="/dashboard/lessons" style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
        <div style={{
          background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)',
          borderRadius: '16px', padding: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              Lessons
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', marginBottom: '3px' }}>
              Learn it together
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              Screen habits, safety, wellbeing and AI literacy. Calm lessons for every age.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

      {/* Family agreement discovery */}
      <Link href="/dashboard/agreement" style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
        <div style={{
          background: 'var(--stage-1)', border: '1.5px solid var(--stage-1)',
          borderRadius: '16px', padding: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              Made together
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', marginBottom: '3px' }}>
              Build your family agreement
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              Five conversations, one signed agreement, printed for the fridge.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

      {/* Digital Health Check discovery */}
      <Link href="https://www.guidedchildhood.com/digitalwellbeing" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        <div style={{
          background: 'var(--stage-2)', border: '1.5px solid var(--stage-2)',
          borderRadius: '16px', padding: '18px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              Under 10 minutes, no login
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              Get your child&apos;s Digital Health Report
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '4px' }}>
              Your membership includes one free report. Your code arrives by email.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

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
