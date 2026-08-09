import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// The child's squad buddy: DiGi the guide, then the five Planet Friends, one
// per stage. Lived inline in KidQuestScreen; the jobs page needs the same
// faces now, and two copies of which key wears which face is how a child's
// buddy changes between two of their own screens.

export const BUDDY_MAP: Record<string, { name: string; img: string; stageId?: number }> = {
  digi: { name: 'DiGi', img: '/digi-squad/DiGi-star.svg' },
  ...Object.fromEntries(STAGE_CHARACTERS.map(c => [c.key, { name: c.name, img: c.cutout, stageId: c.stageId }])),
}

export const DEFAULT_BUDDY = 'digi'

/** The buddy to draw for whatever is saved, falling back to DiGi. */
export function buddyFor(buddy: string | null | undefined): { key: string; name: string; img: string } {
  const key = buddy && BUDDY_MAP[buddy] ? buddy : DEFAULT_BUDDY
  return { key, ...BUDDY_MAP[key] }
}
