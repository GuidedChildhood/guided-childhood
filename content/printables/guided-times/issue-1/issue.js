// THE GUIDED TIMES, Issue 1: the Christmas edition, December 2026.
// Theme: New Screens Under the Tree (Justin, 5 November 2026).
//
// Every word a reader sees is here; paper.js lays it out. UK English, no
// dashes, no outcome or medical claims about a child, nothing that moves an
// Etsy sale off Etsy (no prices, no QR, no "subscribe"). Facts that are
// stated as facts were checked on 5 November 2026 and the source sits beside
// each one.
window.ISSUE = {
  number: 1,
  month: 'December 2026',
  edition: 'Christmas edition',
  theme: 'New screens under the tree',
  ages: 'Ages 6 to 11, with a grown up nearby',
  nextIssue: { number: 2, month: 'January 2027', title: 'The new year screen deal', out: '27 December' },
  shopUrl: 'etsy.com/shop/GuidedChildhood',
  bonusUrl: 'guidedchildhood.com/etsy-bonus',

  front: {
    burst: 'Christmas special!',
    headline: 'Something new under the tree?',
    paras: [
      'This Christmas, lots of children will unwrap a tablet, a games console or even a first phone. If that is you, hooray! But here is the big news: the best bit is not the box. It is setting it up together.',
      'The Planet Friends have been finding out how families do it, and they have written it all down. Turn to pages 3 and 4 for the Christmas morning plan. Your grown up will want to read it too.',
    ],
    quote: { by: 'cosmo', text: 'The best thing we did was choose where it sleeps before we even switched it on.' },
    weather: { title: 'Screen weather', line: 'Christmas Day: bright and cosy indoors, a strong chance of board games after lunch, and screens resting during dinner.' },
  },

  inside: [
    [2, 'A letter from DiGi'],
    [3, 'The Christmas morning plan'],
    [5, 'The big question'],
    [6, 'The app desk'],
    [7, 'The homework helper'],
    [8, 'The good sites guide'],
    [9, 'Orbit’s puzzles'],
    [10, 'Make and do'],
    [11, 'The shop'],
    [12, 'Your Christmas promise'],
  ],

  editor: {
    hello: 'Hello, and welcome to the very first Guided Times!',
    paras: [
      'I am DiGi, the little gold star who helps families with screens. This is our Christmas edition, so it is all about new screens: how to set one up, how to share it, and how to keep Christmas feeling like Christmas.',
      'Grab a pencil, because every page has something to do. The bits for grown ups are marked with a star, so they know where to look.',
    ],
    signoff: 'Merry Christmas, DiGi',
  },
  briefs: [
    { by: 'pebble', mood: 'happy', head: 'Pebble’s tablet takes a nap', text: 'On Christmas Day the tablet in Pebble’s house has a nap after lunch, in a basket by the door. Pebble says the basket is the comfiest place in the house.' },
    { by: 'bloop', mood: 'wave', head: 'Bloop beats the boss level', text: 'Bloop says the hardest level in any game is the moment you press save and stop. Bloop did it with a timer and a snack waiting.' },
    { by: 'orbit', mood: 'thinking', head: 'Orbit spots a fake', text: 'A message said Orbit had won a free tablet. Orbit asked a grown up first, and it was pretend. More detective work on page 9.' },
    { by: 'nova', mood: 'happy', head: 'Nova’s letters go by post', text: 'Nova wrote thank you letters by hand this year. Ten minutes each, and Grandad keeps them in a tin.' },
  ],
  facts: [
    // Neil Papworth, 3 December 1992, from a computer to an Orbitel 901 on Vodafone's network.
    'The first text message ever sent said Merry Christmas. It went from a computer to a phone on 3 December 1992.',
    // Henry Cole, London, 1843.
    'The first Christmas cards were printed in London in 1843. People still send them by post every year.',
  ],
  comic: {
    title: 'Bloop and the big box',
    panels: [
      { who: 'bloop', mood: 'happy', say: 'A new tablet! Can I play right now?' },
      { who: 'digi', say: 'Soon! First, let’s give it a name and a bed.' },
      { who: 'bloop', mood: 'thinking', say: 'A bed? For a tablet?' },
      { who: 'bloop', mood: 'wave', say: 'Night night, Tabby. See you after breakfast!', basket: true },
    ],
  },

  plan: {
    kicker: 'The Christmas morning plan',
    headline: 'Six things to do together before you press play',
    intro: 'A new screen is exciting. These six steps take about half an hour, and they make the first day a good one. Do them with your grown up, in order.',
    steps: [
      { head: 'Give it a name', text: 'Every good screen has a name. Ours is called', write: true, icon: 'tag' },
      { head: 'Choose where it sleeps', text: 'Lots of families charge screens overnight in a shared room, not in bedrooms. Pick the spot together.', icon: 'basket' },
      { head: 'Your grown up does the settings', text: 'The family settings and the passcode are a grown up job for now, like the car keys.', icon: 'key' },
      { head: 'Pick your first three apps', text: 'Start with three, chosen together. More can come later, once these are going well.', icon: 'three' },
      { head: 'Learn stop, close, tell', text: 'If something on a screen feels wrong, odd or scary: stop, close it, and tell a grown up. Telling is always the right thing to do.', icon: 'hand' },
      { head: 'Agree the three kinds of time', text: 'My time is just mine. Earned time comes from jobs. Protected time has no screens at all, like meals and bedtime.', icon: 'clock' },
    ],
    morning: [
      { draw: 'present', head: 'Unwrap and say thank you', when: 'Christmas morning' },
      { who: 'nova', mood: 'thinking', head: 'Set it up together', when: 'About half an hour' },
      { who: 'bloop', mood: 'happy', head: 'Play the first game together', when: 'Straight after' },
      { draw: 'basket', head: 'Screens nap at lunch', when: 'While the family eats' },
    ],
    grownUps: {
      title: 'For grown ups',
      text: 'The first week sets the pattern. Switch on the built in family settings before the box is handed over (Screen Time on Apple devices, Family Link on Android, the console’s own family app), keep the passcode, and play the first game with them.',
    },
  },
  idCard: {
    title: 'My new screen’s ID card',
    kinds: ['Tablet', 'Console', 'Phone', 'Laptop'],
    lines: ['Its name is', 'It sleeps in the', 'Its bedtime is', 'If something feels wrong I tell'],
    apps: 'My first three apps',
    protected: { title: 'Our protected times', items: ['Meals', 'Bedtime', 'Car journeys', 'Christmas dinner'] },
    draw: 'Draw your screen in its bed',
  },

  bigQuestion: {
    kicker: 'The big question',
    question: 'Should screens be switched off on Christmas Day?',
    intro: 'Families answer this one differently, and that is fine. Read both sides, then have a family vote.',
    yes: { by: 'nova', mood: 'thinking', head: 'Yes, switch them off', points: ['Christmas only comes once a year, and the whole family is here today.', 'Games and videos will still be there on Boxing Day.', 'Board games, walks and making things are better with everyone.'] },
    no: { by: 'cosmo', mood: 'wave', head: 'No, keep them on', points: ['A new game is part of the present. Playing it with my cousins is how we have fun together.', 'Video calls let us see family who live far away.', 'A Christmas film together is a screen too!'] },
    middle: { by: 'orbit', mood: 'happy', text: 'What if screens get their own time slot, like the Christmas film? Everyone knows when, so nobody has to ask.' },
    vote: { title: 'Family vote', options: ['Switched off', 'A time slot', 'Screens as normal'] },
    decide: 'Our family’s Christmas Day screen plan',
    tip: 'Top tip: decide it on Christmas Eve, not halfway through Christmas afternoon.',
  },

  apps: {
    kicker: 'The app desk',
    headline: 'Read the label before you download',
    intro: 'Every game and app has an age label, a bit like a film. In the UK, games show a PEGI number.',
    // PEGI ratings: 3, 7, 12, 16, 18 (pegi.info). The number is about the content, not the difficulty.
    pegi: [3, 7, 12, 16, 18],
    pegiLine: 'The number is the age the game is suitable for. It is about what is in the game, not how hard it is.',
    questions: {
      title: 'Five questions before you press download',
      items: ['What is the age label?', 'Can people I do not know talk to me in it?', 'Does it ask for money inside the game?', 'Does it want my real name, photo or where I live?', 'Have I asked my grown up?'],
    },
    // TikTok, Instagram and Snapchat terms, and WhatsApp in the UK, all set 13.
    social: 'Most social media apps say you must be 13 or older to have an account.',
    check: { title: 'Check an app', lines: ['App or game', 'Its age label'], yesno: ['Chat with strangers?', 'Money inside it?'], verdict: 'My grown up says', options: ['Yes', 'Not yet'] },
    dear: {
      title: 'Dear DiGi',
      letter: '“My friends all play a game I am not allowed yet, and I feel left out. What do I do?”',
      from: 'A question lots of children ask',
      reply: 'That feeling is real, and it is fine to say so. Tell your grown up what the game is and why you like it, then read its label together. Ask if there is a way to play it together, or a game your friends like that fits your age. A not yet can become a yes.',
    },
    ours: {
      title: 'Our app: Guided Childhood',
      text: 'Guided Childhood is the family app behind this newspaper. Your child gets their own app with no login: jobs earn stars, and stars become screen minutes. Every stage has short lessons on games, social media and AI, stamped in their Digital Passport. Grown ups get one small script for the evening’s tricky moment.',
      url: 'guidedchildhood.com',
    },
  },

  homework: {
    kicker: 'The homework helper',
    headline: 'Stuck? Climb the help ladder',
    by: 'nova',
    ladder: ['Read the question out loud, slowly.', 'Look back in your book for an example.', 'Try one small bit, even if it might be wrong.', 'Ask someone at home to listen, not to do it for you.', 'Write a note for your teacher: I got stuck on…'],
    spot: { title: 'Make a homework spot', items: ['A clear bit of table', 'A pencil, a rubber, a ruler', 'A glass of water', 'Phones parked in another room', 'A timer for a break'] },
    ai: { title: 'AI helpers and homework', text: 'Chatbots can explain things, but they can also be wrong, and your teacher wants to see your thinking. Many chatbots are for 13 and over, so only use one with a grown up, and ask it to explain, never to do it for you.' },
    // lib/homework/guide.ts: what UK school homework policies commonly publish (sampled 17 October 2026).
    table: {
      title: 'How much homework is normal?',
      rows: [['Reception', '5 to 10 minutes'], ['Years 1 and 2', '10 to 20 minutes'], ['Years 3 and 4', '15 to 25 minutes'], ['Years 5 and 6', '20 to 30 minutes'], ['Years 7 and 8', '40 to 60 minutes'], ['Years 9 to 13', '60 to 90 minutes']],
      note: 'A normal night, reading included, from what UK school homework policies commonly publish. Your school’s own policy always wins. If it is often far more, or ends in tears, the teacher is the person to tell.',
    },
    holiday: 'Over the holidays, a bedtime story still counts. Reading together is the homework that never stops.',
  },

  sites: {
    kicker: 'The good sites guide',
    headline: 'Helpful websites for growing up online',
    by: 'orbit',
    intro: 'Orbit has checked every one of these. They are free, and none of them needs an account to read.',
    kids: [
      { name: 'BBC Bitesize', url: 'bbc.co.uk/bitesize', text: 'Help with every school subject, with short videos and games.' },
      { name: 'Newsround', url: 'bbc.co.uk/newsround', text: 'Real news from around the world, written for children.' },
      { name: 'Oak National Academy', url: 'thenational.academy', text: 'Free lessons that follow what you learn at school.' },
      { name: 'National Geographic Kids', url: 'natgeokids.com/uk', text: 'Animals, science and amazing facts about our planet.' },
      { name: 'Childline', url: 'childline.org.uk', text: 'Free, private help with anything that is worrying you, online or off. Or call 0800 1111.' },
    ],
    grownUps: [
      { name: 'Internet Matters', url: 'internetmatters.org', text: 'Step by step guides to the family settings on every device.' },
      { name: 'UK Safer Internet Centre', url: 'saferinternet.org.uk', text: 'Online safety advice for families, and Safer Internet Day each February.' },
      { name: 'NSPCC', url: 'nspcc.org.uk', text: 'Online safety advice, and a helpline for any worried grown up.' },
      { name: 'Common Sense Media', url: 'commonsensemedia.org', text: 'Age reviews of films, games and apps, written by parents and experts.' },
    ],
    check: { title: 'Is it a good website?', items: ['Who made it?', 'Is it for my age?', 'Does it ask for my name or photo?', 'Did a grown up say yes?'] },
    tip: 'Orbit’s tip: type the address yourself, from this page, rather than tapping an advert or a link in a message.',
    fave: 'Our family’s favourite website',
  },

  puzzles: {
    kicker: 'Orbit’s Christmas puzzles',
    realOrPretend: {
      headline: 'Real or pretend?',
      intro: 'Three messages arrived on Christmas Eve. Circle real or pretend for each one.',
      messages: [
        { from: 'Prize Team', text: 'You have WON a free tablet! Tap the link and type your address to claim it.' },
        { from: 'Grandma', text: 'Thank you for my drawing! It is on my fridge. Love you lots.' },
        { from: 'Parcel Delivery', text: 'Your present is stuck. Pay £1.99 now to send it today.' },
      ],
      answers: ['1 is pretend: real prizes never need your address from a message.', '2 is real: Grandma, and she wants nothing from you.', '3 is pretend: ask a grown up before you ever pay for anything.'],
    },
    wordSearch: { headline: 'Christmas screen word search', words: ['TABLET', 'CHARGE', 'PAUSE', 'KIND', 'SAFE', 'ASK', 'TELL', 'SNOW', 'GAME', 'STAR'], seed: 12 },
    code: { headline: 'Crack the code', intro: 'A is 1, B is 2, C is 3, all the way to Z is 26. What do you do if something online feels wrong?', message: 'STOP CLOSE TELL' },
    maze: { headline: 'Help Tabby find its bed', seed: 7 },
  },

  make: {
    kicker: 'Make and do',
    bingo: {
      headline: 'Boxing Day bingo',
      intro: 'Tick a square each time you do one. Four in a row and you win the next pick of the board game!',
      squares: ['Build a den', 'Play a board game', 'Go for a frosty walk', 'Make a paper snowflake', 'Help make lunch', 'Read a new book', 'Video call someone far away', 'Draw for a grandparent', 'Play hide and seek', 'Do a jigsaw', 'Have a dance', 'Bake something', 'Write a thank you letter', 'Spot a robin', 'Tidy the wrapping', 'Teach someone a game'],
    },
    hanger: {
      headline: 'Make a sign for the screens’ bed',
      steps: ['Colour both sides.', 'Cut along the solid line.', 'Fold on the dotted line.', 'Stand it by the charging spot.'],
      front: 'Shh! Screens asleep',
      back: 'Awake: playing time',
    },
  },

  shop: {
    kicker: 'The shop',
    headline: 'Small ads from the Guided Childhood shop',
    intro: 'Everything here is a print at home pack, made by us and loved by the Planet Friends. Find them all in our Etsy shop.',
    sticker: 'Every pack ends with its own sticker for the Passport page it belongs to.',
    // live: false keeps a product off the page until its listing is on Etsy.
    ads: [
      { key: 'passport', name: 'The Guided Childhood Passport', ages: 'Ages 4 to 16', line: 'The fold out passport your child stamps, stage by stage, from first screen to 16.', img: 'guided-childhood-passport', live: true, feature: true },
      { key: 'star', name: 'The Star Chart', ages: 'Ages 4 and up', line: 'Jobs earn stars and stars become screen minutes. The fridge chart that makes it a deal.', img: 'star-chart', live: true },
      { key: 'earn', name: 'Earn Your Screen Time', ages: 'Ages 5 to 11', line: 'Screen tokens to cut out and ending cards, so the end of screen time is no surprise.', img: 'earn-your-screen-time', live: true },
      { key: 'phone', name: 'The Family Phone Agreement', ages: 'Ages 10 to 12', line: 'A first phone deal your child writes with you, rather than rules handed down.', img: 'family-phone-agreement', live: true },
      { key: 'calm', name: 'The Calm Down Corner Kit', ages: 'Ages 4 to 9', line: 'A calm corner sign, feelings cards and star breathing, set up together on an ordinary day.', img: 'calm-down-kit', live: true },
      { key: 'countdown', name: 'The Christmas Screen Free Countdown', ages: 'Ages 4 to 11', line: '24 doors from 1 to 24 December, one Planet Friend activity a day, and a sticker sheet.', draw: 'doors', live: false },
      { key: 'granny', name: 'Screens At Granny’s', ages: 'Christmas visits', line: 'House rules that travel: a card for the grandparents and a card for your child.', draw: 'house', live: false },
    ],
  },

  // The free taster (6 November 2026): the front page, the ID card, the
  // puzzles and a closing page. Free on guidedchildhood.com for an email,
  // never on Etsy. The page that links to Etsy is the website's, never an
  // Etsy file, so it may name the shop.
  taster: {
    frontParas: [
      'This Christmas, lots of children will unwrap a tablet, a games console or a first phone. If that is you, hooray! But here is the big news: the best bit is not the box. It is setting it up together.',
      'This is a free taster of the paper. Turn over for your new screen\u2019s ID card and Orbit\u2019s Christmas puzzles, then the Christmas morning plan on the last page.',
    ],
    planTitle: 'The Christmas morning plan',
    planKicker: 'Six things to do together',
    planIntro: 'Before a new tablet, console or phone is switched on, do these six together, in order. The full issue gives each one a page of its own.',
    fullTitle: 'Liked it? There are eight more pages',
    fullLine: 'The big question, the app desk, the homework helper, good websites, Boxing Day bingo and the page turning version for any screen.',
    whereKicker: 'The full issue',
    where: 'The Guided Times, in our Etsy shop: GuidedChildhood',
    stageTitle: 'What stage is your child?',
    stageLine: 'Three questions, no sign up, and you get the plan that fits their age: guidedchildhood.com/starter-pack',
  },

  back: {
    promise: {
      headline: 'Our Christmas screen promise',
      by: 'pebble',
      lines: ['Over Christmas, our screens sleep in the', 'Our protected times are', 'If something online feels wrong, I will', 'One screen free thing we will do together'],
    },
    colour: { title: 'Colour in Christmas', line: 'The tree, the presents and the screens tucked up in bed. Use every crayon you have.' },
    next: { kicker: 'Coming next', line: 'Issue 2, January 2027: The new year screen deal. It arrives in our Etsy shop at the end of December. Tap the heart on our shop to hear first.' },
    gift: 'A free gift from us: the Guided Childhood Starter Pack, at guidedchildhood.com/etsy-bonus',
    review: 'If your family enjoyed this issue, a short review on Etsy helps other families find us. Thank you.',
  },
}
