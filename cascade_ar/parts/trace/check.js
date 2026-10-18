// THE FOLD — parts/trace/check.js: the field ray tracer under node, no canvas but a stub. The 256 directions against relief.js's orbit and
// the ×u law, the dlog ordering; the hit statistic (about half of all rays meet a given sheet, by the character) and every root on its sheet;
// reflections kept on the circle and found among the 256; Γ, T and the field's answer to the tunnel's 140; Snell's 33024 refract / 32512
// reflect over 256 directions × 256 indices; the render, its modes, its determinism and its cost; the beam, the persistence's one onset a move
// and its frame-to-frame bound; lightAt; the default scene for every chapter's sheet. Run: node parts/trace/check.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..'), read = p => fs.readFileSync(path.join(root, p), 'utf8');
// a page of its own: a clock the test moves, a canvas that only holds its pixels
let NOW = 0;
const canvas = () => { const c = { width: 0, height: 0, style: {} }; c.getContext = () => ({ imageSmoothingEnabled: true, createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }), putImageData() {}, clearRect() {}, drawImage() {} }); return c; };
const ctx = { console, performance: { now: () => NOW }, localStorage: { getItem: () => null, setItem: () => {} }, document: { createElement: canvas } }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['data.js', 'field.js', 'parts/levels/levels.js', 'parts/relief/relief.js', 'parts/rays/rays.js', 'parts/trace/trace.js']) vm.runInContext(read(f), ctx, { filename: f });
const F = ctx.FIELD, RL = ctx.FOLD_RELIEF, RY = ctx.FOLD_RAYS, LV = ctx.FOLD_LEVELS, T = ctx.FOLD_TRACE, P = 257, INF = 257, mod = n => ((n % P) + P) % P;
let fails = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fails++; console.log('FAIL', m); } };
const near = (a, b, e) => Math.abs(a - b) <= e;
// a deterministic generator for the random rays (an LCG), so every run draws the same
let h = 0x9E3779B9; const rnd = m => (h = (Math.imul(h, 1103515245) + 12345) >>> 0, (h >>> 8) % m);
// 1. the directions: THE TURN's orbit, 256 distinct points of x² + y² ≡ 1, equal to relief.js's orbit() and to the recomputation; ×u^j on
// x + 16y turns j steps; 'dlog' is the same set ordered by 3^k, k_turn = 155 k_dlog; idx inverts
{ const D = T.dirs('turn'), E = T.dirs('dlog'), o = RL.orbit(), own = T.orbit(); let bad = 0, bd = 0, bw = 0, bi = 0;
  for (let k = 0; k < 256; k++) { if (mod(D.X[k] * D.X[k] + D.Y[k] * D.Y[k]) !== 1 || mod(E.X[k] * E.X[k] + E.Y[k] * E.Y[k]) !== 1) bad++; if (D.X[k] !== o.pts[k][0] || D.Y[k] !== o.pts[k][1] || own[k][0] !== o.pts[k][0] || own[k][1] !== o.pts[k][1]) bd++;
    if (D.W[k] !== F.POW[147 * k % 256] || E.W[k] !== F.POW[k] || E.W[k] !== D.W[155 * k % 256]) bw++; if (D.idx[D.W[k]] !== k || E.idx[E.W[k]] !== k) bi++; }
  ok(bad === 0 && new Set(D.W).size === 256 && new Set(E.W).size === 256, '256 distinct unit directions in each ordering: ' + bad + ' off the circle');
  ok(bd === 0 && o.closed && o.u === 216 && F.DLOG[216] === 147, 'the turn\'s directions are relief.js\'s orbit, u = 216 = 3^147: ' + bd + ' differ');
  ok(bw === 0 && bi === 0, 'w = x + 16y is u^k by the turn and 3^k by dlog, k_turn = 155·k_dlog; idx inverts: ' + bw + ' ' + bi);
  let rot = 0; for (let k = 0; k < 256; k++) for (const j of [1, 7, 64, 128, 255]) { const w = F.mul(D.W[k], F.POW[147 * j % 256]); if (w !== D.W[(k + j) % 256]) rot++; } ok(rot === 0, 'a turn of j steps is ×u^j on x + 16y: ' + rot + ' wrong');
  ok(RY.RAY_RGB.every((c, i) => c.every((v, j) => near(v, T.RAY_RGB[i][j], 1e-9))), 'the twelve wavelengths are rays.js\'s (ar.js\'s)'); }
