# The school inbox: every school email in one place, and the Google Classroom link

Justin, 16 September 2026, with a screenshot of a Churchill Academy email:
*"Can we build a plan how we can centralise all the different emails from school
to auto write reminders, ideas on this, so this easily syncs with Google
Classroom."*

The screenshot is the exact case to build against. Sender **Churchill Academy**,
subject *"A weekly update on Alma's homework"*, preview *"Alma's homework updates
for the week beginning 14th September"*, **and a paperclip**. Three things in one
email: a named child, a week of homework, and the actual content sitting inside
an attachment we currently drop on the floor.

---

## 1. The good news, and it is most of the work

This is not a green field. The letterbox was built in July, proven, then parked
by Justin on 12 August so the school card could be the alert calendar and nothing
else (`lib/config/school.ts`). Everything below already runs:

| Piece | Where | State |
| --- | --- | --- |
| Private per family forwarding address `school+<token>@in.guidedchildhood.com` | `app/api/school/connect/route.ts` | Built |
| Inbound webhook, Resend svix signature verified by hand, shared secret fallback | `app/api/school/inbound/route.ts` | Built |
| DiGi extraction into six kinds: kit, payment, homework, event, deadline, notice | same file, `extract()` | Built |
| Gmail forwarding confirmation code caught and shown in flow, never leaves the setup screen | same file plus migration 028 | Built |
| Storage with due date, due time, weekly recurrence, per child, holiday hold, provenance | `school_actions`, migrations 020, 037, 056, 065, 179, 182, 215 | Built |
| Evening reminder the night before, 17:00 | `app/api/school/remind/route.ts` | Built |
| Morning list, 07:05, parent and child | `app/api/school/morning/route.ts` | Built |
| The hour before, every fifteen minutes, timed items only | `app/api/school/soon/route.ts` | Built |
| The week as seven day rows, add, tick, delete, recurrence | `components/school/SchoolWeek.tsx` | Built |
| One tap calendar file per reminder | `app/api/school/[id]/ics/route.ts` | Built |
| MX health check so a parent never forwards into a silent bounce | `app/api/school/health/route.ts` | Built |
| The rule about what a child may see, written once | `lib/school/child-items.ts` | Built |

**The door is shut in two places, both one word.**
`lib/config/school.ts:16` `SCHOOL_EMAIL_FORWARDING_LIVE = false` and
`components/digi/SchoolLink.tsx:19` `SCHOOL_LINK_LIVE = false`.

So the honest shape of this job is not *build a school inbox*. It is *open the
one we built, then fix the six things that stop it holding a real family's
school post*.

---

## 2. What actually stops it centralising today

1. **One school per family.** `school_connections` is one row per user with one
   `school_name`, one `sender_addresses` list and one token, read with
   `.maybeSingle()`. A family with a child at a primary and a child at a
   secondary has two schools, two comms systems and one bucket.
2. **A caught action belongs to nobody.** The inbound insert never sets
   `child_id`, even though migration 215 added it and the card shows it. So the
   Churchill email about Alma lands as a family wide reminder, and a house with
   two children gets a list it has to decode every time.
3. **Attachments are dropped.** `normalisePayload` reads text, html, body, raw
   and content. Nothing reads attachments. The Churchill email's homework is in
   the PDF, so we would extract the covering sentence and miss the week.
4. **The app notifiers are a cul de sac.** ClassDojo, Arbor, ParentPay,
   Tapestry, Seesaw, Satchel One and the rest mostly send *"you have a message
   waiting"*. The extractor handles this honestly with a `notice` item saying go
   and look, which is right, and is also the opposite of centralising. Half a
   parent's school post is these.
5. **No dedupe.** A weekly update forwarded twice, or resent by the school, makes
   two of everything. Nothing keys an action to the email it came from.
6. **Nothing goes out as a feed.** There is one ICS per action, no per family
   feed, so a parent who lives in Google Calendar has to tap every item.
7. **Google Classroom: nothing.** Zero references in the codebase.

---

## 3. The Google Classroom question, answered honestly

Checked 16 September 2026, because getting this wrong costs a fortnight.

**Route C is the one everybody imagines, and it is the one we cannot have.**
A guardian cannot read coursework through the Classroom API. The guardian scopes
(`classroom.guardianlinks.me.readonly`, `.students.readonly`, `.students`) manage
guardian links and invitations only. Coursework lives behind
`classroom.coursework.me.readonly` (the student) and
`classroom.coursework.students.readonly` (the teacher). So the only API path from
a parent's seat runs through the **child's school issued Google account**, which
on a Workspace for Education tenant needs that school's admin to allowlist our
app, plus Google's restricted scope review. It also puts a child's school account
credentials into our product, against the grain of everything in
THE-STORY.md section 3. **Park it.** If it ever happens it belongs to the schools
product, where the admin is in the room, not the consumer app.

