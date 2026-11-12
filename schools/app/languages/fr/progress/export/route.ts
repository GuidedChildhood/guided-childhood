import {
  academicYear, cleanYear, csvFile, levelsIn, parseFrLessonKey, shareAtFourOrAbove,
} from '@gc/shared/lesson-records'
import { CODE_ORDER, frenchLesson, frenchUnit, lessonLabel } from '@/lib/languages/french'
import { readDeliveries, recordYears } from '@/lib/records'

// THE FRENCH RECORD AS A SPREADSHEET FILE (11 November 2026).
//
// The scheme reports "the number of pupils below SOLO 4, at SOLO 4 and at
// SOLO 5", so that is what a row is: one lesson delivered to one class, and
// for each statement counted that day, the three counts and the share at
// SOLO 4 or above. A lesson delivered and not counted is one row with the
// counts empty, because delivered is not assessed.
//
// Only the school the signed cookie names gets a file. No pupil is in it,
// because none is in the table.

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const thisYear = academicYear(new Date())
  const years = await recordYears('fr', thisYear)
  const year = cleanYear(new URL(req.url).searchParams.get('year'), years) ?? thisYear
  const { school, deliveries, failed } = await readDeliveries('fr', year)
  if (!school) return new Response('Your school code is needed to download the record.', { status: 403 })
  if (failed) return new Response('The record could not be read just now. Try again in a minute.', { status: 503 })

  const rows: unknown[][] = [['Date', 'Class', 'Half term', 'Lesson', 'Statement', 'Below SOLO 4', 'SOLO 4', 'SOLO 5', 'Share at SOLO 4 or above']]
  for (const d of deliveries) {
    const key = parseFrLessonKey(d.lessonKey)
    const unit = key ? frenchUnit(key.unitKey) : null
    const lesson = unit && key ? frenchLesson(unit, key.n) : null
    const head = [d.deliveredOn, d.groups.join(' and '), unit ? `Year ${unit.year}, half term ${unit.ht}, ${unit.en}` : '', lesson ? `${lessonLabel(lesson)}: ${lesson.title}` : d.lessonKey]
    const counted = CODE_ORDER.map(code => ({ code, l: levelsIn(d.marks, code) })).filter(c => c.l)
    if (counted.length === 0) { rows.push([...head, '', '', '', '', '']); continue }
    for (const { code, l } of counted) {
      const share = shareAtFourOrAbove(l!)
      rows.push([...head, code, l!.s3, l!.s4, l!.s5, share === null ? '' : `${share}%`])
    }
  }
  return new Response(csvFile(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="french-record-${year}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
