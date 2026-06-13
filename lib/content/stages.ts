export type AgeBand = '4-7' | '8-10' | '11-13' | '13-15' | '16+'
export type ChallengeId = 'screens_takeover' | 'mood_changes' | 'gaming' | 'online_safety' | 'start_conversation' | 'asking_for_phone'
export type FeelingId = 'anxious' | 'unsure' | 'ready'

export interface Stage {
  id: 1 | 2 | 3 | 4 | 5
  name: string
  ageBand: AgeBand
  ages: string
  keyStage: string
  yearGroup: string
  usGrade: string
  focus: string
  device: string
  isCritical: boolean
  script: {
    title: string
    sayThis: string
    notThis: string
    why: string
  }
  action: string
  warningSigns: string[]
  parentQuote: string
  digiContext: string
  challengeActions: Partial<Record<ChallengeId, string>>
}

export const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Foundation',
    ageBand: '4-7',
    ages: 'Ages 4 to 7',
    keyStage: 'KS1',
    yearGroup: 'Year 1 to 3',
    usGrade: 'Grades K to 2',
    focus: 'First relationships with technology, before habits form',
    device: 'Shared family device with full supervision',
    isCritical: false,
    script: {
      title: 'The First Device Conversation',
      sayThis: 'We have a family rule about screens. When the timer goes off, screens go down. Every time, no exceptions. And then we do something together.',
      notThis: '"Just five more minutes." Once you move the line, it moves every time.',
      why: 'Children at this stage cannot regulate device use themselves. The rule is not a punishment, it is the structure that makes screen time safe. Consistent boundaries now build the self-regulation they will need at 13.',
    },
    action: 'Set up a charging station in the kitchen or hallway tonight. Devices do not sleep in bedrooms in this house.',
    warningSigns: [
      'Tantrums or real distress when a device is taken away',
      'Choosing screens over play every time they have a choice',
      'No longer interested in activities they loved before devices',
    ],
    parentQuote: '"I did not realise how much the routine would help. The timer was a game-changer."',
    digiContext: 'Stage 1 parent. Child aged 4 to 7. Focus on first device rules, family norms, routine building. Never recommend unsupervised screen time. Bedroom rule applies from day one.',
    challengeActions: {
      screens_takeover: 'Set a visual timer (sand timer or Alexa) and agree together when screens stop. The timer is the rule, not you.',
      mood_changes: 'Try a 10-minute wind-down between screens and the next activity. At this age, mood is often about the transition, not the screen itself.',
      gaming: 'Play with them for 10 minutes. Understand the game before you set any limits on it.',
      online_safety: 'At this age, online safety means one thing: same room, same screen. No unsupervised time.',
      start_conversation: 'Try tonight: "What do you like best about that show?" Then listen for two full minutes before saying anything.',
      asking_for_phone: 'The answer is not yet — it is "here is what we will build first." Talk about what a device earns, not what age unlocks it.',
    },
  },
  {
    id: 2,
    name: 'Builder',
    ageBand: '8-10',
    ages: 'Ages 8 to 10',
    keyStage: 'KS2',
    yearGroup: 'Year 3 to 6',
    usGrade: 'Grades 3 to 5',
    focus: 'Building digital habits before the algorithm learns them',
    device: 'Shared device moving toward a supervised personal device',
    isCritical: false,
    script: {
      title: 'The Bedroom Rule',
      sayThis: 'Where does your phone sleep at night? In our house, phones sleep in the kitchen. The bedroom is for sleep. That is our rule and it will not change.',
      notThis: '"You need to earn the right to have it in your room." That makes it a prize, not a family norm.',
      why: 'Sleep is the non-negotiable. Blue light, notification sounds, and the temptation to check at 2am are all removed by one consistent rule. Set it now, before they have a personal device, and it is just how things work.',
    },
    action: "Have the bedroom rule conversation tonight, not as a rule you are imposing, but as a family decision. 'Where should our devices sleep?'",
    warningSigns: [
      'Using devices secretly or hiding what they watch',
      'Starting to compare themselves to what they see online',
      'Mood changes around device removal that feel out of proportion',
    ],
    parentQuote: '"I thought the bedroom rule would cause a fight. They actually seemed relieved someone had decided."',
    digiContext: 'Stage 2 parent. Child aged 8 to 10. Focus on habits, bedroom rule, transitions, early comparison. Bedroom rule is essential. Supervised personal device may be appropriate, feature phone not smartphone.',
    challengeActions: {
      screens_takeover: 'Agree on two screen-free zones in your home: mealtimes and bedrooms. Non-negotiable, consistent, no exceptions.',
      mood_changes: 'Note mood before and after screen time for one week. Then share what you notice as an observation, not a conclusion.',
      gaming: 'Ask them to teach you their favourite game. Play together for 10 minutes. Understanding before limits.',
      online_safety: 'The key conversation now: "You can always come to me if something online feels weird or wrong. I will not take the device away — I will help."',
      start_conversation: 'Try this: "What is the best thing you have seen online this week?" Then: "Has anything online ever made you feel bad about yourself?"',
      asking_for_phone: 'A feature phone (calls and texts, no apps) is a great first device at this stage. It builds independence without the algorithm.',
    },
  },
  {
    id: 3,
    name: 'Explorer',
    ageBand: '11-13',
    ages: 'Ages 11 to 13',
    keyStage: 'KS3',
    yearGroup: 'Year 7 to 8',
    usGrade: 'Grades 6 to 8',
    focus: 'The algorithm conversation before social media — the critical window',
    device: 'First personal device — feature phone strongly recommended over smartphone',
    isCritical: true,
    script: {
      title: 'The Algorithm Conversation',
      sayThis: 'Did you know your phone is learning what you like? Every video you watch, every post you pause on, it notes it. Let me show you something. Open your feed and we will look at it together.',
      notThis: '"That app is rotting your brain." That shuts the conversation down before it starts.',
      why: 'Children at 11 to 13 are in the highest-risk window identified by Cambridge MRC research. They are forming identity through comparison, and the algorithm amplifies whatever vulnerability it finds. The parent who can talk about this without alarm is the greatest protective factor.',
    },
    action: 'Open their feed together tonight. No judgment, just curiosity. "Interesting — why do you think it showed you that?" Stay for 10 minutes.',
    warningSigns: [
      'Mood drops noticeably after phone use',
      'Anxiety about being left out of what is happening online',
      'Sleep disruption — checking phone after lights out',
      'Withdrawal from family conversations',
    ],
    parentQuote: '"Her mood was dropping every Sunday evening. It took me a month to connect it to Instagram."',
    digiContext: 'Stage 3 parent. Child aged 11 to 13. CRITICAL DEVELOPMENTAL WINDOW. Orben research applies, adolescent girls especially at risk. Focus on the algorithm conversation, bedroom rule, comparison culture. Social media requires readiness conversation, not just age.',
    challengeActions: {
      screens_takeover: 'The bedroom rule is your most powerful tool right now. If it is not in place, start there tonight.',
      mood_changes: 'Sit together and scroll their feed for 10 minutes. Ask what they feel, not what they think. "Does any of this make you feel good about yourself?"',
      gaming: 'Ask what they love about the game. The community, the challenge, the escape? Understanding the function tells you what need it is meeting.',
      online_safety: 'Say this clearly: "If anyone online ever makes you uncomfortable, or asks you to keep something secret, you tell me immediately. I will help first and ask questions later."',
      start_conversation: 'Script for tonight: "I have been reading about how algorithms work. Can I show you something? I think it is actually kind of fascinating."',
      asking_for_phone: 'Before social media comes a conversation about how the algorithm works. Their response to that conversation is what readiness looks like.',
    },
  },
  {
    id: 4,
    name: 'Shaper',
    ageBand: '13-15',
    ages: 'Ages 13 to 15',
    keyStage: 'KS3 to KS4',
    yearGroup: 'Year 9 to 10',
    usGrade: 'Grades 8 to 10',
    focus: 'Identity formation and digital footprint while the relationship still holds',
    device: 'Smartphone with agreed family guidelines in place',
    isCritical: false,
    script: {
      title: 'When Things Go Wrong Online',
      sayThis: 'If anything ever goes wrong online — and things do go wrong — I am the first call you make, not the last. I will not overreact. I will help.',
      notThis: '"If I catch you doing that, I am taking your phone." That closes the door before anything happens.',
      why: 'Teenagers at this stage need to know the door is open before anything goes wrong. A child who fears losing their phone is a child who hides problems. This script keeps the door open.',
    },
    action: 'Set up a no-agenda weekly 10 minutes. Not about screens, not about homework. Just checking in. Same day, same time.',
    warningSigns: [
      'Secretive phone use or panic if you pick up the device',
      'Extreme mood swings tied to online interactions',
      'Online relationships that feel more real than offline ones',
      'Withdrawal from activities they previously enjoyed',
    ],
    parentQuote: '"He finally told me what had happened because I had said that line. Months earlier. I did not even remember saying it."',
    digiContext: 'Stage 4 parent. Child aged 13 to 15. Focus on identity, footprint, open-door safety, gaming culture. Relationship is the protection at this stage. LGBTQ+ youth: never suggest restriction. Online community may be essential.',
    challengeActions: {
      screens_takeover: 'Shift the frame from time to context. Not "how long" but "what are you actually getting from this right now?" That is the question that gets somewhere.',
      mood_changes: 'Try: "I have noticed your mood sometimes changes after being on your phone. Have you noticed that?" Leave space for silence. Do not fill it.',
      gaming: 'Ask about the people they play with online. Gaming at this age is almost always social. The game is the venue, not the point.',
      online_safety: 'Make sure the open door is open. "If anything ever makes you uncomfortable online, I am the first call, not the last. I will not take your phone away. I will help."',
      start_conversation: 'Ask about one thing they have been into online this week. Not a test, genuine curiosity. Then ask one follow-up question.',
      asking_for_phone: 'You are probably past this, but if guidelines are still the conversation: agreed as a family, not imposed by you. Teens who own the decision stick to it.',
    },
  },
  {
    id: 5,
    name: 'Independent',
    ageBand: '16+',
    ages: 'Ages 16 and above',
    keyStage: 'KS4 to KS5',
    yearGroup: 'Year 11 and above',
    usGrade: 'Grades 11 to 12',
    focus: 'Building genuine digital independence before they leave home',
    device: 'Full smartphone — the conversation has shifted to digital literacy',
    isCritical: false,
    script: {
      title: 'Building Independence',
      sayThis: 'You are at the age where you get to decide what kind of digital life you build. What does your online presence say about who you are? Not to me — to the world.',
      notThis: '"Get off your phone." That conversation is over. A different one has started.',
      why: 'At 16, the goal is not compliance but genuine digital literacy. A young person who can articulate their own relationship with technology, what it gives them and what it costs them, is genuinely prepared for what comes next.',
    },
    action: 'Suggest a joint digital audit: go through their online presence together as peers, not parent and child. What does it say? What would they change?',
    warningSigns: [
      'Measuring self-worth through likes, followers or metrics',
      'Struggling to be fully present in real life situations',
      'Significant anxiety when without phone access',
      'No meaningful offline friendships or activities',
    ],
    parentQuote: '"I stopped trying to limit it and started asking different questions. That is when everything shifted."',
    digiContext: 'Stage 5 parent. Young person aged 16 and above. Focus on digital literacy, identity, footprint, independence. AI literacy, deepfakes, and vibe coding are relevant topics. The goal is genuine readiness, not compliance.',
    challengeActions: {
      screens_takeover: 'Ask: "Is your phone giving you what you want from it, or is it just habit?" That question is worth ten rules.',
      mood_changes: 'Try: "I have noticed you seem different after being on your phone. Is it giving you what you want from it?" Peer to peer, not parent to child.',
      gaming: 'At 16, gaming is often a career interest, a creative outlet, or a core social life. Engage with it seriously. Ask what they get from it.',
      online_safety: 'Sextortion, deepfakes, and AI-generated content are real at this age. Have a specific, matter-of-fact conversation about what to do if anything goes wrong. Not if, when.',
      start_conversation: 'Ask them to show you one thing online that they think you should know about. Then listen without judgment for five minutes.',
      asking_for_phone: 'At this stage the conversation is about upgrading the relationship, not unlocking a device. What does responsible independence look like for a near-adult?',
    },
  },
]

