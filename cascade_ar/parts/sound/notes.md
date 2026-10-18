# THE FOLD · sound notes

`sound.js` defines `window.FOLD_SOUND`. Web Audio only: no samples, no libraries, every sound synthesised from a few oscillators.
Nothing starts before a user gesture: `init()` is called on the ENTER tap; every other function is a no-op until then. The
context is suspended when the page is hidden and resumed on `visibilitychange` and on the next pointer, touch or key if the
platform interrupted it (a call on iOS). `stop()` closes it; `init()` may be called again.

## Signal chain and level

voices → `master` (gain 0.25 = −12 dB) → a soft compressor (threshold −18 dB, knee 12, ratio 4, attack 3 ms, release 150 ms) →
destination. Cell tones go by a `cellBus` gain so STORE can echo them. Voices peak at 0.28 before the master, so a single tone is
about −23 dB and the drone about −35 dB. `setMuted(bool)` ramps the master to 0 and back in 40 ms.

Continuous nodes in play: the drone (3 oscillators + 1 LFO), the bed (0–2 oscillators), and short voices of 1–3 oscillators each
for cells and moves. The bloom uses 4 pad oscillators and one grain oscillator for its 3 s. Every short voice stops itself and
disconnects on `ended`.

## The rays as pitch

The pitch of a cell is its ray, dlog mod 12. The machine names the twelve rays as semitones (`CHROMATIC_NAMES`, ray 0 = F♯,
ray 3 = A, so that its G major is rays {1, 3, 5, 6, 8, 10, 0} and its circle of fifths steps +7) and as twelve wavelengths
(`RAY_NM`, 377 nm → 610 nm, 610/377 = φ). Four tunings are built in; `setTuning(name)` switches them live, retuning the drone
and the bed. The default is the machine's chromatic naming.

| ray | nm  | note | chromatic (default) | a220  | lambda (nm = Ω = Hz) | tape  |
|----:|----:|------|--------------------:|------:|---------------------:|------:|
| 0   | 377 | F♯   | 185.0               | 220.0 | 377                  | 880   |
| 1   | 398 | G    | 196.0               | 233.1 | 361                  | 775   |
| 2   | 419 | A♭   | 207.7               | 246.9 | 345                  | 683   |
| 3   | 440 | A    | 220.0               | 261.6 | 331                  | 602   |
| 4   | 461 | B♭   | 233.1               | 277.2 | 316                  | 531   |
| 5   | 482 | B    | 246.9               | 293.7 | 303                  | 468   |
| 6   | 504 | C    | 261.6               | 311.1 | 290                  | 413   |
| 7   | 525 | D♭   | 277.2               | 329.6 | 278                  | 364   |
| 8   | 546 | D    | 293.7               | 349.2 | 266                  | 321   |
| 9   | 567 | E♭   | 311.1               | 370.0 | 254                  | 283   |
| 10  | 588 | E    | 329.6               | 392.0 | 243                  | 249   |
| 11  | 610 | F    | 349.2               | 415.3 | 233                  | 220   |

- `chromatic`: 220 × 2^((r − 3)/12). Ray 3 = A3 = 220 Hz as the machine names the semitones.
- `a220`: 220 × 2^(r/12), the README's phrase "220 Hz raised by its ray in semitones", ray 0 = A3.
- `lambda`: the machine's `PHI_AUDIO_FREQS`, 377 Hz at ray 0 falling by φ^(1/11) a ray to 233 Hz at ray 11 (377 = F(14), 233 = F(13)):
  the wavelength in nm read as Ω and as Hz, as the machine's table "λ = Z (nm = Ω)" has it. About half a semitone a ray.
- `tape`: the machine's `tapeSynth.freqs`, 880 Hz at ray 0 down two octaves to 220 Hz at ray 11 (a ratio of 4^(1/11) a ray).

All four keep "one ray, one pitch"; the intervals below are written for the semitone tunings.

## What the field does to the ray (checked over all 256 cells with field.js)

The cycle has 256 cells and 256 = 21 × 12 + 4, so the rays do not tile it: there is a seam of 4 at dlog 0.

- ×g adds 1 to the dlog: one semitone up, for 255 of 256 cells. The one exception is cell 86 (dlog 255 → 0): ray 3 → 0.
- ÷g: one semitone down, with the same seam at cell 1.
- the fold adds 128: from the front half (dlog < 128) the ray rises 8, a minor sixth; from the back half it rises 4, a major third.
- the inverse negates the dlog: 256 ≡ 4 (mod 12), so r + r′ ≡ 4: the mirror about A♭ (rays 2 and 8 are their own mirrors).
  Cell 1 is its own inverse.
