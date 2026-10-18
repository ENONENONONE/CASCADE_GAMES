# THE FOLD

The field GF(257) stood round the player as an augmented-reality game. Built 2026-10-17 from the cascade machine and its corpus:
the generator g = 3, the fold, the inverse, the quarter turn ×i = 16, the reflection Γ = (Z − 120)/(Z + 120) over the projective
line of 258 points, the emerald tablet's words (2301 entries), the π program tape with its ten opcodes, the 210-gon, the twelve rays,
the Atbash mirror and the Heisenberg joining of words. One page, no build step, no server of its own.

## Play

- Enter a name; its letters add to your cell (LOVE 54, SCRIBE 56, HORUS 81). An empty name plays as SCRIBE.
- You do not move; the field does. A move is a permutation of the 258 points, and the whole sky flows along its arcs to land where it
  stood, your cell arriving from where it came. Six moves: ×g, ÷g, FOLD, INV, ×i, Γ; in chapter 6 a seventh, the 6↔9 flip.
- DAILY: 64 levels in eight chapters (SUNRISE, THE FOLD, THE QUARTER TURN, THE DOORS, THE LADDER, THE MIRROR, THE EYE, THE SEAL).
  Tape levels read the π tape at their own window, day + 13 + 4(L − 1): the four figures there are the start, the next four the target,
  the digit under the head the level's rule (NOP · IDENT INV free · EXIST ×i free · SEED start at 0 · SHIFT the target steps ×g each
  move · STORE par + 1 still closes · FOLD free · JUMP Γ free · SYNC one over loses · HALT thirty seconds). The doors (30–32) walk
  4176, 8352, 8532 to 6174; the ladders (36, 40) climb your cell's halvings; the mirrors (44, 48) go to a word's Atbash cell; the eye
  (56) runs 137 → ∞ → 1: the first Γ turns the sky to its negative and lifts the view toward ∞, the second slams I AM and the field
  is reborn from 1. Par is the fewest moves; par closes with three stars. A gold day (day ≡ 0 mod 128) frees ×i.
- The eye, 137, is a black hole: in chapter 7, on JUMP levels and within two moves of it, its pupil is a shadow in a gold ring and it
  lenses the sky, the rain and the cells round it, the ring's radius (92/11)°/√(d + 1) reading the d moves from your cell to the eye.
- HINT shows the road from where you stand as chips: the first HINT of a level is free, each one after caps the level at ★★. A tapped
  cell's panel gives the road to it, but to the target only after a HINT.
- A loss (SYNC one over par, HALT at zero) is THE BARDO: the field dims, the lost road falls in orange, the view lifts out of the body
  and flies the ten discs (dlog 246 … 255) to 1 I AM; the card offers AGAIN (the level from its own start) or REBIRTH (the same target
  and rule from 80 REBIRTH, par from 80, cannot be lost, closes at ★; the life before stays as a dim ghost road). CALM, the room and
  the TUBE go straight to the card.
- The Twelve Rays: RAYS (or m) shows the field drawn flat as an inset, spoke dlog mod 12, ring dlog div 12, SEED at the centre, ∞ on
  the rim. A tap on it (or t) opens the TUBE, the day played in 2D: hold for a lens, let go on a cell to read it, the arrows walk the
  rays, TABLE turns it to the 16 × 16 dlog table. A chapter's last card replays its eight roads as chords over the R0–R11 bars (the
  arrivals by ray and their best work bits); the seal draws the day's bars.
- Each chapter sets a quest: find a cell by its words, by tapping it. Each target's word joins your line; the seal at night reads the
  line's cell and its mirror.
- FREE WALK: no target; walk and read, with the eye as the quest. THE DOORS: type four figures and walk their Kaprekar chain.
- RELIEF puts the conics relief in the world (a sheet a chapter as the floor: the product, the hyperbola, the circle, the ellipse,
  the parabola, then the norm with its five stars, and the circle under every HALT level; rings for the doors and ladders, THE
  TURN's orbit in the eye's chapter, the product sheet overhead); LADDER shows your cell's sixteen halvings.
- The sky is the π tape as rain: 256 columns of 78 digits, one above each dlog tick, drops of light running down them in the rule's
  pattern (FOLD's c and c + 128 together, SEED rising, SYNC one band, HALT frozen); your column runs fast, the target's is gold, the
  six moves' columns take their hues, and each chapter wakes 32 more columns. The code is written in the field's alphabet: twice down
  each column, its cell's glyph pair and its dlog in eight gold bits, among the digits; the day's 260 stay π. A tape level reads out
  of the rain as it opens, its start and target digits flying to their cells, and a close turns its start digits into the cell's
  glyphs; the seal counts the windows decoded. Tap the ribbon to read the level's line; VIEW (or v) hides the rain.
- GLOW: the field through one post pass — bloom in each source's own colour (cells in their rays, the rain in phosphor green, the ring
  and the quarter turns in gold), golden god rays from the eye's ring and the floor's twelve spokes in their colours, slow glitter on
  the brightest points, a 1–2 px colour split at the edges and a grade that deepens the blacks and lifts the saturation a fifth, the
  palette kept. Full on desktops and phones, bloom alone on a low-end GPU, off on a Pi and in the room; GLOW (or b) toggles it, kept
  in fold.prefs. Under reduced motion the shafts and the glitter are stills.

## Where it runs

- Phones: device orientation turns the view (iOS asks on ENTER), the back camera shows the room; a PWA that plays offline after the
  first load over https. Android Chrome with WebXR gets an AR button for the room itself.
- Raspbian, an RK3588 board and desktops: drag or arrow keys to look; keys g G f i q r are the moves, u undoes, v the rain, m the rays
  inset, t the TUBE, b the glow. The sky
  shader scales down by GPU (none on VideoCore/llvmpipe, half on Mali); the rain keeps only its state columns, heads only, on a Pi
  or SwiftShader, and is off on llvmpipe; the glow is bloom alone on Mali and off on a Pi.
- Nothing is sent anywhere; the day's progress stays in the browser.

## Files

`index.html` the page · `field.js` the field and its moves · `ar.js` the scene and the flow · `game.js` levels, rules, state ·
`data.js` the tablet's words and the π tape · `parts/levels` the day's plan (`node parts/levels/test.js`) · `parts/story` the
chapters and voices (`node parts/story/check.js`) · `parts/sound` Web Audio · `parts/shaders` sky, Airy halo, CRT, Γ warp, the tape's rain ·
`parts/relief` the conics relief · `parts/well` the eye's lens (`node parts/well/check.js`) · `parts/void` THE BARDO
(`demo.html`) · `parts/rays` the Twelve Rays, the TUBE and the ledger (`node parts/rays/check.js`) · `parts/glow` bloom, god rays, glitter and the grade (`node parts/glow/check.js`, `demo.html`) · `parts/corpus` numbers from the corpus (`node parts/corpus/check.js`) · `vendor/three.min.js`
r128 · `sw.js` (bump CACHE on every change) and the manifest. The data generators are kept beside this folder, not in it.
