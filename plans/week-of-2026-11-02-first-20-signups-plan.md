# The first 20 sign ups

Written 6 November 2026 for Justin, who asked for a review of the founder
podcasts and YouTube channels (Starter Story, Indie Hackers, the SaaS shows),
the sites where apps get listed and launched, and the best plan possible to
reach the first 20 sign ups. Three research sweeps ran today: founder shows
and first user write ups, launch directories and app stores, and where a UK
parent app can advertise or be featured for little money. Grades as before:
VERIFIED (primary page read today), LIKELY (secondary), UNVERIFIED (never
publish). Runs Saturday 7 to Friday 27 November 2026. No dashes in any copy.

This plan does not replace the 30 September launch plan or the July
playbook. It is the narrow version of both, because neither has moved the
number yet.

## 1. Where we really are, read from the database today

| Number | Value |
| --- | --- |
| Accounts | 32, and on a closer read 29 of them are Justin's own test addresses |
| Real people with an account | 3: Natalia, one account named "cj", and none paying |
| Stage checks started in the last 30 days | 4, all with no link (`direct`) |
| Stage check leads | 54, and all but two are test addresses (one is an academic in New Zealand) |

**Corrected the same day.** The first draft of this plan read "28 of 54 leads
made an account" as proof the door works. Those 28 are Justin testing his
own sign up. So there is no conversion rate yet, from strangers or anyone,
and the honest starting point is zero real sign ups. That makes the warm ring
more important, not less: the first twenty are people one step from Justin.

**A small fault found on the way.** `starter_leads.converted` reads false for
every lead, even ones with accounts, so anything counting on that column is
blind. One line of fix in the next build session, not part of this plan. Also
worth a guard: test addresses (`justin+`, `j31phillips+`, `support+`) should
be filtered out of every count the founder page shows.

**What counts as a sign up here:** a new account made by someone Justin did
not already know. The signup alert email (lib/ops/signup-alert.ts) already
tells him about each one. Paying is the next plan, not this one.

**The maths, as an assumption to test, not a forecast.** With no real rate
yet, assume one stranger in four who starts the stage check makes an account.
Then 20 sign ups need about 80 stage checks from strangers in three weeks,
roughly four a day. We are at one a week. Check the real rate after the first
30 starts and redo this line.

## 2. What the research says, in four findings

**1. Most consumer apps got their first users from one channel that fitted
the product.** Lenny Rachitsky's study of more than 100 consumer apps, read
today. VERIFIED. Do not spread three weeks across twelve channels. Pick the
one that fits and pour the time into it.

**2. For parent products, that channel is a group parents already belong to.**
Smartphone Free Childhood went from a WhatsApp group of three to over 1,000
in hours from one Instagram post, then grew by school and region. VERIFIED.
Wait Until 8th only switches on when ten families from one school year sign,
and had hundreds of parents across 40 schools in its first month. VERIFIED.
Greenlight credits word of mouth in parent groups on social media. LIKELY.
Our story is "together instead of fighting", so the mechanic is already ours:
a class doing it together.

**3. Launch directories bring makers, not UK parents.** No honest founder
report exists of a Product Hunt launch for a consumer parenting app in 2025
or 2026. The surveys that do exist are B2B: 71 to 450 sign ups in a week when
featured, 1 to 15 when not, and about one launch in ten gets featured.
LIKELY. One fitness app came sixth on the day and got thousands of visitors
and one paying customer. LIKELY. An AI bedtime story app did get 500 sign ups
on Product Hunt day one (Starter Story). VERIFIED. Treat directories as one
evening of work for backlinks, a badge and a handful of curious parents, never
as the plan.

