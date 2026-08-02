'use client'

import { useState } from 'react'
import Link from 'next/link'

// Build the star chart, THEN print it. The paper chart has four blank rows for
// a pen, which is fine on the fridge and useless before it is on the fridge: a
// parent who wants their own jobs printed properly had to hand write them onto
// every reprint forever.
//
// So this is the same chart, typed. Pick from the menu, add your own, put their
// name on it, print. What comes out is two pages: the chart with your jobs
// printed in, then a sheet of gold stars to cut out and the Planet Family with
// the deal written on it. The Sticker Book "print stars" button lands here too,
// so one press prints the chart and the stickers together.
//
// Deliberately not gated. The Starter Pack is the free lead magnet, and a
// builder for a free product that is not itself free is a door with no room
// behind it.

const MAX_ROWS = 11

type Job = { emoji: string; text: string; stars: number }

const POOL: { group: string; jobs: Job[] }[] = [
  {
    group: 'Every day, worth 1 star',
    jobs: [
      { emoji: '👕', text: 'Get dressed on my own', stars: 1 },
      { emoji: '🛏️', text: 'Make my bed', stars: 1 },
      { emoji: '🪥', text: 'Brush my teeth, no fuss', stars: 1 },
      { emoji: '🧸', text: 'Tidy my toys away', stars: 1 },
      { emoji: '👟', text: 'Shoes and coat away', stars: 1 },
      { emoji: '🧺', text: 'Dirty clothes in the basket', stars: 1 },
    ],
  },
  {
    group: 'A bit more, worth 2 stars',
    jobs: [
      { emoji: '🍽️', text: 'Lay or clear the table', stars: 2 },
      { emoji: '🍴', text: 'Help load the dishwasher', stars: 2 },
      { emoji: '🐕', text: 'Feed the pet', stars: 2 },
      { emoji: '🗑️', text: 'Take the bins out', stars: 2 },
      { emoji: '🛒', text: 'Help put the shopping away', stars: 2 },
      { emoji: '🧹', text: 'Sweep or hoover one room', stars: 2 },
    ],
  },
  {
    group: 'The big ones, worth 3 stars',
    jobs: [
      { emoji: '🏃', text: 'Play outside for half an hour', stars: 3 },
      { emoji: '📚', text: 'Read with a grown up', stars: 3 },
      { emoji: '🎨', text: 'Make something with my hands', stars: 3 },
      { emoji: '🍲', text: 'Help cook a whole meal', stars: 3 },
      { emoji: '🧑‍🤝‍🧑', text: 'A job for someone else in the family', stars: 3 },
      { emoji: '🌱', text: 'Water the plants or the garden', stars: 3 },
    ],
  },
]

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

export type YourJob = Job & { childId: string | null }

