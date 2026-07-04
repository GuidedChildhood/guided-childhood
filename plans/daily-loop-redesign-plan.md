
### 15. The school email promo screen and the sibling question (Justin, post launch review)
Two additions from the first live walkthrough:

**School email promo.** Once inbound routing is live, promote it in two places: a dashboard card ("Add your school's email and your child's tasks, dates and kit days build themselves into alerts") and a new email in the lifecycle chain (day 10 or so: connect your school email). The promo screen explains what we extract (dates, kit, payments, homework) and that the raw email is never stored.

**Multiple children.** Onboarding currently captures one child; the children table already supports many (is_primary flag). Needed: an "Add another child" flow in settings and on the dashboard, a child switcher, per child stage content and daily trail, per child concerns and routines, and alerts that always name which child they are about. One account, one subscription, every sibling on their own stage. Design question to resolve: whether the daily loop interleaves children in one trail or the parent switches between trails.

### 16. Second live review batch (Justin, 3 Jul evening)
1. **Pill nav** (BUILT 3 Jul): segmented pill tabs on the desktop dashboard nav, dark espresso pill for the active tab, soft white wash on hover, matching the agency reference Justin supplied.
2. **Pathway clear on every login:** the first thing after login orients the parent on their pathway position before anything else competes.
3. **Feature education email chain:** extend the lifecycle emails so each feature gets its own short email over the first weeks: the tracker, the agreement, devices, moments, the curriculum and lessons, the AI module. One feature per email, one action each.
4. **Tracker rebuilt around daily goals and streaks:** daily goals with achieved or not, a Duolingo style streak (current streak, longest, freeze rule to forgive one missed day), PWA push tied to the streak state. The weekly wellbeing check stays as the Friday ritual; the daily layer sits on top. Device follow ups feed it: the devices the family registered generate daily tasks when issues arise.
5. **Lessons tab as digital home schooling:** link the built but hidden lessons hub into the nav as the home of the monthly curriculum, and start filling content from the week 10 plan. The animation section (squad video beats) starts here.

### 17. School email trust, copy and setup UX (Justin, 3 Jul)
Parents will hesitate to forward school emails. The design already earns trust, the copy must carry it:

**The letterbox line (use everywhere):** "You are giving us a letterbox, not a key. We never see your inbox. You choose exactly which senders get forwarded, and we keep the actions, never the email."

**The five reassurances, in order:**
1. We never access your inbox. No login, no password, no permissions. Forwarding happens inside your own email account, under your control.
2. You choose the senders. Only the addresses you pick ever reach us.
3. We keep the actions, not the email. DiGi reads it once, pulls out the dates, kit, payments and homework, and the original email is deleted straight away. It is never stored.
4. Everything stays in your account. Nothing is shared, nothing is sold, delete it all any time.
5. Switching off is instant: delete the forwarding rule in your email and it is over. Your private address is useless to anyone else.
6. Your inbox does not change. Forwarding sends us a copy: the school's email still lands in your inbox exactly as it does today, nothing moved, nothing missed. Setup instructions explicitly say to leave Gmail's "skip the inbox" and archive options unticked.

**Setup friction, solved in the flow:**
- Start with ONE sender (the school office address). More can be added later, never demand completeness up front.
- Provider picker (Gmail / Outlook / other) with step by step screenshots per provider.
- Gmail allows one filter to cover several senders (from a OR from b), so one rule per source, not per address. The setup screen generates the exact filter text to copy and paste.
- IMPLEMENTATION NOTE: Gmail requires verifying a forwarding address with a confirmation code it emails to that address. The inbound webhook must catch Google's verification email and surface the code on the setup screen so the parent can complete the Gmail step without leaving the flow.

**The lifecycle email introducing it** leads with the problem (the buried PE kit email, the missed trip deadline), then the letterbox line, then one button: Set it up in three minutes.

### 18. Native app question (Justin, 3 Jul): decided, not yet
The PWA already delivers push notifications on both platforms. A basic native app would be a Capacitor wrapper around the same platform plus APNs/FCM push: one to two sprints plus Apple fees and store review upkeep. Decision: build behind demand. Triggers that change the answer: parents in real conversations looking for it in the App Store, measurable install drop off at the Add to Home Screen step, or home screen widgets being prioritised. Until then, the daily loop sprint ships a guided install moment (20 second walkthrough with illustrated iPhone steps) which closes most of the same gap for free.

## The smartphone first principle (Justin, 3 Jul)
The smartphone is almost certainly the most used device in every family we serve. It leads everywhere: the wow page and marketing examples default to phone moments (the 5pm phone battle, the bedroom door and the phone, the group chat), the Device Safety Hub orders phone guides first (iPhone and Android before consoles and TVs), the moments tagger's picture tiles favour phone scenarios at Explorer stage and up, DiGi's context already knows the child's stage and should assume phone questions are the default at 11 and over, and the age playbook treats the first smartphone as the biggest single event on the pathway (its own preparation sequence: before, day one, first month).

