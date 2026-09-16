'use client'

import { useEffect } from 'react'
import { markStep, type StepId } from '@gc/shared/schools-progress'
import { readTaught } from '@gc/shared/schools-taught'

// THE FOUR DETECTORS, ALL OF THEM SMALL AND ALL OF THEM HONEST.
//
// The tracker's rule is that a green tick is only ever awarded for something
// the product can see for itself (plans/2026-09-16-lesson-tracker-plan.md).
// These are the things it can see. Each one writes at the moment the thing
// actually happens, never on a guess, and each renders nothing.
//
// They write to this browser and nowhere else (shared/schools-progress.ts),
// they name no child, and every surface that shows what they recorded says so
// in words.

/** Marks one step the moment this page is open. */
export function MarkOnOpen({ moduleId, step }: { moduleId: string; step: StepId }) {
  useEffect(() => { markStep(moduleId, step) }, [moduleId, step])
  return null
}

/**
 * Marks one step when the page is actually sent to a printer.
 *
 * `beforeprint` rather than a click on our own button, because a teacher who
 * presses ctrl P has printed it just as much as one who pressed the button,
 * and a tick that only counts our button would be wrong for half the people
 * who use the page. It fires for the print dialog, which is the closest thing
 * to the truth a browser will give us: a cancelled dialog still ticks, and
 * that is the failure we accept, because the alternative is a row a real
 * printer run leaves grey.
 */
export function MarkOnPrint({ moduleId, step }: { moduleId: string; step: StepId }) {
  useEffect(() => {
    const on = () => markStep(moduleId, step)
    window.addEventListener('beforeprint', on)
    return () => window.removeEventListener('beforeprint', on)
  }, [moduleId, step])
  return null
}

/**
 * The lesson page's own signals, all three at once.
 *
 * 1. THIS lesson has been read, because its page is open.
 * 2. The NEXT lesson has been looked back at, because looking at this one is
 *    exactly what its starter recalls. That is the only honest way to tick a
 *    look back: the act happens on the previous lesson's page, not on the
 *    page that benefits from it.
 * 3. THIS lesson's own look back, if the one before it is already taught on
 *    this screen. A teacher working through the scheme in order should not
 *    have to revisit a lesson they delivered last week to tick a row about
 *    remembering it.
 */
export function LessonOpened({ moduleId, nextModuleId, previousModuleId }: {
  moduleId: string
  nextModuleId: string | null
  previousModuleId: string | null
}) {
  useEffect(() => {
    markStep(moduleId, 'read')
    if (nextModuleId) markStep(nextModuleId, 'lookback')
    if (previousModuleId && readTaught().includes(previousModuleId)) markStep(moduleId, 'lookback')
  }, [moduleId, nextModuleId, previousModuleId])
  return null
}
