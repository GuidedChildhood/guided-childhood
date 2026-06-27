import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, type AgeBand, STAGES } from '@/lib/content/stages'

const STAGE_COLORS = {
  1: { bg: 'var(--green-lt)', text: 'var(--green-dark)', border: 'var(--green)' },
  2: { bg: 'var(--lav)', text: 'var(--lav-deep)', border: '#b8c8f0' },
  3: { bg: 'var(--coral-lt)', text: 'var(--coral)', border: 'var(--coral)' },
  4: { bg: 'var(--gold-lt)', text: 'var(--gold-dark)', border: 'var(--gold)' },
  5: { bg: 'var(--warm)', text: 'var(--ink-soft)', border: 'var(--border)' },
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

  const [childResult, dailySessionResult] = await Promise.all([
    supabase.from('children').select('name, age_band, stage_id, streak_weeks, actions_this_week').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
  ])

  const child = childResult.data
  const dailyDone = !!dailySessionResult.data?.completed_at

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
      {/* Welcome */}
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Good to have you back</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0' }}>
          Hello, {firstName}
        </h1>
      </div>

      {/* Daily practice — primary CTA on every login */}
      <Link href="/dashboard/daily" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        <div style={{
          background: dailyDone ? 'var(--green-lt)' : 'var(--ink)',
          border: dailyDone ? '2px solid var(--green)' : 'none',
          borderRadius: '18px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: dailyDone ? 'var(--green-dark)' : 'var(--gold)',
              marginBottom: '5px',
            }}>
              {dailyDone ? 'Done today' : 'Daily practice'}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '17px', letterSpacing: '-0.01em',
              color: dailyDone ? 'var(--ink)' : '#fff',
            }}>
              {dailyDone ? 'Practice complete' : 'Start today\'s session'}
            </div>
            <div style={{
              fontSize: '13px', marginTop: '3px',
              color: dailyDone ? 'var(--green-dark)' : 'rgba(255,255,255,0.6)',
            }}>
              {dailyDone ? 'See you tomorrow' : '5 cards · 2 minutes · builds the habit'}
            </div>
          </div>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: dailyDone ? 'var(--green-dark)' : 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', flexShrink: 0,
          }}>
            {dailyDone ? '✓' : '▷'}
          </div>
        </div>
      </Link>

      {/* Stage card */}
      <div style={{
        background: stageColor.bg,
        border: `2px solid ${stageColor.border}`,
        borderRadius: '16px',
        padding: '22px',
        marginBottom: '20px',
        ...(stage.isCritical ? { borderLeftWidth: '5px' } : {}),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: stageColor.text,
            color: stageColor.bg,
            padding: '3px 10px',
            borderRadius: '100px',
          }}>
            Stage {stage.id} · {stage.name}
          </span>
          {stage.isCritical && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'var(--coral)',
              color: '#fff',
              padding: '3px 8px',
              borderRadius: '100px',
            }}>
              Critical Window
            </span>
          )}
        </div>

        {child?.name && child.name !== 'Your child' && (
          <div style={{ fontSize: '15px', color: 'var(--ink-muted)', marginBottom: '6px' }}>
            {child.name}
          </div>
        )}

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', marginBottom: '2px' }}>
          {stage.keyStage} · {stage.yearGroup}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '12px' }}>{stage.ages}</div>
        <div style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>{stage.focus}</div>

        {(child?.streak_weeks ?? 0) > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: stageColor.text }}>
              {child?.streak_weeks} week streak
            </span>
          </div>
        )}
      </div>

      {/* Last script insight */}
      {lastInsight && (
        <div style={{
          background: 'var(--green-lt)',
          border: '1.5px solid var(--green-b)',
          borderRadius: '16px',
          padding: '22px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-dark)' }}>
              Last script insight
            </div>
            <Link
              href={`/dashboard/scripts/${lastInsight.sort_order}/deck`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green-dark)', textDecoration: 'none', letterSpacing: '0.06em' }}
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
      <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
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

        <div style={{ marginTop: '16px', padding: '14px 16px', background: 'var(--gold-lt)', border: '1px solid var(--gold)', borderRadius: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-dark)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi tip
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {stage.id <= 2
              ? 'The bedroom rule is the single most effective structural protection at this stage. If it is not in place, this is the week.'
              : stage.id === 3
              ? 'The algorithm conversation opens more than any rule will close. Curiosity, not alarm.'
              : 'The weekly check-in, same day same time, is your relationship maintenance. It does not have to be about screens.'}
          </p>
          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-dark)', textDecoration: 'none', marginTop: '8px', display: 'block' }}>
            Ask DiGi →
          </Link>
        </div>
      </div>

      {/* DiGi quick access */}
      <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>
              DiGi
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0' }}>
              Ask me anything about your child's digital world
            </h3>
          </div>
          {!isPaid && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
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
        <div style={{ border: '2px solid var(--gold)', borderRadius: '16px', padding: '20px 22px', background: 'var(--gold-lt)' }}>
          <p className="eyebrow" style={{ color: 'var(--gold-dark)', marginBottom: '8px' }}>Founder rate — 50 places</p>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Unlock everything for £7.99 / month</h3>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            All 5 stages, unlimited DiGi, all 17 scripts, wellbeing tracker. First 50 members only.
          </p>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
            Claim founder rate
          </Link>
        </div>
      )}
    </div>
  )
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
