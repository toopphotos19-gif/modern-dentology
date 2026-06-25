# Step 2 - Premium Animated Homepage (Modern Dentology)

Adds the public homepage, header/footer, and sample TEXT content. Branded for
**Modern Dentology** (lead dentist **Dr. Abdul Basit**).

## Images: you add them all from the admin panel

Per your instruction, **no images are seeded**. Every image area shows a clean
placeholder box (“Add image from admin”) until you upload your own picture from
the admin dashboard (built in the admin merge request). The placeholder logic
lives in `src/components/ui/ImagePlaceholder.tsx` and is reused everywhere
(hero background, service cards, technology cards, doctor photos, gallery,
blog images). Nothing is hardcoded.

## What was added

- **Header** (`src/components/layout/Header.tsx`): fixed, transparent over hero,
  solid white on scroll, mobile menu, animated entrance.
- **Footer** (`src/components/layout/Footer.tsx`): links + contact info from DB.
- **Hero** (`src/components/home/Hero.tsx`): full-screen, image OR video
  background (both optional), animated text, floating elements, two CTAs.
- **Stats** (`src/components/home/Stats.tsx`): counters that animate on scroll.
- **CardGrid** (`src/components/home/CardGrid.tsx`): animated cards for
  Services / Technology / Doctors with hover lift + image zoom.
- **Testimonials** (`src/components/home/Testimonials.tsx`): star ratings.
- **ImageBox** (`src/components/ui/ImagePlaceholder.tsx`): image-or-placeholder.

## How to run

```bash
git pull
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000 — full animated homepage with empty image
placeholders ready for you to fill from admin.

## What comes next

Your top priority is **managing everything from the admin panel**, so the next
merge request builds **admin login + dashboard** with CRUD + image upload for
services, doctors, technologies, testimonials, blog, gallery, FAQ, bookings,
careers, and hero/site settings.
