#!/usr/bin/env node
// Pull the MojGraphicDesign Figma file and flatten the Desktop + Mobile pages
// into spec/<page>.json: one record per node with exact geometry and type metrics.
//
// Usage:  node tools/figma-spec.mjs [--offline]
// Token:  .figma-token in the repo root, or FIGMA_TOKEN in the environment.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const FILE_KEY = '2wKuuyvVF063XGTA8cI5MJ';
const PAGES = ['Desktop', 'Mobile'];
const RAW = 'spec/raw/file.json';
const offline = process.argv.includes('--offline');

function token() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  for (const f of ['.figma-token', '.figmatoken']) {
    if (!existsSync(f)) continue;
    // Strip a BOM and any stray quotes/whitespace a shell or editor may have added.
    const raw = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().replace(/^["']|["']$/g, '');
    if (!/^figd_[A-Za-z0-9_-]+$/.test(raw)) {
      console.error(`Token in ${f} does not look like a Figma PAT (expected figd_...).`);
      console.error(`  length ${raw.length}, first 5 chars ${JSON.stringify(raw.slice(0, 5))}`);
      process.exit(1);
    }
    return raw;
  }
  console.error(
    'No Figma token found.\n' +
    '  Create a read-only personal access token at\n' +
    '    Figma -> Settings -> Security -> Personal access tokens (scope: File content, read-only)\n' +
    '  then save it to .figma-token in the repo root (already gitignored).'
  );
  process.exit(1);
}

async function loadDocument() {
  if (offline) {
    if (!existsSync(RAW)) {
      console.error(`--offline given but ${RAW} does not exist; run once without it first.`);
      process.exit(1);
    }
    console.log(`Reading cached ${RAW}`);
    return JSON.parse(readFileSync(RAW, 'utf8'));
  }
  console.log(`Fetching file ${FILE_KEY} from the Figma API...`);
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}`, {
    headers: { 'X-Figma-Token': token() },
  });
  if (!res.ok) {
    console.error(`Figma API returned ${res.status} ${res.statusText}`);
    console.error(await res.text().catch(() => ''));
    process.exit(1);
  }
  const json = await res.json();
  mkdirSync('spec/raw', { recursive: true });
  writeFileSync(RAW, JSON.stringify(json));
  console.log(`Cached raw response to ${RAW}`);
  return json;
}

const hex = (c, opacity = 1) => {
  if (!c) return null;
  const b = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  const a = (c.a ?? 1) * opacity;
  return `#${b(c.r)}${b(c.g)}${b(c.b)}${a < 0.999 ? b(a) : ''}`;
};

function solidFill(node) {
  const f = (node.fills || []).find((f) => f.visible !== false && f.type === 'SOLID');
  return f ? hex(f.color, f.opacity ?? 1) : null;
}

function strokeColor(node) {
  const s = (node.strokes || []).find((s) => s.visible !== false && s.type === 'SOLID');
  return s ? hex(s.color, s.opacity ?? 1) : null;
}

const round = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);

// Flatten one page into records whose x/y are relative to the artboard they sit in.
function flatten(page) {
  const out = [];
  const walk = (node, path, artboard, origin, depth) => {
    const box = node.absoluteBoundingBox;
    // The first top-level FRAME on the page is the artboard everything is measured against.
    if (!artboard && node.type === 'FRAME' && box) {
      artboard = node.name;
      origin = { x: box.x, y: box.y };
    }
    const rec = {
      name: node.name,
      type: node.type,
      artboard,
      depth,
      path: path.join(' / '),
    };
    if (box) {
      rec.x = round(box.x - (origin?.x ?? 0));
      rec.y = round(box.y - (origin?.y ?? 0));
      rec.w = round(box.width);
      rec.h = round(box.height);
    }
    if (node.type === 'TEXT' && node.style) {
      const s = node.style;
      rec.text = (node.characters || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      rec.font = {
        family: s.fontFamily,
        size: round(s.fontSize),
        weight: s.fontWeight,
        lineHeightPx: round(s.lineHeightPx),
        lineHeightPercent: round(s.lineHeightPercent),
        letterSpacing: round(s.letterSpacing),
        textCase: s.textCase || 'ORIGINAL',
        align: s.textAlignHorizontal,
      };
    }
    const fill = solidFill(node);
    if (fill) rec.fill = fill;
    const stroke = strokeColor(node);
    if (stroke) rec.stroke = { color: stroke, weight: round(node.strokeWeight) };
    if (node.cornerRadius != null) rec.radius = round(node.cornerRadius);
    if (node.layoutMode && node.layoutMode !== 'NONE') {
      rec.layout = {
        mode: node.layoutMode,
        gap: round(node.itemSpacing),
        padding: [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft].map(round),
        justify: node.primaryAxisAlignItems,
        align: node.counterAxisAlignItems,
      };
    }
    if (node.opacity != null && node.opacity !== 1) rec.opacity = round(node.opacity);
    if (node.visible === false) rec.hidden = true;

    out.push(rec);
    for (const child of node.children || []) {
      walk(child, [...path, node.name], artboard, origin, depth + 1);
    }
  };
  for (const child of page.children || []) walk(child, [], null, null, 0);
  return out;
}

const doc = await loadDocument();
console.log(`\nPages in file: ${doc.document.children.map((p) => p.name).join(', ')}`);

const summary = {};
for (const wanted of PAGES) {
  const page = doc.document.children.find((p) => p.name === wanted);
  if (!page) {
    console.warn(`  ! page "${wanted}" not found - skipping`);
    continue;
  }
  const records = flatten(page);
  const file = `spec/${wanted.toLowerCase()}.json`;
  writeFileSync(file, JSON.stringify(records, null, 2));

  const texts = records.filter((r) => r.font);
  const sizes = [...new Set(texts.map((r) => r.font.size))].sort((a, b) => b - a);
  const weights = [...new Set(texts.map((r) => r.font.weight))].sort((a, b) => a - b);
  const artboards = [...new Set(records.filter((r) => r.depth === 0 && r.w).map((r) => `${r.name} ${r.w}x${r.h}`))];
  summary[wanted] = { file, nodes: records.length, texts: texts.length, sizes, weights, artboards };

  console.log(`\n${wanted} -> ${file}`);
  console.log(`  nodes:      ${records.length} (${texts.length} text)`);
  console.log(`  artboards:  ${artboards.join(', ')}`);
  console.log(`  font sizes: ${sizes.join(', ')}`);
  console.log(`  weights:    ${weights.join(', ')}`);
}

writeFileSync('spec/summary.json', JSON.stringify(summary, null, 2));
console.log('\nWrote spec/summary.json');
