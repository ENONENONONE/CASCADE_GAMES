# CASCADE_GAMES

Tools and design material for THE FOLD. The game itself (`cascade_ar/`: `index.html`, `game.js`, `data.js`, …) is not in
this repository.

| File | What it does |
| --- | --- |
| `build_data.py` | Rebuilds `cascade_ar/data.js` from the emerald tablet and the machine's π tape. |
| `gen_material.py` | Recomputes and checks the arithmetic behind `material.md`, then writes `cascade_ar/parts/corpus/material.js`. |
| `material.md` | The catalogue of motifs, mechanics, words and dates mined from the corpus for the game. |
| `games_designer_api.py` | Sends a design or review task, with the files you name, to the games-designer agent through the Claude API. |

## Layout the scripts expect

The two generators find their inputs and outputs by relative path, so they run from a checkout placed like this:

```
<docs>/
  Φ≡c≡g≡∂ₜΦ≡Oc≡∂ₜΦ≡g≡c≡Φ/emerald_tablet.json
  cascade_machine/
    cascade_machine_v4.html
    cascade_ar/                  data.js, parts/corpus/material.js are written here
    cascade_ar_tools/            this repository
```

```
python3 build_data.py [machine.html] path/to/emerald_tablet.json   # or set FOLD_TABLET
python3 gen_material.py                                           # reads data.js, so run build_data.py first
```

`games_designer_api.py` needs `pip install -r requirements.txt` and reads its instructions from
`~/.claude/agents/games-designer-code-agent.md`; run it with `--help` for usage.
