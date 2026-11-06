// THE PRINTABLE PASSPORT'S WORDS AND COLOURS, IN ONE PLACE.
//
// Shared by print.html, phone.html and listing/images.html so the three can
// never drift. Every value is copied from the app, which is the source of
// truth for this product:
//
//   stage names, ages, focus, script and action  lib/content/stages.ts
//   friend names, blurbs and cutouts             lib/content/stage-characters.ts
//   stage colours, burgundy, gold, paper, ink    lib/pathway/passport-print-style.ts
//   friend text inks                             brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 4
//   the four areas and their marks               shared/passport-areas.ts
//   the imposition and the fold steps            shared/zine.ts
//   the rising bars of the crest                 shared/brand.ts LOGO_BARS
//
// THE THREE PARTS OF A PAPER PASS. The app stamps a page on every lesson,
// every script and the stage check (lib/pathway/stamped.ts and
// passport-pass.ts). Paper has no lessons to count, so the printable keeps
// the two halves a family can do at the kitchen table: the stage's script
// (the talk) and its one action (the doing), and turns the check into what
// the app's check is for, the child able to say the stage's main idea back
// in their own words. Each check line is the point the stage check bank
// (lib/content/stage-quizzes.ts) asks about.
//
// Scripts are trimmed for paper, never reworded: every line below is the
// app's own sentence or a cut of it.

// THE STAGE GUIDES (Justin, 5 November 2026: "yes add guide"). One page per
// stage, printed after its stage page so a double sided print puts it on the
// back. Every line is the app's own, from lib/content/stages.ts: the device,
// the "not this" line, the parent's own phone, the six moments
// (challengeActions) and the warning signs. Trimmed for paper, and two lines
// are cut because they promise an outcome for a child ("Teens who own the
// decision stick to it", "builds independence"). The "why" lines and the
// parent quotes are left in the app on purpose: the first carry claims about
// what a rule builds, the second are testimonials.

// GO FURTHER: the packs in the shop that fit each page, and which of the
// three parts each one helps with. Justin, 5 November 2026: the Passport is
// the system, and a family can buy a pack for a page, do it, tick it and
// stick its sticker on. Only packs with `ready: true` print, and the rule is
// that a pack is on Etsy before a Passport naming it is uploaded. A brief
// pack goes live by flipping its flag and rebuilding. Names only, never a
// link or a price: Etsy does not allow a file to send a buyer to a checkout.
// The map and its reasons are in plans/2026-11-05-passport-system-plan.md.
// Say This (the script cards, plans/2026-11-05-script-cards-plan.md) is on
// every page under the talk: each level's first card is that page's script.
// The Starter Pack is not here: it is the free gift at /etsy-bonus and is
// never sold (Justin, 5 November 2026). Nor is the Star Chart: it is the
// chart inside that free pack, so a Passport buyer already has it. It is
// still sold on its own, to families who find it by search.
const pack = (name, part, ready = false) => ({ name, part, ready })
window.PASSPORT_PACKS = {
  1: [pack('Say This', 'talk'), pack('The Calm Down Corner Kit', 'talk', true), pack('Earn Your Screen Time', 'doing', true),
      pack('Screens At Granny\'s', 'talk'), pack('The Star Swap Shop', 'doing'), pack('The Personalised Star Chart', 'doing'), pack('The Christmas Screen Free Countdown', 'doing'), pack('Are We Nearly There', 'doing')],
  2: [pack('Say This', 'talk'), pack('The Family Phone Agreement', 'talk', true), pack('Earn Your Screen Time', 'doing', true),
      pack('Screens At Granny\'s', 'talk'), pack('The Star Swap Shop', 'doing'), pack('The Holiday Screen Deal', 'doing'), pack('The Christmas Screen Free Countdown', 'doing'), pack('Are We Nearly There', 'doing'), pack('The 30 Day Screen Reset Journal', 'check')],
  3: [pack('Say This', 'talk'), pack('The Family Phone Agreement', 'talk', true),
      pack('The First Phone Kit', 'talk'), pack('The Holiday Screen Deal', 'doing'), pack('The 30 Day Screen Reset Journal', 'check')],
  4: [pack('Say This', 'talk'), pack('The First Phone Kit', 'doing'), pack('The 30 Day Screen Reset Journal', 'check')],
  5: [pack('Say This', 'talk'), pack('The 30 Day Screen Reset Journal', 'check')],
}

