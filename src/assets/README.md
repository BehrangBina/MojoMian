# Asset naming

Every path says where the asset renders and what it is:

```
src/assets/<section>/<project>/<purpose>-NN.<ext>
```

All lower kebab-case. No spaces, no capitals, no numeric-only folders. Section folders
mirror the page's sections, so a path alone tells you which part of the site draws it.
`ui/` holds chrome shared across sections; `mobile/` mirrors the same shape for phones.

```
ui/           logo-mojo.svg, og-image.jpg, floral.svg
  icons/      nav-arrow-hover, angle-up, carousel-next[-disabled], carousel-prev[-disabled], etsy
  headings/   outlined section wordmarks + their 0.75 rules (see audit v3 §4 — not wired in)
  backgrounds/hero-blur.jpg, contact-band.jpg (clean 2x band with the floral baked in, 1512 × 877)
  buttons/    hero-button.png, hero-button-hover.png
about/        portrait.png, floral-back.png, icons/{email,instagram,telegram,pinterest}.svg
logos/
  marks/      <brand>.svg   — what the page renders
  cards/      <brand>.jpg   — raster copies, declared in sitemap.xml for Google Images
branding/
  <project>/  slide-NN.jpg + brand-colors.png
  index/      01-06.svg     — the project index digits
posters/      <series>-NN.jpg
illustration/ collage.png
nixie-doll/   composite.png, instagram.png, hero-mobile.png, carousel/, story/
contact/      icons/{email,instagram,telegram,pinterest}.png
mobile/       the same shape again — phones (<= 520px) only, from Figma "Mobile-Final" (393 wide)
  ui/         icons/{burger,close}.png (the nav + Read More panel), backgrounds/contact-band.jpg
              (393 x 714, floral baked in); icons/carousel-{next,prev-disabled}.png and
              nixie-doll/{nixie-hi,nixie-intro}.png still serve the 521-900 tablet layout
  about/      portrait.png — the leaves without the baked-in role text
  branding/   <project>/slide-01..06.jpg — 391 x 253 @2x; mostly the desktop slides, a few re-picked
  posters/    slide-01..04.png — each carries its own teal r15 card
  illustration/ collage.png — 393 x 660
  nixie-doll/ dolls.png, phone.png (the Instagram handle over it is live text)
```

Phones reuse the desktop artwork where it is the same thing at higher resolution: the vector
`logos/marks/*.svg`, `about/icons/*.svg` and the 117px `contact/icons/*.png`. The
`Mobile.zip` export's whole-card logo JPGs, heading SVGs and 1x arrow PNGs are not used —
the site draws those as live text and CSS. Its `Slide-Minel-001.jpg` came at 1x, so that
slide is the desktop original scaled to 782 x 506.

Branding projects use their real names, never `01`–`06`:
`minel, moji, shahrzad, curly, miss-broccoli, knight-coffee`.
Poster series likewise: `reza-shah-01/02`, `mahsa-amini-01/02`.

## Where these come from

The design owner's `Desktop.zip` export is the **source of truth for images**. Two
deliberate exceptions, both because the zip is lower quality than what the repo already had:

- `logos/marks/*.svg` — the zip ships these as 2132 × 1478 JPGs, a resolution-dependent
  downgrade of the same artwork. The vectors stay; `logos/cards/*.jpg` keeps a raster copy
  purely so the Logos section remains indexable in Google Images.
- `about/portrait.png` — the zip export is 1x (521 × 417); the repo's is 2x (1042 × 834).
- `ui/backgrounds/hero-blur.jpg` — the zip export renders too dark (mean luminance 234.7,
  darkest pixel 177, 3.5% of it below 200). The design owner supplied a lighter grade of the
  same 1512 × 2006 photograph (mean 248.6, darkest 231, nothing below 200); that is the one
  in use.

Two branding slides Figma specifies were absent from the zip (`moji/slide-06`,
`shahrzad/slide-06`) and were exported from Figma at 2x to match.

`tools/figma-assets.mjs` re-exports the vector marks, the floral and the nav arrow straight
from Figma — each entry names its own `out` path. Run it when the design changes and the zip
has not caught up:

```
node tools/figma-assets.mjs                 # everything
node tools/figma-assets.mjs logo-curly      # one asset
```

After adding or removing portfolio images, regenerate the sitemap:

```
python tools/build-sitemap.py
```
