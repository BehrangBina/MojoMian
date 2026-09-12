# Desktop v2 audit — Figma `Desktop-Final` / `Home-Main` (1512 × 10901) vs `index.html` @1512

Figma values from `spec/desktop-final.json` and `spec/desktop-assets.json`, pulled with
`node tools/figma-spec.mjs`. Live values measured in the browser at viewport 1512
(content box 1497 after the scrollbar, so every live x below is ~7.5 less than its
artboard x — that offset is expected and is not a delta).

This file replaces `spec/audit-desktop.md`, which described the `Desktop` page that the
2026-09-12 restructure deleted.

## 0. What changed in Figma

| Before (to 2026-09-06) | After |
|---|---|
| page `Desktop`, `Home-Main` 1512 × 12523 | page `Desktop-Final`, `Home-Main` 1512 × **10901** |
| tokens inferred from usage | page `Desktop Assets` with `Colors` / `Typography` / `BTN` / `Icons` sections |
| — | page `Design Spec` (Spectral redline overlays; no design data, not pulled) |

Type scale actually used by `Desktop-Final`:
`116, 90, 60, 35.71, 28, 26.95, 24, 20, 18, 16, 15.87`

Any size in the CSS outside that list is a drift point. The v1 scale's `150`, `31.31`,
`20.4` and `24`-as-a-description-size are all gone.

## 1. Tokens — read off `Desktop Assets`, not inferred

| Token | Value |
|---|---|
| Primary-Green | `#76ACB2` |
| Hover | `#A3C6CB` |
| Green-Dark | `#528B94` |
| Green-100 | `#F6F9FA` |
| Secondary-Grey (ink) | `#414042` |
| Grey-300 | `#C4C4C4` |
| Contact band (`Frame 254`) | `#93B2B7` |
| Floral vector | `#A3C3C4` @ 15% |

| Style | Value |
|---|---|
| H0-Giant-Outline | 116 / 139.2 w300 ls0, **outline**: stroke `#414042` @ 0.754 |
| H1-Title | 90 / 80 w400 ls −4.5, small caps |
| Index rows | 60 / 72 w300, outlined, stroke 1 |
| Index numbers (branding) | 35.71 / 26.75 w500 ls −1.79 |
| H3-Nav | 24 / 28.8 w300, small caps |
| H3-Title | 24 / 28.8 w500 |
| P1-Body | 24 / 28.8 w300 |
| Caption-Light | 18 / 21.6 w300 and w500 |
| Section description | 16 / 19.2 w300 |
| Pill | 26.95 / 10.8 w300, title case |
| Button | 28 / 11.2 w300 (w600 on the hero pair) |
| Logo card meta | 15.87 / 19.04 w300 |
| `BTN-Main` / `BTN-Outline` | radius 22, 44 as a component / 55–56 in use, drop shadow blur 20 |

The content column is unchanged: **1062px, x225 → x1287**. Section headings hang 7px left
of it at x218 so the stroked glyphs align optically.

## 2. Section origins — all exact

Every section's Figma y is reproduced by giving it a height equal to the distance to the
next section's origin, so the flow lands each one on its artboard coordinate.

| Section | Figma y | Live y | Δ | Height used |
|---|---|---|---|---|
| header | 0 | 0 | 0 | 328 |
| hero | 328 | 328 | 0 | 737 |
| About | 1065 | 1065 | 0 | 1472 |
| Portfolio | 2537 | 2537 | 0 | 870 |
| Logos | 3407 | 3407 | 0 | 1296 |
| Branding | 4703 | 4703 | 0 | 1408 |
| Posters | 6111 | 6111 | 0 | 1296 |
| Illustration | 7407 | 7407 | 0 | 1160 |
| Nixie | 8567 | 8567 | 0 | 1235 |
| Contact | 9802 | 9802 | 0 | 1100 |
| **document** | **10902** | **10902** | **0** | |

## 3. Nav

| Element | Figma | Was | Action |
|---|---|---|---|
| `Nav Bar/Default` | 1512 × 328, logo 232 × 134 @ (226, 76) | same | unchanged |
| `Nav Bar-Desktop` | 1509 × **86** at y242, `#FFFFFFCC` | 70 tall, `rgba(255,255,255,.9)` | → 86, translucent + backdrop blur |
| Items | 3 × 135 at x765 / 966 / 1167, 24 / 28.8 w300 caps | gap 100, right-aligned to x1287 | → width 135, gap 66, right edge 1302 |
| `Arrow-*` frames | empty in the **default** state; dissolve in on hover | — | see §19 — drawn, hidden at rest |
| `Nav-Arrtow-UpPage` | 91 × 86 at x229, 32 × 20 caret | 36 × 36 raster at x120 | → rounded caret, x = gutter + 4 |

