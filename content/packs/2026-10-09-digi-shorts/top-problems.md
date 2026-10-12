# The top five parent problems

I chaired the nine reports and ranked problems on the four weights in the brief, in order. (1) Frequency: the Reddit study (330 coded posts, Oct 2025 to Oct 2026), the Mumsnet and UK sweep (51 threads, about 2,260 posts, plus 667 UK App Store reviews) and the UK survey numbers in that report's table. (2) Intensity: the Reddit share of posts at level 3 and the Mumsnet language scan. (3) Whether the product demonstrably solves it, using only the code mapper's proof paths. Before writing, I checked these strings in the repo myself: the three thinking lines in components/digi/ThinkingReassurance.tsx (lines 56, 57, 63); the outcome copy "Sorted! That is a great day." and "Off your list. We will check in a week that it held." in lib/concerns/outcome.ts (lines 84 to 85); the protected window push in app/api/quests/time/start/route.ts:332; the worry tiles "Coming off screens", "Bedtime screens" and "Asking for a phone" in lib/onboarding/worries.ts (lines 44, 45, 49); the moment cards at 073_moments_library_by_age.sql lines 103, 111 and 225; and the scripts "The two minute warning is making it worse" (migration 261) and "Everyone Else Has It" (migration 151). (4) Whether a fifteen second screen moment exists, using the UX spec and the ref route table. Where specialists disagreed I say so in the digest and decide. Every parent quote below comes from a report, is word for word as that report gives it, is under 25 words, and keeps its URL. I re-opened none of the web pages myself. I left out quotes whose wording contains a dash.

## 1. The switch off fight: coming off screens

**In parents' words:** Paraphrase of the cluster, not a quote: every time it goes off there is a battle, the warnings get gamed, I end up giving in, and I just want the one sentence that works.

**Ages:** 3 to 12, sharpest 4 to 10 (Reddit cluster skews 0 to 8; Mumsnet runs 3 to 16)

**Why it ranks:** It is the Mumsnet sweep's number one problem, and it was the most discussed theme in the Reddit comments (16 of 86 coded comments). On Reddit it scored 49 percent at intensity 3, including hitting and banging on walls, though it ranked sixth by title count because it usually sits inside posts about something else. The UK numbers come from named sources: a third of British parents say setting limits leads to conflict (More in Common, October 2025, https://www.moreincommon.org.uk/research/parents-talk-online-safety/), and 32 percent of parents find screen time hard to control (Ofcom, Children and Parents report, May 2026, p56). Parents ask, almost word for word, for what the product sells: the one sentence. The evidence also backs the product's shape. Endings went better when the technology ended the session, and two minute warnings went with more upset (Hiniker et al. 2016, CHI, 28 families, children aged 1 to 5, an association in a small sample).

**What they already tried:** Countdowns at 30, 20, 10 and 5 minutes, which fail mid round and get gamed ("I'm still in the middle of the game"). Kitchen and visual timers. Saying "last episode". Telling the child the TV is broken, which costs the parent trust. Cold turkey on one app. Letting the console say no, which is the version parents say worked best: "so it’s not you but the device doing the restricting".

**What DiGi does differently:** DiGi does not lock anything. It gives one move and the exact words for tonight, for this child at this age, and every reply ends on a Tonight line. The timer becomes the messenger, so the parent is not the one who ends it: a shared countdown runs on both phones and both get the alarm at zero. The worry goes onto the daily check in. If the parent rates it hard going, DiGi offers help for tonight. If they rate it going great, it comes off the list and returns a week later to check it held. If a suggestion did not work, it is not offered again.

**Proof in the code:** Worry tile "Coming off screens" (lib/onboarding/worries.ts:44). Free script "The two minute warning is making it worse" (supabase/migrations/261_situations_scripts.sql). Its say this line reads: "When this episode finishes, the tablet finishes too. Not me, the tablet. Let us watch the last bit together and see the end come. Then it is your turn to press the button." Thinking line "Looking for the words you can actually use." (ThinkingReassurance.tsx:63). Reply shape: under 120 words, ending on a Tonight line (lib/digi/system.ts). ParentDeviceTime.tsx: "The countdown runs on their phone and yours at the same time" and "When it reaches zero, both phones get the alarm." Child view: the spoken line "Ten more seconds, then it is time for some offline fun." then "Time for offline fun!" (DeviceTimeCard.tsx). Outcome copy is in lib/concerns/outcome.ts. Two cautions. The moment card "Turning the screen off ends in tears" (073:103) advises a two minute warning, which contradicts the evidence, so do not film it until it is fixed. And no device is ever locked.

