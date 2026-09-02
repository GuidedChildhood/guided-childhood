import type { StickerRule } from '@/lib/stickers/catalog'

// Typed to the three fields this actually reads rather than the whole
// StickerState, so the child's book can render the same badge without carrying
// the parent's progress counters. StickerState still satisfies it.
export type BadgeShape = { rule: StickerRule; earned: boolean; colour: string }

// The badge stickers, drawn rather than borrowed.
//
// They used to be emoji: a star, a sparkle, a medal, a trophy, a crayon, some
// books, a flame. Two problems with that side by side with the Planet Friend
// art. First it is two visual languages in one grid, one of them ours and one
// of them whatever font the device happens to ship, so the book never looks
// like a set. Second a greyed out emoji is a grey smudge, so the locked half of
// the page, which is most of it early on, looked broken rather than waiting.
//
// So a badge is now a disc in the sticker's own colour carrying the NUMBER it
// stands for, which is the thing a child actually cares about, plus one small
// star. It is legible at 64px, it is identical in every browser, it greys out
// as a clean outline instead of a smudge, and it is ours.

function Star({ size, fill, stroke }: { size: number; fill: string; stroke: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }} aria-hidden>
      <path
        d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z"
        fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round"
      />
    </svg>
  )
}

// The passport seal, for a stamp sticker. A tick in a ring, set on the tilt,
// which is the same mark the parent's passport slams onto a finished page.
function Seal({ size, ink }: { size: number; ink: string }) {
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size, borderRadius: '50%',
        border: `2px solid ${ink}`, color: ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'rotate(-10deg)',
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7" />
      </svg>
    </div>
  )
}

export default function StickerBadge({ s, size = 54 }: { s: BadgeShape; size?: number }) {
  const n = s.rule.n
  const earned = s.earned
  // Earned is the colour filled in. Locked is the same shape in outline, so the
  // page reads as a book waiting to be filled rather than a page of failures.
  const ink = earned ? '#fff' : s.colour
  const bg = earned ? s.colour : 'transparent'

  // The first of anything is the moment, not the count, so it gets the star on
  // its own rather than a number 1 nobody needs.
  const isFirst = n === 1

  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg,
        border: `2.5px ${earned ? 'solid' : 'dashed'} ${s.colour}`,
        opacity: earned ? 1 : 0.5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 1,
        position: 'relative',
        // An earned sticker is a real object: a white die cut rim, a soft lift
        // off the page, and a highlight across the top so it reads as something
        // printed and peeled rather than a coloured circle in a grid. That is
        // the whole difference between a status dot and a sticker, and it is
        // what the Planet Friends beside them already have.
        //
        // A locked one gets none of it, because an unearned sticker should sit
        // flat on the page waiting rather than pretending to be a thing you own.
        ...(earned ? {
          boxShadow: `0 0 0 3px #fff, 0 3px 6px rgba(38,32,28,0.22)`,
          backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.10) 42%, rgba(0,0,0,0.07) 100%)',
        } : {}),
        // Browsers strip background colours when printing unless told not to,
        // which would have sent every one of these to the printer as a white
        // circle with a number in it. On a sheet whose entire purpose is to be
        // cut out and stuck on a chart, that is the difference between a
        // printable and a blank.
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* A stamp's `n` is WHICH STAGE it is, not how many of anything, so
          printing it drew "3" on the Explorer stamp and read as a threshold
          nobody could act on. The stage is already named underneath the tile;
          what the disc should carry is the seal. */}
      {s.rule.kind === 'stamp' || s.rule.kind === 'sorted' ? (
        <Seal size={size * 0.62} ink={ink} />
      ) : isFirst ? (
        <Star size={size * 0.5} fill={earned ? '#fff' : 'none'} stroke={ink} />
      ) : (
        <>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: n >= 100 ? size * 0.3 : size * 0.38,
            color: ink, lineHeight: 1, letterSpacing: '-0.02em',
          }}>
            {n}
          </span>
          <Star size={size * 0.2} fill={earned ? '#fff' : 'none'} stroke={ink} />
        </>
      )}
    </div>
  )
}
