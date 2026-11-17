# The family week pack, 17 November 2026

Justin's own house: TV asked for first thing, an untidy room (11), hair not
done and not leaving on time, the front seat fight, homework checked, the
reading record, and missed school deadlines (ClassDojo, school app, emails).

## What already exists (do not rebuild)
- Fridge star chart, redesigned today (PR 1600).
- School catch: forward school emails, or a photo of a letter, and DiGi pulls
  out dates into school_actions (/dashboard/school, lib/school/extract.ts).
- Free taster pages with MagnetGate email capture (/free/[slug]).

## Build
1. Job menu: the flashpoints as ready made positive jobs in lib/quests/best-jobs
   (TV waits till dressed and breakfast; room reset before tea; hair and shoes
   by the door time; reading done and record signed; homework shown to a grown
   up). One tap onto the chart.
2. A second fridge sheet, "Our school week", one column per child:
   reading each day, homework and what is due, kit days, the front seat rota
   (a name per day, written before Monday, so nobody argues in the car), and a
   Sunday check box (Dojo, school app, emails). The clever link: the dates the
   app already caught from forwarded school emails print onto it.
3. A free version on /free/<slug> behind MagnetGate, ending at the stage check.
4. Carousel (family voice, GDC visual system, real sheets, no invented screens):
   one fight per slide and the row that settles it, last slide the free sheet.
   Children not named unless Justin approves (founder-context AMBER).
