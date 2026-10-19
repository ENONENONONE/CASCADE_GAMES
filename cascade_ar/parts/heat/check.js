// THE FOLD — parts/heat/check.js: Sisyphean Heat's arithmetic under node, no three, no canvas. The sheets' counts (scope H1's data row),
// the reduced gradient against the norm's own m·(2a + b, a − 2b), the multiplier's rules, the crowd's state machine run 900 steps at cell 1
// (the crest first, the summit the cliff), the white climber's places, a saved climb replayed against game.js's own road, and the day's
// counters. Run: node check.js
'use strict';
const path = require('path'), root = path.join(__dirname, '..', '..');
global.window = {}; global.performance = require('perf_hooks').performance; const store = new Map(); global.localStorage = { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
require(path.join(root, 'data.js')); require(path.join(root, 'field.js')); require(path.join(root, 'parts', 'levels', 'levels.js')); require(path.join(root, 'game.js')); require(path.join(__dirname, 'heat.js'));
const F = window.FIELD, LV = window.FOLD_LEVELS, G = window.GAME, H = window.FOLD_HEAT, INF = 257, P = 257;
let fails = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fails++; console.log('FAIL', m); } };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-9);
// the sheets' counts: the norm's 33006 wrap edges of 132098, 258 crest cells, 1 zero, 49 gentle; the five invertible forms share the
// distribution; the parabola 17540 wrap edges, 257 crest cells and no gentle point (its gradient (−4, 2b) never vanishes)
{ const s = H.survey('norm', 1); ok(s.wrap === 33006 && s.edges === 132098 && s.crest === 258 && s.zero === 1 && s.gentle === 49, 'norm ' + JSON.stringify(s));
  for (const k of ['circle', 'hyperbola', 'product', 'ellipse']) { const t = H.survey(k, 1); ok(t.crest === 256 && t.zero === 513 && t.gentle === 49, k + ' ' + JSON.stringify(t)); }
  ok(H.survey('circle', 1).wrap === 33044 && H.survey('hyperbola', 1).wrap === 33042 && H.survey('product', 1).wrap === 33024 && H.survey('ellipse', 1).wrap === 33068, 'the wrap edges of the four conics');
  const p = H.survey('parabola', 1); ok(p.wrap === 17540 && p.crest === 257 && p.zero === 257 && p.gentle === 257, 'parabola ' + JSON.stringify(p));
  // m re-forms: the norm at m = 3 (one ×g) keeps 258 crest cells (the solution set of ≡ 256·3⁻¹) and 1 zero, but its cliffs move:
  // 32974 wrap edges, not 33006, since which neighbour pairs straddle the wrap depends on m; m = 0 is flat
  const s3 = H.survey('norm', 3); ok(s3.crest === 258 && s3.zero === 1 && s3.wrap === 32974 && s3.gentle === 49, 'norm at m = 3 ' + JSON.stringify(s3));
  const z = H.terrain('norm', 0); ok(z.every(v => v === 0), 'm = 0: the sheet flat'); }
// the reduced gradient: on the norm at m = 1, away from the cliffs, it is the field's own (2a + b, a − 2b) reduced; the five stars have
// it zero or ±1; a difference across a cliff is read the short way round, never as ±256
{ const h = H.terrain('norm', 1), g = { x: 0, y: 0 }; let agree = 0, total = 0;
  for (let b = 0; b < P; b += 3) for (let a = 0; a < P; a += 3) { H.grad(h, a, b, g); const ex = H.red(2 * a + b), ey = H.red(a - 2 * b); total++; if (Math.abs(g.x - ex) <= 1 && Math.abs(g.y - ey) <= 1) agree++; }
  ok(agree / total > 0.97, 'the reduced gradient agrees with (2a + b, a − 2b) on ' + (100 * agree / total).toFixed(1) + '% of the sampled cells');
  for (const [a, b] of [[0, 0], [103, 51], [154, 206], [206, 103], [51, 154]]) { H.grad(h, a, b, g); ok(Math.abs(g.x) <= 1 && Math.abs(g.y) <= 1, 'the star (' + a + ', ' + b + ') is flat: ' + g.x + ', ' + g.y); }
  ok(H.red(256) === -1 && H.red(-256) === 1 && H.red(128) === 128 && H.red(129) === -128 && H.red(0) === 0, 'red: 256 → −1, 129 → −128');
  let big = false; for (let b = 0; b < P; b += 7) for (let a = 0; a < P; a += 7) { H.grad(h, a, b, g); if (Math.abs(g.x) > 128 || Math.abs(g.y) > 128) big = true; } ok(!big, 'no component past 128'); }
