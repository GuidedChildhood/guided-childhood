# Parent problem log

What UK parents of children aged 4 to 16 are stuck on with phones, games and
apps, in their own words, ranked. This is the output of Prompt B in
`plans/2026-11-14-answer-series-email-courses-and-child-films-plan.md`. It sits
beside `content/research-radar-log.md` and feeds the choice of topic for the
answer series from week 4 onward.

One sweep per dated section. Add a new section for the next sweep rather than
editing this one, so a later session can see what moved.

## Sweep of 14 November 2026

### How to read this, and what it cannot tell you

- **A count is a count of threads we saw, never a claim about all parents.**
  "Read" means the thread's opening post was opened and carries a date between
  2024 and 2026. "Title only" means the thread appeared in search results and
  was not opened, so its date is unknown and it may be old.
- **Every thread is Mumsnet**, apart from two on the MoneySavingExpert forum.
  Mumsnet skews to mothers and to a particular kind of household. Treat the
  ranking as "what Mumsnet parents post about", which is close to our perfect
  customer and is still one room.
- **Reddit gave nothing.** No thread from the UK parenting communities came up
  in nine searches aimed at them, and Reddit refuses a direct read from here.
  Netmums gave nothing in three searches. Not covered, rather than quiet.
- **Public Facebook pages were not readable without a login.** One attempt on
  the Smartphone Free Childhood page returned a title and no posts. We stopped
  there. The questions under popular posts are therefore not in this sweep.
- **The quotes need a spot check before any of them is published.** Each short
  phrase is marked VERBATIM by the reader that opened the page, but the page
  came through a reading tool, so a person should open the thread and confirm
  the exact words first. PARAPHRASE means the theme was seen and the wording
  was not captured.
- **No usernames and no personal details are stored.** Search results exposed
  two usernames during the sweep and neither was recorded. Links point to the
  thread, never to a person.
- 53 searches and 91 opening posts read across three passes, with overlap
  between them. A thread is counted once per problem. Where a thread speaks to
  two problems it is marked "shared".

### The ranked log

Ranked by how often the problem came up in threads we read, then by how well
the product can answer it today. "Pack" means a verified research pack or
briefing in this repo. "Proof path" means a real screen, script or guide.

| Rank | Problem | Read, 2024 to 2026 | Title only | Age it bites | Verified pack | Proof path |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Coming off the screen: the meltdown, the rage, the nightly fight | 12 | 12 | 3 to 12 | Yes | Strong |
| 2 | The first phone: when, and how to hold out | 9 | 11 | 9 to 12, peak Year 6 | No | Strong |
| 3 | Roblox and online games at primary age: who can reach my child, too young, left out | 8 | 10 | 6 to 10 | Yes | Strong |
| 4 | The phone in the bedroom at night, and when to relax the rule | 7 | 5 | 12 to 16 | No | Strong |
| 5 | Homework is on the screen, so the screen cannot come away | 6 | 10 | Primary to GCSE | Adjacent only | Medium |
| 6 | WhatsApp and group chats, Year 6 into Year 7 | 5 | 8 | 10 to 11 | Yes | Strong |
| 7 | Snapchat and TikTok before 13: "all her friends have it" | 5, plus 2 shared | 1 | 10 to 13 | No | Strong |
| 8 | YouTube: Shorts, what they stumble into, the comedown after | 5 | 6 | 4 to 12 | No | Medium |
| 9 | Parental controls: which one, how much, and they do not hold | 4 | 7 | 11 to 14 | Partial | Medium |
| 10 | The under 16 ban: when, what counts, will it work | 3 | 8 | All | Yes, not rechecked | Strong |
| 11 | Money in games: the parent's card, and pocket money on Robux | 3 | 2 | 8 to 10, one at 15 | Adjacent only | Strong |
| 12 | They saw something they should not have, and what do I say | 2 | 3 | 5 to 14 | Draft only | Strong |
| 13 | AI doing the homework, and AI as a companion | 2 | 4 | Secondary, 13 | Yes | Strong for companions, medium for homework |
| 14 | Two houses, two sets of rules | 2, plus 3 shared | 0 | 6 to 11 | No | Not checked |
| 15 | Messenger and Messenger Kids | 0 | 0 | None seen | No | NOT OURS for now |

### Each problem in full

#### 1. Coming off the screen

- **How often:** 12 threads read, January 2024 to September 2026. 12 more by
  title only. Five are about children of 3 to 7 and a tablet or the television.
  Seven are about Fortnite, Roblox and consoles at 8 to 12.
