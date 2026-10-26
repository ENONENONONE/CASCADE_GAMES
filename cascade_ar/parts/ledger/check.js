#!/usr/bin/env node
// THE FOLD — parts/ledger/check.js: the pure half under node (names, notes, the roads from S.climbs, the glyph block, the rank, the share
// line), then the service itself (deploy/ledger/server.js) on an ephemeral port with a store in a temp folder: an empty day, a day from
// the solver's roads verified at 64 closed and 192 stars with the glyph sequence of the plan's own targets, a claim that only lowers, a
// worse day refused and one as good replacing, a second name ranked under it, notes on the wall, the limits and the bad posts, the keeper's
// strike, the store read back on a restart; the CLI's post and ledger against it; and the rate limit on a second service. Run: node check.js
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const root = path.join(__dirname, '..', '..'), repo = path.join(root, '..');
const CLI = require(path.join(repo, 'fold_cli.js'));   // the engine under node; the modules hang on window
const F = window.FIELD, D = window.CASCADE_DATA, G = window.GAME, S = G.S, LG = window.FOLD_LEDGER;
let fails = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fails++; console.log('FAIL', m); } };
const day = F.dayNumber(new Date());   // before any CLI call pins the clock
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fold-ledger-')), file = (n, t) => { const p = path.join(tmp, n); fs.writeFileSync(p, t); return p; };
const kids = []; process.on('exit', () => { for (const k of kids) try { k.kill(); } catch (e) {} });

// ── the pure half ──
ok(LG.cleanName('  love ') === 'LOVE' && LG.cleanName('') === 'SCRIBE' && LG.cleanName(null) === 'SCRIBE' && LG.cleanName('a​b\u0007c') === 'ABC' && LG.cleanName('x'.repeat(30)).length === 24 && LG.cleanName('two   words') === 'TWO WORDS', 'a name: trimmed, upper, SCRIBE when empty, the invisible out, 24 at most');
ok(LG.cleanMsg('\u0007hi  \n\n\n\nthere  \n') === 'hi\n\nthere' && LG.cleanMsg('y'.repeat(300)).length === 280 && LG.cleanMsg('') === '', 'a note: the control characters out, the breaks kept to two, 280 at most');
ok(LG.league('Thinking') === 'thinking' && LG.league('SCRIPTED') === 'scripted' && LG.league('x') === 'person' && LG.league() === 'person', 'the leagues');
ok(LG.dateOf(9384) === '2026-09-10' && LG.dateOf(0) === '2000-12-31', 'the date of a day');
ok(LG.roadsText([{ L: 1, ops: 'rrrGrr', out: 3 }, { L: 2, ops: 'gG', out: 'lost' }, { L: 2, ops: 'gGf', out: 'lost' }, { L: 2, ops: 'qq', out: 2 }, { L: 3, ops: 'g', out: 'lost' }, { L: 3, ops: 'rr', out: 'reborn' }, { L: 9, ops: '', out: 'lost' }]) === '1: rrrGrr\n2: qq\n3: g | rr\n9: ', 'the roads from S.climbs: the standing record, the lost road before a rebirth');
ok(LG.roadsText([]) === '' && LG.roadsText(null) === '', 'no climbs, no roads');
{ const t = new Array(64).fill(null); t[0] = 27; t[63] = 137; const g = LG.glyphsOf(t, F), rows = LG.glyphRows(t, F);
  ok(g.length === 64 && g[0] === F.glyphs(27) && g[1] === '··' && g[63] === F.glyphs(137) && rows.length === 8 && rows.every(r => r.split(' ').length === 8) && rows[0].startsWith(F.glyphs(27) + ' ··'), 'the glyph sequence: 64 pairs, ·· for a level not closed, eight rows of eight'); }
{ const r = LG.rank([{ id: 'a', stars: 100, closed: 40, t: 2 }, { id: 'b', stars: 192, closed: 64, t: 3 }, { id: 'c', stars: 100, closed: 41, t: 1 }, { id: 'd', stars: 100, closed: 41, t: 0 }]);
  ok(r.map(e => e.id).join() === 'b,d,c,a' && r.map(e => e.rank).join() === '1,2,3,4', 'the rank: stars, then closed, then the earlier post'); }
