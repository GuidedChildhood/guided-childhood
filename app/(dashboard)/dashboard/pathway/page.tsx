import { createClient } from '@/lib/supabase/server'
import FocusStrip, { CHALLENGE_LABELS } from '@/components/pathway/FocusStrip'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAGES, type ChallengeId } from '@/lib/content/stages'
import PathwayEvidence from '@/components/pathway/PathwayEvidence'
import PathwayJourney from '@/components/pathway/PathwayJourney'
import SchoolChest from '@/components/pathway/SchoolChest'
import { sheetTarget, sheetLabel } from '@/lib/learning/term'
import StageRoad from '@/components/pathway/StageRoad'
import LiteracyAreas from '@/components/pathway/LiteracyAreas'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import { getStageProgress, getAllStagesProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import { getJourney } from '@/lib/pathway/journey'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import BackTo from '@/components/nav/BackTo'
import { pickChild } from '@/lib/children/select'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import PassportBook from '@/components/pathway/PassportBook'
import PathwayIntro from '@/components/pathway/PathwayIntro'
import PathwayComplete from '@/components/pathway/PathwayComplete'
import { type Stamp, type StampStatus } from '@/components/pathway/PassportStamps'
import MeetTheFriends from '@/components/pathway/MeetTheFriends'
import StageReadiness from '@/components/pathway/StageReadiness'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { READINESS } from '@/lib/content/readiness'
import SectionTiles, { type SectionTile } from '@/components/ui/SectionTiles'
import IsItWorkingReport from '@/components/pathway/IsItWorkingReport'
import FiveADayReport from '@/components/pathway/FiveADayReport'
import { getFiveADayReport } from '@/lib/kid/day-report'
import WhatIsWorkingLink from '@/components/working/WhatIsWorkingLink'
import { buildPassportSections } from '@/lib/pathway/passport-sections'
import { getWeekParentReport } from '@/lib/balance/week-report'
import PassportToDo from '@/components/pathway/PassportToDo'
import { parentPassportToDo } from '@/lib/pathway/passport-todo'
import { gatherChildPassportToDo } from '@/lib/pathway/passport-todo-gather'
import SocialRoadNova from '@/components/pathway/SocialRoadNova'
import { getSocialRoad } from '@/lib/pathway/social-road'

// date_of_birth joined the select on 11 August 2026 for the school chest, which
// needs the year group and term rather than the age band.
type Child = { id: string; name: string; age_band: string | null; stage_id: string | null; is_primary: boolean; streak_weeks: number | null; date_of_birth: string | null }

export default async function PathwayPage({ searchParams }: { searchParams: Promise<{ child?: string; from?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam, from } = await searchParams

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('id, name, age_band, stage_id, is_primary, streak_weeks, date_of_birth').eq('parent_id', user.id).order('is_primary', { ascending: false }),
  ])

  const isPaid = hasFullAccess(profileResult.data, user.email)
  const children = (childrenResult.data ?? []) as Child[]

  const stageIdToNum: Record<string, number> = {
    foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
  }

  // The whole road renders for the selected child (?child=<id>), defaulting
  // to the primary, so a second or third child gets their own pathway too.
  const primaryChild = pickChild(children, childParam)
  const currentStageNum = primaryChild?.stage_id ? stageIdToNum[primaryChild.stage_id] ?? null : null

  // The child's own five a day, for the report under Is it working. Read with
  // the parent's client so the existing RLS policy is what decides, and empty
  // for a child with no app rather than an error.
  const fiveADay = await getFiveADayReport(supabase, primaryChild?.id ?? null)

  const [currentStageProgress, journey, allStagesProgress] = primaryChild?.stage_id
    ? await Promise.all([
        getStageProgress(supabase, user.id, primaryChild.stage_id as ProgressStageId, primaryChild.streak_weeks ?? 0, primaryChild.id),
        getJourney(supabase, user.id, primaryChild.stage_id as ProgressStageId),
        getAllStagesProgress(supabase, user.id, primaryChild.streak_weeks ?? 0, primaryChild.id),
      ])
    : [null, null, null]

  // One shared reading per stage for the road, the same blend the passport
  // uses, keyed by stage number, so caught up pages and filled stamps show
  // truthfully on the road instead of a fixed badge.
  const stageStatus: Record<number, { pct: number; complete: boolean }> = {}
  if (allStagesProgress) {
    for (const slug of Object.keys(allStagesProgress) as ProgressStageId[]) {
      stageStatus[stageIdToNum[slug]] = { pct: allStagesProgress[slug].overallPct, complete: allStagesProgress[slug].contentComplete }
    }
  }

  // What the passport's five section checklist needs beyond the per stage
  // blend: how many moments are open against how many this family has already
  // sorted, and this week's balance. The balance report is built here rather
  // than inside the report component below, and handed to both, so one page can
  // never quote two different totals for the same week.
  // Scoped to the SELECTED child since 18 August 2026 (multi child pass).
  // concerns gained child_id in migration 194, and reading the whole family
  // here meant a worry about the teenager dragged the six year old's passport
  // percentage down. Null child_id rows are family wide worries and count for
  // every child, which is what the or() says.
  const childScope = primaryChild?.id ? `child_id.eq.${primaryChild.id},child_id.is.null` : 'child_id.is.null'
  const [openMomentsRes, solvedMomentsRes, weekReport] = await Promise.all([
    supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).or(childScope).in('status', ['open', 'improving']),
    supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).or(childScope).eq('status', 'resolved'),
    getWeekParentReport(supabase, user.id, primaryChild ?? null),
  ])
  const stageSections = await buildPassportSections(
    supabase, user.id, primaryChild ?? null, allStagesProgress, currentStageNum,
    {
      openMoments: openMomentsRes.count ?? 0,
      solvedMoments: solvedMomentsRes.count ?? 0,
      parentReport: weekReport,
    },
  )

  const currentStageContent = currentStageNum ? STAGES.find(s => s.id === currentStageNum) : null

  // This child's own check passes, fetched BEFORE the stamps and the end of
  // road celebration because both are gated on it now. It used to sit further
  // down with the readiness inputs, which read it too, and still do.
  const passedStages = await getPassedStageQuizzes(supabase, user.id, primaryChild?.id ?? null)

  // All five stamps genuinely earned. Read from contentComplete, the same
  // source the passport and the road's trophy use, so the celebration can never
  // fire on a stage the family has not actually finished. Age is deliberately
  // not in it: a sixteen year old whose family did nothing has walked no road.
  // Content complete AND this child's check passed, stage by stage: the same
  // two halves a single stamp needs, so the end of road celebration can never
  // fire for a child who has not sat their own checks.
  const allStagesEarned = !!allStagesProgress
    && (['foundation', 'builder', 'explorer', 'shaper', 'independent'] as ProgressStageId[])
      .every((slug, i) => allStagesProgress[slug].contentComplete && passedStages.has(i + 1))

  // One live literacy reading for the whole page, shared by the four strands
  // card and the end of stage check below, so they never disagree.
  const litStatuses = await getLiteracyStatuses(supabase, user.id, currentStageNum ?? 1)

  // The end of stage readiness inputs: which strands for this age are green,
  // which are still amber (with their one next step), how many stage lessons
  // are left, and whether the passport quiz for this stage is already passed.
  const READINESS_AREAS = [
    { key: 'safe', name: 'Safe online', startStage: 1 },
    { key: 'balance', name: 'Healthy balance', startStage: 1 },
    { key: 'ai', name: 'AI and chatbots', startStage: 3 },
    { key: 'social', name: 'Social media ready', startStage: 3 },
  ] as const
  const stageNum = currentStageNum ?? 1
  const activeAreas = READINESS_AREAS.filter(a => stageNum >= a.startStage)
  const readinessAmbers = activeAreas
    .filter(a => (litStatuses[a.key]?.tone ?? 'green') !== 'green')
    .map(a => ({ name: a.name, improve: litStatuses[a.key]?.improve ?? 'Do the next step', href: litStatuses[a.key]?.href ?? '/dashboard/lessons' }))
  const readinessGreens = activeAreas.length - readinessAmbers.length
  const lessonsLeft = Math.max(0, (currentStageProgress?.lessonsTotal ?? 0) - (currentStageProgress?.lessonsDone ?? 0))
  const stageQuizPassed = passedStages.has(stageNum)

  // The check is the child's and lives on their own link, so all this page needs
  // is the token to send them to it.
  const { data: kidLink } = primaryChild?.id
    ? await supabase.from('kid_links').select('token').eq('child_id', primaryChild.id).maybeSingle()
    : { data: null }

  // Show the end of stage check as a family nears the end: content finished, or
  // the blend past three quarters, or the stamp already earned so it can show.
  const nearStageEnd = !!primaryChild?.stage_id && (
    stageQuizPassed ||
    (currentStageProgress?.contentComplete ?? false) ||
    (currentStageProgress?.overallPct ?? 0) >= 75
  )
  const stampName = READINESS[Math.min(4, Math.max(0, stageNum - 1))].stamp

  // The passport the road is filling, so the goal sits right beside the map:
  // one stamp per stage, earned as the family works through it, catch up pages
  // for earlier stages and a peek at the ones ahead. Same reading as the road.
  const STAGE_SLUGS_ARR: ProgressStageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
  const passportStamps: Stamp[] = allStagesProgress && currentStageNum
    ? STAGES.map(s => {
        const prog = allStagesProgress[STAGE_SLUGS_ARR[s.id - 1]]
        // EARNED IS PER CHILD NOW, and the check is what makes it theirs.
        // Justin, 18 August 2026: "the passport has to be per child." The
        // family's learning fills the page (lessons and scripts, shared work
        // shared credit), and THIS child passing DiGi's five question check is
        // what stamps it, which is the approved design in as many words: fill
        // the page, pass the check, earn the stamp. passedStages is already
        // read for the selected child, so a sibling's check never stamps this
        // book, and the same content can sit stamped in one child's book and
        // one check away in the other's.
        const status: StampStatus =
          prog.contentComplete && passedStages.has(s.id) ? 'earned'
          : s.id === currentStageNum ? 'current'
          : s.id < currentStageNum ? 'catchup'
          : 'upcoming'
        // A stage still ahead reads a true zero, never the blend's free credit
        // from the global streak or empty device list. Earned shows the stamp,
        // the current and catch up stages show their real reading.
        //
        // The stage the child is actually on reads the flat average of the five
        // checklist rows rather than the blend, so the ring and the rows under
        // it are the same number. A parent who adds up five rows and gets a
        // different figure from the circle above them stops trusting both.
        const sections = stageSections[s.id]
        const pct = status === 'earned' ? 100
          : status === 'upcoming' ? 0
          : s.id === currentStageNum && sections ? sections.blended
          : prog.overallPct
        return {
          id: s.id, name: s.name, ages: s.ages, pct, status,
          href: '/dashboard/lessons',
          lessonsDone: prog.lessonsDone, lessonsTotal: prog.lessonsTotal,
          scriptsPct: prog.scriptsPct, streakPct: prog.streakPct,
          devicesPct: prog.devicesPct, lessonsPct: prog.lessonsPct,
          ...(sections ? { sections: sections.sections } : {}),
        }
      })
    : []

  // THE TO DO ABOVE THE BOOK.
  //
  // Justin: "maybe a button over passport a TO DO but not time critical, maybe
  // we could have a check each month and send / provide child's app with
  // anything they need to do to keep passport on track."
  //
  // Both halves read from the SAME five rows the book prints, so the line above
  // the passport and the page inside it can never disagree. The child's half is
  // a filtered version of it, since three of the five rows are a grown up's job
  // (see lib/pathway/passport-todo.ts), and it is what the monthly sweep sends.
  //
  // The stage progress is handed over rather than re-read: the page has already
  // paid for it above and the gather is otherwise eight queries for numbers we
  // are holding.
  const currentSections = currentStageNum ? stageSections[currentStageNum]?.sections ?? [] : []
  const passportToDo = parentPassportToDo(currentSections)
  const childToDo = primaryChild
    ? await gatherChildPassportToDo(supabase, user.id, primaryChild, { progress: currentStageProgress })
    : []

  // NOVA'S ROAD, under the passport she is helping to stamp.
  //
  // Justin: "on the parents pathway every month we need an appearance of Nova
  // that says come this way for the road to social media. It needs to then only
  // be completed when they complete relevant lesson on social media and
  // children have done their necessary part."
  //
  // Only from stage 3 (eleven and up), which is where the social media lessons
  // start and where the run up to sixteen becomes a real thing rather than a
  // distant one. Below that the pathway stays calm, the same guard the
  // readiness panel has always used.
  const socialRoad = (currentStageNum ?? 0) >= 3
    ? await getSocialRoad(supabase, user.id, primaryChild?.id ?? null, currentStageNum)
    : null

  // Tailor the stage by the concern this family actually flagged, not by any
  // assumption about the child. The top open concern maps straight to the
  // stage's own action for it, so an eleven year old whose parent worries about
  // gaming and one whose parent worries about comparison get different guidance,
  // the honest version of a boy and girl pathway.
  const { data: topConcern } = await supabase
    .from('concerns').select('slug, label, status')
    .eq('user_id', user.id).or(childScope).neq('status', 'resolved')
    .order('times_flagged', { ascending: false }).limit(1).maybeSingle()
  const concernSlug = (topConcern as { slug?: string } | null)?.slug as ChallengeId | undefined
  const concernLabel = (topConcern as { label?: string } | null)?.label ?? null
  // Your focus, moved here from Home on 12 August 2026. See FocusStrip for why.
  // The label falls back to the challenge they picked at onboarding, so a family
  // who has not flagged anything yet still sees what they came in for.
  const focusImproving = (topConcern as { status?: string } | null)?.status === 'improving'
  const onboardingChallenge = (profileResult.data?.onboarding_answers as Record<string, string> | null)?.challenge ?? ''
  const focusLabel = concernLabel ?? CHALLENGE_LABELS[onboardingChallenge] ?? ''
  const kidLabel = primaryChild?.name && primaryChild.name !== 'Your child' ? primaryChild.name : 'your child'

  // The page in six doors, in the order a parent actually wants them: is this
  // working, then the passport itself, then this week, then the road, then the
  // four things, then what we are on right now.
  //
  // It used to be one long scroll with everything equally loud, so a parent
  // who came to check one thing read all of it or gave up. These are anchors
  // rather than routes: nothing moved, it can just be reached now.
  // The child's year and term, for the school chest beside the road, using the
  // same helper the learning sheet does so the two can never disagree. Null
  // before a birthday is set, which the chest handles by naming the child
  // instead of the year.
  const schoolDob = primaryChild?.date_of_birth ? new Date(primaryChild.date_of_birth) : null
  const schoolTarget = schoolDob && !Number.isNaN(schoolDob.getTime()) ? sheetTarget(schoolDob, new Date()) : null
  const schoolYearLabel = schoolTarget ? sheetLabel(schoolTarget) : null

  const SECTIONS: SectionTile[] = [
    { href: '#is-it-working', label: 'Is it working', sub: 'The honest read on where you are',
      icon: '📈', bg: 'var(--tint-sage)', accent: '#9CC3B4' },
    { href: '#passport', label: 'View passport', sub: 'One page per stage, tap to fill it',
      icon: '🛂', bg: 'var(--terracotta-lt)', accent: 'var(--terracotta)' },
    { href: '/dashboard/stats', label: `${kidLabel}'s week`, sub: 'Screen balance and what to aim for',
      icon: '⚖️', bg: 'var(--tint-blue)', accent: '#A9C8E4' },
    { href: '#the-road', label: 'The pathway to 16', sub: 'All five stages on one road',
      icon: '🗺️', bg: 'var(--stage-5)', accent: '#C4B5E8' },
    { href: '#four-things', label: `The four we build for ${kidLabel}`, sub: 'Safe, balanced, AI aware, social ready',
      icon: '🧭', bg: 'var(--stage-3)', accent: '#F0B9AE' },
    { href: '#working-on', label: 'What we are working on', sub: 'This stage, right now',
      icon: '🎯', bg: 'var(--stage-1)', accent: '#E8CE7A' },
  ]

  const tailoredAction = concernSlug && currentStageContent
    ? currentStageContent.challengeActions[concernSlug] ?? null
    : null

  return (
    <div style={{ padding: '24px 0 32px' }}>
      {/* Header.

          The passport sits IN the header now, beside the words rather than
          three screens below them. Justin's call and the right one: the
          passport is the thing this whole product is driving at, so a parent
          should meet it in the first screenful, not scroll past a road, a
          reassurance card and a set of tiles to reach it.

          Two columns on a desk, stacked on a phone, with the copy first either
          way so the passport is explained before it is handed over. */}
      {/* 720, the same column as every other section on this page.
          It was 980, the only container here that was, so on a desk the header
          started 130px further left than the six tiles and everything under
          them. Justin: "this needs to be tidier, it is all a bit out of line."
          Nothing was broken, the hero simply did not share the page's column. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto', marginBottom: '20px' }}>
        {/* The way back to Today. The loop's passport rung arrives with
            ?from=today (Justin: a page reached from the loop "needs a
            navigation back to today"), so the link renders only for a parent
            who genuinely came from somewhere. A back button to a page you were
            never on is furniture. */}
        {from && <BackTo from={from} fallback={{ href: '/dashboard#today', label: 'Today' }} />}
        <ChildSwitcher kids={children} selectedId={primaryChild?.id ?? null} basePath="/dashboard/pathway" />

        {/* YOUR FOCUS IS NOT HERE ANY MORE, AND THAT IS THE SECOND CORRECTION.
            Justin, 12 August 2026: "focus, words for tonight, can be their
            appearance on pathway, not here on home." That was read as MOVE IT
            TO THE PATHWAY PAGE, and it was corrected on 13 August: he meant it
            should take its turn in the daily ROTATION, which is what he calls
            the pathway. decisions.md records the strip being unmounted then.
            It was unmounted from Home and left rendering here, so it kept
            appearing on the road and the passport. The rotation item is live in
            lib/home/next-up.ts under key 'focus', so this surface would be the
            same sentence in a second place, which is the exact thing Justin
            caught within an hour the last time Home said one thing twice.
            The FocusStrip component and CHALLENGE_LABELS are kept, not deleted:
            Home still imports the labels. */}
        {/* THE END OF THE ROAD, WHEN IT ARRIVES.
            Justin: "when pathway is done and celebration."
            Until now the trophy at the bottom of the road lit up and that was
            the whole ceremony: no moment, no sentence, nothing anywhere in the
            app acknowledging that a family had finished a twelve year journey.
            The confetti has been fired for a lesson pass and a quest game since
            the design audit; the one thing the product is built to reach had
            none of it.
            It sits ABOVE the intro rather than down by the trophy, because on
            the day it lands it is the most important thing on the page, and
            nobody should have to scroll past the explanation of a road they
            have already walked to be told they walked it. Same reading as the
            passport, so it can never light without the five stamps being real. */}
        {allStagesEarned && <PathwayComplete childName={primaryChild?.name ?? null} />}

        <div className="pathway-hero">
          {/* The promise, folded away after the first visit.

              It used to sit here open at full height every single time: a
              2.5rem heading, a big paragraph, four bullets and two more lines,
              which on a 390 wide phone is the entire screen before the passport
              begins. Justin: "that text takes up the whole of screen so needs to
              move away, especially not each time." The words were right, the
              permanence was not. See PathwayIntro for the reasoning.

              The copy moved wholesale into that component, so main's type scale
              sweep of this block (3f9bbfe) landed on lines that no longer exist
              here. Its SIZING decisions were not lost: they are applied inside
              PathwayIntro to the same sentences. */}
          <PathwayIntro kidLabel={kidLabel} childCount={children.length} />

          {/* The passport itself, the hero of its own page at last. */}
          {passportStamps.length > 0 && (
            <div id="passport" style={{ scrollMarginTop: '84px', minWidth: 0 }}>
              {/* What is left, above the book that holds it. Closed by default,
                  sage rather than red, and it says no rush in as many words:
                  the passport moves in months and the one thing it must never
                  become is another screen shouting at a parent. */}
              <PassportToDo
                childId={primaryChild?.id ?? null}
                childName={primaryChild?.name ?? null}
                items={passportToDo}
                childItems={childToDo}
                onApp={!!kidLink?.token}
              />
              {/* Lands on the COVER, not on their stage.
                  It opened straight onto the child's own page for a while,
                  which sounded right and was not: it skips the one screen that
                  says what this object is, and drops a parent into a long
                  checklist with no sense of where it sits in the journey.
                  Justin, having lived with it: land on the cover "with option
                  to go to current stage or catch up previous stages not done".
                  So currentStage tells the book which page is theirs, and the
                  book prints that as a button under the cover instead of
                  turning there on its own. openAtStage still exists for the
                  deep link from "see your passport fill" after a lesson, where
                  something has already told the parent which page moved. */}
              <PassportBook
                stamps={passportStamps}
                childName={primaryChild?.name ?? 'your child'}
                currentStage={currentStageNum}
                childId={primaryChild?.id ?? null}
              />
              {/* Nova, directly under the book she is helping to stamp. The one
                  stretch of the pathway that only counts when the parent AND
                  the child have each walked it, so it belongs beside the
                  passport rather than three sections down with the lessons. */}
              {socialRoad && socialRoad.total > 0 && primaryChild?.id && (
                <SocialRoadNova
                  road={socialRoad}
                  childId={primaryChild.id}
                  childName={primaryChild.name ?? null}
                  onApp={!!kidLink?.token}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Six doors into a page that used to be one long equally loud scroll. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 8px' }}>
        <SectionTiles tiles={SECTIONS} />
      </div>

      {/* Reassurance before the map. The five stages can look like a lot at a
          glance, so DiGi says the one thing a parent needs to hear: you do not
          hold all of this, we do. Just do today. */}
      <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '13px',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '18px', padding: '15px 17px',
        }}>
          <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter size={28} mood="wave" />
          </span>
          <p style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
            <strong style={{ fontWeight: 800 }}>Do not worry about the whole map.</strong> We have got you. Just follow each daily task and we drive the growing up for you, all the way to 16 and beyond.
          </p>
        </div>
      </div>

      {/* THE road, the hero of the page: five big stamp nodes on one thick
          winding trail, Duolingo sized, DiGi on the current one, the sticky
          position card riding along as you scroll, live progress and the
          stage detail folded in. */}
      <div id="the-road" style={{ scrollMarginTop: '84px', padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
        <StageRoad
          currentStageNum={currentStageNum}
          progressPct={currentStageProgress?.overallPct ?? null}
          childName={primaryChild?.name ?? undefined}
          stageStatus={stageStatus}
        />
      </div>

      {/* THE WEEKLY PLANET IS GONE (14 August 2026), AND THE REVERT KEPT IT
          GONE. Justin: "if we have the rotating planet friends on today doing
          the same job, so no need for the planets the stage road." The Planet
          Friend beside the daily list does this job every single day; a second
          rotation doing it weekly on an occasional page is one too many.
          lib/pathway/planets.ts and PlanetCard are kept, not deleted: they are
          still what /dev/planets draws, and reinstating a card is a smaller
          job than reinventing one. */}

      {/* SCHOOL IS ON TODAY'S ROTATION, NOT ON THIS PAGE.
          Justin, 17 August 2026: "this not on passport page, should be plant
          friends on today on rotation."
          The chest was the right answer to the question he asked in July, which
          was whether school belonged ON the road as a gating stone. It does not,
          and it still does not. What changed is that the road stopped being the
          place these live: lib/home/next-up.ts carries school as one of the
          eleven rotation items under Today, so a parent already meets it, on a
          day chosen for them, on the page they open every morning. Keeping it
          here as well is the same offer in two places, which is the fault caught
          within the hour the last time Home said one thing twice.
          SchoolChest is kept, not deleted. It is a good component and the
          rotation card links to the same place. */}

      {/* Meet the family: DiGi and the Planet Friends the child grows up with,
          an introduction not a score. The passport it used to sit above has
          moved into the header, so this stays here with the road, which is
          where the characters are actually walking. */}
      <div style={{ padding: '0 20px', maxWidth: '560px', margin: '0 auto 28px' }}>
        <MeetTheFriends childName={primaryChild?.name ?? null} />
      </div>

      {/* The four literacy strands in plain words, each with a live reading
          from the family's real week: the jobs and screen balance, open
          worries, and lessons done per strand. Green means on track, red means
          worth a look, the same readings the rest of the app uses. */}
      <div id="four-things" style={{ scrollMarginTop: '84px' }} />
      <LiteracyAreas stageId={currentStageNum ?? 1} childName={primaryChild?.name ?? undefined} statuses={litStatuses} />

      {/* Is it working: the honest read, which used to be a page of its own at
          /dashboard/tracker. Two pages both calling themselves the passport is
          how a parent ends up unsure which one is real, so the report lives
          here now, under the tile that has always pointed at it, and the old
          URL redirects to this anchor.
          
          It sits below the passport, the road and the four strands rather than
          above them, because the question "is it working" only means something
          once you have seen what it is measuring. */}
      <div id="is-it-working" style={{ scrollMarginTop: '84px' }} />
      <IsItWorkingReport childParam={childParam} parentReport={weekReport} />

      {/* What the child themselves has been doing, which until 9 August 2026 a
          parent could not see anywhere in the app. It sits with Is it working
          because that is the question it answers from the child's side: the
          report above is what the grown up has done, this is what the child
          has. Renders nothing at all for a family whose child has no app. */}
      {primaryChild?.name && (
        <FiveADayReport
          childName={primaryChild.name}
          days={fiveADay.days}
          today={fiveADay.today}
        />
      )}

      {/* WHAT IS WORKING MOVED OUT, 13 August 2026, to its own page.

          Justin: "its own page, not part of the passport scroll." He is right,
          and the reason is that two different jobs were sharing this scroll.
          The passport is the RECORD: the journeys, the stamps, the readiness
          readings, the road to 16. What is working is the ANSWER: whether any
          of it moved. A parent asking the second question should not have to
          scroll past their own achievements to reach it, and the answer needs
          an address of its own so an email or the daily loop can send them
          straight to it rather than to a point halfway down here.

          The card that used to render here is now the whole of
          /dashboard/what-is-working, with a line per concern and nothing
          averaged. This is the doorway. */}
      <WhatIsWorkingLink />

      {/* The end of stage readiness check, DiGi's voice: as the family nears the
          end of a stage, DiGi reads where they are, names what is left, and when
          nothing is, offers the short passport quiz that earns the stamp. */}
      {nearStageEnd && currentStageContent && (
        <div style={{ marginTop: 4 }}>
          <StageReadiness
            stageId={stageNum}
            stageName={currentStageContent.name}
            stampName={stampName}
            childId={primaryChild?.id ?? null}
            childName={primaryChild?.name ?? null}
            greens={readinessGreens}
            activeAreas={activeAreas.length}
            lessonsLeft={lessonsLeft}
            ambers={readinessAmbers}
            alreadyPassed={stageQuizPassed}
            kidToken={(kidLink as { token?: string } | null)?.token ?? null}
          />
        </div>
      )}

      {/* Tailored by what this family flagged, not by the child's sex. */}
      {tailoredAction && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
          <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)', marginBottom: '5px' }}>
              For your family right now{concernLabel ? ` · ${concernLabel}` : ''}
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{tailoredAction}</p>
          </div>
        </div>
      )}

      {/* The evidence and the stance, folded into one card that opens on demand,
          so the pathway stays a next step, not a research brochure. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 24px' }}>
        {/* The anchor the weekly rotation card lands on. Without it the card
            drops a parent at the top of a long page and asks them to hunt. */}
        <div id="why-this-works" style={{ scrollMarginTop: '84px' }} />
        <PathwayEvidence />
      </div>

      {/* The journey: one spine, three strands, the single next step */}
      {journey && currentStageContent && (
        <div id="working-on" style={{ scrollMarginTop: '84px', padding: '0 20px', maxWidth: '720px', margin: '0 auto 32px' }}>
          <PathwayJourney
            journey={journey}
            childName={primaryChild?.name ?? 'your child'}
            stageName={currentStageContent.name}
            stageAges={currentStageContent.ages}
          />
        </div>
      )}

      {/* DiGi help: the pathway is never a wall. When the next step is
          unclear, DiGi reads the moments this family has flagged and talks
          through the one that matters now. This is the moments and DiGi help
          thread, in one calm card, replacing the stacked journey views that
          made the page busy. */}
      {currentStageContent && (
        <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 28px' }}>
          <Link href="/dashboard/digi" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: 'var(--deep-teal)', borderRadius: '18px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'var(--terracotta)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                <span style={{ color: '#fff', fontSize: 'var(--text-md)', lineHeight: 1 }}>◎</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: '#fff' }}>
                  Not sure of your next step?
                </div>
                <div style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.45, marginTop: '2px' }}>
                  DiGi reads the moments you have flagged and talks you through the one that matters now.
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Multiple children section */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '28px auto 0' }}>
        {children.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Your children
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {children.map(child => {
                const stageNum = child.stage_id ? stageIdToNum[child.stage_id] : null
                const stageMeta = stageNum ? STAGES.find(st => st.id === stageNum) ?? null : null
                return (
                  <Link key={child.id} href={child.is_primary ? '/dashboard/pathway' : `/dashboard/pathway?child=${child.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--cream)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px 16px', gap: '12px',
                    textDecoration: 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                      {child.name}
                    </span>
                    {stageMeta && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                        padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        Stage {stageMeta.id} · {stageMeta.name}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* The printed passport link used to be hand rolled here. It now lives
            inside PassportBook itself, so it follows the passport onto every
            page that shows one rather than only this one. */}

        {/* Add child prompt */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Multiple children? One account covers all of them.
          </p>
          <Link href="/dashboard/settings" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)',
            textDecoration: 'underline', letterSpacing: '0.04em',
          }}>
            Manage children →
          </Link>
        </div>

        {!isPaid && (
          <div style={{
            marginTop: '24px',
            border: '2px solid var(--stage-5)', borderRadius: '16px',
            padding: '20px 22px', background: 'var(--stage-5)',
          }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate</p>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>Unlock all 5 stages for £7.99 / month</h3>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px' }}>
              All scripts, unlimited DiGi, wellbeing tracker. First 50 members only.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
              Claim founder rate
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
