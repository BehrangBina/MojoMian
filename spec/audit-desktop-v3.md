# Desktop v3 audit — Figma `Desktop-Final` / `Home-Main` (1512 × 10901) vs `index.html` @1512

Figma pulled 2026-09-16 with `node tools/figma-spec.mjs`; the file's `lastModified` is
**2026-09-14T13:04:08Z**, i.e. after the 2026-09-12 pull that produced
[`audit-desktop-v2.md`](audit-desktop-v2.md). This file records only what changed since;
v2 still describes everything it does not contradict.

Live values measured in the browser at viewport 1512. The content box is 1497 after the
scrollbar, so every live x runs ~7.5 less than its artboard x — that offset is expected and
is not a delta. Right-anchored full-bleed elements lose the full 15.

## 0. What changed in Figma

| | 2026-09-12 | 2026-09-14 |
|---|---|---|
| `Desktop-Final` nodes | 1143 (122 text) | **580** (85 text) |
| `Desktop Assets` nodes | 4005 | **4667** |
| `Desktop-Final` artboards | + `Folio-Logos`, `Folio-Logo` | those two removed |
| `Desktop Assets` artboards | `Folio-Branding-*`, `Folio Posters`, `Icons 578x1208` | + `Logo-Folio-Photos 11072x3680`, `Posters 2256x4009`, `Branding 9376x6256`, `Icons 1040x1769` |
| pages | — | + `Mobile-Final` alongside the old `Mobile` |

`Home-Main` is still **1512 × 10901** and every section origin is unchanged.

The halving of the node count is **not** content loss: the `Section-*` wrapper frames and the
five 218-tall `Title` frames were deleted and their children promoted to depth 1, and the
carousel content moved to `Desktop Assets`. Diffing by name+path after stripping those
wrapper levels leaves **259 matched identities and only 4 changed nodes**.

`Mobile` is unchanged in geometry (3425 nodes vs 3542 — the same flattening). The new
`Mobile-Final` page was **not** acted on: mobile is out of scope for this pass.

## 1. The six real changes

### 1.1 Hero — back to a single button

| | Figma v2 | Figma v3 |
|---|---|---|
| Buttons | **two** — `Hire Me` 140 × 56 @x763, `Portfolio` 156 × 56 @x979 | **one** — `See My works` 214 × 44 @x763 |
| Fill | `#A3C6CB` (Hover) | `#76ACB2` (Primary-Green) |
| Label weight | 600 | **300** |
| Label box | 92 / 108 wide | 166 wide, y943 |

v2 read the component's **Hover** variant as if it were the default. `BTN-Main` is a
component set with `State=Default` and `State=Hover`; Default is the flat Primary-Green
above, and Hover is a **vertical gradient**, not a flat swap:

```
linear-gradient(to top, #257c86 0%, #61a4ac 50%, #9dcbd2 100%)
```

Both states carry the same drop shadow, `0 4px 20px rgba(214, 216, 224, 0.25)` — the
`--button-shadow` token was `rgba(65, 64, 66, 0.2)`, which matched neither. `BTN-Outline`
(the About pills) carries the identical shadow, so the token is correct for both.

`--btn-height` is now **44**. The width is **pinned to 214px** rather than left to the label:
Chrome sets "See My works" 4.6px narrower than Figma does, which would otherwise render the
button 209.4 wide. The `@media (max-width: 900px)` rule pins `height: 56px` so this
desktop-only change does not leak into the mobile cascade.

### 1.2 Nixie heading — "Nixie Doll" → "Nixie Dolls"

Figma reports the heading at **x162, 519 wide**, where the other five headings are at x218.
Its right edge (681) and its rule (x695) are identical to v2's "Nixie Doll" (x218, 463 wide) —
the text box grew *leftward* when the "s" was added, which is Figma auto-resize with a
right-anchored box, not a design intent.

**Resolved with the design owner: align to x218** like every other section. The heading is
real text in a flex row, so widening it pushes the rule right automatically; no coordinate
was hard-coded. Every other page copy already said "Nixie Dolls" — only the heading lagged.

### 1.3 Nixie composition — four pieces become one frame

v2 placed `Background` (452 × 546 @8957), `IMG_0294 1` (505 × 554 @8995), the iPhone mockup
(425 × 608 @8895) and `Photo-Nixie` (280 × 473 @9030) individually, in Figma's paint order.

