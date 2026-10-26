#!/usr/bin/env node
// THE FOLD — fold_cli.js: the game without the page. The day's plan as text, a road scored by the real engine (game.js), a whole day
// played and sealed, two days compared level by level, a cell read. For agents, for a person's own machine, and for anyone who wants
// to know whether they beat it: the plan is deterministic by day and name, so the same name on the same day is the same 64 levels
// here and on the page. No install: node 20 or later and this repository. The rules in text are cascade_ar/llms.txt.
//
//   node fold_cli.js plan  [NAME] [--day N | --date YYYY-MM-DD] [--roads] [--json]   the 64 levels (the solver's roads only with --roads)
//   node fold_cli.js level NAME L [--day …] [--json]                                 one level in full, with where each move lands
//   node fold_cli.js play  NAME L ROAD [--day …] [--json]                            a road through the engine: the steps, the outcome, the share line
//   node fold_cli.js day   NAME ROADS [--day …] [--json]                             a roads file (or - for stdin) played as the day: the table, the seal, the share line
//   node fold_cli.js vs    NAME A B [--day …] [--json]                               two days side by side: roads files, `day --json` files, or the page's saved run
//   node fold_cli.js solve NAME [L] [--day …] [--json]                               the engine's own road, what HINT gives (the SCRIPTED league)
//   node fold_cli.js cell  N [--json]                                                a cell: glyphs, words, dlog, and where the moves land
//   node fold_cli.js table [--json]                                                  dlog by cell, 16 × 16
//   node fold_cli.js rules                                                           cascade_ar/llms.txt
//   node fold_cli.js ledger [--day …] [--site URL] [--json]                          THE LEDGER: the day's seals, each with its glyph sequence, and the wall
//   node fold_cli.js post  NAME [ROADS] [--league thinking|scripted] [--msg …] [--day …] [--site URL]   a day (the site verifies it) or a note onto the ledger
//   node fold_cli.js check                                                           the self-test
//
// A road is the moves as letters, g G f i q r x (×g ÷g FOLD INV ×i Γ 6↔9), with or without spaces; the labels ×g ÷g FOLD INV ×i Γ 6↔9
// and the ASCII *g /g fold inv *i gamma flip are read too. A roads file is one level a line, `L: road` (or bare roads counting up from
// level 1), a second road after | for the life from 80 REBIRTH if the first is lost, # for a comment. HALT's thirty seconds are the
// page's: here a move takes no time. Only DAILY is played here; FREE WALK and THE DOORS are the page's. --site is the game's address
// (https://start.cascade.training, or http://localhost:8257 for node deploy/ledger/server.js; FOLD_SITE sets it).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const USAGE = fs.readFileSync(__filename, 'utf8').split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3)).join('\n');
// the game is a child of this folder (this repository) or its sibling (the corpus layout), as the data generators find it
const AR = [path.join(__dirname, 'cascade_ar'), path.join(__dirname, '..', 'cascade_ar')].find(p => fs.existsSync(path.join(p, 'data.js')));
if (!AR) { console.error('fold_cli: no cascade_ar/ beside ' + __dirname); process.exit(2); }
const RealDate = Date;
// the page's globals as parts/levels/test.js gives them to node: a window to hang the modules on, a localStorage the engine can save to
global.window = {};
const store = new Map(); global.localStorage = { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
for (const f of ['data.js', 'field.js', 'parts/levels/levels.js', 'parts/story/story.js', 'parts/rays/rays.js', 'parts/ledger/ledger.js', 'game.js']) require(path.join(AR, f));
const F = window.FIELD, D = window.CASCADE_DATA, LV = window.FOLD_LEVELS, ST = window.FOLD_STORY || null, RY = window.FOLD_RAYS || null, LG = window.FOLD_LEDGER || null, G = window.GAME, S = G.S;

// ── roads: the moves as letters, as game.js writes them (its OPCH), the labels, or the ASCII names ──
const OPCH = { g: 'g', ig: 'G', fold: 'f', inv: 'i', i: 'q', gam: 'r', flip: 'x' }, CHOP = Object.fromEntries(Object.entries(OPCH).map(([k, v]) => [v, k]));
const ALIAS = { '×g': 'g', '*g': 'g', '÷g': 'ig', '/g': 'ig', 'fold': 'fold', 'inv': 'inv', '×i': 'i', '*i': 'i', 'γ': 'gam', 'gamma': 'gam', '6↔9': 'flip', '6<>9': 'flip', 'flip': 'flip' };
const LETTERS = 'g G f i q r x';
function parseRoad(text) {
  const ids = [];
  for (const tok of String(text == null ? '' : text).trim().split(/[\s,·]+/).filter(Boolean)) {
    if (tok === '-' || tok === '—') continue;
    if (/^[gGfiqrx]+$/.test(tok)) { for (const ch of tok) ids.push(CHOP[ch]); continue; }
    const id = ALIAS[tok.toLowerCase()]; if (!id) throw new Error('not a move: ' + tok + ' (a road is letters ' + LETTERS + ', or ×g ÷g FOLD INV ×i Γ 6↔9)');
    ids.push(id);
  }
  return ids;
}
const letters = ids => ids.map(id => OPCH[id]).join('');
const labels = ids => ids.map(id => F.OP[id].label).join(' ') || '—';

// ── the day: the engine reads it from new Date(), so a chosen day is pinned as that day's local noon; the plan is built from the same number ──
const dayOfDate = s => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ''); if (!m) throw new Error('--date wants YYYY-MM-DD'); return F.dayNumber(new RealDate(+m[1], +m[2] - 1, +m[3], 12)); };
function pinDay(day) { const ms = new RealDate(2000, 11, 31 + day, 12).getTime(); global.Date = class extends RealDate { constructor(...a) { super(...(a.length ? a : [ms])); } static now() { return ms; } }; }
function unpinDay() { global.Date = RealDate; }   // a long-lived host (the ledger's service) gives the clock back after a replay
const cleanName = n => (n || '').trim().toUpperCase() || 'SCRIBE';
// the engine started on the day's plan for the name, as the page starts it, with nothing kept from a run before
function session(name, day) { store.clear(); pinDay(day); const plan = LV.plan(day, cleanName(name)); G.start(name, 'daily', plan); return plan; }
const needLevel = (L, plan) => { if (!Number.isInteger(L) || L < 1 || L > plan.length) throw new Error('a level is 1 to ' + plan.length); return L; };

