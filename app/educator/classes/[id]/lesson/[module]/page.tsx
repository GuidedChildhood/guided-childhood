import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { recordDelivery } from '../../../../actions'
import PrepChecklist, { type PrepItem } from './PrepChecklist'

// THE LESSON HUB: the one page where everything for teaching this lesson
// to this class lives, with the tick off checklist (JP request). This is
// the spec's Prepare screen: purpose and objective up top (what Ofsted
// conversations actually ask for), the full prep list with every
// printable, the teach and register actions, and the teacher knowledge
// (misconceptions, differentiation, safeguarding) inline.

type TeacherNotes = {
  learning_objective?: string
  timing?: string
  misconceptions?: string[]
  differentiation?: { support?: string; stretch?: string }
  paper_fallback?: string
}
type DslNote = { note?: string; required?: boolean }
type ParentNote = { family_question?: string }

const eyebrow: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const card: React.CSSProperties = { background: 'var(--warm)', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '20px 22px' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }

export default async function LessonHubPage({ params }: { params: Promise<{ id: string; module: string }> }) {
  const { id: classId, module: moduleId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: cls }, { data: lesson }] = await Promise.all([
    supabase.from('school_classes').select('id, name, year_group').eq('id', classId).maybeSingle(),
    supabase.from('school_lessons')
      .select('id, module_id, title, key_stage, year_band, single_action_outcome, character_cast, statutory_hooks, efcw_strands, evidence_anchor, teacher_notes, dsl_note, parent_note')
      .eq('module_id', moduleId).maybeSingle(),
  ])
  if (!cls || !lesson) notFound()

  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const dsl = (lesson.dsl_note ?? {}) as DslNote
  const parent = (lesson.parent_note ?? {}) as ParentNote

  const before: PrepItem[] = [
    { key: 'onepager', label: 'Read the teacher one pager', detail: 'Objective, timing, misconceptions, differentiation. Five minutes the night before.', href: `/educator/print/${lesson.module_id}` },
    { key: 'beats', label: 'Watch the video beats', detail: `${lesson.character_cast ?? 'The character'} carries four short beats. Know where they land.`, href: `/educator/teach/${lesson.module_id}` },
    ...(dsl.note ? [{ key: 'dsl', label: 'Read the safeguarding note', detail: 'This module is safeguarding flagged. Know your disclosure route before you teach.', href: `/educator/print/${lesson.module_id}` }] : []),
    { key: 'pack', label: 'Print the paper pack', detail: 'One pager, bookmark strip, worksheet, start and exit cards, parent note.', href: `/educator/print/${lesson.module_id}` },
    { key: 'booklets', label: 'Print the pupil booklets', detail: 'One per pupil, fold in half. The rundown, case file and mission.', href: `/educator/print/${lesson.module_id}/booklet` },
    { key: 'quizzes', label: 'Print the named quizzes', detail: 'One page per pupil with names already printed from your class list.', href: `/educator/print/${lesson.module_id}/quiz/${cls.id}` },
  ]
  const during: PrepItem[] = [
    { key: 'teach', label: 'Teach with the lesson player', detail: 'One projector is enough. The player carries the beats, checks and pacing.', href: `/educator/teach/${lesson.module_id}` },
    { key: 'worksheet', label: 'Run the independent practice', detail: 'Fifteen minutes on the worksheet or booklet case file. Verdicts need reasons.' },
    { key: 'quiz', label: 'Hand out the named quizzes', detail: 'End of lesson. Collect them back in: they are your per pupil evidence.' },
  ]
  const after: PrepItem[] = [
    { key: 'register', label: 'Take the register (one tap below)', detail: 'Records the delivery for coverage. Everyone starts at Met.' },
    { key: 'mark', label: 'Mark the exceptions', detail: 'One tap per pupil who was not simply Met. Under a minute for most classes.' },
    { key: 'parentnote', label: 'Send the parent notes home', detail: 'Last page of the paper pack. In bags, no login needed.' },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '36px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href={`/educator/classes/${cls.id}`} style={{ ...eyebrow, textDecoration: 'none' }}>← {cls.name} · {cls.year_group}</Link>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', margin: '14px 0 4px' }}>{lesson.key_stage} · {lesson.year_band} · Everything for this lesson</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 18px' }}>
          {lesson.title}
        </h1>

        {/* Purpose block: the what and the why, first, always */}
        <div style={{ ...card, borderColor: 'var(--gold)', borderWidth: '2px', marginBottom: '14px' }}>
          <div style={{ ...eyebrow, color: 'var(--gold-dark)', marginBottom: '8px' }}>Purpose · what pupils gain</div>
          <p style={{ ...body, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', marginBottom: '8px' }}>
            {lesson.single_action_outcome}
          </p>
          {notes.learning_objective && <p style={body}>{notes.learning_objective}</p>}
          {notes.timing && <p style={{ ...body, fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '8px' }}>{notes.timing}</p>}
        </div>

        {/* Statutory line: the coverage this lesson earns the school */}
        <div style={{ ...card, marginBottom: '22px' }}>
          <div style={{ ...eyebrow, marginBottom: '8px' }}>What this lesson covers for your records</div>
          <p style={{ ...body, fontSize: '13px' }}>{(lesson.statutory_hooks ?? []).join(' · ')}</p>
          <p style={{ ...body, fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '6px' }}>
            Education for a Connected World strand{(lesson.efcw_strands ?? []).length === 1 ? '' : 's'} {(lesson.efcw_strands ?? []).join(', ')} · {lesson.evidence_anchor}
          </p>
        </div>

        <PrepChecklist
          storageKey={`gc-prep-${cls.id}-${lesson.module_id}`}
          groups={[
            { heading: 'Before the lesson', items: before },
            { heading: 'During the lesson', items: during },
            { heading: 'After the lesson', items: after },
          ]}
        />

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '6px 0 26px' }}>
          <Link href={`/educator/teach/${lesson.module_id}`} style={{
            padding: '13px 24px', borderRadius: '16px', background: 'var(--gold)', color: 'var(--ink)',
            boxShadow: '0 5px 0 var(--gold-hover)', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
          }}>
            Teach the lesson
          </Link>
          <form action={recordDelivery}>
            <input type="hidden" name="class_id" value={cls.id} />
            <input type="hidden" name="lesson_id" value={lesson.id} />
            <button type="submit" style={{
              padding: '13px 24px', borderRadius: '16px', background: 'var(--green-lt)', color: 'var(--green-dark)',
              border: '2px solid var(--green-dark)', boxShadow: '0 5px 0 var(--green-dark)', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            }}>
              Taught it, take the register
            </button>
          </form>
        </div>

        {/* Teacher knowledge, inline so nothing needs hunting */}
        {(notes.misconceptions?.length || notes.differentiation || dsl.note || parent.family_question) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notes.misconceptions && notes.misconceptions.length > 0 && (
              <div style={card}>
                <div style={{ ...eyebrow, marginBottom: '8px' }}>Misconceptions to expect</div>
                {notes.misconceptions.map((m, i) => <p key={i} style={{ ...body, marginBottom: '4px' }}>· {m}</p>)}
              </div>
            )}
            {notes.differentiation && (
              <div style={card}>
                <div style={{ ...eyebrow, marginBottom: '8px' }}>Differentiation</div>
                {notes.differentiation.support && <p style={{ ...body, marginBottom: '4px' }}><strong>Support:</strong> {notes.differentiation.support}</p>}
                {notes.differentiation.stretch && <p style={body}><strong>Stretch:</strong> {notes.differentiation.stretch}</p>}
              </div>
            )}
            {dsl.note && (
              <div style={{ ...card, borderColor: 'var(--coral)', borderWidth: '2px' }}>
                <div style={{ ...eyebrow, color: 'var(--coral-dark)', marginBottom: '8px' }}>Safeguarding</div>
                <p style={body}>{dsl.note}</p>
              </div>
            )}
            {parent.family_question && (
              <div style={card}>
                <div style={{ ...eyebrow, marginBottom: '8px' }}>The question going home tonight</div>
                <p style={{ ...body, fontWeight: 700 }}>{parent.family_question}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
