#!/usr/bin/env node
// THE FOLD — deploy/ledger/server.js: THE LEDGER's service, the one piece of the game that runs on a server. One file, no dependencies,
// node 18 or later. It keeps the public board of the day's seals and the wall of notes in an append-only JSONL file, and it verifies every
// day posted by replaying its roads through the engine (fold_cli.js loads game.js under node): what the engine finds is what is kept, a
// claim can only lower a level (a HINT's cap), and the glyph sequence is the targets the engine closed, in the field's alphabet.
//
//   node deploy/ledger/server.js                 the ledger at /ledger, and the game itself served from cascade_ar/ at http://localhost:8257/
//   node deploy/ledger/server.js --no-static     the ledger alone, as the systemd unit runs it on Vita behind Caddy (deploy/install.sh)
//
//   GET  /ledger/health            {ok, entries, today}
//   GET  /ledger/<day>             {day, date, today, seals: [ranked], notes: [newest first, the week's], counts}   (GET /ledger: today)
//   POST /ledger                   {day, name, league?, roads?, stars?, msg?}: roads make a seal (verified), words alone a note;
//                                  201 {entry}, 200 {entry, replaced} when the name's day is replaced, 409 when the day standing is better
//   DELETE /ledger/<id>            with Authorization: Bearer $FOLD_LEDGER_ADMIN: the entry is struck (a {"del"} line in the store)
//
// Settings (environment): FOLD_LEDGER_PORT (8257; 0 for any), FOLD_LEDGER_HOST (127.0.0.1; 0.0.0.0 for the LAN), FOLD_LEDGER_DATA
// (~/.fold-ledger/ledger.jsonl), FOLD_LEDGER_ADMIN (no DELETE without it), FOLD_LEDGER_CORS=1 (any origin may read and post: dev only),
// FOLD_LEDGER_RATE=off (no rate limit: the check). A post is 16 KB at most, a name 24 characters, a note 280; one post every ten
// seconds and sixty a day from an address (Cloudflare's CF-Connecting-IP, else the first X-Forwarded-For, else the socket: only Caddy
// reaches this port). The store is a text file: a line an entry, {"del": id} strikes one; edit it and restart to moderate by hand.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..', '..'), AR = path.join(ROOT, 'cascade_ar');
const CLI = require(path.join(ROOT, 'fold_cli.js'));   // the engine under node, as the CLI loads it; the modules hang on window
require(path.join(AR, 'parts', 'ledger', 'ledger.js'));
const F = window.FIELD, D = window.CASCADE_DATA, LV = window.FOLD_LEVELS, LG = window.FOLD_LEDGER;
const opt = {
  port: process.env.FOLD_LEDGER_PORT != null && process.env.FOLD_LEDGER_PORT !== '' ? +process.env.FOLD_LEDGER_PORT : 8257,
  host: process.env.FOLD_LEDGER_HOST || '127.0.0.1',
  data: process.env.FOLD_LEDGER_DATA || path.join(os.homedir(), '.fold-ledger', 'ledger.jsonl'),
  admin: process.env.FOLD_LEDGER_ADMIN || '', cors: !!process.env.FOLD_LEDGER_CORS, rate: process.env.FOLD_LEDGER_RATE !== 'off',
  static: !process.argv.includes('--no-static'),
};
const BODY_MAX = 16384, ROADS_MAX = 8192, DAY_SLACK = 2, RATE_GAP = 10000, RATE_DAY = 60, NOTES_DAYS = 7, NOTES_MAX = 50;
const today = () => F.dayNumber(new Date());

// ── the store: a map of entries, an append-only file ──
const entries = new Map();
function load() {
  if (!fs.existsSync(opt.data)) return 0; let n = 0;
  for (const line of fs.readFileSync(opt.data, 'utf8').split('\n')) {
    if (!line.trim()) continue; let j; try { j = JSON.parse(line); } catch (e) { continue; }
    if (j.del) entries.delete(j.del); else if (j.id) { if (j.replaces) entries.delete(j.replaces); entries.set(j.id, j); n++; }
  }
  return n;
}
function append(obj) { fs.mkdirSync(path.dirname(opt.data), { recursive: true }); fs.appendFileSync(opt.data, JSON.stringify(obj) + '\n'); }
const newId = () => crypto.randomBytes(6).toString('hex');
// the day's view: the seals ranked, the week's notes newest first
function view(day) {
  const all = [...entries.values()];
  const seals = LG.rank(all.filter(e => e.kind === 'seal' && e.day === day)), notes = all.filter(e => e.kind === 'note' && e.day <= day && e.day > day - NOTES_DAYS).sort((a, b) => b.t - a.t).slice(0, NOTES_MAX);
  return { day, date: LG.dateOf(day), today: today(), seals, notes, counts: { seals: seals.length, notes: notes.length } };
}
const rankOf = (day, id) => { const e = view(day).seals.find(s => s.id === id); return e ? e.rank : null; };

