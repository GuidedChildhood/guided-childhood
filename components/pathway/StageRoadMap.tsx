import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGES } from '@/lib/content/stages'

// The road to 16 at a glance: five stages as one connected road, the walked
// part filled, DiGi standing on the stage this family is in with a You are
// here chip, the stages ahead waiting quietly. Pure server markup with one
// CSS pulse, so the map is on screen before anything hydrates. This is the
// orientation layer; the stage cards below carry the detail.

export default function StageRoadMap({
  currentStageNum,
  progressPct,
}: {
  currentStageNum: number | null
  progressPct: number | null
}) {
  const current = currentStageNum ?? 0
  // The filled track reaches the middle of the current stage, plus the share
  // of the current stage already done, so real progress moves the road.
  const per = 100 / STAGES.length
  const fillPct = current > 0
    ? (current - 1) * per + per * 0.5 + (Math.min(Math.max(progressPct ?? 0, 0), 100) / 100) * per * 0.5
    : 0

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
        {current > 0 && progressPct !== null && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
            Stage {current} · {progressPct}% walked
          </span>
        )}
      </div>

      <div style={{ position: 'relative', paddingTop: 30 }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: '10%', right: '10%', top: 30 + 21, height: 4, background: 'var(--border)', borderRadius: 100 }} />
        <div style={{ position: 'absolute', left: '10%', width: `calc(80% * ${fillPct / 100})`, top: 30 + 21, height: 4, background: 'var(--terracotta)', borderRadius: 100 }} />

        <div style={{ position: 'relative', display: 'flex' }}>
          {STAGES.map(stage => {
            const walked = current > 0 && stage.id < current
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
                    background: walked ? 'var(--terracotta)' : here ? '#fff' : 'var(--cream)',
                    border: here || walked ? '3px solid var(--terracotta)' : '2px solid var(--border)',
                    color: walked ? 'var(--ink)' : here ? 'var(--terracotta-dark)' : 'var(--ink-light)',
                    animation: here ? 'roadmap-pulse 1.6s ease-in-out infinite' : undefined,
                    position: 'relative', zIndex: 1,
                  }}
                >
                  {walked ? '✓' : stage.id}
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
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
