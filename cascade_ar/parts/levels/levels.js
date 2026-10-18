// THE FOLD — the level designer's module. The day's 64 levels, the chapter quests, the seal, THE DOORS and FREE WALK, as pure
// functions over FIELD and CASCADE_DATA: plan(day, name) gives the same 64 levels for the same day and name on every device, and
// nothing is kept here. The engine (game.js) plays a spec as it is given: start, target, rule digit, free ops, slack, strict, clock,
// shift and par; title, text and quest are shown; the rest is for the test and the notes.
//
// Eight chapters of eight. The tape levels read the π tape as the engine always has, re-ordered within the chapter so that par rises;
// four chapters hold levels of their own (SPECIAL): the three Kaprekar doors (30, 31, 32), the player's halving ladder (36, 40), the
// Atbash mirror of a word (44, 48) and the eye (56), 137 → ∞ → 1.
window.FOLD_LEVELS = (function () {
  'use strict';
  const F = window.FIELD, D = window.CASCADE_DATA, P = 257, INF = F.INF;
  const RULES = {  // the day's opcode, as game.js reads it (copied so this module stands alone)
    0: { name: 'NOP', tell: 'no rule: the field as it is', burden: 1 },
    1: { name: 'IDENT', tell: 'INV is free: the identity costs nothing', free: 'inv', burden: 0 },
    2: { name: 'EXIST', tell: '×i is free: the quarter turn costs nothing', free: 'i', burden: 0 },
    3: { name: 'SEED', tell: 'the level starts from SEED, cell 0', seed: true, burden: 1 },
    4: { name: 'SHIFT', tell: 'the target steps ×g after every move: catch it where it will be', shift: true, burden: 2 },
    5: { name: 'STORE', tell: 'one move of slack: par + 1 still closes', slack: 1, burden: 0 },
    6: { name: 'FOLD', tell: 'FOLD is free: the far side costs nothing', free: 'fold', burden: 0 },
    7: { name: 'JUMP', tell: 'Γ is free: the reflection costs nothing', free: 'gam', burden: 0 },
    8: { name: 'SYNC', tell: 'no slack: only par closes, one over and the level is lost', strict: true, burden: 3 },
    9: { name: 'HALT', tell: 'the clock runs: thirty seconds', clock: 30, burden: 3 },
  };
  // the special levels sit in the story's chapters: THE DOORS (4) ends on its three doors, THE LADDER (5) climbs twice, THE MIRROR (6)
  // reflects twice, THE EYE (7) ends on the pole; SUNRISE, THE FOLD, THE QUARTER TURN and THE SEAL are the tape's own roads
  const SPECIAL = { 30: 'door', 31: 'door', 32: 'door', 36: 'ladder', 40: 'ladder', 44: 'mirror', 48: 'mirror', 56: 'eye' };
  // a sheet a chapter, the floor the page lays under it (relief.js floor(kind)): SUNRISE the product a·b, THE FOLD the hyperbola, THE
  // QUARTER TURN the circle, THE DOORS the ellipse, THE LADDER the parabola y² − 4x, THE MIRROR the room (the norm until the room
  // stands), THE EYE and THE SEAL the norm; a HALT level stands on the circle, its zone plate, whatever its chapter
  const CHAPTER_SHEETS = ['product', 'hyperbola', 'circle', 'ellipse', 'parabola', 'room', 'norm', 'norm'];
  const sheetOf = (chapter, digit) => RULES[digit].clock ? 'circle' : CHAPTER_SHEETS[Math.max(0, Math.min(7, chapter - 1))];
  const FLIP_CHAPTER = 6;   // THE MIRROR opens the 6 ↔ 9 flip; its pars and roads are counted with it, as game.js plays it
  let OPSET = null;          // the moves the plan counts with while it builds a chapter (null: the six)
  const DOORS = [4176, 8352, 8532];     // the three doors, each one Kaprekar step from 6174: 4176 ≡ 64, 8352 ≡ 128, 8532 ≡ 51
  const CONSTANT = 6174, SIX = CONSTANT % P;   // 6174 ≡ 6 = 2g
  const EYE = 137, IAM = 1, HALF = 129;        // the pole, I AM, ×129 = ÷2
  const LEVELS = 64, CHAPTER = 8;
  const mod = x => ((x % P) + P) % P;
  const word = n => n === INF ? '∞' : D.cells[n].w;
  const words = n => n === INF ? [] : D.cells[n].ws;
  const at = o => ((o % (D.pi.length - 4)) + D.pi.length - 4) % (D.pi.length - 4);   // the tape is 20001 digits; a head past its end wraps
  const window4 = o => parseInt(D.pi.slice(at(o), at(o) + 4), 10) % P;
  const digits4 = o => D.pi.slice(at(o), at(o) + 4);
  const headOf = day => day + 13;
  const cleanName = name => (name || '').trim().toUpperCase() || 'SCRIBE';
  const home = name => F.letterSum(cleanName(name)) % P;
  const freeOf = digit => new Set(RULES[digit].free ? [RULES[digit].free] : []);
  const clue = n => n === 0 ? 'SEED, the floor\'s centre' : n === INF ? '∞, the zenith' : 'ray ' + F.ray(n) + ', a ' + F.character(n);
  const kap = x => { const a = String(x).padStart(4, '0').split('').sort(); return { hi: a.slice().reverse().join(''), lo: a.join(''), next: F.kaprekar(x) }; };

  // ── the solvers ──
  // SHIFT: the target is t·3^k after k moves; the shortest road is the least k ≥ 1 with a road of k moves from s to t·3^k (plain BFS
  // by layers, as game.js solves it; here k starts at 1, since the level is not closed before a move is made)
  function solveShift(s, t0, ops) {
    ops = ops || OPSET || F.OPS; let layer = new Map([[s, null]]); const parents = [layer];
    for (let k = 1; k <= 24; k++) {
      const nxt = new Map(); for (const [u] of layer) for (const o of ops) { const v = o.f(u); if (!nxt.has(v)) nxt.set(v, [u, o.id]); }
      parents.push(nxt); const tk = F.mul(t0, F.POW[k % 256]);
      if (nxt.has(tk)) { const path = []; let c = tk; for (let j = k; j >= 1; j--) { const [u, id] = parents[j].get(c); path.unshift(id); c = u; } return path; }
      layer = nxt;
    }
    return [];
  }
  // the road: the least cost, and of the least-cost roads the fewest moves (free moves included), so a free Γ never sends the player
  // sixty reflections round its orbit when two paid moves would do. Dijkstra over the 258 points, a paid move 1001, a free one 1.
  // ops: the moves to walk by (the engine passes its S.opsList, THE MIRROR's flip included); else the plan's set, else the six
  function road(s, t, free, ops) {
    free = free || new Set(); ops = ops || OPSET || F.OPS; if (s === t) return [];
    const W = new Array(258).fill(Infinity), via = new Array(258).fill(null), done = new Array(258).fill(false); W[s] = 0;
    for (;;) {
      let u = -1; for (let k = 0; k < 258; k++) if (!done[k] && W[k] < Infinity && (u < 0 || W[k] < W[u])) u = k;
      if (u < 0 || u === t) break; done[u] = true;
      for (const o of ops) { const v = o.f(u), w = W[u] + (free.has(o.id) ? 1 : 1001); if (w < W[v]) { W[v] = w; via[v] = [u, o.id]; } }
    }
    if (W[t] === Infinity) return null;
    const path = []; let c = t; while (c !== s) { path.unshift(via[c][1]); c = via[c][0]; } return path;
  }
  // par: the fewest paid moves, by the field's own solver with the level's free set; under SHIFT every move is paid
  const par = (s, t, free, shift) => shift ? solveShift(s, t).length : F.cost(F.solve(s, t, free, OPSET || F.OPS), free);
  const labels = path => path.map(id => F.OP[id].label).join(' ');

  // ── one spec, filled from a rule digit ──
  function base(n, kind, day, name, s, t, digit, o) {
    const R = RULES[digit], free = freeOf(digit), shift = !!R.shift;
    const p = par(s, t, free, shift), r = shift ? solveShift(s, t) : road(s, t, free), chapter = Math.floor((n - 1) / CHAPTER) + 1;
    return { n, kind, chapter, sheet: sheetOf(chapter, digit), day, name: cleanName(name), home: home(name), offset: o, start: s, target: t,
      rule: digit, ruleName: R.name, free: [...free], slack: R.slack || 0, strict: !!R.strict, clock: R.clock || 0, shift,
      par: p, cost: p, road: r, roadText: labels(r), title: '', text: '', quest: null, flip: !!OPSET };
  }
  const ruleLine = sp => RULES[sp.rule].tell + '. Par ' + sp.par + (sp.slack ? ' + ' + sp.slack + ' slack' : '') + '.';

  // ── tape: the level reads the tape at its own window, head + 4(L − 1); the target slides a digit at a time until par is not 0 ──
  function tapeSpec(day, name, L) {
    const o = headOf(day) + 4 * (L - 1), digit = +D.pi[at(o)], R = RULES[digit], free = freeOf(digit);
    const s0 = window4(o), s = R.seed ? 0 : s0;
    let k = 0, t, slid = 0;
    for (;;) { t = window4(o + 4 + k); if (t !== s && par(s, t, free, !!R.shift) > 0) break; k++; slid++; }
    const sp = base(L, 'tape', day, name, s, t, digit, o);
    sp.digits = [digits4(o), digits4(o + 4 + k)]; sp.slid = slid;
    sp.title = word(s) + ' → ' + word(t);
    sp.text = 'π[' + o + '] = ' + digit + ' ' + R.name + ': ' + sp.digits[0] + ' ≡ ' + s0 + ' ' + word(s0) + (R.seed ? ', set aside, the start is SEED' : '') + ' → ' + sp.digits[1] + ' ≡ ' + t + ' ' + word(t)
      + (slid ? ' (slid ' + slid + ' digit' + (slid > 1 ? 's' : '') + ' along the tape past ' + (slid > 1 ? 'targets' : 'a target') + ' at par 0)' : '') + '. ' + ruleLine(sp);
    return sp;
  }
  // ── door: start on a Kaprekar door's cell, target 6174 ≡ 6; the chain shown ──
  function doorSpec(day, name, L, idx, digit) {
    const number = DOORS[idx], s = number % P, { hi, lo } = kap(number);
    const sp = base(L, 'door', day, name, s, SIX, digit, headOf(day) + 4 * (L - 1));
    sp.number = number; sp.chain = [number, CONSTANT]; sp.door = idx + 1;
    sp.title = 'THE DOOR ' + number;
    sp.text = 'The door ' + number + ': ' + hi + ' − ' + lo + ' = ' + CONSTANT + ', one Kaprekar step. ' + number + ' ≡ ' + s + ' ' + word(s) + '; ' + CONSTANT + ' ≡ ' + SIX + ' ' + word(SIX) + ' = 2g. ' + ruleLine(sp);
    return sp;
  }
  // ── ladder: from the player's home cell to its halving rung ×129, the j-th rung, or a later one if par would be 0 ──
  function ladderSpec(day, name, L, j, digit) {
    const h = home(name); let s = h, why = '';
    if (s === 0) { s = F.letterCount(cleanName(name)) % P || IAM; why = ', which halves to itself: the ladder starts from the name\'s letter count, ' + s + ' ' + word(s); }
    const free = freeOf(digit), shift = !!RULES[digit].shift;
    let rung = j, t = s; for (let i = 0; i < rung; i++) t = F.mul(t, HALF);
    while (par(s, t, free, shift) === 0 && rung < j + 16) { rung++; t = F.mul(t, HALF); }
    const sp = base(L, 'ladder', day, name, s, t, digit, headOf(day) + 4 * (L - 1));
    sp.rung = rung; const rungs = []; { let c = s; for (let i = 0; i <= rung; i++) { rungs.push(c + ' ' + word(c)); c = F.mul(c, HALF); } } sp.rungs = rungs;
    sp.title = 'THE LADDER · ' + s + ' → ' + t;
    sp.text = cleanName(name) + ' adds to ' + h + ', the cell of ' + word(h) + why + '. ×129 is ÷2, dlog − 48 a rung, and every ladder closes in sixteen: ' + rungs.join(' → ')
      + '. Climb ' + (rung === 1 ? 'one rung' : rung + ' rungs') + ' in one road. ' + ruleLine(sp);
    return sp;
  }
  // ── mirror: the start from the level's own tape window, the target the Atbash mirror 27k − s of the start cell's first word;
  // a word whose mirror is on the tablet is preferred, then any word of the cell whose mirror is not the cell itself ──
  const pairOf = w => { const p = D.mirrors.find(q => q[0] === w || q[1] === w); return p ? (p[0] === w ? p[1] : p[0]) : null; };
  function mirrorSpec(day, name, L, digit) {
    const o = headOf(day) + 4 * (L - 1); let R = RULES[digit], free = freeOf(digit), k = 0;
    for (;;) {
      const s = R.seed ? 0 : window4(o + k), ws = words(s);
      const order = ws.filter(w => pairOf(w)).concat(ws.filter(w => !pairOf(w)));
      for (const w of order) {
        const kk = F.letterCount(w), ss = F.letterSum(w), m0 = 27 * kk - ss, m = mod(m0);
        if (m === s || par(s, m, free, !!R.shift) === 0) continue;
        const sp = base(L, 'mirror', day, name, s, m, digit, o), pair = pairOf(w), first = word(s);
        sp.word = w; sp.mirror = m0; sp.mirrorWord = pair; sp.digits = [digits4(o + k)]; sp.slid = k;
        const why = w === first ? '' : mod(F.atbash(first)) === s ? ', whose first word mirrors to its own cell; its word ' + w : ', by its word ' + w + (pair ? ', whose mirror stands on the tablet' : '');
        sp.title = 'THE MIRROR · ' + w + ' ↔ ' + (pair || m);
        sp.text = s + ' ' + first + why + ': ' + kk + ' letters, sum ' + ss + '. The Atbash mirror is 27·' + kk + ' − ' + ss + ' = ' + m0 + (m0 !== m ? ' ≡ ' + m : '') + ', the cell of ' + word(m)
          + (pair ? '; on the tablet the mirror is ' + pair : '') + '. ' + ruleLine(sp);
        return sp;
      }
      if (R.seed) { digit = 0; R = RULES[0]; free = freeOf(0); } else k++;   // SEED's words exhausted (never so): read the window instead
    }
  }
  // ── eye: the pole to I AM by two reflections, both free; the road is the par ──
  function eyeSpec(day, name, L) {
    const sp = base(L, 'eye', day, name, EYE, IAM, 7, headOf(day) + 4 * (L - 1));
    sp.par = sp.road.length; sp.countFree = true;   // every move of the road is free: here the moves are counted, free or not
    sp.title = 'THE EYE · 137 → ∞ → 1';
    sp.text = '137 EYE OF HORUS, the pole: Z + 120 = 0, so Γ(137) = ∞, the open circuit, and Γ(∞) = 1 I AM. Two reflections, both free of cost and both counted: the road is the par, ' + sp.par + '.';
    return sp;
  }

  // ── the plan: 64 levels of the day for the name ──
  // opts.special: 'nop' (default) gives the door, ladder and mirror levels no rule; 'tape' reads the digit under their own window
  // (SEED read as NOP where the kind fixes the start). The eye is always JUMP.
  function plan(day, name, opts) {
    opts = opts || {}; const out = new Array(LEVELS);
    const digitFor = (L, seedOK) => { if (opts.special !== 'tape') return 0; const d = +D.pi[at(headOf(day) + 4 * (L - 1))]; return d === 3 && !seedOK ? 0 : d; };
    let doorIdx = 0, ladderIdx = 0;
    for (let c = 0; c < LEVELS / CHAPTER; c++) {
      OPSET = c + 1 === FLIP_CHAPTER ? F.OPS.concat([F.FLIP]) : null;
      const first = c * CHAPTER + 1, last = first + CHAPTER - 1, slots = [], specials = [];
      for (let L = first; L <= last; L++) (SPECIAL[L] ? specials : slots).push(L);
      // the tape levels read their own windows and are ordered by par within the chapter, into the slots the specials leave
      const tapes = slots.map(L => tapeSpec(day, name, L));
      tapes.sort((a, b) => a.par - b.par || RULES[a.rule].burden - RULES[b.rule].burden || a.offset - b.offset);
      tapes.forEach((sp, i) => { sp.window = sp.n; sp.n = slots[i]; sp.chapter = c + 1; out[sp.n - 1] = sp; });
      for (const L of specials) {
        const kind = SPECIAL[L]; let sp;
        if (kind === 'door') sp = doorSpec(day, name, L, doorIdx++, digitFor(L, false));
        else if (kind === 'ladder') sp = ladderSpec(day, name, L, ++ladderIdx, digitFor(L, false));
        else if (kind === 'mirror') sp = mirrorSpec(day, name, L, digitFor(L, true));
        else sp = eyeSpec(day, name, L);
        out[L - 1] = sp;
      }
      if (specials.length) { const sp = out[specials[0] - 1]; out[first - 1].special = { kind: sp.kind, n: sp.n, start: sp.start, target: sp.target, rung: sp.rung, number: sp.number, word: sp.word }; }
      OPSET = null;
    }
    for (const sp of out) sp.quest = quest(sp.n, sp);
    return out;
  }

  // ── the chapter's quest: a cell to find by its words, set at the chapter's first level ──
  const pick = (arr, seed) => arr.length ? arr[((seed % arr.length) + arr.length) % arr.length] : null;
  // a word one can ask for: letters and spaces, a vowel, no run of four consonants (the tablet's Atbash strings fail this), three letters or more
  const nice = w => /^[A-Z]{2,}( [A-Z]{2,})*$/.test(w) && /[AEIOUY]/.test(w) && !/[BCDFGHJKLMNPQRSTVWXZ]{4}/.test(w) && !/^[BCDFGHJKLMNPQRSTVWXZ]{3}/.test(w) && F.letterCount(w) >= 3;
  // a word of the cell past its first, when the cell has one worth asking for: the first word stands on the cell's billboard already
  const deeper = (n, seed) => { const ws = words(n), rest = ws.filter((w, i) => i > 0 && nice(w)), any = ws.filter(nice); return pick(rest.length ? rest : any.length ? any : ws, seed); };
  let MIRROR_PAIRS = null;
  function mirrorPairs() {
    if (MIRROR_PAIRS) return MIRROR_PAIRS;
    MIRROR_PAIRS = D.mirrors.filter(([a, b]) => a !== b && nice(a) && nice(b) && F.letterCount(a) === F.letterCount(b)
      && mod(F.atbash(a)) === F.letterSum(b) % P && words(F.letterSum(a) % P).includes(a) && words(F.letterSum(b) % P).includes(b));
    return MIRROR_PAIRS;
  }
  function quest(level, spec) {
    if ((level - 1) % CHAPTER !== 0) return null;
    const ch = Math.floor((level - 1) / CHAPTER) + 1, day = spec.day, name = spec.name, seed = day + 7 * ch;
    let cell, w, ask;
    if (ch <= 3) { const number = DOORS[ch - 1]; cell = number % P; w = deeper(cell, seed); ask = 'Find the cell that holds ' + w + ': the door ' + number + ' opens on it'; }
    else if (ch === 4) { cell = SIX; w = deeper(cell, seed); ask = 'Find the cell that holds ' + w + ': the room behind the three doors, ' + CONSTANT + ' ≡ ' + SIX; }
    else if (ch === 5) { const sp = spec.special && spec.special.kind === 'ladder' ? spec.special : ladderSpec(day, name, 36, 1, 0); cell = sp.target; w = deeper(cell, seed); ask = 'Find the cell that holds ' + w + ': your cell ' + sp.start + ' ' + word(sp.start) + ' halved ' + (sp.rung === 1 ? 'once' : sp.rung + ' times'); }
    else if (ch === 6 || ch === 8) { const [a, b] = pick(mirrorPairs(), seed * 31 + ch); cell = F.letterSum(b) % P; w = b; ask = a + ' has ' + F.letterCount(a) + ' letters and sum ' + F.letterSum(a) + ': find the cell of its Atbash mirror, 27k − s'; }
    else { cell = EYE; w = pick(words(EYE), seed); ask = 'Find the eye: the cell that holds ' + w + ', where Γ opens to ∞'; }
    return { ask: ask + ' (' + clue(cell) + ').', cell, word: w, chapter: ch };
  }

  // ── the seal of the day: the product of the closed targets' cells, its first word, and that word's Atbash mirror ──
  function seal(targets) {
    const ts = (targets || []).filter(t => t != null && t !== INF);
    let product = 1, sum = 0, zero = false;
    for (const t of ts) { if (t === 0) zero = true; product = product * t % P; sum = (sum + t) % P; }
    if (zero) product = 0;
    const cell = zero ? sum : product, w = word(cell), k = F.letterCount(w), s = F.letterSum(w), mirrorCell = mod(27 * k - s);
    return { product, sum, by: zero ? 'sum' : 'product', n: ts.length, cell, word: w, k, s, mirrorCell, mirrorWord: word(mirrorCell) };
  }

  // ── THE DOORS: a four-figure number's Kaprekar chain to 6174 as levels, each step's residue to the next's, rule NOP ──
  function kaprekarChain(x) {
    const chain = [x], seen = new Set([x]); let n = x;
    while (n !== CONSTANT) { n = F.kaprekar(n); if (seen.has(n)) { chain.push(n); break; } seen.add(n); chain.push(n); if (n === 0) break; }
    return chain;
  }
  function doors(digits) {
    const x = parseInt(String(digits == null ? '' : digits).replace(/\D/g, '').padStart(4, '0').slice(-4), 10) || 0;
    let chain = kaprekarChain(x);
    if (chain[chain.length - 1] !== CONSTANT) return [];                      // repdigits fall to 0 and stay: no door
    if (chain.length === 1) chain = [+kap(CONSTANT).hi, CONSTANT];          // 6174 itself: its own step, 7641 − 1467, from the digits descending
    const out = []; let i = 0;
    while (i < chain.length - 1) {
      const a = chain[i], s = a % P; let j = i + 1; while (j < chain.length - 1 && chain[j] % P === s) j++;
      const b = chain[j], t = b % P; if (t === s) break;                     // the chain ends on the start's own residue: nothing left to play
      const sp = base(out.length + 1, 'door', null, '', s, t, 0, null);
      sp.number = a; sp.next = b; sp.chain = chain.slice(i, j + 1); sp.steps = j - i; sp.typed = x; sp.offset = null; sp.name = null; sp.home = null; sp.sheet = CHAPTER_SHEETS[3];   // THE DOORS' own ellipse
      const stepText = sp.chain.slice(0, -1).map((v, q) => { const { hi, lo } = kap(v); return hi + ' − ' + lo + ' = ' + sp.chain[q + 1]; }).join(', then ');
      sp.title = 'THE DOORS · ' + String(a).padStart(4, '0') + ' → ' + b;
      sp.text = stepText + '. ' + String(a).padStart(4, '0') + ' ≡ ' + s + ' ' + word(s) + ' → ' + b + ' ≡ ' + t + ' ' + word(t) + (sp.steps > 1 ? ' (the steps between keep the residue ' + s + ')' : '') + '. ' + ruleLine(sp);
      out.push(sp); i = j;
    }
    return out;
  }
  // ── FREE WALK: no target, no par ──
  function free(name) {
    const h = home(name);
    return { n: 1, kind: 'free', chapter: 0, sheet: 'norm', day: null, name: cleanName(name), home: h, offset: null, start: h, target: null, rule: 0, ruleName: 'NOP', free: [], slack: 0, strict: false, clock: 0, shift: false,
      par: null, cost: null, road: [], roadText: '', title: 'FREE WALK', text: 'No target: walk the field from ' + h + ' ' + word(h) + ' by the six moves. Tap any cell to read it and the road to it from where you stand.',
      quest: (() => { const w = pick(words(EYE).filter(nice), h) || word(EYE); return { cell: EYE, word: w, chapter: 0, ask: 'Find the eye: the cell that holds ' + w + ', where Γ opens to ∞ (' + clue(EYE) + ').' }; })() };
  }
  return { plan, quest, seal, doors, free, RULES, SPECIAL, CHAPTER_SHEETS, DOORS, CONSTANT, EYE, IAM, HALF, LEVELS, CHAPTER, solveShift, road, par, home, tapeSpec, doorSpec, ladderSpec, mirrorSpec, eyeSpec, kaprekarChain, mirrorPairs };
})();
