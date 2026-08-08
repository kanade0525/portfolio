import sys
sys.path.insert(0, sys.argv[1])
from draw import new_grid, rect, stamp, save

PAL = {
    '.': (255, 255, 255),
    'D': (0x2a, 0x2a, 0x30),
    'M': (0x5a, 0x5a, 0x64),   # モニタの筐体
    'm': (0x42, 0x42, 0x4a),
    'S': (0x0e, 0x16, 0x12),   # 画面
    'G': (0x5c, 0xd6, 0x5c),
    'g': (0x3a, 0x94, 0x3a),
    'B': (0x72, 0x72, 0x7c),   # キーボード
    'b': (0x4a, 0x4a, 0x52),
    'n': (0x2a, 0x2a, 0x30),   # キーの溝
    'K': (0x26, 0x26, 0x2e),   # 猫
    'k': (0x16, 0x16, 0x1c),   # 猫の影
    'p': (0x6e, 0x44, 0x50),   # 耳の内側
    'Y': (0xf5, 0xd0, 0x20),   # 目
    'P': (0xe8, 0x86, 0x9a),   # 鼻
    'C': (0xd8, 0x50, 0x40),   # マグカップ
    'c': (0xa8, 0x38, 0x2c),
    'W': (0xdc, 0xdc, 0xd4),   # 湯気
    'T': (0x9a, 0x74, 0x4e),   # 机
    't': (0x74, 0x56, 0x3a),
}

W, H = 48, 34
g = new_grid(W, H)

# ---- モニタ ----
rect(g, 3, 1, 35, 18, 'D')
rect(g, 4, 2, 34, 17, 'M')
rect(g, 4, 16, 34, 17, 'm')
rect(g, 5, 3, 33, 15, 'S')
for y, (x0, x1) in [(4, (7, 21)), (5, (9, 27)), (6, (9, 18)), (7, (7, 24)),
                    (8, (9, 20)), (9, (9, 29)), (10, (7, 16)), (11, (9, 23)),
                    (12, (7, 19)), (13, (9, 26))]:
    rect(g, x0, y, x1, y, 'G' if y % 2 else 'g')
rect(g, 17, 19, 21, 21, 'M')      # スタンドの首
rect(g, 13, 22, 25, 23, 'D')      # スタンドの台

# ---- 机 ----
rect(g, 0, 28, W - 1, 30, 'T')
rect(g, 0, 31, W - 1, 32, 't')

# ---- キーボード ----
rect(g, 1, 23, 33, 27, 'D')
rect(g, 2, 24, 32, 25, 'B')
rect(g, 2, 26, 32, 26, 'b')
for x in range(4, 32, 4):         # キーの溝
    rect(g, x, 24, x, 25, 'n')

# ---- マグカップ ----
rect(g, 37, 20, 44, 27, 'D')
rect(g, 38, 21, 43, 26, 'C')
rect(g, 42, 21, 43, 26, 'c')
rect(g, 44, 22, 46, 22, 'D')      # 取っ手
rect(g, 46, 23, 46, 24, 'D')
rect(g, 44, 25, 46, 25, 'D')
rect(g, 39, 16, 39, 19, 'W')      # 湯気
rect(g, 42, 15, 42, 18, 'W')

# ---- 猫（キーボードの上に座る）----
cat = [
    "..K..........K..",
    ".KKK........KKK.",
    ".KpK........KpK.",
    ".KppK......KppK.",
    "..KKKKKKKKKKKK..",
    ".KKKKKKKKKKKKKK.",
    "KKKKKKKKKKKKKKKK",
    "KKK.YY....YY.KKK",
    "KKK.YY....YY.KKK",
    "KKKKKKKKKKKKKKKK",
    "KKKKKK.PP.KKKKKK",
    ".KKKKKKKKKKKKKK.",
    "..KKKKKKKKKKKK..",
    "...KKKKKKKKKK...",
    "..KKKKKKKKKKKK..",
    ".KKKKKKKKKKKKKK.",
    "KKKKKKKKKKKKKKKK",
    "KKKKKKKKKKKKKKKK",
    "KKKKKKKKKKKKKKKK",
    "kKK.KKKKKK.KKKKk",
]
stamp(g, 13, 4, cat)

# しっぽ（体の右下から水平に出て、先を立てる）
rect(g, 28, 20, 33, 21, 'K')
rect(g, 32, 16, 33, 21, 'K')
rect(g, 32, 15, 33, 15, 'k')

save(g, PAL, sys.argv[2], scale=7)
