'use client'

import { useMemo, useState } from 'react'
import { BEST_JOBS, JOB_KINDS, KIND_TINT, kindForTitle, type BestJob, type JobKind } from '@/lib/quests/best-jobs'
import { QUEST_TEMPLATES } from '@/lib/quests/templates'
import { AGE_BAND_TO_STAGE, STAGE_LABELS, type StageKey } from '@/lib/quests/game-picks'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import type { JobBand } from '@/lib/quests/job-time'
import { scheduleLabel } from '@/lib/quests/due'
import DayPicker from '@/components/quests/DayPicker'

// The job picker: the best jobs for this child's age, in order of most
// useful, one tap to add and send.
//
// Justin, 1 September 2026, with a screenshot of the old chips: make it top
// visual UX like the best Mobbin examples, Apple level, the best age related
// jobs in order of most useful, super easy to add and send to the child's
// app, happy news style icons, matching the look of the child's app.
//
// Mobbin, read that evening. Greenlight's Add Chore puts your own chore first
// and the suggestions under it as rows. GoHenry's Add a task lists Popular
// tasks as rows with a tinted rounded square icon on the left and the value
// on the right. Finch's Goal ideas has category tabs across the top, a plus
// on every row, and an added row turns green with a tick and stays where it
// is. Liven does the same with the input above. The shape they agree on is
// the shape here: rows, not chips. One icon tile, one title, one value, one
// plus. Categories as one scroll row. Added is a green tick in place.
//
// Why rows and not chips. A chip sizes itself to its words, so on a phone
// with the text turned up (Justin's) each one wrapped to two or three lines
// and thirty of them read as a wall. A row gives the words the whole width,
// keeps the tile and the plus the same size on every row, and puts the tap
// target in the same place every time.
//
// The tiles match the child's app: the same rounded square with a pastel
// tint from the stage palette and the emoji centred, so what a parent adds
// here looks like what the child sees there. The Planet Friend in the header
// is the happy news ring the child app celebrates with, so the picks read as
// the child's own guide making them.

type Schedule = BestJob['schedule']

/** "every Tuesday" reads as a sentence; the eyebrow needs it as a label. */
const capitalise = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)

export type PickerJob = {
  title: string
  emoji: string
  stars: number
  schedule: Schedule
  /** Weekday numbers when the parent named them, 0 Sunday through 6 Saturday. */
  scheduleDays: number[] | null
  band: JobBand | null
}

type RowState = 'idle' | 'adding' | 'added' | 'failed'

// ── THE FIFTH CHOICE (8 September 2026) ─────────────────────────────────────
//
// Justin: "we previously had a setting whether a one off day, recurring, or one
// per week etc, like Google calendar entries. Can we get that back?"
//
// schedule_days has been in the table since migration 060 and is honoured by
// the due rule, the board, the child's list, the streak and the reminder cron.
// The only thing missing was the way in. 'days' is not a schedule value in the
// database: it is this picker's word for "I will name them", and what gets
// sent is schedule daily plus the chosen schedule_days, which every reader
// already prefers over the schedule word.
type WhenKey = Schedule | 'days'

const WHEN: { key: WhenKey; label: string }[] = [
  { key: 'daily',    label: 'Every day' },
  { key: 'weekdays', label: 'School days' },
  { key: 'weekend',  label: 'Weekends' },
  { key: 'days',     label: 'Certain days' },
  { key: 'once',     label: 'Just once' },
]
const WHEN_LABEL: Record<WhenKey, string> = {
  daily: 'Every day', weekdays: 'School days', weekend: 'Weekends',
  days: 'Certain days', once: 'Just once',
}

const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
}

// A row in the list: a real job from the library or from this family's own
// history, plus the state its plus is in.
type RowJob = BestJob & { source: 'best' | 'previous' | 'more' }

