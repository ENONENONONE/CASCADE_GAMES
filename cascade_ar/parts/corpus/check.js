// THE FOLD — parts/corpus/check.js: parses material.js and data.js under node, re-adds every letter sum the catalogue cites
// (A = 1 … Z = 26), recomputes the chains and rules, keeps the tablet's two name-words out of the game, holds index.html's scripts to
// sw.js's SHELL, and says what failed. Run: node check.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const here = __dirname, root = path.join(here, '..', '..');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(here, 'material.js'), 'utf8'), ctx, { filename: 'material.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), ctx, { filename: 'data.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'field.js'), 'utf8'), ctx, { filename: 'field.js' });
const M = ctx.window.FOLD_MATERIAL, D = ctx.window.CASCADE_DATA, FD = ctx.window.FIELD, P = 257;
let fails = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fails++; console.log('FAIL', msg); } };
const S = w => { let t = 0; for (const ch of w.toUpperCase()) { const c = ch.charCodeAt(0) - 64; if (c >= 1 && c <= 26) t += c; } return t; };
const K = w => (w.toUpperCase().match(/[A-Z]/g) || []).length;
const at = (w, n) => D.cells[((n % P) + P) % P].ws.includes(w);
const POW = [], DLOG = new Array(P).fill(-1); { let x = 1; for (let k = 0; k < 256; k++) { POW[k] = x; DLOG[x] = k; x = x * 3 % P; } }
const inv = n => POW[(256 - DLOG[n]) % 256], gam = z => { if (z === Infinity) return 1; const d = (z + 120) % P; if (d === 0) return Infinity; return ((z - 120 + P) % P) * inv(d) % P; };
ok(M && typeof M === 'object', 'FOLD_MATERIAL parses'); ok(D && D.cells.length === 257, 'data.js parses');
// letter sums: every word the catalogue cites with a cell
for (const e of M.mirror_chain) { ok(S(e.word) === e.sum, 'sum ' + e.word); ok(K(e.word) === e.k, 'k ' + e.word); ok(at(e.word, e.cell), e.word + ' on the tablet at ' + e.cell); ok(((27 * e.k - e.sum) % P + P) % P === M.mirror_chain[(M.mirror_chain.indexOf(e) + 1) % 10].cell, 'mirror of ' + e.word); }
for (const [w, v] of Object.entries(M.word_sums)) { ok(S(w) === v, 'sum ' + w); if (!['OUROBOROS', 'TUNING FORK'].includes(w)) ok(at(w, v), w + ' at ' + v); }
for (const [w, c] of M.drive_words) { ok(S(w) % P === c, 'drive ' + w); ok(at(w, c), w + ' at ' + c); }
for (const [w, v] of Object.entries(M.atbash.self_mirrors)) { ok(S(w) === v && 27 * K(w) - S(w) === v, 'self-mirror ' + w); ok(at(w, v), w + ' at ' + v); }
for (const [c, w] of M.kaprekar_families.outer.concat(M.kaprekar_families.inner)) ok(at(w, c), 'family word ' + w + ' at ' + c);
for (const [nm, a, b, c, w] of M.intervals) ok(a * inv(b % P) % P === c && at(w, c), 'interval ' + nm);
for (const [nm, v, c, w] of M.bridges) ok(v % P === c && at(w, c), 'bridge ' + nm);
for (const [k, [v, c, w]] of Object.entries(M.voynich)) ok(v % P === c && at(w, c), 'voynich ' + k);
// the turn
{ const { c, s, u, orbit16 } = M.turn; ok(c * 5 % P === 4 && s * 5 % P === 3 && (c * c + s * s) % P === 1, 'turn 4/5 3/5'); ok((c + 16 * s) % P === u && DLOG[u] % 2 === 1, 'u = 216 a generator');
  let x = 1, y = 0, n = 0; for (;;) { x = ((c * x - s * y) % P + P) % P; y = (s * x + c * y) % P; /* placeholder */ break; }
  x = 1; y = 0; const pts = [[1, 0]]; for (let i = 0; i < 256; i++) { const nx = ((c * x - s * y) % P + P) % P, ny = (s * x + c * y) % P; x = nx; y = ny; if (x === 1 && y === 0) break; pts.push([x, y]); }
  ok(pts.length === 256, 'orbit of 256'); ok(JSON.stringify(pts.slice(0, 16)) === JSON.stringify(orbit16), 'orbit16'); }
