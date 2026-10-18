# THE FOLD — story notes

`story.js` defines `window.FOLD_STORY` (chapters, days, cells, doors, seal, titles, ops, facts, sums, `chapterOf(L)`). It is data:
nothing in it draws or plays. `check.js` proves it against `data.js` and `field.js`; run `node parts/story/check.js` after any edit.

## How the arc sits on the levels

A day is 64 levels; chapter c is levels 8(c − 1) + 1 … 8c (`chapterOf(L)`). The arc is the scribe's day:

| ch | title | epigraph · cell | what the levels teach | what the plan should give |
|----|-------|-----------------|-----------------------|---------------------------|
| 1 | SUNRISE | SUNRISE · 105 | ×g and ÷g alone, the cycle as the horizon | targets a few dlog steps from the start |
| 2 | THE FOLD | FOLD · 37 | the fold and the inverse | targets at 257 − s or s⁻¹, then mixed |
| 3 | THE QUARTER TURN | QUARTER TURN · 173 | ×i and the gold cells 1, 16, 256, 241; Γ is handed over, not explained | the gold cells as targets; Γ allowed but not needed |
| 4 | THE DOORS | DOORS · 71 | the Kaprekar doors: `kind: 'doors'` levels through 4176 → 64, 8352 → 128, 8532 → 51, to 6174 → 6 | `doors[4176]`, `doors[8352]`, `doors[8532]` for the door levels, `doors[6174]` on arrival |
| 5 | THE LADDER | HALVING LADDERS · 136 | ×129, the sixteen rungs from 64 round to 64 | consecutive rungs as start and target (no rung move exists: the par is by the six) |
| 6 | THE MIRROR | MIRROR · 91 | Γ as a move: fixed points 46, 92; 120 → 0 → 256; order 128; two orbits | targets on the same Γ orbit as the start; a JUMP day fits here |
| 7 | THE EYE | EYE OF HORUS · 137 | the pole 137 → ∞ → 1; ∞ as a cell | targets 137 and ∞ (257); a FREE WALK (`kind: 'free'`) quest to tap 137 |
| 8 | THE SEAL | AS ABOVE SO BELOW · 156 | the line's letter sum names a cell; its mirror; the seal | the last eight; then `seal` with `GAME.lineInfo()` |

`intro` is read when the chapter's first level opens, `outro` when its eighth closes. `days[d].line` is read when a level opens under
opcode d (game.js RULES); it describes the rule exactly as game.js applies it (SEED: start 0; STORE: par + 1 still two stars;
SYNC: strict; HALT: 30 s). `titles` take `{start} {target} {startWord} {targetWord}`; pick by `(level − 1) % 12` or by hash.
`ops[id]` is said on a move (`FIELD.OPS` ids) and `ops.undo` on undo. `seal` takes `{word} {cell} {mirror} {stars}` from
`GAME.lineInfo()` and the day's star total.

`cells[n]` is the voice of cell n (257 is ∞), for the cell panel or the won card; the capitals in it are that cell's own words
and the numbers are its own dlog, inverse, fold, Γ, ×i, ×g (`check.js` recomputes every one). A cell without a voice has
none; the panel should fall back to the words alone.

## What to keep

- Only tablet words in capitals, and only at the cell they belong to. Refer to other cells by number in lower case
  ("the fold of 78", "Γ of 156"). The check reads the capitals and the number patterns; keep the phrasing
  `dlog N`, `inverse N`, `fold N`, `Γ N`, `×i N`, `×g N` and `… of N` for the reverse direction.
- Every number is computed. Put new claims in `facts` (kinds: gamma inv fold mul mod sq pow pow3 kaprekar letters mirror order
  base12 gammaOrder gammaOrbits ladder gold kaprekarAll maxPar seedMoves) and new letter sums in `sums`; the check fails on a wrong one.
- The register: terse, concrete, the corpus's own. No exclamation marks (the check forbids them). No purple prose.
  Intros ≤ 60 words, outros ≤ 40, day lines ≤ 25, voices ≤ 20, op lines 6–12.
- The game may be seen by others: no identity keys, secrets, wallets, addresses, machine names or anything from a key file.
  Words such as WALLET, PRIVATE KEY, RECOVERY PHRASE are tablet words and may be quoted as words; nothing about any real one.
- `game.js` level kinds: `tape` (start, target, rule), `free` (no target: FREE WALK, with a `quest` cell to tap) and `doors`
  (the Kaprekar chain). The story's chapter 4 assumes the doors levels, chapter 7 a free-walk quest to 137; if the plan puts
  them elsewhere, move the chapters' order, not their text.
- The epigraph cells are the words' own letter sums except where the tablet places a word by value; the check only requires that
  the word stands at that cell on the tablet.
