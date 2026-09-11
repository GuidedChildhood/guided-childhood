import Link from 'next/link'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

// ── ONE TAP, NOT ONE SCROLL ────────────────────────────────────────────────
//
// Justin, 11 September 2026: "cant be a long scroll... so not a massive long
// scroll but behind icons if needed."
//
// Home had grown to around forty top level blocks, and the way it offered a
// destination was to put a card in the column. Six destinations meant six
// cards and six screens of scrolling, and the one a parent actually wanted
// was wherever it happened to sit that day.
//
// ── THE REFERENCE ──────────────────────────────────────────────────────────
//
// Pulled from Mobbin before drawing, per the house rule. Revolut Business and
// Jobber both solve exactly this: a hero, then ONE row of circular icon
// actions ending in More, and every destination is a tap from the top of the
// screen instead of a place in a list. Apple's own Health app is the same
// idea with Browse: a summary that never grows, and a door to everything
// else.
//
// It sits directly under the day's path, which is deliberate. The path is the
// thing to do; this is the thing to go to. Nothing above it moves.
//
// ── WHY FIVE, AND WHY THESE FIVE ───────────────────────────────────────────
//
// Five is what fits at 390px with a readable label under each circle, which
// is the width that matters: this is a phone screen with one hand on it. Six
// would fit only by shrinking the label into something a tired parent has to
// squint at.
//
// The four named ones are the four places a parent goes on purpose rather
// than because they were sent: a moment that happened, the words for it, DiGi
// to ask, the passport to see where they are. More is the door to the rest,
// which is HomeMain, the full menu, already built.

type Shortcut = { key: string; icon: HappyIconName; label: string; href: string }

export const SHORTCUTS: Shortcut[] = [
  { key: 'moments', icon: 'heart', label: 'Moments', href: '/dashboard/moments' },
  { key: 'scripts', icon: 'tell', label: 'Scripts', href: '/dashboard/scripts' },
  { key: 'digi', icon: 'ask', label: 'Ask DiGi', href: '/dashboard/digi' },
  { key: 'passport', icon: 'passport', label: 'Passport', href: '/dashboard/pathway' },
  // Not a page of its own: the full menu is already on this screen, further
  // down, so More jumps to it rather than making a parent load anything.
  // The palette rather than the school bag: at 30px the bag's clasp reads as
  // a padlock, and a locked looking door to the rest of the product is the
  // exact wrong message.
  { key: 'more', icon: 'make', label: 'More', href: '#dash-explore' },
]

export default function HomeShortcuts({ childId = null }: { childId?: string | null }) {
  const withChild = (href: string) =>
    childId && !href.startsWith('#') ? `${href}${href.includes('?') ? '&' : '?'}child=${childId}` : href
  return (
    <nav
      aria-label="Go to"
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px',
        marginBottom: '20px',
      }}
    >
      {SHORTCUTS.map(s => (
        <Link
          key={s.key}
          href={withChild(s.href)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            textDecoration: 'none', minWidth: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <HappyIcon name={s.icon} size={30} />
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--ink)', lineHeight: 1.15, textAlign: 'center',
            // One word each, so nothing wraps and nothing is cut off.
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
          }}>
            {s.label}
          </span>
        </Link>
      ))}
    </nav>
  )
}
