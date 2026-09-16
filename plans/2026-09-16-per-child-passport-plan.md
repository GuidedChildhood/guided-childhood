# Per child passports: the record, the paper, and where the books come from

Justin, 16 September 2026: "how do we deal with passports for each child and
printing them, and they should auto update, but you said the class updates. I
think that a small check, maybe a text, will auto populate passport. How best to
show them an animation of that, and be able to print individual for each child?
And a way the printing formats to print like a book, and a way maybe for schools
to order blank books and stickers, even if just a request for now."

## You are right, and here is the correction

I said the class updates, and that was accurate but incomplete. There are two
passports in this business and they are different objects.

| | The child's passport | The class passport |
|---|---|---|
| Lives at | The parents app | `/hub/passport` in the schools app |
| Whose it is | One child, named, with a passport number | The screen it was ticked on |
| Stored in | `children`, `lesson_completions`, `stage_passports`, the sticker book | `localStorage`, key `gc.schools.taught` |
| Fills when | That child does the work, or a home code is entered for them | A teacher taps the passport beat at the end of a lesson |
| Prints as | An A6 booklet, nine pages, `/dashboard/keepsakes/passport-print?child=` | An A4 sheet that folds into eight panels, `/print/passport/[stage]` |
| Per child? | Yes, really | The paper is. The record is not, and cannot be. |

**The schools app cannot hold a per child record and must not start.** The DPA
is written on the promise that it holds no pupil data, no teacher accounts and
no session. That promise is why a school can sign in a week instead of a term,
and it is worth more than any feature on this page.

So per child splits cleanly in two, and both halves already exist:

- **The per child record** lives at home, keyed to a child row, and already
  prints per child.
- **The per child object** is the paper passport in the classroom. One per
  child, the child's own name on the front. The zine already has the name line
  on panel one, above a rule.

Nothing here needs a pupil record in school. It needs the two halves joined
better, and the join is the code.

## The text already exists. It is the home code.

Your instinct is right and the thing is built. Migration 230 put a
`HOME-XXXX` code on every module, four characters in Crockford base32 so no
letter can be misread. It is printed on the parent note that goes home with
every lesson and on the booklet.

A parent types it into the card at the foot of the lessons page. `POST
/api/school-code` normalises it, looks up the module, checks the child belongs
to this parent, and writes a `lesson_completions` row with
`lesson_source: 'school_lesson'` **against that specific child**.

That is a text auto populating one child's passport. It works today.

Three things it deliberately does not do, all of them right:

- **One code per module, shared by the whole class.** This is credit, not
  assessment. The school says "we covered this", the passport records it. A
  code per child would need a pupil record in school, and that is the promise
  we will not spend.
- **It never records the venue.** School and home write the identical row. The
  Cambridge private candidate rule.
- **It does not count toward a stage stamp.** Stamps come from stage lessons
  and the big check, in `lib/pathway/progress.ts`. A school module is credit.

## What is actually missing, in the order it is worth fixing

1. The code has no front door. It lands on paper and the parent has to have the
   app, find a quiet card at the foot of a page, and type.
2. When it lands, it says a sentence. Nothing moves.
3. The class set has no instruction to print one per child.
4. The parent printout is a printer's file wearing a home print's clothes.
5. A school has nowhere to ask for books and stickers.

## 1. The animation is already written

`shared/components/PassportPage.tsx` takes `filled` and `animate` and runs a GSAP
timeline: the ring sweeps from the old fraction to the new over 0.9s, the four
area bars grow with it, and the stamp seal pulses by register. Reception bounces
at 1.18 with a tilt, Year 11 barely moves at 1.03. Reduced motion means no
movement and never no content. It is the same component the parents book draws,
in the same pastels.

**It plays on the classroom wall and nowhere else.** At home, a code that lands
prints "Stamped in: <title>."

**Recommendation.** When a code is accepted, do not print a line. Draw that
child's page and play the same fill. The area that moves is the area today's
lesson sits in, which is the thing worth seeing: not a number going up, but one
of the four things this child is being taught filling a little.

