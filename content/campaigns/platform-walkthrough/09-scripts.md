# 09 · The words

| | |
|---|---|
| Run | Parents, 5 of 13 |
| Service | Scripts for the parent, and the child's own openers (map entries 5 and 19) |
| Format | Carousel, 7 cards. Not built |
| Channels | Guided Childhood Instagram. Facebook takes card 1 and the text |
| Proposed | Sunday 29 November, 19:30 |
| Free step | The stage check |

## Hook

> I had the whole conversation planned. Then I opened my mouth and said "because I said so".

## Slides

| Card | Words | Screen |
|---|---|---|
| 1 | A THING PARENTS SAY. "Because I said so." You know what you mean. Then the words go. | None |
| 2 | So we wrote them down. What to say, what not to say, and why it works. | The scripts page |
| 3 | One card at a time. Step 1 of 4. Say this. Use these words tonight. | The script deck, the Say this card |
| 4 | You can practise first. Rehearse with DiGi before you have the real one. | The rehearse screen |
| 5 | Then tell us which line worked. The next script starts from that one. | "Which line worked?" |
| 6 | Your child gets words too. For the hardest sentence: "something happened." | The child's Telling a grown up page |
| 7 | Keep this one. Save it for the next conversation you are dreading. | None |

Card 3 shows a real script from the `scripts` table, word for word. It is
chosen at build time and checked against the live row that day.

## Caption, Instagram

Send this to the parent who rehearses it all day and still says the wrong
thing.

1. Scripts are word for word. What to say and what not to say.
2. Each one tells you why it works and what to do after.
3. You can rehearse it before you have the real conversation.
4. Tell us which line worked, and the next script starts there.
5. Your child has their own, for telling you when something has happened.

The right words in a calm voice get further than the right rule in a cross
one.

5 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What is the sentence you wish you had ready?

## Caption, Facebook

You know what you want to say. You have gone over it all day. Then they look
up from the screen and out comes "because I said so", and now the row is
about your tone and not the phone.

So we wrote the words down.

Every script gives you what to say, what not to say, why it works and what
to do after. It reads one card at a time, so you only ever hold the next
line. You can rehearse it first. And when you tell us which line worked, the
next script you get starts from that one.

There is another half that matters as much. Your child has their own short
openers in their app, for the hardest sentence a child says: something
happened. Alongside them is the promise on our side, that nothing gets taken
away for being honest.

5 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-09-fb

What is the sentence you wish you had ready?

## Visual brief

- Cream ground. Card 1 is format 6, the parent situation. Cards 2 to 6 are real screens.
- Card 3 uses the `script` card type's two halves if a real script has a "not this" line; otherwise the deck capture alone.
- Captures exist for the deck and the rehearse screen (`script-deck.png`, `script-rehearse.png`). The child's page needs one new capture.

## Proof

- `/dashboard/scripts`: "What to say, what not to say, and why it works. Scripts for real moments, not perfect families."
- "Rehearse with DiGi", "Which line worked?", "Noted. DiGi will start with that one next time.": `/api/scripts/rehearse`, `/api/scripts/lines`, migration 107.
- The child's side: `/k/[token]/tell`, "Telling a grown up", "The promise"; 25 openers and 5 cards from migration 163.
- Scripts live in the database, not in the app (non negotiable 6).

## Checks

- Scripts open with the account, inside the four free days. The post does not say any script is free for ever.
- The quote on card 1 is labelled as a thing parents say.
- "Something happened" stays general. No example of what happened is shown.
