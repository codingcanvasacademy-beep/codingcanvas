---
wave: 1
depends_on: []
files_modified:
  - src/app/api/ai/route.ts
  - src/app/api/contact/route.ts
  - src/app/api/telemetry/route.ts
  - src/app/student/compiler/page.tsx
  - hf-space/Dockerfile
  - hf-space/app.py
  - hf-space/requirements.txt
  - .env.example
autonomous: false
---

# Phase 1: Cloud Execution & Integrations

## Goal
Build a sandboxed cloud execution engine using Hugging Face Docker Spaces and Supabase, with n8n for Gmail notifications and student telemetry.

## Verification
- `grep -q "N8N_WEBHOOK_URL" .env.example`
- `grep -q "HUGGINGFACE_API_KEY" .env.example`
- `src/app/student/compiler/page.tsx` contains Supabase auto-save logic.
- `src/app/student/compiler/page.tsx` fetches from Hugging Face Space.
- `hf-space/app.py` exposes a `/run` FastAPI endpoint.

## Tasks

```xml
<task>
  <id>1</id>
  <title>Setup AI Help Robot (Hugging Face API)</title>
  <description>Implement the 24/7 help robot using Hugging Face's Inference API to replace OpenAI proxy if needed or just add it alongside.</description>
  <read_first>
    - src/app/api/ai/route.ts
    - .env.example
  </read_first>
  <action>
    1. Add `HUGGINGFACE_API_KEY=` to `.env.example`.
    2. Overwrite `src/app/api/ai/route.ts` to use `@huggingface/inference` to power the AI chatbot.
  </action>
  <acceptance_criteria>
    - `src/app/api/ai/route.ts contains huggingface`
    - `.env.example contains HUGGINGFACE_API_KEY`
  </acceptance_criteria>
</task>

<task>
  <id>2</id>
  <title>Setup Hugging Face Docker Space Sandbox Engine</title>
  <description>Create the directory and files needed to deploy a custom Python execution sandbox on Hugging Face Spaces using FastAPI.</description>
  <read_first>
    - .env.example
  </read_first>
  <action>
    1. Create `hf-space/app.py` containing a FastAPI app with a `POST /run` that receives python code and runs it securely using `subprocess` capturing stdout and stderr.
    2. Create `hf-space/requirements.txt` with `fastapi`, `uvicorn`, `matplotlib`, `pygame`, `turtle`.
    3. Create `hf-space/Dockerfile` installing Python 3.10 and necessary headless rendering packages (`xvfb`, `python3-tk`) required for turtle/pygame on Linux.
  </action>
  <acceptance_criteria>
    - `hf-space/app.py contains FastAPI`
    - `hf-space/Dockerfile contains xvfb`
    - `hf-space/requirements.txt contains pygame`
  </acceptance_criteria>
</task>

<task>
  <id>3</id>
  <title>Implement Auto-Save & Cloud Execution in Frontend</title>
  <description>Update the student compiler page to connect to the new Hugging Face Space endpoint and auto-save code to Supabase.</description>
  <read_first>
    - src/app/student/compiler/page.tsx
  </read_first>
  <action>
    1. Check for `NEXT_PUBLIC_HF_SPACE_URL=` in environment processing. Add a fetch call to it when clicking "Run".
    2. Add a `useEffect` hook with a debounce. On code change, call `supabase.from('student_progress').upsert({ code })`.
    3. Render the execution output correctly in the UI.
  </action>
  <acceptance_criteria>
    - `src/app/student/compiler/page.tsx contains fetch`
    - `src/app/student/compiler/page.tsx contains setTimeout`
    - `src/app/student/compiler/page.tsx contains supabase`
  </acceptance_criteria>
</task>

<task>
  <id>4</id>
  <title>Configure n8n Telemetry and Booking Webhook</title>
  <description>Send alerts to n8n for bookings and student telemetry.</description>
  <read_first>
    - src/app/api/contact/route.ts
  </read_first>
  <action>
    1. Create `src/app/api/telemetry/route.ts` which receives student stats (errors vs success) and makes a `POST` to `N8N_WEBHOOK_URL`.
    2. Add `fetch(N8N_WEBHOOK_URL, ...)` to `src/app/api/contact/route.ts`.
  </action>
  <acceptance_criteria>
    - `src/app/api/telemetry/route.ts contains N8N_WEBHOOK_URL`
    - `src/app/api/contact/route.ts contains N8N_WEBHOOK_URL`
  </acceptance_criteria>
</task>
```
