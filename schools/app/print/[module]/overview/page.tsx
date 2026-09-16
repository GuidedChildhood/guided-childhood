import { db as supabase } from '@/lib/supabase/server-db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { parseSlides, PHASE_LABELS, type LessonSlide } from '@gc/shared/lesson-slides'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'
import { friendFor, printRegister, FriendHeader, PrintSheet } from '@/components/print/kit'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title
  return { title: title ? `Unit overview: ${title}` : 'Unit overview: Module' }
}

// The unit overview: the whole lesson on one printable page for planning
// and the subject lead's file (the clean version of Jigsaw's Puzzle Map).
// Generated from the deck itself, so it can never disagree with the lesson.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55 }

const TYPE_LABELS: Record<string, string> = {
  title: 'Opening', objective: 'Objective', keywords: 'Keywords', concept: 'Teaching',
  quote: 'The chant', choice: 'Check', scenario: 'Evidence', diagram: 'Diagram',
  discussion: 'Talk task', stat: 'Evidence stat', tryit: 'Practice', recap: 'Recap',
  video: 'Video beat', digi: 'Character moment', interactive: 'Interactive',
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

export const revalidate = 3600

export default async function UnitOverviewPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const totalMinutes = slides.reduce((n, s) => n + (s.minutes ?? 0), 0)
  // The friend as a mark on a teacher sheet, and its colour on the table
  // (the print kit, 14 September 2026).
  const friend = friendFor((lesson as { character_cast?: string | null }).character_cast, lesson.key_stage)
  const reg = printRegister(lesson.key_stage)

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', background: '#fff', color: 'var(--ink)', padding: '0 8px 40px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '20px 0 0', marginBottom: '8px' }}>
        <Link href="/print" style={{ ...mono, textDecoration: 'none' }}>← Print room</Link>
        <PrintButton />
      </div>
      <PrintSheet footer={`${lesson.title} · unit overview`} last>
      <FriendHeader friend={friend} register={reg} small mood="thinking" eyebrow={`${lesson.key_stage} · ${lesson.year_band} · Unit overview · for planning and the subject lead`} title={lesson.title} sub={`Outcome: ${lesson.single_action_outcome}${lesson.character_cast ? ` · Cast: ${lesson.character_cast}` : ''}${totalMinutes ? ` · about ${totalMinutes} minutes in ${slides.length} slides` : ''}`} />
      {notes.timing && <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginBottom: '14px' }}>{notes.timing}</p>}

      {/* The table scrolls inside its own frame on a phone; the page itself never scrolls sideways. */}
      <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {['#', 'Phase', 'Kind', 'What happens', 'Min'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: `2px solid ${friend.accent}`, background: friend.soft, color: friend.ink, fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slides.map((s, i) => (
            <tr key={i} style={{ pageBreakInside: 'avoid' }}>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{i + 1}</td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {s.phase ? PHASE_LABELS[s.phase] : ''}
              </td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontWeight: 700, whiteSpace: 'nowrap' }}>{TYPE_LABELS[s.type] ?? s.type}</td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)' }}>{slideTitle(s)}</td>
              <td style={{ ...body, padding: '5px 8px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{s.minutes ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '14px' }}>
        Full resources for this module: paper pack, pupil booklets, knowledge organiser and named quizzes,
        all in the print room. Generated from the live lesson on {new Date().toLocaleDateString('en-GB')}.
      </p>
      </PrintSheet>
    </main>
  )
}
