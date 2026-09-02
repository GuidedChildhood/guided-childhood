'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Celebration from '@/components/ui/Celebration'
import { STAGES, CHALLENGE_OPTIONS, getStageFromAgeBand, type ChallengeId, type FeelingId } from '@/lib/content/stages'
import { MockCheckIn, MockToday, MockProgress, MockDigi, MockAsk, MockJars, MockKidApp } from './Mocks'

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
const STEP_TITLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 8px',
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

/** A numbered step: the number, the title, the sentences, then the picture. */
function Step({ n, title, children, picture }: { n: number; title: string; children: React.ReactNode; picture: React.ReactNode }) {
  return (
    <div className="wow-fu" style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'var(--terracotta)', border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{n}</span>
        <div style={{ minWidth: 0, paddingTop: 4 }}>
          <h3 style={STEP_TITLE}>{title}</h3>
          <p style={BODY}>{children}</p>
        </div>
      </div>
      {picture}
    </div>
  )
}

/** A plain point: a bold first line and a sentence under it. */
function Point({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span aria-hidden style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: '#fff', border: '1.5px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>{title}</div>
        <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 3 }}>{children}</p>
      </div>
    </div>
  )
}

export default function ResultScreen({ stage, accent, challenge, email, needsConfirm, childName }: Props) {
  // The account exists from the first screen, so stepping in opens setup,
  // which starts on the check in that becomes the baseline. Only a pending
  // email confirmation goes by the login door first.
  const enterHref = needsConfirm ? `/login${email ? `?email=${encodeURIComponent(email)}` : ''}` : '/dashboard/setup'
  const action = stage.challengeActions[challenge] ?? stage.action
  const concern = CHALLENGE_OPTIONS.find(c => c.value === challenge)?.label ?? 'what you told us'
  const kid = childName && childName.length > 1 ? childName : ''
  const they = kid || 'your child'
  const headline = kid ? `${kid}'s pathway is built.` : 'Your pathway is built.'
  const ages = stage.ageBand === '16+' ? '16 and up' : stage.ageBand.replace('-', ' to ')

  const rootRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [showFloat, setShowFloat] = useState(false)

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
      if (firstRef.current) {
        ScrollTrigger.create({ trigger: firstRef.current, start: 'bottom 70%', onEnter: () => setShowFloat(true), onLeaveBack: () => setShowFloat(false) })
      }
      if (ctaRef.current) {
        ScrollTrigger.create({ trigger: ctaRef.current, start: 'top 95%', onEnter: () => setShowFloat(false), onLeaveBack: () => setShowFloat(true) })
      }
      const fus = gsap.utils.toArray<HTMLElement>('.wow-fu', rootRef.current)
      if (fus.length) {
        gsap.set(fus, { opacity: 0, y: 22 })
        ScrollTrigger.batch(fus, { start: 'top 90%', once: true, onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' }) })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const problems = [
    ...CHALLENGE_OPTIONS.map(c => c.label),
    'Group chats', 'The algorithm', 'Strangers online', 'Passwords', 'Bedtime and sleep', 'The first phone', 'Gaming money', 'AI and homework',
  ]

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 26 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: accent.bold, color: accent.text, padding: '6px 12px', borderRadius: 100, whiteSpace: 'nowrap' }}>
              Stage {stage.id} · {stage.name}
            </span>
            <Door href={enterHref} label="Get started" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 7.5vw, 2.9rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.08, margin: '0 0 14px' }}>
            {headline.split(' ').map((word, i, arr) => (
              <span key={i} className="wow-word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>{word}{i < arr.length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <p className="wow-fu" style={{ ...LEAD, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: 0 }}>
            Here is how the platform works, what DiGi does, and what the next few weeks look like for {they}. Two minutes to read, then one button.
          </p>
        </div>
      </div>

      <div style={WRAP}>
        {/* ── What you told us ────────────────────────────────────────── */}
        <section style={{ ...SECTION, marginTop: 34 }}>
          <div className="wow-fu" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 6px 24px rgba(26,26,46,0.07)' }}>
            <div style={{ background: 'var(--deep-teal)', padding: '18px 22px 20px' }}>
              <div style={{ ...EYEBROW, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>You told us</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{concern}</div>
            </div>
            <div style={{ padding: '18px 22px 22px' }}>
              <p style={{ ...BODY, color: 'var(--ink)' }}>
                At ages {ages} this is one of the most common things parents raise. It is not a sign you are behind. It is the first thing we fix, and there is a clear first step.
              </p>
              <div style={{ marginTop: 16, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 16, padding: '14px 16px' }}>
                <div style={{ ...EYEBROW, marginBottom: 6 }}>Tonight</div>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45 }}>{action}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section id="how" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>How it works</div>
          <h2 className="wow-fu" style={H2}>Not another blocking app. A plan you follow together.</h2>
          <p className="wow-fu" style={LEAD}>
            Blocking software makes tonight&apos;s decision for you and teaches {they} nothing for tomorrow. This works the other way round. Three steps, five minutes a day.
          </p>
          <Step n={1} title="You say what happened" picture={<MockCheckIn concern={concern} />}>
            One tap a day on how it went. The morning, homework, the gaming handover, bedtime. Tap the moment that went wrong and it becomes a worry the platform works on, with five stars to fill.
          </Step>
          <Step n={2} title="You get the one thing to do, and the words" picture={<MockToday action={action} words={stage.script.sayThis} />}>
            Every day picks one small thing for {they}&apos;s age and what you told us. The exact words are written out, ready before the moment rather than after it.
          </Step>
          <Step n={3} title="You watch it move" picture={<MockProgress concern={concern} />}>
            Once a week you rate each worry again. The stars fill as things settle. When a worry reaches five it is stamped in the passport, and the next one comes up.
          </Step>
          <div className="wow-fu" style={{ marginTop: 22, background: 'var(--tint-green)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: 4 }}>Five minutes a day. Not a task every day.</div>
            <p style={{ ...BODY, fontSize: 'var(--text-base)' }}>Some days it is one tap. Some days it is a script at bedtime. The platform decides what today needs. You decide when.</p>
          </div>
        </section>

        {/* ── How DiGi works ───────────────────────────────────────────── */}
        <section id="digi" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>How DiGi works</div>
          <h2 className="wow-fu" style={H2}>A guide who knows your family, at 11pm.</h2>
          <p className="wow-fu" style={LEAD}>
            DiGi is our guide. Ask what actually happened, in your own words, and you get a real answer for {they}, not a lecture and not a list of links.
          </p>
          <div className="wow-fu">
            <MockDigi
              question={`${concern}. It happened again tonight. What do I do?`}
              answer={`This is common at ages ${ages}, and it is fixable. Do not take the phone tonight. Here is the one thing to do, and the words.`}
              words={stage.script.sayThis}
            />
          </div>
          <div className="wow-fu" style={{ display: 'grid', gap: 16, marginTop: 22 }}>
            <Point icon="🧭" title="Never a flat yes or no">Every answer is where you are, the next step, and the words to say. Allow or deny is the one thing DiGi will not do.</Point>
            <Point icon="🏠" title="It remembers your family">{kid ? `${kid}'s age` : 'Your child\'s age'}, what you told us, what worked last time and what did not. You never start from nothing.</Point>
            <Point icon="📚" title="Built on the research">Trained on the evidence, and it can tell you where a claim comes from. No invented studies, no made up numbers.</Point>
            <Point icon="🌙" title="There when it happens">Three questions a day are free. The moment anything kicks off, you have somewhere to ask.</Point>
          </div>
        </section>

        {/* ── Screen time and balance ──────────────────────────────────── */}
        <section id="time" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>Devices, time and balance</div>
          <h2 className="wow-fu" style={H2}>Screen time that stops being a fight.</h2>
          <p className="wow-fu" style={LEAD}>
            Three kinds of time, and {they} is part of the deal rather than the subject of it.
          </p>
          <div className="wow-fu"><MockJars /></div>
          <div className="wow-fu" style={{ display: 'grid', gap: 16, marginTop: 22 }}>
            <Point icon="⭐" title="Jobs earn stars, stars earn minutes">Real jobs, time outside, a book. You set the rate. The argument stops being a negotiation, because the deal was agreed before it started.</Point>
            <Point icon="🛏️" title="Protected time nobody can buy">Bedtime, mealtimes and school hours are off the table at any price. A start inside them comes to you as an ask, never a flat no.</Point>
          </div>
          <div className="wow-fu" style={{ marginTop: 22 }}><MockAsk kid={kid || 'Your child'} /></div>
          <p className="wow-fu" style={{ ...BODY, marginTop: 14 }}>
            {they.charAt(0).toUpperCase() + they.slice(1)} picks the screen and the minutes on their own app. It pops up on yours. One tap and the stars come off. If they are a few short you can still say yes, and it is your treat rather than a loophole.
          </p>
          <div className="wow-fu" style={{ marginTop: 22 }}>
            <Point icon="📱" title="Device settings, one screen at a time">iPhone, iPad, the Switch, the PlayStation, the TV. A guide for {they}&apos;s age of exactly what to set tonight, in plain English, before anything else.</Point>
          </div>
        </section>

        {/* ── The child's own app ──────────────────────────────────────── */}
        <section id="kid" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>Included</div>
          <h2 className="wow-fu" style={H2}>{kid ? `${kid} gets their own app.` : 'Your child gets their own app.'}</h2>
          <p className="wow-fu" style={LEAD}>
            A link, no login, no account, and nothing buzzes their phone at night. It is where the jobs, the stars and the lessons live, and it teaches social media before social media arrives.
          </p>
          <div className="wow-fu"><MockKidApp kid={kid || 'My'} /></div>
          <div className="wow-fu" style={{ display: 'grid', gap: 16, marginTop: 22 }}>
            <Point icon="🧠" title="Lessons that teach it before it arrives">The algorithm, group chats, strangers, passwords, what a screen does to a mood. Short, at the kitchen table, with a buddy they choose.</Point>
            <Point icon="🖐️" title="Five a day">A job, a lesson, time outside, a read, a kind thing. Ticked on the app or on paper. A full day earns a Planet Friend.</Point>
            <Point icon="🖨️" title="Printables and the paper chart">For the days with no device at all. The bucket list, the balance wheel, phones go to bed. Printed from any phone.</Point>
          </div>
        </section>

        {/* ── The road to 16 ───────────────────────────────────────────── */}
        <section id="road" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>Ages 4 to 16</div>
          <h2 className="wow-fu" style={H2}>One road, and every problem on it.</h2>
          <p className="wow-fu" style={LEAD}>
            Stage {stage.id} is where you start, not where it ends. Each stage meets the problems of that age before they arrive, so sixteen is a step and not a cliff edge.
          </p>
          <div className="wow-fu" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 22, overflow: 'hidden' }}>
            {STAGES.map((s, i) => {
              const here = s.id === stage.id
              const a = s.ageBand === '16+' ? '16 and up' : s.ageBand.replace('-', ' to ')
              return (
                <div key={s.id} style={{ display: 'flex', gap: 14, padding: '14px 18px', borderTop: i === 0 ? 'none' : '1.5px solid var(--border)', background: here ? 'var(--terracotta-lt)' : '#fff', alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: `var(--stage-${s.id}-bold)`, color: `var(--stage-${s.id}-text)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', marginTop: 2 }}>{s.id}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{s.name}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>{a}</span>
                      {here && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', padding: '2px 8px', borderRadius: 100 }}>You are here</span>}
                    </div>
                    <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 3 }}>{s.focus}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="wow-fu" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            {problems.map(p => (
              <span key={p} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 100, padding: '7px 13px' }}>{p}</span>
            ))}
          </div>
          <p className="wow-fu" style={{ ...BODY, marginTop: 14 }}>
            Scripts, lessons and a DiGi answer for each of these, at the age it comes up. The under 16 social media law changes the timing, not the plan.
          </p>
        </section>

        {/* ── For you ──────────────────────────────────────────────────── */}
        <section id="you" style={SECTION}>
          <div className="wow-fu" style={EYEBROW}>And for you</div>
          <h2 className="wow-fu" style={H2}>The words, the record, and one email a week.</h2>
          <div className="wow-fu" style={{ display: 'grid', gap: 16, marginTop: 6 }}>
            <Point icon="💬" title="160 exact scripts">The words for every hard conversation from first tablet to first phone, and a place to rehearse them with DiGi before you need them.</Point>
            <Point icon="🛂" title="The passport to sixteen">Every worry settled, every stage stamped, in one record you fill in together. Sixteen is a step, not a cliff edge.</Point>
            <Point icon="📊" title="The weekly check in">Five stars per worry, once a week. You see what is actually working before you decide what to do next.</Point>
            <Point icon="✉️" title="One email a week, written by a parent">One useful thing, never more than one a week from all of us put together.</Point>
          </div>
          <div className="wow-fu" style={{ marginTop: 26, padding: '18px 22px', borderLeft: '3px solid var(--terracotta)', background: '#fff', borderRadius: '0 16px 16px 0' }}>
            <p style={{ ...BODY, color: 'var(--ink)', fontStyle: 'italic' }}>{stage.parentQuote}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', margin: '8px 0 0', letterSpacing: '0.04em' }}>Parent, Stage {stage.id}</p>
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
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            Everything open for four days. No card needed to start.
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
            Step in <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
