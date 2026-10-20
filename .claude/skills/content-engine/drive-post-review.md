# The Drive post review

**Justin, 13 October 2026: "lets always apply a claude review over posts put in
drive."**

Anything that lands in Drive as a post gets this review before it is treated as
ready, whoever or whatever wrote it. That includes posts another model drafted,
posts Justin wrote himself, and posts we wrote and left there a fortnight ago.
A post sitting in Drive marked READY has not been reviewed. This is the review.

It takes about ten minutes per post. Run it on the copy that would actually be
pasted, not on the plan around it.

## Where this came from

The GDC numbered queue, reviewed on 13 October 2026. Fifteen posts, written
elsewhere, every one of them carefully sourced and none of them ready. The
findings below are the ones that review actually produced, in the order of how
much they cost. The full write up is in
`content/packs/2026-10-13-gdc-queue-rewritten/00-review.md`.

Start by reading `THE-STORY.md` and `content/brand-story/founder-story-canon.md`.
A post cannot be judged against the product without them.

## 1. The hook, which is where most posts die

**Read only the first two lines. Does the reader have a reason to continue?**

A post that opens on a policy event, a company announcement or a throat clear
has already lost. "A new bill would...", "Yesterday a rule changed...",
"Researchers have found...", "One of the things I think parents are being asked
to do far too often is..." All of these describe the thing instead of opening a
gap.

Justin's own 28 day numbers: the two posts that opened on an admitted
uncertainty did 6,008 and 3,155 impressions and carried 67 percent of every
comment that month. The two that opened on a figure did 1,002 and 698 and got
none.

So the opening is something he cannot answer, or a small true scene. The news,
the number and the source move to the third paragraph where they reward a reader
who stayed. If the first line is the most interesting fact in the post, the post
is upside down.

Three openings that worked, for reference. "When my eldest started asking for a
phone, I wanted an age." "One of my daughter's friends moved to Wales." "The
most interesting child in the smart glasses argument is the one who never put
them on."

## 2. The repeated founder line

**Search the last eight posts for whatever biography line this one uses.**

"For five years I have..." appeared in ten of fourteen posts in the GDC queue.
Said once it is a real change of mind. Said every time it is a slogan, and
anybody who follows him reads it every time. `founder-context.md` is explicit:
never repeat the same founder anecdote, and prefer a small scene to a summary of
the biography.

One scene per post at most. A different one each time. Never invented. Specific
stories about the children are flagged to Justin before use, never written
straight in.

## 3. Hedging

**Count "I think", "I would be interested", "increasingly", "perhaps", "may
be", "I am becoming convinced".**

Honesty about uncertainty is the whole brand. Hedging every sentence is a
different thing and it spends the authority the honesty earns. The GDC queue ran
to over a hundred instances across fourteen posts.

The shape that works: state the claim, then state its limit. Not: soften the
claim in advance and then never quite make it. "Nine in ten showed no credible
link. It is 197 teenagers in one country and the authors say to generalise
carefully" beats "I think it may perhaps suggest that".

## 4. The proof path

**Name the surface. A file path, a screen, a lesson id, a stage.**

"Something I want us to build properly into the Digital Passport" is a roadmap
item, not a proof path. `research-radar` Phase 3 exists for this: a finding with
no proof path does not become content.

What exists and is showable: the stage check at `/starter-pack`, three questions
and no sign up; DiGi's rule that it never allows and never denies; the scripts in
the database and the script deck; the check in's five faces measured against a
baseline; the 29 module schools scheme on Education for a Connected World and
the 2025 RSHE guidance; the 448 England objectives in DfE wording; privacy and
personal data taught years before independent access.

If the post cannot point at one of those, it is commentary. Park it.

## 5. The close and the first comment

**Does it end on a real question, with nothing after it? Is the first comment
written?**

The question goes last, next to the comment box, and nothing follows it. A
question only a parent or a teacher could answer beats "do you agree".

Not one of the fourteen GDC posts had a first comment. It is half the reach: it
carries the sourced detail and the single link, it gets ahead of the strongest
objection, and it is what he replies from in the first hour. Write it with the
post, every time.

**Never a comment for a keyword mechanic.** LinkedIn suppresses it and repeat use
can cost reach across the whole account.

## 6. The claims

Run every one against the Odgers test: would a hostile, hype allergic researcher
wince at this sentence? If yes, narrow it until they would not.

- A correlation stated as a cause fails.
- A population average sold as a personal risk fails.
- A count of things presented as a count of children fails.
- A number with no interval, no sample and no design is not evidence.
- The finding that costs us goes **before** the findings that help. That is what
  makes the rest believable.
- Never an outcome claimed for a child. Clarity, calmer conversations, a pathway.
- Never "safe online" and never "ready for social media". Always "completed the
  preparation".
