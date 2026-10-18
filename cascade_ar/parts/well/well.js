// THE FOLD — the well (S1): the eye, cell 137 = Γ's pole, as a black hole. Its pupil is a shadow ringed in gold, and it lenses the field
// with an Einstein radius that reads your moves to the eye, θE = (92/11)°/√(d + 1): 92/11 the band step (ar.js place), d the moves from
// your cell to 137 by the level's own moves (game.js toEye, the reverse BFS over S.opsList at each level open). 8.36° on the eye, 3.16°
// on ∞, the one point six moves out. The law is the point lens's: a point β from the eye is seen at θ± = (β ± √(β² + 4θE²))/2. The sky
// reads it backwards, β = θ − θE²/θ (fx.js sky({lens})); the cells and the lines between them are drawn at θ+ (ar.js lensed). Here: d and
// θE kept, the tier chosen, every change of the ring asked of the flash gate, and where the sky cannot draw them (`tiny`, the camera) the
// shadow and the ring as one camera-facing quad at the eye, 2.8·θE across. The lens is on in levels 49–56, on JUMP and within two moves.
window.FOLD_WELL = (function () {
  'use strict';
  const EYE = 137, R = 6, BAND = 92 / 11 * Math.PI / 180, PUPIL = Math.atan(22 / 64 * 0.33 / R);   // the 22 px pupil of a 0.66 m quad: 1.083°
  const RING = 1.3405, RING_IN = 1, RING_OUT = 1.831, QUAD = 1.4;   // the Airy disc's first bright ring and the dark rings either side; the quad's half-width in θE
  const thetaE = d => d == null || d < 0 ? 0 : BAND / Math.sqrt(d + 1);
  const image = (b, e) => 0.5 * (b + Math.sqrt(b * b + 4 * e * e));   // θ+; θ− = b − θ+, on the far side
  const source = (t, e) => t - e * e / t;
  const SCALE = [1, 1.4, 1.3, 1.1, 1, 1.15];   // the pupil scaled by the eye's billboard state, as ar.js sizes it: current, target, home, visited, reach
  // the lens is lit in chapter 7's levels 49–56, on a JUMP level (the eye's own rule) and wherever the eye is two moves off or nearer
  const lit = (S, d) => !!S && S.current != null && d >= 0 && ((S.mode === 'daily' && S.level >= 49 && S.level <= 56) || S.digit === 7 || d <= 2);
  // the gate's question for a change of the ring (U3): over the sky gold × 0.4025 on black, relative luminance 0.059, under the 0.1 and
  // never counted; over the camera gold at alpha 0.4025, 0.4025 × 0.4095 = 0.165, over the annulus 0.746 … 1.366 θE, 4.114·θE² sr of the view
  const RING_SKY = 0.059, RING_ROOM = 0.165, ANNULUS = Math.PI * ((RING_OUT / RING) ** 2 - (RING_IN / RING) ** 2);
  const W = { tier: 'full', want: 0, e: 0, a: 0, from: null, to: null, t0: 0, how: 'step', d: -1, on: false, A: null, FX: null, sky: null, quad: null, qu: null };
  const persist = T => W.FX && W.FX.persistence ? W.FX.persistence(T) : Math.max(0, 1 - 2 * T);
  function areaOf(e, cam) { const v = cam.fov * Math.PI / 180, h = 2 * Math.atan(Math.tan(v / 2) * cam.aspect); return ANNULUS * e * e / (v * h); }
  // the shadow and the ring alone: a quad at the eye facing the camera, θ read from the quad's own radius at 6 m; black with alpha the
  // shadow, gold with alpha the ring, normal blending, so over the room it is the sky's picture laid on the video
  function quadSpec(FX) {
    const vertexShader = `uniform vec3 center; uniform float side; varying vec2 vQ; varying vec2 vT;
void main() { vQ = position.xy; vT = position.xy * side / ${R.toFixed(1)}; vec4 mv = modelViewMatrix * vec4(center, 1.0); mv.xy += position.xy * side; gl_Position = projectionMatrix * mv; }`;
    const fragmentShader = `precision mediump float;
uniform float lensE; uniform float lensA; uniform float horizon; uniform vec3 gold;
varying vec2 vQ; varying vec2 vT;   // the quad's unit square, and the same as tan θ at the eye's 6 m (side, highp, stays in the vertex stage)
` + FX.halo() + `
void main() {
  if (dot(vQ, vQ) > 1.0) discard;
  float th = atan(length(vT));
  float dark = lensA * (1.0 - smoothstep(horizon, 1.15 * horizon, th));
  float r = ${RING.toFixed(4)} * th / lensE, rim = (th - 1.25 * horizon) / (0.2 * horizon);
  float lum = lensA * (step(1.0, r) * step(r, 1.831) * airyGlow(r, 0.45) + 0.12 * exp(-rim * rim)) * ${FX.LENS_GAIN.toFixed(2)};
  float a = clamp(dark + lum, 0.0, 1.0); if (a < 0.004) discard;
  gl_FragColor = vec4(gold * (lum / max(dark + lum, 0.001)), a);
}`;
    return { vertexShader, fragmentShader, uniforms: { center: { value: null }, side: { value: 0.1 }, lensE: { value: 0.1 }, lensA: { value: 0 }, horizon: { value: PUPIL }, gold: { value: FX.GOLD.slice() } } };
  }
  // opts: tier 'full' (sky, cells and quad), 'tiny' (shadow and ring only: the quad, nothing bends), 'off'; sky the page's sky quad
  function mount(THREE, AR, opts) {
    opts = opts || {}; W.AR = AR; W.A = AR.A; W.FX = opts.FX || window.FOLD_FX || null; W.tier = opts.tier || 'full';
    const su = opts.sky && opts.sky.material && opts.sky.material.uniforms; W.sky = su && su.lensE ? su : null; if (W.sky) W.sky.lensDir.value = W.A.lensU.lensDir.value;
    if (W.FX && W.FX.halo && W.tier !== 'off') {
      const s = quadSpec(W.FX); s.uniforms.center.value = AR.place(EYE);
      const m = new THREE.ShaderMaterial({ vertexShader: s.vertexShader, fragmentShader: s.fragmentShader, uniforms: s.uniforms, transparent: true, depthTest: false, depthWrite: false, blending: THREE.NormalBlending });
      W.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), m); W.quad.frustumCulled = false; W.quad.renderOrder = -1; W.quad.visible = false; W.qu = s.uniforms; W.A.scene.add(W.quad);
    }
    return W;
  }
  // a new θE: eased over 600 ms when the gate admits it, stepped under CALM, and when the gate refuses it the ring fades out by the
  // persistence law and back in at the new radius (the gate's own fallback), so the ring never jumps where it would flash
  function retarget(want, view, now) {
    const FX = W.FX, cam = W.A.camera, q = { dL: view.cam ? RING_ROOM : RING_SKY, area: areaOf(Math.max(W.e, want), cam) };
    const ok = !FX || !FX.strobe || FX.strobe(q, now), calm = !!(FX && FX.calm && FX.calm());
    W.from = { e: W.e, a: W.a }; W.to = { e: want, a: want > 0 ? 1 : 0 }; W.t0 = now; W.how = !ok ? 'fade' : calm ? 'step' : 'ease'; W.want = want;
  }
  function advance(now) {
    if (!W.to) return; const x = Math.min(1, (now - W.t0) / 600);
    if (W.how === 'step' || x >= 1) { W.e = W.to.e; W.a = W.to.a; W.to = null; return; }
    if (W.how === 'ease') { const s = x * x * (3 - 2 * x); W.e = W.from.e + (W.to.e - W.from.e) * s; W.a = W.from.a + (W.to.a - W.from.a) * s; return; }
    if (x < 0.5) { W.e = W.from.e; W.a = W.from.a * persist(x); } else { W.e = W.to.e; W.a = W.to.a * (1 - persist(x - 0.5)); }
  }
  // each frame: S the play (game.js), view {cam: the camera's video shown}
  function step(S, view, now) {
    if (!W.A) return; now = now == null ? performance.now() : now; view = view || {};
    const xr = !!(W.A.renderer.xr && W.A.renderer.xr.isPresenting); W.d = S && S.toEye && S.current != null ? S.toEye[S.current] : -1; W.on = W.tier !== 'off' && lit(S, W.d);
    const want = W.on ? thetaE(W.d) : 0; if (want !== W.want) retarget(want, view, now); advance(now);
    const bend = W.tier === 'full' ? W.e : 0, st = W.A.cellB ? W.A.cellB.st[EYE] | 0 : 0, hz = PUPIL * (SCALE[st] || 1), skyOn = !!(W.sky && W.A.sky && W.A.sky.visible && !view.cam && !xr);
    W.A.lensU.lensE.value = bend; W.A.lensU.shadow.value = W.a;
    if (W.sky) { W.sky.lensE.value = skyOn && W.tier === 'full' ? W.e : 0; W.sky.lensA.value = W.a; W.sky.horizon.value = hz; }
    if (W.quad) { W.quad.visible = W.a > 0 && W.e > 0 && !xr && !(skyOn && W.tier === 'full'); if (W.quad.visible) { W.qu.lensE.value = W.e; W.qu.lensA.value = W.a; W.qu.horizon.value = hz; W.qu.side.value = R * Math.tan(QUAD * W.e); } }
  }
  const state = () => ({ tier: W.tier, d: W.d, on: W.on, thetaE: +(W.want * 180 / Math.PI).toFixed(3), e: +(W.e * 180 / Math.PI).toFixed(3), a: +W.a.toFixed(3), how: W.how, bend: W.A ? W.A.lensU.lensE.value : 0, quad: !!(W.quad && W.quad.visible), sky: !!(W.sky && W.sky.lensE.value > 0) });
  return { EYE, BAND, PUPIL, RING, RING_IN, RING_OUT, RING_SKY, RING_ROOM, thetaE, image, source, lit, areaOf, quadSpec, mount, step, state };
})();