export default function StarChartBuilder({
  yourJobs = [], childOptions = [], defaultChildName = '',
}: {
  /** The family's real active jobs, straight off the quests board. */
  yourJobs?: YourJob[]
  /** Named children, so a two child family can print each chart. */
  childOptions?: { id: string; name: string }[]
  defaultChildName?: string
} = {}) {
  const [childName, setChildName] = useState(defaultChildName)
  // Which child's jobs to show. Null means everyone, which is also what a
  // family with one child sees, so nothing extra appears for them.
  const [forChild, setForChild] = useState<string | null>(
    childOptions.length > 1 ? (childOptions[0]?.id ?? null) : null,
  )

  // Jobs for the chosen child, plus the whole family ones, which belong to
  // every child and so appear whoever is picked.
  const mine = yourJobs.filter(j => forChild === null || j.childId === null || j.childId === forChild)

  const [picked, setPicked] = useState<Job[]>(
    // Their own jobs lead. Falling back to our menu only when a family has set
    // none is the point: a suggestion is for someone with nothing yet, and
    // showing our guesses to a parent who has already done the work is the
    // thing that made them type everything twice.
    mine.length > 0
      ? mine.slice(0, MAX_ROWS).map(({ emoji, text, stars }) => ({ emoji, text, stars }))
      : [POOL[0].jobs[0], POOL[0].jobs[3], POOL[1].jobs[0], POOL[2].jobs[0], POOL[2].jobs[1]],
  )
  const [custom, setCustom] = useState('')

  const pickedText = new Set(picked.map(p => p.text))

  function toggle(job: Job) {
    setPicked(p => p.some(x => x.text === job.text)
      ? p.filter(x => x.text !== job.text)
      : p.length >= MAX_ROWS ? p : [...p, job])
  }

  function addCustom() {
    const t = custom.trim()
    if (!t || picked.length >= MAX_ROWS || pickedText.has(t)) return
    setPicked(p => [...p, { emoji: '⭐', text: t, stars: 1 }])
    setCustom('')
  }

  // Whatever is left of the eleven rows prints as a blank line, so the chart
  // always fills the page and there is still room for a Tuesday afterthought.
  const blanks = Math.max(0, MAX_ROWS - picked.length)
  const name = childName.trim()

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 20px 120px' }}>
      <style>{`
        @media print {
          /* Tidy: nothing from the app frame lands on the sheet, only the
             chart and the cut-out page. */
          header, .bottom-tab-bar, .rightnow-desktop, .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 10mm; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          .cut-page { page-break-before: always; }
        }
        .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
      `}</style>

      <div className="no-print">
        <Link href="/dashboard/printables" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← All printables
        </Link>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '14px 0 8px' }}>Star chart builder</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
          Put your own jobs on it, then print
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 26, maxWidth: 560 }}>
          One press prints two pages: the chart with your jobs on it, and a sheet of gold stars to cut out. Choose the jobs here and they print properly every time.
        </p>

        {/* Their name, its own tidy field with a label above it. */}
        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
          Whose chart is it?
        </label>
        <input
          value={childName}
          onChange={e => setChildName(e.target.value)}
          maxLength={20}
          placeholder="Their name (optional)"
          style={{ width: '100%', maxWidth: 340, padding: '13px 16px', borderRadius: 14, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none', marginBottom: 26 }}
        />

        {/* Which child, only when there is more than one named. A single child
            family gets no switcher, because a control with one option is just
            a label that looks tappable. */}
        {childOptions.length > 1 && (
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
              Whose jobs?
            </label>
            <div className="chip-row">
              {childOptions.map(k => {
                const on = forChild === k.id
                return (
                  <button
                    key={k.id}
                    onClick={() => {
                      setForChild(k.id)
                      setChildName(k.name)
                      // Swap the rows to that child's jobs. Anything the parent
                      // typed by hand is kept, since it belongs to the chart
                      // rather than to either child's board.
                      const theirs = yourJobs
                        .filter(j => j.childId === null || j.childId === k.id)
                        .slice(0, MAX_ROWS)
                        .map(({ emoji, text, stars }) => ({ emoji, text, stars }))
                      const ownText = new Set(yourJobs.map(j => j.text))
                      setPicked(p => {
                        const handTyped = p.filter(x => !ownText.has(x.text) && !POOL.some(g => g.jobs.some(j => j.text === x.text)))
                        return [...theirs, ...handTyped].slice(0, MAX_ROWS)
                      })
                    }}
                    aria-pressed={on}
                    style={{
                      padding: '9px 15px', borderRadius: 100, cursor: 'pointer',
                      border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta-lt)' : '#fff',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)',
                    }}
                  >
                    {k.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Their real jobs first, before our suggestions. A parent who has set
            up the board should recognise this page immediately rather than
            hunting our menu for things they have already typed once. */}
        {mine.length > 0 && (
          <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 16, padding: '15px 16px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 5 }}>
              Your jobs, already on the board
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 11 }}>
              These are ticked for you. Change a job on the quests board and print this again to keep the fridge and the app saying the same thing.
            </p>
            <div className="chip-row">
              {mine.map(job => {
                const on = pickedText.has(job.text)
                return (
                  <button
                    key={`mine-${job.text}`}
                    onClick={() => toggle({ emoji: job.emoji, text: job.text, stars: job.stars })}
                    aria-pressed={on}
                    style={{
                      padding: '9px 14px', borderRadius: 100, cursor: 'pointer',
                      border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                      background: on ? '#fff' : 'rgba(255,255,255,0.55)',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)',
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                    }}
                  >
                    <span aria-hidden>{job.emoji}</span>
                    <span>{job.text}</span>
                    <span aria-hidden style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
                      {job.stars}★
                    </span>
                    {on && <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* The menu, each worth band in its own soft card so the three groups
            read cleanly instead of running together. Headed once a family has
            their own, so it is plainly extra rather than the main event. */}
        {mine.length > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '20px 0 10px' }}>
            Or add one of ours
          </div>
        )}
        <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
          {POOL.map(group => (
            <div key={group.group} style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '15px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 11 }}>
                {group.group}
              </div>
              <div className="chip-row">
                {group.jobs.map(job => {
                  const on = pickedText.has(job.text)
                  return (
                    <button
                      key={job.text}
                      onClick={() => toggle(job)}
                      aria-pressed={on}
                      style={{
                        padding: '9px 14px', borderRadius: 100, cursor: 'pointer',
                        border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                        background: on ? 'var(--terracotta-lt)' : '#fff',
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)',
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                      }}
                    >
                      <span aria-hidden>{job.emoji}</span>
                      <span>{job.text}</span>
                      {on && <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add your own, matched to the same card look. */}
        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '15px 16px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 11 }}>
            One only your house has
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustom() }}
              maxLength={40}
              placeholder="Write a job and add it…"
              style={{ flex: 1, minWidth: 0, padding: '12px 15px', borderRadius: 12, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none' }}
            />
            <button
              onClick={addCustom}
              style={{ padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700 }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

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
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            1 star = 5 minutes
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
          Colour a star for every job done, or stick a gold star on from the next page. Four stars in a day brings a Planet Friend home, worth twenty minutes of screen time.
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
            cut them cleanly. Sized to drop into a chart cell. */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0,
          border: '1.3px dashed var(--ink-muted)', borderRadius: 6, overflow: 'hidden',
          margin: '16px 0 20px',
        }}>
          {Array.from({ length: 36 }, (_, i) => (
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
            1 star = 5 minutes of screen time
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.5, marginBottom: 14 }}>
            Four stars in a day brings one Planet Friend home, worth twenty minutes. Collect the whole family.
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
      </div>

      {/* One tidy action bar, fixed low on the screen the Mobbin way, so the
          print button is always in reach however far the menu runs. */}
      {/* above-tab-bar, not bottom: 0. Pinned to the floor, this bar sat UNDER
          the global tab bar on a phone, and the count line is long enough that
          the row wrapped, so the Print button was the part pushed out of sight.
          The one button the whole page exists for was unreachable on mobile
          while the page still looked finished. The class for this already
          existed for the shop basket; this bar had just never adopted it. */}
      <div className="no-print above-tab-bar" style={{
        background: 'rgba(249,248,246,0.94)', backdropFilter: 'blur(8px)',
        borderTop: '1.5px solid var(--border)', padding: '12px 20px',
      }}>
        {/* The button leads on a phone and the count follows, so the action is
            never the thing that wraps away. Side by side again once there is
            room for both. */}
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap-reverse' }}>
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
            {picked.length}/{MAX_ROWS} jobs on the chart{blanks > 0 ? `, ${blanks} blank ${blanks === 1 ? 'row' : 'rows'} for a pen` : ', full chart'}
          </span>
          <button
            // Record the print, then print. Fire and forget, and never awaited:
            // the chart has to open the dialog whether or not the write lands,
            // so a slow or failed save can never stand between a parent and
            // their paper. Worst case the board's badge is out by one print.
            onClick={() => {
              fetch('/api/printables/star-chart-print', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
              }).catch(() => { /* the chart still prints */ })
              window.print()
            }}
            className="btn btn-gold"
            style={{ padding: '13px 24px', fontSize: 'var(--text-md)' }}
          >
            🖨️ Print the chart and stickers
          </button>
        </div>
      </div>
    </div>
  )
}
