# 02 · The deepfakes lesson is already written

| | |
|---|---|
| Run | Schools, 1 of 4 |
| Service | Zero prep lessons: the one whole lesson any teacher can teach free |
| Format | Carousel, 8 pages, 1080 by 1350. A PDF for LinkedIn. **Built** |
| Channels | Justin's LinkedIn as a document post, the Guided Childhood LinkedIn page, Facebook as page one plus the text |
| Proposed | Thursday 19 November, 07:45 |
| Free step | Teach the lesson: `schools.guidedchildhood.com/lesson/ks3-12-misinfo-deepfakes` |
| Files | `built/02-schools-the-lesson-is-written/` (8 PNGs and `carousel.pdf`), deck at `built/decks/02-schools.html` |

## Hook

> Deepfakes are in the safeguarding guidance now. The lesson is already written.

First line of the LinkedIn post, twelve words or fewer:

> KCSIE 2026 names deepfakes. Somebody on your staff has to teach them.

## Slides

Every screen is a capture of the live public site, taken 10 November.

| Page | Words on the page | Screen |
|---|---|---|
| 1 | EVERY YEAR HAS A JOB. 1 OF 4. The deepfakes lesson is already written. Free to teach. No login. | The lesson's opening slide |
| 2 | The problem. A statutory topic, a non specialist, and a Sunday evening. | None, ink page |
| 3 | 75 minutes. 35 slides. One button. "Teach this lesson." | The lesson page |
| 4 | Your words are under every slide. Word for word, so a non specialist reads it well the first time. | The player with the teacher script open |
| 5 | Last lesson comes back first. Retrieval is built in, not left to whoever remembers. | The recall question slide |
| 6 | The pack prints from the page. Starter quiz, exit quiz, pupil booklet, knowledge organiser. | The lesson page buttons |
| 7 | And it tells you what goes wrong. "Run one check on something true before you run three on something false." | The lesson page, "If you do one thing first" |
| 8 | Teach it tomorrow. One whole lesson, free. No login, no email. schools.guidedchildhood.com. Then: Curriculum, Free sample. | The curriculum map |

## Post text, LinkedIn (Justin)

KCSIE 2026 names deepfakes. Somebody on your staff has to teach them.

Usually that somebody is not a computing specialist. It is a form tutor with a
PSHE slot on Thursday and no lesson.

So I am giving one away, whole.

It is a Key Stage 3 lesson called Misinformation, deepfakes and AI content.
75 minutes as scripted, 35 slides, and the teacher's words sit under every
slide, so somebody who has never taught it can read it well the first time.

It teaches three checks: who made it, what is the source, and what does it
want from me. And it teaches that "pause" is a verdict, not a failure to
reach one.

The note I am proudest of is on the planning page. Run one check on something
true before you run three on something false. A class taught only to debunk
learns to doubt everything.

There is no login and no email. Open it, press Teach this lesson, and it runs.

It is one of 34 modules from Reception to Year 13. The other 33 need a school
code. This one does not.

The link is in the first comment.

If you teach PSHE: which online topic do you feel least ready to stand up and
teach?

## First comment, LinkedIn

The lesson, free to teach, no login:
https://schools.guidedchildhood.com/lesson/ks3-12-misinfo-deepfakes?utm_source=linkedin&utm_medium=social&utm_campaign=walkthrough&utm_content=s1

The statutory mapping it sits inside is open too:
https://schools.guidedchildhood.com/hub/rshe-mapping

## Post text, Facebook

One for the teachers and governors who follow us.

Deepfakes and AI content are named in this year's safeguarding guidance, and
most schools are still working out who teaches it and with what.

We have put one whole lesson out for free. Key Stage 3, 75 minutes, 35 slides,
and the teacher's words under every slide. No login and no email.

https://schools.guidedchildhood.com/lesson/ks3-12-misinfo-deepfakes?utm_source=facebook&utm_medium=social&utm_campaign=walkthrough&utm_content=s1

If you know a PSHE lead, send it to them.

## Visual brief

- The schools site's own teal for the cover and the last page, cream for the
  screen pages, butter for the one gold detail. Nunito and IBM Plex Mono.
- The frame is EVERY YEAR HAS A JOB. with the count top right, the same on
  every page.
- Each screen page: one real capture in a browser frame, one headline, one
  line under it.
- Orbit appears only inside the real lesson slide, where the product put him.

## Proof

- The lesson, open with no login: `schools/lib/taster.ts` (`TASTER_MODULES`), checked live.
- "75 MINUTES · 35 SLIDES · 3 INTERACTIVE", the buttons and "If you do one thing first": the live lesson page.
- The script under every slide, and "Free sample lesson. Play it end to end. Nothing here is a demo": the live player.
- 34 modules: `shared/schools-curriculum.ts`, and the live map says "34 of 34 modules live".
- KCSIE 2026 and generative AI, deepfakes and misinformation: the citation on `/hub/rshe-mapping`.

## Checks

- The printable pack asks for a school email. The post says the lesson has no login and no email, and does not say that of the pack.
- No price in the post.
- The schools `og.png` still says 25 modules, so the link preview is out of date until that image is redrawn. Flagged in the plan.