The 5-item `NavBar-Narrow` variant is collapsed to height 0 in Figma — still ignored.

## 4. Hero

| Element | Figma | Was | Action |
|---|---|---|---|
| `Hero-Text` | 524 × 463 @ (763, 391), h1 box 450 | same | unchanged |
| Buttons | **two**: `Hire Me` 140 × 56 @ x763, `Portfolio` 156 × 56 @ x979 | one 271-wide "See My Works" | → pair, gap 76, 24px padding |
| Button fill | `#A3C6CB`, white label w600, shadow blur 20 | `#76ACB2` w300 | → Hover green, w600 |
| Text → buttons | 77 | 32 | → 77 |
| `Background-Blured` | 1512 × **2006** at the page origin | `body` background, fixed, page-long | → `body::before`, 2006 tall |

## 5. About

| Element | Figma | Was | Action |
|---|---|---|---|
| Grid | 413 @ x224 + 129 + 521 @ x766 | same | unchanged |
| `Profile-Photo` | 521 × 416 @ x171.5 | @ −55 | → −53.5, 30px below |
| "I'm Mojdeh" h2 | **gone** | 90 / 80 | → removed on desktop, kept for mobile |
| `.about-role` | "Graphic Designer & Branding Specialist", 24 / 28.8 w500, sentence case | 3-line stack, uppercase | → single line |
| Biography | 20 / **28** w300, one 686-tall block | 20 / 24, 3 spaced paragraphs | → lh 28, margins 0 |
| Social row | 46 sq, 67 pitch, 60 below the copy | gap 16, 32 below | → gap 21, 60 |
| `Resume` | 521 @ y1664 — **452 below** the portrait top | padding-top 8 | → 452 |
| Section gaps | 18 between every block | 28 | → 18 |
| Pills | 55 tall, radius 22, ink hairline, shadow, 26.95 / 10.8 | 56, `rgba(0,0,0,.72)`, no shadow | → ink, shadow, 12px gaps |

## 6. Portfolio index

| Element | Figma | Was | Action |
|---|---|---|---|
| "INDEX:" | 90 / 67.41 w400 ls −4.5 @ (223, 2853) | same | unchanged |
| Rows | @ x765, **no numbers**, labels 60 / 72 w300 **outlined** | 74px number column + filled labels | → labels only, outlined |
| Pitch | 85 then 74 | 69 | → row-gap 32, first row +11 |
| List block | 290 wide | 352 | → 290, column gap 321 |
| `Floral` | 710 × 732 @ (1154, 2525), overflowing right | 390 wide, pinned left | → SVG export, right −352 |

The `01`–`05` counters are kept in the CSS and only hidden on desktop — the mobile design
still uses them.

## 7. The shared `Title` block

One 1295 × 218 frame at x218, repeated by Logos (y3449), Branding (4807), Posters (6220),
Illustration (7522) and Nixie (8658).

| Element | Figma | Was | Action |
|---|---|---|---|
| Heading | **116 / 139.2** w300 ls **0**, stroke 0.754 | 150 / 180, stroke 1 | → 116, 0.75 hairline |
| Rule | 0.75 ink, from the heading's right edge to x1513, at cap + 80 | 1px, own grid column, margin-top 86 | → inside the body column, margin-top 108 |
| Description | **16 / 19.2** w300, 414 wide (482 on Nixie) | 24 / 28.8, 412–670 | → 16 / 19.2 |
| `Icon-Back-To-Index` | 52 × 47 @ x1213, 30px arrow over "Index" 24 / 28.8 | 56px arrow, 13px label, top 160 | → 30px arrow, 24px label at lh 17 |
| Frame height | **218** | content-driven | → fixed 218, which makes every section below deterministic |

The gap between heading and rule is each word's own optical side bearing and differs per
section: Logos 26.4, Branding 16.2, Posters 14.5, Illustration 11.6, Nixie 13.9.

## 8. Logos — the largest structural change

| Element | Figma | Was | Action |
|---|---|---|---|
| Card | white **1057 × 733** @ x227.6 | flat 1062 × 692 JPG | → card + vector mark + real copy |
| Mark | vector `Layer_1`, centred in the left 520 | baked into the JPG | → 9 SVG exports (TAT carries two) |
| Meta | 196 wide @ card + 745.7; brand block at y240, note at y372 | none | → 15.87 / 19.04 w300, fixed offsets |
| Slides | **9** (Curly, Minel, Shah Pasand, RFI, Mahsa, TAT, IMP, Dornik, Shahrzad) | 8 JPGs | → 9, IMP added |
| Controls | two 35.7 circles @ (969.8, 4358.6) and (1136.4, …) | 430-wide bar with 72px raster arrows | → CSS circles, 131 apart |