ok(LG.shareOf({ day: 9384, name: 'TORAH', closed: 64, stars: 192, seal: { word: 'CROSS', cell: 74 }, rank: 1, league: 'thinking' }) === 'THE FOLD · 2026-09-10 · TORAH · 64 closed · 192 stars · sealed under CROSS 74 · #1 on the ledger · THINKING', 'the share line');
// the roads from a real day: the engine's own climbs, with a level lost and reborn, read back into the same day
{ const plan = CLI.cmdPlan({ name: 'TORAH', day: 9384, roads: true }), sync = plan.levels.find(v => v.strict); CLI.session('TORAH', 9384);
  for (const v of plan.levels) { G.level(v.n); if (v.n === sync.n) { for (const id of CLI.parseRoad('gG' + v.road)) { if (S.lost) break; G.apply(id); } if (G.canRebirth()) { G.rebirth(); for (const id of G.hint()) G.apply(id); } } else for (const id of CLI.parseRoad(v.road)) G.apply(id); }
  const stars0 = S.stars.reduce((a, b) => a + (b || 0), 0), txt = LG.roadsText(S.climbs), again = CLI.playDay('TORAH', 9384, CLI.readRoads(txt));
  ok(txt.split('\n').length === 64 && /\| /.test(txt.split('\n')[sync.n - 1]) && again.stars === stars0 && again.closed === 64 && again.reborn.join() === String(sync.n), 'a day\'s climbs read back: ' + again.stars + ' stars as played (' + stars0 + '), level ' + sync.n + ' reborn'); }
CLI.unpinDay();