v3 wraps `IMG_0294 1` + `Photo-Nixie` in `Frame 255` and the whole thing in
**`Nixie-Photo-SocialMedia`, 958 × 654 @ (211, 8895)**. Every child coordinate is byte-identical —
this is a grouping change. The zip ships it as one 1916 × 1308 (2x) export, so four positioned
images collapse to one and `.nixie-panel/.nixie-doll/.nixie-phone/.nixie-portrait` are replaced
by a single `.nixie-composite { left: 211px; top: 0; width: 958px }`.

### 1.4 Contact floral moved

| | v2 | v3 |
|---|---|---|
| `Floral-Contactme` frame | 1189, 10069, 323 × 691 | **1189, 10151, 323 × 750** |
| `Floral` vector | 1185, 10150 | **1189, 10188** |

The clip frame is now exactly the contact band (`Frame 254`, y10151, h751). The vector sits
37px below the band top and overflows 387.45 past the 1512 edge, so
`right: -383px; top: -1px` becomes `right: -387px; top: 37px`.

`Floral-Back` (the Portfolio floral) is newly wrapped in a 355 × 732 clipping frame but the
vector is still at (1154, 2525) — no CSS change.

### 1.5 Social icons — hand-drawn SVGs replaced with the exported artwork

Reported by the design owner: the Contact icons were wrong. They were five inline SVGs with
hand-approximated glyph paths. Figma's `Social-Media` component has **four**:

| Node | Contact (`3387:4695`) | About (`3343:3304`) |
|---|---|---|
| `_Email` | 117 × 117 @ (230, 10448) | 46 × 46 @ (223, 2451) |
| `_Instagram` | **122** × 117 @ (400, 10448) | **48** × 46 @ (290, 2451) |
| `_Telegram` | 117 × 117 @ (576, 10448) | 46 × 46 @ (359, 2451) |
| `_Pinterest` | 117 × 117 @ (746, 10448) | 46 × 46 @ (426, 2451) |

Three findings:

- **There is no LinkedIn icon in the design.** Both rows carried one. It is removed from the
  markup; the profile stays in the JSON-LD `sameAs` arrays, which is where a
  non-rendered profile association belongs.
- **Instagram is 5px wider** than the other three discs in Contact (2px in About). Handled
  with an `.is-wide` modifier rather than letting `object-fit` letterbox it.
- **The two rows use different artwork.** Contact is a white disc with an `#A3C6CB` glyph;
  About is the reverse, an `#A3C6CB` disc with a white glyph. `_Pinterest` is a single
  117 × 117 white vector — a disc with the mark knocked out — not a disc plus a glyph.

Contact uses the zip's PNGs, About the zip's SVGs. The `@media (max-width: 520px)` block
used to invert the inline SVGs' fills to reach the About colourway; that recolouring cannot
apply to exported artwork, so the Contact icons are wrapped in `<picture>` with a
`(max-width: 520px)` source pointing at the About SVGs. The now-dead
`[fill="#ffffff"] / [fill="currentColor"]` rules are gone.

Hover was `color`, which no longer tints an exported image — it is now a 0.82 opacity shift.

Instagram and Telegram still point at `href="#"` in both rows. That predates this pass and
needs real URLs from the design owner.

### 1.6 Background — sticky, and the page fill corrected

Two changes at the design owner's direction. Neither is readable from Figma: a static file
cannot express scroll behaviour, and `Background-Blured` is still 1512 × 2006 at the page
origin exactly as v2 recorded it.

**Sticky, page-long.** `body::before` is a `position: fixed; inset: 0` layer, so the
photograph is pinned to the viewport at the origin and never moves. Figma's 2006 bound is
deliberately **not** reproduced: the design owner wants the backdrop behind the whole site.

This was built twice. The first pass kept the 2006px box and used
`background-attachment: fixed`, which is sticky but leaves a hard seam where the box ends —
visible mid-About as the photograph cuts to flat `#F6F9FA`. Removing the bound removes the
seam. Because every section below the header is transparent, the photograph now reads
through all ten of them; that is intended, not a leak.

`position: fixed` is used rather than `background-attachment: fixed`. Same effect, but it
composites on its own layer instead of repainting the background every scroll frame, and
iOS Safari honours it where it ignores a fixed attachment. That also retired the
`@media (max-width: 520px)` override that existed only to dodge the iOS problem.

