'use client'

import { useMemo, useState } from 'react'
import { BEST_JOBS, JOB_KINDS, KIND_TINT, kindForTitle, type BestJob, type JobKind } from '@/lib/quests/best-jobs'
import { QUEST_TEMPLATES } from '@/lib/quests/templates'
import { AGE_BAND_TO_STAGE, STAGE_LABELS, type StageKey } from '@/lib/quests/game-picks'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import type { JobBand } from '@/lib/quests/job-time'

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

export type PickerJob = {
  title: string
  emoji: string
  stars: number
  schedule: Schedule
  band: JobBand | null
}

type RowState = 'idle' | 'adding' | 'added' | 'failed'

const WHEN: { key: Schedule; label: string }[] = [
  { key: 'daily',    label: 'Every day' },
  { key: 'weekdays', label: 'School days' },
  { key: 'weekend',  label: 'Weekends' },
  { key: 'once',     label: 'Just once' },
]
const WHEN_LABEL: Record<Schedule, string> = {
  daily: 'Every day', weekdays: 'School days', weekend: 'Weekends', once: 'Just once',
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
  const [when, setWhen] = useState<Record<string, Schedule>>({})
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
  const onBoardCount = best.filter(j => boardSet.has(j.title.toLowerCase())).length

  async function add(job: RowJob) {
    const key = job.title
    if (busy || state[key] === 'adding' || state[key] === 'added') return
    setState(s => ({ ...s, [key]: 'adding' }))
    setOpenRow(null)
    const ok = await onAdd({
      title: job.title, emoji: job.emoji, stars: job.stars,
      schedule: when[key] ?? job.schedule, band: job.band ?? null,
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
    const open = openRow === key && !done
    return (
      <div
        key={`${job.source}:${key}`}
        style={{
          background: done ? 'var(--tint-sage)' : '#fff',
          border: '2px solid var(--ink)',
          borderRadius: 18, padding: '10px 11px',
          boxShadow: done ? 'none' : '0 4px 0 var(--ink)',
          transition: 'background 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          {/* The tile: the child app's rounded square, tinted by kind. Tap
              the tile or the words to open the repeat chips; the plus is the
              only thing that adds. */}
          <button
            type="button"
            onClick={() => !done && setOpenRow(open ? null : key)}
            aria-expanded={open}
            aria-label={done ? job.title : `${job.title}, change how often`}
            style={{
              flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12,
              background: 'none', border: 'none', padding: 0, textAlign: 'left',
              cursor: done ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            <span aria-hidden style={{
              flexShrink: 0, width: 50, height: 50, borderRadius: 15,
              background: done ? '#fff' : tint.bg, border: `1.5px solid ${done ? '#CFE0D8' : tint.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 25, lineHeight: 1,
              animation: justAdded ? 'gcJobTilePop 0.45s cubic-bezier(0.22,1.2,0.36,1)' : undefined,
            }}>
              {job.emoji}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25,
                overflowWrap: 'anywhere',
              }}>
                {job.title}
              </span>
              {done ? (
                <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--retro-green-dark)', lineHeight: 1.4, marginTop: 2 }}>
                  {already ? 'On the board already' : hasApp ? `Sent to ${name}'s app ✓` : `On ${name}'s board ✓`}
                </span>
              ) : (
                <>
                  <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
                    {job.why}
                  </span>
                  <span style={{ ...EYEBROW, display: 'block', letterSpacing: '0.06em', color: open ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginTop: 5 }}>
                    {WHEN_LABEL[chosen]}{open ? '' : ' · change'}
                  </span>
                </>
              )}
            </span>
          </button>

          {/* The value over the plus, GoHenry's column: what it pays, then
              the button that adds it. Butter with the house shadow while it
              is a plus, the retro green with a tick once it has landed, so a
              parent adding four in a row can see each one arrive. */}
          <span style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            {!done && (
              <span style={{
                ...EYEBROW, letterSpacing: '0.06em', color: 'var(--terracotta-dark)',
                background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)',
                borderRadius: 100, padding: '2px 8px', whiteSpace: 'nowrap',
              }}>
                ⭐ {job.stars}
              </span>
            )}
            <button
              type="button"
              onClick={() => add(job)}
              disabled={done || st === 'adding' || busy}
              aria-label={done ? `${job.title} added` : st === 'failed' ? `Try adding ${job.title} again` : `Add ${job.title}`}
              style={{
                width: 44, height: 44, borderRadius: '50%',
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
          </span>
        </div>

        {/* The repeat chips, inline, only when asked for. One tap on the plus
            takes the job's own repeat; this is for the parent who wants it
            on weekends instead, without a wizard in the way. */}
        {open && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginTop: 10 }}>
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
    <section style={{ background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', borderRadius: 18, padding: '18px 14px 16px', marginBottom: 18 }}>
      <style>{`
        @keyframes gcJobTilePop { 0% { transform: scale(1) } 45% { transform: scale(1.14) rotate(-3deg) } 100% { transform: scale(1) } }
        @media (prefers-reduced-motion: reduce) { .gc-job-picker * { animation: none !important; transition: none !important } }
      `}</style>
      <div className="gc-job-picker">
        {/* The header: the child's Planet Friend in the happy news ring, the
            way the child app delivers good news, saying whose picks these are. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
          {friend && (
            <span aria-hidden style={{
              flexShrink: 0, width: 58, height: 58, borderRadius: '50%', overflow: 'hidden',
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
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
              In order of most useful at this age. Tap + and it is on {hasApp ? 'their app' : 'their board'}.
              {onBoardCount > 0 && ` ${onBoardCount} of these ${onBoardCount === 1 ? 'is' : 'are'} in already.`}
            </span>
          </span>
        </div>

        {/* Used before, as the same rows, so nothing on this screen is a chip. */}
        {prev.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {sectionLabel('You have used these before')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(allPrevious ? prev : prev.slice(0, 3)).map(row)}
            </div>
            {prev.length > 3 && (
              <button type="button" onClick={() => setAllPrevious(v => !v)} style={{ ...EYEBROW, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--terracotta)', padding: '8px 4px 0' }}>
                {allPrevious ? 'Show fewer' : `Show all ${prev.length}`}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shown.map(row)}
          {shown.length === 0 && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '4px 0 0', lineHeight: 1.5 }}>
              Nothing of that kind in the top picks for this age. More ideas below has the rest.
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
              <span>{moreOpen ? 'Fewer ideas' : `More ideas, ${more.length} from the library`}</span>
              <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900 }}>{moreOpen ? '▴' : '▾'}</span>
            </button>
            {moreOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {(kind === 'all' ? more : more.filter(j => j.kind === kind)).map(row)}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
