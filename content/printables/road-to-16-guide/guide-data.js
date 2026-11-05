// THE ROAD TO 16 GUIDE'S WORDS, IN ONE PLACE.
//
// The free reward for a Guided Childhood Passport stamped up to the child's age
// (Justin, 5 November 2026: first all five pages, changed the same day to every
// page up to the child's age), claimed at /etsy-bonus. print.html lays these out and build-guide.mjs
// writes them to guide-text.md as plain text, which is the file the evidence
// check and `npm run ai-tells` read. So a word changed here is a word checked.
//
// WHERE EVERY LINE COMES FROM. Nothing on these pages is new advice. Each
// block is the app's own content, trimmed for paper:
//
//   stage names, ages, device, focus, scripts,     lib/content/stages.ts
//     warning signs, your phone, the 16 check
//   platform settings, watch fors, the stage       supabase/migrations/093_social_platform_guides.sql
//     each one is brought up at                      (the social_platform_guides table)
//   the school moments and their responses         lib/content/device-issues.ts (first_phone,
//                                                    class_group_chat, social_media_request,
//                                                    sextortion, night_phone, notifications_study)
//   the three kinds of time, the ladder            THE-STORY.md section 3, commitment 4
//   the minimum age line                           app/(dashboard)/dashboard/social-settings/page.tsx
//
// THE FACTS FROM OUTSIDE (platform minimum ages, Ofcom's figures, the law and
// the help lines) are each in `sources` at the foot, with the page they were
// read from and the date. Platform ages come from each platform's own terms,
// never from a news story. evidence-check.md holds the red team's verdict.
//
// No outcome or medical claims about a child: the pages say what a family
// does, never what it will do to the child. No dashes anywhere.

const S = (n, friend, key, ages, colour, ink, soft) => ({ n, friend, key, ages, colour, ink, soft })

