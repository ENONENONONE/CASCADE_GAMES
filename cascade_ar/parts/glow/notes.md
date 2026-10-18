# THE FOLD · glow — notes

`glow.js` defines `window.FOLD_GLOW`: the "ray-traced" look as one post pass — bloom, god rays, glitter and a grade — over the scene
drawn at the screen's own resolution (the light alone at a quarter of it; half res for the scene on the lowEnd bloom tier alone), its
third light the field's own ray tracer's (parts/trace); `demo.html` shows it over the shader demo's sky, halos, rain and floor (open it
over http; `?gl1` forces WebGL1) with the passes' knobs on buttons; `node parts/glow/check.js` checks the numbers below against the code (a node check, kept out
of sw.js SHELL). All GLSL is ES 1.00 for three.js r128 and compiles on WebGL1 and WebGL2 (the demo's report line says so, from
three.js's own compile): `precision mediump float` first in every fragment, `HP` (highp where the fragment stage has it, fx.js's macro)
on the two clocks and on the composite's uv alone, loops of 9 and 16 on int constants, no derivative, no lod, no float texture needed.
Written for the same targets as fx.js: phones at 1.5× pixel ratio, an RK3588 at 1080p, a Pi 4, desktops; measured here in SwiftShader.

## What it does, in order

1. **The scene into a target at the screen's size.** `G.begin()` aims the renderer at a WebGLRenderTarget of `scale` × the drawing
   buffer — `scale` is 1 on the full tier, so 1280 × 800 for 1280 × 800, a texel a device pixel: the cells, their lines and the rain's
   glyphs reach the composite exactly as drawn, with no upsampling to soften or block them — RGBA bytes with a depth buffer (the scene
   is LDR, and bytes are half the bandwidth of half floats). The page's `A.frame()` renders as before and clears it (transparent black,
   the renderer's own clear). On the `bloom` tier (lowEnd) `scale` is 0.5 — 640 × 400 — where drawing the sky's 13 samples on a quarter
   of the pixels is the saving that matters; there three r128's `Points`, sized from the canvas's height, not the target's, would draw
   2× too big, so `mount({scene})` halves every Points material's `size` for the draw and puts it back after (at scale 1 nothing is
   touched). `mount({scale})` fixes a scale whatever the tier; unset, `setTier` takes the tier's own. The Γ warp stays in the scene (its
   circles bloom); the CRT does not (index.html moved its quad to a scene of its own, `over`, drawn after the composite, so the
   scanlines are never bloomed).