// ── the service ──
function start(env) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [path.join(repo, 'deploy', 'ledger', 'server.js'), '--no-static'], { env: Object.assign({}, process.env, env), stdio: ['ignore', 'pipe', 'pipe'] }); kids.push(p);
    let out = ''; p.stdout.on('data', d => { out += d; const m = /listening (http:\/\/[^\s/]+)\/ledger/.exec(out); if (m) resolve({ p, base: m[1] }); });
    p.stderr.on('data', d => process.stderr.write(d)); p.on('exit', c => reject(new Error('the service exited ' + c + '\n' + out))); setTimeout(() => reject(new Error('no listening line\n' + out)), 20000);
  });
}
const J = async (base, method, p, body, headers) => { const r = await fetch(base + p, { method, headers: Object.assign({ 'content-type': 'application/json' }, headers || {}), body: body == null ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) }); return { status: r.status, json: await r.json().catch(() => null) }; };
(async () => {
  const store = path.join(tmp, 'ledger.jsonl'), env = { FOLD_LEDGER_PORT: '0', FOLD_LEDGER_DATA: store, FOLD_LEDGER_ADMIN: 'keeper', FOLD_LEDGER_RATE: 'off' };
  let { p, base } = await start(env);
  let r = await J(base, 'GET', '/ledger/health'); ok(r.status === 200 && r.json.ok && r.json.entries === 0 && r.json.today === day, 'health: up, empty, today ' + day);
  r = await J(base, 'GET', '/ledger/' + day); ok(r.status === 200 && r.json.day === day && r.json.seals.length === 0 && r.json.notes.length === 0 && r.json.date === LG.dateOf(day), 'an empty day');
  r = await J(base, 'GET', '/ledger'); ok(r.status === 200 && r.json.day === day, 'GET /ledger is today');
  r = await J(base, 'GET', '/ledger/abc'); ok(r.status === 404, 'a day is a number');
  r = await J(base, 'PUT', '/ledger'); ok(r.status === 405, 'PUT is not a thing');
  r = await J(base, 'GET', '/index.html'); ok(r.status === 404, 'no static files with --no-static');
  // the solver's day for TORAH, today
  const plan = CLI.cmdPlan({ name: 'TORAH', day, roads: true }), roads = plan.levels.map(v => v.n + ': ' + v.road).join('\n'), played = CLI.playDay('TORAH', day, CLI.readRoads(roads)); CLI.unpinDay();
  const want = LG.glyphsOf(played.levels.map(l => l.at), F).join(' ');
  r = await J(base, 'POST', '/ledger', { day, name: ' torah ', roads });
  ok(r.status === 201 && r.json.entry && r.json.entry.kind === 'seal' && r.json.entry.name === 'TORAH' && r.json.entry.closed === 64 && r.json.entry.stars === 192 && r.json.entry.rank === 1 && r.json.entry.league === 'person' && !r.json.replaced, 'the solver\'s day sealed: 64 closed, 192 stars, #1');
  ok(r.json.entry.glyphs === want && r.json.entry.targets.length === 64 && r.json.entry.targets.every(t => t != null) && typeof r.json.entry.seal.word === 'string' && r.json.entry.seal.cell === played.seal.cell && r.json.entry.line.cell === played.lineCell && typeof r.json.entry.roads === 'string', 'its glyph sequence is the plan\'s own targets, its seal and line the engine\'s');
  const torahId = r.json.entry.id;
  r = await J(base, 'POST', '/ledger', { day, name: 'TORAH', roads, stars: [2].concat(new Array(63).fill(3)) });
  ok(r.status === 409 && /holds TORAH/.test(r.json.error) && r.json.entry && r.json.entry.id === torahId, 'a claim only lowers, and a worse day is refused: ' + (r.json && r.json.error));
  r = await J(base, 'POST', '/ledger', { day, name: 'TORAH', roads, stars: new Array(64).fill(3), msg: '  well played \u0007' });
  ok(r.status === 200 && r.json.replaced && r.json.entry.msg === 'well played' && r.json.entry.stars === 192 && r.json.entry.rank === 1 && r.json.entry.replaces === torahId, 'a day as good replaces, and carries its note');
  r = await J(base, 'GET', '/ledger/' + day); ok(r.json.seals.length === 1 && r.json.seals[0].name === 'TORAH' && r.json.seals[0].msg === 'well played', 'one seal for the name');
  const scribe = CLI.cmdPlan({ name: 'SCRIBE', day, roads: true }); CLI.unpinDay(); const three = scribe.levels.slice(0, 3).map(v => v.n + ': ' + v.road).join('\n');
  r = await J(base, 'POST', '/ledger', { day, name: 'scribe', roads: three, league: 'Scripted' });
  ok(r.status === 201 && r.json.entry.closed === 3 && r.json.entry.stars === 9 && r.json.entry.rank === 2 && r.json.entry.league === 'scripted' && r.json.entry.glyphs.split(' ').slice(3).every(g => g === '··') && r.json.entry.glyphs.split(' ').slice(0, 3).every(g => g !== '··'), 'three levels: #2, the sequence three pairs then ··');
  const scribeId = r.json.entry.id;
  r = await J(base, 'POST', '/ledger', { day, name: 'ANON', msg: '  hello\u0007 wall ' }); ok(r.status === 201 && r.json.entry.kind === 'note' && r.json.entry.msg === 'hello wall' && r.json.entry.name === 'ANON', 'a note on the wall');
  r = await J(base, 'POST', '/ledger', { day: day - 2, name: 'EARLIER', msg: 'from the day before yesterday' }); ok(r.status === 201, 'a note two days back');
  r = await J(base, 'GET', '/ledger/' + day); ok(r.json.notes.length === 2 && r.json.notes[0].name === 'EARLIER' && r.json.notes[1].name === 'ANON' && r.json.counts.seals === 2, 'the week\'s wall, the newest post first whatever its day');
  r = await J(base, 'POST', '/ledger', { day: day + 10, name: 'X', msg: 'from the future' }); ok(r.status === 400 && /takes today/.test(r.json.error), 'a far day is refused');
  r = await J(base, 'POST', '/ledger', { day, name: 'X', roads: '1: r z' }); ok(r.status === 400 && /do not read/.test(r.json.error), 'roads that do not read');
  r = await J(base, 'POST', '/ledger', { day, name: 'TORAH', roads: '1: g' }); ok(r.status === 400 && /nothing to seal/.test(r.json.error), 'roads that close nothing');
  r = await J(base, 'POST', '/ledger', { day, name: 'X' }); ok(r.status === 400 && /needs words/.test(r.json.error), 'neither roads nor words');
  r = await J(base, 'POST', '/ledger', '{not json'); ok(r.status === 400 && /not JSON/.test(r.json.error), 'not JSON');
  r = await J(base, 'POST', '/ledger', { day, name: 'X', msg: 'x', roads: 'g'.repeat(20000) }); ok(r.status === 413, 'an oversize post is answered 413');
  r = await J(base, 'DELETE', '/ledger/' + scribeId); ok(r.status === 403, 'no strike without the keeper\'s word');
  r = await J(base, 'DELETE', '/ledger/' + scribeId, null, { authorization: 'Bearer keeper' }); ok(r.status === 200 && r.json.struck === scribeId, 'the keeper strikes');
  r = await J(base, 'DELETE', '/ledger/nothere', null, { authorization: 'Bearer keeper' }); ok(r.status === 404, 'nothing to strike');
  r = await J(base, 'GET', '/ledger/' + day); ok(r.json.seals.length === 1 && r.json.seals[0].name === 'TORAH', 'struck from the day');
  // the CLI against it
  const rf = file('horus.txt', CLI.cmdPlan({ name: 'HORUS', day, roads: true }).levels.map(v => v.n + ': ' + v.road).join('\n')); CLI.unpinDay();
  let j = await CLI.cmdPost({ site: base, name: 'horus', day, roadsSrc: rf, league: 'thinking', msg: 'from the cli' });
  ok(j.entry.kind === 'seal' && j.entry.name === 'HORUS' && j.entry.closed === 64 && j.entry.league === 'thinking' && j.entry.rank === 2 && j.entry.msg === 'from the cli', 'the CLI posts a day: HORUS #2 (the same stars, the later post)');
  j = await CLI.cmdPost({ site: base, name: 'HORUS', day, msg: 'a note from the cli' }); ok(j.entry.kind === 'note' && j.entry.msg === 'a note from the cli', 'the CLI posts a note');
  j = await CLI.cmdLedger({ site: base, day }); ok(j.seals.length === 2 && j.seals[0].name === 'TORAH' && j.seals[1].name === 'HORUS' && j.notes.length === 3 && j.notes[0].msg === 'a note from the cli', 'the CLI reads the day back');
  ok(await CLI.cmdPost({ site: base, name: 'X', day, roadsSrc: file('bad.txt', '1: r z') }).then(() => false, e => /not a move: z/.test(e.message)), 'the CLI refuses a bad road before posting');
  // the store read back
  p.kill(); await new Promise(res => p.on('exit', res));
  const lines = fs.readFileSync(store, 'utf8').trim().split('\n').map(l => JSON.parse(l));
  ok(lines.length === 8 && lines.filter(l => l.del).length === 1 && lines.filter(l => l.replaces).length === 1, 'the store: eight lines, one replacement, one strike');
  ({ p, base } = await start(env));
  r = await J(base, 'GET', '/ledger/' + day); ok(r.status === 200 && r.json.seals.length === 2 && r.json.seals[0].name === 'TORAH' && r.json.seals[0].msg === 'well played' && r.json.notes.length === 3, 'a restart reads the store back: the replacement and the strike applied');
  p.kill();
  // the rate limit, on a service with it
  ({ p, base } = await start({ FOLD_LEDGER_PORT: '0', FOLD_LEDGER_DATA: path.join(tmp, 'rate.jsonl') }));
  r = await J(base, 'POST', '/ledger', { day, name: 'A', msg: 'one' }); const r2 = await J(base, 'POST', '/ledger', { day, name: 'A', msg: 'two' });
  ok(r.status === 201 && r2.status === 429 && /pause/.test(r2.json.error), 'the rate limit: a second post within ten seconds is asked to pause');
  r = await J(base, 'POST', '/ledger', { day, name: 'B', msg: 'from elsewhere' }, { 'cf-connecting-ip': '203.0.113.9' }); ok(r.status === 201, 'another address (CF-Connecting-IP) may post');
  p.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(checks + ' checks, ' + fails + ' failed — the ledger holds'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('FAIL', e.stack || e.message); process.exit(1); });