// 2. the hit: about half of all (ray, sheet) pairs meet, by the character; every root lies on its sheet and on its ray at its t; the nearest is the
// smallest t ≥ 1; the real sign reading is half too; the tangent (disc 0) and the linear (a ≡ 0) cases
{ const D = T.dirs('turn'), forms = Object.keys(T.FORMS), N = 40000; let hits = 0, wrong = 0, order = 0, hs = 0;
  for (let i = 0; i < N; i++) { const f = forms[rnd(6)], r = rnd(P), px = rnd(P), py = rnd(P), k = rnd(256), dx = D.X[k], dy = D.Y[k], H = T.hit(f, r, px, py, dx, dy);
    if (H) { hits++; if (mod(T.FORMS[f](H.x, H.y)) !== r || H.x !== mod(px + H.t * dx) || H.y !== mod(py + H.t * dy) || H.t < 1 || H.t > 256) wrong++;
      for (let t = 1; t < H.t; t++) if (mod(T.FORMS[f](mod(px + t * dx), mod(py + t * dy))) === r) order++; }   // no earlier step of d stands on the sheet
    if (T.hit(f, r, px, py, dx, dy, { hits: 'sign' })) hs++; }
  ok(near(hits / N, 0.5, 0.02), 'by the character about half the rays hit: ' + (hits / N).toFixed(4)); ok(wrong === 0 && order === 0, 'every root on its sheet at its t, the nearest first: ' + wrong + ' ' + order);
  ok(near(hs / N, 0.5, 0.02), 'by the real sign about half too: ' + (hs / N).toFixed(4));
  ok(Object.keys(T.FORMS).every(k => RL.CONIC_FORMS[k] && [[3, 5], [200, 17], [0, 0], [256, 1]].every(([x, y]) => mod(T.FORMS[k](x, y)) === mod(RL.CONIC_FORMS[k](x, y)))), 'the six forms are the relief\'s CONIC_FORMS');
  const tg = T.hit('circle', 1, 0, 2, 1, 0);   // from (0, 2) along x: x² + 4 ≡ 1 → x² ≡ −3 = 254, a residue? both roots or none; the tangent case below
  ok(!tg || mod(tg.x * tg.x + tg.y * tg.y) === 1, 'a hit of the unit circle lies on it');
  const tan = T.hit('circle', 1, 0, 1, 1, 0); ok(tan === null, 'the ray from (0, 1) along x touches the circle where it stands (t = 0) and hits nowhere else: ' + JSON.stringify(tan));
  const lin = T.hit('product', 5, 3, 7, 0, 1); ok(lin && lin.a === 0 && lin.t === mod((5 - 21) * F.inv(3)) && lin.x === 3 && mod(lin.x * lin.y) === 5, 'a ≡ 0 along the product\'s null line: one root, ' + JSON.stringify(lin));
  ok(T.hit('product', 5, 0, 7, 0, 1) === null, 'a ray inside the product\'s null cone through the origin never meets xy ≡ 5'); }
// 3. the bounce: an orthogonal reflection keeps d on the circle, twice is the identity, the result is one of the 256; a null normal is refused
{ const D = T.dirs('turn'); let bad = 0, nulls = 0, n = 0;
  for (let k = 0; k < 256; k++) for (let j = 0; j < 256; j += 3) { const r = T.reflect(D.X[k], D.Y[k], D.X[j], D.Y[j]); n++; if (!r) { nulls++; continue; } if (mod(r[0] * r[0] + r[1] * r[1]) !== 1 || D.idx[mod(r[0] + 16 * r[1])] == null) bad++; const b = T.reflect(r[0], r[1], D.X[j], D.Y[j]); if (b[0] !== D.X[k] || b[1] !== D.Y[k]) bad++; }
  ok(bad === 0 && nulls === 0, 'reflection about a unit normal stays on the circle and is an involution: ' + bad + ' wrong of ' + n);
  ok(T.reflect(1, 0, 1, 16) === null && T.reflect(1, 0, 0, 0) === null, 'a null normal (y = 16x) and a zero normal refuse');
  // the gradient is exact for a quadratic, and the normal at a hit point of each form
  let gb = 0; for (const [f, g] of [['circle', (x, y) => [2 * x, 2 * y]], ['ellipse', (x, y) => [2 * x, 8 * y]], ['hyperbola', (x, y) => [2 * x, -2 * y]], ['product', (x, y) => [y, x]], ['parabola', (x, y) => [-2 * x, 1]], ['norm', (x, y) => [2 * x + y, x - 2 * y]]]) for (let i = 0; i < 300; i++) { const x = rnd(P), y = rnd(P), a = T.grad(f, x, y), b = g(x, y); if (a[0] !== mod(b[0]) || a[1] !== mod(b[1])) gb++; } ok(gb === 0, 'the gradient by central differences is the form\'s own: ' + gb + ' wrong'); }
