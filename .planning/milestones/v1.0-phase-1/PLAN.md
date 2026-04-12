# Phase 1 Plan — Navigation & Brand Foundation

## Overview
This phase focuses on professionalizing the public appearance of CodingCanvas by removing internal links, fixing broken navigation, and setting up a local Docker-based admin environment.

## Requirements
- **NAV-01**: Remove "Main Host Portal (Admin)" from nav.
- **NAV-02**: Remove specific admin/login links from footer.
- **NAV-03**: Add placeholder nav anchors (Curriculum, Pricing, About).
- **HOME-08**: Remove false "5,000 students" claim from hero.
- **FOOT-01**: Fix broken footer anchors.
- **FOOT-02**: Replace footer Contact with WhatsApp direct link.
- **DOC-01**: Create Docker Admin setup for local use.

## User Review Required
> [!IMPORTANT]
> - WhatsApp number is currently a placeholder (`+91XXXXXXXXXX`). Please update this during execution if available.
> - Nav links (Curriculum, Pricing) will be added as #anchors but won't point to content until Phase 2 builds those sections.

---

## Plan 1: Navigation Component Cleanup
**File:** `src/components/Navigation.tsx`

### Proposed Changes
- Remove the `Link` item for "Main Host Portal (Admin)".
- Remove any "Log In" or "Sign In" buttons/links that point to `/login` or `/admin`.
- Add new nav items:
  - `Curriculum` -> `#curriculum`
  - `Pricing` -> `#pricing`
  - `About` -> `#about`
- Ensure "Book Free Class" button remains as the primary CTA.

---

## Plan 2: Hero & Footer Cleanup
**File:** `src/app/page.tsx`

### Proposed Changes
- **Hero:** Locate and delete the line/span containing "5,000+ young innovators" and replace with empty space or a clean subtitle if it exists.
- **Footer:**
  - Update "Curriculum" link to `#curriculum`.
  - Update "Contact" or "Support" link to `https://wa.me/91XXXXXXXXXX` (WhatsApp).
  - Search for and remove any visible links to the Admin portal or Host login in the footer sections.

---

## Plan 3: Docker Admin Setup
**File:** `docker-compose.admin.yml` (New Root File)

### Proposed Changes
- Create a `docker-compose.admin.yml` file.
- Configure a service named `codingcanvas-admin`.
- Use `node:20-alpine` (matching Next.js reqs).
- Command: `npm install && npm run dev`.
- Port: Map `3000:3000`.
- Volumes:
  - Mount current directory to `/app`.
  - Mount `.env.local` to `/app/.env.local`.
- Instruction: This allows running the admin portal locally without polluting the host OS, accessible at `localhost:3000`.

---

## Verification Plan
### Automated Tests
- None required for this UI cleanup phase.

### Manual Verification
- [ ] Run `npm run dev` and verify "Main Host Portal" is gone from Navbar.
- [ ] Verify Navbar has "Curriculum", "Pricing", "About" links.
- [ ] Verify "5,000+ students" is gone from Hero.
- [ ] Verify Footer "Contact" link goes to a WhatsApp URL.
- [ ] Run `docker compose -f docker-compose.admin.yml up` and check if `localhost:3000` loads the site.
