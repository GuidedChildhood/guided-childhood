import type { StickerRule } from '@/lib/stickers/catalog'

// THE MISSION: what the five a day is FOR.
//
// Justin, 14 September 2026, with Jonny's home showing Today is done: "we
// need to know this is working right and every day works and adds together,
// and that the five a day have a mission over time to achieve our objectives
// of balanced device use and understanding online safety lessons."
//
// The objectives already exist as stickers in the book: full days bring the
// Planet Friends home, lessons passed fill the stage stamp, days outside and
// days on the timer climb their own ladders. What a child could not see was
// the LINE from today's five to those. This reads the book and picks, for
// each objective, the next sticker they are working towards, so the five a
// day can say "and here is where it is going" in three rows.
//
//   friend    a Friend for the full days      (every day adds together)
//   safety    lessons passed, then the stamp  (understanding being online)
//   balance   days outside and on the timer   (balanced device use)
//
// Pure. The screen hands in the book it already holds; nothing is fetched.

export type MissionKey = 'friend' | 'safety' | 'balance'

export type MissionSticker = {
  key: string
  name: string
  emoji?: string
  art?: string | null
  colour: string
  earned: boolean
  rule: StickerRule
  have?: number
  need?: number
}

export type MissionRow = {
  key: MissionKey
  /** The objective, in the child's words. */
  objective: string
  /** The next sticker's name. */
  title: string
  /** "3 of 12 lessons". */
  line: string
  have: number
  need: number
  art?: string | null
  emoji: string
  colour: string
  /** Every sticker on this objective is earned. */
  done: boolean
}

const OBJECTIVE: Record<MissionKey, string> = {
  friend: 'Every full day adds up',
  safety: 'Safe and smart online',
  balance: 'Balanced screens',
}

const UNIT: Record<MissionKey, string> = {
  friend: 'full days',
  safety: 'lessons',
  balance: 'days',
}

function kindsFor(key: MissionKey): StickerRule['kind'][] {
  return key === 'friend' ? ['friend'] : key === 'safety' ? ['lessons', 'stamp'] : ['outside', 'timer']
}

/**
 * The next sticker on an objective: the unearned one with the least left to
 * do. Ties go to the one with the smaller target, so a first sticker beats a
 * big one when both are a step away. All earned: the biggest earned one, done.
 */
export function nextOn(stickers: readonly MissionSticker[], key: MissionKey): MissionSticker | null {
  const kinds = new Set(kindsFor(key))
  const pool = stickers.filter(s => kinds.has(s.rule.kind))
  if (pool.length === 0) return null
  const open = pool.filter(s => !s.earned && (s.need ?? 0) > 0)
  if (open.length === 0) {
    return pool.slice().sort((a, b) => (b.need ?? 0) - (a.need ?? 0))[0]
  }
  return open.slice().sort((a, b) => {
    const ga = (a.need ?? 0) - Math.min(a.have ?? 0, a.need ?? 0)
    const gb = (b.need ?? 0) - Math.min(b.have ?? 0, b.need ?? 0)
    return ga - gb || (a.need ?? 0) - (b.need ?? 0)
  })[0]
}

export function buildMission(stickers: readonly MissionSticker[], opts: { fullDays?: number } = {}): MissionRow[] {
  const rows: MissionRow[] = []
  for (const key of ['friend', 'safety', 'balance'] as MissionKey[]) {
    const s = nextOn(stickers, key)
    if (!s) continue
    const need = s.need ?? 0
    // Full days can move on the client the moment a day lands, so the friend
    // row takes the live number when the screen has one.
    const rawHave = key === 'friend' && typeof opts.fullDays === 'number' ? opts.fullDays : (s.have ?? 0)
    const have = Math.min(need, Math.max(0, rawHave))
    const done = s.earned || (need > 0 && have >= need)
    rows.push({
      key,
      objective: OBJECTIVE[key],
      title: key === 'friend' ? `Bring ${s.name} home` : s.name,
      line: done ? 'Done' : `${have} of ${need} ${UNIT[key]}`,
      have, need,
      art: s.art ?? null,
      emoji: s.emoji ?? (key === 'friend' ? '🪐' : key === 'safety' ? '📚' : '🌳'),
      colour: s.colour,
      done,
    })
  }
  return rows
}
