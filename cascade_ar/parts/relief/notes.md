# parts/relief — the conics relief in THE FOLD

`relief.js` defines `window.FOLD_RELIEF`, pure three.js r128 builders of the machine's RELIEF viewer (`conics_relief.html`,
`relief_view.js`, THE TURN of 2026-10-08) placed in the game's world: the player at the origin, the cells on the sphere of radius 6,
the 210-gon on the floor at y = −2.4 inside radius 3, the horizon at y = 0, forward −z, an azimuth θ placed as (sin θ, ·, −cos θ) as
`ar.js` places a cell. Nothing but `vendor/three.min.js` is needed: the field's tables (dlog, the powers of 3) are built inside.
`demo.html` shows every builder with a button and an orbit camera; `node --check relief.js` passes; the demo ran in the browser with
no console error, every button exercised.

## What each builder draws

| builder | what | placed | vertices |
|---|---|---|---|
| `norm(opts)` | the norm sheet a² + ab − b² mod 257, every second point of the 257 × 257 grid (129 × 129), a to the right, b ahead, the player over the picture's middle (128, 128); the five stars at their exact (a, b), white, SEED's gold | a floor, y = −2.4 ± 0.6, half-side 2 (diagonal 2.83 < 3) | 16641 + 5 |
| `conic(kind, r, opts)` | the solution set of one conic ≡ r — `circle` x² + y², `ellipse` x² + 4y², `hyperbola` x² − y², `parabola` y − x² (so y ≡ x² + r), `product` x·y, `norm` — as Points and a faint Line in point order (x ascending, then y) | a ring of radius 4.5, θ = 2π·x/257, height (y/257 − ½)·3 about the horizon | 2 × the points: 512 for a circle r ≠ 0, 514 for a parabola, 516 for the norm, 1026 for the null cone r = 0 |
| `turn(opts)` | THE TURN's orbit of (1, 0) under (x, y) → (cx − sy, sx + cy), c = 155 ≡ 4/5, s = 52 ≡ 3/5: the 256 points of x² + y² ≡ 1 in orbit order as a LineLoop with the hue the step, the same 256 as Points, the start white and the first step (155, 52) gold, and a bright marker that `obj.step(k)` moves to step k; `obj.at(k)` → {k, x, y, cell: x, u: x + 16y, dlog, position} | a ring of radius 5, θ = 2π·k/256 (or by the dlog of x + 16y = 216^k with `angle: 'dlog'`, which puts step k at the azimuth where ar.js stands the cell 216^k), height by y as the conic's | 256 + 256 + 2 + 1 = 515 |
| `sheet(kind, mult, opts)` | a 65 × 65 relief (every fourth point) of `product` a·b or `norm`, or any of the relief's forms (`circle`, `ellipse`, `hyperbola`, `parabola` y² − 4x, `trace` 2a + b); mult one of ×½ … ×256 | a ceiling level at y = 5 inside the sphere, half-side 2.2 (the sphere's radius there is 3.32), the relief hanging toward the player; or a wall at distance 5 at any azimuth, b upward, relief toward the player; or a second floor | 4225 |
| `dispose(obj)` | frees every geometry and material under obj and takes it off its parent | | |
| `count(obj)` | the vertices under obj by the position attributes | | |

Floor + circle + turn + ceiling together: 21898 vertices, under the 40k budget. The `wire` mode of a sheet is one indexed
LineSegments of the grid's rows and columns (the same vertices, 66048 line indices for the floor, 16640 for a sheet); the `mesh` mode an
indexed MeshBasicMaterial surface (98304 triangle indices for the floor), the heaviest, kept for a desktop. Points is the default and
the light one. All colours are Float32 colour attributes with vertexColors; no texture, no shader of our own. Build times in the
browser: the floor 1.6 ms, a conic 1.6 ms (66049 evaluations), a sheet 0.5 ms.

The arithmetic alone is exposed too: `solve(kind, r)` the point set, `orbit(c, s, x0, y0)` the turn's orbit with its closure, L = c² + s²,
u = c + 16s and c − 16s, `valueAt(form, a, b, t)`, `hue(h)`, `DLOG`, `POW`, `STARS`, `MULTS`, `FORMS`, `CONIC_FORMS`.

## The relief's conventions carried into the game

- Height. The relief lifts a value by val/256 × H with H = 120 × the multiplier (×½ … ×256); by dlog, dlog/255 × H with zero at
  −0.08 H; `flat` 0. Here the same reading is in metres: amp × mult × val/256 with amp 0.6 for the floor (centred, so the floor runs
  −0.6 … +0.6 about y = −2.4) and 0.5 for a hung sheet (not centred, 0 … 0.5 at ×1); `height: 'value' | 'dlog' | 'flat'` as the
  relief's buttons. mult multiplies the amplitude as in the relief: ×2 on the floor reaches ±1.2, ×8 on the ceiling four metres,
  ×16 and beyond passes through the player; a multiplier not of the list is read as ×1.
