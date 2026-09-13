// The one reason the passport wants a look today, or nothing.
//
// Justin, 13 September 2026: the passport should flip "in and out when we feel
// a passport attention is needed". The Today card "Open the passport" was one
// of nine rotating suggestions with no reason attached, so a parent got it on
// a day nothing had moved and missed it on the day the page was ready for its
// check.
//
// ── ONE REASON, IN ORDER ────────────────────────────────────────────────────
//
// 1. A page is READY FOR ITS CHECK. Every lesson and script done, the child's
//    check not yet passed. The most valuable single moment the passport has,
//    and the one most easily missed, because the five slots read full.
// 2. PAGES BEHIND. A family who joined late has earlier pages open. Said once
//    a day at most, with the count, and never as a deadline.
// 3. A FEW LEFT on the current page (three or fewer items). The "nearly there"
//    that gets a parent over the line.
//
// Everything else is silence. Not before the first check in, because an empty
// passport is a cover and five zeros and sending a parent to look at it teaches
// them it is not worth opening. The rule is pure so it can be run for real in
// scripts/check-passport-pass.mjs.

export type AttentionKind = 'check_ready' | 'behind' | 'nearly'

export type PassportAttention = {
  kind: AttentionKind
  /** The page to open the book on. */
  stageId: number
  title: string
  line: string
}

export type StageRead = {
  id: number
  name: string
  lessonsDone: number
  lessonsTotal: number
  scriptsDone: number
  scriptsTotal: number
  contentComplete: boolean
  checkPassed: boolean
}

export type AttentionInput = {
  hasCheckedIn: boolean
  currentStage: number | null
  childName: string | null
  stages: StageRead[]
}

export function passportAttention(input: AttentionInput): PassportAttention | null {
  if (!input.hasCheckedIn || !input.currentStage) return null
  const them = input.childName && input.childName !== 'Your child' ? input.childName : 'your child'
  const stamped = (s: StageRead) => s.contentComplete && s.checkPassed
  const reachable = input.stages.filter(s => s.id <= (input.currentStage ?? 0))

  // 1. Ready for its check, current page first, then anything behind.
  const ready = [...reachable].sort((a, b) => (a.id === input.currentStage ? -1 : 1) - (b.id === input.currentStage ? -1 : 1))
    .find(s => s.contentComplete && !s.checkPassed)
  if (ready) {
    return {
      kind: 'check_ready', stageId: ready.id,
      title: `${ready.name} is ready for its check`,
      line: `Every lesson and script on the page is done. The stage check is what stamps it, and ${them} sits it whenever they are ready.`,
    }
  }

  // 2. Pages behind.
  const behind = reachable.filter(s => s.id < (input.currentStage ?? 0) && !stamped(s))
  if (behind.length > 0) {
    const one = behind.length === 1
    return {
      kind: 'behind', stageId: behind[0].id,
      title: one ? `One page behind ${them}` : `${behind.length} pages behind ${them}`,
      line: one
        ? `${behind[0].name} is still open. The stage ${them} is on is built on top of it, and it stays open as long as it takes.`
        : `${behind.map(b => b.name).join(' and ')} are still open. They stay open as long as it takes, one lesson at a time.`,
    }
  }

  // 3. Nearly there on the current page.
  const cur = reachable.find(s => s.id === input.currentStage)
  if (cur && !stamped(cur)) {
    const left = Math.max(0, cur.lessonsTotal - cur.lessonsDone) + Math.max(0, cur.scriptsTotal - cur.scriptsDone)
    if (left > 0 && left <= 3) {
      return {
        kind: 'nearly', stageId: cur.id,
        title: left === 1 ? `One thing left on ${cur.name}` : `${left} things left on ${cur.name}`,
        line: `Then the page is ready for its check. Open the book to see which.`,
      }
    }
  }
  return null
}
