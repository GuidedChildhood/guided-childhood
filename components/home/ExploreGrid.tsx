import Link from 'next/link'
import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'

// See everything we do: the whole platform as big friendly icons, grouped the
// Strava way (mono eyebrow sections) with Moonly's three column grid of one
// concept tiles. Every tile links to a page or anchor that already exists,
// nothing invented. Butter and ink only, big tap targets, quiet under the one
// next action above it.

type Tile = {
  href: string
  label: string
  sub: string
  icon?: KidIconName
  emoji?: string
}

type Group = {
  eyebrow: string
  tiles: Tile[]
  /** The drawn icon's colour for this section. */
  ink: string
  /** The plate behind it, a pale relative of ink. */
  plate: string
}

function groups(scriptHref: string): Group[] {
  return [
    {
      eyebrow: 'Every day',
      ink: '#C0603A', plate: '#FBEEDF',
      tiles: [
        { href: '/dashboard/moments', label: 'Moments', sub: 'The words for any battle', emoji: '⚡' },
        { href: scriptHref, label: 'Tonight’s script', sub: 'Picked for you today', emoji: '💬' },
        { href: '/dashboard/scripts', label: 'Rehearsals', sub: 'Practise the words with DiGi', emoji: '🎭' },
        { href: '/dashboard/daily#checkin', label: 'Check in', sub: 'Thirty seconds on the worry', emoji: '🪴' },
      ],
    },
    {
      eyebrow: 'Learn',
      ink: '#A8475C', plate: '#FBE7EC',
      tiles: [
        { href: '/dashboard/lessons', label: 'Lessons', sub: 'Watch together, five minutes', icon: 'lessons' },
        { href: '/dashboard/printables', label: 'Printables', sub: 'The offline pathway', icon: 'printables' },
        { href: '/dashboard/quests/play', label: 'Learning games', sub: 'Play and earn stars', icon: 'games' },
        // The decoder needs a door or it does not exist. It sits under Learn
        // rather than Family because a parent looking for it is looking for
        // help with the work, not with the week.
        { href: '/dashboard/homework', label: 'Homework', sub: 'What is it actually asking for', emoji: '📐' },
        // The front door for the curriculum data. Everything else built on
        // those 448 objectives was reachable only if you already knew it
        // existed, which is why the data looked like it did nothing.
        { href: '/dashboard/learning', label: 'At school', sub: 'What their class is learning now', emoji: '🎒' },
      ],
    },
    {
      eyebrow: 'Family',
      ink: '#2F8F6B', plate: 'var(--tint-green)',
      tiles: [
        { href: '/dashboard/quests', label: 'Family quests', sub: 'Jobs earn stars', icon: 'jobs' },
        { href: '/dashboard/quests#screen-time', label: 'Screen timer', sub: 'Stars buy the minutes', icon: 'time' },
        { href: '/dashboard/agreement', label: 'Our family deal', sub: 'Signed by everyone', icon: 'deal' },
        // Named for what a parent goes looking for. School tasks is our word
        // for it, school reminders is theirs, and this tile was unfindable
        // because it answered a question nobody asks in those words.
        { href: '/dashboard/school', label: 'School reminders', sub: 'PE kit, library day, trips', emoji: '🎒' },
      ],
    },
    {
      eyebrow: 'DiGi and reports',
      ink: '#2E6F8E', plate: 'var(--tint-blue)',
      tiles: [
        { href: '/dashboard/digi', label: 'Ask DiGi', sub: 'Knows your whole setup', emoji: '⭐' },
        { href: '/dashboard/insights', label: 'DiGi insights', sub: 'What is actually working', emoji: '🔍' },
        { href: '/dashboard/week', label: 'Weekly round up', sub: 'Your week, read back', emoji: '🗞️' },
        { href: '/dashboard#turn-on-check-ins', label: 'Reminders', sub: 'Gentle nudges for you both', emoji: '🔔' },
      ],
    },
    {
      // The account, which had NO door on a phone at all.
      //
      // The only navigation link to Settings lives in the desktop header, which
      // is display:none below 768px, and the tab bar is six other places. So on
      // the device almost every parent actually uses, there was no way to reach
      // your child's birthday, your plan, or sign out. You could only arrive by
      // being sent from a page that happened to mention it.
      //
      // Justin asked where it was twice, which is the whole answer: if the
      // person who built it cannot find it on his own phone, nobody can.
      eyebrow: 'Your account',
      ink: '#7A5CC0', plate: '#F1ECFB',
      tiles: [
        { href: '/dashboard/settings', label: 'Settings', sub: 'Your account and your plan', emoji: '⚙️' },
        { href: '/dashboard/settings#children', label: 'Your children', sub: 'Names, ages and birthdays', emoji: '👧' },
        { href: '/dashboard/settings#sign-out', label: 'Sign out', sub: 'On this device', emoji: '🚪' },
      ],
    },
  ]
}

export default function ExploreGrid({ scriptHref = '/dashboard/scripts' }: { scriptHref?: string }) {
  return (
    <div>
      {groups(scriptHref).map(g => (
        <div key={g.eyebrow} style={{ marginBottom: '18px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px 2px' }}>
            {g.eyebrow}
          </p>
          {/* Same rule as SectionTiles: stretch equalises a card against its
              own row, auto rows at 1fr equalises the rows against each other.
              Without both, a three column grid of nineteen tiles comes out at
              a different height in every row. */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '9px',
            alignItems: 'stretch', gridAutoRows: '1fr',
          }}>
            {g.tiles.map(t => (
              <Link
                key={t.label}
                href={t.href}
                style={{
                  textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', gap: '7px', background: '#fff', height: '100%',
                  // Each section is its own grid, so 1fr rows only equalise
                  // WITHIN a section and the shorter groups still came out
                  // smaller. A floor at the natural tallest makes all nineteen
                  // match, and because it is a minimum it can only ever grow a
                  // tile, never clip one.
                  minHeight: 180,
                  border: '1.5px solid var(--border)', borderRadius: '16px',
                  padding: '13px 6px 11px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
                }}
              >
                <span style={{
                  width: 58, height: 58, borderRadius: '13px', background: g.plate,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', flexShrink: 0,
                }}>
                  {t.icon
                    ? <KidIcon name={t.icon} size={30} color={g.ink} />
                    : <span aria-hidden>{t.emoji}</span>}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.2 }}>
                  {t.label}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.35 }}>
                  {t.sub}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
