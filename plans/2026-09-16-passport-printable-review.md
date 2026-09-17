# The printed passport, reviewed

16 September 2026. Justin, with a photo of the keepsakes print page: "Let's review
how the passport printable here as this needs to be premium and ability to print and
put together with printable to add like the school quality but a printable updated one."

Six expert lenses read the real files: prepress, a Year 5 teacher, a keepsake designer,
a parent at the kitchen table with scissors, the child, and the brand guard. One
synthesis ranked them. Everything below names a file and what a family actually gets.

## The verdict

It is not printable at home today, because the sheet silently prints at 107 per cent inside a page that is already too small for it and the whole thing comes out white, and once that is fixed it is one good week from being a real keepsake.

## Measured before anything was written

Rendered in print media and turned into a PDF, rather than read off the source:

| file | should be | renders as | result |
| --- | --- | --- | --- |
| the fold at home A4 sheet | 297 by 210mm | 317.8 by 224.7mm | spills onto 2 pages |
| the A6 file a printer gets | 105 by 148mm | 112.35 by 158.36mm | 7 per cent clipped every page |

The 7 per cent is a zoom. `shared/tokens.css` zooms body by 1.07; the dashboard shell
at `app/(dashboard)/dashboard/layout.tsx` line 114 turns that off and puts the same
1.07 on `.gc-dash > main` instead. Both print routes live inside that main, and neither
print block resets it. Seven other printables in this repo already do.

## Must fix

### 1. The sheet prints at 107 per cent of its size, so it cannot fit the paper on any printer

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/zine/page.tsx and /home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx`  
**Effort** medium · **4 of 6 lenses agreed**

No lens found this one. The dashboard shell sets `.gc-dash > main, .gc-dash > header { zoom: 1.07 }` at app/(dashboard)/dashboard/layout.tsx line 115. Both passport print routes render inside that main. Zoom applies on paper as well as on screen, which is exactly what BucketSheet.tsx line 64 and FriendsPoster.tsx line 158 already wrote down and fixed for other sheets. So the zine's 297mm by 210mm goes to the printer as 317.8mm by 224.7mm, against a printable box of 285mm by 198mm once the 6mm page margin is taken off. That is 33mm too wide and 27mm too tall. The cover sits bottom right, so the cover is what falls off, and the rest spills onto extra sheets. The A6 file has it too: every 105mm by 148mm page becomes 112mm by 158mm on an A6 page box, so the printer's file fragments on every page. Seven other printables reset zoom in print. These two do not. On top of that, main's own paddingBottom of calc(132px plus safe area) is never cleared, adding another 35mm of nothing after the sheet. Four lenses saw the sheet overflowing and all four blamed the 6mm margin alone. The margin is real but it is the smaller half, and fixing only the margin still leaves a sheet 20mm too wide.

**Change.** One geometry pass on the zine print block. Add `body, .gc-dash > main, .gc-dash > header { zoom: 1 !important; }` and `.gc-dash > main { padding-bottom: 0 !important; }`. Set `@page { size: A4 landscape; margin: 0; }` and keep PassportZineSheet at a true 297mm by 210mm. Do not inset the artwork: a zine is folded to the edges of the paper, so the printed quarters have to be the paper's own quarters. Instead raise the panel padding from 5mm to 6mm on the four outer edges and let the burgundy run off, which is what a home printer eats anyway. Add 4mm fold ticks in PAGE_INK_FAINT at the half and quarter points of all four outer edges, so a family can line a crease up even if a driver scales the job. Same zoom and padding reset on the A6 page. Then point scripts/check-print-fit.mjs at /app/ref-passport-zine and assert one sheet in, one page out.

### 2. The burgundy and gold cover prints as a blank white sheet

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/zine/page.tsx line 91 and /home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx line 68`  
**Effort** small · **4 of 6 lenses agreed**

