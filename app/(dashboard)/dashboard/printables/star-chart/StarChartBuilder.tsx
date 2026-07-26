'use client'

import { useState } from 'react'
import Link from 'next/link'

// Build the star chart, THEN print it. The paper chart has four blank rows for
// a pen, which is fine on the fridge and useless before it is on the fridge: a
// parent who wants their own jobs printed properly had to hand write them onto
// every reprint forever.
//
// So this is the same chart, typed. Pick from the menu, add your own, put their
// name on it, print. What comes out has your jobs printed in, and the blank rows
// only appear for whatever is left over.
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

function Star({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'none', stroke: colour, strokeWidth: 1.7, strokeLinejoin: 'round' }}>
      <path d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z" />
    </svg>
  )
}

export default function StarChartBuilder() {
  const [childName, setChildName] = useState('')
  const [picked, setPicked] = useState<Job[]>([
    POOL[0].jobs[0], POOL[0].jobs[3], POOL[1].jobs[0], POOL[2].jobs[0], POOL[2].jobs[1],
  ])
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
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 10mm; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>

      <div className="no-print">
        <Link href="/dashboard/printables" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← All printables
        </Link>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '14px 0 8px' }}>Star chart builder</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
          Put your own jobs on it, then print
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 20, maxWidth: 560 }}>
          The printed chart has blank rows for a pen, which is fine once it is on the fridge and no help before it. Choose your jobs here and they print properly, every time you reprint.
        </p>

        <input
          value={childName}
          onChange={e => setChildName(e.target.value)}
          maxLength={20}
          placeholder="Their name (optional)"
          style={{ width: '100%', maxWidth: 320, padding: '12px 15px', borderRadius: 12, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', outline: 'none', marginBottom: 20 }}
        />

        {POOL.map(group => (
          <div key={group.group} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
              {group.group}
            </div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {group.jobs.map(job => {
                const on = pickedText.has(job.text)
                return (
                  <button
                    key={job.text}
                    onClick={() => toggle(job)}
                    style={{
                      padding: '9px 14px', borderRadius: 100, cursor: 'pointer',
                      border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta-lt)' : '#fff',
                      fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)',
                    }}
                  >
                    {job.emoji} {job.text}{on ? ' ✓' : ''}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, margin: '18px 0 22px' }}>
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCustom() }}
            maxLength={40}
            placeholder="Or write a job only your house has…"
            style={{ flex: 1, minWidth: 0, padding: '12px 15px', borderRadius: 12, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
          />
          <button
            onClick={addCustom}
            style={{ padding: '12px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}
          >
            Add
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 26 }}>
          <button
            onClick={() => window.print()}
            className="btn btn-gold"
            style={{ padding: '13px 22px', fontSize: 14 }}
          >
            🖨️ Print my chart ({picked.length}/{MAX_ROWS})
          </button>
          <span style={{ fontSize: 13.5, color: 'var(--ink-muted)' }}>
            {blanks > 0 ? `${blanks} blank ${blanks === 1 ? 'row' : 'rows'} left for a pen` : 'Full chart, no blanks left'}
          </span>
        </div>
      </div>

      {/* The sheet itself. What is on screen here is exactly what prints. */}
      <div className="print-sheet" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              The star reward chart
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.05 }}>
              {name ? `${name}'s star chart` : 'My star chart'}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'var(--ink)' }}>
            1 star = 5 minutes
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: 'var(--ink-soft)' }}>
              4 stars in a day = one Planet Friend
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--ink)', color: '#fff', textAlign: 'left', padding: '7px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--border)', width: '34%' }}>
                My jobs
              </th>
              {DAYS.map((d, i) => (
                <th key={d} style={{ background: DAY_BG[i], color: DAY_INK[i], padding: '7px 0', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--border)' }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {picked.map((job, r) => (
              <tr key={job.text}>
                <td style={{ border: '1px solid var(--border)', padding: '6px 10px', background: r % 2 ? 'var(--cream)' : '#fff' }}>
                  <span style={{ fontSize: 15, marginRight: 7 }}>{job.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--ink)' }}>{job.text}</span>
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
                  <span style={{ fontSize: 15, marginRight: 7 }}>✏️</span>
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
                <span style={{ fontSize: 15, marginRight: 7 }}>⭐</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13.5, color: 'var(--ink)' }}>Stars today</span>
              </td>
              {DAYS.map(d => (
                <td key={d} style={{ border: '1px solid var(--butter-dark)', height: 30, background: 'var(--terracotta)' }} />
              ))}
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12, textAlign: 'center' }}>
          Colour a star for every job done. Four stars in a day brings a Planet Friend home, worth twenty minutes of screen time.
        </p>
      </div>
    </div>
  )
}
