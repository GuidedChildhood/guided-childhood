// THE ISSUE AS DATA.
//
// One edition of The Guided Planet is one JSON file,
// publishing/issues/<NNN>/issue.json, shaped by the types below. The templates
// read it, the validators check it, the dashboard shows it, and the approval
// gate hashes it. A second issue is a second file, never a second layout,
// which is acceptance criterion 10 of the build brief and the reason every
// page names a TEMPLATE rather than carrying its own markup.
//
// Text stays text. Nothing a reader reads is ever inside an image: the art
// slots carry pictures, the fields carry words, and the PDF keeps every word
// selectable and searchable because Chromium prints HTML text as text.
//
// CITATIONS. Any copy string may carry [[s3]] to cite source s3. The renderer
// turns it into a small numbered marker that matches the "Where this came
// from" box on the page, and the validator refuses a cited id that is not in
// `sources`, and refuses to print a source whose verification is anything
// but 'verified'. A factual page with no citation at all is also refused.

export type Destination =
  | 'observatory'   // THE DISCOVERY OBSERVATORY, science, space, discoveries
  | 'maker'         // THE MAKER DISTRICT, coding, creating, inventing
  | 'forest'        // THE THINKING FOREST, AI, algorithms, what is real
  | 'garden'        // THE CONNECTION GARDEN, friendship, kindness, belonging
  | 'research'      // THE RESEARCH ROOM, what the evidence actually says
  | 'explorer'      // THE FAMILY EXPLORER, things to try together

export type FriendId = 'bloop' | 'pebble' | 'orbit' | 'nova' | 'cosmo' | 'digi'
export type Pose = 'happy' | 'wave' | 'thinking' | 'standing'

export type FriendRef = { id: FriendId; pose: Pose }

export type EvidenceType =
  | 'official programme page'
  | 'official report'
  | 'peer reviewed study'
  | 'systematic review'
  | 'press release'
  | 'news report'
  | 'educational resource'

export type Verification = 'verified' | 'flagged' | 'unverified'

export type Source = {
  id: string                 // s1, s2 ... referenced as [[s1]] in copy
  org: string                // who published it
  title: string              // the page or paper title, as published
  url: string
  published?: string         // as stated on the source, never guessed
  accessed: string           // ISO date the claim was last checked
  evidence: EvidenceType
  verification: Verification
  supports: string           // the claim it backs, in one line
  quote?: string             // the words on the source that back it
  note?: string              // limitations, or why it is flagged
}

// The art slot. `slot` names a picture the issue wants; the engine looks for
// an APPROVED file in issues/<NNN>/assets/approved/<slot>.(png|jpg|webp) and,
// when there is none, draws the vector default named by `vector`. So a page is
// complete before Higgsfield has made anything, and a generation that fails or
// is rejected can never hold an edition back (build brief, part 14).
export type ArtSlot = {
  slot: string
  vector?: string            // key into templates/art.ts
  alt: string                // what a screen reader says
  recipe?: string            // the Higgsfield recipe that could paint it
}

export type Activity =
  | { kind: 'pixel-grid'; title: string; intro: string; steps: string[]; size: 8; palette: { name: string; hex: string }[] }
  | { kind: 'blueprint'; title: string; intro: string; prompts: { label: string; hint: string }[] }
  | { kind: 'postcard'; title: string; intro: string; front: string; lines: string[] }
  | { kind: 'card-game'; title: string; intro: string; players: string; youNeed: string[]; setup: string[]; rounds: string[]; talk: string[]; cards: { topic: string; label: string; icon: string }[] }
  | { kind: 'week'; title: string; intro: string; days: { day: string; title: string; task: string; offline: boolean }[]; reflect?: string[] }
  | { kind: 'passport'; title: string; intro: string; stamps: { label: string; page: number }[] }

export type Block =
  | { type: 'para'; text: string }
  | { type: 'subhead'; text: string }
  | { type: 'list'; items: string[] }

