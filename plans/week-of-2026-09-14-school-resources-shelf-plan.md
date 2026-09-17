# The school resources shelf: what school uses, what we build instead, and the devices that come with it

Justin, 17 September 2026:
*"For the children's app I want to eventually copy the related resources that go
with the curriculum, the ones schools do for parents, we can add what your child
will be learning this term, and Little Wandle type resources built as our own,
and how to balance with devices. Also share lessons with kids apps, and it can
give us an idea of the device use they will experience. Can we scrape and
analyse Little Wandle's site and build a comprehensive list of resources UK
schools use for each subject each year?"*

Four asks in one message, and they are four different sizes. This plan separates
them, says what already exists, and names what is actually buildable.

---

## 1. The four asks, separated

| # | The ask | Size | Blocked on |
| --- | --- | --- | --- |
| A | A comprehensive list of the resources UK schools use, per subject, per year | Research, done this session | Nothing |
| B | Our own parent resources in the Little Wandle genre, "what your child is learning this term" | Large, content heavy | Justin picking the first year group |
| C | How to balance it with devices, attached to each resource | Medium | A |
| D | The device use a child will experience through school, told to the parent honestly | Medium, and the most distinctive of the four | A |

D is the one nobody else is doing. Every competitor tells a parent to cut screen
time. Not one of them tells a parent how much screen time school itself is about
to add, which is the number that makes the home rule feel unfair to a child. If
we can say "your Year 4 sits a national times tables test on a screen, and the
practice app the school sets is twenty minutes a night", a parent can plan the
week instead of arguing about it.

---

## 2. What already exists, so nothing gets rebuilt

This is not a green field. The curriculum spine has been in since migration 108
and the reading surfaces shipped in August.

| Piece | Where | State |
| --- | --- | --- |
| 448 statutory objectives, England, Years 1 to 6, source mandatory | `supabase/migrations/108`, `114`, `115` | Built |
| What they are learning, the front door page | `app/(dashboard)/dashboard/learning/page.tsx` | Built |
| The year view, strands grouped per subject | `lib/learning/year-view.ts` | Built |
| This week at school, deterministic weekly walk | `lib/learning/this-week.ts` | Built |
| **What is coming next term, three subjects, one line each** | `lib/learning/term-preview.ts` | Built |
| The homework decoder and the private tutor | `app/api/learning/decode`, `lib/learning/tutor-deck.ts` | Built |
| Printable curriculum sheets, one strand per sheet | `lib/printables/curriculum-sheets.ts` | Built |
| What DiGi may say about school, with the three rules | `lib/learning/digi-context.ts` | Built |
| Term and holiday calendar, year group from date of birth | `lib/learning/term.ts`, `calendar.ts`, `holidays.ts` | Built |
| Device setup guides per screen, per stage | `app/(dashboard)/dashboard/devices` | Built |

**So ask B is half built already.** `buildTermPreview` answers "what will my child
be learning this term" today, for maths, english and reading, Years 1 to 6, and
shows it in the school holidays and the first week back. What it does not have is
the resource layer: a parent reads "Number and place value, addition and
subtraction" and still does not know that the school is teaching it out of White
Rose, that the calculation method will look nothing like the one they were
taught, or that the homework will arrive in an app.

**The three rules this lane inherits and must not break** (`digi-context.ts`):
never tell a parent their child is behind, quote and never paraphrase statutory
wording, and never say a school is teaching something now, only that the year
covers it. The resource layer adds a fourth of its own, in section 5.

---

## 3. Lane boundary with the open work

PR #1105, open in another session, is the school inbox: forwarding school email,
extracting actions, and a Google Classroom link. It owns anything that reads a
real school's own communications.

This lane owns the reference layer: what schemes and resources exist nationally,
what a year group is taught, what we publish for parents, and what device use
school brings. The two meet at exactly one point, which is Google Classroom and
the homework platforms. The rule: **#1105 owns the connection, this lane owns the
explanation.** If a parent connects Classroom, that lane brings the homework in.
This lane is what tells them what Sparx Maths is and how long it takes.

No migration number is claimed by this plan. The research artifact is files only.
Section 6 names the migration slices, and a number gets claimed at build time,
after checking `supabase/migrations/` and every open PR. Highest on main today is
302.

---

## 4. Ask A, the resource list, and what Little Wandle can and cannot give us

### The scrape question, answered plainly

Analysing the site is fine and useful. Copying what is on it is not, and would
not help us anyway.

Their parent material is copyright Little Wandle. Their grapheme mats, their
pronunciation videos and their phase overviews are theirs, and a UK product that
lifted them would be indefensible with a school, which is our distribution
channel. So the scrape is a **structural** one: how do they break a year into
phases, what does a parent of a Reception child see, what shape is each piece,
how long is it, what does it ask the parent to do.

What is genuinely ours to build on is the public material underneath every
scheme: the national curriculum programmes of study, the Department for
Education criteria for validated systematic synthetic phonics programmes, the
validated programmes list itself, and the phonics screening check materials.
Most of it is published under the Open Government Licence. That is the same
footing our 448 objectives already stand on, with `source` not nullable.

