// The star chart sheet itself: the fridge page and the gold star cut out page,
// exactly as they print.
//
// Lifted out of the parent's StarChartBuilder on 10 August 2026, because the
// sheet prints from two places. Justin, from Teo's printables tab: "Where is
// the star chart on child's app, this is a key printable." The parent's
// builder composes the jobs and the child's own app prints the same chart, so
// the sheet has to be ONE component or the two papers drift, and a fridge
// with two slightly different charts is worse than a fridge with none.
//
// THE FRIDGE REDESIGN (Justin, 17 November 2026): "a really top industry fridge
// chart that works and links to app in some way to encourage both", with
// "areas on it about where phone lives" and "hints on getting outside in the
// garden". The research pass behind it (plans/2026-11-17-fridge-star-chart.md)
// found the bestsellers win on three things: the child watches it fill, every
// job has a picture, and the goal is visible. They lose on a hidden goal and on
// charts that do not fit the family. So page one now:
//
//   reads like the child's app: the rainbow, "My five a day", the planet that
//   gets coloured on a full day, the Planet Friends trail with THIS child's
//   real progress printed on it when the app knows it
//
//   puts the goal at the top, in the child's own words, beside the family's
//   real rate (migration 225), so the paper and the bank agree
//
//   carries three panels a family actually uses on a fridge: where our phones
//   sleep, outside this week (by season), and the end of the week tally with a
//   QR a grown up scans to put the paper stars in the bank
//
// THE FRIEND RULE IS THE APP'S RULE. The old sheet said "4 stars in a day = one
// Planet Friend". The app never worked that way: Friends come from FULL days,
// all five of the five a day, on the ladder in lib/pathway/streak-unlock.ts.
// The sheet now imports that ladder rather than restating it, and says plainly
// that full days count when they are ticked in the app, because the paper week
// entry (app/api/quests/fridge-week) banks stars, not days.
//
// Page one is a fixed A4 sized box inside SheetScale, so a phone preview is the
// printed page shrunk, never a reflowed guess, and a print on demand partner
// gets a page that is the same every time. Nothing on it ever subtracts: no
// crosses, no sad faces, stars are never taken off (CDC, Gov Wales).
//
// Deliberately free of hooks and handlers. SheetScale is the one client piece,
// so the child's print page still renders this from a server component.

import HappyIcon from '@/components/kid/HappyIcon'
import { HAPPY, RainbowArc } from '@/components/kid/HappyNewsBits'
import SheetScale from '@/components/printables/SheetScale'
import { PrintBrandMark } from '@gc/shared/components/PrintBrand'
import { jobIconFor } from '@/lib/quests/job-icon'
import { FRIEND_STREAKS, friendsFromStreaks, streaksToNextFriend } from '@/lib/pathway/streak-unlock'

export type SheetJob = { emoji: string; text: string; stars: number }

// The builder and the child print page both cap at this. Eleven still fits
// page one with the panels, because the rows shrink as they are added.
export const MAX_ROWS = 11

// The five a day the app runs on. The first five rows are always these.
const FIVE = 5

/** Blank pen rows the sheet prints for this many jobs: the unfilled five a day
 *  rows, plus up to two extra rows, never past MAX_ROWS in all. */
export function penRows(jobCount: number): number {
  const n = Math.min(Math.max(0, jobCount), MAX_ROWS)
  const extras = Math.max(0, n - FIVE)
  return Math.max(0, FIVE - n) + Math.max(0, Math.min(2, MAX_ROWS - FIVE - extras))
}

// Page one, sized to the printable area of A4 at 10mm margins (190 x 277mm at
// 96 dpi, a few pixels spare). SheetScale shrinks it to a phone exactly.
const PAGE_W = 718
const PAGE_H = 1040

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
// The same seven, taken from the Planet Friends, so the printed chart and the
// app read as one thing.
const DAY_INK = ['#C99A28', '#5C9433', '#3C82B4', '#7E56B4', '#C96C25', '#C4477E', '#2E8C84']
const DAY_BG = ['#FDF3D8', '#E9F3DF', '#DCEBF7', '#EAE1F6', '#FBE7D8', '#FBE0EC', '#DDF0EE']

