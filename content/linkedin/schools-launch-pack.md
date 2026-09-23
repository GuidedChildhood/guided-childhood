# The schools launch pack

Written 23 September 2026, off the back of Jane's review of the site and
Justin's decision to start marketing the schools service.

Applies `.claude/skills/content-engine/linkedin-engagement.md` (hook under 12
words, story not statement, short lines, ends on a real question, no link in
the body, real photo not a graphic) and `hidden-thread.md` (this post is one of
the nine bricks, not the one in ten that states the thesis outright).

---

## Part 1: what Jane's note actually found

> "I can't see the DSL Hub element of it, so I am unable to comment."

She was not missing it. `/hub/dsl` is not in `OPEN_PATHS` in
`schools/lib/access.ts`, so without a school code she hit the gate. The page
exists and it is good: 16 of the 29 modules are safeguarding flagged, each one
listed with the statutory ground it stands on and the note its teachers get
before teaching, plus the two standing rules (content is age appropriate and
never graphic, and the platform records no disclosures so every concern follows
the school's own reporting systems). It is printable and it is written to be
referenced from a school's safeguarding policy.

So the most qualified reviewer we put in front of it could not reach the one
page written for her.

### What the codebase already decided

`access.ts` opened `/hub/rshe-mapping` and `/hub/data-protection` for exactly
this reason, in its own words:

> A school needs it to evaluate us, which happens before it buys, so putting
> it behind the licence made the reason to buy invisible until after buying.
> The staff briefings stay gated, because those are the product.

And `THE-STORY.md` section 6 describes the schools app as "an open catalogue
with no login as the land grab, zero prep lessons, the hub for DSL, CPD, policy
and RSHE mapping."

The DSL crosswalk is a procurement and assurance document, not teaching
content. It is the same category as the two pages already open, and gating it
is drift from the stated plan rather than a decision anyone made.

**Change 1, recommended, small.** Add `/hub/dsl` to `OPEN_PATHS` and link it
from the schools homepage and the pricing page beside the mapping matrix. The
staff briefings stay gated, because those are the product. One string, one
link, one guard update.

### The part of her note we cannot answer yet

> "resources that save them time and easy to access and adapt"

Access is the gate above. Time saved is the whole scheme and it is real.
**Adapt is a genuine gap.** Everything generates from the lesson row and there
is no download, no editable file, nothing a DSL can change. Our position is
that they should not need to adapt it, which is the time saving thesis and
worth keeping.

But Jane means something narrower and she is right about it. A DSL does not
want to rewrite the lesson. They want their own school in it: who the DSL is,
who the deputy is, what the reporting route is, which policy this links to.
Today the crosswalk says "follow your school's own reporting systems" and
leaves them to write that on a printout by hand.

**Change 2, recommended, medium.** A school settings row (DSL name, deputy,
reporting route, policy title) that prints into the crosswalk and into every
staff briefing. That is the version of adapt that costs us nothing
philosophically, answers her exactly, and makes the printout a document the
school can file rather than one it has to annotate.

---

## Part 2: the launch post

**Image:** a real photo of Justin, per the engagement rules. Not the banner.
The banner lives in Featured, where a graphic belongs. A photo of him at a
desk with the guidance open, or in a school, beats any infographic here.

**Link:** first comment, never the body.

```
PSHE leads are being asked to turn 195 clauses into Tuesday afternoon.

That is the real size of the statutory guidance. 195 numbered items across
28 strands. We went through every one.

Not because anybody enjoys that.

Because every scheme I looked at says "covered" against a theme, and a theme
is not an item. "Online relationships" is a heading. Underneath it are
clauses about what a child should know, by when, and in what words.

So we pulled out the 57 that are about online life, and wrote down,
requirement by requirement, which lesson teaches it and what the child
actually does in that lesson.

Here is what that exercise really showed me.

The problem in schools is not that teachers do not care about this. It is
that we keep handing them a document and calling it support. A PSHE lead is
usually teaching something else as well. A designated safeguarding lead
almost always is. They are being asked to do all of it on their own, in time
they were never given.

And in September a new safeguarding update landed on top, naming generative
AI and AI generated images for the first time.

Nobody is short of guidance. They are short of the lessons.

If you teach this: what were you actually given to teach it with? I would
genuinely like to know what is in use out there.
```

**First comment:**

```
The mapping is open, no sign up, if it is useful to anyone: the 57 online and
digital requirements in the guidance's own words with the lesson that teaches
each one. schools.guidedchildhood.com/hub/rshe-mapping
```

Why this shape. The first draft opened on us ("we read every one"), which is
the founder talking about the founder. Justin caught it on 23 September: the
first line has to let the buyer recognise themselves. So it now names the
customer in the first eight words and hands them the pain in the next four.
Twelve words, one number, no throat clearing.

The body is a story with air, not a claim list. The brick it carries for the
hidden thread is capacity: the system hands teachers an enormous ask with no
time, which moves attention toward a real driver rather than making the
platform the main character. It never states the thesis outright, so it is one
of the nine. The close asks a teacher what they were actually given, which
they can answer from their own week, and the answers are market research we
cannot buy.

The reach cost is real and worth taking. Justin's following is mostly parents
and researchers, so a hook aimed at PSHE leads will be seen by fewer people
than a hook aimed at parents. The goal is five pilot schools, not impressions,
and the people who can say yes are the ones who have to see themselves in
line one.

---

## Part 3: the outreach email, 20 named schools

Send to a named PSHE lead, DSL or deputy head. Never a generic office address.
One school per email, the subject line naming their phase.

**Subject:** `The 57 online requirements, mapped lesson by lesson`

```
Hello [name],

I have built a digital literacy scheme of work for UK schools and I am
looking for five schools to run it free for a term before I take it wider.

The honest reason I am writing to you rather than sending a brochure: I want
to know where it breaks in a real timetable.

What it is. 29 lessons, Reception to Year 13, taught from an interactive
player with a word for word script, so a teacher who has not prepped can
still teach it well. Printable packs, a starter and exit quiz, and parent
notes that go home.

What you can check before replying to me, with no sign up and no call:

The mapping. Every one of the 57 online and digital requirements in the
statutory guidance, in its own words, with the lesson that teaches it.
schools.guidedchildhood.com/hub/rshe-mapping

A whole lesson, free and open, so you can see the standard rather than take
my word for it. It is the Year 8 one on misinformation and deepfakes.
schools.guidedchildhood.com/curriculum

If the pilot is not for you, I would still take five minutes of your view on
where it falls short. That is worth more to me than a sale right now.

Best wishes,
Justin Phillips
Guided Childhood
```

Why this shape: it opens with the ask and the reason, it gives two things to
check before any conversation, and it makes a refusal useful. No dashes, no
claim that is not on a page they can open.

**Once Change 1 ships**, add a third line to the check list:

```
The safeguarding crosswalk. The 16 safeguarding flagged modules, the
statutory ground each stands on, and the note its teachers get before
teaching. Written to be referenced from your safeguarding policy.
schools.guidedchildhood.com/hub/dsl
```

That is the line that answers a DSL, and it is the reason to ship Change 1
before the outreach goes out rather than after.
