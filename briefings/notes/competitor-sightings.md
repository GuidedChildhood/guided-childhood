# Competitor sightings

A running log of products seen in the wild that sit near ours, so the
competitor watch lens (`.claude/agents/review-competitor-watch.md`) checks them
each run instead of rediscovering them. Newest first. One entry per product:
where it was seen, what it sells, how close it is to us, and anything worth
borrowing that fits the philosophy.

The bar for "close": does it do our core loop, getting a child ready for a
phone and social media with the parent and child together, staged to 16? Nothing
logged here does yet.

---

## 14 October 2026, second sweep (Instagram paid ads, researched)

### Balance Phone (thebalancephone.com). Closest to our hook.
- **Seen:** Instagram ad, "Is your child ready for a phone? [N] questions. A
  clearer answer. Take the quiz", over a photo of children swimming.
- **What it is:** a Barcelona company selling a minimalist Samsung phone with
  the addictive apps removed: Balance Phone Kids €299, Balance OS €79 a year on
  your own Samsung (their site, 14 October). Campaign "Wait until they really
  need it". Around the device: a Phone Agreement both sides sign, readiness
  questionnaires, set up and first week guides, and "Balance University"
  content from psychology professionals (vein.es coverage).
- **How close:** the nearest anyone has come to our thesis, and its ad is
  almost our hook. The difference is the answer. Their quiz answers ready or
  not ready, which is allow or deny, and it ends at a phone purchase. Our stage
  check names the stage and the next step, starts at age 2, and ends at a plan
  (commitment 1, never allow or deny).
- **Borrow:** the real world photo (children outdoors, no screen in sight) as
  the visual answer to a phone question. The proof that the hook works:
  somebody is paying to run it.
- **Watch:** whether they add lessons for the child. If they do, they are a
  competitor for the same parent; until then they could be a partner (a family
  that buys their phone still needs the plan).

### Qustodio. The incumbent has taken our language.
- **Seen:** Instagram ad, "Screen time shouldn't be a battle. Set healthy
  limits and make everyday digital routines easier." Button: "Protect my child
  now". A 30 minute daily limit dial. 13.3K followers.
- **How close:** the blocking tool THE-STORY section 2 names. What is new is
  the words: they now lead on the battle, our pain, and answer it with a timer.
  2026 releases on their blog: block apps by category (13 February), gaming
  alerts (10 March), rules that change through the day (20 March).
- **Borrow:** nothing to build. The lesson is that "battle" alone no longer
  marks us out; the answer has to (the words, the plan, the child earning).

### Nuet (nuet_ai). The plainest ad of the lot.
- **Seen:** Instagram ad. "It reads the school emails. You stop missing things.
  End of Ad." Caption: "no clever ad here ... that's the whole pitch."
- **What it is:** connects to Gmail, Outlook, iCloud or Yahoo and WhatsApp
  groups, pulls school dates into the family calendar (maker's page and
  directory listings; iOS; a free year to Mumsnet testers).
- **How close:** not a screens product, but it overlaps one feature we already
  have: the school letterbox (`components/school/SchoolLetterbox.tsx`,
  `app/api/school/inbound/route.ts`, live at `/dashboard/school` since
  17 to 25 September). `content/brand-story/service-post-map.md` still says do
  not claim it, written 24 September, before the setup was rebuilt.
- **Borrow:** the plain voice. One job, two short sentences, stop.

### Sylva, again
Same school morning ad, now as a video. A web search found no listing under
that name; the nearest named UK tools are Hazel (Spicy Minds, Bristol) and
Neura. Sylva's screens show a persona called Hazel, so it may be Hazel's
consumer brand. Unconfirmed.

### What to take for our campaigns, from both sweeps

1. **Say it plainly, then stop** (Nuet). Two short lines of what it does. Card
   C in `content/packs/2026-10-14-first-phone-ad/` is this.
