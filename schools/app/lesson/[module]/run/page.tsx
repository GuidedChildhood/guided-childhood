import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import { parseSlides, PHASE_ORDER, PHASE_LABELS, type LessonPhase, type LessonSlide } from '@gc/shared/lesson-slides'

// THE RUN SHEET: the whole lesson, walked through, start to finish.
//
// Justin, 29 August: one lesson from start to finish, teacher scripts,
// guidance, what exactly to teach, how to run it, actually walk them through
// it, all the paperwork, everything in one run. The lesson home page answers
// "should I teach this"; the player answers "what does the class see". This
// page answers the question in between, the one a nervous teacher actually
// has on Sunday night: WHAT DO I DO, in order, minute by minute, and what do
// I say.
//
// The shape is the one proven by recipe kits and guided setups (Mobbin sweep,
// 29 August: HelloFresh's numbered instructions under a gather list, Hims'
// tickable sub steps, Stripe's setup rows): BEFORE as tick rows, DURING as
// one row per phase with the minutes and the words, AFTER as tick rows. Ours,
// in butter and ink, and printable, because the paper twin rule applies to
// guidance as much as to worksheets: this page IS the paper run sheet when
// printed, so a teacher can run the whole lesson from a clipboard.
//
// Everything on it is derived from the lesson row. No teaching line is
// hardcoded here (house rule: scripts live in the database), which is what
// makes this ONE page serve all twenty one modules unchanged.

export const revalidate = 3600

type Keyword = { word: string; definition: string }
type TeacherNotes = {
  learning_objective?: string
  timing?: string
  keywords?: Keyword[]
  misconceptions?: string[]
  differentiation?: { support?: string; stretch?: string }
  paper_fallback?: string
  tool?: { heading?: string; lines?: string[]; strapline?: string }
  i_can?: string[]
  worksheet?: { title?: string }
}
type ParentNote = { passport?: string; family_question?: string }
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
}

// Teacher facing names for the slide types, so a row reads as an activity
// rather than a data type.
const TYPE_LABELS: Record<string, string> = {
  title: 'The opening', objective: 'The objective', keywords: 'The words',
  concept: 'Teach it', quote: 'The chant', choice: 'Whole class question',
  scenario: 'Scenario', diagram: 'The tool', discussion: 'Talk together',
  stat: 'The number', tryit: 'The practice', recap: 'The recap',
  video: 'Watch together', digi: 'DiGi moment', interactive: 'Play together',
}

function headline(s: LessonSlide): string {
  const any = s as unknown as Record<string, unknown>
  for (const k of ['title', 'heading', 'question', 'outcome', 'caption', 'text']) {
    const v = any[k]
    if (typeof v === 'string' && v) return v
  }
  return TYPE_LABELS[s.type] ?? s.type
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
  color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 6px',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
  color: 'var(--ink-soft)', lineHeight: 1.65,
}
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: '20px',
  padding: '22px 24px', boxShadow: '0 1px 2px rgba(46,40,24,0.05)',
  breakInside: 'avoid',
}

/** A tick row: an empty square a pen can fill, because this page prints. */
function TickRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span aria-hidden style={{
        width: '20px', height: '20px', flexShrink: 0, marginTop: '2px',
        border: '2px solid var(--ink-muted)', borderRadius: '6px',
      }} />
      <div style={{ ...body, color: 'var(--ink)' }}>{children}</div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const { data } = await supabase
    .from('school_lessons').select('title').eq('module_id', moduleId).maybeSingle()
  const title = (data as { title: string } | null)?.title
  return { title: title ? `Run sheet: ${title}` : 'Run sheet', robots: { index: false, follow: false } }
}

