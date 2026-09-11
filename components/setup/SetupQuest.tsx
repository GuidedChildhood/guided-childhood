'use client'

import { useEffect, useRef, useState } from 'react'
import { childColour, childInitial } from '@/lib/children/colour'
import BirthdayFields, { bandFrom, dobFrom } from '@/components/children/BirthdayFields'
import { WORRIES, CATCH_ALL_ID } from '@/lib/onboarding/worries'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import ShareQrButton from '@/components/quests/ShareQrButton'
import NoPhoneButton from '@/components/quests/NoPhoneButton'
import PushPrompt from '@/components/push/PushPrompt'
import { STEPS, type SetupFlags, type SetupStep } from '@/lib/setup/steps'
import { recommendedDailyMinutes, baseDailyMinutes, SCREEN_GUIDE_SOURCES } from '@/lib/quests/screen-balance'

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
  coreTime: 'core-time',
}

type SetupChild = { id: string; name: string | null; age_band: string | null; linked: boolean; noPhone: boolean }

type Props = {
  flags: SetupFlags
  child: { id: string; name: string | null } | null
  /** Every child, so the share step can offer a code each. See flags.ts. */
  children?: SetupChild[]
  userId: string
  /** Is today's check in already done for every child?
   *
   *  The finished card used to assume it was not, and told a parent to go and
   *  do a thing they had already done. */
  checkInDone?: boolean
}

export default function SetupQuest({ flags, child, children = [], userId, checkInDone = false }: Props) {
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

  if (firstUndone === -1) return <AllDone checkInDone={checkInDone} />

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
            childList={children}
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

function StepCard({ step, number, state, child, childList, userId }: {
  step: SetupStep
  number: number
  state: StepState
  child: { id: string; name: string | null } | null
  childList: SetupChild[]
  userId: string
}) {
  const live = state === 'live'
  const done = state === 'done'

  return (
    <div
      data-quest-step
      id={live ? ANCHOR[step.key] : undefined}
      style={{
        // A COLUMN, NOT A ROW. Justin, 2 September 2026, with the home screen
        // step on his phone: "too long in text and stretched while screen and
        // looks messy please tidy." The number, the title AND the whole body
        // sat in one flex row, so on a 390px phone the body had the number's
        // column and the status circle taken off both sides and was left about
        // 160px wide: three word lines, a page of them. Now the header is the
        // row (number, title, status) and the live body sits under it at the
        // card's full width.
        display: 'flex', flexDirection: 'column', gap: 0,
        // A done step is sage rather than white, so the finished block reads as
        // one run of green at a glance without anybody counting ticks.
        // The happy news finish (plans/week-of-2026-08-31-parent-happy-news-plan.md):
        // the live card wears the ink edge and ledge, done steps the sage.
        background: live ? '#fff' : done ? 'var(--tint-sage)' : 'var(--cream)',
        border: live ? '2px solid var(--ink)' : done ? '2px solid var(--ink)' : '2px solid var(--border)',
        borderRadius: '20px',
        padding: live ? '18px 20px' : '15px 18px',
        boxShadow: live ? '0 4px 0 var(--ink)' : done ? '0 3px 0 var(--ink)' : 'none',
        scrollMarginTop: '80px',
      }}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      {/* THE NUMBER STAYS ON THE LEFT. Justin, on the first build: "it says
          build family agreement as number 1 which is great." The numbers are
          what make this a sequence rather than a pile, so a done step keeps its
          number rather than having it swapped for a tick. */}
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: live ? 40 : 32, height: live ? 40 : 32, borderRadius: '50%', boxSizing: 'border-box',
          background: live ? 'var(--terracotta)' : done ? '#fff' : 'transparent',
          border: live ? '2px solid var(--ink)' : done ? '2px solid var(--ink)' : '2px solid var(--border)',
          boxShadow: live ? '0 3px 0 var(--ink)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: live ? 'var(--text-md)' : 'var(--text-sm)',
          color: live ? 'var(--ink)' : done ? 'var(--ink)' : 'var(--ink-muted)',
        }}
      >
        {number}
      </span>

      <div style={{ flex: 1, minWidth: 0, alignSelf: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: live ? 900 : 700,
          fontSize: live ? 'var(--text-lg)' : 'var(--text-md)',
          color: live ? 'var(--ink)' : done ? 'var(--ink)' : 'var(--ink-muted)',
          lineHeight: 1.25, letterSpacing: '-0.01em', margin: 0,
        }}>
          {step.title}
        </h2>
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
          width: 28, height: 28, borderRadius: '50%', boxSizing: 'border-box',
          background: done ? 'var(--retro-green)' : 'transparent',
          border: done ? '2px solid var(--ink)' : '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '15px', fontWeight: 800, lineHeight: 1,
        }}
      >
        {done ? '✓' : ''}
      </span>
      </div>

      {/* Only the live step explains itself. A waiting step is a promise that
          there is more, and a paragraph under it is a wall of jobs by
          another name. A done step has nothing left to ask. */}
      {live && (
        <div style={{ marginTop: '12px' }}>
          {/* Room to read, then room to act. Justin, 18 August 2026: "a gap
              with text to read better." The explanation and the thing you do
              about it were 14px apart, which on a step with two child cards
              under it made one solid block of type and buttons with no way
              in. The paragraph gets its own line height and a real gap after
              it, so the eye finishes the sentence before it meets the work. */}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0, maxWidth: '52ch' }}>
            {step.what}
          </p>
          <div style={{ marginTop: '18px' }}>
            <StepAction step={step} child={child} childList={childList} userId={userId} />
          </div>
        </div>
      )}
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
// Every step now does its work in place. The agreement was the one exception,
// a real piece of work with its own page, and on 18 August it left setup
// altogether for the first quest. See lib/setup/steps.ts.