// 4. Γ and T: the open circuit, the match, the pole, the mirrors; T = 1 + Γ; the tunnel's 140 is a cell, not a transmission: T = 140 at Z = 247 alone
{ ok(T.gamma(INF) === 1 && T.gamma(120) === 0 && T.gamma(137) === INF && T.gamma(46) === 46 && T.gamma(92) === 92, 'Γ(∞) = 1, Γ(120) = 0, Γ(137) = ∞, the mirrors fixed');
  let agree = 0; for (let z = 0; z <= 257; z++) if (T.gamma(z) === F.gamma(z)) agree++; ok(agree === 258, 'Γ is field.js\'s on all 258 points: ' + agree);
  const t140 = []; for (let z = 0; z <= 257; z++) if (T.trans(z) === 140) t140.push(z); const g140 = []; for (let z = 0; z <= 257; z++) if (T.gamma(z) === 140) g140.push(z);
  ok(t140.join() === '247' && T.gamma(247) === 139 && g140.join() === '4' && T.trans(4) === 141, 'T = 140 at Z = 247 only (Γ 139); Γ = 140 at Z = 4 (T 141): ' + t140 + ' / ' + g140);
  ok(T.trans(INF) === 2 && T.trans(120) === 1 && T.trans(137) === INF, 'T(∞) = 2, T(120) = 1, T(137) = ∞'); }
// 5. Snell over 256 directions × 256 indices from n₁ = 1: 33024 refract, 32512 reflect (the two directions with y = 0 always pass; the other 254
// pass for 128 indices each: 1 − y₂² a square or zero for 128 of the 256 values of y₂); n₁ = n₂ is the identity; the bent direction is a unit
{ const D = T.dirs('turn'); let rf = 0, rl = 0, unit = 0, same = 0;
  for (let k = 0; k < 256; k++) { for (let n = 1; n <= 256; n++) { const r = T.refract(D.X[k], D.Y[k], 1, n); if (r) { rf++; if (mod(r[0] * r[0] + r[1] * r[1]) !== 1 || mod(n * r[1]) !== D.Y[k]) unit++; } else rl++; } const s = T.refract(D.X[k], D.Y[k], 11, 11); if (s && s[0] === D.X[k] && s[1] === D.Y[k]) same++; }
  ok(rf === 33024 && rl === 32512, 'Snell: ' + rf + ' refract, ' + rl + ' reflect'); ok(unit === 0 && same === 256, 'every bent direction is a unit with n₂y₂ ≡ n₁y₁; the same index bends nothing: ' + unit + ' ' + same); }
