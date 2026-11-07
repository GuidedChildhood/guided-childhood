// THE GUIDED TIMES, Issue 2: the new year edition, January 2027.
// Theme: the new year screen deal. The first issue with the design upgrades
// from the 6 November 2026 research (design: 2): one big cover picture and a
// short headline, section tabs, the monthly challenge and certificate, the
// pull out poster (2 of 12), the homework planner, the jokes corner, and the
// comic carried on from Issue 1.
//
// Same rules as Issue 1: UK English, no dashes, no outcome or medical claims,
// no prices, no QR, no "subscribe". Facts stated as facts were checked on
// 6 November 2026, with the source beside each.
window.ISSUE = {
  design: 2,
  number: 2,
  month: 'January 2027',
  edition: 'New year edition',
  theme: 'The new year screen deal',
  ages: 'Ages 6 to 11, with a grown up nearby',
  nextIssue: { number: 3, month: 'February 2027', title: 'The Safer Internet Day special' },
  shopUrl: 'etsy.com/shop/GuidedChildhood',
  bonusUrl: 'guidedchildhood.com/etsy-bonus',
  pages: ['cover2', 'editor', 'plan', 'challenge', 'bigQuestion', 'appDesk', 'poster', 'planner', 'sites', 'puzzles', 'make', 'back2'],
  labels: {
    scene: 'newyear',
    ornament: 'star',
    featureNote: 'The big feature · page 3',
    questionNote: 'Read both sides, then vote',
    appsNote: 'Family settings, made simple',
    homeworkNote: 'Back to school after the holidays',
    sitesNote: 'Checked by Orbit',
    makeNote: 'Screen free fun for winter weekends',
  },

  front: {
    kicker: 'Front page news',
    headline: 'New Year, New Deal!',
    standfirst: 'The Planet Friends are writing screen deals with their families this month. Here is how yours can too.',
    burst: 'Happy New Year!',
    burstColour: '#C8483A',
    paras: [
      'A screen deal is a short list your whole family agrees: when screens are on, where they sleep, and what happens when time is up. No arguing every night, because the deal already says.',
      'Turn to page 3 to write yours in six steps, then pin it up with the poster in the middle of this paper. Your grown up gets a star bit too.',
    ],
    // The name of January: Janus, the Roman god of beginnings, shown with two faces (Britannica, "Janus").
    wow: { title: 'Wow fact', text: 'January is named after Janus, a Roman god with two faces: one looks back at the old year and one looks forward to the new.' },
    inThis: [[3, 'Write your screen deal', 'target'], [4, 'Seven phone free dinners', 'heart'], [5, 'The big question', 'chat'], [7, 'Pull out poster', 'calendar'], [10, 'Puzzles and jokes', 'book']],
  },

  editor: {
    hello: 'Happy New Year, and welcome to Issue 2!',
    paras: [
      'This month is all about fresh starts. The Planet Friends are writing screen deals with their families: short, fair lists that everyone agrees. Yours can too, with the poster in the middle of this paper.',
      'There is a challenge to try, a big question to vote on, and puzzles and jokes at the back. The bits for grown ups are marked with a star.',
    ],
    signoff: 'Happy New Year, DiGi',
  },
  briefs: [
    { by: 'pebble', mood: 'happy', head: 'Pebble’s family counts birds', text: 'Pebble’s family spent one hour by the window counting garden birds. Pebble saw a robin and drew it for the fridge.' },
    { by: 'bloop', mood: 'wave', head: 'Bloop’s tablet gets a parking spot', text: 'Bloop made a sign for the kitchen shelf where the tablet sleeps. Make your own sign on page 11.' },
    { by: 'orbit', mood: 'thinking', head: 'Orbit’s password rule', text: 'Orbit’s grown up says a password is like a toothbrush: you never share it. Orbit agrees, and keeps it secret.' },
    { by: 'cosmo', mood: 'happy', head: 'Cosmo tries phone free dinners', text: 'Cosmo parked a phone for a whole week of dinners. Cosmo says the best bit was the silly table talk. Try it on page 4.' },
  ],
  facts: [
    // The RSPB: the Big Garden Birdwatch began in 1979 and runs each January.
    'The RSPB’s Big Garden Birdwatch began in 1979. Every January, families count the birds they see in one hour.',
    // CERN: the first website, info.cern.ch, went online in 1991 and can still be visited.
    'The first website ever went online in 1991. You can still visit it today.',
  ],
  comic: {
    title: 'Tabby goes back to school',
    part: 'The comic strip, part 2',
    next: 'To be continued',
    panels: [
      { who: 'bloop', mood: 'happy', say: 'School tomorrow! Can Tabby come too?' },
      { who: 'digi', say: 'Tabby stays home. School is for learning with friends.' },
      { who: 'bloop', mood: 'thinking', say: 'But what will Tabby do all day?' },
      { who: 'bloop', mood: 'wave', say: 'Have a good nap, Tabby. See you after homework!', basket: true },
    ],
  },

  plan: {
    kicker: 'The big feature',
    headline: 'Write your family’s screen deal',
    intro: 'A screen deal is a short list your whole family agrees. Write it together in the first week of January, then pin it up on the poster on page 7.',
    steps: [
      { head: 'Look back at Christmas', text: 'What went well with screens, and what was tricky? Everyone says one of each.', icon: 'calendar' },
      { head: 'Choose protected times', text: 'Times with no screens at all, for everyone. Meals and bedtime are good ones to start with.', icon: 'lock' },
      { head: 'Agree earned time', text: 'Which jobs earn stars, and how many minutes a star is worth in your house.', icon: 'target' },
      { head: 'Pick where screens sleep', text: 'One spot in a shared room where every screen charges overnight.', icon: 'basket' },
      { head: 'Plan the stop', text: 'Decide together what happens when time is up, so it is never a surprise.', icon: 'clock' },
      { head: 'Sign it and pin it up', text: 'Everyone signs the poster on page 7. Check it again at half term.', icon: 'tag' },
    ],
    morning: [
      { draw: 'calendar', head: 'Pick a calm evening', when: 'The first week of January' },
      { who: 'nova', mood: 'thinking', head: 'Talk it through', when: 'About twenty minutes' },
      { who: 'bloop', mood: 'happy', head: 'Write it on the poster', when: 'Page 7' },
      { draw: 'clock', head: 'Check it at half term', when: 'In February' },
    ],
    grownUps: {
      title: 'For grown ups',
      text: 'Keep it short, and use your child’s words where you can. Ask what they think is fair before you say what you think. If a line is not working, change it together at half term, never in the middle of a row.',
    },
  },

  challenge: {
    section: 'The challenge',
    kicker: 'This month’s challenge',
    note: 'One tick for every phone free dinner',
    headline: 'Seven phone free dinners',
    intro: 'For one week, every phone and tablet sleeps in its spot while the family eats. Grown ups too! Write everyone’s name, then tick each dinner you do.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rule: 'The rule: phones stay parked from the first bite to the last plate cleared. A missed night is fine. Just carry on.',
    ideasTitle: 'Table talk',
    ideas: ['What was the best bit of your day, and the trickiest?', 'If you could have any job for one day, what would it be?', 'What should we do together this weekend?'],
    certificate: {
      kicker: 'This certificate says that',
      title: 'Phone Free Dinner Champions',
      line: 'had seven dinners with phones parked and talking on the table.',
    },
  },

  bigQuestion: {
    kicker: 'The big question',
    question: 'Should grown ups have screen rules too?',
    intro: 'Families answer this one differently, and that is fine. Read both sides, then have a family vote.',
    yes: { by: 'nova', mood: 'thinking', head: 'Yes, rules for everyone', points: ['If phones are parked at dinner, every phone should be parked.', 'Grown ups get busy on screens too.', 'It feels fair when the deal is the same for everyone.'] },
    no: { by: 'cosmo', mood: 'wave', head: 'No, grown ups are different', points: ['Grown ups use phones for work, for paying for things and for keeping in touch.', 'Some calls really cannot wait.', 'Grown ups can be needed by family at any time.'] },
    middle: { by: 'orbit', mood: 'happy', text: 'What if the deal has one line for everyone, like phones parked at dinner, and a few lines just for kids?' },
    vote: { title: 'Family vote', options: ['Rules for everyone', 'Some rules for everyone', 'Rules just for kids'] },
    decide: 'The line our whole family will keep',
    tip: 'Top tip: grown ups, try parking your phone first.',
  },

  apps: {
    kicker: 'The app desk',
    headline: 'Five settings to look at together',
    intro: 'Most tablets, phones and consoles have a family settings page. Sit down with your grown up and look at these five together.',
    cards: [['clock', 'Time limits'], ['chat', 'Who can chat'], ['lock', 'Buying inside apps'], ['shield', 'Age limits on downloads'], ['moon', 'Bedtime for the screen']],
    questions: {
      title: 'Ask these while you look',
      items: ['Which settings are on already?', 'How long can I play each day?', 'Who can send me messages?', 'What happens if I tap buy?', 'When does the screen go to sleep?'],
    },
    social: 'Most social media apps say you must be 13 or older to have an account.',
    check: { title: 'Check an app', lines: ['App or game', 'Its age label'], yesno: ['Chat with strangers?', 'Money inside it?'], verdict: 'My grown up says', options: ['Yes', 'Not yet'] },
    dear: {
      title: 'Dear DiGi',
      letter: '“My tablet says time is up right in the middle of a level. It is not fair!”',
      from: 'A question lots of children ask',
      reply: 'That one is tricky. Before you start, agree with your grown up that you stop at the end of a level, not on the clock. Then the save point is the finish, and you know what comes next.',
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
    collect: 'Poster 2 of 12',
    title: 'Our New Year Screen Deal',
    sub: 'Fill it in together, sign it, and pin it where everyone can see it.',
    kinds: [
      { icon: 'heart', title: 'My time', text: 'Minutes just for me each day' },
      { icon: 'target', title: 'Earned time', text: 'Jobs that earn stars' },
      { icon: 'lock', title: 'Protected time', text: 'No screens at all' },
    ],
    lines: ['Our screens sleep in the', 'When time is up, we', 'If something online feels wrong, I tell', 'We will check this deal on'],
    signTitle: 'Signed by everyone in our house',
    foot: 'A deal you all wrote is one you can all explain.',
    friends: [['pebble', 'wave'], ['cosmo', 'happy']],
  },

  homework: {
    kicker: 'The homework helper',
    headline: 'Back to school: plan the week',
    intro: 'Write what is due each day and roughly how long it should take, then tick it when it is done.',
    by: 'nova',
    columns: ['Homework', 'Minutes', 'Done'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    reading: { title: 'Reading nights', line: 'Colour a square for every night you read. Five minutes counts.' },
    ladderTitle: 'Stuck? The help ladder',
    ladder: ['Read it out loud', 'Look for an example', 'Try one small bit', 'Ask someone to listen', 'Write a note for your teacher'],
    grownUps: 'Homework and play can share a tablet, but not at the same time: close the games before the homework opens. And your school’s own homework policy always wins.',
  },

  sites: {
    kicker: 'The good sites guide',
    headline: 'New year, new hobby',
    by: 'orbit',
    intro: 'Orbit has checked every one of these. They are free, and you can try each one without an account.',
    kids: [
      // RSPB: the count runs over a weekend at the end of January (rspb.org.uk, checked 6 November 2026).
      { name: 'Big Garden Birdwatch', url: 'rspb.org.uk', text: 'Count the birds in your garden or park for one hour at the end of January.' },
      { name: 'Words for Life', url: 'wordsforlife.org.uk', text: 'Stories, rhymes and reading games from the National Literacy Trust.' },
      { name: 'Scratch', url: 'scratch.mit.edu', text: 'Make your own games and animations with blocks of code. Try it without an account.' },
      { name: 'BBC Bitesize', url: 'bbc.co.uk/bitesize', text: 'Help with every school subject, with short videos and games.' },
      { name: 'Newsround', url: 'bbc.co.uk/newsround', text: 'Real news from around the world, written for children.' },
    ],
    grownUps: [
      { name: 'Childnet', url: 'childnet.com', text: 'Advice and conversation starters for talking with children about life online.' },
      { name: 'Parent Zone', url: 'parentzone.org.uk', text: 'Guides for parents on the apps and games children use.' },
      { name: 'Internet Matters', url: 'internetmatters.org', text: 'Step by step guides to the family settings on every device.' },
      { name: 'NSPCC', url: 'nspcc.org.uk', text: 'Online safety advice, and a helpline for any worried grown up.' },
    ],
    check: { title: 'Is it a good website?', items: ['Who made it?', 'Is it for my age?', 'Does it ask for my name or photo?', 'Did a grown up say yes?'] },
    tip: 'Orbit’s tip: when you find a good site, ask your grown up to save it, so you can find it again without searching.',
    fave: 'Our family’s new hobby',
  },

  puzzles: {
    kicker: 'Orbit’s new year puzzles',
    realOrPretend: {
      headline: 'Real or pretend?',
      intro: 'Three messages arrived on New Year’s Day. Circle real or pretend for each one.',
      messages: [
        { from: 'Game Rewards', text: 'Get 1,000 free coins! Just type your password here.' },
        { from: 'Grandad', text: 'Happy New Year! Shall we count birds together this weekend?' },
        { from: 'Account Team', text: 'Your account closes TODAY unless you tap this link now.' },
      ],
      answers: ['1 is pretend: nobody real ever needs your password.', '2 is real: Grandad, with a lovely plan.', '3 is pretend: a scary rush is a trick. Ask a grown up first.'],
    },
    wordSearch: { headline: 'New year word search', words: ['DEAL', 'YEAR', 'GOALS', 'BIRDS', 'STARS', 'BOOKS', 'CALM', 'PLAN', 'KIND', 'TIME'], seed: 21 },
    code: { headline: 'Crack the code', intro: 'A is 1, B is 2, C is 3, all the way to Z is 26. What should your family do this month?', message: 'MAKE A DEAL', answer: 'The code says: make a deal. Write yours on the poster on page 7.' },
    maze: { headline: 'Help Tabby find its parking spot', seed: 15 },
  },

  make: {
    kicker: 'Make and do',
    bingo: {
      headline: 'Winter weekend bingo',
      intro: 'Tick a square each time you do one. Four in a row and you choose the next family film!',
      squares: ['Feed the birds', 'Build a blanket fort', 'Bake something', 'Play a card game', 'Write a story', 'Go puddle jumping', 'Make paper snowflakes', 'Help cook tea', 'Do a jigsaw', 'Read under a blanket', 'Draw a map of your street', 'Have a dance', 'Learn a magic trick', 'Call a grandparent', 'Tidy one drawer', 'Make up a game'],
    },
    hanger: {
      headline: 'Make a sign for the phone parking spot',
      steps: ['Colour both sides.', 'Cut along the solid line.', 'Fold on the dotted line.', 'Stand it where phones sleep.'],
      front: 'Phones parked',
      back: 'Family time, back soon',
    },
    jokes: {
      title: 'DiGi’s joke corner (answers upside down)',
      items: [
        ['Why did the computer go to the doctor?', 'It had a virus!'],
        ['Why did the phone wear glasses?', 'It lost all its contacts!'],
        ['Why did the robot go on holiday?', 'To recharge its batteries!'],
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
      { key: 'issue1', name: 'The Guided Times, Issue 1', ages: 'Back issue', draw: 'present', live: true },
    ],
  },

  back: {
    next: { kicker: 'Coming next', line: 'Issue 3, February 2027: the Safer Internet Day special. In our Etsy shop at the end of January. Tap the heart on our shop to hear first.' },
    gift: 'A free gift from us: the Guided Childhood Starter Pack, at guidedchildhood.com/etsy-bonus',
    review: 'If your family enjoyed this issue, a short review on Etsy helps other families find us. Thank you.',
  },
}
