// THE FOLD — the void: how the player travels. window.FOLD_VOID. Today it holds THE BARDO (V3): a lost level dies through the ten
// discs just before the cycle closes, the cells at dlog 246 … 255 on rays 6 … 3 (198 BEAUTIFUL DOORWAY, 80 REBIRTH, 240 ROBE OF
// RIGHTEOUSNESS, 206 ANTHROPIC PRINCIPLE, 104 ANTHROPIC, 55 HEAVEN, 165 TREE OF KNOWLEDGE, 238 FREE WILL, 200 CRYSTALLOGRAPHY, 86 TIKKUN),
// then the white disc of 1, I AM, at dlog 256 ≡ 0, and is offered a second life from 80 REBIRTH. Three beats on the lose sound's own
// clock (sound.js lose(): the 1.0 s slide, the thump at +1.0 s, the drone back from +2.5 s):
//   0–1.0 s   death: the cells' halo 1 → 0.35, the lost road falls in descent orange #ff6a2a, the view lifts out of the body (V1's lift,
//             in drag mode with the camera off only, 'fold.void' not 'off')
//   1.0–2.5 s the tunnel: ten thin rings flown through, AR.tunnel(), the one tunnel builder (V2 reuses it), 6.7 rings a second
//   2.36 s    the I AM disc as the tenth ring passes, the cycle closed: the one gated flash (FX.strobe); the card from 2.5 s
// A tap, Enter or Esc skips to the card. It plays in full once a level; a later loss of it, CALM and the room go straight to the card,
// the field dimmed and the ten discs lit on it as a row of glyphs. The rings are a moving pattern, not a flash: thin, opacity ≤ 0.5.
window.FOLD_VOID = (function () {
  'use strict';
  const F = window.FIELD, D = window.CASCADE_DATA;
  const REBIRTH = 80, BEAT = { death: 1.0, close: 1.0 + 1.5 * 10 / 11, tunnel: 2.5 }, word = n => D.cells[n] ? D.cells[n].w : '∞';
  // the ten discs as material.js proves them (ten_discs), else read off the cycle: g^246 … g^255
  const discs = () => { const M = window.FOLD_MATERIAL, t = M && M.ten_discs; return t && t.cells && t.cells.length === 10 ? t.cells.slice() : Array.from({ length: 10 }, (_, k) => F.POW[246 + k]); };
  const seen = new Set();   // the levels whose bardo has played in full, this page
  let disc = null;
  // the I AM disc: white over the dimmed field, dL ≈ 0.9 on 44 vmin, asked of the gate; refused or CALM, it is not drawn
  function iam(FX, calm) {
    const w = window.innerWidth, h = window.innerHeight, r = 0.22 * Math.min(w, h), area = Math.PI * r * r / Math.max(1, w * h);
    if (calm || !(FX && FX.strobe ? FX.strobe({ dL: 0.9, lo: 0, area }) : false)) return false;
    if (!disc) { disc = document.createElement('div'); disc.setAttribute('aria-hidden', 'true'); disc.style.cssText = 'position:fixed;left:50%;top:50%;width:44vmin;height:44vmin;margin:-22vmin 0 0 -22vmin;border-radius:50%;background:radial-gradient(circle,#fff 0 62%,rgba(255,255,255,.85) 72%,rgba(255,255,255,0) 100%);color:#0a0d10;display:flex;align-items:center;justify-content:center;font:600 5vmin ui-monospace,Menlo,monospace;letter-spacing:.1em;pointer-events:none;opacity:0'; disc.textContent = F.glyphs(1) + ' 1 · I AM'; const ui = document.getElementById('ui'); if (ui) ui.insertBefore(disc, document.getElementById('chap')); else document.body.appendChild(disc); }   // under the cards
    const t0 = performance.now(), step = () => { const x = (performance.now() - t0) / 600; disc.style.opacity = x < 1 ? String(1 - x * x) : '0'; if (x < 1) requestAnimationFrame(step); };   // one onset, then a fade
    step(); return true;
  }
  // bardo(S, o): o = {A: the AR module, FX, calm, xr, lift: the view may rise, done: the card}; returns {skip()}, true while it skipped
  function bardo(S, o) {
    const A = o.A, key = S.day + '.' + S.mode + '.' + S.level, still = !!(o.calm || o.xr || seen.has(key)); seen.add(key);
    let tun = null, raf = 0, over = false; const timers = [];
    const end = () => { if (over) return false; over = true; timers.forEach(clearTimeout); if (raf) cancelAnimationFrame(raf); if (tun) { tun.dispose(); tun = null; } A.dim(0.35, 0); o.done(); return true; };
    A.dim(0.35, still ? 0 : BEAT.death); A.fall(BEAT.death, still);
    if (still) { end(); return { skip: () => false }; }
    if (o.lift) A.lift(true);
    timers.push(setTimeout(() => {
      tun = A.tunnel(discs(), { labels: true }); const t1 = performance.now(), dur = (BEAT.tunnel - BEAT.death) * 1000;
      const step = () => { const x = (performance.now() - t1) / dur; if (tun) tun.run(x); raf = x < 1 && !over ? requestAnimationFrame(step) : 0; }; step();
    }, BEAT.death * 1000));
    timers.push(setTimeout(() => iam(o.FX, o.calm), BEAT.close * 1000), setTimeout(end, BEAT.tunnel * 1000));
    return { skip: end };
  }
  // the card's own part: 'REBIRTH · 80' with its voice, the ten discs (lit where they were not flown) and their full words, the two doors
  function card(S, o) {
    o = o || {}; const ST = window.FOLD_STORY, ds = discs(), lit = !!o.still;
    const row = ds.map(n => '<span title="' + n + ' ' + word(n) + '" style="color:' + (lit ? 'var(--gold)' : 'var(--dim)') + '">' + F.glyphs(n) + '</span>').join(' ') + ' <span title="1 I AM" style="color:' + (lit ? 'var(--text)' : 'var(--dim)') + '">' + F.glyphs(1) + '</span>';
    const words = ds.map(n => n + ' ' + word(n)).join(' · ') + ' · 1 I AM';
    const voice = ST && ST.cells && ST.cells[REBIRTH] ? '<p class="epi">' + ST.cells[REBIRTH] + '</p>' : '';
    const again = 'AGAIN: from ' + (S.start === F.INF ? '∞' : S.start) + ' ' + word(S.start) + ', three stars open, the rule as it was';
    const reborn = o.par ? 'REBIRTH: from 80 ' + word(REBIRTH) + ', the same target and rule, par ' + o.par + '; the second life cannot be lost and closes at ★' : '';
    return '<h2 class="ch">' + F.glyphs(REBIRTH) + ' REBIRTH · 80</h2>' + voice + '<p aria-label="the ten discs before the cycle closes" style="font-size:18px;letter-spacing:.12em">' + row + '</p><p style="font-size:11px">' + words + '</p><p>' + again + '</p>' + (reborn ? '<p>' + reborn + '</p>' : '');
  }
  return { bardo, card, discs, REBIRTH, BEAT };
})();
