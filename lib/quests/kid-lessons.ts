// Kid lessons: two minute mini lessons on the kid quest page, written
// in kid voice. Finishing one creates a one off quest with a pending
// tick, so the stars land through the normal approve loop and the
// parent sees exactly what was learned. Star values live HERE, server
// side, never trusted from the client.

export type KidLesson = {
  key: string
  title: string
  emoji: string
  stars: number
  cards: string[]
  question: {
    q: string
    options: string[]
    answer: number
    right: string
    wrong: string
  }
}

export const KID_LESSONS: KidLesson[] = [
  {
    key: 'three-checks',
    title: 'Is that real? The three checks',
    emoji: '🕵️',
    stars: 3,
    cards: [
      'Some videos and photos online are made up. Not just silly ones, some are built to trick you, and they can look VERY real.',
      'Check one: WHO posted it? A real famous person has a real account with millions of followers. A copycat account with 47 followers is a big clue.',
      'Check two: does anyone ELSE say it? If something huge really happened, proper news sites would all have it. If only one video says it, be suspicious.',
      'Check three: zoom IN. Fake pictures get little things wrong: weird hands, blurry mouths, ears that melt into hair. Real photos do not do that.',
    ],
    question: {
      q: 'A video shows a famous footballer saying he is quitting football to become a chef. His mouth looks a bit blurry. What do you do?',
      options: [
        'Share it quick before anyone else!',
        'Run the three checks: who posted it, who else says it, zoom in',
        'Believe it, videos cannot lie',
      ],
      answer: 1,
      right: 'Exactly! Blurry mouth plus nobody else reporting it equals almost certainly fake. You are officially harder to trick than most grown ups.',
      wrong: 'Hmm, remember the three checks: who posted it, does anyone else say it, and zoom in for the weird bits. Try again!',
    },
  },
  {
    key: 'password-power',
    title: 'Password power',
    emoji: '🔐',
    stars: 2,
    cards: [
      'A password is like the key to your room. If someone guesses it, they can pretend to BE you. So it needs to be hard to guess but easy for you to remember.',
      'Bad passwords: your name, your birthday, your pet, or 12345. A computer can guess those in less than one second. Seriously, one second.',
      'The trick: THREE random words squashed together plus a number. WobblyOctopus77 would take a computer hundreds of years to crack, and you will never forget it.',
      'One more rule: your password is a secret between you and your grown up. Not your best friend, not anyone who asks online. Nobody real ever needs to ask for it.',
    ],
    question: {
      q: 'Which of these is the strongest password?',
      options: [
        'alma2015',
        'password123',
        'BouncyDragon42',
      ],
      answer: 2,
      right: 'Yes! Random words plus a number beats any short clever one. Now go make your own monster, and only tell your grown up.',
      wrong: 'Careful, names and birthdays are the first things a computer guesses. Which one is made of random words? Try again!',
    },
  },
  {
    key: 'scroll-trick',
    title: 'The endless scroll trick',
    emoji: '🎣',
    stars: 3,
    cards: [
      'Ever meant to watch ONE video and looked up an hour later? That is not you being weak. That is an app doing its job.',
      'Apps are built by teams whose whole job is keeping you watching. The next video loads by itself, so stopping needs a decision but continuing needs nothing.',
      'The trick to beat it: decide BEFORE you start. Say out loud what you will watch, watch it, then put the screen down while you still feel good.',
      'Here is the secret grown ups do not always say: it hooks them too. Next time you see one scrolling at dinner, you are allowed to say the app is doing its job on them.',
    ],
    question: {
      q: 'Why does the next video start playing all by itself?',
      options: [
        'The app is being helpful',
        'The app is built to keep you watching as long as possible',
        'It is magic',
      ],
      answer: 1,
      right: 'Got it. Once you can SEE the trick, it stops working so well on you. That is a superpower most adults do not have.',
      wrong: 'Think about it: who wins when you keep watching? The app does. Try again!',
    },
  },
]

export function kidLessonQuestTitle(lesson: KidLesson): string {
  return `Lesson: ${lesson.title}`
}
