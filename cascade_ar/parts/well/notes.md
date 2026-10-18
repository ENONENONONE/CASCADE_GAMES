# THE FOLD · well — notes

`well.js` defines `window.FOLD_WELL`: the eye, cell 137 = Γ's pole, as a black hole (scope S1), and the numbers the crossing (S4)
leans on. It owns no geometry but one quad; the law runs where the things it bends are drawn: the sky in `fx.js sky({lens: true})`,
the cells, the π ribbon, the lines between cells and the π tape's rain in `ar.js` (`LENS_GL`'s `lensImage()` in their vertex shaders,
`lensed()` in JS).
`node parts/well/check.js` checks the numbers below against the code (three.js, data.js, field.js, game.js, fx.js, ar.js, well.js and
levels.js in a node vm); it is a node check, kept out of sw.js SHELL.

## The law

The eye stands at dlog 72, ray 0: azimuth 101.25°, elevation −34°, 6 m out (ar.js `place`): 4.97 m off and 3.36 m below your eye.
Its Einstein radius reads the moves from your cell to it, d (game.js `toEye`, the reverse BFS over `S.opsList` at each level open,
the one S3's slow clock uses):

    θE = (92/11)° / √(d + 1)          92/11 the band step of ar.js place
    d   0     1     2     3     4     5     6
    θE  8.36  5.91  4.83  4.18  3.74  3.41  3.16°

Cells at d = 0 … 6 with the six moves: 1, 6, 22, 58, 111, 59, 1 (the six at d = 1 are 105, 120, 121, 154, 217, 242; ∞ alone at 6);
with the flip 1, 6, 22, 63, 122, 43, 1. So the ring is widest on the eye and narrowest on ∞, the far side of it.

A point β from the eye is seen at θ± = (β ± √(β² + 4θE²))/2 (`image`); read backwards, β = θ − θE²/θ (`source`). 154 ROAD TO
DAMASCUS, ×g of 137, 8.452° out, shows at 13.60° and −5.14° on the eye, at 9.50° and −1.05° on ∞.

- The sky (fx.js) remaps each view direction to its source before anything is drawn: the stars, the band, the spokes all bend, and
  inside θE the far side shows. θ by atan(s, c), since acos near 1 loses about 1.8° in fp16. The shadow is the pupil, 1.083°
  (the 22 px pupil of a 0.66 m quad at 6 m) times the eye's billboard scale (1.4 when you stand on it, 1.3 as the target, …),
  darkened by smoothstep(h, 1.15h, θ). The photon ring is gold × airyGlow(1.3405·θ/θE, 0.45) × 2.5 (`FX.LENS_GAIN`), drawn only for
  1 ≤ r ≤ 1.831, the first bright ring between the dark rings, so the centre lobe never paints a gold disc over the shadow and the far
  form's outer rings (53 % and 34 %) never draw. That ring is an Einstein ring, half power 6.79–10.34° on the eye, 2.56–3.91° on ∞,
  2.9–7.7× the shadow; a thin rim at 1.25h, 0.2h wide at 0.12 of the gain, hugs the shadow *(design)*.
- The cells and the ribbon (ar.js billboards) stand at their primary image θ+, stretched across by min(θ+/β, 3) and squashed along
  the radius by dθ+/dβ = θ+²/(θ+² + θE²). Only the sky bends: the bend is eased in from 3 to 5 m out by smoothstep, so SEED on the floor
  (2.4 m) stays and a flow between SEED and the sky is continuous. The eye's own cell does not move; its pupil goes black (the glyphs
  kept), which is the shadow wherever the sky cannot draw it.
