# Add a job: cut the text, make it one tap

Justin, 10 September 2026: "Quest job picker page needs to be super easy to use
and add as page seems to have too much text please don't stop redesigning until
super focussed on user easy to add."

## The measurement

`/dev/add-job` at 390 wide, before any change: **3554px tall, 487 words** for a
list of 15 jobs. That is nine phone screens to add one job.

Where the words are, per row:

1. The title, often on two lines.
2. The `why` sentence, three lines at 390 wide.
3. `SET TO SCHOOL DAYS · TAP TO CHANGE`, two lines.

Fifteen rows of that is the wall. On top of it the page carries a 31 word help
sentence under the composer, a two line picker subtitle, and a paragraph in the
code card.

## The Mobbin pass

Four apps, all doing this exact job, all agree: **one line per row.**

- [Greenlight, Add Chore](https://mobbin.com/screens/c29f371a-6300-46d7-9fd9-de1c6416bfe8): emoji, title, chevron. Ten chores on one screen. Zero explanatory text anywhere on the page.
- [Finch, Goal ideas](https://mobbin.com/screens/7919f7bf-cc2d-475e-a525-549d0ffd9c13): category tabs, then emoji, title, plus, dismiss. One line each.
- [Liven, New task](https://mobbin.com/screens/0d4f76c3-add8-4c5c-8dae-644ae2d65d0d): input on top, category tabs, then emoji, title, plus.
- [Me+, Manage tasks](https://mobbin.com/screens/ee685c31-8f03-4e78-947d-3a7f0e591f6e): the repeat shown as a tiny caption on the row, not as a sentence with an instruction in it.

Nobody explains. The plus explains itself.

## What changes

**The row collapses to two short lines.**

- Title on top, at list row size.
- One meta line under it: the star value, then the repeat as a small pill with a
  caret. The pill IS the change affordance, so the words "tap to change" go.
- Tile down from 50 to 42, plus button down from 44 to 40, tighter padding.
- The `why` sentence moves into the expanded row, where the repeat chips already
  live. Nothing is deleted, it is one tap in instead of printed fifteen times.

This honours Justin's 10 September note about "EVERY DAY · CHANGE" being
ambiguous. His complaint was that both halves read as options. A pill showing
the current value with a caret is a control, and a control cannot be misread as
a choice between two things.

**The header stops explaining.** The two line subtitle becomes one short line.
The already in count moves out of it: the rows say it themselves.

**Section labels shorten.** "You have used these before" to "Used before".
"More ideas, 14 from the library" to "More ideas · 14".

**The composer help drops from 31 words to a short line.** The composer asks the
repeat question itself on the next step, so saying so in advance is telling a
parent what is about to happen instead of letting it happen.

**The code card's settled version becomes one short line.**

## Guard

`scripts/check-job-picker.mjs`: the collapsed row must not render the `why`
text, and the repeat must render as a control rather than as the words "tap to
change". Both are the kind of thing that comes back in a later edit because it
reads as helpful.

## Checked

390 and 1280 in Chrome, before and after, with the word count and the page
height both recorded, because "too much text" is a measurable claim and should
be answered with a measurement.
