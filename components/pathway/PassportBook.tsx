'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Stamp, StampStatus } from './PassportStamps'
import { characterForStage } from '@/lib/content/stage-characters'

// The passport as a little book. A teal cover with the gold crest, then
// one page per stage in that stage's colour, each carrying a big progress
// circle that fills as the family completes that stage's work. Pages flip
// like a real passport (tap the sides or the arrows), a completed page
// earns its round seal, and the book opens itself on the stage the child
// is in. Earlier stages sit waiting as catch up pages, later ones as
// ahead pages, so the whole journey to 16 is a flick through.

const STAGE_THEME: Record<number, { bg: string; bold: string; text: string }> = {
  1: { bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  2: { bg: 'var(--stage-2)', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  3: { bg: 'var(--stage-3)', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  4: { bg: 'var(--stage-4)', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  5: { bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
}

const STAGE_SLUGS = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

// Done and to do, in the two colours this page already names out loud further
// down: "Green means that part of the plan is doing its job. Anything amber
// comes with one clear next step."
//
// The rows used to tick and label in the STAGE's colour, which meant done and
// to do were the same shade as each other and a different shade on every page.
// A parent could not scan the list and see what was left, which is the one job
// a checklist has. Fixed colours, so five pages read the same way and green
// always means the same thing.
const DONE = 'var(--retro-green)'
const TODO = 'var(--terracotta-dark)'

const R = 52
const C = 2 * Math.PI * R

function statusLabel(s: StampStatus): string {
  if (s === 'earned') return 'Earned'
  if (s === 'current') return 'In progress'
  if (s === 'catchup') return 'Catch up'
  return 'Ahead'
}

// Per child since 18 August 2026. One global key meant the first child's
// stamp celebration marked the stage as seen for the whole browser, so the
// second child's identical achievement passed in silence: invisible and
// unrecoverable, the exact bug the multi child audit named. The legacy
// un-suffixed key is deliberately left behind: worst case an existing family
// sees one celebration replay per already stamped stage, which errs on the
// side of clapping twice rather than never.
const celebratedKey = (childId: string | null) => `gc_passport_celebrated_${childId ?? 'family'}`

export default function PassportBook({
  stamps,
  childName,
  catchupLines,
  openAtStage = null,
  currentStage = null,
  childId = null,
}: {
  stamps: Stamp[]
  childName: string
  /**
   * One paced sentence per catch up stage id, from the page's own pace
   * arithmetic ("One a month fills this page"). Optional because every other
   * surface that renders the book (the ref pages, the marketing shots) has no
   * birthday to pace against, and the banner reads fine without it.
   */
  catchupLines?: Record<number, string>
  /**
   * Open straight onto this stage's page rather than the cover.
   *
   * Set when a parent arrives from somewhere that has already told them their
   * passport moved, "See your passport fill" after a lesson above all. Landing
   * on the cover after that sentence means flipping blind to find the page it
   * meant, and the pages either side of the child's own read as rows of zeros
   * because those stages are not theirs. Justin did exactly that, landed on
   * Foundation, saw "0 of 13" and reasonably concluded the passport was not
   * updating. It was, one page over.
   */
  openAtStage?: number | null
  /**
   * Which stage is theirs, WITHOUT opening it.
   *
   * Justin, after living with openAtStage on his phone: the book should land on
   * its cover, "with option to go to current stage or catch up previous stages
   * not done." He is right and it is the better of the two. Opening straight
   * onto a stage page skips the one screen that says what this object IS, and
   * lands a parent in a long checklist with no sense of where it sits.
   *
   * So the cover is the front door again, and the two things a parent actually
   * wants from it are printed underneath as buttons rather than left to be
   * discovered by flipping.
   */
  currentStage?: number | null
  /** Whose book, for the per child celebration memory. Null celebrates as one
   *  family, which is only right when there is genuinely one child. */
  childId?: string | null
}) {
  // Page 0 is the cover; pages 1..5 are the stages. The book rests on its
  // cover and never opens itself: the parent taps to open each page, the way
  // Justin asked for, so the cover is a real front door. Unless a caller has
  // named a stage, in which case the front door has already been walked
  // through somewhere else.
  const openIndex = openAtStage
    ? Math.max(0, stamps.findIndex(s => s.id === openAtStage)) + 1
    : 0
  const [page, setPage] = useState(openIndex)
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null)
  const [drawn, setDrawn] = useState(false)
  const [celebrating, setCelebrating] = useState<Stamp | null>(null)
  // A page was stamped THIS visit and the seal has been dismissed. The one
  // moment the printed booklet is worth mentioning in words rather than
  // leaving to the mark in the corner of the book.
  const [justStamped, setJustStamped] = useState(false)
  const pending = useRef<number | null>(null)
  const bookRef = useRef<HTMLDivElement>(null)

  const earnedCount = stamps.filter(s => s.status === 'earned').length
  const allEarned = earnedCount === stamps.length && stamps.length > 0
  // Stages the child has already aged past without stamping. The book opens on
  // their own page, which is right, and the cost of that is that these become
  // invisible unless somebody thinks to flip backwards.
  const catchUps = stamps.filter(s => s.status === 'catchup')
  const theirStage = currentStage ? stamps.find(s => s.id === currentStage) ?? null : null

  // Draw the rings in shortly after mount. No auto flip: the cover stays put.
  useEffect(() => {
    const draw = setTimeout(() => setDrawn(true), 300)
    return () => clearTimeout(draw)
  }, [])

  // Real success when a page is newly stamped. We remember which earned pages
  // the family has already celebrated, so the first time a page crosses to
  // earned it gets a proper moment: a stamp slam, a burst and a gentle buzz.
  // Later visits stay calm. This is the "make it feel earned" ask.
  useEffect(() => {
    if (typeof window === 'undefined') return
    let seen: number[] = []
    try { seen = JSON.parse(localStorage.getItem(celebratedKey(childId)) ?? '[]') } catch { seen = [] }
    const fresh = stamps.find(s => s.status === 'earned' && !seen.includes(s.id))
    if (!fresh) return
    const t = setTimeout(() => {
      setCelebrating(fresh)
      try { navigator.vibrate?.([40, 60, 90]) } catch { /* not supported */ }
      const next = Array.from(new Set([...seen, ...stamps.filter(s => s.status === 'earned').map(s => s.id)]))
      try { localStorage.setItem(celebratedKey(childId), JSON.stringify(next)) } catch { /* private mode */ }
    }, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function goTo(target: number) {
    if (target === page || flipping) return
    // The explanation above this book has done its job the moment somebody
    // opens the book. See PathwayIntro: this is what retires it, rather than a
    // timer taking words off the screen while a parent is still reading them.
    try { window.dispatchEvent(new CustomEvent('gc:passport-opened')) } catch { /* SSR */ }
    pending.current = target
    setFlipping(target > page ? 'next' : 'prev')
  }

  /**
   * Turn to a page from a control that sits BELOW the book.
   *
   * The dots and the tap zones never need this: the book is on screen when you
   * use them. The catch up buttons are underneath, so on a phone the flip can
   * happen entirely off screen and read as a dead tap.
   */
  function openFromBelow(target: number) {
    goTo(target)
    bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // The flip is two halves: rotate to the spine, swap the page, rotate out.
  useEffect(() => {
    if (!flipping) return
    const t = setTimeout(() => {
      if (pending.current !== null) setPage(pending.current)
      pending.current = null
      setFlipping(null)
    }, 280)
    return () => clearTimeout(t)
  }, [flipping])

  const stamp = page >= 1 ? stamps[page - 1] : null
  const theme = stamp ? STAGE_THEME[stamp.id] ?? STAGE_THEME[1] : null
  // The Planet Friend earned at this stage, so each passport page carries the
  // character who grows up alongside the child there.
  const friend = stamp ? characterForStage(stamp.id) : undefined

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {childName === 'your child' ? 'The' : `${childName}'s`} digital passport
        </span>
        {/* nowrap. "1/5 pages stamped" was breaking after "pages", which took
            the label opposite it to two lines as well, so the book started two
            lines lower for no reason anybody chose. */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {earnedCount}/{stamps.length} stamped
        </span>
      </div>
      <div style={{ height: 12 }} />

      {/* The book */}
      {/* position relative so the print mark can sit in the book's corner.
          It is a SIBLING of the flipping element rather than a child of it,
          which matters: anything inside that div rotates to the spine and back
          on every page turn, and a shop link tumbling through 88 degrees each
          time a parent flips a page is not a quiet affordance. */}
      <div ref={bookRef} style={{ position: 'relative', perspective: '1400px', maxWidth: '340px', margin: '0 auto', scrollMarginTop: '84px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '18px',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: flipping === 'next' ? 'rotateY(-88deg)' : flipping === 'prev' ? 'rotateY(88deg)' : 'rotateY(0deg)',
            transition: 'transform 0.28s ease-in',
            boxShadow: '0 14px 40px rgba(26,26,46,0.18)',
          }}
        >
          {page === 0 ? (
            /* ── The cover ─────────────────────────────── */
            /* The cover reads like a real passport: burgundy book, gold
               foil rules and crest, formal letterspaced titling. */
            <div
              onClick={() => goTo(1)}
              role="button"
              aria-label="Open the passport"
              style={{
                background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
                borderRadius: '14px 18px 18px 14px', cursor: 'pointer',
                padding: '38px 26px 30px', textAlign: 'center', minHeight: '420px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: 'inset 0 0 0 2px rgba(237,195,95,0.55), inset 0 0 0 5px rgba(237,195,95,0.14), inset 12px 0 24px rgba(0,0,0,0.25)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                  Digital Passport
                </div>
                <div style={{ width: '46px', height: '1.5px', background: 'rgba(237,195,95,0.55)', margin: '10px auto 0' }} />
              </div>
              <div>
                {/* The gold foil crest: the rising bars in a laurel ring */}
                <div style={{
                  width: '84px', height: '84px', borderRadius: '50%', margin: '0 auto 18px',
                  border: '2.5px solid rgba(237,195,95,0.85)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 0 0 4px rgba(237,195,95,0.18)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4.5px', height: '34px' }}>
                    {[5, 9, 14, 8].map((h, i) => (
                      <div key={i} style={{ width: '6px', height: `${(h / 14) * 34}px`, background: 'var(--terracotta)', borderRadius: '3px' }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--terracotta)', letterSpacing: '0.02em', lineHeight: 1.15 }}>
                  {childName === 'your child' ? 'Our family' : childName}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.65)', marginTop: '8px' }}>
                  The journey to 16
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.5)' }}>
                Tap to open
              </div>
            </div>
          ) : stamp && theme && (
            /* ── A stage page ──────────────────────────── */
            <div
              style={{
                background: theme.bg, borderRadius: '18px',
                // Bottom padding clears the print mark in the corner. Checked
                // at 390 wide: without it the stage CTA runs the full width of
                // the card to the bottom edge and the mark sits on top of the
                // button, which is a collision rather than a corner.
                padding: '20px 22px 46px', minHeight: '420px', position: 'relative', overflow: 'hidden',
                border: '1.5px solid var(--border)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Tap zones: left half back, right half forward */}
              <div onClick={() => goTo(page - 1)} aria-hidden style={{ position: 'absolute', inset: '0 50% 0 0', cursor: 'pointer', zIndex: 2 }} />
              <div onClick={() => page < stamps.length && goTo(page + 1)} aria-hidden style={{ position: 'absolute', inset: '0 0 0 50%', cursor: page < stamps.length ? 'pointer' : 'default', zIndex: 2 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                {/* "Digital Passport · Stage 3" no longer fits on one line.
                    In the hero the book sits in a 300px column on a desk, which
                    left 256px of page for a 26 character letterspaced line, so
                    it broke after "STAGE" and orphaned the "3" on its own row.
                    The words are already on the cover and in the label directly
                    above the book, so the stage number is the part that was
                    doing any work here. */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.text, opacity: 0.75, whiteSpace: 'nowrap' }}>
                  Stage {stamp.id}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: theme.text, opacity: 0.55, whiteSpace: 'nowrap' }}>
                  P{stamp.id} of {stamps.length}
                </span>
              </div>

              {/* The circle that fills as the stage completes */}
              <div style={{ position: 'relative', width: 128, height: 128, margin: '4px auto 12px' }}>
                <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                  <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(26,26,46,0.10)" strokeWidth="9" />
                  <circle
                    cx="64" cy="64" r={R} fill="none" stroke={theme.bold} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(drawn ? stamp.pct : 0, 100) / 100)}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {stamp.status === 'earned' ? (
                    /* THE STAMP IS THE PLANET FRIEND, INKED. The earned seal
                       used to be a tick and the word Earned, which said done
                       and nothing else. The character the child grew up with
                       at this stage IS the stamp now, printed in the page's
                       own ink: grayscale then tinted by the stage text colour
                       through a screen blend, so it reads as pressed rubber
                       stamp rather than a pasted sticker. The friend under
                       the ring introduces them; the seal is them, earned. */
                    <div style={{
                      position: 'relative', width: 84, height: 84, borderRadius: '50%',
                      border: `3px solid ${theme.text}`, color: theme.text, overflow: 'hidden',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(-10deg)', animation: 'gcStampIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
                      background: theme.bg,
                    }}>
                      {friend ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={friend.cutout}
                            alt=""
                            style={{
                              width: 56, height: 56, objectFit: 'contain',
                              filter: 'grayscale(1) contrast(1.2) opacity(0.85)',
                            }}
                          />
                          {/* The ink: the stage colour laid over the grey art,
                              so every stamp presses in its page's own colour. */}
                          <span aria-hidden style={{ position: 'absolute', inset: 0, background: theme.text, mixBlendMode: 'screen', opacity: 0.28, pointerEvents: 'none' }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '1px' }}>
                            Earned
                          </span>
                        </>
                      ) : (
                        <>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7" />
                          </svg>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>
                            Earned
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', lineHeight: 1, color: theme.text }}>
                        {stamp.pct}%
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.text, opacity: 0.7, marginTop: '3px' }}>
                        {statusLabel(stamp.status)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                {friend && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '9px' }}>
                    <span style={{
                      width: 62, height: 62, borderRadius: '50%', overflow: 'hidden',
                      border: `2.5px solid ${friend.colour}`, background: '#fff',
                      boxShadow: '0 3px 0 rgba(26,26,46,0.10)', position: 'relative', flexShrink: 0,
                    }}>
                      <Image src={friend.img} alt={friend.name} fill sizes="62px" style={{ objectFit: 'cover' }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.text, opacity: 0.8, marginTop: '6px' }}>
                      {stamp.status === 'earned' || stamp.status === 'current' ? `With ${friend.name}` : `Meet ${friend.name}`}
                    </span>
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {stamp.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.text, marginTop: '4px' }}>
                  {stamp.ages}
                </div>
              </div>

              {/* To stamp this page: the plain checklist of what completes the
                  stage. Each task shows a tick when it is done and how much is
                  left when it is not, so the page always says exactly what to
                  do next. Lessons lead, they are the process. */}
              {/* This whole panel rides above the flip tap zones (zIndex 3) so
                  every row is tappable and takes the parent straight to the
                  exact thing that fills it: the stage lessons, the scripts, the
                  device setup, the daily habit. Nobody is left guessing the
                  next step. */}
              <div style={{ position: 'relative', zIndex: 3, borderTop: `1.5px dashed ${theme.bold}`, paddingTop: '12px', marginTop: 'auto' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.text, opacity: 0.7, marginBottom: '9px' }}>
                  {stamp.status === 'earned' ? 'This page is stamped' : 'To stamp this page · tap any one to do it'}
                </div>
                {stamp.sections && stamp.sections.length > 0 ? (
                  (() => {
                    const secs = stamp.sections
                    // One number for the page: the same reading as the big
                    // circle, so a stage still ahead reads a true zero here too
                    // instead of averaging today's live rows back in.
                    const runningPct = stamp.pct
                    const greenRows = secs.filter(s => s.pct >= 100).length
                    // The one row a parent should do next: the first still open.
                    const nextKey = secs.find(x => x.pct < 100)?.key ?? null
                    return (
                      <>
                        {/* ONE row of help, not five.
                            Justin: the page "looks massive, way too long, it
                            needs to look passport size".
                            Every row carried a two or three line explanation of
                            how it goes green, which is genuinely useful and,
                            printed five times, is most of why the page ran to
                            three screens. A parent only ever acts on one row at
                            a time, so the help now belongs to the row they
                            should act on next: the first one still open. The
                            rest keep their tick, their label and their number,
                            which is all a scan needs. Tapping any row still
                            goes straight to the thing that fills it, so nothing
                            has been hidden, only unstacked. */}
                        {secs.map(sec => {
                          const done = sec.pct >= 100
                          const isNext = sec.key === nextKey
                          return (
                            <Link key={sec.key} href={sec.href} style={{ display: 'block', textDecoration: 'none', marginBottom: isNext ? '9px' : '5px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                <span style={{
                                  width: 17, height: 17, borderRadius: '6px', flexShrink: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: done ? DONE : 'transparent',
                                  border: done ? 'none' : `1.5px solid ${TODO}`,
                                }}>
                                  {done && (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                                  )}
                                </span>
                                <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', opacity: done ? 0.55 : 1, lineHeight: 1.3 }}>
                                  <span aria-hidden style={{ marginRight: 5 }}>{sec.emoji}</span>{sec.label}
                                </span>
                                <span style={{
                                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                                  // nowrap and never squeezed. It was taking
                                  // enough of a 340 wide card to push "Moments
                                  // to resolve" and "Jobs and routines" onto a
                                  // second line each.
                                  whiteSpace: 'nowrap', flexShrink: 0,
                                  color: done ? DONE : TODO,
                                }}>
                                  {sec.detail}{done ? '' : ' ›'}
                                </span>
                              </div>
                              {/* How it actually goes green. This was already
                                  written on every row and never rendered, which
                                  is why the page could only ever say WHAT was
                                  left and never HOW. */}
                              {isNext && (
                              <div style={{ marginTop: 3, marginLeft: 26, display: 'flex', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
                                {/* An ongoing row can go back to amber, so its chip
                                    says which way it is currently running rather
                                    than only that it never completes. Balance and
                                    jobs are the two, and they are exactly the two
                                    a parent otherwise reads as broken. */}
                                {sec.ongoing && (
                                  <span style={{
                                    flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                                    letterSpacing: '0.06em', textTransform: 'uppercase',
                                    color: done ? DONE : TODO,
                                    background: done ? 'var(--tint-green)' : 'var(--terracotta-lt)',
                                    borderRadius: 100, padding: '2px 8px',
                                  }}>
                                    {done ? 'Keeping it up' : 'Kept up, not ticked off'}
                                  </span>
                                )}
                                <span style={{ flex: '1 1 160px', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                                  {sec.help}
                                </span>
                              </div>
                              )}
                              {sec.alert && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 5, marginLeft: 26, background: '#FDECEC', borderRadius: '9px', padding: '6px 9px' }}>
                                  <span aria-hidden style={{ fontSize: 'var(--text-base)', lineHeight: 1.3 }}>⚠️</span>
                                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#B93B3F', lineHeight: 1.35 }}>{sec.alert}</span>
                                </div>
                              )}
                            </Link>
                          )
                        })}
                        {/* Green count first, percentage second. "3 of 5 green"
                            is the number a parent can act on; the percentage is
                            the one they compare against last week. */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: '10px', paddingTop: '9px', borderTop: '1px solid rgba(26,26,46,0.12)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.text, opacity: 0.7 }}>
                            This stage
                          </span>
                          <span style={{ display: 'flex', alignItems: 'baseline', gap: 9, minWidth: 0 }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                              color: greenRows === secs.length ? DONE : TODO, whiteSpace: 'nowrap',
                            }}>
                              {greenRows} of {secs.length} green
                            </span>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                              {runningPct}%
                            </span>
                          </span>
                        </div>
                        {/* One line, not five.
                            This legend was printed in full on every page of the
                            book. The colours now do their own explaining, since
                            the one amber row that matters carries its next step
                            in words directly underneath it, so the standing
                            paragraph was repeating what the page already shows.
                            The half that is NOT self evident is that two rows
                            never tick off, and that part stays. */}
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '7px 0 0' }}>
                          Tap any row to go straight there. Jobs and screen balance are kept up across the stage rather than ticked off, so those two move both ways.
                        </p>
                      </>
                    )
                  })()
                ) : (() => {
                  const lt = stamp.lessonsTotal ?? 0
                  const ld = stamp.lessonsDone ?? 0
                  const slug = STAGE_SLUGS[stamp.id - 1] ?? 'foundation'
                  const tasks: { label: string; done: boolean; detail: string; href: string }[] = [
                    { label: 'Watch the lessons', done: (stamp.lessonsPct ?? 0) >= 100, detail: lt > 0 ? `${ld} of ${lt} done` : `${stamp.lessonsPct ?? 0}%`, href: `/dashboard/lessons?stage=${stamp.id}` },
                    // Back to "Read the scripts", and this time the label is
                    // true. It said Read, then Use when reading counted for
                    // nothing, and now Read again because migration 183 makes
                    // reaching the end of one count. Justin asked for that
                    // twice and he was right: a parent who reads a whole script
                    // has done something, and a product that says otherwise is
                    // arguing with them about their own afternoon.
                    { label: 'Read the scripts', done: (stamp.scriptsPct ?? 0) >= 100, detail: `${stamp.scriptsPct ?? 0}%`, href: `/dashboard/scripts/next?stage=${slug}` },
                    { label: 'Set up the devices', done: (stamp.devicesPct ?? 0) >= 100, detail: `${stamp.devicesPct ?? 0}%`, href: '/dashboard/devices?from=passport' },
                    { label: 'Keep the daily habit', done: (stamp.streakPct ?? 0) >= 100, detail: `${stamp.streakPct ?? 0}%`, href: '/dashboard' },
                  ]
                  return tasks.map(t => (
                    <Link key={t.label} href={t.href} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px', textDecoration: 'none' }}>
                      <span style={{
                        width: 17, height: 17, borderRadius: '6px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: t.done ? DONE : 'transparent',
                        border: t.done ? 'none' : `1.5px solid ${TODO}`,
                      }}>
                        {t.done && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                        )}
                      </span>
                      <span style={{ flex: 1, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', opacity: t.done ? 0.5 : 1, textDecoration: t.done ? 'line-through' : 'none' }}>
                        {t.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: t.done ? DONE : TODO, whiteSpace: 'nowrap' }}>
                        {t.detail}{t.done ? '' : ' ›'}
                      </span>
                    </Link>
                  ))
                })()}
                <Link
                  href={`/dashboard/lessons?stage=${stamp.id}`}
                  style={{
                    display: 'block', textAlign: 'center', marginTop: '11px',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                    color: 'var(--ink)', textDecoration: 'none',
                    background: theme.bold, borderRadius: '12px', padding: '10px 14px',
                  }}
                >
                  {stamp.status === 'earned' ? 'Look back at this stage' : stamp.status === 'catchup' ? 'Catch this page up →' : 'Start the next step →'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* The printed booklet, as a mark in the corner of the book.
            Small on purpose. This is the permanent way through to the real
            thing, and a passport is exactly the object that should carry its
            own printer's mark in the corner rather than have a card shouting
            about it underneath. White on the burgundy cover and on every
            coloured page alike, so it reads on all six without a per page
            colour. */}
      </div>

      {/* Page controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '14px' }}>
        <button
          onClick={() => goTo(Math.max(0, page - 1))}
          aria-label="Previous page"
          disabled={page === 0}
          style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '10px',
            width: 34, height: 34, cursor: page === 0 ? 'default' : 'pointer',
            opacity: page === 0 ? 0.4 : 1, fontSize: 'var(--text-md)', color: 'var(--ink)',
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
          {[0, ...stamps.map(s => s.id)].map(i => {
            const active = i === page
            const t = i >= 1 ? STAGE_THEME[i] : null
            // A page left behind gets a ring, so the flip control itself says
            // which stages are still open rather than only the banner below.
            const behind = i >= 1 && stamps.find(s => s.id === i)?.status === 'catchup'
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={i === 0 ? 'Cover' : behind ? `Stage ${i}, not stamped yet` : `Stage ${i}`}
                style={{
                  width: active ? 22 : 8, height: 8, borderRadius: '100px', border: 'none', padding: 0,
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  background: active ? (t ? t.bold : 'var(--deep-teal)') : behind ? 'var(--terracotta)' : 'var(--border)',
                  boxShadow: behind && !active ? '0 0 0 2px var(--terracotta-lt)' : 'none',
                }}
              />
            )
          })}
        </div>
        <button
          onClick={() => goTo(Math.min(stamps.length, page + 1))}
          aria-label="Next page"
          disabled={page === stamps.length}
          style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '10px',
            width: 34, height: 34, cursor: page === stamps.length ? 'default' : 'pointer',
            opacity: page === stamps.length ? 0.4 : 1, fontSize: 'var(--text-md)', color: 'var(--ink)',
          }}
        >
          →
        </button>
      </div>

      {/* How to use the book, beside the arrows that do it rather than three
          lines above the book pushing it off a phone screen. It was preamble up
          there and it is a caption down here, which is what it always was. */}
      {/* Not on the cover. There it sat between the page dots and the button
          that is the actual route in, splitting the one from the other. The
          cover already says TAP TO OPEN and has its two doors printed below, so
          a line about flipping is the third instruction on a screen that needs
          one. It comes back the moment a page is open, which is when flipping
          is a thing you might want to do. */}
      {page > 0 && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0', textAlign: 'center' }}>
          One page per stage. Flip through to catch up or peek ahead.
        </p>
      )}

      {/* THE COVER'S TWO DOORS.

          Justin: land on the cover, "with option to go to current stage or
          catch up previous stages not done."

          Only on the cover, because once a page is open these would be
          repeating a choice already made. The catch up card below handles the
          second half and already renders on every page, which is right: pages
          left behind stay worth saying wherever you are in the book. */}
      {page === 0 && currentStage && theirStage && (
        <button
          type="button"
          onClick={() => openFromBelow(currentStage)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', marginTop: 14, padding: '14px 18px',
            background: 'var(--terracotta)', color: 'var(--ink)',
            border: 'none', borderRadius: 16, boxShadow: '0 5px 0 var(--terracotta-dark)',
            cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'var(--text-md)', lineHeight: 1.3,
          }}
        >
          Open {childName === 'your child' ? 'their' : `${childName}'s`} page, Stage {theirStage.id} {theirStage.name}
          <span aria-hidden>→</span>
        </button>
      )}

      {/* Pages left behind, named rather than left to be discovered.

          Justin: the book opening on the child's own stage "is neater", but a
          parent will "forget to catch up in previous stages with them". Both
          halves of that are true and they pull against each other. Opening on
          the cover made a parent flip blind; opening on their page hides
          whatever is behind it.

          So the book keeps opening where it should and says out loud what it
          skipped past. Only when there is something: a family who has stamped
          everything behind them never sees this, and a stage still ahead is not
          a stage left behind, so neither triggers it.

          Why it is worth its space: stage one is where the habits the later
          stages assume actually get built. A child on stage three with an
          unstamped stage one is not ahead of schedule, they have a gap, and the
          passport is the one place in the product that can see it. */}
      {catchUps.length > 0 && (
        <div style={{
          marginTop: 16, background: 'var(--terracotta-lt)',
          border: '1.5px solid var(--terracotta)', borderRadius: 16, padding: '14px 16px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 5 }}>
            {catchUps.length === 1 ? 'One page behind you' : `${catchUps.length} pages behind you`}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 11px' }}>
            {childName === 'your child' ? 'Your child has' : `${childName} has`} moved on without stamping{' '}
            {catchUps.length === 1
              ? 'this one. The stage they are on now is built on top of it, so it is worth going back to together.'
              : 'these. The stage they are on now is built on top of them, so they are worth going back to together.'}
            {' '}Tap {catchUps.length === 1 ? 'it' : 'one'} to open {catchUps.length === 1 ? 'that' : 'its'} page.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {catchUps.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => openFromBelow(s.id)}
                style={{
                  display: 'inline-flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap',
                  background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: 12,
                  padding: '8px 13px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
                  Stage {s.id} {s.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                  {s.pct}%
                </span>
                {/* The rhythm, not a deadline: real arithmetic from the page,
                    absent on surfaces with no birthday to pace against. */}
                {catchupLines?.[s.id] && (
                  <span style={{ display: 'block', width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', marginTop: 2 }}>
                    {catchupLines[s.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Order the real thing. Underneath, not floating on the cover.

          It used to sit absolutely positioned in the bottom right corner of the
          book, a small pill laid over the artwork. Justin: it "looks messy".
          He is right, and the reason is that the passport is the one object in
          this product meant to feel like a keepsake rather than a screen, and a
          shop button stuck on top of it undoes exactly that. A real passport
          does not have a buy button printed on the cover.

          Below the page controls it can also be the size a real call to action
          should be, rather than an 11px pill squeezed into a corner. And it
          says what is on the other side of it: a bound booklet with its sticker
          sheet, posted. Print it read like a browser command, as though the
          parent were about to send the page to a printer in the next room. */}
      <Link
        href="/dashboard/keepsakes#p-passport_printed"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginTop: 16, padding: '15px 20px',
          background: '#fff', color: 'var(--ink)',
          border: '1.5px solid var(--terracotta)', borderRadius: 16,
          boxShadow: '0 5px 0 var(--terracotta)',
          textDecoration: 'none', textAlign: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
          lineHeight: 1.3,
        }}
      >
        <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1 }}>🛂</span>
        Order a passport here
      </Link>

      {allEarned && (
        <div style={{
          marginTop: '14px', background: 'var(--deep-teal)', borderRadius: '14px',
          padding: '14px 16px', textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: '#fff' }}>
            🎉 Passport complete
          </div>
          <div style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, marginTop: '3px' }}>
            Every page stamped, all the way to 16. {childName === 'your child' ? 'Your child has' : `${childName} has`} grown up online with the habits, the know how and the judgement built stage by stage.
          </div>
        </div>
      )}

      {/* Real success: the first time a page is stamped, the whole thing gets
          a moment. A dimmed backdrop, a big seal slamming in, a burst of gold
          and a warm line, then a tap to carry on to the page it belongs to. */}
      {celebrating && (() => {
        const t = STAGE_THEME[celebrating.id] ?? STAGE_THEME[1]
        return (
          <div
            onClick={() => { const id = celebrating.id; setCelebrating(null); setJustStamped(true); goTo(id) }}
            role="button"
            aria-label="Continue"
            style={{
              position: 'fixed', inset: 0, zIndex: 60, cursor: 'pointer',
              background: 'rgba(26,26,46,0.62)', backdropFilter: 'blur(3px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '24px', animation: 'gcCelebFade 0.3s ease both',
            }}
          >
            {/* Gold burst behind the seal */}
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{
                  position: 'absolute', width: 9, height: 9, borderRadius: '2px',
                  background: i % 2 ? 'var(--terracotta)' : '#fff',
                  ['--r' as string]: `${i * 30}deg`,
                  animation: `gcBurst 0.75s cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: `${0.12 + i * 0.012}s`,
                } as React.CSSProperties} />
              ))}
              <div style={{
                width: 130, height: 130, borderRadius: '50%', background: t.bg,
                border: `4px solid ${t.text}`, color: t.text,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
                animation: 'gcSeal 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '4px' }}>Stamped</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '22px', maxWidth: '320px', animation: 'gcCelebFade 0.4s ease 0.25s both' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                Page {celebrating.id} earned
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: '#fff', marginTop: '8px', lineHeight: 1.15 }}>
                {celebrating.name} complete
              </div>
              <div style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, marginTop: '8px' }}>
                {childName === 'your child' ? 'Your child' : childName} has the {celebrating.name} habits in place for their age now. A real step on the road to a confident, capable 16.
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: '18px' }}>
                Tap to see the page
              </div>
            </div>
          </div>
        )
      })()}

      {/* The printed booklet, offered once the moment has passed.
          Justin, 31 July: "maybe this button should be a smaller version in
          corner of actual passport?" The full card that used to sit here is
          gone, and it deserved to go: a bordered, shadowed, three line block
          directly beneath a burgundy passport is a second passport sized
          object competing with the real one for the same glance.

          What replaces it is the mark in the corner of the book, which is
          permanent and quiet, plus this line, which appears only in the window
          after a page has actually been stamped. That window is the whole
          point of the change. Until now a page was earned, the seal slammed,
          the buzz went, and then nothing was said at all to the one parent in
          the product most likely to want the real booklet.

          Words rather than a card, and deliberately AFTER rather than during.
          Nothing about the booklet appears inside the celebration itself,
          because an offer landing in the same breath as a child's achievement
          makes the achievement look like the setup for a sale. It waits until
          the seal has been dismissed, then says it once. */}
      {justStamped && (
        <p style={{
          fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55,
          margin: '14px 0 0', textAlign: 'center',
          animation: 'gcCelebFade 0.5s ease both',
        }}>
          That page is stamped for good.{' '}
          <Link href="/dashboard/keepsakes#p-passport_printed" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'underline' }}>
            There is a printed booklet
          </Link>
          {' '}with every stamp inside, if you would like one you can hold.
        </p>
      )}

      <style>{`
        @keyframes gcStampIn {
          0% { transform: scale(0.4) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
        @keyframes gcCelebFade { 0% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes gcSeal {
          0% { transform: scale(2.4) rotate(18deg); opacity: 0 }
          60% { opacity: 1 }
          100% { transform: scale(1) rotate(-8deg); opacity: 1 }
        }
        @keyframes gcBurst {
          0% { transform: rotate(var(--r)) translateY(0) scale(0.2); opacity: 0 }
          35% { opacity: 1 }
          100% { transform: rotate(var(--r)) translateY(-92px) scale(1); opacity: 0 }
        }
      `}</style>
    </div>
  )
}
