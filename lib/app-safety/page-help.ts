// What an app page offers next: the first stage check question, and the words.
//
// Justin, 28 November 2026: the app pages bring parents in from Google (about
// 130 in thirty days, at exactly our customer's ages) and almost none go on.
// Four in a hundred started the stage check from a single button. So each page
// now asks the stage check's own first worry question under the answer, as tap
// answers that carry the app, the age and the worry into the check, and links
// the scripts a parent can use tonight through their public pages (/say/<id>,
// built for sharing, see app/say/[id]/page.tsx).
//
// Plain data, so the page stays static and costs Google nothing to render.
// Worry ids are the stage check's own (lib/onboarding/worries.ts); the hand off
// accepts only those (lib/app-safety/handoff.ts). Script ids are the uuids the
// public page uses, checked against the live library on 28 November 2026.

import type { AppCategory } from './types'

/** Four worries per kind of app, the commonest first. */
export const WORRIES_FOR_CATEGORY: Record<AppCategory, { id: string; label: string }[]> = {
  social: [
    { id: 'social_media', label: 'What the feed does to them' },
    { id: 'seen_something', label: 'What they might come across' },
    { id: 'bedtime_screens', label: 'It keeps them up at night' },
    { id: 'wont_put_down', label: 'They cannot put it down' },
  ],
  messaging: [
    { id: 'group_chats', label: 'The group chats' },
    { id: 'seen_something', label: 'What gets sent to them' },
    { id: 'bedtime_screens', label: 'Messages late at night' },
    { id: 'getting_round', label: 'They get round the rules' },
  ],
  video: [
    { id: 'endless_youtube', label: 'Watching for hours' },
    { id: 'seen_something', label: 'What they might come across' },
    { id: 'wont_put_down', label: 'Turning it off is a fight' },
    { id: 'bedtime_screens', label: 'It keeps them up at night' },
  ],
  gaming: [
    { id: 'game_chat', label: 'Who they talk to' },
    { id: 'wont_put_down', label: 'Stopping is a fight' },
    { id: 'game_spending', label: 'Spending money in it' },
    { id: 'getting_round', label: 'They get round the rules' },
  ],
  ai: [
    { id: 'ai_chatbots', label: 'What it tells them' },
    { id: 'homework_screens', label: 'It does their homework' },
    { id: 'seen_something', label: 'What they might come across' },
    { id: 'getting_round', label: 'They get round the rules' },
  ],
  creative: [
    { id: 'seen_something', label: 'What they might come across' },
    { id: 'social_media', label: 'Posting and sharing' },
    { id: 'wont_put_down', label: 'They cannot put it down' },
    { id: 'getting_round', label: 'They get round the rules' },
  ],
  music: [
    { id: 'seen_something', label: 'What they might hear' },
    { id: 'bedtime_screens', label: 'It keeps them up at night' },
    { id: 'wont_put_down', label: 'They cannot put it down' },
    { id: 'getting_round', label: 'They get round the rules' },
  ],
}

type PageScript = { title: string; id: string }
type Stage = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'

