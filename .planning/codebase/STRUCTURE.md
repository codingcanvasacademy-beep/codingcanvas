# Structure

### `/src/app/`
- `/admin`: Instructor "God Mode" portal. Dashboard logic.
- `/blocks`: Scratch-style Block/Python converter sandbox.
- `/login`: Unified dual Auth entrypoint.
- `/student`: Student portal and dashboard.
  - `/student/compiler`: Professional Web-based IDE + AI assistant.
  - `/student/[class_id]`: Specific class workspaces.
- `/teacher/classroom/`: Virtual class spaces, streaming areas.
- `/api/ai/`: Centralized API Route for Google Gemini processing.

### `/src/components/`
- Component Library holding pure React UI chunks.
- Heavily styled with Tailwind blocks and `framer-motion` definitions.
- e.g., `<Navigation />`, `<AISupportChat />`.

### `/src/utils/supabase/`
- Prebuilt SSR configurations `server.ts` and `client.ts` to interface cookies securely between Supabase backend and Next.js frontend without losing auth posture.

### `/.planning/`
- System directories hosting historical artifacts, guidelines, GSD workflows, and current application plans.
