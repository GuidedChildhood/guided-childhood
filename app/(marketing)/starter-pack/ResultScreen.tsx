'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { starterNext, SETUP_HREF } from '@/lib/starter/next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Celebration from '@/components/ui/Celebration'
import { getStageFromAgeBand, type ChallengeId, type FeelingId } from '@/lib/content/stages'
import { CATCH_ALL_ID, worryLabel } from '@/lib/onboarding/worries'
import WorryAnswers from '@/components/starter/WorryAnswers'
import Fold from '@/components/starter/Fold'
import StickyJoin from '@/components/starter/StickyJoin'
import { Passport, Fixes, DigiLearns, AlsoInside } from '@/components/starter/InsideBlocks'
import KnownProblems from '@/components/starter/KnownProblems'
import BiggerThanThis from '@/components/starter/BiggerThanThis'
import ShareStage from '@/components/starter/ShareStage'
import { needsHelpFirst } from '@/lib/concerns/risk'
import MethodIcon, { METHOD, type MethodId } from '@/components/starter/MethodIcon'
import { termTimeDailyMinutes, termTimeBaseMinutes } from '@/lib/quests/screen-balance'
import { MockJars } from './Mocks'

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
  /**
   * Open the account step, for a parent who does not have one yet.
   *
   * The account moved to the END of this flow on 10 September 2026, so this
   * page is now the sell rather than a receipt: it is read in full, by anyone,
   * with no session. When this is given, every door on the page opens the
   * account step instead of walking into a dashboard that does not exist yet.
   * See plans/2026-09-10-starter-account-last.md.
   */
  onJoin?: () => void
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

// The doors out of the reveal. They NAVIGATE for a parent who already has an
// account, and ACT for one who does not, because the account step now lives at
// the end of this flow rather than in front of it: see
// plans/2026-09-10-starter-account-last.md.
function Door({ href, label, big = false, style, onClick }: { href: string; label: string; big?: boolean; style?: React.CSSProperties; onClick?: () => void }) {
  const look: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: big ? '17px 28px' : '12px 20px', borderRadius: big ? 16 : 100,
    background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: big ? 'var(--text-md)' : 'var(--text-base)',
    letterSpacing: '-0.01em', boxShadow: big ? '0 5px 0 var(--terracotta-dark)' : '0 3px 0 var(--terracotta-dark)',
    whiteSpace: 'nowrap',
    ...style,
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={{ ...look, border: 'none', cursor: 'pointer' }}>
        {label} <span aria-hidden>→</span>
      </button>
    )
  }
  return (
    <Link href={href} style={look}>
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
      background: 'var(--stage-3)', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
      boxShadow: 'var(--lift-deep)',
      padding: '13px 16px', margin: '0 0 16px',
    }}>
      <span aria-hidden style={{
        flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
        background: 'var(--stage-3-bold)', border: 'var(--edge)', boxSizing: 'border-box',
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
      <span aria-hidden style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 'var(--radius-tile)', background: METHOD[icon].tint, border: 'var(--edge)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <MethodIcon id={icon} size={23} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>{title}</div>
        <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 3 }}>{children}</p>
      </div>
    </div>
  )
}