Chrome ships with Background graphics off and buried under More settings. Every colour on this sheet is a CSS background: the burgundy covers, the cream page, the 3mm stage band, the progress fill, the stamp ring. So the first thing a family sees is white paper with pale gold text on it, which is close to invisible. Six other printables in this repo already guard against it (BucketSheet.tsx line 91, FriendsPoster.tsx line 160, CurriculumSheet.tsx line 188, HappyPaper.tsx line 92, CraftPack.tsx line 490, agreement/print/page.tsx line 139). The one object meant to feel premium is the one that does not. The lenses said fourteen printables. It is six. The finding still stands.

**Change.** Add `* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }` inside the @media print block on both pages, matching BucketSheet.tsx line 91. While you are in there, swap BURGUNDY for BURGUNDY_FLAT on the two cover panels and on the A6 cover and back. lib/pathway/passport-print-style.ts line 22 already exports it with the comment about banding on paper, and nothing in the repo has ever imported it. Add one line of screen copy above the print button: "Tick background graphics in the print box, or the cover comes out white."

### 3. Nothing about how to fold it ever reaches the paper

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/zine/page.tsx lines 95 and 118`  
**Effort** medium · **4 of 6 lenses agreed**

FOLD_STEPS renders inside the div with className gc-zine-screen, and the print rule sets that to display none. So the sheet that comes out has eight panels, one dashed line and the words "cut here only" at 4.9pt. The parent walks to the kitchen table and the instructions are on a laptop in another room. Step three is the one that ruins the sheet if it is misread. The class edition already solved this: schools/app/print/passport/[stage]/page.tsx prints a second landscape sheet carrying the same FOLD_STEPS and a numbered eight box diagram. The free version, the one going to a parent with no teacher in the room, prints less help than the classroom one.

**Change.** Make the print job two sheets. Sheet A is the passport, untouched. Sheet B carries the four FOLD_STEPS at a readable 11px, four simple line diagrams, the numbered four by two imposition diagram from the schools sheet with panel 1 tinted, and the schools self check line: "If the page numbers run one to eight as you turn, you folded it right." Print a small n of 8 in the outer bottom corner of all eight panels so that check is one a child can actually perform. Then fold one on real paper before it ships: the parent lens argues step one folds the cover inside out and I cannot settle that from source, and the panel numbers make it self correcting either way.

### 4. Five panels tell the child to stick a sticker and the free print gives them none

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 150 and 103`  
**Effort** medium · **4 of 6 lenses agreed**

Every stage panel prints a 15mm dashed box reading "Stick your sticker here", and panel 8 says the stickers live in the app and the sheet fills this book. There is no sheet. The sticker sheet only comes with the fourteen pound posted keepsake, which is what the A6 file means at line 124. The zine has borrowed the paid product's words. A six year old folds her passport, finds five empty boxes asking for something she has not got, and asks where they are. That is also the one claim on the object with no proof path, which review.md section 1 rule 5 blocks. Worth knowing: lib/content/stage-characters.ts already carries a `colouring` field, black and white line art made for printables, and neither print file uses it.

**Change.** Either put the five stage stamps and the earned stickers on Sheet B the way the schools route does, with "Print this on sticker paper if you have it, or plain paper and a glue stick", or change the words so the paper never promises what it cannot give. The cheap honest version tonight: draw the stage Friend's `colouring` line art inside the box, label it "Colour your stamp in here", and put "Stickers come with the posted passport" in faint mono underneath. Change panel 8 to read the number of stickers earned in the app so far, and that the posted passport comes with the sheet to stick them in. Keep "Stick your sticker here" only on the A6 file, which really does ship with a sheet.