// The Planet Family. Names, accent and soft tokens match the schools cast and
// the app.
const FRIENDS = [
  { key: 'pebble', name: 'Pebble', accent: '#C99A28', soft: '#FBEED0' },
  { key: 'bloop', name: 'Bloop', accent: '#6C9E38', soft: '#E4F0D4' },
  { key: 'orbit', name: 'Orbit', accent: '#3E86BC', soft: '#DCEBF7' },
  { key: 'nova', name: 'Nova', accent: '#7E5AB0', soft: '#ECE3F7' },
  { key: 'cosmo', name: 'Cosmo', accent: '#CE7328', soft: '#FBE4D0' },
] as const

// OUTSIDE THIS WEEK, by the season of the week the sheet is for. Every one is
// a garden, a park or a doorstep thing, free, and a job a five year old can do
// with a grown up nearby. They earn the same star as any other job.
type Season = 'spring' | 'summer' | 'autumn' | 'winter'
const OUTSIDE: Record<Season, { label: string; ideas: string[] }> = {
  spring: { label: 'Spring', ideas: ['Plant some seeds and water them', 'Build a bug hotel from sticks', 'Count the flowers on a walk'] },
  summer: { label: 'Summer', ideas: ['Water the garden plants', 'Lie down and spot cloud shapes', 'Have a picnic outside'] },
  autumn: { label: 'Autumn', ideas: ['Leaf hunt: find five colours', 'Build a den from sticks', 'Fill the bird feeder'] },
  winter: { label: 'Winter', ideas: ['Find frost patterns', 'Puddle walk in wellies', 'Put food out for the birds'] },
}
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

/** The season of the sheet's own week, read from its label, else today. */
export function seasonFor(weekLabel: string | null, now: Date = new Date()): Season {
  const fromLabel = weekLabel ? MONTHS.findIndex(m => weekLabel.toLowerCase().includes(m)) : -1
  const month = fromLabel >= 0 ? fromLabel : now.getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

// The star cell outline on the chart, drawn with a pen.
function Star({ colour, size = 18 }: { colour: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden style={{ width: size, height: size, fill: 'none', stroke: colour, strokeWidth: 1.7, strokeLinejoin: 'round' }}>
      <path d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z" />
    </svg>
  )
}

// The full day planet, outline only, for colouring in when all five are done.
function Planet({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 32 24" aria-hidden style={{ width: 30, height: 22, display: 'block', margin: '0 auto' }}>
      <ellipse cx="16" cy="12" rx="15" ry="4.2" fill="none" stroke={colour} strokeWidth="1.5" />
      <circle cx="16" cy="12" r="7.5" fill="var(--white)" stroke={colour} strokeWidth="1.7" />
      <path d="M3.2 14.2 Q16 19.5 28.8 14.2" fill="none" stroke={colour} strokeWidth="1.5" />
    </svg>
  )
}

// The DiGi star, filled gold, for the cut out tokens. Sized to sit in a chart
// cell once it is snipped out.
function GoldStar({ size = 46 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden style={{ width: size, height: size, display: 'block' }}>
      <path
        d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z"
        fill={HAPPY.butter} stroke={HAPPY.butterDark} strokeWidth={1.3} strokeLinejoin="round"
      />
    </svg>
  )
}

// A phone tucked up in bed, for the phone panel. Line art, so it colours in.
function PhoneBed() {
  return (
    <svg viewBox="0 0 120 64" aria-hidden style={{ width: 112, height: 60, display: 'block' }}>
      <rect x="6" y="38" width="108" height="16" rx="5" fill={HAPPY.butterLt} stroke="var(--ink)" strokeWidth="2" />
      <path d="M10 54 v8 M110 54 v8" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="12" y="26" width="26" height="14" rx="6" fill="var(--white)" stroke="var(--ink)" strokeWidth="2" />
      <rect x="22" y="8" width="20" height="34" rx="4" fill="var(--white)" stroke="var(--ink)" strokeWidth="2" transform="rotate(-62 32 25)" />
      <path d="M40 34 Q72 26 110 34 V48 H40 Z" fill={DAY_BG[2]} stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M26 22 q2 2 4 0 M33 18 q2 2 4 0" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
      <text x="62" y="20" fontFamily="var(--font-display)" fontWeight="900" fontSize="12" fill="var(--ink)">z z z</text>
    </svg>
  )
}

function TickBox() {
  return (
    <span aria-hidden style={{ flexShrink: 0, width: 14, height: 14, borderRadius: 4, border: '1.6px solid var(--ink)', background: 'var(--white)', display: 'inline-block' }} />
  )
}

function PenLine({ width = '100%' }: { width?: string | number }) {
  return <span aria-hidden style={{ display: 'inline-block', width, borderBottom: '1.4px dashed var(--ink-muted)', height: 14, verticalAlign: 'bottom' }} />
}

const panel: React.CSSProperties = {
  background: 'var(--white)', border: '2px solid var(--ink)', borderRadius: 14,
  padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0,
}
const panelTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'var(--ink)', lineHeight: 1.15, margin: 0,
}
const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const small: React.CSSProperties = { fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.4, margin: 0 }

