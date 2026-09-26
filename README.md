# portfolio

[here is my portfolio](https://kanade0525.github.io/portfolio/)

ビルドツールはありません。`index.html` をブラウザで直接開けばそのまま動きます。
`main` に push すると GitHub Pages が自動でビルドし、1〜2分で公開されます。

---

## ⚠️ 使える漢字は612字だけ

サイト全体に **Nuあんこもち** を当てています。このフォントは**漢字を612字しか収録していません**。
収録されていない漢字はグリフが無く、そこだけ別のフォントに落ちて字面が崩れます。

だから本文では1文字単位でカタカナに置き換えています。

| 書きたい言葉 | 実際の表記 | 使えない字 |
|---|---|---|
| 情報 | ジョウホウ | 情・報 |
| 独学 | ドク学 | 独（「学」は使える） |
| 取得 | 取トク | 得 |
| 基本 | キ本 | 基 |
| 閉じる | とじる | 閉 |

**目視では必ず取りこぼします。** 実際に過去、「寿司打」が「ス司打」のまま、「閉じる」が3箇所とも崩れたまま公開されていました。

文章を書き換えたら、必ずこれを通してください。

```sh
npm test
```

```
OK: 未収録文字はありません（3ファイルを検査）
```

引っかかると、直せる形で場所を教えてくれます。

```
'寿' (U+5BFF)  1箇所
    js/works-data.js:146:24  …タイピングゲームで、「寿司打」ほど有名なものは…

NG: 1種類 / 計1箇所。カタカナ等に置き換えてください。
```

置き換え先を探すときは、使える漢字を一覧で出せます。

```sh
npm run check:font -- --list
```

---

## ファイルの役割

```
index.html            骨組みと <template>。works/skillsの中身はここには書かない
js/works-data.js      WORKSに出す制作物         ← 増やすときはここ
js/skills-data.js     SKILLに出すスキル         ← 増やすときはここ
js/render.js          templateにデータを流し込む
js/status.js          トップの「きょうの ようす」（日づけ・時こく・天気）
js/script.js          フォントの読み込みとスムーススクロール
css/style.css         見た目
img/works/<id>.webp   worksのカード画像
tools/shoot-work.mjs  サイトを開いてカード画像を撮る      npm run shot
tools/shoot-streamdeck.mjs  Stream Deckプラグインのカードを撮る  npm run shot:sd
tools/check-site.mjs  表示が壊れていないか調べる          npm run check:site
tools/check-font-coverage.mjs  使えない漢字を見つける     npm run check:font
```

---

## WORKS を増やす・直す

Claude Code に「最近作ったものを足して」と言うと、
`.claude/skills/add-work/SKILL.md` の手順（候補の洗い出し → 撮影 → 612字チェック → 検査 → 公開）
をなぞります。自分でやるときは以下のとおりです。

### 1件増やす

`js/works-data.js` の配列に要素を1つ足し、`img/works/<id>.webp` を置くだけです。
カードもダイアログも自動で増えます。

```js
{
  id: 'shuden-board',                    // dialogのidと画像ファイル名のもと
  title: 'みんなのシュウデン',
  subtitle: 'ノみ会のサン加者全員のシュウデンを一ランと地図で共有',
  period: '2026年',
  tags: ['Nuxt 3', 'TypeScript', 'AWS SAM', 'ODPT API'],
  image: 'img/works/shuden-board.webp',
  imageAlt: 'サン加者ごとのシュウデンの時コクがカードでならんだ画面',
  description: '…ダイアログに出る本文…',
  links: []                              // 空でもよい
}
```

`subtitle` には**何をするものか**を書きます。使った技術は `tags` に任せてください。
両方に技術名を並べると同じことが2行続いて読みにくくなります。

`tags` はカードには先頭4つだけ出ます。全部はダイアログに出ます。

### リンクを足す

`links` に1行足すだけです。文言と色は `type` で決まります。

```js
links: [
  { type: 'demo',  url: 'https://kanade0525.github.io/showa-retro-css/' },
  { type: 'repo',  url: 'https://github.com/kanade0525/showa-retro-css' },
  { type: 'npm',   url: 'https://www.npmjs.com/package/showa-retro.css' }
]
```

| type | ボタンの表記 | 色 |
|---|---|---|
| `demo` | デモを見る | 青 |
| `popup` | デモを見る | 青。小窓で開く。`size: { w: 414, h: 896 }` で寸法指定 |
| `repo` | コードを見る | 標準 |
| `article` | 記事を読む | 緑 |
| `video` | ドウガを見る | 赤 |
| `store` | ストアで見る | 青 |
| `npm` | npm | 黄 |
| `paper` | ロンブンを見る | 緑 |

表記そのものを変えたいときは `js/render.js` 冒頭の `LINK_TYPES` を直します。1箇所にまとまっています。

### 並び順

配列に並んでいる順にそのまま表示されます。入れ替えても `id` を使っているので壊れません。

---

## SKILL を増やす・直す

`js/skills-data.js` に足します。

```js
{
  id: 'typescript',
  name: 'TypeScript',
  colorClass: 'is-typescript',   // css/style.css の .is-xxx に対応
  level: 65,                     // バーの長さ(0-100)
  text: '説明',
  notes: ['箇条書き', '省略可']
}
```

色を新しく足すときは `css/style.css` 冒頭の「スキルの色」のところに `.is-xxx` を1つ書きます。
白背景に載るので、**コントラスト比は3:1以上**にしてください（見出しは太字の大きな文字なので、WCAG AAの基準が3:1です）。

バーの色はあえて全部同じにしています。見出しの色（技術ごとの色）とバーの色が両方あると、
どちらを見ればいいのか分からなくなるためです。バーは長さだけで習熟度を表します。

---

## トップの「きょうの ようす」

日づけと時こくは見ている人の端末から取り、天気は [Open-Meteo](https://open-meteo.com/) から取得しています。
APIキーは要りません。

天気を出す場所を変えたいときは `js/status.js` の `PLACE` を書き換えます（初期値は東京駅のあたり）。

```js
var PLACE = { lat: 35.681, lon: 139.767 };
```

こちらから送っているのはこの座標だけで、**見ている人の位置情報は取得も送信もしていません**。
天気が取れなかったときは「わからない」と出るだけで、ページの他の部分には影響しません。

表示の言葉は `weatherText()` にまとまっています。曜日（日月火水木金土）と「雨」以外を
ひらがなにしているのは、Nuあんこもちに無い漢字を避けるためです。

---

## 画像

### サイトを開いて撮る（おすすめ）

公開されている作品なら、実物を開いて撮るのが確実です。800x450での書き出しまで一息でやります。

```sh
npm run shot -- <URL> <id>

# 押してから撮る（ゲームのプレイ中、ツールの結果画面など）
npm run shot -- https://kanade0525.github.io/pixel-forge/ pixel-forge \
  --width 1440 --upload 見本.png --click スキップ --click 64×64

# スマホ向け。端末のワクに「押す前」「押したあと」の2枚をならべる
npm run shot -- https://kanade0525.github.io/bomb-sorter/ bomb-sorter \
  --phone --click Start --wait 6000
```

`--click` は**画面に出ている文字そのまま**です（「64×64」の×は全角）。
そのほかのオプションは `tools/shoot-work.mjs` の先頭に書いてあります。

手元でしか動かないものは、先にそのリポジトリでサーバーを起動して
`http://localhost:8080/` のようなURLを渡します。撮り終わったらサーバーを止めてください。

### 手持ちの画像を使う

`img/works/<id>.webp` を上書きするだけです。ファイル名はデータの `id` と揃えてください。
**800x450（16:9）** にすると並びが崩れません。

```sh
magick 元画像.png -resize 800x450^ -gravity center -extent 800x450 -quality 82 img/works/<id>.webp
```

`-gravity` は切り取る位置です。既定は `center`、上を残したいときは `north`、左なら `west`。

外部URLを直接貼らないでください。以前 works の2/3件が `pbs.twimg.com` の直リンクで、
消えたら同時に表示されなくなる状態でした。必ず `img/` に取り込みます。

**スクリーンショットを載せる前に、写り込みを確認してください。** ブラウザのタブ、ブックマーク、
アカウント名などが入っていることがあります。

### メインビジュアルのドット絵

`img/mv.webp` は `tools/catdesk.py` で組み立てています。色や形を変えたいときはこれを書き換えます。

```sh
python3 tools/catdesk.py tools out.ppm && magick out.ppm -define webp:lossless=true img/mv.webp
```

ドット絵なので可逆圧縮にすると400バイトで収まります。

---

## 確認して公開する

```sh
npm test          # 下の2つをまとめて走らせる
npm run check:font   # 使えない漢字が混ざっていないか
npm run check:site   # 表示が壊れていないか（ブラウザで実際に開いて見る）
open index.html      # そのままブラウザで開いて確認できる
```

`check:site` が見ているもの:

- WORKS / SKILL の件数が配列と合っているか（データにあるのに画面に出ていない、を見つける）
- 画像がすべて読めているか、16:9か
- カード画像の中身が真っ白でないか、別の作品どうしで同じ画像になっていないか
- ダイアログが開いて閉じるか、リンクが1本も欠けていないか
- Consoleのエラーと404
- せまい画面で、トップの窓がWORKSに重なっていないか・横にはみ出していないか

**カードの枚数だけ数えて「大丈夫」と判断しないでください。**
枚数は合っているのにトップの窓がWORKSを298px覆っていたことがあります。
重なりは数えても分かりません。

**撮り直したら必ず `open img/works/<id>.webp` で目で見てください。**
撮影ツールが壊れて全カードがChromeのエラー画面になり、
そのまま公開されたことがあります。検査でも捕まえるようにしましたが、
まず目で見るのが早いです。

`index.html` は `file://` でも動きます（ES Modules と fetch を使っていないため）。
確認できたら push します。

```sh
git add -A
git commit -m "Update: リンクを追加"
git push origin main
```

1〜2分で https://kanade0525.github.io/portfolio/ に反映されます。
**push した直後に見ても古いままです。**待ってから本番を見てください。

```sh
npm run check:site -- --prod
```

---

## 残っている宿題

- `js/skills-data.js` の習熟度（`level`）は目安で置いたままです
- SKILL には Vite / Playwright / Canvas まわりがまだ入っていません