function StepAction({ step, child, childList, userId }: {
  step: SetupStep
  child: { id: string; name: string | null } | null
  childList: SetupChild[]
  userId: string
}) {
  if (step.key === 'childLink') {
    // No child on the account yet, which onboarding normally prevents. Send
    // them to add one rather than showing a share button with nothing to share.
    if (childList.length === 0) {
      return (
        <Link
          href="/dashboard/settings"
          style={{
            display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
            border: '2px solid var(--ink)', borderRadius: 16, padding: '13px 22px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 4px 0 var(--ink)',
          }}
        >
          Add your child first
        </Link>
      )
    }

    // ── ONE CODE PER CHILD, BECAUSE A CODE BELONGS TO A CHILD ───────────────
    //
    // Justin, 18 August 2026: "we need 2 different codes, one for each child ...
    // if 3 children they could be a mix of marked as app and no app printable
    // version."
    //
    // This handed the PRIMARY child to a single button, so a family with three
    // children could share with one and the other two had no route from setup at
    // all. A QR code is that child's link, their jobs and their stars, so the
    // question has to be asked once per child, by name.
    //
    // The mix is the point rather than an edge case: the eldest on the app and
    // the younger two on the printed chart is the ordinary shape of a family,
    // and each row settles on its own. The step goes green when every row has,
    // which is why flags.ts asks `every` rather than `some`.
    return (
      // ── WHOSE CARD THIS IS, AT A GLANCE (18 August 2026) ─────────────────
      //
      // Justin: "the appearance and spacing here needs to be a bit neater, all
      // a bit cramped" and "let's make the name, Olgie for example, much
      // clearer and obvious."
      //
      // The name was set at the same weight as a label and sat directly on top
      // of a big yellow button, so the loudest thing in each card was the word
      // "Show" and the child it belonged to read as a caption. On a step whose
      // entire job is "this code is for THIS child, that one is for THAT one",
      // the name is the thing that has to be unmistakable, or a parent hands
      // the wrong code to the wrong child.
      //
      // So: an initial in a terracotta disc, the name at display size on its
      // own line, and real room around all of it.
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {childList.map(c => {
          const name = c.name && c.name !== 'Your child' ? c.name : 'your child'
          const settled = c.linked || c.noPhone
          const initial = childInitial(c.name)
          // The same colour this child's pill wears everywhere else, so the
          // card is recognisable before it is read. See lib/children/colour.ts.
          const col = childColour(c.age_band)
          return (
            <div
              key={c.id}
              style={{
                background: settled ? 'var(--tint-sage)' : col.tint,
                border: settled ? '1.5px solid var(--stage-1-bold)' : `1.5px solid ${col.bold}`,
                borderRadius: 18, padding: '18px 18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: settled ? 0 : '16px' }}>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                    background: col.bold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'var(--text-md)', color: col.text,
                  }}
                >
                  {initial}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'var(--text-lg)', letterSpacing: '-0.02em', lineHeight: 1.15,
                    color: 'var(--ink)', overflowWrap: 'anywhere',
                  }}>
                    {name}
                  </span>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: settled ? '#1F7A54' : 'var(--ink-muted)', marginTop: '3px',
                  }}>
                    {c.linked ? '✓ code shared' : c.noPhone ? '✓ on paper' : 'Needs a code'}
                  </span>
                </span>
              </div>
              {!settled && (
                <>
                  <ShareQrButton
                    childId={c.id}
                    childName={c.name}
                    label={`Show ${name}'s code`}
                    style={{ fontSize: 'var(--text-base)', padding: '13px 20px', width: '100%', justifyContent: 'center' }}
                  />
                  {/* Per child, so one can be on the app and another on paper. */}
                  <NoPhoneButton childId={c.id} childName={name} />
                </>
              )}
            </div>
          )
        })}

        {/* The family level answers still close the whole step in one tap, for a
            parent who has dealt with all of them at once. */}
        <SettleShare childName={childList.length > 1 ? 'them' : (childList[0]?.name && childList[0].name !== 'Your child' ? childList[0].name : 'your child')} />
      </div>
    )
  }

  if (step.key === 'children') return <OtherChildren />

  if (step.key === 'coreTime') return <CoreTimeStep childList={childList} />

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

