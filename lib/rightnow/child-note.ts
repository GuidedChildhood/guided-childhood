import type { StageId } from '@/lib/pathway/progress'

// Sending a moment card through to the child's own screen.
//
// The card a parent reads and the words a child reads are not the same thing.
// say_this is a script for a grown up to SAY, in the first person, out loud, in
// the room: "the screen is going off now". Pushed to a child's phone as a
// notification that same sentence stops being a calm handover and becomes an
// order from a device, with the parent removed from the moment. So nothing a
// parent reads is ever forwarded raw. The child gets their own version, written
// to them, and the parent sees it before it goes.
//
// Two gates stand in front of every send, and both must pass.

const STAGE_ORDER: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

// What each stage means in years, for the model and for the parent facing copy.
export const STAGE_AGES: Record<StageId, string> = {
  foundation: '5 to 7',
  builder: '8 to 10',
  explorer: '11 to 13',
  shaper: '14 to 15',
  independent: '16 and over',
}

export type SendGate =
  | { ok: true; childStage: StageId }
  | { ok: false; reason: 'no-stage' | 'too-old-for-child' | 'crisis' }

/**
 * Gate one, the age check Justin asked for.
 *
 * Scripts are written per stage and the library runs the whole way up: an
 * independent stage card can be about a nude someone sent, a shaper card about
 * porn found in a search history. Those exist for a fifteen year old and their
 * parent. They must never be the thing that lands on a seven year old's screen
 * because a parent tapped share on the wrong card, so a card written above the
 * child's stage is refused outright.
 *
 * Below their stage is fine and stays allowed. A younger card is gentler than
 * the child needs, never sharper, and a parent of a thirteen year old reaching
 * for the calm builder wording is making a reasonable choice, not a mistake.
 *
 * No stage on the child is a refusal too, not a pass. Without a stage there is
 * no age to check against, and an unchecked send is exactly what this gate is
 * here to stop. The parent still gets the card to read together.
 */
export function gateSend(
  scriptStage: string | null | undefined,
  childStage: string | null | undefined,
  crisis?: boolean
): SendGate {
  // A crisis card is never a notification. It points at a human being in the
  // room this minute, and a child reading it alone off a screen is the one
  // outcome the card is written to prevent.
  if (crisis) return { ok: false, reason: 'crisis' }

  const child = STAGE_ORDER.indexOf(childStage as StageId)
  if (child < 0) return { ok: false, reason: 'no-stage' }

  // A card with no stage of its own is treated as written for this child. Only
  // a card that names a stage ABOVE them is refused.
  const script = STAGE_ORDER.indexOf(scriptStage as StageId)
  if (script > child) return { ok: false, reason: 'too-old-for-child' }

  return { ok: true, childStage: STAGE_ORDER[child] }
}

/**
 * Gate two: what the child actually reads.
 *
 * for_your_child is a hand written child facing version of the card, and where
 * one exists it is always preferred: a human wrote it, in Justin's voice, and
 * it needs no model. Most cards do not have one yet (17 of 233 at the time of
 * writing), so the rest are written on demand by DiGi against this prompt and
 * cached back onto the row, which means each card is written once and every
 * family after the first gets the human checked text instantly.
 */
export function childNotePrompt(opts: {
  childName: string
  childStage: StageId
  title: string
  sayThis: string
}): string {
  const { childName, childStage, title, sayThis } = opts
  return `You write the child's side of a parenting card for Guided Childhood.

A parent has just had this moment with their child and is sending their child a short note about it, through the family app. The note appears on the child's own screen and the child taps to say they have read it.

The moment: ${title}
What the parent is saying out loud, in the room: "${sayThis}"

Write the note the CHILD reads. Rules, all of them hard:

1. Write TO ${childName}, from their parent, in the parent's voice. Second person. Not about them, to them.
2. ${childName} is in the ${childStage} stage, ages ${STAGE_AGES[childStage]}. Every word must be one they read comfortably at that age.
3. Warm, plain and direct. Never sarcastic, never a telling off, never a threat, and never a bribe.
4. It is a hand on the shoulder, not a rule being restated. The parent has already said the rule out loud. This is the bit that says we are still fine.
5. Say nothing about consequences, punishments or anything being taken away.
6. Two or three short sentences. Under 45 words.
7. No dashes anywhere. No emoji. No greeting line and no sign off, just the note.
8. Do not mention apps, screens, points, streaks or the fact this is a notification.

Return the note only, nothing else.`
}

// The plain English reason the parent sees when a card cannot be sent, so the
// refusal reads as care rather than a broken button.
export function gateMessage(reason: Exclude<SendGate, { ok: true }>['reason'], childName?: string): string {
  const theirs = childName ? `${childName}'s` : 'their'
  switch (reason) {
    case 'crisis':
      return 'This one is not for a screen. Sit with them and read it together.'
    case 'too-old-for-child':
      return `This card is written for an older child, so it is not going to ${theirs} screen. Read it through with them instead.`
    case 'no-stage':
      return `Add ${theirs} age first and this can go to their screen. For now, read it through together.`
  }
}