## 9. Branding

| Element | Figma | Was | Action |
|---|---|---|---|
| Meta row `Project` | 465 × 25 **above** the card @ (820, 5175) | left 72px rail | → row above the card |
| Index buttons | **01–06** @ x978 gap 17, 35.71 / 26.75 w500 ls −1.79, active `#A3C6CB` | 5 buttons, lh 0.75, ls −0.05em | → 6, exact metrics |
| Card | white 1061 × 727 @ (224, 5228) | transparent, 72 + 32 + 960 grid | → card, 53px padding |
| Copy | 16 / 19.2 **w400**, 185 wide, 117 down the card | 18 / 25 w300, 956 wide, below the image | → left column inside the card |
| `Color` row | 400 wide, right-aligned, 16 / 19.2 w300, swatches 32.08 × 25.21 gap 17.57 | vertical rail, 42 × 35 swatches | → horizontal row |
| Slide | 749 × 485 @ (483, 5356) | 960 × 560 | → 749 × 485 |
| Arrows | 53.7 circles @ x483 and x1178, y5873 | 72px rasters + progress bar | → CSS circles, no bar |

## 10. Posters

| Element | Figma | Was | Action |
|---|---|---|---|
| Slide | **one** full-bleed 1060 × 706 @ (227, 6468) | 3 × 334.73 cards | → 1 per page |
| Slides | 4 (`RezaShah1`, `RezaSha2`, `Mahsa1`, `Mahsa2`) | 3 | → 4, exported @2x |
| Arrows | 35.7 @ (550, 7204) and (928, 7204) | 72px + progress bar | → CSS circles, gap 342 |
| Description | now in the `Title` block, 16 / 19.2 | 18 / 25 under the grid | → moved up |

## 11. Illustration

| Element | Figma | Was | Action |
|---|---|---|---|
| Boot | 115 × 170 **inside** the collage | 126 × 187 beside the heading | → removed from the heading |
| Collage `Frame 252` | **956 × 670** @ x311 | 1196 × 838 @ x251 | → 956 × 670, exported @2x |
| `IMG_8318 2` | 1061 × 676 @ (225, 7522) — **`fills: []`** | — | **not implemented**: the node is an empty placeholder in Figma and renders nothing through the images API |

## 12. Nixie

Replaced wholesale: the v1 carousel, detail image and gallery are hidden on desktop (and
kept for mobile) in favour of one composed still, every piece on its artboard coordinate.

Figma's child order is the paint order, back to front — **`Background`, `IMG_0294 1`,
iPhone mockup, `Photo-Nixie`**, then the copy. The first build had the phone at the bottom
with the panel over it, which washed the mockup out; the markup now follows that order.

| Element (back → front) | Figma |
|---|---|
| gradient panel `Background` | 452 × 546 @ (717, 8957) |
| `IMG_0294 1` | 505 × 554 @ (325, 8995) |
| iPhone mockup | 425 × 608 @ (744, 8895) |
| `Photo-Nixie` | 280 × 473 @ (211, 9030) |
| copy | 18 / 21.6 w300, 414 wide @ (227, 9549) |
| Instagram glyph | 60 sq @ (883, 9532) |
| handle | 24 / 28.8 w500 `#A3C6CB` @ (945, 9553) |

## 13. Contact

| Element | Figma | Was | Action |
|---|---|---|---|
| h2 | 116 / 139.2 outlined, **on the white** @ (219, 10048) | 150, inside the content box | → 116, above the band |
| Band `Frame 254` | full bleed 1512 × 751 @ y10151, `#93B2B7` | transparent | → band |
| Copy | 24 / 28.8 w300 **white**, 623 @ (232, 10237) | ink | → white |
| Email line | **absent** | 24px underlined link | → hidden on desktop (the Email disc keeps the `mailto:`); kept on mobile |
| Social | **117** white discs, `#A3C6CB` glyphs, 170 pitch @ (230, 10448) | 46 green discs, white glyphs, gap 28 | → 117, reversed, gap 53 |
| Footer rule | two white lines, 0 → 581 and 931 → 1512, y10845 | none | → split rule |
| Copyright | 18 / 21.6 w300 white, centred in the 350 gap | none | → added |
| `Floral-Contactme` | 710 × 732 @ (1185, 10150) | 419 × 896 raster | → SVG, right −383 |

## 14. Assets

`node tools/figma-assets.mjs` exports 21 files into `src/img/`. Two nodes will not render
through the images API and are handled in CSS or left out:

