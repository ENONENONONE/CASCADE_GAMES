# THE FOLD · shaders — notes

`fx.js` defines `window.FOLD_FX`; `demo.html` shows every effect (open it over http, or file:// where the browser lets a page load a
sibling script). All GLSL is ES 1.00 for three.js r128 and compiles on a WebGL1 context and a WebGL2 one (checked in the demo on the
Mac: `?gl1` forces WebGL1); `precision mediump float` is the default in every fragment, `highp` only on a raster coordinate and the
running clock, through a `HP` macro that falls back to mediump where `GL_FRAGMENT_PRECISION_HIGH` is absent. No loop runs past 23,
no derivative, no 3-D texture, normal alpha blending only (black with alpha darkens, a colour with alpha lightens toward it).

Written for: iPhone (Safari, WebGL1 or 2, mediump = 16-bit half), Android Chrome (Adreno/Mali, mediump = 16-bit), an RK3588
(Mali-G610, Chromium, pixel ratio 1), a Raspberry Pi 4 (VideoCore VI, Chromium) and any desktop. On the Mac the demo runs all of it at
60 fps at 1536 × 1152 (pixel ratio 1.5). The 16-bit cases could not be run here; they are designed for, not measured, see "mediump".

## sky() — the field when there is no camera

One full-screen quad, one draw call, no texture. Returns `{vertexShader, fragmentShader, uniforms, …}`; index.html already mounts it
on the camera with `depthTest: false, transparent: true` — the vertex shader puts the quad in clip space, so where it hangs does not
matter. The corner view rays come from `projectionMatrix` and `viewMatrix` inside the vertex shader, so the stars turn with the
head, the drag and the rig, and an off-axis (XR) projection is read too. Hide it in XR and with the camera, as index.html does.

What it draws: 377 = F(14) stars on the Fibonacci sphere, z_k = 1 − (2k + 1)/377, θ_k = 2πφk; the field's dark phosphor green with
the cycle's band at the horizon, SEED's gold at the floor's centre, a pale ∞ at the zenith; the twelve spokes at the floor's own
azimuths (x = sin, z = −cos, as `ar.js` places the cells); a breathing of period 13 s (F(7), the tape's offset); a drift of one turn
in forty minutes. The first-dark-ring radius of the Airy disc is not used here; the stars are a sharp core plus a Lorentzian glow.

Cost per fragment, 23 samples: ~1500 scalar ops (23 × ~65: a hash, the golden fraction, a wrapped azimuth distance, one exp, one sin
on a wrapped phase) + one atan, two sqrt, four exp, one cos. Draw calls 1, texture fetches 0.
- phones at ≤ 0.75 Mpx: fine (60 fps on an A15-class GPU with headroom);
- RK3588 at 1080p (2 Mpx): ~3 G ops a frame, about the Mali-G610's 60 fps budget; use `FOLD_FX.sky({samples: 13})` (half the loop,
  stars reach 1.8° instead of 3.3°, still every star drawn) — it looks the same;
- Pi 4 at 1080p: too much for 60 fps with the loop; `sky({samples: 0})` leaves the stars out and the loop with them (the field,
  band, spokes and breathing stay, ~60 ops a fragment), or render the sky at a quarter of the pixels (a 1/2-size render target blitted
  up: one extra draw call; not built here).
Tune: `uniforms.stars` (star brightness), `rays` (spokes), `breath` (0..1, depth of the 13 s breathing), `drift` (turns/s);
`sky({stars: N})` for another lattice (N < 2048 keeps every index exact in mediump); in the GLSL the core width `exp(-q * 24000.0)`
(≈ 0.4° radius) and the star magnitudes `0.3 + 0.7 h²`. `time` is seconds, unbounded: the shader wraps it in highp before use.

## halo() — `float airy(float r)` for the cells

A GLSL string to splice above `main()` of the cell fragment shader. `airy(0) = 1`, the first dark ring at `r = 1`, the second at
`r = 1.831`, the third at `r = 2.655` (ρ = 3.8317 r). Also `airyGlow(r, lift) = airy(r)^lift` so the rings show on a screen (the true
bright rings are 1.75 % and 0.42 % of the centre; lift 0.45 puts them at 16 % and 8 %).

