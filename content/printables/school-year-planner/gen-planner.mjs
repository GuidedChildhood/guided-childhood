// Generates print.html and phone.html for My School Year Planner 2026 to 2027
import { writeFileSync } from 'fs';

const DIR = '/home/user/guided-childhood/content/printables/school-year-planner';

/* ---------- calendar maths (computed, never guessed) ---------- */
function monthGrid(y, m) { // m is 0 based
  const first = new Date(Date.UTC(y, m, 1));
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday = 0
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push('');
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push('');
  return cells;
}

/* ---------- seasonal hand drawn icons (house tokens only) ---------- */
const icons = {
  leaf: `<svg viewBox="0 0 24 24"><path d="M19 4C12 4 6 8 5 15c-.2 1.6 0 3 .6 4.4C7 13 11 9 16 7c-4 3-7.5 7.5-8.6 13C9 20.6 10.6 21 12 20.8 19 20 20 12 19 4z" fill="#2F8F6B" stroke="#1A1A2E" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  pumpkin: `<svg viewBox="0 0 24 24"><path d="M12 6c-1 0-1.5-1.5-1-3h2c.5 1.5 0 3-1 3z" fill="#2F8F6B" stroke="#1A1A2E" stroke-width="1.3"/><ellipse cx="12" cy="14" rx="8.5" ry="7" fill="#D4600A" stroke="#1A1A2E" stroke-width="1.4"/><path d="M12 7v14M7.5 8.2c-1.6 3.6-1.6 8 0 11.6M16.5 8.2c1.6 3.6 1.6 8 0 11.6" stroke="#1A1A2E" stroke-width="1.1" fill="none"/></svg>`,
  brolly: `<svg viewBox="0 0 24 24"><path d="M12 3c5.5 0 9 4 9.5 8.5H2.5C3 7 6.5 3 12 3z" fill="#D8E8F8" stroke="#1A1A2E" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 11.5V19a2 2 0 0 0 4 0" fill="none" stroke="#1A1A2E" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  flake: `<svg viewBox="0 0 24 24"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M12 2l-2 2.5M12 2l2 2.5M12 22l-2-2.5M12 22l2-2.5" stroke="#52526A" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="12" cy="12" r="2.4" fill="#D8E8F8" stroke="#1A1A2E" stroke-width="1.3"/></svg>`,
  mitten: `<svg viewBox="0 0 24 24"><path d="M7 4c3-2 8-1.5 9.5 1.5S18 12 16.5 15l-7 2.5c-2-2.5-3.5-6-3-9L4.5 10C3 9.5 3 7.5 4.3 6.8L7 4z" fill="#FBCFE8" stroke="#1A1A2E" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.2 17.8 16.7 15l1 2.8-7.5 2.8z" fill="#D8E8F8" stroke="#1A1A2E" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" fill="#FBCFE8" stroke="#1A1A2E" stroke-width="1.4"/></svg>`,
  daffodil: `<svg viewBox="0 0 24 24"><path d="M12 13v8" stroke="#2F8F6B" stroke-width="1.6" stroke-linecap="round"/><path d="M12 18c-2.5 0-4.5-1.2-5-3 2.5 0 4.5 1.2 5 3z" fill="#2F8F6B" stroke="#1A1A2E" stroke-width="1.1"/><g fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.2"><ellipse cx="12" cy="4.6" rx="2" ry="2.8"/><ellipse cx="12" cy="11.4" rx="2" ry="2.8"/><ellipse cx="8.6" cy="8" rx="2.8" ry="2"/><ellipse cx="15.4" cy="8" rx="2.8" ry="2"/></g><circle cx="12" cy="8" r="2.2" fill="#D4600A" stroke="#1A1A2E" stroke-width="1.2"/></svg>`,
  rainbow: `<svg viewBox="0 0 24 24"><path d="M3 18a9 9 0 0 1 18 0" fill="none" stroke="#D4600A" stroke-width="2.2"/><path d="M6.2 18a5.8 5.8 0 0 1 11.6 0" fill="none" stroke="#EDC35F" stroke-width="2.2"/><path d="M9.4 18a2.6 2.6 0 0 1 5.2 0" fill="none" stroke="#2F8F6B" stroke-width="2.2"/><path d="M3 18h18" stroke="#1A1A2E" stroke-width="1.2"/></svg>`,
  flower: `<svg viewBox="0 0 24 24"><g fill="#FBCFE8" stroke="#1A1A2E" stroke-width="1.2"><circle cx="12" cy="5.5" r="3"/><circle cx="12" cy="18.5" r="3"/><circle cx="5.5" cy="12" r="3"/><circle cx="18.5" cy="12" r="3"/></g><circle cx="12" cy="12" r="3.2" fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.3"/></svg>`,
  sun: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" stroke="#C99A28" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  lolly: `<svg viewBox="0 0 24 24"><path d="M8 3.5h8c1.4 0 2.5 1.1 2.5 2.5v8c0 1.4-1.1 2.5-2.5 2.5H8c-1.4 0-2.5-1.1-2.5-2.5V6c0-1.4 1.1-2.5 2.5-2.5z" fill="#FBCFE8" stroke="#1A1A2E" stroke-width="1.4"/><path d="M9.3 3.5v13M14.7 3.5v13" stroke="#1A1A2E" stroke-width="1"/><path d="M12 16.5V21" stroke="#1A1A2E" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  beachball: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#FFFFFF" stroke="#1A1A2E" stroke-width="1.4"/><path d="M12 3a9 9 0 0 0 0 18 22 22 0 0 0 0-18z" fill="#D8E8F8" stroke="#1A1A2E" stroke-width="1.1"/><path d="M12 3a9 9 0 0 1 0 18 22 22 0 0 1 0-18z" fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.1" transform="rotate(120 12 12)"/></svg>`,
  book: `<svg viewBox="0 0 24 24"><path d="M4 5c3-1.5 5-1.5 8 0v14c-3-1.5-5-1.5-8 0V5zM20 5c-3-1.5-5-1.5-8 0v14c3-1.5 5-1.5 8 0V5z" fill="#D8E8F8" stroke="#1A1A2E" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24"><path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18l-4 1z" fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.4" stroke-linejoin="round"/><path d="M15 6l3 3" stroke="#1A1A2E" stroke-width="1.2"/></svg>`,
  clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#E8F0EE" stroke="#1A1A2E" stroke-width="1.4"/><path d="M12 7v5l3.4 2" fill="none" stroke="#1A1A2E" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.4"/><path d="M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10M17 5h3v1.5A3.5 3.5 0 0 1 16.5 10" fill="none" stroke="#1A1A2E" stroke-width="1.3"/><path d="M10.5 14h3v3h-3zM8 17h8v3H8z" fill="#C99A28" stroke="#1A1A2E" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5 14.9 8.6l6.6.8-4.9 4.5 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.4l6.6-.8z" fill="#EDC35F" stroke="#1A1A2E" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
};

