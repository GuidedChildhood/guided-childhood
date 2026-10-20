# Muse connector submission

Paste these into platform.muse.ai. Justin approved Guided Childhood appearing
inside Muse on 20 October 2026. Press Submit on page 3 only once the pull
request has merged, Vercel has deployed, and migration 383 has been run, so
the links below answer when Meta's reviewers test them.

## Page 1, Overview

**Connector name**
Guided Childhood

**Company or developer**
Guided Childhood

**Product website**
https://www.guidedchildhood.com

**Example prompts**
What do I say when my 9 year old asks for Roblox?
My daughter wants a phone for secondary school. Where do we start?
How do I talk to my son about a scary video he saw online?
Help me set screen time rules my kids will actually agree to.
What stage is my child at for getting a phone?

**Connector icon**
integrations/muse/connector-icon-512.png (DiGi, 512 by 512, from public/digi-squad/DiGi-star.png)

**Payments**
None for now. Parents who want the full plan go to our site, where Stripe
already handles the subscription.

**Your name**
Justin Phillips

**Work email**
Your Guided Childhood address

**Support email or URL**
hello@guidedchildhood.com

**Your privacy policy**
https://www.guidedchildhood.com/privacy

**Your terms of service**
https://www.guidedchildhood.com/terms

**Anything else?**
Guided Childhood helps UK parents get their children ready for a phone and
social media, ten minutes a day, with parent and child working on it together.
The connector is for parents only. It never needs a child's name, school or
location, and it stores nothing about a child: the question and the optional
age are answered and forgotten. Answers come from
DiGi, our parenting guide, which never gives a yes or no on screens. It gives a
calibrated next step and the actual words to say, then points to a free three
question stage check on our site for the full plan.

## Page 2, Technical specs

**Connection type**
Raw API

**API URL**
https://www.guidedchildhood.com

(The base address. The spec's paths already start /api/muse, so a longer URL
here would double it.)

**OpenAPI specification**
https://www.guidedchildhood.com/api/muse/openapi.json

**API or MCP documentation**
https://www.guidedchildhood.com/connectors/muse

**Access requirements**
None. Free, with no Guided Childhood account and no API key. For parents and
carers, written for UK families. Two operations: askDigi (POST /api/muse/ask)
and findScripts (GET /api/muse/scripts). There is a daily limit on fresh DiGi
answers across all users; past it, askDigi answers from our closest matching
script, so it never fails a parent. Please never send a child's name, school or
location. Questions about self harm or immediate danger return UK helplines
only, and the response says so in its signpost field.
