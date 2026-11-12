# What to paste into ChatGPT's two scheduled tasks

Claude cannot start ChatGPT or change its scheduled tasks. Justin pastes these
once. The times stay as they are: 08:00 and 11:00.

Both tell ChatGPT to find a document by its title in the folder, never by a
saved link, because the start here document is replaced by a new file each time
the queue changes and an old link goes stale.

## Add to the 08:00 task (keep everything it already does)

```
After you have written the daily brief, also do this.

Open this Google Drive folder: https://drive.google.com/drive/folders/1YznBz3TzuBMMDGbTGKUWOSYmJUaiCeIs
Read the file whose title starts READ ME. Follow it exactly.

Save ONE new file in that folder, titled CANDIDATES YYYY-MM-DD with today's date.
It must be JSON in the shape the READ ME shows, with "schema": "gdc.research-candidates/1.0"
and "createdBy": "chatgpt-scheduled-0800". Save it as a .json file if you can. If you can only
save a Google Doc, put the JSON in the Doc and nothing else.

Put in it the research you found today that a parent or a head teacher would want to know about:
at most three candidates, and none is a normal day. For each one give the original link to the
source itself, the date the source was published, what you believe it shows as full sentences with
any figure exactly as the source gives it, and at least one thing it cannot show.
Leave researchId as null. Do not give a candidate a GDC post number.

A candidate is not cleared. Do not write a post, a caption or a script from it, today or later,
until it appears under WHAT TO WRITE in the start here document.

After saving, read the file back and confirm it is valid JSON. Say in the brief that the file
was saved and read back, or say plainly that it could not be saved.

Do not name research in the brief that is not also in the CANDIDATES file.
```

## Replace the 11:00 task with this

```
Open this Google Drive folder: https://drive.google.com/drive/folders/10TsNEU7FDxBp52te-xtytQ9yY-_ON-fN
Open the Google Doc whose title starts GDC STAGE 2 START HERE and ends CURRENT.
Ignore any file whose title starts ZZ. If there is no file ending CURRENT, stop and tell Justin.

Read all of it. It lists every story that is cleared, under WHAT TO WRITE.
If it says the queue is empty, write nothing and say so.

For each story listed, in the order given:
1. Open that story's handoff from the link under it and read it in full.
2. Write ONE pack, using exactly the layout in the start here document, with the labels unchanged.
3. Produce only the formats that story lists under "Formats to produce". Under every other
   section write NOT RECOMMENDED and the reason.
4. Use only the figures listed for that story. No other number anywhere in the pack.
5. Use the GDC post number given for that story. Never choose a number yourself.
6. Save it as its own Google Doc in that same folder, titled exactly as the story says.
7. Read it back from Drive and confirm it saved.

If a story already has a pack in the folder with the same research id and no note saying it was
held, do not write it again.
If the start here document says a pack of yours was held, read the reasons under
WHAT HAPPENED TO THE PACKS ALREADY HANDED BACK, fix exactly those, and save the next version
as a new Doc with v2 in the title.

Do not mark anything APPROVED or PUBLISHED. Do not post, schedule or send anything.
Finish by telling Justin which packs you saved, by title, and that they are waiting for Claude's check.
```

## Send once, any time: the Metricool check (12 November 2026)

Claude cannot see Metricool or LinkedIn. This asks ChatGPT for the facts only
it can read, and tells it what it must not do while two posts sit in both places.

```
Do not create, schedule, publish, delete or reschedule anything in Metricool or LinkedIn.
This is a read only check. Report facts and nothing else.

1. List every draft and every scheduled post in Metricool for Justin's LinkedIn profile.
   For each give: the Metricool draft ID, the first line of the text, the date and time if it
   has one, whether it is a draft or scheduled, the autoPublish setting, and what is attached.

2. GDC-054 and GDC-058 are already scheduled in LinkedIn itself, for 16 November 08:00 and
   18 November 07:30. Their Metricool drafts must stay as drafts with no date. Confirm for each
   that it has no date and that autoPublish is off. If either has a date, say so and stop.
   Do not fix it yourself.

3. If any GDC number has more than one draft, list all of them. Do not delete any.

4. From now on, before you create any Metricool draft, open the file
   content/publication/metricool-handoff-GDC-NNN.json for that post in the
   GuidedChildhood/guided-childhood repository, or ask Justin for it. Create a draft only if
   draftCreationPermitted is true. Add a date only if schedulingPermitted is true AND Justin has
   given you the time in his own words. Use finalText and firstComment exactly as written.

5. A Metricool draft is not approval. Only Justin approves. Never mark anything approved,
   scheduled or published on his behalf.

Reply as a plain list, one draft per line, so Justin can paste it straight to Claude.
```