So: **we analyse the genre, we build on the statutory material, we write every
word ourselves.** Recorded here because it is the question a school will ask.

### What the research delivers

`research/uk-school-resources/` holds the list, assembled from six parallel
sweeps run on 17 September 2026:

- Primary phonics, reading and English schemes
- Primary maths, schemes and the practice apps
- The wider primary curriculum, every other subject
- Secondary, Years 7 to 11, and the homework infrastructure a parent logs into
- The device exposure evidence, Department for Education and Ofcom sources
- The Little Wandle structural analysis and the licence position

Every row carries a source URL, the year groups it covers, whether the publisher
gives parents anything, and whether a device is needed. Every unverified figure
says "not found" rather than an estimate, which is the evidence or silence rule
doing its job.

---

## 5. Ask B, C and D, the product shape

### The fourth rule, which this lane adds

**We know what schools nationally use. We do not know what your school uses.**

A parent in Wigan and a parent in Truro are not being taught the same maths
scheme, and there is no register we can read to find out which. So every
resource claim is a likelihood, worded as one, until the parent tells us. The
shape that follows from that:

1. **The shelf, the honest version.** The learning page gains a resources block
   under each subject: the schemes a school is most likely to be using for that
   subject and that year, said as "most primaries use one of these", with what
   each one is in a line, and what it means for the parent. Never "your school
   uses White Rose".
2. **One question upgrades everything.** "Do you know which maths scheme your
   school uses?" with the five or six real answers and a "not sure". Answered,
   the shelf becomes specific and DiGi can name the scheme. It is one column on
   `children` or a small `child_school_resources` table, and it is the cheapest
   personalisation in the product: one tap, and a generic page becomes their
   school's page.
3. **Our own resource, per year, per term.** The Little Wandle genre in our
   words: one page per year group per term, on the page and printable, holding
   what the class covers, three things to do at home that need nothing bought,
   the words that will sound unfamiliar and what they mean, and the one thing
   that goes wrong at this point in the year. `term-preview.ts` already picks
   the strands. The writing is the work, and it is 18 pages for Years 1 to 6.
4. **The device line, on every resource.** Each resource row carries what it
   asks of a screen, so the shelf can say the honest thing: this is the bit of
   your child's screen time that school is setting, and here is how to place it
   in the day so it is not competing with the part they choose.
5. **The device use preview.** A card that answers what device use school brings
   this year: the accounts they will be given, the apps they will be asked to
   log into, whether a national test is taken on a screen, and what the school
   phone policy will typically be at that age. Sourced, per year group.

### Where each piece lands, on real screens

| Piece | Surface | Build size |
| --- | --- | --- |
| The resource shelf per subject | `dashboard/learning`, under each subject | Medium |
| The scheme question | The learning page and setup | Small |
| Our term resource, on screen | `dashboard/learning`, a new tab | Medium |
| Our term resource, printed | The printables engine, reuses the sheet layout | Medium |
| The device line | Everywhere a resource appears | Small, once the data exists |
| The device use preview per year | A card on `dashboard/learning` and `dashboard/devices` | Medium |
| DiGi naming the likely scheme | `lib/learning/digi-context.ts`, one more context block | Small |

### The share with kids apps ask

Justin's "share lessons with kids apps" is read as: what the child meets at
school should reach the child app, so the two are not separate worlds. The
lessons hub and five a day already run on the child side with zero model calls.
The honest version is the same one as above: the child app can carry what the
year covers nationally, never a claim about what their class did today.

---

## 6. The build slices, in order

1. **Slice 1, the data.** A `school_resources` table, seeded from the research:
   resource, publisher, subject, year groups, what it is, parent material, the
   device requirement, prevalence where sourced, source URL. `source` not
   nullable, the same as objectives. One migration, number claimed at build.
2. **Slice 2, the shelf.** Read it onto the learning page under each subject,
   worded as likelihood. Mobile and desktop checked.
3. **Slice 3, the scheme question.** One tap, stored per child, the shelf turns
   specific.
4. **Slice 4, our term resource.** One year group first, chosen by Justin, on
   screen and printable. The rest follow once the shape is proven.
5. **Slice 5, the device use preview.** Per year group, sourced, with the phone
   policy line.
6. **Slice 6, DiGi.** The scheme and the device line as context, inside the
   existing rails.

Slices 1 and 2 are one session. Slice 4 is content work and is the long pole.

---

## 7. What is needed from Justin

1. **Which year group gets our first term resource?** Year 1 has the phonics
   screening check and is where the Little Wandle genre is strongest. Year 4 has
   the times tables check, which is the on screen national test and therefore
   the sharpest device hook.
2. **The scheme question, in or out?** It is one tap and it is the difference
   between a generic shelf and their school's shelf.
3. **Is the device use preview a parent card, a school card, or both?** It is
   the most distinctive piece and it could as easily sell a school as reassure a
   parent.
