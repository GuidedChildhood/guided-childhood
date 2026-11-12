'use server'

import { createHash } from 'node:crypto'
import {
  academicYear, canUndo, cleanDeliveredOn, cleanGroups, cleanJudgement, cleanLevels, cleanNote, cleanObjectiveMarks, cleanQuizCounts, frLessonKey, isoDate,
  parseFrLessonKey, QUIZ_KEY, yearGroupsOf, type Assessment, type Delivery, type Subject,
} from '@gc/shared/lesson-records'
import { cleanModuleId } from '@gc/shared/parent-share'
import { codesToRecord, frenchLesson, frenchUnit } from '@/lib/languages/french'
import { asList } from '@/lib/notes'
import { readDeliveries, readOwnDelivery, recordsDb, recordsSchool } from '@/lib/records'

// MARK LESSON DELIVERED, AND HOW THE CLASS DID (10 November 2026).
//
// Three actions behind the one button (plans/2026-11-10-lesson-run-and-records-plan.md):
//
//   markDelivered   this school taught this lesson to these classes today
//   assessDelivery  optionally, how they did
//   undoDelivery    for ten minutes, take it back
//
// THE SCHOOL IS NEVER AN ARGUMENT. Each action reads it from the signed cookie
// (lib/records.ts). A caller can name a lesson, a class and a count; it cannot
// name a school, so one school cannot write to or read from another's record
// however the request is built.
//
// THE LESSON IS CHECKED, NOT TRUSTED. A French lesson must be a ready unit's
// real lesson in the scheme's own data; a digital lesson must be a row in
// schools.school_lessons. The version taught is hashed here, at the moment it
// is recorded, so a report can later say which version a class met.
//
// EVERY CHANGE LEAVES A LINE in schools.lesson_record_events.

export type RecordResult = { ok: true; delivery: Delivery } | { ok: false; error: string }

const NO_SCHOOL = 'Your school code is needed to save this. Open the lesson again from your school link.'
const NOT_SAVED = 'That did not save. Nothing was recorded, so it is safe to press again.'

const md5 = (v: unknown) => createHash('md5').update(JSON.stringify(v) ?? '').digest('hex')

type Lesson = { key: string; hash: string; objectives: number; codes: string[] }

/** The lesson a key names, checked against the scheme, or null. */
async function lessonOf(subject: Subject, lessonKey: unknown): Promise<Lesson | null> {
  if (typeof lessonKey !== 'string') return null
  if (subject === 'fr') {
    const parsed = parseFrLessonKey(lessonKey)
    const u = parsed ? frenchUnit(parsed.unitKey) : null
    const l = u?.ready && parsed ? frenchLesson(u, parsed.n) : null
    if (!u || !l) return null
    return { key: frLessonKey(u.key, l.n), hash: md5([l.title, l.detail, l.deck]), objectives: 0, codes: codesToRecord(u, l).map(c => c.code) }
  }
  const id = cleanModuleId(lessonKey)
  if (!id) return null
  const { data } = await recordsDb.from('school_lessons').select('module_id, slides, assessment, teacher_notes').eq('module_id', id).maybeSingle()
  const row = data as { module_id: string; slides: unknown; assessment: unknown; teacher_notes: { i_can?: string[] | string } | null } | null
  if (!row) return null
  return { key: row.module_id, hash: md5([row.slides, row.assessment]), objectives: asList(row.teacher_notes?.i_can).length, codes: [] }
}

const isSubject = (v: unknown): v is Subject => v === 'digital' || v === 'fr'

async function logEvent(delivery_id: string, school_ref: string, action: string, before: unknown, after: unknown) {
  const { error } = await recordsDb.from('lesson_record_events').insert({ delivery_id, school_ref, action, before, after })
  if (error) console.error('[records] event not logged:', error.message)
}

/** What this school has recorded for one lesson this academic year. The pages
 *  that carry the button are static and cached, so the button asks for its own
 *  state when it appears, and a page is never rendered per school. */
export async function lessonRecord(input: { subject: Subject; lessonKey: string }): Promise<{ school: boolean; failed: boolean; deliveries: Delivery[] }> {
  if (!isSubject(input?.subject) || typeof input.lessonKey !== 'string') return { school: false, failed: false, deliveries: [] }
  return readDeliveries(input.subject, academicYear(new Date()), input.lessonKey)
}

