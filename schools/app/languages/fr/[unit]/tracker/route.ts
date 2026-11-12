import { csvFile } from '@gc/shared/lesson-records'
import { assessedCodes, frenchUnit, teachingLessons } from '@/lib/languages/french'

// THE CLASS TRACKER, A SPREADSHEET THE SCHOOL KEEPS (11 November 2026, the
// progression review, amendment 8).
//
// The record on this site is counts, never names, and that is a decision
// (9 November). But a teacher does need to know WHO is below SOLO 4, for the
// report to parents and for who needs support. So the scheme's own statements
// go into a file the school downloads and fills in on its own computer:
// pupil down the side, each statement across the top, SOLO 3, 4 or 5 in each
// cell, twice a year as the scheme assesses them.
//
// NOTHING COMES BACK. This route sends a blank sheet and receives nothing.
// Names typed into it stay in the school's own files.
//
// Every column comes from the author's synced scheme (fr.json): the code, the
// statement, and what SOLO 3 and SOLO 4 look like in this unit.

export const dynamic = 'force-static'

export async function GET(_req: Request, { params }: { params: Promise<{ unit: string }> }) {
  const { unit } = await params
  const u = frenchUnit(unit)
  if (!u || !u.ready) return new Response('Not found', { status: 404 })
  const codes = assessedCodes(u)
  if (codes.length === 0) return new Response('Not found', { status: 404 })

  const rows: unknown[][] = [
    [`Year ${u.year}, half term ${u.ht}: ${u.fr} (${u.en})`],
    ['Enter SOLO 3, 4 or 5 for each pupil and statement. Keep this file in school. Nothing you type here is sent anywhere.'],
    [],
    ['Statement', ...codes.map(c => c.code)],
    ['What the pupil can do', ...codes.map(c => c.pupil)],
    ['SOLO 3 looks like', ...codes.map(c => c.s3)],
    ['SOLO 4 looks like', ...codes.map(c => c.s4)],
    [],
    ['Pupil', ...codes.flatMap(c => [c.code])],
    ...Array.from({ length: 34 }, () => ['', ...codes.map(() => '')]),
    [],
    [`${teachingLessons(u).length} lessons in this unit. Each statement is assessed twice a year in the scheme, so keep last time's level beside this one.`],
  ]
  return new Response(csvFile(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="french-class-tracker-y${u.year}-ht${u.ht}.csv"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
