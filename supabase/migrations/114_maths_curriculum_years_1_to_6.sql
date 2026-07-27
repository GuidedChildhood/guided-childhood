-- Guided Childhood — Migration 114
-- The England maths curriculum, years 1 to 6, complete.
--
-- Migration 108 shipped 18 Year 4 objectives and said plainly why it stopped
-- there: the statutory documents were blocked by this workspace egress policy,
-- so the rest was left out rather than written from memory. Justin supplied the
-- programmes of study directly on 27 July. This is the rest.
--
-- ── Where every line came from ───────────────────────────────────────────────
--
-- Two published versions of the same statutory instrument, read together:
--
--   * National curriculum in England: mathematics programmes of study, the
--     GOV.UK version updated 28 September 2021. This is the current published
--     text and the wording stored here.
--   * The September 2013 PDF of the same document (DFE-00180-2013), used as the
--     control on structure.
--
-- The wording is the 2021 text because that is what is current, which is why the
-- rows read 10s and 1s rather than tens and ones, and 2 rather than two. It is
-- reproduced exactly, including one obvious slip in the GOV.UK rendering, Year 2
-- statistics ask-and-answer, which is left alone: verbatim has to mean verbatim
-- or it means nothing.
--
-- ── Why two versions, and what the second one caught ─────────────────────────
--
-- The 2021 web rendering nests four requirements one level too deep, sweeping
-- them into the requirement above them. In Year 1 measurement it buries coins
-- and notes, and sequencing events, inside measure and begin to record. In Year
-- 5 geometry it buries the rectangles rule and the regular polygons rule inside
-- identify. All four are top level statutory requirements in the 2013 PDF, and
-- they are top level here. Every one of the seven nested groups in years 1 to 6
-- was checked line by line against the 2013 text, and those four are the only
-- places the two renderings disagree.
--
-- Where a requirement genuinely does have sub points, they are folded into the
-- one row with the lead in kept, because a row reading only mass/weight is not
-- an objective a parent can do anything with.
--
-- ── The term is ours. The wording is not. ────────────────────────────────────
--
-- This matters and is easy to lose later. The programmes of study are set out
-- YEAR by year and say nothing whatsoever about terms. Schools are only required
-- to cover the year by the end of the year and may order it as they wish.
--
-- So `verbatim` true on these rows is a claim about the WORDING only. Which term
-- a strand falls in is our own sequencing, applied consistently: number and
-- place value and the written methods in autumn, multiplication, division,
-- fractions and ratio in spring, measurement, geometry, statistics and algebra
-- in summer. It follows the order the programme of study itself lists the
-- strands in, which is broadly how primaries work through them, and it matches
-- the placements migration 108 already made.
--
-- A sheet is therefore honest about the year and approximate about the term. If
-- that is ever surfaced to a parent as a claim about their school's plan, it
-- needs a caveat, because their school may sequence differently.
--
-- Year 4 tables recall is deliberately in both spring and summer: the strand is
-- worked in spring but the multiplication tables check sits in June, so a summer
-- sheet that dropped it would miss the one thing parents are anxious about.
--
-- SATs are not flagged. Year 6 SATs cover the whole of key stage 2 maths, so
-- flagging a handful of Year 6 rows would say something untrue about the rest.
--
-- ── The 18 rows from 108 are replaced, not added to ──────────────────────────
--
-- Some of them carry lightly trimmed wording (convert between different units of
-- measure, without its worked example). Left in place they would sit alongside
-- the full text as near duplicates and a Year 4 sheet would show the objective
-- twice. They are deleted by their own source string and reinserted complete.
--
-- Objective ids therefore change for Year 4. learning_sheet_results.tricky holds
-- ids rather than a foreign key, so nothing breaks, but a flag recorded against
-- an old Year 4 id stops resolving. The sheet shipped hours before this, so in
-- practice there is nothing to lose, and a stale id renders as nothing rather
-- than as something wrong.
--
-- ── Supabase editor rules ────────────────────────────────────────────────────
--
-- Idempotent creates, no DO blocks, flat statements only, and no semicolons
-- inside string literals: the dashboard splits statements naively and a
-- semicolon in copy breaks the paste (learned in production, 3 July). The
-- statutory text genuinely contains semicolons, so they are spliced in with
-- chr(59). No literal semicolon sits inside any string literal below, and the
-- stored value is byte for byte the published text.
-- ── Apostrophes are spliced too, and this is why ────────────────────────────
--
-- 27 July: pasting this file failed with relation "phonemes" does not exist,
-- which made no sense until the cause turned up. Something between the file
-- and the database collapses the doubled quote in I''m back to a single one.
-- That closes the literal early, flips quote parity for every row after it,
-- and the parser eventually reads the words into phonemes as insert into
-- phonemes. Smaller files did not help because size was never the problem.
--
-- So there is NO doubled quote anywhere below. Apostrophes come from chr(39)
-- and semicolons from chr(59), exactly as the statutory text needs them, and
-- nothing in the paste path has an escape left to mangle. Keep it that way.


