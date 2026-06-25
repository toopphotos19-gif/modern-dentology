# Step 1 — Getting Started (Project Scaffold)

This is the foundation of your dental website. Follow these steps exactly.
No prior experience needed.

## What this project uses (all free)

| Purpose | Tool | Free tier | Sign up |
|--------|------|-----------|---------|
| Framework | Next.js (App Router) + TypeScript | yes | n/a |
| Styling | Tailwind CSS | yes | n/a |
| Animation | Framer Motion + GSAP | yes | n/a |
| Database | Neon (PostgreSQL) | yes | https://neon.tech |
| File/image/video uploads | Cloudinary | yes | https://cloudinary.com |
| Admin login | NextAuth | yes | n/a |
| Hosting | Vercel | yes | https://vercel.com |
| Email (optional) | Resend | yes | https://resend.com |

## 1. Install prerequisites

Install **Node.js 18+** from https://nodejs.org (LTS version).
Verify in a terminal:

```bash
node -v
npm -v
```

## 2. Download the code

```bash
git clone <your-repo-url>
cd toopphotos19-project
npm install
```

`npm install` also runs `prisma generate` automatically.

## 3. Create your free database (Neon)

1. Go to https://neon.tech and sign up (free).
2. Click **Create Project**. Pick any name and region.
3. On the project dashboard, find the **Connection string** (it looks like
   `postgresql://user:pass@host/db?sslmode=require`).
4. Copy it. You will paste it in the next step.

## 4. Set up environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env
```

Open `.env` and set, at minimum:

- `DATABASE_URL` — the Neon connection string from step 3.
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` and paste the output.
- `NEXTAUTH_URL` — keep `http://localhost:3000` for local development.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — your future admin login.

Cloudinary and Resend can stay blank for now; uploads/email come in later steps.

## 5. Create the database tables

```bash
npm run db:push
```

This reads `prisma/schema.prisma` and creates every table (services, doctors,
bookings, etc.) in your Neon database.

## 6. Seed starter data + admin account

```bash
npm run db:seed
```

This creates your admin user (from `.env`), default homepage settings, and a
sample service so the site is not empty.

## 7. Run the site

```bash
npm run dev
```

Open http://localhost:3000 — you should see the **“Scaffold Ready”** page.

## What you have after this step

- A running Next.js app.
- A complete database schema for the entire CMS (every page/entity you listed).
- An admin user and default settings seeded.

## What comes next

- **MR2:** Animated premium homepage + site header/footer.
- **MR3+:** Services, doctors, technologies, blog, gallery, bookings, careers.
- **MR7:** The full admin dashboard to manage everything without code.

## Data model overview

Every entity you requested already exists in `prisma/schema.prisma`:

- `Service`, `Technology`, `Doctor`, `Testimonial` — listing + dynamic detail pages
- `BlogPost`, `GalleryImage`, `Faq`
- `Booking` (appointments, with status: Pending/Approved/Rejected/Rescheduled)
- `Job` + `Application` (careers, with status + resume upload)
- `SiteSetting` — hero, stats, contact info, social links, default SEO
- `User` — admin accounts
