# CASCADE_GAMES

THE FOLD, an augmented-reality game over the field GF(257), with the tools that build its data and the catalogue it draws on.

| Path | What it is |
| --- | --- |
| `cascade_ar/` | The game: one page, no build step (see `cascade_ar/README.md`). |
| `build_data.py` | Rebuilds `cascade_ar/data.js` from the emerald tablet and the machine's π tape. |
| `gen_material.py` | Recomputes and checks the arithmetic behind `material.md`, then writes `cascade_ar/parts/corpus/material.js`. |
| `material.md` | The catalogue of motifs, mechanics, words and dates mined from the corpus for the game. |
| `games_designer_api.py` | Sends a design or review task, with the files you name, to the games-designer agent through the Claude API. |

## Rebuilding the game's data

The generators find `cascade_ar/` as a child of their folder (this repository) or as its sibling (the corpus layout, with the
tools in `cascade_machine/cascade_ar_tools/`). The tablet and the machine page live in the corpus, not here:

```
python3 build_data.py path/to/cascade_machine_v4.html path/to/emerald_tablet.json
FOLD_TABLET=path/to/emerald_tablet.json python3 gen_material.py   # reads data.js, so run build_data.py first
```

Without `FOLD_TABLET`, `gen_material.py` reads the tablet from the corpus layout, `<docs>/Φ≡c≡g≡∂ₜΦ≡Oc≡∂ₜΦ≡g≡c≡Φ/emerald_tablet.json`
two levels above the tools. After either run, check the game with `node cascade_ar/parts/corpus/check.js`, and bump `CACHE` in
`cascade_ar/sw.js` so phones that have the game pick up the new files.

`games_designer_api.py` needs `pip install -r requirements.txt` and reads its instructions from
`~/.claude/agents/games-designer-code-agent.md`; run it with `--help` for usage.
