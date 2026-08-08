"""ドット絵をPPMで書き出す小さな道具。色は文字1つで指定する。"""
import sys

def new_grid(w, h, ch='.'):
    return [[ch] * w for _ in range(h)]

def rect(g, x0, y0, x1, y1, ch):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            g[y][x] = ch

def stamp(g, x0, y0, art, skip='.'):
    for dy, row in enumerate(art):
        for dx, ch in enumerate(row):
            if ch != skip:
                g[y0 + dy][x0 + dx] = ch

def save(g, palette, path, scale=1):
    h, w = len(g), len(g[0])
    out = ['P3', '%d %d' % (w * scale, h * scale), '255']
    for row in g:
        line = []
        for ch in row:
            r, gg, b = palette[ch]
            line.extend(['%d %d %d' % (r, gg, b)] * scale)
        for _ in range(scale):
            out.append(' '.join(line))
    open(path, 'w').write('\n'.join(out) + '\n')
