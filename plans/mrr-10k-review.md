# The £10k MRR review — does what we built solve a problem, and what is missing

**Date:** 2026-07-01
**Question asked of every feature:** does this solve a real problem a parent will pay to make go away?
**Target:** £10,000 MRR within 8 months of launch.

## The maths first

At £12.99 a month, £10k MRR is about 770 paying families. With the mix we actually expect (50 founders locked at £7.99, a chunk on the £99 annual which is £8.25 a month equivalent), call it **800 paying families**. Working backwards at a 4 percent free to paid conversion, that is roughly **20,000 free signups over 8 months**, or 2,500 a month. That number is the whole game. Everything below is judged against it.

## Verdicts, feature by feature

**Scripts.** Solves a real problem: "I do not know what to say tonight." This is the core product and the reason to pay. Strongest asset. The gap is coverage confidence, which is exactly what the Day 2 expert audit fixes. Verdict: keep, deepen.

**DiGi.** Solves the 11pm panic Google search. It is the differentiator against every static advice site, and the free cap of 3 messages a day is the right paywall pressure point. Verdict: keep, this is the headline.

**The pathway with blended progress.** Solves orientation: "am I doing this right, am I behind." Parents pay for reassurance as much as answers. Now that progress is real data, it works. Verdict: keep.

**Daily moments.** Solves nothing on its own, but it is the habit loop that makes people still be here in month 3, and churn is where subscription businesses die. Verdict: keep, it is retention infrastructure.

**Device hub.** Solves an acute, searchable problem: "how do I set up my kid's iPhone." High purchase intent, high SEO potential. Verdict: keep, and it should become 40 landing pages (see gaps).

**Wellbeing tracker.** Half a verdict. Logging feelings is not a problem parents wake up with. It only earns its place because DiGi now reads it and the pathway scores it. Never market it standalone. Verdict: keep as fuel for DiGi, not as a feature.

**Lessons.** Does not solve anything yet, it is scaffolding. Today's slide player build is what turns it into "my child is actually learning digital literacy," which is the thing schools and the narrative section promise. Verdict: build it (in progress today).

**Starter pack quiz.** Solves our problem, not the parent's: it converts anonymous traffic into known families. It is good. Verdict: keep, add an email capture consequence (see gap 2, it currently converts to a signup or to nothing).

**Marketing pages (join, schools, homepage).** The homepage now makes the argument. Schools is a real B2B door. Verdict: keep, but they are worth zero until merged and live.

## The honest problems

1. **None of this is live.** Every improvement of the last two weeks sits on PR 43. Revenue from unmerged code is £0. Shipping is the highest leverage act available, nothing else on this list is worth anything until it happens.

2. **There is no email system. At all.** No welcome email, no drip, no weekly digest, no abandoned quiz follow-up, no founder rate urgency, no receipts beyond Stripe defaults. For a freemium product this is the single biggest missing revenue lever: most conversions happen in emails sent on days 2 to 14, not in the app. Add Resend, then five emails: welcome with first script, day 2 stage guide, day 4 DiGi nudge, day 7 founder rate with live counter, weekly digest with the child's progress bar. This is a one day build that plausibly doubles conversion.

3. **The paywall promises a feature that does not exist.** The upgrade page sells "the family agreement builder." It is not built (it is the Day 3 plan). Either build it Day 3 as planned or pull the line from the page before launch. A parent who pays and cannot find it refunds and leaves.

4. **No annual push at the moment of payment.** £99 annual is 8 months of target MRR banked up front and dramatically lower churn. The checkout should default to annual with monthly as the downgrade, not the reverse.

5. **Distribution is one channel deep.** The plan is effectively "Justin's LinkedIn." It is a good channel (the literacy post format works) but 2,500 signups a month needs three engines:
   - **LinkedIn engine:** the LITERACY lead magnet already teased in the post. Gate the schools framework PDF behind an email, every viral post feeds the list.
   - **SEO engine:** the device hub should become individual public pages ("set up an iPhone for an 11 year old", one per device times age band). That is 40 plus pages of high intent search traffic, and the content already exists in the database. Same for one public script page per problem ("what to say when your child will not hand over the phone at bedtime"). This is the compounding channel; it needs to start now to pay off by month 6.
   - **Schools engine:** one school pilot is 200 to 800 parent households reached with institutional trust. Two pilot schools at a 10 percent parent signup rate is 100 plus families a month. The schools page exists; what is missing is the pilot offer (free for the school, parents get 20 percent off) and a founder-led outreach list.

6. **No referral loop.** Scripts are inherently shareable ("someone sent me the exact words"). A share button that renders a script as a clean image card with the logo is a viral loop that costs nothing. Small build, real compounding.

7. **Activation is unmeasured.** The moment that predicts payment is almost certainly "read first script within a day of signup." Nothing currently measures or engineers toward it. The onboarding should end by opening the recommended script directly, not the dashboard.

## What £10k in 8 months actually looks like

- Months 1 to 2: launch, founder rate fills from LinkedIn. 50 founders plus early annuals, roughly £700 to £900 MRR.
- Months 3 to 5: email drip live, SEO pages indexed, first school pilot. 150 to 250 net new payers. £3k to £4k MRR.
- Months 6 to 8: SEO compounding, second and third school, referral loop. £10k needs roughly 120 net new payers a month by this window. Tight but real, and it fails without gaps 1, 2, and 5 closed.

## Build order implied

1. Ship PR 43 (Justin's call, everything waits on it)
2. Email system (one day, biggest conversion lever)
3. Lessons slide player (today, makes the literacy promise true)
4. Family agreements (Day 3, makes the paywall honest)
5. Public SEO pages from device and script data (the compounding channel)
6. Script share cards (the viral loop)
7. Annual-first checkout ordering
