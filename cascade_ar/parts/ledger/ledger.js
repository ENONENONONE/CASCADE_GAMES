// THE FOLD — parts/ledger: THE LEDGER, the public board of the day's seals and the wall of notes. The first thing in the game that
// leaves the device, and only when you post. A seal is a day as the engine verified it: the service (deploy/ledger/server.js) replays
// the roads you send through game.js and keeps what it finds, never what you claim (a claim can only lower a level, as a HINT's cap
// does), with the glyph sequence: the 64 targets closed, written in the field's alphabet as an 8 × 8 block, a chapter a row, '··'
// where a level was not closed. The pure half (names, notes, the roads from S.climbs, the glyph block, the rank, the share line) runs
// under node for the service, the CLI and the check; panel() is the page's sidebar. Nothing here knows three.js.
window.FOLD_LEDGER = (function () {
  'use strict';
  const LEAGUES = ['person', 'thinking', 'scripted'], NAME_MAX = 24, MSG_MAX = 280, LEVELS = 64, ROW = 8;
  // a name as the game cleans it (trim, upper, SCRIBE when empty), the invisible and the control characters out, 24 characters at most
  const cleanName = s => String(s == null ? '' : s).replace(/[\p{Cc}\p{Cf}\p{Co}\p{Cn}]/gu, '').replace(/\s+/g, ' ').trim().toUpperCase().slice(0, NAME_MAX).trim() || 'SCRIBE';
  // a note: control characters out but the line break, three breaks at most two, 280 characters
  const cleanMsg = s => String(s == null ? '' : s).replace(/[\p{Cc}\p{Cf}\p{Co}\p{Cn}]/gu, c => c === '\n' ? '\n' : '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, MSG_MAX).trim();
  const league = s => { const l = String(s == null ? '' : s).trim().toLowerCase(); return LEAGUES.includes(l) ? l : 'person'; };
  const dateOf = day => new Date(Date.UTC(2000, 11, 31 + day)).toISOString().slice(0, 10);
  // the day's roads from game.js's S.climbs, in the CLI's roads file format (fold_cli.js): for each level its standing record, the
  // last; under REBIRTH the lost road before it, a bar, and the second life's road. A level not yet recorded has no line and stays open
  function roadsText(climbs) {
    const by = new Map();
    for (const c of climbs || []) { if (!c || !Number.isInteger(c.L)) continue; if (!by.has(c.L)) by.set(c.L, []); by.get(c.L).push(c); }
    const lines = [];
    for (const [L, recs] of [...by.entries()].sort((a, b) => a[0] - b[0])) {
      const last = recs[recs.length - 1];
      if (last.out === 'reborn') { const lost = recs.slice(0, -1).reverse().find(r => r.out === 'lost'); lines.push(L + ': ' + (lost ? lost.ops || '' : '') + ' | ' + (last.ops || '')); }
      else lines.push(L + ': ' + (last.ops || ''));
    }
    return lines.join('\n');
  }
  // the glyph sequence: the targets closed as glyph pairs by level, '··' for a level not closed; rows() cuts it a chapter a row
  const glyphsOf = (targets, F) => Array.from({ length: LEVELS }, (_, k) => targets && targets[k] != null ? F.glyphs(targets[k]) : '··');
  const glyphRows = (targets, F) => { const g = glyphsOf(targets, F), rows = []; for (let r = 0; r < LEVELS / ROW; r++) rows.push(g.slice(r * ROW, r * ROW + ROW).join(' ')); return rows; };
  // the rank: the stars, then the levels closed, then the earlier post; rank 1 is the day's high scorer
  const rank = seals => seals.slice().sort((a, b) => (b.stars - a.stars) || (b.closed - a.closed) || (a.t - b.t)).map((e, i) => Object.assign({}, e, { rank: i + 1 }));
  // a seal's line to share: the page's own words, with the rank on the ledger
  const shareOf = e => 'THE FOLD · ' + (e.date || dateOf(e.day)) + ' · ' + e.name + ' · ' + e.closed + ' closed · ' + e.stars + ' stars · sealed under ' + e.seal.word + ' ' + e.seal.cell + (e.rank ? ' · #' + e.rank + ' on the ledger' : '') + (e.league && e.league !== 'person' ? ' · ' + e.league.toUpperCase() : '');

  // ── the sidebar ──
  // host: { el, F, fetch, base ('ledger'), name() the name box, day() the day number, climbs() S.climbs, stars() S.stars, toast(t) }
  function panel(host) {
    const el = host.el, doc = el.ownerDocument, F = host.F, base = host.base == null ? 'ledger' : host.base;
    const h = (tag, cls, text) => { const e = doc.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    const P = { data: null, busy: false };
    el.textContent = '';
    const head = h('div', 'lhead'), title = h('h3', null, 'THE LEDGER '), sub = h('span'), x = h('button', 'x', '×'); x.type = 'button'; x.title = 'close (l or Esc)'; title.appendChild(sub); head.append(title, x);
    const body = h('div', 'lbody'), seals = h('section'), notes = h('section'); body.append(seals, notes);
    const form = h('form', 'lpost'), name = h('input'), msg = h('textarea'), btns = h('div', 'lbtns'), bDay = h('button', null, 'POST THE DAY'), bNote = h('button', null, 'POST A NOTE'), status = h('div', 'k status');
    name.maxLength = NAME_MAX; name.placeholder = 'YOUR NAME'; name.autocomplete = 'off'; name.setAttribute('aria-label', 'your name on the ledger');
    msg.maxLength = MSG_MAX; msg.rows = 2; msg.placeholder = 'a note for the wall: feedback, a boast, a question · 280'; msg.setAttribute('aria-label', 'a note for the wall');
    bDay.type = 'button'; bNote.type = 'button'; bDay.title = 'your day as the engine verifies it, with its glyph sequence; a later post replaces it when it is as good or better'; bNote.title = 'a note on the wall, under your name';
    btns.append(bDay, bNote); form.append(name, msg, btns, status); form.onsubmit = e => e.preventDefault();
    el.append(head, body, form);
    const say = (t, bad) => { status.textContent = t || ''; status.classList.toggle('bad', !!bad); };
    const dayNow = () => host.day();
    function renderSeals(list) {
      seals.textContent = ''; seals.appendChild(h('h4', null, 'the day\'s seals · ' + list.length));
      if (!list.length) { seals.appendChild(h('p', 'k', 'no seal on the ledger yet today: close a level and post the day, and be the first')); return; }
      const ol = h('ol');
      for (const e of list) {
        const li = h('li'), who = h('div', 'who'); li.dataset.id = e.id;
        who.append(h('b', null, '#' + e.rank + ' ' + e.name), h('span', 'st', '★ ' + e.stars), h('span', 'k', e.closed + ' closed' + (e.reborn && e.reborn.length ? ' · reborn ' + e.reborn.length : '') + ' · ' + e.league));
        const gl = h('pre', 'gl'); gl.title = 'the glyph sequence: the targets closed, a chapter a row, ·· where a level was not closed';
        glyphRows(e.targets, F).forEach((row, r) => { if (r) gl.appendChild(doc.createTextNode('\n')); row.split(' ').forEach((pair, k) => { if (k) gl.appendChild(doc.createTextNode(' ')); gl.appendChild(pair === '··' ? h('i', null, pair) : doc.createTextNode(pair)); }); });
        li.append(who, gl, h('div', 'k', 'sealed under ' + e.seal.word + ' ' + e.seal.cell + ' · the line ' + e.line.word + ' ' + e.line.cell));
        if (e.msg) li.appendChild(h('p', 'm', e.msg));
        ol.appendChild(li);
      }
      seals.appendChild(ol);
    }
    function renderNotes(list) {
      notes.textContent = ''; notes.appendChild(h('h4', null, 'the wall · ' + list.length));
      if (!list.length) { notes.appendChild(h('p', 'k', 'nothing on the wall this week')); return; }
      const ul = h('ul');
      for (const n of list) { const li = h('li'); li.dataset.id = n.id; const who = h('div', 'who'); who.append(h('b', null, n.name), h('span', 'k', n.date + (n.league && n.league !== 'person' ? ' · ' + n.league : ''))); li.append(who, h('p', 'm', n.msg)); ul.appendChild(li); }
      notes.appendChild(ul);
    }
    function render(data) { P.data = data; sub.textContent = '· ' + data.date + ' · day ' + data.day; renderSeals(data.seals || []); renderNotes(data.notes || []); }
    // the day read anew; `keep` is a confirmation to leave standing in the status line (a post's), else the line is cleared
    async function refresh(keep) {
      if (P.busy) return; P.busy = true; if (!keep) say('reading the ledger…');
      try { const r = await host.fetch(base + '/' + dayNow(), { cache: 'no-store' }); if (!r.ok) throw new Error('the ledger answers ' + r.status); render(await r.json()); say(keep || ''); }
      catch (e) { sub.textContent = '· day ' + dayNow(); seals.textContent = ''; notes.textContent = ''; say('the ledger is not reachable here: on the site it is the service behind /ledger; locally, node deploy/ledger/server.js serves the game with it at http://localhost:8257/', true); }
      P.busy = false;
    }
    async function post(body) {
      if (P.busy) return null; P.busy = true; say('posting…');
      try {
        const r = await host.fetch(base, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); let j = null; try { j = await r.json(); } catch (e) {}
        if (!r.ok) { say((j && j.error) || ('the ledger answers ' + r.status), true); P.busy = false; return null; }
        P.busy = false; return j;
      } catch (e) { say('the ledger is not reachable here', true); P.busy = false; return null; }
    }
    bDay.onclick = async () => {
      const climbs = host.climbs(), roads = roadsText(climbs); if (!roads) return say('nothing to seal yet: close a level first', true);
      const j = await post({ day: dayNow(), name: cleanName(name.value), league: 'person', roads, stars: host.stars(), msg: cleanMsg(msg.value) });
      if (!j || !j.entry) return; const e = j.entry; msg.value = ''; if (host.toast) host.toast(shareOf(e), 3200); await refresh((j.replaced ? 'your day replaced on the ledger' : 'your day is on the ledger') + ' · #' + e.rank + ' · ' + e.stars + ' stars · ' + e.closed + ' closed');
    };
    bNote.onclick = async () => {
      const m = cleanMsg(msg.value); if (!m) return say('a note needs words', true);
      const j = await post({ day: dayNow(), name: cleanName(name.value), msg: m }); if (!j || !j.entry) return; msg.value = ''; await refresh('on the wall');
    };
    const api = {
      isOpen: () => !el.hidden,
      open: mode => { if (!name.value) name.value = (host.name && host.name()) || ''; el.hidden = false; refresh(); if (mode === 'post') msg.focus(); else x.focus(); },
      close: () => { if (doc.activeElement && el.contains(doc.activeElement)) doc.activeElement.blur(); el.hidden = true; },   // the keys are the field's again
      toggle: () => api.isOpen() ? api.close() : api.open(),
      refresh, render, el, inputs: { name, msg, bDay, bNote, status },
    };
    x.onclick = api.close;
    return api;
  }
  return { LEAGUES, NAME_MAX, MSG_MAX, LEVELS, cleanName, cleanMsg, league, dateOf, roadsText, glyphsOf, glyphRows, rank, shareOf, panel };
})();
