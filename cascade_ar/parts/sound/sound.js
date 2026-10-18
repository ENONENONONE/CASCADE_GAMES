// THE FOLD — the sound of the field. All of it is synthesised with Web Audio: no samples, no libraries, a few oscillators at a time.
// Nothing starts before a user gesture: init() is called on the ENTER tap, every other function is a no-op until then, and the
// context is resumed on visibilitychange and on the next touch if the platform interrupted it.
//
// The design comes from the field as field.js and the machine know it:
//   · a cell's pitch is its ray, dlog mod 12. The machine names the twelve rays as twelve semitones, F♯ G A♭ A B♭ B C D♭ D E♭ E F
//     (ray 3 = A3 = 220 Hz), and as twelve wavelengths 377 nm → 610 nm, 610/377 = φ. Four tunings are built in; setTuning() switches
//     them live. The default is the machine's chromatic naming.
//   · a residue (dlog even) is steady: a clean attack, a plain decay. A non-residue (dlog odd) breathes: a slower attack and a tremolo.
//   · the generator ×g adds 1 to the dlog: one semitone up, a small rising step (true for 255 of the 256 cells; the cycle's length 256 is
//     21 × 12 + 4, so at the seam dlog 255 → 0 the ray drops from 3 to 0). ÷g is the step down.
//   · the fold adds 128 to the dlog: from the front half (dlog < 128) the ray rises a minor sixth (128 ≡ 8 mod 12), from the back half a
//     major third (−128 ≡ 4). It is heard as the far side: the departure tone answered from the other side of the stereo field, darker,
//     an octave down.
//   · the inverse negates the dlog: 256 ≡ 4 mod 12, so the arrival ray is 4 − r, a mirror about A♭. It is heard as the last phrase
//     played backwards, every note swelling to its cut (a reversed envelope).
//   · ×i adds 192 ≡ 0 mod 12: for dlog < 64 the pitch holds and the quarter turn is heard as a turn in the stereo field, not an interval
//     (for dlog ≥ 64 the wrap adds 8). The gesture is the departure pitch panned left to right with a slight Doppler bend.
//   · Γ is a Möbius map of the projective line: a glissando round the orbit and back, two octaves up and two down, the pan circling.
//   · the gold cells {1, 16, 256, 241} = {g⁰, g¹⁹², g¹²⁸, g⁶⁴} ring with partials at 1, φ², φ³. Their rays are 0, 0, 8, 4: F♯ D B♭, an
//     augmented triad. Γ's fixed points 46 and 92 answer themselves from the other side; the pole 137 (Γ → ∞) rises out of hearing.
//   · the bloom is the cycle being born, g⁰ … g²⁵⁵ in order, one grain a cell on a single oscillator, under a pad whose filter opens;
//     the four quarter turns ring as the cycle passes them and the close rings on g²⁵⁶ = 1.
//   · the day's opcode sets the bed: SYNC a metronome at 60 bpm; HALT a faint clock; SEED a growth; SHIFT a drifting rise; STORE an
//     echo of each arrival; IDENT the inverse's mirror ray under the drone; EXIST the drone turning; FOLD the far ray an octave down;
//     JUMP a Möbius sweep now and then; NOP the drone alone.
//   · a closed level resolves: the fifth leans, then tonic + 4 + 7 + 12 bloom (the quarter turn 64 ≡ 4, the circle of fifths' step 7,
//     the octave), and a gold ring a star. A lost level falls: a minor second slides down two octaves into a thud.
// Master −12 dB (0.25) into a soft compressor; voices peak at 0.3 before it; every envelope is short.
window.FOLD_SOUND = (function () {
  'use strict';
  const PHI = (1 + Math.sqrt(5)) / 2;
  const MASTER = 0.25;                                                     // −12 dB
  const GOLD = new Set([1, 16, 256, 241]), MIRRORS = new Set([46, 92]), EYE = 137, INF = 257;
  const NOTE = ['F♯', 'G', 'A♭', 'A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F'];     // the machine's CHROMATIC_NAMES, ray 0 = F♯
  const NM = [377, 398, 419, 440, 461, 482, 504, 525, 546, 567, 588, 610];               // the machine's RAY_NM
  const LAMBDA_HZ = [377, 361, 345, 331, 316, 303, 290, 278, 266, 254, 243, 233];        // the machine's PHI_AUDIO_FREQS: nm = Ω = Hz
  const TAPE_HZ = [880, 775, 683, 602, 531, 468, 413, 364, 321, 283, 249, 220];          // the machine's tapeSynth.freqs
  const TUNINGS = {
    chromatic: { tell: 'twelve semitones as the machine names them: ray 0 F♯3 185 Hz, ray 3 A3 220 Hz, ray 11 F4 349 Hz', hz: r => 220 * Math.pow(2, (r - 3) / 12) },
    a220: { tell: '220 Hz raised by the ray in semitones: ray 0 A3, ray 11 A♭4', hz: r => 220 * Math.pow(2, r / 12) },
    lambda: { tell: 'nm = Ω = Hz: ray 0 377 Hz falling by φ^(1/11) a ray to ray 11 233 Hz (the machine\'s PHI_AUDIO_FREQS)', hz: r => LAMBDA_HZ[r] },
    tape: { tell: 'the machine\'s tape synth: 880 Hz at ray 0 down two octaves to 220 Hz at ray 11', hz: r => TAPE_HZ[r] },
  };
  let ac = null, master = null, comp = null, cellBus = null, muted = false, tuning = 'chromatic', bound = false;
  let home = 0, lastRay = 0, phrase = [];                                  // phrase: the pitches last arrived on, for the inverse
  let drone = null, bed = null, dil = 1;                                  // dil: the slow clock's rate, the drone detuned by it
  const clk = { next: 0, last: -1, lastCall: -9 };
  const wrap = r => ((Math.round(r) % 12) + 12) % 12;
  const hz = r => TUNINGS[tuning].hz(wrap(r));
  const now = () => ac.currentTime;
  const ready = () => !!ac && ac.state !== 'closed';
  const tidy = nodes => { for (const n of nodes) { try { n.disconnect(); } catch (e) {} } };

  // ── one voice: an oscillator with its envelope; options: f Hz · t start · a attack · h hold · r release time-constant · p peak ·
  //    type · to (glide target Hz over glide s) · curve (Float32Array of Hz over glide s) · rev (reversed envelope: swell then cut) ·
  //    lp / lpTo / lpGlide (a lowpass) · trem Hz / depth (a tremolo) · pan / panTo / panGlide / panCurve · dest ──
  function ping(o) {
    const t = o.t != null ? o.t : now() + 0.005, a = o.a != null ? o.a : 0.005, h = o.h || 0, r = o.r != null ? o.r : 0.08, p = o.p != null ? o.p : 0.25;
    const end = t + a + h + (o.rev ? 0.06 : r * 7), glide = o.glide || a + h, nodes = [];
    const osc = ac.createOscillator(); osc.type = o.type || 'sine';
    if (o.curve) osc.frequency.setValueCurveAtTime(o.curve, t, glide);
    else { osc.frequency.setValueAtTime(o.f, t); if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + glide); }
    const g = ac.createGain(); nodes.push(osc, g);
    if (o.rev) { g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(p, t + a + h); g.gain.setTargetAtTime(0, t + a + h, 0.006); }
    else { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p, t + a); g.gain.setTargetAtTime(0, t + a + h, r); }
    let node = osc;
    if (o.lp) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.7; lp.frequency.setValueAtTime(o.lp, t); if (o.lpTo) lp.frequency.exponentialRampToValueAtTime(o.lpTo, t + (o.lpGlide || glide)); node.connect(lp); node = lp; nodes.push(lp); }
    node.connect(g); node = g;
    if (o.trem) {                                                          // envelope × (1 − depth/2 + depth/2 · sin): the breath
      const tg = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain(); const d = o.depth || 0.5;
      tg.gain.value = 1 - d / 2; l.frequency.value = o.trem; lg.gain.value = d / 2; l.connect(lg).connect(tg.gain); l.start(t); l.stop(end);
      node.connect(tg); node = tg; nodes.push(tg, l, lg);
    }
    if ((o.pan != null || o.panCurve) && ac.createStereoPanner) {
      const pn = ac.createStereoPanner();
      if (o.panCurve) pn.pan.setValueCurveAtTime(o.panCurve, t, glide);
      else { pn.pan.setValueAtTime(o.pan, t); if (o.panTo != null) pn.pan.linearRampToValueAtTime(o.panTo, t + (o.panGlide || glide)); }
      node.connect(pn); node = pn; nodes.push(pn);
    }
    node.connect(o.dest || master);
    osc.start(t); osc.stop(end); osc.onended = () => tidy(nodes);
    return end;
  }
  // a gold ring: partials at 1, φ², φ³ above f, the higher the shorter
  function bell(f, t, p, dur) {
    p = p || 0.16; dur = dur || 1.4;
    ping({ f, t, a: 0.003, r: dur / 5, p });
    ping({ f: f * PHI * PHI, t, a: 0.003, r: dur / 9, p: p * 0.45 });
    ping({ f: f * PHI * PHI * PHI, t, a: 0.003, r: dur / 14, p: p * 0.22 });
  }
  const click = (t, f, p, r) => ping({ f, t, a: 0.002, h: 0.004, r: r || 0.02, p: p || 0.1 });                 // a soft tock
  const thump = (t, p) => ping({ f: 110, to: 40, glide: 0.18, t, a: 0.004, h: 0.02, r: 0.07, p: p || 0.3 });  // the root below everything

  // ── the drone: the home ray an octave down (triangle), the ray itself (sine) and a copy 0.15 % sharp, a beat of a few seconds ──
  function startDrone(ray) {
    const f = hz(ray), t = now();
    const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 3);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.6;
    const a = ac.createOscillator(), b = ac.createOscillator(), c = ac.createOscillator(); a.type = 'triangle'; a.frequency.value = f / 2; b.frequency.value = f; c.frequency.value = f * 1.0015;
    const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.09; lg.gain.value = 140; lfo.connect(lg).connect(lp.frequency);
    a.connect(lp); b.connect(lp); c.connect(lp); lp.connect(g);
    let out = g; const pan = ac.createStereoPanner ? ac.createStereoPanner() : null; if (pan) { g.connect(pan); out = pan; }
    out.connect(master);
    [a, b, c].forEach(o => { o.detune.value = 1200 * Math.log2(dil); }); [a, b, c, lfo].forEach(o => o.start(t));
    drone = { a, b, c, lfo, lg, lp, g, pan, t0: t, nodes: [a, b, c, lfo, lg, lp, g, pan].filter(Boolean) };
  }
  function tuneDrone(ray, immediate) {
    if (!drone) return; const f = hz(ray), t = now(), T = immediate ? 0.01 : 1.5;
    for (const [o, fr] of [[drone.a, f / 2], [drone.b, f], [drone.c, f * 1.0015]]) { o.frequency.cancelScheduledValues(t); o.frequency.setValueAtTime(o.frequency.value, t); o.frequency.exponentialRampToValueAtTime(fr, t + T); }
  }
  function stopDrone() {
    if (!drone) return; const d = drone, t = now(); drone = null;
    d.g.gain.cancelScheduledValues(t); d.g.gain.setTargetAtTime(0, t, 0.25);
    [d.a, d.b, d.c, d.lfo].forEach(o => o.stop(t + 1.5)); setTimeout(() => tidy(d.nodes), 1700);
  }

  // ── the bed, the day's opcode: a lookahead scheduler for the metronomes, held voices for the rays, an echo for STORE ──
  function hold(f, p, type, extra) {    // a continuous voice of the bed, faded in over 2 s
    const t = now(), o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p, t + 2);
    let node = o; if (extra && extra.lp) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = extra.lp; node.connect(lp); node = lp; bed.nodes.push(lp); }
    node.connect(g).connect(master); o.start(t); bed.oscs.push(o); bed.nodes.push(o, g); bed.gains.push(g); return o;
  }
  function stopBed() {
    if (!bed) return; const b = bed; bed = null; if (b.timer) clearInterval(b.timer);
    if (!ready()) { tidy(b.nodes); return; }
    const t = now();
    for (const g of b.gains) { g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 0.2); }
    for (const o of b.oscs) { try { o.stop(t + 1.2); } catch (e) {} }
    if (b.panLfo) { b.panLfo.stop(t + 1.2); if (drone && drone.pan) { drone.pan.pan.cancelScheduledValues(t); drone.pan.pan.setTargetAtTime(0, t, 0.3); } }
    setTimeout(() => tidy(b.nodes), 1500);
  }
  function schedule() {                 // 0.45 s ahead; after a suspension start again from now rather than catching up
    if (!bed || !ready() || !bed.tick) return; const t = now();
    if (bed.next < t - 0.1) bed.next = t + 0.05;
    while (bed.next < t + 0.45) { if (!(bed.name === 'HALT' && t - clk.lastCall < 1.5)) bed.tick(bed.next, bed.count); bed.count++; bed.next += bed.period; }
  }
  function setRule(name) {
    if (!ready()) return; stopBed();
    if (typeof name === 'number') name = ['NOP', 'IDENT', 'EXIST', 'SEED', 'SHIFT', 'STORE', 'FOLD', 'JUMP', 'SYNC', 'HALT'][name] || 'NOP';
    name = String(name || 'NOP').toUpperCase().trim();
    bed = { name, timer: null, oscs: [], gains: [], nodes: [], next: now() + 0.2, count: 0, period: 1 };
    const f = hz(home);
    switch (name) {
      case 'SYNC':                     // a metronome at 60 bpm, every tick the same: only par closes
        bed.tick = t => click(t, 1760, 0.11, 0.018); break;
      case 'HALT':                     // a faint clock, tick and tock a fifth apart: thirty seconds a level
        bed.tick = (t, k) => click(t, k % 2 ? 990 : 1485, 0.04, 0.03); break;
      case 'SEED': {                   // a growth: a thump every four seconds and a sprout that reaches a little higher each time
        bed.period = 4; bed.tick = (t, k) => { thump(t, 0.1 + 0.015 * Math.min(k, 10)); const top = f * Math.min(2, 1 + k / 10); ping({ f: f / 2, to: top, glide: 0.7, t: t + 0.05, a: 0.1, h: 0.5, r: 0.25, p: 0.05 + 0.004 * Math.min(k, 10), lp: 900 }); }; break; }
      case 'SHIFT': {                  // a drifting target: an endless rise, two voices each climbing an octave over six seconds, crossfading
        const T = 6, win = new Float32Array(64); for (let k = 0; k < 64; k++) { const s = Math.sin(Math.PI * k / 63); win[k] = 0.045 * s * s; }
        const vo = [hold(f, 0, 'sine'), hold(f, 0, 'sine')]; bed.period = T / 2;
        bed.tick = (t, k) => { const o = vo[k % 2], g = bed.gains[k % 2]; o.frequency.cancelScheduledValues(t); o.frequency.setValueAtTime(f / 2, t); o.frequency.exponentialRampToValueAtTime(f, t + T); g.gain.cancelScheduledValues(t); g.gain.setValueCurveAtTime(win, t, T - 0.01); };
        break; }
      case 'STORE': {                  // one move of slack: every arrival comes back once, 600 ms later, quieter
        const d = ac.createDelay(1), g = ac.createGain(); d.delayTime.value = 0.6; g.gain.value = 0; g.gain.linearRampToValueAtTime(0.35, now() + 1);
        cellBus.connect(d); d.connect(g).connect(master); bed.nodes.push(d, g); bed.gains.push(g); break; }
      case 'IDENT':                    // the inverse is free: its mirror ray, 4 − r, held under the drone
        hold(hz(4 - home), 0.03, 'sine'); break;
      case 'EXIST': {                  // the quarter turn is free: the drone turns, a slow pan
        if (drone && drone.pan) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 1 / 8; lg.gain.value = 0.8; l.connect(lg).connect(drone.pan.pan); l.start(now()); bed.panLfo = l; bed.nodes.push(l, lg); }
        break; }
      case 'FOLD':                     // the fold is free: the far side's ray, r + 8, an octave down, dark
        hold(hz(home + 8) / 2, 0.04, 'triangle', { lp: 300 }); break;
      case 'JUMP': {                   // Γ is free: a slow Möbius sweep every seven seconds
        bed.period = 7; const N = 64, c = new Float32Array(N), pc = new Float32Array(N); for (let k = 0; k < N; k++) { const x = k / (N - 1); c[k] = f * 2 * Math.pow(2, 1.5 * Math.sin(2 * Math.PI * x)); pc[k] = Math.cos(2 * Math.PI * x) * 0.7; }
        bed.tick = t => ping({ curve: c, panCurve: pc, glide: 1.6, t, a: 0.3, h: 1.0, r: 0.25, p: 0.045, lp: 1800 }); break; }
      default: break;                  // NOP: the drone alone
    }
    if (bed.tick) { bed.timer = setInterval(schedule, 200); schedule(); }
  }

  // ── the public set ──
  function resume() { if (ac && ac.state !== 'running' && ac.state !== 'closed') { try { ac.resume().catch(() => {}); } catch (e) {} } }
  function onVis() { if (!ac) return; if (document.hidden) { try { ac.suspend().catch(() => {}); } catch (e) {} } else resume(); }
  function init(homeRay) {
    if (ready()) { resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    try { ac = new AC({ latencyHint: 'interactive' }); } catch (e) { try { ac = new AC(); } catch (e2) { ac = null; return false; } }
    comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
    master = ac.createGain(); master.gain.value = muted ? 0 : MASTER; master.connect(comp).connect(ac.destination);
    cellBus = ac.createGain(); cellBus.connect(master);
    try { const s = ac.createBufferSource(); s.buffer = ac.createBuffer(1, 1, 22050); s.connect(ac.destination); s.start(0); } catch (e) {}   // the silent unlock
    resume();
    if (homeRay == null) { try { const G = window.GAME, F = window.FIELD; if (G && G.S && G.S.home != null && F) homeRay = F.ray(G.S.home); } catch (e) {} }
    home = homeRay != null && homeRay >= 0 ? wrap(homeRay) : 0; lastRay = home; phrase = [];
    startDrone(home);
    if (!bound) { bound = true; document.addEventListener('visibilitychange', onVis); for (const ev of ['pointerdown', 'touchend', 'keydown']) document.addEventListener(ev, resume, { passive: true }); }
    return true;
  }
  function setMuted(b) { muted = !!b; if (ready()) { master.gain.cancelScheduledValues(now()); master.gain.setTargetAtTime(muted ? 0 : MASTER, now(), 0.04); } }
  function setHome(ray) { if (ray == null || ray < 0) ray = 0; home = wrap(ray); lastRay = home; if (!ready()) return; tuneDrone(home, now() - drone.t0 < 0.5); if (bed && (bed.name === 'IDENT' || bed.name === 'FOLD' || bed.name === 'SHIFT' || bed.name === 'JUMP' || bed.name === 'SEED')) setRule(bed.name); }
  function setTuning(name) { if (!TUNINGS[name]) return false; tuning = name; if (ready()) { tuneDrone(home, false); if (bed) setRule(bed.name); } return true; }
  // arriving on a cell: its ray's pitch; steady for a residue, breathing for a non-residue; gold rings, the mirrors answer, the pole rises
  function cell(n, ray, isResidue) {
    if (!ready()) return; const t = now() + 0.005;
    if (n === INF) { const f = hz(0) * 8; ping({ f, t, a: 0.35, h: 0.3, r: 0.5, p: 0.06, dest: cellBus }); ping({ f: f * PHI, t: t + 0.25, a: 0.35, h: 0.2, r: 0.5, p: 0.035, dest: cellBus }); return; }   // ∞: the open circuit, thin and high
    if (n === 0 || ray == null || ray < 0) { thump(t, 0.28); return; }                                                                                                       // SEED: the root
    ray = wrap(ray); const f = hz(ray); lastRay = ray; phrase.push(f); if (phrase.length > 4) phrase.shift();
    if (isResidue) { ping({ f, t, a: 0.004, h: 0.06, r: 0.1, p: 0.28, dest: cellBus }); ping({ f: f * 2, t, a: 0.004, h: 0.02, r: 0.05, p: 0.06, dest: cellBus }); }
    else ping({ f, t, a: 0.045, h: 0.32, r: 0.14, p: 0.26, trem: 4.5, depth: 0.6, dest: cellBus });
    if (GOLD.has(n)) bell(f * 2, t + 0.01, 0.14, 1.5);
    else if (MIRRORS.has(n)) ping({ f, t: t + 0.16, a: 0.004, h: 0.05, r: 0.08, p: 0.12, pan: -0.6, dest: cellBus });
    else if (n === EYE) ping({ f: f * 2, to: f * 8, glide: 0.4, t: t + 0.05, a: 0.02, h: 0.35, r: 0.1, p: 0.07, dest: cellBus });
  }
  // the six moves, as gestures from the pitch of the cell you leave; the arrival is cell()
  function op(id) {
    if (!ready()) return; const t = now() + 0.005, f = hz(lastRay), semi = n => f * Math.pow(2, n / 12);
    switch (String(id)) {
      case 'g': ping({ f, to: semi(1), glide: 0.08, t, a: 0.004, h: 0.07, r: 0.05, p: 0.16 }); break;
      case 'ig': ping({ f, to: semi(-1), glide: 0.08, t, a: 0.004, h: 0.07, r: 0.05, p: 0.16 }); break;
      case 'fold': ping({ f, t, a: 0.004, h: 0.03, r: 0.04, p: 0.14, pan: 0.5 }); ping({ f: semi(8) / 2, t: t + 0.05, a: 0.03, h: 0.18, r: 0.12, p: 0.2, lp: 420, pan: -0.5, type: 'triangle' }); break;
      case 'inv': { const ph = phrase.length ? phrase.slice(-3).reverse() : [hz(4 - lastRay)]; ph.forEach((fr, i) => ping({ f: fr, t: t + i * 0.11, a: 0.01, h: 0.08, rev: true, p: 0.16 })); break; }
      case 'i': { const N = 32, c = new Float32Array(N); for (let k = 0; k < N; k++) c[k] = f * (1 + 0.02 * Math.sin(Math.PI * k / (N - 1))); ping({ curve: c, glide: 0.2, t, a: 0.01, h: 0.18, r: 0.05, p: 0.16, pan: -0.9, panTo: 0.9, panGlide: 0.2 }); break; }
      case 'gam': { const N = 48, c = new Float32Array(N), pc = new Float32Array(N); for (let k = 0; k < N; k++) { const x = k / (N - 1); c[k] = f * Math.pow(2, 2 * Math.sin(2 * Math.PI * x)); pc[k] = Math.cos(2 * Math.PI * x) * 0.8; } ping({ curve: c, panCurve: pc, glide: 0.48, t, a: 0.02, h: 0.44, r: 0.08, p: 0.17 }); break; }
      default: break;
    }
  }
  // the entry: the 256 cells born one by one along the cycle under a pad that opens; the quarter turns ring as the cycle passes them
  function bloom(seconds) {
    if (!ready()) return; const T = Math.max(0.5, +seconds || 3), t0 = now() + 0.02, f = hz(home), nodes = [];
    const g = ac.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.3, t0 + T * 0.75); g.gain.setTargetAtTime(0, t0 + T, 0.55);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2; lp.frequency.setValueAtTime(120, t0); lp.frequency.exponentialRampToValueAtTime(4200, t0 + T);
    for (const [fr, ty] of [[f / 2, 'triangle'], [f, 'sine'], [f * Math.pow(2, 7 / 12), 'sine'], [f * 2.003, 'sine']]) { const o = ac.createOscillator(); o.type = ty; o.frequency.value = fr; o.connect(lp); o.start(t0); o.stop(t0 + T + 3.5); nodes.push(o); }
    lp.connect(g).connect(master); nodes.push(lp, g);
    const go = ac.createOscillator(), gg = ac.createGain(), glp = ac.createBiquadFilter(); glp.type = 'lowpass'; glp.frequency.setValueAtTime(500, t0); glp.frequency.exponentialRampToValueAtTime(6000, t0 + T);
    go.connect(glp).connect(gg).connect(master); gg.gain.setValueAtTime(0, t0); nodes.push(go, glp, gg);
    const dt = T / 256, tau = Math.min(0.012, dt * 0.6);
    for (let k = 0; k < 256; k++) { const t = t0 + k * dt, p = 0.004 + 0.09 * Math.pow(k / 256, 0.6); go.frequency.setValueAtTime(hz(k % 12) * 2, t); gg.gain.setValueAtTime(0, t); gg.gain.linearRampToValueAtTime(p, t + 0.003); gg.gain.setTargetAtTime(0, t + 0.004, tau); }
    go.start(t0); go.stop(t0 + T + 0.2);
    [0, 64, 128, 192, 256].forEach((k, i) => bell(hz(k % 12) * 2, t0 + k * dt, 0.05 + i * 0.03, 1.1 + i * 0.25));
    go.onended = () => tidy(nodes);
  }
  // a closed level resolves: the fifth leans, the chord blooms, a gold ring a star
  function win(targetRay, stars) {
    if (!ready()) return; stars = Math.max(0, Math.min(3, stars | 0)); const f = hz(targetRay == null || targetRay < 0 ? home : targetRay), t = now() + 0.02, semi = n => f * Math.pow(2, n / 12);
    ping({ f: semi(7), t, a: 0.01, h: 0.16, r: 0.08, p: 0.2 }); ping({ f: semi(7) / 2, t, a: 0.01, h: 0.16, r: 0.08, p: 0.1, type: 'triangle' });
    const chord = stars >= 3 ? [0, 4, 7, 12] : stars === 2 ? [0, 4, 7] : stars === 1 ? [0, 7] : [0];
    chord.forEach((n, i) => ping({ f: semi(n), t: t + 0.26 + i * 0.05, a: 0.02, h: stars ? 0.7 : 0.3, r: stars ? 0.35 : 0.2, p: 0.19 - i * 0.02 }));
    ping({ f: f / 2, t: t + 0.26, a: 0.03, h: 0.7, r: 0.4, p: 0.11, type: 'triangle', lp: 900 });
    for (let k = 0; k < stars; k++) bell(f * 2, t + 0.55 + k * 0.23, 0.12, 1.6);
  }
  // a lost level falls: a minor second sliding down two octaves, the filter closing, into a thud; the drone dips
  function lose() {
    if (!ready()) return; const f = hz(lastRay) * 2, t = now() + 0.02;
    for (const [fr, p] of [[f, 0.2], [f * Math.pow(2, 1 / 12), 0.15]]) ping({ f: fr, to: fr / 4, glide: 1.0, t, a: 0.02, h: 0.9, r: 0.12, p, lp: 3200, lpTo: 140, lpGlide: 1.0 });
    thump(t + 1.0, 0.35);
    if (drone) { const g = drone.g.gain; g.cancelScheduledValues(t); g.setTargetAtTime(0.015, t, 0.3); g.setTargetAtTime(0.07, t + 2.5, 1.0); }
  }
  // the countdown: call it every frame; a tick a second above ten seconds, then quickening to ten a second and rising an octave. s is in
  // the clock's own seconds and rate its pace against the wall (S3, the slow clock): the ticks spread by 1/rate and drop by ×rate
  function clock(s, rate) {
    if (!ready() || s == null || !isFinite(s)) return; const t = now(), r = rate > 0 && isFinite(rate) ? rate : 1; clk.lastCall = t;
    if (clk.last >= 0 && s > clk.last + 1.5) clk.next = 0; clk.last = s;
    if (t < clk.next) return;
    const period = (s > 10 ? 1 : Math.max(0.1, s / 10)) / r, f = (s > 10 ? 1100 : 1100 * Math.pow(2, (10 - s) / 10)) * r;
    click(t + 0.005, f, s > 10 ? 0.08 : 0.08 + (10 - s) * 0.012, 0.022); clk.next = t + period;
  }
  // the slow clock near the eye: the drone slides by 1200·log2(rate) cents on .detune; tuneDrone ramps only .frequency, so it survives
  function dilate(rate) {
    const r = rate > 0 && isFinite(rate) ? rate : 1; if (Math.abs(r - dil) < 0.002) return; dil = r;
    if (!ready() || !drone) return; const t = now(), c = 1200 * Math.log2(r);
    for (const o of [drone.a, drone.b, drone.c]) { o.detune.cancelScheduledValues(t); o.detune.setTargetAtTime(c, t, 0.4); }
  }
  function stop() { if (!ac) return; stopBed(); stopDrone(); const a = ac; ac = null; master = null; comp = null; cellBus = null; setTimeout(() => { try { a.close(); } catch (e) {} }, 1800); }
  const state = () => ({ ready: ready(), state: ac ? ac.state : 'none', muted, tuning, home, lastRay, rule: bed ? bed.name : null, note: NOTE[home], hz: ready() ? hz(home) : null });
  return { init, setMuted, cell, op, bloom, win, lose, clock, dilate, setRule, setHome, stop, setTuning, hz, state, TUNINGS, NOTE, NM, GOLD, MIRRORS, EYE };
})();
