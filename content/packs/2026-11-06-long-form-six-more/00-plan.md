# Six more long form issues, 6 November 2026

Justin, 6 November 2026: turn the posts on the desk into newsletter versions,
researching all the data, with two goals named explicitly. Goal one, the researched
analysis. Goal two, the takeaway for parents. Both are now written into the content
engine skill so the second one does not get cut under time pressure, which is the
one that always goes.

## Why six and not fourteen

He asked for all the posts on the desk. Eight of the fourteen already have a long
form version, so writing fourteen would have produced eight duplicates.

| Post | Already covered by |
|---|---|
| 053 Meta filings and Odgers | Issue 1 of the 6 November batch, unsent |
| 052 face scan | Issue 3 of that batch, unsent |
| 050 four ways to prove you are 16 | Issue 3 of that batch, unsent |
| 046 the age is the easy part | Issue 2 of that batch, unsent |
| 044 a ban is already teaching | Issue 4 of that batch, unsent |
| 043 Sweden | Issue 5 of that batch, unsent |
| 037 The Social Reckoning | Sent 15 October, the fact checked issue |
| 048 the chatbot confidant | Sent 26 October, the conversation cannot be handed to software |

So this batch is the other six.

| File | From | Words | The analysis | The parent takeaway |
|---|---|---|---|---|
| `1-two-hours-and-a-curfew.md` | GDC-038 | 1,865 | The trial's own protocol, read in full | Run the design at home for six weeks, with the override |
| `2-the-arrows-that-survived.md` | GDC-049 | 1,809 | The paper read in full, and the release against it | Swap the hours question for one of three |
| `3-the-thing-parents-want-least.md` | GDC-047 | 1,849 | Both US reports read in full, plus the enforcement gap | Find out what the toy keeps, then the four questions |
| `4-the-rules-are-for-the-eight-percent.md` | GDC-051 | 1,971 | The regulatory category does not match the exposure | Find the report button together |
| `5-the-number-nobody-quotes.md` | GDC-045 | 1,951 | Both camps citing one paper for what it refuses | Write down now what would change your mind |
| `6-the-rule-i-could-enforce.md` | GDC-039 | 1,858 | The worry order inverted against the rule order | Change one setting tonight, then four questions |

## What the research actually turned up, which was more than the posts had

Three primary documents were read in full for the first time, two of them by
pulling the PDF out of the fetch tool's saved bytes and extracting the text
locally. That is worth remembering as a technique: when a fetch returns a PDF the
tool cannot read, the bytes are on disk and `pdftotext` works.

**The IRL Trial protocol, v1.3, 12 August 2026.** This settles everything we have
been hedging about the Bradford trial and corrects one thing we had wrong.

- The intervention is a **two hour daily budget and a curfew from 9pm to 7am**,
  both co produced with young people across three consultations. We had the shape
  right and not the numbers.
- **Participants can override the restrictions**, and the app records it. Nobody
  has reported this and it is the most interesting design decision in the document.
- Primary outcome is **anxiety alone**, on the RCADS-25 anxiety subscale, 0 to 45,
  with a baseline expectation of 9.9. Depression and wellbeing are secondary.
  Sleep, time with friends and family, and bullying are mechanisms.
- Powered to detect an effect of **0.16**. Anything smaller and this trial returns
  nothing, and nothing will not mean zero.
- **Funded by the Wellcome Trust AND the National Institute for Health Research.**
  GDC-038's first comment says Wellcome alone, which is incomplete. Worth fixing if
  the post has not gone out.
- Co principal investigators Dr Dan Lewer and Professor Amy Orben, **confirmed from
  the primary document**. An earlier session had this from secondary sources and a
  later check could not re confirm it, so it is now settled.
- 30 year groups, about 10 schools, roughly 4,500 participants, aiming at 12
  schools. Born in Bradford's public page says 4,000.
- Two waves: 1 September to autumn half term, and after half term finishing before
  Christmas 2026. **So wave one has already finished and wave two is running now.**
- **Still no published reporting date**, and the protocol does not carry a
  registration number, only an intention to pre register. That is the third
  independent attempt to find one.
- The protocol itself says the observational evidence suffers "likely residual
  confounding and reverse causality" and that scientific authorities have concluded
  it is "currently not possible to estimate the overall causal effect". The people
  running the trial wrote that down.

