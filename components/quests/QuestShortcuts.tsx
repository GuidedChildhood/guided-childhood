import Link from 'next/link'
import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'

// The top of the Quests page: the four places a parent actually goes, as flat
// coloured tiles. Built the way the calmest parent apps do a browse grid (Good
// Inside's Discover): one solid colour per tile, a real drawn icon rather than
// an emoji, a bold title and one short line under it saying what happens.
//
// This replaces the pair of buttons that used to sit at the very top. Two
// buttons could not hold the four real destinations, so the extras were buried
// further down the page where nobody found them.

type Tile = {
  href: string
  label: string
  sub: string
  icon: KidIconName
  bg: string
  iconBg: string
}

const TILES: Tile[] = [
  {
    href: '#quest-manager', label: 'Manage jobs', sub: 'Set, agree and send',
    icon: 'jobs', bg: 'var(--terracotta-lt)', iconBg: 'rgba(255,255,255,0.72)',
  },
  {
    href: '/dashboard/printables', label: 'Printables', sub: 'Charts to print',
    icon: 'printables', bg: 'var(--tint-blue)', iconBg: 'rgba(255,255,255,0.72)',
  },
  {
    href: '/dashboard/quests/play', label: 'Learning games', sub: 'Play and earn stars',
    icon: 'games', bg: 'var(--tint-green)', iconBg: 'rgba(255,255,255,0.72)',
  },
  {
    href: '/dashboard/agreement', label: 'Our family deal', sub: 'Signed by everyone',
    icon: 'deal', bg: 'var(--tint-sage)', iconBg: 'rgba(255,255,255,0.72)',
  },
]

export default function QuestShortcuts() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 18,
    }}>
      {TILES.map(t => {
        const inner = (
          <>
            <span aria-hidden style={{
              width: 40, height: 40, borderRadius: 12, background: t.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              marginBottom: 10, color: 'var(--ink)',
            }}>
              <KidIcon name={t.icon} size={23} />
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.15 }}>
              {t.label}
            </span>
            <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: 3 }}>
              {t.sub}
            </span>
          </>
        )
        const style: React.CSSProperties = {
          display: 'block', background: t.bg, color: 'var(--ink)', textDecoration: 'none',
          borderRadius: 18, padding: '15px 15px 16px', minHeight: 118,
        }
        // The manager is an anchor on this same page, the rest are real routes.
        return t.href.startsWith('#')
          ? <a key={t.href} href={t.href} style={style}>{inner}</a>
          : <Link key={t.href} href={t.href} style={style}>{inner}</Link>
      })}
    </div>
  )
}