- **Their words:** "the tantrums are unreal". "she just completely lost it".
  "these meltdowns really do take over the evening". "I'm tired of having to
  remind her". "I know it's my fault". "I don't want to go down the punishment
  route". All VERBATIM, spot check first.
- **Age:** 3 to 7 for the tablet, 8 to 12 for games. Two of the threads about
  3 year olds sit below our range of 4 to 16.
- **Already tried:** warnings at ten and five minutes, visual timers, ignoring
  the screaming, taking the tablet away for days, deleting the game, play every
  other day, cold turkey. Several say the warnings make it worse.
- **Worth knowing:** four of the twelve say the child is autistic or has ADHD.
  A pack on this topic that ignores that will miss a third of the room.
- **Pack:** `briefings/2026-09-09-parent-device-problems-v2.html`, verified.
  `content/packs/2026-11-13-boundaries-pilot/` is a draft with abstracts
  checked only.
- **Proof path:** issues `transition_off`, `negotiation` and `gaming_stop` in
  `lib/content/device-issues.ts`; scripts "The two minute warning is making it
  worse" (migration 261) and "The stopping point agreed in a calm moment"
  (363); the guide `screen-time-arguments`; the star timer.

#### 2. The first phone

- **How often:** 9 threads read, April 2024 to October 2026. 11 more by title
  only. Four ask what age. Five are parents trying to hold out on a smartphone
  while the class moves the other way.
- **Their words:** "I've been putting it off". "worry about mine being the odd
  ones out". "I'm truly terrified at the prospect". "how to make a smart phone
  dumb". "Clueless here so any advice is appreciated!". All VERBATIM, spot
  check first.
- **Age:** Year 6 dominates. Also 9, and Year 7.
- **Already tried:** holding to "end of primary", a brick phone, a tracker tag
  in place of a phone, the Smartphone Free Childhood pact (three threads, one
  saying it has not caught on locally), a written list of dos and don'ts,
  arranging plans through the other child's parent.
- **Not found:** walking to school did not come up as a stated reason in
  anything read.
- **Pack:** none verified. `content/packs/2026-10-14-first-phone-ad/` is advert
  creative, not research.
- **Proof path:** `app/(dashboard)/dashboard/phone-setup`; the Year 6 to Year 7
  bridge at `dashboard/secondary`; the script "The Year 6 phone plan, before
  the box is opened" (261); the guide `when-should-my-child-get-a-phone`.

#### 3. Roblox and online games at primary age

- **How often:** 8 threads read, April 2024 to March 2026. 10 more by title
  only. Four are about strangers, chat and friend lists. Two ask whether the
  child is too young. Two are about the child being left out or picked on for
  not playing.
- **Their words:** "she's now got over 100 friends on there". "they could even
  be adults". "AIBU to think 6 is too young for Roblox?". "I also don't want
  him left out." "Is it terrible to say no?". All VERBATIM, spot check first.
- **Age:** 6 to 10, with 8 the most named.
- **Already tried:** chat off, a PIN to add friends, a rule of real friends
  only, logging in as the child, an outright ban, saying yes to Minecraft and
  no to Roblox. In one thread the child changed her age to 13 to get round the
  settings. In another the parent stopped at the ID check.
- **Not found:** parents say "too young", not the age rating. No thread was
  built around the rating itself.
- **Pack:** `briefings/2026-11-13-roblox-predators-ban-v2.html`, verified, and
  the draft pilot pack. This is week 1 of the plan and is held by another
  session.
- **Proof path:** the Roblox settings guide (migrations 093 and 385); issues
  `strangers` and `in_game_spending`; the guide `roblox-robux-spending`.
  Fortnite and Minecraft have console guides only, no script and no guide of
  their own, so the answer is strong for Roblox and thin for those two.

#### 4. The phone in the bedroom at night

- **How often:** 7 threads read, April 2024 to August 2026. 5 more by title
  only.
- **Their words:** "it's really affecting her sleep". "what age have you felt
  you could relax this rule?". "She has turned against me". "without completely
  breaking trust". All VERBATIM, spot check first.
- **Age:** 12 to 16 in six of the seven. One is a 10 year old. This bites
  later than we tend to write it.
- **Already tried:** phones downstairs as a standing rule, set bedtimes, a lock
  after midnight, "open conversations". The live question for the older ones is
  when to let go, which is the ladder to self regulation in the parent's own
  words.
- **Pack:** none.
- **Proof path:** issue `night_phone`; scripts "The phone is in their room all
  night" (186) and "Phone to bed, unasked, and a night light for it" (254);
  protected windows in `lib/quests/time-tiers.ts`.

#### 5. Homework is on the screen

