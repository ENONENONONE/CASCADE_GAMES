# THE FOLD — material mined from the cascade corpus (2026-10-17)

A catalogue for the level designer, the story, the sound and the shaders of THE FOLD. Every number below was recomputed on
2026-10-17 by `gen_material.py` beside this file where it is arithmetic (letter sums A = 1 … Z = 26, dlogs base 3, folds 257 − n,
Γ = (Z − 120)/(Z + 120), Kaprekar steps, the day table) and is given with its source where it is a count or a measurement.
`material.js` carries the numbers the game can use directly; `check.js` parses it and re-adds every letter sum.

Sources are written as `corpus/` (the corpus directory), `machine/` (`cascade_machine/`) and `artifacts/`
(`Documents/artifacts/`); `LEDGER n` is an entry of `corpus/mi25_readout.md`, `review` is `corpus/cascade_corpus_review.html`,
`voynich.87/88` the sub-ledger `corpus/mi25_readout_voynich.md`. Nothing here is drawn from a key file; names, addresses, hosts
and ports of the fleet are left out, and the two name-words of the tablet's cells 44 and 62 are not used (those cells are named by
their other words: 44 SPACE · FAITH · HOPE · CLOCK, 62 FIBONACCI · TORAH · BORDER).

Game hooks these items map to (from `index.html`, `game.js`): a level spec `{kind, start, target, rule, free, slack, strict,
clock, shift, par, title, text, quest:{cell, ask}}` returned by `FOLD_LEVELS.plan(day, name)`; chapters of eight levels
(`STORY.chapters`); `STORY.cells[n]` the scribe's line for a cell; `STORY.days[digit]`; `LV.doors(digits)`; `LV.seal(targets)`;
`SND.cell / op / bloom / win / lose / setRule / setHome / clock`; `FX.sky()` and `FX.cssFilter(op)`.

---

## (a) Visual motifs

**A1 · The six conics mod 257.** Six sheets over (x, y) ∈ 0…256: the product x·y, the hyperbola x² − y², the circle x² + y²,
the ellipse x² + 4y², the parabola y² − 4x and the norm x² + xy − y²; discriminants 1, 4, −4, −16, 0 and 5 (the one
non-residue). As a cube of side 257 the faces pair by discriminant: product with hyperbola, circle with ellipse, parabola with
norm. — `machine/conics_relief.html`; `machine/conics_pictures/*.png`; LEDGER 106.
→ *Level kind "sheet"*: the floor's 210-gon lifts into one conic per chapter (height = value, hue = dlog); the start and target
stand on it as two heights and the moves slide along the sheet's level lines.

**A2 · The circle as a zone plate, the parabola's rings.** x² + y² ≡ c is a zone plate with λf = 257 cell²; the parabola's
middle row y = 128 is a centre, y = 128 ± d giving y² ≡ 193 + d(d − 1), rings at d = 10.7, 19.5, 25.4, 30.1, 34.1, 37.8, 41.1,
44.1, 47.0, 49.7 from the middle; the term −4x repeats every 64.25 columns, 65 copies of one arc. — LEDGER 106.
→ *The HALT clock*: the thirty seconds drawn as the circle's rings contracting to the centre, ring k vanishing at second 3k.

**A3 · The null lines.** Along (p, q) the second difference is 2Q(p, q); where Q(p, q) ≡ 0 the value runs as a straight ramp
wrapping as a sawtooth: ellipse (1, 8) and (32, 1) at 82.87° and 1.79°; circle (1, 16) and (16, 1) at 86.42° and 3.58° (16 = i);
hyperbola (1, 1) and (−1, 1); the product's rows and columns; the parabola's rows; the norm none (p/q would be φ). — LEDGER 106.
→ *A "ramp" rule*: on the circle sheet the two null directions are free roads; a level whose start and target share a null
line is closed by the sawtooth alone.

**A4 · The time step as a plane wave.** Multiplying every cell by g turns every spin by 360/256 = 1.406°, period 256; the
product on dlog axes is e^{iθ}, θ = 2π(u + v)/256, wavelength 256 cells along an axis and 181.02 on the diagonal. — LEDGER 106.
→ *The day's clock*: a day of play is 256 ticks of 1.406°; the bloom's wave is this plane wave crossing the sky once.

**A5 · The green balls.** With dlog as hue the window 64 to 106 (43 levels) reads green; the circle's rings 135, 137, 141, 143
have dlogs 58, 72, 62, 46 and from t ≈ 20 to 60 make a disc of 36 cells about the centre, the largest green patch, for 46 of the
256 steps. — LEDGER 106.
→ *A timed monument*: a green sphere that stands in the sky only for ticks 20–60 of the day; a quest cell inside it.

**A6 · The cube of six faces.** 6 × 257² = 396294 surface cells; 257³ = 16974593 = |GF(257³)|; the plane GF(257²) is one face
(257 × 257), floor 4 a face of 66049 × 66049; relief outward or inward, the eye at the centre. — LEDGER 106; `conics_relief.html`.
→ *THE ROOM*: the AR arena as the inside of the cube with the player at its centre, each wall a conic; FOLD swaps opposite walls.

**A7 · The five stars of the norm.** The picture of a² + ab − b² at column a, row b: first differences 2a + b and a − 2b
(the matrix [[2, 1], [1, −2]], square 5) vanish at the fifths: (0, 0), (103, 51), (206, 103), (51, 154), (154, 206), norms 0,
154, 103, 103, 154; 103 = 1/5. Four stars at 18.43° + k·90° from the middle, each a saddle with arms along a = φb and a = ψb at
31.72° + k·90°. — `artifacts/pictures_as_printed_2026-09-29/norm_stars.txt`; voynich.88 (LEDGER 94).
→ *Five fixed constellations*: the four stars and the origin drawn in the sky at those bearings; the chapter "THE FIFTH STAR"
asks for the point of norm 103 nearest the player's cell.

**A8 · The logarithm table as a 16 × 16 picture.** Cell p = c + 16r; the dlog as a grey level: 254 levels once, 0 twice (cells
0 and 1), 128 not at all; ×16 turns the picture a quarter turn (16p at row c − 1, column 16 − r for the 225 inside), twice is
the fold; one file of 852 bytes gives the powers, inverses, folds, characters, roots and all 65536 products. — LEDGER 80.
→ *The minimap*: a 16 × 16 tile in the HUD; ×i rotates it a quarter turn, FOLD a half, so the player sees the move as a picture.

**A9 · The inverses as a picture.** All 256 levels once; only cell 1 holds itself; no two neighbours hold consecutive values,
the discriminants 5, −3, 192 and 63 being non-residues; edges 0 to 95 as printed (Sobel ÷8), average 23.0. — LEDGER 80, 93.
→ *INV's screen effect*: the minimap's palette inverts (dark ↔ light) on INV, the one cell that does not move being 1.

**A10 · The products a·b as one picture.** 256 × 256 of a·b mod 257: corners 1 and 256, the four middle cells 193, 64, 64, 193
(128 × 128 ≡ 193); a quarter turn (a, b) → (b, 257 − a) negates every product; the 1024 "easy" cells are the products 1, 16,
241, 256 (n⁴ = 1), the 1024 "hard" ones 4, 64, 193, 253 (n⁴ = −1); as a spin sheet the sum (Σωᵏ)² = 0 exactly. — LEDGER 105 (MAGNET PICTURE).
→ *The seal's picture*: the day's targets multiplied pairwise drawn as this sheet; easy cells gold, hard cells red.

**A11 · The fold-walk sphere.** 66048 cells, cell k at height z = 1 − 2k/66048 and angle 2πφk (the golden angle 137.508°);
the tablet's 256 cells every 258th, gold (φ's orbit) every 128th, the four quarter points 0, 16512, 33024, 49536 holding 1, 16,
−1, 241; g at cell 34830, φ at 65920; inverse pairs face each other across the equator, negation is half a turn. — LEDGER 18–19;
`corpus/mi25_readout.md` lines 1581–1600; `artifacts/fold-walk-sphere.html`.
→ *The far sky*: a second, denser sphere beyond ∞ seen when the player looks up; the day's walk cell burns on it.

