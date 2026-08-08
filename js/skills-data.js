/**
 * SKILLに並べるスキル。
 *
 *   id            … 識別用。半角英数とハイフンで
 *   name          … 見出し
 *   colorClass    … 見出しの色。css/style.css の .is-xxx に対応
 *   level         … 習熟度(0-100)。progressバーの値になる
 *   progressClass … バーの色。nes.cssの is-primary / is-success / is-warning / is-error
 *   text          … 説明
 *   notes         … 箇条書きにしたいものがあれば(省略可)
 *
 * 本文に使える漢字はNuあんこもちに収録された612字だけなので、
 * 書き換えたら必ず `npm run check:font` を通すこと。
 */
window.SKILLS = [
  {
    id: 'ruby',
    name: 'Ruby (Rails)',
    colorClass: 'is-ruby',
    level: 80,
    progressClass: 'is-success',
    text: 'ドク学の期間も合わせると6〜7年ほど使っています。今もいちばん多く書いている言語です。'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    colorClass: 'is-javascript',
    level: 75,
    progressClass: 'is-success',
    text: 'Vue.jsやcoffee scriptのほか、ChromeのカクチョウキノウやGASを作るのにも使っています。'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    colorClass: 'is-typescript',
    level: 65,
    progressClass: 'is-primary',
    text: 'Nuxt 3で作るものはキ本的にTypeScriptで書いています。後から直すときの安心感がちがいます。'
  },
  {
    id: 'vue',
    name: 'Vue.js / Nuxt 3',
    colorClass: 'is-vue',
    level: 70,
    progressClass: 'is-success',
    text: 'ゲームやシュウデンの一ランなど、個人で作るものはNuxt 3で作ることが多いです。'
  },
  {
    id: 'html-css',
    name: 'HTML5 / CSS3',
    colorClass: 'is-html',
    level: 75,
    progressClass: 'is-success',
    text: '在学中のインターンシップでサワっていたこともあり、調べながらであれば自走できます。CSSだけでショウワレトロな見た目を作るフレームワークも公開しました。'
  },
  {
    id: 'python',
    name: 'Python',
    colorClass: 'is-python',
    level: 60,
    progressClass: 'is-primary',
    text: 'カイダン動画の自動生成やホジョ金の通知など、AWS Lambdaで動かす道具を作るのに使っています。'
  },
  {
    id: 'sql',
    name: 'SQL',
    colorClass: 'is-sql',
    level: 80,
    progressClass: 'is-success',
    text: 'キ本的なソウサは一通り行えます。取トクできないデータは無い(はず)です。'
  },
  {
    id: 'aws',
    name: 'AWS',
    colorClass: 'is-aws',
    level: 65,
    progressClass: 'is-primary',
    text: 'Lambda・SAM・EventBridge・S3をつないで、サーバーレスの小さなシステムを作って動かしています。'
  },
  {
    id: 'docker',
    name: 'Docker',
    colorClass: 'is-docker',
    level: 55,
    progressClass: 'is-warning',
    text: '開発カンキョウはDockerで作ることが多く、手元と同じ形でどこでも動かせるようにしています。'
  },
  {
    id: 'linux',
    name: 'Linux',
    colorClass: 'is-linux',
    level: 60,
    progressClass: 'is-primary',
    text: 'キ本的なソウサは一通り行えます。shell scriptやcronを書いて業ムをコウリツ化しています。'
  },
  {
    id: 'genai',
    name: 'セイセイAIの活用',
    colorClass: 'is-ai',
    level: 65,
    progressClass: 'is-primary',
    text: 'Gemini APIを使って、画像やテキストを作るシステムを動かしています。コードを書くときもAIに手伝ってもらいながら進めるのが当たり前になりました。'
  },
  {
    id: 'excel',
    name: 'Excel',
    colorClass: 'is-excel',
    level: 60,
    progressClass: 'is-primary',
    text: 'キ本的な関数に加え、業ムコウリツ化のためのVBAマクロを作成したりしています。'
  },
  {
    id: 'english',
    name: 'English',
    colorClass: 'is-english',
    level: 80,
    progressClass: 'is-success',
    text: '大学入学当初は英語教員になりたいと思っていたため力を入れてガクシュウしていました。',
    notes: ['エイケン ジュン1キュウ', 'TOEIC 775点']
  }
];
