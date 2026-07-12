# The launch runbook — the easy step by step guide

**For:** Justin. **Written:** 2026-07-11. **Voice:** plain, no dashes.

This is the do this, then this guide to getting Guided Childhood live and taking real money. You do not need to code. Every step tells you three things: **who does it**, **exactly what to do**, and **done when**. Where a step needs building, you copy the grey brief into a fresh Claude session and it does the work. Where a step is your accounts or your money, only you can do it, and I have made those as click by click as I can.

Two labels you will see:
- **YOU** means only you can do it (accounts, cards, domains, your decision).
- **ASK CLAUDE** means paste the brief into a new Claude session and let it build, then come back.

Work top to bottom. Do not skip. Tick the box when a step is done.

---

## The map, in one breath

You will get the six accounts, paste their keys into Vercel, set up the prices in Stripe, ask Claude to finish the two launch blockers, point the domain, do one test purchase to prove money works, run a small closed beta, then open the founder 50 to the public. Then you turn on the growth engine. That is the whole thing.

There are three products. Launch them in this order:
1. **The parent platform** (guidedchildhood.co.uk). Your main money. This runbook is mostly about this.
2. **The Digital Health Report** (wellbeing.guidedchildhood.com). Already a real paid product. It just needs linking, which is done.
3. **The schools product.** A later door. Do not let it hold up the parent launch. It gets its own short section at the end.

---

## PART 1 — Get the six accounts and their keys (YOU)

You need six accounts. Most are free to start. Open a notes file called `keys.txt` on your computer and paste each key in as you get it. You will paste them all into Vercel in Part 2. Never put this file on the internet or in the repo.

- [ ] **1.1 Supabase** (the database and logins). Go to supabase.com, create a project. Open Project Settings then API. Copy three things into `keys.txt`: the **Project URL**, the **anon public key**, and the **service role key**.
      *Done when:* you have all three pasted in `keys.txt`.

- [ ] **1.2 Anthropic** (powers DiGi). Go to console.anthropic.com, create an API key. Copy it.
      *Done when:* the key starting `sk-ant` is in `keys.txt`.

- [ ] **1.3 Stripe** (takes the payments). Go to stripe.com, create an account. You can start in **test mode** (toggle top right). From Developers then API keys, copy the **secret key** and the **publishable key**. You will make the products and the webhook in Part 3.
      *Done when:* both keys are in `keys.txt`.

- [ ] **1.4 Resend** (sends the emails). Go to resend.com, create an account, create an API key. Copy it. Also decide your from address, for example `hello@guidedchildhood.co.uk`.
      *Done when:* the Resend key and your from address are in `keys.txt`.

- [ ] **1.5 Vercel** (hosts the site). Go to vercel.com, sign in with the GitHub account that owns the repo. You do not copy a key here, you just need the account. This is where everything gets plugged in.
      *Done when:* you can see the guided-childhood project (or can import it) in Vercel.

- [ ] **1.6 Push keys (VAPID)** (the phone notifications). The decisions log says you have already set these. If not, ask Claude: paste **"Generate a VAPID public and private key pair for web push and tell me the two values to paste into Vercel."**
      *Done when:* the two VAPID values are in `keys.txt`.

---

## PART 2 — Put the keys into Vercel (YOU, with Claude if stuck)

Every key from Part 1 goes into Vercel once, and the live site reads them. The full list of names the app expects is in `.env.local.template` in the repo. Here is the plain version.

- [ ] **2.1** In Vercel, open the guided-childhood project, then Settings then Environment Variables.

