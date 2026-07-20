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
      <div aria-hidden style={{ position: 'absolute', left: '10%', right: '10%', top: (showDigi ? 26 : 0) + 17, borderTop: '4px dotted var(--border)' }} />
      <div aria-hidden style={{ position: 'absolute', left: '10%', width: `${((current - 1) / 5) * 80}%`, top: (showDigi ? 26 : 0) + 17, borderTop: '4px dotted var(--terracotta)' }} />
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
              <StageDot n={stage.id} state={state} size={36} />
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

// ── The big road ────────────────────────────────────────────────────────────
// Duolingo sized: fat stamp nodes on a thick winding trail down the page, the
// current one ringed with DiGi standing on it, done stages stamped, future
// ones quiet, and a small sticky card naming the position while you scroll.

// The gentle meander, px from the centre line, one per stage. Small enough
// that an 84px node never clips a 390px phone.
const ROAD_MEANDER = [0, -62, 56, -56, 0]
const ROAD_NODE = 84
const ROAD_GAP_W = 300

function RoadConnector({ fromX, toX, walked, height = 58 }: { fromX: number; toX: number; walked: boolean; height?: number }) {
  const cx = ROAD_GAP_W / 2
  const x1 = cx + fromX
  const x2 = cx + toX
  return (
    <div aria-hidden style={{ position: 'relative', height, overflow: 'visible' }}>
      <svg
        width={ROAD_GAP_W}
        height={height}
        viewBox={`0 0 ${ROAD_GAP_W} ${height}`}
        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'block', overflow: 'visible' }}
      >
        <path
          d={`M ${x1} ${-ROAD_NODE / 2} C ${x1} ${height * 0.7}, ${x2} ${height * 0.3}, ${x2} ${height + ROAD_NODE / 2}`}
          fill="none"
          stroke={walked ? 'var(--terracotta)' : 'var(--border)'}
          strokeWidth={12}
          strokeLinecap="round"
          opacity={walked ? 0.55 : 1}
        />
      </svg>
    </div>
  )
}

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
  const currentReadiness = current > 0 ? READINESS[current - 1] : null

  return (
    <div>
      <RoadPulseStyle />
      <style>{`
        .gc-road-sticky { position: sticky; top: 10px; z-index: 5; }
        @media (min-width: 768px) { .gc-road-sticky { top: 76px; } }
      `}</style>

      {/* The sticky position card: always know where you stand while the
          road scrolls, Duolingo style, in butter and ink. */}
      {current > 0 && currentReadiness && (
        <div className="gc-road-sticky" style={{
          background: 'var(--terracotta)', borderRadius: 16, padding: '13px 18px',
          boxShadow: '0 5px 0 var(--terracotta-dark)', marginBottom: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.7 }}>
              The road to 16
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.15, textTransform: 'uppercase' }}>
              {STAGES[current - 1].name} · stamp {current} of 5
            </div>
          </div>
          {progressPct !== null && (
            <span style={{
              flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15,
              background: '#fff', color: 'var(--terracotta-dark)', borderRadius: 100, padding: '7px 13px',
            }}>
              {progressPct}%
            </span>
          )}
        </div>
      )}

      <div>
        {STAGES.map((stage, i) => {
          const state: StageDotState = current > 0 && stage.id === current ? 'here' : current > 0 && stage.id < current ? 'behind' : 'ahead'
          const r = READINESS[i]
          const here = state === 'here'
          const behind = state === 'behind'
          const x = ROAD_MEANDER[i % ROAD_MEANDER.length]

          return (
            <div key={stage.id}>
              {i > 0 && (
                <RoadConnector
                  fromX={ROAD_MEANDER[(i - 1) % ROAD_MEANDER.length]}
                  toX={x}
                  walked={current > 0 && STAGES[i - 1].id <= current}
                />
              )}

              {/* The stamp node, big, with its pressed edge and its name */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  width: 'fit-content', margin: '0 auto', transform: `translateX(${x}px)`,
                  position: 'relative', zIndex: 1, maxWidth: 'calc(100% - 20px)',
                }}>
                  <div className={here ? 'gc-road-here' : undefined} style={{ position: 'relative', width: ROAD_NODE, height: ROAD_NODE, borderRadius: '50%' }}>
                    {here && (
                      <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                        <DigiCharacter mood="happy" size={40} once />
                      </div>
                    )}
                    <div style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      background: here ? '#fff' : behind ? 'var(--terracotta-lt)' : 'var(--cream)',
                      border: here ? '4px solid var(--terracotta)' : behind ? '3px dashed var(--terracotta)' : '3px solid var(--border)',
                      boxShadow: here
                        ? '0 6px 0 var(--terracotta-dark)'
                        : behind
                          ? '0 6px 0 rgba(201,154,40,0.45)'
                          : '0 6px 0 var(--border)',
                    }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, lineHeight: 1, color: here || behind ? 'var(--terracotta-dark)' : 'var(--ink-light)' }}>
                        {stage.id}
                      </span>
                      <span aria-hidden style={{ fontSize: 15, lineHeight: 1, marginTop: 2, filter: here || behind ? 'none' : 'grayscale(1) opacity(0.5)' }}>🪪</span>
                    </div>
                    {behind && (
                      <span aria-hidden style={{
                        position: 'absolute', right: -4, bottom: -2, width: 28, height: 28, borderRadius: '50%',
                        background: '#2F8F6B', border: '3px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Big label under the node */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.1, color: here ? 'var(--ink)' : 'var(--ink-soft)' }}>
                      {stage.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', marginTop: 3 }}>
                      {r.ages}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: here ? 'var(--terracotta-lt)' : 'var(--cream)', border: `1.5px solid ${here ? 'var(--terracotta)' : 'var(--border)'}`, borderRadius: 100, padding: '5px 13px' }}>
                        <span aria-hidden style={{ fontSize: 13 }}>{behind ? '✅' : '🪪'}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', color: here ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                          Stamp: {r.stamp}
                        </span>
                      </span>
                      {here && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', padding: '5px 11px', borderRadius: 100, alignSelf: 'center' }}>
                          You are here
                        </span>
                      )}
                      {behind && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', border: '1px dashed var(--terracotta)', padding: '4px 10px', borderRadius: 100, alignSelf: 'center' }}>
                          Catch up any time
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* The current stage opens out below its node, full width */}
              {here ? (
                <div style={{ marginTop: 14, background: '#fff', border: '1.5px solid var(--border)', borderLeft: '6px solid var(--terracotta)', borderRadius: 16, padding: '16px 16px 14px' }}>
                  {progressPct !== null && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>This stage</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: 'var(--terracotta-dark)' }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 10, borderRadius: 100, background: 'var(--cream)', border: '1px solid var(--border)', overflow: 'hidden' }}>
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
                      <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 100 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/dashboard/scripts?stage=${STAGE_SLUGS[stage.id - 1]}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
                      borderRadius: 16, padding: '14px 20px',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                      boxShadow: '0 5px 0 var(--terracotta-dark)', whiteSpace: 'nowrap',
                    }}
                  >
                    The words for this stage →
                  </Link>
                </div>
              ) : (
                <details style={{ marginTop: 10, width: 'fit-content', maxWidth: '100%', margin: '10px auto 0', transform: `translateX(${x / 2}px)` }}>
                  <summary style={{ cursor: 'pointer', listStyle: 'none', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.03em' }}>
                    {behind ? 'Revisit this stage ▾' : 'What this stage holds ▾'}
                  </summary>
                  <div style={{ marginTop: 10, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '13px 14px', transform: `translateX(${-x / 2}px)`, width: 'min(340px, calc(100vw - 40px))' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {STAGE_CONCEPTS[stage.id].map(c => (
                        <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 100 }}>
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
          )
        })}

        {/* The end of the road: the reward the whole journey earns */}
        <RoadConnector fromX={ROAD_MEANDER[4]} toX={0} walked={current >= 5} />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          width: 'fit-content', margin: '0 auto', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 76, height: 76, borderRadius: 22,
            background: current >= 5 ? 'var(--terracotta)' : 'var(--cream)',
            border: current >= 5 ? 'none' : '3px solid var(--border)',
            boxShadow: current >= 5 ? '0 6px 0 var(--terracotta-dark)' : '0 6px 0 var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            filter: current >= 5 ? 'none' : 'grayscale(1) opacity(0.6)',
          }}>
            🏆
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, letterSpacing: '-0.01em', color: current >= 5 ? 'var(--ink)' : 'var(--ink-soft)' }}>
              Sixteen, ready
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--ink-muted)', marginTop: 2, maxWidth: 240 }}>
              Social media walked into with open eyes, not fallen into off a cliff
            </div>
          </div>
        </div>
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
