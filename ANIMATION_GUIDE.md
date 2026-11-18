# UFILL3D — THE UNWINDING (cinematic hero → product reveal)

This version modifies your original Next.js store. All storefront/admin/checkout routes and your existing color configurator are retained. The new **second chapter** replaces the old four text-only spool steps. It uses the existing procedural Three.js model, one persistent canvas, Lenis and one GSAP ScrollTrigger timeline.

## Experience at a glance

1. **Hero:** right-side 3D spool. **Drag** (mouse/pen/finger, where supported) to rotate; **arrow keys** work while the drag surface is focused. On normal page scroll the wheel rotates slowly.
2. **Arrival:** scroll into chapter 02; the same spool moves toward the center and scales down smoothly, with no canvas remount.
3. **Single filament:** one bright, carefully tapered thread grows from the spool.
4. **Four branches:** one continuous source divides into four curved threads. SVG paths are measured from the *actual product-card DOM positions*, so the lines remain aligned after responsive resizing.
5. **Magic moment:** tiny stars and a very short light flash are synchronized with the filament tips.
6. **Four products:** real catalog products lift in with a GSAP stagger. Each has a working product link and a functional **add-to-bag** control wired to Zustand.
7. **Reverse:** scrubbing backward reverses lines, sparkles, flash and card entrance. The WebGL spool remains in the same fixed canvas throughout the entire homepage.

## Where to customize

| File | Purpose |
| --- | --- |
| `components/sections/HomeExperience.tsx` | GSAP master timeline and Lenis/ScrollTrigger synchronization |
| `components/sections/ThreadReveal.tsx` | Four product cards and responsive filament geometry |
| `components/sections/HeroSpoolInteraction.tsx` | Hero drag / touch / keyboard rotation control |
| `components/three/HeroWebGL.tsx` | 3D model travel, scrolling rotation, damping, cinematic lights |
| `components/three/CinematicCanvas.tsx` | Shared 3D motion state, WebGL feature detection |
| `app/unwind.css` | Chapter appearance, product-card details, mobile layout, reduced-motion support |
| `public/images/spool-{ocean,sage,copper,violet}.svg` | Original UFILL3D-branded product art, without third-party watermarks |

## Scroll choreography

GSAP ScrollTrigger pins `#spool-chapter` for approximately **4.4 viewport heights** on normal-motion devices. Progress from 0 to 1 is the animation source of truth. Main intervals in `HomeExperience.tsx`:

- `0.01–0.28`: spool moves to center and the intro settles.
- `0.29–0.45`: single filament draws out.
- `0.43–0.70`: four branches reach the cards.
- `0.62–0.84`: particle flash and staggered product-card entrance.
- `0.88–1.00`: cards become fully interactive, then the user continues to the next section.

For a faster/slower experience, modify `end:()=>\`+=${Math.max(window.innerHeight*4.4,2700)}\``. Keep all stages on the same timeline to prevent lag or discontinuities.

## Local run

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000`. No Supabase keys are needed for the demo catalog and animations. An environment file is optional for the demo. Test the homepage with a WebGL-capable browser. With `prefers-reduced-motion`, the prolonged pin is skipped and all four cards are accessible as ordinary content.

## Production notes

The original starter's payment/account/admin behavior is unchanged. Live payments still require real Supabase and Razorpay configuration and the production security/fulfillment steps described in `README.md`. A beautiful storefront is **not** a replacement for a production checkout audit. Replace generated SVG product illustrations with your actual UFILL3D photos later by setting each product's `imageUrl`.

**No live public preview URL is included:** this project is delivered as runnable source; hosting/deployment has not been performed.
