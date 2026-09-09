import Link from 'next/link'
import KidIcon from '@/components/kid/KidIcon'
import { type SectionTile } from '@/components/ui/SectionTiles'
import HappyIcon from '@/components/kid/HappyIcon'
import { CRAYON } from '@/components/printables/drawn/crayon'

// The five places a parent actually goes, and one door to everything else.
//
// Home used to carry the whole platform: today's path, then a Keep going grid
// of nine tiles, then an Explore everything grid of sixteen more, then the
// cards. Two grids doing the same job, one under the other, which is most of
// why a parent could not find the star chart or the school reminders. Eighty
// eight render points on one screen.
//
// Mobbin first, per CLAUDE.md. Life Reset, Reminders, Wabi and Evernote all do
// the same thing on iOS: today's one thing at the top, then a small fixed grid
// of four to six destinations, and everything deeper behind a single door.
// None of them list their whole product on Home. This is that shape, in our own
// pastel tiles rather than a copy of any of them.
//
// Today's path stays exactly where it is, above this. These are what comes
// after it, and Everything else carries the rest to its own page.

const TILES: (SectionTile & { key: string })[] = [
  {
    key: 'quests',
    href: '/dashboard/quests', label: 'Family quests', sub: 'Jobs earn stars, stars buy screen time',
    icon: <KidIcon name="jobs" size={23} />,
    bg: 'var(--terracotta-lt)', accent: 'var(--terracotta)',
  },
  {
    key: 'pathway',
    href: '/dashboard/pathway', label: 'Road to sixteen', sub: 'Where they are, and what is next',
    icon: '🗺️',
    bg: 'var(--tint-blue)', accent: '#A9C8E4',
  },
  {
    key: 'digi',
    href: '/dashboard/digi', label: 'Ask DiGi', sub: 'Knows your whole setup, answers at 11pm',
    icon: '◎',
    bg: 'var(--tint-green)', accent: '#9CC3B4',
  },
  {
    key: 'school',
    href: '/dashboard/school', label: 'School reminders', sub: 'PE kit, library day, trips',
    icon: '🎒',
    // Lavender rather than the sage next to it: tint-green and tint-sage share
    // an accent, so DiGi and School read as one colour repeated rather than two
    // different places, which is the exact thing these tiles exist to avoid.
    bg: 'var(--stage-5)', accent: '#B6ADE0',
  },
  {
    key: 'shop',
    href: '/dashboard/keepsakes', label: 'Visit the shop', sub: 'The passport and stickers, printed',
    icon: <KidIcon name="keepsakes" size={23} />,
    bg: 'var(--tint-amber)', accent: '#D6BE8A',
  },
]

// ── THE FIVE TILES ARE GONE (12 August 2026) ────────────────────────────────
//
// Justin: "we wanted a clean up of home page, so if we prompt for everything is
// there each time they log in, we only need to be showing relevant bits. Loads
// of stuff. So of course pathway and the navigation system, but then the tabs
// showing everything."
//
// The tabs already show everything, and that is the whole argument. Three of
// these five tiles went to Quests, Passport and DiGi, which are three of the
// six buttons on the tab bar at the bottom of the screen, permanently visible,
// one tap away, lit when you are on them. A tile that repeats a button already
// on screen is not navigation, it is scroll.
//
// The other two are covered too. School is on Home as its own card, in the what
// next rotation, and as a planet under the pathway.
//
// So what is left is the one thing here that was never duplicated: the door to
// the rest. TILES is kept rather than deleted because it is the record of what
// used to be here and what each thing was called, and reinstating a tile is a
// smaller job than reinventing one.
//
// ── THE SHOP CAME BACK (9 September 2026) ───────────────────────────────────
//
// The paragraph above used to end "the shop lives on /dashboard/explore with
// everything else." That was not true when it was written. The shop was taken
// off Home on 12 August and never added to Explore, so for four weeks it had no
// route at all except a shortcut on the Quests page and the order button inside
// the passport. Adding the missing Explore tile made it reachable, and Justin
// still could not find it, which is the part worth keeping: reachable is not
// the same as findable. The door below is labelled Everything else and lists
// five things, none of them a shop, so a parent hunting for one taps past it.
//
// It is a tile again, and only it. The other four removed tiles really are
// duplicates of tab bar buttons; this is the one with no button anywhere, and
// it is where a family pays us for something physical. One tile above the door
// is not the nine tile grid that was cleaned up.

const SHOP = TILES.find(t => t.key === 'shop')!

export default function HomeMain({ questsBadge: _questsBadge }: { questsBadge?: string | null }) {
  return (
    <>
      {/* The shop, in the same shape as the door below it. See the note above
          TILES. It is deliberately the door's layout rather than a section
          tile: a section tile is built for a grid cell, so on its own at full
          width it puts the icon above the words and leaves half the row empty,
          and next to the door it reads as a second component rather than the
          row above it. Amber plate rather than the door's paper so the two are
          still two places. */}
      <Link
        href={SHOP.href}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#fff', border: '2px solid var(--ink)', borderRadius: 18,
          boxShadow: '0 4px 0 var(--ink)', padding: '12px 16px 12px 12px',
          textDecoration: 'none', marginBottom: 14,
        }}
      >
        <span aria-hidden style={{ width: 52, height: 52, borderRadius: '50%', background: SHOP.bg, border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <KidIcon name="keepsakes" size={30} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15 }}>
            {SHOP.label}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3 }}>
            {SHOP.sub}
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>
          ›
        </span>
      </Link>

      {/* One door, not a grid and not a repeat of the tab bar. Everything the
          platform does is still one tap away, it simply is not all on this
          screen at once. */}
      <Link
        href="/dashboard/explore"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#fff', border: '2px solid var(--ink)', borderRadius: 18,
          boxShadow: '0 4px 0 var(--ink)', padding: '12px 16px 12px 12px',
          textDecoration: 'none', marginBottom: 22,
        }}
      >
        <span aria-hidden style={{ width: 52, height: 52, borderRadius: '50%', background: CRAYON.paper, border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <HappyIcon name="lessons" size={34} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15 }}>
            Everything else
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3 }}>
            Scripts, moments, lessons, printables, reports
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>
          ›
        </span>
      </Link>
    </>
  )
}
