# The First WhatsApp Moment — platform build plan

Date: 27 August 2026. Source: verified briefing `briefings/2026-08-27-first-whatsapp-moment-v2.html`
plus a full codebase gap analysis. PR #910 carries the briefing and this plan.

## The headline from the gap analysis

The product already owns most of this moment. The Year 6 into Year 7 first phone
bridge exists at `/dashboard/secondary` (driven by `lib/learning/transition.ts` and
surfaced on Home by `PhoneBridgeCard`), the `first-phone` agreement type already has
the device-sleeps-in-the-kitchen and never-join-a-pile-on clauses, the WhatsApp
settings guide already includes Groups set to My Contacts, migration 218 already
fires a DiGi stage arrival prompt at the stage 3 crossing grounded in class chat
research, and seven group chat scripts plus the "Bystander or upstander" lessons
are live. So this plan is mostly small data migrations and copy additions on
existing surfaces, not new systems.

**Terminology warning:** "handover" in this codebase means handing the child app
link to the child's device (QrHandoverModal, `profiles.handover_choice`). Never
name a new feature "handover"; use "first phone deal" or "the SIM week".

## The work, smallest first

### 1. First Phone Deal completion (SMALL, pure data)
- Add two clauses to `lib/content/agreement-clauses.ts` under `first-phone`:
  WHATSAPP_GROUPS (groups set to My Contacts before the SIM goes in, read
  receipts off, mute is a skill not an insult) and NO_CONFISCATION (if you show
  us something bad, the phone is not taken; we fix it together). The
  no-confiscation principle exists in content but has no agreement clause; the
  research says it is the condition of disclosure.
- One idempotent migration adding read receipts and mute rows to the WhatsApp
  entry in `social_platform_guides`.
- A short framing pass on `/dashboard/secondary` linking the pieces in order:
  deal first, settings second, scripts third, before the SIM. Do NOT build a new
  route; that page is the shell.

### 2. Group chat script set completion (SMALL, one seed migration)
Existing: pile-on, taken out of the group, added by a stranger, the class group
at 11pm, vile forward, left out, first smartphone setup. Missing, to seed
following the `153_three_missing_scripts.sql` pattern:
- "Leaving a group kindly" (exit and ally teaching exists only as expert
  knowledge, not a script)
- "The parents' own class group drama" (nothing anywhere covers parent to
  parent WhatsApp conflict)
- "The first week frenzy" (the 200 message weekend, mute without drama)
Check the live scripts table before seeding; the snapshot fixture is partial.

### 3. DiGi knowledge top up (SMALL, one seed migration)
Migration 218 already owns the age trigger; do not build a second one. Add
expert_knowledge rows for the findings it does not yet hold: messaging versus
feeds (Valkenburg; 72 percent feel closer), night waking OR 5.66 and the ringer
finding, exclusion mechanics (Marengo/Lin, calibrated), availability pressure
and the seen function, the My Contacts mass-add fix, and the 3.6 percent
persistently-high trajectory stat with its "cannot see age 11" caveat. Tag
topics {social_media, sleep, friendships, stage_arrival} bands {8-10, 11-13} so
both the arrival prompt and chat retrieval find them.

### 4. Stage 3 child lessons via Orbit (SMALL-MEDIUM, lesson authoring)
Existing lessons cover the pile-on. New `lessons` rows (slides jsonb, database
not code) covering the SKILLS: "Mute is a skill, leaving is allowed", "The chat
at night" (night waking, availability pressure). Must not restate the bystander
lesson.

### 5. First WhatsApp Kit lead magnet (SMALL for one-pager)
The magnet machine is a pure-data extension point: one entry in
`lib/magnets/registry.ts`, one marketing page (pattern: `five-questions`) with
MagnetGate. Content already exists in-product (deal clauses, settings checklist,
scripts). The back-to-school email already promises "what to do when the year
group WhatsApp starts without you"; this kit is the fulfilment of that line.
Copy leads with the calm claim: the frenzy has never been measured, very few
children get stuck in it. Multi-page designed kit later via printables-engine.

### 6. Schools: Year 6 summer transition lesson + heads letter (MEDIUM, own lane)
ks2-08 (Years 3-6 group chats) and ks3-11 (Years 7-9) bracket the transition but
no transition-specific lesson exists, and no heads letter template exists
anywhere in `schools/`. New `school_lessons` row plus manifest entry (note: a
22nd module changes the "21 module" copy in several places), and a printable
letter page following the `hub/parents` print pattern. Schools is its own lane
under the multi-session rules; claim it in a separate draft PR when started.

## Claims discipline (binding on all copy above)
- Never say the frenzy harms children. Unmeasured; only 3.6 percent stay
  persistently high; never "it settles for everyone" (the study cannot see age 11).
- Never import feed statistics into messaging claims. Say associated, never causes.
- The 29 percent exclusion stat is demoted and banned; use "children name being
  kicked from the group as a distinct act of bullying" instead.
- Confiscation fear is "a main reason" children hide problems, not "the biggest".