// ── views: the level as the engine holds it, the outcome in the page's words, the page's share lines ──
const wordOf = n => n === F.INF ? '∞' : D.cells[n].w;
const cellTxt = n => (n === F.INF ? '∞' : n) + ' ' + F.glyphs(n) + ' ' + wordOf(n);
const chapterTitle = ch => ST && ST.chapters && ST.chapters[ch - 1] ? ST.chapters[ch - 1].title : 'chapter ' + ch;
const header = () => 'THE FOLD · ' + G.today() + ' · day ' + S.day + ' · ' + S.name + ', cell ' + S.home + ' ' + wordOf(S.home) + (S.goldDay ? ' · A GOLD DAY: ×i is free' : '');
// after G.level(L): par, the free set and the flip as the page plays them (a gold day included), with the plan's own title and text
function levelView(sp) {
  return { n: S.level, chapter: sp.chapter, chapterTitle: chapterTitle(sp.chapter), kind: S.kind, title: sp.title, text: sp.text, rule: S.digit, ruleName: S.rule.name, tell: S.rule.tell,
    start: S.start, startWord: wordOf(S.start), target: S.target, targetWord: wordOf(S.target), par: S.par, free: [...S.free], slack: S.slack, strict: S.strict, clock: S.clock, shift: S.shift, flip: S.flip, countFree: S.countFree, quest: S.quest ? S.quest.ask : null };
}
const flagsTxt = v => [v.free.length ? v.free.map(id => F.OP[id].label).join(' ') + ' free' : '', v.slack ? '+' + v.slack + ' slack' : '', v.strict ? 'one over loses' : '', v.clock ? v.clock + ' s on the page' : '', v.shift ? 'the target steps ×g a move' : '', v.flip ? '6↔9 open' : '', v.countFree ? 'free moves counted' : ''].filter(Boolean).join(' · ');
function cellInfo(n) { const c = G.cellInfo(n); return { n: c.n, glyphs: c.glyphs, word: c.word, words: c.words, dlog: c.dlog, inv: c.inv, fold: c.fold, gamma: c.gam, ray: c.ray, character: c.ch }; }
const cellLine = c => (c.n === F.INF ? '∞' : c.n) + ' ' + c.glyphs + ' ' + c.word + ' · dlog ' + c.dlog + ' · ray ' + c.ray + ' · ' + c.character + (c.words && c.words.length > 1 ? ' · words: ' + c.words.join(', ') : '');
const starsTxt = n => n ? '★'.repeat(n) : '';
// the level's state in the page's own words: CLOSED at par (+ slack), REACHED over it, REBORN in the life from 80, LOST, or OPEN with the target still so many moves off
function outcome() {
  const st = S.done && !S.lost ? (S.stars[S.level - 1] || 0) : 0;
  const word = S.lost ? 'LOST' : !S.done ? 'OPEN' : S.reborn ? 'REBORN' : S.moves <= S.par + S.slack ? 'CLOSED' : 'REACHED';
  return { outcome: word, stars: st, moves: S.moves, par: S.par, slack: S.slack, road: letters(S.ops), roadLabels: labels(S.ops), at: S.current, left: S.done || S.lost ? 0 : S.dist, reborn: !!S.reborn };
}
// the page's share line for a level (the won card's SHARE), the chapter's rays on its eighth level
function shareLevel() {
  const t = G.cellInfo(S.target), st = S.stars[S.level - 1] || 0; let rays = '';
  if (RY && S.done && !S.lost && S.level % 8 === 0) { try { const tl = RY.tally(G.roadsOf(S.level - 7, S.level)), r = Array.isArray(tl) ? tl[0] : tl && tl.rays; if (r) rays = ' · rays ' + RY.spark(r); } catch (e) {} }
  return 'THE FOLD · ' + G.today() + ' · level ' + S.level + ' ' + starsTxt(st) + ' · ' + labels(S.ops) + ' · ' + t.glyphs + ' ' + S.target + ' ' + t.word + rays;
}

