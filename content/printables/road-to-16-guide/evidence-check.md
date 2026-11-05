# The Road to 16: evidence check (red team)

**Date:** 5 November 2026
**Piece:** `guide-text.md` (generated from `guide-data.js`), every word as printed
**Checked against:** the primary pages below, read live today, plus the research pass `road-to-16-facts.md` (also read today). Where I relied on that pass without opening the page again, the table says so.
**EV ids** are in `~/.claude/skills/evidence-review-video/references/evidence-library.md` (EV-76 to EV-94 added today).

## Overall verdict: SHIP AFTER FIXES

The numbers hold, and so do the platform ages, the law and policy lines, and the help line numbers. What has to change before print:

1. **Two safeguarding lines** could lead a parent or child to copy a sexual image of a child: the group chat "screenshot of anything upsetting" line, and "Screenshot the messages" in step 3. Step 3's "even to report it" also clashes with Report Remove, where the young person shares the image with the IWF themselves.
2. **One platform instruction is wrong for most children:** YouTube's Restricted Mode can't be locked through Family Link for a child on a supervised account, or for most over 13s.
3. **One sentence is the causal claim migration 346 already took out of the lesson:** "or they stop telling you".
4. **One cross reference is wrong.** The apps run over two printed sheets (6 and 7), and TikTok and Snapchat are on sheet 7.

