#!/usr/bin/env node
/**
 * サイトを実際にブラウザで開いて、表示が壊れていないか調べる。
 *
 * WORKSとSKILLはデータから組み立てているので、1件足したときに
 * 「配列には居るが画面には出ていない」「画像だけ404」といった壊れ方をする。
 * 目で見ても気づきにくいので、機械で見る。
 *
 *   npm run check:site                 手元のファイルを見る
 *   npm run check:site -- --prod       公開中のサイトを見る
 *   npm run check:site -- --url <URL>  好きなURLを見る
 *   npm run check:site -- --shot       画面の写しを /tmp に残す
 *
 * 調べていること:
 *   1. WORKS/SKILLの件数が、配列の長さと合っているか
 *   2. カードとダイアログの画像がすべて読めているか(404や名前の打ちマチガい)
 *   3. ダイアログが開いて閉じるか、リンクが1本も欠けていないか
 *   4. Consoleのエラーと400番台・500番台の応答が無いか
 *   5. せまい画面で、トップの窓がWORKSに重なっていないか / 横にはみ出していないか
 */

import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROD = 'https://kanade0525.github.io/portfolio/';

/** 重なりを見る画面の大きさ。せまい方から広い方まで */
const VIEWPORTS = [
  { w: 390, h: 844 },   // iPhone 14
  { w: 430, h: 932 },   // iPhone 15 Pro Max
  { w: 768, h: 1024 },  // タブレット。1カラムと2カラムの境目
  { w: 1280, h: 900 }
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.otf': 'font/otf',
  '.woff2': 'font/woff2'
};

const failures = [];
const fail = (msg) => failures.push(msg);

/* ------------------------------------------------------------------ *
 * 手元のファイルを配るだけのサーバー
 *
 * file:// でも開けるサイトだが、fetchやCSPの効き方が本番と変わるので、
 * 本番と同じHTTPで見る。依存を増やしたくないので自前で立てる。
 * ------------------------------------------------------------------ */

function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(req.url.split('?')[0]);
    const rel = normalize(path === '/' ? '/index.html' : path).replace(/^(\.\.[/\\])+/, '');
    try {
      const body = await readFile(join(ROOT, rel));
      const ext = rel.slice(rel.lastIndexOf('.'));
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() });
    });
  });
}

/* ------------------------------------------------------------------ *
 * 調べる
 * ------------------------------------------------------------------ */

