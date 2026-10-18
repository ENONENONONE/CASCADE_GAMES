# THE FOLD · glow — notes

`glow.js` defines `window.FOLD_GLOW`: the "ray-traced" look as one post pass — bloom, god rays, glitter and a grade — over the scene
drawn at half resolution; `demo.html` shows it over the shader demo's sky, halos, rain and floor (open it over http; `?gl1` forces
WebGL1) with the passes' knobs on buttons; `node parts/glow/check.js` checks the numbers below against the code (a node check, kept out
of sw.js SHELL). All GLSL is ES 1.00 for three.js r128 and compiles on WebGL1 and WebGL2 (the demo's report line says so, from
three.js's own compile): `precision mediump float` first in every fragment, `HP` (highp where the fragment stage has it, fx.js's macro)
on the two clocks and on the composite's uv alone, loops of 9 and 24 on int constants, no derivative, no lod, no float texture needed.
Written for the same targets as fx.js: phones at 1.5× pixel ratio, an RK3588 at 1080p, a Pi 4, desktops; measured here in SwiftShader.

## What it does, in order

1. **The scene into a half-res target.** `G.begin()` aims the renderer at a WebGLRenderTarget of `scale` (0.5) × the drawing buffer:
   640 × 400 for 1280 × 800, RGBA bytes with a depth buffer (the scene is LDR, and bytes are half the bandwidth of half floats). The
   page's `A.frame()` renders as before and clears it (transparent black, the renderer's own clear). three r128 sizes a `Points` from the
   canvas's height, not the target's, so the relief's dots would draw 2× too big: `mount({scene})` halves every Points material's `size`
   for this draw and puts it back after. The Γ warp stays in the scene (its circles bloom); the CRT does not (index.html moved its quad
   to a scene of its own, `over`, drawn after the composite, so the scanlines are never bloomed).
2. **The bright pass, at a quarter of the screen** (320 × 200): one bilinear fetch of the half-res scene (so a 4 × 4 block of screen
   pixels), the light above a soft knee, `smoothstep(0.18, 0.38, max channel) × colour`, so each source keeps its own colour and nothing
   is tinted: a cell blooms in its ray, the rain's trail in phosphor green, the ring and the quarter turns in gold, the floor's spokes in
   the rays' colours. Under the knee: the sky's field, 0.085·green, max channel 0.070. Through it: the photon ring, gold × airyGlow ×
   `LENS_GAIN` = 0.317 (at 0.70), a cell's core 0.55 (whole), a drop head, a glyph. Its alpha is the **glitter**: on the brightest points
   (smoothstep(0.45, 0.75) of the same max channel: the current cell's core, drop heads, the target's gold, a lone glyph; a plain cell's
   0.55 core at 0.3) one sparkle a 4 × 4 block (16 × 16 screen px), its period 1.5, 2, 2.5 or 3 s and its phase by a hash of the block
   (mediump-safe: every product under 2048 before its fract), a sine that never goes out (0.55 ± 0.45 → 0.1 … 1) and a brightness
   0.6 … 1 by a second hash. The glitter's clock is the pass's own, wrapped at 30 s, which every period divides, so the wrap never pops.
3. **The blur, two passes at a quarter.** 9 taps 1.5 texels apart (σ 2.3 taps: the glow reaches ~24 screen px), the gaussian weights
   computed in the loop (ES 1.00 has no array initialisers). The sparkle rides the alpha channel: the H pass streaks it ±2 taps (±3
   texels, ±12 screen px, tapering) along the row, the V pass takes the bright pass's own alpha along the column for the same ±2 taps
   (five fetches more, folded at compile time) and keeps the brighter of that and the H streak at the centre — a star cross from two
   lines. 9 fetches, then 9 + 5.
4. **The shafts, at a quarter.** A radial blur of the *bright pass* (not the blur) toward each light: 24 samples along the line to it,
   0.92 of the way, the weights falling by 0.955 a step, the sum normalised. Two lights, each a uniform branch: **the eye** (cell 137)
   at its screen place from `A.onScreen(137)` (the same lensed projection the taps use) while the ring shows (well.js's `a` and `e` above
   0), in gold (the shaft mixed 70 % toward 1.4·gold), and **SEED at the floor's centre** when it is on the screen, tinted by the spoke
   the pixel lies along: the twelve spokes' screen directions (index.html projects the twelve floor points each frame, aspect-true) and
   their colours (`AR.RAY_RGB`), a pow(dot, 16) blend, gold between them. Each light fades out as it leaves the screen (1 inside, 0 past
   1.4 of it), so a light just off the edge never smears the edge. The drift: the shafts' brightness round each light is 0.95 + 0.3·sin(6φ
   + t) + 0.25·sin(13φ − 0.7t), t one turn in 30 s — 0.4 … 1.5, a slow breathing of lobes, never a flicker; under CALM the clock stands,
   so it is a still. Over the camera `rayK` drops from 0.9 to 0.3: the room stays visible.
