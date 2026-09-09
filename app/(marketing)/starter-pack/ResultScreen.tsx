'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Celebration from '@/components/ui/Celebration'
import { STAGES, getStageFromAgeBand, type ChallengeId, type FeelingId } from '@/lib/content/stages'
import { CATCH_ALL_ID, worryLabel } from '@/lib/onboarding/worries'
import WorryAnswers from '@/components/starter/WorryAnswers'
import SolveLoop from '@/components/starter/SolveLoop'
import BiggerThanThis from '@/components/starter/BiggerThanThis'
import { needsHelpFirst } from '@/lib/concerns/risk'
import MethodIcon, { METHOD, type MethodId } from '@/components/starter/MethodIcon'
import { termTimeDailyMinutes, termTimeBaseMinutes } from '@/lib/quests/screen-balance'
import { MockAsk, MockJars, MockKidApp } from './Mocks'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// THE REVEAL: the page that explains the platform.
//
// Justin, 2 September 2026, with the old reveal on his phone: "text does not
// seem UX quality and this bit all overlaps on phone. Remake with really
// simple to read fonts, Mobbin and Apple UX level, and introduce exactly how
// the platform works: the problems we solve and how, especially how DiGi
// works, the daily routine (not every day a task), settings for devices,
// managing time, reaching balance, social media and every online problem
// solved from 4 to 16, helps parents, child app included which teaches
// social media use responsibly."
//
// The old page listed things: eleven feature cards, four mono chapter chips,
// a counting numbers strip. It never said how the platform works. This one
// is written the way the references on Mobbin are (Hers "How it works",
// Gentler Streak, Withings): one picture of the real product beside a few
// plain sentences, one idea per section, body text at 17px, the mono face
// kept for the smallest labels only. Every claim here is already true in the
// product, so the proof path is a tap away once they step in.
//
// Order: what you told us, how it works in three steps, how DiGi works,
// screen time and balance, the child's own app, the road to 16, what you get,
// the door. The door is also top right and rides along the bottom once they
// have read past the first screen.

type Props = {
  stage: ReturnType<typeof getStageFromAgeBand>
  accent: { bold: string; text: string }
  challenge: ChallengeId
  /** The worry the parent actually ticked first, in their own words. The
   *  `challenge` above is the pathway key it maps to, which is what the
   *  content is filed under; this is what they typed themselves and what we
   *  read back to them. Optional: answers saved before 9 September 2026 have
   *  only the key. */
  worry?: string | null
  /** Every worry they ticked, most pressing first. The section that answers
   *  them needs the whole list, not just the one the pathway opens on. */
  worries?: string[]
  /** What they typed into Something else, in their own words.
   *
   *  It was captured in the quiz, written to onboarding_answers.challenge_other
   *  and then never passed here, so a parent who typed "speaking on phone a lot
   *  as friend has a new one" was shown a card headed "Something else". We
   *  asked them to tell us and then read our own label back at them. */
  worryOther?: string
  feeling: FeelingId
  email?: string
  needsConfirm?: boolean
  childName?: string
}

const WRAP: React.CSSProperties = { maxWidth: 640, margin: '0 auto', padding: '0 20px' }
const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 10,
}
const H2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 5.2vw, 2.1rem)', fontWeight: 900,
  letterSpacing: '-0.025em', color: 'var(--ink)', lineHeight: 1.12, margin: '0 0 12px',
}
const LEAD: React.CSSProperties = {
  fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 22px',
}
const BODY: React.CSSProperties = {
  fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0,
}
const SECTION: React.CSSProperties = { marginTop: 'clamp(56px, 10vw, 84px)', scrollMarginTop: 18 }

function Door({ href, label, big = false, style }: { href: string; label: string; big?: boolean; style?: React.CSSProperties }) {
  return (
    <Link href={href} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: big ? '17px 28px' : '12px 20px', borderRadius: big ? 16 : 100,
      background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: big ? 'var(--text-md)' : 'var(--text-base)',
      letterSpacing: '-0.01em', boxShadow: big ? '0 5px 0 var(--terracotta-dark)' : '0 3px 0 var(--terracotta-dark)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {label} <span aria-hidden>→</span>
    </Link>
  )
}

