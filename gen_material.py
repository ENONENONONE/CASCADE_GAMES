#!/usr/bin/env python3
# Generates ../cascade_ar/parts/corpus/material.js (kept out of the served folder) for THE FOLD from the corpus: every number computed here, none typed.
import json, re, datetime, os
P = 257
HERE = os.path.dirname(os.path.abspath(__file__))          # cascade_machine/cascade_ar_tools
DOCS = os.path.abspath(os.path.join(HERE, '..', '..'))   # the directory holding cascade_machine/ and the corpus
H = lambda rel: os.path.join(DOCS, rel)
TAB = json.load(open(H('Φ≡c≡g≡∂ₜΦ≡Oc≡∂ₜΦ≡g≡c≡Φ/emerald_tablet.json'), encoding='utf-8'))
NAME_CELLS = {44, 62, 70}   # the first word of these cells is a name the game's data does not carry; the next word stands for it
def W(n):
    ws = TAB[str(n % P)]['words']
    return ws[1] if (n % P) in NAME_CELLS else ws[0]
WS = lambda n: TAB[str(n % P)]['words']
S = lambda w: sum(ord(c) - 64 for c in w.upper() if 'A' <= c <= 'Z')
K = lambda w: sum(1 for c in w.upper() if 'A' <= c <= 'Z')
POW = [0]*256; DLOG = [-1]*P
x = 1
for k in range(256): POW[k] = x; DLOG[x] = k; x = x*3 % P
inv = lambda n: POW[(256 - DLOG[n]) % 256]
fold = lambda n: (P - n) % P
def gamma(z):
    if z == 'inf': return 1
    d = (z + 120) % P
    if d == 0: return 'inf'
    return ((z - 120) % P) * inv(d) % P
ray = lambda n: DLOG[n] % 12
def assert_eq(a, b, msg):
    if a != b: raise SystemExit('CHECK FAILED %s: %r != %r' % (msg, a, b))
# ── the turn ──
c, s = 155, 52
assert_eq(c * 5 % P, 4, '155 = 4/5'); assert_eq(s * 5 % P, 3, '52 = 3/5'); assert_eq((c*c + s*s) % P, 1, 'c²+s²')
u = (c + 16*s) % P; assert_eq(u, 216, 'u'); assert_eq(DLOG[u] % 2, 1, 'u a generator')
pts = [(1, 0)]; xx, yy = 1, 0
for n in range(256):
    xx, yy = (c*xx - s*yy) % P, (s*xx + c*yy) % P
    if (xx, yy) == (1, 0): break
    pts.append((xx, yy))
assert_eq(len(pts), 256, 'orbit of 256')
assert all((a*a + b*b) % P == 1 for a, b in pts)
# ── Kaprekar ──
def kap(n):
    d = sorted('%04d' % n); return int(''.join(d[::-1])) - int(''.join(d))
def chain(n):
    out = [n]
    while out[-1] != 6174 and len(out) < 9: out.append(kap(out[-1]))
    return out
spines = {4176: [9351, 8172, 7443, 3996, 6264, 4176, 6174], 8352: [5085, 7992, 7173, 6354, 3087, 8352, 6174], 8532: [5175, 5994, 5355, 1998, 8082, 8532, 6174]}
for door, sp in spines.items():
    assert_eq(chain(sp[0]), sp, 'spine %d' % door)