**The moment to film:** Illustrative family, labelled. In 15 seconds: (1) the child's real timer view, zoomed, counting down its last ten seconds to "Time for offline fun!"; (2) cut to DiGi with the parent's illustrative line "Switching off the tablet ends in tears every time. What do I say?"; (3) one real thinking line at 72px, "Looking for the words you can actually use."; (4) the script's say this line lifted out at 64 to 76px: "When this episode finishes, the tablet finishes too. Not me, the tablet." End on the stage check. Use only for early years content, because the warning evidence covers children under six.

**Quotes (verbatim, as fetched 9 October 2026; consent needed before any paid use):**

- "Right now it feels like ending screen time always turns into a small battle..." https://www.reddit.com/r/Parenting/comments/1rtg6t7/how_do_you_end_youtubecartoon_time_peacefully/
- "What’s the one sentence that reliably works at your house to end screens without a meltdown?" https://www.reddit.com/r/raisingkids/comments/1p9r67n/whats_your_calm_nobattle_way_to_end_screen_time/
- "Every time I take it off her she has a meltdown so it’s easier for me to give in." https://www.netmums.com/coffeehouse/drop-clinic-984/child-mental-health-1029/4f157c5c-get-3-year-old-off-my-phone.html
- "She started shouting at me and flat out refused as she hadn’t finished her round." https://www.mumsnet.com/talk/special_educational_needs/5297968-roblox-causing-issues-asd
- "It is exhausting and the tantrums can last for hours." https://www.reddit.com/r/Parenting/comments/1wdvhzu/my_daughter_seems_determined_to_think_that_we/
- "If the new one starts, then he's usually very upset." http://faculty.washington.edu/jkientz/papers/Hiniker-Tantrums-CHI2016.pdf

## 2. Everyone else has one: the first phone and being left out

**In parents' words:** Paraphrase of the cluster, not a quote: everyone in the class has one, I don't want a knee jerk no, I don't want to cave either, and I can't tell if I'm protecting them or holding them back.

**Ages:** 8 to 12, peak Years 5 to 7 (Reddit 47 mentions at 9 to 12; UK trigger is Year 6 into Year 7)

**Why it ranks:** It is the second largest Reddit cluster (82 of 330 posts, and the largest UK share), Mumsnet's number two, and the head teacher's number three. Intensity is moderate (15 percent at level 3), but the dread builds for years and it is the cliff edge this product exists for. Phone ownership rises from 56 percent at age 10 to 83 percent at 11 (Ofcom, May 2026). It has the best funnel fit of any problem, because the honest answer to "should I?" is "find the stage", which is the call to action itself. Parents ask outright for a staged route rather than a yes or a no. The under 16 ban (spring 2027) does not settle the Year 6 phone or WhatsApp, so the film can stay ban neutral.

**What they already tried:** Gizmo and Gabb watches, flip and brick phones, a house phone ("every single one quickly just becomes the kids phone"), holding out until 13, 14 or 16, Snapchat held back to 14, WhatsApp only, trial periods, and delaying together with other parents through the Parent Pact. Some gave in and regret it. Others found the exclusion simply moved to group chats and Roblox.

**What DiGi does differently:** DiGi never gives a flat yes or no, which is a non negotiable. It answers with where this child is on the pathway, what has to be true first, and what to say to the child tonight. The stage check is the free front door: three questions, no sign up, and the result answers each ticked worry with what the parent can do tonight.

**Proof in the code:** Worry tile "Asking for a phone" (lib/onboarding/worries.ts:49). Stage check at app/(marketing)/starter-pack/page.tsx, where the questions come before any account. ResultScreen.tsx answers each worry with a tonight action. Scripts: "The Year 6 phone plan, before the box is opened" (sort 9653, free) and "Everyone Else Has It" (migration 151). Moment card "Everyone else has a phone" (073:111). Thinking lines "Finding where your child is on their pathway." and "Never a flat yes or no. Working out your next step." (ThinkingReassurance.tsx:56 to 57). PassportBook stage pages (ref-passport-book). Cautions: avoid the ref-digi-chat fixture line "the answer is not yet, with a date", which reads as a verdict. The Explorer age band is "11 to 12" in stages.ts but "11 to 13" in the fixture, so check before filming. Never say "ready" or "safe". Say "stage".

