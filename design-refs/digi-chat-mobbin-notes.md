# DiGi chat — Mobbin AI-chat reference

Source: live Mobbin pull, 16 July 2026, for the DiGi chat flow redesign
(make the thread read like DigiWelcomeSheet, one flowing voice not boxed
cards). Same rule as the other refs: copy the structure, never the brand.

## The pattern: the guide flows, only the user gets a bubble

**Pi** ([screen](https://mobbin.com/screens/09e5ea1d-e7e4-4d4b-9a68-110294d5c9b3)):
the AI's lines sit as plain warm text directly on a soft cream ground, no
bubble at all, separated by generous spacing, with a faint Yesterday / Today
divider. Only the person's own message wears a soft rounded bubble. This is the
"one flowing thread" we want.

**Dot** ([screen](https://mobbin.com/screens/77e8b18e-9982-4f47-80eb-25834ac75c7b)):
same move. The AI reply is one continuous block of generous, warmly set text on
a soft ground, a quiet "Today 9:04 AM" divider, the user message plain and
right aligned. No boxed cards anywhere.

**Meta AI** ([screen](https://mobbin.com/screens/87770f07-d7e4-4b3d-a837-d72859df7521)):
the assistant answer flows as plain text with light bullet structure, no card
around it. Confirms the direction: structure comes from spacing and type, not
from boxes.

Away from us: WhatsApp's Biggie Buddy and Cleo both box every line in a hard
bubble with a shadow, the exact stacked-cards look we are moving off.

## GC translation (shipped this session)

DiGi now speaks as one soft butter bubble (var(--terracotta-lt)) per reply, its
separate thoughts set apart by generous spacing (13px gaps) rather than by
separate white boxed cards with drop shadows. Warm Nunito, 16.5px, line height
1.6, on the cream messages ground, the same calm feel as DigiWelcomeSheet. Only
the parent's own message keeps the solid butter bubble, on the right. The
header eyebrow reads "Your evidence led guide" (was "Your AI advisor"), and the
calm "Reflection saved" footer is kept. The loading dots and the empty state
greeting were softened to the same butter bubble so the whole thread reads as
one voice.
