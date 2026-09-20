import { db as supabase } from '@/lib/supabase/server-db'
import { quizQuestions, type QuizBank } from '@/lib/quiz'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { parseSlides, PHASE_LABELS, PHASE_ORDER, type LessonPhase, type VideoSlide } from '@gc/shared/lesson-slides'
import { EFCW_STRANDS } from '@gc/shared/efcw'
import { PASSPORT_STAGES, PLACEMENT_BY_KEY_STAGE } from '@gc/shared/passport-stages'
import { AREAS, areaOf } from '@gc/shared/passport-areas'
import PassportPage from '@gc/shared/components/PassportPage'
import { isTasterModule } from '@/lib/taster'
import { currentAccess } from '@/lib/licence'
import { pilotModulesFor } from '@/lib/pilot'
import PilotStrip from '@/components/PilotStrip'
import TrackerPanel from '@/components/tracker/TrackerPanel'
import { LessonOpened } from '@/components/tracker/signals'
import { LeadLine } from '@/components/YourSchoolLead'
import { asList } from '@/lib/notes'
import { neighbours, shapeOf } from '@/lib/tracker'
import TasterBar from '@/app/taster/TasterBar'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// THE LESSON HOME PAGE, the page a teacher opens the night before.
//
// Everything on it was already written and already in the database. None of
// it was reaching anybody: the objective, the three misconceptions, the
// differentiation and the timing were only ever visible inside the print
// pack, which a teacher has to know to go looking for. So the lesson looked
// like a slideshow with nothing around it, and the complaint that it was
// "just our own slides" was fair even though the substance was there.
//
// This page is assembly, not new writing. One route, one read, one button.
// The button is the whole point: everything above it is what a teacher needs
// to decide and to prepare, and the moment they have decided there is
// exactly one thing to press.

export const revalidate = 3600

type Keyword = { word: string; definition: string }
// One named cycle. Common Sense publishes this shape on every lesson (a verb,
// a title and a runtime) and Oak specifies it without publishing it, so the
// borrow is theirs and the wording is ours. Migration 268.
type Cycle = { verb: string; title: string; outcome: string; minutes: number }
type TeacherNotes = {
  learning_objective?: string
  timing?: string
  keywords?: Keyword[]
  misconceptions?: string[]
  // The Oak and Common Sense contract, added on all 21 modules by migration
  // 268. See research/2026-09-07-oak-and-common-sense-source-mining.md.
  essential_question?: string
  cycles?: Cycle[]
  // Lists, read through asList: a row that carries prose here renders it as
  // one entry rather than taking the page down (20 September 2026).
  prior_knowledge?: string[] | string
  key_learning_points?: string[] | string
  teacher_tip?: string
  equipment?: string
  // The two quiz banks (migration 269). Only their presence is read here;
  // the sheets themselves render in /print/[module]/starter-quiz and
  // /print/[module]/exit-quiz, so a module without a bank offers no button.
  starter_quiz?: QuizBank
  exit_quiz?: QuizBank
  // Presence only again: the pupil booklet is built from these, and a module
  // without them would hand out a booklet with no casework in it.
  worksheet_items?: unknown[]
  differentiation?: { support?: string; stretch?: string }
  // The graduated approach, per module: SEND and EAL adaptations written
  // from the module's own activities, never a generic checklist.
  send?: { communication?: string; attention?: string; sensory?: string; eal?: string }
  paper_fallback?: string
  tool?: { heading?: string; lines?: string[]; strapline?: string }
  // The three "I can" statements the child colours on the learning record.
  i_can?: string[] | string
  // The four fields the coverage audit of 8 September found missing, added by
  // migration 273. Together they are the difference between a lesson plan and
  // a teacher who understands the subject: what to know BEFORE teaching, what
  // to say when a pupil or a parent asks the hard one, and where each claim
  // actually comes from. Optional on the type because 273 is a pilot on
  // ks3-14 and the other twenty follow once the pattern is proven in use.
  subject_knowledge?: { heading: string; body: string }[]
  hard_questions?: { question: string; answer: string }[]
  parent_questions?: { question: string; answer: string }[]
  // `status` is the point of this one: `verified` has been checked, `verify`
  // still has to pass the citation verifier before it goes anywhere public,
  // and `mechanism` is a claim that needs no figure because the mechanism
  // carries it. A field that mixed checked and unchecked claims silently
  // would be worse than the single evidence_anchor string it replaces.
  evidence_base?: { claim: string; source: string; status: 'verified' | 'verify' | 'mechanism' }[]
}
type ParentNote = { taught?: string; try_this?: string; family_question?: string }
type DslNote = { required?: boolean; note?: string }

