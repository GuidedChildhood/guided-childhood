'use client'
import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient, isSupabaseConfigured, NOT_CONFIGURED_MESSAGE, networkAuthMessage } from '@/lib/supabase/client'
// ── LOADED WHEN THEY ARE NEEDED, NOT BEFORE ─────────────────────────────────
//
// The reveal (764 lines, GSAP and ScrollTrigger, eight subcomponents, the
// product mocks), the saving screen and the provider buttons all shipped in
// the first bundle of this page, before a parent had answered question one.
// Found in the speed review of 13 September 2026. They now load when the quiz
// reaches them. No server render for these three: this page is a client
// component and every one of them appears only after a tap.
const ResultScreen = dynamic(() => import('./ResultScreen'), { ssr: false })
const ProviderButtons = dynamic(() => import('@/components/auth/ProviderButtons'), { ssr: false })
const SavingPathway = dynamic(() => import('@/components/starter/SavingPathway'), { ssr: false })
import { writeStarterSetup, keepPendingSetup, takePendingSetup, clearPendingSetup, type PendingSetup } from '@/lib/starter/finish-setup'
import { enabledProviders } from '@/lib/auth/providers'
import { rememberStarterNext, starterNext, takeAfterSignupHref } from '@/lib/starter/next'
import { bandForYears, YOUNGEST_AGE } from '@/lib/children/age'
import { track } from '@/components/Analytics'
import { readUtm, opensOnQuestionOne, VIA_PARAM, VIA_LINK } from '@/lib/video/utm'
import { hasUtm } from '@gc/shared/utm'
import WorryPicker from '@/components/onboarding/WorryPicker'
import WhatWeAreNot from '@/components/marketing/WhatWeAreNot'
import { WORRIES, CATCH_ALL_ID, challengeFor, toWorryIds, worryLabel } from '@/lib/onboarding/worries'
import {
  FEELING_OPTIONS,
  TIME_COMMITMENT_OPTIONS,
  getStageFromAgeBand,
  type AgeBand,
  type ChallengeId,
  type FeelingId,
  type TimeCommitmentId,
  type StarterAnswers,
} from '@/lib/content/stages'

// ── THE ACCOUNT COMES LAST (10 September 2026) ────────────────────────────
//
// Every advert we run says "Three questions. No sign up." (app/page.tsx). The
// second screen of this flow used to be Create your account, with a name, an
// email and a password, before a single question about the child. That is the
// funnel's headline claim broken at the first step, and THE-STORY puts the
// whole route to 4,000 a month through this one page.
//
// It was front loaded in July (commit 619150bc) for a good reason: the old
// flow asked about the child twice, once here and once in a separate
// onboarding. Asking once is still right. Asking once at the END costs nothing,
// because the answers are already held in state and in localStorage.
//
// Calm Sleep, Brilliant and Life Reset all do it this way: the questions, then
// the personalised result, then the account framed as the thing that saves it.
// See plans/2026-09-10-starter-account-last.md for the numbers.
type Step = 'intro' | 'q1' | 'q2' | 'q4' | 'reassure' | 'result' | 'account'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const

// Seventeen years back, newest first, because a parent scrolling for a nine
// year old should not pass 2009 on the way. The product runs from four to
// sixteen and one spare year each side covers a child who is nearly either.
const THIS_YEAR = new Date().getFullYear()
const BIRTH_YEARS = Array.from({ length: 18 }, (_, i) => THIS_YEAR - i)

// The six drawn concern icons that used to live here went with the six option
// grid on 9 September 2026. The quiz asks the nine worries now, from
// lib/onboarding/worries, drawn by components/onboarding/WorryIcon, so there
// is one hand and one list for the quiz, the setup wizard and the fixture.


