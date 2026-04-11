# Phase 4 Plan: Launch & Final Deployment

Finalizing the production environment and deploying CodingCanvas to the public web.

## 1. Context & Objectives
- **Phase:** 4
- **Goal:** site is live on a custom domain (or vercel.app) with no blockers for public visitors.
- **Requirements Covered:** PLAT-01 - PLAT-05 (Verification), Platform Health, Deployment.

## 2. Tasks

### Step 1: Remove Homepage Auth Gate
- [ ] Remove the `useEffect` redirect to `/admin` in `src/app/HomeClient.tsx` that forces an admin-only view.
- [ ] Ensure the homepage (`/`) is fully accessible to unauthenticated users.

### Step 2: Vercel Project Preparation
- [ ] Link the project to Vercel using `mcp_vercel_list_projects` and `mcp_vercel_get_project` (or create if missing).
- [ ] Configure environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GOOGLE_AI_API_KEY`
  - `NEXT_PUBLIC_IS_ADMIN_ONLY=false` (to ensure public mode is on)

### Step 3: Production Build & Deployment
- [ ] Run a final local `npm run build` to ensure no last-minute regressions.
- [ ] Trigger a Vercel deployment using `mcp_vercel_deploy_to_vercel`.

### Step 4: Verification & Smoke Test
- [ ] Verify the live URL has no console errors.
- [ ] Submit a "Free Class Request" on the live site.
- [ ] Confirm request appears in the Admin Portal (authenticated).
- [ ] Check mobile responsiveness on the live URL.

## 3. Verification criteria (UAT)
1. Homepage is visible without login.
2. Vercel deployment status is "Ready".
3. Booking form works on the production domain.
4. AI Support Chat works on the production domain.