/** The problem, in the parent's voice, above the thing we do about it.
 *
 *  ── WHY EVERY SECTION OPENS ON A PROBLEM ─────────────────────────────────
 *
 *  Justin, 9 September 2026: "remember it's problem and how we will solve it
 *  and solving it on this page, but we will cover it and how, if you agree
 *  that's the best hook for processing for user."
 *
 *  Agreed, and it is worth saying why rather than just doing it. A parent
 *  arrives at this page in one particular state: something went wrong in
 *  their house this week and they have just typed it into a quiz. They are
 *  not evaluating software. They are scanning for whether their own evening
 *  appears anywhere on the screen, and everything they read before it does is
 *  noise they have to push through.
 *
 *  Feature framing makes them do that pushing. "Devices, time and balance" is
 *  a category, so a parent has to translate it into their six o'clock before
 *  it means anything, and translation is work most people will not do on a
 *  phone. Problem framing hands them the recognition first: "Every evening is
 *  a negotiation" costs nothing to understand, and the sentence after it is
 *  read by someone who has already nodded.
 *
 *  So every section on this page is the same two beats in the same order:
 *  the problem in words a parent would actually use, then what we do about
 *  it. Four sections, one shape, so by the second one they know how to read
 *  the page and can skim for their own worry without missing the answer. */
function Problem({ children }: { children: React.ReactNode }) {
  return (
    <div className="wow-fu" style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      // Coral rather than white, and the same chunky treatment every solution
      // card gets. It was the quietest element in each section on a page where
      // the answers all carried a 2px edge and a hard shadow, which is exactly
      // backwards: the recognition has to land before the answer means
      // anything.
      background: 'var(--stage-3)', border: '2px solid var(--ink)', borderRadius: 16,
      boxShadow: '0 5px 0 var(--ink)',
      padding: '13px 16px', margin: '0 0 16px',
    }}>
      <span aria-hidden style={{
        flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
        background: 'var(--stage-3-bold)', border: '2px solid var(--ink)', boxSizing: 'border-box',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)',
      }}>?</span>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
          marginBottom: 3,
        }}>
          The problem
        </div>
        <p style={{
          margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'var(--text-md)', lineHeight: 1.4, color: 'var(--ink)',
        }}>
          {children}
        </p>
      </div>
    </div>
  )
}


/** A plain point: a bold first line and a sentence under it. */
function Point({ icon, title, children }: { icon: MethodId; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {/* Was a system emoji at 20px. Those render in the operating system's own
          palette, so they were the only marks on the page not in our ink and
          butter, sitting directly beside the hand drawn WorryIcon and
          MethodIcon sets. Next to real drawings an emoji reads as a
          placeholder somebody meant to replace. */}
      <span aria-hidden style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: METHOD[icon].tint, border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <MethodIcon id={icon} size={23} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>{title}</div>
        <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 3 }}>{children}</p>
      </div>
    </div>
  )
}

