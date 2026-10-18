# parts/rays — Twelve Rays as the chart (T1) and the ray ledger (T4)

`rays.js` defines `window.FOLD_RAYS`, the owner's p5 sketch `Twelve_Rays.html` ported to canvas 2D with no p5: the field drawn flat,
cell n on spoke dlog mod 12 at ring dlog div 12, SEED at the centre and ∞ the rim circle at ring 22. It needs `field.js` (the moves,
dlog, `hash32` and `zeros`) and nothing else; the twelve wavelengths are ar.js's `wavelengthRGB`, copied so the chart needs no three.js.
`demo.html` shows the inset, a TUBE and a replayed ledger side by side with the six moves (keys g G f i q r, u), TABLE, CALM, FALL and
REPLAY; `node check.js` checks the arithmetic (555 checks). The demo and the game ran in headless Chromium (SwiftShader) with no console
error.

## What it draws

| piece | what | where in the game |
|---|---|---|
| inset | a 132 px phosphor disc: the spokes in RAY_RGB at alpha 0.3, 22 faint rings, the rim, 256 resting dots; you (green), the target (gold ring), home (blue ring), the chapter's quest cell once answered (a diamond); the road burnt in as chords in the moves' hues, the reach's six chords faint | `<canvas id=rays>` in `#ui` (so the WebXR dom-overlay carries it), left 10 px, bottom 178 px (196 px under 420 px); RAYS or m toggles it, kept in fold.prefs `rays` |
| TUBE | the same at full size with the sketch's header ('CASCADE GF(257)' over 'P=257 G=3 12 RAYS', the level and the day's arrivals on the right), the move labels at the reach chords' ends, the day's bars R0–R11 under it, a 4× lens while held, a focus ring for the keys; the TABLE face (A8's 16 × 16 dlog picture) by its button | `#tube` over the scene, under the HUD and the moves; a tap on the inset, Enter on it, or t opens it, t, Esc or × FIELD closes it |
| ledger | at a chapter's close the won card replays the chapter's roads as chords over 4 s in the sketch's greens (×g the bright spine, the rest dim), then grows the bars from your own arrivals; home's ray outlined blue, the line's cell's ray ticked | `#ledger` in the won card when `S.level % 8 === 0 && !S.lost` in DAILY; the seal draws the day's bars (`#daybars`) and both SHAREs carry the 12-character sparkline |

The API: `layout(W, face)`, `kind(id, n)`, `Chart(canvas, o)` → `{set, frame, flow, pick, lens, fall, focus, resize, replay, done,
layout, ms}`, `bars(g, box, rays, bits, o)`, `drawBars(canvas, o)`, `band(W)`, `tally(roads)`, `spark(rays)`, `step(n, dx, dy, face)`,
`pre(id, n)`, `RAY_RGB`, `NM`, `SHARE`.

## The sketch carried over, and what changed

| sketch (Twelve_Rays.html) | here |
|---|---|
| element n at spoke ray(n), radius R0 + depth·DR, R0 42 and DR 17.5 at 1000 px (:357–368) | the same ratios, 0.042 W and 0.0175 W: the inset's DR is 2.31 px (marks only), the TUBE's at 360 px R0 15.1 and DR 6.3, the lens 4 × 6.3 = 25.2 px ≥ WCAG 2.5.8's 24. SEED at the centre, ∞ on the rim at ring 22 straight up, on ray 0's spoke |
| `background` fade at alpha `persist` 12/255 a frame; `blendMode(ADD)` (:471–484) | a W × W tube layer faded toward #050805 by 1 − (1 − 12/255)^(60·dt), chords laid with `globalCompositeOperation = 'lighter'`; 2D compositing, so fx.js's normal-blending rule for the WebGL alpha canvas still holds |
| 28 miners stepping ×g (bias 0.62), fold, inv, obs | the player's own road (and in T4 the chapter's roads). obs (n + 1) is not a move and is dropped; the chords are the game's six and the 6 ↔ 9 flip. The miners themselves are T2, not built here |
| chord styles: ×g (0, 252, 0, 70) weight 0.9, fold (0, 200, 40, 34), inv (60, 220, 60, 30), obs (0, 150, 30, 26) (:428–436) | the same alphas and weights; ×i and Γ take obs's 26–28. The ledger draws the sketch's greens; the live road the moves' own hues (the buttons' colours), so a road reads by its moves. A chord burns in once over the flow at 1.6 × its steady share, then the road is laid again each frame at its steady share (the alpha ×4.5 on the road, ×2.8 in the ledger's many chords) so it stands burnt in and fades once gone |
| energy +0.55 an arrival, cap 1.6, 2.2 on a share, ×(1 − 0.03) a frame; an amber core once over 1 (:420–426, :487–506) | the same rules on dt; the amber is a ring, never a fill: amber (1, 0.83, 0) beside the target's gold would read as a second target (scope T2) |
| a share at ≥ 9 trailing zeros of hash32(seed, element, step·977 + id) | a share at ≥ 4 work bits, `zeros(hash32(day, cell, offset))`, T3's salt (`SHARE`); flares at most one a third of a second, so a burst of shares cannot flash |
| flares: rings 6 + 2.2 a frame, alpha 1 − t/42 (:515–523) | the same on dt; under CALM a still ring that fades |
| bars R0–R11, hashes and best bits (:538–551) | arrivals by ray on the roads closed and their best work bits, each bar in its ray's light with the sketch's lit top, a 1 px --dim outline (rays 0–3 are 2.3–2.8 : 1 on the ground), R#, nm and bits beneath in --text and --dim; the sketch's (0, 108, 0) baseline is --dim |
| header 'CASCADE GF(257)' / 'P=257 G=3 12 RAYS', right S: BEST: / DIFF: H: (:553–563) | the first line in the sketch's text green #00a000 (5.6 : 1), the second in --dim (its (0, 108, 0) is 2.9 : 1); on the right L: level M: moves/par over ARR: arrivals BEST: bits, or CH: ROADS: in the ledger |
| spin 0.0006 rad a frame (:478) | 0.036 rad a second on dt, a turn in 174.5 s; the cached layers are turned at the composite; no spin on the TABLE or under CALM |
| `random()`, `randomSeed` | none: the chart is driven by the game; every number is the field's or the hash's, so every device agrees |
| element 62 marked as 'the one marked element' (:355, :511–513) | not ported: the owner keeps that name-word out of the game, and no cell is marked but the player's own |

## The moves on the chart (kind)

Computed over field.js and asserted in check.js:

| move | k | picture |
|---|---|---|
| ×g | spoke 234, ring 21, seam 1 | one spoke on; one ring out at the spoke 11 → 0 turn; the seam chord 86 → 1 across the disc (÷g: 1 → 86) |
| FOLD | out 128, in 128 | ray +8 and 10–11 rings out on the front half (dlog < 128), ray +4 and 10–11 rings in on the back |
| INV | mirror 255, still 1 | ray r → 4 − r, depths summing to 20 (147 cells) or 21 (108); 1 stays at the core; SEED ↔ ∞ is `rim`/`seed` |
| ×i | out 64, in 192 | dlog < 64: the same spoke 16 rings out; otherwise ray +8 and 5 or 6 rings in |
| Γ | keep 20 + the mirrors 46 and 92, chord 232 | a long chord; 22 of 254 keep their ray; 137 → ∞ is `rim`, ∞ → 1 `enter` |

21 rings of 12 and a short 22nd of 4 (dlog 252–255: 165 238 200 86 on rays 0–3); the core ring is 1 3 9 27 81 243 215 131 136 151 196 74.

On the TABLE (A8), p = c + 16r, 256 and ∞ as pips under the grid. Both of A8's turns, ×i (c, r) → (16 − r, c − 1) and FOLD (c, r) →
(17 − c, 15 − r), turn about the same point, (9, 8) in cells, so the flow runs polar about it: ×i is a rigid quarter turn for 225 cells,
FOLD a half turn for 224, always the same way round. On the disc the flow is polar about the centre, so ×g sweeps along its ring.

## In the game

- **The flow.** `move()` calls `raysMove(id, u)` after `A.flow()` (and bullet time's stretch), so every node slides from its preimage
  over the sky's own flowDur, eased as the sky is; the new chord burns in over the same time and lands on its cell. UNDO lays the road
  at once, as the sky does not flow back either.
- **The fall.** An arrival at ∞ (`kind` k `rim`) or the seam (86 ×g → 1, 1 ÷g → 86) collapses the rings into the core over 0.6 s and
  re-blooms them in dlog order over 1.4 s, once a day (localStorage `fold.rays.fall` = the day). With the TUBE up that is a large
  change, so it asks `FX.strobe({dL: 0.12, area: 1})`; refused, or under CALM, it is a 150 ms cross-fade.
- **The TUBE.** `raysFit()` puts it centred between the HUD and the moves, or on a wide screen at the right from under the HUD's
  first row beside its text, whichever is larger; the quest box moves left meanwhile, or the TUBE stops above it. The loop skips
  `A.frame()` while it is up and never in XR (`setAnimationLoop` is the session's loop there); `arrows()` keeps `S.seen` and
  `clockStep()`, split out of it, keeps `G.tick()`, the plate and the lost check. Scene ↔ tube is a whole-screen change: it asks
  `FX.strobe({dL: 0.3, area: 1})` and, refused or under CALM, fades over 600 ms. In XR the TUBE is refused (inset only).
- **Without a pointer.** In the TUBE the arrows give way to a focus ring (←/→ a ray round the ring, the short ring has 4; ↑/↓ a ring,
  SEED inside the core and ∞ past the rim; on the TABLE a column and a row), announced in a polite live region; Enter opens
  `showCell`, which also answers the quest. `#rays` and `#tubec` are role=img with an aria-label that `paint()` refills (you, the target,
  home: cell, word, ray, ring).
- **The ledger (game.js).** At each close `ledger()` counts the road's arrivals by ray and keeps the best `zeros(hash32(day, cell,
  offset))` by ray in `S.rays[12]` and `S.bits[12]`, read from `S.road`, so UNDO cannot inflate them; `S.roads[L − 1]` keeps the
  closed road as `[start, one character a move, offset]` (g G f i q r x, the keys) for the replay; all three are saved and restored.
  `G.roadsOf(a, b)` hands levels a … b back as `{level, start, ops, salt}` for `tally()` and `replay()`.

## Numbers

- Day 9422, SCRIBE, by the spec roads (check.js): 339 arrivals, one at ∞; by ray R0–R11 31 34 23 24 25 24 16 32 36 20 30 43; best bits
  4 7 5 5 3 6 3 4 4 9 5 8; the sparkline ▆▇▅▅▅▅▃▆▇▄▆█ (⌈8v/max⌉, at least ▁); rays touched a chapter 12 11 12 11 11 12 12 12, so
  'full wheel' would be no badge. game.js's own count on today's plan, with a move taken back by UNDO on every level, equals
  `tally(G.roadsOf(1, 64))`, and a reload keeps it.
- Cost, *SwiftShader* in this container (headless Chromium, 1280 × 720 unless said): the inset's own frame 0.2–0.55 ms of CPU; the TUBE
  0.36–1.0 ms (435 px), and with the 3D frame skipped the page runs at the display's 16.7 ms. With the inset on against off, the
  rAF interval was 79.4 against 78.3 ms (four alternations of 2.5 s), the difference inside the noise of a 3D frame that this busy
  container renders in 50–117 ms. `tiny` (SwiftShader matches) draws the inset at most every 30 ms. Nothing measured on a Pi, an
  RK3588 or a phone.
- Draw calls 0 (it is 2D canvas); three W × W offscreen canvases a chart (base, dots, tube): 132 px × dpr 2 → 3 × 70 kB for the inset.

## Left out, and why

- **material.js `twelve_rays`** (scope T1 Changes): material.js is generated by gen_material.py from the tablet, which is not in the
  repository, and the page never reads FOLD_MATERIAL; the chart computes its layout from field.js and check.js asserts the scope's
  figures instead.
- **62 marked** as the sketch's one marked element: the owner's instruction; nothing names it.
- **The miners (T2), AMBER (T3), the boot (T5)** are other items; the chart's energy, flares and `SHARE` are the hooks they need. The
  seal's amber and found-first counts wait for them.
- **The MATRIX skin's status strip** (the header in chapters 4–5) waits for U1.
- **The undo flow.** UNDO does not slide the nodes back, as the sky does not.
