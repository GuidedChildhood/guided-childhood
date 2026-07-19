import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGES } from '@/lib/content/stages'
import { READINESS } from '@/lib/content/readiness'
import { LITERACY_AREAS, type LiteracyKey } from '@/lib/content/literacy'
import type { AreaStatus } from '@/lib/pathway/literacy-status'

// THE road. One visual language for the journey from 4 to 16, drawn one way
// everywhere: the same stage circle, the same dotted trail, the same strand
// pills, whether it appears on Home, in DiGi's welcome walk, on the pathway
// page or on the progress tab. Researched against Duolingo's path (their
// clarity: one node shape, the current one ringed and lifted, the future quiet)
// and Finch's dotted adventure trail (their warmth), translated into butter,
// cream and ink. The passport stamps live ON the road: every stage node carries
// its stamp name, because each passport page is a stage of this one journey.
//
// Age honest, as ever: earlier stages are foundations to catch up on, never
// boxes ticked by a birthday. Pure server friendly markup, one CSS pulse.

// ── The one way to draw a stage circle ──────────────────────────────────────
export type StageDotState = 'behind' | 'here' | 'ahead'

export function StageDot({ n, state, size = 44 }: { n: number; state: StageDotState; size?: number }) {
  const here = state === 'here'
  const behind = state === 'behind'
  return (
    <span
      className={here ? 'gc-road-here' : undefined}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: Math.round(size * 0.36),
        background: here ? '#fff' : behind ? 'var(--terracotta-lt)' : 'var(--cream)',
        border: here ? '3px solid var(--terracotta)' : behind ? '2px dashed var(--terracotta)' : '2px solid var(--border)',
        color: here || behind ? 'var(--terracotta-dark)' : 'var(--ink-light)',
        boxShadow: here ? '0 4px 0 var(--terracotta-dark)' : 'none',
        position: 'relative', zIndex: 1,
      }}
    >
      {n}
    </span>
  )
}

// The shared pulse for the current node, defined once wherever a road renders.
export function RoadPulseStyle() {
  return (
    <style>{`
      @keyframes gc-road-pulse {
        0%, 100% { outline: 4px solid var(--terracotta-lt); outline-offset: 0; }
        50% { outline: 4px solid var(--terracotta-lt); outline-offset: 4px; }
      }
      .gc-road-here { animation: gc-road-pulse 1.8s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .gc-road-here { animation: none; } }
    `}</style>
  )
}

// ── The one way to draw the four strand pills ───────────────────────────────
export type StrandTone = 'green' | 'red' | 'grey'
export type Strand = { key: string; name: string; tone: StrandTone }

// Each strand starts at a stage; before it, the dot stays quietly grey rather
// than pretending progress. The single copy of this rule.
export const STRAND_START: Record<LiteracyKey, number> = { safe: 1, balance: 1, ai: 3, social: 3 }

export function strandsFor(currentStage: number, statuses: Partial<Record<string, AreaStatus>> = {}): Strand[] {
  return (Object.keys(LITERACY_AREAS) as LiteracyKey[]).map(k => {
    const active = currentStage >= STRAND_START[k]
    const live = active ? statuses[k] : undefined
    return {
      key: k,
      name: LITERACY_AREAS[k].name,
      tone: live ? live.tone : active ? 'green' : 'grey',
    }
  })
}

const TONE_DOT: Record<StrandTone, string> = {
  green: 'var(--retro-green, #2F8F6B)',
  red: '#C0533E',
  grey: 'var(--border)',
}

export function StrandPills({ strands }: { strands: Strand[] }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {strands.map(s => (
        <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 100, padding: '5px 11px', opacity: s.tone === 'grey' ? 0.55 : 1 }}>
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: TONE_DOT[s.tone], flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{s.name}</span>
        </span>
      ))}
    </div>
  )
}