const starOutline = `<svg class="rl-star" viewBox="0 0 24 24"><path d="M12 2.5 14.9 8.6l6.6.8-4.9 4.5 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.4l6.6-.8z" fill="none" stroke="#1A1A2E" stroke-width="1.4"/></svg>`;

/* ---------- month metadata ---------- */
const months = [
  { y: 2026, m: 8,  term: 'Autumn term',     tint: 'var(--tint-sage)',     icon: 'leaf',
    digi: 'New year, fresh pencil case. Let us make it a good one.' },
  { y: 2026, m: 9,  term: 'Autumn term',     tint: 'var(--terracotta-lt)', icon: 'pumpkin',
    digi: 'Half term is coming. Plan one thing you cannot wait for.' },
  { y: 2026, m: 10, term: 'Autumn term',     tint: 'var(--tint-blue)',     icon: 'brolly',
    digi: 'Dark evenings are brilliant for reading. Log a book this month.' },
  { y: 2026, m: 11, term: 'Autumn term',     tint: 'var(--pastel-pink)',   icon: 'flake',
    digi: 'Finish strong, then rest properly. You have earned it.' },
  { y: 2027, m: 0,  term: 'Spring term',     tint: 'var(--tint-blue)',     icon: 'mitten',
    digi: 'A brand new year. Pick one goal and write it big.' },
  { y: 2027, m: 1,  term: 'Spring term',     tint: 'var(--pastel-pink)',   icon: 'heart',
    digi: 'Short month, big heart. Do one kind thing every week.' },
  { y: 2027, m: 2,  term: 'Spring term',     tint: 'var(--tint-sage)',     icon: 'daffodil',
    digi: 'Spring is here. Take your book outside when the sun shows up.' },
  { y: 2027, m: 3,  term: 'Summer term',     tint: 'var(--terracotta-lt)', icon: 'rainbow',
    digi: 'Easter break first, then the summer term. Pace yourself.' },
  { y: 2027, m: 4,  term: 'Summer term',     tint: 'var(--pastel-pink)',   icon: 'flower',
    digi: 'Test season for some of us. Little revision bursts beat big panics.' },
  { y: 2027, m: 5,  term: 'Summer term',     tint: 'var(--terracotta-lt)', icon: 'sun',
    digi: 'Long light evenings. Homework first, then out you go.' },
  { y: 2027, m: 6,  term: 'Summer term',     tint: 'var(--tint-blue)',     icon: 'lolly',
    digi: 'Nearly there. Thank your teacher, they cheered you on all year.' },
  { y: 2027, m: 7,  term: 'Summer holidays', tint: 'var(--tint-sage)',     icon: 'beachball',
    digi: 'No timetable this month. Rest is part of the plan too.' },
];
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function monthPage(meta, idx) {
  const cells = monthGrid(meta.y, meta.m);
  const rows = cells.length / 7;
  const name = monthNames[meta.m];
  const dayHead = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    .map((d,i) => `<div class="cal-h${i>4?' wkndh':''}">${d}</div>`).join('');
  const body = cells.map((c,i) => {
    const col = i % 7;
    const wknd = col > 4 ? ' wknd' : '';
    const empty = c === '' ? ' empty' : '';
    return `<div class="cal-c${wknd}${empty}"><span class="dnum">${c}</span></div>`;
  }).join('');
  const bigLines = Array.from({length:6}, () =>
    `<div class="dotline"></div>`).join('');
  return `
<!-- MONTH · ${name} ${meta.y} -->
<div class="sheet">
  <div class="m-head">
    <div>
      <div class="eyebrow">${name} ${meta.y} · ${meta.term}</div>
      <h2 style="margin-top:2mm;font-size:26pt;">${name}</h2>
    </div>
    <div class="m-icon">${icons[meta.icon]}</div>
  </div>
  <div class="m-body">
    <div class="card cal" style="--rows:${rows};">
      <div class="cal-grid">${dayHead}${body}</div>
    </div>
    <div class="m-side">
      <div class="card side-card" style="background:${meta.tint};">
        <div class="eyebrow" style="font-size:7.5pt;color:var(--terracotta-dark);">This month's big things</div>
        ${bigLines}
      </div>
      <div class="card digi-note">
        <img src="images/DiGi-star.svg" alt="DiGi" class="digi-mini">
        <p>${meta.digi}</p>
      </div>
    </div>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · ${name} ${meta.y}</span></div>
</div>`;
}

