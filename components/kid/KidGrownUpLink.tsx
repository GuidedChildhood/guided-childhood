'use client'

import HappyIcon from '@/components/kid/HappyIcon'
import { HAPPY, Burst, Sticker, SmileyDot } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/crayon'
import { jobIconFor } from '@/lib/quests/job-icon'
import type { SinceItem } from '@/lib/kid/grown-up-link'

// The two halves of the parent link on the child's home, in the paper Happy
// News finish: white stock, ink edges, hard ink ledges, colour kept for the
// marks on the paper (a crayon well, a burst, a sticker). Justin, 15 September
// 2026: "too much yellow, use design like happy news". See
// lib/kid/grown-up-link.ts for why each exists.

function Well({ tint, children }: { tint: string; children: React.ReactNode }) {
  return (
    <span aria-hidden style={{
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
      background: tint, border: 'var(--edge)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </span>
  )
}

/**
 * "2 waiting for Mum or Dad to say yes". One slim line under the day, naming
 * what is waiting, so a tick never vanishes into silence. Taps through to the
 * jobs page, which lists the same things. Nothing waiting, nothing drawn.
 */
export function KidWaitingLine({ titles, grownUp, href }: { titles: string[]; grownUp: string; href: string }) {
  if (titles.length === 0) return null
  const n = titles.length
  const named = titles.slice(0, 2).join(', ') + (n > 2 ? ` and ${n - 2} more` : '')
  return (
    <a
      data-waiting-line
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
        background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        boxShadow: `0 3px 0 ${HAPPY.ink}`, padding: '10px 14px 10px 10px', marginBottom: 16,
      }}
    >
      <Well tint={CRAYON.sky}><HappyIcon name="time" size={30} /></Well>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
          {n} waiting for {grownUp} to say yes
        </span>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {named}
        </span>
      </span>
      <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>›</span>
    </a>
  )
}

/**
 * Since you last looked: the yeses that landed while the child was away, with
 * the stars each earned. One tap puts it away until the next yes.
 */
export function KidSinceLooked({ items, grownUp, onDone }: { items: SinceItem[]; grownUp: string; onDone: () => void }) {
  if (items.length === 0) return null
  const stars = items.reduce((n, i) => n + i.stars, 0)
  const shown = items.slice(0, 4)
  const more = items.length - shown.length
  return (
    <section
      data-since-looked
      aria-label="Since you last looked"
      style={{
        position: 'relative', overflow: 'hidden',
        background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)',
        boxShadow: `0 5px 0 ${HAPPY.ink}`, padding: '16px 16px 14px', marginBottom: 18,
      }}
    >
      {/* Two smiley dots on the paper's corner, the newspaper's signature. */}
      <span aria-hidden style={{ position: 'absolute', left: -6, top: -6 }}><SmileyDot size={26} color={HAPPY.butter} /></span>
      <span aria-hidden style={{ position: 'absolute', left: 16, top: 12, transform: 'rotate(14deg)' }}><SmileyDot size={12} color={HAPPY.coral} /></span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingLeft: 18 }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Since you last looked
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: HAPPY.ink, lineHeight: 1.1, letterSpacing: '-0.01em', marginTop: 3 }}>
            {grownUp} said yes!
          </span>
        </span>
        {stars > 0 && <Burst size={64} color={HAPPY.butter}>+{stars}⭐</Burst>}
      </div>

      <ul style={{ listStyle: 'none', margin: '0 0 12px', padding: 0 }}>
        {shown.map(i => (
          <li key={i.key} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0', borderTop: '2px dotted rgba(26,26,46,0.15)' }}>
            <Well tint={i.kind === 'idea' ? CRAYON.green : CRAYON.butter}>
              <HappyIcon name={i.kind === 'idea' ? 'ask' : jobIconFor(i.emoji, i.title)} size={30} />
            </Well>
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
              {i.title}
            </span>
            <Sticker size="sm" rotate={-4} accent={i.kind === 'idea' ? 'green' : i.familyJob ? 'sky' : 'butter'}>
              {i.kind === 'idea' ? 'New job!' : i.familyJob ? 'Thank you' : `+${i.stars} ⭐`}
            </Sticker>
          </li>
        ))}
        {more > 0 && (
          <li style={{ padding: '6px 0 0', borderTop: '2px dotted rgba(26,26,46,0.15)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
            and {more} more
          </li>
        )}
      </ul>

      <button
        onClick={onDone}
        style={{
          width: '100%', padding: '12px', background: HAPPY.butter, color: HAPPY.ink,
          border: `2px solid ${HAPPY.ink}`, borderRadius: 16, cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          boxShadow: `0 5px 0 ${HAPPY.ink}`,
        }}
      >
        Brilliant ⭐
      </button>
    </section>
  )
}
