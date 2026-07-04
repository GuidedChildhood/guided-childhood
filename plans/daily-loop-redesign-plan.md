
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
