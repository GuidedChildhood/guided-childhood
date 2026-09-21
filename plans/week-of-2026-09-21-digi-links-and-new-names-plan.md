# DiGi links and new names (21 September 2026)

Justin, from his phone, on a DiGi answer about Olga:

> "Digi links to starter pack in response but this is already a sign up so
> although great to link to relevant card we don't need to offer starter pack
> just log as moment would of also been good. Note I asked a question with a
> different name than the child we set up so the reminder on home screen has
> name of another child which is ok but we should be clever enough to ask if we
> want to add another child as noticed new name?"

## 1. The card link takes a member to the app, not the shop window

WHAT HAPPENED. DiGi's reply ended `[Slow to get ready](/m/5f9fd0a0...)`. That
route is the PUBLIC share page for a moment card: the page a stranger opens
from a WhatsApp forward. It ends with "Get your free starter pack" and
"Already a member? Log in". Justin is signed in and mid trial, so the one tap
he took out of a good answer landed him in the funnel.

The link itself is right and worth keeping: the card genuinely fits. Only the
destination is wrong.

- `app/api/digi/route.ts` hands DiGi `/m/ID` for moment cards. It becomes
  `/dashboard/moments?card=ID`, the same card inside the app, where I tried
  this, Make it a quest and Ask DiGi live.
- `/dashboard/moments` learns `?card=`, leading the grid with that card the
  way DiGi's daily pick already does.
- `app/m/[id]` keeps the starter pack for the stranger it was built for, and
  shows a member "Open it in your app" instead. A shared link opened by
  someone who already pays should never sell them the thing they bought.

## 2. A name we have not met

Justin asked about Olga. The only child set up is Timbotee, so every follow up
since says "when Olga gets her ten minutes" beside a child who does not exist
in the app. He is right that this is fine, and right that we should notice.

- `lib/digi/new-name.ts`: pull first names out of what the parent typed, drop
  anything we know (the children, the DiGi squad, apps, brands, days, places,
  the ordinary words of English that happen to be capitalised), and require a
  family cue near the name (an age, a my, a she, a brother) before we believe
  it is a child. Two signals, so a teacher called Miss Davies or a game called
  Roblox never produces the offer.
- A quiet chip after the answer in DiGi, and under the follow up question on
  Home: "Add Olga". It goes to the add child form with the name filled in
  (`/dashboard/quests?add_child=Olga`), which is the form we already have.
- Never a modal, never a block. An offer a parent can ignore forever.

## Guards

- `scripts/check-new-name.mjs`: the detector's rules, including the ones that
  must NEVER fire (Roblox, Minecraft, TikTok, Monday, Christmas, London, Mum).
  Node builtins only, runs in concern-guards.

## Not in scope

The follow up question itself keeps saying Olga. It is a true record of what
the parent asked, and rewriting history to use a registered child's name would
be worse. Adding the child is what fixes it, which is what the offer is for.
