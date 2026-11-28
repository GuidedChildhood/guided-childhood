import { DEVICE_ISSUES, type DeviceIssue } from './device-issues'

// THE GUIDES: one public page per question a parent actually types.
//
// Justin, 2 November 2026: "Yes on guides". The plan, and the line on what is
// free, is plans/2026-11-02-guides-plan.md. The short version:
//
//   Free on the page: the problem, why it keeps happening, what works, how to
//   start earlier, and the source. Named, not shown: the word for word scripts,
//   which are paid (Justin, 11 August 2026) and stay in the scripts table.
//
// Each guide stands on a DEVICE_ISSUES entry, so the mechanism, the response,
// the source and the script titles are written once, in the place DiGi and the
// dashboard already read them. A guide adds only what search needs: the
// question in the parent's words, a short opening, and the ages it is for.
//
// Order after these three comes from the gum search report (npm run seo --
// report): a striking distance query with a proof path here becomes a guide.

export type Guide = {
  /** The URL: /guides/<slug>. Lower case words joined by hyphens. */
  slug: string
  /** The H1 and the page title: the question as a parent would type it. */
  question: string
  /** The meta description, under 160 characters. */
  description: string
  /** Who it is for, shown as the eyebrow. */
  ages: string
  /** Two or three sentences in the parent's words, every number sourced. */
  intro: string
  /** The DEVICE_ISSUES key the rest of the page is built from. */
  issueKey: string
  /** When the guide was last checked, for the page and the structured data. */
  updated: string
  /** App safety pages (lib/app-safety/apps.ts slugs) a parent with this worry looks at next. */
  apps?: string[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'screen-time-arguments',
    question: 'How do I stop the screen time argument every night?',
    description: 'Why the five more minutes fight comes back every evening, and the change that ends it: agree the structure once, then let the timer be the referee.',
    ages: 'Ages 8 to 13',
    intro: 'If every evening ends in the same row about five more minutes, you are not doing it wrong and you are not on your own. Ofcom found a third of parents find it hard to control their child\'s screen time. The fight is usually not about the minutes at all.',
    issueKey: 'negotiation',
    updated: '2026-11-02',
  },
  {
    slug: 'when-should-my-child-get-a-phone',
    question: 'When should my child get their first phone?',
    description: 'Most UK children get a phone at ten or eleven. What to decide before the box is opened, so the phone lands on a plan rather than an argument.',
    ages: 'Ages 9 to 12',
    intro: 'In the UK, phone ownership jumps from 56 percent at ten to 83 percent at eleven, the same year as the move to secondary school. So when your child says everyone in the class has one, they are close to right. The question worth your time is what the phone arrives into.',
    issueKey: 'first_phone',
    updated: '2026-11-02',
    apps: ['whatsapp', 'snapchat', 'tiktok'],
  },
  {
    slug: 'roblox-robux-spending',
    question: 'How do I stop my child spending money on Roblox?',
    description: 'Robux, skins and loot boxes are built to ask your child, not you. A simple monthly plan that stops the surprise on your card statement.',
    ages: 'Ages 8 to 13',
    intro: 'Robux, V Bucks, skins and loot boxes are designed to ask your child, never you. Ofcom found 53 percent of 8 to 17 year old gamers spend money in games. The answer is not a lock, it is a plan your child agreed to before the first ask.',
    issueKey: 'in_game_spending',
    updated: '2026-11-02',
    apps: ['roblox', 'fortnite', 'brawl-stars', 'ea-sports-fc'],
  },
  // THE SECOND BATCH, 28 November 2026. Justin: double down on what search is
  // bringing in. Each stands on a DEVICE_ISSUES entry that already has its
  // scripts in the scripts table, so every page has a proof path (THE-STORY.md
  // section 9; seo-gum: never a page for a query with no proof path). Intros
  // carry no figures: a number only enters public copy once someone has
  // opened the paper (lib/content/device-issues.ts).
  {
    slug: 'phone-in-bedroom-at-night',
    question: 'Should my child have their phone in their bedroom at night?',
    description: 'Why the phone in the bedroom keeps them up, and the change that works without a fight: the phone gets its own bed, outside theirs, from the first night.',
    ages: 'Ages 11 to 15',
    intro: 'If you have ever seen the glow under the door at one in the morning, you already know the question. The answer most families land on has less to do with rules than with where the phone sleeps.',
    issueKey: 'night_phone',
    updated: '2026-11-28',
    apps: ['tiktok', 'snapchat', 'youtube'],
  },
  {
    slug: 'child-cannot-stop-gaming',
    question: 'How do I get my child off the console without a fight?',
    description: 'Why calling time in the middle of a match always ends in a row, and how to stop at the real finishing line instead: the end of the game, agreed before it starts.',
    ages: 'Ages 8 to 13',
    intro: 'You say time is up, they say one more minute, and the shouting starts. Most of the time they are not defying you, and there is a calmer way to end the evening than the clock.',
    issueKey: 'gaming_stop',
    updated: '2026-11-28',
    apps: ['fortnite', 'roblox', 'call-of-duty', 'ea-sports-fc'],
  },
  {
    slug: 'meltdown-when-screen-time-ends',
    question: 'Why does my child melt down when screen time ends?',
    description: 'Children get good at staying on a task long before they get good at leaving one. How to hand the ending to the episode or the timer, so you stop being the bad guy.',
    ages: 'Ages 4 to 10',
    intro: 'The tears when the tablet goes off are not a sign you have got it all wrong. They are very common at this age, and the fix is smaller than it feels.',
    issueKey: 'transition_off',
    updated: '2026-11-28',
    apps: ['youtube-kids', 'youtube', 'roblox'],
  },
  {
    slug: 'angry-after-screen-time',
    question: 'Why is my child so angry after screen time?',
    description: 'Grumpy and rude for an hour after the tablet? What the research on screens and calming suggests, and how shorter, predictable sessions change the evening.',
    ages: 'Ages 4 to 13',
    intro: 'The screen goes off and the hour that follows is the hardest of the day. You are not imagining the pattern, and being stricter or softer rarely shifts it. What shifts it is noticing what the screen has been doing for your child, and what it has been standing in for.',
    issueKey: 'post_screen_crash',
    updated: '2026-11-28',
    apps: ['fortnite', 'roblox', 'youtube'],
  },
  {
    slug: 'stop-autoplay-video-after-video',
    question: 'How do I stop my child watching video after video?',
    description: 'One more video is never one, because the app is built that way. Turn autoplay off, agree a real end, and let the device stop it rather than you.',
    ages: 'Ages 4 to 10',
    intro: 'One more becomes five more, and then the argument. That is not a lack of willpower in your child, and the fix sits in the settings as much as in the rules.',
    issueKey: 'autoplay',
    updated: '2026-11-28',
    apps: ['youtube', 'youtube-kids', 'netflix'],
  },
  {
    slug: 'what-age-social-media',
    question: 'What age should my child have social media?',
    description: 'The ask usually comes years before the age the apps set. A stage check instead of a flat no: what each app does at this age, and the plan you both work towards.',
    ages: 'Ages 9 to 13',
    intro: 'Most big apps set their own minimum age at 13, and the asking often starts at nine or ten, because a friend already has it. A flat no tends to teach a child to set the account up without you. A plan keeps it in the open.',
    issueKey: 'social_media_request',
    updated: '2026-11-28',
    apps: ['tiktok', 'instagram', 'snapchat', 'bereal'],
  },
  {
    slug: 'class-whatsapp-group',
    question: 'Should my child be in the class WhatsApp group?',
    description: 'The class group chat arrives with the first phone, often in Year 6. What to teach before your child joins, so a nasty message at eleven at night comes to you.',
    ages: 'Ages 9 to 12',
    intro: 'The class group usually arrives with the first phone, often before anyone has talked about how a group chat works. Those skills can be taught before the group exists.',
    issueKey: 'class_group_chat',
    updated: '2026-11-28',
    apps: ['whatsapp', 'snapchat'],
  },
  {
    slug: 'group-chat-turned-nasty',
    question: 'What do I do when my child is left out of a group chat?',
    description: 'Being taken out of the group on purpose, pile ons, screenshots going round. What helps in the first hour, and how to keep your child telling you.',
    ages: 'Ages 11 to 15',
    intro: 'Being removed from a group on purpose hurts, and it happens where no adult can see. How you react in the first minute decides whether you hear about the next one. Calm, curious and unshocked keeps the door open.',
    issueKey: 'group_chat_nasty',
    updated: '2026-11-28',
    apps: ['whatsapp', 'snapchat', 'discord'],
  },
  {
    slug: 'stranger-messaged-my-child',
    question: 'What do I do if a stranger messages my child?',
    description: 'Contact arrives inside games and message apps. The steps to do together, report and block, and the promise that makes a child tell you straight away.',
    ages: 'Ages 10 to 16',
    intro: 'A message from someone your child does not know is one of the moments parents fear most. The settings matter, and so does one thing that is easy to miss: a child who is afraid of losing their phone tells nobody.',
    issueKey: 'strangers',
    updated: '2026-11-28',
    apps: ['roblox', 'discord', 'snapchat', 'among-us'],
  },
  {
    slug: 'child-saw-something-upsetting-online',
    question: 'What do I do if my child has seen something upsetting online?',
    description: 'It often arrives through a friend\'s phone or a feed that got dark without a choice. What to say first, so the next frightening thing is shown to you.',
    ages: 'Ages 10 to 15',
    intro: 'Most children do not go looking for the thing that frightened them. It arrives through a friend\'s phone, or a feed that took a turn, often years before anyone planned to talk about it. What you say in the first minute matters more than any setting.',
    issueKey: 'content_shock',
    updated: '2026-11-28',
    apps: ['tiktok', 'youtube', 'instagram'],
  },
  {
    slug: 'phone-and-homework',
    question: 'How do I stop the phone taking over homework?',
    description: 'Forty minutes of homework becomes three hours of switching. The phone in another room, a protected school hours window, and a way to help without policing.',
    ages: 'Ages 9 to 15',
    intro: 'If homework stretches across the whole evening, the phone on the desk is usually why. Every buzz is a switch, and each switch costs more than the seconds it takes. The fix is where the phone is, not how strong your child is.',
    issueKey: 'homework_displacement',
    updated: '2026-11-28',
  },
  {
    slug: 'phones-at-the-dinner-table',
    question: 'How do we keep phones off the dinner table?',
    description: 'Mealtimes are the one time most families are in the same room. A protected mealtime that is the same for everyone, grown ups included, agreed together.',
    ages: 'Ages 4 to 15',
    intro: 'Dinner is often the only time in the day when the whole family is in one room. A phone at the table takes away the easy talk that happens there. The rule works best when it is the same for every person sitting down, you included.',
    issueKey: 'mealtime_phones',
    updated: '2026-11-28',
  },
  {
    slug: 'child-got-round-parental-controls',
    question: 'My child got round the parental controls. What now?',
    description: 'Controls without agreement invite workarounds. How to move to oversight your child can see and helped set, with repair rather than punishment when it slips.',
    ages: 'Ages 9 to 15',
    intro: 'Finding out your child has beaten the controls can feel like a betrayal. It is also very common, and it tells you something useful: the controls were a wall to climb rather than a rule they agreed to. That can change.',
    issueKey: 'controls_bypassed',
    updated: '2026-11-28',
  },
  {
    slug: 'child-sneaking-phone',
    question: 'What do I do if my child is sneaking their phone?',
    description: 'A second device, a hidden account, a lie that got bigger. Why secrecy grows under hidden checking, and what makes telling you worth more than hiding.',
    ages: 'Ages 11 to 15',
    intro: 'Catching your child with a phone they were not meant to have is a gut punch. The lie is usually less about character than about who gets to decide, and the way you respond to this one decides whether there is a next one you never hear about.',
    issueKey: 'sneaking',
    updated: '2026-11-28',
  },
  {
    slug: 'teenager-screen-time-battle',
    question: 'How do I stop fighting with my teenager about screens?',
    description: 'At thirteen, a rule handed down reads as an intrusion. How to move from your rules to shared ones, with restrictions coming off as trust steps up.',
    ages: 'Ages 13 to 16',
    intro: 'By thirteen most children see their phone as their own business, so a rule handed down gets resisted, then hidden. The fight is not proof that rules have failed. It is a sign the rules need to start being shared.',
    issueKey: 'constant_battle',
    updated: '2026-11-28',
    apps: ['tiktok', 'instagram', 'snapchat'],
  },
  {
    slug: 'child-talks-to-ai-chatbot-like-a-friend',
    question: 'What if my child talks to an AI chatbot like a friend?',
    description: 'A voice that is always patient and never critical is easy to lean on. What to ask first, and why more real contact comes before asking them to stop.',
    ages: 'Ages 11 to 16',
    intro: 'An AI chatbot is always available, always patient and never critical, so it is easy to see why a child might lean on one. Treat it as a stage topic rather than a crisis: start with what they use it for, and who else is in their week.',
    issueKey: 'ai_friend',
    updated: '2026-11-28',
    apps: ['character-ai', 'chatgpt', 'snapchat'],
  },
]

