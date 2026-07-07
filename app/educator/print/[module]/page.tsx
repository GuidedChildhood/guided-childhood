import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { parseSlides, type ChoiceSlide } from '@/lib/content/lesson-slides'
import PrintButton from './PrintButton'

// The paper pack: every printable a teacher needs for a lesson, generated
// from the lesson row in one click. This is the paperwork killer promised
// in the spec (sections 10.4 and 11.3): teacher one pager with statutory
// tags, cut out cards, the three checks bookmark strip, the worksheet, and
// the parent note. Equity rule made real: the whole lesson runs from this
// pack with one photocopier and no screens.

type WorksheetItem = { n: number; item: string; expected_verdict: string; teaching_point: string }
type TeacherNotes = {
  learning_objective?: string
  timing?: string
  misconceptions?: string[]
  differentiation?: { support?: string; stretch?: string }
  paper_fallback?: string
  worksheet_items?: WorksheetItem[]
  // v3: per module print content, so every module's pack carries its own
  // tool and verdict language. Reference module fallbacks keep old rows printing.
  tool?: { heading?: string; lines?: string[]; strapline?: string }
  worksheet?: { title?: string; directions?: string; verdict_options?: string[] }
  commitment_stem?: string
}
type ParentNote = { headline?: string; taught?: string; try_this?: string; family_question?: string }
type DslNote = { note?: string }

const VERDICT_LABEL: Record<string, string> = {
  believe: 'Believe', pause: 'Pause', do_not_share: 'Do not share',
}