- `nav-arrow` — the nav `Arrow-*` frames are empty in the design; nothing to draw.
- `illustration-hero` (`IMG_8318 2`) — a rectangle with `fills: []`; see §11.

## 15. Breakpoints

The desktop rules above carry absolute 1512-artboard geometry. A single reset block at the
top of `@media (max-width: 900px)` releases it — min-heights, the 218-tall title frame, the
fixed card and carousel sizes, the contact band — so the tablet and mobile rules below lay
out from scratch. A second short block at the end of the file settles the three elements the
mobile cascade has never seen: the `.logo-slide` card, `.contact-band` and `.contact-footer`.

The `Mobile` Figma page is byte-identical to the 2026-09-06 pull (same 3542 nodes, same type
scale), so `spec/audit-mobile.md` still stands.

## 16. Small caps — Figma draws them at 0.823

Four node groups carry `textCase: SMALL_CAPS_FORCED`: the hero h1 (90), `INDEX:` (90), the
nav labels (24) and the branding slide numbers (35.71). Figma's `absoluteBoundingBox` for
these reports the nominal size, but its **rendered PNG does not** — measured off 2x renders
of `Nav Bar-Desktop`, `Hero-Text` and `Section-Portfolio`:

| Node | Figma render cap height | CSS uppercase at nominal size | ratio |
|---|---|---|---|
| nav "ABOUT ME" | 14.0 | 17.0 | 0.824 |
| hero line 1 | 53.0 | 64.0 | 0.828 |
| "INDEX:" | 51.5 | 63.0 | 0.817 |

No CSS `font-variant-caps` synthesis reproduces that ratio — Chrome's `all-small-caps`
measures 0.71 of the uppercase advance and `small-caps` 0.76, against Figma's 0.84. So the
scale is applied to the size directly, as `--sc-scale: 0.823`, and the text stays uppercased.
Cap heights then match Figma to within 0.5px.

Tracking is deliberately **not** scaled: Figma applies `letterSpacing` in px at the nominal
size. The residual is that ink widths run 3–5% narrow where tracking is negative (hero
"STRATEGIC" 329 vs 345, `INDEX:` 190.7 vs 203) because the fixed −4.5px bites harder on
smaller glyphs. It does not change the hero's line breaks, which match the design's
one-word-per-line shape over six lines.

Nodes marked `TITLE` (the About pills, the hero buttons) are title case, not small caps, and
take no scaling.

## 17. Webfont weights

`index.html` requested `Barlow:wght@300;400;500`. v2's hero buttons are **w600**, which was
being synthesised from 500 — the request now reads `300;400;500;600`.

## 18. Motion — from the prototype, not invented

The file carries 1244 prototype interactions; **34 of them are on `Desktop-Final`**, and they
are the source for every duration and curve below. Nothing here is a guess.

| Component | Trigger | Figma | CSS / JS |
|---|---|---|---|
| Nav links (`About-`) | hover | DISSOLVE EASE_OUT 0.1s | `--dur-nav-hover: 100ms` |
| Hero `BTN-Main` | hover | DISSOLVE **LINEAR** 0.3s | `--dur-btn-hover: 300ms`, `linear` |
| Nav links, `Nav-Arrtow-UpPage` | click | SCROLL_ANIMATE LINEAR 0.2s | JS scroll |
| Nav → Contact | click | SCROLL_ANIMATE EASE_IN 0.3s | JS scroll |
| Index rows | click | SCROLL_ANIMATE EASE_IN 0.2s (Nixie 0.3s) | JS scroll |
| `Icon-Back-To-Index`, hero buttons | click | SCROLL_ANIMATE LINEAR 0.3s | JS scroll |
| Logos `Icon-Next-Logo` | click | SMART_ANIMATE EASE_IN_AND_OUT **0.8s** | `--dur-logo-slide` |
| Branding + Posters `Icon-Next-Logo` | click | SMART_ANIMATE EASE_IN 0.35s | `--dur-slide` |
| Branding `02`–`06` | click | SMART_ANIMATE GENTLE 1.022s | `--dur-project` **800ms**, `--ease-gentle` — shortened from the prototype's 1.022s at the design owner's direction |

Curve mapping: LINEAR → `linear`; EASE_IN → `cubic-bezier(.42,0,1,1)`; EASE_OUT →
`cubic-bezier(0,0,.58,1)`; EASE_IN_AND_OUT → `cubic-bezier(.42,0,.58,1)`. GENTLE is a Figma
spring with no cubic-bezier in the API, approximated as `cubic-bezier(.33,1,.68,1)`, run over
800ms rather than the prototype's 1.022s at the design owner's direction.

