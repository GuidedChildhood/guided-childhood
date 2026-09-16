# The second parent

**Justin, 16 September 2026: "what if mum and dad want access, what would be
the best way for 2 parents to access this and stay updated?"**

**THIS IS A PLAN, NOT A CLAIM. Justin: "lets plan it but hold it if big job
until we get asked." Nothing here is built. Do not open a PR for it and do not
start Phase 1 because it looks small. It waits for a family to ask.**

## What he wants it to do

His own list, in his words, and it is not a viewer:

- manage quests
- get push, and the installed app on both phones
- add to calendar for both parents
- co watch lessons
- access to DiGi, and DiGi records who asked
- access to the scripts
- the passport, seen but not run
- and the second parent's access dies when the subscription does

## The answer to the first question, and why it changed

The first instinct was a token link, the same trick as the child's phone at
`app/k/[token]`: no account, no password, no second subscription. That is the
right answer to "let dad watch" and the wrong answer to this list.

Push notifications are stored per user (`push_subscriptions.user_id`). DiGi
recording who asked needs somebody to be asked about. Managing quests means
writes, and a token that can write is a password with no way to change it. All
three need dad to be somebody, not a link.

So: **the second parent has his own login and joins one family.** Decided by
Justin, 16 September 2026, from four options.

## The piece of luck, and it is the whole shape of this

Nearly every child scoped table in this database guards itself with the same
expression:

    exists (select 1 from public.children c
            where c.id = child_id and c.parent_id = auth.uid())

Five policies, written independently, all spelling out the same sentence. That
is normally the thing you complain about. Here it is the gift, because it means
there is **one sentence to change**, not sixteen migrations:

    create function public.can_see_child(uuid) returns boolean

and every policy becomes `where public.can_see_child(child_id)`. One function,
one place, and the child scoped half of the product follows at once.

**`children.parent_id` does not move.** It keeps meaning the owner, the parent
who pays. Membership is an overlay on top, not a rewrite underneath, so no
existing family is touched, there is no backfill, and a one parent family after
this change is byte for byte a one parent family before it. Every plan that
starts by migrating `parent_id` to a `family_id` is a week longer and breaks
things that work today.

## The three tables that do NOT follow, and why

The helper covers anything keyed to a child. These are keyed to a person:

1. **`family_quests.user_id`** references `auth.users` directly, not the child.
   So today dad would log in and see none of mum's quests, which is the first
   thing on his list. This is the one real data model change and it is where
   the risk in this plan lives.
2. **`push_subscriptions.user_id`** is per person, which is CORRECT and already
   supports two parents. Nothing changes here. What changes is `lib/push/send.ts`,
   which filters `.eq('user_id', userId)`: a family send has to fan out to every
   member rather than to the owner.
3. **The `digi_*` tables** already carry `user_id`, so "DiGi records who asked"
   arrives free the moment dad has an account. The work is on the READ side, so
   that mum can see what he asked and he can see what she asked.

## The gate: access dies with the subscription

Justin: "dad shared link needs to also stop working if subscription not paid".

`middleware.ts` reads the caller's own profile:

    .from('profiles').select('subscription_status, ...').eq('id', user.id)

For a second parent that is the wrong row: his own profile will never say
active, because he is not the one paying. It has to read the OWNER's profile.
One change, one line, and it gives exactly the behaviour asked for, since the
gate is already in front of every protected route rather than sprinkled through
the pages. When mum stops paying, dad meets the upgrade screen on his next tap,
with no special case written anywhere.

The same rule has to reach the calendar feed in Phase 3, which is a token URL
and therefore outside the middleware. A feed that keeps delivering after the
card is declined is a subscription nobody needs to renew.

## What each parent can do

Decided by Justin, 16 September 2026.

| | Owner (pays) | Second parent |
|---|---|---|
| Billing, plan, cancelling | yes | **no** |
| Quests, DiGi, lessons, scripts, passport, push, calendar | yes | yes |
| The pathway | sets and changes it | **sees it, never has to run it** |

Justin on the last one: "with one but does not need to know about doing pathway
just see it". So the pathway is not hidden from him, it is simply not his job.
Read as: `children.stage_id`, `children.age_band` and the setup answers are
shown to both and editable by the owner.

## Three open questions, and what I would do

**1. As answered, either parent can remove the other.** Only billing was ticked
as owner only, so invite and remove are shared. That means the parent who does
not pay can remove the parent who does, from her own family. I do not think
that is what was meant, and one rule fixes it without taking anything back:
**the owner cannot be removed by somebody the owner invited.** Both parents can
still invite, both can still remove a second parent, and the payer cannot be
locked out of the thing she pays for. Needs a yes before Phase 1.

**2. The family deal.** It is signed by a parent and a child and it is not the
pathway, so the table above does not decide it. Recommendation: the second
parent sees it and can talk it through, and changing signed clauses stays with
the parent who signed. Flagged rather than assumed.

**3. Removal has to be instant.** A separation is the case this feature will
meet at its worst. Removing a second parent must end the session, delete his
push subscriptions and kill his calendar feed token in the same transaction,
not at the next login. Write it that way first, because retrofitting it is the
kind of thing that gets discovered by the wrong person.

## The build, in the order it should happen

**Phase 1, the spine.** `family_members` (owner_id, member_id, role,
invited_at, accepted_at, unique on the pair). `can_see_child()` and the five
policy swaps. Middleware reads the owner's subscription. Invite by email, a
link, an accept screen that joins rather than creates a family. Guard:
`scripts/check-second-parent.mjs`, mutation tested, proving a member cannot see
a child of a family they are not in, and that removal is instant.

**Phase 2, the things he listed.** Quests family scoped, which is the awkward
one. DiGi history family scoped. Push fanned out to both parents.

**Phase 3, the calendar.** Quests and review dates as a per parent feed their
own phone calendar subscribes to. Justin chose this over building a calendar,
and it is the right call: it lands "both parents stay updated" in days, using
the calendar they already look at, rather than asking them to look at ours.

**Not now: our own calendar, with the tick for whether an entry appears on the
child's phone.** It is a good idea and it is a feature in its own right, easily
the biggest thing on the list. It is written down here so it is not lost.

## Risk

The honest one: this touches the sentence that decides who can see a child.
Get `can_see_child()` wrong and one family sees another family's children. That
is the worst bug this product could have, worse than any outage, and it is why
Phase 1 carries a mutation tested guard before anything in Phase 2 is written,
and why `parent_id` deliberately does not move.

Second: `family_quests` is the only table needing real surgery, so if Phase 2
slips, Phase 1 still stands on its own and dad can already see the passport,
the lessons, DiGi and the scripts.
