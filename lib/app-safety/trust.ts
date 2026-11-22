// THE FREE CHECK ON EVERY APP PAGE: TRUST.
//
// Justin, 19 November 2026: a no login check where the parent picks the child's
// age, how much the child uses the app and any worries, and gets a result built
// on TRUST: Timing, Relationships, Upstream design, Sleep, Transparency.
//
// The five letters sit on the trust framework DiGi already uses
// (digi/07-trust-framework.md): connection is the protection, the open door,
// modelling over monitoring. Relationships leads for that reason.
//
// What it is NOT. It is not a score and not a verdict. There is no total, no
// percentage and no "ready" or "not ready": a number built from three taps
// would be a composite nobody could defend (THE-STORY.md, evidence or silence),
// and a verdict would be the allow or deny the product never gives
// (non negotiable 1). Each letter gets a place to start and one next step,
// worded from the parent's own answers and the app's own facts.
//
// Pure, no React and nothing stored, so `npm run app-safety-test` runs it.

export type Use = 'not-yet' | 'sometimes' | 'most-days' | 'lots'
export type Worry = 'strangers' | 'content' | 'time' | 'spending' | 'sleep' | 'secret' | 'mood' | 'unknown'
export type Status = 'start' | 'work' | 'ok'
export type LetterId = 'timing' | 'relationships' | 'upstream' | 'sleep' | 'transparency'

export const USE_OPTIONS: { id: Use; label: string }[] = [
  { id: 'not-yet', label: 'Not yet, or just asking for it' },
  { id: 'sometimes', label: 'Sometimes, usually with me around' },
  { id: 'most-days', label: 'Most days' },
  { id: 'lots', label: 'A lot, most days and evenings' },
]

export const WORRY_OPTIONS: { id: Worry; label: string }[] = [
  { id: 'strangers', label: 'People they do not know contacting them' },
  { id: 'content', label: 'Seeing something upsetting or too old for them' },
  { id: 'time', label: 'How hard it is to put down' },
  { id: 'spending', label: 'Spending money' },
  { id: 'sleep', label: 'Late nights' },
  { id: 'secret', label: 'They might not tell me if something went wrong' },
  { id: 'mood', label: 'How they seem after using it' },
  { id: 'unknown', label: 'I do not really know what they do on it' },
]

export const LETTERS: { id: LetterId; letter: string; name: string; means: string }[] = [
  { id: 'timing', letter: 'T', name: 'Timing', means: 'The right age, and the right time of day' },
  { id: 'relationships', letter: 'R', name: 'Relationships', means: 'They would come to you if something went wrong' },
  { id: 'upstream', letter: 'U', name: 'Upstream design', means: 'The features built to pull them in are turned down before they start' },
  { id: 'sleep', letter: 'S', name: 'Sleep', means: 'Nights are protected and the device sleeps outside the bedroom' },
  { id: 'transparency', letter: 'T', name: 'Transparency', means: 'You both know what is on it, and the rules are agreed, not secret' },
]

/** The few facts about an app the check needs. */
export type CheckApp = { name: string; minAge: number; firstControl: string | null; hasUnderAgeOption: boolean; underAgeText: string }

export type Answers = { age: number; use: Use; worries: Worry[] }

export type LetterResult = { id: LetterId; letter: string; name: string; means: string; status: Status; step: string }

export type CheckResult = { letters: LetterResult[]; lead: LetterId }

const STATUS_RANK: Record<Status, number> = { start: 0, work: 1, ok: 2 }
// When two letters are both a place to start, connection comes first.
const PRIORITY: LetterId[] = ['relationships', 'upstream', 'sleep', 'timing', 'transparency']

