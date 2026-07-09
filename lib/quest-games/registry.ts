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

export type QuestGame = PairsGame | JudgeGame

export const QUEST_GAMES: QuestGame[] = [
  {
    key: 'animal-pairs', mechanic: 'pairs',
    title: 'Animal Match', emoji: '🐾', stage: 'Foundation · 4 to 7', stages: [1, 2], stars: 2,
    pictorial: true,
    blurb: 'Match each animal to its favourite food. All pictures, no reading needed.',
    pairs: [['🐄', '🥛'], ['🐝', '🍯'], ['🐰', '🥕'], ['🐵', '🍌']],
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
