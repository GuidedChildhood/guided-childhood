import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'
import SectionTiles, { type SectionTile } from '@/components/ui/SectionTiles'
import type { BoardStatus } from '@/lib/quests/board-status'

// The top of the Quests page: the four places a parent actually goes, as flat
// coloured tiles. Built the way the calmest parent apps do a browse grid (Good
// Inside's Discover): one solid colour per tile, a real drawn icon rather than
// an emoji, a bold title and one short line under it saying what happens.
//
// This replaces the pair of buttons that used to sit at the very top. Two
// buttons could not hold the four real destinations, so the extras were buried
// further down the page where nobody found them.
//
// The tiles carry live state now. Eight labels with no state filled the first
// screen of the page and told a parent nothing: whether anything needed them at
// all took scrolling through thirty six sections to find out. A tile with a
// number is a job to do, a tile without one is quietly done, which is how
// GoHenry and Greenlight both open. Only the tiles with a real outstanding
// action get a badge; inventing one so that every tile has something is how a
// parent learns the numbers do not mean anything.

type Tile = {
  href: string
  label: string
  sub: string
  icon: KidIconName
  bg: string
  iconBg: string
  /** The icon's own colour, so eight tiles read as eight places. */
  iconColor: string
  /** Reads the live status into the badge, or null for a tile with no state. */
  badge?: (s: BoardStatus) => string | null
  /** Notification red, for the one count with a person waiting behind it. */
  badgeTone?: 'quiet' | 'alert'
}

const TILES: Tile[] = [
  {
    // Its own page now, not a scroll target.
    //
    // This was '#my-todo', so pressing Manage jobs scrolled the parent down a
    // long Quests page to a panel that then had a Close button on it. Justin
    // twice: "it should clearly goto a new page not scroll". A thing you
    // navigate to should be somewhere you have gone.
    // Named for the thing a parent came to do.
    //
    // "Manage jobs" is the maintenance word, and adding one is not maintenance,
    // it is the single most used action on this board. A parent with a job in
    // their head scans eight tiles for the word they are thinking, and the word
    // they are thinking is add.
    href: '/dashboard/quests/manage', label: 'Add a job', sub: 'Add, agree and send',
    icon: 'jobs', bg: 'var(--terracotta-lt)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#C0603A',
    // The one red count on the board. A ticked job is a child standing there
    // with the stars not yet theirs, which is the only thing on this page with
    // a person waiting on the other end of the number. Bare count, no word:
    // this badge shares its row with the icon on a half width tile, and the
    // red is already saying what kind of thing it is.
    badge: s => s.ticksToConfirm > 0 ? `${s.ticksToConfirm}` : null,
    badgeTone: 'alert',
  },
  {
    // The star chart is the starter pack, the one printable every family uses,
    // and it was two taps down inside Printables where a parent had to know it
    // existed to find it. It sits next to Manage jobs, in the same terracotta,
    // because they are one idea in two places: the jobs on the screen and the
    // same jobs on the fridge.
    href: '/dashboard/printables/star-chart', label: 'Build your star chart', sub: 'Type the jobs, then print it',
    icon: 'star', bg: 'var(--terracotta-lt)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#B8860B',
    // Real, since migration 117: the print button writes a row, so this is a
    // fact rather than a guess. Goes quiet on the first print and stays quiet,
    // because a reprint is a nice to have, never a chase.
    //
    // "To print", not "Not printed yet". These tiles are half a phone screen
    // wide and the badge shares its row with the icon, so fifteen characters
    // clipped to "Not prin...", which tells a parent nothing at all. Same
    // shape as the devices tile's "To set up", and it fits.
    badge: s => s.starChartPrinted ? null : 'To print',
  },
  {
    href: '/dashboard/printables', label: 'Printables', sub: 'Every other sheet',
    icon: 'printables', bg: 'var(--tint-blue)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#2E6F8E',
    badge: s => s.printablesToConfirm > 0 ? `${s.printablesToConfirm} waiting` : null,
  },
  {
    href: '/dashboard/quests/play', label: 'Learning games', sub: 'Play and earn stars',
    icon: 'games', bg: 'var(--tint-green)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#7A5CC0',
  },
  {
    href: '/dashboard/quests/deal', label: 'Our family deal', sub: 'Print it for the fridge',
    icon: 'deal', bg: 'var(--tint-sage)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#2F8F6B',
    badge: s => s.agreementSigned ? null : 'Not made',
  },
  {
    // Lessons had no way in from here at all, which is how a whole strand of
    // the product goes quiet: jobs and stars are the daily loop a parent opens
    // this board for, and the learning is the thing the loop is FOR. A board
    // that offers games but not lessons quietly says which one matters.
    href: '/dashboard/lessons', label: 'Lessons', sub: 'Watch together, pass the stage',
    icon: 'lessons', bg: 'var(--tint-amber)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#A8475C',
  },
  {
    // The keepsake shop had no way in from here: it sat behind the passport and
    // the sticker book, so a parent who never opened those never found it. It
    // is the physical end of the same pathway, the star chart and the Planet
    // Friends as things you can hold, so it earns a tile of its own.
    href: '/dashboard/keepsakes', label: 'Keepsakes', sub: 'Rewards you can hold',
    icon: 'keepsakes', bg: 'var(--terracotta-lt)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#D4600A',
    // Stars banked and not yet spent, across every child. A balance rather
    // than a queue, but it is still something owed: the child has earned these
    // and not been given anything for them. It falls as rewards are taken.
    badge: s => s.starsToSpend > 0 ? `${s.starsToSpend} stars` : null,
  },
  {
    // School reminders had a page and effectively no door. It sat in the Explore
    // grid far down Home labelled School tasks, which is not the words a parent
    // searches for, so the honest answer to where are the school reminders was
    // nowhere findable. It belongs here: a school reminder is a job the week
    // puts on the family, which is exactly what this board is for.
    href: '/dashboard/school', label: 'School reminders', sub: 'PE kit, library day, trips',
    icon: 'jobs', bg: 'var(--tint-green)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#1F6F8B',
    badge: s => s.schoolOpen > 0 ? `${s.schoolOpen} open` : null,
  },
]

// Same outlined tile as the passport page now, so the two read as one product.
// The flat fill with no edge was the softest thing on either page.
const ACCENT: Record<string, string> = {
  'var(--terracotta-lt)': 'var(--terracotta)',
  'var(--tint-blue)': '#A9C8E4',
  'var(--tint-green)': '#9CC3B4',
  'var(--tint-sage)': '#9CC3B4',
  'var(--tint-amber)': '#D6BE8A',
}

export default function QuestShortcuts({ status }: { status?: BoardStatus }) {
  const tiles: SectionTile[] = TILES.map(t => {
    const badge = status && t.badge ? t.badge(status) : null
    return {
      href: t.href, label: t.label, sub: t.sub,
      icon: <KidIcon name={t.icon} size={23} />,
      bg: t.bg, accent: ACCENT[t.bg] ?? 'var(--border)', iconColor: t.iconColor,
      ...(badge ? { badge, badgeTone: t.badgeTone ?? 'quiet' } : {}),
    }
  })
  return <SectionTiles tiles={tiles} />
}