// the multiplier: current/target in the field; the current cell alone with no target in 1 … 256; 0 on SEED; null (freeze) at ∞
{ ok(H.mulOf(6, 3, F) === 2 && H.mulOf(3, 3, F) === 1 && H.mulOf(1, 3, F) === F.inv(3), 'm = current/target');
  ok(H.mulOf(62, null, F) === 62 && H.mulOf(62, INF, F) === 62 && H.mulOf(62, 0, F) === 62, 'no target in 1 … 256: the cell itself');
  ok(H.mulOf(0, 5, F) === 0 && H.mulOf(0, null, F) === 0, 'SEED: 0'); ok(H.mulOf(INF, 5, F) === null, '∞: freeze');
  for (let c = 1; c <= 256; c++) ok(F.mul(H.mulOf(c, 137, F), 137) === c, 'm · target = current at ' + c); }
// the crowd at cell 1 on the norm: 3584 climbers for 900 steps. The crest comes first: far more falls over the wrap than exhaustions, a
// short mean life; the crowd stays on the torus; the stats count every step; a re-form by a move changes the ground under them
{ const sm = H.sim({ n: 3584, form: 'norm', m: 1, seed: 9423 }); const t0 = performance.now(); for (let k = 0; k < 900; k++) sm.step(); const ms = performance.now() - t0;
  const st = sm.stats; ok(st.crests > 20 * st.exhausted, 'crests ' + st.crests + ' against exhaustions ' + st.exhausted); ok(sm.meanLife() > 4 && sm.meanLife() < 40, 'mean life ' + sm.meanLife().toFixed(1) + ' steps');
  let onTorus = true; for (let i = 0; i < sm.n; i++) if (!(sm.x[i] >= 0 && sm.x[i] < P && sm.y[i] >= 0 && sm.y[i] < P)) onTorus = false; ok(onTorus, 'every climber on the torus');
  ok(st.steps > 3584 * 900 * 0.9, 'steps counted ' + st.steps); const per = ms * 1e6 / (3584 * 900); ok(per < 2000, per.toFixed(0) + ' ns a climber-step');
  console.log('  crowd: ' + st.crests + ' crests, ' + st.exhausted
    + ' exhaustions, mean life ' + sm.meanLife().toFixed(1) + ' steps, ' + per.toFixed(0) + ' ns a climber-step');
  const before = sm.h.slice(); ok(sm.setMul(3) === true && sm.h.some((v, i) => v !== before[i]), 'a move re-forms the sheet'); ok(sm.setMul(3) === false, 'the same m again is no change');
  ok(sm.setMul(0) === true && sm.h.every(v => v === 0), 'SEED flattens it'); sm.setMul(null); const sx = sm.x.slice(); sm.step(); ok(sm.x.every((v, i) => v === sx[i]) && sm.frozen, 'frozen at ∞: nobody moves');
  sm.setMul(1); ok(!sm.frozen, 'and Γ(∞) = 1 unfreezes');
  ok(sm.home(10, 10, 1 / 64) === 56, 'a close homes 56 of 3584 climbers (n/64)'); }
