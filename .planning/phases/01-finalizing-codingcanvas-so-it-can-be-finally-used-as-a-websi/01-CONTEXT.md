# Phase 1 — Context

## Decisions

### Navigation
- **Remove** the "Main Host Portal (Admin)" link from the public navbar entirely
- **Remove** the standalone "Log In" link from the public navbar (admin uses URL-direct access)
- **Add** nav links: `Curriculum`, `Pricing`, `About` — all smooth-scroll anchors (`#curriculum`, `#pricing`, `#about`) pointing to sections Phase 2 will build
- **Keep** the "Book Free Class" CTA button in the navbar — it already works

### Admin Access
- Admin portal remains at `/admin` (unchanged code)
- No public link anywhere on the website points to `/admin`
- Admin is accessed by typing the URL directly: `localhost:3000/admin` (dev) or `yourdomain.in/admin` (prod)
- The page is already auth-protected via Supabase (admin role only)
- **Docker admin:** Create a `docker-compose.admin.yml` that runs the full Next.js app locally so admin can be used via Docker Desktop without needing Node/npm installed
  - Command: `docker compose -f docker-compose.admin.yml up`
  - Port: localhost:3000
  - Include all required env vars via `.env.local` mount

### Hero Section
- **Remove** the "5,000+ young innovators" false social proof line entirely
- Do NOT replace with anything — keep the hero clean for now
- No other changes to hero copy in Phase 1

### Footer
- Fix "Curriculum" link: `#features` → `#curriculum` (will work when Phase 2 adds the section)
- Fix "Contact" link: `#book` → WhatsApp direct link (`https://wa.me/91XXXXXXXXXX` — planner to substitute actual number)
- Remove any "For Teachers" or admin-pointing links from the footer
- Footer copyright and branding stays as-is

## Canonical Refs

- `src/components/Navigation.tsx` — public navbar (32 lines, simple — edit directly)
- `src/app/page.tsx` — homepage (290 lines — contains hero, CTA, footer)
- `src/app/layout.tsx` — root layout (Navigation component imported here)

## Deferred Ideas

- **Docker airgapped admin** (partial scope in Phase 1 — Docker compose for local admin)
- **Full Docker production admin** (separate Phase 3+ concern — Docker for remote isolated deployment)
- **Admin login completely removed from public site** AND hosted as separate Vercel project — future milestone

## Notes

- WhatsApp number for the contact link needs to be confirmed — planner should prompt or use a placeholder
- Phase 2 will add the `#curriculum`, `#pricing`, `#about` sections the Phase 1 nav anchors point to
- No design changes in Phase 1 — colors, fonts, card styles all stay the same