**The moment to film:** Hook text from frame one: "Not an age. A stage. Which is yours?" (8 words). Pencil height marks on a door frame (hands only), then the stage check's first question full frame. The "Asking for a phone" tile is ticked. The result screen shows the tonight action, then a pathway passport page. One real thinking line at 72px: "Finding where your child is on their pathway." The end card is the call to action itself.

**Quotes (verbatim, as fetched 9 October 2026; consent needed before any paid use):**

- "she is the last kid in her class without one and we finally caved." https://www.reddit.com/r/Parenting/comments/1oqd01i/yesterday_we_finally_gave_our_almost12yo_a_phone/
- "I genuinely can't tell anymore if I'm protecting him or holding him back." https://www.reddit.com/r/raisingkids/comments/1vp51lf/torn_about_my_sons_first_phone_is_not_getting_him/
- "I don’t want to say a knee jerk no but I don’t want to open a can of worms either." https://www.mumsnet.com/talk/teenagers/5482297-talk-to-me-about-snapchat-please
- "“Everyone else has it…” is the bane of modern parenting!!" https://www.mumsnet.com/talk/parenting/5338132-9yo-massive-tantrum-after-playing-fortnite?reply=144402745
- "So it's a few days into the start of Year 7 and my children are asking for a smartphone each." https://www.reddit.com/r/UKParenting/comments/1w85xct/is_it_time_for_a_phone_smartphone_for_secondary/

## 3. Always the bad guy: policing without a plan

**In parents' words:** Paraphrase of the cluster, not a quote: I'm the only one holding the line, taking it away is the only lever left, it turns into a war, and I'd rather the system said no than me.

**Ages:** 4 to 16; the bad guy cluster spreads across all ages, and confiscation fights are 9 to 16

**Why it ranks:** I merged three clusters that share one root, our own phrase "policing without a plan": the bad guy, controls that fail, and confiscation as the last lever. Each cluster is large and among the most intense. On Reddit: another adult undoes the rule (55 posts, 42 percent at level 3); sneaking and controls failing (45 posts, 60 percent, the highest of any cluster); confiscation as the only lever (28 posts, 50 percent). In the Mumsnet sweep, controls that fail rank third and a split between partners ranks eighth. Only 35 percent of UK parents use parental controls, and 16 percent of 13 to 17 year olds say they know how to get round them, though only 5 percent say they have (Ofcom, May 2026, p58). Reddit commenters are already improvising the star quest by hand (earning appears in 17 comments). This is the one problem no competitor answers, and the answer is the star quest, so this short is also the screen timer film Justin asked for.

**What they already tried:** Family Link, Apple Screen Time, Qustodio, Bark, router schedules, passcodes, lock boxes, wifi off, confiscation and grounding. Children get round them with browsers, second accounts, the neighbour's wifi or a restart ("there are no parental controls that will work to stop a child who is determined to bypass them"). Parents agreed rules with a partner that fell apart in the moment, and grandparents decline the role. One commenter: "you're not teaching him restraint, you're restraining him."

**What DiGi does differently:** We are not parental controls. The deal is agreed together, and jobs earn stars at the child's own rate (5 minutes a star by default), with a weekly cap. A free daily core can be switched on. Protected time cannot be bought with stars. A start that breaks the deal goes to the parent as an ask, never a flat no, and the parent can spend stars, gift time or give a free bonus. The countdown is shared, and the timer ends the session. DiGi quotes the family's own signed agreement back to them, ranking it second only to safety, so the agreement is the referee rather than the parent's mood.

**Proof in the code:** app/api/quests/time/start/route.ts turns a start into an ask in four cases: the trust level is "Ask first" (the default), it falls in a protected window, it goes over 1.5 times the daily guide, or the child is short of stars. Parent push: "{name} is asking for screen time ⏳". The parent's options are "Spend their stars", "Gift it" and "Free bonus". The star rate is STAR_MINUTES, 5 by default, settable per child (lib/quests/templates.ts:25, TimeTiersCard). weeklyStarCap is in lib/quests/star-week.ts, the three kinds of time card is in lib/quests/time-tiers.ts, and the child sees "Your stars are safe." DiGi PRECEDENCE_RULES put the signed agreement second (app/api/digi/route.ts). Cautions: no device is locked, so never claim the timer cannot be got round. ParentDeviceTime hardcodes "five minutes" even when the rate is custom. How a second parent joins is not verified, so do not claim every adult signs. Never frame it as "earn your screens", and never claim it cuts screen time (Tang 2018; Nagata 2024, both cross sectional).

