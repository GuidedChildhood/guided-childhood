# School AI governance: audit, gaps, architecture, phases

The brief: add a practical AI governance, procurement and safeguarding layer
for schools, connected to the Digital Passport and the existing lessons, so a
school can check an AI product BEFORE it reaches children.

The principle is right and it is ours already: children need preparation, and
no amount of preparation should be asked to compensate for a product that was
unsafe to buy.

---

## A. Existing system audit

### The schools app is deliberately identity free

This is the single most important finding and it governs everything below.
`schools/lib/access.ts` says it in its own header:

> WHY A CODE AND NOT A LOGIN. A code is a door, not an identity. It needs no
> email, no name, no row in any table, and it therefore keeps the promise the
> split was built on: **the schools app still holds no session, no user and no
> personal data of any kind.** Real teacher accounts come next, in the
> staffroom, where they buy something a door cannot: a register, marking and a
> report.

So today:

| | |
|---|---|
| Auth | one shared code per school, from `SCHOOLS_ACCESS_CODES`, HMAC signed into a cookie |
| School record | **none**. A code is a string in an env var |
| Users | **none**. No email, no name, no row |
| Roles | **none**. No DSL, SLT, IT lead, governor or DPO identity exists |
| Sessions | **none** |
| API routes | **none** in the schools app |
| Writes | **none**. Every read is a server component; the app writes nothing |

### The `schools` Postgres schema has two tables

- `schools.school_lessons` — the curriculum: 21 modules, 529 slides, scripts,
  teacher notes, quizzes, DSL notes, statutory hooks.
- `schools.invoice_requests` — a lead form. `school_name` is free text on an
  enquiry, not an account.

There is no school organisation, no membership, no per school anything.

### The Hub is a set of printable staff documents

`/hub/policy`, `/hub/data-protection`, `/hub/dsl`, `/hub/cpd`,
`/hub/parents`, `/hub/year-plan`, `/hub/accessibility`, `/hub/induction`,
`/hub/faq`, `/hub/vocabulary`, `/hub/rshe-mapping`. Every one is a server
component that reads curriculum content and renders a document with
`PrintButton`. None holds state. None takes input.

This is the right neighbourhood for AI governance and the wrong shape: the Hub
tells a school things, it does not yet let a school record anything.

### The Digital Passport is a family mechanic, not a school one

It lives in the parents app: `lib/stickers/book.ts`, `shared/passport-stages.ts`,
`public.stage_passports`, `/app/api/pathway/*`. `shared/passport-stages.ts`
already maps every school module to the passport page it fills, and its header
is explicit that awarding stamps belongs to the parents side and that nothing
on the schools side writes one.

**The schools app holds no pupils.** It has never known a child's name, and
`THE-STORY.md` states the platform holds no assessment data on children.

### What already covers the pupil facing half

The curriculum already teaches most of what this brief wants children to learn:

| Risk in the brief | Existing module |
|---|---|
| Hallucination, checking a source | `ks3-12-misinfo-deepfakes` |
| AI generated images and provenance | `ks1-03-real-pretend-computer`, `ks2-09-copyright-ownership` |
| Recommendation and engagement design | `ks2-06-how-algorithms-work` |
| Manipulation and persuasive design | `ks4-15-manipulation-persuasion` |
| Personal data and what not to share | `ks2-07-privacy-reputation` |
| AI use, checking its work, data rights | `ks5-20-ai-mastery-data-rights` |
| Human skills AI does not replace | `ks5-21-digital-identity-future-work` |

So the pupil side needs **linking**, not writing. That matches the brief's own
instruction not to duplicate curriculum content.

---

## B. Gap analysis

Against the brief, sorted by whether it is buildable today.

### Buildable now, nothing missing underneath

- The ten assessment sections and their questions.
- Per category ratings (data, safeguarding, relationship, learning,
  transparency, oversight, age, security) and the four overall statuses.
- The assistant / tutor / coach / character / companion distinction.
- Evidence and source capture per answer.
- Risk to Digital Passport competency mapping.
- Risk to existing lesson mapping.
- Suggested policy wording and a parent communication draft.
- An exportable, printable audit record.
- Review dates, "last reviewed", "review recommended", and reassessment.

### Blocked on school identity, which does not exist

- **Named reviewer sign off** (DPO review, DSL review, SLT approval, governor
  visibility). There is no user to attribute a signature to.
- **Server side per school storage** and therefore **RLS tenancy**. There is no
  school row to scope a policy to, so "never expose one school's supplier
  reviews to another school" has nothing to key on.
- **A cross school or MAT view.**
- **Pupil level readiness** in the "PUPILS READY?" panel. The schools app knows
  no pupils and by design holds no assessment data on children.

