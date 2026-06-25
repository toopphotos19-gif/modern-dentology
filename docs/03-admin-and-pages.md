# Step 3 - Admin Dashboard + Public Detail Pages

This is the core of your request: **manage everything from the admin panel**.

## Logging in

1. Make sure you ran the seed (`npm run db:seed`) — it created your admin user
   from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
2. Start the app (`npm run dev`).
3. Go to **http://localhost:3000/admin/login**
4. Log in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## What you can manage now

The admin sidebar gives you: Dashboard, Services, Technology, Doctors,
Testimonials, Blog, Gallery, FAQ, Bookings, Careers, Site Settings.

This MR ships full working management for:

- **Services** — add / edit / delete, upload card + banner image, set SEO,
  enable/disable, ordering. (`/admin/services`)
- **Bookings** — view all appointment requests and change status
  (Pending / Approved / Rejected / Rescheduled). (`/admin/bookings`)
- **Careers** — view applications, download CVs, change hiring status
  (New / Shortlisted / Interview / Rejected / Hired). (`/admin/careers`)
- **Site & Homepage Settings** — edit hero title/description/buttons, upload
  hero image, set contact info, social links, and default SEO.
  (`/admin/settings`)

The same pattern (list page + form + server actions) repeats for the remaining
entities, added in the next MR.

## Image uploads (Cloudinary)

To upload images, add your free Cloudinary keys to `.env`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Get them from https://cloudinary.com (free). Until then, image areas show the
placeholder. The upload widget calls `/api/upload`, which stores the file on
Cloudinary and saves the returned URL to the database.

## New public pages

- `/services` and `/services/[slug]` (dynamic detail: banner, benefits,
  related services, book button, per-page SEO)
- `/doctors` and `/doctors/[slug]` (dynamic profile)
- `/technology` and `/technology/[slug]` (dynamic detail)

All read from the database, so whatever you add in admin appears instantly.

## Security

- Passwords hashed with bcrypt.
- All `/admin` pages are guarded server-side (redirect to login if not
  authenticated).
- All write actions re-check the session before touching the database.
