/**
 * SKILLに並べるスキル。
 *
 *   id            … 識別用。半角英数とハイフンで
 *   name          … 見出し
 *   colorClass    … 見出しの色。css/style.css の .is-xxx に対応
 *   level         … 習熟度(0-100)。progressバーの値になる
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
    text: 'ドク学の期間も合わせると6〜7年ほど使っています。今もいちばん多く書いている言語です。'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    colorClass: 'is-javascript',
    level: 75,
    text: 'Vue.jsやcoffee scriptのほか、ChromeのカクチョウキノウやGASを作るのにも使っています。'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    colorClass: 'is-typescript',
    level: 65,
    text: 'Nuxt 3で作るものはキ本的にTypeScriptで書いています。後から直すときの安心感がちがいます。'
  },
  {
    id: 'vue',
    name: 'Vue.js / Nuxt 3',
    colorClass: 'is-vue',
    level: 70,
    text: 'ゲームやシュウデンの一ランなど、個人で作るものはNuxt 3で作ることが多いです。'
  },
  {
    id: 'html-css',
    name: 'HTML5 / CSS3',
    colorClass: 'is-html',
    level: 75,
    text: '在学中のインターンシップでサワっていたこともあり、調べながらであれば自走できます。CSSだけでショウワレトロな見た目を作るフレームワークも公開しました。'
  },
  {
    id: 'python',
    name: 'Python',
    colorClass: 'is-python',
    level: 60,
    text: 'カイダン動画の自動生成やホジョ金の通知など、AWS Lambdaで動かす道具を作るのに使っています。'
  },
  {
    id: 'sql',
    name: 'SQL',
    colorClass: 'is-sql',
    level: 80,
    text: 'キ本的なソウサは一通り行えます。取トクできないデータは無い(はず)です。'
  },
  {
    id: 'aws',
    name: 'AWS',
    colorClass: 'is-aws',
    level: 80,
    text: '仕事ではVPCを作るところからはじめて、EC2とALBの上でサービスを動かしています。CodePipelineとCodeDeployで自動デプロイまでつなぎ、そのあとのウン用やカン視も見ています。コジンではSAMやCloudFormationを書いて、サーバーレスのものを作っています。',
    notes: [
      '仕事 … VPC / EC2 / ALB / CodePipeline / CodeDeploy',
      'コジン … Lambda / API Gateway / DynamoDB / SAM / CloudFormation',
      'そのほか … S3 / CloudFront / Route 53 / EventBridge'
    ]
  },
  {
    id: 'docker',
    name: 'Docker',
    colorClass: 'is-docker',
    level: 75,
    text: '開発カンキョウはDockerで作ることが多く、手元と同じ形でどこでも動かせるようにしています。CIでのテストやビルドにも使っています。しくみのほうも人に説明できます。Qiitaに書いた解説記事は190人以上にLGTMをもらいました。'
  },
  {
    id: 'linux',
    name: 'Linux',
    colorClass: 'is-linux',
    level: 60,
    text: 'キ本的なソウサは一通り行えます。shell scriptやcronを書いて業ムをコウリツ化しています。'
  },
  {
    id: 'performance',
    name: 'Performance Tuning',
    colorClass: 'is-perf',
    level: 70,
    text: 'New Relicで計そくして、どこがおそいのかを見つけるところから始めます。SQLの書き直しやインデックスの追加で、自社のサービスが実さいにサクサク動くようになりました。'
  },
  {
    id: 'pm',
    name: 'Project Management',
    colorClass: 'is-pm',
    level: 65,
    text: '見つもりからWBSを作り、毎日の進み具合を見るところまでやっています。一度きりではなく、今もその立場にいます。生成AIを使って見つもりやWBSを作るやり方は、Qiitaにも書きました。'
  },
  {
    id: 'excel',
    name: 'Excel',
    colorClass: 'is-excel',
    level: 60,
    text: 'キ本的な関数に加え、業ムコウリツ化のためのVBAマクロを作成したりしています。'
  },
  {
    id: 'english',
    name: 'English',
    colorClass: 'is-english',
    level: 80,
    text: '大学入学当初は英語教員になりたいと思っていたため力を入れてガクシュウしていました。',
    notes: ['エイケン ジュン1キュウ', 'TOEIC 775点']
  }
];
