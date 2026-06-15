# Dr. Afrooz Purarjomand — Personal Brand Website

Personal branding + paid AI-consulting booking site for Dr. Afrooz Purarjomand.
Built strictly to the brand guide (electric-blue / midnight / deep-violet, dark
theme, Inter/Helvetica, "Where research meets reality").

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** with the brand palette baked into `tailwind.config.ts`
- **Supabase** — Postgres + Auth (email/password) + RLS
- **Stripe** — secure payment before a booking is confirmed
- **Resend** — transactional email (booking confirmation, contact)
- **Google Calendar + Meet** — auto-creates the session + video link
- **Vercel** — hosting + cron jobs

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in keys (optional for preview)
npm run dev                  # http://localhost:3000
```

The site is built to **render fully in preview with no keys**: services come
from brand fallback data, booking shows demo slots, and "Continue to payment"
simulates a successful booking. Wire up the services below to go live.

## Going live — fill in `.env.local` (and Vercel env vars)

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (keep secret) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe dashboard |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | resend.com |
| `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN` | Google Cloud Console |
| `CRON_SECRET` | `openssl rand -hex 32` |

### Database

Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor. It creates
all tables, RLS policies, the signup trigger, and seeds the three launch
services. To grant yourself admin, in Supabase set the user's
`app_metadata.role` to `"admin"`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. vercel.com → **Add New → Project** → import the repo (framework auto-detects
   as Next.js).
3. Add the env vars above under **Settings → Environment Variables**.
4. Deploy. Cron jobs in `vercel.json` register automatically.
5. Point the Stripe webhook at `https://<your-domain>/api/webhooks/stripe`.

## Structure

```
app/            routes (marketing, auth, booking, dashboard, admin, api)
components/      UI primitives, site chrome, auth + booking forms
lib/            supabase, stripe, email, google, booking, services, content
content/insights MDX blog posts
supabase/       SQL migrations
```
