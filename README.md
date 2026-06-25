# Modern Dentology — Premium Dental Website + CMS

A fully dynamic dental clinic website with an admin dashboard. Built with
Next.js (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL.
Every piece of content is managed from the admin panel — no code changes needed.
Lead dentist: **Dr. Abdul Basit**.

## Quick start (open in VS Code and run)

```bash
# 1. Clone the repo
git clone https://gitlab.com/toopphotos19-group/toopphotos19-project.git
cd toopphotos19-project

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# then edit .env (see below)

# 4. Create the database tables and starter content
npm run db:push
npm run db:seed

# 5. Run
npm run dev
```

Open http://localhost:3000 for the website, and
http://localhost:3000/admin/login for the admin dashboard.

## Required `.env` values

| Variable | What it is | Where to get it (all free) |
|----------|-----------|-----------------------------|
| `DATABASE_URL` | PostgreSQL connection string | https://neon.tech (free) |
| `NEXTAUTH_SECRET` | Random secret for sessions | run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `http://localhost:3000` locally |
| `ADMIN_EMAIL` | **Your admin login email** | you choose it |
| `ADMIN_PASSWORD` | **Your admin login password** | you choose it |
| `CLOUDINARY_*` | Image/video/CV uploads | https://cloudinary.com (free) |

## Your admin account

There is no pre-made password. **You set it** in `.env` before running
`npm run db:seed`:

```
ADMIN_EMAIL=admin@moderndentology.com
ADMIN_PASSWORD=ChooseAStrongPassword
```

The seed script creates that account in your database. Log in at
`/admin/login` with those exact values. To change it later, update `.env` and
re-run `npm run db:seed`, or add user management in the admin panel.

## What you can manage from /admin

Services, Technology, Doctors, Testimonials, Blog, Gallery, FAQ, Job openings,
plus incoming Bookings, Job Applications, Leads/Inquiries, and all
Site/Homepage Settings (hero, contact info, social links, SEO). Every image is
uploaded by you through the admin (Cloudinary).

## Deploying free

- Push to GitHub/GitLab, import into **Vercel** (free).
- Add the same `.env` variables in Vercel project settings.
- Set `NEXTAUTH_URL` to your Vercel URL.
- Neon + Cloudinary already work in production on their free tiers.

## Documentation

Step-by-step guides live in the `docs/` folder:
- `docs/01-getting-started.md`
- `docs/02-homepage.md`
- `docs/03-admin-and-pages.md`
# modern-dentology
