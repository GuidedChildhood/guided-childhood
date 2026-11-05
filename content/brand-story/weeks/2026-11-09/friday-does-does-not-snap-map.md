# Service Friday · Snap Map: does, does not, the words

**Format 1, Does. Does not. The words.** From `format-playbook-family-it-guy.md`.
The shape of his biggest Reels (one control, what it does, what it does not),
with the third part he never gets to: the words, and the step the child takes.

**Status: draft.** Needs Justin to film 45 seconds, and the setting re checked
on a real phone the day before (see the review). Carries the week's comment gate.

**Proposed date:** Friday 13 November 2026, 19:30.

---

## Instagram (Reel)

**On screen, frame one:** SNAP MAP. WHAT GHOST MODE DOES.

**Caption:**

> Snap Map shows your child on a map to the people they have added. One
> setting, Ghost Mode, hides them from all of it.
>
> What that setting does, and what it leaves undone:
>
> 1. It hides your child's location from the map, for everyone on their list.
> 2. It does not choose who gets added in the first place.
> 3. It does not stay done. Friends lists grow, and this one quietly undoes itself.
> 4. It does not tell your child why any of it matters.
> 5. The part no setting does: scrolling the friends list together and counting who they have actually met.
>
> The toggle hides the map today. Knowing who is on that list is the part
> they keep when the settings are theirs.
>
> How many names on your own friends list could you put a face to?
>
> Comment PACK and we will send you the stage check. Three questions, no sign up.

## Facebook

> Snap Map shows your child on a map to the people they have added. There is
> one setting that does more than any other on Snapchat, and it is called
> Ghost Mode. It hides your child's location from everyone.
>
> It is worth doing tonight. It is also worth knowing what it leaves undone.
>
> 1. It hides your child's location from the map, for everyone on their list.
> 2. It does not choose who gets added in the first place.
> 3. It does not stay done. Friends lists grow, and this one quietly undoes itself, so it is worth looking again in a month.
> 4. It does not tell your child why any of it matters.
> 5. The part no setting does: sitting down together, scrolling the friends list, and counting how many of those people your child has actually met. Almost every child finds names they cannot place.
>
> The words we wrote for this start with "Come and look at this with me", and
> they stay calm, because the fix is simple and fear only makes a child hide
> the next thing.
>
> The toggle hides the map today. Knowing who is on that list is the part
> they keep when the settings are theirs.
>
> How many names on your own friends list could you put a face to?
>
> What stage is your child? Three questions, no sign up:
> https://guidedchildhood.com/starter-pack

---

## The film, 45 to 55 seconds

Justin, the kitchen corner, phone at eye level, portrait. Captions always,
silent by default. The same corner every time from now on, so the set becomes
recognisable (his move, our kitchen).

| Time | Picture | Words (spoken, captioned) |
|---|---|---|
| 0 to 6s | Justin to camera. Hook plate on from frame one | "Snap Map shows your child on a map to everyone they have added. One setting hides them." |
| 6 to 16s | Real screen recording on a **test account**, never a child's: Snap Map, the gear, Ghost Mode on | "It is called Ghost Mode. Snap Map, the gear, Ghost Mode on." |
| 16 to 30s | Justin. Each line lands as a plate | "What it does not do. It does not choose who gets added. It does not stay done, because friends lists grow. And it does not tell your child why it matters." |
| 30 to 44s | The real script deck in our app, pushed in on the line to say, under a band | "That part is a conversation. The words we wrote start with: come and look at this with me." |
| 44 to 50s | End card | Eyebrow: SOCIAL MEDIA? Then: What stage is your child? Three questions, no sign up. See what to do tonight. The film's own `/v/` link. |

The spoken words are a guide. Justin says it his way, and the captions follow
what he actually says.

---

## Proof path

- **The setting and what it does:** the Snapchat row in the platform guides,
  `supabase/migrations/093_social_platform_guides.sql` line 134 ("Snap Map,
  gear, Ghost Mode on, so location is hidden from everyone") and line 140,
  shown to parents at `/dashboard/social-settings`.
- **"Quietly undoes itself" and the friends list count:** the script "Snap Map
  is showing where they are", `supabase/migrations/180_platform_scripts.sql`
  (sort order 9602, explorer stage, in the `scripts` table). Its say this line
  opens "Come and look at this with me", and its check back line is the
  friends lists grow line.
- **The stage check:** `/starter-pack`. The end card eyebrow is the worry tile
  "Social media" in `lib/pathway/challenge-labels.ts`.

## Checks

- Allow or deny: none. Ghost Mode is offered as worth doing, never as a rule,
  and the close is a consequence.
- Platform as main character: the post ends on the child counting their own
  list.
- Dashes: none. Run `npm run ai-tells` on this folder.
- Script 9602 is a paid script (`is_free` false), so the film shows one line
  of it, never the whole page.
