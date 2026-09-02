'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Printable } from '@/lib/printables/registry'
import type { HappyNewsItem } from '@/components/celebrate/HappyNews'
import { playKidSound } from '@/lib/sound/kidSounds'
import { printPack } from '@/lib/kid/print-sheet'
import { printOrOpen, tickPrintableStep, type PrintableTick } from '@/lib/kid/print-anywhere'
import KidSheetPaper from '@/components/kid/KidSheetPaper'
import DrawnPaper from '@/components/printables/drawn/DrawnPaper'
import type { DealFacts } from '@/components/printables/drawn'
import { HAPPY, HappyMasthead, Burst, Sticker, SmileyDot, StarShape, WavyRule, CloseCross, HappyScatter } from '@/components/kid/HappyNewsBits'

// The Printables tab on the child app, the happy news edition.
//
// Justin, 2 September 2026, from Jonny's app: printables "need better happy
// news type UI, make it easy to select and most common ones first, keep it
// simple. Make super fun and luxury."
//
// WHAT IT WAS. Two plain hero rows, then one tall white card per sheet with
// three stacked buttons on every card. Eight sheets was twenty four buttons
// on one scroll, and nothing on the tab looked like a treat.
//
// WHAT IT IS. A butter masthead (the newspaper name treatment, smiley dots,
// the child's tally on a burst), the two things they make themselves as big
// poster tiles, sticker chips for the kinds, then the sheets as a two column
// poster grid: the paper itself, a star sticker with its worth, the title
// under it. Me+ and Finch on Mobbin for the grid, The Happy Newspaper for
// the energy, our own tokens and our own drawings throughout.
//
// ONE TAP OPENS ONE SHEET. All the buttons a sheet needs live on its own
// screen: one big Print it, then I finished it, then No printer. The grid
// only ever has to say what each sheet is.
//
// MOST COMMON FIRST. The planner leads (Justin, 12 August: star chart, bucket
// list, planner are the best three), then lists, colouring, hunts, dares and
// learning, in that order. Anything a grown up has already said yes to jumps
// to the front; anything already confirmed drops to the back, ticked.
//
// THE FIVE A DAY. Printing ticks the day's printable row through
// /api/kid/printable-step, and I finished it goes through
// /api/kid/printable-done, which ticks it too and asks the grown up to
// confirm the stars. Before this the tab's sheets never told the day store
// anything, which is why A printable sat open on Jonny's day.

export type KidAskLite = { id: string; title: string; emoji: string; status: string }

type Status = 'pending' | 'confirmed' | undefined

const KIND_RANK: Record<Printable['kind'], number> = { bucket: 0, craft: 1, hunt: 2, challenge: 3, brain: 4 }
const KIND_LABEL: Record<Printable['kind'], string> = { bucket: 'List', craft: 'Colour in', hunt: 'Hunt', challenge: 'Dare', brain: 'Learn' }
const PINNED_FIRST = 'school-year-planner'

const KIND_CHIPS: { key: 'all' | Printable['kind']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bucket', label: 'Lists' },
  { key: 'craft', label: 'Colour' },
  { key: 'hunt', label: 'Hunts' },
  { key: 'challenge', label: 'Dares' },
  { key: 'brain', label: 'Learn' },
]

