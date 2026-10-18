// THE FOLD — proves story.js against data.js and field.js. Run from anywhere: node parts/story/check.js
// Asserts: every chapter epigraph is a word of its cell; every key of cells[] and doors[] is a cell (257 the open point);
// every word in capitals in a voice is one of that cell's own words; every "dlog N / inverse N / fold N / Γ N / ×i N / ×g N"
// and every "… of N" in a voice is true of that cell; every entry of facts[] recomputes; every letter sum in sums[] is right;
// the word limits hold; no exclamation mark anywhere; days[] covers the ten opcodes; ops[] the six moves and undo; every cell's
// glyphs are whole code points, two a cell.
'use strict';
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..');
global.window = global;
for (const f of ['data.js', 'field.js', path.join('parts', 'story', 'story.js')]) eval(fs.readFileSync(path.join(root, f), 'utf8'));
const D = window.CASCADE_DATA, F = window.FIELD, S = window.FOLD_STORY;
let n = 0; const fail = (m) => { throw new Error(m); }; const ok = (c, m) => { if (!c) fail(m); n++; };
const INF = 257, show = v => v === INF ? '∞' : v;
const wordsOf = c => c === INF ? [] : D.cells[c].ws;
const words = new Set(D.cells.flatMap(c => c.ws));
// capitals: maximal runs of A–Z with inner spaces, hyphens or digits (COS 0, CARBON Z, SELF-FOLD), two letters or more
const caps = s => (s.match(/[A-Z][A-Z0-9'\-]*(?: [A-Z0-9][A-Z0-9'\-]*)*/g) || []).filter(w => w.replace(/[^A-Z]/g, '').length >= 2);
const noBang = (s, where) => ok(!/!/.test(s), 'exclamation mark in ' + where);
const wc = s => s.trim().split(/\s+/).length;
// chapters
ok(S.chapters.length === 8, 'eight chapters');
S.chapters.forEach((ch, i) => {
  const e = ch.epigraph; ok(Number.isInteger(e.cell) && e.cell >= 0 && e.cell <= 256, 'epigraph cell ' + i);
  ok(wordsOf(e.cell).includes(e.text), 'epigraph "' + e.text + '" is not a word of cell ' + e.cell);
  ok(wc(ch.intro) <= 60, 'intro ' + (i + 1) + ' over 60 words: ' + wc(ch.intro)); ok(wc(ch.outro) <= 40, 'outro ' + (i + 1) + ' over 40 words: ' + wc(ch.outro));
  noBang(ch.title + ch.intro + ch.outro, 'chapter ' + (i + 1));
});
// days
for (let d = 0; d <= 9; d++) { const y = S.days[d]; ok(y && y.name === F.OPCODES[d], 'day ' + d + ' is ' + F.OPCODES[d]); ok(wc(y.line) <= 25, 'day ' + d + ' line over 25 words'); noBang(y.line, 'day ' + d); }
// ops
for (const o of F.OPS) ok(typeof S.ops[o.id] === 'string' && wc(S.ops[o.id]) >= 6 && wc(S.ops[o.id]) <= 12, 'ops.' + o.id + ' 6–12 words');
ok(typeof S.ops.undo === 'string', 'ops.undo'); Object.values(S.ops).forEach(s => noBang(s, 'ops'));
// titles, seal
ok(S.titles.length === 12 && S.titles.every(t => /\{(start|target|startWord|targetWord)\}/.test(t)), 'twelve titles with placeholders');
ok(['{word}', '{cell}', '{mirror}', '{stars}'].every(p => S.seal.includes(p)), 'seal placeholders'); noBang(S.seal, 'seal');
// voices and doors: words and numbers
function voice(cell, text, where) {
  noBang(text, where); ok(wc(text) <= 20 || where.startsWith('door'), where + ' over 20 words: ' + wc(text));
  for (const w of caps(text)) ok(wordsOf(cell).includes(w), where + ': "' + w + '" is not a word of cell ' + show(cell));
  const map = { dlog: v => F.dlog(v), inverse: v => F.inv(v), fold: v => F.fold(v), 'Γ': v => F.gamma(v), '×i': v => F.mul(v, 16), '×g': v => F.mul(v, 3) };
  for (const [k, f] of Object.entries(map)) {
    const re = new RegExp('(?:^|[^\\w])' + k.replace(/[×Γ]/g, c => c) + ' (of )?(\\d+)', 'g'); let m;
    while ((m = re.exec(text))) { const v = +m[2]; if (m[1]) ok(f(v) === cell, where + ': ' + k + ' of ' + v + ' is ' + show(f(v)) + ', not ' + show(cell)); else ok(f(cell) === v, where + ': ' + k + ' ' + v + ' but the field says ' + show(f(cell))); }
  }
}
let voiced = 0;
for (const [k, text] of Object.entries(S.cells)) { const c = +k; ok(Number.isInteger(c) && c >= 0 && c <= 257, 'cell key ' + k); voice(c, text, 'cell ' + k); voiced++; }
ok(voiced >= 60 && S.cells[257], voiced + ' voices with the open point');
for (const [k, d] of Object.entries(S.doors)) { ok(F.kaprekar(+k) === 6174, 'door ' + k + ' steps to 6174'); ok(+k % 257 === d.cell, 'door ' + k + ' reads as ' + d.cell); voice(d.cell, d.text, 'door ' + k); }
// facts
const pow = (b, e) => { let r = 1; for (let i = 0; i < e; i++) r = r * b % 257; return r; };
for (const f of S.facts) {
  const [k, ...a] = f; const want = a[a.length - 1];
  const got = {
    gamma: () => F.gamma(a[0]), inv: () => F.inv(a[0]), fold: () => F.fold(a[0]), mul: () => F.mul(a[0], a[1]), mod: () => a[0] % 257, sq: () => a[0] * a[0] % 257,
    pow: () => pow(a[0], a[1]), pow3: () => pow(3, a[0]), kaprekar: () => F.kaprekar(a[0]), letters: () => F.letterSum(a[0]), mirror: () => F.atbash(a[0]),
    order: () => { let x = a[0], k = 1; while (x !== 1) { x = x * a[0] % 257; k++; } return k; },
    base12: () => parseInt(a[0].toString(12), 10),
    gammaOrder: () => { let k = 0, same = false; for (k = 1; k <= 512 && !same; k++) { same = true; for (let z = 0; z <= 257; z++) { let v = z; for (let j = 0; j < k; j++) v = F.gamma(v); if (v !== z) { same = false; break; } } if (same) return k; } return -1; },
    gammaOrbits: () => { const seen = new Set(); const sizes = []; for (let z = 0; z <= 257; z++) { if (seen.has(z)) continue; let v = z, s = 0; do { seen.add(v); v = F.gamma(v); s++; } while (v !== z); sizes.push(s); } const big = sizes.filter(s => s === a[1]).length; const fixed = sizes.filter(s => s === 1).length; return big === a[0] && fixed === 2 && sizes.length === a[0] + 2 ? a[1] : -1; },
    ladder: () => { const L = a[0]; for (let i = 1; i < L.length; i++) if (F.mul(L[i - 1], 129) !== L[i]) return -1; return L; },
    gold: () => { const g = a[0]; return g.every(x => F.mul(F.mul(F.mul(F.mul(x, 16), 16), 16), 16) === x && g.includes(F.mul(x, 16))) ? g : -1; },
    kaprekarAll: () => { let worst = 0; for (let x = 0; x <= 9999; x++) { const s = String(x).padStart(4, '0'); if (/^(\d)\1{3}$/.test(s)) continue; let v = x, k = 0; while (v !== 6174) { v = F.kaprekar(v); k++; if (k > 20) return -1; } worst = Math.max(worst, k); } return worst; },
    maxPar: () => { let worst = 0; for (let s = 0; s <= 257; s++) for (let t = 0; t <= 257; t++) { const p = F.solve(s, t); if (!p) return -1; worst = Math.max(worst, p.length); } return worst; },
    seedMoves: () => { const r = {}; for (const o of F.OPS) r[o.id] = o.f(0); return (r.g === 0 && r.ig === 0 && r.fold === 0 && r.i === 0 && r.inv === INF && r.gam === 256) ? 0 : -1; },
  }[k];
  ok(got, 'unknown fact kind ' + k); const v = got(); ok(JSON.stringify(v) === JSON.stringify(want), 'fact ' + JSON.stringify(f) + ' recomputes to ' + JSON.stringify(v));
}
// glyphs: sixteen of one code point each (𝟙 takes two UTF-16 units), so a cell writes two code points, 256 three, ∞ one, none cut in half
ok(F.G16.length === 16 && F.G16.every(g => Array.from(g).length === 1), 'G16 is sixteen glyphs of one code point each');
for (let c = 0; c <= INF; c++) { const g = F.glyphs(c), k = c === INF ? 1 : c === 256 ? 3 : 2; ok(Array.from(g).length === k && !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(g), 'glyphs(' + show(c) + ') ' + JSON.stringify(g) + ' is not ' + k + ' whole code points'); }
// letter sums
for (const [w, s] of Object.entries(S.sums)) ok(F.letterSum(w) === s, 'letter sum of ' + w + ' is ' + F.letterSum(w) + ', not ' + s);
for (const [w] of Object.entries(S.sums)) ok(words.has(w), w + ' is on the tablet');
console.log('story check: ' + n + ' assertions, all true; ' + voiced + ' voices, ' + S.chapters.length + ' chapters, ' + Object.keys(S.doors).length + ' doors, ' + S.facts.length + ' facts, ' + Object.keys(S.sums).length + ' letter sums');
