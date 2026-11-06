# Where Phones Sleep: evidence check (red team)

**Date:** 6 November 2026
**Piece:** the five lines in the brief (A to E), plus the built pack as it stood at 13:19 today (`print.html`, `phone.html`, `listing/images.html`). The built parent guide words line A differently from the brief, and it has three lines the brief did not list (X1 to X3 below).
**Etsy listing copy:** there is no `listing/listing.md` yet, so line D is checked as given in the brief. The planned Etsy title ("Phone Charging Station Sign and Family Screen Rules, Kitchen Fridge Printables") carries no health words. PASS.
**EV ids:** see `~/.claude/skills/evidence-review-video/references/evidence-library.md`. EV-95 to EV-99 were added today.

## Overall verdict: SHIP AFTER FIXES

- **The CMO quote is exact.** "Leave phones outside the bedroom when it is bedtime." is word for word, in the "Sleep matters" box of the CMOs' advice page (PDF p.10). The PDF says "Published 07 February 2019", so "February 2019" is right. GOV.UK shows no withdrawal notice today.
- **The source line's title is wrong.** "Commentary on screen time and social media" is a shortened GOV.UK page title, not the document's title. The fix is below.
- **No line makes a medical or outcome claim**, and there are no dashes or hyphens anywhere in the visible text of `print.html`.
- **The fixes** remove four small claims we cannot source ("far more", "easier to keep", "the easiest one to keep", "mostly"). They narrow one promise on the child's poster to one a parent can keep, and they add a line saying the CMOs don't endorse the pack.
- **Nothing here needs legal advice.**

---

## 1. Verdict per line