Inside the first ring it is the machine's six-term Horner series for J₁(x)/x, rewritten in u = ρ²/16: 0.5 − u + 2u²/3 − 2u³/9 +
2u⁴/45 − 8u⁵/1350. That is the same polynomial (each coefficient times 16ⁿ), but the given coefficients −5.65141e-9 and 6.78168e-7 lie
below a 16-bit float's smallest normal 6.1e-5 and would flush to zero on a phone; the rescaled ones do not. The series as given is
exact to the first dark ring and leaves the truth past ρ ≈ 4.5: it reads 0.021 for the first bright ring's 0.0175, 0.047 at ρ = 6,
0.60 at the second dark ring 7.0156 and 3030 at the third. So it cannot carry a halo to the second ring, and beyond ρ = 3.4 the
function switches (a smoothstep over 2.8 … 3.6) to the asymptotic form (8/πρ³)·cos²(ρ − 3π/4 + 3/(8ρ)), which puts the dark rings at
3.829, 7.015, 10.173 (true 3.8317, 7.0156, 10.1735), the bright rings at 1.73 % and 0.41 %, and is within 6 × 10⁻⁴ of the exact
pattern for every r from 0 to 4 (checked in double precision against the full series; `FOLD_FX.airy` is the same function in JS,
plotted in the demo). In half precision the series part cancels to ~4 × 10⁻³ at worst and the far part holds its rings to 0.2 %.

Cost: ~30 scalar ops + one cos + one division (+ one pow for airyGlow), per fragment of a cell quad; no texture, no extra draw call.
Splice: in `billboards()` of ar.js replace `float h = exp(-d * d * 4.0) * (…)` by `float h = airyGlow(d * 2.655, 0.45) * (…)` to put
the third dark ring on the quad's edge (the first under the number, at 38 % of the half-size), or `airyGlow(d * 1.9, 0.45)` to put the
first ring just outside the number and the second on the edge; the `a < 0.03` discard then trims the outer tail. With `airy()` alone
the rings are invisible at a cell's size.

## crt() — the phosphor overlay, drawn last

