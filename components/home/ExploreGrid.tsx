import Link from 'next/link'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

// See everything we do: the whole platform as big friendly icons, grouped the
// Strava way (mono eyebrow sections) with Moonly's three column grid of one
// concept tiles. Every tile links to a page or anchor that already exists,
// nothing invented. Butter and ink only, big tap targets, quiet under the one
// next action above it.

type Tile = {
  href: string
  label: string
  sub: string
  /** The drawn icon, from the happy news set the child app uses. */
  icon?: HappyIconName
  /** Kept only where none of the 28 drawn icons says the thing. */
  emoji?: string
}

type Group = {
  eyebrow: string
  tiles: Tile[]
  /** The plate behind the icon, the section's pale tint. */
  plate: string
}

function groups(scriptHref: string): Group[] {
  return [
    {
      eyebrow: 'Every day',
      plate: '#FBEEDF',
      tiles: [
        { href: '/dashboard/moments', label: 'Moments', sub: 'The words for any battle', icon: 'tell' },
        { href: scriptHref, label: 'Tonight’s script', sub: 'Picked for you today', icon: 'read' },
        { href: '/dashboard/scripts', label: 'Rehearsals', sub: 'Practise the words with DiGi', icon: 'quiz' },
        { href: '/dashboard/checkin', label: 'Check in', sub: 'Thirty seconds on the worry', icon: 'heart' },
      ],
    },
    {
      eyebrow: 'Learn',
      plate: '#FBE7EC',
      tiles: [
        { href: '/dashboard/lessons', label: 'Lessons', sub: 'Watch together, five minutes', icon: 'lessons' },
        { href: '/dashboard/printables', label: 'Printables', sub: 'The offline pathway', icon: 'print' },
        { href: '/dashboard/quests/play', label: 'Learning games', sub: 'Play and earn stars', icon: 'games' },
        // The watch together films had one inbound link and a 1 in 12 rotation
        // slot, which is a page that exists only for families who get lucky.
        { href: '/dashboard/guide', label: 'The guide', sub: 'Short films to watch together', emoji: '📺' },
        // The decoder needs a door or it does not exist. It sits under Learn
        // rather than Family because a parent looking for it is looking for
        // help with the work, not with the week.
        { href: '/dashboard/homework', label: 'Homework', sub: 'What is it actually asking for', icon: 'homework' },
        // The front door for the curriculum data. Everything else built on
        // those 448 objectives was reachable only if you already knew it
        // existed, which is why the data looked like it did nothing.
        { href: '/dashboard/learning', label: 'At school', sub: 'What their class is learning now', icon: 'maths' },
      ],
    },
    {
      eyebrow: 'Family',
      plate: 'var(--tint-green)',
      tiles: [
        { href: '/dashboard/quests', label: 'Family quests', sub: 'Jobs earn stars', icon: 'jobs' },
        { href: '/dashboard/quests/timer', label: 'Screen timer', sub: 'Stars buy the minutes', icon: 'time' },
        { href: '/dashboard/agreement', label: 'Our family deal', sub: 'Signed by everyone', icon: 'deal' },
        // Named for what a parent goes looking for. School tasks is our word
        // for it, school reminders is theirs, and this tile was unfindable
        // because it answered a question nobody asks in those words.
        { href: '/dashboard/school', label: 'School reminders', sub: 'PE kit, library day, trips', icon: 'bag' },
        // Devices had three rotation slots and no tile anywhere, so between
        // rotation days the whole setup guide layer was unreachable by intent.
        { href: '/dashboard/devices', label: 'Devices', sub: 'Every screen, set up right', icon: 'phonebed' },
        // ── THE SHOP, PUT BACK (9 September 2026) ──────────────────────────
        //
        // Justin: "the shop we had for passport has disappeared from the
        // parents app." It had.
        //
        // Home used to carry five tiles and they were removed on 12 August on
        // the argument that everything they held was covered elsewhere: quests,
        // passport and DiGi are three of the six buttons on the tab bar, and
        // school reminders is four rows above this one.
        //
        // That was true of four of the five. The shop has no tab bar button and
        // was never added here, so it went from one tap on Home to no route at
        // all except the Keepsakes shortcut buried on the Quests page and a
        // deep link to one product inside the passport. A page that sells the
        // printed passport should not be reachable only from a link that
        // already names the thing you are buying.
        { href: '/dashboard/keepsakes', label: 'The shop', sub: 'The passport and stickers, printed', icon: 'passport' },
        // Vetted outside tools, evidence graded. One inbound link before this,
        // from a report block most families never open.
        { href: '/dashboard/toolbox', label: 'The toolbox', sub: 'Outside tools, graded honestly', emoji: '🧰' },
      ],
    },
    {
      eyebrow: 'DiGi and reports',
      plate: 'var(--tint-blue)',
      tiles: [
        { href: '/dashboard/digi', label: 'Ask DiGi', sub: 'Knows your whole setup', icon: 'ask' },
        // The payoff page of the whole measurement spine, which until now had
        // no door of its own: only a conditional link on the pathway and the
        // Sunday email. The one page that shows the numbers moving should not
        // depend on luck to be found.
        { href: '/dashboard/what-is-working', label: 'What is working', sub: 'Each worry, and how it has moved', icon: 'sprout' },
        { href: '/dashboard/stats', label: 'Screen balance', sub: 'Hours, and the weekly swing', icon: 'balance' },
        // Sub reworded from "What is actually working" so the new tile above
        // and this one stop describing themselves in the same sentence.
        { href: '/dashboard/insights', label: 'DiGi insights', sub: 'Patterns DiGi has noticed', emoji: '🔍' },
        { href: '/dashboard/week', label: 'Weekly round up', sub: 'Your week, read back', icon: 'calendar' },
        { href: '/dashboard#turn-on-check-ins', label: 'Reminders', sub: 'Gentle nudges for you both', icon: 'hand' },
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
      plate: '#F1ECFB',
      tiles: [
        { href: '/dashboard/settings', label: 'Settings', sub: 'Your account and your plan', emoji: '⚙️' },
        { href: '/dashboard/settings#children', label: 'Your children', sub: 'Names, ages and birthdays', icon: 'friends' },
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
                  border: '2px solid var(--ink)', borderRadius: '16px',
                  padding: '13px 6px 11px', boxShadow: '0 4px 0 var(--ink)',
                }}
              >
                <span style={{
                  width: 58, height: 58, borderRadius: '13px', background: g.plate,
                  border: '2px solid var(--ink)', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', flexShrink: 0,
                }}>
                  {t.icon
                    ? <HappyIcon name={t.icon} size={38} />
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