window.PASSPORT = {
  burgundy: '#571C2A',
  burgundyGrad: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
  gold: '#EDC35F',
  pageCream: '#FFFCF3',
  pageInk: '#2A1F14',
  pageInkSoft: '#4A3B25',
  pageInkFaint: '#A08247',
  logoBars: [5, 9, 14, 8],
  areas: [
    { mark: '🛡️', name: 'Safe online' },
    { mark: '⚖️', name: 'Healthy balance' },
    { mark: '🤖', name: 'AI literate' },
    { mark: '💬', name: 'Social ready' },
  ],
  foldSteps: [
    'Fold the sheet in half the long way, so the top row meets the bottom row, and open it again.',
    'Fold it in half the short way, then fold each end back to the middle. You now have eight rectangles.',
    'Fold it in half the short way again. Cut along the middle crease from the folded edge as far as the first crease, and no further.',
    'Open it out, fold it the long way again, and push the two ends towards each other. The middle opens up. Fold it closed with the cover on the outside.',
  ],
  stages: [
    {
      n: 1, stage: 'Foundation', friend: 'Pebble', key: 'pebble', ages: '4 to 7',
      colour: '#EDC35F', ink: '#7A5A0E', soft: '#FBEED0',
      blurb: 'Full of curiosity and wonder. Every big journey starts small.',
      focus: 'First relationships with technology, before habits form',
      talkTitle: 'The First Device Conversation',
      say: 'We have a family rule about screens. When the timer goes off, screens go down. Every time, no exceptions. And then we do something together.',
      doing: 'Set up a charging station in the kitchen or hallway tonight. Devices do not sleep in bedrooms in this house.',
      doingShort: 'A charging station out of the bedrooms',
      check: 'Why the screen goes down when the timer goes, and what you do together next.',
      checkShort: 'Timer goes, screen down, then something together',
      guide: {
              "year": "Year 1 to 3",
              "device": "Shared family device with full supervision",
              "notThis": "\"Just five more minutes.\" Once you move the line, it moves every time.",
              "yourPhone": "When the timer ends their screen time, put your own phone away too. The rule is for the house, not just for them.",
              "moments": [
                      [
                              "When screens take over",
                              "Set a visual timer and agree together when screens stop. The timer is the rule, not you."
                      ],
                      [
                              "When the mood dips after",
                              "Try ten minutes of wind down between screens and the next activity. At this age, mood is often about the transition, not the screen itself."
                      ],
                      [
                              "When it is a game",
                              "Play with them for 10 minutes. Understand the game before you set any limits on it."
                      ],
                      [
                              "Staying safe online",
                              "At this age, online safety means one thing: same room, same screen. No unsupervised time."
                      ],
                      [
                              "Starting a conversation",
                              "Try tonight: \"What do you like best about that show?\" Then listen for two full minutes before saying anything."
                      ],
                      [
                              "When they ask for a phone",
                              "The answer is not yet, it is \"here is what we will build first.\" Talk about what a device earns, not what age unlocks it."
                      ]
              ],
              "signs": [
                      "Tantrums or real distress when a device is taken away",
                      "Choosing screens over play every time they have a choice",
                      "No longer interested in activities they loved before devices"
              ]
      },
    },
    {
      n: 2, stage: 'Builder', friend: 'Bloop', key: 'bloop', ages: '8 to 10',
      colour: '#2F8F6B', ink: '#3F5E1E', soft: '#E4F0D4',
      blurb: 'Creative and clever. Building skills and strong foundations.',
      focus: 'Building digital habits before the algorithm learns them',
      talkTitle: 'The Bedroom Rule',
      say: 'Where does your phone sleep at night? In our house, phones sleep in the kitchen. The bedroom is for sleep.',
      doing: 'Have the bedroom rule conversation tonight as a family decision, not a rule you impose. Where should our devices sleep?',
      doingShort: 'Decide together where devices sleep',
      check: 'Where devices sleep at night in your house, and why.',
      checkShort: 'Where devices sleep, and why',
      guide: {
              "year": "Year 3 to 6",
              "device": "Shared device moving toward a supervised personal device",
              "notThis": "\"You need to earn the right to have it in your room.\" That makes it a prize, not a family norm.",
              "yourPhone": "Charge your own phone in the kitchen overnight, next to theirs. One rule for everyone is the easiest rule to keep.",
              "moments": [
                      [
                              "When screens take over",
                              "Agree on two places in your home where screens never go: mealtimes and bedrooms. Agreed once, kept every day, no exceptions."
                      ],
                      [
                              "When the mood dips after",
                              "Note mood before and after screen time for one week. Then share what you notice as an observation, not a conclusion."
                      ],
                      [
                              "When it is a game",
                              "Ask them to teach you their favourite game. Play together for 10 minutes. Understanding before limits."
                      ],
                      [
                              "Staying safe online",
                              "The key conversation now: \"You can always come to me if something online feels weird or wrong. I will not take the device away. I will help.\""
                      ],
                      [
                              "Starting a conversation",
                              "Try this: \"What is the best thing you have seen online this week?\" Then: \"Has anything online ever made you feel bad about yourself?\""
                      ],
                      [
                              "When they ask for a phone",
                              "A feature phone, calls and texts with no apps, is a good first device at this stage. Independence without the algorithm."
                      ]
              ],
              "signs": [
                      "Using devices secretly or hiding what they watch",
                      "Starting to compare themselves to what they see online",
                      "Mood changes around device removal that feel out of proportion"
              ]
      },
    },
    {
      n: 3, stage: 'Explorer', friend: 'Orbit', key: 'orbit', ages: '11 to 12',
      colour: '#2E6F8E', ink: '#1F4E6E', soft: '#DCEBF7',
      blurb: 'Exploring bigger worlds and asking big questions.',
      focus: 'The algorithm conversation before social media',
      talkTitle: 'The Algorithm Conversation',
      say: 'Did you know your phone is learning what you like? Every video you watch, every post you pause on, it notes it. Open your feed and we will look at it together.',
      doing: 'Open their feed together tonight. No judgement, just curiosity: why do you think it showed you that? Stay for ten minutes.',
      doingShort: 'Ten curious minutes in their feed',
      check: 'How the feed learns what they like, and why a confident answer still needs checking.',
      checkShort: 'How the feed learns, and checking what sounds sure',
      guide: {
              "year": "Year 7 to 8",
              "device": "First personal device, a feature phone strongly recommended over a smartphone",
              "notThis": "\"That app is rotting your brain.\" That shuts the conversation down before it starts.",
              "yourPhone": "Say it out loud when you stop scrolling: \"I have been on that too long, I am putting it down.\" Let them see you stop, not just hear you ask them to.",
              "moments": [
                      [
                              "When screens take over",
                              "The bedroom rule is the place to start. If it is not in place yet, start there tonight."
                      ],
                      [
                              "When the mood dips after",
                              "Sit together and scroll their feed for 10 minutes. Ask what they feel, not what they think: \"Does any of this make you feel good about yourself?\""
                      ],
                      [
                              "When it is a game",
                              "Ask what they love about the game. The community, the challenge, the escape? Understanding what it gives them tells you what need it is meeting."
                      ],
                      [
                              "Staying safe online",
                              "Say this clearly: \"If anyone online ever makes you uncomfortable, or asks you to keep something secret, you tell me immediately. I will help first and ask questions later.\""
                      ],
                      [
                              "Starting a conversation",
                              "Try tonight: \"I have been reading about how algorithms work. Can I show you something? I think it is actually kind of fascinating.\""
                      ],
                      [
                              "When they ask for a phone",
                              "Before social media comes a conversation about how the algorithm works. Their response to that conversation is what readiness looks like."
                      ]
              ],
              "signs": [
                      "Mood drops noticeably after phone use",
                      "Anxiety about being left out of what is happening online",
                      "Sleep disruption, checking the phone after lights out",
                      "Withdrawal from family conversations"
              ]
      },
    },
    {
      n: 4, stage: 'Shaper', friend: 'Nova', key: 'nova', ages: '13 to 15',
      colour: '#7A5CC0', ink: '#4A2F73', soft: '#ECE3F7',
      blurb: 'Learning to make good choices and shape your path.',
      focus: 'Identity formation and digital footprint while the relationship still holds',
      talkTitle: 'When Things Go Wrong Online',
      say: 'If anything ever goes wrong online, and things do go wrong, I am the first call you make, not the last. I will not overreact. I will help.',
      doing: 'Set up a weekly ten minutes with no agenda. Not about screens, not about homework. Same day, same time, just checking in.',
      doingShort: 'A weekly ten minutes, no agenda',
      check: 'Who their first call is if something goes wrong online, and that telling you will not cost them their phone.',
      checkShort: 'Who the first call is when it goes wrong',
      guide: {
              "year": "Year 9 to 10",
              "device": "Smartphone with agreed family guidelines in place",
              "notThis": "\"If I catch you doing that, I am taking your phone.\" That closes the door before anything happens.",
              "yourPhone": "Give them the right to call you out when you are on your phone at the table. It is the same right you are asking for.",
              "moments": [
                      [
                              "When screens take over",
                              "Shift the frame from time to what it does for them, and start with the good: \"What are the best bits of your phone at the moment?\" Listen properly."
                      ],
                      [
                              "When the mood dips after",
                              "Try: \"I have noticed your mood sometimes changes after being on your phone. Have you noticed that?\" Leave space for silence. Do not fill it."
                      ],
                      [
                              "When it is a game",
                              "Ask about the people they play with online. Gaming at this age is usually social. The game is the venue, not the point."
                      ],
                      [
                              "Staying safe online",
                              "Make sure the open door is open: \"If anything ever makes you uncomfortable online, I am the first call, not the last. I will not take your phone away. I will help.\""
                      ],
                      [
                              "Starting a conversation",
                              "Ask about one thing they have been into online this week. Not a test, genuine curiosity. Then ask one more question."
                      ],
                      [
                              "Family phone rules",
                              "If guidelines are still the conversation: agreed as a family, not imposed by you."
                      ]
              ],
              "signs": [
                      "Secretive phone use or panic if you pick up the device",
                      "Extreme mood swings tied to online interactions",
                      "Online relationships that feel more real than offline ones",
                      "Withdrawal from activities they previously enjoyed"
              ]
      },
    },
    {
      n: 5, stage: 'Independent', friend: 'Cosmo', key: 'cosmo', ages: '16 and up',
      colour: '#D4600A', ink: '#8F4A12', soft: '#FBE4D0',
      blurb: 'Confident and independent. Ready to lead your own future.',
      focus: 'Building genuine digital independence before they leave home',
      talkTitle: 'Building Independence',
      say: 'You are at the age where you get to decide what kind of digital life you build. What does your online presence say about who you are? Not to me. To the world.',
      doing: 'A joint digital audit: go through their online presence together as peers. What does it say? What would they change?',
      doingShort: 'A digital audit together, as peers',
      check: 'What their phone gives them and what it costs them, in their own words.',
      checkShort: 'What their phone gives, and what it costs',
      guide: {
              "year": "Year 11 and above",
              "device": "Full smartphone, the conversation has shifted to digital literacy",
              "notThis": "\"Get off your phone.\" That conversation is over. A different one has started.",
              "yourPhone": "Be honest about your own phone: what it gives you, and what it costs you. It is the conversation you are hoping they will have with themselves.",
              "moments": [
                      [
                              "When screens take over",
                              "Start with what they enjoy: \"What are the best things you get from your phone?\" Then your side, as a worry rather than a verdict: \"I worry it has become a habit. What do you think?\""
                      ],
                      [
                              "When the mood dips after",
                              "Try: \"I have noticed you seem different after being on your phone. How does it leave you feeling?\" Then ask about the rest of their week, school and friends."
                      ],
                      [
                              "When it is a game",
                              "At 16, gaming can be a career interest, a creative outlet or a core social life. Engage with it seriously. Ask what they get from it."
                      ],
                      [
                              "Staying safe online",
                              "Sextortion, deepfakes and AI generated content are real at this age. Have a specific, calm conversation about what to do if anything goes wrong."
                      ],
                      [
                              "Starting a conversation",
                              "Ask them to show you one thing online they think you should know about. Then listen without judgement for five minutes."
                      ],
                      [
                              "Growing independence",
                              "The conversation is about upgrading the relationship, not unlocking a device. What does responsible independence look like for someone nearly an adult?"
                      ]
              ],
              "signs": [
                      "Measuring their worth through likes, followers or metrics",
                      "Struggling to be fully present in real life situations",
                      "Significant anxiety when without phone access",
                      "No meaningful offline friendships or activities"
              ]
      },
    },
  ],
}
