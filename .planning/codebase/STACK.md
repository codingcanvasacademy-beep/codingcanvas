# Stack

**Core Framework**:
- React 19
- Next.js 16 (App Router)
- Next.js Turbopack
- TypeScript

**Styling**:
- Tailwind CSS
- framer-motion (Animations)
- lucide-react (Icons)
- Custom CSS Variables (in `globals.css`) for Design System

**Data & Backend**:
- Supabase (PostgreSQL Database)
- Supabase Auth (OTP and Password mechanisms)
- Supabase RLS (Row Level Security) Policies

**Specialized Client Libraries**:
- Google Blockly (`blockly_compressed.js`, `python_compressed.js`) for Visual Programming
- Pyodide v0.26.2 (Client-side WebAssembly Python Execution)
- HTML5 Canvas API (for collaborative/drawing workspaces)

**AI & Generative Tools**:
- Google Gemini API (used in `src/app/api/ai/route.ts`)
- Model Variants: Gemini 3 Flash, Gemini 3 Pro

**Deployment & Infrastructure**:
- Vercel Hosting
- Next.js Edge / Serverless deployment