// doors
const kap = n => { const a = String(n).padStart(4, '0').split('').sort(); return +a.slice().reverse().join('') - +a.join(''); };
for (const [door, sp] of Object.entries(M.doors.spines)) { for (let i = 0; i + 1 < sp.length; i++) ok(kap(sp[i]) === sp[i + 1], 'spine ' + door + ' step ' + i); ok(sp[sp.length - 1] === 6174, 'spine ends 6174'); ok(sp[sp.length - 2] === +door, 'door ' + door); ok(JSON.stringify(sp.map(v => v % P)) === JSON.stringify(M.doors.spine_cells[door]), 'spine cells ' + door); }
ok(kap(M.doors.sub_thousand_door) === 6174, '0062'); ok(M.doors.seed_2357.length === 8 && kap(2357) === 5175, '2357 seven steps'); ok(JSON.stringify(M.doors.year_2000) === JSON.stringify([2000, 1998, 8082, 8532, 6174]), '2000'); ok(JSON.stringify(M.doors.day_9384) === JSON.stringify([9384, 6354, 3087, 8352, 6174]), '9384');
// tunnel, ladders, staircase, gamma, flip, order 4, halts, matrix, pisano
{ const t = M.tunnel.cells; ok(t[1] === t[0] * 140 % P && t[2] === (P - t[1]) % P && t[3] === t[2] * 2 % P && t[4] === t[3] * 87 % P && t[4] === 55, 'tunnel chain'); ok(M.tunnel.glyphs.join() === t.map(FD.glyphs).join(), 'tunnel glyphs are its cells\' own'); }
for (const [k, L] of Object.entries(M.ladders)) { ok(L.length === 16 && L[0] === +k, 'ladder ' + k); for (let i = 0; i < 16; i++) ok(L[(i + 1) % 16] === L[i] * 129 % P, 'ladder ' + k + ' rung ' + i); }
ok(M.five_staircase.first.every((v, i) => v === POW[55 * i % 256]), 'staircase'); ok(POW[55 * 33 % 256] === 237 && POW[55 * 34 % 256] === 157, '5^33, 5^34');
{ const o = M.gamma.orbit_of_1_first16; for (let i = 0; i + 1 < o.length; i++) ok(gam(o[i]) === o[i + 1], 'Γ orbit step ' + i); ok(gam(46) === 46 && gam(92) === 92 && gam(120) === 0 && gam(137) === Infinity, 'Γ fixed, zero, pole'); let z = 1; for (let i = 0; i < 128; i++) z = gam(z); ok(z === 1, 'Γ order 128'); }
{ const flip = n => +String(n).replace(/6/g, '#').replace(/9/g, '6').replace(/#/g, '9'); const all = []; for (let n = 0; n < P; n++) if (flip(n) !== n) all.push(n); ok(all.length === M.flip69.cells_with_6_or_9, '83 flip cells'); ok(all.filter(n => flip(n) < P).length === M.flip69.inside_field, '82 inside'); ok(all.filter(n => flip(n) < P && gam(n) === flip(n)).join() === '36', 'flip = Γ at 36'); }
ok(M.order4.every(n => n * n % P === 1 || n * n % P === 256), 'order 4'); ok(16 * 16 % P === 256, 'i² = −1');
ok(M.halt_points.every(n => D.pi[n] === '9') && M.halt_points.length === 27, 'halt points'); ok(M.halt_points.reduce((a, b) => a + b, 0) % P === 11, 'halt sum 11');
{ const T = d => { const k2 = (2 * d + 1) * 180 % P; return [[(2 - k2 + P) % P, P - 1], [1, 0]]; }; const mm = (A, B) => [[(A[0][0] * B[0][0] + A[0][1] * B[1][0]) % P, (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % P], [(A[1][0] * B[0][0] + A[1][1] * B[1][0]) % P, (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % P]];
  let Mx = [[1, 0], [0, 1]]; const tr = {}; for (let n = 0; n <= 257; n++) { Mx = mm(Mx, T(+D.pi[n])); if (n === 83 || n === 256 || n === 257) tr['M' + n] = (Mx[0][0] + Mx[1][1]) % P; } ok(JSON.stringify(tr) === JSON.stringify(M.transfer_matrix.traces), 'transfer traces'); }
{ const F = [0, 1]; while (F.length < 520) F.push((F[F.length - 1] + F[F.length - 2]) % P); ok(F[129] === 0 && F[516] === 0 && F[517] === 1 && F[128] === 241, 'Pisano'); }
// days: gold, tablet, poles, 64.1°, the day of 2026-09-10
const EPOCH = Date.UTC(2000, 11, 31), day = s => Math.round((Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) - EPOCH) / 86400000);
for (const [d, n, cell, f, w] of M.days.gold_2026_2027) ok(day(d) === n && n % 66048 === cell && cell % 128 === 0 && n % P === f && at(w, f), 'gold day ' + d);
for (const [d, n, cell, f, pos] of M.days.tablet_2026_2027) ok(day(d) === n && cell % 258 === 0 && n % P === f && POW[55 * (cell / 258) % 256] === pos, 'tablet day ' + d);
{ let found = 0; for (let n = day('2026-01-01'); n <= day('2027-12-31'); n++) if (n % 128 === 0) found++; ok(found === M.days.gold_2026_2027.length, 'every gold day listed'); }
const mod = (n, m) => ((n % m) + m) % m; for (const [d, f] of M.days.poles.slice(1)) ok(mod(day(d), 66048) === 0 && mod(day(d), P) === f, 'pole ' + d);
ok(at('CHAI', 18) && at('SODIUM D LINE', 75), 'CHAI at 18 and SODIUM D LINE at 75 by value'); ok(day('2026-09-10') === 9384 && 9384 % P === 132 && D.pi[9397] === '6', 'day 9384'); ok(day('2085-10-06') === 30960 && 34830 * DLOG[120] % 66048 === 30960, 'day 30960'); ok(day('2056-08-03') === 20304 && 20304 === 141 * 144, 'I AM day');
for (const [d, n, f] of M.sun_at_prague.dates_1420_julian) { const g = d === '1420-04-26 J' ? '1420-05-05' : '1420-08-08'; ok(day(g) === n && ((n % P) + P) % P === f, '64.1° ' + d); }
// norm stars, discs, descent, doublings
{ const N = (a, b) => ((a * a + a * b - b * b) % P + P) % P; ok(M.norm_stars.stars.map(s => N(...s)).join() === M.norm_stars.norms.join(), 'star norms'); ok(103 * 5 % P === 1, '103 = 1/5'); }
ok(M.ten_discs.cells.every((v, i) => v === POW[M.ten_discs.dlogs[i]]) && M.ten_discs.cells.reduce((a, b) => (a + b) % P, 0) === 30, 'ten discs');
ok(M.square_descent.every((v, i) => v === ((16 - i) * (16 - i)) % P), 'descent'); ok(M.doublings_from_128.every((v, i) => v === 128 * Math.pow(2, i) % P) && M.doublings_from_128[16] === 128, 'doublings');
// a few sums the catalogue types by hand
for (const [w, v] of [['TRUTH', 87], ['JAMES', 48], ['WHO AM I', 69], ['MIRROR SHIELD', 148], ['EVENING STAR', 134], ['MARCI', 44], ['PRAHA', 44], ['KIRCHER', 72], ['TEPENEC', 68], ['DUCATS', 68], ['JACOBUS', 71], ['TYCHO', 71], ['HORCICKY', 92], ['JOHANNES KEPLER', 153], ['RUDOLF', 76], ['VENUS', 81], ['RED', 27], ['RED STAR', 85], ['RED CENTRE', 92], ['RED DOT', 66], ['THRICE GREAT', 114], ['I AM THAT I AM', 95], ['EHYEH', 51], ['ASHER', 51], ['AS ABOVE', 65], ['SO BELOW', 91], ['ELOHIM', 62], ['YHVH', 63], ['GOD', 26], ['I AM', 23], ['LOVE', 54], ['TERM', 56], ['LIMIT', 63], ['BOUNDARY MARKER', 166], ['JUPITER TERMINUS', 218], ['ESTHER', 75], ['RAMSES', 75], ['SPARTA', 75], ['BARYON', 75], ['JEFFREY', 75], ['SHIFT', 62], ['ANTIPROTON', 142], ['CAIN', 27], ['PREDESTINATION', 169], ['SUPERPOSITION', 196], ['HORUS', 81], ['BOLTZMANN CONSTANT', 223], ['SHAKESPEARE', 108], ['CONSERVATION OF ENERGY', 250], ['PRESERVATION', 162], ['ALIEN', 41], ['IDENTITY', 106], ['TUNING FORK', 135], ['EMERALD TABLET', 118], ['CASCADE', 36], ['TIKKUN', 86], ['SATURN', 93], ['WELL TEMPERED CLAVIER', 208], ['PYTHAGORAS', 130], ['CHRONOS', 92], ['NAKAMOTO', 90], ['SPIRIT', 91]]) ok(S(w) === v, 'typed sum ' + w + ' = ' + v);
ok(gam(27) === 120 && gam(45) === 93 && gam(57) === 4 && gam(119) === 100 && gam(74) === 66 && gam(103) === 129 && gam(63) === 164 && gam(66) === 8, 'Γ values typed in the catalogue');
ok(79 * 244 % P === 1 && 63 * 63 % P === 114 && 56 * 179 % P === 1 && 46 * 95 % P === 1 && 103 * 63 % P === 64 && 45 * 12 % P === 26 && 150 * 12 % P === 1 && 47 * 93 % P === 2 && 153 * 153 % P === 22 && 117 * 117 % P === 68 && 62 * 228 % P === 1, 'products typed in the catalogue');
ok(POW[57] === 45 && DLOG[216] === 147 && DLOG[153] === 122 && DLOG[134] === 148 && DLOG[5] === 55, 'dlogs typed in the catalogue');
// the name-words: the tablet's two (44's first word, 62's third) are known here by a hash only, so this check names them nowhere; none
// stands in data.js, material.js or any text file of the game, alone or inside an entry
{ const crypto = require('crypto'), NAMES = new Set(['77a741f7c013d0df', '9439168d7d5375d6']), hash = w => crypto.createHash('sha256').update(w).digest('hex').slice(0, 16);
  const named = s => [...new Set(s.toUpperCase().match(/[A-Z]+/g) || [])].some(w => NAMES.has(hash(w)));
  for (const c of D.cells) ok(!c.ws.some(named), 'a name-word among the words of cell ' + c.n); ok(!D.mirrors.some(p => p.some(named)), 'a name-word in a mirror pair');
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'vendor' ? [] : walk(path.join(d, e.name))) : /\.(js|html|md|json|svg|webmanifest)$/.test(e.name) ? [path.join(d, e.name)] : []);
  for (const f of walk(root)) ok(!named(fs.readFileSync(f, 'utf8')), 'a name-word in ' + path.relative(root, f)); }
ok(D.cells[44].w === 'SPACE' && D.cells[62].w === 'FIBONACCI' && D.cells[70].w === 'LILITH', 'first words 44 SPACE, 62 FIBONACCI, 70 LILITH');
for (const [c, w] of M.kaprekar_families.outer.concat(M.kaprekar_families.inner)) ok(D.cells[c].w === w, 'family word ' + w + ' is not the first word of ' + c);
ok(M.tablet_entries === D.entries && D.entries === D.cells.reduce((a, c) => a + c.ws.length, 0), 'tablet_entries ' + M.tablet_entries + ' = data.js entries ' + D.entries);
ok(M.atbash.mirror_pairs_on_tablet === D.mirrors.length, 'mirror_pairs_on_tablet ' + M.atbash.mirror_pairs_on_tablet + ' = data.js mirrors ' + D.mirrors.length);
// the shell: index.html's scripts are SHELL's .js entries, every SHELL path exists, and no node check is served
{ const shell = JSON.parse(fs.readFileSync(path.join(root, 'sw.js'), 'utf8').match(/const SHELL = (\[[^\]]*\]);/)[1].replace(/'/g, '"')), js = shell.filter(u => u.endsWith('.js')).map(u => u.replace(/^\.\//, ''));
  const srcs = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  ok(srcs.slice().sort().join() === js.slice().sort().join(), 'index.html loads ' + srcs.length + ' scripts, SHELL caches ' + js.length + ' .js files: ' + srcs.filter(u => !js.includes(u)).concat(js.filter(u => !srcs.includes(u))).join(' '));
  for (const u of shell) ok(fs.existsSync(path.join(root, u)), 'SHELL path ' + u + ' is missing'); ok(!shell.some(u => /(check|test)\.js$/.test(u)), 'a node check in SHELL'); }
console.log(fails ? 'FAILED ' + fails + ' of ' + checks : 'OK · ' + checks + ' checks, none failed · material.js ' + fs.statSync(path.join(here, 'material.js')).size + ' bytes · tablet ' + M.tablet_entries + ' entries');
process.exit(fails ? 1 : 0);
