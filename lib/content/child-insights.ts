// The child balance insight bank. Small, warm, character led cards that teach
// a growing child why balance is worth it, in their own app, in the DiGi
// squad's voices. Grounded only in the science we already hold and the
// philosophy we share with our groups, never invented. Best practice for
// talking to children about screens runs through every line here:
//
//   1. Autonomy, not orders. A child who feels in charge of their own time
//      builds real self regulation. So we say "you are the boss of your time",
//      never "you must".
//   2. Celebrate the good choice, never shame the screen. Fear and guilt
//      backfire with children; warmth and pride stick. Screens are always
//      "brilliant", and balance is the superpower on top.
//   3. Intrinsic reasons, not just stars. Fun, feeling good, sleep, friends,
//      pride. The reward economy lives elsewhere; here we grow the why.
//   4. One idea per card, banded to the child's stage so the words and the
//      reasoning fit how they think.
//   5. Every claim traceable to the science bank (the source line), so this
//      surface can be defended to a parent, a school or a regulator.
//
// Stages map to age: 1 = 4 to 7, 2 = 8 to 10, 3 = 11 to 13, 4 = 13 to 15,
// 5 = 16+. Each insight lists the stages it suits, so younger children get
// concrete and short, older ones get the real reasoning.

export type InsightTheme = 'offline' | 'save' | 'connect' | 'brain' | 'watch' | 'task'
export type InsightCharacter = 'digi' | 'pebble' | 'bloop' | 'orbit' | 'nova' | 'cosmo'

export type ChildInsight = {
  id: string
  theme: InsightTheme
  character: InsightCharacter
  emoji: string
  headline: string
  body: string
  stages: number[]
  // The evidence basis. Internal, for traceability, not shown to the child.
  source: string
}

export const CHILD_INSIGHTS: ChildInsight[] = [
  // Offline play grows the body and brain (the displacement idea, made joyful)
  {
    id: 'offline-young', theme: 'offline', character: 'orbit', emoji: '🌳',
    headline: 'Out there is where you get your superpowers',
    body: 'Running, jumping and building make your body and brain grow big and strong. Screens are brilliant, but real play is the secret power up.',
    stages: [1, 2],
    source: 'Screen harm is mostly displacement: what screens crowd out (movement, play, sleep). Protect the play.',
  },
  {
    id: 'offline-older', theme: 'offline', character: 'orbit', emoji: '🌳',
    headline: 'Your brain grows most when you make and do',
    body: 'Building, sport, music, making things with your hands. This is when your brain wires up the strongest. A screen after that hits different to a screen instead of it.',
    stages: [3, 4, 5],
    source: 'Active, hands on time builds skills and wellbeing; the risk is when it is replaced, not added to.',
  },

  // You do not need to use it all (self regulation, framed as power)
  {
    id: 'save-any', theme: 'save', character: 'digi', emoji: '⏳',
    headline: 'You do not have to use it all',
    body: 'Saving some screen time for another day is a boss move. You are the boss of your own time, and choosing when to stop is a real superpower.',
    stages: [1, 2, 3, 4, 5],
    source: 'Self regulation grows when a child practises stopping by choice, not only by a rule.',
  },

  // Connecting with real people and helping at home (relatedness, prosocial)
  {
    id: 'connect-young', theme: 'connect', character: 'nova', emoji: '🤝',
    headline: 'Real people fill your happy tank',
    body: 'Playing and chatting with people face to face fills you up more than any screen. Helping at home makes you feel proud too. Try it and see.',
    stages: [1, 2, 3],
    source: 'Connection and prosocial acts (helping) are among the strongest, most reliable lifts to child wellbeing.',
  },
  {
    id: 'connect-older', theme: 'connect', character: 'nova', emoji: '🤝',
    headline: 'The best chats are the ones in the room',
    body: 'Messaging is fun, but time with people in real life is what actually settles your mood and builds friendships that last. Pitch in at home too, it feels better than it sounds.',
    stages: [3, 4, 5],
    source: 'In person connection and contribution predict wellbeing more than online interaction alone.',
  },

  // Why the brain needs balance: sleep and mood, child friendly
  {
    id: 'brain-young', theme: 'brain', character: 'digi', emoji: '🧠',
    headline: 'Your brain does its best growing at night',
    body: 'When you sleep, your brain sorts out everything you learned today. Screens right before bed can make sleep tricky, so we keep them for the daytime.',
    stages: [1, 2, 3],
    source: 'Screens near bedtime disrupt sleep onset and quality; sleep is when memory and mood reset.',
  },
  {
    id: 'brain-older', theme: 'brain', character: 'bloop', emoji: '🧠',
    headline: 'Balance is what keeps your mood steady',
    body: 'Too much of one thing, scrolling included, can leave you flat or wired. Mixing screens with sleep, movement and real life is what keeps your head feeling good.',
    stages: [3, 4, 5],
    source: 'Wellbeing tracks balance and displacement more than screen time alone; sleep and activity are protective.',
  },

  // What is worth watching: quality over scroll (active vs passive)
  {
    id: 'watch-young', theme: 'watch', character: 'bloop', emoji: '🎬',
    headline: 'Pick something that teaches or makes you create',
    body: 'When it is screen time, choose a thing that shows you how to make or do something. Making one thing beats scrolling past a hundred things.',
    stages: [1, 2, 3],
    source: 'Active, creative and educational use is more beneficial than passive infinite scrolling.',
  },
  {
    id: 'watch-older', theme: 'watch', character: 'bloop', emoji: '🎬',
    headline: 'Choose it, do not just fall into it',
    body: 'Deciding what to watch or play before you start beats letting the app decide for you. Creating, learning or a chosen show beats an hour you did not really choose.',
    stages: [3, 4, 5],
    source: 'Intentional, chosen use protects wellbeing; algorithm led passive use is the weaker pattern.',
  },

  // A gentle try this today nudge
  {
    id: 'task-any', theme: 'task', character: 'digi', emoji: '⭐',
    headline: 'Try this today',
    body: 'Do one quest before your screen time. Future you will feel great, and your stars grow while you are at it.',
    stages: [1, 2, 3, 4, 5],
    source: 'A small win before reward builds the habit loop in the healthy direction.',
  },
]

export function insightsForStage(stageId: number): ChildInsight[] {
  const list = CHILD_INSIGHTS.filter(i => i.stages.includes(stageId))
  return list.length > 0 ? list : CHILD_INSIGHTS
}
