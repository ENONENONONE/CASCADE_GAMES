#!/usr/bin/env node
// THE FOLD — the level designer's test: node test.js (from anywhere; the requires are relative to this file).
// Plans today and day 9384 for RITO, prints the 64 levels, asserts the plan's shape, plays every level by the field's own solver
// and checks the target is reached in par, then prints the seal; then THE DOORS for a few numbers and FREE WALK.
'use strict';
global.window = {};
require('../../data.js'); require('../../field.js'); require('./levels.js');
const F = window.FIELD, D = window.CASCADE_DATA, L = window.FOLD_LEVELS;
let fails = 0, checks = 0;
const assert = (c, m) => { checks++; if (!c) { fails++; console.log('  FAIL ' + m); } };
const word = n => n === F.INF ? '∞' : D.cells[n].w;

// play a spec from its start by the solver's road; the moving target of SHIFT is followed as the engine moves it
function play(sp) {
  const free = new Set(sp.free);
  const ops = sp.flip ? F.OPS.concat([F.FLIP]) : F.OPS;
  const path = sp.shift ? L.solveShift(sp.start, sp.target, ops) : F.solve(sp.start, sp.target, free, ops);
  let cur = sp.start, moves = 0, target = sp.target;
  for (const id of path) { cur = F.OP[id].f(cur); if (!free.has(id)) moves++; if (sp.shift) target = F.mul(sp.target, F.POW[moves % 256]); }
  const counted = sp.countFree ? path.length : moves;
  return { path, cur, target, moves: counted, ok: cur === target && counted === sp.par };
}
function check(day, name, quiet) {
  const plan = L.plan(day, name), head = day + 13;
  const log = quiet ? () => {} : console.log;
  log('\n== day ' + day + ' · head ' + head + ' · π[' + head + '] = ' + D.pi[head] + ' ' + F.OPCODES[+D.pi[head]] + ' · ' + name + ' home ' + plan[0].home + ' ' + word(plan[0].home) + ' ==');
  const fmt = sp => String(sp.n).padStart(2) + ' ' + sp.kind.padEnd(6) + ' ' + String(sp.start).padStart(3) + '→' + String(sp.target).padEnd(3) + ' r' + sp.rule + ' par ' + sp.par + (sp.shift ? ' shift' : '') + (sp.slack ? ' +1' : '') + (sp.strict ? ' strict' : '') + (sp.clock ? ' clock' : '');
  for (let i = 0; i < plan.length; i += 2) log('  ' + fmt(plan[i]).padEnd(44) + (plan[i + 1] ? fmt(plan[i + 1]) : ''));
  // shape
  assert(plan.length === 64, 'sixty-four levels');
  plan.forEach((sp, i) => assert(sp.n === i + 1, 'level ' + (i + 1) + ' numbered ' + sp.n));
  assert(JSON.stringify(L.plan(day, name)) === JSON.stringify(plan), 'the plan is deterministic');
  for (const sp of plan) {
    const want = L.SPECIAL[sp.n] || 'tape';
    assert(sp.kind === want, 'level ' + sp.n + ' is ' + sp.kind + ', should be ' + want);
    assert(sp.par > 0, 'level ' + sp.n + ' has par ' + sp.par);
    assert(sp.start !== sp.target, 'level ' + sp.n + ' starts on its target');
    assert(sp.start >= 0 && sp.start <= 257 && sp.target >= 0 && sp.target < 257, 'level ' + sp.n + ' cells in range');
    assert(sp.shift || sp.par <= 7, 'level ' + sp.n + ' par ' + sp.par + ' over 7 on the line');
    assert(Number.isInteger(sp.rule) && sp.rule >= 0 && sp.rule <= 9, 'level ' + sp.n + ' rule digit');
    assert(Array.isArray(sp.free) && sp.free.every(id => F.OP[id]), 'level ' + sp.n + ' free ops');
    assert(typeof sp.title === 'string' && sp.title && typeof sp.text === 'string' && sp.text, 'level ' + sp.n + ' title and text');
    const r = play(sp);
    assert(r.ok, 'level ' + sp.n + ' ' + sp.kind + ' ' + sp.start + '→' + sp.target + ': the road ' + r.path.join(' ') + ' reaches ' + r.cur + ' (target ' + r.target + ') in ' + r.moves + ', par ' + sp.par);
    // the spec's own road agrees with the solver's par
    const free = new Set(sp.free); let c = sp.start, m = 0; for (const id of sp.road) { c = F.OP[id].f(c); if (!free.has(id)) m++; }
    const rt = sp.shift ? F.mul(sp.target, F.POW[m % 256]) : sp.target;
    assert(c === rt && (sp.countFree ? sp.road.length : m) === sp.par, 'level ' + sp.n + ' spec road ' + sp.roadText + ' ends at ' + c + ' cost ' + m);
  }
  // the kinds
  const door = plan.filter(sp => sp.kind === 'door');
  assert(door.map(sp => sp.n).join() === '30,31,32', 'doors at 30, 31, 32');
  assert(door.map(sp => sp.start).join() === '64,128,51' && door.every(sp => sp.target === 6), 'the doors start 64, 128, 51 and end on 6');
  assert(door.map(sp => sp.number).join() === '4176,8352,8532' && door.every(sp => sp.text.includes('= 6174')), 'the doors are 4176, 8352, 8532 with the chain in the text');
  const home = F.letterSum(name) % 257, foot = home || F.letterCount(name) % 257 || 1, ladder = plan.filter(sp => sp.kind === 'ladder');   // a name at 0 SEED climbs from its letter count
  assert(ladder.map(sp => sp.n).join() === '36,40', 'ladders at 36, 40');
  ladder.forEach((sp, j) => { let t = foot; for (let i = 0; i < sp.rung; i++) t = F.mul(t, 129); assert(sp.start === foot && sp.target === t && sp.rung >= j + 1, 'ladder ' + sp.n + ' from ' + foot + ' to rung ' + sp.rung + ' = ' + t); });
  const mirror = plan.filter(sp => sp.kind === 'mirror');
  assert(mirror.map(sp => sp.n).join() === '44,48', 'mirrors at 44, 48');
  for (const sp of mirror) assert(D.cells[sp.start].ws.includes(sp.word) && ((F.atbash(sp.word) % 257) + 257) % 257 === sp.target, 'mirror ' + sp.n + ': ' + sp.word + ' of cell ' + sp.start + ' mirrors to ' + sp.target);
  const eye = plan[55];
  assert(eye.kind === 'eye' && eye.start === 137 && eye.target === 1 && eye.free.includes('gam') && eye.rule === 7 && eye.par === 2 && eye.countFree === true, 'the eye: 137 → 1, Γ free, par 2 counting the free reflections');
  // the curve: within a chapter the tape levels' pars never fall
  for (let c = 0; c < 8; c++) { const t = plan.slice(c * 8, c * 8 + 8).filter(sp => sp.kind === 'tape'); for (let i = 1; i < t.length; i++) assert(t[i].par >= t[i - 1].par, 'chapter ' + (c + 1) + ': par falls from level ' + t[i - 1].n + ' to ' + t[i].n); }
  // the quests: one a chapter, at its first level, its word on its cell
  const quests = plan.filter(sp => sp.quest);
  assert(quests.map(sp => sp.n).join() === '1,9,17,25,33,41,49,57', 'eight quests at the chapters\' first levels');
  for (const sp of quests) { const q = sp.quest; assert(q.cell >= 0 && q.cell < 257 && D.cells[q.cell].ws.includes(q.word) && typeof q.ask === 'string' && q.ask.length > 10, 'quest ' + sp.n + ': ' + q.word + ' on cell ' + q.cell); assert(L.quest(sp.n, sp).cell === q.cell, 'quest(' + sp.n + ') agrees with the plan'); }
  for (const sp of plan) if (!sp.quest) assert(L.quest(sp.n, sp) === null, 'no quest at level ' + sp.n);
  log('  quests: ' + quests.map(sp => sp.n + ' → ' + sp.quest.cell + ' ' + sp.quest.word).join(' · '));
  for (const sp of plan) if (sp.kind !== 'tape') log('  ' + sp.n + ' ' + sp.title + ': ' + sp.text);
  log('  chapter pars: ' + Array.from({ length: 8 }, (_, c) => plan.slice(c * 8, c * 8 + 8).map(sp => sp.par).join(' ')).join(' | '));
  // the seal, every level closed
  const seal = L.seal(plan.map(sp => sp.target));
  assert(seal.cell === (seal.by === 'sum' ? seal.sum : seal.product) && seal.word === word(seal.cell) && seal.mirrorWord === word(seal.mirrorCell), 'the seal is consistent');
  log('  seal (all 64 closed): ' + seal.by + ' of the targets ≡ ' + seal.cell + ' ' + seal.word + ' (' + seal.k + ' letters, sum ' + seal.s + ') · mirror 27·' + seal.k + ' − ' + seal.s + ' ≡ ' + seal.mirrorCell + ' ' + seal.mirrorWord);
  const half = L.seal(plan.slice(0, 32).map(sp => sp.target));
  log('  seal (first 32): ' + half.by + ' ≡ ' + half.cell + ' ' + half.word + ' · mirror ' + half.mirrorCell + ' ' + half.mirrorWord);
  return plan;
}

