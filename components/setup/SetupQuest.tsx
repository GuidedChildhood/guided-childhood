'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
// ── DONE STEPS STAY, AT THE TOP, WEARING A BIG GREEN TICK ──────────────────
//
// Justin, 15 August 2026: "once each step is done, for example they click the
// agreement, it should once set so they click sign then a big green tick and
// stay on top of list then opens second step."
//
// This reverses the first build, which removed a step the moment it went green
// on the argument that a finished step has nothing left to say. That argument
// was wrong in the one way that matters: it is the parent's argument, not ours.
// The ticks ARE the reward. A page that empties as you work gives you less to
// look at the more you do, and on the last step a parent sees a single card and
// no evidence they ever did anything. Four green ticks stacked above the one
// live card is the progress made visible, which is the entire point of drawing
// setup as a quest rather than a form.
//
// So the page reads top to bottom as: what you have done, what you are doing,
// what is left.
//
// ── THE NUMBERS DO NOT RENUMBER ─────────────────────────────────────────────
//
// Step three is always step three. Nothing is removed now, so this costs
// nothing, but it stays a rule because a number that changes meaning between
// visits is the one thing a parent cannot navigate by.
//
// ── THE STATE LADDER, FROM THE MOBBIN REFERENCES ────────────────────────────
//
// Cleo AI, Hers and Chime all draw the same three states, and the difference
// between the current step and the ones behind it is carried by WEIGHT rather
// than by colour alone: the live step is a raised white card with a solid
// numeral disc and the only button on the page; the ones waiting are flat,
// quiet, on cream, and carry no action at all. A parent scanning the page can
// only tap one thing, which is the whole point of one step at a time.

// The anchors the steps' own hrefs point at, so a step that finishes on this
// page can be linked to from the floating next step bar and land on itself.
const ANCHOR: Partial<Record<keyof SetupFlags, string>> = {
  childLink: 'share',
  homeScreen: 'home-screen',
  children: 'children',
}

type Props = {
  flags: SetupFlags
  child: { id: string; name: string | null } | null
  userId: string
}

export default function SetupQuest({ flags, child, userId }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  // Every step is drawn, in list order. `state` is what changes, not presence:
  // done keeps its place at the top with a tick, the first undone one is live,
  // everything after it waits quietly.
  const firstUndone = STEPS.findIndex(s => !flags[s.key])
  const rows = STEPS.map((step, i) => ({
    step,
    number: i + 1,
    state: (flags[step.key] ? 'done' : i === firstUndone ? 'live' : 'waiting') as StepState,
  }))
  const doneCount = rows.filter(r => r.state === 'done').length

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

  if (firstUndone === -1) return <AllDone />

  return (
    <>
      <Progress done={doneCount} total={STEPS.length} steps={STEPS} flags={flags} />

      {/* Done steps are the BAR now, not cards. Only the live step and the ones
          still waiting are drawn, so the thing a parent can act on is always the
          first thing under the bar rather than four scrolls down. */}
      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows.filter(r => r.state !== 'done').map(({ step, number, state }) => (
          <StepCard
            key={step.key}
            step={step}
            number={number}
            state={state}
            child={child}
            userId={userId}
          />
        ))}
      </div>
    </>
  )
}

type StepState = 'done' | 'live' | 'waiting'

// ── THE HEADER COUNT ────────────────────────────────────────────────────────

// ── THE BAR, WHICH IS NOW THE WHOLE RECORD OF WHAT IS DONE ─────────────────
//
// Justin, 15 August 2026: "I would prefer a bar at top with 1 done 2 done 3
// done 4 done all completes and big tick appears in screen."
//
// This replaces the stacked done cards from earlier the same day, and it is the
// better answer for the reason that version was reaching for: a finished step
// should be VISIBLE without being IN THE WAY. As cards they were visible and in
// the way, four sage blocks a parent had to scroll past to reach the one thing
// they could actually do. As numbers in a bar the whole history is one line, and
// the card below it is always the live step.
//
// Each number carries its own state rather than the bar being a single fill,
// because "1 done, 2 done" is what Justin asked for and it is also the only way
// to see WHICH is outstanding at a glance rather than just how many.
function Progress({ done, total, steps, flags }: {
  done: number
  total: number
  steps: SetupStep[]
  flags: SetupFlags
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '9px' }}>
        {steps.map((s, i) => {
          const isDone = flags[s.key]
          return (
            <span key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '100%', height: '8px', borderRadius: '100px',
                background: isDone ? '#1F7A54' : 'var(--border)',
                transition: 'background 0.4s ease',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                color: isDone ? '#1F7A54' : 'var(--ink-muted)', lineHeight: 1,
                display: 'flex', alignItems: 'center', gap: '3px',
              }}>
                {i + 1}{isDone ? ' ✓' : ''}
              </span>
            </span>
          )
        })}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        {done} of {total} done
      </span>
    </div>
  )
}

