// DiGi's Sparks. DiGi is the golden star; each stage is one of its five points,
// a cute triangle shard with a face and its own name. A child earns one Spark
// per stage on the way to 16, and the five together with DiGi make the whole
// star. These replace the old squad (Oliver, Zara, Sofia); DiGi itself is kept.
//
// Same style throughout, differentiated by an accent colour and by the sparkle
// count, which grows with the level, so the sparkles are themselves the sense
// of progress. Names are short and kind, proposed by Claude and easy for Justin
// to rename here in one place.

export type StageCharacter = {
  stageId: number          // 1 Foundation to 5 Independent
  name: string
  // The star point index (0 top, then clockwise) this Spark is, so the shard
  // and the assembling star agree on which point is whose.
  point: number
  accent: string           // a CSS var, the Spark's own colour cue
  sparkles: number         // grows with the stage
  role: string             // one short line of what they help with
  // The Duolingo style intro line, spoken to the child on first open.
  intro: string
  // Said when the Spark is actually unlocked at the end of a stage.
  unlockLine: string
}

export const STAGE_CHARACTERS: StageCharacter[] = [
  {
    stageId: 1, name: 'Pip', point: 0, accent: 'var(--stage-1-bold)', sparkles: 1,
    role: 'your first safe steps',
    intro: "Hi, I'm Pip! Earn me first and I'll help you take your very first safe steps.",
    unlockLine: "You earned Pip! Your first Spark of DiGi is yours.",
  },
  {
    stageId: 2, name: 'Bo', point: 1, accent: 'var(--stage-2-bold)', sparkles: 2,
    role: 'building good habits',
    intro: "I'm Bo! Pass Stage 2 and I'll help you build brilliant screen habits.",
    unlockLine: "You earned Bo! Two Sparks of DiGi now.",
  },
  {
    stageId: 3, name: 'Kit', point: 2, accent: 'var(--stage-3-bold)', sparkles: 3,
    role: 'spotting what is real',
    intro: "I'm Kit! Reach Stage 3 and I'll help you spot what's real and what's a trick.",
    unlockLine: "You earned Kit! Three Sparks shining.",
  },
  {
    stageId: 4, name: 'Sol', point: 3, accent: 'var(--stage-4-bold)', sparkles: 4,
    role: 'making your own good choices',
    intro: "I'm Sol! Get to Stage 4 and I'll help you make your own smart choices.",
    unlockLine: "You earned Sol! Four Sparks, nearly a whole star.",
  },
  {
    stageId: 5, name: 'Nova', point: 4, accent: 'var(--stage-5-bold)', sparkles: 5,
    role: 'going it alone, brilliantly',
    intro: "I'm Nova, the brightest Spark! Reach Stage 5 and you can do it all on your own.",
    unlockLine: "You earned Nova! DiGi's star is complete. You did it.",
  },
]

export function charactersUpToStage(earnedStages: number): StageCharacter[] {
  return STAGE_CHARACTERS.filter(c => c.stageId <= earnedStages)
}

export function characterForStage(stageId: number): StageCharacter | undefined {
  return STAGE_CHARACTERS.find(c => c.stageId === stageId)
}
