# App safety week, moved to 30 November to 14 December 2026

APPROVED by Justin, 23 November 2026: "push to next week, just do next weeks if any full, no want you to do it auto". So every post moves out of this week, which is full, into the next free slots, and goes out automatically through Metricool once it is connected (see Automatic posting below). Nothing is posted yet.

The job: send parents to the new app safety pages (the guide at /app-safety-guide, 20 apps, an age page for each age 6 to 15), every page ending at the free check and then the stage check at /starter-pack. Christmas is the honest hook: new phones, tablets and consoles arrive, and with them the first asks for apps.

Note on dates: the week of 23 November was full on both accounts. The family posts take next week's four anchor days. Justin's LinkedIn is at its three a week cap next week too (063, 059 on Wednesday 2, the Sunday 6 booking) and holds 062 on Monday 7, so the three LinkedIn posts take the next free slots after that.

## Posting plan

| Day | Platform | Post | Link |
|---|---|---|---|
| Mon 30 Nov, 10:00 | Instagram and Facebook, family | F4. Founder Monday: the kitchen table | None. Founder Monday never carries a link or an ask |
| Tue 1 Dec | Pinterest | P1. Is Roblox safe for a 9 year old? | https://www.guidedchildhood.com/is-roblox-safe-for-9-year-old?utm_source=pinterest&utm_medium=social&utm_campaign=app-safety-week&utm_content=pin-roblox-9 |
| Wed 2 Dec, 10:00 | Instagram and Facebook, family | F1. Research Wednesday: 13, 16 and 18 | Instagram: Story link sticker to https://www.guidedchildhood.com/is-tiktok-safe?utm_source=instagram&utm_medium=social&utm_campaign=app-safety-week&utm_content=ig-three-ages. Facebook: in the post, https://www.guidedchildhood.com/is-tiktok-safe?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=fb-three-ages |
| Thu 3 Dec | Pinterest | P2. Is Minecraft safe for a 7 year old? | https://www.guidedchildhood.com/is-minecraft-safe-for-7-year-old?utm_source=pinterest&utm_medium=social&utm_campaign=app-safety-week&utm_content=pin-minecraft-7 |
| Fri 4 Dec, 10:00 | Instagram and Facebook, family | F2. Service Friday: five WhatsApp settings | Instagram: Story link sticker to https://www.guidedchildhood.com/is-whatsapp-safe?utm_source=instagram&utm_medium=social&utm_campaign=app-safety-week&utm_content=ig-whatsapp-five, and the stage check line points at the bio link. Facebook: in the post, https://www.guidedchildhood.com/is-whatsapp-safe?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=fb-whatsapp-five |
| Sat 5 Dec, 10:00 | Instagram and Facebook, family | F3. Happy News Saturday: the good in the Christmas list | Instagram: Story link sticker to https://www.guidedchildhood.com/app-safety-guide?utm_source=instagram&utm_medium=social&utm_campaign=app-safety-week&utm_content=ig-christmas-list. Facebook: in the post, https://www.guidedchildhood.com/app-safety-guide?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=fb-christmas-list |
| Sat 5 Dec | Pinterest | P3. Is YouTube safe for an 8 year old? | https://www.guidedchildhood.com/is-youtube-safe-for-8-year-old?utm_source=pinterest&utm_medium=social&utm_campaign=app-safety-week&utm_content=pin-youtube-8 |
| Wed 9 Dec, 08:00 | LinkedIn, Justin | L1. TikTok's terms have three ages in them | First comment: https://www.guidedchildhood.com/is-tiktok-safe?utm_source=linkedin&utm_medium=social&utm_campaign=app-safety-week&utm_content=li-three-ages |
| Fri 11 Dec, 08:00 | LinkedIn, Justin | L2. A check with no score at the end | First comment: https://www.guidedchildhood.com/app-safety-guide?utm_source=linkedin&utm_medium=social&utm_campaign=app-safety-week&utm_content=li-no-score |
| Mon 14 Dec, 08:00 | LinkedIn, Justin | L3. The school parent pack | First comment: https://www.guidedchildhood.com/schools/parent-pack?utm_source=linkedin&utm_medium=social&utm_campaign=app-safety-week&utm_content=li-parent-pack |
| Any day, when a parent asks | Facebook parent groups | G1. Reply template | Last line of the reply: https://www.guidedchildhood.com/is-snapchat-safe-for-12-year-old?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=group-reply |

