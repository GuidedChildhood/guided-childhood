# Devices: one list, not two

29 July 2026. JP, from his phone: *"Still a bit unclear on devices it's confusing
have 2 lists should it just have suggested list of devices by age ave add
devices and then they add and set settings so it's marked as set then returns to
updated list of devices?"*

He is right, and his proposed loop is the one the whole industry uses.

## What is actually on the page today

Four stacked blocks, two of which are device lists:

1. Stage note (research at this age)
2. **YourHome** — "The screens in your home". His two real devices, Android
   phone and Smart TV. Rename and Gone. No setup status on the rows.
3. **DeviceCoverageBoard** — a ring reading "3 of 26", plus layers for the home
   network and the social apps.
4. **DeviceList** — "Every guide, step by step". Search, category chips, and all
   26 published guides with tick marks.

So the page shows him two devices in one place and twenty six in another, and a
ring counting something different again. Nothing joins his Android phone to our
Android guide on screen, even though the data already joins them.

## What the references do

Pulled from Mobbin, per the Mobbin first rule.

Smart home apps are unanimous. [Google Home](https://mobbin.com/screens/9338c84f-8c3f-4256-bfb2-c7c31515df08),
[SmartThings](https://mobbin.com/screens/b25523a4-229c-4d98-b6da-e370a543241b),
[Roku](https://mobbin.com/screens/5f781687-9cca-41ab-8299-a432a3afbe02) and
[Amazon Alexa](https://mobbin.com/screens/72d19919-18b5-402b-aaf5-d664a7762726)
all show **one list: your devices**, plus a single add control. Not one of them
puts a catalogue of every device in the world beside your own list.

[Alexa's add screen](https://mobbin.com/screens/a58d468a-bccc-4253-af49-26f5bafa5074)
is the one worth copying closely. Your real devices sit at the top, and
underneath them are **dashed placeholder rows** for categories you have not got
yet, each dismissible. Suggestions live inside the same list, visually marked as
not yours. That is exactly JP's "suggested list of devices by age".

Setup checklists answer the second half. [Chime](https://mobbin.com/screens/5964d1f6-e082-4612-a968-568b09e2cc8a),
[Deel](https://mobbin.com/screens/7821ba68-6ece-441d-ba3e-490e49ac1f39),
[Revolut Business](https://mobbin.com/screens/15bb35c9-44d8-4c5d-bdf0-a77a86307f62)
and [Cleo](https://mobbin.com/screens/c80a9ae9-9e0f-40d9-827d-578b33a0fb1f) all
carry the status **on the row itself** (DONE, NOT STARTED, Requires action), a
chevron into the task, and a count at the top. One list. Status where you are
looking. Tap, do it, come back and the row has changed.

## The good news

The data model already does this. `family_devices.guide_key` points at
`device_guides.device_key`, `DEVICE_SUGGESTIONS` carries a `guideKey` per entry,
and `homeSetupCount()` in lib/devices/family.ts already computes done over
total against the family's own list. The passport already uses it.

This is a presentation problem. No migration.

## The build

**One card, `YourScreens`.** Replaces YourHome and demotes DeviceList.

- Header carries the honest count: *2 of 3 set up*, from `homeSetupCount`.
- A row per device the family owns: icon, their name for it, a status line
  (Settings in place / Not set up yet), chevron.
- Tapping a row expands **that device's guide inline**, the same steps panel
  DeviceList renders today. Mark as set up flips the row, collapses the guide,
  and the count above moves. That is JP's loop: add, set, marked as set,
  back to the updated list.
- Under the real rows, **dashed suggestion rows** for age matched devices the
  family has not added. Tap adds it, and its guide is ready underneath.
- One **Add something else** control opening the full catalogue as a picker,
  with the search and category chips that DeviceList has now.

**Extract `GuideBody`** so the steps panel is written once and used by the row
expansion and by the catalogue.

**Keep the catalogue reachable, not resident.** Collapsed behind Browse every
guide at the bottom, so a parent can still read the Xbox guide without owning an
Xbox. It stops being a second list competing for attention.

**Coverage board stays but stops competing.** Network and apps are a genuinely
different layer and the layered framing is right. What has to go is the ring
counting our catalogue while the list above counts their house, which is the
"2 devices ... 2 out of 13" confusion JP already reported once.

## We advise, we do not insist

Suggestions are suggestions. Dashed, dismissible, never a red badge and never a
number that goes down because a family does not own a games console.
