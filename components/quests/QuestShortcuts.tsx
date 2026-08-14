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
  /**
   * Notification red, for a count with a person waiting behind it.
   *
   * A function where one tile's badge can be either. The screen timer says
   * two different things: a child asking is a question waiting on an answer
   * and goes red, a timer merely running is worth knowing and is not a job to
   * do, so it stays quiet. Same tile, same badge slot, two different weights.
   */
  badgeTone?: 'quiet' | 'alert' | ((s: BoardStatus) => 'quiet' | 'alert')
  /**
   * Where the tile goes WHEN IT HAS A BADGE, if that is somewhere else.
   *
   * A badge is a promise that there is something to deal with. Following it has
   * to land on the thing it counted, or the number is decoration. Only set this
   * where the two genuinely differ; every other tile has one destination and
   * the badge is just extra detail about it.
   */
  hrefWithBadge?: string
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
    // The badge and the destination have to be the same thing.
    //
    // Justin: "on quest it says 1 in red on home page, click on it and you get
    // red 6 on jobs, but when you click jobs nothing there to match the 6."
    //
    // He is right and it was this line. The badge counts ticks WAITING TO BE
    // AGREED, the tile is called Add a job, and the link opened the page on its
    // Add a job tab. So a parent followed a red 6 to a form for creating a
    // seventh job, with the six it was counting sitting behind a tab they had
    // not been shown. Three surfaces, three different numbers, and none of them
    // where the number pointed.
    //
    // The page already takes ?tab, so the link now names the tab that HOLDS
    // what the badge counted. With nothing waiting it opens on Add, which is
    // what the tile is called and what a parent with a clear board came for.
    href: '/dashboard/quests/manage', label: 'Add a job', sub: 'Add, agree and send',
    hrefWithBadge: '/dashboard/quests/manage?tab=agree',
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
    // Screen time, as a place you go rather than a card on the board.
    //
    // The timer has had its own page for a while and no tile pointing at it,
    // which is why a card kept having to sit on the Quests page to make it
    // reachable: first full width at the very top, then smaller and further
    // down, and neither was right. Justin, 31 July: it "should be one of those
    // tabs, not taking up quest main page space".
    //
    // The badge carries the only part a parent needs from the board itself. An
    // ask goes red, because a child has asked a person a question and cannot
    // start until it is answered, which is the same test the jobs tile passes.
    // A running timer is worth saying and is not a job to do, so it stays
    // quiet, and an idle house says nothing at all.
    href: '/dashboard/quests/timer', label: 'Screen timer', sub: 'Start it, and watch it together',
    // 'time', not 'star': the star chart tile two along already draws a star,
    // and two tiles wearing the same mark read as the same place.
    icon: 'time', bg: 'var(--tint-blue)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#2E6F8E',
    badge: s => s.timeAsks > 0
      ? `${s.timeAsks} asking`
      : s.timersRunning > 0
        ? `${s.timersRunning} running`
        : null,
    badgeTone: s => s.timeAsks > 0 ? 'alert' : 'quiet',
  },
  {
    // The star chart is the starter pack, the one printable every family uses,
    // and it was two taps down inside Printables where a parent had to know it
    // existed to find it. It sits next to Manage jobs, in the same terracotta,
    // because they are one idea in two places: the jobs on the screen and the
    // same jobs on the fridge.
    href: '/dashboard/printables/star-chart', label: 'Build your star chart', sub: 'Type the jobs, then print it',
    icon: 'star', bg: 'var(--terracotta-lt)', iconBg: 'rgba(255,255,255,0.72)', iconColor: '#B8860B',
    // Two different things this badge can say, and they are not the same
    // question.
    //
    // "To print" is real since migration 117: the print button writes a row, so
    // a family who has never made one is a fact rather than a guess. It goes
    // quiet on the first print and never comes back, because being chased about
    // a thing you have already done is how a badge stops meaning anything.
    //
    // "For Monday" is the weekly rhythm Justin asked for, and only ever appears
    // on a Saturday or Sunday, to a family who already prints the chart, when
    // there is no sheet for the week about to start. See chartWeekDue: the
    // three conditions are all there to keep this an offer rather than a nag.
    //
    // Both are short on purpose. These tiles are half a phone screen wide and
    // the badge shares its row with the icon, so fifteen characters clipped to
    // "Not prin...", which tells a parent nothing at all.
    badge: s => !s.starChartPrinted ? 'To print' : s.chartWeekDue ? 'For Monday' : null,
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
    href: '/dashboard/passport?tab=shop', label: 'Keepsakes', sub: 'Rewards you can hold',
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
      // A badged tile goes where its number lives. See hrefWithBadge.
      href: badge && t.hrefWithBadge ? t.hrefWithBadge : t.href,
      label: t.label, sub: t.sub,
      icon: <KidIcon name={t.icon} size={23} />,
      bg: t.bg, accent: ACCENT[t.bg] ?? 'var(--border)', iconColor: t.iconColor,
      ...(badge ? { badge, badgeTone: typeof t.badgeTone === 'function' ? t.badgeTone(status!) : (t.badgeTone ?? 'quiet') } : {}),
    }
  })
  return <SectionTiles tiles={tiles} />
}
