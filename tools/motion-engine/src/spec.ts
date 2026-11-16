// The story spec: everything one card says, and where every word came from.
// Built from a Claude reviewed research record by scripts/build-spec.mjs and
// checked by scripts/gate.mjs before any frame is rendered.

export type StorySpec = {
  // GDC-NNN, or null for a demonstration. Never invented here: it is read
  // from the research record, which got it from the post register.
  gdcPostNumber: string | null
  researchId: string | null
  // True for anything that must never be posted. Prints a band on every
  // frame that cannot be cropped out without cutting into the headline.
  notForPublication: boolean
  eyebrow: string
  headline: string
  finding: {
    // The one verified figure, set large. Optional: some findings are words.
    figure?: string
    // The finding in a sentence.
    text: string
  }
  context: string
  source: string
  limitation: string
  // Optional picture layers. Both sit behind an ivory wash so type always
  // reads, and neither may contain text.
  backgroundVideo?: string | null // a file in public/, for example plates/x.mp4
  objectImage?: string | null // a transparent PNG in public/
  durationSeconds?: number
}

export const DEMO_SPEC: StorySpec = {
  gdcPostNumber: null,
  researchId: null,
  notForPublication: true,
  eyebrow: 'TECHNICAL DEMONSTRATION',
  headline: 'Placeholder headline set in the house style for testing',
  finding: { figure: '00%', text: 'Placeholder finding. This is not a real result.' },
  context: 'Placeholder context, two lines at most, explaining what was measured.',
  source: 'SOURCE  Placeholder Journal, 1 January 2026',
  limitation: 'Placeholder limitation: what this study cannot tell us.',
  backgroundVideo: null,
  objectImage: null,
  durationSeconds: 14,
}
