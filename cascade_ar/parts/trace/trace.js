// THE FOLD — parts/trace: a ray tracer in GF(257). The eye stands at a point of the plane and sends one ray along each of the 256 unit
// directions, THE TURN's orbit (B1); a scene is a few conic sheets of the relief (f(x, y) ≡ r) with a refractive index and an impedance,
// and a few point lights (SEED, the norm's five stars, the player); a ray meets a sheet where a quadratic in t has a root, which it has
// exactly when the discriminant is a residue (the character), the root by the field's own square root; it bounces off the gradient,
// its amplitude multiplied by Γ = (Z − 120)/(Z + 120), or bends by Snell with sin θ the y of the direction; what arrives is summed over
// four bounces and laid on A8's 16 × 16 picture (pixel p = c + 16r), spread by the Airy beam (A14) and kept by the P22 persistence.
// Every number inside is an integer mod 257; only the display reads them as light (value/256) and as the twelve rays' wavelengths (A15).
// Nothing is needed at load: the tables are built here; FOLD_RELIEF's orbit is taken when it is loaded (and check.js asserts the recomputation
// equals it). Pure functions and one builder, the Tile; index.html wires it.
//
//   FOLD_TRACE.dirs(mode)                 the 256 unit directions {X, Y, W, idx}: 'turn' k ↦ u^k (u = 216), 'dlog' k ↦ 3^k, as cells w = x + 16y
//   FOLD_TRACE.hit(form, r, px, py, dx, dy, o)   the nearest hit of p + t·d on f ≡ r: {t, x, y, a, b, c, disc} or null; o.hits 'character' | 'sign'
//   FOLD_TRACE.reflect(dx, dy, nx, ny)    the direction mirrored about the normal, or null on a null normal
//   FOLD_TRACE.refract(dx, dy, n1, n2)    Snell: n1·y1 ≡ n2·y2, or null on total internal reflection
//   FOLD_TRACE.gamma(Z), trans(Z)         Γ and T = 1 + Γ (INF for the pole 137)
//   FOLD_TRACE.scene(S)                   the default scene of a state {sheet, target, current, home}
//   FOLD_TRACE.render(scene, origin, o)   {light: Float32Array(768), hits, bounces, stats}
//   FOLD_TRACE.beam(o), image(light, beam, out), toRGBA(rgb, out), persist(prev, target, T, out)
//   FOLD_TRACE.lightAt(scene, origin, o)  {angle, rgb, energy, coherence, cell} for a GLOW pass (or lightAt(result) of a render in hand)
//   FOLD_TRACE.Tile(canvas, o)            the HUD tile: {set, frame, cycle, mode, modes, stats, ms, o}
window.FOLD_TRACE = (function () {
  'use strict';
  const P = 257, INF = 257, TAU = Math.PI * 2;
  const DLOG = new Int16Array(P).fill(-1), POW = new Uint16Array(256);
  { let a = 1; for (let k = 0; k < 256; k++) { DLOG[a] = k; POW[k] = a; a = a * 3 % P; } }
  const mod = n => ((n % P) + P) % P;
  const inv = n => POW[(256 - DLOG[n]) % 256];                          // n ≠ 0
  const sqrt = n => n === 0 ? 0 : DLOG[n] & 1 ? -1 : POW[DLOG[n] >> 1];  // the principal root, −1 for a non-residue
  const lift = n => n > 128 ? n - P : n;                                 // the signed lift, −128 … 128
  const ray = w => w === 0 ? -1 : DLOG[w] % 12;
  const HALF = 129;                                                      // 2⁻¹
  // the twelve rays as light: ar.js's wavelengthRGB, 377 nm → 610 nm (copied as rays.js copies it, so the tracer needs no three.js)
  function wavelengthRGB(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else { r = 1; }
    const f = nm < 420 ? 0.45 + 0.55 * (nm - 377) / 43 : 1; return [Math.pow(r * f, 0.8), Math.pow(g * f, 0.8), Math.pow(b * f, 0.8)];
  }
  const RAY_RGB = []; for (let r = 0; r < 12; r++) RAY_RGB.push(wavelengthRGB(377 + r * 233 / 11));
  const SEEDC = [0.85, 0.85, 0.8];   // SEED's light, no ray: ar.js's rayColor for 0 and ∞
  // the forms: the relief's six conics as point sets (CONIC_FORMS), each solved for ≡ r
  const FORMS = { product: (x, y) => x * y, hyperbola: (x, y) => x * x - y * y, circle: (x, y) => x * x + y * y, ellipse: (x, y) => x * x + 4 * y * y, parabola: (x, y) => y - x * x, norm: (x, y) => x * x + x * y - y * y };
  const STARS = [[0, 0], [103, 51], [154, 206], [206, 103], [51, 154]];   // the norm's five stars, norms 0 154 154 103 103
  // ── the directions: THE TURN's orbit, (x, y) → (cx − sy, sx + cy) with c = 155 ≡ 4/5, s = 52 ≡ 3/5, all 256 points of x² + y² ≡ 1 ──
  // Read as one number w = x + 16y the turn is ×u, u = c + 16s = 216 = 3^147, so step k is w = u^k; and every w ≠ 0 is a point of the circle,
  // x = (w + w⁻¹)/2, y = (w − w⁻¹)/32, since (x + 16y)(x − 16y) = x² + y². 'turn' orders them by the step k (w = 216^k); 'dlog' by the
  // generator (w = 3^k): the same 256 directions, k_turn = 155·k_dlog mod 256. idx[w] gives a direction's place back.
  function orbit() { let x = 1, y = 0; const pts = []; for (let n = 0; n < 256; n++) { pts.push([x, y]); const nx = mod(155 * x - 52 * y), ny = mod(52 * x + 155 * y); x = nx; y = ny; } return pts; }
  const DIRS = {};
  function dirs(mode) {
    mode = mode === 'dlog' ? 'dlog' : 'turn'; if (DIRS[mode]) return DIRS[mode];
    const X = new Uint16Array(256), Y = new Uint16Array(256), W = new Uint16Array(256), idx = new Uint8Array(P);
    if (mode === 'turn') { const RL = window.FOLD_RELIEF, pts = RL && RL.orbit ? RL.orbit().pts : orbit(); for (let k = 0; k < 256; k++) { X[k] = pts[k][0]; Y[k] = pts[k][1]; } }
    else for (let k = 0; k < 256; k++) { const w = POW[k], wi = inv(w); X[k] = mod((w + wi) * HALF); Y[k] = mod((w - wi) * inv(32)); }
    for (let k = 0; k < 256; k++) { W[k] = mod(X[k] + 16 * Y[k]); idx[W[k]] = k; }
    return DIRS[mode] = { mode, X, Y, W, idx };
  }
  // ── the hit: p + t·d on f ≡ r. f is a quadratic polynomial, so f(p + td) = a t² + b t + c exactly, with a = (f(p + d) + f(p − d) − 2f(p))/2,
  // b = (f(p + d) − f(p − d))/2 and c = f(p) − r; three evaluations of the form, no table of gradients. The discriminant b² − 4ac is a
  // residue (character +1) for two roots (−b ± √disc)/2a by the field's own root POW[dlog/2], zero for the tangent root −b/2a, a non-residue
  // for none; a ≡ 0 (d on the form's null cone) leaves bt + c ≡ 0, one root. A root is read as the integer t in 1 … 256, the steps of d from p;
  // t = 0 is where the ray stands and is not a hit; the nearest hit is the smallest such t. o.hits 'sign' is the real reading instead: the
  // discriminant lifted to −128 … 128 hits when it is ≥ 0, the root by the field's root when it has one and by the integer root ⌊√lift⌉ when it
  // has not; the same for a ≡ 0 ──
  const Q = { a: 0, b: 0, c: 0, disc: 0 };   // the last quadratic solved, for hit()'s report; hitT allocates nothing, as render's inner loop needs
  function hitT(f, r, px, py, dx, dy, sign) {
    const fp = mod(f(px, py)), f1 = mod(f(px + dx, py + dy)), f2 = mod(f(px - dx, py - dy));
    const a = mod((f1 + f2 - 2 * fp) * HALF), b = mod((f1 - f2) * HALF), c = mod(fp - r);
    let t1 = -1, t2 = -1, disc = 0;
    if (a === 0) { if (b === 0) return 0; t1 = mod(-c * inv(b)); }
    else {
      disc = mod(b * b - 4 * a * c); let s = sqrt(disc);
      if (s < 0) { if (!sign || lift(disc) < 0) return 0; s = Math.round(Math.sqrt(lift(disc))); }
      else if (sign && lift(disc) < 0) return 0;
      const h = inv(mod(2 * a)); t1 = mod((-b + s) * h); t2 = mod((-b - s) * h);
    }
    Q.a = a; Q.b = b; Q.c = c; Q.disc = disc;
    return t1 > 0 && (t2 <= 0 || t1 <= t2) ? t1 : t2 > 0 ? t2 : 0;
  }
  function hit(form, r, px, py, dx, dy, o) {
    const t = hitT(typeof form === 'function' ? form : FORMS[form], r, px, py, dx, dy, !!(o && o.hits === 'sign'));
    return t ? { t, x: mod(px + t * dx), y: mod(py + t * dy), a: Q.a, b: Q.b, c: Q.c, disc: Q.disc } : null;
  }
  // the gradient at q, exact for a quadratic: (f(q + e₁) − f(q − e₁))/2 and the same in y
  function grad(form, x, y) { const f = typeof form === 'function' ? form : FORMS[form]; return [mod((f(x + 1, y) - f(x - 1, y)) * HALF), mod((f(x, y + 1) - f(x, y - 1)) * HALF)]; }
  // ── the bounce: d' = d − 2(d·n)/(n·n)·n, an orthogonal reflection, so d'·d' ≡ d·d ≡ 1 and d' is one of the 256; null when n·n ≡ 0 (an isotropic
  // normal, y = ±16x, the light cone of the plane) or n ≡ 0 (the origin of a homogeneous form) ──
  function reflect(dx, dy, nx, ny) {
    const nn = mod(nx * nx + ny * ny); if (nn === 0) return null;
    const k = mod(2 * (dx * nx + dy * ny) * inv(nn)); return [mod(dx - k * nx), mod(dy - k * ny)];
  }
  // ── Snell: sin θ is the y of a unit direction, so n₁y₁ ≡ n₂y₂; the bent direction exists when 1 − y₂² is a residue (or 0), x₂ = ±√(1 − y₂²)
  // with the sign of its lift matched to x₁'s so the ray goes on forward; otherwise total internal reflection (null). n₁ = n₂ gives d back ──
  function refract(dx, dy, n1, n2) {
    const y2 = mod(n1 * dy * inv(n2)), c2 = mod(1 - y2 * y2); let x2 = sqrt(c2); if (x2 < 0) return null;
    if (dx && x2 && lift(dx) * lift(x2) < 0) x2 = P - x2; return [x2, y2];
  }
  // ── Γ = (Z − 120)/(Z + 120), the field's own: Γ(∞) = 1 the open circuit, Γ(120) = 0 matched, Γ(137) = ∞ the pole (the eye swallows), Γ(46) = 46
  // and Γ(92) = 92 the mirrors; T = 1 + Γ = 2Z/(Z + 120). The material's tunnel ×140 (B8) is the cell of the letter T, not a transmission: the
  // field's T is 140 at Z = 247 alone (Γ = 139), and Γ = 140 at Z = 4 (T = 141) ──
  const gamma = Z => Z === INF ? 1 : Z === 137 ? INF : mod((Z - 120) * inv(mod(Z + 120)));
  const trans = Z => { const g = gamma(Z); return g === INF ? INF : mod(1 + g); };
  // ── the scene: the chapter's sheet at the level's target, THE TURN's ring, the two star rings and the inverses' hyperbola; the lights at
  // SEED, the four stars and the eye itself. S: {sheet, target, current, home}; a target of ∞ or none takes the home cell's level ──
  const MODES = { dirs: ['turn', 'dlog'], hits: ['character', 'sign'], colour: ['direction', 'cell'], bounce: ['gamma', 'snell'], pixel: ['index', 'cell'] };
  const DEFAULT = { dirs: 'turn', hits: 'character', colour: 'direction', bounce: 'gamma', pixel: 'index', depth: 4 };
  function scene(S) {
    S = S || {}; const cell = n => n != null && n >= 0 && n < P ? n : null, tg = cell(S.target), hm = cell(S.home), r = tg != null ? tg : hm != null ? hm : 1, Z = tg != null ? tg : INF;
    const form = FORMS[S.sheet] ? S.sheet : 'norm';
    const surfaces = [
      { form, r, n: 3, Z, name: 'the sheet' },                       // the chapter's sheet at the target's level, the generator's index, the target's impedance
      { form: 'circle', r: 1, n: 16, Z: INF, name: 'the turn' },      // THE TURN's ring: the quarter turn's index, the open circuit, Γ = 1
      { form: 'norm', r: 154, n: 5, Z: 46, name: 'the first stars' }, // ±1/√5's ring, 5 the non-residue, the mirror 46
      { form: 'norm', r: 103, n: 103, Z: 92, name: 'the far stars' }, // ±φ/√5's ring, 103 = 1/5, the mirror 92
      { form: 'product', r: 1, n: 2, Z: 120, name: 'the inverses' },  // A9's hyperbola xy ≡ 1, matched: Γ = 0, a black body that still glows
    ];
    const lights = STARS.map(([x, y], i) => ({ x, y, I: i ? mod(x * x + x * y - y * y) : 1, name: i ? 'star ' + i : 'SEED' }));
    const me = cell(S.current); if (me != null && me) lights.push({ x: me, y: 0, I: 1, name: 'the eye' });
    return { surfaces, lights };
  }
  // the light at a hit from the sources: Σ I_s/|q − s|², the inverse square in the field; a null separation (|q − s|² ≡ 0, s on q's light cone,
  // or s = q) carries none
  function emission(lights, x, y) {
    let e = 0; for (const s of lights) { const ddx = x - s.x, ddy = y - s.y, d2 = mod(ddx * ddx + ddy * ddy); if (d2) e += s.I * inv(d2); } return mod(e);
  }
  // ── render: the 256 rays from the origin, each followed through o.depth (4) hits. At hit j with amplitude A_j (a field element, 1 at the eye)
  // the surface sends A_j·T_j·E(q_j) to the eye (bounce 'gamma'; A_j·E(q_j) under 'snell') and the ray goes on with A_{j+1} = A_j·Γ_j, reflected
  // about the gradient ('gamma'), or with A unchanged, bent by Snell into the sheet's index or reflected on total internal reflection ('snell',
  // the medium then the sheet's n). Γ = ∞ (Z = 137) swallows the ray; Γ = 0 ends it after its glow; a null normal ends it. Each glow is read as
  // light value/256 in the colour of a ray: the direction's own cell w = x + 16y under colour 'direction', the hit point's cell x + 16y under
  // 'cell' (SEED's 0 is white). Pixel p = c + 16r carries direction k = p ('index') or the direction whose cell w ≡ p ('cell'; pixel 0 dark,
  // w = 256 unseen). origin [x, y]; null (the eye at ∞) gives no light ──
  function render(sc, origin, o) {
    o = Object.assign({}, DEFAULT, o || {}); const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const D = dirs(o.dirs), light = new Float32Array(768), depth = Math.max(1, Math.min(8, o.depth | 0)), st = { rays: 256, hit: 0, bounces: 0, refract: 0, reflect: 0, absorbed: 0, depth: 0, energy: 0 };
    const S = sc.surfaces, nS = S.length, fs = S.map(s => typeof s.form === 'function' ? s.form : FORMS[s.form]), sign = o.hits === 'sign', byG = o.bounce === 'gamma', byCell = o.colour === 'cell';
    let cx = 0, cy = 0;   // the spins' sum, A37: each direction a spin at dlog(w)·2π/256 weighted by its light
    if (origin) for (let k = 0; k < 256; k++) {
      let px = mod(origin[0]), py = mod(origin[1]), dx = D.X[k], dy = D.Y[k], A = 1, n1 = 1, seen = 0, j = 0;
      const p = o.pixel === 'cell' ? (D.W[k] < 256 ? D.W[k] : -1) : k;
      for (; j < depth && A; j++) {
        let bt = 0, bi = -1;
        for (let i = 0; i < nS; i++) { const t = hitT(fs[i], S[i].r, px, py, dx, dy, sign); if (t && (!bt || t < bt)) { bt = t; bi = i; } }
        if (!bt) break;
        const bs = S[bi], hx = mod(px + bt * dx), hy = mod(py + bt * dy);
        if (!j) st.hit++; if (j + 1 > st.depth) st.depth = j + 1;
        const E = emission(sc.lights, hx, hy), G = byG ? gamma(bs.Z) : 1;
        if (G === INF) { st.absorbed++; st.bounces++; break; }   // the pole: the eye swallows
        const glow = mod(A * (byG ? trans(bs.Z) : 1) * E) / 256, c = byCell ? ray(mod(hx + 16 * hy)) : ray(D.W[k]);
        if (p >= 0 && glow) { const col = c < 0 ? SEEDC : RAY_RGB[c]; light[p * 3] += glow * col[0]; light[p * 3 + 1] += glow * col[1]; light[p * 3 + 2] += glow * col[2]; seen += glow; }
        st.bounces++;
        let nd = null;
        if (!byG) { nd = refract(dx, dy, n1, bs.n); if (nd) { st.refract++; n1 = bs.n; } }
        if (!nd) { const g = grad(fs[bi], hx, hy); nd = reflect(dx, dy, g[0], g[1]); if (nd) st.reflect++; }
        if (!nd) { st.absorbed++; break; }
        A = mod(A * G); if (!A) st.absorbed++;
        px = hx; py = hy; dx = nd[0]; dy = nd[1];
      }
      if (seen) { const th = DLOG[D.W[k]] / 256 * TAU; cx += seen * Math.cos(th); cy += seen * Math.sin(th); st.energy += seen; }
    }
    st.coherence = st.energy ? Math.hypot(cx, cy) / st.energy : 0; st.ms = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;
    return { light, hits: st.hit, bounces: st.bounces, stats: st, modes: o };
  }
  // ── the beam: the Airy disc [2J₁(ρ)/ρ]² as fx.js has it (its series in u = ρ²/16 inside, the asymptotic form past the first dark ring), r = 1 at
  // the first dark ring ρ = 3.8317. beam(o) precomputes, for a size × size raster over the 16 × 16 picture, each output pixel's 3 × 3 source pixels
  // and their weights airy(dist/ring), normalised, read through the CRT barrel p = c(1 + 0.0234|c|²) (o.barrel, 0 for none) and dimmed by the
  // vignette 1 − 0.4r² (o.vignette true); so image() is one gather. size 16 with ring 1.5 spreads the picture in place; 64 is the tile ──
  function airy(r) {
    const rho = r * 3.8317, u = rho * rho * 0.0625, j = 0.5 + u * (-1.0 + u * (0.6666667 + u * (-0.2222222 + u * (0.04444444 + u * (-0.005925926)))));
    const near = 4 * j * j, rs = Math.max(rho, 2.5), cs = Math.cos(rs - 2.3561945 + 0.375 / rs), far = 2.5464791 / (rs * rs * rs) * cs * cs;
    const t = Math.min(1, Math.max(0, (rho - 2.8) / 0.8)), s = t * t * (3 - 2 * t); return near + (far - near) * s;
  }
  function beam(o) {
    o = o || {}; const size = o.size || 64, ring = o.ring || (size > 16 ? 1.0 : 1.5), k = o.barrel == null ? (size > 16 ? 0.0234 : 0) : o.barrel, vig = o.vignette == null ? size > 16 : !!o.vignette;
    const N = size * size, idx = new Int16Array(N * 9), w = new Float32Array(N * 9), gain = new Float32Array(N);
    for (let Y = 0; Y < size; Y++) for (let X = 0; X < size; X++) {
      const q = Y * size + X, cx = (X + 0.5) / size * 2 - 1, cy = (Y + 0.5) / size * 2 - 1, r2 = cx * cx + cy * cy, bx = cx * (1 + k * r2), by = cy * (1 + k * r2);
      const u = (bx + 1) * 8 - 0.5, v = (by + 1) * 8 - 0.5, i0 = Math.round(u), j0 = Math.round(v); let sum = 0, m = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const i = i0 + di, j = j0 + dj, inside = i >= 0 && i < 16 && j >= 0 && j < 16, a = inside ? Math.max(0, airy(Math.hypot(u - i, v - j) / ring)) : 0; idx[q * 9 + m] = inside ? j * 16 + i : 0; w[q * 9 + m] = a; sum += a; m++; }
      const g = (sum > 0 ? 1 / sum : 0) * (vig ? Math.max(0, 1 - 0.4 * r2) : 1); gain[q] = g;
    }
    return { size, N, idx, w, gain, ring, barrel: k, vignette: vig };
  }
  function image(light, bm, out) {
    bm = bm || (image.b16 || (image.b16 = beam({ size: 16 }))); out = out || new Float32Array(bm.N * 3);
    for (let q = 0; q < bm.N; q++) { let r = 0, g = 0, b = 0; for (let m = 0; m < 9; m++) { const a = bm.w[q * 9 + m]; if (!a) continue; const s = bm.idx[q * 9 + m] * 3; r += a * light[s]; g += a * light[s + 1]; b += a * light[s + 2]; } const k = bm.gain[q]; out[q * 3] = r * k; out[q * 3 + 1] = g * k; out[q * 3 + 2] = b * k; }
    return out;
  }
  const toRGBA = (rgb, out, gain) => { const n = rgb.length / 3; out = out || new Uint8ClampedArray(n * 4); gain = gain || 1; for (let q = 0; q < n; q++) { out[q * 4] = rgb[q * 3] * gain * 255; out[q * 4 + 1] = rgb[q * 3 + 1] * gain * 255; out[q * 4 + 2] = rgb[q * 3 + 2] * gain * 255; out[q * 4 + 3] = 255; } return out; };
  // ── the persistence: the P22's F(T) = cos(πT)e^(−0.5T), 1 at T = 0, 0 at T = ½ (fx.js). A new picture is laid at once where it is brighter (the
  // one onset, at the move) and the old one fades under it elsewhere: shown = max(target, prev·F(T)), so between moves every pixel only falls ──
  const persistence = T => T <= 0 ? 1 : T >= 0.5 ? 0 : Math.cos(Math.PI * T) * Math.exp(-0.5 * T);
  function persist(prev, target, T, out) { const f = persistence(T); out = out || new Float32Array(target.length); for (let i = 0; i < target.length; i++) { const a = prev[i] * f; out[i] = a > target[i] ? a : target[i]; } return out; }
  // ── lightAt: the light's vector sum over the directions, each at the azimuth where ar.js stands its cell w (dlog/256 of a turn), for a GLOW pass:
  // angle (radians, 0 ahead, the field's azimuths), rgb (the energy-weighted colour, unit), energy (Σ light), coherence (A37), cell (the brightest
  // direction's w). The first argument is a scene to render, or a render's result ({light, modes}) already in hand ──
  function lightAt(sc, origin, o) {
    const R = sc && sc.light && sc.modes ? sc : render(sc, origin, o), D = dirs(R.modes.dirs), L = R.light; let cx = 0, cy = 0, e = 0, best = -1, bk = -1; const rgb = [0, 0, 0];
    for (let k = 0; k < 256; k++) { const p = R.modes.pixel === 'cell' ? (D.W[k] < 256 ? D.W[k] : -1) : k; if (p < 0) continue; const l = L[p * 3] + L[p * 3 + 1] + L[p * 3 + 2]; if (!l) continue; const th = DLOG[D.W[k]] / 256 * TAU; cx += l * Math.cos(th); cy += l * Math.sin(th); e += l; rgb[0] += L[p * 3]; rgb[1] += L[p * 3 + 1]; rgb[2] += L[p * 3 + 2]; if (l > best) { best = l; bk = k; } }
    const m = Math.max(rgb[0], rgb[1], rgb[2]) || 1;
    return { angle: e ? (Math.atan2(cy, cx) + TAU) % TAU : 0, rgb: rgb.map(x => x / m), energy: e, coherence: e ? Math.hypot(cx, cy) / e : 0, cell: bk >= 0 ? D.W[bk] : -1, stats: R.stats };
  }
  // ── the Tile: a 16 × 16 picture through the Airy beam of o.beam px (64) on a canvas of o.size CSS px (64), redrawn by frame(now) while the
  // persistence runs (o.tau ms to T = ½, 600); under CALM (o.calm, a flag or a function) the new picture stands at once and nothing moves between
  // moves. set(scene, origin, modes?) renders and lays the picture, by the tile's own law unless modes says otherwise; cycle() steps the law
  // through CYCLE, one mapping changed from the default at a time ──
  const CYCLE = [{ name: 'the turn · the character · Γ', m: {} }, { name: 'directions by dlog, ×g', m: { dirs: 'dlog' } }, { name: 'hits by the real sign', m: { hits: 'sign' } }, { name: 'colour by the hit cell', m: { colour: 'cell' } }, { name: 'Snell, no Γ', m: { bounce: 'snell' } }, { name: 'pixel p the cell p', m: { pixel: 'cell' } }];
  function Tile(canvas, o) {
    o = Object.assign({ size: 64, beam: 64, dpr: 1, tau: 600, gain: 0.55, calm: false, cycle: 0 }, o || {});   // gain: a lit pixel's glows sum to about 1.3 a channel over its bounces; 0.55 keeps most under the clamp
    const g = canvas.getContext('2d'), bm = beam({ size: o.beam }), off = document.createElement('canvas'); off.width = off.height = o.beam; const og = off.getContext('2d'), img = og.createImageData(o.beam, o.beam);
    const target = new Float32Array(bm.N * 3), prev = new Float32Array(bm.N * 3), shown = new Float32Array(bm.N * 3);
    let onset = -1e9, drawn = false, ms = 0, stats = null, last = null, ci = o.cycle % CYCLE.length;
    const calmNow = () => typeof o.calm === 'function' ? !!o.calm() : !!o.calm, clock = () => performance.now();
    canvas.width = canvas.height = Math.round(o.size * o.dpr); canvas.style.width = canvas.style.height = o.size + 'px'; g.imageSmoothingEnabled = false;
    const api = {
      get mode() { return Object.assign({}, DEFAULT, CYCLE[ci].m); }, get modeName() { return CYCLE[ci].name; }, get cycleIndex() { return ci; }, modes: MODES, get stats() { return stats; }, get ms() { return ms; }, o, canvas,
      set(sc, origin, m) { const t0 = clock(); last = [sc, origin, m]; const R = render(sc, origin, m ? Object.assign({}, DEFAULT, m) : api.mode); image(R.light, bm, target); prev.set(shown); onset = clock(); drawn = false; stats = R.stats; ms = clock() - t0; return R; },
      frame(now) { now = now == null ? clock() : now; const T = calmNow() ? 0.5 : (now - onset) / (2 * o.tau); if (drawn && T >= 0.5) return api; persist(prev, target, T, shown); toRGBA(shown, img.data, o.gain); og.putImageData(img, 0, 0); g.clearRect(0, 0, canvas.width, canvas.height); g.drawImage(off, 0, 0, canvas.width, canvas.height); drawn = T >= 0.5; return api; },
      cycle(i) { ci = ((i == null ? ci + 1 : i) % CYCLE.length + CYCLE.length) % CYCLE.length; if (last) api.set(last[0], last[1], last[2]); return CYCLE[ci]; },
      shown, target,
    };
    return api;
  }
  return { P, INF, DLOG, POW, FORMS, STARS, RAY_RGB, MODES, DEFAULT, CYCLE, orbit, dirs, hit, grad, reflect, refract, gamma, trans, scene, emission, render, airy, beam, image, toRGBA, persistence, persist, lightAt, Tile, lift, sqrt };
})();
