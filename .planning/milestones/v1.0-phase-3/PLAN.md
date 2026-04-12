# Phase 3: SEO, Performance & Platform Health

Optimizing the site for search discovery, social sharing, and ensuring all interactive platform features (Blockly, AI, Portals) are robust and error-free.

## 1. SEO & Meta Tags
- **Dynamic Metadata**: Implement unique page titles and descriptions for all routes.
- **Social Sharing**: Configure `og:image` and `twitter:card`.
- **Semantic HTML**: Audit and fix heading hierarchies (h1 -> h2 -> h3).

## 2. Platform Reliability (QA)
- **Blockly Sandbox**: Verify scripts load and code runs correctly via Pyodide.
- **AI Support**: Verify FAQ injection from Supabase works in the frontend chat.
- **Booking Flow**: Verify `free_class_requests` show up in Admin portal.
- **Teacher/Admin Access**: Ensure portals are accessible (with Demo Mode where applicable).

## 3. Implementation Steps

### Step 1: SEO Optimization
- [x] Update `src/app/layout.tsx` for global metadata and social tags.
- [x] Add `export const metadata` to `src/app/page.tsx` (Homepage).
- [x] Add metadata to `src/app/blocks/page.tsx`, `src/app/login/page.tsx`, etc.
- [x] Generate and set an `og-image.png` in `public/`.

### Step 2: Semantic HTML & Accessibility
- [x] Audit `src/app/page.tsx` for heading hierarchy.
- [x] Ensure all buttons have descriptive labels.

### Step 3: Platform & Build Audit
- [x] Verify `GOOGLE_AI_API_KEY` status and AI chat functionality.
- [x] Test the "Free Class Request" submission and Admin Dashboard check.
- [x] Run `npm run build` to check for build-time errors (Supabase types, dynamic imports).

## 4. Verification (UAT Criteria)
1. Browser tab shows unique titles for Home, Admin, and Blocks Lab.
2. `og:image` is present in HTML head.
3. Blockly sandbox runs `print("Hello World")` successfully.
4. "Free Class Request" appears in Admin portal "Trial Bookings" section.
5. All external links in the footer are functional.
6. Local build completes without failures.