// ── plan ──
function cmdPlan(o) {
  const plan = session(o.name, o.day), levels = [];
  for (let L = 1; L <= plan.length; L++) { G.level(L); const v = levelView(plan[L - 1]); if (o.roads) v.road = letters(G.hint()); levels.push(v); }
  return { game: 'THE FOLD', date: G.today(), day: o.day, name: S.name, home: S.home, homeWord: wordOf(S.home), head: S.head, goldDay: S.goldDay, levels };
}
function planTxt(r) {
  const out = [header(), '64 levels in eight chapters of eight · start → target · par is the fewest paid moves · a road is letters ' + LETTERS + (r.levels[0].road != null ? ' · the solver\'s roads shown: the SCRIPTED league' : '')];
  for (const v of r.levels) {
    if ((v.n - 1) % 8 === 0) out.push('', v.chapter + ' · ' + v.chapterTitle + (v.quest ? ' · quest: ' + v.quest : ''));
    out.push(' ' + String(v.n).padStart(2) + '  ' + v.kind.padEnd(6) + ' ' + v.ruleName.padEnd(5) + ' ' + (cellTxt(v.start) + ' → ' + cellTxt(v.target)).padEnd(52) + ' par ' + String(v.par).padStart(2) + (flagsTxt(v) ? ' · ' + flagsTxt(v) : '') + (v.road != null ? ' · road ' + v.road : ''));
  }
  return out.join('\n');
}

// ── level ──
function cmdLevel(o) {
  const plan = session(o.name, o.day), L = needLevel(o.level, plan);
  G.level(L); const v = levelView(plan[L - 1]);
  v.standing = cellInfo(S.start); v.goal = cellInfo(S.target);
  v.moves = S.opsList.map(op => ({ letter: OPCH[op.id], label: op.label, name: op.name, lands: op.f(S.current), word: wordOf(op.f(S.current)), paid: !S.free.has(op.id) || S.countFree }));
  return Object.assign({ game: 'THE FOLD', date: G.today(), day: o.day, name: S.name }, v);
}
function levelTxt(v) {
  const out = [header(), 'level ' + v.n + ' of 64 · chapter ' + v.chapter + ' ' + v.chapterTitle + ' · ' + v.kind, v.title, v.text,
    'rule ' + v.ruleName + ': ' + v.tell + ' · par ' + v.par + (flagsTxt(v) ? ' · ' + flagsTxt(v) : ''),
    'you stand on ' + cellLine(v.standing), 'the target is ' + cellLine(v.goal) + (v.shift ? ' (and steps ×g after every move)' : ''), 'from here the moves land:'];
  for (const m of v.moves) out.push('  ' + m.letter + '  ' + m.label.padEnd(4) + ' → ' + cellTxt(m.lands) + (m.paid ? '' : '  (free)'));
  if (v.quest) out.push('the chapter\'s quest, a tap on the page and not scored here: ' + v.quest);
  return out.join('\n');
}

// ── play ──
function cmdPlay(o) {
  const plan = session(o.name, o.day), L = needLevel(o.level, plan), ids = parseRoad(o.road);
  G.level(L); const v = levelView(plan[L - 1]), steps = [];
  for (const id of ids) {
    if (S.done || S.lost) { steps.push({ letter: OPCH[id], label: F.OP[id].label, skipped: true }); continue; }
    const from = S.current, to = G.apply(id);
    steps.push(to == null ? { letter: OPCH[id], label: F.OP[id].label, from, refused: true } : { letter: OPCH[id], label: F.OP[id].label, from, to, word: wordOf(to), paid: !S.free.has(id) || S.countFree, moves: S.moves, target: S.target, left: S.dist });
  }
  return Object.assign({ game: 'THE FOLD', date: G.today(), day: o.day, name: S.name, level: v, steps }, outcome(), { share: shareLevel() });
}
function playTxt(r) {
  const v = r.level, out = [header(), 'level ' + v.n + ' · ' + v.title + ' · ' + v.ruleName + (flagsTxt(v) ? ' (' + flagsTxt(v) + ')' : '') + ' · par ' + v.par, '  start   ' + cellTxt(v.start) + ' → ' + cellTxt(v.target)];
  for (const s of r.steps) out.push('  ' + s.letter + '  ' + s.label.padEnd(4) + (s.skipped ? ' — after the end: not played' : s.refused ? ' — refused: 6↔9 is THE MIRROR\'s chapter\'s, and moves only a cell with a 6 or a 9 in its number' : ' → ' + cellTxt(s.to) + (s.paid ? '' : ' (free)') + (v.shift ? ' · the target now ' + cellTxt(s.target) : '') + ' · ' + s.left + ' off'));
  out.push(r.outcome + (r.stars ? ' ' + starsTxt(r.stars) : '') + ' · ' + r.moves + ' paid move' + (r.moves === 1 ? '' : 's') + ', par ' + r.par + (r.slack ? ' + ' + r.slack : '') + (r.outcome === 'OPEN' ? ' · the target ' + r.left + ' off from ' + cellTxt(r.at) : ''));
  out.push('share: ' + r.share); return out.join('\n');
}