// ── ONE STEP ────────────────────────────────────────────────────────────────

function StepCard({ step, number, state, child, userId }: {
  step: SetupStep
  number: number
  state: StepState
  child: { id: string; name: string | null } | null
  userId: string
}) {
  const live = state === 'live'
  const done = state === 'done'

  return (
    <div
      data-quest-step
      id={live ? ANCHOR[step.key] : undefined}
      style={{
        display: 'flex', gap: '14px', alignItems: 'flex-start',
        // A done step is sage rather than white, so the finished block reads as
        // one run of green at a glance without anybody counting ticks.
        background: live ? '#fff' : done ? 'var(--tint-sage)' : 'var(--cream)',
        border: live
          ? '1.5px solid var(--terracotta)'
          : done ? '1px solid var(--stage-1-bold)' : '1px solid var(--border)',
        borderRadius: '18px',
        padding: live ? '18px 20px' : '15px 18px',
        boxShadow: live ? '0 6px 20px rgba(201,154,40,0.14)' : 'none',
        scrollMarginTop: '80px',
      }}
    >
      {/* THE NUMBER STAYS ON THE LEFT. Justin, on the first build: "it says
          build family agreement as number 1 which is great." The numbers are
          what make this a sequence rather than a pile, so a done step keeps its
          number rather than having it swapped for a tick. */}
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: live ? 38 : 32, height: live ? 38 : 32, borderRadius: '50%',
          background: live ? 'var(--terracotta)' : done ? '#fff' : 'transparent',
          border: live ? 'none' : done ? '1.5px solid var(--stage-1-bold)' : '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: live ? 'var(--text-md)' : 'var(--text-sm)',
          color: live ? 'var(--ink)' : done ? '#1F7A54' : 'var(--ink-muted)',
        }}
      >
        {number}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: live ? 900 : 700,
          fontSize: live ? 'var(--text-lg)' : 'var(--text-md)',
          color: live ? 'var(--ink)' : done ? 'var(--ink)' : 'var(--ink-muted)',
          lineHeight: 1.25, letterSpacing: '-0.01em', margin: 0,
        }}>
          {step.title}
        </h2>

        {/* Only the live step explains itself. A waiting step is a promise that
            there is more, and a paragraph under it is a wall of jobs by
            another name. A done step has nothing left to ask. */}
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

      {/* ── THE STATUS CIRCLE, ON THE RIGHT ───────────────────────────────────
          Justin sent the pattern rather than describing it: a budgeting app's
          setup widget, every row carrying a filled green tick or an empty grey
          ring on the RIGHT hand edge.
          It is the right instinct and Mobbin agrees. Deel puts DONE and NOT
          STARTED as right hand pills, Monzo a right hand green tick with a green
          border on the finished rows, Qonto a green Completed beside the title.
          The common thread is that STATUS lives on the trailing edge and
          IDENTITY on the leading one, so a parent reads down the left to find
          the thing and down the right to see how far they have got. Our numbers
          keep the left, so the tick takes the right and nothing has to fight
          for the same spot.
          Aligned to the top rather than centred, because the live card is tall
          and a circle floating in the middle of a paragraph reads as punctuation
          for that paragraph rather than as the row's state. */}
      <span
        aria-hidden
        style={{
          flexShrink: 0, marginTop: '2px',
          width: 26, height: 26, borderRadius: '50%',
          background: done ? '#1F7A54' : 'transparent',
          border: done ? 'none' : '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '15px', fontWeight: 800, lineHeight: 1,
        }}
      >
        {done ? '✓' : ''}
      </span>
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
      <>
        <Link
          href={step.href}
          style={{
            display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 16, padding: '13px 22px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Agree it together
        </Link>
        {/* THE PRINT OFFER MOVED TO WHERE IT BELONGS, which is the moment it is
            agreed rather than before it exists.
            Justin, 16 August 2026: "when we do agreement and confirm it, give
            option to print at that point, then take to other tickable actions on
            set up screen." It was a link here, under a step nobody had done yet,
            offering to print a document that had not been written. The finished
            agreement already carries Print the fridge copy, and it now carries
            the road back here too. */}
      </>
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

        {/* ── AND THE TWO THAT LET THEM GET ON ────────────────────────────
            Justin, 17 August 2026: "if we are saying share screens is done when
            they either skip or say done it needs to tick off set up to be able
            to move onto next set up step."
            The step could be finished two ways before this: generate the code,
            or say there is no phone at all. Neither covers the common case, a
            parent who has just shown their child the code, or who will co-view
            on their own phone. So the step had no answer for them and setup
            could not be completed from it. Third time this product has had to
            add the door that closes a step; see migration 204. */}
        <SettleShare childName={name} />
      </>
    )
  }

  if (step.key === 'children') return <OtherChildren />

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

