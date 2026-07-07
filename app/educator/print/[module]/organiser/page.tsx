import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { parseSlides, type ObjectiveSlide, type KeywordsSlide } from '@/lib/content/lesson-slides'

// The pupil Knowledge Organiser (Jigsaw PKO equivalent, cleaner): one
// page per module. What I am learning, my words, the tool, and the
// before and after reflection so pupils see their own learning move.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }
const box: React.CSSProperties = { border: '1.5px solid var(--border)', borderRadius: '14px', padding: '14px 18px', marginBottom: '12px' }
const writeLine: React.CSSProperties = { borderBottom: '1px solid var(--border)', height: '24px' }

type TeacherNotes = {
  keywords?: { word: string; definition: string }[]
  tool?: { heading?: string; lines?: string[]; strapline?: string }
}

export default async function KnowledgeOrganiserPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, slides, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const objective = slides.find((s): s is ObjectiveSlide => s.type === 'objective')
  const keywordSlide = slides.find((s): s is KeywordsSlide => s.type === 'keywords')
  const words = notes.keywords ?? keywordSlide?.words.map(w => ({ word: w.word, definition: w.meaning })) ?? []
  const tool = notes.tool ?? {
    heading: 'The three checks',
    lines: ['1. Who made this, and how do they know?', '2. What do other places say?', '3. How is it trying to make me feel?'],
    strapline: 'Three checks, under a minute.',
  }

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff', color: 'var(--ink)', padding: '24px 8px 60px' }}>
      <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link href="/educator/print" style={{ ...mono, textDecoration: 'none' }}>← Print room</Link>
        <PrintButton label="Print, one per pupil" />
      </div>

      <div style={mono}>{lesson.key_stage} · {lesson.year_band} · My knowledge organiser</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '4px 0 2px' }}>{lesson.title}</h1>
      <p style={{ ...body, display: 'flex', gap: '16px', margin: '6px 0 14px' }}>
        <span>Name: ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁</span>
        <span>Class: ▁▁▁▁▁▁▁▁</span>
      </p>

      <div style={{ ...box, border: '2px solid var(--gold, #F2C94C)', background: 'var(--cream)' }}>
        <div style={{ ...mono, color: 'var(--gold-dark, #7A5A0E)' }}>By the end I can say</div>
        <p style={{ ...body, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', marginTop: '6px' }}>
          &ldquo;{lesson.single_action_outcome}&rdquo;
        </p>
      </div>

      <div style={box}>
        <div style={mono}>Before we start · what do I already think about this?</div>
        <div style={{ marginTop: '8px' }}><div style={writeLine} /><div style={writeLine} /></div>
      </div>

      {objective && (
        <div style={box}>
          <div style={mono}>What I am learning to do</div>
          {objective.gains.map((g, i) => (
            <p key={i} style={{ ...body, marginTop: '6px' }}>☐ {g}</p>
          ))}
        </div>
      )}

      {words.length > 0 && (
        <div style={box}>
          <div style={mono}>My words for this topic</div>
          {words.map(w => (
            <p key={w.word} style={{ ...body, marginTop: '6px' }}>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{w.word}</strong> · {w.definition}
            </p>
          ))}
        </div>
      )}

      <div style={{ ...box, border: '2px solid var(--green-dark, #2E7D5A)' }}>
        <div style={{ ...mono, color: 'var(--green-dark, #2E7D5A)' }}>{tool.heading} · learn this by heart</div>
        {(tool.lines ?? []).map((line, i) => (
          <p key={i} style={{ ...body, fontWeight: 800, marginTop: '6px' }}>{line}</p>
        ))}
        {tool.strapline && <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '6px' }}>{tool.strapline}</p>}
      </div>

      <div style={box}>
        <div style={mono}>After the lesson · what changed in my thinking?</div>
        <div style={{ marginTop: '8px' }}><div style={writeLine} /><div style={writeLine} /></div>
        <p style={{ ...body, fontWeight: 700, marginTop: '10px' }}>One place I will use this in real life:</p>
        <div style={writeLine} />
      </div>

      <p style={{ ...mono, fontSize: '9px', textAlign: 'center', marginTop: '10px' }}>
        GUIDED CHILDHOOD SCHOOLS · KEEP THIS IN YOUR BOOK
      </p>
    </main>
  )
}
