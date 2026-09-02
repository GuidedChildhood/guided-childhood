// The star chart sheet itself: the chart table page and the gold star cut out
// page, exactly as they print.
//
// Lifted out of the parent's StarChartBuilder on 10 August 2026, because the
// sheet now prints from two places. Justin, from Teo's printables tab: "Where
// is the star chart on child's app, this is a key printable." The parent's
// builder composes the jobs and the child's own app prints the same chart, so
// the sheet has to be ONE component or the two papers drift, and a fridge
// with two slightly different charts is worse than a fridge with none.
//
// Deliberately not 'use client': no hooks, no handlers, pure markup. That is
// what lets the child's print page stay a server component end to end while
// the client side builder renders it live between keystrokes.
//
// The component owns only the SHEET scoped print rules (page size, the sheet
// reset, the page break before the cut out page). Hiding each app's chrome
// stays with each consumer, because the parent dashboard and the child app
// wear different chrome.

export type SheetJob = { emoji: string; text: string; stars: number }

// Eleven rows fills an A4 page with the header and the footer row, and leaves
// room for a Tuesday afterthought in pen. Both consumers cap at this.
export const MAX_ROWS = 11

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
// The same seven, taken from the Planet Friends, so the printed chart and the
// app read as one thing.
const DAY_INK = ['#C99A28', '#5C9433', '#3C82B4', '#7E56B4', '#C96C25', '#C4477E', '#2E8C84']
const DAY_BG = ['#FDF3D8', '#E9F3DF', '#DCEBF7', '#EAE1F6', '#FBE7D8', '#FBE0EC', '#DDF0EE']

// The Planet Family, one row on the cut-out sheet so the deal reads off the
// page. Names, accent and soft tokens match the schools cast and the app.
const FRIENDS = [
  { key: 'pebble', name: 'Pebble', accent: '#C99A28', soft: '#FBEED0' },
  { key: 'bloop', name: 'Bloop', accent: '#6C9E38', soft: '#E4F0D4' },
  { key: 'orbit', name: 'Orbit', accent: '#3E86BC', soft: '#DCEBF7' },
  { key: 'nova', name: 'Nova', accent: '#7E5AB0', soft: '#ECE3F7' },
  { key: 'cosmo', name: 'Cosmo', accent: '#CE7328', soft: '#FBE4D0' },
] as const

// The star cell outline on the chart, drawn with a pen.
function Star({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'none', stroke: colour, strokeWidth: 1.7, strokeLinejoin: 'round' }}>
      <path d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z" />
    </svg>
  )
}

// The DiGi star, filled gold, for the cut-out tokens. Sized to sit in a chart
// cell once it is snipped out.
function GoldStar({ size = 46 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, display: 'block' }}>
      <path
        d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z"
        fill="#EDC35F" stroke="#C99A28" strokeWidth={1.3} strokeLinejoin="round"
      />
    </svg>
  )
}