**Route A is the one that ships, and it ships through the pipe we already own.**
Google Classroom sends **guardian email summaries** to the parent's own inbox,
daily or weekly, from `no-reply+<hash>@classroom.google.com`. They contain
missing work, upcoming work (today and tomorrow on daily, the week ahead on
weekly) and class activity. No grades. That is a structured, machine readable,
already permissioned feed of exactly what Justin is asking for, arriving as
email, addressed to the parent, needing no OAuth, no scopes, no admin approval
and no child account. Our existing sender allowlist already matches on substring
(`from.includes(s)`), so `classroom.google.com` in the list works as written.

Worth saying out loud: *syncing with Google Classroom* and *catching the Google
Classroom summary email* land in the same place for the parent. They open the app
and tomorrow's homework is there. The difference is one takes a week and the
other takes a school's IT department.

**Route B is the other half of the word sync: calendar, both directions.**
Out: one subscribable ICS feed per family, so everything DiGi caught appears in
Google Calendar, Apple Calendar or Outlook without a single tap per item. In:
Classroom puts every dated assignment on a per class Google Calendar, and a
teacher can make that calendar public and hand out its link. Where a school does
that, the parent pastes the URL and we poll it. No OAuth either side.

**And why not simply read the parent's Gmail.** `gmail.readonly` is a restricted
scope: Google verification plus an annual third party CASA security assessment,
with real money and real calendar attached. It also breaks the sentence already
on the card, *"DiGi never sees your inbox, only what you forward"*, which is the
line that makes a nervous parent say yes. Forwarding is not the compromise here,
it is the better product. Stay on it.

---

## 4. The build, in slices

Small PRs, merged the same day, per the multi session rules. Next free migration
number is **303** (highest on main is `302_school_supply_requests.sql`, and the
one open PR, 1104, carries no migration).

### Slice 0. Prove the pipe, then open the door. No migration.
The cheapest slice and the one that unlocks every other one.

1. Confirm `in.guidedchildhood.com` has MX records pointed at Resend, and that
   `SCHOOL_INBOUND_DOMAIN`, `RESEND_INBOUND_SIGNING_SECRET` and `RESEND_API_KEY`
   are set on the production project. `/api/school/health` answers the first part
   in one request.
2. Send a real school email through it end to end, from Justin's own inbox,
   using the Churchill email in the screenshot.
3. Flip `SCHOOL_EMAIL_FORWARDING_LIVE` and `SCHOOL_LINK_LIVE` to `true`.
4. The setup copy moves from "Coming soon" to the three tap flow in slice 2.

If the MX is not live, slice 0 becomes a DNS task and everything else waits,
which is exactly why it goes first.

### Slice 1. Many schools, many children. Migration 303.
The centralising slice.

- `school_connections` gains `child_id uuid references public.children(id) on
  delete cascade` and `label text`, and loses the implicit one per family
  assumption. The token stays one per family, because one forwarding address is
  the whole convenience; routing happens on the sender, not the address.
- A `school_senders` child table, or simply per connection sender lists, so
  Churchill Academy maps to Alma and the primary maps to her brother.
- `app/api/school/connect/route.ts` returns a list, not a row. Every
  `.maybeSingle()` on `school_connections` becomes a list read. There are two.
- The inbound route resolves the sender to a connection, and writes that
  connection's `child_id` onto every action it creates.
- Fallback when the sender matches nothing and the family has one child: that
  child. More than one child and no match: `child_id` null, exactly as today, and
  the card already handles it.

