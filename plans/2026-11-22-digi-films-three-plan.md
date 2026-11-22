# Three DiGi films: Roblox strangers, the Year 6 group chat, the teen bedroom

22 November 2026, marketing lane. Justin: build the three recommended films to
at least the standard of the 15 November switch off short, which did well
(guidedchildhood Reel DfxiXQxH2KS, built with `videos/2026-10-09-digi-shorts`).

## Justin's goals, each mapped to a beat

| Goal | How the film does it |
|---|---|
| Easy to read, slower | Holds at 0.8s + words / 2.5 (slower than the house rule), never under 2s; one idea per beat; 80 to 104px type |
| Apple finish | The same HyperFrames engine as the 15 Nov short: real screens, camera push then hold, blur in reveals |
| Motion captions on how it works | New `caption` overlay: a kinetic line at the foot, words arriving at reading pace, a butter sweep behind the key words |
| Highlight the solution | Gold underline on DiGi's two bold steps, then the script deck "Say this" card |
| Science at the end | New `science` card: one verified study whose ages match the child, with its citation line |
| How the app keeps on top | The tracker rail (Asked DiGi, The words, Checked in, Sorted), the check back, the face tap to Sorted |
| DiGi learns: the inputs | New `inputs` card: the child's age and stage, the worry raised before, what worked for this family, this parent's rating. All labelled example family |
| Guardrails, science and philosophy | One quiet line on the inputs card: never a yes or no, safeguarding first, reviewed research; "Connection is the protection" on the end beat. No comparison with other AI is said |

## The three films

| Film | Child (example family) | Parent's words | Script (live table) | Science (verified 22 Nov) |
|---|---|---|---|---|
| A | Ava, 9, Stage 2 | "A stranger messaged Ava on Roblox. She's 9." | Online gaming with strangers (204) | Livingstone et al., 2017, J Communication; 6,400 parents; children 6 to 14: restricting cut risks but also the good, guiding opened the good, so do both |
| B | Sam, 11, Stage 3 | "All hell has broken loose on the Year 6 group chat." | Taken out of the group on purpose (9611) | Hellfeldt et al., 2020, IJERPH; 1,707 pupils aged 10 to 13: victims with more family support had fewer anxiety and low mood symptoms. Context: Ofcom 2026, 64% of 8 to 17s added or invited to a group chat in four weeks |
| C | Maya, 14, Stage 4 | "She's 14 and wants her phone back in her room at night." | Renegotiating the phone free bedroom (417) | Carter et al., 2016, JAMA Pediatrics; 125,198 children aged 6 to 19: a device in the bedroom, even unused, linked to 1.8 times the odds of too little sleep. UK Chief Medical Officers 2019: "Leave phones outside the bedroom when it is bedtime." |

DiGi's replies are illustrative, written inside the live rails (under 120 words, never yes or no, the check in line, one real script, Tonight last).

## Build

1. Add scripts 204, 9611 and 417 word for word to `app/ref-script-deck`.
2. Record each film's chat, deck, check back and check in with `tools/record2.mjs`.
3. Add `caption`, `inputs` and `science` overlays to `build.mjs`.
4. Cut, render here with HyperFrames, check every frame, render the TikTok cut.

## Tools

Nothing new is needed for this pass. What would lift it further, from the ad research: a voiceover in DiGi's voice (Tamsin, credits), and a 3D phone hero shot (Rotato or Blender). Both go to Justin as options.