| # | Line | Verdict | Why (source) |
|---|---|---|---|
| A (quote) | "Leave phones outside the bedroom when it is bedtime." | PASS | Verbatim, CMO advice page, "Sleep matters" (EV-2, EV-95; PDF read today). |
| A (date) | "February 2019" | PASS | The cover says "Published 07 February 2019". The GOV.UK page says 7 February 2019. |
| A (source line) | "UK Chief Medical Officers, Commentary on screen time and social media, February 2019." | FIX F1 | The document's title, and its own "Please cite as", is "United Kingdom Chief Medical Officers' commentary on 'Screen-based activities and children and young people's mental health and psychosocial wellbeing: a systematic map of reviews'". "UK CMO commentary on screen time and social media map of reviews" is only the GOV.UK page title. The quoted line sits on the annex, whose own heading is "UK Chief Medical Officers' advice for parents and carers on Children and Young People's screen and social media use". That heading has no hyphen, so we can print it under the no dashes rule. |
| A (built text) | "The UK Chief Medical Officers' advice for parents is simple:" | FIX F2 | The advice page has eight boxes: sleep, sharing, education, moving, safety, talking, meal times and phone features. Calling it "simple" and then quoting one box reads as though that box is the whole advice. Say "On sleep". |
| A (built text) | "This pack will not fix sleep or behaviour. It makes one family habit easy to see and easy to keep." | FIX F2 | "Will not fix" suggests that something needs fixing, and a worried parent will read it that way. "Easy to keep" is a small efficacy promise that we can't support. "Easy to see" is fine, because it describes a sign. |
| B | "Start before there is a phone to argue about. A rule that is already normal in your house is easier to keep than a new one brought in on the day a phone arrives." | FIX F3 | No source compares the two. Adult habit research proposes that a change in circumstances can be a good moment to start a habit (the "habit discontinuity hypothesis": Verplanken and Roy 2016; title checked, findings not read). So the opposite case can be argued. Keep the instruction and its purpose, and drop the comparison. (The built guide has only "Start before there is a phone.", which PASSES.) |
| C | "Put your own phone on the shelf first. Children copy what we do far more than what we say." | FIX F4 | "Far more than what we say" is a comparison that no source makes, so it overclaims. The best UK evidence is an association: a cross-sectional survey of 750 parents of 6 and 7 year olds, recruited through a parenting website (Jago 2013, EV-97). Its authors say "It is not possible to clearly delineate the nature and direction of the association." The CMOs give the same idea as advice: "adults can lead by example through not using screens excessively in front of children" (EV-95). Use their words. |
| X2 (built) | Steps, "Put your phone there first": "A rule the grown ups keep is the easiest one to keep." | FIX F4b | The same issue as C, with a superlative on top. |
| D | Listing: "Phones out of the bedroom at night is the UK Chief Medical Officers' own advice for families, and this pack makes it the easy, visible habit in your kitchen." | FIX F5 | (1) The CMOs say "at bedtime", not "at night", and they address "parents and carers". (2) "Makes it the easy ... habit" is an efficacy promise. (3) In a sales listing, "the CMOs' own advice" sits close to implying their backing. CAP Code 3.52 forbids claiming that a product "has been approved, endorsed or authorised by any public or private body" if it has not (EV-99). The Open Government Licence gives no right to suggest "that the Information Provider ... endorse[s] you" (EV-98). Add a not endorsed line. On Etsy's medical claims rule, line D claims no health effect, so it is fine once fixed. See U1 for what I could not read. |
| E | "If something online feels wrong, tell a grown up. Nobody is in trouble for telling." | FIX F6 | The rule itself is safe, and it matches the CMOs' "Talking helps" box: "make sure they know they can always speak to you or another responsible adult" (EV-95). The problem is "Nobody". A child can hear it as "my friend won't get into trouble either", or "the person who did it won't". A parent can't promise that: if a friend shared a nude image, a school has to act under the UKCIS guidance (EV-77). So promise only about the child who tells. |
| X1 (built) | "The bedtime phone battle is mostly a battle about where the phone goes." | FIX F7 | "Mostly" is a figure. This is the same pattern as R16 F14 ("Most screen time fights..."). |
| X3 (built, rules poster) | "The timer decides, so nobody has to nag." | FIX F8 (should) | A small outcome promise. |
| X4 (built) | "Meal times are screen free." / "Phones in the basket" | PASS | The CMOs say "Screen-free meal times are a good idea" (EV-95). |
| X5 (built) | "Start before there is a phone." / "The tablet and the games controller can sleep on the shelf too." | PASS | Instructions only. The pack's "every device" goes further than the CMOs' "phones", but it claims no outcome, so this is fine. See the optional F9 for under 5s. |
| X6 (built) | Every other line: the station poster, the stand up sign, the charging line, the labels, tonight's plan, "One star is five minutes", the other rules, and the phone version | PASS | These are signs and instructions. The star rate is this chart's own rule. |

---

## 2. Replacement wording (no dashes)

**F1. Source line under the evidence box.** Replace
> UK Chief Medical Officers, Commentary on screen time and social media, February 2019.

with
> UK Chief Medical Officers' advice for parents and carers on children and young people's screen and social media use, published with their commentary on a systematic map of reviews, Department of Health and Social Care, 7 February 2019, gov.uk. This pack is not endorsed by the UK Chief Medical Officers or the UK Government.

