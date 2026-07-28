import Link from 'next/link'
import KidIcon from '@/components/kid/KidIcon'
import SectionTiles, { type SectionTile } from '@/components/ui/SectionTiles'

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

export default function HomeMain({ questsBadge }: { questsBadge?: string | null }) {
  const tiles: SectionTile[] = TILES.map(t => ({
    href: t.href, label: t.label, sub: t.sub, icon: t.icon, bg: t.bg, accent: t.accent,
    ...(t.key === 'quests' && questsBadge ? { badge: questsBadge } : {}),
  }))

  return (
    <>
      <SectionTiles tiles={tiles} />

      {/* One door, not a second grid. Everything the platform does is still one
          tap away, it simply is not all on this screen at once. */}
      <Link
        href="/dashboard/explore"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#fff', border: '2px solid var(--border)', borderRadius: 18,
          boxShadow: '0 4px 0 var(--border)', padding: '15px 18px',
          textDecoration: 'none', marginBottom: 22,
        }}
      >
        <span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18.5, color: 'var(--ink)', lineHeight: 1.15 }}>
            Everything else
          </span>
          <span style={{ display: 'block', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 3 }}>
            Scripts, moments, lessons, printables, reports
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--ink-muted)' }}>
          →
        </span>
      </Link>
    </>
  )
}
