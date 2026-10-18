// THE FOLD — parts/rays/check.js: the chart's arithmetic under node, no canvas. The layout's spacings at the inset, the TUBE and the lens
// (scope T1), the rings and spokes, what each move draws, the preimages the nodes flow from, the focus ring's walk, and the ledger (T4):
// day 9422's figures by the spec roads, and game.js's own count on today's plan, which UNDO cannot inflate. Run: node check.js
'use strict';
const path = require('path'), root = path.join(__dirname, '..', '..');
global.window = {}; const store = new Map(); global.localStorage = { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
require(path.join(root, 'data.js')); require(path.join(root, 'field.js')); require(path.join(root, 'parts', 'levels', 'levels.js')); require(path.join(root, 'game.js')); require(path.join(__dirname, 'rays.js'));
const F = window.FIELD, LV = window.FOLD_LEVELS, G = window.GAME, RY = window.FOLD_RAYS, INF = 257;
let fails = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fails++; console.log('FAIL', m); } };
const near = (a, b, e) => Math.abs(a - b) <= (e || 0.05);
const cells = []; for (let n = 1; n <= 256; n++) cells.push(n);
const ringOf = n => Math.floor(F.DLOG[n] / 12);
// the spacings: the inset at 132 px is for marks (DR 2.31), the TUBE at 360 px has R0 15.1 and DR 6.3, the lens 4 × 6.3 = 25.2 ≥ 24 (WCAG 2.5.8)
{ const a = RY.layout(132), b = RY.layout(360); ok(near(a.DR, 2.31, 0.01), 'inset DR ' + a.DR); ok(near(b.R0, 15.1, 0.06) && near(b.DR, 6.3, 0.01), 'TUBE R0 ' + b.R0 + ' DR ' + b.DR); ok(4 * b.DR >= 24, 'the lens ' + 4 * b.DR + ' px');
  ok(a.rim <= 66 && 10 + 132 <= 0.4 * 390 - 10 + 6, 'the inset fits its 132 px and ends left of a 390 px phone\'s quest box (142 < 146)');
  ok(b.x[0] === b.cx && b.y[0] === b.cy, 'SEED at the centre'); ok(near(b.r[INF], b.R0 + 22 * b.DR, 1e-4) && near(b.y[INF], b.cy - b.rim, 1e-3), '∞ on the rim, ring 22');
  for (const n of cells) { const r = Math.hypot(b.x[n] - b.cx, b.y[n] - b.cy), ang = Math.atan2(b.y[n] - b.cy, b.x[n] - b.cx); ok(near(r, b.R0 + ringOf(n) * b.DR, 1e-3), 'radius of ' + n); const k = (ang + Math.PI / 2) / (Math.PI / 6); ok(near(k, Math.round(k), 1e-3) && (Math.round(k) % 12 + 12) % 12 === F.ray(n), 'spoke of ' + n); } }
// the rings: 21 of 12 and a short 22nd of 4 (165 238 200 86 on rays 0–3); the core ring 1 3 9 27 81 243 215 131 136 151 196 74
{ const by = new Map(); for (const n of cells.slice().sort((a, b) => F.DLOG[a] - F.DLOG[b])) { const k = ringOf(n); if (!by.has(k)) by.set(k, []); by.get(k).push(n); }
  ok(by.size === 22 && [...by].every(([k, v]) => v.length === (k < 21 ? 12 : 4)), '21 rings of 12 and one of 4');
  ok(by.get(0).join(' ') === '1 3 9 27 81 243 215 131 136 151 196 74', 'the core ring ' + by.get(0).join(' ')); ok(by.get(21).join(' ') === '165 238 200 86' && by.get(21).every((n, i) => F.ray(n) === i), 'the short ring ' + by.get(21).join(' ')); }