const page: React.CSSProperties = { pageBreakAfter: 'always', padding: '24px 8px' }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--ink)', margin: '0 0 4px' }
const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6 }
const box: React.CSSProperties = { border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px', marginTop: '10px' }
const writeLine: React.CSSProperties = { borderBottom: '1px solid var(--border)', height: '26px' }

export default async function PrintPackPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, statutory_hooks, efcw_strands, evidence_anchor, slides, teacher_notes, parent_note, dsl_note')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const checks = slides.filter((s): s is ChoiceSlide => s.type === 'choice')
  const retrieval = checks[0]
  const exitChecks = checks.slice(-2)
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const parent = (lesson.parent_note ?? {}) as ParentNote
  const dsl = (lesson.dsl_note ?? {}) as DslNote
  const items = notes.worksheet_items ?? []

  // Module specific print content with reference lesson fallbacks.
  const tool = {
    heading: notes.tool?.heading ?? 'The three checks',
    lines: notes.tool?.lines ?? [
      '1. Who made this, and how do they know?',
      '2. What do other places say?',
      '3. How is it trying to make me feel?',
    ],
    strapline: notes.tool?.strapline ?? 'Three checks, under a minute. Check before you share.',
  }
  const worksheetTitle = notes.worksheet?.title ?? 'Run the three checks'
  const worksheetDirections = notes.worksheet?.directions ?? 'For each item: run the checks, circle a verdict, and give your reason. A verdict without a reason does not count.'
  const verdictOptions = notes.worksheet?.verdict_options ?? ['Believe', 'Pause', 'Do not share']
  const commitmentStem = notes.commitment_stem ?? 'My commitment: the next time I see a shocking post I will...'

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff', color: 'var(--ink)' }}>
      <div className="no-print" style={{ padding: '20px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={mono}>Paper pack · print one, photocopy per pupil where marked</span>
        <PrintButton />
      </div>

      {/* Page 1: teacher one pager */}
      <section style={page}>
        <div style={mono}>{lesson.key_stage} · {lesson.year_band} · Teacher one pager</div>
        <h2 style={h2}>{lesson.title}</h2>
        <p style={{ ...body, fontWeight: 700 }}>Action outcome: {lesson.single_action_outcome}</p>
        {notes.learning_objective && <div style={box}><span style={mono}>Objective</span><p style={body}>{notes.learning_objective}</p></div>}
        {notes.timing && <div style={box}><span style={mono}>Timing</span><p style={body}>{notes.timing}</p></div>}
        <div style={box}>
          <span style={mono}>Statutory coverage (for your records and the subject lead)</span>
          <p style={body}>{(lesson.statutory_hooks ?? []).join(' · ')}</p>
          <p style={body}>Education for a Connected World strand{(lesson.efcw_strands ?? []).length === 1 ? '' : 's'}: {(lesson.efcw_strands ?? []).join(', ')} · Evidence anchor: {lesson.evidence_anchor}</p>
        </div>
        {notes.misconceptions && notes.misconceptions.length > 0 && (
          <div style={box}>
            <span style={mono}>Misconceptions to expect</span>
            {notes.misconceptions.map((m, i) => <p key={i} style={body}>· {m}</p>)}
          </div>
        )}
        {notes.differentiation && (
          <div style={box}>
            <span style={mono}>Differentiation</span>
            {notes.differentiation.support && <p style={body}><strong>Support:</strong> {notes.differentiation.support}</p>}
            {notes.differentiation.stretch && <p style={body}><strong>Stretch:</strong> {notes.differentiation.stretch}</p>}
          </div>
        )}
        {dsl.note && <div style={{ ...box, borderColor: 'var(--coral)' }}><span style={{ ...mono, color: 'var(--coral-dark)' }}>Safeguarding note</span><p style={body}>{dsl.note}</p></div>}
        {notes.paper_fallback && <div style={box}><span style={mono}>No screen? No problem</span><p style={body}>{notes.paper_fallback}</p></div>}
      </section>

      {/* Page 2: the three checks bookmark strip (photocopy, cut into 4) */}
      <section style={page}>
        <div style={mono}>Photocopy per 4 pupils · cut along the lines · Bookmark</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ border: '1px dashed var(--ink-light)', padding: '18px 16px' }}>
              <div style={{ ...mono, color: 'var(--gold-dark)' }}>{tool.heading}</div>
              {tool.lines.map((line, j) => (
                <p key={j} style={{ ...body, fontWeight: 800, marginTop: j === 0 ? '8px' : 0 }}>{line}</p>
              ))}
              <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '8px' }}>{tool.strapline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Page 3: worksheet (photocopy per pupil) */}
      <section style={page}>
        <div style={mono}>Photocopy per pupil · Worksheet</div>
        <h2 style={h2}>{worksheetTitle}</h2>
        <p style={body}>{worksheetDirections}</p>
        {items.map(it => (
          <div key={it.n} style={box}>
            <p style={{ ...body, fontWeight: 700 }}>{it.n}. {it.item}</p>
            <p style={{ ...body, marginTop: '6px' }}>Verdict: &nbsp; {verdictOptions.join('  ·  ')}</p>
            <p style={{ ...body, marginTop: '6px', color: 'var(--ink-muted)' }}>Because:</p>
            <div style={writeLine} />
          </div>
        ))}
      </section>

      {/* Page 4: retrieval + exit cards (photocopy per pupil, cut in half) */}
      <section style={page}>
        <div style={mono}>Photocopy per pupil · cut in half · Start and end of lesson</div>
        {retrieval && (
          <div style={{ border: '1px dashed var(--ink-light)', padding: '16px', marginBottom: '18px' }}>
            <div style={{ ...mono, color: 'var(--green-dark)' }}>Start card · remember last lesson</div>
            <p style={{ ...body, fontWeight: 700, marginTop: '6px' }}>{retrieval.question}</p>
            {retrieval.options.map((o, i) => <p key={i} style={body}>{String.fromCharCode(65 + i)}. {o.text}</p>)}
          </div>
        )}
        <div style={{ border: '1px dashed var(--ink-light)', padding: '16px' }}>
          <div style={{ ...mono, color: 'var(--green-dark)' }}>Exit card</div>
          {exitChecks.map((c, idx) => (
            <div key={idx} style={{ marginTop: '8px' }}>
              <p style={{ ...body, fontWeight: 700 }}>{c.question}</p>
              {c.options.map((o, i) => <p key={i} style={body}>{String.fromCharCode(65 + i)}. {o.text}</p>)}
            </div>
          ))}
          <p style={{ ...body, fontWeight: 700, marginTop: '10px' }}>{commitmentStem}</p>
          <div style={writeLine} />
        </div>
      </section>

      {/* Page 5: parent note (photocopy per pupil, goes home) */}
      <section style={{ ...page, pageBreakAfter: 'auto' }}>
        <div style={mono}>Photocopy per pupil · goes home · Parent note</div>
        <h2 style={h2}>{parent.headline ?? 'What we taught today'}</h2>
        {parent.taught && <p style={body}>{parent.taught}</p>}
        <div style={box}>
          <span style={{ ...mono, color: 'var(--gold-dark)' }}>The three checks we learned</span>
          <p style={body}>1. Who made this, and how do they know? &nbsp; 2. What do other places say? &nbsp; 3. How is it trying to make me feel?</p>
        </div>
        {parent.try_this && <div style={box}><span style={mono}>Try this at home</span><p style={body}>{parent.try_this}</p></div>}
        {parent.family_question && <div style={box}><span style={mono}>Dinner table question</span><p style={{ ...body, fontWeight: 700 }}>{parent.family_question}</p></div>}
        <p style={{ ...body, fontSize: '11px', color: 'var(--ink-light)', marginTop: '14px' }}>Guided Childhood Schools · no login needed, nothing to sign up for. This note is yours.</p>
      </section>
    </main>
  )
}