- Colour. The relief's `dlog as hue` is hue(dlog/256) with zero black, the ramp r = |6h − 3| − 1, g = 2 − |6h − 2|, b = 2 − |6h − 4|
  clamped; the same function is `FOLD_RELIEF.hue` and the default `colour: 'dlog'`. `'vertex'` is the relief's cube vertex of gcd(v, 210)
  with its eight colours (UNITY black, c blue, g amber, Φ magenta, cg grey, cΦ violet, gΦ coral, cgΦ white). `'value'` is a ramp of
  the game's own, the ground's dark green to the gold of the quarter turns, which the relief does not have.
- The frame. A sheet is laid as the relief's buildOne lays it, o + u·X + v·Y + nrm·h with X = (a − 128)/128 · half, so the player stands
  over (128, 128), the picture's middle. The relief's cube inward (the relief toward the eye at the centre) is the default of the
  ceiling and the wall; `outward: true` is the cube outward.
- The time step. The relief's v → v·g^t is `opts.t` and `obj.setT(t)`, which refills the positions and colours in place (and moves
  the stars with the floor); one step multiplies every value by 3, the game's ×g.
- THE TURN. The orbit, its closure test, u = c + 16s and the hue by step k/256 are the relief's own; the start white and the first
  step gold as the page marks them. The relief draws the orbit on whatever sheet stands, at that sheet's heights; here it stands on
  its own ring at radius 5 with the height by y, since the floor is the norm and the orbit lives on the circle.
- The conics as point sets. The relief shows a conic as a whole sheet (height the value at every (x, y)) and the level r as a ring
  of one height; here `conic` picks the level set out, the points with f(x, y) ≡ r, which is what the game can stand round the
  player. The parabola as a point set is y ≡ x² + r, one point an x, 257 points (the task's form); the sheet's `parabola` is the
  relief's y² − 4x. A circle, ellipse, hyperbola or product at r = 0 is the null cone, two lines through the origin, 513 points; the
  relief's null lines are not carried otherwise.
- The sampling. Every second point for the floor and every fourth for a hung sheet; the grid is still indexed by the field's own a
  and b (the sample at (2i, 2j) or (4i, 4j)), and `pointAt(a, b)` gives any point's exact place and value.

## The five stars

0, 103 + 51φ, 154 + 206φ, 206 + 103φ and 51 + 154φ, the field of five inside the plane (0 and ±1/√5, ±φ/√5), norms 0, 154, 154, 103,
103. The sheet's differences 2a + b and a − 2b are (0, 0) at 0 and (0, ±1) or (±1, 0) at the four units: one vanishes and the other is
a step of one grey level, the flat points of the picture. From the player, over (128, 128), the four stand at 71.6°, 161.3°, 252.0°
and 342.2° with b ahead: a square turned −arctan ⅓, which is the picture's 18.43°, 108.43°, 198.43°, 288.43° with its rows read
downward. 0 stands at the near-left corner of the floor, at (−2, −2.98, 2).

## Three ways the game could use them

1. The chapter of the plane, under the tape's levels. Put `norm()` on the floor for a chapter (the game plays eight tape levels a
   chapter) and call `floor.setT(S.moves)` after every counted move, so each ×g turns the sheet one step of v → v·g, the fold and
   the inverse read as 128 and −t; the chapter's quest (the `quest` of a level spec, answered by a tap through `questDone`) is a
   star: tap cell 154, the norm of ±1/√5, or 103, the norm of ±φ/√5. The level kind stays `tape`.
2. A level kind `turn` for the EXIST days (opcode 2, ×i free) or wherever the designer puts the quarter turn. The turn ring stands
   at radius 5; after k counted moves the target is `turn.at(k).cell`, the x of orbit step k (step 25 is 44 BRIAN, u = 220), the
   marker moved by `turn.step(S.moves)`; solved by layers as `solveShift` solves SHIFT, with t_k = the orbit's x at k instead of
   t·3^k. With `angle: 'dlog'` the ring's step k stands under the cell 216^k on the sphere, so the orbit is seen to be the
   generator's powers read in two parts.
3. THE DOORS and the HALT days. At a door of the Kaprekar chain (4176 ≡ 64, 8352 ≡ 128, 8532 ≡ 51, 6174 ≡ 6) stand
   `conic('circle', door)` at radius 4.5: every (x, y) with x² + y² ≡ the door's cell, the door's two-part roots, with the
   chain's current four figures mod 257 as the ceiling `sheet('product', 1)` turned by `setT`. On a HALT day (opcode 9, thirty
   seconds) the turn's marker is the clock: `turn.step(Math.floor(256 · elapsed / 30))`, the ring the dial, the start white where
   the thirty seconds close.

## Not done here

`index.html`, `ar.js`, `game.js`, `field.js` and `data.js` are untouched. To load the part in the game, add
`<script src="parts/relief/relief.js"></script>` after `ar.js` and the file to `sw.js`'s SHELL with a bump of CACHE, or a phone that has
the game keeps the old files.