2. **Name one moment, not a category** (Kairoo's "time's up every night",
   Sylva's "school morning battles"). Card B is this.
3. **"Battle" is no longer ours** (Qustodio). Lead on the answer: the words for
   tonight, a plan to sixteen, the child earning their time.
4. **The readiness quiz is contested** (Balance Phone). Keep our hook word for
   word, and when there is room add the difference: we never say ready or not
   ready, we say the stage and the next step.
5. **Show a real screen in a hand** (Sylva, FamilyWall, Nuet all do). We have
   format 4 for exactly this, with real screenshots only.
6. **A real outdoor photo can answer a screen question** (Balance Phone). Ours
   comes from the family archive, never stock, never generated.
7. **Do not copy:** fear buttons ("Protect my child now"), "expert built" with
   no named expert, star ratings and review counts we do not have, stock
   photos of a mother and child.

## 13 October 2026, Justin's Instagram feed (paid ads)

Seven ads in one evening. Instagram served them because Justin's account reads
as a parent interested in parenting tech, so this is targeting, not a measure of
who is winning. Most carried 1 to 5 likes.

### Kairoo, "the family screen use agreement app". The closest yet.
- **Seen:** Instagram ad, free to download. No web presence found on 14 October
  (a search for the name returns only generic agreement templates), so it is new
  or very small.
- **What it does:** the family agrees a screen bedtime; the app gives the
  reminders ("10 minutes to wrap up", "Time to finish up") and a sleeping
  kangaroo character tells the child "That's time". It has an allowance idea:
  "One extra a day is in the deal."
- **Their line:** "You don't have to be the one saying 'time's up' every night.
  Let Kairoo do it."
- **How close:** one slice of ours, the agreed time and the protected window.
  No stages, no lessons, no earning (the star rate), no scripts for the hard
  conversation, no schools. Its promise is the app takes the job off the
  parent, which is the opposite of commitment 2 (connection is the
  protection): we give the parent the words, not a stand in.
- **Borrow:** the pain line, not the answer. "Saying time's up every night" is
  the policing without a plan feeling in THE-STORY section 2, in seven words.
  Our answer stays ours: protected time already exists (`lib/quests/time-tiers.ts`,
  the protected windows no stars can buy), and a start inside it goes to the parent
  as an ask.

### Neuly, "the expert built AI for neurodivergent parenting"
- **Seen:** Instagram ad, UK pre release, 14 days free, web app at app.neuly.ai.
  No independent coverage found on 14 October.
- **What it does:** a chat session "about Henry"; it listens, then gives
  "clear, personalised guidance".
- **How close:** the general parenting chatbot the 11 October advice warned
  about (`plans/2026-10-11-ai-and-saas-advice-weighed.md`, point 6). DiGi
  already carries the family's stage, memory and research base
  (`lib/digi/brain.ts`, `lib/digi/family-state.ts`). Narrower audience
  (neurodivergent) and no screens focus.
- **Borrow:** nothing to build. Worth watching whether "expert built" without
  named experts becomes the category's default claim; ours stays evidence or
  silence.

### Sylva (my.sylva), routines for neurodivergent children
- **Seen:** Instagram ad, seven day free trial.
- **What it does:** school morning strategies; named helper personas (Phoenix,
  Hazel, Luna) ask what is feeling hardest; a "stress test" check in for the
  parent.
- **How close:** adjacent. Its check in for the parent is the nearest thing to
  ours (`components/daily/ConcernCheckIn.tsx`), but it is about mornings and the
  parent's stress, not screens or readiness.

### Hand in Hand Parenting, anger and aggression course
- **Seen:** Instagram ad, self guided course at $54.99, followed by a known
  screens clinician's account.
- **How close:** low, but philosophically the nearest. Their caption opens "You
  know connection matters", which is our commitment 2. A one off course, no
  daily loop, nothing on phones. Evidence that connection based parenting sells
  as a paid product.

### Not competitors (logged so nobody chases them again)
- **FamilyWall** and **Cozyla Calendar Plus 2:** family calendars and
  organisers. Logistics, not raising a child with screens.
- **Goldie:** appointment scheduling for salons. Not a parenting product.

### What the sweep says about our position
Nobody in the seven names the first phone, social media, or the road to 16. That
gap is the message: every ad and post of ours opens on the phone moment and
ends at the stage check. The draft that does this is
`content/packs/2026-10-14-first-phone-ad/`.