### 5. The whole booklet is set between four and six point, so a child cannot read their own passport

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 83, 138, 151, 154, 164, 166`  
**Effort** medium · **4 of 6 lenses agreed**

A CSS pixel goes to paper at a 96th of an inch, so 5.5px is 4.1pt and 7.5px is 5.6pt. "Stick your sticker here", "The best thing I learned", "Stamped", "Not yet", "4 of 11" and "Check passed, page 3 of 5" are all about four point, in uppercase IBM Plex Mono at 0.12em tracking, which is the hardest setting to read small. On an inkjet on 80gsm the counters fill in and it greys out. The UK commercial floor is 6pt and a child wants 9pt. The A6 file sets the same material at 8 to 9.4pt, so the free edition is half the size of the paid one for no reason other than that ten things were packed into a 74mm by 105mm panel. The panel is the cause, not the type.

**Change.** Set a floor and cut content to reach it: nothing under 6.5pt for mono labels, nothing under 8pt for anything a child reads, and nothing under 8pt reversed out of burgundy. Buy the space by dropping the progress bar and lessons counter at lines 159 to 165, which say the same thing as the check line and are out of date the day after printing, and by dropping the second paragraph on panel 2 at lines 74 to 76. A real passport page carries about six elements. This one carries ten.

### 6. The two editions of the same passport disagree about how old the child is

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx lines 32 and 33`  
**Effort** small · **2 of 6 lenses agreed**

The A6 file hardcodes STAGE_NAMES and STAGE_AGES, with "Ages 11 to 13" and "Age 16 and up". lib/content/stages.ts, which the zine reads, says "Ages 11 to 12" and "Ages 16 and above". So the paper one a family folds tonight and the bound one they pay for print different ages on the same page, and the A6 one overlaps itself, putting a thirteen year old on two pages at once. passport-print-style.ts opens by saying the two have to be recognisably the same object.

**Change.** Delete both local arrays and read STAGES from lib/content/stages.ts exactly as the zine page does at lines 72 and 73. Add it to the guard that already holds shared/passport-areas.ts against the parents canon, so a rename can never land on paper in only one of the two files.

### 7. The fourteen pound cover carries a system emoji while the free one draws the mark properly

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx lines 107 to 113`  
**Effort** small · **4 of 6 lenses agreed**

Line 109 puts the passport control emoji at 30px inside the gold ring on the cover of the file a commercial printer receives. That is a blue and white glyph from another company's font in the middle of burgundy and gold, and it renders differently on the machine that made the preview and the machine that makes the PDF. PassportZineSheet.tsx lines 50 to 54 already refuse exactly this and explain why, drawing LOGO_BARS instead. So the paid object looks cheaper than the free one. Two smaller things in the same block: the cover's gold frame is an inset box-shadow and the print rule at line 74 sets box-shadow none important, so the gold rule the cover is built around is deleted from the printed file. And page-break-after always fires on the last page too, so the PDF comes out at ten pages with a blank at the back.

**Change.** Replace the emoji with the LOGO_BARS ring from PassportZineSheet.tsx lines 55 to 59 at 62px in gold. Change the gold frame to a real element, outline 3mm solid rgba(237,195,95,0.35) with outline-offset minus 3mm, so the print rule stops eating it. Add `.gc-pp-page:last-child { page-break-after: auto; break-after: auto; }`. Give the back page the same mark. Set an `art` field on the five stamp stickers in lib/stickers/catalog.ts lines 99 to 103, so the same emoji stops being the art for every stamp in the child's book too.

### 8. Parent strategy copy is printed in the middle of the child's own page

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx line 142`  
**Effort** medium · **4 of 6 lenses agreed**

The one sentence under the stamp on every page is STAGES[i].focus, written for the parent dashboard. So a five year old's passport reads "First relationships with technology, before habits form", and a thirteen year old's reads "Identity formation and digital footprint while the relationship still holds", which is a sentence about the parent's relationship with the child, printed on the child's keepsake. Same words for a Reception child and a Year 11. The class edition does this properly: schools/lib/passport-print.ts carries a strap and an about per edition, from "My first steps online" to "The last page before full access", plus young and signed flags that change type size and add a signature line. The zine page reads child.age_band at line 55 and then never uses it for register.

**Change.** Add a child facing strap per stage, five short lines in your voice, and print that in place of focus. Borrow the class edition's register so the home book and the school one read as one object: Foundation "My first steps online", Builder "Built by me, one lesson at a time", Explorer "Working out what is real", Shaper "Making choices", Independent "The last page before full access". Give page five a Signed and Date pair the way the Independent class edition does. Keep focus on the dashboard where it belongs.