One transparent full-screen quad, one draw call, no texture, nothing re-rendered; it replaces the page's `#crt` div (scanlines
`repeating-linear-gradient` + radial vignette): mount it with `FOLD_FX.quad(THREE, spec)` (renderOrder 1000, depthTest off) and hide
the div. `FOLD_FX.resize(spec.uniforms, renderer)` on every resize gives it the drawing buffer's size; `FOLD_FX.pulse(spec.uniforms,
[r, g, b])` on each move sets `pulse` to 1 and brings it down by the phosphor's own law F(T) = cos(πT)·exp(−0.5T) over 600 ms (the
div's `crtPulse()` did a 180 ms opacity step). `tint` is the glow's colour; pass the move's hue (`hsl(o.hue …)` as rgb) or leave the
phosphor green.

What it draws: scanlines of `pitch` device pixels (default 2 × pixel ratio = 3 px at 1.5), their rows bowed with the tube: the pixel at
c shows the flat raster's point p = c(1 + 0.0234 |c|²), the barrel r/(1 + 0.0234 r²) run backwards; the raster's edge as a superellipse
of p, rounded by `corner`, outside it `mask` darkness (0.85: the room still shows faintly at the corners), along it the `glow` band of
phosphor; the vignette as the machine's 1 − 0.4 r² turned into darkening toward the corners; the pulse brightens the phosphor, deepens
the lines by 60 % and sweeps a retrace band from top to bottom. The scanline phase is the one place that needs highp: at 2500 rows a
16-bit float cannot tell rows apart (resolution 2 px), so `gl_FragCoord.y` plus the bow is taken `HP`.

Cost per fragment: ~45 scalar ops incl. two pow (the superellipse), one cos, one exp, three smoothsteps. At 1080p ≈ 0.1 G ops a frame:
nothing on any target. Tune: `scan` (0.20 darkness at a line's centre; the div was ~0.10 over a third of the rows), `pitch`,
`vignette` (0.55), `glow` (0.10), `corner` (0.35), `mask` (0.85), `barrel` (0.0234 — the look is subtle at 2.34 %, the corners move
4.7 % in; 0.06 shows a tube plainly). The flash strength is `pulse()`'s third argument.

## cssFilter(opId) / cssReset / cssApply — the room

No GPU cost of ours: the compositor does it. Returns `{filter, transform}` with `toString()` giving a cssText; index.html's
`roomFx` reads the object. Every string keeps the page's base filter `saturate(.75) brightness(.8)`. g: hue-rotate +1.40625° (one tick
of the cycle, 360/256) and the picture turned by the same, scale 1.03 hiding the edge · ig: the same back · fold: `scaleX(-1)` · inv:
`scaleY(-1)` · i: `rotate(90deg) scale(cover)`, cover = max(aspect, 1/aspect) so a cover-fit portrait video still fills the screen ·
gam: `invert(1) hue-rotate(180deg)` (lightness inverted, hues kept — the reflection) with scale 1.06. `cssApply(video, id, ms)` sets a
transition on the element once, applies, and resets after `ms`. The `i` move's rotation is the one that costs the compositor anything
(a full-screen rotated layer); on a Pi expect a dropped frame at the start of the transition.

## gammaWarp() / warp() / grab() / warpRun() — Γ on the screen

`gammaWarp()` is a GLSL string: `vec2 moebius(vec2 p, float t)` takes a screen uv, z = 2p − 1, w = (z − a)/(z + a) with a = 0.47
(120/257 scaled to the unit screen), written as ((|z|² − a²) + 2a·y·i)/|z + a|², and returns mix(z, w, t)/2 + ½: identity at t = 0,
the full map at 1. `moebiusA(p, t, aspect)` does it in aspect-true units so circles stay circles. Γ's zero is at (0.735, 0.5) of the
screen, its pole at (0.265, 0.5), where the map runs to infinity: whatever samples by the warped uv must clamp (the overlay does),
and that spot smears at large t — run t to 0.3 … 0.45 and back, not to 1.

`warp()` is the overlay, one transparent full-screen quad drawn after the scene (renderOrder 999). Two modes by `useMap`:
- 0 (default, no texture): it draws Γ's own circles in the blended frame — |w| constant, the Apollonian circles about ±a, and arg w in
  twelfths, the twelve rays, through them — as rings and spokes in `tint` with alpha ∝ t; at t = 0 they are circles about the centre.
  ~45 ops, one log2, one atan, two exp; no fetch.
- 1: it samples `map` by the warped uv, alpha = t × 0.9 × the frame's own alpha: the previous frame's field, reflected, as a ghost.
  One texture fetch a fragment. `FOLD_FX.grab(THREE, renderer, uniforms)` fills `map` with the drawing buffer by one
  `copyFramebufferToTexture` (a DataTexture of the buffer's size, Linear, no mipmaps, remade on resize): on a phone at 1.5× it is a
  1–3 ms copy, on an RK3588 at 1080p ~2 ms, on a Pi 4 a frame's worth — optional, and the circles look better anyway. Order, as the demo
  does it: render the scene, `grab`, then `renderer.autoClear = false; renderer.render(warpScene, camera)`; the warp quad must be in a
  scene of its own (or made visible after the grab), since one `render()` cannot copy the buffer between two of its meshes.
`warpRun(uniforms, peak = 0.35, ms = 900)` raises t to the peak over the first third and lets the persistence law bring it down.

## mediump, and what was checked

Every fragment is written for a 16-bit float: no fract of a product past 2048, no coefficient below 6 × 10⁻⁵, no sin or cos of an
unwrapped clock or raster coordinate; the golden fraction fract(kφ) is built from k's base-8/64 digits (a 16-bit float holds
fract(233 × 0.618…) to a tenth of a turn only; split, to 1/512), the hash from k's two 4-bit halves, every per-star phase and the drift
wrapped in highp before they are sined. The Mac runs mediump at 23 bits, so the 16-bit arithmetic itself is reasoned, not measured;
the demo's report line prints the device's mediump bits, so a phone or an RK3588 shows its own.

Checked in the demo on the Mac (Apple M2, ANGLE Metal, three r128): every shader compiles on WebGL2 and on WebGL1 (`?gl1`) with no
error or warning from three.js, for the sky at 23, 13 and 0 samples, the 49 halo quads, the CRT and the warp; the stars turn with
the drag; CRT on, pulse, warp with and without the grab, the six CSS moves and the reset all seen; 60 fps throughout at 1536 × 1152,
48 fps during a CSS transition (the compositor). `demo.html` also plots airy(r) with its three rings.
