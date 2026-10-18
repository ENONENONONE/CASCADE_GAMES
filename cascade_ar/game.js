// THE FOLD — the play. A day is a plan of levels (FOLD_LEVELS.plan when it is loaded, else the tape read plainly): each level a
// start, a target and a rule from the π tape's opcode. You move by the six operations; the fewest moves is the par; par closes the
// level. Every target's first word joins your line, whose letter sum names a cell. FREE WALK has no target; THE DOORS walks a
// four-figure number's Kaprekar chain to 6174. Progress is kept in the browser for the day; nothing leaves the device.
window.GAME = (function () {
  'use strict';
  const F = window.FIELD, D = window.CASCADE_DATA;
  const RULES = {
    0: { name: 'NOP', tell: 'no rule: the field as it is' },
    1: { name: 'IDENT', tell: 'INV is free: the identity costs nothing', free: 'inv' },
    2: { name: 'EXIST', tell: '×i is free: the quarter turn costs nothing', free: 'i' },
    3: { name: 'SEED', tell: 'the level starts from SEED, cell 0', seed: true },
    4: { name: 'SHIFT', tell: 'the target steps ×g after every move: catch it where it will be', shift: true },
    5: { name: 'STORE', tell: 'one move of slack: par + 1 still closes', slack: 1 },
    6: { name: 'FOLD', tell: 'FOLD is free: the far side costs nothing', free: 'fold' },
    7: { name: 'JUMP', tell: 'Γ is free: the reflection costs nothing', free: 'gam' },
    8: { name: 'SYNC', tell: 'no slack: only par closes, one over and the level is lost', strict: true },
    9: { name: 'HALT', tell: 'the clock runs: thirty seconds', clock: 30 },
  };
  const S = {};
  // the flags: every change of the plan's rules lands behind one, and test.js plays both settings; fold.prefs may carry {flags: {…}}
  const FLAGS = { dilate: true };   // S3: HALT's clock runs on proper time, slower near the eye
  try { Object.assign(FLAGS, (JSON.parse(localStorage.getItem('fold.prefs') || '{}') || {}).flags || {}); } catch (e) {}
  // the local date: the plan is built from the local day, so the run is kept by it too (the UTC date runs a day ahead in the evening)
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const key = () => 'fold.run.' + F.dayNumber(new Date()) + '.' + (S.mode || 'daily');
  function load() { try { return JSON.parse(localStorage.getItem(key()) || 'null'); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(key(), JSON.stringify({ name: S.name, level: (S.done && !S.lost) ? S.level + 1 : S.level, stars: S.stars, line: S.line, closed: S.closed, targets: S.targets, quests: S.quests, borrowed: S.borrowed })); localStorage.setItem('fold.name', S.name); } catch (e) {} }
  const at = o => ((o % (D.pi.length - 4)) + D.pi.length - 4) % (D.pi.length - 4);   // past the tape's end the head wraps, as the plan reads it
  const window4 = o => parseInt(D.pi.slice(at(o), at(o) + 4), 10) % 257;
  // SHIFT: the target is t·3^k after k moves; the shortest road is the least k with a road of k moves from s to t·3^k
  function solveShift(s, t0, ops) {
    ops = ops || S.opsList || F.OPS; if (s === t0) return []; let layer = new Map([[s, null]]); const parents = [layer];
    for (let k = 1; k <= 24; k++) {
      const nxt = new Map(); for (const [u] of layer) for (const o of ops) { const v = o.f(u); if (!nxt.has(v)) nxt.set(v, [u, o.id]); }
      parents.push(nxt); const tk = F.mul(t0, F.POW[k % 256]);
      if (nxt.has(tk)) { const path = []; let c = tk; for (let j = k; j >= 1; j--) { const [u, id] = parents[j].get(c); path.unshift(id); c = u; } return path; }
      layer = nxt;
    }
    return [];
  }
  // d(n), the moves from n to the eye 137 by the level's own moves: a reverse BFS over the 258 points (S1's d, brought forward for S3)
  function toEye(ops) {
    ops = ops || F.OPS; const d = new Array(258).fill(-1), back = Array.from({ length: 258 }, () => []), q = [137]; d[137] = 0;
    for (let u = 0; u < 258; u++) for (const o of ops) back[o.f(u)].push(u);
    for (let i = 0; i < q.length; i++) for (const u of back[q[i]]) if (d[u] < 0) { d[u] = d[q[i]] + 1; q.push(u); }
    return d;
  }
  // HALT's proper time (S3): dτ = dt·rate, rate = f(d)/f(d_start), f(d) = √(1 − 1/(d + 1)) with d floored at 1, so the start runs at 1
  // and the thirty seconds hold there; standing near the eye slows the clock, ∞ (d = 6) runs it fastest. Flag off: τ is the wall clock
  const fEye = d => Math.sqrt(1 - 1 / (Math.max(1, d) + 1));
  const rateAt = n => FLAGS.dilate && S.toEye ? fEye(S.toEye[n]) / fEye(S.toEye[S.start]) : 1;
  // the effort (H2): the solver's distance from where you stand to the target, the level's own way of counting
  const dist = () => S.target == null ? null : S.shift ? solveShift(S.current, S.target).length : S.countFree ? (F.solve(S.current, S.target, null, S.opsList) || []).length : F.cost(F.solve(S.current, S.target, S.free, S.opsList) || [], S.free);
  // a level read plainly from the tape, when no plan is loaded
  function tapeSpec(L) {
    const o = S.head + (L - 1) * 4, digit = +D.pi[at(o)], rule = RULES[digit];
    let s = window4(o), t = window4(o + 4), k = 1; while (t === s) { t = window4(o + 4 + k); k++; }
    if (rule.seed) s = 0;
    return { n: L, kind: 'tape', start: s, target: t, rule: digit, free: rule.free ? [rule.free] : [], slack: rule.slack || 0, strict: !!rule.strict, clock: rule.clock || 0, shift: !!rule.shift, offset: o };
  }
  function start(name, mode, plan) {
    S.name = (name || '').trim().toUpperCase() || 'SCRIBE'; S.home = F.letterSum(S.name) % 257; S.mode = mode || 'daily';
    S.day = F.dayNumber(new Date()); S.head = S.day + 13; S.plan = plan || null;
    S.goldDay = S.day % 128 === 0; S.tabletDay = S.day % 258 === 0; S.dayCell = S.day % 257;   // the day table: cell = day mod 66048, gold every 128th, a tablet cell every 258th
    const kept = S.mode === 'daily' ? load() : null; const mine = kept && kept.name === S.name;
    S.level = mine ? kept.level : 1; S.stars = mine ? kept.stars : []; S.line = mine ? kept.line : []; S.closed = mine ? kept.closed : 0; S.targets = mine ? (kept.targets || []) : []; S.quests = mine ? (kept.quests || []) : []; S.borrowed = mine ? (kept.borrowed || 0) : 0;
    level(S.level); save(); return S;
  }
  function level(L) {
    S.level = L; const spec = S.plan ? S.plan[L - 1] : tapeSpec(L); if (!spec) { S.ended = true; return S; }
    { const first = S.plan && S.mode === 'daily' ? S.plan[Math.floor((L - 1) / 8) * 8] : S.plan ? S.plan[0] : null; S.quest = first && first.quest || null; }   // the chapter's quest stands through the chapter, a resumed one too
    S.spec = spec; S.kind = spec.kind; S.digit = spec.rule == null ? 0 : spec.rule; S.rule = RULES[S.digit]; S.offset = spec.offset != null ? spec.offset : S.head + (L - 1) * 4;
    S.free = new Set(spec.free || []); S.shift = !!spec.shift; S.slack = spec.slack || 0; S.strict = !!spec.strict; S.clock = spec.clock || 0; S.countFree = !!spec.countFree;
    if (S.goldDay && S.mode === 'daily' && !S.shift) S.free.add('i');   // a gold day: the quarter turn, the gold cells' own move, is free
    S.flip = !!spec.flip || (S.mode === 'daily' && Math.floor((L - 1) / 8) === 5);   // THE MIRROR's chapter opens the 6 ↔ 9 flip
    S.opsList = S.flip ? F.OPS.concat([F.FLIP]) : F.OPS;
    S.start = spec.start; S.target0 = spec.target; S.target = spec.target; S.current = S.start; S.road = [S.start]; S.moves = 0; S.ops = []; S.visited = new Set([S.start]);
    S.par = spec.target == null ? null : S.shift ? solveShift(S.start, S.target).length : (spec.par != null && !S.flip && !(S.goldDay && S.mode === 'daily' && !S.shift)) ? spec.par : F.cost(F.solve(S.start, S.target, S.free, S.opsList), S.free);
    S.toEye = toEye(S.opsList); S.dist = dist(); S.climb = []; S.tau = 0; S.real = 0; S.rate = 1;
    S.t0 = performance.now(); S.armed = false; S.done = false; S.lost = false; S.seen = false; S._lostShown = false; S.ended = false;
    return S;
  }
  // the level is in play: the page calls this when the cards are down; HALT's thirty seconds run from here
  function arm() { if (!S.armed) { S.armed = true; S.t0 = S.tLast = performance.now(); S.tau = 0; S.real = 0; } }
  // the clock brought up to now at the rate of the cell stood on since the last call; apply() calls it before the cell changes
  function advance() { if (!S.clock || !S.armed || S.done || S.lost) return; const t = performance.now(); S.real = (t - S.t0) / 1000; S.rate = rateAt(S.current); S.tau = FLAGS.dilate ? S.tau + (t - S.tLast) / 1000 * S.rate : S.real; S.tLast = t; }
  function reach() { const r = new Set(); for (const o of S.opsList || F.OPS) r.add(o.f(S.current)); return r; }
  function apply(id) {
    if (S.done || S.lost) return null; const o = F.OP[id]; if (!o || (id === 'flip' && !S.flip)) return null; const v = o.f(S.current); if (v === S.current && id === 'flip') return null;
    arm(); tick(); if (S.lost) return null; const d0 = S.dist; S.ops.push(id); S.current = v; S.road.push(v); S.visited.add(v); if (!S.free.has(id) || S.countFree) S.moves++;
    if (S.shift) S.target = F.mul(S.target0, F.POW[S.moves % 256]);
    S.dist = dist(); S.climb.push([id, d0, S.dist]); S.rate = rateAt(v);
    if (S.target == null) return v;
    if (v === S.target) {
      if (S.clock) S.borrowed += S.real - S.tau;
      S.done = true; S.stars[S.level - 1] = S.moves <= S.par + S.slack ? 3 : S.moves <= S.par + 1 + S.slack ? 2 : 1;   // STORE's slack: par + 1 still closes
      if (S.strict && S.moves > S.par) { S.stars[S.level - 1] = 0; S.lost = true; } else { S.closed++; S.line.push(D.cells[S.target].w); S.targets.push(S.target); }
      save();
    } else if (S.strict && S.moves > S.par) { S.lost = true; S.stars[S.level - 1] = 0; save(); }
    return v;
  }
  function undo() { if (!S.ops || S.done || S.lost || !S.ops.length) return null; advance(); const id = S.ops.pop(); S.road.pop(); S.current = S.road[S.road.length - 1]; if (!S.free.has(id) || S.countFree) S.moves--; if (S.shift) S.target = F.mul(S.target0, F.POW[S.moves % 256]); S.climb.pop(); S.dist = dist(); S.rate = rateAt(S.current); return id; }
  function reset() { level(S.level); }
  function next() { level(S.level + 1); save(); }
  // the clock: the proper seconds left, and the level lost when τ reaches the thirty
  function tick() { if (S.clock && S.armed && !S.done && !S.lost && S.target != null) { advance(); const left = S.clock - S.tau; if (left <= 0) { S.lost = true; S.stars[S.level - 1] = 0; S.borrowed += S.real - S.tau; save(); } return Math.max(0, left); } return null; }
  function lineInfo() { const txt = S.line.join(' '); const s = F.letterSum(txt), k = F.letterCount(txt); const cell = s % 257; return { txt, sum: s, k, cell, word: D.cells[cell].w, mirror: ((27 * k - s) % 257 + 257) % 257 }; }
  function cellInfo(n) {
    if (n === F.INF) return { n, glyphs: '∞', word: 'the open circuit', words: ['Γ(∞) = 1: the base reads its missing point as I AM'], dlog: '—', inv: 0, fold: '∞', gam: 1, ray: '—', ch: 'the point at infinity', k: 1 };
    const c = D.cells[n]; return { n, glyphs: F.glyphs(n), word: c.w, words: c.ws, dlog: F.dlog(n), inv: F.inv(n), fold: F.fold(n), gam: F.gamma(n), ray: F.ray(n), ch: F.character(n), k: c.k };
  }
  const hint = () => S.target == null ? [] : S.shift ? solveShift(S.current, S.target) : F.solve(S.current, S.target, S.free, S.opsList);
  // the quest of the chapter: a cell to find by its words; done by a tap on it
  function questDone(n) { const q = S.quest; if (!q || S.quests.includes(q.cell)) return false; if (n === q.cell) { S.quests.push(q.cell); save(); return true; } return false; }
  return { S, RULES, FLAGS, toEye, start, level, arm, apply, undo, reset, next, tick, reach, lineInfo, cellInfo, hint, today, solveShift, tapeSpec, questDone };
})();
