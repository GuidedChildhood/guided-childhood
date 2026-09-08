# Appendix A5: privacy, safeguarding and security (evidence)

Read only sweep of origin/main 97ef53a on 5 September 2026. Paths relative to repo root. docs/ does not exist on main (CLAUDE.md references docs/02 and docs/11).

## 1. Privacy notice app/(marketing)/privacy/page.tsx

| Item | Evidence |
|---|---|
| Last updated | line 13 EFFECTIVE = '8 August 2026' |
| Controller identity | line 34 "Guided Childhood is the data controller for the information described here. You can reach us any time at hello@guidedchildhood.com." |
| Company number, legal form, registered address | ABSENT on privacy, terms (only line 74 "law of England and Wales"), contact page and footers |
| DPO or named contact | ABSENT on the parent notice. Schools pack says "our DPO contact named in the data processing agreement" (schools/app/hub/data-protection/page.tsx:106) but no DPA exists in the repo. plans/go-live-safety-checklist.md:88-93 records the decision: no DPO, Justin as contact |
| Lawful bases | lines 66-72: contract; consent (personalisation); explicit consent for wellbeing "health information"; legitimate interests |
| Data categories | lines 39-44 and 53 |
| Special category treatment | line 56 "It counts as health information, which means we only keep it if you have said yes to it specifically, separately from signing up... nothing is written down until you have" |
| Retention | line 87: check in entries "kept for two years and then removed"; payment records six years |
| Suppliers | lines 79-82: Supabase, Vercel, Stripe, Resend, Anthropic |
| International transfers | ABSENT. Only vercel.json:6-8 regions lhr1 is evidence of hosting location |
| AI memory logic | ABSENT. digi_memory (019_digi_brain.sql:24-33) and embeddings (045_semantic_memory.sql) not described; embedding providers Voyage AI or OpenAI (lib/digi/embeddings.ts:27, :41) not named |
| School controller and processor roles | ABSENT from the parent notice; present in the schools pack |
| Data collected but not listed | child phone (030_child_phone.sql:7-8); device_trust, use_mode, daily_limit_minutes, no_phone, buddy; child free text notes (147_kid_homework_notes.sql, 181_kid_day_notes.sql); DiGi question and reply text retained in digi_safety_flags (043_digi_intelligence.sql:14-20) |
| Retention promise vs code | No purge job for the two year check in retention anywhere in app/api/cron, lib or migrations |

## 2. Governance artefacts

| Artefact | Status |
|---|---|
| DPIA | Not present. Flagged mandatory and undone: plans/go-live-safety-checklist.md:98-99, 141-144; review.md:112 "We are pre DPIA sign off"; THE-STORY.md:336; plans/product-bill-of-materials.md:42 "HARD BLOCKER" open |
| Children's Code assessment | No standalone assessment; discussed in go-live-safety-checklist.md:50-53, 101 and plans/digi-learning-loop-plan.md:181-182 |
| Data map or ROPA | Absent (go-live-safety-checklist.md:102-105 notes it is needed) |
| Subprocessor list | Only the five names in the notice; schools pack names Supabase and Vercel (data-protection/page.tsx:76-77) |
| DPA template | Absent. Referenced as "available for signature with the licence" (data-protection/page.tsx:54-55); planned in plans/schools-lesson-build-spec.md:605, 648 |
| Incident response | Absent |
| Security page | Absent beyond privacy/page.tsx:100-103 |
| Accessibility statement | Absent |
| Schools data protection pack | Exists: schools/app/hub/data-protection/page.tsx (school is controller, GC is processor at 52-56; "EU hosted project region" at 76, unverifiable from code). Gated behind the school code. |

## 3. Row level security

