import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'
import PathwayJourney from '@/components/pathway/PathwayJourney'
import { getStageProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import { getJourney } from '@/lib/pathway/journey'

const STAGE_DISPLAY: Record<number, {
  displayName: string
  subtitle: string | null
  concepts: string[]
  color: string
  bg: string
  numColor: string
}> = {
  1: {
    displayName: 'Foundation',
    subtitle: null,
    concepts: ['Shared screen', 'Co viewing', 'No solo device', 'No feeds'],
    color: 'var(--terracotta)',
    bg: 'var(--stage-1)',
    numColor: 'var(--terracotta)',
  },
  2: {
    displayName: 'First Steps',
    subtitle: null,
    concepts: ['Restricted phone', 'Family contacts', 'Privacy basics', 'Algorithms'],
    color: 'var(--terracotta)',
    bg: 'var(--stage-2)',
    numColor: 'var(--terracotta)',
  },
  3: {
    displayName: 'Explorer',
    subtitle: 'Critical Window',
    concepts: ['Guided smartphone', 'No social media', 'Comparison', 'Orben research'],
    color: 'var(--terracotta)',
    bg: 'var(--stage-3)',
    numColor: 'var(--terracotta)',
  },
  4: {
    displayName: 'Navigator',
    subtitle: null,
    concepts: ['Monitored social', 'Reputation', 'Filter bubbles', 'Readiness'],
    color: 'var(--terracotta)',
    bg: 'var(--stage-4)',
    numColor: 'var(--terracotta)',
  },
  5: {
    displayName: 'Independent',
    subtitle: null,
    concepts: ['Trust-based', 'Full access', 'AI literacy', 'Vibe coding'],
    color: 'var(--terracotta)',
    bg: 'var(--stage-5)',
    numColor: 'var(--ink-muted)',
  },
}

type Child = { id: string; name: string; age_band: string | null; stage_id: string | null; is_primary: boolean; streak_weeks: number | null }

export default async function PathwayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('id, name, age_band, stage_id, is_primary, streak_weeks').eq('parent_id', user.id).order('is_primary', { ascending: false }),
  ])

  const isPaid = hasFullAccess(profileResult.data)
  const children = (childrenResult.data ?? []) as Child[]

  const stageIdToNum: Record<string, number> = {
    foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
  }

  const childStageNums = new Set(children.map(c => c.stage_id ? stageIdToNum[c.stage_id] ?? null : null).filter(Boolean))
  const primaryChild = children[0]
  const currentStageNum = primaryChild?.stage_id ? stageIdToNum[primaryChild.stage_id] ?? null : null

  const [currentStageProgress, journey] = primaryChild?.stage_id
    ? await Promise.all([
        getStageProgress(supabase, user.id, primaryChild.stage_id as ProgressStageId, primaryChild.streak_weeks ?? 0),
        getJourney(supabase, user.id, primaryChild.stage_id as ProgressStageId),
      ])
    : [null, null]

  const currentStageContent = currentStageNum ? STAGES.find(s => s.id === currentStageNum) : null

  return (
    <div style={{ padding: '24px 0 32px' }}>
      {/* Header */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto', marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Your journey</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>The pathway to 16</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px', lineHeight: 1.55 }}>
          The plan that turns 16 from a cliff edge into a gentle ramp. The settings relax as your child earns it, one stage at a time, all the way to independence. Your next step is always here.
        </p>
        {children.length > 1 && (
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginTop: '4px' }}>
            {children.length} children, one account.
          </p>
        )}
      </div>

      {/* The journey: one spine, three strands, the single next step */}
      {journey && currentStageContent && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 32px' }}>
          <PathwayJourney
            journey={journey}
            childName={primaryChild?.name ?? 'your child'}
            stageName={currentStageContent.name}
            stageAges={currentStageContent.ages}
          />
        </div>
      )}

      {/* DiGi help: the pathway is never a wall. When the next step is
          unclear, DiGi reads the moments this family has flagged and talks
          through the one that matters now. This is the moments and DiGi help
          thread, in one calm card, replacing the stacked journey views that
          made the page busy. */}
      {currentStageContent && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 28px' }}>
          <Link href="/dashboard/digi" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: 'var(--deep-teal)', borderRadius: '18px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'var(--terracotta)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                <span style={{ color: '#fff', fontSize: '1rem', lineHeight: 1 }}>◎</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: '#fff' }}>
                  Not sure of your next step?
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.45, marginTop: '2px' }}>
                  DiGi reads the moments you have flagged and talks you through the one that matters now.
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Stage cards — horizontal scroll on mobile, grid on desktop */}
      <div className="stage-scroll-container">
        <div className="stage-cards-row">
          {STAGES.map(stage => {
            const display = STAGE_DISPLAY[stage.id]
            const isMyStage = childStageNums.has(stage.id)
            const stageId = ['foundation', 'builder', 'explorer', 'shaper', 'independent'][stage.id - 1]
            const numLabel = String(stage.id).padStart(2, '0')

            return (
              <div
                key={stage.id}
                className="stage-card"
                style={{
                  background: display.bg,
                  border: isMyStage ? `2.5px solid ${display.color}` : '1.5px solid var(--border)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {isMyStage && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: display.color, color: 'var(--ink)',
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: '100px',
                  }}>
                    Your stage
                  </div>
                )}

                {stage.id === currentStageNum && currentStageProgress && (
                  <div style={{ padding: '16px 22px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: display.color }}>
                        Progress
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
                        {currentStageProgress.overallPct}%
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.6)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${currentStageProgress.overallPct}%`, height: '100%', background: display.color, borderRadius: '100px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}

                {/* Stage number — large */}
                <div style={{ padding: '22px 22px 0' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    fontSize: '48px', lineHeight: 1, letterSpacing: '-0.02em',
                    color: display.numColor, opacity: 0.4,
                    marginBottom: '6px',
                  }}>
                    {numLabel}
                  </div>

                  {/* Stage name */}
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: '21px', color: 'var(--ink)', letterSpacing: '-0.01em',
                    }}>
                      {display.displayName}
                    </span>
                    {display.subtitle && (
                      <span style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: display.color, marginTop: '4px',
                      }}>
                        {display.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Year / age */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.04em', marginBottom: '2px' }}>
                      {stage.keyStage} · {stage.yearGroup}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 600 }}>
                      {stage.ages}
                      <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}> &nbsp;({stage.usGrade})</span>
                    </div>
                  </div>

                  {/* Concepts */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {display.concepts.map(c => (
                      <span key={c} style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: display.color,
                        background: `color-mix(in srgb, ${display.bg} 60%, white)`,
                        border: `1px solid color-mix(in srgb, ${display.color} 20%, transparent)`,
                        padding: '3px 9px', borderRadius: '100px',
                        fontWeight: 500, letterSpacing: '0.04em',
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Parent question */}
                  <div style={{
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '18px',
                  }}>
                    <p style={{
                      fontSize: '13px', fontStyle: 'italic',
                      color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0,
                    }}>
                      &ldquo;{stage.parentQuote.replace(/^"/, '').replace(/"$/, '')}&rdquo;
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: '0 22px 22px', marginTop: 'auto' }}>
                  <Link
                    href={`/dashboard/scripts?stage=${stageId}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: display.color, color: 'var(--ink)',
                      borderRadius: '16px', padding: '13px 16px',
                      fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      textDecoration: 'none', transition: 'opacity 0.15s',
                    }}
                  >
                    <span>See scripts</span>
                    <span style={{ fontSize: '16px', fontWeight: 400, letterSpacing: 0 }}>→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scroll hint on mobile */}
      <div className="scroll-hint" style={{ textAlign: 'center', marginTop: '14px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em' }}>
          swipe to explore
        </span>
      </div>

      {/* Multiple children section */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '28px auto 0' }}>
        {children.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Your children
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {children.map(child => {
                const stageNum = child.stage_id ? stageIdToNum[child.stage_id] : null
                const display = stageNum ? STAGE_DISPLAY[stageNum] : null
                return (
                  <div key={child.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--cream)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px 16px', gap: '12px',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                      {child.name}
                    </span>
                    {display && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                        color: display.color, background: display.bg,
                        padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        {display.displayName}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Add child prompt */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Multiple children? One account covers all of them.
          </p>
          <Link href="/dashboard/settings" style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)',
            textDecoration: 'underline', letterSpacing: '0.04em',
          }}>
            Manage children →
          </Link>
        </div>

        {!isPaid && (
          <div style={{
            marginTop: '24px',
            border: '2px solid var(--stage-5)', borderRadius: '16px',
            padding: '20px 22px', background: 'var(--stage-5)',
          }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate</p>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Unlock all 5 stages for £7.99 / month</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
              All scripts, unlimited DiGi, wellbeing tracker. First 50 members only.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
              Claim founder rate
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .stage-scroll-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0 20px 12px;
        }
        .stage-scroll-container::-webkit-scrollbar { display: none; }

        .stage-cards-row {
          display: flex;
          gap: 14px;
          width: max-content;
          scroll-snap-type: x mandatory;
        }

        .stage-card {
          width: min(82vw, 300px);
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        .scroll-hint { display: block; }

        @media (min-width: 768px) {
          .stage-scroll-container {
            overflow-x: visible;
            padding: 0 20px;
          }
          .stage-cards-row {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
          }
          .stage-card {
            width: auto;
            scroll-snap-align: unset;
          }
          .scroll-hint { display: none; }
        }
      `}</style>
    </div>
  )
}