// what each move draws (scope T1's table)
{ const count = (id, f) => cells.filter(n => f(RY.kind(id, n))).length;
  ok(count('g', k => k.k === 'spoke' && k.dRay === 1) === 234 && count('g', k => k.k === 'ring' && k.dRing === 1) === 21 && count('g', k => k.k === 'seam') === 1 && RY.kind('g', 86).k === 'seam' && RY.kind('g', 86).v === 1, '×g: 234 one spoke on, 21 a ring out, the seam 86 → 1');
  ok(RY.kind('ig', 1).k === 'seam' && RY.kind('ig', 1).v === 86, '÷g: the seam 1 → 86');
  ok(cells.filter(n => F.DLOG[n] < 128).every(n => { const k = RY.kind('fold', n); return k.k === 'out' && k.dRay === 8 && (k.dRing === 10 || k.dRing === 11); }) && cells.filter(n => F.DLOG[n] >= 128).every(n => { const k = RY.kind('fold', n); return k.k === 'in' && k.dRay === 4 && (k.dRing === -10 || k.dRing === -11); }), 'FOLD: ray +8 and 10–11 out on the front half, ray +4 and 10–11 in on the back');
  ok(cells.every(n => n === 1 ? RY.kind('inv', n).k === 'still' : F.ray(F.inv(n)) === (4 - F.ray(n) + 12) % 12), 'INV: ray r → 4 − r, 1 stays');
  { const s20 = cells.filter(n => n !== 1 && ringOf(n) + ringOf(F.inv(n)) === 20).length, s21 = cells.filter(n => n !== 1 && ringOf(n) + ringOf(F.inv(n)) === 21).length; ok(s20 === 147 && s21 === 108, 'INV: depths sum to 20 (' + s20 + ') or 21 (' + s21 + ')'); }
  ok(RY.kind('inv', 0).k === 'rim' && RY.kind('inv', INF).k === 'seed', 'INV: SEED ↔ ∞, centre ↔ rim');
  ok(cells.filter(n => F.DLOG[n] < 64).every(n => { const k = RY.kind('i', n); return k.k === 'out' && k.dRay === 0 && k.dRing === 16; }) && cells.filter(n => F.DLOG[n] >= 64).every(n => { const k = RY.kind('i', n); return k.k === 'in' && k.dRay === 8 && (k.dRing === -5 || k.dRing === -6); }), '×i: dlog < 64 the same spoke 16 rings out, else ray +8 and 5–6 in');
  { const gc = cells.filter(n => F.gamma(n) !== INF && F.gamma(n) !== 0), keep = gc.filter(n => ['keep', 'still'].includes(RY.kind('gam', n).k)).length; ok(gc.length === 254 && keep === 22, 'Γ: ' + keep + ' of ' + gc.length + ' keep their ray (the mirrors 46 and 92 among them)'); }
  ok(RY.kind('gam', 137).k === 'rim' && RY.kind('gam', INF).k === 'enter', 'Γ: 137 crosses the rim, ∞ comes back in'); }
// the flow: every node arrives from its preimage, so pre(id, op(n)) = n for all 258 points and every move
for (const o of F.OPS.concat([F.FLIP])) { let good = true; for (let n = 0; n < 258; n++) if (RY.pre(o.id, o.f(n)) !== n) good = false; ok(good, 'the preimage of ' + o.id); }
// the focus ring: twelve steps round a full ring come home, four round the short one; ↑ from the outer rings is ∞, ↓ from the core is SEED
{ let good = true; for (const n of cells) { let m = n; const k = ringOf(n); for (let i = 0; i < (k < 21 ? 12 : 4); i++) { m = RY.step(m, 1, 0); if (ringOf(m) !== k) good = false; } if (m !== n) good = false; } ok(good, '←/→ walk a ring');
  ok(RY.step(1, 0, -1) === 0 && RY.step(0, 0, 1) === 1 && RY.step(165, 0, 1) === INF && RY.step(INF, 0, -1) === 165 && RY.step(F.POW[251], 0, 1) === INF && RY.step(3, 0, 1) === F.POW[13], '↑/↓ one ring, SEED and ∞ at the ends');
  ok(RY.step(17, 1, 0, 'table') === 18 && RY.step(17, 0, 1, 'table') === 33 && RY.step(240, 0, 1, 'table') === 256 && RY.step(255, 0, 1, 'table') === INF, 'the TABLE walks columns and rows, 256 and ∞ below it'); }