/* ---------- static pages ---------- */

const cover = `
<!-- PAGE 1 · COVER -->
<div class="sheet" style="align-items:center;text-align:center;">
  <div style="margin-top:8mm;" class="eyebrow">Guided Childhood · Print at Home</div>
  <h1 style="margin-top:6mm;font-size:40pt;">My School<br>Year Planner</h1>
  <div class="card" style="margin-top:6mm;padding:3mm 9mm;background:var(--terracotta-lt);font-weight:900;font-size:16pt;letter-spacing:0.5px;">2026 to 2027</div>
  <img src="images/DiGi-star.svg" alt="DiGi the golden star" style="width:78mm;height:84mm;margin-top:7mm;">
  <div class="bubble" style="margin-top:6mm;max-width:120mm;">Hello! I am DiGi. This planner is yours, and I will pop up to cheer you on. Ready?</div>
  <div class="card" style="margin-top:7mm;padding:4mm 8mm;min-width:120mm;">
    <div class="eyebrow" style="font-size:7.5pt;">This planner belongs to</div>
    <div class="dotline" style="margin-top:4mm;width:100mm;"></div>
  </div>
  <div style="display:flex;gap:4mm;margin-top:7mm;">
    <div class="card chip">12 monthly calendars</div>
    <div class="card chip">Homework tracker</div>
    <div class="card chip">Reading log</div>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>UK school year · Ages 8 to 11</span></div>
</div>`;

