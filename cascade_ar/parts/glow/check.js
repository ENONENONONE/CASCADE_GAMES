// THE FOLD — parts/glow/check.js: the glow's numbers against the code, under node with no GL. Every pass's GLSL kept to ES 1.00 and
// mediump's rules (a precision line first, the HP macro, constant loops of 9 and 16, no derivative, no lod); the tiers; the twinkle's
// periods (≥ 1.5 s, each dividing the 30 s clock) and the whole pass's largest change of luminance a frame against the flash gate's 0.1;
// the clock still under CALM and the toggle's ramp (a mock renderer, the real three.js); the third light (the tracer's) eased over 600 ms
// between keys, a step under CALM, fading in where it is and out where it was; the grade on the palette (hue kept, chroma up 15–25 %, black
// black); the bright pass's knee against the sky's field, the ring and a cell's core, and its 4-tap box; the scale (1 on the full tier:
// the scene target the screen's size, no Points scaled, no unsharp mask compiled; 0.5 on bloom: half res, the mask in) and the quarter
// targets a quarter of the screen whatever the scale; the split's bound (≤ 1 px, the outer third alone, never by brightness); the budget
// at 1280 × 800 (three lights of 16 samples under 6 ms, 32 a light over it; the sky's saving 0 at scale 1); traceStrength; the page's
// wiring. Loads three.js, data.js, field.js, fx.js, ar.js and glow.js in a page of its own. Run: node parts/glow/check.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..'), read = p => fs.readFileSync(path.join(root, p), 'utf8');
let clock = 0;
const ctx = { console, performance: { now: () => clock }, localStorage: { getItem: () => null, setItem: () => {} }, requestAnimationFrame: () => 0, cancelAnimationFrame: () => {} };
ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
for (const f of ['vendor/three.min.js', 'data.js', 'field.js', 'parts/shaders/fx.js', 'ar.js', 'parts/glow/glow.js']) vm.runInContext(read(f), ctx, { filename: f });
const T = ctx.THREE, F = ctx.FIELD, FX = ctx.FOLD_FX, AR = ctx.AR, GL = ctx.FOLD_GLOW, K = GL.K;
let fails = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fails++; console.log('FAIL', msg); } };
const near = (a, b, tol, msg) => ok(Math.abs(a - b) <= tol, msg + ': ' + a + ' against ' + b);
// 1. the GLSL: ES 1.00, mediump first, HP where a clock or the screen's uv wants it, loops constant and short, nothing WebGL1 lacks
for (const tier of ['full', 'bloom']) for (const [name, src] of Object.entries(GL.shaders(tier))) {
  ok(/^precision mediump float;/.test(src), tier + ' ' + name + ' opens with precision mediump');
  ok(/#ifdef GL_FRAGMENT_PRECISION_HIGH\s*#define HP highp/.test(src), tier + ' ' + name + ' carries the HP macro');
  ok(!/dFdx|dFdy|fwidth|texture2DLod|textureLod|#version|sampler3D|texture\(|\bout\s+vec|\bin\s+vec|gl_FragData|discard/.test(src), tier + ' ' + name + ' uses nothing past ES 1.00 (and no discard in a post pass)');
  for (const m of src.matchAll(/for \(int (\w+) = (-?\d+); \1 <(=?) (\w+|-?\d+); \1\+\+\)/g)) { const to = /^\d+$/.test(m[4]) ? +m[4] : m[4] === 'N' ? K.samples : NaN; const n = to - +m[2] + (m[3] ? 1 : 0); ok(n >= 1 && n <= 32, tier + ' ' + name + ' loop of ' + n + ' (' + m[0] + ')'); }
  ok(!/for \((?!int)/.test(src), tier + ' ' + name + ' loops on an int alone');
  ok(!/uniform HP/.test(src) || /uniform HP float time/.test(src), tier + ' ' + name + ': highp uniforms are the clock alone');
}
{ const S = GL.shaders('full'); ok((S.blurH.match(/texture2D\(/g) || []).length === 1 && (S.blurV.match(/texture2D\(/g) || []).length === 3 && new RegExp('if \\(i >= -' + K.cross + ' && i <= ' + K.cross + '\\)').test(S.blurV), 'the blur fetches once a tap, V the cross\'s ±' + K.cross + ' of the bright pass and the centre');
  ok(K.taps >= 9 && K.taps <= 13 && K.taps % 2 === 1 && new RegExp('for \\(int i = -' + ((K.taps - 1) >> 1) + '; i <= ' + ((K.taps - 1) >> 1)).test(S.blurH), 'the blur has ' + K.taps + ' taps (9–13, odd)');
  ok(K.samples >= 16 && K.samples <= 32 && K.lights === 3 && new RegExp('#define N ' + K.samples).test(S.rays), 'the shafts take ' + K.samples + ' samples a light (16–32), ' + K.lights + ' lights');
  ok(/lightA\.z > 0\.0/.test(S.rays) && /lightB\.z > 0\.0/.test(S.rays) && /spokeDir\[12\]/.test(S.rays) && /spokeCol\[12\]/.test(S.rays), 'the eye and the floor, each a uniform branch, the floor\'s tinted by the twelve spokes');
  ok(/uniform vec3 lightC; uniform vec3 colC;/.test(S.rays) && /if \(lightC\.z > 0\.0\) col \+= shaft\(lightC\.xy\) \* drift\(lightC\.xy\) \* lightC\.z \* mix\(vec3\(1\.0\), colC \* 1\.4, 0\.7\);/.test(S.rays), 'the third light, the tracer\'s: a uniform branch in its own colour, the same shaft and drift');
  ok((S.rays.match(/shaft\(light[ABC]\.xy\)/g) || []).length === 3 && (S.rays.match(/texture2D\(/g) || []).length === 1, 'three shafts of one loop body: ' + K.lights * K.samples + ' samples a pixel');
  ok(/#define RAYS 1/.test(S.composite) && /#define SPLIT 1/.test(S.composite) && /#define RAYS 0/.test(GL.shaders('bloom').composite) && /#define SPLIT 0/.test(GL.shaders('bloom').composite), 'the bloom tier\'s composite drops the shafts and the split');
  ok(/#if 1/.test(S.bright) && /#if 0/.test(GL.shaders('bloom').bright), 'the bloom tier\'s bright pass drops the glitter');
  ok(/varying HP vec2 vUv/.test(S.composite) && !/varying HP/.test(S.bright) && !/varying HP/.test(S.blurH), 'highp on the composite\'s uv alone');
  ok(/HP float ph = fract\(time \/ T \+ h2\)/.test(S.bright) && /HP float t = fract\(time \/ 30\.0\)/.test(S.rays), 'every phase wrapped in highp before it is sined');
  ok(/mod\(c\.x, 32\.0\) \* mod\(c\.y, 32\.0\)/.test(S.bright), 'the hash\'s products stay under 2048 for mediump');
  // the scale: the full tier's composite takes the scene as drawn (no mask), the bloom tier's at 0.5 sharpens it; the bright pass boxes four
  ok((S.bright.match(/texture2D\(scene/g) || []).length === 4 && /uniform vec2 qx/.test(S.bright) && /0\.25 \* \(texture2D\(scene, vUv \+ qx\)/.test(S.bright), 'the bright pass boxes 4 fetches at ±qx (one scene texel at scale 1): a mean over the 4 × 4 block, no lucky sample');
  ok(GL.scaleFor('full') === 1 && GL.scaleFor('bloom') === 0.5 && K.scale === 1 && K.scaleLow === 0.5, 'the scale by tier: full 1 (the scene at the screen\'s size), bloom 0.5');
  ok(/#define SHARP 0/.test(S.composite) && /#define SHARP 1/.test(GL.shaders('bloom').composite) && /#define SHARP 1/.test(GL.shaders('full', 0.5).composite) && /#define SHARP 0/.test(GL.shaders('bloom', 1).composite), 'the unsharp mask is compiled in at a scale under 1 alone, whatever the tier');
  ok(/#if SHARP\s*\n\s*vec3 n = texture2D\(scene, vUv \+ tx\)/.test(S.composite) && /#else\s*\n\s*vec3 s = c\.rgb;/.test(S.composite), 'at scale 1 the scene is taken as drawn: a texel a pixel');
  ok(/float off = caK \* smoothstep\(0\.5, 1\.0, e\);/.test(S.composite) && !/off = [^\n]*lum\(/.test(S.composite), 'the split: by the distance from the centre alone (none inside 0.71 of the way out, caK from the sides\' middles), never by brightness');
  ok(K.sharp > 0 && K.sharp <= 0.25, 'the mask, where it is compiled in, is gentle: ' + K.sharp); }
// 2. the tiers
{ const t = (p, d) => GL.tierFor(p, d), tiny = { tiny: true, lowEnd: true }, low = { lowEnd: true }, full = {};
  ok(t('auto', tiny) === 'off' && t('auto', low) === 'bloom' && t('auto', full) === 'full' && t(undefined, full) === 'full' && t(undefined, tiny) === 'off', 'auto: tiny off, lowEnd bloom, else full');
  ok(t('on', tiny) === 'full' && t('on', low) === 'full' && t('off', full) === 'off' && t('off', tiny) === 'off', 'on is the full pass anywhere, off is off'); }
// 3. the twinkle: 1.5, 2, 2.5 or 3 s, each dividing the 30 s clock; 0.1 … 1, never off; the largest change a frame of the whole pass's
// luminance, were the whole screen a sparkle twinkling in step at the fastest period and 30 fps, under the gate's 0.1 by a wide margin
{ const Ts = new Set(); for (let h = 0; h < 1; h += 0.001) Ts.add(GL.period(h)); ok([...Ts].sort().join() === '1.5,2,2.5,3', 'the periods: ' + [...Ts].join(' '));
  ok([...Ts].every(T => T >= 1.5 && Math.abs(K.wrap / T - Math.round(K.wrap / T)) < 1e-9), 'every period ≥ 1.5 s and dividing the ' + K.wrap + ' s clock');
  let lo = 1, hi = 0, dmax = 0; for (const T of Ts) for (let t = 0; t < 30; t += 1 / 30) { const a = GL.twinkle(t, T, 0.3), b = GL.twinkle(t + 1 / 30, T, 0.3); lo = Math.min(lo, a); hi = Math.max(hi, a); dmax = Math.max(dmax, Math.abs(b - a)); }
  near(lo, 0.1, 0.002, 'the twinkle\'s floor'); near(hi, 1, 0.002, 'its peak');
  const worst = dmax * K.glitter;   // the sparkle's own light is at most glitK of white over the whole screen
  ok(worst < 0.1 && worst < 0.05, 'the glitter changes the screen\'s luminance by at most ' + worst.toFixed(4) + ' a frame at 30 fps (the gate asks 0.1)');
  ok(2 * Math.PI * 0.45 / 1.5 / 30 >= dmax - 1e-6, 'the fastest sparkle moves 2π·0.45/1.5 a second'); }
// 4. the clock under CALM, and the toggle's ramp: a mock renderer, the real three.js (targets made, never bound)
{ const gl = { getExtension: () => null, checkFramebufferStatus: () => 1, FRAMEBUFFER: 0, FRAMEBUFFER_COMPLETE: 1 }, size = { w: 1280, h: 800 };
  const renderer = { getContext: () => gl, capabilities: { isWebGL2: false }, getDrawingBufferSize: v => v.set(size.w, size.h), setRenderTarget() {}, render() {}, autoClear: true };
  const scene = new T.Scene(), pts = new T.Points(new T.BufferGeometry(), new T.PointsMaterial({ size: 0.12 })); scene.add(pts);
  clock = 0; const G = GL.mount(T, renderer, { tier: 'full', FX, scene });
  ok(G.tier === 'full' && G.level === 1 && G.u.mixK.value === 1 && G.halfOk === false && G.scale === 1, 'mounted on at level 1, scale 1; no half floats without the extensions');
  G.begin(); ok(G.rt.hw === 1280 && G.rt.hh === 800 && G.rt.qw === 320 && G.rt.qh === 200 && G.rt.scene.texture.type === T.UnsignedByteType && G.rt.bright.texture.type === T.UnsignedByteType, 'the scene target the screen\'s 1280 × 800 of bytes, quarter 320 × 200: ' + [G.rt.hw, G.rt.hh, G.rt.qw, G.rt.qh].join('×'));
  ok(['scene', 'bright', 'a', 'b', 'rays'].every(k => G.rt[k].texture.minFilter === T.LinearFilter && G.rt[k].texture.magFilter === T.LinearFilter && !G.rt[k].texture.generateMipmaps), 'every target LinearFilter both ways, no mipmaps: the quarter-res light comes up bilinear');
  near(G.bright.qx.value.x, 1 / 1280, 1e-12, 'qx one scene texel at scale 1 (a quarter of a quarter texel)'); near(G.u.tx.value.x, 1 / 1280, 1e-12, 'tx a scene texel');
  near(pts.material.size, 0.12, 1e-12, 'a Points material is left alone at scale 1'); G.end({ calm: false }); near(pts.material.size, 0.12, 1e-12, 'and after');
  { const H = GL.mount(T, renderer, { tier: 'bloom', FX, scene }); ok(H.scale === 0.5, 'mounted as bloom: scale 0.5'); H.begin(); ok(H.rt.hw === 640 && H.rt.hh === 400 && H.rt.qw === 320 && H.rt.qh === 200, 'the half-res scene target 640 × 400, the quarter targets still 320 × 200: ' + [H.rt.hw, H.rt.hh, H.rt.qw, H.rt.qh].join('×'));
    near(H.bright.qx.value.x, 1 / 1280, 1e-12, 'qx half a scene texel at 0.5: the box reads the 2 × 2 exactly'); near(pts.material.size, 0.06, 1e-12, 'a Points material is halved for the half-res draw'); H.end({}); near(pts.material.size, 0.12, 1e-12, 'and put back after');
    ok(/#define SHARP 1/.test(H.materials().composite.fragmentShader), 'its composite sharpens'); H.dispose();
    const F2 = GL.mount(T, renderer, { tier: 'bloom', scale: 1, FX, scene }); F2.begin(); ok(F2.scale === 1 && F2.rt.hw === 1280 && /#define SHARP 0/.test(F2.materials().composite.fragmentShader), 'a scale set by opts holds whatever the tier'); F2.end({}); F2.setTier('full'); ok(F2.scale === 1, 'and through a change of tier'); F2.dispose(); }
  for (let i = 0; i < 20; i++) { clock += 50; G.begin(); G.end({ calm: false }); } const c1 = G.clock; for (let i = 0; i < 20; i++) { clock += 50; G.begin(); G.end({ calm: true }); }
  near(c1, 1, 1e-9, 'the clock runs by its own dt'); near(G.clock, 1, 1e-9, 'and stands still under CALM: the shafts and the glitter are stills'); ok(G.bright.time.value === G.clock && G.rays.time.value === G.clock, 'the passes read the one clock');
  clock += 1000; G.begin(); G.end({}); near(G.clock, 1.1, 1e-9, 'a frame adds at most 0.1 s: a tab in the background never jumps');
  for (let i = 0; i < 400; i++) { clock += 100; G.begin(); G.end({}); } ok(G.clock < K.wrap && G.clock > 0 && Math.abs(G.clock - (41.1 % K.wrap)) < 1e-6, 'the clock wraps at ' + K.wrap + ' s: ' + G.clock.toFixed(3));
  G.end({ room: true }); ok(G.u.rayK.value === K.raysRoom && G.u.crush.value === 0, 'over the room the shafts go faint and nothing is crushed'); G.end({}); ok(G.u.rayK.value === K.rays && G.u.crush.value === K.crush, 'over the sky the full shafts and the crush');
  clock = 50000; G.setTier('off'); ok(G.tier === 'full' && G.want === 'off', 'off: the pass keeps running while the mix ramps down'); clock += 300; G.begin(); G.end({}); ok(G.level > 0.4 && G.level < 0.6 && G.u.mixK.value === G.level, 'half way at 300 ms: ' + G.level.toFixed(3)); clock += 400; G.begin(); G.end({}); ok(G.tier === 'off' && G.level === 0, 'and off at 600 ms'); ok(G.begin() === false, 'begin() is false while off');
  G.setTier('bloom'); ok(G.tier === 'bloom' && G.want === 'bloom' && /#define RAYS 0/.test(G.materials().composite.fragmentShader), 'on again as bloom: the composite rebuilt without the shafts'); clock += 50; G.begin(); G.end({}); ok(G.level > 0 && G.level < 0.2, 'ramping up: ' + G.level.toFixed(3));
  ok(G.scale === 0.5 && G.rt.hw === 640 && G.rt.scale === 0.5 && /#define SHARP 1/.test(G.materials().composite.fragmentShader), 'the bloom tier takes its scale, 0.5: the targets remade at 640 × 400, the mask in');
  FX.calm(true); G.setTier('full'); clock += 1; G.begin(); G.end({ calm: true }); ok(G.level === 1 && G.tier === 'full', 'under CALM the toggle steps'); FX.calm(false);
  ok(G.scale === 1 && G.rt.hw === 1280 && /#define SHARP 0/.test(G.materials().composite.fragmentShader), 'back to full: scale 1, the screen-size target, no mask');
  // the third light: fades in where it is over 600 ms (smoothstep), glides to a new key's place and colour, follows the live place meanwhile,
  // fades out where it stood when the light goes, steps under CALM; off while the tier is bloom
  { const C = G.rays.lightC.value, CC = G.rays.colC.value, tr = { pos: [0.3, 0.4], a: 0.8, rgb: [0.7, 1, 0.85], key: 'a' };
    clock = 60000; G.begin(); G.end({}); ok(C.z === 0, 'no trace: the third light is off');
    G.begin(); G.end({ trace: tr }); ok(C.z === 0 && Math.abs(C.x - 0.3) < 1e-9 && Math.abs(C.y - 0.4) < 1e-9 && Math.abs(CC.y - 1) < 1e-9, 'a new light starts at 0 at its own place and colour: ' + [C.x, C.y, C.z].join());
    clock += 300; G.begin(); G.end({ trace: tr }); near(C.z, 0.4, 1e-9, 'half way up at 300 ms (smoothstep): ' + C.z.toFixed(3)); clock += 300; G.begin(); G.end({ trace: tr }); near(C.z, 0.8, 1e-9, 'full at 600 ms');
    tr.pos[0] = 0.32; G.begin(); G.end({ trace: tr }); near(C.x, 0.32, 1e-9, 'the same key follows the live place (the camera moved) with no ramp');
    const t2 = { pos: [0.6, 0.2], a: 0.4, rgb: [1, 0.5, 0.2], key: 'b' }; G.begin(); G.end({ trace: t2 }); near(C.x, 0.32, 1e-9, 'a new key starts from where the shaft was'); near(C.z, 0.8, 1e-9, 'at its strength');
    clock += 300; G.begin(); G.end({ trace: t2 }); near(C.x, 0.46, 1e-9, 'half way across at 300 ms: ' + C.x.toFixed(3)); near(C.y, 0.3, 1e-9, 'in v too'); near(C.z, 0.6, 1e-9, 'the strength eases'); near(CC.x, 0.85, 1e-9, 'and the colour: ' + CC.x.toFixed(3));
    clock += 300; G.begin(); G.end({ trace: t2 }); near(C.x, 0.6, 1e-9, 'arrived'); near(C.z, 0.4, 1e-9, 'at the new strength'); near(CC.z, 0.2, 1e-9, 'in the new colour');
    G.begin(); G.end({}); clock += 300; G.begin(); G.end({}); near(C.z, 0.2, 1e-9, 'the light gone: half way out at 300 ms'); near(C.x, 0.6, 1e-9, 'where it stood'); clock += 300; G.begin(); G.end({}); ok(C.z === 0, 'and out at 600 ms');
    FX.calm(true); G.begin(); G.end({ trace: tr, calm: true }); near(C.z, 0.8, 1e-9, 'under CALM a new light steps to its strength'); near(C.x, 0.32, 1e-9, 'at its place'); FX.calm(false);
    G.begin(); G.end({ trace: null }); ok(G.trace.key === null && G.trace.x === 0, 'null clears the key and restarts the ramp down');
    ok(K.ease === 600, 'the ease is the toggle\'s 600 ms'); }
  size.w = 1000; size.h = 500; G.begin(); ok(G.rt.hw === 1000 && G.rt.qw === 250 && G.u.res.value.x === 1000 && Math.abs(G.rays.aspect.value - 2) < 1e-9, 'a resize remakes the targets'); G.end({});
  G.dispose(); ok(!G.rt.scene, 'disposed'); }
// 5. the grade on the palette: hue kept within 1°, chroma up 15–25 % wherever a colour has the room (a colour already at a channel's end,
// a pure ray or a move's hue at 70 % saturation, is lifted only as far as its channels allow, never past them), black black; the field shows
{ const hsl = c => new T.Color(c[0], c[1], c[2]).getHSL({}), chroma = c => Math.max(...c) - Math.min(...c), ops = ctx.FIELD.OPS.concat([ctx.FIELD.FLIP]);
  const pal = { green: FX.GREEN, gold: FX.GOLD, current: [0.55, 1, 0.6], target: [1, 0.83, 0.35], home: [0.5, 0.72, 1], goldCell: [1, 0.84, 0.47], phosphorTrail: FX.GREEN.map(x => x * 0.5), field: FX.GREEN.map(x => x * 0.3) };
  AR.RAY_RGB.forEach((c, r) => pal['ray ' + r] = c); for (const o of ops) { const c = new T.Color().setHSL(o.hue / 360, 0.7, 0.6); pal['move ' + o.id] = [c.r, c.g, c.b]; }
  let worstHue = 0, lo = 9, hi = 0, lifted = 0;
  for (const [name, c] of Object.entries(pal)) { const g = GL.grade(c), a = hsl(c), b = hsl(g); let dh = Math.abs(a.h - b.h) * 360; dh = Math.min(dh, 360 - dh); worstHue = Math.max(worstHue, dh); const r = chroma(g) / chroma(c); lo = Math.min(lo, r); hi = Math.max(hi, r);
    const L = GL.lum(c), room = Math.min(K.sat, (1 - L) / (Math.max(...c) - L), L / (L - Math.min(...c))); if (room >= K.sat) lifted++;
    ok(dh <= 1 && r <= 1.25 && r >= Math.min(K.sat, room) * 0.97 && g.every(x => x >= 0 && x <= 1 + 1e-9), name + ': hue ' + dh.toFixed(2) + '°, chroma ×' + r.toFixed(3) + ' (room ×' + room.toFixed(2) + ')'); }
  ok(worstHue <= 1 && hi <= 1.25 && lifted >= 8, 'the palette keeps its hues (worst ' + worstHue.toFixed(2) + '°), chroma ×' + lo.toFixed(2) + ' … ×' + hi.toFixed(2) + ', ' + lifted + ' of ' + Object.keys(pal).length + ' lifted the full ×' + K.sat);
  ok(GL.grade([0, 0, 0]).every(x => x === 0) && GL.grade([1, 1, 1]).every(x => Math.abs(x - 1) < 1e-9), 'black stays black, white white');
  const field = FX.GREEN.map(x => x * 0.085), gf = GL.grade(field); ok(GL.lum(gf) > 0.5 * GL.lum(field) && GL.lum(gf) < GL.lum(field), 'the sky\'s field is deepened, not lost: ' + GL.lum(field).toFixed(4) + ' → ' + GL.lum(gf).toFixed(4)); }
// 6. the bright pass's knee: the field under it, the ring through it, a cell's core whole; the split at most 2 px; the shafts' lights
{ const knee = L => { const t = Math.min(1, Math.max(0, (L - K.lo) / (K.hi - K.lo))); return t * t * (3 - 2 * t); };
  const field = Math.max(...FX.GREEN.map(x => x * 0.085)), ring = Math.max(...FX.GOLD.map(x => x * Math.pow(FX.airy(1.3405), 0.45) * FX.LENS_GAIN)), core = 0.55;
  ok(knee(field) === 0, 'the sky\'s field (max channel ' + field.toFixed(3) + ') lights no bloom'); ok(knee(ring) >= 0.6, 'the photon ring (' + ring.toFixed(3) + ') blooms at ' + knee(ring).toFixed(2)); ok(knee(core) === 1, 'a cell\'s core (' + core + ') blooms whole');
  ok(K.ca > 0 && K.ca <= 1, 'the RGB split is at most ' + K.ca + ' px'); ok(K.raysRoom < K.rays / 2, 'over the room the shafts are faint: ' + K.raysRoom + ' of ' + K.rays);
  { const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }, off = e => K.ca * sm(0.5, 1, e);   // the composite's own law, e = 4|uv − ½|²
    ok(off(0) === 0 && off(0.49) === 0 && off(4 * 0.3 * 0.3) === 0, 'no split at the centre nor within 0.3 of the half-width (text and cells there untouched)');
    ok(Math.abs(off(1) - K.ca) < 1e-12 && Math.abs(off(2) - K.ca) < 1e-12 && off(0.75) > 0.4 * K.ca && off(0.75) < 0.6 * K.ca, 'the full ' + K.ca + ' px from the sides\' middles to the corners, half way at 0.87 of the way out'); }
  ok(K.sat >= 1.15 && K.sat <= 1.25 && K.crush > 0 && K.crush < 0.05, 'the grade: saturation ×' + K.sat + ', the lift crushed by ' + K.crush); }
// 7. the budget at 1280 × 800: the fetches and ops by the tap counts, under a mid phone's 6 ms with three lights of 16 samples and the scene
// at the screen's size (the composite reads it once, plus the split's two: 5 fetches a pixel, the mask's two gone); 32 a light would not
// fit; the sky's saving is 0 at scale 1 and 1.15 G ops on the bloom tier's half res
{ const b = GL.budget(1280, 800, 'full'), l = GL.budget(1280, 800, 'bloom'), h = GL.budget(1280, 800, 'full', 0.5);
  ok(b.scale === 1 && b.scenePx === 1280 * 800 && b.quarterPx === 320 * 200, 'the targets: the scene ' + b.scenePx + ' px (the screen), the quarter ' + b.quarterPx + ' px');
  ok(l.scale === 0.5 && l.scenePx === 640 * 400 && l.quarterPx === 320 * 200, 'bloom: the scene ' + l.scenePx + ' px, the quarter still ' + l.quarterPx);
  ok(b.samples === 48 && b.f.rays === 320 * 200 * 48 && b.o.rays === 320 * 200 * (48 * 7 + 96 + 40), 'the shafts: ' + b.samples + ' samples a pixel, ' + (b.f.rays / 1e6).toFixed(2) + ' M fetches');
  ok(b.f.bright === 320 * 200 * 4 && b.sceneReads === 3 && b.f.composite === 1280 * 800 * 5 && h.f.composite === 1280 * 800 * 7, 'the bright pass 4 a texel; the composite 5 a pixel at scale 1 (the scene, the split\'s two, the bloom, the shafts), 7 with the mask at 0.5');
  ok(b.fetches < 16e6 && b.ms < 6, 'full: ' + (b.fetches / 1e6).toFixed(2) + ' M fetches, ' + (b.ops / 1e6).toFixed(0) + ' M ops, ~' + b.ms + ' ms'); ok(l.fetches < b.fetches * 0.6 && l.ms < b.ms, 'bloom: ' + (l.fetches / 1e6).toFixed(2) + ' M fetches, ~' + l.ms + ' ms');
  ok(b.fetches < h.fetches && b.ms < h.ms && b.sceneBytes === 1280 * 800 * 4 * 5 && b.sceneBytes > h.sceneBytes, 'against the same pass over a half-res scene (' + h.ms + ' ms): fewer fetches without the mask, more bytes through the scene target (' + (b.sceneBytes / 1e6).toFixed(1) + ' MB a frame against ' + (h.sceneBytes / 1e6).toFixed(1) + ')');
  const was = K.samples, at = n => { K.samples = n; const m = GL.budget(1280, 800, 'full').ms; K.samples = was; return m; };
  ok(at(16) < 6 && at(24) < 6 && at(32) >= 6, 'three lights fit at 16 a light (24 would now too, 32 not): 16 → ' + at(16) + ' ms, 24 → ' + at(24) + ', 32 → ' + at(32));
  ok(b.skyOps === 0 && l.skyOps > 1e9, 'the sky\'s saving: none at scale 1, ' + (l.skyOps / 1e9).toFixed(2) + ' G ops a frame on the bloom tier\'s half res');
  const ts = GL.traceStrength; ok(ts(0) === 0 && ts(undefined) === 0 && ts(-5) === 0 && Math.abs(ts(545) - 545 / 640) < 1e-9 && ts(640) === 1 && ts(780) === 1 && K.traceRef === 640, 'traceStrength: energy / ' + K.traceRef + ' clamped: a typical cell (545) ' + ts(545).toFixed(2) + ', the brightest 1, none 0'); }
// 8. the page: the script, the shell, the button and the key
{ const html = read('index.html'), sw = read('sw.js'); ok(/<script src="parts\/glow\/glow.js">/.test(html) && /'\.\/parts\/glow\/glow\.js'/.test(sw), 'index.html loads glow.js and sw.js caches it');
  ok(/aux\('GLOW'/.test(html) && /e\.key === 'b'/.test(html) && /PREFS\.glow/.test(html), 'the GLOW button, the b key, fold.prefs.glow'); ok(/over\.add\(q\)/.test(html) && /glow\.end\(glowState\(\)\)/.test(html), 'the CRT in its own scene after the composite');
  ok(/<script src="parts\/trace\/trace.js">/.test(html) && /TRC\.lightAt\(R\)/.test(html) && /GLW\.traceStrength\(L\.energy\)/.test(html) && /traceLight\(R, key\)/.test(html), 'the third light: lightAt of the tile\'s render after every move, its strength by traceStrength');
  ok(/else if \(TRACE\.glow && glow\) R = TRC\.render\(sc, origin, t\.mode\)/.test(html) && /PREFS\.traceGlow !== 'off'/.test(html), 'the tile off: the render alone, unless fold.prefs.traceGlow is off');
  ok(/A\.onScreen\(tl\.cell\)/.test(html) && /GT\.a = c\.front \? tl\.a \* edge\(c\) : 0/.test(html) && /GS\.trace = GT/.test(html), 'its cell projected each frame as the eye is, faded at the edge, into state.trace'); }
console.log(fails ? 'FAILED ' + fails + ' of ' + checks : 'OK · ' + checks + ' checks, none failed · scale ' + K.scale + ' (bloom ' + K.scaleLow + '), split ≤ ' + K.ca + ' px, ' + K.taps + ' taps, ' + K.lights + ' lights of ' + K.samples + ' samples, twinkle 1.5–3 s, ' + (GL.budget(1280, 800, 'full').fetches / 1e6).toFixed(1) + ' M fetches at 1280 × 800, ~' + GL.budget(1280, 800, 'full').ms + ' ms');
process.exit(fails ? 1 : 0);
