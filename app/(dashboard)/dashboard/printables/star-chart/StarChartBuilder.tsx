'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StarChartSheet, { MAX_ROWS } from '@/components/printables/StarChartSheet'
import KidBackLink from '@/components/kid/KidBackLink'
import { HAPPY, HappyMasthead, Burst } from '@/components/kid/HappyNewsBits'
import { printOrOpen, packForUrl, tickPrintableStep, fiveADayHref } from '@/lib/kid/print-anywhere'

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

// MAX_ROWS lives with the sheet now (components/printables/StarChartSheet),
// because the child's print page caps at the same eleven and two elevens is
// how a chart one day prints with a row missing.

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

export type YourJob = Job & { childId: string | null }

export default function StarChartBuilder({
  yourJobs = [], childOptions = [], defaultChildName = '',
  weeks = [],
  variant = 'parent',
  recordUrl = '/api/printables/star-chart-print',
  recordBody = {},
  backHref = '/dashboard/printables',
  backLabel = 'All printables',
  kidToken = null,
  rateByChild = {},
  defaultRate = 5,
}: {
  /** The family's real active jobs, straight off the quests board. */
  yourJobs?: YourJob[]
  /** Named children, so a two child family can print each chart. */
  childOptions?: { id: string; name: string }[]
  defaultChildName?: string
  /**
   * The week this chart is for, and the one after it, worked out on the server.
   *
   * On the server deliberately, because the whole point is Europe/London and a
   * browser clock is whatever the device says it is. A parent in Spain printing
   * a chart for a child at a school in Kent should get the Kent week.
   *
   * Empty for the signed out lead magnet version, which prints undated: a chart
   * for a family we have never met has no week to be for.
   *
   * `name` is set on the server rather than read off the index, because on a
   * Sunday the first week IS next week and a chip reading "This week" over a
   * Monday that has not happened yet is simply wrong.
   */
  weeks?: { start: string; label: string; name: string }[]
  /**
   * The SAME builder runs on the child's app. Justin, 10 August 2026, on the
   * first child page being a fixed sheet: "we create a custom version where
   * they add the tasks... make sure we revert back to custom version on both
   * parents and child's." So the child gets the whole thing, picking and
   * adding jobs included, and the two can never drift because they are one
   * component. 'kid' softens the words to the child's voice; the print
   * record posts to the token authed route via recordUrl and recordBody.
   */
  variant?: 'parent' | 'kid'
  recordUrl?: string
  recordBody?: Record<string, unknown>
  backHref?: string
  backLabel?: string
  /** The child's link token, for the print page the installed app opens in Safari. */
  kidToken?: string | null
  /**
   * What one star buys, per child (migration 225), so the printed deal
   * matches the app's money. The signed out lead magnet gets the default.
   */
  rateByChild?: Record<string, number>
  defaultRate?: number
} = {}) {
  const router = useRouter()
  const [childName, setChildName] = useState(defaultChildName)
  // WHICH WEEK. Defaults to the first, which is this week every day except
  // Sunday, when it is the week about to start. See chartWeekStart.
  const [weekIdx, setWeekIdx] = useState(0)
  const week = weeks[weekIdx] ?? null
  // Which child's jobs to show. Null means everyone, which is also what a
  // family with one child sees, so nothing extra appears for them.
  const [forChild, setForChild] = useState<string | null>(
    childOptions.length > 1 ? (childOptions[0]?.id ?? null) : null,
  )

  // Jobs for the chosen child, plus the whole family ones, which belong to
  // every child and so appear whoever is picked.
  const mine = yourJobs.filter(j => forChild === null || j.childId === null || j.childId === forChild)

  // The deal printed on the sheet follows the chosen child's own rate. A one
  // child family has no switcher, so the default carries their rate instead.
  const rate = (forChild && rateByChild[forChild]) || defaultRate

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
             chart and the cut-out page. The sheet's own print rules (page
             size, sheet reset, page break) live with StarChartSheet. */
          header, .bottom-tab-bar, .rightnow-desktop, .no-print { display: none !important; }
        }
        .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
      `}</style>

      <div className="no-print">
        {variant === 'kid' ? (
          // The child's way in: the way back through history, the round close,
          // and the happy news masthead with the row count on a burst.
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
              <KidBackLink href={backHref} label={backLabel} color="var(--ink)" />
              <KidBackLink href={backHref} label="Close" variant="close" />
            </div>
            <HappyMasthead
              kicker="My star chart"
              title="Pick your jobs, then print"
              sub="On the fridge all week. Your grown up puts the stars in your bank."
              right={<Burst size={72} color={HAPPY.butterLt}><span style={{ fontSize: 24 }}>{picked.length}</span><br /><span style={{ fontSize: 10, letterSpacing: '0.08em' }}>JOBS</span></Burst>}
              style={{ marginBottom: 18 }}
            />
          </>
        ) : (
          <>
            <Link href={backHref} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              ← {backLabel}
            </Link>
            <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '14px 0 8px' }}>
              Star chart builder
            </p>
            <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
              Put your own jobs on it, then print
            </h1>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 26, maxWidth: 560 }}>
              One press prints two pages: the chart with your jobs on it, and a sheet of gold stars to cut out. No phone needed on their side: you tick the jobs in the app, and their screen time runs from your phone on the family TV, console or tablet. The whole loop is printed on the sheet.
            </p>
          </>
        )}

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

      {/* WHICH WEEK, on screen only. Two options and never more: a chart three
          weeks out is a chart nobody will still want by the time it matters,
          and the jobs on it will have changed. Hidden for the one week case,
          which is what the signed out lead magnet gets. */}
      {weeks.length > 1 && (
        <div className="no-print" style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
            Which week
          </div>
          <div className="chip-row">
            {weeks.map((w, i) => (
              <button
                key={w.start}
                onClick={() => setWeekIdx(i)}
                style={{
                  padding: '10px 16px', borderRadius: 13, cursor: 'pointer',
                  border: weekIdx === i ? 'none' : '1.5px solid var(--border)',
                  background: weekIdx === i ? 'var(--deep-teal)' : '#fff',
                  color: weekIdx === i ? '#fff' : 'var(--ink)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                  boxShadow: weekIdx === i ? '0 3px 0 var(--deep-teal-dark, #1F5D57)' : 'none',
                }}
              >
                {w.name}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)', opacity: 0.75, marginLeft: 7 }}>
                  {w.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The sheet itself, the SHARED one. What is on screen here is exactly
          what prints, and exactly what the child's own print page prints.
          On a narrow phone the seven day columns crush the headers into each
          other, so the preview scrolls sideways instead; print ignores the
          wrapper entirely, the A4 page being wider than the minimum anyway. */}
      <style>{`@media print { .sheet-scroll { overflow: visible !important } .sheet-scroll > div { min-width: 0 !important } }`}</style>
      <div className="sheet-scroll" style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 560 }}>
          <StarChartSheet name={name} weekLabel={week?.label ?? null} jobs={picked} starMinutes={rate} />
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
              fetch(recordUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // The week goes with it (migration 170), so the weekend offer
                // knows whether the fridge has a sheet for the Monday coming
                // rather than only whether this family has ever printed one.
                // recordBody carries the child's link token when the builder
                // runs on the child app, where there is no session.
                body: JSON.stringify({ ...recordBody, weekStart: week?.start ?? null }),
              }).catch(() => { /* the chart still prints */ })
              // The child's print: tick the five a day, then print in place
              // where the browser can, or open the chart's print page in
              // Safari where it cannot (the installed iOS app). See
              // lib/kid/print-anywhere.
              if (variant === 'kid' && kidToken) {
                // The tick leaves first, in the same tap as the print. When
                // it answers that one of today's five just landed, the app
                // goes home to the day with the next step lit. Justin, 2
                // September 2026: "go back to the 5 a day marked as completed
                // and onto next." On the installed app that happens behind
                // Safari, so the child returns to a day that has moved on.
                const tick = tickPrintableStep(kidToken)
                const packed = packForUrl({ name, weekLabel: week?.label ?? null, jobs: picked, starMinutes: rate })
                printOrOpen(`/k/${kidToken}/print?star=${packed}`)
                void tick.then(t => { if (t?.ticked) router.push(fiveADayHref(kidToken)) })
                return
              }
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