**A12 · The spiral's arms.** Drawn in the plane the 66048 cells' nearest-neighbour index gaps are 377 (25269 points) and 610
(25183), then 233, 144, 89, 55; on the sphere 233 and 377. Along a 377-arm the ray steps −1 a cell (period 12, no slips),
along a 144-arm −4 (every third cell ray 0), 610-arm +2, 233-arm +3. — `corpus/mi25_readout.md` 1581–1599.
→ *Lanes on the π ribbon*: colour the ribbon's cells by the 377-arm rule so the twelve rays cycle every 12 cells.

**A13 · The gold orbit.** φ's 516-cycle inside the walk: (2 + φ)¹²⁸ = 256 + φ = 1/φ, which sends a + bφ to (b − a) + aφ, the
Fibonacci recurrence backwards; every gold cell has norm +1 (ray 0) or −1 (ray 8) alternately, never a light ray. — `corpus/mi25_readout.md` 1593–1599; LEDGER 47.
→ *Collectible gold*: the four gold cells of the line (1, 16, 256, 241) burn; on gold days (see D2) the bloom is gold and
landing on a gold cell doubles the level's stars.

**A14 · The Airy disc and the CRT.** The beam is [2J₁(ρ)/ρ]² (dark rings at 3.8317, 7.0156, 10.1735, 13.3237; bright rings
1.750 %, 0.416 %, 0.160 % of the centre); a tilt t shows an ellipse of ratio cos t (AIRY R 0.672 = 47.78°); barrel r/(1 + 0.12r²),
vignette 1 − 0.4r², the aberration δ% = 2.34 % as the distortion, phosphor F(T) = cos(πT)e^{−0.5T}. — `machine/cascade_machine_v4.html`
(AIRY; the `_j1r` Horner series); LEDGER 70.
→ *Cell halos*: draw each cell's halo as an Airy disc in the shader, the player's own cell tilted 47.78°; the CRT overlay's
barrel and vignette from these constants.

**A15 · The twelve rays as light.** The machine's OPTICAL bar names twelve ray tracks 377 nm to 610 nm after the zodiac
(T01–T12); 377 nm is ultraviolet, the other eleven visible; the bathing pages' blue 480.31 nm is nearest ray 5 (482 nm). — LEDGER 74, 75, 102.
→ *HUD*: label each ray band by its sign and wavelength; a ray-5 level is lit blue-white.

**A16 · The nine-rosette foldout.** Five long dotted tubes with ringed mouths in a quincunx, rings about 1 : 0.68 : 0.30, leave
rosette 1 (an empty oval, ratio 0.60) and point at rosette 5, over six vessels. The nine against the circular pages: 2 f67r2,
3 f67v2, 4 f67r1/f68v1, 5 f68r1-r2/f67v1, 6 f68v2/f70r2, 7 f68r1–r3, 8 f69r/f69v, 9 the Sun and Moon of f68r. — LEDGER 70.
→ *Chapter "THE TUBES"*: nine monuments three by three; five tubes are portals from the empty oval to the fifth, each a level.

**A17 · f67v2, the cross and the tubes.** The cross at 1.67° and 89.70°; four tubes at 41.39°, 125.92°, 217.10°, 297.75°,
beside the norm-star arms 31.72° + k·90° (+9.67°, +4.21°, +5.39°, −3.97°); the four spoke words 132, 137, 137, 137, the four
tube words 142, 195, 147, 156. — LEDGER 97; `artifacts/voynich_2026-09-19/wheels_check/`.
→ *A wheel monument*: spokes to cells 132 and 137, tubes to 142, 195, 147, 156; a quest to visit all six.

**A18 · f69r, the compass of pairs.** Four green tubes at 43.56°, 137.17°, 245.23°, 320.77° and eight blue in four pairs whose
middles are 359.69°, 87.53°, 185.97°, 282.57°, each pair opening 13.13°–16.44°; a six-rayed star in the middle. — LEDGER 97.
→ *The AR compass rose*: draw the four pairs at the cardinal middles and the four green between as the horizon's marks.

