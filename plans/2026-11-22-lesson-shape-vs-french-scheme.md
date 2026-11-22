# 22 November 2026: our digital lessons against the French scheme's lesson shape

Justin: are our digital lessons following her easy to teach format, or taking
what is best to improve the structure, as she improves each lesson after she
runs it? Read against her live decks and games, and our own lesson anatomy
(content/lesson-standard/lesson-anatomy.md, whose numbers predate the newer
modules but whose shape still holds).

## Her lesson, every time
I can (pupil words) · the sound of the week · a warm up routine (Ça va) · four
or five new words · a song · repeat · three or four short games (remember the
word, listen and choose, what's missing, splat) · How did it go? (pupils show
how they feel) · Bravo · an end game. Little teacher talk, many short active
turns, the same order every lesson, so the class knows what comes next.
And she changes the lessons after she runs them, dated, from what the class did.

## Ours
Connect, starter, teach, practise, prove, close. A word for word script on every
slide, named misconceptions, SEND and EAL lines, a parent note, auto marked
choices, and a teacher record with secure, developing and revisit per I can.
Teach is about half the slides; practise about one in ten.

## Answer
We follow a different, deliberate structure (the Rosenshine arc suits a
behaviour and judgement subject better than a vocabulary drill) and should keep
it. But four things from hers are worth taking, best first:

1. **The improvement loop.** Hers gets better every time it is taught. Ours is
   checked by guards and reviewed once a term, and the teacher record says what
   pupils have not got (revisit), but never what the teacher would change. Add
   one optional line to the record, "What would you change about this lesson?",
   and send Justin a weekly digest of those lines and the revisit counts per
   lesson across all schools. Every lesson taught anywhere then improves the
   lesson. Needs one small table (a migration). Medium.
2. **More short active turns.** Her lessons are mostly games; ours are about
   one tenth practise. Add one quick sort or splat game to each lesson's
   practise phase, using the existing interactive slide type. Medium, content.
3. **How did it go?** A ten second pupil self check at close: thumbs up,
   sideways or down against the lesson's I can, counted for the class, nobody
   named. It is pupil voice per lesson, which the subject lead kit asks for
   once a term. Small.
4. **The same opening every lesson.** A fixed thirty second routine before the
   starter (the friend says hello, the I can on screen), so the class settles
   the same way each time. Small.

Justin said yes to 1 on 22 November. Built: migration 403 (schools.lesson_records.would_change), the box on the digital lesson record ("What would you change about this lesson?", sent with "Send it to us"), and the Monday digest to Justin at 07:17 (app/api/cron/lesson-changes, rules in lib/school/lesson-changes.ts, `npm run lesson-changes-test`). A week with no line and no revisit sends nothing. 2 to 4 still wait.