export default function StarChartSheet({ name, weekLabel, jobs, starMinutes = 5, fullDays = null }: {
  /** Empty string prints "My star week", the signed out lead magnet case. */
  name: string
  /** Null prints undated, the signed out lead magnet case. */
  weekLabel: string | null
  /** Up to MAX_ROWS. The first five are the five a day; blanks fill the rest. */
  jobs: SheetJob[]
  /**
   * What one star buys THIS child (migration 225). Paper that disagrees with
   * the app is exactly the drift this shared component exists to prevent.
   * Defaults to 5 for the signed out lead magnet.
   */
  starMinutes?: number
  /**
   * Full days this child already has in the app (streakCurrency). When known,
   * the Planet Friends trail prints who is home and how many full days the next
   * one needs, so the fridge shows the same progress the child's phone does.
   * Null prints the ladder with no progress, for the lead magnet.
   */
  fullDays?: number | null
}) {
  const picked = jobs.slice(0, MAX_ROWS)
  const fiveRows = Array.from({ length: FIVE }, (_, i) => picked[i] ?? null)
  const extras = picked.slice(FIVE)
  // At least two pen rows for a Tuesday afterthought, never past eleven.
  const extraRows = [...extras, ...Array.from({ length: Math.max(0, Math.min(2, MAX_ROWS - FIVE - extras.length)) }, () => null)]
  const rowCount = FIVE + extraRows.length
  const rowH = rowCount <= 7 ? 33 : rowCount <= 9 ? 29 : 26

  const season = OUTSIDE[seasonFor(weekLabel)]
  const known = typeof fullDays === 'number' && fullDays >= 0
  const home = known ? friendsFromStreaks(fullDays) : 0
  const toNext = known ? streaksToNextFriend(fullDays) : 0
  const nextFriend = FRIENDS[home] ?? null
  const heroFriend = nextFriend ?? FRIENDS[FRIENDS.length - 1]

  const cell = (i: number, r: number): React.CSSProperties => ({
    border: '1px solid var(--border)', textAlign: 'center', height: rowH,
    background: r % 2 ? DAY_BG[i] : 'var(--white)',
  })

  const jobRow = (job: SheetJob | null, r: number, number: number | null) => (
    <tr key={`row-${r}`}>
      <td style={{ border: '1px solid var(--border)', padding: '3px 8px', background: 'var(--white)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          {number !== null && (
            <span aria-hidden style={{
              flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--butter)', border: '1.5px solid var(--ink)',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 10, color: 'var(--ink)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
            }}>{number}</span>
          )}
          {job ? (
            <>
              <span aria-hidden style={{ display: 'inline-flex', flexShrink: 0 }}><HappyIcon name={jobIconFor(job.emoji, job.text)} size={rowH > 28 ? 20 : 17} /></span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: job.text.length > 26 ? 11.5 : rowH > 28 ? 13.5 : 12.5, color: 'var(--ink)', lineHeight: 1.05, overflowWrap: 'anywhere' }}>{job.text}</span>
            </>
          ) : (
            <PenLine width="78%" />
          )}
        </span>
      </td>
      {DAYS.map((d, i) => (
        <td key={d} style={cell(i, r)}><Star colour={DAY_INK[i]} size={rowH > 28 ? 19 : 16} /></td>
      ))}
    </tr>
  )

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; border-radius: 0 !important; }
          .print-sheet.fridge-page { height: 274mm !important; }
          .cut-page { page-break-before: always; }
          .print-sheet * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* PAGE ONE: the fridge page. What is on screen is exactly what prints. */}
      <SheetScale sheetWidth={PAGE_W} sheetHeight={PAGE_H}>
        <div className="print-sheet fridge-page" style={{
          width: PAGE_W, height: PAGE_H, boxSizing: 'border-box', background: 'var(--white)',
          border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: 20,
          display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', position: 'relative',
        }}>
          {/* The header: who and which week on the left, the app's rainbow with
              the next Planet Friend sitting under it on the right. */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div data-print-brand>
                <PrintBrandMark label="Star reward chart" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 34, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.02 }}>
                {name ? `${name}'s star week` : 'My star week'}
              </div>
              {/* WHICH WEEK THIS SHEET IS FOR, printed on it. A chart with no
                  date is how the fridge ends up with three of them. It also
                  makes the Monday reset visible: a fresh sheet each week, as
                  the app does. */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)', marginTop: 5 }}>
                {weekLabel ? `Week beginning ${weekLabel}` : 'Week beginning ____________'}
              </div>
            </div>
            <div style={{ position: 'relative', width: 150, flexShrink: 0, textAlign: 'center' }}>
              <RainbowArc width={150} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/digi-squad/friends/${heroFriend.key}.png`} alt="" style={{ position: 'absolute', left: 45, bottom: 0, width: 60, height: 60, objectFit: 'contain' }} />
            </div>
          </div>

          {/* THE GOAL AND THE DEAL, at the top where the child sees it. The
              reward is the child's own words, written in pen on Monday. */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: '0 0 auto', background: 'var(--butter)', border: '2px solid var(--ink)', borderRadius: 999, padding: '7px 14px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <GoldStar size={18} /> 1 star = {starMinutes} minutes
            </div>
            <div style={{ flex: 1, border: '2px solid var(--ink)', borderRadius: 999, padding: '7px 14px', display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5, color: 'var(--ink)', whiteSpace: 'nowrap' }}>This week I am saving for</span>
              <PenLine />
            </div>
          </div>

          {/* THE CHART. "My five a day" is the app's own heading, and the full
              day planet row is the app's finish line drawn in pen. */}
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ background: 'var(--ink)', color: 'var(--white)', textAlign: 'left', padding: '6px 10px', fontFamily: 'var(--font-display)', fontSize: 13.5, fontWeight: 900, border: '1px solid var(--ink)', width: '36%', borderTopLeftRadius: 10 }}>
                  My five a day
                </th>
                {DAYS.map((d, i) => (
                  <th key={d} style={{ background: DAY_BG[i], color: DAY_INK[i], padding: '6px 0', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--border)', borderTopRightRadius: i === 6 ? 10 : 0 }}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fiveRows.map((job, r) => jobRow(job, r, r + 1))}
              <tr>
                <td colSpan={8} style={{ padding: '4px 10px', background: 'var(--cream)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                  Extra jobs, outside jobs, kind things
                </td>
              </tr>
              {extraRows.map((job, r) => jobRow(job, FIVE + r, null))}
              <tr>
                <td style={{ border: '1.5px solid var(--ink)', padding: '5px 10px', background: 'var(--butter-lt)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.1 }}>Full day?</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.25 }}>All five done: colour the planet</div>
                </td>
                {DAYS.map((d, i) => (
                  <td key={d} style={{ border: '1.5px solid var(--ink)', background: 'var(--butter-lt)', height: 38 }}><Planet colour={DAY_INK[i]} /></td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* THE PLANET FRIENDS TRAIL, the app's ladder, with this child's real
              progress when the app knows it. */}
          <div style={{ border: '2px solid var(--ink)', borderRadius: 14, padding: '9px 12px', background: 'var(--cream)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <div style={panelTitle}>Full days bring Planet Friends home</div>
              <div style={{ ...small, fontWeight: 700, color: 'var(--ink)', textAlign: 'right' }}>
                {known
                  ? nextFriend
                    ? `${fullDays} full day${fullDays === 1 ? '' : 's'} so far. ${toNext} more for ${nextFriend.name}.`
                    : `${fullDays} full days. The whole family is home.`
                  : 'Tick each day in the app to count it.'}
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span aria-hidden style={{ position: 'absolute', left: 30, right: 30, top: 21, borderTop: '2.5px dashed var(--ink-muted)' }} />
              {FRIENDS.map((f, i) => {
                const isHome = known && i < home
                const isNext = known && i === home
                return (
                  <div key={f.key} style={{ position: 'relative', textAlign: 'center', width: 96 }}>
                    <div style={{
                      width: 42, height: 42, margin: '0 auto', borderRadius: '50%', background: isHome ? f.soft : 'var(--white)',
                      border: `${isNext ? 3 : 2}px solid ${isHome || isNext ? f.accent : 'var(--ink-muted)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/digi-squad/friends/${f.key}.png`} alt={f.name} style={{ width: '88%', height: '88%', objectFit: 'contain', opacity: known && !isHome && !isNext ? 0.45 : 1 }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 12, color: f.accent, marginTop: 3, lineHeight: 1.1 }}>{f.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, color: 'var(--ink-soft)' }}>
                      {isHome ? 'Home' : `${FRIEND_STREAKS[i]} full days`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* THE THREE PANELS a fridge chart earns its place with. */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.08fr', gap: 8, flex: 1, minHeight: 0 }}>
            {/* Where our phones sleep. AAP and RCPCH both land on devices
                charging outside the bedroom and off an hour before sleep. */}
            <div style={panel}>
              <div style={eyebrow}>Our family plan</div>
              <div style={panelTitle}>Where our phones sleep</div>
              <PhoneBed />
              <div style={{ ...small, display: 'flex', alignItems: 'flex-end', gap: 4 }}><span style={{ whiteSpace: 'nowrap' }}>In the</span><PenLine /></div>
              <div style={{ ...small, display: 'flex', alignItems: 'flex-end', gap: 4 }}><span style={{ whiteSpace: 'nowrap' }}>Bedtime for phones</span><PenLine /></div>
              <div style={{ ...small, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>Screen free spots</div>
              {['The dinner table', 'Bedrooms', 'The car'].map(s => (
                <div key={s} style={{ ...small, display: 'flex', alignItems: 'center', gap: 6 }}><TickBox />{s}</div>
              ))}
              <div style={{ ...small, display: 'flex', alignItems: 'center', gap: 6 }}><TickBox /><PenLine /></div>
            </div>

            {/* Outside this week, by the season of the sheet's own week. */}
            <div style={{ ...panel, background: 'var(--tint-green, #E9F3DF)' }}>
              <div style={eyebrow}>{season.label} ideas</div>
              <div style={panelTitle}>Outside this week</div>
              {season.ideas.map(idea => (
                <div key={idea} style={{ ...small, color: 'var(--ink)', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <TickBox /><span>{idea}</span>
                </div>
              ))}
              <div style={{ ...small, display: 'flex', alignItems: 'center', gap: 7 }}><TickBox /><PenLine /></div>
              <p style={{ ...small, marginTop: 'auto' }}>
                Pick one, write it in an extra row, and star it like any other job.
                Fresh air first, then the screen feels earned.
              </p>
            </div>

            {/* The end of the week: the tally, the praise line, and the way
                back into the app. */}
            <div style={{ ...panel, background: 'var(--butter-lt)' }}>
              <div style={eyebrow}>Sunday night</div>
              <div style={panelTitle}>End of the week</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'nowrap', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: 'var(--ink)' }}>
                <span style={{ width: 40, height: 28, border: '2px solid var(--ink)', borderRadius: 8, background: 'var(--white)', flexShrink: 0 }} />
                <span>stars x {starMinutes} =</span>
                <span style={{ width: 40, height: 28, border: '2px solid var(--ink)', borderRadius: 8, background: 'var(--white)', flexShrink: 0 }} />
                <span>mins</span>
              </div>
              <div style={{ ...small, fontWeight: 700, color: 'var(--ink)' }}>Something I noticed this week</div>
              <PenLine /><PenLine />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 'auto' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/qr/star-chart-week.svg" alt="QR code to enter the week in the app" style={{ width: 62, height: 62, flexShrink: 0, background: 'var(--white)', borderRadius: 6 }} />
                <p style={{ ...small, fontSize: 10.5 }}>
                  <strong style={{ color: 'var(--ink)' }}>Grown up:</strong>{' '}scan to put this week&apos;s stars in the bank, ready to spend.
                </p>
              </div>
            </div>
          </div>

          <p style={{ ...small, textAlign: 'center', fontSize: 11 }}>
            Colour a star or stick a gold one on for every job done. Stars are never taken off, and a fresh sheet starts every Monday.
          </p>
        </div>
      </SheetScale>

      {/* PAGE TWO: the gold stars to cut out, then the Planet Family with the
          deal written on it. Prints on its own sheet after the chart. */}
      <div className="print-sheet cut-page" style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: 22, marginTop: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div data-print-brand>
            <PrintBrandMark label="Cut out and keep" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
            {name ? `${name}'s gold stars` : 'Gold stars to cut out'}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px auto 0', maxWidth: 440 }}>
            Snip along the dashes. Stick one on the chart for every job done. Each one fits a day square.
          </p>
        </div>

        {/* Eight across in five rows: six across was a taller grid than the
            page had room for, and the loop below printed alone on a third side
            (Justin, 2 September 2026, "appears on several pages"). */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0,
          border: '1.3px dashed var(--ink-muted)', borderRadius: 6, overflow: 'hidden',
          margin: '12px 0 14px',
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

        {/* The Planet Family and the real ladder, written plainly. */}
        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '12px 16px 14px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', textAlign: 'center', marginBottom: 3 }}>
            1 star = {starMinutes} minutes of screen time
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.5, marginBottom: 10 }}>
            A full day is all five done. Full days ticked in the app bring the Planet Friends home, one by one. Collect the whole family.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {FRIENDS.map((f, i) => (
              <div key={f.key} style={{ textAlign: 'center', width: 96 }}>
                <div style={{
                  width: 64, height: 64, margin: '0 auto', borderRadius: '50%',
                  background: f.soft, border: `2px solid ${f.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/digi-squad/friends/${f.key}.png`} alt={f.name} style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: f.accent, marginTop: 5 }}>{f.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)' }}>{FRIEND_STREAKS[i]} full days</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS WITH NO PHONE, printed on the sheet itself (Justin,
            27 August 2026: "Printable chart needs to work and explain"). For a
            family whose child has no device, the paper is the whole interface. */}
        <div style={{ background: 'var(--white)', border: '1.5px dashed var(--ink-muted)', borderRadius: 'var(--radius-btn)', padding: '14px 16px', marginTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', textAlign: 'center', marginBottom: 8 }}>
            No phone needed, here is the whole loop
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
            {[
              'Do the job, then colour or stick the star the same day.',
              'A grown up ticks the jobs in the app each day, or scans the code on Sunday and types in the week. Either way the stars land in the bank.',
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
