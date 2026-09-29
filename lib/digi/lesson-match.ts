import { matchScripts, type MatchableScript } from '@/lib/digi/script-match'

// Which lessons to put in front of DiGi for the parent's actual question.
//
// Justin, 29 September 2026: "make sure DiGi is aware of lesson themes, so if
// a relevant question gets asked we have a way of advising the correct lesson
// to help." DiGi already pointed at the exact script and the exact moment card
// (lib/digi/script-match, 10 August). It never pointed at a lesson, so a
// parent asking "how do I explain the algorithm to her" got good words and no
// route to the lesson built for exactly that.
//
// Two kinds, because since the same day there are two audiences:
//   child   the school version, which the child does in their own app, one a
//           week. The link opens the parent's view of that child's lessons with
//           this one picked out, which offers Do it together under 7.
//   parent  the family library, written for the grown up.
//
// The picking is the script matcher's, unchanged: whole words weighted by how
// rare they are, a title hit counted double, and nothing returned below the
// floor, because a lesson linked on the word "phone" teaches a parent that the
// links are noise.

export type LessonCandidate = {
  kind: 'child' | 'parent'
  title: string
  line: string
  href: string
}

export type SchoolModuleRow = { id: string; title: string; single_action_outcome?: string | null; module_id?: string | null }
export type ParentLessonRow = { id: string; title: string; key_message?: string | null; category?: string | null }

// Tuned on real questions against the Builder library (29 September 2026).
// Words that sank lessons: "keeps" hit "keep private", "time" is in half the
// titles. Words that missed: "spending" never met "spend", "13" never met
// "thirteen", "bed" never met "sleep". Lesson only, so the script matcher's
// guarded behaviour is unchanged.
const LESSON_STOP = new Set(['keep', 'keeps', 'kept', 'time', 'times', 'every', 'always', 'year', 'years', 'old', 'explain'])
const LESSON_SYNONYMS: Record<string, string> = {
  '13': 'thirteen', bed: 'sleep', bedtime: 'sleep', money: 'spend', chatbot: 'machine friend',
  tantrum: 'meltdown', unkind: 'kind', feed: 'algorithm',
}

/** The parent's words, tidied for lesson matching: fillers out, stems and synonyms in. */
export function lessonQuery(message: string): string {
  const words = String(message).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
  const out: string[] = []
  for (const w of words) {
    if (LESSON_STOP.has(w)) continue
    out.push(w)
    if (w.length > 5 && w.endsWith('ing')) out.push(w.slice(0, -3))
    if (w.length > 4 && w.endsWith('ed')) out.push(w.slice(0, -2))
    if (LESSON_SYNONYMS[w]) out.push(LESSON_SYNONYMS[w])
  }
  return out.join(' ')
}

export function matchLessons(
  message: string,
  schoolModules: SchoolModuleRow[],
  parentLessons: ParentLessonRow[],
  childId: string | null,
  limit = 3,
): LessonCandidate[] {
  const pool: { c: LessonCandidate; m: MatchableScript }[] = []
  schoolModules.forEach((l, i) => {
    const childQs = childId ? `child=${childId}&` : ''
    pool.push({
      c: {
        kind: 'child',
        title: l.title,
        line: l.single_action_outcome ?? '',
        href: `/dashboard/lessons/path?${childQs}lesson=${l.id}#lesson-${l.id}`,
      },
      // The module id carries the topic words ("how-algorithms-work"), which
      // the title alone sometimes does not.
      m: { sort_order: i, title: l.title, situation: `${l.single_action_outcome ?? ''} ${(l.module_id ?? '').replace(/[-_0-9]+/g, ' ')}`, category: 'child lesson' },
    })
  })
  parentLessons.forEach((l, i) => {
    pool.push({
      c: { kind: 'parent', title: l.title, line: l.key_message ?? '', href: `/dashboard/lessons/${l.id}` },
      m: { sort_order: 10_000 + i, title: l.title, situation: l.key_message ?? '', category: (l.category ?? '').replace(/_/g, ' ') },
    })
  })
  const bySort = new Map(pool.map(p => [p.m.sort_order, p.c]))
  return matchScripts(pool.map(p => p.m), lessonQuery(message), limit)
    .map(m => bySort.get(m.sort_order))
    .filter((c): c is LessonCandidate => !!c)
}

/** The block DiGi reads. Empty when nothing genuinely fits. */
export function lessonLinkBlock(candidates: LessonCandidate[], childName: string | null): string {
  if (candidates.length === 0) return ''
  const who = childName && childName !== 'Your child' ? childName : 'your child'
  return `\n\nLESSONS WE HAVE THAT MAY FIT WHAT THE PARENT JUST ASKED. If the question is about something one of these lessons teaches, point to the one that fits, warmly and in one sentence, and link it exactly in this markdown form [Lesson title](LINK). A "child lesson" is one ${who} does in their own app, one a week, and passing it ticks their passport, so say that in plain words. A "parent lesson" is for the grown up. Link at most one lesson, alongside at most one script or moment, only a real one from this list, never an invented title or link, and only when it truly fits:\n` +
    candidates.map(c => `- [${c.title}](${c.href}) (${c.kind} lesson)${c.line ? `: ${c.line}` : ''}`).join('\n')
}
