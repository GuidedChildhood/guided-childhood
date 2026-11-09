import type { AgeBand } from '@/lib/content/stages'

// THE USUAL ROWS: thirty everyday flashpoints every house has, each one
// explained, planned for and headed off before it starts.
//
// Justin, 9 November 2026, about the Monday morning row over an 11 year old's
// room, with a parent already stressed straight after waking: "we need to
// research how we deal with this, a way of helping parents manage, and find 29
// other common issues just like this to help advise both parents and child.
// Some way of letting parents know these things happen and we are here to pre
// empt and assist."
//
// lib/content/device-issues.ts is the bank of DEVICE problems. This is its
// twin for the rows that would exist if screens had never been invented, so
// the two never overlap: a row about a screen belongs over there.
//
// ── WHERE THIS COMES FROM ───────────────────────────────────────────────────
//
// Two sweeps on 9 November 2026: the room and the morning temper in depth, and
// the 29 others ranked by how often UK parents raise them (Coram Family Lives
// helpline categories, Mumsnet thread titles, YoungMinds, the NHS, Harvard's
// Center on the Developing Child, Ross Greene's Collaborative and Proactive
// Solutions, Faber and Mazlish, Stattin and Kerr, Kazdin, Gottman). Then every
// source went through the citation check. The ranking is judgement, not a
// count: nothing counts these rows directly, and the page says so. Sources
// read only through a search snippet are marked `read: false`, and no figure
// from any of them enters copy.
//
// What we do NOT claim, because the evidence is not there: that willpower runs
// out by the morning (ego depletion failed a 23 lab replication), that parents
// are worst at any particular hour, or any cortisol story. The case for "not in
// the morning" is Greene's: a predictable problem is solved at a planned calm
// time, never in the heat of it.
//
// ── WHAT ONE ROW IS ─────────────────────────────────────────────────────────
//
// The parent's words, when it happens, what is going on, the line for the
// parent to steady themselves first (the parent who is already stressed is half
// of the problem, and is never blamed for it), the plan, the child's side (the
// child is a participant), what a stage earlier prevents, the source, the real
// scripts in the table, and the heads up: the push this family gets on the day
// and in the window it happens, once they have said it is theirs.
//
// Read by the page (/dashboard/flashpoints), the window push
// (app/api/push/cron, lib/push/flashpoint-heads-up.ts), and DiGi
// (lib/content/family-flashpoints-match.ts). The guard is
// scripts/check-family-flashpoints.mjs.

export type FlashpointSource = {
  name: string
  url: string
  kind: 'peer_reviewed' | 'official' | 'charity' | 'practitioner' | 'forum'
  /** True when the page or paper itself was read, false when only a search snippet was seen. */
  read: boolean
}

export type HeadsUp = {
  /** The family's own window: before school (morning) or the return home (home). */
  window: 'morning' | 'home'
  /** Days it goes on, 0 Sunday to 6 Saturday. At most two. */
  days: number[]
  /** Only on the family's school days (term time, Monday to Friday). */
  schoolDaysOnly: boolean
  title: string
  /** Push body. `{kid}` becomes the child's name. Push length. */
  body: string
}

export type Flashpoint = {
  key: string
  /** The bands it peaks in, first band first. */
  bands: AgeBand[]
  /** In a parent's words, short. */
  name: string
  /** When it predictably happens, said plainly. */
  when: string
  /** A thread title or line, marked VERBATIM or PARAPHRASE. */
  words: string
  /** What is actually going on, one sentence. */
  mechanism: string
  /** For the parent to say to themselves first. */
  parentFirst: string
  /** The calibrated pathway. Never a punishment, never a confiscation. */
  plan: string
  /** What the child owns. */
  childSide: string
  /** What doing it a stage earlier makes smaller. */
  prevent: string
  source: FlashpointSource
  proof: {
    /** Exact titles in public.scripts, checked against the seeds by the guard. */
    scripts: string[]
    /** The concern slug a "this happens in our house" tap raises. */
    concernSlug: string
    /** Older slugs that mean the same worry (moment keys, Right now). */
    relatedSlugs?: string[]
    /** Where the plan is put into practice, when it is somewhere other than the scripts. */
    href?: string
  }
  headsUp: HeadsUp
  /** Lower case words a parent uses about it. Matched on word starts. */
  keywords: string[]
  /** Honest: what the product does not yet do for it. */
  gap?: string
}

const S = (name: string, url: string, kind: FlashpointSource['kind'], read: boolean): FlashpointSource => ({ name, url, kind, read })

