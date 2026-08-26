---
name: add-work
description: ポートフォリオのWORKSに作品を追加する。「最近作ったものを足して」「この作品を載せて」「worksを増やして」と言われたとき、または新しいリポジトリを掲載候補として洗い出したいときに使う。
---

# WORKS に作品を足す

ポートフォリオ（https://kanade0525.github.io/portfolio/ ）の WORKS に1件以上足すときの手順。

**必ず順番どおりにやる。**特に手順1（候補の確認）を飛ばして勝手に載せないこと。
公開・非公開や他社IPの扱いは本人の判断であって、こちらが決めることではない。

---

## 1. 候補を洗い出して、載せるものを本人に決めてもらう

```sh
ls -lt ~/development/ | head -30
gh repo list kanade0525 --limit 60 \
  --json name,visibility,homepageUrl,pushedAt \
  --template '{{range .}}{{printf "%-32s" .name}} {{printf "%-8s" .visibility}} {{.pushedAt}}  {{.homepageUrl}}{{"\n"}}{{end}}'
```

既に載っているものは `grep -n "id:" js/works-data.js` で分かる。差分が候補。

候補ごとに README を読み、次を表にして提示する。

| 見るところ | なぜ |
|---|---|
| PUBLIC / PRIVATE | PRIVATE ならコードへのリンクは出さない（みんなのシュウデンと同じ扱い） |
| 公開URLが生きているか | `curl -s -o /dev/null -w '%{http_code}' -L <URL>` で200を確認してから載せる |
| 使える画像があるか | 無ければ手順2で撮る |
| 他社IPを含むか | ファンメイドなどは権利面のリスクを伝えて判断を仰ぐ |

**そのうえで AskUserQuestion で「どれを載せるか」を聞く。** 全部載せるとは限らない。

---

## 2. カード画像を撮る

**実際にサイトを動かして撮る。** README に貼ってあるスクショの使い回しは、
古かったり縦横比が合わなかったりするので最後の手段。

```sh
# ふつうのサイト（16:9でそのまま）
npm run shot -- <URL> <id>

# 押してから撮る（ゲームのプレイ中、ツールの結果画面など）
npm run shot -- <URL> <id> --width 1440 --click スキップ --click 64×64

# 画像を読ませるツール
npm run shot -- <URL> <id> --upload 見本.png --click スキップ

# スマホ向け（端末のワクに「押す前」「押したあと」の2枚をならべる）
npm run shot -- <URL> <id> --phone --click Start --wait 6000
```

`img/works/<id>.webp` が 800x450 で出る。id はデータの `id` と必ず同じにする。

- `--click` は**画面に出ている文字そのまま**。「64×64」の×は全角
- スマホ向けのアプリは `--phone` にする。デスクトップ幅で撮ると余白だらけになる
- 撮れたら **必ず目で見る**（`open img/works/<id>.webp`）。
  タブやアカウント名の写り込み、カードの大きさで何か分かるか

ローカルでしか動かないものは、先にそのリポジトリでサーバーを起動し、
`http://localhost:...` を渡す。**撮り終わったらサーバーを止める。**

---

## 3. `js/works-data.js` に足す

配列の**先頭**に足す（新しい順に並んでいる）。書き方は同ファイル冒頭のコメントに書いてある。

`links[].type` は `js/render.js` の `LINK_TYPES` にあるものだけ。
無いtypeを書くとリンクが黙って消える（手順5の検査で気づける）。

| type | 使いどころ |
|---|---|
| `demo` | 公開サイト |
| `popup` | スマホ幅で見せたいもの。`size: { w: 414, h: 896 }` を添える |
| `repo` | PUBLICなリポジトリだけ |
| `article` `video` `store` `npm` `paper` | Qiita / YouTube / Chrome Web Store / npm / 論文 |

---

## 4. 使える漢字だけで書けているか確かめる

```sh
npm run check:font
```

**このサイトの本文に使える漢字は Nuあんこもち収録の612字だけ。**
無い漢字はグリフが無く字面が崩れるので、1文字単位でカタカナにする。

毎回ひっかかる字（実例）:

| 書きたい | 直す |
|---|---|
| 親指 | オヤユビ |
| ドット絵 | ドットエ |
| 配列 | ハイレツ |
| 記録 | キロク |
| 難しさ | ムズカしさ |
| 速さ | はやさ |
| 横 | ヨコ |

`npm run check:font -- --list` で収録字の一覧が出る。
**先に書いてから検査に通す**方が早い。最初から避けようとすると読みにくい文になる。

---

## 5. 表示が壊れていないか確かめる

```sh
npm run check:site
```

見ているもの: 件数の一致 / 画像が読めているか・16:9か / ダイアログの開閉とリンク /
Consoleエラーと404 / せまい画面でトップの窓がWORKSに重なっていないか・横にはみ出していないか。

**カードの枚数を数えただけで「正常です」と言わないこと。**
以前、枚数は合っているのにトップの窓がWORKSを298px覆っていたのを何度も見落とした。
重なりは枚数では分からないので、必ずこの検査を通す。

`npm test` で 4 と 5 の両方が走る。

---

## 6. 公開する

```sh
git add -A
git commit   # 日本語で「Add: ...」
git push origin main
```

**push してよいか本人に確かめてから。**

反映は1〜2分かかる。**push した直後に本番を見ても古いままなので、必ず待ってから確認する。**

```sh
# 反映を待つ
for i in $(seq 1 20); do
  curl -s "https://kanade0525.github.io/portfolio/js/works-data.js?t=$i" | grep -q "<id>" \
    && echo "反映ずみ" && break
  sleep 15
done

npm run check:site -- --prod
```

以前「直りました」と報告したものが実は push しておらず、
本人が見ていたのは修正前のサイトだった。**本番を見るまで完了と言わない。**