### 9. There is no date anywhere, so a stamp is not a record

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 47 to 63 and 130 to 140`  
**Effort** medium · **2 of 6 lenses agreed**

The cover has the brand, the mark, the title, the name and the number, and no issue date. The stamp ring says Stamped with a tick and nothing else. The only time word on the whole sheet is "of 5 stamped today" on panel 2, and today is not a date, it is the moment of printing. So in 2038 a parent opens a drawer and cannot tell whether Alma stamped Foundation at five or at seven. A booklet printed tonight and one printed in three years are the same object. Every real passport has a date of issue and every school exercise book has the date at the top of the work. This is the cheapest thing standing between a keepsake and a status printout, and premium is the word doing the asking.

**Change.** Add issuedOn as a prop and print it on the cover under the number in mono at 6.5pt. Add stampedOn to ZineStage, read it from the stage progress the page already loads, and print it inside the ring under the word Stamped in British form, 16.09.26. On an unstamped page leave a short gold rule labelled "Stamped on" so the child writes it in when it comes. Set the fixture so two stages carry dates.

## Should fix

### Every finished page has a dotted worksheet box printed round it

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx line 183` · **Effort** small

All eight panels carry border 0.2mm dotted. Nothing on a zine is trimmed, so those rectangles survive into the finished book and every page of the keepsake, including the burgundy cover, is framed in a dotted box. That is the visual language of a photocopied worksheet, and it is the single thing stopping this reading as school quality work. It also means a child with scissors sees eight dotted boxes and one dashed line, with four point type to tell them apart.

**Change.** Remove the panel borders. Keep exactly one heavy dashed line on the sheet, the cut, so heavy dashed means scissors and nothing else does. The folds are marked by the outer edge ticks from the geometry fix.

### The scissors mark points at the wrong place and stays in the finished book

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 195 and 196` · **Effort** small

The slit runs correctly from 25 to 75 per cent, but the scissors sits at calc(25% minus 7mm), which is 7mm inside the first column, outside the slit. A parent who has never folded a zine reads that as start here, and you cannot start a cut in the middle of a flat sheet, so she cuts in from the paper edge and the sheet is dead. Both marks sit on artwork rather than in a margin, so after folding they print inside a finished page. There are no stops at either end of the slit. Two lenses also called the glyph a colour emoji; U plus 2702 defaults to text presentation, so that part is not established, but drawing it removes the doubt.

**Change.** Move the scissors inside the slit, just right of the 25 per cent end, drawn as a small inline SVG in PAGE_INK rather than a glyph. Put a 4mm tick at each end of the slit with the mono word STOP beside it. Change the centre label to "Fold first. Then cut this line, and stop at both marks." at 6.5pt. The same placement is at schools/app/print/passport/[stage]/page.tsx line 191 and wants the same fix.

### Two ruled lines 5mm apart, which no child in Stage 1 can write in

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 153 to 157` · **Effort** medium

"The best thing I learned" is followed by two rules five millimetres apart, drawn in the stage colour. A Reception or Year One child writes at 15mm to 20mm, Year Two at about 12mm, Year Five at 8mm. Five is smaller than a secondary exercise book, so the first word goes through both lines and the page looks spoiled on the first try. At the other end a fifteen year old gets two lines for a stage lasting three years, under a prompt that reads like the question at the end of a lesson. Drawing the rules in the stage colour is also where the burgundy and gold discipline turns into a rainbow: on stage 4 a child writes on purple lines.

**Change.** Rule by stage. Stages 1 and 2 get one line at 14mm under "Draw or write the best bit". Stage 3 gets two at 9mm. Stages 4 and 5 get three at 7mm under "What I would tell someone younger". Draw all rules in PAGE_INK_FAINT so writing sits on top of them rather than fights them. Size the sticker box to a real 25mm sticker, 28mm square, with the label outside the box rather than under the sticker.