// ── day ──
// a roads file: `L: road`, or bare roads counting up from level 1; `| road` the life from 80 after a loss; # a comment
function readRoads(text) {
  const roads = {}; let next = 1;
  for (let line of text.split(/\r?\n/)) {
    line = line.replace(/#.*$/, '').trim(); if (!line) continue;
    const m = /^(\d+)\s*:\s*(.*)$/.exec(line), L = m ? +m[1] : next, body = m ? m[2] : line, [first, second] = body.split('|');
    roads[L] = { road: parseRoad(first), rebirth: second == null ? null : parseRoad(second) }; next = L + 1;
  }
  return roads;
}
const readSrc = src => src === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(src, 'utf8');
// the day through the engine in level order: a level with a road is played, and if it is lost and a second road is given, reborn from 80 and played on; one without a road is passed, open
function playDay(name, day, roads) {
  const plan = session(name, day), levels = [];
  for (let L = 1; L <= plan.length; L++) {
    G.level(L); const r = roads[L], v = levelView(plan[L - 1]);
    if (r) {
      for (const id of r.road) { if (S.done || S.lost) break; G.apply(id); }
      if (S.lost && r.rebirth && G.canRebirth()) { G.rebirth(); for (const id of r.rebirth) { if (S.done || S.lost) break; G.apply(id); } }
    }
    levels.push(Object.assign({ n: L, kind: v.kind, title: v.title, ruleName: v.ruleName, start: v.start, target: v.target, played: !!r }, outcome()));
  }
  const stars = S.stars.reduce((a, b) => a + (b || 0), 0), line = G.lineInfo(), seal = LV.seal(S.targets), dec = G.tapeRead();
  const tpl = ST && ST.seal ? ST.seal : 'The day closes on {word}, cell {cell}; its mirror {mirror}. {stars} stars.', fill = (t, k, v) => t.split('{' + k + '}').join(String(v));
  const sealText = fill(fill(fill(fill(tpl, 'word', line.word), 'cell', line.cell), 'mirror', D.cells[line.mirror].w + ' ' + line.mirror), 'stars', stars);
  return { game: 'THE FOLD', date: G.today(), day, name: S.name, home: S.home, levels, closed: S.closed, stars, lost: levels.filter(l => l.outcome === 'LOST').length, open: levels.filter(l => l.outcome === 'OPEN').length, reborn: S.rebirths.slice(),
    line: line.txt, lineCell: line.cell, lineWord: line.word, mirror: line.mirror, mirrorWord: D.cells[line.mirror].w, seal: { cell: seal.cell, word: seal.word, by: seal.by }, decoded: dec, rays: S.rays.slice(), sealText,
    share: 'THE FOLD · ' + G.today() + ' · ' + S.closed + ' closed · ' + stars + ' stars · ' + sealText + (RY ? ' · rays ' + RY.spark(S.rays) : '') };
}
function dayTxt(r) {
  const out = [header(), ' L  rule   start → target' + ' '.repeat(29) + 'par  road              outcome'];
  for (const l of r.levels) out.push(' ' + String(l.n).padStart(2) + '  ' + l.ruleName.padEnd(5) + '  ' + (cellTxt(l.start) + ' → ' + cellTxt(l.target)).padEnd(44) + ' ' + String(l.par).padStart(2) + '   ' + (l.played ? (l.road || '—') : '·').padEnd(16) + ' ' + (l.played ? l.outcome + (l.stars ? ' ' + starsTxt(l.stars) : '') + (l.outcome === 'OPEN' ? ' · ' + l.left + ' off' : l.outcome === 'LOST' ? '' : ' · ' + l.moves + ' of ' + l.par) : 'not played'));
  out.push('', r.closed + ' closed · ' + r.stars + ' stars · ' + r.lost + ' lost · ' + r.open + ' open' + (r.reborn.length ? ' · reborn ' + r.reborn.join(' ') : ''),
    'the line: ' + (r.line || '—') + ' ≡ ' + r.lineCell + ' ' + r.lineWord + ', its mirror ' + r.mirror + ' ' + r.mirrorWord,
    'the seal: the ' + r.seal.by + ' of the targets ≡ ' + r.seal.cell + ' ' + r.seal.word + (r.decoded ? ' · the tape decoded ' + r.decoded.k + ' of ' + r.decoded.of : ''), 'share: ' + r.share);
  return out.join('\n');
}

// ── vs ──
// a side: a roads file (played as the day), a `day --json` file, or the page's own saved run (localStorage's fold.run.<day>.daily), told apart by shape
function sideResults(name, day, src) {
  const text = readSrc(src), label = src === '-' ? 'stdin' : path.basename(src).replace(/\.[^.]+$/, ''); let j = null; try { j = JSON.parse(text); } catch (e) {}
  if (j && Array.isArray(j.levels)) return { label, kind: 'day', levels: j.levels.map(l => ({ n: l.n, stars: l.stars || 0, moves: l.moves, outcome: l.outcome })) };
  if (j && Array.isArray(j.stars) && Array.isArray(j.roads)) {
    const plan = session(name, day), levels = []; if (j.name && j.name !== S.name) console.error('fold_cli: the saved run is ' + j.name + '\'s, not ' + S.name + '\'s');
    for (let L = 1; L <= plan.length; L++) {
      G.level(L); const st = j.stars[L - 1], r = j.roads[L - 1], ops = r ? Array.from(r[1]).map(c => CHOP[c]) : null, moves = ops ? ops.filter(id => S.countFree || !S.free.has(id)).length : null;
      levels.push({ n: L, stars: st || 0, moves, outcome: st == null ? 'OPEN' : st === 0 ? 'LOST' : (j.rebirths || []).includes(L) ? 'REBORN' : moves != null && moves <= S.par + S.slack ? 'CLOSED' : 'REACHED', road: r ? r[1] : null });
    }
    return { label, kind: 'saved run', levels };
  }
  return { label, kind: 'roads', levels: playDay(name, day, readRoads(text)).levels };
}
function cmdVs(o) {
  session(o.name, o.day); const A = sideResults(o.name, o.day, o.a), B = sideResults(o.name, o.day, o.b); if (A.label === B.label) { A.label += ' (A)'; B.label += ' (B)'; }
  const rows = A.levels.map((a, k) => { const b = B.levels[k] || { n: a.n, stars: 0, moves: null, outcome: 'OPEN' }; const w = a.stars !== b.stars ? (a.stars > b.stars ? 'A' : 'B') : a.stars && a.moves != null && b.moves != null && a.moves !== b.moves ? (a.moves < b.moves ? 'A' : 'B') : '='; return { n: a.n, a, b, winner: w }; });
  const tally = { A: rows.filter(r => r.winner === 'A').length, B: rows.filter(r => r.winner === 'B').length, drawn: rows.filter(r => r.winner === '=').length }, stars = { A: A.levels.reduce((s, l) => s + l.stars, 0), B: B.levels.reduce((s, l) => s + l.stars, 0) };
  return { game: 'THE FOLD', date: G.today(), day: o.day, name: S.name, a: A.label, b: B.label, aKind: A.kind, bKind: B.kind, rows, tally, stars, share: 'THE FOLD · ' + G.today() + ' · ' + S.name + ' · ' + A.label + ' ' + tally.A + ' – ' + tally.B + ' ' + B.label + ' · ' + tally.drawn + ' drawn · stars ' + stars.A + ' – ' + stars.B };
}
function vsTxt(r) {
  const cell = l => (l.outcome === 'OPEN' ? '·' : l.outcome === 'LOST' ? 'lost' : starsTxt(l.stars) + ' ' + l.moves).padEnd(10);
  const out = [header(), r.a + ' (' + r.aKind + ') against ' + r.b + ' (' + r.bKind + ') · a level goes to more stars, then to fewer moves', ' L  ' + r.a.slice(0, 10).padEnd(10) + ' ' + r.b.slice(0, 10).padEnd(10)];
  for (const row of r.rows) out.push(' ' + String(row.n).padStart(2) + '  ' + cell(row.a) + ' ' + cell(row.b) + ' ' + (row.winner === '=' ? '=' : row.winner === 'A' ? '◀' : '▶'));
  out.push('', r.a + ' ' + r.tally.A + ' · ' + r.b + ' ' + r.tally.B + ' · ' + r.tally.drawn + ' drawn · stars ' + r.stars.A + ' – ' + r.stars.B, 'share: ' + r.share); return out.join('\n');
}

// ── solve, cell, table ──
function cmdSolve(o) {
  const plan = session(o.name, o.day), Ls = o.level != null ? [needLevel(o.level, plan)] : plan.map(sp => sp.n), roads = [];
  for (const L of Ls) { G.level(L); const h = G.hint(); roads.push({ n: L, title: plan[L - 1].title, start: S.start, target: S.target, par: S.par, road: letters(h), roadLabels: labels(h), moves: F.cost(h, S.countFree ? new Set() : S.free) }); }
  return { game: 'THE FOLD', date: G.today(), day: o.day, name: S.name, league: 'SCRIPTED: the solver\'s roads, what HINT gives on the page', roads };
}
const solveTxt = r => [header(), r.league].concat(r.roads.map(x => ' ' + String(x.n).padStart(2) + '  ' + (cellTxt(x.start) + ' → ' + cellTxt(x.target)).padEnd(44) + ' par ' + String(x.par).padStart(2) + '  ' + x.road.padEnd(12) + ' ' + x.roadLabels)).join('\n');
const parseCell = s => { s = String(s == null ? '' : s).trim(); if (/^(inf|∞|257)$/i.test(s)) return F.INF; const n = +s; if (!/^\d+$/.test(s) || n > 256) throw new Error('a cell is 0 to 256, or ∞'); return n; };
function cmdCell(o) {
  const n = o.n, c = cellInfo(n), moves = F.OPS.map(op => ({ letter: OPCH[op.id], label: op.label, name: op.name, lands: op.f(n), word: wordOf(op.f(n)) }));
  const fl = F.flip69(n); if (fl !== n) moves.push({ letter: 'x', label: '6↔9', name: 'the flip', lands: fl, word: wordOf(fl), note: 'THE MIRROR\'s chapter only, levels 41–48' });
  return Object.assign({ game: 'THE FOLD' }, c, { moves });
}
const cellFullTxt = c => [cellLine(c).replace(/ · words:.*$/, '') + ' · inverse ' + (c.inv === F.INF ? '∞' : c.inv) + ' · fold ' + c.fold + ' · Γ ' + (c.gamma === F.INF ? '∞' : c.gamma), 'words: ' + c.words.join(', '), 'the moves land:'].concat(c.moves.map(m => '  ' + m.letter + '  ' + m.label.padEnd(4) + ' → ' + cellTxt(m.lands) + (m.note ? '  (' + m.note + ')' : ''))).join('\n');
function cmdTable() { const rows = []; for (let r = 0; r < 16; r++) rows.push(Array.from({ length: 16 }, (_, c) => F.dlog(16 * r + c))); rows.push([F.dlog(256)]); return { what: 'dlog by cell: n = 16·row + column, 3^dlog ≡ n mod 257; 0 (and ∞, cell 257) have none, −1', rows, pow: F.POW.slice() }; }
function tableTxt(t) {
  const out = [t.what, '      ' + Array.from({ length: 16 }, (_, c) => String(c).padStart(4)).join('')];
  t.rows.slice(0, 16).forEach((row, r) => out.push(String(16 * r).padStart(4) + ' |' + row.map(v => String(v).padStart(4)).join(''))); out.push(' 256 |' + String(t.rows[16][0]).padStart(4));
  out.push('', '×g adds 1 to the dlog, ÷g takes 1, FOLD adds 128, INV negates it, ×i adds 192, all mod 256; Γ is not a step on the dlog line'); return out.join('\n');
}

// ── THE LEDGER (parts/ledger, deploy/ledger): the day's board read, a day or a note posted; the site verifies a day by replaying its roads ──
async function cmdLedger(o) {
  const r = await fetch(o.site + '/ledger/' + o.day, { headers: { accept: 'application/json' } }), j = await r.json().catch(() => null);
  if (!r.ok) throw new Error((j && j.error) || ('the ledger answers ' + r.status)); j.site = o.site; return j;
}
function ledgerTxt(r) {
  const out = ['THE LEDGER · ' + r.date + ' · day ' + r.day + ' · ' + r.site, 'the day\'s seals · ' + r.seals.length + (r.seals.length ? ' · the glyph sequence: the targets closed, a chapter a row, ·· where a level was not closed' : '')];
  for (const e of r.seals) { out.push(' #' + e.rank + ' ' + e.name + ' · ★ ' + e.stars + ' · ' + e.closed + ' closed' + (e.reborn && e.reborn.length ? ' · reborn ' + e.reborn.length : '') + ' · ' + e.league + ' · sealed under ' + e.seal.word + ' ' + e.seal.cell + ' · the line ' + e.line.word + ' ' + e.line.cell); for (const row of LG.glyphRows(e.targets, F)) out.push('    ' + row); if (e.msg) out.push('    ' + e.msg.replace(/\n/g, '\n    ')); }
  out.push('the wall · ' + r.notes.length); for (const n of r.notes) out.push(' ' + n.name + ' · ' + n.date + (n.league && n.league !== 'person' ? ' · ' + n.league : '') + ': ' + n.msg.replace(/\n/g, '\n   '));
  return out.join('\n');
}
async function cmdPost(o) {
  const body = { day: o.day, name: cleanName(o.name), league: o.league || 'person', msg: o.msg || '' };
  if (o.roadsSrc) { body.roads = readSrc(o.roadsSrc); readRoads(body.roads); }   // read here first: a stray letter is told before anything is sent
  else if (!body.msg) throw new Error('post NAME ROADS for a day, or post NAME --msg "…" for a note');
  const r = await fetch(o.site + '/ledger', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) }), j = await r.json().catch(() => null);
  if (!r.ok) throw new Error((j && j.error) || ('the ledger answers ' + r.status)); j.site = o.site; return j;
}
const postTxt = j => j.entry.kind === 'seal'
  ? ['on the ledger at ' + j.site + (j.replaced ? ', replacing the day before' : '') + ': #' + j.entry.rank + ' ' + j.entry.name + ' · ★ ' + j.entry.stars + ' · ' + j.entry.closed + ' closed · ' + j.entry.league].concat(LG.glyphRows(j.entry.targets, F).map(r => '    ' + r), ['share: ' + LG.shareOf(j.entry)]).join('\n')
  : 'on the wall at ' + j.site + ': ' + j.entry.name + ' · ' + j.entry.msg;