**Why each link sits where it does.** LinkedIn cuts the reach of a post that sends people away, so the link goes in the first comment. Instagram captions cannot hold a working link, and our bio link already goes to the stage check, so the app page goes on a Story link sticker the same day. Facebook does not punish links, so it goes in the post. Pinterest is built for the click, so every pin carries the exact page. In a parent group the answer comes first and the link last, so it reads as help.

`utm_content` is added to each link so every post earns its own number; the campaign stays `app-safety-week` as asked.

## Check before anything goes out

1. **Moved, 23 November.** Both accounts were full this week, so Justin pushed everything on. The family posts take next week's anchor days (Founder Monday 30, Research Wednesday 2, Service Friday 4, Happy News Saturday 5). LinkedIn stays at three a week: the week of 30 November is full and Monday 7 holds 062, so L1 to L3 go out Wednesday 9, Friday 11 and Monday 14 December. If 063 or the unclaimed Metricool slots are dropped, L1 can come forward.
2. **The family cards are built in Sunday 29 November's batch** (`social-week`), which takes these four as the week's brief, so they come out in the house card system from the approved cutouts.
3. **The app safety guide is not yet in `content/brand-story/service-post-map.md`.** Proposed new entry: "Is it safe for my child?", route `app/(marketing)/[slug]/page.tsx`, data `lib/app-safety/apps.ts`, check `components/app-safety/ReadinessCheck.tsx`.
4. **One founder scene is used, in L1** (setting up the controls on his own children's apps was harder than he expected, GREEN). Logged as a draft row in `content/brand-story/founder-scenes-used.md`.
5. **Hidden thread.** Every piece is a brick, none is the one in ten. Each names the app's design honestly and turns to the child and the plan; none casts a platform as the villain or argues the ban.

## Automatic posting

Justin, 23 November 2026: he wants these to go out automatically rather than post them himself. Claude has no LinkedIn, Instagram or Facebook connection of its own, so automatic means through our scheduler. That is Metricool (brand 8056608), which already carries Justin's LinkedIn and the family Instagram and Facebook.

- **Route one, the one asked for:** a Metricool API key saved on this environment, so Claude books each post in Metricool with automatic publishing on, at the times in the plan, and the Monday routine can do the same each week. Metricool's API needs its Advanced plan.
- **Done, 23 November:** the three LinkedIn posts, with their times, first comments and images, are in the Approval Desk as `METRICOOL HANDOFF App safety week LinkedIn` for ChatGPT to book with automatic publishing on. The images are real screens from the live site, captured with Playwright, in `images/` here and in the same Drive folder.
- **Until the key exists:** this file is the handoff. Scheduling and automatic publishing are approved by Justin for every post in the plan, at its time, so ChatGPT can book them in Metricool from here as it does for the GDC posts.
- **Pinterest** goes the same way if Pinterest is connected in Metricool; if it is not, the three pins wait until it is.

Every post keeps its exact text. A change goes back through Claude, never into the Metricool draft.

---

# LinkedIn, Justin's voice

## L1 · Wednesday 9 December · TikTok's terms have three ages in them

**Hook**

TikTok's own UK terms have three ages in them: 13, 16 and 18.

**Body**

TikTok's own UK terms have three ages in them: 13, 16 and 18.

Most parents only ever see the first one.

In a couple of weeks a lot of new phones and tablets come out of wrapping paper. One of the first things a child asks for is the app their friends already have.

The App Store says 13+. It reads like a single line. Over it, or under it.

The terms draw three. 13 for an account. 16 for direct messages, which are switched off before then. 18 for going LIVE and for virtual items.

None of those is a readiness line. They are the company's rules for what an account can do. A store rating describes the content. Neither one has met your child.

Setting up the controls on our own children's apps was harder than I expected, after years of reading the research.

So we built the page I wanted back then. One for each of twenty apps children ask for, and one for each age from 6 to 15. The company's own minimum age, with a link to where we read it. The store ratings. The settings to switch on first, step by step, from the company's own help pages.

Where we could not confirm something at its source, the page says so instead of guessing. I would rather a parent read "see its terms" than a number we made up.

Each page ends with a free check. Three questions, no sign up, nothing saved, and no score.

The question I kept coming back to was what is in place before a child opens the app.

The TikTok page is in the first comment.

If you think the age on the box tells parents less than it seems to, a repost puts this in front of someone deciding this month.

Which app did your child ask for first, and how old were they?

**First comment**

The TikTok page, with the terms, the ratings, the settings and the sources: https://www.guidedchildhood.com/is-tiktok-safe?utm_source=linkedin&utm_medium=social&utm_campaign=app-safety-week&utm_content=li-three-ages

**Image.** A real photo of Justin from the bank, at the laptop or the kitchen table where the pages were built. No screen visible that shows a child's name. If no photo fits, use the real fact box from /is-tiktok-safe captured with Playwright at 390 wide (the `webapp-testing` skill), never a mock up.

**Proof path.** Ages: `lib/app-safety/apps.ts`, tiktok, `minAge.note` (checked true, TikTok Terms of Service EEA and UK, clauses 4.3 and 4.4). "Teens can watch LIVE but cannot host" is the LIVE risk line in the same entry. "Says so instead of guessing": `minAgeLine` and `ratingsLine` in `lib/app-safety/content.ts`, and "See its terms" in `components/app-safety/AppSafetyPage.tsx`. Check copy: `ReadinessCheck.tsx` ("Three questions. No sign up, and nothing you choose is saved.").

## L2 · Friday 11 December · A check with no score at the end

**Hook**

Our free app check asks three questions and gives no score.

**Body**

Our free app check asks three questions and gives no score.

That was deliberate, and it is written into the code.

Every quiz online ends in a number. Seven out of ten. Mostly ready. It feels like an answer.

Think about where it comes from, though. Three taps from a parent on a phone, added up into one figure. If someone asked me how I got it, I could not defend it. So it does not exist.

A verdict was out too. Ready or not ready is a yes or a no in a nicer font, and we never give one of those.

What the check gives instead is TRUST. Five letters, each with a place to start and one next step, worded from what the parent told it and from that app's own facts.

Timing. The right age, and the right time of day.

Relationships. Would they come to you if something went wrong?

Upstream design. The features built to pull them in, turned down before they start.

Sleep. Nights protected, and the device sleeping outside the bedroom.

Transparency. You both know what is on it, and the rules are agreed out loud.

When two letters are both a place to start, Relationships goes first. That order is a belief and I hold it firmly. A child who will tell you when something goes wrong has a protection no setting can switch on.

It sits at the bottom of every app page. Twenty apps, ages 6 to 15, and nothing you tap is saved.

The guide is in the first comment.

If you build anything for parents, I would love you to steal the no score rule. A repost helps it travel.

If a quiz told you your child was 62 percent ready for TikTok, what would you actually do with that number?

**First comment**

The app guide. Pick the app, and the check is at the bottom of its page: https://www.guidedchildhood.com/app-safety-guide?utm_source=linkedin&utm_medium=social&utm_campaign=app-safety-week&utm_content=li-no-score

**Image.** The real result screen of the check, captured with Playwright at 390 wide on /is-roblox-safe-for-9-year-old (age 9, "Sometimes, usually with me around", worry "Spending money"), showing the five letters. The data is the point here, so a real screen beats a photo. Never a redrawn screen.

**Proof path.** `lib/app-safety/trust.ts`: the five letters and their meanings (`LETTERS`), no total or verdict (header comment), Relationships first on a tie (`PRIORITY`). Nothing stored: same file and `ReadinessCheck.tsx`. Twenty apps and ages 6 to 15: `APPS` and `AGES`. The "62 percent" in the question is a hypothetical, not a figure we hold.

## L3 · Monday 14 December · The school parent pack

**Hook**

One box, one school name, and a parent guide to twenty apps.

**Body**

One box, one school name, and a parent guide to twenty apps.

That is the whole set up. I wanted it that small.

Teachers get asked about apps they never chose and have no reason to know inside out. Who can add a child to a WhatsApp group. Whether Roblox chat is on. What a 10 year old should do with TikTok.

So the parent pack does the knowing. A school types its name and the page comes back made for them.

A short piece for the newsletter, ready to copy. A QR code for a poster or a slide at parents' evening. Links to the free guides, starting with Roblox, YouTube, TikTok, WhatsApp, Snapchat and Minecraft.

Nothing to sign up for, for the school or for the families. Visits from the school's own link are counted for that school.

A parent can make one too, for their child's school, and send it to the class rep.

Every app page says where each fact came from and the date it was last checked against the company's own pages. When an app changes, we change the page. The school's link stays the same.

I would rather a school sent home something a parent can do this week than one more warning about screens.

The pack is in the first comment.

If you know a head, a DSL or a class rep, a repost might reach them before the holidays.

If you work in a school, what is the app question parents ask you most?

**First comment**

The free parent pack for schools. Type your school's name and the page, the text and the QR code are made for you: https://www.guidedchildhood.com/schools/parent-pack?utm_source=linkedin&utm_medium=social&utm_campaign=app-safety-week&utm_content=li-parent-pack

**Image.** A real screenshot of /schools/parent-pack at desktop width, the newsletter card and the QR card side by side, unpersonalised. Do not make a pack under a real school's name for the screenshot.

**Proof path.** `app/(marketing)/schools/parent-pack/page.tsx`: the form ("Type your school's name and this page, the text and the QR code are made for you"), the newsletter card with a copy button, the QR code with download, `FEATURED` lists the six apps, "Visits from your link are counted for your school", no sign up in the page copy. Check date on every app page: `AppSafetyPage.tsx` ("Checked against ... own pages on").

---

# Family Instagram and Facebook, the family voice

Voice is "we", Natalia first. Instagram shorter, no link in the caption. Facebook longer and warmer, the link in the post, one tall image, never a carousel, no hashtags. Sizes 1080 x 1350, Stories 1080 x 1920 with text in the middle 80 percent. Every card follows `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`: cream or one friend's soft ground, ink headlines in Nunito 900, IBM Plex Mono eyebrows, one gold detail, the approved cutouts only, no app logos or screenshots of other companies' apps, no generated characters, no invented screens.

## F1 · Wednesday 2 December · Research Wednesday: 13, 16 and 18

This is a brick in the 1 in 10 count, not the thesis post. The finding is a primary source, TikTok's own terms, not a study.

### Instagram caption

Send this to the parent with TikTok on the Christmas list.

Fair point first: if you only check one thing, the age is the right one. It is the company's own line, and plenty of us never get as far as reading it.

Most of us know the 13. It is on the App Store.

TikTok's own UK terms have three ages in them. 13 for an account. 16 for direct messages, which are switched off before then. 18 for going LIVE and for virtual items.

So "is TikTok OK at 13" is really a few questions at once. Watching, messaging and going live are different things, and the company treats them differently too.

Tonight, ask which bit they actually want. Watching their friends' videos? Posting their own? Messaging? You will learn more from the answer than from any rating.

Which app did your child ask for first, by name?

Source: TikTok Terms of Service (EEA and UK), clauses 4.3 and 4.4.

### Facebook post

Send this to the parent with TikTok on the Christmas list.

Fair point first: if you only check one thing, the age is the right one. It is the company's own line, and plenty of us never get as far as reading it.

Most of us know the 13. It is on the App Store, and it is what everyone at the school gate quotes.

TikTok's own UK terms have three ages in them. 13 for an account. 16 for direct messages, which are switched off before then. 18 for going LIVE and for virtual items. A teenager can watch someone else's LIVE, but TikTok does not let them host one.

None of those is a "ready" line. They are the company's rules for what an account can do. A store rating describes the content. Neither one has met your child.

So "is TikTok OK at 13" is really a few questions at once. Watching, messaging and going live are different things, and the company treats them differently too.

Tonight, ask which bit they actually want. Watching their friends' videos? Posting their own? Messaging? You will learn more from the answer than from any rating.

We put TikTok's terms, the settings to switch on first and the links to where we read them on one page: https://www.guidedchildhood.com/is-tiktok-safe?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=fb-three-ages

Which app did your child ask for first, by name?

### Instagram Story, same day

One frame, cream. Eyebrow in IBM Plex Mono: WHAT THE TERMS SAY. Headline: "13, 16 and 18. One app." Link sticker: "The TikTok page" to the Instagram link in the plan. Text inside the middle 80 percent.

### Card brief, Instagram carousel (7 cards)

Format 1, big stat or hook. Nova leads (stage 4, 13 to 15, teenage digital life), standing cutout `public/digi-squad/friends/nova.png`, on Nova's soft ground `#ECE3F7` with ink `#4A2F73` accents. Nova on card 1 and card 7 only. One gold detail per card. A small IBM Plex Mono source line on cards 3 to 5.

1. Eyebrow WHAT THE TERMS SAY. Headline "13, 16 and 18." Body "Three ages in one app's own terms." Nova, gold underline under the headline.
2. Headline "If you check one thing, check the age." Body "It is the company's own line."
3. Headline "13" Body "The age for an account. The one on the App Store."
4. Headline "16" Body "Direct messages. Switched off before then."
5. Headline "18" Body "Going LIVE, and virtual items. Teens can watch a LIVE, not host one."
6. Headline "Which bit do they want?" Body "Watching, posting or messaging. Ask tonight."
7. Headline "Send this to the parent with TikTok on the list." Nova, logo mark small at the foot.

Source line, cards 3 to 5: SOURCE: TIKTOK TERMS OF SERVICE (EEA AND UK), CLAUSES 4.3 AND 4.4

Alt text, card 1: "A purple card with a cartoon planet character and the headline 13, 16 and 18, three ages in one app's own terms."

### Facebook image

Card 1 on its own, 1080 x 1350.

### Proof path

`lib/app-safety/apps.ts`, tiktok: `minAge.note` (checked true) for 13, 16 and 18; the LIVE risk line for watch but not host; the DM risk line for "switched off under 16". The page ends at the stage check: `AppSafetyPage.tsx`, "Find your child's stage".

## F2 · Friday 4 December · Service Friday: five WhatsApp settings

The service is new: the app safety guide. Shown here through one app, WhatsApp, because a first phone usually means a first group chat.

### Instagram caption

The phone is wrapped. Somewhere, a class group chat is already waiting for it.

WhatsApp's own minimum age in the UK is 13. Whenever it arrives in your house, these are the five settings we would switch on first, all on your child's phone, all in Settings:

1. Privacy, Groups: My contacts.
2. Silence unknown callers.
3. Profile photo, last seen and online: My contacts.
4. Default message timer: off.
5. Two step verification: on.

We put these, with the steps and the links to WhatsApp's own help pages, on a free page. There is one for nineteen other apps too, and an age page for every age from 6 to 15. Each one ends with a three question check, and that hands you on to the plan for your child's exact age.

Left on the default, anyone with your child's number can add them to a group without asking.

Which app would you most like someone to just tell you the settings for?

What stage is your child? Three questions, no sign up, link in bio.

### Facebook post

The phone is wrapped. Somewhere, a class group chat is already waiting for it.

WhatsApp's own minimum age in the UK is 13. Whenever it arrives in your house, these are the five settings we would switch on first, all on your child's phone, all in Settings:

1. Privacy, Groups: My contacts. Only saved contacts can add them to a group; anyone else has to send an invite they can turn down.
2. Silence unknown callers. Calls from numbers they do not know stop ringing.
3. Profile photo, last seen and online: My contacts.
4. Default message timer: off, so messages do not vanish unless they choose it.
5. Two step verification: on.

The page has the steps and the links to WhatsApp's own help pages. There is one for nineteen other apps too, and an age page for every age from 6 to 15. Each ends with a three question check that hands you on to the plan for your child's exact age: https://www.guidedchildhood.com/is-whatsapp-safe?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=fb-whatsapp-five

Left on the default, anyone with your child's number can add them to a group without asking.

Which app would you most like someone to just tell you the settings for?

### Instagram Story, same day

One frame, cream, Bloop small. Eyebrow INSIDE GUIDED CHILDHOOD. Headline "Five WhatsApp settings before the first phone." Link sticker: "The WhatsApp page" to the Instagram link in the plan.

### Screen recording shot list (Instagram Reel, the default for Friday)

Record the real page on a phone at 390 wide, or with Playwright (`webapp-testing`). No mock ups. No child's name on screen. Format 4, product screen: the problem, the useful action, how we help.

1. 0 to 2s. /is-whatsapp-safe opening on the headline and the two sentence answer. Text on screen: "The phone is wrapped."
2. 2 to 5s. The fact box: its own minimum age 13, the store ratings, the source links. Text: "WhatsApp's own age is 13."
3. 5 to 10s. Scroll to "Setting up WhatsApp for your child", the numbered steps. Text: "Five settings first."
4. 10 to 15s. The free check: tap 11, then "Not yet, or just asking for it", then "People they do not know contacting them". Text: "Three questions. No sign up."
5. 15 to 19s. The result, the five TRUST letters. Text: "A place to start, not a score."
6. 19 to 22s. The "Find your child's stage" button. Text: "What stage is your child?"

Cover frame: cream, eyebrow INSIDE GUIDED CHILDHOOD, headline "Five WhatsApp settings before the first phone", Bloop cutout `public/digi-squad/friends/bloop.png`, gold underline.

### Facebook image

One tall card, 1080 x 1350, cream. Eyebrow INSIDE GUIDED CHILDHOOD. Headline "Five WhatsApp settings before the first phone." Below it, the real screenshot of the page's setup steps on a phone frame, with the gold pathway running behind the phone. Logo mark small at the foot. Alt text: "A card titled Five WhatsApp settings before the first phone, above a phone showing the setup steps on the Guided Childhood WhatsApp page."

### Proof path

`lib/app-safety/apps.ts`, whatsapp: `minAge` (checked true, 13 in the UK); `setupSteps` 1 to 6 (Privacy Checkup, Silence unknown callers, Groups My contacts, profile photo last seen and online, default message timer, two step verification); the group risk line ("By default anyone, including people who are not in your child's contacts, can add them to a group without asking"). Step 7, parental controls, is left out because UK availability is not confirmed. Route `app/(marketing)/[slug]/page.tsx`, check `components/app-safety/ReadinessCheck.tsx`, stage check button `AppSafetyPage.tsx`.

## F3 · Saturday 5 December · Happy News Saturday: the good in the Christmas list

### Instagram caption

The apps on the Christmas list, and the good in them.

We spend a lot of time on the settings. This one is about why the apps are worth setting up properly at all.

Minecraft: whole worlds, built block by block, alone or with friends.

Roblox: millions of games made by other players, to build, play and chat in.

YouTube: somewhere to learn almost anything by watching.

WhatsApp: voice notes, photos and calls with the people they love.

Screens can be good, used right. Connection, making things, learning. Pretending otherwise would mean not believing what we see in our own house.

The first setting for each is on the cards. The rest are in our free app guide, linked in today's Story.

What is something good your child has made or learned on a screen this year?

### Facebook post

The apps on the Christmas list, and the good in them.

We spend a lot of time on the settings. This one is about why the apps are worth setting up properly at all.

Minecraft is whole worlds, built block by block, alone or with friends. A child account starts with online play and chat switched off, so a younger child can build on their own first.

Roblox is millions of games made by other players, to build, play and chat in. Roblox sorts accounts by age, and under 18s set theirs up with a parent.

YouTube is somewhere to learn almost anything by watching. On a supervised child account, autoplay is off by default, and comments, uploads and live chat are switched off.

WhatsApp is voice notes, photos and calls with the people they love. One setting, Groups set to My contacts, means only people they know can add them to a group.

Screens can be good, used right. Connection, making things, learning. Pretending otherwise would mean not believing what we see in our own house.

Every app, its own minimum age with the source, and the settings to switch on first: https://www.guidedchildhood.com/app-safety-guide?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=fb-christmas-list

What is something good your child has made or learned on a screen this year?

### Instagram Story, same day

One frame, Bloop's soft ground. Headline "The good in the Christmas list." Link sticker: "Every app, the settings first" to the Instagram link in the plan.

### Card brief, Instagram carousel (6 cards)

Format 1 and 5. Bloop leads (stage 2, 8 to 10, gaming and routines), `public/digi-squad/friends/bloop.png` or an approved Bloop mood still from `CHARACTERS.moods`, on Bloop's soft ground `#E4F0D4`, ink `#3F5E1E` accents. Bloop on cards 1 and 6 only. App names in text only, no app logos and no screenshots of the apps themselves. The gold pathway runs card to card so the swipe feels like travel.

1. Eyebrow THE GOOD SIDE. Headline "The apps on the Christmas list, and the good in them." Bloop.
2. Eyebrow MINECRAFT. Headline "Whole worlds, built block by block." Body "A child account starts with online play and chat off."
3. Eyebrow ROBLOX. Headline "Millions of games made by players." Body "Accounts are sorted by age, set up with a parent."
4. Eyebrow YOUTUBE. Headline "Learn almost anything by watching." Body "Autoplay is off by default on a child account."
5. Eyebrow WHATSAPP. Headline "Voice notes and calls with the people they love." Body "Groups: My contacts, so only people they know can add them."
6. Headline "Save this for Christmas morning." Body "The rest of the settings are in the app guide." Bloop, logo mark small at the foot.

Alt text, card 1: "A soft green card with a cartoon planet character and the headline The apps on the Christmas list, and the good in them."

### Facebook image

Card 1 on its own, 1080 x 1350.

### Proof path

`lib/app-safety/apps.ts`: Minecraft `whatItIs` and `minAge.note` (child accounts, multiplayer and chat off by default); Roblox `whatItIs` and `minAge.note` (accounts from 5 set up with a parent, sorted by age); YouTube supervised child account control and the autoplay risk line (off by default on child accounts); WhatsApp group privacy control. The belief line is from `content/brand-story/founding-story.md`, "Screens can be good, used right".

## F4 · Monday 30 November · Founder Monday: the kitchen table

Chapter 8 of the founding story, "Building it on the kitchen table". Chapters 5, 7, 9 and 10 have already been drafted in earlier social weeks, chapter 8 has not. No link, no ask, no app pages. Monday earns the right that Friday spends. Check it does not clash with what Sunday's social week batch picks for the same day.

### Instagram caption

Two parents, no permission, one spreadsheet.

Nobody asked us to build anything. It did not start with a market or a plan to sell it. It started with a wish that something existed to help us manage the devices rather than just switch them off.

So Justin and I built it. First for us. For our own family, on our own kitchen table.

We have always made things that made family life a bit better. For ten years they were made of card and sugar. Some of them now run on a phone.

What is something in your house that started as a fix for your own family?

### Facebook post

Two parents, no permission, one spreadsheet.

Nobody asked us to build anything. It did not start with a market or a plan to sell it. It started with a wish that something existed to help us manage the devices rather than just switch them off.

So Justin and I built it. First for us. For our own family, on our own kitchen table.

We have always made things that made family life a bit better. For ten years they were made of card and sugar, cake toppers first, then whole parties. Some of them still are. Some of them now run on a phone.

What is something in your house that started as a fix for your own family?

### Photo

A real photo, never a graphic. The kitchen table, empty or with a laptop and a notebook on it, no people, no faces, no screen showing anything readable. From the archive if a photo from the early days exists, otherwise taken on Sunday. 1080 x 1350. Alt text: "A family kitchen table with a laptop and a notebook on it."

### Proof path

Every fact is in `content/brand-story/founding-story.md`: the hook is chapter 8's own line in the chapter table; "built it, first for us, for our own family, on our own kitchen table" and "manage the devices and not just switch them off" are in the timeline; the card and sugar lines are the canon's own wording.

---

# Pinterest

Board to make first: **Is this app safe for my child?** Images 1000 x 1500. Two or three pins a week reads better than all at once. Post in Pinterest: Create, Pin, upload, paste the title, description, link and alt text, choose the board.

## P1 · Is Roblox safe for a 9 year old?

- **Title:** Is Roblox safe for a 9 year old?
- **Description:** Roblox lets a parent set up an account from age 5, and sorts children by age: 9 to 15 year olds are on Roblox Select. A free UK guide with the settings to switch on first, step by step from Roblox's own help pages, what changes at nine, and a three question check with no score and no sign up.
- **Link:** https://www.guidedchildhood.com/is-roblox-safe-for-9-year-old?utm_source=pinterest&utm_medium=social&utm_campaign=app-safety-week&utm_content=pin-roblox-9
- **Image brief:** Cream canvas, Bloop cutout lower right on a Bloop soft ground panel `#E4F0D4`. Eyebrow in IBM Plex Mono: THE UK PARENT'S APP GUIDE. Headline in Nunito 900, ink: "Is Roblox safe for a 9 year old?" with a gold underline stroke. Sub line: "The settings to switch on first." Logo mark small at the foot. No Roblox logo, no game screenshots, no generated art. A third of the pin left empty.
- **Alt text:** A cream pin with a cartoon planet character and the headline Is Roblox safe for a 9 year old, the settings to switch on first.

## P2 · Is Minecraft safe for a 7 year old?

- **Title:** Is Minecraft safe for a 7 year old?
- **Description:** Minecraft sets no minimum age of its own. In the UK a child under 13 plays on a child account a parent manages, and child accounts start with online multiplayer and chat switched off. A free guide: its PEGI 7 rating, what to switch on first, and a three question check with no sign up.
- **Link:** https://www.guidedchildhood.com/is-minecraft-safe-for-7-year-old?utm_source=pinterest&utm_medium=social&utm_campaign=app-safety-week&utm_content=pin-minecraft-7
- **Image brief:** Cream canvas, Pebble cutout (stage 1, 4 to 7) `public/digi-squad/friends/pebble.png` on Pebble's soft ground `#FBEED0`. Eyebrow THE UK PARENT'S APP GUIDE. Headline "Is Minecraft safe for a 7 year old?" with a gold underline. Sub line: "Online play starts switched off." Logo mark small at the foot. No Minecraft logo or screenshots.
- **Alt text:** A cream pin with a cartoon planet character and the headline Is Minecraft safe for a 7 year old, online play starts switched off.

## P3 · Is YouTube safe for an 8 year old?

- **Title:** Is YouTube safe for an 8 year old?
- **Description:** For a younger child YouTube offers YouTube Kids, or a supervised child account a parent sets up. On a supervised account comments, uploads, live chat and purchases are off, and autoplay is off by default. A free UK guide with the steps from Google's own pages and a three question check, no sign up.
- **Link:** https://www.guidedchildhood.com/is-youtube-safe-for-8-year-old?utm_source=pinterest&utm_medium=social&utm_campaign=app-safety-week&utm_content=pin-youtube-8
- **Image brief:** Cream canvas, Bloop cutout (stage 2, 8 to 10) on Bloop's soft ground. Eyebrow THE UK PARENT'S APP GUIDE. Headline "Is YouTube safe for an 8 year old?" with a gold underline. Sub line: "Comments, uploads and live chat start off." Logo mark small at the foot. No YouTube logo or screenshots.
- **Alt text:** A cream pin with a cartoon planet character and the headline Is YouTube safe for an 8 year old, comments, uploads and live chat start off.

**Proof path.** Roblox `minAge.note` (from 5 with a parent, Roblox Select 9 to 15). Minecraft `minAge.note` and the PEGI rating (both checked true). YouTube `underAge.text`, the supervised child account control and the autoplay risk line. All in `lib/app-safety/apps.ts`. The YouTube pin avoids stating YouTube's minimum age, because the UK terms were not opened separately.

---

# Facebook parent groups

## G1 · The reply template

For a question like "My 12 year old wants Snapchat for Christmas. What would you do?" Answer first, link last, and say we made it. Check each group's rules on links first; where links are not allowed, end at the answer and offer to send it by message instead.

**Filled in for Snapchat at 12**

Snapchat's own minimum age is 13, so at 12 you have a bit of time. I would use it to agree now what changes at 13 and what does not, so the birthday is a step you both planned rather than a door that suddenly opens.

If it does come in, now or at 13, a few things worth knowing:

Family Centre lets you see who they are friends with and who they have been chatting to, but not the messages themselves.

Location on the Snap Map is off unless they switch it on. Ghost Mode keeps it hidden.

You can stop My AI, the chatbot that sits in their chat list, from replying to them.

Hide Sensitive Content in Family Centre limits what shows in Stories and Spotlight, though Snap says no filter is perfect.

And whatever you decide, agree that if something goes wrong on it, telling you will never cost them the phone.

Full disclosure, we made this page, but it is free and has the steps with links to Snapchat's own help: https://www.guidedchildhood.com/is-snapchat-safe-for-12-year-old?utm_source=facebook&utm_medium=social&utm_campaign=app-safety-week&utm_content=group-reply

**The shape, for any app and age**

1. The app's own minimum age, from its page, and what that means at their child's age (the age page's "What changes at" line).
2. Three or four settings from the page's setup steps, one line each, in plain words.
3. The one agreement: telling you never costs them the device.
4. "Full disclosure, we made this page, but it is free and has the steps with links to [the company]'s own help:" and the age page link with `utm_content=group-reply`.

Only use facts from that app's entry in `lib/app-safety/apps.ts`, never anything in its `uncertain` list. Never a yes or a no.

**Proof path.** `lib/app-safety/apps.ts`, snapchat: `minAge` (checked true), Family Centre, Ghost Mode, Restrict My AI and Hide Sensitive Content controls, the location risk line. The age 12 line is `lib/app-safety/ages.ts`, 12, `thisMonth`. The "never cost them the device" promise is the page's own direct answer in `lib/app-safety/content.ts`.