### Not yet three times and Check to do five times, in a book handed over as a gift

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 138 and 166` · **Effort** small

Every unstamped page prints Not yet in a dashed ring and Check to do at the foot. For almost every real family that is three of five pages. But stages 4 and 5 belong to a thirteen and a sixteen year old: the child has not failed them, it is not their turn yet. And on the night a family signs up, which is the print that decides whether this is kept or binned, panel 2 opens on a large 0 at 18px. The class edition never does this; it ghosts the stamp shape and says nothing about absence.

**Change.** For a stage above the child's current one, print the age band in the ring instead of a status, so the page reads as ahead rather than missed. For the current stage, "On the way". Change "Check to do" to "Stage check still ahead". At zero stamped, print the date and "Your passport starts today" where the number was. From one up, change "of 5 stamped today" to "of 5 pages stamped so far".

### Emoji doing the work of the four areas on a burgundy and gold document

**Where** `/home/user/guided-childhood/shared/passport-areas.ts line 51, drawn at components/pathway/PassportZineSheet.tsx line 87` · **Effort** medium

AREA_EMOJI puts four colour glyphs at 7px on the inside cover. The shield and the scales carry variation selector 16, which forces colour presentation, so on a mono home printer, which is what most families own, they come out as two indistinguishable grey blobs under 2mm across. The robot is a stock glyph on a product whose whole cast is DiGi and the Planet Friends. components/kid/HappyIcon.tsx was built this month for exactly this reason, its comment saying the board was drawing the raw phone emoji, another company's artwork inside our circle plate. The A6 file does the same on its five section rows via lib/pathway/passport-sections.ts.

**Change.** Add four drawn icons to HappyIcon (a shield, scales, a friendly machine face, a speech pair) in the existing ink and crayon style, swap AREA_EMOJI for an AREA_ICON map of HappyIconName, and have passport-sections carry an icon name rather than an emoji string. Render at 3mm on the zine and 14px on the A6.

### The stamp is a tick from whatever font the machine has, while the class edition stamps with the child's Friend

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 124 and 137` · **Effort** medium

Line 137 renders a bare tick at 13px with no font family, so it falls through to whatever the machine substitutes. The Friend is already on the panel, and when the page is not stamped line 124 runs grayscale 1 at 45 per cent over glossy full colour art, which on a mono printer is a grey lump. schools/lib/passport-print.ts describes the same act far better: "Stick Pebble here. That is your stamp!" and "Four rings, four stickers, then Orbit here." And lib/content/stage-characters.ts already carries colouring, black and white line art made for printables, which neither print file uses.

**Change.** Make the ring the Friend. Stamped, draw the cutout inside the ring at about 12mm with the existing tilt and the mono label Stamped. Not stamped, draw the Friend's colouring line art in the dashed ring and label it with the Friend's real name. Pass colouring through ZineStage beside cutout. Same in the A6 file.