- The lines between cells (the horizon, the fold threads, the ladder, Γ's orbit, the move arcs, the road) run the same law in their
  vertex shaders by `onBeforeCompile` on their LineBasicMaterials, so an arc still ends on the cell it names. The floor and the relief
  are ground, not sky, and do not bend.
- The rain (M1, fx.js rain({lens}), parts/shaders/notes.md) runs `LENS_GL` in its own vertex shader on the cells' uniform objects:
  each vertex of a column at θ+ on its great circle, where a cell (or a star) at that angle stands, the strip stretched across and
  squashed along the radius by the mesh itself (its rows 0.35° apart round the eye's −34°, so a column wraps the ring in short chords).
  The primary image never falls inside θE, and the fragment culls what a chord carries there, so the shadow and the disc inside the
  ring hold none of it (the far side's images are the sky's alone, as for the cells). Column 72, behind the eye, splits to both sides of it.
- Taps: `AR.lensed(v)` is the same law in JS; `onScreen()` and so `pick()` and the compass arrows read the image, so a tap near the eye
  lands on what is drawn (154 at 13.597°, not 8.452°: up to 5.15° of miss without it); the read's flight and a tap on the head in
  the rain (`skyAt`) read the image too. `AR.rainSeen(p)` is the rain's fragment cull in JS, for the check.

## When, and where

- Lit in chapter 7 (levels 49–56) of the daily run, on every JUMP level (the eye's own rule), and wherever d ≤ 2.
- Per tier (index.html, `fold.prefs` {lens: 'full' | 'tiny' | 'off'} overrides):
  - `full` (desktop, unflagged phones, `lowEnd`): the sky bends and draws the shadow and ring; the cells, lines and rain bend.
  - `tiny` (VideoCore, V3D, llvmpipe, SwiftShader): the sky has no stars to bend, so nothing bends; the shadow and ring are one
    camera-facing quad at the eye, 2.8·θE across, with the pupil black on the eye's cell, drawn over the (sparse) rain.
  - the camera on (any tier): the sky is hidden, so the quad draws the shadow and ring over the room; the cells bend on `full`.
  - WebXR: the cells bend (the billboard lens) and the rain's two columns with them; no quad, no sky.
- The scope put the over-the-room ring in fx.js warp() as a second path at 137's projected uv. It is the quad instead: the same pixels
  where the eye stands, at the eye's own place in the world rather than a screen-space pole, drawn only where it covers (a full-screen
  warp would cost its 65 ops a fragment everywhere, and its alpha and visibility belong to the Γ warp).

## Flashes and CALM

Every change of θE (a move that changes d, the lens coming on or off) asks `FX.strobe()` first, with the ring's own numbers:

- over the sky, gold × 0.4025 on black is relative luminance 0.059 (`RING_SKY`), under the gate's 0.1, so it always passes uncounted;
- over the camera, gold at alpha 0.4025 is 0.4025 × 0.4095 = 0.165 (`RING_ROOM`) over the annulus 0.746 … 1.366 θE, 4.114·θE² sr, a
  fraction of the view by the camera's fov and aspect (at d = 0, 4.0 % of a 16:9 view, 11.5 % of a 9:19.5 phone's).

Admitted, the ring eases to its new radius over 600 ms (smoothstep); under CALM it steps, with no motion. Refused (CALM with a large
change, or the gate's three a second spent by the room's flips), the ring fades out by the persistence law and back in at the new
radius over 600 ms, the gate's own fallback, so the ring never jumps where it would count as a flash.

## The crossing (S4), in index.html

- The first Γ of THE EYE (137 → ∞) slams '∞ · 1/0 · the open circuit' (#slam, role status, aria-live polite: 80 ms in, 600 ms held, 300
  ms out, type only), turns the sky to its negative over the 1.1 s flow, `negate` in fx.js sky(): col = mix(col, max(0.120·green − col,
  0), negate) before the breathing, so the negative never passes the band's 0.085·green and its change is at most 0.02 of relative
  luminance (the check), one onset that the gate passes. On a screen with no camera, no gyro and no room, and not under CALM, the view
  eases up toward ∞ over the flow, to the pitch clamp (1.4 rad, ∞ 9.8° above the centre): a turn of the camera only.
- Γ's orbit through the eye (ar.js paint, `state.eye`) runs up Γ's arc from 137 to the zenith and down to 1, two arcs of 18.
- The second Γ (∞ → 1) slams I AM, eases the view back, brings the sky back over its flow and re-blooms the field from SEED, 1 first
  (ar.js bloom; a still under CALM). The card waits out the 3.35 s bloom: THROUGH THE EYE, 'sighted ∞' when ∞ was on the screen while
  you stood on it, or tapped: #arr-cur, which points at ∞ then, takes a 44 px tap. Leaving ∞ any other way, or UNDO, brings the sky
  and the view back. The seal reads '∞ · crossed' (S.crossed, saved with the day).
- game.js keeps a level's own par where it counts its free moves: on a gold day THE EYE stays par 2 (day 9472, 2026-12-07, was par 0).
- Not here: V1's lift (void.js moves the rig; this only turns the camera), T1's chart rays, V2's tunnel to HEAVEN, U5's line strip.
  ar.js restore() is not needed: nothing in the crossing writes the cells' iPos.

## Cost

- Sky (`full`): one branch on a uniform; when lit about 45 ops, an atan, a sqrt, a sin and a cos, and airyGlow's pow and cos, per
  fragment (+3 % at 23 samples). The negative is one mix and one max.
- Cells: about 50 ops a vertex × 1032 vertices, plus the ribbon's 192; lines a few hundred vertices more. The rain: the same 50 a
  vertex × 19,968 (its rows were 7168 before the lens; the extra rows cost SwiftShader about 3 ms a frame) and a dot, a length, a
  division and a smoothstep a fragment; off, one compare each. Nothing per frame on the CPU
  but `step()`: a handful of uniforms, and the quad placed when it shows.
- Quad (`tiny`, the camera): 1 draw call, only where it covers, at d = 0 a 23.4° square, 7.6 % of a 16:9 view; on ∞ 8.9°, 1.1 %.
