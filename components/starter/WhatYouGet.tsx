import MethodIcon, { METHOD, type MethodId } from './MethodIcon'

// Everything else, as one list.
//
// Justin, 10 September 2026: "just make the other information after that a
// collection of happy news design icons so we can shrink the scroll and too
// much text." That became a two up grid of tiles, each with a chevron and a
// paragraph behind it.
//
// Justin, 13 September 2026, with that grid on his phone: "maybe in the
// starter page we don't need this detail, just a simple list in happy news
// style, copy ideas of the first intro page of the best performing platforms
// applied to what we have."
//
// ── THE MOBBIN PASS ─────────────────────────────────────────────────────────
//
// The best performing intro pages all draw this the same way:
//
// - MacroFactor, What you get: one column, an icon on the left, a bold line
//   and one short line under it, a hairline between rows, nothing to open.
//   https://mobbin.com/screens/3bc539ca-429f-42a3-90ec-edd100fd0544
// - Structured, the plan: the same rows, five of them, then Continue.
//   https://mobbin.com/screens/30fab178-fcdf-4e6a-b41d-ff8a8c08b64f
// - Klarna, benefits: rows in one card, the card is the only edge.
//   https://mobbin.com/screens/58209bf6-9aa9-4262-aa10-46344fcee62e
//
// So: one card, eight rows, the drawing, the name, one line. No chevrons, no
// paragraphs, no tiles. The two beliefs that opened the grid (Not another
// blocking app, We have got you) went, because the How it works section above
// already says both as its heading and its lead.
//
// ── WHAT THE LINES MAY SAY ──────────────────────────────────────────────────
//
// Only what the product does today, in words a parent uses. The scripts, the
// passport and the check in are already explained on the worry cards, so a
// line here is a reminder, not the argument.

type Row = { icon: MethodId; title: string; line: string }

const ROWS: Row[] = [
  { icon: 'kidapp',   title: 'Their own app',      line: 'Jobs, stars and the five a day' },
  { icon: 'lesson',   title: 'Lessons and school', line: 'The things nobody teaches, before they arrive' },
  { icon: 'moment',   title: 'Moments',            line: 'The thing that went wrong tonight' },
  { icon: 'script',   title: 'Scripts',            line: 'The words, ready before the moment' },
  { icon: 'digi',     title: 'DiGi',               line: 'Ask anything, any time' },
  { icon: 'balance',  title: 'Device time',        line: 'A number you agreed this morning' },
  { icon: 'passport', title: 'The passport',       line: 'One road, from 4 to 16' },
  { icon: 'checkin',  title: 'Ten seconds a day',  line: 'Tap how it went, that is the whole habit' },
]

export default function WhatYouGet({ childName }: { childName?: string | null }) {
  const kid = childName && childName !== 'your child' ? childName : null
  return (
    <div>
      <p style={{
        margin: '0 0 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
      }}>
        What you get
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em',
        fontSize: 'clamp(1.45rem, 5vw, 1.9rem)', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 14px',
      }}>
        {kid ? `Everything ${kid} needs, and everything you need.` : 'Everything they need, and everything you need.'}
      </h2>

      {/* One card, one ledge. The rows inside carry no edge of their own. */}
      <ul style={{
        listStyle: 'none', margin: 0, padding: '0 14px',
        background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)',
      }}>
        {ROWS.map((r, i) => (
          <li key={r.icon} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
            borderTop: i === 0 ? 'none' : '1.5px solid var(--border)',
          }}>
            <span aria-hidden style={{
              flexShrink: 0, width: 38, height: 38, borderRadius: 'var(--radius-tile)',
              background: METHOD[r.icon].tint, border: 'var(--edge)', boxSizing: 'border-box',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MethodIcon id={r.icon} size={22} />
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{
                display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em',
              }}>
                {r.title}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 1 }}>
                {r.line}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