window.GUIDE = {
  burgundy: '#571C2A',
  gold: '#EDC35F',
  logoBars: [5, 9, 14, 8],

  // The five stages, with colours from lib/pathway/passport-print-style.ts as
  // the Passport printable uses them.
  stages: [
    { ...S(1, 'Pebble', 'pebble', '4 to 7', '#EDC35F', '#7A5A0E', '#FBEED0'), stage: 'Foundation',
      device: 'A shared family device, with you in the room',
      focus: 'First relationships with technology, before habits form',
      talk: 'The First Device Conversation',
      signs: ['Tantrums or real distress when a device is taken away', 'Choosing screens over play every time they have a choice', 'No longer interested in activities they loved before devices'],
      yourPhone: 'When the timer ends their screen time, put your own phone away too. The rule is for the house.' },
    { ...S(2, 'Bloop', 'bloop', '8 to 10', '#2F8F6B', '#3F5E1E', '#E4F0D4'), stage: 'Builder',
      device: 'A shared device, moving toward a supervised one of their own',
      focus: 'Building digital habits before the algorithm learns them',
      talk: 'The Bedroom Rule',
      signs: ['Using devices secretly or hiding what they watch', 'Starting to compare themselves to what they see online', 'Mood changes around device removal that feel out of proportion'],
      yourPhone: 'Charge your own phone in the kitchen overnight, next to theirs. One rule for everyone is the easiest rule to keep.' },
    { ...S(3, 'Orbit', 'orbit', '11 to 12', '#2E6F8E', '#1F4E6E', '#DCEBF7'), stage: 'Explorer',
      device: 'A first device of their own, ideally a phone for calls and texts before a smartphone',
      focus: 'The algorithm conversation, before social media',
      talk: 'The Algorithm Conversation',
      signs: ['Mood drops noticeably after phone use', 'Worry about being left out of what is happening online', 'Checking the phone after lights out', 'Withdrawal from family conversations'],
      yourPhone: 'Say it out loud when you stop scrolling: "I have been on that too long, I am putting it down."' },
    { ...S(4, 'Nova', 'nova', '13 to 15', '#7A5CC0', '#4A2F73', '#ECE3F7'), stage: 'Shaper',
      device: 'A smartphone, with family guidelines you agreed together',
      focus: 'Identity and digital footprint, while the relationship still holds',
      talk: 'When Things Go Wrong Online',
      signs: ['Secretive phone use, or panic if you pick up the device', 'Big mood swings tied to things that happen online', 'Online relationships that feel more real than offline ones', 'Dropping activities they used to enjoy'],
      yourPhone: 'Give them the right to call you out when you are on your phone at the table. It is the same right you are asking for.' },
    { ...S(5, 'Cosmo', 'cosmo', '16 and up', '#D4600A', '#8F4A12', '#FBE4D0'), stage: 'Independent',
      device: 'Their own smartphone. The talk is now about digital literacy',
      focus: 'Real digital independence, before they leave home',
      talk: 'Building Independence',
      signs: ['Measuring their worth through likes, followers or numbers', 'Struggling to be present in real life situations', 'Real distress when they are without their phone', 'No offline friendships or activities that matter to them'],
      yourPhone: 'Be honest about your own phone: what it gives you, and what it costs you.' },
  ],

  // ── PAGE 2 · CAUGHT UP TO YOUR CHILD'S AGE ─────────────────────────────────
  welcome: {
    eyebrow: 'Stamped up to your child\'s age',
    title: 'Your Passport is up to date',
    lines: [
      'Every page up to your child\'s age has its talk, its doing and its check, all of them done at your own kitchen table. That took time, and it is yours now.',
      'This guide is the map for the whole road, from the first tablet to the phone they carry out of the door at sixteen. Read the part your child is in now. Keep the rest where you will find it again: the stages ahead come round as they grow, and the ones behind are there for any brother or sister coming up.',
    ],
    parts: [
      ['Balance', 'Three kinds of time, and the one rule that never moves.'],
      ['Behaviour', 'What to watch for at each stage, and what to say when you see it.'],
      ['The apps', 'Each app\'s own minimum age, the setting to lock first, and what to watch for.'],
      ['School', 'The moments that bring the pressure, from the game the whole class plays to Year 11.'],
    ],
    holdOnto: 'One thing to hold onto. The minimum age on each app is the company\'s own account rule. It is not a sign a child is ready. Readiness is your child, the settings you lock together, and the talks you have already had.',
  },

  // ── PAGE 4 · BALANCE ───────────────────────────────────────────────────
  balance: {
    eyebrow: 'Part one',
    title: 'Balance: three kinds of time',
    intro: 'A screen time fight is often really about who decides. Splitting the day into three kinds of time settles that before anyone is upset.',
    kinds: [
      ['Their time', 'A small amount every day that is simply theirs. You set it, they do not earn it, and it is never taken away as a punishment. That keeps the screen from becoming the biggest prize in the house.'],
      ['Earned time', 'Extra time comes from jobs and chores. One star is five minutes to start with, and you can change the rate. Family jobs like laying the table sit outside the deal, because helping at home is part of belonging.'],
      ['Protected time', 'Sleep, meals and school hours. No amount of stars buys these. If they want a screen inside protected time, they ask you, and you decide it together.'],
    ],
    firstTitle: 'Protect these first',
    first: 'Start with what screens can crowd out of a day: sleep, moving about, playing, and being bored long enough to think of something. Look after those, then decide the rest.',
    ruleTitle: 'The one rule that never moves',
    rule: 'Devices sleep outside bedrooms. Set up a charging station in the kitchen or the hallway, start it before the first phone arrives, and it is simply where phones live rather than something taken away later.',
    ladderTitle: 'Where it is heading',
    ladder: 'You decide, then you decide together, then they decide for themselves. The aim all along is that by sixteen they do not need the system at all.',
    phoneTitle: 'Your phone too, stage by stage',
  },

  // ── PAGE 5 · BEHAVIOUR ─────────────────────────────────────────────────
  behaviour: {
    eyebrow: 'Part two',
    title: 'Behaviour: what to watch for',
    intro: 'These are the signs the app names at each stage. One on its own may just be a bad week, and many of them can come from school, friends or sleep as much as from a screen. A sign that keeps coming back, or a few together, is worth a calm talk. None of them is a diagnosis.',
    whenTitle: 'When you notice one',
    when: [
      'Write down what you see for a week, before and after screens. Share it as something you noticed, not a conclusion.',
      'Then ask: "I have noticed your mood sometimes changes after being on your phone. Have you noticed that?" Leave space for the silence. Do not fill it.',
    ],
    notThis: '"That app is rotting your brain." That shuts the conversation down before it starts.',
    worried: 'If you are worried about your child\'s health or safety, talk to their GP or their school. If anyone is in danger now, call 999.',
  },

  // ── PAGES 6 AND 7 · THE APPS ───────────────────────────────────────────
  // From migration 093 (the app's social_platform_guides rows): the stage each
  // one is brought up at, the setting to lock first and the watch for. The
  // minimum age and its rule are from each platform's own terms, in sources.
  apps: {
    eyebrow: 'Part three',
    title: 'The apps, and when they turn up',
    intro: 'Each app sets its own minimum age in its terms, and most say 13. Ofcom found 90% of 8 to 12 year olds say they use at least one service with a minimum age of 13, led by YouTube, which under 13s can use through a parent\'s supervised account. About a third of parents know the usual age is 13. Each card names the Passport page where the Guided Childhood app brings that app up, so you are ready before your child asks.',
    lawNote: 'Ages read from each app\'s own terms in November 2026. Terms and laws change. The UK government expects to restrict social media for under 16s from spring 2027, and for 16 and 17 year olds to have social media switched off between midnight and 6am by default, a setting they can change. Whatever the law does, the talks still matter, because a deadline is not a plan.',
    list: [
      { name: 'YouTube', emoji: '📺', age: '13', stage: 2,
        rule: 'Younger children can use it when a parent turns it on: YouTube Kids, or a supervised account, which you can set up in Google Family Link.',
        lock: 'Set it up through Google Family Link and choose the content setting that fits their age, then set a daily time limit on the Shorts feed.',
        watch: 'The Shorts feed, which scrolls on with no natural end, so set its limit first.' },
      { name: 'Roblox', emoji: '🧩', age: '5', stage: 2,
        rule: 'Accounts from age 5, with some features only a parent can turn on. Chat needs an age check first.',
        lock: 'Set a Parental PIN so settings cannot be changed, then a monthly spending limit.',
        watch: 'Chat inside games, user made games with adult content, and free Robux scams.' },
      { name: 'WhatsApp', emoji: '💬', age: '13', stage: 3,
        rule: 'A standard account has no parental dashboard, so this one is managed with settings and conversation. WhatsApp is rolling out parent managed accounts for under 13s, which may not have reached the UK yet.',
        lock: 'Settings, Privacy, Groups, set to My contacts, so strangers cannot add them to a group.',
        watch: 'Being added to big groups by unknown numbers, and disappearing messages.' },
      { name: 'Instagram', emoji: '📸', age: '13', stage: 3,
        rule: 'Teen Accounts are private by default, with the strictest messaging settings, and under 16s need a parent\'s permission to make them less strict.',
        lock: 'Check the Teen Account defaults are still on: messages only from people they follow, and Sleep mode overnight.',
        watch: 'A false birthday can stop the teen protections switching on, so check it is real.' },
      { name: 'TikTok', emoji: '🎵', age: '13', stage: 3,
        rule: 'Direct messages are off for under 16s.',
        lock: 'Link Family Pairing from your own phone, then set daily screen time and the content filters.',
        watch: 'How fast the For You feed narrows to one kind of video.' },
      { name: 'Snapchat', emoji: '👻', age: '13', stage: 3,
        rule: 'Family Center shows who they are friends with and have messaged, but not what was said.',
        lock: 'Snap Map to Ghost Mode, so their location is hidden from everyone.',
        watch: 'Quick Add suggesting them to friends of friends they have never met, and the passcode folder called My Eyes Only.' },
      { name: 'Facebook and Messenger', emoji: '👍', age: '13', stage: 4,
        rule: 'Meta Family Center covers Facebook and Messenger, for time spent and who they are in touch with.',
        lock: 'Who can message them set to friends, and location for Messenger turned off in the phone\'s own settings.',
        watch: 'Message and friend requests from adults they do not know.' },
      { name: 'Discord', emoji: '🎮', age: '13', stage: 4,
        rule: 'Family Center shows servers joined, friends added and who they message or call, but not what they write or say.',
        lock: 'Filter explicit images in all direct messages, and send non friend messages to a separate inbox.',
        watch: 'Messages from strangers in public servers, and voice channels nobody watches.' },
    ],
  },

  // ── PAGE 8 · SCHOOL ────────────────────────────────────────────────────
  // School years in England. Responses from lib/content/device-issues.ts.
  school: {
    eyebrow: 'Part four',
    title: 'The school moments',
    intro: 'The pressure tends to arrive with the school year, not the birthday. Here are the moments to be ready for, and what to have in place before each one.',
    moments: [
      { years: 'Years 3 to 5', ages: '7 to 10', stage: 2, title: 'The game the whole class plays',
        body: 'Games like Roblox are a place to meet friends as well as a game, with chat and spending inside. Ask them to teach you their favourite and play together for ten minutes before you set any limit on it.',
        ready: 'A Parental PIN and a spending limit.' },
      { years: 'Year 6', ages: '10 to 11', stage: 2, title: 'The phone ask',
        body: 'The walk to school alone and the move to secondary bring the ask, and Ofcom says the key age for owning a phone seems to be around that move. Write the phone plan in Year 5, while it is still a plan: what the phone is for, where it charges at night, and the promise that telling you about a problem will never cost them the phone.',
        fact: 'Ofcom found phone ownership rises from 56% of 10 year olds to 83% of 11 year olds.',
        ready: 'The phone plan, written together. A phone for calls and texts with no apps gives independence without the feed.' },
      { years: 'Year 7', ages: '11 to 12', stage: 3, title: 'The group chats',
        body: 'A new school means new class and club groups, and some of them keep going late into the night. Teach group chat skills before the first group: how to leave a chat that turns nasty, and that a screenshot of anything upsetting comes to you and costs them nothing. The one exception is a nude or sexual picture of anyone under 18: they never screenshot it or send it on, they just tell you.',
        fact: 'WhatsApp\'s own minimum age in the UK is 13, so a child in Year 7 is almost always younger than that. Ofcom found 52% of 8 to 12 year olds say they use it, and around two thirds of 8 to 17 year olds had been added or invited to a group chat in the past four weeks.',
        ready: 'Groups set to My contacts, and the phone charging outside the bedroom.' },
      { years: 'Years 8 and 9', ages: '12 to 14', stage: 3, title: 'The thirteenth birthday',
        body: 'Most of the big apps set 13 as their minimum, so the birthday brings the ask for TikTok, Snapchat and Instagram. Meet it with a readiness check instead of a yes or a no: have you had the algorithm talk, will you set the settings up together, and do they know you are their first call?',
        ready: 'The Orbit page done, and the settings on pages 6 and 7 locked side by side.' },
      { years: 'Years 9 and 10', ages: '13 to 15', stage: 4, title: 'Photos and pressure',
        body: 'Being asked for a photo, or a photo being shared around, is a talk to have before it happens. If anyone threatens to share an image of them or demands money: do not pay, do not delete anything, help them stop replying and block the account, and report it to CEOP or to the police on 101, or 999 if they are in danger now. Tell them out loud that they are not to blame and not in trouble.',
        ready: 'The first call promise from the Nova page, said again.' },
      { years: 'Year 11', ages: '15 to 16', stage: 4, title: 'Exams and revision',
        body: 'Revision with a buzzing phone is hard for anyone. Notifications off for the revision window, the phone in another room, and the exam weeks named as protected time in your family agreement.',
        ready: 'Protected school hours and a homework window from the first phone.' },
    ],
    schoolPolicy: 'Since September 2026, statutory guidance asks schools in England to keep phones out of use all school day, breaks and lunch included, with exceptions such as a medical need. Ask for your school\'s own policy, and make yours at home match it.',
  },

  // ── PAGE 9 · WHEN SOMETHING GOES WRONG ─────────────────────────────────
  wrong: {
    eyebrow: 'Keep this page',
    title: 'When something goes wrong online',
    say: 'If anything ever goes wrong online, and things do go wrong, I am the first call you make, not the last. I will not overreact. I will help.',
    sayNote: 'Say it before anything happens, then say it again every so often.',
    steps: [
      ['Stay calm', 'Thank them for telling you. Whatever it is, they came to you.'],
      ['Keep the phone with them', 'Telling you should never cost them their phone. A child who expects to lose it has one more reason to stay quiet.'],
      ['Keep the evidence', 'Screenshot the messages and the account name, keeping any nude or sexual image out of the shot. Never copy, save or send on a nude or sexual image of anyone under 18, even to report it, and do not delete it either. The one exception is Report Remove, below, which your child uses for an image of themselves.'],
      ['Block and report', 'In the app first. If it involves classmates, tell the school, whose Designated Safeguarding Lead is there for exactly this.'],
      ['Check in again', 'Decide the next step together, and come back to it in a few days.'],
    ],
    help: [
      ['Someone is in danger now', '999'],
      ['Worried about sexual contact, grooming or someone asking for images', 'Report it to CEOP at ceop.police.uk'],
      ['A nude image of your child is online', 'Your child can report it to Report Remove, from Childline and the IWF, for under 18s, at childline.org.uk'],
      ['Your child wants to talk to someone who is not you', 'Childline, free and confidential, on 0800 1111'],
      ['You want advice as a parent', 'The NSPCC helpline on 0808 800 5000'],
      ['You are worried about their health', 'Their GP, or NHS 111 (in Northern Ireland, your GP\'s out of hours service)'],
    ],
  },

  // ── PAGE 10 · SIXTEEN ──────────────────────────────────────────────────
  sixteen: {
    eyebrow: 'The end of the road',
    title: 'Sixteen: the handover',
    intro: 'At sixteen the job changes. You set fewer of the rules and become more the person they talk things through with.',
    say: 'You are at the age where you get to decide what kind of digital life you build. What does your online presence say about who you are? Not to me. To the world.',
    auditTitle: 'A digital audit, as equals',
    audit: 'Go through their online presence together as equals rather than parent and child. What does it say? What would they change?',
    questionsTitle: 'Three questions to ask each other',
    questions: ['What does your phone give you?', 'What does it cost you?', 'What would you change about it?'],
    talkTitle: 'One calm talk before they go',
    talk: 'Sextortion, deepfakes and AI made images are real at this age. Have one specific, calm talk about what they would do if anything went wrong, and who they would call.',
    appTitle: 'For the next one coming up',
    app: 'The Guided Childhood app runs the same Passport for you: each stage with its lessons, every script and a short stage check, and the stamps land on their own. guidedchildhood.com',
  },

  // ── PAGE 11 · SOURCES ──────────────────────────────────────────────────
  sourcesIntro: 'Every age and figure in this guide, and where it was read. The advice itself is the Guided Childhood app\'s own, stage by stage.',
  sources: [
    ['YouTube.', 'Terms of Service, youtube.com/t/terms, and Help, supervised experiences for children (support.google.com/youtube/answer/10314074). Read 5 November 2026.'],
    ['Roblox.', 'Terms of Use for the EEA, the UK and Switzerland, effective 1 November 2026, and Help, Roblox Kids and Roblox Select (en.help.roblox.com). Read 5 November 2026.'],
    ['WhatsApp.', 'Terms of Service (UK), whatsapp.com/legal/terms-of-service-uk. Its UK minimum age went from 16 to 13 in February 2024. Parent managed accounts, WhatsApp Blog, 11 March 2026. Read 5 November 2026.'],
    ['Instagram.', 'Terms of Use, help.instagram.com/581066165581870, and Meta, Introducing Instagram Teen Accounts (about.fb.com, September 2024). Read 5 November 2026.'],
    ['TikTok.', 'Terms of Service (EEA and UK), updated July 2026, and Safety Center, protecting teens (tiktok.com/safety). Read 5 November 2026.'],
    ['Snapchat.', 'Terms of Service, snap.com/en-GB/terms, effective 21 September 2026, and the Snapchat Family Center (parents.snapchat.com). Read 5 November 2026.'],
    ['Facebook and Messenger.', 'Meta Terms of Service, facebook.com/terms.php, effective 4 March 2026, and Meta Family Center (familycenter.meta.com). Read 5 November 2026.'],
    ['Discord.', 'Terms of Service, discord.com/terms, effective 29 September 2025, and Help, Family Center (support.discord.com). Read 5 November 2026.'],
    ['Phone ownership at 10 and 11, the key age for phones, parents knowing the age is 13.', 'Ofcom, Children and Parents: Media Use and Attitudes Report, 21 May 2026, pages 7, 14 and 59.'],
    ['8 to 12s on services with a minimum age of 13, WhatsApp use, group chats.', 'Ofcom, Children\'s Online Experiences, 21 May 2026, pages 4, 10 and 36.'],
    ['Phones in schools.', 'Department for Education, Mobile phones in schools, statutory from 29 June 2026, followed from 1 September 2026 (gov.uk). England only.'],
    ['Under 16s and the overnight default.', 'UK Government, Growing up in the online world: government response, July 2026 (gov.uk). Plans, not yet law.'],
    ['Report Remove.', 'Childline and the Internet Watch Foundation, childline.org.uk.'],
    ['CEOP.', 'The National Crime Agency\'s CEOP Safety Centre, ceop.police.uk.'],
    ['Sextortion.', 'National Crime Agency, urgent warning about sextortion, 29 April 2024, nationalcrimeagency.gov.uk. Read 5 November 2026.'],
    ['Nude images of under 18s.', 'UK Council for Internet Safety, Sharing nudes and semi nudes: how to respond to an incident, updated March 2024 (gov.uk). Read 5 November 2026.'],
    ['The NSPCC helpline for adults.', 'gov.uk/report-child-abuse. Read 5 November 2026.'],
    ['The advice, stage by stage.', 'The Guided Childhood app: each stage\'s focus, device, talks, signs to watch and your phone, the settings guide for each app, and the school moments.'],
  ],
}
