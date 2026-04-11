# SPEC.md — Project Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: No code may be written until this spec is marked `FINALIZED`.

## Vision
CodingCanvas is a premium, production-ready educational platform designed to teach kids Python through a visual, Scratch-like interface. It bridges the gap between block-based logic and real-world Python code using Google Blockly and Pyodide, guided by integrated AI tutors.

## Goals
1. **Interactive Learning** — Provide a seamless Google Blockly interface for visual programming.
2. **Real Python Execution** — Execute Python code directly in the browser using Pyodide (WebAssembly).
3. **AI-Powered Mentorship** — Integrate Gemma-powered AI for custom block generation and interactive student support.
4. **Professional Branding** — Establish a playful yet premium "CodingCanvas" brand with custom UI components.

## Non-Goals (Out of Scope)
- Developing a custom block-to-code compiler from scratch (using Blockly defaults).
- Server-side Python execution (for security and cost).
- Full Learning Management System (LMS) with gradebooks (focusing on the sandbox).

## Constraints
- **Browser-Only Execution**: All Python code must run client-side via Pyodide.
- **API Tier**: Operating within Google AI API free-tier limits.
- **Framework**: Built with Next.js (App Router) and Tailwind CSS.

## Success Criteria
- [x] Integrate Google Blockly with custom Python generator.
- [x] Successful Python execution via Pyodide in the "Blocks Lab".
- [x] Functional AI Block Generator for teachers.
- [x] Global AI Support Chat widget active.
- [ ] UI alignment with Stitch-generated "Premium" designs.
- [ ] Production deployment on Vercel with environment variable security.

## User Stories

### As a Student
- I want to drag and drop logic blocks so that I can learn coding concepts without typing errors.
- I want to see how my blocks turn into Python code so that I can transition to text-based coding.
- I want to run my code instantly to see the results.

### As a Teacher
- I want to describe a custom block in plain English so that the AI can generate its functionality for me.
- I want to help my students through an AI-powered assistant when I'm not available.

## Technical Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Google Blockly | Must-have | Core visual engine |
| Pyodide | Must-have | WASM Python environment |
| Google Generative AI | Must-have | Gemma-powered AI features |
| Next.js / Tailwind | Must-have | Modern web stack |
| Vercel Deployment | Must-have | Hosting and CI/CD |

---

*Last updated: 2026-04-11*