// 6. the render: 256 pixels, deterministic, every mode, the stats consistent; the eye at ∞ sees nothing; the cost
let cost = '';
{ const sc = T.scene({ sheet: 'product', target: 200, current: 62, home: 92 }), R = T.render(sc, [62, 0]), R2 = T.render(sc, [62, 0]);
  ok(R.light.length === 768 && R.light.every((v, i) => v === R2.light[i]) && JSON.stringify(Object.assign({}, R.stats, { ms: 0 })) === JSON.stringify(Object.assign({}, R2.stats, { ms: 0 })), 'a render is deterministic');
  ok(R.hits > 128 && R.hits <= 256 && R.bounces >= R.hits && R.stats.depth <= 4 && R.stats.reflect + R.stats.refract <= R.bounces && R.stats.coherence >= 0 && R.stats.coherence <= 1, 'the stats hold together: ' + JSON.stringify(R.stats));
  ok(sc.surfaces.length === 5 && sc.lights.length === 6 && sc.surfaces[0].form === 'product' && sc.surfaces[0].r === 200 && sc.surfaces[0].Z === 200 && sc.lights[5].x === 62, 'the default scene: the sheet at the target, four more sheets, SEED, four stars and the eye');
  for (const c of T.CYCLE) { const m = Object.assign({}, T.DEFAULT, c.m), X = T.render(sc, [62, 0], m); let lit = 0; for (let p = 0; p < 256; p++) if (X.light[p * 3] + X.light[p * 3 + 1] + X.light[p * 3 + 2] > 0) lit++;
    ok(X.light.length === 768 && lit > 100 && lit <= (m.pixel === 'cell' ? 255 : 256) && X.hits >= lit && (m.bounce === 'snell' ? X.stats.refract > 0 : X.stats.refract === 0), c.name + ': ' + lit + ' lit of ' + X.hits + ' hit, ' + X.bounces + ' bounces, refract ' + X.stats.refract); }
  { const m = Object.assign({}, T.DEFAULT, { pixel: 'cell' }), X = T.render(sc, [62, 0], m); ok(X.light[0] === 0 && X.light[1] === 0 && X.light[2] === 0, 'pixel 0 (SEED) stays dark under the cell mapping'); }
  const Z = T.render(sc, null); ok(Z.light.every(v => v === 0) && Z.hits === 0, 'the eye at ∞ (no origin) sees nothing');
  // the glow is the field's: each contribution A·T·E read as value/256, so no pixel exceeds depth × 3 (three channels) and a dark sheet (Γ ∞) swallows
  const dark = { surfaces: [{ form: 'circle', r: 1, n: 3, Z: 137 }], lights: sc.lights }, Dk = T.render(dark, [5, 0]); ok(Dk.stats.absorbed === Dk.hits && Dk.light.every(v => v === 0), 'the pole\'s impedance swallows every ray that meets it: ' + Dk.hits + ' hit, ' + Dk.stats.absorbed + ' absorbed, no light');
  const ts = []; for (let i = 0; i < 300; i++) { const t0 = process.hrtime.bigint(); T.render(sc, [i % 256 + 1, 0]); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); } ts.sort((a, b) => a - b);
  cost = ' · a render ' + ts[150].toFixed(2) + ' ms median, ' + ts[270].toFixed(2) + ' p90 (node)'; ok(ts[150] < 2, 'a render of 256 rays × 4 bounces × 5 sheets under 2 ms: median ' + ts[150].toFixed(3) + ' ms'); }
// 7. the beam: the Airy function is fx.js's (airy(0) = 1, the first dark ring at r = 1), the 16-level kernel keeps a flat field flat and spreads
// one pixel to its eight neighbours; the 64-tile is 4096 × 3 with the barrel and the vignette
{ ok(near(T.airy(0), 1, 1e-6) && Math.abs(T.airy(1)) < 1e-3 && T.airy(1.3405) > 0.015 && T.airy(1.3405) < 0.02, 'airy(0) = 1, airy(1) ≈ 0, the first bright ring 1.75 %: ' + T.airy(1).toFixed(5) + ' ' + T.airy(1.3405).toFixed(4));
  const b16 = T.beam({ size: 16 }), b64 = T.beam({ size: 64 }), flat = new Float32Array(768).fill(0.5), one = new Float32Array(768); one[(7 * 16 + 7) * 3] = 1;
  const F16 = T.image(flat, b16); ok(F16.length === 768 && F16.every(v => near(v, 0.5, 1e-5)), 'a flat field stays flat through the 16-level kernel');
  const O16 = T.image(one, b16); let nb = 0, far = 0, sum = 0; for (let q = 0; q < 256; q++) { const v = O16[q * 3]; sum += v; const dx = Math.abs(q % 16 - 7), dy = Math.abs((q >> 4) - 7); if (dx <= 1 && dy <= 1) { if (v <= 0) nb++; } else if (v !== 0) far++; }
  ok(nb === 0 && far === 0 && O16[(7 * 16 + 7) * 3] > O16[(7 * 16 + 8) * 3] && O16[(7 * 16 + 8) * 3] > O16[(8 * 16 + 8) * 3] && near(sum, 1, 0.02), 'one lit pixel spreads to its eight neighbours and no further, the centre brightest, the energy kept: ' + sum.toFixed(3));
  const I64 = T.image(flat, b64); ok(I64.length === 4096 * 3 && b64.barrel === 0.0234 && b64.vignette && near(I64[(32 * 64 + 32) * 3], 0.5 * (1 - 0.4 * 2 * (0.5 / 64) ** 2), 1e-3) && I64[0] < I64[(32 * 64 + 32) * 3] * 0.6, 'the 64-tile: 4096 pixels, the 2.34 % barrel, the vignette 1 − 0.4r² dark at the corners');
  const rgba = T.toRGBA(I64); ok(rgba.length === 16384 && rgba[3] === 255 && rgba[(32 * 64 + 32) * 4] === Math.round(I64[(32 * 64 + 32) * 3] * 255), 'toRGBA: 64 × 64 × 4, opaque'); }
