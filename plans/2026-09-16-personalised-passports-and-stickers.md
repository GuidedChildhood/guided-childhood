# A passport with the child's name on it, and how the stickers get there

Justin, 16 September 2026: "how would we print with child's details and how
could we provide stickers."

Two questions, and the first one has a different answer in each app. The short
version is that at home it already works, and in school we should not hold the
names and do not need to, because the passport number was designed for exactly
this and nobody noticed.

## Part one: the child's details on the cover

### At home it already works, today

The parents app holds the child record legitimately, with the parent's consent,
so the cover already prints the name and the number:

> **Alma Rose**
> № GC-4K7P-92MD

Both printed versions do it: the A6 file a commercial printer receives, and
the one sheet foldable a parent makes at home. Nothing to build, and a parent
ordering the £14 keepsake is already ordering a personalised book.

### In school, four routes, and I would offer them in this order

The schools app holds no pupil data, no teacher accounts and no session. The
data processing agreement is written on that promise and it is the reason a
school can sign in a week. So the question is not how we get the names, it is
how a child ends up with a book that is unmistakably theirs without us ever
seeing a name.

#### 1. The child writes it. Ships today.

Panel one already carries "This passport belongs to" and a rule. For Reception
this is not a compromise, it is better: writing your own name on your own
passport is the moment. Zero build, zero data, zero cost.

#### 2. The passport NUMBER does the personalising, and this is the one to look at

Migration 227 built `passport_code` and its header says exactly why:

> The code is PUBLIC, so it must reveal nothing by itself. It is not the
> kid_links token (that is a secret credential and is never printed) and it
> **encodes no name, age, stage or date.**

`GC-XXXX-XXXX`, Crockford base32, 40 bits of randomness, designed to be read
aloud down a phone or copied off a fridge door.

**So a school can have thirty books, each bound with its own unique number and
not one piece of personal data anywhere in the job.** The child writes their
name inside; the number on the cover is what makes the object theirs. It reads
as more official than a printed name, not less, because that is how a real
passport works.

Unique numbering at the bindery is standard variable data printing and is one
of the cheapest things a printer does, because the artwork is identical and
only one field changes.

**The open question, flagged rather than promised.** It is tempting to say the
number on the cover is also the way home, so a parent types it and the book
binds to their child. Be careful there. The passport code is a **public
pointer** that answers a verify lookup; the home code on the parent note is the
thing that credits a lesson. Making a public, printed number into a claim token
is a different security shape and needs thinking about properly before anyone
builds it. The safe version of this idea is the numbering alone.

#### 3. Typed names, printed on the school's own printer, never sent anywhere

A teacher pastes their class list into the print page, the browser renders
thirty personalised covers, and the names live in React state, are never
posted, and are gone when the tab closes, with a line on the page saying so.

**This works for the foldable and cannot work for a bound book**, and the
reason is the whole distinction: the free one is printed on the teacher's own
printer, so nothing leaves the room. A bound book means the names travel to a
third party, and then it is not this option any more, it is option four.

Small build. I would do it when a secondary school asks, not before: a box that
looks like it collects children's names invites a question that costs more than
the feature saves, and for primary the handwritten name is better anyway.

#### 4. Real names on bound books: the school sends the list to the PRINTER, not to us

Variable data printing is routine for the white label printers already
identified. The school emails its class list direct to the printer, under the
printer's own data processing terms; we supply the template and never see a
name.

Clean, and it keeps us entirely out of the data chain. The cost is a step for
the school and a second data agreement, theirs with the printer. Offer it if a
school insists on printed names on bound books, not as the default.

### The recommendation

Routes 1 and 2 now. They cover every school, need no personal data, and route 2
turns a box of identical books into thirty individual ones for the price of a
numbering pass. Route 3 when a secondary asks. Route 4 only on request.

## Part two: the stickers

### What is on a sheet today

The free school sheet (sheet B of the passport print out) already carries, per
page and generated from the lesson rows:

- one sticker per lesson, **numbered to match the ring it fills**, so a
  Reception child matches them without reading a lesson title
- the four area stickers
- the stage stamp, the Planet Friend, for when every ring is full
- colour a star spots

The parents app separately sells a `sticker_sheet` at £4: DiGi and all five
Planet Friends plus the five stage stamps, on one glossy sheet.

### Three ways to provide them, and they are not alternatives

1. **Print your own.** Free, today, on plain paper with glue or on sticker
   paper. No supply chain, and nothing about a lesson ever waits on our stock.
2. **Bought kiss cut sheets.** £1.10 to £1.45 a sheet at 150 to 250 from the
   supplier research, so roughly £1.32 to £1.74 once the VAT we cannot reclaim
   is added.
3. **Bundled with the book.** One sheet in the front of every book, so a class
   set arrives complete and a teacher never has to order the second thing.

### The timing fact that decides the unit

A child fills a passport page over **years**, not weeks. The Foundation page is
three lessons; Builder is eight. So the unit is **one sheet per child per
stage**, not one per lesson and not one per year. A Year 3 child needs one
Builder sheet that survives until Year 6.

Which settles the material: for a sheet that has to last four years in a school
bag, **vinyl or laminated, not paper.** Paper stickers will be gone by the
second spring, and a passport with three missing rings is worse than one with
none.

### The name label, and it costs nothing

Put a **blank name label on the sticker sheet.** The child writes their name
and sticks it on the cover.

That is the cheapest personalisation there is: no data, no variable printing,
no quote line, and it is a nicer ritual than a printed name because the child
does it. It also means the free printed sheet and the bought one personalise a
book equally well, so nothing about a child's book depends on their school
having bought anything.

**I would add this to the free sheet regardless of what else happens**, because
it is one rectangle on artwork that already exists.

## What I would do next, in order

| | What | Size |
|---|---|---|
| 1 | A blank name label on the sticker sheet | Tiny |
| 2 | Add a numbering line to the printer quote request, so we know what unique numbers cost per book | Nothing, one sentence in an email |
| 3 | Say on `/supplies` that books can be individually numbered | Small |
| 4 | Typed class names on the foldable, in memory only | Small, when a secondary asks |
| 5 | Think properly about whether a printed number can ever bind to a child record | Do not build this without a security pass |

Nothing here is built. It is an answer to a question.