One honesty wrinkle, written down rather than smoothed over. The ring in
`PassportPage` counts **school modules on that page**. The ring in the parents
book counts the stage's own work: lessons, the check, jobs, screen balance. They
are two different fractions with the same shape. So the card should show the
school page filling, say plainly that it is the school half, and link to the
book. Showing one ring and implying the other would be the kind of small lie
that costs a customer the day they notice.

Build size: small. The component is already shared and already animates. The
parents app passes the child's real school completions as `taught` instead of
device memory.

## 2. The front door for the code

The parent note already goes home in a book bag. Put a QR code on it that opens
one new route, `/home-code/7K3F`. Signed in, it drops the parent on the redeem
card with the code already filled and one button to press. Signed out, it sends
them to sign up and returns them to the same card, so a parent who has never
heard of us is signed up by the thing they came to do.

Not a query parameter on `/join`. Every CTA on `/join` routes to `/starter-pack`
(non negotiable 9) and a code arriving there would either break that rule or get
swallowed by it. Its own route keeps both promises.

This is the highest value item on the page and the cheapest. Every unredeemed
code is a family who met us and never arrived.

Build size: small. One route, one QR on an existing print sheet.

**A real text message: I recommend against it.** To text a parent we would need
their phone number, which means the schools app holds parent contact data, which
ends the promise the DPA rests on. It also costs money per send and needs
consent we do not have. The code on paper, with a QR on it, does the same job
and keeps the promise. If you want a text to exist, the honest version is the
**parents app** texting its own signed up parent, which is a different feature on
a different consent.

## 3. Printing one for each child, honestly

### In school, today, with no build

One A4 sheet per child. Print thirty, fold, cut one slit, and every child has a
passport with their own name on the front in their own handwriting. For Reception
that is better than a printed name: writing your name on your own passport is the
moment.

What is missing is one line of copy. `/print/passport` never says **print one
per child**, so a teacher reasonably reads it as a display item. Fixing that is
a sentence.

Build size: tiny. Do it first.

### The typed class list, if a teacher ever asks

A teacher pastes thirty names into a box on the print page and gets thirty
passports with the names already printed. The names live in React state, are
never posted, never stored, and are gone when the tab closes, with a line on the
page saying exactly that.

I have thought hard about this and **I recommend holding it until a teacher asks
for it.** It is genuinely safe if the names never leave the browser, but it puts
a box on our page that looks like it collects children's names, and the first
question a data protection officer asks about that box costs more than the
feature saves. Reception children should write their own names anyway. If a Year
10 teacher asks, build it then, in memory only, and say so on the page.

### At home

Already per child and already real. `/dashboard/keepsakes/passport-print?child=`
builds the booklet from that child's actual stamps, stage progress, checks and
stickers, so the printed book can never show a stamp the app has not given. The
cover carries the child's name and passport number.

## 4. Print like a book

Three formats. We ship one of them and it is the wrong one for the job it is
doing.

| Format | Sheets | What a parent does | Works on a home printer | Best for |
|---|---|---|---|---|
| **A6 pages, one per sheet** (what we ship) | 9 | Sets the printer to A6 and hopes | Badly. Most scale it onto A4 with a huge margin, some refuse | The commercial printer for the £14 keepsake |
| **The folded zine** (school side, built) | 1 | Print, one slit, fold | Yes, any printer, any paper | The free version at home and in class |
| **Saddle stitch** | 3 of A4 landscape, duplex | Print double sided, fold, staple the spine | Rarely. Long edge and short edge flipping gets it wrong | The file a print on demand supplier receives |

**Recommendation: the zine at home, saddle stitch for the paid keepsake.**

The zine fits the child's passport exactly, which is the part I did not expect.
Eight panels, and the book is cover, this belongs to, five stage pages, back
cover. Eight. The imposition is already solved in `schools/lib/passport-print.ts`
(`ZINE_TOP` printed upside down, `ZINE_BOTTOM` the right way up, the slit across
the two middle panels, and `FOLD_STEPS` to follow).

