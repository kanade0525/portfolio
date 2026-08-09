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
js/script.js          フォントの読み込みとスムーススクロール
css/style.css         見た目（改行コードはCRLF。編集時は保つこと）
img/works/<id>.webp   worksのカード画像
tools/                フォントのチェッカーとドット絵の生成スクリプト
```

---

## WORKS を増やす・直す

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

## 画像

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
npm test          # 使えない漢字が混ざっていないか
open index.html   # そのままブラウザで開いて確認できる
```

`index.html` は `file://` でも動きます（ES Modules と fetch を使っていないため）。
確認できたら push します。

```sh
git add -A
git commit -m "Update: リンクを追加"
git push origin main
```

1〜2分で https://kanade0525.github.io/portfolio/ に反映されます。

---

## 残っている宿題

- `img/favicon.ico` が無く、404が出ています
- `font/` に未使用のotfが54個とmisaki系ttfが3個、2.6MBのzipが入っています（約6MB）
- `css/style.css` に使われていないルールが残っています（`.article*` `.skill-img` など）
- 改行コードが混在しています（`style.css` と `script.js` はCRLF、その他はLF）
