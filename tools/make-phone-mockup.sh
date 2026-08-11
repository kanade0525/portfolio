#!/bin/bash
# スマホ向けのアプリを、端末のフレームに収めたカード画像にする。
#
#   tools/make-phone-mockup.sh 画面1.png 画面2.png img/works/<id>.webp '#1c2545'
#
# 画面は 390x844(deviceScaleFactor 2 なら 780x1688) で撮ったものを渡す。
# 第4引数は背景色。そのアプリの地の色より少し明るくすると、
# 端末の輪郭が背景に沈まない。
set -e
S1="$1"; S2="$2"; OUT="$3"; BG="${4:-#222529}"
W=780; H=1688; R=70; BEZEL=22

mask() {   # 画面を角丸に切り抜く
  magick -size ${W}x${H} xc:none -fill white -draw "roundrectangle 0,0,$((W-1)),$((H-1)),$R,$R" /tmp/_mask.png
  magick "$1" -resize ${W}x${H}^ -gravity north -extent ${W}x${H} /tmp/_scr.png
  magick /tmp/_scr.png /tmp/_mask.png -alpha off -compose CopyOpacity -composite "$2"
}
phone() {  # 角丸画面に黒いベゼルを付ける
  local BW=$((W + BEZEL*2)) BH=$((H + BEZEL*2))
  magick -size ${BW}x${BH} xc:none -fill '#0c0c11' \
    -draw "roundrectangle 0,0,$((BW-1)),$((BH-1)),$((R+BEZEL)),$((R+BEZEL))" /tmp/_bezel.png
  magick /tmp/_bezel.png "$1" -geometry +${BEZEL}+${BEZEL} -composite "$2"
}

mask "$S1" /tmp/_r1.png && phone /tmp/_r1.png /tmp/_p1.png
mask "$S2" /tmp/_r2.png && phone /tmp/_r2.png /tmp/_p2.png

# 2台を並べて16:9に収める
magick /tmp/_p1.png -resize x400 /tmp/_s1.png
magick /tmp/_p2.png -resize x400 /tmp/_s2.png
PW=$(magick identify -format '%w' /tmp/_s1.png)
GAP=44
X1=$(( (800 - (PW*2 + GAP)) / 2 ))
X2=$(( X1 + PW + GAP ))
magick -size 800x450 "xc:$BG" \
  /tmp/_s1.png -geometry +${X1}+25 -composite \
  /tmp/_s2.png -geometry +${X2}+25 -composite \
  -quality 84 "$OUT"
