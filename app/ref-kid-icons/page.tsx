import { BUDDY_MAP } from '@/lib/kid/buddy'

const BANDS = ['4-7', '8-10', '11-13', '13-15', '16+']

// Every child's Home Screen icon, side by side, at the size iOS draws them.
//
// This is the picture of the thing being fixed: before, all six of these tiles
// were the same star on the same teal, which is what a family with two children
// saw on one shared tablet.

export const dynamic = 'force-dynamic'

export default function RefKidIcons() {
  const keys = Object.keys(BUDDY_MAP)
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '24px 16px', fontFamily: 'var(--font-body)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
        One icon per child
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '0 0 20px', maxWidth: 520, lineHeight: 1.5 }}>
        Drawn at 180, the size iOS puts on a Home Screen. On a tablet two children share, these are what tells their two apps apart, and none of them carries a name.
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 4px' }}>
        By age, which is what every child gets today
      </h2>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '0 0 14px', maxWidth: 520, lineHeight: 1.5 }}>
        Nobody in the database has picked a Friend, so the age band is the real path. Two children of different ages get two different icons with nothing to set up.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: '26px' }}>
        {BANDS.map(band => (
          <div key={band} style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/ref-kid-icons/none?band=${encodeURIComponent(band)}`}
              alt={`home screen icon for a child aged ${band}`}
              width={90} height={90}
              style={{ display: 'block', borderRadius: 20, border: 'var(--edge)' }}
            />
            <span style={{ display: 'block', marginTop: '7px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ink-muted)' }}>
              {band}
            </span>
          </div>
        ))}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 14px' }}>
        By chosen Friend
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
        {keys.map(key => (
          <div key={key} style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/ref-kid-icons/${key}`}
              alt={`${BUDDY_MAP[key].name} home screen icon`}
              width={90} height={90}
              style={{ display: 'block', borderRadius: 20, border: 'var(--edge)' }}
            />
            <span style={{ display: 'block', marginTop: '7px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)' }}>
              {BUDDY_MAP[key].name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
