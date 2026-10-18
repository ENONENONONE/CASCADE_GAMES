// THE FOLD — parts/shaders/check.js: drives fx.js's flash gate, strobe(), by a fake clock under node, 20 requests a second for 5 s, and
// asserts at most 3 admitted onsets in every sliding second, each at least 334 ms after the one before, none under CALM, and every
// sub-threshold request admitted (U3, WCAG 2.3.1). Each run loads fx.js afresh, so no onset carries over. Run: node parts/shaders/check.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, 'fx.js'), 'utf8');
// a page of its own each time: the clock stands at 0 and a frame asked for is counted, never run
let frames = 0;
const load = () => { const ctx = { window: {}, performance: { now: () => 0 }, requestAnimationFrame: () => ++frames, cancelAnimationFrame: () => {} }; ctx.window.window = ctx.window; vm.createContext(ctx); vm.runInContext(src, ctx, { filename: 'fx.js' }); return ctx.window.FOLD_FX; };
let fails = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fails++; console.log('FAIL', msg); } };
// the requests: Γ's room inversion over a grey-0.2 room, a flip of the room, Γ's red CRT tint hsl(0 70 % 60 %) (0.82 on linear light),
// and the sub-threshold ones: the CRT pulse (0.033), a large change on a small patch, a change whose darker state is above 0.8, the warp
// tint [1, 0.55, 0.5] (0.68), a type-only appearance on black (no opposing pair, dL 0)
const LARGE = { 'Γ inversion': { dL: 0.652, area: 1 }, 'room flip': { dL: 0.652 }, 'Γ red tint': { dL: 0.033, area: 1, rgb: [0.88, 0.32, 0.32] }, 'edge of the gate': { dL: 0.1, area: 21824 / (1024 * 768) } };
const SMALL = { 'CRT pulse': { dL: 0.033, area: 1, rgb: [0.373, 0.827, 0.478] }, 'small patch': { dL: 0.652, area: 0.02 }, 'light pair': { dL: 0.15, lo: 0.85, area: 1 }, 'warp tint': { dL: 0.05, area: 1, rgb: [1.0, 0.55, 0.5] }, 'type on black': { dL: 0, area: 0.01 }, 'just under': { dL: 0.099, area: 1 }, 'empty': {} };
const STEP = 50, END = 5000;   // 20 requests a second for 5 s
// one run: a request every STEP ms (every kind in turn when several are given), the times of the admitted ones
function run(FX, kinds, calmOn) {
  if (calmOn != null) FX.calm(calmOn);
  const yes = [], no = []; let k = 0;
  for (let t = 0; t < END; t += STEP) { const q = kinds[k++ % kinds.length]; (FX.strobe(q, t) ? yes : no).push(t); }
  return { yes, no };
}
// at most 3 in every sliding second: each window [t, t + 1000] that opens on an admitted onset holds 3 or fewer; and the spacing
const sliding = ts => ts.every(t => ts.filter(u => u >= t && u <= t + 1000).length <= 3);
const spaced = ts => ts.every((t, i) => i === 0 || t - ts[i - 1] >= 334);
// 1. each large kind alone, CALM off: the gate holds the rate and is not shut (3 in the first second, at 0, 350 and 700)
for (const [name, q] of Object.entries(LARGE)) {
  const { yes } = run(load(), [q], false);
  ok(sliding(yes), name + ': more than 3 onsets in a sliding second: ' + yes.join(' '));
  ok(spaced(yes), name + ': two onsets under 334 ms apart: ' + yes.join(' '));
  ok(yes.filter(t => t < 1000).length === 3, name + ': the gate admits 3 in the first second, not ' + yes.filter(t => t < 1000).length);
  ok(yes.length >= 14, name + ': the gate keeps admitting over 5 s, ' + yes.length + ' onsets');
}
// 2. every large kind mixed, one gate for all: still at most 3 a second
{ const { yes } = run(load(), Object.values(LARGE), false); ok(sliding(yes) && spaced(yes), 'mixed sources share one gate: ' + yes.join(' ')); }
// 3. every sub-threshold request admitted, CALM off and on, and none of them spends an onset
for (const calmOn of [false, true]) for (const [name, q] of Object.entries(SMALL)) { const { no } = run(load(), [q], calmOn); ok(no.length === 0, name + (calmOn ? ' under CALM' : '') + ': ' + no.length + ' sub-threshold requests refused'); }
{ const FX = load(); FX.calm(false); const yes = []; for (let t = 0; t < END; t += STEP) { for (const q of Object.values(SMALL)) ok(FX.strobe(q, t), 'sub-threshold refused at ' + t + ' between flashes'); if (FX.strobe(LARGE['Γ inversion'], t)) yes.push(t); }
  ok(sliding(yes) && spaced(yes) && yes.filter(t => t < 1000).length === 3, 'sub-threshold requests spend no onset: ' + yes.join(' ')); }
// 4. CALM: no large request admitted, live: off again, the gate admits at once
for (const [name, q] of Object.entries(LARGE)) { const { yes } = run(load(), [q], true); ok(yes.length === 0, name + ' under CALM: ' + yes.length + ' admitted'); }
{ const FX = load(); const a = run(FX, Object.values(LARGE), true); ok(a.yes.length === 0 && FX.calm() === true, 'none under CALM, mixed'); FX.calm(false); ok(FX.strobe(LARGE['Γ inversion'], END) && FX.calm() === false, 'CALM off: the gate admits again'); }
// 5. CALM stills the pulse and the warp (F2): neither starts, so no frame is asked for
{ const FX = load(); FX.calm(true); const u = { pulse: { value: 0.5 }, tint: { value: [0, 0, 0] } }, w = { t: { value: 0.3 } }; FX.pulse(u, [1, 0, 0], 1, 600); FX.warpRun(w, 0.35, 1100);
  ok(u.pulse.value === 0 && u.tint.value[0] === 0 && w.t.value === 0 && frames === 0, 'under CALM pulse() and warpRun() stay at 0 and ask no frame');
  FX.calm(false); FX.pulse(u, [1, 0, 0], 1, 600); ok(u.pulse.value === 1 && frames === 1, 'CALM off: the pulse runs again'); FX.calm(true);
  const s = FX.cssFilter('gam', { aspect: 1 }); ok(!/invert/.test(s.filter) && /hue-rotate\(180deg\)/.test(s.filter) && s.transform === 'none', 'under CALM Γ\'s room is a hue turn without the inversion: ' + s); }
{ const FX = load(); const s = FX.cssFilter('gam', { aspect: 1 }), r = FX.cssFilter('gam', { aspect: 1, still: true }), n = FX.cssFilter('gam', { aspect: 1, invert: false }), f = FX.cssFilter('fold', { aspect: 1, still: true });
  ok(/invert\(1\)/.test(s.filter) && s.transform !== 'none', 'Γ inverts the room when the gate admits it'); ok(!/invert/.test(r.filter) && r.transform === 'none' && f.transform === 'none', 'a refused flash holds the room still'); ok(!/invert/.test(n.filter) && n.transform !== 'none', 'STROBE off drops only the inversion'); }
console.log(fails ? 'FAILED ' + fails + ' of ' + checks : 'OK · ' + checks + ' checks, none failed · strobe() admits at most 3 onsets a second, 334 ms apart, none under CALM');
process.exit(fails ? 1 : 0);