// ── The compact road: Home strip and DiGi's welcome walk ────────────────────
// Five small stage circles on one dotted trail, ages beneath, DiGi standing on
// the current one. The exact same grammar as the full road, at a glance size.
export function MiniRoad({ currentStage, showDigi = true }: { currentStage: number; showDigi?: boolean }) {
  const current = Math.min(5, Math.max(1, currentStage))
  return (
    <div style={{ position: 'relative', paddingTop: showDigi ? 26 : 0 }}>
      <RoadPulseStyle />
      {/* The dotted trail behind the circles, filled to where the family stands */}
      <div aria-hidden style={{ position: 'absolute', left: '10%', right: '10%', top: (showDigi ? 26 : 0) + 15, borderTop: '3px dotted var(--border)' }} />
      <div aria-hidden style={{ position: 'absolute', left: '10%', width: `${((current - 1) / 5) * 80}%`, top: (showDigi ? 26 : 0) + 15, borderTop: '3px dotted var(--terracotta)' }} />
      <div style={{ position: 'relative', display: 'flex' }}>
        {STAGES.map(stage => {
          const state: StageDotState = stage.id === current ? 'here' : stage.id < current ? 'behind' : 'ahead'
          const ages = stage.ageBand === '16+' ? '16 plus' : stage.ageBand.replace('-', ' to ')
          return (
            <div key={stage.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0, position: 'relative' }}>
              {showDigi && state === 'here' && (
                <div style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                  <DigiCharacter mood="happy" size={26} once />
                </div>
              )}
              <StageDot n={stage.id} state={state} size={30} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.02em', color: state === 'here' ? 'var(--ink)' : 'var(--ink-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {ages}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── The full road: the pathway page ─────────────────────────────────────────
// One vertical road holding everything the page used to say five ways: each
// stage is a node on the trail with its name, ages and passport stamp, the
// current one opens out with DiGi, the stamp being earned, live progress, and
// the stage's own detail. Earlier stages stay reachable as foundations to
// catch up on, later ones wait quietly. Nothing lost, one picture.

// The concept chips each stage teaches, folded in from the old stage cards.
const STAGE_CONCEPTS: Record<number, string[]> = {
  1: ['Shared screen', 'Co viewing', 'No solo device', 'No feeds'],
  2: ['Restricted phone', 'Family contacts', 'Privacy basics', 'Algorithms'],
  3: ['Guided smartphone', 'No social media', 'Comparison', 'Orben research'],
  4: ['Monitored social', 'Reputation', 'Filter bubbles', 'Readiness'],
  5: ['Trust based', 'Full access', 'AI literacy', 'Vibe coding'],
}

const STAGE_SLUGS = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

export default function StageRoad({
  currentStageNum,
  progressPct,
  childName,
}: {
  currentStageNum: number | null
  progressPct: number | null
  childName?: string
}) {
  const current = currentStageNum ?? 0
  const kid = childName && childName !== 'Your child' ? childName : 'your child'

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '20px', padding: '20px 18px 16px',
      boxShadow: '0 4px 0 rgba(26,26,46,0.06)',
    }}>
      <RoadPulseStyle />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          The road to 16
        </span>
        {current > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)' }}>
            Stage {current} of 5
          </span>
        )}
      </div>

      <div>
        {STAGES.map((stage, i) => {
          const state: StageDotState = current > 0 && stage.id === current ? 'here' : current > 0 && stage.id < current ? 'behind' : 'ahead'
          const r = READINESS[i]
          const last = i === STAGES.length - 1
          const here = state === 'here'
          const behind = state === 'behind'

          return (
            <div key={stage.id} style={{ display: 'flex', gap: 14 }}>
              {/* The rail: node, then the dotted trail down to the next node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
                {here && (
                  <div style={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                    <DigiCharacter mood="happy" size={28} once />
                  </div>
                )}
                <StageDot n={stage.id} state={state} size={44} />
                {!last && (
                  <span aria-hidden style={{
                    flex: 1, minHeight: 26, width: 0, margin: '4px 0',
                    borderLeft: `3px dotted ${state !== 'ahead' ? 'var(--terracotta)' : 'var(--border)'}`,
                  }} />
                )}
              </div>

              {/* The stage on the road */}
              <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: here ? 'var(--ink)' : 'var(--ink-soft)', letterSpacing: '-0.01em' }}>
                    {stage.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-muted)' }}>
                    {r.ages}
                  </span>
                  {here && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', padding: '3px 9px', borderRadius: 100 }}>
                      You are here
                    </span>
                  )}
                  {behind && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', border: '1px dashed var(--terracotta)', padding: '2px 8px', borderRadius: 100 }}>
                      Catch up any time
                    </span>
                  )}
                </div>

                {/* The passport stamp lives on the road: the page of the
                    passport this stage earns. */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, background: here ? 'var(--terracotta-lt)' : 'var(--cream)', border: `1px ${here ? 'solid var(--terracotta)' : 'solid var(--border)'}`, borderRadius: 100, padding: '4px 12px' }}>
                  <span aria-hidden style={{ fontSize: 13 }}>🪪</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', color: here ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                    Stamp: {r.stamp}
                  </span>
                </div>

                {here ? (
                  <div style={{ marginTop: 12, background: 'var(--cream)', border: '1.5px solid var(--border)', borderLeft: '6px solid var(--terracotta)', borderRadius: 16, padding: '16px 16px 14px' }}>
                    {progressPct !== null && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>This stage</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: 'var(--terracotta-dark)' }}>{progressPct}%</span>
                        </div>
                        <div style={{ height: 10, borderRadius: 100, background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--terracotta)', borderRadius: 100 }} />
                        </div>
                      </div>
                    )}
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 6px' }}>{r.skill}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
                      Everything {kid} does this stage is building toward {r.toward}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {STAGE_CONCEPTS[stage.id].map(c => (
                        <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', color: 'var(--ink-soft)', background: '#fff', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 100 }}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/dashboard/scripts?stage=${STAGE_SLUGS[stage.id - 1]}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
                        borderRadius: 16, padding: '12px 20px',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
                        boxShadow: '0 4px 0 var(--terracotta-dark)', whiteSpace: 'nowrap',
                      }}
                    >
                      The words for this stage →
                    </Link>
                  </div>
                ) : (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.03em' }}>
                      {behind ? 'Revisit this stage ▾' : 'What this stage holds ▾'}
                    </summary>
                    <div style={{ marginTop: 10, background: 'var(--cream)', borderRadius: 14, padding: '13px 14px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                        {STAGE_CONCEPTS[stage.id].map(c => (
                          <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', color: 'var(--ink-soft)', background: '#fff', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 100 }}>
                            {c}
                          </span>
                        ))}
                      </div>
                      <p style={{ fontSize: 13.5, fontStyle: 'italic', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 10px' }}>
                        &ldquo;{stage.parentQuote.replace(/^"/, '').replace(/"$/, '')}&rdquo;
                      </p>
                      <Link href={`/dashboard/scripts?stage=${STAGE_SLUGS[stage.id - 1]}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
                        See the scripts →
                      </Link>
                    </div>
                  </details>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Honest framing, kept from the old map: age sets the stage, learning
          fills it in. */}
      {current > 1 && (
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '16px 2px 0' }}>
          The stages before yours are foundations, not finished. Dip back into one a little each day whenever it helps. Nothing is marked done just because of {kid ? `${kid}'s` : 'your child’s'} age.
        </p>
      )}
    </div>
  )
}
