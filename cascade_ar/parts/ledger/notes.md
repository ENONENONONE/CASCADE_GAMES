# parts/ledger — THE LEDGER

The public board of the day's seals and the wall of notes: the first thing in the game that leaves the device, and only when you
post. Two halves and a service:

- `ledger.js`, the part: the pure half (a name and a note cleaned, the leagues, the roads from `S.climbs`, the glyph sequence, the
  rank, the share line) that the page, the service and the CLI share, and `panel()`, the page's sidebar.
- `../../../deploy/ledger/server.js`, the service: one file of node, no dependencies, an append-only JSONL store. Caddy proxies
  `/ledger*` to it on Vita, so the page's CSP (`connect-src 'self'`) holds; locally it serves the game itself too.
- `../../../fold_cli.js`: `ledger` reads the day, `post` puts a day or a note on it.

## Verified, not claimed

A day on the ledger is its roads. The page posts `roadsText(S.climbs)` (the CLI's roads file format: a level a line, the lost road
and a bar before the life from 80), and the service replays them through game.js (`fold_cli.playDay`) and keeps what the engine
finds: the levels closed, the stars, the cell each level closed on, the seal and the line. The page's own `S.stars` go along as a
claim that can only lower a level (a second HINT caps a level at ★★, which a replay cannot see). A name's day is replaced by a later
post that is as good or better; a worse one is refused with the standing entry. Names are not claimed.

## The glyph sequence

Each seal carries the 64 targets closed, by level, written in the field's alphabet: a cell's glyph pair, `··` where a level was not
closed. The panel and the CLI lay it out as an 8 × 8 block, a chapter a row, so a day reads as a picture: a perfect day is a full
block, a lost SYNC level a hole in its row, and two names on the same day differ where the ladders, the mirrors and the quests
differ. Under SHIFT the pair is the cell the target was caught on. The JSON carries `targets` (cells, null unclosed) and `glyphs`
(the 64 pairs joined by spaces).

## The wall

A note is words under a name, 280 characters, kept with its day; a day's view carries the week's notes newest first, fifty at most.
A seal may carry a note too. The page's panel reads the day on open and after a post; nothing polls.

## Limits and the keeper

A post is 16 KB, a name 24 characters, a note 280; one post every ten seconds and sixty a day from an address (Cloudflare's
`CF-Connecting-IP`, else the first `X-Forwarded-For`, else the socket). `DELETE /ledger/<id>` with `Authorization: Bearer
$FOLD_LEDGER_ADMIN` strikes an entry (a `{"del": id}` line in the store); the store is a text file and can be edited by hand, then
the service restarted. Days are taken today give or take two, by the service's clock.

## The check

`node check.js`: the pure half, then the service on an ephemeral port with a temp store (a day from the solver's roads verified at
64 and 192 with the glyph sequence of the plan's own targets, the claim that only lowers, the replacement and the refusal, the
notes, the bad posts, the strike, the restart), the CLI against it, and the rate limit on a second service.
