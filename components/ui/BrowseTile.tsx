import Link from 'next/link'

// A big pastel browse tile, the Good Inside Discover pattern: a solid pastel
// fill, a bold title top left, a small sub label under it, and a large topic
// emoji bleeding into the bottom right corner where Good Inside puts a photo.
// One shared tile so every menu of options across the platform reads the same.
// stageNum (1 to 5) picks the pastel, dark stage text stays readable on it.
export default function BrowseTile({
  href, stageNum, title, sub, emoji, done = false, locked = false, external = false,
}: {
  href: string
  stageNum: number
  title: string
  sub?: string
  emoji: string
  done?: boolean
  locked?: boolean
  external?: boolean
}) {
  const text = `var(--stage-${stageNum}-text)`
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        minHeight: 128, textDecoration: 'none', opacity: locked ? 0.82 : 1,
        background: `var(--stage-${stageNum}-bold)`,
        borderRadius: '20px', padding: '17px 18px',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem',
        color: text, lineHeight: 1.12, letterSpacing: '-0.02em',
        position: 'relative', zIndex: 1, maxWidth: '85%',
      }}>
        {title}
      </span>
      {sub && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: text, opacity: 0.68,
          marginTop: '5px', position: 'relative', zIndex: 1,
        }}>
          {sub}
        </span>
      )}
      {/* The topic mark, bleeding into the corner like the reference photo */}
      <span aria-hidden style={{
        position: 'absolute', right: '-4px', bottom: '-8px', fontSize: '58px', lineHeight: 1,
        filter: 'drop-shadow(0 2px 6px rgba(26,26,46,0.12))',
      }}>
        {emoji}
      </span>
      {(done || locked) && (
        <span style={{
          position: 'absolute', top: '11px', right: '12px', zIndex: 2,
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          background: done ? '#D4EDDF' : 'rgba(255,255,255,0.85)',
          color: done ? '#1F7A54' : 'var(--ink)',
          borderRadius: '100px', padding: '3px 9px',
        }}>
          {done ? '✓ Done' : '🔒 Members'}
        </span>
      )}
    </Link>
  )
}
