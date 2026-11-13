# The "stop sending PDFs, send an email a day" advice, weighed

Justin, 13 November 2026, passing on a YouTube talk (youtu.be/nv1s7QrpUwQ) about
lead magnets: make it a funnel, so a parent drops their email and gets it in a
sequence, with an Instagram post saying what they will get and a tips email
sequence to go with the charts. Weighed with `.claude/skills/feedback-filter`
against THE-STORY.md and review.md. The speaker could see a fitness coach's
30 day PDF, not our product.

| # | The point (their words, short) | Verdict | Why, against our objectives | Size |
|---|---|---|---|---|
| 1 | "Most people think they have a business problem... they have a bottleneck... in the majority of cases... it's a leads issue" | **Adopt** | Our numbers agree: 0 sign ups since 6 November, 3 bio link opens a week (`what-works-live.md`). The gap is leads, before the stage check. | none |
| 2 | "If you do not have 20% of your total following in a database... you have a big issue" | **Adopt as an internal target** | 20% of about 6,000 followers is 1,200 emails. An unsourced rule of thumb, fine as our own target, never a public claim. | none |
| 3 | "Why absolutely never... send a PDF" | **Adapt** | A printable has to be printed, so the PDF stays. But it stops being the whole delivery: each email carries one page, readable on a phone, with the print link under it. | small |
| 4 | "An email a day... brief, succinct, regular... 60 to 90 seconds to read" | **Adapt; Justin: "Yes, daily for the series"** | Conflicts with "one email a week from all systems" (Justin, 12 August 2026), enforced in `sendEmail` by a six day floor. Proposal: a short series the parent asks for by name ("send me the series") is content they requested, like the trial clock exception of 25 September: no floor for its days, suppression and the stop link still apply, and the weekly floor resumes after it. | medium |
| 5 | "After day five... if you're ready to join my program click here" | **Adopt** | Matches the goal: day 5 offers the full pack, free for four days in the app, or Etsy to keep. The stage check comes the day before. | small |
| 6 | A 30 day programme as the magnet | **Decline for us** | Thirty touches would give away the pack ("tasters free, full on Etsy") and a month of daily mail is a different product. Five or six days. | none |
| 7 | "We probably want to close them as soon as possible... people change" | **Adopt** | Five days from the printable to the offer, one email each, nothing waits a week. | none |
| 8 | Don't send them off to Instagram or YouTube from the magnet | **Adopt** | Every email links only to its own page, the stage check or the app. | none |
| 9 | "The day that we get the most sales is day 19" | **Ignore** | One seller's anecdote, nothing to act on. | none |
| 10 | (Justin) the Instagram post says what they will get | **Adopt** | Card 6 and the caption name the series: "Drop your email: one page a day for five days, with a tip for each." | small |

## The series (Justin, 13 November 2026: "Yes, daily for the series"; built in PR 1535)

The series runs on the taster's own pages and the pack's own words. No figures, no claims about outcomes. As built:

- Day 0, at once: the printable itself (`magnetEmail`, transactional), with one line saying page 1 comes tomorrow.
- Day 1: page 1 inside the email, one tip from the pack, the print link.
- Day 2: page 2 and a tip.
- Day 3: page 3 and a tip.
- Day 4: the free stage check, three questions.
- Day 5: the rest of the pack: all N pages free in the app for four days, no card, or on Etsy to keep.

Kind `series`: no weekly floor for those days, the stop link still wins, and the weekly programme counts on from day 5. Only for a ticked box (PECR, migration 396); a lead captured before the box keeps the taster week (day 1 stage check, day 7 pack).