(Optional, on the back page or in the sources: "Contains public sector information licensed under the Open Government Licence v3.0." This is the OGL's default attribution, EV-98.)

**F2. The evidence box (as built).** Replace
> The UK Chief Medical Officers' advice for parents is simple: "Leave phones outside the bedroom when it is bedtime." We have kept to that advice and we claim nothing stronger. This pack will not fix sleep or behaviour. It makes one family habit easy to see and easy to keep.

with
> On sleep, the UK Chief Medical Officers' advice for parents and carers (February 2019) says: "Leave phones outside the bedroom when it is bedtime." We have kept to that advice and we claim nothing stronger. This pack does not promise better sleep or behaviour. It gives one family habit a home in your kitchen, where everyone can see it.

**F3. Line B.** Replace
> Start before there is a phone to argue about. A rule that is already normal in your house is easier to keep than a new one brought in on the day a phone arrives.

with
> Start before there is a phone to argue about, so the rule is already a normal part of home by the day a phone arrives.

**F4. Line C.** Replace
> Put your own phone on the shelf first. Children copy what we do far more than what we say.

with
> Put your own phone on the shelf first, so the rule is for everyone. The UK Chief Medical Officers say adults can lead by example.

(If you would rather not name the CMOs twice, this also passes: "Put your own phone on the shelf first, so the rule is for everyone. Children notice what we do, not just what we say." It is milder, but it has no source.)

**F4b. Steps, "Put your phone there first" (as built).** Replace
> Dock yours before you say goodnight. A rule the grown ups keep is the easiest one to keep.

with
> Dock yours before you say goodnight, so the rule is for everyone.

**F5. Line D, the listing.** Replace
> Phones out of the bedroom at night is the UK Chief Medical Officers' own advice for families, and this pack makes it the easy, visible habit in your kitchen.

with
> Phones out of the bedroom at bedtime is part of the UK Chief Medical Officers' 2019 advice for parents and carers. This pack gives that habit a home in your kitchen, where everyone can see it. Not endorsed by the UK Chief Medical Officers or the UK Government.

Keep "Chief Medical Officers" out of the Etsy title and tags. Also keep these out of the tags: "better sleep", "sleep hygiene", "screen addiction", "anxiety" or "ADHD". Run `check-listing-tags.mjs` on the listing when it exists.

**F6. Line E, the rules poster.** Replace
> If something online feels wrong, tell a grown up. / Nobody is in trouble for telling.

with
> If something online feels wrong, tell a grown up. / You will not be in trouble for telling.

(Optional, for the parent guide: "Only put up rule 5 if you can keep it. If they tell you, thank them first. Telling should never be the reason they lose a device." This matches the first call promise in The Road to 16, CB-47.)

**F7. Parent guide intro (as built).** Replace
> The bedtime phone battle is mostly a battle about where the phone goes.

with
> A bedtime phone battle is often really about where the phone goes.

**F8 (should). Rules poster, rule 3 (as built).** Replace
> The timer decides, so nobody has to nag.

with
> The timer decides, not a grown up.

**F9 (optional, for the Pebble stage note).** Ages 4 and 5 are covered by newer and stronger official guidance. If you want it, add:
> For under 5s, the 2026 government guidance goes further: "Keep bedrooms and mealtimes free from screens."

Source line: "Best Start in Life, Screen time guidance for under 5s, last updated 29 June 2026, beststartinlife.gov.uk." (EV-96. That page's "copy your screen use habits" sentence contains a dash, so paraphrase it, or leave it out.)

---

## 3. Pushback and comebacks

| Camp | The strongest objection (one line) | Comeback (sourced) | Holds up |
|---|---|---|---|
| A: Odgers, Orben, Przybylski, Etchells, CMO 2019 | "You lift the one bedroom line from a document whose headline is that the research 'does not present evidence of a causal relationship'." | "We print it as advice and say we claim nothing stronger, and the pack promises no outcome. The sleep link is from cross-sectional studies (EV-1, EV-2, EV-95)." | strong (after F2) |
| A | "'Children copy what we do far more than what we say' has no source; parent and child screen time go together, but nobody knows the direction." | "Agreed, and we cut it. We now use the CMOs' 'lead by example' (EV-95). The UK association study is cross-sectional, and its authors say the direction is unknown (EV-97)." | strong (after F4) |
| B: Haidt, Twenge, Rausch, Nagata, Kelly | "Too timid. Bedtime only, phones only, when the government's 2026 guidance now says 'Keep bedrooms ... free from screens'." | "The pack's own rule is every device on the kitchen shelf, grown ups' included, so in practice it goes further. For under 5s we quote the 2026 guidance word for word (F9, EV-96). We still won't promise an outcome from a sign on a shelf." | fair (strong with F9) |
| B | "'Does not promise better sleep' undersells a habit with evidence behind it." | "The evidence is an association, OR 2.17 for inadequate sleep, from 20 cross-sectional studies (EV-1). No trial has tested a charging shelf. On a product, we say what the family does." | strong |
| Media lawyer and ad rules | "The listing borrows the CMOs' authority to sell." | "The quote is exact and attributed, and the listing and the guide now say the pack is not endorsed (CAP 3.52, EV-99; OGL, EV-98). No person is named, so defamation doesn't come in. One line quoted from a published government document, with its source, is fine under the OGL and CDPA s.30(1ZA)." | strong (after F1 and F5) |
| Worried parent | "My 9 year old charges her phone in her room. Have I harmed her?" | "The CMOs give it as advice, not as a warning about harm, and the research linking bedtime devices with poorer sleep can't show cause (EV-1, EV-2). Moving the charger is a small change you can start tonight." | strong |
| Safeguarding lead | "'Nobody is in trouble for telling' is a promise you can't keep if a friend or an adult did something wrong." | "Right. It now promises only about the child who tells (F6), in line with the CMOs' 'Talking helps' (EV-95)." | strong (after F6) |
| The subject's team (CMO office, DHSC) | "Ours was eight tips for balance. Don't call it 'simple', and don't imply we back a product." | "Fixed: 'On sleep', the full source and a not endorsed line (F1, F2, F5)." | strong (after fixes) |
| Etsy review | "A listing that names Chief Medical Officers and sleep implies a health benefit." | "It names a habit and its source, and says plainly that it promises no better sleep. There's no claim to treat or prevent anything." | fair (Etsy's own policy page couldn't be read, U1) |

---

## 4. Unverified items

- **U1. Etsy's medical claims policy.** etsy.com returns 403 to WebFetch, and a curl retry was refused as bot check circumvention, which is correct (L-27). I've seen only a search summary: claims that an item can "treat, prevent, mitigate, cure, or diagnose" a disease or condition are prohibited, implied claims count, and disclaimers don't cure a breach. **Browser step for Justin:** open etsy.com/legal/prohibited, then the "Drugs, medical drugs and medical claims" section, and confirm that nothing in F5 or the tags touches it. I see no risk in the fixed wording.
- **U2. NSPCC "won't get you into trouble" wording** (to support F6). nspcc.org.uk returns 403, and I've seen it only in secondary copies. F6 doesn't depend on it, because the CMO "Talking helps" box (EV-95) is the anchor.
- **U3. Verplanken and Roy 2016**, *J Environ Psychol* 45:127 to 134, doi:10.1016/j.jenvp.2015.11.008. I checked the title only, on Crossref; sciencedirect returns 403, and Europe PMC has no abstract. It is used only to show that line B's comparison could be argued the other way. It is not printed.
- **U4. Best Start in Life scope.** The page doesn't say which UK nations it covers. That's why F9 says "government guidance" and doesn't name England.

---

## 5. Would a hostile, hype-allergic researcher wince?

Here is how each line reads with the fixes in.

- **"On sleep, the UK Chief Medical Officers' advice ... says"**: no. The quote is exact, the date is right, and the scope says "on sleep".
- **"We have kept to that advice and we claim nothing stronger"**: no. The pack goes further in what it asks families to do (every device, the kitchen), but it claims no more.
- **"Does not promise better sleep or behaviour"**: no.
- **"A bedtime phone battle is often really about where the phone goes"**: a mild wince at "often". It is opinion, framed as such, and it passed in R16. Cut "really" if you want it plainer still.
- **"The UK Chief Medical Officers say adults can lead by example"**: no. It is their words.
- **"You will not be in trouble for telling"**: no. A safeguarding lead would approve.
- **The listing**: no, with the not endorsed line in.
- **The quoted 2019 advice is seven years old.** I checked: GOV.UK shows no withdrawal notice. Newer guidance exists only for under 5s (EV-96), and it points the same way, more strongly.