const S = {
  firstSocial: { title: 'Too young for a first social media account', id: '20272456-fbc5-443e-b4e4-f0894082e6f4' },
  teenAccount: { title: 'Asking for Instagram, and what a Teen Account actually does', id: '12bdbee1-4403-4bf8-8199-14afab01b1dd' },
  comparison: { title: 'The Instagram Comparison Crash', id: '15ed6149-1bbf-4560-98d3-4e090cc1a51f' },
  smWellbeing: { title: 'Social media and mental health awareness', id: '10e77d2a-fc4a-4ed1-a1ab-9aaf26388881' },
  groupDrama: { title: 'When Group Chat Drama Comes Home', id: '7ee064e9-08b1-49b9-9a53-47acb7f4c2ba' },
  classGroup: { title: 'The class group at eleven at night', id: '9dfcab36-6c7e-43a5-99f8-569584d4678b' },
  youtubeAlone: { title: 'Asking to watch YouTube unsupervised', id: '9319b187-438e-4420-876d-ea7092894485' },
  upsetting: { title: 'Finding Something Upsetting on Their Device', id: '1f245e3b-1a06-4d2f-a8a9-61f41381f5f5' },
  upsettingTikTok: { title: 'Seeing something upsetting on TikTok', id: 'd6ae5be5-4189-4700-986f-d28faddcdd1b' },
  strangers: { title: 'Online gaming with strangers', id: '2bb35db3-51f7-4356-a57f-01c53ce79eea' },
  gameFriends: { title: 'Online gaming friends they have never met', id: '1c2d9bc0-de5f-4ba9-b8b9-f1b46d3f684f' },
  gamingTakeover: { title: 'Gaming has taken over everything else', id: '624127ff-fefa-40d6-ba11-ab1148653058' },
  midMatch: { title: 'They cannot stop in the middle of a match', id: 'c34dec15-0836-4e59-8a60-beb42a1236f4' },
  healthyGaming: { title: 'Healthy gaming versus addiction', id: 'b5c18306-08b2-4259-96fb-32fee4fd2e69' },
  aiTogether: { title: 'Ask the AI together, hints not answers', id: 'e7091c15-2116-4a21-81b0-bbb6b0b4ed19' },
  whatAi: { title: 'What AI actually is', id: 'da63a8a5-6bd3-4738-b2d2-3857df98b898' },
  aiFriend: { title: 'An AI chatbot as a friend', id: 'd41aac74-8cb0-49fe-81b8-d0b49fee4694' },
  phoneSleeps: { title: 'Where the phone sleeps tonight', id: '4d537f39-c9b2-4730-ab60-06fbfcd3d0c6' },
  lateNight: { title: 'Late night phone use affecting sleep', id: '31d61a49-04fc-4a2b-8949-01a13a53e560' },
} satisfies Record<string, PageScript>

const BY_CATEGORY: Partial<Record<AppCategory, Record<Stage, PageScript[]>>> = {
  social: {
    foundation: [S.firstSocial], builder: [S.firstSocial],
    explorer: [S.teenAccount, S.phoneSleeps], shaper: [S.comparison, S.phoneSleeps],
    independent: [S.smWellbeing, S.lateNight],
  },
  messaging: {
    foundation: [S.groupDrama], builder: [S.groupDrama],
    explorer: [S.classGroup, S.phoneSleeps], shaper: [S.classGroup, S.phoneSleeps],
    independent: [S.lateNight],
  },
  video: {
    foundation: [S.youtubeAlone], builder: [S.youtubeAlone],
    explorer: [S.upsetting], shaper: [S.upsetting], independent: [S.upsetting],
  },
  gaming: {
    foundation: [S.midMatch], builder: [S.strangers, S.midMatch],
    explorer: [S.gameFriends], shaper: [S.gamingTakeover, S.gameFriends],
    independent: [S.healthyGaming],
  },
  ai: {
    foundation: [S.aiTogether], builder: [S.aiTogether],
    explorer: [S.whatAi], shaper: [S.aiFriend], independent: [S.aiFriend],
  },
}

/** One app's own script where it has one, ahead of the category's. */
const BY_APP: Record<string, Partial<Record<Stage, PageScript[]>>> = {
  tiktok: { explorer: [S.upsettingTikTok], shaper: [S.upsettingTikTok] },
}

const STAGE_FOR_ID: Stage[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

/**
 * The scripts to show on an app page, at most two. `stageId` is the stage
 * number (1 to 5) the page already works out for an age; with no age the page
 * is about every child, so it takes the middle stage's, where most of the
 * search traffic is (ages 10 to 13).
 */
export function scriptsForAppPage(appSlug: string, category: AppCategory, stageId: number | null): PageScript[] {
  const stage = STAGE_FOR_ID[(stageId ?? 3) - 1] ?? 'explorer'
  const own = BY_APP[appSlug]?.[stage] ?? []
  const general = BY_CATEGORY[category]?.[stage] ?? []
  const seen = new Set<string>()
  return [...own, ...general].filter(s => (seen.has(s.id) ? false : (seen.add(s.id), true))).slice(0, 2)
}