export default function ResultScreen({ stage, accent, challenge, worry, worries, worryOther, email, needsConfirm, childName, onJoin }: Props) {
  // The account exists from the first screen, so stepping in opens setup,
  // which starts on the check in that becomes the baseline. Only a pending
  // email confirmation goes by the login door first.
  // A page that sent them here with ?next= (lib/starter/next.ts) gets them
  // back, through the login door too when the email still needs confirming.
  const next = starterNext()
  // No address in the link (6 November 2026): ?from=starter has the login form
  // fill the email from gc_starter_email, which the starter pack saved on this
  // device, so a URL never carries it into logs or history (funnel audit fix 8).
  const loginQuery = [email ? 'from=starter' : '', next ? `next=${encodeURIComponent(next)}` : ''].filter(Boolean).join('&')
  const enterHref = needsConfirm ? `/login${loginQuery ? `?${loginQuery}` : ''}` : (next ?? SETUP_HREF)
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
  const kid = childName && childName.length > 1 ? childName : ''
  const they = kid || 'your child'
  const headline = kid ? `${kid}'s pathway is ready.` : 'Your pathway is ready.'
  const ages = stage.ageBand === '16+' ? '16 and up' : stage.ageBand.replace('-', ' to ')
  // The term time pair, so the number on this page is the number the app will
  // set and the fridge sheet will print. Term time rather than holiday relaxed:
  // a figure on a sales page should not move under the reader in August.
  const guide = termTimeDailyMinutes(stage.ageBand)
  const base = termTimeBaseMinutes(stage.ageBand)

  const rootRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // ── ONE DOOR ON SCREEN, NEVER TWO ────────────────────────────────────────
  //
  // Until 13 September 2026 this page carried two floating doors at once: the
  // StickyJoin bar (10 September) and an older white pill with its own
  // IntersectionObserver, which nobody removed when the bar arrived. On a
  // phone the pill sat on top of the bar; at 1440 both were plainly visible,
  // stacked. The bar stays. It runs on a plain scroll listener for everyone,
  // reduced motion included, which was the only thing the pill still did.
  //
  // A parent who typed something frightening gets no floating door at all.
  // The real one is still at the end of the page. A sticky Finish setting up
  // riding over a block that names Childline is the product selling over the
  // top of a crisis, and there is no breakpoint where that is acceptable.
  // The pill honoured this and the bar did not, which was a second reason to
  // have one door rather than two.

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

      {/* ── THE DOOR, ALWAYS ON SCREEN ────────────────────────────────────
          The page was 9899px at 390 wide and the only way in was at the bottom
          of all of it, so a parent sold on screen three had nowhere to say yes.
          This is worth more than every word cut elsewhere on the page. It waits
          until they are past the first section, because a buy button over their
          own child's name reads as a shop rather than an answer, and it hides
          again at the foot where the real card is. See StickyJoin. */}
      {!helpFirst && (
        <StickyJoin
          href={enterHref}
          onClick={onJoin}
          label={onJoin ? `Save ${kid ? `${kid}'s` : 'this'} pathway` : needsConfirm ? 'Check your email' : 'Finish setting up'}
          note="Free for four days. No card."
        />
      )}
      {/* How far down the page they are, a hairline under the status bar. */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 60, pointerEvents: 'none' }} aria-hidden>
        <div ref={progressRef} style={{ height: '100%', background: 'var(--terracotta)', transform: 'scaleX(0)', transformOrigin: 'left' }} />
      </div>

      {/* ── The arrival ─────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1.5px solid var(--border)', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 22px)', paddingBottom: 30 }}>
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: accent.bold, color: accent.text, padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>
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
              // Justin, 15 October 2026: "make super easy read". This line used
              // to say what the section heading underneath it says again, so
              // the first two things a parent read were the same sentence. It
              // now tells them where to start, which is the one thing a long
              // page owes its reader.
              : 'Start with the first card. It has something to try tonight.'}
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
          {/* The line that sat here explained how to read the cards ("each
              card names the problem, then the four things we do about it").
              Instructions for reading a card are a sign the card needs
              explaining, and these do not: the problem is the heading and the
              four things are labelled. Cut for an easier read, 15 October 2026. */}
          <div style={{ height: 6 }} />

          {/* The You told us card went, 14 November 2026: it counted the
              worries the cards underneath already name, and the page had to
              get shorter. */}

          {/* Order matters more than it looks. Default is ticked worries, then
              help, then the worry they typed: a parent who typed something
              frightening must not have to scroll PAST a marketing card to
              reach a phone number. When the gate fires it goes to the very
              top, above the heading. */}
          <WorryAnswers worryIds={worries ?? (worry ? [worry] : [])} own={own} tonight={action} yourPhone={stage.yourPhone} helpFirst={helpFirst} />

          {/* ── GOOD TO KNOW: TWO ROWS, THE DETAIL ONE TAP AWAY ────────────
              Justin, 13 September 2026, with the other parents card and the
              safeguarding card in his screenshot: keep the first part, "fold
              the other parts like attached to make super efficient and
              simple, happy news style, Apple UX quality."

              Both cards were printed in full under the worry cards, so the
              answer a parent came for was followed by two more screens before
              the page moved on. Monzo's What we'll do next puts the promise
              in full and then a Good to know group of icon rows, the detail
              behind each. Same here. Nothing is cut (see Fold for why).

              The visible line on each row is chosen so a parent scanning past
              still gets the one fact that matters: the other parents row
              carries the nine in ten, and the safeguarding row carries
              Childline and 999. The URGENT version of the safeguarding block,
              for a parent whose typed worry trips lib/concerns/risk, is not
              here: it leads the page, open, above the heading, as before.
              scripts/check-starter-fold.mjs holds all three of those. */}
          {!helpFirst && (
            <div className="wow-fu" style={{ marginTop: 26 }}>
              <div style={{ ...EYEBROW, marginBottom: 2 }}>Good to know</div>
              <Fold happy="friends" tint="var(--stage-3)" label="You are not the only one" line="9 in 10 parents argue about screen time.">
                <KnownProblems inRow />
              </Fold>
              <Fold happy="heart" tint="var(--tint-sage)" label="When it is bigger than this" line="Childline 0800 1111, any hour. 999 if not safe now.">
                <BiggerThanThis kid={kid} inRow />
              </Fold>
            </div>
          )}
        </section>

        {/* ── THE MIDDLE OF THE PAGE, IN PICTURES (14 November 2026) ────
            Justin, on this page: "super slick and much less wordy and
            obvious", show what we offer and solve, the passport that gets
            them safe, ready and taught, and DiGi with how it learns. It was
            three sections of sentences (how it works, devices and time, also
            included) at about 6,400px on a phone. Now four blocks, a picture
            and a few words each. See components/starter/InsideBlocks.

            Nothing honest was cut. The time number, where it comes from, the
            three kinds of time and the "we do not read the device" disclosure
            all sit one tap in, under the stars, because a parent paying for
            the star system should be able to read them before they do. */}
        <div style={SECTION}><Passport here={stage.id} kid={kid} /></div>

        <div style={SECTION}>
          <Fixes
            kid={kid || 'Your child'}
            words={stage.script.sayThis}
            concern={concern}
            afterStars={
              <Fold label={`How the time works, and the ${base} minute start`} tone="card">
                <div style={{ ...EYEBROW, marginBottom: 6 }}>Our steer for ages {ages}</div>
                <p style={{ ...BODY, color: 'var(--ink)', margin: '0 0 6px' }}>
                  <strong>{base} minutes to start the day.</strong> A starting point, not a safe limit.
                </p>
                <p style={{ ...BODY, color: 'var(--ink)', margin: '0 0 12px' }}>
                  Theirs at breakfast, without asking. The day reaches {guide} minutes, and the last {guide - base} arrive with jobs, reading and time outside. Both numbers are yours to move.
                </p>
                {/* Said rather than implied: there is no medical threshold
                    behind the number, and our own sources say so. */}
                <p style={{ ...BODY, color: 'var(--ink-soft)', margin: '0 0 16px' }}>
                  The RCPCH looked at the evidence in 2019 and decided there was not enough of it to set a limit, and the American Academy of Pediatrics dropped its old rule for this age in favour of a family plan, which is what this is. What the evidence is clearer about is sleep, meals and time outside, which is why those are the parts nobody can buy.
                </p>
                <div style={{ margin: '4px 0 16px' }}><MockJars /></div>
                <div style={{ display: 'grid', gap: 16 }}>
                  <Point icon="checkin" title="Planned, not won">Most of the day is theirs before they do anything. Nobody has to win the first hour back.</Point>
                  <Point icon="digi" title="If the mood is the worry, start without the stars">Use the check in and the scripts for a fortnight first. A child who feels they have to earn a good evening will not thank you for a chart.</Point>
                  <Point icon="balance" title="Protected time nobody can buy">Bedtime, meals and school hours are off the table at any price.</Point>
                </div>
                {/* Before they pay, not in week two: this is manual, and it is
                    not a secret file on the child. */}
                <div style={{
                  background: 'var(--terracotta-lt)', border: '2px solid var(--terracotta)',
                  borderRadius: 'var(--radius-card)', padding: '16px 18px', marginTop: 18,
                }}>
                  <div style={{ ...EYEBROW, marginBottom: 6 }}>How the time is counted</div>
                  <p style={{ ...BODY, color: 'var(--ink)', margin: 0 }}>
                    {`We do not read the device. ${they.charAt(0).toUpperCase() + they.slice(1)} asks in their own app, one tap agrees it. That is why it covers a Switch, a telly and a cousin's iPad, which no screen time app can see.`}
                  </p>
                  <p style={{ ...BODY, color: 'var(--ink)', margin: '14px 0 0' }}>
                    The check in is not a secret file kept on {they}, and we would not build one. If you
                    are not willing for {they} to know you are keeping it, this is the wrong tool.
                  </p>
                  <p style={{ ...BODY, color: 'var(--ink)', margin: '14px 0 0' }}>
                    Because {they} tells us, this works when you are working with them rather than around them. If you think a device is being used secretly at night, that is a different problem, and taking it out of the bedroom will do more than any app.
                  </p>
                </div>
              </Fold>
            }
          />
        </div>

        <div style={SECTION}><DigiLearns /></div>

        <div style={SECTION}><AlsoInside /></div>

        {/* ── The door ─────────────────────────────────────────────────── */}
        <div id="chapter-cta" className="wow-fu" style={{ ...SECTION, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '30px 22px', boxShadow: '0 6px 24px rgba(26,26,46,0.07)' }}>
          <div style={EYEBROW}>{needsConfirm ? 'One last step' : `Stage ${stage.id} · ${stage.name}`}</div>
          <h2 style={{ ...H2, fontSize: 'clamp(1.6rem, 5.2vw, 2.1rem)' }}>{needsConfirm ? 'Check your email' : 'Ready when you are'}</h2>
          <p style={{ ...LEAD, marginBottom: 20 }}>
            {needsConfirm
              ? 'We sent a link to confirm your email. Tap it, then step straight in. Everything you have just told us is saved.'
              : 'Setting up takes a couple of minutes and starts with one question about where things are right now.'}
          </p>
          <Door
            href={enterHref}
            onClick={onJoin}
            label={onJoin ? `Save ${kid ? `${kid}'s` : 'this'} pathway` : needsConfirm ? 'I have confirmed, sign in' : 'Finish setting up'}
            big
            style={{ display: 'flex', width: '100%' }}
          />
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

        {/* ── Send it on ───────────────────────────────────────────────────
            The share action (stage-result-share-action): after the door, so it
            never competes with it, and never for a parent whose own answer
            needs help first, for the same reason the sticky door hides then.
            See components/starter/ShareStage. */}
        {!helpFirst && <ShareStage member={!onJoin} />}
      </div>

    </div>
  )
}