**The moment to film:** The timer short, using real components with made up data. (1) The child taps "Ask for 30 min 🙋" (ref-ask-first?view=child). (2) The parent's real push lands: "{name} is asking for screen time ⏳", with "30 minutes on the TV, that is 6 stars. Tap to say yes on your board." (3) The parent taps yes, and the countdown appears on both phones side by side (ref-ask-first?view=timer). (4) Zero, and both alarms. On screen line: "The timer says stop. Not you." Hold longest on the ask, which is what no competitor has.

**Quotes (verbatim, as fetched 9 October 2026; consent needed before any paid use):**

- "I’m tired of being the only consistent parent and always ending up the bad guy." https://www.reddit.com/r/Parenting/comments/1qfvg02/mealtime_screen/
- "It's utterly miserable constantly policing screen time." https://www.mumsnet.com/talk/am_i_being_unreasonable/5046965-me-and-13-yr-old-the-constant-awful-battle-over-screen-time?reply=134432124
- "When I confiscate a device he gets physically violent and it gets very ugly until I cave." https://www.reddit.com/r/Parenting/comments/1qu6gn9/iphone_laptop_pc_is_ruining_my_once_sweet_little/
- "This means I am not having the battle but the xbox itself just tells them they have only 5.mins left." https://www.mumsnet.com/talk/am_i_being_unreasonable/5046965-me-and-13-yr-old-the-constant-awful-battle-over-screen-time?reply=134428087
- "You don't even need to be the bad guy then, the system does it for you." https://www.reddit.com/r/Parenting/comments/1qze9ni/how_do_you_handle_kids_and_gaming/o4c19sb/
- "I put on automatic limits and she can earn more with chores." https://www.reddit.com/r/Parenting/comments/1qze9ni/how_do_you_handle_kids_and_gaming/o4aj3jb/

## 4. Bedtime and the phone at night

**In parents' words:** Paraphrase of the cluster, not a quote: phones off at ten and the same argument every night, then I find them on it after midnight and they can't get up for school.

**Ages:** 8 to 16 for phones in bed; younger children for bedtime stalling. The head teacher view puts tiredness in Years 5 and 6

**Why it ranks:** It ranks lower on frequency than the marketers would like. It is fifth in the Mumsnet sweep, and on Reddit bedtime fights were "rarer than expected" (night appears in 19 posts). But it is intense (53 percent at level 3 on Reddit, where night is when teenagers sneak), the head teacher puts it second, and it has the cleanest proof path in the whole product. Bedtime is protected by default, no stars can buy it, and a start inside it goes to the parent as an ask. The guidance backs it: the RCPCH (2019) advises screens off about an hour before sleep, and the UK Chief Medical Officers (2019) advise phones out of the bedroom. The bedtime window in the product defaults to an hour before a typical bedtime. It also keeps the existing hero cold open.

**What they already tried:** A fixed handover time with phones charged downstairs, wifi off at a set time, downtime settings (which Roblox ignored: "today I found DS at bloody 5am on it"), taking all tech into the parents' room, and negotiating every night.

**What DiGi does differently:** Bedtime is a protected window that no stars can buy. A start inside it is not refused. It becomes an ask to the parent, who decides with full information, and the child gets a warm line rather than a lock. The child's phone gets no notifications overnight. DiGi gives the words for the handover, and the worry is tracked on the five faces. No sleep outcome is promised.

