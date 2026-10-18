// THE FOLD — parts/well/check.js: the eye's numbers (S1) against the code. d(n) by game.js's reverse BFS (the histograms with the six moves
// and with the flip, the six cells one move out, ∞ six), θE for d = 0 … 6, the images of 154 ROAD TO DAMASCUS, the ring at the Airy disc's
// first bright ring, the ring's luminance against the flash gate, ar.js's lensed() (the taps' lens) on 154, the eye and SEED, and where the
// lens is lit; and the crossing (S4): the sky's negative under the band and the gate, THE EYE's par 2 on a gold day, Γ Γ closing it
// through ∞. Loads three.js, data.js, field.js, game.js, fx.js, ar.js, well.js and levels.js in a page of its own. Run: node parts/well/check.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..'), read = p => fs.readFileSync(path.join(root, p), 'utf8');
const ctx = { console, performance: { now: () => 0 }, localStorage: { getItem: () => null, setItem: () => {} }, requestAnimationFrame: () => 0, cancelAnimationFrame: () => {} };
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
for (const f of ['vendor/three.min.js', 'data.js', 'field.js', 'game.js', 'parts/shaders/fx.js', 'ar.js', 'parts/well/well.js']) vm.runInContext(read(f), ctx, { filename: f });
const F = ctx.FIELD, G = ctx.GAME, FX = ctx.FOLD_FX, AR = ctx.AR, W = ctx.FOLD_WELL;
let fails = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fails++; console.log('FAIL', msg); } };
const near = (a, b, tol, msg) => ok(Math.abs(a - b) <= tol, msg + ': ' + a + ' against ' + b);
const deg = r => r * 180 / Math.PI, rad = d => d * Math.PI / 180;
// d(n): the moves to 137 over the 258 points
const hist = d => d.reduce((h, x) => (h[x] = (h[x] || 0) + 1, h), []);
const d6 = G.toEye(F.OPS), d7 = G.toEye(F.OPS.concat([F.FLIP]));
ok(hist(d6).join() === '1,6,22,58,111,59,1', 'd with the six moves: ' + hist(d6).join());
ok(hist(d7).join() === '1,6,22,63,122,43,1', 'd with the flip: ' + hist(d7).join());
ok(d6.map((x, n) => x === 1 ? n : -1).filter(n => n >= 0).join() === '105,120,121,154,217,242', 'the six at d = 1');
ok(d6[F.INF] === 6 && d6.indexOf(6) === F.INF, '∞ alone at d = 6');
// θE = (92/11)°/√(d + 1)
[8.36, 5.91, 4.83, 4.18, 3.74, 3.41, 3.16].forEach((t, d) => near(+deg(W.thetaE(d)).toFixed(2), t, 0.005, 'θE at d = ' + d));
ok(W.thetaE(-1) === 0, 'θE off where the eye is out of reach');
// the eye's place and 154's images: 8.452° out, at 13.60° and −5.14° on the eye, 9.50° and −1.05° on ∞
const L = AR.place(137).normalize(); near(+deg(Math.asin(L.y)).toFixed(2), -34, 0.005, 'the eye\'s elevation'); near(+((deg(Math.atan2(L.x, -L.z)) + 360) % 360).toFixed(2), 101.25, 0.005, 'the eye\'s azimuth');
const b154 = Math.acos(L.dot(AR.place(154).normalize())); near(+deg(b154).toFixed(3), 8.452, 0.0005, '154 from the eye');
for (const [d, p, m] of [[0, 13.60, -5.14], [6, 9.50, -1.05]]) { const e = W.thetaE(d), tp = W.image(b154, e); near(+deg(tp).toFixed(2), p, 0.005, '154 primary at d = ' + d); near(+deg(b154 - tp).toFixed(2), m, 0.005, '154 secondary at d = ' + d); near(W.source(tp, e), b154, 1e-12, 'the lens equation inverts at d = ' + d); }
// the ring: airy's first bright ring stands at r = 1.3405 between the dark rings at 1 and 1.831
{ let best = 0, at = 0; for (let r = 1; r <= 1.831; r += 0.0005) { const v = FX.airy(r); if (v > best) { best = v; at = r; } } near(+at.toFixed(3), W.RING, 0.003, 'the first bright ring'); near(best, 0.0173, 0.0005, 'its value'); near(FX.airy(W.RING_IN), 0, 0.001, 'dark at r = 1'); near(FX.airy(W.RING_OUT), 0, 0.001, 'dark at r = 1.831'); }
// the ring's luminance: gold × airy^0.45 × gain over black, and gold at that alpha over the room
const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4), lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const peak = Math.pow(FX.airy(W.RING), 0.45) * FX.LENS_GAIN;
near(lum(FX.GOLD.map(c => c * peak)), W.RING_SKY, 0.002, 'the ring over the sky'); ok(W.RING_SKY < 0.1, 'the ring over the sky is under the gate');
near(peak * lum(FX.GOLD), W.RING_ROOM, 0.002, 'the ring over the room');
ok(FX.strobe({ dL: W.RING_SKY, area: 1 }, 0) && FX.strobe({ dL: W.RING_SKY, area: 1 }, 1) && FX.strobe({ dL: W.RING_SKY, area: 1 }, 2), 'the sky ring always passes, uncounted');
// ar.js lensed(): the taps' lens
AR.A.lensU.lensE.value = W.thetaE(0);
near(+deg(Math.acos(L.dot(AR.lensPlace(154).normalize()))).toFixed(3), 13.597, 0.0005, '154\'s image for the taps');
near(AR.lensPlace(154).length(), 6, 1e-9, 'an image keeps its radius');
ok(AR.lensPlace(137).distanceTo(AR.place(137)) < 1e-9, 'the eye stays');
ok(AR.lensPlace(0).distanceTo(AR.place(0)) < 1e-9, 'SEED on the floor does not bend');
{ const far = AR.lensPlace(F.INF).normalize(), b = Math.acos(L.dot(AR.place(F.INF).normalize())); near(Math.acos(L.dot(far)), W.image(b, W.thetaE(0)), 1e-9, '∞, 124° out, at its primary image'); }
AR.A.lensU.lensE.value = 0; ok(AR.lensPlace(154).distanceTo(AR.place(154)) < 1e-12, 'θE 0 bends nothing');
// where the lens is lit: 49–56 daily, JUMP, d ≤ 2
ok(W.lit({ current: 5, mode: 'daily', level: 56, digit: 0 }, 5) && W.lit({ current: 5, mode: 'daily', level: 49, digit: 0 }, 4), 'lit in 49–56');
ok(!W.lit({ current: 5, mode: 'daily', level: 48, digit: 0 }, 3) && !W.lit({ current: 5, mode: 'daily', level: 57, digit: 0 }, 3), 'dark outside 49–56 past d = 2');
ok(W.lit({ current: 5, mode: 'free', level: 1, digit: 7 }, 5), 'lit on JUMP');
ok(W.lit({ current: 5, mode: 'daily', level: 1, digit: 0 }, 2) && !W.lit({ current: 5, mode: 'daily', level: 1, digit: 0 }, 3), 'lit within two moves');
ok(!W.lit({ mode: 'daily', level: 56 }, 0) && !W.lit({ current: 5, mode: 'daily', level: 56 }, -1), 'dark with no cell or no road');
// S4, the crossing. The sky's negative, max(0.120·green − col, 0), on the field's base (band, SEED, zenith; breathing after): never above
// the band's own 0.085·green, and its change of luminance under the gate's 0.1 everywhere, so the one onset asked is never refused
{ const G3 = FX.GREEN, O = FX.GOLD, base = z => { const band = Math.exp(-z * z * 5), seed = Math.exp(-(z + 1) * 4), zen = Math.exp(-(1 - z) * 6); return [0, 1, 2].map(i => G3[i] * (0.040 + 0.045 * band) + O[i] * 0.035 * seed + G3[i] * 0.06 * zen); };
  let top = 0, dL = 0; for (let z = -1; z <= 1; z += 0.001) { const c = base(z), n = c.map((x, i) => Math.max(0, 0.120 * G3[i] - x)); top = Math.max(top, lum(n)); dL = Math.max(dL, Math.abs(lum(n) - lum(c))); }
  ok(top <= lum(G3.map(c => c * 0.085)), 'the negative never outshines the band: ' + top.toFixed(4)); ok(dL < 0.1 && dL <= 0.02, 'the negative under the gate (index.html asks dL 0.02): ' + dL.toFixed(4)); }
