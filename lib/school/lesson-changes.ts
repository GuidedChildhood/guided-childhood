// THE WEEKLY LESSON CHANGES DIGEST, AS RULES (22 November 2026).
//
// Teachers can write one line on a lesson record: "What would you change about
// this lesson?" (schools.lesson_records.would_change, migration 403). Once a
// week Justin gets every line written that week, grouped by lesson, beside how
// often that lesson was judged as needing a revisit. This file turns rows into
// that grouping and the email; the cron (app/api/cron/lesson-changes) only
// reads and sends. No school is named: a school is a pseudonym, and the digest
// counts schools rather than naming them.

export type ChangeRow = {
  lesson_key: string
  school_ref: string
  assessment: string
  objective_marks: Record<string, unknown> | null
  would_change: string | null
}

export type LessonDigest = {
  lessonKey: string
  title: string
  assessed: number      // records judged this week
  revisit: number       // of those, judged as needing a revisit (whole class or any objective)
  schools: number
  lines: string[]
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A record counts as a revisit when the class, or any one objective, was
 *  judged as needing it. The quiz counts key is not an objective. */
export function needsRevisit(r: Pick<ChangeRow, 'assessment' | 'objective_marks'>): boolean {
  if (r.assessment === 'revisit') return true
  return Object.entries(r.objective_marks ?? {}).some(([k, v]) => !k.startsWith('_') && v === 'revisit')
}

/** Rows grouped per lesson, lessons with a line first, then the most revisits. */
export function digestOf(rows: ChangeRow[], titles: Record<string, string>): LessonDigest[] {
  const by = new Map<string, LessonDigest & { refs: Set<string> }>()
  for (const r of rows) {
    const d = by.get(r.lesson_key) ?? { lessonKey: r.lesson_key, title: titles[r.lesson_key] ?? r.lesson_key, assessed: 0, revisit: 0, schools: 0, lines: [], refs: new Set<string>() }
    if (r.assessment !== 'not_assessed' || Object.keys(r.objective_marks ?? {}).length > 0) d.assessed++
    if (needsRevisit(r)) d.revisit++
    const line = r.would_change?.replace(/\s+/g, ' ').trim()
    if (line) d.lines.push(line.slice(0, 280))
    d.refs.add(r.school_ref)
    by.set(r.lesson_key, d)
  }
  return [...by.values()]
    .map(({ refs, ...d }) => ({ ...d, schools: refs.size }))
    .filter(d => d.lines.length > 0 || d.revisit > 0)
    .sort((a, b) => (b.lines.length > 0 ? 1 : 0) - (a.lines.length > 0 ? 1 : 0) || b.revisit - a.revisit || b.lines.length - a.lines.length)
}

/** The email. Escaped, because every line is a teacher's free text. */
export function digestEmail(lessons: LessonDigest[]): { subject: string; html: string } {
  const lines = lessons.reduce((n, l) => n + l.lines.length, 0)
  const subject = lines > 0
    ? `What teachers would change: ${lines} line${lines === 1 ? '' : 's'} this week`
    : 'Lessons judged as needing a revisit this week'
  const block = (l: LessonDigest) => `
    <div style="border:1px solid #1A1A2E;border-radius:12px;padding:12px 14px;margin:0 0 10px;"><!-- hex-ok: email html, no custom properties in a mail client -->
      <p style="font-size:15px;font-weight:bold;margin:0 0 4px;">${esc(l.title)}</p>
      <p style="font-size:12px;color:#55556E;margin:0 0 6px;">${l.revisit} of ${l.assessed} judged ${l.assessed === 1 ? 'record' : 'records'} needing a revisit, from ${l.schools} school${l.schools === 1 ? '' : 's'}</p>
      ${l.lines.map(t => `<p style="font-size:14px;line-height:1.55;margin:6px 0 0;">&ldquo;${esc(t)}&rdquo;</p>`).join('')}
    </div>`
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1A1A2E;max-width:600px;"><!-- hex-ok: email html, no custom properties in a mail client -->
      <h1 style="font-size:20px;margin:0 0 6px;">What teachers would change</h1>
      <p style="font-size:13px;line-height:1.6;margin:0 0 14px;">Every line a teacher wrote on a lesson record this week, with how often that lesson was judged as needing a revisit. Lessons with a line come first. Worth a change to the lesson when two schools say the same thing, or the revisits keep coming.</p>
      ${lessons.map(block).join('')}
    </div>`
  return { subject, html }
}
