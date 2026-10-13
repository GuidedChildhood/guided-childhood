// The lead magnets: a small set of genuinely useful one page printables a
// parent downloads in exchange for an email. Each one is the free front
// door to the app. The page it lives on stays public (Google reads it,
// people share it); the download is what asks for the email, so the lead
// is captured at the moment the parent already has value in hand.
//
// Adding a magnet is a data entry here plus a gate on the page. The PDF
// route and the capture API both read from this registry, so a slug can
// never drift between the download, the email and the page.

export type MagnetItem = { h: string; b: string }

export type Magnet = {
  slug: string
  // The mono eyebrow, matching the page it sits on.
  eyebrow: string
  // The download title, used as the PDF heading and in the email.
  title: string
  // One warm line under the title, on the sheet and in the email.
  intro: string
  // Numbered on the sheet (Five Questions) or left as plain headed
  // blocks (The Evidence). Controlled by `numbered`.
  numbered: boolean
  items: MagnetItem[]
  // The closing line along the foot of the sheet body.
  close: string
  // The download filename (no extension).
  filename: string
  // When set, the magnet hands over this ready made PDF from public instead
  // of the one page sheet generated from `items`. Used for the full multi
  // page products (the Starter Pack) that already exist as real print files.
  staticPdf?: string
  // The other prints of the same thing (13 October 2026, the free printables):
  // US Letter, ink saver, the folded booklet. Shown under the download and
  // listed in the email, so a parent in America or on an empty cartridge is
  // not handed the wrong file.
  files?: { label: string; href: string }[]
  // The email's one line about what it is. Left out, the email says one page
  // for the fridge, which is right for the one page magnets.
  emailBlurb?: string
}

export const MAGNETS: Record<string, Magnet> = {
  'five-questions': {
    slug: 'five-questions',
    eyebrow: 'Five questions',
    title: 'Five questions before you hand over a screen',
    intro:
      'No lecture, no guilt. Five calm questions that help you make the call that fits your child and your day. Stick it on the fridge.',
    numbered: true,
    items: [
      { h: 'Is the screen replacing something, or adding to the day?', b: 'The real risk is what screens crowd out: sleep, movement, real play, and the boredom that turns into ideas. A show after a day full of those is very different from one that took their place.' },
      { h: 'Do they know when it stops before it starts?', b: 'A clear end agreed up front, a number of minutes or the end of one thing, turns the hardest moment, switching off, into a plan you both already made.' },
      { h: 'Whose idea was it to pick it up?', b: 'Reaching for a screen out of a real want is fine. Reaching for it out of habit, every gap filled, is the pattern worth gently noticing together.' },
      { h: 'Would you be happy to watch it with them?', b: 'Not every minute, but if the answer is a flat no, that is useful information about the app, not about you.' },
      { h: 'What does the wind down look like after?', b: 'A calm bridge back to the room, a snack, a chat, a job to do, makes the difference between a screen that settles a child and one that leaves them wired.' },
    ],
    close: 'Most parents find they already know the answers. They just needed the questions.',
    filename: 'Five-questions-before-a-screen',
  },
  'evidence': {
    slug: 'evidence',
    eyebrow: 'The evidence',
    title: 'What Guided Childhood is built on',
    intro:
      'We try to be honest about what the research does and does not say. Here is the calm, balanced stance the whole approach rests on.',
    numbered: false,
    items: [
      { h: 'It is not the screen, it is what it displaces', b: 'The strongest, most agreed finding is that the harm from screens is mostly about what they crowd out: sleep, movement, real play, and unstructured time. Protect those first.' },
      { h: 'Balance beats bans', b: 'Outright bans tend to push behaviour underground and teach nothing for the years when a parent is not in the room. A calm structure that grows with the child is what the developmental research supports.' },
      { h: 'Repair matters more than perfection', b: 'Warm relationships are out of step much of the time. What builds a child security is coming back together after a rough patch, not never slipping.' },
      { h: 'Boredom is not the enemy', b: 'Empty time is where children learn to generate their own ideas. Treat I am bored as a doorway, not a problem to fix with a screen.' },
    ],
    close: 'Calm, balanced, and open to being updated as the evidence moves.',
    filename: 'The-evidence-behind-Guided-Childhood',
  },
  'starter-pack': {
    slug: 'starter-pack',
    eyebrow: 'The starter pack',
    title: 'The Guided Childhood Starter Pack',
    intro:
      'The whole deal on paper. A star reward chart for the fridge, the jobs that earn stars, how to guides, a wake up workout, football and dance, a healthy breakfast plate, a print and play game and pages to colour. One star is five minutes of screen time.',
    numbered: false,
    items: [],
    close: 'Print it, stick the chart on the fridge, and start today.',
    filename: 'The-Guided-Childhood-Starter-Pack',
    // The real 11 page product, served straight from public.
    staticPdf: '/printables/starter-pack-colour.pdf',
  },
  // THE PLANET POST, Issue 1 (13 October 2026): the first of the five free
  // Happy News printables (plans/2026-10-13-free-printables-lead-magnets-plan.md).
  // Rendered by scripts/render-free-printables.mjs from app/print-free.
  'planet-post-1': {
    slug: 'planet-post-1',
    eyebrow: 'The Planet Post',
    title: 'The Planet Post, Issue 1: How screens work in our house',
    intro:
      'A four page newspaper for kids aged 6 to 11, all about screens: the three jars of screen time, phones going to bed, a real or pretend detective corner, and a screen promise to sign together.',
    numbered: false,
    items: [],
    close: 'Print it, grab a pencil, and read it together.',
    filename: 'The-Planet-Post-Issue-1',
    emailBlurb: 'It is a four page newspaper for your child to read, colour in and fill in, with a screen promise to sign together. No login needed.',
    staticPdf: '/printables/free/planet-post-1-a4.pdf',
    files: [
      { label: 'US Letter', href: '/printables/free/planet-post-1-letter.pdf' },
      { label: 'Ink saver A4', href: '/printables/free/planet-post-1-ink-a4.pdf' },
      { label: 'Ink saver Letter', href: '/printables/free/planet-post-1-ink-letter.pdf' },
      { label: 'Fold up booklet', href: '/printables/free/planet-post-1-booklet-a4.pdf' },
    ],
  },
}

export function getMagnet(slug: string): Magnet | null {
  return MAGNETS[slug] ?? null
}
