# Under 7s: four new lessons, built from the best that already exists (30 September 2026)

Justin, 30 September 2026: "research best lessons out there for under 7s and
write them as the best possible lesson."

Why now: since PR 1178 the child's lessons ARE the school modules, so a
Foundation child (4 to 7) sees only three lessons in their own app. That is
the thinnest shelf in the product, and it is the age where parents are
fighting the stop every night.

## What the best under 7 lessons do (the research)

Network note: the container's egress policy blocks gov.uk, Ofcom, Childnet and
CEOP pages, so everything below was read through search extracts, the same
access the September resource audit had. Nothing here is quoted as a number on
a slide unless it is marked checked in the module's evidence base.

| Resource | Who | What it does well |
| --- | --- | --- |
| Smartie the Penguin | Childnet, 3 to 7 | Six stories, two per year group (EYFS, Y1, Y2), a character with a new tablet meets three tricky moments; children say what Smartie should do and why; a song to remember what to do. Themes: pop ups and in app buying, sites for older children, unkindness. |
| Jessie and Friends | CEOP (NCA), 4 to 7 | Three cartoons: watching videos, sharing pictures, playing games. Keep personal information private, only talk to people you know in real life, tell an adult you trust. Deliberately never shows an adult contacting a child: the gamer who tricks them is an older sister. Safe and not scary. |
| Common Sense K to 2 | Common Sense, 5 to 8 | Short lessons, one idea each: pause and think online, the internet traffic light, how technology makes you feel, media balance. Licensed non commercial no derivatives, so we borrow ideas only. |
| Education for a Connected World | UKCIS, the framework schools map to | Early years to 7 outcomes in all eight strands. The ones our three modules do not reach: personal information (name, address, birthday, age, location), asking a trusted adult before sharing anything about yourself, information can stay online and be copied, the ways the internet is used to communicate with people I know, rules that keep us healthy when using technology. |

What the evidence says works at this age, and what the lessons will do:

1. **A friend in a tricky moment, and the class decides.** Smartie and Jessie
   both work this way. Ours: Pebble meets the moment and the class tells
   Pebble what to do. (Our own rubric check E41 wants exactly this, and none of
   the three existing under 7 lessons has it.)
2. **A chant with actions.** Smartie's song. Four year olds carry a rhythm
   home before they carry a rule.
3. **Never scary.** Jessie's design rule: no adult contacting a child on
   screen. The tricky person in our game story is another player being
   unkind or tricksy, never an adult.
4. **Practise the move, do not just hear it.** Role play the stop, the
   paws off, the "that is private".
5. **Tell a trusted adult, never in trouble.** The same thread as eyfs-01 and
   ks1-02, so the spiral holds.
6. **The grown up at home closes it.** Under 7 the child app opens these as
   do it together, and the parent note carries the one tea time question.

What the research says about the topics themselves:

- **Stopping is the hardest moment.** Toddlers had more trouble moving on
  from a tablet than from a book (Munzer and Radesky, Acta Paediatrica 2021).
  In a diary study of 28 families, routines and natural stopping points made
  the move away easier, and a two minute warning did not help (Hiniker and
  colleagues, CHI 2016). Autoplay, rewards and characters are built to keep a
  child going (the 2026 disengagement review). So the lesson teaches the end
  of the bit, not a countdown.
- **Young apps are full of taps that want something.** 95 percent of apps for
  children 5 and under carried at least one form of advertising, including
  pop up videos and characters nudging a purchase (Meyer and Radesky, Journal
  of Developmental and Behavioral Pediatrics 2019, 135 apps).
- **Under 7s know secrets, not privacy online.** In 18 US families, 5 to 7
  year olds had gaps in understanding that sharing online is seen differently
  from sharing face to face, and most children said to tell a parent if a
  message asked for their address (Kumar and colleagues, CSCW 2017).
- **Small children half believe the voice.** Children see smart speakers as
  part human and part machine; older children trust the device more for facts
  and the human more for personal things (Girouard Hallam and Danovitch 2022;
  Andries and Robertson 2023).

## The four lessons

All Pebble with DiGi Junior, the bouncy register, around 20 slides and 45
minutes, the same arc as eyfs-01: star breath, Pebble arrives, retrieval from
the last lesson, keywords, teach, half time, a sort, a try it, two prove
questions, chant, recap, Pebble's mission, passport, DiGi Junior.

| n | Module | Stage | Scaffold | The tool | Fills |
| --- | --- | --- | --- | --- | --- |
| 30 | eyfs-30-the-screen-never-says-stop | Reception | CHOOSE | Finish the bit. Say bye bye. Go to the next thing. | EfCW health; the nightly fight |
| 31 | eyfs-31-paws-off-ask-first | Reception | NOTICE | Paws off. Look up. Ask a grown up. | EfCW privacy and security, managing information; pop ups, buy buttons, the next video |
| 32 | ks1-32-private-like-a-toothbrush | Years 1 to 2 | CHOOSE | Is it private? Keep it. Not sure? Ask. Someone wants it? Tell. | EfCW privacy and security, online reputation; asking before a photo |
| 33 | ks1-33-who-is-on-the-other-side | Years 1 to 2 | NOTICE | Someone I know? Someone I do not know? A machine? | EfCW online relationships; the AI seed, a screen voice may not be a person |

## Build order and gates

1. Write each module JSON in content/modules, written and not wired, and run
   check-module-contract, check-lesson-rubric, the source claims and the dash
   rule on each. [x]
2. Wire: CURRICULUM rows 30 to 33, passport areas, migration 358 generated by
   scripts/module-to-migration.mjs. [x] (also: the child's list follows the
   manifest's teaching order, the ks5-20 sign off counts thirty two, and M32
   and M33 have staff briefings)
3. Ask Justin before applying 358 to production (it is a database write). [x]
   Justin said yes on 30 September; applied that day, all four rows hash
   proved against their files, the table went from 32 to 36, and nothing
   else moved but the ks5-20 sign off line.
4. Later, with credits: a Pebble clip per lesson on the blank board rule.

## Also noted today

The eight school clips were already remade on the Planet Friends on 11
September; the only misspelled board was the parent lesson clip, which 357
took out. The scene analyses of the live eleven school clips read no lettering
on any board, so the remake Justin approved is only needed if he sees a board
with words on one; nothing was spent.