Every table created in supabase/migrations has a matching enable row level security (130 plus tables, including the two _backup_lesson tables with RLS on and no policy). No table without RLS found. Core family and child tables scoped to the owner: profiles 001_initial.sql:40-46; children 001:107-109; wellbeing_checks 001:245-247; wellbeing_checkins 040:27-30; digi_conversations 001:181-183; digi_memory 019:36-37; digi_questions 001:209-215; family_quests, quest_ticks, kid_links, star_goals 029:71-80; concerns 027:34-38; kid_days 134:57-69; stage_passports 049:123-129; child_shares 064:31; planet_codes 253:40; planet_homes and planet_events 252:39-40, 60-61. School tables scoped to educator membership 023:162-178, 028:59-60.

> **Closed 8 September 2026: school_lessons.** Migration 274 drops that policy
> and revokes the anon and authenticated grants. The schools app now reads it
> server side through `schools/lib/supabase/server-db.ts` with the service role
> key. The other tables named in this paragraph are still open and are the next
> job, see plans/decisions.md, 8 September. This audit is left as it was found
> on 5 September rather than edited, so the record of what was true then holds.

> **Also closed 8 September 2026: the fifteen parents app content tables.**
> Migration 275 replaces their blanket policy with one roled to
> `authenticated` and revokes the anon grant, and shuts five functions anon
> could call. A signed in account can still read this content; that is the
> remaining job. See plans/decisions.md, 8 September.

Permissive using (true) policies are all read only content tables (expert_knowledge 019:21, school_lessons 023:160, digi_wisdom 043:46, daily_moments 009:36, lessons and guides in 002, 013, 014, 049, 093, 094, 102, 163).

Anon grants: 177_schools_schema.sql:23, 49 usage and default select on the schools schema; 195_school_invoice_requests.sql:33-36 insert to anon with check (true) on schools.invoice_requests (public form, no select for anon, no rate limit).

Policy gap: kid_links_own (029:77-78) checks only user_id, not that child_id belongs to that user (see 4).

## 4. Service role