// 8. the persistence: F(T) the P22's, shown = max(target, prev·F): between moves every pixel only falls, by at most 0.036 a 60 Hz frame at τ 600 ms
// (the steepest step of F over 1/72 is 0.0358, at T ≈ 0.4; the bound 0.04); a move is the one onset. The Tile does the same on a stub canvas, still under CALM
{ const Fp = T.persistence; ok(Fp(0) === 1 && Fp(0.5) === 0 && near(Fp(0.25), Math.cos(Math.PI / 4) * Math.exp(-0.125), 1e-9), 'F(T) = cos(πT)e^(−0.5T), 1 → 0 over T = 0 … ½');
  const prev = new Float32Array(300).map((_, i) => (i * 37 % 101) / 100), tgt = new Float32Array(300).map((_, i) => (i * 53 % 97) / 100); let s0 = T.persist(prev, tgt, 0), mono = 0, big = 0;
  for (let f = 1; f <= 36; f++) { const s1 = T.persist(prev, tgt, f / 72); for (let i = 0; i < 300; i++) { if (s1[i] > s0[i] + 1e-9) mono++; if (s0[i] - s1[i] > 0.04) big++; } s0 = s1; }
  ok(mono === 0 && big === 0 && s0.every((v, i) => v === tgt[i]), 'between moves no pixel rises and none falls over 0.04 a frame; at T = ½ the new picture alone stands: ' + mono + ' ' + big);
  // the Tile on a stub canvas: two moves, frames at 60 Hz, exactly one rise a pixel a move
  const sc = T.scene({ sheet: 'circle', target: 44, current: 1, home: 92 }), tile = T.Tile(canvas(), { size: 64, dpr: 1, tau: 600, calm: false }); NOW = 1000;
  tile.set(sc, [1, 0]); tile.frame(NOW); const lum = () => { let s = 0; for (let q = 0; q < 4096; q++) s += Math.min(1, tile.o.gain * (0.2126 * tile.shown[q * 3] + 0.7152 * tile.shown[q * 3 + 1] + 0.0722 * tile.shown[q * 3 + 2])); return s / 4096; };
  for (let f = 0; f < 80; f++) { NOW += 16.7; tile.frame(NOW); }
  let rises = 0, falls = 0, maxd = 0, prevL = lum(); const seq = [];
  tile.set(sc, [3, 0]); tile.frame(NOW); seq.push(lum());   // the move: one onset
  for (let f = 0; f < 80; f++) { NOW += 16.7; tile.frame(NOW); const L = lum(); seq.push(L); }
  for (let i = 1; i < seq.length; i++) { const d = seq[i] - seq[i - 1]; if (d > 1e-6) rises++; if (d < -1e-6) falls++; maxd = Math.max(maxd, Math.abs(d)); }
  ok(rises === 0 && maxd <= 0.04, 'after the move the tile\'s luminance only falls, ' + falls + ' falling frames, the largest step ' + maxd.toFixed(4) + ' (one onset a move, at the move)');
  ok(tile.stats && tile.stats.hit > 0 && tile.ms < 10, 'the tile renders on set(): ' + tile.stats.hit + ' hit, ' + tile.ms.toFixed(2) + ' ms');
  const calm = T.Tile(canvas(), { calm: true, tau: 600 }); NOW = 5000; calm.set(sc, [1, 0]); calm.frame(NOW); const a = Float32Array.from(calm.shown); calm.set(sc, [9, 0]); calm.frame(NOW + 1); const b = Float32Array.from(calm.shown); NOW += 300; calm.frame(NOW); const c = Float32Array.from(calm.shown);
  ok(b.every((v, i) => v === c[i]) && b.every((v, i) => v === calm.target[i]) && !a.every((v, i) => v === b[i]), 'under CALM the new picture stands at once and nothing moves between moves');
  const m0 = tile.modeName, m1 = tile.cycle().name; ok(m1 !== m0 && tile.cycleIndex === 1 && tile.mode.dirs === 'dlog' && T.CYCLE.length === 6, 'cycle() steps the law: ' + m0 + ' → ' + m1); for (let i = 0; i < 5; i++) tile.cycle(); ok(tile.cycleIndex === 0, 'six steps come home');
  // the tile is 64 × 64 CSS px: 4096 px², under the flash gate's area (2.8 % of the screen: 21824 px² at 1024 × 768, 9217 on a 390 × 844 phone), so no change of it is a large flash
  ok(4096 < 21824 / (1024 * 768) * 390 * 844 && 4096 < 21824, 'the tile\'s area 4096 px² is under the gate\'s 2.8 % on a phone (9217) and a desktop (21824)'); }
