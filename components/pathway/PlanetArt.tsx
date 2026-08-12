// The planets themselves.
//
// ── WHY THESE ARE DRAWN HERE AND NOT RENDERED ───────────────────────────────
//
// The Planet Friends the CHILD meets are generated art on the CDN, and that is
// right for them: they are characters, a child is meant to like them, and a
// flat vector cannot do a face. These are not characters. They are six signs
// for six parts of the app, seen for two seconds each by a grown up deciding
// whether to tap.
//
// So they are SVG, and the reasons are practical rather than aesthetic. They
// sit directly under the pathway road, which is already the heaviest thing on
// the page, and six CDN images would either load late (the card pops in after
// the road has settled, which is the exact jank Justin reported on Home) or all
// six load at once for one that shows. They are sharp on any screen at any
// size. They carry the house palette as literal values rather than an
// approximation baked into a render. And swapping any one of them for real art
// later is a one line change in lib/pathway/planets.ts, because the card asks
// this file for a drawing rather than holding one.
//
// ── ONE BODY, SIX MOTIFS ────────────────────────────────────────────────────
//
// Every planet is the same sphere with the same ring at the same tilt, and only
// the colour and the little badge change. That is deliberate: a set that varies
// in one dimension reads as a set. Vary the silhouette too and it reads as six
// clip art icons that happen to be near each other.
//
// The ring is drawn twice, once behind the body and once in front of it, which
// is the whole trick that makes a flat circle look like a planet.

const MOTIFS: Record<string, React.ReactNode> = {
  // A calendar: a page with a header bar and a marked day.
  school: (
    <g>
      <rect x="-7" y="-7.5" width="14" height="14" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path d="M-7 -3 H7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M-3.6 -7.5 V-10 M3.6 -7.5 V-10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="0" cy="1.8" r="2" fill="currentColor" />
    </g>
  ),
  // A star, the same five point shape the whole star economy uses.
  quests: (
    <path
      d="M0 -8.4 L2.4 -2.6 L8.6 -2.1 L3.9 2 L5.3 8.1 L0 4.8 L-5.3 8.1 L-3.9 2 L-8.6 -2.1 L-2.4 -2.6 Z"
      fill="currentColor"
    />
  ),
  // A speech bubble with its tail, which is what DiGi is.
  digi: (
    <g>
      <rect x="-8" y="-7" width="16" height="11.5" rx="4" fill="currentColor" />
      <path d="M-2.6 4.5 L-3.4 9 L2.2 4.5 Z" fill="currentColor" />
    </g>
  ),
  // An open book: two pages either side of a spine.
  learning: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <path d="M0 -4.6 C-2.4 -7 -5.4 -7.4 -8 -7 V5.6 C-5.4 5.2 -2.4 5.6 0 8" />
      <path d="M0 -4.6 C2.4 -7 5.4 -7.4 8 -7 V5.6 C5.4 5.2 2.4 5.6 0 8" />
    </g>
  ),
  // Opening quote marks: the words, before you have said them.
  scripts: (
    <g fill="currentColor">
      <path d="M-8 4.4 C-8 -0.6 -6 -4.4 -2.2 -6 L-1 -3.4 C-3.4 -2.2 -4.6 -0.4 -4.6 1.6 H-1.6 V6.6 H-8 Z" />
      <path d="M1.6 4.4 C1.6 -0.6 3.6 -4.4 7.4 -6 L8.6 -3.4 C6.2 -2.2 5 -0.4 5 1.6 H8 V6.6 H1.6 Z" />
    </g>
  ),
  // An hourglass: time, which is what the balance page is actually about.
  balance: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-6 -8 H6 M-6 8 H6" />
      <path d="M-5 -8 C-5 -2.6 0 -1 0 0 C0 1 -5 2.6 -5 8" />
      <path d="M5 -8 C5 -2.6 0 -1 0 0 C0 1 5 2.6 5 8" />
    </g>
  ),
}

export default function PlanetArt({
  motif, body, ring, tint, size = 92, alt,
}: {
  /** Which badge sits beside the planet. Keys match lib/pathway/planets.ts. */
  motif: string
  body: string
  ring: string
  tint: string
  size?: number
  /** Read out in place of the drawing. */
  alt: string
}) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      role="img" aria-label={alt}
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* The soft disc it sits on, so the planet has somewhere to be. */}
      <circle cx="50" cy="50" r="49" fill={tint} />

      {/* Three sparks, because a planet with nothing around it is a ball. */}
      <g fill={ring} opacity="0.42">
        <path d="M18 22 l1.7 4.1 4.1 1.7 -4.1 1.7 -1.7 4.1 -1.7 -4.1 -4.1 -1.7 4.1 -1.7 Z" />
        <path d="M82 62 l1.3 3.1 3.1 1.3 -3.1 1.3 -1.3 3.1 -1.3 -3.1 -3.1 -1.3 3.1 -1.3 Z" />
        <circle cx="76" cy="20" r="2" />
      </g>

      {/* The ring, behind. */}
      <g transform="rotate(-18 50 50)">
        <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke={ring} strokeWidth="4.5" opacity="0.75" />
      </g>

      {/* The body, with a shaded crescent and a gloss, which is all a sphere is. */}
      <circle cx="50" cy="50" r="27" fill={body} />
      <path
        d="M50 23 a27 27 0 0 1 0 54 a27 27 0 0 0 0 -54 Z"
        fill="#000" opacity="0.10"
      />
      <ellipse cx="40" cy="38" rx="10.5" ry="7.5" transform="rotate(-28 40 38)" fill="#fff" opacity="0.38" />

      {/* The ring, in front. Same ellipse, bottom half only. */}
      <g transform="rotate(-18 50 50)">
        <path d="M10 50 A40 12 0 0 0 90 50" fill="none" stroke={ring} strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* The badge: a white moon carrying the sign for whatever this is. */}
      <g transform="translate(76 76)">
        <circle r="17" fill="#fff" />
        <circle r="17" fill="none" stroke={ring} strokeWidth="2.5" />
        <g style={{ color: ring }}>{MOTIFS[motif] ?? MOTIFS.quests}</g>
      </g>
    </svg>
  )
}
