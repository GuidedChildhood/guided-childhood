import type { AgeBand } from '@/lib/content/stages'

// THE ISSUES, BY AGE: the top device problems parents actually have, ranked by
// how often they raise them, each one solved and prevented in this product or
// marked as a gap out loud.
//
// Justin, 13 September 2026: "DiGi can answer and provide solutions for each
// device related issue. Research by age, for each parent, the top proven
// common issues from science, experts and parent forums, all solved in our
// service and prevented."
//
// ── WHERE THIS COMES FROM ───────────────────────────────────────────────────
//
// Two verified sweeps. The ten problems briefing of 9 September 2026
// (briefings/2026-09-09-parent-device-problems-v2.html): six lenses, ranked
// by forum frequency, every source adversarially checked, with an honest audit
// of what we had built for each. And the by age sweep of 13 September 2026
// (Ofcom Children and Parents 2026 and Children's Online Experiences 2026,
// Common Sense, Internet Matters, Pew, NSPCC, the Children's Commissioner,
// Hiniker, Radesky, Fitzpatrick, McDaniel, plus Mumsnet thread titles as the
// forum layer; Reddit was unreachable both times). Figures came through search
// extracts, so a figure only enters public copy once someone has opened the
// paper; here they steer DiGi and the loop.
//
// ── WHAT ONE ROW IS ─────────────────────────────────────────────────────────
//
// The parent's words, the mechanism in one sentence, the response as a
// calibrated pathway (never allow or deny, never a confiscation), what a
// stage earlier prevents it, the source, and the PROOF PATH: the exact script
// titles in the scripts table (scripts/check-device-issues.mjs fails if one
// does not exist in the seeds), the moment key, the concern slug the check in
// tracks, the mechanic in code, and where a parent goes. A gap is a gap, in
// words, and the guard refuses a gap on any band's top three.
//
// Three readers: DiGi (lib/content/device-issues-match.ts finds the issue a
// message is in and the route prints the pathway with real script links), the
// loop (the fix of the week on Home is the first issue this family has not yet
// acted on), and the recommender (the band's issues are its weakest signal, so
// a quiet family still gets the script for what their child's age brings).

export type IssueMechanic =
  | 'timer' | 'protected_window' | 'core_time' | 'star_rate' | 'agreement' | 'device_guide'
  | 'bridge' | 'homework_decoder' | 'printable' | 'quest_board' | 'check_in' | 'fair_play' | 'passport' | 'ladder'

export type IssueSource = {
  name: string
  url: string
  kind: 'peer_reviewed' | 'official_report' | 'journalism' | 'industry' | 'forum'
}

export type DeviceIssue = {
  key: string
  /** The bands it peaks in. The first is where it is listed first. */
  bands: AgeBand[]
  /** In a parent's words. */
  name: string
  /** A thread title or line from the sweep, marked VERBATIM or PARAPHRASE. */
  words: string
  /** What is actually going on, one sentence. */
  mechanism: string
  /** The pathway, one or two sentences. Never a rule, never a confiscation. */
  response: string
  /** What a stage earlier makes it smaller, one sentence. */
  prevent: string
  source: IssueSource
  proof: {
    /** Exact titles in public.scripts. Checked against the seeds. */
    scripts: string[]
    /** One of the eight live categories. */
    category: 'screen-time' | 'social-media' | 'gaming' | 'staying-safe' | 'mood-confidence' | 'family-rules' | 'school-and-ai' | 'everyday-routines'
    /** The concern slug the check in tracks, when there is one. */
    concernSlug?: string
    mechanic?: IssueMechanic[]
    /** Where a parent goes to do the first thing. */
    href: string
  }
  /** Words a parent uses when they are in it. Lower case, matched on word boundaries. */
  keywords: string[]
  /** Honest: what is still missing. Never on a band's top three. */
  gap?: string
}

