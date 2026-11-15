# ØNYX — Mechanical keyboard concept store

A frontend-only portfolio storefront built with React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide. ØNYX is temporary branding; no trademark availability is claimed.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Use `npm` instead of `npm.cmd` outside Windows PowerShell.

## Implemented

- Dark homepage, mobile navigation, five category links, and footer.
- 18 fictional products with brands, specifications, variants, mock stock, and sample ratings.
- Supplied images for Atlas 75, Slate TKL, and Arc 98; original SVG placeholders are retained for restoration and fallback. All assets are local.
- Catalog search, category/brand/price/stock filters, and price/name sorting, preserved in the URL.
- Product details, variant pricing, quantity selection, stock limits, and related products.
- Persistent variant-aware cart, quantity changes, removal, shipping calculation, and empty states.
- Validated simulated checkout, demo consent, and a recoverable receipt.
- Contact/address fields exist only in checkout page memory. Receipts contain product lines and totals, with no personal information.
- Accessible labels, error descriptions, focus handling, skip navigation, and reduced-motion support.

Brand text is in `src/lib/format.ts` and `index.html`. Product data is in `src/data/products.ts`; artwork can be regenerated with `node --experimental-strip-types scripts/generate-product-art.mjs` on Node 22.

## Checks

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

`npm.cmd run test:watch` runs tests in watch mode. Vitest and React Testing Library exercise the application using jsdom. See `TESTING.md` for coverage, confirmed fixes, and verification limits.

## Deployment

`npm.cmd run build` outputs `dist/`. Deploy as a static SPA on Vercel or Netlify. Route fallbacks are in `vercel.json` and `public/_redirects`. The project has not been published.

## Remaining work

Real-browser visual checks across desktop, tablet, and mobile are still required. Final branding and images for the remaining products are design decisions. Wishlist, comparison, and a keyboard builder are optional later enhancements.

All products, specifications, prices, and ratings are illustrative. There is no backend, authentication, actual order submission, or payment processing. Original requirements: `PROJECT_BRIEF.md`.

## Theme and language

The header contains a light/dark toggle and an English / Italiano / Deutsch selector. Both preferences are saved locally. On first visit the theme follows the operating system; English is the default language. The small `public/preferences.js` bootstrap applies saved preferences before React loads.

Translations live in `src/i18n/messages.ts` (interface) and `src/i18n/products.ts` (product content). Entries contain Italian and German translations of each English source string. Product and brand names, identifiers, ANSI key legends, technical acronyms, and measurement units are preserved. Prices remain in USD and use the selected locale's formatting; language selection does not convert currency. URL category and variant IDs remain stable across languages.

Color tokens for both themes live in `src/index.css`; component styles use these tokens. Test coverage includes persistence, translated navigation and filtering, validation errors, a checkout in Italian, storage failure, and preservation of cart/form state during language changes.

## Supplied images

17 supplied images are active for Atlas 75, Slate TKL, and Arc 98, including finish-specific galleries, cards, cart images, and the homepage hero. All original placeholders and supplied source files remain intact. Set `PRODUCT_IMAGE_MODE` to `'placeholders'` in `src/data/product-images.ts` to restore the original artwork site-wide. See `IMAGE_ASSETS.md` for the mapping and rollback instructions.

## Motion

`src/motion.css` defines short page entrances, staggered product-grid transitions, section reveals, mobile menu transitions, theme color changes, and cart/checkout feedback. `src/hooks/useScrollReveal.ts` uses IntersectionObserver to reveal below-fold sections once; content stays visible if that API is unavailable, and focused sections are immediately visible. Product images fade after loading without hiding them while they download.

All CSS animations/transitions and smooth scrolling are disabled for `prefers-reduced-motion: reduce`. Image animations also honor that preference, and scroll reveals clear immediately if the preference changes. Animation code adds no dependencies. Shopping and form actions are never delayed for animations.

## Product comparison

Use Compare product on any product card or details page to select up to three products. Open Compare products in the navigation to view starting prices, availability, options, and the union of their specifications. Show differences only hides matching rows; unavailable specifications are labeled Not applicable. Remove products individually or clear the selection. Selection survives reloads in local storage and continues in memory if storage is blocked. The comparison supports English, Italian, German, both themes, and a horizontally scrollable table on small screens.

## Code formatting

Source files, styles, tests, scripts, and configuration use Prettier with two-space indentation, single quotes, and a 90-character target width. EditorConfig keeps indentation and line endings consistent. Generated images, build output, dependencies, the lockfile, and the original project brief are excluded.

```powershell
npm.cmd run format
npm.cmd run format:check
```

The first command applies formatting; the second checks formatting without modifying files. Long product descriptions and translations remain intact as text strings.