- [ ] **2.2** Add each of these, name on the left, your value on the right. Set each for Production.

      | Paste this name | The value is |
      |---|---|
      | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (1.1) |
      | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (1.1) |
      | `SUPABASE_SERVICE_KEY` | Supabase service role key (1.1) |
      | `ANTHROPIC_API_KEY` | Anthropic key (1.2) |
      | `STRIPE_SECRET_KEY` | Stripe secret key (1.3) |
      | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (1.3) |
      | `STRIPE_WEBHOOK_SECRET` | you get this in Part 3, leave blank for now |
      | `STRIPE_PRICE_FOUNDER` | you get this in Part 3 |
      | `STRIPE_PRICE_STANDARD` | you get this in Part 3 |
      | `STRIPE_PRICE_ANNUAL` | you get this in Part 3 |
      | `STRIPE_PRICE_SCHOOL_SMALL` | Part 3, or leave blank until schools launch |
      | `STRIPE_PRICE_SCHOOL_MEDIUM` | Part 3, or leave blank until schools launch |
      | `RESEND_API_KEY` | Resend key (1.4) |
      | `EMAIL_FROM` | your from address (1.4) |
      | `NEXT_PUBLIC_APP_URL` | `https://guidedchildhood.co.uk` |
      | `NEXT_PUBLIC_SOCIAL_MEDIA_LAW` | `partial_ban` (this is today's setting, per decisions) |
      | `CRON_SECRET` | make up a long random word, any 20 plus characters |
      | `DIGI_MODEL` | `claude-fable-5` |

      *Done when:* every row above has a value except the Stripe price and webhook rows, which you fill in Part 3.

---

## PART 3 — Set up the prices in Stripe (YOU)

This is where the money is defined. You make three products for parents (plus two for schools later). Do it in **test mode** first.

- [ ] **3.1** In Stripe, go to Product catalogue, add these three products. For each, add a recurring price and copy the **price ID** (it starts `price_`) into `keys.txt`.

      | Product | Price | Billing | Env name it fills |
      |---|---|---|---|
      | Guided Childhood Founder | £7.99 | monthly | `STRIPE_PRICE_FOUNDER` |
      | Guided Childhood Standard | £12.99 | monthly | `STRIPE_PRICE_STANDARD` |
      | Guided Childhood Annual | £99 | yearly | `STRIPE_PRICE_ANNUAL` |

- [ ] **3.2** Paste those three price IDs into the matching Vercel rows from Part 2.

- [ ] **3.3** Set up the webhook so the app knows when someone pays. In Stripe, Developers then Webhooks then Add endpoint. The URL is `https://guidedchildhood.co.uk/api/stripe/webhook`. Select the checkout and subscription events (if unsure, ask Claude: **"Which Stripe webhook events does app/api/stripe/webhook expect? List them."**). Save, then copy the **signing secret** (starts `whsec_`) into the `STRIPE_WEBHOOK_SECRET` row in Vercel.
      *Done when:* the three price rows and the webhook secret are all filled in Vercel.

> **Founder 50:** you do not enforce the cap of 50 by hand. The code counts active founders and hides the founder price at 50 (non negotiable 10, in decisions). You just make the price. The code does the guarding.

---

## PART 4 — Ask Claude to finish the two launch blockers (ASK CLAUDE)

Per `plans/go-live-plan.md`, almost everything is built and working. Two things stand between you and a public launch. Do these as two separate Claude sessions so each stays in one lane.

- [ ] **4.1 The paywall screen.** Right now upgrade just links out, there is no real paywall. Paste into a new Claude session:
      > **"Read plans/go-live-plan.md and plans/paywall-rebalance-plan.md. Build the real paywall screen: founder rate at £7.99, standard £12.99 monthly, annual £99, the 14 day trial timeline, and live scarcity showing how many of the 50 founder spots remain. Wire it to the Stripe prices in the STRIPE_PRICE_ env vars and to app/api/stripe/checkout. Follow every non negotiable in CLAUDE.md. Commit, push, open a draft PR."**
      *Done when:* the PR is open and you have looked at the screen.

- [ ] **4.2 The pathway as one journey.** Paste into a different new Claude session:
      > **"Read plans/pathway-redesign-research.md and plans/go-live-plan.md. Rebuild the pathway as one spine from age 4 to 16 with device settings, lessons and moments woven in. Follow CLAUDE.md non negotiables. Commit, push, open a draft PR."**
      *Done when:* the PR is open and you have looked at it.

- [ ] **4.3 Merge them.** Once you are happy, merge both PRs into main. Vercel redeploys in about a minute. Nothing is live for families until this happens (the honest headline in the MRR review: unmerged code earns £0).
      *Done when:* both are merged and the site rebuilt.

---

## PART 5 — Point the domain (YOU)

Your DNS lives at 123-reg. The records are already written in the build README.

- [ ] **5.1** In Vercel, project Settings then Domains, add `guidedchildhood.co.uk` and `www.guidedchildhood.co.uk`.
- [ ] **5.2** In 123-reg DNS, add: an **A record**, name `@`, value `76.76.21.21`; and a **CNAME**, name `www`, value `cname.vercel-dns.com`.
- [ ] **5.3** Wait for Vercel to show the domain as valid (can take up to an hour).
      *Done when:* typing guidedchildhood.co.uk loads your homepage over https.

---

## PART 6 — The one test that proves money works (YOU)

Do not launch until you have taken one pretend payment end to end. This is the single most important check.

- [ ] **6.1** With Stripe still in test mode, open your live site, sign up as a brand new parent, go through onboarding, and hit the paywall.
- [ ] **6.2** Pay with Stripe's test card `4242 4242 4242 4242`, any future date, any three digit code.
- [ ] **6.3** Confirm three things happen: the payment shows in your Stripe test dashboard, your account flips to the paid tier in the app, and you get the welcome email.
      *Done when:* all three are true. If any fail, paste the symptom to Claude: **"A Stripe test purchase did X but Y did not happen, here is what I saw."**
- [ ] **6.4** When it all works, flip Stripe from test mode to **live mode**, redo Part 1.3 and Part 3 with the **live** keys and price IDs (live and test keys are different), and update those rows in Vercel. Do one more real card purchase on yourself for a pound of confidence, then refund yourself in Stripe.
      *Done when:* a real card has paid and you refunded it.

---

## PART 7 — Closed beta, 10 to 20 real families (YOU)

Do not open to the public cold. Get a handful of real parents through it first.

- [ ] **7.1** Recruit 10 to 20 families from your network, a parenting group, and one school contact. Offer the founder rate free or discounted in exchange for honest feedback.
- [ ] **7.2** Send them a two minute Loom of the first run, or do a short onboarding call. Give one feedback channel, a WhatsApp group or a simple form.
- [ ] **7.3** Watch these five signals in week one: they finish setup, they come back on day 2, they send DiGi at least one message, they set up a quest, they read one script.
- [ ] **7.4** Collect their red pen. Fix the top few things (ASK CLAUDE with their exact quotes). Small fixes only, do not start new features.
      *Done when:* most testers hit most of the five signals and the obvious rough edges are fixed.

---

## PART 8 — Public launch, open the founder 50 (YOU)

- [ ] **8.1** Announce on your own channels first (LinkedIn, your list, parenting groups). Lead with the one line from `plans/marketing-message.md`: ten minutes a day turns the cliff edge at 16 into a gentle ramp.
- [ ] **8.2** Every link goes to `/starter-pack` (non negotiable 9). Point people at the three question stage check, not the pricing page.
- [ ] **8.3** Watch the founder counter fill. At 50 the founder price hides itself and standard shows. That is the code doing its job, not a mistake.
      *Done when:* the founder 50 is open to the public and the first outside payment has landed.

---

## PART 9 — Turn on the growth engine (YOU, then ASK CLAUDE)

The moment you are live, distribution is the whole game. Two plans are already written and waiting.

- [ ] **9.1 The paid creator engine.** Follow `plans/week-of-2026-07-11-starter-story-growth-plan.md`. First real step: DM two or three UK parenting creators with the win win win pitch, one video each, capped at £750 to £1,000, all pointing at the stage check. Watch the 48 hour spike.
- [ ] **9.2 The organic flywheel.** The stage card and referral loop in `plans/guided-digital-pathway-growth-plan.md`. Ask Claude to build the shareable stage card if it is not live yet.
- [ ] **9.3 Keep the email drip on.** The lifecycle emails in `plans/email-sequence-plan.md` are the biggest conversion lever after launch. Confirm the cron is running (ASK CLAUDE: **"Confirm /api/email/cron is scheduled and firing the lifecycle emails."**).
      *Done when:* first creator video is live, the stage card shares, and the emails are sending.

---

## The schools product (later, do not let it block the above)

Schools is a separate Stripe product on the same database (decisions, 27 June). Launch it after the parent platform is steady.

- [ ] **S.1** Make the two school prices in Stripe (`STRIPE_PRICE_SCHOOL_SMALL`, `STRIPE_PRICE_SCHOOL_MEDIUM`), paste the IDs into Vercel.
- [ ] **S.2** The free assembly pack is the top of the school funnel. Offer it for an email, no commitment.
- [ ] **S.3** Line up one pilot school (free for the school, parents get a discount). One pilot is 200 to 800 households reached with institutional trust.
      *Done when:* the assembly pack captures emails and one pilot is booked.

---

## If you only read one thing

Accounts, then keys into Vercel, then Stripe prices, then ask Claude to finish the paywall and the pathway and merge them, then point the domain, then do one test purchase, then a small beta, then open the founder 50, then turn on the creators. In that order. Do not start the next part until the current part's box is ticked.