const belongs = `
<!-- PAGE 2 · ALL ABOUT ME -->
<div class="sheet">
  <div class="eyebrow">Start here</div>
  <h2 style="margin-top:2mm;">This planner belongs to</h2>
  <div class="digi-row">
    <img src="images/DiGi-star.svg" alt="DiGi" class="digi-med">
    <div class="bubble">Write your name nice and big. This year is yours, and a plan you can see is a plan that actually happens.</div>
  </div>
  <div class="card" style="margin-top:6mm;padding:6mm;">
    <div class="field"><span class="f-label">My name</span><div class="dotline"></div></div>
    <div style="display:flex;gap:6mm;margin-top:5mm;">
      <div class="field" style="flex:1;"><span class="f-label">My class</span><div class="dotline"></div></div>
      <div class="field" style="flex:1;"><span class="f-label">My teacher</span><div class="dotline"></div></div>
    </div>
    <div style="display:flex;gap:6mm;margin-top:5mm;">
      <div class="field" style="flex:1;"><span class="f-label">My school</span><div class="dotline"></div></div>
      <div class="field" style="flex:1;"><span class="f-label">School year</span><div class="dotline" style="position:relative;"><span class="preprint">2026 to 2027</span></div></div>
    </div>
  </div>
  <div class="card" style="margin-top:6mm;padding:6mm;background:var(--terracotta-lt);">
    <div class="eyebrow" style="color:var(--terracotta-dark);">My goals for the year</div>
    <p style="margin-top:2mm;font-size:9.5pt;">Big or small, yours to choose. A goal you write down is a goal your future self can high five.</p>
    <div class="goal"><span class="gnum">1</span><div class="dotline"></div></div>
    <div class="goal"><span class="gnum">2</span><div class="dotline"></div></div>
    <div class="goal"><span class="gnum">3</span><div class="dotline"></div></div>
  </div>
  <div class="card" style="margin-top:6mm;padding:5mm 6mm;">
    <div class="eyebrow" style="font-size:7.5pt;">In June, come back here and tick what you managed</div>
    <p style="margin-top:2mm;">Goals are allowed to change. Crossing one out and writing a better one counts as planning, not quitting.</p>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · All about me</span></div>
</div>`;

const timetable = `
<!-- PAGE 3 · TIMETABLE -->
<div class="sheet">
  <div class="eyebrow">Fill in with your teacher's copy</div>
  <h2 style="margin-top:2mm;">My timetable</h2>
  <div class="digi-row">
    <img src="images/DiGi-star.svg" alt="DiGi" class="digi-med">
    <div class="bubble">Copy your timetable in once, then ask a grown up to snap a photo of this page for the fridge and the car.</div>
  </div>
  <table class="grid tt">
    <tr><th style="width:16mm;">Period</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr>
    ${[1,2,3,4,5,6].map(p => `<tr><td class="pnum">${p}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('\n    ')}
  </table>
  <div style="display:flex;gap:5mm;margin-top:5mm;">
    <div class="card" style="flex:1;padding:4mm 5mm;">
      <div class="eyebrow" style="font-size:7.5pt;">PE days</div>
      <div class="dotline" style="margin-top:3mm;"></div>
    </div>
    <div class="card" style="flex:1;padding:4mm 5mm;">
      <div class="eyebrow" style="font-size:7.5pt;">Library day</div>
      <div class="dotline" style="margin-top:3mm;"></div>
    </div>
    <div class="card" style="flex:1;padding:4mm 5mm;">
      <div class="eyebrow" style="font-size:7.5pt;">Clubs</div>
      <div class="dotline" style="margin-top:3mm;"></div>
    </div>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · Timetable</span></div>
</div>`;

const termRows = [
  ['Autumn term', 'var(--terracotta-lt)'],
  ['Autumn half term', ''],
  ['Christmas holidays', ''],
  ['Spring term', 'var(--tint-blue)'],
  ['Spring half term', ''],
  ['Easter holidays', ''],
  ['Summer term', 'var(--tint-sage)'],
  ['Summer half term', ''],
  ['Summer holidays', ''],
].map(([label, bg]) =>
  `<tr><td class="t-label"${bg ? ` style="background:${bg};"` : ''}>${label}</td><td></td><td></td></tr>`
).join('\n    ');

const termDates = `
<!-- PAGE 4 · TERM DATES -->
<div class="sheet">
  <div class="eyebrow">Copy from your school website or newsletter</div>
  <h2 style="margin-top:2mm;">Term dates 2026 to 2027</h2>
  <div class="digi-row">
    <img src="images/DiGi-star.svg" alt="DiGi" class="digi-med">
    <div class="bubble">Every council sets its own dates, so yours are the only ones that count. Fill these in during the first week and you will never be surprised by a half term again.</div>
  </div>
  <table class="grid td-table">
    <tr><th style="text-align:left;padding-left:4mm;">When</th><th style="width:44mm;">First day</th><th style="width:44mm;">Last day</th></tr>
    ${termRows}
  </table>
  <div class="card" style="margin-top:5mm;padding:4mm 5mm;">
    <div class="eyebrow" style="font-size:7.5pt;">INSET days (school closed, you are free)</div>
    <div style="display:flex;gap:4mm;margin-top:3mm;">
      ${Array.from({length:5},()=>'<div class="dotline" style="flex:1;"></div>').join('')}
    </div>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · Term dates</span></div>
