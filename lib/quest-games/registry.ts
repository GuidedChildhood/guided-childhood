// The quest games: age matched games a child completes to earn stars, built
// into the app (not the curated external picks). This is the first slice,
// the matching game and the two digital judgement games that are the whole
// differentiator. Content lives here as data, the renderers live in the app,
// same rule as scripts and lessons. More mechanics (timed tables, chess,
// memory) follow. See plans/quest-games-plan.md.

export type QuestGameMeta = {
  key: string
  title: string
  emoji: string
  stage: string
  // Which stages this game suits (1 Foundation 4 to 7, 2 Builder 8 to 10,
  // 3 Explorer 11 to 13, 4 Shaper 13 to 15, 5 Independent 16 plus). The kid
  // screen only ever shows a child the games tagged for their stage, so a
  // four year old never meets an eleven year old's game.
  stages: number[]
  stars: number
  blurb: string
}

export type PairsGame = QuestGameMeta & {
  mechanic: 'pairs'
  // Two things the child matches. When pictorial, both sides are pictures
  // (emoji) so a pre reader can play with no words at all. Otherwise the
  // second side is a name to read.
  pairs: [string, string][]
  pictorial?: boolean
}

export type JudgeGame = QuestGameMeta & {
  mechanic: 'judge'
  leftLabel: string
  rightLabel: string
  endPraise: string
  // correct is which side the card belongs to; why teaches the clue
  items: { text: string; correct: 'left' | 'right'; why: string }[]
}

export type SumsGame = QuestGameMeta & {
  mechanic: 'sums'
  // A soft per question countdown, the quick fire times tables feel. When
  // the timer runs out the question is marked missed and moves on.
  timed?: boolean
  questions: { q: string; options: number[]; answer: number }[]
}

export type QuestGame = PairsGame | JudgeGame | SumsGame