- Never a living clinician named as a source inside the product or in a post
  about the product. Migration 123 settled that: a name beside guidance reads as
  endorsement we never had permission to imply.
- Never a price you have not checked, and never a service as the main line when
  it is not. The Digital Health Report works and is still linked from the site,
  but it is not what we market and its prices are not ours to quote from memory.
  The parent prices are Founder £7.99 a month capped at 50, Standard £12.99,
  Annual £99, schools £495 to £1,995 a year.

## 7. The reader

**Is this a UK parent, a UK head, or nobody?**

Four of the fourteen GDC posts were United States policy. A bill introduced in
Congress does not change anything for a parent at a UK school gate, and a run of
them makes the account read as a policy newsletter rather than a product with an
argument. The UK posts in that set were the strongest, which is the tell.

A non UK source can still be used. Say it is not UK, say why it still matters,
and never transpose its percentages onto UK children.

## 8. The clock

**Does the post contain "today", "yesterday", "this week", or a date that has
passed?**

Six of the fourteen were time stamped to a day that had gone by the time anybody
read them. The idea usually survives; the news clock does not. Rewrite it as the
idea rather than refreshing it as the news.

## 9. The mechanics

- `npm run ai-tells` on the file. No dashes, ever, including in finished copy.
- 1,300 to 2,500 characters for the body. Short paragraphs, air between them.
- Series line on its own if the series is running that week.
- Never two posts in a day.
- No link in the body. It goes in the first comment and the body says so.

## 10. The filing and the number

One folder. One file per number. Status in the title, never inside the body
text, because "GDC-030done" on line one is invisible in a file list. No
duplicates across folders, and an empty file is deleted rather than kept as a
placeholder.

**The number comes from `content/gdc-post-register.md` and nowhere else.** Claim
the row before writing the post. A rewrite keeps its number; only a new post
takes a new one.

This rule is here because the numbering broke twice in two days, both times by
assuming a number was free instead of establishing it. 022 was already published,
with "done" hidden inside its body. 036, 037 and 038 were already in use by the
daily packs, and were missed because those are markdown files while the search
looked only at Google Docs. Two systems assign these numbers and neither can see
the other, so **search every file type, and never trust a listing filtered to
one of them.**

## The output

Three things, and stop.

1. **Ship, fix or park**, per post, with the one reason.
2. **The rewrite**, if it is a fix, with its first comment.
3. **What Justin has to decide**, named plainly.

Never post, schedule or send anything. Justin does that.

## The daily sweep

**Justin, 14 October 2026: "can this review all posts put in gdrive from now on
and re write them with our skills."**

A rule nothing fires is a rule nobody runs. The review above was a thing a
session did when it happened to look. The "Drive post review" Routine now runs
it on weekday mornings, so a post that lands in Drive overnight is reviewed and
rewritten before Justin would have posted it.

**The folder.** `GDC POSTS, NUMBER ORDER, READY TO POST`, id
`10aMT3F_jHHDaQB_SpbX-yWahLjg9_m5U`.

**What counts as new.** List every file type in that folder, because the
numbering has already broken twice on a listing filtered to Google Docs while
the thing it needed was a markdown file. Then take three things out, in order.

1. **Anything already published**, meaning a title carrying `POSTED` or a number
   the register marks posted. This is the rule that matters most. Getting it
   wrong means rewriting something Justin has already put his name to in public.
2. **Anything already through this review**, meaning a title carrying
   `CLAUDE REVIEWED`.
3. **Anything that is not post copy.** A waterfall, a plan, a tracker or a sheet
   is not a post. If there is nothing in it a person would paste into LinkedIn,
   it is left alone and named in one line.

The folder only, never its subfolders. The one called `ARCHIVE` is superseded
work and nothing in it is posted again.

**More than five left means a rule above was missed.** The sweep does the five
most recently modified and says how many are waiting. Five careful rewrites beat
twelve rushed ones.

**Seeding the marker.** On 14 October 2026 the folder held ten files and not one
carried the marker, so the first run would have rewritten five published posts
and a content waterfall. The four that were already ours were retitled by hand
before the routine ever ran. Any new folder this sweep is pointed at needs the
same pass first.

**The marker is the title, and it is how the sweep stays idempotent.** When a
post has been through this review, its Drive title gains `CLAUDE REVIEWED` and
the date. Without that, every run reviews the same posts again, and the day it
misses the marker is the day it rewrites a post Justin has already published.

**A scene is spent once.** The sweep takes one green scene per post from
`content/brand-story/founder-context.md`, checks it against
`content/brand-story/founder-scenes-used.md` first, and adds the row after. A
routine with no memory of the last run will use the strongest scene every day
until the voice is a jingle.

**Finding nothing is a result.** No unreviewed post means one line saying so and
nothing else. No pull request, no Drive document, no post invented to justify
the run.
