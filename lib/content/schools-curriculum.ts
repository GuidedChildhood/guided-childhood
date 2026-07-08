// The 21 module curriculum manifest: the shop window data for the
// curriculum map (/educator/curriculum). Source of truth for the module
// list is plans/schools-lesson-build-spec.md section 5; this mirrors it
// for display. Playable lesson CONTENT stays in the database
// (school_lessons rows). A module here with a matching school_lessons row
// is live; without one it shows as in production.
//
// Character casting follows spec section 9.4 and digi-squad/README.md.
// Emoji emblems are stand ins until the Higgsfield character stills land
// (blocked on credits); the colour is the character's canonical accent.

export type KeyStage = 'EYFS' | 'KS1' | 'KS2' | 'KS3' | 'KS4' | 'KS5'

export type CharacterKey = 'sofia' | 'zara' | 'oliver' | 'digi' | 'vix' | 'brock'

export const CHARACTERS: Record<CharacterKey, {
  name: string
  emblem: string
  accent: string // border, ring, chips
  soft: string   // card header band
  ink: string    // text on the soft band
}> = {
  sofia: { name: 'Sofia', emblem: '🛡️', accent: '#2E7D5A', soft: '#DDEDE4', ink: '#1F5940' },
  zara: { name: 'Zara', emblem: '🔎', accent: '#E3B53A', soft: '#FBEEC9', ink: '#7A5A0E' },
  oliver: { name: 'Oliver', emblem: '⏳', accent: '#D4600A', soft: '#F7DFC9', ink: '#8F3F04' },
  digi: { name: 'DiGi', emblem: '⭐', accent: '#F2C94C', soft: '#FDF4D9', ink: '#7A5A0E' },
  vix: { name: 'Vix', emblem: '🦊', accent: '#B4530A', soft: '#F3DCC9', ink: '#7C3806' },
  brock: { name: 'Brock', emblem: '🦡', accent: '#5C6B73', soft: '#E4EAED', ink: '#3B4A52' },
}

// The named topics of the DfE RSHE statutory guidance published 15 July
// 2025, compulsory 1 September 2026. The mapping matrix (/educator/hub)
// renders module coverage against these. Keys are stable ids, labels are
// the display wording.
export const RSHE_2025_TOPICS = [
  { key: 'online_safety', label: 'Online safety and harms' },
  { key: 'respectful_relationships', label: 'Respectful relationships, online and offline' },
  { key: 'mental_wellbeing', label: 'Mental wellbeing' },
  { key: 'pornography', label: 'Harms of pornography' },
  { key: 'misogyny_incel', label: 'Misogynistic online cultures and incel groups' },
  { key: 'deepfakes_ai', label: 'Deepfakes and AI generated content' },
  { key: 'gambling', label: 'Online gambling and gambling style mechanics' },
  { key: 'illegal_online', label: 'Illegal online behaviours' },
  { key: 'consent_images', label: 'Consent and image sharing' },
  { key: 'scams_financial', label: 'Online financial harms and scams' },
] as const

export type Rshe2025Key = typeof RSHE_2025_TOPICS[number]['key']

export type CurriculumModule = {
  n: number
  moduleId: string
  title: string
  keyStage: KeyStage
  yearBand: string
  outcome: string
  blurb: string
  character: CharacterKey
  castLine: string // how the cast reads on the card
  dsl?: boolean
  crown?: boolean
  // Which RSHE 2025 named topics this module teaches. Honest tags only:
  // a module is tagged when it substantively teaches the topic, not when
  // it brushes past it. Foundations at primary count where the guidance
  // recommends age appropriate seeding.
  rshe?: Rshe2025Key[]
}

export const KEY_STAGE_META: Record<KeyStage, { label: string; years: string; strapline: string }> = {
  EYFS: { label: 'EYFS', years: 'Reception', strapline: 'Screens with a grown up, and the first seed of real versus made.' },
  KS1: { label: 'KS1', years: 'Years 1 and 2', strapline: 'Kind screens, calm bodies, and spotting when a picture might not be real.' },
  KS2: { label: 'KS2', years: 'Years 3 to 6', strapline: 'Routines, games, algorithms and the first habits of a careful mind.' },
  KS3: { label: 'KS3', years: 'Years 7 to 9', strapline: 'The detective years: feeds, fakes, scams and honest self checks.' },
  KS4: { label: 'KS4', years: 'Years 10 and 11', strapline: 'The serious cases: persuasion, consent, the law, and readiness at 16.' },
  KS5: { label: 'KS5', years: 'Years 12 and 13', strapline: 'AI mastery, data rights and the working life ahead.' },
}

