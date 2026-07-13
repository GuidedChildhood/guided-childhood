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
