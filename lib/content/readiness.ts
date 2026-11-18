import type { AgeBand } from './stages'
import { SOCIAL_MEDIA_LAW, type SocialMediaLaw } from '@gc/shared/social-media-law'

// The readiness passport. This is the connective narrative that turns the daily
// loop (chores, stars, balance) into the thing it is actually for: a child who
// walks into social media at 16 ready, because they built up to it stage by
// stage, no cliff edge. Each stage earns a stamp, a named competence, so a
// parent can always see the line from tonight's small thing to the whole point.
//
// The frame is the graduated digital passport (the Cambridge idea): access and
// independence handed over in steps as the skills are shown, not all at once on
// a birthday. The science is the measured kind, Candice Odgers and Amy Orben
// (Cambridge), whose research finds the quantity of screen time explains very
// little on its own, and that what matters is context, content, what screens
// displace, and whether a child has built the skills to handle it. So we do not
// chase a number. We build the competence and the balance, gradually.

export type ReadinessStamp = {
  id: 1 | 2 | 3 | 4 | 5
  stage: string
  ages: string
  ageBand: AgeBand
  stamp: string   // the passport stamp, a short badge name
  means: string   // the stamp in plain words, so the badge is never a mystery
  skill: string   // the competence this stage builds
  toward: string  // what it is building toward, the 16 ready line
}

export const READINESS: ReadinessStamp[] = [
  {
    id: 1, stage: 'Foundation', ages: 'Ages 4 to 7', ageBand: '4-7',
    stamp: 'Calm screen offs',
    means: 'screens go off without a battle',
    skill: 'Screens go off calmly, so the off switch is never a battle.',
    toward: 'the self control they will lean on when the algorithm arrives.',
  },
  {
    id: 2, stage: 'Builder', ages: 'Ages 8 to 10', ageBand: '8-10',
    stamp: 'Healthy habits',
    means: 'good screen habits set early',
    skill: 'The habits get set (bedroom rule, earned time) before an app tries to set them first.',
    toward: 'walking in with their own habits, not ones a feed built for them.',
  },
  {
    id: 3, stage: 'Explorer', ages: 'Ages 11 to 13', ageBand: '11-13',
    stamp: 'Knows how it works',
    means: 'sees how the feed is built to hold them',
    skill: 'They learn how the feed and the algorithm are built to hold them.',
    toward: 'using social media with their eyes open, not being used by it.',
  },
  {
    id: 4, stage: 'Shaper', ages: 'Ages 13 to 15', ageBand: '13-15',
    stamp: 'Owns their footprint',
    means: 'looks after their name online',
    skill: 'They own their identity online, and know you are the first call when things go wrong.',
    toward: 'handling the hard moments with you beside them, not hiding them.',
  },
  {
    id: 5, stage: 'Independent', ages: 'Ages 16 and above', ageBand: '16+',
    stamp: 'Ready for the world',
    means: 'runs their own healthy digital life',
    skill: 'They decide for themselves what a healthy digital life looks like.',
    toward: 'the full phone, ready, because they built up to it and did not fall off a cliff.',
  },
]

export function readinessForAgeBand(ageBand: AgeBand | null): ReadinessStamp {
  return READINESS.find(r => r.ageBand === ageBand) ?? READINESS[0]
}

// The child's own stage deal, in kid words: what is great for them right now,
// and what comes later on the road. Passport language all the way through,
// steps earned as skills are shown, never a ban and never a telling off. The
// child app shows this on their road so the boundaries are theirs to know,
// not a rule that lives only on the parent's side.
export type KidStageDeal = {
  greatNow: { emoji: string; label: string }[]
  later: string
}

const EXPLORER_LATER: Record<SocialMediaLaw, string> = {
  none: 'If and when accounts come is a family decision. You will have practised the skills first.',
  partial_ban: 'Group chats come first, with your grown up. Social media comes later, and you will have practised how it works.',
  full_ban_u16: 'Group chats and games with real friends come first. Social media comes later for everyone your age, and you will have practised most of it.',
}

export const KID_STAGE_DEALS: Record<number, KidStageDeal> = {
  1: {
    greatNow: [
      { emoji: '📺', label: 'Watching with a grown up' },
      { emoji: '🖍️', label: 'Drawing and making apps' },
      { emoji: '🧩', label: 'Learning games' },
      { emoji: '📞', label: 'Video calls with family' },
    ],
    later: 'Playing on your own and searching come next stage, when you have shown you can turn screens off calmly.',
  },
  2: {
    greatNow: [
      { emoji: '🧩', label: 'Learning games and puzzles' },
      { emoji: '🎨', label: 'Making things: art, music, builds' },
      { emoji: '📞', label: 'Video calls with family' },
      { emoji: '🎬', label: 'Shows you pick together' },
    ],
    later: 'Group chats come further up the road, once your habits are yours.',
  },
  3: {
    greatNow: [
      { emoji: '💬', label: 'Messaging family and real friends' },
      { emoji: '🎥', label: 'Creating: video, music, code' },
      { emoji: '🔍', label: 'Searching with your judgement on' },
      { emoji: '🎮', label: 'Games with people you know' },
    ],
    // Never a promised account or an age (passport journey plan, PR 4): the
    // line describes practice, and follows the law flag whichever way it lands.
    later: EXPLORER_LATER[SOCIAL_MEDIA_LAW],
  },
  4: {
    greatNow: [
      ...(SOCIAL_MEDIA_LAW === 'none' ? [{ emoji: '✨', label: 'First accounts, set up together' }] : [{ emoji: '🧭', label: 'Practising how a feed works' }]),
      { emoji: '💬', label: 'Group chats with real friends' },
      { emoji: '🎥', label: 'Creating and sharing your work' },
      { emoji: '🧭', label: 'Spotting what the feed is doing' },
    ],
    later: 'The full phone comes when you and your grown up agree, and by then none of it will be new to you.',
  },
  5: {
    greatNow: [
      { emoji: '🚀', label: 'Your call now, you know how it works' },
      { emoji: '🧭', label: 'Feeds with your eyes open' },
      { emoji: '💛', label: 'Balance you set yourself' },
    ],
    later: 'This is the whole point. You built up to it, step by step, no cliff edge.',
  },
}

