import type { AgeBand } from './stages'

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
  skill: string   // the competence this stage builds
  toward: string  // what it is building toward, the 16 ready line
}

export const READINESS: ReadinessStamp[] = [
  {
    id: 1, stage: 'Foundation', ages: 'Ages 4 to 7', ageBand: '4-7',
    stamp: 'Steady stops',
    skill: 'Screens go off calmly, so the off switch is never a battle.',
    toward: 'the self control they will lean on when the algorithm arrives.',
  },
  {
    id: 2, stage: 'Builder', ages: 'Ages 8 to 10', ageBand: '8-10',
    stamp: 'Healthy habits',
    skill: 'The habits get set (bedroom rule, earned time) before an app tries to set them first.',
    toward: 'walking in with their own habits, not ones a feed built for them.',
  },
  {
    id: 3, stage: 'Explorer', ages: 'Ages 11 to 13', ageBand: '11-13',
    stamp: 'How it works',
    skill: 'They learn how the feed and the algorithm are built to hold them.',
    toward: 'using social media with their eyes open, not being used by it.',
  },
  {
    id: 4, stage: 'Shaper', ages: 'Ages 13 to 15', ageBand: '13-15',
    stamp: 'Real footprint',
    skill: 'They own their identity online, and know you are the first call when things go wrong.',
    toward: 'handling the hard moments with you beside them, not hiding them.',
  },
  {
    id: 5, stage: 'Independent', ages: 'Ages 16 and above', ageBand: '16+',
    stamp: 'Ready',
    skill: 'They decide for themselves what a healthy digital life looks like.',
    toward: 'the full phone, ready, because they built up to it and did not fall off a cliff.',
  },
]

export function readinessForAgeBand(ageBand: AgeBand | null): ReadinessStamp {
  return READINESS.find(r => r.ageBand === ageBand) ?? READINESS[0]
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
    { icon: '🧭', title: 'Competence is the protection', body: 'A child who understands the feed, owns their footprint, and knows you are the first call is safer than a child kept away from it and then dropped in. The relationship and the skill are the safeguard.' },
  ],
  sources: 'Grounded in the measured research of Candice Odgers and Amy Orben (Cambridge), on what actually shapes a child’s relationship with screens.',
}
