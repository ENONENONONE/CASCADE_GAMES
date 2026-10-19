// THE FOLD — Sisyphean Heat on the chapter's floor (scope H1–H3; the sketch Sisyphean_Heat.html ported, not loaded). The crowd: a few
// thousand climbers run up the sheet the floor draws, h = V(a, b)·m mod 257 with m = current/target, the ratio of where you stand
// to where you must be (R1's time step), and go over the crest where 256 wraps to 0, the field's own cliff; only their heat is
// drawn, in a floor-space render target that is never cleared, blue climbs whitening with heat, orange-white flares at the crest.
// Every move re-forms the hill and every climber lands on new ground. The white climber: your own climb on the floor, at your
// cell's azimuth and a radius by the solver's distance, a stroke a move. The day's heat: the picture of the day at THE SEAL.
//
//   FOLD_HEAT.terrain(form, m)                   the sheet as Uint16Array(257²), index a + 257·b, values 0 … 256
//   FOLD_HEAT.grad(h, x, y, out)                 the slope under a point: the mean of the two one-step differences each reduced to (−128, 128]
//   FOLD_HEAT.survey(form, m)                    the counts of a sheet: wrap edges, crest and zero cells, gentle cells (check.js, notes.md)
//   FOLD_HEAT.sim(opts)                          the crowd's arithmetic alone, no three: {step, setMul, setForm, freeze, home, stats, x, y, …}
//   FOLD_HEAT.crowd(THREE, renderer, opts)       sim + the heat target: {frame, setMul, setForm, freeze, home, snapshot, stats, texture, layer, dispose}
//   FOLD_HEAT.layer(THREE, floor, texture, opts) the heat carpet: a mesh on the relief floor's own vertices reading the target
//   FOLD_HEAT.mulOf(current, target, F)          m: current/target, current alone with no target in 1 … 256, 0 on SEED, null at ∞ (freeze)
//   FOLD_HEAT.placeOf(cell, d, par, F)           the white climber's place: {az, r} with r = 3·max(0, par − d)/par
//   FOLD_HEAT.climber(THREE, scene, opts)        the white climber: {set, move, fall, reset, frame, dispose}
//   FOLD_HEAT.replay(rec, F)                     a saved climb's road as cells and places, from its start and its ops
//   FOLD_HEAT.counters(climbs)                   the sketch's counters as the day's: climbs, steps, summits, falls
//   FOLD_HEAT.dayPicture(day, ground, opts)      the day's picture (H3) on a canvas; dayText(day) its alt
//   FOLD_HEAT.TIERS                              climbers and target size by device tier
window.FOLD_HEAT = (function () {
  'use strict';
  const P = 257, N2 = P * P;
  const DLOG = new Int16Array(P).fill(-1), POW = new Uint16Array(256);
  { let a = 1; for (let k = 0; k < 256; k++) { DLOG[a] = k; POW[k] = a; a = a * 3 % P; } }
  const mod = n => ((n % P) + P) % P;
  const red = d => { d = mod(d); return d > 128 ? d - P : d; };   // a difference of two values read the short way round, (−128, 128]
  const FORMS = {
    product: (x, y) => x * y, hyperbola: (x, y) => x * x - y * y, circle: (x, y) => x * x + y * y, ellipse: (x, y) => x * x + 4 * y * y,
    parabola: (x, y) => y * y - 4 * x, norm: (x, y) => x * x + x * y - y * y, trace: (a, b) => 2 * a + b,
  };
  const CLIMB = '#2f6fb8', FALL = '#ff6a2a', KEEP = '#8fa796', WHITE = [255, 244, 230];
  const hex = s => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
  const C_CLIMB = hex(CLIMB), C_FALL = hex(FALL);
  // the tiers: the sketch's 3500 and its slider's 500 as 14, 7 and 2 × 256; the target 256² on phones and desktops, 128² below
  const TIERS = { full: { n: 3584, size: 256 }, lowEnd: { n: 1792, size: 128 }, tiny: { n: 512, size: 128 } };
  // ── the terrain ──
  function terrain(form, m, out) {
    const f = typeof form === 'function' ? form : FORMS[form]; if (!f) throw new Error('FOLD_HEAT.terrain: no form ' + form);
    const h = out || new Uint16Array(N2); m = mod(m == null ? 1 : m);
    for (let b = 0; b < P; b++) for (let a = 0; a < P; a++) h[a + P * b] = mod(f(a, b)) * m % P;
    return h;
  }
  const cell = x => { x = Math.round(x) % P; return x < 0 ? x + P : x; };
  const at = (h, x, y) => h[cell(x) + P * cell(y)];
  // the slope under (x, y): for each axis the mean of the step up and the step down from the nearest cell, each reduced, so a cliff
  // (a wrap, 256 → 0) is read as the short way round and never as a 256 drop. A real derivative of the raw values is wrong for every m
  // but ±1, because the sheet wraps on integers
  function grad(h, x, y, out) {
    const a = cell(x), b = cell(y), a1 = a === P - 1 ? 0 : a + 1, a0 = a === 0 ? P - 1 : a - 1, b1 = b === P - 1 ? 0 : b + 1, b0 = b === 0 ? P - 1 : b - 1, v = h[a + P * b];
    out.x = (red(h[a1 + P * b] - v) + red(v - h[a0 + P * b])) / 2; out.y = (red(h[a + P * b1] - v) + red(v - h[a + P * b0])) / 2; return out;
  }
  // the counts of a sheet (the scope's data row): wrap edges are torus neighbour pairs whose values differ by more than 128 (of 2·257²),
  // crest cells hold 256 and zero cells 0, gentle cells have a field gradient (the central difference × 2⁻¹ mod 257, signed) of length ≤ 4
  function survey(form, m) {
    const h = terrain(form, m); let wrap = 0, crest = 0, zero = 0, gentle = 0;
    for (let b = 0; b < P; b++) for (let a = 0; a < P; a++) {
      const v = h[a + P * b], a1 = (a + 1) % P, b1 = (b + 1) % P, a0 = (a + P - 1) % P, b0 = (b + P - 1) % P;
      if (v === 256) crest++; if (v === 0) zero++; if (Math.abs(h[a1 + P * b] - v) > 128) wrap++; if (Math.abs(h[a + P * b1] - v) > 128) wrap++;
      if (Math.hypot(red((h[a1 + P * b] - h[a0 + P * b]) * 129), red((h[a + P * b1] - h[a + P * b0]) * 129)) <= 4) gentle++;
    }
    return { wrap, edges: 2 * N2, crest, zero, gentle };
  }
  // ── the crowd's arithmetic: the sketch's climbers on the sheet, in typed arrays, at 60 steps a second ──
  // The sketch's constants rescaled: its noise is 58.1 times gentler than the norm at 1000/257 px a cell, so the heat gain is 18/58.1
  // = 0.31 and the effort cost 90/58.1 = 1.55 per unit slope (the slope here is |grad|/256, the height in [0, 1] per cell); its speeds
  // are in px a frame, × 257/1000 for cells. Effort 160 ± 30 %; gravity 0.55; the fall's damping 0.965 and its heat × 0.975 a step.
  // A summit is the crest: a step whose height drops by more than 128 has gone over the wrap, and the climber falls with a flare. An
  // exhausted climber lets go and slides back down the slope until it lands (a gentle slope and a slow speed after 12 steps, 260 steps,
  // or the foot of the next wall, a rise of more than 128), and is reborn at the lowest of four samples: anywhere, or near its home.
  // opts: n climbers, form, m (the multiplier, a field element), seed (the day), random own hash or none (xorshift32 from the seed)
  function sim(opts) {
    opts = opts || {}; const n = opts.n || 3584, SC = 257 / 1000;
    const x = new Float32Array(n), y = new Float32Array(n), px = new Float32Array(n), py = new Float32Array(n), vx = new Float32Array(n), vy = new Float32Array(n), effort = new Float32Array(n), heat = new Float32Array(n), wander = new Float32Array(n), age = new Uint16Array(n), fallN = new Uint16Array(n), h0 = new Uint16Array(n), hx = new Float32Array(n), hy = new Float32Array(n), state = new Uint8Array(n), homed = new Uint8Array(n);
    let seed = (opts.seed | 0) || 12345, form = opts.form || 'norm', m = opts.m == null ? 1 : opts.m, frozen = false, flat = false;
    const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) % 1000003) / 1000003; };
    const h = new Uint16Array(N2), g = { x: 0, y: 0 }, stats = { steps: 0, crests: 0, exhausted: 0, landings: 0, lives: 0, lifeSum: 0 };
    const S = { n, x, y, px, py, vx, vy, heat, state, stats, h, get m() { return m; }, get form() { return form; }, get frozen() { return frozen; } };
    const form_ = () => { if (mod(m) === 0) { h.fill(0); flat = true; } else { terrain(form, m, h); flat = false; } for (let i = 0; i < n; i++) h0[i] = at(h, x[i], y[i]); };
    const born = (i, first) => {
      let bx = 0, by = 0, bh = 1e9; const H = homed[i] ? 1 : 0;
      for (let k = 0; k < 4; k++) { let sx, sy; if (H) { const r = rnd() * 12, t = rnd() * Math.PI * 2; sx = hx[i] + Math.cos(t) * r; sy = hy[i] + Math.sin(t) * r; } else { sx = rnd() * P; sy = rnd() * P; } const v = at(h, sx, sy); if (v < bh) { bh = v; bx = sx; by = sy; } }
      x[i] = px[i] = mod(bx); y[i] = py[i] = mod(by); vx[i] = vy[i] = 0; state[i] = 0; effort[i] = 160 * (0.7 + 0.6 * rnd()); heat[i] = 0; wander[i] = rnd() * Math.PI * 2; fallN[i] = 0; age[i] = first ? Math.floor(rnd() * 200) : 0; h0[i] = at(h, x[i], y[i]);
    };
    const letGo = i => { state[i] = 1; fallN[i] = 0; const t = rnd() * Math.PI * 2; vx[i] += Math.cos(t) * 0.6 * SC; vy[i] += Math.sin(t) * 0.6 * SC; };
    const land = i => { stats.landings++; stats.lives++; stats.lifeSum += age[i]; born(i, false); };
    function step() {
      if (frozen) return;
      for (let i = 0; i < n; i++) {
        grad(h, x[i], y[i], g); const slope = Math.hypot(g.x, g.y) / 256, inv = slope > 1e-6 ? 1 / (slope * 256) : 0;
        px[i] = x[i]; py[i] = y[i];
        if (state[i] === 0) {
          wander[i] += (rnd() - 0.5) * 0.5;
          const fx = g.x * inv * 0.9 + Math.cos(wander[i]) * 0.15, fy = g.y * inv * 0.9 + Math.sin(wander[i]) * 0.15;
          vx[i] = (vx[i] + fx * 0.35 * SC) * 0.82; vy[i] = (vy[i] + fy * 0.35 * SC) * 0.82;
          heat[i] = Math.min(1, heat[i] + slope * 0.31); effort[i] -= 1 + slope * 1.55;
          if (flat) heat[i] *= 0.95;
          if (effort[i] <= 0) { stats.exhausted++; letGo(i); }
        } else {
          vx[i] = (vx[i] - g.x * inv * 0.55 * 0.9 * SC) * 0.965; vy[i] = (vy[i] - g.y * inv * 0.55 * 0.9 * SC) * 0.965;
          heat[i] *= 0.975; fallN[i]++;
          const sp = Math.hypot(vx[i], vy[i]);
          if ((slope < 0.07 && sp < 0.35 * SC && fallN[i] > 12) || fallN[i] > 260) { land(i); continue; }
        }
        x[i] += vx[i]; y[i] += vy[i]; age[i]++; stats.steps++;
        let wrapped = false;
        if (x[i] < 0) { x[i] += P; wrapped = true; } else if (x[i] >= P) { x[i] -= P; wrapped = true; }
        if (y[i] < 0) { y[i] += P; wrapped = true; } else if (y[i] >= P) { y[i] -= P; wrapped = true; }
        if (wrapped) { px[i] = x[i]; py[i] = y[i]; }
        const hv = at(h, x[i], y[i]), dh = hv - h0[i]; h0[i] = hv;
        if (state[i] === 0 && dh < -128) { stats.crests++; heat[i] = 1; letGo(i); }   // over the crest: the summit is the cliff
        else if (state[i] === 1 && dh > 128) { land(i); }                              // the foot of the next wall
      }
    }
    S.step = step;
    S.setMul = v => { if (v == null) { frozen = true; return; } frozen = false; const nm = mod(v); if (nm === mod(m) && !flat === (nm !== 0)) return false; m = nm; form_(); return true; };
    S.setForm = f => { if (f === form) return false; form = f; form_(); return true; };
    S.freeze = on => { frozen = !!on; };
    S.home = (ax, ay, share) => { const k = Math.max(0, Math.min(n, Math.round(n * (share == null ? 1 / 64 : share)))); for (let j = 0; j < k; j++) { const i = Math.floor(rnd() * n); homed[i] = 1; hx[i] = mod(ax); hy[i] = mod(ay); } return k; };
    S.meanLife = () => stats.lives ? stats.lifeSum / stats.lives : 0;
    S.at = (a, b) => at(h, a, b);
    form_(); for (let i = 0; i < n; i++) born(i, true);
    return S;
  }
  // ── m, the multiplier: where you stand over where you must be ──
  function mulOf(current, target, F) {
    const INF = F ? F.INF : 257;
    if (current === INF) return null;                                             // at ∞ the crowd freezes until Γ(∞) = 1
    if (current === 0) return 0;                                                  // on SEED the floor lies flat and the heat dies
    if (target == null || target === INF || target === 0) return mod(current);   // no target in 1 … 256: your own cell, R1's base 1
    return mod(current * POW[(256 - DLOG[target]) % 256]);
  }
  // ── the crowd with its heat target: 256² (or 128²) RGBA8, never cleared, a 7/255 fade and a 1/255 subtract a frame, one additive
  // LineSegments of the strokes in the sketch's colours. XR is turned off round the pass (r128 swaps in the XR camera whenever
  // xr.enabled && isPresenting); autoClear and the clear colour are restored ──
  const COLS = { climb: C_CLIMB, fall: C_FALL };
  function crowd(THREE, renderer, opts) {
    opts = opts || {}; const tier = TIERS[opts.tier] || TIERS.full, n = opts.n || tier.n, size = opts.size || tier.size;
    const sm = sim({ n, form: opts.form, m: opts.m, seed: opts.seed });
    const rt = new THREE.WebGLRenderTarget(size, size, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, type: THREE.UnsignedByteType, depthBuffer: false, stencilBuffer: false, generateMipmaps: false });
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(0, P, P, 0, -1, 1);
    const quad = new THREE.PlaneGeometry(P, P); quad.translate(P / 2, P / 2, 0);
    const fade = new THREE.Mesh(quad, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 7 / 255, depthTest: false, depthWrite: false }));
    const sub = new THREE.Mesh(quad, new THREE.MeshBasicMaterial({ color: new THREE.Color(1 / 255, 1 / 255, 1 / 255), transparent: true, blending: THREE.CustomBlending, blendEquation: THREE.ReverseSubtractEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, depthTest: false, depthWrite: false }));
    const pos = new Float32Array(n * 4), col = new Uint8Array(n * 8);
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(pos, 2)); lg.setAttribute('tint', new THREE.BufferAttribute(col, 4, true));
    const lines = new THREE.LineSegments(lg, new THREE.ShaderMaterial({
      vertexShader: 'attribute vec4 tint; varying vec4 vT; void main() { vT = tint; gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: 'precision mediump float; varying vec4 vT; void main() { gl_FragColor = vec4(vT.rgb * vT.a, 1.0); }',
      blending: THREE.AdditiveBlending, transparent: true, depthTest: false, depthWrite: false }));
    lines.frustumCulled = false; fade.renderOrder = 0; sub.renderOrder = 1; lines.renderOrder = 2; scene.add(fade, sub, lines);
    // the strokes' alpha: the sketch's 22 + 40·heat (a climb) and 40 + 120·heat (a fall) of 255, at 0.8 px on a 1000 px canvas; here a
    // stroke is a whole texel of 256 (or 128), so the coverage a frame is many times the sketch's and the alpha is scaled by 0.3, and
    // by the fourth root of 3584/n on the smaller crowds so a thin crowd still marks the ground (opts.alpha overrides the 0.3)
    const gain = (opts.alpha != null ? opts.alpha : 0.3) * Math.pow(3584 / n, 0.25) * (256 / size), clear = new THREE.Color(); let acc = 0, cost = [], governor = opts.governor !== false;
    const paint = () => {
      const { x, y, px, py, heat, state } = sm;
      for (let i = 0; i < n; i++) {
        const k = i * 4, c = i * 8, hv = heat[i], f = state[i] === 1, base = f ? C_FALL : C_CLIMB, w = f ? hv * 0.7 : hv * 0.45, a = Math.min(255, (f ? 40 + hv * 120 : 22 + hv * 40) * gain);
        pos[k] = px[i]; pos[k + 1] = py[i]; pos[k + 2] = x[i]; pos[k + 3] = y[i];
        const r = base[0] + (WHITE[0] - base[0]) * w, g = base[1] + (WHITE[1] - base[1]) * w, b = base[2] + (WHITE[2] - base[2]) * w;
        col[c] = col[c + 4] = r; col[c + 1] = col[c + 5] = g; col[c + 2] = col[c + 6] = b; col[c + 3] = col[c + 7] = a;
      }
      lg.attributes.position.needsUpdate = true; lg.attributes.tint.needsUpdate = true;
    };
    // frame(dt): the steps owed at 60 Hz (at most 3), the strokes, then the pass into the target; nothing while frozen
    function frame(dt) {
      if (sm.frozen) return 0;
      acc += Math.min(0.1, dt || 1 / 60); let k = 0; const t0 = performance.now();
      while (acc >= 1 / 60 && k < 3) { sm.step(); acc -= 1 / 60; k++; }
      if (!k) return 0;
      if (governor) { cost.push((performance.now() - t0) / k); if (cost.length >= 30) { const mean = cost.reduce((a, b) => a + b, 0) / cost.length; cost = []; if (mean > 2.1 && n > 256) governor = false; } }   // a slow device: the cost is reported, the page may rebuild smaller
      paint();
      const xr = renderer.xr.enabled, auto = renderer.autoClear; renderer.getClearColor(clear); const alpha = renderer.getClearAlpha();
      renderer.xr.enabled = false; renderer.autoClear = false; renderer.setRenderTarget(rt); renderer.render(scene, cam); renderer.setRenderTarget(null);
      renderer.xr.enabled = xr; renderer.autoClear = auto; renderer.setClearColor(clear, alpha);
      return k;
    }
    // snapshot(ctx, alpha): the target read back and blended into a 2-D canvas (the day's ground, H3), b upward
    const px8 = new Uint8Array(size * size * 4); let tmp = null;
    function snapshot(ctx, alpha) {
      renderer.readRenderTargetPixels(rt, 0, 0, size, size, px8);
      if (!tmp) { tmp = document.createElement('canvas'); tmp.width = tmp.height = size; }
      const g = tmp.getContext('2d'), img = g.createImageData(size, size); img.data.set(px8); for (let i = 3; i < img.data.length; i += 4) img.data[i] = 255; g.putImageData(img, 0, 0);
      const W = ctx.canvas.width, H = ctx.canvas.height; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = alpha == null ? 0.5 : alpha; ctx.translate(0, H); ctx.scale(1, -1); ctx.drawImage(tmp, 0, 0, W, H); ctx.restore();
    }
    const home = (az, share) => { const d = Math.max(Math.abs(Math.sin(az)), Math.abs(Math.cos(az))) || 1; return sm.home(128.5 + Math.sin(az) / d * 120, 128.5 + Math.cos(az) / d * 120, share); };   // the floor's edge under an azimuth: a to the right, b ahead
    function dispose() { rt.dispose(); quad.dispose(); lg.dispose(); fade.material.dispose(); sub.material.dispose(); lines.material.dispose(); }
    return { frame, setMul: sm.setMul, setForm: sm.setForm, freeze: sm.freeze, home, snapshot, stats: sm.stats, sim: sm, texture: rt.texture, size, n, get slow() { return !governor; }, dispose };
  }
  // ── the heat carpet on the relief floor: a mesh over the floor body's own position attribute (so RELIEF's refills move it too),
  // reading the target by (a, b) from x and z, additive, so black heat adds nothing. Not for the zone plate, whose samples are sorted
  // by radius (no grid order) ──
  function layer(THREE, floor, texture, opts) {
    opts = opts || {}; const body = floor && floor.body; if (!body || floor.setRadius || !floor.userData || !floor.userData.n) return null;
    const n = floor.userData.n, half = opts.half != null ? opts.half : 2, idx = new Uint32Array((n - 1) * (n - 1) * 6); let q = 0;
    for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) { const a = j * n + i, b = a + 1, c = a + n, d = c + 1; idx[q++] = a; idx[q++] = c; idx[q++] = b; idx[q++] = b; idx[q++] = c; idx[q++] = d; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', body.geometry.attributes.position); geo.setIndex(new THREE.BufferAttribute(idx, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { heat: { value: texture }, gain: { value: opts.gain != null ? opts.gain : 1.0 }, hs: { value: half }, lift: { value: 0.012 } },   // `half` is reserved in GLSL ES 1.00
      vertexShader: 'uniform float hs; uniform float lift; varying vec2 vUv; void main() { vUv = vec2(position.x / (2.0 * hs) + 0.5, -position.z / (2.0 * hs) + 0.5); gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y + lift, position.z, 1.0); }',
      fragmentShader: 'precision mediump float; uniform sampler2D heat; uniform float gain; varying vec2 vUv; void main() { vec3 c = texture2D(heat, vUv).rgb; gl_FragColor = vec4(c * gain, 1.0); }',
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 1; floor.add(mesh);
    mesh.dispose = () => { geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3)); geo.dispose(); mat.dispose(); if (mesh.parent) mesh.parent.remove(mesh); };
    return mesh;
  }
  // ── the white climber (H2): at your cell's azimuth, the same as its billboard's, at radius 3·max(0, par − d)/par, so the start is the
  // centre and the target's tick on the rim is the summit; a stroke a move in the move's colour, whitened by its heat; a loss or a run
  // past the slack lets it slide orange to the centre ──
  const RIM = 3, Y = -2.35;
  function placeOf(n, d, par, F) {
    const INF = F ? F.INF : 257, dl = n === 0 || n === INF ? -1 : DLOG[n];
    const az = dl < 0 ? 0 : dl / 256 * Math.PI * 2, r = par > 0 && d != null && dl >= 0 ? RIM * Math.max(0, par - d) / par : 0;
    return { az, r, x: Math.sin(az) * r, z: -Math.cos(az) * r };
  }
  function climber(THREE, scene, opts) {
    opts = opts || {}; const MAX = opts.max || 20, trail = [], P3 = new Float32Array(MAX * 6), C3 = new Float32Array(MAX * 6);
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(P3, 3)); tg.setAttribute('color', new THREE.BufferAttribute(C3, 3)); tg.setDrawRange(0, 0);
    const lines = new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false })); lines.frustumCulled = false; lines.renderOrder = 3;
    const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    const head = new THREE.Points(hg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true, transparent: true, opacity: 0.95, depthTest: false, depthWrite: false })); head.frustumCulled = false; head.renderOrder = 4;
    const group = new THREE.Group(); group.add(lines, head); group.visible = false; if (scene) scene.add(group);
    let here = { az: 0, r: 0, x: 0, z: 0 }, slide = null;
    const put = p => { hg.attributes.position.array.set([p.x, Y, p.z]); hg.attributes.position.needsUpdate = true; };
    const refill = () => { const k = trail.length; for (let i = 0; i < k; i++) { const s = trail[i]; P3.set([s.a.x, Y, s.a.z, s.b.x, Y, s.b.z], i * 6); C3.set([s.c[0], s.c[1], s.c[2], s.c[0], s.c[1], s.c[2]], i * 6); } tg.setDrawRange(0, k * 2); tg.attributes.position.needsUpdate = true; tg.attributes.color.needsUpdate = true; };
    const tint = (kind, h) => { const base = kind === 'up' ? C_CLIMB : kind === 'down' || kind === 'undo' ? C_FALL : hex(KEEP), w = kind === 'keep' ? 0.3 * h : 0.6 * h; return [0, 1, 2].map(i => (base[i] + (255 - base[i]) * w) / 255); };
    const api = {
      group, get place() { return here; },
      set(p) { here = p; put(p); group.visible = true; slide = null; },
      reset() { trail.length = 0; refill(); slide = null; group.visible = false; },
      // move(to, kind, heat): a stroke from where it stood to `to`, kind 'up' | 'keep' | 'down' | 'undo' | 'free', heat the move's 0 … 1
      move(to, kind, h) { if (kind !== 'free') { trail.push({ a: here, b: to, c: tint(kind, h || 0) }); while (trail.length > MAX) trail.shift(); refill(); } here = to; put(to); group.visible = true; slide = null; },
      // fall(now): an orange slide to the centre over 0.6 s; frame(now) runs it
      fall(now) { if (!group.visible || here.r === 0) return; slide = { from: here, t0: now || performance.now() }; },
      frame(now) { if (!slide) return; const t = Math.min(1, ((now || performance.now()) - slide.t0) / 600), e = t * t, f = slide.from, p = { az: f.az, r: f.r * (1 - e), x: f.x * (1 - e), z: f.z * (1 - e) }; put(p); here = p; if (t >= 1) { trail.push({ a: f, b: p, c: C_FALL.map(v => v / 255) }); while (trail.length > MAX) trail.shift(); refill(); slide = null; } },
      dispose() { tg.dispose(); hg.dispose(); lines.material.dispose(); head.material.dispose(); if (group.parent) group.parent.remove(group); },
    };
    return api;
  }
  // ── the day's heat (H3) ──
  // a climb record (game.js S.climbs): {L, s, t, par, slack, ops (one character a move: g G f i q r x), free (the characters of the
  // level's free moves, '' where they count), d (the solver's distance before the first move and after each), out (the stars, 'lost'
  // or 'reborn'), moves (the counted ones), undos}
  const CHOP = { g: 'g', G: 'ig', f: 'fold', i: 'inv', q: 'i', r: 'gam', x: 'flip' };
  function replay(rec, F) {
    const cells = [rec.s]; let c = rec.s;
    for (const ch of rec.ops || '') { const o = F.OP[CHOP[ch]]; if (!o) break; c = o.f(c); cells.push(c); }
    const d = rec.d || [], places = cells.map((n, i) => placeOf(n, d[i] != null ? d[i] : (i ? d[d.length - 1] : rec.par), rec.par, F));
    return { cells, places };
  }
  const heatOf = (a, b, F) => { const x = F.dlog(a), y = F.dlog(b); if (x < 0 || y < 0) return 1; const d = Math.abs(x - y) % 256; return Math.min(d, 256 - d) / 128; };
  // the sketch's counters with the game's meanings: climbs are levels played, steps the counted moves, summits the closes at par, falls
  // the losses and the undos
  function counters(climbs) {
    const c = { climbs: 0, steps: 0, summits: 0, falls: 0 };
    for (const r of climbs || []) { c.climbs++; c.steps += r.moves || 0; if (r.out !== 'lost' && r.par != null && r.moves <= r.par) c.summits++; if (r.out === 'lost') c.falls++; c.falls += r.undos || 0; }
    return c;
  }
  // dayPicture(day, ground, opts): day {climbs, targets, reborn: [levels], parDay (the three-star day's moves, optional), F}, ground a
  // canvas of the crowd's heat (snapshot) or null; opts.size (514, 2 px a cell). The day's climbs in the radar layout over the ground,
  // the crown (a white dot on the rim at each closed cell's azimuth, dim when reborn), an orange streak to the centre for each loss
  function dayPicture(day, ground, opts) {
    opts = opts || {}; const F = day.F, size = opts.size || 514, cv = opts.canvas || document.createElement('canvas'); cv.width = cv.height = size;
    const g = cv.getContext('2d'), cx = size / 2, cy = size / 2, R = size / 2 - 7, sc = R / RIM;
    g.fillStyle = '#0a0d10'; g.fillRect(0, 0, size, size);
    if (ground) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.9; g.imageSmoothingEnabled = true; g.drawImage(ground, 0, 0, size, size); g.restore(); }
    g.save(); g.globalCompositeOperation = 'lighter';
    g.strokeStyle = 'rgba(63,138,82,0.55)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(63,138,82,0.18)'; for (let r = 0; r < 12; r++) { const a = r / 12 * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(a) * R, cy - Math.cos(a) * R); g.stroke(); }
    const XY = p => [cx + p.x * sc, cy + p.z * sc];
    for (const rec of day.climbs || []) {
      const { cells, places } = replay(rec, F), d = rec.d || [], free = rec.free || '';
      for (let i = 1; i < places.length; i++) {
        if (free.includes((rec.ops || '')[i - 1])) continue;   // a free move costs nothing and draws nothing, as the climber on the floor
        const d0 = d[i - 1], d1 = d[i], kind = d1 < d0 ? 'up' : d1 === d0 ? 'keep' : 'down', h = heatOf(cells[i - 1], cells[i], F), base = kind === 'up' ? C_CLIMB : kind === 'down' ? C_FALL : hex(KEEP), w = (kind === 'keep' ? 0.3 : 0.6) * h;
        const c = base.map(v => Math.round(v + (255 - v) * w)), a = XY(places[i - 1]), b = XY(places[i]);
        g.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (kind === 'keep' ? 0.45 : 0.7) + ')'; g.lineWidth = kind === 'keep' ? 1 : 1.6; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      if (rec.out === 'lost') { const a = XY(places[places.length - 1]); g.strokeStyle = 'rgba(255,106,42,0.75)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(cx, cy); g.stroke(); }
    }
    const reborn = new Set(day.reborn || []);
    (day.climbs || []).forEach(rec => { if (rec.out === 'lost' || rec.t == null) return; const p = placeOf(rec.t, 0, 1, F); if (p.r === 0 && rec.t !== 0) return; const q = rec.t === 0 ? [cx, cy] : [cx + Math.sin(p.az) * R, cy - Math.cos(p.az) * R]; g.fillStyle = reborn.has(rec.L) || rec.out === 'reborn' ? 'rgba(255,255,255,0.45)' : '#ffffff'; g.beginPath(); g.arc(q[0], q[1], 2.6, 0, Math.PI * 2); g.fill(); });
    g.restore();
    const c = counters(day.climbs); g.fillStyle = '#8fa796'; g.font = '12px ui-monospace, Menlo, Consolas, monospace'; g.textAlign = 'center';
    g.fillText('climbs ' + c.climbs + ' · steps ' + c.steps + (day.parDay ? ' of ' + day.parDay : '') + ' · summits ' + c.summits + ' · falls ' + c.falls, cx, size - 9);
    return cv;
  }
  function dayText(day) { const c = counters(day.climbs), crown = (day.climbs || []).filter(r => r.out !== 'lost').length; return 'the day\'s heat: ' + c.climbs + ' climbs, ' + c.steps + ' steps' + (day.parDay ? ' of ' + day.parDay : '') + ', ' + c.summits + ' summits, ' + c.falls + ' falls; the crown of ' + crown + ' closed cells on the rim'; }
  return { P, DLOG, POW, FORMS, TIERS, CLIMB, FALL, KEEP, red, terrain, at, grad, survey, sim, mulOf, crowd, layer, placeOf, climber, replay, counters, dayPicture, dayText, heatOf };
})();
