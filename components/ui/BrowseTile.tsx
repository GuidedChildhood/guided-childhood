import Link from 'next/link'

// A big pastel browse tile, the Good Inside Discover pattern: a solid pastel
// fill, a bold title top left, a small sub label under it, and a large topic
// emoji bleeding into the bottom right corner where Good Inside puts a photo.
// One shared tile so every menu of options across the platform reads the same.
// stageNum (1 to 5) picks the pastel, dark stage text stays readable on it.
// When a coverUrl is given (the drawn lesson cover icons), the corner shows
// that art as a round storybook badge instead of the emoji; the emoji stays
// as the fallback for anything without a cover yet.
export default function BrowseTile({
  href, stageNum, title, sub, emoji, coverUrl, done = false, doneLabel, attempted = false, number, locked = false, external = false, chips = [],
}: {
  href: string
  stageNum: number
  title: string
  sub?: string
  emoji: string
  coverUrl?: string | null
  done?: boolean
  // What the green badge says when done. Defaults to "✓ Done"; lesson tiles
  // pass "✓ Passed" with the score so parents see the check was passed.
  doneLabel?: string
  // Started but not yet passed: shows an amber "Attempted" badge inviting a
  // retake, so a near miss reads differently from a fresh lesson.
  attempted?: boolean
  // The lesson's place in its stage order, shown as a round number badge so a
  // parent sees a clear numbered path of what to do next.
  number?: number
  locked?: boolean
  external?: boolean
  // Small quiet mono chips under the sub line: the lesson tiles carry their
  // Key Stage and Education for a Connected World strand here.
  chips?: string[]
}) {
  const text = `var(--stage-${stageNum}-text)`
  const hasBadge = done || locked || attempted
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
        // The badges ride the top corners, so the title drops below them
        // rather than running underneath.
        marginTop: hasBadge || number != null ? '24px' : 0,
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
      {chips.length > 0 && (
        <span style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '7px', position: 'relative', zIndex: 1, maxWidth: '80%' }}>
          {chips.map((c, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: text,
              background: 'rgba(255,255,255,0.55)', borderRadius: '100px', padding: '2px 8px',
            }}>
              {c}
            </span>
          ))}
        </span>
      )}
      {/* The topic mark, bleeding into the corner like the reference photo:
          the drawn cover badge when we have one, the emoji otherwise. */}
      {coverUrl ? (
        <span aria-hidden style={{
          position: 'absolute', right: '-10px', bottom: '-14px', width: '76px', height: '76px',
          borderRadius: '50%', backgroundImage: `url(${coverUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          boxShadow: '0 2px 8px rgba(26,26,46,0.16)', border: '2px solid rgba(255,255,255,0.7)',
        }} />
      ) : (
        <span aria-hidden style={{
          position: 'absolute', right: '-4px', bottom: '-8px', fontSize: '58px', lineHeight: 1,
          filter: 'drop-shadow(0 2px 6px rgba(26,26,46,0.12))',
        }}>
          {emoji}
        </span>
      )}
      {/* Order number, top left: the clear numbered path of what to do next. */}
      {number != null && (
        <span aria-hidden style={{
          position: 'absolute', top: '11px', left: '12px', zIndex: 2,
          width: 22, height: 22, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '11px',
          background: done ? '#2F8F6B' : 'rgba(255,255,255,0.9)',
          color: done ? '#fff' : text,
          boxShadow: '0 2px 0 rgba(26,26,46,0.14)',
        }}>
          {number}
        </span>
      )}
      {/* Status, top right: passed, a warm attempted, or members lock. */}
      {hasBadge && (
        <span style={{
          position: 'absolute', top: '11px', right: '12px', zIndex: 2,
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          background: done ? '#D4EDDF' : attempted ? '#FBE7C6' : 'rgba(255,255,255,0.85)',
          color: done ? '#1F7A54' : attempted ? '#9A6A16' : 'var(--ink)',
          borderRadius: '100px', padding: '3px 9px',
        }}>
          {done ? doneLabel ?? '✓ Done' : attempted ? '↻ Attempted' : '🔒 Members'}
        </span>
      )}
    </Link>
  )
}
