# Launch morning list — the queue and what shipped

**Living list, started 15 July 2026.** What is done, what is next, and the
decisions taken so nothing is lost between sessions. Newest work at the top.

## Shipped this morning (PR 283, branch claude/continue-build-ldot8v)

- **Approve bug fixed.** Approving a quest the child already ticked now
  promotes their pending tick instead of leaving a duplicate in Waiting on you.
- **DiGi prompt cards** made easy to read: white editorial card, bigger
  character tile, clear eyebrow and title, roomy body, one chunky button.
- **Custom pings to the child's phone.** More presets (turn the TV off, start
  homework, come downstairs) plus a free text box to send any quick message.
- **Printables earn step made plain on the child app.** After colouring a
  sheet the child taps *I finished it, show my grown up*, which sends the
  approval so the stars land. Quiet *no printer* fallback to ask a grown up.
- **School alerts escalate as the time nears (migration 056, due_time).**
  - A school action can carry a written time (dentist at 09:00, assembly 14:30).
  - Parent card: calm days out, turns to Today, then red with a soft pulse in
    the last hour, and an overdue state once it passes.
  - The written time flows into the calendar file, so the event lands at its
    real time, not a blanket 7:45.
  - Home Screen badge now counts school reminders that reached their day, so
    the red number appears when it matters.
  - Child's own screen: a *From school today* banner that goes red as a timed
    reminder nears, so it reaches the child, not only the parent.

## Next up (built but not yet, ranked)

1. **Character happy moments (Justin's Happy News idea).** One reusable
   pop up: a character (DiGi, Oliver, Sophia, Pop, a UK animal) slides up with
   a speech bubble and a soft confetti burst to deliver good news, quest
   approved, page earned, printable finished, streak day. Reference style is
   The Happy News by Emily Coxhead, cosy, hand drawn, rainbow, cute animals.
   Build the animation framework first on the existing DiGi art, swap in the
   new illustrations when Higgsfield is reconnected (it disconnected mid
   session).
2. **School email auto pickup, version one.** A forward to address so a parent
   forwards school emails and the server turns them into timed reminders. No
   logins. Pairs with the escalation above. Gmail/Outlook connect is a later,
   bigger version.
3. **Surface the new features to users and marketing.** A simple in app
   *What's new* note and a marketing list, so families and prospects know
   these useful things exist (custom pings, timed school alerts, printables
   earn loop, device time, the passport).
4. **Multiple children.** The proper multi child build: per child switching
   across quests, device time, school, passport. Dedicated piece.
5. **Email funnels expansion.** Win back for dead trials, feature announcement
   emails, an editorial nurture bank (via the content engine skill), a blog
   page. See email-programme-plan.md.
6. **Optional lesson taste strip** on the marketing and schools pages, real
   lessons not placeholders, so parents and heads get a feel before signing.
7. **Founder signup ping** to Justin's phone (Stripe app, plus an optional in
   product webhook alert).

## Decisions taken (also in decisions.md)

- **Parent PIN: not now.** The kid link is already sealed from parent data by
  its token. The real risk is a child on a shared phone self approving; a short
  parent PIN on Approve, Start device time and Settings would cover it, but
  Justin said no for launch. Revisit if it becomes a problem.
- **Real device blocking is a phase two, not launch.** The timer is a trust and
  agreement tool: countdown and alarm on both phones, it nudges hard, it does
  not lock the device. True blocking needs Apple's Screen Time API (iPhone
  only, special Apple entitlement, real build) or a router/network product (all
  devices, big lift). Noted for the future, not a launch blocker.
- **iPhone app does not read school emails.** Apple sandboxes the inbox; the
  app cannot see Mail. Email pickup is a server feature (forward to address)
  that works the same on web or app. The app's job is reliable delivery:
  dependable alarms, the Home Screen red badge, lock screen notifications.

## Justin's manual tasks

- Run migrations 054, 055, 056 in Supabase (053 already done).
- One live Stripe test purchase to confirm the paywall end to end.
- Share the domain name and which existing HTML pages must carry over at go
  live (subdomain first, then apex).
- The free tier conversation with his wife.
