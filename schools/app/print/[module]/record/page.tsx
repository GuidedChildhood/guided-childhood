import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/PrintButton'
import { MarkOnPrint } from '@/components/tracker/signals'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'
import { friendFor, printRegister, mono, display, text, FriendHeader, PrintSheet, Box, WriteLines, ColourStar } from '@/components/print/kit'
import { asList } from '@/lib/notes'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title
  return { robots: { index: false, follow: false }, title: title ? `Learning record: ${title}` : 'Learning record: Module' }
}

// MY LEARNING RECORD, one side of A4, photocopied per pupil, on the print kit.
//
// The move is Jigsaw's and it is the cheapest real differentiator on the
// list: the child colours in the "I can" they think they reached, the
// teacher colours in theirs beside it, and then the two of them talk about
// the gap. The conversation is the assessment. Since 14 September the stars
// are real stars to colour, the friend is proud at the top of the page, and
// the promise box is in the friend's tint.
//
// Honesty rule, printed at the foot: these descriptors are ours and are not
// nationally recognised. Three statements, always in child language, always
// starting "I can", from teacher_notes.i_can; a lesson without them simply
// has no sheet rather than an empty one.

export const revalidate = 3600

type TeacherNotes = { i_can?: string[] | string }
type Lesson = {
  module_id: string
  title: string
  key_stage: string
  year_band: string
  single_action_outcome: string
  character_cast: string | null
  teacher_notes: TeacherNotes | null
}

export default async function LearningRecordPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const { data } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  const lesson = data as Lesson | null
  if (!lesson) notFound()
  const statements = asList(lesson.teacher_notes?.i_can)
  if (statements.length === 0) notFound()

  const friend = friendFor(lesson.character_cast, lesson.key_stage)
  const reg = printRegister(lesson.key_stage)
  const young = reg.key === 'bouncy'
  const starSize = young ? 52 : 40

  return (
    <main style={{ background: '#fff', color: 'var(--ink)', padding: '0 8px 40px', maxWidth: '740px', margin: '0 auto' }}>
      {/* The learning record, where the lesson has `i can` statements. Its row
            only exists on those lessons.
            `beforeprint`, so ctrl P counts as much as our button. */}
      <MarkOnPrint moduleId={moduleId} step="record" />
      <div className="no-print" style={{ padding: '20px 0 0', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <PrintButton label="Print the record" />
      </div>
      <PrintSheet footer={`${lesson.title} · my learning record`} last>
        <FriendHeader friend={friend} register={reg} mood="happy" eyebrow={`Photocopy per pupil · ${lesson.year_band} · My learning record`} title={lesson.title} nameLine="Name and date" />
        <p style={{ ...text, fontSize: reg.body, margin: '4px 0 12px' }}>
          Colour the star that feels true for you. Your teacher colours the other one. Then have a little talk about them together.
        </p>
        {statements.map((s, i) => (
          <div key={i} className="gc-avoid-break" style={{ border: '1.5px solid var(--ink-light)', borderRadius: `${reg.radius}px`, padding: young ? '16px 20px' : '12px 18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <p style={{ ...display, fontWeight: 800, fontSize: young ? 'var(--text-lg)' : 'var(--text-md)', lineHeight: 1.35, flex: '1 1 auto' }}>{s}</p>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
              <ColourStar size={starSize} label="Me" />
              <ColourStar size={starSize} label="Teacher" />
            </div>
          </div>
        ))}
        <Box label="The one thing I will do" friend={friend} tint radius={reg.radius}>
          <p style={{ ...text, fontSize: reg.body, fontWeight: 700 }}>{lesson.single_action_outcome}</p>
          <WriteLines n={2} height={reg.lineHeight} color={friend.accent} />
        </Box>
        <p style={{ ...text, fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '14px' }}>
          These statements are ours and they are not nationally recognised. They are here to make a
          conversation between a child and their teacher easier, not to produce a score.
        </p>
        <PrintBrandFooter />
      </PrintSheet>
    </main>
  )
}