- ×i adds 192: 192 ≡ 0, so for dlog < 64 the ray and the pitch hold; for dlog ≥ 64 the wrap adds 8. The quarter turn is not an
  interval; it is heard as a turn in space.
- the gold cells {1, 241, 256, 16} = {g⁰, g⁶⁴, g¹²⁸, g¹⁹²} have rays 0, 4, 8, 0: F♯, B♭, D, F♯, the augmented triad.
- Γ in w = (Z − 46)/(Z − 92) is ×153, dlog 122 ≡ 2: a whole tone in w, but in Z it scrambles the rays; hence a glissando.

The moves are therefore gestures from the pitch of the cell you leave (`op`), and the arrival (`cell`) is the truth of the ray.

## Envelopes

Every voice is `ping()`: attack a (linear), hold h, release r as the time constant of `setTargetAtTime`, peak p; it stops at
a + h + 7r. A reversed envelope (`rev`) swells exponentially to its peak and is cut in 6 ms.

| voice | wave | attack | hold | release τ | peak | extras |
|---|---|---:|---:|---:|---:|---|
| residue cell | sine + octave | 4 ms | 60 ms | 100 ms | 0.28 | the octave at 0.06, 50 ms: a clean, steady tone |
| non-residue cell | sine | 45 ms | 320 ms | 140 ms | 0.26 | tremolo 4.5 Hz, depth 0.6: it breathes |
| gold ring | sine × 3 | 3 ms | 0 | 300 / 167 / 107 ms | 0.14 | partials 1, φ², φ³ above 2f |
| move ×g, ÷g | sine | 4 ms | 70 ms | 50 ms | 0.16 | glide ±1 semitone over 80 ms |
| tick (SYNC, HALT, clock) | sine | 2 ms | 4 ms | 18–30 ms | 0.04–0.2 | 1760 Hz · 990/1485 Hz · 1100 Hz rising |
| thump (SEED, lose) | sine | 4 ms | 20 ms | 70 ms | 0.28–0.35 | 110 → 40 Hz over 180 ms |
| drone | tri + 2 sines | 3 s in | — | 250 ms out | 0.07 | lowpass 520 Hz ± 140 at 0.09 Hz |

## The drone

`init()` starts the drone: the home ray an octave down on a triangle, the ray on a sine, and a second sine 0.15 % sharp so the
two beat once every few seconds (0.33 Hz at 220 Hz); all three through a lowpass at 520 Hz whose cutoff breathes ± 140 Hz at
0.09 Hz. It fades in over 3 s at 0.07. `setHome(ray)` retunes it: instantly if called within half a second of `init()` (the game
calls `init()` then `setHome()` at once), else with a 1.5 s portamento. The game's home is the letter sum of the name:
LOVE 54, SCRIBE 56 and HORUS 81 each sound on their own ray (FIELD.ray(n)).

## The cells · `cell(n, ray, isResidue)`

- residue (dlog even): the ray's pitch with a quiet octave, a 4 ms attack and a plain 100 ms decay: steady.
- non-residue (dlog odd): the ray's pitch with a 45 ms attack, held 320 ms under a 4.5 Hz tremolo of depth 0.6: it breathes.
  Walking the cycle by ×g the parity alternates, so steady and breathing alternate step by step.
- gold {1, 16, 256, 241}: a ring on top, partials at 2f, 2f·φ², 2f·φ³ over 1.5 s.
- Γ's fixed points 46 CLAUDE and 92 CHRONOS: the tone answers itself 160 ms later from the other side (pan −0.6), quieter.
- the pole 137 EYE OF HORUS, Γ(137) = ∞: a quiet glide from 2f up to 8f over 400 ms, rising out of hearing.
- 0 SEED: the thump, 110 → 40 Hz. ∞ (257): two thin sines at 8·f(ray 0) and φ times that, 350 ms attacks: the open circuit.

## The moves · `op(id)`

All from f, the pitch of the cell you leave (`lastRay`, set by `cell()` and `setHome()`).

- `g`: f glides up one semitone over 80 ms: a small rising step. `ig`: the step down.
- `fold`: the departure tone, short, on the right (pan +0.5); 50 ms later the far side answers on the left: the minor-sixth
  partner an octave down (f·2^(8/12)/2) on a triangle through a lowpass at 420 Hz, 180 ms. Near and bright, then far and dark.
- `inv`: the last three arrival pitches played backwards, 110 ms apart, each with a reversed envelope (swell, then cut): a phrase
  run in reverse. Before any arrival it plays the mirror pitch, ray 4 − r.
