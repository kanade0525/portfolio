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
    id: 'github-ja-guide',
    title: '非エンジニアのためのGitHub用語ガイド',
    subtitle: '英語のラベルのとなりに日本語の意味をそえるChromeカクチョウ機能',
    period: '2026年',
    tags: ['JavaScript', 'Chrome Extension', 'Manifest V3'],
    image: 'img/works/github-ja-guide.webp',
    imageAlt: 'GitHubのタブに日本語の意味がそえられ、ふきだしで説明が出ている画面',
    description:
      'GitHubの画面に出る英語のラベルはそのままに、となりへ小さく日本語の意味をそえます。' +
      '英語をのこすので、人に画面を見せてきくときや、英語のマニュアルと見くらべるときにこまりません。' +
      '208語にタイオウしていて、マウスをのせるとムズカシイ言いかたをしない説明が出ます。' +
      '用語の意味だけではたりない部分も入れました。' +
      'Pull requestをどれくらいのまとまりで出すとよいか、ブランチやコミットが何のためにあるかといった考え方のガイドと、' +
      'Issueを書く画面に出るイライのヒナ形です。' +
      '本文やコードには手を出さず、ナビやボタンのラベルだけにそえる作りにしています。',
    links: [
      { type: 'store', url: 'https://chromewebstore.google.com/detail/dagpfahcgkhdggiolnonnmeepnldjdhi' },
      { type: 'repo', url: 'https://github.com/kanade0525/github-ja-guide' }
    ]
  },
  {
    id: 'streamdeck-combo-counter',
    title: 'Combo Counter',
    subtitle: 'キーとマウスを押した回数が、トギれずに何回つづいたかをキーに出す',
    period: '2026年',
    tags: ['Node.js', 'Swift', 'Stream Deck SDK', 'SVG', 'macOS'],
    image: 'img/works/streamdeck-combo-counter.webp',
    imageAlt: 'Stream Deckのキーに128という数字と、その上に自コキロクが出ている画面',
    description:
      'Stream Deckのキーの上で、キーボードとマウスを押した回数を数えます。' +
      '3ビョウ手が止まると0に下がるので、どこまでつづけられるかというアソびになります。' +
      '10・25・50・100とコえるたびにキーの色とモヨウが変わり、自コキロクを上回っている間は色が変わります。' +
      '数えているのはカイ数だけで、どのキーを押したかは読み取っていません。' +
      '入力をひろうのは40行ほどのSwiftのプログラムで、オヤプロセスにわたすのは「キーが押された」「マウスが押された」を表す1文字だけです。' +
      'ネットワークには一切つなぎません。' +
      'キーのエはSVGをモジ列でくみ立てて送っています。' +
      'Marketplaceのキソクでキーの書きかえは毎ビョウ10回までなので、' +
      '送る手前に関門をおき、送れない間の要求はすてずにいちばん新しい1件だけをおぼえておくようにしました。' +
      'こうすると上限を守りながら、手が止まったときの数字が実さいと合います。',
    links: [
      { type: 'repo', url: 'https://github.com/kanade0525/streamdeck-combo-counter' }
    ]
  },
  {
    id: 'streamdeck-server-watch',
    title: 'Server Watch',
    subtitle: 'サーバーが生きているかをキーの色で出し、押すとカンリ画面がヒラく',
    period: '2026年',
    tags: ['Node.js', 'Stream Deck SDK', 'SVG', 'macOS'],
    image: 'img/works/streamdeck-server-watch.webp',
    imageAlt: 'ミドリ・キ色・赤の3つのキーがならび、それぞれかかった時間と止まっている時間が出ている画面',
    description:
      '見たいサーバーを1つ書いておくと、キーがミドリのままなら生きていて、' +
      '止まると赤になり、どれだけ止まっているかを数えます。' +
      'ミドリの間は、かえってくるまでにかかった時間が出ます。' +
      '1回シッパイしただけでは赤にしません。つづけて3回シッパイして初めて赤にします。' +
      'その間はキ色で、まだ止まったと決まっていないことを表します。' +
      '書きかたで調べかたが決まります。https から始めればページを取りに行き、' +
      'ホスト名にコロンとバンゴウをつければそこにつなぎ、ホスト名だけなら ping を送ります。' +
      '押したときにヒラくページも入れられるので、赤くなったらそのまま見に行けます。' +
      'サーバーに問い合わせているのは使う人のパソコンで、作ったガワのサーバーは通しません。',
    links: [
      { type: 'repo', url: 'https://github.com/kanade0525/streamdeck-server-watch' }
    ]
  },
  {
    id: 'streamdeck-daycount',
    title: 'Day Count',
    subtitle: 'その日までの日数と、その日からの日数をキーに出す',
    period: '2026年',
    tags: ['Node.js', 'Stream Deck SDK', 'SVG', 'macOS'],
    image: 'img/works/streamdeck-daycount.webp',
    imageAlt: '42日ノコり・3日ノコり・ムジコ127日の3つのキーがならんだ画面',
    description:
      'キーに日づけを1つ入れておくと、その日まであと何日か、' +
      'またはその日から何日たったかを出しつづけます。' +
      'リリースまでの日数にも、ムジコがつづいている日数にも使えます。' +
      '土日をトばして、はたらく日だけで数えることもできます。' +
      '日本のシュクジツもトばせますが、ヒョウを持ってくるのではなく手もとでケイサンしているので、' +
      '通しんもいりませんし、古くなることもありません。' +
      'ハルとアキのヒガンや、フリカえのヤスみも入っています。' +
      '「その日からの日数」のキーは2ビョウ長押しすると今日から数えなおせるので、' +
      'ムジコの日数を出しているときに、その場で0にもどせます。' +
      '同じことをする無りょうのものが見あたらなかったので、無りょうで出しています。',
    links: [
      { type: 'repo', url: 'https://github.com/kanade0525/streamdeck-daycount' }
    ]
  },
  {
    id: 'streamdeck-pets',
    title: 'Desk Pet',
    subtitle: 'キーの上で、しごとの手の動きに合わせてクラす生き物',
    period: '2026年',
    tags: ['Node.js', 'Swift', 'Stream Deck SDK', 'SVG', 'macOS'],
    image: 'img/works/streamdeck-pets.webp',
    imageAlt: 'ネコ・トリ・ロボットのドットエがキーの上に出ている画面',
    description:
      'キーの上に生き物を1ひきおきます。' +
      '打っている間はアルき、手を止めるとスワり、はなれてしばらくするとネむります。' +
      '押すとなでられてヨロコびます。' +
      'ホウっておいてもヨワりませんし、死にません。' +
      'しごとチュウに「エサをやらないと」と思わせる道グは、つくえの上におきつづけてもらえないからです。' +
      'エは16かける16のドットをモジ列で持っていて、SVGのシカクにかえて描いています。画ゾウファイルはありません。' +
      '色は生き物ごとに決まっていて、ソダつと大きくなり、かざりの色と外がわの光りかたが変わります。' +
      '前は色でソダちを表していたのですが、それだと4シュルイが同じ色になり、' +
      'どれも同じ生き物に見えたので作りなおしました。' +
      'ユウりょうバンでは4シュルイから選べて、ソダちかたを「押した回数」と「おいてからの時間」から選べます。',
    links: []
  },
  {
    id: 'bomb-sorter',
    title: 'Bomb Sorter',
    subtitle: 'たて持ちでもヨコ持ちでもアソべるタッチアクション',
    period: '2026年',
    tags: ['TypeScript', 'Canvas', 'Vite', 'PWA', 'Playwright'],
    image: 'img/works/bomb-sorter.webp',
    imageAlt: 'タイトル画面と、ボムすけがアルき回るプレイ中の画面',
    description:
      'アルき回る「ボムすけ」を、同じ色のハコへユビで入れて仕分けるスマホ向けのゲームです。' +
      'たて持ちならオヤユビのトドく下に、ヨコ持ちなら左右のハシにハコが出ます。' +
      'どちらもミジカい方のヘンを360に固定してあるので、当たり判定もムズカしさも同じになり、' +
      'キロクをコウヘイに比べられます。' +
      '時間が立つほど、出てくる間かく・同時にいられる数・ドウカセンの長さ・アルくはやさの4つが変わっていきます。',
    links: [
      { type: 'popup', url: 'https://kanade0525.github.io/bomb-sorter/', size: { w: 414, h: 896 } },
      { type: 'repo', url: 'https://github.com/kanade0525/bomb-sorter' }
    ]
  },
  {
    id: 'pixel-forge',
    title: 'Pixel Forge',
    subtitle: '写真をドットエに変えるブラウザツール',
    period: '2026年',
    tags: ['TypeScript', 'Vite', 'Canvas', 'Vitest'],
    image: 'img/works/pixel-forge.webp',
    imageAlt: '海べの写真が64x64のドットエに変かんされている画面',
    description:
      '自作ゲームのソ材を作るために、写真やイラストを16x16などのドットエに変えるツールです。' +
      '色をヘらすときは、見た目のチガいがそのまま長さになるCIELABという色の空間で、' +
      'いちばん近い色を当てています。' +
      'ディザは、ベイヤーのコウシと、フロイド-スタインバーグのゴサカクサンの2通りを作りました。' +
      'ゲームボーイやPICO-8などのパレットを同こんしていて、自分のパレットも読ませられます。' +
      'すべてブラウザの中だけで動くので、画像はどこにも上がりません。',
    links: [
      { type: 'demo', url: 'https://kanade0525.github.io/pixel-forge/' },
      { type: 'repo', url: 'https://github.com/kanade0525/pixel-forge' }
    ]
  },
  {
    id: 'oyayubi-dojo',
    title: 'オヤユビシフトタイピング道場',
    subtitle: '同時打ケンのズレをミリ秒で見せる',
    period: '2026年',
    tags: ['JavaScript', 'Web Audio', 'localStorage', 'CSP'],
    image: 'img/works/oyayubi-dojo.webp',
    imageAlt: 'お題とズレの目もり、NICOLAハイレツのキーボードがならんだレンシュウ画面',
    description:
      'オヤユビシフト(NICOLAハイレツ)のレンシュウサイトです。' +
      '先にあるサイトは打った時こくを計っておらず、上手くなっているかが本人に見えませんでした。' +
      'この道場は文字キーとオヤユビキーを押した時こくを取り、そのズレをリズムゲームのようにハンテイして返します。' +
      'オヤユビが先か後かを必ず出すのがキモで、先すぎる人とオソい人では直し方が反対だからです。' +
      '音でも返していて、先行なら低から高、オクれなら高から低にナります。' +
      'いぞんパッケージは一つも使わず、キロクもこのタンマツの中だけにおいています。',
    links: [
      { type: 'demo', url: 'https://kanade0525.github.io/oyayubi-dojo/' },
      { type: 'repo', url: 'https://github.com/kanade0525/oyayubi-dojo' }
    ]
  },
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
    subtitle: 'カイダンを集めてYouTubeに出すまでを自動化',
    period: '2026年',
    tags: ['Python', 'NiceGUI', 'VOICEVOX', 'Gemini API', 'FFmpeg', 'Docker'],
    image: 'img/works/kaidan-video-generator.webp',
    imageAlt: 'カイダン動画がならんだYouTubeチャンネルの画面',
    description:
      'ストーリーの取トクからテキスト処理、VOICEVOXでの音声合成、Geminiでの画像生成、' +
      'FFmpegでの動画合成、YouTubeへのトウコウまでを一気に自動化するシステムです。' +
      '長尺とショート動画の2系トウを同じパイプラインの上で動かしています。',
    links: [
      { type: 'video', url: 'https://www.youtube.com/channel/UC53lt_Wv9_tw9i_X5Nl964g' },
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
    links: [
      { type: 'demo', url: 'https://minnano-shuden.com/' }
    ]
  },
  {
    id: 'roguelike-game',
    title: 'Katabasis - 不思議のダンジョン風ローグライク',
    subtitle: '入るたびに形の変わるダンジョンをタンサクする',
    period: '2026年',
    tags: ['Nuxt 3', 'TypeScript', 'Phaser 3', 'Pinia', 'rot.js'],
    image: 'img/works/roguelike-game.webp',
    imageAlt: 'ダンジョンでテキと向かい合っているゲーム画面',
    description:
      '入るたびに形の変わるダンジョンをタンサクするターン制ローグライクです。' +
      'ゲームのルールを持つ部分とPhaserでの表示を分けて、' +
      'ゲームの中身だけを取り出してテストできる形にしています。',
    links: [
      { type: 'demo', url: 'https://main.dwvswzjen7o0t.amplifyapp.com/' },
      { type: 'repo', url: 'https://github.com/kanade0525/roguelike-game' }
    ]
  },
  {
    id: 'izakaya-tetris',
    title: 'イザカヤブロックオとし',
    subtitle: 'ノみ食いするたびにブロックがオちてくる',
    period: '2026年',
    tags: ['Nuxt 3', 'TypeScript', 'Vue', 'Amplify'],
    image: 'img/works/izakaya-tetris.webp',
    imageAlt: '色とりどりのブロックでうまったバン面',
    description:
      'ゲームオーバーになったバン面から始めます。イザカヤで一品食べるたび、一パイノむたびに' +
      'ストックが1つたまり、ストックを使うとブロックが1つオちてきます。' +
      'いちばん下の行をそろえたらクリアです。YouTubeで見かけたアソび方を、そのままアプリにしました。',
    links: [
      { type: 'demo', url: 'https://main.d3d78wsrha6lcy.amplifyapp.com/' },
      { type: 'video', url: 'https://youtu.be/9S2_bQ4ICKI' },
      { type: 'repo', url: 'https://github.com/kanade0525/izakaya-tetris' }
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
      { type: 'store', url: 'https://chromewebstore.google.com/detail/jieopjdgnkkcioocfkhegoekflngmjnd' },
      { type: 'repo', url: 'https://github.com/kanade0525/cron-translator-extension' }
    ]
  },
  {
    id: 'splatoon-linebot',
    title: 'スプラトゥーン3のスケジュールジョウホウを定期的にLINEで通知できるようにした',
    subtitle: 'オープンマッチの予定を毎日LINEに送る',
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