export const QUEST_GAMES: QuestGame[] = [
  {
    key: 'animal-pairs', mechanic: 'pairs',
    title: 'Animal Match', emoji: '🐾', stage: 'Foundation · 4 to 7', stages: [1, 2], stars: 2,
    pictorial: true,
    blurb: 'Match each animal to its favourite food. All pictures, no reading needed.',
    pairs: [['🐄', '🥛'], ['🐝', '🍯'], ['🐰', '🥕'], ['🐵', '🍌']],
  },
  {
    key: 'count-dots', mechanic: 'pairs',
    title: 'Count the Dots', emoji: '🔢', stage: 'Foundation · 4 to 7', stages: [1, 2], stars: 2,
    pictorial: true,
    blurb: 'Match each number to the dice that shows it. First counting, no reading.',
    pairs: [['1', '⚀'], ['2', '⚁'], ['3', '⚂'], ['4', '⚃']],
  },
  {
    key: 'quick-maths', mechanic: 'sums',
    title: 'Quick Maths', emoji: '➕', stage: 'Builder · 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'Fast adding and taking away. Warm up those number skills.',
    questions: [
      { q: '3 + 4', options: [6, 7, 8], answer: 7 },
      { q: '9 − 5', options: [3, 4, 5], answer: 4 },
      { q: '6 + 7', options: [12, 13, 14], answer: 13 },
      { q: '15 − 8', options: [6, 7, 8], answer: 7 },
      { q: '8 + 8', options: [15, 16, 17], answer: 16 },
      { q: '20 − 6', options: [13, 14, 15], answer: 14 },
    ],
  },
  {
    key: 'times-sprint', mechanic: 'sums', timed: true,
    title: 'Times Table Sprint', emoji: '⚡', stage: 'Explorer · 11 to 13', stages: [3, 4, 5], stars: 4,
    blurb: 'Quick fire times tables against the clock. Beat the timer on each one.',
    questions: [
      { q: '6 × 7', options: [42, 48, 36], answer: 42 },
      { q: '8 × 9', options: [72, 64, 81], answer: 72 },
      { q: '7 × 7', options: [42, 49, 56], answer: 49 },
      { q: '9 × 6', options: [54, 45, 63], answer: 54 },
      { q: '12 × 8', options: [96, 88, 108], answer: 96 },
      { q: '11 × 7', options: [77, 84, 70], answer: 77 },
    ],
  },
  {
    key: 'what-is-an-advert', mechanic: 'judge',
    title: 'What Is an Advert?', emoji: '🔍', stage: 'Explorer · 11 to 13', stages: [3, 4, 5], stars: 4,
    blurb: 'Sort real posts from paid adverts. Spot when someone is selling to you.',
    leftLabel: 'Just a post', rightLabel: 'Advert',
    endPraise: 'You spotted every advert. That is the skill that keeps you in charge of your feed.',
    items: [
      { text: 'Loving this weather! Beach day with the family ☀️', correct: 'left', why: 'Just a person sharing their day. Nothing is being sold.' },
      { text: 'USE CODE ZAK20 for 20% off my gym plan. Link in bio!!', correct: 'right', why: 'A discount code and a link in bio are there to sell you something.' },
      { text: 'Gutted we lost the match today. Next week we go again.', correct: 'left', why: 'A real feeling, no product, no link.' },
      { text: 'I only drink SparkleFizz now, honestly changed my life. #ad', correct: 'right', why: 'The hashtag ad is the giveaway. They were paid to say this.' },
      { text: 'Homework done, finally free 😅', correct: 'left', why: 'Everyday life, nothing for sale.' },
    ],
  },
  {
    key: 'real-or-fake', mechanic: 'judge',
    title: 'Real or Fake?', emoji: '🕵️', stage: 'Explorer · 11 to 13', stages: [3, 4, 5], stars: 4,
    blurb: 'Decide what to believe. Build the habit of pausing before you trust a post.',
    leftLabel: 'Real', rightLabel: 'Fake',
    endPraise: 'You paused before believing every time. That pause is everything.',
    items: [
      { text: 'A photo of a shark swimming down a flooded motorway during a storm.', correct: 'right', why: 'This photo appears after every flood and has been debunked for years. Always the same picture.' },
      { text: 'Your school posts on its official page that Friday is an inset day.', correct: 'left', why: 'A known official account you can check. A good source.' },
      { text: 'A video of a famous footballer quitting to become a chef. His mouth looks blurry.', correct: 'right', why: 'A blurry mouth is a classic sign of a made up video, and no news site is saying it.' },
      { text: 'The weather app on your phone says it will rain tomorrow.', correct: 'left', why: 'A trusted tool, not a random post.' },
      { text: 'One account with 47 followers says a celebrity died. Nobody else has it.', correct: 'right', why: 'If it were real, every news site would carry it. One tiny account is a big warning.' },
    ],
  },
  {
    key: 'opposites-match', mechanic: 'pairs',
    title: 'Opposites Match', emoji: '🔄', stage: 'Foundation · 4 to 7', stages: [1], stars: 2,
    pictorial: true,
    blurb: 'Match each picture to its opposite. All pictures, no reading needed.',
    pairs: [['☀️', '🌙'], ['🔥', '❄️'], ['😊', '😢'], ['🐘', '🐭']],
  },
  {
    key: 'kind-or-not', mechanic: 'judge',
    title: 'Kind or Not Kind?', emoji: '💛', stage: 'Foundation · 4 to 7', stages: [1, 2], stars: 2,
    blurb: 'Sort the kind messages from the unkind ones. The first step of being good online.',
    leftLabel: 'Kind', rightLabel: 'Not kind',
    endPraise: 'You know kind when you see it. Being kind on a screen counts just as much as in real life.',
    items: [
      { text: 'Great goal today! You played brilliantly.', correct: 'left', why: 'Cheering someone on makes them feel great. That is kindness.' },
      { text: 'Nobody wants you in this game. Go away.', correct: 'right', why: 'Leaving someone out on purpose hurts, on a screen or off it.' },
      { text: 'Your drawing is amazing, can you teach me?', correct: 'left', why: 'Asking someone to share what they are good at is a lovely thing to do.' },
      { text: 'Everyone look at this photo of Sam, so embarrassing 😂', correct: 'right', why: 'Sharing a photo to laugh at someone is unkind, even with a smiley face on it.' },
      { text: 'Are you ok? You seemed sad at school today.', correct: 'left', why: 'Checking on a friend is one of the kindest messages there is.' },
      { text: 'You are so bad at this game, uninstall it.', correct: 'right', why: 'Telling someone they are bad at something just makes them feel small.' },
    ],
  },
  {
    key: 'share-or-private', mechanic: 'judge',
    title: 'Share or Keep Private?', emoji: '🔐', stage: 'Builder · 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'Sort what is fine to share online from what stays private. The rule that keeps you safe.',
    leftLabel: 'Fine to share', rightLabel: 'Keep private',
    endPraise: 'You know exactly what stays private. That one skill protects you everywhere online.',
    items: [
      { text: 'Your favourite film and why you love it.', correct: 'left', why: 'Opinions about films, games and music are safe to share. Nobody can find you with them.' },
      { text: 'Your home address.', correct: 'right', why: 'Where you live is the biggest one to keep private. Nobody online ever needs it.' },
      { text: 'A drawing you made of a dragon.', correct: 'left', why: 'Things you create are great to share, as long as they show nothing personal in the background.' },
      { text: 'The name of your school.', correct: 'right', why: 'Your school tells a stranger where to find you five days a week. Keep it private.' },
      { text: 'Your password, but only with your best friend.', correct: 'right', why: 'Passwords are private from everyone except your grown up. Friendships change, passwords should not need to.' },
      { text: 'That your favourite animal is an octopus.', correct: 'left', why: 'Favourites are safe and fun to share. They give nothing away.' },
      { text: 'A photo of you in your school uniform.', correct: 'right', why: 'The badge on a uniform quietly tells strangers your school. Change first, then take the photo.' },
    ],
  },
  {
    key: 'password-power', mechanic: 'judge',
    title: 'Password Power', emoji: '🛡️', stage: 'Builder · 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'Spot the strong passwords from the weak ones. Your password is the key to everything.',
    leftLabel: 'Strong', rightLabel: 'Weak',
    endPraise: 'You can spot a strong password every time. Three random words beats clever tricks.',
    items: [
      { text: 'password123', correct: 'right', why: 'The most guessed password in the world. A computer cracks it instantly.' },
      { text: 'CactusRocketMarmalade9', correct: 'left', why: 'Three random words and a number. Long, strange and almost impossible to guess.' },
      { text: 'Your pet name and your birth year.', correct: 'right', why: 'Anyone who follows you online can learn your pet and your birthday. Guessable is weak.' },
      { text: 'qwerty', correct: 'right', why: 'The top row of the keyboard fools nobody. Crackers try it first.' },
      { text: 'PurpleToastVolcano44', correct: 'left', why: 'Random words that mean nothing together make the strongest keys.' },
      { text: 'The same password you use everywhere.', correct: 'right', why: 'One leak and every account falls. Different doors need different keys.' },
    ],
  },
  {
    key: 'scam-or-safe', mechanic: 'judge',
    title: 'Scam or Safe?', emoji: '🎣', stage: 'Shaper · 13 to 15', stages: [4, 5], stars: 4,
    blurb: 'Spot the scam messages before they hook you. These catch adults every single day.',
    leftLabel: 'Safe', rightLabel: 'Scam',
    endPraise: 'You spotted every hook. Urgency, weird links and password asks, you know all three tells now.',
    items: [
      { text: 'Congratulations! You won an iPhone 16. Claim in the next 10 minutes or lose it.', correct: 'right', why: 'A prize you never entered plus a countdown is the oldest hook there is. Urgency is the tell.' },
      { text: 'Your school emails the term dates from its usual address, no links to click.', correct: 'left', why: 'A known sender, expected content, nothing asking you to act fast. That is what safe looks like.' },
      { text: 'Delivery held. Pay a £1.49 customs fee at royal-mail-parcels.info to release it.', correct: 'right', why: 'Real couriers do not text random payment links. The odd web address is the giveaway.' },
      { text: 'Your best mate suddenly messages: vote for my cousin here, and the link looks strange.', correct: 'right', why: 'Accounts get hacked. An out of character message with a link means check with them in person first.' },
      { text: 'The code you just requested to log in arrives by text, and you type it into the app yourself.', correct: 'left', why: 'A code you asked for, used by you, is safe. The scam version is anyone ASKING you to read it out.' },
      { text: 'Netflix says your account will be deleted today unless you confirm your card details now.', correct: 'right', why: 'Real companies never delete same day and never ask for card details by message. Fear plus a deadline equals scam.' },
    ],
  },
]

export function getQuestGame(key: string): QuestGame | null {
  return QUEST_GAMES.find(g => g.key === key) ?? null
}

// Only the games that suit a child at this stage. A null or unknown stage
// falls back to the middle stage so nothing shows wildly off for that child.
export function gamesForStage(stageId: number | null | undefined): QuestGame[] {
  const stage = stageId && stageId >= 1 && stageId <= 5 ? stageId : 2
  return QUEST_GAMES.filter(g => g.stages.includes(stage))
}
