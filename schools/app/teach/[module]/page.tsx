import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import TrackedPlayer from '@/components/tracker/TrackedPlayer'
import { parseSlides, type LessonCycle, type LessonTool } from '@gc/shared/lesson-slides'
import { WALL } from '@gc/shared/wall-scale'
import { isStandaloneModule, isTasterModule, standaloneTitle } from '@/lib/taster'
import { currentAccess } from '@/lib/licence'
import { pilotModulesFor } from '@/lib/pilot'
import PilotStrip from '@/components/PilotStrip'
import { TasterStrip } from '@/app/taster/TasterBar'
import { characterKeyFor, registerFor } from '@gc/shared/friend-register'
import type { PassportPlacement } from '@gc/shared/passport-stages'
import { CURRICULUM as MODULE_MANIFEST, positionLabel } from '@gc/shared/schools-curriculum'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title ?? standaloneTitle(moduleId)
  return { title: title ? `Teach: ${title}` : 'Teach: Module' }
}

// The teach route: any live module, played full screen for the classroom.
//
// PROJECTOR, NOT teacherView ALONE. This route said "full screen for the
// classroom" in this comment while passing teacherView and wrapping the
// player in a 720px column, so `projector` was false and every projector
// aware size fell to the phone branch. That was fixed, and it turned out to
// be half the story: the projector branch itself was sized for a laptop.
// Body, options and diagram steps rendered at 18 to 24px where ISO 9241-303
// puts the back of a classroom at about 50px on a 1920 canvas, and three
// slide types had no projector branch at all. See shared/wall-scale.ts.
//
// The column that used to be 1180px went with them. On a 1920 wall that is
// 61 percent of the width, so 40px text wrapped into a narrow ribbon down
// the middle. It now tracks the wall scale, which keeps the line length at
// about seventy characters where it is comfortable rather than where it
// happens to land.
//
// The `projector` prop exists separately from `classMode` because
// classMode also swaps the finish for the family showcase that sells the
// schools tier, which a school standing inside that tier should never see.
// Behind the school code (proxy.ts). Teacher script panel available on every
// slide. The player gets completeEndpoint null because this app has no API
// surface and a code tells us the school, never the teacher, so there is
// nobody to record a completion against. That changes when the staffroom
// lands and a lesson is played inside a delivery.

export const revalidate = 3600

type SchoolLesson = {
  id: string
  module_id: string
  title: string
  key_stage: string
  year_band: string
  single_action_outcome: string
  character_cast: string | null
  slides: unknown
  // The named cycles (migration 268). The player derives which slide sits in
  // which cycle from the minutes, so nothing here needs tagging by hand.
  // The tool goes down too (migration 290): a choice slide whose options name
  // "check one" needs the checks on the wall beside them, and the player has
  // no other route to it.
  teacher_notes: { cycles?: LessonCycle[]; tool?: LessonTool; passport_stage?: PassportPlacement } | null
  // The static home code (migration 230) printed on the parent note.
  home_code?: string | null
}

export default async function TeachLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>
  searchParams: Promise<{ slide?: string }>
}) {
  const { module: moduleId } = await params
  const { slide: slideParam } = await searchParams

  const { data } = await supabase
    .from('school_lessons')
    .select('id, module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes, home_code')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as SchoolLesson | null
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides)
  if (!slides) notFound()

  const access = await currentAccess()
  const showTaster = isTasterModule(moduleId) && !access
  const showPilot = access?.tier === 'pilot' && pilotModulesFor(access.phase).includes(moduleId)

  // ?slide=N (1 based, from the run sheet) opens the player at that slide, so
  // a teacher can step out mid lesson and step back in where they were. A
  // value off either end clamps rather than 404s: the run sheet may be a
  // print out from last term while the deck has since grown or shrunk.
  const requested = Number(slideParam)
  const initialIndex = Number.isFinite(requested) && requested >= 1
    ? Math.min(Math.round(requested) - 1, slides.length - 1)
    : 0

  // The first line of the first slide, said from the manifest. Key stage, year
  // band, and the lesson's position in its own key stage, which is the number
  // the map, the tracker and the passport now all agree on. The row's own
  // eyebrow is not used on a school lesson: four of the twenty five carried a
  // build number as though it were a position, and nineteen carried nothing.
  const entry = MODULE_MANIFEST.find(m => m.moduleId === moduleId)
  const introEyebrow = entry
    ? `${entry.keyStage} · ${entry.yearBand} · Lesson ${positionLabel(moduleId)}`
    : undefined

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: WALL.wide, margin: '0 auto', padding: '28px clamp(20px, 4vw, 56px) 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: WALL.aside, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          marginBottom: '8px',
        }}>
          {lesson.key_stage} · {lesson.year_band}{lesson.character_cast ? ` · ${lesson.character_cast}` : ''}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
          fontSize: WALL.display, letterSpacing: '-0.01em', lineHeight: 1.2,
          marginBottom: '20px',
        }}>
          {lesson.title}
        </h1>
      </div>
      <div style={{ maxWidth: WALL.wide, margin: '0 auto', padding: '0 clamp(20px, 4vw, 56px) 80px' }}>
        {/* A line, not the form. This is the page the whole taster is trying
            to get a teacher to, so putting a lead capture on top of it would
            wreck the one thing they came to see. The form is on the prep page
            they arrived through, and on the pack at the end. */}
        {showTaster && <TasterStrip />}
        {showPilot && <PilotStrip compact />}
        {/* The player, wrapped so the two signals a classroom actually gives
            off are recorded: the board is ready the moment this route opens,
            and you taught it when the deck reaches its finish. */}
        {/* The first line of the first slide, said from the manifest rather
            than from the deck: key stage, year band, and where this lesson
            sits in its own key stage. Four decks carried a stale build number
            here and nineteen carried nothing at all. */}
        <TrackedPlayer
          introEyebrow={introEyebrow}
          moduleId={lesson.module_id}
          lessonId={lesson.id}
          lessonSource="school_lesson"
          slides={slides}
          backHref={isStandaloneModule(moduleId) ? `/lesson/${moduleId}` : '/curriculum'}
          teacherView
          projector
          completeEndpoint={null}
          initialIndex={initialIndex}
          cycles={lesson.teacher_notes?.cycles}
          tool={lesson.teacher_notes?.tool}
          // The friend who hosts this lesson and how it moves, both read off
          // the row: the cast line names the friend, the key stage sets the
          // register. One source, so the header, the beats and the accent
          // cannot disagree with what the wall says at the top of the page.
          character={characterKeyFor(lesson.character_cast)}
          register={registerFor(lesson.key_stage)}
          // The page this lesson fills (migration 277) and the home code that
          // carries it home, so the Completed screen ends on the passport.
          passport={{ placement: lesson.teacher_notes?.passport_stage ?? null, moduleId: lesson.module_id, homeCode: lesson.home_code ?? null }}
        />
      </div>
    </main>
  )
}