const STAGE_ACCENT: Record<number, { bold: string; text: string }> = {
  1: { bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  2: { bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  3: { bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  4: { bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  5: { bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
}

export default function StarterPackPage() {
  const [step, setStep] = useState<Step>('intro')
  // The query string as the visitor arrived, read once. The ?src= effect
  // below takes src and via out of the address bar, and the restore effect
  // still needs to know they were there.
  const arrival = useRef<URLSearchParams | null>(null)
  const arrivedWith = () => (arrival.current ??= new URLSearchParams(window.location.search))
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null)
  // ── MONTH AND YEAR, NOT A BAND ──────────────────────────────────────────────
  //
  // Justin, 13 August 2026: "is it best to ask the stage or are we going to ask
  // for month and year of child birth like we do internally... could that be a
  // barrier to set up, we can say why."
  //
  // The birthday, and the code already agreed before he asked. children
  // .date_of_birth exists, lib/children/age.ts derives the band from it, and
  // lib/learning/term.ts needs the real date for the 31 August cutoff: without
  // it the app cannot say which school year a child is in and refuses to guess.
  // A band is a VIEW of the birthday, so asking for the band means asking for
  // something we cannot use and then asking again later as a chore, which is
  // exactly what the birthday setup step was.
  //
  // ON THE BARRIER, WHICH IS THE REAL QUESTION. A date is a heavier ask than a
  // chip, so this is month and year only, two taps on a phone, no day. Nobody
  // has to remember anything or dig out a certificate, it cannot be got wrong,
  // and it is visibly less than a full date of birth, which is what makes
  // people hesitate. The reason is said on the screen rather than assumed,
  // because an unexplained date question at signup is where a parent stops.
  //
  // It also stops a child silently ageing out of a band nobody updated.
  const [dobMonth, setDobMonth] = useState<number | null>(null)
  const [dobYear, setDobYear] = useState<number | null>(null)
  // ── ONE TAP FIRST, THE BIRTHDAY AT THE SAVE (14 November 2026) ──────────────
  //
  // The month and year question above was right about what we need and wrong
  // about when to ask it. The first paid adverts (round 1, 12 to 14 November)
  // brought 136 parents to this page and not one of them answered question
  // one: a stranger from an advert promised "three questions, no sign up" was
  // met with a name box and two dropdowns before getting anything back.
  // Justin: "Pause and fix it".
  //
  // So question one is their age, one tap, which is all the stage needs. The
  // birth month is asked on the save screen, where the parent has seen their
  // pathway and is making the account anyway, which is also where THE-STORY
  // always put it ("date of birth, asked once at signup"). With the age and
  // the month the year is exact, so the school year still comes out right.
  const [ageYears, setAgeYears] = useState<number | null>(null)
  // Once the parent touches the birthday on the save screen it stays on that
  // screen, so a choice does not make the box it was made in disappear.
  const [birthdayHere, setBirthdayHere] = useState(false)
  // ── THE WORRIES THE PARENT TICKED ─────────────────────────────────────────
  //
  // Justin, 9 September 2026, on the live quiz: "You said we were changing to
  // 9 here still only 6? Also not happy new design?"
  //
  // He had seen the nine worries land on the setup screen after sign up and
  // reasonably expected them here. They had not arrived because this screen
  // kept its own older copy of the same question, so the same parent was asked
  // what was hard twice, in two vocabularies, either side of a card payment.
  // Asked which way he wanted it, he chose: ask once, here, before they pay.
  //
  // So `picks` now holds WORRY ids from lib/onboarding/worries, the parent's
  // own words, and the two values below are DERIVED from them. ChallengeId
  // stays exactly as it was, because it is not the parent's vocabulary any
  // more, it is the routing key every stage's challengeActions is written
  // against. The parent sees their words, the pathway sees a key it has
  // content for, and neither has to know about the other.
  const [picks, setPicks] = useState<string[]>([])
  // Their own words, when Something else is ticked. Kept even while the tile is
  // off, so unticking by accident does not wipe what they typed.
  const [worryOther, setWorryOther] = useState('')
  const challenge = challengeFor(picks[0])
  // Every worry ticked, as pathway keys, most pressing first and deduped.
  // Three worries can share one key (bedtime, mornings and will not put it
  // down are all screens_takeover), so this is shorter than picks and that is
  // correct: it is what the pathway starts on, not what the parent said.
  const concerns = Array.from(new Set(picks.map(p => challengeFor(p)).filter((c): c is ChallengeId => c !== null)))
  // The feeling question was dropped (age, concerns and usage are the ones
  // that drive the first fixes). A calm default keeps the reveal copy working
  // without asking for it.
  const [feeling, setFeeling] = useState<FeelingId | null>('unsure')
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitmentId | null>(null)
  const [email, setEmail] = useState('')
  // ── THE PARENT'S OWN FIRST NAME (11 September 2026) ───────────────────────
  //
  // Justin, asked whether the starter pack should collect one: "yes".
  //
  // This state has existed all along and nothing has ever set it: the old
  // account form had a name box, the box was removed, and what was left was a
  // variable restored from localStorage, sent to the lead capture as
  // `name: null` every single time, and rendered nowhere.
  //
  // The cost of the missing box showed up in Justin's own inbox. With no name
  // passed at signup, handle_new_user falls back to the part of the email
  // before the @, so the welcome opened "Thank you for joining, justin+1234."
  // Every CTA on the product routes here, so that is every future family.
  //
  // OPTIONAL, not required. This is the last screen between a convinced parent
  // and the product, and a form that refuses to submit costs more than a
  // missing name ever could. A visible box gets filled in by most people, and
  // the greeting drops the name gracefully for anyone who skips it
  // (lib/email/parent-name), so skipping is a supported answer rather than a
  // hole.
  const [name, setName] = useState('')
  const [childName, setChildName] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  /** True once the account exists, so the reveal stops offering to make one. */
  const [accountMade, setAccountMade] = useState(false)
  // True once the account exists and needs email confirmation before they can
  // step into the platform (only when Confirm email is switched on in
  // Supabase). With it off, a session is created and this stays false.
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const supabase = createClient()
  // A parent who has already been through the quiz on this device. We greet
  // them by name of intent rather than making them start Q1 over again.
  const [returning, setReturning] = useState(false)
  // ── THE SCHOOL THAT SENT THEM (migration 353) ─────────────────────────
  //
  // A family arriving from a school newsletter link (/s/<code>) sees one line
  // naming their school, so the page they land on matches the newsletter that
  // sent them. The name comes from the server, read from the cookie the link
  // set, never from the address bar: ?school only says there is one to ask
  // about, so the other visitors cost no request.
  // Each step of the stage check by its name and nothing else, so PostHog can
  // show where parents stop (lib/analytics/posthog-policy.ts says why only
  // the name). Does nothing until NEXT_PUBLIC_POSTHOG_KEY is set.
  useEffect(() => { track('stage_check_step', { step }) }, [step])
  const [schoolName, setSchoolName] = useState<string | null>(null)
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('school')) return
    fetch('/api/school-link')
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (typeof j?.name === 'string') setSchoolName(j.name) })
      .catch(() => { /* the page reads the same without it */ })
  }, [])
  const [restored, setRestored] = useState(false)
  // True when this visit picked up a half finished quiz from an earlier one,
  // which is when Not you? Start fresh is shown beside the question count.
  const [resumed, setResumed] = useState(false)
  // True only while we are landing back from Google or Apple. The page draws a
  // different screen for it, because the alternative is a parent who has just
  // signed in watching question one flash up at them.
  const [finishing, setFinishing] = useState(false)

  // ── ALREADY ONE OF OURS ──────────────────────────────────────────────────
  //
  // Justin, 15 October 2026: the starter pack link "needs to be clever enough
  // to know if already has an account". The email links now route through
  // /api/go/starter, which sends a member home; this catches every other way
  // a signed in parent lands here (the website, a shared link, a bookmark).
  //
  // Justin, 21 October 2026, opening it signed in: it showed the quiz filled
  // in with his child's name, which is strange for someone who has done it.
  // So a member gets a welcome back card INSTEAD of the quiz, wherever the
  // quiz had got to. Still not a redirect: a parent may have tapped the link
  // to check a second child, or be showing a friend on their own phone, and
  // the card has a door for each.
  //
  // getSession first because it reads the cookie and costs no request, so a
  // visitor who has never signed in sees the page at once. Only a session is
  // worth the round trip to confirm it and fetch the children's names.
  const [member, setMember] = useState<{ childNames: string[] } | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  useEffect(() => {
    // FIRST, before anything reads it: keep or clear ?next= (lib/starter/next.ts).
    rememberStarterNext()
    if (new URLSearchParams(window.location.search).get('finish') === '1') return
    // ?preview=member shows the card without a session, the same dev only
    // hook as ?preview=result, so the layout can be checked at 390 and 1280.
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('preview') === 'member') {
      setMember({ childNames: ['Ava'] })
      setAuthChecked(true)
      return
    }
    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        // A member sent here with somewhere to go (a lesson a school shared,
        // the agreement page) goes there, rather than to a card asking which
        // of two doors they meant. They already told us.
        const next = starterNext()
        if (next) { window.location.replace(takeAfterSignupHref()); return }
        const { data: kids } = await supabase.from('children').select('name').eq('parent_id', user.id).order('is_primary', { ascending: false })
        setMember({ childNames: (kids ?? []).map(k => (k.name ?? '').trim()).filter(Boolean) })
      } catch { /* reads as signed out, which shows the normal page */ }
      finally { setAuthChecked(true) }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── NOT YOU? START FRESH ──────────────────────────────────────────────────
  //
  // A shared family laptop or a borrowed phone: the next person must never
  // open this page to someone else's child's name. Every gc_starter_ key goes
  // (progress, answers, email, names, the provider blob) and the state goes
  // back to a first visit. A member is signed out of THIS browser only
  // (scope local), so the parent's own phone stays signed in.
  async function startFresh() {
    if (member) {
      try { await supabase.auth.signOut({ scope: 'local' }) } catch { /* the card still goes */ }
      setMember(null)
    }
    try {
      Object.keys(localStorage).filter(k => k.startsWith('gc_starter_')).forEach(k => localStorage.removeItem(k))
    } catch { /* private mode */ }
    resetChild()
    setEmail(''); setName(''); setPassword('')
    setReturning(false); setResumed(false)
    setStep('intro')
    window.scrollTo({ top: 0 })
  }

  // A brother or sister starts from a blank quiz, but the parent is the same
  // person, so their name and email stay and they are not asked twice.
  function resetChild() {
    setAgeBand(null); setAgeYears(null); setBirthdayHere(false); setDobMonth(null); setDobYear(null)
    setPicks([]); setWorryOther(''); setFeeling('unsure'); setTimeCommitment(null)
    setChildName('')
  }

  const stage = ageBand ? getStageFromAgeBand(ageBand) : null
  // Is there a faster way in on this deployment? Only the copy needs to know;
  // ProviderButtons decides for itself whether to draw anything.
  const oneTap = enabledProviders().length > 0

  // ── COMING BACK FROM A PROVIDER ──────────────────────────────────────────
  //
  // ProviderButtons sends the parent to /auth/callback with this page and
  // ?finish=1 as the destination, so the code lands here with a live session
  // and no React state whatsoever. Everything the write through needs was put
  // in one blob the instant before the browser left.
  //
  // The session is checked rather than assumed. /auth/callback already sends a
  // failed exchange to /login, so arriving here without one should not happen,
  // and "should not happen" is exactly the case that writes a child row against
  // nobody if it is not looked at.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('finish') !== '1') return
    setFinishing(true)
    let cancelled = false
    ;(async () => {
      const pending = takePendingSetup()
      // The round trip cleared React state, so the child's name comes back off
      // the blob. Without this the screen says "your pathway" to a parent who
      // has been reading their child's name on every screen up to here.
      if (pending?.childName) setChildName(pending.childName)
      // Their own name too, for the same reason: the round trip cleared it,
      // and finish-setup writes it to the profile a few lines below.
      if (pending?.parentName) setName(pending.parentName)
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        // No session, so there is nothing to write and nothing to save. Send
        // them to sign in rather than leave them on a screen that says saving.
        clearPendingSetup()
        window.location.replace('/login?error=auth')
        return
      }
      if (pending) await writeStarterSetup(supabase, pending)
      if (cancelled) return
      // replace, not href: back from the Setup Quest should reach the site,
      // never bounce through this screen and run the write again. The Setup
      // Quest unless the page that sent them asked for somewhere else.
      window.location.replace(takeAfterSignupHref())
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resume mid-quiz progress on refresh or return visit, instead of losing
  // everything and starting over at Q1.
  useEffect(() => {
    // Dev only: /starter-pack?preview=result renders the reveal with a
    // fixture family, so it can be checked without running the quiz.
    // Landing back from a provider: the effect above owns this render and is
    // about to navigate away. Restoring a half finished quiz underneath it only
    // repaints a screen nobody sees.
    if (new URLSearchParams(window.location.search).get('finish') === '1') return
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('preview') === 'result') {
      setAgeBand('11-13'); setPicks(['mood_after_screens']); setTimeCommitment('5min'); setChildName('Ava'); setStep('result'); setRestored(true)
      return
    }
    try {
      // Only a run stopped ON a question is a half finished quiz. Until
      // 21 October 2026 progress was also written on the intro and on the
      // account step, so a parent who had finished, or only looked, came back
      // to question one already filled in with their child's name and no
      // welcome back, because any saved progress hid the finished run. A
      // record like that is thrown away here, and the save below no longer
      // writes one.
      const raw = localStorage.getItem('gc_starter_progress')
      const QUIZ_STEPS = ['q1', 'q2', 'q4', 'details', 'q3', 'email']
      const saved = raw && QUIZ_STEPS.includes((JSON.parse(raw) as { step?: string }).step ?? '') ? raw : null
      if (raw && !saved) localStorage.removeItem('gc_starter_progress')
      if (saved) {
        const parsed = JSON.parse(saved) as { step: Step | 'details' | 'q3' | 'email'; ageBand: AgeBand | null; ageYears?: number | null; dobMonth?: number | null; dobYear?: number | null; picks?: string[]; worryOther?: string; challenge?: ChallengeId | null; feeling: FeelingId | null; timeCommitment: TimeCommitmentId | null }
        // Not you? Start fresh is for somebody who really did answer something
        // here before. A saved run with no answer in it (the save writes the
        // moment question one shows) is a visit, not a person, and a new parent
        // from an advert was being asked "Not you?" on their first screen.
        if (parsed.ageBand || parsed.picks?.length) setResumed(true)
        if (parsed.ageBand) setAgeBand(parsed.ageBand)
        if (parsed.ageYears) setAgeYears(parsed.ageYears)
        // A parent part way through keeps the birthday they already gave, and
        // an older saved run has no birthday at all, which is why the band is
        // restored on its own line above rather than derived from this.
        if (parsed.dobMonth) setDobMonth(parsed.dobMonth)
        if (parsed.dobYear) setDobYear(parsed.dobYear)
        // toWorryIds carries a run saved before 9 September 2026 forward: back
        // then `picks` held the old six ids, so a parent who was mid quiz when
        // this shipped lands on the tile they would have picked today rather
        // than on an empty grid.
        if (parsed.picks?.length) setPicks(toWorryIds(parsed.picks))
        else if (parsed.challenge) setPicks(toWorryIds([parsed.challenge]))
        if (parsed.worryOther) setWorryOther(parsed.worryOther)
        if (parsed.feeling) setFeeling(parsed.feeling)
        if (parsed.timeCommitment) setTimeCommitment(parsed.timeCommitment)
        // A saved step from the old order can name a screen that no longer
        // exists (details, q3, email). Those resume at the first question
        // rather than at a blank page, and their answers are still restored
        // above, so nobody who was mid quiz when this shipped loses anything.
        const LIVE: Step[] = ['intro', 'q1', 'q2', 'q4']
        if (parsed.step && (LIVE as string[]).includes(parsed.step)) setStep(parsed.step as Step)
        else if (parsed.step) setStep('q1')
      }
      // A saved email plus a completed answer set means they have finished the
      // quiz here before. Hydrate those answers so See my pathway can render
      // the result, and offer to take them straight there or to sign in, so
      // returning lands them in the right place, not back at Q1.
      const savedEmail = localStorage.getItem('gc_starter_email')
      const savedName = localStorage.getItem('gc_starter_name')
      const savedChildName = localStorage.getItem('gc_starter_child_name')
      const savedAnswers = localStorage.getItem('gc_starter_answers')
      if (savedEmail) setEmail(savedEmail)
      if (savedName) setName(savedName)
      if (savedChildName) setChildName(savedChildName)
      if (savedEmail && savedAnswers && !saved) {
        try {
          const a = JSON.parse(savedAnswers) as StarterAnswers
          if (a.ageBand) setAgeBand(a.ageBand)
          if (a.worryOther) setWorryOther(a.worryOther)
          if (a.worries?.length) setPicks(toWorryIds(a.worries))
          else if (a.concerns?.length) setPicks(toWorryIds(a.concerns))
          else if (a.challenge) setPicks(toWorryIds([a.challenge]))
          if (a.feeling) setFeeling(a.feeling)
          if (a.timeCommitment) setTimeCommitment(a.timeCommitment)
          setReturning(true)
        } catch {}
      }
      // ── STRAIGHT TO QUESTION ONE FROM A POST (funnel audit, fix 4) ──────
      //
      // The post said "Free stage check" and the parent tapped it, so the
      // intro saying it again is one more screen before the thing they came
      // for. A visit through a source link, a ?src= or a social utm_source
      // opens on question one (lib/video/utm opensOnQuestionOne). Not over a
      // half finished quiz or a finished one: those keep their own screens.
      if (!saved && !(savedEmail && savedAnswers) && opensOnQuestionOne(arrivedWith())) setStep('q1')
    } catch {}
    setRestored(true)
  }, [])

  // Save progress after every answer, not just at the end, so a refresh or
  // an accidental close does not throw away answers already given.
  // Only while on a question: see the note on the restore above.
  useEffect(() => {
    if (!restored || (step !== 'q1' && step !== 'q2' && step !== 'q4')) return
    try {
      localStorage.setItem('gc_starter_progress', JSON.stringify({ step, ageBand, ageYears, dobMonth, dobYear, picks, worryOther, feeling, timeCommitment }))
    } catch {}
  }, [restored, step, ageBand, ageYears, dobMonth, dobYear, picks, worryOther, feeling, timeCommitment])

  // ── ?src= AND THE UTMs, READ (migrations 379 and 388) ───────────────────
  //
  // Printed and published pieces carry /starter-pack?src=<code> (the Planet
  // Post went to print with src=planet-post-1), and until now nothing read it.
  // Posted once on arrival: a live code is counted and remembered exactly as
  // /v/<code> would be. The param then leaves the address bar, so a reload or
  // a copied link is not a second follow.
  //
  // Since 388 the post's UTMs are posted with it, or on their own, so the
  // count and the sign up keep which platform and which post sent them. They
  // stay in the address bar for PostHog's $pageview; only src and via go.
  // via=v means /v/<code> has counted this visit already, so nothing is posted.
  useEffect(() => {
    const params = new URLSearchParams(arrivedWith())
    const src = params.get('src')
    const utm = readUtm(params)
    const counted = params.get(VIA_PARAM) === VIA_LINK
    if (!counted && (src || hasUtm(utm))) {
      fetch('/api/video-link/follow', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ src, utm }), keepalive: true,
      }).catch(() => {})
    }
    if (!src && !params.has(VIA_PARAM)) return
    params.delete('src')
    params.delete(VIA_PARAM)
    const rest = params.toString()
    window.history.replaceState(window.history.state, '', window.location.pathname + (rest ? `?${rest}` : '') + window.location.hash)
  }, [])

  // ── EVERY START, COUNTED (migrations 372 and 379) ────────────────────────
  //
  // The first answer is the stage check begun. Posted once per visit; the
  // server counts it against the link that sent the visitor, or against a
  // referral link, a school link or no link at all, once per browser per
  // follow. It is how the founder page reads checks per channel, the Friday
  // number, rather than views.
  const startCounted = useRef(false)
  useEffect(() => {
    if (step !== 'q2' || startCounted.current) return
    startCounted.current = true
    fetch('/api/video-link/started', { method: 'POST', keepalive: true }).catch(() => {})
  }, [step])

  useEffect(() => {
    if (step === 'result' && ageBand && challenge && feeling && timeCommitment) {
      // `worries` is what the parent actually said and what setup reads back.
      // `challenge` and `concerns` are derived and still written, so every
      // pathway reader that has only ever known ChallengeId keeps working.
      const answers: StarterAnswers = { ageBand, challenge, concerns, worries: picks, worryOther: worryOther.trim() || undefined, feeling, timeCommitment }
      try {
        localStorage.setItem('gc_starter_answers', JSON.stringify(answers))
        localStorage.removeItem('gc_starter_progress')
      } catch {}
    }
  }, [step, ageBand, challenge, concerns, picks, worryOther, feeling, timeCommitment])

  // ── THE BUILD, LINE BY LINE, ON EVERY PHONE (25 September 2026) ─────────
  //
  // Justin: "it used to flash up line by line that it was building the
  // pathway, but now it just puts all the text there." The three lines were
  // revealed by a CSS keyframe, and globals.css switches every animation off
  // when a phone asks for reduced motion, so on those phones all three landed
  // at once and the beat that shows real work happening was gone. The reveal is
  // a timer now, which reduced motion does not touch: each line still arrives
  // in turn, and only the small slide up is dropped for those phones.
  const [built, setBuilt] = useState(0)
  useEffect(() => {
    if (step !== 'reassure') return
    setBuilt(0)
    const timers = [150, 950, 1750].map((ms, i) => setTimeout(() => setBuilt(i + 1), ms))
    const t = setTimeout(() => setStep('result'), 2900)
    return () => { clearTimeout(t); timers.forEach(clearTimeout) }
  }, [step])

  function selectAge(band: AgeBand) {
    setAgeBand(band)
    setTimeout(() => setStep('q2'), 280)
  }

  /** The first of the month they were born, which is all we ask for and all the
   *  school year cutoff needs. Stored as YYYY-MM-DD because every reader of
   *  date_of_birth slices the first ten characters. Since 14 November the year
   *  usually comes from the age they tapped plus the month given at the save:
   *  a child who is nine and born in a month already reached this year was
   *  born nine years ago, otherwise ten. A parent resuming an older run keeps
   *  the year they typed. */
  const birthYear = dobYear ?? (ageYears != null && dobMonth != null
    ? THIS_YEAR - ageYears - (dobMonth <= new Date().getMonth() + 1 ? 0 : 1)
    : null)
  const dob = dobMonth != null && birthYear != null
    ? `${birthYear}-${String(dobMonth).padStart(2, '0')}-01`
    : null

  /** Question one: their age, one tap, then on to the worries. */
  function chooseAge(years: number) {
    setAgeYears(years)
    setDobYear(null)
    setAgeBand(bandForYears(years))
    setTimeout(() => setStep('q2'), 280)
  }

  // Tap adds or removes a worry. The first one ticked is the one tomorrow
  // opens on, said once on that tile and once under the grid.
  //
  // The old "Start with this" control is gone. It sat on every ticked tile
  // except the first, so a parent who ticked three was looking at three tiles
  // all appearing to claim they were the starting point. Justin, 9 September
  // 2026: "says start here on several icons which does not make sense."
  // Untick and retick changes the order, which is two taps and needs no
  // chrome on nine tiles to explain.
  function toggleChallenge(c: string) {
    setPicks(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }
  function selectTimeCommitment(t: TimeCommitmentId) {
    setTimeCommitment(t)
    // The lead is saved with whatever we have, which at this point is the
    // answers and no email. finishSetup does NOT run here any more: there is no
    // account yet, and there will not be one until the parent has read their
    // pathway and chosen to save it.
    captureLead({ ageBand, concerns: picks, challenge, feeling, timeCommitment: t })
    setTimeout(() => setStep('reassure'), 280)
  }

  // Save the lead server side, best effort, keyed by email. Never blocks the
  // flow, and returns immediately when there is no email, which is the normal
  // case for a new parent now that the account comes last: the first time we
  // have an email is the moment they save the pathway, and the founder ping
  // fires then. A returning parent still has theirs in localStorage, so their
  // answers keep updating the same lead row as they go.
  async function captureLead(extra: Record<string, unknown>) {
    const clean = email.trim().toLowerCase()
    if (!clean) return
    try { localStorage.setItem('gc_starter_email', clean) } catch {}
    try {
      await fetch('/api/starter/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clean,
          answers: { name: name.trim() || null, ...extra },
          stageId: stage ? String(stage.id) : null,
        }),
      })
    } catch { /* lead capture is best effort */ }
  }

  // The LAST screen now: the account, once the pathway has been built and read.
  //
  // It used to be the first, which broke the promise in every advert we run
  // ("Three questions. No sign up.") and spent a parent's patience before they
  // had been asked anything about their child. The order is the questions, the
  // build beat, the pathway, and only then this. See
  // plans/2026-09-10-starter-account-last.md.
  //
  // Everything it needs is already in hand: the answers are in state, and
  // finishSetup writes them through the moment the session exists.
  async function submitAccount() {
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailError('Please enter a valid email so we can save your pathway.')
      return
    }
    if (password.length < 8) {
      setEmailError('Choose a password of at least 8 characters.')
      return
    }
    setEmailError('')

    // NEXT_PUBLIC values are baked in at build time, so a build made without
    // them points at placeholder.supabase.co, a domain that does not exist, and
    // every request dies in the browser. The login form has said so in words
    // since August. This screen, the first one a new customer meets, said
    // "Failed to fetch".
    if (!isSupabaseConfigured()) {
      setEmailError(NOT_CONFIGURED_MESSAGE)
      return
    }

    setSavingEmail(true)
    try { localStorage.setItem('gc_starter_email', clean) } catch {}

    // Create the account up front, the one click that sets it all up. With
    // Confirm email off a session is established now and they walk straight in
    // at the end; with it on the account is made and they confirm by email
    // before stepping in.
    const { data, error } = await supabase.auth.signUp({
      email: clean,
      password,
      // The name goes in the AUTH METADATA, because that is the only thing
      // handle_new_user (migration 001) reads: it takes
      // raw_user_meta_data->>'full_name' and falls back to the part of the
      // email before the @. Setting profiles.full_name afterwards would work
      // too and finish-setup does it as well, but this is the one that stops
      // the wrong value ever being written in the first place.
      //
      // Omitted entirely when they skipped the box, rather than sent as an
      // empty string, so the column stays null and the greeting knows it does
      // not have a name.
      options: {
        // The confirm link lands on /auth/callback, which honours next the
        // same way (lib/auth/safe-next.ts). Only sent when there is one, so
        // every other sign up confirms exactly as before.
        emailRedirectTo: `${window.location.origin}/auth/callback${starterNext() ? `?next=${encodeURIComponent(starterNext()!)}` : ''}`,
        ...(name.trim() ? { data: { full_name: name.trim() } } : {}),
      },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      // A dead fetch is not an answer about this account, so it must never be
      // shown as one. Everything else Supabase says is a real reply.
      const offline = networkAuthMessage(error.message)
      setEmailError(
        offline ??
        (msg.includes('already registered') || msg.includes('already been registered')
          ? 'That email already has an account. Sign in and your pathway is waiting.'
          : error.message)
      )
      setSavingEmail(false)
      return
    }
    await captureLead({})
    track('account_created')

    // With confirmation off a session exists now, so the answers are written
    // through and they walk into the product. With it on there is no session
    // yet: the reveal says check your email, and the old onboarding is the
    // fallback that writes the answers once they are in.
    if (!data.session) {
      setNeedsConfirm(true)
      setAccountMade(true)
      setSavingEmail(false)
      setStep('result')
      return
    }

    await finishSetup()
    // Tell Justin a new account exists (lib/ops/signup-alert.ts). The Google,
    // Apple and confirm by email ways in do this in /auth/callback; this way
    // never goes there. Fire and forget: the parent never waits on it.
    fetch('/api/signup/notify', { method: 'POST', keepalive: true }).catch(() => {})
    setSavingEmail(false)
    window.location.href = takeAfterSignupHref()
  }

  // Everything the write through needs, gathered from state in one place, so
  // the password path and the return from Google hand over exactly the same
  // thing. See lib/starter/finish-setup.ts for why the birthday has to travel
  // with it rather than be looked up from the older keys.
  function pendingNow(): PendingSetup {
    return { ageBand, challenge, picks, worryOther, feeling, timeCommitment, childName, parentName: name.trim(), dob }
  }

  // Write the account through: onboarding complete, the trial, the child. One
  // copy of it, in lib/starter/finish-setup.ts, called from both ways in.
  async function finishSetup() {
    await writeStarterSetup(supabase, pendingNow())
  }

  // submitEmail, the end of quiz email screen from the older order, was
  // deleted here on 10 September 2026 along with its screen. The account
  // step does its job now, at the same point in the flow, and it captures
  // the lead through the same route (captureLead).

  // THREE QUESTIONS, AND THE BUILD BEAT IS NOT ONE OF THEM.
  //
  // This read "Question 3 of 4" on the Building your pathway screen, which is
  // wrong twice over: there are three questions now that the feeling one is
  // gone, and the build beat is not a question at all. A counter that keeps
  // counting while nothing is being asked is how a parent starts wondering
  // what they missed.
  // The bar counts the three questions, and the account step comes AFTER all
  // of them, so it shows full rather than empty. An empty bar at the moment a
  // parent has answered everything reads as "you have done nothing yet", which
  // is the opposite of what has just happened.
  // The welcome back card stands in for whatever step the page restored, so a
  // member never sees the quiz behind it. Until we know whether this is a
  // member, a visit with saved history shows nothing rather than the wrong
  // screen for a beat; a first visit has none, so it never waits.
  const showCard = !!member || (returning && step === 'intro')
  const holding = !authChecked && (resumed || returning)
  const progress = showCard || holding ? 0 : step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q4' ? 3 : step === 'account' ? 3 : 0

  if (step === 'result' && stage && ageBand && challenge) {
    return (
      <ResultScreen
        stage={stage}
        accent={STAGE_ACCENT[stage.id]}
        challenge={challenge}
        worry={picks[0] ?? null}
        worries={picks}
        worryOther={worryOther.trim() || undefined}
        feeling={feeling!}
        onJoin={accountMade ? undefined : () => { setStep('account'); window.scrollTo({ top: 0 }) }}
        email={email}
        needsConfirm={needsConfirm}
        childName={childName.trim()}
      />
    )
  }

  // Landing back from Google or Apple. One beat, in the words of the thing they
  // just did, rather than the quiz reappearing behind them. The screen lives in
  // its own file because walking the funnel never reaches it: see
  // components/starter/SavingPathway.tsx and /dev/starter-finishing.
  if (finishing) return <SavingPathway childName={childName} />

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Segmented progress at the very top, one bar per question, the way
          the best onboarding flows show real momentum rather than a vague
          creeping line (Chime, Nextdoor and the like). */}
      <div style={{ display: 'flex', gap: '4px', padding: '8px 10px 0', flexShrink: 0 }} aria-hidden="true">
        {[1, 2, 3].map(n => (
          <div key={n} style={{ flex: 1, height: '4px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px',
              background: 'var(--terracotta)',
              width: progress >= n ? '100%' : '0%',
              transition: 'width 0.35s ease',
            }} />
          </div>
        ))}
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '32px 24px 48px', maxWidth: '520px', margin: '0 auto', width: '100%',
      }}>
        <style>{`
          @keyframes stepIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes gentleFloat {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }
        `}</style>
        {progress > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12,
            marginBottom: '36px', animation: 'stepIn 0.45s ease both',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            }}>
              Question {progress} of 3
            </span>
            {/* A quiz picked up from an earlier visit may be someone else's
                child on a shared device. */}
            {resumed && step !== 'account' && <StartFreshLink onClick={startFresh} />}
          </div>
        )}
        <div key={showCard ? 'card' : step} style={{ animation: 'stepIn 0.45s ease both', visibility: holding ? 'hidden' : undefined }}>

        {/* Welcome back. A signed in parent first, wherever the quiz had got
            to, then a parent who finished here before without signing in.
            One card shape for both: two doors and a way out for whoever is
            actually holding the phone. */}
        {showCard && member && (
          <WelcomeBackCard
            line={`You are signed in, so ${member.childNames.length === 1 ? `${member.childNames[0]}'s pathway is` : 'your pathway is'} waiting in the app.`}
            primary={{ label: pathwayLabel(member.childNames), href: '/dashboard' }}
            // The way the product adds a child: the add child form on the
            // quests page, opened for them (QuestManager reads ?add_child).
            secondary={{ label: 'Check another child', href: '/dashboard/quests?add_child=' }}
            onStartFresh={startFresh}
          />
        )}
        {showCard && !member && (
          <WelcomeBackCard
            line={<>{childName.trim() ? `${childName.trim()}'s pathway` : 'Your pathway'} is saved{email ? <> to <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{email}</span></> : ''}.</>}
            primary={{ label: childName.trim() ? `See ${childName.trim()}'s pathway again` : 'See your pathway again', onClick: () => { setReturning(false); setStep('result') } }}
            secondary={{ label: 'Start for another child', onClick: () => { resetChild(); setReturning(false); setStep('q1') } }}
            // No address in the link (6 November 2026): ?from=starter tells the
            // login form to fill the email from gc_starter_email, which this
            // page saved on this device, so it is still typed only once.
            signInHref={email ? '/login?from=starter' : '/login'}
            onStartFresh={startFresh}
          />
        )}

        {/* Intro — the story of what happens */}
        {step === 'intro' && !showCard && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img src="/digi-squad/DiGi-star-3d.png" alt="" width={72} height={72} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            {schoolName && (
              <p data-school-welcome style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
                textAlign: 'center', margin: '0 0 10px',
              }}>
                For families at {schoolName}
              </p>
            )}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px', textAlign: 'center',
            }}>
              Your free stage check
            </h1>
            {/* The words the posts use (funnel audit, fix 4). The four free
                days are told on the account screen, where they apply, not
                here before the parent has seen anything. */}
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '30px', lineHeight: 1.6, textAlign: 'center' }}>
              Three questions, two minutes. See your child&apos;s stage before you make an account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
              {[
                { n: '1', title: 'Tell us about your child', sub: 'Their age and the screen battle you are facing right now' },
                { n: '2', title: 'We build their pathway', sub: 'A plan for their exact age, step by step to a safe, capable 16' },
                { n: '3', title: 'Start tonight, free', sub: 'The words to say, lessons for their age, and a plan for both of you' },
              ].map(item => (
                <div key={item.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '16px 18px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{item.n}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{item.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.5 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('q1')}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px' }}
            >
              Start, it is free
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.06em' }}>
              No commitment. Built on the research.
            </p>
            <WhatWeAreNot />
          </>
        )}

        {/* The account, at the END, framed by what it saves.
            The parent has just watched their child's pathway being built and
            read the whole of it. Now it asks for the least that can make an
            account: an email and a password, plus a first name they may skip.

            The name came OUT of this form on the reasoning that an email only
            form converts 12 to 18 points better than name and email, and that
            reasoning holds for a REQUIRED field. What it missed is that the
            name does not disappear when you stop asking: handle_new_user
            writes the part of the email before the @ into it instead, so the
            welcome greeted Justin as justin+1234. An optional box asks without
            demanding, and the greeting is written to cope with an empty one,
            so the conversion argument and the email are both satisfied. */}
        {step === 'account' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <img src="/digi-squad/DiGi-star-3d.png" alt="" width={60} height={60} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px', textAlign: 'center',
            }}>
              {childName.trim() ? `Save ${childName.trim()}'s pathway` : 'Save your pathway'}
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
              {/* The line has to tell the truth in whichever state ships. With a
                  provider switched on it is one tap, and "two boxes" is then a
                  worse promise than the one we are actually making. Found by
                  walking the screen with the flag on, which is the only way it
                  could have been found. */}
              {/* It said "two boxes" and there are three of them now, one of
                  which is optional. Rather than argue that two is the number
                  that counts because the third can be skipped, the line stops
                  counting: it names what is asked for, which stays true
                  whatever the form does next. This whole day has been about
                  screens that say things that are nearly true. */}
              {oneTap ? 'One tap and it is yours, with four days of everything free. No card.'
                      : 'Your email and a password, and it is yours. Four days of everything free, no card.'}
            </p>

            {/* Above the email, not below it. The Mobbin sweep of account
                creation is split: Strava, monday.com and Finimize put the
                providers first, Zocdoc and Swarm bury them under the form. The
                whole value of one tap is that it is the fast way, and a fast
                way printed below the slow way is decoration.

                Draws nothing at all until a provider is switched on, so this
                screen is byte for byte what merged in PR 1036 until then. */}
            {/* THE BIRTHDAY, ASKED HERE (14 November 2026). Question one is
                their age now, one tap; the month is what turns that into a
                real birthday and so a real school year (the 31 August cutoff,
                lib/learning/term.ts). Above the providers so the one tap way in
                carries it too. A select, not a box: nothing here can refuse to
                go on (scripts/check-starter-order.mjs). Shown only while the
                birthday is still missing. */}
            {(!dob || birthdayHere) && (
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="birth-month" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                  {childName.trim() ? `Which month was ${childName.trim()} born?` : 'Which month were they born?'}
                </label>
                <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.55, margin: '0 0 10px' }}>
                  Just the month. With their age it gives us their school year, so what we send always matches where they are.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    id="birth-month"
                    className="input"
                    value={dobMonth ?? ''}
                    onChange={e => { setBirthdayHere(true); setDobMonth(e.target.value ? Number(e.target.value) : null) }}
                    style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)' }}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  {ageYears == null && (
                    <select
                      className="input"
                      aria-label="Birth year"
                      value={dobYear ?? ''}
                      onChange={e => { setBirthdayHere(true); setDobYear(e.target.value ? Number(e.target.value) : null) }}
                      style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)' }}
                    >
                      <option value="">Year</option>
                      {BIRTH_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  )}
                </div>
              </div>
            )}

            <ProviderButtons
              redirectTo="/starter-pack?finish=1"
              onBeforeRedirect={() => keepPendingSetup(pendingNow())}
            />

            {/* First, because it is the friendly one and it sets the tone for
                the two boxes under it. Optional: nothing checks it, and the
                button works without it. */}
            <input
              className="input"
              type="text"
              autoComplete="given-name"
              placeholder="Your first name"
              maxLength={40}
              value={name}
              onChange={e => { setName(e.target.value); try { localStorage.setItem('gc_starter_name', e.target.value.trim()) } catch {} }}
              style={{ fontSize: 'var(--text-md)', marginBottom: '12px' }}
            />
            <input
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
              style={{ fontSize: 'var(--text-md)', marginBottom: '12px' }}
            />
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={e => { setPassword(e.target.value); if (emailError) setEmailError('') }}
              onKeyDown={e => { if (e.key === 'Enter') submitAccount() }}
              style={{ fontSize: 'var(--text-md)', marginBottom: emailError ? '10px' : '16px' }}
            />
            {emailError && (
              <p style={{ color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)', textAlign: 'center', marginBottom: '14px', lineHeight: 1.5 }}>
                {emailError}
              </p>
            )}

            <button
              onClick={submitAccount}
              disabled={savingEmail}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px', opacity: savingEmail ? 0.7 : 1 }}
            >
              {savingEmail ? 'One moment...' : 'Save it and step in'}
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              No card. We save your pathway and email the occasional genuinely useful thing. Unsubscribe any time.
            </p>
            <button onClick={() => setStep('result')} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
              ← Back
            </button>
          </>
        )}

        {/* The build beat: the wait is used to show real work happening, the
            way the best onboarding flows earn the pause instead of spinning a
            blank loader. Three steps tick in, then it moves to the result. */}
        {step === 'reassure' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <img src="/digi-squad/DiGi-star-3d.png" alt="" width={72} height={72} style={{ animation: 'gentleFloat 2.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.2rem)',
              fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '18px',
            }}>
              Building your pathway.
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto 20px' }}>
              {[
                { t: `Matching to your stage` },
                { t: 'Writing the exact words for tonight' },
                { t: 'Mapping the pathway to 16' },
              ].map((row, i) => (
                <div key={row.t} className="build-row" data-built={i < built ? 'yes' : 'no'} style={{
                  display: 'flex', alignItems: 'center', gap: '11px', textAlign: 'left',
                  background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)',
                  padding: '12px 15px',
                  visibility: i < built ? 'visible' : 'hidden',
                  animation: i < built ? 'buildIn 0.5s ease' : 'none',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: 'var(--tint-sage)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D5016', fontSize: 'var(--text-sm)', fontWeight: 800,
                  }}>✓</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{row.t}</span>
                </div>
              ))}
            </div>
            {/* Honest reassurance, no invented numbers: this really is the
                thing parents raise most about growing up today. */}
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
              You are far from alone. Screens are the hardest daily battle most UK parents name, and there is a calm way through.
            </p>
            {/* THE LINES ARE THE CONTENT, NOT THE ANIMATION. Which lines show
                is decided by the timer above (built), so a phone with reduced
                motion still sees them arrive one at a time; the keyframe is
                only the slide up, and reduced motion drops just that. */}
            <style>{`
              @keyframes buildIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              @media (prefers-reduced-motion: reduce) {
                .build-row { animation: none !important; transform: none !important; }
              }
            `}</style>
          </div>
        )}

        {/* Q1: their age, one tap (14 November 2026, see ageYears above) */}
        {step === 'q1' && !showCard && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              How old is your child?
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: 'var(--text-base)', marginBottom: '18px', lineHeight: 1.55 }}>
              Tap their age. That sets their stage.
            </p>
            {/* Optional, and above the ages so the tap that moves on comes
                last. Nothing waits on it: a parent who skips it is called
                "your child" until the save screen, which asks again. */}
            <input
              className="input"
              type="text"
              autoComplete="off"
              aria-label="Your child's first name, if you like"
              placeholder="Their first name, if you like"
              value={childName}
              onChange={e => { setChildName(e.target.value); try { localStorage.setItem('gc_starter_child_name', e.target.value.trim()) } catch {} }}
              style={{ fontSize: 'var(--text-md)', marginBottom: '16px' }}
            />
            <div role="group" aria-label="Their age" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {Array.from({ length: 16 - YOUNGEST_AGE + 1 }, (_, i) => YOUNGEST_AGE + i).map(years => (
                <button
                  key={years}
                  type="button"
                  onClick={() => chooseAge(years)}
                  aria-pressed={ageYears === years}
                  style={{
                    minHeight: 52, borderRadius: 'var(--radius-tile)', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
                    color: 'var(--ink)',
                    background: ageYears === years ? 'var(--terracotta-lt)' : 'var(--white)',
                    border: ageYears === years ? '2.5px solid var(--ink)' : '1.5px solid var(--border)',
                  }}
                >
                  {years}
                </button>
              ))}
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5, margin: '0 0 6px' }}>
              We start at {YOUNGEST_AGE}, the age the first stage is written for.
            </p>

            {/* THE STAGE IS NOT ANNOUNCED HERE ANY MORE.

                Justin, 13 August 2026, walking his own signup: "it just flashes
                stage but should be a little slower". Then, in the same message:
                "and actually it says stage here so we do not even need to flash
                up stage on previous age entry."

                Asked which he meant, he chose to drop it. He is right, and the
                reason is that a card which appeared and animated for under a
                second was doing the WORST version of both jobs. It was too fast
                to read, so it never actually told a parent what the stage was,
                and it spent the reveal anyway, so by the time the result screen
                named the stage properly it was old news.

                A stage is worth one moment, not two, and the moment it is worth
                is the one where there is room to say what it means. That screen
                already exists and already says it. So the birthday screen goes
                back to being a birthday screen, and the reveal lands once, on
                the screen built for it. */}

            {/* SIBLINGS, SAID PROPERLY. This was a grey line at the bottom that
                read as small print, so a parent with three children could not
                tell whether this product was for one of them. */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '11px',
              background: 'var(--cream)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-tile)', padding: '13px 15px', marginTop: '16px',
            }}>
              <span aria-hidden="true" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.2, flexShrink: 0 }}>👧🧒</span>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--ink)' }}>More than one child?</strong> Start with whoever is on your mind today. You can add their brothers and sisters as soon as you are in, each with their own stage.
              </p>
            </div>
          </>
        )}

        {/* Q2 — Challenge (multi select, most pressing first) */}
        {step === 'q2' && !showCard && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              What are you dealing with right now?
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '20px', lineHeight: 1.55 }}>
              Pick as many or as few as you like. We cover them all, and more as we go.
            </p>

            {/* ── THE ONE QUESTION, ASKED HERE ──────────────────────────────
                The same grid the setup wizard draws, from the same list, in
                the same hand. It used to be a second, older copy of this
                question with six options and emoji, which is what Justin was
                looking at on 9 September 2026 when he asked why the nine had
                not arrived. There is one copy now: answer it here, and setup
                shows it back rather than asking again. */}
            <WorryPicker selected={picks} onToggle={toggleChallenge} primary={picks[0] ?? null} other={worryOther} onOther={setWorryOther} />

            {/* What the marker on the first tile means, in words, once. */}
            {picks.length > 1 && (
              <p style={{
                marginTop: '14px', fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)', color: 'var(--ink-muted)',
                lineHeight: 1.6, letterSpacing: '0.02em',
              }}>
                {/* Their words, not our label. A parent who has just typed
                    their worry and watched the tile take it should not read a
                    sentence underneath calling it "Something else" again. */}
                We open on {picks[0] === CATCH_ALL_ID && worryOther.trim() ? worryOther.trim() : worryLabel(picks[0])} first. Untick it to start somewhere else.
              </p>
            )}

            {/* The other half of the promise, and the same words setup used to
                say at this point: this list is not a one time form. Moments,
                DiGi and Right now all raise a new worry the day it happens, so
                nothing here has to be right first time. */}
            <p style={{ marginTop: picks.length > 1 ? '10px' : '14px', color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55 }}>
              We keep asking as things come up, so this does not have to be right first time.
            </p>

            {/* Parent wellbeing: the quiet reminder that this is about them too,
                shown right where they name the hard stuff. Warm, brief, never a
                lecture. */}
            <div style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
              borderRadius: 'var(--radius-btn)', padding: '14px 16px', marginTop: '20px',
            }}>
              <img src="/digi-squad/DiGi-star-3d.png" alt="" width={34} height={34} style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                This is the hardest part of parenting right now, and how you are doing matters as much as how they are. We have got you, not just your child.
              </p>
            </div>

            {/* The sage "you are choosing where to start" note stood here
                until 9 September 2026. Its two jobs, that ticking one is not
                choosing against the rest and that the list stays open, are
                both said under the grid now, in the same words setup uses, so
                a third card saying it a third way was one more thing to read
                on a screen that should take fifteen seconds. */}

            <button
              onClick={() => picks.length > 0 && setStep('q4')}
              disabled={picks.length === 0}
              style={{
                marginTop: '14px', width: '100%',
                padding: '16px 22px', borderRadius: 'var(--radius-btn)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: picks.length ? 'var(--terracotta)' : 'var(--border)',
                color: picks.length ? 'var(--ink)' : 'var(--ink-muted)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                cursor: picks.length ? 'pointer' : 'not-allowed',
                boxShadow: picks.length ? '0 5px 0 var(--terracotta-dark)' : 'none',
                transition: 'background 0.16s, box-shadow 0.16s',
              }}
            >
              {picks.length === 0 ? (
                'Tick what is going on'
              ) : (
                <>
                  <span>Start with {picks.length === 1 ? 'this focus' : 'these'}</span>
                  {picks.length > 1 && (
                    <span style={{
                      minWidth: '22px', height: '22px', padding: '0 7px', borderRadius: 'var(--radius-pill)',
                      background: 'rgba(26,26,46,0.16)', color: 'var(--ink)',
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {picks.length}
                    </span>
                  )}
                  <span aria-hidden style={{ fontSize: 'var(--text-md)' }}>→</span>
                </>
              )}
            </button>
            <button onClick={() => setStep('q1')} style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}

        {/* Q3, the feeling question, and the second email screen were both
            deleted on 10 September 2026. Neither had been reachable for
            some time: the worry tiles go straight to the time question,
            and the account step at the front made a later email ask
            redundant. Justin, asked directly, chose to take them out
            rather than leave two screens in the file that nobody could
            ever see. The feeling VALUE stays, defaulted to unsure, because
            the reveal copy reads it and the lead row carries it. */}
        {/* Q4 — Time commitment */}
        {step === 'q4' && !showCard && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              How much time can you give this each day?
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: 'var(--text-base)', marginBottom: '32px', lineHeight: 1.55 }}>
              We will match your daily practice to this. You can change it any time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TIME_COMMITMENT_OPTIONS.map(opt => {
                const on = timeCommitment === opt.value
                // ── TEN MINUTES IS THE RECOMMENDATION, AND IT SAYS SO ────────
                //
                // Justin, 13 August 2026: "this page should highlight the 10
                // minutes as recommended."
                //
                // The three read as equals with a faint tint on the middle one,
                // and "the pace most families use" is doing the persuading in
                // grey uppercase underneath, which is where a reader's eye goes
                // last. A parent picking blind here picks 5, and 5 minutes is
                // not enough day to build a habit on.
                //
                // Ten is also the number the whole product already promises:
                // the welcome email says ten minutes a day and TASK_MINUTES
                // budgets the road to ten. So this is not a nudge invented for
                // the screen, it is the page finally agreeing with everything
                // else.
                const recommended = opt.value === '10min'
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectTimeCommitment(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
                      padding: '15px 16px',
                      background: recommended && !on ? 'var(--stage-1)' : '#fff',
                      border: `${recommended ? 2 : 1.5}px solid ${on || recommended ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-btn)', cursor: 'pointer', textAlign: 'left',
                      boxShadow: on
                        ? '0 8px 22px rgba(220,88,50,0.18)'
                        : recommended ? '0 5px 0 var(--terracotta-dark)' : '0 1px 2px rgba(26,26,46,0.05)',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                          {opt.label}
                        </span>
                        {recommended && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--ink)', background: 'var(--gold)',
                            borderRadius: 'var(--radius-pill)', padding: '3px 9px',
                          }}>
                            Recommended
                          </span>
                        )}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {opt.sub}
                      </span>
                    </span>
                    <span style={{ color: on ? 'var(--terracotta)' : 'var(--ink-light)', fontSize: 'var(--text-xl)', flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>›</span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep('q2')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Result screen. The wow page. Five beats, in order:
   1. Reassure and name it (dark Sound familiar card + stage card)
   2. Your first week with us (day strip on a dotted path, DiGi walks it)
   3. What you get (feature flash cards)
   4. The pathway simulation (five stages, DiGi walks as you scroll)
   5. Save CTA (dark card, the one primary CTA)
   Spec: /plans/starter-result-wow-spec.md
──────────────────────────────────────────────────────────────── */

// ── THE WELCOME BACK CARD (21 October 2026) ─────────────────────────────────
//
// One shape for a signed in parent and for a parent who finished here before:
// DiGi, Welcome back, one line, the main door, the other door, and the quiet
// way out for whoever is actually holding the phone. Calm and short, the Good
// Inside reassurance screen rather than a dashboard: big text, nothing else.

type Door = { label: string; href?: string; onClick?: () => void }

function WelcomeBackCard({ line, primary, secondary, signInHref, onStartFresh }: {
  line: ReactNode
  primary: Door
  secondary: Door
  signInHref?: string
  onStartFresh: () => void
}) {
  const main: CSSProperties = { width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px' }
  const other: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '14px',
    padding: '15px 20px', borderRadius: 'var(--radius-btn)', border: 'var(--edge)', background: 'var(--white)',
    boxShadow: '0 5px 0 var(--ink)', color: 'var(--ink)', textDecoration: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
  }
  const door = (d: Door, style: CSSProperties, className?: string) => d.href
    ? <Link href={d.href} className={className} style={style}>{d.label}</Link>
    : <button type="button" onClick={d.onClick} className={className} style={style}>{d.label}</button>
  return (
    <div data-welcome-back style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
        <img src="/digi-squad/DiGi-star-3d.png" alt="" width={72} height={72} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)',
        fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
        color: 'var(--ink)', marginBottom: '10px',
      }}>
        Welcome back
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '28px', lineHeight: 1.6 }}>
        {line}
      </p>
      {door(primary, main, 'btn btn-gold')}
      {door(secondary, other)}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 22px', marginTop: '22px' }}>
        {signInHref && (
          <Link href={signInHref} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', letterSpacing: '0.06em', padding: '8px 0', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Sign in to my account
          </Link>
        )}
        <StartFreshLink onClick={onStartFresh} />
      </div>
    </div>
  )
}

function StartFreshLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} data-start-fresh style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)',
      letterSpacing: '0.06em', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap',
    }}>
      Not you? Start fresh
    </button>
  )
}

/** The main door's words: the child by name when there is one, both when two. */
function pathwayLabel(names: string[]): string {
  if (names.length === 1) return `Go to ${names[0]}'s pathway`
  if (names.length === 2) return `Go to ${names[0]} and ${names[1]}'s pathways`
  if (names.length > 2) return "Go to your children's pathways"
  return 'Open my app'
}