type Lesson = {
  module_id: string
  title: string
  key_stage: string
  year_band: string
  single_action_outcome: string
  character_cast: string | null
  slides: unknown
  teacher_notes: TeacherNotes | null
  parent_note: ParentNote | null
  dsl_note: DslNote | null
  efcw_strands: number[] | null
  statutory_hooks: string[] | null
  evidence_anchor: string | null
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
  color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '10px',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
  color: 'var(--ink-soft)', lineHeight: 1.65,
}
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
  padding: '22px 24px', boxShadow: '0 1px 2px rgba(46,40,24,0.05)',
}
// Every secondary button in the prep row. It was five identical inline copies,
// which is how the row quietly drifted: the two routes that existed in the
// print room and nowhere else were never added here because adding one meant
// pasting the block again.
const prepBtn: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
  padding: '15px 26px', borderRadius: 'var(--radius-btn)', textDecoration: 'none',
  color: 'var(--ink)', background: '#fff', border: '1px solid var(--border)',
  boxShadow: '0 5px 0 var(--border)',
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const { data } = await supabase
    .from('school_lessons').select('title').eq('module_id', moduleId).maybeSingle()
  return { title: (data as { title: string } | null)?.title ?? 'Lesson' }
}

export default async function LessonHomePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes, parent_note, dsl_note, efcw_strands, statutory_hooks, evidence_anchor')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const notes = lesson.teacher_notes ?? {}
  // The page and the area, from the row's key stage (the rule migration 277 wrote).
  const placement = PLACEMENT_BY_KEY_STAGE[lesson.key_stage] ?? null
  const area = areaOf(lesson.module_id)
  // The sales bar, and only for somebody who is not already paying for this.
  // isTasterModule first so the cookie is never read on the other twenty two,
  // which are gated anyway and would be paying a crypto verify for nothing.
  const access = isTasterModule(moduleId) ? await currentAccess() : await currentAccess()
  const showTaster = isTasterModule(moduleId) && !access
  // The pilot strip: a pilot school on one of its two lessons.
  const showPilot = access?.tier === 'pilot' && pilotModulesFor(access.phase).includes(moduleId)
  const parent = lesson.parent_note ?? {}
  const dsl = lesson.dsl_note ?? {}

  // The shape, counted from the slides themselves rather than asserted, so
  // this page can never promise a lesson a different lesson turns out to be.
  const phases = PHASE_ORDER
    .map(p => ({
      phase: p,
      count: slides.filter(s => s.phase === p).length,
      minutes: slides.filter(s => s.phase === p).reduce((t, s) => t + (s.minutes ?? 0), 0),
    }))
    .filter(p => p.count > 0)
  const totalMinutes = slides.reduce((t, s) => t + (s.minutes ?? 0), 0)
  const interactives = slides.filter(s => s.type === 'interactive').length

  // Every video beat in the deck with its words, for the access card below.
  const videoBeats = slides.filter(s => s.type === 'video') as VideoSlide[]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        <Link href="/curriculum" style={{ ...mono, textDecoration: 'none', color: 'var(--terracotta-dark)' }}>
          ← The curriculum map
        </Link>

        <div style={{ ...mono, marginTop: '18px' }}>
          {lesson.key_stage} · {lesson.year_band}
          {lesson.character_cast ? ` · ${lesson.character_cast}` : ''}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          ...PAGE.page, color: 'var(--ink)',
          margin: 'var(--space-2) 0 var(--space-3)',
        }}>
          {lesson.title}
        </h1>

        {/* The essential question, borrowed from Common Sense, who put a
            question a pupil would actually ask above the objective a teacher
            would write. It is the door into the room; the outcome below is
            what the child carries back out of it. */}
        {notes.essential_question && (
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            ...PAGE.lead, color: 'var(--ink)',
            margin: '0 0 var(--space-3)',
          }}>
            {notes.essential_question}
          </p>
        )}

        {/* What changes for a child. Oak's "why this, why now", in one line,
            and it is the only thing on this page that decides whether a
            teacher gives up an afternoon for it. */}
        <p style={{
          fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 600,
          fontSize: 'var(--text-lg)', color: 'var(--terracotta-dark)', lineHeight: 1.5,
          marginBottom: '22px',
        }}>
          &ldquo;{lesson.single_action_outcome}&rdquo;
        </p>

        {/* The button, high on the page. A teacher who already knows this
            lesson should not have to scroll past the prep to start it. */}
        {/* A grid, not a wrapped row: on a phone eight pills of eight widths
            read as a mess, and two tidy columns read as a menu (the schools
            review, 13 September 2026). Teach spans the row on its own. */}
        {/* OPENING THIS PAGE IS THE SIGNAL. Reading the lesson is what this
            page is for, and looking at it is exactly what the NEXT lesson's
            starter recalls, so one component writes both. Renders nothing. */}
        <LessonOpened moduleId={lesson.module_id} {...neighbours(lesson.module_id)} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-3)', marginBottom: '14px' }}>
          <Link href={`/teach/${lesson.module_id}`} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px', gridColumn: '1 / -1' }}>
            Teach this lesson
          </Link>
          <Link href={`/print/${lesson.module_id}`} className="btn" style={prepBtn}>
            Print the pack
          </Link>
          <Link href={`/lesson/${lesson.module_id}/run`} className="btn" style={prepBtn}>
            Walk me through it
          </Link>
          {/* Only offered where the three statements have been written, so a
              module that is not ready cannot hand out a blank sheet. */}
          {asList(notes.i_can).length > 0 && (
            <Link href={`/print/${lesson.module_id}/record`} className="btn" style={prepBtn}>
              Print the learning record
            </Link>
          )}
          {/* Oak's two quizzes. Offered only where the banks exist, and each
              one opens on its question version with the answer version one
              tap away (migration 269). */}
          {quizQuestions(notes.starter_quiz).length > 0 && (
            <Link href={`/print/${lesson.module_id}/starter-quiz`} className="btn" style={prepBtn}>
              Starter quiz
            </Link>
          )}
          {quizQuestions(notes.exit_quiz).length > 0 && (
            <Link href={`/print/${lesson.module_id}/exit-quiz`} className="btn" style={prepBtn}>
              Exit quiz
            </Link>
          )}
          {/* The two that existed in the print room and were reachable from
              nowhere else. A teacher preparing this lesson is exactly who
              wants them, and /print is a list of 23 modules to hunt through. */}
          {(notes.worksheet_items?.length ?? 0) > 0 && (
            <Link href={`/print/${lesson.module_id}/booklet`} className="btn" style={prepBtn}>
              Pupil booklet
            </Link>
          )}
          <Link href={`/print/${lesson.module_id}/organiser`} className="btn" style={prepBtn}>
            Knowledge organiser
          </Link>
        </div>
        <p style={{ ...mono, marginBottom: '30px' }}>
          {totalMinutes} minutes · {slides.length} slides
          {interactives > 0 ? ` · ${interactives} interactive` : ''}
        </p>

        {/* The shape of the lesson */}
        <div style={{ ...card, marginBottom: '16px' }}>
          <h2 style={h2}>How the lesson runs</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '12px' }}>
            {phases.map(p => (
              <span key={p.phase} style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '6px 12px', borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border)', color: 'var(--ink-soft)',
              }}>
                {PHASE_LABELS[p.phase as LessonPhase]}{p.minutes ? ` · ${p.minutes} min` : ''}
              </span>
            ))}
          </div>
          {notes.timing && <p style={body}>{notes.timing}</p>}
          {notes.learning_objective && (
            <p style={{ ...body, marginTop: '10px' }}>
              <strong style={{ color: 'var(--ink)' }}>Objective. </strong>
              {notes.learning_objective}
            </p>
          )}

          {/* The cycle map. The minutes here are the same minutes the timing
              line above already states, so the two can never disagree: the
              migration that wrote them checked the sum against it. */}
          {notes.cycles?.length ? (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {notes.cycles.map((c, i) => (
                <div key={i} style={{
                  borderLeft: '3px solid var(--terracotta)', paddingLeft: '12px',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 'var(--text-md)', color: 'var(--ink)', margin: 0,
                  }}>
                    {c.verb}: {c.title}
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                      letterSpacing: '0.1em', color: 'var(--ink-muted)', marginLeft: '8px',
                    }}>
                      {c.minutes} MIN
                    </span>
                  </p>
                  <p style={{ ...body, marginTop: '2px' }}>{c.outcome}</p>
                </div>
              ))}
            </div>
          ) : null}

          {notes.equipment && (
            <p style={{ ...body, marginTop: '14px' }}>
              <strong style={{ color: 'var(--ink)' }}>What you need. </strong>
              {notes.equipment}
            </p>
          )}
        </div>

        {/* The teacher tip. Oak carries one per lesson and it earns its place:
            it is the thing that goes wrong when a lesson is taught cold.
            Butter, so the one line a teacher must not skip is the one card
            that is not white. --terracotta-lt is the butter tint; note that
            --gold-lt is an alias onto --stage-5, which is lavender. */}
        {notes.teacher_tip && (
          <div style={{ ...card, marginBottom: '16px', background: 'var(--terracotta-lt)' }}>
            <h2 style={h2}>If you do one thing first</h2>
            <p style={body}>{notes.teacher_tip}</p>
          </div>
        )}

        {/* What a pupil needs before this lesson, and what they hold after it.
            Two lists a teacher can scan in ten seconds to decide whether their
            class is ready and what the class will actually leave knowing. */}
        {/* SUBJECT KNOWLEDGE, and it sits above everything else on purpose.
            The rest of this page tells a teacher how to run the lesson. This
            is the only part that tells them what to UNDERSTAND before they
            walk in, which is what the coverage audit found we never shipped
            and Oak does. Open by default rather than folded away: a teacher
            who has to click to find the subject knowledge will not click. */}
        {notes.subject_knowledge?.length ? (
          <div style={{ ...card, marginBottom: '16px', background: 'var(--stage-2)' }}>
            <div style={{ ...mono, marginBottom: '6px' }}>Read this first</div>
            <h2 style={h2}>What you need to understand before you teach it</h2>
            <p style={{ ...body, marginBottom: '16px' }}>
              This is not the lesson. It is the ground under it, and it is what
              lets you answer the question that is not on the slides.
            </p>
            {notes.subject_knowledge.map((k, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : '14px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 4px',
                }}>
                  {k.heading}
                </h3>
                <p style={body}>{k.body}</p>
              </div>
            ))}
          </div>
        ) : null}

        {asList(notes.prior_knowledge).length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What they need before this</h2>
            <ul style={{ ...body, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {asList(notes.prior_knowledge).map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        ) : null}

        {asList(notes.key_learning_points).length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What they will know by the end</h2>
            <ul style={{ ...body, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {asList(notes.key_learning_points).map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
        ) : null}

        {/* What this lesson earns: the passport page, drawn as the child's
            book at home draws it, with the area this lesson builds marked.
            The count is this screen's memory of its classes (the passport
            beat's tap), never a child: this site holds class codes, not pupil
            accounts, and the passport never records where a page was filled. */}
        {placement && placement !== 'after' && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What this lesson earns</h2>
            <div style={{ margin: '0 0 14px' }}>
              <PassportPage placement={placement} moduleId={lesson.module_id} fromDevice compact note="Counted on this screen only, from the pages your classes have filled here. The passport itself is the child's own, kept at home." />
            </div>
            <p style={body}>
              Many of your families keep the Guided Childhood Passport at home: the journey to sixteen,
              filled one stage at a time and finished by DiGi&rsquo;s five question check, which a child
              cannot fail. This lesson fills the <strong style={{ color: 'var(--ink)' }}>{PASSPORT_STAGES[placement].page}</strong> page
              {area ? <> and builds <strong style={{ color: 'var(--ink)' }}>{AREAS[area].name}</strong>, one of the four things the passport records</> : null}.
              Teaching it is credit toward the page: the parent note going home says so and carries the
              home code that puts it in the child&rsquo;s own book.
            </p>
            <p style={{ ...body, marginTop: '8px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
              The passport never records where a page was filled, school or home, and none of this
              creates pupil data here: this site holds class codes, never pupil accounts.
            </p>
          </div>
        )}
        {placement === 'after' && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What this lesson earns</h2>
            <p style={body}>
              No passport page. The passport is the journey to sixteen and this year group is past it:
              this module is the chapter after the book, and the parent note says so.
            </p>
          </div>
        )}

        {/* The tool, which is the thing a child leaves with */}
        {notes.tool?.lines?.length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>{notes.tool.heading ?? 'The tool they leave with'}</h2>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '8px' }}>
              {notes.tool.lines.map(l => (
                <span key={l} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                  color: 'var(--ink)', background: 'var(--terracotta-lt)',
                  border: '1.5px solid var(--terracotta)', borderRadius: 'var(--radius-pill)', padding: '7px 16px',
                }}>
                  {l}
                </span>
              ))}
            </div>
            {notes.tool.strapline && <p style={body}>{notes.tool.strapline}</p>}
          </div>
        ) : null}

        {/* The three misconceptions. The single most useful thing on this
            page for a teacher who has never taught the topic before. */}
        {notes.misconceptions?.length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What children usually get wrong</h2>
            <ul style={{ ...body, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {notes.misconceptions.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        ) : null}

        {/* Keywords */}
        {notes.keywords?.length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>The words we teach</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {notes.keywords.map(k => (
                <p key={k.word} style={body}>
                  <strong style={{ color: 'var(--ink)' }}>{k.word}. </strong>{k.definition}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {/* Differentiation */}
        {(notes.differentiation?.support || notes.differentiation?.stretch) && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>Reaching everyone</h2>
            {notes.differentiation.support && (
              <p style={body}><strong style={{ color: 'var(--ink)' }}>Support. </strong>{notes.differentiation.support}</p>
            )}
            {notes.differentiation.stretch && (
              <p style={{ ...body, marginTop: '8px' }}><strong style={{ color: 'var(--ink)' }}>Stretch. </strong>{notes.differentiation.stretch}</p>
            )}
          </div>
        )}

        {/* SEND and EAL: the graduated approach, one line per need, written
            from this module's own activities. */}
        {(notes.send?.communication || notes.send?.attention || notes.send?.sensory || notes.send?.eal) && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>SEND and EAL adaptations</h2>
            {notes.send.communication && (
              <p style={body}><strong style={{ color: 'var(--ink)' }}>Communication and language. </strong>{notes.send.communication}</p>
            )}
            {notes.send.attention && (
              <p style={{ ...body, marginTop: '8px' }}><strong style={{ color: 'var(--ink)' }}>Attention and executive function. </strong>{notes.send.attention}</p>
            )}
            {notes.send.sensory && (
              <p style={{ ...body, marginTop: '8px' }}><strong style={{ color: 'var(--ink)' }}>Sensory and regulation. </strong>{notes.send.sensory}</p>
            )}
            {notes.send.eal && (
              <p style={{ ...body, marginTop: '8px' }}><strong style={{ color: 'var(--ink)' }}>English as an additional language. </strong>{notes.send.eal}</p>
            )}
          </div>
        )}

        {/* The same promise as the no screen card below, about a different
            medium. A video beat is the one moment in the lesson that reaches
            a pupil through sound and vision only, so a deaf pupil, a pupil
            using a screen reader, or a room whose speakers have died all
            need the beat in words. Here rather than only in the player,
            because a teacher plans for a deaf pupil the night before, not
            while the class watches them hunt for a transcript.

            Four of the eight beats have no dialogue at all, so this card
            says so plainly instead of leaving a teacher to wonder. */}
        {videoBeats.some(v => v.alternative) && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>The video clips, in words</h2>
            <p style={{ ...body, marginBottom: '14px' }}>
              Read these out if a pupil cannot hear the clip, or if the sound
              in your room is not working. Nothing in the lesson depends on
              hearing it.
            </p>
            {videoBeats.map((v, i) => {
              const alt = v.alternative
              if (!alt) return null
              return (
                <div key={i} style={{
                  borderLeft: '3px solid var(--terracotta)', paddingLeft: '12px',
                  marginTop: i === 0 ? 0 : '14px',
                }}>
                  <p style={{ ...mono, color: 'var(--ink-soft)', marginBottom: '4px' }}>
                    {v.caption ?? 'Video clip'}
                  </p>
                  {alt.spoken.length === 0 ? (
                    <p style={body}>Nobody speaks in this clip.</p>
                  ) : (
                    alt.spoken.map((line, j) => (
                      <p key={j} style={{ ...body, color: 'var(--ink)', marginBottom: '4px' }}>
                        &ldquo;{line}&rdquo;
                      </p>
                    ))
                  )}
                  <p style={{ ...body, marginTop: '4px' }}>
                    <strong style={{ color: 'var(--ink)' }}>On screen. </strong>
                    {alt.described}
                    {alt.onScreen ? ` The board reads ${alt.onScreen}.` : ''}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* The equity promise made checkable: if the room has no screen, the
            lesson still runs, and here is exactly how. */}
        {notes.paper_fallback && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>If there is no screen</h2>
            <p style={body}>{notes.paper_fallback}</p>
          </div>
        )}

        {/* WHAT THEY MIGHT ASK YOU. Two sets, deliberately separate: a pupil
            asking in the room needs a different answer from a parent emailing
            that evening, and a teacher holding one script for both will get
            one of them wrong. Every pupil answer that touches a disclosure
            ends by naming the DSL rather than handling it alone. */}
        {(notes.hard_questions?.length || notes.parent_questions?.length) ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What they might ask you</h2>

            {notes.hard_questions?.length ? (
              <>
                <div style={{ ...mono, margin: '4px 0 10px' }}>From a pupil, in the room</div>
                {notes.hard_questions.map((q, i) => (
                  <div key={i} style={{
                    borderLeft: '3px solid var(--terracotta)', paddingLeft: '12px',
                    marginBottom: '12px',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 3px',
                    }}>
                      &ldquo;{q.question}&rdquo;
                    </p>
                    <p style={body}>{q.answer}</p>
                  </div>
                ))}
              </>
            ) : null}

            {notes.parent_questions?.length ? (
              <>
                <div style={{ ...mono, margin: '18px 0 10px' }}>From a parent, afterwards</div>
                {notes.parent_questions.map((q, i) => (
                  <div key={i} style={{
                    borderLeft: '3px solid var(--border)', paddingLeft: '12px',
                    marginBottom: '12px',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 3px',
                    }}>
                      &ldquo;{q.question}&rdquo;
                    </p>
                    <p style={body}>{q.answer}</p>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        ) : null}

        {/* THE EVIDENCE BASE, with each row's status shown rather than hidden.
            A teacher challenged by a parent needs to know which claims are
            checked, which are still waiting on the citation verifier, and
            which need no figure because the mechanism carries them. Showing
            the status is the honest move: a table that presented all three the
            same way would be a worse lie than the single string it replaces. */}
        {notes.evidence_base?.length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>Where the claims come from</h2>
            <p style={{ ...body, marginBottom: '14px' }}>
              A claim with no verified source does not go on a slide. Where we
              cannot verify a number we teach the mechanism instead, which is
              stronger anyway.
            </p>
            {notes.evidence_base.map((e, i) => (
              <div key={i} style={{ paddingTop: '11px', borderTop: '1px solid var(--border)' }}>
                <p style={{ ...body, color: 'var(--ink)', margin: '0 0 3px' }}>{e.claim}</p>
                <p style={{ ...body, fontSize: 'var(--text-sm)', margin: 0 }}>
                  {e.source}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginLeft: '8px', padding: '3px 8px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border)', whiteSpace: 'nowrap',
                    background: e.status === 'verify' ? 'var(--terracotta-lt)' : '#fff',
                    color: e.status === 'verify' ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                  }}>
                    {e.status === 'verified' ? 'Checked'
                      : e.status === 'verify' ? 'Not yet checked'
                      : 'Mechanism, no figure'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Safeguarding, only where the module actually needs it. Printing a
            reassurance on every lesson trains people to stop reading it. */}
        {dsl.required && (
          <div style={{ ...card, marginBottom: '16px', borderColor: 'var(--terracotta)', borderWidth: '2px' }}>
            <h2 style={h2}>Before you teach this one</h2>
            <p style={body}>
              {dsl.note ?? 'Tell your designated safeguarding lead that this module is being taught this week, so they know why a child may come to them afterwards.'}
            </p>
            {/* Who that is, on this screen, or where to type it. The name
                lives in the browser (shared/schools-your-school), never here. */}
            <p style={{ ...body, marginTop: 'var(--space-2)' }}><LeadLine /></p>
            <Link href="/hub/dsl" style={{ ...mono, color: 'var(--terracotta-dark)', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
              The DSL briefing →
            </Link>
          </div>
        )}

        {/* The statutory cover, from the row's own mapping fields, so a
            subject lead can answer "where does this sit" without leaving the
            page. The full grid stays in the Hub. */}
        {((lesson.efcw_strands?.length ?? 0) > 0 || (lesson.statutory_hooks?.length ?? 0) > 0) && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>Where this sits in the framework</h2>
            {(lesson.efcw_strands?.length ?? 0) > 0 && (
              <p style={body}>
                <strong style={{ color: 'var(--ink)' }}>Education for a Connected World. </strong>
                {lesson.efcw_strands!.map(n => EFCW_STRANDS[n - 1]).filter(Boolean).join('; ')}
              </p>
            )}
            {(lesson.statutory_hooks?.length ?? 0) > 0 && (
              <p style={{ ...body, marginTop: '8px' }}>
                <strong style={{ color: 'var(--ink)' }}>Statutory hooks. </strong>
                {lesson.statutory_hooks!.join('; ')}
              </p>
            )}
            {lesson.evidence_anchor && (
              <p style={{ ...body, marginTop: '8px' }}>
                <strong style={{ color: 'var(--ink)' }}>Evidence anchor. </strong>
                {lesson.evidence_anchor}
              </p>
            )}
            <Link href="/hub/rshe-mapping" style={{ ...mono, color: 'var(--terracotta-dark)', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
              The full RSHE mapping →
            </Link>
          </div>
        )}

        {/* What goes home */}
        {(parent.taught || parent.family_question) && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What goes home</h2>
            {parent.taught && <p style={body}>{parent.taught}</p>}
            {parent.family_question && (
              <p style={{ ...body, marginTop: '10px', fontStyle: 'italic' }}>
                The question for the dinner table: &ldquo;{parent.family_question}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* After the lesson, not in front of it. The form used to sit above
            the buttons and filled a phone's first screen; the lesson is what
            earns the email, so it comes first and the form follows it (the
            schools review, 13 September 2026). */}
        {showTaster && <div style={{ marginTop: '28px' }}><TasterBar moduleId={moduleId} moduleTitle={lesson.title} /></div>}
        <div style={{ marginTop: '28px' }}>
          <TrackerPanel
            moduleId={lesson.module_id}
            shape={shapeOf(lesson.module_id, notes.i_can)}
            runHref={`/lesson/${lesson.module_id}/run`}
          />
        </div>

        {showPilot && <div style={{ marginTop: '28px' }}><PilotStrip /></div>}

        <div style={{ marginTop: '28px', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link href={`/teach/${lesson.module_id}`} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px' }}>
            Teach this lesson
          </Link>
        </div>

      </div>
    </main>
  )
}