### The preview is a sideways scroll on a phone, so a parent approves a sheet they have never seen whole

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/zine/page.tsx line 129` · **Effort** small

The wrap is overflowX auto round a 297mm sheet, which is 1123 CSS pixels. On a 390px phone the parent sees a third of it and has to drag sideways twice to reach the cover. She cannot check whether her child's name fits before pressing print. components/printables/SheetScale.tsx exists for precisely this and was written after the Planet Friends poster scrambled on Teo's iPhone.

**Change.** Wrap PassportZineSheet in SheetScale at the sheet's pixel size, 1123 by 794. It measures its own width, scales with a transform every browser treats the same, and resets in print so the paper still gets true size. Do the same on app/ref-passport-zine/page.tsx.

### The ref fixture cannot catch any of the print faults it exists to catch

**Where** `/home/user/guided-childhood/app/ref-passport-zine/page.tsx` · **Effort** small

The comment says the fixture lets the fold be seen at both sizes and saved as a PDF, but the page carries no @page rule and no print block, so it prints A4 portrait and tells you nothing about fit. It is also not as awkward as it claims: the name is Alma Rose and the code is GC-4K7P, while supabase/migrations/227_passport_codes.sql builds codes as GC plus four plus four, twelve characters. Nobody has ever looked at a real code on the cover. Every panel is overflow hidden, so a long name is clipped in silence and nobody finds out until a family prints their own child's.

**Change.** Give the fixture the same @page rule and print block as the zine page, imported from one place so the two cannot drift. Add three cases behind a query string: the current mixed family, a long name with a real twelve character code, and a day one family with nothing earned and no code. Add scripts/check-passport-zine.mjs asserting the three things a human keeps missing: zoom is reset in print, print-color-adjust is present, and no font size on the sheet is under the 6.5pt floor.

### The A6 file is not yet something you can send a printer

**Where** `/home/user/guided-childhood/app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx line 69` · **Effort** medium

@page size A6 portrait with margin 0 is exact trim with zero bleed, so the full bleed burgundy cover and back will show white slivers after trimming, because no guillotine holds to nothing. There are no crop marks, so the printer has no trim reference at all. The decisions log says saddle stitch for the keepsake, and nine pages will not saddle stitch: booklets bind in multiples of four. A hand fulfilled fourteen pound keepsake fails at the first email to the print shop.

**Change.** Add a ?bleed=1 mode that sets the page box to 111mm by 154mm, runs the burgundy to that full size, draws a 105 by 148 trim rectangle and four corner crop marks in the 3mm band, and hides the screen chrome. Put a short spec block on the screen half so whoever fulfils the order can paste it into a quote form: A6 portrait, 3mm bleed, crop marks, supplied RGB from Chrome for conversion at the printer. The page count is a product question, below.

### Nothing on the passport is in anyone's handwriting, and a child with no name on file is called Your child

**Where** `/home/user/guided-childhood/components/pathway/PassportZineSheet.tsx lines 61, 68, 93 to 96 and 99 to 108` · **Effort** medium

Every identity mark is set type from a database field. There is no photo, no signature, nothing a parent wrote. Panel 2 ends on a screen statistic and panel 8 is a sticker counter that says 23 forever plus a paragraph pointing back at the app. Worse, when there is no child record both print pages fall back to the literal string Your child, so a child opens their passport and reads "This passport belongs to Your child". The class edition solves this with no pupil data at all: a label and a blank rule the child writes on.

**Change.** On panel 2, drop the stamped count block and the second paragraph and use the space for a 25mm by 32mm photo box with four gold corner marks labelled "Draw yourself, or stick a photo here", plus a gold rule labelled Signature. Turn panel 8 into "A word from home": five gold rules for a parent to write on, a signature rule, and the domain at the foot. When childName is the fallback, print the label and a blank rule rather than the words. Also drop the child's full name from the cover: it belongs on the data page at line 68, and a book left on a classroom desk does not need it on the front.

## Where the lenses disagreed

**Should the zine sheet be inset inside the paper or fill it?**

Sides: The teacher lens says copy the class edition, 279mm by 190mm inside an 8mm by 9mm margin. The prepress lens says 285mm by 198mm centred with a trim rectangle and "cut round this line first". The keepsake and parent lenses say keep 297mm by 210mm and set the page margin to zero.

Verdict: Keep 297 by 210 at margin zero. A zine's creases come from the paper's own edges, so a centred inset moves the quarter folds: the schools 279mm sheet puts the artwork quarter at 78.75mm while the paper quarter is at 74.25mm, which is 4.5mm out on both quarter folds and 2mm out vertically. That sheet only folds true if you trim to it first, which is why the prepress fix has to add a cutting step. Asking a family to cut an accurate 285mm rectangle out of A4 before they start is the opposite of the owner's ask. Full sheet, margin zero, 6mm of safe area held inside the panels, fold ticks on the outer edge so even a scaled print can be folded right. The schools sheet quietly has the same fault and is worth a separate look.

**Should the cover stay reversed out gold on burgundy?**

Sides: The keepsake lens wants it flipped to burgundy ink on cream with a gold double rule, because reversed out type is the most fragile thing you can put on a home printer. The child and prepress lenses want it kept but flattened and lighter on ink.

Verdict: Keep the flooded cover as the default, use BURGUNDY_FLAT rather than the gradient, and force the colour on. A flooded burgundy cover is what makes it read as a passport rather than a certificate, and that is the whole premium claim. The keepsake lens is right about the fragility, so lift the reversed out type to 8pt minimum and add a lighter on ink option on the screen for families who reprint often. The gradient goes either way: the style file has warned about banding since it was written and nothing has ever used the flat.

**Do the fold steps need rewriting or just printing?**

Sides: The parent lens says step one in shared/zine.ts folds the cover inside out and needs rewriting with the edges named. Four other lenses only say the steps never print.

Verdict: Print them first, and rewrite only if a folded sheet proves the parent lens right. I cannot settle a fold direction from source, and the same steps have already been through a classroom. What settles it for a family either way is the eight box diagram and a panel number on all eight panels, which the class edition prints and this one does not. Fold one on real paper before the PR goes up.

**Is the progress bar on the stage page worth keeping?**

Sides: Three lenses want it gone as a dashboard artefact that dates the object. Nobody defends it.

Verdict: Gone, on both editions. The check line beside it says the same thing in words, the panel needs the space to lift the type off four point, and a percentage printed on a keepsake records forever that a child was on 60 per cent on a Tuesday in September 2026. Same for the four progress bars and percentages on every A6 stage page.

## For Justin to decide

**Is the paper passport printed once and stamped as it fills, or reprinted every time a page stamps?**

Options: Today the screen says print it again whenever a page stamps, while the panels ask the child to stick a sticker and write two lines. Those two cannot both be true: the reprint puts the six year old's handwriting in the recycling. The alternative is print once, keep it, and release a small stamp printable the day a page stamps, which the child cuts out and sticks into the waiting ring.

Recommended: Print once and stamp as you go. It is the difference between a keepsake and a status report, it makes the object get better as it fills rather than being reissued fuller, and it gives you a reason to email a family on the best day they have had. Keep the reprint as a quiet link reading "Lost it? Print a fresh one." This is the biggest piece of work on the list, so it is a decision before it is a task.

**Does the free home print get a sticker sheet, or do we change the words?**

Options: A second A4 sheet with the five stage stamps and the stickers already earned, the way the schools route does it, costs the family one more sheet of paper and gives the child something to do tonight. Changing the copy to "colour your stamp in here" costs nothing and is honest, but gives them less.

Recommended: Ship the copy change this week so the paper stops promising what it cannot give, and put the sticker sheet on Sheet B in the same PR, since the fold guide is going on that sheet anyway. Same sheet, same print job.

**What are we actually sending the printer for the fourteen pound keepsake?**

Options: It is nine pages today and saddle stitch binds in fours. Twelve means adding pages the book wants anyway: a stamp record spread, a page for you to date and sign the last stamp, and a notes page. Eight means merging the stickers page into the back.

Recommended: Twelve. The three pages it needs to get there are the three that make it a record rather than a printout, and it is a better object to charge fourteen pounds for. One thing I need from you before anyone quotes it: which printer you want to use, so the bleed and crop spec is written to their template rather than to a guess.

## Dropped as wrong

A review that keeps everything it found is not a review. These were checked against
the files and did not survive:

- Copy the class edition's 279mm by 190mm inset. It throws both quarter folds 4.5mm out, because the artwork's quarters stop being the paper's quarters. The class sheet has the same fault and nobody has caught it there either.
- Inset the sheet to 285mm by 198mm and have the family cut round a trim line before folding. Correct prepress, wrong product. A parent at a kitchen table cutting an accurate 285mm rectangle out of A4 is where the evening ends.
- Print the passport code with thin spaces instead of hyphens to honour the no dashes rule. The code is an identifier, not copy, and it gets typed back in. It keeps its hyphens. Replacing the numero sign with a plain "Passport no." is a fair small tidy on its own merits.
- Fourteen other printables set print-color-adjust correctly. Six do. The finding is right, the count is not, and the count was being used to argue how obvious the omission was.
- The scissors glyph prints as a bright orange emoji. U plus 2702 with no variation selector defaults to text presentation, so this is not established. Its placement is the real problem, and drawing it settles the question anyway.
- The A6 file must go to twelve pages. That is a product decision with a price attached, not a defect, so it sits in your list rather than the build list.
- Add print-color-adjust inside PassportZineSheet itself so the fixture inherits it. Cleaner to give the fixture the same print block as the real page, imported from one place, which also fixes the fixture's missing @page rule at the same time.
