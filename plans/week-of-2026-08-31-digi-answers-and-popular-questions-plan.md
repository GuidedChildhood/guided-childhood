# DiGi's answer: neat on the screen, never cut short, and the popular questions become scripts

Justin, 6 September 2026, 00:43, after DiGi answered on the second go: "can
we improve the display of the answer on DiGi with the best known way of
displaying it neatly and easy to read, and that good popular questions can
get added as scripts, and DiGi learns from all of this."

## What the data said

The stored reply for "Alma becoming cheeky" ends mid word at "**Watch when it
sh" and digi_latency called it a success (replied, 1108 characters, no
failure). So a reply that stops early is invisible. And the raw asterisks
were on the screen because the renderer only bolds a closed pair.

## One: never cut short, and say so when it was

- max_tokens 1000 becomes 1600 on the main call and the continuations.
- A turn that ends on max_tokens gets one continuation ("carry on exactly
  where you stopped") with tools off, appended to the same stream.
- The latency row records what happened even when some text got out:
  cut: max_tokens, partial: <error>, recovered: <reason>. Before, any
  failure after the first character was written as a clean success.

## Two: the answer, laid out the way the best chat products do it

Mobbin, 6 September (Meta AI, Grok, Recime): no bubble for the assistant,
bold lead in on its own line, the explanation beneath, bullets as real
bullets, generous space between points, the next question as chips.
Translated into our finish: each **lead in** paragraph becomes a point with a
numbered butter plate on the ink edge, the lead in in Nunito 800, the words
beneath; "- " and "1. " lines become real lists; an unclosed ** while the
reply streams renders as bold in progress, never as asterisks. A dev fixture
at /dev/digi-answer shows the Alma reply so it can be checked at 390.

## Three: the popular questions become scripts

The writer already exists (script-refresh: parent requests, DiGi questions,
flagged answers, drafts to script_candidates, Justin approves on Insights).
It ran twice a month and passed the questions through one by one. Now it
groups the month's questions by their first words, counts how many times and
how many families asked, hands the model the list ranked by count with the
numbers on each line, and asks for the most asked first. It runs every Sunday
at 07:00, an hour after the wisdom rebuild, so a question asked on Monday can
be a script by the weekend, still behind Justin's approval.

## DiGi learns, what already runs

Per family memory (digi_memory, save_memory), the weekly cross family wisdom
rebuild with a review gate (migration 167), the check in learning cron, the
knowledge bank refresh, flagged answers steering the next scripts, and the
script link in replies when one fits. Nothing new needed there; the gap was
the cut reply and the raw asterisks.
