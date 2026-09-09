// The worries a parent picks, drawn in the Happy Newspaper hand.
//
// ── WHY THEY WERE REDRAWN ───────────────────────────────────────────────────
//
// Justin, 9 September 2026, with the Happy Newspaper board beside the live
// quiz: "really needs better likeness to icons on happy news."
//
// He is right, and the gap was structural rather than a matter of taste. The
// first set was a thin monochrome line set: 2px stroke, no fill, one colour
// inherited from the tile. That is the Feather and Lucide hand, which reads as
// competent software. The Happy Newspaper hand is the opposite in every
// decision that matters:
//
//   FILLED, not hollow.        Bright shape first, outline second.
//   OUTLINED IN INK.           Every shape carries a dark edge, like a print.
//   MULTI COLOUR IN ONE ICON.  Two or three house colours per drawing.
//   SLIGHTLY WONKY.            Nothing is on a perfect axis or a true circle.
//   WARM, NEVER CLINICAL.      A face has cheeks. A phone has a bright screen.
//
// So these are drawn as filled shapes with a 1.5 ink outline, tinted from the
// house tokens, on the same 24 grid as before. Every name, prop and call site
// is unchanged, so the quiz, the wizard and the reveal pick this up without
// edits.
//
// ── WHAT IS DELIBERATELY KEPT ───────────────────────────────────────────────
//
// The rule from the original teardown still holds and is the reason these read
// at 26px on a phone: the icon shows the SITUATION, not the object. Bedtime
// screens is a moon over a lit screen, not a phone. Mood after screens is a
// face, not a graph. A parent scanning ten tiles recognises their own evening
// faster from a scene than from a noun.
//
// Kept out of KidIcon because these are a parent's words about a hard evening
// and that set is a child's reward loop. Two audiences, two sets.

export type WorryIconName =
  | 'wont_put_down' | 'bedtime_screens' | 'mood_after_screens'
  | 'controller_fights' | 'morning_tv' | 'asking_for_phone'
  | 'social_media' | 'ai_chatbots' | 'seen_something' | 'something_else'

/** The house colours these are drawn from. Hex rather than var() because an
 *  SVG fill inside a tinted plate must not inherit the plate, and because a
 *  drawing is a fixed thing: it should look the same wherever it is placed. */
const INK = '#1A1A2E'
const BUTTER = '#EDC35F'
const SKY = '#BAE6FD'
const CORAL = '#FECDD3'
const PINK = '#FBCFE8'
const LILAC = '#DDD6FE'
const MINT = '#A7E8C8'
const CREAM = '#FFFBEE'

