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
  // Optional professional card thumbnail and a New flag, so the kid screen
  // can show a proper picture and badge freshly added games.
  thumb?: string
  isNew?: boolean
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

export type WheelGame = QuestGameMeta & {
  mechanic: 'wheel'
  // A to Z Showdown: DiGi reads a clue, the child taps the option that both
  // fits the clue and starts with the letter. Tiers rise in difficulty; the
  // player samples seven letters from one tier per round.
  rounds: { tier: string; label: string; items: { letter: string; clue: string; options: string[]; answer: number }[] }[]
}

export type FishingGame = QuestGameMeta & {
  mechanic: 'fishing'
  // Word Fishing: a target tricky word is called, the child taps the matching
  // fish among the shoal. Catches is how many targets make a round.
  catches: number
  phases: { id: string; label: string; words: string[] }[]
}

export type CoinsGame = QuestGameMeta & {
  mechanic: 'coins'
  // Pebble's Ice Cream Shop: build the price in coins. Prices are pence
  // integers, pre chosen to be makeable in two to three coins. Serves is how
  // many orders make a round.
  coins: number[]
  orders: { item: string; price: number }[]
  serves: number
}

export type BattleGame = QuestGameMeta & {
  mechanic: 'battle'
  // DiGi Quiz Battle: the child's Planet Friend faces a friendly trouble and
  // every right answer powers the Friend's move. The answer is the attack,
  // the loop Prodigy proved on 100 million children, rebuilt to our rules:
  // no losing, no timer, no randomness. A miss sends the question to the
  // back of the queue, so clearing the set always ends the battle in a win.
  hero: string             // Planet Friend key from stage-characters
  opponent: { name: string; emoji: string; taunt: string; beaten: string }
  moves: string[]          // move names cycled as answers land
  questions: { q: string; options: string[]; answer: number }[]
}

export type TraceGame = QuestGameMeta & {
  mechanic: 'trace'
  // Trace with Pebble: letter formation the way Duolingo ABC proved it, one
  // stroke at a time with a start dot and guide points, rebuilt to our rules:
  // no timer, no failing, generous touch targets. Strokes are point paths in
  // a 100 x 140 box, in the stroke order school teaches. Letters are data,
  // so later sets (more letters, numbers) need no code.
  guide: string            // Planet Friend key who cheers each letter
  items: { glyph: string; sound: string; strokes: [number, number][][] }[]
}

