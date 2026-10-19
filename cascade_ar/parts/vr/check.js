// THE FOLD — parts/vr/check.js: the VR module's arithmetic under node, no three, no headset. The thumbstick's sectors, the word wrap, the
// console's button layout and its hit test, the cell pick by angle against ar.js's placement rule. Run: node check.js
'use strict';
const path = require('path');
global.window = {};   // node 21+ has a navigator of its own, with no xr: supported() resolves false under it
require(path.join(__dirname, 'vr.js'));
const VR = window.FOLD_VR;
let fails = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fails++; console.log('FAIL', m); } };
// the radial menu: dead zone under 0.8; ×g right, ÷g left, FOLD upper right, Γ lower right, INV lower left, ×i upper left; the
// boundaries at the top and bottom fall to the sectors beside them
ok(VR.radial(0, 0) === null && VR.radial(0.5, 0.5) === null && VR.radial(0.79, 0) === null, 'the dead zone');
ok(VR.radial(1, 0) === 'g' && VR.radial(-1, 0) === 'ig', '×g right, ÷g left');
ok(VR.radial(0.7, -0.7) === 'fold' && VR.radial(0.7, 0.7) === 'gam' && VR.radial(-0.7, 0.7) === 'inv' && VR.radial(-0.7, -0.7) === 'i', 'the four diagonals');
ok(VR.radial(0.01, -1) === 'fold' && VR.radial(-0.01, -1) === 'i' && VR.radial(0.01, 1) === 'gam' && VR.radial(-0.01, 1) === 'inv', 'the top and bottom seams');
{ const seen = new Set(); for (let a = 0; a < 360; a += 5) seen.add(VR.radial(Math.sin(a * Math.PI / 180), -Math.cos(a * Math.PI / 180))); ok(seen.size === 6 && [...seen].every(s => VR.SECTORS.includes(s)), 'every sector reached, no other'); }
// the wrap, with a fake context that measures 10 px a character
{ const ctx = { measureText: t => ({ width: t.length * 10 }) };
  ok(VR.wrap(ctx, 'the field stood round the player', 120).join('|') === 'the field|stood round|the player', 'wrapped at 12 characters: ' + VR.wrap(ctx, 'the field stood round the player', 120).join('|'));
  ok(VR.wrap(ctx, 'a\nb', 100).length === 2 && VR.wrap(ctx, '', 100).length === 1, 'paragraphs and the empty line');
  ok(VR.wrap(ctx, 'supercalifragilistic', 50).length === 1, 'a word longer than the width stands alone'); }
// the layout: 14 buttons in 8 columns make two rows; rectangles inside the strip, none overlapping, every one hit at its centre, the
// gaps hit nothing
{ const bs = Array.from({ length: 14 }, (_, i) => ({ id: 'b' + i, label: String(i) })), L = VR.layout(bs, 1024, 512, { cols: 8, y0: 322, y1: 506, gap: 8 });
  ok(L.rects.length === 14, '14 rectangles'); ok(L.rects.every(r => r.x >= 8 && r.x + r.w <= 1024 && r.y >= 322 && r.y + r.h <= 506), 'inside the strip');
  let overlap = false; for (const a of L.rects) for (const b of L.rects) if (a !== b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) overlap = true; ok(!overlap, 'no overlap');
  ok(L.rects.every(r => L.hit(r.x + r.w / 2, r.y + r.h / 2) === r.b), 'each hit at its centre'); ok(L.hit(4, 400) === null && L.hit(500, 300) === null, 'the gaps and the HUD above hit nothing');
  const rows = new Set(L.rects.map(r => r.y)); ok(rows.size === 2, 'two rows');
  const S = VR.layout([{ id: 'a', label: 'A', span: 2 }, { id: 'b', label: 'B' }], 300, 100, { cols: 3, y0: 0, y1: 100, gap: 0 }); ok(Math.abs(S.rects[0].w - 200) < 1e-9 && Math.abs(S.rects[1].x - 200) < 1e-9, 'a span of two'); }
// the cell pick: ar.js's placement (azimuth 2π·dlog/256, the band by ray), a tiny vector class; the ray at a cell finds it, one 2° off
// still finds it, one 5° off finds nothing, and from a controller a hand's width from the head the answer holds
{ class V3 { constructor(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; } copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; } sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; } length() { return Math.hypot(this.x, this.y, this.z); } dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; } norm() { const l = this.length(); this.x /= l; this.y /= l; this.z /= l; return this; } }
  const P = 257, DLOG = new Array(P).fill(-1); { let a = 1; for (let k = 0; k < 256; k++) { DLOG[a] = k; a = a * 3 % P; } }
  const place = n => { if (n === 0) return new V3(0, -2.4, 0); if (n === 257) return new V3(0, 6, 0); const d = DLOG[n], az = d / 256 * Math.PI * 2, el = (-34 + (d % 12) * (92 / 11)) * Math.PI / 180; return new V3(Math.sin(az) * Math.cos(el) * 6, Math.sin(el) * 6, -Math.cos(az) * Math.cos(el) * 6); };
  const F = { INF: 257 }, origin = new V3(0, 0, 0), hand = new V3(0.15, -0.3, -0.2);
  let exact = 0, near = 0, far = 0, fromHand = 0;
  for (let n = 1; n <= 256; n += 5) { const d = new V3().copy(place(n)).norm(); if (VR.pickCell(origin, d, F, place, new V3()) === n) exact++;
    // turned by a about an axis perpendicular to the ray (the horizontal one), so the angle moved is a itself at every elevation
    const rot = a => { const px = -d.z, pz = d.x, pl = Math.hypot(px, pz) || 1, c = Math.cos(a), s = Math.sin(a); return new V3(d.x * c + px / pl * s, d.y * c, d.z * c + pz / pl * s).norm(); };
    if (VR.pickCell(origin, rot(2 * Math.PI / 180), F, place, new V3()) === n) near++; if (VR.pickCell(origin, rot(5 * Math.PI / 180), F, place, new V3()) !== n) far++;
    const h = new V3().copy(place(n)).sub(hand).norm(); if (VR.pickCell(hand, h, F, place, new V3()) === n) fromHand++; }
  ok(exact === 52 && fromHand === 52, 'the ray at a cell finds it: ' + exact + ' of 52, from the hand ' + fromHand);
  ok(near >= 50, '2° off still finds it: ' + near + ' of 52'); ok(far >= 50, '5° off finds another or nothing: ' + far + ' of 52');
  ok(VR.pickCell(origin, new V3(0, 1, 0), F, place, new V3()) === 257 && VR.pickCell(origin, new V3(0, -1, 0), F, place, new V3()) === 0, '∞ at the zenith, SEED at the nadir'); }
console.log('OK · ' + checks + ' checks, ' + (fails ? fails + ' failed' : 'none failed') + ' · the stick\'s six sectors, the wrap, the console\'s rows, the pick at 3.5°');
process.exit(fails ? 1 : 0);
