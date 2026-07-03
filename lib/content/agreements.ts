import type { StageId } from '@/lib/pathway/progress'

// The family agreement clause library, per stage. Grounded in the expert
// panel the scripts are checked against: Dr Becky Kennedy (sturdy
// leadership: the grown ups make promises too, and consequences repair
// rather than punish), Catherine Knibbs (trauma informed: telling a grown
// up is always safe, even when a rule was broken first), and Sue Atkins
// (practical: a clause has to hold at 7pm on a Tuesday, not just on paper).
//
// These are suggestions the family picks from and edits, not rules handed
// down. A real agreement has both sides in it, which is why every stage
// has parent clauses too.

export interface AgreementTemplate {
  stageLabel: string
  intro: string
  childClauses: string[]
  parentClauses: string[]
  whenItGoesWrong: string
}

export const AGREEMENT_TEMPLATES: Record<StageId, AgreementTemplate> = {
  foundation: {
    stageLabel: 'Foundation · Ages 4 to 7',
    intro: 'At this age the agreement is short, concrete, and about building the first habits together. Read it out loud, let your child hold the pen when you both sign it, and stick it on the fridge.',
    childClauses: [
      'I ask a grown up before I turn a screen on.',
      'When my screen time ends, I hand the screen back and we do the next thing together.',
      'Screens stay in the living room, not my bedroom.',
      'I tell a grown up straight away if something on a screen feels scary or strange.',
      'No screens at the table when we eat.',
      'I pick what to watch together with a grown up.',
    ],
    parentClauses: [
      'We give you a five minute warning before screen time ends, every time.',
      'We never use screens as a punishment or a bribe.',
      'We watch what you watch, so we can talk about it and laugh about it.',
      'Our phones go away at dinner too. Same rule for everyone.',
      'If you tell us about something scary you saw, we stay calm and we will never take the screen away for telling us.',
      'We keep the hour before bed screen free for the whole family.',
    ],
    whenItGoesWrong: 'When the agreement gets broken, and some days it will, we talk about what happened and try again tomorrow. Nobody shouts, nobody loses everything. The agreement stays, the day resets.',
  },
  builder: {
    stageLabel: 'Builder · Ages 8 to 10',
    intro: 'Your child is old enough to negotiate now, and an agreement they helped write is one they will actually keep. Go clause by clause and let them push back. The conversation is the point.',
    childClauses: [
      'I ask before downloading a new game or app, and we look at it together first.',
      'When my time is up I do the cool down lap: one more minute to finish, then off without a battle.',
      'I tell a grown up if a stranger messages me in a game or app, even if it seems friendly.',
      'My screens sleep outside my bedroom overnight.',
      'Homework and jobs come before long screen sessions on school days.',
      'I use kind words in game chats, the same words I would use face to face.',
      'I tell someone in this house if I see something that makes me feel weird or bad.',
    ],
    parentClauses: [
      'We give you a proper warning before time is up, not a surprise shutdown.',
      'When you tell us about something that happened online, we listen first and we do not grab the device.',
      'We learn the games you love enough to actually talk about them with you.',
      'We follow the same table rules and bedtime screen rules we ask of you.',
      'We do not read your messages behind your back. If we are worried, we look together.',
      'We say yes to new things where we can, and when we say no we explain why.',
    ],
    whenItGoesWrong: 'A broken clause means a conversation, not a confiscation. We work out what made it hard to keep, fix the clause if it was unrealistic, and start again the next day. Honesty about a slip never makes the consequence worse.',
  },
  explorer: {
    stageLabel: 'Explorer · Ages 11 to 13',
    intro: 'This is the age of first phones and group chats, and the agreement matters more than ever. Negotiate it properly: your child should win at least one clause they argued for, or it is not an agreement.',
    childClauses: [
      'My phone sleeps outside my bedroom, on the family charger, every night.',
      'I will tell you about anything online that makes me uncomfortable, even if I broke a rule to get there.',
      'I treat the group chat like a room I am standing in: if I would not say it out loud, I do not type it.',
      'I do not open new accounts on new platforms without a conversation first.',
      'I keep a balance in my week: screens, moving my body, and seeing friends in real life.',
      'If someone is being piled on in a chat, I do not join in, and I tell someone if it is serious.',
    ],
    parentClauses: [
      'We knock and ask. We do not grab the phone out of your hands.',
      'If you come to us about something that went wrong online, telling us will never make your consequence worse. Ever.',
      'We understand the group chat is your social life, not a toy, and we will not confiscate your friendships as a punishment.',
      'We review this agreement together every month and change what is not working.',
      'Our own phones follow the same overnight rule. Check us on it.',
      'We will not comment on or contact your friends online without asking you first.',
    ],
    whenItGoesWrong: 'When a clause gets broken we deal with the behaviour, not the whole digital life. The consequence fits the slip, it is agreed calmly, and it ends. Coming to us honestly always counts in your favour.',
  },
  shaper: {
    stageLabel: 'Shaper · Ages 13 to 15',
    intro: 'The agreement now is about trust that grows, sleep that stays protected, and a plan for 16. Less supervision, more partnership. Expect to renegotiate it every school term.',
    childClauses: [
      'My sleep hours are protected. The phone is out of my room by an agreed time on school nights.',
      'If I am ever in trouble online, in any way, I come to you first, no matter what rule got broken on the way.',
      'I check before I share: is it true, is it kind, would I stand behind it with my name on it?',
      'If the law says a platform is 16 plus, I will not build secret accounts to get around it. We plan for 16 together instead.',
      'I tell you where I am when plans change, and I answer when it matters.',
      'I stay alert for pressure in private messages, and I know that screenshots of me are something I can always talk to you about.',
    ],
    parentClauses: [
      'Your privacy grows as trust grows. We do not read your messages without you there, unless we genuinely believe you are unsafe.',
      'Honesty is never punished in this house. Whatever happened, telling us is always the right move and we will act like it.',
      'We are helping you get ready for 16, not just guarding the gate until then.',
      'Our first response will be calm. If we cannot be calm in the moment, we take ten minutes and come back.',
      'We renegotiate this agreement each term as you show us what you can carry.',
      'We respect that your online spaces are real spaces, and we treat what happens there as seriously as school or home.',
    ],
    whenItGoesWrong: 'Broken trust is repaired, not just punished. We name what happened, agree what rebuilding looks like, and set a date when the extra checks come off. Nothing is forever, and honesty always shortens the road back.',
  },
  independent: {
    stageLabel: 'Independent · Ages 16 and above',
    intro: 'This is barely a rules document any more. It is a mutual agreement between adults in the making: what you can count on from each other while you still live under one roof.',
    childClauses: [
      'I keep talking to you about the big stuff, even when it is awkward.',
      'I manage my own sleep and screens now, and I am honest with myself when the balance slips.',
      'If something heavy lands on me online, money, images, threats, anything, I bring it to family before it grows.',
      'I look out for my younger siblings online the way I wish someone had looked out for me.',
    ],
    parentClauses: [
      'We give advice when you ask for it, not surveillance you did not agree to.',
      'Your accounts and your messages are yours. Full stop.',
      'We treat you as the adult you are becoming, including when you get it wrong.',
      'The door is always open, at 2pm or 2am, and the first response will always be help, not blame.',
    ],
    whenItGoesWrong: 'At this stage there are no confiscations, only conversations. If something goes wrong we solve it side by side, as the family you will still call when you are 30.',
  },
}
