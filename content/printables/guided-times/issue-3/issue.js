// THE GUIDED TIMES, Issue 3: the Safer Internet Day special, February 2027.
// Safer Internet Day is Tuesday 9 February 2027, and the UK theme is "Reflect
// on tech: exploring digital wellbeing and our relationship with technology"
// (saferinternet.org.uk/safer-internet-day/safer-internet-day-2027, read
// 6 November 2026). It falls on Pancake Day, and Lunar New Year is 6 February.
// We name the day, never use its logo, and make no wellbeing outcome claims:
// a tech check is noticing and talking, nothing more.
//
// Same rules as Issues 1 and 2. Design as Issue 2 (design: 2).
window.ISSUE = {
  design: 2,
  number: 3,
  month: 'February 2027',
  headLabel: 'Special · February 2027',
  edition: 'Safer Internet Day special',
  theme: 'Tech check time',
  ages: 'Ages 6 to 11, with a grown up nearby',
  nextIssue: { number: 4, month: 'March 2027' },
  shopUrl: 'etsy.com/shop/GuidedChildhood',
  bonusUrl: 'guidedchildhood.com/etsy-bonus',
  pages: ['cover2', 'editor', 'plan', 'challenge', 'bigQuestion', 'appDesk', 'poster', 'planner', 'sites', 'puzzles', 'make', 'back2'],
  labels: {
    scene: 'safer',
    ornament: 'heart',
    featureNote: 'The big feature · page 3',
    questionNote: 'Read both sides, then vote',
    appsNote: 'Privacy settings, made simple',
    homeworkNote: 'Half term is coming',
    sitesNote: 'Checked by Orbit',
    makeNote: 'Screen free fun for half term',
  },

  front: {
    kicker: 'Safer Internet Day special',
    headline: 'Tech Check Time!',
    standfirst: 'Safer Internet Day is on Tuesday 9 February. The Planet Friends are checking how tech makes them feel. Here is how you can too.',
    burst: 'Safer Internet Day!',
    burstColour: '#2E7D5A',
    friends: [['pebble', 'happy'], ['bloop', 'thinking'], ['orbit', 'wave'], ['nova', 'happy'], ['cosmo', 'wave']],
    paras: [
      'A tech check is easy. Think about one app, game or show you love, and ask: how do I feel while I use it, and how do I feel after? There are no wrong answers.',
      'Turn to page 3 for the tech check, then try the kind message challenge on page 4. Grown ups, your bits have a star.',
    ],
    // saferinternet.org.uk, the 2027 page: began in 2004, marked in approximately 170 countries.
    wow: { title: 'Wow fact', text: 'Safer Internet Day began in 2004. Now it is marked in about 170 countries every February.' },
    inThis: [[3, 'Your tech check', 'shield'], [4, 'The kind message challenge', 'heart'], [5, 'The big question', 'chat'], [7, 'Pull out poster', 'calendar'], [10, 'Puzzles and jokes', 'book']],
  },

  editor: {
    hello: 'Welcome to Issue 3, our Safer Internet Day special!',
    paras: [
      'Safer Internet Day is on Tuesday 9 February, and this year it asks everyone to stop and think about how tech makes us feel. So this whole issue is a big, friendly tech check.',
      'There is also a kind message challenge, a pancake plan (Pancake Day is the same day!), and puzzles and jokes at the back. The bits for grown ups are marked with a star.',
    ],
    signoff: 'With love, DiGi',
  },
  briefs: [
    { by: 'pebble', mood: 'happy', head: 'Pebble’s pancake plan', text: 'Safer Internet Day and Pancake Day are on the same day this year. Pebble’s family is flipping pancakes with every screen asleep.' },
    { by: 'bloop', mood: 'thinking', head: 'Bloop does a tech check', text: 'Bloop noticed one game feels fun for twenty minutes and grumpy after an hour. Now Bloop stops at a save point before the grumpy bit.' },
    // Lunar New Year 2027: Saturday 6 February (several calendars agree, checked 6 November 2026).
    { by: 'orbit', mood: 'happy', head: 'Orbit makes a lantern', text: 'Lunar New Year is on 6 February. Orbit made a paper lantern for the window. There is one to try in the half term bingo.' },
    { by: 'nova', mood: 'wave', head: 'Nova’s kind messages', text: 'Nova sent three kind messages this week: one to a friend, one to a cousin and one to Grandma. Try it on page 4.' },
  ],
  facts: [
    'Pancake Day is also called Shrove Tuesday. In 2027 it is on 9 February, the same day as Safer Internet Day.',
    'Safer Internet Day happens on the second Tuesday of February every year.',
  ],
  comic: {
    title: 'Tabby’s tech check',
    part: 'The comic strip, part 3',
    next: 'To be continued',
    panels: [
      { who: 'bloop', mood: 'thinking', say: 'Tabby, how do I feel when we play?' },
      { who: 'digi', say: 'Good question! Notice how you feel during, and after.' },
      { who: 'bloop', mood: 'happy', say: 'Happy for a bit. Then a bit tired.' },
      { who: 'bloop', mood: 'wave', say: 'Nap time, Tabby. I’m off outside!', basket: true },
    ],
  },

  plan: {
    kicker: 'The big feature',
    headline: 'Your six question tech check',
    intro: 'Pick one app, game or show you love. Then answer these six questions out loud with your grown up. There are no wrong answers.',
    steps: [
      { head: 'How do I feel while I use it?', text: 'Happy, excited, calm, cross, bored? Say the word.', icon: 'heart' },
      { head: 'How do I feel after?', text: 'Notice the minute after you stop. Ready for something else, or wanting more?', icon: 'moon' },
      { head: 'Who do I talk to in it?', text: 'Only people I know in real life, or people I do not know?', icon: 'chat' },
      { head: 'Does it ask me to pay?', text: 'Coins, gems and upgrades cost real money. Always ask before you tap.', icon: 'lock' },
      { head: 'What would I miss?', text: 'If it was gone for a week, what would you miss, and what would you do instead?', icon: 'target' },
      { head: 'What is one change?', text: 'Pick one small change, like stopping at a save point, and write it on the poster.', icon: 'tag' },
    ],
    morning: [
      { draw: 'heart', head: 'Pick one app or game', when: 'The one you use most' },
      { who: 'nova', mood: 'thinking', head: 'Ask the six questions', when: 'About ten minutes' },
      { who: 'orbit', mood: 'happy', head: 'Choose one change', when: 'Just one' },
      { draw: 'calendar', head: 'Check again in a month', when: 'In March' },
    ],
    grownUps: {
      title: 'For grown ups',
      text: 'Ask, then listen, and try not to correct the answers. Then do your own tech check out loud, on your own phone, so it is something the whole family does rather than a test for the children.',
    },
  },

  challenge: {
    section: 'The challenge',
    kicker: 'This month’s challenge',
    note: 'One tick for every kind message',
    headline: 'The kind message challenge',
    intro: 'For one week, send one kind message a day, on paper or on a screen with your grown up. Write who it was for, then tick the day.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rule: 'The rule: a kind message is true, it is friendly, and you would be happy for anyone to read it.',
    ideasTitle: 'Kind idea',
    ideas: ['Thank someone for something small they did.', 'Tell a friend what they are brilliant at.', 'Send Grandma or Grandad a drawing.'],
    certificate: {
      kicker: 'This certificate says that',
      title: 'Kind Message Champions',
      line: 'sent seven kind messages in one week.',
    },
  },

  bigQuestion: {
    kicker: 'The big question',
    question: 'Your own tablet, or share the family one?',
    intro: 'Families answer this one differently, and that is fine. Read both sides, then have a family vote.',
    yes: { by: 'cosmo', mood: 'wave', head: 'My own tablet', points: ['My games and drawings stay where I left them.', 'No waiting for a turn.', 'I can learn to look after it myself.'] },
    no: { by: 'nova', mood: 'thinking', head: 'Share the family one', points: ['It lives in a shared room, with grown ups nearby.', 'Taking turns is fair, and good practice.', 'One tablet costs less than two.'] },
    middle: { by: 'orbit', mood: 'happy', text: 'What if each child has their own profile on the family tablet, and it still sleeps in its shared spot at night?' },
    vote: { title: 'Family vote', options: ['My own tablet', 'Share the family one', 'Not sure yet'] },
    decide: 'What we decided, and why',
    tip: 'Top tip: whichever you choose, the tablet still sleeps in its shared spot overnight.',
  },

  apps: {
    kicker: 'The app desk',
    headline: 'Five privacy settings to check',
    intro: 'Safer Internet Day is a good day to check who can see what. Look at these five with your grown up, on any app, game or device.',
    cards: [['lock', 'A private account'], ['chat', 'Who can message me'], ['shield', 'Location off'], ['heart', 'Who sees my photos'], ['key', 'A secret password']],
    questions: {
      title: 'Ask these while you look',
      items: ['Who can see my name?', 'Who can see my photos?', 'Does it know where I am?', 'Who can send me messages?', 'Is my password a secret?'],
    },
    social: 'Most social media apps say you must be 13 or older to have an account.',
    check: { title: 'Check an app', lines: ['App or game', 'Its age label'], yesno: ['Chat with strangers?', 'Money inside it?'], verdict: 'My grown up says', options: ['Yes', 'Not yet'] },
    dear: {
      title: 'Dear DiGi',
      letter: '“Someone in a game asked where I live. I said no, but now I feel worried.”',
      from: 'A question lots of children ask',
      reply: 'Saying no was exactly right. Now tell your grown up today and show them the message, so they can help you block and report it. Telling is always the right thing to do. You can also talk to Childline, free, on 0800 1111.',
    },
    ours: {
      title: 'Our app: Guided Childhood',
      text: 'Guided Childhood is the family app behind this newspaper. Your child gets their own app with no login: jobs earn stars, and stars become screen minutes. Every stage has short lessons on games, social media and AI, stamped in their Digital Passport. Grown ups get one small script for the evening’s tricky moment.',
      url: 'guidedchildhood.com',
    },
  },

  poster: {
    section: 'Pull out poster',
    kicker: 'Pull out and pin up',
    collect: 'Poster 3 of 12',
    title: 'Our Family Tech Check',
    sub: 'Fill it in together after the tech check on page 3.',
    kinds: [
      { icon: 'heart', title: 'Feels good', text: 'The apps and games we enjoy' },
      { icon: 'moon', title: 'Feels meh', text: 'Things that leave us tired or cross' },
      { icon: 'target', title: 'Our one change', text: 'One small change to try' },
    ],
    lines: ['The app or game we checked', 'How we feel while we use it', 'How we feel after', 'Our one change is'],
    signTitle: 'Signed by everyone in our house',
    foot: 'Check it again on 9 March, one month on.',
    friends: [['orbit', 'wave'], ['nova', 'happy']],
  },

  homework: {
    kicker: 'The homework helper',
    headline: 'Plan the week before half term',
    intro: 'Write what is due each day and roughly how long it should take, then tick it when it is done.',
    by: 'nova',
    columns: ['Homework', 'Minutes', 'Done'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    reading: { title: 'Reading nights', line: 'Colour a square for every night you read. Five minutes counts.' },
    ladderTitle: 'Stuck? The help ladder',
    ladder: ['Read it out loud', 'Look for an example', 'Try one small bit', 'Ask someone to listen', 'Write a note for your teacher'],
    grownUps: 'February half term dates vary by council in England, so check your school’s calendar. Over the break, a bedtime story still counts as reading.',
  },

  sites: {
    kicker: 'The good sites guide',
    headline: 'Where to find help online',
    by: 'orbit',
    intro: 'Orbit has checked every one. They are free, and none needs an account to read.',
    kids: [
      { name: 'Childline', url: 'childline.org.uk', text: 'Free, private help with any worry, online or off. Or call 0800 1111.' },
      { name: 'CEOP Education', url: 'thinkuknow.co.uk', text: 'Games, videos and advice about staying safe online, made for your age.' },
      { name: 'UK Safer Internet Centre', url: 'saferinternet.org.uk', text: 'Find out what is happening for Safer Internet Day this year.' },
      { name: 'Newsround', url: 'bbc.co.uk/newsround', text: 'Real news from around the world, written for children.' },
      { name: 'BBC Bitesize', url: 'bbc.co.uk/bitesize', text: 'Help with every school subject, with short videos and games.' },
    ],
    grownUps: [
      { name: 'Internet Matters', url: 'internetmatters.org', text: 'Step by step guides to privacy and family settings on every device.' },
      { name: 'NSPCC', url: 'nspcc.org.uk', text: 'Online safety advice, and a helpline for any worried grown up.' },
      { name: 'Childnet', url: 'childnet.com', text: 'Advice and conversation starters for talking with children about life online.' },
      { name: 'CEOP Safety Centre', url: 'ceop.police.uk', text: 'Where to report a worry about how someone is talking to a child online.' },
    ],
    check: { title: 'Is it a good website?', items: ['Who made it?', 'Is it for my age?', 'Does it ask for my name or photo?', 'Did a grown up say yes?'] },
    tip: 'Orbit’s tip: if something online worries you, tell a grown up you trust. That is exactly what they are there for.',
    fave: 'A grown up I can always tell',
  },

  puzzles: {
    kicker: 'Orbit’s Safer Internet puzzles',
    realOrPretend: {
      headline: 'Real or pretend?',
      intro: 'Three messages arrived on Safer Internet Day. Circle real or pretend for each one.',
      messages: [
        { from: 'Prize Wheel', text: 'Spin the wheel to WIN a new phone! Just type your name and address.' },
        { from: 'Cousin Sam', text: 'Pancakes at ours on Tuesday? Bring your best topping!' },
        { from: 'Free Gems', text: 'Type a grown up’s bank card number to unlock 500 free gems.' },
      ],
      answers: ['1 is pretend: real prizes never need your address from a message.', '2 is real: your cousin, and a tasty plan.', '3 is pretend: never type a bank card number. Ask a grown up first.'],
    },
    wordSearch: { headline: 'Safer Internet word search', words: ['SAFE', 'KIND', 'PRIVATE', 'LOCK', 'TELL', 'PANCAKE', 'CHECK', 'FEEL', 'SHARE', 'ASK'], seed: 33 },
    code: { headline: 'Crack the code', intro: 'A is 1, B is 2, C is 3, all the way to Z is 26. What do you do if something online worries you?', message: 'TELL A GROWN UP', answer: 'The code says: tell a grown up. Telling is always the right thing to do.' },
    maze: { headline: 'Help Tabby get to pancake night', seed: 27 },
  },

  make: {
    kicker: 'Make and do',
    bingo: {
      headline: 'Half term bingo',
      intro: 'Tick a square each time you do one. Four in a row and you choose the pancake topping!',
      squares: ['Flip a pancake', 'Make a paper lantern', 'Visit the library', 'Build a den', 'Play a board game', 'Bake biscuits', 'Go to the park', 'Write a kind note', 'Draw a comic', 'Do a jigsaw', 'Have a dance', 'Plant a seed', 'Read a whole book', 'Make up a song', 'Call a grandparent', 'Teach someone a game'],
    },
    hanger: {
      headline: 'Make a tech check sign',
      steps: ['Colour both sides.', 'Cut along the solid line.', 'Fold on the dotted line.', 'Stand it by the family tablet.'],
      front: 'How do I feel?',
      back: 'Time for a tech check',
    },
    jokes: {
      title: 'DiGi’s joke corner (answers upside down)',
      items: [
        ['Why are spiders good on the internet?', 'They make great websites!'],
        ['Why was the computer cold?', 'It left its Windows open!'],
        ['Why did the cookie go to the doctor?', 'It was feeling crummy!'],
      ],
    },
  },

  shop: {
    kicker: 'The shop',
    headline: 'Small ads from the Guided Childhood shop',
    sticker: 'Instant downloads, print at home.',
    ads: [
      { key: 'passport', name: 'The Guided Childhood Passport', ages: 'Ages 4 to 16', img: 'guided-childhood-passport', live: true },
      { key: 'star', name: 'The Star Chart', ages: 'Ages 4 and up', img: 'star-chart', live: true },
      { key: 'earn', name: 'Earn Your Screen Time', ages: 'Ages 5 to 11', img: 'earn-your-screen-time', live: true },
      { key: 'phone', name: 'The Family Phone Agreement', ages: 'Ages 10 to 12', img: 'family-phone-agreement', live: true },
      { key: 'calm', name: 'The Calm Down Corner Kit', ages: 'Ages 4 to 9', img: 'calm-down-kit', live: true },
      { key: 'back', name: 'The Guided Times back issues', ages: 'Issues 1 and 2', draw: 'book', live: true },
    ],
  },

  back: {
    next: { kicker: 'Coming next', line: 'Issue 4, March 2027, arrives in our Etsy shop at the end of February. Tap the heart on our shop to hear first.' },
    gift: 'A free gift from us: the Guided Childhood Starter Pack, at guidedchildhood.com/etsy-bonus',
    review: 'If your family enjoyed this issue, a short review on Etsy helps other families find us. Thank you.',
  },
}