5. **The composite, at the screen's size.** The half-res scene up, sharpened by an unsharp mask on one diagonal pair of texels (c +
   0.5·(c − mean of the pair)); the **split**: red sampled toward the edge and blue away from it by up to `ca` = 1.5 px, the offset
   0.6·(the pixel's distance² from the centre, 1 at the sides' middles) + 1.2·the bloom's luminance (the brightest edges), faded in from
   0.15 px so the centre has none; the **grade**: saturation ×1.2 about the pixel's own luminance, capped where a channel would leave
   0 … 1 (a pure ray or a move's hue at 70 % is lifted as far as it can go and no further, so no hue ever turns — the check measures the
   palette: hue within 1°, chroma ×1.15 … ×1.25 wherever there is room), then the lift crushed by 0.015 and rescaled (black stays black;
   the sky's field is deepened, 0.0060 → 0.0045 of relative luminance, not lost); no vignette (crt() has one). Then the light added:
   the bloom × 0.55 / (1 + 1.5·its luminance) — a knee, so a crowd of sources (the relief's floor of a thousand dots) blooms less than a
   lone one; the shafts × 0.9; the glitter × 0.6 in white mixed 40 % toward the bloom's own hue. The output is premultiplied as the scene
   was, the alpha grown by 1.5 × the light's luminance, so over the camera the light is added to the room. `mixK` is the toggle's ramp.

`mount(THREE, renderer, {tier, scale, FX, scene})` → `G` with `begin()`, `end(state)`, `setTier()`, `resize()`, `dispose()`, `u` (the
composite's uniforms, for tuning), `rays`, `bright`, `rt`, `hdr`, `tier`, `want`, `level`, `clock`. `state` for `end`: `{eye: [u, v],
eyeA, floor: [u, v], floorA, spokes (24 floats), spokeCol (36), room, calm}`; index.html's `glowState()` fills it after `A.frame()`,
from the camera as it was drawn. The targets are remade when the drawing buffer's size changes (checked each `begin()`).

## Tiers, the toggle, CALM

- `FOLD_GLOW.tierFor(pref, {tiny, lowEnd})`: `fold.prefs` {glow: 'on' | 'off' | 'auto'}. `auto` (unset) is `full` on desktops, unflagged
  phones and the RK3588; `bloom` on `lowEnd` (Mali, PowerVR, Adreno 3–5xx, ≤ 4 cores, Raspbian); `off` on `tiny` (VideoCore, V3D,
  llvmpipe, SwiftShader). `on` is the full pass anywhere (the headless play-through forces it so); `off` is off.
- `bloom`: the scene at half res, the bright pass without the glitter, the blur, the composite without the shafts and the split; the
  grade and the sharpening stay. Four passes.
- `off`: no target; `A.frame()` draws to the screen as before, the CRT after it. In XR the compositor owns the frame: index.html
  skips `begin`/`end` and the CRT while presenting, whatever the tier.
- The GLOW aux button (the fourth row of #ops, beside RAYS) or **b** toggles it: off ↔ the device's `auto` tier, or `on` where that
  tier is off; kept in `fold.prefs.glow`. On, `mixK` ramps 0 → 1 over 600 ms (smoothstep); off ramps down and the pass stops at 0;
  under CALM a step. The change is under the flash gate's threshold: measured in SwiftShader, the pass raises the frame's mean coded
  luminance from 0.080 to 0.112 (level 3 over the relief; 0.03, and smaller elsewhere) against the gate's 0.1 of relative luminance, so
  `strobe()` is not asked (a sub-threshold change always passes and is not counted).
- CALM (fx.js `calm()`, the page's `calm`): the pass's clock stands still, so the shafts' drift and the glitter's twinkle are stills;
  nothing else of the pass moves on its own. The whole pass's change of luminance a frame is otherwise the scene's own (which the gate
  already governs) plus the twinkle's: at most 2π·0.45/1.5 of a sparkle's light a second, 0.063 of it a frame at 30 fps, × 0.6 of
  white × the sparkles' share of the screen — under 0.038 even were the whole screen one sparkle twinkling in step (the check), against
  the gate's 0.1; in the headless run a still frame changed by 0.0003 a frame. The shafts' drift moves 1/30 of a turn a second.

## Cost

By construction, at 1280 × 800 (1.024 Mpx), `full`:

| pass | pixels | fetches each | fetches | ~ops each | ops |
| --- | --- | --- | --- | --- | --- |
| bright + glitter | 64,000 | 1 | 0.06 M | 45 | 2.9 M |
| blur H | 64,000 | 9 | 0.58 M | 72 | 4.6 M |
| blur V + cross | 64,000 | 9 + 5 | 0.90 M | 92 | 5.9 M |
| shafts, two lights | 64,000 | 24 + 24 | 3.07 M | 472 | 30 M |
| composite | 1,024,000 | 3 + 2 + 1 + 1 | 7.17 M | 75 | 77 M |
| **all** | | | **11.8 M** | | **120 M** |

A mid phone's GPU (an Adreno 6xx, a Mali-G5x) does ~4 G bilinear fetches and ~50 G scalar ops a second: 2.9 + 2.4 ms, five target
switches ~0.5 ms, **~5.8 ms** (`FOLD_GLOW.budget(w, h, tier)` does this sum; the check holds it under 6). `bloom`: 4.9 M fetches, ~3.1
ms. Against it, the scene at half res is drawn on a quarter of the pixels: the sky alone (~1500 ops a fragment at 23 samples) saves
1.15 G ops a frame at this size, the cells, the rain and the relief three quarters of their fragments too, so on a phone the frame as a
whole should come out ahead. At 1.5× pixel ratio on a 390 × 844 phone (585 × 1266 = 0.74 Mpx) the pass is ~4.2 ms.

Measured (headless Chromium, SwiftShader, 1280 × 800, `frame3d()` timed with a 1-pixel readPixels, 60 frames, the median, on a shared
4-core machine; SwiftShader runs every fragment on the CPU, so it rewards the half-res scene and charges the composite):

| | glow on | glow off | the pass |
| --- | --- | --- | --- |
| level 1 (rain full, the relief's floor) | 93.4 / 92.2 ms | 73.7 / 76.0 ms | +18 ms |
| level 56 facing the eye (the ring lit, both lights) | 105.2 / 105.8 ms | 70.4 / 68.6 ms | +36 ms |
| the same under prefers-reduced-motion | 94.0 / 107 ms | 80.2 / 73.6 ms | |

(two runs each; the prefs forced rain, lens and glow full). SwiftShader charges ~3 ns a bilinear fetch and runs the composite's 1 Mpx on
the CPU, so the pass costs it 18–36 ms while the half-res scene gives back only 5–10 (its sky is 0 samples on `tiny`, which is why
`auto` leaves SwiftShader and the Pi off and the headless run has to force `on`); the arithmetic above is what a GPU sees. The frame as
a whole stayed under the 110 ms the earlier parts measured for the full rain on this machine.

Draw calls: the scene's own + 5 (the four quarter passes and the composite) + 1 (the CRT in `over`).

## Checked

`node parts/glow/check.js`: the GLSL's rules (above), the tap and sample counts, the tiers, the twinkle's periods and the gate margin,
the clock under CALM and its wrap (a mock renderer, the real three.js: the targets' sizes and types, the Points halved and put back, the
ramp's timing, the resize, the room's faint shafts), the grade on the palette (green, gold, the current, target, home and gold cells,
the twelve rays, the seven moves' hues, the trail and the field), the knee against the field, the ring and a core, the split's bound,
the budget, and index.html's wiring. `demo.html` on WebGL2 and `?gl1` under SwiftShader: every pass compiles with no error or warning
from three.js, with half-float quarter targets (`EXT_color_buffer_float` / `EXT_color_buffer_half_float`); the fallback to bytes is
taken where the extension or a complete framebuffer is missing (the check's mock takes it). The headless play-through (DAILY, the six
moves, HINT, UNDO, level 33, level 56 facing the eye, the TUBE open and closed, a SYNC level lost → the bardo → REBIRTH, chapter 1
closed to its ledger, GLOW off and on, the day ended; once under prefers-reduced-motion) ran with no page error and no console error.
Not measured: a phone, an RK3588, a Pi 4 — the tiers are reasoned from the arithmetic above, as fx.js's are.
