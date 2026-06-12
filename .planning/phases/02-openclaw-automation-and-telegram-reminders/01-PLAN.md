---
phase: "02"
name: "OpenClaw Automation & Telegram Reminders"
status: "planning"
created_at: "2026-04-14"
---

# Phase 02 Plan — OpenClaw & Telegram Reminders

## 1. Overview
Migrate automation from Hugging Face n8n to a native Next.js/Vercel solution. Build "OpenClaw," a chill AI agent that sends Telegram notifications for new website activity within specific IST time windows.

## 2. Tasks

### Task 1 — Secure MCP Endpoint
- **File:** `src/app/api/mcp/messages/route.ts`
- **Logic:** 
  - GET endpoint to return unprocessed rows from `contact_submissions` and `telemetry`.
  - Auth check: Must have `x-mcp-token` header matching `INTERNAL_BOT_TOKEN`.
  - Returns JSON array of activity.

### Task 2 — Telegram Notification Utility
- **File:** `src/utils/automation/telegram.ts`
- **Logic:**
  - `sendTelegramMessage(text: string)` helper.
  - Uses `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
  - Handles basic error logging.

### Task 3 — OpenClaw Brain (Scheduling & Timezones)
- **File:** `src/app/api/automation/openclaw/route.ts`
- **Logic:**
  - Main orchestrator called by Cron.
  - Calculate current IST time from UTC (`new Date()`).
  - **Hours Logic:** 
    - If 10:00 <= IST <= 18:59: Process messages immediately.
    - If IST >= 19:00 or IST < 10:00: Exit early (Hold).
  - **Persona:** Transform notification data into chill, vibing text (e.g., "Yo Vaibh, someone just booked a class! ✨").
  - **Persistence:** Mark message as `notified: true` in Supabase after successful Telegram send.

### Task 4 — Vercel Cron Configuration
- **File:** `vercel.json`
- **Logic:**
  - Add `crons` array.
  - Path: `/api/automation/openclaw`.
  - Schedule: `*/10 * * * *` (Every 10 minutes).

## 3. Verification Plans
- **Test 1:** Manually trigger `/api/mcp/messages` with the token to ensure it returns data.
- **Test 2:** Manually trigger `/api/automation/openclaw` and check Telegram for a "chill" notification.
- **Test 3:** Verify that once notified, the message is marked as such in Supabase (no duplicates).
- **Test 4:** Test time window logic by temporarily spoofing the current time in code.

## 4. Required Secrets (.env.local)
- `TELEGRAM_BOT_TOKEN` (Provided)
- `TELEGRAM_CHAT_ID` (Provided)
- `INTERNAL_BOT_TOKEN` (Generated)