## Device Hub upgrade: settings first, research backed, refreshed yearly (Justin, 3 Jul)
1. **Feels researched because it is:** every device guide leads with the evidence line (why this setting matters, which research or guidance it comes from: Ofcom, ICO age appropriate design code, the platform's own research base) before the steps. The science is the trust.
2. **Settings first, always:** each guide opens with the settings checklist (the tonight list), then the conversation, then the deeper detail. Tick off each setting, completion stored per device (device_setup table already exists).
3. **The yearly settings review in their calendar:** every device guide gets an "Add a yearly reminder" button producing a calendar file (ICS, works with Apple, Google and Outlook): one recurring event per year ("Review the iPhone settings with your child, new OS versions change the defaults"). New OS by age: when the child crosses a stage boundary, the age playbook resurfaces the relevant device guides ("They are 11 now, these three settings change").
4. **Images per device:** one consistent product style image per device guide (19 devices), Higgsfield batch job with one style brief (clean, soft shadow, pastel background matching the stage tints, no text in image), stored in /public/devices. Same batch session as the moments tiles.

### 19. From Justin's live DiGi test (4 Jul)
1. **DiGi freeze fixed (SHIPPED 4 Jul):** the API had no time protection, so a slow model call left the parent on an endless spinner. Now: 45 second model timeout with one retry, 60 second function ceiling, a warm 503 ("ask again, your message was not lost"), and a 65 second client abort with the same tone. Gentle nudges added to the system prompt: one practical aside every few exchanges from real family context (device not set up, tomorrow's school item, Friday check in), never during emotional conversations.
2. **DiGi conversations ARE saved** (digi_conversations and digi_questions on every exchange). Future: an insights view over them (top themes per stage, questions the content library does not yet answer feeding the monthly script drop).
3. **Reminders on the dashboard:** the Things you need to know card (school actions + routines + device recheck) is the vehicle, already planned in the Today stack.
4. **Starter pack benefits list:** the result page gets a plain what you get list naming everything real: moments, 160 scripts, DiGi, tracker with streaks, device settings checklists, family agreement, monthly lessons, school reminders, weekly advice emails.

## The Smartphone Programme (Justin, 4 Jul): maximum hand holding on the device that matters most
The smartphone gets its own guided programme inside the Devices section, not just a settings list. Evidence based, detailed, workable, age related throughout:

1. **One place, the whole phone story:** settings (the iOS and Android checklists from the device module, per age), how children actually use phones at each age (what is normal at 9, at 11, at 14, drawn from Ofcom children's media use data), how to keep control without surveillance (structure not spying), and the scripts for every phone moment (handover day, the passcode conversation, the 13th birthday, checking in without snooping).
2. **Modelling: the parent's own phone use, its own section.** The evidence is blunt: children copy what parents do with phones far more than what parents say. Content: a two minute honest self audit (phone at dinner? first thing at waking? mid conversation?), the family rules that bind adults too (the bedroom rule for everyone is already in the agreement defaults), the "caught out" script for when a child names the hypocrisy (answer with repair, not defence), and one modelling habit per stage (narrate your phone use out loud at Foundation, visible put downs at Builder, co-scrolling at Explorer, respect their focus at Shaper). Framed warm: this is the highest leverage free change in the whole platform.
3. **Age related everything:** each piece renders for the child's stage. The programme IS the first smartphone preparation sequence (before, day one, first month) extended to cover the whole phone life to 16.
4. **Evidence lines on every claim,** same rule as the device module: Ofcom, the ICO code, the research base. The science is the trust.

### 20. The Right Now button (Justin, 4 Jul, live phone test)
The emergency entry point: a child is crying because the TV went off, the parent needs words this second. One always visible button (candidate: the centre slot of the bottom tab bar, Duolingo style, butter circle) labelled "Right now". Tapping it: a two tap picker (who is melting down about what: TV off, phone handover, bedtime, sibling, something else) → instantly the calm script card for that exact moment (say this, not this), no browsing, no typing, under five seconds from tap to words. Below the script: "Talk it through with DiGi" carrying the moment as context, and the moment auto logs to the concerns ledger for tomorrow's check in. This is the single highest emotional value interaction in the product: the parent who gets rescued mid meltdown never churns. Also from the same test: bottom nav icons approved, but the next version needs the clear journey route (the node path home answers this), and DiGi assisting unprompted every now and then (the nudge rule shipped 4 Jul, extends with the concerns ledger).

### 21. AI lessons become slides with images, per age (Justin, 4 Jul)
The 54 AI module lessons (age tiers 7, 10, 13, 16) move from flat text into the existing slide player (the migration 017 contract: slide types for concept, quick check, say this tonight, try it, recap). Each lesson opens with an image slide up top: one Higgsfield illustration per lesson matched to the age tier's visual weight (playful and warm at 7, cleaner and more real at 13 and 16), same consistent style family as the moments tiles and device images (one batch brief, /public/ai-lessons). Conversion is mechanical: an agent content pass maps each ai_lessons row (the idea, why it matters, try this, key message) into the slides JSON, adds one quick check question per lesson, and the age tier drives both tone and image style. The AI tab then runs lessons exactly like the curriculum player: tap through, progress saved, completion feeding the blended stage progress.

### 22. Phone setup is instruction one (Justin, 4 Jul, after his own install took help)
Getting the app on the phone with notifications on becomes the FIRST thing the platform asks of a parent, because the daily loop lives or dies on it:
1. **A dedicated guided page** (/dashboard/setup-phone): detects the device, shows only the right path. iPhone: Safari share button (with a picture of the icon) → scroll the sheet → Add to Home Screen → Add → open from the new icon → tap Allow when asked. Android: the install banner or menu → Install. Each step one screen, one image, Next button, 20 seconds total. Ends by confirming: standalone mode detected plus a push_subscriptions row means DONE, celebrate.
2. **Surfaced everywhere until done:** the first card on dashboard home ("Put Guided Childhood on your phone, it takes 20 seconds"), a step in onboarding right after the first script moment, and the second button of the welcome email. Detection hides it forever once standalone plus subscribed.
3. **The notifications ask moves inside the flow** so the PushPrompt card stops being something to find by scrolling. Known iPhone traps handled in copy: must be Safari, must open from the icon afterwards, the card only works inside the installed app.

### 23. DiGi replies on moment cards are unreadable (Justin screenshot, 4 Jul)
Confirmed on the live dashboard: asking DiGi from a moment card renders the reply inside the small carousel card, a paragraph squeezed into a thumbnail. Fix is the focus mode pattern applied to the home moment cards: tapping a card (or DiGi answering on one) expands it to a centred, full width focus view over a dimmed backdrop, reply at reading size (15px body minimum), answer chips beneath, and one clear "Back to moments" that returns to the carousel exactly where the parent left it. The carousel thumbnail only ever shows the moment title and image, never conversation text.

### 24. The evidence moat (Justin, 4 Jul)
DiGi already has an evidence layer: the expert_knowledge table (migration 019) seeded with findings from Odgers, Orben, NHS aligned guidance and UK crisis signposting, injected into every reply. Justin's ask makes it the moat:
1. **Expand expert_knowledge into the full evidence bank:** child neuroscience and mental health findings, the research base behind every pathway position, and the recommendations of every body parents trust: NSPCC, NHS and MindEd, Internet Matters, UKCIS, the ICO age appropriate design code, Ofcom children's media literacy. Every row carries source name, finding, the stages and topics it applies to, and a citation URL. Populated by a deep research pass (the kids-research skill exists for exactly this), landing in the admin review queue before going live, same approved only rule as the device module.
2. **Where it shows:** DiGi cites its sources naturally ("the NHS guidance on this says..."), device guides and lessons carry their evidence lines, and a public /evidence page lists the research base openly: the marketing moat is that no competitor can say "every recommendation traceable to a source" and mean it.
3. **Kept current:** the research watch pipeline extends to evidence (new findings and updated guidance land as proposed updates for approval).
4. **Can parents ask DiGi anything? Yes by design:** DiGi answers any parenting, screens, development or family wellbeing question, calibrated to the child's stage, with hard guardrails (never diagnose, never allow or deny, crisis questions signposted to real humans, NHS 111, GP, Childline). The evidence bank widens what it can answer WITH sources rather than narrowing what it can be asked.

**24b. Device counsel, science backed (Justin, 4 Jul).** The evidence bank powers DiGi's device advice as a first class capability: what device at what age (the stage device positions already in lib/content/stages.ts: shared family device with full supervision at Foundation, feature phone before smartphone at Explorer), under what restrictions (the 106 per stage setting recommendations in the device module), with which usage pattern (co viewing at 4 to 7, time structure at 8 to 10, the algorithm conversation before any feed), every position carrying its research citation from the evidence bank. DiGi prompts proactively at the decision moments: a child approaching a stage boundary, a birthday, a flagged "asking for a phone" concern → "Before you buy, here is what the evidence supports at 11, and the three restrictions that matter more than the model." The same counsel renders as a public buying guide per age (SEO surface, the evidence moat made visible to parents who have not signed up yet).
