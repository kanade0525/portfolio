#!/usr/bin/env node
/**
 * WORKSのカード画像(img/works/<id>.webp)を、実際のサイトを開いて撮る。
 *
 * カードは 800x450(16:9)に揃えないと並びが崩れるので、
 * 撮影から書き出しまでを一続きにしてサイズを間違えられないようにしてある。
 *
 *   npm run shot -- <URL> <id> [オプション]
 *
 *     --phone            スマホのワクに2枚ならべる(SPLIBILLORやBomb Sorterと同じ見た目)
 *     --upload <ファイル> 画像を読ませるツールに、そのファイルを食わせてから撮る
 *     --click <文字>     撮る前に押すもの。書いた順に押す。何度でも指定できる
 *     --wait <ミリ秒>    押したあとの待ち時間(既定 2500)
 *     --width <px>       デスクトップのときの横幅(既定 1280)。高さは16:9で決まる
 *     --bg <色>          --phone のときの下じきの色(既定 #1d2130)
 *     --keep             切り出す前のPNGを消さずに残す
 *
 * 例:
 *   npm run shot -- https://kanade0525.github.io/pixel-forge/ pixel-forge \
 *     --width 1440 --upload 見本.png --click スキップ --click 64×64
 *
 *   npm run shot -- https://kanade0525.github.io/bomb-sorter/ bomb-sorter \
 *     --phone --click Start --bg '#1d2130'
 *
 * --phone は「押す前」と「押したあと」の2枚を並べる。
 * ゲームならタイトル画面とプレイ中の画面になる。
 */

import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------------ *
 * 引数
 * ------------------------------------------------------------------ */

function parseArgs(argv) {
  const opts = { clicks: [], wait: 2500, width: 1280, bg: '#1d2130', phone: false, keep: false };
  const rest = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--phone') opts.phone = true;
    else if (a === '--keep') opts.keep = true;
    else if (a === '--click') opts.clicks.push(argv[++i]);
    else if (a === '--upload') opts.upload = argv[++i];
    else if (a === '--wait') opts.wait = Number(argv[++i]);
    else if (a === '--width') opts.width = Number(argv[++i]);
    else if (a === '--bg') opts.bg = argv[++i];
    else if (a.startsWith('--')) die(`知らないオプションです: ${a}`);
    else rest.push(a);
  }

  [opts.url, opts.id] = rest;
  if (!opts.url || !opts.id) die('URLとidの2つが要ります。使い方はこのファイルの先頭に書いてあります');
  if (!/^https?:\/\//.test(opts.url)) die(`URLがおかしいです: ${opts.url}`);
  if (!/^[a-z0-9-]+$/.test(opts.id)) die(`idは半角小文字とハイフンだけにしてください: ${opts.id}`);
  if (!Number.isFinite(opts.wait) || !Number.isFinite(opts.width)) die('--wait と --width は数字で');
  if (opts.upload && !existsSync(opts.upload)) die(`--upload のファイルがありません: ${opts.upload}`);

  return opts;
}

function die(msg) {
  console.error(`エラー: ${msg}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * 撮る
 * ------------------------------------------------------------------ */

/** 画像を読ませるツール向け。<input type="file"> にファイルを渡す */
async function upload(page, path, wait) {
  if (!path) return;
  const input = page.locator('input[type=file]').first();
  if (!(await input.count())) die('このページに <input type="file"> がありません');
  await input.setInputFiles(path);
  await page.waitForTimeout(wait);
}

/**
 * 指定された文字のボタンを順に押す。無ければ黙って進まず、理由を出して止める。
 *
 * ボタンとして先に探す。ただの文字として探すと、同じ文字が説明文にも出ているとき
 * そちらを掴んでしまい、押せずに止まる。
 */
async function click(page, labels, wait) {
  for (const label of labels) {
    const asButton = page.getByRole('button', { name: label, exact: false });
    const target = (await asButton.count())
      ? asButton.first()
      : page.getByText(label, { exact: false }).first();
    try {
      await target.click({ timeout: 15000 });
    } catch {
      die(
        `「${label}」が押せませんでした。\n` +
        '     画面に出ている文字とぴったり合っているか確かめてください' +
        '(「64×64」の×は全角、など)'
      );
    }
    await page.waitForTimeout(wait);
  }
}

async function shootDesktop(opts, tmp) {
  const height = Math.round((opts.width * 9) / 16);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: opts.width, height },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();

  await page.goto(opts.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await upload(page, opts.upload, opts.wait);
  await click(page, opts.clicks, opts.wait);

  const shot = join(tmp, 'desktop.png');
  await page.screenshot({ path: shot });
  await browser.close();

  console.log(`撮影 ${opts.width}x${height} (16:9)`);
  return shot;
}

async function shootPhone(opts, tmp) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await ctx.newPage();

  await page.goto(opts.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await upload(page, opts.upload, opts.wait);

  // 1枚目は押す前。ゲームならタイトル画面になる
  const before = join(tmp, 'phone-1.png');
  await page.screenshot({ path: before });

  await click(page, opts.clicks, opts.wait);

  const after = join(tmp, 'phone-2.png');
  await page.screenshot({ path: after });
  await browser.close();

  console.log('撮影 390x844 を2枚(押す前 / 押したあと)');
  return [before, after];
}

/* ------------------------------------------------------------------ *
 * 書き出す
 * ------------------------------------------------------------------ */

function requireMagick() {
  try {
    execFileSync('magick', ['-version'], { stdio: 'ignore' });
  } catch {
    die('ImageMagickの magick が見つかりません。`brew install imagemagick` で入ります');
  }
}

function writeCard(shot, out) {
  execFileSync('magick', [shot, '-resize', '800x450', '-quality', '84', out]);
}

function writePhoneCard(shots, out, bg) {
  execFileSync('bash', [join(ROOT, 'tools/make-phone-mockup.sh'), shots[0], shots[1], out, bg]);
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */

const opts = parseArgs(process.argv.slice(2));
requireMagick();

const out = join(ROOT, 'img/works', `${opts.id}.webp`);
const existed = existsSync(out);
const tmp = mkdtempSync(join(tmpdir(), 'shoot-work-'));

try {
  if (opts.phone) {
    writePhoneCard(await shootPhone(opts, tmp), out, opts.bg);
  } else {
    writeCard(await shootDesktop(opts, tmp), out);
  }
} finally {
  if (opts.keep) console.log(`途中のPNG: ${tmp}`);
  else rmSync(tmp, { recursive: true, force: true });
}

const size = execFileSync('magick', ['identify', '-format', '%wx%h %b', out]).toString();
console.log(`${existed ? '上書き' : '書き出し'} img/works/${opts.id}.webp  ${size}`);
console.log(
  '\n目で見て確かめてください:\n' +
  '  - ブラウザのタブやアカウント名が写り込んでいないか\n' +
  '  - 何を作ったのかがカードの大きさでも分かるか\n' +
  `  open img/works/${opts.id}.webp`
);
