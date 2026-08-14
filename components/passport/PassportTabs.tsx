import Link from 'next/link'

// THE PASSPORT'S TAB BAR, AND IT IS THE ONLY THING ABOVE THE PANEL.
//
// Justin, 13 August 2026: "this needs to be the only thing on the passport page
// so they can access everything from nice tidy tabs starting with passport,
// looking really pretty using pastel colours ... as its a mess and a long
// scroll. We have broken the passport as inside pages live behind the front
// cover."
//
// He is right about the break and precise about the cause. PassportBook opens
// on its COVER by design, which he asked for himself after living with the
// alternative, and that decision stands: see the header of that component. The
// fault was that the cover was the ONLY door, so everything the passport holds
// sat behind one flip nobody knew to make, on a 656 line scroll that put the
// book, the report, the strands and the shop in one column.
//
// Tabs are a second door. Nothing is taken away from the book.
//
// ── THE COLOURS ARE THE STAGES, NOT A NEW PALETTE ──────────────────────────
//
// One stage pastel per tab, in stage order, straight from shared/tokens.css.
// So the tab bar reads as the same five colour journey the road and the book
// already use, rather than a second scheme invented for a nav. Every value here
// is a token; nothing new was mixed.
//
// ── WHY LINKS AND NOT STATE ────────────────────────────────────────────────
//
// Each tab is a real URL (?tab=shop), which buys three things a useState tab
// bar cannot. The daily list can point at one tab rather than at a page and a
// hope. Coming back from Stripe lands on the shop rather than the cover. And
// the page loads only the queries its own tab needs, where the scroll this
// replaces paid for all twenty on every open.

export type PassportTabKey = 'passport' | 'working' | 'four' | 'shop'

type Tab = {
  key: PassportTabKey
  label: string
  /** The pastel fill. */
  bold: string
  /** Readable on the fill. Also the edge and the shadow, so the raised tab
   *  reads as one solid pressed object rather than a floating pill. */
  text: string
  /** The barely-there version. Two jobs: the fill of this tab while it is NOT
   *  selected, and the background of the whole panel while it is. So choosing a
   *  tab spreads its own colour down the screen, which is a far stronger signal
   *  of where you are than a pill at the top. */
  tint: string
}

export const PASSPORT_TABS: Tab[] = [
  { key: 'passport', label: 'Passport', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)', tint: 'var(--stage-1)' },
  { key: 'working', label: 'Is it working', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)', tint: 'var(--stage-2)' },
  { key: 'four', label: 'The four things', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)', tint: 'var(--stage-3)' },
  { key: 'shop', label: 'Shop', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)', tint: 'var(--stage-4)' },
]

export function tabTheme(key: PassportTabKey): Tab {
  return PASSPORT_TABS.find(t => t.key === key) ?? PASSPORT_TABS[0]
}

/** Only these four are tabs. Anything else in the query lands on the cover. */
export function readTab(raw: string | undefined): PassportTabKey {
  return PASSPORT_TABS.some(t => t.key === raw) ? (raw as PassportTabKey) : 'passport'
}

export default function PassportTabs({
  active,
  childParam,
  from,
}: {
  active: PassportTabKey
  /** Carried through every tab so switching tabs never silently switches child. */
  childParam?: string
  /**
   * Where they arrived from, carried the same way and for the same reason.
   *
   * Without it, a parent who came from the daily loop, read the book and then
   * tapped Shop has lost the way back to Today, because the back link was on
   * the first tab only. Arriving somewhere and then looking around is not
   * leaving.
   */
  from?: string
}) {
  const suffix =
    (childParam ? `&child=${encodeURIComponent(childParam)}` : '')
    + (from ? `&from=${encodeURIComponent(from)}` : '')

  return (
    <nav
      aria-label="Passport sections"
      style={{
        // ALL FOUR ON THE SCREEN AT ONCE, WHICH IS THE WHOLE POINT.
        //
        // This was a horizontal scroller first, and at 375 wide it showed two
        // and a half tabs with nothing to say the rest existed. A parent could
        // have used the passport for a month without discovering the Shop tab,
        // which is exactly the fault the tabs were built to fix: things nobody
        // knows are there. Justin asked for tidy tabs that reach everything, so
        // the four share the row and every one of them is visible on a phone.
        //
        // Labels wrap rather than truncate. "Is it working" over two lines
        // reads; "Is it wo..." does not, and truncation eats the words that
        // tell two tabs apart. The grid rows stretch, so two line and one line
        // tabs are still the same height as each other.
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        alignItems: 'stretch',
        gap: 7,
        padding: '6px 16px 10px',
      }}
    >
      {PASSPORT_TABS.map(t => {
        const on = t.key === active
        return (
          <Link
            key={t.key}
            href={`/dashboard/passport?tab=${t.key}${suffix}`}
            aria-current={on ? 'page' : undefined}
            style={{
              minWidth: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
              padding: '10px 6px', borderRadius: 14,
              textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
              lineHeight: 1.2,
              // Height comes from the grid, not from the tallest label, so the
              // one line tabs match the two line ones instead of floating.
              height: '100%',
              // Raised and pressed, the same language as every button in the
              // product. The active tab carries the full pastel, its own dark
              // edge and the hard 4px drop; the rest sit flat in the whisper
              // version of the same colour, two pixels lower, so which one you
              // are on is legible at a glance and across a room.
              ...(on ? {
                background: t.bold, color: t.text, fontWeight: 800,
                border: `2px solid ${t.text}`, boxShadow: `0 4px 0 ${t.text}`,
                transform: 'translateY(0)',
              } : {
                background: t.tint, color: 'var(--ink-soft)', fontWeight: 700,
                border: '1.5px solid var(--border)', boxShadow: 'none',
                transform: 'translateY(2px)',
              }),
            }}
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
