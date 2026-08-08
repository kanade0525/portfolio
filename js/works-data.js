/**
 * WORKSに並べる制作物。
 *
 * 1件追加するときは、この配列に要素を1つ足して
 * img/works/<id>.webp を 800x450 で置くだけでよい。
 *
 *   id          … dialogのidと画像ファイル名のもとになる。半角英数とハイフンで
 *   title       … カードとダイアログの見出し
 *   subtitle    … カードの補足行。使った技術や位置づけを一言で
 *   period      … 作った時期
 *   tags        … 使った技術。半角で書く
 *   image       … カード画像。img/works/<id>.webp
 *   imageAlt    … 画像の説明。読み上げに使われる
 *   description … ダイアログ内の本文
 *   links       … 空配列も可。typeは js/render.js のLINK_TYPESにあるものだけ
 *
 * 本文に使える漢字はNuあんこもちに収録された612字だけなので、
 * 書き換えたら必ず `npm run check:font` を通すこと。
 */
window.WORKS = [
  {
    id: 'showa-retro-css',
    title: 'ショウワレトロ.css',
    subtitle: '画像もJavaScriptも使わないCSSフレームワーク',
    period: '2026年',
    tags: ['CSS', 'npm', 'GitHub Pages'],
    image: 'img/works/showa-retro-css.webp',
    imageAlt: 'ホーローカンバンやお品書き、回数ケンなどの見本がならんだ画面',
    description:
      'ホーローカンバン・キッサ店のお品書き・回数ケン・ブラウンカンを、クラス一つで再現できるCSSフレームワークです。' +
      '画像もJavaScriptも使わずCSSだけで作っているので、全部入りでもgzip後13.9KBにおさまります。' +
      '必要なところだけ読み込めば8KBまでヘらせます。npmでも公開しています。',
    links: [
      { type: 'demo', url: 'https://kanade0525.github.io/showa-retro-css/' },
      { type: 'repo', url: 'https://github.com/kanade0525/showa-retro-css' },
      { type: 'npm', url: 'https://www.npmjs.com/package/showa-retro.css' }
    ]
  },
  {
    id: 'kaidan-video-generator',
    title: 'カイダン動画を自動生成してトウコウするパイプライン',
    subtitle: 'Python × VOICEVOX × Gemini × FFmpeg',
    period: '2026年',
    tags: ['Python', 'NiceGUI', 'VOICEVOX', 'Gemini API', 'FFmpeg', 'Docker'],
    image: 'img/works/kaidan-video-generator.webp',
    imageAlt: '夜行バスの車内をえがいたカイダン動画のサムネイル',
    description:
      'ストーリーの取トクからテキスト処理、VOICEVOXでの音声合成、Geminiでの画像生成、' +
      'FFmpegでの動画合成、YouTubeへのトウコウまでを一気に自動化するシステムです。' +
      '長尺とショート動画の2系トウを同じパイプラインの上で動かしています。',
    links: [
      { type: 'repo', url: 'https://github.com/kanade0525/kaidan-video-generator' }
    ]
  },
  {
    id: 'shuden-board',
    title: 'みんなのシュウデン',
    subtitle: 'ノみ会のサン加者全員のシュウデンを一ランと地図で共有',
    period: '2026年',
    tags: ['Nuxt 3', 'TypeScript', 'AWS SAM', 'ODPT API', 'Amplify'],
    image: 'img/works/shuden-board.webp',
    imageAlt: 'サン加者ごとのシュウデンの時コクがカードでならんだ画面',
    description:
      'ノみ会の場所とカエる人のエキを入れるだけで、サン加者それぞれのシュウデンを' +
      '一ランと地図でまとめて表示し、その画面をURLでそのまま共有できます。' +
      'のこり時間を色分けして自動で更新するので「あと何分いられるか」がすぐわかります。' +
      '関東の6事業者に対応しています。',
    links: []
  },
  {
    id: 'roguelike-game',
    title: 'Katabasis - 不思議のダンジョン風ローグライク',
    subtitle: 'Nuxt 3 × Phaser 3 のターン制ダンジョンタンサク',
    period: '2026年',
    tags: ['Nuxt 3', 'TypeScript', 'Phaser 3', 'Pinia', 'rot.js'],
    image: 'img/works/roguelike-game.webp',
    imageAlt: 'ダンジョンでテキと向かい合っているゲーム画面',
    description:
      '入るたびに形の変わるダンジョンをタンサクするターン制ローグライクです。' +
      'ゲームのルールを持つ部分とPhaserでの表示を分けて、' +
      'ゲームの中身だけを取り出してテストできる形にしています。',
    links: [
      { type: 'repo', url: 'https://github.com/kanade0525/roguelike-game' }
    ]
  },
  {
    id: 'cron-translator-extension',
    title: 'Cron式を日本語にホンヤクするChromeカクチョウ機能',
    subtitle: 'ページ上のCron式を見つけて意味を表示する',
    period: '2026年',
    tags: ['JavaScript', 'Chrome Extension', 'Manifest V3'],
    image: 'img/works/cron-translator-extension.webp',
    imageAlt: 'ページ上のCron式に日本語の意味がふきだしで表示されている画面',
    description:
      'ページの中のCron式を自動で見つけて、マウスをのせると日本語の意味を表示します。' +
      '読み解くのがメンドウなCron式を、その場でたしかめられます。' +
      '表示中の部分だけを調べる作りにして、うごきがおそくならないようにしています。',
    links: [
      { type: 'repo', url: 'https://github.com/kanade0525/cron-translator-extension' }
    ]
  },
  {
    id: 'splatoon-linebot',
    title: 'スプラトゥーン3のスケジュールジョウホウを定期的にLINEで通知できるようにした',
    subtitle: 'AWS Lambda × Ruby × LINE Messaging API',
    period: '2023年',
    tags: ['AWS Lambda', 'Ruby', 'LINE Messaging API', 'EventBridge'],
    image: 'img/works/splatoon-linebot.webp',
    imageAlt: 'LINEにスプラトゥーン3のスケジュールが通知されている画面',
    description:
      'スプラトゥーンのオープンマッチのスケジュールがLINEで通知来たらベンリだなと思い作成しました。' +
      'サーバーレスで実行できるテガルさからAWS Lambdaをサイヨウし、' +
      'EventBridgeで定期的に実行しています。',
    links: [
      { type: 'article', url: 'https://qiita.com/a16111k/items/1d156db0656559cdb27a' }
    ]
  },
  {
    id: 'splibillo',
    title: 'ワリカンデンタクアプリ -SPLIBILLOR-',
    subtitle: '在学中にドク学で作成',
    period: '2020年',
    tags: ['HTML/CSS', 'JavaScript', 'Firebase'],
    image: 'img/works/splibillo.webp',
    imageAlt: 'ワリカンの計サン画面と、そのケッカが表示された画面',
    description:
      '大学在学中にHTML, CSS, JavaScriptのベンキョウのために作成しました。' +
      '金ガク、人数、タン位(100円タン位、10円タン位など)を入れるとワリカンの計サンをしてくれます。' +
      'タンなるデンタクとのチガいは、おツリをサン出する点です。' +
      'ノみのセキで「この人あまりノんで無いな」という人におツリをあげてしまおう、というコンセプトで作りました。',
    links: [
      { type: 'popup', url: 'https://splibillo.firebaseapp.com/', size: { w: 414, h: 896 } }
    ]
  },
  {
    id: 'typing-engineer',
    title: 'プログラミング初学者をホジョするタイピングゲームの開発',
    subtitle: '2020年度レイタク大学ジョウホウ系ソツロン発表会 ニュウショウ',
    period: '2020年',
    tags: ['JavaScript', 'HTML/CSS'],
    image: 'img/works/typing-engineer.webp',
    imageAlt: 'DOCTYPEをタイピングしている画面',
    description:
      '今日では、キーボード入力にナレるためのタイピングソフトがたくさんあります。' +
      'でも、プログラミングでよく使われるタン語やトクシュ文字をレンシュウできるタイピングゲームで、' +
      '「スシ打」ほど有名なものはまだありません。そこで、プログラミング初学者がトクシュ文字の入力に' +
      'ナヤむことなくスキルを高められるようなタイピングゲームを作ってヒョウカしました。',
    links: [
      { type: 'demo', url: 'https://kanade0525.github.io/typing-engineer/' },
      { type: 'paper', url: 'http://www.cs.reitaku-u.ac.jp/msemi/grad-presen/2021/ronbun/n22.pdf' }
    ]
  }
];