// ── THE FREE TIME QUESTION, ONCE PER CHILD ──────────────────────────────────
//
// The same chips the Quests page keeps under "Their time, three kinds", asked
// here on their own so a family decides the core before the first star is
// spent. Saving goes through the time settings route with the child's other
// settings carried across unchanged, so a tap here never resets a bedtime
// window a parent has already set. The step ticks once every child has a row,
// and "None" writes a row like any other answer.

// The choices are built per child rather than fixed, because a fixed row let a
// parent hand a four year old ninety minutes, which is above the guide for that
// age and leaves the stars nothing to add. Four options: none, half the base,
// the base itself, and the guide.
//
// The base and the guide are not invented here. lib/quests/screen-balance.ts is
// the one source of truth for both and sixteen other places already read it, so
// the number in setup is the number the timer, the child's screen and the
// balance report all use. Building a second table here was the first version of
// this change and it was wrong: two tables drift, and the one already in the
// codebase carries the sourcing.
const coreChoicesFor = (ageBand: string | null): number[] => {
  const guide = recommendedDailyMinutes(ageBand)
  const base = baseDailyMinutes(ageBand)
  const half = Math.round((base / 2) / 5) * 5
  return [...new Set([0, half, base, guide])].sort((a, b) => a - b)
}

type TimeSettings = {
  coreMinutesDaily: number
  bedtimeStart: string | null
  bedtimeEnd: string | null
  protectMealtimes: boolean
  protectSchoolHours: boolean
  starMinutes: number
}