**A companion paper nobody here had seen.** Pickavance et al., BMC Public Health,
7 May 2026, same team. 8,466 Bradford students aged 12 to 15. Median social media
use **3.36 hours a day**. Capping at three hours would, under its own assumption of
causality, move clinical threshold symptoms from 10.7 to 9.5 percent, which the
authors translate as **thirteen fewer cases in a school of a thousand**. The most
concrete, most honest number in this whole field, and it is ours to use.

**The Manchester paper, read in full.** Cheng et al., Journal of Public Health
48(1), 59 to 69. This produced one correction and one confirmation.

- **Correction.** The methods say "a final sample of N = 25 629 observations", with
  a drop in approach including any participant with at least one of three data
  points. GDC-049 said it "followed the same young people for three years" and the
  share note said it "followed 25,629 teenagers for three years". Both overstated
  it. Both are now fixed. The loose version came from the university's own press
  release, which is the thing the post criticises, so the post had borrowed the
  fault it was pointing at.
- **Confirmation.** The post's claim that the release went further than the paper is
  right, and now verified on both sides. The paper says these activities "may not
  play a causal role". The release of 14 January 2026 is headlined "not to blame"
  and says they "are causing". Both read in full.
- The exposure measure is **one question**: "On a normal weekday during term time,
  how much time do you spend on social media?", in hourly bands from 0 to 7+. That
  is the finding behind the finding, and it is the spine of issue 2.
- The two effects that survived both point backwards. Gaming predicted less later
  social media for girls. Feeling worse predicted less later gaming for boys.

**The two AI toy reports, read in full.** One figure corrected mid flight: a fetch
agent reported that "top concern" was unsupported, having only read the HTML pages.
The white paper PDF does call personal information parents' top concern, at 83
percent. Extracting the PDF beat trusting the summary.

- Parents rank **companionship last** of seven things they want from an AI toy, at
  22 percent, and 56 percent actively do not want it. The category being sold is
  companion toys. That gap is issue 3.
- **27 percent of outputs** judged inappropriate across three toys, denominator not
  given, which the issue says.
- The enforcement finding, which nobody has written about: a toy maker was publicly
  banned from an AI company's models, and **three months later PIRG could still run
  the toy on that company's newer model**. The question has moved from "is there a
  rule" to "who is checking".
- Bondu exposed **50,000 lines** of children's dialogue in an unprotected database,
  against 83 percent of parents naming data collection as their top worry.
- Uptake is highest in lower income households and among Black parents. The
  families most likely to bring one in have the least slack if it goes wrong.

## What is still unreadable, after four attempts

- **Ofcom.** Both the age assurance assessment and Growing Up Gaming. 403 to every
  tool, every time, across three sessions. Issue 6 states this in the text rather
  than a footnote.
- **eSafety.** 503 four times, including to the direct PDF with its cache token,
  and the APO mirror is 403. **The 54 percent question wording is still unread**,
  which is why issue 4 carries a warning in the body rather than confidence.
- **The BMJ.** 403, so issue 5 rests on our own earlier verification pass and says
  so up front.

## House rules held

No dashes. Contractions and at least one very short paragraph in every issue. One
thing to do this week in every issue, and it is a specific action rather than
"talk to your child more". Sources at the foot with the limits of each stated in
the open. No outcome claim for any child. The stage check appears as a starting
point and never as a measurement, with the no evidence sentence attached each time.

`measure.py` in the scratchpad checks word count, dashes, contractions, short
paragraphs, banned phrases, subject lines, preview line, sources block and the
presence of a takeaway. All six pass.

## What is needed from Justin

1. **Nothing to approve before these can go.** They are written and checked.
2. **The Ofcom and eSafety PDFs.** If either opens in a browser on his machine,
   issues 4 and 6 can lose their warnings and GDC-050, 051 and 052 can lose theirs.
   This is the fourth time of asking and it is now the single biggest constraint on
   the evidence quality in this lane.
3. **A decision on GDC-038's first comment**, which credits Wellcome alone and
   should say Wellcome and the NIHR. One line, if the post has not gone out.
4. **He now has thirteen unsent long form issues**, seven from this morning and six
   from this batch. That is more than a quarter's worth. Worth deciding an order and
   a cadence rather than letting the freshest ones decay.