export default function ResultScreen({ stage, accent, challenge, worry, worries, worryOther, email, needsConfirm, childName }: Props) {
  // The account exists from the first screen, so stepping in opens setup,
  // which starts on the check in that becomes the baseline. Only a pending
  // email confirmation goes by the login door first.
  const enterHref = needsConfirm ? `/login${email ? `?email=${encodeURIComponent(email)}` : ''}` : '/dashboard/setup'
  const action = stage.challengeActions[challenge] ?? stage.action
  // Their words back, not ours. A parent who ticked "Bedtime screens" should
  // not be told we heard "Screens are taking over", even though that is the
  // pathway the two share. Falls back for answers saved before the quiz asked
  // in the parent's vocabulary.
  // Their words wherever they gave them. `worry` is the id they put first, so
  // when that is the catch all the label is our word "Something else", and
  // this string is what the product mocks show back: the check in row, the
  // progress bar and the question DiGi is asked. A parent who typed their own
  // worry and then watched a mock of OUR app call it "Something else" three
  // times has been shown the product forgetting them, on the screen where they
  // decide whether to pay.
  const ownFirst = (worryOther ?? '').trim()
  const concern = (worry === CATCH_ALL_ID && ownFirst)
    ? ownFirst
    : (worry ? worryLabel(worry) : '') || 'what you told us'
  // Their own words, every one they ticked, for the roll call card. Falls back
  // to the single derived label for answers saved before the quiz asked in the
  // parent's vocabulary.
  // Their own words wherever they gave them. The catch all used to be filtered
  // out of the roll call entirely, which meant the ONE worry a parent cared
  // enough about to type was the one worry this page never mentioned.
  const own = ownFirst
  // What they typed decides whether this page sells or helps. See
  // lib/concerns/risk for why the gate is deliberately crude.
  const helpFirst = needsHelpFirst(own)
  const told = (worries ?? [])
    .map(w => (w === CATCH_ALL_ID ? own : worryLabel(w)))
    .filter(Boolean)
  const rollCall = told.length ? told : [concern]
  const kid = childName && childName.length > 1 ? childName : ''
  const they = kid || 'your child'
  const headline = kid ? `${kid}'s pathway is ready.` : 'Your pathway is ready.'
  const ages = stage.ageBand === '16+' ? '16 and up' : stage.ageBand.replace('-', ' to ')
  const quote = stage.parentQuote
  // The term time pair, so the number on this page is the number the app will
  // set and the fridge sheet will print. Term time rather than holiday relaxed:
  // a figure on a sales page should not move under the reader in August.
  const guide = termTimeDailyMinutes(stage.ageBand)
  const base = termTimeBaseMinutes(stage.ageBand)

  const rootRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [showFloat, setShowFloat] = useState(false)

  // ── THE ONLY DOOR, FOR PEOPLE WHO TURNED THE MOTION OFF ──────────────────
  //
  // showFloat used to be set only inside the GSAP effect below, which returns
  // early on prefers-reduced-motion. That was survivable while the hero
  // carried a Get started button. Removing that button (it fired before the
  // page had made a claim) made it a real bug: anybody with reduced motion on
  // scrolled the whole reveal with NO call to action until the very bottom.
  //
  // That cohort skews toward migraine, vestibular conditions and parents of
  // neurodivergent children, which is to say the people this product is for.
  // So the door rides a plain IntersectionObserver that runs for everybody,
  // and GSAP is left to do only the decoration.
  useEffect(() => {
    const first = firstRef.current
    const cta = ctaRef.current
    if (!first || !cta) return
    // A parent who typed something frightening gets no floating button at all.
    // The real one is still at the end of the page. A sticky Finish setting up
    // riding over a block that names Childline is the product selling over the
    // top of a crisis, and there is no breakpoint where that is acceptable.
    if (helpFirst) { setShowFloat(false); return }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.target === first) setShowFloat(!e.isIntersecting && e.boundingClientRect.top < 0)
        // The real button in view always wins: never float a duplicate over it.
        if (e.target === cta && e.isIntersecting) setShowFloat(false)
      }
    }, { rootMargin: '0px 0px -30% 0px' })
    io.observe(first)
    io.observe(cta)
    return () => io.disconnect()
  }, [helpFirst])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.wow-word', rootRef.current)
      if (words.length) {
        gsap.fromTo(words, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.1, clearProps: 'transform,opacity' })
      }
      if (progressRef.current) {
        gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })
      }
      const fus = gsap.utils.toArray<HTMLElement>('.wow-fu', rootRef.current)
      if (fus.length) {
        gsap.set(fus, { opacity: 0, y: 22 })
        ScrollTrigger.batch(fus, { start: 'top 90%', once: true, onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' }) })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '0 0 96px', fontFamily: 'var(--font-body)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        <Celebration />
      </div>
      {/* How far down the page they are, a hairline under the status bar. */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 60, pointerEvents: 'none' }} aria-hidden>
        <div ref={progressRef} style={{ height: '100%', background: 'var(--terracotta)', transform: 'scaleX(0)', transformOrigin: 'left' }} />
      </div>

      {/* ── The arrival ─────────────────────────────────────────────────── */}
      <div ref={firstRef} style={{ background: '#fff', borderBottom: '1.5px solid var(--border)', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 22px)', paddingBottom: 30 }}>
        <div style={WRAP}>
          {/* ── WHY THIS ROW WRAPS ──────────────────────────────────────
              Justin's screenshot, 9 September 2026, on an iPhone: the stage
              pill clipped off the left edge and Get started clipped off the
              right. A nowrap pill plus a button, held apart by
              space-between, is wider than a phone once the stage name is
              long (STAGE 1 · FOUNDATION), and the whole page scrolled
              sideways to fit it. flexWrap lets the button drop to its own
              line instead, and minWidth 0 lets the pill shrink rather than
              force the row. */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 26, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: accent.bold, color: accent.text, padding: '6px 12px', borderRadius: 100 }}>
              Stage {stage.id} · {stage.name}
            </span>
            {/* The Get started button that used to sit here is gone. It fired
                before the page had made a single claim, and at 390 the row
                wrapped so it landed on its own line under the stage pill,
                reading as an orphan. The sticky bar carries the door from the
                moment they scroll, and the button at the end carries it after
                the argument. Two doors with one label, not three with three. */}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 7.5vw, 2.9rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.08, margin: '0 0 14px' }}>
            {headline.split(' ').map((word, i, arr) => (
              <span key={i} className="wow-word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>{word}{i < arr.length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <p className="wow-fu" style={{ ...LEAD, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: 0 }}>
            {helpFirst
              ? 'You told us what is going wrong. Please read the box below first.'
              : 'You told us what is going wrong. Here is what we do about each one, and what you can do tonight. Scroll, or skip straight in.'}
          </p>
        </div>
      </div>

      <div style={WRAP}>
        {/* ── What you told us ──────────────────────────────────────────
            Justin, 9 September 2026, with the reveal on his phone: "no black,
            these needs proper Happy News style."

            It was a deep espresso card (var(--deep-teal), #2E2818) carrying
            white type, and on a cream page it reads as a black slab. It was
            also the only dark block in the product and it landed directly
            under the hero, so the first thing a parent met after "Alma's
            pathway is built" was a black box.

            It is now a butter strip in the house hand: ink on butter, chunky
            border, hard shadow, their worries as chips rather than a stacked
            list. Same words, a third of the height, and it reads as good news
            rather than a warning.

            It also sits INSIDE the answers section now rather than being a
            section of its own, because naming the worries and answering them
            is one thought, and splitting it across two cards was what made a
            parent scroll past their own words to find the reply. */}

        {/* ── Your worries, and what we do about each ───────────────────
            This is the last screen before the price and the only question a
            parent is really asking is whether this deals with THEIR problem.
            Everything else on the page is secondary to that, so it comes
            first and it comes with the roll call attached. */}
        {/* ── Every worry they named, answered ─────────────────────────
            Justin, 9 September 2026: "though we redesigned and simplify this
            page with the problems and what we do to fix?" It never did. The
            page explained the platform and never once named the thing they
            walked in with. This is the last screen before the price, and the
            only question a parent is really asking here is whether this deals
            with THEIR problem, so it is answered before anything else. */}
        <section style={SECTION}>
          {helpFirst && <BiggerThanThis kid={kid} urgent />}
          <div className="wow-fu" style={EYEBROW}>What we do about it</div>
          <h2 className="wow-fu" style={H2}>
            {worries?.filter(w => w !== CATCH_ALL_ID).length === 1
              ? 'Your worry, and what we actually do about it.'
              : 'Your worries, and what we actually do about each one.'}
          </h2>
          {/* The line under the heading used to read "Not what we are. What
              happens, and the part of the product it happens in." That is a
              design note about our own positioning, and it asks a parent to
              think about us rather than about their evening. This says what
              the chips underneath every card actually mean, which is the one
              thing a first time reader cannot guess. */}
          <p className="wow-fu" style={{ ...LEAD, marginBottom: 18 }}>
            Every worry is picked up by the same few things: the daily check in, the scripts, the moments it shows up in, DiGi when you need to ask, the device time, their own app, the lessons, and your record of how it went.
          </p>

          {/* The roll call, in butter rather than the old black card. */}
          <div className="wow-fu" style={{
            background: 'var(--terracotta-lt)',
            border: '2px solid var(--ink)', borderRadius: 18,
            boxShadow: '0 5px 0 var(--ink)',
            padding: '14px 16px 16px', marginBottom: 24,
          }}>
            {/* The chips went. Every worry was printed here and then again as
                the heading of its own card immediately underneath, so the top
                of the most valuable section on the page was spent repeating
                itself. What is left is the part the cards do not say: that
                these are ordinary, and that none of it means you are late. */}
            <div style={{ ...EYEBROW, marginBottom: 7 }}>You told us</div>
            <p style={{ ...BODY, color: 'var(--ink)', margin: 0 }}>
              {rollCall.length > 1 ? `${rollCall.length} things` : 'One thing'}, at ages {ages}. {rollCall.length > 1 ? 'These are among' : 'This is one of'} the most common things parents raise, and there is a clear first step for {rollCall.length > 1 ? 'each one' : 'it'}. It is not a sign you are behind.
            </p>
          </div>

          {/* Order matters more than it looks. Default is ticked worries, then
              help, then the worry they typed: a parent who typed something
              frightening must not have to scroll PAST a marketing card to
              reach a phone number. When the gate fires it goes to the very
              top, above the heading. */}
          <WorryAnswers worryIds={worries ?? (worry ? [worry] : [])} own={own} tonight={action} helpFirst={helpFirst} />
          {!helpFirst && <BiggerThanThis kid={kid} />}
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section id="how" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>How it works</div>
          <Problem>Taking the device away works for one evening. The row is worse the next.</Problem>
          <h2 className="wow-fu" style={H2}>Not another blocking app. A plan you follow together.</h2>
          <p className="wow-fu" style={LEAD}>
            Blocking software makes tonight&apos;s decision for you and teaches {they} nothing for tomorrow. This works the other way round. Five minutes a day, and you can catch up on any day you miss.
          </p>
          <SolveLoop />
          <div className="wow-fu" style={{ marginTop: 22, background: 'var(--tint-green)', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 5px 0 var(--ink)', padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: 4 }}>Five minutes a day. Not a task every day.</div>
            <p style={{ ...BODY, fontSize: 'var(--text-base)' }}>Some days it is one tap. Some days it is a script at bedtime. The platform decides what today needs. You decide when.</p>
          </div>
        </section>

        {/* ── Screen time and balance ──────────────────────────────────── */}
        <section id="time" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>Devices, time and balance</div>
          <Problem>Every evening is the same negotiation, and you are guessing at how much is too much.</Problem>
          <h2 className="wow-fu" style={H2}>A number you agreed this morning, not one you defend at six.</h2>

          {/* ── THE NUMBER, SAID OUT LOUD ──────────────────────────────────
              Justin, 9 September 2026: "based on scientific data research we
              have already done add a recommended set time, note we need to
              calculate with the star system in mind."

              The page talked about how time works and never once said how
              much. A parent deciding whether to pay wants the number, and we
              have one, sourced, in lib/quests/screen-balance. Two numbers in
              fact, and the gap between them IS the product: the base is theirs
              at breakfast, the rest arrives with the day. */}
          <div className="wow-fu" style={{
            background: '#fff', border: '2px solid var(--ink)', borderRadius: 20,
            boxShadow: '0 5px 0 var(--ink)', padding: '18px 18px 20px', marginTop: 20,
          }}>
            {/* Short enough not to orphan the second number onto its own line at 390. */}
            <div style={{ ...EYEBROW, marginBottom: 8 }}>Our steer for ages {ages}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                {base} minutes
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
                to start the day
              </span>
              {/* On the number, not only in the paragraph below it. A scanning
                  parent takes away "60 minutes" and nothing else, and the
                  honest sixty words underneath never get read. */}
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', width: '100%' }}>
                A starting point, not a safe limit.
              </span>
            </div>
            <p style={{ ...BODY, color: 'var(--ink)', marginTop: 10 }}>
              Theirs at breakfast, without asking. The day reaches {guide} minutes, and the last {guide - base} arrive with jobs, reading and time outside. Both numbers are yours to move.
            </p>
            {/* ── SAY WHAT THE EVIDENCE ACTUALLY SAYS ────────────────────────
                The page used to give the number and leave it at that, which
                invites the reader to assume a medical threshold behind it.
                There is not one, and our own source list says so: the RCPCH
                looked in 2019 and declined to set a limit, and the AAP dropped
                its numeric rule for over fives in favour of a family plan. The
                WHO figure people quote covers under fives and does not apply
                to this age at all. Naming that is not a weakness, it is the
                difference between a claim a paediatrician would accept and one
                they would take apart. */}
            <p style={{ ...BODY, color: 'var(--ink-soft)', marginTop: 10, marginBottom: 0 }}>
              A starting point, not a safe limit. The RCPCH looked at the evidence in 2019 and decided there was not enough of it to set one, and the American Academy of Pediatrics dropped its old rule for this age in favour of a family plan, which is what this is. What the evidence is clearer about is sleep, meals and time outside, which is why those are the parts nobody can buy.
            </p>
          </div>

          <div className="wow-fu" style={{ marginTop: 22 }}><MockJars /></div>
          <div className="wow-fu" style={{ display: 'grid', gap: 16, marginTop: 22 }}>
            {/* ── NOT "EARN YOUR SCREEN TIME" ───────────────────────────────
                The 9 September research briefing is blunt about this: the
                mechanic is fine, the word is not. "Earn your screen time"
                invites every objection in the reward literature; "planned, not
                won" survives them. Same product, and a parent who has read one
                article about rewards does not bounce off it. */}
            <Point icon="checkin" title="Planned, not won">Most of the day is theirs before they do anything. Nobody has to win the first hour back.</Point>
            {/* A child whose mood is already low, put on a system where a good
                evening is earned and can be lost, is a plausible route to more
                conflict rather than less. The page sells the mechanic to
                exactly that parent, so it should say this. */}
            <Point icon="digi" title="If the mood is the worry, start without the stars">Use the check in and the scripts for a fortnight first. A child who feels they have to earn a good evening will not thank you for a chart.</Point>
            <Point icon="balance" title="Protected time nobody can buy">Bedtime, meals and school hours are off the table at any price.</Point>
          </div>

          {/* ── HOW THE TRACKING ACTUALLY WORKS, BEFORE THEY PAY ───────────
              Justin: "we suggest the device tracking system we have to manage
              this and it is manual, not system tracking (child's app)."

              Said here rather than discovered in week two. A parent who thinks
              they are buying screen time software and finds out later is a
              refund and a bad review; a parent who is told the honest version
              up front and buys anyway is the one this product is for. It is
              also a genuine advantage, and the paragraph says so rather than
              apologising. */}
          <div className="wow-fu" style={{
            background: 'var(--terracotta-lt)', border: '2px solid var(--terracotta)',
            borderRadius: 18, padding: '16px 18px', marginTop: 22,
          }}>
            <div style={{ ...EYEBROW, marginBottom: 6 }}>How the time is counted</div>
            <p style={{ ...BODY, color: 'var(--ink)', margin: '0 0 14px' }}>
              {`We do not read the device. ${they.charAt(0).toUpperCase() + they.slice(1)} asks in their own app, one tap agrees it. That is why it covers a Switch, a telly and a cousin's iPad, which no screen time app can see.`}
            </p>
            <MockAsk kid={kid || 'Your child'} />
            {/* The disclosure argued the upside of manual tracking and never
                the cost. A parent paying because a device is being used
                secretly at 1am needs to know this will not see that BEFORE
                they pay, not in week two. */}
            {/* The page holds this principle and never applied it to the one
                feature where it matters most: a daily mood record kept on an
                11 to 13 year old. A covert log found later is precisely the
                rupture this product exists to prevent. Written as the part we
                can guarantee today, which is our position rather than a claim
                about a screen in the child's app. */}
            <p style={{ ...BODY, color: 'var(--ink)', margin: '14px 0 0' }}>
              The check in is not a secret file kept on {they}, and we would not build one. If you
              are not willing for {they} to know you are keeping it, this is the wrong tool.
            </p>
            <p style={{ ...BODY, color: 'var(--ink)', margin: '14px 0 0' }}>
              Because {they} tells us, this works when you are working with them rather than around them. If you think a device is being used secretly at night, that is a different problem, and taking it out of the bedroom will do more than any app.
            </p>
          </div>

        </section>

        {/* ── What else is included ────────────────────────────────────
            Justin, 9 September 2026: "can we simplify this page but keep
            important parts."

            This was three sections: the child's app, the road to 16, and And
            for you. Nine headings on one page is a page a parent scrolls
            rather than reads, and by this point they have already been given
            the thing they came for (their worry, answered) and the mechanism
            (four steps). What is left is the answer to "and what else do I
            get", which is one question and so is one section.

            Cut in the merge: the four Points under And for you, because the
            scripts, the passport and the weekly check in are already named as
            proof chips on the cards that answer their actual worries, where
            they mean something. Naming them again as features is the kind of
            list this page was rebuilt to stop being. */}
        <section id="kid" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>Also included</div>
          <Problem>All of this is done TO {they} rather than with them, so nothing sticks once you are not in the room.</Problem>
          <h2 className="wow-fu" style={H2}>{kid ? `${kid} gets their own app, and it grows with them.` : 'Your child gets their own app, and it grows with them.'}</h2>
          <p className="wow-fu" style={LEAD}>
            A link, no login, no account, and nothing buzzes their phone at night. It is where the jobs, the stars and the lessons live, and it teaches social media before social media arrives.
          </p>
          <div className="wow-fu"><MockKidApp kid={kid || 'My'} /></div>
          <div className="wow-fu" style={{ display: 'grid', gap: 16, marginTop: 22 }}>
            <Point icon="lesson" title="Lessons that teach it before it arrives">The algorithm, group chats, strangers, passwords, what a screen does to a mood. Short, at the kitchen table, with a buddy they choose.</Point>
            <Point icon="kidapp" title="Five a day">A job, a lesson, time outside, a read, a kind thing. Ticked on the app or on paper. A full day earns a Planet Friend.</Point>
            <Point icon="passport" title="Printables and the paper chart">For the days with no device at all. The bucket list, the balance wheel, phones go to bed. Printed from any phone.</Point>
          </div>

          {/* The road, compact. It used to be a section with its own heading,
              lead, five rows, a chip cloud and a closing paragraph. What it
              has to say is that Stage {stage.id} is a start and not the whole
              purchase, which the rows say on their own. */}
          <h3 className="wow-fu" style={{ ...H2, fontSize: 'clamp(1.35rem, 4.4vw, 1.7rem)', marginTop: 34, marginBottom: 10 }}>
            One road, from 4 to 16.
          </h3>
          <p className="wow-fu" style={{ ...BODY, marginBottom: 14 }}>
            Stage {stage.id} is where you start, not where it ends. Each stage meets the problems of that age before they arrive, so sixteen is a step and not a cliff edge. The under 16 social media law changes the timing, not the plan.
          </p>
          <div className="wow-fu" style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 20, boxShadow: '0 5px 0 var(--ink)', overflow: 'hidden' }}>
            {STAGES.map((s, i) => {
              const here = s.id === stage.id
              const a = s.ageBand === '16+' ? '16 and up' : s.ageBand.replace('-', ' to ')
              return (
                <div key={s.id} style={{ display: 'flex', gap: 13, padding: '13px 16px', borderTop: i === 0 ? 'none' : '1.5px solid var(--border)', background: here ? 'var(--terracotta-lt)' : '#fff', alignItems: 'center' }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: `var(--stage-${s.id}-bold)`, color: `var(--stage-${s.id}-text)`, border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)' }}>{s.id}</span>
                  <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{s.name}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>{a}</span>
                    {here && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', border: '1.5px solid var(--ink)', padding: '2px 8px', borderRadius: 100 }}>You are here</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="wow-fu" style={{ marginTop: 24, padding: '18px 22px', borderLeft: '4px solid var(--terracotta)', background: '#fff', borderRadius: '0 16px 16px 0' }}>
            {/* stage.parentQuote is shown as written EXCEPT where it makes a
                causal claim about screens and mood. The Stage 3 quote read
                "her mood was dropping every Sunday evening, it took me a month
                to connect it to Instagram", which is the last emotional beat
                before the button and teaches exactly the inference we do not
                want a parent making: a Sunday dip in an eleven to thirteen
                year old has an obvious rival explanation the quote never
                names, which is Monday. A page that models "the dip was
                Instagram" trains parents toward the reading that lets them
                miss school refusal while feeling they have solved it. */}
            <p style={{ ...BODY, color: 'var(--ink)', fontStyle: 'italic' }}>{quote}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', margin: '8px 0 0', letterSpacing: '0.04em' }}>Parent, Stage {stage.id}</p>
          </div>
        </section>

        {/* ── The door ─────────────────────────────────────────────────── */}
        <div id="chapter-cta" ref={ctaRef} className="wow-fu" style={{ ...SECTION, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 22, padding: '30px 22px', boxShadow: '0 6px 24px rgba(26,26,46,0.07)' }}>
          <div style={EYEBROW}>{needsConfirm ? 'One last step' : `Stage ${stage.id} · ${stage.name}`}</div>
          <h2 style={{ ...H2, fontSize: 'clamp(1.6rem, 5.2vw, 2.1rem)' }}>{needsConfirm ? 'Check your email' : kid ? `${kid}'s pathway is ready` : 'Your pathway is ready'}</h2>
          <p style={{ ...LEAD, marginBottom: 20 }}>
            {needsConfirm
              ? 'We sent a link to confirm your email. Tap it, then step straight in. Everything you have just told us is saved.'
              : 'Setting up takes a couple of minutes and starts with one question about where things are right now.'}
          </p>
          <Door href={enterHref} label={needsConfirm ? 'I have confirmed, sign in' : 'Finish setting up'} big style={{ display: 'flex', width: '100%' }} />
          {/* ── WHAT HAPPENS ON DAY FIVE ──────────────────────────────────
              This said "Everything open for four days. No card needed to
              start." and stopped, in muted grey, under the button. A trial
              length with no word about what follows it is the shape of a
              countdown being hidden, and a parent who feels that later reads
              the whole page back as a sales trick.

              I wrote in an earlier pass that there was no price to state. That
              was wrong: /join, /terms and /pathway have all carried £7.99
              founder, £12.99 standard and £99 a year for weeks. This reveal
              was the only page in the funnel hiding a number the rest of the
              funnel shouts, which is worse than having no price at all,
              because a parent finishing setup then lands on /join and finds
              out we chose not to tell them.

              The numbers are duplicated as text rather than imported because
              the cap counter lives behind an async Stripe read on a server
              component and this screen is a client one. If they move, the
              guard in scripts/check-price-copy will fail. */}
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55 }}>
            Everything open for four days. No card to start, so nothing can charge you by accident.
            After that it is <strong>£7.99 a month</strong> at the founder rate, held for life and
            limited to the first fifty, then £12.99. We will email you before the four days are up,
            not after.
          </p>
          <p style={{ textAlign: 'center', marginTop: 8, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--terracotta-dark)', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* The door rides along the bottom once the first screen is read. */}
      <div aria-hidden={!showFloat} style={{
        position: 'fixed', left: 0, right: 0, bottom: 'max(12px, env(safe-area-inset-bottom))', zIndex: 55,
        display: 'flex', justifyContent: 'center', padding: '0 16px', pointerEvents: showFloat ? 'auto' : 'none',
        transform: showFloat ? 'translateY(0)' : 'translateY(90px)', opacity: showFloat ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 'min(100%, 460px)', background: '#fff', borderRadius: 18, border: `2px solid ${accent.bold}`, padding: '10px 10px 10px 18px', boxShadow: '0 12px 36px rgba(26,26,46,0.22)' }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.3 }}>
            {kid ? `${kid}'s pathway is ready` : 'Your pathway is ready'}
          </span>
          <Link href={enterHref} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 18px', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 13, textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            Finish setting up <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