function CoreTimeStep({ childList }: { childList: SetupChild[] }) {
  const router = useRouter()
  const [settings, setSettings] = useState<Record<string, TimeSettings | null>>({})
  const [chosen, setChosen] = useState<Record<string, number>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all(childList.map(async c => {
      try {
        const r = await fetch(`/api/quests/time/settings?childId=${encodeURIComponent(c.id)}`)
        if (!r.ok) return [c.id, null] as const
        return [c.id, (await r.json()) as TimeSettings] as const
      } catch { return [c.id, null] as const }
    })).then(rows => {
      if (!alive) return
      const next: Record<string, TimeSettings | null> = {}
      for (const [id, s] of rows) next[id] = s
      setSettings(next)
    })
    return () => { alive = false }
  }, [childList])

  async function choose(childId: string, minutes: number) {
    setBusy(childId); setFailed(false)
    const current = settings[childId]
    const body = {
      childId,
      coreMinutesDaily: minutes,
      bedtimeStart: current?.bedtimeStart ?? null,
      bedtimeEnd: current?.bedtimeEnd ?? null,
      protectMealtimes: current?.protectMealtimes ?? false,
      protectSchoolHours: current?.protectSchoolHours ?? false,
      starMinutes: current?.starMinutes ?? 5,
    }
    try {
      const r = await fetch('/api/quests/time/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error(String(r.status))
      const nextChosen = { ...chosen, [childId]: minutes }
      setChosen(nextChosen)
      // Every child answered: the flag flips on the server, so refresh to let
      // the step tick and the next one go live.
      if (childList.every(c => nextChosen[c.id] !== undefined)) router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setBusy(null)
    }
  }

  if (childList.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: 0 }}>
        Add your child first and this one takes a tap.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
        Free time is always theirs, no stars needed, so the screen never becomes the prize. We suggest
        starting below the daily guide for their age, on purpose, so the quests have somewhere real to add
        to and the last stretch is earned. Bedtime and mealtimes stay protected whatever you pick.
      </p>
      {childList.map(c => {
        const name = c.name && c.name !== 'Your child' ? c.name : 'Your child'
        const picked = chosen[c.id]
        const guide = recommendedDailyMinutes(c.age_band)
        const base = baseDailyMinutes(c.age_band)
        const choices = coreChoicesFor(c.age_band)
        return (
          <div key={c.id} style={{ border: '2px solid var(--ink)', borderRadius: '14px', padding: '10px 12px', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span aria-hidden style={{ width: '26px', height: '26px', borderRadius: '50%', background: childColour(c.age_band).tint, color: childColour(c.age_band).bold, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)' }}>
                {childInitial(c.name)}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{name}</span>
              {picked !== undefined && (
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--retro-green)' }}>Saved</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {choices.map(m => {
                const on = picked === m
                // The suggested starting point is marked only while nothing is
                // chosen. Once a parent has answered, their answer is the thing
                // on the screen, not our opinion of it.
                const suggest = picked === undefined && m === base
                return (
                  <button key={m} type="button" disabled={busy === c.id} onClick={() => choose(c.id, m)} aria-pressed={on} style={{
                    flex: 1, padding: '9px 4px', borderRadius: '11px', cursor: busy === c.id ? 'default' : 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                    background: on ? 'var(--terracotta-lt)' : '#fff',
                    color: on ? 'var(--terracotta-dark)' : suggest ? 'var(--ink)' : 'var(--ink-muted)',
                    // A dashed edge, not a fill. A filled suggestion reads as
                    // already chosen, and nothing is chosen until they tap.
                    border: on ? '2px solid var(--terracotta)'
                      : suggest ? '2px dashed var(--gold-hover)' : '2px solid var(--ink)',
                  }}>{m === 0 ? 'None' : `${m}m`}</button>
                )
              })}
            </div>

            {/* What we suggest, where the stars take it, and who says so. Never
                a threshold, because there is not one: the bodies below disagree
                with each other and the RCPCH declined to set a number at all. */}
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
              <strong style={{ color: 'var(--ink)' }}>
                We suggest {base}m to start, with stars earning the rest up to {guide}m.
              </strong>{' '}
              {guide}m is the daily guide for their age, not a limit anyone has proved. Stars never take
              them past it.
            </p>

          </div>
        )
      })}
      {/* The proof path. Four bodies, named, and the fact that they do not all
          agree is the honest part rather than something to tidy away. */}
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0 }}>
        Where the guides come from: {SCREEN_GUIDE_SOURCES.map(g => `${g.body} ${g.year}`).join(', ')}. They do
        not all agree, and the RCPCH looked and said there is no single safe limit, so we give you a place to
        start and the balance to judge it by.
      </p>

      {/* Point three: encouraged, never required. Nothing is blocked if a
          family ignores it, because a product built on connection cannot make
          tracking the price of using it. What it buys them is the only thing
          we can honestly promise, which is a balance worth looking at. */}
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
        When they ask for their time through the app rather than just picking up the tablet, we can show you
        both halves of the day: what went on a screen and what did not. That is the picture worth having, and
        it is the one that makes the balance mean something. Nothing stops working if you would rather not.
      </p>

      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: 0, textAlign: 'center' }}>
          That did not save. Have another go.
        </p>
      )}
    </div>
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

// The hand picked age band list that used to live here went on 11 September
// 2026, with the select it fed. A band a parent picks is a band that never
// changes; the birthday they give instead is one the product can read every
// morning. See components/children/BirthdayFields.