export type GuideWithIssue = Guide & { issue: DeviceIssue }

/** A guide joined to its issue. Throws on a missing key, so a typo fails the build. */
export function withIssue(guide: Guide): GuideWithIssue {
  const issue = DEVICE_ISSUES.find(i => i.key === guide.issueKey)
  if (!issue) throw new Error(`Guide ${guide.slug} names issue ${guide.issueKey}, which is not in DEVICE_ISSUES`)
  return { ...guide, issue }
}

export function guideBySlug(slug: string): GuideWithIssue | null {
  const guide = GUIDES.find(g => g.slug === slug)
  return guide ? withIssue(guide) : null
}

/**
 * The guides most worth reading next: the ones whose issue peaks in the same
 * age bands, closest first, then the rest in list order. With eighteen guides
 * the old "every other guide" list had become a wall.
 */
export function relatedGuides(guide: GuideWithIssue, limit: number): Guide[] {
  const bands = new Set(guide.issue.bands)
  return GUIDES.filter(g => g.slug !== guide.slug)
    .map((g, i) => ({ g, i, shared: withIssue(g).issue.bands.filter(b => bands.has(b)).length }))
    .sort((x, y) => y.shared - x.shared || x.i - y.i)
    .slice(0, limit)
    .map(x => x.g)
}

/** The stage check hook, word for word as THE-STORY.md section 9 has it. */
export const STAGE_CHECK_HOOK = 'What stage is your child? Three questions, no sign up.'
