// THE FOLD — the shaders. window.FOLD_FX: the sky when there is no camera, the Airy halo of a cell, the phosphor overlay, the room's
// CSS moves and the Γ warp. Everything is WebGL1 GLSL ES 1.00 for three.js r128 (PlaneBufferGeometry, ShaderMaterial), written for
// phones (iOS Safari, Android Chrome), a Raspberry Pi and the RK3588's Mali: precision mediump by default, highp only where a raster
// coordinate or a long time needs it, loops of 23, no derivatives, no 3-D textures, normal alpha blending only, one draw call each.
//
// The look is the machine's: the P22 phosphor and its persistence F(T) = cos(πT)·exp(−0.5T), the scanlines, the 2.34 % barrel
// r/(1 + 0.0234 r²), the Airy disc [2J₁(ρ)/ρ]² with its dark rings at 3.8317, 7.0156 and 10.1735, the golden angle 137.508° and the
// Fibonacci sphere z = 1 − 2k/N, θ = 2πφk, the twelve rays, the fold as a half turn and Γ = (z − a)/(z + a) as a Möbius map.
//
// This file needs nothing at load; three.js is only touched by the helpers that take it as an argument.
window.FOLD_FX = (function () {
  'use strict';
  const PHI_INV = 0.6180339887, GOLDEN_ANGLE = 137.50776405, TAU = 6.283185307;
  // the palette: the page's --green #5fd37a (P22's green at 525 nm as the UI has it), --gold #c9a84c, --ground #0a0d10
  const GREEN = [0.373, 0.827, 0.478], GOLD = [0.788, 0.659, 0.298], GROUND = [0.039, 0.051, 0.063];
  const BARREL = 0.0234;   // the 2.34 % = δ% = ε₄ ln φ
  const MOEBIUS_A = 0.47;  // 120/257 = Z₀ scaled to the unit screen: Γ's zero at +a, its pole at −a
  // ── the phosphor's own clock: F(T) = cos(πT)·exp(−0.5T) from 1 at T = 0 down to 0 at T = ½, the sign kept out ──
  const persistence = T => T <= 0 ? 1 : T >= 0.5 ? 0 : Math.cos(Math.PI * T) * Math.exp(-0.5 * T);
  // precision: mediump by default; a raster coordinate or a running clock takes highp where the fragment stage has it
  const PRECISION = `precision mediump float;
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define HP highp
#else
#define HP mediump
#endif
`;
  // a full-screen quad in clip space: the mesh's own transform and the camera do not matter, so it can hang anywhere in the scene
  const QUAD_VS = `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

  // ═══ 1. the sky: a Fibonacci-sphere starfield, the twelve spokes, the phosphor field breathing ═══
  // Drawn as a clip-space quad; the view ray of each corner comes from the camera's own projection and view matrices, so the stars
  // turn with the head and the device. 377 = F(14) stars stand on the Fibonacci sphere, z_k = 1 − (2k + 1)/N, θ_k = 2πφk. A fragment
  // knows its own z, so the stars that can reach it are the ones whose index lies within ±HALFWIN of k₀ = (1 − z)N/2: 23 candidates,
  // no search. The golden angle's fraction fract(kφ) is built from k's digits in base 8 and 64 so it survives mediump (a 16-bit float
  // holds fract(233 × 0.618…) to a tenth of a turn only; split, it holds it to 1/512). Brightness and twinkle come from a hash of k.
  function sky(opts) {
    opts = opts || {};
    const N = opts.stars || 377, samples = opts.samples === 0 ? 0 : Math.max(3, Math.min(23, (opts.samples | 0) || 23)) | 1, HALF = Math.max(0, (samples - 1) >> 1);   // odd, ≤ 23; 0 leaves the stars out and the loop with them
    const reach = 2 * Math.max(HALF, 1) / N;                      // the z-reach of the window, in radians at the equator
    const glowK = (9 / (reach * reach)).toFixed(1);               // the Lorentzian glow ends inside the window
    const fragmentShader = PRECISION + `
uniform HP float time;      // seconds; wrapped here, so it may run for hours
uniform vec3 green; uniform vec3 gold;
uniform float stars;        // the stars' brightness, 0 hides them
uniform float rays;         // the twelve spokes' strength
uniform float breath;       // the depth of the 13 s breathing, 0..1
uniform float drift;        // turns per second the sky drifts round the vertical, the slow life of it
varying vec3 vDir;
#define N ${N.toFixed(1)}
#define SAMPLES ${samples}
#define HALFWIN ${HALF.toFixed(1)}
#define GLOWK ${glowK}
const float TAU = 6.2831853;
float hash1(float k) {       // k an integer below 2048, exact in mediump; mixed from its two halves so no product leaves the mantissa
  float kl = mod(k, 16.0), kh = floor(k / 16.0);
  float h = fract((kl + 1.0) * (kh + 3.0) * 0.0527);
  return fract(h * 9.1 + kl * 0.37 + kh * 0.11);
}
float goldenTurn(float k) {  // fract(k·φ⁻¹), k = 64a + 8b + c: fract(64φ⁻¹) = 0.5541753, fract(8φ⁻¹) = 0.9442719
  float a = floor(k / 64.0); float r = k - 64.0 * a; float b = floor(r / 8.0); float c = r - 8.0 * b;
  return fract(fract(a * 0.5541753) + fract(b * 0.9442719) + fract(c * 0.6180340));
}
void main() {
  vec3 d = normalize(vDir);
  HP float turn = fract(time * drift);                            // the drift, kept to one turn before it meets mediump
  float az = fract(atan(d.x, -d.z) / TAU + turn + 0.5) - 0.5;    // the field's own azimuth in turns: x = sin, z = −cos, as ar.js places the cells
  float zd = d.y;
  float rd = max(sqrt(max(0.0, 1.0 - zd * zd)), 0.08);           // the parallel's radius, held off the poles
  float k0 = floor((1.0 - zd) * (N * 0.5) - 0.5);                // the lattice index whose z is nearest this fragment
  float lit = 0.0;
#if SAMPLES > 0
  for (int j = 0; j < SAMPLES; j++) {
    float k = k0 + float(j) - HALFWIN;
    float ok = step(-0.5, k) * step(k, N - 0.5);                 // 0 ≤ k < N
    float z = 1.0 - (2.0 * k + 1.0) / N;
    float dz = (z - zd) / rd;                                    // along the meridian, radians
    float da = fract(goldenTurn(k) - az + 0.5) - 0.5;            // along the parallel, turns, wrapped
    float dx = da * TAU * rd;
    float q = dz * dz + dx * dx;                                 // angular distance², radians²
    float h = hash1(k);
    float mag = 0.3 + 0.7 * h * h;                               // most stars faint, a few bright
    HP float ph = time * (0.5 + h) + h * 40.0;
    float tw = 0.78 + 0.22 * sin(mod(ph, TAU));                  // the twinkle, its phase wrapped before it is sined
    lit += ok * mag * tw * (exp(-q * 24000.0) + 0.045 / (1.0 + q * GLOWK));
  }
#endif
  // the field itself: a dark phosphor green brightest along the cycle's band, SEED's gold at the floor's centre, a pale ∞ at the zenith
  float band = exp(-zd * zd * 5.0);
  float seed = exp(-(zd + 1.0) * 4.0);
  float zen = exp(-(1.0 - zd) * 6.0);
  float sp = fract(az * 12.0 + 0.5) - 0.5;                       // the twelve spokes, one a ray, in the field's azimuths
  float spokes = exp(-sp * sp * 700.0) * (1.0 - smoothstep(0.25, 0.85, abs(zd)));
  float breathe = 1.0 - breath * 0.5 * (1.0 - cos(mod(time, 13.0) * (TAU / 13.0)));   // 13 s = F(7), the tape's own offset
  vec3 col = green * (0.040 + 0.045 * band) + gold * (0.035 * seed) + green * (0.06 * zen);
  col += gold * (spokes * rays * 0.10);
  col += mix(green, vec3(0.92, 0.98, 0.94), 0.45) * (lit * stars);
  gl_FragColor = vec4(col * breathe, 1.0);
}`;
    const vertexShader = `varying vec3 vDir;
void main() {
  // the clip-space corner's view ray: back through the projection (an off-axis one too), then out of the view by its rotation
  vec3 d = vec3((position.x + projectionMatrix[2][0]) / projectionMatrix[0][0], (position.y + projectionMatrix[2][1]) / projectionMatrix[1][1], -1.0);
  vDir = d * mat3(viewMatrix);
  gl_Position = vec4(position.xy, 0.999, 1.0);
}`;
    const uniforms = {
      time: { value: 0 }, green: { value: GREEN.slice() }, gold: { value: GOLD.slice() },
      stars: { value: opts.starLight == null ? 1.0 : opts.starLight }, rays: { value: opts.rays == null ? 1.0 : opts.rays },
      breath: { value: opts.breath == null ? 0.35 : opts.breath }, drift: { value: opts.drift == null ? 1 / 2400 : opts.drift },
    };
    return { vertexShader, fragmentShader, uniforms, blending: 'normal', depthTest: false, depthWrite: false, transparent: false, renderOrder: -10 };
  }

  // ═══ 2. the halo: [2J₁(ρ)/ρ]² as a GLSL function, r = 1 at the first dark ring ═══
  // Inside ρ < 3.4 it is the machine's six-term Horner series for J₁(x)/x, rewritten in u = ρ²/16 so that every coefficient sits
  // inside mediump's range (the given −5.65141e-9 would flush to zero in a 16-bit float; 8/1350 does not): 0.5 − u + 2u²/3 − 2u³/9 +
  // 2u⁴/45 − 8u⁵/1350 is the same polynomial. The series as given is exact to the first dark ring and leaves the truth past ρ ≈ 4.5
  // (it reads 0.021 for the first bright ring's 0.0175 and 0.60 at the second dark ring), so beyond the ring the asymptotic form
  // (8/πρ³)·cos²(ρ − 3π/4 + 3/(8ρ)) carries it: dark rings at 3.829, 7.015, 10.173, bright rings 1.73 %, 0.41 %, within 6 × 10⁻⁴ of
  // the exact pattern everywhere. airy(0) = 1.
  function halo() {
    return `#ifndef FOLD_AIRY
#define FOLD_AIRY 1
float airy(float r) {
  float rho = r * 3.8317;
  float u = rho * rho * 0.0625;
  float j = 0.5 + u * (-1.0 + u * (0.6666667 + u * (-0.2222222 + u * (0.04444444 + u * (-0.005925926)))));
  float near = 4.0 * j * j;
  float rs = max(rho, 2.5);
  float cs = cos(rs - 2.3561945 + 0.375 / rs);
  float far = 2.5464791 / (rs * rs * rs) * cs * cs;
  return mix(near, far, smoothstep(2.8, 3.6, rho));
}
// the same, lifted by a power so the rings show on a screen: lift 0.5 puts the first bright ring at 13 % of the centre
float airyGlow(float r, float lift) { return pow(max(airy(r), 0.0001), lift); }
#endif
`;
  }
  // the same function in JS, for a plot or a test
  function airyJS(r) {
    const rho = r * 3.8317, u = rho * rho * 0.0625;
    const j = 0.5 + u * (-1.0 + u * (0.6666667 + u * (-0.2222222 + u * (0.04444444 + u * (-0.005925926)))));
    const near = 4 * j * j, rs = Math.max(rho, 2.5), cs = Math.cos(rs - 2.3561945 + 0.375 / rs), far = 2.5464791 / (rs * rs * rs) * cs * cs;
    const t = Math.min(1, Math.max(0, (rho - 2.8) / 0.8)), s = t * t * (3 - 2 * t);
    return near + (far - near) * s;
  }

  // ═══ 3. the CRT overlay: scanlines, vignette, the tube's bowed edge and its phosphor, the pulse — drawn last, nothing re-rendered ═══
  // One transparent quad over the scene. The darkening is black with alpha; the glow is `tint` with alpha, so with normal blending a
  // pixel goes to dst·(1 − dark − lum) + tint·lum. The 2.34 % barrel is read backwards: the pixel at c shows the flat raster's point
  // p = c(1 + k|c|²), so the scanlines bow with the tube and the raster's edge (a superellipse of p) curves in at the corners; outside
  // it the mask darkens, along it the phosphor glows. `pulse` 0 → 1 brightens the phosphor, deepens the lines and sweeps a retrace
  // band from the top down; the game sets it to 1 on a move and lets FOLD_FX.pulse() decay it by the persistence law.
  function crt(opts) {
    opts = opts || {};
    const pr = Math.min(window.devicePixelRatio || 1, 1.5);
    const fragmentShader = PRECISION + `
uniform vec2 res;           // the drawing buffer in device pixels
uniform float time;
uniform float pulse;        // 0..1, flashed by the game on each move
uniform vec3 tint;          // the phosphor's colour, or the move's hue
uniform float scan;         // darkness at a scanline's centre
uniform float pitch;        // device pixels per scanline
uniform float vignette;     // darkness at the corners
uniform float barrel;       // the tube's curvature, 0.0234
uniform float glow;         // the phosphor along the edge
uniform float corner;       // 0 square, 1 round
uniform float mask;         // darkness outside the tube
varying vec2 vUv;
const float TAU = 6.2831853;
void main() {
  vec2 c = vUv * 2.0 - 1.0;
  float r2 = dot(c, c);
  vec2 p = c * (1.0 + barrel * r2);                              // the flat raster's point shown here, r/(1 + k r²) run backwards
  vec2 q = abs(p);
  float n = mix(14.0, 5.0, corner);
  float e = pow(q.x, n) + pow(q.y, n);                           // the tube's edge at e = 1
  float inside = 1.0 - smoothstep(0.90, 1.0, e);
  float band = smoothstep(0.35, 0.97, e) * inside;               // the phosphor's band along the edge
  HP float y = gl_FragCoord.y + (p.y - c.y) * 0.5 * res.y;       // the raster row, bowed: the fraction below is what needs highp
  float line = 0.5 + 0.5 * cos(fract(y / pitch) * TAU);
  float sl = scan * line * line;
  float vig = vignette * smoothstep(0.35, 1.0, r2 * 0.5);        // the machine's 1 − 0.4 r², as darkening toward the corners
  float sw = (vUv.y - (1.0 - pulse)) * 30.0;
  float sweep = exp(-sw * sw) * pulse;                           // the retrace band
  float dark = clamp((sl * (1.0 + 0.6 * pulse) + vig) * inside + mask * (1.0 - inside), 0.0, 1.0);
  float lum = glow * band + pulse * (0.10 + 0.22 * band) + 0.30 * sweep;
  float a = clamp(dark + lum, 0.0, 1.0);
  vec3 col = tint * (lum / max(dark + lum, 0.001));
  gl_FragColor = vec4(col, a);
}`;
    const uniforms = {
      res: { value: [Math.round(window.innerWidth * pr), Math.round(window.innerHeight * pr)] }, time: { value: 0 }, pulse: { value: 0 },
      tint: { value: GREEN.slice() }, scan: { value: opts.scan == null ? 0.20 : opts.scan }, pitch: { value: opts.pitch || 2 * pr },
      vignette: { value: opts.vignette == null ? 0.55 : opts.vignette }, barrel: { value: opts.barrel == null ? BARREL : opts.barrel },
      glow: { value: opts.glow == null ? 0.10 : opts.glow }, corner: { value: opts.corner == null ? 0.35 : opts.corner }, mask: { value: opts.mask == null ? 0.85 : opts.mask },
    };
    return { vertexShader: QUAD_VS, fragmentShader, uniforms, blending: 'normal', depthTest: false, depthWrite: false, transparent: true, renderOrder: 1000 };
  }
  // the pulse: set to `strength` and let the phosphor's own law bring it down over `ms`; one timer per uniforms object
  function pulse(uniforms, tintRGB, strength, ms) {
    if (!uniforms || !uniforms.pulse) return;
    if (tintRGB) uniforms.tint.value = [tintRGB[0], tintRGB[1], tintRGB[2]];
    const s = strength == null ? 1 : strength, dur = ms || 600, t0 = performance.now();
    if (uniforms._pulseRaf) cancelAnimationFrame(uniforms._pulseRaf);
    const step = () => { const T = 0.5 * (performance.now() - t0) / dur; uniforms.pulse.value = s * persistence(T); if (T < 0.5) uniforms._pulseRaf = requestAnimationFrame(step); else { uniforms.pulse.value = 0; uniforms._pulseRaf = 0; } };
    step();
  }
  // the resolution the overlay needs: the drawing buffer, from the renderer when there is one
  function resize(uniforms, renderer) {
    if (!uniforms || !uniforms.res) return;
    let w, h;
    if (renderer && renderer.getDrawingBufferSize) { const v = renderer.getDrawingBufferSize(renderer._fxSize || (renderer._fxSize = { x: 0, y: 0, set(x, y) { this.x = x; this.y = y; return this; }, floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); return this; } })); w = v.x; h = v.y; }
    else { const pr = Math.min(window.devicePixelRatio || 1, 1.5); w = Math.round(window.innerWidth * pr); h = Math.round(window.innerHeight * pr); }
    uniforms.res.value = [w, h];
  }

  // ═══ 4. the room's moves: a CSS filter and transform for the camera <video>, one a move ═══
  // The fold mirrors the room (a half turn of the field is the far side; on the screen, left for right); the inverse flips it (dlog
  // negated: the mirror the other way); ×i turns it a quarter; Γ inverts it and keeps the hues (the reflection); ×g and ÷g turn the hue
  // by one tick of the cycle, 360/256° = 1.40625°, and the picture by the same, a scale hiding the edge. The base filter of the page,
  // saturate(.75) brightness(.8), is kept in every string. Returns {filter, transform, toString}; the string form is a cssText.
  const BASE_FILTER = 'saturate(.75) brightness(.8)';
  const TICK = (360 / 256).toFixed(5) + 'deg';
  function cssFilter(opId, opts) {
    opts = opts || {};
    const asp = opts.aspect || (window.innerWidth / Math.max(1, window.innerHeight));
    const cover = Math.max(asp, 1 / asp).toFixed(3);              // the scale that keeps a quarter-turned cover-fit video covering
    const r = {
      g: { filter: BASE_FILTER + ' hue-rotate(' + TICK + ')', transform: 'rotate(' + TICK + ') scale(1.03)' },
      ig: { filter: BASE_FILTER + ' hue-rotate(-' + TICK + ')', transform: 'rotate(-' + TICK + ') scale(1.03)' },
      fold: { filter: BASE_FILTER, transform: 'scaleX(-1)' },
      inv: { filter: BASE_FILTER, transform: 'scaleY(-1)' },
      i: { filter: BASE_FILTER, transform: 'rotate(90deg) scale(' + cover + ')' },
      gam: { filter: BASE_FILTER + ' invert(1) hue-rotate(180deg)', transform: 'scale(1.06)' },
    }[opId] || { filter: BASE_FILTER, transform: 'none' };
    r.toString = function () { return 'filter:' + this.filter + ';transform:' + this.transform; };
    return r;
  }
  const cssReset = { filter: BASE_FILTER, transform: 'none', toString() { return 'filter:' + this.filter + ';transform:' + this.transform; } };
  // apply a move to a video element and bring it back after `ms`; a transition is set on the element the first time
  function cssApply(el, opId, ms) {
    if (!el) return; if (!el._fxT) { el._fxT = 1; el.style.transition = 'filter .25s ease, transform .35s cubic-bezier(.2,.8,.2,1)'; }
    const c = cssFilter(opId); el.style.filter = c.filter; el.style.transform = c.transform;
    clearTimeout(el._fxBack); el._fxBack = setTimeout(() => { el.style.filter = cssReset.filter; el.style.transform = cssReset.transform; }, ms || 640);
  }

  // ═══ 5. the Γ warp: a Möbius map of the screen, identity → (z − a)/(z + a) as t runs 0 → 1 ═══
  // `moebius(p, t)` takes a screen uv in 0..1, z = 2p − 1, w = (z − a)(z̄ + a)/|z + a|² = ((|z|² − a²) + 2a·y i)/|z + a|², and gives
  // back mix(z, w, t)/2 + ½. a = 0.47 = 120/257 scaled: Γ's zero is at (0.735, 0.5) of the screen and its pole at (0.265, 0.5), where the
  // map runs to infinity; the warp overlay clamps what it samples there. `moebiusA` does the same in aspect-true units so circles stay
  // circles. warp() is the overlay: with useMap it samples a texture by the warped uv (the previous frame, by grab()); without, it
  // draws Γ's own circles, |w| constant about ±a and arg w constant through them, moving as t runs.
  function gammaWarp() {
    return `#ifndef FOLD_MOEBIUS
#define FOLD_MOEBIUS 1
#define MOEBIUS_A 0.47
vec2 moebius(vec2 p, float t) {
  vec2 z = p * 2.0 - 1.0;
  vec2 zp = vec2(z.x + MOEBIUS_A, z.y);
  float den = max(dot(zp, zp), 0.0001);
  vec2 w = vec2(dot(z, z) - MOEBIUS_A * MOEBIUS_A, 2.0 * MOEBIUS_A * z.y) / den;
  return mix(z, w, t) * 0.5 + 0.5;
}
vec2 moebiusA(vec2 p, float t, float aspect) {
  vec2 z = (p * 2.0 - 1.0) * vec2(aspect, 1.0);
  vec2 zp = vec2(z.x + MOEBIUS_A, z.y);
  float den = max(dot(zp, zp), 0.0001);
  vec2 w = vec2(dot(z, z) - MOEBIUS_A * MOEBIUS_A, 2.0 * MOEBIUS_A * z.y) / den;
  return mix(z, w, t) / vec2(aspect, 1.0) * 0.5 + 0.5;
}
#endif
`;
  }
  function warp(opts) {
    opts = opts || {};
    const fragmentShader = PRECISION + `
uniform sampler2D map; uniform float useMap;
uniform float t;            // 0 identity … 1 the full map; the game runs it up and back
uniform float aspect;       // width / height
uniform vec3 tint; uniform float time;
varying vec2 vUv;
const float TAU = 6.2831853;
` + gammaWarp() + `
void main() {
  vec2 uvw = moebiusA(vUv, t, aspect);
  if (useMap > 0.5) {
    vec4 c = texture2D(map, clamp(uvw, 0.0, 1.0));
    gl_FragColor = vec4(c.rgb, c.a * t * 0.9);
  } else {
    vec2 m = (uvw * 2.0 - 1.0) * vec2(aspect, 1.0);               // mix(z, w, t) in aspect-true units
    float lm = log2(length(m) + 0.002);
    float ring = fract(lm * 2.0 + 0.5) - 0.5;                     // |w| = 2^(n/2): about ±a at t = 1, about the centre at t = 0
    float rings = exp(-ring * ring * 120.0);
    float sp = fract(atan(m.y, m.x + 0.0001) / TAU * 12.0 + 0.5) - 0.5;   // arg w in twelfths: the rays, through ±a
    float spokes = exp(-sp * sp * 500.0);
    float fade = 1.0 - smoothstep(0.0, 2.6, length(m));
    float a = t * fade * (rings * 0.40 + spokes * 0.18);
    gl_FragColor = vec4(tint, a);
  }
}`;
    const uniforms = { map: { value: null }, useMap: { value: 0 }, t: { value: 0 }, aspect: { value: window.innerWidth / Math.max(1, window.innerHeight) }, tint: { value: [1.0, 0.55, 0.5] }, time: { value: 0 } };
    return { vertexShader: QUAD_VS, fragmentShader, uniforms, blending: 'normal', depthTest: false, depthWrite: false, transparent: true, renderOrder: 999 };
  }
  // the previous frame into a texture for warp(): one copyTexImage2D of the drawing buffer, done before the warp quad is drawn.
  // Cheap on a phone (a few ms at 1.5× DPR), a cost on a Pi; without it the warp draws Γ's circles instead. Needs THREE (r128 DataTexture).
  function grab(THREE, renderer, uniforms) {
    if (!THREE || !renderer || !uniforms || !uniforms.map) return false;
    const size = renderer.getDrawingBufferSize(renderer._fxSize2 || (renderer._fxSize2 = new THREE.Vector2()));
    let tex = uniforms.map.value;
    if (!tex || tex.image.width !== size.x || tex.image.height !== size.y) {
      if (tex) tex.dispose();
      tex = new THREE.DataTexture(null, size.x, size.y, THREE.RGBAFormat); tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
      uniforms.map.value = tex;
    }
    renderer.copyFramebufferToTexture(renderer._fxZero || (renderer._fxZero = new THREE.Vector2(0, 0)), tex); uniforms.useMap.value = 1; return true;
  }
  // run the warp: t rises to `peak` over the first third of `ms` and comes down by the persistence law
  function warpRun(uniforms, peak, ms) {
    if (!uniforms || !uniforms.t) return; const p = peak == null ? 0.35 : peak, dur = ms || 900, t0 = performance.now();
    if (uniforms._warpRaf) cancelAnimationFrame(uniforms._warpRaf);
    const step = () => { const x = (performance.now() - t0) / dur; let v; if (x < 1 / 3) { const u = x * 3; v = p * u * u * (3 - 2 * u); } else v = p * persistence(0.5 * (x - 1 / 3) * 1.5); uniforms.t.value = Math.max(0, v); if (x < 1) uniforms._warpRaf = requestAnimationFrame(step); else { uniforms.t.value = 0; uniforms._warpRaf = 0; } };
    step();
  }

  // ═══ helpers for whoever mounts these: a quad mesh from a spec (needs THREE) ═══
  function quad(THREE, spec) {
    const m = new THREE.ShaderMaterial({ vertexShader: spec.vertexShader, fragmentShader: spec.fragmentShader, uniforms: spec.uniforms, transparent: !!spec.transparent, depthTest: !!spec.depthTest, depthWrite: !!spec.depthWrite, blending: THREE.NormalBlending });
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), m); mesh.frustumCulled = false; mesh.renderOrder = spec.renderOrder || 0; return mesh;
  }
  return { sky, halo, airy: airyJS, crt, pulse, resize, cssFilter, cssReset, cssApply, gammaWarp, warp, grab, warpRun, quad, persistence, GREEN, GOLD, GROUND, BARREL, MOEBIUS_A, PHI_INV, GOLDEN_ANGLE };
})();
