// THE FOLD — the field GF(257) as the game knows it. Every rule here is the corpus's own: g = 3 generates the 256 nonzero cells,
// the fold is n → 257 − n, the inverse n → n⁻¹, the quarter turn is ×16 = ×i, and Γ is the reflection (Z − 120)/(Z + 120) over the
// projective line of 258 points, the point at infinity carried as cell 257. The tablet gives every cell its words; the π tape gives
// every day its opcode. Nothing is drawn here; ar.js draws, game.js plays.
window.FIELD = (function () {
  'use strict';
  const P = 257, INF = 257;
  const DLOG = new Array(P).fill(-1), POW = new Array(256);
  { let x = 1; for (let k = 0; k < 256; k++) { POW[k] = x; DLOG[x] = k; x = x * 3 % P; } }
  const G16 = Array.from('Φ∂φ∞⊟⊗♯⅗εδΩΓQΣψ𝟙');   // by code point: 𝟙 is two UTF-16 units, so a string index would cut it in half
  const OPCODES = ['NOP', 'IDENT', 'EXIST', 'SEED', 'SHIFT', 'STORE', 'FOLD', 'JUMP', 'SYNC', 'HALT'];
  const inv = n => n === 0 ? INF : n === INF ? 0 : POW[(256 - DLOG[n]) % 256];
  const mul = (a, b) => (a === INF || b === INF) ? INF : a * b % P;
  const fold = n => n === INF ? INF : (P - n) % P;
  const gamma = z => { if (z === INF) return 1; const d = (z + 120) % P; if (d === 0) return INF; return ((z - 120 + P) % P) * inv(d) % P; };
  // Γ⁻¹: w = (Z − 120)/(Z + 120) gives Z = 120(1 + w)/(1 − w); w = 1 is ∞, w = ∞ is 137, the pole
  const gammaInv = w => { if (w === INF) return 137; if (w === 1) return INF; return 120 * (1 + w) % P * inv((1 - w + P) % P) % P; };
  const glyphs = n => n === INF ? '∞' : n === 256 ? '∂ΦΦ' : G16[n >> 4] + G16[n & 15];
  const ray = n => (n === 0 || n === INF) ? -1 : DLOG[n] % 12;
  const dlog = n => (n === 0 || n === INF) ? -1 : DLOG[n];
  const walkCell = n => (n === 0 || n === INF) ? 0 : (34830 * DLOG[n]) % 66048;
  const character = n => (n === 0 || n === INF) ? 'seed' : DLOG[n] % 2 ? 'non-residue' : 'residue';
  // the six moves a player can make; each is a bijection of the 258 points
  const OPS = [
    { id: 'g', label: '×g', name: 'the generator', tell: 'dlog + 1: one step round the cycle', f: n => mul(n, 3), hue: 140 },
    { id: 'ig', label: '÷g', name: 'the generator back', tell: 'dlog − 1: one step back', f: n => mul(n, 86), hue: 170 },
    { id: 'fold', label: 'FOLD', name: 'the fold', tell: '257 − n: dlog + 128, the far side', f: fold, hue: 45 },
    { id: 'inv', label: 'INV', name: 'the inverse', tell: 'n⁻¹: dlog negated, the mirror', f: inv, hue: 200 },
    { id: 'i', label: '×i', name: 'the quarter turn', tell: '×16: dlog + 192, a quarter round', f: n => mul(n, 16), hue: 280 },
    { id: 'gam', label: 'Γ', name: 'the reflection', tell: '(Z − 120)/(Z + 120): the Möbius turn, ×153 in w', f: gamma, hue: 0 },
  ];
  // the 6 ↔ 9 flip: the digits of the cell's number turned, 6 for 9 and 9 for 6; an involution where it lands inside the field, else the
  // cell stays; Γ never crosses its two sides; the flip crosses for 36 of the 82 cells it moves (it equals Γ only at 36 → 39)
  const flip69 = n => { if (n === INF) return n; const m = +String(n).replace(/[69]/g, d => d === '6' ? '9' : '6'); return m <= 256 ? m : n; };
  const FLIP = { id: 'flip', label: '6↔9', name: 'the flip', tell: '6 for 9 and 9 for 6 in the number: Γ never crosses its two sides; the flip crosses for 36 of the 82 cells it moves', f: flip69, hue: 320 };
  const OP = Object.fromEntries(OPS.concat([FLIP]).map(o => [o.id, o]));
  // shortest road from s to t, free ops costing nothing (0-1 BFS over 258 points); returns the op ids, or null
  function solve(s, t, free, ops) {
    free = free || new Set(); ops = ops || OPS; if (s === t) return [];
    const dist = new Array(258).fill(Infinity), via = new Array(258).fill(null), dq = [s]; dist[s] = 0;
    while (dq.length) {
      const u = dq.shift();
      for (const o of ops) {
        const v = o.f(u), c = free.has(o.id) ? 0 : 1;
        if (dist[u] + c < dist[v]) { dist[v] = dist[u] + c; via[v] = [u, o.id]; c ? dq.push(v) : dq.unshift(v); }
      }
    }
    if (dist[t] === Infinity) return null;
    const path = []; let c = t; while (c !== s) { path.unshift(via[c][1]); c = via[c][0]; } return path;
  }
  const cost = (path, free) => path.reduce((a, id) => a + ((free && free.has(id)) ? 0 : 1), 0);
  // words
  const letterSum = s => { let t = 0; for (const ch of s.toUpperCase()) { const c = ch.charCodeAt(0) - 64; if (c >= 1 && c <= 26) t += c; } return t; };
  const letterCount = s => (s.toUpperCase().match(/[A-Z]/g) || []).length;
  const atbash = s => 27 * letterCount(s) - letterSum(s);   // the mirror of a word of k letters with sum s
  // the tape and the calendar
  const EPOCH = Date.UTC(2000, 11, 31);
  const dayNumber = d => Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH) / 86400000);
  const fourFigures = x => parseInt(String(x).slice(0, 4), 10);
  function kaprekar(x) { const a = String(x).padStart(4, '0').split('').sort(); const hi = +a.slice().reverse().join(''), lo = +a.join(''); return hi - lo; }
  // work: a cheap deterministic 32-bit hash of (seed, cell, step) and its trailing zero bits, Twelve_Rays.html:381–391 as the sketch has
  // them; Math.imul is exact on every engine, so every device agrees. A cell's work bits on a level are zeros(hash32(day, cell, offset))
  function hash32(a, b, c) { let h = (a ^ 0x9E3779B9) >>> 0; h = Math.imul(h ^ b, 0x85EBCA6B) >>> 0; h ^= h >>> 13; h = Math.imul(h ^ c, 0xC2B2AE35) >>> 0; h ^= h >>> 16; h = Math.imul(h, 0x27D4EB2F) >>> 0; h ^= h >>> 15; return h >>> 0; }
  function zeros(h) { if (h === 0) return 32; let n = 0; while ((h & 1) === 0) { h >>>= 1; n++; } return n; }
  return { P, INF, DLOG, POW, G16, OPCODES, OPS, OP, FLIP, flip69, inv, mul, fold, gamma, gammaInv, glyphs, ray, dlog, walkCell, character, solve, cost, letterSum, letterCount, atbash, dayNumber, fourFigures, kaprekar, hash32, zeros };
})();
