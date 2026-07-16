# Quests page redesign — the parent control centre

Justin's brief (16 July): tidy the whole Quests section into a professional,
easy to read, easy to operate dashboard. Big buttons, clear icons, clear
explanations. Reference patterns (from the earlier Mobbin pull): GoHenry
(one big number, one action), Greenlight (chores vs allowance split), Finch
(progress loop with celebration). Mobbin was offline the day of this brief;
reconnect and pull fresh screens before final polish.

## The problems today

- The top summary reads flat: tiles are not obviously tappable, icons are
  plain, stars vs time is static.
- No live signal when a child is actually on their device time.
- Ping presets are thin, and send to child does not show what is already done.
- Share, offline pack, and QR are buried and wordy.
- Four tabs (Quests, Rewards, Games, Share) with no front door that explains
  what each is for.

## The new shape (mobile first)

1. **Control centre header** (rebuilt StarSummary)
   - One big number: stars, and the minutes they buy, per child.
   - Three tiles, clearly tappable, nicer icons:
     - Waiting for your yes → taps through to the approve list
     - To do today → taps through to the tasks list
     - Stars and time left → dynamic from the child's app, tap to adjust the
       stars to minutes rate so it can be tuned.
   - **Live device timer:** when the child taps their device time, an active
     countdown appears here (and in the PWA), so the parent knows they are
     watching right now. Placeholder ready for the native app.

2. **DiGi screen time balance insight** (new card)
   - Age aware recommended balance across screen, play, games, chores.
   - Says if the child is on track, or if the evidence suggests less, and
     nudges on time of day (wind down in the evening). Dynamic per child age.

3. **Front door: four big buttons with icons + one line each**
   - Quests (set tasks) · Rewards · Set up · Share (with the QR code)
   - Each explains itself so a first time parent knows where to go.

4. **Ping phone**: more presets, in the parent's real words:
   - You can watch now · Please finish your chores first · Time to come off
     the screen · Dinner in ten minutes · Homework time · Please come down.
   - Plus the free text box that already exists.

5. **Send to child**: shows a tick when already sent or done, stays available
   when not. Tidier row.

6. **Offline pack + message system**: pulled up and made prominent, not buried
   under the phone option.

## Build order (shippable slices)

- **Slice 1 — Control centre header + front door** (biggest visible win):
  rebuilt summary with tappable tiles, live timer slot, stars to minutes
  adjuster, and the four big labelled buttons.
- **Slice 2 — DiGi screen time balance insight** card, age and time aware.
- **Slice 3 — Ping presets + send to child tick/available + offline pack
  prominence + share/QR polish.**

Each slice ships on its own so the page improves in steps, never a big bang.
