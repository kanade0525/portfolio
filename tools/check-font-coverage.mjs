#!/usr/bin/env node
/**
 * Nuあんこもち(NuAnkoMochi-Reg.otf)に収録されていない文字を検出する。
 *
 * このサイトは body 全体にNuあんこもちを適用しているが、このフォントは
 * 漢字を612字しか収録していない。未収録の文字はグリフが無く字面が崩れるため、
 * 本文では1文字単位でカタカナに置換している(「独学」→「ドク学」など)。
 * 目視では必ず取りこぼすので機械的に検出する。
 *
 *   npm run check:font          未収録文字を検出する(見つかれば exit 1)
 *   npm run check:font -- --list  収録されている漢字の一覧を表示する
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FONT_PATH = join(
  ROOT,
  'font/NuAnkoMochi-v1.0.0-20200104/Nuあんこもち/NuAnkoMochi-Reg.otf'
);

/** チェック対象。存在しないものは黙って読み飛ばす */
const TARGETS = ['index.html', 'js/works-data.js', 'js/skills-data.js'];

/* ------------------------------------------------------------------ *
 * OTFのcmapテーブルから収録コードポイントを読み出す
 * ------------------------------------------------------------------ */

function readCmap(path) {
  const buf = readFileSync(path);
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  const numTables = view.getUint16(4);
  let cmapOffset = -1;
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    const tag = String.fromCharCode(
      buf[rec], buf[rec + 1], buf[rec + 2], buf[rec + 3]
    );
    if (tag === 'cmap') cmapOffset = view.getUint32(rec + 8);
  }
  if (cmapOffset < 0) throw new Error(`cmapテーブルが見つかりません: ${path}`);

  // サブテーブルはformat 12を優先し、無ければformat 4を使う
  const numSub = view.getUint16(cmapOffset + 2);
  let best = null;
  for (let i = 0; i < numSub; i++) {
    const sub = cmapOffset + view.getUint32(cmapOffset + 8 + i * 8);
    const format = view.getUint16(sub);
    if (format === 12) best = { format, sub };
    else if (format === 4 && !best) best = { format, sub };
  }
  if (!best) throw new Error('対応するcmapサブテーブルがありません (format 4/12)');

  return best.format === 12
    ? readFormat12(view, best.sub)
    : readFormat4(view, best.sub);
}

function readFormat4(view, sub) {
  const chars = new Set();
  const segCountX2 = view.getUint16(sub + 6);
  const segCount = segCountX2 / 2;

  const endBase = sub + 14;
  const startBase = endBase + segCountX2 + 2;
  const deltaBase = startBase + segCountX2;
  const rangeBase = deltaBase + segCountX2;

  for (let i = 0; i < segCount; i++) {
    const end = view.getUint16(endBase + i * 2);
    const start = view.getUint16(startBase + i * 2);
    const delta = view.getInt16(deltaBase + i * 2);
    const rangeOffset = view.getUint16(rangeBase + i * 2);
    if (start > end) continue;

    for (let c = start; c <= Math.min(end, 0xffff); c++) {
      let glyph;
      if (rangeOffset === 0) {
        glyph = (c + delta) & 0xffff;
      } else {
        const gi = rangeBase + i * 2 + rangeOffset + (c - start) * 2;
        if (gi + 2 > view.byteLength) continue;
        glyph = view.getUint16(gi);
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
      }
      if (glyph !== 0) chars.add(c);
    }
  }
  return chars;
}

function readFormat12(view, sub) {
  const chars = new Set();
  const numGroups = view.getUint32(sub + 12);
  for (let i = 0; i < numGroups; i++) {
    const g = sub + 16 + i * 12;
    const start = view.getUint32(g);
    const end = view.getUint32(g + 4);
    for (let c = start; c <= Math.min(end, 0x2ffff); c++) chars.add(c);
  }
  return chars;
}

/* ------------------------------------------------------------------ *
 * コメントを潰す
 *
 * 「表示されない文字」だけを除外したい。行・列がずれると指摘した位置が
 * 使い物にならなくなるので、削除ではなく同じ長さの空白に置き換える。
 * ------------------------------------------------------------------ */

const blank = (s) => s.replace(/[^\n]/g, ' ');

function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, blank);
}

/**
 * JSのコメントを空白化する。
 * 文字列リテラルの中の「//」をコメントと誤認すると(URLなど)、その行の
 * 残り全体がチェックから漏れてしまうため、簡易的な字句解析で状態を追う。
 */