export const CURRICULUM: CurriculumModule[] = [
  {
    n: 1, moduleId: 'eyfs-01-screens-kindness', keyStage: 'EYFS', yearBand: 'Reception',
    title: 'Screens and kindness, real and not real',
    outcome: 'I can ask a grown up if something on a screen is real.',
    blurb: 'Co viewing, gentle routines, and the very first seed of AI literacy.',
    character: 'sofia', castLine: 'Sofia with DiGi Junior',
    rshe: ['online_safety', 'mental_wellbeing'],
  },
  {
    n: 2, moduleId: 'ks1-02-kind-screens-calm-bodies', keyStage: 'KS1', yearBand: 'Years 1 to 2',
    title: 'Kind screens, calm bodies',
    outcome: 'I can name how I feel after screen time and tell a grown up.',
    blurb: 'How screens make my body and mood feel, being kind, and who to tell.',
    character: 'sofia', castLine: 'Sofia',
    rshe: ['online_safety', 'mental_wellbeing', 'respectful_relationships'],
  },
  {
    n: 3, moduleId: 'ks1-03-real-pretend-computer', keyStage: 'KS1', yearBand: 'Years 1 to 2',
    title: 'Real, pretend, or made by a computer',
    outcome: 'I can spot that a picture might not be real.',
    blurb: 'Photos and videos can be changed or made up, and AI can make pictures.',
    character: 'zara', castLine: 'Zara with DiGi Junior',
    rshe: ['online_safety', 'deepfakes_ai'],
  },
  {
    n: 4, moduleId: 'ks2-04-screen-routines', keyStage: 'KS2', yearBand: 'Years 3 to 6',
    title: 'Screen routines that work',
    outcome: 'One routine the child sets tonight.',
    blurb: 'After school, bedtime, mealtimes and homework, without the daily fight.',
    character: 'oliver', castLine: 'Oliver',
    rshe: ['mental_wellbeing', 'online_safety'],
  },
  {
    n: 5, moduleId: 'ks2-05-gaming-time-spend', keyStage: 'KS2', yearBand: 'Years 3 to 6',
    title: 'Gaming: time, intensity and spend',
    outcome: 'I can spot when a game is trying to get me to spend.',
    blurb: 'Loot boxes, in game spend, and the free that costs.',
    character: 'oliver', castLine: 'Oliver',
    rshe: ['gambling', 'scams_financial', 'online_safety'],
  },
  {
    n: 6, moduleId: 'ks2-06-how-algorithms-work', keyStage: 'KS2', yearBand: 'Years 3 to 6',
    title: 'How algorithms work',
    outcome: 'I can explain why my feed keeps me watching.',
    blurb: 'Why the feed shows what it shows, with a paper algorithm and Scratch.',
    character: 'digi', castLine: 'DiGi',
    rshe: ['online_safety', 'mental_wellbeing'],
  },
  {
    n: 7, moduleId: 'ks2-07-privacy-reputation', keyStage: 'KS2', yearBand: 'Years 3 to 6',
    title: 'Privacy and digital reputation',
    outcome: 'I can decide what not to share.',
    blurb: 'What is private, what lasts, and your digital footprint.',
    character: 'sofia', castLine: 'Sofia',
    rshe: ['online_safety'],
  },
  {
    n: 8, moduleId: 'ks2-08-kind-safe-online', keyStage: 'KS2', yearBand: 'Years 3 to 6',
    title: 'Being kind and safe with others online',
    outcome: 'I know three things to do if someone is unkind online.',
    blurb: 'Group chats, fallout, and never being a bystander to online bullying.',
    character: 'sofia', castLine: 'Sofia with Zara',
    rshe: ['respectful_relationships', 'online_safety', 'mental_wellbeing'],
  },
  {
    n: 9, moduleId: 'ks2-09-copyright-ownership', keyStage: 'KS2', yearBand: 'Years 3 to 6',
    title: 'My work and other people’s work',
    outcome: 'I can credit work that is not mine.',
    blurb: 'Owning what you make, using what others made, and where AI content comes from.',
    character: 'zara', castLine: 'Zara',
    rshe: ['online_safety', 'deepfakes_ai'],
  },
  {
    n: 10, moduleId: 'ks3-10-mood-and-screens', keyStage: 'KS3', yearBand: 'Years 7 to 9',
    title: 'Mood and screens',
    outcome: 'One honest self check the pupil runs for a week.',
    blurb: 'The honest, mixed evidence on screens and mood, and agency over habits.',
    character: 'brock', castLine: 'Brock with DiGi',
    rshe: ['mental_wellbeing', 'online_safety'],
  },
  {
    n: 11, moduleId: 'ks3-11-social-workarounds', keyStage: 'KS3', yearBand: 'Years 7 to 9',
    title: 'Social media, group chats and the workarounds',
    outcome: 'I can explain the risk behind a workaround I might be tempted by.',
    blurb: 'How platforms work, VPNs and borrowed accounts, and why the rules exist.',
    character: 'vix', castLine: 'Vix',
    rshe: ['online_safety', 'illegal_online', 'respectful_relationships'],
  },
  {
    n: 12, moduleId: 'ks3-12-misinfo-deepfakes', keyStage: 'KS3', yearBand: 'Years 7 to 9',
    title: 'Misinformation, deepfakes and AI content',
    outcome: 'I can run three checks before I believe or share something.',
    blurb: 'Spotting manufactured content with three checks that take under a minute.',
    character: 'zara', castLine: 'Zara with a Vix cameo',
    rshe: ['deepfakes_ai', 'online_safety'],
  },
  {
    n: 13, moduleId: 'ks3-13-scams-fraud-money', keyStage: 'KS3', yearBand: 'Years 7 to 9',
    title: 'Scams, fraud and money online',
    outcome: 'I can spot a scam’s three tells.',
    blurb: 'Phishing, fake offers, get rich hype and account theft.',
    character: 'vix', castLine: 'Vix',
    rshe: ['scams_financial', 'illegal_online', 'online_safety'],
  },
  {
    n: 14, moduleId: 'ks3-14-bodies-image-pressure', keyStage: 'KS3', yearBand: 'Years 7 to 9',
    title: 'Bodies, image and pressure online',
    outcome: 'I can name one way images online are made to make me feel worse.',
    blurb: 'Edited and idealised bodies, healthy self image, handled with care.',
    character: 'digi', castLine: 'DiGi carries the calm register', dsl: true,
    rshe: ['pornography', 'mental_wellbeing', 'online_safety'],
  },
  {
    n: 15, moduleId: 'ks4-15-manipulation-persuasion', keyStage: 'KS4', yearBand: 'Years 10 to 11',
    title: 'Manipulation and persuasion',
    outcome: 'I can name the technique being used on me.',
    blurb: 'Dark patterns, engineered outrage, and who profits.',
    character: 'vix', castLine: 'Vix',
    rshe: ['online_safety', 'mental_wellbeing', 'gambling'],
  },
  {
    n: 16, moduleId: 'ks4-16-consent-images-law', keyStage: 'KS4', yearBand: 'Years 10 to 11',
    title: 'Consent, images and the law',
    outcome: 'I know the law and my options before anything is shared.',
    blurb: 'Consent, image sharing, pressure, and what the law actually says.',
    character: 'digi', castLine: 'DiGi only', dsl: true,
    rshe: ['consent_images', 'illegal_online', 'respectful_relationships'],
  },
  {
    n: 17, moduleId: 'ks4-17-sextortion', keyStage: 'KS4', yearBand: 'Years 10 to 11',
    title: 'Sextortion',
    outcome: 'I know exactly who to tell and that it is not my fault.',
    blurb: 'Recognising, refusing, reporting, and the you are not in trouble message.',
    character: 'digi', castLine: 'DiGi only, maximum calm', dsl: true,
    rshe: ['consent_images', 'scams_financial', 'illegal_online', 'online_safety'],
  },
  {
    n: 18, moduleId: 'ks4-18-radicalisation-misogyny', keyStage: 'KS4', yearBand: 'Years 10 to 11',
    title: 'Radicalisation and misogyny',
    outcome: 'I can recognise when content is grooming my beliefs.',
    blurb: 'Pipelines, extremist content and gendered harm, named plainly.',
    character: 'digi', castLine: 'DiGi only', dsl: true,
    rshe: ['misogyny_incel', 'respectful_relationships', 'online_safety'],
  },
  {
    n: 19, moduleId: 'ks4-19-readiness-at-16', keyStage: 'KS4', yearBand: 'Years 10 to 11',
    title: 'Readiness at 16: the ban world',
    outcome: 'I can plan how I will handle full access when it arrives.',
    blurb: 'The ban removes the apps, it does not build judgement. This module does.',
    character: 'vix', castLine: 'Vix with DiGi', crown: true,
    rshe: ['online_safety', 'mental_wellbeing', 'illegal_online'],
  },
  {
    n: 20, moduleId: 'ks5-20-ai-mastery-data-rights', keyStage: 'KS5', yearBand: 'Years 12 to 13',
    title: 'AI mastery and data rights',
    outcome: 'I can use an AI tool and defend where I checked its work.',
    blurb: 'Prompts, verification, bias, agents, and your data rights.',
    character: 'digi', castLine: 'DiGi with motion graphics',
    rshe: ['deepfakes_ai', 'online_safety'],
  },
  {
    n: 21, moduleId: 'ks5-21-digital-identity-future-work', keyStage: 'KS5', yearBand: 'Years 12 to 13',
    title: 'Digital identity and the future of work',
    outcome: 'I can name the human skills I am building that AI cannot replace.',
    blurb: 'Identity, portfolio, the jobs AI reshapes, and the skills that endure.',
    character: 'digi', castLine: 'DiGi with motion graphics',
    rshe: ['online_safety', 'mental_wellbeing'],
  },
]

export const KEY_STAGE_ORDER: KeyStage[] = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5']
