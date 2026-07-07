// Kid lessons: two minute mini lessons on the kid quest page, written
// in kid voice. Each ends in a three question quiz. Finishing one
// creates a one off quest with a pending tick, so the stars land
// through the normal approve loop and the parent sees exactly what was
// learned. A perfect score earns a bonus star, which is TV time in the
// family exchange rate. Star values and marking live HERE, server
// side, never trusted from the client.

export type KidQuestion = {
  q: string
  options: string[]
  answer: number
}

export type KidLesson = {
  key: string
  title: string
  emoji: string
  stars: number
  bonusStars: number
  cards: string[]
  questions: KidQuestion[]
}

export const KID_LESSONS: KidLesson[] = [
  {
    key: 'three-checks',
    title: 'Is that real? The three checks',
    emoji: '🕵️',
    stars: 3,
    bonusStars: 1,
    cards: [
      'Some videos and photos online are made up. Not just silly ones, some are built to trick you, and they can look VERY real.',
      'Check one: WHO posted it? A real famous person has a real account with millions of followers. A copycat account with 47 followers is a big clue.',
      'Check two: does anyone ELSE say it? If something huge really happened, proper news sites would all have it. If only one video says it, be suspicious.',
      'Check three: zoom IN. Fake pictures get little things wrong: weird hands, blurry mouths, ears that melt into hair. Real photos do not do that.',
    ],
    questions: [
      {
        q: 'A video shows a famous footballer saying he is quitting football to become a chef. His mouth looks a bit blurry. What do you do?',
        options: [
          'Share it quick before anyone else!',
          'Run the three checks: who posted it, who else says it, zoom in',
          'Believe it, videos cannot lie',
        ],
        answer: 1,
      },
      {
        q: 'Only one video says your favourite theme park is closing forever. No proper news site mentions it. What is most likely?',
        options: [
          'It must be true, news sites are just slow',
          'Probably fake until somewhere real confirms it',
          'Theme parks close all the time, believe it',
        ],
        answer: 1,
      },
      {
        q: 'Which of these is a clue that a photo was made by a computer?',
        options: [
          'It has a dog in it',
          'Weird hands, melted ears or blurry teeth',
          'It is very colourful',
        ],
        answer: 1,
      },
    ],
  },
  {
    key: 'password-power',
    title: 'Password power',
    emoji: '🔐',
    stars: 2,
    bonusStars: 1,
    cards: [
      'A password is like the key to your room. If someone guesses it, they can pretend to BE you. So it needs to be hard to guess but easy for you to remember.',
      'Bad passwords: your name, your birthday, your pet, or 12345. A computer can guess those in less than one second. Seriously, one second.',
      'The trick: THREE random words squashed together plus a number. WobblyOctopus77 would take a computer hundreds of years to crack, and you will never forget it.',
      'One more rule: your password is a secret between you and your grown up. Not your best friend, not anyone who asks online. Nobody real ever needs to ask for it.',
    ],
    questions: [
      {
        q: 'Which of these is the strongest password?',
        options: [
          'alma2015',
          'password123',
          'BouncyDragon42',
        ],
        answer: 2,
      },
      {
        q: 'Your best friend asks for your password and pinky promises not to tell. What do you do?',
        options: [
          'Tell them, best friends share everything',
          'Keep it secret, passwords are only for you and your grown up',
          'Write it on your hand so they can peek',
        ],
        answer: 1,
      },
      {
        q: 'Why do three random words make a strong password?',
        options: [
          'They look cool',
          'Long and random takes a computer ages to guess, but you remember it easily',
          'Because three is a lucky number',
        ],
        answer: 1,
      },
    ],
  },
  {
    key: 'scroll-trick',
    title: 'The endless scroll trick',
    emoji: '🎣',
    stars: 3,
    bonusStars: 1,
    cards: [
      'Ever meant to watch ONE video and looked up an hour later? That is not you being weak. That is an app doing its job.',
      'Apps are built by teams whose whole job is keeping you watching. The next video loads by itself, so stopping needs a decision but continuing needs nothing.',
      'The trick to beat it: decide BEFORE you start. Say out loud what you will watch, watch it, then put the screen down while you still feel good.',
      'Here is the secret grown ups do not always say: it hooks them too. Next time you see one scrolling at dinner, you are allowed to say the app is doing its job on them.',
    ],
    questions: [
      {
        q: 'Why does the next video start playing all by itself?',
        options: [
          'The app is being helpful',
          'The app is built to keep you watching as long as possible',
          'It is magic',
        ],
        answer: 1,
      },
      {
        q: 'What is the best way to beat the endless scroll?',
        options: [
          'Decide what you will watch before you start, then stop when it ends',
          'Watch until the battery dies',
          'Turn the volume down',
        ],
        answer: 0,
      },
      {
        q: 'You look up and a whole hour has vanished. Whose job got done?',
        options: [
          'Yours',
          'The app makers, keeping you watching is exactly their job',
          'Nobody, time is weird',
        ],
        answer: 1,
      },
    ],
  },
  {
    key: 'kind-online',
    title: 'Mean messages and what to do',
    emoji: '💛',
    stars: 3,
    bonusStars: 1,
    cards: [
      'Sometimes people send mean things online. It happens to nearly everyone, even famous people, and it is never your fault.',
      'Rule one: do not reply while you feel hot and angry. A mean reply turns one bad message into a fight, and screenshots last forever.',
      'Rule two: keep the evidence. Screenshot it, then show your grown up. That is not telling tales, that is being smart.',
      'Rule three: blocking is not weak. Blocking is you closing the door on someone unkind. Strong people close doors all the time.',
    ],
    questions: [
      {
        q: 'Someone sends you a mean message. What is the best first move?',
        options: [
          'Send something meaner back',
          'Screenshot it and show your grown up',
          'Delete everything and worry about it alone',
        ],
        answer: 1,
      },
      {
        q: 'Is blocking someone mean?',
        options: [
          'Yes, blocking is rude',
          'No, blocking is closing the door on someone unkind, and that is smart',
          'Only if they block you first',
        ],
        answer: 1,
      },
      {
        q: 'A group chat is laughing at another kid. What is the strong move?',
        options: [
          'Join in so the group likes you',
          'Say nothing and hope it stops',
          'Do not join in, tell a grown up, and be kind to that kid later',
        ],
        answer: 2,
      },
    ],
  },
  {
    key: 'who-is-real',
    title: 'Who are you really talking to?',
    emoji: '🎭',
    stars: 3,
    bonusStars: 1,
    cards: [
      'Online, anyone can pretend to be anyone. A profile that says kid, 10, loves football could be exactly that, or could be someone completely different.',
      'That is why some things NEVER get shared online: your address, your school, your phone number. Not to game friends, not to anyone who asks nicely.',
      'The biggest alarm bell of all: someone online says keep our chats secret from your parents. Real friends never need you to keep them secret.',
      'If that ever happens, you are not in trouble, not even a little bit. Tell your grown up straight away. That is the superhero move.',
    ],
    questions: [
      {
        q: 'Someone in a game says they are 10 like you and asks which school you go to. What do you do?',
        options: [
          'Tell them, we have been teammates for weeks',
          'Never share it, people online can pretend to be anyone',
          'Only tell them the town, not the school',
        ],
        answer: 1,
      },
      {
        q: 'An online friend says keep our chats secret from your parents. What is that?',
        options: [
          'Fun, secrets make friendship special',
          'The biggest alarm bell there is, tell your grown up straight away',
          'Fine as long as the chats are nice',
        ],
        answer: 1,
      },
      {
        q: 'Who is allowed to know your home address?',
        options: [
          'Anyone who asks nicely',
          'People your grown ups know in real life',
          'Anyone who plays the same game as you',
        ],
        answer: 1,
      },
    ],
  },
  {
    key: 'ads-disguise',
    title: 'Adverts in disguise',
    emoji: '🕶️',
    stars: 2,
    bonusStars: 1,
    cards: [
      'Some adverts do not look like adverts. They look like normal videos, because you would skip them if you knew.',
      'When a YouTuber says this toy is AMAZING and puts a shop link underneath, they might have been paid to say it. Look for the little words AD or gifted.',
      'Free games have tricks too. ONLY 10 MINUTES LEFT to buy the coins! is a pressure trick. Real things do not vanish in ten minutes.',
      'Once you can spot the tricks, they mostly stop working. That is the whole game: see the trick, keep your pocket money.',
    ],
    questions: [
      {
        q: 'A YouTuber says this toy is AMAZING and links a shop. What might be going on?',
        options: [
          'It is just their honest opinion, always',
          'It might be a paid advert, look for AD or gifted',
          'They definitely bought it themselves',
        ],
        answer: 1,
      },
      {
        q: 'A free game flashes ONLY 10 MINUTES LEFT to buy special coins. What is that?',
        options: [
          'A brilliant deal, hurry',
          'A pressure trick, real deals do not vanish in minutes',
          'A reward for playing well',
        ],
        answer: 1,
      },
      {
        q: 'Why are some adverts dressed up like normal videos?',
        options: [
          'To be extra fun',
          'Because you would skip them if you knew they were adverts',
          'By accident',
        ],
        answer: 1,
      },
    ],
  },
]

export function kidLessonQuestTitle(lesson: KidLesson, perfect: boolean): string {
  return perfect ? `Lesson: ${lesson.title} 💯` : `Lesson: ${lesson.title}`
}

export function kidLessonBaseTitle(lesson: KidLesson): string {
  return `Lesson: ${lesson.title}`
}
