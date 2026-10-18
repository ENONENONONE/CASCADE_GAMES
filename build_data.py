#!/usr/bin/env python3
# Rebuilds cascade_ar/data.js for THE FOLD: python3 build_data.py machine.html emerald_tablet.json, or python3 build_data.py [machine.html]
# with FOLD_TABLET=emerald_tablet.json in the environment. cascade_ar is this folder's child (the CASCADE_GAMES repo) or its sibling.
# Rebuilds data.js for THE FOLD from the corpus tablet (every word of every cell but the name-words, the mirror pairs) and the machine's pi tape.
import json,re,os,datetime
H=os.path.expanduser
import sys
HERE=os.path.dirname(os.path.abspath(__file__))
AR=next((p for p in (os.path.join(HERE,'cascade_ar'),os.path.join(HERE,'..','cascade_ar')) if os.path.isdir(p)),os.path.join(HERE,'..','cascade_ar'))
MACHINE=sys.argv[1] if len(sys.argv)>1 else os.path.join(HERE,'..','cascade_machine_v4.html')
TABLET=sys.argv[2] if len(sys.argv)>2 else os.environ.get('FOLD_TABLET')
if not TABLET: raise SystemExit('usage: python3 build_data.py machine.html emerald_tablet.json, or python3 build_data.py [machine.html] with FOLD_TABLET set')
s=open(MACHINE,encoding='utf-8').read(); k=s.index('314159265358979'); pi=re.match(r'[0-9]+',s[k:]).group(0)
t=json.load(open(TABLET,encoding='utf-8'))
# the tablet's two name-words stay out of the game's data (material.md:10–12). They are found by place, 44's first word and 62's third, so
# they are written nowhere here, and an entry that carries one as a word goes with them (three more on the tablet of 2026-10-17, at 104, 165
# and 240); w is the first word left: 44 SPACE, 62 FIBONACCI, 70 LILITH as it stands. gen_material.py applies the same rule.
NAME_AT={44:0,62:2}
if t['44']['words'][1]!='SPACE' or t['62']['words'][:2]!=['FIBONACCI','TORAH']: raise SystemExit('cells 44 and 62 of this tablet are not in the order NAME_AT was set for; check it before building')
NAMES={t[str(n)]['words'][j] for n,j in NAME_AT.items()}
WS=lambda n:[w for w in t[str(n)]['words'] if not NAMES&set(re.findall('[A-Z]+',w.upper()))]
cells=[{"n":i,"w":WS(i)[0],"ws":WS(i),"k":len(WS(i))} for i in range(257)]
# A = 1 … Z = 26, other characters ignored: the same rule as gen_material.py
S=lambda w:sum(ord(c)-64 for c in w.upper() if 'A'<=c<='Z'); K=lambda w:sum(1 for c in w.upper() if 'A'<=c<='Z')
allw={w for c in cells for w in c['ws']}; pairs=[]; seen=set()
for w in sorted(allw):
    if not K(w): continue   # no letters A–Z, no mirror: such words would all pair through cell 0
    m=27*K(w)-S(w)
    for v in cells[m%257]['ws']:
        if v!=w and K(v)==K(w) and S(v)==m and (v,w) not in seen: pairs.append([w,v]); seen.add((w,v))
data={"pi":pi,"cells":cells,"entries":sum(c['k'] for c in cells),"tablet_date":datetime.date.today().isoformat(),"mirrors":pairs,
      "glyphs":{"names":["Φ field","∂ derivative","φ golden ratio","∞ infinity","⊟ fold","⊗ tensor","♯ sharp","⅗ five thirds","ε error","δ delta","Ω impedance","Γ reflection","Q quality","Σ sum","ψ conjugate","𝟙 closure"],"groups":["MATH"]*8+["ERROR"]*2+["WAVE"]*4+["CLOSE"]*2}}
js="// CASCADE field data, generated %s from the emerald tablet (%d entries, every word but the name-words) and the machine's pi tape (%d digits). Do not edit; run build_data.py.\nwindow.CASCADE_DATA=%s;\n"%(data["tablet_date"],data["entries"],len(pi),json.dumps(data,ensure_ascii=False,separators=(',',':')))
open(os.path.join(AR,'data.js'),'w',encoding='utf-8').write(js); print('data.js written',len(js.encode()),'bytes; mirror pairs',len(pairs))
