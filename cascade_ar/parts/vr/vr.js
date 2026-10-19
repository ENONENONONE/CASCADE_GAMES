// THE FOLD — VR (parts/vr): the field in a headset through WebXR immersive-vr, on SteamVR and Quest browsers. The page's DOM carries
// no HUD in a headset, so the HUD, the six moves, the cards and the two insets stand in the world as canvas-textured quads hung off
// the rig at local-floor height: the console at the belt, lazily following the head's yaw; a card at arm's length when the page shows
// one; the rays and trace insets beside the console. The controllers point: a ray from each, a trigger press (select) taps what it
// points at (a console button, a card button, a cell of the sky), a squeeze is UNDO, and the thumbstick is a radial menu of the six
// moves (×g right, ÷g left, FOLD upper right, Γ lower right, INV lower left, ×i upper left), one move per push past 0.8. Every button
// calls the page's own handler (the DOM button's click), so the rules live in one place. The rig stands 2.4 m down so the world's
// floor, the relief and the heat lie on the real floor; the sky shader gives way to the stars. A flat preview (opts.preview) hangs
// the same objects in front of the screen camera, for a look and a test without a headset.
//
//   FOLD_VR.supported()                      Promise<boolean>: immersive-vr
//   FOLD_VR.mount(THREE, A, host, opts)      → vr {enter, exit, frame(now), presenting, preview(on), console, card, radial, pick, dispose}
//   FOLD_VR.radial(x, y)                     the thumbstick's sector → an op id, or null inside the dead zone
//   FOLD_VR.wrap(ctx, text, width)           word wrap for a canvas
//   FOLD_VR.layout(buttons, w, h, opts)      button rectangles on a console, rows of equal cells; hit(x, y) → a button
//   FOLD_VR.pickCell(origin, dir, F, place)  the cell whose direction from the controller lies within 3.5° of the ray, or null
window.FOLD_VR = (function () {
  'use strict';
  const SECTORS = ['fold', 'g', 'gam', 'inv', 'ig', 'i'];   // clockwise from the top, 60° each, centred at 30°, 90°, … from the top
  const LABEL = { g: '×g', ig: '÷g', fold: 'FOLD', inv: 'INV', i: '×i', gam: 'Γ', flip: '6↔9' };
  const HUE = { g: 140, ig: 170, fold: 40, inv: 200, i: 280, gam: 0, flip: 320 };
  const COL = { ground: '#0a0d10', text: '#e8f3e4', dim: '#8fa796', line: '#2a3a30', green: '#7fe39a', gold: '#c9a84c', blue: '#7fb8ff', climb: '#2f6fb8', fall: '#ff6a2a', keep: '#8fa796', red: '#ff7b7b' };
  const MONO = '"SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';
  // the thumbstick: dead zone 0.8, then the sector of its angle from the top, clockwise
  function radial(x, y) {
    const m = Math.hypot(x, y); if (m < 0.8) return null;
    const a = Math.atan2(x, -y);   // 0 at the top (y up is −1 on a gamepad), clockwise positive
    const k = Math.floor((((a + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 3))) % 6; return SECTORS[k];
  }
  function wrap(ctx, text, width) {
    const out = []; for (const para of String(text || '').split('\n')) { let line = ''; for (const w of para.split(/\s+/)) { if (!w) continue; const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > width && line) { out.push(line); line = w; } else line = t; } out.push(line); }
    return out;
  }
  // buttons laid in rows of `cols` equal cells across a strip of the canvas from y0 to y1; a button {id, label, hue?, on?, span?}
  function layout(buttons, w, h, opts) {
    opts = opts || {}; const cols = opts.cols || 6, y0 = opts.y0 != null ? opts.y0 : h * 0.62, y1 = opts.y1 != null ? opts.y1 : h, gap = opts.gap != null ? opts.gap : 8, rows = [];
    let row = [], used = 0; for (const b of buttons) { const s = b.span || 1; if (used + s > cols) { rows.push(row); row = []; used = 0; } row.push(b); used += s; } if (row.length) rows.push(row);
    const rh = (y1 - y0 - gap) / Math.max(1, rows.length), cw = (w - gap) / cols, rects = [];
    rows.forEach((r, j) => { let c = 0; for (const b of r) { const s = b.span || 1; rects.push({ b, x: gap + c * cw, y: y0 + gap + j * rh, w: cw * s - gap, h: rh - gap }); c += s; } });
    return { rects, hit: (x, y) => { for (const r of rects) if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r.b; return null; } };
  }
  // the cell the ray points at: the smallest angle between the ray and the direction from the controller to the cell's place, under 3.5°
  function pickCell(origin, dir, F, place, out) {
    let best = null, bd = Math.cos(3.5 * Math.PI / 180); const v = out || new (origin.constructor)();
    for (let n = 0; n < 258; n++) { v.copy(place(n)).sub(origin); const l = v.length(); if (l < 1e-6) continue; const c = v.dot(dir) / l; if (c > bd) { bd = c; best = n; } }
    return best;
  }
  const supported = () => navigator.xr && navigator.xr.isSessionSupported ? navigator.xr.isSessionSupported('immersive-vr').catch(() => false) : Promise.resolve(false);
  // ── mount: the objects, the controllers, the loop ──
  // host: {read() → the HUD's strings and the effort segments, buttons() → the console's buttons [{id, label, hue, on, span}], press(id),
  //        card() → {text, buttons: [{id, label}]} or null, pressCard(id), tapCell(n), undo(), place(n), insets: {rays: canvas, trace: canvas},
  //        onEnter(), onExit()}
  function mount(THREE, A, host, opts) {
    opts = opts || {}; const R = A.renderer, rig = A.rig, F = opts.F;
    const V = { presenting: false, preview: false, headY: 0, session: null, group: new THREE.Group(), yaw: 0, stick: [0, 0], radialOp: null, last: '', hits: [null, null] };
    V.group.visible = false; rig.add(V.group);
    // the console: 1024 × 512, 0.9 × 0.45 m; the card 1024 × 1024, 1 m square; each a plane with a CanvasTexture
    const panel = (w, h, pw, ph) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const tex = new THREE.CanvasTexture(cv); tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false; const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.96, depthTest: false, depthWrite: false })); m.renderOrder = 20; m.userData = { cv, tex, g: cv.getContext('2d'), pw, ph }; return m; };
    const con = panel(1024, 512, 0.9, 0.45), card = panel(1024, 1024, 1.0, 1.0), rays = panel(256, 256, 0.22, 0.22), trace = panel(256, 256, 0.22, 0.22);
    V.group.add(con, card, rays, trace); card.visible = false;
    let conLayout = { rects: [], hit: () => null }, cardLayout = { rects: [], hit: () => null }, cardKey = '';
    // the pointer rays: a line a controller, 2 m, and a dot at the hit
    const rayGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -2)]);
    const ctrls = [0, 1].map(i => { let c = null; try { c = R.xr.getController(i); } catch (e) { c = new THREE.Group(); } const line = new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0x7fe39a, transparent: true, opacity: 0.6, depthTest: false })); line.renderOrder = 21; c.add(line); c.userData.line = line; rig.add(c); c.visible = false; return c; });
    const dotGeo = new THREE.SphereGeometry(0.012, 8, 6), dots = [0, 1].map(() => { const d = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false })); d.renderOrder = 22; d.visible = false; rig.add(d); return d; });
    // ── drawing ──
    function drawConsole() {
      const s = host.read(), g = con.userData.g, W = 1024, H = 512; con.userData.tex.needsUpdate = true;
      g.fillStyle = 'rgba(10,13,16,0.92)'; g.fillRect(0, 0, W, H); g.strokeStyle = COL.line; g.lineWidth = 2; g.strokeRect(1, 1, W - 2, H - 2);
      g.textBaseline = 'top'; g.fillStyle = COL.dim; g.font = '20px ' + MONO; g.fillText((s.day || '') + (s.chapter ? '  ·  ' + s.chapter : '') + (s.level ? '  ·  ' + s.level : ''), 24, 18);
      g.fillStyle = COL.green; g.font = 'bold 44px ' + MONO; g.fillText(s.cur || '', 24, 48); g.fillStyle = COL.text; g.font = '22px ' + MONO; g.fillText(s.curWord || '', 24, 98);
      if (s.tgt) { g.fillStyle = COL.gold; g.font = 'bold 30px ' + MONO; g.fillText('→ ' + s.tgt, 24, 134); g.fillStyle = COL.text; g.font = '22px ' + MONO; g.fillText(s.tgtWord || '', 24, 170); g.fillStyle = COL.dim; g.fillText(s.moves || '', 620, 140); }
      if (s.rule) { g.fillStyle = COL.dim; g.font = '20px ' + MONO; g.fillText(wrap(g, s.rule, 960)[0], 24, 204); }
      if (s.clock) { g.fillStyle = COL.red; g.font = 'bold 26px ' + MONO; g.textAlign = 'right'; g.fillText(s.clock, W - 24, 48); g.textAlign = 'left'; }
      // the effort bar (H2): a cell a segment, closer blue and full, kept grey and half, further orange and low, free a tick, burning orange
      const segs = s.segments || []; let x = 620, y = 100; for (const q of segs) { if (q.k === 'free') { g.fillStyle = COL.dim; g.fillRect(x, y, 4, 28); x += 10; continue; } const hgt = q.k === 'keep' ? 14 : q.k === 'down' ? 18 : 28, top = q.k === 'down' ? y + 14 : q.k === 'keep' ? y + 14 : y; g.strokeStyle = q.k === 'up' ? COL.climb : q.k === 'down' ? COL.fall : q.k === 'empty' || q.k === 'two' ? COL.line : COL.keep; g.lineWidth = 2; if (q.k === 'two') g.setLineDash([4, 4]); g.strokeRect(x, top, 20, hgt); g.setLineDash([]); if (q.fill) { g.fillStyle = q.fill; g.fillRect(x + 2, top + 2, 16, hgt - 4); } if (q.burn) { g.strokeStyle = COL.fall; g.strokeRect(x - 2, top - 2, 24, hgt + 4); } x += 26; if (x > W - 40) break; }
      g.fillStyle = COL.text; g.font = 'italic 20px ' + MONO; wrap(g, s.voice || '', 976).slice(0, 2).forEach((l, i) => g.fillText(l, 24, 236 + i * 26));
      if (s.quest) { g.fillStyle = s.questDone ? COL.green : COL.blue; g.font = '20px ' + MONO; g.fillText(wrap(g, s.quest, 976)[0], 24, 292); }
      // the buttons, and the radial menu's live sector drawn as a ring at the right
      const bs = host.buttons(); conLayout = layout(bs, W, H, { cols: 8, y0: 322, y1: H - 6, gap: 8 });
      for (const r of conLayout.rects) { const b = r.b; g.fillStyle = b.on ? 'rgba(127,227,154,0.18)' : 'rgba(255,255,255,0.04)'; g.fillRect(r.x, r.y, r.w, r.h); g.strokeStyle = b.hue != null ? 'hsl(' + b.hue + ' 70% 65%)' : b.on ? COL.green : COL.line; g.lineWidth = b.hue != null ? 3 : 2; g.strokeRect(r.x, r.y, r.w, r.h); if (b.free) { g.strokeStyle = COL.gold; g.strokeRect(r.x + 4, r.y + 4, r.w - 8, r.h - 8); } g.fillStyle = b.hue != null ? 'hsl(' + b.hue + ' 70% 75%)' : COL.text; g.font = (b.hue != null ? 'bold 30px ' : '22px ') + MONO; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(b.label, r.x + r.w / 2, r.y + r.h / 2 - (b.sub ? 10 : 0)); if (b.sub) { g.fillStyle = COL.dim; g.font = '15px ' + MONO; g.fillText(b.sub, r.x + r.w / 2, r.y + r.h / 2 + 16); } g.textAlign = 'left'; g.textBaseline = 'top'; }
      const cx = 930, cy = 100, rr = 56; for (let k = 0; k < 6; k++) { const a0 = (k * 60 - 90) * Math.PI / 180, a1 = a0 + Math.PI / 3, id = SECTORS[k]; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, rr, a0, a1); g.closePath(); g.fillStyle = V.radialOp === id ? 'hsl(' + HUE[id] + ' 70% 45%)' : 'rgba(255,255,255,0.05)'; g.fill(); g.strokeStyle = COL.line; g.stroke(); const am = a0 + Math.PI / 6; g.fillStyle = 'hsl(' + HUE[id] + ' 70% 75%)'; g.font = 'bold 16px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(LABEL[id], cx + Math.cos(am) * rr * 0.65, cy + Math.sin(am) * rr * 0.65); }
      g.textAlign = 'left'; g.textBaseline = 'top'; g.fillStyle = COL.dim; g.font = '14px ' + MONO; g.fillText('stick: the six · trigger: point · squeeze: undo', 760, 166);
    }
    function drawCard() {
      const c = host.card(); card.visible = !!c; con.visible = !c; rays.visible = trace.visible = rays.visible && !c;   // a card is modal: the console and the insets step aside, so a ray to its buttons meets nothing else
      if (!c) { cardKey = ''; return; }
      const key = c.text + '|' + c.buttons.map(b => b.id + b.label).join(); if (key === cardKey) return; cardKey = key;
      const g = card.userData.g, W = 1024, H = 1024; card.userData.tex.needsUpdate = true;
      g.fillStyle = 'rgba(12,16,20,0.96)'; g.fillRect(0, 0, W, H); g.strokeStyle = COL.gold; g.lineWidth = 2; g.strokeRect(1, 1, W - 2, H - 2);
      g.textBaseline = 'top'; g.fillStyle = COL.text; g.font = '24px ' + MONO; const lines = wrap(g, c.text, W - 80); let y = 36;
      for (const l of lines.slice(0, 28)) { if (!y) break; g.fillStyle = y === 36 ? COL.gold : COL.text; g.font = (y === 36 ? 'bold 32px ' : '24px ') + MONO; g.fillText(l, 40, y); y += y === 36 ? 44 : 30; if (y > H - 160) break; }
      cardLayout = layout(c.buttons, W, H, { cols: Math.max(2, c.buttons.length), y0: H - 130, y1: H - 20, gap: 12 });
      for (const r of cardLayout.rects) { g.fillStyle = r.b.big ? 'rgba(201,168,76,0.16)' : 'rgba(255,255,255,0.05)'; g.fillRect(r.x, r.y, r.w, r.h); g.strokeStyle = r.b.big ? COL.gold : COL.line; g.lineWidth = 2; g.strokeRect(r.x, r.y, r.w, r.h); g.fillStyle = r.b.big ? COL.gold : COL.text; g.font = 'bold 28px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(r.b.label, r.x + r.w / 2, r.y + r.h / 2); g.textAlign = 'left'; g.textBaseline = 'top'; }
    }
    function drawInsets() {
      for (const [m, src] of [[rays, host.insets && host.insets.rays], [trace, host.insets && host.insets.trace]]) { const cv = typeof src === 'function' ? src() : src; m.visible = !!(cv && cv.width && !cv.hidden && cv.isConnected !== false) && !card.visible; if (!m.visible) continue; const g = m.userData.g; g.clearRect(0, 0, 256, 256); try { g.drawImage(cv, 0, 0, 256, 256); } catch (e) {} m.userData.tex.needsUpdate = true; }
    }
    // ── placing: the console at the belt ahead, following the head's yaw slowly; the card ahead at 1.4 m; the insets beside the console ──
    const headPos = new THREE.Vector3(), headQ = new THREE.Quaternion(), fwd = new THREE.Vector3();
    function place(now) {
      A.camera.getWorldPosition(headPos); rig.worldToLocal(headPos); A.camera.getWorldQuaternion(headQ); fwd.set(0, 0, -1).applyQuaternion(headQ);
      const want = Math.atan2(-fwd.x, -fwd.z); let d = want - V.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); V.yaw += d * (V.presenting ? 0.04 : 1);
      const sy = Math.sin(V.yaw), cy = Math.cos(V.yaw), hy = headPos.y;
      con.position.set(-sy * 0.75, hy - 0.5, -cy * 0.75); con.rotation.set(-0.55, V.yaw, 0, 'YXZ');
      rays.position.set(-sy * 0.75 - cy * 0.6, hy - 0.42, -cy * 0.75 + sy * 0.6); rays.rotation.set(-0.3, V.yaw + 0.5, 0, 'YXZ');
      trace.position.set(-sy * 0.75 + cy * 0.6, hy - 0.42, -cy * 0.75 - sy * 0.6); trace.rotation.set(-0.3, V.yaw - 0.5, 0, 'YXZ');
      card.position.set(-sy * 1.4, hy + 0.05, -cy * 1.4); card.rotation.set(0, V.yaw, 0);
    }
    // ── pointing: the ray of a controller against the card, the console, then the sky ──
    const ray = new THREE.Ray(), inv = new THREE.Matrix4(), hitP = new THREE.Vector3(), plane = new THREE.Plane(), nrm = new THREE.Vector3(), org = new THREE.Vector3(), dir = new THREE.Vector3(), wp = new THREE.Vector3();
    function hitPanel(m, L) {
      if (!m.visible) return null; m.updateMatrixWorld(true); nrm.set(0, 0, 1).transformDirection(m.matrixWorld); m.getWorldPosition(wp); plane.setFromNormalAndCoplanarPoint(nrm, wp);
      if (!ray.intersectPlane(plane, hitP)) return null; inv.copy(m.matrixWorld).invert(); hitP.applyMatrix4(inv); const u = hitP.x / m.userData.pw + 0.5, v = 0.5 - hitP.y / m.userData.ph; if (u < 0 || u > 1 || v < 0 || v > 1) return null;
      return { m, u, v, b: L.hit(u * m.userData.cv.width, v * m.userData.cv.height), world: ray.at(ray.distanceToPlane(plane), new THREE.Vector3()) };
    }
    function aim(c, i) {
      if (!c.matrixAutoUpdate && !V.presenting) c.updateMatrix();   // the manager's controllers take their matrix from the pose; in a preview, from position and rotation
      c.updateMatrixWorld(true); c.getWorldPosition(org); dir.set(0, 0, -1).transformDirection(c.matrixWorld); ray.set(org, dir);
      const h = hitPanel(card, cardLayout) || hitPanel(con, conLayout); let cell = null; if (!h) cell = pickCell(org, dir, F, host.place, wp);
      const hit = h ? { kind: h.m === card ? 'card' : 'console', b: h.b, p: h.world, u: h.u, v: h.v } : cell != null ? { kind: 'cell', n: cell, p: host.place(cell) } : null; V.hits[i] = hit;
      const d = dots[i]; d.visible = !!hit && V.presenting; if (hit) { d.position.copy(hit.p); rig.worldToLocal(d.position); }
      return hit;
    }
    function select(i) { const h = V.hits[i] || aim(ctrls[i], i); if (!h) return; if (h.kind === 'card' && h.b) host.pressCard(h.b.id); else if (h.kind === 'console' && h.b) host.press(h.b.id); else if (h.kind === 'cell') host.tapCell(h.n); }
    ctrls.forEach((c, i) => { c.addEventListener('selectstart', () => select(i)); c.addEventListener('squeezestart', () => host.undo()); });
    // the thumbstick: one move per push past the dead zone, from the first gamepad with axes
    function sticks() {
      const s = V.session; if (!s || !s.inputSources) return; let x = 0, y = 0; for (const src of s.inputSources) { const gp = src.gamepad; if (!gp || gp.axes.length < 2) continue; const ax = gp.axes.length >= 4 ? gp.axes[2] : gp.axes[0], ay = gp.axes.length >= 4 ? gp.axes[3] : gp.axes[1]; if (Math.hypot(ax, ay) > Math.hypot(x, y)) { x = ax; y = ay; } }
      const op = radial(x, y), was = V.radialOp; V.radialOp = op; if (op && !was) host.press(op); V.stick = [x, y];
    }
    // ── the session ──
    async function enter() {
      if (V.presenting) return true; const s = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] });
      R.xr.enabled = true; try { R.xr.setReferenceSpaceType('local-floor'); } catch (e) {} await R.xr.setSession(s);
      V.session = s; V.presenting = true; V.headY = 1.6; rig.position.set(0, -2.4, 0); rig.rotation.set(0, 0, 0); V.group.visible = true; ctrls.forEach(c => { c.visible = true; });
      if (host.onEnter) host.onEnter();
      s.addEventListener('end', () => { V.session = null; V.presenting = false; R.xr.enabled = false; V.group.visible = V.preview; ctrls.forEach(c => { c.visible = false; }); dots.forEach(d => { d.visible = false; }); rig.position.set(0, 0, 0); if (host.onExit) host.onExit(); });
      return true;
    }
    function exit() { if (V.session) V.session.end(); }
    function preview(on) { V.preview = !!on; V.headY = 0; V.group.visible = V.presenting || V.preview; }
    let lastDraw = 0;
    function frame(now) {
      if (!V.group.visible) return; place(now); if (V.presenting) { sticks(); ctrls.forEach((c, i) => aim(c, i)); }
      if (now - lastDraw > 90) { lastDraw = now; drawConsole(); drawCard(); drawInsets(); }
    }
    function dispose() { for (const m of [con, card, rays, trace]) { m.geometry.dispose(); m.material.map.dispose(); m.material.dispose(); } rig.remove(V.group); ctrls.forEach(c => rig.remove(c)); }
    return { enter, exit, frame, preview, dispose, select, aim, get presenting() { return V.presenting; }, get previewing() { return V.preview; }, get hits() { return V.hits; }, get radialOp() { return V.radialOp; }, console: con, card, insets: { rays, trace }, group: V.group, controllers: ctrls, draw: () => { drawConsole(); drawCard(); drawInsets(); }, layouts: () => ({ console: conLayout, card: cardLayout }) };
  }
  return { SECTORS, LABEL, HUE, radial, wrap, layout, pickCell, supported, mount };
})();