export function getStageFromAgeBand(ageBand: AgeBand): Stage {
  return STAGES.find(s => s.ageBand === ageBand) ?? STAGES[0]
}

export const AGE_BAND_OPTIONS: { label: string; value: AgeBand; sub: string }[] = [
  { label: '4 to 7 years', value: '4-7', sub: 'Stage 1 · Foundation' },
  { label: '8 to 10 years', value: '8-10', sub: 'Stage 2 · Builder' },
  { label: '11 to 13 years', value: '11-13', sub: 'Stage 3 · Explorer' },
  { label: '13 to 15 years', value: '13-15', sub: 'Stage 4 · Shaper' },
  { label: '16 and over', value: '16+', sub: 'Stage 5 · Independent' },
]

export const CHALLENGE_OPTIONS: { label: string; value: ChallengeId; icon: string }[] = [
  { label: 'Screens are taking over', value: 'screens_takeover', icon: '📱' },
  { label: 'Mood changes after phone use', value: 'mood_changes', icon: '😶' },
  { label: 'Gaming concerns', value: 'gaming', icon: '🎮' },
  { label: 'Online safety worries', value: 'online_safety', icon: '🔒' },
  { label: 'Do not know how to start the conversation', value: 'start_conversation', icon: '💬' },
  { label: 'Asking for social media or a smartphone', value: 'asking_for_phone', icon: '📲' },
]

export const FEELING_OPTIONS: { label: string; value: FeelingId; sub: string }[] = [
  { label: 'Anxious and overwhelmed', value: 'anxious', sub: 'This is a lot to manage' },
  { label: 'Unsure where to start', value: 'unsure', sub: 'I want to help but need a direction' },
  { label: 'Worried but ready to act', value: 'ready', sub: 'I just need the right tools' },
]

export interface StarterAnswers {
  ageBand: AgeBand
  challenge: ChallengeId
  feeling: FeelingId
}