- **How often:** 6 threads read, February 2024 to October 2026. 10 more by
  title only, several clearly older. Two of the six are from the last thirteen
  months, so this looks live.
- **Their words:** "we can't get a break from the screen". "it's all online".
  "Has anyone chosen to request paper homework". "She seems to have no
  self-control". "the messages are constantly pinging". All VERBATIM, spot
  check first.
- **Age:** young primary through to GCSE.
- **Already tried:** screens off before homework, then the homework is a
  screen; asking for paper; unannounced checks; sitting beside the child. In
  one thread the school blocked apps for two years and then handed the job to
  the parents.
- **Pack:** `briefings/2026-10-07-school-day-routines-v3.html` is next door to
  this, not on it.
- **Proof path:** issue `homework_displacement`; scripts "Homework on a device
  with constant distraction" and "Phone during homework" (in
  `supabase/seeds/`, so confirm they are live rows before any claim); protected
  school hours. The homework decoder explains the homework, it does not answer
  the drift, so it is not the proof path here.

#### 6. WhatsApp and group chats

- **How often:** 5 threads read, January 2025 to November 2026, and one from
  January 2023. 8 more by title only.
- **Their words:** "I wish I never got the blooming phone now." "the trust
  between us has been lost". "bigger and harder to keep a check of". "She feels
  invisible and excluded". All VERBATIM, spot check first.
- **Age:** 10 and 11, Year 6 and Year 7.
- **Already tried:** taking the child out of the group (a classmate added him
  back), screenshots to the school, deleting the app, phone checks, friend
  groups only, a two week break that left the child more left out.
- **Not checked:** results disagreed on the minimum age for WhatsApp in the UK.
  Nothing here states one.
- **Pack:** `briefings/2026-08-27-first-whatsapp-moment-v2.html`, verified.
  Week 2 of the plan.
- **Proof path:** five WhatsApp scripts in migration 180, issues
  `class_group_chat` and `group_chat_nasty`, the WhatsApp settings guide.

#### 7. Snapchat and TikTok before 13

- **How often:** 5 threads read, September 2024 to October 2025, plus 2 shared
  with the first phone. 1 more by title only.
- **Their words:** "I'm so tired of the constant battle on this topic." "I know
  she will want Snapchat which i know nothing about." "what am I missing??"
  "How on earth do you protect your child from social media?". All VERBATIM,
  spot check first.
- **Age:** 10 to 13.
- **Already tried:** a flat no, said again and again; WhatsApp offered instead;
  a friends only setup; Family Centre; weekly checks; a phone with no social
  apps at all.
- **Not found:** no recent thread about Instagram at this age.
- **Pack:** none on Snapchat.
- **Proof path:** four Snapchat scripts in migration 180, including "Everyone
  is on Snapchat and they are not"; the Snapchat settings guide; issue
  `social_media_request`; module `ks2-26-why-thirteen`.

#### 8. YouTube

- **How often:** 5 threads read, July 2024 to May 2026. 6 more by title only.
- **Their words:** "They're not calmer or absorbed in what they watched."
  "'shorts' videos seem to be the same content as tiktok". "That ipad is never
  out of her hands". All VERBATIM, spot check first.
- **Age:** 4 to 12. Two of the five say the child is autistic.
- **Already tried:** a ban, the built in time limit (the child moves to another
  app), the internet switched off, another streaming service instead.
- **Not found:** no recent thread squarely about YouTube Kids for a 4 to 8
  year old.
- **Pack:** none.
- **Proof path:** the YouTube and YouTube Kids device and settings guides
  (migrations 014, 093, 385) and issue `autoplay`. Guides only, no script.

#### 9. Parental controls

- **How often:** 4 threads read, May 2024 to March 2026, and three from 2022
  and 2023. 7 more by title only. Six further threads on other forums where the
  country is not shown.
- **Their words:** "do not deliver what they promise". "lull parents into a
  false sense of security". "she now refuses" to have it back on (PARAPHRASE
  of the rest). "At what age do you give them complete control". VERBATIM
  unless marked, spot check first.
- **Age:** 11 to 14.
- **Already tried:** Family Link, Screen Time, the school's own setup guide,
  the mobile network, a broadband control that was later withdrawn.
- **Pack:** partial, in the parent device problems briefing.
- **Proof path:** issues `controls_bypassed`, `controls_off` and `sneaking`;
  `dashboard/devices`. Our honest answer is that the tool is not the plan,
  which is the philosophy rather than a fix for their settings.

#### 10. The under 16 ban

- **How often:** 3 threads read, March 2025 to June 2026. 8 more by title only.
- **Their words:** "Will people try to get round it?" "When is it likely to
  kick in?" "it's not a silver bullet". VERBATIM, spot check first.