**4. The timing is this month.** The ban on social media for under 16s goes
before Parliament before the end of 2026 and is planned for spring 2027, date
not confirmed (Smartphone Free Childhood's FAQ). VERIFIED. And a phone is on
some children's Christmas list right now. The local press angle writes itself:
before a phone goes under the tree, three questions. No statistic in that
pitch until our own stage check data exists.

What the Starter Story and SaaS shows add on top: a cap that is real draws
people (Sprouty capped sign ups at 30 a day, VERIFIED), friends of friends
beat friends (Yelp's first thousand, VERIFIED via Lenny), and the founder's
first users are the people they interviewed (Peanut, LIKELY). The July plan
already took the paid creator engine from the Early episode; that stays
parked until free traffic converts, as the money rule says.

## 3. The plan in one line

Three weeks, about 45 minutes a day, four doors in this order: the people
Justin knows asking one parent each, local press on the Christmas and ban
moment, local parent groups with the admin's yes, and one class or PTA doing
it together. Directories and app stores get one evening each, because they are
cheap, not because they will fill the twenty.

## 4. Every door has its own link

Made today in `video_links`, so the founder page
(`/dashboard/admin/videos`) counts stage checks by door. Use the link, never
the bare starter pack address. Every link is `guidedchildhood.com/v/<code>`.

| Code | Door |
| --- | --- |
| `warm-ring` | Personal messages to people Justin knows |
| `class-ready` | The class WhatsApp message |
| `pta-talk` | The PTA talk and school newsletter QR |
| `press-local` | Somerset and Bristol press and radio |
| `localreach` | LocalReach magazine, BS25 to BS28 |
| `nub-news` | Cheddar and Wells Nub News |
| `nextdoor` | Nextdoor business page and posts |
| `grp-1` to `grp-5` | Five parent Facebook groups, one code each, write down which is which |
| `show-hn` | Show HN on Hacker News |
| `producthunt` | Product Hunt |
| `eas` | Educational App Store |
| `directories` | The free directory batch |
| `podcast-guest` | Podcast guest spots |
| `journo` | #journorequest and Qwoted replies |
| `creator-seat` | Local parent creators paid in a founder seat |

## 5. The four doors

### Door 1. The warm ring, friends of friends (days 1 to 4)

The 32 accounts and 54 leads are not the twenty. The people they know are.
One personal message each, from Justin's own phone or Gmail, asking for one
forward to one parent with a child aged 4 to 12. This is a personal note, not
a programme email, so it does not touch the one email a week floor. No
broadcast, no BCC.

Paste, and change the first line for each person:

> Hi Sam, thank you for trying Guided Childhood back in the summer. I have a
> small favour. I am trying to reach 20 parents I have never met before
> Christmas, and the quickest way is a friend of a friend. Is there one parent
> you know whose child is getting near phone age? This is the link, three
> questions, no sign up: guidedchildhood.com/v/warm-ring. If it is not for
> them, no problem at all. Justin

Target: 30 messages sent by Tuesday 10 November. Ask each new sign up the same
question once they are in.

### Door 2. Local press on the Christmas and ban moment (days 2 to 7, then follow ups)

The highest upside for two hours of work, and it costs nothing. Send one
pitch, personalised, to each:

- BBC Radio Somerset, somerset@bbc.co.uk. LIKELY.
- BBC Radio Bristol, through the BBC Bristol news contact page.
- Somerset Live and Bristol Live (Reach), newsdesk@westgaz.co.uk for Somerset.
  LIKELY. Bristol Live also runs a Bristol Parents Club newsletter and
  Facebook group. LIKELY.
- Bristol Parent magazine, editor@bristolparent.co.uk. VERIFIED.
- Cheddar and Wells Nub News, through the free "Nub It" button. LIKELY.
- LocalReach, the free monthly for BS25 to BS28, which takes 100 words of
  community news free each month. Ring 01934 312171 for the next deadline.
  LIKELY.

Paste, and fill the bracket:

> Subject: Before a phone goes under the tree, a Somerset dad's three
> questions
>
> Hello [name],
>
> I am a dad in Somerset and I have built a free tool for parents who are
> wondering whether their child is ready for a phone this Christmas. It asks
> three questions, needs no sign up, and tells a parent what stage their
> child is at and the one thing to talk about first.
>
> With the under 16 social media ban going to Parliament before the end of
> the year, most parents I speak to know what they are meant to stop. Nobody
> has told them what to do instead. That is what Guided Childhood is for: ten
> minutes a day, parent and child working on it together.
>
> I would be glad to talk on air or for a piece, and I can show the stage
> check working in fifteen seconds. Try it here:
> guidedchildhood.com/v/press-local
>
> Justin Phillips, founder, Guided Childhood
> [phone number]

One follow up a week later, one line, then stop. Daily, 10 minutes: search
#journorequest on X and Bluesky for parenting, screen time or phones, and use
Qwoted's free plan (two pitches a month, VERIFIED). Reply with the `journo`
link.

### Door 3. Local parent groups, with the admin's yes (days 3 to 21)

Find five groups: Winscombe and Sandford, Cheddar, Weston super Mare, North
Somerset, and one Bristol parents group. Message the admin first; many groups
only allow a business post on one day a week. Then be a parent who helps, the
one in ten rule from the content engine: answer real phone and screen
questions with no link, and offer the stage check only where it answers the
thread. Each group gets its own code, `grp-1` to `grp-5`.

The admin message:

> Hi, I am a local dad and I have built a free three question check for
> parents wondering if their child is ready for a phone. No sign up, nothing
> to buy to use it. Would you be happy for me to share it once on your
> promotion day? Happy to follow whatever rules you have. Justin

The post, on the day the admin names:

> If a phone is on your child's Christmas list and you are not sure they are
> ready, I made a free check for exactly that. Three questions, no sign up, it
> tells you what stage your child is at and the one conversation to have
> first. guidedchildhood.com/v/grp-1
> I am a dad round here, so if you try it I would love to hear what it got
> wrong.

Add Nextdoor: a free business page, then one post to the neighbourhood with
the `nextdoor` link (Nextdoor says it has over 10 million UK users, LIKELY).

Mumsnet: the Talk guidelines (mumsnet.com/i/netiquette, read 6 November)
allow "the odd link" others find useful but delete attempts to post links
"as a way of promoting their own product". VERIFIED. The only official
business route is paid advertising. So on Mumsnet Justin answers phone and
screen threads as a parent with no link, and names the stage check only if
someone asks what he uses. Never a thread of his own about it.

### Door 4. One class doing it together (days 5 to 21)

The research's strongest pattern, and the one that matches our story. It
needs no build: the stage check is the same for every family, so a class
message is just a shared invitation. Two routes, both free.

**The class WhatsApp.** Justin, or any founder family who is happy to, sends
this to one class group:

> A few of us were saying we have no plan for the phone question. I found a
> free three question check that tells you what stage your child is at, and
> I thought it might be easier if a few of us did it at the same time and
> compared notes at pick up. guidedchildhood.com/v/class-ready

**The PTA talk.** Offer one primary PTA a free twenty minute talk, "Is my
child ready for a phone?", before the end of term, with a QR code to
`pta-talk` on the slide and in the newsletter. Headspace started as talks in
London before it was an app. VERIFIED. The gc-slides skill builds the deck in
an evening. The newsletter line:

> Free for every family this term: a three question check that tells you
> what stage your child is at for phones and social media, and the one
> conversation to have first. No sign up. guidedchildhood.com/v/pta-talk

Which school to approach is Justin's call, and his own children's school is a
privacy question for him, not for this plan.

## 6. The listing evening (one evening in week 1, one in week 3)

Ranked by fit for parents, with the time each takes. All free unless said.

| Order | Where | Time | Why, honestly |
| --- | --- | --- | --- |
| 1 | Educational App Store, educationalappstore.com/developer | 45 min | Reviews web apps, up to 10 working days, cites 580,000 parents and teachers. VERIFIED. The badge can land inside the three weeks. Code `eas`. |
| 2 | Show HN, news.ycombinator.com/showhn.html | 1 hour plus the day in the comments | The stage check needs no sign up, which is what Show HN's rules ask for. VERIFIED. Many readers are parents. Honest and blunt comments. Code `show-hn`. |
| 3 | Safer Internet Day 2027 supporter, saferinternet.org.uk | 15 min | 9 February 2027, theme "Reflect on tech: exploring digital wellbeing and our relationship with technology". VERIFIED. No sign ups this month, a perfect fit for February and for schools. |
| 4 | Free directory batch: SaaSHub (name the competitors or it queues last), AlternativeTo (as an alternative to Qustodio and Family Link, though they may decline AI products), Launching Next, Microlaunch's free launchpad, Uneed's free queue | 90 min | Backlinks and search, a handful of visitors. VERIFIED for SaaSHub, AlternativeTo and Uneed. Code `directories`. |
| 5 | EdTech Impact free evidence profile, edtechimpact.com | 1 hour | For the schools product, reviews from schools later. VERIFIED. |
| 6 | Product Hunt, prepared in week 2, launched Tuesday 24 November | 4 hours prep | Free, no asking for upvotes. VERIFIED. Expect single figures unless featured. Launch only once the warm ring can comment honestly. Code `producthunt`. |

Skip: BetaList (paid only now), the paid AI directories (There's An AI For
That, Futurepedia, Toolify, from $49 to $497, AI tool hunters, not parents),
DevHunt (developer tools only), Mumsnet and Netmums paid products, the
beehiiv ad network (from $15k), Parenting Hell sponsorship.

## 7. The app stores, honestly

The app already has a web manifest (`public/manifest.json`, start URL
/dashboard), so it can be wrapped without a native rebuild.

- **Microsoft Store, free.** Registration is free and there is a direct route
  for a web app. VERIFIED. A "get it on the store" badge inside three weeks,
  small traffic. Worth one build session.
- **Google Play, $25 once.** Wrapped as a Trusted Web Activity (PWABuilder).
  A new personal developer account needs 12 testers opted in for 14 days in a
  row before it can go public. VERIFIED. If children are in the app's
  audience the Families policy applies, and the child side is. VERIFIED.
  Subscriptions sold inside the app would need Google's billing. LIKELY. So
  payment stays on the website. Start the 14 day clock this week with 12 of
  the existing accounts as testers, or it cannot be public before December.
- **Apple App Store, not this month.** It must do more than repackage a
  website (rule 4.2) and subscriptions inside the app must use Apple's in app
  purchase (rule 3.1.1). VERIFIED. A real project for the new year.
- Samsung needs seller status with a company number, Amazon has left ordinary
  Android phones. Skip both.

None of the stores will bring twenty parents in three weeks. They make the
product look real to a parent who already heard about it somewhere else,
which is worth having before the press piece lands.

## 8. Day by day

About 45 minutes a day. If only the Must happens, the plan still holds.

**Week 1, the warm ring and the press (Saturday 7 to Friday 13 November)**

- **Sat 7.** Must: write the list of 30 people for the warm ring, and send the
  first ten messages.
- **Sun 8.** Must: send ten more. Then find the five Facebook groups and
  message each admin.
- **Mon 9.** Must: the press pitch to BBC Radio Somerset, Somerset Live and
  Bristol Parent. Ring LocalReach for the deadline.
- **Tue 10.** Must: the last ten warm ring messages. Nub News "Nub It" story,
  BBC Radio Bristol and Bristol Live. Nextdoor page and first post.
- **Wed 11.** Must: the listing evening, rows 1 to 5 of section 6 (EAS, Show
  HN on the same morning so you can sit in the comments, Safer Internet Day,
  the free batch, EdTech Impact).
- **Thu 12.** Must: the first group posts on whichever days the admins allow.
  Pick 12 testers from the existing accounts if Google Play is a yes.
- **Fri 13.** Must: read `/dashboard/admin/videos`. Which door has stage
  checks? Write the week's number. Ask every new sign up to forward one parent.

**Week 2, the class and the groups (Saturday 14 to Friday 20 November)**

- **Sat 14.** Must: send the class WhatsApp message, or ask one founder family
  to.
- **Sun 15.** Must: email one PTA chair offering the talk before the end of
  term.
- **Mon 16.** Must: one week press follow ups, one line each. Group posts.
- **Tue 17.** Must: book a fifteen minute call with every stranger who signed
  up. Ask what they worried about, what the stage check showed, and what would
  feel fair to pay. Their words are next week's copy.
- **Wed 18.** Must: three podcast guest pitches for the new year (Parenting
  Teenagers Untangled, teenagersuntangled@gmail.com; Not Another Mummy;
  the Sue Atkins Parenting Show, sue@thesueatkins.com, all LIKELY). They air
  late, so this is for January, not for the twenty.
- **Thu 19.** Must: Product Hunt prep. Tagline, gallery from real screens, the
  first comment in Justin's voice.
- **Fri 20.** Must: the week's number by door. Double the time on the door
  that worked, drop the one that brought nothing.

**Week 3, double down (Saturday 21 to Friday 27 November)**

- **Sat 21 to Mon 23.** Must: more of whichever door has the most stage checks.
- **Tue 24.** Product Hunt launch at 00:01 Pacific (08:01 UK). Ask the warm
  ring to look, never to upvote.
- **Wed 25.** Must: the PTA talk if booked, or a second class group.
- **Thu 26.** Must: three local parent creators with 1,000 to 20,000
  followers (#somersetmum, #bristolmum, #bristoldad), offered a founder year
  free, not cash, to try it and say what they think. Code `creator-seat`.
- **Fri 27.** Must: the count. Twenty or not, write the number by door and
  the rate from stage check to account into this file.

## 9. The rules that stay

- Every link is a `/v/` code, so every door earns its own number.
- No paid ads until one free door has turned stage checks into sign ups. The
  first paid test after that is £30 on Meta behind the post that worked,
  logged in `content/ads/results-log.md`. UK Meta cost per lead figures found
  today range from £8 to over £60 and all come from vendor blogs, so they are
  UNVERIFIED and not a budget.
- Ban neutral in every line. Smartphone Free Childhood is an ally, never the
  thing we are against.
- No child's face, no invented parent, no statistic we cannot source.
- The founder count is shown as it really is in Stripe, never with a deadline.

## 10. Decided with Justin, 6 November

1. The four doors in this order, 45 minutes a day: yes.
2. The warm ring comes from his contacts. Thirty people chosen from the Mac
   Contacts app (personal addresses, a phone number saved, no businesses or
   trades, not Natalia), one draft each in Gmail, subject "A small favour,
   one parent", every one using `warm-ring`. Most of the contacts date from
   a 2021 import, so some addresses will bounce and some people he will not
   want to ask: he deletes those drafts and sends the rest.
3. Press says "a dad in Star, near Winscombe". The pilot campaign already
   says "a parent in Winscombe" in public, and a named village is what local
   desks want. Three pitches drafted: BBC Radio Somerset, Somerset Live
   (newsdesk@westgaz.co.uk) and Bristol Parent. Each has a `[your phone
   number]` line to fill. Nub News goes in through its "Nub It" button and
   LocalReach by phone, both by hand.
4. The PTA talk goes to the four nearest primaries with a parent association
   contact: Winscombe Primary PTFA (through the office, 0.9 miles), Churchill
   CofE Primary PTA (through the office, 1.8), Axbridge First School PTA
   (pta@axbridgefirstschool.co.uk, 2.0) and the Friends of Banwell
   (friendsofbanwell@gmail.com, 2.6). Shipham and Burrington have no parent
   association contact on the web. All four heads may also have had the
   schools pilot email in October; this ask goes to the parents' association,
   not the head, and offers a talk for parents, not a pilot.
5. Google Play test and the Microsoft Store: yes. A separate session is
   packaging both (PWA wrap, assetlinks, listing copy, Families and Data
   safety answers). Justin creates the developer accounts, pays the $25 and
   invites the 12 testers himself.
6. Mumsnet rules read (section 5, door 3): helpful replies, no links.

Every draft sits in justin@thesocialbillboard.com, the mailbox the Gmail
connector held today. Nothing was sent. If the press and PTA emails should
come from hello@guidedchildhood.com, reconnect that mailbox and they move.
