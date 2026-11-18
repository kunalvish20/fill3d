# UFILL3D — Cinematic 3D Filament Store

**NEW / 2026-11-17:** Cursor-draggable hero spool and cinematic second chapter where one filament divides into four paths, flashes, and reveals four functional product cards. See [`ANIMATION_GUIDE.md`](./ANIMATION_GUIDE.md) for controls and timings.


Original purple creative-commerce experience built with Next.js App Router, React 19, TypeScript, React Three Fiber / Three.js, GSAP ScrollTrigger, Lenis, Zustand, Tailwind CSS, Supabase and Razorpay.

## Windows setup (no database or API key required)

1. Install **Node.js 20.9+** (Node.js 22 LTS recommended).
2. Extract `UFILL3D-Cinematic-3D-Store.zip` anywhere, e.g. `D:\Projects\ufill3d`.
3. Open the extracted `ufill3d` folder in VS Code.
4. Open PowerShell or Terminal inside this folder and run:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

5. Open **http://localhost:3000**.

The demo catalog, 3D homepage, product viewer, configurator, product pages, persistent local cart, and **clearly labeled demo checkout** do not require credentials. If you cannot create `.env.local`, the application still runs with no keys. The demo checkout never collects money, stores a real order or claims a paid transaction.

### Scripts

```bash
npm run dev       # local development
npm run typecheck # TypeScript checking
npm run build     # production build
npm run start     # run production build
```

## Routes

`/` cinematic homepage • `/shop` full catalog with material/color/search/price filters • `/shop/[slug]` interactive 3D product • `/customize` real 3D material-color-weight configurator • `/cart` saved cart • `/checkout` • `/checkout/success` • `/checkout/failed` • `/account` authentication and saved addresses • `/orders` verified live orders • `/about` • `/contact` • `/faq` • `/admin` role-gated operations.

## The 3D spool

The flagship model is **actual procedurally generated WebGL geometry**, not a CSS image. It consists of two extruded perforated annular flanges, an open-ended main barrel and hub, metallic edging, 528 individually positioned wound filament coils rendered via one instanced mesh, separate physical material systems, a branded canvas-texture ring label, studio lighting, plus four dynamically aligned scroll-animated filament paths. The spool is maintained in a **single persistent homepage canvas** while the chapters move around it.

- `components/three/Spool.tsx` — procedural 3D geometry, material color easing, label generation
- `components/three/HeroWebGL.tsx` — camera, lights, particles, spool scroll rig
- `components/sections/ThreadReveal.tsx` — measured filament paths and four functional product cards
- `components/sections/HeroSpoolInteraction.tsx` — drag and keyboard controls
- `components/three/CinematicCanvas.tsx` — scroll state and fallback
- `components/sections/HomeExperience.tsx` — eight chapters, pinned scroll, GSAP and Lenis sync
- `components/three/ProductViewerInner.tsx` — drag, zoom, independent product material views
- `components/three/PrinterSceneInner.tsx` — progressive layered print simulation

The spool rotation is reversible with scroll progress; the unwinding strand is an artistic procedural depiction, not a mechanically exact filament-feed simulation. Scroll-based pinned storytelling is intentionally simplified when `prefers-reduced-motion` is enabled. Mobile has reduced spool scale and a reduced device pixel ratio. No proprietary GLB asset or copyrighted imagery is included.

## Supabase: enable real catalog + account + inventory + orders

1. Create a Supabase project.
2. In Supabase **SQL Editor**, run the entire file `supabase/migrations/001_storefront.sql`.
3. Copy Project URL and publishable/anon key from Project Settings / API into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
```

4. In Authentication, enable Email; configure your live URL and auth redirect URLs in Supabase Auth > URL Configuration.
5. Restart `npm run dev`. The site will now read the seeded Supabase catalog. Change test SKUs, inventory, names, prices and descriptions in Supabase before accepting real orders.
6. Create an account via `/account`. An admin login is *not* created automatically. After sign-up, copy the user's UUID from Supabase Authentication > Users. In SQL Editor (use your *real UUID*):

```sql
insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');
```

7. Sign in via `/account` and open `/admin`. Admin REST endpoints revalidate the user's JWT and `admin_users` membership using the server. RLS restricts private tables; browser code never contains the service-role key.

### Live inventory and checkout details

The client submits **product, color, nominal diameter, weight and quantity**, but **does not submit trusted prices**. The server resolves exact database variants, then calls `reserve_checkout` to lock stock rows and coupons in one PostgreSQL transaction and reserve stock. Each order gets its own UUID and inventory reservation. Concurrent purchases cannot sell stock below zero. Successful payment capture must be confirmed by a **signed Razorpay webhook** before `orders.status='paid'`. The browser signature check alone cannot mark an order paid.

> **Operational requirement:** `pending` orders reserve stock. A store operator must configure a reconciliation process for abandoned/expired payment sessions. Before releasing inventory, verify the provider's current order/payment status. You can then call `release_pending_order(order_uuid)` using a privileged scheduled worker. Late captured payments against expired orders are explicitly marked `review_required` and require manual refund/fulfillment investigation. Do not schedule blind expiry in production.

## Razorpay: enable verified real payments

Set these additional server environment variables:

```dotenv
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_PRIVATE_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_INDEPENDENT_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Use Razorpay **test credentials** for payment workflow validation first; test mode is not a real monetary payment. Set a webhook in the Razorpay dashboard for:

```text
https://your-domain.com/api/checkout/webhook
```

Subscribe at minimum to `payment.captured`, `order.paid`, and `payment.failed`. Configure the same webhook secret in Razorpay and the `RAZORPAY_WEBHOOK_SECRET` variable. The webhook reads the *raw* request body, verifies the HMAC-SHA256 signature, deduplicates event IDs transactionally, checks order identity + INR amount, and updates order state through one server-only SQL function. `/api/checkout/verify` checks the browser-returned checkout signature against a real Razorpay payment fetch but **never** authorizes payment settlement by itself.

**Important:** Supabase and Razorpay must both be configured (with all required keys) for `live` mode. The home/catalog/cart always remain available with no keys. For production launch implement rate limiting (or WAF), provider reconciliation, shipping & tax calculation, business policy pages, dispute/refund handling, monitoring, email delivery, and a complete security review. These are not asserted as already production-complete.

## Supabase Storage and product photography

The migration creates a public `ufill-product-images` bucket limited to PNG/JPEG/WebP (5 MB). Admin-only `POST /api/admin/upload` verifies the user session and admin membership, file size and file signature, and writes a randomly named object using the server-side service role. In `/admin` → Products, choose **UPLOAD IMAGE** next to a product to save its `image_path`. Published product art uses the uploaded image when present, or the bundled original SVG spool illustration otherwise. A live 3D product viewer is always available on details/configurator pages.

## Contact and newsletter

When Supabase is configured, messages are stored in `contact_messages` and newsletter addresses in `newsletter_subscribers`, both RLS-protected against public reads. Admin can read them. No outbound mail provider is bundled. Without Supabase, both forms explain that data has **not** been delivered. Production should include antispam/rate limiting and consent language.

## Vercel deployment

1. Push this folder to a GitHub repository.
2. In Vercel select **Add New > Project** and import the GitHub repository.
3. Choose Next.js framework, **Root Directory** `./` (or `ufill3d` if nested).
4. Add exactly the same `.env.local` values in Vercel **Environment Variables** for Production, Preview or Development as needed. **Never commit `.env.local`**. All service role and payment secret variables must remain server-only.
5. Deploy. Vercel assigns a real preview URL. Update Supabase Auth Site URL / Redirect URLs and Razorpay webhook URL to your actual deployed domain.
6. Test complete payment-capture webhook behavior on Razorpay test mode, then configure production credentials only after compliance and operations review.

**This ZIP does not include a live deployed preview URL.** No hosting service was accessed.

## Current implementation boundaries

- The procedural spool and cinematic sequence are fully supplied as source, **but rendering and FPS must be visually verified on your target devices**. Performance depends on GPU, browser and DPI.
- Product prices, descriptions, inventory quantities and material starting temperatures are **illustrative demo data**, not commercial promises, tested material certificates or real stock.
- The printer sequence is an artistic animation; it does not simulate a full g-code toolpath.
- The admin interface provides catalog/variant/coupon CRUD, protected customer/message/order views and basic paid-order analytics. It does not yet include complex shipping label generation or multi-role employee workflows.
- Orders created in guest checkout are not automatically associated with a later account. For account order history, sign in **before** checkout. Guest self-service tracking is not implemented.
- The site has no production-ready email sending, shipping provider or tax engine. Real webhook tests, accessibility testing on actual hardware, live provider sandbox tests and production payment reconciliation are still required.

## Tests performed during artifact generation

- TypeScript and TSX **syntax parsing** across project source: PASS.
- Static route/file, integrity and ZIP checks: see `TEST_REPORT.md`.
- `npm install`, Next.js production compile and actual browser interaction tests: **NOT EXECUTED successfully** in the artifact-generation environment because external npm registry DNS was unavailable. These must be run locally; the file package is a source-code deliverable, **not a claim of verified production readiness**.
