# THE FOLD — enhancement scope (2026-10-18)

THE FOLD has one field, and this scope treats the four looks the owner asked for as four ways of seeing it, not four skins: the floor, the rain and the eye share one scene, the travel moves through it, and U1's skins change only the HUD and the CRT with the chapter.

- **The ground is the relief.** Each chapter stands on one of the six conics mod 257, drawn as a height field with hue = dlog (A1, A4). Every move is the relief's own time step v → v·g^t, so the floor re-forms under a player who never moves.
- **The code is the π tape.** Each tape level's start, target and rule (56 of the day's 64) are read from it (levels.js:87–98). 19968 of its 20001 digits rain down 256 columns, 78 digits to a column, one column per dlog tick, and every cell is written in its two G16 glyphs. The Matrix here is not a filter laid over the world. It is the world's source, shown.
- **The void is how the player travels.** The field flows past a player who stays still (ar.js:201–205). The view leaves the body only when the field earns it: a move on a shortest road, a loss, or the crossing. It travels through tunnels whose rings are real cells: the eight halvings that make up a fold, and the ten discs just before the cycle closes.
- **The singularity is where every road can end.** Γ sends 137 to ∞ at the zenith, and ∞ to 1 (field.js:15). Every sheet also has a small horizon of its own, where 256 wraps to 0. That wrap is the cliff the climbers of Sisyphean Heat fall from, and ∞ is the rim (depth 22) the port adds to the Twelve Rays disc.
- **The two uploaded pieces are two readings of that world, not a fifth look.** Twelve Rays is the field's code drawn flat: spoke = dlog mod 12, ring = dlog div 12, SEED at the centre and ∞ at the rim. It is the map of where you stand and where each move goes (T1), the day's miners and proof-of-work cells (T2, T3) and each chapter's ledger (T4). Sisyphean Heat is the ground's effort: its climbers run up the chapter's sheet, multiplied by your cell, and fall at the wrap (H1); your own climb is the effort bar and the white climber (H2); the day's heat is the seal's picture (H3). Each is ported into one module, not loaded: a p5 canvas cannot anchor to a turning device or an XR room.

One rule holds for every effect below: anything that moves on screen is a computation the player can name.

**At a glance.** The proposals that carry the scope, in build order:
- **F1, F5 · what players see broken today.** 31 cells show a lone surrogate for a glyph; HINT gives a 38-move road in a toast cut off mid-line. Phase 1.
- **U3 · CALM and the flash gate.** prefers-reduced-motion read in JS, at most 3 large luminance changes a second through one gate, a CVD palette. Phase 1 for the gate, Phase 3 for the sheet.
- **R5, S3, M4 · HALT and the close.** HALT's thirty seconds as the zone plate going dark ring by ring, the clock slowing near the eye, the closing move in bullet time, slowed by its stars. Phase 1.
- **R1, R2 · the ground is the chapter's conic.** A sheet a chapter; every move re-forms it by c = current/target, a close lands the target's ring on yours, and FOLD lands as a rigid turn of the floor. Phases 1–2.
- **M1, M2 · the tape sky.** 19968 π digits as 256 rain columns that show the rule and the state; each level reads out of the rain and closes back into glyphs. Phase 2.
- **V3 · THE BARDO.** A loss flies the ten discs before the cycle closes and offers a second life from 80 REBIRTH. Phase 2.
- **S1, S4 · the eye as a black hole, and the crossing.** 137 lenses the sky with an Einstein radius that reads your moves to the eye; level 56 falls through ∞ and is reborn at I AM. Phase 2.
- **T1, T4 · Twelve Rays as the chart.** A HUD inset and a full-screen TUBE in which the whole day can be played in 2D; each chapter's roads replayed as chords and counted in the sketch's ray bars. Phase 2.
- **H1, H2, H3 · Sisyphean Heat as the ground's effort.** The crowd climbs the chapter's sheet and falls at the wrap; the effort bar and the white climber; the day's heat as the seal's picture. Phases 1–2.
- **T3, M6 · two side goals read from the code.** AMBER, each level's proof-of-work cells as an optional second goal; THE AUTOPILOT, the tape running a closed cell through its opcodes while the player bets where it halts. Phase 3.
- **Q1, Q3 · THE BOOK and the tier ladder.** A record that survives midnight, and a picture for every reward from a shortest-road move to a perfect day. Phase 3.

The ask, item by item: conic relief R1–R7; Enter the Void V1–V4; Matrix M1–M7; singularity S1–S5; Twelve Rays T1–T5; Sisyphean Heat H1–H3; challenges Q1–Q6 with T3, R3, S5 and M6; rewarding visuals Q3's ladder and every entry's *Gets*; UI elements U1–U6; fixes found on the way F1–F15; enrichments from material.md in every *Refs*.

**What this builds on.**
- relief.js is loaded (index.html:131) and the norm floor is on by default (index.html:187–188). It is never stepped: monStep (index.html:201) steps only THE TURN and the ceiling, by move count, not by the player's cell.
- fx.js's sky, CRT and Γ warp are mounted (index.html:167–171).
- Every move is animated from its preimage in 0.5, 0.8 or 1.1 s (ar.js:87–89, :201–205).
- The bloom births the cells along the cycle from SEED (ar.js:163–168).
- The π ribbon shows 48 tape digits (ar.js:133, :207–215).
- The eye level, 137 → ∞ → 1, closes THE EYE (levels.js:26, :145–151).
- material.js is loaded (index.html:132), but the page never reads FOLD_MATERIAL.
- S.tabletDay and S.dayCell are computed but never used (game.js:49).
- Progress is kept per day only (game.js:23–25).
- Neither uploaded sketch is in the game, and the game has no p5.

**Sources and conventions.**
- Every number comes from the code (file:line) or material.md, or was computed on 2026-10-18 with node 22 or python3 against field.js, levels.js, data.js and material.js. Unless another name is given, the day is 9422 and the name is SCRIBE. The scratch scripts that produced them are not in the repository; the computed figures can be redone from the files, day and name given here.
- Figures marked *SwiftShader* were measured in headless Chromium 1194 on 4 cores, which is the GPU class index.html:166 calls `tiny`. Nothing was measured on a phone, a Pi 4 or an RK3588.
- Values I chose are marked *(design)*. New functions, keys and files are marked *new*.
- Cells 44 and 62 are named by their other words (material.md:10–12).
- The three checks pass on the code as it stands: corpus 657, levels 2555, story 1449.
- Effort: S is a day or less, M is 2–5 days, L is 1–3 weeks.

---

## Visual direction

### Conic relief: the ground

