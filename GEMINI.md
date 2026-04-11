<!-- GSD:project-start source:PROJECT.md -->
## Project

**CodingCanvas — Project Context**

CodingCanvas is a live-online Python coding academy for kids, targeting parents of children aged roughly 6–14 years. The platform combines a drag-and-drop Blockly sandbox with real Python compilation, live video classes with teachers, and an AI support chatbot. The business runs on a ₹2,000 / 8-class package model with a free first class to convert discovery traffic into paying students.

**Current state:** 2 paying students. The app runs on Next.js 16 + Supabase + Vercel. A codebase map exists in `.planning/codebase/`. Core technical infrastructure (auth, DB, AI proxy, video meetings, admin portal) works. The public-facing website is incomplete and looks unprofessional to new visitors.

**Launch definition:** A .com or .in domain going live with a polished, trust-building homepage that converts browsing parents into free-trial bookings.

---

**Core Value:** > Get parents of young kids to trust CodingCanvas enough to book a free trial class.

Every design and feature decision must serve this one goal.

---
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

- React 19
- Next.js 16 (App Router)
- Next.js Turbopack
- TypeScript
- Tailwind CSS
- framer-motion (Animations)
- lucide-react (Icons)
- Custom CSS Variables (in `globals.css`) for Design System
- Supabase (PostgreSQL Database)
- Supabase Auth (OTP and Password mechanisms)
- Supabase RLS (Row Level Security) Policies
- Google Blockly (`blockly_compressed.js`, `python_compressed.js`) for Visual Programming
- Pyodide v0.26.2 (Client-side WebAssembly Python Execution)
- HTML5 Canvas API (for collaborative/drawing workspaces)
- Google Gemini API (used in `src/app/api/ai/route.ts`)
- Model Variants: Gemini 3 Flash, Gemini 3 Pro
- Vercel Hosting
- Next.js Edge / Serverless deployment
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

### React Server Framework Native Rules
### Tailwind & Stitch Styling
### Security & Routing 
- Never perform `router.push('/xyz')` after Auth confirmation if previously encountering HTTP 401s dynamically; instead, force a `window.location.href = "/xyz"` redirect to guarantee Next.js caching memory dumps out the rejected routes cleanly.
- Keep the `api` layer purely functional and handle parameter validation stringently; do not leak backend structural definitions to the user context.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

### Global Architecture
### Routing & Middleware
- `/admin` requires validated host/admin permissions.
- `/teacher` requires verified instructor roles based on the database profile check.
- `/student` ensures proper enrolment logic.
### Authentication Flow
- Standard password-based Auth (`supabase.auth.signInWithPassword`).
- Token magic links.
- Upon successful authentication, a browser hard-refresh (`window.location.href`) is executed to aggressively bypass Next.js client-router cache-poisoning mechanics.
### AI Proxy Layer 
### Edge Processing 
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| codebase-mapper | Analyzes existing codebases to understand structure, patterns, and technical debt | `.agents/skills/codebase-mapper/SKILL.md` |
| context-compressor | Strategies for compressing context to maximize token efficiency | `.agents/skills/context-compressor/SKILL.md` |
| context-fetch | Search-first skill to reduce unnecessary file reads by searching before loading | `.agents/skills/context-fetch/SKILL.md` |
| context-health-monitor | Monitors context complexity and triggers state dumps before quality degrades | `.agents/skills/context-health-monitor/SKILL.md` |
| debugger | Systematic debugging with persistent state and fresh context advantages | `.agents/skills/debugger/SKILL.md` |
| empirical-validation | Requires proof before marking work complete — no "trust me, it works" | `.agents/skills/empirical-validation/SKILL.md` |
| executor | Executes GSD plans with atomic commits, deviation handling, checkpoint protocols, and state management | `.agents/skills/executor/SKILL.md` |
| plan-checker | Validates plans before execution to catch issues early | `.agents/skills/plan-checker/SKILL.md` |
| planner | Creates executable phase plans with task breakdown, dependency analysis, and goal-backward verification | `.agents/skills/planner/SKILL.md` |
| supabase | "Use when doing ANY task involving Supabase. Triggers: Supabase products (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues); client libraries and SSR integrations (supabase-js, @supabase/ssr) in Next.js, React, SvelteKit, Astro, Remix; auth issues (login, logout, sessions, JWT, cookies, getSession, getUser, getClaims, RLS); Supabase CLI or MCP server; schema changes, migrations, security audits, Postgres extensions (pg_graphql, pg_cron, pg_vector)." | `.agents/skills/supabase/SKILL.md` |
| supabase-postgres-best-practices | Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations. | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| token-budget | Manages token budget estimation and tracking to prevent context overflow | `.agents/skills/token-budget/SKILL.md` |
| verifier | Validates implemented work against spec requirements with empirical evidence | `.agents/skills/verifier/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
