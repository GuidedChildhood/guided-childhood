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

type Group = { eyebrow: string; tiles: Tile[] }

function groups(scriptHref: string): Group[] {
  return [
    {
      eyebrow: 'Every day',
      tiles: [
        { href: '/dashboard/moments', label: 'Moments', sub: 'The words for any battle', emoji: '⚡' },
        { href: scriptHref, label: 'Tonight’s script', sub: 'Picked for you today', emoji: '💬' },
        { href: '/dashboard/scripts', label: 'Rehearsals', sub: 'Practise the words with DiGi', emoji: '🎭' },
        { href: '/dashboard/daily#checkin', label: 'Check in', sub: 'Thirty seconds on the worry', emoji: '🪴' },
      ],
    },
    {
      eyebrow: 'Learn',
      tiles: [
        { href: '/dashboard/lessons', label: 'Lessons', sub: 'Watch together, five minutes', icon: 'lessons' },
        { href: '/dashboard/printables', label: 'Printables', sub: 'The offline pathway', icon: 'printables' },
        { href: '/dashboard/quests/play', label: 'Learning games', sub: 'Play and earn stars', icon: 'games' },
      ],
    },
    {
      eyebrow: 'Family',
      tiles: [
        { href: '/dashboard/quests', label: 'Family quests', sub: 'Jobs earn stars', icon: 'jobs' },
        { href: '/dashboard/quests#screen-time', label: 'Screen timer', sub: 'Stars buy the minutes', icon: 'time' },
        { href: '/dashboard/agreement', label: 'Our family deal', sub: 'Signed by everyone', icon: 'deal' },
        { href: '/dashboard/school', label: 'School tasks', sub: 'PE kit, library day, sorted', emoji: '🎒' },
      ],
    },
    {
      eyebrow: 'DiGi and reports',
      tiles: [
        { href: '/dashboard/digi', label: 'Ask DiGi', sub: 'Knows your whole setup', emoji: '⭐' },
        { href: '/dashboard/insights', label: 'DiGi insights', sub: 'What is actually working', emoji: '🔍' },
        { href: '/dashboard/week', label: 'Weekly round up', sub: 'Your week, read back', emoji: '🗞️' },
        { href: '/dashboard#turn-on-check-ins', label: 'Reminders', sub: 'For you here, and the kid app gently nudges them', emoji: '🔔' },
      ],
    },
  ]
}

export default function ExploreGrid({ scriptHref = '/dashboard/scripts' }: { scriptHref?: string }) {
  return (
    <div>
      {groups(scriptHref).map(g => (
        <div key={g.eyebrow} style={{ marginBottom: '18px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px 2px' }}>
            {g.eyebrow}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '9px' }}>
            {g.tiles.map(t => (
              <Link
                key={t.label}
                href={t.href}
                style={{
                  textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', gap: '7px', background: '#fff',
                  border: '1.5px solid var(--border)', borderRadius: '16px',
                  padding: '13px 6px 11px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
                }}
              >
                <span style={{
                  width: 58, height: 58, borderRadius: '13px', background: 'var(--terracotta-lt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '27px', flexShrink: 0,
                }}>
                  {t.icon
                    ? <KidIcon name={t.icon} size={30} color="var(--terracotta-dark)" />
                    : <span aria-hidden>{t.emoji}</span>}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: 'var(--ink)', lineHeight: 1.2 }}>
                  {t.label}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.35 }}>
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
