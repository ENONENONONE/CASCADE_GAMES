#!/usr/bin/env python3
# Rebuilds ../cascade_ar/data.js for THE FOLD. python3 build_data.py [machine.html] [emerald_tablet.json] (or FOLD_TABLET=… in the environment).
# Rebuilds data.js for THE FOLD from the corpus tablet (every word of every cell, the mirror pairs) and the machine's pi tape.
import json,re,os,datetime
H=os.path.expanduser
import sys
HERE=os.path.dirname(os.path.abspath(__file__))
MACHINE=sys.argv[1] if len(sys.argv)>1 else os.path.join(HERE,'..','cascade_machine_v4.html')
TABLET=sys.argv[2] if len(sys.argv)>2 else os.environ.get('FOLD_TABLET')
if not TABLET: raise SystemExit('usage: python3 build_data.py [machine.html] emerald_tablet.json (or set FOLD_TABLET)')
s=open(MACHINE,encoding='utf-8').read(); k=s.index('314159265358979'); pi=re.match(r'[0-9]+',s[k:]).group(0)
t=json.load(open(TABLET,encoding='utf-8'))
cells=[{"n":i,"w":t[str(i)]['words'][0],"ws":t[str(i)]['words'],"k":len(t[str(i)]['words'])} for i in range(257)]
# A = 1 … Z = 26, other characters ignored: the same rule as gen_material.py
S=lambda w:sum(ord(c)-64 for c in w.upper() if 'A'<=c<='Z'); K=lambda w:sum(1 for c in w.upper() if 'A'<=c<='Z')
allw={w for v in t.values() for w in v['words']}; pairs=[]; seen=set()
for w in sorted(allw):
    m=27*K(w)-S(w)
    for v in t.get(str(m%257),{}).get('words',[]):
        if v!=w and K(v)==K(w) and S(v)==m and (v,w) not in seen: pairs.append([w,v]); seen.add((w,v))
data={"pi":pi,"cells":cells,"entries":sum(len(v['words']) for v in t.values()),"tablet_date":datetime.date.today().isoformat(),"mirrors":pairs,
      "glyphs":{"names":["Φ field","∂ derivative","φ golden ratio","∞ infinity","⊟ fold","⊗ tensor","♯ sharp","⅗ five thirds","ε error","δ delta","Ω impedance","Γ reflection","Q quality","Σ sum","ψ conjugate","𝟙 closure"],"groups":["MATH"]*8+["ERROR"]*2+["WAVE"]*4+["CLOSE"]*2}}
js="// CASCADE field data, generated %s from the emerald tablet (%d entries, every word) and the machine's pi tape (%d digits). Do not edit; run build_data.py.\nwindow.CASCADE_DATA=%s;\n"%(data["tablet_date"],data["entries"],len(pi),json.dumps(data,ensure_ascii=False,separators=(',',':')))
open(os.path.join(HERE,'..','cascade_ar','data.js'),'w',encoding='utf-8').write(js); print('data.js written',len(js.encode()),'bytes; mirror pairs',len(pairs))
