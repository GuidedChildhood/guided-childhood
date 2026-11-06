// The picture icons, copied from ../planet-day-flip-chart/icons.js. Hand drawn here in
// house ink on a 48 unit grid: round caps, 2.6 stroke, one soft fill each.
// Objects only. No character is ever drawn: the Planet Friends and DiGi are
// the approved cutouts in images/.
//
// icon(key, fill) returns an <svg> string. F is the fill colour slot.
window.ICONS = (() => {
const I = {
  // Morning
  alarm: `<circle cx="24" cy="26" r="14" fill="F"/><path d="M24 18v8l5 4M12 12l-4 4M36 12l4 4M16 39l-3 4M32 39l3 4"/>`,
  curtains: `<rect x="7" y="7" width="34" height="34" rx="3" fill="#fff"/><path d="M7 7h34"/><path d="M8 8c4 10 4 22 2 33h7c-2-11-1-23 4-33zM40 8c-4 10-4 22-2 33h-7c2-11 1-23-4-33z" fill="F"/><circle cx="24" cy="20" r="4"/>`,
  toilet: `<path d="M13 8h12v14H13z" fill="F"/><path d="M9 22h30c0 8-5 12-11 13l2 6H17l2-6c-6-1-10-5-10-13z" fill="#fff"/>`,
  handwash: `<path d="M16 40V24c0-2 3-2 3 0v-8c0-2 3-2 3 0v-2c0-2 3-2 3 0v2c0-2 3-2 3 0v12c1-3 4-4 5-2l-3 10c-1 3-3 4-6 4z" fill="F"/><path d="M36 8c2 3 3 5 3 6a3 3 0 0 1-6 0c0-1 1-3 3-6zM10 12c1.5 2 2 3 2 4a2 2 0 0 1-4 0c0-1 .5-2 2-4z"/>`,
  face: `<circle cx="22" cy="26" r="14" fill="F"/><path d="M17 23v1M27 23v1M17 31c3 3 7 3 10 0M38 8c2 3 3 5 3 6a3 3 0 0 1-6 0c0-1 1-3 3-6z"/>`,
  teeth: `<path d="M10 38 32 16" stroke-width="5"/><path d="M30 18l8-8" /><rect x="31" y="5" width="9" height="14" rx="2" transform="rotate(45 35.5 12)" fill="F"/><path d="M33 7l5 5M35 5l5 5M31 9l5 5"/>`,
  hair: `<ellipse cx="17" cy="17" rx="10" ry="12" fill="F" transform="rotate(-35 17 17)"/><path d="M24 26l15 15" stroke-width="5"/><path d="M12 12v0M17 10v0M20 15v0M14 18v0M18 21v0M10 16v0" stroke-width="3.4"/>`,
  dress: `<path d="M17 8l-9 6 4 7 4-2v21h16V19l4 2 4-7-9-6c-1 3-4 5-7 5s-6-2-7-5z" fill="F"/>`,
  socks: `<path d="M15 6h14v20l8 7c4 4 0 11-5 9l-14-8c-2-1-3-3-3-6z" fill="F"/><path d="M15 13h14"/>`,
  shoes: `<path d="M6 30c0-6 2-12 6-14l3 6c3 2 8 2 12 3 6 1 11 3 13 7v4H6z" fill="F"/><path d="M6 34h34M17 22l3 3M21 21l2 3"/>`,
  coat: `<path d="M18 7l-8 5-3 26h8v-12l2 14h14l2-14v12h8l-3-26-8-5-6 8z" fill="F"/><path d="M24 15v25M28 22h2M28 28h2"/>`,
  bed: `<path d="M6 36V14M42 36V26M6 26h36M6 32h36" /><rect x="10" y="19" width="10" height="7" rx="3" fill="#fff"/><path d="M20 26v-4c0-2 2-3 4-3h14c2 0 4 2 4 4v3z" fill="F"/>`,
  breakfast: `<path d="M7 24h34c0 9-7 15-17 15S7 33 7 24z" fill="F"/><path d="M31 10l-6 14M14 20c2-2 4-2 6 0M22 17c2-2 4-2 6 0"/>`,
  drink: `<path d="M13 12h22l-3 28H16z" fill="F"/><path d="M14 20h20M28 6l-4 14"/>`,
  pet: `<ellipse cx="24" cy="31" rx="9" ry="8" fill="F"/><circle cx="13" cy="20" r="4" fill="F"/><circle cx="35" cy="20" r="4" fill="F"/><circle cx="19" cy="12" r="4" fill="F"/><circle cx="29" cy="12" r="4" fill="F"/>`,
  bag: `<rect x="10" y="14" width="28" height="27" rx="7" fill="F"/><path d="M18 14v-3c0-3 2-5 6-5s6 2 6 5v3M10 26h28M21 26v4h6v-4"/>`,
  bottle: `<rect x="16" y="14" width="16" height="27" rx="5" fill="F"/><path d="M19 14V9h10v5M16 24h16M23 6h2"/>`,
  lunchbox: `<rect x="7" y="17" width="34" height="22" rx="4" fill="F"/><path d="M7 25h34M18 17v-4c0-2 1-3 3-3h6c2 0 3 1 3 3v4"/>`,
  hug: `<path d="M24 40C10 31 6 24 6 18a8 8 0 0 1 18-4 8 8 0 0 1 18 4c0 6-4 13-18 22z" fill="F"/>`,
  walk: `<path d="M14 8c4 0 5 4 4 8l-1 5c-1 2-7 1-7-1 0-5 0-12 4-12z" fill="F"/><path d="M11 25h6"/><path d="M32 20c4 0 5 4 4 8l-1 5c-1 2-7 1-7-1 0-5 0-12 4-12z" fill="F"/><path d="M29 37h6"/>`,
  car: `<path d="M6 32v-6l5-10h26l5 10v6z" fill="F"/><path d="M14 18h20l3 7H11z" fill="#fff"/><path d="M24 18v7"/><circle cx="14" cy="34" r="4" fill="#fff"/><circle cx="34" cy="34" r="4" fill="#fff"/>`,
  bus: `<rect x="9" y="7" width="30" height="30" rx="5" fill="F"/><path d="M9 25h30M14 13h20v8H14zM14 31h3M31 31h3M14 37v4M34 37v4"/>`,
  weather: `<circle cx="18" cy="18" r="7" fill="#fff"/><path d="M18 5v3M5 18h3M9 9l2 2M27 9l-2 2"/><path d="M15 38h22a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-5 12z" fill="F"/>`,
  // After school
  snack: `<path d="M24 14c-8-4-16 0-16 10 0 9 7 17 12 16 2 0 3-1 4-1s2 1 4 1c5 1 12-7 12-16 0-10-8-14-16-10z" fill="F"/><path d="M24 14c0-4 1-7 4-9M25 11c3-3 7-3 9-1-2 3-6 3-9 1z"/>`,
  unpack: `<rect x="9" y="18" width="30" height="23" rx="6" fill="F"/><path d="M24 4v12M19 9l5-5 5 5M9 28h30"/>`,
  hangcoat: `<path d="M6 10h36M14 10v6M34 10v6"/><path d="M14 16l-5 4-2 18h6v-9l1 11h10l1-11v9h6l-2-18-5-4-5 5z" fill="F" transform="translate(4 0)"/>`,
  homework: `<rect x="8" y="8" width="24" height="32" rx="3" fill="#fff"/><path d="M13 16h14M13 22h14M13 28h8"/><path d="M38 14l4 4-14 14-6 2 2-6z" fill="F"/>`,
  reading: `<path d="M24 14c-5-4-12-5-18-4v26c6-1 13 0 18 4 5-4 12-5 18-4V10c-6-1-13 0-18 4z" fill="F"/><path d="M24 14v26"/>`,
  outside: `<path d="M24 8c-6 0-10 4-10 9-4 1-6 4-6 7 0 4 4 7 8 7h16c4 0 8-3 8-7 0-3-2-6-6-7 0-5-4-9-10-9z" fill="F"/><path d="M24 31v11M17 42h14M24 36l-4-3M24 34l4-3"/>`,
  bike: `<circle cx="12" cy="31" r="7" fill="#fff"/><circle cx="36" cy="31" r="7" fill="#fff"/><path d="M12 31l7-13h12l5 13M19 18l5 13 7-13M17 14h5M31 18l-2-6h4"/><circle cx="24" cy="31" r="1.5" fill="F"/>`,
  ball: `<circle cx="24" cy="24" r="16" fill="F"/><path d="M24 15l7 5-3 8h-8l-3-8zM24 15V8M31 20l7-3M28 28l4 7M20 28l-4 7M17 20l-7-3"/>`,
  music: `<path d="M18 34V12l20-5v22" /><ellipse cx="13" cy="34" rx="5" ry="4" fill="F"/><ellipse cx="33" cy="29" rx="5" ry="4" fill="F"/><path d="M18 18l20-5"/>`,
  draw: `<path d="M24 6C13 6 6 14 6 23c0 10 8 15 14 15 3 0 3-3 2-5s0-5 3-5h6c6 0 11-4 11-10C42 12 34 6 24 6z" fill="F"/><circle cx="15" cy="20" r="2.5" fill="#fff"/><circle cx="22" cy="13" r="2.5" fill="#fff"/><circle cx="31" cy="14" r="2.5" fill="#fff"/>`,
  blocks: `<rect x="7" y="26" width="16" height="14" rx="2" fill="F"/><rect x="25" y="26" width="16" height="14" rx="2" fill="#fff"/><rect x="16" y="12" width="16" height="14" rx="2" fill="F"/><path d="M11 26v-3M19 26v-3M20 12V9M28 12V9M29 26v-3M37 26v-3"/>`,
  puzzle: `<path d="M8 14h10a4 4 0 1 1 8 0h10v10a4 4 0 1 0 0 8v8H26a4 4 0 1 0-8 0H8V30a4 4 0 1 1 0-8z" fill="F"/>`,
  tidy: `<path d="M8 22h32l-3 18H11z" fill="F"/><path d="M6 22h36"/><rect x="12" y="12" width="9" height="10" rx="2" fill="#fff"/><circle cx="30" cy="16" r="5" fill="#fff"/>`,
  cook: `<path d="M8 24h24v6c0 6-4 10-10 10h-4c-6 0-10-4-10-10z" fill="F"/><path d="M32 26h9M14 18c0-3 3-3 3-6M22 18c0-3 3-3 3-6"/>`,
  settable: `<circle cx="24" cy="25" r="12" fill="F"/><circle cx="24" cy="25" r="6" fill="#fff"/><path d="M6 11v8c0 2 1 3 3 3v18M9 11v7M12 11v8c0 2-1 3-3 3M42 11c-3 0-4 5-4 11h4v18"/>`,
  cleartable: `<circle cx="20" cy="28" r="11" fill="F"/><circle cx="20" cy="28" r="5" fill="#fff"/><path d="M33 22h8M37 18l4 4-4 4"/>`,
  chat: `<path d="M8 10h24c2 0 4 2 4 4v12c0 2-2 4-4 4H18l-7 6v-6H8c-2 0-4-2-4-4V14c0-2 2-4 4-4z" fill="F"/><path d="M12 18h16M12 23h10"/><path d="M38 20h2c2 0 4 2 4 4v8c0 2-2 4-4 4v4l-5-4h-9"/>`,
  call: `<path d="M14 6l6 8-4 4c2 5 7 10 12 12l4-4 8 6-4 8C22 38 10 26 6 12z" fill="F"/>`,
  swim: `<path d="M4 34c4 0 4 3 8 3s4-3 8-3 4 3 8 3 4-3 8-3 4 3 8 3M4 41c4 0 4 3 8 3s4-3 8-3 4 3 8 3 4-3 8-3 4 3 8 3"/><circle cx="33" cy="13" r="5" fill="F"/><path d="M10 28l10-10 6 5 6-2"/>`,
  plants: `<path d="M8 20h22v14c0 4-3 6-6 6H14c-3 0-6-2-6-6z" fill="F"/><path d="M30 24l10-8M8 24H4M14 20c-1-4 0-8 5-10 5 2 6 6 5 10"/><path d="M40 12v0M42 18v0M38 20v0" stroke-width="3.5"/>`,
  shoesoff: `<path d="M6 34c0-5 2-10 5-12l3 5c3 2 6 2 9 2 5 1 9 2 10 5z" fill="F"/><path d="M6 37h27M36 10v16M31 21l5 5 5-5"/>`,
  // Bedtime
  bath: `<path d="M5 24h38v4c0 7-5 11-11 11H16c-6 0-11-4-11-11z" fill="F"/><path d="M10 24V11c0-3 4-4 6-1M10 39l-2 4M38 39l2 4"/><circle cx="24" cy="17" r="3"/><circle cx="32" cy="14" r="2"/>`,
  shower: `<path d="M10 42V12c0-4 3-6 7-6s7 2 7 6v2"/><path d="M16 14h16l-2 6H18z" fill="F"/><path d="M20 26v2M24 25v3M28 26v2M18 32v2M24 31v3M30 32v2"/>`,
  pyjamas: `<path d="M17 8l-9 6 4 7 4-2v21h16V19l4 2 4-7-9-6c-1 3-4 5-7 5s-6-2-7-5z" fill="F"/><path d="M27 25a5 5 0 1 1-5-6 4 4 0 0 0 5 6z" fill="#fff"/>`,
  story: `<path d="M24 18c-5-4-12-5-18-4v24c6-1 13 0 18 4 5-4 12-5 18-4V14c-6-1-13 0-18 4z" fill="F"/><path d="M24 18v24M30 4a6 6 0 1 0 8 8 5 5 0 0 1-8-8z"/>`,
  layout: `<path d="M8 40h32"/><path d="M14 10l-6 4 3 5 3-1v14h12V18l3 1 3-5-6-4c-1 2-3 3-6 3s-5-1-6-3z" fill="F" transform="translate(4 0)"/><path d="M36 32h6"/>`,
  laundry: `<path d="M8 18h32l-4 22H12z" fill="F"/><path d="M6 18h36M14 24l2 12M24 24v12M34 24l-2 12M18 18c0-6 12-6 12 0"/>`,
  water: `<path d="M14 10h20l-3 30H17z" fill="#fff"/><path d="M15.5 22h17l-1.8 18H17.3z" fill="F"/>`,
  sleep: `<path d="M30 8a15 15 0 1 0 10 24A13 13 0 0 1 30 8z" fill="F"/><path d="M8 8h6l-6 7h6M14 20h4l-4 5h4"/>`,
  nightlight: `<path d="M17 30h14v6H17z" fill="#fff"/><path d="M24 6c-7 0-11 5-11 11 0 5 4 8 4 13h14c0-5 4-8 4-13 0-6-4-11-11-11z" fill="F"/><path d="M19 40h10"/>`,
  phonebed: `<rect x="15" y="5" width="18" height="32" rx="4" fill="F"/><path d="M21 9h6M10 42h28M24 37v5"/><path d="M28 18a4 4 0 1 1-4-5 3 3 0 0 0 4 5z" fill="#fff"/>`,
  bestbit: `<path d="M24 6l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="F"/>`,
  // Jobs and the rest
  bin: `<path d="M11 14h26l-3 27H14z" fill="F"/><path d="M8 14h32M19 14v-4h10v4M19 20v15M24 20v15M29 20v15"/>`,
  recycle: `<path d="M9 22h30l-3 19H12z" fill="F"/><rect x="14" y="8" width="7" height="14" rx="2" fill="#fff"/><path d="M16 8V5h3v3"/><rect x="26" y="12" width="9" height="10" rx="1.5" fill="#fff"/><path d="M19 30l5-4 5 4M24 26v9"/>`,
  socksmatch: `<path d="M8 8h8v14l5 5c2 2 0 6-3 5l-8-5c-2-1-2-2-2-4z" fill="F"/><path d="M26 8h8v14l5 5c2 2 0 6-3 5l-8-5c-2-1-2-2-2-4z" fill="#fff"/><path d="M8 13h8M26 13h8"/>`,
  dust: `<path d="M10 42l14-16"/><path d="M24 26c-4-4-3-12 3-16 4 1 6 3 7 6 4 0 6 3 6 6-2 4-6 6-10 5-1 2-4 2-6-1z" fill="F"/><path d="M28 16l3 4M33 22l-4-1"/>`,
  sweep: `<path d="M34 6L22 26"/><path d="M14 24l12 6-4 12c-6 0-12-4-14-10z" fill="F"/><path d="M12 31l10 5M16 27l-2 12"/>`,
  dishes: `<path d="M6 22h36v4c0 8-6 14-14 14h-8c-8 0-14-6-14-14z" fill="F"/><circle cx="16" cy="12" r="4" fill="#fff"/><circle cx="27" cy="9" r="3" fill="#fff"/><circle cx="34" cy="15" r="2.5" fill="#fff"/>`,
  car2: `<path d="M6 34v-5l5-9h26l5 9v5z" fill="F"/><path d="M14 22h20l3 6H11z" fill="#fff"/><circle cx="14" cy="36" r="4" fill="#fff"/><circle cx="34" cy="36" r="4" fill="#fff"/><circle cx="16" cy="10" r="3"/><circle cx="25" cy="7" r="2.5"/><circle cx="33" cy="12" r="3.5"/>`,
  // Time cards
  screen: `<rect x="7" y="9" width="34" height="24" rx="3" fill="F"/><path d="M18 41h12M24 33v8"/><path d="M24 15l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="#fff"/>`,
  school: `<path d="M6 20L24 8l18 12" /><rect x="10" y="20" width="28" height="20" fill="F"/><path d="M20 40V30h8v10M14 25h4M30 25h4"/><circle cx="24" cy="15" r="2"/>`,
  meal: `<circle cx="24" cy="25" r="13" fill="F"/><circle cx="24" cy="25" r="7" fill="#fff"/><path d="M6 11v8c0 2 1 3 3 3v18M9 11v7M12 11v8c0 2-1 3-3 3M42 11c-3 0-4 5-4 11h4v18"/>`,
  family: `<circle cx="15" cy="15" r="5" fill="F"/><circle cx="33" cy="15" r="5" fill="F"/><circle cx="24" cy="24" r="4" fill="F"/><path d="M6 40c0-7 4-12 9-12 2 0 3 .5 4 1M42 40c0-7-4-12-9-12-2 0-3 .5-4 1M17 40c0-5 3-8 7-8s7 3 7 8"/>`,
  pencilblank: `<path d="M34 8l6 6-22 22-8 2 2-8z" fill="F"/><path d="M30 12l6 6"/>`,
}
return (key, fill = '#FBEED0') => `<svg viewBox="0 0 48 48" fill="none" stroke="#1A1A2E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${(I[key] || I.pencilblank).replace(/"F"/g, `"${fill}" class="icf"`)}</svg>`
})()