**R1 · THE TIDE: the floor is the relief's time step, and two water lines meet on arrival.** *M*
- *Sees.* The chapter's sheet (R2) re-forms on every move as v → v·g^t, with t = dlog(current) − dlog(target) (valueAt relief.js:47, setT :103).
  - ×g re-forms it and turns the hue by 1.406° (A4).
  - FOLD turns it over (h → −h + 0.0047 m at the floor's amplitude of 0.6, relief.js:117) and turns the hue by 180°.
  - ×i turns the hue by 270°.

  Heights and colours ease over the move's flow (0.5, 0.8 or 1.1 s; ar.js:204). Two rings of exact points ride on the floor:
  - *Yours* is where the tide-floor shows your cell. That is always the set {V = target} of the plain sheet, so it stays still for the whole level. Under SHIFT it does not: the target steps ×g after every move (game.js:73), and the ring steps with it (today levels 6, 7, 16, 45, 47).
  - *The target's* is {V = target²/current}, and it moves with every move.

  A pill reading 'floor ×c' gives c = current/target as a balanced residue. On SEED the floor lies flat and black: every sample sits at value 0, which is y = −3.0, 0.6 m below its rest plane. On ∞ the floor fades out.
- *Does.* Plays the six moves and the flip as now. UNDO runs the tide back; today UNDO and the u key skip the relief entirely (index.html:177, :312).
- *Gets.* On the closing move c = 1. The floor settles into the plain sheet, the target's ring lands on yours, and that one contour brightens outward from the feet in a single 0.6 s ease *(design)*: white-gold at 3★, gold at 2★, dim at 1★ (S.stars, game.js:76). Once moves pass par + slack, the target's ring dims: the tide is going out.
- *Builds on.* monFloor builds the norm once and never steps it (index.html:188); monStep (index.html:201); pointAt (relief.js:102); solve (relief.js:135), except on the parabola: solve's 'parabola' is y − x² (CONIC_FORMS, relief.js:42), not the sheet's y² − 4x (relief.js:40), so that floor's rings come from levels(form).
- *Changes.*
  - relief.js makeSheet:
    - setRatio(r) *new*: setT(dlog r), a flat fill at r = 0, hidden at ∞.
    - A kept copy of heights and colours, and group.lerp(e) *new*, which moves y on a floor and moves along nrm on a wall.
  - FOLD_RELIEF.levels(form) *new*: the 66049 lattice points bucketed by value, built once per chapter. That is one conic's build, 1.6 ms (relief notes:25).
  - FOLD_RELIEF.contour(sheet, r) *new*: Points refilled in place, with heights eased by the same e.
  - index.html:
    - relStep(S) *new* replaces monStep. It is called from move() (:227), UNDO (:177), u (:312) and openLevel (:267).
    - The ratio's base is 1 whenever the target is not in 1..256. Over the 100 days from 9422, 32 tape levels have target 0.
    - e is ar.js:232's f = (now − flowT0)/flowDur, eased by the cells' own smoothstep t²(3 − 2t) (ar.js:88), so the floor and the sky land together. Read A.A.flowT0 and A.A.flowDur in the loop (:349). UNDO starts no flow (index.html:177, :312), so relStep gives UNDO its own 0.5 s clock *(design)*, or the tide snaps back.
    - The pill goes in paint() (:210).
- *Numbers.*
  - Level-set sizes: 258 points on the norm (1 at r = 0); 256 on product, hyperbola, circle and ellipse, but 513 at r = 0, so ring buffers must hold 513; 257 on the parabola for every r.
  - Vertices: 16646 + 2 × 513 = 17672.
  - The lerp uploads 199692 B per attribute per frame, only during a flow.
  - The busy gate (index.html:229) allows at most 2.2 re-forms a second.
- *Refs* A1, A4, A7; relief notes "Three ways" #1 (notes.md:67–70).
- *Technique.* The relief's own time step, exact-position level-set Points, and a CPU ease of the PointsMaterial vertex colours. No shader of our own.
- *Risks.*
  - After ×i or Γ the floor reads as moiré. The rings and the pill carry the meaning, and a 'still' option keeps the floor fixed and moves only the rings.
  - On `tiny`, ease every second frame.
  - In XR and under CALM (U3), cross-fade instead of easing.

**R2 · A SHEET A CHAPTER, LIT, and FOLD as a gesture of the floor.** *S, then M*
- *Sees.* Each chapter stands on its own conic (A1):

  | chapter | floor |
  |---|---|
  | SUNRISE | the product a·b |
  | THE FOLD | the hyperbola x² − y² |
  | THE QUARTER TURN | the circle x² + y², a zone plate under the feet |
  | THE DOORS | the ellipse x² + 4y² |
  | THE LADDER | the parabola y² − 4x |
  | THE MIRROR | the room (R4) |
  | THE EYE | the norm, whose one zero is the SEED star |
  | THE SEAL | the norm under a norm ceiling (AS ABOVE SO BELOW, 156, story.js:33) |

  The floor is lit by a baked Lambert term computed from the sheet's slopes, with the light at the target's place on the sphere. The bright faces lean toward the target, and the wrap cliffs read as dark edges. Share of floor sample edges that are cliffs: product 24.8 %, hyperbola 25.1 %, circle 25.1 %, ellipse 25.2 %, parabola 14.1 %, norm 24.9 %.

  FOLD becomes a rigid gesture that lands exactly on the folded picture (each symmetry computed over the lattice):
  - Product, hyperbola and norm turn a quarter about the player, because V(b, −a) = −V(a, b).
  - Circle and ellipse turn over about the forward axis, because V(−a, b) = V(a, b).
  - The parabola turns over about the right axis, because V(a, −b) = V(a, b).

  On SEED the player's ring is the null cone, the set of roads out of SEED (A3). That holds on the plain sheet. Under R1's tide the SEED floor lies flat at value 0 and R1's 'yours' is {V = target}, so R1 draws this cone in its place while the player stands on 0:
  - the product's two edges;
  - the hyperbola's diagonals;
  - the circle's 16 + 16 stripes at 86.42° and 3.58° (i = 16);
  - the ellipse's 8 and 32 stripes at 82.87° and 1.79°;
  - the parabola's own curve (257 points);
  - on the norm, only the star at (0, 0).
- *Does.* Plays. On SEED levels the player sees that only INV (0 → ∞) and Γ (0 → 256) leave the cone (field.js:12, :15; B32). Today has 11 SEED-rule levels: 23, 24, 38, 39, 43, 46, 52, 55, 62, 63, 64.
- *Gets.* Eight different pictures a day, and a FOLD the eye can follow. On a close the light swings to the zenith and the floor lights evenly, in one 0.6 s ease *(design)*.
- *Builds on.*
  - FORMS holds all six sheets (relief.js:38–41).
  - sheet(kind, 1, {place: 'floor'}) can already lay any of them on the floor at 65 × 65 (relief.js:233–234): 4225 vertices, 0 to 0.5 m above −2.4, not centred.
  - norm() is hard-wired to 129 × 129 (relief.js:114–119).
  - index.html:188 always builds the norm.
- *Changes.*
  - **S.**
    - levels.js gets CHAPTER_SHEETS *new* = ['product', 'hyperbola', 'circle', 'ellipse', 'parabola', 'room', 'norm', 'norm'], and every spec gets sp.sheet (HALT levels use 'circle', R5; in THE MIRROR the room, with the circle as its floor, R4).
    - test.js asserts that each sp.sheet is in that list.
    - monFloor builds sheet(sp.sheet, 1, {place: 'floor', half: 2}) for the five conics and rebuilds only when the sheet changes. 'norm' keeps norm(), since sheet() would give 65 × 65 with no stars. 'room' keeps the norm until R4, since sheet() throws on a kind outside FORMS (relief.js:227). half: 2 keeps the corners inside the 210-gon's radius 3 (ar.js:137); the default 2.2 puts them at 3.11.
  - **M.**
    - floor(kind, opts) *new* generalises norm() to every FORMS kind at 129 × 129, with stars only on the norm.
    - opts.light multiplies colourOf (relief.js:52) by 0.35 + 0.65·max(0, n·L) *(design)*.
    - Mode by tier: points on `tiny`, wire on `lowEnd`, mesh elsewhere (index.html:166).
    - group.foldGesture(kind) *new* returns {axis, angle}. It is applied to a pivot Object3D at y −2.4 over the 0.8 s flow, followed by setRatio(−r). The pivot is needed because makeSheet bakes o = (0, −2.4, 0) into the positions (relief.js:71–76): a half turn about the eye would swing the floor over the player's head. On the turn-overs a 180° hue cross-fade plays as the gesture lands. The quarter turns need none, since a point of value V lands where the folded picture shows V (V(−b, a) = −V(a, b)).
    - RELIEF (index.html:179) cycles off / chapter floor / floor with its A1 partner as the ceiling (product–hyperbola, circle–ellipse, parabola–norm).
    - FREE WALK has no target, so it lights from the zenith.
    - Index buffers become Uint16 (F11).
- *Refs* A1, A3, A6, A7, A10, B25, B32.
- *Technique.* Height fields with baked per-vertex shading. The gestures are rigid rotations, with no per-vertex cost during the motion. They are exact to one cell: even samples land on odd lattice points, which means a 0.0156 m re-sample at landing.
- *Risks.*
  - Mesh is off on `tiny` and `lowEnd`. The RK3588 is `lowEnd` (its Mali-G610 matches /Mali/, index.html:166), so it gets wire. The unmeasured mesh case is a phone outside the regex (Adreno 6xx/7xx, Apple GPUs): 32768 transparent triangles. Measure them in parts/relief/demo.html.
  - The lit floor may read as noise. On the 129 × 129 floor at amplitude 0.6, only 2.3–5.4 % of sample edges slope at 45° or less (parabola 2.3 %, product 5.4 %), and only 49 % of quads (72 % on the parabola) have no wrap edge. Index only wrap-free quads in mesh mode. Take n·L from a flattened height *(design)*, and check in demo.html that the target's side reads before keeping the term.
  - In XR and under CALM the floor swaps; it never rotates.

**R3 · THE TURN: the level line through every start and every target.** *M*
- *Sees.* A ring at radius 5 round the horizon: x² + y² ≡ 1, drawn in the sky's own order. The point of 3^d sits at the azimuth of 3^d, so neighbours are one ×g apart. Today the ring draws as a star polygon instead (F7).

  Every nonzero cell n has exactly one point on the ring, P(n) = ((n + n⁻¹)/2, (n − n⁻¹)/32). This was checked for all 256 cells: x² + y² ≡ 1 and x + 16y ≡ n. So a green marker stands at P(current) and a gold one at P(target).

  The moves are motions of the ring:
  - ×g: one tick (1.406°); ÷g: one tick back.
  - FOLD: a half turn; ×i: three quarters.
  - INV: the mirror y → −y.
  - Γ and the 6↔9 flip are not motions of the ring; their markers cross as chords.
- *Does.* Plays. A new level kind, 'turn', closes THE QUARTER TURN. Its target walks the orbit: after k moves it is t0·216^k, and its marker jumps 147 ticks (206.72°) per move. The player has to catch it. The level opens on GO or TAPE. TAPE plays its fallback instead, the tape level it stands in front of (today SEED 0 → 181, par 5). THE TURN cannot be lost (no clock, not strict), so TAPE on the opening card is the only way the slot falls back.
- *Gets.*
  - On a close, the arc from P(start) to P(target), in the direction the road went, lights in the orbit's hue and stays lit all day.
  - A pill 'circle n/256' counts the circle points stood on today. SCRIBE's par roads on 9422 stand on 184 of them, 181 counting road moves only.
  - The evening's FREE WALK can light the rest. When all 256 are lit, the ring burns whole on the seal.
  - On desktop only (no gyro, no XR, not CALM), the camera eases round by the arc on a turn close.
- *Builds on.* turn() with step and at (relief.js:187–215); orbit() (relief.js:172); index.html:195; SHIFT's ×3 (game.js:73).
- *Changes.*
  - relief.js turn(): opts.order 'dlog' *new*; place(n) from the closed form *new*; arc(n0, n1, dir) *new*; amplitude 0.25 *(design)*.
  - game.js: S.shiftStep *new* (1 for SHIFT's ×3, 147 for 'turn's ×216) everywhere ×3 is hard-coded:
    - game.js:33 (solveShift's t0·3^k, which :63 and :91 call), :63 (par), :73 (apply), :82 (undo), :91 (hint);
    - levels.js:53 (solveShift's t0·3^k), :73 (par), :79 (base's road);
    - test.js:17–19 and :47.

    save() keeps 'circle' as 64 hex digits *new*.
  - levels.js: EXTRA = {24: 'turn', 47: 'clock', 52: 'other'} *new*, applied by plan(day, name, {extra: true}) (opts.extra *new*) in its own pass after each chapter's sort. THE CLOCK is R5's and THE OTHER SIDE S5's.
    - The sort (levels.js:165–167) is left as it is. A special overlays the tape level plan() sorted into its slot, reads that level's window, takes its offset and window, and keeps the level whole as spec.fallback *new*.
    - EXTRA is not in SPECIAL, so the slot lists (:163) and levels.js:176 are unchanged.
    - Slot 24 is chapter 3's last, so it holds the chapter's highest par; today that is window 22, SEED 0 → 181, par 5. turnSpec(day, name, w) *new* reads the window's own start figures, 3302 ≡ 218 QUANTUM COMPUTER, which SEED sets aside, and its target 7634 ≡ 181 SATOSHI NAKAMOTO.
    - Start and target must be nonzero and distinct, since P(0) does not exist: a figure ≡ 0 slides a digit along the tape, as tapeSpec's target does (levels.js:91). Reading the figures, not the rule, keeps the SEED windows (11 today) off 0. Over the 100 days from 9422 neither slid, though 63 of those days' 6400 windows start on a figure ≡ 0.
    - Today THE TURN is 218 → 181, par 3 (×g Γ FOLD). It carries shift: true for test.js:39.
  - Falling back. Completed means closed, at any stars, a reborn close (V3) included. A special that is not completed plays its fallback at its slot.
    - game.js: S.fell *new* holds the slots that fell back. It is saved as 'fell' and restored by start() with the kept fields (game.js:51).
    - level(L) (game.js:55) takes S.plan[L − 1].fallback when L is in S.fell, so a reload on a fallen slot reopens the fallback.
    - fall() *new* pushes S.level and reruns level(), which clears S.lost, the moves and the clock (game.js:62–64). It refuses once the special is closed (S.done && !S.lost).
    - index.html: a spec with a fallback opens on V4's small slam of spec.title with GO and TAPE *(design)*, in place of the toast (index.html:270). GO arms the level, as the chapter card's GO does (:278); TAPE calls G.fall() and then openLevel().
    - A lost special's card shows TAPE beside AGAIN and REBIRTH (index.html:259, V3). After GO, TAPE comes back only on a loss.
    - The fallback is a plain tape level: AGAIN and REBIRTH on its own loss, no fallback of its own, and stars uncapped, because it is the window's own level, not a second life. The special's keepsakes need the special: this arc, S5's throat, THE CLOCK's rings left (R5). The circle pill counts the fallback's road as it counts every road.
    - S.stars, S.line and S.targets keep one entry per slot, the special's or its fallback's, so V4's shards and the seal (F8) take whichever level closed.
    - Saves: with every special fallen the plan is plan(day, name) itself, so the specials need no run-key version of their own. A run saved before the flag resumes on the same level, or on the special that now stands in its slot.
  - test.js runs check() with and without {extra: true}. Under the flag:
    - :34 reads EXTRA[sp.n] || SPECIAL[sp.n] || 'tape', and :35–48 run on each special and on its fallback; the turn plays by shiftStep 147 (:17–19, :47).
    - For each EXTRA slot, sp.fallback is JSON-equal to plan(day, name)[n − 1], with sp.offset === sp.fallback.offset.
    - The day with every special swapped back is JSON-equal to plan(day, name): no window is dropped and no level moves. That holds on all 100 days from 9422.
    - The curve check (:64) is unchanged: it filters kind 'tape', and both outcomes are sorted.
    - A scratch test.js with these assertions passes on test.js's own days and names plus SCRIBE on 9422, with 0 failed.
- *Numbers.*
  - c = 155 ≡ 4/5, s = 52 ≡ 3/5, u = 216, dlog 216 = 147 (B1); 147⁻¹ ≡ 155 (mod 256).
  - Turn-level pars over 22016 (start, t0) pairs with start 1..256 (turnSpec's nonzero start), t0 = 1, 4, …, 256 and k ≥ 1: par 1: 512, 2: 1946, 3: 5467, 4: 9712, 5: 4273, 6: 106. Mean 3.71; every pair is solvable. SHIFT ×3 on the same pairs has mean 3.95, max 7.
  - The ring is 515 vertices (relief notes:16).
  - Over the 100 days from 9422 (SCRIBE), THE TURN's par: 1: 6, 3: 29, 4: 47, 5: 18 (mean 3.71). The level it holds: SEED 62, SYNC 25, HALT 7, NOP 6; par 4: 9, 5: 42, 6: 49 (mean 5.40). 32 of those are losable.
- *Refs* B1, A4, B32; relief notes "Three ways" #2.
- *Risks.* Three circles sit near the horizon: ar.js:144's horizon at 6, the door conic at 4.5, and this ring at 5. Dim the horizon line while the ring stands.

**R4 · THE ROOM: six conic panels in THE MIRROR, and FOLD swaps the walls.** *M*
- *Sees.* In levels 41–48 the player stands among six relief panels:
  - floor: the norm; ceiling: the parabola;
  - four walls at distance 5: product in front, hyperbola behind, circle on the left, ellipse on the right.

  A1's discriminant pairs face each other (A6). The walls use sheet()'s defaults (half-side 2.2), so together they span about 190° of the horizon and their corners reach radius 6.14, just outside the cells. It is a room of panels, not a closed cube.

  The room's yaw follows your cell: 2π·dlog/256, the azimuth ar.js:33 gives a cell. ×g turns it one tick; FOLD turns it half round, so opposite walls change places; ×i turns it three quarters; INV turns it to −θ. Every panel takes R1's tide, and the target's level line is drawn on all six.
- *Does.* Plays the chapter's two mirror levels (44 and 48, levels.js:26) with the 6↔9 flip open (game.js:60). Reads which wall faced the target when the level opened: the nearest wall centre, ⌊((dlog t − dlog s + 32) mod 256)/64⌋ (wall k is centred at 64k ticks and spans ±23.75°). Today that is 0, 2, –, 1, 0, –, 2, 0 for levels 41–48 (43 and 46 start on SEED); the offsets are 1, 159, –, 36, 19, –, 116, 240 ticks.
- *Gets.* On a close the target's six contours light together: 256 points on each wall, 258 on the floor, 257 on the ceiling. Closing a level on each of the four walls lights the whole room for the chapter outro (index.html:253). Today no level faces wall 3 (left), so the room cannot light whole. The wall bits are kept (Q1).
- *Builds on.* sheet() already places walls, ceilings and floors (relief.js:226–241). The game uses only the product ceiling (index.html:196).
- *Changes.*
  - relief.js room(opts) *new* returns {floor, ceiling, walls[4], setYaw, setRatio, contour}.
  - sheet() takes opts.n and opts.step *new* (today 65 and 4 are hard-coded at relief.js:238), giving 33 × 33 walls on `lowEnd`.
  - CHAPTER_SHEETS[5] = 'room'. On a rule-9 level room() takes {floor: 'circle', left: 'norm'} *new* (R5).
  - relStep eases the yaw over the flow.
- *Numbers.*
  - Floor 16646 + five panels at 5 × 4225 = 37771 vertices; contours 4 × 256 + 257 + 258 = 1539. R1's lerp on all six panels uploads 37766 × 12 = 453192 B per attribute per frame during a flow, 2.3 times the floor alone.
  - With your ring drawn on the floor only, the total is 39568, under the 40k budget (relief notes:21).
  - A target of 0 would draw four 513-point null cones on the walls and reach 40339 with your ring (40081 without), so thin them.
  - `lowEnd` (33 × 33 panels): 22091 vertices, 23888 with the rings. `tiny` (floor and ceiling only): 20871 with a 65 × 65 ceiling, 21644 with the rings. tiny is inside lowEnd (index.html:166), so under the 33 × 33 rule it is 17735, 18508 with the rings.
- *Refs* A6, A1.
- *Risks.*
  - There is no budget left in this chapter for THE TURN or the crowd's 3584 tier.
  - Panels 4.4 m wide sweeping 180° in 0.8 s are strong vection. Never rotate in XR or under gyro; cross-fade instead, and swap instantly under CALM.
  - HALT levels stand in the room on R5's plate. That is THE CLOCK at 47 every day, plus any HALT tape level of the chapter (today 41).
    - The circle floor (16641, R2's floor(kind)) and five panels come to 16641 + 5 × 4225 = 37766 vertices.
    - With the six contours (1539) and the plate's ten rings (640), that is 39945, 55 under the 40k.
    - Your ring is left out, since it would make 40201: on the plate the floor's only rings are the clock's ten.

**R5 · THE ZONE-PLATE CLOCK: HALT's thirty seconds as the circle's rings going dark.** *S*
- *Sees.* On a HALT level (30 s, game.js:18) the floor is the circle sheet, a zone plate under the player. Because (128 + e)² ≡ 193 + e(e − 1), the value is 128.5 + ρ² about the middle, and the terraces break at ρ_k = √(257k − 128.5) cells. The ten innermost terraces are the clock:
  - every 3 s the outermost remaining terrace fades out, so the plate contracts toward the feet;
  - the last disc goes at 30 s.

  This is A2's hook read from the outside in. The red seconds stay (index.html:324). The rain (M1) freezes column by column outward from the head's column, at 256/30 = 8.53 columns a second. It does so in every skin, because it is M1's HALT pattern (M1's rain table), not a MATRIX ornament. Skins follow the chapter (U1), and MATRIX's chapters 4–5 hold only 121 of the 437 HALT levels over the 100 days from 9422 (RELIEF 253, VOID 39, SINGULARITY 24). Today's level 41, THE MIRROR's HALT level, plays in VOID. With S3, the rings count proper time.
- *Does.* Plays the HALT level against the shrinking plate. On a HALT day (M7) it plays around the HALT cells too: a halt ends the level at once, whatever the clock reads, and par is the HALT-aware one; the thirty seconds stay thirty. At stride 1, on 2026-11-08 (day 9443), the HALT level 131 SUPERNOVA → 97 POSEIDON (window 27) goes from par 4 to 5, and the par order moves it from level 27 to 29: the plain road FOLD ÷g Γ ×i would halt on 42 MIT at its second move, and ×i ÷g Γ ÷g ÷g closes. THE MIRROR has one every day, THE CLOCK at 47 (below).
- *Gets.* Close in time and the surviving rings flare once outward, then stay lit until the next level; the card reads 'closed with N rings left'. A lost level dims the floor and goes to the bardo (V3). A halt on a HALT day (M7) is a loss too: the plate freezes with the rings it has left, the floor dims, and the card adds 'N rings left' to M7's 'HALT · stopped on …'.
- *Builds on.* tick() and the clock text (game.js:85, index.html:324); snd.clock (sound.js:253–259). The relief notes' "Three ways" #3 proposes THE TURN as the dial, but it is not wired.
- *Changes.*
  - relief.js makeSheet takes opts.order 'radius' *new*: the vertices are sorted once by ρ.
  - group.setRadius(ρ) *new* sets setDrawRange. That works in points mode; wire and mesh need a radius-sorted index buffer.
  - The outgoing ring's colours are dimmed over its 3 s with updateRange, then cut.
  - levels.js sets sp.sheet = 'circle' when sp.rule === 9. In THE MIRROR, once R4's room stands, sp.sheet stays 'room': room() lays the circle as the floor and moves the norm to the circle's wall (R4). The plate stays under the feet, and the room keeps its six conics. R1's tide is held on HALT levels.
  - THE CLOCK *new*, THE MIRROR's HALT showcase: EXTRA[47] = 'clock', under R3's flag and rule, so it lands in Phase 3 with R3.
    - It overlays the tape level plan() sorted into 47, the chapter's last tape slot, and keeps it as spec.fallback.
    - It reads that level's window under HALT: tapeSpec(day, name, w, 9), where tapeSpec gains an optional forced digit *new*. The flip is open.
    - Its title and text are its own: tapeSpec's text would read 'π[9595] = 9 HALT' where the tape has 4 SHIFT (levels.js:95).
    - Today it reads window 41: 4389 ≡ 20 APC → 3415 ≡ 74 CROSS, par 5 (×i 6↔9 ×g ×g INV), standing in front of SHIFT 20 → 74, par 5.
    - A lost CLOCK offers AGAIN, REBIRTH (V3) and TAPE, and TAPE plays the fallback (R3). Where the level it holds is itself HALT, the two are one level, and TAPE is hidden *(design)*.
    - THE CLOCK is rule 9 to every check that reads it: this plate, S3's clock, V3's rebirth and B22's cells.
  - This needs R2's floor(kind). On today's 65 × 65 sheet (step 4) the central disc is 2.8 samples in radius and terraces 5–10 are one sample wide or less. Even at 129 × 129 (step 2) terraces 5–10 are 1.3–2.0 samples wide. Beyond ρ ≈ 31 cells the radial step 4ρ + 4 passes 128, so the sampled values alias into moiré. Draw the ten edges as LineLoops at ρ_k (10 × 64 = 640 vertices *(design)*), so each fade has a visible edge.
- *Numbers.*
  - Radii: 11.34, 19.63, 25.35, 29.99, 34.01, 37.60, 40.87, 43.90, 46.74, 49.41 cells. One cell is 4/256 = 0.015625 m, so the rings run from 0.177 to 0.772 m.
  - HALT levels today: 21, 22, 29, 41, 61. Over 100 days: 4.37 a day. On the 7 HALT days among those 100 at stride 1 (M7), 38 HALT levels carry both rules, and par rises by one on 5 of them (days 9443 and 9451 level 29, 9498 level 16, 9502 level 8, 9503 level 16). On Q2's fresh road its 10 HALT days hold 77, and par rises on 7: by one on 6, by three on 1.
    - With every special closed it is 5.15: THE CLOCK adds 100, and the three specials stand in front of 22 HALT levels (7 at 24, 11 at 47, 4 at 52).
    - With every special fallen it is 4.37 again.
    - Losable levels (V3) go from 946 to 971 with every special closed.
  - THE CLOCK over those days (SCRIBE):
    - par 2: 1, 3: 2, 4: 62, 5: 35 (mean 4.31);
    - it never slides and never starts on a HALT cell;
    - on 11 days the level it holds is itself HALT, so TAPE is hidden;
    - routed around B22's 27 HALT cells, its par road needs one move more on 22 days, and none is cut off;
    - REBIRTH's par from 80 is 2–5, mean 3.87, the same routed around the HALT cells.

    The levels it holds are SEED 30, SHIFT 27, SYNC 17, HALT 11, NOP 10, STORE 4 and IDENT 1, with par 4: 32, 5: 42, 6: 18, 7: 8 (mean 5.02).
- *Refs* A2.
- *Risks.* One fade every 3 s is far under 3 flashes a second. The centre terrace is 0.18 m in radius (0.35 m across) and 2.4 m below the eye, so pair it with the clock sound.

**R6 · SATURN: THE LADDER's trophy on the horizon.** *S*
- *Sees.* Cell 93 SATURN (S19 + A1 + T20 + U21 + R18 + N14 = 93) stands where ar.js:33 places it: dlog 243, azimuth 341.72°, ray 3, elevation −8.91°, just under the horizon and a little left of forward. In THE LADDER (levels 33–40) a ringed planet rises behind its billboard: 377 Fibonacci points (the sky's lattice) and ten rings at the parabola's ring edges (A2), all unlit at first.
- *Does.* Lights one ring for each chapter level closed at 3★ (8), one for the chapter quest (levels.js:202), and one for tapping Saturn.
- *Gets.*
  - The lit rings are kept for the day (Q1).
  - Tapping the planet opens the cell panel with the gaps, each reduced mod 257 from its four figures: D ring 6690 ≡ 8; Cassini outer edge 1222 ≡ 194 TWELVE APOSTLES; Encke 1336 ≡ 51 NONCE.
- *Changes.*
  - relief.js saturn(opts) *new*: Points plus 10 LineLoops of 64 points *(design)*. Its renderOrder must come before the cell mesh, because billboards are depthWrite false (ar.js:74).
  - monApply mounts it in chapter 5, in a slot of its own (MON.saturn *new*). monApply disposes MON.obj on every level (index.html:190), and the ladder levels 36 and 40 put the hyperbola conic there (:197).
  - material.js gets 'saturn' *new*.
- *Numbers.*
  - A2's ten d values are where the parabola sheet crosses multiples of 257 in column a = 10: (128 + d)² − 40 ≡ 153 + d(d − 1) = 257k gives d_k = (1 + √(1028k − 611))/2 = 10.71, 19.51, 25.36, 30.08, 34.15, 37.77, 41.07, 44.13, 46.98, 49.67.
  - All ten match A2 to 0.1. So do columns 74, 138 and 203, the repeats of −4x every 64.25 columns (A2); no other column matches.
  - Ratios to 10.7: 1.00, 1.82, 2.37, 2.81, 3.19, 3.53, 3.84, 4.12, 4.39, 4.64. A36's "grow as √k" does not hold; √k would give 1.41, 1.73, 2.00.
  - Vertices: 377 + 640 = 1017.
- *Refs* A36, A2, B2.

**R7 · THE CAT MAP: between chapters the floor dissolves by ×φ² and re-forms as the next conic.** *S on R2*
- *Sees.* Under the chapter card (V4) every floor sample steps by Arnold's cat map (a, b) → (a + b, a + 2b) mod 257, which is ×φ² on the plane point a + bφ (B26), two steps a frame.
  - The old sheet scatters into dlog-hue noise. At step 64 *(design)*, inside the noise, the samples take the new sheet's heights and colours.
  - The map has order 258 and its 129th power is −1 (python). Every sheet except the parabola is even, V(−a, −b) = V(a, b), so at step 129 every sample shows the new conic's exact value where it stands, and the samples snap home with the same 0.0156 m re-sample as R2's gestures (−1 sends the even samples to odd lattice points). Into THE LADDER (the parabola) it runs all 258 steps, three a frame, and lands exactly.
  - On the norm the map is a symmetry: N(φ²) = 1, so V(a + b, a + 2b) = V(a, b) at every lattice point. Out of THE MIRROR (its floor is the norm, R4) and out of THE EYE the samples flow along their own level lines, each keeping the norm's true value where it stands.
- *Does.* Watches; a tap skips with the card.
- *Gets.* Five of the seven chapter breaks dissolve and re-form; the other two show what the norm is, a picture ×φ² cannot change.
- *Changes.* relief.js group.cat(k) *new*: positions from kept lattice coordinates (two Uint16Arrays; a step is two adds and two mods a sample), points mode only, wire and mesh hidden while it runs. index.html calls it from chapter() (:274–279).
- *Numbers.* 16641 samples; 129 steps in 65 frames (1.08 s) or 258 in 86 (1.43 s), both before GO at 1500 ms (V4). 199692 B uploaded a frame, as R1's lerp.
- *Refs* B26, A1, A7.
- *Risks.*
  - A floor-wide scatter is a moving pattern for about a second: cross-fade under CALM, in XR and on `tiny`.
  - V4's glass is a full-screen quad over the scene (renderOrder 996), so it draws at alpha 0.5 or less *(design)* while the floor re-forms.

### Enter the Void: the travel

**V1 · OUT OF BODY: an earned INV lifts the view out of the player.** *M*
- *Sees.* When an INV keeps the player on a shortest road, the view rises out of the head while the field flows:
  - on drag or desktop: 2.4 m up and 3 m back, pitched 38.66° down. That is atan(2.4/3), from the floor's depth and the 210-gon's radius (ar.js:137);
  - under gyro: no lift. The ghost plays as in XR below, because the scope never translates the rig under gyro (Budgets and risks, AR comfort; S4 Risks);
  - in XR the room never moves; a ghost of the body rises from the origin instead.

  From up there the player sees the floor (R2), a body marker at the origin (the home cell's glyphs, number and word on one billboard), the sky mirroring, the road line and the target. The view drops back as the flow settles. With the camera on the view does not lift either (S4 Risks), because the virtual camera would no longer line up with the room; the ghost plays instead.
- *Does.* Plays INV (key i) as today. The INV is earned when key(after) + key(move) = key(before), where key = paid·1001 + free, the weighting levels.js road() uses (levels.js:61–71). road() reads OPSET, which is null outside plan() (levels.js:28, :67), so at play time the level's ops must be passed in, or THE MIRROR's 6↔9 is ignored (game.js:60–61). On SHIFT levels the key is solveShift's length to the moved target (game.js:73, :91), with every move paid. So a free INV under IDENT lifts only when it is on a road. A tap, Enter or Esc ends the lift early.
- *Gets.*
  - Free, immediate confirmation that the move was right. Today the player learns it only from the whole road: HINT's toast (index.html:178) or the panel's road to the tapped target (index.html:301). Neither costs anything now (game.js:91 keeps no count, and no star depends on it); under Q4 the first HINT on a level stays free and a further one caps the stars at ★★.
  - An overhead look at where the target lies.
  - A closing INV holds the lift into the won card.
  - A voice line from cell 46, whose words include BODY and FLASH (both have letter sum 46), and which Γ leaves fixed.
- *Builds on.* A rig at the origin that only ever turns (ar.js:126, :217–220); place() is already exported (ar.js:237). The sky reads mat3(viewMatrix) (fx.js:105), so translating the rig leaves the sky correct.
- *Changes.*
  - parts/void/void.js *new*: VOID.leave(op, {mode}) holds A.lift = {t0, up, down, mode} *new* (not A.ghost: V1's XR ghost and V3's S.ghost and ghostLine already use the word), eased with the flow's own t²(3 − 2t) (ar.js:88).
  - ar.js: frame() (:230–236) sets A.rig.position when !renderer.xr.isPresenting; look() subtracts the pitch in drag mode; uvOf (ar.js:63) is exported.
  - index.html: move() takes the key before G.apply and holds busy until the view returns. The toggle is a LIFT switch in U3's settings sheet (localStorage 'fold.void'), off under CALM. It is not an aux button: Scope creep allows two new ones, RAYS and VIEW, and VOID already names a skin (U1).
  - STORY.void.body *new*: "The BODY stays where Γ leaves it: Γ 46; fold 211; inverse 95." (13 words by story/check.js:19's wc(), under the 20-word voice limit at :38). story/check.js iterates STORY.void.
  - The same lift serves the bardo (V3) and the crossing (S4).
- *Numbers.*
  - Today FOLD and INV together appear 36 times among the 339 moves of the 64 spec roads, in 28 levels. V2 takes the 21 FOLDs (19 levels); V1 takes the 15 INVs (14 levels).
  - Up and down each take flowDur, 0.8 s (ar.js:204).
  - The lifted camera, 3.84 m from the origin, stays inside the cell sphere (r 6) and under the ceiling (y 5, relief.js:236).
  - Cost: one billboard, 4 vertices.
- *Refs* A6, A33, B32.
- *Risks.* A camera translation the player did not cause is the classic trigger for motion sickness. So: lift only in drag mode with the camera off; under gyro, with the camera on and in XR the ghost plays instead; turn it off under CALM, and offer the toggle. Pause G.tick while the view is out on HALT levels.

**V2 · THE CORRIDOR: every FOLD is eight halvings, flown as rings.** *M*
- *Sees.* 129 = 2⁻¹ and 2⁸ = 256 ≡ −1, so fold(n) = 257 − n = n·129⁸ for every cell.
  - On an earned FOLD (V1's key test), a corridor of eight rings opens ahead and the view passes through them during the fold's 0.8 s.
  - Ring k is rung k of the current cell's halving ladder, labelled from the atlas and coloured by its ray. The eighth ring is the fold partner and burns gold. Halving is dlog − 48, and 48 ≡ 0 (mod 12), so a rung keeps its ray except where dlog wraps past 0, which adds 4 (256 ≡ 4 mod 12). Coloured by ray alone, a corridor shows only two colours (176 cells) or three (80 cells): from 86 the rings are rays 3, 3, 3, 3, 3, 7, 7, 7. Number the rings k = 1…8 *(design)* so the eight read as eight halvings.
  - The same rungs brighten on the sphere along the LADDER line (ar.js:193–195).
  - From 86 TIKKUN (whose words include TUNNEL) the corridor runs: 43 CHARM, 150 ELECTROMAGNETIC, 75 SHIFT, 166 TETRAGRAMMATON, 83 PRAYER, 170 IMAGINARY NUMBER, 85 ESCHATON (whose words include MATRIX), 171 EVENT HORIZON.
  - On the ladder levels (36 and 40) the corridor shows all 16 rungs, with the target rung in gold. Today level 36 is rung 1 (56 → 28) and level 40 is rung 2 (56 → 14). Neither has a shortest road with a FOLD (36: ÷g ÷g ×i Γ; 40: ×i Γ ×i Γ; par 4 each), so a player on par never earns a FOLD there; only after a detour can one open it. Over the 256 nonzero homes, 286 of the 512 ladder levels have a FOLD on some shortest road. Fly the 16-rung corridor on the level's close as well, so a player on par sees it.
- *Does.* FOLDs, plays the ladder levels, closes THE EYE.
- *Gets.*
  - The fold seen as what it exactly is, eight halvings, which makes chapter 5's "none of them is a rung" (story.js:25) visible.
  - Closing THE EYE (level 56) flies the B8 chain: 1 ×140 → 140 ATTENUATION, FOLD → 117 BOLTZMANN, ×2 → 234 CHINESE REMAINDER, ×87 → 55 HEAVEN, with 55's voice. The composite is 140·256·2·87 ≡ 55 (parts/corpus/check.js:37 checks the chain). It is a reward, not a road: F.solve gets from 1 to 55 in three moves, FOLD Γ ×i.
- *Changes.*
  - ar.js tunnel(cells, {gold, labels}) *new*, shared with V3: one camera-attached indexed LineSegments holding every ring (64 segments each) plus one instanced billboard mesh, advanced by a corridorT uniform *new*. That is the 'tunnel +2' of the draw-call budget; one LineLoop per ring would cost 8 draw calls here, 10 in V3 and 16 on the ladder levels.
  - void.js: VOID.corridor() and VOID.flight(FOLD_MATERIAL.tunnel). The page's first read of FOLD_MATERIAL comes a phase earlier, in V3 (ten_discs, Phase 2); V2 (Phase 3) reads the tunnel key that material.js already holds.
  - story.js: the fact ['pow', 129, 8, 256] (parts/story/check.js:56 already has the pow kind) and the sum 'TUNNEL': 86, added once and shared with V3.
  - Labels come from F.glyphs, not from tunnel.glyphs (F13).
- *Numbers.* 8 × 64 = 512 vertices plus 8 instances; eight rings in 0.8 s. On the ladder levels: 16 × 64 = 1024 vertices and 16 instances, above the 512–640 the budget gives the tunnels (Budgets and risks, Vertices).
- *Refs* B5, B8, C34.
- *Risks.* Ten rings a second is a moving radial pattern. Keep strokes thin and opacity at 0.5 or less, and pass the gold eighth ring through FX.strobe. Under CALM there is no flight: the eight rungs stay lit on the sphere for the 0.8 s instead.

**V3 · THE BARDO: a lost level dies through the ten discs and is reborn at 80.** *M*
- *Sees.* A loss (SYNC over par, game.js:77 and :79; HALT at zero, :85) plays three beats timed to the existing lose sound (sound.js:246–251: a 1.0 s slide, the thump at +1.0 s, the drone back from +2.5 s).
  - **0–1.0 s, death.** The field dims: the cells' halo goes from 1 to 0.35, the value the ribbon already uses (ar.js:133). The lost road is redrawn falling, in the sketch's descent orange #ff6a2a. The player's climber lets go on the floor (H2). Where allowed, the view rises (V1).
  - **1.0–2.5 s, the tunnel.** Ten thin rings are flown through: the cells at dlog 246…255, on rays 6, 7, 8, 9, 10, 11, 0, 1, 2, 3:
    - 198 BEAUTIFUL DOORWAY, 80 REBIRTH, 240 ROBE OF RIGHTEOUSNESS, 206 ANTHROPIC PRINCIPLE, 104 ANTHROPIC;
    - 55 HEAVEN, 165 TREE OF KNOWLEDGE, 238 FREE WILL, 200 CRYSTALLOGRAPHY, 86 TIKKUN (the cell that holds TUNNEL).

    Then the white disc of 1, I AM, as the cycle closes at dlog 256 ≡ 0. It is the one gated flash.
  - **From 2.5 s, the card.** 'REBIRTH · 80', with cell 80's voice (story.js:144) and two doors.
- *Does.* Chooses between two doors:
  - AGAIN: the level from its own start, G.reset (index.html:261), as today. All three stars are open, and so is its loss rule.
  - REBIRTH: the same target, rule, free moves and slack, started from 80 REBIRTH/OPENING, with par recomputed from 80. The second life cannot be lost *(design)*: SYNC's over-par loss (game.js:77, :79), HALT's clock (:85) and B22's HALT-cell stop (decision 3) are all off, and it closes at ★ whatever the count. So R5's plate stays dark, S3 has no clock to dilate, and the rule pill reads 'REBORN · SYNC · no loss · ★' *(design)*. Its first move is flashed on its button (flash(), index.html:183).

  Why the second life cannot be lost: with its loss rule kept, REBIRTH would be AGAIN with a ★ cap and a start that is no easier. Par from 80 averages 3.90 over the 946 losable levels of the 100 days from 9422, against 3.88 from their own starts, so no one would take it. What it sells instead is a sure close for two stars. Also, 80 is itself one of B22's 27 HALT points (π[80] = 9, material.md:314), so with the stop kept, a reborn HALT level would start on a HALT cell. REBIRTH is for tape levels: a special that is lost falls back to its window's own level (decision 8), and if that level is lost in turn, it is reborn like any other.

  A tap, Enter or Esc skips the sequence. After the first loss of a level, later losses of it go straight to the card. Under CALM nothing is flown and the I AM disc does not flash (U3); in XR nothing is flown either (Budgets and risks, AR comfort). There the field dims, the ten discs stand lit on the card as a row of glyphs, and the card follows at once.
- *Gets.*
  - A loss is never a wall: AGAIN still offers three stars, and REBIRTH a sure ★.
  - What a reborn close counts *(decision 4)*:
    - S.closed + 1. The target joins S.targets, so the seal multiplies it (F8), and its first word joins the line (game.js:77), exactly as a close from the level's own start would.
    - THE BOOK collects the cell (Q1), and the streak counts the close.
    - S.stars[L − 1] = 1, so a perfect chapter (24) or a perfect day (192) is out of reach once a level is reborn.
    - It is a climb and a close but never a summit (H2) *(design)*, and it cannot earn AMBER, which needs 3★ (T3).
  - Losable levels are SYNC or HALT, never SHIFT (each level has one rule digit, game.js:8–19), so a reborn level closes on the same cell as an own-start close. Rebirth therefore changes the stars and the seal's 'reborn N', never the seal's cell or the line. In node, with today's nine losable levels all reborn, SCRIBE still seals 227 LAMB OF GOD and TORAH 36 IMAM, with the same line and 174 stars against 192.
  - The previous life stays as a dim orange ghost line.
  - The loop's name comes from the field. SISYPHUS has 8 letters and sums to 136 (THE LADDER's epigraph cell, HALVING LADDERS). Its Atbash mirror is 27·8 − 136 = 80, REBIRTH. Γ(80) = 154 is the norm of the stars (103, 51) and (154, 206), and the floor climber is reborn at (103, 51) (H2).
- *Builds on.* The lost branch of won() (index.html:249, :259, :261); material.js ten_discs, which parts/corpus/check.js:57 proves and the page never reads.
- *Changes.*
  - game.js:
    - rebirth() *new* keeps S.road as S.ghost, then runs level(S.level) (game.js:54–66). That clears S.lost, S.done, S._lostShown, the moves and the HALT clock; without it, apply() refuses every move (game.js:71). It then sets start = current = 80, road [80], visited {80}, S.strict = false, S.clock = 0, par = F.cost(F.solve(80, S.target, S.free, S.opsList), S.free) and S.reborn = S.level. Last it calls save(), because game.js saves only on a start, a close, a loss, a level change and a found quest (:52, :78, :79, :84, :85, :93).
    - A losable level is SYNC or HALT, never SHIFT, so solveShift is not needed. The plain solver is right, because the second life has no HALT-cell stop to route around.
    - game.js:76 gives 1 when S.reborn, and :77 also pushes S.level onto S.rebirths *new*. level() clears S.reborn.
    - canRebirth() *new* is true when S.lost, S.target ≠ 80 and that par is above 0.
    - save() keeps reborn (the level in its second life, else 0), rebirths and ghost. start() calls rebirth() when kept.reborn === kept.level, then puts kept.ghost back as S.ghost, since rebirth() would keep the fresh start's road; otherwise a reload would hand the level back its loss rule from its own start (game.js:51, :62).
    - S.rebirths feeds the seal's 'reborn N', and the dim marks in V4 and H3.
  - ar.js: ghostLine *new*, like roadLine but colour 0xff6a2a at opacity 0.35; tunnel() is shared with V2.
  - void.js: VOID.bardo(S) *new*. The loss branches at index.html:231 and :325 call it before won(). REBIRTH shows when canRebirth(). Over the 100 days from 9422 that is all 946 losable levels: none has target 80, and none has par 0 from 80, counting day 9472's free ×i (game.js:59) and THE MIRROR's flip.
  - story.js: STORY.void.death *new* from cell 38: "DEATH at the node: dlog 173; Γ 19; inverse 115." Sums 'REBIRTH': 80 and 'DEATH': 38.
  - test.js:
    - It asserts a road from 80 with 0 < par ≤ 7 for every losable level (strict or clock, the only ones offered REBIRTH). Over 100 days from 9422 that is 946 levels (509 SYNC, 437 HALT, none SHIFT, none with target 80): worst par 6, mean 3.90 against 3.88 from their own starts (3.89 and 3.87 with day 9472's free ×i). Over every planned level the bound also holds (worst 6), but 264 of them (all JUMP, Γ free, targets other than 80) have par 0 from 80.
    - It requires game.js (F8). On today's plan it loses each losable level: SYNC by going over par, HALT by G.arm() and then setting S.t0 back 31 s before G.tick(). Then it calls rebirth() and plays FOLD FOLD, sets S.t0 back 60 s and ticks, which loses nothing because the clock is off, and plays the road from 80, a close at par + 2. It asserts: closed, not lost, ★, and the level in S.rebirths. At the end of the day, S.targets, the line and the seal equal the own-start day's. In the scratch run that gives 227 LAMB OF GOD for SCRIBE and 36 IMAM for TORAH, at 174 stars.
- *Numbers.*
  - Losable levels today: 9 (SYNC 8, 14, 28, 54; HALT 21, 22, 29, 41, 61).
  - Pars from 80 to the other 257 points: 6 at par 1, 18 at 2, 48 at 3, 85 at 4, 86 at 5, 14 at 6. Mean 4.05, against 3.87 over all ordered pairs.
  - The ten discs sum to ≡ 30, with product ≡ 103 (A30).
  - Vertices: 10 × 64, plus 10 instances.
- *Refs* A30, C4, B5, B11.
- *Risks.*
  - Feeling punished: it is skippable, lasts 2.5 s (the sound's own length), and plays in full once per level.
  - The atlas cuts words longer than 16 characters to 15 plus '…' (ar.js:58), so four ring labels are cut; the card lists the full words.
  - Ring 3 (cell 240) shows a lone surrogate until F1 lands.
  - The ring passes come at 6.7 a second. They are a moving pattern, not a flash, but check them with PEAT or Harding.
  - Rebirth changes what a loss costs: at most two stars, never the level. SYNC's tell, 'one over and the level is lost' (game.js:17), stays true of the first life, and the REBIRTH door says the second life cannot be lost.
  - Rebirth lands behind the flag that Budgets and risks asks of every plan change, and test.js covers it both on and off.

**V4 · TITLE CARDS: the slam, and the previous chapter in twelve-fold glass.** *M*
- *Sees.* Each chapter opens on black with three type-only slams at 0, 550 and 1100 ms: the chapter number with its epigraph cell's glyph pair, then the TITLE, then the epigraph word and cell. GO goes live at 1500 ms *(design)* and takes focus then. #chap gets role="dialog" and aria-labelledby on its h2 (index.html:118 has neither). The slams are aria-hidden copies; #chapbody keeps its h2 and epigraph (index.html:277), so a screen reader reads the card once.

  Behind the card is a 12-wedge mirrored kaleidoscope, one wedge per ray:
  - its shards are the atlas slots (glyphs, number, word) of the targets the player closed in the previous chapter: gold at 3★, dim below that (a reborn level, V3, is dim too). None is ever missing: a lost level offers only AGAIN (index.html:259, :261), so every level of the previous chapter was closed;
  - its hub is the new epigraph's glyphs, tinted by that cell's ray;
  - the glass turns one wedge (30°) as the title lands, then rests.

  Epigraph cells (F.glyphs, ray):
  - SUNRISE 105 ♯δ r9 · THE FOLD 37 φ⊗ r3 · THE QUARTER TURN 173 ΩΣ r6 · THE DOORS 71 ⊟⅗ r7
  - THE LADDER 136 εε r8 · THE MIRROR 91 ⊗Γ r11 · THE EYE 137 εδ r0 · THE SEAL 156 δQ r11

  Chapter 1 has no previous chapter and uses the home cell. The special levels get a smaller slam of spec.title ('THE DOOR 4176', 'THE EYE · 137 → ∞ → 1') in place of the toast (index.html:270).
- *Does.* Closes chapters and taps GO as today; a tap, Enter or Esc skips to the end state.
- *Gets.* The previous eight roads refracted twelve ways, with the stars as gold shards. The chapter break becomes a reward rather than a pause.
- *Builds on.* The chapter card (index.html:274–279); the atlas texture A.tex (ar.js:37–62, 2304 × 2048, already on the GPU); story.js:11–36.
- *Changes.*
  - fx.js kaleido(opts) *new* returns QUAD_VS, a fragment shader and uniforms {map, slots vec4[8], wedges 12, turn, tint, alpha}, at renderOrder 996 (below crt at 998 and warp at 999).
  - Uniform-array lookups go through `for (int k = 0; k < 8; k++) if (k == band) …`, because GLSL ES 1.00 guarantees only constant indices into uniform arrays in fragment shaders.
  - The atlas uv goes through the HP macro (fx.js:21–27); at uv ≈ 1, mediump resolves only about 1.1 texels of the 2304-wide atlas.
  - #chap's backdrop alpha (.74, index.html:65) is lowered while the glass shows.
  - No new game state. S.targets (game.js:77, saved at :25) already holds the cell each level closed on, SHIFT's shifted target included, one entry per level in level order, because a level is left only by closing it. For chapter c just closed, the shards are S.targets.slice(8c − 8, 8c), tinted by S.stars.slice(8c − 8, 8c).
  - Hidden in XR, as crtQ is.
- *Refs* A15, A13, A8.
- *Cost.* One draw call, one texture fetch, about 30 ops and one atan per fragment, only while the card is up.
- *Risks.* The atlas has no mipmaps (ar.js:61), so sample only each slot's glyph row. Under CALM: static glass, no slam.

### Matrix: the code

**M1 · THE TAPE SKY: the π tape as the digital rain.** *M*
- *Sees.* Behind the cell sphere, at radius 9, stand 256 glyph columns, one on each dlog tick. Column c stands above cell 3^c, at the azimuth ar.js:33 gives that cell.
  - Column c holds the 78 consecutive digits π[78c … 78c + 77], read downward: the whole program laid out as the sky. 78 = ⌊20001/256⌋, so 19968 digits are shown.
  - The digits stand still. Drops of light run down the columns, a white head and a green trail, so the tape stays readable: static code, travelling light.
  - Today's 260 digits (head 9435 = 78·120 + 75, to 9694 = 78·124 + 22) are a brighter strip over columns 120–124, above cells 17 Q, 51 NONCE, 153 ALBERT EINSTEIN, 202 COINBASE TRANSACTION and 92 CHRONOS.

  Colour shows state: your column runs fast and white-green, the target's is gold, the six reach columns (seven when THE MIRROR opens the flip) take the hue of the move that reaches them (field.js:24–31, :35), home is blue, and visited columns keep a slow dim trail.

  The rule shows as a phase pattern, taken from each move's action on dlog:

  | rule | rain |
  |---|---|
  | NOP | free rain |
  | IDENT | c and 256 − c fall together |
  | EXIST | the four quarters fall together |
  | FOLD | c and c + 128 fall together |
  | SEED | the rain rises from the floor |
  | SHIFT | the pattern steps one column a move |
  | STORE | trails twice as long |
  | SYNC | one phase for every column, drawn as a travelling band |
  | JUMP | Γ's two sides in counter-phase (needs M3's side table) |
  | HALT | R5's freeze |

  Density follows the day: chapter k (1–8, as levels.js:80 numbers it) wakes 32k columns.
- *Does.* Reads the rule from the rain's pattern, finds an off-screen target by its gold column, and uses the tinted reach columns as a map of the six moves.
- *Gets.* A sky that is the game's own program and shows the state without the HUD, filling with rain as the day goes to night.
- *Builds on.* fx.js's precision header, mediump with an HP macro for the clock (fx.js:21–27); the instanced billboards pattern (ar.js:65–110); the GPU tiers (index.html:166–167); the π ribbon (ar.js:207–215).
- *Changes.*
  - field.js: the G16 fix (F1) comes first.
  - fx.js:
    - rain() *new*: ES 1.00, mediump, with HP for the clock and for the row varying.
    - rainAtlas() *new*: 32 slots on a 320 × 256 canvas (the digits 0–9, the 16 G16 code points, ∞, a blank and 4 marks); 327,680 B. It has no letters, so a column decodes into glyphs, never words (M2, M4). It is NPOT, so WebGL1 cannot mipmap it (three r128 would resize it), and like the main atlas (ar.js:61) it is sampled unmipmapped. Draw a glyph at about 32 px, at most twice the 16.9 px row, or it shimmers as the view turns.
  - ar.js:
    - rainInit(pi) *new*: one InstancedBufferGeometry (PlaneBufferGeometry(1, 1, 1, 13), 256 instances, attributes iCol and iState vec4) and a 78 × 256 LUMINANCE DataTexture of the tape (NEAREST, no mipmaps), at renderOrder −5 with depthWrite false.
    - AR.paint writes iState. AR.rainRule(digit, moves) *new*.
    - Cells 0 and ∞ have no column (DLOG −1), so their states go to the floor centre and the zenith.
  - index.html: mount after the sky (:167). RAIN and CODE share one VIEW button, because a fourth row of buttons would cover #quest. #ops has three rows today: the six moves, then UNDO · HINT · RELIEF, then LADDER and, where XR is supported, AR. Every aux spans 2 of the 6 columns (index.html:48, :53, :175–181, :339). VIEW fills that third row, so T1's RAYS would open a fourth row on XR devices. U3's settings sheet already has a VIEW row (ROOM camera / SKY / AR), so one of the two needs another name.
- *Numbers.*
  - The band runs −40° to +58°: the cells' band of −34° to +58° (ar.js:33) plus 6° below *(design)*.
  - At the 70° FOV (ar.js:126) on a 1080 px viewport: 13.46 px a degree, so a row (98°/78 = 1.256°) is 16.9 px and a column is 18.9 px at the horizon and 10.0 px at +58°. A portrait phone about 800 px tall gets roughly 0.74 of that: rows of 12.5 px, columns of 14.0 px.
  - 256 × 28 = 7168 vertices in one draw call (PlaneBufferGeometry(1, 1, 1, 13) has 2 × 14 vertices); about 35 ops and 2 fetches per fragment. The CRT's ~45 ops count as "nothing" in the shaders notes (:75).
- *Refs* A4, A15, B10, B30.
- *Tiers.*
  - Phones and RK3588: full.
  - `tiny`: sparse, at most 42 instances (current 1, target 1, home 1, reach 6, or 7 with THE MIRROR's flip, HALT 27, day strip 5), drop heads only, no trails. SwiftShader, the one `tiny` GPU measured, already plays at 29.5–32.4 ms p50 (Budgets), so check a Pi 4 before this ships there.
  - llvmpipe: off. That needs a test separate from VideoCore (see Budgets).
  - XR: two static columns.
- *Risks.* A full-field moving texture is vection in immersive AR, so in XR only the two static columns stand. Under gyro the Budgets' comfort rule (no full-field moving texture) holds too, so drops run only in the `tiny` tier's state columns. Over the camera it draws at alpha 0.35. Under CALM the glyphs are static, lit by state only.

**M2 · THE READ: each level comes out of the rain and closes back into glyphs.** *S on M1*
- *Sees.* As a level opens, its window's column stops at π[offset], the head. A window is 8 + slid digits from the head, so it can run on into the next column. Today 6 of the 56 do (windows 1, 20, 21, 39, 59 and 60), level 1's 9435–9442 among them: rows 75–77 of column 120, then rows 0–4 of column 121. Doors, ladders and the eye read no digits, and a mirror level reads only its four start digits (levels.js:128).
  - Eight digits light: four green for the start, and four gold for the target at π[offset + 4 + slid … offset + 7 + slid] (levels.js:91; on the ribbon these are slots 12 + slid … 15 + slid, ar.js:210). A slid window (sp.slid) shows its skipped digits struck through. On SEED the start digits step aside for SEED's glyph.
  - The eight glyphs lift out of the sky and fly, on the billboard flow (ar.js:88–89), to the rule pill and the two cells.
  - On a close the start digits become the start cell's glyph pair (7846 ≡ 136 → εε), so through the day the strip turns from digits into glyphs.
  - The voice line types in with a block cursor.
  - Under CALM the digits light in place, nothing flies, and the line appears whole. A tap skips the read, which lasts at most one flow, 0.8 s *(design)*, since it runs before every tape level.
- *Does.* Watches. Taps the head or the ribbon to read the level's line, e.g. 'π[9435] = 7 JUMP: 7846 ≡ 136 VIRGIN MARY → 8788 ≡ 50 HIGGS' (levels.js sp.text already builds it).
- *Gets.* A visible record of the day decoded, and the seal line 'the tape decoded k of 56 windows · longest run r'. Runs are counted over window numbers, because windows play out of order: levels.js:166 sorts each chapter's tape levels by par, so today chapter 1 plays windows 1, 7, 5, 3, 6, 4, 8, 2. Runs also break at the special windows 30, 31, 32, 36, 40, 44, 48 and 56. They also break at the window THE OTHER SIDE holds (today 50) when it closes, since it reads no digits. THE TURN and THE CLOCK read the windows they hold (R3, R5). So a day that closes THE OTHER SIDE decodes at most 55.
- *Changes.*
  - ar.js:
    - tape(pi, o, spec) colours the ribbon by role.
    - read(spec) *new* drives tapeB's flow uniform, which is unused today (frame() drives only cellB's, ar.js:231–232). read owns tapeB until its flight ends, because tape() rewrites iFrom on every paint (ar.js:111, :212).
    - A 78 × 256 decode texture *new*, at most 20 KB uploaded per close. Or write the glyph slots (10–25) into M1's tape texture in place, which keeps M1 at 2 fetches a fragment instead of 3.
    - A pick over tapeB's 48 instances *new*; A.pick tests only the cells (ar.js:229).
  - index.html: the read must end before the level arms. Hook both the arm in openLevel (:272) and the chapter card's GO (:278), or HALT's 30 s will start during the read.
  - game.js: save() keeps 'decoded' *new*, and start() restores it with the other kept fields (game.js:51).
- *Refs* B34, B10.
- *Risks.* The window's column can be behind the player (column 120 is at 168.75° today), so the flight starts from the view centre when the column is off screen.

**M3 · CODE VIEW: the code behind every cell, and 33 rings to collect.** *M*
- *Sees.* CODE (the VIEW button, or key c) flips every billboard to a code face:
  - dlog in 8 bits (B20: 83 → 00001111);
  - the ray;
  - the Γ side, 'of 1' or 'of 3' (B18), or 'fixed' for 46 and 92, which lie on neither;
  - the ring, 0–32 (B13);
  - the character, R or N;
  - π[n] with its opcode (the 27 HALT cells read 9 HALT, B22; on a HALT day they are the cells that end the move run, M7).

  The field goes phosphor green, with the side of 3 one step dimmer, so Γ's two orbits read as two shades. The room video takes a green filter. The panel gains a row, e.g. for 62: 'Γ side of 1 · ring 18 · dlog 00100010 · π[62] = 9 HALT'.
- *Does.* Reads the faces. Answers quests whose clue is a ray and a character (levels.js:43). In FREE WALK, tours rings with FOLD, ×i and INV, the three moves that keep a ring.
- *Gets.*
  - RINGS: 33 collectibles kept on the device: 31 rings of 8 cells, plus ring 0 {1, 16, 241, 256} and ring 32 {4, 64, 193, 253}. Each closes in at most 7 moves (3 for the two 4-cell rings), and a closed ring burns gold.
  - The two shades show at a glance what B17 and B18 say: Γ alone never crosses sides, while every other move crosses for about half the cells. Over the 256 points of the two sides, with moves onto 46 and 92 left out, ×g and ÷g cross for 130 of their 254 moves, FOLD and INV for 128, ×i for 112, and Γ for 0 of 256 (node over field.js). F9's 131 and 113 also count the moves onto 46 or 92 from the side of 1.
- *Builds on.* cellInfo (game.js:87–90); showCell (index.html:291–304); the atlas (ar.js:37–62, 20 free slots); the billboard shader (ar.js:92–107). gen_material.py already builds Γ's orbit of 1 (:85–89) and the ring rule (:104–107).
- *Changes.*
  - field.js: side(n), ring(n), ringCells(r) and bits(n) *new*. ring(n) follows B13's base 5: d₅ = 135·dlog n mod 256, ring = min(d₅ mod 64, 64 − d₅ mod 64) (gen_material.py:104–107). The same fold on dlog₃ keeps the rings but renumbers them, so 62 would be ring 30, not 18. cellInfo adds them, plus π[n].
  - ar.js: codeAtlas() *new*, 18 × 16 slots of 64 px (1152 × 1024, 4,718,592 B), mixed with the main atlas by a uniform. No new draw call.
  - The room's base CSS filter becomes one variable, read at index.html:18, :237–238 and fx.js:225. Today the first move writes the base filter back and wipes any tint.
  - gen_material.py emits gamma.side_of_1 (with ∞ as 257, not 'inf') and rings.all *new*. check.js loads field.js into its VM and asserts that the runtime tables match.
  - localStorage 'fold.rings' *new*.
- *Numbers.* Γ splits the 258 points into two orbits of 128 plus the fixed points 46 and 92. The ring of 62 is 18.
- *Refs* B13, B17, B18, B20, B22, B33.
- *Risks.* +4.5 MiB of texture on a Pi, hence the 64 px slots. Code faces hide the words, while quests ask by word, so the panel keeps the words. A cell is 0.66 m at 6 m (ar.js:17, :128), 6.3°: 85 px at 1080 and 63 px on an 800 px phone. A 64 px face therefore holds about four 16 px lines: the bits, the ray with R or N, the ring, and π[n] with its opcode. The side stays with the shade and the panel.

**M4 · BULLET TIME: the closing move, slowed by its stars.** *S*
- *Sees.* When a move closes the level, its flow runs slower by the stars it earns: ×3 at 3★, ×2 at 2★, ×1 at 1★ *(design)*. The stars are already known before the flow starts: G.apply sets S.done (index.html:226) before A.flow runs (:227).
  - The existing CRT pulse stretches with the flow. It must stay one pulse: a second FX.pulse restarts the first at full strength (fx.js:207).
  - With M1 and M2, the rain's drops stop mid-fall and the target's column decodes into its glyph pair. The rain atlas has no letters (M1), so the word stays on the card.
  - In screen mode the FOV narrows from 70° to 58° and back *(design)*.
  - At 3★ the lit glyphs turn gold for one beat that decays by the phosphor law F(T) = cos(πT)·e^(−0.5T) (fx.js:19).
- *Does.* Makes the closing move; a tap skips.
- *Gets.* A close at par feels like an event, and the sky gives the rating before the card does.
- *Changes.*
  - index.html move(): set A.A.flowDur *= k after A.flow(o). flow() writes flowDur (ar.js:204), and both the busy timer and the won timer read it (index.html:229, :231).
  - Tap-to-skip bumps S.epoch, so mine() (index.html:228) drops the pending won timer, then plays snd.win and calls won() at once. The won timer keeps no handle today (:231), and the canvas's pointerup (:311) must take the skip before it picks a cell.
  - ar.js: an 'ease' uniform for a slow-in, slow-out remap, and a FOV tween in frame() when !renderer.xr.isPresenting.
  - With the camera on, either scale the <video> in step by tan 35°/tan 29° = 1.263, or skip the zoom. A scale must compose with roomFx, which writes the same transform on the closing move and resets it after 0.8·flowDur (index.html:236, :238).
- *Numbers.* Flows of 0.5, 0.8 and 1.1 s (ar.js:204) become 1.5, 2.4 and 3.3 s at ×3, with the card at 1650, 2550 and 3450 ms (+150 ms, index.html:231). One gold beat per close, at least 1.5 s apart.
- *Refs* A14.
- *Risks.* A longer wait on every close, softened by tap-to-skip. No FOV change under CALM or in XR. Under CALM the flow is pinned (U3), so k stays 1: slowing a pinned flow would only lengthen the wait.

**M5 · CLIFF RAIN: the climbers' falls as glyph streaks on the ground.** *S on H1*
- *Sees.* Where a climber of the crowd (H1) goes over a crest, a short streak falls down the relief's own cliff, from the crest at +0.6 to the foot at −0.6: 1.2 m on the centred floor (relief.js:117–118). Its head is the glyph pair of the value it lands on, in the page's phosphor #5fd37a (index.html:15), whitening at the head.
- *Does.* Nothing: it is automatic with RELIEF on, on the full tier only.
- *Gets.* The Matrix look grounded in the field: every glyph is the true value of the ground where it lands. TERRAIN sums to 85, the cell that holds MATRIX.
- *Changes.*
  - heat.js rain(THREE, AR.A.tex) *new*: a pool of instanced atlas quads in one draw call, using a billboards()-style shader with a fall uniform, plus one LineSegments of streaks.
  - Either export billboards(), uvOf, COLS and ROWS from ar.js, or duplicate the UV math (ar.js:17, :63).
  - Sample only each slot's glyph row, because a slot also holds the number and the word (ar.js:54–56). The pair needs F1 first, or every value with a hex digit F lands as a broken glyph.
  - One streak per eighth crest fall.
  - Spawn only within 1.8/tan 34° = 2.67 m of the centre, so no streak top rises above the lowest cell row at −34°.
- *Numbers.* At cell 1 the crowd's quiet fall rate is 8.0 % a frame: 287 falls a frame at 3584 climbers, so 36 streaks a frame and about 430 live at a 12-frame life *(design)*. That is 860 line vertices plus 430 quads, 2580 vertices in all. At cell 62 the rate is 2.4 %, so the rain thins with your cell.
- *Refs* A1, A14.
- *Risks.* Off on `lowEnd` and `tiny`, and off under CALM.

**M6 · THE AUTOPILOT: the tape runs a closed cell through its opcodes, and the player bets where it halts.** *S; its keepsakes wait on Q1*
- *Sees.* On each chapter's last close the won card offers RUN. The closed cell becomes the program counter, and the tape steps it four times a second *(design)* by B23's rules over π[pc]:
  - 7 JUMP sends pc to its fold partner 257 − pc; 9 HALT stops; every other digit steps pc + 1, with 256 + 1 wrapping to SEED *(design)*.
  - SEED and STORE copy pc into the accumulator and FOLD folds it; the trace (U5) shows both registers.
  - Each step lights the visited cell and π[pc] on the ribbon, and with M1 the cell's rain column. A halt burns the cell gold; a loop closes as a ring of chords and stays for the day.
  - From 46 the run is 46 → 47 → 210 → 211 → 212 → 213 → 214, as B23 has it.
- *Does.* Before RUN, taps the cell where it will halt, or the ∞ pip for 'never halts'. In CODE view (M3) every face shows π[n], so the run can be traced by hand first. A tap fast-forwards.
- *Gets.*
  - 'CALLED' on the card and 'called k of 8' on the seal. No stars are at stake.
  - THE BOOK keeps the halt cells seen (the 27 HALT points of B22) and the three loops found. Each loop is a run and its fold image: 25–29 with 228–232 (10 cells), 91–96 with 161–166 (12), 118–120 with 137–139 (6). The last joins Γ's zero 120 to its pole 137 by a JUMP, so a run that reaches the eye never halts.
- *Builds on.* D.pi and OPCODES (field.js:11); material.js halt_points; the ribbon (ar.js:207–215); won() (index.html:247).
- *Changes.*
  - field.js: autopilot(n) *new* → {path, halt} or {path, loop}, stopping at the first repeated pc.
  - index.html won(): RUN and the bet when S.level % 8 === 0 && !S.lost.
  - ar.js: the step light uses Q3's flare state (after F12); the loop ring is one LineLoop.
  - game.js: S.bets *new*, saved; FOLD_BOOK keeps 'halts' (27 bits) and 'loops' (3 bits).
  - material.js 'autopilot' *new*; check.js re-runs 46 → 214 and the three loops.
- *Numbers* (node over data.js's π, cells 0 … 256).
  - 153 cells halt, in at most 15 steps (from 215) and 3.92 on average; 27 halt where they stand. 104 never halt: basins of 33, 29 and 42 cells round the three loops, each loop closed within 35 steps (8.75 s at four a second).
  - Today's chapter closes (SCRIBE, par roads): 233 loops on 25–29/228–232; 82 (level 16, SHIFT) loops on 91–96/161–166; 181 halts at 187 in 6; 6 at 12 in 6; 14 where it stands; 116 falls into the eye's loop in 2; 1 halts at 5 in 4; 101 falls into the eye's loop after 17. Over the 100 days from 9422, 565 of 800 chapter closes halt.
- *Refs* B23, B22, B18, B32.
- *Risks.* B23's JUMP (to the fold partner) is not the game's JUMP rule (Γ free, game.js:16); the card says 'the machine's JUMP'. Its HALT is the game's: it stops on the same 27 cells that end a move run on a HALT day (M7). A 35-step loop is long, so a tap skips and the ring draws at once.

**M7 · THE HALT CELLS: on a HALT day the 27 cells where π reads 9 end the move run.** *M*
- *Sees.* A HALT day is a day whose opcode is 9: the digit the start screen prints (index.html:162), π[windowBase(day)] on Q2's fresh road. That is 10 of the 100 days from 9422, the first on 2026-11-15 (day 9450), and 39 of the next 365. At stride 1, where the opcode is π[day + 13], it is 7 of the 100, the first on 2026-11-08 (day 9443), and 29 of 365. On it B22's 27 HALT cells stand marked: 5, 12, 14, 30, 38, 42, 44, 45, 55, 58, 62, 79, 80, 100, 122, 129, 144, 169, 180, 187, 190, 193, 199, 208, 214, 247 and 249 (sum 3095 ≡ 11).
  - Each billboard gets a square ring and a 9 under its glyphs.
  - A move button whose cell would be a HALT cell other than the target carries a notch, and its aria-label ends 'halts'. So the stop is seen before the press, and not by colour alone (WCAG 1.4.1). 123 of the 258 points have a HALT cell one move away (139 with THE MIRROR's flip).
  - The daynote adds 'a HALT day: the cells where π reads 9 stop the run', and the daypill (index.html:212) adds 'HALT DAY'.
- *Does.* Plays the day's 64 levels around them, by B22's HALT-day rule:
  - A landing is a move's arrival. Any move, paid or free and under any rule, that lands on a HALT cell other than the target ends the move run. Under SHIFT the target is the one standing after the move (game.js:73).
  - The level is scored where it stopped. It gets 0 stars *(design)*, and nothing joins the line or the seal, which takes only the cells actually closed. S.lost is set, S.halted keeps the cell, and UNDO is refused, as after any loss (game.js:82). The card reads 'HALT · stopped on 38 NOAH · 2 moves from the target' (at stride 1, TORAH on day 9443, level 4: Γ from 68).
  - A halted level can be closed again: it gets V3's two doors, AGAIN and REBIRTH.
  - A landing on the target closes as always, also when the target is a HALT cell (at stride 1, 50 of the 448 levels of the 7 HALT days end on one).
  - The start is not a landing. A level that starts on a HALT cell plays from it, and only a move back onto it halts. That covers today's level 29 (55 HEAVEN → 127 ORIGINAL SIN, π offset 9543), TORAH's two ladders (home 62 FIBONACCI) and REBIRTH's own 80: all three start cells are HALT cells. None of 80's six moves (240, 198, 177, 151, 252, 154) lands on one.
  - Daily mode only, like the gold day's free ×i (game.js:59). FREE WALK and THE DOORS have no HALT day.
  - B22's other half, 'on other days they are safe havens', is not built. A haven that held HALT's clock would stop level 29's clock before its first move, since it starts on 55, and under the other rules a haven has nothing to hold.
- *Gets.* About one day in ten (39 of 365 on the fresh road, 29 at stride 1) on which the tape sets its own traps, so B22's 27 cells become ground to plan around. The seal counts 'halted N' *(design)*.
- *Builds on.* D.pi and OPCODES (field.js:11); material.js halt_points, asserted at parts/corpus/check.js:43 (27 cells, sum ≡ 11); apply() (game.js:70–81); the lost branch of won() (index.html:249), which today reads 'SYNC' for every loss without a clock, so it must test S.halted first.
- *Changes.*
  - field.js: solve(s, t, free, ops, avoid) *new parameter*. The relax loop (field.js:44–45) never enters a cell of avoid other than t. The start is the source, so it may be in avoid.
  - levels.js:
    - HALTS *new*, computed from D.pi (D.pi[n] === '9' for n ≤ 256), and haltDay(day) *new*, true when the day's opcode, π[windowBase(day)] (Q2), is 9.
    - plan() sets a private AVOID beside OPSET (levels.js:28) on a HALT day, behind opts.halts (on by default). road() (:61), solveShift() (:49) and par() (:73) read it; in solveShift a layer drops a HALT cell unless it is that layer's target t0·3^k. F5's road(s, t, free, ops) takes avoid as a fifth parameter.
    - The target slides (tapeSpec :91, ladderSpec :114, mirrorSpec :132) keep the plain par, so a window reads the same target on every day. Only par, the road and the par order (:166) change.
    - Every spec gets sp.halts *new*: the 27 cells on a HALT day, null otherwise.
  - game.js:
    - level(): S.halts = new Set(spec.halts || []) and S.halted = null, both *new*.
    - apply(), after the SHIFT step (game.js:73): `if (S.halts.has(v) && v !== S.target) { S.lost = true; S.halted = v; S.stars[S.level - 1] = 0; save(); return v; }`.
    - The recomputed par at game.js:63 (gold days, THE MIRROR) and solveShift (game.js:29–38) take S.halts. Over the 7 HALT days at stride 1 the engine's par equals the plan's on all 896 levels of SCRIBE and TORAH.
    - save() keeps S.halted.
  - Every solver that plans a road on a HALT day takes the same set:
    - HINT (game.js:91, through F5's LV.road) and the panel's road (index.html:292);
    - V1's key test and H2's S.dist;
    - S1's and S3's d(n), where in the reverse BFS a HALT cell gets a distance but passes none on;
    - T3's work();
    - V3's rebirth par.
  - V3's rebirth on a HALT day:
    - Every level can now be lost, SHIFT levels and the eye included (no HALT cell is one move from 137, so the eye halts only after a detour), so rebirth() calls solveShift(80, t0, S.opsList, S.halts) when S.shift. V3, whose losable levels are never SHIFT, needs none.
    - On the 7 HALT days at stride 1, 400 of the 403 levels without SHIFT have a par from 80 of 1–6 (mean 3.54), and 3 JUMP levels have par 0. The 36 SHIFT levels have 1–6 (mean 4.06), and 2 levels end on 80.
    - REBIRTH is hidden on those 5 and on the eye, which replays by AGAIN.
  - index.html:
    - paint() notches each op button from o.f(S.current) and passes halts to A.paint;
    - won() reads 'HALT · stopped on …' when S.halted;
    - the daynote (:162) and the daypill (:212).
  - ar.js: billboard state 9 'halt' *new*, after F12.
  - test.js:
    - check(9450, 'TORAH') beside today's: the next HALT day on the fresh road (9443 at stride 1), for the name whose home 62 is a HALT cell.
    - sp.halts holds the 27 cells (sum ≡ 11) on a HALT day, and is null otherwise.
    - play() (test.js:14–22) follows the rule: a landing on a HALT cell short of the target fails the level. Every level reaches its target in par, and no spec road lands on a HALT cell short of it.
    - Par stays within 1–7 (SHIFT apart, test.js:39), and the curve (test.js:64) holds.
    - Every ordered pair of the 258 points stays connected around the 27 cells, with the flip and without it, so F.cost never meets a null road (field.js:48, :51).
    - plan(d, name, {halts: false}) is the plan without M7, sp.halts apart, and so is plan(d, name) on every other day.
    - A node case for game.js: a move onto a HALT cell loses and refuses UNDO; a move back onto a HALT start halts; a landing on a HALT target closes.

    Scratch copies with the play() rule, the spec-road and sp.halts assertions and two HALT days added pass 4872 checks: at stride 1 with 9443 TORAH and 9498 SCRIBE, and on the fresh road's 93810 digits with 9450 TORAH and 9456 SCRIBE. The other assertions hold in node: no ordered pair is cut off; plan(d, name, {halts: false}) on the 7 HALT days and plan(d, name) on the other 93 deep-equal today's levels.js, sp.halts apart; and a patched game.js loses on 38 after Γ from 68 (TORAH, 9443 at stride 1), refuses UNDO, halts on a move back onto a HALT start, and closes on a HALT target.
- *Numbers* (SCRIBE at stride 1, as this scope's other multi-day figures; node, with the avoid set).
  - On the 7 HALT days (448 levels), the spec road of 162 levels lands on a HALT cell short of its target: tape 133, door 14, ladder 14, mirror 1. The eye's 137 → ∞ → 1 never does, and no HALT cell is one move from 137.
  - 80 of them keep par on another road. On the other 82 par rises: +1 on 68, +2 on 13, +3 on 1. By rule: JUMP 18, FOLD 9, SEED 8, SHIFT 8, IDENT 7, NOP 7, the ladder 7, EXIST 5, HALT 5, STORE 5, SYNC 3.
  - No level becomes unwinnable. Every ordered pair stays connected around the 27 cells and the diameter stays 7, so par ≤ 7 holds (max 7; SHIFT max 6).
  - The doors and the ladder:
    - 4176 (64 → 6, FOLD Γ Γ FOLD ×g, through 193) and 8352 (128 → 6, FOLD INV ×g, through 129) cross. Their HALT-aware roads, Γ INV Γ FOLD ×g and INV FOLD ×g, keep pars 5 and 3.
    - SCRIBE's second ladder (level 40, 56 → 14) goes from par 4 (×i Γ ×i Γ) to 6 (INV Γ Γ ÷g ÷g ×i) on every HALT day.
  - The par order (levels.js:166) puts 93 of the 392 tape slots on another window. On day 9443 the pars sum to 246, against 236.
  - 36 of the 448 levels start on a HALT cell. Today's level 29 is one: at stride 1 its window plays on 2027-01-02 (day 9498) as level 16. There its road ×i Γ ×g ×g Γ (55 → 109 → 83 → 249 → 233 → 127) would halt on 249 EDDINGTON LUMINOSITY at the third move, so par goes from 5 to 6, by ×i Γ FOLD ×g ×g ×i.
  - As if every one of the 100 days were a HALT day: 2327 of 6400 roads cross and par rises on 1093 (+1: 881, +2: 190, +3: 22). No level is unwinnable.
  - TORAH on the same 7 days: 155 cross, and par rises on 75 (+1: 68, +2: 6, +3: 1).
  - On Q2's fresh road (the 93810-digit tape) the 10 HALT days hold 640 levels: 221 spec roads cross, par rises on 98 (+1: 75, +2: 22, +3: 1), 63 levels start on a HALT cell, and none is unwinnable (max par 7; SHIFT 6). As if all 100 days were HALT days: 2149 cross and par rises on 939 (+1: 730, +2: 204, +3: 4, +4: 1), still none unwinnable.
  - plan() takes about 18–21 ms on a HALT day, against 16–18 ms for the same day with opts.halts off (node, this container).
- *Refs* B22, B23.
- *Risks.* Every level of a HALT day can be lost by one move. The marks, the notched buttons and the free first HINT (Q4), which shows the HALT-aware road, carry that, and AGAIN or REBIRTH closes a halted level again. M7 changes the plan on HALT days, so it lands behind opts.halts, with test.js covering both settings.

### Singularity: where the roads end

**S1 · THE HORIZON: the eye as a lensing black hole.** *M*
- *Sees.* 137 stands just past the floor's rim: dlog 72, ray 0, azimuth 101.25°, elevation −34°, 4.97 m out and below the floor plane (ar.js:33).
  - Its pupil becomes a black shadow ringed by a thin gold photon ring.
  - Stars and nearby cells bend into arcs round it. 154 ROAD TO DAMASCUS (×g of 137, 8.45° away) images, at d = 0, at 13.60° and, on the far side of the hole, at −5.14°; at d = 6, at 9.50° and −1.05°.
  - The Einstein radius is a live gauge of d, the number of moves from your cell to 137 with the day's move set: θE = (92/11)°/√(d + 1), where 92/11 is ar.js:33's band step. That gives 8.36, 5.91, 4.83, 4.18, 3.74, 3.41, 3.16° for d = 0 … 6. It is smallest after crossing to ∞, the one cell six moves from the eye.
  - Without a camera the sky bends. With the camera on, the warp overlay draws the shadow and ring over the room. In XR the cells bend (a billboard lens).
- *Does.* Nothing new to learn: the ring reads like the target arrow. On level 56 the player can look at the hole as the first Γ starts.
- *Gets.* A proximity cue for every road near the pole, and 'sighted ∞' on the eye level's card, extending S.seen (index.html:322).
- *Builds on.* sky()'s star loop (fx.js:73–88, in sky() :38–114); airyGlow (fx.js:137, in halo() :123–140); the billboard vertex shader (ar.js:75–91); onScreen (ar.js:224); warp() (fx.js:250–306), whose pole is fixed in screen space, unrelated to where 137 is drawn: warp() maps by moebiusA (fx.js:267–272, :288), so the pole sits at x = ½ − 0.235/aspect, which is 0.265 only on a square screen, 0.368 at 16:9 and just off the left edge at 9:19.5.
- *Changes.*
  - parts/well/well.js *new*, window.FOLD_WELL:
    - d(n), by a reverse BFS over S.opsList at each level open (258 × 7; the flip changes the histogram);
    - thetaE(d);
    - lensDir = normalize(A.place(137)).
  - fx.js sky():
    - uniforms lensDir, lensE and horizon *new*;
    - before the star loop, remap the view direction by β = θ − θE²/θ, using atan(s, c) (acos near 1 loses about 1.8° in fp16);
    - darken by smoothstep(horizon, 1.15·horizon, θ);
    - add gold·airyGlow(1.3405·θ/θE, 0.45), only for 1 ≤ r ≤ 1.831, the first bright ring alone. The central lobe would otherwise paint a gold disc over the shadow, and past r = 1.831 the far form keeps drawing gold rings at 53 % and 34 % of the first's brightness, 13.71° and 18.92° from the eye at d = 0.
  - ar.js:
    - billboards are drawn at their primary image, stretched across by min(θ+/β, 3) and squashed along the radius;
    - lensPlace(n) *new* mirrors the lens in JS for pick() and onScreen() (ar.js:224–229). Without it, taps near the eye miss by up to 5.14°: at d = 0, 154's primary image stands at 13.597°, against its place at 8.452°.
  - fx.js warp(): an overlay lens path at 137's projected uv, with its own alpha and visibility. The overlay's alpha is t·fade·… (fx.js:300), and index.html:349 shows warpQ only while warpU.t > 0, so as built the lens would show only during a Γ warp. There is no map mode: grab() would need a second scene and render pass (shaders notes:104–107).
  - The shadow is the 22 px pupil (ar.js:44), 1.083° at scale 1, scaled by the billboard's state s; or redraw the eye glyph.
  - The lens is on in levels 49–56, on JUMP levels, and whenever d ≤ 2.
- *Numbers.*
  - Moves to 137 with the six moves: 1, 6, 22, 58, 111, 59 and 1 cells at d = 0 … 6. The six at d = 1 are 105, 120, 121, 154, 217 and 242; the one at d = 6 is ∞. With the flip: 1, 6, 22, 63, 122, 43, 1.
  - The photon ring sits at the Airy first bright ring, r = 1.3405 (value 0.0173, shaders notes). Its half power spans 6.79–10.34° at d = 0 and 2.56–3.91° at d = 6. That makes it an Einstein ring 2.9–7.7× the radius of the 1.083° shadow, not the thin rim on it that Sees describes; a rim hugging the shadow needs a second term *(design)*.
  - Costs: the sky gains about 45 ops plus an atan, a sqrt, a sin and a cos (+3 % at 23 samples). The warp overlay is about 65 ops with no fetches. The billboards add about 50 ops × 1032 vertices.
- *Refs* A14, A32, B18, B32, A5.
- *Risks.* On `tiny` the sky has 0 samples and no stars to bend, so draw the shadow and ring only. That sky is about 60 ops a fragment (shaders notes:30–31). As a full-screen term, the shadow and ring (about 45 ops, an atan, and the pow and cos of airyGlow) nearly double it, on the class whose frame is already 29.5–32.4 ms (Budgets and risks). On `tiny`, draw them as one camera-facing quad at place(137), 2.8·θE across *(design)*.

**S2 · THE DISC: Γ's two orbits as an accretion disc round the eye.** *M*
- *Sees.* Round the eye, tilted 47.78° (acos 0.672, A14, A22), two rings of 128 dots:
  - Inside, Γ's orbit of 1: 1 at slot 0, 120 at 6, 0 at 7, 256 at 8, 137 at 126, ∞ at 127. Its line dives into the shadow at 137, rises as a jet up Γ's arc to ∞ at the zenith, and returns as 1.
  - Outside, the orbit of 3: 16 at slot 101, 241 at 7, 128 at 108. It never falls in.

  The dots rest dim green, flare on arrival, and decay with an amber core when over-energised: Twelve Rays' energy model (T1), laid in Γ's own order, so Γ is the spine here as ×g is in the sketch. 46 and 92 sit apart, fixed.
- *Does.* Each Γ advances your mark one slot (360/128 = 2.8125°) and turns the disc one slot during the 1.1 s flow. On JUMP levels, where Γ is free, the player rides the ring toward the plunge.
- *Gets.* On the seal, 'Γ¹²⁸ = 1, the disc turned once' when the day's Γ moves reach 128, Γ's order. It is a sometimes reward: par roads reach it on 54 of the 100 days from 9422 (min 91, median 137, max 184 Γ moves a day).
- *Builds on.* The Γ orbit arcs drawn during a Γ flow (ar.js:150, :196–197, :234); THE TURN's ring, Points and marker pattern (relief.js:187–215).
- *Changes.*
  - parts/well/disc.js *new*, FOLD_DISC.build(THREE, {center: place(137), tilt, radii}):
    - Points(256) with attributes aSlot, aOrbit, aHit and aE. Energy is aE·e^(−1.828(t − aHit)), amber above 1.
    - Two LineLoops; the inner one is routed through the shadow and a 33-point jet.
    - A 1024-chord ring buffer with aBorn, alpha e^(−2.892·age).
    - The CPU writes only on an arrival.
  - index.html: the disc gets its own slot, MON.disc *new*, because monApply disposes MON.obj at every level (index.html:190). It mounts in levels 49–56 and on JUMP levels. Arrivals on 0 or ∞ (ray −1) are guarded.
  - material.js: singularity.orbits *new*.
- *Numbers.*
  - Radii: 0.882 m = 6·tan 8.3636°, which is S1's θE at d = 0; and 1.542 m (adding the 0.66 m quad, ar.js:128), 14.41° from the eye.
  - The sketch's rates (Twelve_Rays.html:329–337): decay 0.03 a frame = 1.828/s; persist 12 → 2.892/s; spin 0.0006 rad a frame → one turn in 174.5 s.
  - About 2.6k vertices. With the floor (16646) and THE TURN (515): about 19.8k.
- *Refs* B18, A14, A22, B32, A32.
- *Risks.*
  - Additive colour on the alpha canvas over camera video (ar.js:124) over-brightens; use normal blending, as fx.js does.
  - Bending the disc with the point-lens equation is an artistic licence: the disc sits at the lens, not behind it.
  - On a portrait phone the eye at −34° falls under the ops bar when looking level.

**S3 · THE SLOW CLOCK: HALT's time dilates near the eye.** *S*
- *Sees.* On a HALT level the clock shows proper time with a rate tag. A third arrow, #arr-eye, points at 137. As the player nears the eye, the clock's ticks spread out and drop in pitch, and the drone slides down.
- *Does.* Trades: a detour toward 137 slows the clock, but each detour move counts against par. On a HALT day the detour must also miss the HALT cells (M7). Going through to ∞ (d = 6) makes the clock run fastest.
- *Gets.* HALT becomes winnable by thought rather than speed. The card reads 'τ … s of … s real · … s borrowed from the eye', and the seal totals the seconds borrowed that day.
- *Builds on.* tick() runs on wall time (game.js:85); arm() (:68); arrows() (index.html:316–326); clock() (sound.js:253–259).
- *Changes.*
  - game.js:
    - arm() sets S.tau and S.tLast.
    - tick() integrates dτ = dt·rate, with rate = f(d)/f(d_start) and f(d) = √(1 − 1/(d + 1)), d floored at 1.
    - On a HALT day d is S1's reverse BFS in which a HALT cell gets a distance but passes none on (M7), since a road to the eye through one would end the run. None of the six cells at d = 1 (105, 120, 121, 154, 217, 242) is a HALT cell, and neither is 137, so the eye stays in reach from all 258 points.
    - The floor matters: in the absolute form, standing on 137 stops the clock, and since every HALT start is at most 5 moves from 137 (6 on a HALT day, around the HALT cells, M7), every HALT level would become unloseable.
    - S.borrowed is saved.
  - sound.js: clock(s, rate) and dilate(rate) *new*, using OscillatorNode.detune = 1200·log2(rate) cents. tuneDrone ramps only .frequency (sound.js:108–111), so the detune survives retuning.
  - index.html: the rate tag and #arr-eye.
  - story.js days[9].line has 22 words today against the limit of 25 (story/check.js:29), so at most 3 can be added.
- *Numbers.*
  - f(1 … 6) = 0.7071, 0.8165, 0.8660, 0.8944, 0.9129, 0.9258.
  - Over 100 days, HALT starts sit at d = 1: 6, d = 2: 40, d = 3: 98, d = 4: 137, d = 5: 156 (of 437), counted with the six moves. Counted with each level's own S.opsList, as S1's d(n) is, they are d = 4: 138 and d = 5: 155. From the commonest starts, the rate one move from the eye reads 0.7746 (−4.42 semitones) from d = 5 and 0.7906 (−4.07) from d = 4; from d = 3 it is 0.8165.
  - With the HALT cells removed, as on a HALT day, 67 of the 437 starts sit one move further from the eye (3 → 4: 22, 4 → 5: 45), giving d = 3: 76, d = 4: 115, d = 5: 200; none passes 5. On the 7 HALT days themselves (stride 1), 8 of the 38 HALT starts move (3 → 4: 3, 4 → 5: 5). On Q2's fresh road the 10 HALT days hold 77 HALT starts; 15 move, and 5 of them reach d = 6. Over all 258 points eight cells join ∞ at d = 6: 29, 41, 114, 127, 128, 163, 166 and 228.
  - Because the form is relative, the thirty seconds stay true at the start. The absolute form would stretch them to 42.4 s at d = 1.
- *Refs* A2, B22.
- *Risks.* Nothing flashes. Show both the proper and the real seconds. The dilation changes HALT's thirty-second rule (game.js:18, :85), so it lands behind a flag, as Budgets and risks asks of every plan change. Add a node case: a level held at its start still loses at 30 s of wall time, and a clock run at d = 1 throughout, on a level that starts at d = 5, loses at 38.7 s (30/0.7746). On a HALT day a halt ends the level before either, since tick() stops once S.lost is set (game.js:85); the node case adds a landing on a HALT cell, which loses at once whatever the clock reads. The seal totals the seconds borrowed on closed levels only *(design)*.

**S4 · THE CROSSING: level 56 as an in-fall to ∞ and a rebirth at I AM.** *M*
- *Sees.* Level 56 runs 137 → ∞ → 1 (levels.js:145–151; par 2, free moves counted).
  - **First Γ.**
    - A title slams in: '∞ · 1/0 · the open circuit', the atlas's own words for ∞ (ar.js:59).
    - The cells stream up Γ's arc from the eye to the zenith (the orbit arcs, ar.js:150; S2's jet). ar.js:196 skips every orbit segment that touches ∞, so until S2 lands no arc runs from 137 to the zenith. Add arc(place(137), place(257), 18) and arc(place(257), place(1), 18) to A.orbit while S.kind === 'eye'.
    - The sky turns to its negative, capped so it is never brighter than the positive band (B32: ∞ as the zenith).
    - On screens with no camera and no gyro the view leaves the body (V1's lift) and rises toward ∞: a climb of 124° of sky.
  - **Second Γ.** 'I AM' slams in (a word of cell 1, data.js). The view falls back, and the field is reborn by the bloom, which births 1 first after SEED (ar.js:163–168).
  - On the chart (T1), both reflections run along ray 0 (137 at depth 6, 1 at depth 0), out through the rim and back.
- *Does.* The same two free moves. The player may look up during the first flow to mark 'sighted ∞': at the pitch clamp of 1.4 rad (index.html:310, :312) the zenith is 9.8° above screen centre. Under gyro a drag turns only the yaw (index.html:310), so ∞ comes on screen only with the device tilted at least 55° up (90° less the 35° half-height of the 70° view, ar.js:126). A player who cannot tilt the phone that far needs another way to sight ∞, e.g. a tap on #arr-cur, which points at ∞ while the player stands on it; the arrows take no pointer events today (index.html:57).
- *Gets.* A unique card, THROUGH THE EYE, carrying the line through Γ (U5); 'crossed' and the ∞ badge on the seal; then the tunnel to HEAVEN (V2).
- *Changes.*
  - fx.js sky(): uniform 'negate' *new*, col = mix(col, cap − col, negate), with cap = 0.120·green, a vec3 (fx.js:15, :96). The negative's brightest is then at most 0.080·green (the cap less the 0.040·green floor), under the band's 0.085·green: over the sphere, luma 0.047 against 0.061 at the band. A scalar cap of 0.120 would break the claim: red and blue reach 0.100 and 0.095 at d.y = 0.63, luma 0.083. Spokes and stars clamp to black in the negative.
  - index.html:
    - a #slam overlay *new* (80 ms in, 600 ms hold, 300 ms out; *design*), with role='status' and aria-live='polite' so a screen reader reads both titles;
    - the choreography in move() when S.kind === 'eye';
    - the won() timer (index.html:231, flowDur + 150 ms) moved past the 3.35 s bloom.
  - ar.js: restore() *new* rewrites iPos from place(n) before bloom(). It is needed only if the stream writes iPos, as the perfect day's flow into ∞ does; after init (ar.js:129) nothing writes the cells' iPos, and flow() touches only iFrom (ar.js:203).
  - game.js: S.crossed, and S.seenInf (onScreen(257) in front with |x|, |y| ≤ 1).
  - game.js:63 (fix): on a gold day it drops spec.par and recomputes par with ×i free. That gives THE EYE par 0, while countFree (levels.js:147) still counts both Γ. On day 9472 (2026-12-07) the crossing closes '2 / par 0' with 1 star. Keep spec.par when spec.countFree.
- *Refs* B32, A32, B18.
- *Risks.*
  - One negative per crossing, ramped over the 1.1 s flow.
  - In camera mode the two Γs invert the room video twice in about 2.2 s (index.html:237); the governor counts both (U3).
  - Never move the rig under gyro, with the camera on, or in XR.

**S5 · THE OTHER SIDE: 120 as the white hole, the fold as the wormhole, 46 and 92 as the lobes.** *M*
- *Sees.*
  - 120 GOLDEN RATIO is Γ's zero (Γ(120) = 0, field.js:15). It is drawn as the eye's negative, a dark disc with a pale rim (A32: "the zero a dark spot"), at azimuth 281.25° and elevation +32.91°. It is 178.9° from 137, so it is behind and above you whenever you face the eye.
  - Standing on 137 or 120 lights the fold thread between them gold (120 + 137 = 257). The thread passes 0.057 m from the centre, through the player.
  - During every Γ flow, twelve field lines arc between Γ's fixed points 46 and 92 while everything else flows. In w = (Z − 46)/(Z − 92), Γ is ×153 (B18), the split kind, which carries every point along circles through both fixed points (A32).
- *Does.* Plays a new level 52, THE OTHER SIDE: 137 → 0 SEED. It has exactly two par-2 roads and no one-move road:
  - FOLD Γ, through 120: out of the white hole into the seed;
  - Γ INV, through ∞.

  The level is the same every day, so tomorrow the player can take the other throat. It opens on GO or TAPE (R3). It cannot be lost (NOP, no clock), so the slot falls back only through TAPE, to the tape level it holds.
- *Gets.* Three stars either way, and a per-name record of the throat taken. On a gold day ×i is free (game.js:59) and game.js:63 recomputes par: ×i ×i Γ reaches 0 at cost 1 (137·16² = 120), so on day 9472 (2026-12-07) both throats would score 2 stars. game.js:63 keeps spec.par for this kind, as S4 does for the eye. Once both have been taken, on any two days, the seal says 'both throats'.
- *Changes.*
  - levels.js:
    - EXTRA[52] = 'other' *new*, under R3's flag and rule. It overlays the tape level plan() sorted into slot 52 and keeps it as spec.fallback (today window 50, SEED 0 → 104, par 4). otherSpec() names both roads; LV.road picks one of them. EXTRA is built in its own pass (R3), so 'other' never reaches the eyeSpec fallthrough at levels.js:173. Its rule is fixed at NOP, as the eye's is fixed at JUMP (levels.js:146), not read by digitFor (levels.js:158, which reads the tape under opts.special 'tape'): IDENT or FOLD would make one throat cost 1 and the other 2, EXIST opens ×i ×i Γ at cost 1, and JUMP gives par 0.
    - levels.js:176 copies a chapter's first SPECIAL slot onto its opening level. EXTRA is not in SPECIAL, so chapter 7's opening level keeps 56's special.
  - test.js asserts the kind, par 2, both roads, and the fallback as R3 lists.
  - ar.js:
    - atlas kind 'zero' *new* for 120;
    - A.lobes *new*: 12 arcs of 33 points (396 vertices), at opacity 0.4 × the Γ flow's remaining fraction, like the fold threads (ar.js:147–148).
  - story.js: the facts ['fold', 137, 120] and ['gamma', 120, 0] exist (story.js:217–218); ['inv', 257, 0] is new. 120's voice (story.js:167) is already at the 20-word limit (story/check.js:38), so the 'both throats' line goes on the seal.
  - localStorage 'fold.throats.<name>' *new*, or a field in Q1.
- *Numbers.*
  - 46 and 92 sit at elevation −0.545°, azimuths 106.875° and 174.375°: 67.5° apart, and 33.87° and 75.76° from 137.
  - The pair, the eye and the disc fit a 16:9 desktop view (horizontal FOV 102.45°), but not a portrait phone (35.8°).
  - Over 100 days, 54 of 6400 par roads pass 120.
- *Refs* A32, B18, B32, B17.
- *Risks.* Chapter 7 loses no tape level.
  - THE OTHER SIDE stands in front of the level plan() sorted into 52 (levels.js:165–167), the chapter's fourth by par. For SCRIBE on day 9422 that is window 50's SEED 0 → 104.
  - The other six keep their slots, so the par curve holds whether the slot closes or falls back.
  - Over the 100 days from 9422, the level it holds is NOP 27, STORE 13, FOLD 13, IDENT 12, EXIST 12, SYNC 11, SEED 5, HALT 4 and SHIFT 3, at par 2–5 (mean 3.62).
  - A closed OTHER SIDE reads no digits, so that window goes undecoded (M2).
  - Nothing flashes.

---

## Twelve Rays and Sisyphean Heat in the game

**Port both, load neither.**
- Both sketches load p5.js 1.7.0 (about 800 kB) from cdnjs and their fonts from Google Fonts (lines 4–7 of each). The offline shell cannot serve either (sw.js:3).
- A p5 canvas is screen space, and cannot anchor to a turning device or a WebXR room.
- Each sketch uses only a handful of primitives, and they map one to one:
  - Twelve Rays goes onto a canvas 2D overlay: blendMode(ADD) becomes globalCompositeOperation 'lighter', the background fade becomes fillRect at alpha 12/255, and random() becomes Math.imul hashes, so every device agrees.
  - Sisyphean Heat goes onto typed arrays and one three r128 render target in floor space.
- Their colours become page tokens beside index.html:15's, checked on --ground #0a0d10 (WCAG 1.4.3 text 4.5:1, 1.4.11 strokes 3:1):
  - phosphor (0, 252, 0) → --phos #00fc00 *new*, U1 MATRIX's green, 13.8:1, for chords and node glow. The sketch's text green (0, 160, 0), U1's #00a000, is 5.6:1 and carries over; its dim green (0, 108, 0) is 2.9:1, under 3:1 even for its bar bodies (Twelve_Rays.html:545) and failing as the header's second line (:556, :561), so that text is --dim (7.5:1).
  - amber (255, 212, 0) → --amber #ffd400 *new*, U1 SINGULARITY's, rings only: --gold #c9a84c and the billboard's [1, 0.83, 0.35] already mean the target (T2).
  - ascent #2f6fb8 → --climb *new*: 3.8:1, enough for strokes and bar segments, never for text.
  - descent #ff6a2a → --fall *new*: 6.8:1, 37 ΔE76 from --red #ff7b7b (16 under tritanopia), so a loss keeps --red and its own words.
  - The climb/fall pair stays 95–114 ΔE76 apart under protan, deutan and tritan simulation (Machado 2009, severity 1): keep it.

In the one-world thesis, Twelve Rays is the field's code seen as a chart: the dlog written in base 12, with the point at infinity as its rim. Sisyphean Heat is the ground's horizon: on every conic sheet the summit is the place where 256 wraps to 0.

| piece | driven by | shows in | port | cost |
|---|---|---|---|---|
| T1 chart | S.current, S.target, S.home, S.road, S.ops, the reach over S.opsList | HUD inset, TUBE view | canvas 2D | 0.73–2.36 ms *SwiftShader* |
| T2 miners | day, S.offset | chart; one ring in the sky | canvas 2D + hash32 | 168 hashes a second |
| T3 amber | day, S.offset, S.road, stars | billboards, won card | levels.js search | 5.2 ms a day median |
| T4 ledger | S.road at each close | chapter card, seal | canvas 2D | below T1's |
| T5 boot | day, the day's cell | start screen, bloom | canvas 2D + DOM | replaces a 40.7–42.9 ms 3D frame |
| H1 crowd | R1's ratio c = current/target (the multiplier), the chapter's sheet, every move | the floor | typed arrays + render target | 0.63 ms CPU at 3584 (Xeon) |
| H2 climb | distance, par, slack, undo, loss | HUD bar, floor climber | DOM + LineSegments | ≤ 20 strokes |
| H3 day's heat | the climbs, the day's counters | the seal card, PNG | canvas 2D | once a day |

**Twelve Rays, sketch → game.**

| sketch (Twelve_Rays.html) | in the game |
|---|---|
| cell n on spoke ray(n) = dlog mod 12, radius by depth = dlog div 12 (:347–368) | the same rule (field.js:19). SEED at the centre, ∞ the rim circle at depth 22 |
| 28 miners stepping ×g (bias 0.62), fold, inv, obs (n + 1) | 28 deterministic miners over the six moves. obs is dropped, because it is not a move |
| hash32(seed, cell, step·977 + id); a share at ≥ 9 trailing zeros (:381–426) | per-level share cells at ≥ 4 bits. 9 bits is too rare: only 85 of 1698 levels have one on a 3★ road of any length, 30 within T3's 8 moves |
| per-cell energy, an amber core, flares | the same rules, on the chart and in S2's disc |
| chords, ×g bright and the rest dim | the player's road and the miners' walks, in move styles |
| bars R0–R11: hashes and best bits (:538–551) | arrivals per ray on the day's closed roads, and best work bits |
| header 'CASCADE GF(257) P=257 G=3 12 RAYS' | the TUBE header and the MATRIX skin's status strip (chapters 4–5, U1) |
| cell 62 marked with its name-word | 62 FIBONACCI, the door 0062 |
| inv(0) = 0, ×g(0) = 1 (:351, :353) | the game's own rules: inv(0) = ∞ and 0·3 = 0. Miners step off SEED and ∞ to 1 (:409) |
| spin 0.0006 rad a frame | one turn in 174.5 s at 60 fps, driven by dt; off under CALM |

**Sisyphean Heat, sketch → game.**

| sketch (Sisyphean_Heat.html) | in the game |
|---|---|
| 3-octave Perlin terrain drifting in time | the chapter's sheet V(a, b)·m mod 257, with m = c = current/target, R1's ratio. The drift is the relief's time step, applied on each move |
| climb up the gradient, with lateral wander | the integer gradient m·(2a + b, a − 2b) on the norm, reduced to (−128, 128] |
| effort 160 ± 30 %, cost 1 + 90·slope | the crowd's constants rescaled by 1/58.1. The player's own effort is par + slack, one segment per paid move (H2) |
| summit at slope < 0.00045 | over the crest, at the 256 → 0 wrap. The field has no flat summit; the five stars are saddles (A7) |
| fall with gravity 0.55, land, reborn in a basin | the same. Reborn at the lowest of 4 samples; the player's climber falls on a loss or an undo |
| heat 18·slope; ascent #2f6fb8, descent #ff6a2a | heat gain 0.31; the same colours |
| fade alpha 7 a frame on the canvas | a floor-space render target, 7/255 per frame plus a 1/255 subtract |
| counters: climbs completed (the sketch counts landings, stats.falls, :379, :490), steps, summits | levels played, counted moves, closes at par (as H2; a close over par is not a summit); plus falls = losses + undos |

**T1 · THE TWELVE RAYS CHART: HUD inset, full-screen TUBE, TABLE face.** *M*
- *Sees.* A dark phosphor disc 132 CSS px wide, at bottom left beside the quest box.
  - Layout: spokes in the floor's RAY_RGB (ar.js:20–28) at low alpha, 22 faint rings, 256 nodes.
  - Marks: you (green), the target (gold), home (blue), 62 FIBONACCI (the door 0062) as the sketch's one marked element, and the quest cell only once it has been answered.
  - The road burns in as chords in its moves' styles and fades by the sketch's persistence. The six reach chords show faintly.

  Each move has its own picture (computed over field.js):

  | move | on the chart |
  |---|---|
  | ×g | one spoke on (234 cells); one ring out at the spoke 11 → 0 turn (21); one seam chord 86 → 1 across the whole disc |
  | FOLD | ray +8 and 10–11 rings out on the front half; ray +4 and 10–11 rings in on the back half |
  | INV | the disc turns inside out: ray r → 4 − r; depths sum to 20 (147 cells) or 21 (108), and 1 stays at the core; SEED ↔ ∞, centre ↔ rim |
  | ×i | for the 64 cells with dlog < 64, the same spoke 16 rings out; otherwise ray +8 and 5 or 6 rings in |
  | Γ | a long chord; 22 of 254 cells keep their ray |

  A tap opens the TUBE view at 360 CSS px, with the header 'CASCADE GF(257) P=257 G=3 12 RAYS' and the move labels at the chord ends. A second face, TABLE, is A8's 16 × 16 dlog picture: ×i is a rigid quarter turn for 225 cells and FOLD a half turn for 224; 256 and ∞ show as pips off the grid.
- *Does.*
  - RAYS (an aux button) or key m toggles the inset.
  - In TUBE, holding brings up a 4× lens under the finger, and releasing on a node opens the cell panel, which also answers the quest (showCell → questDone).
  - Without a pointer: in TUBE the sky is not drawn, so the arrow keys' look (index.html:312) gives way to a focus ring, ←/→ one ray and ↑/↓ one ring, and Enter opens showCell. #rays is role=img with an aria-label that paint() refills (you, target, home: cell, ray, depth), so the chart is neither pointer-only nor silent (WCAG 2.1.1, 1.1.1).
  - The six move buttons stay live in TUBE, and every node slides from its preimage over the same flowDur as the sky, so a desktop or Pi player can play the whole day in 2D.
- *Gets.*
  - Planning the player can read, including why ×i sometimes keeps the ray and sometimes does not.
  - The road burned into the tube as light.
  - A 2D play mode about 17–18× cheaper than the 3D frame on a `tiny`-class GPU.
  - Crossing the rim (any arrival at ∞) or the seam (86 ×g → 1, or 1 ÷g → 86) makes the chart fall: the rings collapse into the core over 0.6 s and re-bloom ring by ring, in dlog order. It fires once a day; otherwise SEED-start levels (6.47 a day over 30 days) would fire it on every INV out of SEED. Under CALM it is a 150 ms cross-fade (U3).
- *Builds on.* The reach and road lines (ar.js:183–191); flow() (ar.js:201–205); G.reach() (game.js:69); paint, move and showCell (index.html:210–232, :291–304).
- *Changes.*
  - parts/rays/rays.js *new*, window.FOLD_RAYS: layout(W), kind(opId, n), and Chart(canvas, {size, dpr, face, colour}) → {set, frame, flow, pick, lens, fall}.
    - A static layer is cached offscreen; a tube layer is faded each frame with fillRect at alpha 12/255 (the sketch's persist) and drawn with 'lighter' compositing. That is 2D compositing, so fx.js's normal-blending rule for the WebGL alpha canvas still holds.
    - Spin and fades run on dt, so a Pi at 30 fps replays at the same speed.
  - index.html:
    - <canvas id=rays> inside #ui, so the WebXR dom-overlay carries it: left 10 px, bottom 178 px (196 px under the 420 px breakpoint).
    - paint() passes {current, target, home, road, ops: S.ops for the road's hues, and the reach over S.opsList}.
    - In TUBE, skip A.frame() but keep G.tick(), the lost check and S.seen. arrows() runs all three today (index.html:322–325), so split it. Not in XR: setAnimationLoop (index.html:349) is the session's frame loop, and a skipped render leaves the room without the field.
  - material.js: twelve_rays *new*. sw.js: add to SHELL.
- *Numbers.*
  - 21 rings of 12 plus a short 22nd ring of 4 (dlog 252–255 = cells 165, 238, 200, 86, on rays 0–3), inside ∞'s rim circle. The core ring is 1 3 9 27 81 243 215 131 136 151 196 74.
  - The inset's ring spacing DR is 2.31 px, so it is for marks only. TUBE has R0 15.1 px and DR 6.3 px; the lens gives 25.2 px, above WCAG 2.5.8's 24 px.
  - On a 390 px phone the inset ends at 142 px and the quest box starts at 146 px.
  - *SwiftShader:* the inset (benchmarked at 168 CSS px) 0.73 ms; TUBE at 540 px 1.16 ms (1.76 ms flowing); 1000 px 2.36 ms. The game's 3D frame is 29.5–32.4 ms p50 while playing (14 draw calls, 16646 points).
- *Placement decided.*
  - Not on the floor, as the void direction proposed. The floor belongs to the relief, and a city of 12 avenues puts cell n at (ray·30°, depth), not under its sky azimuth of dlog·1.406°, so the floor's road would not line up with the sky's.
  - Not a second polar disc in the sky: S2 borrows only the energy model.
- *Refs* A8, A15, A34, A12, A33, B2, B20, B30.
- *Risks.*
  - RAY_RGB[0] (377 nm) is dark violet on the tube: draw spokes at low alpha, labels in --text. RAY_RGB rays 0–3 (377–440 nm) reach only 2.29–2.83:1 on --ground, under WCAG 1.4.11's 3:1, so any ray mark that carries meaning gets a 1 px --dim outline.
  - At most two new aux buttons, and one on a WebXR device, where ENTER appends 'AR · the room' to the LADDER row (index.html:339). A fourth row of #ops covers #quest and the inset by 15–20 px (Playwright, 390 × 844 and 1280 × 720).

**T2 · THE MINERS: the day's walkers find each level's work.** *M*
- *Sees.* On the chart 28 walkers trace chords: ×g bright and thin, the other moves dim (the sketch's alphas, 70 against 26–34). The cells they land on glow and decay, with amber cores when over-energised.

  When a miner first lands on one of the level's share cells (T3), an amber ring expands there and the cell keeps a thin ring. It must be a ring, not an amber fill: amber [1, 0.83, 0] is almost the target's [1, 0.83, 0.35] (ar.js:178), 22.3 ΔE76 apart and 2.0 under tritanopia (Machado 2009), and sixteen amber cells would read as sixteen targets. In the sky the same billboard plays one ring and pings at its ray's pitch (snd.cell, sound.js:197).
- *Does.* Nothing is required: the miners start with each level and run while the player plans. The player can race them for 'found first'.
- *Gets.* The level's work revealed by visible work rather than handed out, and the same 28 walkers for every player on that day and level.
- *Changes.*
  - field.js: hash32 and zeros *new*, copied verbatim from Twelve_Rays.html:381–391. Math.imul is exact on every engine.
  - rays.js: Miners(day, offset, 28) *new*.
    - Miner i starts at 1 + hash32(day, offset, i) mod 256.
    - Its k-th choice is r = hash32(day ^ 0x51ED, offset·977 + i, k)/2³². This is a new salt; the sketch multiplies the step, not the offset (line 413).
    - If r < 0.62 the move is ×g; otherwise ÷g, FOLD, INV, ×i or Γ at 0.076 each.
    - A landing on SEED or ∞ is reborn at 1 (the sketch's step-off rule, line 409).
    - Six steps a second. Energy +0.55 per arrival, capped at 1.6; 2.2 on a share; ×0.97 a frame.
    - Flares go through a 333 ms queue. Miners pause while the page is hidden (index.html:351).
  - game.js: S.found *new*, reset each level.
- *Numbers.*
  - Over 30 days × 64 levels the move mix comes out at ×g 61.9 % and each other move at 7.6–7.7 %.
  - With the cap, all shares are found at a median of 6.17 s (p90 8.67 s, max 18.83 s).
  - Uncapped, first-discovery flares in any 1 s window reach a median of 8 and a maximum of 17, so the cap is required.
  - Optional sky miners: 700 vertices and 2 draw calls, off in camera mode and in XR.
- *Refs* A14, A4, B23, C7, D2.
- *Risks.* The miners dim to 30 % during flowDur, and stop once every share is found (battery). Under CALM the walkers are not drawn and each share's ring appears without expanding.

**T3 · AMBER: each level's proof of work, and the BITS lens.** *M*
- *Sees.*
  - A level's share cells are the cells c in 1 … 256 with zeros(hash32(day, c, S.offset)) ≥ 4 *(design)*: 15.95 a level on average over the 1698 eligible levels (15.78 over all 1920).
  - Arriving on one plays an amber flare on its billboard and an amber CRT pulse (FX.pulse), and the voice speaks from 51 (NONCE · LEDGER, story.js:54, :121; SHARE is one of 51's words in data.js, not yet in the story).
  - The won card gains '◆ AMBER · the road struck 8 H, 8 zero bits'. A level closed without one names, afterwards, the share that lay on a 3★ road.
  - BITS (key b, or a long press) shows the seven reach cells' code: dlog in 8 bits (×g adds 1, FOLD adds 10000000, ×i adds 11000000, INV gives 256 − d). The dlog's trailing zeros give its 2-adic depth t: the cell is a 2^t-th power. Work bits are shown for revealed cells only.
- *Does.* Takes up an optional second goal on every level except SHIFT levels, the eye and FREE WALK: close at 3★, in 8 moves or fewer counting free moves, on a road that lands on a share cell (the target counts: without it, 666 levels, not 720). Plans a detour through an amber cell that still lands on par; UNDO lets them try again. The free HINT (Q4) shows the shortest road and never the shares or the witness. Followed from the start, it takes AMBER by itself on 376 of the 1698 eligible levels (spec roads, as in Numbers): the spec road strikes a share on 429, but 53 of those roads run past 8 moves. The other 344 amber levels need a road of the player's own. A paid hint caps the level at ★★, so it rules AMBER out there.
- *Gets.* An amber mark ◆ per level, never a star: S.stars and the star total are computed as today (game.js:76), and AMBER adds nothing to them. It is counted on the seal ('◆ n amber') and in SHARE, and kept in THE BOOK (Q1).

  Example from today: level 4, 233 COLLISION RESISTANT → 212 PHOTOSYNTHESIS (FOLD free, par 3, offset 9443).
  - It has 15 share cells, and only 8 H lies on a 3★ road.
  - The witness road FOLD ÷g INV Γ FOLD (233 → 24 → 8 → 225 → 45 → 212, 3 paid moves) strikes 8 bits.
  - The level's own road strikes 0, 0, 0 and 1 bits.
- *Changes.*
  - levels.js: work(spec, eng) *new* returns {bits: 4, cells, possible, witness}.
    - It runs an exhaustive layered search over (cell, paid, struck), to 8 moves, that never reaches the target early. The two-sided 1001/1 Dijkstra misses 11 levels.
    - It is computed in index.html openLevel from G.S after game.level(), so gold days and the 6↔9 chapter agree with the engine. game.js never references FOLD_LEVELS today. The search moves by the engine's rules, so on HALT days a HALT cell other than the target ends a branch, as it ends the move run (B22, decision 3).
    - The salt is S.offset in every mode; game.js:57 fills it for doors.
  - game.js: S.work, S.struck, S.bestBits (recomputed in undo()), S.amber[L − 1], saved in save().
  - test.js: plays every witness (3★, ≤ 8 moves, a share struck) and asserts that no road exists where none is claimed. With game.js loaded, it also asserts that every level's stars are the same with work() on and off.
  - STORY.work *new*, spoken from 51 and checked.
- *Numbers.*
  - Days 9422–9451, SCRIBE: 1920 levels, of which 192 are SHIFT and 30 are eyes, leaving 1698 eligible.
  - Amber is possible on 720 of them (42.4 %) at 4 bits, 426 at 5 bits, 256 at 6 bits. Today: 24 of 58 at 4 bits.
  - The spec's own road strikes a share on 429 levels, so at least 291 need a different road.
  - Shortest amber road lengths: 1 move: 2 levels; 2: 16; 3: 62; 4: 219; 5: 224; 6: 116; 7: 55; 8: 26. Uncapped, they run to 153 moves at 5 bits, hence the cap.
  - The search takes 5.2 ms a day median, 35.6 ms at most.
  - The rate: at the sketch's 9 bits, today's 338 hashable spec-road arrivals (T4's 339 less the one at ∞) would strike 338/512 = 0.66 shares in the whole day. At 4 bits they strike 21.1 expected (19 today).
- *Refs* B20, C7, C1, B23, D2.
- *Risks.* Skill or luck? The share set is fixed and shown, so finding the road is the skill. The first level where amber is possible says so once, in a card line: 'AMBER is optional: strike a share cell on a 3★ road of at most 8 moves for ◆. Stars do not change.' It is not a voice, because a STORY voice may use only its own cell's words in capitals (story/check.js:39), and AMBER is no cell's word. The flag is 'amber' in 'fold.prefs' *new*. Stars are untouched; test.js asserts it.

**T4 · THE RAY LEDGER: the sketch's bars at chapter end and on the seal.** *S on T1*
- *Sees.* At each chapter's last level the won card holds a TUBE canvas. It replays the chapter's eight roads as chords over 4 s, then draws the twelve bars R0 … R11 in RAY_RGB, with each ray's wavelength and best work bits (the sketch's drawRayBars, Twelve_Rays.html:538–551). Home's ray is outlined and the line's cell's ray is ticked. The seal shows the day's bars and the amber and found-first counts. SHARE carries a 12-character sparkline.
- *Does.* Reads its day; posts the sparkline.
- *Gets.* A reward at every chapter close, and a fingerprint of the day. Today, by spec roads:
  - 339 arrivals (one of them at ∞);
  - arrivals per ray R0–R11: 31 34 23 24 25 24 16 32 36 20 30 43;
  - best bits per ray: 4 7 5 5 3 6 3 4 4 9 5 8;
  - sparkline ▆▇▅▅▅▅▃▆▇▄▆█.

  'Full wheel' is not a badge: the rays touched per chapter are 12 11 12 11 11 12 12 12, so it would be nearly automatic.
- *Changes.*
  - game.js: at each close, count arrivals and bits from S.road, so UNDO cannot inflate them, using each arrival's own zeros. S.rays[12] and S.bits[12] *new*.
  - rays.js: bars() and replay() *new*.
  - index.html: won() draws the ledger when S.level % 8 === 0 && !S.lost; endDay() draws the day's. The canvas is 100 % wide up to 394 px; on a 390 px phone the card's content is 304 px wide (index.html:65–67; box-sizing is border-box, :16, and the card has a 1 px border, :67).
- *Refs* A15, A30, B30.
- *Risks.* U+2581–2588 are present in DejaVu Sans Mono (Raspbian). Bars are labelled R0–R11 with nm, never by colour alone, and outlined in --dim, since rays 0–3 are under 3:1 on --ground (T1). Under CALM, show only the final frame.

**T5 · THE BOOT: the start screen mines the day's block, and ENTER types the AXIOM.** *S; the AXIOM mode M*
- *Sees.* Behind the title, the tube in the day's colours.
  - One walker leaves SEED and walks ×g through 3⁰ … 3²⁵⁵, the bloom's order (ar.js:165), at 40 steps a second (6.4 s).
  - It hashes SEED as step 0 and 3^(k − 1) at step k, each with salt (k + 1)·977: the sketch's step·977 (Twelve_Rays.html:413) with SEED counted as the first arrival, 257 hashes. Each new best of 4 bits or more flares amber.
  - A card slams in. Today, with salt (k + 1)·977 (node): 'TODAY'S BLOCK · 120 GOLDEN RATIO · 7 BITS', found at step 201, with records of 4 bits or more at steps 2, 30 and 201.
  - Typing a name lights its cell, with a chord from SEED.

  On ENTER, over the existing 3.2 s bloom (index.html:335), a terminal types B24's seed string and its running product mod 257, one line every 0.36 s. Each node is born first on the sphere:
  - CF1111 ≡ 83 ⊗∞ PRAYER
  - → DM −1 → 174 DO UNTO OTHERS
  - → T4 → 182 SYNCHRONICITY
  - → P2357 ≡ 44 → 41 OMEGA
  - → C53 → 117 BOLTZMANN
  - → E111 → 137 EYE OF HORUS
  - → S161 → 212 PHOTOSYNTHESIS
  - → D234 → 7 Φ⅗ G

  DM is the day's sign, the character of the day's cell (game.js:49, field.js:22).
  - Today 9422 mod 257 = 170 is a non-residue, so the sign is −1 and the chain ends on 7.
  - A residue day (the next is 9425) runs 83 → 75 SHIFT → 216 EQUIVALENCE PRINCIPLE → 140 ATTENUATION → 120 GOLDEN RATIO → 45 ELIJAH → 250 CONSERVATION OF ENERGY, and 250 ≡ −7.
  - A day cell of 0 (days 9509 and 9766) takes +1 *(design)*.
- *Does.* Types a name and picks a mode. After the seal, WALK ON's free walk (index.html:287, levels.js:243–248) asks for the day's block, with its ray as the clue (levels.js:43 names SEED as the floor's centre). An optional AXIOM mode walks the day's chain as levels, with pars 4, 1, 4, 3, 3, 4, 2, 5 = 26 for the −1 chain or 4, 4, 3, 3, 4, 2, 4 = 24 for the +1 chain.
- *Gets.* A first impression that is the field's own work, the same for every player that day. Closing the AXIOM run gives '±7 · BOOTED' and a badge on the start screen.
- *Changes.*
  - index.html:
    - <canvas id=attract> as #start's first child.
    - While #start shows, the loop calls ATTRACT.frame and skips A.frame(). #attract is drawn opaque, because the .scr gradient alone does not hide the scene: its centre is rgba(30, 60, 40, .55) (index.html:24), and the 258 cells show from the first frame (born −10, ar.js:70). Skipping A.frame() saves 40.7–42.9 ms a frame (*SwiftShader*). The frame after ENTER renders as usual.
    - The daynote (index.html:162) appends the block.
    - A <pre> overlay for the boot; localStorage 'fold.boot.<day>' *new*, so it plays once a day; a tap or a key skips. Each finished line is also appended whole to a visually hidden role=log (aria-live polite), so a screen reader reads the chain once, not letter by letter; under CALM the walk draws all 257 nodes at once and the card fades in without the slam.
  - rays.js: attract() and block(day) *new*.
  - levels.js: axiom(day) *new*. game.js load() must also load 'axiom' runs; today game.js:50 loads only daily.
  - gen_material.py: 'axiom' *new*, with a six-move BFS in python for the pars (it has no solver today), checked against levels.js in test.js.
- *Numbers.* Block bits over the 365 days from 9422 with this salt: 5 bits: 9 days; 6: 51; 7: 90; 8: 86; 9: 56; 10: 35; 11: 20; 12: 5; 13: 8; 14: 3; 15: 2. SEED is the block on 1 day, and the 3-a-second flare queue binds on 1 day.
- *Refs* D1, A34, B34, A4, B24, B32, B33.

**H1 · THE CROWD: Sisyphean Heat on the chapter floor, multiplied by R1's ratio.** *M*
- *Sees.* The floor (R2's sheet) carries a heat layer, and only the heat is drawn.
  - Blue strokes one cell wide (1.56 cm) run up the field's ramps and whiten with heat.
  - Orange-white flares mark climbers going over the crest, the 256 → 0 wrap, and dropping to the foot of the next ramp.

  The hill is the sheet the floor already draws, h = V(a, b)·m mod 257 with m = c = current/target: R1's time step (setRatio). m is your own cell when the target is 1 or not in 1 … 256 (R1's base 1). Every move that changes c re-forms it, and every climber lands on new ground. FOLD throws 16–21 % of the crowd over at once; a quiet frame loses 2.4–8.0 %.

  On the norm at m = ±1 the picture is the conic's own (simulated, heat2_norm_1.png): long fans converging on the five stars, short crackle far from them, and bright ridges where 2a + b ≡ 128.5 (mod 257) and the wrapped slope flips. At other cells the gentle ground moves. Only (0, 0), where the gradient is exactly zero, stays flat for every m; at the four other stars one difference is ±1, which becomes ±m.

  Special cells and chapters:
  - On SEED the floor lies flat and black and the heat dies away.
  - At ∞ the crowd freezes mid-stride until Γ(∞) = 1.
  - In THE LADDER (the parabola y² − 4x, gradient (−4, 2b)) there is no flat point anywhere. At c = 1 the crowd converges sideways on the lines b ≈ 64.25 and b ≈ 192.75 and never rests.
- *Does.* Plays as now. RELIEF still cycles, and the heat follows the floor.
- *Gets.* "You do not move; the field does" made visible. Every move makes an event sized by the move, and the floor's fall rate reads c: 8.0 % a frame at c = 1 (the close), 7.7 % at 3, 2.4 % at 62. The crowd is the backdrop; the player's own climb and its rewards are H2 and H3.
- *Builds on.* The floor is built and mounted (relief.js:114–130, index.html:187–188). setT already multiplies by POW[t] (relief.js:47, :103), so only m = 0 and the ∞ freeze are new. The device tiers (index.html:166–167).
- *Changes.*
  - New files: parts/heat/heat.js *new* (window.FOLD_HEAT: terrain(form) and crowd(THREE, renderer, {n, form, seed: day}) → {frame, setMul, freeze, setForm, home, stats, dispose}), plus demo.html, notes.md and check.js.
  - Climbers live in typed arrays and follow the sketch's state machine (CLIMB / FALL, effort, heat, wander, fallFrames).
  - Terrain: one Uint16Array(66049) lookup (values run 0 … 256, so Uint8 cannot hold them) and the integer gradient reduced to (−128, 128]. A real-valued derivative is wrong for m ≠ ±1, because the field wraps on integers.
  - Summit: a step whose height drops by more than 128, i.e. going over the crest. An exhausted climber slides back (gravity 0.55, damping 0.965, heat × 0.975 a frame) until it reaches the foot of the wall or 260 frames pass, then is reborn at the lowest of 4 samples.
  - Drawing happens in floor space, not screen space:
    - a 256² RGBA8 WebGLRenderTarget that is never cleared;
    - each frame, a 7/255 black quad, then a 1/255 ReverseSubtract quad to kill the 8-bit residue (CustomBlending is in the vendored r128), then one additive LineSegments in the sketch's colours;
    - renderer.xr.enabled is turned off around this pass, because r128's render() swaps in the XR camera whenever xr.enabled && isPresenting; autoClear is off and the clear colour is restored afterwards;
    - the floor points read their heat texel in the fragment stage. A flat plane at y −2.4 would float apart from the relief's ±0.6.
  - Constants are rescaled by the steepness ratio 58.1: the sketch's p5 1.7.0 noise at noiseSeed 12345, against the norm at 1000/257 px a cell. Heat gain becomes 18/58.1 = 0.31, the effort coefficient 90/58.1 = 1.55, and speeds × 257/1000.
  - FOLD's burst is spread over 24 frames (0.4 s), by distance from the nearest star.
  - One shared limiter allows at most 3 re-forms a second from any source (moves and UNDO). M5's rain hangs off frame().
  - index.html: the crowd is created in monFloor (:188); setMul is called from R1's relStep, so from move() (:226–227), both undo paths (:177, :312) and openLevel (:267), since a new target changes c; frame() runs before A.frame() (:349).
- *Numbers.*
  - Norm: 33006 of 132098 neighbouring edges are wrap cliffs (24.99 %), with 258 crest cells, 1 zero and 49 gentle cells by the port's own slope. The five non-degenerate forms share one slope distribution, because their gradient maps are invertible mod 257. The parabola has 17540 wrap edges (13.28 %).
  - Simulation, 3584 climbers × 900 frames at cell 1: 256374 falls over the crest against 96 exhaustions, and a mean life of 11.6 frames (the sketch on its own noise: 239.2). On the field the crest always comes first, so the summit is the cliff, and the effort budget lives in the player's own climb (H2). On the parabola the crest share is 0.991 and the mean life 17.2 frames.
  - Cost: 175 ns per climber-step against the sketch's 752 ns, so 0.63 ms a frame at 3584 on this container's Xeon 2.1 GHz. This is not measured on a Pi or an RK3588; a governor halves n when the simulation's 30-frame mean passes 2.1 ms, an eighth of a 60 fps frame.
  - Tiers: 3584, 1792 and 512 climbers (14, 7 and 2 × 256, near the sketch's default of 3500 and its slider minimum of 500), with render targets of 256² and 128².
  - Upload: 24 B per climber (float32 xy plus Uint8 RGBA), 86 kB at 3584. Texture: 256 kB. The offscreen pass adds 2n line vertices (7168) and 2 quads.
- *Refs* A1, A4, A7, B32; Sisyphean_Heat.html:397–407, :443–504, :563–583.
- *Risks.*
  - FOLD's 20 % burst: spread it out and cap the flare gain.
  - The SEED billboard masks 21 cells round (128, 128), 24 when SEED is in reach (ar.js:85).
  - On smaller tiers, scale stroke alpha by √(3584/n) *(design)*.
  - The alternative terrain, the slope magnitude, would give the sketch's full loop: stars as basins, climbs of 61.5 cells. It is not what the floor draws, so it is not taken.

**H2 · YOUR CLIMB: the effort bar and the white climber.** *M*
- *Sees.*
  - **The effort bar.** The 'moves / par +slack' pill (index.html:217) becomes a bar of par + slack segments plus one dim 2★ segment.
    - A counted move fills a segment blue if it brought the target closer by the solver's distance, grey if it kept the distance, and orange if it took the target further. The three also differ by shape (full, half height, a notch below the line), and the aria-label counts them, so the bar does not rest on colour (WCAG 1.4.1).
    - Segments whiten by the move's heat, |circular Δdlog|/128: ×g 1/128, ×i 0.5, FOLD 1.
    - Free moves are thin ticks that cost nothing. On HALT levels the bar is also the thirty seconds draining (R5).
    - Past par + slack, new segments burn orange. UNDO drops the last segment as an orange streak. A loss lets the whole bar fall (V3). A close at par flares the top segment white: the summit.
  - **The white climber** on the floor.
    - It stands at your cell's azimuth (ar.js:33), the same azimuth as the cell's billboard and its tick on the 210-gon, at radius 3 m·max(0, par − d)/par, so a move that takes the target further than par stays at the centre. The start (and SEED) is the centre; the summit is the target's tick on the rim (ar.js:137–142).
    - Each move draws a white-hot stroke between the two places over the flow.
    - A free move keeps d, because its inverse is free too (INV and FOLD undo themselves, ×i by ×i³, Γ by the rest of its orbit). So on IDENT, EXIST, FOLD and JUMP levels free moves walk the climber round its own circle, a contour, never up. The rim is d = 0, the target and every cell with a free road to it, so on JUMP days free Γs walk it along the rim, the ridge, only once it stands in the target's Γ orbit.
    - Past par + slack + 1 on a non-strict level it lets go and slides orange to the centre, while the level stays open.
- *Does.* Plays as now, and sees what each move did before needing a hint.
- *Gets.*
  - Running out of effort becomes legible before it costs a star.
  - The sketch's counters with the game's meanings: climbs (levels played), steps (counted moves), summits (closes at par), falls (losses + undos).
  - On a close, n/64 of the crowd's climbers (56, 28 or 8 by tier) move their rebirth spot near the floor-edge point under the target, so through the day the heat gathers under the day's targets.
- *Builds on.* S.moves, par, slack, strict and clock (game.js:57–64); the star thresholds (:76); the 0-1 BFS (field.js:38–51). Today a distance is shown only on a tap (index.html:292, :301), plus the distance to home on the card (:258).
- *Changes.*
  - game.js:
    - S.dist *new* (F.cost(F.solve()); solveShift().length on SHIFT; F.solve(current, target, null, S.opsList).length where S.countFree, the eye, levels.js:147), set in level(), apply() and undo(). Without the eye's case d is 0 from 137, so the climber starts on the summit;
    - S.climb *new*, an [opId, d0, d1] per move;
    - S.undos *new* (undo() counts nothing today, game.js:82), S.steps and S.lostCount, all saved (H3 reads them).
  - index.html: the bar's markup in #tgtrow (:109), with an aria-label carrying 'moves / par'; paint() fills it.
  - heat.js: climber(THREE, scene) *new*, one LineSegments trail (the last 20 moves, *design*) and one Points head at y −2.39.
- *Numbers.*
  - Today's 59 non-SHIFT starts: of the moves that change the cell, 1.76 bring the target closer on average, 2.29 keep the distance, and 1.19 take it further.
  - Mean number of points at distance 1 … 7 from a target: 5.9, 20.5, 54.3, 102.2, 68.3, 5.7, under 0.05 (the diameter is 7), over all 258 targets with the six moves and nothing free. With each level's free set, today's 59 levels average 18.6 points at distance 0.
  - Level 8 (SYNC, par 5, Γ FOLD Γ Γ FOLD): radii 0, 0.6, 1.2, 1.8, 2.4, 3.0 m at azimuths 222.2°, 130.8°, 310.8°, 216.6°, 203.9°, 23.9°.
- *Refs* A7, A37, B33.
- *Risks.* Γ and FOLD jump the azimuth by up to 180°, so strokes cross the floor; keep the current level's trail only. The rim at 3 m lies outside the heat square's half-side of 2, so the climber is drawn as world-space lines, not heat pixels.

**H3 · THE DAY'S HEAT: a picture of the day at THE SEAL.** *M*
- *Sees.* Above the seal's text, a 514 × 514 picture at 2 px a cell (257 cells):
  - the ground is a slow day buffer: a 128² canvas into which one heat snapshot is blended per closed level (the live render target forgets in about 36 frames);
  - the day's climbs are redrawn in H2's radar layout: blue ascents whitening by heat, orange descents and undo back-strokes;
  - a white dot on the rim at each closed cell's azimuth, up to 64: the day's crown. The crown is S.targets, the seal's own factors (F8). A SHIFT level's dot stands at the cell it closed on, which is one tick (1.406°) further round for each move over par, since dlog(t0·3^k) = dlog t0 + k. A reborn level's dot is dim (V3);
  - an orange streak to the centre for each loss; a reborn level's second climb starts from 80's azimuth;
  - the sketch's three counters as the day's (climbs, steps against the three-star day, summits) plus falls.

  T4's bars sit under it.
- *Does.* Taps SHARE: the PNG and the text go out where navigator.canShare({files}) allows; otherwise a download is offered.
- *Gets.* A picture of the day that is the player's own. Everyone that day shares the targets of the tape, door, mirror and eye levels (the ladder levels 36 and 40 start from the name's own cell, levels.js:109–121). The exception is a SHIFT level, whose crown dot is wherever the player caught it. So two players of one name share the crown when they close each SHIFT level in the same number of moves (at par, say). On a product day they share the seal whenever their SHIFT moves add up to the same total. The roads, undos and falls are each player's.
- *Builds on.* endDay() and its text share (index.html:280–289). save() keeps no roads, undos or falls today (game.js:25).
- *Changes.*
  - game.js: save() adds climbs *new*, [{L, s, t, par, ops (one character a move), out, undos, falls}], and the day's counters; start() restores them (game.js:46–53). t is the cell the level closed on, S.targets' entry. out is the stars, 'lost' or 'reborn', and a reborn climb has s = 80 and the par from 80.
  - heat.js: dayPicture(record, ground) *new*, canvas 2D with 'lighter'.
  - index.html endDay(): an <img> whose alt reads the four counters and the crown's count; share2 (:288) goes through canvas.toBlob → File('fold-YYYY-MM-DD.png') → navigator.share. With RELIEF off (MON.mode 0) there is no ground, so strokes only.
- *Numbers.* Today's 64 pars sum to 226; with 7 slack, a three-star day is 233 counted moves. Simulated heat PNGs at 514² weigh 115 kB at 512 climbers and 397 kB at 3584.
- *Refs* D1, A7.
- *Risks.* Nothing leaves the device unless the player shares (README:31). Linux desktops and the Pi often lack Web Share with files.

---

## Challenges and rewards

What persists today:
- progress lives in 'fold.run.<day>.<mode>' (game.js:23–25);
- only the daily mode reloads (game.js:50);
- nothing ever removes a key;
- HINT shows the whole road for free (game.js:91), and so does a tap on the target: the panel prints the road to any cell (index.html:301, F5);
- a closed level pays off on the card and in snd.win's chord and bells alone (index.html:231, :247–264; sound.js:237–244); nothing in the world changes.

Below, every reward has its picture in the world, and THE BOOK (Q1) carries them across days. The series is Q1–Q6, so it does not collide with material.md's C1–C34 (the words), which the Refs lines cite. Every new level kind is verified in parts/levels/test.js, as listed in each entry.

**Q1 · THE BOOK: a record kept across days.** *M*
- *Sees.* BOOK on the start screen opens A8's 16 × 16 glyph table: row G16[n >> 4], column G16[n & 15], so each tile is a cell's own two glyphs.
  - Collected cells (closed as a target on any day) glow phosphor with their pair. Uncollected tiles show '··'. 256 gets a 257th tile, ∂ΦΦ.
  - A tapped tile shows its first word and the day it was first closed.
  - In the field, the lifetime star total h stands as a gold-ringed score cell at h mod 257 (B30).
  - When all twelve inverse pairs of 1800 are collected (B31), THE TURN's ring stands round the player for good.
- *Does.* Comes back on other days. Presses INV on one of the 24 cells of 1800's pairs to collect that pair.
- *Gets.*
  - A collection that does not reset at midnight: the atlas, the four gold cells, the 12 pairs, the mirror pairs. A mirror pair is collected by closing a mirror level whose word has a tablet partner (sp.mirrorWord, levels.js:134) or by answering chapter 6's or 8's Atbash quest (levels.js:203) *(design)*: 269 distinct pairs over the 100 days from 9422 (78 from the levels, 200 from the quests), of the 2551 in D.mirrors.
  - The keepsakes of every other proposal: rings (M3), circle points (R3), Saturn's rings (R6), room walls (R4), throats (S5), amber (T3), the block (T5), medals (Q5), stone heights (Q6).
  - Milestones by B30's rule: gold every 128 lifetime stars, tablet every 258, a quarter at 16512.
  - A share line, 'book 208/257 · 1800: 10/12' (SCRIBE after 100 days, every level closed on its par road).
- *Builds on.* The per-day key (game.js:23–25), which nothing removes, so the old 'fold.run.<day>.daily' saves can be backfilled (they keep their targets, but only for the last name to play that day: start() replaces another name's record, game.js:50–52, and a save without targets gives [], :51); GOLD (ar.js:19); turn() (relief.js:187–215).
- *Changes.*
  - parts/book/book.js *new*, window.FOLD_BOOK {load(name), record(S), backfill(), inv(cur, v), streak(), totals(), unlocked()}.
  - localStorage 'fold.book.<NAME>' *new* (see the data table).
  - game.js: save() calls record(S), which keeps the day's seal, LV.seal(S.targets).cell, beside c, s and line (the data table's days entry). Because record() runs on every save, the stored seal is that of the cells closed so far, and THE BOOK's seal is the one the card shows (F8). apply() calls inv() on INV.
  - backfill() seals each old save's targets as they stand, because game.js:77 has always pushed the closed cell, a SHIFT level's moved target included, so no old save needs converting. A save with fewer targets than closed levels (game.js:51 gives [] where a save has none) keeps c, s and line, but no seal.
  - ar.js: state 6 'score', added after ar.js:85 is re-bracketed (F12).
  - index.html: a full-screen BOOK sheet, not a .card, whose paddings leave 234 px of a 320 px screen (index.html:65–67), holding a CSS grid of 257 tiles of at least 18 px (16 × 18 = 288 px). 18 px is under WCAG 2.5.8's 24 × 24 and 16 × 24 = 384 px does not fit, so a tap opens a 4 × 4 zoom of 44 px tiles *(design)*, arrow keys move a focus tile, and each tile has an aria-label (cell, first word, day first closed). The pairs need F1: 31 tiles show a lone surrogate today. The permanent ring is its own object, because monApply disposes MON.obj at every level (index.html:190). It is R3's 515-vertex ring (relief notes:16): off in chapter 6, where R4's room leaves 432 of the 40k (relief notes:21); where monApply already mounts THE TURN (index.html:195: the eye level, and chapter 7 once F6 lands), it is that ring.
  - material.js: quotient_pairs *new*.
  - A Matrix touch: a collected tile decodes from '··' in a 300 ms column sweep *(design)*, static under CALM.
- *Numbers.*
  - Atlas growth (SCRIBE, every level closed on its par road, today's stride). THE BOOK collects the cells closed, as S.targets records them and as the seal multiplies them, so a SHIFT level collects its moved target (game.js:73, :77; F8).
    - Collected: 55 cells on day 1, 166 by day 7, 182 by 30, 208 by 100, 249 by 400.
    - Never closed in 400 days: 79, 123, 148, 168, 170, 175, 228 and 243.
    - Counted by the plan's own targets instead, the figures would be 54, 164, 179, 205 and 251, with 4, 148, 151, 168, 175 and 229 never a target.
    - Q2's fresh roads (decision 1) change all of these.
  - Gold cells first appear as targets on day 1 (cell 1), day 8 (16), day 49 (256) and day 219 (241).
  - 1800 = 7·257 + 1 gives 12 pairs, from 8 ↔ 225 to 40 ↔ 45. The plan's own roads (levels.js road(), which HINT uses after F5) press INV on one of the 24 cells 231 times on 89 of 100 days, reaching 10 pairs.
  - N(1 + 7φ) = 1 + 7 − 49 ≡ 216, THE TURN's u (B1).
  - About 60 bytes a day.
- *Refs* A8, B30, B31, A13, C1, D2.
- *Risks.* The book is keyed by name; the per-day save is not: it is keyed by day and mode and keeps only the last name (game.js:23, :50–52). Private mode throws, so wrap every call as LS does (index.html:140).

**Q2 · FRESH ROADS, THE STREAK LADDER, FESTIVAL DAYS.** *M–L*
- *Sees.*
  - A start screen that counts down to the next festival: 'next gold day 2026-12-07 · 50 days · field 220 CENTRAL LIMIT THEOREM'.
  - Round your own cell, its halving ladder of 16 rungs (SCRIBE: 56 28 14 7 132 66 33 145 201 229 243 250 125 191 224 112), one rung lit gold for each day of the streak, and 'streak n/16' in text, so gold is not the only cue (WCAG 1.4.1).
  - On a gold day, a gold bloom: every cell born gold along the cycle.
  - On a tablet day, a title card: 'a tablet day: the walk stands on the cell of 93 SATURN'.
  - Above all, days that differ from each other: no start window is read twice in 1460 days running.
- *Does.* Returns daily. A day counts toward the streak when at least one chapter (8 levels) is closed or the seal is read *(design)*. A STORE day (head opcode 5, π[windowBase(day)]) banks one missed day, at most one.
- *Gets.*
  - Sixteen days close the ladder ("every ladder closes in sixteen", story chapter 5) with a festival bloom.
  - Gold days: gold-cell targets count double in THE BOOK, and the seal names the day's field (D2).
  - Tablet days: every tape level becomes a word level (Q4; D3's word day).
  - Fixed festival levels: 18 April, 201 → 39 (par 4); 21 July, 39 → 201 (par 3) (D7); 10 September, 132 → 6 (par 4) (D6).
- *Builds on.* Windows sit at head + 4(L − 1), with head = day + 13 (levels.js:39, :88; game.js:41, :48).
  - So day d + 4 replays 55.0 of day d's 64 levels (20-day mean), while days d + 1 to d + 3 share only the 6 fixed specials.
  - Over 100 days that is only 449 distinct roads and 205 target cells.
  - S.tabletDay and S.dayCell are computed and unused (game.js:49), and a gold day only frees ×i (game.js:59, :63).
- *Changes.*
  - levels.js: windowBase(day) *new*, exported, = at(9435 + 257·(day − 9422)), with FRESH_FROM 9422 and STRIDE 257 *(design)*; plan(day, name, {stride}) reads it. (base() already exists at levels.js:77, hence the name.) Day 9422 keeps its windows (9435 = 9422 + 13), so every figure in this scope about day 9422 holds on the fresh road; each later day starts 257 digits on (9423 at 9692). stride 1 gives at(day + 13), today's reading, exactly. The default is 257 only on the fresh tape (D.pi.length − 4 = 257·365 + 1); a stale 20001-digit data.js plays stride 1 under the old save key.
  - windowBase replaces headOf (levels.js:39) in every builder: tapeSpec (:88), doorSpec (:102), ladderSpec (:115), mirrorSpec (:126), eyeSpec (:146), digitFor (:158). Offsets are kept wrapped, o = at(windowBase(day) + 4(L − 1)), so sp.offset and the text's π[o] name a real tape position; the comment at :36 ('the tape is 20001 digits') goes. Outside levels.js: game.js:48 sets S.head from a copy of the rule, fresh check included (as RULES is copied, game.js:8), which also serves the plan-less tapeSpec (:41) and the offset fallback (:57); index.html:162's daynote prints windowBase(dn) and its digit, and :212 already prints S.offset; the ribbon draws 0 for k past the tape's end (ar.js:210), so it reads pi[k] while k < pi.length and pi[at(k)] beyond: a window from 93803–93805 keeps its own four digits under the head.
  - The day's opcode is π[windowBase(day)], window 1's rule digit (7 JUMP on 9422, as now): the daynote and the STORE day read it. π[day + 13] means nothing on the fresh road; the sound bed follows each level's rule (index.html:267).
  - The save key is versioned: plan() stamps spec.stride *new* on every spec, and game.js:23 appends '.s257' when the plan played was built at stride 257 ('fold.run.<day>.daily.s257'; game.js's own copy of the rule when no plan is loaded). The key follows the plan, not the tape, so a stride-1 run is never resumed into the other plan, whichever shell file is stale. A phone that updates mid-day starts that day over once. Q1's backfill reads both keys; both hold real closes.
  - test.js: D.pi.length === 93810 and D.pi starts 314159265358979; plan(9422, name) deep-equals plan(9422, name, {stride: 1}) for TORAH and SCRIBE; the 93,440 start offsets at(windowBase(d) + 4j), j = 0 … 63, of days 9422–10881 are distinct, and day 10882's windows 2–64 are day 9422's 1–63, the wrap the README states (arithmetic, 17 ms); for 30 days from today every tape spec's offset is at(windowBase(d) + 4(sp.window − 1)) and no tape offset repeats (30 plans, 0.6 s); the log line (:24–26) prints windowBase(day) as the head. With S3's localStorage stub it loads game.js and asserts that its copy of the rule, G.windowBase *new*, agrees over the same 1460 days.
  - FOLD_BOOK.streak(); ar.js A.homeLadder *new* (16 arcs × 10 points, vertexColors) and bloom(dur, rgb) *new*; days.festivals *new*.
  - build_data.py: pi_digits(n) *new*, Machin's π/4 = 4·arctan(1/5) − arctan(1/239) in exact integers with 10 guard digits, for n = 93810. It asserts that the first 20001 equal the machine page's tape (build_data.py:13); they do. Python 3.11+ refuses int-to-str past 4300 digits, so it calls sys.set_int_max_str_digits(0). The data.js header (build_data.py:26) names both sources.
  - gen_material.py re-derives the tape by Störmer's four-term formula and asserts every digit. tape_head_today and opcode_today follow windowBase (:225), and need_pi (:156) asks for the whole tape, digit 93809: a base near the ring's end wraps (day 9750's is 93731, and base + 266 would pass the end). The day-9384 head checks (gen_material.py:117–119, corpus check.js:53) keep π[9397] = 6 but drop 'head' from their labels: day 9384 now reads from 93475.
  - M1's 78 × 256 tape texture holds π[at(windowBase(day) − 9435 + 78c + r)], so the day's strip stands over columns 120–124 every day, as on 9422 (M1); it is refilled once a day. 78 rows are now a choice, not ⌊20001/256⌋.
  - README:14's 'day + 13 + 4(L − 1)' becomes 'b + 4(L − 1), where the day's base is b = 9435 + 257·(day − 9422), taken round a ring of 93806 digits', and the bullet gains: 'Each day starts 257 digits on from the day before, so no start window is read twice in any 1460 days running. Day d + 365 reads day d's digits one place earlier, which gives new figures and new levels; day d + 1460 replays 63 of day d's 64 windows. The tape is the machine's 20001 digits of π, carried on to 93810 by Machin's formula.' The root README's build_data.py row says the same. parts/levels/notes.md's 'The day' (:9, :30) is rewritten, and its day-9384 examples (:37–38, :65) are recomputed, since day 9384 moves.
- *Numbers.*
  - The tape: 93810 digits: the ring that at() wraps, 257·365 + 1 = 93806, plus the 4 that at() keeps past it (D.pi.length − 4, levels.js:36), so the last window, from 93805, reads true digits. The first 20001 are the machine's: Machin's digits equal them. Machin and Störmer agree on all 93810, in 7.3 s and 6.1 s (python 3.13 on this container's Xeon 2.1 GHz). data.js grows from 107,876 B to 181,685 B before the header's new words (+73,809 B of digits; zlib level 9: 38,246 → 73,510 B).
  - The horizon: windowBase(d + 365) = windowBase(d) − 1. No start window is read twice in 1460 consecutive days (node: the real plans of days 9422–10881, 27 s, and the arithmetic from day 9000). Day d + 365 reads day d's digits one place earlier, so its figures and rule digits are new: it shares 6.1 levels with day d, the 6 fixed specials and 0.1 by chance (20-day mean). Day d + 1460 reads day d's windows 1–63 as its 2–64, the first replay. The + 1 buys the four years: a ring of 257·365 replays every window on day d + 365, and 257·365 + 3 replays 2 windows on day d + 1096.
  - Digits: days 2 to 363 apart share none. Neighbours share the 3-digit seam where window 64's target (base + 256 … 259; up to + 266 after a slide, over those 1460 days) runs into the next day's window 1, as at any stride under 260.
  - Over the 100 days from 9422 (SCRIBE): 5363 distinct roads, against 449 on stride 1; the rest are the 6 fixed specials a day (doors, ladders, eye) and 443 coincidences of residue, 358 of them SEED starts. All 257 targets by day 24 (stride 1: 205 by day 100), gold 241 by day 3; the plan's targets reach 54, 205 and 257 cells by days 1, 7 and 30 (Q1's stride-1 54, 164, 179). Day d + 4 shares 6.2 levels with day d (20-day mean), against 55.0. Par 1: 705, 2: 778, 3: 1503, 4: 1916, 5: 1296, 6: 197, 7: 5 (stride 1: 763, 670, 1386, 1949, 1251, 346, 35); none of the 6400 breaks par > 0 or par ≤ 7. 311 tape levels slid (270). A plan still takes about 20 ms in node.
  - The other proposals' multi-day figures (over 100 days from 9422, or 30) are stride-1 figures. On the fresh road the same 100 days hold 559 HALT levels, 5.59 a day (R5: 4.37), and 589 SYNC (509): 1148 losable levels (V3: 946). From 80 the worst par is still 6, but 6 of them (4 SYNC, 2 HALT, all tape) have target 80 itself, so a rebirth from 80 would start on its target (stride 1: none). 27 tape levels have target 0, 23 of them not SHIFT (R1, Q4: 32 and 12). Figures about day 9422 alone do not change.
  - Over the next 365 days: 40 STORE heads (π[windowBase(day)] = 5), with at most 37 days between two (π[day + 13]: 39 and 31).
  - Gold days: 2026-12-07 (day 9472), 2027-04-14 (9600, 91 SPIRIT), 2027-08-20 (9728, 219 DIVINE PROPORTION).
  - Tablet day: 2027-02-19 (9546, field 37 HADES, tablet cell 93 SATURN), 124 days away.
- *Refs* D2, D3, D6, D7, B5, B16, D5, D1.
- *Risks.* The fresh road rewrites every day's plan but 9422's, and the README's account of the tape. data.js and levels.js ship in one CACHE bump; on a stale 20001-digit data.js levels.js plays stride 1, and the key's '.s257', taken from the plan's spec.stride, keeps the two plans' runs apart. From day d + 1460 windows come round, and the README says so. The streak uses the local date, as the day does (game.js:21–22).

**Q3 · THE TIER LADDER: every reward has its picture.** *M–L*

| event | visual payoff | sound (SND) | gated flashes |
|---|---|---|---|
| a move on a shortest road | FOLD: the corridor (V2); INV: the lift (V1) | snd.op | 1 (the gold eighth ring) |
| arrival on a share cell | amber ring + CRT pulse (T3) | snd.cell at the ray's pitch | 1 |
| close at 1★ / 2★ / 3★ | R1's contour brightens dim / gold / white-gold; bullet time ×1 / ×2 / ×3 (M4); the gold beat at 3★ | snd.win: the chord at +0.26 s, a bell per star at +0.55 + 0.23k s (sound.js:241, :243) | 1 at 3★ |
| AMBER, IN PHASE, SIGHTED | marks on the card (T3, U4, S1) | — | 0 |
| a chapter close | the kaleidoscope of its targets (V4); the ledger (T4) | — | 1 slam set |
| a perfect chapter (24 of 24 stars) | 'MATRIX · 85': for 4 s every column except yours and the target's rains down as green code (rain state 8 on the billboards) | — | 0: motion, not flicker |
| a perfect day (192) | 'SINGULARITY · 155': the zenith ∞ opens into S1's shadow and ring, every cell flows into ∞ (iFrom = place(n), iPos = place(257), restored after) and is reborn by the bloom; the seal reads Γ(∞) = 1 | snd.bloom | 1 |
| a loss | the bardo (V3) | snd.lose | 1 (the I AM disc) |
| chapter trophies | THE TURN's arc (R3, chapter 3); Saturn (R6, chapter 5); the lit room (R4, chapter 6); both throats (S5, chapter 7) | — | 0 |
| the line becomes its own mirror, 27k − s ≡ s (material.md C2's still points) | 'STILL POINT' on the line strip, the line's cell standing as its own Atbash mirror (lineInfo, game.js:86), and THE BOOK counts the day twice *(design)*. 33 of the 100 days from 9422 have one (38 closes, SCRIBE on par roads); today has none | — | 0 |

- *Words.* Each of these is its own letter sum and a tablet word at that cell: MATRIX 85, SINGULARITY 155, EVENT HORIZON 171 = fold(86) (86 TUNNEL), DEATH 38, REBIRTH 80. Roads: 155 → ∞ is 4 moves (INV Γ Γ Γ); 38 → 80 is 5 moves (×g INV Γ ×g FOLD).
- *Changes.*
  - index.html won(): a tier(S) dispatcher *new*.
  - ar.js: billboard states 7 'flare' and 8 'rain', after re-bracketing ar.js:85 (F12).
    - The flare is timed by a uniform pair, flareCell and flareT0, because iBorn belongs to the bloom (ar.js:86, :164).
    - The rain stays in the vertex stage, which is highp in WebGL1; ar.js passes raw seconds.
    - An anisotropic stretch along iPos − iFrom for 'into ∞'.
  - story.js: a 'tiers' object *new*, checked by check.js. check.js asserts exactly 8 chapters (story/check.js:21), so new books go in an array of their own.
- *Refs* A1, A2, B32, A14, B18.
- *Risks.* Every tier has a still card under CALM. In XR the MATRIX tier lights the columns without rain and SINGULARITY's in-fall cross-fades *(design)*, as the AR comfort rule requires (Budgets; M1 runs 2 static columns there).

**Q4 · WORD LEVELS AND HINTS BY BITS.** *M*
- *Sees.* A word level's HUD reads '→ ??? · PRIVATE KEY'.
  - The target is named only by a word whose letters add up to it (PRIVATE 91 + KEY 41 = 132) and that is not the cell's first word. The first word is printed on every billboard (ar.js:58), so naming it would make a visual search, not arithmetic; 132's first word is FLOWER OF LIFE.
  - There is no gold arrow and no target highlight.
  - Each HINT press adds a bit, eight in all (B20). The first bit is the level's free hint, and a ninth press shows the road. For 132 (dlog 37 = 00100101) the lines run 'dlog ≡ 1 (mod 2)', 1 (mod 4), 5 (mod 8), 5 (mod 16), 5 (mod 32), 37 (mod 64), 37 (mod 128), 37 (mod 256), and the cells outside the target's coset fall away as green rain: 128 cells stay lit, then 64, 32, 16, 8, 4, 2, 1.
  - On ordinary levels the first HINT is free and shows what it shows today: the whole road from where you stand, with its first move flashed (index.html:178, flash() :183). It now comes as chips (U5), on LV.road over S.opsList (solveShift on SHIFT levels) and, on HALT days, around the HALT cells (F5, decision 3). The chips stay up while the player follows them. A move off them greys them, and UNDO back onto them lights them again.
- *Does.* Works out the cell from the word (A = 1 … Z = 26, mod 257, the rule the start screen already teaches with the name) or by reading cells, then walks there. Chooses how many bits to buy past the free one.
- *Gets.* A puzzle in the game's own language.
  - HINT is free once on each level, and every further press costs. game.js:76 applies the cap as min(stars, capOf(S)), from S.spent[L − 1]:
    - **Word level:** 0–1 bits, no cap (the free bit leaves 128 cells lit); 2–5 bits, ★★ (64 down to 8 cells); 6–8 bits, ★ (4 cells down to 1); the road, ★. One bit is free, as one road is on an ordinary level.
    - **Ordinary level:** the first road is free; a second or later road caps the level at ★★. A press is charged only when the player stands off the last road given, i.e. the moves made since it are not a prefix of it. A press on that road, or after UNDO back onto it, shows the chips again for nothing.
    - **Per level and per day:** S.spent[L − 1] is saved in the run record ('spent', see the data table). A reload, AGAIN (G.reset, index.html:261) or REBIRTH (V3) does not give the free hint back.
    - **Followed, the free road still earns ★★★.** Over the 100 days from 9422 (SCRIBE), all 5819 non-SHIFT LV.road roads cost exactly par (the eye counts its free moves), and solveShift's roads are par by definition. On HALT days par and the road both keep clear of the HALT cells (decision 3). On gold day 9472 the eye needs S4's fix to game.js:63, which today gives it par 0. So the price falls only on a player who leaves the road and asks again. A capped level cannot take AMBER, which needs 3★ (T3).
  - THE BOOK counts word levels read with 0 bits and levels closed with no HINT.
- *Builds on.* hint() returns the whole road (game.js:91, index.html:178); quests already find a cell by its words (levels.js:196–206); nice() (levels.js:186).
- *Changes.*
  - levels.js: wordSpec() *new* (kind 'word', spec.word, spec.hideTarget). One per chapter in its second tape slot *(design)*; every tape level on tablet days (Q2); never on SHIFT levels (rule 4), where the target moves; never on a target of 0, which has no dlog and so no coset (field.js:20; 32 tape levels have target 0 over the 100 days from 9422, 12 of them not SHIFT). Of the 230 word cells, 229 are in 1..256.
  - hideTarget suppresses A.paint's pulsing gold target (ar.js:178), the HUD's glyphs, number and word (index.html:217), the 'sighted' logic (:322) and the arrow (:318–321). It must also replace the tape spec's title and text, which name the target (word(s) → word(t) and '→ 8788 ≡ 50 HIGGS', levels.js:94–96) and are shown in the level toast and the voice (index.html:206, :270, :272, :278), and blank the ribbon's target window, whose four figures give the target by arithmetic (ar.js:210–212; M2's gold digits).
  - game.js:
    - S.spent *new*: an int[64], written by save() (game.js:25) and restored in start() with the kept fields (game.js:51).
    - hintPress() *new* replaces hint() (game.js:91). It returns {road}, or on a word level {bits: k, coset: dlog(target) mod 2^k}, each with charged and cap. It keeps S.hintRoad and S.hintAt (S.road.length when the road was given) for the prefix test. level() clears both (game.js:62), so after AGAIN or a reload the next press is charged.
    - capOf(S) *new* is applied at game.js:76, before the strict check at :77.
  - index.html: HINT (index.html:178) calls hintPress() and shows its price on the button: 'HINT · free' before the first press and while the player stands on the road it gave, 'HINT · ★★' once off it (on a word level, the next band's cap).
  - The cap needs F5's gate first: today a tap on the target prints its road for nothing (index.html:301).
  - ar.js paint(): a {coset: k} mask that puts cells outside the coset into state 8 (Q3).
  - test.js, for kind 'word': letterSum(word) % 257 === target; D.cells[target].ws includes the word; nice(word) (exported from levels.js, which keeps it private today, :186, :249); the word is not the first word; par > 0; the level plays in par. For k = 0 … 8, the coset holds 256/2^k cells and contains the target. The price is checked on every level of the planned days, with game.js loaded under a localStorage stub (as Phase 1's S3 check loads it):
    - HINT at the start, then its chips, closes at par with 3★ and spent 1;
    - a second press in place leaves spent at 1;
    - on a non-strict level, one non-closing move off the road and then HINT gives spent 2, and that road closes at ★★ at most;
    - UNDO back onto the road, then HINT, charges nothing;
    - spent survives save() and start();
    - word levels cap at 3, 3, 2, 2, 2, 2, 1, 1, 1 for 0 … 8 bits.
- *Numbers.*
  - 230 cells have a non-first askable word that adds up to the cell; 27 lack one. Today 51 of 56 tape targets qualify, 47 without SHIFT.
  - Rejected alternative, hint bits of the road: only 40 of 916 levels (30 days, no free move, no shift, no flip) reach par with ×g ÷g FOLD ×i alone.
- *Refs* B20, D3, A25, C1.
- *Risks.* Dimmed cells must stay readable and tappable at alpha 0.2; test on a phone in sunlight.

**Q5 · THE BOOK OF CHAINS, AND THE DOORS RUNS.** *M*
- *Sees.* A CHAINS mode lists the unlocked chains. In play, each closed chain stays in the sky as a constellation of arcs between its targets, gold where closed in par. THE MIRROR CHAIN draws a closed ten-cell loop back to 48. In THE DOORS, each door closed stands its circle conic round the player (as door levels do today, index.html:194), and on arriving at 6174 ≡ 6 every ring of the run stands at once.
- *Does.*
  - Plays fixed chains whose levels each start where the last ended.
  - Unlocks *(design)*:
    - MIRROR CHAIN after THE MIRROR is closed perfectly;
    - DEEP TIME after a 7-day streak;
    - THE 22 after 22 days played;
    - SQUARE DESCENT, BYTE and TUNNEL after the seal is read 1, 7 and 30 times.
  - In THE DOORS: types four figures or picks a named run (2357 'seven doors', B3; 1370 = 1/α and 1836 = mp/me, C22). After the day's doors 30–32 close in par, the seven-step words open (C7): type HALT and play 0041.
- *Gets.*
  - Content outside the daily plan, and a sky that fills with the player's finished chains; each chain's line is sealed like a day.
  - Door medals by Kaprekar steps (1–7), and 'sealed' for a run closed in total par, kept in THE BOOK. Today THE DOORS' saves are never reloaded (game.js:50).
- *Builds on.* material.js mirror_chain, younger_dryas, word_sums (the Hebrew names), square_descent, doublings_from_128 and tunnel: all loaded (index.html:132), none read. doors() and kaprekarChain() (levels.js:219–241).
- *Changes.*
  - levels.js: chain(name, cells, words, start) *new*, built from FOLD_MATERIAL (so test.js must load material.js). Kind 'chain', rule 0, par by F.solve, consecutive equal cells merged. spec.lineWord is pushed by game.js:77 in place of the first word. test.js plays every chain level in par and asserts the pars and sums in the table below.
  - doors(): runSteps *new* (sp.steps already exists per level, levels.js:234) and totalPar. monApply keeps the run's conics when S.mode === 'doors' && S.target === 6 (the daily door levels are also kind 'door' with target 6), one per distinct residue, radii staggered, one built per frame.
  - story.js: 'books' *new*, {id, title, epigraph, intro ≤ 60 words, outro ≤ 40}, checked like the chapters without touching the 8-chapter assert.
  - ar.js: A.chains, a LineSegments *new*.
- *Numbers.* All pars by F.solve, with the six moves under NOP.

  | chain | road | pars | sum |
  |---|---|---|---|
  | MIRROR CHAIN, from 48 | 48 → 87 → 75 → 73 → 89 → 46 → 116 → 127 → 170 → 235 → 48 | 4 5 4 4 3 6 4 4 5 4 | 43 |
  | DEEP TIME, from SEED | 0 → 50 → 207 → 135 → 156 → 56 → 241 → 248 | 6 1 5 5 1 4 4 | 26 |
  | THE 22, from 23 | 21 levels | — | 78 |
  | SQUARE DESCENT | 256 → … → 1 → 0, 16 levels | — | 70 |
  | BYTE | 128 → 256 → … → 128, 16 levels | — | 73 |
  | TUNNEL | 1 → 140 → 117 → 234 → 55 | 4 1 4 4 | 13 |

  - MIRROR CHAIN: its words sum to 1053 ≡ 25, so B7's 'the line closes at 87' does not compute; the loop closes by its targets instead (F13).
  - DEEP TIME: 50 → 207 is a FOLD (B15), and 156 → 56 is a Γ.
  - THE 22: 22 names on 18 cells; RESH and SHIN are both 50, so the chain has 21 levels. The names' line is 909 ≡ 138.

  Doors:
  - 2357 gives 7 levels with pars 5 4 5 4 4 5 5, total 32.
  - 1370: 5 steps, total 20. 1836: 6 steps, total 22. HALT (41 → 0041): 7 steps, total 28.
  - Average total par by steps over 0000–9999: 3.7 at 1 step up to 28.0 at 7.
  - Seven conics: at most 7 × 512 vertices. One conic is drawn per distinct residue, so at most one start is ≡ 0 (38 runs of 0000–9999 have one); with its null cone, 6 × 512 + 1026 + 16646 = 20744.
- *Refs* B7, B15, C8, C23, B35, B8, A31, C12, C29, B2, B3, C7, C22, D11.
- *Not buildable yet.* THE TREE needs the sector graph (73 sectors, 108 edges, artifacts/map_picked_pointers.dot), and the 322-star campaign needs the margin stars (A23). Neither is in the repository.

**Q6 · THE STONE: a Sisyphean mode where the stone is carried and rolls back.** *M*
- *Sees.* A fourth start-screen mode beside DAILY, FREE WALK and THE DOORS.
  - The day's 64 levels in order, each tape level starting where the stone was left: S.current, so after a SHIFT level the stone stands at t0·3^moves.
  - The special levels keep their own starts, so their texts stay true.
  - The HUD shows the height (the level reached) and the day's best. The floor is the parabola hill with the crowd (R2, H1).
  - Going over par + slack on any level drops the stone: the bardo's fall (V3). The push resumes from the chapter's first level, the ledge.
- *Does.* Plays the same moves under each level's rule, with every level strict at par + slack.
- *Gets.*
  - A height record per day, with ledges every 8 levels.
  - After level 64 (a SEED level, 0 → 101), the push goes on from level 1 with the stone at 101: "the top is the bottom" (story.js:26).
  - A share line, 'THE STONE · day · height · falls'.
  - STONE (73, a tablet word at its own sum) already has a voice (story.js:138).
- *Changes.*
  - levels.js stone(day, name) *new*:
    - chained starts, with pars computed live from the carried cell (par() or solveShift);
    - the plan's slide (levels.js:91) wherever a chained JUMP start lies on the target's Γ orbit. Today levels 2, 9, 17, 49 and 58 would otherwise be par 0 with 37, 78, 37, 43 and 120 free Γ taps (the 5 of the Numbers);
    - SEED-rule levels reset the stone to 0 *(design)*; otherwise their texts would be false. Every other chained tape level gets a new title and text, since levels.js:94–96 name the window's own start (sp.digits[0] ≡ s0), which the stone replaces.
  - test.js plays the chain by the solver.
  - game.js, mode 'stone':
    - strict at par + slack (today's strict loss ignores slack, game.js:77, :79);
    - S.rollTo = 8·⌊(L − 1)/8⌋ + 1; the best height saved;
    - load() for 'stone' (game.js:50);
    - the daily-only gates opened for it (game.js:56, :59–60; index.html:195, :212, :214, :253, :259, :268).
- *Numbers.* Today, with SHIFT levels closed at par and SEED resetting the stone: chained pars sum to 221 + 7 slack, max 7, chapter sums 23, 22, 25, 32, 32, 26, 27, 34. That includes 5 levels at par 0 that the slide must move. Without the SEED reset: 199 + 7, max 6. A fall costs at most 7 levels.
- *Refs* B5, D1.
- *Risks.* A fall can cost 7 levels; the ledges and the mode being optional soften it. HALT's 30 s still applies to each level.

---

## UI and HUD

**U1 · ONE HUD, FOUR SKINS, AND THE CHAPTER PICKS THE SKIN.** *M*
- *Sees.* The same instruments in the same places in every skin; only colour, type and ornament change.
  - **RELIEF:** ground #0a0d10, hairlines, hue = dlog.
  - **VOID:** black, white type, condensed capital titles, and the last move's hue as the accent. Op hues at hsl(h, 70 %, 65 %) on the panel run from 5.64:1 (×i) to 12.42:1 (÷g).
  - **MATRIX:** the tube #050805, phosphor mono (#00fc00 at 14.30:1, #00a000 at 5.78:1), π digits running in the status strip, the CRT tinted FX.GREEN. On the tube at .86 over a white screen #00a000 falls to 4.13:1; #00b000 holds 6.91 on the tube and 4.94 there. The running digits stop under CALM, since moving text that runs past 5 s must be stoppable (WCAG 2.2.2).
  - **SINGULARITY:** black, #fff4e6 (19.33:1), amber #ffd400 (14.67:1), the instruments as rings round the reticle, and the CRT barrel raised to 0.06 so the tube's scanlines and edge visibly bow (shaders notes:77–78). The CRT quad only draws darkening and glow; it never resamples the scene (fx.js:151–155). So no cell moves, and picking stays exact.

  All text sits on solid strips, and every glyph pair renders (F1).
- *Does.* Plays. The skin follows the chapter, as the floor does, and there is no skin to pick *(design)*: RELIEF for chapters 1–3, MATRIX for 4–5 (doors and ladder, numbers as code), VOID for 6 (THE MIRROR), SINGULARITY for 7 (THE EYE), RELIEF for 8. It changes only when a chapter card opens, and index.html:268 opens one only at levels 1, 9, …, 57 of a daily run. So a day changes skin four times, at levels 25, 41, 49 and 57, and holds 32 RELIEF levels, 16 MATRIX, 8 VOID and 8 SINGULARITY. The card is the first thing drawn in the new skin, so V4's slams are set in its title face.
  - U3's HUD row offers CHAPTER (the default) or FIXED. FIXED is an accessibility option, not a look. It holds RELIEF's HUD and CRT all day: RELIEF's tokens and mono titles; no running digits, no reticle rings, no stretching words (U5); the CRT at its 0.0234 barrel (fx.js:16), tinted by the move's hue as today (index.html:242). It is for players who need the HUD's colours, type and edge never to change. Under FIXED the world still changes by chapter: the floor (R2), the rain (M1) and the eye (S1) are the field, not the skin.
  - Every mode with chapter cards follows the chapter: DAILY, and STONE (Q6), which opens index.html:268's gate. The others keep one skin per run: THE DOORS takes chapter 4's MATRIX; FREE WALK, the chains (Q5) and AXIOM (T5) stand in RELIEF.
- *Gets.* Four of the day's eight chapter cards open a new look (into chapters 4, 6, 7 and 8; chapters 2, 3 and 5 keep the one before), so the visual progression is itself a reward, and the look always says which part of the day it is. The HUD stays readable over a bright room, in AR, on a Pi, and on a phone held sideways.
- *Builds on.* The :root tokens (index.html:15); the HUD gradient from .92 to 0 (:39); 9 px op labels (:51); backdrop-filter on every button, the panel and the cards (:35, :60, :67); the toast's nowrap (:73); fixed sheet offsets (:60, :76–78); the rule pill showing name plus tell (:213).
- *Changes.*
  - index.html <style>:
    - tokens per html[data-skin]: --ground, --panel, --text, --dim, --accent, --accent2, --warn, --hair, --font-title, --fs;
    - solid strips at panel alpha .86 in place of the gradient;
    - op labels at 11 px;
    - the rule pill shows the name only, and a tap or Enter shows the tell. The pill becomes a <button aria-expanded>, because a span takes no focus; the ops' tells are title tooltips today (index.html:175), which a touch screen never shows. Today the pill text runs 33–71 characters. The flip chapter's suffix takes it to 94 (today's SHIFT levels 45 and 47), and a gold day's on top of that to 114;
    - html[data-lowend] drops backdrop-filter;
    - a ResizeObserver on #ops writes --ops-h, and the panel, toast and quest anchor to it.
  - parts/hud/hud.js *new*, window.FOLD_HUD {init, setSkin, paint, move, undo, frame, level, close, lose, seal}. setSkin writes the skin's CRT preset. MATRIX passes the tint FX.GREEN to crtPulse; today FX.pulse leaves the last move's tint in place (fx.js:205). skinFor(mode, spec, prefs) *new* is pure:
    - 'relief' when prefs.hud is 'fixed';
    - for 'daily' and 'stone', SKINS[spec.chapter − 1], with SKINS = ['relief', 'relief', 'relief', 'matrix', 'matrix', 'void', 'singularity', 'relief']. spec.chapter comes from levels.js:80 and :167, so a special's fallback level, which takes the special's slot, keeps that slot's skin;
    - 'matrix' for 'doors', whose specs say chapter 1 (levels.js:233, via :80);
    - 'relief' for every other mode (free() says chapter 0, levels.js:245).
  - index.html calls setSkin(skinFor(…)) in two places. The first is ENTER, after G.start (:333) and before #hud shows (:334), so a day resumed mid-chapter opens in its chapter's skin and nothing changes when openLevel runs 3.9 s later (:338). The second is chapter(), as #chap opens (:278) under its .74 scrim (:65), before GO.
  - The swap needs no gate. The grounds differ by at most 0.0039 in relative luminance (#0a0d10 0.0039, #050805 0.0022, black 0), against U3's 0.1. SINGULARITY's barrel, 0.0234 → 0.06, moves the tube's edge in over 7.1 % of the screen, darkening it by 0.2 alpha or more (python over fx.js:174–188). That is a one-way step under the scrim, and its reverse comes a chapter later; U3 counts only opposing pairs.
  - In XR, crtQ is hidden (index.html:345) and crtPulse returns at once (:241), so there a skin is its HUD tokens alone.
  - parts/hud/check.js *new* (node): glyphs(n) has 2 code points (3 for 256, 1 for ∞); each skin's text token is at least 4.5:1 on its strip and --hair at least 3:1. It loads data.js, field.js and levels.js as test.js:6–7 does, and asserts skinFor:
    - over plan(9422, 'SCRIBE') the skin changes only at levels 25, 41, 49 and 57, each with (L − 1) % 8 === 0, where index.html:268 opens a card;
    - 32, 16, 8 and 8 levels in RELIEF, MATRIX, VOID and SINGULARITY;
    - doors('2357')'s 7 levels are all MATRIX, and free() is RELIEF;
    - with {hud: 'fixed'} all 64 levels are RELIEF.
  - localStorage 'fold.prefs' {hud: 'chapter' | 'fixed'}, default 'chapter': the one prefs object U3 loads before A.init, not a key of its own. The skin itself is never stored: skinFor recomputes it from the mode and S.spec. So no run record changes (game.js:25), and a reload mid-chapter opens in that chapter's skin.
- *Layout* (sizes *design*).
  - **Phone portrait:**
    - Z1 status strip, 28 px: day · L n/64 · RULE · ★ · gear. A 44 × 44 hit area does not fit a 28 px strip: the gear's target overhangs it by 16 px (glyph drawn at 28 px), or the strip grows to 44 px.
    - Z2 stand and target.
    - Z3 compass tape (U4).
    - Z4 the chart inset (T1, 132 px).
    - Z5 the ray ruler on the left edge (U4).
    - Z6 instruments round the reticle.
    - Z7 above the ops: the line strip, the voice or the trace (2 lines), and the effort bar (H2, U5).
    - Z8 the ops, with tap targets of at least 48 px. Today they miss it, and the grid overflows. Each 1fr column keeps its button's min-content width, set by its longest word (:50–51), so at 360 px the six ops are 43–64 px wide (FOLD 43). The flip's seventh column (:219) puts the flip at x 361–395: off a 360 px screen, and 5 px past a 390 px one. At 320 px the sixth op already ends at x 355. The aux row is 33 px tall (:53). Use minmax(0, 1fr) with the names below the grid. Seven 48 px columns need 392 px, so narrower phones wrap THE MIRROR's ops 4 + 3.
  - **Landscape** (height ≤ 500): the ops as a 2 × 4 column on the right. Its eight slots hold the six ops, UNDO and HINT; THE MIRROR's flip adds a fifth row (5 × 48 + 4 × 6 = 264 px, inside a 390 px height). #ops shows 10 buttons today (index.html:175–181), and 14 with the flip, AR (:339) and Scope creep's RAYS and VIEW, so in landscape RELIEF, LADDER, RAYS, VIEW and AR move to the gear sheet (U3), and RAYS and CODE keep their keys m and c (T1, M3).
  - **Desktop and Pi** (width ≥ 1024): a 360 px left column, with key caps g G f i q r u (README:29, index.html:312). The flip, HINT, RELIEF and LADDER have no key. A cell's panel opens only from a canvas tap (A.pick, index.html:311), so a keyboard user can never open a cell's panel or answer a quest. Add x (the flip), h (HINT) and p, which opens the panel on the cell under the reticle (A.pick(0, 0)) *new*; c is CODE's (M3), and Enter and Space already press the focused button. The caps show on the buttons.
  - **WebXR dom-overlay:** Z1, Z2, Z5, Z8 and the inset only. Cards become bottom sheets of at most 50vh (#won and #chap dim the whole room today, index.html:65). No backdrop-filter.
- *Type.*
  - --mono with tabular numerals for every number; --sans italic for the voice.
  - Titles per skin: RELIEF mono 600; VOID a condensed sans at weight 900, capitals; MATRIX mono 400; SINGULARITY sans 200 with tracking .3em.
  - The glyph stack adds Noto Sans Math, STIX Two Math and Cambria Math for 𝟙 (U+1D7D9).
  - No remote webfonts: nothing leaves the device (README:31). A local font does not break offline play: a font file subset to the 16 G16 glyphs, listed in sw.js SHELL, is cached like the scripts (sw.js:3–4), and it is the surest cure for 𝟙's tofu (Risks).
- *Numbers.* Contrast, as WCAG ratios computed in python:
  - Today's palette on #0a0d10: --text 17.04, --dim 7.55, --gold 8.52.
  - Where the gradient has fallen to alpha .6 over a white screen: text 4.49, dim 1.99, gold 2.25. Over the video's brightness(.8) ceiling (#cccccc): 6.11, 2.71, 3.06.
  - Panel at .86 over white: dim 5.04, gold 5.69, red 5.18. The op hues (index.html:175) are not tokens, and as text straight on that strip they fail: ×i 3.83, Γ 4.00, 6↔9 4.32 (÷g 8.43); on a button's own .82 fill over it they hold 5.34 and up. At lightness 70 % they reach 4.62, 4.74 and 5.06, so check.js tests the seven op colours too. VOID's 5.64–12.42 is the dark case (panel .82 over #0a0d10).
  - --line #24302a is 1.42 against the 3 non-text needs; the proposed --hair #56735f is 3.72 on the ground but 2.49 on the .86 strip over white, so it fails check.js's own 3:1 there. #6f8a78 gives 5.18 and 3.46.
  - Ray colours 0–3 on the ground are 2.28–2.84, so they are never used for text.
- *Refs* A14, A15, A1, A6.
- *Risks.*
  - backdrop-filter over a WebGL canvas that changes every frame is unmeasured on VideoCore; data-lowend removes it.
  - 𝟙 may be missing from DejaVu or Android fonts. Detect tofu with measureText, or fall back to a 16-glyph sprite.
  - A switch mid-chapter would re-colour every instrument under the player's eyes. skinFor reads only the mode and spec.chapter and is called only at ENTER and when a card opens, and check.js asserts the four switch levels.

**U2 · THE MOVE, FELT: one motion grammar.** *M*
- *Sees.* On every move each instrument moves with the sky, in the same frames, and lands when the cells land. UNDO flows backwards instead of jumping the marker. The rare cells get their own landings: a gold flare on 1, 16, 256 and 241; 'Γ(n) = n' written on 46 and 92; the reticle tightening on 137; at ∞, every ring collapsing to a point and re-opening on Γ(∞) = 1.
- *Does.* Plays with buttons or keys, as today.
- *Gets.* Each move reads as what it is (a step, the far side, a mirror, a quarter turn, a Möbius scatter), and the closing move gets its own beat (M4).
- *Builds on.* flowDur (ar.js:204); the flow's smoothstep (ar.js:88). The flow fraction is already readable at A.A.cellB.mesh.material.uniforms.flow.value, and A.A.flowOp already exists (ar.js:204, :232). snd.op plays at the press and snd.cell at 0.9 × flowDur (index.html:227, :229).
- *Changes.*
  - hud.js reads the flow fraction every frame; the HUD keeps no timers of its own.
  - ar.js flow(op, pre) takes an optional preimage function, so UNDO can flow backwards:
    - undo ×g: n → 3n;
    - undo ÷g: n → 86n;
    - undo ×i: n → 16n;
    - undo Γ: F.gamma;
    - FOLD, INV and the flip are their own inverses.
  - index.html: UNDO (:177) and u (:312) call it.
  - sound.js: op('flip') and op('undo') *new*. The flip falls through to the switch's default today and plays nothing (sound.js:218).

| move | what animates | ms | SND hook |
|---|---|---|---|
| ×g | every cell eases from its preimage (ar.js:87–89); the number rolls +1 like an odometer; the caret moves +1 tick (1.406°); chart: one spoke on (234 cells), one ring out (21), the seam chord 86 → 1; ruler +1 band; floor re-forms, hue +1.406° (R1) | 500 | op('g'): a glide up one semitone in 80 ms (sound.js:212); cell(v) at 450 ms |
| ÷g | the same, backwards; hue −1.406° | 500 | op('ig'): a glide down one semitone (:213) |
| FOLD | fold threads (ar.js:147–148); the number flips about X at 400 ms; caret 180°; chart ray +8 or +4; grid half turn (224 rigid); floor gesture (R2); crowd burst over 0.4 s (H1); corridor if earned (V2) | 800 | op('fold'): a click, then a triangle 8 semitones up an octave down, panned apart (:214) |
| INV | the number mirrors (scaleX −1 at 400 ms); the caret reflects about tick 0; the chart turns inside out; grid palette d ↔ 256 − d; lift if earned (V1) | 800 | op('inv'): the last three arrival notes, reversed (:215) |
| ×i | the number turns a quarter; caret 270°; grid rigid quarter turn (225); chart: spoke +16 rings, or ray +8 inward; hue +270° | 800 | op('i'): a 2 % bend panned from −0.9 to 0.9 over 0.2 s (:216) |
| Γ | Γ's orbit arcs (ar.js:150, :234); warp circles (index.html:244); room inversion, gated (U3); the number dissolves to its glyph pair and back; chart long chord; grid Möbius scatter, 137 flying to the ∞ pip | 1100 | op('gam'): a ±2-octave sine sweep along a pan curve (:217) |
| 6↔9 | each 6 or 9 of the number spins 180° in place; the flip crosses Γ's sides for 36 of the 82 cells it moves | 800 | none today → op('flip') *new* |
| UNDO | the undone move's flow and tweens, reversed; the effort segment falls orange (H2); the tide runs back | the undone move's | a voice line only today (index.html:177) → op('undo') *new* |
| closing move | slowed ×1 / ×2 / ×3 by stars (M4); CLOSED at +260 ms; stars at +550, +780, +1010 ms; contour brightens (R1) | 500–3300, +150 | win(): the chord, then a bell per star (:237–244) |
| loss | the bardo (V3); the bar falls; the climber slides | 2500 | lose(): a 1.0 s slide, a thump at +1.0 s, the drone back at +2.5 s (:246–251) |

The busy gate allows at most 2.22, 1.39 and 1.01 moves a second for the three flow lengths (1/(0.9·flowDur), index.html:229). Under CALM every tween becomes a 150 ms opacity cross-fade *(design)* and the flow is pinned (U3).

**U3 · CALM, THE FLASH GOVERNOR, AND SETTINGS.** *S for the gate, M for the sheet and palette*
- *Sees.*
  - **CALM on** (the system's prefers-reduced-motion, or the in-app MOTION setting): nothing moves the camera, no tunnel is flown, nothing flashes. Each effect shows a still or a slow fade. Γ's room filter becomes a hue turn without the inversion. The flow is pinned, so cells do not travel, but the busy gate and HALT keep their timing.
  - **CALM off:** the effects play, but every large luminance change passes one gate.
  - A gear (on the start screen and in the status strip) opens one sheet: HUD (CHAPTER / FIXED; U1) · MOTION (SYSTEM / FULL / REDUCED) · STROBE (ON / OFF) · COLOUR (RELIEF HUE / RAYS / CVD-SAFE) · VIEW (ROOM camera / SKY / AR when supported; AR moves here from the aux that index.html:339 appends at ENTER, which with RAYS and VIEW would be a fourth #ops row over #quest; Scope creep's VIEW aux, cycling RAIN and CODE, then needs another name) · SOUND · TUNING (chromatic / a220 / lambda / tape) · CODE · MAP · TEXT 100 / 150 / 200 %. WCAG 1.4.4 asks 200 %, and index.html:5's user-scalable=no blocks pinch zoom on Android Chrome, so TEXT is the only zoom there.
- *Does.* Toggles. Each choice is kept on the device and applied before the scene is built. The sheet also holds a button for every action that is elsewhere only a key or a long press (T3's BITS, key b or a long press; Scope creep's 'everything else'): a key is out of reach on a phone, and a long press is out of reach of a keyboard (WCAG 2.1.1) and hard under a screen reader.
- *Gets.*
  - Photosensitive, vestibular-sensitive and colour-blind players play the same challenges and still read hue = dlog.
  - A player who will not share the camera picks SKY instead of being asked on every ENTER (index.html:336).
  - A player who needs the HUD never to change picks HUD FIXED (U1). Nobody picks a look: the sheet names no skin.
  - The four tunings already written (sound.js:39–44, :195) become audible.
  - It fixes F2.
- *Changes.*
  - fx.js §6 *new*: calm(on) and strobe({dL, area, rgb}, now).
    - A flash is an opposing change in relative luminance of 0.1 or more (with the darker state below 0.8) over at least 2.8 % of the screen, or any saturated red (R/(R+G+B) ≥ 0.8). The 2.8 % is a quarter of WCAG's 10° field estimate, 341 × 256 px at 1024 × 768, i.e. 21824 px².
    - At most 3 onsets in any 1000 ms, at least 334 ms apart (⌈1000/3⌉).
    - A type-only appearance on black is not an opposing pair, so it passes.
    - Registered sources: the Γ room inversion; the FOLD, INV and ×i video transforms (up to 1.39 a second); title slams; the I AM disc; the gold beat; share flares; the crowd's FOLD burst.
    - A refused flash runs its fallback: a fade by FX.persistence over 600 ms.
  - index.html:
    - prefs load from LS 'fold.prefs' before A.init (:164);
    - setCalm() reads matchMedia('(prefers-reduced-motion: reduce)') and listens for 'change'; html.calm mirrors the CSS rule at :79;
    - a local fallback flag, because FX may be null (index.html:137);
    - #voice (index.html:110) and #toast (:120) get role='status' aria-live='polite' (neither has one today), and every slam and title card also writes its words to a visually hidden live region *new*, so a type-only moment reaches a screen reader;
    - STROBE off deletes the hard-coded invert at :237 (changing fx.js cssFilter alone would leave it), caps FX.pulse at 0.42, and drops warpRun.
  - COLOUR:
    - palette_cvd is indexed by dlog, for the relief. It is passed to relief.js as opts.palette, so relief.js keeps depending on three alone (relief.js:12–13); turn() (:192) and conic's 'index' mode (:155) need it too.
    - palette_cvd_rays has 12 entries, for ar.js rayColor, which colours by ray. Its rays 5–7 (L* 43, 40, 43) reach only 3.36, 3.02 and 3.36:1 on --ground, and rays 4 and 8 exactly 4.50, so ray numbers and words stay in --text beside a swatch, never in the ray colour. Reading the dlog palette there would erase the ray coding: neighbouring dlogs are only 1.1 ΔE apart.
  - parts/shaders/check.js *new*, beside fx.js where strobe() lives (parts/void/ first appears in Phase 2), so Phase 1, which ships this gate, gains this one new file. It drives strobe() with a fake clock at 20 requests a second for 5 s, and asserts at most 3 admitted onsets in every sliding second, none under CALM, and every sub-threshold request admitted.
- *Numbers.*
  - **Γ inversion** (brightness .8, then invert; index.html:237): over a room of sRGB grey 0.2, 0.35 or 0.5 the luminance change is 0.652, 0.413 or 0.186. It reverts after 880 ms, and Γ moves are at least 990 ms apart, so today it is about one full-screen flash a second. Under the CSS-only reduced-motion rule it becomes an instant one.
  - **CRT pulse** stays ungated, and this is why: its retrace band (0.10 + 0.30 of strength, fx.js:186–189), linearised over black, peaks at a luminance change of 0.029 (×g at 0.6) and 0.033 (Γ at 1.0); the centre is 0.0035.
  - **The 0.42 cap** is 0.1/(0.40 × 0.595), where 0.595 is ÷g's tint luminance; that treats the shader's output as linear light. Linearised as in the line above (the quad's gl_FragColor reaches the canvas unconverted, fx.js:192), ÷g's band peaks at 0.082 at strength 1.0 and at 0.016 at 0.42. No strength up to 1.0 reaches 0.1, so the cap is margin twice over and binds only if the output becomes linear.
  - **CVD circle:** L* = 62 + 22 cos θ, a* = 0, b* = 45 sin θ (*design*, validated). Minimum ΔE76 over 12 samples is 12.5 / 12.3 / 11.7 / 9.7 (normal / deutan / protan / tritan, Machado 2009), against 17.3 / 4.6 / 1.8 / 3.1 for the relief hue and 12.5 / 4.9 / 2.0 / 1.8 for ar.js's wavelengths. At the ray indices it is 12.3 / 12.1 / 11.5 / 9.6. All 256 entries are in gamut.
- *Refs* A14, A1, A15, A37.
- *Risks.*
  - Check a screen capture with PEAT or Harding before release.
  - The gate works only if it is the single path to a large luminance change; make that a code-review rule.
  - Ray numbers on every label, so colour is never the only cue (WCAG 1.4.1).
  - iOS remembers a refused camera per site, so SKY must not ask again.

**U4 · THE INSTRUMENTS: ray ruler, compass tape, coherence needle.** *M*
- *Sees.*
  - **Ray ruler.** A pitch ladder on the left edge. Its 12 bands sit at the screen heights where the sky's ray bands really are for the camera's pitch: −34.0, −25.6, −17.3, −8.9, −0.5, 7.8, 16.2, 24.5, 32.9, 41.3, 49.6, 58.0° (ar.js:33). The lit band is labelled in full, e.g. 'R5 · 482 nm · B' (wavelength and note); the rest show R0–R11.
  - **Compass tape.** Across the top, the horizon as the cycle: 256 ticks, a long one every 16 (ar.js:141), gold marks at dlog 0, 64, 128 and 192 (cells 1, 241, 256, 16), and carets for you, the target and home. The target can be found without the off-screen arrows.
  - **Coherence needle.** Under the tape, the road's vector sum R = |Σ e^{2πi·dlog/256}|/N over the road's cells (A37). Its angle is the road's mean phase, and it turns from red to green as the road keeps phase. Red against green is the pair protan and deutan players lose, so R is also printed to two places and IN PHASE gets a tick, not colour alone (WCAG 1.4.1).
  - On HALT levels, R5's rings also stand round the reticle, at the same radii.
- *Does.* Tilts to find a band, turns to centre the target caret, and tries to close at par and in phase. Mean pair coherence over all starts: ×g and ÷g runs keep phase (1.000), ×i keeps 0.707, INV 0.637, Γ 0.624, and FOLD cancels it (0.000).
- *Gets.* The rays as named light (A15), and a secondary mark, IN PHASE, on the card for a close within par + slack with R at or above the day's upper quartile of par-road coherence. It is counted on the seal and never costs stars.
- *Changes.*
  - hud.js frame(): pitch and yaw from the camera's world direction, two translate writes per frame. In XR, read renderer.xr.getCamera(A.camera).cameras[0]. r128's getCamera copies the XR pose into A.camera (matrix, matrixWorld, position, quaternion) but not its projection, which stays the 70° one of ar.js:126 and resize() (:160). The same problem affects onScreen, the arrows (index.html:320) and pick (ar.js:229), which all project through A.camera.
  - game.js: S.inPhase, saved as 'phase'.
  - index.html: write the clock text only when the integer second changes (:324).
  - Level 61, today's chapter-8 HALT level, has THE TURN stepped by moves (index.html:195, :201) only through F6's off-by-one. After F6, THE TURN stands in chapter 7 (levels 49–56), which has no HALT level today (HALT: 21, 22, 29, 41, 61). Step THE TURN by the clock wherever a HALT level meets it; elsewhere use R5's rings.
  - Labels read FOLD_SOUND's NOTE and NM (sound.js:262) and AR.RAY_RGB (ar.js:237), so no third copy of them can drift; material.js 'rays' *new* carries only each ray's track and sign, once gen_material.py reads the corpus (Missing data). NM truncates (482 for ray 5); ar.js:27's exact value is 482.9.
- *Numbers.*
  - Wavelengths 377.0 … 610.0 nm (ar.js:27). sound.js NM truncates them; ray 5 is 482 nm, as A15 says.
  - Today's par roads (64 levels): R min 0.031, lower quartile 0.201, median 0.387, upper quartile 0.567, max 1.000 (the 16th and 48th of 64 sorted values).
  - The 64 targets alone give 0.101 (1/√64 = 0.125), which is why the needle reads the road, not the targets.
- *Refs* A15, A37, A2, A4, D1.
- *Missing data.* Each ray's track and zodiac sign are in the machine's OPTICAL bar (A15, LEDGER 74–75), which is not in this repository. Labels omit them until gen_material.py reads the corpus.
- *Risks.* 12 bands with three label parts each do not fit 28 px, so only the lit band shows its full label.

**U5 · THE LINE, THE TRACE, THE HINT, THE PANEL.** *S for hint and panel, M for the rest*
- *Sees.*
  - **The line strip.** For the first time the line shows during play; today it appears only on the cards (index.html:257, :286). Above the ops: the last three words and two cells, 'Σ 167 EYE OF PROVIDENCE · φ 17 Q' (SCRIBE today after level 8; Numbers). Σ is the letter sum's cell; φ is the positional part, by B12's law (k, s, b)·(k′, s′, b′) = (k + k′, s + s′, b + b′ + k·s′). A closing word types in and both cells roll.
  - **Spaghettification.** In the SINGULARITY skin, which is chapter 7 (levels 49–56, the eye's chapter; U1), the words stretch toward the eye's screen position as you near it, with s(d) = 1 + 2/(d + 1)³ (3.00, 1.25, 1.074, 1.031 … for d = 0, 1, 2, 3). Word i of k stretches by s^((i+1)/k), with area kept. This radial tide is the counterpart of S1's tangential arcs. On the crossing the letters stream into the eye and re-form at the top edge.
  - **The trace.** In CODE view, a 3-line log records each move as arithmetic ('×g 62·3 = 186 · d 34 → 35'). The stand shows 'n = 3^d · 0xNN', and the status strip rains the level's own π digits with the opcode digit lit.
  - **The hint** appears as chips: 'Γ×10 ×i Γ×11' for today's level 1. The first HINT on a level is free, and the HINT button shows its price ('free', then '★★'). The chips light one by one as the player follows them, grey on a move off them, and light again on UNDO back onto them (Q4).
  - **The panel's** mirror list reads '4 of N ›' and expands grouped by mirror cell 27k − s. It adds hex, 3^d, nm, note, Γ side, ring and ladder. Its close button is 44 × 44.
- *Does.* Reads the line as a running computation and taps it for each word's (k, s, b); toggles CODE; taps HINT and gets a short, readable road, free the first time on each level.
- *Gets.*
  - "Seeing the code behind things", which here is literally the field's own arithmetic.
  - A line with two names each day: SCRIBE today, on par roads, ends on Σ 30 ARK · φ 109 NIETZSCHE. The plan's unshifted targets would give Σ 221 INDUSTRIALIZATION · φ 232 TOPOLOGICAL QUANTUM (F8).
  - When level 56 closes, 'your line went through the eye: Γ(Σ) = …' on the card and the seal. For example, Γ(56) = 23, whose words are CALEB, DJED, AIM, BAT, I AM; Γ(137) prints '∞ the open circuit'.
- *Changes.*
  - field.js: positional(s) *new*. Its index advances on the letters A–Z only, so the law equals positional() of the space-joined line.
  - game.js: lineInfo() also returns b, phi, phiWord and gamma. hint() becomes hintPress() (Q4), and it and showCell's road use LV.road (F5).
  - hud.js: lineStrip, trace and rle. The strip, the hint chips and the rule pill are <button>s, so a keyboard reaches each word's (k, s, b). The trace is role='log', and #voice and #toast get role='status' aria-live='polite'; nothing on the page is announced today.
  - index.html: showCell's expander (F4), the code facts, and the gated road (F5).
  - ar.js: atlas(cells, mode) redraws the code faces on toggle, an 18,874,368-byte re-upload; that is a one-off hitch on a Pi.
- *Numbers.*
  - RONGO is (5, 69, 193); RONGORONGO is (10, 138, 731), and 731 ≡ 217 (B12).
  - SCRIBE today, every level closed in order on par roads, with the line game.js:77 builds (a SHIFT level adds its shifted target's word: levels 6, 7, 16, 45, 47; F8): after level 8, k 53, Σ 167, φ 17; after level 64, k 559, Σ 30, φ 109. The plan's unshifted targets give k 48, Σ 99, φ 95 and k 550, Σ 221, φ 232.
  - Today's level 1 hint is 38 moves (Γ×37 ×i), a 112-character toast cut off by nowrap (index.html:73). LV.road gives 22 moves; the longest LV.road today is 25 (level 18). As chips, today's 64 roads take 1–7 chips (mean 3.38) and at most 17 characters. Over the 100 days from 9422 they take 1–7 chips (mean 3.47; 35 of 6400 roads need 7) and at most 21 characters. Seven 44 px chips with 4 px gaps are 332 px wide, inside a 360 px phone less two 10 px gutters.
- *Refs* B12, C1, B18, B13, B5, C16, A12.
- *Risks.* The trace describes the move just made, never the road ahead. Spaghettification at s = 3 with area kept leaves a 12 px word 4 px tall, so the stretched word is an aria-hidden copy over the plain strip text, and it is off under CALM and under HUD FIXED (U1). Long tablet words in the strip need ellipsis and the expander. WCAG 2.5.8 asks 24 × 24 (AA) and 2.5.5 asks 44 × 44 (AAA); today's close button is about 25 × 24.

**U6 · THE CARDS AND THE SEAL.** *M*
- *Sees.*
  - **Name screen.** Each letter's value drops down a short π-rain column into the running sum. The cell lands as a pixel on the 16 × 16 table and a dot on the twelve rays. Under it: the cell's glyphs, ray, character, Atbash mirror (27k − s), φ-part, and square roots when it is a residue (C16). SCRIBE: 56 CARDANO, k 6, ∞ε, ray 1, dlog 229 (odd, so a non-residue with no root), mirror 27·6 − 56 = 106 NEFERTITI, φ 155 SINGULARITY.
  - **Boot.** ENTER boots the HUD during the bloom, in the bloom's own order (POW, ar.js:165): the status strip types in, the table lights cell by cell, the ops rise. It all fits inside the existing 3.9 s before openLevel (index.html:335, :338), with no new wait.
  - **Won card.** CLOSED slams on the chord (+260 ms), and the stars appear with the bells (+550, +780, +1010 ms; sound.js:241, :243). Also: the road as chips, the line's new word with Σ and φ rolling, the marks (SIGHTED, IN PHASE, AMBER), and the chart replaying the road.
  - **The seal.** The floor settles to the plain norm, and the day's closed cells rise on it as contour lines, one chapter a second: each is {a² + ab − b² ≡ t}, 258 points in its dlog hue. These are S.targets, the cells the seal multiplies, so a SHIFT level's line is the cell it closed on (F8). Where a line runs through a star (targets 154 or 103), the stars on it flare. The seal cell's contour is drawn last, in white. Under the map the card names it 'product of the 64 closed cells ≡ 227 LAMB OF GOD' (SCRIBE today). On a day that closed a 0 it reads 'sum of the closed cells'; a day ended early with END THE DAY names the n of 64 it sealed; and when V3's second life was taken it adds 'reborn N'. The card carries the day's heat picture (H3), the ledger (T4) and SHARE (text and PNG).
- *Does.* Types a name, then ENTER, GO, NEXT and WALK ON as today. A tap or Esc skips any card animation, and the card's first button takes focus when it has played. In 3D, turns round to read the contour map.
- *Gets.* The day ends on two images that belong to that day and that name: the contour map in the world, and the heat on the card.
- *Builds on.* The start screen (index.html:87–104, nameCell at :158); won() (:247–264); endDay() (:280–289); LV.seal (levels.js:209–216); the five stars (relief.js:46).
- *Changes.*
  - index.html nameCell(): adds mirror, φ, roots (a 257-entry scan) and a mini table/rays canvas.
  - hud.js: boot(t0) *new*.
  - won(): timings matched to sound.js.
  - endDay(): RL.floor('norm') at ratio 1, and relief.js contours(sheet, cells[]) *new*, one Points of all the level sets taken from R1's table with an opacity ramp per batch. THE TURN and any ceiling are disposed first.
  - Saving the picture needs render and toBlob in the same frame, because the renderer has no preserveDrawingBuffer (ar.js:124).
  - Slams go through FX.strobe (U3).
- *Numbers.* At most 64 × 258 + 258 contour points, which with the floor is 33416 vertices, under 40k. Today, on par roads:
  - the 55 distinct cells SCRIBE closes (S.targets; the plan's targets would be 54, F8): 14190 points, and 31094 vertices with the floor and the white seal line.
- *Refs* A10, A7, C16, C3, D1, D2, A13, A34, B32.
- *Risks.* 50+ families of curves can blur; the white seal line on top, the batching and a 'one chapter' toggle keep it legible. Over the camera a full-screen black card hides the room for about 1.2 s, so AR uses half-sheets.

---

## Fixes found on the way

**F1 · field.js:10 and :18 — G16 is a string, and 𝟙 takes two code units.** G16[15] is a lone high surrogate, so glyphs() is broken for 31 cells: every cell with a hex digit F, i.e. 15, 31, …, 239 and 240–255. Gold cell 241 is among them (verified in node). The broken glyph shows on the billboards (the atlas, ar.js:58), the HUD, the panel and the share text.
*Fix:* `const G16 = Array.from('Φ∂φ∞⊟⊗♯⅗εδΩΓQΣψ𝟙');`, with parts/story/check.js, which already loads field.js, asserting 2 code points per pair (3 for 256). Phase 1's one new file is U3's parts/shaders/check.js; parts/hud/check.js comes only with U1.

**F2 · index.html:79 — reduced motion is honoured in CSS only.** The rule removes the #video transition (index.html:18). So the Γ inversion (index.html:237) and the FOLD, INV and ×i transforms snap across the full screen for exactly the players who asked for less motion: a luminance change of 0.65 over a grey-0.2 room. Nothing in JS reads the setting, so the flow, the bloom, FX.pulse and warpRun all ignore it.
*Fix:* U3.

**F3 · data.js cells[44].w is the name-word that material.md:10–12 keeps out.** It is printed on the billboard (ar.js:58), the stand and the panel. cells[62].ws carries 62's name-word, which the panel lists (index.html:298). gen_material.py:11–14 has the rule (NAME_CELLS {44, 62, 70}); build_data.py does not apply it.
*Fix:* build_data.py drops the name-words from 44's ws (its first word) and 62's (its third), and w is the first word left: 44 SPACE, 62 FIBONACCI, 70 LILITH. It must not copy gen_material.py:11–14 as it stands: NAME_CELLS {44, 62, 70} with w = ws[1] would rename 62 FIBONACCI to TORAH and 70 LILITH to PROOF. That is why material.js kaprekar_families already says [62, 'TORAH'] where material.md C4 says 62 FIBONACCI. Give gen_material.py the same rule, and settle 70, since material.md:10–12 names only 44 and 62. parts/corpus/check.js asserts it, and that each kaprekar_families [cell, word] is D.cells[cell].w (today 44 SPACE and 62 TORAH fail). It does not assert this of every [cell, word] in material.js, because word_cells (below) holds non-first words.

Tried in a scratch copy with the two words removed:
- story/check.js fails at story.js:115, whose voice for 44 opens with the name-word.
- D.mirrors drops from 2551 to 2543 (2409 two-way, 134 one-way), entries from 2306 to 2304, and cell 44 from 31 words to 30. So material.js tablet_entries, fullest_cells and atbash.mirror_pairs_on_tablet change, and so do material.md C1 (:376–377), C5 (:396) and D15 (:586), and README:5.
- mirrorPairs() drops from 1821 to 1813 (levels notes:54), and quest() picks by index (levels.js:184, :203). Today's chapter 6 quest moves from 64 PLATO to 68 ZOHAR, and chapter 8's from 51 RUACH to 63 USER. Ship at a day boundary, or version the run key (game.js:23).
- The name-words also stand in parts/relief/notes.md:72 (step 25: use 44 SPACE), parts/levels/notes.md:5, :15 and :37, and test.js:3, where 62's name-word is the test player although test.js:84 plans TORAH.

**F4 · index.html:296 — the mirror list is cut at 4 without saying so.** Both orders have been listed since de556b6 and 2ac2f01, but `.slice(0, 4)` hides the rest: 129 cells have more than 4 listable pairs (48: 140, 60: 136, 68: 117). Separately, levels.js:124 pairOf names only a word's first partner, although 1043 words have more; this is cosmetic, since all of a word's partners share its cell.
*Fix:* the 'k of N ›' expander (U5).

**F5 · game.js:91 and index.html:292, :301 — HINT and the panel use F.solve, a 0-1 BFS that does not minimise moves.** Today's level 1 hint is 38 moves (Γ×37 ×i) in a 112-character toast that nowrap cuts off (index.html:73); LV.road gives 22. Level 17's F.solve road is 69 moves. The panel also prints the road to any tapped cell, the target included (index.html:301), which bypasses the challenge.
*Fix:* road(s, t, free, ops, avoid) gets two new parameters:
- ops (OPSET is private, levels.js:28), called with S.opsList;
- avoid: cells the road never enters short of the target. On HALT days these are B22's 27 HALT cells (decision 3); on other days the set is empty.

game.js hint() and showCell (index.html:292) call road() in place of F.solve; SHIFT keeps solveShift (game.js:91), which takes the same avoid set. The first HINT on a level shows that road for free, as chips (U5); further presses cost as Q4 sets out.

On an ordinary level the panel's line for the target reads 'the road is HINT's · free' or 'the road is HINT's · ★★' and never prints the road. That stops the plain tap, not a hunt: the target's panel lists its fold, inverse and Γ (index.html:300), and on 3533 of the 5719 levels of the 100 days from 9422 without SHIFT or the eye (SCRIBE, HALT cells avoided on HALT days), the road to one of them plus that one move closes at 3★. On a word level the target is hidden, so the panel prints every cell's road, the target's included, and the target's panel looks like any other.

Over the 5819 non-SHIFT levels of those 100 days, LV.road's roads run 1–25 moves (mean 4.65) and F.solve's 1–88 (mean 6.56). Every LV.road road costs exactly par.

**F6 · index.html:195 — `ch === 7` with a 0-based ch (index.html:192).** THE TURN stands in THE SEAL (levels 57–64), while README:22–23 says the eye's chapter.
*Fix:* `ch === 6`.

**F7 · index.html:201 and relief.js:191–195 — the relief does not follow the player.**
- monStep steps THE TURN and the ceiling by S.moves, so a FOLD or a Γ counts as one ×g and free moves not at all.
- UNDO (index.html:177) and u (:312) never call monStep.
- The norm floor itself is never stepped: monStep touches only MON.obj, never MON.floor (index.html:188, :201), so relief notes:67–70's `floor.setT(S.moves)` is not wired.
- THE TURN's LineLoop is in orbit order but placed by dlog, so each segment jumps 147 dlog (206.72°) and the ring draws as a star polygon. Its marker is 216^moves, unrelated to the player's cell.

*Fix:* R1 and R3.

**F8 · index.html:281 against parts/levels/test.js:74 — two different seals.** endDay seals S.targets. game.js:77 pushes S.target after game.js:73 has shifted it, while test.js:74 seals the plan's target0. So SHIFT levels 6, 7, 16, 45 and 47 record 81, 40, 82, 54 and 249 instead of 1, 144, 141, 172 and 74. For SCRIBE on day 9422 with par roads, endDay shows 227 LAMB OF GOD, and test.js's rule gives 130 PYTHAGORAS. For TORAH, the name test.js plans (test.js:84), test.js prints 101 AMPLITUDE and the card would show 36 IMAM. The seal is per name, because the ladder levels 36 and 40 start from the name's cell.
*Fix (decided: the seal is the cells you close).* The seal is LV.seal(S.targets), which endDay already computes (index.html:281). It takes the cell each level was closed on, one entry per closed level, and a SHIFT level's moved target t0·3^moves counts (game.js:73, :77). game.js:73–77 and the seal call at index.html:281 stay as they are. What changes is what checks the seal and how the card labels it.
- test.js:74 becomes `L.seal(plan.map(sp => play(sp).target))`, the cells the par roads close on: play() already follows the moving target (test.js:19–21). The first-32 seal at :77 changes the same way. test.js also requires game.js, which loads in node as it is because its localStorage calls sit inside try (game.js:24–25). For today's plan it plays every spec road through G.start, G.apply and G.next, and asserts that G.S.targets equals those cells and that L.seal(G.S.targets), the card's own call, gives the same seal. Run in node, both give 227 LAMB OF GOD for SCRIBE and 36 IMAM for TORAH (64 closed, 192 stars). For TORAH on day 9384 the seal becomes 170 IMAGINARY NUMBER; test.js prints 242 HEISENBERG UNCERTAINTY there today.
- What the seal now depends on. On a product day it is the plan's seal × g^m, where m is the number of moves used on the day's SHIFT levels: today m = 23, and 130·3²³ ≡ 227. So every move on a SHIFT level turns the seal one ×g. This holds on all 68 product days among the 100 from 9422 (SCRIBE). The other 32 days close a 0 and seal by the sum, where one more SHIFT move adds 2t for that level's cell t. A day has 2–11 SHIFT levels (581 in those 100 days). SHIFT has no slack, so 3★ on a SHIFT level means exactly par moves, and a day with 3★ on every SHIFT level seals one cell per name and day. The name enters only through the ladder levels 36 and 40. test.js asserts the ×g step on product days: one SHIFT cell × 3 multiplies the seal by 3 (SCRIBE's level 6 at par + 1 turns 227 into 167 EYE OF PROVIDENCE).
- index.html:286 says 'product of the targets' even on a sum day. It follows seal.by instead ('product' or 'sum of the closed cells') and gives seal.n of 64, since END THE DAY seals what is closed so far.
- The line comes from the same cells: game.js:77 pushes the shifted target's word. So the card's two readings of the seal, the line's cell in its prose (story.js:35, :58) and the product line, both come from what was closed.
- parts/levels/notes.md:64–66 gives 220 CENTRAL LIMIT THEOREM for day 9384 and 54 LOVE for 9421, seals that neither rule gives: for TORAH the plan's targets seal 242 and 256 BAAL SQUARED, the cells closed 170 and 180. They are rewritten as TORAH's 170 IMAGINARY NUMBER (mirror 235 BINOMIAL DISTRIBUTION) for 9384 and 180 JOHN VON NEUMANN (mirror 198 BEAUTIFUL DOORWAY) for 9421. README:19–20 adds the product of the cells closed.

**F9 · field.js:35 — the flip's tell is false in a six-move game.** It says "the one move that can cross Γ's sides", which is true only beside Γ alone (B17). Γ has two orbits of 128, plus its fixed points 46 and 92. Over the moves that neither start nor land on 46 or 92, ×g and ÷g cross between the orbits for 130 of 252, FOLD and INV for 128 of 252, ×i for 112 of 252, Γ for 0 of 256, and the flip for 32 of 78. Counting a landing on 46 or 92 as a crossing gives 132, 130 and 114 of 254, and 34 of 80 for the flip (node over field.js).
*Fix:* field.js:35's tell and :33's comment become "Γ never crosses its two sides; the flip crosses for 36 of the 82 cells it moves". B17's hook "the one way across Γ's sides" (material.md:294) goes too.

**F10 · ar.js:234 and fx.js:309–319 — dead paths.** A.showOrbit is read but never set. grab() is never called, so warp() always runs with useMap 0.
ar.js:234 also fades the threads, the ladder and the orbit to opacity 0 instead of hiding them, and three r128 still draws them. So 3 of today's 14 draw calls draw nothing: level 1 measures 14 calls, and 11 with the three hidden (Chromium 1194, SwiftShader; no measurable change in frame time there).
*Fix:* set each line's visible to (opacity > 0) in frame(); wire A.showOrbit to M3's CODE view (Γ's orbit of your cell is already built, ar.js:196–197) or delete it; S1 drops map mode.

**F11 · relief.js:85 and :91 — Uint32Array index buffers for wire and mesh.** On WebGL1 these need OES_element_index_uint (Pi 4, older Mali). 16641 vertices fit a Uint16Array. Latent today, since the modes are unused; R2 uses them.

**F12 · ar.js:85 — `if (iState > 4.5) s = 1.15` catches every state of 5 or more.** Re-bracket it before adding states 6+ (Q1, Q3, Q4, T2). This is a trap, not a live bug.

**F13 · material.js and material.md errata.**
- tunnel.glyphs (material.md:249) ends in δQ, which is cell 156's pair; cell 55 HEAVEN is ∞⅗. The list is typed at gen_material.py:234, although the header says 'every number computed here, none typed' (gen_material.py:2); compute it from the cells.
- B7's hook "the line closes at 87" does not compute: the chain's words sum to 1053 ≡ 25.
- material.md C7's "24 seven-step words": the rule finds 428 distinct words on the tablet, 370 of them askable by levels.js nice() (:186).
- (No erratum here: B23 appears only at material.md:318, the opcode walk, and nothing cites it for the margin stars, which are A23 at :136.)

*Fix:* gen_material.py and material.md.

**F14 · stale docs.**
- levels.js:6–8 and parts/levels/notes.md:12–17 and :51–55 put the doors at 8/16/24, the ladders at 32/48, the mirrors at 40/56 and the eye at 64. SPECIAL (levels.js:26) and the README say doors 30–32, ladders 36 and 40, mirrors 44 and 48, eye 56.
- parts/relief/notes.md:82–86 'Not done here' is out of date: relief.js is loaded (index.html:131) and cached (sw.js:3).

**F15 · old saves are never removed.** No removeItem exists anywhere in the repository, so old fold.run.* keys accumulate. Prune after Q1's backfill, keeping 7 days *(design)*.

---

## Data the game needs

gen_material.py reads the tablet from outside this repository (FOLD_TABLET, gen_material.py:10), so new material.js keys can be regenerated only where the corpus is. check.js recomputes every arithmetic key without the tablet.

| key | file | shape | computed from | used by |
|---|---|---|---|---|
| `turn_points` *new* | material.js | {rule, inv147: 155, points: [[x, y, k]] × 256 (n = 1..256), move_ticks_dlog {g: 1, ig: 255, fold: 128, i: 192}, move_steps_index {g: 155, ig: 101, fold: 128, i: 64}} | P(n) = ((n + n⁻¹)/2, (n − n⁻¹)/32), k = 155·dlog n mod 256; check.js asserts x² + y² ≡ 1 and x + 16y ≡ n | R3, Q1 |
| `zone_plate` *new* | material.js | {rule, radii_cells: [11.34, 19.63, 25.35, 29.99, 34.01, 37.60, 40.87, 43.90, 46.74, 49.41], metres_per_cell: 0.015625} | √(257k − 128.5) | R5, U4, S3 |
| `saturn` *new* | material.js | {cell: 93, word, ring_rule: "(1 + √(1028k − 611))/2", ring_d: [10.71, 19.51, 25.36, 30.08, 34.15, 37.77, 41.07, 44.13, 46.98, 49.67], gaps: [[label, figures, mod 257]]} | the parabola's column a = 10, asserted against A2 to 0.1 | R6 |
| `twelve_rays` *new* | material.js | {rule, depth_counts (literal array: 12 × 21, then 4), core [12], rim [165, 238, 200, 86], seam [86, 1], seam_fold [86, 171], marked: 62, moves {g, fold, i, inv, gam, flip counts}} | FIELD.DLOG; gen_material.py's assert_eq | T1, T4, T5 |
| `singularity` *new* | material.js | {moves_to_pole: int[258] (index 257 = ∞; six moves; check only, the game computes per S.opsList), orbits {of1: int[128], of3: int[128], fixed: [46, 92], slots {pole: 126, inf: 127, zero: 6, seed: 7}}, other_side {start: 137, target: 0, roads: [["fold","gam"], ["gam","inv"]], via: [120, 257]}} | Γ walks with ∞ as 257 | S1, S2, S3, S5 |
| `gamma.side_of_1`, `rings.all` *new* | material.js | int[128] sorted (∞ as 257, not 'inf'); {0..32: int[4 or 8]} | gen_material.py's Γ orbit (:85–89) and ring rule (:104–107); check.js loads field.js and compares | M3, M1 (JUMP pattern) |
| `axiom` *new* | material.js | {seed: 'F1-R1-CF1111-DM1-T4-P2357-C53-E111-S161-D234-PM1', tokens: [[label, factor, factor mod 257]] × 11, minus: [1, 83, 174, 182, 41, 117, 137, 212, 7], plus: [1, 83, 75, 216, 140, 120, 45, 250], pars_minus: [4, 1, 4, 3, 3, 4, 2, 5], pars_plus: [4, 4, 3, 3, 4, 2, 4], sign: 'character of day mod 257; +1 at 0'} | B24's products; a six-move BFS in python *new*, cross-checked in test.js | T5 |
| `halt_points` (read, not new) | material.js | int[27]: 5 … 249, sum 3095 ≡ 11 | D.pi[n] = 9 for n ≤ 256, asserted at parts/corpus/check.js:43. levels.js computes HALTS from D.pi itself (test.js loads no material.js), and test.js asserts the same 27 | M6, M7 |
| `autopilot` *new* | material.js | {rule: 'JUMP → 257 − pc, HALT stops, else pc + 1', halts: 153, cycles: [[25..29, 228..232], [91..96, 161..166], [118..120, 137..139]], basins: [33, 29, 42]} | B23's rules over D.pi; check.js re-runs 46 → 214 | M6 |
| `heat` *new* | material.js | {forms: {norm: {grad: [[2, 1], [1, −2]], crest: 258, zero: 1, wrap_edges: 33006, edges: 132098, gentle: 49}, circle: {grad: [[2, 0], [0, 2]], crest: 256, zero: 513, wrap_edges: 33044, gentle: 49}, hyperbola: {grad: [[2, 0], [0, −2]], crest: 256, zero: 513, wrap_edges: 33042, gentle: 49}, product: {grad: [[0, 1], [1, 0]], crest: 256, zero: 513, wrap_edges: 33024, gentle: 49}, ellipse: {grad: [[2, 0], [0, 8]], crest: 256, zero: 513, wrap_edges: 33068, gentle: 49}, parabola: {grad: '(−4, 2b)', crest: 257, zero: 257, wrap_edges: 17540, gentle: 257}}, stars: none (they are material.js norm_stars.stars, the same five points in the same order; relief.js:46 STARS holds them in another order), words: {SISYPHUS: [136, 8, 80], REBIRTH: [80, 7, 109], FALL: [31, 4, 77], GROUND: [79, 6, 83], STONE: [73, 5, 62]}} | arithmetic, with both rules written into gen_material.py and asserted in check.js: a wrap edge is a torus neighbour pair whose values differ by more than 128 (of 2·257² = 132098), and gentle means a gradient of length at most 4, the gradient being the central difference × 2⁻¹ mod 257, signed. Words get their own check loop, because SISYPHUS is not a tablet word | H1–H3, V3 |
| `palette_cvd`, `palette_cvd_rays` *new* | material.js | [[r, g, b]] × 256 by dlog; × 12 by ray; zero as a light neutral, not [0, 0, 0] on the dark ground | CIELAB L* = 62 + 22 cos θ, a* 0, b* = 45 sin θ → sRGB. check.js asserts gamut for both tables, min ΔE76 ≥ 9 under Machado 2009 for the 12 rays only, and θ rising with dlog for the 256: those 256 lie on one loop, so neighbours differ by only 0.54–1.10 before any simulation. As text on --ground #0a0d10, rays 5–7 (L* 42.9, 40.0, 42.9) reach 3.36, 3.02 and 3.36 : 1, and rays 4 and 8 only 4.50, on the line. So ray words are set in --text beside a swatch; the swatches keep WCAG 1.4.11's 3 : 1 | U3 |
| `rays` (read, not new) | sound.js, ar.js | FOLD_SOUND.NM and NOTE (sound.js:35–36, exported at :262) and AR.RAY_RGB (ar.js:27, exported at :237); sign: missing data | already exported. A material.js copy would be a third source, and the two already differ: ar.js:27 uses the unrounded 377 + 21.18r, sound.js:36 the rounded nm | U4, T4 |
| `quotient_pairs` *new* | material.js | {n: 1800, q: 7, pairs: [[8, 225], [9, 200], [10, 180], [12, 150], [15, 120], [18, 100], [20, 90], [24, 75], [25, 72], [30, 60], [36, 50], [40, 45]], norm_of_point: 216} | B31; check.js asserts a·b = 1800 and inv(a) = b | Q1 |
| `days.festivals` *new* | material.js | [[iso, day, kind, field, word, tablet_cell or null]], ten years | the same day rule as gold_2026_2027 | Q2 |
| `pi` (extended) | data.js | a string of 93810 digits: the machine's 20001 (build_data.py:13), then 73809 more; at() wraps at 93806 = 257·365 + 1 (levels.js:36), and the 4 past it let the last window, from 93805, read true digits | build_data.py pi_digits(93810) *new*: Machin's formula in exact integers, asserted equal to the machine page on its 20001; gen_material.py re-derives every digit by Störmer's formula; test.js asserts the length | Q2, M1, M2 |
| `tape_head_today`, `opcode_today` (fix) | material.js | windowBase(day_today) and π there: 9435 and 7 on day 9422, as now | gen_material.py:225 with levels.js's base rule copied; need_pi (:156) asks for the whole tape, digit 93809; corpus check.js recomputes both | Q2 |
| `word_cells` *new, optional* | material.js | [[cell, word]] for the 230 cells with a non-first askable word whose letter sum ≡ the cell mod 257 (229 by exact sum) | letter sums over data.js | Q4 |
| `seven_step_words` *new* | material.js | [[word, sum]] for the 370 words levels.js nice() can ask (:186), 352 of them standing at their own sum cell | Kaprekar steps of letter sums as four figures. The tablet has 428 such distinct words, including unaskable entries (N, O, AM, MA, GG, JD, MC2); material.md C7 says 24 (F13) | Q5 |
| `tunnel.glyphs` (fix) | material.js | last entry ∞⅗ | F.glyphs of each cell, computed at gen_material.py:234, where the list is typed today | V2, F13 |
| `cells[44].w`, `cells[44/62].ws` (fix) | data.js | the name-words out of 44's ws (its first word) and 62's (its third); w is the first word left (44 SPACE, 62 FIBONACCI, 70 LILITH unchanged) | build_data.py, and gen_material.py given the same rule. gen_material.py:11–14 as it stands would make 62 TORAH and 70 PROOF (F3) | F3 |
| spec fields | computed on device | sp.sheet, sp.work {bits, cells, possible, witness}, sp.word, sp.hideTarget, sp.fallback (on R3's, R5's and S5's specials: the tape level the special stands in front of, whole); S.shiftStep is game state in game.js (R3), not a spec field | levels.js. sp.work stays deterministic, for test.js:32's equality check, and within a budget: plan() already takes 16–28 ms in node | R2, T3, Q4, R3, R5, S5 |
| run record `fold.run.<day>.<mode>` (game.js:23–25) | localStorage | gains: climbs [{L, s, t, par, ops, out, undos, falls}], undos, steps, lost, spent int[64], closed cell per level, amber int[64], rays int[12], bits int[12], found, decoded int[], circle (64 hex digits), fell int[] (the special slots played by their fallbacks, R3), rebirths, phase | game.js save(); old runs default to zeros | H2, H3, T3, T4, M2, R3, V3, V4, U4, Q4 |
| `fold.book.<NAME>` *new* | localStorage | {v: 1, days {<day>: {c, s, seal, line}}, first {<cell>: <day>}, atlas: 65 hex digits, gold: 4 bits, q1800: 12 bits, mirrors: [], stars, rings, circle, walls, saturn, throats, stone, doors, blocks} | record() and backfill() | Q1–Q6 |
| `fold.prefs`, `fold.void`, `fold.rings`, `fold.boot.<day>` *new* | localStorage | {hud ('chapter' or 'fixed'; the skin is computed, never stored, U1), motion, strobe, palette, view, tuning, code, map, text}; flags | the settings sheet and the toggles | U1, U3, V1, M3, T5 |

---

## Phases

Every deploy that changes a file in SHELL bumps sw.js CACHE, as sw.js:1 asks, starting from 'fold-v11' (sw.js:2). One bump a release is not enough: fetch answers from the cache first (sw.js:8), so a mid-phase build on an unchanged name leaves players on the old files. The 'fold-v12'…'v14' below are each phase's first deploy. Install with c.add(new Request(u, {cache: 'reload'})): sw.js:4's c.add(u) can store a stale HTTP-cache copy, and its .catch(() => null) hides a missing or misspelled path. Every new .js file goes into index.html's script list after material.js (:132) and into sw.js SHELL. Each new part follows the house pattern: notes.md, demo.html and a node check beside the code. In all, the three phases come to about 87–201 working days, roughly 4–10 months for one developer. Phases 1 and 2 (36–76 days) deliver the four looks and both pieces; Phase 3 holds the challenges and the record across days, and can ship item by item in its dependency order.

**Phase 1 — the fortnight that changes how the game feels.** 17 S items, about 8–12 days.
- *Ids:* F1, F3, F5 with U5's hint chips and panel expander (F4), F6, F7 (UNDO and u step the relief; THE TURN's LineLoop joined in dlog order, since index.html:195 already places it by dlog and only the joining order draws the star polygon), F9, U3's gate (calm() and strobe(), fixing F2), R2's S part (CHAPTER_SHEETS, and floor(kind) unlit at 129²), R5, S3, M4, F14, and H2's effort bar (the DOM bar and S.dist; the floor climber waits for Phase 2). S3 brings S1's d(n), the reverse BFS to 137, forward into game.js.
  - Also: F10's hidden lines; F12, since S1 (Phase 2) edits the same billboard shader; F13 and F14; role='status' aria-live='polite' on #voice and #toast (index.html:110, :120), since nothing on the page has aria-live and the voice lines and toasts are never announced.
- *Files:* edits to field.js, game.js, levels.js, relief.js, fx.js, sound.js, ar.js, index.html, sw.js, build_data.py and data.js. F3 also edits story.js:115, gen_material.py (with material.js regenerated), material.md, README:5, parts/relief/notes.md:72, parts/levels/notes.md and test.js:3. data.js regenerates only where the tablet and the machine page are (build_data.py:10–13), material.js only where the tablet is (gen_material.py:10). One new file, parts/shaders/check.js (U3's gate), a node check kept out of SHELL. CACHE 'fold-v12' on the first deploy.
- *Checks:*
  - test.js: each sheet listed; HALT levels on the circle; S3's dilated clock still loses at 30 dilated seconds (game.js loads in node with a localStorage stub).
  - story/check.js: glyphs(n) has 2 code points (F1).
  - corpus check.js: no name-words; each kaprekar_families [cell, word] equals D.cells[cell].w; tablet_entries and mirror_pairs_on_tablet equal data.js's entries and mirrors.length; index.html's `<script src>` list equals SHELL's .js entries, and every SHELL path exists (today 11 = 11, none missing).
  - parts/shaders/check.js: strobe() admits at most 3 onsets in any 1000 ms, none under CALM (U3).
  Run all four before every CACHE bump.
- *The moment that sells it:* level 21 on day 9422, a HALT level in THE QUARTER TURN, the chapter that stands on the circle. Its par road INV ×i Γ ÷g runs 5, 4, 4, 3, 2 moves from 137, so S3's clock rate falls to 0.894 by the close. (HALT slots move with the day, today 21, 22, 29, 41 and 61; R5 puts the plate under every rule-9 level.) The zone plate goes dark ring by ring under your feet; the clock slows as your road nears the eye, to 0.95 of real time on the move before the close; each move fills a blue segment of the effort bar, Sisyphean Heat's ascent colour; and the closing move lands in bullet time, slowed by its stars, as the top segment flares white.

**Phase 2 — the signature set pieces.** 12 M and 4 S items, about 28–64 days.
- *Ids:* R1, R2's M part (lit floor and FOLD gestures), R7, V3, V4, S1 with F10, S4, M1, M2, T1, T4, H1, H2's floor climber and counters, H3, U2.
- *New files:* parts/void/void.js (the lift and the bardo; it calls AR.tunnel(), the one tunnel builder, which stays in ar.js as V2, V3 and Scope creep have it), parts/well/well.js (S1), parts/rays/rays.js (T1, T4), parts/heat/heat.js (H1–H3), parts/hud/hud.js (U2). CACHE 'fold-v13'.
- *Dependencies:*
  - R1 needs R2's floor; H1 needs R1's setRatio path.
  - S4 needs S1 and void.js's lift; it uses the existing Γ orbit arcs until S2 lands.
  - M2 needs M1; T4 needs T1; V3 uses H2's climber where present.
  - void.js's lift (VOID.leave) is built here for S4 and V3; V1's earned-INV trigger follows in Phase 3.
  - U2 animates what exists: its caret and ruler rows wait on U4, its corridor and lift rows on V2 and V1.
  - R7 runs under V4's card, on R2's floor(kind).
- *The moment that sells it:* level 56. The stars bend round the eye, the first Γ throws the field up its arc to ∞ while the sky turns negative, I AM slams in, and everything is reborn from 1. Lose level 54, THE EYE's SYNC level today, and the effort bar falls and your white climber slides orange down the crowd's floor (H1, H2) before you fly the ten discs to REBIRTH 80. Close 56, the chapter's last level, and the won card replays the chapter's eight roads as chords and draws R0–R11 from your own arrivals (T4).

**Phase 3 — the big systems.** 18 M, 5 S and two M–L items (Q2, Q3), about 51–125 days.
- *Ids:* Q1 with F15's pruning, Q2, Q3, Q4, Q5, Q6; U1, U3's settings sheet and palette, U4, U5's line strip and trace, U6; R3, R4, R6; V1, V2; M3, M5, M6; S2, S5; T2, T3, T5.
- *New files:* parts/book/book.js and parts/well/disc.js. New material.js keys go through gen_material.py where the tablet is, plus check.js. CACHE 'fold-v14'.
- *Dependencies:*
  - Q1 comes before Q2's streak, Q5's unlocks, Q6's heights and every keepsake.
  - Q2's stride needs build_data.py's extended tape (Decisions 1).
  - Q3 needs M1, S1 and V3; Q4 uses Q3's rain state.
  - R4 needs R1; S2 needs S1; M5 needs H1; V2 reuses V3's tunnel().
  - T3 reveals through T2; without miners, shares show at level open.
  - U6's contours need R1's level table.
  - Every new billboard state (Q1's 6, Q3's 7 and 8, and any that Q4 or T2 add) follows F12, which lands in Phase 1.
  - Q1's stored seal and U6's seal card use the seal of the cells closed (Decisions 2, F8).
  - M6's keepsakes need Q1, and its trace by hand needs M3's faces.
  - F15 prunes old runs after Q1's backfill.
- *The moment that sells it:* a perfect chapter of THE MIRROR. The room is lit on all four walls, the last close comes in bullet time, and MATRIX · 85 rains down every column except yours. The next morning the start screen mines the new day's block on the twelve rays (T5), and THE MIRROR is still in THE BOOK, with the streak ladder one rung higher.

---

## Budgets and risks

**Per device.** The tiers come from index.html:166–167. The sky costs are from the shaders notes; the vertex counts are from the relief notes.

| tier | sky | relief floor (R2) | crowd (H1) | rain (M1) | lens (S1) | chart (T1) |
|---|---|---|---|---|---|---|
| desktop, unflagged phones | 23 samples, about 1500 ops a fragment | mesh (98304 indices) | 3584, render target 256² | 256 columns | sky, billboards and overlay | inset at 60 fps |
| `lowEnd` (Mali incl. RK3588, PowerVR, Adreno 3–5, ≤ 4 cores) | 13 samples | wire (66048 indices); room walls 33 × 33 | 1792 | 256 columns | as above | inset |
| `tiny` (VideoCore, V3D, Broadcom = Pi 4; llvmpipe; SwiftShader) | 0 samples, about 60 ops | points | 512 at 30 Hz, render target 128² | at most 41 instances, heads only; llvmpipe off | shadow and ring only | inset at 30 fps; TUBE skips the 3D frame |
| WebXR | hidden | points; cross-fade, never rotate | floor only | 2 static columns | billboard lens only | inset only (dom-overlay) |

- **Frame time.**
  - The only measurements are on SwiftShader, the `tiny` class: the 3D frame is 29.5–32.4 ms p50 while playing (14 draw calls) and 40.7–42.9 ms under the start screen; the chart is 0.73–2.36 ms.
  - Playing already uses 89–97 % of a 30 fps frame (33.3 ms) there, so on `tiny` each new per-frame cost needs a matching cut.
  - The crowd simulation is 0.63 ms at 3584 climbers, measured on a Xeon. Nothing has been measured on a Pi 4, an RK3588 or a phone.
  - Rule: every new effect gets a demo.html, a tier switch and, if it costs CPU every frame, a governor (H1's halves n above a 2.1 ms mean).
  - FX.grab stays unused: it costs 1–3 ms on a phone, about 2 ms on an RK3588 and a whole frame on a Pi (shaders notes:104–106).
  - index.html:166's `tiny` regex lumps VideoCore with llvmpipe and SwiftShader. M1's "llvmpipe off" needs a second test.
- **Vertices** (relief budget 40k, relief notes:21).
  - Today: at most 20871, the norm floor (16646) plus the product ceiling (4225). monApply (index.html:189–200) mounts the floor and one monument, so relief notes:21's 21898 (floor, circle, turn and ceiling) never stands at once. A door or ladder ring adds 512 instead, THE TURN 515.
  - R1 floor with its rings: 17672. R4 room: 39568, 432 under the 40k, so THE TURN (515), Saturn (1017) and the disc (about 2.6k) are off in chapter 6. The 3584 crowd tier is not in this count: its line vertices are offscreen, outside this budget (below), so keeping it off in chapter 6 is a frame-time call, not yet measured. U6 seal: at most 33416. Q5 doors: at most 20744 with the floor.
  - Add-ons: R6 1017, S2 about 2.6k, S5 396, V2 and V3 tunnels 512–640.
  - Outside the relief budget: billboards 1032, rain 7168, the crowd's 2n offscreen line vertices.
- **Draw calls and textures.**
  - Today 14 draw calls (measured on level 1). Three of them are the threads, ladder and orbit at opacity 0 (ar.js:234); hiding them (F10) gives 11, which pays for rain +1 and the tunnel +2. Added: rain +1, kaleidoscope +1 (card only), crowd plane +1 plus a 3-pass render target, tunnel +2, disc +4, the chart 0 (it is 2D canvas).
  - Textures: main atlas 18,874,368 B; code atlas 4,718,592 B (64 px slots for the Pi); rain atlas 327,680 B; tape texture 19,968 B (78 × 256 of the tape's 93810 digits, from windowBase(day) − 9435, refilled once a day; Q2); heat render target 256 kB (64 kB at 128²).
  - Download: data.js is 181,685 B with the fresh road's tape before the header's new words, up from 107,876 B (+73,809 B of digits; zlib level 9: 38,246 → 73,510 B). It is fetched once per CACHE bump (sw.js:2–4) and parsed once.
- **Photosensitivity (WCAG 2.3.1).**
  - Every large-area luminance change goes through U3's gate: at most 3 a second, onsets at least 334 ms apart.
  - The gate also counts saturated-red transitions, under 2.3.1's red-flash rule: R/(R + G + B) ≥ 0.8, on the linear R, G, B of the relative-luminance definition. Γ's CRT tint hsl(0 70 % 60 %) (index.html:242) is 0.82 and the descent orange #ff6a2a (V3) 0.86, so both count; the warp tint [1.0, 0.55, 0.5] (fx.js:304) is 0.68. Any new red source is tested the same way.
  - Today's sources stay under the limit: the busy gate allows at most 2.22 moves a second, and the Γ inversion comes about once a second.
  - New sources are spread out or capped: FOLD's crowd burst over 0.4 s; miner flares queued at 3 a second; slams are type-only; the I AM disc and the gold beat are one gated onset each.
  - Tunnel rings are a moving pattern, which 2.3.1 does not cover. Keep them thin, at opacity 0.5 or less, and off under CALM.
  - Before release, check screen captures with PEAT or Harding.
  - prefers-reduced-motion is honoured in JS and live (U3).
- **Readability.**
  - Rain rows are 17.9 px at 1080p and about 13 px on a portrait phone; the band is capped at +58°.
  - The chart inset carries marks only.
  - The atlas cuts words longer than 16 characters (ar.js:58), so full words go on cards.
  - Text tokens are checked at 4.5:1 or better; ray numbers appear beside every colour, and there is a CVD palette. Ray colours never carry text: the CVD rays 5–7 are 3.02–3.36 : 1 on --ground and rays 4 and 8 only 4.50 (data table), and RAY_RGB rays 0–3 are 2.28–2.84 (U1).
- **AR comfort.**
  - In XR or under gyro: never translate the rig, never rotate world-sized geometry, never run a full-field moving texture. Cross-fade instead (R2, R4, V1, S4, M1, H1).
  - Cards become half-sheets. The lift and the camera ease are desktop-only.
- **Scope creep.**
  - The six directions proposed six Twelve Rays ports (floor city, HUD chart, operator screen, accretion disc, seal tube, attract) and seven Sisyphean Heat ports. This scope keeps one module for each: parts/rays/rays.js and parts/heat/heat.js.
  - Likewise one flash gate, one lift (void.js), one tunnel builder (ar.js tunnel()), one floor that R1, R5, H1 and U6 all draw on, and one persistence layer (Q1).
  - At most two new aux buttons (RAYS, and VIEW cycling RAIN and CODE); a fourth row of #ops covers #quest. On WebXR Android, the 'AR · the room' button added at ENTER (index.html:339) would make that fourth row (LADDER RAYS VIEW, then AR), so AR moves to the start screen beside #xrnote (index.html:101). In THE MIRROR the 6↔9 button (index.html:175, shown at :218) is a seventh op: 7 + 6 × 2 = 19 columns, one more than three rows hold, so VIEW drops to a fourth row there even without AR, and one aux button must give way in that chapter. Everything else is a key or a long press, and also a button in U3's settings sheet: a key alone is out of reach on a phone, and a long press alone is out of reach from a keyboard (WCAG 2.1.1).
  - Every plan change lands behind a flag, with test.js covering both settings: Q2's stride, the new level kinds of R3, R5 and S5 (opts.extra; with every special fallen back it is the plan without the flag), rebirth (V3), word levels (Q4), hint caps, and S3's dilated HALT clock, which changes when tick() loses a level (game.js:85).

---

## Decisions (2026-10-18)

The owner answered the eight open questions on 2026-10-18. Each entry gives the answer in the owner's words, then what is built. The figures are for SCRIBE from day 9422 unless another name is given.

1. **Fresh roads (Q2).** "Each day a fresh road." Each day starts 257 digits of π on from the day before. levels.js windowBase(day) *new* = at(9435 + 257·(day − 9422)) replaces headOf in every builder. game.js, the daynote (index.html:162) and the ribbon (ar.js:210) read through it. Day 9422 keeps its windows, so this scope's day-9422 figures hold.
   - The tape: build_data.py computes π to 93,810 digits by Machin's formula in exact integers. It asserts that the first 20001 equal the machine page's tape, and the run takes 7.3 s. gen_material.py re-checks every digit by Störmer's formula. data.js grows from 107,876 B to 181,685 B.
   - The horizon: no start window is read twice in 1460 consecutive days. Day d + 1460 replays 63 of day d's 64 windows, and the README says so.
   - Saves and tests: the save key is 'fold.run.<day>.daily.s257', taken from spec.stride. test.js asserts the tape's length, that plan(9422) is unchanged, and that 1460 days have distinct start offsets.
   - Effect: day d + 4 shares 6.2 levels with day d, against 55.0 before, and 100 days hold 5363 distinct roads, against 449. The scope's other 100-day figures were computed on stride 1. This ships in Phase 2.
2. **The seal (F8).** "The cells you close." The seal is LV.seal(S.targets), the seal endDay already shows (index.html:281). It counts SHIFT levels' moved targets t0·3^moves (game.js:73, :77).
   - test.js:74 and :77 now seal play(sp).target, and a G.apply run of today's plan checks that S.targets and the card agree. That seal is 227 LAMB OF GOD for SCRIBE and 36 IMAM for TORAH, where the plan's own targets gave 130 and 101.
   - The seal now depends on the name (the ladder levels 36 and 40) and on the moves used on SHIFT levels. On a product day it is the plan's seal × g^(SHIFT moves), which holds on all 68 product days in 100.
   - This ships in Phase 1.
3. **HALT cells (B22).** "Build the halt, but we should account for that." This is built as M7.
   - The rule: on a HALT day (the day's opcode is 9) in daily mode, a move that lands on one of the 27 HALT cells, other than the target, ends the run. The level is lost, with 0 stars and no UNDO. The start is not a landing, so level 29, which starts on 55, plays from its start.
   - The solver: F.solve(…, avoid) and levels.js's AVOID behind opts.halts give par, HINT, V3's rebirth, S3's d and T3's work() the same detours.
   - The numbers: at stride 1, on the 7 HALT days in 100 (448 levels), 162 par roads cross a HALT cell. 80 of them keep par on another road and 82 rise (+1: 68, +2: 13, +3: 1). On the fresh road's 10 HALT days, 221 cross and 98 rise.
   - Every level stays winnable: every ordered pair of cells stays connected around the 27, and par stays at 7 or less.
   - The clocks: HALT's 30 s clock is unchanged, and a halt stops both that clock and R5's plate. S3's d grows on 8 of 38 levels (15 of 77 on the fresh road), to at most 6.
   - Tests: check(9443, 'TORAH'), and plan(d, name, {halts: false}) unchanged. This ships in Phase 1.
4. **Rebirth (V3).** "Lost syncs and halts can be closed again." The bardo card offers AGAIN, which replays from the level's own start with three stars open, and REBIRTH.
   - REBIRTH keeps the target, the rule and the slack. It starts from 80 with par from 80. It cannot be lost, because strictness, the clock and M7's stop are off, and it closes at ★.
   - A reborn close counts in closed, the line, S.targets, the seal and THE BOOK. Losable levels never SHIFT, so a rebirth changes only the stars (at most −2 a level).
   - test.js reborns today's 9 losable levels: 174 stars, with the seal unchanged. Over 100 days all 946 losable levels are offered REBIRTH, and the worst par from 80 is 6.
5. **HINT (Q4, F5).** "Hint should stay free once." The first HINT on a level is free. It shows the whole road from where the player stands, as chips, from LV.road(…, S.opsList, avoid).
   - Further presses are counted in S.spent[L − 1], which a reload, AGAIN and REBIRTH all keep. game.js:76 applies min(stars, capOf(S)).
   - The caps: on ordinary levels, ★★ from the second road. On word levels, 0–1 bits have no cap, 2–5 bits cap at ★★, 6–8 bits at ★, and the road (a ninth press) at ★. Showing the last road again is free.
   - A free road followed costs exactly par (5819 of 5819 non-SHIFT levels over 100 days), so it still earns ★★★. F5's free hint ships in Phase 1, Q4's word caps in Phase 3.
6. **Amber (T3).** "Welcome the side goal." AMBER is an optional second goal, ◆, never a star: a 3★ close in 8 moves or fewer whose road strikes a share cell.
   - It is open on every level except SHIFT levels, the eye and FREE WALK. S.stars never reads it, and test.js asserts that the stars are the same with work() on and off.
   - It is possible on 720 of the 1698 eligible levels in days 9422–9451. A paid hint rules it out.
7. **Skins (U1).** "Skins should follow chapter." The chapter picks the skin: RELIEF for chapters 1–3 and 8, MATRIX for 4–5, VOID for 6, SINGULARITY for 7. The skin changes at levels 25, 41, 49 and 57.
   - hud.js skinFor() *new* reads spec.chapter, so a special's fallback keeps its slot's skin.
   - U3 offers CHAPTER (the default) or FIXED. FIXED is an accessibility option, not a look: RELIEF's HUD and CRT all day.
   - The skin is never stored. parts/hud/check.js asserts the four switches.
8. **Specials (R3, R5, S5).** "A special level should be special; if not completed, then back to the window's original level."
   - plan(day, name, {extra: true}) *new* overlays THE TURN at 24, THE CLOCK at 47 (THE MIRROR's HALT showcase on R5's plate) and THE OTHER SIDE at 52. It does this after the par sort (levels.js:165–167), which is unchanged.
   - Each special keeps the level the sort put in its slot as spec.fallback. A special that is lost or skipped plays that fallback at the slot, through TAPE on its opening or lost card. The fallback is a plain tape level, with no fallback of its own.
   - game.js saves S.fell *new* ('fell'). fall() *new* refuses once the special is closed. No run-key version is needed.
   - test.js: with every special swapped back, the plan equals plan(d, n) on 100 of 100 days, so no window is dropped and no level moves. This ships in Phase 3.

### Still open

- Six losable levels in 100 days on the fresh road have target 80, so REBIRTH from 80 would start on the target and is hidden there. Those levels can only be closed again through AGAIN. Should they get another rebirth cell?