function stripJsComments(src) {
  let out = '';
  let state = 'code';  // code | line | block | single | double | template
  let i = 0;

  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];

    if (state === 'code') {
      if (c === '/' && next === '/') { state = 'line'; out += '  '; i += 2; continue; }
      if (c === '/' && next === '*') { state = 'block'; out += '  '; i += 2; continue; }
      if (c === "'") state = 'single';
      else if (c === '"') state = 'double';
      else if (c === '`') state = 'template';
      out += c; i++; continue;
    }

    if (state === 'line') {
      if (c === '\n') { state = 'code'; out += c; } else out += ' ';
      i++; continue;
    }

    if (state === 'block') {
      if (c === '*' && next === '/') { state = 'code'; out += '  '; i += 2; continue; }
      out += c === '\n' ? c : ' ';
      i++; continue;
    }

    // 文字列リテラルの中身はチェック対象なのでそのまま通す
    if (c === '\\') { out += c + (next ?? ''); i += 2; continue; }
    if ((state === 'single' && c === "'") ||
        (state === 'double' && c === '"') ||
        (state === 'template' && c === '`')) state = 'code';
    out += c; i++;
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 検査
 * ------------------------------------------------------------------ */

/** 字形を持たなくても問題ない文字 */
const IGNORED = new Set(['\n', '\r', '\t', '﻿']);

function checkFile(relPath, chars) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) return [];

  let src = readFileSync(abs, 'utf8');
  src = relPath.endsWith('.html') ? stripHtmlComments(src) : stripJsComments(src);

  const findings = [];
  const lines = src.split('\n');

  lines.forEach((line, li) => {
    // サロゲートペアを1文字として扱う
    let col = 0;
    for (const ch of line) {
      col++;
      if (IGNORED.has(ch)) continue;
      if (!chars.has(ch.codePointAt(0))) {
        findings.push({ file: relPath, line: li + 1, col, char: ch, context: line.trim() });
      }
    }
  });
  return findings;
}

/** 前後を切り詰めて該当文字が見える抜粋を作る */
function excerpt(context, char, width = 24) {
  const at = context.indexOf(char);
  if (at < 0) return context.slice(0, width * 2);
  const from = Math.max(0, at - width);
  const to = Math.min(context.length, at + width);
  return (from > 0 ? '…' : '') + context.slice(from, to) + (to < context.length ? '…' : '');
}

/* ------------------------------------------------------------------ *
 * main
 * ------------------------------------------------------------------ */

if (!existsSync(FONT_PATH)) {
  console.error(`フォントが見つかりません:\n  ${FONT_PATH}`);
  process.exit(2);
}

const chars = readCmap(FONT_PATH);

if (process.argv.includes('--list')) {
  const kanji = [...chars].filter((c) => c >= 0x4e00 && c <= 0x9fff).sort((a, b) => a - b);
  const kana = [...chars].filter((c) => c >= 0x3040 && c <= 0x30ff).sort((a, b) => a - b);
  console.log(`収録コードポイント: ${chars.size}（漢字 ${kanji.length} / かな・カナ ${kana.length}）\n`);
  console.log('--- 収録漢字 ---');
  for (let i = 0; i < kanji.length; i += 40) {
    console.log(kanji.slice(i, i + 40).map((c) => String.fromCodePoint(c)).join(''));
  }
  process.exit(0);
}

const findings = TARGETS.flatMap((t) => checkFile(t, chars));

if (findings.length === 0) {
  const checked = TARGETS.filter((t) => existsSync(join(ROOT, t)));
  console.log(`OK: 未収録文字はありません（${checked.length}ファイルを検査）`);
  process.exit(0);
}

// 同じ文字が何度も出るので、文字ごとにまとめて読みやすくする
const byChar = new Map();
for (const f of findings) {
  if (!byChar.has(f.char)) byChar.set(f.char, []);
  byChar.get(f.char).push(f);
}

console.error('Nuあんこもちに収録されていない文字が見つかりました。\n');
for (const [char, list] of byChar) {
  const cp = char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  console.error(`'${char}' (U+${cp})  ${list.length}箇所`);
  for (const f of list) {
    console.error(`    ${f.file}:${f.line}:${f.col}  ${excerpt(f.context, char)}`);
  }
  console.error('');
}
console.error(
  `NG: ${byChar.size}種類 / 計${findings.length}箇所。カタカナ等に置き換えてください。\n` +
  `    収録文字の一覧は  npm run check:font -- --list`
);
process.exit(1);
