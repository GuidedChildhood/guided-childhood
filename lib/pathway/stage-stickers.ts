import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { STAGE_PAGES, STAGE_IDS, type StageId } from '@gc/shared/stage-map'
import { STAGE_COLOURS } from '@/lib/pathway/passport-print-style'
import type { PageCount } from '@/lib/pathway/page-count'

// ONE STICKER PER STAGE, AND ONE RULE FOR IT, ON SCREEN AND ON PAPER.
//
// Justin, 17 November 2026: the paper passport has to run with the app. When a
// stage is finished in the app, parent and child both see "Stage done, sticker
// added to your passport", and they can print that Planet Friend's sticker in
// colour to stick in the paper book. The sticker says in a line what was
// learnt.
//
// THE RULE IS THE CODE'S RULE, NOTHING ADDED. lib/pathway/stamped.ts stamps a
// page when every school lesson on it is passed by this child, every talk on
// it is done by the grown up, and the big check is passed. That is all
// pageCount counts, and so it is all a sticker promises. Moments sorted, stars,
// days outside and the timer are real work, and the app shows them as "along
// the way", but they earn nothing toward the stamp: the 17 October passport
// plan (decision 1.4) took them out on purpose, so printing them as a
// condition would be printing a criterion the code never checks.
//
// THE LEARNT LINE comes from the modules that key stage actually teaches
// (content/modules), said the way a child would say it about themselves:
//   1 EYFS, KS1: screens never say stop, ask first, private like a toothbrush,
//     who is on the other side.
//   2 KS2: screen routines, gaming time and spend, how algorithms work,
//     privacy, kind and safe online, a machine that talks like a friend.
//   3 KS3: mood and screens, misinformation and deepfakes, scams, image
//     pressure, when it turns on you.
//   4 KS4: manipulation and persuasion, consent and the law on images,
//     sextortion, the money and the odds, readiness at 16.
//   5 KS5: AI mastery and data rights, digital identity and future work.
// No dashes, no claim beyond the lessons themselves.

export type StageSticker = {
  n: number
  stageId: StageId
  friend: string
  friendKey: string
  img: string
  page: string
  colour: string
  /** What the sticker says the child learnt, in their own voice. */
  learnt: string
}

const LEARNT: Record<StageId, string> = {
  foundation: 'I know screens do not say stop, so I can. I ask first and keep private things private.',
  builder: 'I have good screen habits and I know how apps try to keep me watching.',
  explorer: 'I question what I see online, I can spot fakes and scams, and I know who to tell.',
  shaper: 'I can spot pressure and persuasion online, I know the law on images, and I make my own choices.',
  independent: 'I use AI and my data wisely, and I am ready to run my own digital life.',
}

export const STAGE_STICKERS: StageSticker[] = STAGE_IDS.map((stageId, i) => {
  const ch = STAGE_CHARACTERS[i]
  return {
    n: i + 1,
    stageId,
    friend: ch.name,
    friendKey: ch.key,
    img: ch.cutout,
    page: STAGE_PAGES[stageId].page,
    colour: STAGE_COLOURS[i],
    learnt: LEARNT[stageId],
  }
})

export function stickerFor(n: number): StageSticker | null {
  return STAGE_STICKERS[n - 1] ?? null
}

/** The simple version, for paper: the same three things, no numbers. */
export const PAPER_RULE = 'Every lesson on the page passed, every talk done, and the big check passed.'

export type RuleLine = { key: 'lessons' | 'scripts' | 'check'; label: string; done: boolean; who: 'child' | 'parent' }

/**
 * The detailed version, for the app: the same three things with this child's
 * own counts. A page with no talks on it (or no lessons yet) drops that line
 * rather than showing "0 of 0".
 */
export function ruleLines(count: PageCount, kid: string): RuleLine[] {
  const lines: RuleLine[] = []
  if (count.lessons.total > 0) {
    lines.push({ key: 'lessons', who: 'child', done: count.lessons.done >= count.lessons.total,
      label: `${kid} passes every lesson: ${count.lessons.done} of ${count.lessons.total}` })
  }
  if (count.scripts.total > 0) {
    lines.push({ key: 'scripts', who: 'parent', done: count.scripts.done >= count.scripts.total,
      label: `You do every talk: ${count.scripts.done} of ${count.scripts.total}` })
  }
  lines.push({ key: 'check', who: 'child', done: count.check.done,
    label: count.check.done ? `${kid} passed the big check` : `${kid} passes the big check` })
  return lines
}

/** The line both sides see the moment a page is stamped. */
export const STAGE_DONE_LINE = 'Stage done, sticker added to your passport'
