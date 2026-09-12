#!/usr/bin/env node
// Export the Desktop-Final nodes the site needs as real files into src/assets/.
//
// Only nodes that cannot be drawn from tokens live here: the vector logo marks,
// the poster slides, the About portrait and the illustration collage.
// Circles, arrows chrome, gradients and rules are CSS — do not add them.
//
// v3: the design owner's Desktop.zip export is the source of truth for images.
// This tool covers what the zip does not carry (the vector marks, the nav hover
// arrow, the floral) and is the fallback when a slide is missing from a zip —
// each entry names its own `out` path under src/assets/.
//
// Usage:  node tools/figma-assets.mjs [name ...]   (no args = everything)
// Token:  .figma-token in the repo root, or FIGMA_TOKEN in the environment.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const FILE_KEY = '2wKuuyvVF063XGTA8cI5MJ';
const OUT = 'src/assets';

// name -> { id, format, scale }.  Ids come from spec/desktop-final.json (`id` field);
// re-run `node tools/figma-spec.mjs` and re-read them if the Figma file is restructured.
const ASSETS = {
  // --- Logos carousel: nine vector marks, drawn beside real HTML copy -------
  // Kept as vector: the zip ships these as 2132 x 1478 JPGs, which is a
  // resolution-dependent downgrade of the same artwork.
  'logo-curly':       { id: 'I4042:18329;4032:4788', format: 'svg', out: 'logos/marks/curly.svg' },
  'logo-minel':       { id: 'I4042:18329;4032:4801', format: 'svg', out: 'logos/marks/minel.svg' },
  'logo-shahpasand':  { id: 'I4042:18329;4032:4816', format: 'svg', out: 'logos/marks/shahpasand.svg' },
  'logo-rfi':         { id: 'I4042:18329;4032:4918', format: 'svg', out: 'logos/marks/rfi.svg' },
  'logo-mahsa':       { id: 'I4042:18329;4032:4831', format: 'svg', out: 'logos/marks/mahsa.svg' },
  'logo-tat':         { id: 'I4042:18329;4032:4937', format: 'svg', out: 'logos/marks/tat.svg' },
  'logo-tat-type':    { id: 'I4042:18329;4032:4947', format: 'svg', out: 'logos/marks/tat-type.svg' },
  'logo-imp':         { id: 'I4042:18329;4032:4967', format: 'svg', out: 'logos/marks/imp.svg' },
  'logo-dornik':      { id: 'I4042:18329;4032:5010', format: 'svg', out: 'logos/marks/dornik.svg' },
  'logo-shahrzad':    { id: 'I4042:18329;4032:5021', format: 'svg', out: 'logos/marks/shahrzad.svg' },

  // --- Decorative floral, 710 x 732, filled #A3C3C4 at 15% ------------------
  // The same vector serves both the Portfolio and Contact placements.
  'floral':           { id: '3475:1626', format: 'svg', out: 'ui/floral.svg' },

  // --- Nav hover arrow ------------------------------------------------------
  // The "Arrow-About" FRAME, not the vector inside it: the frame export bakes
  // in the -135deg rotation, and the bare vector does not render at all.
  'nav-arrow':        { id: '3475:1207', format: 'svg', out: 'ui/icons/nav-arrow-hover.svg' },

  // --- Posters: four full-bleed slides --------------------------------------
  'poster-reza-1':    { id: 'I4095:3569;4095:3493', format: 'png', scale: 2, out: 'posters/reza-shah-01.png' },
  'poster-reza-2':    { id: 'I4095:3569;4095:3494', format: 'png', scale: 2, out: 'posters/reza-shah-02.png' },
  'poster-mahsa-1':   { id: 'I4095:3569;4095:3495', format: 'png', scale: 2, out: 'posters/mahsa-amini-01.png' },
  'poster-mahsa-2':   { id: 'I4095:3569;4095:3496', format: 'png', scale: 2, out: 'posters/mahsa-amini-02.png' },

  // --- About: the masked portrait -------------------------------------------
  'profile-photo':    { id: '3141:1035', format: 'png', scale: 2, out: 'about/portrait.png' },

  // --- Illustration ---------------------------------------------------------
  'illustration-collage': { id: '3646:1163', format: 'png', scale: 2, out: 'illustration/collage.png' },
};

function token() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  for (const f of ['.figma-token', '.figmatoken']) {
    if (!existsSync(f)) continue;
    const raw = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().replace(/^["']|["']$/g, '');
    if (/^figd_[A-Za-z0-9_-]+$/.test(raw)) return raw;
  }
  console.error('No Figma token found (.figma-token or FIGMA_TOKEN).');
  process.exit(1);
}

const T = token();
const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(ASSETS);
for (const n of names) {
  if (!ASSETS[n]) {
    console.error(`Unknown asset "${n}". Known: ${Object.keys(ASSETS).join(', ')}`);
    process.exit(1);
  }
}

// each asset writes to its own subdirectory under OUT

// The images endpoint takes one format+scale per call, so batch by that pair.
const groups = new Map();
for (const name of names) {
  const a = ASSETS[name];
  const key = `${a.format}@${a.scale ?? 1}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(name);
}

let written = 0;
for (const [key, group] of groups) {
  const [format, scale] = key.split('@');
  const ids = group.map((n) => ASSETS[n].id);
  const url =
    `https://api.figma.com/v1/images/${FILE_KEY}` +
    `?ids=${encodeURIComponent(ids.join(','))}&format=${format}` +
    (format === 'svg' ? '&svg_outline_text=false' : `&scale=${scale}`);

  console.log(`Rendering ${group.length} node(s) as ${format}${format === 'svg' ? '' : ` @${scale}x`}...`);
  const res = await fetch(url, { headers: { 'X-Figma-Token': T } });
  if (!res.ok) {
    console.error(`  Figma images API returned ${res.status} ${res.statusText}`);
    console.error(`  ${await res.text().catch(() => '')}`);
    process.exit(1);
  }
  const { images, err } = await res.json();
  if (err) {
    console.error(`  Figma reported: ${err}`);
    process.exit(1);
  }

  for (const name of group) {
    const href = images[ASSETS[name].id];
    if (!href) {
      console.warn(`  ! ${name}: Figma returned no image for ${ASSETS[name].id} - skipping`);
      continue;
    }
    const bin = await fetch(href);
    if (!bin.ok) {
      console.warn(`  ! ${name}: download failed (${bin.status}) - skipping`);
      continue;
    }
    const file = `${OUT}/${ASSETS[name].out}`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, Buffer.from(await bin.arrayBuffer()));
    console.log(`  ${file}`);
    written += 1;
  }
}

console.log(`\nWrote ${written} file(s) to ${OUT}/`);
