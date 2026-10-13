# "Ready, one worry at a time": the advert series and its template

12 October 2026. Justin asked how to show that we encourage offline but teach
the child to use the device, the top five issues parents raise with our
solution to each, how DiGi helps and tracks, the timer and job requests on
the phone, the older child doing jobs as routine, her own phone charging
outside the bedroom, the child app prompting offline first, all at the right
length. Then: "a template we can use again and again for each aspect."

## The shape

One hero, five episodes, one template.

- **The hero, "Ready"** (`videos/2026-10-12-ready`, 100 seconds). The
  emotional brand film. Stays as it is: one family, six to sixteen, the gold
  star given back.
- **Five episodes, about 40 seconds each,** one parent worry each, all built
  from `videos/_templates/ready-series`. The length research says 30 to 45
  seconds is the paid and organic workhorse (Reels, TikTok, LinkedIn,
  YouTube), and the hook has to land in three seconds.
- **The same family in every episode,** so the series reads as one story
  told one worry at a time. Footage is reused from "Ready" wherever it fits.

## The five worries, in parents' own words

From `research/homepage-audience-language.md` (Mumsnet, Reddit, the surveys
it cites). Each episode opens on the worry and closes on the stage check.

| # | The worry | The hook on screen | DiGi's answer | The product doing it (real screens) | The payoff |
|---|---|---|---|---|---|
| 1 | The nightly fight | "It's utterly miserable constantly policing screen time." (a parent, Mumsnet) | Give the ending to the timer, not to you | Every screen goes through her timer; asking inside bedtime goes to the parent as a request; the parent's Yes or Not now | Six, she switches it off herself. Sixteen, the phone charges in the kitchen |
| 2 | Screens before everything | "Jobs first, then screens." (the child app's own line) | Make the job the way in, not the punishment | The before screens tag; "Screen time is locked" until jobs are approved; the job tick, the parent's one tap approve, "you earned 3 stars, that is 15 minutes"; "20 minutes outside" in her five a day | Fifteen, she lays the table unasked and watches after |
| 3 | Fear of what they'll see | "I want them to come to me first." | Thank her for coming to you first. That is the win | The open door scripts; DiGi's words for the moment; the check in faces moving | Twelve, she brings the message downstairs |
| 4 | Feeling out of your depth | "My child knows more about this than I do." (47 percent, Vodafone UK) | You don't need to know the app. You need the words | Ten minute lessons together; the trust ladder, "Ask first", then "They start, you watch", then "Trusted" | Nine on the sofa learning; eleven, she starts her own timer |
| 5 | The phone in the bedroom | "All devices downstairs at 10pm." (the Mumsnet standard) | Agree where devices sleep before the phone arrives | "Our family deal": every device charges in the kitchen overnight; "Phone charges outside the bedroom first. Then screens." | Sixteen, her own phone on the kitchen charger, by choice |

Every caption is a claim the product makes. Screens are real captures of the
running app (`videos/_templates/ready-series/tools/capture.mjs`), never a
mock up.

## The template, one beat list per episode

`videos/_templates/ready-series/build.mjs <episode.json> [--vertical]` writes
the episode's `index.html` in 16:9 or 9:16 from the same beats.

| Beat | Job | What it shows |
|---|---|---|
| hook | Stop the scroll, under four seconds | The worry, quoted, over the problem shot |
| shot | The moment | A clip with an age caption |
| chat | DiGi helps | The parent's message, the typing dots, DiGi's answer, drawn like the real chat |
| screen | The product does it | A real screen in a phone, rising over the blurred clip, with one line saying what it does |
| payoff | The change | The same family, older, doing it themselves |
| end | The stage check | Logo, "What stage is your child? Three questions, no sign up." |

The build refuses a dash, a caption over nine words, or a beat too short to
read, the same rules as the other house films.

## Cost

Episodes 1, 3 and 5 can be cut almost entirely from "Ready" footage. 2 and 4
need about four new shots each (going outside first, a child tapping the
timer on a tablet, starting her own timer at eleven). About eight draft shots,
192 credits, then finals with the hero.