export default function KidPrintables({
  token, childName, printables, asks, submitAsk, printablesUnlocked, sheetsDone, sheetStars, onHappyNews,
  initialStatuses, fetchStatuses = true, openKey = null, tallyColor = 'rgba(255,255,255,0.86)', onStepTicked, dealFacts,
}: {
  token: string
  childName: string
  printables: Printable[]
  asks: KidAskLite[]
  submitAsk: (title: string, emoji: string) => void
  printablesUnlocked: boolean
  sheetsDone: number
  sheetStars: number
  onHappyNews: (item: HappyNewsItem) => void
  /** The dev fixture seeds these; the real tab reads them from the status route. */
  initialStatuses?: Record<string, string>
  fetchStatuses?: boolean
  /** The dev fixture opens one sheet straight away. */
  openKey?: string | null
  /** A print just landed one of today's five: the home screen walks the child back to the day. */
  onStepTicked?: (tick: PrintableTick) => void
  /** Text straight on the child's background, from their theme. */
  tallyColor?: string
  /** What the app already knows about this child's deal, written onto the drawn sheets. */
  dealFacts?: DealFacts
}) {
  const [kind, setKind] = useState<'all' | Printable['kind']>('all')
  const [open, setOpen] = useState<Printable | null>(() => printables.find(p => p.key === openKey) ?? null)
  const [statuses, setStatuses] = useState<Record<string, string>>(initialStatuses ?? {})
  // Eight sheets first, the rest behind one tap. Keep it simple: a younger
  // stage has twenty two sheets, and twenty two posters is a catalogue, not a
  // treat. The fold resets when the kind changes so a filter never hides a
  // sheet it was chosen to find.
  const [showAll, setShowAll] = useState(false)
  const FOLD = 8

  // The real state of every sheet, from the completions table rather than
  // from the ask list, so a sheet a child finished last week reads as done
  // whichever phone they open.
  useEffect(() => {
    if (!fetchStatuses) return
    let alive = true
    fetch(`/api/kid/printable-status?token=${encodeURIComponent(token)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (alive && d?.statuses) setStatuses(s => ({ ...d.statuses, ...s })) })
      .catch(() => { /* the grid still shows */ })
    return () => { alive = false }
  }, [token, fetchStatuses])

  const askFor = (p: Printable) => asks.find(a => a.title === `Please can I do the ${p.title} printable`)
  const openFor = (p: Printable) => printablesUnlocked || !!p.free || askFor(p)?.status === 'added'
  const statusOf = (p: Printable): Status => {
    const s = statuses[p.key]
    return s === 'pending' || s === 'confirmed' ? s : undefined
  }

  const ordered = useMemo(() => {
    const rank = (p: Printable) => {
      if (statusOf(p) === 'confirmed') return 100
      if (askFor(p)?.status === 'added' && !printablesUnlocked) return -10
      if (p.key === PINNED_FIRST) return -5
      return KIND_RANK[p.kind]
    }
    return [...printables]
      .map((p, i) => ({ p, i }))
      .sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i)
      .map(x => x.p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printables, asks, statuses, printablesUnlocked])

  const matching = ordered.filter(p => kind === 'all' || p.kind === kind)
  const shown = showAll ? matching : matching.slice(0, FOLD)
  const hidden = matching.length - shown.length
  const liveChips = KIND_CHIPS.filter(c => c.key === 'all' || printables.some(p => p.kind === c.key))

  function onOpen(p: Printable) {
    playKidSound('tap')
    setOpen(p)
  }

  return (
    <div>
      <HappyMasthead
        kicker="Off screen, on paper"
        title="Printables"
        sub="Print it, do it, show your grown up. Every sheet is worth stars."
        right={sheetsDone > 0
          ? <Burst size={72}><span style={{ fontSize: 26 }}>{sheetsDone}</span><br /><span style={{ fontSize: 10, letterSpacing: '0.08em' }}>DONE</span></Burst>
          : <Burst size={72}><span style={{ fontSize: 22 }}>5</span><br /><span style={{ fontSize: 10, letterSpacing: '0.08em' }}>STARS</span></Burst>}
        style={{ marginBottom: 14 }}
      />

      {sheetsDone > 0 && (
        <p style={{ margin: '0 0 12px', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: tallyColor, lineHeight: 1.4 }}>
          {sheetStars} {sheetStars === 1 ? 'star' : 'stars'} earned with a pencil, not a screen. Nice one, {childName}.
        </p>
      )}

      {/* Make your own: the two things a child builds before printing. The
          best two of Justin's best three, as poster tiles. */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <MakeTile href={`/k/${token}/star-chart`} emoji="⭐" title="My star chart" sub="Your jobs, on the fridge" tint={HAPPY.butterLt} accent="butter" />
        <MakeTile href={`/k/${token}/bucket`} emoji="🪣" title="Bucket list" sub="Pick the fun, print it" tint="#E7F1FA" accent="sky" />
      </div>

      {printables.length === 0 ? (
        <div style={{ background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 20, padding: '22px 18px', textAlign: 'center', boxShadow: `0 4px 0 ${HAPPY.ink}` }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>More sheets soon</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: 4 }}>New ones land here all the time.</div>
        </div>
      ) : (
        <>
          {liveChips.length > 2 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 2px 10px', marginBottom: 4 }}>
              {liveChips.map(c => {
                const on = c.key === kind
                return (
                  <button
                    key={c.key}
                    onClick={() => { setKind(c.key); setShowAll(false); playKidSound('tap') }}
                    aria-pressed={on}
                    style={{
                      flexShrink: 0, padding: '9px 15px', borderRadius: 100, cursor: 'pointer',
                      border: `2px solid ${HAPPY.ink}`, background: on ? HAPPY.butter : '#fff', color: HAPPY.ink,
                      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
                      boxShadow: on ? `0 3px 0 ${HAPPY.ink}` : 'none', transform: on ? 'none' : 'translateY(2px)',
                      transition: 'transform 0.12s, background 0.12s',
                    }}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {shown.map((p, i) => {
              const status = statusOf(p)
              const ask = askFor(p)
              const canOpen = openFor(p)
              const saidYes = ask?.status === 'added' && !printablesUnlocked && !p.free
              return (
                <button
                  key={p.key}
                  onClick={() => onOpen(p)}
                  aria-label={`${p.title}, ${p.stars} stars`}
                  style={{
                    position: 'relative', display: 'block', width: '100%', textAlign: 'left', padding: 0,
                    background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 18, overflow: 'hidden',
                    cursor: 'pointer', boxShadow: `0 4px 0 ${HAPPY.ink}`, color: HAPPY.ink,
                    opacity: status === 'confirmed' ? 0.85 : 1,
                  }}
                >
                  {/* The paper, tall, the whole sheet visible. A square tile
                      cropping an A4 portrait threw away a third of every sheet. */}
                  <div style={{ position: 'relative', aspectRatio: '3 / 3.6', background: '#FFFDF8', borderBottom: `2px solid ${HAPPY.ink}` }}>
                    {p.drawn ? (
                      // A drawn sheet is its own preview: the real paper,
                      // scaled to the tile, the child's name already on it.
                      <div style={{ position: 'absolute', left: '6%', right: '6%', top: 6, overflow: 'hidden' }} aria-hidden>
                        <DrawnPaper spec={{ key: p.drawn, childName, stars: p.stars, facts: dealFacts }} />
                      </div>
                    ) : (
                      <Image src={p.previewUrl} alt="" fill sizes="(max-width: 600px) 45vw, 260px" style={{ objectFit: 'contain', padding: 8 }} />
                    )}
                    <span style={{ position: 'absolute', top: 7, right: 7 }}>
                      {status === 'confirmed'
                        ? <Sticker accent="green" rotate={6} size="sm">Done ✓</Sticker>
                        : status === 'pending'
                          ? <Sticker accent="sky" rotate={6} size="sm">Sent ✓</Sticker>
                          : !canOpen
                            ? <Sticker accent="white" rotate={6} size="sm">🔒 Ask</Sticker>
                            : <Sticker accent={i % 3 === 0 ? 'butter' : i % 3 === 1 ? 'coral' : 'sky'} rotate={i % 2 ? 7 : -7} size="sm">
                                <StarShape size={12} color={i % 3 === 1 ? HAPPY.butter : HAPPY.ink} /> {p.stars}
                              </Sticker>}
                    </span>
                    {saidYes && (
                      <span style={{ position: 'absolute', left: 7, bottom: 7 }}>
                        <Sticker accent="green" rotate={-4} size="sm">Yes from home</Sticker>
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '9px 11px 11px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', lineHeight: 1.18, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.emoji} {p.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 4 }}>
                      {KIND_LABEL[p.kind]} · {p.minutes}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {hidden > 0 && (
            <button
              onClick={() => { setShowAll(true); playKidSound('tap') }}
              style={{
                display: 'block', margin: '14px auto 0', padding: '12px 20px', borderRadius: 100, cursor: 'pointer',
                border: `2px solid ${HAPPY.ink}`, background: '#fff', color: HAPPY.ink, boxShadow: `0 4px 0 ${HAPPY.ink}`,
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
              }}
            >
              Show {hidden} more {hidden === 1 ? 'sheet' : 'sheets'} ↓
            </button>
          )}
        </>
      )}

      {open && (
        <KidPrintableSheet
          token={token}
          childName={childName}
          dealFacts={dealFacts}
          printable={open}
          status={statusOf(open)}
          canOpen={openFor(open)}
          ask={askFor(open)}
          onClose={() => setOpen(null)}
          onSent={() => setStatuses(s => ({ ...s, [open.key]: 'pending' }))}
          submitAsk={submitAsk}
          onHappyNews={onHappyNews}
          onStepTicked={onStepTicked}
        />
      )}
    </div>
  )
}

function MakeTile({ href, emoji, title, sub, tint, accent }: {
  href: string; emoji: string; title: string; sub: string; tint: string; accent: 'butter' | 'sky'
}) {
  return (
    <Link
      href={href}
      onClick={() => playKidSound('tap')}
      style={{
        position: 'relative', display: 'block', textDecoration: 'none', overflow: 'hidden',
        background: tint, border: `2px solid ${HAPPY.ink}`, borderRadius: 18, padding: '14px 12px 12px',
        boxShadow: `0 4px 0 ${HAPPY.ink}`, color: HAPPY.ink, minHeight: 128,
      }}
    >
      <HappyScatter dim seed={accent === 'sky' ? 2 : 0} />
      <span style={{ position: 'absolute', top: 8, right: 8 }}>
        <Sticker accent={accent} rotate={8} size="sm">Make your own</Sticker>
      </span>
      <span style={{ display: 'block', fontSize: 40, lineHeight: 1, marginTop: 22 }} aria-hidden>{emoji}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', lineHeight: 1.15, marginTop: 6 }}>{title}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', lineHeight: 1.3, marginTop: 2, color: 'var(--ink-soft)' }}>{sub}</span>
    </Link>
  )
}

/**
 * One sheet, its own screen: what it is, one big Print it, then the finished
 * button, then the no printer way. The paper itself is drawn underneath,
 * because that is what prints when the browser can print in place, and on
 * paper it is the only thing that shows.
 */
export function KidPrintableSheet({ token, childName = '', dealFacts, printable: p, status, canOpen, ask, onClose, onSent, submitAsk, onHappyNews, onStepTicked }: {
  token: string
  childName?: string
  dealFacts?: DealFacts
  printable: Printable
  status: Status
  canOpen: boolean
  ask?: KidAskLite
  onClose: () => void
  onSent: () => void
  submitAsk: (title: string, emoji: string) => void
  onHappyNews: (item: HappyNewsItem) => void
  onStepTicked?: (tick: PrintableTick) => void
}) {
  const [note, setNote] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [asked, setAsked] = useState(false)
  const printHref = `/k/${token}/print?sheet=${encodeURIComponent(p.key)}`
  const isPack = !!p.pdfColourIn

  // The screen is a takeover: nothing behind it should scroll.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function print() {
    playKidSound('tap')
    // The tick leaves before the print (same tap, so Safari still opens), and
    // its answer decides what happens after: a landed step walks the child
    // back to their day with the next one lit.
    void tickPrintableStep(token).then(t => { if (t?.ticked) onStepTicked?.(t) })
    if (isPack) {
      printPack(p.pdfColourIn as string, p.title)
      return
    }
    const how = printOrOpen(printHref)
    if (how === 'opened') setNote('Opened in Safari so it can print. Come back here when it is done.')
  }

  async function finished() {
    if (busy || status) return
    setBusy(true)
    playKidSound('tap')
    try {
      const res = await fetch('/api/kid/printable-done', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, printable_key: p.key }),
      })
      if (!res.ok) throw new Error('not sent')
      onSent()
      onHappyNews({ character: 'bloop', headline: 'Beautiful work!', sub: `${p.stars} star${p.stars === 1 ? '' : 's'} on the way once your grown up sees it.` })
    } catch {
      setNote('That did not send. Try again in a minute, or just hand the sheet to your grown up.')
    } finally {
      setBusy(false)
    }
  }

  function askForIt() {
    if (asked || ask) return
    setAsked(true)
    submitAsk(`Please can I do the ${p.title} printable`, p.emoji)
    onHappyNews({ character: 'bloop', headline: 'Asked your grown up!', sub: `They can set up ${p.title} for you.` })
  }

  const requested = asked || !!ask
  const saidNo = ask?.status === 'declined'

  return (
    <div className="kid-print-root" style={{ position: 'fixed', inset: 0, zIndex: 220, background: HAPPY.cream, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {/* On paper, only the sheet. Everything else on the page is hidden and
          the takeover is lifted to the page origin so the art starts at the
          top of the first sheet of paper. */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        .kid-print-root, .kid-print-root .kid-sheet-paper, .kid-print-root .kid-sheet-paper * { visibility: visible !important; }
        .kid-print-root { position: absolute !important; inset: 0 !important; overflow: visible !important; background: #fff !important; }
        .kid-print-root .kid-print-chrome { display: none !important; }
        @page { margin: 8mm; }
      }`}</style>

      <div className="kid-print-chrome" style={{
        position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', background: HAPPY.butter, borderBottom: `2.5px solid ${HAPPY.ink}`,
      }}>
        <button
          onClick={() => { playKidSound('tap'); onClose() }}
          aria-label="Close"
          style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', border: `2px solid ${HAPPY.ink}`, boxShadow: `0 3px 0 ${HAPPY.ink}`,
          }}
        >
          <CloseCross size={42} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: HAPPY.ink }}>
            {KIND_LABEL[p.kind]} · {p.minutes}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: HAPPY.ink, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.emoji} {p.title}
          </div>
        </div>
        <Sticker accent="white" rotate={6}><StarShape size={13} /> {p.stars}</Sticker>
      </div>

      <div className="kid-print-chrome" style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 6px' }}>
        <div style={{ position: 'relative', background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 20, padding: '14px 16px 16px', boxShadow: `0 4px 0 ${HAPPY.ink}`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -6, right: 10, display: 'flex', gap: 6 }} aria-hidden>
            <SmileyDot size={16} color={HAPPY.coral} /><SmileyDot size={12} color={HAPPY.sky} />
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {p.blurb}
          </p>
          <WavyRule color={HAPPY.butterDark} style={{ marginBottom: 12 }} />

          {canOpen ? (
            <>
              <button
                onClick={print}
                style={{
                  width: '100%', padding: '16px 14px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`, cursor: 'pointer',
                  background: HAPPY.butter, color: HAPPY.ink, boxShadow: `0 5px 0 ${HAPPY.ink}`,
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
                }}
              >
                🖨️ Print it
              </button>
              <button
                onClick={finished}
                disabled={!!status || busy}
                style={{
                  width: '100%', padding: '14px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`, marginTop: 10,
                  cursor: status ? 'default' : 'pointer',
                  background: status ? '#E8F0EE' : HAPPY.green, color: status ? HAPPY.ink : '#fff',
                  boxShadow: status ? 'none' : `0 5px 0 ${HAPPY.ink}`,
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
                }}
              >
                {status === 'confirmed' ? 'Done ✓ Stars in your bank' : status === 'pending' ? 'Sent ✓ Stars on the way' : `I finished it! Show my grown up ⭐ ${p.stars}`}
              </button>
              <button
                onClick={() => { playKidSound('tap'); submitAsk(`Print the ${p.title} sheet`, '🖨️'); setNote('Asked. Your grown up can print it for you.') }}
                style={{ width: '100%', padding: '10px', marginTop: 4, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}
              >
                No printer? Ask a grown up to print it
              </button>
            </>
          ) : (
            <>
              <button
                onClick={askForIt}
                disabled={requested}
                style={{
                  width: '100%', padding: '16px 14px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`,
                  cursor: requested ? 'default' : 'pointer',
                  background: requested ? '#E8F0EE' : HAPPY.green, color: requested ? HAPPY.ink : '#fff',
                  boxShadow: requested ? 'none' : `0 5px 0 ${HAPPY.ink}`,
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
                }}
              >
                {saidNo ? 'Not this one for now' : requested ? 'Asked your grown up ✓' : 'Ask a grown up for this one ⭐'}
              </button>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', textAlign: 'center', margin: '10px 0 0', lineHeight: 1.4 }}>
                {saidNo ? 'Maybe another time. Plenty more to colour.' : 'Your grown up can open printables for you.'}
              </p>
            </>
          )}

          {note && (
            <p style={{ margin: '10px 0 0', padding: '10px 12px', background: HAPPY.butterLt, border: `1.5px solid ${HAPPY.butterDark}`, borderRadius: 12, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.4 }}>
              {note}
            </p>
          )}
        </div>

        <p style={{ margin: '14px 0 4px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {isPack ? 'What is in the pack' : 'What prints'}
        </p>
      </div>

      {/* The paper. For a pack the preview stands in, since the pages are a
          PDF the button opens; for a sheet this IS the print. */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px 40px' }}>
        <div style={{ background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 16, overflow: 'hidden', boxShadow: `0 4px 0 ${HAPPY.ink}` }} className={isPack ? 'kid-print-chrome' : undefined}>
          {isPack ? (
            <div style={{ position: 'relative', aspectRatio: '3 / 4' }}>
              <Image src={p.previewUrl} alt={p.title} fill sizes="560px" style={{ objectFit: 'contain', padding: 10 }} />
            </div>
          ) : (
            <KidSheetPaper sheet={{ url: p.sheetUrl, title: p.title, extraUrls: p.extraSheetUrls, heading: p.sheetHeading, writeIn: p.writeIn, drawn: p.drawn ? { key: p.drawn, childName, stars: p.stars, facts: dealFacts } : undefined }} />
          )}
        </div>
      </div>
    </div>
  )
}
