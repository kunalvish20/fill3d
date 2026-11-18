# UFILL3D — Delivery Verification (2026-11-17)

## Verified in artifact-generation container

| Check | Result | Evidence |
|---|---|---|
| Source files created | PASS | Next App Router structure, components, server API, migration, README |
| TypeScript/TSX syntax parse | PASS | Parsed each `.ts` and `.tsx` file with TypeScript compiler API; zero syntax diagnostics |
| Local import paths | PASS | Every local `@/` dependency resolves to a project source file |
| CSS syntax parse | PASS | PostCSS parser accepted `app/globals.css` |
| Minimum required routes present | PASS | Verified all 14 requested route patterns via file existence |
| Procedural model exists | PASS (static) | `components/three/Spool.tsx` contains actual geometry and instanced filament coils |
| GSAP scroll model binding exists | PASS (static) | `components/sections/HomeExperience.tsx` and `HeroWebGL.tsx` |
| Dynamic filament tube logic exists | PASS (static) | 240-segment TubeGeometry draw range controlled by chapter progress |
| Color-to-cart variant wiring exists | PASS (static) | Zustand configurator + cart, product variants |
| Checkout server-side validation + SQL row locks exist | PASS (static) | `reserve_checkout` SQL RPC; price never trusted from browser |
| Payment webhook HMAC and idempotent paid transition exist | PASS (static) | Verified HMAC + `apply_payment_event` SQL RPC |
| Admin auth and storage upload guards exist | PASS (static) | JWT validation and admin membership |

## Not verified in this execution environment

The container could not resolve `registry.npmjs.org` (`curl: Could not resolve host`); attempts to install npm dependencies did not complete. Consequently, the following **cannot be truthfully reported as passed**:

| Check | Status |
|---|---|
| `npm install` on an internet-connected computer | UNTESTED |
| `npm run dev`, initial page hydration | UNTESTED |
| `npm run typecheck` full semantic check | UNTESTED |
| `npm run build` production Next.js compile | UNTESTED |
| Actual WebGL graphics / GPU speed / spool geometry orientation | UNTESTED |
| ScrollTrigger pinning, reverse scrolling and quick-scroll stability | UNTESTED |
| Mobile rendering at 320/375/390/768/1024/1440px | UNTESTED |
| End-to-end login, cart checkout, Supabase policies | UNTESTED |
| Real Razorpay test transaction, webhook delivery, refunds | UNTESTED |
| Real Vercel deployment / live preview URL | NOT PERFORMED |

## First-run manual acceptance checklist

1. `npm install` then `npm run typecheck` and `npm run build`.
2. `npm run dev` and inspect `/` at 1440px and 390px; verify purple 3D spool, perforated flanges and coil material.
3. Scroll down and back up through chapter 2; ensure the spool reverses and the curved strand extends/retracts.
4. Open Color Universe and change 3 colors; inspect the model and add selected color to cart.
5. Open `/shop`; test material filtering, color filtering, search, price sort, Quick View and product details.
6. Open `/shop/pla-plus` and `/customize`; drag-rotate, zoom, select 0.5/1kg, add to cart, reload and confirm persisted items.
7. Complete `/checkout` in demo mode; confirm **DEMO** on result page and no real payment.
8. Configure Supabase and migration; create admin account; verify unauthorized access to `/api/admin/products` returns 403.
9. Run two simultaneous checkout attempts for the last SKU; confirm row-level stock locking prevents oversell.
10. With Razorpay test credentials: verify invalid browser signature is rejected, valid signature is checked but **does not** set paid, signed `payment.captured` webhook sets paid once, replay does not double-count.
11. Confirm the owner can view orders, coupons and upload a product image while a non-admin cannot.
12. Run responsive checks at 320/375/390/768/1024/1440 and inspect console for WebGL/hydration errors.
13. Enable OS 'Reduce motion' and confirm pinned motion is simplified and content remains readable.

## Production-readiness gaps

Payment reconciliation for abandoned sessions; fulfillment logistics; tax and shipping computation; customer email/SMS; refunds/disputes; rate limiting/anti-spam; measured accessibility/performance review; commercial warranty, privacy and returns policies. **This is a runnable source-code implementation intended to be integrated and verified, not certified production commerce software.**