export async function markDelivered(input: { subject: Subject; lessonKey: string; groups: string[]; deliveredOn?: string }): Promise<RecordResult> {
  if (!isSubject(input?.subject)) return { ok: false, error: NOT_SAVED }
  const ref = await recordsSchool(input.subject)
  if (!ref) return { ok: false, error: NO_SCHOOL }
  const groups = cleanGroups(input.groups)
  if (!groups) return { ok: false, error: 'Add the class first, such as 4B or Maple. Letters and numbers only, and never a person’s name.' }
  const lesson = await lessonOf(input.subject, input.lessonKey)
  if (!lesson) return { ok: false, error: 'That lesson could not be found, so nothing was recorded.' }

  // Today, unless the teacher says it was taught on an earlier day. A lesson
  // marked on Monday for last Friday belongs to Friday, and to Friday's
  // academic year.
  const now = new Date()
  const today = cleanDeliveredOn(input.deliveredOn, now) ?? isoDate(now)

  // A second tap, or a second laptop in the same room, is the same lesson.
  const { data: same } = await recordsDb.from('lesson_records').select('id')
    .eq('school_ref', ref).eq('subject', input.subject).eq('lesson_key', lesson.key)
    .eq('delivered_on', today).eq('status', 'delivered').contains('groups', groups).containedBy('groups', groups).limit(1)
  const existing = (same as { id: string }[] | null)?.[0]
  if (existing) {
    const had = await readOwnDelivery(ref, existing.id)
    if (had) return { ok: true, delivery: had }
  }

  const { data, error } = await recordsDb.from('lesson_records').insert({
    school_ref: ref,
    subject: input.subject,
    lesson_key: lesson.key,
    content_hash: lesson.hash,
    delivered_on: today,
    academic_year: academicYear(new Date(`${today}T12:00:00Z`)),
    groups,
    year_groups: yearGroupsOf(groups),
  }).select('id').single()
  const id = (data as { id: string } | null)?.id
  if (error || !id) {
    if (error) console.error('[records] delivery not saved:', error.message)
    return { ok: false, error: NOT_SAVED }
  }
  await logEvent(id, ref, 'created', null, { lesson_key: lesson.key, groups, delivered_on: today })
  const delivery = await readOwnDelivery(ref, id)
  return delivery ? { ok: true, delivery } : { ok: false, error: NOT_SAVED }
}

export async function assessDelivery(input: {
  subject: Subject; id: string; judgement?: string; objectiveMarks?: unknown; levels?: unknown; note?: string; quiz?: unknown
}): Promise<RecordResult> {
  if (!isSubject(input?.subject)) return { ok: false, error: NOT_SAVED }
  const ref = await recordsSchool(input.subject)
  if (!ref) return { ok: false, error: NO_SCHOOL }
  const before = await readOwnDelivery(ref, String(input.id ?? ''))
  if (!before || before.subject !== input.subject) return { ok: false, error: 'That record could not be found. It may have been undone on another screen.' }
  const lesson = await lessonOf(input.subject, before.lessonKey)
  if (!lesson) return { ok: false, error: NOT_SAVED }

  let assessment: Assessment = 'not_assessed'
  let marks: Record<string, unknown> = {}
  if (input.subject === 'fr') {
    marks = cleanLevels(input.levels, lesson.codes)
    if (Object.keys(marks).length > 0) assessment = 'levels'
  } else {
    marks = cleanObjectiveMarks(input.objectiveMarks, lesson.objectives)
    assessment = cleanJudgement(input.judgement) ?? 'not_assessed'
    // The class counts on the starter and exit quizzes, when given. Three
    // whole numbers, cleaned by the shared rule, kept beside the judgements.
    const quiz = cleanQuizCounts(input.quiz)
    if (quiz) marks[QUIZ_KEY] = quiz
  }
  const note = cleanNote(input.note)
  const after = { assessment, objective_marks: marks, note }

  const { error } = await recordsDb.from('lesson_records')
    .update({ ...after, updated_at: new Date().toISOString() })
    .eq('id', before.id).eq('school_ref', ref)
  if (error) {
    console.error('[records] assessment not saved:', error.message)
    return { ok: false, error: NOT_SAVED }
  }
  await logEvent(before.id, ref, 'assessed', { assessment: before.assessment, objective_marks: before.marks, note: before.note }, after)
  const delivery = await readOwnDelivery(ref, before.id)
  return delivery ? { ok: true, delivery } : { ok: false, error: NOT_SAVED }
}

export async function undoDelivery(input: { subject: Subject; id: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSubject(input?.subject)) return { ok: false, error: NOT_SAVED }
  const ref = await recordsSchool(input.subject)
  if (!ref) return { ok: false, error: NO_SCHOOL }
  const before = await readOwnDelivery(ref, String(input.id ?? ''))
  if (!before) return { ok: true }
  if (!canUndo(before.createdAt, new Date())) {
    return { ok: false, error: 'Undo lasts ten minutes. After that the record stays, and it can be corrected with a reason.' }
  }
  const { error } = await recordsDb.from('lesson_records')
    .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
    .eq('id', before.id).eq('school_ref', ref)
  if (error) {
    console.error('[records] undo failed:', error.message)
    return { ok: false, error: 'That did not undo. The record is still there.' }
  }
  await logEvent(before.id, ref, 'undone', { status: 'delivered' }, { status: 'withdrawn' })
  return { ok: true }
}