assert_eq(kap(62), 6174, '0062 one step'); assert_eq(kap(6174), 6174, 'fixed point')
for d in (4176, 8352, 8532): assert_eq(kap(d), 6174, 'door %d' % d)
outer = [(9*k + 10) for k in range(1, 10)]; inner = [(9*m - 1) for m in range(1, 10)]
assert_eq(outer, [19,28,37,46,55,64,73,82,91], 'outer'); assert_eq(inner, [8,17,26,35,44,53,62,71,80], 'inner')
seed_chain = chain(2357); assert_eq(len(seed_chain) - 1, 7, '2357 takes 7')
y2000 = chain(2000); assert_eq(y2000, [2000, 1998, 8082, 8532, 6174], '2000 chain')
y9384 = chain(9384); assert_eq(y9384, [9384, 6354, 3087, 8352, 6174], '9384 chain')
# ── the mirror chain of ten ──
mirror_chain = ['PRAXIS', 'SHIFT', 'WALLET', 'VIRUS', 'CLAUDE', 'BYZANTINE', 'ORIGINAL SIN', 'IMAGINARY NUMBER', 'BINOMIAL DISTRIBUTION', 'JAMES']
cells = [87, 75, 73, 89, 46, 116, 127, 170, 235, 48]
for i, w in enumerate(mirror_chain):
    assert w in WS(cells[i]), 'word %s not at %d' % (w, cells[i])
    nxt = (27*K(w) - S(w)) % P; assert_eq(nxt, cells[(i+1) % 10], 'mirror of %s' % w)
    if w != 'SHIFT': assert_eq(S(w), cells[i], 'sum %s' % w)
assert_eq(S('SHIFT'), 62, 'SHIFT sums to 62')
# ── tunnel chain ──
tunnel = [1, 140, 117, 234, 55]
assert_eq(1*140 % P, 140, 'T'); assert_eq(fold(140), 117, 'chi'); assert_eq(117*2 % P, 234, 'closure'); assert_eq(234*87 % P, 55, 'W')
assert_eq(140*256*2*87 % P, 55, 'composite 55'); assert_eq(2400 % P, 87, 'W = 2400 mod 257')
# ── halving ladders (×129 = ×2⁻¹) ──
def ladder(n):
    out = [n]
    for _ in range(15): out.append(out[-1]*129 % P)
    assert_eq(out[-1]*129 % P, n, 'ladder closes'); return out
ladders = {n: ladder(n) for n in (64, 6, 46, 92, 62, 120, 137)}
assert_eq(ladders[64][:8], [64,32,16,8,4,2,1,129], 'key ladder')
assert_eq(ladders[62][:4], [62,31,144,72], 'ladder 62')
# ── the ×5 staircase (5 = N(2+φ)) ──
assert_eq(DLOG[5], 55, 'dlog 5'); stair = [POW[55*k % 256] for k in range(0, 36)]
assert_eq(stair[33], 237, '5^33'); assert_eq(stair[34], 157, '5^34'); assert_eq(POW[55*128 % 256], 256, '5^128 = -1')
# ── Γ: orbit from 1, fixed points, pole, zero ──
assert_eq(gamma(120), 0, 'Γ(120)=0'); assert_eq(gamma(137), 'inf', 'pole'); assert_eq(gamma('inf'), 1, 'Γ(∞)=1')
assert_eq(gamma(46), 46, 'fix 46'); assert_eq(gamma(92), 92, 'fix 92'); assert_eq(gamma(0), 256, 'Γ(0)=-1')
orb = [1]; z = 1
for _ in range(200):
    z = gamma(z); orb.append(z)
    if z == 1: break
assert_eq(len(orb) - 1, 128, 'Γ order 128 on the orbit of 1')
g63 = [63]; z = 63
for _ in range(128): z = gamma(z); g63.append(z)
assert_eq(g63[128], 63, 'orbit of 63 closes')
for v in (26, 42, 69, 105, 120, 140, 164, 192, 195, 203, 231, 255): assert v in g63, 'orbit of 63 holds %d' % v
w_mul = 153; assert_eq(DLOG[153], 122, 'dlog 153')
# ── the 6↔9 flip ──
def flip(n):
    t = str(n).replace('6', '#').replace('9', '6').replace('#', '9'); return int(t)