Visibility depends on one subtlety: `html` has no background, so `body`'s colour propagates
to the canvas and `body` itself paints none — which is what lets a `z-index: -1`
pseudo-element sit above it. Giving `html` a background would hide the backdrop entirely.

Verified by screenshot at scroll 3450 and 7500 — both far past the old bound — with the
fold pattern in the identical viewport position at each.

**The photograph itself was regraded.** The zip's `Background/Background.jpg` renders too
dark — mean luminance 234.7, darkest pixel 177, with 3.5% of it below 200. The design owner
supplied a lighter grade of the same 1512 × 2006 frame (mean 248.6, darkest 231, nothing
below 200), and that is what `ui/backgrounds/hero-blur.jpg` now holds. It is the third
deliberate exception to zip-is-source-of-truth, alongside the vector logo marks and the 2x
About portrait.

**Page fill.** Figma's `Home-Main` artboard is filled Green-100 `#F6F9FA`, with white only
for the top 2006 (the `Background` frame beneath the photograph). The site filled `body`
white throughout, so everything below y2006 was `#FFFFFF` where the design says `#F6F9FA`.
`body` is now `var(--accent-tint)` and the white moved into `body::before`'s colour layer,
which is what the `Background` frame actually is.

## 2. Everything else is unchanged

Section origins, the 1062 content column at x225 → x1287, the type scale
(`116, 90, 60, 35.71, 28, 26.95, 24, 20, 18, 16, 15.87`), the small-caps `0.823` scale, the
nav, About, the Portfolio index, the shared Title block, Logos, Branding, Posters,
Illustration and the Contact band all match v2. The three carousel pitches are unchanged:
Logos 1104.66, Posters 1059.67, Branding 749.

One count correction: `Folio-Branding-Minel` has **7** variants, so Minel is a 7-slide
project, not 6. The 6-variant `Minel` component set on the page is the *project* switcher
(six projects), not a slide set — v2 conflated the two.

## 3. Verified at 1512

| Check | Result |
|---|---|
| Section origins (10 of them) | Δ = 0 on every one |
| Document height | 10902, exact |
| Asset requests | 83 URLs, **zero** non-200 |
| Console | no errors |
| Hero button | 214 × 44, `rgb(118,172,178)`, w300, radius 22, shadow correct, one button |
| Nixie heading | x210.5 (= 218 − 7.5), 518.4 wide against Figma's 519 |
| Nixie composite | 958 × 654 at x203.5 (= 211 − 7.5), y8895 |
| Contact band / floral | band y10151 h751; floral y10188, right-anchored |
| Branding projects | 6, slide counts 7 / 6 / 6 / 6 / 6 / 6 matching Figma |
| Carousel pitch | Logos 2209px over 2 steps, Posters 2120px over 2 steps, Branding 749px |
| Social icons | Contact 117 / 122 / 117 / 117 at y10448; About 46 / 48 / 46 / 46 at y2451 — node-for-node |
| Social icon loads | all 8 return 200, natural sizes correct, none broken |
| `<picture>` swap | below 520 the Contact row serves the About SVGs at 63px, as the old CSS inversion did |
| Sticky backdrop | `position: fixed`, inset 0, sized to the viewport (1497 × 900), z-index -1 |
| Backdrop at depth | visible and unmoved at scroll 3450 and 7500, no seam at 2006 |
| Page fill | body `rgb(246, 249, 250)` = `#F6F9FA`; white under-layer on `body::before` |
| Backdrop grade | served file 238,424 bytes, 1512 × 2006, mean luma 248.6, darkest 231 — the light grade |
| Mobile @393 | 0px horizontal overflow, no broken images, collage hidden / carousel shown |

**Not verified here:** the rAF-driven anchor scrolling (audit v2 §18). The Browser pane runs
hidden in this environment, where `requestAnimationFrame` never fires, so the animation
cannot execute. The code is untouched by this pass and all of its targets — the section
offsets it scrolls to — are confirmed Δ = 0 above. Worth a manual click-through.

## 4. Section headings stay as text

The zip ships the six section wordmarks as outlined SVG
(`src/assets/ui/headings/*.svg`), which would retire the `-webkit-text-stroke` hack and its
`@supports not` fallback. They are **not** wired in: doing so would replace six `<h2>`
elements with images on a site that carries schema.org markup, a 68-image sitemap and
per-section SEO copy. `-webkit-text-stroke` is supported across current Chrome, Safari and
Firefox, and the existing fallback covers the rest. The SVGs are in the tree if that trade
is ever worth making.
