import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { parseSlides, PHASE_LABELS, type LessonSlide } from '@/lib/content/lesson-slides'

// The unit overview: the whole lesson on one printable page for planning
// and the subject lead's file (the clean version of Jigsaw's Puzzle Map).
// Generated from the deck itself, so it can never disagree with the lesson.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink)', lineHeight: 1.55 }

const TYPE_LABELS: Record<string, string> = {
  title: 'Opening', objective: 'Objective', keywords: 'Keywords', concept: 'Teaching',
  quote: 'The chant', choice: 'Check', scenario: 'Evidence', diagram: 'Diagram',
  discussion: 'Talk task', stat: 'Evidence stat', tryit: 'Practice', recap: 'Recap',
  video: 'Video beat', digi: 'DiGi closing', interactive: 'Interactive',
}

function slideTitle(s: LessonSlide): string {
  switch (s.type) {
    case 'title': return s.title
    case 'objective': return s.outcome
    case 'keywords': return (s.words ?? []).map(w => w.word).join(', ')
    case 'concept': return s.heading
    case 'quote': return s.text
    case 'choice': return s.question
    case 'scenario': return `${s.handle}: ${s.text.slice(0, 80)}${s.text.length > 80 ? '...' : ''}`
    case 'diagram': return s.heading
    case 'discussion': return s.prompt
    case 'stat': return `${s.figure}: ${s.claim}`
    case 'tryit': return s.heading
    case 'recap': return s.heading
    case 'video': return s.caption ?? 'Video beat'
    case 'digi': return s.heading ?? 'DiGi closes the lesson'
    case 'interactive': return `${s.component} (interactive)`
  }
}

type TeacherNotes = { learning_objective?: string; timing?: string }

export default async function UnitOverviewPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const totalMinutes = slides.reduce((n, s) => n + (s.minutes ?? 0), 0)

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', background: '#fff', color: 'var(--ink)', padding: '24px 8px 60px' }}>
      <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link href="/educator/print" style={{ ...mono, textDecoration: 'none' }}>← Print room</Link>
        <PrintButton />
      </div>

      <div style={mono}>{lesson.key_stage} · {lesson.year_band} · Unit overview · for planning and the subject lead</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '4px 0 4px' }}>{lesson.title}</h1>
      <p style={{ ...body, marginBottom: '4px' }}>
        <strong>Outcome:</strong> {lesson.single_action_outcome}
        {lesson.character_cast ? <> · <strong>Cast:</strong> {lesson.character_cast}</> : null}
        {totalMinutes ? <> · <strong>~{totalMinutes} minutes</strong> in {slides.length} slides</> : null}
      </p>
      {notes.timing && <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)', marginBottom: '14px' }}>{notes.timing}</p>}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {['#', 'Phase', 'Kind', 'What happens', 'Min'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid var(--ink)', fontFamily: 'var(--font-display)', fontSize: '11.5px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slides.map((s, i) => (
            <tr key={i} style={{ pageBreakInside: 'avoid' }}>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>{i + 1}</td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {s.phase ? PHASE_LABELS[s.phase] : ''}
              </td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontWeight: 700, whiteSpace: 'nowrap' }}>{TYPE_LABELS[s.type] ?? s.type}</td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)' }}>{slideTitle(s)}</td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '10.5px' }}>{s.minutes ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ ...body, fontSize: '11px', color: 'var(--ink-muted)', marginTop: '14px' }}>
        Full resources for this module: paper pack, pupil booklets, knowledge organiser and named quizzes,
        all in the print room. Generated from the live lesson on {new Date().toLocaleDateString('en-GB')}.
      </p>
    </main>
  )
}