export default function WorryIcon({
  name, size = 26, color,
}: {
  name: WorryIconName
  size?: number
  /** Legacy prop from the line icon set. Ignored: these carry their own
   *  colour now. Kept so existing call sites keep compiling. */
  color?: string
}) {
  void color

  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: INK, strokeWidth: 1.5,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    // A bright slab, gripped. The hand is the worry, not the tablet.
    case 'wont_put_down':
      return (
        <svg {...common}>
          <rect x="7.5" y="2.4" width="9.6" height="13.4" rx="2.2" fill={SKY} transform="rotate(-4 12 9)" />
          <rect x="9.4" y="4.6" width="5.8" height="8.6" rx="1.1" fill={CREAM} stroke="none" transform="rotate(-4 12 9)" />
          <path d="M5 14.2v3.4c0 2.2 1.8 4 4 4h4.8" fill={BUTTER} />
          <path d="M5 16.4h2.7" />
        </svg>
      )
    // A moon, and a screen still glowing under the covers.
    case 'bedtime_screens':
      return (
        <svg {...common}>
          <path d="M20 12.2A6.6 6.6 0 0 1 11.6 3.8a7.1 7.1 0 1 0 8.4 8.4z" fill={BUTTER} />
          <rect x="3.4" y="16" width="9.8" height="6" rx="1.8" fill={SKY} transform="rotate(3 8.3 19)" />
          <path d="M6 18.8h4.4" />
        </svg>
      )
    // A face that has had enough, with the little cloud still over it.
    case 'mood_after_screens':
      return (
        <svg {...common}>
          <circle cx="12" cy="14" r="7.4" fill={BUTTER} />
          <circle cx="9.3" cy="12.6" r="0.85" fill={INK} stroke="none" />
          <circle cx="14.7" cy="12.6" r="0.85" fill={INK} stroke="none" />
          <path d="M9.3 17.6c1.6-1.5 3.8-1.5 5.4 0" />
          <path d="M5.4 5.2c1.3-1.4 3.4-1.2 4.4.3" fill={LILAC} />
        </svg>
      )
    // A controller, and the spark of the row it caused.
    case 'controller_fights':
      return (
        <svg {...common}>
          <path d="M7.6 9.4h8.8a4.6 4.6 0 0 1 4.6 4.6v.6a3.5 3.5 0 0 1-6.4 2l-.5-.9H10l-.5.9a3.5 3.5 0 0 1-6.4-2V14a4.6 4.6 0 0 1 4.5-4.6z" fill={MINT} />
          <path d="M7 12.8v1.8M6 13.7h2" />
          <circle cx="16.4" cy="13" r="1.05" fill={INK} stroke="none" />
          <path d="M13.4 2.2l-2.2 3.4h2.9l-2.1 3.2" fill={BUTTER} />
        </svg>
      )
    // A screen on, and the sun only just up behind it.
    case 'morning_tv':
      return (
        <svg {...common}>
          <circle cx="18.4" cy="6.2" r="3.1" fill={BUTTER} />
          <rect x="2.6" y="8.6" width="17.4" height="10.8" rx="2.4" fill={SKY} transform="rotate(-2 11.3 14)" />
          <path d="M8.6 22h6.8" />
          <path d="M8.8 15.2a3.2 3.2 0 0 1 6.2 0" fill={CREAM} stroke="none" />
        </svg>
      )
    // A phone held up, and the question that comes with it.
    case 'asking_for_phone':
      return (
        <svg {...common}>
          <rect x="5.6" y="6.2" width="9.4" height="15.6" rx="2.3" fill={CORAL} transform="rotate(-5 10.3 14)" />
          <rect x="7.4" y="8.4" width="5.8" height="9.4" rx="1" fill={CREAM} stroke="none" transform="rotate(-5 10.3 13)" />
          <path d="M17.6 2.9a2 2 0 0 1 1.8 3.1c-.5.9-1.5 1.1-1.5 2.2" fill={BUTTER} />
          <circle cx="17.8" cy="11.1" r="0.8" fill={INK} stroke="none" />
        </svg>
      )
    // A feed card with a heart on it. The counting is the worry.
    case 'social_media':
      return (
        <svg {...common}>
          <rect x="3" y="4.2" width="18" height="15.6" rx="2.8" fill={PINK} transform="rotate(-2 12 12)" />
          <path d="M3.4 9.2h17.4" />
          <path d="M12 17.6s-3.4-2.1-3.4-4.5a1.95 1.95 0 0 1 3.4-1.3 1.95 1.95 0 0 1 3.4 1.3c0 2.4-3.4 4.5-3.4 4.5z" fill={CREAM} />
          <circle cx="6.2" cy="6.7" r="0.75" fill={INK} stroke="none" />
          <circle cx="8.7" cy="6.7" r="0.75" fill={INK} stroke="none" />
        </svg>
      )
    // A friendly machine, talking back.
    case 'ai_chatbots':
      return (
        <svg {...common}>
          <circle cx="12" cy="2.9" r="1.4" fill={BUTTER} />
          <path d="M12 4.3v3.1" />
          <rect x="3.2" y="7.4" width="17.6" height="11.8" rx="3.2" fill={LILAC} transform="rotate(2 12 13)" />
          <circle cx="9" cy="12.6" r="1.05" fill={INK} stroke="none" />
          <circle cx="15" cy="12.6" r="1.05" fill={INK} stroke="none" />
          <path d="M9.7 16.1h4.6" />
          <path d="M3.2 12.6H1.7M22.3 12.6h-1.5" />
        </svg>
      )
    // An eye, wide open, with an alarm beside it. Deliberately NOT the eye
    // with a line through it: that is the universal mark for hidden, and the
    // worry here is the opposite, that they saw it.
    case 'seen_something':
      return (
        <svg {...common}>
          <path d="M1.9 13.4S5.4 7.7 10.9 7.7s9 5.7 9 5.7-3.5 5.7-9 5.7-9-5.7-9-5.7z" fill={CORAL} />
          <circle cx="10.9" cy="13.4" r="2.9" fill={CREAM} />
          <circle cx="10.9" cy="13.4" r="1.15" fill={INK} stroke="none" />
          <path d="M20.4 2.6v3.9" stroke={INK} />
          <circle cx="20.4" cy="8.6" r="0.85" fill={BUTTER} />
        </svg>
      )
    // Something else: the parent's own words, waiting to be said. The one
    // tile where the drawing is an invitation rather than a situation.
    case 'something_else':
    default:
      return (
        <svg {...common}>
          <path d="M20.8 14.4a2.5 2.5 0 0 1-2.5 2.5H8.4L3.8 20.9V5.9a2.5 2.5 0 0 1 2.5-2.5h12a2.5 2.5 0 0 1 2.5 2.5z" fill={MINT} transform="rotate(-2 12 12)" />
          <circle cx="8.6" cy="10.2" r="0.85" fill={INK} stroke="none" />
          <circle cx="12.1" cy="10.2" r="0.85" fill={INK} stroke="none" />
          <circle cx="15.6" cy="10.2" r="0.85" fill={INK} stroke="none" />
        </svg>
      )
  }
}
