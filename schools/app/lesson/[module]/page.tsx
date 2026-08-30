import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { parseSlides, PHASE_LABELS, PHASE_ORDER, type LessonPhase } from '@gc/shared/lesson-slides'
import { EFCW_STRANDS } from '@gc/shared/efcw'

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
type TeacherNotes = {
  learning_objective?: string
  timing?: string
  keywords?: Keyword[]
  misconceptions?: string[]
  differentiation?: { support?: string; stretch?: string }
  paper_fallback?: string
  tool?: { heading?: string; lines?: string[]; strapline?: string }
  // The three "I can" statements the child colours on the learning record.
  i_can?: string[]
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

// Which passport page this key stage's lessons fill. The five stages and
// their ages are the parents app's single source (lib/content/stages.ts);
// this map only translates a key stage into that vocabulary for the teacher.
// KS3 straddles two stages because Explorer hands over to Shaper at 13.
const PASSPORT_STAGE: Record<string, string> = {
  EYFS: 'Foundation (ages 4 to 7)',
  KS1: 'Foundation (ages 4 to 7)',
  KS2: 'Builder (ages 8 to 10)',
  KS3: 'Explorer (ages 11 to 12) and Shaper (ages 13 to 15)',
  KS4: 'Shaper (ages 13 to 15)',
  KS5: 'Independent (ages 16 and above)',
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
  background: '#fff', border: '1px solid var(--border)', borderRadius: '20px',
  padding: '22px 24px', boxShadow: '0 1px 2px rgba(46,40,24,0.05)',
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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '36px 20px 90px' }}>
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
          fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', color: 'var(--ink)',
          letterSpacing: '-0.02em', lineHeight: 1.15, margin: '6px 0 14px',
        }}>
          {lesson.title}
        </h1>

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
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <Link href={`/teach/${lesson.module_id}`} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px' }}>
            Teach this lesson
          </Link>
          <Link href={`/print/${lesson.module_id}`} className="btn" style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            padding: '15px 26px', borderRadius: '16px', textDecoration: 'none',
            color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)',
            boxShadow: '0 5px 0 var(--border)',
          }}>
            Print the pack
          </Link>
          <Link href={`/lesson/${lesson.module_id}/run`} className="btn" style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            padding: '15px 26px', borderRadius: '16px', textDecoration: 'none',
            color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)',
            boxShadow: '0 5px 0 var(--border)',
          }}>
            Walk me through it
          </Link>
          {/* Only offered where the three statements have been written, so a
              module that is not ready cannot hand out a blank sheet. */}
          {(notes.i_can?.length ?? 0) > 0 && (
            <Link href={`/print/${lesson.module_id}/record`} className="btn" style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              padding: '15px 26px', borderRadius: '16px', textDecoration: 'none',
              color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)',
              boxShadow: '0 5px 0 var(--border)',
            }}>
              Print the learning record
            </Link>
          )}
        </div>
        <p style={{ ...mono, marginBottom: '30px' }}>
          {totalMinutes} minutes · {slides.length} slides
          {interactives > 0 ? ` · ${interactives} interactive` : ''}
        </p>

        {/* The shape of the lesson */}
        <div style={{ ...card, marginBottom: '16px' }}>
          <h2 style={h2}>How the lesson runs</h2>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {phases.map(p => (
              <span key={p.phase} style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '6px 12px', borderRadius: '100px',
                border: '1.5px solid var(--border)', color: 'var(--ink-soft)',
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
        </div>

        {/* What this lesson earns. The passport is the parents app's journey
            to sixteen; the school's part is credit toward the page, said in
            the approved vocabulary and none of the forbidden words: the
            passport never records where a page was filled, it is never a
            test of the child, and nothing here creates pupil data. */}
        {PASSPORT_STAGE[lesson.key_stage] && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>What this lesson earns</h2>
            <p style={body}>
              Many of your families keep the Guided Childhood Passport at home: the journey to
              sixteen, filled one stage at a time and finished by DiGi&rsquo;s five question check,
              which a child cannot fail. This lesson belongs to the <strong style={{ color: 'var(--ink)' }}>{PASSPORT_STAGE[lesson.key_stage]}</strong> page.
              Teaching it is credit toward that page: the parent note going home says so, and home
              carries it on with jobs and small wins of their own.
            </p>
            <p style={{ ...body, marginTop: '8px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
              The passport never records where a page was filled, school or home, and none of this
              creates pupil data here: this site holds class codes, never pupil accounts.
            </p>
          </div>
        )}

        {/* The tool, which is the thing a child leaves with */}
        {notes.tool?.lines?.length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>{notes.tool.heading ?? 'The tool they leave with'}</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {notes.tool.lines.map(l => (
                <span key={l} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                  color: 'var(--ink)', background: 'var(--terracotta-lt)',
                  border: '1.5px solid var(--terracotta)', borderRadius: '100px', padding: '7px 16px',
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
            <ul style={{ ...body, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notes.misconceptions.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        ) : null}

        {/* Keywords */}
        {notes.keywords?.length ? (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>The words we teach</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

        {/* The equity promise made checkable: if the room has no screen, the
            lesson still runs, and here is exactly how. */}
        {notes.paper_fallback && (
          <div style={{ ...card, marginBottom: '16px' }}>
            <h2 style={h2}>If there is no screen</h2>
            <p style={body}>{notes.paper_fallback}</p>
          </div>
        )}

        {/* Safeguarding, only where the module actually needs it. Printing a
            reassurance on every lesson trains people to stop reading it. */}
        {dsl.required && (
          <div style={{ ...card, marginBottom: '16px', borderColor: 'var(--terracotta)', borderWidth: '2px' }}>
            <h2 style={h2}>Before you teach this one</h2>
            <p style={body}>
              {dsl.note ?? 'Tell your designated safeguarding lead that this module is being taught this week, so they know why a child may come to them afterwards.'}
            </p>
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

        <div style={{ marginTop: '28px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href={`/teach/${lesson.module_id}`} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px' }}>
            Teach this lesson
          </Link>
        </div>

      </div>
    </main>
  )
}
