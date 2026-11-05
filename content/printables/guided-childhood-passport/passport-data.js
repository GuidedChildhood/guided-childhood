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
// never sold (Justin, 5 November 2026).
const pack = (name, part, ready = false) => ({ name, part, ready })
window.PASSPORT_PACKS = {
  1: [pack('Say This', 'talk'), pack('The Calm Down Corner Kit', 'talk', true), pack('The Star Chart', 'doing', true), pack('Earn Your Screen Time', 'doing', true),
      pack('Screens At Granny\'s', 'talk'), pack('The Personalised Star Chart', 'doing'), pack('The Christmas Screen Free Countdown', 'doing'), pack('Are We Nearly There', 'doing')],
  2: [pack('Say This', 'talk'), pack('The Family Phone Agreement', 'talk', true), pack('Earn Your Screen Time', 'doing', true),
      pack('Screens At Granny\'s', 'talk'), pack('The Holiday Screen Deal', 'doing'), pack('The Christmas Screen Free Countdown', 'doing'), pack('Are We Nearly There', 'doing'), pack('The 30 Day Screen Reset Journal', 'check')],
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
    },
  ],
}