</div>`;

const homework = `
<!-- PAGE 17 · HOMEWORK TRACKER -->
<div class="sheet">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
    <div>
      <div class="eyebrow">Print one per week</div>
      <h2 style="margin-top:2mm;">My homework this week</h2>
    </div>
    <div class="card" style="padding:3mm 5mm;">
      <div class="eyebrow" style="font-size:7pt;">Week beginning</div>
      <div class="dotline" style="margin-top:2.5mm;width:34mm;"></div>
    </div>
  </div>
  <div class="digi-row" style="margin-top:3mm;">
    <img src="images/DiGi-star.svg" alt="DiGi" class="digi-med">
    <div class="bubble">Write it down the moment it is set. A ticked box feels brilliant, and homework done means screens with zero nagging.</div>
  </div>
  <table class="grid hw">
    <tr><th style="width:17mm;">Day</th><th style="width:32mm;">Subject</th><th>Task</th><th style="width:22mm;">Due</th><th style="width:15mm;">Done</th></tr>
    ${['Mon','Tue','Wed','Thu','Fri'].map(d => `<tr><td class="pnum" rowspan="2">${d}</td><td></td><td></td><td></td><td><div class="tickbox"></div></td></tr>
    <tr><td></td><td></td><td></td><td><div class="tickbox"></div></td></tr>`).join('\n    ')}
  </table>
  <div class="card" style="margin-top:4mm;padding:3.5mm 5mm;background:var(--terracotta-lt);display:flex;justify-content:space-between;align-items:center;">
    <div style="font-weight:900;font-size:11pt;">All boxes ticked by Friday?</div>
    <div style="font-weight:700;font-size:9.5pt;color:var(--ink-soft);">Colour the weekend star ${icons.star.replace('<svg','<svg style="width:6mm;height:6mm;vertical-align:middle;"')}</div>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · Homework tracker</span></div>
</div>`;

const readingRows = Array.from({length:9}, () =>
  `<tr><td></td><td></td><td></td><td></td><td class="stars">${starOutline}${starOutline}${starOutline}${starOutline}${starOutline}</td></tr>`
).join('\n    ');

const reading = `
<!-- PAGE 18 · READING LOG -->
<div class="sheet">
  <div class="eyebrow">Every book counts, comics too</div>
  <h2 style="margin-top:2mm;">My reading log</h2>
  <div class="digi-row">
    <img src="images/DiGi-star.svg" alt="DiGi" class="digi-med">
    <div class="bubble">Colour the stars when you finish. Five stars means you would make your best friend read it. One star means at least you gave it a go!</div>
  </div>
  <table class="grid rl">
    <tr><th style="text-align:left;padding-left:4mm;">Title</th><th style="width:34mm;">Author</th><th style="width:22mm;">Started</th><th style="width:22mm;">Finished</th><th style="width:34mm;">My stars</th></tr>
    ${readingRows}
  </table>
  <div class="card" style="margin-top:4mm;padding:3.5mm 5mm;display:flex;align-items:center;gap:4mm;">
    <div style="width:8mm;height:8mm;flex-shrink:0;">${icons.book}</div>
    <p style="font-size:9pt;">Page full? Brilliant. Print another one and keep the streak going. Ten finished books in a year is a genuinely big deal.</p>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · Reading log</span></div>