So the parents app gets a free printable passport that any parent can make on a
Tuesday, and the £14 keepsake stays the real saddle stitched booklet that arrives
in the post. The free one makes the paid one obvious rather than replacing it:
nobody who has folded the paper one thinks the printed one is not worth fourteen
pounds.

The A6 file stays exactly as it is. It is not broken, it is the printer's file,
and the page should say so instead of offering it to a parent as a print button.

Build size: medium. The zine layout is written, the content is a different
source, and the fold instructions transfer whole.

## 5. Schools ordering blank books and stickers

The letterbox pattern already exists and is exactly the right shape. The schools
app carries no email, no payment and no auth code by design (wiring check 7), so
a form inserts a row through the anon key and the parents app's hourly cron
emails you. A row survives an email outage where a fire and forget send does not.

**Recommendation: a new table, not a reused one.** Migration **302,
`schools.supply_requests`**, claimed in this plan and named in the draft PR so no
other session takes the number. Putting supplies into `invoice_requests` would
mean the invoice pile and the invoice email both start lying about what they
contain.

Fields: school name, contact name, email, key stage or stages, pupil count,
what they want (books, stickers or both), quantity, purchase order number
where they have one, notes. Insert only RLS, no select policy, service role
reads the pile. The same anon insert, the same cron email, one new block in the
email template.

**It should say request a quote, not a price.** There is no supplier, no stock
and no landed cost yet, and a price on a school page is a promise finance will
hold you to. A quote form with a real reply in a day is a better first version
than a shop that cannot ship.

One detail that protects the promise: the box goes to the school address, never
to a child, and the form never asks for a pupil name. That keeps the supplies
line entirely outside the DPA.

Build size: small. One migration, one form, one action, one block in the cron
email.

## The order I would build it

| | What | Size | Why here |
|---|---|---|---|
| 1 | "Print one per child" on `/print/passport`, and the count for a class of thirty | Tiny | A sentence turns a display item into a class set |
| 2 | QR and the `/home-code/[code]` route on the parent note | Small | Every unredeemed code is a family we met and lost |
| 3 | The fill animation when a code lands at home | Small | The component already animates. It just never plays here |
| 4 | Migration 302 and the supplies request form | Small | You can answer a school the day they ask |
| 5 | The zine format for the child's own passport at home | Medium | The free printable that makes the paid one obvious |
| 6 | Typed class list, in memory only | Small | Only if a teacher asks for it |

Items 1 to 4 are a day. Item 5 is a day on its own.

## What this plan does not do

- It does not put a pupil record, a name or a class list on our servers.
- It does not take money in the schools app.
- It does not print a stamp the app has not given.
- It does not change what a home code means, or make it per child.
- It does not text a parent.

## Questions for you, with my answer to each

1. **Free printable passport at home, or keepsake only?** A parent folding a
   paper passport on a Tuesday is the product working. *My answer: ship the free
   zine. It sells the £14 one better than a picture of it does.*
2. **Blank books: pre printed with the five pages, or genuinely blank?** *My
   answer: pre printed. A blank book is a notebook. The pages are the product.*
3. **Price or quote for schools?** *My answer: quote, until a supplier and a
   landed cost exist. A price we cannot fulfil is worse than no price.*
4. **Who fulfils a class of thirty?** You pack parent keepsakes by hand today.
   Thirty per class is a different job. *My answer: quote form first, then
   decide, and let the first real request tell you the volume.*
5. **Does the school order for the school, or can a parent order one book?**
   *My answer: both eventually, school first. The school has a purchase order
   and buys thirty.*
6. **Typed class names on the print page: yes, no, or wait?** *My answer: wait
   until a teacher asks.*
7. **Sticker sheets: same supplier as the parent sheets?** Vograce already makes
   those. *My answer: yes, one supplier, one artwork standard, better unit price.*

Nothing in this plan gets built without your yes.