// the TABLE: p = c + 16r, ×i a rigid quarter turn for 225 cells (16p at row c − 1, column 16 − r), FOLD a half turn for 224
{ const T = RY.layout(360, 'table'), cs = T.cs, at = n => [Math.round((T.x[n] - T.x0) / cs - 0.5), Math.round((T.y[n] - T.y0) / cs - 0.5)];
  ok(cells.every(n => n === 256 ? at(n)[1] === 16 : at(n)[0] === n % 16 && at(n)[1] === n >> 4) && at(INF)[1] === 16, 'the TABLE: column p mod 16, row p div 16, 256 and ∞ off the grid');
  const quarter = cells.filter(p => p < 256 && p % 16 && (p >> 4)).filter(p => { const [c, r] = at(p), [c2, r2] = at(F.mul(p, 16)); return r2 === c - 1 && c2 === 16 - r; }).length; ok(quarter === 225, '×i turns ' + quarter + ' of the table a quarter');
  const half = cells.filter(p => p < 256).filter(p => { const [c, r] = at(p), [c2, r2] = at(F.fold(p)); return c2 === 17 - c && r2 === 15 - r; }).length; ok(half === 224, 'FOLD turns ' + half + ' of the table a half');
  // the flow runs polar about (9, 8) in cells, so those 225 keep their radius and all turn the same angle: the picture turns rigidly
  const turn = id => cells.filter(p => p < 256).filter(p => { const v = F.OP[id].f(p), [c, r] = at(p), [c2, r2] = at(v); return id === 'i' ? r && c && r2 === c - 1 && c2 === 16 - r : c2 === 17 - c && r2 === 15 - r; }).map(p => { const v = F.OP[id].f(p); let da = T.a[v] - T.a[p]; da -= 2 * Math.PI * Math.round(da / (2 * Math.PI)); return [Math.abs(T.r[v] - T.r[p]), Math.abs(da)]; });
  for (const id of ['i', 'fold']) { const tr = turn(id); ok(tr.every(([dr, da]) => dr < 1e-3 && Math.abs(da - tr[0][1]) < 1e-3) && near(tr[0][1], id === 'i' ? Math.PI / 2 : Math.PI, 1e-3), id + ' flows as a rigid turn on the table'); } }
// the ledger: day 9422, SCRIBE, by the spec roads: 339 arrivals, one at ∞; by ray 31 34 23 24 25 24 16 32 36 20 30 43; best bits
// 4 7 5 5 3 6 3 4 4 9 5 8; the sparkline ▆▇▅▅▅▅▃▆▇▄▆█; rays touched a chapter 12 11 12 11 11 12 12 12
{ const plan = LV.plan(9422, 'SCRIBE'), roads = plan.map(sp => ({ start: sp.start, ops: sp.road, salt: [9422, sp.offset] })), t = RY.tally(roads);
  ok(t.n === 339 && t.inf === 1, 'arrivals ' + t.n + ', at ∞ ' + t.inf); ok(t.rays.join(' ') === '31 34 23 24 25 24 16 32 36 20 30 43', 'by ray ' + t.rays.join(' ')); ok(t.bits.join(' ') === '4 7 5 5 3 6 3 4 4 9 5 8', 'best bits ' + t.bits.join(' ')); ok(RY.spark(t.rays) === '▆▇▅▅▅▅▃▆▇▄▆█', 'sparkline ' + RY.spark(t.rays));
  const touched = []; for (let c = 0; c < 8; c++) { const s = RY.tally(roads.slice(c * 8, c * 8 + 8)); touched.push(s.rays.filter(v => v > 0).length); } ok(touched.join(' ') === '12 11 12 11 11 12 12 12', 'rays touched a chapter ' + touched.join(' '));
  ok(RY.spark([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).length === 12, 'an empty day still sparks 12 characters'); }
// game.js's own count: today's plan played through G.apply on its roads, a detour taken back by UNDO on every level, then the ledger
// by roadsOf(1, 64) equals the count made at each close, and a reload keeps it
{ const day = F.dayNumber(new Date()), plan = LV.plan(day, 'SCRIBE'); store.clear(); G.start('SCRIBE', 'daily', plan); const S = G.S; let closed = 0;
  let played = 0;
  for (let L = 1; L <= 64; L++) { if (L > 1) G.next(); const sp = S.spec; if (sp.countFree && S.goldDay) continue; const road = sp.shift ? G.solveShift(S.current, S.target) : sp.road; if (!sp.strict && !S.clock) { G.apply('g'); G.undo(); } for (const id of road) G.apply(id); if (S.done && !S.lost) { closed++; played += road.length; } }
  const back = RY.tally(G.roadsOf(1, 64)); ok(closed > 56 && S.closed === closed, 'game.js closes ' + closed + ' of 64');
  ok(back.rays.join() === S.rays.join() && back.bits.join() === S.bits.join(), 'S.rays and S.bits are the closed roads\' own: ' + S.rays.join(' ') + ' / ' + S.bits.join(' '));
  ok(back.n === played && S.rays.reduce((a, b) => a + b, 0) <= played, 'an UNDO adds no arrival: ' + back.n + ' of ' + played);
  const kept = { rays: S.rays.join(), bits: S.bits.join(), roads: JSON.stringify(S.roads) }; G.start('SCRIBE', 'daily', plan); ok(G.S.rays.join() === kept.rays && G.S.bits.join() === kept.bits && JSON.stringify(G.S.roads) === kept.roads, 'a reload keeps the ledger'); }
console.log(fails ? 'FAILED ' + fails + ' of ' + checks : 'OK · ' + checks + ' checks, none failed · the layout, the moves\' pictures, the flow, the focus walk and the ledger');
process.exit(fails ? 1 : 0);