// the heat and the parabola: no flat point, so the crowd never rests; the crests still dominate
{ const sm = H.sim({ n: 512, form: 'parabola', m: 1, seed: 1 }); for (let k = 0; k < 300; k++) sm.step(); ok(sm.stats.crests > sm.stats.exhausted, 'parabola: crests ' + sm.stats.crests + ' > exhaustions ' + sm.stats.exhausted); }
// the white climber's place: the azimuth is the cell's (ar.js place: 2π·dlog/256), the radius 3·max(0, par − d)/par, the start at the
// centre, the target on the rim; SEED and ∞ at the centre; further than par stays at the centre
{ const p = H.placeOf(3, 5, 5, F); ok(near(p.az, 1 / 256 * Math.PI * 2) && p.r === 0, 'the start: dlog 1, r 0');
  const q = H.placeOf(3, 0, 5, F); ok(near(q.r, 3) && near(q.x, Math.sin(q.az) * 3) && near(q.z, -Math.cos(q.az) * 3), 'the target: the rim');
  ok(H.placeOf(0, 2, 5, F).r === 0 && H.placeOf(INF, 2, 5, F).r === 0 && H.placeOf(7, 9, 5, F).r === 0 && H.placeOf(7, null, 5, F).r === 0, 'SEED, ∞, beyond par: the centre');
  ok(near(H.placeOf(9, 2, 5, F).r, 1.8), 'd 2 of par 5: 1.8 m'); }
// a saved climb replayed: game.js plays today's level 1 to its close, records it, and the replay from the record's start and ops lands on
// the same cells with the same distances; the counters read the day
{ const plan = LV.plan(F.dayNumber(new Date()), 'SCRIBE'); G.start('SCRIBE', 'daily', plan); const S = G.S;
  const road = F.solve(S.start, S.target, S.free, S.opsList) || []; for (const id of road) G.apply(id);
  ok(S.done && !S.lost && S.climbs && S.climbs.length === 1, 'level 1 closed and recorded'); const rec = S.climbs[0];
  ok(rec.L === 1 && rec.s === plan[0].start && rec.t === S.target && rec.par === S.par && rec.ops.length === road.length && rec.d.length === road.length + 1 && rec.d[0] === S.par && rec.d[rec.d.length - 1] === 0, 'the record ' + JSON.stringify(rec));
  const rp = H.replay(rec, F); ok(rp.cells.join() === S.road.join(), 'the replay walks the road: ' + rp.cells.join(' '));
  ok(typeof rec.free === 'string' && (S.countFree ? rec.free === '' : [...S.free].every(id => rec.free.length === S.free.size)), 'the record names the free moves: "' + rec.free + '"');
  ok(rp.places[0].r === 0 && near(rp.places[rp.places.length - 1].r, 3), 'from the centre to the rim');
  const c = H.counters(S.climbs); ok(c.climbs === 1 && c.steps === S.moves && c.summits === 1 && c.falls === 0, 'counters ' + JSON.stringify(c));
  // the save keeps the climbs; a reload restores them
  G.start('SCRIBE', 'daily', plan); ok(G.S.climbs.length === 1 && G.S.climbs[0].ops === rec.ops, 'the climbs survive a reload');
  // an undo is a fall; a loss records 'lost'
  G.next(); const S2 = G.S; G.apply('g'); G.undo(); ok(S2.undos === 1, 'UNDO counted');
  ok(H.counters([{ out: 'lost', moves: 3, par: 2, undos: 1 }, { out: 3, moves: 2, par: 2, undos: 0 }, { out: 2, moves: 4, par: 3, undos: 2 }]).falls === 4, 'falls = losses + undos');
  ok(H.counters([{ out: 'reborn', moves: 2, par: 2, undos: 0 }]).summits === 1, 'a reborn close at its par is a summit'); }
// the day's text names the counters and the crown
{ const t = H.dayText({ climbs: [{ out: 3, moves: 2, par: 2, undos: 0, t: 5 }, { out: 'lost', moves: 3, par: 2, undos: 0, t: 7 }] }); ok(/2 climbs, 5 steps, 1 summits, 1 falls; the crown of 1 closed cells/.test(t), t); }
console.log(checks + ' checks, ' + fails + ' failed' + (fails ? '' : ' — the heat holds'));
process.exit(fails ? 1 : 0);
