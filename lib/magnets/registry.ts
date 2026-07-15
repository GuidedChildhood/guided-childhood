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
}

export function getMagnet(slug: string): Magnet | null {
  return MAGNETS[slug] ?? null
}