// ── verification: the roads replayed through the engine; the claim (the page's S.stars) can only lower a level ──
function verify(day, name, roadsTxt, claimed) {
  const roads = CLI.readRoads(roadsTxt); let r;
  try { r = CLI.playDay(name, day, roads); } finally { CLI.unpinDay(); }
  const targets = new Array(LG.LEVELS).fill(null), starsBy = []; let closed = 0, stars = 0;
  for (const l of r.levels) {
    const c = Array.isArray(claimed) && claimed[l.n - 1] != null && Number.isFinite(+claimed[l.n - 1]) ? Math.max(0, Math.min(3, Math.floor(+claimed[l.n - 1]))) : null;
    const st = c == null ? l.stars : Math.min(l.stars, c); starsBy.push(st); stars += st;
    if (st > 0) { closed++; targets[l.n - 1] = l.at; }   // the cell the level closed on: under SHIFT, wherever the target was caught
  }
  const got = targets.filter(t => t != null), words = got.map(t => D.cells[t].w), txt = words.join(' '), lineCell = F.letterSum(txt) % 257, seal = LV.seal(got);
  return { name: r.name, closed, stars, starsBy, lost: r.lost, reborn: r.reborn, targets, glyphs: LG.glyphsOf(targets, F).join(' '), seal: { cell: seal.cell, word: seal.word }, line: { cell: lineCell, word: D.cells[lineCell].w } };
}

