'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import ShareQrButton from '@/components/quests/ShareQrButton'
import NoPhoneButton from '@/components/quests/NoPhoneButton'
import PushPrompt from '@/components/push/PushPrompt'
import { STEPS, type SetupFlags, type SetupStep } from '@/lib/setup/steps'

// THE SETUP QUEST. Three numbered steps, revealed one at a time.
//
// Justin, 13 August 2026, in plans/setup-quest-three-steps.md: "Numbered steps
// that FLASH UP one at a time, animated, not a static checklist. One number,
// one card, one tap." And the rule that shapes everything below it: "Anything
// ticked never comes up again. Anything not ticked appears on the next sign in,
// same process, still to do."
//
// ── WHY DONE STEPS ARE NOT ON THIS PAGE AT ALL ──────────────────────────────
//
// The page this replaces had a To do list and a Done list, and the Done list
// was the bigger of the two by the end. That is a filing cabinet, not a quest.
// A finished step has nothing left to say, and leaving it on the page means a
// parent's reward for finishing something is a longer page.
//
// The count in the header is what keeps it honest. Three segments, one lit per
// step done, so a parent who finishes two sees "2 of 3 done" and one card,
// rather than a card and two receipts.
//
// ── THE NUMBERS DO NOT RENUMBER ─────────────────────────────────────────────
//
// Step three stays step three when steps one and two have gone. Renumbering the
// survivors to 1 and 2 would mean the number on screen changes meaning between
// visits, and the number is the only thing on the card a parent could use to
// hold their place. This is the Cleo pattern, and it is right.
//
// ── THE STATE LADDER, FROM THE MOBBIN REFERENCES ────────────────────────────
//
// Cleo AI, Hers and Chime all draw the same three states, and the difference
// between the current step and the ones behind it is carried by WEIGHT rather
// than by colour alone: the live step is a raised white card with a solid
// numeral disc and the only button on the page; the ones waiting are flat,
// quiet, on cream, and carry no action at all. A parent scanning the page can
// only tap one thing, which is the whole point of one step at a time.

type Props = {
  flags: SetupFlags
  child: { id: string; name: string | null } | null
  userId: string
}

export default function SetupQuest({ flags, child, userId }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  const todo = STEPS.map((step, i) => ({ step, number: i + 1 })).filter(s => !flags[s.step.key])
  const doneCount = STEPS.length - todo.length

  // The reveal, in the house motion: a short staggered fade up, the same tween
  // TodayPathBig uses for its nodes, so the two roads in the product move the
  // same way. Reduced motion gets the finished state and no animation, which is
  // why the cards are not painted transparent in CSS: if this effect never
  // runs, nothing is hidden.
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = el.querySelectorAll('[data-quest-step]')
    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out', delay: 0.1 },
    )
    return () => { tween.kill() }
  }, [])

  if (todo.length === 0) return <AllDone />

  return (
    <>
      <Progress done={doneCount} total={STEPS.length} />

      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {todo.map(({ step, number }, i) => (
          <StepCard
            key={step.key}
            step={step}
            number={number}
            live={i === 0}
            child={child}
            userId={userId}
          />
        ))}
      </div>
    </>
  )
}

// ── THE HEADER COUNT ────────────────────────────────────────────────────────

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            style={{
              flex: 1, height: '8px', borderRadius: '100px',
              background: i < done ? 'var(--terracotta)' : 'var(--border)',
              transition: 'background 0.4s ease',
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        {done} of {total} done
      </span>
    </div>
  )
}

// ── ONE STEP ────────────────────────────────────────────────────────────────

function StepCard({ step, number, live, child, userId }: {
  step: SetupStep
  number: number
  live: boolean
  child: { id: string; name: string | null } | null
  userId: string
}) {
  return (
    <div
      data-quest-step
      id={live ? step.key === 'childLink' ? 'share' : step.key === 'homeScreen' ? 'home-screen' : undefined : undefined}
      style={{
        display: 'flex', gap: '14px', alignItems: 'flex-start',
        background: live ? '#fff' : 'var(--cream)',
        border: live ? '1.5px solid var(--terracotta)' : '1px solid var(--border)',
        borderRadius: '18px',
        padding: live ? '18px 20px' : '15px 18px',
        boxShadow: live ? '0 6px 20px rgba(201,154,40,0.14)' : 'none',
        scrollMarginTop: '80px',
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: live ? 38 : 32, height: live ? 38 : 32, borderRadius: '50%',
          background: live ? 'var(--terracotta)' : 'transparent',
          border: live ? 'none' : '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: live ? 'var(--text-md)' : 'var(--text-sm)',
          color: live ? 'var(--ink)' : 'var(--ink-muted)',
        }}
      >
        {number}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: live ? 900 : 700,
          fontSize: live ? 'var(--text-lg)' : 'var(--text-md)',
          color: live ? 'var(--ink)' : 'var(--ink-muted)',
          lineHeight: 1.25, letterSpacing: '-0.01em', margin: 0,
        }}>
          {step.title}
        </h2>

        {/* Only the live step explains itself. A waiting step is a promise that
            there is more, and a paragraph under it is a wall of jobs by
            another name. */}
        {live && (
          <>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '6px 0 0' }}>
              {step.what}
            </p>
            <div style={{ marginTop: '14px' }}>
              <StepAction step={step} child={child} userId={userId} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── WHAT THE LIVE STEP ACTUALLY DOES ────────────────────────────────────────
