import Link from 'next/link'
import { withOrigin } from '@/components/nav/BackTo'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { STAGES } from '@/lib/content/stages'
import { READINESS } from '@/lib/content/readiness'
import { characterForStage } from '@/lib/content/stage-characters'
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
// href is where a parent goes to actually fix this strand. getLiteracyStatuses
// has always worked one out per area, pointing at devices, quests or lessons
// depending on what is actually wrong, and it used to be dropped on the floor
// right here. A pill that says "fix this" and does nothing is worse than a
// pill that says nothing.
export type Strand = {
  key: string
  name: string
  tone: StrandTone
  href?: string
  /**
   * The one concrete thing that turns the cross back into a tick.
   *
   * getLiteracyStatuses has always worked this out (AreaStatus.improve) and it
   * was dropped on the floor here, exactly as href once was. Justin, 8 August
   * 2026: "fix it needs to be clearer and take you to exactly the bit to do to
   * fix it." The sentence that does that already existed; it just never reached
   * the screen.
   */
  improve?: string
}

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
      href: live?.href,
      improve: live?.improve,
    }
  })
}

const TONE_DOT: Record<StrandTone, string> = {
  green: 'var(--retro-green, #2F8F6B)',
  red: '#C0533E',
  grey: 'var(--border)',
}