**Proof in the code:** checkProtectedWindow in lib/quests/time-tiers.ts. Default bedtime windows by age band: 18:00, 19:00, 20:00 or 21:00, each running to 07:00, with none at 16 plus. Push at app/api/quests/time/start/route.ts:332: "{name} is asking for screen time in a protected window 🌙", with "It is inside their bedtime window, so it came to you instead of starting. Yes runs it anyway, your call." The child sees "🌙 Screens are resting now. I know that is disappointing. Morning is coming." The parent popup at ref-ask-popup?bedtime=1 says "Screens are meant to be resting right now. Saying yes still works." No notifications reach the child's phone from 19:00 to 07:00 (lib/push/quiet-hours.ts). Worry tile "Bedtime screens" (worries.ts:45). Script "The phone is in their room all night" (9622, free). "Bedtime stalling and one more thing" is a moment card (073:225), not a script. Cautions: never promise better sleep (the SCREENS RCT found no EEG sleep change), never make blue light claims, and never put the Carter odds ratios on screen.

**The moment to film:** Illustrative, 8.10pm. The child taps Start on the real child view and gets "🌙 Screens are resting now. I know that is disappointing. Morning is coming." Cut to the parent's real popup with "Screens are meant to be resting right now. Saying yes still works." and the Yes, Not now and Decide later buttons. On screen line: "Bedtime is protected. No stars can buy it." A gold underline on "protected".

**Quotes (verbatim, as fetched 9 October 2026; consent needed before any paid use):**

- "Phones off at 10, yet every night there are the same screen requests and the same arguments (DD13)." https://www.mumsnet.com/talk/teenagers/4758526-phones-in-bedrooms-overnight?reply=124466321
- "Last night I caught him after midnight on his phone with Snapchat AGAIN!" https://www.reddit.com/r/daddit/comments/1syyrry/dads_i_need_help_with_14_yr_old_bypassing/
- "she would gladly stay up past midnight most nights and be exhausted." https://www.mumsnet.com/talk/_chat/5540072-are-our-teenage-phone-cut-off-times-during-term-time-too-strict?reply=152799990
- "she’s watching her phone in bed and not getting up for school." https://itunes.apple.com/gb/rss/customerreviews/page=2/id=1150085200/sortby=mostrecent/json

## 5. The group chat and what they come across

**In parents' words:** Paraphrase of the cluster, not a quote: something happened in the chat late at night, I found out on Monday, and I'm frozen about what to say without either spying on them or ignoring it.

**Ages:** 9 to 16; the Year 5 and 6 WhatsApp group is the primary flashpoint

**Why it ranks:** It is the most intense theme in both parent studies (Reddit: 58 posts, 45 percent at level 3; Mumsnet: sixth by frequency, but the strongest language). It is also the head teacher's number one: 74 percent of primary respondents named online bullying as the most common online risk (Tes Safeguarding Report 2025), and 69 percent of parents worry about age inappropriate content (Ofcom, May 2026). The under 16 ban leaves WhatsApp out. It ranks fifth rather than higher because parents raise it less often day to day, and because the film can never show the harm. It can only show the words and the route to real help. The DiGi safety rail that names the school's DSL is the strongest single reason a head would share our film.

**What they already tried:** Strict settings and chat turned off (game signs get round them: "functionally free text fields"), monitoring alerts, reading messages, removing devices, resetting the Google age, going to the school with screenshots, and involving the police.

**What DiGi does differently:** DiGi does not monitor the child. It talks to the parent. It gives the reception line first (thank you for telling me, you are not in trouble), then one safety step and the words. If a message touches safeguarding, a fixed human signpost streams before the model says a word, naming CEOP and the school's Designated Safeguarding Lead.

**Proof in the code:** SAFEGUARDING_OPENER and CRISIS_OPENER in lib/digi/safety.ts, which name CEOP at ceop.police.uk and the school's Designated Safeguarding Lead, and are streamed before the reply on a keyword match. Thinking line "If it is ever serious, DiGi points you to real people first." Worry tile "What they come across online". Issue bank entries class_group_chat ("The Year 6 WhatsApp group") and group_chat_nasty in lib/content/device-issues.ts. Cautions: detection is by keyword, and the after reply checker only records. The scripts "When Group Chat Drama Comes Home" and "The class group at eleven at night" are named by the head teacher report but were not checked in the database. device-issues' "Over half of 8 to 11s already use WhatsApp" is unverified (Ofcom 2025 says 23 percent of 3 to 12s have a profile). WhatsApp's UK minimum age is not confirmed. Never show harmful content, and never use grooming numbers as a fear hook.