**Scroll** had to move into `header.js`: `scrollIntoView({behavior:'smooth'})` honours neither
duration nor curve, and `html { scroll-behavior: smooth }` would have overridden a
rAF-driven scroll, so it is now `auto` and every anchor animates to its own spec. Measured:
nav→About 209ms against a designed 200ms, index→Nixie 315ms against 300ms, back-to-top 209ms
against 200ms, each landing on the exact target y.

**Swaps** are a fade *in* of the incoming content, not a dip: the new image is dropped to
opacity 0 with `transition: none`, applied, then released over two frames. Without that, a
cached file resolved before the hidden state ever painted and the fade was invisible. The
branding frame carries `data-swap="slide" | "project"` so one element can hold both the
0.35s and the 800ms curve.

All of it collapses under `prefers-reduced-motion: reduce` — the five duration tokens go to
`0ms`, the poster keyframe is dropped, and `animateScrollTo` jumps straight to the target.

## 19. Correction — the nav arrows are a hover state, not absent

§3 originally recorded the `Arrow-*` frames beside each nav label as empty, on the evidence
of a PNG render of `Nav Bar-Desktop` (`3475:1288`). That render only shows the **default**
state. The `ON_HOVER` interaction on `About-` points at `3475:1202`
(`Property 1=Variant2`), and rendering *that* shows a `#A3C6CB` arrow beside the hovered
label. The arrow is what the 0.1s dissolve animates.

Two traps in exporting it:

- The bare `Vector` (`3475:1208`) carries `rotation: -2.356 rad` and exports **unrotated**
  into a 24 × 24 viewBox — drawing it as-is gives 41 × 41 ink where Figma renders 22.5 × 22.5.
  Exporting the parent **frame** (`3475:1207`, 59 × 59) bakes the rotation in, so no CSS
  `transform` is needed.
- Measuring the reference by colour proximity to `#A3C6CB` also catches the grey
  antialiasing of the black label. A chroma test (`b − r > 18 && g − r > 14`) isolates the
  arrow properly.

Verified: frame at x847, ink 862.5 → 885, matching Figma's 862.5 → 885, with the nav item
still 135 wide and its label origin still on x765 / 966 / 1167.

Per the design owner, the hover uses **`ease`**, not the `EASE_OUT` the prototype records.
The arrow is hidden below 900px — the burger overlay has no hover.

## 20. Corrections from the side-by-side review

Three things the earlier passes got wrong, caught by comparing the IMP slide against
the design.

### The carousels slide; they do not cross-fade

`Folio-Logos` is a **HORIZONTAL auto-layout strip** — 9 cards of 1057.06 on a 47.6 gap,
9989.55 wide — inside `Folio-Logo`, which has `clipsContent: true`. The same shape appears in
the other two: `Frame 253` (4 posters, 4237 wide) inside `Folio-Posters-Slide`, and a
4494-wide strip inside `Slide-Minel`. So a step **translates the strip by one pitch**;
the opacity cross-fade v2 shipped with was wrong.

| Carousel | Viewport (clips) | Pitch | Curve |
|---|---|---|---|
| Logos | 1152.26 × 828 @x180 | 1104.66 | 800ms ease-in-out |
| Posters | 1060 × 706 @x227 | 1059.67 | 350ms ease-in |
| Branding | 749 × 485 @x483 | 749 | 350ms ease-in |

The strip is inset by one gap (`padding-left: 47.6px`) so card 1 lands on x227.6 inside the
x180 viewport. JS publishes only `--index`; the **pitch lives in CSS**, so each breakpoint
sets its own — below 900px every track becomes full-width and steps by `-100%`. That also
avoids fighting an inline `transform` with `!important`.

Switching branding project replaces the whole strip, so that one case still cross-fades, on
the GENTLE curve.

### There are no shadows

Every node in these subtrees reports `effects: []` — the card, the strip, the instance and
the section. The `box-shadow` on `.logo-slide` and `.branding-card` was invented and is gone.

### "Brand name:" and "Industry:" are Medium

The meta is a single text node whose `style.fontWeight` is 300, but it carries
`characterStyleOverrides` putting characters 0–10 and 16–24 on
`styleOverrideTable["1"] = Barlow Medium, fontWeight 500` — i.e. the two labels are w500 and
the values stay w300. Rendered with `<strong>` at `font-weight: 500`.

The gap from the brand block to the note is placed by eye per card in Figma (y372 on most,
326 on IMP, 461 on TAT), so one value has to serve all nine: 30px puts the long cards on
their Figma y and keeps every one of the nine clear of the arrows.