// ── CLOSING THE SHARE STEP WITHOUT A CODE AND WITHOUT A NO ─────────────────
//
// Both buttons write the same timestamp, because the difference between "I have
// shared it" and "I will run it on my phone" matters to the words on the day and
// to nothing downstream: both mean the child's side is handled, both should stop
// the step asking, and both earn the same monthly reminder that the QR code is
// there whenever they want it.

function SettleShare({ childName }: { childName: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<'shared' | 'mine' | null>(null)
  const [failed, setFailed] = useState(false)

  async function settle(which: 'shared' | 'mine') {
    setBusy(which)
    setFailed(false)
    try {
      const res = await fetch('/api/setup/child-app', { method: 'POST' })
      // Checked, because fetch does not reject on a 4xx or 5xx and this is the
      // fourth place in this codebase where that turned a failure into a green
      // tick over nothing.
      if (!res.ok) throw new Error(String(res.status))
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setBusy(null)
    }
  }

  const quiet: React.CSSProperties = {
    background: 'none', border: 'none',
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
    color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
    padding: '6px 8px',
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
        <button onClick={() => settle('shared')} disabled={busy !== null} style={{ ...quiet, cursor: busy ? 'default' : 'pointer' }}>
          {busy === 'shared' ? 'Saving...' : 'Done, I have shared it'}
        </button>
        <button onClick={() => settle('mine')} disabled={busy !== null} style={{ ...quiet, cursor: busy ? 'default' : 'pointer' }}>
          {busy === 'mine' ? 'Saving...' : `I will run it on my phone with ${childName}`}
        </button>
      </div>
      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '8px 0 0', textAlign: 'center' }}>
          That did not save. Have another go.
        </p>
      )}
    </>
  )
}

// ── THE OTHER CHILDREN, AS THE FORM FROM SIGNUP ─────────────────────────────
//
// Justin, 15 August 2026: "it should be add children simple easy form as per
// when they sign up so easy to add."
//
// It used to be a link to /dashboard/quests#add-child, which is a real screen
// with a real form on it, and that was the fault: a step whose shape is one
// card and one tap sent the parent to a different page, to find a form, inside
// a manager built for something else. The two questions signup asks are a name
// and an age band. They fit here, so they are here.
//
// The same POST the quest manager uses, so a child added from setup gets
// everything a child added anywhere else gets, including the baseline worries
// seeded on 15 August. Two forms writing children two different ways is how the
// second one ends up missing a step the first one does.
//
// ── AND "NONE YET" IS AN ANSWER, NOT A SKIP ─────────────────────────────────
//
// Justin: "option none yet, we let them know added at any time, lets get one
// right if you prefer, then tick green if they add one or if they tick add
// later also tick green and we can prompt them with pop up end of month."
//
// Both doors go green, which is the rule this product keeps returning to: a
// step that can never be ticked tells a one child family they are incomplete
// for having the family they have. The month end prompt is what stops that
// answer being permanent.