export type Page =
  | {
      template: 'cover'; n: 1
      headline: string; deck: string
      teasers: { page: number; text: string }[]
      art: ArtSlot; friend: FriendRef
    }
  | {
      template: 'welcome'; n: number; destination?: Destination
      headline: string; letter: Block[]; signoff: { name: string; role: string }
      map: ArtSlot; friend: FriendRef; bloopSays: string
      inside: { page: number; title: string; destination: Destination }[]
    }
  | {
      template: 'feature'; n: number; destination: Destination
      eyebrow: string; headline: string; standfirst: string
      body: Block[]; art: ArtSlot; artHeight?: number   // mm, default 62
      facts?: { label: string; value: string; note?: string }[]
      pull?: string
      aside?: { label: string; items: string[] }   // a boxed list beside the story, such as safety tips
      friend?: FriendRef; friendSays?: string
      activity?: Activity
      refs: string[]          // source ids shown in this page's box
    }
  | {
      template: 'showcase'; n: number; destination: Destination
      eyebrow: string; headline: string; standfirst: string; body: Block[]
      art: ArtSlot
      projects: { name: string; maker: string; where: string; what: string; why: string; source: string; icon: string }[]
      facts?: { label: string; value: string; note?: string }[]; factsLabel?: string
      refs: string[]
    }
  | {
      template: 'activity'; n: number; destination: Destination
      eyebrow: string; headline: string; standfirst: string
      activity: Activity; friend?: FriendRef; friendSays?: string
      tips?: string[]; tipsLabel?: string; refs: string[]
    }
  | {
      template: 'research'; n: number; destination: 'research'
      eyebrow: string; headline: string; standfirst: string
      kinds: { name: string; icon: string; examples: string; says: string }[]
      found: Block[]; cannot: Block[]; askTogether: string[]
      friend?: FriendRef; friendSays?: string
      refs: string[]
    }
  | {
      template: 'investigation'; n: number; destination: Destination
      eyebrow: string; headline: string; standfirst: string
      clues: { title: string; text: string }[]
      body: Block[]; art: ArtSlot; friend: FriendRef; friendSays: string
      tryThis: string[]; refs: string[]
    }
  | {
      template: 'list'; n: number; destination: Destination
      eyebrow: string; headline: string; standfirst: string; art: ArtSlot
      items: { name: string; who: string; what: string; why: string; account: string; offline?: string; url: string; source: string; icon: string }[]
      friend?: FriendRef; friendSays?: string
      grownUps?: string; refs: string[]
    }
  | {
      template: 'passport'; n: number; destination: Destination
      headline: string; standfirst: string
      activity: Extract<Activity, { kind: 'passport' }>
      next: { edition: string; month: string; teasers: string[] }
      grownUps: { line: string; cta: string; url: string }
      sourcesUrl: string
      friend: FriendRef
    }

export type Issue = {
  publication: 'The Guided Planet'
  number: number             // 1, 2, 3 ... printed as 001
  slug: string               // issue-001
  edition: string            // The Curiosity Edition
  month: string              // November 2026
  tagline: string
  coverHeadline: string
  sample?: boolean           // a structure test, watermarked, never published
  readingAge: string         // 7 to 12
  pages: Page[]
  sources: Source[]
  onlineUrl: string          // where the accessible edition will live
  colophon?: string          // the small print at the foot of the last page
}

export const PAGE_COUNT = 12

export const DESTINATIONS: Record<Destination, { name: string; short: string; about: string }> = {
  observatory: { name: 'The Discovery Observatory', short: 'Observatory', about: 'Science, space and remarkable digital discoveries.' },
  maker:       { name: 'The Maker District',        short: 'Maker District', about: 'Coding, creativity, invention and young digital creators.' },
  forest:      { name: 'The Thinking Forest',       short: 'Thinking Forest', about: 'AI, algorithms, misinformation and critical thinking.' },
  garden:      { name: 'The Connection Garden',     short: 'Connection Garden', about: 'Friendship, kindness, communication and digital belonging.' },
  research:    { name: 'The Research Room',         short: 'Research Room', about: 'What scientific evidence actually tells us about growing up with technology.' },
  explorer:    { name: 'The Family Explorer',       short: 'Family Explorer', about: 'Practical activities families can try together.' },
}
