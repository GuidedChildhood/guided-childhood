# Batch 4: loading, error and not found

18 September 2026. Session 0u09q9. Schools app only, wiring untouched.

## The measurement

```
  schools/app/loading.tsx     does not exist
  schools/app/error.tsx       does not exist
  schools/app/not-found.tsx   does not exist
  notFound() call sites       19
  spinners in the app         0
```

**Nineteen places in this app deliberately send a teacher to a 404, and there
was no 404 to send them to.** A lesson not in the scheme, a stage that does not
exist, a quiz with no questions yet, a class link whose id is not a uuid: every
one of them landed on the Next.js default page, black on white, in a typeface
we do not use, reading "404 This page could not be found."

A teacher who has just clicked a link a colleague sent them, in front of a
class, reads that as the product being broken. It is almost always a mistyped
module name or a lesson outside their licence, and both of those have an answer
we can give.

Zero spinners is a good result and nothing had to be replaced. One comment in
the print pack already says "a QR is never a spinner on a page being
photocopied", so the house was already thinking about this.

## What landed

**`not-found.tsx`** names the likely cause, offers the two doors back (the
curriculum page and the print room), and carries the real nav and footer,
because a page with no way back to anywhere is its own small dead end. It does
not apologise.

**`error.tsx`** follows two rules, and the second is the one that is easy to get
wrong. No technical detail on screen: the digest goes to the console, the page
says what happened in words. And it does not promise that their work is safe,
it promises the true thing. Most error pages say "your work has been saved".
This app has no pupil data, no teacher accounts and no session beyond the
access cookie, which is the promise the DPA is written on, so the honest
reassurance is that there was never anything of theirs here to lose. Better
sentence, and unlike the usual one it is true.

It carries one plain way home rather than the nav, because `SiteNav` is a server
component that reads the school's licence state and a client error boundary
cannot await that. A nav that guessed would be a nav that lies, on the one page
where trust is already thin.

**`loading.tsx`** is a skeleton, not a spinner. A spinner says "something is
happening"; a skeleton says "this is the shape of what is about to be here",
and on a school laptop over a school connection that is the difference between
waiting and reloading. It draws the shape these pages actually have, because
guessing a different one would be worse than a blank screen: the layout would
visibly rearrange itself the moment the content arrived. The shimmer is the one
thing in this app that animates on its own, and batch 3's reduced motion block
already covers it, because that block covers `animation-duration` too.

## And the file that both earlier sweeps missed

`schools/components/ui.ts` opens with "Import these, do not re invent them" and
then invented twelve sizes of its own. It is a `.ts`, and the type, space and
shape sweeps both globbed `.tsx`. **The one file whose whole job is to stop
other files improvising was the last one still improvising.** Eighteen values
now read from the scales, which took the off scale font count from 14 to 10.

## Found and not fixed, named rather than buried

`/lesson/<a module that does not exist>` renders the new 404 correctly but
returns HTTP **200** rather than 404. `notFound()` is called after an async read
inside a streamed page, so the response may already be committed by the time it
runs. This predates the batch: the same route returned the same status before,
just with the Next.js page on it. It is a soft 404 and worth its own look,
because search engines and link checkers read the status and not the words. Not
fixed here because it is a streaming and routing question rather than a design
one, and this batch is design.

## Verification

Both typechecks, every guard by exit code, both stylesheets parsed. The 404
rendered in a real browser at 1440 on two different routes and read by eye. The
ratchet fell again rather than rising.