**A19 · f69v, the 28 radial words.** Three lines round the rim and 28 radial words from 09:30 to 08:45; sums 2087 ≡ 31,
product ≡ 202; 28 = the solar cycle, 532/28 = 19; 28 mod 12 = 4. — LEDGER 72–73.
→ *A 28-spoke level*: the target steps one spoke a move (SHIFT's cousin, ×g per move but around a wheel of 28).

**A20 · The zodiac pages.** Binding order Pisces f70v2 → Aries (dark, light) → Taurus (light, dark) → Gemini → Cancer → Leo →
Virgo → Libra → Scorpio f73r → Sagittarius f73v; folio 74 (Capricorn, Aquarius) lost; 299 labels ≡ 42, thirty a sign, Aries and
Taurus split 15 + 15, Gemini 29 named and an unnamed thirtieth; 294 figures hold a star, five none (Gemini 13, Cancer 10 and 18,
Virgo 22, Sagittarius 18); star points 5:2 6:25 7:114 8:101 9:24 10:5 11:1. — LEDGER 64, 70, 74; `artifacts/voynich_2026-09-19/charts/README.txt`.
→ *Twelve chapters by sign, thirty levels each*; the five starless figures are levels with the target hidden until sighted.

**A21 · Longer words where the days are longer.** Over the ten signs the labels' mean length against the day's length at Prague
r = +0.645 (rank +0.67); mean letter value against the day r = −0.858; the line 2.86 + 0.294 × hours; the lost Capricorn would
have 5.21 letters a label, Aquarius 5.58. — LEDGER 70.
→ *Par by season*: a sign-chapter's slack grows with its day length (summer signs lenient, winter strict).

**A22 · The flower heads, 46 and 303.** 46 painted heads with 303 = 257 + 46 outline points (f16v alone 15 + 14 + 13 + 17 + 8 + 6
= 73); point families 5/10 fourteen, 4/8 eight, 7/14 five, 6/12 four; axis ratio median 0.672 = a disc tilted 47.78°; nearest
face-on f9v's blue head 0.957; 303 = 46 + 1φ, norm 105, walk cell 10075. — LEDGER 65; `artifacts/voynich_2026-09-19/flowers/check/`.
→ *The bloom's petals*: petal count = the target's point family (5, 8, 10, 14…); the bloom tilted 47.78° like the heads.

**A23 · The margin stars.** 322 stars on f103r–f116r beside 285 starred paragraphs (≡ 28); points 7:182 8:123 6:5 9:6, total
2342 ≡ 29; 306 light, 16 dark, 148 dotted (the red centre), 267 tailed; f116r's ten from the last star up are cells 7, 116, 119,
252, 85, 142, 27, 225, 10, 186 (sum ≡ 141); all 322 letters 618413 ≡ 71 over 181 cells. — LEDGER 65; `artifacts/voynich_2026-09-19/stars/entries.txt`.
→ *A 322-level campaign*: level n's target is entry n's cell, its star kind the rule: dotted = SEED, tailed = SHIFT, dark = SYNC.

**A24 · f103r's nineteen stars.** Nineteen stars, seven red at 1, 4, 6, 9, 12, 14, 17 from the foot, the Metonic cycle's long
years 3, 6, 8, 11, 14, 17, 19; one placement of 50388. — LEDGER 74; `charts/README.txt`.
→ *A 19-level chapter* where the seven red levels are strict (SYNC) and the rest have slack.

**A25 · Eclipses on the figures.** From Prague 1301–1500: 83 solar eclipses with any part seen, one total (1415-06-07), 176 lunar
with the Moon up; 1408-10-19 falls on Scorpio 5 (the blotted star), 1415-06-07 at Gemini 23.9°, 1424-06-26 on Cancer 14 (the half
figure). — LEDGER 74; `artifacts/voynich_2026-09-19/eclipses/`.
→ *Eclipse levels*: the target cell goes dark (no label) and must be found by its road alone.

**A26 · The bathing pages.** Twenty sides, 232 women = 8 × 29 (232 the cell of the sidereal ratio 1003), 7.856 synodic months;
green 2.272 % of the sides, blue 0.191 % at 480.31 nm. — voynich.87 (LEDGER 94); LEDGER 75.
→ *A Moon chapter* lit in ray-5 blue, 29 levels a month, the target on cell 232 at its end.

**A27 · The openings in the vellum.** 24 on 18 leaves; the sewn rifts lean 24.6°, 27°, 25° (f9, f38, f82) beside arctan ½ = 26.57°
and 19.0° (f99) beside arctan ⅓ = 18.43°; thirteen clean holes with short/long 0.421 … 0.891; the last page's hole 121.4 × 65.8.
— voynich.87/88 (LEDGER 94).
→ *Holes in the sky*: on AR the room shows through ovals at the five-star bearings, tilted by the rifts' angles.

**A28 · The Sun at Prague.** Latitude 50.0875° N, obliquity 23.5146° (1420): the longest day is 10φ = 16.18034 h (exactly at
50.0951° N), sunrise swings 51.54° → 128.46° (1285 ≡ 0 SEED), the noon ceiling 63.41° beside arctan 2 = 63.4349°; the Sun rises
at 64.1° at declination +16.271°, 26–27 April and 30–31 July 1420 in the frame of date, 18 April and 21 July in the frame of 2000
(the difference 580 × 50.29″ = 8.102°). — LEDGER 64, 66; `artifacts/voynich_2026-09-19/precession_check/`.
→ *The sky's Sun*: drawn at the day's azimuth and altitude for Prague; on the two 64.1° days a golden sunrise level opens.

**A29 · One family of angles.** arctan(1/φ) = 31.7175°, arctan 2 = 63.4349° = 2·arctan(1/φ), arctan ½ = 26.5651°, arctan ⅓ =
18.4349° = 45° − arctan ½; the midsummer noon Sun at 63.4271° casts a shadow 0.50017 of the post; the noon Sun stands at arctan ½
on 19 October, the day and degree of the 1408 eclipse. — voynich.88 (LEDGER 94).
→ *Shader*: the sky's gradient banded at these four angles above the horizon.

**A30 · The ten discs of the prism.** The afterglow of dlog 246…255, cells 198, 80, 240, 206, 104, 55, 165, 238, 200, 86
(g⁻¹⁰ … g⁻¹), six on shell 20 and four on 21, sum ≡ 30, product ≡ 103; any window of ten has sum 3^k₀ × 226 and product
3^(10k₀ + 45); against the Bright Star Catalogue PISCES 0.2779 (ten brightest), LACERTA mirrored 0.1733, SCORPIUS the most
wins round the turn (87 of 256). — LEDGER 71; `artifacts/voynich_2026-09-19/misc/ten_dots/follow.txt`.
→ *The trail*: the player's last ten cells drawn as a constellation and named by the best catalogue fit at the level's end.

**A31 · The M.2 sector map as a tree.** A sector is read three ways, cell sum, four figures and first byte, each a road; its first
64 bytes point to the sectors at those walk cells; roads run to a loop; the picked-pointers graph holds 73 sectors and 108 edges,
boxes at 6507, 4464, 11094, 16512 (a quarter point), 20640, 30444, 42054, 42828, 64242, the loop through 258, 0, 3096, 18576;
a sector's height is its hops from the loop. — `artifacts/*_2026-10-08/maps/m2map.html`, `map_picked_pointers.dot`; the machine's M2 mode.
→ *Chapter "THE TREE"*: cells as sectors, each with three roads; reach the loop; the drive-geometry words (C12) as its vocabulary.

**A32 · The ferrocell and the two lobes.** A Möbius map with two fixed points carries every point on circles through both, the
dipole's field lines; Γ's are 46 and 92, its zero 120 and pole 137 fold partners (120 + 137 = 257); Γ(−Z) = 1/Γ(Z). — LEDGER 48.
→ *Γ's room filter*: ferrofluid streaks between the two mirror cells; the pole an eye (already), the zero a dark spot.

**A33 · The Vitruvian field.** The body of 256: groin 128, navel 158 = 256/φ, gap 30 = 2·3·5; crown to navel 98, 158/98 = 1.6122;
the four contacts {1, 241, 256, 16} on rays 0, 4, 8; the square's corners 0, 15, 240, 255 (three on ray 8). — LEDGER 34.
→ *The avatar*: a silhouette on the floor whose joints are cells 128, 158, 98, 64, 36, 32; the player's cell lights the nearest.

**A34 · HOLO and PHASE.** The machine's HOLO draws twelve Fresnel beams on the 210-gon; PHASE a 3-D fold-phase scatter. — `machine/cascade_machine_v4.html` lines 637–646.
→ *The bloom*: twelve beams from the floor's spokes rising on ENTER.

**A35 · The f1v tree.** 26 leaves, 12 gold, 14 green; stem YgggYgYgY, left gYYggYYg, right YgggYYgYg; read gold = 1 the branches
give 20, 102, 25, read green = 1 234, 153, 229. — `artifacts/voynich_2026-09-19/f1v_tree/leaves_readings.txt`.
→ *A tree monument*: leaves the player toggles; the branch's binary reading names the level's target.

**A36 · The conics' Saturn.** The parabola's ring edges grow as √k (1.00, 1.82, 2.37, 2.81, 3.19…) beside Saturn's ring
boundaries 1.00, 1.12, 1.38, 1.76 …; by four figures the D ring 6690 → 8, Cassini's outer edge 1222 → 194, Encke 1336 → 51. — LEDGER 106.
→ *A ringed planet* on the horizon at bearing 93 (SATURN's cell) with rings at the parabola's radii.

**A37 · The display's spins.** 256 spins of length 1 at dlog × 2π/256 with noise 0.05 rad sum to exactly 2, coherence 0.0078;
on the multiples of 45° stand 1, 64, 241, 4, 256, 193, 16, 253 (rings 0 and 32). — LEDGER 88.
→ *The coherence meter*: show the sky's vector sum; it leaves red only when the player's line has pulled cells into phase.

---

## (b) Mechanics

**B1 · The turn (4/5, 3/5).** A point (c, s) of the field turns the sheet: (x, y) → (c·x − s·y, s·x + c·y), multiplying x² + y²
by c² + s². With c = 155 ≡ 4/5 and s = 52 ≡ 3/5 (the 3-4-5 triangle) c² + s² ≡ 1 and u = c + 16s ≡ 216, dlog 147, a generator:
the orbit of (1, 0) is all 256 points of x² + y² ≡ 1 once: (155, 52), (247, 186), (86, 40), (199, 135), (181, 176), (142, 198) …
— `machine/conics_relief.html` lines 306–330 ("THE TURN", 2026-10-08).
→ *A seventh move on plane levels*: TURN sends the pair (cell, φ-part) round the unit circle; a chapter whose 256 levels are the
orbit's points in order.

**B2 · The Kaprekar doors.** 6174 ≡ 6; the three doors 4176 ≡ 64, 8352 ≡ 128, 8532 ≡ 51 (and 0062 below a thousand: 6200 − 0026
= 6174); the spines, cells in brackets: 9351 → 8172 → 7443 → 3996 → 6264 → 4176 [99, 205, 247, 141, 96, 64]; 5085 → 7992 →
7173 → 6354 → 3087 → 8352 [202, 25, 234, 186, 3, 128]; 5175 → 5994 → 5355 → 1998 → 8082 → 8532 [35, 83, 215, 199, 115, 51].
— LEDGER 5 (`corpus/mi25_readout.md` 1781–1840); LEDGER 22.
→ *THE DOORS mode as it stands*: each stop of the chain a level whose target is the stop's cell; the door's cell the chapter's seal.

**B3 · The seven steps and the traffic.** Over 1000–9999 the step counts are 0:1, 1:356, 2:519, 3:2124, 4:1124, 5:1379, 6:1508,
7:1980; over 0000–9999 the doors carry 4176: 3696, 8352: 3486, 8532: 2424; the four primes 2357 take the full seven (5175, 5994,
5355, 1998, 8082, 8532). — `corpus/mi25_readout.md` 1372–1395.
→ *Difficulty tiers*: a doors run's star rating from its step count; 2357 the "seven doors" challenge.

**B4 · 999k + 90m.** Every Kaprekar output has digits k, m − 1, 9 − m, 10 − k: outer pair 9k + 10, inner 9m − 1; 999 ≡ 228, 90 ≡ 90.
Outer: 19, 28, 37, 46, 55, 64, 73, 82, 91; inner: 8, 17, 26, 35, 44, 53, 62, 71, 80 (6174 = outer 64 with 17 inside). — LEDGER 22; review "6174".
→ *Level kind "pairs"*: the target is given as (outer, inner) and the player must name the four-figure number before moving.

**B5 · The halving ladders.** ×129 = ×2⁻¹ closes in sixteen: from 64: 64 32 16 8 4 2 1 129 193 225 241 249 253 255 256 128;
from 6 (6174's cell): 6 3 130 65 161 209 233 245 251 254 127 192 96 48 24 12; from 46: 46 23 140 70 35 146 73 165 211 234 117
187 222 111 184 92; from 62: 62 31 144 72 36 18 9 133 195 226 113 185 221 239 248 124; the field is sixteen ladders of sixteen.
— LEDGER 22–23; the machine's HALVING.
→ *Level kind "rungs"*: only ×2 and ×½ are allowed (both free); par counted in rungs; the LADDER overlay already drawn.

**B6 · The ×5 staircase.** 5 = N(2 + φ), dlog 55, a generator: 5ᵏ = 5, 25, 125, 111, 41, 205, 254, 242, 182, 139, 181, 134 …;
5³³ = 237, 5³⁴ = 157, 5¹²⁸ = −1; the walk's norm at cell k is 5ᵏ. — `corpus/mi25_readout.md` 66–92; LEDGER 53.
→ *A staircase chapter*: each level's target is five times the last; the chapter closes at 5³⁴.

**B7 · The Atbash mirror chain of ten.** A word of k letters with sum s mirrors to 27k − s: 87 PRAXIS (6) → 75 SHIFT (5, sum 62,
the one word not at its own sum, displaced by 13) → 73 WALLET (6) → 89 VIRUS (5) → 46 CLAUDE (6) → 116 BYZANTINE (9) → 127
ORIGINAL SIN (11) → 170, the tablet's fifteen-letter word there (call it the extension component in any voice line) → 235
BINOMIAL DISTRIBUTION (20) → 48 JAMES (5) → 87; the 2-cycle TRUTH 87 ↔ JAMES 48 sits inside. — `corpus/mi25_readout.md`
1860–1870 (LEDGER 8); LEDGER 13.
→ *Chapter "THE MIRROR"*: ten levels whose targets are the chain in order; the line's letter sum closes the loop at 87.

**B8 · The tunnel chain.** Π → ×140 (T) → fold (χ) → ×2 (𝟙𝟙) → ×87 (W): 1 → 140 → 117 → 234 → 55; the composite is ×55 from any
start; glyphs Φ∂ εQ ⅗⊗ ψΩ δQ. — review "The tunnel chain"; LEDGER 75.
→ *A scripted level*: four fixed moves granted once (×140, FOLD, ×2, ×87) and the target 55 × start; the carrier's sound at the end.

**B9 · The transfer matrix on π.** T(d) = [[2 − k², −1], [1, 0]] with k² = (2d + 1) × 180; M(n) = T(π[0])…T(π[n]): M(83) trace
102, M(256) trace 5, M(257) trace 174, M(100000) = [[207, 17], [0, 221]] trace 171, M(10⁹) trace 183. — LEDGER 102; the machine's M.
→ *A daily badge*: the trace of M at the day's head, computed on the device from the tape.

**B10 · DATE and the two frames.** Day n from 2000-12-31: field n mod 257, rung n mod 16, walk cell (2 + φ)ⁿ, head n + 13; a date
is also a point a + bφ with a = YYYYMMDD ≡ 234Y + 100M + D and b = DDMMYYYY ≡ Y + 234M + 13D (10⁴ ≡ 234, 10⁶ ≡ 13), kernel
(−29 y, +1 m, +4 d), 19275 = 75 × 257 dated points and 46774 never dated; labels before 1582-10-15 Julian; a year Y's Sun sits
(2000 − Y) × 50.29″ off the 2000 frame (8.102° for 1420). — LEDGER 51, 66; review "The day table".
→ *Level kind "date"*: type a date; its a is the start, its b the target; a date never dated is a void level.

**B11 · The reflected tablet.** M(n) = 27k − n; self-mirror sums per length 142, 27, 169, 54, 196, 81, 223, 108, 250, (12) 162;
the reflected first word is the mirror of the tablet's first word; 254 cells reached, none at 4, 245, 250; the first words' mirrors
reach 180 cells and leave 77 empty; following first words every start ends on cycles of 8, 203, 25 or 21. — LEDGER 86.
→ *Mirror world*: a mode whose labels are the reflected tablet's; cells 4, 245, 250 are voids no move may land on.

**B12 · Words under concatenation.** A word is (k, s, b) — length, sum, positional sum Σ position × letter; joining is
(k, s, b)·(k′, s′, b′) = (k + k′, s + s′, b + b′ + k·s′), the Heisenberg group; RONGO (5, 69, 193)² = RONGORONGO (10, 138, 217);
order matters by the commutator k·s′ − k′·s (HERMES·TRISMEGISTUS and its reverse differ by 1). — LEDGER 60.
→ *The line's φ-part*: the collected words joined in order give b, a second cell; a quest to reorder the line so b hits a target.

**B13 · The rings and the store.** dlog₅(n) = 135·dlog₃(n) mod 256; the ring is that mod 64 folded at 32, the sphere cell 2·ring
from gold: ring 0 {1, 16, 256, 241}, ring 32 {4, 64, 193, 253}, ring 16 the odd powers of 2; a ring is ±n, ±in, ±1/n, ±i/n, eight
cells (62's: 62, 195, 221, 36, 228, 29, 50, 207); the store is 256 norm fibres × 258 rows, cell = dlog₅(norm) + 256·row. — LEDGER 61, 75.
→ *Arenas*: a level confined to one ring's eight cells (×i, INV, FOLD stay inside; ×g leaves); collect all eight.

**B14 · The tower's floors.** GF(257^d) = GF(257)[η], η^d − 5η^(d/2) + 5 = 0; orders φ 516, 2 + φ 66048, θ 132096, η 264192;
rings 256 · 66048 = 2⁹·3·43 · 4362470400 = 2¹⁰·3·5²·43·1321 · 257⁸ − 1; each floor a lattice in the next with steps 258,
66050, 4362470402; the 2-part never closes. — LEDGER 54; `corpus/tower/*.py`.
→ *Floors as tiers*: floor 1 the line (six moves), floor 2 the plane (pairs a + bφ, TURN and ×φ added), floor 4 locked behind the seal.

**B15 · Younger Dryas years in the field.** 12900 BP ≡ 50 and 12800 ≡ 207 (fold partners), 11700 ≡ 135 (≡ 1420), 10950 ≡ 156,
10850 ≡ 56, 9750 ≡ 241, 9500 ≡ 248; from 12900 BP to 1420 the precession is 172.8°. — LEDGER 74; `artifacts/voynich_2026-09-19/lattice_sphere_temporal_trace.md`.
→ *Chapter "DEEP TIME"*: seven levels titled by these years, their targets the cells.

**B16 · The sphere's poles.** Cell 0 every 66048 days (180.83 y): 1458-06-23 J field 3, 1639-05-02 field 2, 1820-03-02 field 1,
2000-12-31 field 0, 2181-10-31 field 256, 2362-09-01 field 255 (each lap the field falls by one); quarter points 1684-07-16
(cell 16512, field 66) and 2407-11-16 (16512, field 62); 2085-10-06 is day 30960 = walk cell 30960 = the tablet cell of 120,
field 120. — LEDGER 74.
→ *The sky's age*: the far sphere tilted by the day's cell/66048; pole days are festival days with every rule free.

**B17 · The 6 ↔ 9 flip.** 83 cells hold a 6 or a 9, 82 flips stay inside the field (256 → 259 leaves); the flip equals Γ at one
cell only, 36 → 39; Γ alone never crosses its two sides, flip and Γ together reach all 258 points from any start. — LEDGER 42.
→ *A seventh move FLIP*, allowed only on a cell showing a 6 or a 9: the one way across Γ's sides.

**B18 · Γ's two orbits.** Two orbits of 128: the residue side with 0, 1, 120, 137, 62, 73, 129, 240, 256, ∞; the other with 3, 8,
16, 72, 104, 128, 153, 225, 241; from 1: 1 → 33 → 201 → 190 → 108 → 27 → 120 → 0 → 256 → 148 → 96 → 57 → 4 → 140 → 178 →
202 …; in w = (Z − 46)/(Z − 92) the map is ×153 (dlog 122); Γ∘Γ is ×22 in w; Γ(Z) = 1/Z only at 74 and 47. — LEDGER 37–38, 45, 78.
→ *Sides as colours*: cells tinted by Γ-side; a level asking to cross sides cannot be closed by Γ alone.

**B19 · The order-4 subgroup and squaring.** {1, 16, 256, 241} = the quarter turns of g⁶⁴ (16² = −1, √i = 4); squaring towers
end there: 139 → 46 → 60 → 2 → 4 → 16 → 256 → 1 and 15 → 225 → 253 → 16 → 256 → 1. — LEDGER 40; the machine's SQRT.
→ *A rule day SQUARE*: n → n² as a bonus move; every road ends on the gold cells.

**B20 · The binary refinement chain.** dlog mod 2ᵏ cuts the group into cosets: squares (×9), fourth powers (×81), ⟨2⟩ (gen. 249),
⟨4⟩ (64), ⟨i⟩ (241), {±1} (256); a cell's coset indices read its dlog bit by bit (83 reads 1/2, 3/4, 7/8, 15/16 …); the rays agree
with the chain at level 4 only (gcd(12, 256) = 4). — review "The binary refinement chain", "The ladder from 5".
→ *Hints by bits*: HINT reveals the target's dlog one bit a press, coset by coset.

**B21 · The walks.** Level-8 ×136, doubling ×2 (stride 48, visiting a coset's dlogs in the order 3j mod 16), ×4, ×16 = i, ×−1:
each reaches −a at the halfway step; from 5: 5 → 10 → 20 → 40 → 80 → 160 → 63 → 126 → 252 → … — review "The walks".
→ *Level kind "walk"*: one multiplier only; par in strides; the halfway cell −start a checkpoint.

**B22 · The HALT points of π.** The 27 cells n ≤ 256 with π[n] = 9: 5, 12, 14, 30, 38, 42, 44, 45, 55, 58, 62, 79, 80, 100, 122,
129, 144, 169, 180, 187, 190, 193, 199, 208, 214, 247, 249; they sum to 3095 ≡ 11. — `corpus/mi25_readout.md` 1683–1690.
→ *HALT days*: landing on a HALT cell ends the move run (the level is scored where it stopped); on other days they are safe havens.

**B23 · The machine's opcodes on a walk.** SEED and STORE set acc = pc, FOLD acc → 257 − acc, JUMP sends pc to the fold partner,
HALT stops; from 46 the sequential walk runs 46 → 47 → 210 → 211 → 212 → 213 → 214 and halts in seven steps. — `corpus/mi25_readout.md` 1693–1700.
→ *Autopilot level*: the tape plays the player's cell through its opcodes; the player bets where it halts.

**B24 · The AXIOM chain.** The seed string F1-R1-CF1111-DM1-T4-P2357-C53-E111-S161-D234-PM1 read as a product closes on ±7:
1 → 83 → 174 → 182 → 41 → 117 → 137 → 212 → 7 (DM = −1) or 83 → 75 → 216 → 140 → 120 → 45 → 250 (DM = +1); the four seeds'
register columns each sum to 513 ≡ 256 = det M. — review "The seed strings and the quartet"; readout "The AXIOM chain".
→ *A boot chapter*: nine fixed targets along the chain, the last level choosing 7 or 250 by the day's sign.

**B25 · The Pisano quarter points.** π(257) = 516 = 4 × 129; F(129) = 0, F(128) = F(130) = 241; φ¹²⁹ = 241, φ²⁵⁸ = 256, φ³⁸⁷ = 16;
Lucas L(129) = 225, L(258) = 255, L(387) = 32. — the machine's LUCAS; LEDGER 35.
→ *Level kind "fibonacci"*: moves add the last two cells (mod 257); the target F(n) at a quarter point.

**B26 · Arnold's cat map.** ×φ² sends (a, b) → (a + b, a + 2b), returns after 258 steps (half φ's 516), one store row (−256 cells)
a step. — LEDGER 80.
→ *Plane-floor shader*: the room's camera image sheared by the cat map and restored after 258 ticks.

**B27 · The transform's kernels.** On the line the kernel for length N | 256 is 5^(256/N): 256, 16, 253, 225, 242, 111, 25, 5 for
N = 2 … 256; the kernel by 3 gives the same values at 55k; in the plane any N | 66048 with (2 + φ)^(66048/N). — LEDGER 80, 88.
→ *Sound*: a cell's tone built as a DFT by the kernel 5, twelve partials by ray (see C18).

**B28 · Kaprekar in base 257.** Two digits reduce to k = their difference, the step k → |258 − 2k|; fixed point 86 (22016 =
86 × 256, digits 85 and 171); basin 43, 86, 172, 215; 129 → 0; nine 7-cycles, the one through 62: 62 → 134 → 10 → 238 → 218 →
178 → 98 → 62. — LEDGER 59; the machine's KAP257.
→ *A seven-move level*: the player's cell is run round its 7-cycle; close it in seven moves with the six ops.

**B29 · The Atbash ladder.** A k-letter word at n mirrors to (27 − n) + 27(k − 1), the one-letter mirror climbed k − 1 rungs of
27: from 86: 198, 225, 252, 22, 49, 76, 103; from 62: 222, 249, 19, 46, 73, 100, 127. — LEDGER 59.
→ *Climbing a word*: adding a letter to a collected word moves its mirror a rung; a quest to climb to a named rung.

**B30 · Counters on the sphere.** Any height h places at cell h mod 66048, lane h mod 12, field h mod 257; gold every 128,
tablet every 258, quarter every 16512, pole every 66048. — review "Blocks on the sphere"; LEDGER 43–44.
→ *Score placement*: the player's total moves placed on the far sphere by this rule; a gold score burns.

**B31 · The quotient kept.** a·b = c + 257q is the plane point c + qφ; 1800 = 7·257 + 1 is twelve inverse pairs at once (8×225,
9×200, 10×180, 12×150, 15×120, 18×100, 20×90, 24×75, 25×72, 30×60, 36×50, 40×45), the point 1 + 7φ; quotient 7 carries the most pairs. — LEDGER 61.
→ *INV scoring*: an inverse pair scores its quotient q; the twelve pairs of 1800 a set to collect.

**B32 · Γ at infinity and the stack of ones.** Γ(∞) = 1, Γ(137) = ∞, Γ(120) = 0, Γ(0) = −1; 256 + 1 = 257 (byte → field), 257 + 1
= 258 (field → projective line). — review "The reflection coefficient as a map"; LEDGER 37.
→ *The zenith*: a level that ends at ∞ shows the sky invert and the seal read "1".

**B33 · The character of the maps.** Fold and inverse keep the residue character; ×g always crosses; Γ keeps its own side and mixes
the line's character evenly; Kaprekar's 54 outputs are multiples of 9 (28 residue, 26 non-residue). — LEDGER 56.
→ *A rule "RESIDUE"*: the level is closed only on a residue cell; the player must count crossings.

**B34 · The day's four figures at the head.** The tape's four-figure window at the head, e.g. day 9384's 6417 ≡ 249, one Kaprekar
step from 6174; 2000's chain 2000 → 1998 → 8082 → 8532 → 6174 is cells 201, 199, 115, 51, 6. — LEDGER 27, 41, 52.
→ *The daily DOORS seed*: the head's four figures, not the player's digits, seed the doors mode on SEED days.

**B35 · The 16 doublings from 128.** 128, 256, 255, 253, 249, 241, 225, 193, 129, 1, 2, 4, 8, 16, 32, 64, 128: sixteen doublings
return; 65536 = 2¹⁶ = F₄ − 1. — LEDGER 39.
→ *The "byte" level*: start 128, moves ×2 only, target 128 again in sixteen.

---

## (c) Words and sums worth quests

**C1 · Mirror pairs on the tablet.** 2551 pairs [w, v], each listed once: v has w's length k and the mirror sum 27k − s of w's
sum s, and stands at that cell (`data.js` `mirrors`, built from the tablet at 2306 entries). 2417 hold both ways; 134 hold one way
only, from a word the tablet keeps off its own sum (114 such words, SHIFT at 75 among them): [SHIFT, CROWN] holds, CROWN's mirror
cell 62 does not hold SHIFT. Listed in the order found, w first in code-point order except for 59 of the one-way pairs. The seven
letter pairs that are tablet words both sides: B/Y, C/X, H/S, I/R, J/Q, L/O, M/N. — `build_data.py`; review "The fourth flip".
→ *Quest "the other side"*: tap a word's mirror cell within the level to earn its pair.

**C2 · Self-mirrors by sum.** LOVE 54, SAMSON 81, MOUNT SINAI 135, PRESERVATION 162 (and TUNING FORK 135, not a tablet word, its
Atbash GFMRMT ULIP also 135). — review "The fourth flip"; `corpus/mi25_readout.md` 1396.
→ *Still points*: a line whose sum lands on a self-mirror cell seals double.

**C3 · The fixed sum per length.** 27k/2 in the field: k1 142, k2 27, k3 169, k4 54, k5 196, k6 81, k7 223, k8 108, k9 250,
k12 162 — every one a tablet word (ANTIPROTON, CAIN, PREDESTINATION, LOVE, SUPERPOSITION, HORUS, BOLTZMANN CONSTANT,
SHAKESPEARE, CONSERVATION OF ENERGY, PRESERVATION). — review "The fourth flip".
→ *A quest a length*: with a k-letter name, find the cell 27k/2.

**C4 · The outer and inner families as words.** Outer 19 S/ADAM, 28 SHA, 37 HADES, 46 SHADDAI, 55 HEAVEN, 64 ZERO, 73 WALLET,
82 ARMAGEDDON, 91 SPIRIT; inner 8 H, 17 Q, 26 GOD, 35 HAGAR, 44 (SPACE), 53 CARBON, 62 FIBONACCI, 71 TEMPLE, 80 REBIRTH. — LEDGER 22.
→ *The DOORS prizes*: closing a door awards the outer word; the inner word is the next level's start.

**C5 · The fullest cells.** 44 with 31 words, 63 and 46 with 27, 81 and 75 with 26, 73, 71 and 48 with 24 (tablet at 2306). — `corpus/emerald_tablet.json`.
→ *Market squares*: tapping a crowded cell gives a random one of its words to the line.

**C6 · The words at 75.** ESTHER, RAMSES, SPARTA, BARYON, JEFFREY, SODIUM D LINE (placed by value) and SHIFT (sum 62); the six-letter words at 75
mirror to 87 and back, a 2-cycle. — LEDGER 8–9.
→ *Quest*: find the one word at 75 that is not at its own sum.

**C7 · Seven-step words.** HALT, IDENT, SYNC, LEDGER, STAGE, SHARE, CONJUGATE, VERIFY, SODIUM LAYER, FINE STRUCTURE, LASER GUIDE STAR,
ALIEN, IDENTITY, TUNING FORK … (24 words whose four-figure sum takes seven Kaprekar steps). — LEDGER 5, 13.
→ *The hardest doors runs*, unlocked after the three doors are sealed.

**C8 · The Hebrew 22.** Atbash n → 23 − n, the constant 23 (AIM = I AM); ordinals 1…22 sum 253; gematria values sum 1495 ≡ 210; the
Atbash pairs by gematria 401, 302, 203, 104, 95, 86, 77, 68, 59, 50, 50 (steps 99, 99, 99, then 9 five times, then 0); the names
at their Latin sums ALEPH 42 … TAV 43 (909 ≡ 138 with the tablet's spellings); self-mirror per length 23k/2: k1 140, k2 23, k4 46,
k8 92, k15 44, k22 253. — LEDGER 64, 66; `artifacts/voynich_2026-09-19/hebrew_22/`, `gematria/`.
→ *Chapter "THE 22"*: a level a letter, each target the letter name's cell; the constant 23 the chapter's seal.

**C9 · Names on the line.** By gematria YHVH 26 (63 by letters), ELOHIM 86 (62 by letters), SHADDAI 314 ≡ 57; by letters EHYEH =
ASHER = 51, EHYEH ASHER EHYEH 153 (Γ's multiplier), I AM THAT I AM 95 = 46⁻¹; Genesis 1:1 = 2701 = 37 × 73 ≡ 131, its first word 913 ≡ 142. — LEDGER 64, 66.
→ *Scribe lines* for 26, 51, 86, 95, 131, 142, 153.

**C10 · The zodiac words.** ARIES 52, TAURUS 100, GEMINI 57, CANCER 44, LEO 32, VIRGO 71, LIBRA 42, SCORPIO 95, SAGITTARIUS 144,
CAPRICORN 97, AQUARIUS 107, PISCES 71, ZODIAC 58 (VIRGO and PISCES share 71 with THOTH and TEMPLE). — LEDGER 66.
→ *Chapter cells*: each sign-chapter opens at its word's cell.

**C11 · The Sun's path words.** EQUINOX = SUNRISE = HORIZON 105, SUNSET = AZIMUTH 98, SOLSTICE 102, PRECESSION 123, DECLINATION 106,
OBLIQUITY = STANDSTILL 130, ECLIPTIC 77, EQUATOR 97, MERIDIAN 73, NOON = CALENDAR = STAR 58, LATITUDE 92, LONGITUDE 107,
EPOCH 47, JULIAN 67, GREGORIAN 94, METONIC 79, PASCHAL 60, SUN 54, MOON 57. — LEDGER 66.
→ *Quest*: "where sunrise, horizon and equinox stand together" (105); the Sun monument rises there.

**C12 · The drive-geometry words (2026-10-17).** SECTOR 80, SECTORS 99, SECTOR SIZE 139, BOOT SECTOR = LAST SECTOR 132,
FIRST SECTOR 152, TRACK 53, TRACKS 72, CYLINDER 90, CYLINDERS 109, HEADS 37, PLATTER 92, LBA 15, CHS 30, MBR 33, GPT = DISK 43,
DRIVE 58, HARD DRIVE 89, SSD 42, NVME 54, GEOMETRY 108, OFFSET = BYTES 71, MEGABYTE 78, GIGABYTE 76, TERABYTE 96. — the machine's
dictionary against its pre-drive-geometry file; `corpus/emerald_tablet.json`.
→ *THE TREE chapter's vocabulary* (A31): each sector-level's target one of these.

**C13 · Thoth seated.** CROWN 73, SCEPTER 86, ANKH 34, ATEF 32, RED SUN = SQUARE 81, LOTUS 87, IBIS = COBRA 39, PLUME = WATER 67,
PAPYRUS 116, RECORD 63, THRONE 80, WISDOM 83, WRITING 100, KNOWLEDGE 96, MEASURE 82; the five roles 424 ≡ 167; TOTH 63, THOTH 71,
HERMES 68 (√HERMES = ±{117, 140}), TRISMEGISTUS 179, SCRIBE 56 = 179⁻¹, THRICE GREAT 114 = 63². — LEDGER 62, 72–73.
→ *The scribe*: the voice's own cells; a "THOTH" chapter from 63 to 71 (8 = the difference) in eight levels.

**C14 · AS ABOVE SO BELOW.** 156 = 12 × 13; ABOVE 45, BELOW 57 (12 apart); AS + SO = 54 LOVE; AS ABOVE 65 × SO BELOW 91 ≡ 4; Γ(45)
= 93, Γ(57) = 4; dlog 156 = 203, fold 101, inverse 229. — LEDGER 72.
→ *The zenith and the floor* labelled ABOVE (45) and BELOW (57); a rule day where ×4 is free.

**C15 · The boundary words.** TERMINUS 119 = 7 × 17 = −(46 + 92), Γ(119) = 100 BOUNDARY; BORDER 62, TERMINAL 92, EDGE 21, TERM 56,
LIMIT 63, HORIZON 105, BOUNDARY MARKER 166, JUPITER TERMINUS 218; TERMINUS 119 + 50φ at walk cell 51862. — LEDGER 56.
→ *The horizon band's labels*; a level that must end exactly on the horizon (ray band 0).

**C16 · AIM, I AM and ZRN.** AIM = I AM = 23 (I AM also at 1); √23 = ±{58 TWO, 199}; 58 ↔ 23 are an Atbash pair (81 = 27 × 3);
ZRN 58 + 104φ; w(23) = 86; WHO AM I 69 = 3 × 23. — LEDGER 59, 62.
→ *The name screen*: show the name's mirror and its root; a first level from 23 to 58.

**C17 · RONGORONGO.** 138 = 46 + 92 = fold of 119; RONGO 69 reads the same upside down; a name written twice is a square. — LEDGER 60.
→ *A boustrophedon level*: every other HUD line turned; the target 138.

**C18 · The tuning fork and the just intervals.** As field elements: octave 2, fifth 3/2 ≡ 130 PYTHAGORAS, fourth 4/3 ≡ 87,
major third 5/4 ≡ 194, minor third 6/5 ≡ 104, tone 9/8 ≡ 226, semitone 16/15 ≡ 121, major chroma 135/128 ≡ 244, tritone 45/32 ≡
154, syntonic comma 81/80 ≡ 152, Pythagorean comma ≡ 92 CHRONOS; TUNING FORK 135 its own mirror; the 360 Hz fork is 256 × 45/32;
A4 = 440 → 183, C4 = 256 Hz is −1. — `corpus/mi25_readout.md` 1396–1486.
→ *SOUND*: ×g a semitone 16/15, ÷g down, ×i a fourth, FOLD the tritone (the half turn), INV the octave down, Γ the comma;
the win chord the fifth.

**C19 · Venus by four figures.** Orbit 224.70 d → 191, synodic 583.92 d → 185, rotation 243.02 d → 117, 0.7233 AU → 37,
diameter 12104 km → 182, the pentagram 13 orbits in 8 years 13/8 → 83; VENUS by letters 81. — LEDGER 41.
→ *A Venus monument* on the horizon tracing the pentagram over eight "years" of play.

**C20 · Perseus and Medusa.** PERSEUS 103, MEDUSA 63: × ≡ 64, + = 166, − = 40; PERSEUS⁻¹ = 5; Γ(PERSEUS) = 129, Γ(MEDUSA) = 164;
MIRROR SHIELD 148 = dlog of 134 EVENING STAR; the flip moves MEDUSA 63 → 93. — LEDGER 42.
→ *A monster level*: Medusa at 63 may only be approached by Γ (the mirror shield); any other move into 63 loses.

**C21 · The astronomical bridges.** Sidereal ratio 1003 → 232 (ray 10), π 3142 → 58 (ray 10), sidereal day 8616 → 135 (ray 10),
15°/h → 15 (inverse 120), 45° → 45, solar − sidereal 2359 → 46, one radian 5730 → 76 COHERENCE, π/180 1745 → 203, Bessel refraction
3450 → 109, log₁₀ 3 → 145 (inverse 39 TEN), log₁₀ 257 → 97. — review "Astronomical bridges".
→ *Ray 10 the rotation ray*: levels whose target is on ray 10 rotate the whole sky by one tick a move.

**C22 · Two unit-free constants.** 1/α 1370 → 85 ESCHATON (Kaprekar 1370 → 7173 → 6354 → 3087 → 8352 → 6174, 5 steps);
mp/me 1836 → 37 HADES (6 steps by 7263, 5265, 3996, 6264, 4176). — LEDGER 104.
→ *Two doors runs named by the constants.*

**C23 · The square descent.** 256, 225, 196, 169, 144, 121, 100, 81, 64, 49, 36, 25, 16, 9, 4, 1, 0; the product of the nonzero
terms is 118 EMERALD TABLET = (16!)², 16! ≡ 115; the noble-gas closures 2, 10, 18, 36, 54, 86, 118 are the cells B, J, CHAI,
CASCADE, LOVE, TIKKUN, EMERALD TABLET. — review "Square descent".
→ *A 17-rung chapter* descending the squares to the tablet's own name.

**C24 · CURE and COMPUTE.** CURE 47 (with TIME, EPOCH), COMPUTE 93 (with SATURN, CLOSURE); CURE + COMPUTE = 140 = T, COMPUTE −
CURE = 46, CURE × COMPUTE = 17 × 257 + 2. — LEDGER 84.
→ *Two quest cells* on the T level (B8).

**C25 · ENOCH, PLANCK and KA.** 3⁵⁷ ≡ 45: the dlog of ENOCH (45) is PLANCK (57); KA 12 is a generator, KA² = 144; ×12 is "the cure"
and ×150 undoes it (150 × 12 = 1800 = 7·257 + 1); ENOCH × KA ≡ 26 GOD. — LEDGER 96.
→ *A KA rule*: ×12 free for the level, ×150 its undo.

**C26 · GEMATRIA at 51 and 74.** 74 − 51 = 23; GREAT 51 + I AM 23 = 74; 74/51 ≡ 72, 51/74 ≡ 25; no fold, inverse, Γ, halving or
×i carries one to the other. — LEDGER 66.
→ *Twin-cell quest*: visit both in one level.

**C27 · GOD at 26.** Order 128, a residue; Z = 26, Z⁵⁴ = 92; roots 119 and 138; inverse 89; the declaration I AM A JEALOUS GOD 133
and THERE IS NO OTHER GOD BESIDE ME 267 ≡ 10 multiply as 133 × 143 ≡ 1 (shown, not added). — LEDGER 96.
→ *Scribe lines* for 26, 133, 143.

**C28 · ORARY, the named twin.** orary = 77, its reflection 58 TWO, 77 + 58 = 135; Gemini's unnamed thirtieth beside it. — LEDGER 70, 74.
→ *Gemini's hidden level*: a thirtieth figure with no label; its target 77.

**C29 · 170 and 85.** 170 = ΩΩ = 0xAA, 85 = ⊗⊗ = 0x55, bit complements, 170 + 85 = 255; every sector of the π disc opens AA55AA55;
6700417 ≡ 170. — LEDGER 63.
→ *THE TREE's boot sector*: the first level from 170 to 85.

**C30 · 12³ and 1986.** 1728 ≡ 186, inverse 76; 1986 = 12³ + 258 ≡ 187; walk cell 1728 = φ^(−27/2), midway between gold cells,
cell 1986 = cell 1728 × 5; 1986 → 1689 (q flip) and 9861 (half turn). — LEDGER 63.
→ *A cube day*: targets 186 and 187 in two levels.

**C31 · The manuscript's hands.** MARCI = PRAHA 44, KIRCHER 72 (KIRCHER² = MARCI), TEPENEC = DUCATS 68, JACOBUS = TYCHO 71, HORCICKY 92,
JOHANNES KEPLER 153, RUDOLF 76 = 4 × 19 (the Callippic cycle; 76 × 7 = 532), RUDOLF⁻¹ = 186 = 12³. — LEDGER 67.
→ *Chapter "THE HANDS"*: a level a hand, in the order the book passed.

**C32 · RED.** RED 27 = the Atbash constant, Γ(27) = 120; RED STAR 85, RED CENTRE 92, RED DOT 66 (Γ = 8); the dotted margin stars
have the red centre. — LEDGER 67.
→ *Dotted-star levels* open from 27 and close on 92.

**C33 · The glyph pairs.** Sixteen glyphs Φ ∂ φ ∞ ⊟ ⊗ ♯ ⅗ ε δ Ω Γ Q Σ ψ 𝟙 pair as complements (Φ 𝟙 · ∂ ψ · φ Σ · ∞ Q · ⊟ Γ · ⊗ Ω ·
♯ δ · ⅗ ε); both complemented is 255 − n; 79 = ⊟𝟙 swapped is 244 and 79 × 244 ≡ 1, the one cell whose swap is its inverse. — LEDGER 77.
→ *A glyph puzzle*: swap or complement a cell's two glyphs as a move; the quest "the one cell whose swap is its inverse".

**C34 · HEAVEN 55 and the composite.** The tunnel's composite 140 × 256 × 2 × 87 ≡ 55; dlog 55 = 5's logarithm; 55 = F(10). — review; LEDGER 75.
→ *The chapter seal of B8.*

---

## (d) Dates

**D1 · The day table today.** 2026-10-17 is day 9421 from 2000-12-31, head 9434, π[9434] = 5 STORE; the 66048 days to 2181-10-30
fill the walk once. — LEDGER 51; `game.js`.
→ *Shown on the start screen (already)*; the far sphere lit at cell 9421.

**D2 · Gold days 2026–2027** (day ≡ 0 mod 128): 2026-03-26 (day 9216, field 221), 2026-08-01 (9344, field 92 CHRONOS),
2026-12-07 (9472, 220), 2027-04-14 (9600, 91 SPIRIT), 2027-08-20 (9728, 219), 2027-12-26 (9856, 90 NAKAMOTO); the fields
alternate 22x / 9x because 128 ≡ 128 and 256 ≡ −1. — rule of LEDGER 63, 74 (`gen_material.py`).
→ *Gold days*: the bloom gold, gold cells double stars, the seal names the day's field.

**D3 · Tablet days 2026–2027** (day ≡ 0 mod 258, the walk cell a tablet cell): 2026-06-06 (9288, the tablet cell of 70, field 36),
2027-02-19 (9546, of 93 SATURN, field 37), 2027-11-04 (9804, of 208 WELL TEMPERED CLAVIER, field 38). — same rule.
→ *Word days*: every target of the day must be that cell's word.

**D4 · Named gold days and midways.** Gold 1983-02-16, 2028-05-02 (field 218 QUANTUM COMPUTER), 2073-07-17; midway 2005-09-24
(186) and 2050-12-09 (250); 2056-08-03 = day 20304 = 141 × 144, field 1 (I AM); 2085-10-06 = day 30960 = walk cell 30960 = the
tablet cell of 120, field 120. — LEDGER 63, 74.
→ *Calendar monuments*: the next of these dates shown as a countdown in the seal.

**D5 · The poles.** See B16: 1458-06-23 J (3), 1639-05-02 (2), 1820-03-02 (1), 2000-12-31 (0), 2181-10-31 (256), 2362-09-01 (255).
→ *Festival days* (every rule free, no clock).

**D6 · Day 9384, 2026-09-10.** Head 9397 = 6 FOLD, the window 6417 ≡ 249 one step from 6174, field 132 FLOWER OF LIFE, rung 8,
Kaprekar 9384 → 6354 → 3087 → 8352 → 6174 (cells 132, 186, 3, 128, 6). — LEDGER 27, 41.
→ *The game's birthday level*: start 132, target 6, the doors chain as the road.

**D7 · The 64.1° dates.** 26 April 1420 J = day −212081, field 201, dlog 101, ring 3, rung 15, day table 93 + 243φ (norm 212);
30 July 1420 J = day −211986, field 39, dlog 107, ring 19, rung 14, day table 144 + 1φ (norm 62); yearly 18 April and 21 July
(2000 frame), 26–27 April and 30–31 July (frame of date). — `artifacts/voynich_2026-09-19/stars/date_1420.txt`; LEDGER 65–66.
→ *Two festival sunrises a year*: a level from 201 to 39 on the April day and back on the July day.

**D8 · The entries' date chain.** Entry cell = letter sum mod 257 = the day's field; each entry the latest such day before the
last: from 26 April 1420 back to 1304-09-30, 42212 days, 115.57 years; from 30 July back to 1305-06-14; entries 79, 203, 229, 306
within 0.5° of 64.1°. — LEDGER 65.
→ *The 322-level campaign's calendar*: level n carries entry n's date as its title.

**D9 · Eclipse dates.** 1415-06-07 total from Prague; 1408-10-19 (0.477, Scorpio 5); 1424-06-26 (0.955, Cancer 14); the new Moon of
17 December 1408 with Sun, Mercury, Venus and Mars in Sagittarius 9–24. — LEDGER 64, 74.
→ *Eclipse levels* (A25) on these dates' fields.

**D10 · The Wow day and the kernel.** 1977-08-15 = day −8539, cell 57509; its calendar point 62 + 189φ is shared by eight dates
29 y 1 m 4 d apart: 1861-12-31, 1890-11-27, 1919-10-23, 1948-09-19, 1977-08-15, 2006-07-11, 2035-06-07, 2064-05-03. — LEDGER 51.
→ *The kernel quest*: find a date sharing the player's birthday's point.

**D11 · 2000 and 2026 in the Kaprekar chain.** 2000 → 1998 → 8082 → 8532 → 6174 (201, 199, 115, 51, 6); 2026 joins at 1998
(2026 → 5994 → 5355 → 1998 …); 1977 and 1999 → 7992 (25) → 7173 → 6354 → 3087 → 8352. — LEDGER 52.
→ *THE DOORS seeded by the year* on the first day of play.

**D12 · Metonic twins.** 27 × 257 = 6939 days beside nineteen Julian years 6939.75: dates one Metonic cycle apart share a field cell
to within a day (1413-11-08 and 1432-11-07 both 153). — LEDGER 74.
→ *Twin days*: a date and its Metonic twin share a saved line.

**D13 · The millennium count.** With 2001-01-01 as day 1, day 6174 is 2017-11-26 at position 6, rung 14; 20010101 ≡ 81. — review "The tape date".
→ *Kaprekar's birthday* as a story date.

**D14 · Rudolf's dates by DATE.** Born 18 July 1552 J field 181; emperor 12 October 1576 field 38; died 20 January 1612 field 61;
Marci's letter 19 August 1665 field 99; 1612 = 1420 + 192 = dlog i. — LEDGER 67.
→ *THE HANDS chapter's level dates* (C31).

**D15 · The game's own dates.** The machine gained its FOLD button and the game its files on 2026-10-17 (day 9421, STORE); the
tablet stands at 2306 entries. — `machine/cascade_machine_v4.html` line 646; `data.js`.
→ *The first chapter's epigraph.*

---

### Five to put in first
1. B2/B3 the three doors with their spines as THE DOORS' levels (already a mode; the spines give it chapters).
2. B7 the mirror chain of ten as chapter "THE MIRROR" (ten targets, the line closing at 87).
3. B17 the 6 ↔ 9 FLIP as a seventh, conditional move (crosses Γ's sides; one coincidence with Γ at 36 → 39).
4. D2/D3 gold days and tablet days as the calendar's festivals (computed, six and three dates in 2026–2027).
5. A7 the five stars of the norm as the sky's fixed constellations and C18 the just intervals as the op sounds.