// ── the self-test: day 9384 (2026-09-10) for TORAH, the day parts/levels/test.js pins too ──
async function check() {
  let checks = 0, fails = 0; const ok = (c, m) => { checks++; if (!c) { fails++; console.log('  FAIL ' + m); } };
  const DAY = 9384, NAME = 'TORAH', tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fold-cli-')), file = (n, t) => { const p = path.join(tmp, n); fs.writeFileSync(p, t); return p; };
  ok(letters(parseRoad('rrrGrr')) === 'rrrGrr' && letters(parseRoad('Γ Γ Γ ÷g Γ Γ')) === 'rrrGrr' && letters(parseRoad('r, r · r G r r')) === 'rrrGrr', 'a road reads as letters, as labels, with separators');
  ok(parseRoad('*g /g fold inv *i gamma flip').join() === 'g,ig,fold,inv,i,gam,flip' && parseRoad('×g ÷g FOLD INV ×i Γ 6↔9').join() === 'g,ig,fold,inv,i,gam,flip' && parseRoad('').length === 0, 'the labels, the ASCII names, the empty road');
  ok((() => { try { parseRoad('r z'); return false; } catch (e) { return /not a move: z/.test(e.message); } })(), 'a stray letter is refused');
  ok(dayOfDate('2026-09-10') === DAY, '--date 2026-09-10 is day ' + DAY);
  const plan = cmdPlan({ name: NAME, day: DAY }), l1 = plan.levels[0];
  ok(plan.date === '2026-09-10' && plan.name === NAME && plan.home === 62 && plan.levels.length === 64, 'the plan: 2026-09-10, TORAH at 62, 64 levels');
  ok(l1.title === 'HOLY SPIRIT → CAIN' && l1.start === 151 && l1.target === 27 && l1.ruleName === 'JUMP' && l1.par === 1 && l1.free.join() === 'gam' && !('road' in l1), 'level 1 is HOLY SPIRIT → CAIN, 151 → 27, JUMP, par 1, no road given');
  const withRoads = cmdPlan({ name: NAME, day: DAY, roads: true }); ok(withRoads.levels.every(v => typeof v.road === 'string' && v.road.length >= 1), '--roads gives every level a road');
  ok(plan.levels.filter(v => v.flip).map(v => v.n).join() === '41,42,43,44,45,46,47,48', 'the flip is open in THE MIRROR, levels 41–48');
  const lv = cmdLevel({ name: NAME, day: DAY, level: 1 }), gm = lv.moves.find(m => m.letter === 'r');
  ok(lv.moves.length === 6 && gm.lands === F.gamma(151) && gm.paid === false && lv.standing.word === 'HOLY SPIRIT' && lv.goal.n === 27, 'the level shows where the six moves land, Γ free');
  const p1 = cmdPlay({ name: NAME, day: DAY, level: 1, road: 'r r r G r r' });
  ok(p1.outcome === 'CLOSED' && p1.stars === 3 && p1.moves === 1 && p1.par === 1 && p1.at === 27 && p1.steps.length === 6 && p1.steps.filter(s => s.paid).length === 1, 'level 1 by r r r G r r: CLOSED ★★★, one paid move of six');
  ok(p1.share === 'THE FOLD · 2026-09-10 · level 1 ★★★ · Γ Γ Γ ÷g Γ Γ · ' + F.glyphs(27) + ' 27 CAIN', 'the share line is the page\'s: ' + p1.share);
  const p0 = cmdPlay({ name: NAME, day: DAY, level: 1, road: 'r' }); ok(p0.outcome === 'OPEN' && p0.stars === 0 && p0.left === 1, 'a road that stops short is OPEN, the target a move off');
  const plain = plan.levels.find(v => !v.strict && !v.shift && !v.clock && !v.countFree), roadOf = n => withRoads.levels[n - 1].road;
  const over = cmdPlay({ name: NAME, day: DAY, level: plain.n, road: 'gG' + roadOf(plain.n) });
  ok(over.outcome === 'REACHED' && over.moves === plain.par + 2 && over.stars === (plain.slack ? 2 : 1), 'level ' + plain.n + ' two over par: REACHED ' + (plain.slack ? '★★ with the slack' : '★'));
  const sync = plan.levels.find(v => v.strict), lostRoad = 'gG' + roadOf(sync.n), lost = cmdPlay({ name: NAME, day: DAY, level: sync.n, road: lostRoad });
  ok(lost.outcome === 'LOST' && lost.stars === 0, 'level ' + sync.n + ' SYNC, two over: LOST');
  session(NAME, DAY); G.level(sync.n); for (const id of parseRoad(lostRoad)) { if (S.lost) break; G.apply(id); } const can = G.canRebirth(); let born = null; if (can) { G.rebirth(); born = letters(G.hint()); }
  const lines = f => withRoads.levels.map(v => v.n + ': ' + (f ? f(v.n) : roadOf(v.n))).join('\n'), all = lines();
  const full = playDay(NAME, DAY, readRoads(all));
  ok(full.closed === 64 && full.stars === 192 && full.lost === 0 && full.open === 0, 'the solver\'s day: 64 closed, 192 stars (' + full.closed + ', ' + full.stars + ')');
  ok(full.share.startsWith('THE FOLD · 2026-09-10 · 64 closed · 192 stars · ') && / · rays [▁▂▃▄▅▆▇█]{12}$/.test(full.share) && full.line.split(' ').length >= 64, 'the day\'s share line, with the rays: ' + full.share.slice(0, 60) + '…');
  const three = playDay(NAME, DAY, readRoads(all.split('\n').slice(0, 3).join('\n'))); ok(three.closed === 3 && three.open === 61 && three.levels[3].played === false, 'three roads: 3 closed, 61 open');
  const bare = playDay(NAME, DAY, readRoads(roadOf(1) + '\n' + roadOf(2) + '\n# a comment\n\n')); ok(bare.closed === 2 && bare.levels[1].outcome === 'CLOSED', 'bare lines count up from level 1; comments and blanks pass');
  if (can) { const re = playDay(NAME, DAY, readRoads(lines(n => n === sync.n ? lostRoad + ' | ' + born : roadOf(n)))), l = re.levels[sync.n - 1];
    ok(l.outcome === 'REBORN' && l.stars === 1 && l.reborn && re.reborn.join() === String(sync.n) && re.stars === 190 && re.closed === 64, 'level ' + sync.n + ' lost and reborn from 80 by the second road: REBORN ★, 190 stars'); }
  else ok(true, 'no rebirth from 80 on level ' + sync.n + ' this day');
  const A = file('machine.txt', all), B = file('you.txt', lines(n => n === plain.n ? 'gG' + roadOf(n) : roadOf(n)));
  const vs = cmdVs({ name: NAME, day: DAY, a: A, b: B }); ok(vs.tally.A === 1 && vs.tally.B === 0 && vs.tally.drawn === 63 && vs.rows[plain.n - 1].winner === 'A' && vs.a === 'machine' && vs.b === 'you', 'vs: machine 1 – 0 you, 63 drawn');
  playDay(NAME, DAY, readRoads(all)); const saved = JSON.parse(localStorage.getItem('fold.run.' + DAY + '.daily')), C = file('saved.json', JSON.stringify(saved));
  const vs2 = cmdVs({ name: NAME, day: DAY, a: C, b: A }); ok(vs2.aKind === 'saved run' && vs2.tally.drawn === 64 && vs2.stars.A === 192 && vs2.rows.every(r => r.a.moves === r.b.moves), 'the page\'s saved run reads as a side: 64 drawn against the same roads');
  const vs3 = cmdVs({ name: NAME, day: DAY, a: file('day.json', JSON.stringify(full)), b: B }); ok(vs3.aKind === 'day' && vs3.tally.A === 1, 'a day --json file reads as a side');
  const c2 = cmdCell({ n: 2 }); ok(c2.glyphs === 'Φφ' && c2.word === 'B' && c2.dlog === 48 && c2.moves.find(m => m.letter === 'g').lands === 6 && c2.moves.find(m => m.letter === 'i').lands === 129, 'cell 2: Φφ B, dlog 48, ×g 6, INV 129');
  const cinf = cmdCell({ n: parseCell('∞') }); ok(cinf.glyphs === '∞' && cinf.moves.find(m => m.letter === 'r').lands === 1 && parseCell('inf') === F.INF, '∞: Γ lands on 1');
  const t = cmdTable(); ok(t.rows.length === 17 && t.rows[0][1] === 0 && t.rows[0][3] === 1 && t.rows.flat().filter(v => v >= 0).length === 256, 'the dlog table: 256 cells with a dlog');
  ok(fs.existsSync(path.join(AR, 'llms.txt')) && fs.readFileSync(path.join(AR, 'llms.txt'), 'utf8').includes(LETTERS), 'llms.txt is there and gives the letters');
  ok(await cmdPost({ site: 'http://x', name: 'X', day: DAY }).then(() => false, e => /post NAME ROADS/.test(e.message)), 'a post without roads or words is refused before anything is sent');
  unpinDay(); ok(Date === RealDate, 'the clock is given back');
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(checks + ' checks, ' + fails + ' failed — the cli plays'); return fails ? 1 : 0;
}

