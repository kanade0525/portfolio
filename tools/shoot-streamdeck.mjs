// Stream Deck プラグインの WORKS 用カード画像を作る。
//
// ふつうの作品は tools/shoot-work.mjs でサイトを撮るが、プラグインには
// サイトが無い。各リポジトリの描画モジュールを直接呼んで、キーの絵を並べる。
//
// 隣り合ったリポジトリを読むので、~/development/ に4本が揃っている必要がある。
//   npm run shot:sd
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const DEV = join(homedir(), 'development');
const OUT = 'img/works';
const TMP = mkdtempSync(join(tmpdir(), 'shoot-sd-'));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const combo = await import(join(DEV, 'streamdeck-combo-counter/com.kanade0525.combocounter.sdPlugin/bin/draw.js'));
const watch = await import(join(DEV, 'streamdeck-server-watch/com.kanade0525.serverwatch.sdPlugin/bin/draw.js'));
const wstate = await import(join(DEV, 'streamdeck-server-watch/com.kanade0525.serverwatch.sdPlugin/bin/watch-state.js'));
const day = await import(join(DEV, 'streamdeck-daycount/com.kanade0525.daycount.sdPlugin/bin/draw.js'));
const pets = await import(join(DEV, 'streamdeck-pets/plugin/bin/draw.js'));

/** 実機のキーに近い見え方にする。黒い枠の中に少し小さく置く */
const key = (svg) => `<div class="key">${svg}</div>`;

const CARDS = {
  'streamdeck-combo-counter': [
    combo.comboImage({ mode: 0, combo: 128, best: 128, todayTotal: 0, perMinute: 0, broken: false, breakT: 0, isRecord: true }),
    combo.comboImage({ mode: 0, combo: 47, best: 128, todayTotal: 0, perMinute: 0, broken: false, breakT: 0, isRecord: false }),
    combo.comboImage({ mode: 1, combo: 0, best: 412, todayTotal: 0, perMinute: 0, broken: false, breakT: 0, isRecord: false }),
  ],
  'streamdeck-server-watch': [
    watch.watchImage({ status: wstate.STATUS.up, lastMs: 38, name: 'api', downFor: 0 }),
    watch.watchImage({ status: wstate.STATUS.suspect, lastMs: 512, name: 'db', downFor: 0 }),
    watch.watchImage({ status: wstate.STATUS.down, lastMs: null, name: 'web', downFor: 8 * 60_000 }),
  ],
  'streamdeck-daycount': [
    day.dayImage({ days: 42, state: 'future', label: 'DAYS LEFT', name: 'RELEASE' }),
    day.dayImage({ days: 3, state: 'near', label: 'DAYS LEFT', name: 'DEADLINE' }),
    day.dayImage({ days: 127, state: 'since', label: 'NO INCIDENT', name: '' }),
  ],
  'streamdeck-pets': [
    pets.petImage({ species: 'cat', mood: 'awake', frame: 0, stage: 3 }),
    pets.petImage({ species: 'bird', mood: 'awake', frame: 0, stage: 2 }),
    pets.petImage({ species: 'robot', mood: 'dozing', frame: 0, stage: 1 }),
  ],
};

for (const [id, svgs] of Object.entries(CARDS)) {
  const html = `<style>
    html,body{margin:0;height:100%}
    body{background:#0e1114;display:flex;align-items:center;justify-content:center;gap:56px}
    .key{width:400px;height:400px}
    .key svg{width:100%;height:100%;display:block;image-rendering:pixelated}
  </style>${svgs.map(key).join('')}`;
  const page = join(TMP, `${id}.html`);
  writeFileSync(page, html);
  execFileSync(CHROME, ['--headless', '--disable-gpu', `--screenshot=${join(TMP, `${id}.png`)}`,
    '--window-size=1600,900', '--virtual-time-budget=3000', `file://${page}`],
    { stdio: 'ignore' });
  // カードは 800x450。shoot-work.mjs と同じく magick で webp にする
  execFileSync('magick', [join(TMP, `${id}.png`), '-resize', '800x450', '-quality', '84',
    join(OUT, `${id}.webp`)]);
  console.log(`撮った: ${OUT}/${id}.webp`);
}
rmSync(TMP, { recursive: true, force: true });