// A red strand is a problem we have raised, so it has to carry the way out of
// itself. Anything else is a scoreboard: it tells a parent they are failing at
// something and leaves them to go and find the page that fixes it.
//
// onNavigate is for callers that live in an overlay. The DiGi welcome sheet
// sits over Home, so following a link has to close the sheet first or the
// parent lands on the right page with the sheet still covering it.
export function StrandPills({ strands, onNavigate, from }: {
  strands: Strand[]
  onNavigate?: () => void
  /** Where a parent came from, so every fix carries the way back. */
  from?: string
}) {
  const anyRed = strands.some(s => s.tone === 'red')
  const anyFixable = strands.some(s => s.tone === 'red' && s.href)
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {strands.map(s => {
          const red = s.tone === 'red'
          // Only a red strand with somewhere to go becomes a link. A red one
          // without an href keeps its look and, crucially, loses the arrow,
          // because promising a tap that does nothing is the thing being fixed.
          const linked = red && !!s.href
          const inner = (
            <>
              <span aria-hidden style={{
                width: 11, height: 11, borderRadius: '50%', background: TONE_DOT[s.tone],
                flexShrink: 0, marginTop: 5,
              }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)',
                  fontWeight: 800, color: red ? '#93392A' : 'var(--ink)', lineHeight: 1.3,
                }}>
                  {s.name}
                </span>
                {/* THE ONE THING TO DO, in the parent's own words rather than
                    "fix this". getLiteracyStatuses already knows what it is. */}
                {red && s.improve && (
                  <span style={{
                    display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
                    lineHeight: 1.4, marginTop: 2,
                  }}>
                    {s.improve}
                  </span>
                )}
              </span>
              {linked && (
                <span aria-hidden style={{
                  // Centred on the row rather than pinned to the first line: a
                  // chevron floating beside a heading reads as decoration, and
                  // beside the middle of the row it reads as "this opens".
                  alignSelf: 'center', flexShrink: 0,
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#F6DDD7', color: '#93392A',
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 'var(--text-md)', lineHeight: 1,
                }}>
                  ›
                </span>
              )}
            </>
          )
          // A ROW, NOT A PILL, AND THAT IS THE WHOLE FIX FOR THE OVERFLOW.
          //
          // Justin, 8 August 2026: "lengths of text seem to go over edge."
          //
          // These were inline-flex pills with nowrap on the name AND on the
          // "fix this" suffix, so each one sized itself to its own text and
          // could not shrink. "Social media ready · fix this" is wider than a
          // 390px phone once body zoom 1.07 has taken its 6.5 per cent, so the
          // pill pushed past the card and took the whole document sideways
          // with it. Wrapping the row could never help: flex-wrap moves pills
          // to the next line, it does not make one narrow enough to fit.
          //
          // A full width row cannot overflow by construction: the name column
          // is `flex: 1, minWidth: 0` and wraps, and the only fixed things are
          // an 11px dot and a chevron.
          //
          // MOBBIN, 8 August 2026, on how a checkup list is actually built.
          // KakaoTalk, Coinbase, Uber and GoPay all do the same thing and none
          // of them uses a chip: full width row, the problem in bold, the one
          // thing to do underneath, a chevron on the right.
          // https://mobbin.com/screens/c2b4188e-61b8-4708-925f-3904be6f88b6
          // https://mobbin.com/screens/5dc8f411-e4c2-4886-b78d-8549536c01c3
          // It is also the shape Justin asked for: "so they can run down list".
          const shell: React.CSSProperties = {
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: red ? '#FDF0EE' : 'var(--cream)',
            border: `1.5px solid ${red ? '#E8C4BC' : 'var(--border)'}`,
            borderRadius: 14, padding: '11px 13px',
            opacity: s.tone === 'grey' ? 0.55 : 1,
          }
          return linked ? (
            <Link
              key={s.key}
              // The way back travels WITH the link, so the fix page can offer a
              // return to the list rather than dropping the parent at Home with
              // three more red rows to go and find again.
              href={from ? withOrigin(s.href!, from) : s.href!}
              onClick={onNavigate}
              style={{ ...shell, textDecoration: 'none' }}
            >
              {inner}
            </Link>
          ) : (
            <span key={s.key} style={shell}>{inner}</span>
          )
        })}
      </div>
      {/* One quiet line so the dots explain themselves at a glance. It only
          offers the tap when there is genuinely one to make. */}
      <p style={{ margin: '10px 2px 0', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.4 }}>
        {anyFixable
          ? 'Tap a red one to go straight to the fix, then come back for the next.'
          : anyRed
          ? 'A red one needs one thing doing.'
          : 'Green means on track for their age. Grey comes later, at the right age.'}
      </p>
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
              {/* Sizing lives in globals.css: five nowrap labels do not fit a
                  390px phone, and the widest ran into its neighbour. */}
              <span className="mini-road-age" style={{ color: state === 'here' ? 'var(--ink)' : 'var(--ink-muted)' }}>
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
    <div aria-hidden style={{ position: 'relative', height, overflow: 'visible', zIndex: 0 }}>
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
  stageStatus,
}: {
  currentStageNum: number | null
  progressPct: number | null
  childName?: string
  // The one shared reading per stage, from the same blend the passport uses, so
  // the road can show a caught up page as caught up and a filled stamp as done,
  // never a stale badge. Keyed by stage number.
  stageStatus?: Record<number, { pct: number; complete: boolean }>
}) {
  const current = currentStageNum ?? 0
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const currentReadiness = current > 0 ? READINESS[current - 1] : null
  const isComplete = (id: number) => !!stageStatus?.[id]?.complete

  return (
    <div>
      <RoadPulseStyle />
      <style>{`
        .gc-road-sticky { position: sticky; top: 10px; z-index: 5; }
        @media (min-width: 768px) { .gc-road-sticky { top: 76px; } }
      `}</style>

      {/* The sticky position card: always know where you stand while the road
          scrolls. The whole card is a link that continues the work, so "where
          am I" and "what next" are the same tap. Clear, larger, plain case
          titling, BBC style, no cramped ellipsis. */}
      {current > 0 && currentReadiness && (
        <Link href={`/dashboard/lessons?stage=${current}`} className="gc-road-sticky" style={{
          textDecoration: 'none',
          background: 'var(--terracotta)', borderRadius: 16, padding: '14px 18px',
          boxShadow: '0 5px 0 var(--terracotta-dark)', marginBottom: 22,
          display: 'flex', alignItems: 'center', gap: 13,
        }}>
          {/* DiGi rides the sticky card, so the guide travels the whole road
              with the parent while the big trail scrolls beneath. */}
          <div style={{ flexShrink: 0 }}>
            <DigiCharacter mood="happy" size={32} once />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.68 }}>
              The road to 16
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(19px, 5.6vw, 24px)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.12 }}>
              {STAGES[current - 1].name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink)', opacity: 0.72, marginTop: 2 }}>
              Stamp {current} of 5{isComplete(current) ? ' · filled' : ''}
            </div>
          </div>
          {progressPct !== null && (
            <span style={{
              flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
              background: '#fff', color: 'var(--terracotta-dark)', borderRadius: 100, padding: '8px 14px',
            }}>
              {isComplete(current) ? '✓' : `${progressPct}%`}
            </span>
          )}
          <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink)', opacity: 0.5, fontSize: 'var(--text-xl)', fontWeight: 900, lineHeight: 1 }}>›</span>
        </Link>
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

              {/* The stamp node, big, with its pressed edge and its name.
                  The node rides the full meander; its labels only shift half
                  way, so no pill ever runs off a phone edge. */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 'fit-content', margin: '0 auto', transform: `translateX(${x}px)`,
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
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', lineHeight: 1, color: here || behind ? 'var(--terracotta-dark)' : 'var(--ink-light)' }}>
                        {stage.id}
                      </span>
                      <span aria-hidden style={{ fontSize: 'var(--text-md)', lineHeight: 1, marginTop: 2, filter: here || behind ? 'none' : 'grayscale(1) opacity(0.5)' }}>🪪</span>
                    </div>
                    {behind && isComplete(stage.id) && (
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

                </div>

                {/* Big label under the node, half the meander */}
                <div style={{ width: 'fit-content', maxWidth: 'calc(100% - 12px)', margin: '8px auto 0', transform: `translateX(${x / 2}px)` }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', lineHeight: 1.1, color: here ? 'var(--ink)' : 'var(--ink-soft)' }}>
                      {stage.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginTop: 3 }}>
                      {r.ages}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: here ? 'var(--terracotta-lt)' : 'var(--cream)', border: `1.5px solid ${here ? 'var(--terracotta)' : 'var(--border)'}`, borderRadius: 100, padding: '4px 13px 4px 5px' }}>
                        {(() => {
                          const ch = characterForStage(stage.id)
                          return ch ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={ch.img} alt="" width={22} height={22} style={{ borderRadius: '50%', objectFit: 'cover', filter: here || (behind && isComplete(stage.id)) ? 'none' : 'grayscale(1) opacity(0.55)' }} />
                          ) : <span aria-hidden style={{ fontSize: 'var(--text-base)' }}>{behind && isComplete(stage.id) ? '✅' : '🪪'}</span>
                        })()}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: here ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                          Stamp: {r.stamp}
                        </span>
                      </span>
                      {here && (
                        isComplete(stage.id) ? (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', background: '#2F8F6B', color: '#fff', padding: '7px 14px', borderRadius: 100, alignSelf: 'center' }}>
                            ✓ Stage complete
                          </span>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', padding: '7px 14px', borderRadius: 100, alignSelf: 'center' }}>
                            You are here
                          </span>
                        )
                      )}
                      {behind && (
                        isComplete(stage.id) ? (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', background: '#2F8F6B', padding: '5px 12px', borderRadius: 100, alignSelf: 'center' }}>
                            ✓ Caught up
                          </span>
                        ) : (
                          <Link href={`/dashboard/lessons?stage=${stage.id}`} style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', border: '1px dashed var(--terracotta)', padding: '5px 12px', borderRadius: 100, alignSelf: 'center' }}>
                            Catch up →
                          </Link>
                        )
                      )}
                    </div>

                    {/* The stamp in plain words, right under its name, so the
                        badge is never a mystery. */}
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontStyle: 'italic', color: 'var(--ink-muted)', margin: '5px auto 0', maxWidth: 260 }}>
                      {r.stamp} means {r.means}
                    </p>

                    {/* The literacy level running with the stamp: what the
                        child can do at this stage, in the readiness words.
                        The current stage says it biggest in its card below. */}
                    {!here && (
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: behind ? 'var(--ink-soft)' : 'var(--ink-muted)', lineHeight: 1.45, margin: '8px auto 0', maxWidth: 300 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: behind ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                          Can do ·{' '}
                        </span>
                        {r.skill}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* The current stage opens out below its node, full width */}
              {here ? (
                <div style={{ marginTop: 14, background: '#fff', border: '1.5px solid var(--border)', borderLeft: '6px solid var(--terracotta)', borderRadius: 16, padding: '16px 16px 14px', position: 'relative', zIndex: 2 }}>
                  {progressPct !== null && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>This stage</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--terracotta-dark)' }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 10, borderRadius: 100, background: 'var(--cream)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--terracotta)', borderRadius: 100 }} />
                      </div>
                    </div>
                  )}
                  {/* The literacy level, biggest on the current stage: the
                      passport stamp and what the child can do, together. */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 4px' }}>
                    Can do at this stage
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.35, margin: '0 0 8px' }}>{r.skill}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
                    Everything {kid} does this stage is building toward {r.toward}
                  </p>
                  {/* The concepts are tappable: each opens this stage's
                      lessons, where the child actually learns and does it, and
                      every pass ticks the progress above and the passport. */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {STAGE_CONCEPTS[stage.id].map(c => (
                      <Link key={c} href={`/dashboard/lessons?stage=${stage.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.03em', color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 100, textDecoration: 'none' }}>
                        {c} →
                      </Link>
                    ))}
                  </div>
                  {/* Two clear next steps: the lessons the child does (these
                      move the progress and the passport), and the words for the
                      grown up. */}
                  <Link
                    href={`/dashboard/lessons?stage=${stage.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
                      borderRadius: 16, padding: '14px 20px', marginBottom: 8,
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                      boxShadow: '0 5px 0 var(--terracotta-dark)', whiteSpace: 'nowrap',
                    }}
                  >
                    This stage&apos;s lessons →
                  </Link>
                  <Link
                    href={`/dashboard/scripts/next?stage=${STAGE_SLUGS[stage.id - 1]}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: '#fff', color: 'var(--ink)', textDecoration: 'none',
                      borderRadius: 16, padding: '12px 20px', border: '1.5px solid var(--border)',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    The words for this stage →
                  </Link>
                </div>
              ) : (
                <details style={{ marginTop: 10, width: 'fit-content', maxWidth: '100%', margin: '10px auto 0', transform: `translateX(${x / 2}px)`, position: 'relative', zIndex: 2 }}>
                  <summary style={{ cursor: 'pointer', listStyle: 'none', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.03em' }}>
                    {behind ? 'Revisit this stage ▾' : 'What this stage holds ▾'}
                  </summary>
                  <div style={{ marginTop: 10, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '13px 14px', transform: `translateX(${-x / 2}px)`, width: 'min(340px, calc(100vw - 40px))' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {STAGE_CONCEPTS[stage.id].map(c => (
                        <span key={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.03em', color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 100 }}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 10px' }}>
                      &ldquo;{stage.parentQuote.replace(/^"/, '').replace(/"$/, '')}&rdquo;
                    </p>
                    <Link href={`/dashboard/scripts/next?stage=${STAGE_SLUGS[stage.id - 1]}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl)',
            filter: current >= 5 ? 'none' : 'grayscale(1) opacity(0.6)',
          }}>
            🏆
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', letterSpacing: '-0.01em', color: current >= 5 ? 'var(--ink)' : 'var(--ink-soft)' }}>
              Sixteen, ready
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: 2, maxWidth: 240 }}>
              Social media walked into with open eyes, not fallen into off a cliff
            </div>
          </div>
        </div>
      </div>

      {/* Honest framing, kept from the old map: age sets the stage, learning
          fills it in. */}
      {current > 1 && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '16px 2px 0' }}>
          The stages before yours are foundations, not finished. Dip back into one a little each day whenever it helps. Nothing is marked done just because of {kid ? `${kid}'s` : 'your child’s'} age.
        </p>
      )}
    </div>
  )
}
