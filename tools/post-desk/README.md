# The Post Desk source

The page Justin opens to copy a post or a newsletter from:
https://claude.ai/artifact/Xb6Jt6JAm2d3wrF7WXxeGY

`head.html` and `tail.html` are the two halves of it. The data goes in between,
as `const D = {posts: [...], news: [...], ideas: [...]}`, built from the packs.
Publish by concatenating head, the JSON, and tail, then sending the result to the
same artifact URL. Never create a second desk: a new URL is the exact
fragmentation this page exists to end.

## Why the copy code looks the way it does

Justin, 6 November 2026: "a way fo coipying text from piost desk as seems to
carry over fomatting black back ground".

The original fallback, when `navigator.clipboard.writeText` was unavailable,
selected the styled `<pre>` with a DOM Range and let the browser copy it. That
is a **rich HTML copy**, so it carried the element's CSS with it, and in dark
mode `.copy pre` has `background: var(--bg)`, which is `#1D1A12`. Pasting into
LinkedIn or Substack brought that near black block along.

`navigator.clipboard.writeText` throws in app webviews and in any non secure
context, which is why the fallback was firing at all on a phone.

The fix is `copyPlain()` in `tail.html`, three steps, each of which can only ever
produce plain text:

1. `navigator.clipboard.writeText`, which is plain text by definition.
2. A hidden `<textarea>` plus `document.execCommand('copy')`. A textarea's value
   is a string with no markup, so this cannot carry styling either.
3. Last resort, reveal a plain white `textarea.manual` to copy from by hand.
   Deliberately a textarea and never the `<pre>`, so even a manual copy is clean.

**Do not reintroduce `selectNodeContents` on a styled element.** The build script
asserts it is absent.

## Newsletters need a title and a subtitle

Added the same day, for the same reason: a newsletter is not just a body. Substack
asks for a title and a subtitle, so each newsletter card carries both as their own
copyable fields, with the two alternative titles behind a disclosure.

A **LinkedIn** newsletter needs a third thing, the note to the network, which is
what appears in the feed when the edition publishes. Issue 6 is the only LinkedIn
one and its card carries that note.

## A posted post does not leave the desk straight away

Justin, 9 November 2026: clear off the ones marked as posted a few days after
the marker, so he still has access to add comments.

The first hours after a post goes out are when the comments arrive and when
replying to them matters most, which makes the post he has just ticked the one
he still needs to reach. So ticking Posted no longer hands it to the folded
section at the foot. It stays in the working list, lightly dimmed, carrying the
date it clears, and moves itself away after `GRACE_DAYS`, which is 3.

**The stored value is now the tick time in milliseconds.** It used to be the
string `1`, which carries no date. Anything ticked before this change therefore
has nothing to count from, and `inGrace` treats a `1` as already past its grace
so it stays where he left it. Without that, every post he had already cleared
would have climbed back onto the desk.

The "Put those N away now" button is the override for when he is finished with a
post sooner. It writes the legacy `1` to expire the grace rather than deleting
anything, so an accidental press is undone by unticking.