flips = [(n, flip(n)) for n in range(P) if flip(n) != n]; inside = [(a, b) for a, b in flips if b < P]
assert_eq(len(flips), 83, '83 cells with 6 or 9'); assert_eq(len(inside), 82, '82 flips inside')
meet = [a for a, b in inside if gamma(a) == b]; assert_eq(meet, [36], 'flip = Γ at 36 only')
# ── the order-4 subgroup, rings ──
assert_eq(sorted(POW[64*k] for k in range(4)), [1, 16, 241, 256], 'order 4')
assert_eq(16*16 % P, 256, 'i² = -1'); assert_eq(4*4 % P, 16, '√i = 4')
dlog5 = lambda n: (DLOG[n] * 135) % 256   # dlog base 5 = dlog3 × 55⁻¹ mod 256, 55⁻¹ = 135
assert_eq(55 * 135 % 256, 1, '55 inverse 135 mod 256')
ring = lambda n: min(dlog5(n) % 64, 64 - dlog5(n) % 64)
assert_eq(ring(62), 18, 'ring of 62'); assert_eq(ring(46), 20, 'ring of 46'); assert_eq(ring(16), 0, 'ring of i'); assert_eq(ring(4), 32, 'ring of 4')
# ── Atbash fixed sums per length, self-mirrors ──
atb_fixed = {k: 27*k*129 % P for k in range(1, 13)}
assert_eq([atb_fixed[k] for k in (1,2,3,4,5,6,7,8,9,12)], [142,27,169,54,196,81,223,108,250,162], 'atbash fixed')
for w in ('LOVE', 'SAMSON', 'MOUNT SINAI', 'PRESERVATION'): assert_eq(27*K(w) - S(w), S(w), 'self-mirror %s' % w)
# ── HALT points of π ──
D = open(os.path.join(HERE, '..', 'cascade_ar', 'data.js'), encoding='utf-8').read()
pi = re.search(r'"pi":"([0-9]+)"', D).group(1)
def need_pi(n, what):
    if n >= len(pi): raise SystemExit('the π tape in data.js has %d digits; %s needs digit %d — rebuild data.js from a longer tape' % (len(pi), what, n))
need_pi(9397, 'day 9384\'s head')
halts = [n for n in range(P) if pi[n] == '9']; assert_eq(len(halts), 27, '27 HALT points'); assert_eq(sum(halts) % P, 11, 'HALT sum 11')
assert_eq(pi[9397], '6', 'π[9397] = 6')
# ── transfer matrix on π ──
def T(d):
    k2 = (2*d + 1) * 180 % P; return [[(2 - k2) % P, P - 1], [1, 0]]
