# THE FOLD — the levels: design notes

`levels.js` defines `window.FOLD_LEVELS`, pure functions over `FIELD` and `CASCADE_DATA`. `plan(day, name)` gives the same 64
levels for the same day and name on every device; nothing is kept in the module. `test.js` (`node test.js`) plans today and day 9384
for TORAH, plays every level by the field's own solver and checks it closes in par: 2555 checks, 0 failed.

## The day: eight chapters of eight

A chapter is eight levels. Most read the π tape as the engine always has — the four figures at `head + 4(L − 1)` mod 257 are the
start, the next four the target, the digit under the head the rule — and eight are the story's own, fixed by their place (`SPECIAL`):
THE DOORS (chapter 4) ends on its three doors, THE LADDER (5) climbs twice, THE MIRROR (6) reflects twice and THE EYE (7) ends on the
pole, while SUNRISE, THE FOLD, THE QUARTER TURN and THE SEAL (1–3, 8) are tape throughout:

| level | kind | start → target | why |
|---|---|---|---|
| 30, 31, 32 | `door` | 64 → 6 · 128 → 6 · 51 → 6 | the three Kaprekar doors, 4176, 8352, 8532, each one step from 6174 ≡ 6 = 2g; the step is written in the text (7641 − 1467 = 6174 …). THE DOORS ends on ZERO, the fold point and NONCE in that order, the doors as the corpus names them. Pars 5, 3, 5 under NOP. |
| 36, 40 | `ladder` | home → home × 129 · home → home × 129² | the player's own cell on its halving ladder: ×129 is ÷2, dlog − 48 a rung, every ladder closes in sixteen. Level 36 climbs one rung, level 40 two in one road (TORAH: 62 → 31 JACOB, par 6; 62 → 144 MASS, par 3). A rung at par 0 is passed over for the next. A name adding to 0 SEED (which halves to itself) climbs from its letter count instead. |
| 44, 48 | `mirror` | tape start → 27k − s of its word | the Atbash mirror of the start cell's first word, the reflected tablet's rule. A word whose mirror stands on the tablet (`D.mirrors`) is taken first, so the text can name it (BALDUR ↔ TOTIUS, BITCOIN ↔ YRGXLRM); a word that mirrors to its own cell, or whose mirror sits at par 0, is skipped for the next of the cell; if none serves the start slides a digit. |
| 56 | `eye` | 137 → 1, Γ free | the pole to I AM: Γ(137) = ∞, Γ(∞) = 1. Both reflections are free of cost, so the paid par would be 0; the spec sets `par: 2` and `countFree: true` — on this level the road is the par and every move counts. The engine as it stands counts paid moves only, so a player who takes the two reflections has 0 ≤ 2 and three stars, and one who wanders may spend two paid moves and still close on par. |

Everything else is `tape`, exactly as today's `game.js` reads it, with two guards: the target slides one digit along the tape (as the
engine slides) while it equals the start **or while par would be 0** — the second matters under JUMP, whose free Γ reaches 128 cells
at no cost, and under IDENT, EXIST and FOLD, whose free op reaches the inverse, the quarter turns and the fold partner. Over 100 days
270 of 6400 levels slid.

The door, ladder and mirror levels carry rule 0 NOP by default (`opts.special = 'tape'` reads the digit under their own window,
SEED read as NOP where the kind fixes the start); the eye is always 7 JUMP. Every spec also carries `offset`, so the tape ribbon
still lights the level's own window.

## The curve

Within a chapter the tape levels keep the windows of their own slots — `head + 4(L − 1)` for each L the chapter's specials leave
free — and are re-ordered so that par never falls: sorted by par, then by the rule's burden (free ops and STORE lightest, NOP and
SEED next, SHIFT, then SYNC and HALT), then by tape order. The spec's `window` field says which level's window a tape level read.
A special level's own window goes unread (`opts.special = 'tape'` reads only the digit under its head). Par is computed with the
level's free set by `FIELD.solve`/`cost`; SHIFT by a layered BFS copied from `game.js` (`solveShift`, started at k = 1 since a level
is not closed before a move). No level has par 0; the line's diameter is 7 and the test asserts par ≤ 7 off SHIFT.