const AGE_BANDS: { value: string; label: string }[] = [
  { value: '4-7', label: '4 to 7' },
  { value: '8-10', label: '8 to 10' },
  { value: '11-13', label: '11 to 13' },
  { value: '13-15', label: '13 to 15' },
  { value: '16+', label: '16 and over' },
]

function OtherChildren() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [band, setBand] = useState('')
  const [busy, setBusy] = useState<'add' | 'only' | null>(null)
  const [failed, setFailed] = useState(false)

  async function post(url: string, body?: unknown) {
    setBusy(url.includes('only-one') ? 'only' : 'add')
    setFailed(false)
    try {
      const res = await fetch(url, {
        method: 'POST',
        ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
      })
      // fetch does not throw on a 4xx or a 5xx, only on a network failure, so
      // the response has to be checked or a rejected save looks like a success
      // and the step goes green over nothing.
      if (!res.ok) throw new Error(String(res.status))
      setName('')
      setBand('')
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setBusy(null)
    }
  }

  const ready = name.trim().length > 0 && band.length > 0

  const field: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px',
    border: '1.5px solid var(--border)', borderRadius: '12px',
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)',
    background: '#fff',
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
            Their name
          </span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="First name"
            maxLength={60}
            style={field}
          />
        </label>
        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
            How old
          </span>
          <select value={band} onChange={e => setBand(e.target.value)} style={field}>
            <option value="">Choose an age</option>
            {AGE_BANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </label>
      </div>

      <button
        onClick={() => post('/api/quests', { action: 'child', name: name.trim(), age_band: band })}
        disabled={!ready || busy !== null}
        style={{
          marginTop: '12px',
          background: ready ? 'var(--terracotta)' : 'var(--border)',
          color: ready ? 'var(--ink)' : 'var(--ink-muted)',
          border: 'none', borderRadius: 16, padding: '13px 22px',
          cursor: ready && busy === null ? 'pointer' : 'default',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          boxShadow: ready ? '0 5px 0 var(--terracotta-dark)' : 'none',
        }}
      >
        {busy === 'add' ? 'Adding...' : 'Add this child'}
      </button>

      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>
          That did not save. Have another go.
        </p>
      )}

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
        You can add another any time. Let us get one right first if you would rather.
      </p>

      <div style={{ textAlign: 'center', margin: '8px 0 0' }}>
        <button
          onClick={() => post('/api/setup/only-one-child')}
          disabled={busy !== null}
          style={{
            background: 'none', border: 'none', cursor: busy === null ? 'pointer' : 'default',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
            color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
            padding: '4px 8px',
          }}
        >
          {busy === 'only' ? 'Saving...' : 'None yet, just the one'}
        </button>
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
  const router = useRouter()
  const [busy, setBusy] = useState<'done' | 'skip' | null>(null)
  const [failed, setFailed] = useState(false)

  // Both buttons post the same thing, because both are the parent telling us
  // this step is dealt with. What differs is only what they mean by it, and
  // neither is proof: see the note above the buttons.
  async function settle(which: 'done' | 'skip') {
    setBusy(which)
    setFailed(false)
    try {
      const res = await fetch('/api/setup/home-screen', { method: 'POST' })
      // fetch does not reject on a 4xx or 5xx, so the response has to be read
      // or a rejected save looks like success and the step goes green over
      // nothing. Third time this pattern has been fixed in this codebase.
      if (!res.ok) throw new Error(String(res.status))
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setBusy(null)
    }
  }

  const row: React.CSSProperties = {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    background: 'var(--cream)', borderRadius: '14px', padding: '12px 14px',
  }
  const marker: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
    color: 'var(--terracotta-dark)', flexShrink: 0, paddingTop: '2px', minWidth: 52,
  }
  const line: React.CSSProperties = { fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* THE REASON, NOT THE MECHANIC, AND IT GOES FIRST.
          Justin, 16 August 2026: "say that adding to home screen means you can
          get vital notifications." Three sets of tap-here instructions with no
          reason above them is a chore. The reason is the whole point: on iPhone
          web notifications only work at all once the app is on the home screen,
          so this is not decoration, it is the difference between the check ins
          reaching a parent and not. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 2px', fontWeight: 600 }}>
        On a phone this is what lets the check ins actually reach you. Apple only
        allows notifications once we are on the home screen.
      </p>

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
      {/* THE LAPTOP, which had no path at all and is where Justin was sitting
          when he asked for one. Chrome and Edge both put an install icon in the
          address bar; Safari on a Mac calls it Add to Dock. Worth saying that
          notifications work there too, because the sentence above is about
          phones and a parent on a laptop would otherwise read this step as not
          being for them. */}
      <div style={row}>
        <span style={marker}>Laptop</span>
        <span style={line}>
          Click the <strong>install icon</strong> in the address bar in Chrome or Edge, or <strong>Share, Add to Dock</strong> in Safari. Notifications work there too.
        </span>
      </div>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '2px 0 0' }}>
        Open it from your home screen once and this step ticks itself.
      </p>

      {/* ── DONE AND SKIP, AND WHY BOTH ARE HONEST ─────────────────────────
          Justin: "should have a button click done then it should also then
          trigger marked as done unless there is a way of confirming it is
          done ... it drops off list on home page so can move on to complete
          next set up, but run a monthly check to see if it is still set up
          working and remind them again."
          There IS a way of confirming, and it is preferred: opening the app in
          standalone mode stamps this by itself, which is the line above. These
          two are for the parent that proof will never reach, the one on a work
          laptop or who has decided against it, and without them setup could not
          be finished at all. That is the un-tickable step this product keeps
          having to fix.
          So they tick it and setup moves on. The monthly re-check that verifies
          the claim against the facts is NOT built yet: see
          plans/next-first-run-and-reminders.md section 2. Until it is, a tap
          here is taken at face value, which is a deliberate trade of accuracy
          for a parent being able to finish. */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
        <button
          onClick={() => settle('done')}
          disabled={busy !== null}
          style={{
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
            borderRadius: 16, padding: '12px 20px', cursor: busy ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          {busy === 'done' ? 'Saving...' : 'Done, it is on there'}
        </button>
        <button
          onClick={() => settle('skip')}
          disabled={busy !== null}
          style={{
            background: 'none', border: 'none', cursor: busy ? 'default' : 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
            color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
            padding: '12px 4px',
          }}
        >
          {busy === 'skip' ? 'Saving...' : 'Skip for now'}
        </button>
      </div>

      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '8px 0 0' }}>
          That did not save. Have another go.
        </p>
      )}
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
      {/* THE BIG TICK. "All completes and big tick appears in screen, lets get
          started." It is the one moment in setup worth marking, so it is drawn
          rather than borrowed from an emoji font: at this size an emoji tick
          renders differently on every platform and on some of them it is not
          green at all. */}
      <div
        aria-hidden
        style={{
          width: 84, height: 84, borderRadius: '50%', background: '#1F7A54',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', boxShadow: '0 6px 0 #145C3E',
          color: '#fff', fontSize: '46px', fontWeight: 800, lineHeight: 1,
        }}
      >
        ✓
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        All done. Let us get started
      </h2>
      {/* IT DOES NOT MENTION THE CHECK IN, and that is a correction rather than
          an omission. Justin, 15 August 2026: "check in how it went should not
          be on first set up as no way of knowing how agreement went." The first
          version of this card promised "the check in first", which on the very
          day a family finishes setup is asking them to rate an agreement signed
          twenty minutes ago. The check in earns its place once there is
          something to report. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        That is the one time work behind you. First thing today is the check in,
        about thirty seconds, and it is what everything else is built on.
      </p>
      {/* STRAIGHT TO THE PROPER CHECK IN. Justin: "takes them to start today and
          leads them through agreed loop ... first today which is check in and
          that needs to be the proper check in."
          /dashboard/checkin, not /dashboard/daily and not Home. The check in got
          its own page on 13 August precisely because every route to it used to
          land on the moments deck and ask the parent to go looking. Sending them
          to Home here would rebuild that fault one step further back: Home is
          right, but it is one more tap and one more thing to read first. */}
      <Link
        href="/dashboard/checkin"
        style={{
          display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
          borderRadius: 16, padding: '15px 28px', textDecoration: 'none',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        Start today's check in
      </Link>
    </div>
  )
}
