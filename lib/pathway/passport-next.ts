// THE ONE NEXT STEP ON A PASSPORT PAGE (plans/2026-10-16-passport-journey-plan.md, PR 2).
//
// The page used to say "next" in six places. This is the one, and it only
// ever names work that moves the page toward its stamp, or says honestly that
// there is nothing to do this week. First that applies:
//
//   1. the page is stamped
//   2. the big check is ready (every lesson and script done, check not passed)
//   3. this week's lesson, while the week is open (a heavy lesson waiting on
//      its heads up is "read the note first")
//   4. the next script, the parent's own talk
//   5. nothing this week: the next lesson's day, and the question to ask at
//      tea from the lesson just passed
//
// Pure over its inputs, so the guard runs it on fixtures.

import type { PageCount } from './page-count'

export type NextLesson = { id: string; title: string; heavyWaiting: boolean }
export type NextScript = { id: string; title: string }
export type LastPass = { title: string; question: string | null; listenFor: string | null }

export type NextInput = {
  /** The child's name for a sentence start, "Sam", or "Your child". */
  kid: string
  childId: string
  stageNum: number
  page: string
  count: PageCount
  stamped: boolean
  lesson: NextLesson | null
  weekOpen: boolean
  /** Weekday the next lesson opens when the week is shut, "Thursday". */
  opensOn: string | null
  script: NextScript | null
  lastPass: LastPass | null
}

export type NextStep = {
  key: 'stamped' | 'check' | 'note' | 'lesson' | 'script' | 'week' | 'clear'
  /** The mono chip: who it is for. */
  chip: string
  title: string
  how: string | null
  button: { label: string; href: string } | null
}

const q = (s: string) => encodeURIComponent(s)

export function passportNext(i: NextInput): NextStep {
  const tea = i.lastPass?.question ? `Ask ${i.kid} at tea: ${i.lastPass.question}` : null
  const listen = i.lastPass?.listenFor ? `Listen for: ${i.lastPass.listenFor}` : null

  if (i.stamped) {
    return {
      key: 'stamped', chip: 'Stamped',
      title: `${i.kid}'s ${i.page} page is stamped`,
      how: tea ?? 'Every lesson passed with its check, every talk done, and the big check passed.',
      button: null,
    }
  }

  const lessonsLeft = i.count.lessons.total - i.count.lessons.done
  const scriptsLeft = i.count.scripts.total - i.count.scripts.done
  if (lessonsLeft <= 0 && scriptsLeft <= 0 && !i.count.check.done) {
    return {
      key: 'check', chip: `For ${i.kid}`,
      title: 'The big check is ready',
      how: `Five questions on this page's lessons, on ${i.kid}'s app or here with you. Four right earns the stamp.`,
      button: { label: 'Do the check together', href: `/dashboard/pathway/check?stage=${i.stageNum}&child=${q(i.childId)}` },
    }
  }

  if (i.lesson && i.weekOpen) {
    if (i.lesson.heavyWaiting) {
      return {
        key: 'note', chip: 'For you',
        title: `Read the note before ${i.lesson.title}`,
        how: `It is on a hard subject, so it waits for you first. Two minutes to read, then tap Ready.`,
        button: { label: 'Read the note', href: `/dashboard/lessons/heads-up?child=${q(i.childId)}&lesson=${q(i.lesson.id)}` },
      }
    }
    return {
      key: 'lesson', chip: `For ${i.kid}`,
      title: i.lesson.title,
      how: `This week's lesson, on ${i.kid}'s app. About ten minutes, then a short check.`,
      button: { label: 'Do it together', href: `/dashboard/lessons/do-together?child=${q(i.childId)}&lesson=${q(i.lesson.id)}` },
    }
  }

  if (i.script) {
    return {
      key: 'script', chip: 'For you',
      title: i.script.title,
      how: 'A short talk, with the words written for you. It counts once you have used it.',
      button: { label: 'Read the words', href: `/dashboard/scripts/${q(i.script.id)}?child=${q(i.childId)}` },
    }
  }

  if (i.lesson && !i.weekOpen) {
    return {
      key: 'week', chip: 'This week',
      title: `Nothing to do this week. ${i.lesson.title} opens ${i.opensOn ?? 'next week'}.`,
      how: [tea, listen].filter(Boolean).join(' ') || 'One lesson a week is the pace that sticks.',
      button: null,
    }
  }

  return {
    key: 'clear', chip: 'This page',
    title: 'Nothing left for you on this page',
    how: tea ?? `What is left is ${i.kid}'s.`,
    button: null,
  }
}
