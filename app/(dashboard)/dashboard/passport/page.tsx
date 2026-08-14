import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import { pickChild } from '@/lib/children/select'
import BackTo from '@/components/nav/BackTo'
import PassportTabs, { readTab, tabTheme } from '@/components/passport/PassportTabs'
import SectionTiles from '@/components/ui/SectionTiles'

import PassportBook from '@/components/pathway/PassportBook'
import PassportToDo from '@/components/pathway/PassportToDo'
import SocialRoadNova from '@/components/pathway/SocialRoadNova'
import StageReadiness from '@/components/pathway/StageReadiness'
import IsItWorkingReport from '@/components/pathway/IsItWorkingReport'
import FiveADayReport from '@/components/pathway/FiveADayReport'
import WhatIsWorkingLink from '@/components/working/WhatIsWorkingLink'
import LiteracyAreas from '@/components/pathway/LiteracyAreas'
import ShopPanel from '@/components/shop/ShopPanel'

import { STAGES } from '@/lib/content/stages'
import { READINESS } from '@/lib/content/readiness'
import { type Stamp, type StampStatus } from '@/components/pathway/PassportStamps'
import { getAllStagesProgress, getStageProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import { buildPassportSections } from '@/lib/pathway/passport-sections'
import { getWeekParentReport } from '@/lib/balance/week-report'
import { getFiveADayReport } from '@/lib/kid/day-report'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { parentPassportToDo } from '@/lib/pathway/passport-todo'
import { gatherChildPassportToDo } from '@/lib/pathway/passport-todo-gather'
import { getSocialRoad } from '@/lib/pathway/social-road'

// ═══ THE PASSPORT, ON ITS OWN PAGE, AND THE PAGE IS TABS ═══════════════════
//
// Justin, 13 August 2026: "this needs to be the only thing on the passport page
// so they can access everything from nice tidy tabs starting with passport,
// looking really pretty using pastel colours. Each section grouped in buttons
// like we did before on home, as its a mess and a long scroll."
//
// Until today there was no /dashboard/passport at all. The book, the report,
// the four strands and the shop were four sections of one 656 line pathway
// scroll, under a heading that said Passport, on a route that said pathway.
// The tab bar and the side nav both pointed there and both called it Passport.
//
// So: the passport material moved here, the pathway page kept the road, and
// nothing above the tab bar competes with the tabs. No hero, no preamble. The
// child switcher is the one exception and it is not a section, it is which
// child every tab is about.
//
// ── WHY THE TAB IS IN THE URL ──────────────────────────────────────────────
//
// Each tab loads ONLY its own queries. The scroll this replaces paid for the
// whole page every time: roughly twenty round trips to show a parent one book.
// Opening the passport now costs the passport's queries and nothing else, and
// the shop, which is the heaviest of the four, costs nothing at all unless
// somebody goes shopping.
//
// It also means the daily list, an email and a Stripe return can each name a
// tab, rather than land on the cover and hope.

export const metadata = { title: 'Passport · Guided Childhood' }

type Child = {
  id: string; name: string; age_band: string | null; stage_id: string | null
  is_primary: boolean; streak_weeks: number | null
}

const STAGE_SLUGS: ProgressStageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
const STAGE_ID_TO_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

export default async function PassportPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; child?: string; ordered?: string; cancelled?: string; from?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { tab: tabParam, child: childParam, ordered, cancelled, from } = await searchParams
  const tab = readTab(tabParam)
  const theme = tabTheme(tab)

  const { data: childRows } = await supabase
    .from('children')
    .select('id, name, age_band, stage_id, is_primary, streak_weeks')
    .eq('parent_id', user.id)
    .order('is_primary', { ascending: false })

  const children = (childRows ?? []) as Child[]
  const child = pickChild(children, childParam)
  const stageNum = child?.stage_id ? STAGE_ID_TO_NUM[child.stage_id] ?? null : null
  const kidLabel = child?.name && child.name !== 'Your child' ? child.name : 'your child'

  return (
    <div style={{ padding: '10px 0 32px' }}>
      {/* THE WAY BACK TO TODAY.
          main added ?from=today to the passport rung on the daily loop the same
          afternoon this page was built, on Justin's note that a page reached
          from the loop "needs a navigation back to today". The rung now lands
          here rather than on the road, so the back link has to be here or that
          change silently does nothing on the one page it was aimed at.
          Only when they arrived from somewhere: no origin, no link, because a
          back button to a page you were never on is furniture. */}
      {from && (
        <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto' }}>
          <BackTo from={from} fallback={{ href: '/dashboard#today', label: 'Today' }} />
        </div>
      )}
      {children.length > 1 && (
        <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto' }}>
          <ChildSwitcher kids={children} selectedId={child?.id ?? null} basePath={`/dashboard/passport?tab=${tab}${from ? `&from=${encodeURIComponent(from)}` : ''}`} />
        </div>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <PassportTabs active={tab} childParam={childParam} from={from} />
      </div>

      {/* The panel takes the tab's own whisper tint, which is the strongest
          signal of which tab you are on: the colour under the whole screen
          changes, not just a pill at the top. */}
      <div style={{
        background: theme.tint,
        borderTop: `2px solid ${theme.bold}`,
        minHeight: '60vh',
        paddingTop: 18,
      }}>
        {tab === 'passport' && <PassportPanel supabase={supabase} userId={user.id} child={child} stageNum={stageNum} kidLabel={kidLabel} />}
        {tab === 'working' && <WorkingPanel supabase={supabase} userId={user.id} child={child} childParam={childParam} kidLabel={kidLabel} />}
        {tab === 'four' && <FourPanel supabase={supabase} userId={user.id} stageNum={stageNum} childName={child?.name ?? null} />}
        {tab === 'shop' && <ShopPanel ordered={ordered} cancelled={cancelled} />}
      </div>
    </div>
  )
}

type SB = Awaited<ReturnType<typeof createClient>>

// ═══ TAB ONE: THE PASSPORT ITSELF ══════════════════════════════════════════
//
// The book, what is left to fill it, Nova's stretch of road and the end of
// stage check. Everything here is about the booklet: what is in it, what is
// missing, and what earns the next stamp.

async function PassportPanel({
  supabase, userId, child, stageNum, kidLabel,
}: {
  supabase: SB; userId: string; child: Child | null; stageNum: number | null; kidLabel: string
}) {
  if (!child?.stage_id || !stageNum) {
    return (
      <Empty
        title="Add your child to start the passport"
        line="The passport is one page per stage, stamped as you go. It needs a child and their age before it has anything to print."
        href="/dashboard/settings"
        cta="Add your child"
      />
    )
  }

  const [allStagesProgress, currentStageProgress, openMomentsRes, solvedMomentsRes, weekReport, kidLinkRes, passedStages] =
    await Promise.all([
      getAllStagesProgress(supabase, userId, child.streak_weeks ?? 0),
      getStageProgress(supabase, userId, child.stage_id as ProgressStageId, child.streak_weeks ?? 0),
      supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', userId).in('status', ['open', 'improving']),
      supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'resolved'),
      getWeekParentReport(supabase, userId, child),
      supabase.from('kid_links').select('token').eq('child_id', child.id).maybeSingle(),
      getPassedStageQuizzes(supabase, userId, child.id),
    ])

  const stageSections = await buildPassportSections(
    supabase, userId, child, allStagesProgress, stageNum,
    {
      openMoments: openMomentsRes.count ?? 0,
      solvedMoments: solvedMomentsRes.count ?? 0,
      parentReport: weekReport,
    },
  )

  // The five stamps. Same reading as the road on the pathway page, because it
  // comes from the same helper: a page that quoted a different number from the
  // road it is meant to be filling would be worse than no number at all.
  const stamps: Stamp[] = STAGES.map(s => {
    const prog = allStagesProgress[STAGE_SLUGS[s.id - 1]]
    const status: StampStatus =
      prog.contentComplete ? 'earned'
      : s.id === stageNum ? 'current'
      : s.id < stageNum ? 'catchup'
      : 'upcoming'
    // A stage still ahead reads a true zero, never the blend's free credit from
    // the global streak. The stage the child is actually on reads the flat
    // average of its five checklist rows rather than the blend, so the ring and
    // the rows under it are the same number.
    const sections = stageSections[s.id]
    const pct = status === 'earned' ? 100
      : status === 'upcoming' ? 0
      : s.id === stageNum && sections ? sections.blended
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

  const currentSections = stageSections[stageNum]?.sections ?? []
  const parentToDo = parentPassportToDo(currentSections)
  const childToDo = await gatherChildPassportToDo(supabase, userId, child, { progress: currentStageProgress })
  const kidToken = (kidLinkRes.data as { token?: string } | null)?.token ?? null

  // Nova's road, only from stage 3, which is where the social media lessons
  // start. Below that the passport stays calm, the same guard the readiness
  // panel has always used.
  const socialRoad = stageNum >= 3
    ? await getSocialRoad(supabase, userId, child.id, stageNum)
    : null

  // The end of stage check appears as a family nears the end: content finished,
  // the blend past three quarters, or the stamp already earned so it can show.
  const stageQuizPassed = passedStages.has(stageNum)
  const litStatuses = await getLiteracyStatuses(supabase, userId, stageNum)
  const nearStageEnd = stageQuizPassed
    || (currentStageProgress?.contentComplete ?? false)
    || (currentStageProgress?.overallPct ?? 0) >= 75

  const stageContent = STAGES.find(s => s.id === stageNum) ?? null
  const READINESS_AREAS = [
    { key: 'safe', name: 'Safe online', startStage: 1 },
    { key: 'balance', name: 'Healthy balance', startStage: 1 },
    { key: 'ai', name: 'AI and chatbots', startStage: 3 },
    { key: 'social', name: 'Social media ready', startStage: 3 },
  ] as const
  const activeAreas = READINESS_AREAS.filter(a => stageNum >= a.startStage)
  const ambers = activeAreas
    .filter(a => (litStatuses[a.key]?.tone ?? 'green') !== 'green')
    .map(a => ({
      name: a.name,
      improve: litStatuses[a.key]?.improve ?? 'Do the next step',
      href: litStatuses[a.key]?.href ?? '/dashboard/lessons',
    }))
  const lessonsLeft = Math.max(0, (currentStageProgress?.lessonsTotal ?? 0) - (currentStageProgress?.lessonsDone ?? 0))

  return (
    <>
      <Column>
        {/* What is left, above the book that holds it. Closed by default, sage
            rather than red, and it says no rush in as many words. */}
        <PassportToDo
          childId={child.id}
          childName={child.name}
          items={parentToDo}
          childItems={childToDo}
          onApp={!!kidToken}
        />
        {/* Lands on the COVER, not on their stage, which is Justin's own call
            after living with the alternative. The cover was never the problem;
            being the only door was, and the tab bar above is the second door.
            currentStage tells the book which page is theirs so it can print
            that as a button under the cover rather than turning there itself. */}
        <PassportBook stamps={stamps} childName={child.name ?? 'your child'} currentStage={stageNum} />

        {/* Nova, directly under the book she is helping to stamp. The one
            stretch of the pathway that only counts when the parent AND the
            child have each walked it. */}
        {socialRoad && socialRoad.total > 0 && (
          <SocialRoadNova road={socialRoad} childId={child.id} childName={child.name ?? null} onApp={!!kidToken} />
        )}
      </Column>

      {nearStageEnd && stageContent && (
        <StageReadiness
          stageId={stageNum}
          stageName={stageContent.name}
          stampName={READINESS[Math.min(4, Math.max(0, stageNum - 1))].stamp}
          childId={child.id}
          childName={child.name ?? null}
          greens={activeAreas.length - ambers.length}
          activeAreas={activeAreas.length}
          lessonsLeft={lessonsLeft}
          ambers={ambers}
          alreadyPassed={stageQuizPassed}
          kidToken={kidToken}
        />
      )}

      {/* The buttons, at the bottom rather than the top. Justin asked for the
          sections grouped in buttons the way Home groups them, and Home's are
          a door to what is NOT on the screen. Putting them above the book
          would put a menu in front of the one object this tab exists to show. */}
      <Column>
        <SectionTiles
          tiles={[
            { href: '/dashboard/passport?tab=shop', label: 'Print the passport', sub: 'Their real one, posted as a booklet', icon: '📮', bg: 'var(--stage-4-bold)', accent: 'var(--pastel-pink-deep)' },
            { href: '/dashboard/lessons', label: 'Fill the next page', sub: `The lessons that stamp ${kidLabel}'s stage`, icon: '📖', bg: 'var(--stage-1-bold)', accent: 'var(--terracotta)' },
            { href: '/dashboard/road', label: 'The road to sixteen', sub: 'All five stages on one road', icon: '🗺️', bg: 'var(--stage-2-bold)', accent: '#A9C8E4' },
            { href: '/dashboard/passport?tab=working', label: 'Is it working', sub: 'The honest read on where you are', icon: '📈', bg: 'var(--tint-sage)', accent: '#9CC3B4' },
          ]}
        />
      </Column>
    </>
  )
}

// ═══ TAB TWO: IS IT WORKING ════════════════════════════════════════════════
//
// The what is working dashboard, off the pathway scroll in the same pass that
// moved the passport, because both were emptying the same file and doing them
// one at a time meant the second rewrote the first.
//
// Three readings, in the order the question is actually asked: what the grown
// up has done, what the child has done, and how far the whole family has come.

async function WorkingPanel({
  supabase, userId, child, childParam, kidLabel,
}: {
  supabase: SB; userId: string; child: Child | null; childParam?: string; kidLabel: string
}) {
  const [weekReport, fiveADay] = await Promise.all([
    getWeekParentReport(supabase, userId, child),
    getFiveADayReport(supabase, child?.id ?? null),
  ])

  return (
    <>
      <IsItWorkingReport childParam={childParam} parentReport={weekReport} />

      {/* What the child themselves has been doing, which until 9 August 2026 a
          parent could not see anywhere in the app. Renders nothing at all for a
          family whose child has no app. */}
      {child?.name && (
        <FiveADayReport childName={child.name} days={fiveADay.days} today={fiveADay.today} />
      )}

      {/* WHAT IS WORKING IS ITS OWN PAGE, AND THAT IS SOMEBODY ELSE'S CALL.

          HowFarYouHaveCome used to render here. While this branch was building
          the tabs, another session shipped /dashboard/what-is-working: a line
          per concern read from the append only event log, nothing averaged,
          with the reasoning for the composite ban written into
          lib/working/movement.ts. That is a better home for it than a block on
          a tab, and it is already merged, so this defers to it rather than
          keeping a second copy alive.

          What stays on this tab is the WEEK: the report above and the child's
          own five a day below. What leaves is MOVEMENT OVER TIME, which now has
          an address an email can point at. This is the doorway, and it carries
          the best true sentence rather than a label, so it is a reason to tap
          rather than a navigation item. It renders nothing at all until there
          is something honest to say. */}
      <Column>
        <WhatIsWorkingLink from="passport" />
      </Column>

      <Column>
        <SectionTiles
          tiles={[
            { href: '/dashboard/stats', label: `${kidLabel}'s week`, sub: 'Screen balance and what to aim for', icon: '⚖️', bg: 'var(--stage-2-bold)', accent: '#A9C8E4' },
            { href: '/dashboard/checkin', label: 'Check in', sub: 'How the worries are going, in two minutes', icon: '🩺', bg: 'var(--tint-sage)', accent: '#9CC3B4' },
            { href: '/dashboard/passport?tab=four', label: 'The four things', sub: 'Safe, balanced, AI aware, social ready', icon: '🧭', bg: 'var(--stage-3-bold)', accent: '#F0B9AE' },
            { href: '/dashboard/passport', label: 'Back to the passport', sub: 'One page per stage, tap to fill it', icon: '🛂', bg: 'var(--stage-1-bold)', accent: 'var(--terracotta)' },
          ]}
        />
      </Column>
    </>
  )
}

// ═══ TAB THREE: THE FOUR THINGS ════════════════════════════════════════════
//
// The four literacy strands in plain words, each with a live reading from the
// family's real week. They are on the passport rather than the road because
// they are what the stamp is FOR: green in all four is what being ready for the
// next stage actually means.

async function FourPanel({
  supabase, userId, stageNum, childName,
}: {
  supabase: SB; userId: string; stageNum: number | null; childName: string | null
}) {
  const statuses = await getLiteracyStatuses(supabase, userId, stageNum ?? 1)

  return (
    <>
      <LiteracyAreas stageId={stageNum ?? 1} childName={childName ?? undefined} statuses={statuses} />

      <Column>
        <SectionTiles
          tiles={[
            { href: '/dashboard/lessons', label: 'Lessons', sub: 'The three minute ones that move each strand', icon: '📖', bg: 'var(--stage-1-bold)', accent: 'var(--terracotta)' },
            { href: '/dashboard/devices', label: 'Devices', sub: 'Filters and limits, step by step', icon: '📱', bg: 'var(--stage-2-bold)', accent: '#A9C8E4' },
            { href: '/dashboard/scripts', label: 'Scripts', sub: 'The words for the hard moment', icon: '💬', bg: 'var(--stage-5-bold)', accent: '#C4B5E8' },
            { href: '/dashboard/passport', label: 'Back to the passport', sub: 'One page per stage, tap to fill it', icon: '🛂', bg: 'var(--stage-3-bold)', accent: '#F0B9AE' },
          ]}
        />
      </Column>
    </>
  )
}

// ── SHARED FURNITURE ────────────────────────────────────────────────────────

function Column({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto' }}>{children}</div>
}

function Empty({ title, line, href, cta }: { title: string; line: string; href: string; cta: string }) {
  return (
    <Column>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
        boxShadow: '0 3px 0 rgba(26,26,46,0.05)', padding: '22px 20px', textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }}>
          {title}
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>{line}</p>
        <a href={href} className="btn btn-gold" style={{ display: 'inline-flex' }}>{cta}</a>
      </div>
    </Column>
  )
}