const FAMILY_LIVES_TEENS = S('Coram Family Lives, Living with teens', 'https://www.coramfamilylives.org.uk/advice/teenagers/you-and-your-teen/living-with-teens', 'charity', true)
const GREENE = S('Ross Greene, Lives in the Balance, Collaborative and Proactive Solutions (2023)', 'https://livesinthebalance.org/wp-content/uploads/2023/11/2023-Full-Day-Version-7.pdf', 'practitioner', true)
const HARVARD_EF_YOUNG = S('Harvard Center on the Developing Child, Executive Function: Skills for Life and Learning', 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/InBrief-Executive-Function-Skills-for-Life-and-Learning-2.pdf', 'official', false)
const HARVARD_EF = S('Harvard Center on the Developing Child, Executive Function Activities for Adolescents', 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Activities-for-Adolescents.pdf', 'official', true)
const AAP_DISCIPLINE = S("AAP, What's the Best Way to Discipline My Child?", 'https://www.healthychildren.org/English/family-life/family-dynamics/communication-discipline/Pages/Disciplining-Your-Child.aspx', 'official', true)
const YOUNGMINDS_SCHOOL = S('YoungMinds, School anxiety and refusal, parent guide', 'https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/school-anxiety-and-refusal/', 'charity', true)
const NHS_FUSSY = S('NHS, Fussy eaters', 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/fussy-eaters/', 'official', true)
const OXFORD_SLEEP = S('Oxford Health NHS CAMHS, Why has it got harder to get to sleep?', 'https://oxfordhealth.nhs.uk/camhs/self-care/sleep/what-happens/teenagers', 'official', true)
const STATTIN_KERR = S('Stattin and Kerr, Parental Monitoring: A Reinterpretation, Child Development 2000', 'https://doi.org/10.1111/1467-8624.00210', 'peer_reviewed', false)
const UNDERSTOOD = S('Understood.org, Restraint collapse: why kids fall apart after school', 'https://www.understood.org/en/articles/why-some-kids-fall-when-they-get-home-from-school', 'practitioner', true)
// Siblings Without Rivalry could only be checked through summaries (citation
// check, 9 November 2026), so the plan uses the summarised steps: describe the
// problem with respect, say you trust them to find a fix, step back.
const FABER = S('Faber and Mazlish, Siblings Without Rivalry', 'https://www.faberandmazlish.com/', 'practitioner', false)
const PATALL = S('Patall, Cooper and Robinson, Parent involvement in homework, Review of Educational Research 2008', 'https://doi.org/10.3102/0034654308325185', 'peer_reviewed', true)
const HAROLD = S('Harold et al, What works to enhance inter parental relationships, EIF for DWP 2016', 'https://www.gov.uk/government/publications/what-works-to-enhance-inter-parental-relationships-and-improve-outcomes-for-children', 'official', true)
const EVANS_MUSIC = S('Evans, McPherson and Davidson, The role of psychological needs in ceasing music and music learning activities, Psychology of Music 2013', 'https://selfdeterminationtheory.org/wp-content/uploads/2021/06/2013_EvansMcPhersonDavidson_Roleof.pdf', 'peer_reviewed', true)
const NEWCASTLE_SLEEP = S('Newcastle Hospitals NHS, Sleep hacks, a guide for teenagers', 'https://www.newcastle-hospitals.nhs.uk/services/great-north-childrens-hospital/childrens-health-psychology/resources/sleep-hacks-a-guide-for-teenagers/', 'official', true)
const GOTTMAN_COACHING = S('Gottman Institute, An introduction to emotion coaching', 'https://www.gottman.com/blog/an-introduction-to-emotion-coaching/', 'practitioner', true)
const NHS_TEETH = S("NHS, Looking after your baby's teeth", 'https://www.nhs.uk/baby/babys-development/teething/looking-after-your-babys-teeth/', 'official', true)
const KAZDIN = S('Kazdin, The Kazdin Method for Developing and Changing Behavior of Children and Adolescents, International Journal of Mental Health Promotion 2021', 'https://doi.org/10.32604/IJMHP.2021.019135', 'peer_reviewed', false)
const NHS_HYGIENE = S('CNWL NHS, Personal hygiene for young people', 'https://hillingdoncyp.cnwl.nhs.uk/11-19-years/your-health/personal-hygine', 'official', false)
const YOUNGMINDS_EXAMS = S('YoungMinds, Exam time, parent guide', 'https://www.youngminds.org.uk/parent/parents-a-z-mental-health-guide/exam-time/', 'charity', false)
const CORAM_2026 = S('Coram Family Lives, Families Under Pressure: the State of Family Life in 2026', 'https://www.coram.org.uk/news/families-under-pressure-coram-family-lives-report-reveals-challenging-issues-facing-families/', 'charity', true)
const MONEY_CAMBRIDGE = S('Whitebread and Bingham, Habit formation and learning in young children, Money Advice Service 2013', 'https://www.moneyadviceservice.org.uk/en/corporate/habit-formation-and-learning-in-young-children', 'official', false)
const BELTON = S('Belton and Priyadharshini, Boredom and schooling, Cambridge Journal of Education 2007', 'https://ueaeprints.uea.ac.uk/16370/', 'peer_reviewed', false)

export const FAMILY_FLASHPOINTS: Flashpoint[] = [
  // ── 1. THE ONE THAT STARTED IT ────────────────────────────────────────────
  {
    key: 'messy_room', bands: ['11-13', '8-10', '13-15'],
    name: 'The bedroom that never stays tidy',
    when: 'Monday mornings, when the weekend is all over the floor',
    words: 'VERBATIM Mumsnet titles: "Lazy teenager, constant nagging!" and "Help ADHD preteen learn to tidy?" ("I do not want to be fighting with her over it, I just want to help her").',
    mechanism: 'At this age the bedroom is their own patch, so "tidy your room" lands as a rule about them, and it is one big vague job with no steps and no finish line. Each nag and refusal teaches both sides the script for the next round.',
    parentFirst: 'They do well when they can. The room is a planned conversation, not a Monday morning one.',
    plan: 'Say nothing about the room before school. At a calm time, ask what is getting in the way and agree a small reset together: five checks in ten minutes at a time that is not the morning, with the door closed on the rest.',
    childSide: 'They pick the reset time from two or three that are not mornings, word the checklist, choose the music, and earn the stars on their chart.',
    prevent: 'A short reset with its own steps from age 8 means the teenage room is a habit, not a battle.',
    source: GREENE,
    proof: { scripts: ['The Messy Bedroom', 'The nagging about jobs', 'After you lost your temper'], concernSlug: 'messy-bedroom', relatedSlugs: ['clothes'], href: '/dashboard/quests' },
    headsUp: { window: 'morning', days: [1], schoolDaysOnly: true, title: 'Before you open the door', body: "It is Monday. Leave {kid}'s room until the reset you agreed, not this morning. A calm hello now does more than any word about the floor." },
    keywords: ['tidy', 'tidying', 'messy room', 'messy bedroom', 'mess in her room', 'mess in his room', 'clean her room', 'clean his room', 'clean their room', 'clean your room', 'bedroom is a', 'room is a tip', 'state of her room', 'state of his room', 'floor is covered', 'clothes on the floor'],
  },
  // ── 4 TO 7 AND 8 TO 10 ────────────────────────────────────────────────────
  {
    key: 'school_morning', bands: ['4-7', '8-10'],
    name: 'School mornings, shouting by eight',
    when: 'School mornings, 07:15 to 08:30',
    words: 'VERBATIM Mumsnet title: "School mornings constantly losing my temper".',
    mechanism: 'A string of changes against a clock, run by a brain whose planning is still growing, with the parent\'s voice as the only prompt.',
    parentFirst: 'If shouting is the only prompt, the routine is what is broken, not the child.',
    plan: 'Move the decisions to the night before: bag packed, clothes out, shoes by the door. In the morning point at the picture chart rather than repeating yourself.',
    childSide: 'They own the chart and move their own marker as each step is done.',
    prevent: 'A picture routine at 5 becomes a routine they run themselves by 9.',
    source: YOUNGMINDS_SCHOOL,
    proof: { scripts: ['Getting out of the house', 'Getting Dressed is a War', 'School Bag Not Packed', 'How Did the Morning Go'], concernSlug: 'school-morning-rush', relatedSlugs: ['morning', 'dressed', 'bag'], href: '/dashboard/quests' },
    headsUp: { window: 'morning', days: [1, 4], schoolDaysOnly: true, title: 'Before the rush', body: 'Point at the chart, not the clock. One calm "what is next on your list?" beats five reminders, and {kid} gets to be the one who knows.' },
    keywords: ['school run', 'school morning', 'mornings are', 'every morning', 'out of the door', 'out the door', 'late for school', 'getting ready for school', 'shouting in the morning', 'morning routine'],
  },
  {
    key: 'bedtime_stalling', bands: ['4-7', '8-10'],
    name: 'Bedtime takes hours',
    when: 'Every evening, 19:00 to 20:30',
    words: 'VERBATIM Mumsnet title: "help 6yo bedtime taking too long".',
    mechanism: 'Bedtime means saying goodnight and losing the evening, so every extra step is more time with you and more room to stall.',
    parentFirst: 'This is a child holding on to you, not a child defying you.',
    plan: 'Agree a short routine together as picture steps, with the same last words every night. If they get up, walk them back with the fewest words you can.',
    childSide: 'They tick off their own bedtime steps for a star.',
    prevent: 'A routine built at 4 stops bedtime at 8 turning into a negotiation.',
    source: GREENE,
    proof: { scripts: ['Getting Up for Bed is a Battle', 'Will Not Go to Sleep', 'The Midnight Requests'], concernSlug: 'bedtime-stalling', relatedSlugs: ['sleep'], href: '/dashboard/quests' },
    headsUp: { window: 'home', days: [1, 3], schoolDaysOnly: true, title: 'Tonight, before bedtime starts', body: 'Same steps, same last words, fewest words if {kid} gets up. Decide now, while you are calm, what you will say at the third "one more thing".' },
    keywords: ['bedtime', 'bed time', 'stalling', 'one more story', 'keeps getting up', 'wont stay in bed', 'will not stay in bed', 'takes hours to get', 'go to bed'],
  },
  {
    key: 'food_refusal', bands: ['4-7'],
    name: 'Will not eat what I cook',
    when: 'Weekday tea, 17:00 to 18:30',
    words: 'PARAPHRASE: "He will only eat pasta and I am cooking twice."',
    mechanism: 'Turning down new food is normal at this age and pressure makes it stronger, so the table becomes a power struggle.',
    parentFirst: 'Your job is what goes on the plate and when. How much they eat is theirs.',
    plan: 'One family meal with one safe food on it, eaten together, with no comments on what goes in. Keep offering the new food, never bribed and never forced.',
    childSide: 'They help choose or make one dish a week, for a star.',
    prevent: 'Calm meals at 4 save you a ten year old who has learned to fight over food.',
    source: NHS_FUSSY,
    proof: { scripts: ['They Will Not Eat What You Have Made', 'Healthy Dinner Refusal', 'Choosing Dinner is a Crisis'], concernSlug: 'food-refusal', relatedSlugs: ['dinner', 'snacks'] },
    headsUp: { window: 'home', days: [2, 4], schoolDaysOnly: true, title: 'Before tea', body: "One safe food on {kid}'s plate, everyone at the table, and no comments on what gets eaten. Tonight the win is a calm meal, not an empty plate." },
    keywords: ['will not eat', 'wont eat', "won't eat", 'fussy eat', 'picky eat', 'refuses food', 'refuses to eat', 'only eats', 'dinner battle', 'mealtime', 'meal time'],
  },
  {
    key: 'siblings', bands: ['4-7', '8-10'],
    name: 'They fight all the time',
    when: 'After school, and weekend mornings',
    words: 'VERBATIM Mumsnet title: "Siblings who fight all the time and I mean all".',
    mechanism: 'A contest for your attention and for fairness, made worse by comparing them and by the grown up playing judge.',
    parentFirst: 'You do not have to be the referee who finds the guilty one.',
    plan: 'Step in firmly only for hurting. Otherwise describe the problem with respect and no blame, say you trust them to find a fix, and step back while they do.',
    childSide: 'Each of them proposes one fix, and they keep a family deal on sharing.',
    prevent: 'Dropping comparisons early takes the fuel out of teenage rivalry.',
    source: FABER,
    proof: { scripts: ['They Will Not Stop Fighting', 'They Are Fighting Over Something Specific', 'Older Sibling Being Unkind'], concernSlug: 'sibling-fighting', relatedSlugs: ['fighting', 'rightnow-sibling-fight'] },
    headsUp: { window: 'home', days: [1, 3], schoolDaysOnly: true, title: 'When they get home', body: 'If it kicks off, describe the problem, not who started it. Then hand it back: "you two have a problem, and I know you can fix it."' },
    keywords: ['siblings', 'sibling', 'brother and sister', 'fight all the time', 'fighting all the time', 'they fight', 'keep fighting', 'hitting each other', 'he started it', 'she started it'],
  },
  {
    key: 'after_school_meltdown', bands: ['4-7'],
    name: 'Fine at school, explodes at home',
    when: 'Straight after school, 15:15 to 17:00',
    words: 'VERBATIM Mumsnet title: "Anyone else\'s Y1 kid a punching screaming ball of emotion now they\'re back at school".',
    mechanism: 'Holding it together all day uses up their self control, so it gives way at home, with hunger and tiredness on top.',
    parentFirst: 'They save it for you because you are the safe one.',
    plan: 'Meet them with a snack and quiet, and save the questions about school for later. Keep after school clubs light in the autumn term.',
    childSide: 'They pick their landing activity for the first half hour home.',
    prevent: 'A planned wind down in Reception shrinks the meltdowns in the years after.',
    source: UNDERSTOOD,
    proof: { scripts: ['The first twenty minutes home', 'The School Pickup Debrief', 'A Day Where Everything Went Wrong'], concernSlug: 'after-school-meltdown', relatedSlugs: ['pickup'] },
    headsUp: { window: 'home', days: [1, 4], schoolDaysOnly: true, title: 'Home from school', body: 'Snack first, questions later. If {kid} falls apart in the first half hour, it is a full day of holding it in, and you are the safe place to let go.' },
    keywords: ['after school', 'meltdown after school', 'explodes when', 'falls apart', 'good at school', 'fine at school', 'restraint collapse', 'pick up', 'pickup'],
  },
  {
    key: 'homework', bands: ['8-10', '11-13'],
    name: 'Homework is a nightly war',
    when: 'School nights, 16:30 to 18:30',
    words: 'VERBATIM Mumsnet title: "reluctant to do homework, nag or let her take consequences".',
    mechanism: 'A tired child, a task they cannot see the start of, and a parent who slides from helping into controlling.',
    parentFirst: 'Sitting near them helps. Taking it over does not.',
    plan: 'Agree a set time and place, after food and a break, and help them find the first step only. If it keeps sticking, talk to the teacher rather than fighting the child.',
    childSide: 'They choose the slot and start the timer themselves.',
    prevent: 'Backing their independence at 8 means less policing at 14.',
    source: PATALL,
    proof: { scripts: ['Homework Every Night is a Battle', 'The Homework Panic Spiral', 'The Forgotten Homework Discovery'], concernSlug: 'homework-war', relatedSlugs: ['homework', 'rightnow-homework'], href: '/dashboard/homework' },
    headsUp: { window: 'home', days: [2, 4], schoolDaysOnly: true, title: 'Before homework', body: 'Food and a break first, then the slot {kid} chose. Your only job tonight is the first step. The homework helper can show you what it is about.' },
    keywords: ['homework', 'home work', 'spellings', 'reading book', 'times tables'],
  },
  {
    key: 'backchat', bands: ['8-10', '11-13', '13-15'],
    name: 'The backchat',
    when: 'After school, and whenever a request arrives out of nowhere',
    words: 'VERBATIM Mumsnet title: "Constant answering back, what do you do".',
    mechanism: 'A push for independence, often set off by a request with no warning, said back in the tone it came in.',
    parentFirst: 'Answer the tone later and the need now.',
    plan: 'Calmly name it once ("try that again so I can hear it") and do not argue in the moment. Later, when it is calm, ask what was going on and agree how requests get made.',
    childSide: 'They get a do over, and can ask for two minutes instead of snapping.',
    prevent: 'Repair practised at 8 is the script a teenager needs.',
    source: CORAM_2026,
    proof: { scripts: ['Rudeness and answering back', 'They Were Rude to You Today', 'After you lost your temper'], concernSlug: 'backchat' },
    headsUp: { window: 'home', days: [2], schoolDaysOnly: true, title: 'If the backchat starts', body: 'One calm "try that again so I can hear it", then leave it. The real conversation with {kid} is later, when you are both calm.' },
    keywords: ['backchat', 'back chat', 'answering back', 'answers back', 'rude to me', 'so rude', 'cheeky', 'talks back', 'attitude', 'eye roll'],
  },
  {
    key: 'jobs_nobody_does', bands: ['8-10', '11-13', '13-15'],
    name: 'I am not the maid',
    when: 'After tea, and weekends',
    words: 'PARAPHRASE: "Nobody lifts a finger unless I scream."',
    mechanism: 'Jobs nobody owns, asked for one at a time, feel like nagging rather than belonging.',
    parentFirst: 'Asking for help is fair. Keeping score is what wears you down.',
    plan: 'Agree a small set of jobs each child owns, each with a fixed time. Their own jobs earn stars and the chart does the reminding; the family jobs stay outside the stars, because helping is belonging.',
    childSide: 'They choose their jobs from the list and swap them each term.',
    prevent: 'Looking after their own things from 5 makes pitching in feel normal by 12.',
    source: KAZDIN,
    proof: { scripts: ['The nagging about jobs', 'Helping hands, and a robot helper'], concernSlug: 'jobs-nobody-does', href: '/dashboard/quests' },
    headsUp: { window: 'home', days: [3], schoolDaysOnly: true, title: 'Before tea', body: "Let the chart do the asking tonight. If {kid}'s jobs are on it, one look at the chart says it, and you do not have to." },
    keywords: ['chores', 'jobs around the house', 'help around the house', 'lift a finger', 'the maid', 'nag about jobs', 'never helps', 'clear the table', 'empty the dishwasher'],
  },
  {
    key: 'car_fights', bands: ['4-7', '8-10'],
    name: 'Fighting in the back seat',
    when: 'The school run, and the first hour of a long journey',
    words: 'VERBATIM Mumsnet line: "every car journey becomes a nightmare".',
    mechanism: 'A small shared space, no way out, and a parent who cannot turn round: perfect conditions for rivalry.',
    parentFirst: 'You cannot solve it while driving, so you do not have to.',
    plan: 'Before you set off, agree the seats, whose turn it is on the music, and one thing each to do. If it kicks off, pull over when it is safe, describe the problem and leave the fix to them.',
    childSide: 'They take turns as DJ and pack their own car bag.',
    prevent: 'Car rules set young make the long holiday drives calm later.',
    source: FABER,
    proof: { scripts: ['They Will Not Stop Fighting', 'They Are Fighting Over Something Specific'], concernSlug: 'car-fights', relatedSlugs: ['dropoff'] },
    headsUp: { window: 'morning', days: [5], schoolDaysOnly: true, title: 'Before the school run', body: 'Seats and music turns agreed before the engine starts. If it kicks off, you do not referee from the front seat.' },
    keywords: ['in the car', 'back seat', 'car journey', 'car journeys', 'long drive', 'road trip'],
  },
  // ── 11 TO 13, 13 TO 15, 16 PLUS ───────────────────────────────────────────
  {
    key: 'in_their_room', bands: ['13-15', '16+'],
    name: 'In their room all evening',
    when: 'School nights, 18:00 to 22:00',
    words: 'VERBATIM Mumsnet title: "locked in their rooms all evening".',
    mechanism: 'Moving towards independence is normal. The risk is that the conversation goes quiet, because what a parent of a teenager knows is mostly linked to what the teenager chooses to tell.',
    parentFirst: 'Pulling away is usually normal. What matters is whether they still tell you things.',
    plan: 'Keep one or two fixed points together, a meal or a show, and make them easy to say yes to. Offer side by side chances to talk, lifts and late snacks, rather than questions.',
    childSide: 'They choose the shared show, or cook one night.',
    prevent: 'The habit of chatting at 9 is what a 15 year old chooses to keep.',
    source: STATTIN_KERR,
    proof: { scripts: ['When They Come Home and Go Straight to Their Room', 'The Weekend Disappearing Act', 'They have stopped talking to you'], concernSlug: 'in-their-room' },
    headsUp: { window: 'home', days: [3], schoolDaysOnly: true, title: 'Tonight', body: 'One easy yes for {kid}: a snack at nine, a lift, an episode together. Side by side gets more than face to face at this age.' },
    keywords: ['in their room', 'in her room all', 'in his room all', 'stays in her room', 'stays in his room', 'never comes down', 'locked in', 'hardly see her', 'hardly see him'],
  },
  {
    key: 'wont_get_up', bands: ['13-15', '16+'],
    name: 'Cannot get them out of bed',
    when: 'School mornings, 06:45 to 08:00, Monday the worst',
    words: 'PARAPHRASE: "I am dragging a six foot teenager out of bed every day."',
    mechanism: 'In adolescence the body clock moves about two hours later and weekend lie ins make Monday worse, so it is biology, not laziness.',
    parentFirst: 'Their body clock really has moved.',
    plan: 'Agree a steady wake time across the whole week, with light in the morning, and let them own the alarm. Sort the wind down together in the evening rather than fighting at seven.',
    childSide: 'They set their own alarm and do their own waking.',
    prevent: 'Explaining how sleep changes at 11 means the change at 14 is something they expected.',
    source: OXFORD_SLEEP,
    proof: { scripts: ['They will not get up in the morning', 'Sleep Pattern Has Gone'], concernSlug: 'wont-get-up', relatedSlugs: ['rightnow-wont-get-up'] },
    headsUp: { window: 'morning', days: [1], schoolDaysOnly: true, title: 'Monday wake up', body: 'Monday is the hardest wake of the week for a teenage body clock. Curtains open, one call, and the alarm {kid} set. The bed talk is for tonight.' },
    keywords: ['out of bed', 'get up in the morning', 'wont get up', "won't get up", 'will not get up', 'cannot wake', 'can not wake', 'oversleeps', 'lie in', 'dragging him out', 'dragging her out'],
  },
  {
    key: 'late_home', bands: ['13-15', '16+'],
    name: 'Late home and not answering',
    when: 'Friday and Saturday nights',
    words: 'VERBATIM Mumsnet title: "15yr old son constantly ignores curfew".',
    mechanism: 'A time set without their say, and no plan for when things change, breaks the trust that keeps them safe.',
    parentFirst: 'Fear comes out as anger. Say you were worried.',
    plan: 'Agree the time together before each night out, with a text if it changes and a pick up with no questions asked. Talk it over calmly the next day, and grow the freedom as the texts keep coming.',
    childSide: 'They propose the time and keep the check in.',
    prevent: 'Small agreed freedoms at 12 make 15 a renegotiation, not a rebellion.',
    source: STATTIN_KERR,
    proof: { scripts: ['They came home hours late', 'Going out on their own'], concernSlug: 'late-home' },
    headsUp: { window: 'home', days: [5], schoolDaysOnly: false, title: 'Before tonight', body: 'Agree the time with {kid} now, not at the door: when, where, and "text me if it changes". Say the no questions pick up out loud.' },
    keywords: ['curfew', 'came home late', 'home late', 'not answering', 'ignores my calls', 'ignoring my texts', 'out late', 'what time to be home'],
  },
  {
    key: 'two_homes', bands: ['4-7', '8-10', '11-13'],
    name: 'Handover day tears',
    when: 'Sunday evening, and Friday handovers',
    words: 'PARAPHRASE: "Every Sunday after her dad\'s she is impossible."',
    mechanism: 'Moving between homes brings missing someone and split loyalty, and conflict between the parents does more harm than the separation itself.',
    parentFirst: 'Their upset is about missing someone, not about you failing.',
    plan: 'Keep handovers short and civil and never criticise the other home. Give them a quiet first hour with familiar things.',
    childSide: 'They pack a "comes with me" bag and name one thing they are looking forward to.',
    prevent: 'Calm handovers when they are small protect them from loyalty fights later.',
    source: HAROLD,
    proof: { scripts: ['Telling them about a separation', 'When one parent is stricter', 'A feeling they cannot name'], concernSlug: 'handover-days' },
    headsUp: { window: 'home', days: [0], schoolDaysOnly: false, title: 'Handover day', body: 'A short, friendly handover and a quiet first hour. If {kid} is upset tonight, it is missing someone, and that is allowed.' },
    keywords: ['handover', 'hand over', 'her dads', 'his dads', 'her mums', 'his mums', "dad's house", "mum's house", 'two homes', 'separated', 'co parent', 'contact weekend'],
  },
  {
    key: 'sunday_homework', bands: ['11-13', '13-15'],
    name: 'The Sunday night homework panic',
    when: 'Sunday, 17:00 to 21:00',
    words: 'VERBATIM Mumsnet title: "why do secondary DD or DS leave homework to last minute". A teacher replied: "Don\'t nag on Sunday night!"',
    mechanism: 'Planning skills lag behind what secondary school asks, and putting it off is often a way of avoiding the worry.',
    parentFirst: 'Sunday night is too late to teach planning. Tonight, just get it done.',
    plan: 'Get through tonight with calm help on the first step only. Then hold a ten minute Friday chat where they map the weekend\'s work.',
    childSide: 'They own the weekly plan and run the Friday chat.',
    prevent: 'Planning together in Year 6 makes the jump to Year 7 smaller.',
    source: HARVARD_EF,
    proof: { scripts: ['The Homework Panic Spiral', 'The Forgotten Homework Discovery', 'Sunday Night and the Device Spiral'], concernSlug: 'sunday-homework', href: '/dashboard/homework' },
    headsUp: { window: 'home', days: [0], schoolDaysOnly: false, title: 'Sunday afternoon', body: "A quiet \"anything due tomorrow?\" now beats a panic at nine. If there is, help {kid} with the first step only. Friday is for the plan." },
    keywords: ['sunday night', 'last minute', 'due tomorrow', 'left it until', 'left it till', 'homework panic'],
  },
  {
    key: 'lost_things', bands: ['4-7', '8-10'],
    name: 'Where are your shoes?',
    when: 'School mornings 08:00 to 08:30, and pick up',
    words: 'VERBATIM Mumsnet title: "child constantly losing possessions".',
    mechanism: 'Working memory is still growing and nothing has a fixed home.',
    parentFirst: 'Forgetting is a skill they are still building, not carelessness.',
    plan: 'Give each thing one home, a hook or a basket by the door, and do a quick evening check together. Label everything and accept that some things go.',
    childSide: 'They run the evening check, for a star.',
    prevent: 'A home for everything at 5 heads off the Year 7 chaos.',
    source: HARVARD_EF_YOUNG,
    proof: { scripts: ['They lose everything', 'School Bag Not Packed'], concernSlug: 'lost-things', relatedSlugs: ['bag'], href: '/dashboard/quests' },
    headsUp: { window: 'home', days: [4], schoolDaysOnly: true, title: 'Tonight, two minutes', body: 'The evening check: shoes, coat, bag, book bag, on their hooks. If {kid} runs it, tomorrow morning has one less hunt in it.' },
    keywords: ['loses everything', 'lost his', 'lost her', 'cannot find his', 'cannot find her', 'where are your shoes', 'lost again', 'water bottle', 'jumper'],
  },
  {
    key: 'leaving_house', bands: ['4-7'],
    name: 'Forty minutes to leave the house',
    when: 'Weekend mornings, and leaving the park or a play date',
    words: 'PARAPHRASE: "Every time we try to go anywhere it ends in shouting."',
    mechanism: 'Switching from one thing to the next is hard for young children, and a vague instruction gives them nothing to do.',
    parentFirst: 'Plan for the switch, not for the moment you are already late.',
    plan: 'Give a warning, then short clear steps ("shoes on now"), and praise each one as it happens. Let them carry something from the old thing into the next.',
    childSide: 'They choose what comes with them and call the countdown.',
    prevent: 'Practised switches at 4 make school mornings easier at 6.',
    source: KAZDIN,
    proof: { scripts: ['Getting out of the house', 'Getting Dressed is a War'], concernSlug: 'leaving-the-house' },
    headsUp: { window: 'morning', days: [6], schoolDaysOnly: false, title: 'Going out today?', body: 'One warning, then short steps: "shoes on now". Praise each one as {kid} does it. Let them bring one thing with them.' },
    keywords: ['leave the house', 'leaving the house', 'get out of the house', 'leave the park', 'time to go', 'getting shoes on'],
  },
  {
    key: 'bored', bands: ['4-7', '8-10'],
    name: 'I am bored',
    when: 'The first week of every holiday, mid morning',
    words: 'VERBATIM Mumsnet title: "bored kids how to help".',
    mechanism: 'School\'s shape is gone and they expect to be entertained, but boredom is an ordinary feeling and often where the ideas start.',
    parentFirst: 'Boredom is not an emergency, and you are not the entertainment.',
    plan: 'Keep a loose shape to the day, out in the morning and quiet after lunch, and build an ideas jar together. Meet "I am bored" with the jar, not a rescue.',
    childSide: 'They fill the jar and draw from it.',
    prevent: 'Being easy with boredom at 5 grows a child who can occupy themselves at 10.',
    source: BELTON,
    proof: { scripts: ['Bored is where it starts', 'Ten minutes with a real book, and a story tent'], concernSlug: 'bored', href: '/dashboard/printables' },
    headsUp: { window: 'morning', days: [6], schoolDaysOnly: false, title: 'Saturday morning', body: 'When "I am bored" comes, point at the ideas jar, not the screen. Ten bored minutes is often where {kid}\'s best idea of the day starts.' },
    keywords: ['bored', 'boredom', 'nothing to do', 'entertain them', 'entertain him', 'entertain her'],
  },
  {
    key: 'monday_tummy', bands: ['4-7', '11-13'],
    name: 'The Monday morning tummy ache',
    when: 'Sunday night and Monday, 07:00 to 08:30',
    words: 'PARAPHRASE: "Every Monday it is a tummy ache and tears at the gate."',
    mechanism: 'Worry about school shows up in the body, and staying home brings relief today and makes tomorrow harder.',
    parentFirst: 'The pain is real and the fear is real, and you can hold both.',
    plan: 'Name the worry calmly and still go, with a small plan for the hardest moment. If it keeps happening, talk to school early and see the GP.',
    childSide: 'They pick their brave step and a signal to use with a trusted adult at school.',
    prevent: 'Catching worries early makes avoiding school in Year 7 less likely.',
    source: YOUNGMINDS_SCHOOL,
    proof: { scripts: ['Anxious about school', 'A huge worry about a small thing', 'The School Drop Off Struggle'], concernSlug: 'monday-tummy', relatedSlugs: ['dropoff'] },
    headsUp: { window: 'morning', days: [1], schoolDaysOnly: true, title: 'Monday morning', body: 'If the tummy ache comes, believe it and still go. Name the worry, plan the hardest minute with {kid}, and tell school if it keeps coming back.' },
    keywords: ['tummy ache', 'stomach ache', 'feels sick', 'does not want to go to school', "doesn't want to go to school", 'refuses to go to school', 'school refusal', 'tears at the gate', 'anxious about school'],
    gap: 'When it keeps happening this can be school based anxiety. The plan routes to school and the GP; the product does not assess it.',
  },
  {
    key: 'hygiene', bands: ['11-13'],
    name: 'They smell and will not shower',
    when: 'School mornings, and after PE or sport',
    words: 'VERBATIM Mumsnet title: "12 year old and body odour help".',
    mechanism: 'The body changes before the habits do, and being told feels embarrassing.',
    parentFirst: 'Keep it private and practical, and never a joke.',
    plan: 'Explain the body change once, in private, and let them choose their own products. Then put the shower in their routine and stop commenting on it.',
    childSide: 'They own their shower slot and their own products.',
    prevent: 'Talking about puberty at 9 or 10 means it is news they already have.',
    source: NHS_HYGIENE,
    proof: { scripts: ['Their body is changing and they hate it', 'Puberty and the mood swings'], concernSlug: 'hygiene', href: '/dashboard/quests' },
    headsUp: { window: 'morning', days: [2], schoolDaysOnly: true, title: 'A quiet word, not a joke', body: 'If the shower talk is needed, say it once, in private, with no audience. Then let {kid} choose the products, and the routine does the rest.' },
    keywords: ['smells', 'body odour', 'b.o', 'deodorant', 'shower', 'will not wash', 'wont wash', 'hygiene', 'greasy hair'],
  },
  {
    key: 'parents_disagree', bands: ['4-7', '8-10', '11-13', '13-15'],
    name: 'We argue about it in front of them',
    when: 'Weekday evenings, and in the middle of telling a child off',
    words: 'PARAPHRASE: "We row about how to handle him, in front of him."',
    mechanism: 'Children read how a disagreement ends, and one left unresolved shakes their sense of being safe.',
    parentFirst: 'Disagreeing is fine. Leaving it unresolved is what hurts.',
    plan: 'Pause with "we will sort this out together later" and let the parent who started carry on. Then let the children see you make up, not just the row.',
    childSide: 'Nothing for them to fix. Tell them plainly it is not theirs to fix.',
    prevent: 'Agreeing the big rules together early means fewer rows in front of them.',
    source: HAROLD,
    proof: { scripts: ['When one parent is stricter', 'After you lost your temper', 'Starting a family agreement'], concernSlug: 'parents-disagree', href: '/dashboard/agreement' },
    headsUp: { window: 'home', days: [3], schoolDaysOnly: true, title: 'For both of you', body: 'If you disagree about {kid} tonight, "we will sort it together later" and carry on. Then let them see you make up afterwards.' },
    keywords: ['my husband', 'my wife', 'my partner', 'my ex', 'we disagree', 'we argue', 'in front of the kids', 'in front of them', 'undermines me', 'one of us is stricter'],
  },
  {
    key: 'revision', bands: ['13-15', '16+'],
    name: 'Every revision talk ends in a row',
    when: 'March to June, school nights and weekends',
    words: 'PARAPHRASE: "Year 11 and every revision conversation ends in a row."',
    mechanism: 'Fear of failing looks like avoiding it, and pressure from home adds to the fear.',
    parentFirst: 'Your calm is the most useful revision aid in the house.',
    plan: 'Ask what help they want, then build a timetable they can actually keep, with breaks and sleep in it. Ask how they are feeling, not how many hours they did.',
    childSide: 'They write and keep their own timetable.',
    prevent: 'Low pressure study habits in Years 7 to 9 make Year 11 less frightening.',
    source: YOUNGMINDS_EXAMS,
    proof: { scripts: ['Exam and test anxiety', 'They failed something that mattered'], concernSlug: 'revision-rows' },
    headsUp: { window: 'home', days: [2], schoolDaysOnly: true, title: 'Before the revision talk', body: 'Ask {kid} "what would help?" instead of "how much have you done?". The timetable is theirs; the snacks and the calm are yours.' },
    keywords: ['revision', 'revise', 'revising', 'gcse', 'mocks', 'exams', 'a levels', 'study'],
  },
  {
    key: 'everyone_allowed', bands: ['11-13', '13-15'],
    name: 'Everyone else is allowed',
    when: 'Friday after school, and weekend plans',
    words: 'VERBATIM Mumsnet title: "AIBU for not letting my 12 year old daughter stay out in a park past 7pm on a Sunday".',
    mechanism: 'Friends\' rules and the push for independence run into a parent\'s sense of risk.',
    parentFirst: 'The answer is not yes or no. It is what would make it safe.',
    plan: 'Ask for the plan, who, where, until when and how they get home, and agree a version you can both live with. Grow it as they show they can handle it.',
    childSide: 'They bring the plan and keep the check in.',
    prevent: 'Freedoms practised a step at a time at 10 lower the stakes at 13.',
    source: STATTIN_KERR,
    proof: { scripts: ['Going out on their own', "When Your Rules Are Different From Their Friends' Parents", 'Everyone Else Has It'], concernSlug: 'everyone-else-allowed' },
    headsUp: { window: 'home', days: [5], schoolDaysOnly: true, title: 'Weekend plans', body: 'When the "everyone else is allowed" comes, ask {kid} for the plan: who, where, until when, how home. Then agree a version you can both live with.' },
    keywords: ['everyone else is allowed', 'everyone else gets', 'all her friends', 'all his friends', 'stay out', 'go into town', 'sleepover', 'not fair'],
  },
  {
    key: 'back_to_school', bands: ['4-7', '11-13'],
    name: 'Dreading going back',
    when: 'The last two days of every holiday, and the first school morning',
    words: 'PARAPHRASE: "She has been crying about going back all weekend."',
    mechanism: 'Holiday sleep has drifted and the unknown is close.',
    parentFirst: 'Some dread before going back is ordinary.',
    plan: 'Bring bed and wake times back over the last few days and do a calm practice run. Name one good thing and one worry, and make a plan for the worry.',
    childSide: 'They pack their own bag and set their alarm the day before.',
    prevent: 'Steady sleep through the holiday shrinks the first Monday shock.',
    source: NEWCASTLE_SLEEP,
    proof: { scripts: ['Anxious about school', 'They are anxious about leaving', 'School Bag Not Packed'], concernSlug: 'back-to-school' },
    headsUp: { window: 'home', days: [0], schoolDaysOnly: false, title: 'Back tomorrow?', body: 'If school starts tomorrow: one good thing, one worry, and a plan for the worry with {kid}. Bag packed tonight, bedtime back on time.' },
    keywords: ['back to school', 'going back to school', 'end of the holidays', 'first day back', 'new school', 'new term'],
  },
  {
    key: 'can_i_have', bands: ['8-10', '11-13'],
    name: 'Can I have, can I have',
    when: 'Saturday shopping, and pocket money day',
    words: 'PARAPHRASE: "Every shop trip is can I have, can I have."',
    mechanism: 'Wanting things with no money of their own makes every purchase a decision for the parent.',
    parentFirst: 'A clear system ends the bargaining.',
    plan: 'Set regular pocket money, some of it earned through starred jobs, and let them decide how to spend it. Let them feel a poor buy without rescuing them.',
    childSide: 'They keep their own spend and save jars.',
    prevent: 'Handling real coins at 6 builds the patience the teenage spending years need.',
    source: MONEY_CAMBRIDGE,
    proof: { scripts: ['Money of their own', 'It is not fair, they get more'], concernSlug: 'can-i-have', href: '/dashboard/quests' },
    headsUp: { window: 'morning', days: [6], schoolDaysOnly: false, title: 'Shopping today?', body: "Before you go in: {kid}'s own money, {kid}'s own choice. \"Is it worth it from your jar?\" ends the can I have." },
    keywords: ['can i have', 'pocket money', 'wants everything', 'keeps asking for', 'buy him', 'buy her', 'pester'],
  },
  {
    key: 'friendship_fallout', bands: ['8-10', '11-13'],
    name: 'Friendship fallout at the gate',
    when: 'Pick up, 15:15 to 16:30',
    words: 'PARAPHRASE: "She comes out in tears about the girls again."',
    mechanism: 'Friends matter more every year and groups keep shifting, and a child needs the feeling heard before any fix.',
    parentFirst: 'Listen first, and do not message the other parent tonight.',
    plan: 'Listen, and help them put a word to the feeling, then help them pick one next step. Go to school only for unkindness that keeps happening.',
    childSide: 'They choose their step and tell you how it went.',
    prevent: 'Naming feelings at 6 makes the friendship knocks at 11 easier to come back from.',
    source: GOTTMAN_COACHING,
    proof: { scripts: ['Left out of the friendship group', 'The friendship group turned on them', 'The School Pickup Debrief'], concernSlug: 'friendship-fallout', relatedSlugs: ['pickup'] },
    headsUp: { window: 'home', days: [5], schoolDaysOnly: true, title: 'At pick up', body: 'If {kid} comes out upset about friends, the feeling first: "that sounds really hard". The fix can wait until they ask for one.' },
    keywords: ['friends', 'friendship', 'left out', 'fell out', 'fallen out', 'falling out', 'the girls', 'the boys', 'no one to play with', 'nobody to play with'],
  },
  {
    key: 'teeth_hair', bands: ['4-7'],
    name: 'Teeth, hair and bath battles',
    when: '07:30 and 19:00',
    words: 'PARAPHRASE: "Brushing her hair is a screaming match every morning."',
    mechanism: 'It can feel uncomfortable, and it is their body being handled by someone else.',
    parentFirst: 'This is about how it feels, not about obeying you.',
    plan: 'Offer choices, which brush, which order, a song for the timer, and keep it short. Let them do the first go themselves while you finish the job.',
    childSide: 'They do their own first pass and pick the song.',
    prevent: 'Doing it together at 4 turns into doing it alone by 8.',
    source: NHS_TEETH,
    proof: { scripts: ['The Teeth Brushing Standoff', 'Getting Dressed is a War'], concernSlug: 'teeth-hair-bath', relatedSlugs: ['teeth'] },
    headsUp: { window: 'morning', days: [3], schoolDaysOnly: true, title: 'Teeth and hair', body: 'Two choices, not a command: "which brush?" and "which song?". {kid} does the first go, you finish. Short beats perfect.' },
    keywords: ['teeth', 'brush her teeth', 'brush his teeth', 'brushing teeth', 'brushing her hair', 'hair brushing', 'bath time', 'hair wash'],
  },
  {
    key: 'pe_kit', bands: ['8-10', '11-13'],
    name: 'Forgot the PE kit again',
    when: 'The night before, and 08:00 on PE days',
    words: 'VERBATIM Mumsnet title: "How can I get DS 9 to REMEMBER to bring".',
    mechanism: 'The timetable asks more than working memory can hold, and nothing outside their head reminds them.',
    parentFirst: 'Rescuing them every time stops them learning.',
    plan: 'Make the timetable visible, a note on the door or an alarm they set, and pack the night before. If they forget anyway, let the small natural consequence stand.',
    childSide: 'They set the reminder and pack their own kit.',
    prevent: 'Packing their own bag in Year 4 gets them ready for the Year 7 timetable.',
    source: HARVARD_EF_YOUNG,
    proof: { scripts: ['School Bag Not Packed', 'They lose everything'], concernSlug: 'forgot-pe-kit', relatedSlugs: ['bag'], href: '/dashboard/school' },
    headsUp: { window: 'home', days: [1], schoolDaysOnly: true, title: "Tomorrow's kit", body: "Check the school diary with {kid} tonight, not at 8am. They pack it; you only ask \"what is on tomorrow?\"" },
    keywords: ['pe kit', 'p.e. kit', 'forgot his', 'forgot her', 'forgets his', 'forgets her', 'swimming kit', 'football boots', 'left it at home'],
  },
  {
    key: 'practice', bands: ['8-10'],
    name: 'Practice is a fight',
    when: 'School nights, 17:30 to 19:00',
    words: 'VERBATIM Mumsnet title: "DS doesn\'t practice piano but refuses to quit".',
    mechanism: 'Practice that feels like pressure with no sense of getting better wears the motivation down.',
    parentFirst: 'The goal is keeping the music, not the minutes.',
    plan: 'Agree a short daily slot tied to something that already happens, and let them choose some of the pieces. Celebrate small wins, and each term decide together whether the instrument still fits.',
    childSide: 'They pick the slot and one piece each week.',
    prevent: 'Practice they own at 7 lowers the chance of quitting at 11.',
    source: EVANS_MUSIC,
    proof: { scripts: ['The nagging about jobs'], concernSlug: 'practice-fight', href: '/dashboard/quests' },
    headsUp: { window: 'home', days: [2], schoolDaysOnly: true, title: 'Practice tonight', body: 'Five minutes in the slot {kid} chose beats thirty fought over. Ask them to play you the bit they like best.' },
    keywords: ['practice', 'practise', 'piano', 'violin', 'guitar', 'instrument', 'music lesson'],
    gap: 'No script yet written for music or sport practice. The jobs script and a starred practice job carry it for now.',
  },
  {
    key: 'not_invited', bands: ['4-7', '8-10'],
    name: 'Not invited to the party',
    when: 'Saturday afternoons, and the day the invitations come home',
    words: 'VERBATIM Mumsnet title: "how do you deal with your child not being invited to a party, she is so upset".',
    mechanism: 'Being left out hurts, and a parent\'s own hurt can make it bigger.',
    parentFirst: 'Your hurt and theirs are different. Lead with theirs.',
    plan: 'Help them name the disappointment, without blaming anyone, then plan something small together that day. Leave out the guessing about why.',
    childSide: 'They choose the plan for the day and who to invite next time.',
    prevent: 'Being coached through disappointment at 4 makes being left out at 9 easier to survive.',
    source: GOTTMAN_COACHING,
    proof: { scripts: ['Left out of the friendship group', 'A feeling they cannot name'], concernSlug: 'not-invited' },
    headsUp: { window: 'morning', days: [6], schoolDaysOnly: false, title: 'If it is a party weekend', body: 'If {kid} was not invited to something, name it: "that is really disappointing". Then plan one small good thing together today.' },
    keywords: ['not invited', 'wasnt invited', "wasn't invited", 'was not invited', 'birthday party', 'party invite', 'left out of the party'],
  },
]

export function flashpointByKey(key: string): Flashpoint | null {
  return FAMILY_FLASHPOINTS.find(f => f.key === key) ?? null
}

/** The rows for a band, the ones that peak there first. */
export function flashpointsForBand(band: AgeBand | null): Flashpoint[] {
  if (!band) return FAMILY_FLASHPOINTS
  const first = FAMILY_FLASHPOINTS.filter(f => f.bands[0] === band)
  const also = FAMILY_FLASHPOINTS.filter(f => f.bands[0] !== band && f.bands.includes(band))
  const rest = FAMILY_FLASHPOINTS.filter(f => !f.bands.includes(band))
  return [...first, ...also, ...rest]
}

/** Every slug that means this flashpoint, its own first. */
export function flashpointSlugs(f: Flashpoint): string[] {
  return [f.proof.concernSlug, ...(f.proof.relatedSlugs ?? [])]
}

/** The heads up words for one child. */
export function headsUpLine(f: Flashpoint, childName: string | null): { title: string; body: string } {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  return { title: f.headsUp.title, body: f.headsUp.body.replaceAll('{kid}', kid) }
}

/** The plan as plain text, for the share sheet to the other parent. */
export function shareText(f: Flashpoint, childName: string | null): string {
  const kid = childName && childName !== 'Your child' ? childName : 'our child'
  return [
    `${f.name} (${kid})`,
    `First, for us: ${f.parentFirst}`,
    `The plan: ${f.plan}`,
    `${kid === 'our child' ? 'Their' : `${kid}'s`} part: ${f.childSide}`,
  ].join('\n\n')
}