const OFCOM_2026: IssueSource = { name: 'Ofcom, Children and Parents: Media Use and Attitudes 2026', url: 'https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/2026-children-and-parents-report/children-and-parents-media-use-and-attitudes-report-2025-6.pdf', kind: 'official_report' }
const OFCOM_EXP_2026: IssueSource = { name: "Ofcom, Children's Online Experiences 2026", url: 'https://www.ofcom.org.uk/siteassets/resources/documents/online-safety/research-statistics-and-data/protecting-children/childrens-online-experiences-research-report.pdf', kind: 'official_report' }
const HINIKER: IssueSource = { name: 'Hiniker, Suh, Cao and Kientz, Screen Time Tantrums, CHI 2016', url: 'http://faculty.washington.edu/jkientz/papers/Hiniker-Tantrums-CHI2016.pdf', kind: 'peer_reviewed' }
const FITZPATRICK: IssueSource = { name: 'Fitzpatrick et al, Early Childhood Tablet Use and Outbursts of Anger, JAMA Pediatrics 2024', url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/2822089', kind: 'peer_reviewed' }
const TAM: IssueSource = { name: 'Tam and Inzlicht, Fast forward to boredom, J Exp Psych General 2024', url: 'https://psycnet.apa.org/doi/10.1037/xge0001639', kind: 'peer_reviewed' }
const RADESKY_DESIGN: IssueSource = { name: 'Radesky et al, Manipulative Design in Apps Used by Children, JAMA Network Open 2022', url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2793493', kind: 'peer_reviewed' }
const RADESKY_CALM: IssueSource = { name: 'Radesky et al, devices for calming, JAMA Pediatrics 2023', url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/2812146', kind: 'peer_reviewed' }
const MCDANIEL: IssueSource = { name: 'McDaniel and Radesky, Technoference, Pediatric Research 2018', url: 'https://www.nature.com/articles/s41390-018-0052-6', kind: 'peer_reviewed' }
const MUMSNET_MORNING: IssueSource = { name: 'Mumsnet, screen time before school threads', url: 'https://www.mumsnet.com/talk/parenting/4750984-screen-time', kind: 'forum' }
const MUMSNET_XBOX: IssueSource = { name: 'Mumsnet, Xbox Wars', url: 'https://www.mumsnet.com/talk/stepparenting/5358881-xbox-wars', kind: 'forum' }
const AAP_PLAN: IssueSource = { name: 'AAP, The Family Media Plan, Pediatrics 2024', url: 'https://publications.aap.org/pediatrics/article/154/6/e2024067417/199968/The-Family-Media-Plan', kind: 'official_report' }
const OFCOM_SPEND: IssueSource = { name: "Ofcom, Children's online spending and potential financial harm", url: 'https://www.ofcom.org.uk/siteassets/resources/documents/online-safety/research-statistics-and-data/online-services-research/childrens-online-spending-and-potential-financial-harm-quantitative-research.pdf', kind: 'official_report' }
const MUMSNET_PHONE: IssueSource = { name: "Mumsnet, Child's First Mobile Phone", url: 'https://www.mumsnet.com/talk/am_i_being_unreasonable/4961251-childs-first-mobile-phone', kind: 'forum' }
const MUMSNET_WHATSAPP: IssueSource = { name: 'Mumsnet, Yr6 class WhatsApp groups', url: 'https://www.mumsnet.com/talk/am_i_being_unreasonable/4784882-yr6-class-whatsapp-groups', kind: 'forum' }
const OFCOM_2025_CAS: IssueSource = { name: 'Ofcom 2025 media literacy, via Computing at School', url: 'https://www.computingatschool.org.uk/forum-news-blogs/2025/may/understanding-media-use-among-children-aged-3-11-key-insights-from-ofcom-s-2025-media-literacy-report/', kind: 'official_report' }
const MUMSNET_HOLIDAYS: IssueSource = { name: "Mumsnet, managing children's screen time over the summer holidays", url: 'https://www.mumsnet.com/talk/parenting/5532714-how-are-others-managing-childrens-screen-time-over-the-summer-holidays', kind: 'forum' }
const IM_SEND: IssueSource = { name: 'Internet Matters, Every child safe online, additional needs, 2026', url: 'https://www.internetmatters.org/hub/research/additional-needs-report-2026/', kind: 'official_report' }
const MUMSNET_HIDDEN: IssueSource = { name: "Mumsnet, AIBU to block DD12's hidden tablet", url: 'https://www.mumsnet.com/talk/am_i_being_unreasonable/5517044-aibu-to-block-dd12s-hidden-tablet-on-wifi-without-discussing-it', kind: 'forum' }
const JAMA_NIGHT: IssueSource = { name: 'JAMA Pediatrics, objective night time phone use in adolescents, May 2026 (via CNN)', url: 'https://www.cnn.com/2026/05/26/health/teen-nighttime-phone-use-study-wellness', kind: 'peer_reviewed' }
const CARTER: IssueSource = { name: 'Carter et al, bedtime media device use and sleep, JAMA Pediatrics 2016', url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/2571467', kind: 'peer_reviewed' }
const MUMSNET_SNEAK: IssueSource = { name: 'Mumsnet, What to do with teen sneaking around with phone', url: 'https://www.mumsnet.com/talk/am_i_being_unreasonable/4094765-What-to-do-with-teen-sneaking-around-with-phone', kind: 'forum' }
const CC_PORN: IssueSource = { name: "Children's Commissioner, pornography and harmful sexual behaviour", url: 'https://www.childrenscommissioner.gov.uk/resource/pornography-and-harmful-sexual-behaviour/', kind: 'official_report' }
const NSPCC: IssueSource = { name: 'NSPCC, private messaging grooming data 2025', url: 'https://www.nspcc.org.uk/about-us/news-opinion/2025/data-shows-how-criminals-are-using-private-messaging-platforms-to-manipulate-and-groom-children/', kind: 'official_report' }
const CSM_COMPANION: IssueSource = { name: 'Common Sense, Constant Companion 2023', url: 'https://www.commonsensemedia.org/research/constant-companion-a-week-in-the-life-of-a-young-persons-smartphone-use', kind: 'official_report' }
const IM_AI: IssueSource = { name: 'Internet Matters, Me, Myself and AI, 2025', url: 'https://www.internetmatters.org/hub/research/me-myself-and-ai-chatbot-research/', kind: 'official_report' }
const MUMSNET_BATTLE: IssueSource = { name: 'Mumsnet, me and 13 yr old, the constant awful battle over screen time', url: 'https://www.mumsnet.com/talk/am_i_being_unreasonable/5046965-me-and-13-yr-old-the-constant-awful-battle-over-screen-time', kind: 'forum' }
const PEW_2026: IssueSource = { name: "Pew, What parents say about their teen's uses of social media, 2026", url: 'https://www.pewresearch.org/internet/2026/04/15/what-parents-say-about-their-teens-uses-of-social-media/', kind: 'official_report' }
const CSM_AI_COMP: IssueSource = { name: 'Common Sense, Talk, Trust and Trade Offs, 2025', url: 'https://www.commonsensemedia.org/press-releases/nearly-3-in-4-teens-have-used-ai-companions-new-national-survey-finds', kind: 'official_report' }
const BARK: IssueSource = { name: 'Bark review, bypass methods', url: 'https://allaboutcookies.org/bark-review', kind: 'industry' }
const LOOT: IssueSource = { name: 'House of Commons Library, Loot boxes', url: 'https://commonslibrary.parliament.uk/research-briefings/cbp-8498/', kind: 'official_report' }
const BRIEFING: IssueSource = { name: 'The ten problems parents actually have, verified briefing, 9 September 2026', url: 'https://guidedchildhood.co.uk/briefings/2026-09-09-parent-device-problems-v2.html', kind: 'journalism' }

export const DEVICE_ISSUES: DeviceIssue[] = [
  // ── 4 to 7 ────────────────────────────────────────────────────────────────
  {
    key: 'transition_off', bands: ['4-7', '8-10'],
    name: 'The meltdown when the screen goes off',
    words: 'VERBATIM thread titles: "4 year old tantruming when iPad taken away", "the most horrendous melt downs".',
    mechanism: 'Children get good at staying on a task years before they get good at leaving one, and a parent calling time becomes the thing that ended the fun.',
    response: 'Hand the ending to the content: agree the stopping point before it starts, let the episode or the timer end it, and let them press the button. The one study that tested the two minute warning found it made things worse.',
    prevent: 'From the first tablet, endings are set by the content or the timer, never by a countdown, so the rule the console and the phone will need later is already the rule.',
    source: HINIKER,
    proof: { scripts: ['The two minute warning is making it worse', 'Refusing to stop when time is up', 'When Screen Time Ends in Tears'], category: 'screen-time', concernSlug: 'wont-put-down', mechanic: ['timer', 'core_time'], href: '/dashboard/scripts?category=screen-time' },
    keywords: ['tantrum', 'meltdown', 'melt down', 'turn it off', 'turned it off', 'take it away', 'took it away', 'switch off', 'time is up', 'come off', 'screaming when', 'ipad off', 'tablet off', 'stop playing'],
  },
  {
    key: 'post_screen_crash', bands: ['4-7', '8-10', '11-13'],
    name: 'Grumpy and rude for an hour afterwards',
    words: 'VERBATIM: "appalling behaviour because their brains are fried by screens".',
    mechanism: 'Calming a child with a screen displaces the practice at calming themselves, and in 315 preschoolers tablet use at three and a half predicted more anger a year later, which predicted more tablet use after that.',
    response: 'Shorter, predictable sessions with the next thing named before the screen goes on, and a screen that is sometimes for occupying but never the way an upset child gets calm. Track it on the check in rather than argue about it.',
    prevent: 'At four, the screen is never the calming tool; the calming tool is you, and that habit is what the check in measures at every age after.',
    source: FITZPATRICK,
    proof: { scripts: ['Screen time tied to mood', 'Aggressive behaviour after gaming', 'Mood drops after phone use'], category: 'mood-confidence', concernSlug: 'mood-after-screens', mechanic: ['check_in', 'timer'], href: '/dashboard/checkin' },
    keywords: ['grumpy', 'irritable', 'snappy', 'after screens', 'after the ipad', 'after gaming', 'fried', 'behaviour after', 'worse after', 'moody after', 'rude after', 'foul mood'],
  },
  {
    key: 'cannot_self_occupy', bands: ['4-7', '8-10'],
    name: 'Bored the second the screen goes off',
    words: 'VERBATIM: "When my kids are at home and not on screens they are absolute devils", "No screen time and losing my sanity".',
    mechanism: 'Skipping and switching to escape boredom reliably increases boredom, across seven experiments with 1,223 people, so the medium degrades tolerance for the state it is used to escape.',
    response: 'Bored is where play starts. Short unscreened windows that grow, a paper chart of things to do that the child made, and the quest board where they pitch their own quest, so the next thing is theirs.',
    prevent: 'A daily offline window from four, protected and ordinary, keeps the muscle for self occupying alive before a screen has a chance to replace it.',
    source: TAM,
    proof: { scripts: ['When They Say Everything Is Boring Without a Screen', 'Screens replacing outdoor play', 'Bored is where it starts'], category: 'screen-time', mechanic: ['printable', 'quest_board', 'protected_window'], href: '/dashboard/printables' },
    keywords: ['bored', 'boring', 'entertain himself', 'entertain herself', 'entertain themselves', 'play on their own', 'play by himself', 'play by herself', 'nothing to do', 'devils'],
  },
  {
    key: 'autoplay', bands: ['4-7', '8-10'],
    name: 'One more video is never one',
    words: 'PARAPHRASE: the child promised one more and it is forty minutes later.',
    mechanism: 'Nearly every app used by three to five year olds carries manipulative design, autoplay and lures included; the child is not choosing to keep going, the design is.',
    response: 'Autoplay off on every device in the house, a playlist chosen together with a real end, and the stopping point agreed before the first video, then the device ends it.',
    prevent: 'The device setup guides turn autoplay off the day a screen arrives, so one more never becomes the child\'s fault.',
    source: RADESKY_DESIGN,
    proof: { scripts: ['Asking for more screen time', 'Binge watching', 'Evening TV Will Not Turn Off'], category: 'screen-time', mechanic: ['device_guide', 'timer'], href: '/dashboard/devices' },
    keywords: ['one more', 'autoplay', 'auto play', 'next video', 'youtube kids', 'keeps watching', 'binge', 'episode after episode', 'another episode'],
  },
  {
    key: 'morning_screens', bands: ['4-7', '8-10'],
    name: 'Tablet before school and now we are late',
    words: 'VERBATIM: screens in the morning turn her child "into a demon child"; another parent allows nothing until fed, dressed and packed and "never has trouble leaving".',
    mechanism: 'A screen before the morning jobs makes every job a transition off a screen, and the morning has the least slack of any hour in the day.',
    response: 'Screens after ready, never before: the order is the rule, said once, and the tablet is what happens when shoes are on, if there is time.',
    prevent: 'The morning routine on the quest board from the start, so the screen is the thing after the jobs and never the thing before them.',
    source: MUMSNET_MORNING,
    proof: { scripts: ['The Morning TV Standoff', 'They will not get up in the morning', 'Screen Time Before School Has Happened Again'], category: 'screen-time', concernSlug: 'morning-tv', mechanic: ['quest_board', 'protected_window'], href: '/dashboard/quests' },
    keywords: ['morning', 'before school', 'school run', 'getting ready', 'late for school', 'breakfast', 'get dressed', 'shoes on'],
  },
  {
    key: 'device_as_calm', bands: ['4-7'],
    name: 'The tablet is the only thing that calms them down',
    words: 'PARAPHRASE: the screen is the babysitter, and the parent feels guilty about every minute of it.',
    mechanism: 'In 422 three to five year olds, calming with a device predicted more emotional reactivity six months on, strongest in boys and in children with strong feelings.',
    response: 'Occupying a child with a screen so you can cook is fine; calming an upset child with it every time is the one pattern to break, and the swap is your body and your voice, which the full body tantrum script walks through.',
    prevent: 'A small core of screen time that is theirs unconditionally means the screen never has to be the prize or the pacifier.',
    source: RADESKY_CALM,
    proof: { scripts: ['The full body tantrum', 'Whining that will not stop'], category: 'mood-confidence', mechanic: ['core_time'], href: '/dashboard/scripts?category=mood-confidence' },
    keywords: ['calm them down', 'calms them', 'calms him', 'calms her', 'babysitter', 'keep them quiet', 'only thing that works', 'to settle', 'settle him', 'settle her', 'guilty'],
  },
  {
    key: 'parent_phone', bands: ['4-7', '8-10', '11-13', '13-15', '16+'],
    name: 'I am on my phone too, honestly',
    words: 'PARAPHRASE: they looked at my phone, on the table, face up, and they were right.',
    mechanism: 'A parent\'s phone during time together predicts more difficult behaviour later, and the loop runs both ways: a hard day pushes the parent onto the phone.',
    response: 'One protected phone free slot a day for the parent too, kept in front of the child, and the child allowed to say so when it slips. Modelling over monitoring.',
    prevent: 'The house rule from the start is for the house, so a rule the child is asked to keep at eleven is one they have watched you keep since four.',
    source: MCDANIEL,
    proof: { scripts: ['Your own phone, one protected slot a day', 'A screens off dinner, the whole family'], category: 'everyday-routines', mechanic: ['protected_window'], href: '/dashboard/scripts?category=everyday-routines' },
    keywords: ['my own phone', 'my phone', 'i am on it', 'hypocrite', 'me too', 'own screen time', 'my screen time', 'i am always on'],
  },
  {
    key: 'siblings_fairness', bands: ['4-7', '8-10', '11-13'],
    name: 'It is not fair, she gets more',
    words: 'VERBATIM thread title: "Xbox Wars".',
    mechanism: 'Different ages need different rules, and a difference nobody has explained reads as favouritism; sibling conflict is under evidenced but relentlessly reported.',
    response: 'Per child rules by stage, said openly, with each child\'s own star rate and their own core time, so difference has a reason the younger one can hear.',
    prevent: 'Every child gets their own page and their own rate from the day they are added, so the comparison has an answer before it is made.',
    source: MUMSNET_XBOX,
    proof: { scripts: ['Sibling fight over the device', 'It is not fair, they get more', 'Sibling Fights Over One Device'], category: 'family-rules', mechanic: ['star_rate', 'core_time'], href: '/dashboard/quests' },
    keywords: ['not fair', 'sibling', 'brother', 'sister', 'gets more', 'share the', 'fighting over', 'fight over the', 'whose turn'],
  },
  {
    key: 'mealtime_phones', bands: ['4-7', '8-10', '11-13', '13-15'],
    name: 'Phones at the table',
    words: 'PARAPHRASE: family time named as the thing eroding, by parents in Internet Matters\' index and in every forum.',
    mechanism: 'Mealtimes are the one daily window where the whole family is in the same room, and a phone in it removes the only unstructured talking a day has.',
    response: 'A protected mealtime window that stars cannot buy, the same for everyone at the table, and the agreement builder\'s meals clause so it was decided together.',
    prevent: 'Protected mealtimes switched on at setup, before the first phone, so the phone arrives into a house where the table was already screens off.',
    source: AAP_PLAN,
    proof: { scripts: ['A screens off dinner, the whole family', 'Phone constantly out at meals', 'The Dinner Table Check'], category: 'family-rules', mechanic: ['protected_window', 'agreement'], href: '/dashboard/devices' },
    keywords: ['dinner', 'tea time', 'at the table', 'mealtime', 'meal time', 'meals', 'eating'],
    gap: 'Meal windows are fixed and not family editable, so a family that eats at half six is missed by the default.',
  },
  // ── 8 to 10 ───────────────────────────────────────────────────────────────
  {
    key: 'negotiation', bands: ['8-10', '11-13'],
    name: 'Five more minutes, every single day',
    words: 'VERBATIM: "So sick of arguing about bloody screens", "What screen time rules work at 10?". Ofcom 2026: 32 percent of parents find it hard to control their child\'s screen time.',
    mechanism: 'A negotiable rule invites negotiation; every session ends in a fresh argument because there is no agreed structure and the parent is the referee.',
    response: 'Agree the structure once with the child in the room: core time that is theirs, earned time through jobs at their star rate, protected windows nobody can buy. Then the timer is the referee and the parent is out of the doorway.',
    prevent: 'The three kinds of time set up at eight mean the phone at eleven arrives into rules that already exist, so nothing is renegotiated the week it arrives.',
    source: OFCOM_2026,
    proof: { scripts: ['Refusing to stop when time is up', 'The Just Five More Minutes Loop', 'Negotiating screen time limits'], category: 'screen-time', concernSlug: 'wont-put-down', mechanic: ['timer', 'core_time', 'star_rate', 'agreement'], href: '/dashboard/quests' },
    keywords: ['five more minutes', '5 more minutes', 'negotiat', 'arguing', 'argue', 'argument', 'bargain', 'pester', 'nag', 'every single day', 'every day the same', 'limit'],
  },
  {
    key: 'in_game_spending', bands: ['8-10', '11-13'],
    name: 'Roblox and the Robux',
    words: 'Ofcom: 53 percent of 8 to 17 year old gamers spend money in games; 5Rights: 32 percent of children regret money spent in games.',
    mechanism: 'Games ask the child, never the parent, and none of the top grossing games with loot boxes sought parental consent.',
    response: 'A fixed monthly amount agreed before the first ask, the gift card bought together, one tap purchase off on every store, and loot boxes named for what they are.',
    prevent: 'The first gift card conversation at eight, before the first spend, so the first real money is a plan rather than a shock on a statement.',
    source: OFCOM_SPEND,
    proof: { scripts: ['The first gift card, before the first spend', 'Requests for in-game purchases', 'They have spent real money on the game'], category: 'gaming', mechanic: ['device_guide', 'agreement'], href: '/dashboard/scripts?category=gaming' },
    keywords: ['robux', 'v bucks', 'vbucks', 'v-bucks', 'gift card', 'in game', 'in-game', 'spent money', 'spending money', 'loot box', 'loot boxes', 'battle pass', 'skins', 'microtransaction', 'my card'],
  },
  {
    key: 'first_phone', bands: ['8-10', '11-13'],
    name: 'Everyone in the class has a phone',
    words: 'VERBATIM: a parent asks why buying a phone in Year 6 is treated "as though it\'s part of a uniform policy". Ofcom 2026: ownership jumps from 56 percent at ten to 83 percent at eleven.',
    mechanism: 'In the year the child says it, the line is close to true, and the same year bundles a new school, a new peer group, more independence and less sleep.',
    response: 'A readiness pathway, not a date: decide together what the phone is for, where it charges at night, and say the no confiscation promise out loud before the box is opened.',
    prevent: 'The Year 6 phone plan written in Year 5, while it is still a plan, so the phone lands on rules the child helped write.',
    source: OFCOM_2026,
    proof: { scripts: ['The Year 6 phone plan, before the box is opened', 'Everyone Else Has It', 'Too young for a first social media account'], category: 'family-rules', concernSlug: 'asking-for-phone', mechanic: ['bridge', 'agreement', 'passport'], href: '/dashboard/secondary' },
    keywords: ['first phone', 'a phone', 'own phone', 'everyone has', 'everyone else has', 'year 6', 'year six', 'secondary school', 'old enough', 'ready for a phone', 'buy them a phone', 'get a phone'],
  },
  {
    key: 'class_group_chat', bands: ['8-10', '11-13'],
    name: 'The Year 6 WhatsApp group',
    words: 'VERBATIM thread titles: "Yr6 class WhatsApp groups", "Online Harassment on Y6/Y7 Whatsapp Groups". Over half of 8 to 11s already use WhatsApp.',
    mechanism: 'A group of a hundred children with no adult and no skills for group talk; the first problems are social, not technical, and they happen at eleven at night.',
    response: 'Teach group chat behaviour before the first group: what to do when it turns, a screenshot of anything upsetting comes to you and costs nothing, and the phone is not in the bedroom when the group is awake.',
    prevent: 'The first group chat lesson at eight to ten, before the class group exists, so leaving a nasty chat is a skill they have rather than a crisis they are in.',
    source: MUMSNET_WHATSAPP,
    proof: { scripts: ['Added to a group by someone they do not know', 'When Group Chat Drama Comes Home', 'The class group at eleven at night'], category: 'social-media', mechanic: ['protected_window'], href: '/dashboard/scripts?category=social-media' },
    keywords: ['whatsapp', 'group chat', 'class group', 'class chat', 'the group', 'added to a group', 'group message'],
  },
  {
    key: 'social_media_request', bands: ['8-10', '11-13'],
    name: 'She wants TikTok and all her friends have it',
    words: 'Ofcom 2025: 40 percent of under 13s have a social media profile; half of 8 to 12s on TikTok set up their own account.',
    mechanism: 'The ask arrives years before the age the platforms name, and a flat no teaches the child to set the account up without you.',
    response: 'A stage check instead of a yes or no: what the platform actually does at this age, what a Teen Account changes, and the sixteen ready goal named as the thing you are both working toward.',
    prevent: 'The social media readiness strand starts at eleven with the passport, so the ask at nine meets a plan rather than an argument.',
    source: OFCOM_2025_CAS,
    proof: { scripts: ['Everyone is on Snapchat and they are not', 'Too young for a first social media account', 'Asking for Instagram, and what a Teen Account actually does'], category: 'social-media', mechanic: ['passport', 'ladder'], href: '/dashboard/pathway' },
    keywords: ['tiktok', 'instagram', 'snapchat', 'social media', 'an account', 'wants an account', 'all her friends', 'all his friends', 'allowed on'],
  },
  {
    key: 'holiday_creep', bands: ['4-7', '8-10', '11-13'],
    name: 'The six weeks holiday screen creep',
    words: 'VERBATIM thread titles: "Screen time and the summer holidays", "How are others managing children\'s screen time over the summer holidays?"',
    mechanism: 'The structure that holds a school day disappears for six weeks and the screen fills the gap by default.',
    response: 'A holiday version of the same structure: jobs still earn, the core stays, protected windows move to holiday times, and the long middle of the day gets a plan the child helped make.',
    prevent: 'The quest board and the star rate run the same in term and out, so a holiday is the same loop with more daylight.',
    source: MUMSNET_HOLIDAYS,
    proof: { scripts: ['Screen time on holidays', 'Saturday Morning Screen Spiral'], category: 'family-rules', mechanic: ['quest_board', 'star_rate', 'protected_window'], href: '/dashboard/quests' },
    keywords: ['holiday', 'holidays', 'half term', 'summer', 'six weeks', 'inset day', 'weekend', 'saturday', 'sunday'],
  },
  {
    key: 'send_transitions', bands: ['4-7', '8-10', '11-13'],
    name: 'Transitions are ten times worse with my ADHD or autistic child',
    words: 'Internet Matters 2026: 79 percent of children with additional needs experienced harm online against 63 percent of their peers; the interruption reaction is the most common problem parents of children with ADHD name.',
    mechanism: 'For a child with ADHD or autism the screen is often a real regulation tool and the switch out of it is genuinely harder, not merely resisted.',
    response: 'Make the ending visible and the same every time: a timer the child can see, the next thing named before the screen goes on, and honesty that for this child the screen may be doing real work.',
    prevent: 'The visible ending as the house rule from the first device, so it is never introduced as a punishment for a child who is already finding it hardest.',
    source: IM_SEND,
    proof: { scripts: ['The visible ending, for the child who finds stopping hardest', 'A new diagnosis'], category: 'screen-time', mechanic: ['timer'], href: '/dashboard/scripts?category=screen-time' },
    keywords: ['adhd', 'autis', 'asd', 'send', 'additional needs', 'neurodiv', 'sensory', 'special interest', 'hyperfocus', 'transition'],
  },
  {
    key: 'controls_bypassed', bands: ['8-10', '11-13', '13-15'],
    name: 'They got round the parental controls',
    words: 'VERBATIM: the child changed the phone clock to beat downtime; Qustodio reviews call it "a false sense of control".',
    mechanism: 'Controls without agreement invite workarounds, and covert monitoring predicts secrecy through the feeling of being spied on.',
    response: 'Oversight they can see, agreed together: the rule the child helped write, checked openly, with repair rather than punishment when it slips. The controls are the fence, never the relationship.',
    prevent: 'Talking about parental controls at eight, as a thing you set together, so at twelve they are a shared setting rather than a wall to climb.',
    source: MUMSNET_HIDDEN,
    proof: { scripts: ['Talking about parental controls', 'Sneaking screen time', 'Checking their phone'], category: 'family-rules', mechanic: ['agreement', 'fair_play'], href: '/dashboard/devices' },
    keywords: ['parental controls', 'family link', 'screen time passcode', 'got round', 'got around', 'bypass', 'disabled the', 'turned off the', 'changed the clock', 'vpn'],
  },
  {
    key: 'gaming_stop', bands: ['8-10', '11-13'],
    name: 'They cannot stop in the middle of a match',
    words: 'VERBATIM thread title: "Gaming Rage". Ofcom: 69 percent of 8 to 11s game online.',
    mechanism: 'A match has no pause and a leaver penalty, so a clock time landing in the middle of one asks the child to lose on purpose.',
    response: 'Stop at the real finishing line: the end of the match, agreed before it starts, with the timer set to the match rather than the minute, and the console guide\'s settings doing the holding.',
    prevent: 'Getting the first console with the natural stopping point already the rule, the same rule the tablet taught at five.',
    source: OFCOM_2026,
    proof: { scripts: ['They cannot stop in the middle of a match', 'Gaming Rage', 'Losing badly and getting angry'], category: 'gaming', concernSlug: 'controller-fights', mechanic: ['timer', 'device_guide'], href: '/dashboard/scripts?category=gaming' },
    keywords: ['fortnite', 'roblox', 'minecraft', 'match', 'the game', 'gaming', 'xbox', 'playstation', 'switch', 'console', 'controller', 'rage'],
  },
  {
    key: 'homework_displacement', bands: ['8-10', '11-13', '13-15'],
    name: 'Homework takes three hours because of the phone',
    words: 'Common Sense: a median of 237 notifications a day, a quarter of them in school hours.',
    mechanism: 'Displacement is asserted more than measured, but the phone in the room during homework turns forty minutes into three hours of switching.',
    response: 'The phone in another room for the homework window, a protected school hours window in code, and the homework decoder so the parent can help without policing.',
    prevent: 'Protected school hours from the first phone, and the homework versus screens standoff handled at eight while the stakes are a spelling test.',
    source: CSM_COMPANION,
    proof: { scripts: ['Homework on a device with constant distraction', 'Gaming instead of homework', 'Phone during homework'], category: 'school-and-ai', mechanic: ['protected_window', 'homework_decoder'], href: '/dashboard/scripts?category=school-and-ai' },
    keywords: ['homework', 'revision', 'revising', 'coursework', 'exam', 'notifications', 'distracted', 'concentrat'],
  },
  // ── 11 to 13 ──────────────────────────────────────────────────────────────
  {
    key: 'group_chat_nasty', bands: ['11-13', '13-15'],
    name: 'The group chat turned nasty',
    words: 'Ofcom 2026: 23 percent of 8 to 17s experienced nasty or hurtful behaviour online; of the 39 percent bullied, 84 percent of it on a device.',
    mechanism: 'Being taken out of a group on purpose, pile ons and screenshots travelling are the first social injuries of the phone, and they happen where no adult can see.',
    response: 'The words for leaving a chat, the screenshot as evidence rather than shame, the school route used early, and a parent who does not look shocked, so the door stays open.',
    prevent: 'Group chat skills taught before the first group, and the no confiscation promise, so the first nasty chat is shown to you rather than hidden.',
    source: OFCOM_EXP_2026,
    proof: { scripts: ['Taken out of the group on purpose', 'Screenshots of group chat exclusion', 'They are being bullied online'], category: 'social-media', mechanic: ['fair_play'], href: '/dashboard/scripts?category=social-media' },
    keywords: ['bullied', 'bullying', 'bully', 'pile on', 'left out', 'kicked out of the group', 'removed from the group', 'nasty', 'mean messages', 'screenshot'],
  },
  {
    key: 'night_phone', bands: ['11-13', '13-15', '16+'],
    name: 'Phone in the bedroom, awake at 2am',
    words: 'JAMA Pediatrics 2026, objective tracking: 52 percent of adolescents used the phone between midnight and 4am at least once; bedtime device use roughly doubles the odds of too little sleep across 125,198 children.',
    mechanism: 'Mostly displacement and delayed onset rather than the light: a conversation that carried on without them, and a device within reach of the pillow.',
    response: 'The phone charges outside the bedroom, unasked, with a night light bought for it; a protected bedtime window that stars cannot buy; and a bedroom rule that is the same for the grown ups.',
    prevent: 'Phone to bed outside the bedroom from the first night the phone exists, so it is where the phone lives rather than something taken away later.',
    source: JAMA_NIGHT,
    proof: { scripts: ['Phone to bed, unasked, and a night light for it', 'The phone is in their room all night', 'They cannot sleep because of their phone'], category: 'screen-time', concernSlug: 'bedtime-screens', mechanic: ['protected_window', 'device_guide', 'printable'], href: '/dashboard/devices' },
    keywords: ['bedroom', 'at night', 'all night', '2am', 'midnight', 'lights out', 'cannot sleep', "can't sleep", 'bedtime', 'in bed with', 'under the covers', 'wake up tired', 'sleep'],
  },
  {
    key: 'sneaking', bands: ['11-13', '13-15'],
    name: 'Sneaking a second device, lying about it',
    words: 'VERBATIM thread titles: "DD lying. What to do?", "What to do with teen sneaking around with phone" (an old phone swapped into the case).',
    mechanism: 'Lying here is about jurisdiction, not character: covert and disproportionate oversight predicts secrecy, and the top thing these same children want adults to know is "I want them to trust me".',
    response: 'Curiosity before consequence, oversight they can see, and the no confiscation promise kept the first time it is tested. The fair play question each week pays a star for honesty, including honesty about a slip.',
    prevent: 'The promise said before it is needed and trust levels that visibly step up, so there is more to gain by telling than by hiding.',
    source: MUMSNET_SNEAK,
    proof: { scripts: ['The no confiscation promise, said out loud', 'A lie that got bigger', 'The second account you were not meant to find'], category: 'staying-safe', mechanic: ['fair_play', 'ladder'], href: '/dashboard/scripts?category=staying-safe' },
    keywords: ['sneak', 'sneaking', 'lying', 'lied', 'lies', 'hidden', 'hiding', 'secret', 'second phone', 'old phone', 'decoy', 'caught them', 'caught him', 'caught her'],
  },
  {
    key: 'popularity_pressure', bands: ['11-13', '13-15'],
    name: 'Feels pressure to be popular online',
    words: 'Ofcom 2026: 33 percent of 8 to 17 social media users feel pressure to be popular all or most of the time; 65 percent mostly watch rather than post.',
    mechanism: 'The feed is designed to be compared against, and a streak that cannot be lost is a leash dressed as a friendship.',
    response: 'Name the pressure without mocking it, teach the feed as a designed thing, and ask how they feel after scrolling rather than how long they scrolled.',
    prevent: 'The algorithm lessons at eleven, before the account, so the feed arrives as a thing they can see through.',
    source: OFCOM_2026,
    proof: { scripts: ['The streak they cannot lose', 'They cannot settle to anything any more', 'Comparing their life to influencers'], category: 'social-media', mechanic: ['check_in'], href: '/dashboard/lessons' },
    keywords: ['popular', 'likes', 'followers', 'streak', 'snap streak', 'compar', 'influencer', 'feed', 'scrolling', 'doomscroll'],
  },
  {
    key: 'content_shock', bands: ['11-13', '13-15'],
    name: 'What has he seen',
    words: 'Children\'s Commissioner: average first exposure to pornography at thirteen, 27 percent by eleven; Ofcom: nearly three quarters of 11 to 17s have seen harmful content.',
    mechanism: 'Exposure arrives through a friend\'s phone or a feed that got dark without a choice, years before the age anyone planned for.',
    response: 'The conversation before the exposure, and after it the door left open: what they saw, that it was not their fault, and that showing you never costs the phone.',
    prevent: 'The feed got dark script and the algorithm lessons at eleven, and the promise, so the first frightening thing is shown rather than carried alone.',
    source: CC_PORN,
    proof: { scripts: ['The feed got dark and they did not choose it', 'Finding Something Upsetting on Their Device', 'Their feed has started showing them self harm', 'The pornography conversation, before and after'], category: 'staying-safe', concernSlug: 'seen-something', mechanic: ['fair_play'], href: '/dashboard/scripts?category=staying-safe' },
    keywords: ['porn', 'pornograph', 'seen something', 'saw something', 'inappropriate', 'violent', 'gore', 'self harm content', 'disturbing', 'explicit'],
  },
  {
    key: 'strangers', bands: ['11-13', '13-15', '16+'],
    name: 'Strangers messaging her',
    words: 'NSPCC: 7,263 sexual communication with a child offences in a year, 40 percent on Snapchat where the platform was known, 80 percent of victims girls.',
    mechanism: 'Contact arrives inside games and disappearing message apps, and a child who fears losing the phone tells nobody.',
    response: 'Private accounts, no disappearing message apps at this stage, the report and block steps done together, and a child who knows telling you costs nothing.',
    prevent: 'Online gaming with strangers handled at eight to ten, and the promise, so the first message from a stranger at twelve comes straight to you.',
    source: NSPCC,
    proof: { scripts: ['A message from someone they do not know', 'Online gaming friends they have never met', 'Someone has a photo and is demanding money'], category: 'staying-safe', concernSlug: 'online-safety', mechanic: ['device_guide', 'fair_play'], href: '/dashboard/scripts?category=staying-safe' },
    keywords: ['stranger', 'someone they do not know', 'someone she does not know', 'someone he does not know', 'messaging her', 'messaging him', 'groom', 'predator', 'sextortion', 'nudes', 'photo of', 'demanding money', 'random'],
  },
  {
    key: 'ai_friend', bands: ['11-13', '13-15', '16+'],
    name: 'Talking to an AI like it is a friend',
    words: 'Internet Matters 2025: 64 percent of 9 to 17s have used a chatbot and 35 percent say it is like talking to a friend; Ofcom 2026: one in ten 8 to 17s has used AI as someone to talk to.',
    mechanism: 'A voice that is always patient and never critical is easier than a person, and the lonely child leans hardest.',
    response: 'Treat it as a stage topic, not a crisis: ask what they use it for and who else they talk to, then increase real contact before asking them to stop.',
    prevent: 'The first AI conversation at eight, together, with the rule that AI may explain and quiz but not answer, so AI arrives as a tool before it arrives as a friend.',
    source: IM_AI,
    proof: { scripts: ['What AI actually is', 'An AI chatbot as a friend', 'Ask the AI together, hints not answers'], category: 'school-and-ai', concernSlug: 'ai-chatbots', mechanic: ['passport'], href: '/dashboard/lessons' },
    keywords: ['chatgpt', 'chatbot', 'chat bot', 'character.ai', 'character ai', 'ai friend', 'ai girlfriend', 'ai boyfriend', 'talks to the ai', 'talking to an ai', 'snapchat ai', 'my ai'],
  },
  {
    key: 'confiscation_escalation', bands: ['11-13', '13-15'],
    name: 'It got physical when I took the phone',
    words: 'PARAPHRASE: three separate threads describe a parent who is frightened, of holding on, hitting, punching walls, running away.',
    mechanism: 'Confiscation is not a neutral tool for this age, it is the trigger, and screens used as in the moment leverage predicted more problematic use in a cohort of ten thousand.',
    response: 'Never take it off them in the heat of it. Step back, name what you will do later, and repair when everyone is calm. A parent who is physically afraid gets a script that starts from that fact.',
    prevent: 'The never allow or deny rail and the no confiscation promise, kept from the first phone, so the phone is never the thing taken and the fight never has that shape.',
    source: BRIEFING,
    proof: { scripts: ['When you are frightened of your own child', 'The no confiscation promise, said out loud', 'Hitting when they are angry'], category: 'staying-safe', mechanic: ['agreement'], href: '/dashboard/scripts?category=staying-safe' },
    keywords: ['hit me', 'hits me', 'punched', 'punching', 'kicked', 'frightened', 'scared of', 'afraid of', 'violent when', 'confiscat', 'took the phone', 'take the phone', 'grabbed'],
  },
  {
    key: 'family_shrinks', bands: ['11-13', '13-15'],
    name: 'Will not come out of the room',
    words: 'VERBATIM, from another parent in reply: "you\'re reaching the end of an era of Family Days Out".',
    mechanism: 'Partly developmental and partly reactance: controlling limits produce opposition that spreads beyond the rule, while limits with a reason the child hears do not.',
    response: 'Autonomy with a rationale: the agreement updated with them, a protected mealtime the whole family keeps, and one weekend thing a week that is theirs to choose.',
    prevent: 'Protected mealtimes and a family agreement in place at ten, so the bedroom years start with one door already open.',
    source: BRIEFING,
    proof: { scripts: ['When They Come Home and Go Straight to Their Room', 'Always on their phone, ignoring family', 'The Weekend Disappearing Act'], category: 'family-rules', mechanic: ['agreement', 'protected_window'], href: '/dashboard/scripts?category=family-rules' },
    keywords: ['their room', 'his room', 'her room', 'bedroom all', 'will not come out', "won't come out", 'ignoring us', 'ignores us', 'family time', 'days out'],
  },
  // ── 13 to 15 ──────────────────────────────────────────────────────────────
  {
    key: 'constant_battle', bands: ['13-15', '16+'],
    name: 'The constant, awful battle',
    words: 'VERBATIM thread title: "me and 13 yr old, the constant awful battle over screen time". Pew 2026: 44 percent of parents name social media the most negative influence on teen mental health.',
    mechanism: 'Adolescents file their own media use under personal jurisdiction, so a rule imposed reads as an incursion and gets resisted then concealed.',
    response: 'Move from parent regulation to shared: the child sets part of the rule, restrictions come off as trust steps up, and the rules are updated on a date rather than in a row.',
    prevent: 'The ladder from parent regulation to shared to self regulation, walked from eight, so at thirteen the handover is already half done.',
    source: MUMSNET_BATTLE,
    proof: { scripts: ['Negotiating screen time limits', 'Updating the rules', 'Removing restrictions', 'When rules feel unfair'], category: 'family-rules', mechanic: ['ladder', 'agreement'], href: '/dashboard/scripts?category=family-rules' },
    keywords: ['battle', 'constant', 'war', 'every night', 'wits end', "wit's end", 'nightmare', 'hell', 'losing my mind', 'teenager'],
  },
  {
    key: 'social_media_misery', bands: ['13-15', '16+'],
    name: 'Social media is making her miserable',
    words: 'Pew 2026: 48 percent of teens say social media harms people their age, up from 32 percent in 2022.',
    mechanism: 'Heavier use in the sensitivity window, eleven to thirteen for girls and fourteen to fifteen for boys, predicted lower life satisfaction a year later.',
    response: 'Specific platform habits rather than a blanket ban: which app, what time, how she feels after, and the feed curated together. Ban neutral by design.',
    prevent: 'The check in tracking mood after screens from the first account, so a slide is seen in weeks rather than a year.',
    source: PEW_2026,
    proof: { scripts: ['Mood drops after phone use', 'Social media is making them feel lonely', 'The Instagram Comparison Crash', 'Comparing bodies to influencers'], category: 'mood-confidence', concernSlug: 'mood-after-screens', mechanic: ['check_in'], href: '/dashboard/checkin' },
    keywords: ['miserable', 'anxious', 'anxiety', 'low mood', 'depressed', 'lonely', 'body image', 'self esteem', 'worthless', 'withdrawn'],
  },
  {
    key: 'sextortion', bands: ['13-15', '16+'],
    name: 'Someone has a photo and is demanding money',
    words: 'NSPCC: Snapchat named in 40 percent of grooming offences where the platform was known.',
    mechanism: 'The threat works because the child believes telling costs them everything; it is the promise, not the settings, that breaks it.',
    response: 'Do not pay, do not delete, screenshot and report, and say out loud that they are not in trouble. The script walks the first hour.',
    prevent: 'The no confiscation promise and the report and block steps practised at eleven, so the first threat comes to you within the hour.',
    source: NSPCC,
    proof: { scripts: ['Someone has a photo and is demanding money', 'A message from someone they do not know'], category: 'staying-safe', mechanic: ['fair_play'], href: '/dashboard/scripts?category=staying-safe' },
    keywords: ['sextortion', 'blackmail', 'demanding money', 'nude', 'nudes', 'intimate image', 'photo of them', 'threatening to share'],
  },
  {
    key: 'ai_companion', bands: ['13-15', '16+'],
    name: 'An AI girlfriend',
    words: 'Common Sense 2025: 72 percent of US teens have used an AI companion; Pew: about three in ten teens use a chatbot daily.',
    mechanism: 'A relationship with no friction is easy to prefer at fifteen, and most children tell nobody.',
    response: 'The relationship conversation, the same as any other: what it gives them, what it cannot, who else is in their week, and no shame in the asking.',
    prevent: 'AI as a tool from eight and the AI friend conversation at twelve, so by fifteen the question has been asked before.',
    source: CSM_AI_COMP,
    proof: { scripts: ['An AI chatbot as a friend', 'AI and your private data', 'An online romance'], category: 'school-and-ai', concernSlug: 'ai-chatbots', href: '/dashboard/scripts?category=school-and-ai' },
    keywords: ['ai girlfriend', 'ai boyfriend', 'companion', 'replika', 'character ai', 'in love with', 'relationship with an ai'],
  },
  {
    key: 'notifications_study', bands: ['13-15', '16+'],
    name: 'Revision with the phone buzzing',
    words: 'Common Sense: a median of 237 notifications a day; 43 minutes of phone use on a median school day.',
    mechanism: 'Every buzz is a switch, and switching is the cost, not the minutes.',
    response: 'Notifications off for the revision window, the phone in another room, and the agreement naming the exam weeks as protected.',
    prevent: 'Protected school hours and the homework window from the first phone, so exam season is a longer version of a rule that already exists.',
    source: CSM_COMPANION,
    proof: { scripts: ['Distracted by notifications', 'Exam and test anxiety', 'Grades and screen time'], category: 'school-and-ai', mechanic: ['protected_window', 'device_guide'], href: '/dashboard/devices' },
    keywords: ['revision', 'revise', 'gcse', 'exams', 'mocks', 'buzzing', 'notification', 'study'],
  },
  {
    key: 'controls_off', bands: ['13-15'],
    name: 'He turned the monitoring off',
    words: 'VERBATIM from Bark reviews: the VPN switched off, a different browser, a factory reset.',
    mechanism: 'At fifteen, surveillance the child did not agree to is a challenge, and the child will win it.',
    response: 'Agreement over surveillance: what you check, said out loud; what comes off as trust steps up; and the second account found handled as a conversation rather than a raid.',
    prevent: 'Oversight the child can see from the first phone, so there is nothing hidden to switch off.',
    source: BARK,
    proof: { scripts: ['Checking their phone', 'Removing restrictions', 'The second account you were not meant to find'], category: 'family-rules', mechanic: ['agreement', 'ladder'], href: '/dashboard/scripts?category=family-rules' },
    keywords: ['bark', 'qustodio', 'monitoring', 'turned off', 'factory reset', 'deleted the app', 'uninstalled'],
  },
  {
    key: 'gaming_late_spending', bands: ['13-15', '16+'],
    name: 'Gaming until late and spending their own money',
    words: 'House of Commons Library: 54 percent of 11 to 16s know loot boxes cost real money.',
    mechanism: 'Their own money and a late night lobby with friends remove the two brakes a younger child had.',
    response: 'Gambling mechanics named for what they are, a spend limit they set, and the bedtime window kept as the one rule that does not move.',
    prevent: 'The first gift card at eight and the bedroom rule at eleven, so the sixteen year old with a bank card already has the habits.',
    source: LOOT,
    proof: { scripts: ['Gambling mechanics in games', 'Gaming has taken over everything else', 'Gaming until very late'], category: 'gaming', mechanic: ['protected_window'], href: '/dashboard/scripts?category=gaming' },
    keywords: ['gambling', 'loot', 'gaming until', 'gaming late', 'all night gaming', 'his own money', 'her own money', 'spending his', 'spending her'],
  },
  {
    key: 'disappearing_messages', bands: ['13-15'],
    name: 'It disappears, so nothing counts',
    words: 'Ofcom 2026: Snapchat is the platform where the most 13 to 15s say they have been sent something they did not want.',
    mechanism: 'A message that vanishes feels consequence free to send and impossible to report.',
    response: 'Screenshot before it goes, the platform\'s own report route done together, and the conversation about why the app is built that way.',
    prevent: 'No disappearing message apps before thirteen, and the group chat skills before that.',
    source: OFCOM_EXP_2026,
    proof: { scripts: ['It disappears, so nothing counts', 'Something vile got forwarded into the group', 'Screenshots of a private chat going round'], category: 'social-media', href: '/dashboard/scripts?category=social-media' },
    keywords: ['snapchat', 'disappear', 'disappearing', 'vanish', 'forwarded', 'sent something'],
  },
  // ── 16 plus ───────────────────────────────────────────────────────────────
  {
    key: 'cannot_stop_self', bands: ['16+'],
    name: 'Cannot stop even when she wants to',
    words: 'Common Sense: over two thirds of 11 to 17s sometimes or often find it hard to stop, and use tech for relief from bad feelings.',
    mechanism: 'By sixteen the regulation has to be theirs, and the tools that held it for them are coming off.',
    response: 'Self regulation tools they choose: their own limits, their own detox, their own check in, with you as the person they report to rather than the person who sets it.',
    prevent: 'The ladder walked from eight means self regulation at sixteen is the last rung, not a cliff.',
    source: CSM_COMPANION,
    proof: { scripts: ['Managing their own screen time as a young adult', 'They want a digital detox but cannot stick to it', 'Healthy gaming versus addiction'], category: 'screen-time', mechanic: ['ladder'], href: '/dashboard/scripts?category=screen-time' },
    keywords: ['cannot stop', "can't stop", 'addicted', 'addiction', 'detox', 'wants to cut down', 'self control', 'own limits'],
  },
  {
    key: 'footprint', bands: ['16+'],
    name: 'What is already out there',
    words: 'PARAPHRASE: the university offer, the first job, and ten years of posts behind them.',
    mechanism: 'A footprint built at eleven is read at eighteen by people who were not there.',
    response: 'Clean up what is already out there together, and talk about reputation over time as a thing they now own.',
    prevent: 'Digital footprint lessons at thirteen, before the posts that matter.',
    source: OFCOM_EXP_2026,
    proof: { scripts: ['Cleaning up what is already out there', 'Your reputation over time'], category: 'social-media', href: '/dashboard/scripts?category=social-media' },
    keywords: ['footprint', 'reputation', 'old posts', 'university', 'employer', 'clean up'],
  },
  {
    key: 'run_out_of_rules', bands: ['16+'],
    name: 'They are sixteen and you have run out of rules',
    words: 'PARAPHRASE: the settings are theirs now and the parent is not sure what their job is.',
    mechanism: 'The point of the whole pathway was to make the system unnecessary; sixteen is when that has to be true.',
    response: 'The job changes from rules to relationship: the check in stays, the conversation stays, and the settings hand over.',
    prevent: 'Every stage before this one was the preparation for it.',
    source: BRIEFING,
    proof: { scripts: ['They are sixteen and you have run out of rules', 'Living at home as an adult'], category: 'screen-time', mechanic: ['ladder', 'passport'], href: '/dashboard/pathway' },
    keywords: ['sixteen', '16 year old', 'run out of rules', 'no rules', 'adult now', 'let go'],
  },
]

// The order parents raise them, per band. The array above groups issues by
// where they first appear; this is the ranking that matters at each age, from
// the two sweeps. Anything in the band not named here follows in array order.
export const BAND_ORDER: Record<AgeBand, string[]> = {
  '4-7': ['transition_off', 'post_screen_crash', 'cannot_self_occupy', 'autoplay', 'morning_screens', 'device_as_calm', 'parent_phone', 'siblings_fairness', 'mealtime_phones', 'holiday_creep', 'send_transitions'],
  '8-10': ['negotiation', 'in_game_spending', 'first_phone', 'class_group_chat', 'social_media_request', 'transition_off', 'gaming_stop', 'holiday_creep', 'send_transitions', 'controls_bypassed', 'homework_displacement', 'cannot_self_occupy', 'post_screen_crash', 'autoplay', 'morning_screens', 'siblings_fairness', 'mealtime_phones', 'parent_phone'],
  '11-13': ['group_chat_nasty', 'night_phone', 'sneaking', 'popularity_pressure', 'content_shock', 'strangers', 'homework_displacement', 'ai_friend', 'confiscation_escalation', 'family_shrinks', 'first_phone', 'negotiation', 'class_group_chat', 'social_media_request', 'controls_bypassed', 'gaming_stop', 'in_game_spending', 'post_screen_crash', 'holiday_creep', 'send_transitions', 'mealtime_phones', 'siblings_fairness', 'parent_phone'],
  '13-15': ['constant_battle', 'night_phone', 'social_media_misery', 'content_shock', 'sextortion', 'ai_companion', 'notifications_study', 'controls_off', 'gaming_late_spending', 'disappearing_messages', 'group_chat_nasty', 'sneaking', 'popularity_pressure', 'strangers', 'ai_friend', 'confiscation_escalation', 'family_shrinks', 'homework_displacement', 'controls_bypassed', 'mealtime_phones', 'parent_phone'],
  '16+': ['night_phone', 'cannot_stop_self', 'social_media_misery', 'ai_companion', 'gaming_late_spending', 'sextortion', 'notifications_study', 'parent_phone', 'strangers', 'ai_friend', 'constant_battle', 'footprint', 'run_out_of_rules'],
}

/** The issues for a band, in the order parents raise them at that age. */
export function issuesForBand(band: AgeBand): DeviceIssue[] {
  const inBand = DEVICE_ISSUES.filter(i => i.bands.includes(band))
  const rank = new Map((BAND_ORDER[band] ?? []).map((k, i) => [k, i]))
  return [...inBand].sort((a, b) => (rank.get(a.key) ?? 999) - (rank.get(b.key) ?? 999))
}

/** The categories a band's issues fall in, most raised first, with the issue that put it there. */
export function bandIssueCategories(band: AgeBand): { category: DeviceIssue['proof']['category']; issue: DeviceIssue }[] {
  const seen = new Set<string>()
  const out: { category: DeviceIssue['proof']['category']; issue: DeviceIssue }[] = []
  for (const issue of issuesForBand(band)) {
    if (seen.has(issue.proof.category)) continue
    seen.add(issue.proof.category)
    out.push({ category: issue.proof.category, issue })
  }
  return out
}
