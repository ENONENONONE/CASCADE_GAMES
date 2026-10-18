# THE FOLD · void — notes

`void.js` defines `window.FOLD_VOID`, how the player travels (scope: Enter the Void, V1–V4). Today it holds THE BARDO (V3); V1's
earned-INV lift, V2's corridor and V4's title cards are not built. `demo.html` plays the bardo on its own over day 9422's lost level 8
(open it over http); the node test is THE BARDO in `parts/levels/test.js`, since the second life is game.js's.

## THE BARDO (V3)

A loss (SYNC over par, HALT at zero) plays three beats on the lose sound's own clock (sound.js `lose()`: a 1.0 s slide, the thump at
+1.0 s, the drone back from +2.5 s), then the card:

| time | beat | what moves |
|---|---|---|
| 0–1.0 s | death | the cells' halo 1 → 0.35 (`AR.dim`), the lost road falls 1.2 m in descent orange #ff6a2a (`AR.fall`), the view lifts out of the body (`AR.lift`) |
| 1.0–2.5 s | the tunnel | the ten discs, dlog 246 … 255 on rays 6 … 3, flown as ten thin rings (`AR.tunnel`), 6.7 a second; each label at its ray's hour |
| 2.36 s | I AM | the white disc of 1 as the tenth ring passes, the cycle closed at dlog 256 ≡ 0: the one gated flash (`FX.strobe`, dL 0.9 on 44 vmin) |
| 2.5 s | the card | 'REBIRTH · 80' with cell 80's voice, the ten discs and their full words (the atlas cuts four), AGAIN and REBIRTH |

A tap, Enter or Esc skips to the card. The flight plays once a level (this page); a second loss of it, CALM and the room go straight to
the card with the field dimmed and the ten discs lit on it as a row of glyphs. The lift is V1's (2.4 m up, 3 m back, pitched
atan(2.4/3) = 38.66° down, 0.8 s each way): only in drag mode with the camera off, never under gyro, CALM or XR, and held by
`localStorage 'fold.void' = 'off'` until U3's settings sheet has its LIFT switch. V1's body marker is not built.

The doors (game.js, behind `FLAGS.rebirth`, decision 4):
- AGAIN: `G.reset()`, the level from its own start, three stars open, its loss rule kept.
- REBIRTH: `G.rebirth()`, the same target, rule, free moves and slack from 80 REBIRTH, par from 80 (`G.parFrom(80)`). It cannot be
  lost: `S.strict` and `S.clock` are off (M7's HALT-cell stop is not built, so there is none to turn off). It closes at ★ whatever the
  count and pushes the level onto `S.rebirths`; the close counts in closed, the line, `S.targets` and the seal. Hidden where the target
  is 80 or par from 80 is 0 (`G.canRebirth()`). The rule pill reads 'REBORN · SYNC · no loss · ★'; a reborn HALT level keeps its zone
  plate, dark; the first move is flashed on its button; the previous life stays as `AR.A.ghostLine`, orange at 0.35.
- A reload in the second life comes back in it (`save()` keeps `reborn`, `rebirths`, `ghost`); the seal card says 'reborn N'.

## The tunnel builder

`AR.tunnel(cells, {gold, labels, angles, gap, radius, alpha})` is the one tunnel builder (V2 reuses it): one camera-attached indexed
LineSegments of every ring (64 segments each) and one instanced billboard of their atlas slots, two draw calls, both advanced by the
`corridorT` uniform 0 → 1 (`run(t)`); ring k passes the eye at t = (k + 1)/(n + 1). Ring opacity is capped at 0.5 and fades in from
5 gaps out and out inside 0.62 m. 10 × 64 vertices, 10 instances. GLSL ES 1.00, no loop, no derivative, no uniform-array index.

## Numbers

Today (day 9422) 9 losable levels: SYNC 8, 14, 28, 54; HALT 21, 22, 29, 41, 61. With all nine reborn SCRIBE seals 227 LAMB OF GOD and
TORAH 36 IMAM as on their own-start days, with the same line, at 174 stars against 192. Over the 100 days from 9422, 946 losable levels
(509 SYNC, 437 HALT, none SHIFT, none with target 80), all offered REBIRTH; par from 80 worst 6, mean 3.89 against 3.88.