def mm(A, B): return [[(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % P, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % P], [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % P, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % P]]
M = [[1,0],[0,1]]; traces = {}
for n in range(0, 258):
    M = mm(M, T(int(pi[n])))
    if n in (83, 256, 257): traces[n] = (M[0][0] + M[1][1]) % P
assert_eq(traces[83], 102, 'M(83) trace'); assert_eq(traces[257], 174, 'M(257) trace')
# ── the day table: gold days 2026–2027 ──
EPOCH = datetime.date(2000, 12, 31)
day = lambda d: (d - EPOCH).days
gold, tablet_days, quarter = [], [], []
d = datetime.date(2026, 1, 1)
while d <= datetime.date(2027, 12, 31):
    n = day(d); cell = n % 66048
    if cell % 128 == 0: gold.append((d.isoformat(), n, cell, n % P, W(n)))
    if cell % 258 == 0: tablet_days.append((d.isoformat(), n, cell, n % P, POW[55 * (cell // 258) % 256]))
    if cell % 16512 == 0: quarter.append((d.isoformat(), n, cell))
    d += datetime.timedelta(days=1)
assert_eq(day(datetime.date(2026, 9, 10)), 9384, 'day 9384'); assert_eq(9384 % P, 132, 'field 132')
assert_eq(day(datetime.date(2085, 10, 6)), 30960, 'day 30960'); assert_eq(30960 % P, 120, 'field 120 and walk cell 30960 the tablet cell of 120')
assert_eq(34830 * DLOG[120] % 66048, 30960, 'tablet cell of 120')
# gold 1983-02-16, 2028-05-02, 2073-07-17 (LEDGER 63)
for ds in ('1983-02-16', '2028-05-02', '2073-07-17'):
    y, m, dd = map(int, ds.split('-')); assert_eq(day(datetime.date(y, m, dd)) % 128, 0, 'gold ' + ds)
assert_eq(day(datetime.date(2056, 8, 3)), 20304, 'I AM day'); assert_eq(20304 % P, 1, 'I AM')
# poles
poles = [('1458-06-23 J', 3), ('1639-05-02', 2), ('1820-03-02', 1), ('2000-12-31', 0), ('2181-10-31', 256), ('2362-09-01', 255)]
for ds, f in poles[1:]:
    y, m, dd = map(int, ds.split('-')); n = day(datetime.date(y, m, dd)); assert_eq(n % 66048, 0, 'pole ' + ds); assert_eq(n % P, f, 'pole field ' + ds)
n = day(datetime.date(1458, 7, 2)); assert_eq(n % 66048, 0, 'pole 1458-06-23 J'); assert_eq(n % P, 3, 'pole field 1458-06-23 J')   # Julian 23 June = Gregorian 2 July
# 64.1°: Julian 1420-04-26 = Gregorian 1420-05-05, 1420-07-30 = 1420-08-08
n1 = day(datetime.date(1420, 5, 5)); n2 = day(datetime.date(1420, 8, 8))
assert_eq(n1, -212081, 'day of 26 April 1420 J'); assert_eq(n2, -211986, 'day of 30 July 1420 J')
assert_eq(n1 % P, 201, 'field 201'); assert_eq(n2 % P, 39, 'field 39')
today = datetime.date.today(); tn = day(today); need_pi(tn + 13, 'today\'s head')
# ── Voynich counts ──
voy = {'entries': 322, 'labels': 299, 'women': 232, 'heads': 46, 'points': 303, 'starred_paragraphs': 285, 'eva_letters': 194262, 'words': 36278, 'lines': 5385, 'pages': 227, 'paragraphs': 740, 'star_points': 2342, 'label_letters': 1970, 'label_sums': 22990, 'entry_sum': 618413, 'f69v_radial_words': 28, 'f69v_sum': 2087, 'figures_with_star': 294, 'paschal_days': 194313, 'callippic_days': 27759, 'f103r_stars': 19}
voy_cells = {k: (v, v % P, W(v % P)) for k, v in voy.items()}
assert_eq(322 % P, 65, '322'); assert_eq(299 % P, 42, '299'); assert_eq(303 % P, 46, '303'); assert_eq(2342 % P, 29, '2342'); assert_eq(618413 % P, 71, '618413'); assert_eq(194313 - 194262, 51, 'the 51')
# ── the ten discs ──
discs = [POW[k] for k in range(246, 256)]; assert_eq(discs, [198, 80, 240, 206, 104, 55, 165, 238, 200, 86], 'ten discs')
assert_eq(sum(discs) % P, 30, 'disc sum')
pr = 1
for v in discs: pr = pr*v % P
assert_eq(pr, 103, 'disc product')
# ── just intervals ──
frac = lambda a, b: a * inv(b % P) % P
intervals = [('octave', 2, 1), ('fifth', 3, 2), ('fourth', 4, 3), ('major third', 5, 4), ('minor third', 6, 5), ('tone', 9, 8), ('minor tone', 10, 9), ('semitone', 16, 15), ('major chroma', 135, 128), ('tritone', 45, 32), ('neutral third', 11, 9), ('syntonic comma', 81, 80), ('pythagorean comma', 531441, 524288)]
iv = [(nm, a, b, frac(a, b), W(frac(a, b))) for nm, a, b in intervals]
assert_eq([v[3] for v in iv], [2, 130, 87, 194, 104, 226, 201, 121, 244, 154, 144, 152, 92], 'intervals')
# ── Vitruvian, doublings, square descent, noble gases ──
doublings = [128 * 2**k % P for k in range(17)]; assert_eq(doublings[16], 128, '16 doublings')
descent = [(n*n) % P for n in range(16, -1, -1)]
pr = 1
for v in descent[:-1]: pr = pr*v % P
assert_eq(pr, 118, 'descent product')
noble = [2, 10, 18, 36, 54, 86, 118]
# ── Fibonacci mod 257: Pisano 516, F(129) = 0, φ quarter points ──
F = [0, 1]
while len(F) < 1040: F.append((F[-1] + F[-2]) % P)
assert_eq(F[129], 0, 'F(129)=0'); assert_eq((F[516], F[517]), (0, 1), 'Pisano 516'); assert_eq(F[128], 241, 'F(128)')
L = lambda n: (F[n-1] + F[n+1]) % P
assert_eq([L(129), L(258), L(387)], [225, 255, 32], 'Lucas quarter points')   # L(0) = 2
# ── Younger Dryas years in the field ──
yd = {12900: 50, 12800: 207, 11700: 135, 10950: 156, 10850: 56, 9750: 241, 9500: 248}
for y, f in yd.items(): assert_eq(y % P, f, 'YD %d' % y)
# ── Kaprekar seven-step words from LEDGER 5 ──
# ── the four-figure bridges ──
bridges = [('sidereal ratio 1.002738', 1003), ('pi 3.14159', 3142), ('sidereal day 86164.09 s', 8616), ('15 degrees an hour', 15), ('45 degrees', 45), ('solar minus sidereal 235.91 s', 2359), ('one radian 57.2958 deg', 5730), ('pi/180', 1745), ('Bessel refraction 34.5 min', 3450), ('Bessel aberration 20.4955 sec', 2050), ('log10 2', 3010), ('log10 3', 4771), ('log10 257', 2410), ('1/alpha 137.036', 1370), ('mp/me 1836.15', 1836), ('c 2998', 2998), ('phi 1618', 1618), ('WiFi 2400 MHz', 2400), ('Avogadro 6022', 6022), ('Planck 6626', 6626), ('Boltzmann 1381', 1381)]
br = [(nm, v, v % P, W(v % P), DLOG[v % P], ray(v % P)) for nm, v in bridges]
assert_eq([b[2] for b in br[:3]], [232, 58, 135], 'bridges')
# ── the five stars of the norm ──
stars = [(0, 0), (103, 51), (206, 103), (51, 154), (154, 206)]
norm = lambda a, b: (a*a + a*b - b*b) % P
assert_eq([norm(*s) for s in stars], [0, 154, 103, 103, 154], 'star norms')
assert_eq(103 * 5 % P, 1, '103 = 1/5')
# ── words of the drive geometry (added 2026-10-17) ──
drive = ['BOOT SECTOR', 'BYTES', 'CHS', 'CYLINDER', 'CYLINDERS', 'DISK', 'DRIVE', 'FIRST SECTOR', 'GEOMETRY', 'GIGABYTE', 'GPT', 'HARD DRIVE', 'HEADS', 'LAST SECTOR', 'LBA', 'MBR', 'MEGABYTE', 'NVME', 'OFFSET', 'PLATTER', 'SECTOR', 'SECTOR SIZE', 'SECTORS', 'SSD', 'TERABYTE', 'TRACK', 'TRACKS']
drive_cells = []
for w in drive:
    assert w in WS(S(w)), '%s not at %d' % (w, S(w)); drive_cells.append((w, S(w) % P))
# ── fullest cells ──
full = sorted(((len(WS(n)), n) for n in range(P)), reverse=True)[:8]
# ── mirror pairs from data.js ──
mirrors = json.loads(re.search(r'"mirrors":(\[\[.*?\]\])', D).group(1))
# ── Thoth seated and other word sums (checked) ──
thoth = {w: S(w) for w in ('CROWN', 'SCEPTER', 'ANKH', 'ATEF', 'RED SUN', 'SQUARE', 'LOTUS', 'IBIS', 'COBRA', 'PLUME', 'WATER', 'PAPYRUS', 'RECORD', 'THRONE', 'WISDOM', 'WRITING', 'KNOWLEDGE', 'MEASURE', 'AS ABOVE SO BELOW', 'ABOVE', 'BELOW', 'TRISMEGISTUS', 'HERMES', 'TOTH', 'THOTH', 'SCRIBE', 'TERMINUS', 'BORDER', 'BOUNDARY', 'EDGE', 'HORIZON', 'TUNING FORK', 'KAPREKAR', 'PERSEUS', 'MEDUSA', 'OUROBOROS', 'AIM', 'ZRN', 'RONGORONGO', 'RONGO', 'CURE', 'COMPUTE', 'ORARY', 'GEMATRIA', 'GREAT')}
for w, v in thoth.items():
    if w not in ('OUROBOROS', 'TUNING FORK'): assert w in WS(v), '%s not on the tablet at %d' % (w, v)
assert_eq(thoth['AS ABOVE SO BELOW'], 156, 'AASB')
# ── Hebrew 22 gematria pairs (Atbash n → 23 − n on ordinals; values pair as listed) ──
heb_pairs = [401, 302, 203, 104, 95, 86, 77, 68, 59, 50, 50]; assert_eq(sum(heb_pairs), 1495, 'gematria sum'); assert_eq(1495 % P, 210, '≡ 210')
hebnames = {w: S(w) for w in ('ALEPH','BET','GIMEL','DALET','HE','VAV','ZAYIN','CHET','TET','YOD','KAF','LAMED','MEM','NUN','SAMEKH','AYIN','PE','TSADI','QOF','RESH','SHIN','TAV')}
names_sum = sum(hebnames.values())  # 909 ≡ 138 with the tablet's spellings; the gematria block's 906 ≡ 135 spelt two names otherwise

for w, v in hebnames.items(): assert w in WS(v), w
zodiac = {w: S(w) for w in ('ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS','CAPRICORN','AQUARIUS','PISCES','ZODIAC')}
for w, v in zodiac.items(): assert w in WS(v % P), w
sunpath = {w: S(w) for w in ('PRECESSION','EQUINOX','SOLSTICE','AZIMUTH','DECLINATION','OBLIQUITY','ECLIPTIC','EQUATOR','MERIDIAN','NOON','LATITUDE','LONGITUDE','STANDSTILL','CROSS QUARTER','EPOCH','JULIAN','GREGORIAN','CALENDAR','METONIC','PASCHAL','SUNRISE','SUNSET','HORIZON','SUN','MOON')}
for w, v in sunpath.items(): assert w in WS(v % P), w
# ── output ──
def J(o): return json.dumps(o, ensure_ascii=False, separators=(',', ':'))
out = {
  'generated': today.isoformat(), 'tablet_entries': sum(len(WS(n)) for n in range(P)), 'day_today': tn, 'tape_head_today': tn + 13, 'opcode_today': int(pi[tn + 13]),
  'turn': {'c': c, 's': s, 'c_frac': '4/5', 's_frac': '3/5', 'u': u, 'u_dlog': DLOG[u], 'w': (c - 16*s) % P, 'period': 256, 'rule': '(x, y) → (c·x − s·y, s·x + c·y); u = c + 16s acts on x + 16y', 'orbit16': pts[:16]},
  'doors': {'constant': 6174, 'constant_cell': 6174 % P, 'doors': [4176, 8352, 8532], 'door_cells': [d % P for d in (4176, 8352, 8532)], 'sub_thousand_door': 62,
            'spines': {str(d): sp for d, sp in spines.items()}, 'spine_cells': {str(d): [v % P for v in sp] for d, sp in spines.items()},
            'seed_2357': seed_chain, 'year_2000': y2000, 'day_9384': y9384, 'counts_1000_9999': {'0': 1, '1': 356, '2': 519, '3': 2124, '4': 1124, '5': 1379, '6': 1508, '7': 1980},
            'door_traffic_0000_9999': {'4176': 3696, '8352': 3486, '8532': 2424}},
  'kaprekar_families': {'outer': [(9*k + 10, W(9*k + 10)) for k in range(1, 10)], 'inner': [(9*m - 1, W(9*m - 1)) for m in range(1, 10)], 'outer_rule': '9k + 10', 'inner_rule': '9m − 1', 'digits': 'k, m−1, 9−m, 10−k', 'scales': {'999': 999 % P, '90': 90}},
  'mirror_chain': [{'word': w, 'cell': cells[i], 'k': K(w), 'sum': S(w), 'mirror': 27*K(w) - S(w)} for i, w in enumerate(mirror_chain)],
  'atbash': {'fixed_sum_by_length': atb_fixed, 'self_mirrors': {w: S(w) for w in ('LOVE', 'SAMSON', 'MOUNT SINAI', 'PRESERVATION')}, 'letter_pairs_both_words': ['B/Y', 'C/X', 'H/S', 'I/R', 'J/Q', 'L/O', 'M/N'], 'mirror_pairs_on_tablet': len(mirrors)},
  'tunnel': {'cells': tunnel, 'steps': ['Γ = 1', '×140 T', 'fold χ', '×2 closure', '×87 W'], 'composite': 55, 'glyphs': ['Φ∂', 'εQ', '⅗⊗', 'ψΩ', 'δQ']},
  'ladders': {str(k): v for k, v in ladders.items()},
  'five_staircase': {'dlog5': 55, 'first': stair[:13], 'k33': stair[33], 'k34': stair[34], 'k128': 256},
  'gamma': {'z0': 120, 'zero': 120, 'pole': 137, 'fixed': [46, 92], 'at_infinity': 1, 'w_multiplier': 153, 'w_step_dlog': 122, 'order': 128, 'orbit_of_1_first16': orb[:16], 'orbit_of_63_first16': g63[:16]},
  'flip69': {'cells_with_6_or_9': len(flips), 'inside_field': len(inside), 'equals_gamma_at': meet, 'equals_gamma_image': [gamma(a) for a in meet], 'pairs_first12': inside[:12]},
  'order4': [1, 16, 256, 241], 'rings': {'rule': 'dlog5(n) = 135·dlog3(n) mod 256; ring = min(s mod 64, 64 − s mod 64); cell 2·ring from gold', 'ring0': [1, 16, 256, 241], 'ring32': [4, 64, 193, 253], 'ring16': [2, 8, 32, 128, 255, 249, 225, 129], 'samples': {str(n): ring(n) for n in (62, 46, 73, 86, 120, 137, 3, 71, 63)}},
  'halt_points': halts,
  'transfer_matrix': {'T': '[[2 − k², −1], [1, 0]], k² = (2d + 1)·180 mod 257', 'traces': {'M83': traces[83], 'M256': traces[256], 'M257': traces[257]}},
  'days': {'epoch': '2000-12-31', 'rule': 'day n → walk cell n mod 66048; gold when cell mod 128 = 0; tablet cell when mod 258 = 0; quarter when mod 16512 = 0; field = n mod 257; tape head = n + 13',
           'gold_2026_2027': gold, 'tablet_2026_2027': tablet_days, 'quarter_2026_2027': quarter, 'poles': poles,
           'gold_named': [('1983-02-16', 'gold'), ('2005-09-24', 'midway 186'), ('2028-05-02', 'gold, field 218'), ('2050-12-09', 'midway 250'), ('2056-08-03', 'day 20304 = 141 × 144, field 1'), ('2073-07-17', 'gold'), ('2085-10-06', 'day 30960, walk cell 30960 = tablet cell of 120, field 120')],
           'day_9384': {'date': '2026-09-10', 'field': 132, 'head': 9397, 'opcode': 6, 'window': 6417, 'kaprekar': y9384}},
  'sun_at_prague': {'latitude': 50.0875, 'obliquity_1420': 23.5146, 'longest_day_hours': 16.18034, 'longest_day_phi': '10φ', 'solstice_sunrise': [51.54, 128.46], 'sunrise_641_declination': 16.271,
                    'dates_1420_julian': [('1420-04-26 J', -212081, 201), ('1420-07-30 J', -211986, 39)], 'dates_frame_2000': ['04-18', '07-21'], 'dates_frame_of_date': ['04-26/27', '07-30/31'],
                    'noon_ceiling': 63.41, 'arctan2': 63.4349, 'arctan_half': 26.5651, 'arctan_third': 18.4349, 'arctan_inv_phi': 31.7175},
  'voynich': voy_cells,
  'norm_stars': {'form': 'a² + ab − b²', 'stars': stars, 'norms': [norm(*s_) for s_ in stars], 'angles_from_middle': [18.43, 108.43, 198.43, 288.43], 'arms': [31.72, 121.72, 211.72, 301.72]},
  'ten_discs': {'dlogs': list(range(246, 256)), 'cells': discs, 'sum': 30, 'product': 103, 'window_sum_rule': '3^k0 × 226', 'window_product_rule': '3^(10k0 + 45)'},
  'intervals': iv, 'doublings_from_128': doublings, 'square_descent': descent, 'noble_gas_closures': noble,
  'vitruvian': {'groin': 128, 'navel': 158, 'gap': 30, 'crown_to_navel': 98, 'contacts': [1, 241, 256, 16], 'corners': [0, 15, 240, 255]},
  'pisano': {'period': 516, 'F129': 0, 'F128': 241, 'lucas_quarters': [2, 225, 255, 32], 'phi_quarters': [1, 241, 256, 16]},
  'younger_dryas': yd, 'bridges': br, 'drive_words': drive_cells, 'fullest_cells': [(n, k) for k, n in full],
  'word_sums': {**thoth, **hebnames, **zodiac, **sunpath},
  'hebrew': {'atbash_constant': 23, 'gematria_pairs': heb_pairs, 'pairs_sum': 1495, 'pairs_cell': 210, 'names_sum_tablet_spellings': names_sum, 'names_cell': names_sum % P, 'self_mirror_by_length': {k: 23*k*129 % P for k in (1, 2, 4, 7, 8, 12, 14, 15, 22)}},
  'sphere': {'cells': 66048, 'tablet_stride': 258, 'gold_stride': 128, 'quarter_points': [0, 16512, 33024, 49536], 'g_cell': 34830, 'phi_cell': 65920, 'golden_angle': 137.508, 'spiral_arms': [377, 610, 233, 144, 89, 55]},
}
js = '// THE FOLD — the corpus\'s numbers for the game, generated %s by cascade_ar_tools/gen_material.py (every value computed and checked there). Do not edit by hand.\nwindow.FOLD_MATERIAL = %s;\n' % (today.isoformat(), J(out))
dst = os.path.join(HERE, '..', 'cascade_ar', 'parts', 'corpus', 'material.js')
open(dst, "w", encoding="utf-8").write(js)
print('written', dst, len(js.encode()), 'bytes; all checks passed')
print('today day', tn, 'head', tn + 13, 'opcode', pi[tn + 13])
print('gold 2026-27:', gold); print('tablet days:', tablet_days); print('quarter:', quarter)
print('Γ orbit of 1:', orb[:17]); print('turn orbit:', pts[:16]); print('halts:', halts)
print('traces', traces); print('fullest', full); print('mirror pairs', len(mirrors)); print('intervals', iv)
print('bridges', br); print('drive', drive_cells); print('flip pairs', inside[:12]); print('g63', g63[:16])
print('thoth', thoth); print('heb', hebnames); print('zodiac', zodiac); print('sunpath', sunpath); print('voy', voy_cells)
print('ladders', ladders); print('stair', stair[:13])