**The moment to film:** Text only cold open, labelled illustrative: "Saturday, 10.52pm. 47 unread in Year 6 chat." Cut: "Monday, 8.50am." Cut to the parent that evening typing to DiGi, then one beat of the real thinking line "If it is ever serious, DiGi points you to real people first." Then the reply's reception line. No uniform, no school logo, no child's face. This is also the school newsletter cut, with no price.

**Quotes (verbatim, as fetched 9 October 2026; consent needed before any paid use):**

- "links to porn being circulated by 11 year olds on a year 6 WhatsApp" https://www.mumsnet.com/talk/am_i_being_unreasonable/5301706-to-not-allow-my-almost-11-yo-a-mobile-phone?reply=143093692
- "And the explanations have me kind of frozen." https://www.reddit.com/r/Parenting/comments/1o2kggf/when_to_tell_your_kids_exactly_what_they_need_to/
- "How do I talk to him about this?" https://www.mumsnet.com/talk/teenagers/5566751-found-porn-use-and-questionable-websites-on-ds16-phone
- "kids who apparently are fine in person and turn into raging bullies as soon as they are behind a screen" https://www.reddit.com/r/Parenting/comments/1pdnelg/mean_kid_drama_and_social_media/
- "where’s the line between keeping her safe and spying on her?" https://www.reddit.com/r/Parenting/comments/1oal7ua/wheres_the_line_between_protecting_your_kids/

## Caveats

The ranking rests on help seeking forum posts. They show how parents talk once they post, not how common each problem is in the population. The Reddit coding was done by one person, covers only about twelve months, and is US skewed (39 of 330 posts are UK). I verified the product strings listed in the method myself. Everything else in the code proofs relies on the code mapper's report. The scripts "When Group Chat Drama Comes Home" and "The class group at eleven at night", how a second parent joins, and the live research count (142) were not checked. The worry tile counts in starter_leads.answers were not queried, so nothing may be called "the top five" yet. Using anonymous Reddit and Mumsnet quotes in paid ads raises a consent question. Use them organically with their link, or replace them with labelled illustrative lines. Three items need Justin. First, which DiGi raster to use and whether to pull the full resolution originals. Second, the credit cost of any new star expressions. Third, whether the homepage \"Rachel\" testimonial is real and permissioned. Two product fixes should land before filming: the moment card \"Turning the screen off ends in tears\" advises the two minute warning that the evidence contradicts, and the first thinking line overstates, because DiGi can search the web. The school angle has a further gap: protected school hours are off by default, so copy must say \"you can protect school hours\". WhatsApp's UK minimum age and the Internet Matters AI figure are unconfirmed.

## The panel digest

