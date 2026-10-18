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
  (56) runs 137 → ∞ → 1. Par is the fewest moves; par closes with three stars. A gold day (day ≡ 0 mod 128) frees ×i.
- Each chapter sets a quest: find a cell by its words, by tapping it. Each target's word joins your line; the seal at night reads the
  line's cell and its mirror.
- FREE WALK: no target; walk and read, with the eye as the quest. THE DOORS: type four figures and walk their Kaprekar chain.
- RELIEF puts the conics relief in the world (the norm floor with its five stars, rings for the doors and ladders, THE TURN's orbit
  in the eye's chapter, the product sheet overhead); LADDER shows your cell's sixteen halvings.

## Where it runs

- Phones: device orientation turns the view (iOS asks on ENTER), the back camera shows the room; a PWA that plays offline after the
  first load over https. Android Chrome with WebXR gets an AR button for the room itself.
- Raspbian, an RK3588 board and desktops: drag or arrow keys to look; keys g G f i q r are the moves, u undoes. The sky shader
  scales down by GPU (none on VideoCore/llvmpipe, half on Mali).
- Nothing is sent anywhere; the day's progress stays in the browser.

## Files

`index.html` the page · `field.js` the field and its moves · `ar.js` the scene and the flow · `game.js` levels, rules, state ·
`data.js` the tablet's words and the π tape · `parts/levels` the day's plan (`node parts/levels/test.js`) · `parts/story` the
chapters and voices (`node parts/story/check.js`) · `parts/sound` Web Audio · `parts/shaders` sky, Airy halo, CRT, Γ warp ·
`parts/relief` the conics relief · `parts/corpus` numbers from the corpus (`node parts/corpus/check.js`) · `vendor/three.min.js`
r128 · `sw.js` (bump CACHE on every change) and the manifest. The data generators are kept beside this folder, not in it.