- **Already tried:** not applicable. The questions are when, what counts, and
  what happens to accounts a child already has.
- **Pack:** three ban packs exist. None was rechecked in this sweep, and the
  dates and rules quoted in search results were not checked against the
  government's own pages.
- **Proof path:** the `social_media_law` flag, the script "The account they
  already have is going to have to go" (153). We stay ban neutral.

#### 11. Money in games

- **How often:** 3 threads read, January to October 2025. 2 older ones by
  title. The large sums came from replies and news, not opening posts.
- **Their words:** "It seems such a waste to me". "I just feel really harsh
  saying no." VERBATIM, spot check first.
- **Age:** 8 to 10.
- **Already tried:** a cap of five pounds, a monthly allowance, a wait of a few
  days before buying, unlinking the card.
- **Pack:** the star system evidence pack is next door to this.
- **Proof path:** scripts "The first gift card, before the first spend" (261)
  and "They have spent real money on the game" (186); module
  `ks2-05-gaming-time-spend`.

#### 12. They saw something they should not have

- **How often:** 2 threads read (February 2024, June 2025). 3 more by title.
- **Their words:** "I really don't know how to approach my son". "I don't want
  to come on too strong". "now I am angry with myself for letting it happen."
  VERBATIM, spot check first.
- **Not found:** no thread about a child who will not tell, and no recent one
  where a stranger had messaged the child. Few parents post this in public,
  which is a reason the count is low and not a sign it is rare.
- **Pack:** `content/packs/2026-11-13-disclosure-pilot/`, draft.
- **Proof path:** `dashboard/tell-a-parent`; issue `content_shock`; the script
  "The no confiscation promise, said out loud" (261).

#### 13. AI for homework and AI as a companion

- **How often:** 2 threads read (July 2024, January 2026). 4 more by title.
- **Their words:** "Every day they get homework and do it on ChatGPT."
  VERBATIM, spot check first.
- **Pack:** `briefings/2026-07-17-children-and-ai.html` and the October pack.
- **Proof path:** the script "Ask the AI together, hints not answers" (261),
  `dashboard/ai-module`, issues `ai_friend` and `ai_companion`.
- **Reading:** we hold more research on this than parents are posting about.
  It is a topic we lead on, not one they are asking for yet.

#### 14. Two houses, two sets of rules

- **How often:** 2 threads read (September 2023, April 2024), and 3 shared
  with other problems where an ex or a friend's house undid the rule.
- **Their words:** "pretty much unrestricted access to gaming". "His dad
  clearly has no issue with this". VERBATIM, spot check first.
- **Proof path:** not checked in this sweep. If the product has no script for
  the other house, this is NOT OURS until it does.

#### 15. Messenger and Messenger Kids: NOT OURS for now

No thread found. It appeared only as something other parents suggest in place
of WhatsApp. The product holds a few lines in the Facebook settings guide and
no script. No demand seen and no proof path, so it does not become content.

### What kept turning up across problems

- **Left out.** The fear of the child being the odd one out pulls against the
  parent's own judgement in the first phone, Roblox, WhatsApp and Snapchat
  threads alike. It is the feeling under four of the top seven.
- **The school as the source.** The school sets the app, hands over the tablet
  or runs on the class chat, then leaves the filtering to the parent.
- **Letting go.** Parents of 14 to 16 year olds ask when to relax a rule, not
  how to set one.
- **A tired no.** Several say they are worn out by saying no with nothing to
  offer in its place, which is "policing without a plan" from THE-STORY.md,
  still said in nearly the same words.

### The next three topics to research

Weeks 1 to 3 of the plan are already set (Roblox, the first WhatsApp group,
the first phone) and the sweep supports all three: they rank third, sixth and
second. For week 4 onward:

1. **The phone in the bedroom at night.** Seven threads, the strongest product
   answer we have without a pack behind it, and the question of when to relax
   the rule is one nobody else answers.
2. **Snapchat before 13.** Tied to the first phone in the threads, four
   scripts ready, no research pack.
3. **Homework on the screen.** Six threads and rising, and the school is the
   one creating it, which also gives the schools side something to say. The
   scripts need confirming as live before the pack makes any claim.

Coming off the screen ranks first and does not need new research: the verified
briefing and the boundaries draft already cover it. It needs a refresh check
and then production, with the autistic and ADHD households written in.

### Not done, said plainly

- Reddit, Netmums and public Facebook pages are not in this sweep.
- No quote has been checked by a person against the page.
- Title only threads are undated and were not read.
- The two houses problem has no proof path check.
- Nothing here is a figure for publication. A thread count is not a statistic.
