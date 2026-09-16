# Printed passports and stickers: how it works, and what it costs

Justin, 16 September 2026, after choosing print on demand shipping direct:
"can you get an idea of costs and how it would work."

Research done the same day. **Every figure below is either a real quoted price
with its source, or a clearly marked assumption. Nothing here is invented, and
the numbers that are missing are named as missing.** No quote goes to a school
until the gaps are filled by a real supplier.

## How it works, and it already has a name

The model Justin picked is what the UK trade calls **white label** or **plain
cover** printing, and it is a standard service rather than something we have to
talk a printer into.

The printer takes our PDF, prints it, and ships it straight to the school in
unbranded packaging. Several UK firms describe exactly this:

- **Bishops Printers** state plain packaging, anonymous labels, unbranded
  vehicles and a strict no contact policy with your customer, and they name
  booklets among what they regularly produce.
- **Colour Graphics** supply direct to your client under plain cover, with a
  standard plain cover delivery of four working days.
- **Wee Print** put neither their contact details nor their branding on any
  order notification, packaging or delivery note.
- **eColour Print** let you set a different delivery address so parcels go to
  the customer's premises.
- **Black Square Litho** deliver under your company name.

So the flow is five steps and none of them need a warehouse:

1. A school fills in `/supplies` and the cron emails Justin.
2. Justin sends the printer the PDF, the quantity and the school's address.
3. The printer prints and ships plain cover, directly to the school office.
4. Justin invoices the school, 30 day terms, against their purchase order,
   exactly as a licence invoice already works (migration 195).
5. Nothing is held in stock and no cash is tied up before the school says yes.

**The one operational fact to check with each printer:** whether they will hold
our artwork on file so a reorder is a quantity and an address rather than a
fresh upload. Most trade printers do. It is the difference between a two minute
reorder and a job.

## The product fits the cheapest format there is

Two facts found in the research, both of which happen to suit us:

- **Saddle stitch has a minimum of 8 pages.** Our passport is exactly 8:
  cover, this belongs to, five stage pages, back. We are at the floor, which is
  the cheapest a bound booklet gets.
- **A6 is portrait only** on most presses. Ours is portrait.
- Saddle stitch stays the economical binding up to about 48 pages, and the unit
  cost falls with volume because the makeready is spread over more copies.

We are therefore asking for the simplest, cheapest bound thing a printer makes.
That is a good place to be quoting from.

## What it costs, honestly

### Stickers: real UK prices, found

| Quantity | Price | Per sheet |
|---|---|---|
| 150 A5 kiss cut sheets | £218 plus VAT | £1.45 |
| 250 A5 kiss cut sheets | £275 plus VAT | £1.10 |

Source: Mission Print's published product page. Banana Print list A5 sticker
sheets from £24.95 for small quantities, and Discount Sticker Printing from
£5.85, both of which are one or two sheet prices rather than class runs.

The shape is the one to expect everywhere: **a steep drop between 150 and 250**,
because the setup is the same either way.

### Booklets: a range, not a price, and why

I could not get a confirmed per unit figure. Every UK printer puts A6 booklet
pricing behind an instant quote form, and this environment's network policy
blocks those pages. What I have:

- **Printexpert** list A6 8pp stapled booklets **from £61.00**. The quantity
  that price buys is not stated on the listing I could see.
- **Printways** quote A6 stapled booklets from 25 to 10,000 copies.
- **Banana Print** print stapled booklets from 5 copies, with delivery at a
  flat £4.95 per order.
- **Instantprint** dispatch A6 stapled booklets in 24 hours with free delivery
  over £75.
- As a sanity check rather than a UK price, PrintingCenterUSA put an 8 page
  full colour saddle stitch booklet at 100 copies in the **2 to 4 dollars per
  unit** range.

**So the honest answer is that a class of thirty books probably lands somewhere
between £60 and £100, and I will not narrow that without a real quote.**

### THE THING THAT WILL CATCH YOU OUT: we cannot reclaim the VAT

Guided Digital Childhood Ltd is not VAT registered. That is already stated in
the schools site footer, and it is a genuine selling point to a school: the
price on the invoice is the price, with nothing added.

It cuts the other way on supplies. **A printer's VAT is a real cost to us, not
a pass through.** That £275 plus VAT sticker order is £330 out of the bank, and
we cannot claim the £55 back. Every input price found above needs 20 percent
added before it goes anywhere near a margin calculation.

Most schools can recover VAT or are funded for it, so a VAT free invoice from
us is worth something to them. But it means our cost base is 20 percent higher
than the printer's list price and the quote has to carry that.

## The shape of a quote, with the gap named

Per child, inclusive of the VAT we cannot reclaim:

| | Low | High |
|---|---|---|
| Book (assumed, needs the real quote) | £2.00 | £3.50 |
| Sticker sheet (from the real prices above, plus VAT) | £1.32 | £1.74 |
| **Cost per child** | **£3.32** | **£5.24** |

A class of thirty is therefore roughly **£100 to £160 of cost**, plus postage.

What to charge, at that cost base:

| Sold at, per child | Margin at £3.32 cost | Margin at £5.24 cost |
|---|---|---|
| £6 | 45 percent | 13 percent |
| £8 | 59 percent | 35 percent |
| £10 | 67 percent | 48 percent |

**The read: £8 a child is the number that survives the bad end of the range.**
A class set at £240, a two form entry primary year group at £480, a whole
primary of 210 children at £1,680, which sits sensibly beside a £495 to £795
licence rather than dwarfing it.

At £6 it only works if the books come in at the good end, which is exactly the
sort of bet that turns into a job done for nothing.

## What Justin needs to do, once

Send one email to two or three of the named white label printers with this
specification:

> A6 portrait, 8 pages, saddle stitched, full colour throughout, 300gsm cover
> and 130gsm inners, print ready PDF supplied. Please quote per unit at 30,
> 100, 250 and 500, delivered plain cover to a third party UK address, and
> confirm you hold artwork on file for reorders and state your standard lead
> time.

The same email to a sticker printer for A5 kiss cut sheets on white vinyl at
30, 100 and 250.

Two quotes back and the `/supplies` form can start returning real numbers the
same week.

## What this does not settle

- **Postage.** Nobody's plain cover delivery cost is public. It is a line on
  the quote, not a guess here.
- **Which paper.** 300gsm cover and 130gsm inners is the standard spec for a
  booklet that survives a school bag, but a printer may have a cheaper house
  stock that is just as good.
- **Whether a first order is worth fulfilling at all.** One class of thirty at
  £8 is £240 of revenue and perhaps £100 of margin. That is a morning's work.
  The reason to do it anyway is that a school holding thirty bound passports
  renews a licence, and a school with thirty folded paper ones may not.
