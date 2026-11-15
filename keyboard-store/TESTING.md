# Verification report

Verified on 12 November 2026.

## Results

- 75 automated tests passed across 8 files (`npm.cmd test`).
- ESLint passed (`npm.cmd run lint`).
- TypeScript compilation and Vite production build passed (`npm.cmd run build`).
- Production preview HTTP smoke checks returned 200 for `/`, `/products`, `/products/atlas`, `/cart`, `/checkout`, `/order-confirmation`, and a product SVG. These checks confirm serving and SPA fallback, not rendered browser behavior or hosting configuration on Vercel/Netlify.

## Tested behavior

`tests/rules.test.ts`: catalog completeness, all gallery assets exist, malformed carts, unknown products/variants, duplicate lines, stock caps, distinct variants, removal, variant surcharges, shipping threshold, empty orders, order snapshots, required checkout fields, supported postal formats, consent and country validation.

`tests/shopping.test.tsx`: homepage-to-product navigation, category/brand/search/price filters, sorting, reset/empty results, selecting variants and quantities, cart totals and persistence across remounts, removal, sold-out controls, old-cart migration, malformed-cart recovery, cross-tab storage events, blocked storage, missing routes/products, navigation toggle state, error focus and accessible names, successful checkout, cart clearing, privacy of receipts, receipt reload and fallback when storage fails.

`tests/receipt.test.ts`: valid receipt restoration; rejection of malformed, inconsistent, and non-finite receipt data; exclusion of extraneous personal fields.

## Bugs fixed during testing

1. Checkout errors were included inside form labels, changing the accessible names of invalid fields. Error text is now separate and linked through `aria-describedby`.
2. A previous saved receipt could override the new order when writing the new receipt failed. The current validated navigation state now takes priority.
3. Browser-history receipt data lacked validation. Both history and saved receipts now use a common validator that checks line values and totals before rendering.

## Limits

Tests run in jsdom, not a browser rendering engine. Browser access reported `The browser access host is unavailable`; the earlier Windows browser path also reported unsupported URL-policy enforcement. No actual desktop/mobile screenshots, overflow checks, touch behavior, full rendered color contrast audit, screen reader sessions, or cross-browser rendering tests have been completed. Testing mobile menu state does not verify its mobile layout.

The site is not deployed. No real order or payment was submitted. Installed dependencies still have the previously reported moderate development-tooling audit warnings; this report does not claim a clean dependency security audit.

## Manual visual pass still needed

At widths 375, 768, and 1440 pixels, inspect the homepage, catalog/filter controls, product gallery and variant buttons, cart, and checkout. Confirm no horizontal overflow, visible focus, usable navigation, readable text, and comfortable touch targets. Complete a demo checkout using fictional details, then refresh the confirmation page. Repeat in Firefox and Chromium.

## Theme and language verification

Added light/dark themes and English, Italian, and German language preferences. The current suite has 60 passing tests across 5 files.

`tests/preferences.test.tsx` covers theme persistence and OS preference, saved/invalid language values, translated headings and document language/title, localized USD formatting, preserved variants/cart/checkout data, stable category URLs, translated validation errors, checkout in Italian, storage failure, scroll/focus preservation, cart announcements, and keyboard dismissal of translated navigation.

`tests/theme-coverage.test.ts` checks that literal interface translation keys have language entries and that the primary text, muted text, accent, and error tokens reach a 4.5:1 contrast ratio against the main surface tokens in both palettes. These are palette calculations, not a complete rendered accessibility audit.

Lint and production build pass after the changes. Actual desktop/mobile screenshots and overflow checks remain unverified because browser access is unavailable. Review both themes in all three languages during the pending manual visual pass, especially the header, long German labels, forms, and order summary.

## Supplied product image verification

After adding the 17 supplied images, all 66 tests across 6 files pass; lint and the production build also pass. `tests/product-images.test.tsx` verifies that all supplied files are mapped to valid products and variants, every original SVG placeholder still exists, placeholder mode resolves the original artwork, products with no supplied images retain their placeholders, failed image loads fall back without retry loops, gallery selections reset on variant changes, single-image variants work, and the homepage/cart use the correct supplied images. Actual browser rendering remains unverified.

## Motion verification

71 tests pass across 7 files after adding motion; lint and the production build pass. `tests/motion.test.tsx` verifies visible fallback without IntersectionObserver, reduced-motion handling, reveal cleanup when preferences change, image-load callback preservation, and image-error fallback with motion disabled. Existing shopping, language, theme, and image tests continue to pass. Animation timing, smoothness, and mobile-menu rendering still need visual review in a real browser; jsdom does not render animations.

## Readability and formatting verification

On 15 November 2026, the source, styles, scripts, tests, and configuration were formatted with Prettier. Grouped variable declarations were separated and dense conditional logic was simplified. The CSS palette test now accepts normal formatting whitespace. All 75 tests pass, along with lint, the production build, and the formatting check. The SVG generator was executed with an in-memory output verifier: all 70 generated SVGs match the original artwork structurally, ignoring formatting whitespace. No image files were rewritten.