// a gold day keeps THE EYE's par 2 (game.js), and Γ Γ closes it at ★★★ through ∞: day 9472, 2026-12-07
{ const day = new vm.Script('Date').runInContext(ctx), Fixed = class extends day { constructor(...a) { if (a.length) super(...a); else super(2026, 11, 7, 12); } };
  vm.runInContext(read('parts/levels/levels.js'), ctx, { filename: 'levels.js' }); ctx.Date = Fixed;
  ok(F.dayNumber(new ctx.Date()) === 9472 && 9472 % 128 === 0, 'the clock stands on gold day 9472');
  const plan = ctx.FOLD_LEVELS.plan(9472, 'SCRIBE'); G.start('SCRIBE', 'daily', plan); G.level(56); const S = G.S;
  ok(S.kind === 'eye' && S.goldDay && S.free.has('i') && S.par === 2, 'THE EYE on a gold day keeps par 2: ' + S.par);
  ok(G.apply('gam') === F.INF && !S.crossed && G.apply('gam') === 1 && S.done && !S.lost && S.stars[55] === 3 && S.crossed, 'Γ Γ crosses at ★★★');
  G.level(56); ok(G.apply('g') != null && G.undo() === 'g' && S.crossed, 'crossed holds through the day'); ctx.Date = day; }
console.log(fails ? fails + ' of ' + checks + ' checks failed' : 'OK · ' + checks + ' checks, none failed · d ' + hist(d6).join(' ') + ' · θE ' + [0, 6].map(d => deg(W.thetaE(d)).toFixed(2) + '°').join(' … ') + ' · 154 at ' + deg(W.image(b154, W.thetaE(0))).toFixed(2) + '°');
process.exit(fails ? 1 : 0);