2. **The bright pass, at a quarter of the screen** (320 × 200, whatever the scale): a quarter-res texel covers 4 × 4 screen pixels, and
   one bilinear fetch at its centre would read the middle 2 × 2 and miss the rest — a 1-px glyph stroke would bloom or not by where it
   fell — so four fetches at ±`qx` (a quarter of the texel: one scene texel at scale 1, half of one at 0.5, where the four land on the
   2 × 2 exactly), each bilinear over 2 × 2, box the whole block; then the light above a soft knee, `smoothstep(0.18, 0.38, max
   channel) × colour`, so each source keeps its own colour and nothing is tinted: a cell blooms in its ray, the rain's trail in phosphor
   green, the ring and the quarter turns in gold, the floor's spokes in the rays' colours. The knee reads the block's mean: a lone
   1-px line at 1.0 comes in at 0.25 and barely blooms, a 2-px stroke at 0.5 does, a cell's core whole — the bloom is of the sources'
   bodies, not of every edge. Under the knee: the sky's field, 0.085·green, max channel 0.070. Through it: the photon ring, gold × airyGlow ×
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
4. **The shafts, at a quarter.** A radial blur of the *bright pass* (not the blur) toward each light: 16 samples along the line to it,
   0.92 of the way, the weights falling by 0.955 a step, the sum normalised. Three lights, each a uniform branch: **the eye** (cell 137)
   at its screen place from `A.onScreen(137)` (the same lensed projection the taps use) while the ring shows (well.js's `a` and `e` above
   0), in gold (the shaft mixed 70 % toward 1.4·gold); **SEED at the floor's centre** when it is on the screen, tinted by the spoke
   the pixel lies along: the twelve spokes' screen directions (index.html projects the twelve floor points each frame, aspect-true) and
   their colours (`AR.RAY_RGB`), a pow(dot, 16) blend, gold between them; and **the field's own light**, from parts/trace: after every
   move and at a level's opening the tracer sends 256 rays from the player's cell through the chapter's sheets, and `lightAt` reads back
   the brightest direction as a cell (`cell`, the direction's w = x + 16y), the energy-weighted colour of all that arrives (`rgb`, unit)
   and the energy (Σ of the light over the 256 directions). index.html projects that cell each frame as it does the eye
   (`A.onScreen(cell)`), the shaft is tinted by `rgb` as the eye's is by gold (mixed 70 % toward 1.4·rgb), and its strength is
   `traceStrength(energy)` = energy / `K.traceRef` clamped to 0 … 1: over every cell, sheet and target of the tracer's default scene the
   energy runs 265 … 780 (median 545, p90 581, 3096 renders), so traceRef = 640 lights a typical cell's shaft at ~0.85 and the brightest
   at 1; the eye at ∞ (no rays) gives 0. Each light fades out as it leaves the screen (1 inside, 0 past 1.4 of it), so a light just off
   the edge never smears the edge — the field's light is often off it, since its cell lies wherever the field says, and then there is no
   third shaft. The drift: the shafts' brightness round each light is 0.95 + 0.3·sin(6φ + t) + 0.25·sin(13φ − 0.7t), t one turn in 30 s
   — 0.4 … 1.5, a slow breathing of lobes, never a flicker; under CALM the clock stands, so it is a still. Over the camera `rayK` drops
   from 0.9 to 0.3: the room stays visible.
   **The third light's easing** (`end()`'s `easeTrace`): the tracer's answer comes with a key (the cell, the level, the target, the sheet
   and the tile's law); a new key freezes what is shown (place, strength, colour) as `from` and the light eases to the live target over
   the toggle's 600 ms by smoothstep — the target place is projected anew each frame, so the shaft follows the camera meanwhile; from
   nothing it fades in at its own place (never a glide in from the corner); gone (the cell off the screen, ∞, the tile's part missing) it
   fades out where it stood; under CALM the mix is a step. So a move never flashes the shaft: at 30 fps the strength moves at most
   0.05 of a frame's worth of 0.9·shaft light, under the gate's 0.1 as the toggle's own ramp is.
5. **The composite, at the screen's size.** The scene read once, a texel a pixel at scale 1 — no unsharp mask: there is nothing to
   put back, and a mask over a scene already at the screen's size only exaggerates every pixel edge (the look the owner called
   pixelated). The mask (c + 0.25·(c − the mean of a diagonal pair of texels)) is compiled in (`#define SHARP 1`) at a scale under 1
   alone, the bloom tier's half-res scene, where an upsampled picture has edges to give back. Every target is `LinearFilter` both ways
   and unmipmapped, so the quarter-res bloom and shafts come up to the screen bilinear — blurred pictures magnified 4× smoothly, no
   block. The **split**: red sampled toward the edge and blue away from it by at most `ca` = 1 px, the offset `ca`·smoothstep(0.5, 1,
   4·|uv − ½|²) — nothing inside 0.71 of the way from the centre to a side's middle (the HUD's text, the current cell and the ring
   stand there untouched), the full pixel from the sides' middles out to the corners, and never keyed to brightness, so no glyph, cell
   or line splits by being bright; a pixel of split at the frame's rim reads as the tube's own fringe, not as a smeared picture; the
   **grade**: saturation ×1.2 about the pixel's own luminance, capped where a channel would leave
   0 … 1 (a pure ray or a move's hue at 70 % is lifted as far as it can go and no further, so no hue ever turns — the check measures the
   palette: hue within 1°, chroma ×1.15 … ×1.25 wherever there is room), then the lift crushed by 0.015 and rescaled (black stays black;
   the sky's field is deepened, 0.0060 → 0.0045 of relative luminance, not lost); no vignette (crt() has one). Then the light added:
   the bloom × 0.55 / (1 + 1.5·its luminance) — a knee, so a crowd of sources (the relief's floor of a thousand dots) blooms less than a
   lone one; the shafts × 0.9; the glitter × 0.6 in white mixed 40 % toward the bloom's own hue. The output is premultiplied as the scene
   was, the alpha grown by 1.5 × the light's luminance, so over the camera the light is added to the room. `mixK` is the toggle's ramp.

`mount(THREE, renderer, {tier, scale, FX, scene})` → `G` with `begin()`, `end(state)`, `setTier()`, `resize()`, `dispose()`, `u` (the
composite's uniforms, for tuning), `rays`, `bright`, `rt`, `hdr`, `tier`, `want`, `scale`, `level`, `clock`, `trace` (the third light as eased:
`key`, `from`, `to`, `cur` [u, v, strength, r, g, b], `x` the ramp). `state` for `end`: `{eye: [u, v], eyeA, floor: [u, v], floorA,
spokes (24 floats), spokeCol (36), trace: {pos: [u, v], a, rgb: [r, g, b], key} | null, room, calm}`; index.html's `glowState()` fills it
after `A.frame()`, from the camera as it was drawn. `FOLD_GLOW.traceStrength(energy)` is the third light's strength. The targets are
remade when the drawing buffer's size changes (checked each `begin()`).

## Tiers, the toggle, CALM

- `FOLD_GLOW.tierFor(pref, {tiny, lowEnd})`: `fold.prefs` {glow: 'on' | 'off' | 'auto'}. `auto` (unset) is `full` on desktops, unflagged
  phones and the RK3588; `bloom` on `lowEnd` (Mali, PowerVR, Adreno 3–5xx, ≤ 4 cores, Raspbian); `off` on `tiny` (VideoCore, V3D,
  llvmpipe, SwiftShader). `on` is the full pass anywhere (the headless play-through forces it so); `off` is off.
- `bloom`: the scene at half res (`scale` 0.5, `FOLD_GLOW.scaleFor('bloom')`), the bright pass without the glitter, the blur, the
  composite without the shafts and the split; the grade stays, and here alone the sharpening (the mask over the half-res scene). Four
  passes.
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

By construction, at 1280 × 800 (1.024 Mpx), `full` at scale 1:

| pass | pixels | fetches each | fetches | ~ops each | ops |
| --- | --- | --- | --- | --- | --- |
| bright + glitter (the 4-tap box) | 64,000 | 4 | 0.26 M | 48 | 3.1 M |
| blur H | 64,000 | 9 | 0.58 M | 72 | 4.6 M |
| blur V + cross | 64,000 | 9 + 5 | 0.90 M | 92 | 5.9 M |
| shafts, three lights | 64,000 | 16 + 16 + 16 | 3.07 M | 472 | 30 M |
| composite | 1,024,000 | 1 + 2 + 1 + 1 | 5.12 M | 65 | 67 M |
| **all** | | | **9.9 M** | | **110 M** |

A mid phone's GPU (an Adreno 6xx, a Mali-G5x) does ~4 G bilinear fetches and ~50 G scalar ops a second: 2.5 + 2.2 ms, five target
switches ~0.5 ms, **~5.19 ms** (`FOLD_GLOW.budget(w, h, tier, scale)` does this sum; the check holds it under 6). What changed from
the half-res scene (11.8 M fetches, 120 M ops, 5.85 ms): the composite reads the scene once, plus the split's two, instead of three plus
two — the unsharp mask's pair of fetches is gone (2.05 M fewer), and with it ~10 ops a pixel; the bright pass boxes four fetches where
it took one (0.19 M more, at a quarter). Each of the composite's scene fetches now reads a target of 4.1 MB (1280 × 800 × 4 B) instead
of 1 MB, a texel a pixel with no neighbour sharing the texel, so the scene target's traffic a frame is 4.1 MB written and 3 reads at
the screen's size plus the bright pass's one over the whole (`budget().sceneBytes`: 20.5 MB, against 7.2 with the same pass over a
half-res scene) — on a phone's ~10 GB/s that is ~2 ms of memory traffic the fetch count above already prices at ~2.3 ms, so the 5.19
stands as the pass's cost. What the pass no longer gives back is the scene's own draw: at half res the sky alone (~1500 ops a
fragment at 23 samples) saved 1.15 G ops a frame at this size and the cells, the rain and the relief three quarters of their
fragments, and GLOW on was cheaper than GLOW off; at scale 1 the scene costs what it costs with GLOW off (`budget().skyOps` is 0),
and the pass is purely added: **~5.2 ms a frame at 1280 × 800** on the mid phone above, ~3.9 ms at 1.5× pixel ratio on a 390 × 844
phone (585 × 1266 = 0.74 Mpx). That is the price of the crisp picture, and it is under the 6 by construction with the taps and the
samples as they were: 9 taps, 16 samples a light (24 a light would fit now too, at 5.79 ms, 32 would not, at 6.39; the check asserts
16 under, 32 over; 16 is kept — the fetches it would spend go to the scene's own full-res draw instead). A sample is 0.92/16 of the
way to the light; for a light half a screen away that is 9 quarter-texels, 37 screen px — a coarse radial blur of a sharp small
source, which the bloom's 24 px glow over the same source hides. The tracer's own cost is the CPU's, once a move, not the pass's: see
parts/trace/notes.md. `bloom` at its 0.5: 5.8 M fetches, ~3.0 ms, and there the half-res scene still saves the sky's 1.15 G ops (13
samples on lowEnd: ~0.65 G) — the one tier where the saving matters, so it keeps the scale.

Measured (headless Chromium, SwiftShader, 1280 × 800, `frame3d()` timed with a 1-pixel readPixels, 60 frames, the median, on a shared
4-core machine; SwiftShader runs every fragment on the CPU, so it charges the composite's 1 Mpx and, now, the full-res scene too):

| | glow on | glow off | the pass |
| --- | --- | --- | --- |
| level 1 (rain full, the relief's floor, the tile on) | 122.5 ms (p90 140; on again 120.6) | 71.5 ms (p90 79) | +51 ms |
| level 56 facing the eye (the ring lit, three lights) | 126.0 ms (p90 145; on again 124.8) | 68.5 ms (p90 82) | +57 ms |
| the same two under prefers-reduced-motion | 122.9 / 125.1 ms | 71.6 / 67.0 ms | +51 / +58 ms |

(the prefs forced rain, lens and glow full, TRACE on; GLOW off and on again by the b key between the runs). Before this change, over
the half-res scene, the same method gave 93 / 74 ms at level 1 and 105 / 70 at level 56: the pass cost SwiftShader 18–36 ms then and
costs it ~51–58 now, the difference being the half-res scene it no longer gets — SwiftShader runs the sky's 23 samples, the lensed
rain and the relief on the CPU for every one of the 1.024 M pixels of the scene target where it ran them for 256 k, and the composite
reads a 4 MB target. On a GPU the same change is the ~5.2 ms of the arithmetic above (the pass) plus nothing (the scene costs what it
costs with GLOW off); SwiftShader charges ~3 ns a bilinear fetch and ~1 ns an op and has no parallel fragment hardware, so its ratio
says nothing of a phone's (its sky is 0 samples on `tiny`, which is why `auto` leaves SwiftShader and the Pi off and the headless run
has to force `on`). The frame as a whole, ~123 ms in SwiftShader with GLOW on, is a headless check of correctness, not of speed. The
tracer's render + `lightAt`, once a move: 1.2–2.7 ms (8.3 the first time, JIT cold), the tile's `set` 1.5–3.1 ms.

Draw calls: the scene's own + 5 (the four quarter passes and the composite) + 1 (the CRT in `over`).

## Checked

`node parts/glow/check.js`: the GLSL's rules (above), the tap and sample counts, the bright pass's 4-tap box, the mask compiled in at a
scale under 1 alone, the split's law (by the distance from the centre alone, 0 inside 0.71 of the way out, the full 1 px from the
sides' middles), the three lights' branches in one loop body, the tiers and their scales (full 1: the scene target the screen's 1280 ×
800, no Points touched; bloom 0.5: 640 × 400, the Points halved and put back; the quarter targets 320 × 200 either way; every target
LinearFilter, unmipmapped; a scale set by `opts` held through a change of tier), the twinkle's periods and the gate margin, the clock
under CALM and its wrap (a mock renderer, the real three.js: the targets' sizes and types, the ramp's timing, the resize, the room's faint shafts), the third light's easing (in
from 0 at its own place, half way at 300 ms, a new key gliding place, strength and colour from where it was, the live place followed
meanwhile, out where it stood, a step under CALM), the grade on the palette (green, gold, the current, target, home and gold cells, the
twelve rays, the seven moves' hues, the trail and the field), the knee against the field, the ring and a core, the split's bound (≤ 1
px), the budget (48 samples a pixel under 6 ms at scale 1, the composite 5 fetches a pixel, 7 with the mask at 0.5; 32 a light over
it; the sky's saving 0 at scale 1 and over 1 G ops at 0.5), `traceStrength`, and index.html's wiring (lightAt of the tile's
render after every move, the render alone with the tile off, the cell projected as the eye is, `fold.prefs.traceGlow`). `demo.html` on WebGL2 and `?gl1` under SwiftShader: every pass compiles with no error or warning
from three.js, with half-float quarter targets (`EXT_color_buffer_float` / `EXT_color_buffer_half_float`); the fallback to bytes is
taken where the extension or a complete framebuffer is missing (the check's mock takes it). The headless play-through (DAILY, the six
moves with the third light's cell, colour and strength logged at each, HINT, UNDO, the tile's six laws by x, the tile off by z and a
move (the light still answered), level 33, level 56 facing the eye, the TUBE open and closed, a SYNC level lost → the bardo → REBIRTH,
chapter 1 closed to its ledger, GLOW off and on, the day ended; once under prefers-reduced-motion) ran with no page error and no
console error; the third light moved 143 → 19 → 143 → 33 → 201 → 167 → 106 over g G f i q r at level 1 (strength 0.80–0.87), its
shaft on the screen when its cell was.
Not measured: a phone, an RK3588, a Pi 4 — the tiers are reasoned from the arithmetic above, as fx.js's are.
