import {
  academicYear, cleanYear, csvFile, JUDGEMENT_LABEL, JUDGEMENTS, type Judgement,
} from '@gc/shared/lesson-records'
import { CURRICULUM, KEY_STAGE_META } from '@gc/shared/schools-curriculum'
import { asList } from '@/lib/notes'
import { readDeliveries, recordYears } from '@/lib/records'
import { db as supabase } from '@/lib/supabase/server-db'

// THE SCHOOL'S RECORD AS A SPREADSHEET FILE (11 November 2026).
//
// One row for each time a lesson was delivered: the date, the class, the
// lesson, the teacher's judgement of the class, the objectives marked as
// needing revisiting, and the note. It is the school's own data, so the school
// can take it wherever it already keeps its evidence.
//
// WHO GETS IT. Only the school the signed cookie names (readDeliveries reads
// the school on the server and takes none from the address). Nobody with a
// code, or no code at all, gets an empty 403, never another school's file.
//
// NO PUPIL. There is none in the table to send. Never cached anywhere.

export const dynamic = 'force-dynamic'

const isJudgement = (v: unknown): v is Judgement => typeof v === 'string' && (JUDGEMENTS as string[]).includes(v)

export async function GET(req: Request) {
  const thisYear = academicYear(new Date())
  const years = await recordYears('digital', thisYear)
  const year = cleanYear(new URL(req.url).searchParams.get('year'), years) ?? thisYear
  const { school, deliveries, failed } = await readDeliveries('digital', year)
  if (!school) return new Response('Your school code is needed to download the record.', { status: 403 })
  if (failed) return new Response('The record could not be read just now. Try again in a minute.', { status: 503 })

  const byId = new Map(CURRICULUM.map(m => [m.moduleId, m]))
  const marked = [...new Set(deliveries.filter(d => Object.values(d.marks).some(v => v === 'revisit')).map(d => d.lessonKey))]
  const iCan = new Map<string, string[]>()
  if (marked.length > 0) {
    const { data } = await supabase.from('school_lessons').select('module_id, teacher_notes').in('module_id', marked)
    for (const r of (data ?? []) as { module_id: string; teacher_notes: { i_can?: unknown } | null }[]) iCan.set(r.module_id, asList(r.teacher_notes?.i_can))
  }

  const rows: unknown[][] = [['Date', 'Class', 'Key stage', 'Lesson', 'Judgement of the class', 'Objectives needing revisiting', 'Note']]
  for (const d of deliveries) {
    const m = byId.get(d.lessonKey)
    const again = Object.entries(d.marks).filter(([, v]) => v === 'revisit')
      .map(([i]) => iCan.get(d.lessonKey)?.[Number(i)]).filter((t): t is string => !!t)
    rows.push([
      d.deliveredOn,
      d.groups.join(' and '),
      m ? KEY_STAGE_META[m.keyStage].label : '',
      m?.title ?? d.lessonKey,
      isJudgement(d.assessment) ? JUDGEMENT_LABEL[d.assessment] : 'Not assessed',
      again.join('; '),
      d.note ?? '',
    ])
  }
  return new Response(csvFile(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="lesson-record-${year}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
