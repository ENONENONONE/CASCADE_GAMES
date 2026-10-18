// THE FOLD — the glow (parts/glow): bloom, god rays, glitter and a grade as one post pass over the scene, the look of "ray tracing" with
// no ray traced. window.FOLD_GLOW. The scene is drawn into a half-resolution render target (RGBA bytes: WebGL1-safe), then at a quarter of
// the screen a bright pass (threshold with a soft knee, so each source keeps its own colour: the cells their ray, the rain its phosphor,
// the ring and the quarter turns their gold) and the glitter (a hash-seeded sparkle on the brightest points, twinkling with a period of
// 1.5–3 s), a separable 9-tap blur that also streaks the sparkles into star crosses, radial shafts from three lights (the eye's ring in
// gold, SEED at the floor's centre in the spokes' colours, and the field's own light: where parts/trace's tracer says the light arrives at
// the player's cell, in the colour it arrives in; 16 samples each, 48 in all), and one full-screen composite: the half-res scene sharpened on
// the way up (an unsharp mask), a 1–2 px RGB split at the edges and on the brightest edges, the grade (blacks crushed, saturation lifted
// 20 %: a tone pass over the same palette, no recolour), the bloom, the shafts and the glitter added. The CRT overlay is drawn after it.
// Everything is GLSL ES 1.00 for three.js r128, precision mediump by default with highp on the clock and the composite's uv alone, loops
// of 9 and 16, no derivative, no float texture needed (the quarter-res targets take half floats where the extension exists, against
// banding in the blur's tails). Tiers: 'full', 'bloom' (bloom and the grade alone: no shafts, no glitter, no split), 'off'. Its clock
// wraps at 30 s, which every twinkle period divides, and stands still under CALM, so the shafts and the glitter are stills there. The
// third light eases between moves over the toggle's 600 ms (a step under CALM), so a move never flashes it.
window.FOLD_GLOW = (function () {
  'use strict';
  const TAU = 6.283185307;
  const GOLD = [0.788, 0.659, 0.298];                   // the page's --gold, as fx.js has it
  const TIERS = ['off', 'bloom', 'full'];
  // the numbers: the bright pass's knee (the sky's field at 0.085·green, max channel 0.07, stays under it; the ring's 0.32 passes at 0.7;
  // a cell's core, a drop head and a glyph pass whole), the glitter's gate on the very brightest, the taps, the samples (16 a light, three
  // lights: 48 in all, the same count the two lights had at 24, so the budget holds under 6 ms by construction; 3 × 20 would be 6.15 ms
  // and 3 × 24 6.45 by budget()), the grade, and the third light's reference energy: parts/trace's lightAt sums the light over the 256
  // directions, 265 … 780 over every cell, sheet and target of its default scene (median 545, p90 581, 3096 renders), so traceRef 640 lights a
  // typical cell's shaft at ~0.85 and the brightest at 1 (traceStrength clamps)
  const K = { lo: 0.18, hi: 0.38, glitLo: 0.45, glitHi: 0.75, taps: 9, stride: 1.5, sigma: 2.3, cross: 2, samples: 16, lights: 3, density: 0.92, decay: 0.955,
    bloom: 0.55, rays: 0.9, raysRoom: 0.3, glitter: 0.6, sat: 1.20, crush: 0.015, ca: 1.5, sharp: 0.4, scale: 0.5, wrap: 30, periods: [1.5, 2, 2.5, 3], traceRef: 640, ease: 600 };
  const PRECISION = `precision mediump float;
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define HP highp
#else
#define HP mediump
#endif
`;
  const QUAD_VS = `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
  // a hash of a small integer cell, mediump-safe: every product stays under 2048 before its fract (the cells run to 320 × 200 / 4)
  const HASH = `float hash2(vec2 c) { return fract(fract(c.x * 0.618034) + fract(c.y * 0.381966) + fract(mod(c.x, 32.0) * mod(c.y, 32.0) * 0.0157)); }
`;
  // ═══ 1. the bright pass and the glitter, at a quarter of the screen: rgb the light above the knee, a the sparkle ═══
  function brightGL(glitter) {
    return PRECISION + `
uniform sampler2D scene; uniform HP float time;
varying vec2 vUv;
const float TAU = 6.2831853;
` + HASH + `
void main() {
  vec3 c = texture2D(scene, vUv).rgb;                              // premultiplied: a transparent pixel is black and lights nothing
  float L = max(c.r, max(c.g, c.b));
  vec3 b = c * smoothstep(${K.lo.toFixed(2)}, ${K.hi.toFixed(2)}, L);
  float a = 0.0;
#if ${glitter ? 1 : 0}
  vec2 cell = floor(gl_FragCoord.xy * 0.25);                       // one sparkle a 4 × 4 block here, 16 × 16 px on the screen
  float h = hash2(cell), h2 = hash2(cell + 17.0);
  float T = 1.5 + 0.5 * floor(h * 3.999);                          // 1.5, 2, 2.5 or 3 s: each divides the 30 s clock, so its wrap never pops
  HP float ph = fract(time / T + h2);                               // the phase, wrapped before it is sined
  float tw = 0.55 + 0.45 * sin(ph * TAU);                          // a slow shimmer, never off: 0.1 … 1 over 1.5 s at the fastest
  a = smoothstep(${K.glitLo.toFixed(2)}, ${K.glitHi.toFixed(2)}, L) * tw * (0.6 + 0.4 * h2);
#endif
  gl_FragColor = vec4(b, a);
}`;
  }
  // ═══ 2. the blur: 9 taps 1.5 texels apart (σ 2.3 taps, the glow reaching ~24 screen px), the sparkle streaked ±2 taps into a line ═══
  // H: rgb the row's gaussian, a the sparkle's horizontal streak (±3 texels, ±12 screen px, tapering). V: rgb the column's gaussian of H, a
  // the H streak at the centre or the vertical streak of the bright pass's own sparkle, whichever is brighter — a star cross, from two lines
  function blurGL(vertical) {
    const H = (K.taps - 1) >> 1, C = K.cross;
    return PRECISION + `
uniform sampler2D src; uniform vec2 px;    // one texel of src along the pass
${vertical ? 'uniform sampler2D bright;' : ''}
varying vec2 vUv;
void main() {
  vec3 sum = vec3(0.0); float ws = 0.0, streak = 0.0;
  for (int i = -${H}; i <= ${H}; i++) {
    float fi = float(i), w = exp(-fi * fi * ${(0.5 / (K.sigma * K.sigma)).toFixed(4)});
    vec2 at = vUv + px * (fi * ${K.stride.toFixed(1)});
    vec4 s = texture2D(src, at); sum += s.rgb * w; ws += w;
    ${vertical ? `if (i >= -${C} && i <= ${C}) streak = max(streak, texture2D(bright, at).a * (1.0 - abs(fi) * ${(1 / (C + 1)).toFixed(3)}));   // the cross's ±${C} taps alone, folded at compile time`
    : `streak = max(streak, s.a * max(1.0 - abs(fi) * ${(1 / (C + 1)).toFixed(3)}, 0.0));`}
  }
  ${vertical ? 'streak = max(streak, texture2D(src, vUv).a);' : ''}
  gl_FragColor = vec4(sum / ws, streak);
}`;
  }
  // ═══ 3. the shafts: a radial blur of the bright pass toward each light, 16 samples, the weights falling by 0.955 a step ═══
  // lightA the eye (uv, strength) in gold; lightB SEED at the floor's centre, tinted by the spoke the pixel lies along (the twelve
  // directions on the screen, the rays' colours); lightC the field's own light, the tracer's brightest direction at its cell's screen
  // place in the colour the light arrives in (colC); a slow drift of the shafts' brightness round the light, a turn in 30 s
  function raysGL() {
    return PRECISION + `
uniform sampler2D bright; uniform float aspect; uniform HP float time;
uniform vec3 lightA; uniform vec3 colA;
uniform vec3 lightB; uniform vec2 spokeDir[12]; uniform vec3 spokeCol[12];
uniform vec3 lightC; uniform vec3 colC;
varying vec2 vUv;
const float TAU = 6.2831853;
#define N ${K.samples}
vec3 shaft(vec2 L) {
  vec2 p = vUv, d = (L - p) * ${(K.density / K.samples).toFixed(5)};
  vec3 sum = vec3(0.0); float w = 1.0, ws = 0.0;
  for (int i = 0; i < N; i++) { sum += texture2D(bright, p).rgb * w; ws += w; w *= ${K.decay.toFixed(3)}; p += d; }
  return sum / ws;
}
float drift(vec2 L) { vec2 r = (vUv - L) * vec2(aspect, 1.0); float ang = atan(r.y, r.x + 0.00001); HP float t = fract(time / 30.0) * TAU; return 0.95 + 0.3 * sin(ang * 6.0 + t) + 0.25 * sin(ang * 13.0 - 0.7 * t); }   // the shafts' lobes, a turn in 30 s, 0.4 … 1.5
void main() {
  vec3 col = vec3(0.0);
  if (lightA.z > 0.0) col += shaft(lightA.xy) * drift(lightA.xy) * lightA.z * mix(vec3(1.0), colA * 1.4, 0.7);
  if (lightB.z > 0.0) {
    vec2 n = normalize((vUv - lightB.xy) * vec2(aspect, 1.0) + 0.00001);
    vec3 tint = vec3(0.0); float ts = 0.0;
    for (int i = 0; i < 12; i++) { float w = pow(max(dot(n, spokeDir[i]), 0.0), 16.0); tint += spokeCol[i] * w; ts += w; }
    tint = mix(colA, tint / max(ts, 0.0001), smoothstep(0.0, 0.3, ts));
    col += shaft(lightB.xy) * drift(lightB.xy) * lightB.z * mix(vec3(1.0), tint * 1.3, 0.75);
  }
  if (lightC.z > 0.0) col += shaft(lightC.xy) * drift(lightC.xy) * lightC.z * mix(vec3(1.0), colC * 1.4, 0.7);
  gl_FragColor = vec4(col, 1.0);
}`;
  }
  // ═══ 4. the composite, at the screen's size: the scene up from half res, sharpened; the split; the grade; the light added ═══
  function compositeGL(tier) {
    const full = tier === 'full';
    return PRECISION + `
uniform sampler2D scene; uniform sampler2D bloom; uniform sampler2D rays;
uniform vec2 res;           // the screen in device pixels
uniform vec2 tx;            // one texel of the scene target
uniform float mixK;         // 0 the scene as it was … 1 the glow: the toggle's ramp
uniform float bloomK; uniform float rayK; uniform float glitK; uniform float sat; uniform float crush; uniform float caK; uniform float sharp;
varying HP vec2 vUv;        // a texel of the screen is 2^-11 at 1280: the one place this pass wants highp
#define RAYS ${full ? 1 : 0}
#define SPLIT ${full ? 1 : 0}
float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
void main() {
  vec4 g = texture2D(bloom, vUv);
  vec4 c = texture2D(scene, vUv);
  vec3 n = texture2D(scene, vUv + tx).rgb + texture2D(scene, vUv - tx).rgb;
  vec3 s = max(c.rgb + sharp * (c.rgb - 0.5 * n), 0.0);           // the unsharp mask on a diagonal pair: the half-res scene's edges back
#if SPLIT
  vec2 d = vUv - 0.5; float e = dot(d, d) * 4.0;                   // 0 at the centre, 1 at the sides' middles, 2 at the corners
  float off = caK * min(e * 0.6 + 1.2 * lum(g.rgb), 1.0);          // in pixels: the edges and the brightest edges, at most caK
  float wca = smoothstep(0.15, 0.6, off);
  vec2 o = normalize(d + 0.0001) * off / res;
  s.r = mix(s.r, texture2D(scene, vUv + o).r, wca); s.b = mix(s.b, texture2D(scene, vUv - o).b, wca);
#endif
  float L = lum(s), mx = max(s.r, max(s.g, s.b)), mn = min(s.r, min(s.g, s.b));
  float sk = min(sat, min((1.0 - L) / max(mx - L, 0.0001), L / max(L - mn, 0.0001)));   // the lift capped where a channel would leave 0 … 1, so a hue never turns
  vec3 gr = max(mix(vec3(L), s, sk) - crush, 0.0) / (1.0 - crush);    // the grade: saturation about the pixel's own luminance, the lift crushed
  vec3 light = g.rgb * (bloomK / (1.0 + 2.5 * lum(g.rgb))) + g.a * glitK * mix(vec3(1.0), normalize(g.rgb + 0.001), 0.4);   // the knee: a crowd of sources (the relief's floor) blooms less than a lone one
#if RAYS
  light += texture2D(rays, vUv).rgb * rayK;
#endif
  vec3 col = mix(c.rgb, gr, mixK) + light * mixK;
  float a = clamp(c.a + lum(light) * mixK * 1.5, 0.0, 1.0);        // over the room the light is added and the alpha grows with it
  gl_FragColor = vec4(col, a);
}`;
  }
  const shaders = tier => ({ bright: brightGL(tier === 'full'), blurH: blurGL(false), blurV: blurGL(true), rays: raysGL(), composite: compositeGL(tier || 'full') });

  // ═══ the tier by the page's flags and the pref: 'auto' leaves `tiny` off and `lowEnd` with bloom alone; 'on' is the full pass anywhere ═══
  function tierFor(pref, dev) { dev = dev || {}; if (pref === 'off') return 'off'; if (pref === 'on') return 'full'; return dev.tiny ? 'off' : dev.lowEnd ? 'bloom' : 'full'; }
  // the same functions in JS, for the check and the demo's report: the twinkle of a sparkle (bright pass), the grade of a colour (composite)
  const period = h => 1.5 + 0.5 * Math.floor(h * 3.999);
  const twinkle = (t, T, phase) => 0.55 + 0.45 * Math.sin(((t / T + phase) % 1) * TAU);
  const lum = c => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const grade = c => { const L = lum(c), mx = Math.max(...c), mn = Math.min(...c), s = Math.min(K.sat, (1 - L) / Math.max(mx - L, 0.0001), L / Math.max(L - mn, 0.0001)); return c.map(x => Math.max(L + (x - L) * s - K.crush, 0) / (1 - K.crush)); };
  // the third light's strength from the tracer's energy (lightAt's Σ of the light over the 256 directions): energy / traceRef, clamped to
  // 0 … 1, so a typical cell (~545) gives ~0.85, the brightest (≥ 640) 1, the eye at ∞ (no light) 0
  const traceStrength = e => Math.min(1, Math.max(0, (e || 0) / K.traceRef));
  // the budget: texture fetches and arithmetic a frame at w × h, by the tiers' own tap counts; a mid phone's GPU at ~4 G bilinear fetches
  // and ~50 G scalar ops a second (an Adreno 6xx or a Mali-G5x), the five target switches ~0.1 ms each. The shafts: K.lights lights of
  // K.samples each, 7 ops a sample, the floor's twelve-spoke tint 12 × 8 and the drifts 40
  function budget(w, h, tier, scale) {
    scale = scale || K.scale; const full = (tier || 'full') === 'full', hp = Math.round(w * scale) * Math.round(h * scale), q = Math.round(w * scale / 2) * Math.round(h * scale / 2), screen = w * h, S = K.samples * K.lights;
    const f = { bright: q * 1, blurH: q * K.taps, blurV: q * (K.taps + 2 * K.cross + 1), rays: full ? q * S : 0, composite: screen * (3 + (full ? 2 : 0) + 1 + (full ? 1 : 0)) };
    const o = { bright: q * (full ? 45 : 12), blurH: q * (K.taps * 8), blurV: q * (K.taps * 8 + (2 * K.cross + 1) * 4), rays: full ? q * (S * 7 + 12 * 8 + 40) : 0, composite: screen * (full ? 75 : 45) };
    const fetches = Object.values(f).reduce((a, b) => a + b, 0), ops = Object.values(o).reduce((a, b) => a + b, 0), passes = full ? 5 : 4;
    return { w, h, scale, scenePx: hp, quarterPx: q, fetches, ops, passes, samples: full ? S : 0, f, o, ms: +(fetches / 4e9 * 1e3 + ops / 50e9 * 1e3 + passes * 0.1).toFixed(2), skyOps: Math.round(1500 * (screen - hp)) };
  }

  // ═══ mount: the targets, the five materials, the clock; begin() aims the scene at the half-res target, end(state) runs the passes ═══
  // opts: tier, scale (0.5), FX (for CALM), scene (its Points are sized by the canvas's height in three r128, so each is scaled down for the
  // half-res draw and put back). Returns G: {tier, begin, end, setTier, resize, dispose, u (the composite's uniforms), rays (the shafts'
  // uniforms), rt, hdr, level, trace (the third light as eased)}. state for end(): {eye: [u, v], eyeA, floor: [u, v], floorA, spokes: 24
  // floats (the twelve screen directions from the floor's centre, aspect-true, unit), spokeCol: 36 floats, trace: {pos: [u, v], a, rgb: [r, g,
  // b], key} or null (the field's light: its cell's screen place this frame, its strength by traceStrength and the edge fade, its colour, and
  // a key that changes when the tracer's answer does — a move, a level, a law), room, calm}
  function mount(THREE, renderer, opts) {
    opts = opts || {}; const G = { tier: 'off', want: 'off', level: 0, t0: 0, scale: opts.scale || K.scale, hdr: false, rt: {}, clock: 0, last: -1, calm: false };
    // the third light as eased: `to` is the live target each frame (the cell's place moves with the camera), `from` a snapshot of what was
    // shown when the key last changed, `cur` the mix by smoothstep((now − t0) / 600 ms), a step under CALM; u, v, strength, r, g, b
    const LC = { key: null, t0: -1e9, from: [0, 0, 0, 0, 0, 0], cur: [0, 0, 0, 0, 0, 0], to: [0, 0, 0, 0, 0, 0], x: 1 }; G.trace = LC;
    const gl = renderer.getContext(), FX = opts.FX || window.FOLD_FX || null, scene = opts.scene || null, scaled = [];
    const points = down => { if (!scene) return; if (down) scene.traverse(o => { const m = o.isPoints && o.material; if (m && m.size != null) { scaled.push([m, m.size]); m.size *= G.scale; } }); else { for (const [m, s] of scaled) m.size = s; scaled.length = 0; } };
    // half floats for the quarter-res targets where they can be rendered to and sampled linearly; the scene target stays bytes (it is LDR,
    // and bytes are half the bandwidth); a target that comes out incomplete falls back to bytes
    const halfOk = renderer.capabilities.isWebGL2 ? !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))
      : !!(gl.getExtension('OES_texture_half_float') && gl.getExtension('OES_texture_half_float_linear') && gl.getExtension('EXT_color_buffer_half_float'));
    const target = (w, h, depth, half) => new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, type: half ? THREE.HalfFloatType : THREE.UnsignedByteType, depthBuffer: depth, stencilBuffer: false, generateMipmaps: false });
    const complete = rt => { renderer.setRenderTarget(rt); const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; renderer.setRenderTarget(null); return ok; };
    const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null); quad.frustumCulled = false; const pass = new THREE.Scene(); pass.add(quad); const cam = new THREE.Camera();
    const size = new THREE.Vector2();
    const mat = (fs, uniforms) => new THREE.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false, transparent: false, blending: THREE.NoBlending });
    const spokeDir = [], spokeCol = []; for (let i = 0; i < 12; i++) { spokeDir.push(new THREE.Vector2(Math.sin(i / 12 * TAU), -Math.cos(i / 12 * TAU))); spokeCol.push(new THREE.Vector3(GOLD[0], GOLD[1], GOLD[2])); }
    const U = {
      bright: { scene: { value: null }, time: { value: 0 } },
      blurH: { src: { value: null }, px: { value: new THREE.Vector2() } },
      blurV: { src: { value: null }, bright: { value: null }, px: { value: new THREE.Vector2() } },
      rays: { bright: { value: null }, aspect: { value: 1 }, time: { value: 0 }, lightA: { value: new THREE.Vector3() }, colA: { value: new THREE.Vector3(GOLD[0], GOLD[1], GOLD[2]) }, lightB: { value: new THREE.Vector3() }, spokeDir: { value: spokeDir }, spokeCol: { value: spokeCol },
        lightC: { value: new THREE.Vector3() }, colC: { value: new THREE.Vector3(GOLD[0], GOLD[1], GOLD[2]) } },
      composite: { scene: { value: null }, bloom: { value: null }, rays: { value: null }, res: { value: new THREE.Vector2() }, tx: { value: new THREE.Vector2() }, mixK: { value: 0 },
        bloomK: { value: K.bloom }, rayK: { value: K.rays }, glitK: { value: K.glitter }, sat: { value: K.sat }, crush: { value: K.crush }, caK: { value: K.ca }, sharp: { value: K.sharp } },
    };
    let M = null;
    function build(tier) { const S = shaders(tier); if (M) for (const k in M) M[k].dispose(); M = { bright: mat(S.bright, U.bright), blurH: mat(S.blurH, U.blurH), blurV: mat(S.blurV, U.blurV), rays: mat(S.rays, U.rays), composite: mat(S.composite, U.composite) }; }
    function resize() {
      renderer.getDrawingBufferSize(size); const w = size.x, h = size.y; if (G.rt.w === w && G.rt.h === h && G.rt.scene) return;
      dispose(true); const hw = Math.max(2, Math.round(w * G.scale)), hh = Math.max(2, Math.round(h * G.scale)), qw = Math.max(1, Math.round(hw / 2)), qh = Math.max(1, Math.round(hh / 2));
      G.rt = { w, h, hw, hh, qw, qh, scene: target(hw, hh, true, false), bright: null, a: null, b: null, rays: null };
      const Q = ['bright', 'a', 'b', 'rays'], make = () => { for (const k of Q) G.rt[k] = target(qw, qh, false, G.hdr); };
      G.hdr = halfOk; make(); if (G.hdr && !Q.every(k => complete(G.rt[k]))) { for (const k of Q) G.rt[k].dispose(); G.hdr = false; make(); }   // all four of one kind
      U.blurH.px.value.set(1 / qw, 0); U.blurV.px.value.set(0, 1 / qh); U.composite.res.value.set(w, h); U.composite.tx.value.set(1 / hw, 1 / hh); U.rays.aspect.value = w / h;
      U.bright.scene.value = G.rt.scene.texture; U.blurH.src.value = G.rt.bright.texture; U.blurV.src.value = G.rt.a.texture; U.blurV.bright.value = G.rt.bright.texture; U.rays.bright.value = G.rt.bright.texture;
      U.composite.scene.value = G.rt.scene.texture; U.composite.bloom.value = G.rt.b.texture; U.composite.rays.value = G.rt.rays.texture;
    }
    function dispose(targetsOnly) { for (const k of ['scene', 'bright', 'a', 'b', 'rays']) if (G.rt[k]) { G.rt[k].dispose(); G.rt[k] = null; } if (!targetsOnly && M) { for (const k in M) M[k].dispose(); M = null; quad.geometry.dispose(); } }
    // the tier wanted: on ramps the mix up over 600 ms (a step under CALM), off ramps it down and then stops the pass; a change of tier
    // between bloom and full rebuilds the materials
    function setTier(t) {
      t = TIERS.includes(t) ? t : 'off'; const now = performance.now();
      if (t === 'off') { if (G.tier !== 'off') { G.want = 'off'; G.t0 = now; } return; }
      if (G.tier !== t) { build(t); G.tier = t; } G.want = t; if (G.level < 1) G.t0 = now;
    }
    function ramp(now) {
      const calm = G.calm || !!(FX && FX.calm && FX.calm()), x = calm ? 1 : Math.min(1, (now - G.t0) / 600), s = x * x * (3 - 2 * x);
      G.level = G.want === 'off' ? 1 - s : s; if (G.want === 'off' && G.level <= 0) { G.tier = 'off'; G.level = 0; }
      U.composite.mixK.value = G.level;
    }
    // the third light's easing: a new key (the tracer answered anew) freezes what is shown as `from` and restarts the 600 ms; the target is
    // the live place and colour (or, with no light, the place where it was and strength 0, so it fades out where it stood); from nothing it
    // fades in at the new place, never glides in from the corner. Under CALM the mix is a step
    function easeTrace(tr, now, calm) {
      const to = LC.to, cur = LC.cur, from = LC.from, has = !!(tr && tr.pos && tr.a > 0);
      if (has) { to[0] = tr.pos[0]; to[1] = tr.pos[1]; to[2] = tr.a; to[3] = tr.rgb[0]; to[4] = tr.rgb[1]; to[5] = tr.rgb[2]; } else { to[0] = cur[0]; to[1] = cur[1]; to[2] = 0; to[3] = cur[3]; to[4] = cur[4]; to[5] = cur[5]; }
      const key = has ? tr.key : null;
      if (key !== LC.key) { for (let i = 0; i < 6; i++) from[i] = cur[i]; if (from[2] <= 0) { from[0] = to[0]; from[1] = to[1]; from[3] = to[3]; from[4] = to[4]; from[5] = to[5]; } LC.key = key; LC.t0 = now; }
      const x = calm ? 1 : Math.min(1, (now - LC.t0) / K.ease), s = x * x * (3 - 2 * x); LC.x = x;
      for (let i = 0; i < 6; i++) cur[i] = from[i] + (to[i] - from[i]) * s;
      U.rays.lightC.value.set(cur[0], cur[1], cur[2]); U.rays.colC.value.set(cur[3], cur[4], cur[5]);
    }
    // before the scene is drawn: aim the renderer at the half-res target (the scene's own render clears it)
    function begin() { if (G.tier === 'off') return false; resize(); points(true); renderer.setRenderTarget(G.rt.scene); return true; }
    const run = (m, rt) => { quad.material = m; renderer.setRenderTarget(rt); renderer.render(pass, cam); };
    // after it: the passes, then the composite to the screen; the clock runs by its own dt, wrapped at 30 s, still under CALM
    function end(st) {
      points(false); if (G.tier === 'off') { renderer.setRenderTarget(null); return; }
      st = st || {}; const now = performance.now(); G.calm = !!st.calm;
      if (G.last < 0) G.last = now; const dt = Math.min(0.1, Math.max(0, (now - G.last) / 1000)); G.last = now; if (!G.calm) G.clock = (G.clock + dt) % K.wrap;
      U.bright.time.value = G.clock; U.rays.time.value = G.clock;
      const full = G.tier === 'full', room = !!st.room;
      if (full) {
        const a = U.rays.lightA.value, b = U.rays.lightB.value;
        if (st.eye && st.eyeA > 0) a.set(st.eye[0], st.eye[1], st.eyeA); else a.z = 0;
        if (st.floor && st.floorA > 0) { b.set(st.floor[0], st.floor[1], st.floorA); if (st.spokes) for (let i = 0; i < 12; i++) spokeDir[i].set(st.spokes[2 * i], st.spokes[2 * i + 1]); if (st.spokeCol) for (let i = 0; i < 12; i++) spokeCol[i].set(st.spokeCol[3 * i], st.spokeCol[3 * i + 1], st.spokeCol[3 * i + 2]); } else b.z = 0;
        easeTrace(st.trace, now, G.calm || !!(FX && FX.calm && FX.calm()));
        U.composite.rayK.value = room ? K.raysRoom : K.rays;       // over the camera the room stays visible through faint shafts
      }
      U.composite.crush.value = room ? 0 : K.crush;                // the room is not ours to darken
      ramp(now);
      const auto = renderer.autoClear; renderer.autoClear = false;
      run(M.bright, G.rt.bright); run(M.blurH, G.rt.a); run(M.blurV, G.rt.b);
      if (full) run(M.rays, G.rt.rays);
      run(M.composite, null); renderer.autoClear = auto;
    }
    setTier(opts.tier || 'full'); if (G.tier !== 'off') { G.level = 1; G.t0 = -1e9; U.composite.mixK.value = 1; }   // mounted on: no ramp at the start
    Object.assign(G, { begin, end, setTier, resize, dispose: () => dispose(false), u: U.composite, rays: U.rays, bright: U.bright, materials: () => M, halfOk, K });
    return G;
  }
  return { mount, tierFor, shaders, budget, twinkle, period, grade, lum, traceStrength, K, TIERS, GOLD, PRECISION, QUAD_VS };
})();
