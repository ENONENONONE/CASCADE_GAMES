// THE FOLD — the relief brought into the game (2026-10-17). The machine's RELIEF viewer (conics_relief.html, relief_view.js) lifts the
// conic sheets and the plane's sheets mod 257 into 3-D: a 257 × 257 grid, the height the value (val/256 of H = 120 × a multiplier
// ×½ … ×256) or its dlog, the colour the spin dlog × 2π/256 as a hue with zero black, or the cube vertex of gcd(v, 210); the six
// conics x·y, x² − y², x² + y², x² + 4y², y² − 4x and x² + xy − y², the plane's norm a² + ab − b² and trace 2a + b; the time step
// v → v·g; and THE TURN, the orbit of (1, 0) under (x, y) → (cx − sy, sx + cy) with c = 155 ≡ 4/5 and s = 52 ≡ 3/5, all 256 points
// of x² + y² ≡ 1 once, u = c + 16s ≡ 216 of dlog 147, the hue the step.
//
// Here the same sheets stand in the game's world: the player at the origin, the cells on a sphere of radius 6, the 210-gon on the
// floor at y = −2.4 inside radius 3, the horizon at y = 0, forward −z, azimuth θ placed as (sin θ, ·, −cos θ) as ar.js places a cell.
// Every builder returns a THREE.Object3D placed for that world, made of Points, Line, LineLoop or indexed LineSegments with Float32
// colour attributes and PointsMaterial / LineBasicMaterial with vertexColors (the optional 'mesh' mode of a sheet uses
// MeshBasicMaterial with vertexColors, no texture, no shader). All arithmetic is in GF(257). three.js r128, the game's vendored copy;
// nothing else is needed, not field.js, not data.js.
//
//   FOLD_RELIEF.floor(kind, opts)       any form of FORMS as a relief floor under the player, 129 × 129 samples, the norm's five stars marked
//   FOLD_RELIEF.norm(opts)              floor('norm', opts), the norm sheet with its stars
//   FOLD_RELIEF.conic(kind, r, opts)    one conic's solution set lifted onto a ring of radius 4.5 round the player
//   FOLD_RELIEF.turn(opts)              THE TURN's orbit as a closed ring of radius 5, a marker moved by obj.step(k), obj.at(k)
//   FOLD_RELIEF.sheet(kind, mult, opts) a 65 × 65 relief of the product or the norm (or any of the forms) as a ceiling at y ≈ 5 or a wall
//   FOLD_RELIEF.dispose(obj)            frees every geometry and material under obj
//   FOLD_RELIEF.count(obj)              the vertices under obj
// and the arithmetic alone: solve(kind, r), orbit(c, s, x0, y0), valueAt(form, a, b, t), hue(h), DLOG, POW, STARS, MULTS, FORMS.
window.FOLD_RELIEF = (function () {
  'use strict';
  const P = 257;
  const DLOG = new Int16Array(P).fill(-1), POW = new Uint16Array(256);
  { let a = 1; for (let k = 0; k < 256; k++) { DLOG[a] = k; POW[k] = a; a = a * 3 % P; } }
  const mod = n => ((n % P) + P) % P;
  // the relief's hue: h in [0, 1) round the colour wheel, the machine's own ramp
  const hue = h => { h = h - Math.floor(h); const r = Math.abs(h * 6 - 3) - 1, g = 2 - Math.abs(h * 6 - 2), b = 2 - Math.abs(h * 6 - 4); return [Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b))]; };
  // the cube vertex of gcd(v, 210): UNITY, c, g, Φ, cg, cΦ, gΦ, cgΦ, with the relief's colours
  const CUBE = [[1], [2], [3], [5, 7, 35], [6], [10, 14, 70], [15, 21, 105], [30, 42, 210]];
  const COL = [[0, 0, 0], [51, 136, 255], [255, 170, 34], [255, 34, 136], [136, 136, 136], [153, 68, 204], [255, 112, 96], [255, 255, 255]].map(c => c.map(x => x / 255));
  const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
  const VTX = new Uint8Array(P); for (let v = 0; v < P; v++) { const g = gcd(v, 210); for (let k = 0; k < 8; k++) if (CUBE[k].indexOf(g) >= 0) VTX[v] = k; }
  // the forms. The sheets are the relief's own six conics over (x, y) and the plane's norm and trace over (a, b); as point sets
  // the kinds are the circle x² + y², the ellipse x² + 4y², the hyperbola x² − y², the parabola y − x² (so y ≡ x² + r, one point an x),
  // the product x·y and the norm x² + xy − y², each solved for ≡ r.
  const FORMS = {
    product: (x, y) => x * y, hyperbola: (x, y) => x * x - y * y, circle: (x, y) => x * x + y * y, ellipse: (x, y) => x * x + 4 * y * y,
    parabola: (x, y) => y * y - 4 * x, norm: (x, y) => x * x + x * y - y * y, trace: (a, b) => 2 * a + b,
  };
  const CONIC_FORMS = { circle: FORMS.circle, ellipse: FORMS.ellipse, hyperbola: FORMS.hyperbola, parabola: (x, y) => y - x * x, product: FORMS.product, norm: FORMS.norm };
  const MULTS = [0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256];
  // the five stars of the norm: the points where its differences 2a + b and a − 2b both vanish, the field of five inside the plane
  // (0 and the four units ±1/√5, ±φ/√5), norms 0, 154, 154, 103, 103
  const STARS = [[0, 0], [103, 51], [154, 206], [206, 103], [51, 154]];
  const valueAt = (form, a, b, t) => { const f = typeof form === 'function' ? form : FORMS[form]; const v = mod(f(a, b)); return t ? v * POW[((t % 256) + 256) % 256] % P : v; };
  const T = () => window.THREE;
  const mult = m => MULTS.indexOf(m) >= 0 ? m : 1;
  // the colour of a value: 'dlog' the hue dlog/256 with zero black, 'value' a ramp from the ground's dark green to the gold of the
  // quarter turns, 'vertex' the cube vertex's colour
  function colourOf(val, mode, out, o) {
    let c;
    if (mode === 'vertex') c = COL[VTX[val]];
    else if (mode === 'value') { const v = val / 256; c = [0.12 + 0.8 * v, 0.28 + 0.52 * v, 0.14 + 0.2 * v]; }
    else c = val === 0 ? [0, 0, 0] : hue(DLOG[val] / 256);
    out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2];
  }
  // the height of a value in the relief's reading: 'value' val/256, 'dlog' dlog/255 with zero at −0.08 below the sheet, 'flat' 0;
  // centred when asked, so a floor's heights run −amp … +amp instead of 0 … amp
  function heightOf(val, mode, centred) {
    let h = mode === 'flat' ? 0 : mode === 'dlog' ? (val === 0 ? -0.08 : DLOG[val] / 255) : val / 256;
    return centred ? h * 2 - 1 : h;
  }
  // ── a sheet: n × n samples of a form, every `step`th point of the 257 × 257 grid, laid in a frame o + u·X + v·Y + nrm·h ──
  // X and Y run −half … +half across the samples; h = amp × (height of the value × mult). Returns an Object3D whose children are
  // the Points (or the indexed LineSegments, or the Mesh) and, for the norm, the five stars; obj.setT(t) refills it for v → v·g^t.
  function makeSheet(spec) {
    const TH = T(), n = spec.n, step = spec.step, N = n * n, f = spec.form;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const fr = spec.frame, u = fr.u, v = fr.v, nm = fr.nrm, o = fr.o, half = spec.half;
    const fill = t => {
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const a = i * step, b = j * step, val = valueAt(f, a, b, t), k = (j * n + i) * 3;
        const X = (a / 256 - 0.5) * 2 * half, Y = (b / 256 - 0.5) * 2 * half, h = spec.amp * spec.mult * heightOf(val, spec.height, spec.centred);
        pos[k] = o[0] + u[0] * X + v[0] * Y + nm[0] * h; pos[k + 1] = o[1] + u[1] * X + v[1] * Y + nm[1] * h; pos[k + 2] = o[2] + u[2] * X + v[2] * Y + nm[2] * h;
        colourOf(val, spec.colour, col, k);
      }
    };
    fill(spec.t || 0);
    const geo = new TH.BufferGeometry();
    geo.setAttribute('position', new TH.BufferAttribute(pos, 3)); geo.setAttribute('color', new TH.BufferAttribute(col, 3));
    let body;
    if (spec.mode === 'wire') {           // the rows and the columns of the grid as one indexed LineSegments: 4n(n − 1) indices, n² vertices
      const idx = new Uint32Array(4 * n * (n - 1)); let q = 0;
      for (let j = 0; j < n; j++) for (let i = 0; i < n - 1; i++) { idx[q++] = j * n + i; idx[q++] = j * n + i + 1; }
      for (let i = 0; i < n; i++) for (let j = 0; j < n - 1; j++) { idx[q++] = j * n + i; idx[q++] = (j + 1) * n + i; }
      geo.setIndex(new TH.BufferAttribute(idx, 1));
      body = new TH.LineSegments(geo, new TH.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: spec.opacity }));
    } else if (spec.mode === 'mesh') {    // a solid surface, two triangles a cell, both sides
      const idx = new Uint32Array((n - 1) * (n - 1) * 6); let q = 0;
      for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) { const a = j * n + i, b = a + 1, c = a + n, d = c + 1; idx[q++] = a; idx[q++] = c; idx[q++] = b; idx[q++] = b; idx[q++] = c; idx[q++] = d; }
      geo.setIndex(new TH.BufferAttribute(idx, 1));
      body = new TH.Mesh(geo, new TH.MeshBasicMaterial({ vertexColors: true, side: TH.DoubleSide, transparent: spec.opacity < 1, opacity: spec.opacity }));
    } else {
      body = new TH.Points(geo, new TH.PointsMaterial({ size: spec.size, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: spec.opacity, depthWrite: false }));
    }
    body.frustumCulled = false;
    const group = new TH.Group(); group.add(group.body = body);
    group.userData = { kind: spec.name, form: spec.formName, n, step, mult: spec.mult, height: spec.height, colour: spec.colour, mode: spec.mode, t: spec.t || 0, vertices: N };
    // the exact position of a point (a, b) of the grid on this sheet, with the value's own height
    group.pointAt = (a, b, lift) => { const val = valueAt(f, a, b, group.userData.t), X = (a / 256 - 0.5) * 2 * half, Y = (b / 256 - 0.5) * 2 * half, h = spec.amp * spec.mult * heightOf(val, spec.height, spec.centred) + (lift || 0); return [o[0] + u[0] * X + v[0] * Y + nm[0] * h, o[1] + u[1] * X + v[1] * Y + nm[1] * h, o[2] + u[2] * X + v[2] * Y + nm[2] * h, val]; };
    group.setT = t => { group.userData.t = t; fill(t); geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; if (group.refreshMarks) group.refreshMarks(); };
    return group;
  }
  // ── floor(kind, opts): a form of FORMS as the floor under the player; norm(opts) is floor('norm', opts) ──
  // kind 'product', 'hyperbola', 'circle', 'ellipse', 'parabola' (y² − 4x), 'norm' (a² + ab − b²) or 'trace', unlit, in one frame for
  // every kind, so a chapter's floor swaps for the next in place. 129 × 129 samples (every second point of the 257 × 257 grid), a to
  // the right (+x), b ahead (−z), inside the 210-gon's radius 3: the square's half-side is 2 (opts.half), its diagonal 2.83. The height is centred on the floor, −amp … +amp with amp 0.6 (opts.amp),
  // the value's height val/256 as the relief has it ('value', or 'dlog', or 'flat' through opts.height), times opts.mult (one of the
  // relief multipliers, 1 by default: ×2 reaches ±1.2, the horizon is 2.4 up). opts.colour 'dlog' (the default, the relief's hue by
  // dlog, zero black), 'value' or 'vertex'. opts.mode 'points' (default), 'wire' (indexed rows and columns) or 'mesh'. opts.t the
  // time step, v → v·g^t. On the norm the five stars stand at their exact (a, b) with their own heights, white, as the sheet's second
  // child; opts.stars false leaves them out; the other kinds have none. Vertices: 16641 (+ 5 on the norm).
  function floor(kind, opts) {
    opts = opts || {}; const TH = T(), f = FORMS[kind]; if (!f) throw new Error('FOLD_RELIEF.floor: no form ' + kind);
    const y = opts.y != null ? opts.y : -2.4;
    const g = makeSheet({ name: kind + '-floor', formName: kind, form: f, n: 129, step: 2, half: opts.half != null ? opts.half : 2, amp: opts.amp != null ? opts.amp : 0.6, mult: mult(opts.mult == null ? 1 : opts.mult),
      centred: true, height: opts.height || 'value', colour: opts.colour || 'dlog', mode: opts.mode || 'points', size: opts.size || 0.035, opacity: opts.opacity != null ? opts.opacity : 0.9, t: opts.t || 0,
      frame: { o: [0, y, 0], u: [1, 0, 0], v: [0, 0, -1], nrm: [0, 1, 0] } });
    if (kind === 'norm' && opts.stars !== false) {
      const sp = new Float32Array(STARS.length * 3), sc = new Float32Array(STARS.length * 3);
      const place = () => { STARS.forEach((s, i) => { const p = g.pointAt(s[0], s[1], 0.02); sp[i * 3] = p[0]; sp[i * 3 + 1] = p[1]; sp[i * 3 + 2] = p[2]; const c = i === 0 ? [1, 0.84, 0.47] : [1, 1, 1]; sc[i * 3] = c[0]; sc[i * 3 + 1] = c[1]; sc[i * 3 + 2] = c[2]; }); };
      place();
      const sg = new TH.BufferGeometry(); sg.setAttribute('position', new TH.BufferAttribute(sp, 3)); sg.setAttribute('color', new TH.BufferAttribute(sc, 3));
      const stars = new TH.Points(sg, new TH.PointsMaterial({ size: (opts.size || 0.035) * 5, vertexColors: true, sizeAttenuation: true, depthWrite: false })); stars.frustumCulled = false;
      g.add(g.stars = stars); g.userData.stars = STARS.slice(); g.userData.vertices += STARS.length;
      g.refreshMarks = () => { place(); sg.attributes.position.needsUpdate = true; };
    }
    return g;
  }
  const norm = opts => floor('norm', opts);
  // ── solve(kind, r): the solution set of a conic ≡ r, in point order (x ascending, then y) ──
  // The circle, ellipse and hyperbola have 256 points for r ≠ 0 (p − 1, since −1 is a square and 4 is a square) and 513 for r = 0,
  // the two null lines through the origin; the parabola y ≡ x² + r has 257, one an x; the product x·y ≡ r has 256 for r ≠ 0 and
  // 513 for r = 0, the two axes; the norm x² + xy − y², 5 being a non-residue, has 258 for every r ≠ 0 and the one point 0 for r = 0.
  function solve(kind, r) {
    const f = CONIC_FORMS[kind]; if (!f) throw new Error('FOLD_RELIEF.solve: no conic ' + kind);
    r = mod(r | 0); const pts = [];
    for (let x = 0; x < P; x++) for (let y = 0; y < P; y++) if (mod(f(x, y)) === r) pts.push([x, y]);
    return pts;
  }
  // ── conic(kind, r, opts): one conic's points lifted onto a ring round the player ──
  // Angle by x: θ = 2π·x/257, placed (sin θ, h, −cos θ)·radius with radius 4.5 (opts.radius); height by y: (y/257 − ½)·2·amp with
  // amp 1.5 (opts.amp) about y = 0 (opts.y), the horizon. A Points cloud and a faint Line through the points in point order
  // (opts.line false leaves it out). Colour: opts.colour 'u' (the default) the hue by dlog of x + 16y, the point read as one number of
  // the field with 16 the quarter turn, whose norm (x + 16y)(x − 16y) = x² + y² is the circle's own r; 'x' or 'y' the hue by that
  // coordinate's dlog; 'index' the hue by the point's place in the order. Vertices: 2 × the point count, at most 2 × 513.
  function conic(kind, r, opts) {
    opts = opts || {}; const TH = T(); const pts = solve(kind, r), n = pts.length;
    const radius = opts.radius != null ? opts.radius : 4.5, amp = opts.amp != null ? opts.amp : 1.5, y0 = opts.y != null ? opts.y : 0, cm = opts.colour || 'u';
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    pts.forEach((q, i) => {
      const th = q[0] / P * Math.PI * 2, h = y0 + (q[1] / P - 0.5) * 2 * amp;
      pos[i * 3] = Math.sin(th) * radius; pos[i * 3 + 1] = h; pos[i * 3 + 2] = -Math.cos(th) * radius;
      const key = cm === 'x' ? q[0] : cm === 'y' ? q[1] : cm === 'index' ? -1 : mod(q[0] + 16 * q[1]);
      if (cm === 'index') { const c = hue(i / n); col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; } else colourOf(key, 'dlog', col, i * 3);
    });
    const group = new TH.Group();
    const pg = new TH.BufferGeometry(); pg.setAttribute('position', new TH.BufferAttribute(pos, 3)); pg.setAttribute('color', new TH.BufferAttribute(col, 3));
    const points = new TH.Points(pg, new TH.PointsMaterial({ size: opts.size || 0.09, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false })); points.frustumCulled = false;
    group.add(group.body = points);
    let verts = n;
    if (opts.line !== false && n > 1) {
      const lg = new TH.BufferGeometry(); lg.setAttribute('position', new TH.BufferAttribute(pos.slice(), 3)); lg.setAttribute('color', new TH.BufferAttribute(col.slice(), 3));
      const line = new TH.Line(lg, new TH.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: opts.lineOpacity != null ? opts.lineOpacity : 0.3, depthWrite: false })); line.frustumCulled = false;
      group.add(group.line = line); verts += n;
    }
    group.userData = { kind, r, count: n, points: pts, vertices: verts };
    group.at = i => { const q = pts[((i % n) + n) % n]; return { i: ((i % n) + n) % n, x: q[0], y: q[1], u: mod(q[0] + 16 * q[1]), cell: q[0], position: [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]] }; };
    return group;
  }
  // ── orbit(c, s, x0, y0): THE TURN's orbit, (x, y) → (cx − sy, sx + cy) from (x0, y0) until it returns, 256 steps at most ──
  function orbit(c, s, x0, y0) {
    c = mod(c == null ? 155 : c); s = mod(s == null ? 52 : s); let x = mod(x0 == null ? 1 : x0), y = mod(y0 == null ? 0 : y0);
    const pts = [[x, y]]; let closed = false;
    for (let n = 0; n < 256; n++) { const nx = mod(c * x - s * y), ny = mod(s * x + c * y); x = nx; y = ny; if (x === pts[0][0] && y === pts[0][1]) { closed = true; break; } pts.push([x, y]); }
    return { pts, closed, c, s, L: mod(c * c + s * s), u: mod(c + 16 * s), w: mod(c - 16 * s) };
  }
  // ── turn(opts): THE TURN's orbit as a closed ring round the player ──
  // c = 155 ≡ 4/5, s = 52 ≡ 3/5 from (1, 0) unless opts.c, opts.s, opts.x0, opts.y0 say otherwise: the 256 points of x² + y² ≡ 1 in
  // orbit order, u = c + 16s ≡ 216 of dlog 147, so step k is the point x + 16y = 216^k. Angle by the orbit index, θ = 2π·k/256
  // (opts.angle 'index'), or by the dlog of x + 16y, 147k mod 256 (opts.angle 'dlog'), which puts step k at the azimuth where ar.js
  // stands the cell 216^k on the sphere; radius 5 (opts.radius); height by y, (y/257 − ½)·2·amp with amp 1.5 about the horizon.
  // A LineLoop through the points with the hue the step (k/256, the relief's own colouring of the orbit), joined in the order the ring
  // is placed: orbit order by index, dlog order by dlog, where neighbours are one ×g apart (in orbit order a segment jumps 147 dlog,
  // 206.72°, and the ring draws as a star polygon); a Points of the same 256
  // (opts.points false leaves it out), the start white and the first step gold as the relief marks them, and the marker: one bright
  // point that obj.step(k) moves to step k (obj.k the step it stands on). obj.at(k) → {k, x, y, cell: x, u: x + 16y, dlog, position}.
  // Vertices: 256 + 256 + 2 + 1.
  function turn(opts) {
    opts = opts || {}; const TH = T(); const ob = orbit(opts.c, opts.s, opts.x0, opts.y0), pts = ob.pts, n = pts.length;
    const radius = opts.radius != null ? opts.radius : 5, amp = opts.amp != null ? opts.amp : 1.5, y0 = opts.y != null ? opts.y : 0, byDlog = opts.angle === 'dlog';
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const where = k => { const q = pts[k], uu = mod(q[0] + 16 * q[1]), th = (byDlog && uu ? DLOG[uu] / 256 : k / n) * Math.PI * 2; return [Math.sin(th) * radius, y0 + (q[1] / P - 0.5) * 2 * amp, -Math.cos(th) * radius]; };
    for (let k = 0; k < n; k++) { const p = where(k), c = hue(k / n); pos[k * 3] = p[0]; pos[k * 3 + 1] = p[1]; pos[k * 3 + 2] = p[2]; col[k * 3] = c[0]; col[k * 3 + 1] = c[1]; col[k * 3 + 2] = c[2]; }
    const group = new TH.Group(); let verts = n;
    const lg = new TH.BufferGeometry(); lg.setAttribute('position', new TH.BufferAttribute(pos, 3)); lg.setAttribute('color', new TH.BufferAttribute(col, 3));
    if (byDlog) { const ord = pts.map((q, k) => k).sort((i, j) => DLOG[mod(pts[i][0] + 16 * pts[i][1])] - DLOG[mod(pts[j][0] + 16 * pts[j][1])]); lg.setIndex(new TH.BufferAttribute(new Uint16Array(ord), 1)); }
    const ring = ob.closed ? new TH.LineLoop(lg, new TH.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: opts.opacity != null ? opts.opacity : 0.85 })) : new TH.Line(lg, new TH.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 }));
    ring.frustumCulled = false; group.add(group.ring = ring);
    if (opts.points !== false) {
      const pg = new TH.BufferGeometry(); pg.setAttribute('position', new TH.BufferAttribute(pos.slice(), 3)); pg.setAttribute('color', new TH.BufferAttribute(col.slice(), 3));
      const points = new TH.Points(pg, new TH.PointsMaterial({ size: opts.size || 0.07, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false })); points.frustumCulled = false;
      group.add(group.points = points); verts += n;
    }
    // the start, white, and the first step, the point (c, s) itself when the start is (1, 0), gold
    const mp = new Float32Array(6), mc = new Float32Array([1, 1, 1, 1, 0.84, 0.3]); const p0 = where(0), p1 = where(1 % n); mp.set(p0, 0); mp.set(p1, 3);
    const mg = new TH.BufferGeometry(); mg.setAttribute('position', new TH.BufferAttribute(mp, 3)); mg.setAttribute('color', new TH.BufferAttribute(mc, 3));
    const marks = new TH.Points(mg, new TH.PointsMaterial({ size: (opts.size || 0.07) * 2.2, vertexColors: true, sizeAttenuation: true, depthWrite: false })); marks.frustumCulled = false; group.add(group.marks = marks); verts += 2;
    // the marker that walks the orbit
    const kp = new Float32Array(p0), kc = new Float32Array([0.6, 1, 0.65]);
    const kg = new TH.BufferGeometry(); kg.setAttribute('position', new TH.BufferAttribute(kp, 3)); kg.setAttribute('color', new TH.BufferAttribute(kc, 3));
    const marker = new TH.Points(kg, new TH.PointsMaterial({ size: (opts.size || 0.07) * 4, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false })); marker.frustumCulled = false; group.add(group.marker = marker); verts += 1;
    group.k = 0;
    group.step = k => { k = ((k % n) + n) % n; group.k = k; const p = where(k); kp[0] = p[0]; kp[1] = p[1]; kp[2] = p[2]; kg.attributes.position.needsUpdate = true; return group.at(k); };
    group.at = k => { k = ((k % n) + n) % n; const q = pts[k], uu = mod(q[0] + 16 * q[1]); return { k, x: q[0], y: q[1], cell: q[0], u: uu, dlog: uu ? DLOG[uu] : -1, position: where(k) }; };
    group.userData = { kind: 'turn', c: ob.c, s: ob.s, L: ob.L, u: ob.u, udlog: ob.u ? DLOG[ob.u] : -1, w: ob.w, closed: ob.closed, count: n, points: pts, vertices: verts };
    return group;
  }
  // ── sheet(kind, mult, opts): a smaller relief, 65 × 65 samples (every fourth point), hung above the player or stood as a wall ──
  // kind 'product' (a·b) or 'norm' (a² + ab − b²), or any form of FORMS: 'circle', 'ellipse', 'hyperbola', 'parabola' (the relief's own
  // y² − 4x), 'trace'. mult one of ×½ … ×256, the relief's multipliers (anything else is read as ×1): the height is amp × mult × val/256
  // with amp 0.5 (opts.amp), so ×1 is a relief of half a metre, ×8 four metres, ×16 and beyond passes through the player. opts.place
  // 'ceiling' (default): the sheet level at y = 5 (opts.y) inside the cell sphere, half-side 2.2 (opts.half), a to the right, b
  // ahead, the relief hanging down toward the player ('inward', as the relief's cube inward; opts.outward true lifts it up instead).
  // 'wall': the sheet upright at distance 5 (opts.dist) at azimuth opts.azimuth (radians, 0 ahead), a to the right, b upward, the
  // relief toward the player (opts.outward true turns it away). 'floor': the sheet level at y = −2.4, relief upward, not centred, for a
  // second floor sheet beside norm(). Height 'value' | 'dlog' | 'flat', colour 'dlog' | 'value' | 'vertex', mode 'points' | 'wire' |
  // 'mesh', t the time step, as norm(). obj.setT(t) refills. Vertices: 4225.
  function sheet(kind, m, opts) {
    opts = opts || {}; const f = FORMS[kind]; if (!f) throw new Error('FOLD_RELIEF.sheet: no form ' + kind);
    const place = opts.place || 'ceiling', half = opts.half != null ? opts.half : 2.2, out = !!opts.outward;
    let frame;
    if (place === 'wall') {
      const az = opts.azimuth || 0, d = opts.dist != null ? opts.dist : 5, y = opts.y != null ? opts.y : 0.6, fwd = [Math.sin(az), 0, -Math.cos(az)];
      frame = { o: [fwd[0] * d, y, fwd[2] * d], u: [Math.cos(az), 0, Math.sin(az)], v: [0, 1, 0], nrm: out ? fwd : [-fwd[0], 0, -fwd[2]] };
    } else if (place === 'floor') {
      frame = { o: [0, opts.y != null ? opts.y : -2.4, 0], u: [1, 0, 0], v: [0, 0, -1], nrm: out ? [0, -1, 0] : [0, 1, 0] };
    } else {
      frame = { o: [0, opts.y != null ? opts.y : 5, 0], u: [1, 0, 0], v: [0, 0, -1], nrm: out ? [0, 1, 0] : [0, -1, 0] };
    }
    const g = makeSheet({ name: 'sheet-' + place, formName: kind, form: f, n: 65, step: 4, half, amp: opts.amp != null ? opts.amp : 0.5, mult: mult(m), centred: false,
      height: opts.height || 'value', colour: opts.colour || 'dlog', mode: opts.mode || 'points', size: opts.size || 0.06, opacity: opts.opacity != null ? opts.opacity : 0.9, t: opts.t || 0, frame });
    g.userData.place = place;
    return g;
  }
  // ── dispose(obj): every geometry and material under obj freed; obj removed from its parent ──
  function dispose(obj) {
    if (!obj) return;
    obj.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); });
    if (obj.parent) obj.parent.remove(obj);
  }
  // ── count(obj): the vertices under obj, by the position attributes ──
  function count(obj) { let n = 0; if (obj) obj.traverse(o => { if (o.geometry && o.geometry.attributes && o.geometry.attributes.position) n += o.geometry.attributes.position.count; }); return n; }
  return { P, DLOG, POW, hue, VTX, COL, FORMS, CONIC_FORMS, MULTS, STARS, valueAt, solve, orbit, floor, norm, conic, turn, sheet, dispose, count };
})();