export default async function RunSheetPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes, parent_note, dsl_note')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  if (slides.length === 0) notFound()
  const notes = lesson.teacher_notes ?? {}
  const parent = lesson.parent_note ?? {}
  const dsl = lesson.dsl_note ?? {}

  const totalMinutes = slides.reduce((t, s) => t + (s.minutes ?? 0), 0)

  // The lesson in phase order, each phase carrying its own slides. Derived
  // from the deck itself so this page can never describe a lesson the player
  // does not play.
  const phases = PHASE_ORDER
    .map(p => ({
      phase: p as LessonPhase,
      rows: slides
        .map((s, i) => ({ slide: s, index: i }))
        .filter(r => r.slide.phase === p),
    }))
    .filter(p => p.rows.length > 0)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '36px 20px 90px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link href={`/lesson/${lesson.module_id}`} style={{ ...mono, textDecoration: 'none', color: 'var(--terracotta-dark)' }}>
            ← Back to the lesson
          </Link>
          <PrintButton label="Print the run sheet" />
        </div>

        <div style={{ ...mono, marginTop: '18px' }}>
          Run sheet · {lesson.key_stage} · {lesson.year_band}
          {lesson.character_cast ? ` · ${lesson.character_cast}` : ''} · {totalMinutes} minutes
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(1.6rem, 4.6vw, 2.2rem)', color: 'var(--ink)',
          letterSpacing: '-0.02em', lineHeight: 1.15, margin: '6px 0 8px',
        }}>
          {lesson.title}, start to finish
        </h1>
        <p style={{ ...body, maxWidth: '640px', marginBottom: '8px' }}>
          Everything below comes from the lesson itself: what to do before, what happens in each
          phase, the words to say, and what goes home after. Run the whole thing from this one page.
        </p>
        <p style={{
          fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 600,
          fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)', marginBottom: '26px',
        }}>
          By the end: &ldquo;{lesson.single_action_outcome}&rdquo;
        </p>

        {/* ── BEFORE ── */}
        <section style={{ ...card, marginBottom: '16px' }}>
          <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: '4px' }}>Before the lesson · about five minutes</div>
          <h2 style={h2}>Get ready</h2>
          <TickRow>
            <Link href={`/print/${lesson.module_id}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Print the pack</Link>
            {' '}and photocopy per pupil: the worksheet, the start and end cards, and the parent note.
            The answer key in the pack is yours alone, one copy, never photocopied.
          </TickRow>
          {(notes.i_can?.length ?? 0) > 0 && (
            <TickRow>
              <Link href={`/print/${lesson.module_id}/record`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Print the learning record</Link>
              , one per pupil, for the end of the lesson or later in the week.
            </TickRow>
          )}
          {notes.misconceptions?.length ? (
            <TickRow>
              Read what children usually get wrong, so the wrong answers in the room do not surprise you:
              <ul style={{ ...body, paddingLeft: '18px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {notes.misconceptions.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </TickRow>
          ) : null}
          {dsl.required && (
            <TickRow>
              <strong>Tell your safeguarding lead</strong> this module runs this week, so they know why a
              child may come to them afterwards. {dsl.note ?? ''} <Link href="/hub/dsl" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>The DSL briefing</Link>.
            </TickRow>
          )}
          <TickRow>
            Open <Link href={`/teach/${lesson.module_id}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the lesson on the board</Link> before
            the children come in. The script for every slide is in the player too, so the board can
            prompt you if this page stays on your desk.
          </TickRow>
          {notes.paper_fallback && (
            <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '10px' }}>
              No screen today? {notes.paper_fallback}
            </p>
          )}
        </section>

        {/* ── DURING ── */}
        <div style={{ ...mono, color: 'var(--green-dark)', margin: '24px 0 8px' }}>During the lesson · {totalMinutes} minutes</div>
        {phases.map(({ phase, rows }) => {
          const phaseMinutes = rows.reduce((t, r) => t + (r.slide.minutes ?? 0), 0)
          return (
            <section key={phase} style={{ ...card, marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '5px 12px', borderRadius: '100px',
                  background: 'var(--terracotta)', color: '#fff',
                }}>
                  {PHASE_LABELS[phase]}
                </span>
                {phaseMinutes > 0 && (
                  <span style={{ ...mono }}>{phaseMinutes} min</span>
                )}
              </div>
              {rows.map(({ slide: s, index: i }) => (
                <div key={i} style={{ borderTop: '1px solid var(--border)', padding: '12px 0', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ ...mono, color: 'var(--terracotta-dark)' }}>
                      Slide {i + 1} · {TYPE_LABELS[s.type] ?? s.type}{s.minutes ? ` · ~${s.minutes} min` : ''}
                    </span>
                    <Link
                      className="no-print"
                      href={`/teach/${lesson.module_id}?slide=${i + 1}`}
                      style={{ ...mono, marginLeft: 'auto', color: 'var(--ink-muted)', textDecoration: 'none' }}
                    >
                      Open here →
                    </Link>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '4px 0 6px' }}>
                    {headline(s)}
                  </p>
                  {s.script && <p style={body}>{s.script}</p>}
                </div>
              ))}
            </section>
          )
        })}

        {/* ── AFTER ── */}
        <section style={{ ...card, margin: '24px 0 16px' }}>
          <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: '4px' }}>After the lesson · two minutes</div>
          <h2 style={h2}>Send it home, keep the record</h2>
          <TickRow>
            The parent note goes in book bags today. It carries what you taught, the question for the
            dinner table{parent.passport ? ', and the passport line, so home knows the page it is filling' : ''}.
          </TickRow>
          {parent.passport && (
            <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontStyle: 'italic', margin: '8px 0' }}>
              The passport line on the note: &ldquo;{parent.passport}&rdquo;
            </p>
          )}
          {(notes.i_can?.length ?? 0) > 0 && (
            <TickRow>
              The learning record: each child colours the star they think they reached, you colour
              yours, and the conversation about the gap is the assessment.
            </TickRow>
          )}
          <TickRow>
            Nothing else to write up. Next lesson opens by recalling this one, and that retrieval is
            already built into its starter.
          </TickRow>
          {dsl.required && (
            <TickRow>
              A quiet word with the safeguarding lead if anything in the room made you pause.
              Better said today than remembered on Friday.
            </TickRow>
          )}
        </section>

        <div className="no-print" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
          <Link href={`/teach/${lesson.module_id}`} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px' }}>
            Teach this lesson
          </Link>
          <PrintButton label="Print the run sheet" />
        </div>

        <PrintBrandFooter />
      </div>
    </main>
  )
}
