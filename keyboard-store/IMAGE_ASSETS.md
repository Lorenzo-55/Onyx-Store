# Supplied product image mapping

All 17 files from `../Temp-Keyboard-images/` are copied into `public/images/provided/`. The originals remain in the source folder. Original SVG placeholders in `public/images/` and the CSS keyboard component are retained.

## Restore placeholders

In `src/data/product-images.ts`, change:

```ts
export const PRODUCT_IMAGE_MODE: ImageMode = 'provided'
```

to:

```ts
export const PRODUCT_IMAGE_MODE: ImageMode = 'placeholders'
```

This restores the original product cards, galleries, cart images, and CSS homepage keyboard. Set it back to `provided` to use the supplied images again. Products without supplied images always use their placeholders. A supplied image that fails to load falls back to an original SVG.

## Current mapping

- **Atlas 75 / Sage:** studio overview, alternate keyboard view, green macro detail, and the Sage/Sand collage.
- **Atlas 75 / Sand:** volume-dial overview, both sand macro views, warm-neutral macro detail, and the Sage/Sand collage.
- **Slate TKL / Graphite:** graphite TKL with white backlighting.
- **Slate TKL / Silver:** silver TKL with white backlighting.
- **Arc 98 / Olive:** olive-and-cream overview, olive studio shot, olive alternate view, and the Arc variants collage.
- **Arc 98 / Stone:** warm-gray overview, warm-gray top view, premium-gray alternate view, and the Arc variants collage.

`public/images/provided/source-map.json` records each site's filename and its exact original filename. Collages appear only as supplemental variant-overview images, not primary product images. No supplied image matches the Drift 60, barebones kits, switches, keycap sets, or accessories, so these retain their original illustrations.

Images remain concept imagery for fictional portfolio products. Some provided views differ in key layout and detailing; the closest matching product/finish has been used without altering the original images or the catalog specifications.