**Second signal for the child, free:** when the extractor sees a first name in
the subject that matches a child on the account (*"A weekly update on Alma's
homework"*), that wins over the sender mapping. Names only, matched against
children we already hold, never a guess.

### Slice 2. The senders chosen for them. No migration.
Naming sender addresses is where setup dies. Nobody knows their school's
noreply address.

- A built in directory of the UK school comms systems, in the repo, not the
  database, because it is a constant and not content: ClassDojo, Arbor,
  ParentPay, Tapestry, Seesaw, Satchel One, Weduc, Class Charts, MCAS, SIMS
  InTouch, Eduspot, Google Classroom.
- Setup becomes: name the school, tap the systems it uses from a grid of logos,
  done. The sender list is filled in for them and their own school domain is one
  free text box.
- The generated Gmail filter text already exists in the setup flow. It gets the
  chosen senders too.

### Slice 3. Dedupe, and the attachment. Migration 304.
The Churchill slice.

- `school_actions` gains `source_email_id text` and `source_hash text`, with a
  unique index on `(user_id, source_hash)`. The hash is sender plus subject plus
  due date plus normalised title, so the same email forwarded twice, or the
  school's own resend, is a no op rather than a second PE kit.
- The inbound route reads `attachments` from the Resend payload, and where the
  webhook carries only metadata it already knows how to fetch the full email by
  id (`fetchInboundBody`). Extend that to pull a PDF or DOCX attachment, extract
  its text, and pass it to `extract()` alongside the body, capped, with the raw
  file never stored. Same promise as today: we keep the actions, not the post.
- Cap: one attachment, first 8,000 characters. A homework PDF is not a book.

### Slice 4. Classroom summaries as a first class source. No migration.
- `classroom.google.com` joins the sender directory with its own card and its own
  two line instruction: turn on guardian summaries with your school, choose
  weekly, forward them here.
- The extractor prompt learns the guardian summary shape, which is regular and
  sectioned: **Missing**, **Due today**, **Due tomorrow**, **Due next week**,
  **Class activity**. Each line carries a class name and a title, and the
  summary names the student, which slice 1 turns into the right `child_id`.
- Missing work becomes a `homework` action dated today with a plainly different
  tone from upcoming work. Class activity is not an action and is dropped, which
  is the current rule and stays.
- The one guard worth writing: a weekly summary lists the same assignment every
  week until it is done, so without slice 3's dedupe this source would generate
  duplicates by design. Slice 3 ships first.

### Slice 5. The family feed out. Migration 305.
- `calendar_token` on the family, unguessable, revocable.
- `GET /api/school/feed/[token].ics` returns every open action as one calendar:
  one offs on their date, weekly routines as RRULE, timed items at their time and
  the rest at 07:45, holiday held routines excluded by the same
  `isHeldForHolidays` rule the crons use, so there is no fifth copy of the
  holiday logic.
- One button on `/dashboard/school`: **Add to your calendar**, with the webcal
  link and the three lines for Google, Apple and Outlook.
- This is the sentence that makes the feature sell itself: *everything the school
  sends, in the calendar you already look at.*

### Slice 6. The Classroom calendar in. Migration 306.
Last, because it depends on a teacher having made the class calendar public and
that is not in our gift.

- A `calendar_subscriptions` table: user, child, ICS URL, last polled, last etag.
- A daily cron fetches each feed, diffs it, and writes new dated items as
  `homework` actions through the same dedupe key from slice 3.
- Fails quietly and visibly: a feed that four oh fours for three days shows the
  parent a "this link stopped working" line on the school page rather than
  silently going dead.

---

## 5. What a parent sees when this is done

**Setup, three taps.** Name the school. Tap the systems it uses. Copy the address
and paste it into one forwarding rule, with the Gmail confirmation code appearing
on screen the moment Google sends it, which already works.

**The school page becomes one inbox.** The week rows exist. They gain a child
chip on every item and a filter at the top when there is more than one child. One
page, two schools, three comms systems, one week.

**And nothing else changes**, which matters. The reminders, the child's phone, the
holiday hold and the calendar files all already work and all already have
Justin's design decisions in them. This plan adds sources and routing. It does
not touch the loop.

---

## 6. Checks against the standard

- **Never allow or deny.** Untouched. This surface never judges, it remembers.
- **Connection is the protection.** A reminder to bring the PE kit is not
  monitoring. Payments and plain notices still never reach a child's phone
  (`CHILD_KINDS` in `lib/school/child-items.ts`), and that rule stays written
  once.
- **Child data footprint.** Unchanged in kind and smaller in risk than any
  alternative: we keep extracted actions, never the email, never the attachment,
  and no child's Google account is ever connected. Worth a line in the privacy
  policy when slice 3 lands, because attachment text is new even though it is not
  retained.
- **No model on the child's side.** All extraction happens in the inbound route
  on the parent's side, which is where it already is.
- **Scripts in the database.** Nothing here is a script.
- **No dashes in any copy.** Applies to the setup copy in slices 2 and 4.
- **Mobile and desktop in Chrome DevTools** before any of it is called done, plus
  the Playwright pass on the school page.

**The risks, named.** One: the MX and Resend inbound setup may not be finished,
which slice 0 finds out on day one rather than day six. Two: extraction quality on
a real spread of UK school emails is unknown, because it has never run at volume;
slice 0 gathers twenty real emails as a test set before slice 3 changes the
prompt. Three: schools change comms systems, so the directory in slice 2 is a
best effort and the free text box is the real answer.

---

## 7. What is needed from Justin

1. **Is the inbound domain live?** Whether `in.guidedchildhood.com` has MX
   records pointed at Resend, and whether the Resend inbound webhook is pointed at
   the production deployment. Everything waits on this one fact.
2. **Your call on unparking.** You parked forwarding on 12 August so the card
   could just be the alert calendar. Slice 0 flips it back on. Say the word.
3. **Twenty real school emails**, forwarded from your own inbox, Churchill
   Academy and anything else that lands. That is the test set, and extraction
   quality is the whole product here.
4. **Google Classroom, which school?** If Churchill Academy runs Classroom, one
   ask to them for guardian summaries turns route A on for you this week.