- Central client lib/supabase/admin.ts:8-12. No client component imports it. The schools app has no admin client (schools/lib/supabase/anon.ts:3-9). [8 Sep: that file is now server-db.ts and does hold the service role key, server side only, enforced by wiring-check section 8a.]
- Cron routes: all 24 under app/api/cron check Bearer CRON_SECRET (e.g. age-up/route.ts:33-37 with a null guard) or cronAuthorised (lib/email/cron-kit.ts:147). Weakness: cron-kit.ts:147 and script-refresh/route.ts:38 compare against the template string with no null check, so an unset CRON_SECRET would accept the literal "Bearer undefined"; lib/email/index.ts:25, 53, 71 falls back to the HMAC key 'dev' for unsubscribe tokens if CRON_SECRET is unset.
- **[CLOSED 8 September 2026 in b3abf5a: POST and DELETE now take the user from the session and return 401 without one, and the DELETE is scoped to user_id.]** Unauthenticated service role route: app/api/push/subscribe/route.ts. getSupabase() (9-14) builds a service role client; POST (21) takes userId from the request body with no getUser() and upserts or deletes push_subscriptions for that id (33-41, 61-65); DELETE (77-86) deletes any subscription by endpoint. An anonymous caller who knows a user id can attach their own push endpoint to that account or remove a family's subscriptions.
- app/api/school/[id]/ics/route.ts:26-36: service role read keyed only by UUID, by design.
- app/verify/[code]/page.tsx:47-51, 73: service role read of children by passport_code, public, shows first name and stamps (comment 17-25 calls it "the DPIA line for this page").
- app/k/[token]/* (17 pages) and app/api/kid/* use the admin client after resolving an 18 hex token to a kid_links row.
- **[CLOSED 8 September 2026 in b3abf5a: the handler now checks the child belongs to the caller before minting a link.]** Ownership exception: app/api/quests/route.ts:218-228 action link inserts a kid_links row for body.child_id without checking that the child belongs to user.id; the policy only checks user_id. Needs another family's child UUID and no existing link, but would then resolve /k/token to another family's child.
- Public inserts with no rate limiting: app/api/starter/lead/route.ts:13-41, schools/app/pricing/actions.ts:39. No rate limiting at middleware or route level for auth, unlock, home codes or verify.

## 5. School access model

- Validation: plain text compare against an env allow list. schools/lib/access.ts:35-40 allowedCodes() splits SCHOOLS_ACCESS_CODES; matchCode (116-120) lower cases and compares. Not hashed, not in a table. Cookie HMAC SHA-256 signed (75-81, 101-112), 180 day TTL (31), constant time compare on the signature (85-90), fails closed if env missing (schools/proxy.ts:16-19).
- Rate limiting: none; a fixed 500 ms delay on a wrong code (schools/app/unlock/actions.ts:20-30).
- Example code on the public unlock page: schools/app/unlock/UnlockForm.tsx:60 placeholder="oakfield-2026". This exact string is the sample value in .env.local.template:62 SCHOOLS_ACCESS_CODES=oakfield-2026,pilot-autumn. Whether it is live in Vercel is UNKNOWN from code. The page is robots noindex (unlock/page.tsx:11).
- Rotation by editing the env var only (access.ts:25-28). No per school rotation, no expiry per code, no audit log, no staff identity (access.ts:15-21 "A code is a door, not an identity"). The school_educators tables (023:35-42) have no live callers.
- OPEN_PATHS (access.ts:60): /, /pricing, /draw, /unlock, /curriculum, /hub/rshe-mapping, /philosophy. Gated: /hub/* (including the data protection pack), /teach/*, /class/*, /print/*.

## 6. "No pupil accounts" reconciliation

- The schools app holds no session and only reads schools.school_lessons; its only writes are invoice_requests. The pupils table (023:55-60) and teacher judgement tables exist in schema with no callers.
- Bridge to the family app is a static per module HOME-XXXX code (230_school_home_codes.sql:8-19), redeemed by a logged in parent at app/api/school-code/route.ts:31-88, writing lesson_completions against the parent's own child. The school never learns which families redeemed; no pupil level progress is stored against a school.
- Children reach the app only through the parent minted kid_links token (72 bits, app/api/quests/route.ts:218-228) at /k/[token].
- Passport: children.passport_code (227:24-47, GC-XXXX-XXXX) is publicly verifiable at /verify/[code] showing first name and stage stamps with no login. The one place child data is readable by anyone holding a printed code.
- The pack's claim that the link is one "the parent creates, holds and can revoke" (data-protection:67-68) is true only via removing the child: no rotate or revoke action on kid_links exists.

## 7. Child data flows

- Fields: children (001:90-103) name, age_band, stage_id, streak; plus phone (030), device_trust (058), use_mode (059), buddy and accent (067), daily_limit_minutes (069), date_of_birth (083), interests (088), no_phone (105, 193), passport_code (227).
- Wellbeing: wellbeing_checks (001:225-241) mood, sleep, social, screen_mood, open_communication, concern_level, free text notes, per child per week, read into the DiGi prompt (app/api/digi/route.ts:199-208).
- Child typed free text: kid_homework_notes (147), kid_day_notes (181), the tell flow.
- Consent: profiles.wellbeing_consent_at and version (120:32-39), set via app/api/account/wellbeing-consent/route.ts:22-30, withdrawal deletes rows (42). Gap: app/api/tracker/route.ts:1-45 and tracker/quick/route.ts:14-67 upsert wellbeing_checks after auth only; the gate is the client prop hasConsent in tracker/checkin/page.tsx:21, 51.
- Child facing transparency: components/kid/KidPrivacyNote.tsx (40-55: jobs ticked, stars, timer; not messages, photos, searches; Childline number) in KidQuestScreen. The kid manifest omits the child's name (app/k/[token]/manifest/route.ts:21-23). The note does not mention that homework and day notes the child types are visible to the parent.

## 8. Deletion and export

- Delete: app/api/account/delete/route.ts:23-75. Suppresses email first, then admin.auth.admin.deleteUser relying on cascades: profiles from auth.users (001:14), children from profiles (001:92), migration 120 re pointed wellbeing_checks, digi_feedback, digi_memory to cascade from children (120:41-54); 122 did digi_prompts.
- Survivors after delete: digi_safety_flags (043:14-19) keeps question and reply text with user_id null; keepsake_interest (097:14) set null; lesson_deliveries.teacher_id (023:91) no cascade; email tables keyed by address not cascaded (suppression handled, erasure not).
- Export: ABSENT. The notice promises "receive a copy to take elsewhere" by email request (line 92).

## 9. Middleware and auth

- middleware.ts:12 protects /dashboard, /admin, /onboarding (session 69-76, paywall 93-107, plan choice 138-146). Fails safe to /login (161-172). Blocks /ref-* in production (36-38).
- /k/* is public by design; the 18 hex token is the credential, validated per page (app/k/[token]/page.tsx:53-61). No cookie, no PIN. Token never rotates. Kid pages scope by link.child_id and link.user_id; no kid page selects parent profile fields.
- Schools: schools/proxy.ts gates everything outside OPEN_PATHS on the signed cookie.

## 10. Secrets hygiene

No .env with real values committed (only .env.local.template and agents/.env.example, placeholders). plans/master-build-plan.md:27 has a short placeholder whsec_ string labelled Placeholder. package-lock.json eyJ match is an integrity hash. No sk_live, sk_test, re_ or JWT service keys in code.

## 11. Headers and CSP

vercel.json:9-35, app-vercel.json:7-21, schools/vercel.json:7-27: nosniff, X-Frame-Options DENY, X-XSS-Protection, Referrer-Policy; /api/* no-store. No Content-Security-Policy, no Strict-Transport-Security, no Permissions-Policy in either app.

## 12. Summary against the hypotheses

| Hypothesis | Status | Evidence |
|---|---|---|
| Notice lacks full legal controller identity and address | Confirmed | privacy:34, none anywhere |
| Children's data DPIA missing | Confirmed | go-live-safety-checklist:98, 141; review.md:112 |
| School controller and processor roles | Partial | schools pack 52-56; absent from parent notice; no DPA file |
| International transfer safeguards | Confirmed absent | Anthropic, Voyage or OpenAI, Stripe, Resend are US processors |
| AI memory logic not explained | Confirmed | 019:24-33, 045, embeddings.ts |
| Child facing transparency layer | Handled in app, absent in notice | KidPrivacyNote.tsx |
| Mood, sleep, friendship as special category | Handled (explicit, separate, withdrawable consent) but server gate missing | privacy:56-69; 120; tracker routes |
| Public unlock page shows plausible example code | Confirmed | UnlockForm.tsx:60 equals .env.local.template:62 sample |
| School codes rate limited, hashed, rotatable, staff level, audited | Absent except signed cookie and 500 ms delay | access.ts:35-44 |
| School code alone not a long term identity | Acknowledged in code | access.ts:15-21 |
| "No pupil accounts" vs family app, quest link, progress, passport | Reconciled | home codes credit the parent's own record; passport is parent owned; schools app stores no pupil rows |

Top five risks, ranked:
1. app/api/push/subscribe/route.ts: service role client, no authentication, userId from the body. **[CLOSED 8 September 2026 in b3abf5a.]**
2. Special category writes not consent gated server side; two year retention promise has no purge job; digi_safety_flags retains text after account deletion.
3. Controller identity, transfers, AI memory and embedding subprocessors missing from the notice; no DPIA, ROPA, DPA or incident process.
4. Schools access: plain text env allow list, no rate limit, no rotation or audit, and the public form advertises the template's sample code.
5. Kid link tokens never rotate or revoke short of deleting the child; a link can be minted for a child_id not owned by the caller. No CSP or HSTS on either app.