// ── http ──
const hits = new Map();   // address → the times of its posts in the last day
function ipOf(req) { const cf = req.headers['cf-connecting-ip'], xf = req.headers['x-forwarded-for']; return (cf && String(cf).trim()) || (xf && String(xf).split(',')[0].trim()) || req.socket.remoteAddress || '?'; }
function allow(ip) {
  if (!opt.rate) return true; const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 86400000);
  if (list.length >= RATE_DAY || (list.length && now - list[list.length - 1] < RATE_GAP)) { hits.set(ip, list); return false; }
  list.push(now); hits.set(ip, list); return true;
}
function send(res, code, obj) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (opt.cors) { headers['Access-Control-Allow-Origin'] = '*'; headers['Access-Control-Allow-Headers'] = 'content-type, authorization'; headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS'; }
  res.writeHead(code, headers); res.end(JSON.stringify(obj));
}
function body(req) {   // the body read whole (16 KB at most; an oversize post is drained and answered, not cut off) and parsed as JSON
  return new Promise((resolve, reject) => {
    let size = 0, over = false; const chunks = [];
    req.on('data', c => { size += c.length; if (over) return; if (size > BODY_MAX) { over = true; chunks.length = 0; return; } chunks.push(c); });
    req.on('end', () => { if (over) return reject(Object.assign(new Error('the post is too large: 16 KB at most'), { code: 413 })); try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { reject(Object.assign(new Error('the post is not JSON'), { code: 400 })); } });
    req.on('error', reject);
  });
}
async function handlePost(req, res) {
  const ip = ipOf(req); if (!allow(ip)) return send(res, 429, { error: 'the ledger asks for a pause: one post every ten seconds, sixty a day' });
  let b; try { b = await body(req); } catch (e) { return send(res, e.code || 400, { error: e.message }); }
  if (!b || typeof b !== 'object') return send(res, 400, { error: 'the post is not an object' });
  const day = Number.isInteger(b.day) ? b.day : NaN; if (!Number.isInteger(day) || Math.abs(day - today()) > DAY_SLACK) return send(res, 400, { error: 'the ledger takes today, give or take a day or two (day ' + today() + ' here)' });
  const name = LG.cleanName(b.name), msg = LG.cleanMsg(b.msg), league = LG.league(b.league), t = Date.now();
  if (typeof b.roads === 'string' && b.roads.trim()) {
    const roads = b.roads.slice(0, ROADS_MAX); let v;
    try { v = verify(day, name, roads, b.stars); } catch (e) { return send(res, 400, { error: 'the roads do not read: ' + e.message }); }
    if (!v.closed) return send(res, 400, { error: 'no level closes by these roads: nothing to seal' });
    const prev = [...entries.values()].find(e => e.kind === 'seal' && e.day === day && e.name === v.name);
    if (prev && prev.stars > v.stars) return send(res, 409, { error: 'the ledger holds ' + v.name + '\'s day already, with ' + prev.stars + ' stars; a day as good or better replaces it', entry: Object.assign({}, prev, { rank: rankOf(day, prev.id) }) });
    const entry = Object.assign({ id: newId(), t, kind: 'seal', day, date: LG.dateOf(day), league, msg, roads }, v); if (prev) entry.replaces = prev.id;
    append(entry); if (prev) entries.delete(prev.id); entries.set(entry.id, entry);
    return send(res, prev ? 200 : 201, { entry: Object.assign({}, entry, { rank: rankOf(day, entry.id) }), replaced: !!prev });
  }
  if (!msg) return send(res, 400, { error: 'a note needs words, a seal needs roads' });
  const entry = { id: newId(), t, kind: 'note', day, date: LG.dateOf(day), name, league, msg }; append(entry); entries.set(entry.id, entry);
  return send(res, 201, { entry });
}
function handleDelete(req, res, id) {
  const auth = String(req.headers.authorization || ''); if (!opt.admin || auth !== 'Bearer ' + opt.admin) return send(res, 403, { error: 'the ledger strikes an entry only for its keeper' });
  if (!entries.has(id)) return send(res, 404, { error: 'no such entry' });
  append({ del: id, t: Date.now() }); entries.delete(id); return send(res, 200, { struck: id });
}
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.css': 'text/css; charset=utf-8', '.ico': 'image/x-icon' };
// the game's folder as static files, for a desk or a LAN: the page, the parts, the demos too (Caddy hides those on the site)
function serveStatic(req, res, pathname) {
  let p; try { p = decodeURIComponent(pathname); } catch (e) { res.writeHead(400); return res.end(); }
  let file = path.normalize(path.join(AR, p)); if (file !== AR && !file.startsWith(AR + path.sep)) { res.writeHead(404); return res.end('not found'); }
  try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); const data = fs.readFileSync(file); res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Content-Length': data.length }); res.end(data); }
  catch (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found'); }
}
const server = http.createServer(async (req, res) => {
  const t0 = Date.now(), u = new URL(req.url, 'http://x'), p = u.pathname;
  res.on('finish', () => console.log(new Date().toISOString() + ' ' + req.method + ' ' + p + ' ' + res.statusCode + ' ' + (Date.now() - t0) + 'ms'));
  try {
    if (req.method === 'OPTIONS' && opt.cors) return send(res, 204, {});
    if (p === '/ledger/health') return send(res, 200, { ok: true, entries: entries.size, today: today(), date: LG.dateOf(today()) });
    const m = /^\/ledger(?:\/([^/]*))?\/?$/.exec(p);
    if (m) {
      if (req.method === 'GET') { const day = m[1] == null || m[1] === '' ? today() : /^\d{1,6}$/.test(m[1]) ? +m[1] : null; if (day == null) return send(res, 404, { error: 'a day is a number' }); return send(res, 200, view(day)); }
      if (req.method === 'POST' && !m[1]) return handlePost(req, res);
      if (req.method === 'DELETE' && m[1]) return handleDelete(req, res, m[1]);
      return send(res, 405, { error: 'GET a day, POST a seal or a note, DELETE as the keeper' });
    }
    if (opt.static && (req.method === 'GET' || req.method === 'HEAD')) return serveStatic(req, res, p);
    return send(res, 404, { error: 'the ledger is at /ledger' });
  } catch (e) { console.error(e); return send(res, 500, { error: 'the ledger stumbled: ' + e.message }); }
});
const n = load();
server.listen(opt.port, opt.host, () => { const a = server.address(); console.log('THE LEDGER listening http://' + (a.address.includes(':') ? '[' + a.address + ']' : a.address) + ':' + a.port + '/ledger · ' + n + ' entries in ' + opt.data + (opt.static ? ' · the game at /' : '') + (opt.cors ? ' · CORS open' : '') + (opt.rate ? '' : ' · no rate limit')); });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { server.close(); process.exit(0); });
