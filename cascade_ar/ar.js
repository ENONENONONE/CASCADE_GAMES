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
// for the π ribbon, a few lines. Light enough for a phone, a Pi or an RK3588.
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
      uniforms: { map: { value: tex }, time: { value: 0 }, flow: { value: 1 }, halo: { value: 1 } }, transparent: true, depthWrite: false,
      vertexShader: `attribute vec3 iPos; attribute vec3 iFrom; attribute vec4 iUV; attribute vec3 iCol; attribute float iState; attribute float iBorn; attribute float iSeed;
        uniform float time; uniform float flow;
        varying vec2 vUv; varying vec2 vQ; varying vec3 vCol; varying float vA; varying float vS; varying float vSeed;
        void main(){
          vUv = vec2(mix(iUV.x, iUV.z, uv.x), mix(iUV.y, iUV.w, uv.y)); vQ = uv * 2.0 - 1.0; vCol = iCol; vS = iState; vSeed = iSeed;
          float s = 1.0; vA = 1.0;
          if (iState > 0.5 && iState < 1.5) s = 1.4 + 0.1 * sin(time * 5.0);
          if (iState > 1.5 && iState < 2.5) s = 1.3 + 0.08 * sin(time * 3.0 + 1.0);
          if (iState > 2.5 && iState < 3.5) s = 1.1;
          if (iState > 3.5 && iState < 4.5) vA = 0.6;
          if (iState > 4.5) s = 1.15;
          float b = clamp((time - iBorn) / 0.5, 0.0, 1.0); s *= 0.2 + 0.8 * b; vA *= b;   // born: a cell blooms in
          // the flow: along the chord from where the cell came to where it stands, lifted so it rides the sphere, eased
          float t = clamp(flow, 0.0, 1.0); float e = t * t * (3.0 - 2.0 * t);
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
    A.yaw = 0; A.pitch = 0; A.deviceQ = null; A.touchYaw = 0; A.t0 = performance.now(); A.flowT0 = -10; A.flowDur = 0.8; A.fx = [];
    resize(); window.addEventListener('resize', resize);
    return A;
  }
  function resize() { const w = window.innerWidth, h = window.innerHeight; A.renderer.setSize(w, h, false); A.camera.aspect = w / h; A.camera.updateProjectionMatrix(); }
  const now = () => (performance.now() - A.t0) / 1000;
  // ── the bloom at entry: the cells born one by one along the generator's cycle from SEED ──
  function bloom(dur) {
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
  }
  // ── the flow: op f has been applied; cell n arrives from the place of its preimage ──
  function flow(op) {
    const inv = { g: n => F.mul(n, 86), ig: n => F.mul(n, 3), fold: F.fold, inv: F.inv, i: n => F.mul(n, 241), gam: n => F.gammaInv(n), flip: F.flip69 }[op.id];
    for (let n = 0; n < 258; n++) { const p = place(inv(n)); A.cellB.from.set([p.x, p.y, p.z], n * 3); }
    A.cellB.geo.getAttribute('iFrom').needsUpdate = true; A.flowT0 = now(); A.flowDur = op.id === 'gam' ? 1.1 : op.id === 'g' || op.id === 'ig' ? 0.5 : 0.8; A.flowOp = op.id;
  }
  // ── the tape ribbon ──
  function tape(pi, o) {
    const n = A.tapeB.count;
    for (let i = 0; i < n; i++) {
      const k = o + i - 8, d = k >= 0 && k < pi.length ? +pi[k] : 0, a = (i - 8) / n * Math.PI * 2 * 0.9, el = -14 * Math.PI / 180, r = 5.2;
      const p = new T.Vector3(Math.sin(a) * Math.cos(el) * r, Math.sin(el) * r, -Math.cos(a) * Math.cos(el) * r);
      const b = A.tapeB.born[i]; setInst(A.tapeB, i, p, 258 + d, i === 8 ? [1, 0.85, 0.4] : [0.55, 0.65, 0.6], i === 8 ? 1 : 0); A.tapeB.born[i] = b;
    }
    flag(A.tapeB);
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
  // a line faded out is hidden too: three r128 still issues the draw call of a line at opacity 0
  const fade = (o, a) => { o.material.opacity = a; o.visible = a > 0; };
  function frame() {
    const t = now(); A.cellB.mesh.material.uniforms.time.value = t; A.tapeB.mesh.material.uniforms.time.value = t;
    const f = Math.min(1, (t - A.flowT0) / A.flowDur); A.cellB.mesh.material.uniforms.flow.value = f;
    const live = f < 1 ? 1 - f : 0;
    fade(A.threads, A.flowOp === 'fold' ? 0.45 * live : 0); fade(A.ladder, A.showLadder ? 0.35 : 0); fade(A.orbit, A.showOrbit ? 0.35 : (A.flowOp === 'gam' ? 0.5 * live : 0));
    if (!A.renderer.xr.isPresenting) look(); A.renderer.render(A.scene, A.camera);
  }
  return { init, paint, flow, bloom, tape, place, onOrientation, onScreen, pick, frame, A, resize, RAY_RGB, rayColor, GOLD, MIRRORS, EYE };
})();
