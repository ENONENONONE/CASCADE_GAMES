// THE FOLD — parts/shaders/check.js: drives fx.js's flash gate, strobe(), by a fake clock under node, 20 requests a second for 5 s, and
// asserts at most 3 admitted onsets in every sliding second, each at least 334 ms after the one before, none under CALM, and every
// sub-threshold request admitted (U3, WCAG 2.3.1). Each run loads fx.js afresh, so no onset carries over. Then the rain's code (M1, with
// three.js, data.js, field.js, ar.js and levels.js in a page of its own): each column's words, the day's 260 kept true. Run: node parts/shaders/check.js
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
// 6. the rain's code (M1): column c writes its own name twice, 39 rows apart, n = 3^c's glyph pair and c in 8 bits, in the field's atlas
// slots + 128; the day's 260 (every window the day's plan reads, M2) stays the tape's true digits; decodes write over it; same for all
let code = '';
{ const root = path.join(__dirname, '..', '..'), cv = () => ({ width: 0, height: 0, getContext: () => new Proxy({}, { get: (t, k) => k in t ? t[k] : () => {} }) });
  const ctx = { console, performance: { now: () => 0 }, localStorage: { getItem: () => null, setItem: () => {} }, requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, document: { createElement: cv } }; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
  for (const f of ['vendor/three.min.js', 'data.js', 'field.js', 'parts/shaders/fx.js', 'ar.js', 'parts/levels/levels.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  const F = ctx.FIELD, AR = ctx.AR, FX = ctx.FOLD_FX, pi = ctx.CASCADE_DATA.pi; AR.A.scene = new ctx.THREE.Scene();
  const B = AR.rainInit(pi, 'full'), at = k => B.bytes[(k % 78) * 256 + Math.floor(k / 78)], G = Array.from(F.G16), slot = ch => ch === '∞' ? 26 : G.indexOf(ch) + 10;
  ok(FX.RAIN_SLOTS === 40 && /step\(127\.5, slot\)/.test(B.mesh.material.fragmentShader), 'the atlas holds the two bits (32, 33) and the shader reads a code byte');
  let words = 0, bad = 0;
  for (let c = 0; c < 256; c++) { const w = AR.rainCode(c), name = Array.from(F.glyphs(F.POW[c])).map(slot).concat([7, 6, 5, 4, 3, 2, 1, 0].map(k => 32 + ((c >> k) & 1))).map(x => x + 128);
    if (w.length !== 2 || w[1][0] - w[0][0] !== 39 || w[0][0] < 0 || w[1][0] + w[1][1].length > 78) bad++;
    for (const [r, s] of w) { words++; if (s.join() !== name.join()) bad++; s.forEach((x, j) => { if (at(78 * c + r + j) !== x) bad++; }); } }
  ok(bad === 0 && words === 512, 'each column writes its glyph pair and its dlog in 8 bits, twice, 39 rows apart: ' + bad + ' wrong');
  { let n = 0; for (let k = 0; k < 19968; k++) if (at(k) < 128 && at(k) !== +pi[k]) n++; ok(n === 0, 'every other row the tape\'s own digit at build: ' + n + ' not'); }
  const dayOf = day => { const head = day + 13, plan = ctx.FOLD_LEVELS.plan(day, 'SCRIBE'); AR.rainDay(head); let strip = 0, wins = 0, codeN = 0, cut = 0;
    for (let k = 0; k < 19968; k++) { const b = at(k); if (b >= 128) codeN++; if (k >= head && k < head + 260 && b !== +pi[k]) strip++; }
    for (const sp of plan) if (sp && sp.offset != null) for (let j = 0; j < 8 + (sp.slid || 0); j++) if (at(sp.offset + j) !== +pi[sp.offset + j]) wins++;
    for (let c = 0; c < 256; c++) for (const [r, s] of AR.rainCode(c)) { const k = 78 * c + r, on = s.filter((x, j) => at(k + j) === x).length; if (on && on !== s.length) cut++; }
    return { strip, wins, codeN, cut, head, plan }; };
  for (const day of [9422, 9472, 9384, 12000]) { const d = dayOf(day); ok(d.strip === 0 && d.wins === 0, 'day ' + day + ': the day\'s 260 and its windows the true digits: ' + d.strip + ' ' + d.wins);
    ok(d.cut === 0 && d.codeN > 4900 && d.codeN / 19968 < 0.26, 'day ' + day + ': whole words only, ' + d.codeN + ' code rows of 19968, π the rest (' + (100 - d.codeN / 199.68).toFixed(1) + ' %)'); }
  { const d = dayOf(9422), before = Buffer.from(B.bytes).toString('hex'), sp = d.plan.find(x => x.kind === 'tape'); AR.decode(sp); const gl = Array.from(F.glyphs(parseInt(sp.digits[0], 10) % 257));
    ok(gl.every((g, j) => at(sp.offset + j) === slot(g)), 'a decode writes the start cell\'s glyphs over the window, plain slots'); AR.rainDay(d.head); ok(at(sp.offset) === slot(gl[0]), 'the same day again keeps the decode');
    AR.rainDay(d.head + 1); ok(at(sp.offset) === +pi[sp.offset], 'a new day writes the tape afresh'); AR.rainDay(d.head); B.day = null; AR.rainDay(d.head); ok(Buffer.from(B.bytes).toString('hex') === before, 'the code is a function of the column and the row, the same for every player'); }
  { let n = 0; for (let k = 0; k < 19968; k++) if (at(k) >= 128) n++; code = ' · the code ' + n + ' of 19968 rows'; } }
console.log(fails ? 'FAILED ' + fails + ' of ' + checks : 'OK · ' + checks + ' checks, none failed · strobe() admits at most 3 onsets a second, 334 ms apart, none under CALM' + code);
process.exit(fails ? 1 : 0);
