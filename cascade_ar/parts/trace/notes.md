# parts/trace — a ray tracer in GF(257), and the TRACE tile

`trace.js` defines `window.FOLD_TRACE`: a ray tracer whose every number is an integer mod 257. The eye stands at a point of the plane and sends
one ray along each of the 256 unit directions (THE TURN's orbit, B1); a scene is a few of the relief's conic sheets f(x, y) ≡ r, each with
a refractive index n and an impedance Z, and a few point lights; a ray meets a sheet where a quadratic in t has a root, which it has exactly
when the discriminant is a residue (the character), the root by the field's own square root; it bounces off the gradient with its amplitude
multiplied by Γ = (Z − 120)/(Z + 120), or bends by Snell with sin θ the y of the direction; what arrives over four bounces is laid on A8's
16 × 16 picture (pixel p = c + 16r), spread by the Airy beam (A14) and kept by the P22 persistence. Only the display reads the field's numbers
as light (value/256) and as the twelve rays' wavelengths (A15). Nothing is needed at load (the tables are built inside; `FOLD_RELIEF.orbit`
is taken when relief.js is loaded, and `check.js` asserts the recomputation equals it). `demo.html` shows the tile at 1× and 4×, the raw
16 × 16, the directions, every law by a button and the moves g G f i q r; `node check.js` runs 55 checks. The demo and the game ran in
headless Chromium (SwiftShader) with no page error and no console message.

## The rules, as built