delete from public.curriculum_objectives
  where curriculum = 'england'
    and subject = 'maths'
    and source = 'National curriculum in England, mathematics programmes of study, year 4';

insert into public.curriculum_objectives (year_group,subject,term,strand,objective,source,verbatim,checkpoint,sort_order) values
(1,'maths','autumn','Number and place value','count to and across 100, forwards and backwards, beginning with 0 or 1, or from any given number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,10),
(1,'maths','autumn','Number and place value','count, read and write numbers to 100 in numerals' || chr(59) || ' count in multiples of 2s, 5s and 10s','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,20),
(1,'maths','autumn','Number and place value','given a number, identify 1 more and 1 less','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,30),
(1,'maths','autumn','Number and place value','identify and represent numbers using objects and pictorial representations including the number line, and use the language of: equal to, more than, less than (fewer), most, least','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,40),
(1,'maths','autumn','Number and place value','read and write numbers from 1 to 20 in numerals and words','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,50),
(1,'maths','autumn','Addition and subtraction','read, write and interpret mathematical statements involving addition (+), subtraction (−) and equals (=) signs','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,60),
(1,'maths','autumn','Addition and subtraction','represent and use number bonds and related subtraction facts within 20','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,70),
(1,'maths','autumn','Addition and subtraction','add and subtract one-digit and two-digit numbers to 20, including 0','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,80),
(1,'maths','autumn','Addition and subtraction','solve one-step problems that involve addition and subtraction, using concrete objects and pictorial representations, and missing number problems such as 7 = ? − 9','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,90),
(1,'maths','spring','Multiplication and division','solve one-step problems involving multiplication and division, by calculating the answer using concrete objects, pictorial representations and arrays with the support of the teacher','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,10),
(1,'maths','spring','Fractions','recognise, find and name a half as 1 of 2 equal parts of an object, shape or quantity','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,20),
(1,'maths','spring','Fractions','recognise, find and name a quarter as 1 of 4 equal parts of an object, shape or quantity','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,30),
(1,'maths','summer','Measurement','compare, describe and solve practical problems for: lengths and heights [for example, long/short, longer/shorter, tall/short, double/half]' || chr(59) || ' mass/weight [for example, heavy/light, heavier than, lighter than]' || chr(59) || ' capacity and volume [for example, full/empty, more than, less than, half, half full, quarter]' || chr(59) || ' time [for example, quicker, slower, earlier, later]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,10),
(1,'maths','summer','Measurement','measure and begin to record the following: lengths and heights' || chr(59) || ' mass/weight' || chr(59) || ' capacity and volume' || chr(59) || ' time (hours, minutes, seconds)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,20),
(1,'maths','summer','Measurement','recognise and know the value of different denominations of coins and notes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,30),
(1,'maths','summer','Measurement','sequence events in chronological order using language [for example, before and after, next, first, today, yesterday, tomorrow, morning, afternoon and evening]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,40),
(1,'maths','summer','Measurement','recognise and use language relating to dates, including days of the week, weeks, months and years','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,50),
(1,'maths','summer','Measurement','tell the time to the hour and half past the hour and draw the hands on a clock face to show these times','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,60),
(1,'maths','summer','Geometry properties of shapes','recognise and name common 2-D and 3-D shapes, including: 2-D shapes [for example, rectangles (including squares), circles and triangles]' || chr(59) || ' 3-D shapes [for example, cuboids (including cubes), pyramids and spheres]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,70),
(1,'maths','summer','Geometry position and direction','describe position, direction and movement, including whole, half, quarter and three-quarter turns','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 1',true,null,80),
(2,'maths','autumn','Number and place value','count in steps of 2, 3, and 5 from 0, and in 10s from any number, forward and backward','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,10),
(2,'maths','autumn','Number and place value','recognise the place value of each digit in a two-digit number (10s, 1s)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,20),
(2,'maths','autumn','Number and place value','identify, represent and estimate numbers using different representations, including the number line','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,30),
(2,'maths','autumn','Number and place value','compare and order numbers from 0 up to 100' || chr(59) || ' use <, > and = signs','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,40),
(2,'maths','autumn','Number and place value','read and write numbers to at least 100 in numerals and in words','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,50),
(2,'maths','autumn','Number and place value','use place value and number facts to solve problems','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,60),
(2,'maths','autumn','Addition and subtraction','solve problems with addition and subtraction: using concrete objects and pictorial representations, including those involving numbers, quantities and measures' || chr(59) || ' applying their increasing knowledge of mental and written methods','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,70),
(2,'maths','autumn','Addition and subtraction','recall and use addition and subtraction facts to 20 fluently, and derive and use related facts up to 100','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,80),
(2,'maths','autumn','Addition and subtraction','add and subtract numbers using concrete objects, pictorial representations, and mentally, including: a two-digit number and 1s' || chr(59) || ' a two-digit number and 10s' || chr(59) || ' 2 two-digit numbers' || chr(59) || ' adding 3 one-digit numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,90),
(2,'maths','autumn','Addition and subtraction','show that addition of 2 numbers can be done in any order (commutative) and subtraction of 1 number from another cannot','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,100),
(2,'maths','autumn','Addition and subtraction','recognise and use the inverse relationship between addition and subtraction and use this to check calculations and solve missing number problems','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,110),
(2,'maths','spring','Multiplication and division','recall and use multiplication and division facts for the 2, 5 and 10 multiplication tables, including recognising odd and even numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,10),
(2,'maths','spring','Multiplication and division','calculate mathematical statements for multiplication and division within the multiplication tables and write them using the multiplication (×), division (÷) and equals (=) signs','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,20),
(2,'maths','spring','Multiplication and division','show that multiplication of 2 numbers can be done in any order (commutative) and division of 1 number by another cannot','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,30),
(2,'maths','spring','Multiplication and division','solve problems involving multiplication and division, using materials, arrays, repeated addition, mental methods, and multiplication and division facts, including problems in contexts','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,40),
(2,'maths','spring','Fractions','recognise, find, name and write fractions 1/3, 1/4, 2/4 and 3/4 of a length, shape, set of objects or quantity','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,50),
(2,'maths','spring','Fractions','write simple fractions, for example 1/2 of 6 = 3 and recognise the equivalence of 2/4 and 1/2','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,60),
(2,'maths','summer','Measurement','choose and use appropriate standard units to estimate and measure length/height in any direction (m/cm)' || chr(59) || ' mass (kg/g)' || chr(59) || ' temperature (°C)' || chr(59) || ' capacity (litres/ml) to the nearest appropriate unit, using rulers, scales, thermometers and measuring vessels','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,10),
(2,'maths','summer','Measurement','compare and order lengths, mass, volume/capacity and record the results using >, < and =','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,20),
(2,'maths','summer','Measurement','recognise and use symbols for pounds (£) and pence (p)' || chr(59) || ' combine amounts to make a particular value','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,30)
on conflict (curriculum,year_group,subject,term,objective) do nothing;

insert into public.curriculum_objectives (year_group,subject,term,strand,objective,source,verbatim,checkpoint,sort_order) values
(2,'maths','summer','Measurement','find different combinations of coins that equal the same amounts of money','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,40),
(2,'maths','summer','Measurement','solve simple problems in a practical context involving addition and subtraction of money of the same unit, including giving change','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,50),
(2,'maths','summer','Measurement','compare and sequence intervals of time','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,60),
(2,'maths','summer','Measurement','tell and write the time to five minutes, including quarter past/to the hour and draw the hands on a clock face to show these times','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,70),
(2,'maths','summer','Measurement','know the number of minutes in an hour and the number of hours in a day','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,80),
(2,'maths','summer','Geometry properties of shapes','identify and describe the properties of 2-D shapes, including the number of sides, and line symmetry in a vertical line','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,90),
(2,'maths','summer','Geometry properties of shapes','identify and describe the properties of 3-D shapes, including the number of edges, vertices and faces','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,100),
(2,'maths','summer','Geometry properties of shapes','identify 2-D shapes on the surface of 3-D shapes, [for example, a circle on a cylinder and a triangle on a pyramid]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,110),
(2,'maths','summer','Geometry properties of shapes','compare and sort common 2-D and 3-D shapes and everyday objects','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,120),
(2,'maths','summer','Geometry position and direction','order and arrange combinations of mathematical objects in patterns and sequences','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,130),
(2,'maths','summer','Geometry position and direction','use mathematical vocabulary to describe position, direction and movement, including movement in a straight line and distinguishing between rotation as a turn and in terms of right angles for quarter, half and three-quarter turns (clockwise and anti-clockwise)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,140),
(2,'maths','summer','Statistics','interpret and construct simple pictograms, tally charts, block diagrams and tables','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,150),
(2,'maths','summer','Statistics','ask and answer simple questions by counting the number of objects in each category and sorting the categories by quantity','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,160),
(2,'maths','summer','Statistics','ask-and-answer questions about totalling and comparing categorical data','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 2',true,null,170),
(3,'maths','autumn','Number and place value','count from 0 in multiples of 4, 8, 50 and 100' || chr(59) || ' find 10 or 100 more or less than a given number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,10),
(3,'maths','autumn','Number and place value','recognise the place value of each digit in a 3-digit number (100s, 10s, 1s)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,20),
(3,'maths','autumn','Number and place value','compare and order numbers up to 1,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,30),
(3,'maths','autumn','Number and place value','identify, represent and estimate numbers using different representations','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,40),
(3,'maths','autumn','Number and place value','read and write numbers up to 1,000 in numerals and in words','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,50),
(3,'maths','autumn','Number and place value','solve number problems and practical problems involving these ideas','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,60),
(3,'maths','autumn','Addition and subtraction','add and subtract numbers mentally, including: a three-digit number and 1s' || chr(59) || ' a three-digit number and 10s' || chr(59) || ' a three-digit number and 100s','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,70),
(3,'maths','autumn','Addition and subtraction','add and subtract numbers with up to 3 digits, using formal written methods of columnar addition and subtraction','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,80),
(3,'maths','autumn','Addition and subtraction','estimate the answer to a calculation and use inverse operations to check answers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,90),
(3,'maths','autumn','Addition and subtraction','solve problems, including missing number problems, using number facts, place value, and more complex addition and subtraction','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,100),
(3,'maths','spring','Multiplication and division','recall and use multiplication and division facts for the 3, 4 and 8 multiplication tables','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,10),
(3,'maths','spring','Multiplication and division','write and calculate mathematical statements for multiplication and division using the multiplication tables that they know, including for two-digit numbers times one-digit numbers, using mental and progressing to formal written methods','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,20),
(3,'maths','spring','Multiplication and division','solve problems, including missing number problems, involving multiplication and division, including positive integer scaling problems and correspondence problems in which n objects are connected to m objects','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,30),
(3,'maths','spring','Fractions','count up and down in tenths' || chr(59) || ' recognise that tenths arise from dividing an object into 10 equal parts and in dividing one-digit numbers or quantities by 10','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,40),
(3,'maths','spring','Fractions','recognise, find and write fractions of a discrete set of objects: unit fractions and non-unit fractions with small denominators','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,50),
(3,'maths','spring','Fractions','recognise and use fractions as numbers: unit fractions and non-unit fractions with small denominators','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,60),
(3,'maths','spring','Fractions','recognise and show, using diagrams, equivalent fractions with small denominators','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,70),
(3,'maths','spring','Fractions','add and subtract fractions with the same denominator within one whole [for example, 5/7+1/7 = 6/7]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,80),
(3,'maths','spring','Fractions','compare and order unit fractions, and fractions with the same denominators','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,90),
(3,'maths','spring','Fractions','solve problems that involve all of the above','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,100),
(3,'maths','summer','Measurement','measure, compare, add and subtract: lengths (m/cm/mm)' || chr(59) || ' mass (kg/g)' || chr(59) || ' volume/capacity (l/ml)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,10),
(3,'maths','summer','Measurement','measure the perimeter of simple 2-D shapes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,20),
(3,'maths','summer','Measurement','add and subtract amounts of money to give change, using both £ and p in practical contexts','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,30),
(3,'maths','summer','Measurement','tell and write the time from an analogue clock, including using Roman numerals from I to XII, and 12-hour and 24-hour clocks','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,40),
(3,'maths','summer','Measurement','estimate and read time with increasing accuracy to the nearest minute' || chr(59) || ' record and compare time in terms of seconds, minutes and hours' || chr(59) || ' use vocabulary such as o' || chr(39) || 'clock, am/pm, morning, afternoon, noon and midnight','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,50),
(3,'maths','summer','Measurement','know the number of seconds in a minute and the number of days in each month, year and leap year','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,60),
(3,'maths','summer','Measurement','compare durations of events [for example, to calculate the time taken by particular events or tasks]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,70),
(3,'maths','summer','Geometry properties of shapes','draw 2-D shapes and make 3-D shapes using modelling materials' || chr(59) || ' recognise 3- D shapes in different orientations and describe them','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,80),
(3,'maths','summer','Geometry properties of shapes','recognise angles as a property of shape or a description of a turn','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,90)
on conflict (curriculum,year_group,subject,term,objective) do nothing;

insert into public.curriculum_objectives (year_group,subject,term,strand,objective,source,verbatim,checkpoint,sort_order) values
(3,'maths','summer','Geometry properties of shapes','identify right angles, recognise that 2 right angles make a half-turn, 3 make three-quarters of a turn and 4 a complete turn' || chr(59) || ' identify whether angles are greater than or less than a right angle','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,100),
(3,'maths','summer','Geometry properties of shapes','identify horizontal and vertical lines and pairs of perpendicular and parallel lines','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,110),
(3,'maths','summer','Statistics','interpret and present data using bar charts, pictograms and tables','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,120),
(3,'maths','summer','Statistics','solve one-step and two-step questions [for example ' || chr(39) || 'How many more?' || chr(39) || ' and ' || chr(39) || 'How many fewer?' || chr(39) || '] using information presented in scaled bar charts and pictograms and tables','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 3',true,null,130),
(4,'maths','autumn','Number and place value','count in multiples of 6, 7, 9, 25 and 1,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,10),
(4,'maths','autumn','Number and place value','find 1,000 more or less than a given number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,20),
(4,'maths','autumn','Number and place value','count backwards through 0 to include negative numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,30),
(4,'maths','autumn','Number and place value','recognise the place value of each digit in a four-digit number (1,000s, 100s, 10s, and 1s)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,40),
(4,'maths','autumn','Number and place value','order and compare numbers beyond 1,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,50),
(4,'maths','autumn','Number and place value','identify, represent and estimate numbers using different representations','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,60),
(4,'maths','autumn','Number and place value','round any number to the nearest 10, 100 or 1,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,70),
(4,'maths','autumn','Number and place value','solve number and practical problems that involve all of the above and with increasingly large positive numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,80),
(4,'maths','autumn','Number and place value','read Roman numerals to 100 (I to C) and know that over time, the numeral system changed to include the concept of 0 and place value','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,90),
(4,'maths','autumn','Addition and subtraction','add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,100),
(4,'maths','autumn','Addition and subtraction','estimate and use inverse operations to check answers to a calculation','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,110),
(4,'maths','autumn','Addition and subtraction','solve addition and subtraction two-step problems in contexts, deciding which operations and methods to use and why','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,120),
(4,'maths','spring','Multiplication and division','recall multiplication and division facts for multiplication tables up to 12 × 12','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,'multiplication_tables_check',10),
(4,'maths','spring','Multiplication and division','use place value, known and derived facts to multiply and divide mentally, including: multiplying by 0 and 1' || chr(59) || ' dividing by 1' || chr(59) || ' multiplying together 3 numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,20),
(4,'maths','spring','Multiplication and division','recognise and use factor pairs and commutativity in mental calculations','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,30),
(4,'maths','spring','Multiplication and division','multiply two-digit and three-digit numbers by a one-digit number using formal written layout','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,40),
(4,'maths','spring','Multiplication and division','solve problems involving multiplying and adding, including using the distributive law to multiply two-digit numbers by 1 digit, integer scaling problems and harder correspondence problems such as n objects are connected to m objects','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,50),
(4,'maths','spring','Fractions (including decimals)','recognise and show, using diagrams, families of common equivalent fractions','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,60),
(4,'maths','spring','Fractions (including decimals)','count up and down in hundredths' || chr(59) || ' recognise that hundredths arise when dividing an object by 100 and dividing tenths by 10','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,70),
(4,'maths','spring','Fractions (including decimals)','solve problems involving increasingly harder fractions to calculate quantities, and fractions to divide quantities, including non-unit fractions where the answer is a whole number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,80),
(4,'maths','spring','Fractions (including decimals)','add and subtract fractions with the same denominator','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,90),
(4,'maths','spring','Fractions (including decimals)','recognise and write decimal equivalents of any number of tenths or hundreds','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,100),
(4,'maths','spring','Fractions (including decimals)','recognise and write decimal equivalents to 1/4, 1/2, 3/4','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,110),
(4,'maths','spring','Fractions (including decimals)','find the effect of dividing a one- or two-digit number by 10 and 100, identifying the value of the digits in the answer as ones, tenths and hundredths','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,120),
(4,'maths','spring','Fractions (including decimals)','round decimals with 1 decimal place to the nearest whole number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,130),
(4,'maths','spring','Fractions (including decimals)','compare numbers with the same number of decimal places up to 2 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,140),
(4,'maths','spring','Fractions (including decimals)','solve simple measure and money problems involving fractions and decimals to 2 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,150),
(4,'maths','summer','Measurement','convert between different units of measure [for example, kilometre to metre' || chr(59) || ' hour to minute]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,10),
(4,'maths','summer','Measurement','measure and calculate the perimeter of a rectilinear figure (including squares) in centimetres and metres','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,20),
(4,'maths','summer','Measurement','find the area of rectilinear shapes by counting squares','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,30),
(4,'maths','summer','Measurement','estimate, compare and calculate different measures, including money in pounds and pence','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,40),
(4,'maths','summer','Measurement','read, write and convert time between analogue and digital 12- and 24-hour clocks','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,50),
(4,'maths','summer','Measurement','solve problems involving converting from hours to minutes, minutes to seconds, years to months, weeks to days','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,60),
(4,'maths','summer','Geometry properties of shapes','compare and classify geometric shapes, including quadrilaterals and triangles, based on their properties and sizes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,70),
(4,'maths','summer','Geometry properties of shapes','identify acute and obtuse angles and compare and order angles up to 2 right angles by size','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,80),
(4,'maths','summer','Geometry properties of shapes','identify lines of symmetry in 2-D shapes presented in different orientations','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,90),
(4,'maths','summer','Geometry properties of shapes','complete a simple symmetric figure with respect to a specific line of symmetry','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,100),
(4,'maths','summer','Geometry position and direction','describe positions on a 2-D grid as coordinates in the first quadrant','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,110),
(4,'maths','summer','Geometry position and direction','describe movements between positions as translations of a given unit to the left/right and up/down','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,120),
(4,'maths','summer','Geometry position and direction','plot specified points and draw sides to complete a given polygon','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,130)
on conflict (curriculum,year_group,subject,term,objective) do nothing;

insert into public.curriculum_objectives (year_group,subject,term,strand,objective,source,verbatim,checkpoint,sort_order) values
(4,'maths','summer','Statistics','interpret and present discrete and continuous data using appropriate graphical methods, including bar charts and time graphs','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,140),
(4,'maths','summer','Statistics','solve comparison, sum and difference problems using information presented in bar charts, pictograms, tables and other graphs','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,null,150),
(5,'maths','autumn','Number and place value','read, write, order and compare numbers to at least 1,000,000 and determine the value of each digit','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,10),
(5,'maths','autumn','Number and place value','count forwards or backwards in steps of powers of 10 for any given number up to 1,000,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,20),
(5,'maths','autumn','Number and place value','interpret negative numbers in context, count forwards and backwards with positive and negative whole numbers, including through 0','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,30),
(5,'maths','autumn','Number and place value','round any number up to 1,000,000 to the nearest 10, 100, 1,000, 10,000 and 100,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,40),
(5,'maths','autumn','Number and place value','solve number problems and practical problems that involve all of the above','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,50),
(5,'maths','autumn','Number and place value','read Roman numerals to 1,000 (M) and recognise years written in Roman numerals','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,60),
(5,'maths','autumn','Addition and subtraction','add and subtract whole numbers with more than 4 digits, including using formal written methods (columnar addition and subtraction)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,70),
(5,'maths','autumn','Addition and subtraction','add and subtract numbers mentally with increasingly large numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,80),
(5,'maths','autumn','Addition and subtraction','use rounding to check answers to calculations and determine, in the context of a problem, levels of accuracy','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,90),
(5,'maths','autumn','Addition and subtraction','solve addition and subtraction multi-step problems in contexts, deciding which operations and methods to use and why','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,100),
(5,'maths','spring','Multiplication and division','identify multiples and factors, including finding all factor pairs of a number, and common factors of 2 numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,10),
(5,'maths','spring','Multiplication and division','know and use the vocabulary of prime numbers, prime factors and composite (non-prime) numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,20),
(5,'maths','spring','Multiplication and division','establish whether a number up to 100 is prime and recall prime numbers up to 19','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,30),
(5,'maths','spring','Multiplication and division','multiply numbers up to 4 digits by a one- or two-digit number using a formal written method, including long multiplication for two-digit numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,40),
(5,'maths','spring','Multiplication and division','multiply and divide numbers mentally, drawing upon known facts','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,50),
(5,'maths','spring','Multiplication and division','divide numbers up to 4 digits by a one-digit number using the formal written method of short division and interpret remainders appropriately for the context','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,60),
(5,'maths','spring','Multiplication and division','multiply and divide whole numbers and those involving decimals by 10, 100 and 1,000','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,70),
(5,'maths','spring','Multiplication and division','recognise and use square numbers and cube numbers, and the notation for squared (²) and cubed (³)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,80),
(5,'maths','spring','Multiplication and division','solve problems involving multiplication and division, including using their knowledge of factors and multiples, squares and cubes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,90),
(5,'maths','spring','Multiplication and division','solve problems involving addition, subtraction, multiplication and division and a combination of these, including understanding the meaning of the equals sign','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,100),
(5,'maths','spring','Multiplication and division','solve problems involving multiplication and division, including scaling by simple fractions and problems involving simple rates','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,110),
(5,'maths','spring','Fractions (including decimals and percentages)','compare and order fractions whose denominators are all multiples of the same number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,120),
(5,'maths','spring','Fractions (including decimals and percentages)','identify, name and write equivalent fractions of a given fraction, represented visually, including tenths and hundredths','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,130),
(5,'maths','spring','Fractions (including decimals and percentages)','recognise mixed numbers and improper fractions and convert from one form to the other and write mathematical statements > 1 as a mixed number [for example, 2/5+4/5 = 6/5 = 1 1/5 ]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,140),
(5,'maths','spring','Fractions (including decimals and percentages)','add and subtract fractions with the same denominator, and denominators that are multiples of the same number','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,150),
(5,'maths','spring','Fractions (including decimals and percentages)','multiply proper fractions and mixed numbers by whole numbers, supported by materials and diagrams','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,160),
(5,'maths','spring','Fractions (including decimals and percentages)','read and write decimal numbers as fractions [for example, 0.71 = 71/100 ]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,170),
(5,'maths','spring','Fractions (including decimals and percentages)','recognise and use thousandths and relate them to tenths, hundredths and decimal equivalents','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,180),
(5,'maths','spring','Fractions (including decimals and percentages)','round decimals with 2 decimal places to the nearest whole number and to 1 decimal place','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,190),
(5,'maths','spring','Fractions (including decimals and percentages)','read, write, order and compare numbers with up to 3 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,200),
(5,'maths','spring','Fractions (including decimals and percentages)','solve problems involving number up to 3 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,210),
(5,'maths','spring','Fractions (including decimals and percentages)','recognise the per cent symbol (%) and understand that per cent relates to ' || chr(39) || 'number of parts per 100' || chr(39) || ', and write percentages as a fraction with denominator 100, and as a decimal fraction','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,220),
(5,'maths','spring','Fractions (including decimals and percentages)','solve problems which require knowing percentage and decimal equivalents of 1/2, 1/4, 1/5, 2/5, 4/5 and those fractions with a denominator of a multiple of 10 or 25','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,230),
(5,'maths','summer','Measurement','convert between different units of metric measure [for example, kilometre and metre' || chr(59) || ' centimetre and metre' || chr(59) || ' centimetre and millimetre' || chr(59) || ' gram and kilogram' || chr(59) || ' litre and millilitre]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,10),
(5,'maths','summer','Measurement','understand and use approximate equivalences between metric units and common imperial units such as inches, pounds and pints','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,20),
(5,'maths','summer','Measurement','measure and calculate the perimeter of composite rectilinear shapes in centimetres and metres','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,30),
(5,'maths','summer','Measurement','calculate and compare the area of rectangles (including squares), including using standard units, square centimetres (cm²) and square metres (m²), and estimate the area of irregular shapes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,40),
(5,'maths','summer','Measurement','estimate volume [for example, using 1 cm³ blocks to build cuboids (including cubes)] and capacity [for example, using water]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,50),
(5,'maths','summer','Measurement','solve problems involving converting between units of time','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,60)
on conflict (curriculum,year_group,subject,term,objective) do nothing;

insert into public.curriculum_objectives (year_group,subject,term,strand,objective,source,verbatim,checkpoint,sort_order) values
(5,'maths','summer','Measurement','use all four operations to solve problems involving measure [for example, length, mass, volume, money] using decimal notation, including scaling','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,70),
(5,'maths','summer','Geometry properties of shapes','identify 3-D shapes, including cubes and other cuboids, from 2-D representations','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,80),
(5,'maths','summer','Geometry properties of shapes','know angles are measured in degrees: estimate and compare acute, obtuse and reflex angles','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,90),
(5,'maths','summer','Geometry properties of shapes','draw given angles, and measure them in degrees (°)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,100),
(5,'maths','summer','Geometry properties of shapes','identify: angles at a point and 1 whole turn (total 360°)' || chr(59) || ' angles at a point on a straight line and half a turn (total 180°)' || chr(59) || ' other multiples of 90°','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,110),
(5,'maths','summer','Geometry properties of shapes','use the properties of rectangles to deduce related facts and find missing lengths and angles','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,120),
(5,'maths','summer','Geometry properties of shapes','distinguish between regular and irregular polygons based on reasoning about equal sides and angles','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,130),
(5,'maths','summer','Geometry position and direction','identify, describe and represent the position of a shape following a reflection or translation, using the appropriate language, and know that the shape has not changed','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,140),
(5,'maths','summer','Statistics','solve comparison, sum and difference problems using information presented in a line graph','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,150),
(5,'maths','summer','Statistics','complete, read and interpret information in tables, including timetables','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 5',true,null,160),
(6,'maths','autumn','Number and place value','read, write, order and compare numbers up to 10,000,000 and determine the value of each digit','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,10),
(6,'maths','autumn','Number and place value','round any whole number to a required degree of accuracy','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,20),
(6,'maths','autumn','Number and place value','use negative numbers in context, and calculate intervals across 0','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,30),
(6,'maths','autumn','Number and place value','solve number and practical problems that involve all of the above','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,40),
(6,'maths','autumn','Addition, subtraction, multiplication and division','multiply multi-digit numbers up to 4 digits by a two-digit whole number using the formal written method of long multiplication','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,50),
(6,'maths','autumn','Addition, subtraction, multiplication and division','divide numbers up to 4 digits by a two-digit whole number using the formal written method of long division, and interpret remainders as whole number remainders, fractions, or by rounding, as appropriate for the context','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,60),
(6,'maths','autumn','Addition, subtraction, multiplication and division','divide numbers up to 4 digits by a two-digit number using the formal written method of short division where appropriate, interpreting remainders according to the context','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,70),
(6,'maths','autumn','Addition, subtraction, multiplication and division','perform mental calculations, including with mixed operations and large numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,80),
(6,'maths','autumn','Addition, subtraction, multiplication and division','identify common factors, common multiples and prime numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,90),
(6,'maths','autumn','Addition, subtraction, multiplication and division','use their knowledge of the order of operations to carry out calculations involving the 4 operations','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,100),
(6,'maths','autumn','Addition, subtraction, multiplication and division','solve addition and subtraction multi-step problems in contexts, deciding which operations and methods to use and why','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,110),
(6,'maths','autumn','Addition, subtraction, multiplication and division','solve problems involving addition, subtraction, multiplication and division','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,120),
(6,'maths','autumn','Addition, subtraction, multiplication and division','use estimation to check answers to calculations and determine, in the context of a problem, an appropriate degree of accuracy','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,130),
(6,'maths','spring','Fractions (including decimals and percentages)','use common factors to simplify fractions' || chr(59) || ' use common multiples to express fractions in the same denomination','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,10),
(6,'maths','spring','Fractions (including decimals and percentages)','compare and order fractions, including fractions >1','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,20),
(6,'maths','spring','Fractions (including decimals and percentages)','add and subtract fractions with different denominators and mixed numbers, using the concept of equivalent fractions','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,30),
(6,'maths','spring','Fractions (including decimals and percentages)','multiply simple pairs of proper fractions, writing the answer in its simplest form [for example, 1/4 × 1/2 = 1/8]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,40),
(6,'maths','spring','Fractions (including decimals and percentages)','divide proper fractions by whole numbers [for example, 1/3 ÷ 2 = 1/6]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,50),
(6,'maths','spring','Fractions (including decimals and percentages)','associate a fraction with division and calculate decimal fraction equivalents [for example, 0.375] for a simple fraction [for example, 3/8]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,60),
(6,'maths','spring','Fractions (including decimals and percentages)','identify the value of each digit in numbers given to 3 decimal places and multiply and divide numbers by 10, 100 and 1,000 giving answers up to 3 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,70),
(6,'maths','spring','Fractions (including decimals and percentages)','multiply one-digit numbers with up to 2 decimal places by whole numbers','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,80),
(6,'maths','spring','Fractions (including decimals and percentages)','use written division methods in cases where the answer has up to 2 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,90),
(6,'maths','spring','Fractions (including decimals and percentages)','solve problems which require answers to be rounded to specified degrees of accuracy','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,100),
(6,'maths','spring','Fractions (including decimals and percentages)','recall and use equivalences between simple fractions, decimals and percentages, including in different contexts','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,110),
(6,'maths','spring','Ratio and proportion','solve problems involving the relative sizes of 2 quantities where missing values can be found by using integer multiplication and division facts','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,120),
(6,'maths','spring','Ratio and proportion','solve problems involving the calculation of percentages [for example, of measures and such as 15% of 360] and the use of percentages for comparison','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,130),
(6,'maths','spring','Ratio and proportion','solve problems involving similar shapes where the scale factor is known or can be found','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,140),
(6,'maths','spring','Ratio and proportion','solve problems involving unequal sharing and grouping using knowledge of fractions and multiples','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,150),
(6,'maths','summer','Algebra','use simple formulae','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,10),
(6,'maths','summer','Algebra','generate and describe linear number sequences','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,20),
(6,'maths','summer','Algebra','express missing number problems algebraically','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,30),
(6,'maths','summer','Algebra','find pairs of numbers that satisfy an equation with 2 unknowns','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,40),
(6,'maths','summer','Algebra','enumerate possibilities of combinations of 2 variables','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,50)
on conflict (curriculum,year_group,subject,term,objective) do nothing;

insert into public.curriculum_objectives (year_group,subject,term,strand,objective,source,verbatim,checkpoint,sort_order) values
(6,'maths','summer','Measurement','solve problems involving the calculation and conversion of units of measure, using decimal notation up to 3 decimal places where appropriate','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,60),
(6,'maths','summer','Measurement','use, read, write and convert between standard units, converting measurements of length, mass, volume and time from a smaller unit of measure to a larger unit, and vice versa, using decimal notation to up to 3 decimal places','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,70),
(6,'maths','summer','Measurement','convert between miles and kilometres','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,80),
(6,'maths','summer','Measurement','recognise that shapes with the same areas can have different perimeters and vice versa','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,90),
(6,'maths','summer','Measurement','recognise when it is possible to use formulae for area and volume of shapes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,100),
(6,'maths','summer','Measurement','calculate the area of parallelograms and triangles','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,110),
(6,'maths','summer','Measurement','calculate, estimate and compare volume of cubes and cuboids using standard units, including cubic centimetres (cm³) and cubic metres (m³), and extending to other units [for example, mm³ and km³]','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,120),
(6,'maths','summer','Geometry properties of shapes','draw 2-D shapes using given dimensions and angles','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,130),
(6,'maths','summer','Geometry properties of shapes','recognise, describe and build simple 3-D shapes, including making nets','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,140),
(6,'maths','summer','Geometry properties of shapes','compare and classify geometric shapes based on their properties and sizes and find unknown angles in any triangles, quadrilaterals, and regular polygons','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,150),
(6,'maths','summer','Geometry properties of shapes','illustrate and name parts of circles, including radius, diameter and circumference and know that the diameter is twice the radius','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,160),
(6,'maths','summer','Geometry properties of shapes','recognise angles where they meet at a point, are on a straight line, or are vertically opposite, and find missing angles','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,170),
(6,'maths','summer','Geometry position and direction','describe positions on the full coordinate grid (all 4 quadrants)','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,180),
(6,'maths','summer','Geometry position and direction','draw and translate simple shapes on the coordinate plane, and reflect them in the axes','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,190),
(6,'maths','summer','Statistics','interpret and construct pie charts and line graphs and use these to solve problems','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,200),
(6,'maths','summer','Statistics','calculate and interpret the mean as an average','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 6',true,null,210),
(4,'maths','summer','Multiplication and division','recall multiplication and division facts for multiplication tables up to 12 × 12','National curriculum in England: mathematics programmes of study, updated 28 September 2021, year 4',true,'multiplication_tables_check',5)
on conflict (curriculum,year_group,subject,term,objective) do nothing;
