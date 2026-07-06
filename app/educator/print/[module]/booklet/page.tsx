import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { parseSlides } from '@/lib/content/lesson-slides'
import PrintButton from '../PrintButton'

// The pupil booklet: the little companion each child holds BEFORE and
// DURING the lesson (JP brief, 6 Jul 2026). Photocopy per pupil, fold in
// half. Pages: cover with the character and a name line, the rundown of
// what today is about, the follow along pages per learning cycle, and
// the mission page. Kid facing register: big type, the character present,
// spaces that belong to the child. Generated from the lesson row.

type WorksheetItem = { n: number; item: string; expected_verdict: string; teaching_point: string }
type TeacherNotes = { worksheet_items?: WorksheetItem[] }
type ParentNote = { family_question?: string }

const page: React.CSSProperties = { pageBreakAfter: 'always', padding: '28px 20px', minHeight: '250mm' }
const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dark)' }
const big: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.15 }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }
const writeLine: React.CSSProperties = { borderBottom: '2px solid var(--border)', height: '34px' }
const star = (size: number): React.CSSProperties => ({ fontSize: `${size}px`, lineHeight: 1 })

export default async function PupilBookletPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes, parent_note')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const concepts = slides.filter(s => s.type === 'concept') as { heading: string; body: string; emoji?: string }[]
  const quote = slides.find(s => s.type === 'quote') as { text: string; label?: string } | undefined
  const items = ((lesson.teacher_notes ?? {}) as TeacherNotes).worksheet_items ?? []
  const familyQuestion = ((lesson.parent_note ?? {}) as ParentNote).family_question
  const characterName = (lesson.character_cast ?? 'DiGi').split(' ')[0]

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff' }}>
      <div className="no-print" style={{ padding: '20px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={mono}>Pupil booklet · photocopy per pupil</span>
        <PrintButton />
      </div>

      {/* Cover */}
      <section style={{ ...page, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={star(64)}>⭐</div>
        <div style={{ ...mono, margin: '18px 0 10px' }}>{characterName} needs a detective</div>
        <h1 style={{ ...big, fontSize: '34px', margin: '0 auto 18px', maxWidth: '520px' }}>{lesson.title}</h1>
        <p style={{ ...body, fontSize: '16px', color: 'var(--ink-soft)', maxWidth: '420px', margin: '0 auto 40px' }}>
          By the end of this lesson: {lesson.single_action_outcome.replace('I can', 'you can')}
        </p>
        <div style={{ maxWidth: '380px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
          <div style={{ ...mono, color: 'var(--ink-muted)', marginBottom: '6px' }}>This booklet belongs to</div>
          <div style={writeLine} />
        </div>
      </section>

      {/* The rundown */}
      <section style={page}>
        <div style={mono}>Before we start · the rundown</div>
        <h2 style={{ ...big, fontSize: '26px', margin: '8px 0 20px' }}>What today is about</h2>
        {concepts.slice(0, 3).map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '16px 18px', marginBottom: '12px' }}>
            <span style={{
              flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold)',
              color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{i + 1}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '4px' }}>
                {c.emoji ? `${c.emoji} ` : ''}{c.heading}
              </div>
            </div>
          </div>
        ))}
        {quote && (
          <div style={{ background: 'var(--gold-lt)', border: '2px solid var(--gold)', borderRadius: '16px', padding: '18px 20px', marginTop: '20px' }}>
            <div style={{ ...mono, marginBottom: '8px' }}>{quote.label ?? `Say it like ${characterName}`}</div>
            <p style={{ ...body, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px' }}>{quote.text}</p>
          </div>
        )}
      </section>

      {/* Follow along: my verdicts */}
      <section style={page}>
        <div style={mono}>During the lesson · your case file</div>
        <h2 style={{ ...big, fontSize: '26px', margin: '8px 0 6px' }}>My verdicts</h2>
        <p style={{ ...body, color: 'var(--ink-soft)', marginBottom: '16px' }}>Circle your verdict for each case. A detective always gives a reason.</p>
        {items.map(it => (
          <div key={it.n} style={{ border: '1.5px solid var(--border)', borderRadius: '16px', padding: '14px 16px', marginBottom: '10px' }}>
            <p style={{ ...body, fontWeight: 700, marginBottom: '8px' }}>Case {it.n}: {it.item}</p>
            <p style={{ ...body, fontSize: '14px' }}>Believe &nbsp;·&nbsp; Pause &nbsp;·&nbsp; Do not share</p>
            <div style={{ ...writeLine, height: '26px' }} />
          </div>
        ))}
      </section>

      {/* Mission page */}
      <section style={{ ...page, pageBreakAfter: 'auto' }}>
        <div style={mono}>After the lesson · your mission</div>
        <h2 style={{ ...big, fontSize: '26px', margin: '8px 0 16px' }}>Take it home</h2>
        <div style={{ background: 'var(--green-lt)', border: '2px solid var(--green)', borderRadius: '16px', padding: '18px 20px', marginBottom: '16px' }}>
          <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: '8px' }}>My mission</div>
          <p style={{ ...body, fontWeight: 700 }}>The next time I see a shocking post I will...</p>
          <div style={writeLine} />
        </div>
        {familyQuestion && (
          <div style={{ border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ ...mono, color: 'var(--ink-muted)', marginBottom: '8px' }}>Ask at home tonight</div>
            <p style={{ ...body, fontWeight: 700 }}>{familyQuestion}</p>
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: '32px' }}><span style={star(40)}>⭐</span></p>
        <p style={{ ...body, textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px' }}>Case closed, detective. {characterName} is proud of you.</p>
      </section>
    </main>
  )
}
