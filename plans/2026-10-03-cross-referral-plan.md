# Refer a friend across both services, £5 after two months (3 October 2026)

Justin, 3 October 2026: "best way for both services, SB and GDA, to be able
to refer, £5 transferred once [the friend] stays 2 months."

Status: analysis, nothing built. Decisions needed are at the bottom.

## What exists today

- No referral system in Guided Childhood. The growth plan named one
  (migration "029 referrals") but 029 became family quests and referrals
  were never built.
- Guided Childhood and The Social Billboard are separate companies with
  separate Stripe accounts (decided 9 and 13 August 2026). The Social
  Billboard code is not in this repo and not reachable from this session.
- Guided Childhood prices: Founder £7.99, Standard £12.99 a month, Annual
  £99. Four day trial.

## What the evidence says works (added 3 October, Justin: "a referral system proven to work")

| Finding | Source | What it means for us |
| --- | --- | --- |
| Referred customers were worth at least 16% more, and left about 18% more slowly, than similar customers who came another way. About 10,000 customers tracked for nearly three years. | Schmitt, Skiera and Van den Bulte, Journal of Marketing 75(1), 2011. Peer reviewed, won the MSI Paul Root award. A German bank, not a subscription app, so a direction rather than our number. | Paying £5 for a referred family is worth it, because they are the families most likely to stay. |
| Rewards make people more likely to refer. With close friends and stronger brands, giving at least part of the reward to the friend works better than rewarding only the person who shares. | Ryu and Feick, Journal of Marketing 71(1), 2007. Four experiments. | Parents send this to close friends on WhatsApp. That is a strong tie, so the friend has to get something too. |
| Both people got the same reward, in the product itself: 500MB of storage each. The company attributes about 35% of daily signups to it and growth from 100,000 to 4 million users in 15 months. | Dropbox's own figures, reported in growth case studies. Company reported, not independent, and other things drove growth too. | Give to both sides, make the reward part of the product, and put the invite where people already are. |
| £50 credit for you and £50 for your friend, paid as account credit rather than cash. | Octopus Energy's published terms. It is the best known UK example. Octopus has not published how many customers it brings in. | Both sides getting something is the proven part. Octopus pays in credit; we start with cash (see point 2) because few of our referrers have a bill yet. |

**What the evidence changes in the design.**

- **Both sides get something.** This was optional before. It is now the core:
  "Give £5, get £5". The friend gets £5 off their first month. You get £5 off
  your bill once they have stayed two months.
- **The reward.** Cash to start (point 2). Credit on the bill, like Octopus, can be added later for paying customers.
- **Ask at the right moment, inside the app.** Put the invite where a parent
  has just felt it working rather than only in settings. Moments to use:
  - a worry marked sorted;
  - a star quest finished;
  - a week of check ins.
  This placement is practice from Dropbox, not a measured finding.
- **Make the wait visible.** The person who shared sees each friend as
  "joined" and then "£5 lands on 3 December", so the two month wait reads as
  progress rather than silence. The worked examples do this.
- **Measure from day one.** Count links tapped, sign ups, and still paying at
  two months, so within a month we know if it is working for us rather than
  for a bank in Germany.
- **Not yet:** tiered rewards for five or ten referrals. That is for later,
  and only if the simple offer is working.

## Recommendation

**1. One code per person, working on both sites.** A short code, for example
`JUSTIN5`, created the first time a paying customer taps Share. The same code
is accepted at either checkout. The code carries no personal data, so the
two companies never have to swap customer details to make it work.

**2. The reward is £5 cash, paid by PayPal (changed 3 October).** Justin:
"isn't cash a good start". Yes, and for us it is the better start, for three
reasons:

- **Anyone can refer, not only paying customers.** We have few paying
  families today, and credit only works for people with a bill. With cash,
  others can join in: a teacher, a parent group admin, a grandparent, a Social
  Billboard fan. That is a much bigger pool of people who might share.
- **It removes the money between the two companies.** Whichever company gains
  the customer pays its own £5 straight to the person who shared. There is no
  monthly settling up and no recharge to explain to the accountant.
- **£5 cash is the simplest offer to understand.** Nobody has to work out
  what a credit is worth.

What cash costs us:

- **An email address for PayPal.** Nothing more: no bank details.
- **A small fee per payment.** Check PayPal Payouts' current UK fee when we
  set it up.