| law | the field's reading | the alternative (`opts`, and the tile's cycle) |
|---|---|---|
| **directions** | THE TURN's orbit of (1, 0) under (x, y) → (cx − sy, sx + cy), c = 155 ≡ 4/5, s = 52 ≡ 3/5: the 256 points of x² + y² ≡ 1 once. Read as one number w = x + 16y the turn is ×u, u = c + 16s = 216 = 3^147, so step k is w = u^k, and every w ≠ 0 is a point of the circle, x = (w + w⁻¹)/2, y = (w − w⁻¹)/32 (since (x + 16y)(x − 16y) = x² + y²). A turn of j steps is ×u^j on w. `dirs: 'turn'` | `dirs: 'dlog'`: the same 256 ordered by the generator, w = 3^k; k_turn = 155·k_dlog mod 256 (155 = 147⁻¹) |
| **hits** | p + t·d on f ≡ r: f is a quadratic polynomial, so f(p + td) = at² + bt + c exactly with a = (f(p + d) + f(p − d) − 2f(p))/2, b = (f(p + d) − f(p − d))/2, c = f(p) − r (three evaluations of the form, no table of gradients, the parabola's linear term included). The discriminant b² − 4ac is a residue (character +1) for two roots (−b ± √disc)/2a with √ = POW[dlog/2], zero for the tangent root −b/2a, a non-residue for none; a ≡ 0 (d on the form's null cone) leaves bt + c ≡ 0, one root, none if b ≡ 0 too. A root is read as the integer t in 1 … 256, the steps of d from p; t = 0 is where the ray stands and is not a hit; the nearest hit is the smallest such t. `hits: 'character'` | `hits: 'sign'`, the real reading: the discriminant lifted to −128 … 128 hits when it is ≥ 0; the root by the field's root when it has one and by the integer root ⌊√lift⌉ when it has not. Both readings hit about half the time (0.505 and 0.505 over 40,000 random rays and levels of the six forms) |
| **the normal** | the gradient (∂f/∂x, ∂f/∂y) mod 257 by central differences, exact for a quadratic: (f(q + e₁) − f(q − e₁))/2 and the same in y | — |
| **reflection** | d′ = d − 2(d·n)/(n·n)·n, an orthogonal reflection, so d′·d′ ≡ 1: the bounced ray is again one of the 256 (found back through `idx[w]`); twice is the identity. A null normal (n·n ≡ 0: y = ±16x, the plane's light cone) or a zero one (the origin of a homogeneous form) ends the ray (`absorbed`) | — |
| **amplitude** | A₀ = 1 at the eye; at hit j the surface sends A_j·T_j·E(q_j) to the eye and the ray goes on with A_{j+1} = A_j·Γ_j, Γ = (Z − 120)/(Z + 120) with Z the sheet's impedance and T = 1 + Γ = 2Z/(Z + 120): Γ(∞) = 1 the open circuit (T = 2), Γ(120) = 0 matched (the ray ends after its glow), Γ(137) = ∞ the pole (the eye swallows: no glow, the ray ends), Γ(46) = 46 and Γ(92) = 92 the mirrors. `bounce: 'gamma'` | `bounce: 'snell'`: no Γ, A stays 1; the ray bends into the sheet by Snell, n₁y₁ ≡ n₂y₂ with sin θ the y of a unit direction, the bent direction (±√(1 − y₂²), y₂) with the sign of its lift matched to x₁'s so it goes on forward, or reflects on total internal reflection (1 − y₂² a non-residue); the medium is then the sheet's n (a sheet is a sheet, not a solid: leaving it is not modelled) |
| **the light** | E(q) = Σ_s I_s/|q − s|², the inverse square in the field over the point lights; a null separation (|q − s|² ≡ 0: s = q, or s on q's light cone) carries none | — |
| **colour** | the direction's own cell w = x + 16y → ray dlog(w) mod 12 → ar.js's wavelength (377 … 610 nm). `colour: 'direction'`. Under the turn a column of the picture holds one ray: 16 steps of the turn add 16·147 = 48 to the dlog, a multiple of 12 (shifted by 8 where the dlog wraps past 256), so the tile reads as coloured columns; `dlog` directions scatter them | `colour: 'cell'`: the hit point's cell x + 16y → its ray (SEED's 0 the pale white of ar.js's `rayColor`) |
| **the pixel** | p = c + 16r (A8) carries direction k = p in the chosen ordering. `pixel: 'index'` | `pixel: 'cell'`: pixel p carries the direction whose cell w ≡ p; pixel 0 (SEED) stays dark and w = 256 is unseen |
| **the origin** | the player's cell as (x, y) = (cell, 0), the cell as a + 0φ of the plane; the eye at ∞ sees nothing (the tile dark, the caption 0·0·.00). The day table was the other choice, (cell, day mod 257), which would move the eye once a day; not used, so the same cell on every day gives the same picture | `render(scene, [x, y])` takes any origin |
| **the glow as light** | each glow A·T·E is a field element read as value/256 (the relief's `value` reading), summed over the bounces in its ray's colour; the tile's gain 0.55 keeps most sums under the clamp. Brightness by dlog (the relief's other reading) is not offered | — |

### T = 140?

The scope and the material give the tunnel chain Π → ×140 (T) → fold → ×2 → ×87 (B8). That 140 is the cell of the letter T (ATTENUATION; CURE +
COMPUTE = 140 = T, C24), a word's number, not a transmission coefficient. The field's T = 1 + Γ = 2Z/(Z + 120) equals 140 for one impedance alone,
Z = 247 (Γ = 139), and Γ itself is 140 at Z = 4 (T = 141); `check.js` asserts both. In the game's scenes a sheet whose impedance is the target's
cell therefore has T = 140 only when the target is 247.

### The default scene (`scene(S)`)

| sheet | form ≡ r | n | Z | Γ | why |
|---|---|---|---|---|---|
| the sheet | the chapter's sheet (levels.js `CHAPTER_SHEETS`; the room takes the norm) at r = the target's cell (the home cell when the target is ∞ or none) | 3 | the target (∞ when it is ∞ or none) | (target − 120)/(target + 120) | the level's own level set: the generator's index, the target's impedance |
| the turn | circle x² + y² ≡ 1 | 16 | ∞ | 1 | THE TURN's ring, where the directions live; the quarter turn's index, the open circuit |
| the first stars | norm x² + xy − y² ≡ 154 | 5 | 46 | 46 | ±1/√5's ring; 5 the non-residue; Γ's first mirror |
| the far stars | norm ≡ 103 | 103 | 92 | 92 | ±φ/√5's ring; 103 = 1/5; the second mirror |
| the inverses | product xy ≡ 1 | 2 | 120 | 0 | A9's hyperbola; matched, a black body that still glows once |

Lights: SEED (0, 0) with I = 1, the four stars (103, 51), (154, 206), (206, 103), (51, 154) with I = their norms 154, 154, 103, 103, and the
eye itself at (cell, 0) with I = 1 (not at SEED). Depth 4.

## The API

- `dirs(mode)` → `{mode, X, Y, W, idx}` (Uint16 ×256, idx a Uint8Array by w); `orbit()` the recomputed turn.
- `hit(form, r, px, py, dx, dy, {hits})` → `{t, x, y, a, b, c, disc}` or null; `grad(form, x, y)`; `reflect(dx, dy, nx, ny)` → [x, y] or null;
  `refract(dx, dy, n1, n2)` → [x, y] or null; `gamma(Z)`, `trans(Z)` (INF at the pole); `emission(lights, x, y)`.
- `scene(S)` → `{surfaces: [{form, r, n, Z, name}], lights: [{x, y, I, name}]}`; any object of that shape is a scene (a form may be a function).
- `render(scene, origin, opts)` → `{light: Float32Array(256 × 3), hits, bounces, stats: {rays, hit, bounces, reflect, refract, absorbed, depth,
  energy, coherence, ms}, modes}`. `opts`: `dirs`, `hits`, `colour`, `bounce`, `pixel` as above (`MODES` lists the values, `DEFAULT` the field's),
  `depth` (4). `hit` is the rays that meet anything, `bounces` every meeting, `coherence` A37's: the light's vector sum over the directions, each a
  spin at dlog(w)·2π/256, divided by the light's sum (0.0078 is A37's even sky; 0.02–0.05 here).
- `beam({size, ring, barrel, vignette})` precomputes, for a size × size raster over the 16 × 16, each output pixel's 3 × 3 source pixels and
  weights airy(dist/ring) normalised (airy as fx.js has it: the series in u = ρ²/16 inside, the asymptotic form past ρ = 3.4; r = 1 at the first
  dark ring 3.8317), read through the CRT barrel p = c(1 + 0.0234|c|²) and dimmed by the vignette 1 − 0.4r² (both on by default past 16); size
  16 with ring 1.5 spreads the picture in place and keeps a flat field flat. `image(light, beam, out)` is one gather → Float32 rgb;
  `toRGBA(rgb, out, gain)`.
- `persistence(T)` = cos(πT)e^(−0.5T) (fx.js's); `persist(prev, target, T, out)`: shown = max(target, prev·F(T)), so a move is the one onset
  and between moves every pixel only falls (by at most 0.036 a 60 Hz frame at τ = 600 ms; the steepest step of F over 1/72 is 0.0358 at T ≈ 0.4).
- `lightAt(scene, origin, opts)` or `lightAt(result)` → `{angle, rgb, energy, coherence, cell, stats}`: the light's vector sum with each direction
  at the azimuth where ar.js stands its cell w (dlog/256 of a turn, 0 ahead), so a GLOW pass can hang its god rays at that azimuth in the
  field's own frame; `rgb` the energy-weighted colour (unit), `cell` the brightest direction's w. One lit direction gives its own azimuth and
  coherence 1; a direction and its opposite (u^128 = −1) cancel.
- `Tile(canvas, {size: 64, beam: 64, dpr, tau: 600, gain: 0.55, calm, cycle})` → `{set(scene, origin, modes?), frame(now), cycle(i?), mode,
  modeName, cycleIndex, modes, stats, ms, shown, target}`. `set` renders and lays the picture (returns the render); `frame` draws while the
  persistence runs and stops drawing once it is done; under CALM the new picture stands at once and nothing moves between moves. `cycle()`
  steps `CYCLE`, one law changed from the default at a time: the turn · the character · Γ → directions by dlog → hits by the real sign →
  colour by the hit cell → Snell, no Γ → pixel p the cell p → home.

## In the game

`index.html` loads `trace.js` after `rays.js` and `sw.js` keeps it in SHELL (CACHE left for the merger). The tile is `<div id="trace">` in `#ui`
(so the dom-overlay carries it): a 64 × 64 CSS px canvas beside the rays inset (left 150 px, bottom 166 px, the caption under it; on a screen
under 420 px wide it stands above the inset at left 10, bottom 336, clear of the quest box). The TRACE button shares RAYS's slot in `#ops`
(both span one column), so the moves keep their rows; `z` toggles it, kept in `fold.prefs` `{trace: 'on' | 'off'}`; a tap on the tile, Enter
on it or `x` cycles the law, kept as `fold.prefs.traceMode`. `traceSet(S)` runs from `paint()` — on every move, at a level's opening, after
UNDO — by a key of the cell, the level, the target, the sheet and the law, so a hint or an answered quest renders nothing anew and the same
cell gives the same picture; the scene is `scene({sheet: S.spec.sheet, target, current, home})` and the origin `[S.current, 0]`, null at ∞.
The caption is `hit·bounces·coherence` (`248·750·.02`); the tile's title and aria-label carry the words, the law and the render's ms. The TUBE
hides it as it hides the inset; in XR it rides the overlay. It is on for every tier (CPU integer math and a 16 × 16 canvas), and still under CALM.

No flash: the tile's 4096 px² are under the gate's area (2.8 % of the screen: 21824 px² at 1024 × 768, 9217 on a 390 × 844 phone), and its
luminance changes once a move, at the move (the persistence only dims after it; `check.js` asserts both on a stub canvas, and the play-through
measured the tile's mean luminance 0.29 → 0.38 at the move, then falling to 0.32 with no rise).

## Numbers

- 256 directions, all distinct, all on x² + y² ≡ 1, equal to `FOLD_RELIEF.orbit()`; u = 216 of dlog 147, 147⁻¹ = 155.
- Hits: 0.505 of 40,000 random (ray, sheet) pairs by the character, 0.505 by the real sign; every root on its sheet at its t.
- Snell from n₁ = 1 over 256 directions × 256 indices: 33,024 refract, 32,512 reflect, as the task names them — the two directions with y = 0
  always pass (512), and each of the other 254 passes for 128 of the 256 indices (1 − y₂² is a square or zero for 128 of the 256 values y₂
  takes: the 126 pairs ±s with y₂² + s² = 1 off the axes, and y₂ = ±1).
- T = 1 + Γ = 140 at Z = 247 alone (Γ = 139); Γ = 140 at Z = 4 (T = 141).
- Day 9422 (SCRIBE), level 1 from 136: 248 of 256 rays hit, 750 bounces, coherence 0.02; level 56 from 137: 250 hit, 783 bounces; at ∞ dark;
  back at 1: 256 hit, 789 bounces.
- Cost: a render (256 rays × ≤ 4 bounces × 5 sheets, 6 lights) 1.1–1.5 ms median under node (p90 1.7); in headless Chromium (SwiftShader, the
  3D frame sharing the thread) 1.1 ms median, 1.6 p90 steady, and the tile's `set` (render + the 64-beam gather + the onset) 1.8–2.6 ms a
  move, 5.7 ms the first time (JIT cold). The 64-beam gather alone 0.2 ms; `frame()` 12k max() a frame while the persistence runs (600 ms),
  then nothing. The budget named was 2 ms; the render keeps it, the first tile of a session does not (once).
- Draw calls 0 (2D canvas); one 64 × 64 offscreen canvas and three Float32 buffers of 12,288.

## Left out, and why

- **A GLOW pass from `lightAt`**: the API is here (the azimuth in the field's frame, the colour, the energy); the god rays are a later step.
- **Occlusion of the lights**: E(q) sums every light's inverse square with no shadow ray (that would be 6 more hit tests a bounce; the field has
  no 'between' anyway, since t is read as an integer by choice, not by order).
- **A medium left behind**: under Snell a sheet sets the medium and nothing resets it; a solid conic would need an inside.
- **Brightness by dlog** (the relief's other reading of a value): `value` only.
- **The day table as the origin**: documented above, not used, so a cell's picture is the same on every day.