Day 9384 (TORAH), chapter by chapter in level order: `1 2 3 3 4 4 4 5` · `1 2 4 4 4 4 4 5` · `1 1 3 3 3 4 4 5` · `2 4 4 5 5 5 3 5` ·
`1 2 3 6 3 5 5 3` · `2 3 4 4 4 4 6 2` · `1 2 4 5 5 5 6 2` · `1 1 3 4 4 5 5 6`. Over days 9384–9483 the pars run 1: 788 · 2: 702 ·
3: 1432 · 4: 1864 · 5: 1174 · 6: 411 · 7: 29; tape levels average 3.5, the doors 4.3, the ladders 4.5, the mirrors 3.6.

Each spec carries a `road` as well as `par`: the least-cost road with the fewest moves, free moves included (a small Dijkstra, a paid
move 1001, a free one 1), so a free Γ does not send the hint sixty reflections round its orbit when two paid moves would do. The
longest road in 100 days is 25 moves (24 free Γ and one ×i, par 1); `FIELD.solve`'s 0-1 BFS, which the engine uses for hints, finds
the same cost.

## The quests

One a chapter, at its first level, a cell to find by its words; the tap on the cell answers it. They draw on `cells[n].ws` and
`D.mirrors`, and foreshadow the chapter's own level:

- chapters 1–3: a word of the door's cell, 64, 128, 51 — "Find the cell that holds ZERO: the door 4176 opens on it";
- chapter 4: a word of 6 — "Find the cell that holds ABBA: the room behind the three doors, 6174 ≡ 6";
- chapter 5: a word of the ladder's rung — "…your cell 62 FIBONACCI halved once";
- chapters 6 and 8: a mirror pair of the tablet — "ERIDANUS has 8 letters and sum 91: find the cell of its Atbash mirror, 27k − s";
  the player computes the cell; the pairs are the 1813 of `D.mirrors` where both words are askable, of one length and on the tablet;
- chapter 7: a word of 137 — "Find the eye: the cell that holds PYRAMIDIBUS, where Γ opens to ∞".

The word is chosen by the day (`day + 7·chapter`), past the cell's first word where the cell has another worth asking for (the first
word stands on the cell's billboard already), and filtered to askable words: letters and spaces, a vowel, no run of four consonants,
no three-consonant start — the tablet's Atbash strings (RNKVIZGLI, GLGS, VMRUN) fail this. Each ask ends with a clue, the cell's ray
and character, which narrows the sphere to a band of about eleven cells.

## The seal, THE DOORS, FREE WALK

`seal(targets)`: the product of the closed targets' cells mod 257, or their sum if any target was 0 (`by` says which), its first
word, and the Atbash mirror of that word, 27k − s, with its word. Day 9384 with every level closed seals on 220 CENTRAL LIMIT THEOREM,
mirror 36 IMAM; today, day 9421, on 54 LOVE, its own mirror.

`doors(digits)`: the Kaprekar chain of a four-figure number to 6174 as levels, each step's residue the start and the next's the
target, rule NOP. Consecutive steps on one residue are merged into one level (the text lists the steps). Repdigits fall to 0 and
return `[]`, which the page reads as "no door". 6174 itself plays its own step, 7641 → 6174 (188 → 6). 2026 takes six doors:
227 → 83 → 215 → 199 → 115 → 51 → 6; 9384 takes 132 → 186 → 3 → 128 → 6, through g and the fold as the keys have it.

`free(name)`: one spec from the home cell, no target, par null.

## Tunable

- `SPECIAL` — which levels are the chapter's own, and of what kind; `DOORS` — the three doors and their order; `CONSTANT`.
- The ladders' rungs (one and two) and the SEED-name fallback (letter count, then 1).
- `opts.special = 'tape'` — the day's rule on the door, ladder and mirror levels.
- `RULES[d].burden` — the tie-break of the curve; the sort key itself (par first) in `plan`.
- The slide: one digit at a time (as the engine), past any target at par 0.
- `road`'s weights (1001 : 1) — what "fewest moves" means among least-cost roads.
- The eye's `countFree` — or drop Γ from its free set, which leaves par 2 either way (no single move carries 137 to 1).
- `nice` — what counts as an askable word; `deeper`'s preference for words past the first; the quest seeds.
- The mirror level's preference for paired words; `mirrorPairs`' filter.
- `doors`' merge of equal residues and its reading of 6174.