</div>`;

const examBlock = (tint) => `
    <div class="card exam" style="background:${tint};">
      <div class="field"><span class="f-label">What it is</span><div class="dotline"></div></div>
      <div class="field" style="margin-top:3.5mm;"><span class="f-label">When it is</span><div class="dotline"></div></div>
      <div class="eyebrow" style="font-size:7pt;margin-top:4mm;">Revision sessions · tick one for every 20 minutes</div>
      <div class="tickrow">${Array.from({length:8},()=>'<div class="tickbox"></div>').join('')}</div>
      <div class="field" style="margin-top:3.5mm;"><span class="f-label">How it went</span><div class="dotline"></div></div>
    </div>`;

const exams = `
<!-- PAGE 19 · EXAM AND REVISION PLANNER -->
<div class="sheet">
  <div class="eyebrow">Spelling tests, times tables, SATs, music grades</div>
  <h2 style="margin-top:2mm;">My exam and revision planner</h2>
  <div class="digi-row">
    <img src="images/DiGi-star.svg" alt="DiGi" class="digi-med">
    <div class="bubble">Here is the secret: eight short sessions beat one giant panic. Twenty minutes, tick a box, go play. Your brain does the rest while you are off having fun.</div>
  </div>
  <div class="exam-grid">
    ${examBlock('var(--white)')}
    ${examBlock('var(--tint-blue)')}
    ${examBlock('var(--tint-sage)')}
    ${examBlock('var(--terracotta-lt)')}
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · Revision</span></div>
</div>`;

const subjectTints = ['var(--white)','var(--tint-blue)','var(--tint-sage)','var(--terracotta-lt)','var(--pastel-pink)','var(--white)','var(--tint-blue)','var(--tint-sage)'];
const subjects = `
<!-- PAGE 20 · MY SUBJECTS -->
<div class="sheet">
  <div class="eyebrow">Make it yours</div>
  <h2 style="margin-top:2mm;">My subjects</h2>
  <p style="margin-top:2mm;">One box per subject. Write the name big, then the bit you secretly enjoy, because every subject has one if you hunt for it.</p>
  <div class="subj-grid">
    ${subjectTints.map(t => `<div class="card subj" style="background:${t};">
      <div class="field"><span class="f-label">Subject</span><div class="dotline"></div></div>
      <div class="field" style="margin-top:3mm;"><span class="f-label">Teacher</span><div class="dotline"></div></div>
      <div class="field" style="margin-top:3mm;"><span class="f-label">Best bit</span><div class="dotline"></div></div>
    </div>`).join('\n    ')}
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · My subjects</span></div>
</div>`;

const screens = `
<!-- PAGE 21 · SCREEN BALANCE CORNER -->
<div class="sheet">
  <div class="eyebrow">DiGi's corner</div>
  <h2 style="margin-top:2mm;">Homework first, then screens guilt free</h2>
  <div class="digi-row" style="margin-top:4mm;">
    <img src="images/DiGi-star.svg" alt="DiGi" style="width:40mm;height:43mm;flex-shrink:0;">
    <div class="bubble" style="font-size:12pt;">That is the whole trick. Do the work, tick the box, and every minute of screen time after it is properly yours. No nagging, no guilt, no arguments.</div>
  </div>
  <div class="card" style="margin-top:7mm;padding:6mm;">
    <div class="eyebrow">The deal in three steps</div>
    <div class="step"><span class="gnum">1</span><p><strong style="color:var(--ink);">Write it in the tracker.</strong> The moment homework is set, it goes on the page, not in your worry pile.</p></div>
    <div class="step"><span class="gnum">2</span><p><strong style="color:var(--ink);">Do it, tick it.</strong> Short and focused wins. Twenty minutes of real work beats an hour of staring.</p></div>
    <div class="step"><span class="gnum">3</span><p><strong style="color:var(--ink);">Enjoy your screens.</strong> Earned time is the best time. When it ends, end well: save, breathe, off.</p></div>
  </div>
  <div class="card" style="margin-top:6mm;padding:5mm 6mm;background:var(--tint-sage);">
    <div class="eyebrow" style="color:var(--green);">For the grown ups</div>
    <p style="margin-top:2mm;">If your family has a screen deal, this planner is its best friend. A ticked homework box is proof the deal was kept, so screen time starts relaxed instead of contested. One glance, no interrogation.</p>
  </div>
  <div class="footer"><span>guidedchildhood.com</span><span>My School Year Planner · DiGi's corner</span></div>
</div>`;

const funnel = `
<!-- PAGE 22 · BONUS / FUNNEL -->
<div class="sheet" style="align-items:center;text-align:center;">
  <div style="margin-top:16mm;" class="eyebrow">A free gift for your family</div>
  <h1 style="margin-top:5mm;font-size:30pt;">Your year is planned.<br>Now meet your guide.</h1>
  <img src="images/DiGi-star.svg" alt="DiGi" style="width:44mm;height:47mm;margin-top:8mm;">
  <p style="margin-top:7mm;max-width:140mm;font-size:11.5pt;">
    DiGi is the friendly star who teaches children how screens really work. As a thank you for
    printing this planner, grab the free <strong style="color:var(--ink);">term dates sticker pack</strong>
    to decorate these pages, plus DiGi's five minute mini lesson,
    <strong style="color:var(--ink);">Why your brain loves screens</strong>. Both free, both a
    perfect match for the planner on your child's desk.
  </p>
  <div class="card" style="margin-top:8mm;padding:5mm 10mm;background:var(--terracotta-lt);">
    <div style="font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:13pt;letter-spacing:1px;">guidedchildhood.com/etsy-bonus</div>
  </div>
  <p style="margin-top:10mm;font-size:9.5pt;max-width:130mm;">
    Made by Guided Childhood, the UK platform helping families raise confident kids in a digital
    world. If this planner makes your September calmer, a kind review on Etsy helps another family find it.
  </p>
  <div class="footer"><span>guidedchildhood.com</span><span>Thank you · Justin and the squad</span></div>