export type QuestGame = PairsGame | JudgeGame | SumsGame | WheelGame | FishingGame | CoinsGame | BattleGame | TraceGame

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
  {
    key: 'how-many-squares', mechanic: 'sums',
    title: 'How Many Squares?', emoji: '🟦', stage: 'Builder · 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'Count every square hiding in the big one. The bigger squares are sneaky.',
    questions: [
      { q: '⬜⬜⬜', options: [2, 3, 4], answer: 3 },
      { q: '⬜⬜\n⬜⬜', options: [4, 5, 6], answer: 5 },
      { q: '⬜⬜⬜\n⬜⬜⬜', options: [6, 8, 9], answer: 8 },
      { q: '⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜', options: [9, 13, 14], answer: 14 },
      { q: '⬜⬜⬜⬜\n⬜⬜⬜⬜\n⬜⬜⬜⬜\n⬜⬜⬜⬜', options: [16, 29, 30], answer: 30 },
    ],
  },
  {
    key: 'doubles-dash', mechanic: 'sums', timed: true,
    title: 'Doubles Dash', emoji: '✌️', stage: 'Foundation · 4 to 7', stages: [1, 2], stars: 2,
    blurb: 'Double the number before the timer runs out. The first step to times tables.',
    questions: [
      { q: 'Double 2', options: [3, 4, 5], answer: 4 },
      { q: 'Double 5', options: [10, 12, 8], answer: 10 },
      { q: 'Double 4', options: [6, 8, 10], answer: 8 },
      { q: 'Double 7', options: [12, 14, 16], answer: 14 },
      { q: 'Double 6', options: [12, 14, 10], answer: 12 },
      { q: 'Double 9', options: [16, 18, 20], answer: 18 },
    ],
  },
  {
    key: 'tables-warm-up', mechanic: 'sums', timed: true,
    title: 'Tables Warm Up', emoji: '🎸', stage: 'Builder · 8 to 10', stages: [2], stars: 3,
    blurb: 'The 2s, 5s and 10s against the clock. Your first tables on stage.',
    questions: [
      { q: '2 × 3', options: [5, 6, 8], answer: 6 },
      { q: '5 × 4', options: [20, 25, 15], answer: 20 },
      { q: '10 × 6', options: [66, 60, 56], answer: 60 },
      { q: '2 × 7', options: [12, 14, 16], answer: 14 },
      { q: '5 × 8', options: [45, 35, 40], answer: 40 },
      { q: '10 × 9', options: [90, 99, 80], answer: 90 },
    ],
  },
  {
    key: 'tables-rock-out', mechanic: 'sums', timed: true,
    title: 'Tables Rock Out', emoji: '🤘', stage: 'Builder · 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'The 3s, 4s and 6s at full speed. One step from the big sprint.',
    questions: [
      { q: '3 × 6', options: [18, 21, 15], answer: 18 },
      { q: '4 × 7', options: [24, 28, 32], answer: 28 },
      { q: '6 × 5', options: [30, 36, 24], answer: 30 },
      { q: '3 × 9', options: [24, 27, 30], answer: 27 },
      { q: '4 × 9', options: [32, 36, 40], answer: 36 },
      { q: '6 × 7', options: [42, 48, 36], answer: 42 },
    ],
  },
  // ── The research batch, 13 July 2026. Grounded in what the market
  // leaders prove works: Duolingo ABC (bite sized phonics, instant
  // celebration), Khan Academy Kids (variety and adaptive spread), Times
  // Tables Rock Stars (timed recall ladders that climb), SplashLearn
  // (untimed number sense before speed). Every game stage gated. ──
  {
    key: 'first-sounds', mechanic: 'judge',
    title: 'First Sounds', emoji: '🔤', stage: 'Foundation · 4 to 7', stages: [1], stars: 2,
    blurb: 'Which sound does it start with? Phonics the way school teaches it, as a game.',
    leftLabel: 'Sss sound', rightLabel: 'Mmm sound', endPraise: 'Your ears are sharp! Sounds are how reading starts.',
    items: [
      { text: '🐍 Snake', correct: 'left', why: 'Snake starts with the sss sound, just like a snake hisses.' },
      { text: '🌙 Moon', correct: 'right', why: 'Moon starts with mmm, lips together like a yummy sound.' },
      { text: '🧦 Sock', correct: 'left', why: 'Sock starts sss. Say it slowly and feel the hiss.' },
      { text: '🐵 Monkey', correct: 'right', why: 'Monkey starts mmm. Try humming it: mmm-onkey.' },
      { text: '☀️ Sun', correct: 'left', why: 'Sun starts with sss, the same hiss as snake and sock.' },
      { text: '🥛 Milk', correct: 'right', why: 'Milk starts mmm, the sound you make when it tastes good.' },
    ],
  },
  {
    key: 'number-bonds-ten', mechanic: 'sums',
    title: 'Make Ten', emoji: '🔟', stage: 'Foundation · 4 to 7', stages: [1, 2], stars: 2,
    blurb: 'Find the missing piece that makes ten. No timer, just thinking.',
    questions: [
      { q: '7 + ? = 10', options: [2, 3, 4], answer: 3 },
      { q: '4 + ? = 10', options: [6, 5, 7], answer: 6 },
      { q: '9 + ? = 10', options: [1, 2, 3], answer: 1 },
      { q: '5 + ? = 10', options: [4, 5, 6], answer: 5 },
      { q: '2 + ? = 10', options: [7, 8, 9], answer: 8 },
      { q: '10 + ? = 10', options: [0, 1, 10], answer: 0 },
    ],
  },
  {
    key: 'what-comes-next', mechanic: 'judge',
    title: 'What Comes Next?', emoji: '🔴', stage: 'Foundation · 4 to 7', stages: [1], stars: 2,
    blurb: 'Spot the pattern and say what comes next. Patterns are how maths begins.',
    leftLabel: '🔴 Red', rightLabel: '🔵 Blue', endPraise: 'Pattern spotted every time! That is real maths thinking.',
    items: [
      { text: '🔴🔵🔴🔵🔴 then?', correct: 'right', why: 'Red blue, red blue, red... so blue comes next.' },
      { text: '🔵🔵🔴🔵🔵 then?', correct: 'left', why: 'Two blues then a red, so after two blues comes red.' },
      { text: '🔴🔴🔵🔴🔴 then?', correct: 'right', why: 'Two reds then a blue. Two reds just happened.' },
      { text: '🔵🔴🔵🔴🔵 then?', correct: 'left', why: 'Blue red, blue red, blue... red keeps the pattern.' },
      { text: '🔴🔵🔵🔴🔵🔵 then?', correct: 'left', why: 'One red then two blues, round and round. Red starts it again.' },
    ],
  },
  {
    key: 'word-detective', mechanic: 'judge',
    title: 'Word Detective', emoji: '🔎', stage: 'Builder · 8 to 10', stages: [2], stars: 3,
    blurb: 'Real word or made up? Sound it out like a detective.',
    leftLabel: 'Real word', rightLabel: 'Made up', endPraise: 'Case closed, detective. Reading is checking, not guessing.',
    items: [
      { text: 'blossom', correct: 'left', why: 'Real: flowers blossom in spring.' },
      { text: 'plimber', correct: 'right', why: 'Made up. It sounds wordish, but check: it means nothing.' },
      { text: 'whisper', correct: 'left', why: 'Real: to speak very softly.' },
      { text: 'trandle', correct: 'right', why: 'Made up. Sounding real is not the same as being real.' },
      { text: 'gleaming', correct: 'left', why: 'Real: shining brightly, like gleaming treasure.' },
      { text: 'smorp', correct: 'right', why: 'Made up. A detective checks before believing.' },
    ],
  },
  {
    key: 'halves-hero', mechanic: 'sums', timed: true,
    title: 'Halves Hero', emoji: '➗', stage: 'Builder · 8 to 10', stages: [2], stars: 3,
    blurb: 'Halve it before the timer runs out. Doubles in reverse.',
    questions: [
      { q: 'Half of 8', options: [3, 4, 5], answer: 4 },
      { q: 'Half of 14', options: [6, 7, 8], answer: 7 },
      { q: 'Half of 20', options: [10, 12, 8], answer: 10 },
      { q: 'Half of 18', options: [8, 9, 11], answer: 9 },
      { q: 'Half of 24', options: [12, 14, 11], answer: 12 },
      { q: 'Half of 30', options: [13, 15, 20], answer: 15 },
    ],
  },
  {
    key: 'division-dash', mechanic: 'sums', timed: true,
    title: 'Division Dash', emoji: '🚀', stage: 'Builder · 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'Tables backwards, against the clock. If you know 6 times 4, you know this.',
    questions: [
      { q: '24 ÷ 6', options: [3, 4, 6], answer: 4 },
      { q: '35 ÷ 5', options: [6, 7, 8], answer: 7 },
      { q: '18 ÷ 2', options: [8, 9, 7], answer: 9 },
      { q: '40 ÷ 10', options: [4, 5, 10], answer: 4 },
      { q: '27 ÷ 3', options: [8, 9, 7], answer: 9 },
      { q: '32 ÷ 4', options: [6, 8, 9], answer: 8 },
    ],
  },
  {
    key: 'tables-final-boss', mechanic: 'sums', timed: true,
    title: 'Tables Final Boss', emoji: '👑', stage: 'Explorer · 11 to 13', stages: [3], stars: 4,
    blurb: 'The 7s, 8s and 12s, the hardest tables there are, at full speed.',
    questions: [
      { q: '7 × 8', options: [54, 56, 63], answer: 56 },
      { q: '12 × 7', options: [84, 96, 72], answer: 84 },
      { q: '8 × 9', options: [64, 72, 81], answer: 72 },
      { q: '12 × 12', options: [124, 144, 132], answer: 144 },
      { q: '7 × 7', options: [47, 49, 56], answer: 49 },
      { q: '8 × 12', options: [88, 96, 108], answer: 96 },
    ],
  },
  {
    key: 'percent-power', mechanic: 'sums',
    title: 'Percent Power', emoji: '💯', stage: 'Explorer · 11 to 13', stages: [3, 4], stars: 4,
    blurb: 'Percentages in your head. The maths that spots a fake discount.',
    questions: [
      { q: '50% of 80', options: [30, 40, 45], answer: 40 },
      { q: '10% of 340', options: [34, 43, 30], answer: 34 },
      { q: '25% of 60', options: [12, 15, 20], answer: 15 },
      { q: '10% of 90', options: [9, 10, 19], answer: 9 },
      { q: '50% of 46', options: [21, 23, 26], answer: 23 },
      { q: '20% of 50', options: [10, 15, 20], answer: 10 },
    ],
  },
  {
    key: 'fact-or-opinion', mechanic: 'judge',
    title: 'Fact or Opinion?', emoji: '⚖️', stage: 'Explorer · 11 to 13', stages: [3, 4], stars: 4,
    blurb: 'The internet mixes them on purpose. Learn to split them in a second.',
    leftLabel: 'Fact', rightLabel: 'Opinion', endPraise: 'That skill beats half the internet. Facts can be checked, opinions can only be argued.',
    items: [
      { text: 'The Amazon is the largest rainforest on Earth', correct: 'left', why: 'Checkable against evidence, so it is a fact.' },
      { text: 'Summer is the best season', correct: 'right', why: 'Best according to whom? No way to check it, so it is an opinion.' },
      { text: 'This game is boring', correct: 'right', why: 'Boring is a feeling about it, not a checkable measurement.' },
      { text: 'An octopus has three hearts', correct: 'left', why: 'Sounds unlikely, but it is checkable and true. Surprising does not mean opinion.' },
      { text: 'Everyone loves this new phone', correct: 'right', why: 'Everyone is the giveaway. Sweeping claims about all people are opinion dressed as fact.' },
      { text: 'Videos with sad music get more shares', correct: 'left', why: 'Measurable with data, so it is a factual claim you could check.' },
    ],
  },
  {
    key: 'clickbait-caller', mechanic: 'judge',
    title: 'Clickbait Caller', emoji: '📰', stage: 'Shaper · 13 to 15', stages: [4, 5], stars: 4,
    blurb: 'Headline or hook? Call out the ones engineered to grab you.',
    leftLabel: 'Reporting', rightLabel: 'Clickbait', endPraise: 'You see the machine now. A headline that sells a feeling is selling you.',
    items: [
      { text: 'Council approves new skate park after two year campaign', correct: 'left', why: 'Says what happened, checkable, no tricks.' },
      { text: 'You will NOT believe what this teacher did next', correct: 'right', why: 'Hides the story to force the click. Real news tells you the story.' },
      { text: 'Doctors HATE this one weird trick', correct: 'right', why: 'Fake conflict plus a secret. The oldest bait pattern on the internet.' },
      { text: 'Storm expected to reach the coast by Friday evening', correct: 'left', why: 'Specific, checkable, tells you the thing up front.' },
      { text: 'This everyday food is slowly destroying your brain', correct: 'right', why: 'Fear plus vagueness. If it were true it would name the food and the evidence.' },
      { text: 'Local team loses final on penalties', correct: 'left', why: 'The whole story in six words. Reporting gives, clickbait withholds.' },
    ],
  },
  // ── The play games from the printables, made playable in the app so a
  // member family gets the interactive twin of the paper product. New
  // mechanics: wheel (A to Z clues), fishing (phonics tricky words) and
  // coins (UK money). 21 July 2026. ──
  {
    key: 'a-to-z-showdown', mechanic: 'wheel', thumb: '/games/a-to-z-showdown.png', isNew: true,
    title: "DiGi's A to Z Showdown", emoji: '🔤', stage: 'Ages 7 to 13', stages: [1, 2, 3], stars: 3,
    blurb: 'Race the alphabet. DiGi reads a clue, you find the answer that starts with the letter.',
    rounds: [
      { tier: 'Starter', label: 'Ages 7 to 9', items: [
        { letter: 'A', clue: 'A squirrel buries this nut, and it can grow into an oak tree', options: ['Apple', 'Conker', 'Acorn'], answer: 2 },
        { letter: 'B', clue: 'The bendy yellow fruit monkeys love to peel', options: ['Broccoli', 'Banana', 'Orange'], answer: 1 },
        { letter: 'C', clue: 'The farm animal that says moo and gives us milk', options: ['Cow', 'Cat', 'Sheep'], answer: 0 },
        { letter: 'D', clue: 'A huge reptile like T rex that lived millions of years ago', options: ['Dolphin', 'Lizard', 'Dinosaur'], answer: 2 },
        { letter: 'E', clue: 'The biggest land animal, with big ears and a trunk', options: ['Eagle', 'Elephant', 'Hippo'], answer: 1 },
        { letter: 'F', clue: 'The orange bushy tailed animal that visits UK gardens at night', options: ['Fox', 'Frog', 'Badger'], answer: 0 },
        { letter: 'G', clue: 'The tallest animal in the world, with a very long neck', options: ['Goat', 'Ostrich', 'Giraffe'], answer: 2 },
        { letter: 'H', clue: 'The prickly British garden animal that rolls into a ball', options: ['Horse', 'Hedgehog', 'Porcupine'], answer: 1 },
        { letter: 'I', clue: 'The frozen treat you lick from a cone on a sunny day', options: ['Ice cream', 'Igloo', 'Lolly'], answer: 0 },
        { letter: 'J', clue: 'The wobbly fruity pudding you find at birthday parties', options: ['Jam', 'Custard', 'Jelly'], answer: 2 },
        { letter: 'K', clue: 'The Australian animal that carries its baby in a pouch', options: ['Kitten', 'Kangaroo', 'Wombat'], answer: 1 },
        { letter: 'L', clue: 'The big cat known as the king of the jungle', options: ['Lion', 'Lamb', 'Cheetah'], answer: 0 },
        { letter: 'M', clue: 'You pour it on your cereal, and it comes from cows', options: ['Mud', 'Juice', 'Milk'], answer: 2 },
        { letter: 'N', clue: 'A bird builds this twiggy home and lays its eggs in it', options: ['Nose', 'Nest', 'Burrow'], answer: 1 },
        { letter: 'O', clue: 'The sea creature with eight arms', options: ['Octopus', 'Owl', 'Squid'], answer: 0 },
        { letter: 'P', clue: 'The black and white bird that slides on ice and cannot fly', options: ['Parrot', 'Seal', 'Penguin'], answer: 2 },
        { letter: 'Q', clue: 'The sound a duck makes', options: ['Queen', 'Quack', 'Moo'], answer: 1 },
        { letter: 'R', clue: 'The little bird with a red breast on Christmas cards', options: ['Robin', 'Rabbit', 'Sparrow'], answer: 0 },
        { letter: 'S', clue: 'The slow garden creature that carries its home on its back', options: ['Spider', 'Tortoise', 'Snail'], answer: 2 },
        { letter: 'T', clue: 'The big cat with orange and black stripes', options: ['Turtle', 'Tiger', 'Leopard'], answer: 1 },
        { letter: 'U', clue: 'You put this up over your head when it rains', options: ['Umbrella', 'Unicorn', 'Raincoat'], answer: 0 },
        { letter: 'V', clue: 'Carrots, peas and broccoli are all this kind of food', options: ['Volcano', 'Fruit', 'Vegetables'], answer: 2 },
        { letter: 'W', clue: 'The biggest animal in the whole ocean, the blue one', options: ['Wasp', 'Whale', 'Shark'], answer: 1 },
        { letter: 'X', clue: 'The instrument with wooden bars that you hit with beaters', options: ['Xylophone', 'X ray', 'Drum'], answer: 0 },
        { letter: 'Y', clue: 'The colour of bananas, custard and the sun', options: ['Yogurt', 'Purple', 'Yellow'], answer: 2 },
        { letter: 'Z', clue: 'The animal like a horse in black and white stripes', options: ['Zoo', 'Zebra', 'Donkey'], answer: 1 },
      ] },
      { tier: 'Challenger', label: 'Ages 9 to 11', items: [
        { letter: 'A', clue: 'The frozen continent at the South Pole', options: ['Arctic', 'Greenland', 'Antarctica'], answer: 2 },
        { letter: 'B', clue: 'The capital city of Germany', options: ['Brussels', 'Berlin', 'Munich'], answer: 1 },
        { letter: 'C', clue: 'The capital city of Wales', options: ['Cardiff', 'Cairo', 'Swansea'], answer: 0 },
        { letter: 'D', clue: 'The famous flightless bird from Mauritius, now extinct', options: ['Dove', 'Emu', 'Dodo'], answer: 2 },
        { letter: 'E', clue: 'The tallest mountain in the world', options: ['Etna', 'Everest', 'Kilimanjaro'], answer: 1 },
        { letter: 'F', clue: 'The country you visit to see the Eiffel Tower', options: ['France', 'Finland', 'Italy'], answer: 0 },
        { letter: 'G', clue: 'The force that pulls everything down towards the ground', options: ['Gas', 'Magnetism', 'Gravity'], answer: 2 },
        { letter: 'H', clue: 'Harry Potter’s snowy owl', options: ['Hagrid', 'Hedwig', 'Errol'], answer: 1 },
        { letter: 'I', clue: 'The boot shaped country famous for pizza and pasta', options: ['Italy', 'India', 'Spain'], answer: 0 },
        { letter: 'J', clue: 'The biggest planet in our solar system', options: ['January', 'Saturn', 'Jupiter'], answer: 2 },
        { letter: 'K', clue: 'The chess piece shaped like a horse', options: ['King', 'Knight', 'Bishop'], answer: 1 },
        { letter: 'L', clue: 'The capital city of England', options: ['London', 'Lisbon', 'Paris'], answer: 0 },
        { letter: 'M', clue: 'The planet known as the red planet', options: ['Mercury', 'Venus', 'Mars'], answer: 2 },
        { letter: 'N', clue: 'Florence, the famous nurse called the lady with the lamp', options: ['Nelson', 'Nightingale', 'Seacole'], answer: 1 },
        { letter: 'O', clue: 'The five ring sporting event held every four years', options: ['Olympics', 'Olympus', 'Wimbledon'], answer: 0 },
        { letter: 'P', clue: 'The largest ocean on Earth', options: ['Pond', 'Atlantic', 'Pacific'], answer: 2 },
        { letter: 'Q', clue: 'The most powerful piece on a chess board', options: ['Quill', 'Queen', 'Rook'], answer: 1 },
        { letter: 'R', clue: 'The capital city of Italy', options: ['Rome', 'Riga', 'Venice'], answer: 0 },
        { letter: 'S', clue: 'The planet famous for its beautiful rings', options: ['Sun', 'Neptune', 'Saturn'], answer: 2 },
        { letter: 'T', clue: 'The famous ship that sank on its first voyage in 1912', options: ['Tugboat', 'Titanic', 'Mayflower'], answer: 1 },
        { letter: 'U', clue: 'The name of the United Kingdom’s flag', options: ['Union Jack', 'Umbrella', 'Tricolour'], answer: 0 },
        { letter: 'V', clue: 'A mountain that can erupt with hot lava', options: ['Valley', 'Geyser', 'Volcano'], answer: 2 },
        { letter: 'W', clue: 'The London home of the famous tennis championships', options: ['Westminster', 'Wimbledon', 'Ascot'], answer: 1 },
        { letter: 'X', clue: 'Contains an X: the photo a doctor takes to see your bones', options: ['X ray', 'Xylophone', 'Scan'], answer: 0 },
        { letter: 'Y', clue: 'The northern English city famous for Vikings and its Minster', options: ['Yeovil', 'Durham', 'York'], answer: 2 },
        { letter: 'Z', clue: 'The number that means nothing at all', options: ['Zone', 'Zero', 'One'], answer: 1 },
      ] },
      { tier: 'Family', label: 'Everyone plays', items: [
        { letter: 'A', clue: 'Neil, the first person to walk on the Moon', options: ['Aldrin', 'Gagarin', 'Armstrong'], answer: 2 },
        { letter: 'B', clue: 'The composer who kept writing symphonies after going deaf', options: ['Bach', 'Beethoven', 'Mozart'], answer: 1 },
        { letter: 'C', clue: 'The capital city of Denmark', options: ['Copenhagen', 'Cardiff', 'Stockholm'], answer: 0 },
        { letter: 'D', clue: 'The scientist who wrote On the Origin of Species', options: ['Dawkins', 'Newton', 'Darwin'], answer: 2 },
        { letter: 'E', clue: 'The scientist behind E equals mc squared', options: ['Edison', 'Einstein', 'Curie'], answer: 1 },
        { letter: 'F', clue: 'Alexander, the Scottish scientist who discovered penicillin', options: ['Fleming', 'Faraday', 'Jenner'], answer: 0 },
        { letter: 'G', clue: 'The vast Arizona canyon carved by the Colorado River', options: ['Great Barrier Reef', 'Niagara Falls', 'Grand Canyon'], answer: 2 },
        { letter: 'H', clue: 'The Tudor king who had six wives', options: ['Harold', 'Henry the Eighth', 'Edward'], answer: 1 },
        { letter: 'I', clue: 'The land of ice and fire, capital Reykjavik', options: ['Iceland', 'Ireland', 'Norway'], answer: 0 },
        { letter: 'J', clue: 'The month named after a Roman god with two faces', options: ['July', 'March', 'January'], answer: 2 },
        { letter: 'K', clue: 'The tallest mountain in Africa', options: ['Kenya', 'Kilimanjaro', 'Everest'], answer: 1 },
        { letter: 'L', clue: 'The Italian genius who painted the Mona Lisa', options: ['Leonardo da Vinci', 'Lippi', 'Michelangelo'], answer: 0 },
        { letter: 'M', clue: 'The sea between Europe and Africa', options: ['Mersey', 'Baltic', 'Mediterranean'], answer: 2 },
        { letter: 'N', clue: 'The admiral on the column in Trafalgar Square', options: ['Napoleon', 'Nelson', 'Drake'], answer: 1 },
        { letter: 'O', clue: 'The capital city of Norway', options: ['Oslo', 'Ottawa', 'Helsinki'], answer: 0 },
        { letter: 'P', clue: 'Pablo, the Spanish artist who painted Guernica', options: ['Pissarro', 'Dali', 'Picasso'], answer: 2 },
        { letter: 'Q', clue: 'The feather pen people wrote with before fountain pens', options: ['Quiver', 'Quill', 'Inkwell'], answer: 1 },
        { letter: 'R', clue: 'The sea between Egypt and Saudi Arabia, named after a colour', options: ['Red Sea', 'River Nile', 'Dead Sea'], answer: 0 },
        { letter: 'S', clue: 'The playwright who wrote Romeo and Juliet', options: ['Shelley', 'Dickens', 'Shakespeare'], answer: 2 },
        { letter: 'T', clue: 'The river that flows through London', options: ['Trent', 'Thames', 'Severn'], answer: 1 },
        { letter: 'U', clue: 'The planet that spins on its side', options: ['Uranus', 'Ursa Major', 'Neptune'], answer: 0 },
        { letter: 'V', clue: 'The Italian city built on canals', options: ['Verona', 'Amsterdam', 'Venice'], answer: 2 },
        { letter: 'W', clue: 'The 1815 battle where Napoleon was finally defeated', options: ['Wellington', 'Waterloo', 'Trafalgar'], answer: 1 },
        { letter: 'X', clue: 'Contains an X: the country just south of the United States', options: ['Mexico', 'Texas', 'Canada'], answer: 0 },
        { letter: 'Y', clue: 'The longest river in Asia', options: ['Yukon', 'Ganges', 'Yangtze'], answer: 2 },
        { letter: 'Z', clue: 'The giant German airship named after a count', options: ['Zephyr', 'Zeppelin', 'Blimp'], answer: 1 },
      ] },
    ],
  },
  {
    key: 'word-fishing', mechanic: 'fishing', thumb: '/games/word-fishing.png', isNew: true,
    title: 'Word Fishing', emoji: '🐟', stage: 'Ages 4 to 7', stages: [1, 2], stars: 2,
    blurb: 'DiGi calls a tricky word and you catch the fish that carries it.',
    catches: 5,
    phases: [
      { id: 'phase-2', label: 'Phase 2 tricky words', words: ['the', 'to', 'I', 'no', 'go', 'into'] },
      { id: 'phase-3', label: 'Phase 3 tricky words', words: ['he', 'she', 'we', 'me', 'be', 'was', 'you', 'they', 'all', 'are', 'my', 'her'] },
      { id: 'letters', label: 'First letter sounds', words: ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd'] },
    ],
  },
  {
    key: 'ice-cream-shop', mechanic: 'coins', thumb: '/games/ice-cream-shop.png', isNew: true,
    title: "Pebble's Ice Cream Shop", emoji: '🍦', stage: 'Ages 5 to 7', stages: [1, 2], stars: 2,
    blurb: 'Run the ice cream shop and count out the coins to pay for every treat.',
    coins: [1, 2, 5, 10, 20, 50, 100, 200],
    serves: 5,
    orders: [
      { item: 'chocolate flake', price: 15 },
      { item: 'scoop with sprinkles', price: 25 },
      { item: 'scoop with strawberry sauce', price: 30 },
      { item: 'double scoop', price: 45 },
      { item: 'ice lolly', price: 55 },
      { item: 'triple scoop', price: 70 },
      { item: 'super sundae', price: 120 },
      { item: 'family tub', price: 250 },
    ],
  },
  // ── The educational games research batch, 9 August 2026. The quiz battle
  // is the loop the market leaders prove works best (Prodigy: the answer IS
  // the attack), rebuilt to our rules in plans/quest-games-plan.md section 8.
  // One battle per band, each fronted by that band's Planet Friend. ──
  {
    key: 'battle-number-muddle', mechanic: 'battle', isNew: true,
    title: 'Pebble and the Number Muddle', emoji: '🌀', stage: 'Ages 4 to 7', stages: [1, 2], stars: 2,
    blurb: 'The Muddle has mixed up all the numbers. Every right answer powers one of Pebble’s moves.',
    hero: 'pebble',
    opponent: {
      name: 'The Muddle', emoji: '🌀',
      taunt: 'I have muddled every number on the planet! You will never sort them out!',
      beaten: 'The Muddle spins away, all sorted out. The numbers are safe again.',
    },
    moves: ['Pebble Bounce', 'Star Splash', 'Sunny Spin'],
    questions: [
      { q: '2 + 2', options: ['3', '4', '5'], answer: 1 },
      { q: '5 + ? = 10', options: ['5', '4', '6'], answer: 0 },
      { q: 'One more than 6', options: ['5', '7', '8'], answer: 1 },
      { q: '10 take away 3', options: ['7', '6', '8'], answer: 0 },
      { q: 'Double 3', options: ['5', '6', '9'], answer: 1 },
      { q: 'How many sides has a triangle?', options: ['3', '4', '5'], answer: 0 },
    ],
  },
  {
    key: 'battle-times-tangle', mechanic: 'battle', isNew: true,
    title: 'Bloop and the Times Tangle', emoji: '🪢', stage: 'Ages 8 to 10', stages: [2, 3], stars: 3,
    blurb: 'The Tangle has knotted the times tables. Untangle them one answer at a time.',
    hero: 'bloop',
    opponent: {
      name: 'The Tangle', emoji: '🪢',
      taunt: 'I have tied every times table into knots! Good luck untangling these!',
      beaten: 'The last knot falls open. The Tangle gives a little bow and unravels.',
    },
    moves: ['Bubble Pop', 'Builder Bash', 'Green Groove'],
    questions: [
      { q: '4 × 6', options: ['24', '28', '20'], answer: 0 },
      { q: '7 × 3', options: ['24', '21', '27'], answer: 1 },
      { q: '9 × 4', options: ['32', '40', '36'], answer: 2 },
      { q: '8 × 6', options: ['48', '54', '42'], answer: 0 },
      { q: '36 ÷ 6', options: ['5', '6', '7'], answer: 1 },
      { q: '12 × 3', options: ['36', '33', '39'], answer: 0 },
    ],
  },
  {
    key: 'battle-trick-cloud', mechanic: 'battle', isNew: true,
    title: 'Orbit and the Trick Cloud', emoji: '🌫️', stage: 'Ages 11 and up', stages: [3, 4, 5], stars: 4,
    blurb: 'The Trick Cloud fills feeds with fakes and hooks. See through every one to clear the sky.',
    hero: 'orbit',
    opponent: {
      name: 'The Trick Cloud', emoji: '🌫️',
      taunt: 'My tricks catch grown adults every single day. You will fall for them too!',
      beaten: 'The cloud thins to nothing. Tricks only work on people who cannot see them, and now you can.',
    },
    moves: ['Orbit Loop', 'Comet Swoosh', 'Truth Beam'],
    questions: [
      { q: 'Hurry, only 3 left, sale ends in 10 minutes! What is the trick?', options: ['A kind warning', 'Urgency to rush you', 'A maths puzzle'], answer: 1 },
      { q: 'A celebrity video where the mouth looks blurry and the blinks are odd. Most likely?', options: ['A deepfake', 'A live news clip', 'Just bad wifi'], answer: 0 },
      { q: 'Win a free phone, just enter your home address! What should you do?', options: ['Enter quickly', 'Ask a friend to enter', 'Close it and tell a grown up'], answer: 2 },
      { q: 'A headline says: you will NOT believe what happened next. Why is it written like that?', options: ['To force the click', 'To save space', 'To be polite'], answer: 0 },
      { q: 'One tiny account says a famous person died. No news site has it. Believe it?', options: ['Yes, share it fast', 'No, wait for a real source', 'Only if it gets likes'], answer: 1 },
      { q: 'An influencer says a drink changed their life, with #ad at the end. What is the post?', options: ['A science report', 'A diary entry', 'A paid advert'], answer: 2 },
    ],
  },
  // ── Trace with Pebble, 10 August 2026. The first six phonics letters in
  // the order school teaches them (s a t p i n), traced stroke by stroke. ──
  {
    key: 'trace-first-letters', mechanic: 'trace', isNew: true,
    title: 'Trace with Pebble', emoji: '✏️', stage: 'Ages 4 to 7', stages: [1], stars: 2,
    blurb: 'Learn to write your first six letters with your finger, the same order school teaches them.',
    guide: 'pebble',
    items: [
      { glyph: 's', sound: 'sss, the snake sound', strokes: [
        [[64, 60], [52, 52], [38, 54], [31, 64], [36, 74], [50, 80], [61, 87], [64, 98], [55, 107], [40, 108], [30, 100]],
      ] },
      { glyph: 'a', sound: 'a, as in apple', strokes: [
        [[64, 64], [54, 53], [40, 54], [31, 65], [29, 80], [33, 95], [45, 104], [58, 102], [64, 93]],
        [[64, 55], [64, 110]],
      ] },
      { glyph: 't', sound: 't, as in tap', strokes: [
        [[48, 32], [48, 95], [52, 105], [60, 107]],
        [[32, 62], [66, 62]],
      ] },
      { glyph: 'p', sound: 'p, as in pig', strokes: [
        [[34, 58], [34, 132]],
        [[34, 66], [46, 55], [60, 58], [67, 70], [66, 84], [57, 96], [44, 99], [34, 92]],
      ] },
      { glyph: 'i', sound: 'i, as in ink', strokes: [
        [[50, 58], [50, 106]],
        [[50, 40]],
      ] },
      { glyph: 'n', sound: 'n, as in net', strokes: [
        [[36, 55], [36, 106]],
        [[36, 78], [40, 62], [50, 55], [60, 58], [65, 70], [65, 106]],
      ] },
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
