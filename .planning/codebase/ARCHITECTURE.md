# Architecture

### Global Architecture
CodingCanvas is built on the **Server-Side Rendered (SSR) + Client Hydration** paradigm provided by Next.js App Router. State management leverages React's context and standard hooks where interactive, while data hydration uses Server Components to fetch and pass data deeply into trees before sending HTML.

### Routing & Middleware
The app uses a strict Next.js Middleware (`src/middleware.ts` mapped often as `proxy.ts` or internal server file mapping middleware) to isolate route spaces:
- `/admin` requires validated host/admin permissions.
- `/teacher` requires verified instructor roles based on the database profile check.
- `/student` ensures proper enrolment logic.
Unauthenticated users are forcefully blocked from all protected spaces dynamically on the Edge.

### Authentication Flow
Dual verification strategy implemented due to Supabase Auth limits:
- Standard password-based Auth (`supabase.auth.signInWithPassword`).
- Token magic links.
- Upon successful authentication, a browser hard-refresh (`window.location.href`) is executed to aggressively bypass Next.js client-router cache-poisoning mechanics.

### AI Proxy Layer 
All external Google Gemini queries pass through an internal Proxy boundary `/api/ai/route.ts` as a `POST` request. This obscures the API key out of the browser and gives a unified space to format prompt structures according to `mode` (e.g. `block_generator`, `support`).

### Edge Processing 
Heavy lifting processing modules like Python code execution are deliberately **not** sent to a server; instead, they are pushed entirely to the client's WebAssembly sandbox via Pyodide (`BlocksLabClient`). This saves incredible server load and scales natively.
