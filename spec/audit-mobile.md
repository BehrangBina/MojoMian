# Mobile audit — Figma `Home` (393 wide) vs `index.html` @393

Figma values from `spec/mobile.json`. Live values measured with the probe in `tools/probe.js`.
The site's mobile breakpoint is `max-width: 520px`; the Figma artboard is 393 wide with a
**345px content column at x≈24**.

## Type — every one of these was wrong

| Element | Figma | Was | Now |
|---|---|---|---|
| Hero h1 | **42 / 42 w400 ls−2.1**, box 343 | 30 / 33.6 ls−1.2, box 318 | fixed |
| Hero button | **24.11** w300 | 22 w300 | fixed |
| Section headings | 64 w300 **ls 0** | 64 w300 **ls −2.56** | fixed |
| Section descriptions | **16 / 19.2 w300**, w345 | 16 / 19.52 w300, w330 | fixed |
| About panel body | **18 / 21.6 w300** | 16 / 19.52 w300 | fixed |
| About panel h3 | **20 / 24 w500** | 20 / ~24 w500 | ok |
| Tools / Languages pills | **20.22 w300** | 16 w400 | fixed |
| Portfolio "INDEX:" | **42 / 35.37 ls−2.1** | 46.8 / 46.8 ls−1.872 | fixed |
| Portfolio rows | **38** w300 labels, w400 numbers, pitch ~50 | 35.1 / 43.88 w400 | fixed |
| Branding index buttons | **33.57 / 25.14 w500 ls−1.68** | — | fixed |
| Drawer h2 ("I'm Mojdeh") | **42 / 35.37 w400 ls−2.1** | 58 / 0.9 ls−0.04em | fixed |
| Burger overlay items | **60 / 80 w400 ls−3 @ x48** | 28, centred | fixed |
| Contact copy / email | **16 / 19.2 w300 ls 0** | 16 / 19.52 ls−0.04em | fixed |

Mobile type scale actually used by Figma:
`64, 60, 42, 38, 35, 33.57, 30, 26, 24.11, 24, 22, 20.22, 20, 18, 16, 15.86, 15.14, 14.79, 14, 13.45`

## Geometry

| Element | Figma | Was | Now |
|---|---|---|---|
| Content column | **345 @ x24** | 330 @ x28 (ragged: 24/28/32/36) | fixed — single gutter |
| Branding slide | **full-bleed 392 × 388** | 334 × 360 @ x28 | fixed |
| Poster card | **341 × 437 @ x26** | 318 × 408 @ x36 | fixed |
| Boot icon | **91 × 134 @ x23** | — | fixed |
| Illustration copy | **245 @ x122** (inset beside the Boot) | full width | fixed |
| Nixie story slide | **346 × 364 @ x22** | 334 × 280 @ x28 | fixed |
| Contact frame | **435 tall**, heading 108 in, 54 below icons | 715 tall (14 stray `<br>`) | fixed |

The ragged left edge was the visible symptom: the logo sat at 32, the hero at 36, the portfolio
heading at 24 and everything else at 28. All four now resolve from one `--container-gutter`.

## Structural note

The mobile CSS was **23 separate append-only `@media (max-width: 520px)` blocks** that silently
overrode one another (`--header-height` defined 3×, `.profile-photo` 4×, `.nixie-frame` 3×).
They are now merged into **one** block, concatenated in original source order so the cascade is
unchanged, with a Figma-derived authoritative section at the end.
