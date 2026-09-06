# Desktop audit — Figma `Home-Main` (1512 wide) vs `index.html` @1512

Figma values from `spec/desktop.json` (pulled via the Figma REST API). Live values measured with
`tools/probe.js` at viewport 1512 (content box 1497 after the scrollbar).

## 0. The systemic finding: the content column

Figma places all content in a **1062px column running x=225 → x=1287** (225px margins on 1512).

| Evidence node | Figma x | Figma w |
|---|---|---|
| `Slider-Logo` (logos carousel) | 225 | 1062 |
| `Posters` (posters row) | 228 | 1062 |
| `Projects` (branding row) | 225 | 1064 |
| `Nixie-001` (nixie image) | 225 | 1061 |
| `IMG_8318 2` (illustration) | 225 | 1061 |
| `Hero-Text` | 763 | 524 → right edge **1287** |
| `Resume` (about panel) | 766 | 521 → right edge **1287** |
| `Logo` (nav) | 226 | 232 |

The site uses `--container-max: 1498px` with `--container-gutter: max(24px, (100vw - 1498px)/2)`.
On a 1512 artboard that second term is ~0, so the gutter always collapses to the **24px floor** and
sections render full-bleed at 1497. Result: content sits ~200px left of spec, everywhere.

**Fix:** `--container-max: 1062px`, gutter `max(24px, (100vw - 1062px)/2)`.
This one change re-seats every section and must land first.

## 1. Header / nav

| Element | Figma | Live | Action |
|---|---|---|---|
| `Nav Bar/Default` height | 328 | `--header-height: 380` | → 328 |
| Logo box | 232 x 134 @ x226 y76 | 260 x 151 @ x126 y98 | → 232x134, x=226, y=76 |
| Nav link type | 24 / 28.8 w300 | 24 / 24 w300 | line-height → 28.8 |
| Nav link row | first x=765, last ends 1284.85 | right offset 232, gap 116 | right edge → 1287; gap → ~100 |

Figma also holds an unused 5-item nav (`About/Portfolio/Services/Contact/Shop`). The live 3-link nav
matches the `About Me / PORTFOLIO / CONTACT ME` text row — ignore the 5-item variant.

## 2. Hero

| Element | Figma | Live | Action |
|---|---|---|---|
| `Hero-Text` frame | x763 y391, 524 x 551 | x663, 524 | x → 763 (`right: 225px`) |
| h1 | 90 / 80 w400 ls-4.5, text box **450** wide | 90/80 w400 ls-4.5, width 524 | type OK; **width → 450** (changes line breaks) |
| h1 top | y=391 (63 below the 328 header) | y=471 (top:91 under a 380 header) | → 63 |
| `BTN-Main` | 271 x 56 | 271 x 56 | OK |
| Button label | **28** / 11.2 w300 | 30 / 30 w300 | → 28 |
| h1 → button gap | 32 | 32 | OK |

## 3. About (`Serction-About`)

| Element | Figma | Live | Action |
|---|---|---|---|
| Grid | left col x224 w413, right col x766 w521, gap 129 | `470px 430px` gap 120 @ x24 | → `413px 521px`, gap 129 |
| Photo (`Potfolio-Photo`) | x170 w521 | inside 470 col @ x24 | → 521 wide, bleeds left to x=170 |
| h2 "I'm Mojdeh" | **90 / 80** w400 **ls-4.5** | **56 / 56** w400 ls-1.68 | → 90/80, ls -4.5 |
| `.about-role` | 24 / 28.8 w500 UPPER | 24 / 24.48 w500 | line-height → 28.8 |
| `.about-copy` | 20 / 24 **w300**, w413 | 20 / 24.4 **w400**, w410 | weight → 300, lh → 24, w → 413 |
| Panel body | **24 / 28.8 w300** | **18 / 21.96 w400** | → 24/28.8 w300 |
| Panel h3 | 24 / 28.8 w500 | 24 / 29.28 w500 | line-height → 28.8 |
| Pills | 26.95 / 10.78 **w300** | 27 / 27 **w400** | weight → 300 |
| Pill rows | text x788 (=766+22 padding), row pitch 67 | padding 22 OK | row pitch → 67 |

## 4. Portfolio (`Section-Portfolio`)

| Element | Figma | Live | Action |
|---|---|---|---|
| "INDEX:" | **90 / 67.41** w400 **ls-4.5**, x223 w221 | **60 / 60** w400 ls-2.4, x24 | → 90/67.41, ls -4.5 |
| List block (`Frame 251`) | x768, w352 | x484, w430 | x → 768, w → 352 |
| Numbers 01–05 | **60** / 44.94 w400 **ls-3** | 43 / 53.75 w400 ls0 | → 60/44.94, ls -3 |
| Labels | **60 / 72 w300** | 43 / 53.75 **w400** | → 60/72, weight 300 |
| Number → label offset | 74 (768 → 842) | 74px col + 10px gap = 84 | column-gap → 0 |
| Row pitch | 69 | 53.75 | → 69 |

## 5. Section headings (all `.logos-section h2`)

| Figma | Live | Action |
|---|---|---|
| **150 / 180** (lh 1.2) w300, ls 0 (Branding −6) | **151 / 117.78** (lh 0.78) w300 **ls −6.04** | → 150 / 180, ls 0 |