// 9. lightAt: an angle in [0, 2π), the energy the light's sum, the colour unit, one lit direction gives its own azimuth (dlog/256 of a turn) and cell
{ const sc = T.scene({ sheet: 'norm', target: 154, current: 103, home: 103 }), L = T.lightAt(sc, [103, 0]);
  ok(L.angle >= 0 && L.angle < 2 * Math.PI && L.energy > 0 && Math.max(...L.rgb) === 1 && L.coherence >= 0 && L.coherence <= 1 && L.cell > 0 && L.cell <= 256, 'lightAt: ' + JSON.stringify({ angle: +L.angle.toFixed(3), energy: +L.energy.toFixed(1), coherence: +L.coherence.toFixed(3), cell: L.cell }));
  // a render in hand is read without a second render; one lit direction gives its own azimuth and cell; two opposite ones cancel
  const D = T.dirs('turn'); let bad = 0; for (const k of [0, 1, 17, 100, 255]) { const light = new Float32Array(768); light[k * 3 + 1] = 0.7; const X = T.lightAt({ light, modes: T.DEFAULT }); if (!near(X.angle, F.DLOG[D.W[k]] / 256 * 2 * Math.PI, 1e-9) || X.cell !== D.W[k] || !near(X.coherence, 1, 1e-9) || !near(X.energy, 0.7, 1e-6) || X.rgb.join() !== '0,1,0') bad++; }
  ok(bad === 0, 'one lit direction: its azimuth is its cell\'s, dlog/256 of a turn, its cell, coherence 1: ' + bad + ' wrong');
  { const light = new Float32Array(768); light[0] = 1; light[128 * 3] = 1; const X = T.lightAt({ light, modes: T.DEFAULT }); ok(near(X.coherence, 0, 1e-9) && near(X.energy, 2, 1e-9), 'the direction and its opposite (u^128 = −1, half a turn in dlog) cancel: coherence ' + X.coherence.toFixed(6)); }
  const R = T.render(sc, [103, 0]), Y = T.lightAt(R); ok(near(Y.angle, L.angle, 1e-9) && Y.energy === L.energy && Y.cell === L.cell, 'lightAt(render result) equals lightAt(scene, origin)'); }
// 10. every chapter's sheet makes a scene (the room takes the norm), as the game's levels name them; the eye's level (target ∞) takes the home cell
{ ok(LV.CHAPTER_SHEETS.every(s => { const sc = T.scene({ sheet: s, target: 7, current: 1, home: 92 }); return T.FORMS[sc.surfaces[0].form] && sc.surfaces[0].form === (T.FORMS[s] ? s : 'norm'); }), 'every chapter sheet is a form, the room the norm: ' + LV.CHAPTER_SHEETS.join(' '));
  const eye = T.scene({ sheet: 'norm', target: INF, current: 137, home: 92 }); ok(eye.surfaces[0].r === 92 && eye.surfaces[0].Z === INF && eye.lights[5].x === 137, 'THE EYE\'s scene: the sheet at the home cell, the open impedance, the eye lit at 137');
  const plan = LV.plan(9422, 'SCRIBE'); let n = 0; for (const sp of plan) { const sc = T.scene({ sheet: sp.sheet, target: sp.target, current: sp.start, home: 92 }), R = T.render(sc, [sp.start === INF ? 0 : sp.start, 0]); if (R.hits > 64) n++; } ok(n === plan.length, 'day 9422: every level\'s scene lights the tile from its start: ' + n + ' of ' + plan.length); }
console.log(fails ? 'FAILED ' + fails + ' of ' + checks : 'OK · ' + checks + ' checks, none failed · 256 directions, half the rays hit, 33024 refract / 32512 reflect, T = 140 at Z = 247 alone' + cost);
process.exit(fails ? 1 : 0);
