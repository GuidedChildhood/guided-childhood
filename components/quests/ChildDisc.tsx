import { childColour, childInitial } from '@/lib/children/colour'

// A child's mark on the Quests page: their first letter on their own colour.
//
// The same disc the child switcher draws at the top of every parent page
// (components/children/ChildSwitcher.tsx): stage colour from
// lib/children/colour, ink edge, the small Happy News lift. One look per child
// across the whole parent app.
//
// Justin, 18 November 2026, chose this over the buddy picture that went in
// with PR 1629. The buddy was the child's own choice and the same face their
// app shows, but a child who never picked one falls back to DiGi, so two
// children could wear the same face on one card, and the page then had two
// ways of drawing the same child. A letter on their colour is never the same
// twice in a family and needs no picture to load.
export default function ChildDisc({ name, ageBand, size = 44 }: {
  name?: string | null
  ageBand?: string | null
  size?: number
}) {
  const c = childColour(ageBand)
  const small = size < 36
  return (
    <span aria-hidden style={{
      flexShrink: 0, width: size, height: size, borderRadius: '50%',
      background: c.bold, color: c.text,
      border: small ? '1.5px solid var(--ink)' : 'var(--edge)', boxSizing: 'border-box',
      boxShadow: small ? 'none' : '0 2px 0 var(--ink)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.02em',
      fontSize: Math.round(size * 0.44), lineHeight: 1,
    }}>
      {childInitial(name)}
    </span>
  )
}