export default function StarChartSheet({ name, weekLabel, jobs, starMinutes = 5 }: {
  /** Empty string prints "My star chart", exactly as the builder always has. */
  name: string
  /** Null prints undated, the signed out lead magnet case. */
  weekLabel: string | null
  /** Up to MAX_ROWS. Whatever is left of the eleven prints as a blank pen
   *  row, so the chart always fills the page. */
  jobs: SheetJob[]
  /**
   * What one star buys THIS child (migration 225). The sheet used to print
   * "1 star = 5 minutes" in ink whatever the family had set, and paper that
   * disagrees with the app is exactly the drift this shared component exists
   * to prevent. Defaults to 5 for the signed out lead magnet.
   */
  starMinutes?: number
}) {
  const picked = jobs.slice(0, MAX_ROWS)
  const blanks = Math.max(0, MAX_ROWS - picked.length)
  const friendMinutes = 4 * starMinutes

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          .cut-page { page-break-before: always; }
        }
      `}</style>

      {/* The sheet itself. What is on screen here is exactly what prints. */}
      <div className="print-sheet" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              The star reward chart
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.05 }}>
              {name ? `${name}'s star chart` : 'My star chart'}
            </div>
            {/* WHICH WEEK THIS SHEET IS FOR, printed on it.
                A chart with no date is the reason the fridge ends up with three
                of them and nobody knowing which one is live. It also makes the
                Monday reset visible on paper: the stars stop at Sunday and a
                fresh sheet starts, which is exactly what the app does. */}
            {weekLabel && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', marginTop: 4 }}>
                Week beginning {weekLabel}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            1 star = {starMinutes} minutes
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
              4 stars in a day = one Planet Friend
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--ink)', color: '#fff', textAlign: 'left', padding: '7px 10px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--border)', width: '34%' }}>
                My jobs
              </th>
              {DAYS.map((d, i) => (
                <th key={d} style={{ background: DAY_BG[i], color: DAY_INK[i], padding: '7px 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--border)' }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {picked.map((job, r) => (
              <tr key={job.text}>
                <td style={{ border: '1px solid var(--border)', padding: '6px 10px', background: r % 2 ? 'var(--cream)' : '#fff' }}>
                  <span style={{ fontSize: 'var(--text-md)', marginRight: 7 }}>{job.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{job.text}</span>
                </td>
                {DAYS.map((d, i) => (
                  <td key={d} style={{ border: '1px solid var(--border)', textAlign: 'center', height: 30, background: r % 2 ? 'var(--cream)' : '#fff' }}>
                    <Star colour={DAY_INK[i]} />
                  </td>
                ))}
              </tr>
            ))}
            {Array.from({ length: blanks }, (_, b) => (
              <tr key={`blank-${b}`}>
                <td style={{ border: '1px solid var(--border)', padding: '6px 10px', background: (picked.length + b) % 2 ? 'var(--cream)' : '#fff' }}>
                  <span style={{ fontSize: 'var(--text-md)', marginRight: 7 }}>✏️</span>
                  <span style={{ display: 'inline-block', width: '62%', borderBottom: '1.4px dashed var(--ink-muted)', verticalAlign: 'middle', height: 14 }} />
                </td>
                {DAYS.map((d, i) => (
                  <td key={d} style={{ border: '1px solid var(--border)', textAlign: 'center', height: 30, background: (picked.length + b) % 2 ? 'var(--cream)' : '#fff' }}>
                    <Star colour={DAY_INK[i]} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ border: '1px solid var(--butter-dark)', padding: '7px 10px', background: 'var(--terracotta)' }}>
                <span style={{ fontSize: 'var(--text-md)', marginRight: 7 }}>⭐</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>Stars today</span>
              </td>
              {DAYS.map(d => (
                <td key={d} style={{ border: '1px solid var(--butter-dark)', height: 30, background: 'var(--terracotta)' }} />
              ))}
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12, textAlign: 'center' }}>
          Colour a star for every job done, or stick a gold star on from the next page. Four stars in a day brings a Planet Friend home, worth {friendMinutes} minutes of screen time.
        </p>
      </div>

      {/* Page two: the gold stars to cut out, then the Planet Family with the
          deal written on it. Prints on its own sheet after the chart. */}
      <div className="print-sheet cut-page" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: 22, marginTop: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Cut out and keep
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
            {name ? `${name}'s gold stars` : 'Gold stars to cut out'}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px auto 0', maxWidth: 440 }}>
            Snip along the dashes. Stick one on the chart for every job done. Each one fits a day square.
          </p>
        </div>

        {/* The grid of cut-out stars, dashed guides around each so a child can
            cut them cleanly. Sized to drop into a chart cell. Eight across in
            five rows: six across in six rows was a taller grid than the page
            had room for, and the no phone loop below it printed alone on a
            third side (Justin, 2 September 2026, "appears on several pages"). */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0,
          border: '1.3px dashed var(--ink-muted)', borderRadius: 6, overflow: 'hidden',
          margin: '16px 0 20px',
        }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div key={i} style={{
              aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRight: '1.3px dashed var(--ink-muted)', borderBottom: '1.3px dashed var(--ink-muted)',
            }}>
              <GoldStar />
            </div>
          ))}
        </div>

        {/* The Planet Family and the deal, written plainly so a family reads it
            straight off the sheet. */}
        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '16px 16px 18px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', textAlign: 'center', marginBottom: 3 }}>
            1 star = {starMinutes} minutes of screen time
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.5, marginBottom: 14 }}>
            Four stars in a day brings one Planet Friend home, worth {friendMinutes} minutes. Collect the whole family.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {FRIENDS.map(f => (
              <div key={f.key} style={{ textAlign: 'center', width: 96 }}>
                <div style={{
                  width: 84, height: 84, margin: '0 auto', borderRadius: '50%',
                  background: f.soft, border: `2px solid ${f.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/printables/friends/${f.key}.png`} alt={f.name} style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: f.accent, marginTop: 5 }}>{f.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS WITH NO PHONE, printed on the sheet itself.
            Justin, 27 August 2026: "we need to make sure the star system and
            device timer can work for kids with no phone and parents can use
            this option. Printable chart needs to work and explain."
            The family this chart is FOR is the one where the child has no
            device, and for them the paper is the whole interface. The three
            steps that close the loop lived only in the app, which is the one
            place a paper first family is not looking. So the deal's mechanics
            print here, on the sheet that lives on the fridge. */}
        <div style={{ background: '#fff', border: '1.5px dashed var(--ink-muted)', borderRadius: 16, padding: '14px 16px', marginTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', textAlign: 'center', marginBottom: 8 }}>
            No phone needed, here is the whole loop
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
            {[
              'Do the job, then colour or stick the star the same day.',
              'A grown up ticks the job in the app and the stars land in the bank.',
              `Spend them on the family TV, console or tablet: a grown up starts the timer from their own phone, and 1 star buys ${starMinutes} minutes.`,
              'Monday morning the week starts fresh. Time earned and not spent turns into sticker book credits, so the one who uses less gets more.',
            ].map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span aria-hidden style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--terracotta, #EDC35F)', color: 'var(--ink)',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xs)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
                  WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
                }}>{i + 1}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}