export default function JobPicker({
  childName,
  ageBand,
  hasApp,
  onBoard,
  previous = [],
  busy = false,
  onAdd,
}: {
  childName: string | null
  ageBand: string | null
  /** Whether the child has the app, which decides whether an add is a send. */
  hasApp: boolean
  /** Titles already on the child's board, shown ticked so the list stays whole. */
  onBoard: string[]
  /** Jobs this family has used before and turned off. Back in one tap. */
  previous?: { title: string; emoji: string; stars: number; schedule: string }[]
  busy?: boolean
  /** Adds the job. Resolves true when it landed, false when it did not. */
  onAdd: (job: PickerJob) => Promise<boolean>
}) {
  const stage: StageKey = AGE_BAND_TO_STAGE[ageBand ?? ''] ?? 'builder'
  const friend = STAGE_CHARACTERS.find(c => c.key === ({ foundation: 'pebble', builder: 'bloop', explorer: 'orbit', shaper: 'nova', independent: 'cosmo' } as const)[stage])
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  // "Ages 8 to 10" as "8 to 10", so the eyebrow holds one line on a phone.
  const ages = STAGE_LABELS[stage].ages.replace(/^Ages /, '').toLowerCase()

  const [kind, setKind] = useState<JobKind | 'all'>('all')
  const [state, setState] = useState<Record<string, RowState>>({})
  const [when, setWhen] = useState<Record<string, WhenKey>>({})
  // Per row, because a parent setting reading to Tuesday and Thursday and then
  // opening the next job must not find their days already ticked on it.
  const [days, setDays] = useState<Record<string, number[]>>({})
  const [openRow, setOpenRow] = useState<string | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const [allPrevious, setAllPrevious] = useState(false)

  const boardSet = useMemo(() => new Set(onBoard.map(t => t.toLowerCase())), [onBoard])

  const best: RowJob[] = useMemo(
    () => BEST_JOBS[stage].map(j => ({ ...j, source: 'best' as const })),
    [stage],
  )
  const bestTitles = useMemo(() => new Set(best.map(j => j.title.toLowerCase())), [best])

  // This family's own history, as rows, tinted by what the words say.
  const prev: RowJob[] = useMemo(
    () => previous
      .filter(p => !bestTitles.has(p.title.toLowerCase()))
      .map(p => ({
        title: p.title, emoji: p.emoji, stars: p.stars,
        schedule: (['daily', 'weekdays', 'weekend', 'once'].includes(p.schedule) ? p.schedule : 'daily') as Schedule,
        kind: kindForTitle(p.title), why: 'One of yours, from before.', source: 'previous' as const,
      })),
    [previous, bestTitles],
  )

  // Everything else in the library, folded away under More ideas.
  const more: RowJob[] = useMemo(
    () => QUEST_TEMPLATES
      .filter(t => !bestTitles.has(t.title.toLowerCase()) && !previous.some(p => p.title.toLowerCase() === t.title.toLowerCase()))
      .map(t => ({
        title: t.title, emoji: t.emoji, stars: t.stars, schedule: t.schedule,
        kind: t.play ? 'play' as const : kindForTitle(t.title),
        why: t.play ? 'Play pays best on purpose.' : 'From the library.',
        source: 'more' as const,
      })),
    [bestTitles, previous],
  )

  const shown = kind === 'all' ? best : best.filter(j => j.kind === kind)

  async function add(job: RowJob) {
    const key = job.title
    if (busy || state[key] === 'adding' || state[key] === 'added') return
    setState(s => ({ ...s, [key]: 'adding' }))
    setOpenRow(null)
    // Certain days rides on the daily schedule, because schedule_days wins
    // over the word everywhere it is read. Days with nothing ticked falls back
    // to every day rather than adding a job that is never due.
    const chosenWhen = when[key] ?? job.schedule
    const chosenDays = chosenWhen === 'days' ? (days[key] ?? []) : []
    const ok = await onAdd({
      title: job.title, emoji: job.emoji, stars: job.stars,
      schedule: chosenWhen === 'days' ? 'daily' : chosenWhen,
      scheduleDays: chosenDays.length ? chosenDays : null,
      band: job.band ?? null,
    })
    setState(s => ({ ...s, [key]: ok ? 'added' : 'failed' }))
  }

  const row = (job: RowJob) => {
    const key = job.title
    // Added in this sitting wins over already on the board, because after the
    // add the board reloads and would otherwise turn Sent to Alfie into On
    // the board already before the parent has read it.
    const justAdded = state[key] === 'added'
    const already = !justAdded && boardSet.has(key.toLowerCase())
    const st: RowState = already ? 'added' : (state[key] ?? 'idle')
    const done = st === 'added'
    const tint = KIND_TINT[job.kind]
    const chosen = when[key] ?? job.schedule
    const rowDays = days[key] ?? []
    // Named days read back as the days, not as the category. A parent who has
    // ticked Tuesday should see Tuesday.
    const whenSummary = chosen === 'days'
      ? (rowDays.length ? capitalise(scheduleLabel('daily', rowDays)) : 'Pick days')
      : WHEN_LABEL[chosen]
    const open = openRow === key && !done
    return (
      <div
        key={`${job.source}:${key}`}
        style={{
          background: done ? 'var(--tint-sage)' : '#fff',
          border: '2px solid var(--ink)',
          borderRadius: 16, padding: '7px 8px',
          boxShadow: done ? 'none' : '0 4px 0 var(--ink)',
          transition: 'background 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* The tile: the child app's rounded square, tinted by kind. */}
          <span aria-hidden style={{
            flexShrink: 0, width: 40, height: 40, borderRadius: 12,
            background: done ? '#fff' : tint.bg, border: `1.5px solid ${done ? '#CFE0D8' : tint.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 21, lineHeight: 1,
            animation: justAdded ? 'gcJobTilePop 0.45s cubic-bezier(0.22,1.2,0.36,1)' : undefined,
          }}>
            {job.emoji}
          </span>

          {/* TWO SHORT LINES, NOT FIVE.
              Justin, 10 September 2026: the page "seems to have too much text
              please don't stop redesigning until super focussed on user easy to
              add".

              Every row carried its title, then a three line reason, then
              "SET TO SCHOOL DAYS · TAP TO CHANGE" on two more. Fifteen of them
              made a 3554px page to add one job. Greenlight, Finch, Liven and
              Me+ all do this same screen and all agree on one line per row with
              no explanation on it at all: the plus explains itself.

              So the reason moves into the open row, beside the repeat chips it
              belongs with. Nothing is deleted. It is one tap in rather than
              printed fifteen times down a phone. */}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.2,
              letterSpacing: '-0.01em', overflowWrap: 'anywhere',
            }}>
              {job.title}
            </span>
            {done ? (
              <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--retro-green-dark)', lineHeight: 1.35, marginTop: 2 }}>
                {already ? 'On the board already' : hasApp ? `Sent to ${name}'s app ✓` : `On ${name}'s board ✓`}
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                <span style={{ ...EYEBROW, letterSpacing: '0.04em', color: 'var(--terracotta-dark)', flexShrink: 0 }}>
                  ⭐ {job.stars}
                </span>
                {/* ── THE REPEAT AS A CONTROL, NOT AS AN INSTRUCTION ──
                    Justin, earlier the same day: "here where it says every day
                    maybe we should be clearer that it's set as every day but
                    change here." It read "EVERY DAY · CHANGE" and both halves
                    looked like options.

                    The fix was "Set to Every day · tap to change", which is
                    unambiguous and is also seven words on every row. A pill
                    carrying the current value with a caret says the same two
                    things in two: this is what it is set to, and this is the
                    thing you press. Me+ does exactly this. */}
                <button
                  type="button"
                  onClick={() => setOpenRow(open ? null : key)}
                  aria-expanded={open}
                  aria-label={`${job.title}, repeats ${whenSummary}. Change how often`}
                  style={{
                    ...EYEBROW, letterSpacing: '0.04em', minWidth: 0,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    // Ink on butter, never white on butter. The house gold is
                    // a light colour: white on it measures 2.6 to 1, which is
                    // below every bar there is. Ink on it is the same pairing
                    // the chosen chip below uses, so open and chosen match.
                    color: open ? 'var(--ink)' : 'var(--ink-soft)',
                    background: open ? 'var(--terracotta)' : '#fff',
                    border: `1.5px solid ${open ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                    borderRadius: 100, padding: '3px 8px', cursor: 'pointer',
                    textAlign: 'left', overflowWrap: 'anywhere',
                  }}
                >
                  {whenSummary}
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 9 }}>{open ? '▴' : '▾'}</span>
                </button>
              </span>
            )}
          </span>

          {/* The one thing that adds. Butter with the house shadow while it is
              a plus, retro green with a tick once it has landed, so a parent
              adding four in a row can see each one arrive. */}
          <button
            type="button"
            onClick={() => add(job)}
            disabled={done || st === 'adding' || busy}
            aria-label={done ? `${job.title} added` : st === 'failed' ? `Try adding ${job.title} again` : `Add ${job.title}`}
            style={{
              flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
              border: '2px solid var(--ink)', cursor: done ? 'default' : 'pointer',
              background: done ? 'var(--retro-green)' : st === 'failed' ? 'var(--danger-bg)' : 'var(--terracotta)',
              color: done ? '#fff' : st === 'failed' ? 'var(--danger)' : 'var(--ink)',
              boxShadow: done ? 'none' : st === 'failed' ? '0 3px 0 var(--danger-border)' : '0 4px 0 var(--ink)',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: st === 'adding' ? 'var(--text-sm)' : 'var(--text-xl)',
              lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease, transform 0.12s ease',
              transform: st === 'adding' ? 'translateY(3px)' : 'none',
              opacity: busy && !done ? 0.7 : 1,
            }}
          >
            {done ? '✓' : st === 'adding' ? '…' : st === 'failed' ? '↻' : '+'}
          </button>
        </div>

        {/* Open: why this one is worth a star at this age, then the repeat
            chips. The reason lives here now rather than on every closed row. */}
        {open && (
          <div style={{ marginTop: 9 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 9px' }}>
              {job.why}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 7 }}>
              {WHEN.map(w => {
                const on = w.key === chosen
                return (
                  <button
                    key={w.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setWhen(s => ({ ...s, [key]: w.key }))}
                    style={{
                      cursor: 'pointer', borderRadius: 100, padding: '9px 10px',
                      fontFamily: 'var(--font-display)', fontWeight: on ? 800 : 700, fontSize: 'var(--text-base)',
                      color: 'var(--ink)', textAlign: 'center',
                      background: on ? 'var(--terracotta)' : '#fff',
                      border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                      boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : '0 1px 0 var(--border)',
                    }}
                  >
                    {w.label}
                  </button>
                )
              })}
              {chosen === 'days' && (
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 7, marginTop: 2 }}>
                  <DayPicker
                    days={rowDays}
                    onChange={d => setDays(s => ({ ...s, [key]: d }))}
                    idPrefix={`${key}-`}
                  />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.4 }}>
                    {rowDays.length ? `Due ${scheduleLabel('daily', rowDays)}.` : 'Tap the days it happens on.'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {st === 'failed' && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', margin: '8px 0 0', lineHeight: 1.4 }}>
            That did not send. Tap the arrow to try again.
          </p>
        )}
      </div>
    )
  }

  const kindChip = (key: JobKind | 'all', label: string) => {
    const on = kind === key
    return (
      <button
        key={key}
        type="button"
        aria-pressed={on}
        onClick={() => setKind(key)}
        style={{
          flexShrink: 0, cursor: 'pointer', borderRadius: 100, padding: '8px 14px',
          fontFamily: 'var(--font-display)', fontWeight: on ? 800 : 700, fontSize: 'var(--text-sm)',
          color: 'var(--ink)', whiteSpace: 'nowrap',
          background: on ? 'var(--terracotta)' : '#fff',
          border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
          boxShadow: on ? '0 2px 0 var(--terracotta-dark)' : '0 1px 0 var(--border)',
        }}
      >
        {label}
      </button>
    )
  }

  const sectionLabel = (text: string) => (
    <p style={{ ...EYEBROW, color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>{text}</p>
  )

  return (
    <section style={{ background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', borderRadius: 18, padding: '15px 10px 13px', marginBottom: 18 }}>
      <style>{`
        @keyframes gcJobTilePop { 0% { transform: scale(1) } 45% { transform: scale(1.14) rotate(-3deg) } 100% { transform: scale(1) } }
        @media (prefers-reduced-motion: reduce) { .gc-job-picker * { animation: none !important; transition: none !important } }
      `}</style>
      <div className="gc-job-picker">
        {/* The header: the child's Planet Friend in the happy news ring, the
            way the child app delivers good news, saying whose picks these are. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
          {friend && (
            <span aria-hidden style={{
              flexShrink: 0, width: 46, height: 46, borderRadius: '50%', overflow: 'hidden',
              background: '#FFF7E8', border: `3px solid ${friend.colour}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={friend.cutout} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </span>
          )}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ ...EYEBROW, display: 'block', color: friend?.colour ?? 'var(--terracotta-dark)', marginBottom: 2 }}>
              {friend ? `${friend.name}'s picks` : 'Best picks'} · {ages}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Best jobs for {name}
            </span>
            {/* ONE SHORT LINE. It was two: the ranking explained, the tap
                explained, and the already in count. The ranking is visible in
                the order, the count is on the rows themselves in green, and
                the only thing a parent cannot see is where the job goes. */}
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
              Tap + and it lands on {hasApp ? 'their app' : 'their board'}.
            </span>
          </span>
        </div>

        {/* Used before, as the same rows, so nothing on this screen is a chip. */}
        {prev.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {sectionLabel('Used before')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {(allPrevious ? prev : prev.slice(0, 3)).map(row)}
            </div>
            {/* A bordered pill, not a bare orange label. Set in the same mono
                caps as the section heading above it, a plain span of words
                reads as another heading rather than as the thing you press. */}
            {prev.length > 3 && (
              <button
                type="button"
                onClick={() => setAllPrevious(v => !v)}
                style={{
                  ...EYEBROW, letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 100,
                  cursor: 'pointer', color: 'var(--ink-soft)', padding: '5px 11px', marginTop: 7,
                }}
              >
                {allPrevious ? 'Show fewer' : `Show all ${prev.length}`}
                <span aria-hidden style={{ fontSize: 9 }}>{allPrevious ? '▴' : '▾'}</span>
              </button>
            )}
          </div>
        )}

        {/* One scroll row of kinds. Top picks is the ranked list whole; a
            kind narrows it and keeps the order. */}
        <div className="swipe-rail" style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '2px 2px 8px', margin: '0 -2px 8px' }} role="tablist" aria-label="Kinds of job">
          {kindChip('all', 'Top picks')}
          {JOB_KINDS.map(k => kindChip(k.key, k.label))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {shown.map(row)}
          {shown.length === 0 && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '4px 0 0', lineHeight: 1.5 }}>
              None of that kind up here. More ideas has the rest.
            </p>
          )}
        </div>

        {/* The rest of the library, folded. */}
        {more.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              onClick={() => setMoreOpen(v => !v)}
              aria-expanded={moreOpen}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                background: 'var(--cream)', border: '2px solid var(--ink)', borderRadius: 14,
                padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)',
              }}
            >
              <span>{moreOpen ? 'Fewer ideas' : `More ideas · ${more.length}`}</span>
              <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900 }}>{moreOpen ? '▴' : '▾'}</span>
            </button>
            {moreOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 7 }}>
                {(kind === 'all' ? more : more.filter(j => j.kind === kind)).map(row)}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