DIGEST FOR EVERY LATER AGENT: THE DIGI SHORTS SERIES (chair's synthesis of nine reports, 9 October 2026)

THE RANKING
1. The switch off fight, coming off screens. LEADS.
2. Everyone else has one, the first phone. LEADS.
3. Always the bad guy, policing without a plan, answered by the star quest. LEADS, and it is the screen timer film.
4. Bedtime and the phone at night. Keeps the hero cold open, and is the strongest proof of protected time.
5. The group chat and what they come across. It is also the school newsletter cut.
Parked: "nothing else worth doing", the crowding out cluster. It is the biggest Reddit cluster by count (85 posts), but the product cannot honestly show it solves it without implying less screen time, and "addicted" framing is banned. Guilt runs under all five. Handle it through tone (no blame, one next step), not as its own short.

WHERE THE SPECIALISTS DISAGREED, AND THE DECISION
* Bedtime. The short form marketer and the head teacher put it in the top three. The parent voice studies do not: Reddit found bedtime fights rarer than expected, and Mumsnet ranks it fifth. Decision: rank four for frequency. It keeps the existing cold open, and protected bedtime is the hero frame inside the timer short.
* The group chat. The head teacher ranks it first. Parents raise it less often. Decision: rank five, with a dedicated newsletter cut that has no price.
* The thinking line "Checking our reviewed research, not the open web." The scientist says do not feature it, because DiGi has a live web_search tool used for apps, law and researcher figures. The UX lead notes that every real wait starts on that line. Decision: never lift it or hold on it. In the in phone beat, start the capture once line 2 or 3 is up; that is still the real rotation. Tell Justin the product line wants rewording, for example to say it checks reviewed research for parenting advice. That is feedback for the code, so it goes through the feedback filter.
* "Top 5 moments". Justin asked for them. The scientist says do not call them the top five without usage data. Decision: the five on screen are the five problems above, each named by its real worry tile. Do not write "top" until someone runs an aggregate count of the worry tiles parents ticked in starter_leads.answers. That query was not run.
* The two minute warning. The moment card "Turning the screen off ends in tears" (073:103) advises one, but Hiniker 2016 found warned endings went with more upset in children aged 1 to 5. The free script "The two minute warning is making it worse" (migration 261) already agrees with the evidence. Decision: film the script, and fix the moment card before it appears anywhere.
* Star quest framing. "Earn your screen time" will not survive a hostile developmental expert: Tang 2018 and Nagata 2024, both cross sectional, link using screens as a reward with more screen time. Decision: say "A plan you make together. The timer keeps time. Bedtime cannot be bought." Never claim stars cut screen time, build motivation or build responsibility. Stars are for jobs, never for reading or things the child already loves.
* Length and format. The growth lead wants nine videos. The UX lead wants a 35 to 45 second hero. Decision: a 9:16 master. The hero is recut to 35 to 45 seconds, with the call to action by about 40 seconds, plus a longer 16:9 rebuild for YouTube and LinkedIn. Wave 1 is the hero, shorts 1 to 3 at 21 to 34 seconds each, and the star quest timer short at 30 to 45 seconds. Wave 2 is shorts 4 and 5, a founder short and a proof short.

TRUTH FIXES FROM THE CODE (must do before any styling)
* "How did that go?" is NOT a lock screen push. It is a Home card ("Checking back, as promised", buttons "It worked", "Helped a bit", "Not really") or a line on the check in. The only DiGi pushes are "DiGi stepped in" and "A reminder you asked DiGi for".
* "Bedtime stalling and one more thing" is a moment card, not a script. Chat links sit inside the text as bold underlined links. There is no "Read the script" card.
* "Bedtime: going great. Resting for a week." and "WE DID IT" are not product copy. Use the real lines: "Sorted! That is a great day." and "Off your list. We will check in a week that it held. If it comes back, log it as a moment." (lib/concerns/outcome.ts:84 to 85).
* No parent can see DiGi's memories. Drop the memory cloud, or make it plainly editorial with at most five typographic cards.
* DiGi has seven tools, not five. The three message cap applies to the four day trial, not to free accounts.
* Only the crisis and safeguarding openers come before the reply. The checker runs afterwards and only records. DiGi names sources in its text but shows no links. DiGi learns about a family inside that family's records. It is not trained on families.
* Nothing is locked. The timer is a shared countdown with pushes.
* Use the 3D clay star (DiGi-star-3d.png, which the product renders, with its GSAP moods: idle, speak, happy, thinking, wave), plus the approved Kling idle loop. Retire the SVG from films. Justin to confirm the raster and the full resolution originals.
* The ref fixtures carry Justin's real children's names (Teo, Olga, Alma Rose), which are AMBER under the privacy rules. Swap them to the film family, Ava, 9, and Sam, 6, before any capture. Hide the Next.js dev badge.
* Label the family on first appearance with "AN EXAMPLE FAMILY. REAL APP SCREENS." and repeat it on the end slate. Never say "real conversation". Any DiGi reply on screen comes from the real component and is either captured or checked against the rails. Avoid the ref-digi-chat fixture line "the answer is not yet, with a date".

THE RESEARCHER ROW (scene 6)
* "Four researchers lead" becomes "Research we draw on", with "Their published research, not an endorsement." on paid cuts.
* Orben: "Timing matters, girls earlier than boys." (girls 11 to 13, boys 14 to 15, both at 19; small effects).
* Przybylski: "Small effects. How, not just how long."
* Odgers: "Offline life predicts online risk."
* "Peer reviewed papers and the big UK datasets" becomes "Studies, national surveys and charity reports. Each one checked by a person before DiGi can use it."
* "A ban delays. Preparation lasts." becomes "A deadline is not a plan."
* The 142 findings is a code comment dated 7 October, not a live count. Use "Over 140" or check the count.
* digi/02-scientists.md, which DiGi loads, has the Orben window wrong and the 0.4 percent finding credited to the wrong paper. Fix it.

LINES THAT SURVIVE A HOSTILE EXPERT
* "Stopping is harder than starting."
* "Children were less upset when the device ended it." (Hiniker et al. 2016, ages 1 to 5)
* "Warnings alone do not fix it. Endings do." (same tag)
* "Plan the ending together, before it starts."
* "Screens rest an hour before bed. Paediatricians say the same." (RCPCH 2019; proof path lib/quests/time-tiers.ts)
* "The UK's Chief Medical Officers advise phones out of the bedroom at night."
* "Bedtime is protected. No stars can buy it."
* "School keeps phones away all day. The evening is where the plan has to live." (DfE, Mobile phones in schools, statutory from September 2026)
* "Not an age. A stage."
NEVER: dopamine hit, addicted as a label, rewiring, "not finished until 25", blue light kills melatonin, the goldfish attention span, screens cause depression, "safe" or "ready for social media", any count of what worked for other families, or the 60, 75, 90 and 120 minute guides presented as official limits (the code names no source for them).

NUMBERS ALLOWED ON SCREEN (each with its source)
* Phone ownership 56 percent at 10, 83 percent at 11 (Ofcom, Children and Parents report, May 2026).
* A third of British parents say setting limits leads to conflict (More in Common, October 2025).
* 32 percent of parents find screen time hard to control, 49 percent of parents of 16 to 17s (Ofcom 2026, p56).
Not allowed: the "9 in 10 parents" ban figure without DSIT's own caveat that it is not representative; Mumsnet's "61 percent addicted" (unsourced); Internet Matters' 64 percent (not verified); Carter's odds ratios presented as cause.

THE REAL THINKING LINES TO FEATURE (from ThinkingReassurance.tsx; they rotate every 2.2 seconds; never present them as a live step by step log)
* "Finding where your child is on their pathway."
* "Never a flat yes or no. Working out your next step."
* "Looking for the words you can actually use."
* "What other parents found, never who they are."
* "If it is ever serious, DiGi points you to real people first."
Capturing the rotation needs POST /api/digi stubbed with a held response. The beat should be the biggest UI moment in the film: the avatar tilting in its thinking mood, with the line at 72px.

THE PATHWAY AS THE APP SHOWS IT
TodayPathBig (ref-today-path) on Home, PassportBook (ref-passport-book), and the child's KidPath. The full StageRoad, "The road to 16", is not mounted anywhere live, so use it only as brand art, never as "the app".

READABILITY (Justin's zoom note)
* Body text at least 47px in the 9:16 master, with a floor of 31px.
* Drop the phone frame for reading beats. Scale the UI 2.6 to 4.2 times.
* Hold time = 0.6 seconds + words divided by 3.3 (200 words a minute), never under 1.4 seconds. Move the camera, then hold still while a line is read.
* Critical safe box in the 1080 by 1920 frame: x 90 to 990, y 285 to 1550.
* Never set text in gold #EDC35F. One gold underline per beat.

HOME PAGE BACKDROP
Use the butter radial gradient, the headline "A clear digital pathway from first screen to 16.", the Planet Friends road and the passport. Crop out the announcement bar, the generated photo of children, the "Rachel" quote (unverified) and the founder price.

CALL TO ACTION AND MEASUREMENT
* Every piece ends on "What stage is your child? Three questions, no sign up." at guidedchildhood.com/starter-pack. This is true in the code: the questions come first and the account comes last.
* The code counts no stage check starts, and there are no per video source tags. Before the 30 October review, build per video links on the existing /s/<code> pattern, with anonymous start and completion counts. Claim a migration number first if one is needed.
* Paid cannot carry 8,000 checks: £1,000 buys roughly 370 to 700 starts on illustrative assumptions. Organic reach, sends and Justin's LinkedIn carry the load. Put a send instruction in the first caption line, for example "Send this to whoever does bedtime in your house."

FORMAT LESSONS FROM WHAT WORKS (TikTok counts read 9 October 2026)
* The parent's own question shown from frame one (Knibbs, 6.5M plays, organic).
* A silent real screen plus one line of text (Life360, 7.2M plays in 12 seconds).
* A mascot as a character (Duolingo).
* A visible countdown for a list of five (Dr Julie).
* Saves come from one usable thing, never from outrage.
* We copy the structure, never the person: no actors and no AI parents (CAP 2.3 and 3.47; ASA guidance of 11 June 2026).
* Parent quotes go in organic captions with their link. Paid use needs the poster's permission, or a labelled illustrative line instead.