// ── ADDING ONE CHILD MUST NOT END THE STEP (18 August 2026) ────────────────
//
// Justin: "when we add a child it needs to also go back to add another in case
// there is 3, and if no more, give Done as an option."
//
// The step's flag goes true the moment a SECOND child exists, so adding one
// used to refresh straight away, tick the step green and fold it shut. A parent
// with three children added the second, watched the step close itself, and had
// to find their way back in to add the third. The app decided they were
// finished on their behalf.
//
// So the refresh is held. Each child is added, the form clears ready for the
// next, and the parent is the one who says when they are done. Nothing is
// unsaved while they sit there: every child is already written, the only thing
// waiting is the page catching up.
function OtherChildren() {
  const router = useRouter()
  const [name, setName] = useState('')
  // The birthday, not a band. See components/children/BirthdayFields for why a
  // child added with only a band could never age up.
  const [dobMonth, setDobMonth] = useState<number | null>(null)
  const [dobYear, setDobYear] = useState<number | null>(null)
  // The three worries for THIS child. Every child after the first used to get
  // the same stock two, which told a parent of a six year old and a fifteen
  // year old that we had not been listening to either of them.
  const [worries, setWorries] = useState<string[]>([])
  // ── SOMETHING ELSE NEEDS SOMEWHERE TO SAY WHAT ────────────────────────────
  //
  // Justin, 11 September 2026: "this is where they free type the thing thats
  // worrying them and there was no option for this when clicking something
  // else on multi child."
  //
  // The first child has had a free text box since the starter quiz. Here the
  // tile was tappable and silent: something_else is deliberately unmapped, so
  // tapping it sent an id that resolves to no slug, and the child was seeded
  // as though the parent had named one thing fewer. A picker with nothing
  // behind it is worse than no picker.
  const [worryOther, setWorryOther] = useState('')
  const [busy, setBusy] = useState<'add' | 'only' | null>(null)
  const [failed, setFailed] = useState(false)
  /** Who has been added in this sitting, so the parent can see it landed. */
  const [added, setAdded] = useState<string[]>([])

  async function post(url: string, body?: unknown) {
    const isAdd = !url.includes('only-one')
    setBusy(isAdd ? 'add' : 'only')
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
      if (isAdd) {
        setAdded(prev => [...prev, name.trim()])
        setName('')
        setDobMonth(null)
        setDobYear(null)
        setWorries([])
        // Deliberately NO router.refresh() here. See the note above: refreshing
        // is what ticked the step and closed it after one child.
      } else {
        router.refresh()
      }
    } catch {
      setFailed(true)
    } finally {
      setBusy(null)
    }
  }

  /** They have said that is everyone. The children are already saved, so this
   *  only has to let the page catch up and the step tick itself. */
  function done() {
    setBusy('only')
    router.refresh()
  }

  const ready = name.trim().length > 0 && bandFrom(dobMonth, dobYear) !== null

  const field: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px',
    border: '2px solid var(--ink)', borderRadius: '12px',
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
        <BirthdayFields
          month={dobMonth}
          year={dobYear}
          onChange={(m, y) => { setDobMonth(m); setDobYear(y) }}
          fieldStyle={field}
        />

        {/* THE SAME THREE QUESTIONS THE FIRST CHILD GOT.
            Justin, 11 September 2026: "maybe we should just have the
            questionaire for second child to see what issues they have".
            Only once there is a birthday, so the tiles arrive as the third
            thing rather than a wall of nine beside an empty name box. */}
        {bandFrom(dobMonth, dobYear) && (
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
              What is going on with {name.trim() || 'them'}
            </span>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>
              Up to three, most pressing first. These become their check in, so
              it asks about them rather than about their brother or sister.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {WORRIES.map(w => {
                const on = worries.includes(w.id)
                // ── SOMETHING ELSE DOES NOT USE UP A SLOT ──────────────────
                //
                // Justin: "we can only add 3 which is great, but I think we
                // should leave out Something else, as this is where they free
                // type the thing that's worrying them."
                //
                // Right, and it is the same point as the missing box. The cap
                // of three is about how many worries a family can hold in
                // their head at once. Something else is not a worry, it is the
                // door to naming one, so counting it meant a parent who wanted
                // to type their own thing could only tap two of ours, and a
                // parent who had already tapped three could not reach the box
                // at all.
                const named = worries.filter(x => x !== CATCH_ALL_ID)
                const full = w.id !== CATCH_ALL_ID && named.length >= 3 && !on
                return (
                  <button
                    key={w.id}
                    type="button"
                    aria-pressed={on}
                    disabled={full}
                    onClick={() => setWorries(prev => on ? prev.filter(x => x !== w.id) : [...prev, w.id])}
                    style={{
                      padding: '9px 13px', borderRadius: '100px', cursor: full ? 'default' : 'pointer',
                      border: `2px solid ${on ? 'var(--ink)' : 'var(--border)'}`,
                      background: on ? 'var(--terracotta)' : '#fff',
                      color: full ? 'var(--ink-muted)' : 'var(--ink)',
                      fontFamily: 'var(--font-body)', fontWeight: on ? 800 : 600, fontSize: 'var(--text-sm)',
                      boxShadow: on ? '0 3px 0 var(--ink)' : 'none',
                      opacity: full ? 0.5 : 1,
                    }}
                  >
                    {on && w.id !== CATCH_ALL_ID ? `${named.indexOf(w.id) + 1}. ` : ''}{w.label}
                  </button>
                )
              })}
            </div>
            {/* Only once they have asked for it, so nine tiles do not arrive
                with a box underneath them as a tenth thing to read. */}
            {worries.includes(CATCH_ALL_ID) && (
              <input
                type="text"
                value={worryOther}
                onChange={e => setWorryOther(e.target.value)}
                placeholder={`What is going on with ${name.trim() || 'them'}?`}
                maxLength={120}
                style={{ ...field, marginTop: '8px', fontSize: 'var(--text-base)' }}
              />
            )}
            {/* Skippable on purpose: a parent adding three children at bedtime
                should not be held at a wall of tiles. Nothing named still gets
                the stock openers, so their check in is never empty. */}
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '8px 0 0', lineHeight: 1.5 }}>
              {(() => {
                const named = worries.filter(x => x !== CATCH_ALL_ID).length
                const typed = worries.includes(CATCH_ALL_ID) && worryOther.trim().length > 0
                if (named === 0 && !typed) return 'Skip this and we will start them on the two most families begin with.'
                const parts = []
                if (named > 0) parts.push(`${named} picked`)
                if (typed) parts.push('plus your own')
                return `${parts.join(', ')}. You can change these any time.`
              })()}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => post('/api/quests', {
          action: 'child',
          name: name.trim(),
          date_of_birth: dobFrom(dobMonth, dobYear),
          worries,
          worry_other: worryOther.trim() || undefined,
        })}
        disabled={!ready || busy !== null}
        style={{
          marginTop: '12px',
          background: ready ? 'var(--terracotta)' : '#fff',
          color: ready ? 'var(--ink)' : 'var(--ink-muted)',
          border: ready ? '2px solid var(--ink)' : '2px solid var(--border)', borderRadius: 16, padding: '13px 22px',
          cursor: ready && busy === null ? 'pointer' : 'default',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          boxShadow: ready ? '0 4px 0 var(--ink)' : 'none',
        }}
      >
        {busy === 'add' ? 'Adding...' : 'Add this child'}
      </button>

      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>
          That did not save. Have another go.
        </p>
      )}

      {added.length > 0 && (
        <div style={{
          marginTop: '14px', background: 'var(--tint-sage)',
          border: '2px solid var(--ink)', borderRadius: 16, padding: '14px 16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            color: 'var(--ink)', margin: '0 0 4px',
          }}>
            {added.length === 1 ? `${added[0]} is added` : `${added.join(', ')} are added`}
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Add another above if there is one more, or say that is everyone.
          </p>
          <button
            onClick={done}
            disabled={busy !== null}
            style={{
              marginTop: '12px', width: '100%',
              background: 'var(--terracotta)', color: 'var(--ink)',
              border: '2px solid var(--ink)', borderRadius: 16, padding: '13px 22px',
              cursor: busy === null ? 'pointer' : 'default',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              boxShadow: '0 4px 0 var(--ink)',
            }}
          >
            {busy === 'only' ? 'Saving...' : 'Done, that is everyone'}
          </button>
        </div>
      )}

      {added.length === 0 && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
          You can add another any time. Let us get one right first if you would rather.
        </p>
      )}

      <div style={{ textAlign: 'center', margin: '8px 0 0', display: added.length > 0 ? 'none' : 'block' }}>
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

  // ── IF THEY ARE ALREADY IN THE APP, STOP ASKING ───────────────────────────
  //
  // Justin, 11 September 2026: "its asking me to add to home page but im on
  // the app on laptop, can it be clever enough not to ask if already added to
  // home?"
  //
  // It can, and the browser has been telling us all along. display-mode is
  // standalone when the page is running as an installed app rather than in a
  // tab, and that is the same proof InstallPrompt already trusts. Three other
  // display modes mean installed too: minimal-ui, fullscreen, and Chrome's
  // window-controls-overlay, which is what a desktop PWA reports on Windows.
  // Only matching standalone is why a laptop could be inside the app and still
  // be handed instructions for getting into it.
  //
  // InstallPrompt's own standalone ping cannot help here: its effect returns
  // early on the setup page on purpose, so this page would only ever stamp on
  // some later visit to another page. A parent who installs the app and comes
  // straight here to finish setup is exactly the parent who never got the
  // tick.
  //
  // So this stamps it itself, once, and shows the done state instead of three
  // rows of how to. Fire and forget: the route is idempotent and writes only
  // when the column is still null.
  const [installed, setInstalled] = useState(false)
  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean }
    const standalone = ['standalone', 'minimal-ui', 'fullscreen', 'window-controls-overlay']
      .some(m => window.matchMedia(`(display-mode: ${m})`).matches)
      || nav.standalone === true
    if (!standalone) return
    setInstalled(true)
    fetch('/api/setup/home-screen', { method: 'POST' })
      .then(() => router.refresh())
      .catch(() => { /* the tick lands on the next open */ })
  }, [router])

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
    background: 'var(--cream)', border: '2px solid var(--ink)', borderRadius: '14px', padding: '12px 14px',
  }
  const marker: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
    color: 'var(--terracotta-dark)', flexShrink: 0, paddingTop: '3px', minWidth: 58,
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
      {installed ? (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
          You are already in the app rather than a browser tab, so this one is
          done. Ticking it now.
        </p>
      ) : (<>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 2px', fontWeight: 600 }}>
        This is what lets the check ins reach you. Apple only allows notifications from the home screen.
      </p>

      <div style={row}>
        <span style={marker}>iPhone</span>
        <span style={line}>
          <strong>Share</strong>, then <strong>Add to Home Screen</strong>, then <strong>Add</strong>.
        </span>
      </div>
      <div style={row}>
        <span style={marker}>Android</span>
        <span style={line}>
          <strong>Three dots</strong> in Chrome, then <strong>Add to Home screen</strong>, then <strong>Install</strong>.
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
          The <strong>install icon</strong> in the address bar in Chrome or Edge. In Safari, <strong>Share</strong>, then <strong>Add to Dock</strong>.
        </span>
      </div>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '2px 0 0' }}>
        Open it from your home screen once and this step ticks itself.
      </p>
      </>)}

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
            background: 'var(--terracotta)', color: 'var(--ink)', border: '2px solid var(--ink)',
            borderRadius: 16, padding: '12px 20px', cursor: busy ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
            boxShadow: '0 4px 0 var(--ink)',
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

