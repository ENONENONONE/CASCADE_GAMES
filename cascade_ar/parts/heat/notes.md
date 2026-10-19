# parts/heat — Sisyphean Heat on the chapter's floor (H1–H3)

The sketch (Sisyphean_Heat.html) ported, not loaded: thousands of climbers push up a drifting terrain, run out of effort, fall and
start again, and only their heat is drawn. Here the terrain is the sheet the floor already draws, h = V(a, b)·m mod 257, and the
drift is the game's own: m = current/target, R1's ratio, so every move re-forms the hill under the crowd. The summit is the field's
cliff, the place where 256 wraps to 0.

| sketch | here |
| --- | --- |
| 3-octave Perlin terrain drifting in time | V(a, b)·m mod 257 on the chapter's sheet, m = current/target; your own cell with no target in 1 … 256; 0 on SEED (flat, the heat dies); ∞ freezes the crowd until Γ(∞) = 1 |
| gradient by a real central difference | for each axis the mean of the step up and the step down from the nearest cell, each reduced to (−128, 128], so a cliff reads the short way round. On the norm at m = 1 this is the field's own (2a + b, a − 2b) on 97 % of the cells; a real derivative of the raw values is wrong for every m but ±1 |
| summit at slope < 0.00045 | over the crest: a step whose height drops by more than 128. The field has no flat summit, so the summit is the cliff; the five stars are saddles |
| effort 160 ± 30 %, cost 1 + 90·slope, heat 18·slope | 160 ± 30 %, cost 1 + 1.55·slope, heat 0.31·slope, the slope |grad|/256: the sketch's noise is 58.1 times gentler than the norm at 1000/257 px a cell |
| speeds in px a frame | × 257/1000 for cells; 60 steps a second from the frame's dt, at most 3 a frame |
| fall: gravity 0.55, damping 0.965, heat × 0.975; lands on a gentle slope at a slow speed after 12 frames, or after 260 | the same, and the foot of the next wall (a rise of more than 128) lands it too; reborn at the lowest of four samples, anywhere or within 12 cells of its home |
| a 1000² canvas, fade alpha 7 a frame, ADD | a 256² (128²) RGBA8 render target never cleared: a 7/255 black quad, a 1/255 ReverseSubtract quad to kill the 8-bit residue, one additive LineSegments of 2n vertices |
| ascent #2f6fb8, descent #ff6a2a, whitened by heat | the same colours (the page's --climb and --fall), the alpha scaled by 0.3 (a stroke is a whole texel here, 4–8 times the sketch's 0.8 px of 1000) and by ⁴√(3584/n) on smaller crowds |
| counters: climbs completed, steps, summits | levels played, counted moves, closes at par, and falls = losses + undos (H3) |

## What is drawn where

- **The carpet** (`layer`): a mesh over the relief floor's own position attribute, so RELIEF's refills move it, reading the target by
  (a, b) from x and z, additive, lifted 12 mm. Never on the zone plate (HALT), whose samples are sorted by radius and have no grid order.
- **The floor follows m**: index.html's heatStep sets the floor's t to dlog m (relief.js setT) and the crowd's m together, through one
  limiter of 3 re-forms a second from any source (moves and UNDO); a fourth waits for the next frame. On SEED (m = 0) the floor keeps
  its last form and the hill goes flat; at ∞ nothing moves.
- **The white climber** (`climber`, H2): at your cell's azimuth (ar.js place: 2π·dlog/256) at radius 3·max(0, par − d)/par, d the
  solver's distance (game.js S.dist), so the start is the centre and the target's tick on the rim is the summit; a stroke a move, blue
  closer, grey kept, orange further, whitened by the move's heat (|circular Δdlog|/128); UNDO an orange stroke back; a loss, or a run
  past par + slack + 1 on a level that is not strict, slides it orange to the centre over 0.6 s. The last 20 strokes; drawn with no
  depth test at y −2.35 so the relief never hides it. SEED and ∞ stand at the centre.
- **The close**: n/64 of the crowd (56, 28 or 8) take the floor's edge under the target as their home, so through the day the heat
  gathers under the day's targets; and one snapshot of the target is blended (lighter, 0.5) into a 128² ground canvas for the seal.
- **The day's heat** (`dayPicture`, H3): 514², 2 px a cell. The ground under it; the 210-gon's rim and twelve faint spokes; every
  saved climb replayed from its start and its ops (game.js S.climbs: L, s, t, par, slack, ops, d, out, moves, undos) in the climber's
  layout with the same colours; an orange streak to the centre for each loss; a white dot on the rim at each closed cell's azimuth, the
  crown (dim for a reborn level); the four counters. A tap saves the PNG; SHARE sends it with the text where the device shares files.

## Tiers and cost

- 3584 climbers at 256² (full), 1792 at 128² (lowEnd), 512 at 128² (tiny); fold.prefs {heatTier} overrides. 24 B a climber uploaded
  a frame (two float32 pairs and two RGBA8), 86 kB at 3584; the target 256 kB (64 kB).
- check.js: 227 ns a climber-step on this container (node), 0.8 ms a frame at 3584. A 30-frame mean past 2.1 ms sets `slow`.
- The crowd runs only while the floor stands (RELIEF on), the level is in play and the TUBE is down; never under CALM (its trails
  are motion) — then the seal's picture has strokes and the crown alone. h, or fold.prefs {heat: 'off'}, turns it off.

## Numbers (check.js)

- The norm at m = 1: 33006 of 132098 torus edges are wrap cliffs, 258 crest cells (value 256), 1 zero, 49 gentle cells (field gradient
  of length ≤ 4). The circle, hyperbola, product and ellipse share the crest and gentle counts (256, 513 zeros, 49) with 33044, 33042,
  33024 and 33068 wrap edges. The parabola y² − 4x: 17540 wrap edges, 257 crests, 257 zeros, no gentle point, so its crowd never rests.
  At m = 3 the norm keeps 258 crests and 1 zero but its cliffs move: 32974 wrap edges.
- 3584 climbers for 900 steps at cell 1 on the norm: the crest comes first (about 180 k falls over the wrap against no exhaustion), a
  mean life of about 20 steps. The effort budget lives in the player's own climb (H2).

## Left out, and why

- The sketch's lateral stroke width by speed: WebGL lines are one pixel. The fall's brightness carries the speed instead.
- Undo back-strokes in the day's picture: the record keeps the final road and the count of undos, not where each undo stood.
- A flat black floor on SEED: the floor keeps its last form; only the hill under the crowd flattens and the heat dies. A dimmed floor
  would be a second large change of the view under the gate.
- The ground survives the session only: it is not saved. A reload starts the day's ground black; the climbs and the crown are saved.