### Explicitly out of scope, per the brief

- Automated external monitoring of provider changes. The brief says only build
  it if existing infrastructure makes it straightforward. It does not, and an
  alert like "Chatbot X introduced persistent memory" must never be fabricated.

---

## C. Proposed architecture

The decision that follows from A: **do not invent a second identity system.**
Building school accounts to hold AI reviews would be a much larger change than
the feature asked for, would duplicate the staffroom work already planned, and
would put personal data into an app whose entire design promise is that it
holds none.

So Phase 1 keeps the schools app's promise intact and still delivers the
working tool:

```
shared/ai-governance/          the framework, pure and storage agnostic
  questions.ts                 ten sections, every question, guidance, weighting
  rating.ts                    answers -> category ratings -> overall status
  product-type.ts              assistant / tutor / coach / character / companion
  passport-links.ts            risk -> passport competency -> real module id
  types.ts                     the review record shape
  storage.ts                   an interface, with a browser implementation

schools/app/hub/ai-governance/ the Hub area
  page.tsx                     dashboard: tools, statuses, what needs review
  review/[id]/page.tsx         the section by section assessment, save and return
  review/[id]/result/page.tsx  ratings, required actions, linked learning
schools/app/print/ai-review/[id]/  the audit record, printable
```

**Storage.** The review record is written through a narrow interface with one
implementation today (the browser, per school device) and room for a second
(Postgres, when the staffroom lands). The record shape is designed to be the
row shape, so the later migration is a copy rather than a redesign. Export and
import as JSON means a school is never locked into one browser and can put the
record where a DPIA actually belongs: their own systems.

**No new tables in Phase 1.** No RLS surface, therefore no cross tenant risk,
because nothing about a school's review reaches the server at all.

**Sign off** is recorded as a name and a date typed by the person doing it,
labelled as a school's own record rather than an authenticated signature. That
is honest about what it is and is exactly how a paper DPIA works.

---

## D. Reuse plan

| Reused | From |
|---|---|
| Design tokens, type scale, cards, buttons | `shared/tokens.css`, `schools/components/ui.ts` |
| Print behaviour | `schools/components/PrintButton.tsx` and the `/print/*` pattern |
| Hub navigation and page furniture | `schools/app/hub/page.tsx` |
| Key stage bands | `shared/curriculum-badges.ts`, no second age structure |
| Passport stages and stamps | `shared/passport-stages.ts` |
| Module list and lesson links | `shared/schools-curriculum.ts` |
| Safeguarding posture and language | `/hub/dsl`, DiGi's existing principles |
| Access gate | `schools/lib/access.ts`, unchanged |

Not reused, deliberately: DiGi's crisis logic. The brief says do not duplicate
it and it is right. Where an assessment finds a product with no escalation
route, the output points at the school's own safeguarding process, it does not
re implement one.

---

## E. Risk of breakage

Phase 1 adds routes and a shared module. It changes no existing page, no
existing table, no migration, no RLS policy and no access rule.

| Risk | Mitigation |
|---|---|
| A new Hub route escapes the access gate | `OPEN_PATHS` is a fixed list and `/hub/*` is already gated. Adding nothing to that list is the whole fix. Guard test asserts it |
| The service role client reaches a client component | The new pages are client side and import no server db module. The existing wiring check enforces it |
| Design drift into generic SaaS | Tokens only, no new colours, Nunito and IBM Plex Mono, checked against `check-tokens.mjs` |
| Copy drift | No dashes anywhere, Justin's voice, checked |
| Fabricated provider claims | Nothing in the product asserts a fact about a vendor. Every answer is the school's own, with its own evidence field |

---

## F. Implementation phases

1. **AI Tool Review MVP** — the framework, the assessment flow, the ratings,
   the result, the printable record. Browser held, exportable. *This phase.*
2. **Digital Passport linkage** — risk to competency to real lesson, shown in
   the result and on the dashboard.
3. **Policy and parent communication** — suggested wording that extends the
   existing `/hub/policy` and `/hub/parents` documents rather than overwriting.
4. **Audit and reporting** — the governor and inspection export.
5. **Persistence and versioning** — when school accounts land, swap the storage
   implementation, add the tables and the RLS, and the sign off becomes a real
   signature.

Phases 2, 3 and 4 are small once 1 exists, so this plan does 1, 2 and the
export half of 4 together. Phase 5 waits on the staffroom, and should not be
faked before then.

---

## The thing that must not happen

The brief's own warning is the right one: do not build another AI checklist
that sits forgotten in an admin menu. The join that stops that is the one this
plan keeps: every finding that is genuinely a child's to learn resolves to a
lesson that already exists and can be taught next week. Everything else,
processor agreements and retention schedules, stays with the adults where it
belongs.
