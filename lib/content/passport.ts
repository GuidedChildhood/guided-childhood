// The social media passport.
//
// This is the spine of the whole platform said in one line: the digital
// pathway is your child's social media passport. Just as a child cannot
// drive without a licence, they step onto real social media with a passport
// they have earned, one stage at a time, from age 4 to 16.
//
// The idea and the evidence come from Professor Sander van der Linden and the
// wider work of the University of Cambridge, the national academies of
// science, and the safety by design movement. A ban is a wall. A wall
// postpones the problem to 16, the exact moment a child in the UK also gets
// the vote, the cliff edge. The passport prepares instead: gradual controlled
// exposure and digital resilience built through the school years, so 16 is a
// step, not a fall.
//
// Everything here is one source of truth, reused by the dashboard readiness
// card and the marketing evidence page, so the story never drifts. No dashes
// in any copy, ever.

export interface EvidencePoint {
  // The one line a parent remembers.
  headline: string
  // The support underneath it, plain and warm.
  detail: string
  // Who says so. Named, so it carries weight and stays honest.
  source: string
}

// The evidence, most load bearing first. These are the highlights Justin
// wants surfaced along the way to 16.
export const PASSPORT_EVIDENCE: EvidencePoint[] = [
  {
    headline: 'Preparing beats postponing',
    detail:
      'A ban does not fix what sits underneath social media, it just moves the moment to 16. The evidence points the other way: build digital resilience gradually, through the school years, so a child arrives ready rather than raw.',
    source: 'Prof. Sander van der Linden, University of Cambridge',
  },
  {
    headline: 'A wall is not a plan',
    detail:
      'In Australia around 60 percent of children found a way around the ban within weeks, and the most influential stayed on, so the social norm never shifted. Workarounds leave a child alone with whatever they meet next. Guidance travels with them, a ban does not.',
    source: 'Reported outcomes of the Australian under 16 ban',
  },
  {
    headline: 'The harms are real, and so are the benefits',
    detail:
      'The national academies find small negative links between heavy use and teen mental health, real harms worth taking seriously. They also find real benefits: connection, support, a lifeline for some, especially for children who feel alone offline. The answer is a scalpel, not a blanket.',
    source: 'Reviews by the national academies of science',
  },
  {
    headline: 'Sixteen is a cliff edge, unless you build a ramp',
    detail:
      'As the UK lowers the voting age to 16, a teenager can meet their first vote and their first social media in the same year. Two big things at once, with no run up. The pathway turns that cliff edge into a gentle ramp, one earned stage at a time.',
    source: 'On the UK voting age change and the delay to 16',
  },
  {
    headline: 'Children deserve feeds that are safe by design',
    detail:
      'Not the adult feed with a younger label. Clean feeds, no infinite scroll, no autoplay, no messages from strangers. Part of the passport is teaching a child to expect that, and to notice the moment a feed stops being safe.',
    source: 'The safety by design principle',
  },
]

// The passport stated as the one line, for reuse in headers and cards.
export const PASSPORT_TAGLINE =
  'The digital pathway is your child’s social media passport'

export const PASSPORT_ANALOGY =
  'Just as a child cannot drive without a licence, they step onto social media with a passport they have earned, one stage at a time.'

// The readiness picture for a single stage: where the child is on the passport
// journey, and how loud the social media training should be right now. The
// weight climbs from about 13, the run up to the cliff edge, exactly where a
// parent needs it heaviest.
export type ReadinessWeight = 'foundational' | 'building' | 'heavy' | 'earned'

export interface StageReadiness {
  weight: ReadinessWeight
  // The eyebrow that names the moment.
  moment: string
  // The headline for the dashboard card.
  title: string
  // One or two sentences, warm and specific to the stage.
  body: string
  // The single thing to do or talk about this stage.
  focus: string
}

// Keyed by numeric stage id (1 to 5), matching lib/content/stages.ts.
export const STAGE_READINESS: Record<number, StageReadiness> = {
  1: {
    weight: 'foundational',
    moment: 'The passport starts here',
    title: 'The very first pages',
    body:
      'No feeds, no solo device, nothing to navigate alone yet. This is where a child first learns that some things on a screen are true and some are not, side by side with you. Every stage after this builds on it.',
    focus:
      'Keep it shared. Same room, same screen. The passport is being written already, in how calm and normal screens feel at home.',
  },
  2: {
    weight: 'building',
    moment: 'The passport builds',
    title: 'Before the algorithm learns them',
    body:
      'Habits set now, before any feed starts studying your child. The bedroom rule, a first restricted device, and the earliest idea of what an algorithm even is. Quiet groundwork for the bigger conversations coming next.',
    focus:
      'Name the algorithm out loud in a simple way. A child who knows a feed is trying to keep them watching is already harder to hook.',
  },
  3: {
    weight: 'building',
    moment: 'The passport steps up',
    title: 'The algorithm conversation, the critical window',
    body:
      'This is the highest risk window the Cambridge research flags, and the year the passport does its most important teaching. Not open social media yet, but the real work: how a feed learns you, how comparison creeps in, how to feel it happening and step back.',
    focus:
      'Open a feed together, curious not cross. The child who can watch the algorithm work on them is building the resilience the whole passport is for.',
  },
  4: {
    weight: 'heavy',
    moment: 'The run up to the cliff edge',
    title: 'Heavy training for 16',
    body:
      'From about 13 the training turns serious, because 16 is close now. This is where the passport is earned: what a safe feed looks like and when to walk from one that is not, the harms and the real benefits side by side, footprint, pressure, and who to call the moment something goes wrong. Preparing, not postponing.',
    focus:
      'Little and often beats one big talk. Each week, one honest conversation about their actual digital life, so the run up to 16 is gradual, not a drop.',
  },
  5: {
    weight: 'earned',
    moment: 'Passport earned',
    title: 'Ready for the real thing',
    body:
      'Sixteen arrives and it is a step, not a fall. Your child meets real feeds already knowing how they work, what a safe one looks like, and how to get help. The conversation shifts from rules to a relationship between two people who both understand the terrain.',
    focus:
      'Move to peer to peer. Ask what technology gives them and what it costs them. A child who can answer that has passed.',
  },
}