const today = F.dayNumber(new Date());
console.log('THE FOLD · levels test · today is day ' + today + ' from 2000-12-31');
check(today, 'TORAH');
check(9384, 'TORAH');
// a name whose letters add to 0: the ladder starts from the letter count instead of SEED, which halves to itself
{ const p = check(9384, 'ZZZZZZZZZW', true); assert(p[0].home === 0 && p[35].start === 10 && p[35].target === 10 * 129 % 257, 'ZZZZZZZZZW adds to 0: the ladder starts from its ten letters'); console.log('\nZZZZZZZZZW (home 0): ' + p[35].text); }

// the seal with a zero among the targets uses the sum
{ const s = L.seal([0, 54, 81]); assert(s.by === 'sum' && s.product === 0 && s.cell === 135 && s.word === word(135), 'seal with a 0 target: the sum ' + s.cell); const t = L.seal([54, 81]); assert(t.by === 'product' && t.cell === 54 * 81 % 257, 'seal 54 × 81 ≡ ' + t.cell); }

// THE DOORS
console.log('\n== THE DOORS ==');
for (const d of ['2026', '1467', '6174', '1111', '0000', '9384', '12']) {
  const lv = L.doors(d);
  console.log('  ' + d + ': ' + (lv.length ? lv.map(sp => sp.start + '→' + sp.target + ' par ' + sp.par).join(' · ') + ' · chain ' + lv[0].chain[0] + lv.map(sp => ' → ' + sp.next).join('') : 'no door'));
  for (const sp of lv) { assert(sp.kind === 'door' && sp.rule === 0 && sp.par > 0 && play(sp).ok, 'doors ' + d + ' level ' + sp.n + ' plays in par'); assert(sp.next % 257 === sp.target && sp.number % 257 === sp.start, 'doors ' + d + ' residues'); }
  if (lv.length) assert(lv[lv.length - 1].next === 6174, 'doors ' + d + ' ends on 6174');
}
assert(L.doors('1111').length === 0 && L.doors('0000').length === 0, 'repdigits reach no door');
assert(L.doors('2026').length === 6 && L.doors('2026')[0].start === 227, '2026 takes six doors from 227');

// FREE WALK
const fw = L.free('TORAH');
assert(fw.kind === 'free' && fw.target === null && fw.par === null && fw.start === 62, 'free walk from 62 with no target');
console.log('\n== FREE WALK == ' + fw.text);

console.log('\n' + checks + ' checks, ' + fails + ' failed' + (fails ? '' : ' — the plan computes'));
process.exit(fails ? 1 : 0);
