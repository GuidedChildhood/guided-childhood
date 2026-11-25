// THREE THINGS A CHILD AT THIS STAGE SHOULD UNDERSTAND, FROM THE CURRICULUM.
//
// Justin, 25 November 2026: the stage check result leads with the curriculum
// and the Passport, "ready before 16". So under "what this stage means" the
// page shows what the road actually teaches at this stage, and the only honest
// source for that is the lessons themselves.
//
// Each line is a lesson's single_action_outcome, copied word for word from
// content/modules (the same text the school_lessons rows carry and the child's
// lesson list shows), with the lesson's own title beside it. Quote, never
// paraphrase: the rule on every curriculum surface we have. The stage a lesson
// belongs to is the one shared/stage-map.ts gives its key stage, never a
// guess. scripts/check-stage-outcomes.mjs holds both, so a lesson renamed or
// rewritten fails the guard rather than leaving this page quoting a sentence
// the product no longer teaches.
//
// Copied here rather than read from the modules because this page is a client
// screen read before anyone has an account, and each module file carries its
// whole slide deck. Three short strings a stage is all it needs.
//
// The picks lean on the ready before 16 list (scams, group chats, AI, who they
// are really talking to). Independent has two because KS5 teaches two.

export type StageOutcome = {
  /** The module the line is quoted from, in content/modules. */
  moduleId: string
  /** The lesson's title, as the lessons hub shows it. */
  title: string
  /** The lesson's single_action_outcome, word for word. */
  outcome: string
}

export const STAGE_OUTCOMES: Record<1 | 2 | 3 | 4 | 5, StageOutcome[]> = {
  1: [
    { moduleId: 'eyfs-01-screens-kindness', title: 'Screens and kindness, real and not real', outcome: 'I can ask a grown up if something on a screen is real.' },
    { moduleId: 'ks1-32-private-like-a-toothbrush', title: 'Private like a toothbrush', outcome: 'I can keep private things private, and ask before I share.' },
    { moduleId: 'ks1-33-who-is-on-the-other-side', title: 'Who is on the other side?', outcome: 'I can notice who is on the other side, and act.' },
  ],
  2: [
    { moduleId: 'ks2-06-how-algorithms-work', title: 'How algorithms work', outcome: 'I can explain why my feed keeps me watching.' },
    { moduleId: 'ks2-05-gaming-time-spend', title: 'Gaming: time, intensity and spend', outcome: 'I can spot when a game is trying to get me to spend.' },
    { moduleId: 'ks2-23-when-a-machine-talks-like-a-friend', title: 'When a machine talks like a friend', outcome: 'I can name two things a real friend can do that a machine cannot.' },
  ],
  3: [
    { moduleId: 'ks3-13-scams-fraud-money', title: 'Scams, fraud and money online', outcome: 'I can spot a scam’s three tells.' },
    { moduleId: 'ks3-11-social-workarounds', title: 'Social media, group chats and the workarounds', outcome: 'I can explain the risk behind a workaround I might be tempted by.' },
    { moduleId: 'ks3-12-misinfo-deepfakes', title: 'Misinformation, deepfakes and AI content', outcome: 'I can run three checks before I believe or share something.' },
  ],
  4: [
    { moduleId: 'ks4-15-manipulation-persuasion', title: 'Manipulation and persuasion', outcome: 'I can name the technique being used on me.' },
    { moduleId: 'ks4-29-did-not-go-looking', title: 'The content you did not go looking for', outcome: 'I know what to do with something I never asked to see, and that I am not in trouble for it.' },
    { moduleId: 'ks4-19-readiness-at-16', title: 'Readiness at 16: the ban world', outcome: 'I can plan how I will handle full access when it arrives.' },
  ],
  5: [
    { moduleId: 'ks5-20-ai-mastery-data-rights', title: 'AI mastery and data rights', outcome: 'I can use an AI tool and defend where I checked its work.' },
    { moduleId: 'ks5-21-digital-identity-future-work', title: 'Digital identity and the future of work', outcome: 'I can name the human skills I am building that AI cannot replace.' },
  ],
}
