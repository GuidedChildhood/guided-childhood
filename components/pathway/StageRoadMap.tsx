import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGES } from '@/lib/content/stages'

// The road to 16 at a glance: five stages as one connected road, DiGi standing
// on the stage this family is in with a You are here chip, the stages ahead
// waiting quietly. The stages before this one are not ticked off, because the
// stage is set by the child's age, not by what has been learned. They are shown
// as foundations the family can catch up on, a little each day. Pure server
// markup with one CSS pulse, so the map is on screen before anything hydrates.
// This is the orientation layer; the stage cards below carry the detail.

export default function StageRoadMap({
  currentStageNum,
  progressPct,
}: {
  currentStageNum: number | null
  progressPct: number | null
}) {
  const current = currentStageNum ?? 0
  const per = 100 / STAGES.length
  // The road is filled only as far as where this family stands by age, in a
  // soft tint, so it reads as the road so far, never as stages completed.
  const roadFrac = current > 0 ? (current - 0.5) * per : 0

  return (
    <div style={{
      background: 'var(--white, #fff)', border: '1px solid var(--border)',
      borderRadius: '20px', padding: '18px 16px 14px',
      boxShadow: '0 4px 20px rgba(26,26,46,0.06)',
    }}>
      <style>{`
        @keyframes roadmap-pulse {
          0%, 100% { box-shadow: 0 0 0 4px var(--terracotta-lt); }
          50% { box-shadow: 0 0 0 8px var(--terracotta-lt); }
        }
        @media (prefers-reduced-motion: reduce) { .roadmap-here { animation: none !important; } }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 26 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          The road to 16
        </span>
        {current > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
            Stage {current} of {STAGES.length}{progressPct !== null ? ` · ${progressPct}% of this stage` : ''}
          </span>
        )}
      </div>

      <div style={{ position: 'relative', paddingTop: 30 }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: '10%', right: '10%', top: 30 + 21, height: 4, background: 'var(--border)', borderRadius: 100 }} />
        <div style={{ position: 'absolute', left: '10%', width: `calc(80% * ${roadFrac / 100})`, top: 30 + 21, height: 4, background: 'var(--terracotta-lt)', borderRadius: 100 }} />

        <div style={{ position: 'relative', display: 'flex' }}>
          {STAGES.map(stage => {
            const behind = current > 0 && stage.id < current
            const here = stage.id === current
            const ages = stage.ageBand === '16+' ? '16 plus' : stage.ageBand.replace('-', ' to ')
            return (
              <div key={stage.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 0, position: 'relative' }}>
                {here && (
                  <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
                    <DigiCharacter mood="happy" size={28} />
                  </div>
                )}
                <div
                  className={here ? 'roadmap-here' : undefined}
                  style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                    background: here ? '#fff' : behind ? 'var(--terracotta-lt)' : 'var(--cream)',
                    border: here ? '3px solid var(--terracotta)' : behind ? '2px dashed var(--terracotta)' : '2px solid var(--border)',
                    color: here ? 'var(--terracotta-dark)' : behind ? 'var(--terracotta-dark)' : 'var(--ink-light)',
                    animation: here ? 'roadmap-pulse 1.6s ease-in-out infinite' : undefined,
                    position: 'relative', zIndex: 1,
                  }}
                >
                  {stage.id}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: here ? 'var(--ink)' : 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                    {ages}
                  </div>
                  {here && (
                    <div style={{
                      display: 'inline-block', marginTop: 4,
                      fontFamily: 'var(--font-mono)', fontSize: 7.5, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      background: 'var(--terracotta)', color: 'var(--ink)',
                      padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap',
                    }}>
                      You are here
                    </div>
                  )}
                  {behind && (
                    <div style={{
                      display: 'inline-block', marginTop: 4,
                      fontFamily: 'var(--font-mono)', fontSize: 7.5, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      background: 'transparent', color: 'var(--terracotta-dark)',
                      border: '1px dashed var(--terracotta)',
                      padding: '1px 7px', borderRadius: 100, whiteSpace: 'nowrap',
                    }}>
                      Catch up
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Honest framing: the earlier stages are set by age, not learning, so
          they are foundations to revisit, never boxes already ticked. */}
      {current > 1 && (
        <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 4px 0', textAlign: 'center' }}>
          The stages before yours are foundations, not finished. Dip back into one a little each day whenever it helps. Nothing is marked done just because of your child&apos;s age.
        </p>
      )}
    </div>
  )
}
