---
phase: "02"
name: "OpenClaw Automation & Telegram Reminders"
status: "scoped"
created_at: "2026-04-14"
---

# Phase 02 Context — OpenClaw & Telegram Reminders

## 1. Objective
Build a custom AI automation system ("OpenClaw") that monitors the CodingCanvas website for new bookings/messages and sends "chill, vibing" reminders to the owner via Telegram.

## 2. Infrastructure Decisions
- **Hosting:** **Next.js API Routes (Vercel)** and **Supabase**. We are avoiding separate hosting providers (like Railway) to bypass credit card/adult verification requirements.
- **Scheduling:** Use **Vercel Cron Jobs** (configured in `vercel.json`) to trigger the automation every 10 minutes.
- **Notification Channel:** **Telegram**. OpenClaw will send messages to a specific Telegram Chat ID.
- **Bot Persona:** A chill, vibing assistant. Not formal.

## 3. Automation Logic (The "Schedule")
- **Frequency:** Every 10 minutes.
- **Time Window (IST):**
    - **Active:** 10:00 AM IST to 7:00 PM IST.
    - **Hold:** If a message arrives after 7:00 PM IST, the notification should be queued/held until **10:00 AM IST** the following day.
    - **Process:** The bot must check "new" messages (unprocessed) in Supabase.

## 4. MCP Integration
- Build a secure **MCP Endpoint** (`/api/mcp/messages`) on the website.
- This endpoint allows the OpenClaw logic (and potentially future agents) to query the database for user messages, bookings, and telemetry.
- **Security:** Use a custom header/secret key (`INTERNAL_BOT_TOKEN`) to ensure only our bot can access this data.

## 5. Implementation Steps
- [ ] Create `src/app/api/automation/openclaw/route.ts` as the main brain.
- [ ] Configure `vercel.json` with the cron schedule.
- [ ] Implement IST time checking logic and "Hold" state in the database/KV.
- [ ] Create/Configure a Telegram Bot and integrate with the API.
- [ ] Implement the "Chill/Vibe" system for notification text generation.

## 6. Known Constraints
- No new hosting accounts requiring credit cards.
- Must handle Timezone offsets correctly (Server is UTC, Local is IST +5:30).
- Must avoid duplicate notifications for the same message.