// The stance, in one clear paragraph, so the brand is never open to the charge
// that a screen reduction product put a phone in a young child's hand. It is the
// answer to the contradiction, and it is honest: we recommend, we never police.
export const OUR_STANCE = {
  headline: 'We do not put phones in children’s hands',
  body: 'For under 11s, Guided Childhood is parent led, done together on your device, no child device needed. For families whose older children already have a device, we make its time earned and balanced rather than endless. And we never police your family. We point the way the evidence points, and the choice is always yours.',
}

// The measured science, in plain words. Deliberately not the moral panic line.
// This is what makes the gradual on ramp credible rather than just another
// screen time app: we are not banning a number, we are building competence.
export const WHY_IT_WORKS = {
  eyebrow: 'Why a gradual on ramp, not a cliff edge',
  headline: 'The number on a screen was never the whole story',
  body: 'Handing a child social media cold at 13, or banning it and then handing over a full phone at 16 with no practice, is the cliff edge. Guided Childhood is the on ramp. Stage by stage, your child earns the skills and the balance to handle what comes next, so by the time the phone is really theirs, none of it is new.',
  points: [
    { icon: '⚖️', title: 'Balance, not a ban', body: 'The research is clear that the quantity of screen time explains very little on its own. What matters is what screens crowd out, and whether a child can handle what is on them. So we build balance and skill, not a countdown.' },
    { icon: '🪪', title: 'A passport, not a birthday', body: 'Independence is handed over in steps as the skills are shown, the graduated digital passport idea, not all at once on a birthday. Each stage earns its stamp.' },
    { icon: '🧭', title: 'Competence is the protection', body: 'Our view: a child who understands the feed, owns their footprint, and knows you are the first call is better prepared than a child kept away from it and then dropped in. The relationship and the skill are what we build. What the research does and does not show is below.' },
  ],
  sources: 'Grounded in the measured research of Candice Odgers and Amy Orben (Cambridge), on what actually shapes a child’s relationship with screens.',
}

// WHAT THE EVIDENCE SAYS, AND WHAT IT DOES NOT (18 November 2026).
//
// Justin asked that the passport be scientifically proven to give a safer
// childhood online. No study has tested a programme like this, so we cannot
// say that, and "evidence or silence" means we do not. These five lines were
// checked against the primary sources by the citation verifier on 18 November
// 2026 (plans/2026-11-17-passport-stickers-plan.md, part 5). Two corrections
// it made matter and must not drift back:
//   Livingstone 2017: enabling parenting went with MORE opportunities AND
//     more risks, not fewer risks, and harm was never measured.
//   EU Kids Online 2011: more skills went with MORE risk, not less; children
//     with fewer skills were among those who found risks more upsetting.
// Every line is an association or a lab finding, worded as one.
export const PASSPORT_EVIDENCE = {
  eyebrow: 'What the research says, honestly',
  points: [
    { title: 'Remembering, not rereading', body: 'Recalling what you have learned, rather than rereading it, improves how much you remember days later. That is shown in adult lab studies, and it is why every lesson ends with a short check.', source: 'Roediger and Karpicke, 2006' },
    { title: 'Little and often, then back again', body: 'Our lessons follow established teaching principles: a short review each time, checking understanding, and coming back to material weeks and months later.', source: 'Rosenshine, 2012' },
    { title: 'Media literacy lessons help', body: 'Across 51 media literacy programmes the average effect was positive. It was largest for knowledge, smaller for behaviour, and programmes with more sessions did better. None of them were about online safety specifically.', source: 'Jeong, Cho and Hwang, 2012' },
    { title: 'Involved parenting, not only blocking', body: 'In a survey of 6,400 European parents of 6 to 14 year olds, involved, enabling parenting went with children doing more of what the internet offers. Restrictive parenting went with fewer risks but also fewer opportunities.', source: 'Livingstone and colleagues, 2017' },
    { title: 'Skills and coping', body: 'In a 25 country survey of 9 to 16 year olds, children with more digital skills met more online risk, not less. Children with fewer skills were among those who found risks more upsetting.', source: 'EU Kids Online, 2011' },
  ],
  honest: 'What no study shows yet is that a programme like this makes children safer. So we measure what we can: lessons passed with a real check, and questions still remembered weeks later.',
}
