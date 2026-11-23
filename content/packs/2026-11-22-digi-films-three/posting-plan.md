# Three DiGi films: Roblox strangers, the Year 6 group chat, the teen bedroom

Built 22 November 2026 (plan: `plans/2026-11-22-digi-films-three-plan.md`).
Drafts. Justin posts. Same engine as the 15 November switch off short that did
well (`videos/2026-10-09-digi-shorts`), slowed down for reading, with three new
beats: motion captions on how it works, the inputs DiGi used, and the science.

| Film | Child (example family) | Length | File |
|---|---|---|---|
| A | Ava, 9 | 58.7s | `films/roblox-strangers.mp4` |
| B | Sam, 11 | 58.7s | `films/group-chat.mp4` |
| C | Maya, 14 | 58.7s | `films/bedroom-phone.mp4` |

All 1080 x 1920, real app screens recorded from fixture pages, every name an
example family name. DiGi's replies are illustrative and labelled on screen.

## The shape of every film

1. Hook: the parent's question in their own words.
2. DiGi checks the family first, then answers: two plain steps underlined, never a yes or no.
3. It goes on the child's check in. The words come as a script, one card at a time.
4. A few days on, DiGi asks how it went. The parent taps a face. A week on, Sorted.
5. What DiGi used: the child's age and stage, what the parent raised before, what worked for this family, the parent's own rating. Never a yes or no, safeguarding first, reviewed research.
6. The research behind it, one verified study whose ages match the child.
7. End card: the stage check, at the film's own link.

## Captions, Instagram

**A, Roblox strangers.** A stranger messaged her on Roblox. She's 9. DiGi does not say ban it and does not say it is fine. It starts from your child and what worked in your house before, gives you two plain steps and the exact words, then checks back until it is sorted. Restricting contact cuts the risks and the good together; guiding opens the good. So the plan does both. What stage is your child? Three questions, no sign up. Link in bio.

**B, the Year 6 group chat.** All hell has broken loose on the Year 6 group chat, and your child was taken out on purpose. DiGi gives you the words for tonight, puts it on their check in and asks how it went a few days later. Children with more support at home cope better with being left out online. What stage is your child? Three questions, no sign up. Link in bio.

**C, the bedroom phone.** She's 14 and wants her phone back in her room at night. Not a yes, not a no: a trial with a review date, agreed together, and DiGi checks back on how it is going. A phone in the bedroom, even unused, is linked to less sleep. What stage is your child? Three questions, no sign up. Link in bio.

Facebook: the same text, with the film's link in place of "Link in bio".

## Links to make first (Admin, Film links)

`roblox-strangers`, `group-chat`, `bedroom-phone`, and the `-fb` version of each.
Each end card already prints guidedchildhood.com/v/<name>.

## Sound

The edit carries a quiet bed (music-leberch). On Instagram you can swap it for a
trending instrumental at upload: the films were cut to read without sound. The
shortlist in `content/packs/2026-11-19-iphone-films/posting-plan.md` still applies.

## Order (proposed, Justin decides)

Sunday mornings to 6 December are taken by the New in Guided Childhood run, so:

1. Roblox strangers first: the most raised new worry, and the strongest hook.
2. The group chat a week later.
3. The bedroom phone a week after, for the parents of teens.

Any slot works; none depends on another.

## Proof paths

- The script cards are live rows 204, 9611 and 417, copied word for word into `app/ref-script-deck`.
- The tracker, check back faces and Sorted are the live check in screens.
- Science: Livingstone et al. 2017 (J Communication), Hellfeldt et al. 2020 (IJERPH), Ofcom 2026, Carter et al. 2016 (JAMA Pediatrics), UK Chief Medical Officers 2019. All checked 22 November.

## The finished cut: simpler text, the 3D opening, Imogen's voice (22 November, later)

The three files in `films/` are now this cut, 57.7s each. They replace the first silent cut.

- Simpler text (Justin: too much on screen): one short line per beat, larger, on a clear ground so no app text shows behind it. The inputs card is three rows and the research is one line.
- The 3D opening: after the hook, a drawn phone turns in space and settles flat while the question types into the real app. It is the engine's `tilt` option.
- The voice: Imogen on the more natural engine, chosen by Justin for a calm British presenter sound. Ten short lines per film, one per beat, with the music dipping under her (`tools/mix-voice.py`, lines in `assets/vo`).

What she says, the Roblox film: "A stranger messaged her on Roblox. She's nine. So, what do you say tonight? DiGi starts with your child. It never says yes or no. It gives you two plain steps. Then it goes on her check in, with one thing to try tonight. And here are the exact words to say. A few days later, it asks how it went. A week on, it's sorted. DiGi learns your family. What worked before shapes what comes next. The research agrees. Rules alone cut the good too. Guiding keeps it. What stage is your child? Three questions. No sign up."

The other two change only the opening line and the research line.
