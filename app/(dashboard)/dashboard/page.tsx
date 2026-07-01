import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, type AgeBand, STAGES } from '@/lib/content/stages'
import type { Moment } from '@/components/cards/MomentCard'
import MomentCard from '@/components/cards/MomentCard'
import PushPrompt from '@/components/push/PushPrompt'
import DeviceSetupBanner from '@/components/device/DeviceSetupBanner'

const STAGE_COLORS = {
  1: { bg: 'var(--stage-1)', text: 'var(--ink)', border: 'var(--stage-1)' },
  2: { bg: 'var(--stage-2)', text: 'var(--ink)', border: 'var(--stage-2)' },
  3: { bg: 'var(--stage-3)', text: 'var(--ink)', border: 'var(--stage-3)' },
  4: { bg: 'var(--stage-4)', text: 'var(--ink)', border: 'var(--stage-4)' },
  5: { bg: 'var(--stage-5)', text: 'var(--ink)', border: 'var(--stage-5)' },
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
    .select('full_name, onboarding_complete, subscription_status')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  const today = new Date().toISOString().split('T')[0]

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [childResult, dailySessionResult, todayMomentsResult, lastFeedbackResult] = await Promise.all([
    supabase.from('children').select('name, age_band, stage_id, streak_weeks, actions_this_week').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
    supabase.from('daily_moments').select('id, title, category, age_bands, icon, science_brief, digi_opener').eq('active', true).order('sort_order').limit(20),
    supabase.from('digi_feedback').select('feedback_date, question, parent_response, digi_insight').eq('user_id', user.id).not('parent_response', 'is', null).gte('feedback_date', sevenDaysAgo).order('feedback_date', { ascending: false }).limit(1).maybeSingle(),
  ])

  const child = childResult.data
  const dailyDone = !!dailySessionResult.data?.completed_at
  const lastFeedback = lastFeedbackResult.data

  const allMoments: Moment[] = todayMomentsResult.data ?? []
  const todayMoments = child?.age_band
    ? allMoments.filter(m => m.age_bands.length === 0 || m.age_bands.includes(child.age_band as AgeBand)).slice(0, 3)
    : allMoments.slice(0, 3)

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[0]

  const stageColor = STAGE_COLORS[stage.id as keyof typeof STAGE_COLORS]
  const isPaid = profile?.subscription_status === 'active'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

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

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
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
              background: stageColor.text, color: stageColor.bg,
              padding: '3px 10px', borderRadius: '100px',
            }}>
              Stage {stage.id} · {stage.name}
            </span>
            {stage.isCritical && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'var(--terracotta)', color: '#fff',
                padding: '3px 8px', borderRadius: '100px',
              }}>
                Critical window
              </span>
            )}
          </div>
        </div>
        {(child?.streak_weeks ?? 0) > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
            background: 'var(--cream)', border: '1.5px solid var(--border)',
            borderRadius: '100px', padding: '8px 14px',
          }}>
            <span style={{ fontSize: '18px' }}>🔥</span>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{child?.streak_weeks}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>weeks</div>
            </div>
          </div>
        )}
      </div>

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

      {/* DiGi check-in — surfaces last reflective answer if the parent responded */}
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

      {/* Push notification opt-in */}
      <div style={{ marginBottom: '20px' }}>
        <PushPrompt userId={user.id} stage={`Stage ${stage.id}`} />
      </div>

      {/* Device setup prompt */}
      <DeviceSetupBanner
        stageId={stage.id}
        stageName={stage.name}
        childName={child?.name ?? null}
      />

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
            gridTemplateColumns: 'repeat(3, 1fr)',
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

      {/* This week's actions */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '16px' }}>
          This week's actions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {WEEKLY_ACTIONS.map((action, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '24px',
                height: '24px',
                border: '2px solid var(--border)',
                borderRadius: '6px',
                flexShrink: 0,
                marginTop: '1px',
                background: 'var(--cream)',
              }} />
              <span style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{action}</span>
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
              : 'The weekly check-in, same day same time, is your relationship maintenance. It does not have to be about screens.'}
          </p>
          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', textDecoration: 'none', marginTop: '8px', display: 'block' }}>
            Ask DiGi →
          </Link>
        </div>
      </div>

      {/* AI module discovery */}
      <Link href="/dashboard/ai-module" style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
        <div style={{
          background: 'var(--stage-3)', border: '1.5px solid var(--stage-3)',
          borderRadius: '16px', padding: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              New · AI literacy
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', marginBottom: '3px' }}>
              Understand AI together
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              Deepfakes, chatbots, and using it well. Calm lessons for every age.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

      {/* Digital Health Check discovery */}
      <Link href="https://wellbeing.guidedchildhood.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
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
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

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
          <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate — 50 places</p>
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
      'My child wants to play games online — is that safe?',
      'What does a good screen time routine look like at this age?',
    ],
    3: [
      'Her mood drops after Instagram — what do I say tonight?',
      'My son wants TikTok — how do I handle this?',
      'How do I have the algorithm conversation?',
    ],
    4: [
      'He is secretive about his phone — how do I approach this?',
      'She found something upsetting online — what do I do?',
      'How do I keep the conversation open without being controlling?',
    ],
    5: [
      'How do I talk about deepfakes and AI content?',
      'She defines her worth by her follower count — how do I help?',
      'What does genuine digital independence look like at 16?',
    ],
  }
  return prompts[stageId] ?? prompts[3]
}