</div>`;

/* ---------- assemble print.html ---------- */
const monthPages = months.map(monthPage).join('\n');

const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>My School Year Planner 2026 to 2027</title>
<link href="fonts/local-fonts.css" rel="stylesheet">
<style>
  :root{
    --white:#FFFFFF; --cream:#F9F8F6; --ink:#1A1A2E; --ink-soft:#52526A;
    --ink-muted:#8888A0; --border:#EAEAF0; --terracotta:#EDC35F;
    --terracotta-dark:#C99A28; --terracotta-lt:#FEF7E0; --coral:#D4600A;
    --green:#2F8F6B; --tint-blue:#D8E8F8; --tint-sage:#E8F0EE; --pastel-pink:#FBCFE8;
  }
  *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  body{font-family:'Nunito',sans-serif;color:var(--ink);background:#ddd;}
  .sheet{width:210mm;height:296mm;background:var(--cream);position:relative;overflow:hidden;
    page-break-after:always;padding:14mm 14mm 14mm;display:flex;flex-direction:column;}
  .eyebrow{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:8.5pt;
    letter-spacing:2.5px;text-transform:uppercase;color:var(--coral);}
  h1{font-weight:900;font-size:34pt;line-height:1.04;}
  h2{font-weight:900;font-size:20pt;line-height:1.1;}
  p{font-size:10.5pt;line-height:1.55;color:var(--ink-soft);}
  .footer{position:absolute;bottom:7mm;left:14mm;right:14mm;display:flex;
    justify-content:space-between;align-items:center;
    font-family:'IBM Plex Mono',monospace;font-size:7pt;letter-spacing:1.5px;
    color:var(--ink-muted);text-transform:uppercase;}
  .card{background:var(--white);border:2.5px solid var(--ink);border-radius:16px;
    box-shadow:0 5px 0 var(--ink);}
  .chip{padding:3mm 6mm;font-weight:800;font-size:10.5pt;}
  .bubble{background:var(--white);border:2.5px solid var(--ink);border-radius:16px;
    box-shadow:0 4px 0 var(--ink);padding:4.5mm 6mm;position:relative;
    font-weight:700;font-size:10.5pt;line-height:1.45;color:var(--ink);}
  .digi-row{display:flex;align-items:center;gap:5mm;margin-top:4mm;}
  .digi-row .bubble{flex:1;}
  .digi-row .bubble:after{content:'';position:absolute;left:-4.5mm;top:50%;transform:translateY(-50%);
    width:0;height:0;border-top:3.5mm solid transparent;border-bottom:3.5mm solid transparent;
    border-right:4.5mm solid var(--ink);}
  .digi-med{width:22mm;height:23.6mm;flex-shrink:0;}
  .dotline{border-bottom:2px dotted var(--ink-muted);height:7mm;}
  .preprint{position:absolute;bottom:1mm;left:2mm;font-weight:800;color:var(--ink);font-size:10.5pt;}
  .field .f-label{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:7pt;
    letter-spacing:1.5px;text-transform:uppercase;color:var(--ink-muted);display:block;}
  .field .dotline{margin-top:1mm;}
  .goal{display:flex;align-items:flex-end;gap:4mm;margin-top:4.5mm;}
  .goal .dotline{flex:1;}
  .gnum{width:9mm;height:9mm;border:2.5px solid var(--ink);border-radius:50%;background:var(--white);
    display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11pt;flex-shrink:0;}
  .step{display:flex;align-items:flex-start;gap:4mm;margin-top:4.5mm;}
  .step p{flex:1;}
  /* tables */
  table.grid{width:100%;border-collapse:separate;border-spacing:0;background:var(--white);
    border:2.5px solid var(--ink);border-radius:16px;overflow:hidden;box-shadow:0 5px 0 var(--ink);
    margin-top:5mm;}
  table.grid th{background:var(--terracotta);color:var(--ink);font-weight:800;font-size:9.5pt;
    padding:2.8mm 1mm;border-bottom:2.5px solid var(--ink);}
  table.grid td{border-top:1.5px solid var(--border);border-left:1.5px solid var(--border);text-align:center;}
  table.grid td:first-child{border-left:none;}
  table.tt td{height:24mm;}
  table.tt td.pnum{font-weight:900;font-size:13pt;background:var(--terracotta-lt);}
  table.td-table td{height:15.5mm;}
  table.td-table td.t-label{text-align:left;padding-left:4mm;font-weight:800;font-size:10.5pt;}
  table.hw td{height:14mm;}
  table.hw td.pnum{font-weight:900;font-size:11pt;background:var(--terracotta-lt);}
  table.rl td{height:15.5mm;}
  table.rl td:first-child{text-align:left;padding-left:4mm;}
  .stars{white-space:nowrap;}
  .rl-star{width:5.6mm;height:5.6mm;margin:0 0.4mm;vertical-align:middle;}
  .tickbox{width:6.5mm;height:6.5mm;border:2px solid var(--ink);border-radius:4px;
    background:var(--white);display:inline-block;}
  .tickrow{display:flex;gap:2.6mm;margin-top:2mm;}
  /* month pages */
  .m-head{display:flex;justify-content:space-between;align-items:flex-start;}
  .m-icon{width:15mm;height:15mm;}
  .m-icon svg{width:100%;height:100%;}
  .m-body{display:flex;gap:5mm;margin-top:5mm;flex:1;min-height:0;margin-bottom:6mm;}
  .cal{flex:1;padding:3mm;display:flex;}
  .cal-grid{display:grid;flex:1;grid-template-columns:repeat(7,1fr);
    grid-template-rows:9mm repeat(var(--rows),1fr);gap:1mm;}
  .cal-h{background:var(--ink);color:var(--white);border-radius:6px;display:flex;
    align-items:center;justify-content:center;font-weight:800;font-size:9pt;}
  .cal-h.wkndh{background:var(--ink-soft);}
  .cal-c{border:1.5px solid var(--border);border-radius:6px;position:relative;background:var(--white);}
  .cal-c.wknd{background:var(--cream);}
  .cal-c.empty{background:transparent;border-style:dashed;}
  .dnum{position:absolute;top:1mm;left:1.6mm;font-weight:800;font-size:8.5pt;color:var(--ink);}
  .m-side{width:48mm;display:flex;flex-direction:column;gap:4mm;}
  .side-card{flex:1;padding:4mm;}
  .side-card .dotline{margin-top:4.6mm;}
  .digi-note{padding:3.5mm 4mm;display:flex;align-items:center;gap:3mm;}
  .digi-note img{width:12mm;height:12.9mm;flex-shrink:0;}
  .digi-note p{font-size:8pt;line-height:1.4;font-weight:700;color:var(--ink);}
  /* exam + subjects */
  .exam-grid{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:5mm;flex:1;margin-bottom:8mm;}
  .exam{padding:5.5mm 5.5mm;display:flex;flex-direction:column;justify-content:space-between;}
  .subj-grid{display:grid;grid-template-columns:1fr 1fr;gap:4.5mm;margin-top:5mm;}
  .subj{padding:4mm 5mm;}
  /* ink friendly */
  body.ink .sheet{background:var(--white);}
  body.ink .card,body.ink .bubble,body.ink table.grid{box-shadow:none;background:var(--white) !important;}
  body.ink table.grid th{background:var(--white);color:var(--ink);}
  body.ink table.tt td.pnum,body.ink table.hw td.pnum{background:var(--white);}
  body.ink .cal-h{background:var(--white);color:var(--ink);border:2px solid var(--ink);}
  body.ink .cal-c.wknd{background:var(--white);}
  body.ink .exam,body.ink .subj,body.ink .side-card{background:var(--white) !important;}
  @page{size:A4;margin:0;}
  @media print{body{background:none;}}
</style>
</head>
<body>
${cover}
${belongs}
${timetable}
${termDates}
${monthPages}
${homework}
${reading}
${exams}
${subjects}
${screens}
${funnel}
</body>
</html>
`;

writeFileSync(DIR + '/print.html', printHtml);
console.log('print.html written,', (printHtml.match(/class="sheet"/g) || []).length, 'sheets');
