---
phase: "01"
plan: "01"
status: completed
completed_at: "2026-04-12"
---

# Phase 01 — Plan 01 Summary: Cloud Execution Engine & Integrations

## What Was Built

All 4 tasks executed successfully in a single wave.

### Task 1 — AI Help Robot (Hugging Face)
- Extended `src/app/api/ai/route.ts` with a `huggingface` mode that calls the Mistral-7B Instruct model via the HF Inference API
- Google Gemini remains the primary engine; HF is a secondary/alternative provider
- Added `HUGGINGFACE_API_KEY` to `.env.example`

### Task 2 — HF Docker Space Sandbox Engine (`hf-space/`)
- `hf-space/app.py` — FastAPI server with `POST /run` endpoint; executes Python in a subprocess with 15s timeout
- Visual lib support: matplotlib (auto-saves to PNG, returns as base64), turtle (Xvfb capture), pygame (headless SDL2)
- `hf-space/Dockerfile` — Python 3.10, installs `xvfb`, `python3-tk`, SDL2, ghostscript, non-root user
- `hf-space/requirements.txt` — fastapi, uvicorn, matplotlib, pygame, pillow, numpy

### Task 3 — Auto-Save & Cloud Execution Frontend
- Fully rewrote `src/app/student/compiler/page.tsx`
- Auto-save: `useEffect` + 1500ms debounce → `supabase.from('student_progress').upsert()`
- On mount: loads previously saved code from Supabase
- Run: `fetch(NEXT_PUBLIC_HF_SPACE_URL/run)` → shows stdout/stderr/image output
- Telemetry: fire-and-forget `fetch('/api/telemetry')` after each run

### Task 4 — n8n Telemetry & Booking Webhook
- Created `src/app/api/telemetry/route.ts` — receives student execution events → forwards to `N8N_WEBHOOK_URL`
- Created `src/app/api/contact/route.ts` — saves bookings to Supabase + notifies n8n for Gmail alerts
- Updated `HomeClient.tsx` booking form to call `/api/contact` (server-side) instead of writing Supabase directly from client

### Database
- Created `student_progress` table in Supabase with RLS policy (each user owns their own row)

## Key Files Created/Modified
- `hf-space/app.py` (new)
- `hf-space/Dockerfile` (new)
- `hf-space/requirements.txt` (new)
- `.env.example` (new)
- `src/app/api/ai/route.ts` (modified)
- `src/app/api/contact/route.ts` (new)
- `src/app/api/telemetry/route.ts` (new)
- `src/app/student/compiler/page.tsx` (rewritten)
- `src/app/HomeClient.tsx` (modified)

## Acceptance Criteria — All Pass ✅
- `.env.example` contains `HUGGINGFACE_API_KEY` ✅
- `.env.example` contains `N8N_WEBHOOK_URL` ✅
- `ai/route.ts` contains `huggingface` ✅
- `hf-space/app.py` contains `FastAPI` ✅
- `hf-space/Dockerfile` contains `xvfb` ✅
- `hf-space/requirements.txt` contains `pygame` ✅
- `compiler/page.tsx` contains `fetch` ✅
- `compiler/page.tsx` contains `setTimeout` (debounce) ✅
- `compiler/page.tsx` contains `supabase` ✅
- `telemetry/route.ts` contains `N8N_WEBHOOK_URL` ✅
- `contact/route.ts` contains `N8N_WEBHOOK_URL` ✅

## Issues Encountered
None. TypeScript compiled clean (`tsc --noEmit` exit 0).

## Next Steps for User
1. **Deploy HF Space**: Push `hf-space/` to a Hugging Face Docker Space, copy the URL
2. **Set env vars** in Vercel:
   - `NEXT_PUBLIC_HF_SPACE_URL` = your HF Space URL
   - `HUGGINGFACE_API_KEY` = your HF API key
   - `N8N_WEBHOOK_URL` = your n8n webhook URL
3. **Configure n8n**: Create a workflow triggered by webhook to send Gmail notifications (bookings) and classify student telemetry
