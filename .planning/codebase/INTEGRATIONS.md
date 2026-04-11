# Integrations

### Supabase
- URL/Key bound through `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Usage: `@supabase/ssr` to configure SSR client tools in `src/utils/supabase/server.ts` and `src/utils/supabase/client.ts`.
- Core features: Authentication (JWT evaluation via Middleware), profiles data retrieval, bookings storage. 

### Google Gemini API
- URL/Key bound through `GOOGLE_AI_API_KEY`.
- Usage: Fetched server-side via `/api/ai`. 
- Core modules:
  - `block_generator`: Converts student requests into custom Blockly code blocks dynamically.
  - Chat/Tutor Support (`/student/compiler`, `/student`, `<AISupportChat />`).
  - Scheduling and meeting summary ingestion (`/teacher/classroom/meeting/[id]`).

### Vercel
- Managed deployment. Next.js natively builds to edge. Relies on standard Next.js environmental setup. Usage of Client components require explicit isolation (`ssr: false` inside `next/dynamic` when using Pyodide/Blockly to avoid SSR hydrate clashes).