//
// Two of the three finish HERE, without a navigation, and that is deliberate.
// The share step was reported dead on 13 August because it was a link to a page
// that could not open the thing it promised, and the fix on the Quests page was
// to open the sheet in place. A setup step whose whole shape is "one number, one
// card, one tap" should not spend that tap on a journey.
//
// The agreement is the exception and stays a link, because it is a real piece of
// work with its own page, not a switch.

function StepAction({ step, child, userId }: {
  step: SetupStep
  child: { id: string; name: string | null } | null
  userId: string
}) {
  if (step.key === 'agreement') {
    return (
      <Link
        href={step.href}
        style={{
          display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
          borderRadius: 16, padding: '13px 22px', textDecoration: 'none',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        Build it together
      </Link>
    )
  }

  if (step.key === 'childLink') {
    // No child on the account yet, which onboarding normally prevents. Send
    // them to add one rather than showing a share button with nothing to share.
    if (!child) {
      return (
        <Link
          href="/dashboard/settings"
          style={{
            display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 16, padding: '13px 22px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Add your child first
        </Link>
      )
    }
    const name = child.name && child.name !== 'Your child' ? child.name : 'your child'
    return (
      <>
        <ShareQrButton
          childId={child.id}
          childName={child.name}
          label="Show the code"
          style={{ fontSize: 'var(--text-md)', padding: '13px 22px' }}
        />
        {/* The second door, and it FINISHES the step rather than hiding it.
            A parent who says there is no phone has answered the question, and
            lib/handover/settled.ts is what brings the offer back in six months
            or when the child moves up an age band. */}
        <NoPhoneButton childId={child.id} childName={name} />
      </>
    )
  }

  // The home screen and the reminders, in one step, in the order they have to
  // happen on an iPhone: Apple only allows web push once the app is on the home
  // screen, so the instructions come first and the permission card second.
  return (
    <>
      <HomeScreenHow />
      <div style={{ marginTop: '14px' }}>
        <PushPrompt userId={userId} />
      </div>
    </>
  )
}

// ── THE TWO TAPS ────────────────────────────────────────────────────────────
//
// The same instructions InstallPrompt gives in its iOS sheet, inline, because
// here a parent has ASKED how rather than been interrupted by a banner. Written
// for both platforms in one block rather than sniffing the user agent: a parent
// setting this up on a laptop for a phone they will use it on is a real case,
// and a sniffed page shows them the wrong half.
function HomeScreenHow() {
  const row: React.CSSProperties = {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: 'var(--cream)', borderRadius: '14px', padding: '12px 14px',
  }
  const marker: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
    color: 'var(--terracotta-dark)', flexShrink: 0, paddingTop: '2px',
  }
  const line: React.CSSProperties = { fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={row}>
        <span style={marker}>iPhone</span>
        <span style={line}>
          Tap <strong>Share</strong> in the Safari bar at the bottom, then <strong>Add to Home Screen</strong>, then <strong>Add</strong>.
        </span>
      </div>
      <div style={row}>
        <span style={marker}>Android</span>
        <span style={line}>
          Tap the <strong>three dots</strong> in Chrome, then <strong>Add to Home screen</strong>, then <strong>Install</strong>.
        </span>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '2px 0 0' }}>
        Open it from your home screen once and this step ticks itself.
      </p>
    </div>
  )
}

// ── THE FINISH ──────────────────────────────────────────────────────────────
//
// "What happens when the last one goes green: straight into Today, the coins,
// and the proper check in page."
//
// One button, and it goes to Today rather than staying here congratulating
// them. The rung on Today disappears at the same moment, so a parent who taps
// through lands on a Home with no setup on it at all, which is the reward.

function AllDone() {
  return (
    <div style={{
      background: 'var(--tint-sage)', border: '1.5px solid var(--stage-1-bold)',
      borderRadius: '20px', padding: '26px 22px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: '10px' }} aria-hidden>🧭</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        You are set up
      </h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        That is the one time work done, and it does not come back. From here it is
        ten minutes a day: the check in first, then whatever today has picked for you.
      </p>
      <Link
        href="/dashboard"
        style={{
          display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
          borderRadius: 16, padding: '15px 28px', textDecoration: 'none',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        Start today
      </Link>
    </div>
  )
}