/** 1〜4。読み込み時のエラーも拾いたいので、ページを開くところからここでやる */
async function checkContents(browser, url, shot) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const noise = [];
  page.on('console', (m) => { if (m.type() === 'error') noise.push(`Console: ${m.text()}`); });
  page.on('pageerror', (e) => noise.push(`例外: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400) noise.push(`HTTP ${r.status()}: ${r.url()}`);
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  /* --- 1. 件数 --- */
  const counts = await page.evaluate(() => ({
    works: window.WORKS.length,
    worksCards: document.querySelectorAll('.works-item').length,
    worksDialogs: document.querySelectorAll('#works-dialogs dialog').length,
    skills: window.SKILLS.length,
    skillItems: document.querySelectorAll('.skill-item').length
  }));

  if (counts.worksCards !== counts.works) {
    fail(`WORKSのカードが ${counts.worksCards}枚。配列は ${counts.works}件`);
  }
  if (counts.worksDialogs !== counts.works) {
    fail(`WORKSのダイアログが ${counts.worksDialogs}個。配列は ${counts.works}件`);
  }
  if (counts.skillItems !== counts.skills) {
    fail(`SKILLが ${counts.skillItems}件。配列は ${counts.skills}件`);
  }
  console.log(`WORKS ${counts.worksCards}件 / SKILL ${counts.skillItems}件`);

  /* --- 2. カード画像 --- */
  //
  // 「読める」「16:9」だけでは、中身が真っ白でも通ってしまう。
  // 実際に一度、撮影ツールが壊れて全カードがChromeのエラー画面になり、
  // それが検査を素通りして公開された。中身も見る。
  //   ・32x18に縮めた色の数とばらつき（壊れた画面は 色数5 / ばらつき2.3）
  //   ・別の作品なのに画素が完全に同じでないか（撮影の失敗はたいてい全部同じになる）
  // 本物の最小は 色数10 / ばらつき6.2 だったので、下に余裕を取って 8 と 4 にする。
  const cardImgs = await page.evaluate(async () => {
    const out = [];
    for (const i of document.querySelectorAll('.works-img img')) {
      const r = {
        src: i.getAttribute('src'),
        ok: i.naturalWidth > 0,
        w: i.naturalWidth,
        h: i.naturalHeight,
        alt: i.getAttribute('alt') || '',
        colors: null, sd: null, hash: null
      };
      if (r.ok) {
        const c = document.createElement('canvas');
        c.width = 32; c.height = 18;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(i, 0, 0, 32, 18);
        const d = g.getImageData(0, 0, 32, 18).data;
        const set = new Set();
        let sum = 0, sq = 0, n = 0, h = 0;
        for (let k = 0; k < d.length; k += 4) {
          const v = (d[k] * 299 + d[k + 1] * 587 + d[k + 2] * 114) / 1000;
          set.add((d[k] >> 4) << 8 | (d[k + 1] >> 4) << 4 | (d[k + 2] >> 4));
          sum += v; sq += v * v; n++;
          h = (h * 31 + d[k] + d[k + 1] * 3 + d[k + 2] * 7) >>> 0;
        }
        const mean = sum / n;
        r.colors = set.size;
        r.sd = Math.round(Math.sqrt(sq / n - mean * mean) * 10) / 10;
        r.hash = h;
      }
      out.push(r);
    }
    return out;
  });

  const seen = new Map();
  for (const img of cardImgs) {
    if (!img.ok) { fail(`カード画像が読めません: ${img.src}`); continue; }
    // 16:9でないと並びの高さが揃わない
    if (img.w * 9 !== img.h * 16) fail(`カード画像が16:9ではありません: ${img.src} (${img.w}x${img.h})`);
    if (!img.alt.trim()) fail(`imageAltが空です: ${img.src}`);
    if (img.colors < 8 && img.sd < 4) {
      fail(`カード画像がほぼ一色です。撮影に失敗していませんか: ${img.src} (色数${img.colors} / ばらつき${img.sd})`);
    }
    const same = seen.get(img.hash);
    if (same) fail(`別の作品なのにカード画像が同じです: ${same} と ${img.src}`);
    else seen.set(img.hash, img.src);
  }

  /* --- 3. ダイアログ --- */
  const works = await page.evaluate(() =>
    window.WORKS.map((w) => ({ id: w.id, links: w.links.length, title: w.title }))
  );

  for (const w of works) {
    const card = page.locator(`.works-item[aria-controls="dialog-${w.id}"]`);
    if (!(await card.count())) {
      fail(`カードが見つかりません: ${w.id}`);
      continue;
    }

    await card.click();
    await page.waitForTimeout(400);

    const state = await page.evaluate((id) => {
      const d = document.getElementById('dialog-' + id);
      if (!d) return null;
      const img = d.querySelector('.dialog-img-wrapper img');
      return {
        open: d.open,
        imgOk: !!img && img.naturalWidth > 0,
        imgSrc: img ? img.getAttribute('src') : null,
        links: [...d.querySelectorAll('.dialog-menu a')].map((a) => a.getAttribute('href') || '')
      };
    }, w.id);

    if (!state) {
      fail(`ダイアログがありません: dialog-${w.id}`);
      continue;
    }
    if (!state.open) fail(`ダイアログが開きません: ${w.id}`);
    if (!state.imgOk) fail(`ダイアログの画像が読めません: ${w.id} (${state.imgSrc})`);
    // 数が減っていたら render.js のLINK_TYPESに無いtypeを書いている
    if (state.links.length !== w.links) {
      fail(`${w.id} のリンクが ${state.links.length}本。データは ${w.links}本。` +
           'js/render.js のLINK_TYPESに無いtypeを書いていませんか');
    }
    for (const href of state.links) {
      if (!/^https?:\/\//.test(href)) fail(`${w.id} のリンク先がURLではありません: ${href}`);
    }

    if (shot && state.open) {
      await page.screenshot({ path: `/tmp/portfolio-dialog-${w.id}.png` });
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
  }
  console.log(`ダイアログ ${works.length}件を開いて閉じた`);

  /* --- 4. エラー --- */
  // ダイアログを開いたあとに出る404もあるので、ここまで待ってから見る
  for (const n of [...new Set(noise)]) fail(n);
  if (!noise.length) console.log('Consoleエラー・400番台の応答ともに無し');

  await ctx.close();
}

/** 5。画面の大きさを変えて、重なりと横のはみ出しを測る */
async function checkLayout(browser, url, shot) {
  for (const { w, h } of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      isMobile: w < 500,
      hasTouch: w < 500
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const m = await page.evaluate(() => {
      const y = window.scrollY;
      const box = (sel) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect() : null;
      };
      const win = box('.dq-window.mv-window.is-bottom');
      const works = box('#works');
      return {
        winBottom: win ? Math.round(win.bottom + y) : null,
        worksTop: works ? Math.round(works.top + y) : null,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });

    if (m.winBottom === null || m.worksTop === null) {
      fail(`${w}x${h}: トップの窓かWORKSが見つかりません`);
    } else {
      const gap = m.worksTop - m.winBottom;
      // トップの窓の高さを固定すると、あふれた分がWORKSに重なる(過去に起きた)
      if (gap < 0) fail(`${w}x${h}: トップの窓がWORKSに ${-gap}px 重なっています`);
      console.log(`${String(w).padStart(4)}x${h}  窓の下端 ${m.winBottom} / WORKS ${m.worksTop} (すきま ${gap}px)`);
    }
    if (m.overflow > 0) fail(`${w}x${h}: 横に ${m.overflow}px はみ出しています`);

    if (shot) await page.screenshot({ path: `/tmp/portfolio-${w}x${h}.png`, fullPage: true });
    await ctx.close();
  }
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const shot = argv.includes('--shot');
const urlAt = argv.indexOf('--url');
const target = urlAt >= 0 ? argv[urlAt + 1] : argv.includes('--prod') ? PROD : null;

const server = target ? null : await serve();
const url = target || server.url;

console.log(`見ているもの: ${url}\n`);

const browser = await chromium.launch();
try {
  await checkContents(browser, url, shot);
  console.log('');
  await checkLayout(browser, url, shot);
} finally {
  await browser.close();
  if (server) server.close();
}

if (shot) console.log('\n画面の写し: /tmp/portfolio-*.png');

if (failures.length) {
  console.error(`\nNG: ${failures.length}件`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('\nOK: 表示は壊れていません');