// ── the command line ──
function args(argv) {
  const o = { _: [], json: false, roads: false, day: null, site: (process.env.FOLD_SITE || 'https://start.cascade.training').replace(/\/+$/, ''), league: null, msg: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') o.json = true; else if (a === '--roads') o.roads = true; else if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--day') o.day = +argv[++i]; else if (a.startsWith('--day=')) o.day = +a.slice(6);
    else if (a === '--date') o.day = dayOfDate(argv[++i]); else if (a.startsWith('--date=')) o.day = dayOfDate(a.slice(7));
    else if (a === '--site') o.site = String(argv[++i] || '').replace(/\/+$/, ''); else if (a.startsWith('--site=')) o.site = a.slice(7).replace(/\/+$/, '');
    else if (a === '--league') o.league = argv[++i]; else if (a.startsWith('--league=')) o.league = a.slice(9);
    else if (a === '--msg') o.msg = argv[++i] || ''; else if (a.startsWith('--msg=')) o.msg = a.slice(6);
    else if (a.startsWith('--')) throw new Error('no such flag: ' + a); else o._.push(a);
  }
  if (o.day == null) o.day = F.dayNumber(new RealDate()); if (!Number.isInteger(o.day) || o.day < 0) throw new Error('--day wants the day number (days since 2000-12-31), or --date YYYY-MM-DD');
  return o;
}
async function main(argv) {
  const o = args(argv), cmd = o._[0], pos = o._.slice(1); if (!cmd || o.help || cmd === 'help') { console.log(USAGE); return 0; }
  let r, txt;
  switch (cmd) {
    case 'plan': o.name = pos[0]; r = cmdPlan(o); txt = planTxt; break;
    case 'level': o.name = pos[0]; o.level = +pos[1]; r = cmdLevel(o); txt = levelTxt; break;
    case 'play': o.name = pos[0]; o.level = +pos[1]; o.road = pos.slice(2).join(' '); r = cmdPlay(o); txt = playTxt; break;
    case 'day': o.name = pos[0]; if (!pos[1]) throw new Error('day NAME ROADS: a roads file, or - for stdin'); r = playDay(o.name, o.day, readRoads(readSrc(pos[1]))); txt = dayTxt; break;
    case 'vs': o.name = pos[0]; o.a = pos[1]; o.b = pos[2]; if (!o.a || !o.b) throw new Error('vs NAME A B: two roads files, day --json files or saved runs'); r = cmdVs(o); txt = vsTxt; break;
    case 'solve': o.name = pos[0]; o.level = pos[1] != null ? +pos[1] : null; r = cmdSolve(o); txt = solveTxt; break;
    case 'cell': o.n = parseCell(pos[0]); r = cmdCell(o); txt = cellFullTxt; break;
    case 'table': r = cmdTable(); txt = tableTxt; break;
    case 'rules': process.stdout.write(fs.readFileSync(path.join(AR, 'llms.txt'), 'utf8')); return 0;
    case 'ledger': r = await cmdLedger(o); txt = ledgerTxt; break;
    case 'post': o.name = pos[0]; o.roadsSrc = pos[1] || null; if (!o.name) throw new Error('post NAME [ROADS] [--league …] [--msg …]'); r = await cmdPost(o); txt = postTxt; break;
    case 'check': return check();
    default: throw new Error('no such command: ' + cmd + '\n\n' + USAGE);
  }
  console.log(o.json ? JSON.stringify(r, null, 1) : txt(r)); return 0;
}
module.exports = { parseRoad, letters, labels, cleanName, pinDay, unpinDay, session, readSrc, readRoads, cmdPlan, cmdLevel, cmdPlay, playDay, cmdVs, cmdSolve, cmdCell, cmdTable, cmdLedger, cmdPost, check };
if (require.main === module) Promise.resolve().then(() => main(process.argv.slice(2))).then(code => { process.exitCode = code; }, e => { console.error('fold_cli: ' + e.message); process.exitCode = 2; });