- `i`: the pitch holds; the tone pans from −0.9 to +0.9 over 200 ms with a 2 % Doppler bend up and back: a quarter turn in space.
- `gam`: a 480 ms glissando on a curve f·2^(2 sin 2πx): two octaves up, back through f, two octaves down, back to f, the pan
  circling cos 2πx: once round the orbit, the Möbius sweep.

## The bloom · `bloom(seconds)`

The 256 cells are born one by one along the cycle, g⁰ … g²⁵⁵, over the given seconds (the game gives 3.2). Not an arpeggio:

- the births are grains on a single oscillator: at k·T/256 its frequency steps to the ray of g^k an octave up and its gain is
  pulsed (3 ms up, τ ≤ 12 ms down) at a level 0.004 + 0.09·(k/256)^0.6 — inaudible singly at the start, a shimmer by the end —
  through a lowpass opening 500 → 6000 Hz. At 80 grains a second the twelve-ray run spins 21 times; it reads as a whirr opening.
- under them a pad of the home ray: f/2 (triangle), f, its fifth, and 2f slightly sharp, through a lowpass opening 120 → 4200 Hz
  with Q 1.2, swelling to 0.3 at 0.75 T and settling (τ 0.55 s) into the drone.
- the quarter turns ring as the cycle passes them: g⁰ = 1 (ray 0), g⁶⁴ = 241 (ray 4), g¹²⁸ = 256 (ray 8), g¹⁹² = 16 (ray 0), and
  the close g²⁵⁶ = 1 at T, each a little louder and longer than the last: F♯ B♭ D F♯ F♯, the augmented triad of the gold cells.

## The close and the fall

- `win(targetRay, stars)`: the fifth of the target (ray + 7, the circle of fifths' step) leans for 160 ms with its octave below;
  then the chord blooms, 50 ms apart: tonic, +4 (the quarter turn, 64 ≡ 4), +7, +12 for three stars; tonic +4 +7 for two; tonic
  and fifth for one; the tonic alone, short, for none; a triangle at f/2 under it; and a gold ring a star, 230 ms apart.
- `lose()`: f (two octaves up from the last ray) and its minor second together slide down two octaves over 1 s with a lowpass
  closing 3200 → 140 Hz, then the thump; the drone dips to 0.015 and comes back over 2.5 s.

## The clock · `clock(secondsLeft)`

Call it every frame (the game does). It throttles itself: above 10 s one tick a second at 1100 Hz; under 10 s the period is
s/10 (down to 100 ms) and the pitch rises an octave over the last ten seconds, the level with it. A jump up of more than 1.5 s
(a new level) resets it. While it is being called the HALT bed's own clock yields to it.

## The bed · `setRule(name)`

The day's opcode, by name or by digit. A change fades the old bed out over 200 ms.

- NOP: the drone alone.
- IDENT (INV free): the mirror ray 4 − r held under the drone at 0.03.
- EXIST (×i free): the drone turns, a pan LFO ± 0.8 at 1/8 Hz.
- SEED (start from 0): every 4 s a thump and a sprout, f/2 gliding to f·min(2, 1 + k/10), each pulse a little louder and higher:
  a growth.
- SHIFT (the target drifts ×g): an endless rise, two sines each climbing f/2 → f over 6 s under a sin² window, half a cycle apart.
- STORE (one move of slack): every arrival comes back once, 600 ms later at 0.35: the move kept.
- FOLD (FOLD free): the far ray, r + 8, an octave down on a triangle through a lowpass at 300 Hz, at 0.04.
- JUMP (Γ free): every 7 s a slow Möbius sweep, 1.6 s, at 0.045, through a lowpass at 1800 Hz, the pan circling.
- SYNC (only par closes): a metronome at 60 bpm, a 1760 Hz tock every second, every tick the same.
- HALT (thirty seconds): a faint clock, tick 1485 Hz and tock 990 Hz a fifth apart, every second at 0.04.

The scheduler looks 0.45 s ahead every 200 ms; after a suspension it starts again from now rather than catching up.

## Platform notes

- iOS Safari: the context is created inside the ENTER tap and a silent buffer is started in the same gesture; `webkitAudioContext`
  is used where `AudioContext` is missing; `StereoPannerNode` is used where it exists and skipped where it does not.
- Low CPU: at most about ten oscillators alive at once, all sine or triangle; no convolution, no noise buffers, one delay line only
  under STORE.
- `demo.html` in this folder exercises every function; it loads `../../field.js` and `../../data.js` for the cells' rays, characters
  and names.