export function checkTrust(app: CheckApp, a: Answers): CheckResult {
  const has = (w: Worry) => a.worries.includes(w)
  const using = a.use !== 'not-yet'
  const gap = a.age - app.minAge
  const under = gap < 0
  const control = app.firstControl ?? 'the strictest privacy settings'

  const timing = ((): [Status, string] => {
    if (under && (a.use === 'most-days' || a.use === 'lots')) {
      return ['start', `${app.name} sets its own minimum age at ${app.minAge}, and it is already part of most days. A flat no now tends to send it out of sight. Agree a version for now instead: ${app.hasUnderAgeOption ? app.underAgeText : 'on a shared screen, in a shared room, with you nearby'}, and the age you will both revisit it.`]
    }
    if (under && using) return ['work', `${app.name}'s own minimum age is ${app.minAge}. Keep it to times you are around, and agree out loud what changes at ${app.minAge}, so the birthday is a step you planned rather than a door that suddenly opens.`]
    if (under) return ['work', `${app.name}'s own minimum age is ${app.minAge}. That gives you time. Agree now what having it will look like, so the ask arrives into a plan rather than an argument.`]
    if (has('time') || a.use === 'lots') return ['work', `Pick the times it is for, and the times it is not, such as school mornings and the hour before bed. A time agreed in advance is easier to keep than five more minutes negotiated at the door.`]
    return ['ok', `Age and timing look settled. Keep the agreed times written down so they hold when a friend's rules are different.`]
  })()

  const relationships = ((): [Status, string] => {
    if (has('secret')) return ['start', `Say the open door out loud before anything goes wrong: if something on ${app.name} upsets or scares them, telling you will never cost them the device. If telling might mean losing it, staying quiet can feel like the safer choice.`]
    if (has('mood')) return ['start', `Ask about how it feels rather than how long they spent: "What was the best and worst thing on ${app.name} today?" Asked often and calmly, it keeps you the first person they talk to.`]
    if (under && using) return ['work', `Use it alongside them sometimes, with curiosity rather than checking. Being the person who knows the app well is what makes you the one they come to.`]
    return ['ok', `Nothing worrying you here. Keep it that way with the open door: they can tell you anything that happens on it and never lose the device for telling.`]
  })()

  const upstream = ((): [Status, string] => {
    if (has('strangers')) return ['start', `Before anything else, switch on ${control} and check who can message, comment and find them. Go through each setting yourself rather than trusting the defaults.`]
    if (has('spending')) return ['start', `Set purchase approvals or a spending limit before the first ask, and agree a monthly amount together. A limit agreed in advance stops the surprise on your card.`]
    if (has('content') || has('time')) return ['start', `Turn the feed down before they start: switch on ${control}, turn off autoplay where you can, and set a daily limit together. These features are designed to keep people watching, so the setting does the arguing for you.`]
    if (using) return ['work', `Check ${control} is on and still set the way you left it. Settings drift after updates and new accounts.`]
    return ['work', `Set it up together on day one with ${control} switched on, so the safe version is the only version they have known.`]
  })()

  const sleep = ((): [Status, string] => {
    if (has('sleep') || a.use === 'lots') return ['start', `Agree a time the device goes to charge outside the bedroom, the same every night, and model it with your own phone. Notifications and autoplay do not stop at bedtime unless something else does.`]
    if (a.use === 'most-days') return ['work', `Keep the last hour before bed screen free and charge it outside the bedroom. A rule set before it is a problem is the easiest one to keep.`]
    return ['ok', `Nights look protected. Keep the device charging outside the bedroom as the norm before it becomes a debate.`]
  })()

  const transparency = ((): [Status, string] => {
    if (has('unknown')) return ['start', `Ask them to show you ${app.name}: what they watch or play, who they follow, what they like about it. Ten minutes of them teaching you beats any report, and it is agreed openly rather than done behind their back.`]
    if (under && using) return ['work', `Agree the rules where you can both see them, on the fridge or in a family agreement, so they know what you can see and why.`]
    return ['ok', `Keep the rules visible and agreed, so any oversight is something you talk about together rather than something they find out about.`]
  })()

  const raw: Record<LetterId, [Status, string]> = { timing, relationships, upstream, sleep, transparency }
  const letters = LETTERS.map(l => ({ ...l, status: raw[l.id][0], step: raw[l.id][1] }))
  const best = Math.min(...letters.map(l => STATUS_RANK[l.status]))
  const lead = PRIORITY.find(id => STATUS_RANK[raw[id][0]] === best) ?? 'relationships'
  return { letters, lead }
}
