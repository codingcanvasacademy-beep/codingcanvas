# Phase 4.3 Plan: Authentication & Head Admin Portal

## Architecture & Tech Stack

- **Database & Auth:** Supabase. We are transitioning to a production-ready cloud backend.
- **AI Verification:** Google Gemini for AI-driven password strength judgement during the verification flow.
- **Roles:** `HEAD_ADMIN`, `TEACHER`, `STUDENT`.
- **Pre-Account:** `codingcanvasacademy@gmail.com` | `qwertyuiop12345` (Role: `HEAD_ADMIN`).

## Implementation Steps

### 1. Supabase Initialization
- Install `@supabase/supabase-js`.
- Define `.env.local` requirements (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Create `src/lib/supabase.ts` client.

### 2. Login Flow (The Universal Door)
- Update `/login` to act as the universal entry point.
- **Step 1:** Enter Email to receive OTP.
- **Step 2:** Verify OTP.
- **Step 3 (If new account/password reset):** Ask for a password. Use a real-time call to the `/api/ai` route to judge if the password is "Weak", "Medium", or "Strong".
- **Redirection:** Upon success, automatically route the user based on their database role.

### 3. The Hidden Admin Portal
- When `codingcanvasacademy@gmail.com` logs in, they are redirected to their dashboard.
- The UI will seem normal at the surface (login screen), but the post-login experience will provide God-mode privileges.
- **Features:**
  - Manually create Teacher accounts (Option fixed at the top of the portal).
  - View "Free Class Requests" directly from Supabase.
  - View all teachers and explicitly force sign-out/revoke their sessions.