Heading x by section: Logos 214, Branding 211, Posters 217, Illustration 325, Nixie 216, Contact 219.
The outlined type overshoots the 225 column edge optically; 214–219 is the intended heading origin.

## 6. Section descriptions — the largest type error

| Section | Figma | Live | Action |
|---|---|---|---|
| Logos | **24 / 28.8 w300**, w412 | **14 / 21.7 w300**, w286 | → 24 / 28.8, w 412 |
| Branding | **24 / 28.8 w300**, w529 | **14 / 21.7 w300**, w286 | → 24 / 28.8, w 529 |
| Illustration | **24 / 28.8 w300**, w670 | 18 / 21.96 w300, w620 | → 24 / 28.8, w 670 |
| Nixie | **24 / 28.8 w300**, w643 | (header p) | → 24 / 28.8, w 643 |
| Posters | **18 / 25 w300**, w1059 | **unstyled: 16 / normal w400** | → 18 / 25 w300, w 1059 |

This confirms the in-progress `.section-description { size: 24px }` edit — 24px is the right number,
but it needs to be `font-size`, and it applies to the desktop header paragraph, not only mobile.

## 7. Carousels

### Logos

| Element | Figma | Live | Action |
|---|---|---|---|
| Slide frame | 1062 x 692 @ x225 | 1062 x 692 @ x24 | size OK; x follows the container fix |
| Controls (`Slider-Bar-8`) | x541 w430.44 h71.44, centred on 1512 | width 1062, centred in column | centre on page, width → 430 |
| Buttons | 71.44 (~72) | 72 | OK |

### Branding

| Element | Figma | Live | Action |
|---|---|---|---|
| Row (`Projects`) | x225 w1064 h785 | x24 w1449 | → 1064 |
| Meta col (`Project-Info`) | x225 **w72** | **w150** | → 72 |
| Main (`Frame 231`) | x329 **w960** h785 | x222 w960 | OK; grid gap → 32 |
| Grid | `72px 960px` gap **32** | `150px 960px` gap **48** | → `72px 960px` gap 32 |
| Index buttons | 35.71 / 26.75 w500 ls−1.79, gap 17 | 35.71 / 26.78 w500 ls−1.7855, gap 17 | OK |
| "See more Projects" | 18 / 21.6 w300 | 18 w300 | OK |
| Description | 18 / **25** w300, x331 w956 | 18 / 24.3 w300, w960 | lh → 25 |

### Posters

| Element | Figma | Live | Action |
|---|---|---|---|
| Row | x228 **w1062** h451 | x206 **w1085** | → 1062 |
| Cards | 3 × **334.73** x 451 | 3 × 335 x 451 | OK |
| Gap | **28.91** | **16** | → 28.9 |

### Nixie hero

| Element | Figma | Live | Action |
|---|---|---|---|
| Carousel span (incl. arrows) | x143 w1225.33 | 1226 | OK |
| **Image** (`Nixie-001`) | x225 **w1061** x 597 | `.nixie-frame` **1226** x 597 | **frame → 1061**; carousel stays 1226 |
| Arrows | **57.33** sq, left x143, right x1311 | **46** sq at −72 | → 57.33, offset 82 from image edge |

### Nixie gallery

| Element | Figma | Live | Action |
|---|---|---|---|
| Grid (`Dolls`) | x225 **w737** | **w731** | → 737 |
| Copy column | x1023 **w264** | x1008 w260 | → 264 |
| Block gap | **61** (1023 − 962) | **48** | → 61; grid `737px 264px` = 1062 |
| Copy type | **18 / 21.6 w300** | **16 / 19.2 w300** | → 18 / 21.6 |
| Social icons | 56 sq, gap 13 | 28 gap | → 56, gap 13 |

## 8. Illustration

| Element | Figma | Live | Action |
|---|---|---|---|
| Boot icon | **126 x 187** @ x199 | **80 x 118** | → 126 x 187 |
| Collage (`Frame 252`) | x251 **w1196** h838 | x189 w1120 | → 1196 (deliberately wider than the 1062 column) |
| Top image | x225 w1061 h676 | — | verify present |

## 9. Contact

| Element | Figma | Live | Action |
|---|---|---|---|
| h2 | 150 / 180 w300, **x219** | 151 / 117.78 ls−6.04, **x339** (centred 820 box) | → 150/180, left-aligned to the column |
| Copy | 24 / **28.8** w300, x232 **w623** | 24 / 24 **ls−0.96**, x339 w620 | lh → 28.8, ls → 0 |
| Email | 24 / 28.8 w300, x230 | 24 / 24 ls−0.96, x339 | lh → 28.8, ls → 0 |
| Social icons | **78.6** sq @ x230, pitch ~115 | 46 sq, gap 28 | → 78.6 |

## Type scale actually used by Figma desktop

`150.86, 150, 90, 60, 35.71, 31.31, 28, 26.95, 24, 20.4, 20, 18`

Sizes the CSS uses that **do not exist in the design**: `151, 56, 43, 30, 27, 14`.
Every one of those is a drift point, and each is accounted for above.