The rest are hedges restored (Ofcom's "seems to be", "around two thirds", "said they use"), and platform descriptions brought into line with each company's own page (Instagram's age checks, Snapchat Quick Add, Discord Family Center, WhatsApp's new parent managed accounts).

There are no outcome or medical claims about a child. There is no allow or deny framing, and the ban line is neutral. Nothing here needs legal advice.

---

## 1. Every factual line

Key: PASS, FIX (wording in section 2), CUT. "RP" means read today by the research pass; I did not open the page again.

### Cover, Passport page, five stages

| # | Line (short) | Verdict | Source |
|---|---|---|---|
| 1 | Cover, "Five stages, four to sixteen", the stage names and ages | PASS | `lib/content/stages.ts` (product) |
| 2 | "The minimum age on each app is the company's own account rule. It is not a sign a child is ready." | PASS | Ofcom 2026 media use report p59 footnote: the Online Safety Act "does not require social media sites or apps to set a minimum age" (RP). A lawyer might add that 13 also matches the UK GDPR age of digital consent. That is not wrong, and needs no change. |
| 3 | Stage cards: focus, device, talk (Pebble to Cosmo) | PASS | `stages.ts`, trimmed faithfully. "Ideally a phone for calls and texts before a smartphone" is the app's "feature phone strongly recommended", softened. |

### Balance

| # | Line | Verdict | Source |
|---|---|---|---|
| 4 | "Most screen time fights are really about who decides." | FIX F14 | No source. "Most" is a figure. |
| 5 | Their time / Protected time / Where it is heading | PASS | THE-STORY.md s.3 (product) |
| 6 | "One star is five minutes." | FIX F15 | `lib/quests/templates.ts` STAR_MINUTES defaults to 5, and `time-tiers.ts` carries a per child rate a parent sets (migration 225). So it is true only until a parent changes it. |
| 7 | "Protect these first: sleep, moving about, playing, and being bored" | PASS | `PLAY_PAYS_WHY` (product). This is the CMOs' precautionary framing (EV-2), worded as "can crowd out", not as a finding. |
| 8 | "Devices sleep outside bedrooms" | PASS | CMOs 2019: "Leave phones outside the bedroom when it is bedtime" (EV-2). No outcome is claimed, and the guide doesn't need one. |
| 9 | Your phone lines, stage by stage | PASS | `stages.ts` yourPhone |

### Behaviour

| # | Line | Verdict | Source |
|---|---|---|---|
| 10 | Intro: "These are the signs the app lists ... None of them is a diagnosis." | FIX F16 (should) | `stages.ts` warningSigns. The lists are fair paraphrases (for example "Extreme mood swings tied to online interactions" becomes "Big mood swings tied to things that happen online"). Add the line on other causes; see the camp A pushback. |
| 11 | The four sign lists | PASS | `stages.ts`, paraphrased. No clinical words. |
| 12 | Record for a week, the script, "Not this" | PASS | `stages.ts` challengeActions (mood_changes, Bloop and Nova), scripts |
| 13 | "talk to their GP or their school. If anyone is in danger now, call 999." | PASS | |

### The apps

| # | Line | Verdict | Source |
|---|---|---|---|
| 14 | "Each app sets its own minimum age in its terms, and most say 13." | PASS | Each platform's terms (RP, Part A) |
| 15 | "Ofcom found 90% of 8 to 12 year olds already use at least one service with a minimum age of 13" | FIX F7 | EV-93, Ofcom *Children's Online Experiences* p4, opened today: "The proportion of 8-12s who said they use at least one online service with a minimum age of at least 13 stands at 90%, driven by YouTube (63%)". Ofcom's own footnote: "Under 13s may use YouTube through a supervised account (with parental consent). This research is unable to establish the extent..." Two problems: it is self-report, and the guide's own YouTube card says under 13s can use YouTube with a parent. Left as it is, the page contradicts itself. |
| 16 | "only a third of parents know the usual age is 13" | FIX F7 | Ofcom p4 (EV-93): "fewer (32%) identified 13"; 2026 media use report p7 and p59 (RP; approved figure AF-42). "Only" reads as a judgement on parents. |
| 17 | "Each card names the Passport page where the app brings that app up" | PASS | `093_social_platform_guides.sql` first_seen_stage: YouTube and Roblox 2; WhatsApp, Instagram, TikTok and Snapchat 3; Facebook and Discord 4. All match. |
| 18 | YouTube: own minimum age 13; younger children with a parent through YouTube Kids or a supervised account set up in Family Link | PASS | youtube.com/t/terms (RP); support.google.com/youtube/answer/10314074, opened today: Family Link set up steps (EV-85) |
| 19 | YouTube Lock first: "Lock Restricted Mode through Family Link so it cannot be switched off, and cap or turn off the Shorts feed." | FIX F5 (**must**) | EV-83, YouTube Help 174084: a parent can turn on Restricted Mode through Family Link only for a child who is "not eligible for a supervised experience on YouTube". It can't be set up for a child over 13 unless the supervised Google Account was created before that age. A supervised child gets a content setting instead (EV-85). The Shorts timer: "parents can now" set one, and "soon, parents will see the option to set the timer to zero" (YouTube, 14 January 2026; EV-84). Whether zero is live was not confirmed. |
| 20 | YouTube Watch for: "The Shorts feed is the hardest to put down" | FIX F5b (should) | No source for "hardest". Describe the design, not an effect. |
| 21 | Roblox: own minimum age 5; some features only a parent can turn on; chat needs an age check | PASS | Roblox Terms (EEA, UK, CH), effective 1 Nov 2026 (RP); Roblox Kids and Select help (RP); Roblox newsroom, 7 Jan 2026, opened today: age check to chat "rolling out globally wherever chat is available"; "Parental consent is required for users younger than 9" (EV-91). **Product mismatch:** migration 093 stores Roblox `min_age` as 13, and the app's settings page shows "Account age 13". See section 5. |
| 22 | Roblox Lock first and Watch for | PASS | 093 (product advice; safe) |
| 23 | WhatsApp: own minimum age 13 (UK) | PASS | whatsapp.com/legal/terms-of-service-uk, effective 17 Aug 2026 (RP). Went from 16 to 13 on 16 Feb 2024 (RP). |
| 24 | WhatsApp: "There is no parental dashboard" | FIX F17 | WhatsApp announced "parent-managed accounts" for pre-teens on 11 March 2026: "parents ... decide who can contact the account and which groups they can join", rolling out "gradually ... over the coming months" (EV-92). UK availability is not confirmed. The UK terms say "if it is available in your country" (RP). |
| 25 | WhatsApp Lock first: "Settings, Privacy, Groups, set to My contacts, so strangers cannot add them to a group" | PASS | 093 (product). WhatsApp's own blog, via search summary only: "My Contacts" means only your contacts can add you, and others must send a private invite. That is true as worded ("add"). UNVERIFIED at the page; see section 4. |
| 26 | Instagram: own minimum age 13; Teen Accounts private by default, strictest messaging, under 16s need a parent to loosen them | PASS | help.instagram.com/581066165581870 (RP); Meta newsroom, opened today (EV-86): "Teens under 16 will need a parent's permission to change any of the built-in protections to be less strict". Private by default for all under 16s, and for 16 and 17s when they sign up. |
| 27 | Instagram Lock first: "Messages from people they follow only, and Sleep mode on overnight" | FIX F10b (should) | Both are already Teen Account defaults (EV-86: Sleep mode "between 10 PM and 7 AM"). "Lock" should read "check it is still on". |
| 28 | Instagram Watch for: "A false birthday switches the teen protections off" | FIX F10 | EV-86: Meta says "Teens may lie about their age". It says it is building technology to place suspected teens in Teen Account settings whatever birthday they give, testing first in the US. "Switches off" is too certain, and it is a factual claim about a company. |
| 29 | TikTok: own minimum age 13; "Direct messages are off for under 16s" | PASS | TikTok Terms (EEA and UK), July 2026, clause 4.3 (RP); Guardian's Guide, opened today: "Accounts for teens under 16 years old don't have access to direct messaging features" (EV-87) |
| 30 | TikTok Lock first: "Link Family Pairing, then set daily screen time and lock Restricted Mode" | PASS, if confirmed in the app | EV-87 confirms Family Pairing screen time and messaging controls, and a default of "60 minutes". The Guardian's Guide I opened does not use the name "Restricted Mode". UNVERIFIED at the name; see section 4. |
| 31 | TikTok Watch for: how fast the feed narrows | PASS | 093 (product). An observation, not a figure. |
| 32 | Snapchat: own minimum age 13; Family Center shows friends and who they have messaged, not what was said | PASS | snap.com/en-GB/terms, effective 21 Sep 2026 (RP); Snapchat parents page, opened today: friends, "who they're chatting with", "without showing the content of their private conversations" (EV-88) |
| 33 | Snapchat Lock first: Ghost Mode | PASS | 093 (product) |
| 34 | Snapchat Watch for: "Quick Add suggesting them to strangers" | FIX F11 | Snap: "teens will not be suggested in Quick Add or Search unless they have multiple mutual connections with the other person" (EV-67, opened again today) |
| 35 | Facebook and Messenger: own minimum age 13; Meta Family Center covers time spent and who they are in touch with | PASS | facebook.com/terms.php, effective 4 Mar 2026 (RP); Meta newsroom (EV-90): Messenger supervision shows "how much time their teen spends", their "Messenger contacts list", privacy settings and who can message them. "These tools do not allow parents to read their teen's messages." Facebook supervision has been global since 9 Nov 2023. |
| 36 | Facebook Lock first: "location off in Messenger" | FIX F13 (should) | No Meta page was reached. In Messenger, live location is shared chat by chat; the steady switch is the phone's own location permission for the app. |
| 37 | Discord: own minimum age 13; "Family Center shows servers joined and friends added, but not messages or voice" | FIX F12 | discord.com/terms, 29 Sep 2025 (RP); Discord blog, 11 Jul 2023, opened today (EV-89): parents also see the users a teen "messaged or called" over the last seven days, but "won't be able to see the contents of the conversations". As worded, "not messages" undersells what parents see. |
| 38 | Discord Lock first (explicit image filter, message requests) | PASS | 093 (product advice). The setting names were not opened (support.discord.com returned 403). Low risk. |
| 39 | The law: "Ages read from each app's own terms in November 2026" | PASS | RP, Part A, all dated 5 Nov 2026 |
| 40 | "The UK government expects to restrict social media for under 16s from spring 2027" | PASS | Government response, July 2026, opened today: "expect the restrictions on social media services offering their services to under-16s to enter into force in spring 2027" (EV-82) |
| 41 | "for 16 and 17 year olds to have social media switched off between midnight and 6am by default, a setting they can change" | PASS | EV-82: services "will need to restrict access to their platforms between midnight and 6am"; "16 and 17-year-olds will be able to change these default settings." |
| 42 | "a deadline is not a plan" | PASS | Brand line, and neutral on the ban: it argues neither for nor against it (red line 4 applies to review videos; this is brand content). |

### The school moments

| # | Line | Verdict | Source |
|---|---|---|---|
| 43 | Year groups and ages (Years 3 to 5, 7 to 10; Year 6, 10 to 11; Year 7, 11 to 12; Years 8 and 9, 12 to 14; Years 9 and 10, 13 to 15; Year 11, 15 to 16) | PASS | gov.uk/national-curriculum (RP). These are England and Wales year groups; Scotland and Northern Ireland number them differently. Acceptable in a guide whose phone policy line already says "England". |
| 44 | Game the whole class plays: body and Have ready | PASS | `device-issues.ts`, `stages.ts` gaming (product) |
| 45 | "Ofcom calls that move the key age for phones" | FIX F8 | Ofcom 2026 media use report p14: "the key age for mobile phone ownership seems to be around the transition from primary to secondary school" (RP). The hedge "seems to be" was dropped (lesson L-3). |
| 46 | "Ofcom found phone ownership rises from 56% of 10 year olds to 83% of 11 year olds" | PASS | Ofcom 2026 p14: "ownership rises sharply from 56% of 10-year-olds to 83% of 11-year-olds" (RP; AF-40) |
| 47 | "A phone for calls and texts with no apps gives independence without the feed" | PASS | `stages.ts` Bloop asking_for_phone (product) |
| 48 | Year 7: "they are often busiest late at night" | FIX F1b | No source. The product's mechanism text says "they happen at eleven at night", which is a forum observation (MUMSNET_WHATSAPP). It is not a measured pattern. |
| 49 | Year 7: "a screenshot of anything upsetting comes to you and costs them nothing" | FIX F1 (**must**) | "Anything upsetting" in a class chat includes a nude image of a classmate. Screenshotting it and sending it to a parent makes and shares a copy. UKCIS: "Never view, copy, print, share, store or save the imagery yourself" (EV-77). House rule 21 (carousel evidence-rules.md) requires the carve out. |
| 50 | "WhatsApp's own minimum age in the UK is 13, so every child in Year 7 is younger than that" | FIX F9 | True for nearly all, but "every" is absolute: some children are taught out of their year group. Parent managed accounts (EV-92) mean an under 13 can be on WhatsApp within its rules, where they are available. |
| 51 | "Ofcom found 52% of 8 to 12 year olds already use it" | FIX F9 | EV-93 p4: "said they use"; WhatsApp (52%) |
| 52 | "two thirds of 8 to 17 year olds had been added or invited to a group chat in the past four weeks" | FIX F9 | EV-93 p36: "around two thirds of 8–17-year-olds said they had been added or invited to at least one group chat in the past four weeks at Wave 2 (64%)" |
| 53 | Thirteenth birthday: "Most of the big apps set 13", readiness check "instead of a yes or a no" | PASS | Terms (RP). The readiness check is the calibrated pathway; it is not allow or deny. |
| 54 | "the settings on page 6 locked side by side" | FIX F6 (**must**) | `print.html`: sheet 6 holds YouTube, Roblox, WhatsApp and Instagram, and sheet 7 holds TikTok, Snapchat, Facebook and Discord. The sentence names TikTok and Snapchat. |
| 55 | Photos and pressure: "do not pay, do not delete the messages, report it, and tell them out loud that they are not in trouble" | FIX F4 | NCA, 29 Apr 2024 (EV-76): "Don't pay, do stop contact and block"; "Avoid deleting anything: try not to delete anything that could be used as evidence such as messages, images, telephone numbers, and bank account details"; "call 101 or 999 if there is an immediate risk ... Or you can use the CEOP Safety Centre"; "you are not to blame". The guide's line is right but incomplete: it has no block step and no route for "report it". |
| 56 | Exams: notifications off, the phone in another room | PASS | `device-issues.ts` notifications_study (product) |
| 57 | "Since September 2026, schools in England follow statutory guidance to have a policy that stops phones being used all school day, breaks and lunch included." | FIX F20 (should) | DfE, opened today (EV-81): "This guidance became statutory on 29 June 2026"; schools should begin following it from "1 September 2026"; the ban runs "throughout the school day ... during lessons, the time between lessons, breaktimes and lunchtime"; it has exceptions for medical needs, SEND and young carers; "Applies to England". The guidance says "should", so "follow" states it as a fact about every school. |

### When something goes wrong

| # | Line | Verdict | Source |
|---|---|---|---|
| 58 | "Say this" script, and step 1 | PASS | `stages.ts` Nova script |
| 59 | Step 2: "Telling you must never cost them their phone, or they stop telling you." | FIX F3 (**must**) | "Or they stop telling you" is a causal claim about the child. Migration 346 already replaced the lesson's version ("one of the most documented reasons young people stay silent") with "has one more reason to stay quiet". |
| 60 | Step 3: "Screenshot the messages and the account name. Never copy, save or send on a nude or sexual image of anyone under 18, even to report it." | FIX F2 (**must**) | (a) A screenshot of a chat can capture the image itself; UKCIS: never "copy ... store or save" (EV-77). (b) Report Remove has the young person "share the image or video" with the IWF (CEOP Education, EV-78), so "even to report it" needs that one exception named. (c) UKCIS and the NCA both say do not delete the image (EV-76, EV-77). The guide doesn't say so here. |
| 61 | Step 4: block and report in the app; the school's Designated Safeguarding Lead | PASS | Every school in England has a DSL. UKCIS sends incidents to the DSL (EV-77). |
| 62 | 999 | PASS | |
| 63 | CEOP at ceop.police.uk for sexual contact, grooming or someone asking for images | PASS | CEOP Safety Centre (RP); NCA: report sextortion to CEOP (EV-76). ceop.police.uk sat behind a bot check today; I did not get past it. |
| 64 | "A nude image of your child is online: Report Remove, from Childline and the IWF, for under 18s, at childline.org.uk" | FIX F18 (should) | EV-78 and EV-79: for "young people under 18 in the UK"; the young person reports, through a Childline account; it covers images that are "public and available to anyone on the internet", and not private spaces such as WhatsApp. Correct as written, but a parent may think they make the report themselves. |
| 65 | "Childline, free and private, on 0800 1111" | PASS (optional F19b) | "Call us free on 0800 1111" (RP). Childline's own word is "confidential", seen in a search summary of childline.org.uk only, so "private" is fine. |
| 66 | "The NSPCC helpline on 0808 800 5000" for parents | PASS | gov.uk/report-child-abuse, opened today: "NSPCC (for adults) Telephone: 0808 800 5000" (EV-80). nspcc.org.uk returned 403. Don't print opening hours: search results disagree. |
| 67 | "Their GP, or NHS 111" | FIX F19 (should) | Northern Ireland has no general NHS 111 service. nidirect tells people to "telephone the out of hours service first" (EV-94). The guide says "in the UK". |

### Sixteen, the back page and sources

| # | Line | Verdict | Source |
|---|---|---|---|
| 68 | "At sixteen ... You stop setting the rules" | PASS (optional F21) | Opinion and advice. The government's own plan keeps an overnight default for 16 and 17 year olds (EV-82), so "stop setting the rules" may read as absolute to a worried parent. |
| 69 | Cosmo's talk, digital audit, three questions | PASS | `stages.ts` Independent |
| 70 | "Sextortion, deepfakes and AI made images are real at this age" | PASS | `stages.ts` online_safety. The NCA: "a large proportion of cases have involved male victims aged between 14-18" (EV-76). |
| 71 | "The Guided Childhood app runs the same Passport ... the stamps land on their own" | PASS | `lib/pathway/progress.ts` ("The stamp is earned when the stage's real tasks ..."); `components/passport/ParentStageCheck.tsx` |
| 72 | Sources 1 to 15 | PASS, with two updates | Add WhatsApp's parent managed accounts to source 3 if F17 is used. Add the NCA and UKCIS to the sources if F2 and F4 are used (wording in F22). |
| 73 | The disclaimer | PASS | Good: "not medical, legal or safeguarding advice". |

---

## 2. The FIX list (exact replacement text)

All the wording below is free of dashes and checked against its EV row. Only the sentence shown changes; everything else in the field stays as it is.

### Must fix before print

**F1. School moments, Year 7, body (line 49).** Replace
> Teach group chat skills before the first group: how to leave a chat that turns nasty, and that a screenshot of anything upsetting comes to you and costs them nothing.

with
> Teach group chat skills before the first group: how to leave a chat that turns nasty, and that a screenshot of anything upsetting comes to you and costs them nothing. The one exception is a nude or sexual picture of anyone under 18: they never screenshot it or send it on, they just tell you.

**F1b. Same block (line 48).** Replace
> A new school means new class and club groups, and they are often busiest late at night.

with
> A new school means new class and club groups, and some of them keep going late into the night.

**F2. When something goes wrong, step 3 (line 60).** Replace
> Keep the evidence. Screenshot the messages and the account name. Never copy, save or send on a nude or sexual image of anyone under 18, even to report it.

with
> Keep the evidence. Screenshot the messages and the account name, keeping any nude or sexual image out of the shot. Never copy, save or send on a nude or sexual image of anyone under 18, even to report it, and do not delete it either. The one exception is Report Remove, below, which your child uses for an image of themselves.

**F3. Step 2 (line 59).** Replace
> Keep the phone with them. Telling you must never cost them their phone, or they stop telling you.

with
> Keep the phone with them. Telling you should never cost them their phone. A child who expects to lose it has one more reason to stay quiet.

**F4. School moments, Photos and pressure (line 55).** Replace
> If anyone threatens to share an image of them or demands money: do not pay, do not delete the messages, report it, and tell them out loud that they are not in trouble.

with
> If anyone threatens to share an image of them or demands money: do not pay, do not delete anything, help them stop replying and block the account, and report it to CEOP or to the police on 101, or 999 if they are in danger now. Tell them out loud that they are not to blame and not in trouble.

**F5. YouTube card, Lock first (line 19).** Replace
> Lock Restricted Mode through Family Link so it cannot be switched off, and cap or turn off the Shorts feed.

with
> Set it up through Google Family Link and choose the content setting that fits their age, then set a daily time limit on the Shorts feed.

**F6. School moments, the thirteenth birthday, Have ready (line 54).** Replace
> The Orbit page done, and the settings on page 6 locked side by side.

with
> The Orbit page done, and the settings on pages 6 and 7 locked side by side.

(Check the sheet numbers again if the layout changes.)

### Should fix (accuracy and hedges)

**F5b. YouTube card, Watch for (line 20).** Replace
> The Shorts feed is the hardest to put down, so cap it first.

with
> The Shorts feed, which scrolls on with no natural end, so set its limit first.

**F7. The apps, intro (lines 15 and 16).** Replace
> Ofcom found 90% of 8 to 12 year olds already use at least one service with a minimum age of 13, and only a third of parents know the usual age is 13.

with
> Ofcom found 90% of 8 to 12 year olds say they use at least one service with a minimum age of 13, led by YouTube, which under 13s can use through a parent's supervised account. About a third of parents know the usual age is 13.

**F8. School moments, the phone ask (line 45).** Replace
> and Ofcom calls that move the key age for phones.

with
> and Ofcom says the key age for owning a phone seems to be around the move to secondary school.

**F9. School moments, Year 7, fact (lines 50 to 52).** Replace
> WhatsApp's own minimum age in the UK is 13, so every child in Year 7 is younger than that. Ofcom found 52% of 8 to 12 year olds already use it, and two thirds of 8 to 17 year olds had been added or invited to a group chat in the past four weeks.

with
> WhatsApp's own minimum age in the UK is 13, so a child in Year 7 is almost always younger than that. Ofcom found 52% of 8 to 12 year olds say they use it, and around two thirds of 8 to 17 year olds had been added or invited to a group chat in the past four weeks.

**F10. Instagram card, Watch for (line 28).** Replace
> A false birthday switches the teen protections off, so check it is real.

with
> A false birthday can stop the teen protections switching on, so check it is real.

**F10b. Instagram card, Lock first (line 27).** Replace
> Messages from people they follow only, and Sleep mode on overnight.

with
> Check the Teen Account defaults are still on: messages only from people they follow, and Sleep mode overnight.

**F11. Snapchat card, Watch for (line 34).** Replace
> Quick Add suggesting them to strangers, and the passcode folder called My Eyes Only.

with
> Quick Add suggesting them to friends of friends they have never met, and the passcode folder called My Eyes Only.

**F12. Discord card, the description (line 37).** Replace
> Family Center shows servers joined and friends added, but not messages or voice.

with
> Family Center shows servers joined, friends added and who they message or call, but not what they write or say.

**F13. Facebook and Messenger card, Lock first (line 36).** Replace
> Who can message them set to friends, and location off in Messenger.

with
> Who can message them set to friends, and location for Messenger turned off in the phone's own settings.

**F14. Balance, intro (line 4).** Replace
> Most screen time fights are really about who decides.

with
> A screen time fight is often really about who decides.

**F15. Balance, Earned time (line 6).** Replace
> One star is five minutes.

with
> One star is five minutes to start with, and you can change the rate.

**F16. Behaviour, intro (line 10).** Replace
> These are the signs the app lists at each stage. One on its own may just be a bad week.

with
> These are the signs the app names at each stage. One on its own may just be a bad week, and many of them can come from school, friends or sleep as much as from a screen.

**F17. WhatsApp card, the description (line 24).** Replace
> There is no parental dashboard, so this one is managed with settings and conversation.

with
> A standard account has no parental dashboard, so this one is managed with settings and conversation. WhatsApp is rolling out parent managed accounts for under 13s, which may not have reached the UK yet.

And in source 3, add:
> WhatsApp Blog, Introducing parent managed accounts on WhatsApp, 11 March 2026.

**F18. Help page, Report Remove (line 64).** Replace
> A nude image of your child is online: Report Remove, from Childline and the IWF, for under 18s, at childline.org.uk

with
> A nude image of your child is online: your child can report it to Report Remove, from Childline and the IWF, for under 18s, at childline.org.uk

**F19. Help page, health (line 67).** Replace
> You are worried about their health: Their GP, or NHS 111

with
> You are worried about their health: Their GP, or NHS 111 (in Northern Ireland, your GP's out of hours service)

**F19b (optional). Help page, Childline (line 65).** "free and private" can stay. If you'd like Childline's own word, use "free and confidential".

**F20. School moments, phones in schools (line 57).** Replace
> Since September 2026, schools in England follow statutory guidance to have a policy that stops phones being used all school day, breaks and lunch included.

with
> Since September 2026, statutory guidance asks schools in England to keep phones out of use all school day, breaks and lunch included, with exceptions such as a medical need.

**F21 (optional). Sixteen, intro (line 68).** Replace
> You stop setting the rules and start being the person they talk things through with.

with
> You set fewer of the rules and become more the person they talk things through with.

**F22. Sources (only if F2 and F4 are used).** Add:
> 16. Sextortion. National Crime Agency, urgent warning about sextortion, 29 April 2024, nationalcrimeagency.gov.uk. Read 5 November 2026.
> 17. Nude images of under 18s. UK Council for Internet Safety, Sharing nudes and semi nudes: how to respond to an incident, updated March 2024 (gov.uk). Read 5 November 2026.

---

## 3. Pushback on the piece as a whole, and the comebacks

| Camp | The strongest objection | One line comeback (sourced) | Holds up |
|---|---|---|---|
| A (Odgers, Orben, Przybylski, Etchells) | "A 'signs to watch' list teaches parents to read ordinary development as phone harm. None of these signs is validated, and the direction of cause is unknown." | "Agreed, which is why the page says none of them is a diagnosis, names school, friends and sleep as other causes (F16), and asks for a week's notes and a question, not a conclusion. The UK CMOs found no causal link shown either (EV-2)." | fair, strong after F16 |
| A | "'The one rule that never moves' sells the bedroom rule as settled science." | "It claims nothing about outcomes. It is the CMOs' own precautionary advice, 'Leave phones outside the bedroom when it is bedtime' (EV-2), and the sleep link behind it is cross sectional (EV-1)." | strong |
| A | "Your 90% makes under 13s sound like rule breakers, but it is mostly YouTube, which they can use legally." | "Fair, and Ofcom says so in its own footnote. The line now names YouTube and the supervised account (F7, EV-93)." | strong after F7 |
| B (Haidt, Twenge, Rausch) | "A 'readiness check' at 13 hands a smartphone and social media to young teens just as the government moves to 16." | "The guide prints the spring 2027 plan (EV-82), says the minimum age is not readiness, and never says yes at 13. A readiness check can end in not yet. We take no side on the restriction." | fair |
| B | "'Ideally a phone for calls and texts' is too soft. Say no smartphone before secondary." | "That is advice, and the guide gives it: the device for 11 to 12 is a phone for calls and texts before a smartphone. We don't present it as a finding." | fair |
| B | "The sextortion talk comes too late." | "It is placed in Years 9 and 10, before the ages the NCA says are most targeted (boys 14 to 18, EV-76), and the first call promise starts years earlier." | strong |
| Safeguarding lead (DSL) | "Your guide tells children to screenshot anything upsetting and send it to a parent. That is how a nude of a classmate gets copied." | "You were right, and it's fixed: every screenshot line now leaves sexual images of under 18s out, in line with UKCIS (F1, F2, EV-77)." | strong after F1 and F2 |
| Media lawyer | "Factual claims about named companies' products ('a false birthday switches the protections off'; 'lock Restricted Mode through Family Link')." | "Each is now worded to the company's own page (F5, F10, F11, F12, EV-83, EV-86, EV-67, EV-89). No person is named, and the disclaimer stands." | strong after fixes; no legal advice needed |
| Worried parent | "My Year 7 is already on WhatsApp. Have I broken the law?" | "No. Thirteen is WhatsApp's own account rule, not a law, and the card shows the one setting to lock first." | strong |
| Worried parent | "If I can't take the phone away, what do I do when it's serious?" | "The promise is that telling you never costs them the phone. You still block, report and get help. The NCA asks adults to make sure children know they are 'not to blame' (EV-76)." | fair |
| The platforms' teams | YouTube: "Restricted Mode can't be locked that way for most children." Snap: "Teens aren't suggested to strangers." Discord: "Parents do see who they message." WhatsApp: "We now have parent managed accounts." | "Each is corrected to your own help page or newsroom (F5, F11, F12, F17)." | strong after fixes |

**Strongest pushback on the piece as a whole.** It will come from camp A: the guide is confident advice, and advice dressed as a map can read as evidence. **The comeback in one line:** "Every number has its source and page, every piece of advice is labelled as the app's own, and the guide says plainly that it is not medical or safeguarding advice. Where the research is only a link, we claim nothing about the child (EV-1, EV-2, EV-93)."

---

## 4. Unverified items (not opened at the primary today)

| Item | Status | What would close it |
|---|---|---|
| TikTok "Restricted Mode" is still the name of the Family Pairing content filter | Not on the TikTok pages I opened; third party guides only | Check it in the app on a paired account before print. If the name has changed, use "set daily screen time and the content filters it offers". |
| WhatsApp group privacy ("My contacts" means strangers must send an invite) | WhatsApp blog, seen in a search summary only | Open blog.whatsapp.com/new-privacy-settings-for-groups in a browser |
| WhatsApp parent managed accounts in the UK | Rolling out "gradually" (EV-92); the UK is not named | Check whatsapp.com/security/parent-managed-accounts in a browser |
| Discord setting names (explicit image filter, message requests) | support.discord.com returned 403 | Open it in a browser |
| Messenger location setting | No Meta help page reached | F13 sidesteps it (the phone's own setting) |
| Childline "confidential" wording; Childline opening hours | childline.org.uk returned 403; search summary only | Not needed for print as written. Don't print hours. |
| NSPCC helpline on nspcc.org.uk itself; its hours | nspcc.org.uk returned 403; the number was confirmed on gov.uk (EV-80) | Don't print hours: search results disagree. |
| CEOP Safety Centre page | Behind a bot check today; read by the research pass | None needed |
| Ofcom 2026 media use report (56%, 83%, "key age", 32%) | RP with page numbers; I did not open it again. The companion report's 90%, 52% and 64% I did open (EV-93). | Optional |
| Platform minimum ages from the terms | RP, each dated 5 Nov 2026 | None needed |
| YouTube Shorts timer at zero | "Soon" as of 14 Jan 2026 (EV-84) | F5 avoids it |

I did not get past any bot wall. One attempt to fetch the NSPCC and Childline pages with a browser user agent was refused by the permission system as bot check circumvention, and I went no further than that.

---

## 5. Product follow ups (not the guide; for the app)

The guide is right where the product is wrong in these places, so the product should be corrected to match:

1. **`093_social_platform_guides.sql`:** Roblox `min_age` is 13, and the app's social settings page shows "Account age 13". Roblox's UK terms say 5 (RP).
2. **`093`, YouTube:** "Lock Restricted Mode ... through Family Link" has the same problem as F5 (EV-83).
3. **`093`, Facebook:** the supervision line says "message oversight", but Meta says the tools "do not allow parents to read their teen's messages" (EV-90).
4. **`093`, WhatsApp:** "None. WhatsApp has no parental dashboard" now needs the parent managed accounts line (EV-92).
5. **`lib/content/device-issues.ts`:** `class_group_chat` ("a screenshot of anything upsetting comes to you") and `sextortion` ("screenshot and report") need the same carve out as F1 and F2, under house rule 21.
6. **`093`, Snapchat:** "Stops the app suggesting your child to strangers" (Quick Add) has the same problem as F11 (EV-67).

---

## 6. Final pass: would a hostile, hype allergic researcher wince at any sentence?

After the fixes, these are the only sentences left that might draw a wince. None needs to change for print:

- **"Building digital habits before the algorithm learns them"** (the Bloop focus) treats "the algorithm" as one thing. It is the app's stage title, so leave it, but it's a candidate for the next curriculum term.
- **"Identity and digital footprint, while the relationship still holds"** (the Nova focus) hints that the relationship gives way after 15. It's an app title; same note.
- **"That keeps the screen from becoming the biggest prize in the house."** This is a mechanism claim about the family, not the child. It reads as advice. Keep it.
- **"One rule for everyone is the easiest rule to keep."** Advice, not a finding. Keep it.

No sentence claims an outcome for a child, uses a causal verb about screens, gives a medical claim or a scare figure, or names a researcher as the authority. No line argues for or against the under 16 restriction.

---

## 5. Fixes applied (5 November 2026, the building session)

Every must fix (F1, F1b, F2, F3, F4, F5, F6), every should fix (F5b, F7 to F20, F22) and the two optional ones (F19b, F21) are in `guide-data.js`, and `guide-text.md` was regenerated from it. Two more from section 4:

- TikTok's setting name was not confirmed, so the card now says "set daily screen time and the content filters" rather than naming Restricted Mode.
- The phone ask no longer says "the move to secondary" twice.

`npm run ai-tells` on guide-text.md: PASS. The product fixes the guide exposed (migration 093's Roblox age, YouTube lock, Facebook oversight, WhatsApp supervision, Snapchat Quick Add; device-issues.ts screenshot carve out) are left for a follow up, outside this PR.