function AllDone({ checkInDone }: { checkInDone: boolean }) {
  return (
    <div style={{
      background: 'var(--tint-sage)', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
      borderRadius: '22px', padding: '26px 22px', textAlign: 'center',
    }}>
      {/* THE BIG TICK. "All completes and big tick appears in screen, lets get
          started." It is the one moment in setup worth marking, so it is drawn
          rather than borrowed from an emoji font: at this size an emoji tick
          renders differently on every platform and on some of them it is not
          green at all. */}
      <div
        aria-hidden
        style={{
          width: 84, height: 84, borderRadius: '50%', background: 'var(--retro-green)', border: '2.5px solid var(--ink)', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', boxShadow: '0 5px 0 var(--ink)',
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
      {/* ── IT HAS TO KNOW WHETHER THE CHECK IN IS ACTUALLY WAITING ────────
          Justin, 9 September 2026, with both screens side by side: "it says
          done today under one that is to do today."

          This card was static. It told every parent that the first thing today
          was the check in and offered a button saying Start today's check in,
          whether or not they had already done it half an hour earlier. Tapping
          it landed on a page reading "All done for today", which is the same
          shape of fault as the setup loop: two surfaces reading one truth and
          only one of them looking it up. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        {checkInDone
          ? 'That is the one time work behind you, and today\u2019s check in is already done. Nothing else is waiting on you today.'
          : 'That is the one time work behind you. First thing today is the check in, about thirty seconds, and it is what everything else is built on.'}
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
        href={checkInDone ? '/dashboard' : '/dashboard/checkin'}
        style={{
          display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
          border: '2px solid var(--ink)', borderRadius: 16, padding: '15px 28px', textDecoration: 'none',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
          boxShadow: '0 4px 0 var(--ink)',
        }}
      >
        {checkInDone ? 'Back to today' : "Start today's check in"}
      </Link>
    </div>
  )
}
