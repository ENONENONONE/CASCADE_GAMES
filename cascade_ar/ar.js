// THE FOLD — the field drawn round the player, and moved by its own operations.
//
// The 256 nonzero cells stand on a sphere of radius 6 m about the viewer: azimuth 2π·dlog/256, the generator's cycle as the horizon,
// the band by ray (dlog mod 12) from 34° below the horizon to 58° above. SEED, cell 0, lies at the floor's centre and ∞ at the zenith.
// An operation of the field is a permutation of the 258 points, and that is how it is shown: every cell travels from the place of its
// preimage to its own place, the whole sky flowing along the operation's arcs and settling exactly where it stood, the player's cell
// having arrived from where it came. ×g slides the cycle one tick, the fold swaps the two halves, ×i turns a quarter, the inverse
// mirrors, Γ warps. The player stands still; the field moves.
//
// Each cell is one instanced quad: a halo in its ray's own colour (the machine's twelve rays, 377 nm to 610 nm), steady for a
// residue and shimmering for a non-residue, the glyph pair and number and first word from a text atlas drawn once; the gold cells of
// the order-4 subgroup burn gold, the pole 137 is an eye, Γ's fixed points 46 and 92 are mirrors. One draw call for the cells, one
// for the π ribbon, one for the π tape's rain behind them, a few lines. Light enough for a phone, a Pi or an RK3588.
window.AR = (function () {
  'use strict';
  const F = window.FIELD, T = window.THREE;
  const R = 6, SLOT = 128, COLS = 18, ROWS = 16;
  const A = {};
  const GOLD = new Set([1, 16, 256, 241]), MIRRORS = new Set([46, 92]), EYE = 137;
  // ── the rays as light: twelve wavelengths from 377 nm to 610 nm, as the machine names them ──
  function wavelengthRGB(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else { r = 1; }
    const f = nm < 420 ? 0.45 + 0.55 * (nm - 377) / 43 : 1; return [Math.pow(r * f, 0.8), Math.pow(g * f, 0.8), Math.pow(b * f, 0.8)];
  }
  const RAY_RGB = []; for (let r = 0; r < 12; r++) RAY_RGB.push(wavelengthRGB(377 + r * (610 - 377) / 11));
  const rayColor = n => { const r = F.ray(n); return r < 0 ? [0.85, 0.85, 0.8] : RAY_RGB[r]; };
  // ── where a point of the line stands ──
  function place(n) {
    if (n === 0) return new T.Vector3(0, -2.4, 0);
    if (n === F.INF) return new T.Vector3(0, R, 0);
    const d = F.DLOG[n], az = d / 256 * Math.PI * 2, el = (-34 + (d % 12) * (92 / 11)) * Math.PI / 180;
    return new T.Vector3(Math.sin(az) * Math.cos(el) * R, Math.sin(el) * R, -Math.cos(az) * Math.cos(el) * R);
  }
  // ── the atlas: the 258 points and the ten opcodes, drawn once ──
  function atlas(cells) {
    const cv = document.createElement('canvas'); cv.width = COLS * SLOT; cv.height = ROWS * SLOT; const g = cv.getContext('2d');
    g.clearRect(0, 0, cv.width, cv.height); g.textAlign = 'center';
    const slot = (i, lines, kind) => {
      const x = (i % COLS) * SLOT + SLOT / 2, y = Math.floor(i / COLS) * SLOT, cy = y + SLOT / 2;
      if (kind === 'eye') {   // the pole: an eye, its pupil the point that goes to infinity
        g.strokeStyle = 'rgba(201,168,76,0.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 56, cy); g.quadraticCurveTo(x, cy - 44, x + 56, cy); g.quadraticCurveTo(x, cy + 44, x - 56, cy); g.stroke();
        g.fillStyle = 'rgba(201,168,76,0.25)'; g.beginPath(); g.arc(x, cy, 22, 0, Math.PI * 2); g.fill();
      } else if (kind === 'mirror') {   // Γ's fixed points: a mirror, the glyphs and their reflection
        g.strokeStyle = 'rgba(127,184,255,0.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 10); g.lineTo(x, y + SLOT - 10); g.stroke();
        g.strokeStyle = 'rgba(127,184,255,0.25)'; g.beginPath(); g.ellipse(x, cy, 54, 50, 0, 0, Math.PI * 2); g.stroke();
      } else if (kind === 'gold') {     // the quarter turns: a gold ring
        g.strokeStyle = 'rgba(255,215,120,0.95)'; g.lineWidth = 3; g.beginPath(); g.arc(x, cy, 54, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = 'rgba(255,215,120,0.35)'; g.lineWidth = 1; g.beginPath(); g.arc(x, cy, 46, 0, Math.PI * 2); g.stroke();
      } else if (kind === 'inf') {
        g.strokeStyle = 'rgba(232,243,228,0.8)'; g.lineWidth = 2; g.beginPath(); g.arc(x, cy, 56, 0, Math.PI * 2); g.stroke();
      }
      g.fillStyle = kind === 'gold' ? '#ffe6a6' : '#eef7ea'; g.font = '600 42px "SF Mono", Menlo, "DejaVu Sans Mono", monospace'; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 6; g.fillText(lines[0], x, y + 58);
      g.fillStyle = '#c9a84c'; g.font = '500 20px "SF Mono", Menlo, monospace'; g.fillText(lines[1], x, y + 84);
      g.fillStyle = '#b9d9bd'; g.font = '13px system-ui, sans-serif'; g.fillText(lines[2], x, y + 108); g.shadowBlur = 0;
    };
    for (let n = 0; n < 257; n++) slot(n, [F.glyphs(n), String(n), (cells[n].w.length > 16 ? cells[n].w.slice(0, 15) + '…' : cells[n].w)], n === EYE ? 'eye' : MIRRORS.has(n) ? 'mirror' : GOLD.has(n) ? 'gold' : '');
    slot(257, ['∞', '1/0', 'the open circuit'], 'inf');
    for (let d = 0; d < 10; d++) slot(258 + d, [String(d), F.OPCODES[d], 'opcode']);
    const tex = new T.CanvasTexture(cv); tex.minFilter = T.LinearFilter; tex.magFilter = T.LinearFilter; tex.generateMipmaps = false; return tex;
  }
  const uvOf = i => { const c = i % COLS, r = Math.floor(i / COLS); return [c / COLS, 1 - (r + 1) / ROWS, (c + 1) / COLS, 1 - r / ROWS]; };
  // ── instanced quads: a halo and the atlas text; each travels from iFrom to iPos as the uniform `flow` runs 0 → 1 ──
  function billboards(count, tex, size) {
    const FX = window.FOLD_FX, airyGL = FX && FX.halo ? FX.halo() : '';   // the Airy disc as the halo when the shader module is loaded
    const geo = new T.InstancedBufferGeometry(); const base = new T.PlaneBufferGeometry(size, size);
    geo.setAttribute('position', base.getAttribute('position')); geo.setAttribute('uv', base.getAttribute('uv')); geo.setIndex(base.getIndex());
    const pos = new Float32Array(count * 3), from = new Float32Array(count * 3), uv = new Float32Array(count * 4), col = new Float32Array(count * 3), st = new Float32Array(count), born = new Float32Array(count), seed = new Float32Array(count);
    for (let i = 0; i < count; i++) { seed[i] = Math.random() * 6.28; born[i] = -10; }
    geo.setAttribute('iPos', new T.InstancedBufferAttribute(pos, 3)); geo.setAttribute('iFrom', new T.InstancedBufferAttribute(from, 3)); geo.setAttribute('iUV', new T.InstancedBufferAttribute(uv, 4));
    geo.setAttribute('iCol', new T.InstancedBufferAttribute(col, 3)); geo.setAttribute('iState', new T.InstancedBufferAttribute(st, 1)); geo.setAttribute('iBorn', new T.InstancedBufferAttribute(born, 1)); geo.setAttribute('iSeed', new T.InstancedBufferAttribute(seed, 1));
    const mat = new T.ShaderMaterial({
      uniforms: { map: { value: tex }, time: { value: 0 }, flow: { value: 1 }, ease: { value: 0 }, halo: { value: 1 } }, transparent: true, depthWrite: false,
      vertexShader: `attribute vec3 iPos; attribute vec3 iFrom; attribute vec4 iUV; attribute vec3 iCol; attribute float iState; attribute float iBorn; attribute float iSeed;
        uniform float time; uniform float flow; uniform float ease;
        varying vec2 vUv; varying vec2 vQ; varying vec3 vCol; varying float vA; varying float vS; varying float vSeed;
        void main(){
          vUv = vec2(mix(iUV.x, iUV.z, uv.x), mix(iUV.y, iUV.w, uv.y)); vQ = uv * 2.0 - 1.0; vCol = iCol; vS = iState; vSeed = iSeed;
          float s = 1.0; vA = 1.0;
          if (iState > 0.5 && iState < 1.5) s = 1.4 + 0.1 * sin(time * 5.0);
          if (iState > 1.5 && iState < 2.5) s = 1.3 + 0.08 * sin(time * 3.0 + 1.0);
          if (iState > 2.5 && iState < 3.5) s = 1.1;
          if (iState > 3.5 && iState < 4.5) vA = 0.6;
          if (iState > 4.5 && iState < 5.5) s = 1.15;   // 1 current, 2 target, 3 home, 4 visited, 5 reach, each in its own bracket: a state 6 or above draws plain until it has a line
          float b = clamp((time - iBorn) / 0.5, 0.0, 1.0); s *= 0.2 + 0.8 * b; vA *= b;   // born: a cell blooms in
          // the flow: along the chord from where the cell came to where it stands, lifted so it rides the sphere, eased; ease 1 eases
          // the ease again, the slow-in, slow-out of bullet time (M4)
          float t = clamp(flow, 0.0, 1.0); float e = t * t * (3.0 - 2.0 * t); e = mix(e, e * e * (3.0 - 2.0 * e), ease);
          vec3 p = mix(iFrom, iPos, e); float ra = mix(length(iFrom), length(iPos), e); if (length(p) > 0.01) p = normalize(p) * ra;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); mv.xyz += position * s;
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform sampler2D map; uniform float time; uniform float halo;
        varying vec2 vUv; varying vec2 vQ; varying vec3 vCol; varying float vA; varying float vS; varying float vSeed;
` + airyGL + `
        void main(){
          vec4 c = texture2D(map, vUv);
          float d = length(vQ);
          #ifdef FOLD_AIRY
          float h = airyGlow(d * 2.655, 0.45) * (vS > 0.5 && vS < 1.5 ? 1.0 : 0.55);   // the Airy disc: the first dark ring near the quad's edge
          #else
          float h = exp(-d * d * 4.0) * (vS > 0.5 && vS < 1.5 ? 1.0 : 0.55);
          #endif
          float shimmer = 1.0; if (vSeed > 3.1416) shimmer = 0.75 + 0.25 * sin(time * 2.3 + vSeed * 3.0);   // the non-residues breathe
          vec3 hc = vCol * h * halo * shimmer;
          float a = max(c.a, h * 0.85 * halo);
          vec3 rgb = c.rgb * (0.65 + 0.35 * vCol) * c.a + hc * (1.0 - c.a * 0.6);
          if (a < 0.03) discard; gl_FragColor = vec4(rgb, a * vA); }`
    });
    const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; return { mesh, geo, pos, from, uv, col, st, born, seed, count };
  }
  function setInst(b, i, p, uvi, c, s) { b.pos.set([p.x, p.y, p.z], i * 3); b.from.set([p.x, p.y, p.z], i * 3); b.uv.set(uvOf(uvi), i * 4); b.col.set(c, i * 3); b.st[i] = s; }
  function flag(b) { for (const k of ['iPos', 'iFrom', 'iUV', 'iCol', 'iState', 'iBorn']) b.geo.getAttribute(k).needsUpdate = true; }
  // ── an arc on the sphere between two points of the line ──
  function arc(a, b, n) {
    const out = []; const qa = a.clone().normalize(), qb = b.clone().normalize(); const ang = Math.acos(Math.max(-1, Math.min(1, qa.dot(qb))));
    for (let i = 0; i <= n; i++) { const t = i / n; let v; if (ang < 1e-4) v = qa.clone(); else v = qa.clone().multiplyScalar(Math.sin((1 - t) * ang) / Math.sin(ang)).add(qb.clone().multiplyScalar(Math.sin(t * ang) / Math.sin(ang)));
      const r = a.length() * (1 - t) + b.length() * t; out.push(v.multiplyScalar(r)); }
    return out;
  }
  const lineOf = (pts, color, opacity) => new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color, transparent: true, opacity }));
  const segsOf = (pts, color, opacity) => new T.LineSegments(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color, transparent: true, opacity }));
  // ── build ──
  function init(canvas, cells) {
    A.cells = cells; A.renderer = new T.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
    A.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); A.renderer.setClearColor(0x000000, 0);
    A.scene = new T.Scene(); A.camera = new T.PerspectiveCamera(70, 1, 0.05, 80); A.rig = new T.Object3D(); A.rig.add(A.camera); A.scene.add(A.rig);
    A.tex = atlas(cells);
    A.cellB = billboards(258, A.tex, 0.66); A.scene.add(A.cellB.mesh);
    for (let n = 0; n < 258; n++) setInst(A.cellB, n, place(n), n, rayColor(n), 0); flag(A.cellB);
    // the shimmer by character: a non-residue's seed above π (the shader's test), a residue's below; the phase within each is free
    for (let n = 0; n < 258; n++) A.cellB.seed[n] = (n >= 1 && n <= 256 && F.character(n) === 'non-residue' ? 3.2 : 0) + Math.random() * 2.9;
    A.cellB.geo.getAttribute('iSeed').needsUpdate = true;
    A.tapeB = billboards(48, A.tex, 0.4); A.tapeB.mesh.material.uniforms.halo.value = 0.35; A.scene.add(A.tapeB.mesh);
    for (let i = 0; i < 48; i++) A.tapeB.born[i] = 0;
    // the floor: the 210-gon, its twelve spokes in the rays' colours, the 256 ticks of the cycle
    const floor = new T.Group(); A.scene.add(floor); A.floor = floor;
    const ring = []; for (let k = 0; k <= 210; k++) { const a = k / 210 * Math.PI * 2; ring.push(new T.Vector3(Math.sin(a) * 3, -2.4, -Math.cos(a) * 3)); }
    floor.add(lineOf(ring, 0x3f8a52, 0.85));
    const spk = [], spc = []; for (let r = 0; r < 12; r++) { const a = r / 12 * Math.PI * 2; spk.push(new T.Vector3(0, -2.4, 0), new T.Vector3(Math.sin(a) * 3, -2.4, -Math.cos(a) * 3)); const c = RAY_RGB[r]; spc.push(c[0], c[1], c[2], c[0], c[1], c[2]); }
    const sg = new T.BufferGeometry().setFromPoints(spk); sg.setAttribute('color', new T.Float32BufferAttribute(spc, 3)); floor.add(new T.LineSegments(sg, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5 })));
    const ticks = []; for (let d = 0; d < 256; d++) { const a = d / 256 * Math.PI * 2, r0 = d % 16 ? 3.05 : 3.2; ticks.push(new T.Vector3(Math.sin(a) * 3, -2.4, -Math.cos(a) * 3), new T.Vector3(Math.sin(a) * r0, -2.4, -Math.cos(a) * r0)); }
    floor.add(segsOf(ticks, 0x3f8a52, 0.5));
    // the horizon, the generator's cycle
    const hz = []; for (let k = 0; k <= 256; k++) { const a = k / 256 * Math.PI * 2; hz.push(new T.Vector3(Math.sin(a) * R, 0, -Math.cos(a) * R)); }
    A.scene.add(lineOf(hz, 0x2a5a3a, 0.45));
    // the fold threads: every cell to its fold partner, shown while the fold runs; the ladder of the player's cell; Γ's orbit of it
    const th = []; for (let n = 1; n <= 128; n++) th.push(place(n), place(F.fold(n)));
    A.threads = segsOf(th, 0xc9a84c, 0); A.scene.add(A.threads);
    A.ladder = lineOf([new T.Vector3(), new T.Vector3()], 0x7fb8ff, 0); A.scene.add(A.ladder);
    A.orbit = lineOf([new T.Vector3(), new T.Vector3()], 0xff7b7b, 0); A.scene.add(A.orbit);
    A.moveLines = new T.LineSegments(new T.BufferGeometry(), new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 })); A.scene.add(A.moveLines);
    A.roadLine = lineOf([new T.Vector3(), new T.Vector3()], 0xffffff, 0.7); A.scene.add(A.roadLine);
    // stars when there is no camera: 500 points
    const sp2 = []; for (let i = 0; i < 500; i++) { const u = Math.random() * 2 - 1, ph = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u); sp2.push(new T.Vector3(r * Math.cos(ph) * 40, u * 40, r * Math.sin(ph) * 40)); }
    A.stars = new T.Points(new T.BufferGeometry().setFromPoints(sp2), new T.PointsMaterial({ color: 0x8fb996, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.6 })); A.scene.add(A.stars);
    A.yaw = 0; A.pitch = 0; A.deviceQ = null; A.touchYaw = 0; A.t0 = performance.now(); A.flowT0 = -10; A.flowDur = 0.8; A.slow = 1; A.zoom = false; A.fx = [];
    resize(); window.addEventListener('resize', resize);
    return A;
  }
  function resize() { const w = window.innerWidth, h = window.innerHeight; A.renderer.setSize(w, h, false); A.camera.aspect = w / h; A.camera.updateProjectionMatrix(); }
  const now = () => (performance.now() - A.t0) / 1000;
  // ── the bloom at entry: the cells born one by one along the generator's cycle from SEED; under CALM (A.calm, set by the page) they
  // stand at once, a still ──
  function bloom(dur) {
    if (A.calm) { A.cellB.born.fill(-10); A.tapeB.born.fill(-10); flag(A.cellB); flag(A.tapeB); return; }
    const t = now(); A.cellB.born[0] = t; A.cellB.born[257] = t + dur;
    for (let k = 0; k < 256; k++) A.cellB.born[F.POW[k]] = t + 0.15 + k / 256 * dur;
    for (let i = 0; i < 48; i++) A.tapeB.born[i] = t + dur * 0.5 + i / 48 * 0.6;
    flag(A.cellB); flag(A.tapeB);
  }
  // ── the state painted on the cells ──
  function paint(state) {
    const { current, target, home, visited, reach } = state;
    for (let n = 0; n < 258; n++) {
      let s = 0, c = rayColor(n);
      if (GOLD.has(n)) c = [1, 0.84, 0.47];
      if (visited && visited.has(n)) s = 4;
      if (reach && reach.has(n)) s = 5;
      if (n === home) { s = 3; c = [0.5, 0.72, 1]; }
      if (n === target) { s = 2; c = [1, 0.83, 0.35]; }
      if (n === current) { s = 1; c = [0.55, 1, 0.6]; }
      A.cellB.col.set(c, n * 3); A.cellB.st[n] = s;
    }
    flag(A.cellB);
    const pts = [], cols = [];
    if (current != null) for (const o of (state.ops || F.OPS)) {
      const v = o.f(current); if (v === current) continue; const seg = arc(place(current), place(v), 18); const col = new T.Color().setHSL(o.hue / 360, 0.8, 0.6);
      for (let i = 0; i < seg.length - 1; i++) { pts.push(seg[i], seg[i + 1]); cols.push(col.r, col.g, col.b, col.r, col.g, col.b); }
    }
    A.moveLines.geometry.dispose(); A.moveLines.geometry = new T.BufferGeometry().setFromPoints(pts.length ? pts : [new T.Vector3(), new T.Vector3()]);
    A.moveLines.geometry.setAttribute('color', new T.Float32BufferAttribute(cols.length ? cols : [0, 0, 0, 0, 0, 0], 3));
    const road = state.road || []; const rp = []; for (let i = 0; i < road.length - 1; i++) rp.push(...arc(place(road[i]), place(road[i + 1]), 12));
    A.roadLine.geometry.dispose(); A.roadLine.geometry = new T.BufferGeometry().setFromPoints(rp.length ? rp : [new T.Vector3(), new T.Vector3()]);
    // the ladder of the player's cell: sixteen rungs of halving, ×129; and Γ's orbit of it, 128 points, drawn faint
    if (current != null && current !== 0 && current !== F.INF) {
      const lp = []; let c = current; for (let k = 0; k < 16; k++) { const nx = F.mul(c, 129); lp.push(...arc(place(c), place(nx), 10)); c = nx; }
      A.ladder.geometry.dispose(); A.ladder.geometry = new T.BufferGeometry().setFromPoints(lp);
      const op = []; c = current; for (let k = 0; k < 128; k++) { const nx = F.gamma(c); if (nx !== F.INF && c !== F.INF) op.push(...arc(place(c), place(nx), 6)); c = nx; if (c === current) break; }
      A.orbit.geometry.dispose(); A.orbit.geometry = new T.BufferGeometry().setFromPoints(op.length ? op : [new T.Vector3(), new T.Vector3()]);
    }
    rainPaint(state);   // the rain's iState: the same state, shown by the sky
  }
  // ── the flow: op f has been applied; cell n arrives from the place of its preimage ──
  function flow(op) {
    const inv = { g: n => F.mul(n, 86), ig: n => F.mul(n, 3), fold: F.fold, inv: F.inv, i: n => F.mul(n, 241), gam: n => F.gammaInv(n), flip: F.flip69 }[op.id];
    for (let n = 0; n < 258; n++) { const p = place(inv(n)); A.cellB.from.set([p.x, p.y, p.z], n * 3); }
    A.cellB.geo.getAttribute('iFrom').needsUpdate = true; A.flowT0 = now(); A.flowDur = op.id === 'gam' ? 1.1 : op.id === 'g' || op.id === 'ig' ? 0.5 : 0.8; A.flowOp = op.id; A.slow = 1;   // the page slows a closing flow (A.slow, A.zoom)
  }
  // ── the tape ribbon: the head gold; with the level's spec its start digits green, the target's gold, a slid window's skipped ones dim
  // (M2); while the read flies it owns the ribbon, and this only keeps the arguments for when it lands ──
  function tape(pi, o, spec) {
    A.tapeArgs = [pi, o, spec]; if (A.reading) return;
    const n = A.tapeB.count, W = windowOf(spec), role = j => !W ? 0 : j >= W.start[0] && j < W.start[1] ? 1 : j >= W.target[0] && j < W.target[1] ? 2 : j >= W.strike[0] && j < W.strike[1] ? 3 : 0;
    for (let i = 0; i < n; i++) {
      const k = o + i - 8, d = k >= 0 && k < pi.length ? +pi[k] : 0, a = (i - 8) / n * Math.PI * 2 * 0.9, el = -14 * Math.PI / 180, r = 5.2;
      const p = new T.Vector3(Math.sin(a) * Math.cos(el) * r, Math.sin(el) * r, -Math.cos(a) * Math.cos(el) * r);
      const b = A.tapeB.born[i]; setInst(A.tapeB, i, p, 258 + d, i === 8 ? [1, 0.85, 0.4] : ROLE_RGB[role(i - 8)], i === 8 ? 1 : 0); A.tapeB.born[i] = b;
    }
    flag(A.tapeB);
  }
  const ROLE_RGB = [[0.55, 0.65, 0.6], [0.55, 1, 0.6], [1, 0.83, 0.35], [0.3, 0.36, 0.33]];   // plain, start, target, skipped
  // ── the tape sky (M1): the π tape as the rain, 256 columns at radius 9, column c above cell 3^c holding π[78c … 78c + 77] read
  // downward, 19968 of the 20001 digits; one draw call, the shader in fx.js. The page picks the mode by its GPU tier: 'full' 256
  // columns, 'sparse' the state columns alone with heads only (at most 42, the `tiny` tier), 'off' ──
  const RAIN = { cols: 256, rows: 78, base: 0 }, GREEN3 = [0.37, 0.83, 0.48], HALT_RGB = [0.92, 0.72, 0.66];
  let HALTS = [], SIDE = null;
  const hash = x => { const s = Math.sin(x * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
  const bitrev = c => { let r = 0; for (let k = 0; k < 8; k++) r |= ((c >> k) & 1) << (7 - k); return r; };   // the woken columns spread round the sky
  const slotOf = ch => ch === '∞' ? 26 : F.G16.indexOf(ch) + 10;   // a glyph's slot in the rain atlas
  const tapeAt = (B, k, s) => { B.bytes[(k % RAIN.rows) * RAIN.cols + Math.floor(k / RAIN.rows)] = s; };
  function rainInit(pi, mode) {
    const FX = window.FOLD_FX; if (!FX || !FX.rain || !mode || mode === 'off') return null;
    const spec = FX.rain(), n = RAIN.cols, geo = new T.InstancedBufferGeometry(), base = new T.PlaneBufferGeometry(1, 1, 1, 13);   // 2 × 14 vertices a column
    geo.setAttribute('position', base.getAttribute('position')); geo.setIndex(base.getIndex());
    const col = new Float32Array(n * 4), st = new Float32Array(n * 4); for (let c = 0; c < n; c++) col[c * 4 + 3] = c;
    geo.setAttribute('iCol', new T.InstancedBufferAttribute(col, 4)); geo.setAttribute('iState', new T.InstancedBufferAttribute(st, 4)); geo.instanceCount = mode === 'sparse' ? 0 : n;
    const bytes = new Uint8Array(n * RAIN.rows), B = { bytes };
    for (let k = 0; k < n * RAIN.rows; k++) { const d = pi.charCodeAt(RAIN.base + k) - 48; tapeAt(B, k, d >= 0 && d <= 9 ? d : 27); }
    const tex = new T.DataTexture(bytes, n, RAIN.rows, T.LuminanceFormat, T.UnsignedByteType); tex.minFilter = T.NearestFilter; tex.magFilter = T.NearestFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
    const atl = new T.CanvasTexture(FX.rainAtlas(F.G16)); atl.minFilter = T.LinearFilter; atl.magFilter = T.LinearFilter; atl.generateMipmaps = false;
    spec.uniforms.tape.value = tex; spec.uniforms.atlas.value = atl;
    const mat = new T.ShaderMaterial({ vertexShader: spec.vertexShader, fragmentShader: spec.fragmentShader, uniforms: spec.uniforms, transparent: true, depthWrite: false });
    const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = spec.renderOrder; A.scene.add(mesh);
    Object.assign(B, { mesh, geo, col, st, tex, u: spec.uniforms }); A.rainB = B; A.rainMode = mode; A.rainT = 0; A.rainAlpha = 1;
    HALTS = []; for (let c = 1; c < 257; c++) if (pi[c] === '9') HALTS.push(c);   // the 27 HALT cells, π[n] = 9
    SIDE = new Array(258).fill(0); { let z = 1; for (let k = 0; k < 128; k++) { SIDE[z] = 1; z = F.gamma(z); } }   // Γ's orbit of 1, the side of 1
    return B;
  }
  // the rule as a phase pattern, from each move's action on dlog: columns of one key fall together. NOP free; IDENT c with 256 − c;
  // EXIST the four quarters; SEED rises from the floor; SHIFT steps the pattern a column a move; STORE trails twice as long; FOLD c with
  // c + 128; JUMP Γ's two sides in counter-phase (46 and 92 on neither); SYNC one phase for every column, a travelling band; HALT freezes
  function rainRule(digit, moves) {
    const m = moves | 0, k = [c => c, c => Math.min(c, (256 - c) & 255), c => c & 63, c => c, c => (c - m) & 255, c => c, c => c & 127, c => c, c => 0, c => c][digit] || (c => c);
    const side = c => { const n = F.POW[c]; return MIRRORS.has(n) ? -1 : SIDE && SIDE[n] ? 1 : 0; };
    const phase = digit === 8 ? () => 0 : digit === 7 ? c => side(c) < 0 ? hash(c) : 0.5 * side(c) : c => hash(k(c)), speed = digit === 7 || digit === 8 ? () => 12 : c => 9 + 9 * hash(k(c) + 0.37);
    return { phase, speed, dir: digit === 3 ? -1 : 1, trail: digit === 5 ? 20 : 10, freeze: digit === 9 };
  }
  // the level's window on the tape (M2), in digits from its head: the start, the target's four past a slid window's skipped digits; null
  // where the level reads none (doors, ladders, the eye). A mirror reads its four start digits only, slid along the tape
  function windowOf(spec) {
    if (!spec || !spec.digits || spec.offset == null) return null; const o = spec.offset - RAIN.base, sl = spec.slid || 0, mir = spec.kind === 'mirror';
    if (o < 0 || o + 8 + sl > RAIN.cols * RAIN.rows) return null;
    return { o, c: Math.floor(o / RAIN.rows), r: o % RAIN.rows, start: mir ? [sl, sl + 4] : [0, 4], target: mir ? [0, 0] : [4 + sl, 8 + sl], strike: mir ? [0, sl] : [4, 4 + sl], seed: !mir && spec.rule === 3 };
  }
  // the state shown by the rain: your column fast and white-green, the target's gold, home blue, the reach columns in the hue of the move
  // that reaches them, the visited a slow dim trail, the 27 HALT cells' on a HALT level; chapter k wakes 32k columns; the window's column
  // stops at its head. Cells 0 and ∞ have no column (DLOG −1): their billboards stand at the floor's centre and the zenith. Comfort: in XR
  // two static columns, under gyro drops only in the state columns, under CALM none, the glyphs lit by state
  function rainPaint(state) {
    const B = A.rainB; if (!B) return; A.rainLast = state;
    const xr = A.renderer.xr.isPresenting, gyro = !!A.deviceQ, calm = !!A.calm, sparse = A.rainMode === 'sparse', W = A.readW = windowOf(state.spec);
    const R = rainRule(state.rule || 0, state.moves || 0), wake = 32 * Math.max(1, Math.min(8, state.chapter || 8)), cur = state.current;
    const look = new Map(), mark = (n, rgb, s) => { const c = F.dlog(n); if (c >= 0) look.set(c, [rgb, s]); };
    const s0 = state.strip == null ? -1 : state.strip - RAIN.base; if (s0 >= 0) for (let c = Math.floor(s0 / RAIN.rows); c <= Math.min(255, Math.floor((s0 + 259) / RAIN.rows)); c++) look.set(c, [GREEN3, 7]);
    if (R.freeze) for (const n of HALTS) mark(n, HALT_RGB, 6);
    if (state.visited) for (const n of state.visited) mark(n, GREEN3, 4);
    if (cur != null) for (const o of (state.ops || F.OPS)) { const v = o.f(cur); if (v !== cur) { const h = new T.Color().setHSL(o.hue / 360, 0.8, 0.6); mark(v, [h.r, h.g, h.b], 5); } }
    if (state.home != null) mark(state.home, [0.5, 0.72, 1], 3); if (state.target != null) mark(state.target, [1, 0.83, 0.35], 2); if (cur != null) mark(cur, [0.75, 1, 0.8], 1);
    const cols = xr ? [cur, state.target].map(F.dlog).filter(c => c >= 0) : sparse ? [...new Set([...look.keys()].concat(W ? [W.c] : []))] : null;
    let i = 0;
    for (const c of cols || Array.from({ length: RAIN.cols }, (_, c) => c)) {
      const L = look.get(c), s = L ? L[1] : 0, own = s > 0 && s < 7;
      let rgb = own ? L[0] : GREEN3, speed = R.speed(c) * R.dir, trail = R.trail, ph = R.phase(c), lit = 0.13;
      if (!L && bitrev(c) >= wake) { speed = 0; trail = 0; lit = 0.05; }   // asleep: the code stands, no drop
      if (s === 1) { speed *= 2.2; lit = 0.32; } else if (s === 2 || s === 3) lit = 0.3; else if (s === 5) lit = 0.26; else if (s === 4) { speed *= 0.4; lit = 0.12; } else if (s === 6) lit = 0.22;
      if (gyro && !L) { speed = 0; trail = 0; }
      if (sparse) { lit = 0; trail = Math.min(trail, 0.01); }   // heads only, no trail
      if (calm || xr) { speed = 0; trail = 0; lit = own ? 0.45 : sparse ? 0 : lit; }
      if (W && c === W.c && !xr) { speed = 0; trail = sparse ? 0.01 : R.trail; ph = (W.r + 4.5 + trail) / (86 + 2 * trail); }   // the window's column stops at its head
      B.col.set([rgb[0], rgb[1], rgb[2], c], i * 4); B.st.set([speed, trail, ph, lit], i * 4); i++;
    }
    B.geo.instanceCount = i; B.geo.getAttribute('iCol').needsUpdate = true; B.geo.getAttribute('iState').needsUpdate = true;
    B.u.strip.value = s0 >= 0 ? [Math.floor(s0 / RAIN.rows), s0 % RAIN.rows, 260, 0.9] : [0, 0, 0, 0];
    B.u.win.value = W ? [W.c, W.r, B.u.win.value[2], W.seed ? 1 : 0] : [0, 0, 0, 0]; B.u.span.value = W ? W.start.concat(W.target) : [0, 0, 0, 0]; B.u.strike.value = W ? W.strike.slice() : [0, 0];
  }
  // a close decodes the window (M2): its four start digits become the glyphs of the cell they read (7846 ≡ 136 → εε), written into the
  // tape texture in place, so the rain stays at two fetches a fragment; one 19,968 B upload
  function decode(specs) {
    const B = A.rainB; if (!B) return; let n = 0;
    for (const sp of [].concat(specs || [])) { const W = windowOf(sp); if (!W) continue; const gl = Array.from(F.glyphs(parseInt(sp.digits[0], 10) % 257));
      for (let j = 0; j < 4; j++) tapeAt(B, W.o + W.start[0] + j, j < gl.length ? slotOf(gl[j]) : 27); n++; }
    if (n) B.tex.needsUpdate = true;
  }
  // the read (M2): the window's glyphs lift out of the sky and fly on the billboard flow, the head as its opcode to the rule pill, the
  // start digits to the start cell and the target's to the target; it owns tapeB until they land, then the ribbon blooms back. A column
  // off the screen sends its glyphs from the view's centre. Under CALM, in XR or with the rain hidden nothing flies. Returns its seconds
  const skyAt = k => { const c = Math.floor(k / RAIN.rows), r = k % RAIN.rows, az = c / 256 * Math.PI * 2, el = (58 - (r + 0.5) * 98 / 78) * Math.PI / 180; return new T.Vector3(Math.sin(az) * Math.cos(el) * 9, Math.sin(el) * 9, -Math.cos(az) * Math.cos(el) * 9); };
  const seen = p => { _w.copy(p).applyMatrix4(A.camera.matrixWorldInverse); _p.copy(p).project(A.camera); return _w.z < 0 && Math.abs(_p.x) < 1 && Math.abs(_p.y) < 1; };
  function read(spec, opts) {
    opts = opts || {}; readEnd(); const W = windowOf(spec), B = A.tapeB;
    if (!W || !A.rainB || !A.rainB.mesh.visible || A.calm || A.renderer.xr.isPresenting) return 0;
    A.rig.updateMatrixWorld(true); const ahead = new T.Vector3(0, 0, -5).applyQuaternion(A.camera.getWorldQuaternion(new T.Quaternion()));
    const pill = opts.pill ? new T.Vector3(opts.pill[0], opts.pill[1], 0.5).unproject(A.camera).normalize().multiplyScalar(4) : ahead.clone().setY(ahead.y + 1.2);
    const fly = [[7, 0, pill, 258 + (+spec.digits[0][0] || 0)]], to = n => place(n);
    for (let j = W.start[0]; j < W.start[1]; j++) fly.push([8 + j, j, to(spec.start)]);
    for (let j = W.target[0]; j < W.target[1]; j++) fly.push([8 + j, j, to(spec.target)]);
    for (const [i, j, p, uvi] of fly) { if (i >= B.count) continue; const q = skyAt(W.o + j), f = seen(q) ? q : ahead; B.from.set([f.x, f.y, f.z], i * 3); B.pos.set([p.x, p.y, p.z], i * 3); if (uvi) B.uv.set(uvOf(uvi), i * 4); B.born[i] = -10; }
    flag(B); B.mesh.material.uniforms.flow.value = 0; A.reading = { t0: now(), dur: 0.8, fly: fly.map(f => f[0]), done: opts.done }; return 0.8;
  }
  // the read lands, or a tap skips it: the ribbon back in its place, the flown glyphs blooming into it, and the level armed by the page
  function readEnd() {
    const R = A.reading; if (!R) return false; A.reading = null; A.tapeB.mesh.material.uniforms.flow.value = 1;
    if (A.tapeArgs) tape(...A.tapeArgs); const t = now(); for (const i of R.fly) if (i < A.tapeB.count) A.tapeB.born[i] = t; flag(A.tapeB);
    if (R.done) R.done(); return true;
  }
  // ── looking ──
  const zee = new T.Vector3(0, 0, 1), euler = new T.Euler(), q0 = new T.Quaternion(), q1 = new T.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  function deviceQuaternion(alpha, beta, gamma, orient) { euler.set(beta, alpha, -gamma, 'YXZ'); const q = new T.Quaternion().setFromEuler(euler); q.multiply(q1); q.multiply(q0.setFromAxisAngle(zee, -orient)); return q; }
  function look() { if (A.deviceQ) { A.camera.quaternion.copy(A.deviceQ); A.rig.rotation.set(0, A.touchYaw, 0); } else { A.rig.rotation.set(0, 0, 0); A.camera.rotation.set(A.pitch, A.yaw, 0, 'YXZ'); } }
  function onOrientation(e) { if (e.alpha == null) return; const o = (screen.orientation && screen.orientation.angle) || window.orientation || 0; A.deviceQ = deviceQuaternion(e.alpha * Math.PI / 180, e.beta * Math.PI / 180, e.gamma * Math.PI / 180, o * Math.PI / 180); }
  // where a cell falls on the screen: the world point projected through the camera as it hangs in the rig (the camera's world matrix
  // already carries the rig's turn, so it is applied once); scratch vectors, no allocation a call
  const _p = new T.Vector3(), _w = new T.Vector3(), _place = {};
  function onScreen(n, out) {
    let q = _place[n]; if (!q) q = _place[n] = place(n);
    _w.copy(q).applyMatrix4(A.camera.matrixWorldInverse); _p.copy(q).project(A.camera);
    out = out || {}; out.x = _p.x; out.y = _p.y; out.front = _w.z < 0; return out;
  }
  function pick(nx, ny) { A.rig.updateMatrixWorld(true); let best = null, bd = 0.06; const s = {}; for (let n = 0; n < 258; n++) { onScreen(n, s); if (!s.front) continue; const d = (s.x - nx) ** 2 + ((s.y - ny) * (window.innerHeight / window.innerWidth)) ** 2; if (d < bd) { bd = d; best = n; } } return best; }
  // a tap on the ribbon's 48 digits or on the head in the sky (M2), tested before the cells: true when it falls on one
  const _q = new T.Vector3();
  function pickTape(nx, ny) {
    A.rig.updateMatrixWorld(true); const asp = window.innerHeight / window.innerWidth, B = A.tapeB, hit = p => { _w.copy(p).applyMatrix4(A.camera.matrixWorldInverse); _p.copy(p).project(A.camera); return _w.z < 0 && (_p.x - nx) ** 2 + ((_p.y - ny) * asp) ** 2 < 0.0016; };
    for (let i = 0; i < B.count; i++) if (hit(_q.set(B.pos[i * 3], B.pos[i * 3 + 1], B.pos[i * 3 + 2]))) return true;
    return !!(A.readW && A.rainB && A.rainB.mesh.visible && hit(skyAt(A.readW.o)));
  }
  // a line faded out is hidden too: three r128 still issues the draw call of a line at opacity 0
  const fade = (o, a) => { o.material.opacity = a; o.visible = a > 0; };
  function frame() {
    const t = now(); A.cellB.mesh.material.uniforms.time.value = t; A.tapeB.mesh.material.uniforms.time.value = t;
    const f = Math.min(1, (t - A.flowT0) / A.flowDur); A.cellB.mesh.material.uniforms.flow.value = A.calm ? 1 : f;   // CALM pins the flow: no cell travels, the threads only fade
    const live = f < 1 ? 1 - f : 0;
    // bullet time (M4): a slowed flow eases twice, and on a screen the view narrows 70° → 58° and back over it; never in the room
    const slow = A.slow > 1 && f < 1; A.cellB.mesh.material.uniforms.ease.value = slow ? 1 : 0;
    const fov = slow && A.zoom && !A.renderer.xr.isPresenting ? 70 - 12 * Math.sin(Math.PI * f) : 70; if (A.camera.fov !== fov) { A.camera.fov = fov; A.camera.updateProjectionMatrix(); }
    fade(A.threads, A.flowOp === 'fold' ? 0.45 * live : 0); fade(A.ladder, A.showLadder ? 0.35 : 0); fade(A.orbit, A.showOrbit ? 0.35 : (A.flowOp === 'gam' ? 0.5 * live : 0));
    // the rain's own clock, stopped on a HALT level (R5's freeze) and through a slowed close (M4); the read's flight on tapeB's flow; a
    // change of comfort mode (XR, gyro, CALM) repaints the columns
    if (A.rainB) {
      const B = A.rainB, xr = A.renderer.xr.isPresenting, key = (xr ? 'x' : '') + (A.deviceQ ? 'g' : '') + (A.calm ? 'c' : ''); if (key !== B.key) { B.key = key; if (A.rainLast) rainPaint(A.rainLast); }
      const dt = Math.min(0.1, Math.max(0, t - (B.t == null ? t : B.t))); B.t = t; if (!slow && !(A.rainLast && A.rainLast.rule === 9)) A.rainT += dt;
      B.u.clock.value = A.rainT; B.u.alpha.value = xr ? 0.35 : A.rainAlpha; B.u.win.value[2] = A.readW ? (A.reading ? 1 : 0.6) : 0;
    }
    if (A.reading) { const r = (t - A.reading.t0) / A.reading.dur; if (r >= 1) readEnd(); else A.tapeB.mesh.material.uniforms.flow.value = r; }
    if (!A.renderer.xr.isPresenting) look(); A.renderer.render(A.scene, A.camera);
  }
  return { init, paint, flow, bloom, tape, place, onOrientation, onScreen, pick, pickTape, frame, A, resize, rainInit, rainRule, decode, read, readEnd, RAY_RGB, rayColor, GOLD, MIRRORS, EYE };
})();
