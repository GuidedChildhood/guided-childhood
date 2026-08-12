import PlanetCard from '@/components/pathway/PlanetCard'
import PlanetArt from '@/components/pathway/PlanetArt'
import { PLANETS, planetOfTheWeek } from '@/lib/pathway/planets'

// Dev fixture for the planets under the pathway.
//
// Two views, because they answer different questions. The live card at the top
// is the thing a parent sees, dots and all, so the layout and the tap targets
// can be walked at 390 and 1280. The grid underneath is every planet at once,
// which is the only way to judge whether the six read as a SET rather than as
// six drawings that happen to share a page. A rotation shows one a week, so
// without this nobody would ever see them side by side until a parent did.

export default function PlanetsFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <PlanetCard startIndex={planetOfTheWeek()} />

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          margin: '38px 0 12px',
        }}>
          All six, for the set check
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {PLANETS.map(p => (
            <div key={p.key} style={{
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
              padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            }}>
              <PlanetArt motif={p.key} body={p.body} ring={p.ring} tint={p.tint} alt={p.alt} size={92} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
                {p.key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
