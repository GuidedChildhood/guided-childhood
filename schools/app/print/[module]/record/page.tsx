import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/PrintButton'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'

// MY LEARNING RECORD, one side of A4, photocopied per pupil.
//
// The move is Jigsaw's and it is the cheapest real differentiator on the
// list: the child colours in the "I can" they think they reached, the
// teacher colours in theirs beside it, and then the two of them talk about
// the gap. The conversation is the assessment. A grid the teacher fills in
// alone tells you what the teacher thinks; this tells you what the child
// thinks, which is the thing you can actually teach into.
//
// Honesty rule, copied from Jigsaw in spirit and printed at the foot of the
// page: these descriptors are ours and are not nationally recognised. A head
// teacher has been sold overclaimed progression data many times, and naming
// the limit of your own measure buys more trust than another badge would.
//
// Three statements, always three, always in child language and always
// starting "I can". They live in teacher_notes.i_can so a lesson that has
// not been written up yet simply does not offer the sheet, rather than
// printing an empty one.

export const revalidate = 3600

type TeacherNotes = { i_can?: string[] }
type Lesson = {
  module_id: string
  title: string
  year_band: string
  single_action_outcome: string
  teacher_notes: TeacherNotes | null
}

export const metadata = { title: 'My learning record', robots: { index: false, follow: false } }

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666',
}

export default async function LearningRecordPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data } = await supabase
    .from('school_lessons')
    .select('module_id, title, year_band, single_action_outcome, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const statements = lesson.teacher_notes?.i_can ?? []
  if (statements.length === 0) notFound()

  return (
    <main style={{ background: '#fff', color: '#111', padding: '28px 30px', maxWidth: '820px', margin: '0 auto' }}>
      <PrintButton label="Print the record" />

      <div style={mono}>Photocopy per pupil · {lesson.year_band} · My learning record</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px',
        letterSpacing: '-0.02em', lineHeight: 1.15, margin: '6px 0 4px',
      }}>
        {lesson.title}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#444', lineHeight: 1.6, marginBottom: '4px' }}>
        Name: <span style={{ borderBottom: '1px solid #999', display: 'inline-block', width: '220px' }} />
        &nbsp;&nbsp;Date: <span style={{ borderBottom: '1px solid #999', display: 'inline-block', width: '120px' }} />
      </p>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#111', lineHeight: 1.6, margin: '16px 0 14px' }}>
        Colour the star that feels true for you. Your teacher colours the other one. Then have a
        little talk about them together.
      </p>

      {statements.map((s, i) => (
        <div key={i} style={{
          border: '1.5px solid #111', borderRadius: '12px',
          padding: '16px 18px', marginBottom: '12px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px',
            lineHeight: 1.4, flex: 1, margin: 0,
          }}>
            {s}
          </p>
          <div style={{ display: 'flex', gap: '14px', flexShrink: 0, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '32px', lineHeight: 1, color: '#111' }}>☆</div>
              <div style={{ ...mono, marginTop: '4px' }}>Me</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', lineHeight: 1, color: '#111' }}>☆</div>
              <div style={{ ...mono, marginTop: '4px' }}>Teacher</div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ border: '1.5px dashed #111', borderRadius: '12px', padding: '16px 18px', marginTop: '16px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', margin: '0 0 10px' }}>
          The one thing I will do
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#111', margin: '0 0 10px' }}>
          {lesson.single_action_outcome}
        </p>
        <div style={{ borderBottom: '1px solid #999', height: '22px' }} />
        <div style={{ borderBottom: '1px solid #999', height: '22px', marginTop: '10px' }} />
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#666', lineHeight: 1.5, marginTop: '18px' }}>
        These statements are ours and they are not nationally recognised. They are here to make a
        conversation between a child and their teacher easier, not to produce a score.
      </p>

      <PrintBrandFooter />
    </main>
  )
}
