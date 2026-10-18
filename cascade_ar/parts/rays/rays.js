// THE FOLD — parts/rays: the Twelve Rays chart (T1) and the ray ledger (T4), the owner's p5 sketch Twelve_Rays.html ported to canvas 2D,
// no p5. The field drawn flat: cell n on spoke dlog mod 12 at ring dlog div 12, SEED at the centre, ∞ the rim circle at ring 22 (21 rings
// of 12 inside it, and a short 22nd of 4: 165 238 200 86 on rays 0–3). The tube is the sketch's: a phosphor layer faded each frame toward
// #050805 by its persist 12/255, chords laid on it 'lighter' (its blendMode(ADD)), ×g bright and thin and the other moves dim (its alphas
// 70 against 26–34), a cell's energy +0.55 an arrival and ×0.97 a frame with an amber ring once over-energised, amber flares that expand
// and die, the per-ray bars R0–R11 and the header. Its obs move (n + 1) is not a move here: the chords are the game's six and the 6 ↔ 9
// flip. Spin, fades and flows run on dt, so a Pi at 30 fps replays at a desktop's speed. Under CALM (o.calm, a flag or a function read
// live) nothing travels: no spin, no slide, no trail, the chords static, a flare a still ring, the fall a 150 ms cross-fade.
//
//   FOLD_RAYS.layout(W, face)       the 258 places at W CSS px: {cx, cy, R0 = 0.042 W, DR = 0.0175 W, rim, x, y, a, r}; face 'rays' or
//                                   'table', A8's 16 × 16 dlog picture (p = c + 16r, 256 and ∞ as pips off the grid)
//   FOLD_RAYS.kind(id, n)           what move id does to n on the chart: {k, v, dRay, dRing}, k one of spoke ring seam out in mirror keep
//                                   chord rim seed enter still
//   FOLD_RAYS.Chart(canvas, o)      a live chart {set, frame, flow, pick, lens, fall, focus, resize, replay, done, layout, ms}; o: size,
//                                   dpr, face, colour ('hue' the moves' hues or 'phos' the sketch's greens), header, bars, labels, marks, calm
//   FOLD_RAYS.bars(g, box, rays, bits, o)  the sketch's drawRayBars in RAY_RGB: R0–R11, its nm and its best work bits, home's ray outlined
//   FOLD_RAYS.drawBars(canvas, o)   bars alone on a canvas of their own (the seal); band(W) the bars' height under a W-wide disc
//   FOLD_RAYS.tally(roads)          roads' arrivals by ray and best work bits (T4); spark(rays) the 12-character sparkline
//   FOLD_RAYS.step(n, dx, dy, face) the focus ring's next cell; pre(id, n) a move's preimage, the cell that flows into n
window.FOLD_RAYS = (function () {
  'use strict';
  const F = window.FIELD, INF = 257, TAU = Math.PI * 2, SHARE = 4;   // a share: an arrival of 4 work bits or more (T3's bits)
  const C = { tube: '#050805', phos: '#00fc00', amber: '#ffd400', textg: '#00a000', dim: '#8fa796', text: '#e8f3e4', gold: '#c9a84c', green: '#5fd37a', blue: '#7fb8ff' };
  const MONO = 'ui-monospace,"SF Mono",Menlo,"DejaVu Sans Mono",monospace';
  // the rays as light: ar.js's twelve wavelengths 377 nm → 610 nm (its wavelengthRGB, copied so the chart needs no three.js)
  function wavelengthRGB(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else { r = 1; }
    const f = nm < 420 ? 0.45 + 0.55 * (nm - 377) / 43 : 1; return [Math.pow(r * f, 0.8), Math.pow(g * f, 0.8), Math.pow(b * f, 0.8)];
  }
  const NM = [], RAY_RGB = []; for (let r = 0; r < 12; r++) { NM.push(Math.floor(377 + r * 233 / 11)); RAY_RGB.push(wavelengthRGB(377 + r * 233 / 11)); }
  const rgba = (c, a) => 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + a + ')';
  const ringOf = n => n === 0 ? -1 : n === INF ? 22 : Math.floor(F.DLOG[n] / 12);
  // a move's preimage, as ar.js flows the sky: cell n arrives from the place of pre(n)
  const PRE = { g: n => F.mul(n, 86), ig: n => F.mul(n, 3), fold: F.fold, inv: F.inv, i: n => F.mul(n, 241), gam: F.gammaInv, flip: F.flip69 };
  const pre = (id, n) => PRE[id] ? PRE[id](n) : n;
  // ── the places ──
  function layout(W, face) {
    const L = { W, face: face === 'table' ? 'table' : 'rays', cx: W / 2, cy: W / 2, R0: 0.042 * W, DR: 0.0175 * W, x: new Float32Array(258), y: new Float32Array(258), a: new Float32Array(258), r: new Float32Array(258) };
    L.rim = L.R0 + 22 * L.DR;
    // the table's places in polar form about (9, 8) in cells, the centre of both of A8's turns, (c, r) → (16 − r, c − 1) and (17 − c, 15 − r)
    if (L.face === 'table') { const cs = L.cs = 0.86 * W / 17; L.x0 = (W - 16 * cs) / 2; L.y0 = (W - 17 * cs) / 2; L.pcx = L.x0 + 9 * cs; L.pcy = L.y0 + 8 * cs; L.rim = 0.72 * W;
      for (let n = 0; n < 258; n++) { const c = n === INF ? 15 : n & 15, r = n === INF ? 16 : n >> 4; L.x[n] = L.x0 + (c + 0.5) * cs; L.y[n] = L.y0 + (r + 0.5) * cs; L.a[n] = Math.atan2(L.y[n] - L.pcy, L.x[n] - L.pcx); L.r[n] = Math.hypot(L.x[n] - L.pcx, L.y[n] - L.pcy); }
      return L; }
    L.pcx = L.cx; L.pcy = L.cy;
    for (let n = 0; n < 258; n++) {
      const d = n === 0 ? 0 : n === INF ? 0 : F.DLOG[n], a = (d % 12) * TAU / 12 - Math.PI / 2, r = n === 0 ? 0 : n === INF ? L.rim : L.R0 + Math.floor(d / 12) * L.DR;
      L.a[n] = a; L.r[n] = r; L.x[n] = L.cx + Math.cos(a) * r; L.y[n] = L.cy + Math.sin(a) * r;
    }
    return L;
  }
  // ── what a move draws: ×g one spoke on, a ring out at the 11 → 0 turn, the seam 86 → 1; FOLD and ×i out or in; INV the disc inside out ──
  function kind(id, n) {
    const o = F.OP[id]; if (!o) return null; const v = o.f(n), k = (s, dr, dd) => ({ k: s, v, dRay: dr || 0, dRing: dd || 0 });
    if (v === n) return k('still'); if (v === INF) return k('rim', 0, 22 - ringOf(n)); if (v === 0) return k('seed', 0, -1 - ringOf(n)); if (n === 0 || n === INF) return k('enter', 0, ringOf(v) - ringOf(n));
    const dr = (F.ray(v) - F.ray(n) + 12) % 12, dd = ringOf(v) - ringOf(n);
    if (id === 'g' || id === 'ig') return k(dd === 0 ? 'spoke' : Math.abs(dd) === 1 ? 'ring' : 'seam', dr, dd);
    if (id === 'fold' || id === 'i') return k(dd > 0 ? 'out' : 'in', dr, dd);
    if (id === 'inv') return k('mirror', dr, dd);
    return k(dr === 0 ? 'keep' : 'chord', dr, dd);
  }
  // the focus ring's walk: ←/→ one ray round the ring (the short ring has 4), ↑/↓ one ring out or in, SEED inside the core and ∞ beyond
  // the rim; on the table, one column or row
  function step(n, dx, dy, face) {
    if (face === 'table') { let c = n === INF ? 15 : n & 15, r = n === INF ? 16 : n >> 4; c = Math.max(0, Math.min(15, c + dx)); r = Math.max(0, Math.min(16, r + dy)); return r === 16 ? (c === 0 ? 256 : c === 15 ? INF : n) : r * 16 + c; }
    if (n === 0) return dy > 0 ? 1 : 0; if (n === INF) return dy < 0 ? F.POW[252] : INF;
    const d = F.DLOG[n], r = d % 12, k = Math.floor(d / 12);
    if (dy) { const k2 = k + dy; if (k2 < 0) return 0; const d2 = k2 * 12 + r; return d2 > 255 ? INF : F.POW[d2]; }
    const m = k === 21 ? 4 : 12; return F.POW[k * 12 + (r + dx % m + m) % m];
  }
  const pickAt = (X, Y, x, y, rad) => { let best = null, bd = rad * rad; for (let n = 0; n < 258; n++) { const d = (X[n] - x) ** 2 + (Y[n] - y) ** 2; if (d <= bd) { bd = d; best = n; } } return best; };
  // ── the ledger: arrivals by ray and the best work bits, each arrival's own zeros(hash32(day, cell, offset)) ──
  function tally(roads) {
    const rays = new Array(12).fill(0), bits = new Array(12).fill(0); let n = 0, inf = 0;
    for (const rd of roads || []) { let c = rd.start; const s = rd.salt || [0, 0]; for (const id of rd.ops) { c = F.OP[id].f(c); n++; const r = F.ray(c); if (r < 0) { if (c === INF) inf++; continue; } rays[r]++; bits[r] = Math.max(bits[r], F.zeros(F.hash32(s[0], c, s[1]))); } }
    return { rays, bits, n, inf };
  }
  const spark = rays => { const m = Math.max(1, ...rays); return rays.map(v => '▁▂▃▄▅▆▇█'[Math.max(1, Math.ceil(8 * v / m)) - 1]).join(''); };
  // ── the bars, the sketch's drawRayBars: a bar a ray in its own light, its lit top, a --dim outline (rays 0–3 are under 3:1 on the ground),
  // R0–R11, the nm and the best work bits beneath; home's ray outlined blue, the line's cell's ray ticked ──
  const fsOf = W => Math.max(9, Math.round(W * 0.011)), band = W => Math.max(18, Math.round(0.034 * W)) + 16 + 3 * (fsOf(W) + 2);
  function bars(g, box, rays, bits, bo) {
    bo = bo || {}; const { x, y, w, h } = box, fs = fsOf(w), lab = 3 * (fs + 2), hMax = Math.max(12, h - lab - 16), x0 = x + w * 0.06, bw = w * 0.88 / 12, y0 = y + 10 + hMax, grow = bo.grow == null ? 1 : bo.grow, pad = Math.max(2, bw * 0.16);
    let top = 1; for (const v of rays || []) top = Math.max(top, v);
    g.save(); g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(5,8,5,0.86)'; g.fillRect(x, y, w, h); g.font = fs + 'px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'top';
    for (let i = 0; i < 12; i++) {
      const bh = (rays ? rays[i] : 0) / top * hMax * grow, bx = x0 + i * bw + pad, bwi = bw - 2 * pad, mx = x0 + i * bw + bw / 2;
      if (bh >= 0.5) { g.fillStyle = rgba(RAY_RGB[i], 0.85); g.fillRect(bx, y0 - bh, bwi, bh); g.fillStyle = C.phos; g.fillRect(bx, y0 - bh, bwi, Math.min(1.5, bh)); }
      g.strokeStyle = i === bo.home ? C.blue : C.dim; g.lineWidth = i === bo.home ? 2 : 1; g.strokeRect(bx - 0.5, y0 - Math.max(bh, 1) - 0.5, bwi + 1, Math.max(bh, 1) + 1);
      if (i === bo.tick) { g.fillStyle = C.text; g.beginPath(); g.moveTo(mx - 3.5, y0 - bh - 8); g.lineTo(mx + 3.5, y0 - bh - 8); g.lineTo(mx, y0 - bh - 3); g.fill(); }
      g.fillStyle = C.text; g.fillText('R' + i, mx, y0 + 4); g.fillStyle = C.dim; g.fillText(String(NM[i]), mx, y0 + 4 + fs + 2); g.fillStyle = C.text; g.fillText(bits ? String(bits[i]) : '·', mx, y0 + 4 + 2 * (fs + 2));
    }
    g.fillStyle = C.dim; g.fillRect(x0, y0 + 1, bw * 12, 1); g.restore();
  }
  function drawBars(canvas, o) { const W = o.size, H = o.height || band(W), dpr = o.dpr || 1; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; const g = canvas.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = C.tube; g.fillRect(0, 0, W, H); bars(g, { x: 0, y: 0, w: W, h: H }, o.rays, o.bits, o); }
  // the chords' styles: the sketch's alpha /255 and weight a move (×g the spine, the rest dim long chords), and its greens for 'phos'
  const STY = { g: [70, 0.9], ig: [70, 0.9], fold: [34, 0.7], inv: [30, 0.7], i: [28, 0.6], gam: [26, 0.6], flip: [26, 0.6] };
  const GREENS = { g: [0, 252, 0], ig: [0, 252, 0], fold: [0, 200, 40], inv: [60, 220, 60], i: [0, 150, 30], gam: [0, 150, 30], flip: [0, 150, 30] };
  const ease = x => x * x * (3 - 2 * x);
  // ── the chart ──
  function Chart(canvas, o) {
    o = Object.assign({ size: 132, dpr: 1, face: 'rays', colour: 'hue', header: false, bars: false, labels: false, marks: true, calm: false, spin: 0.036 }, o || {});   // spin: the sketch's 0.0006 rad a frame at 60 fps, a turn in 174.5 s
    const g = canvas.getContext('2d'), mk = () => document.createElement('canvas'), base = mk(), dots = mk(), tube = mk(), bg = base.getContext('2d'), dg = dots.getContext('2d'), tg = tube.getContext('2d');
    const E = new Float32Array(258), X = new Float32Array(258), Y = new Float32Array(258), SX = new Float32Array(258), SY = new Float32Array(258);
    const calmNow = () => typeof o.calm === 'function' ? !!o.calm() : !!o.calm;
    let L = null, W = 0, H = 0, dpr = 1, u = 1, theta = 0, last = -1, t = 0, kf = 1, bloomP = 1, soft = 1, chords = [], flares = [], fq = [], fqAt = -9, st = {}, flowT0 = -9, flowDur = 0.5, flowId = null, fallT0 = -9, fallSoft = false, lensAt = null, focusN = null, barsAt = -9, endAt = -9, ms = 0;
    const clock = () => performance.now() / 1000;
    function resize(size, face) {
      if (size) o.size = size; if (face) o.face = face; W = o.size; H = W + (o.bars ? band(W) : 0); dpr = o.dpr || 1; u = W / 1000; L = layout(W, o.face);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      for (const c of [base, dots, tube]) { c.width = Math.round(W * dpr); c.height = Math.round(W * dpr); }
      for (const c of [g, bg, dg, tg]) c.setTransform(dpr, 0, 0, dpr, 0, 0);
      tg.fillStyle = C.tube; tg.fillRect(0, 0, W, W); drawBase(); drawDots(); return api;
    }
    // the cached layers, drawn unturned and turned by the spin at the composite: spokes in RAY_RGB at low alpha, 22 faint rings, the rim
    function drawBase() {
      bg.clearRect(0, 0, W, W); const lw = Math.max(0.6, u);
      if (L.face === 'table') { bg.strokeStyle = rgba([0, 0.6, 0], 0.35); bg.lineWidth = 1; bg.strokeRect(L.x0 - 1.5, L.y0 - 1.5, 16 * L.cs + 3, 16 * L.cs + 3); return; }
      for (let r = 0; r < 12; r++) { const a = r * TAU / 12 - Math.PI / 2, r0 = L.R0 - L.DR * 0.6; bg.strokeStyle = rgba(RAY_RGB[r], 0.3); bg.lineWidth = lw; bg.beginPath(); bg.moveTo(L.cx + Math.cos(a) * r0, L.cy + Math.sin(a) * r0); bg.lineTo(L.cx + Math.cos(a) * L.rim, L.cy + Math.sin(a) * L.rim); bg.stroke(); }
      bg.strokeStyle = 'rgba(0,252,0,0.07)'; bg.lineWidth = Math.max(0.5, 0.8 * u); for (let k = 0; k < 22; k++) { bg.beginPath(); bg.arc(L.cx, L.cy, L.R0 + k * L.DR, 0, TAU); bg.stroke(); }
      bg.strokeStyle = rgba([0.56, 0.655, 0.588], 0.55); bg.lineWidth = Math.max(1, 1.2 * u); bg.beginPath(); bg.arc(L.cx, L.cy, L.rim, 0, TAU); bg.stroke();
    }
    // a resting node: the sketch's faint green dot, always there so the spokes read; on the table a square, the dlog as its grey level
    const dotSz = () => Math.max(1.5, 2.6 * u);
    function dot(c, n, x, y) {
      if (L.face === 'table') { const lv = n === 0 || n === INF ? 0 : F.DLOG[n] / 255, s = L.cs - 1; c.fillStyle = n === INF ? rgba([0.91, 0.95, 0.89], 0.5) : 'rgba(0,' + Math.round(40 + 212 * lv) + ',0,' + (0.25 + 0.6 * lv) + ')'; c.fillRect(x - s / 2, y - s / 2, s, s); return; }
      if (n === 0) { c.fillStyle = 'rgba(0,252,0,0.35)'; c.beginPath(); c.arc(x, y, Math.max(2, 3 * u), 0, TAU); c.fill(); return; }
      if (n === INF) { c.strokeStyle = C.dim; c.lineWidth = 1; c.beginPath(); c.arc(x, y, Math.max(2.2, 4 * u), 0, TAU); c.stroke(); return; }
      const s = dotSz(); c.fillStyle = o.colour === 'ray' ? rgba(RAY_RGB[F.DLOG[n] % 12], 0.6) : W < 200 ? 'rgba(0,160,0,0.8)' : 'rgba(0,170,0,0.7)'; c.fillRect(x - s / 2, y - s / 2, s, s);
    }
    function drawDots() { dg.clearRect(0, 0, W, W); for (let n = 0; n < 258; n++) dot(dg, n, L.x[n], L.y[n]); }
    // where each node stands now: its own place turned by the spin, or on its way from its preimage's, polar about the centre, so on the
    // table ×i is a rigid quarter turn for 225 cells and FOLD a half turn for 224 (a half turn always the same way round)
    function places(e) {
      const p = flowId && e < 1 ? PRE[flowId] : null, th = L.face === 'rays' ? theta : 0, cth = Math.cos(th), sth = Math.sin(th);
      for (let n = 0; n < 258; n++) {
        const r = L.r[n] * kf, dx = Math.cos(L.a[n]) * r, dy = Math.sin(L.a[n]) * r; SX[n] = L.pcx + dx * cth - dy * sth; SY[n] = L.pcy + dx * sth + dy * cth;
        if (!p) { X[n] = SX[n]; Y[n] = SY[n]; continue; }
        const m = p(n); let a0 = L.a[m], a1 = L.a[n]; const r0 = L.r[m] * kf; if (L.r[m] === 0) a0 = a1; if (L.r[n] === 0) a1 = a0; let da = a1 - a0; da -= TAU * Math.round(da / TAU); if (Math.abs(Math.abs(da) - Math.PI) < 1e-3) da = Math.PI;
        const a = a0 + da * e + th, rr = r0 + (r - r0) * e; X[n] = L.pcx + Math.cos(a) * rr; Y[n] = L.pcy + Math.sin(a) * rr;
      }
    }
    const styleOf = (ch, al) => { const s = STY[ch.id] || STY.gam; if (ch.phos || o.colour === 'phos') { const c = GREENS[ch.id] || GREENS.gam; return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + al + ')'; } return 'hsla(' + (F.OP[ch.id] ? F.OP[ch.id].hue : 120) + ',85%,60%,' + al + ')'; };
    // a chord's steady brightness under the fade: the sketch's alpha ×2.8 for the replay's many chords, ×4.5 for the player's one road
    const steadyOf = ch => (STY[ch.id] || STY.gam)[0] / 255 * (ch.phos ? 2.8 : 4.5), widthOf = ch => Math.max(ch.phos ? 0.8 : 1.1, (STY[ch.id] || STY.gam)[1] * Math.max(1, W / 420) * (ch.phos ? 1 : 1.4));
    const seg = (c, ch, p, q) => { if (ch.a === ch.b) return; const x0 = SX[ch.a], y0 = SY[ch.a], x1 = SX[ch.b], y1 = SY[ch.b]; c.beginPath(); c.moveTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); c.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q); c.stroke(); };
    const bitsOf = (n, s) => n >= 1 && n <= 256 && s ? F.zeros(F.hash32(s[0], n, s[1])) : 0;
    function arrive(ch) { const b = ch.b; if (b < 1 || b > 256) return; const z = bitsOf(b, ch.salt); E[b] = Math.min(1.6, E[b] + 0.55); if (z >= SHARE) { E[b] = 2.2; fq.push(b); } }
    function frame(now) {
      const p0 = performance.now(); t = (now == null ? p0 : now) / 1000; const dt = last < 0 ? 1 / 60 : Math.max(0, Math.min(0.1, t - last)), k60 = dt * 60, calm = calmNow(); last = t;
      if (!calm && L.face === 'rays') theta = (theta + o.spin * dt) % TAU;
      // the fall: the rings collapse into the core over 0.6 s and re-bloom ring by ring in dlog order over 1.4 s; soft, a 150 ms cross-fade
      const ft = t - fallT0; kf = 1; bloomP = 1; soft = 1;
      if (ft >= 0 && ft < 2) { if (fallSoft || calm) { if (ft < 0.15) soft = Math.abs(1 - 2 * ft / 0.15); } else if (ft < 0.6) kf = Math.max(0.001, 1 - ease(ft / 0.6)); else bloomP = (ft - 0.6) / 1.4; }
      const fe = calm ? 1 : Math.min(1, (t - flowT0) / Math.max(0.05, flowDur)), flowing = fe < 1, falling = kf < 1 || bloomP < 1;
      places(flowing ? ease(fe) : 1);
      // the tube: faded toward #050805 at 12/255 a 60th of a second, the chords laid on 'lighter': the burning one in pieces as it goes, the
      // rest of the road again each frame at its steady share, so it stands burnt in and fades once it is gone
      if (!calm) {
        tg.globalCompositeOperation = 'source-over'; const f = 1 - Math.pow(1 - 12 / 255, k60); tg.fillStyle = 'rgba(5,8,5,' + f.toFixed(4) + ')'; tg.fillRect(0, 0, W, W); tg.globalCompositeOperation = 'lighter';
        for (const ch of chords) {
          if (t < ch.t0) continue; tg.lineWidth = widthOf(ch);
          if (ch.done) { tg.strokeStyle = styleOf(ch, (steadyOf(ch) * f).toFixed(4)); seg(tg, ch, 0, 1); continue; }
          const q = Math.min(1, (t - ch.t0) / ch.dur); tg.strokeStyle = styleOf(ch, Math.min(1, steadyOf(ch) * 1.6).toFixed(3)); seg(tg, ch, ch.p, q); ch.p = q; if (q >= 1) { ch.done = true; arrive(ch); }
        }
      } else for (const ch of chords) if (!ch.done && t >= ch.t0) { ch.done = true; arrive(ch); }
      for (; fq.length && t - fqAt >= 0.333; fqAt = t) flares.push({ n: fq.shift(), t0: t });   // flares a third of a second apart at most
      // the composite
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      if (calm) { g.fillStyle = C.tube; g.fillRect(0, 0, W, W); } else g.drawImage(tube, 0, 0, W, W);
      g.globalAlpha = soft; g.save(); g.translate(L.pcx, L.pcy); if (L.face === 'rays') g.rotate(theta); g.scale(kf, kf); g.translate(-L.pcx, -L.pcy);
      if (bloomP < 1) { g.beginPath(); g.arc(L.pcx, L.pcy, Math.max(0.1, bloomP * L.rim * 1.03), 0, TAU); g.clip(); }
      g.drawImage(base, 0, 0, W, W); if (!flowing && !falling) g.drawImage(dots, 0, 0, W, W); g.restore();
      if (flowing || falling) for (let n = 0; n < 258; n++) { if (bloomP < 1 && n !== 0 && (n === INF ? 1 : F.DLOG[n] / 256) > bloomP) continue; dot(g, n, X[n], Y[n]); }
      g.globalCompositeOperation = 'lighter';
      if (calm) for (const ch of chords) if (ch.done) { g.lineWidth = widthOf(ch); g.strokeStyle = styleOf(ch, Math.min(1, steadyOf(ch)).toFixed(3)); seg(g, ch, 0, 1); }
      // the reach: the six chords from where you stand, faint, in the moves' hues
      if (o.marks && st.current != null && st.reach) { g.lineWidth = Math.max(0.8, u * 1.2); for (const [id, v] of st.reach) { if (v === st.current) continue; g.strokeStyle = 'hsla(' + F.OP[id].hue + ',80%,60%,0.3)'; g.beginPath(); g.moveTo(SX[st.current], SY[st.current]); g.lineTo(SX[v], SY[v]); g.stroke(); } }
      // energy: the sketch's glow, phosphor while it lasts, an amber ring once over-energised (amber is never a fill: a fill would read as the target)
      const kd = Math.pow(0.97, k60);
      for (let n = 1; n < 257; n++) { const e = E[n] *= kd; if (e <= 0.02) continue; const b = Math.min(1, e), sz = Math.max(1, u * 1.6);
        g.fillStyle = 'rgba(0,252,0,' + ((30 + b * 120) / 255).toFixed(3) + ')'; g.beginPath(); g.arc(X[n], Y[n], (2.5 + b * 5) / 2 * sz, 0, TAU); g.fill();
        if (e > 1) { g.strokeStyle = 'rgba(255,212,0,' + ((e - 1) * 160 / 255).toFixed(3) + ')'; g.lineWidth = 1; g.beginPath(); g.arc(X[n], Y[n], (3 + (e - 1) * 6) / 2 * sz + 1, 0, TAU); g.stroke(); } }
      // flares: amber rings that expand and die (the sketch's 6 + 2.2 a frame over 42 frames); under CALM a still ring that fades
      g.lineWidth = Math.max(1, 1.2 * u * 1.6);
      for (let i = flares.length - 1; i >= 0; i--) { const fl = flares[i], tf = (t - fl.t0) * 60, a = Math.max(0, 1 - tf / 42), r = (calm ? 9 : 6 + tf * 2.2) * Math.max(0.35, u * 1.4); if (a <= 0) { flares.splice(i, 1); continue; } g.strokeStyle = 'rgba(255,212,0,' + (a * 130 / 255).toFixed(3) + ')'; g.beginPath(); g.arc(X[fl.n], Y[fl.n], r, 0, TAU); g.stroke(); }
      g.globalCompositeOperation = 'source-over';
      if (o.marks) marks(); if (o.labels && o.marks) labels();
      g.globalAlpha = 1; if (o.header) header();
      if (o.bars) { const grow = barsAt < 0 ? 1 : calm ? (t >= barsAt ? 1 : 0) : Math.max(0, Math.min(1, (t - barsAt) / 0.5)); bars(g, { x: 0, y: W, w: W, h: H - W }, st.rays, grow > 0 ? st.bits : null, { home: st.homeRay, tick: st.tickRay, grow }); }
      if (lensAt) lens1();
      ms = ms * 0.9 + (performance.now() - p0) * 0.1; return api;
    }
    // the marks: home blue, the target gold, you green, the quest's cell once answered; the focus ring for the keys
    function marks() {
      const mr = Math.max(3, L.face === 'table' ? L.cs * 0.55 : L.DR * 1.1), ring = (n, col, r, w) => { if (n == null) return; g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.arc(X[n], Y[n], r, 0, TAU); g.stroke(); };
      if (st.quest != null) { const n = st.quest, s = mr * 0.9; g.strokeStyle = C.text; g.lineWidth = 1; g.beginPath(); g.moveTo(X[n], Y[n] - s); g.lineTo(X[n] + s, Y[n]); g.lineTo(X[n], Y[n] + s); g.lineTo(X[n] - s, Y[n]); g.closePath(); g.stroke(); }
      ring(st.home, C.blue, mr, 1.5); ring(st.target, C.gold, mr * 1.3, 1.8);
      if (st.current != null) { g.fillStyle = C.green; g.beginPath(); g.arc(X[st.current], Y[st.current], Math.max(2.2, mr * 0.7), 0, TAU); g.fill(); ring(st.current, 'rgba(95,211,122,0.55)', mr * 1.7, 1); }
      if (focusN != null) { g.setLineDash([3, 2]); ring(focusN, C.text, mr * 2.1, 1.5); g.setLineDash([]); }
    }
    // the move labels at the reach chords' ends, pushed outward from the centre
    function labels() {
      if (st.current == null || !st.reach) return; const at = new Map(); for (const [id, v] of st.reach) if (v !== st.current) at.set(v, (at.has(v) ? at.get(v) + ' ' : '') + F.OP[id].label);
      g.font = '600 ' + Math.max(10, Math.round(W * 0.016)) + 'px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (const [v, txt] of at) { let dx = SX[v] - L.cx, dy = SY[v] - L.cy; const d = Math.hypot(dx, dy) || 1; if (L.face === 'table') { dx = 0; dy = -1; } else { dx /= d; dy /= d; } const id = [...st.reach].find(e => e[1] === v)[0];
        const x = X[v] + dx * 11, y = Y[v] + dy * 11; g.fillStyle = 'rgba(5,8,5,0.7)'; const w = g.measureText(txt).width + 4; g.fillRect(x - w / 2, y - 7, w, 14); g.fillStyle = 'hsl(' + F.OP[id].hue + ',70%,65%)'; g.fillText(txt, x, y); }
    }
    // the sketch's header: 'CASCADE GF(257)' over 'P=257 G=3 12 RAYS', and the caller's two lines on the right
    function header() {
      const fs = Math.max(10, Math.round(W * 0.013)), x = Math.max(8, 0.02 * W), y = Math.max(6, 0.016 * W); g.font = fs + 'px ' + MONO; g.textBaseline = 'top';
      g.textAlign = 'left'; g.fillStyle = C.textg; g.fillText('CASCADE GF(257)', x, y); g.fillStyle = C.dim; g.fillText('P=257 G=3 12 RAYS', x, y + fs * 1.35);
      const info = st.info || []; g.textAlign = 'right'; g.fillStyle = C.textg; if (info[0]) g.fillText(info[0], W - x, y); g.fillStyle = C.dim; if (info[1]) g.fillText(info[1], W - x, y + fs * 1.35);
    }
    // the lens: 4× under the finger, lifted above it so the finger does not hide it, the cell nearest its centre named
    function lens1() {
      const R = Math.min(56, W * 0.16), { x, y } = lensAt; let cx = x, cy = y - R - 24; if (cy - R < 0) cy = y + R + 24; cx = Math.max(R + 2, Math.min(W - R - 2, cx)); cy = Math.max(R + 2, Math.min(H - R - 2, cy));
      g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip(); g.fillStyle = C.tube; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      g.drawImage(canvas, (x - R / 4) * dpr, (y - R / 4) * dpr, R / 2 * dpr, R / 2 * dpr, cx - R, cy - R, 2 * R, 2 * R); g.restore();
      g.strokeStyle = C.dim; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke(); g.strokeStyle = 'rgba(232,243,228,0.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - 6, cy); g.lineTo(cx + 6, cy); g.moveTo(cx, cy - 6); g.lineTo(cx, cy + 6); g.stroke();
      const n = lensAt.n; if (n != null) { g.font = '600 11px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'bottom'; const txt = n === INF ? '∞' : n === 0 ? '0 SEED' : n + ' · R' + F.ray(n) + ' · ' + ringOf(n); g.fillStyle = 'rgba(5,8,5,0.8)'; const w = g.measureText(txt).width + 8; g.fillRect(cx - w / 2, cy + R - 18, w, 15); g.fillStyle = C.text; g.fillText(txt, cx, cy + R - 4); }
    }
    // the state: where you stand, the target, home, the road and its moves, the reach, the quest's cell, the level's salt, the bars' numbers.
    // A road one move longer than the last burns its new chord in over the flow and lands on its cell; any other change lays the road at once
    function set(s) {
      const prev = st.road || [], road = (s.road || []).slice(), ops = (s.ops || []).slice(), now = clock();
      st = Object.assign({}, s, { road, ops, reach: s.current == null || s.reach === false ? null : (s.opsList || F.OPS).map(op => [op.id, op.f(s.current)]) });   // the reach over the level's own moves
      const same = road.length === prev.length && road.every((c, i) => c === prev[i]), ext = road.length === prev.length + 1 && prev.length > 0 && prev.every((c, i) => c === road[i]);
      if (same) return api;
      const salt = s.salt || null, mkc = (i, done) => ({ a: road[i], b: road[i + 1], id: ops[i] || 'gam', salt, t0: done ? -9 : now, dur: done ? 0 : now - flowT0 < 0.1 ? Math.max(0.2, flowDur) : 0.5, p: 0, done });
      if (ext) chords.push(mkc(road.length - 2, false));
      else { chords = []; for (let i = Math.max(0, road.length - 65); i < road.length - 1; i++) chords.push(mkc(i, true)); }
      if (chords.length > 64) chords.splice(0, chords.length - 64);
      return api;
    }
    function flow(id, dur) { if (!PRE[id]) return api; flowId = id; flowT0 = clock(); flowDur = dur || 0.5; return api; }
    function fall(sft) { fallT0 = clock(); fallSoft = !!sft; return api; }
    function pick(x, y, rad) { if (!last || last < 0) places(1); return pickAt(X, Y, x, y, rad == null ? Math.max(L.face === 'table' ? L.cs * 0.7 : L.DR, 10) : rad); }
    function lens(x, y) { if (x == null) { lensAt = null; return null; } const n = pickAt(X, Y, x, y, Math.max(2 * (L.face === 'table' ? L.cs : L.DR), 8)); lensAt = { x, y, n }; return n; }
    function focus(n) { focusN = n == null ? null : n; return api; }
    // T4: a set of roads replayed as chords over dur seconds, one after another, each burning in and landing, then the bars grown from the
    // ledger's numbers; under CALM the last frame at once
    function replay(roads, ro) {
      ro = ro || {}; const dur = ro.dur || 4, now = clock(), list = [];
      for (const rd of roads || []) { let c = rd.start; for (const id of rd.ops) { const v = F.OP[id].f(c); list.push({ a: c, b: v, id, salt: rd.salt, phos: true }); c = v; } }
      const N = Math.max(1, list.length), each = Math.max(0.25, dur / N * 2.2), calm = calmNow();
      chords = list.map((ch, i) => Object.assign(ch, { t0: calm ? -9 : now + i / N * (dur - each * 0.5), dur: each, p: 0, done: calm }));
      if (calm) for (const ch of chords) arrive(ch);
      st = { rays: ro.rays, bits: ro.bits, homeRay: ro.home, tickRay: ro.tick, info: ro.info }; barsAt = calm ? now - 1 : now + dur; endAt = now + dur + (calm ? 0 : 2.5);
      return api;
    }
    const done = () => clock() > endAt && !flares.length && !fq.length;
    const api = { set, frame, flow, pick, lens, fall, focus, resize, replay, done, layout: () => L, get ms() { return ms; }, o, canvas };
    resize(); return api;
  }
  return { layout, kind, step, pre, Chart, bars, drawBars, band, tally, spark, RAY_RGB, NM, SHARE, C };
})();
