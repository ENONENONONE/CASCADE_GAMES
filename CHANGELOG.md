# Changelog

THE FOLD's releases, newest first. A release is a bump of `CACHE` in `cascade_ar/sw.js`: that is what makes a phone that has the
game fetch the new files, so every change to anything under `cascade_ar/` bumps it and gets an entry here, under that version.
Changes outside the game (the tools, the deploy kit, the docs) go under the version current at the time. The corpus check
(`node cascade_ar/parts/corpus/check.js`) fails when the newest entry here does not name the `CACHE` in `sw.js`.

Scope keys (H1, R1, M2 …) refer to the entries in `scope.md`.

## fold-v22 · 2026-10-26

- **THE LEDGER**, `parts/ledger` and `deploy/ledger`: the public board of the day's seals and the wall of notes, the first thing in the
  game that leaves the device, and only on POST. A sidebar (LEDGER on the start screen, in the row, key l, and on the seal card):
  the day's seals ranked by stars then levels closed, each with its **glyph sequence**, the 64 targets closed in the field's
  alphabet as an 8 × 8 block a chapter a row, `··` where a level was not closed, its seal and its line, a note if it carries one;
  the week's wall of notes; POST THE DAY and POST A NOTE. A day is verified, not claimed: the service replays the roads it is sent
  through game.js and keeps what the engine finds (the page's stars can only lower a level); a name's day is replaced by a later
  post as good or better. The service is one file of node with an append-only JSONL store, behind Caddy at `/ledger` on the same
  origin; `install.sh` sets it up as `fold-ledger`, `deploy.sh` restarts it; locally it serves the game with the ledger at :8257.
- `fold_cli.js`: `ledger` reads the day's board with every seal's glyph block; `post NAME ROADS --league thinking` puts a day on it
  (the site verifies), `post NAME --msg` a note; `--site` for a local service.
- Keys typed into the ledger's boxes no longer move the field.

## fold-v21 · 2026-10-26

- **For agents**: `robots.txt` and `llms.txt` at the site's root, the rulebook in text: the field, the seven letters of a road, the
  ten rules, the scoring, how a machine plays and the two leagues, THINKING (the rules and your own reasoning, no solver) and
  SCRIPTED. The corpus check holds `llms.txt` to the rules' names and tells and to a pinned level (day 9384, TORAH, level 1), so it
  cannot drift; the Caddyfile serves both files fresh.
- `fold_cli.js` at the repository's root: the game without the page, through the real engine. `plan` the day's 64 levels as text,
  `level` one in full with where each move lands, `play` a road (the steps, the outcome, the page's own share line), `day` a roads
  file as the day with its seal and share line, `vs` two days level by level (roads files, `day --json` files or the page's saved
  run), `solve`, `cell`, `table`, `rules`, `check`. Any day by `--day` or `--date`; `--json` for a machine. `node fold_cli.js check`
  joins the check suites and the deploy workflow.

## fold-v20 · 2026-10-19

- **VR**, `parts/vr`: the field in a headset through WebXR immersive-vr (SteamVR through Chrome or Edge on Windows, Quest's browser).
  The console at the belt with the HUD, the effort bar and every button; the page's cards and a tapped cell's panel at arm's length;
  the rays and trace insets beside the console; controller rays with the trigger to point (a card button, a console button, a cell of
  the sky), the squeeze for UNDO and the thumbstick as a radial menu of the six moves. The rig stands 2.4 m down so the relief and
  the heat lie on the real floor. A VR button joins AR after ENTER where the browser supports it. A flat preview of the same objects
  for a look and the headless test.
- **The camera asks only on a handheld.** A desk with a webcam no longer gets a camera prompt on ENTER: the room behind the field is
  asked for on a coarse pointer, touch or an answered gyro, or with `fold.prefs {camera: 'on'}`; `{camera: 'off'}` never asks.
- The effort bar's segments are built as data (`effortSegs`) and drawn by the HUD and the VR console alike.

## fold-v19 · 2026-10-19

- **Sisyphean Heat (H1–H3)**, `parts/heat`: the crowd on the chapter's floor, thousands of climbers in typed arrays running up the
  sheet multiplied by m = current/target and falling where 256 wraps to 0, only their heat drawn on a carpet over the relief; the
  white climber, your own climb on the floor, a stroke a move; the day's heat on the seal (the crowd's ground from each close, the
  day's climbs, the crown, the counters), saved by a tap and sent by SHARE with the text. Key h, `fold.prefs {heat, heatTier}`.
- **The floor re-forms by the ratio (R1)**: every move refills the chapter's floor with t = dlog m, through one limiter of three
  re-forms a second shared with the crowd. SEED flattens the hill; ∞ freezes the crowd.
- game.js records every level's outcome in `S.climbs` (start, close, par, ops, free moves, distances, stars or lost or reborn,
  undos), saved with the day; UNDO is counted.
- Deploy kit for Vita at https://start.cascade.training: `deploy/Caddyfile` (and an nginx alternative), `install.sh`, `deploy.sh`,
  and `.github/workflows/deploy.yml`, which runs every check suite on each push to main and then deploys over ssh when the VITA
  secrets exist.
- README: the heat's description, two screenshots and the live URL; this changelog.

## fold-v18 · 2026-10-18

- GLOW draws the scene at the screen's own resolution and only the light at a quarter, with no sharpen at scale 1 and a colour split
  of at most 1 px, so the picture lost its pixelated look; the README screenshots are true-colour.

## fold-v17 · 2026-10-18

- TRACE's light is GLOW's third shaft: the tracer's brightest direction, as a cell on the screen, in the light's own colour, by its
  energy, eased between moves; three lights of 16 samples keep the pass under 6 ms.

## fold-v16 · 2026-10-18

- **GLOW**, `parts/glow`: bloom in each source's own colour, golden god rays from the eye's ring and the floor's spokes, glitter, a
  colour split and a cyberpunk grade over the same palette, one post pass; full, bloom-only and off tiers; key b.
- **TRACE**, `parts/trace`: the field's own ray tracer in GF(257), 256 rays from your cell along THE TURN's directions, hits by the
  character, bounces by Γ or Snell, the light laid on a 16 × 16 tile through the Airy beam; five laws cycled by x; key z.

## fold-v15 · 2026-10-18

- The rain bends round the eye with the sky, and its code is written in the field's alphabet: each column carries its cell's glyph
  pair and its dlog in eight gold bits among the digits.

## fold-v14 · 2026-10-18 — Phase 2

- **The π rain (M1, M2)**: the tape as 256 columns of 78 digits behind the cells, the rule's pattern in the drops; each level reads
  out of the rain and closes back into glyphs; the seal counts the windows decoded.
- **The eye as a black hole (S1, S4)**, `parts/well`: 137's shadow in its gold photon ring, the sky, the cells and the lines lensed
  round it by an Einstein radius that reads your moves to the eye; level 56 crosses to ∞ and is reborn from 1.
- **THE BARDO (V3)**, `parts/void`: a loss flies the ten discs and offers AGAIN or REBIRTH, a second life from 80 that cannot be
  lost and closes at ★.
- **Twelve Rays (T1, T4)**, `parts/rays`: the field flat as an inset, the TUBE in which the day plays in 2D, the TABLE face, and each
  chapter's ledger of roads as chords over the R0–R11 bars; keys m and t.
- Answered quests stay answered by chapter when a data update moves them mid-day.
- README with screenshots.

## fold-v12 · 2026-10-18 — Phase 1

- **HALT and the close (R5, S3, M4)**: the zone plate as HALT's floor going dark ring by ring, the clock slowed near the eye in
  proper time, the closing move in bullet time by its stars, the effort bar under the target (H2's HUD half).
- **The relief (R1, R2)**: a conic sheet a chapter as the floor, THE TURN's orbit joined in dlog order, the relief stepped on UNDO.
- **CALM and the flash gate (U3)**: reduced motion read in JS and every large flash passed through one gate, three a second at most.
- **HINT** walks the plan's road, the first of a level free, each one after capping it at ★★; the seal is the product of the cells
  actually closed.
- The tablet's two name-words kept out of the data; G16, the flip's tell and errata fixed.
- The enhancement scope (`scope.md`) and the owner's decisions on its eight open questions.

## fold-v11 · 2026-10-18

- A cell's panel lists its own mirror pairs first, then the pairs that hold back from other cells; review fixes.

## fold-v10 · 2026-10-18

- Mirror pairs shown from both cells; the data generators fit to the game in this repository (child-or-sibling detection).

## fold-v9 · 2026-10-17

- THE FOLD as uploaded: the field round the player, the six moves, the daily plan of 64 levels, the doors, the ladders, the mirrors,
  the eye, the seal; `build_data.py` and `gen_material.py` with their bugs fixed.