- **One payout run a month.** We export a list, then upload it to PayPal in
  one go.
- **Record keeping.** Each payment is logged as a marketing cost.

Credit off the bill stays as a later option for paying customers who would
rather have it.

The friend still gets £5 off their first month (point 5). We never hand cash
to a new customer, only to the person who shared.

**3. "Stays two months" means the friend's second paid monthly bill.** The
trial does not count, a refund cancels it, and the friend must still be
subscribed. Annual: 60 days after they pay. Stripe tells us the moment that
second bill is paid, so the £5 is marked owed the same minute. It goes out in
that month's PayPal run, with no checking by hand.

**4. Across the two companies.** One code works on both sites. The company
that gains the customer pays the £5 itself, straight to the person who shared.
No money moves between the two companies.

**5. The friend gets £5 off their first month.** This is core, not optional.
See the evidence above. It is a Stripe coupon tied to the code, so it is cheap
to build.

**6. Rules that stop gaming.**

- Anyone over 18 can sign up for a code: a name and a PayPal email.
- No self-referral: the same email, the same card or the same household is
  blocked.
- Each new customer can earn a reward once.
- No yearly cap (Justin, 3 October). Every £5 is only paid after the friend has paid us twice, so each payout already earns more than it costs. A big referrer is a good thing. Instead of a cap, anyone earning more than ten rewards in a month is looked at by hand before that month's PayPal run.

**7. The advertising rule.** UK rules (CAP Code rule 2.1, ASA and CMA
guidance) say a post sharing a referral link is advertising and must say so.
The ASA has held the company responsible for what customers post with its
codes. So the share message we write for them says it plainly: "I get £5 off
if you join." The terms go on one short page.

**8. Privacy.** A line in both privacy policies covering two things. A
referral code works across the two services, and only the code is shared,
never the person. We also keep the PayPal email of anyone we pay, only for
paying them.

## Why not a referral tool

Rewardful, the usual Stripe referral tool, starts at $49 a month for one
campaign and pays out by PayPal or Wise. That is close to $100 a month for two
Stripe accounts, before a single referral. At our size, building it costs less
and a PayPal list once a month is all the payout we need.
Worth revisiting past a few hundred referrals a month.

## Size

- **Guided Childhood side:** one to two days.
  - A migration for codes and referrals.
  - The code at checkout.
  - The Stripe webhook marking £5 owed on the second paid bill.
  - A Share card on Home with the disclosure line, and a simple page where
    anyone can get a code.
  - The terms page and the monthly PayPal payout list.
- **Social Billboard side:** the same pattern in its own codebase, which needs
  its repo added to a session.

## The Social Billboard side, with little or no code

The Social Billboard is hosted on Hostinger and its code is not in this repo.
It can still join in.

- **No code: Stripe promotion codes.** If it takes payment through Stripe,
  each referrer gets a promotion code in the Stripe dashboard, for example
  `JUSTIN5`, worth £5 off the first month. Stripe shows which customers used
  each code. Once a month, someone checks which of those have paid twice and
  pays the referrer by PayPal. That is about ten minutes a month at our size.
- **Claude making the changes.** This needs one of two things:
  - the site's code in a GitHub repo this session can reach, which is the
    cleanest route, and Hostinger can deploy straight from Git;
  - or, if it is a Hostinger Website Builder or WordPress site, the no code
    route above, or a referral plugin.

## Decisions (3 October)

1. Give £5, get £5, cash by PayPal: **agreed**.
2. Cap: **none**, with a hand check on anyone earning more than ten rewards in
   a month.
3. The Social Billboard: depends on what it is built with and how it takes
   payment (see above).
4. Tell the accountant the business will pay small referral rewards by
   PayPal, so they record them as a marketing cost. One email.

Sources: Schmitt, Skiera and Van den Bulte 2011 (Wharton faculty PDF);
Ryu and Feick 2007 (Baylor summary); Dropbox case studies (saasquatch.com,
referralrock.com); Octopus Energy referral terms (octopus.energy); Rewardful pricing and payouts (rewardful.com, stackscored.com);
ASA and CMA influencer guidance (rpclegal.com); the ASA ruling on referral
codes shared by customers (marketinglaw.osborneclarke.com).
